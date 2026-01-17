"use client";

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
      <div className="prose prose-slate dark:prose-invert max-w-none animate-fade-in">
        <pre className="whitespace-pre-wrap font-sans text-slate-800 dark:text-slate-200 leading-relaxed text-base">
          {content}
          {isStreaming && (
            <span className="inline-block w-2 h-5 ml-0.5 bg-violet-500 animate-pulse rounded-sm" />
          )}
        </pre>
      </div>

      {/* Streaming glow effect */}
      {isStreaming && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none opacity-50" />
      )}
    </div>
  );
}
