"use client";

import { motion } from "framer-motion";
import { Progress } from "@radix-ui/react-progress";

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
      color: "violet",
      description: "Gathering insights from multiple AI experts",
    },
    {
      number: 2,
      label: "Peer Review",
      icon: "⚖️",
      color: "cyan",
      description: "Evaluating and ranking expert responses",
    },
    {
      number: 3,
      label: "Synthesis",
      icon: "✨",
      color: "indigo",
      description: "Creating comprehensive consensus answer",
    },
  ];

  const getStageColor = (stageNum: number) => {
    const stage = stages.find((s) => s.number === stageNum);
    return stage?.color || "gray";
  };

  const progress = currentStage === 1
    ? (completedExperts / expertCount) * 100
    : currentStage === 2
    ? 50
    : 100;

  return (
    <div className="space-y-6">
      {/* Stage Pills */}
      <div className="flex items-center justify-center gap-3">
        {stages.map((stage) => {
          const isActive = currentStage === stage.number;
          const isCompleted = currentStage > stage.number;
          const colorClass =
            stage.color === "violet" ? "from-violet-500 to-purple-600" :
            stage.color === "cyan" ? "from-cyan-500 to-blue-600" :
            "from-indigo-500 to-purple-600";

          return (
            <motion.div
              key={stage.number}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: isActive ? 1.05 : 1,
                opacity: isCompleted || isActive ? 1 : 0.4
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div
                className={`
                  px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium
                  ${isActive
                    ? `bg-gradient-to-r ${colorClass} text-white shadow-lg`
                    : isCompleted
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600"
                  }
                `}
              >
                <span className="text-lg">{stage.icon}</span>
                <span className="hidden sm:inline">Stage {stage.number}</span>
                {isCompleted && <span className="ml-1">✓</span>}
              </div>

              {/* Pulsing indicator for active stage */}
              {isActive && (
                <motion.div
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${colorClass} opacity-30`}
                  animate={{
                    scale: [1, 1.2, 1],
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
          <h3
            className="text-lg font-semibold mb-1"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {stages[currentStage - 1].label}
          </h3>
          <p className="text-sm text-gray-600">
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
          <div className="flex justify-between text-sm text-gray-600">
            <span>Expert Responses</span>
            <span
              className="font-mono"
              style={{ fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {completedExperts}/{expertCount}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      )}

      {/* Loading Spinner for Active Stage */}
      {currentStage && (
        <div className="flex justify-center">
          <motion.div
            className="w-8 h-8 border-3 border-t-indigo-500 border-r-cyan-500 border-b-violet-500 border-l-transparent rounded-full"
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
