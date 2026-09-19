import { BRANCHES_LIST } from "./branches";
// Top-Up Pharmacy site content & structure (from top-uppharmacy.com).
export const NAV = [
  { href: "/", label: "Home" },
  { label: "About", children: [{ href: "/about", label: "About Us" }, { href: "/why-choose-us", label: "Why Choose Us" }, { href: "/faq", label: "FAQ's" }] },
  { href: "/services", label: "Services" },
  { label: "Health Hub", children: [{ href: "/prescriptions", label: "Prescriptions" }, { href: "/appointment", label: "Book Appointment" }, { href: "/corporate-health", label: "Corporate Health Services" }, { href: "/travel-health", label: "Travel Health" }] },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
  { href: "/shop", label: "Shop" },
] as const;

export const SERVICES = [
  { t: "24hrs Pharmaceutical Services", d: "Visit any branch, day or night, for care specific to your health needs." },
  { t: "Basic Diagnostic Services", d: "Quick health checks such as blood pressure and glucose." },
  { t: "Weight Management Services", d: "Guidance and follow-up to help you reach your goals." },
  { t: "Counselling Services", d: "Private, professional advice from our pharmacists." },
  { t: "Home & Office Delivery Services", d: "Choose from a number of delivery options available." },
  { t: "Medication Therapy Management", d: "Reviews that keep your medicines safe and effective." },
  { t: "Cosmetology", d: "Skin and beauty care at the branch." },
] as const;

// logo: file in /public/images/insurers. Missing logo => name plate. Add the file + set `logo` to swap in.
export interface Insurer { name: string; logo?: string; bg?: string }
export const INSURERS: Insurer[] = [
  { name: "GLICO Health", logo: "/images/insurers/glico.png" },
  { name: "Metropolitan Health Insurance", logo: "/images/insurers/metropolitan.png" },
  { name: "Phoenix Insurance", logo: "/images/insurers/phoenix.png" },
  { name: "Ace Medical Insurance", logo: "/images/insurers/ace.png" },
  { name: "Premier Health Insurance", logo: "/images/insurers/premier.png" },
  { name: "Acacia Health Insurance", logo: "/images/insurers/acacia.png", bg: "#722fa0" },
  { name: "GHIC (GAB Health)", logo: "/images/insurers/ghic.svg" },
];

export interface Award { t: string; by: string; img: string; pos?: string }
export const AWARDS: Award[] = [
  { t: "Pharmacy Retail Chain Company of the Year 2026", by: "Ghana–West Africa Healthcare Excellence Awards, 9th Edition", img: "/images/awards/trophy-2026.jpg", pos: "50% 42%" },
  { t: "Certificate of Award", by: "Ghana–West Africa Healthcare Excellence Awards", img: "/images/awards/certificate-handover.jpg", pos: "50% 30%" },
  { t: "Ghana's Top 10 Pharmaceutical Industry Award — Community Pharmacy", by: "HCOWA Excellence in Healthcare Awards, 2025", img: "/images/awards/hcowa-citation.jpg", pos: "50% 60%" },
  { t: "Africa Best Business Awards (Ghana)", by: "November 2025", img: "/images/awards/africa-best-group.jpg", pos: "50% 30%" },
  { t: "Africa Best Business Awards — trophy presentation", by: "Africa Best Business Awards (Ghana)", img: "/images/awards/africa-best-handshake.jpg", pos: "50% 30%" },
  { t: "Ghana International Product Awards", by: "Powered by West Africa Chamber of Commerce and Industry", img: "/images/awards/gipa-handshake.jpg", pos: "50% 35%" },
  { t: "Ghana International Product Awards — certificate", by: "Ghana International Product Awards", img: "/images/awards/gipa-group.jpg", pos: "50% 30%" },
  { t: "National Honours & Awards 2024", by: "Honouring our Distinguished Citizens", img: "/images/awards/national-honours.jpg", pos: "50% 82%" },
];


export const NEWS = [
  { t: "Top-Up Pharmacy Supports Graphic's Annual Free Healthcare Screening", d: "2025-09-06" },
  { t: "Top-Up Pharmacy offers free health screening to residents at Asenemaso Abuakwa", d: "2025-09-05" },
  { t: "One Year Of Unwavering Commitment At Top-Up Pharmacy Asenemaso-Abuakwa!", d: "2025-09-05" },
  { t: "Top-Up Pharmacy Recognized By Premier Health Insurance For Outstanding Pharmaceutical Services", d: "2025-09-04" },
  { t: "Customers' Choice Awards Ghana 2024 Pharmaceutical Company Of The Year", d: "2025-09-04" },
  { t: "Unichem Ghana Group Loyalty Award Of Appreciation", d: "2025-09-04" },
  { t: "Ghana Pharma Awards 2023 Community Pharmacy Sigma Award", d: "2025-09-04" },
  { t: "Top-Up Pharmacy Honored by the Ghana College of Pharmacists for 10 Years of Contribution", d: "2025-09-04" },
];

