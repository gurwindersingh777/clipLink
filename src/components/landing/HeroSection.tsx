import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="px-6 py-15 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">

          <div>
            <div className="mb-6 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
              Fast • Reliable • Analytics
            </div>

            <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
              Shorten links.
              <br />
              Track clicks.
              <br />
              Grow faster.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Create branded short URLs, monitor performance with detailed
              analytics, and manage all your links from one simple dashboard.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/signup">Get Started Free</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-2xl">
            <div className="overflow-hidden rounded-2xl border bg-slate-50">
              <div className="border-b bg-white px-4 py-3">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-400" />
                  <div className="h-3 w-3 rounded-full bg-yellow-400" />
                  <div className="h-3 w-3 rounded-full bg-green-400" />
                </div>
              </div>

              <div className="space-y-6 p-6">
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <h3 className="text-4xl font-bold">12,847</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-muted-foreground">Links</p>
                    <p className="mt-2 text-2xl font-bold">124</p>
                  </div>

                  <div className="rounded-xl border bg-white p-4">
                    <p className="text-sm text-muted-foreground">QR Codes</p>
                    <p className="mt-2 text-2xl font-bold">57</p>
                  </div>
                </div>

                <div className="h-40 rounded-xl bg-linear-to-r from-sky-100 to-sky-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}