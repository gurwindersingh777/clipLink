"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, LinkIcon, LogOut, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function DashboardNavbar() {

  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()

  const [isSigningOut, setIsSigningOut] = useState(false)

  const user = session?.user;

  const tier = user?.tier?.toUpperCase() ?? "FREE";

  const initials = user?.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()
    || user?.email?.charAt(0).toUpperCase() || "U"

  const handleLogout = async () => {
    try {
      setIsSigningOut(true)
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
          },
        },
      })
    }
    catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Something went wrong"
      toast.error(message)
    }
    finally {
      setIsSigningOut(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b  border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        <Link href="/dashboard" className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-tight">ClipLink</span>
        </Link>

        <div className="flex items-center gap-3">
          {isPending ? (
            <Skeleton className="h-9 w-24 rounded-md" />
          ) : (
            <>
              {tier === "PRO" ? (
                <Badge className=" bg-amber-500  ">
                  PRO
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 text-slate-700"
                  onClick={() => router.push("/pricing")}
                >
                  FREE
                </Badge>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full transition hover:opacity-90 focus:outline-none">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage
                        src={user?.image ?? ""}
                        alt={user?.name ?? "User"}
                      />
                      <AvatarFallback className="bg-neutral-900 text-white font-semibold">{initials}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-72 p-0"
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={user?.image ?? ""}
                          alt={user?.name ?? "User"}
                        />
                        <AvatarFallback >{initials}</AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">{user?.name || "User"}</p>
                        <p className="truncate text-sm text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </div>


                  {tier !== "PRO" && (
                    <>
                      <DropdownMenuSeparator />
                      <div className="p-3">
                        <Button
                          className="w-full"
                          onClick={() =>
                            router.push("/pricing")
                          }
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Upgrade to Pro
                        </Button>
                      </div>
                    </>
                  )}

                  <DropdownMenuSeparator />


                  <div className="p-3">
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={isSigningOut}
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />

                      {isSigningOut ? "Logging out..." : "Logout"}
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  )
}