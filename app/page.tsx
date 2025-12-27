import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function Home() {
  return (
    <DomainLayout currentDomain="general">
      <ChatInterface
        domain="general"
        title="LLM Council - General Knowledge"
        description="Ask any question and get comprehensive answers from multiple AI experts"
      />
    </DomainLayout>
  );
}
