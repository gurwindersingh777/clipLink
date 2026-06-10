import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const link = await prisma.link.findUnique({ where: { id }, })

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 })
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    await prisma.link.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Link deleted successfully" }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to delete link" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const link = await prisma.link.findUnique({
      where: { id },
      include: { clicks: { orderBy: { createdAt: 'asc' } } }
    })

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 })
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    return NextResponse.json(link, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to get link" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const link = await prisma.link.findUnique({ where: { id } })

    if (!link) {
      return NextResponse.json({ message: "Link not found" }, { status: 404 })
    }

    if (link.userId !== session.user.id) {
      return NextResponse.json({ message: "Access denied" }, { status: 403 })
    }

    const updatedLink = await prisma.link.update({
      where: { id },
      data: { active: !link.active }
    })

    return NextResponse.json(updatedLink, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false, message: "Failed to change status" }, { status: 500 })
  }
}