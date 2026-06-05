"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MousePointerClick } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLinkAnalytics } from "@/hooks/useLinkAnalytics";
import { analyticsUtils } from "@/lib/analyticsUtils";

export default function AnalyticsPage() {

  const params = useParams()
  const id = params.id as string

  const { data: link, isLoading, error } = useLinkAnalytics(id)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-87.5 w-full" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-87.5" />
          <Skeleton className="h-87.5" />
        </div>
      </div>
    )
  }

  if (error || !link) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-muted-foreground">
          Failed to load analytics.
        </p>
      </div>
    );
  }

  const clicksByDay = analyticsUtils.getClicksByDay(link.clicks)
  const clicksByReferrer = analyticsUtils.getClicksByReferrer(link.clicks)
  const clicksByCountry = analyticsUtils.getClicksByCountry(link.clicks)
  const hasClicks = link.clicks.length > 0

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">

      <Button
        asChild
        variant="outline"
      >
        <Link href="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Link Analytics</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className=" text-muted-foreground">Original URL</p>
              <p className="truncate font-medium">{link.url}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Short Code</p>
              <p className="font-medium">{link.shortCode}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Created</p>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(link.createdAt), "PPP")}
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Total Clicks</p>

              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" />
                <span className="text-2xl font-bold">{link.clicks.length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {!hasClicks ? (
        <Card>
          <CardContent className="flex h-60 items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold">No clicks yet</h3>
              <p className="text-sm text-muted-foreground">Share your link to start collecting analytics.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="h-87.5">
                <ResponsiveContainer>
                  <BarChart data={clicksByDay}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#0284c7" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Referrer Breakdown</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={clicksByReferrer}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={120}
                        label
                      >
                        {clicksByReferrer.map(
                          (_, index) => (
                            <Cell key={index} />
                          )
                        )}
                      </Pie>

                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Country Breakdown</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="h-87.5">
                  <ResponsiveContainer>
                    <BarChart data={clicksByCountry}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}