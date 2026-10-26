import { auth } from "@/lib/auth";
import { linkSchema } from "@/schemas/linkSchema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid'
import { prisma } from "@/lib/prisma";
import { TIERS } from "@/lib/constants";
import { createLinkLimiter } from "@/lib/ratelimit";
import { Prisma } from "@prisma/client";
import { isReservedSlug, normalizeSlug } from "@/lib/slug";
import { getClientIp } from "@/lib/client-ip";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { success } = await createLinkLimiter.limit(getClientIp(request.headers))

    if (!success) {
      return NextResponse.json({ message: "Too many requests. Please slow down." }, { status: 429 })
    }

    const body = await request.json().catch(() => null)
    const result = linkSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ message: result.error.flatten().fieldErrors }, { status: 400 })
    }

    const tier: keyof typeof TIERS = session.user.tier === "PRO" ? "PRO" : "FREE"

    const count = await prisma.link.count({ where: { userId: session.user.id } })

    if (count >= TIERS[tier].maxLinks) {
      return NextResponse.json({ message: "Free plan limit reached. Upgrade to Pro for unlimited links." }, { status: 403 })
    }

    const customSlug = result.data.customSlug ? normalizeSlug(result.data.customSlug) : undefined

    if (customSlug) {
      if (tier !== "PRO") {
        return NextResponse.json({ message: "Custom links are a Pro feature. Upgrade to Pro to use them." }, { status: 403 })
      }

      if (isReservedSlug(customSlug)) {
        return NextResponse.json({ message: "This custom link is reserved. Please choose another one." }, { status: 400 })
      }

      const taken = await prisma.link.findFirst({
        where: {
          OR: [
            { customSlug },
            { shortCode: { equals: customSlug, mode: "insensitive" } },
          ],
        },
        select: { id: true },
      })

      if (taken) {
        return NextResponse.json({ message: "This custom link is already taken" }, { status: 409 })
      }
    }

    const link = await prisma.link.create({
      data: {
        userId: session.user.id,
        shortCode: nanoid(7),
        url: result.data.url,
        customSlug,
      },
    })

    return NextResponse.json({ message: "Link created successfully", data: link }, { status: 201 })

  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "This custom link is already taken" }, { status: 409 })
    }

    console.error(error)
    return NextResponse.json({ error: "Failed to create link" }, { status: 500 })
  }
}

export async function GET() {
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