"use client";

import { motion } from "framer-motion";
import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";

export default function Home() {
  return (
    <DomainLayout currentDomain="general">
      <div className="relative">
        {/* Premium Animated Gradient Background with Morphing Blobs */}
        <motion.div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          {/* Primary morphing blob */}
          <motion.div
            className="absolute top-0 left-1/4 w-[500px] h-[500px] blur-3xl opacity-[0.15] morph-blob"
            style={{
              background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #22d3ee 100%)",
            }}
            animate={{
              y: [0, 50, 0],
              x: [0, 30, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Secondary blob */}
          <motion.div
            className="absolute top-1/3 right-1/4 w-[400px] h-[400px] blur-3xl opacity-[0.12] morph-blob"
            style={{
              background: "linear-gradient(225deg, #6366f1 0%, #a78bfa 50%, #8b5cf6 100%)",
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, -40, 0],
              rotate: [0, -15, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          {/* Accent blob */}
          <motion.div
            className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] blur-3xl opacity-[0.08] morph-blob"
            style={{
              background: "linear-gradient(45deg, #22d3ee 0%, #6366f1 100%)",
            }}
            animate={{
              y: [0, 40, 0],
              x: [0, -25, 0],
              rotate: [0, 20, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 4,
            }}
          />

          {/* Subtle grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(99, 102, 241, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(99, 102, 241, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
        </motion.div>

        {/* Premium Hero Section */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center py-16 px-6"
        >
          {/* Animated Logo */}
          <motion.div
            variants={fadeInUp}
            className="mb-6 inline-block"
          >
            <motion.div
              className="relative w-24 h-24 mx-auto"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Glowing ring behind icon */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 blur-xl"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [0.9, 1.1, 0.9],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              {/* Icon container */}
              <motion.div
                className="relative w-full h-full rounded-3xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-500 flex items-center justify-center shadow-xl"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-5xl">🧠</span>
                {/* Shine effect */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text-animated leading-tight"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            LLM Council
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Harness the collective intelligence of multiple AI experts.
            <br />
            <span className="font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Get consensus-driven answers validated through peer review.
            </span>
          </motion.p>

          {/* Feature Pills with Liquid Glass */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {[
              { icon: "⚡", label: "Real-time Streaming", color: "from-violet-500 to-indigo-500" },
              { icon: "🎯", label: "3-Stage Validation", color: "from-indigo-500 to-cyan-500" },
              { icon: "🤝", label: "Multi-Expert Consensus", color: "from-cyan-500 to-violet-500" },
            ].map((feature, idx) => (
              <motion.div
                key={feature.label}
                className="liquid-glass-interactive px-5 py-3 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    className="text-xl"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                  >
                    {feature.icon}
                  </motion.span>
                  <span className={`font-semibold text-sm bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                    {feature.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Animated divider */}
          <motion.div
            variants={fadeInUp}
            className="gradient-divider max-w-xl mx-auto mb-10"
          />
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
