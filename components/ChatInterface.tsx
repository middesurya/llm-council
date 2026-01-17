"use client";

import { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import DomainDisclaimer from "./DomainDisclaimer";
import StructuredInput from "./StructuredInput";
import DocumentUpload from "./DocumentUpload";
import StreamingText from "./StreamingText";
import StageProgress from "./StageProgress";
import ExpertCard from "./ExpertCard";
import { getModelPersona } from "@/lib/utils/personas";

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
        return "from-teal-500 to-cyan-500";
      case "finance":
        return "from-blue-500 to-indigo-500";
      default:
        return "from-cyan-500 to-violet-500";
    }
  };

  const getDomainAccent = () => {
    switch (domain) {
      case "healthcare":
        return "teal";
      case "finance":
        return "blue";
      default:
        return "violet";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-4 animate-fade-in-up">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
          <span className={`bg-gradient-to-r ${getDomainGradient()} bg-clip-text text-transparent`}>
            {title}
          </span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          {description}
        </p>
      </div>

      {/* Domain Disclaimer */}
      <DomainDisclaimer domain={domain} />

      {/* Structured Input Helpers */}
      <StructuredInput domain={domain} onSubmit={handleStructuredSubmit} />

      {/* Document Upload */}
      <DocumentUpload domain={domain} onAnalyze={handleDocumentAnalyze} />

      {/* Query Form */}
      <div className="card card-elevated p-6 sm:p-8 animate-fade-in-up">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask your question..."
                disabled={loading}
                className="input input-lg"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className={`
                btn px-8 py-4 rounded-xl font-semibold text-white
                bg-gradient-to-r ${getDomainGradient()}
                shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                transition-all duration-200 flex items-center justify-center gap-2
              `}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
            </button>
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
              <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-violet-500 transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
              <span className="mr-1.5">⚡</span>
              Real-time streaming responses
            </span>
          </label>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card p-5 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 animate-fade-in-up">
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
        </div>
      )}

      {/* Stage Progress */}
      {loading && currentStage && (
        <div className="card p-6 animate-fade-in-up">
          <StageProgress
            currentStage={currentStage}
            expertCount={3}
            completedExperts={completedExperts}
          />
        </div>
      )}

      {/* Results Section */}
      {(response || streamingContent) && (
        <div className="space-y-6 stagger">
          {/* Final Answer Card */}
          <div className="card card-elevated overflow-hidden animate-fade-in-up">
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
          </div>

          {/* Expert Answers (Stage 1) */}
          {(stage1Data.length > 0 || (!useStreaming && response?.stage1)) && (
            <details className="card overflow-hidden group animate-fade-in-up" open>
              <summary className="px-5 sm:px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🧠</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Expert Analysis
                  </span>
                  <span className="ml-auto badge badge-violet">
                    Stage 1
                  </span>
                </div>
              </summary>
              <div className="px-5 sm:px-6 pb-5 space-y-4 border-t border-slate-200 dark:border-slate-700 pt-5">
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
            </details>
          )}

          {/* Peer Reviews (Stage 2) */}
          {(stage2Data.length > 0 || (!useStreaming && response?.stage2)) && (
            <details className="card overflow-hidden animate-fade-in-up">
              <summary className="px-5 sm:px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-xl">⚖️</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    Peer Review
                  </span>
                  <span className="ml-auto badge badge-cyan">
                    Stage 2
                  </span>
                </div>
              </summary>
              <div className="px-5 sm:px-6 pb-5 space-y-3 border-t border-slate-200 dark:border-slate-700 pt-5">
                {(stage2Data.length > 0 ? stage2Data : response?.stage2 || []).map(
                  (review: any, idx: number) => {
                    const reviewerPersona = getModelPersona(review.reviewerProvider, domain);
                    const targetPersona = getModelPersona(review.targetProvider, domain);
                    return (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-l-2 border-cyan-500 animate-fade-in-up"
                        style={{ animationDelay: `${idx * 50}ms` }}
                      >
                        <p className="text-sm">
                          <span className="mr-1">{reviewerPersona.icon}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {reviewerPersona.name}
                          </span>
                          {" ranked "}
                          <span className="mr-1">{targetPersona.icon}</span>
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {targetPersona.name}
                          </span>
                          {" as "}
                          <span className="badge badge-cyan">
                            #{review.ranking}
                          </span>
                        </p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                          {review.reasoning}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </details>
          )}

          {/* Feedback Form */}
          {response?.queryId && !loading && (
            <div className="animate-fade-in-up">
              <FeedbackForm queryId={response.queryId} />
            </div>
          )}

          {/* Query Metadata */}
          <div className="text-center py-3 animate-fade-in">
            <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">
              Query: {response?.queryId?.slice(0, 8)}... • Domain:{" "}
              {response?.domain || domain}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
