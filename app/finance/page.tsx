"use client";

import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";

export default function FinancePage() {
  return (
    <DomainLayout currentDomain="finance">
      <div className="relative">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, #f59e0b 0%, transparent 70%)",
            }}
            animate={{
              y: [0, 35, 0],
              x: [0, 30, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/3 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{
              background: "radial-gradient(circle, #d97706 0%, transparent 70%)",
            }}
            animate={{
              y: [0, -35, 0],
              x: [0, -25, 0],
              scale: [1, 1.18, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{
              background: "radial-gradient(circle, #fbbf24 0%, transparent 70%)",
            }}
            animate={{
              y: [0, 30, 0],
              x: [0, -18, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
        </motion.div>

        {/* Premium Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center py-12 px-6"
        >
          <motion.div variants={fadeInUp} className="mb-4">
            <motion.span
              className="text-7xl inline-block"
              animate={{
                rotate: [0, 8, -8, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              💼
            </motion.span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl font-bold mb-6"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Finance & Business
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Expert financial analysis and business intelligence.
            <br />
            <span className="font-semibold text-amber-700">
              GAAP/IFRS standards compliance with regulatory guidance and risk assessment.
            </span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <div className="premium-card glass px-5 py-3 rounded-xl border-2 border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📈</span>
                <span className="font-semibold text-amber-700">Financial Analysis</span>
              </div>
            </div>
            <div className="premium-card glass px-5 py-3 rounded-xl border-2 border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                <span className="font-semibold text-amber-700">Compliance Review</span>
              </div>
            </div>
            <div className="premium-card glass px-5 py-3 rounded-xl border-2 border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-amber-700">Risk Assessment</span>
              </div>
            </div>
          </motion.div>

          {/* Financial Disclaimer */}
          <motion.div
            variants={fadeInUp}
            className="max-w-2xl mx-auto mb-8 p-4 rounded-xl glass border-2 border-amber-200 bg-amber-50/50"
          >
            <div className="flex items-start gap-3">
              <motion.span
                className="text-2xl"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ⚠️
              </motion.span>
              <div className="text-left">
                <h3 className="font-bold text-amber-800 mb-1" style={{ fontFamily: "var(--font-space-grotesk)" }}>
                  Financial Disclaimer
                </h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  This AI system provides informational analysis only and is not a substitute for professional financial, legal, or investment advice. Consult with qualified professionals before making financial decisions. Performance data is not indicative of future results.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Chat Interface */}
        <ChatInterface
          domain="finance"
          title="Financial Analysis Council"
          description="Expert financial analysis with GAAP/IFRS standards and regulatory guidance"
        />
      </div>
    </DomainLayout>
  );
}
