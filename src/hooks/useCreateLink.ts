"use client";

import { linkFormValues } from "@/schemas/linkSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useCreateLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: linkFormValues) => {
      const response = await axios.post("/api/links", data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["links"] })
      toast.success("Link created successfully")
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to create link"
      toast.error(message)
    },
  })
}