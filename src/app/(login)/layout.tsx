import { ReactNode } from 'react';
import "../globals.css";
import { SessionProvider } from 'next-auth/react';

interface RootLayoutProps {
  children: ReactNode;
}

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
  