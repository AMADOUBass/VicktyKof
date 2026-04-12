import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { ConditionalShell } from "@/components/layout/ConditionalShell";
import { Toaster } from "react-hot-toast";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "VicktyKof — Salon Spécialisé Locs & Coiffures Afro",
    template: "%s | VicktyKof",
  },
  description:
    "Salon de coiffure premium spécialisé en locs, interlocks et coiffures afro à Québec. Réservez votre rendez-vous avec Vicky et son équipe d'expertes.",
  keywords: [
    "salon locs Québec",
    "coiffure afro",
    "interlocks",
    "retwist",
    "loctician Québec",
    "VicktyKof",
    "Vicky coiffure",
    "salon afrocentric Québec",
  ],
  authors: [{ name: "VicktyKof" }],
  creator: "VicktyKof",
  openGraph: {
    type: "website",
    locale: "fr_CA",
    url: "https://vicktykof.com",
    siteName: "VicktyKof",
    title: "VicktyKof — Salon Spécialisé Locs & Coiffures Afro",
    description:
      "Salon de coiffure premium spécialisé en locs, interlocks et coiffures afro à Québec.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "VicktyKof Salon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VicktyKof — Salon Locs & Coiffures Afro",
    description: "Salon premium spécialisé en locs et coiffures afro à Québec.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://vicktykof.com"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
    apple: [
      { url: "/favicon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "VicktyKof",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#C9A84C",
  width: "device-width",
  initialScale: 1,
};

import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
          <WhatsAppButton />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A1A1A",
                color: "#F5EDD6",
                border: "1px solid rgba(201,168,76,0.3)",
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
