import CreateLinkForm from "@/components/shared/CreateLinkForm";
import LinksTable from "@/components/shared/LinksTable";
import StatsCards from "@/components/shared/StatsCards";

export default function DashboardPage() {

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
            <p className="mt-1 text-slate-500">Create, manage and track all your links from one place.</p>
          </div>
        </div>

        <div className="mb-10"><CreateLinkForm /></div>
        <div className="mb-10"><StatsCards /></div>
        <LinksTable />
      </div>
    </main>
  )
}