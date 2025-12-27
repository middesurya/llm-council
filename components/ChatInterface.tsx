"use client";

import { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import DomainDisclaimer from "./DomainDisclaimer";
import StructuredInput from "./StructuredInput";
import DocumentUpload from "./DocumentUpload";
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
              } else if (json.type === "init") {
                setResponse({ queryId: json.queryId, domain: json.domain });
              } else if (json.type === "complete") {
                setResponse((prev: any) => ({ ...prev, queryId: json.queryId }));
                setStage1Data(json.stage1 || []);
                setStage2Data(json.stage2 || []);
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
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Domain-Specific Disclaimer */}
      <DomainDisclaimer domain={domain} />

      {/* Structured Input Helpers */}
      <StructuredInput domain={domain} onSubmit={handleStructuredSubmit} />

      {/* Document Upload */}
      <DocumentUpload domain={domain} onAnalyze={handleDocumentAnalyze} />

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask your question..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {loading ? "Processing..." : "Ask"}
            </button>
          </div>

          {/* Streaming Toggle */}
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={useStreaming}
              onChange={(e) => setUseStreaming(e.target.checked)}
              className="rounded"
            />
            <span>Enable streaming responses (see answers appear in real-time)</span>
          </label>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {(response || streamingContent) && (
        <div className="space-y-6">
          {/* Streaming or Final Answer */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">
              Final Answer
              {loading && streamingContent && <span className="ml-2 text-sm font-normal text-gray-500">(Streaming...)</span>}
            </h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {streamingContent || response?.stage3?.synthesis || ""}
              </pre>
            </div>
          </div>

          {/* Show Stage 1 & 2 for both streaming and non-streaming */}
          {(stage1Data.length > 0 || (!useStreaming && response?.stage1)) && (
            <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium">
                View Expert Answers (Stage 1)
              </summary>
              <div className="px-6 pb-6 space-y-4">
                {(stage1Data.length > 0 ? stage1Data : response?.stage1 || []).map((answer: any, idx: number) => {
                  const persona = getModelPersona(answer.provider, domain);
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        <span>{persona.icon}</span>
                        <span>{persona.name}</span>
                        <span className="text-sm font-normal text-gray-500">({persona.title})</span>
                        <span className="text-xs text-gray-400 ml-auto">{answer.model}</span>
                      </h3>
                      <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                        {answer.answer}
                      </pre>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {(stage2Data.length > 0 || (!useStreaming && response?.stage2)) && (
            <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium">
                View Peer Reviews (Stage 2)
              </summary>
              <div className="px-6 pb-6 space-y-3">
                {(stage2Data.length > 0 ? stage2Data : response?.stage2 || []).map((review: any, idx: number) => {
                  const reviewerPersona = getModelPersona(review.reviewerProvider, domain);
                  const targetPersona = getModelPersona(review.targetProvider, domain);
                  return (
                    <div
                      key={idx}
                      className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <p className="text-sm">
                        <span className="font-semibold" title={reviewerPersona.title}>
                          {reviewerPersona.icon} {reviewerPersona.name}
                        </span>{" "}
                        ranked{" "}
                        <span className="font-semibold" title={targetPersona.title}>
                          {targetPersona.icon} {targetPersona.name}
                        </span>{" "}
                        as <strong>#{review.ranking}</strong>
                      </p>
                      <p className="text-sm text-gray-700 mt-1">
                        {review.reasoning}
                      </p>
                    </div>
                  );
                })}
              </div>
            </details>
          )}

          {/* Feedback Form */}
          {response?.queryId && !loading && (
            <FeedbackForm queryId={response.queryId} />
          )}

          <div className="text-sm text-gray-500 text-center">
            Query ID: {response?.queryId} | Domain: {response?.domain || domain}
          </div>
        </div>
      )}
    </div>
  );
}
