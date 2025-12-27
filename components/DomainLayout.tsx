import Link from "next/link";
import { ReactNode } from "react";

interface DomainLayoutProps {
  children: ReactNode;
  currentDomain?: string;
}

export default function DomainLayout({
  children,
  currentDomain = "general",
}: DomainLayoutProps) {
  const domains = [
    { id: "general", name: "General", icon: "💡", href: "/" },
    { id: "healthcare", name: "Healthcare", icon: "🏥", href: "/healthcare" },
    { id: "finance", name: "Finance", icon: "💰", href: "/finance" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600">
                  LLM Council
                </Link>
              </div>
              <div className="hidden sm:ml-10 sm:flex sm:space-x-8">
                {domains.map((domain) => (
                  <Link
                    key={domain.id}
                    href={domain.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      currentDomain === domain.id
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    <span className="mr-2">{domain.icon}</span>
                    {domain.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            LLM Council - Multi-expert AI consensus system powered by GPT-4,
            Claude, and Gemini
          </p>
        </div>
      </footer>
    </div>
  );
}
