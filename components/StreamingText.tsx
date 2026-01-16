"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { streamingToken } from "@/lib/utils/animations";

interface StreamingTextProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export default function StreamingText({
  content,
  isStreaming = false,
  className = "",
}: StreamingTextProps) {
  // Split content into words for animation
  const words = useMemo(() => {
    if (!content) return [];
    return content.split(/(\s+)/); // Keep whitespace
  }, [content]);

  return (
    <div className={className}>
      <AnimatePresence mode="sync">
        {words.map((word, index) => (
          <motion.span
            key={`${index}-${word}`}
            variants={streamingToken}
            initial="hidden"
            animate="visible"
            transition={{
              delay: isStreaming ? index * 0.01 : 0,
            }}
            className="inline"
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>
      {isStreaming && (
        <motion.span
          className="inline-block w-1 h-5 ml-1 bg-indigo-500"
          animate={{ opacity: [1, 0, 1] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      )}
    </div>
  );
}
