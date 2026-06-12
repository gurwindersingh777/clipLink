"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoginFormValues, loginSchema } from "@/schemas/authSchema";
import { useRouter } from "next/navigation";
import { LinkIcon, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginFormValues) => {
    await authClient.signIn.email({
      email: values.email,
      password: values.password
    }, {
      onSuccess: () => {
        router.push('/dashboard')
      },
      onError: (ctx) => {
        toast.error(ctx.error.message)
      },
    })
  }

  return (
    <main className="min-h-screen bg-linear-to-b from-white via-slate-50/40 to-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        <div className="relative hidden overflow-hidden lg:flex flex-col justify-between bg-linear-to-br from-sky-50 via-white to-blue-50 p-12">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-sky-200/20 blur-3xl" />
            <div className="absolute bottom-20 right-20 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
          </div>

          <Link
            href="/"
            className="relative z-10 flex items-center gap-2 text-2xl font-extrabold tracking-tight"
          >
            <LinkIcon className="h-5 w-5 stroke-[2.5]" />
            <span>ClipLink</span>
          </Link>

          <div className="relative z-10 max-w-xl">

            <h1 className="text-6xl font-black tracking-tight leading-none text-slate-900">
              Shorten links.
              <br />
              Track everything.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              Create branded short URLs, monitor click analytics,
              generate QR codes, and manage your links from one dashboard.
            </p>
          </div>

          <div className="relative z-10 text-sm text-slate-500">© 2026 ClipLink</div>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-10">
          <Card className="w-full max-w-md border border-slate-200/60 bg-white/80 shadow-2xl shadow-sky-100/40 backdrop-blur-xl">
            <CardContent className="p-8 md:p-10">
              <div className="mb-8">
                <div className="mb-6 lg:hidden">
                  <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
                    <LinkIcon className="h-5 w-5" />ClipLink
                  </Link>
                </div>

                <h2 className="text-3xl font-bold tracking-tight">Sign in</h2>
                <p className="mt-2 text-slate-500">Enter your credentials to continue.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">Email Address</label>

                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-11 rounded-lg"
                    {...register("email")}
                    required
                  />

                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-medium">Password</label>
                    <Link href="/forgot-password" className="text-sm text-sky-600 hover:text-sky-700">
                      Forgot password?
                    </Link>
                  </div>

                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-11 rounded-lg"
                    {...register("password")}
                    required
                  />

                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-11 w-full bg-sky-600 font-medium shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-700 hover:shadow-sky-500/30"
                >
                  {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>

                <div className="text-center text-sm text-slate-500">
                  Don't have an account?{" "}
                  <Link href="/signup" className="font-medium text-sky-600 hover:text-sky-700">
                    Create one
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

