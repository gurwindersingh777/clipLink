import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Link2 } from "lucide-react";

export default function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        <Link href="/" className="flex items-center gap-2 text-lg md:text-xl font-bold tracking-tight">
          <Link2 className="w-6 h-6" />ClipLink
        </Link>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-sky-600 hover:bg-sky-700">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>

      </div>
    </header>
  )
}