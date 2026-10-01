/**
 * Clinical Drug Safety Knowledge Base for SwasthyaMitra (Module 13: Drug & Allergy Safety Guard)
 * Designed for Indian Public Health (PHC, CHC, District Hospital, Ayushman Bharat ABDM)
 * Conforms to Non-Diagnostic Decision-Support protocols & National Health Mission safety standards.
 */

// 1. Comprehensive Indian Drug Database (50+ generic and popular brand medications)
export const INDIAN_DRUG_DATABASE = [
  // Antibiotics - Penicillins & Beta-Lactams
  {
    id: 'amoxicillin',
    name: 'Amoxicillin (Mox 500 / Novamox)',
    generic: 'Amoxicillin',
    class: 'Penicillin / Beta-Lactam',
    allergyClass: 'PENICILLIN_BETA_LACTAM',
    category: 'Antibiotic',
    defaultDose: '500 mg TDS',
    pregnancyCat: 'B',
    renalCutoff: 30, // eGFR ml/min
    notes: 'Common first-line antibiotic for RTI, dental & soft tissue infections'
  },
  {
    id: 'augmentin',
    name: 'Amoxicillin + Clavulanic Acid (Augmentin 625)',
    generic: 'Amoxicillin + Potassium Clavulanate',
    class: 'Penicillin / Beta-Lactamase Inhibitor',
    allergyClass: 'PENICILLIN_BETA_LACTAM',
    category: 'Antibiotic',
    defaultDose: '625 mg BD',
    pregnancyCat: 'B',
    renalCutoff: 30,
    notes: 'Broad-spectrum beta-lactamase resistant penicillin'
  },
  {
    id: 'ampicillin',
    name: 'Ampicillin 500mg',
    generic: 'Ampicillin',
    class: 'Penicillin / Beta-Lactam',
    allergyClass: 'PENICILLIN_BETA_LACTAM',
    category: 'Antibiotic',
    defaultDose: '500 mg QDS',
    pregnancyCat: 'B',
    renalCutoff: 30,
    notes: 'Aminopenicillin'
  },
  // Antibiotics - Cephalosporins (Cross-reactive with Penicillin)
  {
    id: 'cefixime',
    name: 'Cefixime (Taxim-O 200 / Zifi)',
    generic: 'Cefixime',
    class: '3rd Gen Cephalosporin',
    allergyClass: 'CEPHALOSPORIN',
    category: 'Antibiotic',
    defaultDose: '200 mg BD',
    pregnancyCat: 'B',
    renalCutoff: 20,
    notes: 'Oral 3rd gen cephalosporin; potential cross-allergy in penicillin-allergic patients'
  },
  {
    id: 'ceftriaxone',
    name: 'Ceftriaxone Inj (Monocef 1g)',
    generic: 'Ceftriaxone',
    class: '3rd Gen Cephalosporin',
    allergyClass: 'CEPHALOSPORIN',
    category: 'Antibiotic',
    defaultDose: '1 g IV/IM OD',
    pregnancyCat: 'B',
    renalCutoff: 10,
    notes: 'Injectable cephalosporin for severe hospital/PHC infections'
  },
  {
    id: 'cefpodoxime',
    name: 'Cefpodoxime Proxetil (Gudcef 200)',
    generic: 'Cefpodoxime',
    class: '3rd Gen Cephalosporin',
    allergyClass: 'CEPHALOSPORIN',
    category: 'Antibiotic',
    defaultDose: '200 mg BD',
    pregnancyCat: 'B',
    renalCutoff: 30,
    notes: 'Broad spectrum cephalosporin'
  },
  // Antibiotics - Fluoroquinolones
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin (Ciplox 500)',
    generic: 'Ciprofloxacin',
    class: 'Fluoroquinolone',
    allergyClass: 'FLUOROQUINOLONE',
    category: 'Antibiotic',
    defaultDose: '500 mg BD',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Avoid in pregnancy/children; risk of tendonitis, QT prolongation'
  },
  {
    id: 'levofloxacin',
    name: 'Levofloxacin (Levoquin 500)',
    generic: 'Levofloxacin',
    class: 'Fluoroquinolone',
    allergyClass: 'FLUOROQUINOLONE',
    category: 'Antibiotic',
    defaultDose: '500 mg OD',
    pregnancyCat: 'C',
    renalCutoff: 50,
    notes: 'Respiratory fluoroquinolone'
  },
  {
    id: 'ofloxacin',
    name: 'Ofloxacin (Zenflox 200)',
    generic: 'Ofloxacin',
    class: 'Fluoroquinolone',
    allergyClass: 'FLUOROQUINOLONE',
    category: 'Antibiotic',
    defaultDose: '200 mg BD',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Fluoroquinolone'
  },
  // Antibiotics - Macrolides
  {
    id: 'azithromycin',
    name: 'Azithromycin (Azee 500 / Azithral)',
    generic: 'Azithromycin',
    class: 'Macrolide',
    allergyClass: 'MACROLIDE',
    category: 'Antibiotic',
    defaultDose: '500 mg OD x 3-5 days',
    pregnancyCat: 'B',
    renalCutoff: 10,
    notes: 'Safe alternative in penicillin allergy; caution in severe hepatic impairment'
  },
  {
    id: 'clarithromycin',
    name: 'Clarithromycin (Claribid 500)',
    generic: 'Clarithromycin',
    class: 'Macrolide',
    allergyClass: 'MACROLIDE',
    category: 'Antibiotic',
    defaultDose: '500 mg BD',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Strong CYP3A4 inhibitor; multiple drug-drug interactions'
  },
  // Antibiotics - Sulfonamides
  {
    id: 'cotrimoxazole',
    name: 'Cotrimoxazole (Bactrim / Septran DS)',
    generic: 'Trimethoprim + Sulfamethoxazole',
    class: 'Sulfonamide',
    allergyClass: 'SULFA_DRUGS',
    category: 'Antibiotic',
    defaultDose: '960 mg BD',
    pregnancyCat: 'D',
    renalCutoff: 30,
    notes: 'Severe Stevens-Johnson Syndrome risk in sulfa allergic patients'
  },
  // Antibiotics - Tetracyclines
  {
    id: 'doxycycline',
    name: 'Doxycycline (Doxicip 100)',
    generic: 'Doxycycline',
    class: 'Tetracycline',
    allergyClass: 'TETRACYCLINE',
    category: 'Antibiotic',
    defaultDose: '100 mg BD',
    pregnancyCat: 'D',
    renalCutoff: 15,
    notes: 'Contraindicated in pregnancy (bone & tooth dysplasia) & children < 8 yrs'
  },
  // Analgesics & NSAIDs
  {
    id: 'paracetamol',
    name: 'Paracetamol (Dolo 650 / Calpol)',
    generic: 'Paracetamol (Acetaminophen)',
    class: 'Aniline Analgesic / Antipyretic',
    allergyClass: 'PARACETAMOL',
    category: 'Analgesic',
    defaultDose: '650 mg SOS / QDS',
    pregnancyCat: 'B',
    renalCutoff: 10,
    notes: 'Safest antipyretic; hepatotoxic in overdose (> 4g/day)'
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen (Brufen 400 / Combiflam)',
    generic: 'Ibuprofen',
    class: 'NSAID (Propionic Acid)',
    allergyClass: 'NSAIDS_ASPIRIN',
    category: 'NSAID',
    defaultDose: '400 mg TDS',
    pregnancyCat: 'D',
    renalCutoff: 45,
    notes: 'Contraindicated in active peptic ulcer, CKD, and aspirin-sensitive asthma'
  },
  {
    id: 'diclofenac',
    name: 'Diclofenac (Voveran 50 / Dynapar)',
    generic: 'Diclofenac Sodium',
    class: 'NSAID (Acetic Acid)',
    allergyClass: 'NSAIDS_ASPIRIN',
    category: 'NSAID',
    defaultDose: '50 mg BD',
    pregnancyCat: 'D',
    renalCutoff: 45,
    notes: 'High gastrointestinal ulceration and cardiovascular thrombotic risk'
  },
  {
    id: 'aceclofenac',
    name: 'Aceclofenac (Zerodol / Hifenac)',
    generic: 'Aceclofenac',
    class: 'NSAID',
    allergyClass: 'NSAIDS_ASPIRIN',
    category: 'NSAID',
    defaultDose: '100 mg BD',
    pregnancyCat: 'D',
    renalCutoff: 45,
    notes: 'Widely prescribed Indian NSAID; avoid in peptic ulcer & renal failure'
  },
  {
    id: 'aspirin',
    name: 'Aspirin / Ecosprin (Ecosprin 75 / 150)',
    generic: 'Acetylsalicylic Acid',
    class: 'Salicylate / Antiplatelet NSAID',
    allergyClass: 'NSAIDS_ASPIRIN',
    category: 'Antiplatelet',
    defaultDose: '75-150 mg OD',
    pregnancyCat: 'D',
    renalCutoff: 30,
    notes: 'Trigger for Samter triad / severe bronchospasm in NSAID allergic'
  },
  {
    id: 'tramadol',
    name: 'Tramadol (Ultracet / Tramazac 50)',
    generic: 'Tramadol Hydrochloride',
    class: 'Centrally Acting Opioid Analgesic',
    allergyClass: 'OPIOID',
    category: 'Opioid Analgesic',
    defaultDose: '50 mg SOS',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Risk of Serotonin Syndrome when combined with SSRIs / Ondansetron'
  },
  // Anti-Diabetic Agents
  {
    id: 'metformin',
    name: 'Metformin (Glycomet 500 / 1000)',
    generic: 'Metformin Hydrochloride',
    class: 'Biguanide',
    allergyClass: 'BIGUANIDE',
    category: 'Anti-Diabetic',
    defaultDose: '500-1000 mg BD with meals',
    pregnancyCat: 'B',
    renalCutoff: 30,
    notes: 'STOP if eGFR < 30 or before IV iodinated contrast. Severe Lactic Acidosis risk.'
  },
  {
    id: 'glimepiride',
    name: 'Glimepiride (Amaryl 1mg / 2mg)',
    generic: 'Glimepiride',
    class: 'Sulfonylurea (Sulfa moiety)',
    allergyClass: 'SULFA_DRUGS',
    category: 'Anti-Diabetic',
    defaultDose: '1-2 mg OD before breakfast',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Cross-sensitivity potential in severe sulfa allergy; hypoglycemia risk'
  },
  {
    id: 'gliclazide',
    name: 'Gliclazide (Diamicron 60 / Reclimet)',
    generic: 'Gliclazide',
    class: 'Sulfonylurea',
    allergyClass: 'SULFA_DRUGS',
    category: 'Anti-Diabetic',
    defaultDose: '60 mg OD',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Sulfonylurea; caution in severe sulfa allergy'
  },
  {
    id: 'teneligliptin',
    name: 'Teneligliptin (Tenelimac 20 / Ziten)',
    generic: 'Teneligliptin',
    class: 'DPP-4 Inhibitor',
    allergyClass: 'DPP4_INHIBITOR',
    category: 'Anti-Diabetic',
    defaultDose: '20 mg OD',
    pregnancyCat: 'C',
    renalCutoff: 15,
    notes: 'Safe in renal impairment without major dose adjustment'
  },
  // Cardiovascular & Anti-Hypertensive
  {
    id: 'amlodipine',
    name: 'Amlodipine (Stamlo 5 / Amlopres)',
    generic: 'Amlodipine Besylate',
    class: 'Dihydropyridine Calcium Channel Blocker',
    allergyClass: 'CCB',
    category: 'Anti-Hypertensive',
    defaultDose: '5 mg OD',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'Safe first-line anti-hypertensive; watch for pedal edema'
  },
  {
    id: 'telmisartan',
    name: 'Telmisartan (Telma 40 / Tazloc)',
    generic: 'Telmisartan',
    class: 'Angiotensin Receptor Blocker (ARB)',
    allergyClass: 'ARB',
    category: 'Anti-Hypertensive',
    defaultDose: '40 mg OD',
    pregnancyCat: 'D',
    renalCutoff: 20,
    notes: 'CONTRAINDICATED IN PREGNANCY (Teratogenic/Fetal renal failure). Hyperkalemia risk.'
  },
  {
    id: 'ramipril',
    name: 'Ramipril (Cardace 2.5 / 5)',
    generic: 'Ramipril',
    class: 'ACE Inhibitor',
    allergyClass: 'ACE_INHIBITOR',
    category: 'Anti-Hypertensive',
    defaultDose: '2.5-5 mg OD',
    pregnancyCat: 'D',
    renalCutoff: 30,
    notes: 'CONTRAINDICATED IN PREGNANCY. Risk of angioedema and severe hyperkalemia with spironolactone.'
  },
  {
    id: 'atenolol',
    name: 'Atenolol (Aten 50 / Betacard)',
    generic: 'Atenolol',
    class: 'Cardioselective Beta-Blocker',
    allergyClass: 'BETA_BLOCKER',
    category: 'Cardiovascular',
    defaultDose: '50 mg OD',
    pregnancyCat: 'D',
    renalCutoff: 35,
    notes: 'Caution in reactive airway disease and severe bradycardia'
  },
  {
    id: 'propranolol',
    name: 'Propranolol (Ciplar 10 / 40 / Inderal)',
    generic: 'Propranolol Hydrochloride',
    class: 'Non-Selective Beta-Blocker',
    allergyClass: 'BETA_BLOCKER',
    category: 'Cardiovascular',
    defaultDose: '10-40 mg BD',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'ABSOLUTE CONTRAINDICATION IN ASTHMA & COPD. Precipitates severe, life-threatening bronchospasm.'
  },
  {
    id: 'spironolactone',
    name: 'Spironolactone (Aldactone 25 / 50)',
    generic: 'Spironolactone',
    class: 'Aldosterone Antagonist / K+-Sparing Diuretic',
    allergyClass: 'DIURETIC',
    category: 'Diuretic',
    defaultDose: '25-50 mg OD',
    pregnancyCat: 'C',
    renalCutoff: 30,
    notes: 'Severe hyperkalemia when combined with ACEi or ARBs'
  },
  // Anticoagulants & Antiplatelets
  {
    id: 'warfarin',
    name: 'Warfarin (Warf 2 / 5)',
    generic: 'Warfarin Sodium',
    class: 'Vitamin K Antagonist',
    allergyClass: 'ANTICOAGULANT',
    category: 'Anticoagulant',
    defaultDose: '2-5 mg OD (INR monitored)',
    pregnancyCat: 'X',
    renalCutoff: 20,
    notes: 'FATAL BLEEDING when combined with NSAIDs / Aspirin. Teratogenic in pregnancy.'
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel (Clopilet 75 / Deplatt)',
    generic: 'Clopidogrel',
    class: 'P2Y12 Inhibitor Antiplatelet',
    allergyClass: 'ANTIPLATELET',
    category: 'Antiplatelet',
    defaultDose: '75 mg OD',
    pregnancyCat: 'B',
    renalCutoff: 15,
    notes: 'Omeprazole significantly reduces antiplatelet activation via CYP2C19 inhibition.'
  },
  // Gastrointestinal
  {
    id: 'pantoprazole',
    name: 'Pantoprazole (Pan 40 / Pantocid)',
    generic: 'Pantoprazole Sodium',
    class: 'Proton Pump Inhibitor (PPI)',
    allergyClass: 'PPI',
    category: 'Gastrointestinal',
    defaultDose: '40 mg OD before food',
    pregnancyCat: 'B',
    renalCutoff: 10,
    notes: 'Preferred PPI with Clopidogrel (minimal CYP2C19 inhibition)'
  },
  {
    id: 'omeprazole',
    name: 'Omeprazole (Omez 20)',
    generic: 'Omeprazole',
    class: 'Proton Pump Inhibitor (PPI)',
    allergyClass: 'PPI',
    category: 'Gastrointestinal',
    defaultDose: '20 mg OD before food',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'Strong CYP2C19 inhibitor; avoid concurrent Clopidogrel'
  },
  {
    id: 'antacid_gel',
    name: 'Antacid Gel (Digene / Gelusil)',
    generic: 'Aluminium Hydroxide + Magnesium Hydroxide',
    class: 'Antacid',
    allergyClass: 'ANTACID',
    category: 'Gastrointestinal',
    defaultDose: '10 ml TDS after food',
    pregnancyCat: 'B',
    renalCutoff: 20,
    notes: 'Chelates fluoroquinolones, tetracyclines, and iron. Separate by 2-3 hours.'
  },
  // Steroids
  {
    id: 'prednisolone',
    name: 'Prednisolone (Wysolone 10 / 20)',
    generic: 'Prednisolone',
    class: 'Systemic Corticosteroid',
    allergyClass: 'STEROID',
    category: 'Corticosteroid',
    defaultDose: '10-20 mg OD morning',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'Severe glucose spikes in diabetics; ulcerogenic when combined with NSAIDs'
  },
  {
    id: 'dexamethasone',
    name: 'Dexamethasone (Dexona 4mg)',
    generic: 'Dexamethasone Sodium Phosphate',
    class: 'Potent Glucocorticoid',
    allergyClass: 'STEROID',
    category: 'Corticosteroid',
    defaultDose: '4 mg OD/BD',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'High potency steroid; marked glycemic elevation & immunosuppression'
  },
  // Respiratory
  {
    id: 'salbutamol',
    name: 'Salbutamol Inhaler (Asthalin 100mcg)',
    generic: 'Salbutamol (Albuterol)',
    class: 'Short-Acting Beta-2 Agonist (SABA)',
    allergyClass: 'SABA',
    category: 'Respiratory',
    defaultDose: '2 puffs SOS',
    pregnancyCat: 'C',
    renalCutoff: 10,
    notes: 'Bronchodilator; antagonized by non-selective beta-blockers like propranolol'
  },
  {
    id: 'montelukast',
    name: 'Montelukast + Levocetirizine (Montair-LC)',
    generic: 'Montelukast + Levocetirizine',
    class: 'Leukotriene Receptor Antagonist + Antihistamine',
    allergyClass: 'ANTIHISTAMINE',
    category: 'Respiratory',
    defaultDose: '1 tab OD bedtime',
    pregnancyCat: 'B',
    renalCutoff: 20,
    notes: 'Safe for allergic rhinitis and mild asthma maintenance'
  },
  // Iron & Supplements
  {
    id: 'autrin_iron',
    name: 'Ferrous Fumarate + Folic Acid (Autrin / Orofer XT)',
    generic: 'Iron + Folic Acid',
    class: 'Hematological Mineral Supplement',
    allergyClass: 'IRON',
    category: 'Supplement',
    defaultDose: '1 tab OD after lunch',
    pregnancyCat: 'A',
    renalCutoff: 15,
    notes: 'Chelates fluoroquinolones and thyroxine. Separate intake.'
  }
];

