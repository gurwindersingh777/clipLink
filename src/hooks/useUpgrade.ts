import { authClient } from "@/lib/auth-client";
import { loadRazorpayScript } from "@/lib/razorpay-client";
import { PRO_PLAN } from "@/lib/constants";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CreateOrderResponse = {
  orderId: string
  amount: number
  currency: string
  keyId: string
}

class PaymentCancelledError extends Error {}

export function useUpgrade() {
  const router = useRouter()
  const { data: session } = authClient.useSession()

  return useMutation({
    mutationFn: async () => {
      const loaded = await loadRazorpayScript()
      const Razorpay = window.Razorpay

      if (!loaded || !Razorpay) {
        throw new Error("Could not load the payment window. Check your connection and try again.")
      }

      const { data: order } = await axios.post<CreateOrderResponse>("/api/payments/create-order")

      await new Promise<void>((resolve, reject) => {
        const checkout = new Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "ClipLink",
          description: PRO_PLAN.name,
          order_id: order.orderId,
          prefill: { name: session?.user.name, email: session?.user.email },
          theme: { color: "#0284c7" },
          handler: async (response) => {
            try {
              await axios.post("/api/payments/verify", response)
              resolve()
            } catch {
              reject(new Error(
                "Your payment went through, but we couldn't confirm it yet. Your account will upgrade automatically in a minute. Refresh the page if it doesn't."
              ))
            }
          },
          modal: { ondismiss: () => reject(new PaymentCancelledError()) },
        })

        checkout.on("payment.failed", (response) => {
          toast.error(response.error.description)
        })

        checkout.open()
      })
    },
    onSuccess: () => {
      router.refresh()
      authClient.getSession()
      toast.success("Welcome to Pro!")
      router.push('/dashboard')
    },
    onError: (error) => {
      if (error instanceof PaymentCancelledError) {
        toast.info("Payment cancelled")
        return
      }

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? "Something went wrong")
        return
      }

      toast.error(error instanceof Error ? error.message : "Something went wrong")
    },
  })
}