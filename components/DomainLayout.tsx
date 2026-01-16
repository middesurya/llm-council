"use client";

import Link from "next/link";
import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface DomainLayoutProps {
  children: ReactNode;
  currentDomain?: string;
}

export default function DomainLayout({
  children,
  currentDomain = "general",
}: DomainLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const domains = [
    { id: "general", name: "General", icon: "💡", href: "/", color: "text-violet-600" },
    { id: "healthcare", name: "Healthcare", icon: "🏥", href: "/healthcare", color: "text-emerald-600" },
    { id: "finance", name: "Finance", icon: "💰", href: "/finance", color: "text-amber-600" },
  ];

  const getDomainColor = (id: string) => {
    switch (id) {
      case "healthcare":
        return "from-emerald-500 to-emerald-600";
      case "finance":
        return "from-amber-500 to-amber-600";
      default:
        return "from-violet-500 to-indigo-600";
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Glassmorphism Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "glass shadow-lg"
            : "bg-transparent"
        }`}
        style={{
          backdropFilter: isScrolled ? "blur(12px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center space-x-12">
              {/* Logo */}
              <Link href="/" className="group flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-2xl">🧠</span>
                </motion.div>
                <span
                  className="gradient-text-animated font-heading text-2xl font-bold tracking-tight hidden sm:block"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  LLM Council
                </span>
              </Link>

              {/* Domain Tabs */}
              <div className="hidden md:flex space-x-1">
                {domains.map((domain) => {
                  const isActive = currentDomain === domain.id;
                  return (
                    <Link
                      key={domain.id}
                      href={domain.href}
                      className="relative"
                    >
                      <motion.div
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                          isActive
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        <div className="flex items-center space-x-2 font-medium">
                          <span className="text-lg">{domain.icon}</span>
                          <span>{domain.name}</span>
                        </div>
                      </motion.div>

                      {/* Animated Underline */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${getDomainColor(domain.id)} rounded-full`}
                          initial={false}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Activity Indicator */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2 px-4 py-2 rounded-full glass">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                <span
                  className="text-sm font-medium"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    color: "var(--foreground)",
                  }}
                >
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Domain Tabs */}
        <div className="md:hidden px-4 pb-3 flex space-x-2">
          {domains.map((domain) => {
            const isActive = currentDomain === domain.id;
            return (
              <Link
                key={domain.id}
                href={domain.href}
                className={`flex-1 py-2 px-3 rounded-lg text-center text-sm font-medium transition-all ${
                  isActive
                    ? `bg-gradient-to-r ${getDomainColor(domain.id)} text-white shadow-md`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <span className="mr-1">{domain.icon}</span>
                {domain.name}
              </Link>
            );
          })}
        </div>
      </motion.nav>

      {/* Main Content with top padding for fixed nav */}
      <main className="pt-24">{children}</main>

      {/* Premium Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-32 border-t"
        style={{
          borderColor: "var(--color-neutral-200)",
          background: "linear-gradient(to bottom, transparent, rgba(var(--background), 0.8))",
        }}
      >
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                <span className="text-lg">🧠</span>
              </div>
              <h3
                className="text-xl font-bold gradient-text"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                LLM Council
              </h3>
            </div>
            <p
              className="text-sm max-w-2xl mx-auto"
              style={{ color: "var(--color-neutral-600)" }}
            >
              Premium multi-expert AI consensus system orchestrating{" "}
              <span className="font-semibold text-indigo-600">GPT-4</span>,{" "}
              <span className="font-semibold text-violet-600">Claude</span>, and{" "}
              <span className="font-semibold text-cyan-600">Gemini</span>{" "}
              through a sophisticated three-stage deliberation process.
            </p>
            <div className="flex items-center justify-center space-x-6 text-xs" style={{ color: "var(--color-neutral-500)" }}>
              <span>© 2025 LLM Council</span>
              <span>•</span>
              <span>Powered by Advanced AI</span>
              <span>•</span>
              <span className="font-mono">v1.0.0</span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
