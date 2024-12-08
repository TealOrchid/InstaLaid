import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import { Theme } from "@radix-ui/themes";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "@radix-ui/themes/styles.css";
import { SessionProvider } from "next-auth/react";

// Load local fonts
const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "InstaLaid",
  description: "Pistachios are fucking disgusting!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gradient-to-br from-[#FFD700] via-[#FF0000] to-[#40E0D0]">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <Theme>
            <div className="flex min-h-screen flex-col md:flex-row">
              <DesktopNav />
              <MobileNav />
              <div className="flex-1 p-8 bg-gradient-to-br from-[#8B4513] via-[#00FF00] to-[#FF0000] text-center">
                <div className="w-full bg-transparent border-b-[5rem] md:border-none border-transparent">
                  {children}
                </div>
              </div>
            </div>
          </Theme>
        </SessionProvider>
      </body>
    </html>
  );
}
