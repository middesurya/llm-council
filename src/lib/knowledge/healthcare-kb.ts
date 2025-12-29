/**
 * Healthcare Knowledge Base
 * Contains ICD-10 codes, SNOMED CT concepts, and medical reference information
 */

export interface MedicalCode {
  code: string;
  description: string;
  category: string;
  keywords: string[];
  sourceUrl?: string;  // Provenance: Link to official ICD-10 documentation
  lastUpdated?: string; // ISO timestamp of last update
  version?: string;    // Version identifier
}

export interface MedicalReference {
  topic: string;
  content: string;
  keywords: string[];
  codes?: string[];
  sourceUrl?: string;  // Provenance: Link to medical guidelines/literature
  lastUpdated?: string; // ISO timestamp of last update
  version?: string;    // Version identifier
}

// ICD-10 Common Codes (expanded database - 50+ codes)
// Source: WHO ICD-10 Browser (https://icd.who.int/browse10/2019/en)
export const icd10Codes: MedicalCode[] = [
  // Circulatory System
  {
    code: "I10",
    description: "Essential (primary) hypertension",
    category: "Circulatory System",
    keywords: ["high blood pressure", "hypertension", "bp", "cardiovascular"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I10",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I11",
    description: "Hypertensive heart disease",
    category: "Circulatory System",
    keywords: ["hypertensive heart disease", "heart failure", "hypertension"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I11",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I12",
    description: "Hypertensive renal disease",
    category: "Circulatory System",
    keywords: ["kidney disease", "renal failure", "hypertension", "nephropathy"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I12",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I20",
    description: "Angina pectoris",
    category: "Circulatory System",
    keywords: ["angina", "chest pain", "heart pain", "coronary artery"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I20",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I21",
    description: "Acute myocardial infarction",
    category: "Circulatory System",
    keywords: ["heart attack", "myocardial infarction", "cardiac arrest", "mi"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I21",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I25",
    description: "Chronic ischemic heart disease",
    category: "Circulatory System",
    keywords: ["coronary artery disease", "cad", "ischemic heart", "atherosclerosis"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I25",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I50",
    description: "Heart failure",
    category: "Circulatory System",
    keywords: ["heart failure", "congestive heart failure", "chf", "cardiac insufficiency"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I50",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I63",
    description: "Cerebral infarction",
    category: "Circulatory System",
    keywords: ["stroke", "brain attack", "cerebrovascular accident", "cva", "ischemic stroke"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I63",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },
  {
    code: "I69",
    description: "Sequelae of cerebrovascular disease",
    category: "Circulatory System",
    keywords: ["stroke sequelae", "post-stroke", "cva aftermath"],
    sourceUrl: "https://icd.who.int/browse10/2019/en#/I69",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ICD-10-2019"
  },

  // Respiratory System
  {
    code: "J01",
    description: "Acute sinusitis",
    category: "Respiratory System",
    keywords: ["sinus infection", "sinusitis", "sinus inflammation"]
  },
  {
    code: "J02",
    description: "Acute pharyngitis",
    category: "Respiratory System",
    keywords: ["sore throat", "throat infection", "pharyngitis", "strep throat"]
  },
  {
    code: "J03",
    description: "Acute tonsillitis",
    category: "Respiratory System",
    keywords: ["tonsillitis", "tonsil infection", "sore tonsils"]
  },
  {
    code: "J06",
    description: "Acute upper respiratory infections",
    category: "Respiratory System",
    keywords: ["cold", "flu", "respiratory infection", "uri", "upper respiratory"]
  },
  {
    code: "J18",
    description: "Pneumonia, unspecified",
    category: "Respiratory System",
    keywords: ["pneumonia", "lung infection", "chest infection"]
  },
  {
    code: "J20",
    description: "Acute bronchitis",
    category: "Respiratory System",
    keywords: ["bronchitis", "bronchial inflammation", "chest cold"]
  },
  {
    code: "J45",
    description: "Asthma",
    category: "Respiratory System",
    keywords: ["asthma", "wheezing", "bronchial asthma", "respiratory"]
  },
  {
    code: "J47",
    description: "Bronchiectasis",
    category: "Respiratory System",
    keywords: ["bronchiectasis", "bronchial damage", "chronic bronchial infection"]
  },
  {
    code: "J81",
    description: "Pulmonary edema",
    category: "Respiratory System",
    keywords: ["fluid in lungs", "lung edema", "pulmonary fluid"]
  },

  // Digestive System
  {
    code: "K35",
    description: "Acute appendicitis",
    category: "Digestive System",
    keywords: ["appendicitis", "appendix inflammation", "appendix"]
  },
  {
    code: "K29",
    description: "Gastritis and duodenitis",
    category: "Digestive System",
    keywords: ["gastritis", "stomach inflammation", "duodenitis", "stomach pain"]
  },
  {
    code: "K30",
    description: "Diseases of esophagus",
    category: "Digestive System",
    keywords: ["gerd", "acid reflux", "esophagitis", "heartburn"]
  },
  {
    code: "K35",
    description: "Acute appendicitis",
    category: "Digestive System",
    keywords: ["appendicitis", "appendix", "right lower quadrant pain"]
  },
  {
    code: "K40",
    description: "Cholelithiasis",
    category: "Digestive System",
    keywords: ["gallstones", "gall bladder stones", "biliary colic"]
  },
  {
    code: "K42",
    description: "Cholecystitis",
    category: "Digestive System",
    keywords: ["gallbladder inflammation", "cholecystitis", "gallbladder infection"]
  },
  {
    code: "K44",
    description: "Gastroesophageal reflux",
    category: "Digestive System",
    keywords: ["gerd", "acid reflux", "heartburn", "reflux"]
  },
  {
    code: "K59.9",
    description: "Functional intestinal disorder",
    category: "Digestive System",
    keywords: ["ibs", "irritable bowel syndrome", "intestinal problems"]
  },

  // Musculoskeletal
  {
    code: "M25.5",
    description: "Pain in joint",
    category: "Musculoskeletal",
    keywords: ["joint pain", "arthralgia", "joint ache"]
  },
  {
    code: "M54.5",
    description: "Low back pain",
    category: "Musculoskeletal",
    keywords: ["back pain", "lumbago", "lower back", "spine pain"]
  },
  {
    code: "M79.3",
    description: "Pain in limb",
    category: "Musculoskeletal",
    keywords: ["arm pain", "leg pain", "limb pain"]
  },
  {
    code: "M54.2",
    description: "Cervicalgia",
    category: "Musculoskeletal",
    keywords: ["neck pain", "cervical pain", "stiff neck"]
  },
  {
    code: "M75",
    description: "Shoulder lesions",
    category: "Musculoskeletal",
    keywords: ["shoulder pain", "rotator cuff", "frozen shoulder"]
  },
  {
    code: "M70",
    description: "Soft tissue disorders",
    category: "Musculoskeletal",
    keywords: ["tendonitis", "bursitis", "soft tissue injury"]
  },

  // Nervous System
  {
    code: "G43",
    description: "Migraine",
    category: "Nervous System",
    keywords: ["migraine", "migraine headache", "vascular headache", "severe headache", "throbbing headache", "headaches", "one-sided headache"]
  },
  {
    code: "G44",
    description: "Other headache syndromes",
    category: "Nervous System",
    keywords: ["tension headache", "cluster headache", "chronic headache"]
  },
  {
    code: "G35",
    description: "Multiple sclerosis",
    category: "Nervous System",
    keywords: ["ms", "multiple sclerosis", "demyelinating disease"]
  },
  {
    code: "G40",
    description: "Epilepsy",
    category: "Nervous System",
    keywords: ["epilepsy", "seizure", "convulsion"]
  },
  {
    code: "G61",
    description: "Inflammatory polyneuropathy",
    category: "Nervous System",
    keywords: ["neuropathy", "nerve damage", "peripheral neuropathy"]
  },

  // Mental & Behavioral
  {
    code: "F32",
    description: "Depressive episode",
    category: "Mental Health",
    keywords: ["depression", "major depression", "depressive disorder"]
  },
  {
    code: "F41",
    description: "Anxiety disorders",
    category: "Mental Health",
    keywords: ["anxiety", "anxiety disorder", "panic", "generalized anxiety"]
  },
  {
    code: "F33",
    description: "Recurrent depressive disorder",
    category: "Mental Health",
    keywords: ["recurrent depression", "chronic depression", "mdd"]
  },

  // Endocrine
  {
    code: "E03",
    description: "Hypothyroidism",
    category: "Endocrine",
    keywords: ["hypothyroidism", "underactive thyroid", "low thyroid"]
  },
  {
    code: "E05",
    description: "Thyrotoxicosis",
    category: "Endocrine",
    keywords: ["hyperthyroidism", "overactive thyroid", "graves disease"]
  },
  {
    code: "E11",
    description: "Type 2 diabetes mellitus",
    category: "Endocrine",
    keywords: ["diabetes", "type 2 diabetes", "high blood sugar", "hyperglycemia"]
  },
  {
    code: "E10",
    description: "Type 1 diabetes mellitus",
    category: "Endocrine",
    keywords: ["type 1 diabetes", "juvenile diabetes", "insulin dependent"]
  },

  // Symptoms
  {
    code: "R05",
    description: "Cough",
    category: "Symptoms",
    keywords: ["cough", "persistent cough", "dry cough", "wet cough"]
  },
  {
    code: "R06",
    description: "Abnormalities of breathing",
    category: "Symptoms",
    keywords: ["shortness of breath", "dyspnea", "breathing difficulty"]
  },
  {
    code: "R07",
    description: "Pain in throat and chest",
    category: "Symptoms",
    keywords: ["chest pain", "throat pain", "chest discomfort", "angina"]
  },
  {
    code: "R10",
    description: "Abdominal and pelvic pain",
    category: "Symptoms",
    keywords: ["abdominal pain", "stomach pain", "belly pain"]
  },
  {
    code: "R11",
    description: "Nausea and vomiting",
    category: "Symptoms",
    keywords: ["nausea", "vomiting", "throwing up", "emesis", "queasy", "nauseous"]
  },
  {
    code: "R35",
    description: "Polyuria",
    category: "Symptoms",
    keywords: ["frequent urination", "excessive urination", "polyuria", "peeing often", "increased urination", "urinating frequently"]
  },
  {
    code: "R63.1",
    description: "Polydipsia",
    category: "Symptoms",
    keywords: ["excessive thirst", "increased thirst", "polydipsia", "very thirsty", "drinking a lot", "always thirsty"]
  },
  {
    code: "R63.2",
    description: "Polyphagia",
    category: "Symptoms",
    keywords: ["excessive hunger", "increased hunger", "polyphagia", "always hungry", "eating a lot", "increased appetite"]
  },
  {
    code: "R63.4",
    description: "Abnormal weight loss",
    category: "Symptoms",
    keywords: ["weight loss", "losing weight", "unexplained weight loss", "unintentional weight loss"]
  },
  {
    code: "R13",
    description: "Dysphagia",
    category: "Symptoms",
    keywords: ["difficulty swallowing", "dysphagia", "swallowing problems"]
  },
  {
    code: "R50",
    description: "Fever",
    category: "Symptoms",
    keywords: ["fever", "pyrexia", "high temperature", "elevated temp"]
  },
  {
    code: "R51",
    description: "Headache",
    category: "Symptoms",
    keywords: ["headache", "cephalgia", "head pain"]
  },
  {
    code: "R55",
    description: "Signs and symptoms",
    category: "Symptoms",
    keywords: ["fatigue", "weakness", "malaise", "tiredness"]
  },
  {
    code: "H53",
    description: "Visual disturbances",
    category: "Symptoms",
    keywords: ["blurred vision", "vision changes", "visual disturbance", "blurry vision", "double vision", "vision problems", "eye problems", "seeing spots"]
  },
  {
    code: "Z00",
    description: "General examination",
    category: "Factors Influencing Health",
    keywords: ["checkup", "physical exam", "routine exam", "health check"]
  }
];

// Medical Reference Knowledge (expanded)
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
    codes: ["I21", "R07"],
    sourceUrl: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Coronary-Syndromes-ACS-management-of",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ESC-2020"
  },
  {
    topic: "Hypertension Management",
    content: `Hypertension classification (ACC/AHA 2017):
- Normal: <120/80 mmHg
- Elevated: 120-129/<80 mmHg
- Stage 1: 130-139/80-89 mmHg
- Stage 2: ≥140/≥90 mmHg
Lifestyle modifications: DASH diet, sodium restriction, exercise, weight loss
Medication classes: ACE inhibitors, ARBs, CCBs, thiazide diuretics, beta-blockers`,
    keywords: ["hypertension", "high blood pressure", "bp", "blood pressure"],
    codes: ["I10"],
    sourceUrl: "https://www.ahajournals.org/doi/10.1161/HYP.0000000000000065",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ACC-AHA-2017"
  },
  {
    topic: "Diabetes Type 2",
    content: `Diagnostic criteria (ADA guidelines):
- Fasting plasma glucose ≥126 mg/dL (7.0 mmol/L)
- HbA1c ≥6.5%
- 2-hour plasma glucose ≥200 mg/dL (11.1 mmol/L) during OGTT
- Random plasma glucose ≥200 mg/dL with classic symptoms
Management: Lifestyle modification, metformin first-line, cardiovascular risk reduction
Complications monitoring: Retinopathy, nephropathy, neuropathy, cardiovascular disease`,
    keywords: ["diabetes", "type 2", "hyperglycemia", "blood sugar"],
    codes: ["E11"],
    sourceUrl: "https://diabetesjournals.org/collection/43961/standards-of-care-in-diabetes",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ADA-2024"
  },
  {
    topic: "Asthma Management",
    content: `Asthma classification and management:
- Intermittent: Daytime symptoms ≤2x/week, nighttime ≤2x/month
- Mild Persistent: Daytime symptoms >2x/week, nighttime >2x/month
- Moderate Persistent: Daily symptoms, nighttime >1x/week
- Severe Persistent: Continual symptoms, frequent nighttime awakening
Controller medications: Inhaled corticosteroids, LABAs
Rescue medications: SABA (albuterol)
Triggers: Allergens, exercise, cold air, smoke, stress`,
    keywords: ["asthma", "wheezing", "bronchial asthma", "respiratory", "inhaler"],
    codes: ["J45"],
    sourceUrl: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7145195/",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "GINA-2023"
  },
  {
    topic: "Pneumonia Evaluation",
    content: `Pneumonia classification:
Community-acquired pneumonia (CAP): Acquired outside hospital setting
Hospital-acquired pneumonia (HAP): Develops 48h after admission
Aspiration pneumonia: From inhaling gastric contents
Common pathogens: S. pneumoniae, H. influenzae, atypical organisms (Mycoplasma, Legionella)
Diagnosis: Chest X-ray, sputum culture, blood tests, pulse oximetry
Treatment: Antibiotics based on likely pathogen and severity (CURB-65 score)`,
    keywords: ["pneumonia", "lung infection", "respiratory infection", "pneumonitis"],
    codes: ["J18"],
    sourceUrl: "https://www.atsjournals.org/doi/full/10.1164/rccm.201910-1941ST",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ATS-IDSA-2019"
  },
  {
    topic: "Appendicitis",
    content: `Acute appendicitis signs:
- Pain: Periumbilical to RLQ (McBurney's point) migration
- GI symptoms: Anorexia, nausea, vomiting
- Inflammation: Fever, leukocytosis
Physical exam findings:
- Rebound tenderness at McBurney's point
- Rovsing's sign (palpation in LLQ causes RLQ pain)
- Psoas sign (extreme hip flexion)
- Obturator sign (hip internal rotation)
Treatment: Appendectomy, antibiotics if perforated`,
    keywords: ["appendicitis", "appendix", "right lower quadrant pain", "rlq pain"],
    codes: ["K35"],
    sourceUrl: "https://www.ncbi.nlm.nih.gov/books/NBK430891/",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "NCBI-Bookshelf"
  },
  {
    topic: "Acute Coronary Syndrome",
    content: `ACS classification:
- STEMI: ST-elevation myocardial infarction (complete occlusion)
- NSTEMI: Non-ST-elevation MI (partial occlusion)
- Unstable angina: Chest pain at rest, new or increasing pattern
Diagnosis: ECG, cardiac biomarkers (troponin, CK-MB)
Treatment:
- STEMI: Immediate reperfusion (PCI or thrombolytics)
- NSTEMI/Unstable angina: Risk stratification, early invasive strategy
Medications: Antiplatelets (aspirin, P2Y12 inhibitors), anticoagulants, statins, beta-blockers
- Code I21 for AMI, I20 for angina`,
    keywords: ["acs", "acute coronary syndrome", "mi", "heart attack", "stem", "nstemi"],
    codes: ["I20", "I21", "I25"],
    sourceUrl: "https://www.escardio.org/Guidelines/Clinical-Practice-Guidelines/Acute-Coronary-Syndromes-ACS-management-of",
    lastUpdated: "2024-01-01T00:00:00Z",
    version: "ESC-2020"
  },
  {
    topic: "Stroke Evaluation",
    content: `Stroke types and urgency:
Ischemic stroke (80%): Caused by clot blocking brain artery
- Large artery atherosclerosis
- Cardioembolic
- Small vessel occlusion
- Cryptogenic
Hemorrhagic stroke (20%): Intracerebral hemorrhage
- Hypertensive hemorrhage
- Aneurysm rupture
- AVM rupture
FAST assessment: Face, Arms, Speech, Time
Imaging: Non-contrast CT (distinguish ischemic vs hemorrhagic)
Treatment: tPA for ischemic (within 3-4.5h), blood pressure management for hemorrhagic`,
    keywords: ["stroke", "cva", "cerebrovascular accident", "brain attack", "tia", "mini stroke"],
    codes: ["I63", "I64", "I69"]
  },
  {
    topic: "Depression Screening",
    content: `Depression screening (PHQ-9):
Over last 2 weeks, how often have you been bothered by:
1. Little interest or pleasure in doing things
2. Feeling down, depressed, or hopeless
3. Trouble falling or staying asleep, or sleeping too much
4. Feeling tired or having little energy
5. Poor appetite or overeating
6. Feeling bad about yourself - or that you're a failure
7. Trouble concentrating on things
8. Moving or speaking slowly, or being fidgety/restless
9. Thoughts that you would be better off dead or of hurting yourself

Mild: 5-9, Moderate: 10-14, Severe: 15-19, Severe: 20-27
Treatment: Psychotherapy (CBT), medications (SSRIs, SNRIs), hospitalization if suicidal`,
    keywords: ["depression", "major depression", "mdd", "depressive disorder", "phq-9"],
    codes: ["F32", "F33"]
  },
  {
    topic: "Anxiety Disorders",
    content: `Anxiety disorders classification:
- Generalized Anxiety Disorder (GAD): Excessive worry, difficulty controlling worry
- Panic Disorder: Recurrent panic attacks, fear of future attacks
- Social Anxiety Disorder: Fear of social situations, scrutiny
- Specific Phobias: Intense fear of specific objects/situations

Physical symptoms of anxiety:
- Cardiovascular: Palpitations, tachycardia, chest pain
- Respiratory: Shortness of breath, hyperventilation
- GI: Nausea, abdominal pain
- Neurological: Dizziness, headache, paresthesias
Treatment: SSRIs, SNRIs, benzodiazepines (short-term), CBT`,
    keywords: ["anxiety", "panic", "gad", "social anxiety", "phobia", "worry"],
    codes: ["F41"]
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
      context += `- ${code.code}: ${code.description} (${code.category})`;
      if (code.sourceUrl) {
        context += ` | Source: ${code.sourceUrl}`;
      }
      context += `\n`;
    });
  }

  if (refs.length > 0) {
    context += "\n\nMedical Reference Information:\n";
    refs.forEach((ref) => {
      context += `\n${ref.topic}:`;
      if (ref.sourceUrl) {
        context += ` | Source: ${ref.sourceUrl}`;
      }
      context += `\n${ref.content}\n`;
    });
  }

  return context;
}
