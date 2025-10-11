import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PWAInitializer } from "@/components/PWAInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "RE:MIND - The Elite Reminder App",
  description: "Never miss another crucial date. The ultimate scheduling and reminder system for professionals who demand absolute reliability.",
  themeColor: "#3b82f6",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RE:MIND"
  },
  icons: {
    icon: [
      { url: "/icons/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-16x16.png", sizes: "16x16", type: "image/png" }
    ],
    apple: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
    ]
  },
  manifest: "/manifest.json"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <PWAInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
