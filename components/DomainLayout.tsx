"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";

interface DomainLayoutProps {
  children: ReactNode;
  currentDomain?: string;
}

const domains = [
  {
    id: "general",
    name: "General",
    icon: "💡",
    href: "/",
    description: "General knowledge",
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "🏥",
    href: "/healthcare",
    description: "Medical expertise",
  },
  {
    id: "finance",
    name: "Finance",
    icon: "💰",
    href: "/finance",
    description: "Financial analysis",
  },
];

export default function DomainLayout({
  children,
  currentDomain = "general",
}: DomainLayoutProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change or escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  const getDomainButtonClass = (domainId: string, isActive: boolean) => {
    if (!isActive) {
      return "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800";
    }
    switch (domainId) {
      case "general":
        return "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg";
      case "healthcare":
        return "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg";
      case "finance":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg";
      default:
        return "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col domain-${currentDomain}`}>
      {/* Navigation Header */}
      <header
        className={`
          sticky top-0 z-50 transition-all duration-300 animate-fade-in-down
          ${
            scrolled
              ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg border-b border-slate-200/50 dark:border-slate-800/50"
              : "bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm"
          }
        `}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <span className="text-xl md:text-2xl">🧠</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  LLM Council
                </span>
                <span className="hidden md:block text-xs text-slate-500 dark:text-slate-400">
                  Multi-Expert AI Consensus
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {domains.map((domain) => {
                const isActive = currentDomain === domain.id;
                return (
                  <Link
                    key={domain.id}
                    href={domain.href}
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                      ${getDomainButtonClass(domain.id, isActive)}
                    `}
                  >
                    <span className="mr-2">{domain.icon}</span>
                    {domain.name}
                  </Link>
                );
              })}
            </div>

            {/* Status Indicator & Mobile Menu Button */}
            <div className="flex items-center gap-4">
              {/* Online Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-green-700 dark:text-green-400">
                  Online
                </span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  style={{ transform: mobileMenuOpen ? "rotate(90deg)" : "none" }}
                >
                  {mobileMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu - CSS-based animation */}
          <div
            className={`
              md:hidden overflow-hidden transition-all duration-300 ease-out
              ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
            `}
          >
            <div className="py-4 space-y-2 border-t border-slate-200 dark:border-slate-800">
              {domains.map((domain, index) => {
                const isActive = currentDomain === domain.id;
                return (
                  <Link
                    key={domain.id}
                    href={domain.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${
                        isActive
                          ? getDomainButtonClass(domain.id, true)
                          : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      }
                    `}
                    style={{
                      transitionDelay: mobileMenuOpen ? `${index * 50}ms` : "0ms",
                      transform: mobileMenuOpen ? "translateX(0)" : "translateX(-10px)",
                      opacity: mobileMenuOpen ? 1 : 0,
                    }}
                  >
                    <span className="text-xl">{domain.icon}</span>
                    <div>
                      <div className="font-medium">{domain.name}</div>
                      <div
                        className={`text-xs ${isActive ? "text-white/80" : "text-slate-500"}`}
                      >
                        {domain.description}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl">
        {/* Gradient Line Decoration */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                  <span className="text-xl">🧠</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent">
                  LLM Council
                </span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-md">
                Get consensus-driven answers from GPT-4, Claude, and Gemini
                through our sophisticated three-stage council process.
              </p>
              {/* Feature Badges */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: "⚡", text: "Real-time Streaming" },
                  { icon: "🔒", text: "Secure & Private" },
                  { icon: "🎯", text: "Domain Expertise" },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400"
                  >
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Domains Links */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Domains
              </h4>
              <ul className="space-y-3">
                {domains.map((domain) => (
                  <li key={domain.id}>
                    <Link
                      href={domain.href}
                      className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                    >
                      <span>{domain.icon}</span>
                      <span>{domain.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Info */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                Our Process
              </h4>
              <ul className="space-y-3">
                {[
                  { icon: "🧠", text: "Expert Analysis" },
                  { icon: "⚖️", text: "Peer Review" },
                  { icon: "✨", text: "Synthesis" },
                ].map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span>{step.icon}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-500">
              © {new Date().getFullYear()} LLM Council. Built with passion for
              AI excellence.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 dark:text-slate-600 font-mono">
                v2.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
