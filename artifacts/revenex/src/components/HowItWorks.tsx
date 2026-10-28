import { FeatureSteps, type Feature } from "@/components/ui/feature-section";

export function HowItWorks({ language }: { language: "en" | "hi" }) {
  const hi = language === "hi";
  const features: Feature[] = [
    {
      step: "01",
      title: hi ? "बातचीत और आपकी ज़रूरतें" : "Contact & discovery",
      content: hi
        ? "हमें अपने स्कूल के बारे में बताएं। हम आपकी ज़रूरतों को समझकर सही योजना बनाते हैं।"
        : "Tell us about your school. We listen, understand your needs and map out the right plan.",
      image: "/images/how-it-works/discovery.webp",
      imageAlt:
        "School principal discussing requirements with a Revenex consultant on a video call",
      caption: hi
        ? "हर अच्छे बदलाव की शुरुआत एक बातचीत से होती है।"
        : "A better school day starts with a conversation.",
    },
    {
      step: "02",
      title: hi ? "आपके स्कूल के अनुसार सेटअप" : "Your ERP, made yours",
      content: hi
        ? "आपके रिकॉर्ड, फ़ीस और प्रक्रियाओं के अनुसार हम सिस्टम तैयार करते हैं।"
        : "We configure your modules, organise your records and shape the platform around your school.",
      image: "/images/how-it-works/setup.webp",
      imageAlt:
        "School ERP dashboard with attendance, fees and configuration modules",
      caption: hi
        ? "आपकी प्रक्रियाएं। आपका डेटा। एक जगह।"
        : "Your workflows. Your data. One connected place.",
    },
    {
      step: "03",
      title: hi ? "टीम की ट्रेनिंग" : "Get your team confident",
      content: hi
        ? "शिक्षकों और स्टाफ को आसान ट्रेनिंग और रोज़मर्रा के कामों में मदद मिलती है।"
        : "Practical walkthroughs help teachers and staff feel comfortable with their everyday tasks.",
      image: "/images/how-it-works/training.webp",
      imageAlt:
        "Teachers learning to use school software through a guided training session",
      caption: hi
        ? "सिर्फ नया सॉफ़्टवेयर नहीं — एक तैयार टीम।"
        : "More than new software. A team ready to use it.",
    },
    {
      step: "04",
      title: hi ? "लॉन्च और आगे भी साथ" : "Go live. We stay with you.",
      content: hi
        ? "आत्मविश्वास के साथ शुरू करें। सवालों, अपडेट और आगे के कामों में हमारी टीम आपके साथ है।"
        : "Launch with confidence, with our team available for questions, updates and the next step forward.",
      image: "/images/how-it-works/launch.webp",
      imageAlt:
        "Connected school campus and successful ERP launch illustrated with a gold rocket",
      caption: hi
        ? "एक सहज शुरुआत। हर दिन बेहतर संचालन।"
        : "A smooth start. Better days ahead.",
    },
  ];
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-t border-[#E8E0D4] bg-[#F5F0E8] py-16 sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-52 top-0 h-[580px] w-[580px] rounded-full bg-[#DFCAA9]/20 blur-[100px]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#DDCEBA] bg-[#EEE5D8]/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#8B4513]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B58447]" />{" "}
            {hi ? "कैसे काम करता है" : "HOW IT WORKS"}
          </span>
          <h2 className="mt-5 text-[clamp(1.9rem,4vw,3.2rem)] font-extrabold leading-[1.12] tracking-[-.045em] text-[#241A13]">
            {hi ? (
              <>
                आपकी शुरुआत से
                <br className="sm:hidden" />{" "}
                <span className="text-[#8B4513]">सफल संचालन तक।</span>
              </>
            ) : (
              <>
                From first hello
                <br className="sm:hidden" /> to{" "}
                <span className="text-[#8B4513]">ready to go.</span>
              </>
            )}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#7B6B5C] sm:text-base">
            {hi
              ? "चार आसान चरण। हर कदम पर हमारी टीम आपके साथ।"
              : "Four simple steps. A personal approach. We handle the setup, so you can focus on your school."}
          </p>
        </div>
        <FeatureSteps
          features={features}
          autoPlayInterval={2000}
          language={language}
        />
      </div>
    </section>
  );
}
