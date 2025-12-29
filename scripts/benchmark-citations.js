/**
 * Performance Benchmark: Citation Accuracy Testing
 *
 * Tests how well LLMs cite codes/standards in their responses
 */

import { getMedicalContext } from '../src/lib/knowledge/healthcare-kb.ts';
import { getFinancialContext } from '../src/lib/knowledge/finance-kb.ts';

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
 * Get knowledge context (with semantic search)
 */
async function getKnowledgeContextWithSemantic(query, domain) {
  // Import the knowledge index dynamically for semantic search
  try {
    const knowledgeModule = await import('../src/lib/knowledge/index.ts');
    return await knowledgeModule.getKnowledgeContext(query, domain, { preferSemantic: true });
  } catch (error) {
    // Fallback to keyword matching if semantic search fails
    console.log('  (Falling back to keyword matching)');
    let context = "";
    if (domain === "healthcare") {
      context = getMedicalContext(query);
    } else if (domain === "finance") {
      context = getFinancialContext(query);
    }
    return {
      context,
      sources: [],
      searchMethod: 'keyword'
    };
  }
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
      // Get enhanced query with semantic search
      const enhancement = await getKnowledgeContextWithSemantic(test.query, test.domain);

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
    accuracy: totalCodes > 0 ? totalFound / totalCodes : 0
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
  const citationResults = benchmarkCitationAccuracy();

  // Final summary
  console.log('\n\n' + '='.repeat(70));
  console.log('FINAL BENCHMARK SUMMARY');
  console.log('='.repeat(70));
  console.log(`Citation Accuracy: ${(citationResults.accuracy * 100).toFixed(1)}%`);

  console.log('\n' + '='.repeat(70));
  console.log('Benchmark Complete!');
  console.log('='.repeat(70));

  return {
    citationResults
  };
}

// Run benchmarks
(async () => {
  try {
    const results = await runAllBenchmarks();
    console.log('\n✅ All benchmarks completed successfully');
  } catch (error) {
    console.error('\n❌ Benchmark failed:', error);
    process.exit(1);
  }
})();
