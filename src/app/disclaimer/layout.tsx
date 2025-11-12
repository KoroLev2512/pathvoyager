import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Website Disclaimer",
  description:
    "PathVoyager Website Disclaimer. Information about advertising disclosure, affiliate links, content accuracy, and terms of use for our travel blog.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Website Disclaimer | PathVoyager",
    description:
      "PathVoyager Website Disclaimer. Information about advertising disclosure, affiliate links, and terms of use.",
    url: "https://pathvoyager.com/disclaimer",
  },
  alternates: {
    canonical: "https://pathvoyager.com/disclaimer",
  },
};

export default function DisclaimerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

