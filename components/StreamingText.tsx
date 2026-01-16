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
              delay: isStreaming ? index * 0.008 : 0,
              duration: 0.15,
              ease: [0.2, 0, 0, 1],
            }}
            className="inline"
          >
            {word}
          </motion.span>
        ))}
      </AnimatePresence>
      {isStreaming && (
        <span className="streaming-cursor" />
      )}
    </div>
  );
}
