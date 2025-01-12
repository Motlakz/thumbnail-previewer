import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import { Navbar } from "@/components/dashboard/Navbar";
import { ReactNode } from "react";

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
});

export const metadata: Metadata = {
  title: "Thumbnail Previewer | Instant Visual Insights",
  description: "Preview thumbnails in real-time with our intuitive tool. See how your images will appear across social media, websites, and more before you publish. Fast, accurate, and perfect for content creators, marketers, and designers.",
  keywords: [
    "thumbnail previewer",
    "thumbnail checker",
    "thumbnail preview",
    "youtube thumbnail preview",
    "thumbnail previews",
    "preview thumbnails",
    "youtube thumbnail tester",
    "youtube thumbnail checker",
    "youtube thumbnail viewer",

    "ai thumbnail generator",
    "ai thumbnail maker",
    "youtube thumbnail generator",
    "youtube thumbnail ai generator",
    "thumbnail generator",
    "thumbnail ai generator",
    "thumbnail generator ai",

    "video thumbnail generator",
    "image preview generator",
    "thumbnail quality checker",
  ],
  openGraph: {
    title: "Universal Thumbnail Previewer | Test Before You Post",
    description: "Professional thumbnail preview tool for YouTube and other socials. Instant preview across multiple platforms. Save time with real-time testing.",
    type: "website",
    locale: "en_US",
    siteName: "Thumbnail Previewer"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quicksand.className} ${quicksand.variable} antialiased min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
        >
          <Navbar />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
