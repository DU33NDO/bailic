import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AudioProvider } from "@/context/AudioContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BaiLic",
  description: "Connect People",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=G-LJJPTGCY1M`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-LJJPTGCY1M');
          `}
        </Script>
      </head>
      <body className={inter.className}>
        <Providers>
          <LanguageProvider>
            <AudioProvider>{children}</AudioProvider>
          </LanguageProvider>
        </Providers>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
