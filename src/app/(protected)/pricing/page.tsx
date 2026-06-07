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

      <main className="min-h-[calc(100vh-4rem)] bg-slate-50">
        <section className="px-6 py-8">
          <div className="mx-auto w-full max-w-5xl">

            <div className="mb-10">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>

              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Pricing</h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  Manage your subscription and unlock advanced features.
                </p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">

              <Card className="relative shadow-lg">
                <CardContent className="flex min-h-105 flex-col p-6">
                  <div>
                    <h2 className="text-xl font-bold">{TIERS.FREE.label}</h2>
                    <div className="mt-4 text-4xl font-bold">$0</div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {!isPro ? "Your current plan" : "Basic plan features"}
                    </p>
                  </div>

                  {!isPro && (
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span>Link Usage</span>
                        <span className="font-medium">{currentLinks} / {maxLinks}</span>
                      </div>

                      <Progress value={usagePercentage} />

                      <p className="mt-2 text-xs text-muted-foreground">{maxLinks - currentLinks} links remaining</p>
                    </div>
                  )}

                  <div className="mt-6 space-y-3">
                    <Feature label={`${TIERS.FREE.maxLinks} links`} />
                    <Feature label="Basic analytics" />
                    <Feature label="QR codes" />
                  </div>

                  <div className="mt-auto pt-6">
                    <Button
                      disabled
                      variant="outline"
                      className="w-full border-neutral-400"
                    >
                      {!isPro ? "Current Plan" : "Included in Pro"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative shadow-lg">
                <div className="absolute right-4 top-4 rounded-full bg-sky-600 px-2.5 py-1 text-xs font-semibold text-white">
                  {isPro ? "Current Plan" : "Most Popular"}
                </div>

                <CardContent className="flex min-h-105 flex-col p-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-bold">{TIERS.PRO.label}</h2>
                      <Crown className="h-4 w-4 text-yellow-500" />
                    </div>

                    <div className="mt-3">
                      <span className="text-4xl font-bold">$9</span>
                      <span className="ml-2 text-muted-foreground">/month</span>
                    </div>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Unlimited growth with advanced analytics andcustom branding.
                    </p>

                    <div className="mt-6 space-y-3">
                      <Feature label="Unlimited links" />
                      <Feature label="Advanced analytics" />
                      <Feature label="QR codes" />
                      <Feature label="Custom slugs" />
                      <Feature label="Priority support" />
                    </div>
                  </div>

                  <div className="mt-auto pt-6">
                    {isPro ? (
                      <Button disabled className="w-full">
                        <Crown className="mr-2 h-4 w-4" />You're on Pro
                      </Button>
                    ) : (
                      <Button
                        onClick={() => upgrade()}
                        disabled={isUpgrading}
                        className="w-full bg-sky-600 hover:bg-sky-700"
                      >
                        {isUpgrading ?
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          :
                          <>
                            <Crown className="mr-2 h-4 w-4" />Upgrade to Pro
                          </>
                        }
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