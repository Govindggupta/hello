import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NavHeader } from "@/components/nav/nav-header";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Samudra Chain",
  description: "Blockchain-based Blue Carbon Credit (BCC) registry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased bg-sea-salt text-deep-slate`}
      >
        <NavHeader />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
