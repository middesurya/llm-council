'use client';

import React, { useEffect, useState } from 'react';

interface ExpertData {
  provider: string;
  model: string;
  stage: string;
  role: string;
  queryCount: number;
  avgProcessingTimeMs: number;
  avgAnswerLength: number;
  avgRanking: number | null;
  timestamp: string;
}

interface ExpertsResponse {
  experts: ExpertData[];
  aggregate: {
    totalQueries: number;
    avgProcessingTime: number;
    activeExperts: number;
  };
}

const providerColors: Record<string, string> = {
  openai: 'bg-green-100 text-green-800',
  anthropic: 'bg-orange-100 text-orange-800',
  google: 'bg-blue-100 text-blue-800',
};

export default function ExpertPerformancePage() {
  const [data, setData] = useState<ExpertsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  const fetchExperts = async () => {
    try {
      const response = await fetch('/api/admin/data/experts?stage=stage1');

      if (!response.ok) {
        throw new Error('Failed to fetch expert data');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch experts:', err);
      setError('Failed to load expert data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading expert performance...</p>
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
            <h3 className="text-sm font-medium text-red-800">Error Loading Expert Data</h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            <button
              onClick={fetchExperts}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const aggregate = data?.aggregate || { totalQueries: 0, avgProcessingTime: 0, activeExperts: 0 };
  const experts = data?.experts || [];
  const stage1Experts = experts.filter(e => e.stage === 'stage1');

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Expert Performance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Individual LLM performance metrics and analysis
        </p>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
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
          <dt className="text-sm font-medium text-gray-500 truncate">Active Experts</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{aggregate.activeExperts}</dd>
        </div>
      </div>

      {/* Performance by Provider */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 mb-6">
        {stage1Experts.map((expert) => {
          const performanceScore = expert.avgRanking
            ? ((1 / expert.avgRanking) * 100).toFixed(0)
            : '50';

          return (
            <div key={`${expert.provider}-${expert.stage}`} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 capitalize">{expert.provider}</h3>
                  <p className="text-sm text-gray-500">{expert.model}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${providerColors[expert.provider]}`}>
                  Stage 1
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Queries Processed</span>
                  <span className="text-sm font-semibold text-gray-900">{expert.queryCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg Processing Time</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {(expert.avgProcessingTimeMs / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg Answer Length</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {expert.avgAnswerLength} chars
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Avg Ranking</span>
                  <span className={`text-sm font-semibold ${
                    expert.avgRanking && expert.avgRanking <= 1.5 ? 'text-green-600' :
                    expert.avgRanking && expert.avgRanking <= 2 ? 'text-yellow-600' :
                    'text-gray-600'
                  }`}>
                    {expert.avgRanking?.toFixed(1) || 'N/A'} {expert.avgRanking && expert.avgRanking <= 1.5 ? '⭐' : ''}
                  </span>
                </div>
              </div>

              {/* Performance Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Performance Score</span>
                  <span>{performanceScore}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      expert.avgRanking && expert.avgRanking <= 1.5 ? 'bg-green-500' :
                      expert.avgRanking && expert.avgRanking <= 2 ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}
                    style={{ width: `${performanceScore}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Performance Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Detailed Performance Metrics
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Model
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queries
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Length
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Ranking
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {experts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-500">
                    No expert data available. {aggregate.totalQueries === 0 && 'Database has not been populated yet.'}
                  </td>
                </tr>
              ) : (
                experts.map((expert, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${providerColors[expert.provider] || 'bg-gray-100 text-gray-800'}`}>
                        {expert.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expert.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {expert.stage.replace('stage', 'Stage ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 Capitalize">
                      {expert.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expert.queryCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(expert.avgProcessingTimeMs / 1000).toFixed(1)}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {expert.avgAnswerLength}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {expert.avgRanking ? (
                        <span className={`text-sm font-semibold ${
                          expert.avgRanking <= 1.5 ? 'text-green-600' :
                          expert.avgRanking <= 2 ? 'text-yellow-600' :
                          'text-gray-600'
                        }`}>
                          {expert.avgRanking.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(expert.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Performance Insights</h3>
            <div className="mt-2 text-sm text-blue-700">
              {stage1Experts.length === 0 ? (
                <p>No expert data available yet. Start processing queries to see expert performance metrics.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {stage1Experts.map((expert) => {
                    const best = stage1Experts.reduce((prev, current) =>
                      (prev.avgRanking || 999) < (current.avgRanking || 999) ? prev : current
                    );

                    return (
                      <li key={expert.provider}>
                        {expert.provider === best.provider
                          ? `⭐ ${expert.provider} achieves the best ranking (${expert.avgRanking?.toFixed(1)})`
                          : `${expert.provider}: ${expert.avgRanking?.toFixed(1)} avg ranking`
                        }
                        {expert.avgRanking && expert.avgRanking <= 1.5 && ' (Excellent)'}
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
