import DashboardNavbar from "@/components/shared/DashboardNavbar";

export default function ProtectedLayout({ children, }: { children: React.ReactNode }) {
  return (
    <>
      <DashboardNavbar />
      {children}
    </>
  )
}