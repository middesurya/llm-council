# Performance Benchmark Results

**Date:** 2025-12-29
**Benchmark Script:** `scripts/benchmark-citations.js`
**Test Environment:** Local development with OpenAI embeddings

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Overall Citation Accuracy | **69.6%** |
| Tests Passed (≥50% score) | **75%** (6/8) |
| Finance Domain Accuracy | **100%** (6/6 codes) |
| Healthcare Domain Accuracy | **55.6%** (10/18 codes) |

---

## Citation Accuracy Results

### Finance Domain: 100% Accuracy

| Query | Expected Codes | Found | Score | Sources |
|-------|----------------|-------|-------|---------|
| Revenue recognition from contracts | ASC 606, IFRS 15 | 2/2 | 100% | ✅ |
| Lease accounting | ASC 842, IFRS 16 | 2/2 | 100% | ✅ |
| Fair value measurement | ASC 820, IFRS 13 | 2/2 | 100% | ✅ |

**Finance Domain Analysis:**
- All expected accounting standards are correctly retrieved
- Source URLs (FASB, IFRS Foundation) consistently present
- Knowledge context length: 800-1600 chars
- Keyword matching works perfectly for standard codes

### Healthcare Domain: 55.6% Accuracy

| Query | Expected Codes | Found | Score | Sources |
|-------|----------------|-------|-------|---------|
| High blood sugar causes | E11, R73, E88 | 1/3 | 33% | ✅ |
| Chest pain and shortness of breath | I21, I20, R07, R06 | 3/4 | 75% | ✅ |
| Hypertension treatment | I10, I11, I12 | 3/3 | 100% | ✅ |
| Headaches and nausea | G43, R51, R11 | 2/3 | 67% | ❌ |
| Diabetes symptoms | E11, R35, R63, H53 | 1/4 | 25% | ✅ |

**Healthcare Domain Analysis:**
- Hypertension queries perform best (100%)
- Symptom-specific codes (R35, R63, H53) often missed
- Migraine code (G43) not retrieved for "headaches"
- Main diagnosis codes (E11, I10, I21) reliably found
- Source URLs present in 4/5 tests

---

## Key Findings

### 1. Finance Domain Superior Performance
- **100% citation accuracy** for accounting standards
- Consistent source URL inclusion
- Keywords like "ASC 606", "IFRS 15" have high match rate

### 2. Healthcare Domain Challenges
- **55.6% accuracy** - significant room for improvement
- Symptom codes (R-series) less frequently matched
- Multiple related codes not all retrieved
- Semantic search may help here

### 3. Source URL Reliability
- **87.5% of tests** include source URLs (7/8)
- Finance: 100% source URL inclusion
- Healthcare: 80% source URL inclusion
- WHO ICD-10, ESC, ACC/AHA, ADA sources working

---

## Recommendations

### Immediate Actions

1. **Expand Healthcare Symptom Keywords**
   - Add more keywords for R-series codes (symptoms)
   - Include "thirst", "urination", "hunger" → R63 codes
   - Include "vision changes" → H53 code
   - Include "migraine" → G43 code

2. **Add Related Code Cross-References**
   - When diabetes (E11) is found, suggest symptom codes
   - When chest pain (R07) is found, suggest cardiac codes (I21)
   - Implement hierarchical code relationships

3. **Improve Semantic Search**
   - Current implementation: semantic search available
   - Increase similarity threshold or add more embeddings
   - Train domain-specific embeddings for medical terms

### Long-term Improvements

1. **Knowledge Base Expansion**
   - Add more ICD-10 codes (currently ~50, expand to 200+)
   - Include symptom clusters and differential diagnoses
   - Add medical guidelines with code mappings

2. **LLM Prompt Optimization**
   - Current prompts instruct LLMs to cite codes
   - Add examples showing multiple code citations
   - Reinforce "list all relevant codes" instruction

3. **Performance Monitoring**
   - Track citation accuracy over time
   - A/B test semantic vs keyword search
   - Monitor user feedback on code relevance

---

## Test Methodology

### Benchmark Design
- 8 test queries across healthcare (5) and finance (3) domains
- 23 expected codes/standards total
- Tests measure presence in knowledge context (not final LLM response)
- Source URL presence checked for all tests

### Success Criteria
- **Pass**: ≥50% of expected codes found in context
- **Excellent**: ≥75% of expected codes found
- **Perfect**: 100% of expected codes found

### Current Performance
- **Overall**: 69.6% (Good)
- **Finance**: 100% (Perfect)
- **Healthcare**: 55.6% (Fair)

---

## Technical Details

### Knowledge Enhancement Pipeline
```
Query → Keyword/Semantic Search → Knowledge Context → LLM Prompt → Response
```

### Current Implementation
- **Search Method**: Keyword matching with semantic fallback
- **Embeddings**: OpenAI text-embedding-3-small (1536 dimensions)
- **Vector Store**: 108 embeddings (63 healthcare, 45 finance)
- **Similarity Threshold**: 0.7 cosine similarity

### Performance Metrics
- Query Enhancement: 29→692 chars (23x increase)
- Knowledge Retrieval: <100ms (keyword), 200-500ms (semantic)
- Total Response Time: 30-35 seconds (LLM processing dominates)

---

## Appendix: Test Data

### Healthcare Test Queries
1. "What causes high blood sugar?" → E11, R73, E88
2. "I have chest pain and shortness of breath" → I21, I20, R07, R06
3. "What is hypertension and how is it treated?" → I10, I11, I12
4. "I have frequent headaches and nausea" → G43, R51, R11
5. "What are the symptoms of diabetes?" → E11, R35, R63, H53

### Finance Test Queries
1. "How do I recognize revenue from customer contracts?" → ASC 606, IFRS 15
2. "How do I account for leases?" → ASC 842, IFRS 16
3. "What is fair value measurement?" → ASC 820, IFRS 13

---

**Report Generated:** 2025-12-29
**Next Benchmark:** After implementing improvements
**Responsible:** LLM Council Development Team
