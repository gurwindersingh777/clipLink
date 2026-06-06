
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-sky-50 via-white to-white px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-100">
          <SearchX className="h-10 w-10 text-sky-600" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>

        <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist or may have been moved.</p>

        <Button asChild className="mt-8 bg-sky-600 hover:bg-sky-700">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </main>
  )
}

