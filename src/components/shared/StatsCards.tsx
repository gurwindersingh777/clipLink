"use client";

import { Crown, Link2, MousePointerClick, Zap, } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

type StatCardProps = {
  title: string
  value: string | number
  icon: LucideIcon
}

function StatCard({
  title,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{value}</h3>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
            <Icon className="h-5 w-5 text-sky-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function StatsCards() {

  const { data: links = [], isLoading } = useLinks()

  const session = authClient.useSession()
  const tier = session.data?.user.tier ?? "FREE"
  const totalLinks = links.length
  const totalClicks = links.reduce((sum, link) => sum + link.count, 0)
  const activeLinks = links.filter((link) => {
    const expired = link.expireAt && new Date(link.expireAt) < new Date()
    return link.active && !expired
  }).length

  if (isLoading || session.isPending) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-sky-100">
            <CardContent className="p-6 space-y-3">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total Links"
        value={totalLinks}
        icon={Link2}
      />

      <StatCard
        title="Total Clicks"
        value={totalClicks}
        icon={MousePointerClick}
      />

      <StatCard
        title="Active Links"
        value={activeLinks}
        icon={Zap}
      />

      <StatCard
        title="Current Plan"
        value={tier}
        icon={Crown}
      />
    </div>
  )
}