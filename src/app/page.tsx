import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";

const AboutSection = dynamic(() => import("@/components/home/AboutSection").then(mod => mod.AboutSection));
const GalleryPreview = dynamic(() => import("@/components/home/GalleryPreview").then(mod => mod.GalleryPreview));
const TeamPreview = dynamic(() => import("@/components/home/TeamPreview").then(mod => mod.TeamPreview));
const TestimonialsSection = dynamic(() => import("@/components/home/TestimonialsSection").then(mod => mod.TestimonialsSection));
const MembershipSection = dynamic(() => import("@/components/home/MembershipSection").then(mod => mod.MembershipSection));
const CTASection = dynamic(() => import("@/components/home/CTASection").then(mod => mod.CTASection));

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <GalleryPreview />
      <TeamPreview />
      <TestimonialsSection />
      <MembershipSection />
      <CTASection />
    </>
  );
}
