'use client';

import React, { useEffect, useState } from 'react';

interface FeedbackData {
  queryId: string;
  rating: number;
  category: string | null;
  comment: string | null;
  createdAt: string;
}

interface FeedbackResponse {
  feedback: FeedbackData[];
  stats: {
    totalFeedback: number;
    avgRating: number;
    positiveCount: number;
    negativeCount: number;
  };
  ratingDistribution: number[];
  categoryCounts: Record<string, number>;
}

const categoryColors: Record<string, string> = {
  helpful: 'bg-green-100 text-green-800',
  inaccurate: 'bg-red-100 text-red-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
  confusing: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function FeedbackPage() {
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const response = await fetch('/api/admin/data/feedback?limit=50');

      if (!response.ok) {
        throw new Error('Failed to fetch feedback data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      setError('Failed to load feedback data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading feedback analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error Loading Feedback</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchFeedback}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { totalFeedback: 0, avgRating: 0, positiveCount: 0, negativeCount: 0 };
  const feedback = data?.feedback || [];
  const ratingDistribution = data?.ratingDistribution || [0, 0, 0, 0, 0];
  const categoryCounts = data?.categoryCounts || {};

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Feedback Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          User ratings and feedback analysis
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Feedback</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalFeedback}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {stats.avgRating.toFixed(1)} ⭐
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Positive (4-5)</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">
            {stats.positiveCount}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Negative (1-2)</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">
            {stats.negativeCount}
          </dd>
        </div>
      </div>

      {/* Rating Distribution & Category Breakdown */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
        {/* Rating Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Rating Distribution</h3>
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = ratingDistribution[rating - 1];
              const percentage = stats.totalFeedback > 0 ? (count / stats.totalFeedback) * 100 : 0;
              return (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">
                    {rating} ⭐
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-6">
                      <div
                        className={`h-6 rounded-full flex items-center justify-end pr-2 text-xs font-semibold ${
                          rating >= 4 ? 'bg-green-500 text-white' :
                          rating === 3 ? 'bg-yellow-500 text-white' :
                          'bg-red-500 text-white'
                        }`}
                        style={{ width: `${percentage}%` }}
                      >
                        {count > 0 && count}
                      </div>
                    </div>
                  </div>
                  <div className="w-12 text-right text-sm text-gray-600">
                    {percentage.toFixed(0)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Feedback Categories</h3>
          <div className="space-y-4">
            {Object.keys(categoryCounts).length === 0 ? (
              <p className="text-sm text-gray-500">No feedback categories available yet.</p>
            ) : (
              Object.entries(categoryCounts).map(([category, count]) => {
                const percentage = stats.totalFeedback > 0 ? (count / stats.totalFeedback) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[category] || 'bg-gray-100 text-gray-800'}`}>
                        {category}
                      </span>
                      <span className="text-gray-600">{count} feedback</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category === 'helpful' ? 'bg-green-500' :
                          category === 'inaccurate' ? 'bg-red-500' :
                          category === 'incomplete' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Recent Feedback Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Feedback
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comment
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {feedback.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500">
                    No feedback available yet. {stats.totalFeedback === 0 && 'Start collecting user feedback to see analytics.'}
                  </td>
                </tr>
              ) : (
                feedback.map((item) => (
                  <tr key={item.queryId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold text-gray-900">
                          {item.rating}
                        </span>
                        <span className="ml-1 text-yellow-500">⭐</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.category ? (
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}`}>
                          {item.category}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md">
                        {item.comment || <span className="text-gray-400">No comment</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Insights */}
      <div className="mt-6 bg-purple-50 border-l-4 border-purple-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-purple-800">Feedback Insights</h3>
            <div className="mt-2 text-sm text-purple-700">
              {stats.totalFeedback === 0 ? (
                <p>No feedback data available yet. User feedback will appear here once users start rating responses.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  <li>{stats.positiveCount} positive reviews (4-5 stars) = {stats.totalFeedback > 0 ? ((stats.positiveCount / stats.totalFeedback) * 100).toFixed(0) : 0}% satisfaction rate</li>
                  <li>Average rating: {stats.avgRating.toFixed(1)} / 5.0</li>
                  {Object.keys(categoryCounts).length > 0 && (
                    <li>Most common category: <strong>{Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][0]}</strong> ({Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0][1]} feedback)</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
