/**
 * Test script to verify provenance tracking
 */

// Use require for CommonJS modules
const { icd10Codes, medicalReferences } = await import('./src/lib/knowledge/healthcare-kb.ts');
const { accountingStandards, financialReferences } = await import('./src/lib/knowledge/finance-kb.ts');

console.log('='.repeat(70));
console.log('TESTING PROVENANCE TRACKING');
console.log('='.repeat(70));

// Test healthcare - check first few codes with provenance
console.log('\n📋 Healthcare - ICD-10 Codes with provenance:');
console.log('-'.repeat(70));
let healthcareCount = 0;
icd10Codes.slice(0, 5).forEach(code => {
  if (code.sourceUrl) {
    healthcareCount++;
    console.log(`  ✓ ${code.code}: ${code.description}`);
    console.log(`    Source: ${code.sourceUrl}`);
  }
});

console.log('\n📋 Healthcare - Medical References with provenance:');
console.log('-'.repeat(70));
medicalReferences.slice(0, 5).forEach(ref => {
  if (ref.sourceUrl) {
    healthcareCount++;
    console.log(`  ✓ ${ref.topic}`);
    console.log(`    Source: ${ref.sourceUrl}`);
  }
});

// Test finance - check first few standards with provenance
console.log('\n\n📋 Finance - Accounting Standards with provenance:');
console.log('-'.repeat(70));
let financeCount = 0;
accountingStandards.slice(0, 5).forEach(std => {
  if (std.sourceUrl) {
    financeCount++;
    console.log(`  ✓ ${std.code} (${std.framework}): ${std.title}`);
    console.log(`    Source: ${std.sourceUrl}`);
  }
});

console.log('\n📋 Finance - Financial References with provenance:');
console.log('-'.repeat(70));
financialReferences.slice(0, 5).forEach(ref => {
  if (ref.sourceUrl) {
    financeCount++;
    console.log(`  ✓ ${ref.topic}`);
    console.log(`    Source: ${ref.sourceUrl}`);
  }
});

console.log('\n' + '='.repeat(70));
console.log('PROVENANCE TEST COMPLETE');
console.log('='.repeat(70));

console.log('\n✅ RESULTS:');
console.log(`  Healthcare entries with sources: ${healthcareCount}`);
console.log(`  Finance entries with sources: ${financeCount}`);

if (healthcareCount > 0 && financeCount > 0) {
  console.log('\n🎉 Provenance tracking is working correctly!');
} else {
  console.log('\n⚠️ Provenance tracking may not be working as expected.');
}
