import { Click } from "@prisma/client"
import { format } from "date-fns"


export const analyticsUtils = {

  getClicksByDay(clicks: Click[]) {
    const grouped = clicks.reduce((acc, click) => {
      const day = format(click.createdAt, "MMM d")
      acc[day] = (acc[day] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([date, clicks]) => ({ date, clicks }))
  },

  getClicksByReferrer(clicks: Click[]) {
    const grouped = clicks.reduce((acc, click) => {
      const source = (() => {
        if (!click.referer) return "Direct"
        try {
          return new URL(click.referer).hostname
        } catch {
          return "Direct"
        }
      })()
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  },

  getClicksByCountry(clicks: Click[]) {
    const grouped = clicks.reduce((acc, click) => {
      const country = click.country ?? "Unknown"
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(grouped).map(([name, value]) => ({ name, value }))
  },
}