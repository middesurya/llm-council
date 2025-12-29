import React from 'react';

export const metadata = {
  title: 'Admin Dashboard - LLM Council',
  description: 'Analytics and monitoring dashboard',
};

export default function AdminDashboard() {
  // Placeholder data - will be replaced with real database queries
  const stats = {
    totalQueries: 1247,
    avgProcessingTime: 3.2,
    avgResponseLength: 1847,
    citationsRate: 73,
    domainUsage: {
      general: 523,
      healthcare: 412,
      finance: 312,
    },
    expertPerformance: {
      openai: { avgTime: 2.8, queries: 623 },
      anthropic: { avgTime: 3.6, queries: 624 },
    },
    recentTrends: {
      dailyQueries: [45, 52, 48, 61, 55, 67, 73],
      avgRating: 4.2,
    },
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Real-time analytics and system performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Queries */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Queries
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.totalQueries.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Processing Time */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Processing Time
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.avgProcessingTime}s
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Avg Response Length */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Avg Response Length
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.avgResponseLength} chars
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Citations Rate */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Citation Rate
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stats.citationsRate}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Domain Usage */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Domain Usage
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.domainUsage).map(([domain, count]) => {
                const percentage = (count / stats.totalQueries) * 100;
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700 capitalize">{domain}</span>
                      <span className="text-gray-500">{count} queries</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expert Performance */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Expert Performance
            </h3>
            <div className="space-y-4">
              {Object.entries(stats.expertPerformance).map(([provider, data]) => (
                <div key={provider} className="border-b border-gray-200 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {provider}
                    </span>
                    <span className="text-sm text-gray-500">{data.queries} queries</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Avg Time: {data.avgTime}s</span>
                    <span className="text-green-600 font-medium">
                      {data.avgTime < 3 ? 'Excellent' : 'Good'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Trends */}
      <div className="mt-6 bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Query Volume (Last 7 Days)
          </h3>
          <div className="flex items-end justify-between h-40 gap-2">
            {stats.recentTrends.dailyQueries.map((count, index) => {
              const maxCount = Math.max(...stats.recentTrends.dailyQueries);
              const height = (count / maxCount) * 100;
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-indigo-100 rounded-t relative" style={{ height: `${height}%` }}>
                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                      {count}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{days[index]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <a
                href="/admin/queries"
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                View All Queries →
              </a>
              <a
                href="/admin/experts"
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Expert Performance →
              </a>
              <a
                href="/admin/domains"
                className="text-indigo-600 hover:text-indigo-900 font-medium"
              >
                Domain Analytics →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
