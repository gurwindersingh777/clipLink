import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { notFound, redirect } from "next/navigation"

export default async function Slug({ params }: { params: Promise<{ slug: string }> }) {

  const { slug } = await params

  // Note: Next.js resolves static routes before dynamic ones.
  // /dashboard, /login, /signup will never be caught here
  // because their page.tsx files take priority over [slug]/page.tsx

  const link = await prisma.link.findFirst({
    where: {
      OR: [
        { shortCode: slug.trim() },
        { customSlug: { equals: slug.trim(), mode: "insensitive" } }
      ]
    }
  })

  if (!link) {
    notFound()
  }

  if (link.active === false) {
    return (
      <div>
        <h1>Link Disabled</h1>
        <p>This link has been disabled by the owner.</p>
      </div>
    )
  }

  if (link.expireAt && new Date(link.expireAt) < new Date()) {
    return (
      <div>
        <h1>Link Expired</h1>
        <p>This link is no longer available.</p>
      </div>
    )
  }

  const header = await headers()

  const ipAddress = header.get("x-forwarded-for") || header.get("x-real-ip") || null

  await prisma.$transaction([
    prisma.click.create({
      data: {
        linkId: link.id,
        ipAddress,
        userAgent: header.get("user-agent"),
        referer: header.get("referer")
      }
    }),
    prisma.link.update({
      where: { id: link.id },
      data: { count: { increment: 1 } }
    })
  ])

  return redirect(link.url)
}
