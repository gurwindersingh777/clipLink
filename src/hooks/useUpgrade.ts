import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpgrade() {
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      return await axios.post("/api/upgrade")
    },
    onSuccess: () => {
      router.refresh()
      authClient.getSession()
      toast.success("Welcome to Pro!")
      router.push('/dashboard')
    },
    onError: (error) => {
      const message = axios.isAxiosError(error) ? error.response?.data?.message : "Something went wrong"
      toast.error(message)
    },
  })
}