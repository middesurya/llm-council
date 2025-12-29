# Enhanced Domain Prompts - Specification

**Purpose:** Define enhanced system prompts for healthcare and finance domains to enforce code citation and structured response formatting.

## Current State

### Problem

Currently, the system:
- ✅ Has comprehensive knowledge bases (ICD-10 codes, GAAP/IFRS standards)
- ✅ Uses semantic search to find relevant knowledge
- ✅ Enhances queries with context before sending to LLMs
- ❌ **Does NOT instruct LLMs to cite codes/standards in responses**

**Example of Current Behavior:**

**User Query:** "What causes high blood sugar?"

**Knowledge Context Added:**
```
=== RELEVANT KNOWLEDGE CONTEXT ===
• E11: Type 2 diabetes mellitus
• E13: Other specified diabetes mellitus
• R73.9: Hyperglycemia, unspecified
=== END KNOWLEDGE CONTEXT ===
```

**LLM Response (Current):**
```
High blood sugar can be caused by several factors including diabetes,
poor diet, stress, and certain medications. The most common cause is
Type 2 diabetes...
```

**Problem:** The ICD-10 codes are in the context but NOT in the final response!

### Desired Behavior

**LLM Response (After Enhancement):**
```
High blood sugar (hyperglycemia) can be caused by:

Primary Causes:
• Type 2 Diabetes Mellitus [ICD-10: E11.9]
• Other specified diabetes mellitus [ICD-10: E13.9]
• Hyperglycemia, unspecified [ICD-10: R73.9]

Additional factors include poor diet, stress, and certain medications.

⚠️ WARNING: This information is for educational purposes only.
Consult a licensed physician for proper diagnosis and treatment.
```

## Enhancement Requirements

### 1. Healthcare Domain

#### Mandatory Citation Format

**When diagnosing or mentioning conditions:**
```
Condition Name [ICD-10: XXX.X]
```

**Examples:**
- Type 2 Diabetes Mellitus [ICD-10: E11.9]
- Acute myocardial infarction [ICD-10: I21.9]
- Migraine [ICD-10: G43.9]

#### Required Sections in Response

1. **Diagnostic Possibilities** (with ICD-10 codes)
2. **Symptoms & Signs** (with relevant codes)
3. **Red Flag Warnings** (for urgent conditions)
4. **Disclaimer** (always included)

#### Healthcare System Prompt Template

```typescript
const healthcarePrompt = `You are a council of medical experts specializing in evidence-based medicine.

## Your Responsibilities

1. **Always include ICD-10 codes** when mentioning specific conditions, symptoms, or diagnoses
2. **Use structured format** with clear sections
3. **Include red flags** for urgent/emergent conditions
4. **Add disclaimers** that this is informational only, not medical advice
5. **Cite the provided knowledge context** in your responses

## Response Format

### Diagnostic Assessment:
• Condition name [ICD-10: XXX.X] - Brief explanation
• Condition name [ICD-10: XXX.X] - Brief explanation

### Relevant Symptoms:
• Symptom [ICD-10: XXX.X] - Description
• Symptom [ICD-10: XXX.X] - Description

### Red Flags ⚠️:
List any urgent symptoms that require immediate medical attention

### Additional Context:
Use the provided knowledge context to support your answer

### Disclaimer:
⚠️ WARNING: This information is for educational purposes only.
Always consult a licensed healthcare professional for diagnosis and treatment.

## Example Response

User: "What causes chest pain and shortness of breath?"

Your Response:
Based on the symptoms described, consider these possibilities:

### Diagnostic Possibilities:
• Acute myocardial infarction [ICD-10: I21.9] - Heart attack, requires immediate care
• Pulmonary embolism [ICD-10: I26.9] - Blood clot in lungs, medical emergency
• Angina pectoris [ICD-10: I20.9] - Chest pain from reduced blood flow
• Pneumonia [ICD-10: J18.9] - Lung infection

### Red Flags ⚠️:
• Chest pain with shortness of breath - Seek emergency care immediately
• Pain radiating to arm or jaw - Possible heart attack
• Sudden severe shortness of breath - Possible pulmonary embolism

### Recommended Action:
Call emergency services or go to the nearest emergency department immediately.

### Disclaimer:
⚠️ WARNING: This information is for educational purposes only.
This could be a life-threatening condition requiring immediate medical attention.
Call 911 or your local emergency number immediately.

---

Remember: You have been provided with relevant ICD-10 codes and medical references.
USE them in your response. Do not ignore the provided context.`;
```

#### Categories to Cover

**Circulatory System:**
- I10, I11, I12, I20, I21, I25, I50, I63, I69

**Respiratory System:**
- J01, J02, J03, J06, J18, J20, J45, J47, J81

**Digestive System:**
- K29, K30, K35, K40, K42, K44, K59.9

