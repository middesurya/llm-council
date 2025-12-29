# Code Citation Format Guidelines

**Purpose:** Define precise formatting rules for citing ICD-10 codes, GAAP/IFRS standards, and other domain-specific references in LLM responses.

## Healthcare Domain - Citation Formats

### ICD-10 Codes

#### Inline Citation (Preferred)
```
Condition Name [ICD-10: XXX.X]
```

**Examples:**
```
Type 2 Diabetes Mellitus [ICD-10: E11.9]
Acute Myocardial Infarction [ICD-10: I21.9]
Migraine [ICD-10: G43.9]
```

#### List Format
```
Diagnostic Possibilities:
• Type 2 Diabetes Mellitus [ICD-10: E11.9]
• Other Specified Diabetes [ICD-10: E13.9]
• Hyperglycemia [ICD-10: R73.9]
```

#### Multiple Codes for Same Condition
```
Condition Name [ICD-10: XXX.X, YYY.Y, ZZZ.Z]
```

**Example:**
```
Diabetes-related complications [ICD-10: E11.9, E11.8, E11.6]
```

#### Code with Description
```
Code - Description: Brief explanation
```

**Example:**
```
E11.9 - Type 2 diabetes mellitus without complications:
Chronic metabolic condition characterized by insulin resistance.
```

### Medical Specialties & Categories

#### Format by Body System
```
### Circulatory System:
• Essential hypertension [ICD-10: I10]
• Angina pectoris [ICD-10: I20.9]
```

#### Format by Severity
```
Urgent/Emergent:
• Acute myocardial infarction [ICD-10: I21.9] ⚠️ MEDICAL EMERGENCY
• Pulmonary embolism [ICD-10: I26.9] ⚠️ MEDICAL EMERGENCY
```

### Red Flag Warnings

#### Urgent Condition Format
```
⚠️ RED FLAG: Condition Name [ICD-10: XXX.X]
Description of urgency and required action.
```

**Example:**
```
⚠️ RED FLAG: Acute Myocardial Infarction [ICD-10: I21.9]
Symptoms: Chest pain, shortness of breath, radiating pain
Action: Call emergency services (911) immediately
```

### Symptom Citation Format

```
Symptom Name [ICD-10: XXX.X] - Description
```

**Examples:**
```
• Cough [ICD-10: R05] - Persistent coughing reflex
• Shortness of breath [ICD-10: R06.02] - Dyspnea
• Chest pain [ICD-10: R07.9] - Thoracic pain
```

---

## Finance Domain - Citation Formats

### Accounting Standards

#### Dual Standard Citation (ASC + IFRS)
```
Standard Name (ASC XXX / IFRS XX)
```

**Examples:**
```
Revenue from Contracts with Customers (ASC 606 / IFRS 15)
Leases (ASC 842 / IFRS 16)
Fair Value Measurement (ASC 820 / IFRS 13)
```

#### GAAP-Only Citation
```
Standard Name (ASC XXX)
```

**Examples:**
```
Inventory Valuation (ASC 330)
Earnings Per Share (ASC 260)
Income Taxes (ASC 740)
```

#### IFRS-Only Citation
```
Standard Name (IFRS XX)
```

**Examples:**
```
Financial Instruments (IFRS 9)
Intangible Assets (IAS 38)
Business Combinations (IFRS 3)
```

### Section-Level Citations

#### Format
```
ASC XXX-YY-ZZ or IAS/IFRS XX.YY.ZZ
```

**Breakdown:**
- XXX = Standard number
- YY = Subsection (10 = overall, 20 = recognition, 25 = measurement, etc.)
- ZZ = Paragraph number

**Examples:**
```
ASC 606-10-25        (ASC 606, Subsection 10, paragraph 25)
ASC 606-10-25-1      (ASC 606, Subsection 10, paragraph 25, subparagraph 1)
IAS 16.83            (IAS 16, paragraph 83)
IFRS 15.94           (IFRS 15, paragraph 94)
```

### Practical Usage in Responses

#### Citing Specific Requirements
```
Under ASC 606-10-25-1, entities must identify the contract with a customer.
```

#### Citing Multiple Paragraphs
```
Refer to ASC 606-10-25-1 through ASC 606-10-25-5 for the five-step model.
```

#### Citing Implementation Guidance
```
Implementation guidance is provided in ASC 606-10-55 and IFRS 15.B54-B76.
```

### Cross-References

#### GAAP to IFRS Comparison
```
GAAP Treatment (ASC XXX) vs IFRS Treatment (IFRS XX)
```

**Example:**
```
Lease Classification:
• GAAP (ASC 842): Finance vs operating leases
• IFRS (IFRS 16): Single model - all leases on balance sheet
```

#### Related Standards
```
Related Standards:
• ASC 606 / IFRS 15 (Revenue Recognition)
• ASC 842 / IFRS 16 (Leases)
• ASC 820 / IFRS 13 (Fair Value)
```

### Disclosure Requirements

#### Format
```
Disclosure Required: ASC XXX-YY-ZZ (Disclosure section)
```

**Example:**
```
Disclosure Requirements:
• ASC 606-10-50: Performance obligations, transaction price
• IFRS 15.94-120: Contract balances, remaining performance obligations
```

---

## General Citation Best Practices

### DO ✅

1. **Be Consistent**
   - Use the same format throughout the response
   - Group codes logically (by category, severity, etc.)

2. **Provide Context**
   ```
   Bad: E11.9
   Good: Type 2 Diabetes Mellitus [ICD-10: E11.9]
   ```

3. **Include Descriptions**
   ```
   Bad: [ICD-10: I21.9]
   Good: Acute Myocardial Infarction [ICD-10: I21.9] - Heart attack
   ```

