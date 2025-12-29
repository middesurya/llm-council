import React from 'react';

export const metadata = {
  title: 'Query Analytics - Admin Dashboard',
  description: 'Detailed query metrics and analysis',
};

// Placeholder data - will be replaced with real database queries
const mockQueries = [
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    queryText: 'What are the symptoms of diabetes?',
    domain: 'healthcare',
    originalLength: 37,
    enhancedLength: 245,
    searchMethod: 'semantic',
    processingTimeMs: 3200,
    responseLength: 1847,
    hasCitations: true,
    citationCount: 3,
    sourceCount: 2,
    timestamp: '2025-12-29T10:30:00Z',
  },
  {
    id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
    queryText: 'Explain revenue recognition under ASC 606',
    domain: 'finance',
    originalLength: 45,
    enhancedLength: 312,
    searchMethod: 'keyword',
    processingTimeMs: 2800,
    responseLength: 2156,
    hasCitations: true,
    citationCount: 2,
    sourceCount: 1,
    timestamp: '2025-12-29T10:25:00Z',
  },
  {
    id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
    queryText: 'What is machine learning?',
    domain: 'general',
    originalLength: 24,
    enhancedLength: 24,
    searchMethod: null,
    processingTimeMs: 2100,
    responseLength: 1523,
    hasCitations: false,
    citationCount: 0,
    sourceCount: 0,
    timestamp: '2025-12-29T10:20:00Z',
  },
  {
    id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    queryText: 'Treatment options for migraines',
    domain: 'healthcare',
    originalLength: 32,
    enhancedLength: 198,
    searchMethod: 'hybrid',
    processingTimeMs: 3500,
    responseLength: 2103,
    hasCitations: true,
    citationCount: 4,
    sourceCount: 3,
    timestamp: '2025-12-29T10:15:00Z',
  },
  {
    id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
    queryText: 'Lease accounting ASC 842 implementation',
    domain: 'finance',
    originalLength: 41,
    enhancedLength: 287,
    searchMethod: 'semantic',
    processingTimeMs: 3000,
    responseLength: 1934,
    hasCitations: true,
    citationCount: 2,
    sourceCount: 2,
    timestamp: '2025-12-29T10:10:00Z',
  },
];

export default function QueryAnalyticsPage() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Query Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Detailed metrics for all processed queries
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Total Queries</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">{mockQueries.length}</dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">With Citations</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {mockQueries.filter(q => q.hasCitations).length}
          </dd>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
          <dt className="text-sm font-medium text-gray-500 truncate">Avg Processing Time</dt>
          <dd className="mt-1 text-3xl font-semibold text-gray-900">
            {(mockQueries.reduce((sum, q) => sum + q.processingTimeMs, 0) / mockQueries.length / 1000).toFixed(1)}s
          </dd>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="domain-filter" className="block text-sm font-medium text-gray-700">
              Domain
            </label>
            <select
              id="domain-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Domains</option>
              <option value="general">General</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
            </select>
          </div>
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700">
              Search Method
            </label>
            <select
              id="search-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Methods</option>
              <option value="keyword">Keyword</option>
              <option value="semantic">Semantic</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700">
              From
            </label>
            <input
              type="date"
              id="date-from"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="date-to" className="block text-sm font-medium text-gray-700">
              To
            </label>
            <input
              type="date"
              id="date-to"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Queries Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Query
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domain
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Search
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Processing Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Response Length
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Citations
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockQueries.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {query.queryText}
                    </div>
                    <div className="text-xs text-gray-500">
                      {query.originalLength} → {query.enhancedLength} chars
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      query.domain === 'healthcare' ? 'bg-green-100 text-green-800' :
                      query.domain === 'finance' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {query.domain}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {query.searchMethod || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(query.processingTimeMs / 1000).toFixed(1)}s
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {query.responseLength}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {query.hasCitations ? (
                      <span className="text-sm text-gray-900">
                        {query.citationCount} citations
                        <span className="text-xs text-gray-500 ml-1">({query.sourceCount} sources)</span>
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(query.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </a>
              <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </a>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{mockQueries.length}</span> of{' '}
                  <span className="font-medium">{mockQueries.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </a>
                  <a href="#" aria-current="page" className="z-10 bg-indigo-50 border-indigo-500 text-indigo-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </a>
                  <a href="#" className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </a>
                  <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
