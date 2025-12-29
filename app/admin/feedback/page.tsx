import React from 'react';

export const metadata = {
  title: 'Feedback Analytics - Admin Dashboard',
  description: 'User feedback and ratings analysis',
};

// Placeholder data - will be replaced with real database queries
const mockFeedback = [
  {
    id: 'fb-001',
    queryId: 'query-123',
    rating: 5,
    category: 'helpful',
    comment: 'Very comprehensive answer with accurate citations',
    domain: 'healthcare',
    timestamp: '2025-12-29T10:30:00Z',
  },
  {
    id: 'fb-002',
    queryId: 'query-124',
    rating: 4,
    category: 'helpful',
    comment: 'Good answer but could be more detailed',
    domain: 'finance',
    timestamp: '2025-12-29T10:25:00Z',
  },
  {
    id: 'fb-003',
    queryId: 'query-125',
    rating: 3,
    category: 'incomplete',
    comment: 'Answer missed some key points about implementation',
    domain: 'finance',
    timestamp: '2025-12-29T10:20:00Z',
  },
  {
    id: 'fb-004',
    queryId: 'query-126',
    rating: 5,
    category: 'helpful',
    comment: 'Excellent! Saved me hours of research',
    domain: 'healthcare',
    timestamp: '2025-12-29T10:15:00Z',
  },
  {
    id: 'fb-005',
    queryId: 'query-127',
    rating: 2,
    category: 'inaccurate',
    comment: 'Some information seemed outdated',
    domain: 'general',
    timestamp: '2025-12-29T10:10:00Z',
  },
];

const categoryColors: Record<string, string> = {
  helpful: 'bg-green-100 text-green-800',
  inaccurate: 'bg-red-100 text-red-800',
  incomplete: 'bg-yellow-100 text-yellow-800',
  confusing: 'bg-orange-100 text-orange-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function FeedbackPage() {
  const avgRating = mockFeedback.reduce((sum, f) => sum + f.rating, 0) / mockFeedback.length;
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating =>
    mockFeedback.filter(f => f.rating === rating).length
  );
  const categoryCounts = mockFeedback.reduce((acc, f) => {
    acc[f.category] = (acc[f.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{mockFeedback.length}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Average Rating</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {avgRating.toFixed(1)} ⭐
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Positive (4-5)</dt>
          <dd className="mt-1 text-3xl font-semibold text-green-600">
            {mockFeedback.filter(f => f.rating >= 4).length}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Negative (1-2)</dt>
          <dd className="mt-1 text-3xl font-semibold text-red-600">
            {mockFeedback.filter(f => f.rating <= 2).length}
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
              const percentage = (count / mockFeedback.length) * 100;
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
            {Object.entries(categoryCounts).map(([category, count]) => {
              const percentage = (count / mockFeedback.length) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${categoryColors[category]}`}>
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
            })}
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
                  Domain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockFeedback.map((feedback) => (
                <tr key={feedback.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-lg font-semibold text-gray-900">
                        {feedback.rating}
                      </span>
                      <span className="ml-1 text-yellow-500">⭐</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${categoryColors[feedback.category]}`}>
                      {feedback.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {feedback.comment}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      feedback.domain === 'healthcare' ? 'bg-green-100 text-green-800' :
                      feedback.domain === 'finance' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.domain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(feedback.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
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
              <ul className="list-disc pl-5 space-y-1">
                <li>80% positive feedback (4-5 stars) with healthcare leading satisfaction</li>
                <li>Most common category: "helpful" at 60%</li>
                <li>Finance domain shows room for improvement with 3.3 average rating</li>
                <li>Consider updating general domain knowledge base based on outdated flags</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
