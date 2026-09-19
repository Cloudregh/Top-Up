import type { Metadata } from "next";
import { InfoHero, Section } from "@/components/InfoPage";
import { WhatsAppForm } from "@/components/WhatsAppForm";

export const metadata: Metadata = { title: "Travel Health" };
export default function Page() {
  return (
    <>
      <InfoHero eyebrow="Health Hub · Travel Health" title="Travel with confidence" intro="Pre-travel advice, vaccinations and medicines for your trip. Speak to a pharmacist before you go." image="travel" />
      <Section><div className="mx-auto max-w-2xl"><WhatsAppForm heading="Travel Health enquiry" fields={[
        { name: "name", label: "Name / organisation" }, { name: "phone", label: "Phone", type: "tel" },
        { name: "note", label: "How can we help?", textarea: true },
      ]} /></div></Section>
    </>
  );
}
