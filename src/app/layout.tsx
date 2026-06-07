import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/shared/providers";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: "ClipLink — Shorten links. Track clicks.",
  description: "Create branded short URLs, monitor performance with detailed analytics, and manage all your links from one simple dashboard.",
  openGraph: {
    title: "ClipLink",
    description: "Shorten links. Track clicks. Grow faster.",
    url: "https://cliplink-app.vercel.app",
    siteName: "ClipLink",
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
