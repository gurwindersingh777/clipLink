
type StatusType = "active" | "disabled" | "expired";

export function StatusBadge({ status, }: { status: StatusType }) {
  const styles: Record<StatusType, string> = {
    active: "bg-green-100 text-green-700",
    disabled: "bg-yellow-100 text-yellow-700",
    expired: "bg-red-100 text-red-700",
  }

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}