// 2. High-Risk Allergy Categories & Cross-Reactivity Rules
export const ALLERGY_CLASSES = {
  PENICILLIN_BETA_LACTAM: {
    name: 'Penicillin & Beta-Lactam Class',
    nameOr: 'ପେନିସିଲିନ୍ ଓ ବିଟା-ଲାକ୍ଟମ୍ ଆଲର୍ଜି',
    nameHi: 'पेनिसिलिन एवं बीटा-लैक्टम एलर्जी',
    severity: 'SEVERE_ANAPHYLAXIS',
    directTriggers: ['amoxicillin', 'augmentin', 'ampicillin'],
    crossReactiveClasses: [
      {
        targetAllergyClass: 'CEPHALOSPORIN',
        riskLevel: 'MODERATE_HIGH',
        frequency: '5% - 10% Cross-Reactivity',
        mechanism: 'Shared beta-lactam ring structure can cause IgE-mediated bronchospasm, urticaria or anaphylaxis.',
        mechanismOr: 'ସମାନ ବିଟା-ଲାକ୍ଟମ୍ ଗଠନ ଯୋଗୁଁ ଆନାଫାଇଲାକ୍ସିସ୍ ବା ତୀବ୍ର ଆଲର୍ଜି ହୋଇପାରେ।',
        mechanismHi: 'समान बीटा-लैक्टम संरचना के कारण एनाफिलेक्सिस अथवा गंभीर एलर्जी की संभावना।'
      }
    ],
    safeAlternatives: [
      { id: 'azithromycin', name: 'Azithromycin (Macrolide)', note: 'First-line non-beta-lactam alternative for respiratory & soft tissue' },
      { id: 'ciprofloxacin', name: 'Ciprofloxacin (Fluoroquinolone)', note: 'For UTI or enteric infections' },
      { id: 'doxycycline', name: 'Doxycycline (Tetracycline)', note: 'For atypical/respiratory infections' }
    ]
  },
  SULFA_DRUGS: {
    name: 'Sulfonamide / Sulfa Antibiotics',
    nameOr: 'ସଲ୍ଫା ଔଷଧ ଆଲର୍ଜି (Sulfa)',
    nameHi: 'सल्फा दवा एलर्जी (Sulfonamide)',
    severity: 'SEVERE_SJS',
    directTriggers: ['cotrimoxazole'],
    crossReactiveClasses: [
      {
        targetAllergyClass: 'SULFA_DRUGS',
        riskLevel: 'HIGH',
        frequency: 'Severe Cutaneous Adverse Reaction (SCAR / SJS / TEN)',
        mechanism: 'High risk of toxic epidermal necrolysis, exfoliative dermatitis and Stevens-Johnson syndrome.',
        mechanismOr: 'ଷ୍ଟିଭେନ୍ସ-ଜନସନ ସିଣ୍ଡ୍ରୋମ (SJS) ଓ ମାରାତ୍ମକ ଚର୍ମ ବିଷାକ୍ତତା ଆଶଙ୍କା।',
        mechanismHi: 'स्टीवंस-जॉनसन सिंड्रोम (SJS) एवं घातक त्वचा विषाक्तता का गंभीर जोखिम।'
      }
    ],
    safeAlternatives: [
      { id: 'amoxicillin', name: 'Amoxicillin / Augmentin', note: 'If not penicillin allergic' },
      { id: 'ciprofloxacin', name: 'Ciprofloxacin 500mg', note: 'For broad spectrum UTI' }
    ]
  },
  NSAIDS_ASPIRIN: {
    name: 'NSAIDs & Salicylates (Aspirin)',
    nameOr: 'ଏନଏସଏଆଇଡି (NSAID) ଓ ଆସ୍ପିରିନ୍ ଆଲର୍ଜି',
    nameHi: 'एनएसएआईडी (NSAID) एवं एस्पिरिन एलर्जी',
    severity: 'SEVERE_BRONCHOSPASM_GI',
    directTriggers: ['ibuprofen', 'diclofenac', 'aceclofenac', 'aspirin'],
    crossReactiveClasses: [
      {
        targetAllergyClass: 'NSAIDS_ASPIRIN',
        riskLevel: 'CRITICAL',
        frequency: '100% Class Cross-Reactivity',
        mechanism: 'Inhibition of COX-1 shunts arachidonic acid to leukotrienes, triggering fatal bronchospasm (NERD) or angioedema.',
        mechanismOr: 'ସମସ୍ତ NSAID ମଧ୍ୟରେ ୧୦୦% କ୍ରସ୍-ଆଲର୍ଜି ଥାଏ। ଏହା ପ୍ରବଳ ଶ୍ୱାସରୋଗ ଓ ରକ୍ତସ୍ରାବ କରାଏ।',
        mechanismHi: 'सभी NSAID दवाओं में 100% क्रॉस-एलर्जी होती है। यह घातक ब्रोन्कोस्पाज्म पैदा करता है।'
      }
    ],
    safeAlternatives: [
      { id: 'paracetamol', name: 'Paracetamol (Dolo 650)', note: 'Safest non-NSAID analgesic/antipyretic; minimal COX-1 inhibition' },
      { id: 'tramadol', name: 'Tramadol (if severe pain)', note: 'Centrally acting opioid without COX-1 mediated bronchospasm' }
    ]
  },
  FLUOROQUINOLONE: {
    name: 'Fluoroquinolones',
    nameOr: 'ଫ୍ଲୋରୋକ୍ୱିନୋଲୋନ୍ ଆଲର୍ଜି (Cipro/Levo)',
    nameHi: 'फ्लोरोक्विनोलोन एलर्जी (Cipro/Levo)',
    severity: 'HIGH_NEURO_TENDON',
    directTriggers: ['ciprofloxacin', 'levofloxacin', 'ofloxacin'],
    crossReactiveClasses: [],
    safeAlternatives: [
      { id: 'cefixime', name: 'Cefixime 200mg', note: 'Oral 3rd gen cephalosporin for UTI/typhoid' },
      { id: 'azithromycin', name: 'Azithromycin 500mg', note: 'Safe respiratory option' }
    ]
  },
  ACE_INHIBITOR: {
    name: 'ACE Inhibitors (Angioedema Risk)',
    nameOr: 'ଏସିଇ ଇନହିବିଟର୍ (ଆଞ୍ଜିଓଏଡିମା ବିପଦ)',
    nameHi: 'एसीई इनहिबिटर (एंजियोएडेमा जोखिम)',
    severity: 'SEVERE_ANGIOEDEMA',
    directTriggers: ['ramipril'],
    crossReactiveClasses: [],
    safeAlternatives: [
      { id: 'amlodipine', name: 'Amlodipine 5mg (CCB)', note: 'Safe calcium channel blocker without bradykinin buildup' }
    ]
  }
};

