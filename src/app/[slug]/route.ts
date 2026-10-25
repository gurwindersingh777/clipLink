import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { redirectLimiter } from "@/lib/ratelimit"
import { getClientIp } from "@/lib/client-ip"
import { normalizeSlug } from "@/lib/slug"

function statusPage(title: string, message: string, status: number, headers: Record<string, string> = {}) {
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex" />
  <title>${title}</title>
  <style>
    body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
           font-family: system-ui, sans-serif; background: #0a0a0a; color: #fafafa; text-align: center; padding: 24px; }
    p { color: #a1a1aa; max-width: 28rem; }
  </style>
</head>
<body><main><h1>${title}</h1><p>${message}</p></main></body>
</html>`

  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8", ...headers },
  })
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params
  const slug = rawSlug.trim()
  const ipAddress = getClientIp(request.headers)

  const { success, reset } = await redirectLimiter.limit(ipAddress)

  if (!success) {
    const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000))
    return statusPage("Too Many Requests", "You've made too many requests in a short period. Please try again later.", 429, { "Retry-After": String(retryAfter) })
  }

  const link = await prisma.link.findFirst({
    where: { OR: [{ shortCode: slug }, { customSlug: normalizeSlug(slug) }] },
  })

  if (!link) return statusPage("Link not found", "This link doesn't exist or may have been removed.", 404)
  if (!link.active) return statusPage("Link disabled", "This link has been disabled by its owner.", 404)
  if (link.expireAt && link.expireAt < new Date()) return statusPage("Link expired", "This link is no longer available.", 410)

  await prisma.$transaction([
    prisma.click.create({
      data: {
        linkId: link.id,
        ipAddress,
        userAgent: request.headers.get("user-agent"),
        referer: request.headers.get("referer"),
        country: request.headers.get("x-vercel-ip-country") || "Unknown",
      },
    }),
    prisma.link.update({
      where: { id: link.id },
      data: { count: { increment: 1 } },
    }),
  ])

  return NextResponse.redirect(link.url, {
    status: 307,
    headers: { "Cache-Control": "no-store" },
  })
}