import {
  Hero,
  Features,
  BestSellers,
  HowItWorks,
  CtaSection,
} from "@/components/marketing/sections";
import { Testimonials } from "@/components/marketing/testimonials";
import { Faq } from "@/components/marketing/faq";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <BestSellers />
      <HowItWorks />
      <Testimonials />
      <Faq />
      <CtaSection />
    </>
  );
}
