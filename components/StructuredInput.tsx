"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { fadeInUp } from "@/lib/utils/animations";

interface StructuredInputProps {
  domain: string;
  onSubmit: (data: any) => void;
}

export default function StructuredInput({ domain, onSubmit }: StructuredInputProps) {
  if (domain === "healthcare") {
    return <SymptomChecker onSubmit={onSubmit} />;
  }

  if (domain === "finance") {
    return <FinancialTemplate onSubmit={onSubmit} />;
  }

  return null;
}

function SymptomChecker({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [duration, setDuration] = useState("");
  const [severity, setSeverity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const structuredQuery = `Medical consultation request:

Patient Profile:
- Age: ${age}
- Gender: ${gender}

Chief Complaint:
- Symptoms: ${symptoms}
- Duration: ${duration}
- Severity: ${severity}

Please provide a differential diagnosis and appropriate recommendations.`;

    onSubmit({ query: structuredQuery, domain: "healthcare" });

    // Reset form
    setAge("");
    setGender("");
    setSymptoms("");
    setDuration("");
    setSeverity("");
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Accordion.Root type="single" collapsible className="mb-6">
        <Accordion.Item value="symptom-checker" className="premium-card glass overflow-hidden">
          <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between group hover:bg-emerald-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                🩺
              </motion.span>
              <span
                className="text-xl font-bold text-emerald-700"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Symptom Checker
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                Healthcare
              </span>
            </div>
            <motion.div
              className="text-emerald-600"
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5 border-t border-emerald-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold mb-2 text-emerald-700">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="number"
                    required
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 45"
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
                    style={{
                      borderColor: "var(--color-neutral-300)",
                      backgroundColor: "var(--card-background)",
                    }}
                    whileFocus={{
                      borderColor: "#10b981",
                      boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
                    }}
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold mb-2 text-emerald-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <motion.select
                    required
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
                    style={{
                      borderColor: "var(--color-neutral-300)",
                      backgroundColor: "var(--card-background)",
                    }}
                    whileFocus={{
                      borderColor: "#10b981",
                      boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </motion.select>
                </motion.div>
              </div>

              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold mb-2 text-emerald-700">
                  Symptoms <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  required
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail (e.g., chest pain, shortness of breath, headache location, etc.)"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 resize-none"
                  style={{
                    borderColor: "var(--color-neutral-300)",
                    backgroundColor: "var(--card-background)",
                  }}
                  whileFocus={{
                    borderColor: "#10b981",
                    boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
                  }}
                />
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold mb-2 text-emerald-700">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <motion.input
                    type="text"
                    required
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 2 days, 1 week, acute"
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
                    style={{
                      borderColor: "var(--color-neutral-300)",
                      backgroundColor: "var(--card-background)",
                    }}
                    whileFocus={{
                      borderColor: "#10b981",
                      boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
                    }}
                  />
                </motion.div>
                <motion.div whileFocus={{ scale: 1.01 }}>
                  <label className="block text-sm font-semibold mb-2 text-emerald-700">
                    Severity <span className="text-red-500">*</span>
                  </label>
                  <motion.select
                    required
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
                    style={{
                      borderColor: "var(--color-neutral-300)",
                      backgroundColor: "var(--card-background)",
                    }}
                    whileFocus={{
                      borderColor: "#10b981",
                      boxShadow: "0 0 0 4px rgba(16, 185, 129, 0.1)",
                    }}
                  >
                    <option value="">Select...</option>
                    <option value="Mild">Mild - Minor discomfort</option>
                    <option value="Moderate">Moderate - Noticeable impact</option>
                    <option value="Severe">Severe - Significant distress</option>
                    <option value="Emergency">Emergency - Immediate attention needed</option>
                  </motion.select>
                </motion.div>
              </div>

              <motion.button
                type="submit"
                className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Consultation Request 🩺
              </motion.button>
            </form>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </motion.div>
  );
}

function FinancialTemplate({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [template, setTemplate] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const structuredQuery = `Financial Analysis Request:

${template}

Details:
${details}

Please provide comprehensive financial analysis and recommendations.`;

    onSubmit({ query: structuredQuery, domain: "finance" });

    // Reset form
    setTemplate("");
    setDetails("");
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Accordion.Root type="single" collapsible className="mb-6">
        <Accordion.Item value="financial-template" className="premium-card glass overflow-hidden">
          <Accordion.Trigger className="w-full px-6 py-5 flex items-center justify-between group hover:bg-amber-50/50 transition-colors">
            <div className="flex items-center gap-3">
              <motion.span
                className="text-3xl"
                whileHover={{ scale: 1.2, rotate: 10 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                📊
              </motion.span>
              <span
                className="text-xl font-bold text-amber-700"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Financial Templates
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                Finance
              </span>
            </div>
            <motion.div
              className="text-amber-600"
              animate={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
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
            <form onSubmit={handleSubmit} className="p-6 space-y-5 border-t border-amber-100">
              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold mb-2 text-amber-700">
                  Analysis Type <span className="text-red-500">*</span>
                </label>
                <motion.select
                  required
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
                  style={{
                    borderColor: "var(--color-neutral-300)",
                    backgroundColor: "var(--card-background)",
                  }}
                  whileFocus={{
                    borderColor: "#f59e0b",
                    boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.1)",
                  }}
                >
                  <option value="">Select a template...</option>
                  <option value="Revenue Forecast Analysis">📈 Revenue Forecast Analysis</option>
                  <option value="Investment Risk Assessment">⚠️ Investment Risk Assessment</option>
                  <option value="Financial Compliance Review (GAAP/IFRS)">✅ Financial Compliance Review (GAAP/IFRS)</option>
                  <option value="Budget Variance Analysis">📊 Budget Variance Analysis</option>
                  <option value="Mergers & Acquisitions Evaluation">🤝 Mergers & Acquisitions Evaluation</option>
                  <option value="Cash Flow Analysis">💵 Cash Flow Analysis</option>
                  <option value="Financial Ratio Analysis">📉 Financial Ratio Analysis</option>
                  <option value="Scenario Analysis">🎯 Scenario Analysis</option>
                </motion.select>
              </motion.div>

              <motion.div whileFocus={{ scale: 1.01 }}>
                <label className="block text-sm font-semibold mb-2 text-amber-700">
                  Details <span className="text-red-500">*</span>
                </label>
                <motion.textarea
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide relevant details, numbers, timeframes, and context..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 resize-none"
                  style={{
                    borderColor: "var(--color-neutral-300)",
                    backgroundColor: "var(--card-background)",
                  }}
                  whileFocus={{
                    borderColor: "#f59e0b",
                    boxShadow: "0 0 0 4px rgba(245, 158, 11, 0.1)",
                  }}
                />
                <p className="text-xs text-amber-600 mt-2">
                  💡 Tip: Include specific figures, dates, and metrics for more accurate analysis
                </p>
              </motion.div>

              <motion.button
                type="submit"
                className="w-full px-6 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-lg hover:shadow-xl transition-all"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Generate Financial Analysis Request 📊
              </motion.button>
            </form>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </motion.div>
  );
}
