import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "PathVoyager Privacy Policy. Learn how we collect, use, and protect your personal information when you visit our travel blog website.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | PathVoyager",
    description: "PathVoyager Privacy Policy. Learn how we collect, use, and protect your personal information.",
    url: "https://pathvoyager.com/privacy",
  },
  alternates: {
    canonical: "https://pathvoyager.com/privacy",
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

