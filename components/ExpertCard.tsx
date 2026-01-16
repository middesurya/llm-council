"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { expertCard } from "@/lib/utils/animations";
import type { PersonaConfig } from "@/lib/utils/personas";

interface ExpertCardProps {
  persona: PersonaConfig;
  answer: string;
  model: string;
  index: number;
  isStreaming?: boolean;
}

export default function ExpertCard({
  persona,
  answer,
  model,
  index,
  isStreaming = false,
}: ExpertCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { border: string; bg: string; text: string; glow: string }> = {
      indigo: {
        border: "border-indigo-200",
        bg: "bg-indigo-50",
        text: "text-indigo-700",
        glow: "shadow-indigo-500/20",
      },
      violet: {
        border: "border-violet-200",
        bg: "bg-violet-50",
        text: "text-violet-700",
        glow: "shadow-violet-500/20",
      },
      cyan: {
        border: "border-cyan-200",
        bg: "bg-cyan-50",
        text: "text-cyan-700",
        glow: "shadow-cyan-500/20",
      },
      emerald: {
        border: "border-emerald-200",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        glow: "shadow-emerald-500/20",
      },
      amber: {
        border: "border-amber-200",
        bg: "bg-amber-50",
        text: "text-amber-700",
        glow: "shadow-amber-500/20",
      },
      gray: {
        border: "border-gray-200",
        bg: "bg-gray-50",
        text: "text-gray-700",
        glow: "shadow-gray-500/20",
      },
    };
    return colors[color] || colors.gray;
  };

  const colorClasses = getColorClasses(persona.color);
  const previewLength = 200;
  const isLong = answer.length > previewLength;
  const displayAnswer = isExpanded || !isLong
    ? answer
    : answer.substring(0, previewLength) + "...";

  return (
    <motion.div
      custom={index}
      variants={expertCard}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        premium-card ${colorClasses.border} ${colorClasses.bg}
        border-2 overflow-hidden
        ${isStreaming ? `animate-glow ${colorClasses.glow}` : ""}
      `}
    >
      {/* Header */}
      <div className="p-5 border-b" style={{ borderColor: "var(--color-neutral-200)" }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`text-3xl`}
              animate={isStreaming ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: isStreaming ? Infinity : 0 }}
            >
              {persona.icon}
            </motion.div>
            <div>
              <h3
                className={`text-lg font-bold ${colorClasses.text}`}
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {persona.name}
              </h3>
              <p className="text-sm text-gray-600">{persona.title}</p>
            </div>
          </div>
          <div
            className="text-xs px-2 py-1 rounded-md bg-white/50 font-mono"
            style={{
              fontFamily: "var(--font-jetbrains-mono)",
              color: "var(--color-neutral-600)",
            }}
          >
            {model}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div
          className="prose prose-sm max-w-none text-gray-800"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <pre className="whitespace-pre-wrap font-sans leading-relaxed">
            {displayAnswer}
          </pre>
        </div>

        {/* Expand/Collapse Button */}
        {isLong && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              mt-4 px-4 py-2 rounded-lg text-sm font-medium
              ${colorClasses.bg} ${colorClasses.text}
              hover:opacity-80 transition-opacity
            `}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </motion.button>
        )}
      </div>

      {/* Streaming Indicator */}
      {isStreaming && (
        <motion.div
          className={`h-1 bg-gradient-to-r from-${persona.color}-400 to-${persona.color}-600`}
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
}
