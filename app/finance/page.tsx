import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function FinancePage() {
  return (
    <DomainLayout currentDomain="finance">
      <ChatInterface
        domain="finance"
        title="LLM Council - Finance & Business"
        description="Expert financial analysis with GAAP/IFRS standards and regulatory guidance"
      />
    </DomainLayout>
  );
}
