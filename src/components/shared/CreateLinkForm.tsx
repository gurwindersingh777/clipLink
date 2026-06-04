"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Copy, ExternalLink, Link2, Loader2, } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { linkFormValues, linkSchema, } from "@/schemas/linkSchema";
import { useCreateLink } from "@/hooks/useCreateLink";

export default function CreateLinkForm() {

  const [copied, setCopied] = useState(false)
  const [createdLink, setCreatedLink] = useState<string | null>(null)

  const { register, watch, handleSubmit, reset, formState: { errors } } = useForm<linkFormValues>({
    resolver: zodResolver(linkSchema),
  })

  const slug = watch("customSlug");
  const { mutate, isPending } = useCreateLink();

  const onSubmit = (formData: linkFormValues) => {
    mutate(formData, {
      onSuccess: (response) => {

        const link = response.data
        const shortUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin}/${link.customSlug
          ?? link.shortCode}`

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
    reset()
    setCopied(false)
    setCreatedLink(null)
  }

  return (
    <Card className="w-full max-w-2xl border-sky-100 shadow-xl">

      {createdLink ? (
        <CardContent className="py-10">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold">Link Created!</h2>
            <p className="mt-2 text-muted-foreground">Your shortened link is ready to share.</p>

            <div className="mt-6 w-full rounded-xl border bg-muted/30 p-4">
              <p className="truncate font-medium text-sky-600">{createdLink}</p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                onClick={copyLink}
                variant="default"
              >
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
                variant="secondary"
                className="bg-sky-600 hover:bg-sky-700 text-white"
                onClick={createAnother}
              >
                <Link2 className="mr-2 h-4 w-4" />
                Clip Another URL
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <>

          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Short Link</CardTitle>
            <CardDescription>Paste a URL and generate a shareable short link.</CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium">Destination URL</label>
                <Input
                  placeholder="https://example.com"
                  {...register("url")}
                />
                {errors.url && (<p className="mt-1 text-sm text-red-500">{errors.url.message}</p>)}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Custom Link</label>

                <div className="flex">
                  <div className="flex items-center rounded-l-md border border-r-0 bg-sky-50 px-3 text-sm text-sky-700">cliplink.com/</div>

                  <Input
                    className="rounded-l-none"
                    placeholder="my-link"
                    {...register("customSlug")}
                  />
                </div>

                {errors.customSlug && (<p className="mt-1 text-sm text-red-500">{errors.customSlug.message}</p>)}
              </div>

              {slug && (
                <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
                  <p className="text-sm text-sky-700">Preview</p>
                  <p className="font-medium">cliplink.com/{slug}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-sky-600 hover:bg-sky-700"
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
            </form>
          </CardContent>
        </>
      )}
    </Card>
  );
}