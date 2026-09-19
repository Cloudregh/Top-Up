import type { Metadata } from "next";
import { InfoHero, Section } from "@/components/InfoPage";
import { WhatsAppForm } from "@/components/WhatsAppForm";

export const metadata: Metadata = { title: "Corporate Health Services" };
export default function Page() {
  return (
    <>
      <InfoHero eyebrow="Health Hub · Corporate Health Services" title="Health services for your workforce" intro="Screenings, health talks and pharmacy support for companies and organisations. Tell us what your team needs and we'll come back with a plan." image="corporate" />
      <Section><div className="mx-auto max-w-2xl"><WhatsAppForm heading="Corporate Health Services enquiry" fields={[
        { name: "name", label: "Name / organisation" }, { name: "phone", label: "Phone", type: "tel" },
        { name: "note", label: "How can we help?", textarea: true },
      ]} /></div></Section>
    </>
  );
}
