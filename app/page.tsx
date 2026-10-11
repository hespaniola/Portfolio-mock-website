import { Hero } from "@/components/sections/Hero";
import { Showreel } from "@/components/sections/Showreel";
import { Work } from "@/components/sections/Work";
import { Services } from "@/components/sections/Services";
import { Packages } from "@/components/sections/Packages";
import { Process } from "@/components/sections/Process";
import { About } from "@/components/sections/About";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Showreel />
        <Work />
        <Services />
        <Packages />
        <Process />
        <About />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
