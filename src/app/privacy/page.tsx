"use client";

import { SiteFooter } from "@/widgets/site-footer/ui/SiteFooter";
import { SiteHeader } from "@/widgets/site-header/ui/SiteHeader";
import { PromoBanner } from "@/shared/ui/PromoBanner";

export default function Privacy() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <div className="flex-1">
        <SiteHeader />

        <main className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1160px] flex-col gap-[80px] px-4 py-16 max-[400px]:max-w-[340px] max-[400px]:px-[10px] lg:gap-[60px]">
          <div className="flex flex-col items-center gap-[40px] lg:flex-row lg:items-start lg:gap-[60px]">
            <article className="flex w-full flex-1 flex-col gap-[40px]">
              <header className="flex flex-col gap-5">
                <h1 className="font-playfair text-[32px] font-normal leading-[100%] text-[#333333]">
                  Privacy Policy
                </h1>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  Welcome to pathvoyager.com. We are committed to protecting your privacy and being transparent about how we handle your information. This Privacy Policy explains how we collect, use, and share your personal information when you visit our website.
                </p>
              </header>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  1. Information We Collect
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We collect information to provide and improve our services. The types of information we collect include:
                </p>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                      <strong>a) Information You Voluntarily Provide:</strong>
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                        Contact Information: when you subscribe to our newsletter or contact us, you may provide your name and email address.
                      </li>
                      <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                        User Content: Comments you leave on our articles.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                      <strong>b) Information Collected Automatically:</strong>
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                        Log Data: When you visit our site, our servers automatically record information (log data), including your IP address, browser type, operating system, the pages you visit, and the date and time of your visit.
                      </li>
                      <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                        Cookies and Similar Technologies: We use cookies and similar tracking technologies to track activity on our site and hold certain information. Some cookies help us retain your preferences, while others analyze site usage to improve our content.
                      </li>
                    </ul>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                      <strong>c) Information from Third Parties:</strong>
                    </p>
                    <ul className="ml-5 list-disc space-y-2">
                      <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                        Advertising Partners: We also obtain third-party companies, including Google AdSense, to use cookies to collect non-personally identifiable information (e.g., browser type, time and date of visit, pages viewed) to serve ads based on a user&apos;s prior visits to our website or other websites on the internet.
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  2. How We Use Your Information
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="ml-5 list-disc space-y-2">
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To operate, maintain, and improve our website.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To send you newsletters and promotional communications (you can opt out at any time).
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To respond to your comments and questions.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To monitor and analyze usage, trends, and activities in connection with our site.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To display personalized advertising via Google AdSense.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    To detect, prevent, and address technical issues.
                  </li>
                </ul>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  3. Google AdSense
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We use Google AdSense to display advertisements on our site.
                </p>
                <ul className="ml-5 list-disc space-y-2">
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    Google AdSense is an advertising service provided by Google Inc. that uses the “DoubleClick” cookie to serve ads based on your prior visits to our website or other websites on the internet.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    You can opt out of personalized advertising by visiting Google&apos;s Ads Settings. Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting www.aboutads.info.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    For more information on how Google uses data from sites that use its services, please see Google&apos;s Privacy Policy.
                  </li>
                </ul>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  4. How We Share Your Information
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We do not sell, trade, or rent your personally identifiable information. We may share generic aggregated demographic information not linked to any personal identification information with our partners and advertisers.
                </p>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We may share information we collect in the following situations:
                </p>
                <ul className="ml-5 list-disc space-y-2">
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    With Service Providers: We may share your data with third-party vendors, service providers, and agents who perform services for us (e.g., email delivery services).
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    For Legal Reasons: We may disclose information when we believe it is necessary to comply with a legal obligation or to protect our rights, property, or safety, or that of others.
                  </li>
                  <li className="font-open-sans text-base leading-[1.6] text-[#333333]">
                    Business Transfers: If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred.
                  </li>
                </ul>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  5. Your Rights and Choices
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  Cookies: You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  6. Data Retention
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy, or as needed to comply with our legal obligations.
                </p>
              </section>

              <section className="flex flex-col gap-4">
                <h2 className="font-playfair text-2xl font-normal leading-[110%] text-[#333333]">
                  7. International Transfers
                </h2>
                <p className="font-open-sans text-base leading-[1.6] text-[#333333]">
                  Your information, including Personal Data, may be transferred to—and maintained on—computers located outside of your state, province, country, or other governmental jurisdiction where the data protection laws may differ.
                </p>
              </section>
            </article>

            <aside className="flex w-full justify-center lg:w-auto lg:justify-end">
              <PromoBanner
                title="[(100×600) • Banner]"
                variant="vertical"
                width={100}
                height={600}
              />
            </aside>
          </div>

          <div className="w-full">
            <PromoBanner
              title="[AdSense Adaptive • Desktop (728x90) • Banner #1]"
              width="100%"
              height={90}
            />
          </div>
        </div>
      </main>
      </div>
      <SiteFooter />
    </div>
  );
}
