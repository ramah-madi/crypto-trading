import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { getTrendingCoins } from "@/lib/coingecko.actions";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CoinPulse",
  description: "Crypto Screener App with a built-in High-Frequency Terminal & Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let trendingCoins: TrendingCoin[] = [];
  try {
    trendingCoins = await getTrendingCoins();
  } catch (error) {
    console.error("Failed to fetch trending coins for layout:", error);
  }

  return (
    <html
      lang="en"
      className="dark"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header trendingCoins={trendingCoins} />
        {children}
      </body>
    </html>
  );
}