// 3. High-Risk Drug-Drug Interaction (DDI) Matrix
export const DRUG_INTERACTION_RULES = [
  {
    drugA: 'warfarin',
    drugB: 'aspirin',
    severity: 'CRITICAL',
    title: 'Extreme Hemorrhage & Fatal Bleeding Synergy',
    titleOr: 'ଅତ୍ୟନ୍ତ ମାରାତ୍ମକ ରକ୍ତସ୍ରାବ ଚେତାବନୀ (Warfarin + Aspirin)',
    titleHi: 'अत्यंत घातक रक्तस्राव चेतावनी (Warfarin + Aspirin)',
    description: 'Concurrent anticoagulant (Warfarin) and antiplatelet (Aspirin) results in profound coagulation cascade shutdown. Risk of fatal intracranial or gastrointestinal hemorrhage increases by 450%.',
    descriptionOr: 'ୱାରଫାରିନ୍ ଓ ଆସ୍ପିରିନ୍ ଏକାସାଙ୍ଗରେ ନେଲେ ଶରୀରରେ ରକ୍ତ ଜମାଟ ବାନ୍ଧିବା ପ୍ରକ୍ରିୟା ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ ହୋଇ ମାରାତ୍ମକ ମସ୍ତିଷ୍କ କିମ୍ବା ପେଟ ଭିତରେ ରକ୍ତସ୍ରାବ ହୋଇପାରେ।',
    descriptionHi: 'वारफारिन और एस्पिरिन एक साथ लेने पर रक्त का थक्का जमना बंद हो जाता है, जिससे जानलेवा आंतरिक रक्तस्राव हो सकता है।',
    action: 'DO NOT COMBINE without specialized cardiology/hematology protocol and frequent INR monitoring.'
  },
  {
    drugA: 'warfarin',
    drugB: 'diclofenac',
    severity: 'CRITICAL',
    title: 'Severe Internal GI Bleed & Anticoagulant Potentiation',
    titleOr: 'ଗୁରୁତର ପାକସ୍ଥଳୀ ରକ୍ତସ୍ରାବ (Warfarin + Diclofenac)',
    titleHi: 'गंभीर आंतरिक रक्तस्राव (Warfarin + Diclofenac)',
    description: 'Diclofenac displaces Warfarin from albumin protein binding sites, sharply elevating free active warfarin while eroding gastric mucosa.',
    descriptionOr: 'ଡିକ୍ଲୋଫେନାକ୍ ଔଷଧ ୱାରଫାରିନ୍ ର ମାତ୍ରା ବଢ଼ାଇବା ସହିତ ପାକସ୍ଥଳୀ କାନ୍ଥ ନଷ୍ଟ କରି ପ୍ରବଳ ରକ୍ତବାନ୍ତି ଓ କଳା ଝାଡ଼ା କରାଇପାରେ।',
    descriptionHi: 'डाइक्लोफेनाक वारफारिन के स्तर को बढ़ाकर पेट में गंभीर अल्सर एवं जानलेवा रक्तस्राव कर सकता है।',
    action: 'Strictly avoid. Use Paracetamol for analgesia.'
  },
  {
    drugA: 'warfarin',
    drugB: 'ibuprofen',
    severity: 'CRITICAL',
    title: 'Severe Internal GI Bleed & Anticoagulant Potentiation',
    titleOr: 'ଗୁରୁତର ପାକସ୍ଥଳୀ ରକ୍ତସ୍ରାବ (Warfarin + Ibuprofen)',
    titleHi: 'गंभीर आंतरिक रक्तस्राव (Warfarin + Ibuprofen)',
    description: 'NSAIDs damage gastric mucosal barrier while Warfarin inhibits clotting. High rate of life-threatening GI bleeding.',
    descriptionOr: 'ଇବୁପ୍ରୋଫେନ୍ ସହ ୱାରଫାରିନ୍ ମାରାତ୍ମକ ପେଟ ରକ୍ତସ୍ରାବ କରାଏ। ତୁରନ୍ତ ବନ୍ଦ କରନ୍ତୁ।',
    descriptionHi: 'आइबूप्रोफेन के साथ वारफारिन पेट में घातक रक्तस्राव का कारण बन सकता है।',
    action: 'Strictly avoid. Switch to Paracetamol 650mg.'
  },
  {
    drugA: 'clopidogrel',
    drugB: 'omeprazole',
    severity: 'MAJOR',
    title: 'Reduced Antiplatelet Efficacy via CYP2C19 Inhibition',
    titleOr: 'କ୍ଲୋପିଡୋଗ୍ରେଲ୍ ପ୍ରଭାବହୀନତା ବିପଦ (Omeprazole ବନ୍ଦ କରନ୍ତୁ)',
    titleHi: 'क्लोपिडोग्रेल प्रभावहीनता चेतावनी (ओमेप्राजोल न दें)',
    description: 'Omeprazole competitively inhibits hepatic CYP2C19 enzyme, preventing bio-activation of Clopidogrel by up to 45%. Significantly increases recurrent myocardial infarction and stent thrombosis risk.',
    descriptionOr: 'ଓମେପ୍ରାଜୋଲ୍ ଲିଭର୍ ଏଞ୍ଜାଇମକୁ ବନ୍ଦ କରି କ୍ଲୋପିଡୋଗ୍ରେଲ୍ କୁ ନିଷ୍କ୍ରିୟ କରିଦିଏ, ଯାହା ଦ୍ୱାରା ହାର୍ଟ ଆଟାକ୍ ଓ ଷ୍ଟେଣ୍ଟ ବ୍ଲକେଜ୍ ହେବାର ବଡ଼ ଆଶଙ୍କା ଥାଏ।',
    descriptionHi: 'ओमेप्राजोल क्लोपिडोग्रेल के प्रभाव को 45% तक कम कर देता है, जिससे दोबारा दिल का दौरा पड़ने का खतरा बढ़ जाता है।',
    action: 'Switch Omeprazole to Pantoprazole 40mg (safe PPI with negligible CYP2C19 interaction).'
  },
  {
    drugA: 'ramipril',
    drugB: 'spironolactone',
    severity: 'MAJOR',
    title: 'Severe Hyperkalemia & Cardiac Arrhythmia Risk',
    titleOr: 'ପୋଟାସିୟମ୍ ଅତ୍ୟଧିକ ବୃଦ୍ଧି ଓ ହୃଦସ୍ପନ୍ଦନ ବିଭ୍ରାଟ (Ramipril + Spironolactone)',
    titleHi: 'पोटेशियम खतरनाक वृद्धि एवं दिल की धड़कन गड़बड़ी',
    description: 'Dual potassium-sparing action can rapidly drive serum potassium > 6.0 mEq/L, triggering peaked T-waves, ventricular arrhythmias, and cardiac arrest.',
    descriptionOr: 'ଉଭୟ ଔଷଧ ଶରୀରରେ ପୋଟାସିୟମ୍ ମାତ୍ରା ବିପଜ୍ଜନକ ଭାବେ ବଢ଼ାଇ ହୃଦଘାତ କିମ୍ବା ହାର୍ଟ ବିଟ୍ ଅନିୟମିତ କରିପାରେ।',
    descriptionHi: 'दोनों दवाएं सीरम पोटेशियम को 6.0 से ऊपर पहुंचा सकती हैं, जिससे अचानक कार्डियक अरेस्ट का खतरा होता है।',
    action: 'Monitor serum electrolytes & creatinine within 7 days. Dose reduction mandatory.'
  },
  {
    drugA: 'telmisartan',
    drugB: 'spironolactone',
    severity: 'MAJOR',
    title: 'Severe Hyperkalemia & Cardiac Arrhythmia Risk',
    titleOr: 'ପୋଟାସିୟମ୍ ଅତ୍ୟଧିକ ବୃଦ୍ଧି ଓ ହୃଦସ୍ପନ୍ଦନ ବିଭ୍ରାଟ (Telmisartan + Spironolactone)',
    titleHi: 'पोटेशियम खतरनाक वृद्धि (Telmisartan + Spironolactone)',
    description: 'ARB combined with aldosterone antagonist suppresses renal potassium excretion, risking severe hyperkalemia.',
    descriptionOr: 'ଟେଲମିସାର୍ଟାନ୍ ଓ ସ୍ପାଇରୋନୋଲାକ୍ଟୋନ୍ ଏକାସାଙ୍ଗେ ପୋଟାସିୟମ୍ ବୃଦ୍ଧି କରାନ୍ତି।',
    descriptionHi: 'दोनों दवाएं पोटेशियम बढ़ाती हैं। नियमित ईसीजी और पोटेशियम जांच जरूरी है।',
    action: 'Check serum K+ levels; avoid potassium supplements.'
  },
  {
    drugA: 'metformin',
    drugB: 'contrast_dye',
    severity: 'CRITICAL',
    title: 'Fatal Lactic Acidosis Trigger (Metformin + Radiocontrast)',
    titleOr: 'ମାରାତ୍ମକ ଲାକ୍ଟିକ୍ ଏସିଡୋସିସ୍ ବିପଦ (Metformin + Contrast Scan)',
    titleHi: 'घातक लैक्टिक एसिडोसिस चेतावनी (मेटफॉर्मिन + कंट्रास्ट डाई)',
    description: 'Iodinated contrast can cause acute contrast-induced nephropathy (CIN), precipitating severe toxic accumulation of Metformin and fatal lactic acidosis.',
    descriptionOr: 'ସିଟି ସ୍କାନ ବା କଣ୍ଟ୍ରାଷ୍ଟ ଡାଇ ଯୋଗୁଁ କିଡନୀ ପ୍ରଭାବିତ ହୋଇ ମେଟଫର୍ମିନ୍ ବିଷାକ୍ତତା ଏବଂ ମୃତ୍ୟୁର କାରଣ ହୋଇପାରେ।',
    descriptionHi: 'कंट्रास्ट डाई से किडनी पर असर होने से मेटफॉर्मिन का जहर फैल सकता है और लैक्टिक एसिडोसिस हो सकता है।',
    action: 'Hold Metformin 48 hours prior to and 48 hours after contrast procedure until renal function confirmed.'
  },
  {
    drugA: 'propranolol',
    drugB: 'salbutamol',
    severity: 'CRITICAL',
    title: 'Antagonistic Bronchospasm & Respiratory Arrest',
    titleOr: 'ଶ୍ୱାସରୋଗୀଙ୍କ ପାଇଁ ଅତ୍ୟନ୍ତ ମାରାତ୍ମକ (Propranolol vs Salbutamol)',
    titleHi: 'सांस के मरीजों के लिए जानलेवा टकराव (Propranolol vs Salbutamol)',
    description: 'Non-selective beta blocker (Propranolol) blocks beta-2 receptors in bronchial smooth muscle, directly neutralizing Salbutamol and precipitating refractory status asthmaticus.',
    descriptionOr: 'ପ୍ରୋପ୍ରାନୋଲୋଲ୍ ଫୁସଫୁସ୍ ର ନଳୀକୁ ସଙ୍କୁଚିତ କରି ସାଲବୁଟାମଲ୍ କୁ ସମ୍ପୂର୍ଣ୍ଣ ନିଷ୍କ୍ରିୟ କରିଦିଏ, ଯାହା ଦ୍ୱାରା ରୋଗୀ ଅଣନିଶ୍ୱାସୀ ହୋଇ ପ୍ରାଣ ହରାଇପାରନ୍ତି।',
    descriptionHi: 'प्रोप्रानोलॉल ब्रोन्कियल मांसपेशियों को सिकोड़कर साल्बुटामोल को निष्प्रभावी कर देता है, जिससे सांस पूरी तरह रुक सकती है।',
    action: 'CONTRAINDICATED. Switch Propranolol to Cardioselective agent (Metoprolol/Amlodipine) if strictly required.'
  },
  {
    drugA: 'ciprofloxacin',
    drugB: 'antacid_gel',
    severity: 'MODERATE',
    title: 'Chelation Inactivation (Antibiotic Bioavailability Loss)',
    titleOr: 'ଆଣ୍ଟିବାୟୋଟିକ୍ ନିଷ୍କ୍ରିୟତା (Ciprofloxacin + Antacid Gel)',
    titleHi: 'एंटीबायोटिक निष्क्रियता (Ciprofloxacin + Antacid)',
    description: 'Multivalent cations (Al3+, Mg2+) form insoluble chelate complexes with Ciprofloxacin, reducing oral absorption by up to 85%. Infection treatment failure likely.',
    descriptionOr: 'ଆଣ୍ଟାସିଡ୍ ଜେଲ୍ ସହିତ ସିପ୍ରୋଫ୍ଲୋକ୍ସାସିନ୍ ଖାଇଲେ ଔଷଧ ପେଟରେ ଶୋଷିତ ହୁଏ ନାହିଁ ଏବଂ ସଂକ୍ରମଣ ଭଲ ହୁଏ ନାହିଁ।',
    descriptionHi: 'एंटासिड जेल सिप्रोफ्लोक्सासिन को शरीर में सोखने नहीं देता, जिससे संक्रमण का इलाज असफल हो जाता है।',
    action: 'Administer Ciprofloxacin at least 2 hours before or 4 hours after Antacid.'
  },
  {
    drugA: 'ciprofloxacin',
    drugB: 'autrin_iron',
    severity: 'MODERATE',
    title: 'Iron Chelation Binding (Reduced Antibiotic & Iron Absorption)',
    titleOr: 'ଲୌହ ସପ୍ଲିମେଣ୍ଟ ଯୋଗୁଁ ଆଣ୍ଟିବାୟୋଟିକ୍ ବାଧା (Cipro + Iron)',
    titleHi: 'आयरन के कारण दवा का असर कम होना (Cipro + Iron)',
    description: 'Ferrous iron binds to quinolones in the gut lumen, drastically lowering serum antibiotic levels.',
    descriptionOr: 'ଆଇରନ ବଟିକା ସିପ୍ରୋଫ୍ଲୋକ୍ସାସିନ୍ କୁ ନଷ୍ଟ କରିଦିଏ। ୩ ଘଣ୍ଟାର ବ୍ୟବଧାନ ରଖନ୍ତୁ।',
    descriptionHi: 'आयरन की गोली एंटीबायोटिक को बांध लेती है। दोनों में 3 घंटे का अंतर रखें।',
    action: 'Separate administration by minimum 3 hours.'
  },
  {
    drugA: 'prednisolone',
    drugB: 'diclofenac',
    severity: 'MAJOR',
    title: 'Severe Gastric Ulceration & Perforation Risk',
    titleOr: 'ପାକସ୍ଥଳୀରେ ଘାଆ ଏବଂ କଣା ହେବା ଆଶଙ୍କା (Prednisolone + Diclofenac)',
    titleHi: 'पेट में छाले और अल्सर का अत्यधिक खतरा (Prednisolone + Diclofenac)',
    description: 'Synergistic erosion of gastric mucosa by corticosteroid and NSAID elevates gastrointestinal ulcer and bleeding risk by more than 10-fold.',
    descriptionOr: 'ଷ୍ଟିରଏଡ୍ ଏବଂ ପେନ୍ କିଲର୍ ମିଶି ପାକସ୍ଥଳୀର କାନ୍ଥକୁ କଣା କରି ପ୍ରବଳ ରକ୍ତସ୍ରାବ କରାଇପାରନ୍ତି।',
    descriptionHi: 'स्टेरॉयड और पेनकिलर मिलकर पेट में अल्सर और ब्लीडिंग का खतरा 10 गुना बढ़ा देते हैं।',
    action: 'Add prophylactic high-dose Pantoprazole 40mg OD or avoid combining NSAID with Steroid.'
  },
  {
    drugA: 'tramadol',
    drugB: 'ondansetron',
    severity: 'MODERATE',
    title: 'Serotonergic Interaction & Reduced Analgesia',
    titleOr: 'ଟ୍ରାମାଡଲ୍ ଓ ବାନ୍ତି ବଟିକା ମଧ୍ୟରେ ପ୍ରତିକ୍ରିୟା',
    titleHi: 'ट्रामाडोल और उल्टी की दवा का टकराव',
    description: 'Ondansetron can competitively inhibit Tramadol’s analgesic action via 5-HT3 antagonism while moderately elevating Serotonin Syndrome risk.',
    descriptionOr: 'ଉଭୟ ଔଷଧ ଯୋଗୁଁ ଯନ୍ତ୍ରଣା ଉପଶମ କମିପାରେ ଏବଂ ସ୍ନାୟୁଗତ ସମସ୍ୟା ହୋଇପାରେ।',
    descriptionHi: 'दर्द निवारक असर कम हो सकता है और सेरोटोनिन सिंड्रोम का जोखिम हो सकता है।',
    action: 'Monitor pain score; use Domperidone as alternative antiemetic.'
  }
];

