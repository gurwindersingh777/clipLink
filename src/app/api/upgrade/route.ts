import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    if (session.user.tier === "PRO") {
      return NextResponse.json({ message: "Already on Pro" }, { status: 400 })
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { tier: "PRO" }
    })

    return NextResponse.json({ message: "Successfully upgraded to Pro." }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to upgrade to pro" }, { status: 500 })
  }
}