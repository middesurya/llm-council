"use client";

import { useState } from "react";

interface TranscriptViewProps {
  transcript: any;
}

export default function TranscriptView({ transcript }: TranscriptViewProps) {
  const [expandedStages, setExpandedStages] = useState<{
    stage1: boolean;
    stage2: boolean;
  }>({
    stage1: false,
    stage2: false,
  });

  if (!transcript) {
    return (
      <div className="text-center text-gray-500 py-8">
        No transcript data available
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stage 3: Final Synthesis */}
      <div className="bg-white border-2 border-green-200 rounded-lg p-6 shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
            Stage 3: Final Synthesis
          </span>
          <span className="text-sm text-gray-500">
            by{" "}
            <span className="font-semibold capitalize">
              {transcript.stage3.provider}
            </span>{" "}
            ({transcript.stage3.model})
          </span>
        </div>
        <div className="prose max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
            {transcript.stage3.synthesis}
          </pre>
        </div>
      </div>

      {/* Stage 1: Divergent Answers */}
      <details
        className="bg-white border border-gray-200 rounded-lg shadow-sm"
        open={expandedStages.stage1}
      >
        <summary
          className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium flex items-center justify-between"
          onClick={() =>
            setExpandedStages((prev) => ({ ...prev, stage1: !prev.stage1 }))
          }
        >
          <span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              Stage 1: Divergent Answers
            </span>
            <span className="text-sm text-gray-500 ml-2">
              Individual expert responses
            </span>
          </span>
          <span className="text-sm text-gray-400">
            {expandedStages.stage1 ? "▼" : "▶"}
          </span>
        </summary>
        <div className="px-6 pb-6 space-y-4">
          {transcript.stage1.map((answer: any, idx: number) => (
            <div
              key={idx}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <h3 className="font-semibold text-lg capitalize mb-2">
                {answer.provider} ({answer.model})
              </h3>
              <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                {answer.answer}
              </pre>
            </div>
          ))}
        </div>
      </details>

      {/* Stage 2: Peer Reviews */}
      <details
        className="bg-white border border-gray-200 rounded-lg shadow-sm"
        open={expandedStages.stage2}
      >
        <summary
          className="px-6 py-4 cursor-pointer hover:bg-gray-50 font-medium flex items-center justify-between"
          onClick={() =>
            setExpandedStages((prev) => ({ ...prev, stage2: !prev.stage2 }))
          }
        >
          <span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              Stage 2: Peer Review
            </span>
            <span className="text-sm text-gray-500 ml-2">
              Cross-evaluation and ranking
            </span>
          </span>
          <span className="text-sm text-gray-400">
            {expandedStages.stage2 ? "▼" : "▶"}
          </span>
        </summary>
        <div className="px-6 pb-6">
          <div className="grid gap-3">
            {transcript.stage2.map((review: any, idx: number) => (
              <div
                key={idx}
                className="p-4 bg-purple-50 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold capitalize text-sm">
                    {review.reviewerProvider}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="font-semibold capitalize text-sm">
                    {review.targetProvider}
                  </span>
                  <span className="ml-auto bg-purple-200 text-purple-800 px-2 py-1 rounded text-sm font-bold">
                    #{review.ranking}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      </details>

      {/* Metadata */}
      <div className="text-xs text-gray-400 text-center border-t pt-4">
        Query ID: {transcript.queryId} | Domain: {transcript.domain} |
        Timestamp: {new Date(transcript.timestamp).toLocaleString()}
      </div>
    </div>
  );
}
