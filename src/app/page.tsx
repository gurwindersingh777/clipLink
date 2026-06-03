'use client'

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function HomePage() {
  const router = useRouter();
  const [url, setUrl] = useState("");

  const handleShorten = () => {
    if (!url.trim()) return;

    router.push(
      `/signup?redirect=${encodeURIComponent("/dashboard")}`
    );
  };

  return (
    <main className="h-screen overflow-hidden bg-linear-to-b from-sky-200 via-white to-white">
      {/* Navbar */}
      <header className="h-16 border-b bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight"
          >
            ClipLink
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              asChild
            >
              <Link href="/login">
                Login
              </Link>
            </Button>

            <Button
              asChild
              className="bg-sky-600 hover:bg-sky-700"
            >
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex h-[calc(100vh-4rem)] items-center justify-center px-6">
        <div className="w-full max-w-4xl text-center">
          <div className="mb-6 inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-medium text-sky-700">
            Fast • Simple • Reliable
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Shorten links.
            <br />
            Share anywhere.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Create short URLs, manage links,
            and track performance from a simple dashboard.
          </p>

          {/* URL Input */}
          <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-3 sm:flex-row">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste a long URL to get started..."
              className="h-12"
            />

            <Button
              size="lg"
              onClick={handleShorten}
              className="h-12 bg-sky-600 px-8 hover:bg-sky-700"
            >
              Shorten
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Create a free account to generate and manage short links.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div>✓ Custom Aliases</div>
            <div>✓ Click Analytics</div>
            <div>✓ Link Management</div>
            <div>✓ Fast Redirects</div>
          </div>
        </div>
      </section>
    </main>
  );
}
