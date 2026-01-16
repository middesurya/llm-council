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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
  ],
};

export const metadata: Metadata = {
  title: "LLM Council - Multi-Expert AI Consensus",
  description:
    "Get comprehensive answers from GPT-4, Claude, and Gemini working together through our three-stage council process.",
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
    title: "LLM Council - Multi-Expert AI Consensus",
    description:
      "Get comprehensive answers from multiple AI experts through our three-stage consensus process.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Council - Multi-Expert AI Consensus",
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
      <body className="font-sans antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50" suppressHydrationWarning>
        {/* Fixed background layer */}
        <div className="fixed inset-0 -z-20 bg-slate-50 dark:bg-slate-950" />
        
        {/* Grid pattern overlay */}
        <div 
          className="fixed inset-0 -z-10 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        {/* Gradient accent - top */}
        <div className="fixed inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80 pointer-events-none">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-500 to-cyan-500 opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        {/* Gradient accent - bottom */}
        <div className="fixed inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl pointer-events-none">
          <div
            className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-cyan-500 to-violet-500 opacity-15 dark:opacity-5 sm:left-[calc(50%+15rem)] sm:w-[72.1875rem]"
          />
        </div>
        
        {/* Content */}
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
