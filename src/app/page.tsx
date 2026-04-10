import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { AboutSection } from "@/components/home/AboutSection";
import { GalleryPreview } from "@/components/home/GalleryPreview";
import { TeamPreview } from "@/components/home/TeamPreview";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { MembershipSection } from "@/components/home/MembershipSection";
import { CTASection } from "@/components/home/CTASection";

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