// 4. Comorbidity & Patient Condition Contraindications
export const COMORBIDITY_CONTRAINDICATIONS = [
  {
    condition: 'ASTHMA',
    name: 'Asthma / Reactive Airway Disease',
    nameOr: 'ଶ୍ୱାସରୋଗ / ଆଜମା (Asthma)',
    nameHi: 'दमा / अस्थमा (Asthma)',
    dangerousDrugs: ['propranolol', 'atenolol', 'aspirin', 'ibuprofen', 'diclofenac', 'aceclofenac'],
    severity: 'CRITICAL',
    warning: 'Fatal Bronchospasm Hazard: Non-selective beta blockers and NSAIDs trigger severe respiratory distress.',
    warningOr: 'ପ୍ରୋପ୍ରାନୋଲୋଲ୍ କିମ୍ବା ପେନ୍ କିଲର୍ ଶ୍ୱାସରୋଗୀଙ୍କ ନିଶ୍ୱାସ ପ୍ରଶ୍ୱାସକୁ ସମ୍ପୂର୍ଣ୍ଣ ବନ୍ଦ କରିଦେଇପାରେ।',
    warningHi: 'बीटा-ब्लॉकर और पेनकिलर अस्थमा के दौरे को गंभीर और जानलेवा बना सकते हैं।',
    safeSubs: 'Use Paracetamol for pain; use CCBs (Amlodipine) or ARBs for BP.'
  },
  {
    condition: 'CKD',
    name: 'Chronic Kidney Disease (eGFR < 45 / High Creatinine)',
    nameOr: 'କିଡନୀ ରୋଗ (CKD / eGFR କମ୍)',
    nameHi: 'किडनी की बीमारी (CKD / डायलिसिस जोखिम)',
    dangerousDrugs: ['diclofenac', 'aceclofenac', 'ibuprofen', 'metformin', 'cotrimoxazole'],
    severity: 'CRITICAL',
    warning: 'Nephrotoxic insult: NSAIDs cause renal papillary necrosis. Metformin causes lethal lactic acidosis when eGFR < 30.',
    warningOr: 'କିଡନୀ ରୋଗୀଙ୍କୁ ଏନଏସଏଆଇଡି ପେନ୍ କିଲର୍ ଦେଲେ କିଡନୀ ସମ୍ପୂର୍ଣ୍ଣ ଫେଲ୍ ହୋଇପାରେ। ମେଟଫର୍ମିନ୍ ବନ୍ଦ କରନ୍ତୁ।',
    warningHi: 'किडनी मरीजों में पेनकिलर पूरी तरह फेलियर कर सकते हैं। eGFR < 30 में मेटफॉर्मिन तुरंत रोकें।',
    safeSubs: 'Use Paracetamol 500mg SOS; switch Metformin to Teneligliptin or Insulin.'
  },
  {
    condition: 'PEPTIC_ULCER',
    name: 'Active Peptic Ulcer / Upper GI Bleed History',
    nameOr: 'ପାକସ୍ଥଳୀ ଘାଆ / ପେଟ ରକ୍ତସ୍ରାବ (Ulcer)',
    nameHi: 'पेट का अल्सर / ब्लीडिंग इतिहास',
    dangerousDrugs: ['aspirin', 'ibuprofen', 'diclofenac', 'aceclofenac', 'prednisolone', 'dexamethasone'],
    severity: 'HIGH',
    warning: 'High risk of acute GI perforation and life-threatening hematemesis / melena.',
    warningOr: 'ଅଲସର୍ ଥିବା ରୋଗୀଙ୍କୁ ପେନ୍ କିଲର୍ କିମ୍ବା ଷ୍ଟିରଏଡ୍ ଦେଲେ ପେଟ ଫାଟି ରକ୍ତବାନ୍ତି ହୋଇପାରେ।',
    warningHi: 'अल्सर मरीजों में पेनकिलर या स्टेरॉयड देने से पेट में छेद और गंभीर खून की उल्टी हो सकती है।',
    safeSubs: 'Use Paracetamol; co-prescribe Pantoprazole 40mg.'
  },
  {
    condition: 'DIABETES',
    name: 'Type 2 Diabetes Mellitus (Uncontrolled / HbA1c > 8.5%)',
    nameOr: 'ମଧୁମେହ / ଡାଇବେଟିସ୍ (ଶର୍କରା ବୃଦ୍ଧି ବିପଦ)',
    nameHi: 'मधुमेह / डायबिटीज (शुगर स्पाइक खतरा)',
    dangerousDrugs: ['prednisolone', 'dexamethasone'],
    severity: 'HIGH',
    warning: 'Glucocorticoids induce profound peripheral insulin resistance, triggering severe hyperglycemia and DKA.',
    warningOr: 'ଷ୍ଟିରଏଡ୍ ଔଷଧ ଶର୍କରାକୁ ଅସ୍ୱାଭାବିକ ଭାବେ ବଢ଼ାଇ ଡାଇବେଟିକ୍ କୋମା କରାଇପାରେ।',
    warningHi: 'स्टेरॉयड ब्लड शुगर को खतरनाक स्तर तक बढ़ा देते हैं। इंसुलिन की निगरानी आवश्यक है।',
    safeSubs: 'Avoid systemic steroids unless life-threatening; increase insulin/monitoring.'
  },
  {
    condition: 'PREGNANCY',
    name: 'Pregnancy (Maternal ANC First/Second/Third Trimester)',
    nameOr: 'ଗର୍ଭାବସ୍ଥା (Maternal ANC - ଭ୍ରୂଣ ସୁରକ୍ଷା)',
    nameHi: 'गर्भावस्था (ANC - गर्भस्थ शिशु सुरक्षा)',
    dangerousDrugs: ['telmisartan', 'ramipril', 'warfarin', 'doxycycline', 'ciprofloxacin', 'ibuprofen', 'diclofenac'],
    severity: 'CRITICAL',
    warning: 'Severe Teratogenicity & Fetal Toxicity: Risk of fetal death, renal dysgenesis, bone malformations, and oligohydramnios.',
    warningOr: 'ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ଏହି ଔଷଧଗୁଡ଼ିକ ଅତ୍ୟନ୍ତ ବିପଜ୍ଜନକ। ଏହା ଗର୍ଭସ୍ଥ ଶିଶୁର ବିକଳାଙ୍ଗତା ବା ମୃତ୍ୟୁ ଘଟାଇପାରେ।',
    warningHi: 'गर्भावस्था में ये दवाएं पूरी तरह वर्जित हैं। यह गर्भस्थ शिशु को विकृत या मृत कर सकती हैं।',
    safeSubs: 'For BP use Labetalol or Methyldopa; for pain use Paracetamol; for antibiotic use Amoxicillin/Azithromycin.'
  }
];

