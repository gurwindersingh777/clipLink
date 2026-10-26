import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { razorpay } from "@/lib/razorpay"
import { PRO_PLAN } from "@/lib/constants"
import { paymentLimiter } from "@/lib/ratelimit"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.tier === "PRO") {
      return NextResponse.json({ message: "You are already on Pro." }, { status: 409 })
    }

    const { success } = await paymentLimiter.limit(session.user.id)
    if (!success) {
      return NextResponse.json({ message: "Too many attempts. Please try again later." }, { status: 429 })
    }

    const order = await razorpay.orders.create({
      amount: PRO_PLAN.amount,
      currency: PRO_PLAN.currency,
      receipt: `pro_${session.user.id.slice(-8)}_${Date.now()}`,
      notes: { userId: session.user.id },
    })

    await prisma.payment.create({
      data: {
        userId: session.user.id,
        razorpayOrderId: order.id,
        amount: PRO_PLAN.amount,
        currency: PRO_PLAN.currency,
      },
    })

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,  
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: "Failed to create order" }, { status: 500 })
  }
}