import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Heat Pump Network — Find Certified Heat Pump Installers",
    template: "%s | Heat Pump Network",
  },
  description:
    "Connect with pre-verified, high-quality heat pump contractors. Compare installers, check rebates, calculate savings, and get quotes — all free for homeowners.",
  keywords: [
    "heat pump installers",
    "heat pump contractors",
    "heat pump rebates",
    "cold climate heat pump",
    "mini split installation",
    "heat pump cost",
    "HVAC directory",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Heat Pump Network",
    title: "Heat Pump Network — Find Certified Heat Pump Installers",
    description:
      "Connect with pre-verified heat pump contractors. Check rebates, calculate savings, get quotes.",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "Heat Pump Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heat Pump Network",
    description:
      "Find certified heat pump installers in your area. Compare, save, electrify.",
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
  // E-E-A-T signals
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Font preloading for LCP optimisation */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className={`${inter.variable} min-h-screen flex flex-col`}>
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
