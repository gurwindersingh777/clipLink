"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RegisterFormValues, registerSchema } from "@/schemas/authSchema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LinkIcon, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (values: RegisterFormValues) => {

    await authClient.signUp.email({
      name: values.name,
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
    <main className="h-screen overflow-hidden bg-linear-to-b from-white via-slate-50/40 to-white">
      <div className="grid h-full lg:grid-cols-2">

        <div className="relative hidden overflow-hidden lg:flex flex-col justify-between bg-linear-to-br from-sky-50 via-white to-blue-50 px-12 py-10">

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
            <h1 className="text-[clamp(2.75rem,4vw,4.5rem)] font-black tracking-tight leading-[0.95] text-slate-900">
              Create links.
              <br />
              Share anywhere.
            </h1>

            <p className="mt-6 max-w-md text-lg leading-8 text-slate-600">
              Start shortening URLs, tracking engagement,
              and organizing your links from one clean dashboard.
            </p>
          </div>

          <div className="relative z-10 text-sm text-slate-500">© 2026 ClipLink</div>
        </div>

        <div className="flex h-full items-center justify-center p-4 lg:p-8">
          <Card className="w-full max-w-md border border-slate-200/60 bg-white/80 shadow-2xl shadow-sky-100/40 backdrop-blur-xl">
            <CardContent className="p-6 lg:p-8">

              <div className="mb-6">
                <div className="mb-6 lg:hidden">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
                  >
                    <LinkIcon className="h-5 w-5 stroke-[2.5]" />
                    <span>ClipLink</span>
                  </Link>
                </div>

                <h2 className="text-3xl font-bold tracking-tight">Create account</h2>
                <p className="mt-2 text-slate-500">Get started with ClipLink today.</p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="mb-2 block text-sm font-medium">Full Name</label>

                  <Input
                    placeholder="John Doe"
                    className="h-10 rounded-lg"
                    {...register("name")}
                  />

                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email Address</label>

                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-10 rounded-lg"
                    {...register("email")}
                  />

                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Password</label>

                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 rounded-lg"
                    {...register("password")}
                  />

                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Confirm Password</label>

                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="h-10 rounded-lg"
                    {...register("confirmPassword")}
                  />

                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 w-full bg-sky-600 font-medium shadow-lg shadow-sky-500/20 transition-all hover:bg-sky-700 hover:shadow-sky-500/30"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Create Account"
                  )}
                </Button>

                <div className="text-center text-sm text-slate-500">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-sky-600 hover:text-sky-700"
                  >
                    Sign in
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
