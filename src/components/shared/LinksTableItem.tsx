'use client'
import { Link as LinkType } from "@prisma/client";
import { Button } from "../ui/button";
import { useState } from "react";
import { BarChart, Check, Copy } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "./StatusBadge";
import { getStatus } from "@/lib/utils";
import DeleteLink from "./DeleteLink";
import { useRouter } from "next/navigation";
import Link from "next/link";
import QRCodeDialog from "./QRCodeDialog";


export default function LinksTableItem({ link }: { link: LinkType }) {
  const router = useRouter()

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
  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${slug}`

  return (
    <tr
      key={link.id}
      className="border-b last:border-0 hover:bg-neutral-100 cursor-pointer"
      onClick={() => {
        router.push(`/dashboard/${link.id}`)
      }}
    >
      <td className="py-4">
        <div className="truncate w-62.5" title={link.url}>{link.url}</div>
      </td>

      <td className="py-4">
        <div className="flex items-center gap-2">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-55 truncate text-sky-600 hover:underline"
          >
            {shortUrl}
          </a>


        </div>
      </td>

      <td className="py-4">{link.count}</td>
      <td className="py-4">{format(new Date(link.createdAt), "MMM dd, yyyy")}</td>
      <td className="py-4"><StatusBadge status={getStatus(link.active, link.expireAt)} /></td>

      <td
        className="py-4 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-end gap-2">

          <Button
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(shortUrl, link.id)
            }}
          >
            {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>

          <Button asChild variant="outline" size="sm">
            <Link href={`/dashboard/${link.id}`}><BarChart /></Link>
          </Button>

          <QRCodeDialog
            url={shortUrl}
            shortCode={slug}
          />

          <DeleteLink link={link} />
        </div>
      </td>
    </tr>
  );
}
