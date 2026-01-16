"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { fadeInUp } from "@/lib/utils/animations";

interface DocumentUploadProps {
  domain: string;
  onAnalyze: (query: string, content: string) => void;
}

export default function DocumentUpload({ domain, onAnalyze }: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getDomainColor = () => {
    switch (domain) {
      case "healthcare":
        return { main: "#10b981", light: "#d1fae5", border: "#6ee7b7", focus: "0 0 0 4px rgba(16, 185, 129, 0.1)" };
      case "finance":
        return { main: "#f59e0b", light: "#fef3c7", border: "#fcd34d", focus: "0 0 0 4px rgba(245, 158, 11, 0.1)" };
      default:
        return { main: "#8b5cf6", light: "#ede9fe", border: "#c4b5fd", focus: "0 0 0 4px rgba(139, 92, 246, 0.1)" };
    }
  };

  const colors = getDomainColor();

  const getDomainIcon = () => {
    switch (domain) {
      case "healthcare":
        return "🩺";
      case "finance":
        return "💼";
      default:
        return "📎";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    processFile(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    processFile(droppedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (selectedFile?: File) => {
    if (!selectedFile) return;

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
      setError("Invalid file type. Please upload TXT, PDF, MD, CSV, or Excel files.");
      return;
    }

    // Check file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file || !query.trim()) {
      setError("Please select a file and enter a question");
      return;
    }

    setLoading(true);
    setError(null);
    setProgress(0);

    try {
      // Simulate progress during file reading
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      // Read file content
      const content = await readFileContent(file);

      clearInterval(progressInterval);
      setProgress(100);

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

      // Reset after short delay
      setTimeout(() => {
        setFile(null);
        setQuery("");
        setProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to read file");
      setProgress(0);
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
      reader.readAsText(file);
    });
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.toLowerCase();
    if (ext.endsWith(".pdf")) return "📄";
    if (ext.endsWith(".txt") || ext.endsWith(".md")) return "📝";
    if (ext.endsWith(".csv") || ext.endsWith(".xls") || ext.endsWith(".xlsx")) return "📊";
    return "📁";
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Accordion.Root type="single" collapsible className="mb-6">
        <Accordion.Item value="document-upload" className="premium-card glass overflow-hidden">
          <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between group hover:bg-opacity-50 transition-colors"
            style={{ backgroundColor: `${colors.light}40` }}
          >
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {getDomainIcon()}
              </motion.span>
              <span
                className="text-xl font-bold"
                style={{ fontFamily: "var(--font-space-grotesk)", color: colors.main }}
              >
                Upload Document for Analysis
              </span>
              {file && (
                <span className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: colors.light, color: colors.main }}
                >
                  1 file selected
                </span>
              )}
            </div>
            <motion.div
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
              style={{ color: colors.main }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="group-data-[state=open]:rotate-180 transition-transform duration-300"
              >
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </motion.div>
          </Accordion.Trigger>

          <Accordion.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
            <div className="p-6 space-y-5 border-t" style={{ borderColor: colors.border }}>
              {/* Drag and Drop Zone */}
              <motion.div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all"
                style={{
                  borderColor: isDragging ? colors.main : "var(--color-neutral-300)",
                  backgroundColor: isDragging ? colors.light : "var(--card-background)",
                }}
                whileHover={{ scale: 1.01 }}
                animate={isDragging ? { scale: 1.02 } : {}}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept=".txt,.pdf,.md,.csv,.xls,.xlsx"
                  className="hidden"
                />
                <motion.div
                  animate={isDragging ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
                >
                  <span className="text-5xl mb-3 block">📤</span>
                  <p className="font-semibold mb-1" style={{ color: colors.main }}>
                    {isDragging ? "Drop file here" : "Click to browse or drag & drop"}
                  </p>
                  <p className="text-sm text-gray-500">
                    TXT, PDF, Markdown, CSV, Excel (max 10MB)
                  </p>
                </motion.div>
              </motion.div>

              {/* File Preview Card */}
              <AnimatePresence>
                {file && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 rounded-lg border-2 relative"
                    style={{ borderColor: colors.border, backgroundColor: colors.light }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{getFileIcon(file.name)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate" style={{ color: colors.main }}>
                          {file.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                      </div>
                      <motion.button
                        onClick={removeFile}
                        className="p-2 rounded-lg hover:bg-red-100 transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <span className="text-xl text-red-600">✕</span>
                      </motion.button>
                    </div>

                    {/* Progress Bar */}
                    {loading && progress > 0 && (
                      <motion.div
                        className="mt-3 h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: "var(--color-neutral-200)" }}
                      >
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: colors.main }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Query Input */}
              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold mb-2" style={{ color: colors.main }}>
                  What would you like to know? <span className="text-red-500">*</span>
                </label>
                <motion.textarea
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
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 resize-none"
                  style={{
                    borderColor: "var(--color-neutral-300)",
                    backgroundColor: "var(--card-background)",
                    color: "var(--foreground)",
                  }}
                  whileFocus={{
                    borderColor: colors.main,
                    boxShadow: colors.focus,
                  }}
                />
              </motion.div>

              {/* Error Display */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 bg-red-50 border-2 border-red-200 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg">⚠️</span>
                      <p className="text-sm text-red-800 font-medium">{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Privacy Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs bg-amber-50 border border-amber-200 rounded-lg p-3"
              >
                <p className="font-medium text-amber-800 mb-1">⚠️ Privacy Notice</p>
                <p className="text-amber-700">
                  Documents are processed for analysis purposes only. Do not upload sensitive personal or confidential information.
                </p>
              </motion.div>

              {/* Analyze Button */}
              <motion.button
                onClick={handleAnalyze}
                disabled={!file || !query.trim() || loading}
                className="w-full px-6 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: `linear-gradient(to right, ${colors.main}, ${colors.main}dd)`,
                }}
                whileHover={!loading && file && query.trim() ? { scale: 1.02 } : {}}
                whileTap={!loading && file && query.trim() ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span>Analyzing... {progress}%</span>
                  </div>
                ) : (
                  <span>Analyze Document {getDomainIcon()}</span>
                )}
              </motion.button>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </motion.div>
  );
}
