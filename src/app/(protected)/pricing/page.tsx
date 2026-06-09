"use client";

import { ArrowLeft, Check, Crown, Loader2 } from "lucide-react";
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import { authClient } from "@/lib/auth-client";
import { TIERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useLinks } from "@/hooks/useLinks";
import { useUpgrade } from "@/hooks/useUpgrade";
import { useRouter } from "next/navigation";

export default function PricingPage() {

  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const user = session?.user
  const isPro = user?.tier?.toUpperCase() === "PRO"

  const { data: link } = useLinks()
  const currentLinks = link?.length ?? 0
  const maxLinks = TIERS.FREE.maxLinks
  const usagePercentage = (currentLinks / maxLinks) * 100

  const { mutate: upgrade, isPending: isUpgrading } = useUpgrade()

  if (isPending) {
    return (
      <>
        <DashboardNavbar />
        <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
          <div className="flex h-full items-center justify-center px-6">
            <div className="grid w-full max-w-5xl gap-8 md:grid-cols-2">
              <Skeleton className="h-125 rounded-3xl" />
              <Skeleton className="h-125 rounded-3xl" />
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardNavbar />

      <main className="min-h-[calc(100vh-4rem)] bg-linear-to-b from-sky-50 via-white to-white">
        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">

            <div className="mb-14 text-center">
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => router.push("/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>

              <h1 className="text-5xl font-bold tracking-tight">
                Simple Pricing
              </h1>

              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                Start for free and upgrade when you need
                custom links, advanced analytics, and unlimited growth.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">

              <Card className="border-slate-200 shadow-sm">
                <CardContent className="flex h-full flex-col p-8">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {TIERS.FREE.label}
                    </h2>

                    <div className="mt-4">
                      <span className="text-5xl font-bold">$0</span>
                      <span className="ml-2 text-slate-500">forever</span>
                    </div>

                    <p className="mt-3 text-slate-500">
                      Perfect for personal projects and getting started.
                    </p>
                  </div>

                  {!isPro && (
                    <div className="mt-8 rounded-2xl border bg-slate-50 p-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span>Link Usage</span>
                        <span className="font-medium">
                          {currentLinks} / {maxLinks}
                        </span>
                      </div>

                      <Progress value={usagePercentage} />

                      <p className="mt-2 text-xs text-slate-500">
                        {maxLinks - currentLinks} links remaining
                      </p>
                    </div>
                  )}

                  <div className="mt-8 space-y-4">
                    <Feature label={`${TIERS.FREE.maxLinks} links`} />
                    <Feature label="Basic analytics" />
                    <Feature label="QR codes" />
                  </div>

                  <div className="mt-auto pt-10">
                    <Button
                      disabled
                      variant="outline"
                      className="w-full"
                    >
                      {!isPro
                        ? "Current Plan"
                        : "Included in Pro"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative border-sky-200 shadow-xl shadow-sky-100">

                <CardContent className="flex h-full flex-col p-8">

                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold">
                          {TIERS.PRO.label}
                        </h2>

                        <Crown className="h-5 w-5 text-amber-500" />
                      </div>

                      <div className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                        Most Popular
                      </div>
                    </div>

                    <div className="mt-4">
                      <span className="text-5xl font-bold">$9</span>
                      <span className="ml-2 text-slate-500">
                        /month
                      </span>
                    </div>

                    <p className="mt-3 text-slate-500">
                      Everything you need to scale your links and track performance.
                    </p>
                  </div>

                  <div className="mt-8 space-y-4">
                    <Feature label="Unlimited links" />
                    <Feature label="Advanced analytics" />
                    <Feature label="QR codes" />
                    <Feature label="Custom slugs" />
                    <Feature label="Priority support" />
                  </div>

                  <div className="mt-auto pt-10">
                    {isPro ? (
                      <Button
                        disabled
                        className="w-full"
                      >
                        <Crown className="mr-2 h-4 w-4" />
                        You're on Pro
                      </Button>
                    ) : (
                      <Button
                        onClick={() => upgrade()}
                        disabled={isUpgrading}
                        className="w-full bg-sky-600 hover:bg-sky-700"
                      >
                        {isUpgrading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Upgrading...
                          </>
                        ) : (
                          <>
                            <Crown className="mr-2 h-4 w-4" />
                            Upgrade to Pro
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                </CardContent>
              </Card>

            </div>
          </div>
        </section>
      </main>
    </>
  )
}

function Feature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-4 w-4 text-green-600" />
      <span>{label}</span>
    </div>
  )
}