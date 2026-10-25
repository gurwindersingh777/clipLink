import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"

const REDIRECT_LIMIT = Number(process.env.REDIRECT_RATE_LIMIT) || 60

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const createLinkLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "ratelimit:create",
})

export const redirectLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(REDIRECT_LIMIT, "1 m"),
  prefix: "ratelimit:redirect",
})