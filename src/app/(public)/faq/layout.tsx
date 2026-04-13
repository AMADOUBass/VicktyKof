import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | VicktyKof",
  description: "Tout savoir sur l'entretien des locs, les prises de rendez-vous et nos politiques de salon VicktyKof.",
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
