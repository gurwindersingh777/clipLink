import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-linear-to-b from-sky-100 via-sky-100 to-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <Skeleton className="mx-auto h-10 w-56" />
            <Skeleton className="mx-auto mt-3 h-4 w-80" />
          </div>

          <div className="mt-10 flex justify-center">
            <Card className="w-full max-w-2xl border-sky-100 shadow-xl">
              <CardContent className="space-y-5 p-6">
                <Skeleton className="h-6 w-40 mx-auto" />
                <Skeleton className="h-4 w-64 mx-auto" />

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-sky-100">
              <CardContent className="space-y-3 p-6">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Links Table */}
        <div className="mt-8">
          <Card className="border-sky-100">
            <CardContent className="p-6">
              <Skeleton className="mb-6 h-6 w-32" />

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-40" />
                    </div>

                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                      <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}