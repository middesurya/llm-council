"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FeedbackForm from "./FeedbackForm";
import DomainDisclaimer from "./DomainDisclaimer";
import StructuredInput from "./StructuredInput";
import DocumentUpload from "./DocumentUpload";
import StreamingText from "./StreamingText";
import StageProgress from "./StageProgress";
import ExpertCard from "./ExpertCard";
import { getModelPersona } from "@/lib/utils/personas";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/utils/animations";

interface ChatInterfaceProps {
  domain?: string;
  title?: string;
  description?: string;
}

export default function ChatInterface({
  domain = "general",
  title = "LLM Council",
  description = "Ask a question and get insights from multiple AI experts",
}: ChatInterfaceProps) {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useStreaming, setUseStreaming] = useState(true);
  const [streamingContent, setStreamingContent] = useState("");
  const [stage1Data, setStage1Data] = useState<any[]>([]);
  const [stage2Data, setStage2Data] = useState<any[]>([]);
  const [currentStage, setCurrentStage] = useState<1 | 2 | 3 | null>(null);
  const [completedExperts, setCompletedExperts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    await submitQuery(query, domain);
  };

  const handleStructuredSubmit = (data: any) => {
    setQuery(data.query);
    submitQuery(data.query, data.domain);
  };

  const handleDocumentAnalyze = (query: string, content: string) => {
    setQuery(query);
    submitQuery(query, domain);
  };

  const submitQuery = async (queryText: string, domainValue: string) => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setStreamingContent("");
    setStage1Data([]);
    setStage2Data([]);
    setCurrentStage(1);
    setCompletedExperts(0);

    try {
      if (useStreaming) {
        const res = await fetch("/api/council/query/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: queryText, domain: domainValue }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to get response");
        }

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        if (!reader) throw new Error("Response body is not readable");

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith("data: ")) continue;

            try {
              const json = JSON.parse(trimmed.slice(6));
              if (json.type === "token") {
                setStreamingContent((prev) => prev + json.content);
                setCurrentStage(3);
              } else if (json.type === "init") {
                setResponse({ queryId: json.queryId, domain: json.domain });
                setCurrentStage(1);
              } else if (json.type === "complete") {
                setResponse((prev: any) => ({
                  ...prev,
                  queryId: json.queryId,
                }));
                setStage1Data(json.stage1 || []);
                setStage2Data(json.stage2 || []);
                setCurrentStage(null);
                setCompletedExperts(3);
              } else if (json.type === "error") {
                throw new Error(json.error);
              }
            } catch (e) {
              console.error("Failed to parse SSE data:", e);
            }
          }
        }
      } else {
        setCurrentStage(1);
        const res = await fetch("/api/council/query", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: queryText, domain: domainValue }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        setResponse(data);
        setCurrentStage(null);
      }
    } catch (err: any) {
      setError(err.message);
      setCurrentStage(null);
    } finally {
      setLoading(false);
    }
  };

  const getDomainGradient = () => {
    switch (domain) {
      case "healthcare":
        return "from-emerald-500 to-teal-600";
      case "finance":
        return "from-amber-500 to-orange-600";
      default:
        return "from-indigo-500 to-purple-600";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className={`bg-gradient-to-r ${getDomainGradient()} bg-clip-text text-transparent`}>
            {title}
          </span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </motion.div>

      {/* Domain Disclaimer */}
      <DomainDisclaimer domain={domain} />

      {/* Structured Input Helpers */}
      <StructuredInput domain={domain} onSubmit={handleStructuredSubmit} />

      {/* Document Upload */}
      <DocumentUpload domain={domain} onAnalyze={handleDocumentAnalyze} />

      {/* Query Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="glass-card p-6 sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your question..."
                disabled={loading}
                className="w-full px-5 py-4 rounded-xl border border-neutral-200 dark:border-neutral-700
                  bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
                  placeholder-neutral-400 dark:placeholder-neutral-500
                  focus:border-indigo-500 dark:focus:border-indigo-500
                  focus:ring-4 focus:ring-indigo-500/10
                  outline-none transition-all text-base
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !query.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                px-8 py-4 rounded-xl font-semibold text-white
                bg-gradient-to-r ${getDomainGradient()}
                shadow-lg hover:shadow-xl
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Ask Council</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </motion.button>
          </div>

          {/* Streaming Toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={useStreaming}
                onChange={(e) => setUseStreaming(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-neutral-200 dark:bg-neutral-700 rounded-full peer peer-checked:bg-indigo-500 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
              <span className="mr-1.5">⚡</span>
              Real-time streaming responses
            </span>
          </label>
        </form>
      </motion.div>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-5 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800 dark:text-red-200">
                  Error
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mt-1">
                  {error}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Progress */}
      <AnimatePresence>
        {loading && currentStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card p-6"
          >
            <StageProgress
              currentStage={currentStage}
              expertCount={3}
              completedExperts={completedExperts}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Section */}
      <AnimatePresence>
        {(response || streamingContent) && (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Final Answer Card */}
            <motion.div
              variants={fadeInUp}
              className="premium-card overflow-hidden"
            >
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${getDomainGradient()} p-5 sm:p-6`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Council Consensus
                      </h2>
                      <p className="text-white/80 text-sm">
                        Synthesized from multiple AI experts
                      </p>
                    </div>
                  </div>
                  {loading && streamingContent && (
                    <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      LIVE
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6">
                <StreamingText
                  content={streamingContent || response?.stage3?.synthesis || ""}
                  isStreaming={loading && !!streamingContent}
                />
              </div>
            </motion.div>

            {/* Expert Answers (Stage 1) */}
            {(stage1Data.length > 0 ||
              (!useStreaming && response?.stage1)) && (
              <motion.details
                variants={fadeInUp}
                className="glass-card overflow-hidden group"
                open
              >
                <summary className="px-5 sm:px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧠</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      Expert Analysis
                    </span>
                    <span className="ml-auto px-2.5 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-xs font-medium rounded-lg">
                      Stage 1
                    </span>
                  </div>
                </summary>
                <div className="px-5 sm:px-6 pb-5 space-y-4 border-t border-neutral-200 dark:border-neutral-700 pt-5">
                  {(stage1Data.length > 0
                    ? stage1Data
                    : response?.stage1 || []
                  ).map((answer: any, idx: number) => {
                    const persona = getModelPersona(answer.provider, domain);
                    return (
                      <ExpertCard
                        key={idx}
                        persona={persona}
                        answer={answer.answer}
                        model={answer.model}
                        index={idx}
                        isStreaming={loading && idx === stage1Data.length - 1}
                      />
                    );
                  })}
                </div>
              </motion.details>
            )}

            {/* Peer Reviews (Stage 2) */}
            {(stage2Data.length > 0 ||
              (!useStreaming && response?.stage2)) && (
              <motion.details
                variants={fadeInUp}
                className="glass-card overflow-hidden"
              >
                <summary className="px-5 sm:px-6 py-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">⚖️</span>
                    <span className="font-semibold text-neutral-900 dark:text-white">
                      Peer Review
                    </span>
                    <span className="ml-auto px-2.5 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-medium rounded-lg">
                      Stage 2
                    </span>
                  </div>
                </summary>
                <div className="px-5 sm:px-6 pb-5 space-y-3 border-t border-neutral-200 dark:border-neutral-700 pt-5">
                  {(stage2Data.length > 0
                    ? stage2Data
                    : response?.stage2 || []
                  ).map((review: any, idx: number) => {
                    const reviewerPersona = getModelPersona(
                      review.reviewerProvider,
                      domain
                    );
                    const targetPersona = getModelPersona(
                      review.targetProvider,
                      domain
                    );
                    return (
                      <motion.div
                        key={idx}
                        variants={staggerItem}
                        className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border-l-2 border-cyan-500"
                      >
                        <p className="text-sm">
                          <span className="mr-1">{reviewerPersona.icon}</span>
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {reviewerPersona.name}
                          </span>
                          {" ranked "}
                          <span className="mr-1">{targetPersona.icon}</span>
                          <span className="font-medium text-neutral-700 dark:text-neutral-300">
                            {targetPersona.name}
                          </span>
                          {" as "}
                          <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold rounded-md">
                            #{review.ranking}
                          </span>
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {review.reasoning}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.details>
            )}

            {/* Feedback Form */}
            {response?.queryId && !loading && (
              <motion.div variants={fadeInUp}>
                <FeedbackForm queryId={response.queryId} />
              </motion.div>
            )}

            {/* Query Metadata */}
            <motion.div
              variants={fadeInUp}
              className="text-center py-3"
            >
              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                Query: {response?.queryId?.slice(0, 8)}... • Domain:{" "}
                {response?.domain || domain}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
