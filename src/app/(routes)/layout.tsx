import DesktopNav from "@/components/DesktopNav";
import MobileNav from "@/components/MobileNav";
import ThemeObserver from "@/components/ThemeObserver";
import {Theme} from "@radix-ui/themes";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "@radix-ui/themes/styles.css";
import { SessionProvider } from "next-auth/react";

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode,
}>) {
  return (
    <html lang="en" className="bg-gradient-to-br from-[#FFD700] via-[#FF0000] to-[#40E0D0]">
      <body
        className={`${geistSans.variable} ${geistMono.variable} 
        antialiased 
        dark:bg-gradient-to-br 
        dark:from-[#8B4513] 
        dark:via-[#800080] 
        dark:to-[#FF0000] 
        text-[#FF69B4] 
        bg-gradient-to-br 
        from-[#40E0D0] 
        via-[#32CD32] 
        to-[#800020]`}
      >
        <SessionProvider>
        <Theme>
          {modal}
          <div
              className="
            flex 
            min-h-screen 
            dark:bg-gradient-to-br 
            dark:from-[#FF0000] 
            dark:via-[#32CD32] 
            dark:to-[#800080] 
            bg-gradient-to-br 
            from-[#800080] 
            via-[#40E0D0] 
            to-[#8B4513]"
            >
            <DesktopNav />
            <div
                className="
              pb-24 
              ld:pb-4 
              pt-4 
              px-4 
              lg:px-8 
              flex 
              justify-around 
              w-full"
              >
                <div
                  className="
                w-full 
                bg-gradient-to-br 
                from-[#8B4513] 
                via-[#00FF00] 
                to-[#FF0000] 
                p-12 
                text-center 
                font-mono"
                >
                {children}
              </div>
            </div>
          </div>
          <MobileNav />
        </Theme>
        <ThemeObserver />
        </SessionProvider>
      </body>
    </html>
  );
}
