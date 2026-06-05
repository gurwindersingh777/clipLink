import CreateLinkForm from "@/components/shared/CreateLinkForm";
import LinksTable from "@/components/shared/LinksTable";
import StatsCards from "@/components/shared/StatsCards";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="bg-linear-to-b from-sky-100 via-sky-100 to-white">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              Dashboard
            </h1>

            <p className="mt-3 text-muted-foreground">
              Create, manage and track all your links.
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            <CreateLinkForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <StatsCards />

        <div className="mt-8">
          <LinksTable />
        </div>
      </section>
    </main>
  );
}