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
import { Loader2 } from "lucide-react";

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
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen lg:grid-cols-2">

        <div className="hidden lg:flex flex-col justify-between bg-linear-to-br from-sky-100 via-blue-100 to-white p-12">
          <Link href="/" className="text-2xl font-bold tracking-tight" >ClipLink</Link>
          <div className="max-w-lg">
            <h1 className="text-5xl font-bold leading-tight">
              Shorten links.
              <br />
              Track clicks.
              <br />
              Grow faster.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Create branded short URLs, monitor
              performance, and manage every link
              from one simple dashboard.
            </p>
          </div>
          <div className="text-sm text-muted-foreground"> © 2026 ClipLink</div>
        </div>

        <div className="flex items-center justify-center p-6">

          <Card className="w-full max-w-md border-sky-100 shadow-xl">
            <CardContent className="p-8">

              <div className="mb-8">
                <div className="mb-2 lg:hidden">
                  <Link href="/" className="text-2xl font-bold">ClipLink</Link>
                </div>

                <h2 className="text-3xl font-bold">Create account</h2>
                <p className="mt-2 text-muted-foreground">Get started with ClipLink today.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                <div>
                  <label className="mb-2 block text-sm font-medium">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    {...register("name")}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Confirm Password</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                  />
                  {errors.confirmPassword &&
                    <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sky-600 hover:bg-sky-700"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Account"}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
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
