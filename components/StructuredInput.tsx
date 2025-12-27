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
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">🩺</span>
          <span className="font-semibold text-gray-800">Symptom Checker</span>
        </div>
        <span className="text-gray-500">{expanded ? "▼" : "▶"}</span>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g., 45"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms in detail (e.g., chest pain, shortness of breath, headache location, etc.)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 2 days, 1 week, acute"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
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
    <div className="mb-6 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span className="font-semibold text-gray-800">Financial Templates</span>
        </div>
        <span className="text-gray-500">{expanded ? "▼" : "▶"}</span>
      </button>

      {expanded && (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Analysis Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Details <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide relevant details, numbers, timeframes, and context..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Generate Financial Analysis Request
          </button>
        </form>
      )}
    </div>
  );
}
