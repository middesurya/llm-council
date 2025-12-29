# Enhanced Domain Prompts - Implementation Plan

**Status:** Ready to Implement
**Priority:** High
**Estimated Time:** 30-45 minutes

## Objective

Update domain-specific system prompts to enforce code citation requirements in LLM responses.

## Current State

**File:** `src/config/domains.ts`

**Current Healthcare Prompt:**
```typescript
healthcare: {
  systemPrompt: `You are a council of medical experts...`
  // ❌ Does NOT explicitly require ICD-10 code citations
}
```

**Current Finance Prompt:**
```typescript
finance: {
  systemPrompt: `You are a council of financial experts...`
  // ❌ Does NOT explicitly require GAAP/IFRS standard citations
}
```

## Target State

**After Implementation:**

**Healthcare Prompt:**
```typescript
healthcare: {
  systemPrompt: `You are a council of medical experts...

## CRITICAL REQUIREMENTS:
1. ALWAYS include ICD-10 codes when mentioning conditions
2. Use format: Condition Name [ICD-10: XXX.X]
3. Add red flags (⚠️) for urgent conditions
4. Include medical disclaimer in every response

## Response Format:
### Diagnostic Possibilities:
• Condition [ICD-10: XXX.X] - Description

### Red Flags ⚠️:
• Urgent condition [ICD-10: XXX.X] - Immediate action required

### Disclaimer:
⚠️ WARNING: This is for educational purposes only.
Consult a licensed healthcare professional.`
}
```

**Finance Prompt:**
```typescript
finance: {
  systemPrompt: `You are a council of financial experts...

## CRITICAL REQUIREMENTS:
1. ALWAYS cite GAAP/IFRS standards when discussing treatments
2. Use format: Standard Name (ASC XXX / IFRS XX)
3. Reference specific sections: ASC XXX-YY-ZZ
4. Include compliance warnings (⚠️) where applicable
5. Add professional consultation disclaimer

## Response Format:
### Applicable Standards:
• Standard Name (ASC XXX / IFRS XX) - Description

### Key Requirements:
1. Requirement (ASC XXX-YY-ZZ)
2. Requirement (ASC XXX-YY-ZZ)

### Compliance Warnings ⚠️:
[Specific regulatory concerns]

### Disclaimer:
⚠️ DISCLAIMER: Consult a qualified accountant.`
}
```

## Implementation Steps

### Step 1: Read Current Prompts
```bash
# Check current domain configuration
cat src/config/domains.ts
```

### Step 2: Update Healthcare Prompt

**Location:** `src/config/domains.ts` - `healthcare.systemPrompt`

**Additions Required:**
1. Explicit instruction to cite ICD-10 codes
2. Response format template with examples
3. Red flag warning requirements
4. Mandatory disclaimer text

**Key Text to Add:**
```typescript
## CRITICAL: Code Citation Requirements

You MUST include ICD-10 codes when mentioning:
- Medical conditions (e.g., "Type 2 Diabetes [ICD-10: E11.9]")
- Symptoms (e.g., "Cough [ICD-10: R05]")
- Diagnoses (e.g., "Migraine [ICD-10: G43.9]")

Format: Condition Name [ICD-10: XXX.X]

Examples:
✅ Good: "Possible Type 2 Diabetes [ICD-10: E11.9]"
❌ Bad: "Possible Type 2 Diabetes"

## Required Sections:
1. Diagnostic Possibilities (with codes)
2. Red Flags (⚠️) for urgent conditions
3. Medical Disclaimer (mandatory)

## Red Flag Format:
⚠️ RED FLAG: Condition [ICD-10: XXX.X]
Action: [Immediate action required]
```

### Step 3: Update Finance Prompt

**Location:** `src/config/domains.ts` - `finance.systemPrompt`

**Additions Required:**
1. Explicit instruction to cite GAAP/IFRS standards
2. Response format template with examples
3. Section-level citation requirements
4. Compliance warning guidelines
5. Mandatory disclaimer text

**Key Text to Add:**
```typescript
## CRITICAL: Standard Citation Requirements

You MUST cite accounting standards when discussing:
- Revenue recognition (e.g., ASC 606 / IFRS 15)
- Leases (e.g., ASC 842 / IFRS 16)
- Fair value (e.g., ASC 820 / IFRS 13)

Format: Standard Name (ASC XXX / IFRS XX)

Section References: ASC XXX-YY-ZZ or IFRS XX.YY

Examples:
✅ Good: "Under ASC 606-10-25-1, entities must..."
❌ Bad: "Under revenue recognition rules, entities must..."

## Required Sections:
1. Applicable Standards (with codes)
2. Key Requirements (with section references)
3. Compliance Warnings (⚠️)
4. Professional Disclaimer (mandatory)
```

### Step 4: Test with Sample Queries

**Healthcare Test:**
```bash
curl -X POST http://localhost:3000/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What causes high blood sugar?",
    "domain": "healthcare"
  }'
```

