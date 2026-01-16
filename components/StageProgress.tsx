"use client";

interface StageProgressProps {
  currentStage: 1 | 2 | 3 | null;
  expertCount?: number;
  completedExperts?: number;
}

export default function StageProgress({
  currentStage,
  expertCount = 3,
  completedExperts = 0,
}: StageProgressProps) {
  if (!currentStage) return null;

  const stages = [
    {
      number: 1,
      label: "Expert Analysis",
      icon: "🧠",
      gradient: "from-violet-500 to-cyan-500",
      description: "Gathering insights from AI experts",
    },
    {
      number: 2,
      label: "Peer Review",
      icon: "⚖️",
      gradient: "from-cyan-500 to-teal-500",
      description: "Evaluating and ranking responses",
    },
    {
      number: 3,
      label: "Synthesis",
      icon: "✨",
      gradient: "from-teal-500 to-violet-500",
      description: "Creating comprehensive consensus",
    },
  ];

  const progress =
    currentStage === 1
      ? (completedExperts / expertCount) * 100
      : currentStage === 2
        ? 50
        : 100;

  return (
    <div className="space-y-6">
      {/* Stage Pills */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {stages.map((stage, idx) => {
          const isActive = currentStage === stage.number;
          const isCompleted = currentStage > stage.number;

          return (
            <div key={stage.number} className="flex items-center">
              <div
                className={`
                  relative animate-fade-in-up
                  ${isActive ? "scale-105" : "scale-100"}
                  ${isCompleted || isActive ? "opacity-100" : "opacity-40"}
                  transition-all duration-300
                `}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`
                    px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? `bg-gradient-to-r ${stage.gradient} text-white shadow-lg`
                        : isCompleted
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }
                  `}
                >
                  <span className="text-base sm:text-lg">{stage.icon}</span>
                  <span className="hidden sm:inline">{stage.label}</span>
                  <span className="sm:hidden">S{stage.number}</span>
                  {isCompleted && <span className="ml-1">✓</span>}
                </div>

                {/* Active pulse effect */}
                {isActive && (
                  <div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stage.gradient} opacity-30 animate-ping`}
                    style={{ animationDuration: "2s" }}
                  />
                )}
              </div>

              {/* Connector line */}
              {idx < stages.length - 1 && (
                <div
                  className={`
                    w-6 sm:w-10 h-0.5 mx-1 transition-colors duration-300
                    ${
                      currentStage > stage.number
                        ? "bg-green-500"
                        : "bg-slate-200 dark:bg-slate-700"
                    }
                  `}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Active Stage Description */}
      {currentStage && (
        <div className="text-center animate-fade-in-up">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
            {stages[currentStage - 1].label}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {stages[currentStage - 1].description}
          </p>
        </div>
      )}

      {/* Progress Bar for Stage 1 */}
      {currentStage === 1 && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
            <span>Expert Responses</span>
            <span className="font-mono">
              {completedExperts}/{expertCount}
            </span>
          </div>
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {currentStage && (
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-700 border-t-violet-500 border-r-cyan-500 animate-spin" />
        </div>
      )}
    </div>
  );
}
