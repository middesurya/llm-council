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
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="text-center space-y-3"
      >
        <h1
          className="text-5xl font-bold gradient-text-animated"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {title}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>
      </motion.div>

      {/* Domain-Specific Disclaimer */}
      <DomainDisclaimer domain={domain} />

      {/* Structured Input Helpers */}
      <StructuredInput domain={domain} onSubmit={handleStructuredSubmit} />

      {/* Document Upload */}
      <DocumentUpload domain={domain} onAnalyze={handleDocumentAnalyze} />

      {/* Main Query Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <motion.input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your question..."
            disabled={loading}
            className={`
              flex-1 px-6 py-4 rounded-xl border-2 transition-all duration-200
              focus:outline-none focus:ring-4
              ${loading
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white hover:border-indigo-300"
              }
            `}
            style={{
              fontFamily: "var(--font-body)",
              borderColor: "var(--color-neutral-300)",
              color: "var(--foreground)",
            }}
            whileFocus={{
              scale: 1.01,
              boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
              borderColor: "var(--color-primary-500)",
            }}
          />
          <motion.button
            type="submit"
            disabled={loading || !query.trim()}
            className={`
              px-8 py-4 rounded-xl font-semibold text-white
              bg-gradient-to-r ${getDomainColor()}
              shadow-lg hover:shadow-xl
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-200
            `}
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            whileHover={!loading && query.trim() ? { scale: 1.05 } : {}}
            whileTap={!loading && query.trim() ? { scale: 0.95 } : {}}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span>Processing...</span>
              </div>
            ) : (
              "Ask Council"
            )}
          </motion.button>
        </div>

        {/* Streaming Toggle */}
        <motion.label
          className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer glass"
          whileHover={{ scale: 1.01 }}
        >
          <input
            type="checkbox"
            checked={useStreaming}
            onChange={(e) => setUseStreaming(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-600"
          />
          <span className="text-sm flex items-center gap-2">
            <span className="text-lg">⚡</span>
            <span style={{ color: "var(--foreground)" }}>
              Enable real-time streaming (see answers appear live)
            </span>
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
            {/* Final Answer */}
            <motion.div
              variants={fadeInUp}
              className="premium-card gradient-border-animated p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✨</span>
                <h2
                  className="text-3xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                >
                  Council Consensus
                </h2>
                {loading && streamingContent && (
                  <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-sm font-medium animate-pulse">
                    Streaming...
                  </span>
                )}
              </div>
              <StreamingText
                content={streamingContent || response?.stage3?.synthesis || ""}
                isStreaming={loading && !!streamingContent}
                className="prose prose-lg max-w-none"
              />
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
