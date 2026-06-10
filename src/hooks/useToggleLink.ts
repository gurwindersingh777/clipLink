"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useToggleLink() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.patch(`/api/links/${id}`)
      return response.data
    },
    onSuccess: () => {
      toast.success("Status Updated!");
      queryClient.invalidateQueries({ queryKey: ["links"] })
    },
    onError: (error) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Something went wrong"
      toast.error(message);
    }
  })
}