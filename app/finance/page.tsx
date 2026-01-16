import ChatInterface from "@/components/ChatInterface";
import DomainLayout from "@/components/DomainLayout";

export default function FinancePage() {
  return (
    <DomainLayout currentDomain="finance">
      <div className="relative">
        {/* Background decoration - Blue/Indigo theme */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <ChatInterface
          domain="finance"
          title="Finance & Business"
          description="Expert financial analysis with GAAP/IFRS standards and regulatory guidance from AI analysts"
        />
      </div>
    </DomainLayout>
  );
}
