"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DomainLayoutProps {
  children: ReactNode;
  currentDomain?: string;
}

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

  const domains = [
    {
      id: "general",
      name: "General",
      icon: "💡",
      href: "/",
      color: "indigo",
      description: "General knowledge",
    },
    {
      id: "healthcare",
      name: "Healthcare",
      icon: "🏥",
      href: "/healthcare",
      color: "emerald",
      description: "Medical expertise",
    },
    {
      id: "finance",
      name: "Finance",
      icon: "💰",
      href: "/finance",
      color: "amber",
      description: "Financial analysis",
    },
  ];

  const getDomainColorClass = (domainId: string) => {
    switch (domainId) {
      case "general":
        return "from-indigo-500 to-purple-600";
      case "healthcare":
        return "from-emerald-500 to-teal-600";
      case "finance":
        return "from-amber-500 to-orange-600";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  return (
    <div className={`min-h-screen flex flex-col domain-${currentDomain}`}>
      {/* Premium Glassmorphism Navigation */}
      <nav
        className={`
          sticky top-0 z-50 transition-all duration-300 animate-fade-in-down
          ${
            scrolled
              ? "bg-white/70 dark:bg-neutral-900/70 backdrop-blur-xl shadow-lg border-b border-neutral-200/50 dark:border-neutral-800/50"
              : "bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm"
          }
        `}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-xl group-hover:shadow-indigo-500/40 transition-shadow">
                  <span className="text-xl md:text-2xl">🧠</span>
                </div>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 opacity-0 group-hover:opacity-20 blur-lg transition-opacity" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LLM Council
                </span>
                <span className="hidden md:block text-xs text-neutral-500 dark:text-neutral-400">
                  Multi-Expert AI Consensus
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {domains.map((domain) => {
                const isActive = currentDomain === domain.id;
                return (
                  <Link key={domain.id} href={domain.href}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                        ${
                          isActive
                            ? `bg-gradient-to-r ${getDomainColorClass(domain.id)} text-white shadow-lg`
                            : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }
                      `}
                    >
                      <span className="mr-2">{domain.icon}</span>
                      {domain.name}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20"
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Status Indicator & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Online Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                  Online
                </span>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2 border-t border-neutral-200 dark:border-neutral-800">
                  {domains.map((domain) => {
                    const isActive = currentDomain === domain.id;
                    return (
                      <Link
                        key={domain.id}
                        href={domain.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                            ${
                              isActive
                                ? `bg-gradient-to-r ${getDomainColorClass(domain.id)} text-white`
                                : "bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                            }
                          `}
                        >
                          <span className="text-xl">{domain.icon}</span>
                          <div>
                            <div className="font-medium">{domain.name}</div>
                            <div
                              className={`text-xs ${isActive ? "text-white/80" : "text-neutral-500"}`}
                            >
                              {domain.description}
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <div className="animate-fade-in-up">
          {children}
        </div>
      </main>

      {/* Premium Footer */}
      <footer className="relative mt-auto border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl">
        {/* Gradient Decoration */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="text-xl">🧠</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  LLM Council
                </span>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-md">
                Get consensus-driven answers from GPT-4, Claude, and Gemini
                through our sophisticated three-stage council process.
              </p>
              {/* Features */}
              <div className="flex flex-wrap gap-3 mt-6">
                {[
                  { icon: "⚡", text: "Real-time Streaming" },
                  { icon: "🔒", text: "Secure & Private" },
                  { icon: "🎯", text: "Domain Expertise" },
                ].map((feature) => (
                  <div
                    key={feature.text}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400"
                  >
                    <span>{feature.icon}</span>
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
                Domains
              </h4>
              <ul className="space-y-3">
                {domains.map((domain) => (
                  <li key={domain.id}>
                    <Link
                      href={domain.href}
                      className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      <span>{domain.icon}</span>
                      <span>{domain.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div>
              <h4 className="font-semibold text-neutral-900 dark:text-white mb-4">
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
                    className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400"
                  >
                    <span>{step.icon}</span>
                    <span>{step.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-500">
              © {new Date().getFullYear()} LLM Council. Built with passion for
              AI excellence.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neutral-400 dark:text-neutral-600 font-mono">
                v2.0.0
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
