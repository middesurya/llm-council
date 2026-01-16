"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { fadeInUp, scaleInBounce, successCheck } from "@/lib/utils/animations";

interface FeedbackFormProps {
  queryId: string;
}

export default function FeedbackForm({ queryId }: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ["#6366f1", "#22d3ee", "#8b5cf6", "#10b981"];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setSubmitting(true);
    setError(null);

    const feedbackData = {
      queryId,
      rating,
      category: category || undefined,
      comment: comment.trim() || undefined,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedbackData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSubmitted(true);
      triggerConfetti();
    } catch (err: any) {
      try {
        const existing = JSON.parse(
          localStorage.getItem("llm_council_feedback") || "[]"
        );
        existing.push(feedbackData);
        localStorage.setItem("llm_council_feedback", JSON.stringify(existing));
        setSubmitted(true);
        triggerConfetti();
      } catch (localErr) {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (stars: number) => {
    const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];
    return labels[stars] || "";
  };

  const getRatingEmoji = (stars: number) => {
    const emojis = ["", "😞", "😐", "🙂", "😊", "🤩"];
    return emojis[stars] || "";
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-8 text-center overflow-hidden relative"
      >
        {/* Animated Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        <div className="relative z-10 space-y-4">
          {/* Success Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="inline-block"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <motion.svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial="hidden"
                animate="visible"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                  variants={successCheck}
                />
              </motion.svg>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-emerald-700 dark:text-emerald-300">
              Your feedback helps us improve the LLM Council system.
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="glass-card p-6 sm:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
          Rate This Response
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
            How helpful was this response?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 items-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= (hoverRating || rating);
              return (
                <motion.button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                  className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span
                    className={`text-4xl sm:text-5xl transition-colors duration-200 ${
                      isActive ? "text-amber-400" : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  >
                    ★
                  </span>
                </motion.button>
              );
            })}
          </div>
          <AnimatePresence mode="wait">
            {(hoverRating || rating) > 0 && (
              <motion.div
                key={hoverRating || rating}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 flex items-center gap-2"
              >
                <span className="text-2xl">
                  {getRatingEmoji(hoverRating || rating)}
                </span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Feedback Category{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 
              bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
              outline-none transition-all"
          >
            <option value="">Select a category...</option>
            <option value="helpful">✅ Helpful</option>
            <option value="inaccurate">❌ Inaccurate</option>
            <option value="unclear">❓ Unclear</option>
            <option value="other">💭 Other</option>
          </select>
        </div>

        {/* Comment Textarea */}
        <div>
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            Additional Comments{" "}
            <span className="text-neutral-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            maxLength={1000}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 
              bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white
              placeholder-neutral-400 dark:placeholder-neutral-500
              focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
              outline-none transition-all resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-neutral-500">
              Share your thoughts to help us improve
            </span>
            <span
              className={`text-xs font-mono ${
                comment.length > 900
                  ? "text-red-500"
                  : "text-neutral-400"
              }`}
            >
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={submitting || rating === 0}
          className="w-full px-6 py-4 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-purple-600
            shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200"
          whileHover={!submitting && rating > 0 ? { scale: 1.02 } : {}}
          whileTap={!submitting && rating > 0 ? { scale: 0.98 } : {}}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <span>Submitting...</span>
            </div>
          ) : (
            <span>Submit Feedback ✨</span>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
