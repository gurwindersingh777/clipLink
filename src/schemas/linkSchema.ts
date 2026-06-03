import z from "zod";

export const linkSchema = z.object({
  url: z
    .string()
    .min(1,"Please enter a valid URL")
    .url({ message: "Please enter a valid URL" }),
  customSlug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers, and hyphens are allowed")
    .optional()
    .or(z.literal("")),
})

export type linkFormValues = z.infer<typeof linkSchema>