import z from "zod";

export const linkSchema = z.object({
  url: z
    .string()
    .min(1, "Please enter a valid URL")
    .url({ message: "Please enter a valid URL" })
    .refine((value) => {
      try {
        const { protocol } = new URL(value)
        return protocol === "http:" || protocol === "https:"
      } catch {
        return false
      }
    }, { message: "Only http and https links are allowed" }),
  customSlug: z
    .string()
    .min(3, "Custom Link should be more than 2 character")
    .max(50, "Custom Link should be less than 50 character")
    .regex(/^[A-Za-z0-9-]+$/, "Only letters, numbers, and hyphens are allowed")
    .optional()
    .or(z.literal("")),
})

export type linkFormValues = z.infer<typeof linkSchema>