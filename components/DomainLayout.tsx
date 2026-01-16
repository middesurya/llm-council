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
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const domains = [
    { id: "general", name: "General", icon: "💡", href: "/", color: "text-violet-600", gradient: "from-violet-500 via-purple-500 to-indigo-500" },
    { id: "healthcare", name: "Healthcare", icon: "🏥", href: "/healthcare", color: "text-emerald-600", gradient: "from-emerald-500 via-teal-500 to-cyan-500" },
    { id: "finance", name: "Finance", icon: "💰", href: "/finance", color: "text-amber-600", gradient: "from-amber-500 via-orange-500 to-yellow-500" },
  ];

  const getDomainColor = (id: string) => {
    switch (id) {
      case "healthcare":
        return "from-emerald-500 to-teal-600";
      case "finance":
        return "from-amber-500 to-orange-600";
      default:
        return "from-violet-500 to-indigo-600";
    }
  };

  const currentDomainData = domains.find(d => d.id === currentDomain) || domains[0];

  return (
    <div className="min-h-screen relative" style={{ background: "var(--background)" }}>
      {/* Ambient Gradient Orb that follows cursor subtly */}
      <motion.div
        className="fixed pointer-events-none z-0 w-[600px] h-[600px] rounded-full opacity-[0.03] blur-3xl"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 50 }}
        style={{
          background: `radial-gradient(circle, ${currentDomainData.id === 'healthcare' ? '#10b981' : currentDomainData.id === 'finance' ? '#f59e0b' : '#8b5cf6'} 0%, transparent 70%)`,
        }}
      />

      {/* Liquid Glass Navigation */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-2xl ${
          isScrolled
            ? "liquid-glass-elevated"
            : "liquid-glass"
        }`}
      >
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              {/* Animated Logo */}
              <Link href="/" className="group flex items-center space-x-3">
                <motion.div
                  className="relative w-11 h-11 rounded-xl flex items-center justify-center overflow-hidden"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <span className="relative text-2xl z-10">🧠</span>
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  />
                </motion.div>
                <div className="hidden sm:block">
                  <motion.span
                    className="gradient-text-animated font-heading text-xl font-bold tracking-tight block"
                    style={{ fontFamily: "var(--font-space-grotesk)" }}
                  >
                    LLM Council
                  </motion.span>
                  <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                    Multi-Expert AI
                  </span>
                </div>
              </Link>

              {/* Domain Tabs with Liquid Glass Pills */}
              <div className="hidden md:flex space-x-2">
                {domains.map((domain) => {
                  const isActive = currentDomain === domain.id;
                  return (
                    <Link
                      key={domain.id}
                      href={domain.href}
                      className="relative"
                    >
                      <motion.div
                        className={`px-4 py-2.5 rounded-xl transition-all duration-300 ${
                          isActive
                            ? "liquid-glass-pill"
                            : "hover:bg-white/40 dark:hover:bg-white/10"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ fontFamily: "var(--font-space-grotesk)" }}
                      >
                        <div className="flex items-center space-x-2 font-medium">
                          <motion.span
                            className="text-lg"
                            animate={isActive ? { scale: [1, 1.15, 1] } : {}}
                            transition={{ duration: 0.4 }}
                          >
                            {domain.icon}
                          </motion.span>
                          <span className={isActive ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}>
                            {domain.name}
                          </span>
                        </div>
                      </motion.div>

                      {/* Active indicator dot */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            layoutId="activeDot"
                            className={`absolute -bottom-1 left-1/2 w-1.5 h-1.5 rounded-full bg-gradient-to-r ${getDomainColor(domain.id)}`}
                            initial={{ scale: 0, x: "-50%" }}
                            animate={{ scale: 1, x: "-50%" }}
                            exit={{ scale: 0, x: "-50%" }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                      </AnimatePresence>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Status Indicator with Real-time Animation */}
            <div className="flex items-center space-x-3">
              <motion.div
                className="liquid-glass-pill"
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <motion.div
                    className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500"
                    animate={{ scale: [1, 2, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{
                    fontFamily: "var(--font-jetbrains-mono)",
                    color: "var(--foreground)",
                  }}
                >
                  LIVE
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Domain Tabs */}
        <div className="md:hidden px-4 pb-3 flex space-x-2">
          {domains.map((domain) => {
            const isActive = currentDomain === domain.id;
            return (
              <motion.div
                key={domain.id}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Link
                  href={domain.href}
                  className={`block py-2.5 px-3 rounded-xl text-center text-sm font-medium transition-all ${
                    isActive
                      ? `bg-gradient-to-r ${getDomainColor(domain.id)} text-white shadow-lg`
                      : "liquid-glass-pill justify-center"
                  }`}
                >
                  <span className="mr-1.5">{domain.icon}</span>
                  {domain.name}
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>

      {/* Main Content with top padding for fixed nav */}
      <main className="pt-28 relative z-10">{children}</main>

      {/* Premium Footer with Gradient Mesh */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mt-32 relative overflow-hidden"
      >
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-500/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="gradient-divider" />

        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            {/* Animated Logo Mark */}
            <motion.div
              className="flex items-center justify-center space-x-4"
              whileHover={{ scale: 1.02 }}
            >
              <motion.div
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(99, 102, 241, 0.3)",
                    "0 0 40px rgba(99, 102, 241, 0.5)",
                    "0 0 20px rgba(99, 102, 241, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-2xl">🧠</span>
              </motion.div>
              <div className="text-left">
                <h3
                  className="text-2xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  LLM Council
                </h3>
                <p className="text-xs text-gray-500 font-medium tracking-widest uppercase">
                  Collective AI Intelligence
                </p>
              </div>
            </motion.div>

            <p
              className="text-sm max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--color-neutral-600)" }}
            >
              Premium multi-expert AI consensus system orchestrating{" "}
              <span className="font-semibold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">GPT-4</span>,{" "}
              <span className="font-semibold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Claude</span>, and{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Gemini</span>{" "}
              through a sophisticated three-stage deliberation process.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {[
                { icon: "⚡", label: "Real-time Streaming" },
                { icon: "🔒", label: "Secure & Private" },
                { icon: "🎯", label: "Domain Expertise" },
              ].map((feature, idx) => (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="liquid-glass-pill text-xs"
                >
                  <span>{feature.icon}</span>
                  <span className="text-gray-600 dark:text-gray-400">{feature.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="gradient-divider mt-8" />

            <div className="flex items-center justify-center space-x-6 text-xs pt-4" style={{ color: "var(--color-neutral-500)" }}>
              <span>© 2025 LLM Council</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>Powered by Advanced AI</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span
                className="font-mono px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800"
                style={{ fontFamily: "var(--font-jetbrains-mono)" }}
              >
                v2.0.0
              </span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
