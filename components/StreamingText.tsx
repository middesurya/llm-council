"use client";

import { motion } from "framer-motion";

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
}

export default function StreamingText({
  content,
  isStreaming = false,
}: StreamingTextProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="prose prose-neutral dark:prose-invert max-w-none"
      >
        <pre className="whitespace-pre-wrap font-sans text-neutral-800 dark:text-neutral-200 leading-relaxed text-base">
          {content}
          {isStreaming && (
            <motion.span
              className="cursor-blink ml-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </pre>
      </motion.div>

      {/* Streaming glow effect */}
      {isStreaming && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
        />
      )}
    </div>
  );
}
