interface DomainDisclaimerProps {
  domain: string;
}

export default function DomainDisclaimer({ domain }: DomainDisclaimerProps) {
  if (domain === "healthcare") {
    return (
      <div className="mb-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-amber-400"
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
          <div className="ml-3">
            <h3 className="text-sm font-medium text-amber-800">
              Medical Disclaimer
            </h3>
            <div className="mt-2 text-sm text-amber-700">
              <p>
                This system provides <strong>informational purposes only</strong> and is not a substitute for professional medical advice, diagnosis, or treatment.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Always seek the advice of your physician or qualified health provider</li>
                <li>Never disregard professional medical advice or delay seeking treatment</li>
                <li>For medical emergencies, contact emergency services immediately</li>
                <li>Responses may include ICD-10 and SNOMED CT codes for reference</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (domain === "finance") {
    return (
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
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
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Financial Disclaimer
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This system provides <strong>informational purposes only</strong> and is not financial, investment, legal, or tax advice.
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Consult qualified professionals before making financial decisions</li>
                <li>Responses may reference GAAP/IFRS standards but are not authoritative</li>
                <li>Past performance does not guarantee future results</li>
                <li>All outputs should be reviewed by certified professionals (CPA, CFA, etc.)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
