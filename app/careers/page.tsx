import type { Metadata } from "next";
import { InfoHero, Section } from "@/components/InfoPage";
import { WhatsAppForm } from "@/components/WhatsAppForm";

export const metadata: Metadata = { title: "Careers" };
export default function Careers() {
  return (
    <>
      <InfoHero eyebrow="Careers" title="Join the Top-Up team" intro="Help us deliver quality healthcare across Ghana. Tell us about yourself and the role you're interested in." image="about_counter" />
      <Section waitingFor="POST /enquiries (forms currently hand off to WhatsApp)"><div className="mx-auto max-w-2xl"><WhatsAppForm heading="Career enquiry" fields={[
        { name: "name", label: "Full name" }, { name: "phone", label: "Phone", type: "tel" },
        { name: "role", label: "Role of interest" }, { name: "branch", label: "Preferred branch" },
        { name: "note", label: "About you", textarea: true },
      ]} /></div></Section>
    </>
  );
}
