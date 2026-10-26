import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { verifyPaymentSignature } from "@/lib/razorpay"
import { markPaymentPaid } from "@/lib/payments"
import { headers } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"

const verifySchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => null)
    const result = verifySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = result.data

    // The order must belong to the logged-in user
    const payment = await prisma.payment.findFirst({
      where: { razorpayOrderId: razorpay_order_id, userId: session.user.id },
    })

    if (!payment) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 })
    }

    await markPaymentPaid(razorpay_order_id, razorpay_payment_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to verify payment" }, { status: 500 })
  }
}