"use client";

import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { PromoBanner } from "@/shared/ui/PromoBanner";

const sections = [
  {
    title: "Advertising Disclosure",
    body: [
      "This website, [pathvoyager.com], participates in the Google AdSense advertising program. This means we display advertisements provided by Google and may receive compensation when visitors click on these ads or perform certain actions.",
      "Google AdSense uses cookies to serve ads based on your prior visits to this website and other websites. This allows Google and its partners to display ads tailored to your interests based on your browsing history. You can opt out of personalized advertising by visiting Google's Ads Settings.",
    ],
  },
  {
    title: "Third-Party Advertising",
    body: [
      "The advertisements you see on this site are delivered by Google AdSense and other third-party advertising companies. These companies may use information about your visits to this and other websites to provide advertisements about goods and services that may interest you.",
      "We do not have direct control over the specific ads displayed through Google AdSense, as they are generated automatically based on your interests and browsing behavior.",
    ],
  },
  {
    title: "Affiliate Links Disclosure",
    body: [
      "In addition to Google AdSense, some articles on this website may contain affiliate links to travel companies, booking platforms, or travel gear retailers. If you make a purchase through these links, we may earn a small commission at no extra cost to you. These affiliate relationships do not influence our content or recommendations.",
    ],
  },
  {
    title: "Content Accuracy",
    body: [
      "While we strive to provide accurate and up-to-date travel information, the content on this site is for general informational purposes only. We make no representations or warranties of any kind about the completeness, accuracy, reliability, or availability of the information contained on the website.",
    ],
  },
  {
    title: "No Professional Advice",
    body: [
      "The content on this website does not constitute professional travel advice. For specific travel concerns, health advisories, or legal requirements, consult with appropriate professionals and official government sources.",
    ],
  },
  {
    title: "Consent",
    body: [
      "By using our website, you hereby consent to our disclaimer and agree to its terms. If you do not agree with any part of this disclaimer, please discontinue use of our website.",
    ],
  },
];

export default function Disclaimer() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex-1">
        <SiteHeader />

        <main className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[960px] flex-col gap-[40px] px-4 py-16 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
          <header className="flex flex-col gap-5">
            <h1 className="font-playfair text-[32px] font-normal leading-[110%] text-[#333333] text-center">
              Website Disclaimer
            </h1>
          </header>

          <div className="flex flex-col gap-[40px]">
            {sections.map((section) => (
              <section key={section.title} className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  {section.title}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-open-sans text-base leading-[1.6] text-[#333333]"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
            <p className="font-open-sans text-sm leading-[1.6] text-[#767676]">
              Last updated: 10.11.2025
            </p>
          </div>
        </div>
      </main>

        <div className="mx-auto w-full max-w-[960px] px-4 max-[400px]:max-w-[340px] max-[400px]:px-[10px]">
          <PromoBanner
            title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
            width="100%"
            height={90}
          />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
