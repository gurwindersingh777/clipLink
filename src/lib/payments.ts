import { prisma } from "@/lib/prisma"

export async function markPaymentPaid(orderId: string, paymentId: string) {
  return prisma.$transaction(async (tx) => {
    const { count } = await tx.payment.updateMany({
      where: { razorpayOrderId: orderId, status: "PENDING" },
      data: { status: "PAID", razorpayPaymentId: paymentId, paidAt: new Date() },
    })

    if (count === 0) return false

    const payment = await tx.payment.findUniqueOrThrow({
      where: { razorpayOrderId: orderId },
    })

    await tx.user.update({
      where: { id: payment.userId },
      data: { tier: "PRO" },
    })

    return true
  })
}