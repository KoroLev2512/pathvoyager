import type { Metadata } from "next";
import { Playfair_Display, Open_Sans, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  preload: true,
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pathvoyager.com"),
  title: {
    default: "PathVoyager — Your Ultimate Travel Guide",
    template: "%s | PathVoyager",
  },
  description:
    "Discover Hidden Gems: Expert tips, itineraries, and travel stories from around the globe. Your ultimate guide to digital nomad life, adventure travel, budget trips, and cultural immersion.",
  keywords: [
    "travel blog",
    "travel guide",
    "digital nomad",
    "adventure travel",
    "budget travel",
    "travel tips",
    "travel stories",
    "itineraries",
    "hidden gems",
    "cultural immersion",
    "slow travel",
    "luxury travel",
  ],
  authors: [{ name: "PathVoyager Team" }],
  creator: "PathVoyager",
  publisher: "PathVoyager",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pathvoyager.com",
    siteName: "PathVoyager",
    title: "PathVoyager — Your Ultimate Travel Guide",
    description:
      "Discover Hidden Gems: Expert tips, itineraries, and travel stories from around the globe.",
    images: [
      {
        url: "/images/hero_bg.webp",
        width: 1200,
        height: 630,
        alt: "PathVoyager Travel Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PathVoyager — Your Ultimate Travel Guide",
    description:
      "Discover Hidden Gems: Expert tips, itineraries, and travel stories from around the globe.",
    images: ["/images/hero_bg.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Добавьте свои коды верификации здесь
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfairDisplay.variable} ${openSans.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
