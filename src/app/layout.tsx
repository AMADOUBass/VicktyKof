import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { ConditionalShell } from "@/components/layout/ConditionalShell";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "VicktyKof Salon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VicktyKof — Salon Locs & Coiffures Afro",
    description: "Salon premium spécialisé en locs et coiffures afro à Québec.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://vicktykof.com"),
};

export const viewport: Viewport = {
  themeColor: "#C9A84C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <ConditionalShell>{children}</ConditionalShell>
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
