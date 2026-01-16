"use client";

import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";

export default function Home() {
  return (
    <DomainLayout currentDomain="general">
      <div className="relative">
        {/* Animated Gradient Background */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
            style={{
              background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            }}
            animate={{
              y: [0, 30, 0],
              x: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-15"
            style={{
              background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, -30, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{
              background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
            }}
            animate={{
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
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
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🧠
            </motion.span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-6xl font-bold mb-6 gradient-text-animated"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            LLM Council
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Harness the collective intelligence of multiple AI experts.
            <br />
            <span className="font-semibold text-violet-700">
              Get consensus-driven answers validated through peer review.
            </span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <div className="premium-card glass px-5 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-violet-700">Real-time Streaming</span>
              </div>
            </div>
            <div className="premium-card glass px-5 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span className="font-semibold text-violet-700">3-Stage Validation</span>
              </div>
            </div>
            <div className="premium-card glass px-5 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤝</span>
                <span className="font-semibold text-violet-700">Multi-Expert Consensus</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Chat Interface */}
        <ChatInterface
          domain="general"
          title="General Knowledge Council"
          description="Ask any question and get comprehensive answers from multiple AI experts"
        />
      </div>
    </DomainLayout>
  );
}
