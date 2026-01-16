import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function Home() {
  return (
    <DomainLayout currentDomain="general">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <ChatInterface
          domain="general"
          title="General Knowledge"
          description="Ask any question and get comprehensive answers from GPT-4, Claude, and Gemini working together"
        />
      </div>
    </DomainLayout>
  );
}