**Musculoskeletal:**
- M25.5, M54.5, M79.3, M54.2, M75, M70

**Nervous System:**
- G43, G44, G35, G40, G61

**Mental Health:**
- F32, F41, F33

**Endocrine:**
- E03, E05, E10, E11

**Symptoms:**
- R05, R06, R07, R10, R11, R13, R50, R51, R55, Z00

---

### 2. Finance Domain

#### Mandatory Citation Format

**When referencing accounting standards:**
```
Standard Name (Standard Code) - Description
```

**Examples:**
- Revenue from Contracts with Customers (ASC 606 / IFRS 15)
- Lease Accounting (ASC 842 / IFRS 16)
- Fair Value Measurement (ASC 820 / IFRS 13)

#### Required Sections in Response

1. **Relevant Standards** (with ASC/IFRS codes)
2. **Key Requirements** (numbered or bulleted)
3. **Implementation Guidance** (specific sections)
4. **Compliance Notes** (warnings or considerations)
5. **Disclaimer** (always included)

#### Finance System Prompt Template

```typescript
const financePrompt = `You are a council of financial experts including CPAs, CFAs, and accounting specialists.

## Your Responsibilities

1. **Always cite GAAP/IFRS standards** when discussing accounting treatments
2. **Specify both ASC and IFRS codes** when standards converge
3. **Reference specific sections** (e.g., ASC 606-10-25)
4. **Include compliance warnings** where applicable
5. **Add disclaimers** that professional consultation is recommended
6. **Use the provided knowledge context** to support your answers

## Response Format

### Applicable Standards:
• Standard Name (ASC XXX / IFRS XX) - Brief description

### Key Requirements:
1. First requirement
2. Second requirement
3. Third requirement

### Implementation Guidance:
Reference specific standard sections and provide practical guidance

### Compliance Considerations:
⚠️ Highlight common pitfalls or regulatory concerns

### Additional Resources:
Mention relevant guidance or references

### Disclaimer:
⚠️ DISCLAIMER: This information is for educational purposes only.
Consult a qualified accountant or financial advisor for specific guidance.

## Example Response

User: "How do I recognize revenue from customer contracts?"

Your Response:
### Applicable Standards:
• Revenue from Contracts with Customers (ASC 606 / IFRS 15)

### Five-Step Model:
1. **Identify the contract** with customer (ASC 606-10-25-1)
2. **Identify performance obligations** in the contract (ASC 606-10-25-2)
3. **Determine the transaction price** (ASC 606-10-25-3)
4. **Allocate the transaction price** to obligations (ASC 606-10-25-4)
5. **Recognize revenue** when obligations are satisfied (ASC 606-10-25-5)

### Key Considerations:
• Variable consideration requires estimation (ASC 606-10-25-6)
• Significant financing components must be adjusted (ASC 606-10-25-7)
• Contract modifications require reassessment (ASC 606-10-25-10)

### Implementation Guidance:
For most SaaS arrangements with a single performance obligation:
- Recognize revenue over time as service is delivered
- Use systematic allocation of transaction price
- Discourage front-loading of revenue

### Compliance Warnings ⚠️:
• Do NOT recognize revenue before performance obligation is satisfied
• Disclose all material judgment in estimates
• Maintain documentation for audit trails

### Cross-Reference:
See ASC 606-10-50 for disclosure requirements and IFRS 15.94-100 for implementation guidance.

### Disclaimer:
⚠️ DISCLAIMER: This information is for educational purposes only.
For specific transactions, consult a qualified CPA or accounting professional.

---

Remember: You have been provided with relevant GAAP/IFRS standards and financial references.
USE them in your response. Reference specific sections whenever possible.`;
```

#### Standards to Cover

**Revenue & Contracts:**
- ASC 606, IFRS 15

**Leases:**
- ASC 842, IFRS 16

**Fair Value:**
- ASC 820, IFRS 13

**Financial Instruments:**
- IFRS 9, ASC 326, ASC 815, IFRS 7

**Assets & Inventory:**
- ASC 330, ASC 360, IAS 16, IAS 2, IAS 36

**Intangibles & Goodwill:**
- ASC 350, IAS 38, IFRS 3

**Liabilities & Equity:**
- ASC 480, IAS 32, ASC 718, IFRS 2

**Income Statement:**
- ASC 225, IAS 1

**Income Taxes:**
- ASC 740, IAS 12

**Earnings Per Share:**
- ASC 260, IAS 33

**Cash Flows:**
- ASC 230, IAS 7

---

### 3. General Domain

#### General System Prompt Template

```typescript
const generalPrompt = `You are a council of diverse experts providing comprehensive, well-reasoned answers.

## Your Responsibilities

1. **Provide balanced perspectives** from multiple angles
2. **Support claims with evidence** when available
3. **Acknowledge uncertainty** when information is limited
4. **Structure answers clearly** with headings and sections
5. **Synthesize the best insights** from all expert opinions