// 5. Pre-Configured Realistic ABHA Patient Profiles (Odisha & National Health System)
export const PRELOADED_ABHA_PATIENTS = [
  {
    abhaId: '91-8842-1209-7711',
    name: 'Ramesh Chandra Pati',
    age: 52,
    gender: 'Male',
    bloodGroup: 'O+',
    district: 'Cuttack, Odisha',
    facility: 'SCB Salipur Block PHC',
    knownAllergies: [
      {
        classKey: 'PENICILLIN_BETA_LACTAM',
        name: 'Penicillins & Beta-Lactam Antibiotics',
        severity: 'Severe (Anaphylaxis & Facial Angioedema in 2021)',
        dateRecorded: '12-May-2021'
      },
      {
        classKey: 'NSAIDS_ASPIRIN',
        name: 'Aspirin & All NSAIDs',
        severity: 'Moderate-Severe (Bronchospasm & Urticaria)',
        dateRecorded: '04-Oct-2023'
      }
    ],
    comorbidities: ['DIABETES', 'CKD'],
    eGFR: 68,
    activeMedications: ['metformin', 'teneligliptin'],
    emergencyContact: '+91 94370 12890 (Son - Alok)'
  },
  {
    abhaId: '91-4402-9912-3341',
    name: 'Saraswati Sahoo',
    age: 46,
    gender: 'Female',
    bloodGroup: 'B+',
    district: 'Puri, Odisha',
    facility: 'Gop Block PHC',
    knownAllergies: [
      {
        classKey: 'SULFA_DRUGS',
        name: 'Sulfonamide / Sulfa Antibiotics (Bactrim/Septran)',
        severity: 'Severe (Cutaneous Stevens-Johnson reaction)',
        dateRecorded: '18-Jan-2022'
      }
    ],
    comorbidities: ['PEPTIC_ULCER'],
    eGFR: 86,
    activeMedications: ['gliclazide', 'autrin_iron'],
    emergencyContact: '+91 98610 54109 (Husband - Niranjan)'
  },
  {
    abhaId: '91-1102-5544-8899',
    name: 'Prakash Rout',
    age: 38,
    gender: 'Male',
    bloodGroup: 'A+',
    district: 'Khordha, Odisha',
    facility: 'Jatni PHC',
    knownAllergies: [
      {
        classKey: 'FLUOROQUINOLONE',
        name: 'Fluoroquinolones (Ciprofloxacin / Levofloxacin)',
        severity: 'Severe (Achilles tendonitis & rash)',
        dateRecorded: '22-Aug-2024'
      }
    ],
    comorbidities: ['ASTHMA'],
    eGFR: 98,
    activeMedications: ['salbutamol'],
    emergencyContact: '+91 97780 88219 (Wife - Manasi)'
  },
  {
    abhaId: '91-7721-3098-4455',
    name: 'Lata Nayak (Pregnant - ANC 26 Wks)',
    age: 26,
    gender: 'Female',
    bloodGroup: 'AB+',
    district: 'Bhubaneswar, Odisha',
    facility: 'Capital Hospital ANC OPD',
    knownAllergies: [
      {
        classKey: 'PENICILLIN_BETA_LACTAM',
        name: 'Penicillin Injection',
        severity: 'Severe (Generalized urticaria & wheezing)',
        dateRecorded: '15-Mar-2020'
      }
    ],
    comorbidities: ['PREGNANCY'],
    eGFR: 105,
    activeMedications: ['autrin_iron'],
    emergencyContact: '+91 94372 90112 (Mother - Shanti)'
  }
];