export const FAQS = [
  ["Are you open 24/7?", "Yes. Our 24hrs Pharmaceutical Services mean you can visit any branch for care at any hour, and our customer hotline is staffed around the clock."],
  ["Can I order prescription medicines online?", "Yes. Upload a photo or PDF of your prescription; a pharmacist reviews it and you'll see the decision and their note in your account. Once approved you can order the controlled items it covers."],
  ["Do you deliver?", "We offer Home & Office Delivery, with a number of delivery options available. You choose delivery or branch pickup at checkout and can track the order once it's dispatched."],
  ["Which health insurers do you work with?", "GLICO, Metropolitan Health Insurance, Phoenix Insurance, Ace Medical Insurance, Premier Health Insurance, Acacia Health Insurance and GHIC."],
  ["How do I pay?", "Pay securely online with mobile money or card via Paystack. Approved business accounts can also be set up on credit contact our team."],
  ["How do I reach customer service?", "Tap the “Need help?” button on any page for an instant reply on WhatsApp or by phone, or call our 24/7 hotline."],
] as const;



/**
 * Campaign / condition explainers. General educational copy — PLACEHOLDER until the CMS
 * supplies pharmacist-approved text. `searchTerms` are sent to GET /catalogue?q= so the
 * medicines shown at the bottom of each page always come live from the API.
 */
export interface Campaign {
  slug: string; title: string; card: string; img: "campaign_cough" | "campaign_pain" | "campaign_early";
  intro: string; why: string[]; selfCare: string[]; seeHelp: string[]; searchTerms: string[];
  cta?: { href: string; label: string };
}
export const CAMPAIGNS: Campaign[] = [
  {
    slug: "cough-cold-flu", title: "Kick that cough away", card: "Cough, cold & flu care", img: "campaign_cough",
    intro: "A cough is your body's way of clearing your airways. Most coughs and colds are caused by viruses and settle by themselves, but the right care can make you much more comfortable while they do.",
    why: ["Viral infections such as the common cold and flu are the most frequent cause.", "Allergies, dust, smoke and dry air can irritate the throat and airways.", "Acid reflux and some medicines can cause a lingering dry cough.", "A dry, tickly cough and a chesty, phlegm-producing cough are treated differently tell your pharmacist which you have."],
    selfCare: ["Rest and drink plenty of fluids.", "Warm drinks with honey and lemon can soothe the throat (not for babies under 1 year).", "Breathe steam or use a humidifier to loosen phlegm.", "Avoid smoke and other irritants, and wash your hands often to avoid passing it on."],
    seeHelp: ["A cough lasting more than three weeks.", "Shortness of breath, wheezing or chest pain.", "Coughing up blood, or a high fever that won't settle.", "A cough in a young baby, an older adult, or someone with a long-term condition."],
    searchTerms: ["cough", "cold", "flu", "syrup"],
  },
  {
    slug: "pain-relief", title: "Fast pain relief", card: "Headache, body & muscle pain", img: "campaign_pain",
    intro: "Headaches and body aches are common and usually short-lived. Understanding what's behind your pain helps you choose the right relief and know when it needs a closer look.",
    why: ["Tension headaches are often linked to stress, poor sleep, long screen time or dehydration.", "Muscle aches can follow exercise, strain, lifting or sitting in one position too long.", "Infections such as flu or malaria can bring body aches with fever.", "Migraines cause a throbbing headache, often with nausea or light sensitivity."],
    selfCare: ["Rest in a quiet, dim room and drink water.", "A warm or cold compress on the sore area can ease pain.", "Gentle stretching and movement help stiff muscles.", "Keep a note of when the pain starts patterns help your pharmacist advise you."],
    seeHelp: ["A sudden, severe headache unlike any before.", "Headache with fever, stiff neck, confusion or vision changes.", "Pain after an injury or fall.", "Pain that keeps returning or lasts more than a few days."],
    searchTerms: ["paracetamol", "ibuprofen", "diclofenac", "pain"],
  },
  {
    slug: "early-detection", title: "Early detection saves lives", card: "Breast Cancer Awareness Month mammograms catch it early", img: "campaign_early",
    intro: "Finding breast cancer early gives the best chance of successful treatment. Our goal throughout the month is to stress the importance of mammograms as the best screening tool to detect breast cancer early.",
    why: ["Screening can find changes before you can feel or see them.", "Regular breast self-checks help you learn what's normal for you.", "Risk rises with age and can be higher with a family history but anyone can be affected."],
    selfCare: ["Check your breasts regularly and know your normal.", "Look for a new lump, a change in size or shape, dimpling of the skin, or changes to the nipple.", "Book a screening or mammogram don't wait for symptoms.", "Encourage the women in your life to get checked too."],
    seeHelp: ["Any new lump or thickening in the breast or armpit.", "Skin changes, redness or dimpling.", "Nipple discharge or a nipple that turns inward.", "Persistent pain in one area."],
    searchTerms: [], cta: { href: "/appointment", label: "Book a screening appointment" },
  },
];

export const LOCATIONS = BRANCHES_LIST.map((b) => ({ name: b.name, addr: b.area }));