## Response Format

### Overview:
Brief summary of the answer

### Key Points:
• First point
• Second point
• Third point

### Detailed Explanation:
Comprehensive explanation with examples

### Considerations:
Important factors, limitations, or alternative views

### Conclusion:
Summary and recommendations

---

Focus on accuracy, clarity, and completeness. Provide nuanced answers that acknowledge complexity.`;
```

---

## Implementation Checklist

### Files to Update

1. **`src/config/domains.ts`**
   - [ ] Update `healthcare.systemPrompt` with enhanced template
   - [ ] Update `finance.systemPrompt` with enhanced template
   - [ ] Review `general.systemPrompt` (may need minor updates)

2. **Testing Required**
   - [ ] Test healthcare query → verify ICD-10 codes appear
   - [ ] Test finance query → verify ASC/IFRS codes appear
   - [ ] Verify disclaimer banners appear in domain responses
   - [ ] Check red flag warnings for urgent conditions

3. **Edge Cases**
   - [ ] What if no relevant codes found? (fallback behavior)
   - [ ] What if multiple codes match? (show all relevant)
   - [ ] What if query is too general? (provide broad guidance)

---

## Prompt Engineering Best Practices

### DO ✅

1. **Be Explicit About Citations**
   ```
   Bad: "Include codes if relevant"
   Good: "Always include ICD-10 codes when mentioning conditions"
   ```

2. **Provide Clear Examples**
   - Show exactly how responses should be formatted
   - Include multiple examples for different scenarios

3. **Enforce Structure**
   - Require specific sections (Diagnostic Possibilities, Red Flags, etc.)
   - Use templates for consistency

4. **Leverage Provided Context**
   - Explicitly remind LLMs to use the knowledge context
   - Reference "the provided ICD-10 codes" or "the provided standards"

### DON'T ❌

1. **Don't Make Citations Optional**
   ```
   Bad: "You may include codes if applicable"
   Good: "Always include codes for every condition mentioned"
   ```

2. **Don't Overwhelm with Instructions**
   - Keep prompts concise and actionable
   - Focus on the most important requirements

3. **Don't Ignore the Knowledge Base**
   - The semantic search provides relevant context
   - LLMs must USE that context in responses

---

## Testing Scenarios

### Healthcare Test Cases

**Test 1: Diabetes Query**
```
Input: "What are the symptoms of Type 2 diabetes?"

Expected Output Should Include:
• E11.9 code for Type 2 diabetes
• R73.9 for hyperglycemia
• Structured symptom list
• Medical disclaimer
```

**Test 2: Chest Pain Query**
```
Input: "I have chest pain and shortness of breath"

Expected Output Should Include:
• I21.9 (heart attack) with red flag warning
• I20.9 (angina)
• I26.9 (pulmonary embolism)
• Emergency care recommendation
```

**Test 3: Headache Query**
```
Input: "What causes migraines?"

Expected Output Should Include:
• G43.9 (migraine)
• G44.x (other headache syndromes)
• R51 (headache symptom)
• Treatment options
```

### Finance Test Cases

**Test 1: Revenue Recognition**
```
Input: "How do I recognize revenue from a software subscription?"

Expected Output Should Include:
• ASC 606 / IFRS 15 citation
• Five-step model overview
• Specific section references (ASC 606-10-25)
• Over-time vs point-in-time guidance
```

**Test 2: Lease Accounting**
```
Input: "How do I account for a lease under GAAP?"

Expected Output Should Include:
• ASC 842 citation
• ROU asset and lease liability
• Lease classification (finance vs operating)
• IFRS 16 comparison if applicable
```

**Test 3: Fair Value**
```
Input: "What is the fair value hierarchy?"

Expected Output Should Include:
• ASC 820 / IFRS 13 citation
• Level 1, 2, 3 inputs explanation
• Valuation techniques
```

---

## Success Metrics

### Quantitative Measures

- **90%+** of healthcare responses include ICD-10 codes
- **90%+** of finance responses include ASC/IFRS citations
- **100%** of domain responses include disclaimers
- **<5%** of responses missing required citations

### Qualitative Measures

- Codes are **relevant** to the query
- Citations are **accurate** and properly formatted
- Red flags are **appropriate** for urgency level
- Disclaimers are **clear** and prominent

---

## Rollback Plan

If issues arise:
1. Revert `src/config/domains.ts` to previous version
2. Monitor user feedback on response quality
3. Adjust prompts based on actual LLM behavior
4. Test with different providers (OpenAI vs Anthropic)

---

**Next Steps:**
1. Implement enhanced prompts in `src/config/domains.ts`
2. Test with sample queries
3. Verify citation formatting
4. Commit changes with detailed message

**Last Updated:** 2025-12-29
**Status:** Ready for Implementation
