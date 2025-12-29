/**
 * Populate Vector Store with Knowledge Base
 * Run this script to generate embeddings for all knowledge base entries
 */

import 'dotenv/config';
import { vectorStore } from '../src/lib/knowledge/vector-store';
import { icd10Codes, medicalReferences } from '../src/lib/knowledge/healthcare-kb';
import { accountingStandards, financialReferences } from '../src/lib/knowledge/finance-kb';

async function populateVectorStore() {
  console.log('='.repeat(60));
  console.log('POPULATING VECTOR STORE');
  console.log('='.repeat(60));

  await vectorStore.initialize();

  // Check if already populated
  const stats = vectorStore.getStats();
  if (stats.total > 0) {
    console.log(`\nVector store already has ${stats.total} embeddings.`);
    console.log('Clearing and repopulating...');
    await vectorStore.clear();
  }

  const items: any[] = [];

  // Healthcare: ICD-10 Codes
  console.log('\n📋 Processing ICD-10 codes...');
  for (const code of icd10Codes) {
    const text = `${code.code}: ${code.description}. Category: ${code.category}. Keywords: ${code.keywords.join(', ')}`;
    items.push({
      id: `icd10-${code.code}`,
      text,
      metadata: {
        domain: 'healthcare',
        type: 'icd10' as const,
        code: code.code,
        category: code.category,
        keywords: code.keywords,
      },
    });
  }

  // Healthcare: Medical References
  console.log('📋 Processing medical references...');
  for (const ref of medicalReferences) {
    items.push({
      id: `med-ref-${ref.topic.replace(/\s+/g, '-').toLowerCase()}`,
      text: `${ref.topic}: ${ref.content}`,
      metadata: {
        domain: 'healthcare',
        type: 'medical_reference' as const,
        topic: ref.topic,
        keywords: ref.keywords,
      },
    });
  }

  // Finance: Accounting Standards
  console.log('📋 Processing accounting standards...');
  for (const std of accountingStandards) {
    const text = `${std.code} (${std.framework}): ${std.title}. ${std.description}`;
    items.push({
      id: `std-${std.code.replace(/\s+/g, '-')}`,
      text,
      metadata: {
        domain: 'finance',
        type: 'accounting_standard' as const,
        code: std.code,
        framework: std.framework,
        keywords: std.keywords,
      },
    });
  }

  // Finance: Financial References
  console.log('📋 Processing financial references...');
  for (const ref of financialReferences) {
    items.push({
      id: `fin-ref-${ref.topic.replace(/\s+/g, '-').toLowerCase()}`,
      text: `${ref.topic}: ${ref.content}`,
      metadata: {
        domain: 'finance',
        type: 'financial_reference' as const,
        topic: ref.topic,
        keywords: ref.keywords,
      },
    });
  }

  console.log(`\n📊 Total items to process: ${items.length}`);
  console.log('⏳ Generating embeddings (this may take a few minutes)...');

  await vectorStore.addBatchEmbeddings(items);

  const finalStats = vectorStore.getStats();
  console.log('\n' + '='.repeat(60));
  console.log('✅ VECTOR STORE POPULATED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log('\nFinal Statistics:');
  console.log(`  Total embeddings: ${finalStats.total}`);
  console.log(`  Healthcare: ${finalStats.byDomain.healthcare}`);
  console.log(`  Finance: ${finalStats.byDomain.finance}`);
  console.log(`  ICD-10 codes: ${finalStats.byType.icd10}`);
  console.log(`  Medical references: ${finalStats.byType.medical_reference}`);
  console.log(`  Accounting standards: ${finalStats.byType.accounting_standard}`);
  console.log(`  Financial references: ${finalStats.byType.financial_reference}`);
  console.log('\nEmbeddings saved to: .data/embeddings.json');
  console.log('='.repeat(60));
}

// Run population
populateVectorStore().catch(console.error);
