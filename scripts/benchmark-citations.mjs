/**
 * Performance Benchmark: Citation Accuracy Testing
 *
 * Tests how well LLMs cite codes/standards in their responses
 */

import { getKnowledgeContext } from '../src/lib/knowledge/index.ts';

// Test queries for healthcare domain
const healthcareQueries = [
  {
    query: "What causes high blood sugar?",
    expectedCodes: ["E11", "R73", "E88"],
    domain: "healthcare"
  },
  {
    query: "I have chest pain and shortness of breath",
    expectedCodes: ["I21", "I20", "R07", "R06"],
    domain: "healthcare"
  },
  {
    query: "What is hypertension and how is it treated?",
    expectedCodes: ["I10", "I11", "I12"],
    domain: "healthcare"
  },
  {
    query: "I have frequent headaches and nausea",
    expectedCodes: ["G43", "R51", "R11"],
    domain: "healthcare"
  },
  {
    query: "What are the symptoms of diabetes?",
    expectedCodes: ["E11", "R35", "R63", "H53"],
    domain: "healthcare"
  }
];

// Test queries for finance domain
const financeQueries = [
  {
    query: "How do I recognize revenue from customer contracts?",
    expectedCodes: ["ASC 606", "IFRS 15"],
    domain: "finance"
  },
  {
    query: "How do I account for leases?",
    expectedCodes: ["ASC 842", "IFRS 16"],
    domain: "finance"
  },
  {
    query: "What is fair value measurement?",
    expectedCodes: ["ASC 820", "IFRS 13"],
    domain: "finance"
  }
];

/**
 * Check if a response contains expected citations
 */
function checkCitations(response, expectedCodes) {
  const found = [];
  const missing = [];

  expectedCodes.forEach(code => {
    if (response.includes(code)) {
      found.push(code);
    } else {
      missing.push(code);
    }
  });

  return { found, missing };
}

/**
 * Run citation accuracy benchmark
 */
async function benchmarkCitationAccuracy() {
  console.log('='.repeat(70));
  console.log('PERFORMANCE BENCHMARK: Citation Accuracy');
  console.log('='.repeat(70));

  const allQueries = [...healthcareQueries, ...financeQueries];
  let totalTests = 0;
  let totalPassed = 0;
  let totalCodes = 0;
  let totalFound = 0;

  for (const test of allQueries) {
    totalTests++;

    console.log(`\n[${totalTests}/${allQueries.length}] Testing: ${test.query.substring(0, 50)}...`);
    console.log(`Domain: ${test.domain}`);
    console.log(`Expected Codes: ${test.expectedCodes.join(', ')}`);

    try {
      // Get enhanced query
      const enhancement = await getKnowledgeContext(test.query, test.domain);

      console.log(`Knowledge Enhanced: ${enhancement.context.length > 0 ? 'Yes' : 'No'}`);
      console.log(`Context Length: ${enhancement.context.length} chars`);

      // Check if expected codes are in context
      const contextCheck = checkCitations(enhancement.context, test.expectedCodes);
      console.log(`✓ Codes in Context: ${contextCheck.found.length}/${test.expectedCodes.length}`);
      if (contextCheck.missing.length > 0) {
        console.log(`  Missing: ${contextCheck.missing.join(', ')}`);
      }

      // Check if sources are present
      const hasSources = enhancement.context.includes('Source:');
      console.log(`✓ Sources Present: ${hasSources ? 'Yes' : 'No'}`);

      // Calculate score
      const score = contextCheck.found.length / test.expectedCodes.length;
      console.log(`Citation Score: ${(score * 100).toFixed(0)}%`);

      totalCodes += test.expectedCodes.length;
      totalFound += contextCheck.found.length;

      if (score >= 0.5) {
        totalPassed++;
      }

    } catch (error) {
      console.log(`✗ Error: ${error.message}`);
    }
  }

  // Summary statistics
  console.log('\n' + '='.repeat(70));
  console.log('BENCHMARK SUMMARY');
  console.log('='.repeat(70));
  console.log(`Total Tests: ${totalTests}`);
  console.log(`Tests Passed (≥50%): ${totalPassed} (${(totalPassed/totalTests*100).toFixed(0)}%)`);
  console.log(`Total Expected Codes: ${totalCodes}`);
  console.log(`Total Codes Found: ${totalFound} (${(totalFound/totalCodes*100).toFixed(0)}%)`);
  console.log(`Overall Citation Accuracy: ${(totalFound/totalCodes*100).toFixed(1)}%`);

  // Domain breakdown
  console.log('\n' + '-'.repeat(70));
  console.log('DOMAIN BREAKDOWN:');
  console.log(`Healthcare: ${healthcareQueries.length} queries`);
  console.log(`Finance: ${financeQueries.length} queries`);

  return {
    totalTests,
    totalPassed,
    totalCodes,
    totalFound,
    accuracy: totalFound / totalCodes
  };
}

