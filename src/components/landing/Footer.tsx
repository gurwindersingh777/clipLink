import Link from "next/link";
import { ArrowRight, LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t bg-linear-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-7xl px-6">

        <div className="py-24 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              Ready to shorten your first link?
            </h2>

            <p className="mt-6 text-lg text-muted-foreground">
              Join creators, developers, and businesses using ClipLink to
              create short links, track clicks, and grow faster.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild className="bg-sky-600 hover:bg-sky-700">
                <Link href="/signup"> Get Started Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>

              <Button size="lg" variant="outline" asChild >
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-6 border-t py-8 md:flex-row">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold tracking-tight"
            >
              <LinkIcon className="h-4.5 w-4.5 stroke-[2.5]" />
              <span>ClipLink</span>
            </Link>

          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition hover:text-foreground">Terms</Link>
            <Link href="/pricing" className="transition hover:text-foreground">Pricing</Link>
            <Link
              href="https://github.com/gurwindersingh777"
              target="_blank" rel="noopener noreferrer" className="transition hover:text-foreground">
              GitHub
            </Link>
          </div>

          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} ClipLink</p>
        </div>
      </div>
    </footer>
  );
}