**Expected Result:**
Response should include:
- [ICD-10: E11.9] for Type 2 diabetes
- [ICD-10: E13.9] for other diabetes
- [ICD-10: R73.9] for hyperglycemia
- ⚠️ medical disclaimer

**Finance Test:**
```bash
curl -X POST http://localhost:3000/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{
    "query": "How do I recognize revenue?",
    "domain": "finance"
  }'
```

**Expected Result:**
Response should include:
- ASC 606 / IFRS 15 citation
- ASC 606-10-25 section references
- Five-step model
- ⚠️ compliance disclaimer

### Step 5: Verify Formatting

**Checklist:**
- [ ] Healthcare responses have [ICD-10: XXX.X] format
- [ ] Finance responses have (ASC XXX / IFRS XX) format
- [ ] Red flags use ⚠️ emoji
- [ ] Disclaimers are present in all domain responses
- [ ] Codes/standards are relevant to the query
- [ ] Multiple codes are listed when applicable

### Step 6: Edge Case Testing

**Test 1: Query with No Relevant Codes**
```bash
Query: "What is the meaning of life?"
Domain: healthcare
Expected: General response, no forced codes
```

**Test 2: Query with Multiple Codes**
```bash
Query: "I have chest pain and headache"
Domain: healthcare
Expected: Multiple codes listed (I21.9, I20.9, G43.9, R51)
```

**Test 3: Technical Finance Query**
```bash
Query: "Lease accounting differences"
Domain: finance
Expected: ASC 842 vs IFRS 16 comparison
```

### Step 7: Commit Changes

```bash
git add src/config/domains.ts
git commit -m "feat: add code citation requirements to domain prompts

- Enforce ICD-10 code citations in healthcare responses
- Enforce GAAP/IFRS standard citations in finance responses
- Add structured response format requirements
- Include red flag warnings for urgent conditions
- Add mandatory disclaimers for all domain responses

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

## Success Criteria

### Must Have (P0)
- [ ] All healthcare queries with medical terms include ICD-10 codes
- [ ] All finance queries with accounting topics include GAAP/IFRS citations
- [ ] 100% of domain responses include disclaimers
- [ ] Urgent medical conditions trigger red flag warnings

### Should Have (P1)
- [ ] Codes are relevant to the query context
- [ ] Multiple codes listed when applicable
- [ ] Section-level references for finance (ASC 606-10-25)
- [ ] Consistent formatting across all responses

### Nice to Have (P2)
- [ ] LLMs explain why codes are relevant
- [ ] Cross-references between related codes
- [ ] Differential diagnosis with code rankings
- [ ] Implementation examples for finance

## Rollback Plan

If issues occur:

1. **Immediate Rollback:**
   ```bash
   git revert HEAD
   npm run dev
   ```

2. **Partial Rollback:**
   - Keep prompt structure but reduce citation requirements
   - Make citations "recommended" instead of "mandatory"

3. **Adjust and Retry:**
   - Review actual LLM responses
   - Identify where prompts are unclear
   - Refine prompt language based on observed behavior

## Monitoring

### Metrics to Track

**Healthcare Domain:**
- Percentage of responses with ICD-10 codes (target: >90%)
- Code relevance score (manual review of 20 responses)
- Red flag accuracy (are urgent conditions flagged?)

**Finance Domain:**
- Percentage of responses with standard citations (target: >90%)
- Section reference accuracy (are ASC XXX-YY-ZZ format correct?)
- Compliance warning completeness

### User Feedback Signals

Monitor for:
- User complaints about missing codes
- Requests for more detailed code explanations
- Feedback on response formatting
- Suggestions for additional standards/codes

## Next Steps After Implementation

1. **Phase 3.7:** Real-time Knowledge Updates
   - Admin panel for knowledge management
   - Import from external sources (PubMed, SEC)
   - Knowledge versioning

2. **Phase 3.8:** Knowledge Provenance Tracking
   - Source links for codes/standards
   - Citation metadata
   - Audit trail for knowledge usage

3. **Phase 3.9:** Performance Benchmarking
   - Measure citation accuracy
   - Compare semantic vs keyword search
   - Track improvement over time

---

## Quick Reference Commands

```bash
# Development
npm run dev                    # Start server

# Testing Healthcare
curl -X POST http://localhost:3000/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{"query":"What causes diabetes?","domain":"healthcare"}'

# Testing Finance
curl -X POST http://localhost:3000/api/council/query/stream \
  -H "Content-Type: application/json" \
  -d '{"query":"How to recognize revenue?","domain":"finance"}'

# Check Logs
tail -f logs/combined-*.log     # View server logs

# Git
git add src/config/domains.ts
git commit -m "feat: enhance domain prompts with code citations"
git push origin feature/phase-3-remaining
```

---

## Related Documentation

- `docs/skills.md` - Overall project context
- `docs/skills-domain-prompts.md` - Detailed prompt specifications
- `docs/skills-citation-format.md` - Citation formatting rules

---

**Ready to Implement:** Yes ✅
**Blocks Any Other Work:** No
**Risk Level:** Low (easy to rollback)

**Last Updated:** 2025-12-29
**Owner:** LLM Council Development Team
