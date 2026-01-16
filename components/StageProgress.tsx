"use client";

import { motion } from "framer-motion";

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
      gradient: "from-violet-500 to-purple-600",
      description: "Gathering insights from AI experts",
    },
    {
      number: 2,
      label: "Peer Review",
      icon: "⚖️",
      gradient: "from-cyan-500 to-blue-600",
      description: "Evaluating and ranking responses",
    },
    {
      number: 3,
      label: "Synthesis",
      icon: "✨",
      gradient: "from-indigo-500 to-purple-600",
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
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  opacity: isCompleted || isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div
                  className={`
                    px-3 sm:px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium
                    transition-all duration-300
                    ${
                      isActive
                        ? `bg-gradient-to-r ${stage.gradient} text-white shadow-lg`
                        : isCompleted
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400"
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
                  <motion.div
                    className={`absolute inset-0 rounded-xl bg-gradient-to-r ${stage.gradient} opacity-30`}
                    animate={{
                      scale: [1, 1.15, 1],
                      opacity: [0.3, 0, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                )}
              </motion.div>

              {/* Connector line */}
              {idx < stages.length - 1 && (
                <div
                  className={`
                    w-6 sm:w-10 h-0.5 mx-1
                    ${
                      currentStage > stage.number
                        ? "bg-emerald-500"
                        : "bg-neutral-200 dark:bg-neutral-700"
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
        <motion.div
          key={currentStage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
            {stages[currentStage - 1].label}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {stages[currentStage - 1].description}
          </p>
        </motion.div>
      )}

      {/* Progress Bar for Stage 1 */}
      {currentStage === 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-neutral-600 dark:text-neutral-400">
            <span>Expert Responses</span>
            <span className="font-mono">
              {completedExperts}/{expertCount}
            </span>
          </div>
          <div className="h-2 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Loading Spinner */}
      {currentStage && (
        <div className="flex justify-center">
          <motion.div
            className="w-8 h-8 rounded-full border-2 border-neutral-200 dark:border-neutral-700 border-t-indigo-500 border-r-cyan-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      )}
    </div>
  );
}
