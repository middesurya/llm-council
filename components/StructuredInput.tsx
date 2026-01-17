"use client";

import { useState } from "react";

interface StructuredInputProps {
  domain: string;
  onSubmit: (data: any) => void;
}

export default function StructuredInput({ domain, onSubmit }: StructuredInputProps) {
  const [expanded, setExpanded] = useState(false);

  if (domain === "healthcare") {
    return <SymptomChecker expanded={expanded} setExpanded={setExpanded} onSubmit={onSubmit} />;
  }

  if (domain === "finance") {
    return <FinancialTemplate expanded={expanded} setExpanded={setExpanded} onSubmit={onSubmit} />;
  }

  return null;
}

function SymptomChecker({ expanded, setExpanded, onSubmit }: { expanded: boolean; setExpanded: (v: boolean) => void; onSubmit: (data: any) => void }) {
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
  };

  return (
    <div className="card overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Symptom Checker</span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border-t border-slate-200 dark:border-slate-700">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 45"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-binary">Non-binary</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., chest pain, shortness of breath, headache location, etc.)"
              rows={3}
              className="input resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 days, 1 week, acute"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="input"
              >
                <option value="">Select...</option>
                <option value="Mild">Mild</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Generate Consultation Request
          </button>
        </form>
      )}
    </div>
  );
}

function FinancialTemplate({ expanded, setExpanded, onSubmit }: { expanded: boolean; setExpanded: (v: boolean) => void; onSubmit: (data: any) => void }) {
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
  };

  return (
    <div className="card overflow-hidden animate-fade-in-up">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Financial Templates</span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 transition-transform duration-200" style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 border-t border-slate-200 dark:border-slate-700">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Analysis Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="input"
            >
              <option value="">Select a template...</option>
              <option value="Revenue Forecast Analysis">Revenue Forecast Analysis</option>
              <option value="Investment Risk Assessment">Investment Risk Assessment</option>
              <option value="Financial Compliance Review (GAAP/IFRS)">Financial Compliance Review (GAAP/IFRS)</option>
              <option value="Budget Variance Analysis">Budget Variance Analysis</option>
              <option value="Mergers & Acquisitions Evaluation">Mergers & Acquisitions Evaluation</option>
              <option value="Cash Flow Analysis">Cash Flow Analysis</option>
              <option value="Financial Ratio Analysis">Financial Ratio Analysis</option>
              <option value="Scenario Analysis">Scenario Analysis</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide relevant details, numbers, timeframes, and context..."
              rows={4}
              className="input resize-none"
            />
          </div>

          <button
            type="submit"
            className="btn w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all"
          >
            Generate Financial Analysis Request
          </button>
        </form>
      )}
    </div>
  );
}
