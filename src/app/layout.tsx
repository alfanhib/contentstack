import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Pepperstone | Award-Winning Global Forex Broker & CFD Trading Platform",
  description: "Trade CFDs on FX, indices, commodities, cryptocurrencies, shares and more. Discover a better way to trade with Pepperstone - super-tight spreads, elite trading tech, and 24/7 support.",
  keywords: "forex, trading, CFD, broker, MT4, MT5, TradingView, cTrader, copy trading",
  openGraph: {
    title: "Pepperstone | Award-Winning Global Forex Broker",
    description: "Discover a better way to trade CFDs with Pepperstone. Get an insight into our tools, technology, platforms, market analysis and awards.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
