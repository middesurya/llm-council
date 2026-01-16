import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// Premium Font Stack
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export const metadata: Metadata = {
  title: "LLM Council - Premium Multi-Expert AI Consensus",
  description:
    "Experience premium AI intelligence through our sophisticated three-stage council process. Get comprehensive, consensus-driven answers from GPT-4, Claude, and Gemini working together.",
  keywords: [
    "AI",
    "LLM",
    "GPT-4",
    "Claude",
    "Gemini",
    "consensus",
    "multi-expert",
    "artificial intelligence",
  ],
  authors: [{ name: "LLM Council" }],
  openGraph: {
    title: "LLM Council - Premium Multi-Expert AI Consensus",
    description:
      "Get comprehensive answers from multiple AI experts through our three-stage consensus process.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Council - Premium Multi-Expert AI Consensus",
    description:
      "Get comprehensive answers from multiple AI experts through our three-stage consensus process.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
