/**
 * Healthcare Knowledge Base
 * Contains ICD-10 codes, SNOMED CT concepts, and medical reference information
 */

export interface MedicalCode {
  code: string;
  description: string;
  category: string;
  keywords: string[];
}

export interface MedicalReference {
  topic: string;
  content: string;
  keywords: string[];
  codes?: string[];
}

// ICD-10 Common Codes (sample data)
export const icd10Codes: MedicalCode[] = [
  {
    code: "I10",
    description: "Essential (primary) hypertension",
    category: "Circulatory System",
    keywords: ["high blood pressure", "hypertension", "bp", "cardiovascular"]
  },
  {
    code: "I21",
    description: "Acute myocardial infarction",
    category: "Circulatory System",
    keywords: ["heart attack", "myocardial infarction", "cardiac arrest", "mi", "chest pain"]
  },
  {
    code: "J06",
    description: "Acute upper respiratory infections",
    category: "Respiratory System",
    keywords: ["cold", "flu", "respiratory infection", "sore throat", "cough"]
  },
  {
    code: "M54.5",
    description: "Low back pain",
    category: "Musculoskeletal",
    keywords: ["back pain", "lumbago", "lower back", "spine pain"]
  },
  {
    code: "R07",
    description: "Pain in throat and chest",
    category: "Symptoms",
    keywords: ["chest pain", "throat pain", "chest discomfort", "angina"]
  },
  {
    code: "R51",
    description: "Headache",
    category: "Symptoms",
    keywords: ["headache", "migraine", "cephalgia", "head pain"]
  },
  {
    code: "E11",
    description: "Type 2 diabetes mellitus",
    category: "Endocrine",
    keywords: ["diabetes", "type 2 diabetes", "high blood sugar", "hyperglycemia"]
  },
  {
    code: "J45",
    description: "Asthma",
    category: "Respiratory System",
    keywords: ["asthma", "wheezing", "bronchial asthma", "respiratory"]
  }
];

// Medical Reference Knowledge
export const medicalReferences: MedicalReference[] = [
  {
    topic: "Chest Pain Evaluation",
    content: `Chest pain assessment requires considering multiple potential causes:
1. Cardiac: Acute Coronary Syndrome (ACS), angina, myocardial infarction
2. Pulmonary: Pulmonary embolism, pneumonia, pneumothorax
3. Gastrointestinal: GERD, esophageal spasm
4. Musculoskeletal: Costochondritis, rib fracture
Key red flags: radiating pain, shortness of breath, diaphoresis, nausea/vomiting`,
    keywords: ["chest pain", "chest discomfort", "angina", "cardiac", "mi"],
    codes: ["I21", "R07"]
  },
  {
    topic: "Hypertension Management",
    content: `Hypertension classification:
- Normal: <120/80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1: 130-139/80-89 mmHg
- Stage 2: ≥140/≥90 mmHg
Lifestyle modifications: DASH diet, sodium restriction, exercise, weight loss
Medication classes: ACE inhibitors, ARBs, CCBs, thiazide diuretics`,
    keywords: ["hypertension", "high blood pressure", "bp", "blood pressure"],
    codes: ["I10"]
  },
  {
    topic: "Diabetes Type 2",
    content: `Diagnostic criteria (ADA guidelines):
- Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)
- HbA1c ≥6.5%
- 2-hour plasma glucose ≥200 mg/dL (11.1 mmol/L) during OGTT
- Random plasma glucose ≥200 mg/dL with classic symptoms
Management: Lifestyle modification, metformin first-line, cardiovascular risk reduction`,
    keywords: ["diabetes", "type 2", "hyperglycemia", "blood sugar"],
    codes: ["E11"]
  }
];

/**
 * Search ICD-10 codes by keywords
 */
export function searchICD10Codes(query: string): MedicalCode[] {
  const lowerQuery = query.toLowerCase();
  return icd10Codes.filter(
    (code) =>
      code.code.toLowerCase().includes(lowerQuery) ||
      code.description.toLowerCase().includes(lowerQuery) ||
      code.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );
}

/**
 * Search medical references by keywords
 */
export function searchMedicalReferences(query: string): MedicalReference[] {
  const lowerQuery = query.toLowerCase();
  return medicalReferences.filter(
    (ref) =>
      ref.topic.toLowerCase().includes(lowerQuery) ||
      ref.content.toLowerCase().includes(lowerQuery) ||
      ref.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase()))
  );
}

/**
 * Get relevant medical context for a query
 */
export function getMedicalContext(query: string): string {
  const codes = searchICD10Codes(query);
  const refs = searchMedicalReferences(query);

  let context = "";

  if (codes.length > 0) {
    context += "\n\nRelevant ICD-10 Codes:\n";
    codes.forEach((code) => {
      context += `- ${code.code}: ${code.description} (${code.category})\n`;
    });
  }

  if (refs.length > 0) {
    context += "\n\nMedical Reference Information:\n";
    refs.forEach((ref) => {
      context += `\n${ref.topic}:\n${ref.content}\n`;
    });
  }

  return context;
}
