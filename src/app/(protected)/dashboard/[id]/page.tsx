"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { ArrowLeft, Calendar, MousePointerClick } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link
              href="/dashboard"
              className="mb-3 inline-flex items-center text-sm text-slate-500 hover:text-slate-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>

            <h1 className="text-4xl font-bold tracking-tight m">Analytics</h1>
            <p className="mt-2 text-slate-500">Monitor clicks, traffic sources and audience insights.</p>
          </div>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-3">

          <Card className="border-slate-200/60 shadow-sm lg:col-span-2">
            <CardContent className="p-6">
              <p className="text-sm text-slate-500">Original URL</p>

              <div className="mt-3 rounded-xl border bg-slate-50 p-3">
                <p className="break-all text-sm font-medium text-slate-700">{link.url}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="p-6">
              <div className="grid gap-6">

                <div>
                  <p className="text-sm text-slate-500">Short Code</p>
                  <p className="mt-1 text-xl font-bold">{link.shortCode}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MousePointerClick className="h-4 w-4" />Total Clicks
                  </div>
                  <p className="mt-1 text-2xl font-bold">{link.clicks.length}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Calendar className="h-4 w-4" />Created
                  </div>
                  <p className="mt-1 font-medium">{format(new Date(link.createdAt), "PPP")}</p>
                </div>

              </div>
            </CardContent>
          </Card>

        </div>

        {!hasClicks ? (
          <Card className="border-slate-200/60 shadow-sm">
            <CardContent className="flex h-80 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <MousePointerClick className="h-7 w-7 text-slate-500" />
                </div>

                <h3 className="text-lg font-semibold">No clicks yet</h3>
                <p className="mt-2 text-slate-500">Share your link to start collecting analytics.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6 border-slate-200/60 shadow-sm">
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="h-95">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={clicksByDay}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="clicks"
                        fill="#0284c7"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 lg:grid-cols-2">

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Referrer Breakdown</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="h-87.5">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <PieChart>
                        <Pie
                          data={clicksByReferrer}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={110}
                          label
                        >
                          {clicksByReferrer.map((_, index) => (
                            <Cell key={index} />
                          ))}
                        </Pie>

                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-200/60 shadow-sm">
                <CardHeader>
                  <CardTitle>Country Breakdown</CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="h-87.5">
                    <ResponsiveContainer
                      width="100%"
                      height="100%"
                    >
                      <BarChart data={clicksByCountry}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar
                          dataKey="value"
                          radius={[8, 8, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

            </div>
          </>
        )}
      </div>
    </main>
  )
}