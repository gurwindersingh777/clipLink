"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { linkFormValues, linkSchema } from "@/schemas/linkSchema";
import { useCreateLink } from "@/hooks/useCreateLink";


export default function CreateLinkForm() {

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<linkFormValues>({ resolver: zodResolver(linkSchema) })

  const slug = watch("customSlug");
  const { mutate, isPending } = useCreateLink()

  const onSubmit = async (data: linkFormValues) => {
    mutate(data)
  }

  return (
    <Card className="w-full max-w-2xl border-sky-100 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          Create Short Link
        </CardTitle>

        <CardDescription>
          Paste a URL and generate a shareable link.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm font-medium">
              Destination URL
            </label>

            <Input
              placeholder="https://example.com"
              {...register("url")}
            />

            {errors.url && (
              <p className="mt-1 text-sm text-red-500">
                {errors.url.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Custom Link
            </label>

            <div className="flex">
              <div className="flex items-center rounded-l-md border border-r-0 bg-sky-50 px-3 text-sm text-sky-700">
                cliplink.com/
              </div>

              <Input
                className="rounded-l-none"
                placeholder="my-link"
                {...register("customSlug")}
              />
            </div>

            {errors.customSlug && (
              <p className="mt-1 text-sm text-red-500">
                {errors.customSlug.message}
              </p>
            )}
          </div>

          {slug && (
            <div className="rounded-lg border border-sky-100 bg-sky-50 p-3">
              <p className="text-sm text-sky-700">
                Preview
              </p>

              <p className="font-medium">
                cliplink.com/{slug}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-sky-600 hover:bg-sky-700"
          >
            {isPending
              ? <Loader2 className="animate-spin" />
              : "Create Link"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}