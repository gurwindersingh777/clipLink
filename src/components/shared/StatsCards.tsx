"use client";

import { Crown, Link2, MousePointerClick, Zap, } from "lucide-react";
import { useLinks } from "@/hooks/useLinks";
import { authClient } from "@/lib/auth-client";
import { getStatus } from "@/lib/utils";
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
    <Card className="border-sky-100">
      <CardContent className="p-6">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-sky-100">
          <Icon className="h-5 w-5 text-sky-600" />
        </div>

        <p className="text-sm text-muted-foreground">
          {title}
        </p>

        <h3 className="mt-2 text-3xl font-bold">
          {value}
        </h3>
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
  const activeLinks = links.filter((link) => getStatus(link.active, link.expireAt) === "active").length

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
    <div className="grid gap-4 md:grid-cols-4">
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