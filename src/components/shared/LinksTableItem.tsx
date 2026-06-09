'use client'
import { Link as LinkType } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { BarChart, Check, Copy, Lock } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { getStatus } from "@/lib/utils";
import DeleteLink from "./DeleteLink";
import QRCodeDialog from "./QRCodeDialog";
import { authClient } from "@/lib/auth-client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useRouter } from "next/navigation";


export default function LinksTableItem({ link }: { link: LinkType }) {
  const router = useRouter()
  const session = authClient.useSession()
  const tier = session.data?.user.tier

  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => {
        setCopiedId(null)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const slug = link.customSlug ?? link.shortCode
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL}/${slug}`

  return (
    <tr className="border-b transition-colors hover:bg-slate-50/70 last:border-0">
      <td className="px-6 py-4">
        <div className="max-w-70 truncate text-sm text-slate-700" title={link.url}>{link.url}</div>
      </td>

      <td className="px-6 py-4">
        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex max-w-55 truncate font-medium text-sky-600 hover:text-sky-700 hover:underline"
        >
          {shortUrl}
        </a>
      </td>

      <td className="px-6 py-4">{link.count}</td>
      <td className="px-6 py-4 text-sm text-slate-500">{format(new Date(link.createdAt), "MMM dd, yyyy")}</td>
      <td className="px-6 py-4"><StatusBadge status={getStatus(link.active, link.expireAt)} /></td>

      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
        <TooltipProvider>
          <div className="flex justify-end gap-2">

            {/* Copy */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={(e) => {
                    e.stopPropagation()
                    copyToClipboard(shortUrl, link.id)
                  }}
                >
                  {copiedId === link.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {copiedId === link.id ? "Copied!" : "Copy URL"}
              </TooltipContent>
            </Tooltip>

            {/* QR Code */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <QRCodeDialog
                    url={shortUrl}
                    shortCode={slug}
                  />
                </div>
              </TooltipTrigger>

              <TooltipContent>Generate QR Code</TooltipContent>
            </Tooltip>

            {/* Analytics */}
            <Tooltip>
              <TooltipTrigger asChild>
                <span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    disabled={tier?.toUpperCase() === "FREE"}
                    onClick={() => router.push(`/dashboard/${link.id}`)}
                  >
                    <BarChart className="h-4 w-4" />
                  </Button>
                </span>
              </TooltipTrigger>

              <TooltipContent>
                {tier?.toUpperCase() === "FREE" ? "Upgrade to Pro for analytics" : "View analytics"}
              </TooltipContent>
            </Tooltip>

            {/* Delete */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DeleteLink link={link} />
              </TooltipTrigger>
              <TooltipContent>Delete Link</TooltipContent>
            </Tooltip>

          </div>
        </TooltipProvider>
      </td>
    </tr>
  )
}
