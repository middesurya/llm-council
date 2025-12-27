"use client";

import { useState, useRef } from "react";

interface DocumentUploadProps {
  domain: string;
  onAnalyze: (query: string, content: string) => void;
}

export default function DocumentUpload({ domain, onAnalyze }: DocumentUploadProps) {
  const [expanded, setExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = [
        "text/plain",
        "application/pdf",
        "text/markdown",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      const validExtensions = [".txt", ".pdf", ".md", ".csv", ".xls", ".xlsx"];

      const isValidType = validTypes.includes(selectedFile.type);
      const hasValidExtension = validExtensions.some((ext) =>
        selectedFile.name.toLowerCase().endsWith(ext)
      );

      if (!isValidType && !hasValidExtension) {
        alert("Please upload a valid file (txt, pdf, md, csv, xls, xlsx)");
        return;
      }

      // Check file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("File size must be less than 10MB");
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !query.trim()) {
      alert("Please select a file and enter a question");
      return;
    }

    setLoading(true);

    try {
      // Read file content
      const content = await readFileContent(file);

      // Create analysis query
      const analysisQuery = `Document Analysis Request:

Document: ${file.name}
Type: ${file.type || "Unknown"}
Size: ${(file.size / 1024).toFixed(2)} KB

Question: ${query}

Document Content:
${content}

Please analyze the document and provide a comprehensive answer to the question.`;

      onAnalyze(analysisQuery, content);
      setExpanded(false);
      setFile(null);
      setQuery("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      alert("Error reading file: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Truncate content if too long (max 50,000 chars to avoid token limits)
        const maxLength = 50000;
        const truncated = content.length > maxLength
          ? content.substring(0, maxLength) + "\n\n... [Content truncated due to length] ..."
          : content;
        resolve(truncated);
      };

      reader.onerror = () => reject(new Error("Failed to read file"));

      // Read as text
      reader.readAsText(file);
    });
  };

  return (
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📎</span>
          <span className="font-semibold text-gray-800">Upload Document for Analysis</span>
        </div>
        <span className="text-gray-500">{expanded ? "▼" : "▶"}</span>
      </button>

      {expanded && (
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select File <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".txt,.pdf,.md,.csv,.xls,.xlsx"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <p className="text-xs text-gray-500 mt-1">
              Supported: TXT, PDF, Markdown, CSV, Excel (max 10MB)
            </p>
          </div>

          {file && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What would you like to know? <span className="text-red-500">*</span>
            </label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                domain === "healthcare"
                  ? "e.g., What are the key findings in this medical report? Are there any abnormal values?"
                  : domain === "finance"
                  ? "e.g., What is the revenue trend? Are there any compliance issues?"
                  : "e.g., Summarize this document and highlight key points."
              }
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || !query.trim() || loading}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Document"}
          </button>

          <div className="text-xs text-gray-500 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="font-medium text-amber-800 mb-1">⚠️ Privacy Notice</p>
            <p className="text-amber-700">
              Documents are processed for analysis purposes only. Do not upload sensitive personal or confidential information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
