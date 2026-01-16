"use client";

import { useState, useEffect } from "react";
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
      // Fallback: Store in localStorage if database fails
      try {
        const existing = JSON.parse(localStorage.getItem("llm_council_feedback") || "[]");
        existing.push(feedbackData);
        localStorage.setItem("llm_council_feedback", JSON.stringify(existing));

        // Show success even though database failed (feedback saved locally)
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
        className="premium-card glass p-8 text-center overflow-hidden relative"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-50"
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
          {/* Animated Checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block"
          >
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
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
            <h3
              className="text-2xl font-bold text-green-800 mb-2"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Thank You! 🎉
            </h3>
            <p className="text-green-700">
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
      className="premium-card glass p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <h3
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Rate This Response
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>
            How helpful was this response? <span className="text-red-500">*</span>
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
                  className="relative focus:outline-none"
                  whileHover={{ scale: 1.2, rotate: 15 }}
                  whileTap={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.span
                    className="text-5xl cursor-pointer"
                    animate={{
                      color: isActive
                        ? "transparent"
                        : "rgb(209, 213, 219)",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    ★
                  </motion.span>
                  {isActive && (
                    <motion.span
                      className="absolute inset-0 text-5xl bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      ★
                    </motion.span>
                  )}
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
                <span className="text-2xl">{getRatingEmoji(hoverRating || rating)}</span>
                <span className="text-sm font-medium" style={{ color: "var(--color-neutral-700)" }}>
                  {getRatingLabel(hoverRating || rating)}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Dropdown */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Feedback Category <span className="text-gray-400">(optional)</span>
          </label>
          <motion.select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4"
            style={{
              borderColor: "var(--color-neutral-300)",
              backgroundColor: "var(--card-background)",
              color: "var(--foreground)",
            }}
            whileFocus={{
              borderColor: "var(--color-primary-500)",
              boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
            }}
          >
            <option value="">Select a category...</option>
            <option value="helpful">✅ Helpful</option>
            <option value="inaccurate">❌ Inaccurate</option>
            <option value="unclear">❓ Unclear</option>
            <option value="other">💭 Other</option>
          </motion.select>
        </motion.div>

        {/* Comment Textarea */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>
            Additional Comments <span className="text-gray-400">(optional)</span>
          </label>
          <motion.textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            maxLength={1000}
            disabled={submitting}
            className="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-4 resize-none"
            style={{
              borderColor: "var(--color-neutral-300)",
              backgroundColor: "var(--card-background)",
              color: "var(--foreground)",
              fontFamily: "var(--font-body)",
            }}
            whileFocus={{
              borderColor: "var(--color-primary-500)",
              boxShadow: "0 0 0 4px rgba(99, 102, 241, 0.1)",
            }}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-gray-500">Share your thoughts to help us improve</span>
            <motion.span
              className="text-xs font-mono"
              style={{ color: "var(--color-neutral-500)" }}
              animate={{
                color: comment.length > 900 ? "rgb(239, 68, 68)" : "var(--color-neutral-500)",
              }}
            >
              {comment.length}/1000
            </motion.span>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 bg-red-50 border-2 border-red-200 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">⚠️</span>
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={submitting || rating === 0}
          className={`
            w-full px-6 py-4 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-500 to-purple-600
            shadow-lg hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
          `}
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          whileHover={!submitting && rating > 0 ? { scale: 1.02 } : {}}
          whileTap={!submitting && rating > 0 ? { scale: 0.98 } : {}}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
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
