import { linkFormValues } from "@/schemas/linkSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export function useCreateLink() {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: linkFormValues) => {
      return axios.post("/api/links", data)
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

  return { mutate, isPending }
}