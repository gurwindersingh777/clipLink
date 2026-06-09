"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLinks } from "@/hooks/useLinks";
import { Skeleton } from "../ui/skeleton";
import LinksTableItem from "./LinksTableItem";
import { Link2 } from "lucide-react";


export default function LinksTable() {

  const { data: links = [], isLoading, isError } = useLinks()

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
    <Card className="border border-slate-200/60 bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold">
              Your Links
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              Manage and monitor all shortened URLs.
            </p>
          </div>

          <div className="rounded-lg border bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
            {links.length} Links
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {links.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-2xl bg-slate-100 p-4">
              <Link2 className="h-6 w-6 text-slate-500" />
            </div>

            <h3 className="font-semibold text-slate-900">
              No links yet
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500">
              Create your first short link above and start tracking clicks.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-slate-50/80">
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Original URL
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Short Link
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Clicks
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Created
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {links.map((link) => (
                    <LinksTableItem
                      key={link.id}
                      link={link}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}