/**
 * Compare semantic vs keyword search performance
 */
async function benchmarkSearchPerformance() {
  console.log('\n\n' + '='.repeat(70));
  console.log('PERFORMANCE BENCHMARK: Semantic vs Keyword Search');
  console.log('='.repeat(70));

  const testQueries = [
    { query: "elevated blood sugar", domain: "healthcare" },
    { query: "heart attack symptoms", domain: "healthcare" },
    { query: "revenue recognition rules", domain: "finance" },
    { query: "lease accounting", domain: "finance" }
  ];

  const semanticTimes = [];
  const keywordTimes = [];
  const semanticResults = [];
  const keywordResults = [];

  for (const test of testQueries) {
    console.log(`\nTesting: "${test.query}" (${test.domain})`);

    // Test semantic search
    const semanticStart = performance.now();
    try {
      const semanticEnhancement = await getKnowledgeContext(test.query, test.domain, { preferSemantic: true });
      const semanticTime = performance.now() - semanticStart;
      semanticTimes.push(semanticTime);
      semanticResults.push({
        query: test.query,
        time: semanticTime,
        hasKnowledge: semanticEnhancement.context.length > 0,
        contextLength: semanticEnhancement.context.length
      });
      console.log(`  Semantic: ${semanticTime.toFixed(0)}ms - ${semanticEnhancement.context.length} chars`);
    } catch (error) {
      console.log(`  Semantic: Error - ${error.message}`);
      semanticTimes.push(0);
    }

    // Test keyword search (force by disabling semantic)
    const keywordStart = performance.now();
    try {
      // For keyword, we'll measure without semantic preference
      const keywordEnhancement = await getKnowledgeContext(test.query, test.domain, { preferSemantic: false });
      const keywordTime = performance.now() - keywordStart;
      keywordTimes.push(keywordTime);
      keywordResults.push({
        query: test.query,
        time: keywordTime,
        hasKnowledge: keywordEnhancement.context.length > 0,
        contextLength: keywordEnhancement.context.length
      });
      console.log(`  Keyword: ${keywordTime.toFixed(0)}ms - ${keywordEnhancement.context.length} chars`);
    } catch (error) {
      console.log(`  Keyword: Error - ${error.message}`);
      keywordTimes.push(0);
    }
  }

  // Calculate averages
  const avgSemanticTime = semanticTimes.filter(t => t > 0).reduce((a, b) => a + b, 0) / semanticTimes.filter(t => t > 0).length || 0;
  const avgKeywordTime = keywordTimes.filter(t => t > 0).reduce((a, b) => a + b, 0) / keywordTimes.filter(t => t > 0).length || 0;

  console.log('\n' + '-'.repeat(70));
  console.log('PERFORMANCE COMPARISON:');
  console.log(`Semantic Search: ${avgSemanticTime.toFixed(0)}ms avg`);
  console.log(`Keyword Search: ${avgKeywordTime.toFixed(0)}ms avg`);
  console.log(`Difference: ${avgSemanticTime - avgKeywordTime > 0 ? '+' : ''}${(avgSemanticTime - avgKeywordTime).toFixed(0)}ms (${((avgSemanticTime/avgKeywordTime - 1) * 100).toFixed(0)}%)`);

  return {
    avgSemanticTime,
    avgKeywordTime,
    semanticResults,
    keywordResults
  };
}

/**
 * Run all benchmarks
 */
async function runAllBenchmarks() {
  console.log('\n' + '█'.repeat(70));
  console.log('LLM COUNCIL - PERFORMANCE BENCHMARK SUITE');
  console.log('Date:', new Date().toISOString());
  console.log('█'.repeat(70));

  // Run citation accuracy benchmark
  const citationResults = await benchmarkCitationAccuracy();

  // Run search performance benchmark
  const searchResults = await benchmarkSearchPerformance();

  // Final summary
  console.log('\n\n' + '='.repeat(70));
  console.log('FINAL BENCHMARK SUMMARY');
  console.log('='.repeat(70));
  console.log(`Citation Accuracy: ${(citationResults.accuracy * 100).toFixed(1)}%`);
  console.log(`Semantic vs Keyword: ${searchResults.avgSemanticTime.toFixed(0)}ms vs ${searchResults.avgKeywordTime.toFixed(0)}ms`);
  console.log(`Performance Overhead: ${((searchResults.avgSemanticTime/searchResults.avgKeywordTime - 1) * 100).toFixed(0)}%`);

  console.log('\n' + '='.repeat(70));
  console.log('Benchmark Complete!');
  console.log('='.repeat(70));

  return {
    citationResults,
    searchResults
  };
}

// Run benchmarks
runAllBenchmarks()
  .then(results => {
    console.log('\n✅ All benchmarks completed successfully');
  })
  .catch(error => {
    console.error('\n❌ Benchmark failed:', error);
    process.exit(1);
  });
