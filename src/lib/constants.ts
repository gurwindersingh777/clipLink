
export const TIERS = {
  FREE: {
    maxLinks: 15,
    label: "Free"
  },
  PRO: {
    maxLinks: Infinity,
    label: "Pro"
  }
} as const

export const PRO_PLAN = {
  amount: 49900,   // ₹499.00
  currency: "INR",
  name: "ClipLink Pro",
} as const