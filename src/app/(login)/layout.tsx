import { ReactNode } from 'react';
import "../globals.css";
import { SessionProvider } from 'next-auth/react';
import { Metadata } from 'next';

interface RootLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "InstaLaid",
  description: "Pistachios are fucking disgusting!",
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
      <html lang="en">
        <body>
          <SessionProvider>
            <>{children}</>
          </SessionProvider>
        </body>
      </html>
    );
  }
  