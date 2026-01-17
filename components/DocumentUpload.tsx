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

  return (
    <div className="card w-full overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📎</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Upload Document for Analysis</span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>

      {expanded && (
        <div className="p-6 space-y-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select File <span className="text-red-500">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              accept=".txt,.pdf,.md,.csv,.xls,.xlsx"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-violet-100 dark:file:bg-violet-900/30 file:text-violet-700 dark:file:text-violet-300 hover:file:bg-violet-200 dark:hover:file:bg-violet-900/50 file:cursor-pointer"
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Supported: TXT, PDF, Markdown, CSV, Excel (max 10MB)
            </p>
          </div>

          {file && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-300">
                <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
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
              className="input resize-none"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!file || !query.trim() || loading}
            className={`btn w-full bg-gradient-to-r ${getDomainGradient()} text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Analyze Document"
            )}
          </button>

          <div className="text-xs bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">⚠️ Privacy Notice</p>
            <p className="text-amber-700 dark:text-amber-400">
              Documents are processed for analysis purposes only. Do not upload sensitive personal or confidential information.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
