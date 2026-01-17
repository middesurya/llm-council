"use client";

import { useState } from "react";
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
      teal: {
        bg: "bg-teal-500",
        bgLight: "bg-teal-50 dark:bg-teal-950/30",
        border: "border-teal-200 dark:border-teal-800",
        text: "text-teal-700 dark:text-teal-300",
      },
      blue: {
        bg: "bg-blue-500",
        bgLight: "bg-blue-50 dark:bg-blue-950/30",
        border: "border-blue-200 dark:border-blue-800",
        text: "text-blue-700 dark:text-blue-300",
      },
      indigo: {
        bg: "bg-indigo-500",
        bgLight: "bg-indigo-50 dark:bg-indigo-950/30",
        border: "border-indigo-200 dark:border-indigo-800",
        text: "text-indigo-700 dark:text-indigo-300",
      },
      emerald: {
        bg: "bg-emerald-500",
        bgLight: "bg-emerald-50 dark:bg-emerald-950/30",
        border: "border-emerald-200 dark:border-emerald-800",
        text: "text-emerald-700 dark:text-emerald-300",
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
    return colors[color] || colors.violet;
  };

  const colorClasses = getColorClasses(persona.color);
  const previewLength = 300;
  const isLong = answer.length > previewLength;
  const displayAnswer =
    isExpanded || !isLong ? answer : answer.substring(0, previewLength) + "...";

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border animate-fade-in-up
        ${colorClasses.bgLight} ${colorClasses.border}
        transition-all duration-300 hover:shadow-md
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Gradient accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${persona.gradient}`}
      />

      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`
                w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                bg-gradient-to-br ${persona.gradient} shadow-lg
                ${isStreaming ? "animate-pulse" : ""}
              `}
            >
              {persona.icon}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${colorClasses.text}`}>
                {persona.name}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {persona.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {model}
            </span>
            {isStreaming && (
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Live
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
            {displayAnswer}
            {isStreaming && (
              <span className="inline-block w-2 h-4 ml-0.5 bg-current animate-pulse" />
            )}
          </pre>
        </div>

        {/* Expand/Collapse */}
        {isLong && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              mt-4 px-4 py-2 rounded-lg text-sm font-medium
              ${colorClasses.bgLight} ${colorClasses.text}
              border ${colorClasses.border}
              hover:opacity-80 transition-all active:scale-[0.98]
            `}
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Streaming progress indicator */}
      {isStreaming && (
        <div className="h-0.5 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${persona.gradient} animate-shimmer`}
            style={{
              animation: "shimmer 2s linear infinite",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      )}
    </div>
  );
}
