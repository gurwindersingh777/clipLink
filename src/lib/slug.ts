export const RESERVED_SLUGS = new Set([
  "api", "dashboard", "login", "signup", "pricing", "admin", "settings",
  "about", "terms", "privacy", "help", "support", "contact", "docs",
  "status", "blog", "app", "www",
])

export function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase()
}

export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(normalizeSlug(slug))
}