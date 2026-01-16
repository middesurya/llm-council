"use client";

import { motion } from "framer-motion";

interface DomainDisclaimerProps {
  domain: string;
}

export default function DomainDisclaimer({ domain }: DomainDisclaimerProps) {
  if (domain === "healthcare") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-5 border-l-4 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-emerald-800 dark:text-emerald-200 mb-2">
              Medical Disclaimer
            </h3>
            <div className="text-sm text-emerald-700 dark:text-emerald-300 space-y-2">
              <p>
                This system provides{" "}
                <strong>informational purposes only</strong> and is not a
                substitute for professional medical advice, diagnosis, or
                treatment.
              </p>
              <ul className="list-none space-y-1.5 mt-3">
                {[
                  "Always seek the advice of your physician or qualified health provider",
                  "Never disregard professional medical advice or delay seeking treatment",
                  "For medical emergencies, contact emergency services immediately",
                  "Responses may include ICD-10 and SNOMED CT codes for reference",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  if (domain === "finance") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-5 border-l-4 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <svg
                className="h-5 w-5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Financial Disclaimer
            </h3>
            <div className="text-sm text-amber-700 dark:text-amber-300 space-y-2">
              <p>
                This system provides{" "}
                <strong>informational purposes only</strong> and is not
                financial, investment, legal, or tax advice.
              </p>
              <ul className="list-none space-y-1.5 mt-3">
                {[
                  "Consult qualified professionals before making financial decisions",
                  "Responses may reference GAAP/IFRS standards but are not authoritative",
                  "Past performance does not guarantee future results",
                  "All outputs should be reviewed by certified professionals (CPA, CFA, etc.)",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