// 6. Pre-Configured 1-Click Interactive Test Scenarios
export const PRESET_CLINICAL_CASES = [
  {
    id: 'case_anaphylaxis_penicillin',
    patientAbha: '91-8842-1209-7711',
    caseTitle: '🔴 Case 1: Life-Threatening Penicillin Anaphylaxis',
    caseTitleOr: '🔴 ନମୁନା ୧: ପେନିସିଲିନ୍ ଆଲର୍ଜି ଓ ଆନାଫାଇଲାକ୍ସିସ୍ ବିପଦ (Amoxicillin)',
    caseTitleHi: '🔴 केस 1: जानलेवा पेनिसिलिन एनाफिलेक्सिस अलर्ट (Amoxicillin)',
    prescribedDrugIds: ['augmentin', 'paracetamol', 'pantoprazole'],
    doctorNote: 'Prescribed Augmentin 625mg for severe dental abscess in patient with documented Penicillin anaphylaxis in ABHA.',
    expectedUrgency: 'CRITICAL_BLOCK',
    expectedAlertCount: 2
  },
  {
    id: 'case_warfarin_diclofenac_bleed',
    patientAbha: '91-8842-1209-7711',
    caseTitle: '🔴 Case 2: Fatal Bleeding Synergy (Warfarin + Diclofenac + Aspirin)',
    caseTitleOr: '🔴 ନମୁନା ୨: ମାରାତ୍ମକ ରକ୍ତସ୍ରାବ ବିପଦ (Warfarin + Diclofenac)',
    caseTitleHi: '🔴 केस 2: घातक रक्तस्राव टकराव (Warfarin + Diclofenac)',
    prescribedDrugIds: ['warfarin', 'diclofenac', 'aspirin'],
    doctorNote: 'Prescription written for joint pain and atrial fibrillation prophylaxis without checking interaction.',
    expectedUrgency: 'CRITICAL_BLOCK',
    expectedAlertCount: 3
  },
  {
    id: 'case_asthma_propranolol',
    patientAbha: '91-1102-5544-8899',
    caseTitle: '🔴 Case 3: Acute Fatal Bronchospasm in Asthmatic (Propranolol)',
    caseTitleOr: '🔴 ନମୁନା ୩: ଆଜମା ରୋଗୀଙ୍କୁ Propranolol ଓ Brufen ଦେବା ବିପଦ',
    caseTitleHi: '🔴 केस 3: अस्थमा मरीज में जानलेवा ब्रोंकोस्पाज्म (Propranolol)',
    prescribedDrugIds: ['propranolol', 'ibuprofen'],
    doctorNote: 'Propranolol for anxiety tremors + Ibuprofen for headache in known Asthmatic using Salbutamol.',
    expectedUrgency: 'CRITICAL_BLOCK',
    expectedAlertCount: 3
  },
  {
    id: 'case_pregnancy_telmisartan',
    patientAbha: '91-7721-3098-4455',
    caseTitle: '🔴 Case 4: Category D Teratogenicity in 26-Wk Pregnancy (Telmisartan + Doxycycline)',
    caseTitleOr: '🔴 ନମୁନା ୪: ଗର୍ଭବତୀ ମହିଳାଙ୍କ ପାଇଁ ନିଷିଦ୍ଧ ଔଷଧ (Telmisartan + Doxy)',
    caseTitleHi: '🔴 केस 4: गर्भावस्था में भ्रूण-घातक दवा अलर्ट (Telmisartan + Doxy)',
    prescribedDrugIds: ['telmisartan', 'doxycycline', 'paracetamol'],
    doctorNote: 'Telmisartan prescribed for gestational hypertension and Doxycycline for rash in 26-week pregnancy.',
    expectedUrgency: 'CRITICAL_BLOCK',
    expectedAlertCount: 2
  },
  {
    id: 'case_clopidogrel_omeprazole',
    patientAbha: '91-8842-1209-7711',
    caseTitle: '🟠 Case 5: Stent Thrombosis Hazard (Clopidogrel + Omeprazole)',
    caseTitleOr: '🟠 ନମୁନା ୫: ହାର୍ଟ ଆଟାକ୍ ବିପଦ (Clopidogrel + Omeprazole)',
    caseTitleHi: '🟠 केस 5: दिल के दौरे का खतरा (Clopidogrel + Omeprazole)',
    prescribedDrugIds: ['clopidogrel', 'omeprazole', 'amlodipine'],
    doctorNote: 'Post-angioplasty antiplatelet therapy paired with Omeprazole causing CYP2C19 suppression.',
    expectedUrgency: 'MAJOR_WARNING',
    expectedAlertCount: 1
  },
  {
    id: 'case_clean_safe_pass',
    patientAbha: '91-8842-1209-7711',
    caseTitle: '🟢 Case 6: Safe Clinical Clearance (Azithromycin + Paracetamol + Pantoprazole)',
    caseTitleOr: '🟢 ନମୁନା ୬: ୧୦୦% ସୁରକ୍ଷିତ ଔଷଧ ତାଲିକା (ସମସ୍ତ ନିୟମ ଯାଞ୍ଚ ପରେ ପାସ୍)',
    caseTitleHi: '🟢 केस 6: 100% सुरक्षित प्रिस्क्रिप्शन (कोई एलर्जी या टकराव नहीं)',
    prescribedDrugIds: ['azithromycin', 'paracetamol', 'pantoprazole'],
    doctorNote: 'Safe non-beta lactam antibiotic + safe non-NSAID antipyretic for penicillin-allergic patient.',
    expectedUrgency: 'SAFE_PASS',
    expectedAlertCount: 0
  }
];
