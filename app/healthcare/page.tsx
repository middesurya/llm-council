import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function HealthcarePage() {
  return (
    <DomainLayout currentDomain="healthcare">
      <ChatInterface
        domain="healthcare"
        title="LLM Council - Healthcare & Medicine"
        description="Expert medical consultations with ICD-10 and SNOMED CT coding support"
      />
    </DomainLayout>
  );
}
