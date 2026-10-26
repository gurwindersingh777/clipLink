import { NextRequest, NextResponse } from "next/server"
import { verifyWebhookSignature } from "@/lib/razorpay"
import { markPaymentPaid } from "@/lib/payments"

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-razorpay-signature")

  const rawBody = await request.text()

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }

  try {
    const event = JSON.parse(rawBody)

    if (event.event === "payment.captured" || event.event === "order.paid") {
      const entity = event.payload?.payment?.entity

      if (entity?.order_id && entity?.id) {
        await markPaymentPaid(entity.order_id, entity.id)
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Webhook handling failed" }, { status: 500 })
  }
}