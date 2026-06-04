import { auth } from "@/lib/auth";
import { linkSchema } from "@/schemas/linkSchema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid'
import { prisma } from "@/lib/prisma";
import { TIERS } from "@/lib/constants";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const tier = (session.user.tier as keyof typeof TIERS) ?? "FREE"

    const count = await prisma.link.count({
      where: { userId: session.user.id }
    })

    const limit = TIERS[tier].maxLinks <= count

    if (limit) {
      return NextResponse.json({ message: "Free plan limit reached. Upgrade to Pro for unlimited links." }, { status: 403 })
    }

    const data = await request.json()
    const result = linkSchema.safeParse(data)

    if (!result.success) {
      return NextResponse.json({ message: result.error.flatten().fieldErrors }, { status: 400 })
    }

    const id = nanoid(7)

    if (result.data.customSlug) {
      const isExist = await prisma.link.findUnique({
        where: { customSlug: result.data.customSlug }
      })

      if (isExist) {
        return NextResponse.json({ message: "This custom link is already taken" }, { status: 409 })
      }
    }

    const link = await prisma.link.create({
      data: {
        userId: session.user.id,
        shortCode: id,
        url: result.data.url,
        customSlug: result.data.customSlug || undefined
      }
    })

    return NextResponse.json({ message: "Link created successfully", data: link }, { status: 201 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const links = await prisma.link.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(links, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to get link" }, { status: 500 })
  }
}