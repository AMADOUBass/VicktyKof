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
    url: "https://vicktykof.beauty",
    siteName: "VicktyKof",
    title: "VicktyKof — Salon Spécialisé Locs & Coiffures Afro",
    description:
      "Salon de coiffure premium spécialisé en locs, interlocks et coiffures afro à Québec.",
    images: [{ url: "/og-image-premium.png", width: 1200, height: 630, alt: "VicktyKof Salon" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "VicktyKof — Salon Locs & Coiffures Afro",
    description: "Salon premium spécialisé en locs et coiffures afro à Québec.",
    images: ["/og-image-premium.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://vicktykof.beauty"),
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
  verification: {
    google: "BD8g4gg6BkZJzfjsj5o1MyGB8TKit30ejFhRmvJL6nQ",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HairSalon",
  "name": "VicktyKof",
  "image": "https://vicktykof.beauty/og-image-premium.png",
  "@id": "https://vicktykof.beauty",
  "url": "https://vicktykof.beauty",
  "telephone": "+15817457409",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "2177 rue du Carrousel",
    "addressLocality": "Qu\u00e9bec",
    "addressRegion": "QC",
    "postalCode": "G2B 5B5",
    "addressCountry": "CA"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 46.8139,
    "longitude": -71.2082
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      "opens": "09:00",
      "closes": "18:00"
    }
  ],
  "sameAs": [
    "https://www.facebook.com/Victykofhairbeauty/",
    "https://www.instagram.com/vicktykof_beaute_locks_quebec/",
    "https://www.tiktok.com/@vicktykof"
  ],
  "priceRange": "$$"
};

export const viewport: Viewport = {
  themeColor: "#C9A84C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};



import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PostHogPageView from "@/components/layout/PostHogPageView";
import { CookieConsent } from "@/components/layout/CookieConsent";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://us-assets.i.posthog.com" />
        <link rel="preconnect" href="https://us.i.posthog.com" />
      </head>
      <body className="min-h-screen flex flex-col">
        <PostHogPageView />
        <CookieConsent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
