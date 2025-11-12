import type { Metadata } from "next";
import { Playfair_Display, Open_Sans, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "PathVoyager — Your Ultimate Travel Guide",
  description:
    "Discover Hidden Gems: Expert tips, itineraries, and travel stories from around the globe.",
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
