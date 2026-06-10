"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Copy, ExternalLink, Link2, Loader2, Lock, } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linkFormValues, linkSchema } from "@/schemas/linkSchema";
import { useCreateLink } from "@/hooks/useCreateLink";
import { authClient } from "@/lib/auth-client";
import { useLinks } from "@/hooks/useLinks";
import Link from "next/link";
import { TIERS } from "@/lib/constants";

export default function CreateLinkForm() {

  const session = authClient.useSession()

  const { data: links = [], isPending: linksPending } = useLinks()

  const tier = session.data?.user.tier ?? "FREE"
  const isAtLimit = tier === "FREE" && links.length >= TIERS.FREE.maxLinks

  const [copied, setCopied] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null);

  const { register, watch, handleSubmit, reset, formState: { errors }
  } = useForm<linkFormValues>({ resolver: zodResolver(linkSchema) })

  const slug = watch("customSlug")

  const { mutate, isPending } = useCreateLink()

  const onSubmit = (formData: linkFormValues) => {
    if (tier === "FREE") {
      delete formData.customSlug
    }

    mutate(formData, {
      onSuccess: (response) => {
        const link = response.data
        const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ??
          window.location.origin}/${link.customSlug ?? link.shortCode}`
        setCreatedLink(shortUrl)
      },
    })
  }

  const copyLink = async () => {
    if (!createdLink) return

    try {
      await navigator.clipboard.writeText(createdLink)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (error) {
      console.error(error)
    }
  }

  const createAnother = () => {
    reset();
    setCopied(false);
    setCreatedLink(null);
  };

  return (
    <Card className="border border-slate-200/60 bg-white shadow-sm">
      {createdLink ? (
        <CardContent className="py-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900">Link Created</h2>
            <p className="mt-2 text-slate-500">Your shortened link is ready to share.</p>

            <div className="mt-6 w-full max-w-xl rounded-xl border bg-slate-50 p-4">
              <p className="truncate font-medium text-sky-600">{createdLink}</p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button onClick={copyLink}>
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </Button>

              <Button
                variant="outline"
                asChild
              >
                <a
                  href={createdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Link
                </a>
              </Button>

              <Button
                variant="outline"
                onClick={createAnother}
              >
                <Link2 className="mr-2 h-4 w-4" />
                Create Another
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Create Short Link</CardTitle>
            <CardDescription>Paste a URL and generate a shareable short link.</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
                <div>
                  <label className="mb-2 block text-sm font-medium">Destination URL</label>

                  <div className="flex gap-2">
                    <Input
                      placeholder="https://example.com"
                      className="h-11"
                      {...register("url")}
                    />
                    <Button
                      type="submit"
                      disabled={isPending || isAtLimit || linksPending}
                      className="h-11 bg-sky-600  sm:px-8 hover:bg-sky-700 "
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Link"
                      )}
                    </Button>
                  </div>

                  {errors.url && <p className="mt-1 text-sm text-red-500">{errors.url.message}</p>}
                </div>

              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-sm font-medium">Custom Link</label>

                  {tier === "FREE" && <Lock className="h-3 w-3 text-muted-foreground" />}
                </div>

                <div className="flex">
                  <div className="flex items-center rounded-l-md border border-r-0 bg-slate-50 px-3 text-sm text-slate-600 whitespace-nowrap">
                    {new URL(process.env.NEXT_PUBLIC_APP_URL!).host}
                  </div>

                  <Input
                    disabled={tier === "FREE"}
                    className="h-11 rounded-l-none"
                    placeholder="my-link"
                    {...register("customSlug")}
                  />
                </div>
              </div>

              {tier === "PRO" && slug && (
                <div className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <p className="text-sm text-sky-600">Preview</p>
                  <p className="mt-1 font-medium text-slate-900">
                    {new URL(process.env.NEXT_PUBLIC_APP_URL!).host}/{slug}
                  </p>
                </div>
              )}

              {tier === "FREE" && (
                <div className="text-center text-xs text-slate-500">
                  {links.length} / {TIERS.FREE.maxLinks} links used
                </div>
              )}

              {isAtLimit && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="font-medium text-amber-900">You've reached your free plan limit.</p>
                  <p className="mt-1 text-sm text-amber-700">
                    Upgrade to create unlimited links and unlock premium features.
                  </p>

                  <Button
                    asChild
                    className="mt-3"
                  >
                    <Link href="/pricing">Upgrade Now</Link>
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </>
      )}
    </Card>
  )

}
