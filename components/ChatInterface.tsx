"use client";

import { useState } from "react";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/council/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, domain }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      setResponse(data);
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

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-3">
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
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Final Answer</h2>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800">
                {response.stage3.synthesis}
              </pre>
            </div>
          </div>

          <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium">
              View Expert Answers (Stage 1)
            </summary>
            <div className="px-6 pb-6 space-y-4">
              {response.stage1.map((answer: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <h3 className="font-semibold text-lg capitalize">
                    {answer.provider} ({answer.model})
                  </h3>
                  <pre className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                    {answer.answer}
                  </pre>
                </div>
              ))}
            </div>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <summary className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium">
              View Peer Reviews (Stage 2)
            </summary>
            <div className="px-6 pb-6 space-y-3">
              {response.stage2.map((review: any, idx: number) => (
                <div
                  key={idx}
                  className="p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <p className="text-sm">
                    <span className="font-semibold capitalize">
                      {review.reviewerProvider}
                    </span>{" "}
                    ranked{" "}
                    <span className="font-semibold capitalize">
                      {review.targetProvider}
                    </span>{" "}
                    as <strong>#{review.ranking}</strong>
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    {review.reasoning}
                  </p>
                </div>
              ))}
            </div>
          </details>

          <div className="text-sm text-gray-500 text-center">
            Query ID: {response.queryId} | Domain: {response.domain}
          </div>
        </div>
      )}
    </div>
  );
}
