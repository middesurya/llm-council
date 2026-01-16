"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

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
    const colors = ["#8b5cf6", "#06b6d4", "#14b8a6", "#3b82f6"];

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
      <div className="card p-8 text-center overflow-hidden relative animate-fade-in-up">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30" />

        <div className="relative z-10 space-y-4">
          {/* Success Checkmark */}
          <div className="inline-block animate-scale-in">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
              Thank You! 🎉
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Your feedback helps us improve the LLM Council system.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Rate This Response
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            How helpful was this response?{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 items-center">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  disabled={submitting}
                  className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1 transition-transform hover:scale-125 active:scale-110"
                >
                  <span
                    className={`text-4xl sm:text-5xl transition-colors duration-200 ${
                      isActive ? "text-amber-400" : "text-slate-300 dark:text-slate-600"
                    }`}
                  >
                    ★
                  </span>
                </button>
              );
            })}
          </div>
          {(hoverRating || rating) > 0 && (
            <div className="mt-3 flex items-center gap-2 animate-fade-in">
              <span className="text-2xl">
                {getRatingEmoji(hoverRating || rating)}
              </span>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {getRatingLabel(hoverRating || rating)}
              </span>
            </div>
          )}
        </div>

        {/* Category Dropdown */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Feedback Category{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={submitting}
            className="input"
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
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Additional Comments{" "}
            <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={4}
            maxLength={1000}
            disabled={submitting}
            className="input resize-none"
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-slate-500">
              Share your thoughts to help us improve
            </span>
            <span
              className={`text-xs font-mono ${
                comment.length > 900
                  ? "text-red-500"
                  : "text-slate-400"
              }`}
            >
              {comment.length}/1000
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl animate-fade-in">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting || rating === 0}
          className="btn btn-primary w-full px-6 py-4 text-base"
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Submitting...</span>
            </div>
          ) : (
            <span>Submit Feedback ✨</span>
          )}
        </button>
      </form>
    </div>
  );
}
