import { Geist, Geist_Mono, Rammetto_One } from "next/font/google";
import "./globals.css";
import { SerwistProvider } from "@serwist/turbopack/react";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const APP_NAME = "LVS F1 Fantasy";
const APP_DEFAULT_TITLE = "LVS F1 Fantasy";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Run an LVS F1 Fantasy league with your friends!";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const rammetto = Rammetto_One({
  variable: "--font-rammetto",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#e10600",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
      <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} ${rammetto.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col">
      {/* Currently, Serwist provider goes into a reload loop when visiting the app, so it's disabled. Fix it later. */}
      <SerwistProvider swUrl="/serwist/sw.js">{children}</SerwistProvider>
      {/*{children}*/}
      </body>
      </html>
  );
}
