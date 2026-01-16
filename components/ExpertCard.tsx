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
    const colors: Record<
      string,
      { bg: string; bgLight: string; border: string; text: string }
    > = {
      indigo: {
        bg: "bg-indigo-500",
        bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
        border: "border-indigo-200 dark:border-indigo-800",
        text: "text-indigo-700 dark:text-indigo-300",
      },
      violet: {
        bg: "bg-violet-500",
        bgLight: "bg-violet-50 dark:bg-violet-950/30",
        border: "border-violet-200 dark:border-violet-800",
        text: "text-violet-700 dark:text-violet-300",
      },
      cyan: {
        bg: "bg-cyan-500",
        bgLight: "bg-cyan-50 dark:bg-cyan-950/30",
        border: "border-cyan-200 dark:border-cyan-800",
        text: "text-cyan-700 dark:text-cyan-300",
      },
      emerald: {
        bg: "bg-emerald-500",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
      },
      teal: {
        bg: "bg-teal-500",
        bgLight: "bg-teal-50 dark:bg-teal-950/30",
        border: "border-teal-200 dark:border-teal-800",
        text: "text-teal-700 dark:text-teal-300",
      },
      amber: {
        bg: "bg-amber-500",
        bgLight: "bg-amber-50 dark:bg-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        text: "text-amber-700 dark:text-amber-300",
      },
      yellow: {
        bg: "bg-yellow-500",
        bgLight: "bg-yellow-50 dark:bg-yellow-950/30",
        border: "border-yellow-200 dark:border-yellow-800",
        text: "text-yellow-700 dark:text-yellow-300",
      },
      orange: {
        bg: "bg-orange-500",
        bgLight: "bg-orange-50 dark:bg-orange-950/30",
        border: "border-orange-200 dark:border-orange-800",
        text: "text-orange-700 dark:text-orange-300",
      },
    };
    return colors[color] || colors.indigo;
  };

  const colorClasses = getColorClasses(persona.color);
  const previewLength = 300;
  const isLong = answer.length > previewLength;
  const displayAnswer =
    isExpanded || !isLong ? answer : answer.substring(0, previewLength) + "...";

  return (
    <motion.div
      custom={index}
      variants={expertCard}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`
        relative overflow-hidden rounded-xl border
        ${colorClasses.bgLight} ${colorClasses.border}
        transition-all duration-300
      `}
    >
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${persona.gradient}`}
      />

      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-neutral-200/50 dark:border-neutral-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <motion.div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                bg-gradient-to-br ${persona.gradient} shadow-lg
              `}
              animate={
                isStreaming
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        "0 10px 15px -3px rgba(0,0,0,0.1)",
                        "0 10px 25px -3px rgba(0,0,0,0.2)",
                        "0 10px 15px -3px rgba(0,0,0,0.1)",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: isStreaming ? Infinity : 0,
                ease: "easeInOut",
              }}
            >
              {persona.icon}
            </motion.div>
            <div>
              <h3 className={`text-lg font-bold ${colorClasses.text}`}>
                {persona.name}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {persona.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono">
              {model}
            </span>
            {isStreaming && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="prose prose-sm prose-neutral dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">
            {displayAnswer}
            {isStreaming && <span className="cursor-blink" />}
          </pre>
        </div>

        {/* Expand/Collapse */}
        {isLong && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              mt-4 px-4 py-2 rounded-lg text-sm font-medium
              ${colorClasses.bgLight} ${colorClasses.text}
              border ${colorClasses.border}
              hover:opacity-80 transition-all
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </motion.button>
        )}
      </div>

      {/* Streaming progress indicator */}
      {isStreaming && (
        <motion.div
          className={`h-0.5 bg-gradient-to-r ${persona.gradient}`}
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
