import { useCallback } from "react";
import { useLanguage } from "./language-context";
import translations from "./hi-text.json";

const dictionary: Readonly<Record<string, string>> = translations;
const caseInsensitiveDictionary: Readonly<Record<string, string>> = Object.fromEntries(
  Object.entries(dictionary).map(([key, value]) => [key.toLowerCase(), value]),
);
const normalize = (text: string) => text.replace(/\s+/g, " ").trim();
const terms: Record<string, string> = {
  revenex: "रेवेनेक्स", erp: "ईआरपी", ai: "कृत्रिम बुद्धिमत्ता",
  "google cloud": "गूगल क्लाउड", gemini: "जेमिनी", razorpay: "रेज़रपे",
  firebase: "फ़ायरबेस", twilio: "ट्विलियो", whatsapp: "व्हाट्सऐप",
  cbse: "सीबीएसई", icse: "आईसीएसई", ssc: "एसएससी", edtech: "शिक्षा तकनीक",
  gdpr: "डेटा संरक्षण नियम", gps: "स्थान निगरानी", ist: "भारतीय समय",
  faq: "सामान्य प्रश्न", ceo: "मुख्य कार्यकारी अधिकारी", cto: "मुख्य प्रौद्योगिकी अधिकारी",
  sms: "एसएमएस", pdf: "पीडीएफ़", upi: "यूपीआई", ocr: "अक्षर पहचान",
  jan: "जनवरी", feb: "फ़रवरी", mar: "मार्च", apr: "अप्रैल", may: "मई", jun: "जून",
  jul: "जुलाई", aug: "अगस्त", sep: "सितंबर", oct: "अक्टूबर", nov: "नवंबर", dec: "दिसंबर",
};
const termPattern = /https?:\/\/\S+|[\w.+-]+@[\w.-]+|\b(?:Google Cloud|Revenex|ERP|AI|Gemini|Razorpay|Firebase|Twilio|WhatsApp|CBSE|ICSE|SSC|EdTech|GDPR|GPS|IST|FAQ|CEO|CTO|SMS|PDF|UPI|OCR|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/gi;
const classNames: Record<string, string> = { I: "पहली", II: "दूसरी", III: "तीसरी", IV: "चौथी", V: "पाँचवीं", VI: "छठी", VII: "सातवीं", VIII: "आठवीं", IX: "नौवीं", X: "दसवीं", XI: "ग्यारहवीं", XII: "बारहवीं" };

function translateInterpolated(text: string) {
  const countdown = /^Starts in (\d+)m (\d+)s$/.exec(text);
  if (countdown) return `${countdown[1]} मिनट ${countdown[2]} सेकंड में शुरू`;
  const days = /^(\d+) days$/.exec(text);
  if (days) return `${days[1]} दिन`;
  const zones = /^\/(\d+) armed$/.exec(text);
  if (zones) return `/${zones[1]} सक्रिय`;
  const classMatch = /^(Class )?([IVX]+)-([A-Z])$/.exec(text);
  if (classMatch && classNames[classMatch[2]!]) {
    const section = ({ A: "अ", B: "ब", C: "स", D: "द" } as Record<string, string>)[classMatch[3]!] ?? classMatch[3];
    return `${classMatch[1] ? "कक्षा " : ""}${classNames[classMatch[2]!]}-${section}`;
  }
  const time = /^(\d{1,2}:\d{2}) (AM|PM)$/.exec(text);
  if (time) return `${time[2] === "AM" ? "सुबह" : "दोपहर"} ${time[1]} बजे`;
  return text;
}

/** Translate presentation text only. Form values, URLs, identifiers and data stay untouched. */
export function translateHindiText<T>(value: T, language: "en" | "hi"): T {
  if (language !== "hi") return value;
  if (Array.isArray(value)) return value.map(item => translateHindiText(item, language)) as T;
  if (typeof value !== "string") return value;
  const key = normalize(value);
  const translated = translateInterpolated(dictionary[key] ?? caseInsensitiveDictionary[key.toLowerCase()] ?? key)
    .replace(termPattern, term => terms[term.toLowerCase()] ?? term);
  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  return (leading + translated + trailing) as T;
}

/** Subscribe each view to the shared language; translate at render time, never mutate the DOM. */
export function useHindiText() {
  const { language } = useLanguage();
  return useCallback(<T,>(value: T): T => translateHindiText(value, language), [language]);
}
