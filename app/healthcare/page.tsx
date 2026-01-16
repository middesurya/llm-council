import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function HealthcarePage() {
  return (
    <DomainLayout currentDomain="healthcare">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        </div>

        <ChatInterface
          domain="healthcare"
          title="Healthcare & Medicine"
          description="Expert medical consultations with ICD-10 and SNOMED CT coding support from AI specialists"
        />
      </div>
    </DomainLayout>
  );
}
