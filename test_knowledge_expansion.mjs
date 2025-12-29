/**
 * Test script for expanded knowledge base
 */
import { searchICD10Codes, getMedicalContext } from './src/lib/knowledge/healthcare-kb.ts';
import { searchAccountingStandards, getFinancialContext } from './src/lib/knowledge/finance-kb.ts';

console.log('='.repeat(60));
console.log('HEALTHCARE KNOWLEDGE BASE TEST');
console.log('='.repeat(60));

// Test 1: Search for hypertension
console.log('\n📋 Test 1: Searching for "hypertension"');
const hypertensionResults = searchICD10Codes('hypertension');
console.log(`Found ${hypertensionResults.length} codes:`);
hypertensionResults.forEach(code => {
  console.log(`  - ${code.code}: ${code.description} (${code.category})`);
});

// Test 2: Search for stroke
console.log('\n📋 Test 2: Searching for "stroke"');
const strokeResults = searchICD10Codes('stroke');
console.log(`Found ${strokeResults.length} codes:`);
strokeResults.forEach(code => {
  console.log(`  - ${code.code}: ${code.description} (${code.category})`);
});

// Test 3: Search for chest pain
console.log('\n📋 Test 3: Searching for "chest pain"');
const chestPainContext = getMedicalContext('patient has chest pain and shortness of breath');
console.log('Medical Context Retrieved:');
console.log(chestPainContext.substring(0, 500) + '...');

// Test 4: Count total codes
console.log('\n📊 Test 4: Total ICD-10 codes in database');
// Note: We need to import the array directly
import { icd10Codes } from './src/lib/knowledge/healthcare-kb.ts';
console.log(`Total ICD-10 codes: ${icd10Codes.length}`);

console.log('\n' + '='.repeat(60));
console.log('FINANCE KNOWLEDGE BASE TEST');
console.log('='.repeat(60));

// Test 5: Search for revenue recognition
console.log('\n📋 Test 5: Searching for "revenue recognition"');
const revenueResults = searchAccountingStandards('revenue recognition');
console.log(`Found ${revenueResults.length} standards:`);
revenueResults.forEach(std => {
  console.log(`  - ${std.code} (${std.framework}): ${std.title}`);
});

// Test 6: Search for leases
console.log('\n📋 Test 6: Searching for "lease"');
const leaseResults = searchAccountingStandards('lease accounting');
console.log(`Found ${leaseResults.length} standards:`);
leaseResults.forEach(std => {
  console.log(`  - ${std.code} (${std.framework}): ${std.title}`);
});

// Test 7: Finance context
console.log('\n📋 Test 7: Getting financial context for "ASC 606"');
const financeContext = getFinancialContext('ASC 606 revenue from contracts');
console.log('Financial Context Retrieved:');
console.log(financeContext.substring(0, 500) + '...');

// Test 8: Count total standards
console.log('\n📊 Test 8: Total accounting standards in database');
import { accountingStandards } from './src/lib/knowledge/finance-kb.ts';
console.log(`Total accounting standards: ${accountingStandards.length}`);

console.log('\n' + '='.repeat(60));
console.log('✅ Knowledge base expansion test complete!');
console.log('='.repeat(60));
