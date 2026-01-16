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
import { getModelPersona, type PersonaConfig } from "@/lib/utils/personas";
import { fadeInUp, staggerContainer } from "@/lib/utils/animations";

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
        // Use streaming endpoint
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
                setResponse((prev: any) => ({ ...prev, queryId: json.queryId }));
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
        // Use non-streaming endpoint
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

  const getDomainColor = () => {
    switch (domain) {
      case "healthcare":
        return "from-emerald-500 to-emerald-600";
      case "finance":
        return "from-amber-500 to-amber-600";
      default:
        return "from-violet-500 to-indigo-600";
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Hero Section with Premium Typography */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-4"
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold gradient-text-animated leading-tight"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
        >
          {title}
        </motion.h1>
        <motion.p
          className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.2, 0, 0, 1] }}
        >
          {description}
        </motion.p>
      </motion.div>

      {/* Domain-Specific Disclaimer */}
      <DomainDisclaimer domain={domain} />

      {/* Structured Input Helpers */}
      <StructuredInput domain={domain} onSubmit={handleStructuredSubmit} />

      {/* Document Upload */}
      <DocumentUpload domain={domain} onAnalyze={handleDocumentAnalyze} />

      {/* Premium Query Form with Liquid Glass */}
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-4"
      >
        <motion.div
          className="liquid-glass p-2 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <motion.input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your question..."
                disabled={loading}
                className={`
                  w-full px-6 py-4 rounded-xl border-0 transition-all duration-300
                  focus:outline-none bg-transparent
                  ${loading ? "cursor-not-allowed opacity-60" : ""}
                `}
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--foreground)",
                  fontSize: "1.1rem",
                }}
              />
              {/* Animated focus ring */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: query.length > 0 ? 1 : 0 }}
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(34, 211, 238, 0.1))",
                }}
              />
            </div>
            <motion.button
              type="submit"
              disabled={loading || !query.trim()}
              className={`
                relative overflow-hidden px-8 py-4 rounded-xl font-semibold text-white
                bg-gradient-to-r ${getDomainColor()}
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-300
              `}
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              whileHover={!loading && query.trim() ? {
                scale: 1.02,
                boxShadow: "0 10px 40px -10px rgba(99, 102, 241, 0.5)"
              } : {}}
              whileTap={!loading && query.trim() ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  {/* Premium loading spinner */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <motion.circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, rotate: 0 }}
                      animate={{ pathLength: 0.75, rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "center" }}
                    />
                  </svg>
                  <span>Consulting...</span>
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Ask Council</span>
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    →
                  </motion.span>
                </span>
              )}
              {/* Shine effect on button */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              />
            </motion.button>
          </div>
        </motion.div>

        {/* Premium Streaming Toggle */}
        <motion.label
          className="flex items-center gap-3 px-5 py-3.5 rounded-xl cursor-pointer liquid-glass-interactive"
          whileHover={{ scale: 1.005 }}
          whileTap={{ scale: 0.995 }}
        >
          <div className="relative">
            <input
              type="checkbox"
              checked={useStreaming}
              onChange={(e) => setUseStreaming(e.target.checked)}
              className="sr-only"
            />
            <motion.div
              className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                useStreaming ? "bg-gradient-to-r from-indigo-500 to-cyan-500" : "bg-gray-300"
              }`}
            >
              <motion.div
                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                animate={{ x: useStreaming ? 22 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </motion.div>
          </div>
          <span className="text-sm flex items-center gap-2">
            <motion.span
              className="text-lg"
              animate={useStreaming ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              ⚡
            </motion.span>
            <span style={{ color: "var(--foreground)", fontWeight: 500 }}>
              Real-time streaming
            </span>
            <span className="text-gray-500 text-xs">(see answers appear live)</span>
          </span>
        </motion.label>
      </motion.form>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-50 border-2 border-red-200 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-800">Error</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage Progress */}
      <AnimatePresence>
        {loading && currentStage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="premium-card p-8"
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
            {/* Final Answer - Premium Liquid Glass Card */}
            <motion.div
              variants={fadeInUp}
              className="liquid-glass-elevated p-8 relative overflow-hidden"
            >
              {/* Animated gradient border */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(34, 211, 238, 0.1), rgba(99, 102, 241, 0.1))",
                  backgroundSize: "200% 200%",
                }}
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center"
                    animate={loading && streamingContent ? {
                      boxShadow: [
                        "0 0 0 0 rgba(99, 102, 241, 0.4)",
                        "0 0 0 10px rgba(99, 102, 241, 0)",
                      ],
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-2xl">✨</span>
                  </motion.div>
                  <div className="flex-1">
                    <h2
                      className="text-2xl md:text-3xl font-bold gradient-text"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Council Consensus
                    </h2>
                    <p className="text-sm text-gray-500">Synthesized from multiple AI experts</p>
                  </div>
                  {loading && streamingContent && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="liquid-glass-pill"
                    >
                      <div className="thinking-dots">
                        <span />
                        <span />
                        <span />
                      </div>
                      <span className="text-xs font-medium text-cyan-700">Live</span>
                    </motion.div>
                  )}
                </div>

                <div className="gradient-divider mb-6" />

                <div className="relative">
                  <StreamingText
                    content={streamingContent || response?.stage3?.synthesis || ""}
                    isStreaming={loading && !!streamingContent}
                    className="prose prose-lg max-w-none text-gray-800 leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>

            {/* Expert Answers (Stage 1) */}
            {(stage1Data.length > 0 || (!useStreaming && response?.stage1)) && (
              <motion.details
                variants={fadeInUp}
                className="premium-card overflow-hidden"
                open
              >
                <summary className="px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🧠</span>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Expert Analysis
                    </h3>
                    <span className="ml-auto px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                      Stage 1
                    </span>
                  </div>
                </summary>
                <div className="px-6 pb-6 space-y-4">
                  {(stage1Data.length > 0 ? stage1Data : response?.stage1 || []).map(
                    (answer: any, idx: number) => {
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
                    }
                  )}
                </div>
              </motion.details>
            )}

            {/* Peer Reviews (Stage 2) */}
            {(stage2Data.length > 0 || (!useStreaming && response?.stage2)) && (
              <motion.details
                variants={fadeInUp}
                className="premium-card overflow-hidden"
              >
                <summary className="px-6 py-5 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    <h3
                      className="text-xl font-bold"
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                    >
                      Peer Review
                    </h3>
                    <span className="ml-auto px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium">
                      Stage 2
                    </span>
                  </div>
                </summary>
                <div className="px-6 pb-6 space-y-3">
                  {(stage2Data.length > 0 ? stage2Data : response?.stage2 || []).map(
                    (review: any, idx: number) => {
                      const reviewerPersona = getModelPersona(review.reviewerProvider, domain);
                      const targetPersona = getModelPersona(review.targetProvider, domain);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="p-4 rounded-lg glass border-l-4"
                          style={{
                            borderLeftColor: `var(--color-${reviewerPersona.color}-500)`,
                          }}
                        >
                          <p className="text-sm font-medium mb-2">
                            <span className="mr-1">{reviewerPersona.icon}</span>
                            <span style={{ color: `var(--color-${reviewerPersona.color}-700)` }}>
                              {reviewerPersona.name}
                            </span>
                            {" ranked "}
                            <span className="mr-1">{targetPersona.icon}</span>
                            <span style={{ color: `var(--color-${targetPersona.color}-700)` }}>
                              {targetPersona.name}
                            </span>
                            {" as "}
                            <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold">
                              #{review.ranking}
                            </span>
                          </p>
                          <p className="text-sm text-gray-700">{review.reasoning}</p>
                        </motion.div>
                      );
                    }
                  )}
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
              className="text-center text-sm text-gray-500 font-mono"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              <span>Query ID: {response?.queryId}</span>
              <span className="mx-2">•</span>
              <span>Domain: {response?.domain || domain}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
