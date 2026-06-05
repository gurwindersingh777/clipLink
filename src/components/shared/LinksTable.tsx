"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLinks } from "@/hooks/useLinks";
import { Skeleton } from "../ui/skeleton";
import LinksTableItem from "./LinksTableItem";


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
                {links.map((link) =>
                  <LinksTableItem key={link.id} link={link} />
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}