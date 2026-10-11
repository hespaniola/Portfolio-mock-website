import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <main>
        <Contact id="contact-page" page />
      </main>
      <Footer />
    </>
  );
}
