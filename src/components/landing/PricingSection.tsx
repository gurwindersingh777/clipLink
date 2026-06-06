import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TIERS } from "@/lib/constants";

const plans = [
  {
    name: TIERS.FREE.label,
    price: "$0",
    cta: "Get Started",
    href: "/signup",
    highlighted: false,
    features: [
      {
        label: `${TIERS.FREE.maxLinks} links`,
        included: true,
      },
      {
        label: "Basic analytics",
        included: true,
      },
      {
        label: "QR codes",
        included: true,
      },
      {
        label: "Custom slugs",
        included: false,
      },
    ],
  },
  {
    name: TIERS.PRO.label,
    price: "$9",
    cta: "Upgrade",
    href: "/pricing",
    highlighted: true,
    features: [
      {
        label: "Unlimited links",
        included: true,
      },
      {
        label: "Advanced analytics",
        included: true,
      },
      {
        label: "QR codes",
        included: true,
      },
      {
        label: "Custom slugs",
        included: true,
      },
    ],
  },
];

export default function PricingSection() {
  return (
    <section className="bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Simple pricing</h2>

          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you need unlimited links and advanced features.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border p-8 ${plan.highlighted
                ? "border-sky-500 bg-white shadow-xl"
                : "bg-white"
                }`}
            >
              {plan.highlighted && (
                <div className="absolute right-6 top-6 rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold text-white">
                  Most Popular
                </div>
              )}

              <h3 className="text-2xl font-bold">{plan.name}</h3>

              <div className="mt-4">
                <span className="text-5xl font-bold">{plan.price}</span>
                {plan.price !== "$0" && <span className="ml-2 text-muted-foreground">/month</span>}
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature.label}
                    className="flex items-center gap-3"
                  >
                    {feature.included
                      ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-muted-foreground" />}

                    <span>{feature.label}</span>
                  </li>
                ))}
              </ul>

              <Button asChild className="mt-8 w-full" variant={plan.highlighted ? "default" : "outline"}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}