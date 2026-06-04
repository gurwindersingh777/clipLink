"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Check, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks/useLinks";
import { useDeleteLink } from "@/hooks/useDeleteLink";
import { StatusBadge } from "./StatusBadge";
import { getStatus } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";
import DeleteLink from "./DeleteLink";


export default function LinksTable() {

  const { data: links = [], isLoading, isError } = useLinks()

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

  if (isLoading) {
    return (
      <Card className="border-sky-100">
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
        </CardHeader>

        <CardContent>
          <table className="w-full table-fixed">
            <thead>
              <tr className="border-b text-left">
                <th className="w-62.5 pb-3"><Skeleton className="h-4 w-24" /></th>
                <th className="w-70 pb-3"><Skeleton className="h-4 w-20" /></th>
                <th className="w-25 pb-3"><Skeleton className="h-4 w-12" /></th>
                <th className="w-37.5 pb-3"><Skeleton className="h-4 w-16" /></th>
                <th className="w-30 pb-3"><Skeleton className="h-4 w-14" /></th>
                <th className="w-25 pb-3"><Skeleton className="h-4 w-16" /></th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3].map((i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-4"><Skeleton className="h-4 w-48" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-8" /></td>
                  <td className="py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="py-4 flex justify-end"><Skeleton className="h-8 w-8 rounded-md" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-red-500">
          Failed to load links
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-sky-100">
      <CardHeader>
        <CardTitle>Your Links</CardTitle>
      </CardHeader>

      <CardContent>
        {links.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">No links found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-fixed">
              <thead>
                <tr className="border-b text-left">
                  <th className="w-62.5 pb-3 font-medium">Original URL</th>
                  <th className="w-70 pb-3 font-medium">Short Link</th>
                  <th className="w-25 pb-3 font-medium">Clicks</th>
                  <th className="w-37.5 pb-3 font-medium">Created</th>
                  <th className="w-30 pb-3 font-medium">Status</th>
                  <th className="w-25 pb-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {links.map((link) => {
                  const slug = link.customSlug ?? link.shortCode
                  const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/${slug}`

                  return (
                    <tr
                      key={link.id}
                      className="border-b last:border-0"
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

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              copyToClipboard(shortUrl, link.id)
                            }
                          >
                            {copiedId === link.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        </div>
                      </td>

                      <td className="py-4">{link.count}</td>
                      <td className="py-4">{format(new Date(link.createdAt), "MMM dd, yyyy")}</td>
                      <td className="py-4"><StatusBadge status={getStatus(link.active, link.expireAt)} /></td>

                      <td className="py-4 text-right">
                        <DeleteLink link={link} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}