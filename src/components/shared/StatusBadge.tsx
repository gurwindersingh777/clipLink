import { useToggleLink } from "@/hooks/useToggleLink";
import { Loader2 } from "lucide-react";

type Props = {
  id: string
  active: boolean
  expireAt: Date | null
}

export function StatusBadge({ id, active, expireAt }: Props) {
  const { mutate: toggleLink, isPending } = useToggleLink()

  const status = expireAt && new Date(expireAt) < new Date() ? "expired" : active ? "active" : "disabled"

  const styles = {
    active: "bg-green-100 text-green-700",
    disabled: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-700",
  }
  return (
    <span
      onClick={() => toggleLink(id)}
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium cursor-pointer min-w-17.5 ${isPending ? "" : styles[status]}`}
    >
      {isPending
        ? <Loader2 className="h-3 w-3 animate-spin text-slate-500" />
        : status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )

}