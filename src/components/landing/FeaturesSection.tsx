import {
  Link2,
  BarChart3,
  QrCode,
  Rocket,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Custom Short Links",
    description:
      "Create memorable branded URLs. Share clean links that look professional and improve trust.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    description:
      "Track clicks, engagement, and performance. Understand which links drive the most traffic.",
  },
  {
    icon: QrCode,
    title: "QR Code Generation",
    description:
      "Generate QR codes instantly for every link. Perfect for print, events, and offline marketing.",
  },
  {
    icon: Rocket,
    title: "Free To Start",
    description:
      "Launch in seconds with a free account. Upgrade only when your growth requires more features.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="px-6 py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Everything you need</h2>
          <p className="mt-4 text-muted-foreground">Powerful tools for managing and tracking your links.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {features.map((feature) => {
            const Icon = feature.icon

            return (
              <div key={feature.title} className="rounded-2xl border bg-white p-8 transition hover:shadow-lg">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-100">
                  <Icon className="h-6 w-6 text-sky-600" />
                </div>

                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}