'use client';

import React, { useEffect, useState } from 'react';

interface DomainData {
  domain: string;
  totalQueries: number;
  avgProcessingTimeMs: number;
  avgResponseLength: number;
  citationsPerQuery: number;
  uniqueUsers: number;
  dailyTrend: number[];
  trendChange: number;
}

interface DomainsResponse {
  domains: DomainData[];
  totalQueries: number;
  aggregate: {
    totalQueries: number;
    avgProcessingTime: number;
    activeDomains: number;
    uniqueUsers: number;
  };
}

const domainConfig = {
  healthcare: {
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: '⚕️',
  },
  finance: {
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: '💰',
  },
  general: {
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-200',
    icon: '💬',
  },
};

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function DomainUsagePage() {
  const [data, setData] = useState<DomainsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const response = await fetch('/api/admin/data/domains?days=7');

      if (!response.ok) {
        throw new Error('Failed to fetch domain data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch domains:', err);
      setError('Failed to load domain data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading domain analytics...</p>
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Domain Data</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchDomains}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const aggregate = data?.aggregate || { totalQueries: 0, avgProcessingTime: 0, activeDomains: 0, uniqueUsers: 0 };
  const domains = data?.domains || [];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Domain Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Usage statistics and trends by domain
        </p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Queries</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{aggregate.totalQueries}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Avg Processing Time</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {aggregate.avgProcessingTime}s
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Active Domains</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{aggregate.activeDomains}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Unique Users</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {aggregate.uniqueUsers}
          </dd>
        </div>
      </div>

      {/* Domain Overview Cards */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        {domains.map((domain) => {
          const config = domainConfig[domain.domain as keyof typeof domainConfig] || domainConfig.general;
          const maxTrend = Math.max(...domain.dailyTrend);
          const percentage = aggregate.totalQueries > 0 ? ((domain.totalQueries / aggregate.totalQueries) * 100).toFixed(1) : '0';

          return (
            <div key={domain.domain} className={`bg-white shadow rounded-lg overflow-hidden border-l-4 ${config.borderColor}`}>
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{config.icon}</span>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 capitalize">{domain.domain}</h3>
                      <p className="text-sm text-gray-500">{percentage}% of total traffic</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">{domain.totalQueries}</div>
                    <div className="text-sm text-gray-500">queries</div>
                  </div>
                </div>

                {/* 7-Day Trend Chart */}
                <div className="mb-4">
                  <div className="flex items-end justify-between h-24 gap-1">
                    {domain.dailyTrend.map((count, index) => {
                      const height = maxTrend > 0 ? (count / maxTrend) * 80 : 0;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center group">
                          <div className="w-full relative">
                            <div
                              className={`w-full ${config.color} rounded-t opacity-80 hover:opacity-100 transition-opacity`}
                              style={{ height: `${height}%` }}
                            >
                              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                                {count}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">{days[index]}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Time</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {(domain.avgProcessingTimeMs / 1000).toFixed(1)}s
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Length</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {domain.avgResponseLength}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">Citations/Query</div>
                    <div className="text-sm font-semibold text-gray-900">
                      {domain.citationsPerQuery.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">7-Day Change</div>
                    <div className={`text-sm font-semibold ${domain.trendChange > 0 ? 'text-green-600' : domain.trendChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {domain.trendChange > 0 ? '+' : ''}{domain.trendChange}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Domain Comparison Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Domain Comparison
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Queries
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % of Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Processing Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Length
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citations/Query
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  7-Day Trend
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {domains.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No domain data available. {aggregate.totalQueries === 0 && 'Database has not been populated yet.'}
                  </td>
                </tr>
              ) : (
                domains
                  .sort((a, b) => b.totalQueries - a.totalQueries)
                  .map((domain) => {
                    const config = domainConfig[domain.domain as keyof typeof domainConfig] || domainConfig.general;
                    const percentage = aggregate.totalQueries > 0 ? ((domain.totalQueries / aggregate.totalQueries) * 100).toFixed(1) : '0';

                    return (
                      <tr key={domain.domain} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{config.icon}</span>
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${config.bgColor} ${config.textColor}`}>
                              {domain.domain}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {domain.totalQueries}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {percentage}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(domain.avgProcessingTimeMs / 1000).toFixed(1)}s
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {domain.avgResponseLength}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {domain.citationsPerQuery.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-semibold ${
                            domain.trendChange > 0 ? 'text-green-600' : domain.trendChange < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {domain.trendChange > 0 ? '+' : ''}{domain.trendChange}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Domain Insights */}
      <div className="mt-6 bg-indigo-50 border-l-4 border-indigo-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-indigo-800">Domain Insights</h3>
            <div className="mt-2 text-sm text-indigo-700">
              {domains.length === 0 ? (
                <p>No domain data available yet. Start processing queries to see domain analytics.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {domains.map((domain) => {
                    const percentage = aggregate.totalQueries > 0 ? ((domain.totalQueries / aggregate.totalQueries) * 100) : 0;

                    return (
                      <li key={domain.domain}>
                        <strong className="capitalize">{domain.domain}</strong>: {percentage.toFixed(1)}% of total traffic
                        {domain.citationsPerQuery > 1 && ` with high citation rate (${domain.citationsPerQuery.toFixed(1)}/query)`}
                        {domain.trendChange > 10 && ` • Growing trend (+${domain.trendChange}%)`}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