4. **Reference Specific Sections**
   ```
   Bad: ASC 606 says...
   Good: Under ASC 606-10-25-1, entities must...
   ```

### DON'T ❌

1. **Don't Use Inconsistent Formatting**
   ```
   Bad: E11.9, [ICD-10: E13.9], R73-9
   Good: [ICD-10: E11.9], [ICD-10: E13.9], [ICD-10: R73.9]
   ```

2. **Don't Omit Context**
   ```
   Bad: 606 requires...
   Good: ASC 606 (Revenue Recognition) requires...
   ```

3. **Don't Mix Standards Without Clarification**
   ```
   Bad: Use 606/15 for revenue...
   Good: Use ASC 606 (GAAP) or IFRS 15 for revenue...
   ```

---

## Structured Response Templates

### Healthcare Response Template

```markdown
## Diagnostic Assessment

### Primary Conditions:
• Condition Name [ICD-10: XXX.X] - Description
• Condition Name [ICD-10: XXX.X] - Description

### Associated Symptoms:
• Symptom [ICD-10: XXX.X] - Description
• Symptom [ICD-10: XXX.X] - Description

### Red Flags ⚠️:
• Urgent Condition [ICD-10: XXX.X] - Action required
• Urgent Condition [ICD-10: XXX.X] - Action required

### Recommended Action:
[Specific medical guidance]

### Disclaimer:
⚠️ WARNING: This information is for educational purposes only.
Consult a licensed healthcare professional for diagnosis and treatment.
```

### Finance Response Template

```markdown
## Applicable Standards

### Relevant Standards:
• Standard Name (ASC XXX / IFRS XX) - Description
• Standard Name (ASC XXX / IFRS XX) - Description

### Key Requirements:
1. Requirement 1 (ASC XXX-YY-ZZ)
2. Requirement 2 (ASC XXX-YY-ZZ)
3. Requirement 3 (ASC XXX-YY-ZZ)

### Implementation Guidance:
[Specific guidance with paragraph references]

### Compliance Considerations ⚠️:
[Common pitfalls or regulatory concerns]

### Additional Resources:
• ASC XXX-YY-ZZ (Additional guidance)
• IFRS XX.YY.ZZ (Implementation guidance)

### Disclaimer:
⚠️ DISCLAIMER: This information is for educational purposes only.
Consult a qualified accountant or financial advisor for specific guidance.
```

---

## Special Cases

### When Multiple Codes Apply

#### Use All Relevant Codes
```
Possible diagnoses include:
• Type 2 diabetes with mild kidney complications [ICD-10: E11.9]
• Type 2 diabetes with mild kidney complications [ICD-10: E11.8]
• Chronic kidney disease, stage 3 [ICD-10: N18.3]
```

#### Prioritize by Specificity
```
Most likely:
• Acute myocardial infarction [ICD-10: I21.9]

Less likely but possible:
• Angina pectoris [ICD-10: I20.9]
• Other chest pain [ICD-10: R07.9]
```

### When Standards Converge

#### Note Convergence
```
Both GAAP and IFRS require similar treatment:
• ASC 606 / IFRS 15: Five-step revenue recognition model
```

#### Highlight Differences
```
Key Differences:
• ASC 842 (GAAP): Finance vs operating lease classification
• IFRS 16 (IFRS): Single model - all leases recognized as assets/liabilities
```

---

## Testing Citations

### Validation Checklist

For each citation, verify:
- [ ] Correct code/standard number
- [ ] Proper formatting (brackets, spacing)
- [ ] Clear description/name
- [ ] Relevant to the query
- [ ] Consistent with other citations

### Automated Testing Rules

```typescript
// Healthcare citation validation
const healthcarePattern = /\[ICD-10:\s+[A-Z]\d{2}(\.\d)?\]/;

// Finance citation validation
const financePattern = /\(ASC\s+\d+(?:-\d+)?(?:\s*\/\s*IFRS\s+\d+)?\)/;

// Test cases
const testHealthcare = "Type 2 Diabetes [ICD-10: E11.9]";
const testFinance = "Revenue (ASC 606 / IFRS 15)";

console.log(healthcarePattern.test(testHealthcare)); // true
console.log(financePattern.test(testFinance));       // true
```

---

## Quick Reference

### Healthcare Quick Codes

| Category | Code Range | Example |
|----------|-----------|---------|
| Circulatory | I00-I99 | I10 (Hypertension) |
| Respiratory | J00-J99 | J18 (Pneumonia) |
| Digestive | K00-K95 | K35 (Appendicitis) |
| Musculoskeletal | M00-M99 | M54.5 (Low back pain) |
| Nervous | G00-G99 | G43 (Migraine) |
| Mental Health | F01-F99 | F32 (Depression) |
| Endocrine | E00-E89 | E11 (Type 2 diabetes) |
| Symptoms | R00-R99 | R05 (Cough) |

### Finance Quick Standards

| Topic | GAAP | IFRS |
|-------|------|------|
| Revenue | ASC 606 | IFRS 15 |
| Leases | ASC 842 | IFRS 16 |
| Fair Value | ASC 820 | IFRS 13 |
| Instruments | ASC 826 / 326 | IFRS 9 / 7 |
| Inventory | ASC 330 | IAS 2 |
| PP&E | ASC 360 | IAS 16 |
| Intangibles | ASC 350 | IAS 38 |
| Income Tax | ASC 740 | IAS 12 |
| EPS | ASC 260 | IAS 33 |
| Cash Flows | ASC 230 | IAS 7 |

---

**Related Documentation:**
- `docs/skills.md` - Overall context
- `docs/skills-domain-prompts.md` - Prompt specifications

**Last Updated:** 2025-12-29
