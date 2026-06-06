"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({reset,
}: {
  error: Error & { digest?: string };
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-sky-50 via-white to-white px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">Something went wrong</h1>
        <p className="mt-4 text-muted-foreground">An unexpected error occurred while loading this page.</p>

        <Button onClick={reset} className="mt-8 bg-sky-600 hover:bg-sky-700">Try Again</Button>
      </div>
    </main>
  )
}
