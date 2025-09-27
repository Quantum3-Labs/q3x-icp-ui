import type { Metadata } from "next";
import { Geist, Geist_Mono, Barlow } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import ClientLayout from "@/components/ClientLayout";
import { InternetIdentityProvider } from "@/contexts/InternetIdentityContext";
import { WalletCanisterProvider } from "@/contexts/WalletCanisterContext";
import { CurrentWalletProvider } from "@/contexts/CurrentWalletContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const barlow = Barlow({
  weight: "500",
  subsets: ["latin"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Q3x Wallet",
  description: "A secure and user-friendly wallet for your digital assets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
        {/* This is a hack to ensure the theme is applied correctly on the server side, not do this */}
      {/* <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('ui-theme') || 'system';
                  if (theme === 'system') {
                    var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.classList.add(systemTheme);
                  } else {
                    document.documentElement.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head> */}
      <body className={`${barlow.variable} ${geistMono.variable} antialiased`}>
        {/* <ThemeProvider defaultTheme="system" storageKey="ui-theme"> */}
          <InternetIdentityProvider>
            <CurrentWalletProvider>
              <ClientLayout>
                <WalletCanisterProvider>{children}</WalletCanisterProvider>
              </ClientLayout>
            </CurrentWalletProvider>
          </InternetIdentityProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
