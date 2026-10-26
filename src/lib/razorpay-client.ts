type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: { name?: string; email?: string }
  theme?: { color?: string }
  handler: (response: RazorpaySuccessResponse) => void
  modal?: { ondismiss?: () => void }
}

type RazorpayInstance = {
  open: () => void
  on: (
    event: "payment.failed",
    callback: (response: { error: { description: string } }) => void
  ) => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)

    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}