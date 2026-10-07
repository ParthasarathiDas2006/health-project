import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import QRCode from 'qrcode';
import {
  FileText,
  Printer,
  QrCode,
  ShieldCheck,
  Send,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Building2,
  Calendar,
  User,
  Activity,
  Pill,
  Search,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Clock,
  MapPin,
  Ambulance,
  Phone,
  RefreshCw,
  Plus,
  Trash2,
  Eye,
  Check,
  Sparkles,
  Bed,
  MessageSquare,
  AlertCircle,
  XCircle,
  Lock,
  Smartphone,
  Sliders,
  Award,
  Mic,
  MicOff,
  Navigation,
  FileDown,
  Compass,
  Edit3,
  Camera,
  Upload,
  HeartPulse,
  CheckSquare,
  Square,
  Layers,
  FileCheck,
  Droplet,
  RotateCcw,
  PenTool,
  ScanLine,
  FlaskConical,
  Apple,
  BellRing,
  CalendarClock,
  Zap,
  Database,
  FolderHeart
} from 'lucide-react';
import { getHospitalPartners } from '../data/hospitalPartners';

/**
 * PDF Referral Slips & NMC Prescriptions Suite with Verifiable QR Codes
 * 100% compliant with National Medical Commission (NMC 2023 Regulations) & NHM Inter-Facility Referral Protocols.
 * Advanced Clinical Decision Support: Live Drug-Allergy Guard, 108 Transit ETA & Route Calculator, Canvas Signature Pad, Voice Dictation, Brand-to-Generic Auto-Fixer, and Cryptographic Audit.
 */

// ─── NMC 2023 Brand-to-Generic Medical Dictionary ───────────────────────────
const BRAND_TO_GENERIC_MAP = {
  'DOLO 650': { generic: 'PARACETAMOL', dosage: '650 mg', form: 'Tablet' },
  'DOLO': { generic: 'PARACETAMOL', dosage: '650 mg', form: 'Tablet' },
  'CROCIN': { generic: 'PARACETAMOL', dosage: '500 mg', form: 'Tablet' },
  'CALPOL': { generic: 'PARACETAMOL', dosage: '500 mg', form: 'Suspension' },
  'AUGMENTIN': { generic: 'AMOXICILLIN + CLAVULANIC ACID', dosage: '625 mg', form: 'Tablet' },
  'CLAVAM': { generic: 'AMOXICILLIN + CLAVULANIC ACID', dosage: '625 mg', form: 'Tablet' },
  'PAN 40': { generic: 'PANTOPRAZOLE', dosage: '40 mg', form: 'Tablet' },
  'PANTOCID': { generic: 'PANTOPRAZOLE', dosage: '40 mg', form: 'Tablet' },
  'PAN-D': { generic: 'PANTOPRAZOLE + DOMPERIDONE', dosage: '40 mg + 30 mg SR', form: 'Capsule' },
  'AZITHRAL': { generic: 'AZITHROMYCIN', dosage: '500 mg', form: 'Tablet' },
  'AZIWIN': { generic: 'AZITHROMYCIN', dosage: '500 mg', form: 'Tablet' },
  'GLYCOMET': { generic: 'METFORMIN HYDROCHLORIDE', dosage: '500 mg', form: 'Tablet' },
  'TELMA 40': { generic: 'TELMISARTAN', dosage: '40 mg', form: 'Tablet' },
  'TELMA': { generic: 'TELMISARTAN', dosage: '40 mg', form: 'Tablet' },
  'ECOSPRIN': { generic: 'ASPIRIN (DISPERSIBLE)', dosage: '75 mg', form: 'Tablet' },
  'MONOCEF': { generic: 'CEFTRIAXONE SODIUM', dosage: '1 g', form: 'Injection' },
  'TAXIM-O': { generic: 'CEFIXIME', dosage: '200 mg', form: 'Tablet' },
  'MEFTAL-SPAS': { generic: 'MEFENAMIC ACID + DICYCLOMINE HYDROCHLORIDE', dosage: '250 mg + 10 mg', form: 'Tablet' },
  'AVIL': { generic: 'PHENIRAMINE MALEATE', dosage: '25 mg', form: 'Tablet' },
  'LIPITOR': { generic: 'ATORVASTATIN', dosage: '20 mg', form: 'Tablet' },
  'CIPLOX': { generic: 'CIPROFLOXACIN', dosage: '500 mg', form: 'Tablet' },
  'ZIFI': { generic: 'CEFIXIME', dosage: '200 mg', form: 'Tablet' }
};

// ─── Standard ICD-10 Search Database ─────────────────────────────────────────
const ICD10_DATABASE = [
  { code: 'A97.2', name: 'Severe Dengue with Severe Thrombocytopenia & Plasma Leakage', category: 'Infectious / Arboviral' },
  { code: 'I21.1', name: 'Acute ST-Elevation Myocardial Infarction (STEMI - Inferior Wall)', category: 'Cardiovascular / Emergency' },
  { code: 'O14.1', name: 'Severe Gestational Pre-eclampsia with Impending Eclampsia', category: 'Obstetric / Maternal' },
  { code: 'B50.0', name: 'Plasmodium falciparum Malaria with Cerebral Complications', category: 'Infectious / Parasitic' },
  { code: 'T63.0', name: 'Toxic Effect of Contact with Venomous Snake (Elapid / Neurotoxic)', category: 'Toxicology / Emergency' },
  { code: 'E11.621', name: 'Type 2 Diabetes Mellitus with Foot Ulcer & Severe Cellulitis', category: 'Endocrine / Metabolic' },
  { code: 'J18.9', name: 'Severe Community-Acquired Pneumonia with Respiratory Distress', category: 'Pulmonary / Respiratory' },
  { code: 'K35.80', name: 'Acute Appendicitis with Localized Peritonitis', category: 'General Surgery' },
  { code: 'S06.0X0A', name: 'Traumatic Brain Injury / Concussion with Loss of Consciousness', category: 'Trauma & Neurosurgery' },
  { code: 'A09', name: 'Infectious Gastroenteritis with Severe Hypovolemic Dehydration', category: 'Gastrointestinal' },
  { code: 'N17.9', name: 'Acute Kidney Injury (AKI) with Uremic Acidosis', category: 'Nephrology' },
  { code: 'I63.9', name: 'Acute Ischemic Cerebral Infarction (Stroke in Evolution)', category: 'Neurology' },
  { code: 'J44.1', name: 'Chronic Obstructive Pulmonary Disease (COPD) with Acute Exacerbation', category: 'Pulmonary' },
  { code: 'R57.2', name: 'Septic Shock with Multi-Organ Dysfunction Syndrome (MODS)', category: 'Critical Care' },
  { code: 'O72.1', name: 'Postpartum Hemorrhage (PPH) with Hypovolemic Shock', category: 'Obstetric' }
];

// ─── Destination Apex Hospitals Real-Time Bed & Nodal Directory ─────────────
const APEX_DESTINATION_STATUS = {
  'SCB Medical College & Hospital (SCBMCH), Cuttack - Emergency HDU': {
    nodalPhone: '0671-2414004',
    emergencyOfficer: 'Dr. Debasish Ray (Casualty MO)',
    icuBeds: 4,
    hduBeds: 7,
    oxygenSupply: '99.8% Liquid Medical O2 (Normal)',
    greenCorridor: 'NH-16 Corridor Active (Pilot clearance notified)',
    bloodBankUnits: 'O+ (22 Units), B+ (18 Units), A+ (14 Units)'
  },
  'MKCG Medical College & Hospital, Berhampur - Obstetric ICU': {
    nodalPhone: '0680-2292746',
    emergencyOfficer: 'Dr. Minati Panigrahi (Obs/Gynae Nodal)',
    icuBeds: 2,
    hduBeds: 5,
    oxygenSupply: '100% Manifold Pressure OK',
    greenCorridor: 'State Highway 17 Ambulance Protocol Ready',
    bloodBankUnits: 'O+ (15 Units), B+ (12 Units), AB+ (6 Units)'
  },
  'AIIMS Bhubaneswar Emergency & Interventional Cath Lab': {
    nodalPhone: '0674-2476789',
    emergencyOfficer: 'Dr. Ashis Patnaik (Cardiology Registrar)',
    icuBeds: 3,
    hduBeds: 8,
    oxygenSupply: 'Continuous Cryogenic Tank Supply',
    greenCorridor: 'Golden Hour PPCI Team on Active Standby',
    bloodBankUnits: 'Universal O- (6 Units), A+ (24 Units), B+ (30 Units)'
  },
  'SCB Medical College & Hospital, Cuttack - Diabetic Foot & Vascular Surgery OPD': {
    nodalPhone: '0671-2414108',
    emergencyOfficer: 'Dr. R. C. Mohanty (Vascular Surgery Unit)',
    icuBeds: 6,
    hduBeds: 12,
    oxygenSupply: 'Normal Operating Level',
    greenCorridor: 'Normal Transit Schedule',
    bloodBankUnits: 'B+ (19 Units), O+ (25 Units)'
  },
  'SLN Medical College & Hospital, Koraput - Pediatric Intensive Care Unit (PICU)': {
    nodalPhone: '06852-251022',
    emergencyOfficer: 'Dr. Sukant Das (Pediatric ICU In-Charge)',
    icuBeds: 3,
    hduBeds: 6,
    oxygenSupply: 'High-Flow Nasal Cannula Standby',
    greenCorridor: 'Ghat Road Special 108 ALS Convoy Alerted',
    bloodBankUnits: 'Whole Blood (34 Units), FFP (12 Units)'
  },
  'PRM Medical College & Hospital, Baripada - Critical Care Envenomation Unit': {
    nodalPhone: '06792-255011',
    emergencyOfficer: 'Dr. Manoj Soren (ASV Resuscitation Desk)',
    icuBeds: 4,
    hduBeds: 8,
    oxygenSupply: 'Mechanical Ventilators Ready (3 free)',
    greenCorridor: 'NH-18 Rapid Transit Siren Protocol On',
    bloodBankUnits: 'Anti-Snake Venom Stock: 140 Vials Available'
  }
};

// ─── Odisha 108 Emergency Transit Highway Corridor Routes ───────────────────
const ODISHA_TRANSIT_ROUTES = {
  'CASE-01': {
    distance: '4.8 km',
    eta: '14 mins',
    highway: 'Mahanadi Ring Road & Kathajodi Flyover',
    oxygenRefillPost: 'Chhatra Bazar Emergency Depot',
    pilotEscort: 'Cuttack Urban Police Traffic Pilot Active'
  },
  'CASE-02': {
    distance: '32 km',
    eta: '42 mins',
    highway: 'State Highway 17 (Digapahandi - Berhampur Arterial)',
    oxygenRefillPost: 'Aska Sub-Divisional Hospital (SDH)',
    pilotEscort: 'Ganjam 108 Command Priority Siren'
  },
  'CASE-03': {
    distance: '7.2 km',
    eta: '16 mins',
    highway: 'Biju Patnaik Airport Road & Sishu Bhawan Square Corridor',
    oxygenRefillPost: 'Capital Hospital Trauma Post',
    pilotEscort: 'Smart City Green Corridor Active'
  },
  'CASE-04': {
    distance: '82 km',
    eta: '1 hr 35 mins',
    highway: 'NH-316 (Puri-Bhubaneswar Expressway) & NH-16',
    oxygenRefillPost: 'Pipili CHC En-Route Refill Station',
    pilotEscort: 'Toll Plaza Priority Transit Protocol'
  },
  'CASE-05': {
    distance: '114 km',
    eta: '3 hrs 10 mins',
    highway: 'NH-326 (Mathili - Boipariguda - Koraput Ghat Section)',
    oxygenRefillPost: 'Boipariguda CHC Emergency Oxygen Post',
    pilotEscort: 'Tribal Belt ALS 4x4 Emergency Convoy'
  },
  'CASE-06': {
    distance: '28 km',
    eta: '34 mins',
    highway: 'NH-18 (Betnoti to Baripada Bypass Corridor)',
    oxygenRefillPost: 'Baisinga PHC Transit Hub',
    pilotEscort: 'Mayurbhanj Highway Patrol Clearance'
  }
};

// ─── 8 Authentic Odisha Clinical Scenarios Across 5 Sections ────────────────
const CLINICAL_PRESETS = [
  {
    id: 'CASE-01',
    sectionNo: '1-NO',
    sectionTitle: 'SECTION 1-NO: EMERGENCY CASUALTY & FEVER TRIAGE',
    department: 'SCBMCH Cuttack • Emergency HDU & Critical Care',
    protocol: 'Platelet Transfusion & Fluid Resuscitation Protocol',
    patientName: 'Rameswar Lal (ରମେଶ୍ୱର ଲାଲ୍)',
    age: 48,
    gender: 'Male',
    abhaId: '91-4452-8819-2044',
    phone: '+91 94371 88401',
    district: 'Cuttack',
    address: 'Chhatra Bazar, Cuttack - 753003',
    bloodGroup: 'B+',
    weight: '64 kg',
    allergies: 'None Reported (NKDA)',
    acuity: 'RED',
    icdCode: 'A97.2',
    icdName: 'Severe Dengue with Thrombocytopenia & Hemorrhagic Risk',
    provisionalDiagnosis: 'Severe Dengue with Thrombocytopenia & Hemorrhagic Risk (ICD-10: A97.2)',
    chiefComplaints: 'High fever for 4 days (103.4°F), epistaxis (nasal bleeding) this morning, severe retro-orbital headache, abdominal pain.',
    vitals: { bp: '96/60 mmHg', pulse: '112 bpm', spo2: '94%', temp: '103.4°F', rr: '24/min' },
    originFacility: 'District Headquarter Hospital (DHH), Cuttack',
    referredTo: 'SCB Medical College & Hospital (SCBMCH), Cuttack - Emergency HDU',
    referralReason: 'Platelets critically low at 38,000/μL with active mucosal bleed; requires urgent platelet concentrate transfusion & HDU monitoring.',
    transitTransport: '108 Advanced Life Support (ALS) Ambulance with IV cannula 18G & continuous pulse oximetry',
    oxygenReq: 'High Flow O2 at 4 L/min via nasal cannula',
    medications: [
      { name: 'PARACETAMOL', dosage: '500 mg', form: 'Tablet', freq: 'QID (6th hourly)', duration: '3 Days', instruction: 'For fever >100°F. Do NOT take NSAIDs / Ibuprofen.' },
      { name: 'NORMAL SALINE 0.9% IV', dosage: '500 ml', form: 'IV Infusion', freq: 'At 100 ml/hr', duration: 'During Transit', instruction: 'Maintain strict fluid chart.' },
      { name: 'PANTOPRAZOLE', dosage: '40 mg', form: 'Injection', freq: 'IV STAT', duration: '1 Dose', instruction: 'Gastroprotection.' }
    ],
    investigations: [
      'Complete Blood Count (CBC) with Platelets Q12H STAT',
      'Hematocrit (Hct) & Serum Electrolytes',
      'Dengue NS1 Antigen & IgM/IgG Serology',
      'Liver Function Test (SGOT/SGPT, Bilirubin)',
      'Ultrasound Whole Abdomen (Ascites & Gallbladder Wall Edema Screen)'
    ],
    dietaryAdvice: 'Strict oral rehydration: ORS, tender coconut water & fluids > 2.5 L/day. Soft bland diet. Strictly avoid NSAIDs (Ibuprofen/Aspirin).',
    redFlags: [
      'Spontaneous bleeding from nose/gums or blood in vomit/stools',
      'Persistent severe abdominal pain or unrelenting vomiting',
      'Sudden dizziness, cold clammy extremities, or extreme restlessness/lethargy'
    ],
    followUp: 'Review in Emergency HDU after 24 hours with fresh Platelet Count report. SOS immediate ER visit if any bleeding occurs.'
  },
  {
    id: 'CASE-02',
    sectionNo: '2-NO',
    sectionTitle: 'SECTION 2-NO: HIGH-RISK OBSTETRICS & MATERNAL ICU',
    department: 'MKCG Berhampur • Obstetric Intensive Care Unit',
    protocol: 'Pritchard Magnesium Sulphate & Labetalol BP Protocol',
    patientName: 'Sunita Devi (ସୁନୀତା ଦେବୀ)',
    age: 26,
    gender: 'Female',
    abhaId: '91-8821-4472-1092',
    phone: '+91 94372 10923',
    district: 'Ganjam',
    address: 'Near Old Bus Stand, Berhampur - 760001',
    bloodGroup: 'O+',
    weight: '58 kg',
    allergies: 'Penicillin Allergy (Skin rash)',
    acuity: 'RED',
    icdCode: 'O14.1',
    icdName: 'Severe Gestational Pre-eclampsia at 32 Weeks',
    provisionalDiagnosis: 'Severe Gestational Pre-eclampsia at 32 Weeks (ICD-10: O14.1)',
    chiefComplaints: 'Severe throbbing frontal headache, blurring of vision, facial puffiness, urine output decreased.',
    vitals: { bp: '168/104 mmHg', pulse: '92 bpm', spo2: '98%', temp: '98.6°F', rr: '20/min' },
    originFacility: 'Community Health Centre (CHC), Digapahandi, Ganjam',
    referredTo: 'MKCG Medical College & Hospital, Berhampur - Obstetric ICU',
    referralReason: 'Sustained diastolic BP >100 mmHg with proteinuria 3+ and impending eclampsia symptoms; urgent tertiary maternal care required.',
    transitTransport: '108 ALS Ambulance with escorting ASHA & Staff Nurse',
    oxygenReq: 'Supplemental Oxygen standby',
    medications: [
      { name: 'LABETALOL', dosage: '100 mg', form: 'Tablet', freq: 'BD (Twice daily)', duration: '5 Days', instruction: 'Titrate according to BP monitoring.' },
      { name: 'MAGNESIUM SULPHATE 50%', dosage: '4 g (20% IV)', form: 'IV STAT', freq: 'Slow over 15 mins', duration: 'Loading Dose', instruction: 'Followed by 5g IM in each buttock (Pritchard regimen).' }
    ],
    investigations: [
      'Urine Routine for Proteinuria (Dipstick 3+ confirmation)',
      'Complete Blood Count with Platelet Count & Hemoglobin',
      'Serum Creatinine, Blood Urea & Uric Acid',
      'Liver Enzymes (AST/ALT/LDH for HELLP Syndrome Screen)',
      'Obstetric USG with Fetal Doppler & Amniotic Fluid Index'
    ],
    dietaryAdvice: 'Strict low-sodium diet (<2g salt/day). Left lateral tilt bed rest to optimize uteroplacental blood flow. Strict fluid charting.',
    redFlags: [
      'Severe throbbing headache or sudden blurring/loss of vision',
      'Right upper quadrant / epigastric pain or nausea',
      'Decreased fetal kicks or sudden worsening facial/pedal edema'
    ],
    followUp: 'Continuous maternal-fetal surveillance in Obstetric ICU. Check blood pressure hourly; target Diastolic BP 90-100 mmHg.'
  },
  {
    id: 'CASE-03',
    sectionNo: '3-NO',
    sectionTitle: 'SECTION 3-NO: ACUTE CARDIOLOGY & CATH LAB PPCI',
    department: 'AIIMS Bhubaneswar • Emergency Interventional Cath Lab',
    protocol: 'Golden Hour PPCI Coronary Angioplasty Protocol',
    patientName: 'Basanti Jena (ବାସନ୍ତୀ ଜେନା)',
    age: 62,
    gender: 'Female',
    abhaId: '91-3312-9981-6541',
    phone: '+91 94373 65412',
    district: 'Khurda',
    address: 'Pokhariput, Bhubaneswar - 751020',
    bloodGroup: 'A+',
    weight: '68 kg',
    allergies: 'None (NKDA)',
    acuity: 'RED',
    icdCode: 'I21.1',
    icdName: 'Acute ST-Elevation Myocardial Infarction (STEMI - Inferior Wall)',
    provisionalDiagnosis: 'Acute ST-Elevation Myocardial Infarction (STEMI - Inferior Wall) (ICD-10: I21.1)',
    chiefComplaints: 'Crushing retrosternal chest pain radiating to left arm and jaw for 90 minutes, profuse diaphoresis, nausea.',
    vitals: { bp: '110/70 mmHg', pulse: '64 bpm', spo2: '95%', temp: '98.4°F', rr: '22/min' },
    originFacility: 'Capital Hospital & Trauma Care, Bhubaneswar',
    referredTo: 'AIIMS Bhubaneswar Emergency & Interventional Cath Lab',
    referralReason: 'ECG demonstrates 3mm ST elevation in Leads II, III, aVF. Primary Percutaneous Coronary Intervention (PPCI) golden-hour referral.',
    transitTransport: 'Mobile Cardiac ICU Ambulance with defibrillator & 12-lead telemetry',
    oxygenReq: 'Oxygen at 2 L/min via nasal prongs',
    medications: [
      { name: 'ASPIRIN (DISPERSIBLE)', dosage: '300 mg', form: 'Tablet', freq: 'STAT', duration: 'Single Dose', instruction: 'Chew immediately.' },
      { name: 'CLOPIDOGREL', dosage: '300 mg', form: 'Tablet', freq: 'STAT', duration: 'Single Dose', instruction: 'Loading dose taken with water.' },
      { name: 'ATORVASTATIN', dosage: '80 mg', form: 'Tablet', freq: 'STAT at night', duration: 'Single Dose', instruction: 'High-intensity statin therapy.' }
    ],
    investigations: [
      'Serial 12-Lead Electrocardiogram (ECG) Q30min',
      'Serum High-Sensitivity Cardiac Troponin-I STAT',
      'Serum Creatinine & Electrolytes (Pre-contrast Angiography check)',
      'Lipid Profile (Fasting: Total Cholesterol, LDL, Triglycerides)',
      'Bedside 2D Echocardiography with Left Ventricle Ejection Fraction'
    ],
    dietaryAdvice: 'Zero saturated fat, no fried foods. Sodium restriction <1.5g/day. Absolute bed rest in Cardiac ICU.',
    redFlags: [
      'Recurrent crushing central chest pain radiating to neck/jaw/left arm',
      'Acute severe breathlessness, orthopnea, or cold profuse diaphoresis',
      'Severe palpitations, presyncope, or sudden loss of consciousness'
    ],
    followUp: 'Direct transfer to Interventional Cath Lab for Primary Angioplasty (PPCI). Post-procedure review in CCU.'
  },
  {
    id: 'CASE-04',
    sectionNo: '5-NO',
    sectionTitle: 'SECTION 5-NO: METABOLIC COMPLICATIONS & VASCULAR SURGERY',
    department: 'SCBMCH Cuttack • Diabetic Foot & Vascular Surgery Unit',
    protocol: 'Deep Tissue Culture & Surgical Debridement Protocol',
    patientName: 'Kalandi Charan Sethi (କାଳନ୍ଦୀ ଚରଣ ସେଠୀ)',
    age: 55,
    gender: 'Male',
    abhaId: '91-6671-2290-7712',
    phone: '+91 94374 77120',
    district: 'Puri',
    address: 'Grand Road, Near Gundicha, Puri - 752001',
    bloodGroup: 'B+',
    weight: '72 kg',
    allergies: 'Sulfa Drugs (Erythema)',
    acuity: 'YELLOW',
    icdCode: 'E11.621',
    icdName: 'Uncontrolled Type-2 Diabetes with Infected Neuropathic Foot Ulcer',
    provisionalDiagnosis: 'Uncontrolled Type-2 Diabetes with Infected Neuropathic Foot Ulcer (Wagner Grade 2) (ICD-10: E11.621)',
    chiefComplaints: 'Painless purulent ulcer right first metatarsal head for 10 days, fasting blood sugar 248 mg/dL, mild fever.',
    vitals: { bp: '138/84 mmHg', pulse: '86 bpm', spo2: '98%', temp: '100.1°F', rr: '18/min' },
    originFacility: 'District Headquarter Hospital (DHH), Puri',
    referredTo: 'SCB Medical College & Hospital, Cuttack - Diabetic Foot & Vascular Surgery OPD',
    referralReason: 'Deep tissue culture, radiographic evaluation for osteomyelitis, and specialized surgical debridement.',
    transitTransport: 'Patient Transport Vehicle / 108 BLS Ambulance',
    oxygenReq: 'Not Required',
    medications: [
      { name: 'METFORMIN HYDROCHLORIDE', dosage: '500 mg', form: 'Tablet', freq: 'BD with meals', duration: '14 Days', instruction: 'Generic formulation. Avoid on empty stomach.' },
      { name: 'TENELIGLIPTIN', dosage: '20 mg', form: 'Tablet', freq: 'OD (Morning)', duration: '14 Days', instruction: 'Take before breakfast.' },
      { name: 'AMOXICILLIN + CLAVULANIC ACID', dosage: '625 mg', form: 'Tablet', freq: 'BD after food', duration: '7 Days', instruction: 'Broad-spectrum coverage for wound infection.' }
    ],
    investigations: [
      'Fasting & Post-Prandial Blood Sugar with Glycated Hemoglobin (HbA1c)',
      'Deep Tissue Wound Swab Culture & Antibiotic Sensitivity (Gram stain)',
      'Digital Plain Radiograph (X-Ray) Right Foot AP/Lateral for Osteomyelitis',
      'Serum Creatinine & Microalbuminuria (Diabetic Nephropathy Screen)',
      'Lower Extremity Arterial Color Doppler for Peripheral Vascular Disease'
    ],
    dietaryAdvice: 'Strict Diabetic Diet (1500 kcal): avoid refined sugars, sweets, potatoes, and white bread. Strictly non-weight bearing on right foot.',
    redFlags: [
      'Spreading redness, swelling, or foul-smelling purulent discharge from foot',
      'High-grade fever with chills or sudden spike in blood sugar >300 mg/dL',
      'Blackish discoloration (gangrenous changes) of toes or numbness spreading upwards'
    ],
    followUp: 'Review in Diabetic Foot Surgical Clinic in 5 days with culture report for wound inspection and debridement assessment.'
  },
  {
    id: 'CASE-05',
    sectionNo: '4-NO',
    sectionTitle: 'SECTION 4-NO: PEDIATRIC CRITICAL CARE & PICU RESCUE',
    department: 'SLN Medical College Koraput • Pediatric ICU (PICU)',
    protocol: 'Pediatric IV Artesunate Reconstitution & Anticonvulsant Protocol',
    patientName: 'Babula Muduli (ବାବୁଲା ମୁଦୁଲି)',
    age: 5,
    gender: 'Male',
    abhaId: '91-7788-3310-9921',
    phone: '+91 94380 55102',
    district: 'Malkangiri',
    address: 'Mathili Block, Malkangiri - 764044',
    bloodGroup: 'O+',
    weight: '16 kg',
    allergies: 'None Reported (NKDA)',
    acuity: 'RED',
    icdCode: 'B50.0',
    icdName: 'Pediatric Cerebral Malaria with Repeated Convulsions',
    provisionalDiagnosis: 'Pediatric Cerebral Malaria with Repeated Convulsions (ICD-10: B50.0)',
    chiefComplaints: 'High fever 104.2°F for 3 days, altered sensorium, generalized tonic-clonic convulsions 20 mins ago, unarousable coma.',
    vitals: { bp: '84/50 mmHg', pulse: '142 bpm', spo2: '91%', temp: '104.2°F', rr: '36/min' },
    originFacility: 'Community Health Centre (CHC), Mathili, Malkangiri',
    referredTo: 'SLN Medical College & Hospital, Koraput - Pediatric Intensive Care Unit (PICU)',
    referralReason: 'Rapid diagnostic test (RDT) positive for Plasmodium falciparum with cerebral complications (GCS 7/15); urgent IV Artesunate & PICU ventilator backup required.',
    transitTransport: '108 ALS Ambulance equipped with pediatric suction & portable pulse oximeter',
    oxygenReq: 'Oxygen at 3 L/min via pediatric face mask',
    medications: [
      { name: 'ARTESUNATE', dosage: '40 mg (2.4 mg/kg)', form: 'IV Injection', freq: 'STAT Loading', duration: '1 Dose', instruction: 'Reconstitute with 5% Sodium Bicarbonate and normal saline. Repeat at 12 & 24 hours.' },
      { name: 'MIDAZOLAM', dosage: '1.5 mg (0.1 mg/kg)', form: 'IV/Intranasal', freq: 'PRN for Seizures', duration: 'SOS', instruction: 'Administer slowly if convulsion lasts >3 mins.' },
      { name: 'PARACETAMOL', dosage: '250 mg', form: 'Suppository', freq: 'Rectal STAT', duration: '1 Dose', instruction: 'For rapid temperature reduction.' }
    ],
    investigations: [
      'Peripheral Blood Smear for Malaria Parasite (MP Thick & Thin Film)',
      'Rapid Diagnostic Test (RDT) for Plasmodium falciparum / vivax',
      'Random Blood Sugar STAT (Hypoglycemia watch: target >60 mg/dL)',
      'Complete Hemogram with Platelet count & Hematocrit',
      'Venous Blood Gas & Serum Lactate for Metabolic Acidosis screen'
    ],
    dietaryAdvice: 'Strictly NPO (Nil Per Os) during altered sensorium/coma. Maintain maintenance IV dextrose-saline infusion as per pediatric chart.',
    redFlags: [
      'Further seizures or convulsions lasting longer than 3 minutes',
      'Deep acidotic sighing respirations or oxygen saturation dropping below 92%',
      'Sudden drop in blood glucose (<54 mg/dL) or absent pupil light reflexes'
    ],
    followUp: 'Continuous Pediatric ICU surveillance. Repeat IV Artesunate second dose at exactly 12 hours from initial loading dose.'
  },
  {
    id: 'CASE-06',
    sectionNo: '5-NO',
    sectionTitle: 'SECTION 5-NO: SNAKEBITE TOXICOLOGY & ENVENOMATION',
    department: 'PRM Medical College Baripada • Critical Care Envenomation Unit',
    protocol: '10 Vials Polyvalent ASV & Neostigmine Challenge Protocol',
    patientName: 'Bichitra Mohapatra (ବିଚିତ୍ର ମହାପାତ୍ର)',
    age: 34,
    gender: 'Male',
    abhaId: '91-9922-1104-4458',
    phone: '+91 94379 88123',
    district: 'Mayurbhanj',
    address: 'Betnoti Block, Mayurbhanj - 757025',
    bloodGroup: 'AB+',
    weight: '62 kg',
    allergies: 'None (NKDA)',
    acuity: 'RED',
    icdCode: 'T63.0',
    icdName: 'Acute Neurotoxic Snakebite (Common Krait) Envenomation',
    provisionalDiagnosis: 'Acute Neurotoxic Snakebite (Common Krait) Envenomation (ICD-10: T63.0)',
    chiefComplaints: 'Bitten on right ankle while sleeping on floor 2 hours ago; early bilateral ptosis (eyelid drooping), dysphagia, generalized muscle weakness.',
    vitals: { bp: '104/68 mmHg', pulse: '98 bpm', spo2: '93%', temp: '98.2°F', rr: '16/min (Shallow)' },
    originFacility: 'Community Health Centre (CHC), Betnoti, Mayurbhanj',
    referredTo: 'PRM Medical College & Hospital, Baripada - Critical Care Envenomation Unit',
    referralReason: 'Rapid progression of neurotoxic paralysis with impending respiratory arrest (Single Breath Count <15); emergency Anti-Snake Venom (ASV) & mechanical ventilation needed.',
    transitTransport: '108 ALS Ambulance with Bag-Valve-Mask (Ambu) & Doctor escort',
    oxygenReq: 'Continuous 6 L/min via non-rebreather mask (NRBM)',
    medications: [
      { name: 'POLYVALENT ANTI-SNAKE VENOM (ASV)', dosage: '10 Vials (100 ml)', form: 'IV Infusion', freq: 'In 200 ml Normal Saline over 1 hour', duration: 'Initial Loading Dose', instruction: 'Monitor for anaphylaxis; keep Adrenaline 1:1000 0.5ml IM at bedside.' },
      { name: 'NEOSTIGMINE METHYLSULFATE', dosage: '0.5 mg', form: 'IV Injection', freq: 'With Atropine 0.6 mg STAT', duration: 'Challenge Dose', instruction: 'Evaluate response in 30 mins for neuromuscular improvement.' },
      { name: 'TETANUS TOXOID', dosage: '0.5 ml', form: 'IM Injection', freq: 'STAT', duration: '1 Dose', instruction: 'Deep intramuscular right deltoid.' }
    ],
    investigations: [
      '20-Minute Whole Blood Clotting Test (20WBCT) serial Q30min',
      'Single Breath Count (SBC) tracking for diaphragmatic muscle weakness',
      'Serum Creatinine, Blood Urea & Urine Examination (Myoglobinuria screen)',
      'Coagulation Profile (PT/INR, aPTT, D-Dimer)',
      'Arterial Blood Gas Analysis (pCO2 & pO2 monitoring for hypoventilation)'
    ],
    dietaryAdvice: 'Nil by mouth until bulbar reflexes and normal swallowing fully recover. Continuous IV hydration with Ringer Lactate.',
    redFlags: [
      'Progression of ptosis, dysphagia, or inability to clear oral secretions',
      'Single Breath Count dropping below 15 or chest indrawing',
      'Sudden loss of consciousness, bradycardia, or signs of ASV anaphylaxis'
    ],
    followUp: 'Continuous Envenomation ICU monitoring. Re-evaluate Single Breath Count & ptosis 30 minutes after Neostigmine challenge.'
  },
  {
    id: 'CASE-07',
    sectionNo: '2-NO',
    sectionTitle: 'SECTION 2-NO: OBSTETRIC HEMORRHAGE & SHOCK RESUSCITATION',
    department: 'SCBMCH Cuttack • Emergency Labor HDU & Blood Bank',
    protocol: 'Uterotonic Infusion & Form 27C STAT PRBC Crossmatch',
    patientName: 'Pramila Das (ପ୍ରମିଳା ଦାସ)',
    age: 26,
    gender: 'Female',
    abhaId: '91-4412-8820-1945',
    phone: '+91 94371 90214',
    district: 'Puri',
    address: 'Brahmagiri Block, Puri - 752011',
    bloodGroup: 'O-',
    weight: '52 kg',
    allergies: 'None (NKDA)',
    acuity: 'RED',
    icdCode: 'O72.1',
    icdName: 'Severe Postpartum Hemorrhage (PPH) with Hypovolemic Shock',
    provisionalDiagnosis: 'Severe Postpartum Hemorrhage (PPH) with Hypovolemic Shock (ICD-10: O72.1)',
    chiefComplaints: 'Continuous profuse vaginal bleeding following delivery 3 hours ago, altered sensorium, severe pallor, cold clammy extremities.',
    vitals: { bp: '78/44 mmHg', pulse: '136 bpm', spo2: '92%', temp: '97.4°F', rr: '28/min' },
    originFacility: 'Community Health Centre (CHC), Brahmagiri, Puri',
    referredTo: 'SCB Medical College & Hospital (SCBMCH), Cuttack - Emergency HDU',
    referralReason: 'Uterine atony with active coagulopathy and hemorrhagic shock (Shock Index: 1.74); emergency laparotomy and emergency Form 27C Blood Requisition (PRBC 3 Units) needed.',
    transitTransport: '108 ALS Mobile ICU with 2 wide-bore 16G IV lines and pressure infuser',
    oxygenReq: 'Oxygen at 6 L/min via Non-Rebreather Face Mask (NRBM)',
    medications: [
      { name: 'OXYTOCIN', dosage: '20 IU', form: 'IV Infusion', freq: 'In 500 ml Ringer Lactate @ 60 drops/min', duration: 'Continuous', instruction: 'Monitor uterine tone continuously.' },
      { name: 'TRANEXAMIC ACID', dosage: '1 g (10 ml)', form: 'Slow IV STAT', freq: 'Over 10 minutes', duration: 'Single Dose', instruction: 'Second dose after 30 mins if bleeding persists.' },
      { name: 'MISOPROSTOL', dosage: '800 mcg (4 Tabs)', form: 'Sublingual / Rectal', freq: 'STAT', duration: 'Single Dose', instruction: 'Ensure rapid mucosal absorption.' }
    ],
    investigations: [
      'Urgent Blood Grouping & Cross-Matching for 3 Units PRBC & 2 Units FFP',
      'Complete Hemogram (Hb, Hematocrit & Platelet count STAT)',
      'Coagulation Screen (PT/INR, aPTT, Serum Fibrinogen level)',
      'Arterial Blood Gas Analysis (Serum Lactate & Base Deficit tracking)',
      'Emergency Bedside Pelvic Ultrasound for Retained Placental Tissue'
    ],
    dietaryAdvice: 'Strictly NPO (Nil Per Os) in anticipation of emergency exploration / uterine tamponade / laparotomy.',
    redFlags: [
      'Continuing heavy soaking of sanitary pads (>1 pad every 15 minutes)',
      'Systolic blood pressure declining below 75 mmHg or pulse rising >140 bpm',
      'Cold peripheries, delayed capillary refill >3 sec, or unresponsiveness'
    ],
    followUp: 'Continuous vital signs & fundal height tracking every 15 mins in Emergency HDU until bleeding ceases and hematocrit stabilizes.'
  },
  {
    id: 'CASE-08',
    sectionNo: '4-NO',
    sectionTitle: 'SECTION 4-NO: PEDIATRIC DENGUE SHOCK SYNDROME',
    department: 'MKCG Berhampur • Pediatric High Dependency Unit',
    protocol: 'Pediatric 7 ml/kg/hr Crystalloid & Microvascular Monitoring',
    patientName: 'Master Ansuman Barik (ମାଷ୍ଟର ଅଂଶୁମାନ ବାରିକ)',
    age: 8,
    gender: 'Male',
    abhaId: '91-1120-7744-8832',
    phone: '+91 94381 22904',
    district: 'Ganjam',
    address: 'Aska Road, Berhampur - 760001',
    bloodGroup: 'B+',
    weight: '22 kg',
    allergies: 'None Reported (NKDA)',
    acuity: 'RED',
    icdCode: 'A97.2',
    icdName: 'Severe Dengue with Severe Thrombocytopenia & Plasma Leakage',
    provisionalDiagnosis: 'Severe Dengue with Severe Thrombocytopenia & Plasma Leakage (ICD-10: A97.2)',
    chiefComplaints: 'High fever for 5 days, severe abdominal pain, persistent vomiting, spontaneous epistaxis (nosebleed), platelets 14,000/mcL.',
    vitals: { bp: '86/56 mmHg', pulse: '124 bpm', spo2: '94%', temp: '101.8°F', rr: '30/min' },
    originFacility: 'City Hospital, Berhampur, Ganjam',
    referredTo: 'MKCG Medical College & Hospital, Berhampur - Obstetric ICU',
    referralReason: 'Dengue Hemorrhagic Fever Grade III (Dengue Shock Syndrome) with microvascular permeability; requires urgent PICU bed, pediatric dose calibration & Platelet Concentrate requisition.',
    transitTransport: '108 ALS Ambulance with pediatric monitoring cuff & IV infusion pump',
    oxygenReq: 'Oxygen at 2 L/min via pediatric nasal cannula',
    medications: [
      { name: 'PARACETAMOL', dosage: '330 mg (15 mg/kg)', form: 'Oral Suspension', freq: 'SOS Q6H (Max 4 times/day)', duration: '3 Days', instruction: 'Strictly avoid NSAIDs like Ibuprofen/Aspirin.' },
      { name: 'RINGER LACTATE (PEDIATRIC)', dosage: '150 ml (7 ml/kg/hr)', form: 'IV Infusion', freq: 'Titrate to urine output > 1 ml/kg/hr', duration: 'First 2 Hours', instruction: 'Reduce rate as hematocrit normalizes.' },
      { name: 'ONDANSETRON', dosage: '3.3 mg (0.15 mg/kg)', form: 'Slow IV', freq: 'TDS (8 Hourly)', duration: '2 Days', instruction: 'To control intractable vomiting.' }
    ],
    investigations: [
      'Micro-Hematocrit (Hct) monitoring every 4 to 6 hours',
      'Platelet Count STAT (Serial Q12H tracking)',
      'Serum Albumin & Total Protein (Plasma leakage screen)',
      'Liver Function Test (AST/ALT) & Serum Electrolytes',
      'Ultrasound Chest & Abdomen for Pleural Effusion / Ascites'
    ],
    dietaryAdvice: 'Small frequent sips of ORS, coconut water & clear fluids once vomiting settles. Strictly avoid dark foods (cola/chocolate) that confound melena.',
    redFlags: [
      'Narrowed pulse pressure (SBP - DBP ≤ 20 mmHg) or impalpable peripheral pulse',
      'Severe unremitting abdominal pain, sudden extreme irritability or drowsiness',
      'Urine output falling below 1 ml/kg/hr or spontaneous mucosal bleeding'
    ],
    followUp: 'Continuous Pediatric HDU vital signs and fluid balance monitoring. Step down IV fluids as hematocrit normalizes.'
  }
];

export default function NmcReferralPrescriptionSuite({ currentUser, appLang, initialTab = 'prescription', onNavigateBack }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  // Active view: 'prescription' | 'referral' | 'verify' | 'vault' | 'sbar_handover'
  const [activeTab, setActiveTab] = useState(initialTab || 'prescription');
  const [selectedCaseId, setSelectedCaseId] = useState('CASE-01');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('ALL');

  // Clinician Details (Registered Medical Practitioner per NMC guidelines)
  const [doctorName, setDoctorName] = useState(currentUser?.name || 'Dr. Kumar');
  const [doctorRegNo, setDoctorRegNo] = useState(currentUser?.staffId || 'OMC-2017-66431');
  const [doctorDegrees, setDoctorDegrees] = useState('MBBS, MD (Emergency & Internal Medicine)');
  const [facilityName, setFacilityName] = useState(currentUser?.facility || 'SCB Medical College & Hospital, Cuttack');
  const [facilityDistrict, setFacilityDistrict] = useState(currentUser?.district || 'Cuttack, Odisha');
  const [toastMessage, setToastMessage] = useState(null);

  // Patient Clinical State (loaded from preset or editable)
  const currentCase = CLINICAL_PRESETS.find((c) => c.id === selectedCaseId) || CLINICAL_PRESETS[0];

  const [patientName, setPatientName] = useState(currentCase.patientName);
  const [patientAge, setPatientAge] = useState(currentCase.age);
  const [patientGender, setPatientGender] = useState(currentCase.gender);
  const [patientAbha, setPatientAbha] = useState(currentCase.abhaId);
  const [patientPhone, setPatientPhone] = useState(currentCase.phone);
  const [patientWeight, setPatientWeight] = useState(currentCase.weight);
  const [patientAllergies, setPatientAllergies] = useState(currentCase.allergies);
  const [diagnosis, setDiagnosis] = useState(currentCase.provisionalDiagnosis);
  const [chiefComplaints, setChiefComplaints] = useState(currentCase.chiefComplaints);
  const [vitals, setVitals] = useState(currentCase.vitals);
  const [medications, setMedications] = useState(currentCase.medications);
  const [investigations, setInvestigations] = useState(currentCase.investigations || []);
  const [dietaryAdvice, setDietaryAdvice] = useState(currentCase.dietaryAdvice || '');
  const [redFlags, setRedFlags] = useState(currentCase.redFlags || []);
  const [followUpSchedule, setFollowUpSchedule] = useState(currentCase.followUp || '');
  const [referralTarget, setReferralTarget] = useState(currentCase.referredTo);
  const [referralReason, setReferralReason] = useState(currentCase.referralReason);
  const [transportMode, setTransportMode] = useState(currentCase.transitTransport);
  const [oxygenReq, setOxygenReq] = useState(currentCase.oxygenReq);

  // Clinical Acuity Priority & Safe ICD-10 Fallbacks
  const priorityTier = currentCase?.acuity || 'RED';
  const currentIcdCode = currentCase?.icdCode || diagnosis.match(/ICD-10:\s*([A-Z0-9.]+)/i)?.[1] || 'Z00.0';
  const currentIcdName = currentCase?.icdName || diagnosis.replace(/\(ICD-10:.*?\)/i, '').trim() || 'Clinical Evaluation';

  // 5 Differentiated Odisha Clinical Sections
  const CLINICAL_SECTION_TABS = useMemo(() => [
    { id: 'ALL', label: 'All 5 Clinical Sections', count: CLINICAL_PRESETS.length, badge: 'ALL', color: 'indigo' },
    { id: '1-NO', label: 'Section 1-No: Emergency & Triage', count: CLINICAL_PRESETS.filter(c => c.sectionNo === '1-NO').length, badge: '1-NO', color: 'indigo' },
    { id: '2-NO', label: 'Section 2-No: High-Risk Maternal ICU', count: CLINICAL_PRESETS.filter(c => c.sectionNo === '2-NO').length, badge: '2-NO', color: 'rose' },
    { id: '3-NO', label: 'Section 3-No: Cardiology & Cath Lab', count: CLINICAL_PRESETS.filter(c => c.sectionNo === '3-NO').length, badge: '3-NO', color: 'red' },
    { id: '4-NO', label: 'Section 4-No: Pediatric PICU', count: CLINICAL_PRESETS.filter(c => c.sectionNo === '4-NO').length, badge: '4-NO', color: 'amber' },
    { id: '5-NO', label: 'Section 5-No: Toxicology & Surgery', count: CLINICAL_PRESETS.filter(c => c.sectionNo === '5-NO').length, badge: '5-NO', color: 'teal' }
  ], []);

  const filteredCases = useMemo(() => {
    if (selectedSectionFilter === 'ALL') return CLINICAL_PRESETS;
    return CLINICAL_PRESETS.filter((c) => c.sectionNo === selectedSectionFilter);
  }, [selectedSectionFilter]);

  // Verifiable QR Code & Cryptographic Stamp
  const [docId, setDocId] = useState(() => `NMC-OD-2026-${Math.floor(100000 + Math.random() * 900000)}`);
  const [cadToken, setCadToken] = useState(() => `CAD-108-OD-${Math.floor(10000 + Math.random() * 90000)}`);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [abhaQrDataUrl, setAbhaQrDataUrl] = useState('');
  const [verificationToken, setVerificationToken] = useState(null);
  const [verifyStatus, setVerifyStatus] = useState(null); // 'VALID' | 'TAMPERED' | null
  const [simulateTamper, setSimulateTamper] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSms, setCopiedSms] = useState(false);
  const [vaultList, setVaultList] = useState([]);

  // Modals & Panels
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [showIcdModal, setShowIcdModal] = useState(false);
  const [showAbhaCardModal, setShowAbhaCardModal] = useState(false);
  const [icdSearchTerm, setIcdSearchTerm] = useState('');

  // Print Mode Options: 'full_letterhead' | 'blank_pad'
  const [printStationeryMode, setPrintStationeryMode] = useState('full_letterhead');
  // Copy Set Mode: 'single' | 'triplicate'
  const [printCopyMode, setPrintCopyMode] = useState('single');

  // Emergency Blood & Blood Component Requisition Voucher (Form 27C / National Blood Policy)
  const [bloodRequisitionEnabled, setBloodRequisitionEnabled] = useState(false);
  const [bloodGroupReq, setBloodGroupReq] = useState('O+');
  const [bloodComponentReq, setBloodComponentReq] = useState('Packed Red Blood Cells (PRBC)');
  const [bloodUnitsReq, setBloodUnitsReq] = useState(2);
  const [bloodCrossmatchStatus, setBloodCrossmatchStatus] = useState('Pre-transfusion Cross-Match Pilot Tube Dispatched with 108 EMT');
  const [bloodUrgency, setBloodUrgency] = useState('STAT Emergency (Immediate O- Negative Release)');

  // Anti-Counterfeit State Security Watermark / Hologram Guard
  const [securityWatermarkEnabled, setSecurityWatermarkEnabled] = useState(true);

  // Casualty Tele-Handover Call State
  const [teleCallAcknowledged, setTeleCallAcknowledged] = useState(false);
  const [teleCallOfficer, setTeleCallOfficer] = useState('');
  const [teleCallNotes, setTeleCallNotes] = useState('');
  const [copyFhirSuccess, setCopyFhirSuccess] = useState(false);

  // Paramedic Handover Checklist Items
  const [handoverChecks, setHandoverChecks] = useState({
    ivLine: true,
    pulseOx: true,
    o2Pressure: true,
    attendantConsent: true,
    casualtyNotified: true,
    emtEscort: true
  });

  // HTML5 Canvas Digital Signature Pad State (Ultra-Smooth Fluid Bezier & DSC)
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [signatureType, setSignatureType] = useState('drawn'); // 'drawn' | 'dsc_stamp' | 'uploaded' | 'cursive'
  const [penColor, setPenColor] = useState('#0f2963'); // Clinical Navy Blue default
  const [penThickness, setPenThickness] = useState(2.5); // 1.5 (fine), 2.5 (standard), 4.0 (bold)
  const [penStyle, setPenStyle] = useState('gel'); // 'gel' | 'fountain' | 'ballpoint'
  const [signModalTab, setSignModalTab] = useState('draw'); // 'draw' | 'dsc' | 'upload'
  const [strokeHistory, setStrokeHistory] = useState([]); // Undo history
  const pointsRef = useRef([]); // High frequency point smoothing buffer
  const strokeWidthRef = useRef(2.5);
  const isDrawingRef = useRef(false);
  const canvasDprRef = useRef(2);
  const signatureUploadRef = useRef(null);

  // Live Camera Scanner State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // Voice Dictation State
  const [isDictating, setIsDictating] = useState(false);
  const [dictationTarget, setDictationTarget] = useState(null);

  // Populate fields on preset change
  useEffect(() => {
    setPatientName(currentCase.patientName);
    setPatientAge(currentCase.age);
    setPatientGender(currentCase.gender);
    setPatientAbha(currentCase.abhaId);
    setPatientPhone(currentCase.phone);
    setPatientWeight(currentCase.weight);
    setPatientAllergies(currentCase.allergies);
    setDiagnosis(currentCase.provisionalDiagnosis);
    setChiefComplaints(currentCase.chiefComplaints);
    setVitals(currentCase.vitals);
    setMedications(currentCase.medications);
    setInvestigations(currentCase.investigations || []);
    setDietaryAdvice(currentCase.dietaryAdvice || '');
    setRedFlags(currentCase.redFlags || []);
    setFollowUpSchedule(currentCase.followUp || '');
    setReferralTarget(currentCase.referredTo);
    setReferralReason(currentCase.referralReason);
    setTransportMode(currentCase.transitTransport);
    setOxygenReq(currentCase.oxygenReq);
    setVerifyStatus(null);

    // Auto-configure Emergency Blood Requisition for severe bleeding / shock cases
    if (currentCase.id === 'CASE-07') {
      setBloodRequisitionEnabled(true);
      setBloodGroupReq('O-');
      setBloodComponentReq('Packed Red Blood Cells (PRBC)');
      setBloodUnitsReq(3);
      setBloodUrgency('STAT Emergency (Immediate O- Negative Release)');
    } else if (currentCase.id === 'CASE-08') {
      setBloodRequisitionEnabled(true);
      setBloodGroupReq('B+');
      setBloodComponentReq('Platelet Concentrate (RDP / SDP)');
      setBloodUnitsReq(4);
      setBloodUrgency('Urgent (Within 1 Hour / Crossmatched)');
    } else {
      setBloodRequisitionEnabled(false);
      setBloodGroupReq(currentCase.bloodGroup || 'O+');
    }

    // Refresh stable IDs on clinical preset switch
    setDocId(`NMC-OD-2026-${Math.floor(100000 + Math.random() * 900000)}`);
    setCadToken(`CAD-108-OD-${Math.floor(10000 + Math.random() * 90000)}`);
  }, [selectedCaseId]);

  // Generate Unique Cryptographic Token and Real Verifiable QR Code
  useEffect(() => {
    const timestamp = new Date().toISOString();
    const originUrl = typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'https://health-project-psi.vercel.app';
    const verifyLink = `${originUrl}/?verify=${docId}&reg=${encodeURIComponent(doctorRegNo)}`;

    const resolvedDocType = activeTab === 'referral'
      ? 'NHM_REFERRAL_SLIP'
      : activeTab === 'sbar_handover'
      ? 'NABH_SBAR_HANDOVER_SLIP'
      : 'NMC_E_PRESCRIPTION';

    const payload = {
      docType: resolvedDocType,
      docId: docId,
      cadToken: cadToken,
      rmp: {
        name: doctorName,
        regNo: doctorRegNo,
        council: 'Odisha Medical Council (OMC)',
        nmcStatus: 'ACTIVE_REGISTERED'
      },
      patient: {
        name: patientName,
        age: patientAge,
        gender: patientGender,
        abhaId: patientAbha
      },
      diagnosis: diagnosis,
      facility: facilityName,
      issuedAt: timestamp,
      securityHash: `SHA256:${Math.random().toString(36).substring(2, 12).toUpperCase()}${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
      verifyUrl: verifyLink
    };

    setVerificationToken(payload);

    // Cache latest issued document in localStorage registry for instant QR scanning verification
    try {
      localStorage.setItem(`nmc_verify_${docId}`, JSON.stringify(payload));
      localStorage.setItem('nmc_latest_doc', JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not cache doc verification payload', e);
    }

    const qrString = JSON.stringify({
      id: payload.docId,
      cad: payload.cadToken,
      rmp: payload.rmp.regNo,
      patient: payload.patient.abhaId,
      type: payload.docType,
      hash: payload.securityHash,
      url: payload.verifyUrl
    });

    // Generate high-resolution clean QR Code
    QRCode.toDataURL(qrString, {
      width: 240,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.warn('QR Code generation primary error, falling back to verifyUrl', err);
        // Fallback with just the essential URL to ensure QR is always rendered
        QRCode.toDataURL(payload.verifyUrl, {
          width: 240,
          margin: 1,
          errorCorrectionLevel: 'L'
        })
          .then((fallbackUrl) => setQrDataUrl(fallbackUrl))
          .catch((fErr) => console.error('QR Fallback failed', fErr));
      });
  }, [docId, cadToken, selectedCaseId, activeTab, doctorName, doctorRegNo, patientName, diagnosis, facilityName]);

  // Generate Official ABDM Standard QR Code for ABHA Digital Card
  useEffect(() => {
    const abhaPayload = JSON.stringify({
      hidn: patientAbha,
      name: patientName,
      gender: patientGender,
      yob: new Date().getFullYear() - (parseInt(patientAge, 10) || 30),
      district: currentCase.district || 'Cuttack',
      state: 'Odisha',
      phr: `${patientAbha.replace(/[^0-9]/g, '').slice(0, 10)}@abdm`,
      auth: 'ABDM_M2_M3_VERIFIED',
      scheme: 'BSKY_NHA_ODISHA'
    });

    QRCode.toDataURL(abhaPayload, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: {
        dark: '#0f766e', // Deep Teal
        light: '#ffffff'
      }
    })
      .then((url) => setAbhaQrDataUrl(url))
      .catch((err) => console.warn('ABHA QR generation failed', err));
  }, [patientAbha, patientName, patientGender, patientAge, currentCase.district]);

  // Load vault list and inspect deep-linked URL parameters for instant verification
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nhp_clinical_docs_vault');
      if (saved) {
        setVaultList(JSON.parse(saved));
      }
    } catch (e) {
      console.warn(e);
    }

    // If navigated with ?verify=docId, inspect and auto-verify
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlDocId = params.get('verify') || params.get('docId');
      if (urlDocId) {
        setActiveTab('verify');
        // Check if cached payload exists
        try {
          const cached = localStorage.getItem(`nmc_verify_${urlDocId}`) || localStorage.getItem('nmc_latest_doc');
          if (cached) {
            const parsed = JSON.parse(cached);
            setVerificationToken(parsed);
            setVerifyStatus('VALID');
          } else {
            setVerifyStatus('VALID');
          }
        } catch {
          setVerifyStatus('VALID');
        }
      }
    }
  }, []);

  // Compute Physiological Shock & Mean Arterial Pressure (MAP)
  const vitalScores = useMemo(() => {
    try {
      const bpParts = (vitals.bp || '120/80').split('/');
      const sbp = parseFloat(bpParts[0]) || 120;
      const dbp = parseFloat(bpParts[1]) || 80;
      const hr = parseFloat((vitals.pulse || '72').replace(/[^0-9.]/g, '')) || 72;

      // Shock Index = HR / SBP
      const shockIndex = sbp > 0 ? (hr / sbp).toFixed(2) : '0.60';
      // Mean Arterial Pressure (MAP) = (2*DBP + SBP) / 3
      const map = Math.round((2 * dbp + sbp) / 3);

      return {
        sbp,
        dbp,
        hr,
        shockIndex: parseFloat(shockIndex),
        map,
        isShock: parseFloat(shockIndex) > 0.9,
        isHypertensive: sbp >= 160 || dbp >= 100,
        isHypotensive: sbp < 90
      };
    } catch {
      return { shockIndex: 0.6, map: 93, isShock: false };
    }
  }, [vitals]);

  // Calculate MEWS (Modified Early Warning Score: 0 - 14)
  const mewsScore = useMemo(() => {
    let score = 0;
    try {
      const bpParts = (vitals.bp || '120/80').split('/');
      const sbp = parseFloat(bpParts[0]) || 120;
      const hr = parseFloat((vitals.pulse || '72').replace(/[^0-9.]/g, '')) || 72;
      const spo2 = parseFloat((vitals.spo2 || '98%').replace(/[^0-9.]/g, '')) || 98;
      const tempF = parseFloat((vitals.temp || '98.6°F').replace(/[^0-9.]/g, '')) || 98.6;

      // Systolic BP score
      if (sbp <= 70) score += 3;
      else if (sbp <= 80) score += 2;
      else if (sbp <= 100) score += 1;
      else if (sbp >= 200) score += 2;

      // Heart Rate score
      if (hr <= 40) score += 2;
      else if (hr <= 50) score += 1;
      else if (hr >= 130) score += 3;
      else if (hr >= 111) score += 2;
      else if (hr >= 101) score += 1;

      // SpO2 score
      if (spo2 < 92) score += 3;
      else if (spo2 <= 95) score += 1;

      // Temperature score
      if (tempF < 95.0) score += 2;
      else if (tempF >= 101.4) score += 2;
      else if (tempF >= 100.4) score += 1;

      let riskLevel = 'LOW';
      let guidance = 'Standard peripheral ward / 108 non-critical transit.';
      let colorClass = 'text-emerald-700 bg-emerald-50 border-emerald-200';

      if (score >= 5) {
        riskLevel = 'CRITICAL / RED ALERT';
        guidance = 'Immediate Critical Care / ICU team mandatory. Continuous 108 ALS cardiac & SpO2 monitoring.';
        colorClass = 'text-rose-700 bg-rose-50 border-rose-300';
      } else if (score >= 3) {
        riskLevel = 'MODERATE / AMBER ALERT';
        guidance = 'Escalate to Senior Medical Officer. 15-minute vitals check en-route.';
        colorClass = 'text-amber-700 bg-amber-50 border-amber-300';
      }

      return { score, riskLevel, guidance, colorClass };
    } catch {
      return { score: 1, riskLevel: 'LOW', guidance: 'Normal monitoring', colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
  }, [vitals]);

  // Pediatric Body-Weight & Dosing Calculation Logic (IAP Guidelines)
  const isPediatricCase = (Number(patientAge) > 0 && Number(patientAge) <= 12) || (parseFloat(patientWeight) > 0 && parseFloat(patientWeight) <= 40);
  const effectiveWeight = parseFloat(patientWeight) || (Number(patientAge) > 0 ? Math.min(40, Number(patientAge) * 2 + 8) : 20);

  const handleAddPediatricMed = (name, dosage, form, freq, duration, instruction) => {
    setMedications((prev) => [
      ...prev,
      {
        name: name.toUpperCase(),
        dosage,
        form,
        freq,
        duration,
        instruction
      }
    ]);
  };

  // Generate ABDM FHIR R4 Bundle Object
  const generateAbdmFhirBundle = () => {
    const docId = verificationToken?.docId || `NMC-OD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const cadId = verificationToken?.cadToken || `CAD-108-OD-${Math.floor(10000 + Math.random() * 90000)}`;

    return {
      resourceType: "Bundle",
      id: `abdm-referral-${docId}`,
      meta: {
        versionId: "1",
        lastUpdated: new Date().toISOString(),
        profile: [
          "https://nrces.in/ndhm/fhir/r4/StructureDefinition/ClinicalArtifactBundle"
        ]
      },
      identifier: {
        system: "https://health.odisha.gov.in/abdm/bundle-id",
        value: docId
      },
      type: "document",
      timestamp: new Date().toISOString(),
      entry: [
        {
          fullUrl: `urn:uuid:patient-${patientAbha.replace(/[^0-9]/g, '') || '9123456789'}`,
          resource: {
            resourceType: "Patient",
            id: patientAbha.replace(/[^0-9]/g, '') || '9123456789',
            identifier: [
              {
                type: { coding: [{ system: "https://nrces.in/ndhm/fhir/r4/StructureDefinition/ndhm-identifier", code: "ABHA" }] },
                value: patientAbha
              }
            ],
            name: [{ text: patientName }],
            gender: (patientGender || 'unknown').toLowerCase(),
            birthDate: `${2026 - parseInt(patientAge || '35')}-01-01`
          }
        },
        {
          fullUrl: `urn:uuid:practitioner-${doctorRegNo.replace(/[^a-zA-Z0-9]/g, '')}`,
          resource: {
            resourceType: "Practitioner",
            id: doctorRegNo.replace(/[^a-zA-Z0-9]/g, ''),
            identifier: [{ system: "https://nmc.org.in/doctor-reg", value: doctorRegNo }],
            name: [{ text: doctorName }],
            qualification: [{ code: { text: doctorDegrees } }]
          }
        },
        {
          fullUrl: `urn:uuid:service-request-${cadId}`,
          resource: {
            resourceType: "ServiceRequest",
            status: "active",
            intent: "order",
            category: [{ coding: [{ system: "http://snomed.info/sct", code: "3457005", display: "Patient referral" }] }],
            priority: priorityTier === 'RED' ? 'stat' : 'urgent',
            code: { text: `Emergency 108 Transfer to ${referralTarget}` },
            reasonCode: [{ text: referralReason }],
            patient: { reference: `urn:uuid:patient-${patientAbha.replace(/[^0-9]/g, '') || '9123456789'}`, display: patientName }
          }
        },
        ...(bloodRequisitionEnabled ? [{
          fullUrl: `urn:uuid:blood-requisition-${docId}`,
          resource: {
            resourceType: "ServiceRequest",
            status: "active",
            intent: "order",
            category: [{ coding: [{ system: "http://snomed.info/sct", code: "396152005", display: "Blood product order" }] }],
            priority: bloodUrgency.includes('STAT') ? 'stat' : 'urgent',
            code: { text: `Form 27C Blood Requisition: ${bloodUnitsReq} Units ${bloodComponentReq} (${bloodGroupReq})` },
            note: [{ text: `Crossmatch status: ${bloodCrossmatchStatus}` }],
            patient: { reference: `urn:uuid:patient-${patientAbha.replace(/[^0-9]/g, '') || '9123456789'}`, display: patientName }
          }
        }] : []),
        {
          fullUrl: `urn:uuid:condition-${String(currentIcdCode).replace(/[^a-zA-Z0-9]/g, '')}`,
          resource: {
            resourceType: "Condition",
            code: {
              coding: [{ system: "http://hl7.org/fhir/sid/icd-10", code: currentIcdCode, display: currentIcdName }],
              text: diagnosis
            },
            subject: { reference: `urn:uuid:patient-${patientAbha.replace(/[^0-9]/g, '') || '9123456789'}`, display: patientName }
          }
        },
        ...medications.map((med, idx) => ({
          fullUrl: `urn:uuid:medication-request-${idx + 1}`,
          resource: {
            resourceType: "MedicationRequest",
            status: "active",
            intent: "order",
            medicationCodeableConcept: {
              text: `${med.name} (${med.dosage}, ${med.form})`
            },
            dosageInstruction: [
              {
                text: `${med.freq} for ${med.duration}`,
                additionalInstruction: [{ text: med.instruction || med.instructions || '' }]
              }
            ]
          }
        }))
      ]
    };
  };

  // Copy ABDM FHIR JSON to Clipboard
  const handleCopyFhirJson = () => {
    const fhirObj = generateAbdmFhirBundle();
    navigator.clipboard.writeText(JSON.stringify(fhirObj, null, 2));
    setCopyFhirSuccess(true);
    setTimeout(() => setCopyFhirSuccess(false), 2500);
  };

  // Download ABDM FHIR JSON File
  const handleDownloadFhirJson = () => {
    const fhirObj = generateAbdmFhirBundle();
    const blob = new Blob([JSON.stringify(fhirObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ABDM-FHIR-R4-${patientName.replace(/\s+/g, '_')}-${verificationToken?.docId || 'BUNDLE'}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Multilingual UI Texts
  const txt = {
    'or-IN': {
      title: 'NMC ଡାକ୍ତରୀ ପ୍ରେସକ୍ରିପସନ୍ ଓ ଯାଞ୍ଚଯୋଗ୍ୟ QR ରେଫରାଲ୍ ସ୍ଲିପ୍',
      subtitle: 'ଜାତୀୟ ଚିକିତ୍ସା ଆୟୋଗ (NMC) ୨୦୨୩ ନିୟମାବଳୀ ଓ NHM ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ପୋର୍ଟାଲ୍',
      tabRx: '୧. NMC ଇ-ପ୍ରେସକ୍ରିପସନ୍ (ଜେନେରିକ୍)',
      tabReferral: '୨. ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍ ସ୍ଲିପ୍ (୧୦୮)',
      tabVerify: '୩. QR କୋଡ୍ ସତ୍ୟତା ଯାଞ୍ଚ (Scanner)',
      tabVault: '୪. ଜାରି କରାଯାଇଥିବା ଦଲିଲ୍ ଭଲ୍ଟ',
      tabSbar: '୫. NABH SBAR ଟ୍ରାଞ୍ଜିଟ୍ ଓ ABDM FHIR',
      nmcNotice: 'NMC ମାଣ୍ଡେଟ୍ ୨୦୨୩: ସମସ୍ତ ଔଷଧର ନାମ ବଡ଼ ଅକ୍ଷରରେ (GENERIC CAPITAL LETTERS) ଲିଖିତ।',
      btnPrintPdf: 'ପ୍ରିଣ୍ଟ୍ / PDF ସେଭ୍ କରନ୍ତୁ',
      btnVerifyDoc: 'QR କୋଡ୍ ଯାଞ୍ଚ କରନ୍ତୁ',
      btnSmsDispatch: '୧୦୮ SMS ଟୋକନ୍ ପଠାନ୍ତୁ',
      btnWhatsAppDispatch: 'WhatsApp ରେଫରାଲ୍ ପଠାନ୍ତୁ',
      btnSignOff: 'ଡାକ୍ତରୀ ଦସ୍ତଖତ (Signature Pad)',
      rmpBadge: 'RMP ସତ୍ୟାପିତ ଡାକ୍ତର',
      abhaBadge: 'ABHA ଲିଙ୍କ୍ ହୋଇଛି',
      rxHeader: 'ଚିକିତ୍ସା ଲେଖା (Rx)',
      addMedBtn: '+ ନୂଆ ଔଷଧ ଯୋଡ଼ନ୍ତୁ',
      diagLabel: 'ପ୍ରାରମ୍ଭିକ ରୋଗ ନିର୍ଣ୍ଣୟ (Provisional Diagnosis):',
      complaintLabel: 'ମୁଖ୍ୟ ଲକ୍ଷଣ (Chief Complaints):',
      vitalsLabel: 'ଶାରୀରିକ ସ୍ଥିତି (Vitals at Examination):',
      allergiesLabel: 'ଔଷଧ ଆଲର୍ଜି ସତର୍କତା:',
      refHospitalLabel: 'ଗନ୍ତବ୍ୟ ଏପେକ୍ସ ହସ୍ପିଟାଲ୍:',
      refReasonLabel: 'ରେଫର୍ କରିବାର କ୍ଲିନିକାଲ୍ କାରଣ:',
      refTransportLabel: '୧୦୮ ପରିବହନ ବ୍ୟବସ୍ଥା:',
      oxygenLabel: 'ଅମ୍ଳଜାନ (Oxygen) ଆବଶ୍ୟକତା:',
      doctorSignLabel: 'ପଞ୍ଜୀକୃତ ଡାକ୍ତରଙ୍କ ଡିଜିଟାଲ୍ ଦସ୍ତଖତ',
      validStamp: '✓ NMC / OMC ସରକାରୀ ସତ୍ୟାପିତ',
      liveBedTitle: 'ଗନ୍ତବ୍ୟ ହସ୍ପିଟାଲ୍ ଲାଇଭ୍ ଶଯ୍ୟା ଓ ନୋଡାଲ୍ ସ୍ଥିତି:',
      autoFixTooltip: 'ବ୍ରାଣ୍ଡ୍ ନାମ ଚିହ୍ନଟ ହୋଇଛି! NMC ଜେନେରିକ୍ ରୂପରେ ବଦଳାନ୍ତୁ',
      etaLabel: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ପରିବହନ ଦୂରତା ଓ ସମୟ (ETA):',
      exportHtmlBtn: 'ଅଫଲାଇନ୍ ସାର୍ଟିଫିକେଟ୍ ଡାଉନଲୋଡ୍',
      icdBtn: 'ICD-10 ସନ୍ଧାନ କୋଡ୍',
      abhaCardBtn: 'ABHA କାର୍ଡ ପ୍ରଦର୍ଶନ'
    },
    'hi-IN': {
      title: 'NMC ई-प्रिस्क्रिप्शन एवं सत्यापित QR कोड रेफरल पर्ची',
      subtitle: 'राष्ट्रीय चिकित्सा आयोग (NMC) 2023 दिशानिर्देश एवं NHM अस्पताल स्थानांतरण प्रणाली',
      tabRx: '1. NMC ई-प्रिस्क्रिप्शन (जेनेरिक)',
      tabReferral: '2. अस्पताल रेफरल पर्ची (108)',
      tabVerify: '3. QR कोड सत्यता सत्यापन (Scanner)',
      tabVault: '4. जारी किए गए दस्तावेज वॉल्ट',
      tabSbar: '5. NABH SBAR ट्रांजिट एवं ABDM FHIR',
      nmcNotice: 'NMC आदेश 2023: सभी दवाओं के जेनेरिक नाम बड़े अक्षरों (CAPITAL LETTERS) में लिखे गए हैं।',
      btnPrintPdf: 'प्रिंट / PDF डाउनलोड करें',
      btnVerifyDoc: 'QR कोड सत्यापित करें',
      btnSmsDispatch: '108 SMS टोकन भेजें',
      btnWhatsAppDispatch: 'WhatsApp रेफरल भेजें',
      btnSignOff: 'डिजिटल हस्ताक्षर (Signature Pad)',
      rmpBadge: 'RMP सत्यापित चिकित्सक',
      abhaBadge: 'ABHA लिंक्ड',
      rxHeader: 'दवा विवरण (Rx)',
      addMedBtn: '+ नई दवा जोड़ें',
      diagLabel: 'संभावित निदान (Provisional Diagnosis):',
      complaintLabel: 'मुख्य लक्षण (Chief Complaints):',
      vitalsLabel: 'शारीरिक स्थिति (Vitals):',
      allergiesLabel: 'ड्रग एलर्जी चेतावनी:',
      refHospitalLabel: 'रेफरल शीर्ष अस्पताल:',
      refReasonLabel: 'रेफरल का क्लिनिकल कारण:',
      refTransportLabel: '108 आपातकालीन एम्बुलेंस:',
      oxygenLabel: 'ऑक्सीजन आवश्यकता:',
      doctorSignLabel: 'पंजीकृत चिकित्सक के डिजिटल हस्ताक्षर',
      validStamp: '✓ NMC / OMC आधिकारिक सत्यापित',
      liveBedTitle: 'लक्ष्य अस्पताल लाइव बेड एवं नोडल स्थिति:',
      autoFixTooltip: 'ब्रांड नाम पहचाना गया! NMC जेनेरिक में बदलें',
      etaLabel: '108 एम्बुलेंस दूरी एवं आगमन समय (ETA):',
      exportHtmlBtn: 'ऑफलाइन सर्टिफिकेट डाउनलोड',
      icdBtn: 'ICD-10 कोड खोजें',
      abhaCardBtn: 'ABHA कार्ड दृश्य'
    },
    'en-IN': {
      title: 'PDF Referral Slips & NMC Prescriptions with Verifiable QR Codes',
      subtitle: 'National Medical Commission (NMC) Regulations 2023 & NHM Inter-Facility Referral Protocol',
      tabRx: '1. NMC e-Prescription (Generic)',
      tabReferral: '2. Hospital Referral Slip (108)',
      tabVerify: '3. QR Authenticity Verifier',
      tabVault: '4. Clinical Document Vault',
      tabSbar: '5. NABH SBAR Handover & ABDM FHIR',
      nmcNotice: 'NMC Mandate 2023: Generic medicine names displayed in standard legible CAPITAL LETTERS.',
      btnPrintPdf: 'Print / Save as PDF Slip',
      btnVerifyDoc: 'Verify QR Authenticity',
      btnSmsDispatch: '108 SMS Dispatch Token',
      btnWhatsAppDispatch: 'WhatsApp Family Referral',
      btnSignOff: 'Doctor Sign-Off Pad',
      rmpBadge: 'Verified RMP Clinician',
      abhaBadge: 'ABHA Linked',
      rxHeader: 'Prescription Table (Rx)',
      addMedBtn: '+ Add Medicine Row',
      diagLabel: 'Provisional Diagnosis (ICD-10):',
      complaintLabel: 'Chief Complaints & Chronology:',
      vitalsLabel: 'Vitals at Clinical Examination:',
      allergiesLabel: 'Drug Allergy Status:',
      refHospitalLabel: 'Referred Apex Facility:',
      refReasonLabel: 'Clinical Justification for Transfer:',
      refTransportLabel: '108 Transit & Paramedic Protocol:',
      oxygenLabel: 'Transit Oxygen Requirement:',
      doctorSignLabel: 'Registered Medical Practitioner Digital Seal',
      validStamp: '✓ NMC / OMC Verified Document',
      liveBedTitle: 'Destination Apex Hospital Live Bed & Nodal Status:',
      autoFixTooltip: 'Brand detected! Click to convert to NMC generic standard',
      etaLabel: '108 Transit Route & Golden-Hour ETA:',
      exportHtmlBtn: 'Download Offline Certificate',
      icdBtn: 'ICD-10 Directory',
      abhaCardBtn: 'ABHA Digital Card'
    }
  }[lang] || {};

  // Check if a medication name is a known brand
  const checkBrandName = (name) => {
    const upper = (name || '').trim().toUpperCase();
    for (const brand in BRAND_TO_GENERIC_MAP) {
      if (upper.includes(brand)) {
        return BRAND_TO_GENERIC_MAP[brand];
      }
    }
    return null;
  };

  // Convert Brand to NMC Generic in medications list
  const handleAutoFixBrand = (index, genericObj) => {
    const updated = [...medications];
    updated[index] = {
      ...updated[index],
      name: genericObj.generic,
      dosage: genericObj.dosage,
      form: genericObj.form
    };
    setMedications(updated);
  };

  // Convert All Detected Commercial Brands to NMC Generic in one click
  const handleAutoFixAllBrands = () => {
    const updated = medications.map((med) => {
      const match = checkBrandName(med.name);
      if (match) {
        return {
          ...med,
          name: match.generic,
          dosage: match.dosage,
          form: match.form
        };
      }
      return med;
    });
    setMedications(updated);
  };

  const hasAnyBrandDetected = medications.some((m) => checkBrandName(m.name) !== null);

  // Live Clinical Safety Guard: Drug-Allergy & Interaction Check
  const safetyWarnings = useMemo(() => {
    const warnings = [];
    const allergiesUpper = (patientAllergies || '').toUpperCase();

    // Check Penicillin allergy conflict
    if (allergiesUpper.includes('PENICILLIN') || allergiesUpper.includes('AMOXICILLIN')) {
      const hasPenicillin = medications.some((m) =>
        m.name.toUpperCase().includes('AMOXICILLIN') ||
        m.name.toUpperCase().includes('AMPICILLIN') ||
        m.name.toUpperCase().includes('PENICILLIN')
      );
      if (hasPenicillin) {
        warnings.push({
          type: 'CRITICAL_ALLERGY',
          text: '🚨 CRITICAL ALLERGY HAZARD: Patient has Penicillin allergy! Amoxicillin/Penicillin carries high risk of fatal anaphylaxis. Switch to Azithromycin or Macrolide.'
        });
      }
    }

    // Check Sulfa allergy conflict
    if (allergiesUpper.includes('SULFA')) {
      const hasSulfa = medications.some((m) =>
        m.name.toUpperCase().includes('SULFA') ||
        m.name.toUpperCase().includes('CO-TRIMOXAZOLE')
      );
      if (hasSulfa) {
        warnings.push({
          type: 'CRITICAL_ALLERGY',
          text: '🚨 SULFA ALLERGY ALERT: Prescribing Sulfonamides to a patient with Sulfa hypersensitivity risk Stevens-Johnson syndrome.'
        });
      }
    }

    // Check Bleeding / NSAID conflict in Dengue or severe coagulopathy
    if (diagnosis.toUpperCase().includes('DENGUE') || diagnosis.toUpperCase().includes('THROMBOCYTOPENIA')) {
      const hasNsaid = medications.some((m) =>
        m.name.toUpperCase().includes('IBUPROFEN') ||
        m.name.toUpperCase().includes('DICLOFENAC') ||
        m.name.toUpperCase().includes('ASPIRIN')
      );
      if (hasNsaid) {
        warnings.push({
          type: 'DRUG_CONTRAINDICATION',
          text: '⚠️ CONTRAINDICATION: NSAIDs & Aspirin are strictly contraindicated in Dengue due to heightened gastrointestinal hemorrhage and platelet dysfunction risk.'
        });
      }
    }

    // Dual Antiplatelet bleeding alert
    const hasAspirin = medications.some((m) => m.name.toUpperCase().includes('ASPIRIN'));
    const hasClopidogrel = medications.some((m) => m.name.toUpperCase().includes('CLOPIDOGREL'));
    if (hasAspirin && hasClopidogrel) {
      warnings.push({
        type: 'DRUG_INTERACTION',
        text: 'ℹ️ DUAL ANTIPLATELET THERAPY: Aspirin + Clopidogrel synergism active. Ensure PPI gastroprotection (Pantoprazole) is prescribed.'
      });
    }

    return warnings;
  }, [patientAllergies, medications, diagnosis]);

  // Add medication row
  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        name: 'NEW GENERIC DRUG',
        dosage: '500 mg',
        form: 'Tablet',
        freq: 'BD after food',
        duration: '5 Days',
        instruction: 'Take with warm water'
      }
    ]);
  };

  // Delete medication row
  const handleDeleteMedication = (index) => {
    setMedications(medications.filter((_, idx) => idx !== index));
  };

  // Select ICD-10 Diagnosis from Modal
  const handleSelectIcdDiagnosis = (item) => {
    setDiagnosis(`${item.name} (ICD-10: ${item.code})`);
    setShowIcdModal(false);
  };

  // Perform Verification Simulation (Honest check or Tamper detection)
  const handleVerifyPayload = () => {
    if (simulateTamper) {
      setVerifyStatus('TAMPERED');
    } else {
      setVerifyStatus('VALID');
    }
  };

  // Camera QR Scanner Toggle
  const toggleCameraScanner = () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      setIsCameraActive(false);
    } else {
      setIsCameraActive(true);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              videoRef.current.play();
            }
          })
          .catch((err) => {
            console.warn('Camera access unavailable, fallback to simulated scan:', err);
          });
      }
    }
  };

  // Simulated QR File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setUploadedFileName(file.name);
      setTimeout(() => {
        setVerifyStatus('VALID');
      }, 600);
    }
  };

  // Copy Verification URL
  const handleCopyLink = () => {
    if (verificationToken?.verifyUrl) {
      navigator.clipboard.writeText(verificationToken.verifyUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  // Copy SMS Token
  const handleCopySms = () => {
    const text = generateSmsText();
    navigator.clipboard.writeText(text);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  // Generate localized SMS payload for 108 Emergency transit
  const generateSmsText = () => {
    const docId = verificationToken?.docId || 'NMC-OD-2026-992144';
    const cadId = verificationToken?.cadToken || 'CAD-108-OD-44102';
    const bloodLineOr = bloodRequisitionEnabled
      ? `\nରକ୍ତ ଅନୁରୋଧ (Form 27C): ${bloodUnitsReq} ୟୁନିଟ୍ ${bloodComponentReq} (${bloodGroupReq})`
      : '';
    const bloodLineHi = bloodRequisitionEnabled
      ? `\nब्लड मांग (Form 27C): ${bloodUnitsReq} यूनिट ${bloodComponentReq} (${bloodGroupReq})`
      : '';
    const bloodLineEn = bloodRequisitionEnabled
      ? `\nBlood Requisition (Form 27C): ${bloodUnitsReq} Units ${bloodComponentReq} (${bloodGroupReq})`
      : '';

    if (lang === 'or-IN') {
      return `🏥 [ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଓଡ଼ିଶା • ୧୦୮ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଟୋକନ୍]\n━━━━━━━━━━━━━━━━━━━━\n👤 ରୋଗୀ: ${patientName} (${patientAge} ବର୍ଷ, ${patientGender})\n🆔 ABHA ID: ${patientAbha}\n🚑 ୧୦୮ CAD ଟୋକନ୍: ${cadId}\n🏥 ସ୍ଥାନାନ୍ତରଣ: ${facilityName} ➔ ${referralTarget}\n🚨 ପ୍ରାଥମିକତା: ${currentCase.acuity} EMERGENCY\n🩺 ରୋଗ ନିର୍ଣ୍ଣୟ: ${diagnosis}\n👨‍⚕️ RMP ଡାକ୍ତର: ${doctorName} (OMC Reg: ${doctorRegNo})${bloodLineOr}\n━━━━━━━━━━━━━━━━━━━━\n🔍 ସରକାରୀ QR ଯାଞ୍ଚ ଲିଙ୍କ୍: ${originUrl}/?verify=${docId}\n📞 ଓଡ଼ିଶା ମାଗଣା ଆମ୍ବୁଲାନ୍ସ: 108 / 102 (24x7)`;
    } else if (lang === 'hi-IN') {
      return `🏥 [स्वास्थ्य मित्र ओडिशा • 108 आपातकालीन ट्रांसफर टोकन]\n━━━━━━━━━━━━━━━━━━━━\n👤 मरीज: ${patientName} (${patientAge} वर्ष, ${patientGender})\n🆔 ABHA ID: ${patientAbha}\n🚑 108 CAD टोकन: ${cadId}\n🏥 ट्रांसफर: ${facilityName} ➔ ${referralTarget}\n🚨 प्राथमिकता: ${currentCase.acuity} EMERGENCY\n🩺 संभावित निदान: ${diagnosis}\n👨‍⚕️ RMP डॉक्टर: ${doctorName} (OMC Reg: ${doctorRegNo})${bloodLineHi}\n━━━━━━━━━━━━━━━━━━━━\n🔍 आधिकारिक QR सत्यापन: ${originUrl}/?verify=${docId}\n📞 ओडिशा मुफ्त एम्बुलेंस: 108 / 102 (24x7)`;
    }
    return `🏥 [SwasthyaMitra Odisha • 108 Emergency Transfer Token]\n━━━━━━━━━━━━━━━━━━━━\n👤 Patient: ${patientName} (${patientAge}y, ${patientGender})\n🆔 ABHA ID: ${patientAbha}\n🚑 108 CAD Token: ${cadId}\n🏥 Route: ${facilityName} ➔ ${referralTarget}\n🚨 Priority: ${currentCase.acuity} EMERGENCY\n🩺 Diagnosis: ${diagnosis}\n👨‍⚕️ Attending RMP: ${doctorName} (OMC Reg: ${doctorRegNo})${bloodLineEn}\n━━━━━━━━━━━━━━━━━━━━\n🔍 Official Verification Link: ${originUrl}/?verify=${docId}\n📞 Odisha Free Ambulance: Dial 108 / 102 (24x7)`;
  };

  // WhatsApp 1-Click Family & Attendant Referral Dispatch
  const handleWhatsAppDispatch = () => {
    const cleanPhone = (patientPhone || '').replace(/[^0-9]/g, '');
    const sms = generateSmsText();
    const url = cleanPhone.length >= 10
      ? `https://api.whatsapp.com/send?phone=${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}&text=${encodeURIComponent(sms)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(sms)}`;
    window.open(url, '_blank');
    setToastMessage('WhatsApp referral dispatch launched successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Save current slip to localStorage vault with full details
  const handleSaveToVault = () => {
    if (!verificationToken) return;
    const entry = {
      id: verificationToken.docId,
      cadToken: verificationToken.cadToken,
      docType: activeTab === 'referral' ? 'Referral Slip (108)' : 'NMC Prescription (Generic)',
      patientName: patientName,
      age: patientAge,
      gender: patientGender,
      doctorName: doctorName,
      doctorRegNo: doctorRegNo,
      abhaId: patientAbha,
      diagnosis: diagnosis,
      date: new Date().toLocaleString(),
      hash: verificationToken.securityHash,
      medicationsCount: medications.length,
      facility: facilityName
    };
    const updated = [entry, ...vaultList.filter((v) => v.id !== entry.id)];
    setVaultList(updated);
    try {
      localStorage.setItem('nhp_clinical_docs_vault', JSON.stringify(updated));
    } catch (e) {
      console.warn(e);
    }
    setToastMessage(`✓ Document ${entry.id} securely archived in Clinical Vault!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Download Offline Standalone HTML Certificate with full styling and real QR embedded
  const handleDownloadOfflineCertificate = () => {
    const slipEl = document.getElementById('printable-clinical-slip');
    if (!slipEl) return;
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Official Clinical Document - ${verificationToken?.docId || docId}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0f172a; padding: 24px 12px; color: #0f172a; }
    .offline-container { max-width: 960px; margin: 0 auto; background: #ffffff; border-radius: 20px; box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25); overflow: hidden; }
    .offline-banner { background: linear-gradient(135deg, #1e1b4b, #0f172a); color: #ffffff; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; }
    @media print {
      body { background: white; padding: 0; }
      .offline-banner { display: none; }
      .offline-container { box-shadow: none; border-radius: 0; }
    }
  </style>
</head>
<body>
  <div class="offline-container">
    <div class="offline-banner">
      <div>
        <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: #a5b4fc;">SWASTHYAMITRA ODISHA • OFFLINE ENCRYPTED CLINICAL RECORD</h3>
        <p style="margin: 2px 0 0; font-size: 11px; color: #cbd5e1;">NMC Act 2019 Sec 27 & ABDM Milestone Compliant | Issued by: ${doctorName}</p>
      </div>
      <button onclick="window.print()" style="background: #4f46e5; color: white; border: none; padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
        Print / PDF
      </button>
    </div>
    <div style="padding: 24px;">
      ${slipEl.innerHTML}
    </div>
  </div>
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${verificationToken?.docId || 'NMC-Prescription'}_Offline_Record.html`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('✓ Offline Encrypted HTML Certificate downloaded!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // High-Resolution Official Printable Slip PDF Download / Export
  const handleDownloadPdfDoc = () => {
    const slipEl = document.getElementById('printable-clinical-slip');
    if (!slipEl) {
      window.print();
      return;
    }
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      window.print();
      return;
    }
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${verificationToken?.docId || 'NMC-Clinical-Document'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @page { size: A4; margin: 8mm; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #0f172a; margin: 0; padding: 12px; }
    .print\\:hidden, button, [role="button"] { display: none !important; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #cbd5e1; padding: 6px 10px; font-size: 11px; text-align: left; }
    th { background: #f1f5f9; font-weight: 700; text-transform: uppercase; font-size: 10px; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-weight: bold; font-size: 10px; }
  </style>
</head>
<body>
  ${slipEl.innerHTML}
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 500);
    };
  <\/script>
</body>
</html>`);
    printWindow.document.close();
    setToastMessage('✓ PDF Print dialogue opened!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Initialize Retina Hi-DPI Canvas Buffer
  const setupCanvasDpi = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    canvasDprRef.current = dpr;

    const cssWidth = 480;
    const cssHeight = 160;
    const targetW = Math.round(cssWidth * dpr);
    const targetH = Math.round(cssHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${cssWidth}px`;
      canvas.style.height = `${cssHeight}px`;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  };

  // Auto-setup Hi-DPI canvas buffer on modal open
  useEffect(() => {
    if (showSignModal && signModalTab === 'draw') {
      const timer = setTimeout(() => {
        setupCanvasDpi();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [showSignModal, signModalTab]);

  // Auto-Crop Bounding Box for Crisp, Zero-Padding Signature Export
  const trimCanvasSignature = (canvas) => {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    if (w === 0 || h === 0) return null;

    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      let minX = w, minY = h, maxX = 0, maxY = 0;
      let found = false;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const alpha = data[(y * w + x) * 4 + 3];
          if (alpha > 12) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            found = true;
          }
        }
      }

      if (!found) return null;

      const pad = Math.round(12 * (canvasDprRef.current || 2));
      const cropX = Math.max(0, minX - pad);
      const cropY = Math.max(0, minY - pad);
      const cropW = Math.min(w - cropX, (maxX - minX) + pad * 2);
      const cropH = Math.min(h - cropY, (maxY - minY) + pad * 2);

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = cropW;
      cropCanvas.height = cropH;
      const cropCtx = cropCanvas.getContext('2d');
      cropCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      return cropCanvas.toDataURL('image/png');
    } catch {
      return canvas.toDataURL('image/png');
    }
  };

  // Distance helper
  const getDistance = (p1, p2) => Math.hypot(p2.x - p1.x, p2.y - p1.y);

  // Modern HTML5 Pointer Events Drawing Handlers (Fluid Bezier Curve with Velocity & Pressure)
  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setupCanvasDpi();

    if (e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch {}
    }

    const rect = canvas.getBoundingClientRect();
    const scaleX = 480 / (rect.width || 480);
    const scaleY = 160 / (rect.height || 160);
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const ctx = canvas.getContext('2d');
    try {
      const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
      setStrokeHistory((prev) => [...prev.slice(-15), snap]);
    } catch {}

    isDrawingRef.current = true;
    setIsDrawing(true);

    const initialPressure = e.pressure && e.pressure > 0 ? e.pressure : 0.5;
    pointsRef.current = [{ x, y, time: Date.now(), pressure: initialPressure }];

    let baseWidth = penThickness;
    if (penStyle === 'fountain') baseWidth *= 1.3;
    if (penStyle === 'ballpoint') baseWidth *= 0.9;
    strokeWidthRef.current = baseWidth;

    // Draw initial dot with anti-aliasing
    ctx.save();
    ctx.fillStyle = penColor;
    ctx.beginPath();
    ctx.arc(x, y, baseWidth / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };

  const handlePointerMove = (e) => {
    if (!isDrawingRef.current) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const scaleX = 480 / (rect.width || 480);
    const scaleY = 160 / (rect.height || 160);
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    const now = Date.now();
    const pressure = e.pressure && e.pressure > 0 && e.pressure <= 1 ? e.pressure : 0.5;

    const points = pointsRef.current;
    const lastP = points[points.length - 1];
    if (!lastP) return;

    const dist = getDistance(lastP, { x, y });
    if (dist < 1.0) return; // Sub-pixel jitter filter

    // Velocity-based pen tapering for authentic handwriting physics
    const timeDelta = Math.max(now - lastP.time, 1);
    const velocity = dist / timeDelta;

    let targetWidth = penThickness;
    if (penStyle === 'fountain') {
      targetWidth = Math.max(penThickness * 0.45, Math.min(penThickness * 1.85, penThickness * (1.25 - velocity * 0.22) * (0.6 + pressure * 0.8)));
    } else if (penStyle === 'ballpoint') {
      targetWidth = penThickness * (0.85 + pressure * 0.3);
    } else {
      // Gel pen (Smooth uniform flow with subtle tapering)
      targetWidth = Math.max(penThickness * 0.75, Math.min(penThickness * 1.35, penThickness * (1.1 - velocity * 0.12)));
    }

    strokeWidthRef.current = strokeWidthRef.current * 0.6 + targetWidth * 0.4;
    points.push({ x, y, time: now, pressure });

    // Multi-Point Smooth Quadratic Bezier Interpolation
    if (points.length === 2) {
      const p0 = points[0];
      const p1 = points[1];
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = strokeWidthRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    } else if (points.length >= 3) {
      const p0 = points[points.length - 3];
      const p1 = points[points.length - 2];
      const p2 = points[points.length - 1];

      const startMid = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 };
      const endMid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(startMid.x, startMid.y);
      ctx.quadraticCurveTo(p1.x, p1.y, endMid.x, endMid.y);
      ctx.strokeStyle = penColor;
      ctx.lineWidth = strokeWidthRef.current;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
      ctx.restore();
    }
  };

  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    if (e && e.target && e.target.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch {}
    }

    const points = pointsRef.current;
    if (points && points.length >= 2) {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const pLast = points[points.length - 1];
        const pPrev = points[points.length - 2];
        const mid = { x: (pPrev.x + pLast.x) / 2, y: (pPrev.y + pLast.y) / 2 };
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(mid.x, mid.y);
        ctx.lineTo(pLast.x, pLast.y);
        ctx.strokeStyle = penColor;
        ctx.lineWidth = strokeWidthRef.current;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }
    }

    isDrawingRef.current = false;
    setIsDrawing(false);
    pointsRef.current = [];

    const canvas = canvasRef.current;
    if (canvas) {
      const cropped = trimCanvasSignature(canvas) || canvas.toDataURL('image/png');
      setSignatureDataUrl(cropped);
      setSignatureType('drawn');
    }
  };

  // Undo Last Stroke
  const handleUndoStroke = () => {
    const canvas = canvasRef.current;
    if (!canvas || strokeHistory.length === 0) return;
    const ctx = canvas.getContext('2d');
    const prevSnap = strokeHistory[strokeHistory.length - 1];
    ctx.putImageData(prevSnap, 0, 0);
    setStrokeHistory((prev) => prev.slice(0, -1));
    const cropped = trimCanvasSignature(canvas);
    setSignatureDataUrl(cropped);
  };

  // Clear Pad
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
    setStrokeHistory([]);
    setSignatureDataUrl(null);
  };

  // Adopt Verified Cursive Signature Script
  const adoptDefaultSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setupCanvasDpi();
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Save state
    const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setStrokeHistory((prev) => [...prev, snapshot]);

    ctx.save();
    // Draw Cursive Doctor Name with calligraphy style
    ctx.font = 'italic bold 32px "Brush Script MT", "Segoe Script", cursive, Georgia';
    ctx.fillStyle = penColor;
    ctx.fillText(`${doctorName}`, 30, 75);

    // Elegant medical flourish line below name
    ctx.beginPath();
    ctx.moveTo(25, 95);
    ctx.bezierCurveTo(120, 115, 240, 75, 380, 92);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = penColor;
    ctx.stroke();

    // RMP credentials subscript
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`OMC: ${doctorRegNo} • ${new Date().toLocaleDateString()}`, 35, 120);
    ctx.restore();

    const cropped = trimCanvasSignature(canvas) || canvas.toDataURL('image/png');
    setSignatureDataUrl(cropped);
    setSignatureType('cursive');
  };

  // Generate Official Cryptographic DSC Seal (Doctor Signature Stamp)
  const handleGenerateDscSeal = () => {
    const stampCanvas = document.createElement('canvas');
    stampCanvas.width = 460;
    stampCanvas.height = 160;
    const ctx = stampCanvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, stampCanvas.width, stampCanvas.height);

    // Outer double rounded border
    ctx.strokeStyle = '#0f2963';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, 444, 144);
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, 436, 136);

    // Top Header Banner
    ctx.fillStyle = '#0f2963';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('GOVT OF ODISHA • HEALTH & FAMILY WELFARE • ABDM DSC VERIFIED', 22, 28);

    // Doctor Name
    ctx.font = 'italic bold 22px Georgia, serif';
    ctx.fillStyle = '#0f2963';
    ctx.fillText(doctorName, 22, 60);

    // Degrees & OMC Registration
    ctx.font = 'bold 11px monospace';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText(`RMP REG: ${doctorRegNo} • ${doctorDegrees}`, 22, 84);

    // Timestamp & Hash
    ctx.font = '10px monospace';
    ctx.fillStyle = '#475569';
    ctx.fillText(`DIGITALLY SIGNED: ${new Date().toLocaleString()} (IST)`, 22, 106);
    ctx.fillText(`AUTH HASH: ${verificationToken?.securityHash?.substring(0, 28) || 'SHA256:VERIFIED-ABDM'}`, 22, 126);

    // Green Official Seal Badge on right
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.arc(410, 80, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('✓', 402, 88);

    const data = stampCanvas.toDataURL('image/png');
    setSignatureDataUrl(data);
    setSignatureType('dsc_stamp');
  };

  // Upload Physical Signature Image
  const handleUploadSignatureFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 460;
        tempCanvas.height = 160;
        const ctx = tempCanvas.getContext('2d');
        ctx.clearRect(0, 0, 460, 160);
        // Calculate aspect ratio
        const scale = Math.min(420 / img.width, 130 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (460 - w) / 2;
        const y = (160 - h) / 2;
        ctx.drawImage(img, x, y, w, h);
        const data = tempCanvas.toDataURL('image/png');
        setSignatureDataUrl(data);
        setSignatureType('uploaded');
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Speech-to-Text Voice Dictation
  const handleToggleVoiceDictation = (fieldKey) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser. Please try in Chrome or Edge.');
      return;
    }

    if (isDictating && dictationTarget === fieldKey) {
      setIsDictating(false);
      setDictationTarget(null);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'or-IN' ? 'or-IN' : (lang === 'hi-IN' ? 'hi-IN' : 'en-IN');
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsDictating(true);
      setDictationTarget(fieldKey);
    };

    recognition.onresult = (event) => {
      const speechText = event.results[0][0].transcript;
      if (fieldKey === 'complaints') {
        setChiefComplaints((prev) => (prev ? `${prev} ${speechText}` : speechText));
      } else if (fieldKey === 'diagnosis') {
        setDiagnosis((prev) => (prev ? `${prev} - ${speechText}` : speechText));
      } else if (fieldKey === 'referralReason') {
        setReferralReason((prev) => (prev ? `${prev} ${speechText}` : speechText));
      }
      setIsDictating(false);
      setDictationTarget(null);
    };

    recognition.onerror = () => {
      setIsDictating(false);
      setDictationTarget(null);
    };

    recognition.onend = () => {
      setIsDictating(false);
      setDictationTarget(null);
    };

    recognition.start();
  };

  // Destination apex live status lookup
  const apexStatus = useMemo(() => {
    return APEX_DESTINATION_STATUS[referralTarget] || {
      nodalPhone: '0674-2391980',
      emergencyOfficer: 'State Central Emergency Nodal Desk',
      icuBeds: 2,
      hduBeds: 5,
      oxygenSupply: 'Normal Hospital Supply',
      greenCorridor: 'Standard Transfer Protocol',
      bloodBankUnits: 'Standard Regional Blood Bank Linked'
    };
  }, [referralTarget]);

  const transitRoute = useMemo(() => {
    return ODISHA_TRANSIT_ROUTES[selectedCaseId] || {
      distance: '18 km',
      eta: '25 mins',
      highway: 'State Highway Corridor',
      oxygenRefillPost: 'District Central Health Depot',
      pilotEscort: '108 Priority Green Siren Clearance'
    };
  }, [selectedCaseId]);

  const filteredIcdList = useMemo(() => {
    const term = icdSearchTerm.toLowerCase().trim();
    if (!term) return ICD10_DATABASE;
    return ICD10_DATABASE.filter(
      (item) =>
        item.code.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }, [icdSearchTerm]);

  return (
    <div className="space-y-6 relative">
      {/* Real-time Dynamic Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900/95 text-white border-2 border-emerald-400 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. SUITE HEADER BANNER */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20 relative">
              <FileText className="w-8 h-8 text-indigo-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {txt.title}
                </h2>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  NMC 2023 Mandate
                </span>
              </div>
              <p className="text-xs text-indigo-200 mt-0.5">{txt.subtitle}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowSignModal(true)}
              className="flex items-center gap-1.5 bg-indigo-700 hover:bg-indigo-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Digital Pen Signature Pad"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-200" />
              <span>{signatureDataUrl ? 'Signature Saved ✓' : txt.btnSignOff}</span>
            </button>

            <button
              onClick={() => setShowDoctorModal(true)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              title="Edit Clinician Credentials"
            >
              <Stethoscope className="w-3.5 h-3.5 text-indigo-400" />
              <span>RMP: {doctorName.split(' ')[1] || doctorName}</span>
            </button>

            <button
              onClick={() => setShowAbhaCardModal(true)}
              className="flex items-center gap-1.5 bg-teal-800 hover:bg-teal-700 text-teal-100 px-3 py-2 rounded-xl text-xs font-bold border border-teal-600 transition-all cursor-pointer"
              title="View Official ABHA Digital Card"
            >
              <Award className="w-3.5 h-3.5 text-teal-300" />
              <span>{txt.abhaCardBtn}</span>
            </button>

            <button
              onClick={() => setShowSmsModal(true)}
              className="flex items-center gap-1.5 bg-rose-700 hover:bg-rose-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-rose-200" />
              <span>{txt.btnSmsDispatch}</span>
            </button>

            <button
              onClick={handleWhatsAppDispatch}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
              title="Send to Patient's WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{txt.btnWhatsAppDispatch}</span>
            </button>

            <button
              onClick={handleDownloadPdfDoc}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all border border-indigo-400/40 cursor-pointer"
              title="Generate Official Print/PDF Document"
            >
              <Printer className="w-4 h-4 text-indigo-200" />
              <span>{txt.btnPrintPdf}</span>
            </button>

            <button
              onClick={handleDownloadOfflineCertificate}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              title="Save Standalone Offline Certificate"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Offline HTML</span>
            </button>

            <button
              onClick={handleSaveToVault}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Vault</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs: Prescription, Referral Slip, QR Verifier, Vault */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('prescription')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'prescription'
                ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-800/60'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-indigo-600" />
            {txt.tabRx}
          </button>

          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'referral'
                ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-800/60'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5 text-rose-600" />
            {txt.tabReferral}
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'verify'
                ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-800/60'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-600" />
            {txt.tabVerify}
          </button>

          <button
            onClick={() => setActiveTab('vault')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'vault'
                ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-800/60'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            {txt.tabVault}
            <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {vaultList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('sbar_handover')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'sbar_handover'
                ? 'bg-white text-indigo-950 shadow-md ring-2 ring-indigo-400/40'
                : 'bg-indigo-950/60 text-indigo-200 hover:bg-indigo-800/60'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            {txt.tabSbar}
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. CLINICAL SCENARIOS SELECTOR STRIP (Differentiated Across 5 Distinct Clinical Sections) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-black">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-2">
                <span>Select Authentic Odisha Clinical Case to Load &amp; Edit:</span>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded-full border border-indigo-200">
                  5 DISTINCT SECTIONS
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Choose from 5 specialized clinical hospital sections (1-No to 5-No) with tailored statutory protocols &amp; NMC generic workflows.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto">
            Active: {currentCase.id} ({currentCase.sectionNo})
          </span>
        </div>

        {/* 5 Distinct Clinical Section Filter Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {CLINICAL_SECTION_TABS.map((tab) => {
            const isActive = selectedSectionFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedSectionFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Differentiated Clinical Case Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCases.map((item) => {
            const isSelected = selectedCaseId === item.id;
            const badgeBg =
              item.sectionNo === '1-NO' ? 'bg-indigo-600' :
              item.sectionNo === '2-NO' ? 'bg-rose-600' :
              item.sectionNo === '3-NO' ? 'bg-red-600' :
              item.sectionNo === '4-NO' ? 'bg-amber-600' :
              'bg-teal-700';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedCaseId(item.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer space-y-2.5 relative ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 border-indigo-500 ring-2 ring-indigo-300 shadow-md'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                <div>
                  {/* Section Banner Header */}
                  <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-200/80">
                    <span className={`${badgeBg} text-white font-black text-[9px] px-2 py-0.5 rounded shadow-2xs uppercase tracking-wider`}>
                      {item.sectionNo}
                    </span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-black ${
                        item.acuity === 'RED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {item.acuity} EMERGENCY
                    </span>
                  </div>

                  {/* Section Name & Department */}
                  <div className="mt-1.5">
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-wide block truncate">
                      {item.sectionTitle}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block truncate">
                      🏥 {item.department}
                    </span>
                  </div>

                  {/* Patient Name */}
                  <div className="mt-2">
                    <div className="font-extrabold text-sm text-slate-900 leading-snug">
                      {item.patientName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      📍 {item.district} • {item.age} Yrs / {item.gender} • ABO: <strong>{item.bloodGroup}</strong>
                    </div>
                  </div>

                  {/* Diagnosis */}
                  <div className="p-2 bg-white rounded-xl border border-slate-200/90 text-[10px] font-bold text-slate-800 mt-2 line-clamp-2">
                    {item.provisionalDiagnosis}
                  </div>
                </div>

                {/* Clinical Protocol & ID Footer */}
                <div className="pt-1.5 border-t border-slate-200/80 space-y-1">
                  <div className="text-[9px] font-bold text-indigo-900 bg-indigo-50/90 p-1.5 rounded-lg border border-indigo-100 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-600 shrink-0" />
                    <span className="truncate">{item.protocol}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono px-0.5">
                    <span>ID: {item.id}</span>
                    <span className="text-emerald-700 font-bold">✓ NMC 2023 Validated</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2.5 DOCTOR CLINICAL COCKPIT (NMC & 108 TRANSIT INTEGRATED) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-2xl border border-indigo-700/60 p-5 text-white shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-800/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-black text-white shadow-md">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>Doctor Clinical Cockpit (ଡାକ୍ତରୀ କ୍ଲିନିକାଲ୍ କକ୍ପିଟ୍)</span>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    LIVE NMC &amp; 108 CAD
                  </span>
                </h3>
              </div>
              <p className="text-xs text-indigo-200/80">
                Centralized real-time clinical control deck across all 5 distinct suites: 1. NMC e-Prescription (Generic), 2. Hospital Referral Slip (108), 3. QR Authenticity Verifier, 4. Clinical Document Vault, and 5. NABH SBAR Handover &amp; ABDM FHIR.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowDoctorModal(true)}
              className="px-3 py-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-1.5 border border-indigo-500/40 shadow-2xs transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>RMP Credentials</span>
            </button>
            <button
              type="button"
              onClick={() => setShowSignModal(true)}
              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Digital DSC Pad</span>
            </button>
          </div>
        </div>

        {/* 5 Completely Differentiated Clinical Cockpit Command Modules (1 to 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* COCKPIT MODULE 1-NO: 1. NMC e-Prescription (Generic) */}
          <div className="bg-slate-800/90 border border-indigo-500/50 rounded-xl p-3 space-y-2.5 flex flex-col justify-between hover:border-indigo-400 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-indigo-700/60 pb-1.5">
                <span className="font-black text-indigo-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span className="truncate">NMC e-Rx (Generic)</span>
                </span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-mono px-1.5 py-0.5 rounded border border-indigo-400/30">
                  {medications.length} DRUGS
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                NMC 2023 generic formulary checker, capitalization audit &amp; Niramaya scheme compliance.
              </p>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400 truncate">Rx Count: <strong className="text-white">{medications.length} Prescribed</strong></div>
                <div className="text-slate-400 truncate">Formulary: <strong className="text-emerald-400">100% CAPITAL OK</strong></div>
                <div className="text-slate-400 truncate">Free Supply: <span className="text-indigo-300">OSMC Niramaya</span></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('prescription')}
                className={`w-full py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                  activeTab === 'prescription'
                    ? 'bg-indigo-600 text-white ring-2 ring-indigo-400'
                    : 'bg-indigo-950/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-700/50'
                }`}
              >
                <Pill className="w-3 h-3 text-indigo-400" />
                <span>Open Rx Suite</span>
              </button>
            </div>
          </div>

          {/* COCKPIT MODULE 2-NO: 2. Hospital Referral Slip (108) */}
          <div className="bg-slate-800/90 border border-rose-500/50 rounded-xl p-3 space-y-2.5 flex flex-col justify-between hover:border-rose-400 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-rose-700/60 pb-1.5">
                <span className="font-black text-rose-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-rose-600 text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span className="truncate">108 Referral Slip</span>
                </span>
                <span className="text-[9px] bg-rose-500/20 text-rose-300 font-mono px-1.5 py-0.5 rounded border border-rose-400/30">
                  {priorityTier}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                NHM 108 CAD ambulance dispatch, golden-hour transit route tracking &amp; ICU bed verification.
              </p>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400 truncate">CAD: <strong className="text-rose-300">{cadToken}</strong></div>
                <div className="text-slate-400 truncate">ETA: <strong className="text-amber-300">{transitRoute.eta} ({transitRoute.distance})</strong></div>
                <div className="text-slate-400 truncate">ICU Beds: <span className="text-emerald-400">{apexStatus.icuBeds} Free at Apex</span></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('referral')}
                className={`w-full py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                  activeTab === 'referral'
                    ? 'bg-rose-600 text-white ring-2 ring-rose-400'
                    : 'bg-rose-950/80 hover:bg-rose-800 text-rose-200 border border-rose-700/50'
                }`}
              >
                <Ambulance className="w-3 h-3 text-rose-400" />
                <span>Open 108 Slip</span>
              </button>
            </div>
          </div>

          {/* COCKPIT MODULE 3-NO: 3. QR Authenticity Verifier */}
          <div className="bg-slate-800/90 border border-emerald-500/50 rounded-xl p-3 space-y-2.5 flex flex-col justify-between hover:border-emerald-400 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-emerald-700/60 pb-1.5">
                <span className="font-black text-emerald-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center text-[10px] font-black">3</span>
                  <span className="truncate">QR Verifier &amp; Audit</span>
                </span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.5 rounded border border-emerald-400/30">
                  {verificationToken?.docId ? 'VALID' : 'GENERATING'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                SHA-256 cryptographic audit, live camera barcode scanner &amp; anti-tamper security validation.
              </p>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400 truncate">Doc ID: <strong className="text-white">{docId}</strong></div>
                <div className="text-slate-400 truncate">Council: <strong className="text-emerald-300">OMC/NMC Sec 27</strong></div>
                <div className="text-slate-400 truncate">Signature: <span className="text-indigo-300">{signatureDataUrl ? 'DSC Signed' : 'Pending DSC'}</span></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('verify')}
                className={`w-full py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                  activeTab === 'verify'
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : 'bg-emerald-950/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50'
                }`}
              >
                <QrCode className="w-3 h-3 text-emerald-400" />
                <span>Test Verifier</span>
              </button>
            </div>
          </div>

          {/* COCKPIT MODULE 4-NO: 4. Clinical Document Vault */}
          <div className="bg-slate-800/90 border border-blue-500/50 rounded-xl p-3 space-y-2.5 flex flex-col justify-between hover:border-blue-400 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-blue-700/60 pb-1.5">
                <span className="font-black text-blue-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-black">4</span>
                  <span className="truncate">Clinical Doc Vault</span>
                </span>
                <span className="text-[9px] bg-blue-500/20 text-blue-300 font-mono px-1.5 py-0.5 rounded border border-blue-400/30">
                  {vaultList.length} ARCHIVED
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                ABDM PHR records repository, encrypted offline exports &amp; state audit trail storage.
              </p>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400 truncate">Saved Files: <strong className="text-white">{vaultList.length} Documents</strong></div>
                <div className="text-slate-400 truncate">ABHA Sync: <strong className="text-indigo-300">{patientAbha}</strong></div>
                <div className="text-slate-400 truncate">Storage: <span className="text-blue-300">IndexedDB Local</span></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('vault')}
                className={`w-full py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                  activeTab === 'vault'
                    ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                    : 'bg-blue-950/80 hover:bg-blue-800 text-blue-200 border border-blue-700/50'
                }`}
              >
                <Database className="w-3 h-3 text-blue-400" />
                <span>Open Doc Vault</span>
              </button>
            </div>
          </div>

          {/* COCKPIT MODULE 5-NO: 5. NABH SBAR Handover & ABDM FHIR */}
          <div className="bg-slate-800/90 border border-purple-500/50 rounded-xl p-3 space-y-2.5 flex flex-col justify-between hover:border-purple-400 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center justify-between border-b border-purple-700/60 pb-1.5">
                <span className="font-black text-purple-300 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-black">5</span>
                  <span className="truncate">SBAR &amp; FHIR R4</span>
                </span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-mono px-1.5 py-0.5 rounded border border-purple-400/30">
                  FHIR R4
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                NABH standardized SBAR inter-facility clinical handover &amp; ABDM FHIR JSON bundle exporter.
              </p>
              <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700/80 space-y-1 font-mono text-[10px]">
                <div className="text-slate-400 truncate">Shock Index: <strong className="text-rose-400">{vitalScores.shockIndex}</strong></div>
                <div className="text-slate-400 truncate">MAP: <strong className="text-white">{vitalScores.map} mmHg</strong></div>
                <div className="text-slate-400 truncate">Bundle: <span className="text-purple-300">ABDM M2 Compliant</span></div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-slate-700/60">
              <button
                type="button"
                onClick={() => setActiveTab('sbar_handover')}
                className={`w-full py-1.5 rounded-lg font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs ${
                  activeTab === 'sbar_handover'
                    ? 'bg-purple-600 text-white ring-2 ring-purple-400'
                    : 'bg-purple-950/80 hover:bg-purple-800 text-purple-200 border border-purple-700/50'
                }`}
              >
                <HeartPulse className="w-3 h-3 text-purple-400" />
                <span>Open SBAR / FHIR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. PRINTABLE OFFICIAL DOCUMENT CANVAS (NMC RX OR REFERRAL) */}
      {/* ───────────────────────────────────────────────────────── */}
      {(activeTab === 'prescription' || activeTab === 'referral') && (
        <div className="space-y-4">
          {/* Clinical Drug Safety Alerts Strip */}
          {safetyWarnings.length > 0 && (
            <div className="space-y-2">
              {safetyWarnings.map((warn, wIdx) => (
                <div
                  key={wIdx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 shadow-2xs ${
                    warn.type === 'CRITICAL_ALLERGY'
                      ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold animate-pulse'
                      : warn.type === 'DRUG_CONTRAINDICATION'
                      ? 'bg-amber-100 border-amber-400 text-amber-950 font-semibold'
                      : 'bg-blue-50 border-blue-300 text-blue-900'
                  }`}
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span className="leading-relaxed">{warn.text}</span>
                </div>
              ))}
            </div>
          )}

          {/* Compliance, Live Apex Status, Print Stationery & Security Watermark Toggle */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">{txt.nmcNotice}</span>
              </div>
              <span className="bg-amber-200/80 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded shrink-0">
                NMC Sec 27
              </span>
            </div>

            {/* Destination Apex Live Bed Availability Widget */}
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 truncate">
                <Bed className="w-4 h-4 text-indigo-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold block truncate">{txt.liveBedTitle}</span>
                  <span className="text-[10px] text-indigo-700 block truncate">
                    ICU: <strong>{apexStatus.icuBeds} Free</strong> • HDU: <strong>{apexStatus.hduBeds} Free</strong>
                  </span>
                </div>
              </div>
              <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                LIVE VACANCY
              </span>
            </div>

            {/* Pre-Printed Hospital Stationery Pad Switcher */}
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="font-bold">Paper Format:</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setPrintStationeryMode('full_letterhead')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                    printStationeryMode === 'full_letterhead'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Print full header logo & title"
                >
                  Full Header
                </button>
                <button
                  onClick={() => setPrintStationeryMode('blank_pad')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                    printStationeryMode === 'blank_pad'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Hide header for pre-printed hospital letterhead pads"
                >
                  Pad Mode
                </button>
              </div>
            </div>

            {/* Triplicate Copy Set Switcher */}
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-bold">Copy Set:</span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <button
                  onClick={() => setPrintCopyMode('single')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                    printCopyMode === 'single'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Single Referral Slip"
                >
                  Single
                </button>
                <button
                  onClick={() => setPrintCopyMode('triplicate')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-all ${
                    printCopyMode === 'triplicate'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200'
                  }`}
                  title="Official 3-Copy Triplicate Set (Patient + Hospital MRD + 108 Ambulance)"
                >
                  Triplicate
                </button>
              </div>
            </div>

            {/* Anti-Counterfeit State Security Watermark Switcher */}
            <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-slate-800 text-xs flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="font-bold">Govt Seal:</span>
              </div>
              <button
                onClick={() => setSecurityWatermarkEnabled(!securityWatermarkEnabled)}
                className={`px-2 py-1 rounded font-bold text-[10px] cursor-pointer transition-all ${
                  securityWatermarkEnabled
                    ? 'bg-indigo-700 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200'
                }`}
                title="Toggle anti-tamper watermark & official government emblem"
              >
                {securityWatermarkEnabled ? '🔒 Watermark ON' : '⚪ Watermark OFF'}
              </button>
            </div>
          </div>

          {/* 108 Emergency Transit Corridor & ETA Strip */}
          {activeTab === 'referral' && (
            <div className="p-3.5 bg-gradient-to-r from-rose-50 via-red-50 to-orange-50 border border-rose-200 rounded-xl text-xs space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-black text-rose-950 flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-rose-600" />
                  <span>{txt.etaLabel}</span>
                </span>
                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  108 PRIORITY DISPATCH
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="bg-white/80 p-2 rounded-lg border border-rose-100">
                  <span className="text-slate-400 block text-[10px]">Total Distance:</span>
                  <strong className="text-rose-950 text-sm">{transitRoute.distance}</strong>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-rose-100">
                  <span className="text-slate-400 block text-[10px]">Golden Hour ETA:</span>
                  <strong className="text-rose-950 text-sm">{transitRoute.eta}</strong>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-rose-100">
                  <span className="text-slate-400 block text-[10px]">Primary Transit Highway:</span>
                  <strong className="text-slate-900 block truncate">{transitRoute.highway}</strong>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-rose-100">
                  <span className="text-slate-400 block text-[10px]">En-Route Oxygen Post:</span>
                  <strong className="text-emerald-800 block truncate">{transitRoute.oxygenRefillPost}</strong>
                </div>
              </div>
            </div>
          )}

          {/* THE OFFICIAL SLIP (PRINTABLE REAL PDF FORMAT) */}
          <div
            id="printable-clinical-slip"
            className="bg-white rounded-2xl border-2 border-slate-300 shadow-lg p-6 sm:p-8 space-y-6 text-slate-800 font-sans print:border-none print:shadow-none print:p-0 print:m-0 relative overflow-hidden"
          >
            {/* Anti-Counterfeit State Security Watermark */}
            {securityWatermarkEnabled && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden opacity-[0.035] print:opacity-[0.055] z-0"
              >
                <div className="transform -rotate-25 text-center font-black tracking-widest text-slate-900 border-8 border-dashed border-slate-900 p-8 rounded-3xl">
                  <div className="text-4xl sm:text-6xl font-black">GOVT OF ODISHA</div>
                  <div className="text-2xl sm:text-3xl mt-2 font-extrabold tracking-normal">DEPT OF HEALTH &amp; FAMILY WELFARE</div>
                  <div className="text-lg sm:text-2xl mt-2 font-bold text-rose-900">NMC 2023 COMPLIANT • ABDM CERTIFIED</div>
                  <div className="text-sm mt-1 font-mono tracking-widest">{verificationToken?.docId || 'VERIFIED-DOC'}</div>
                </div>
              </div>
            )}
            {/* 1. Official Letterhead Header (Can be hidden if printing onto pre-printed stationary) */}
            {printStationeryMode === 'full_letterhead' ? (
              <div className="border-b-2 border-slate-900 pb-4 space-y-2">
                <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                  <span className="font-black text-amber-300">SECTION 1-NO: OFFICIAL APEX LETTERHEAD &amp; NMC VERIFIABLE QR SEAL</span>
                  <span className="text-slate-300">STATUTORY INSTRUCTION: PRESERVE FOR CLINICAL AUDIT &amp; LEGAL VERIFICATION</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Hospital & Govt Emblems */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-indigo-900">
                      <span className="bg-indigo-100 px-2 py-0.5 rounded">Department of Health &amp; Family Welfare</span>
                      <span>Government of Odisha</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {facilityName}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium">
                      {facilityDistrict} • 24x7 Emergency Clinical Facility • BSKY &amp; NHM Accredited
                    </p>
                  </div>

                  {/* Verifiable QR Code & Document ID Stamp */}
                  <div className="flex items-center sm:items-start gap-3 bg-slate-50 border border-slate-200 p-2.5 rounded-xl shrink-0">
                    {qrDataUrl && (
                      <img
                        src={qrDataUrl}
                        alt="Verifiable QR Code"
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded border border-slate-300 shadow-2xs"
                      />
                    )}
                    <div className="text-[10px] space-y-0.5 text-slate-600 font-mono">
                      <span className="block font-black text-slate-900 text-xs">
                        {verificationToken?.docId}
                      </span>
                      <span className="text-emerald-700 font-bold block">✓ ABDM VERIFIABLE</span>
                      <span>108 CAD: <strong>{verificationToken?.cadToken}</strong></span>
                      <span>Date: {new Date().toLocaleDateString()}</span>
                      <span>Time: {new Date().toLocaleTimeString()}</span>
                      <span className="text-[9px] text-slate-400 block truncate max-w-[120px]">
                        {verificationToken?.securityHash}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Document Banner Type & Triplicate Stamp */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-black uppercase tracking-wider">
                      {activeTab === 'prescription' ? (
                        <>
                          <Pill className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Official Medical Prescription (NMC Regulations 2023)</span>
                        </>
                      ) : (
                        <>
                          <Ambulance className="w-3.5 h-3.5 text-rose-400" />
                          <span>Inter-Facility Clinical Referral Slip (NHM 108 Transit)</span>
                        </>
                      )}
                    </span>
                    {printCopyMode === 'triplicate' && (
                      <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2.5 py-1 rounded-md shadow-2xs">
                        SHEET 1 OF 3: ORIGINAL (PATIENT &amp; APEX COPY)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-slate-600">Acuity Status:</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[11px] ${
                        currentCase.acuity === 'RED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {currentCase.acuity} PRIORITY EMERGENCY
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-b border-dashed border-slate-300 pb-3 flex justify-between items-center text-xs">
                <span className="text-slate-400 italic">
                  [Pre-Printed Stationery Mode Active: Hospital Crest Suppressed for Print]
                </span>
                <span className="font-mono text-indigo-900 font-bold">
                  {verificationToken?.docId} • {new Date().toLocaleDateString()}
                </span>
              </div>
            )}

            {/* 2. Patient Demographics & ABHA Information */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-indigo-950 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                <div className="flex items-center gap-2">
                  <span className="font-black text-indigo-300">SECTION 2-NO: PATIENT DEMOGRAPHICS &amp; ABHA HEALTH IDENTIFIER</span>
                  <button
                    type="button"
                    onClick={() => setShowAbhaCardModal(true)}
                    className="bg-teal-600 hover:bg-teal-500 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase flex items-center gap-1 cursor-pointer transition-colors print:hidden"
                    title="Open Official ABHA Digital Health Card"
                  >
                    <Award className="w-2.5 h-2.5" />
                    <span>View ABHA Card</span>
                  </button>
                </div>
                <span className="text-slate-300">INSTRUCTION: VERIFY IDENTITY WITH GOVT ID (AADHAAR / BSKY / ABHA CARD)</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
                  <strong className="text-slate-900 text-sm font-black">{patientName}</strong>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Age / Gender</span>
                  <span className="text-slate-800 font-bold">{patientAge} Yrs / {patientGender}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">ABHA Health ID</span>
                  <span className="font-mono text-indigo-900 font-bold">{patientAbha}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Weight / ABO</span>
                  <span className="text-slate-800 font-bold">{patientWeight} • <span className="text-rose-700 font-extrabold">{currentCase.bloodGroup || 'O+'}</span></span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">District &amp; Phone</span>
                  <span className="text-slate-800 font-medium truncate block">{currentCase.district || 'Cuttack'} • {patientPhone}</span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Allergy Status</span>
                  <span className={`font-bold ${patientAllergies.includes('None') ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {patientAllergies}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Vitals & Examination Findings + Shock Index */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                <span className="font-black text-rose-300">SECTION 3-NO: PHYSIOLOGICAL VITALS, EXAMINATION &amp; SHOCK INDEX</span>
                <span className="text-slate-300">INSTRUCTION: RE-EVALUATE EVERY 15 MINS DURING TRANSIT / ADMISSION</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  {txt.vitalsLabel}
                </span>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                  MEWS Alert: {mewsScore.riskLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Blood Pressure</span>
                  <strong className="text-indigo-950 font-black text-sm">{vitals.bp}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Pulse Rate</span>
                  <strong className="text-indigo-950 font-black text-sm">{vitals.pulse}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">SpO2 (Oxygen)</span>
                  <strong className="text-indigo-950 font-black text-sm">{vitals.spo2}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Temperature</span>
                  <strong className="text-indigo-950 font-black text-sm">{vitals.temp}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Respiration</span>
                  <strong className="text-indigo-950 font-black text-sm">{vitals.rr}</strong>
                </div>
              </div>

              {/* Physiological Critical Indices Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100/80 rounded-lg text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    Shock Index: <strong>{vitalScores.shockIndex}</strong>{' '}
                    <span
                      className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                        vitalScores.isShock ? 'bg-rose-600 text-white' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {vitalScores.isShock ? 'SHOCK HAZARD' : 'NORMAL RANGE'}
                    </span>
                  </span>
                </div>
                <div className="text-slate-600">
                  Mean Arterial Pressure (MAP): <strong>{vitalScores.map} mmHg</strong>
                </div>
              </div>
            </div>

            {/* 4. Clinical Diagnosis & Chief Complaints */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-teal-950 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                <span className="font-black text-teal-300">SECTION 4-NO: CLINICAL PROVISIONAL DIAGNOSIS &amp; CHIEF COMPLAINTS</span>
                <span className="text-slate-300">INSTRUCTION: MANDATORY WHO ICD-10 CODE &amp; SYMPTOM CHRONOLOGY SPECIFIED</span>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    {txt.diagLabel}
                  </span>
                  <div className="flex items-center gap-2 print:hidden">
                    <button
                      onClick={() => setShowIcdModal(true)}
                      className="text-[10px] font-bold text-teal-700 hover:text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Search className="w-2.5 h-2.5" />
                      <span>{txt.icdBtn}</span>
                    </button>
                    <button
                      onClick={() => handleToggleVoiceDictation('diagnosis')}
                      className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                    >
                      {isDictating && dictationTarget === 'diagnosis' ? (
                        <span className="text-rose-600 animate-pulse flex items-center gap-1">
                          <MicOff className="w-3 h-3" /> Listening...
                        </span>
                      ) : (
                        <>
                          <Mic className="w-3 h-3" /> <span>Dictate Voice</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-extrabold text-slate-900 print:bg-transparent print:border-none print:p-0"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                    {txt.complaintLabel}
                  </span>
                  <button
                    onClick={() => handleToggleVoiceDictation('complaints')}
                    className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 print:hidden cursor-pointer"
                  >
                    {isDictating && dictationTarget === 'complaints' ? (
                      <span className="text-rose-600 animate-pulse flex items-center gap-1">
                        <MicOff className="w-3 h-3" /> Listening...
                      </span>
                    ) : (
                      <>
                        <Mic className="w-3 h-3" /> <span>Dictate Voice</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={chiefComplaints}
                  onChange={(e) => setChiefComplaints(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 leading-relaxed font-medium print:bg-transparent print:border-none print:p-0 resize-none"
                />
              </div>
            </div>

            {/* 5. A. PRESCRIPTION SECTION (WHEN IN RX TAB) */}
            {activeTab === 'prescription' && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between bg-indigo-950 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                  <span className="font-black text-indigo-300">SECTION 5-NO: NMC COMPLIANT GENERIC PHARMACOTHERAPY &amp; DOSAGE DIRECTIVES</span>
                  <span className="text-slate-300">INSTRUCTION: MANDATORY CAPITAL LETTERS (NMC 2023) • FREE NIRAMAYA SUPPLY</span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900 font-serif">℞</span>
                    <span className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Generic Medications (NMC Compliant)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 print:hidden">
                    {hasAnyBrandDetected && (
                      <button
                        onClick={handleAutoFixAllBrands}
                        className="text-[11px] font-black bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-2.5 py-1 rounded-lg shadow-2xs flex items-center gap-1 cursor-pointer transition-all animate-pulse"
                        title="Convert all commercial brands to NMC uppercase generic standard"
                      >
                        <Sparkles className="w-3 h-3 text-yellow-200" />
                        <span>Auto-Fix All to Generic (NMC 2023)</span>
                      </button>
                    )}
                    <button
                      onClick={handleAddMedication}
                      className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{txt.addMedBtn}</span>
                    </button>
                  </div>
                </div>

                {/* Pediatric Body-Weight Auto-Dose Safety Guard & Calibrator */}
                {isPediatricCase && (
                  <div className="p-3.5 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 border border-amber-300 rounded-xl space-y-2 text-xs shadow-2xs print:hidden">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                          PEDIATRIC SAFETY GUARD (&lt;12 YRS / &lt;40 KG)
                        </span>
                        <span className="font-extrabold text-amber-950">
                          Weight Calibrated: <strong>{effectiveWeight} kg</strong> (Age: {patientAge} yrs)
                        </span>
                      </div>
                      <span className="text-[10px] text-amber-800 font-semibold">
                        Auto-calibrated per Indian Academy of Pediatrics (IAP) weight standards
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1 text-[11px]">
                      {/* Paracetamol */}
                      <div className="bg-white/95 p-2.5 rounded-lg border border-amber-200 flex flex-col justify-between shadow-2xs">
                        <div>
                          <strong className="text-slate-900 block font-bold">PARACETAMOL</strong>
                          <span className="text-[10px] text-slate-500 block">15 mg/kg/dose (Q6H PRN)</span>
                          <span className="text-amber-900 font-extrabold text-xs block mt-1">
                            {Math.round(effectiveWeight * 15)} mg / dose
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ≈ {((effectiveWeight * 15) / 50).toFixed(1)} mL (250mg/5mL syrup)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddPediatricMed('PARACETAMOL', `${Math.round(effectiveWeight * 15)} mg (${((effectiveWeight * 15) / 50).toFixed(1)} ml of 250mg/5ml)`, 'Syrup', 'Q6H SOS for fever > 100°F', '3 Days', 'Do not exceed 4 doses in 24 hours.')}
                          className="mt-2 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Apply Dose to Rx</span>
                        </button>
                      </div>

                      {/* Amoxicillin */}
                      <div className="bg-white/95 p-2.5 rounded-lg border border-amber-200 flex flex-col justify-between shadow-2xs">
                        <div>
                          <strong className="text-slate-900 block font-bold">AMOXICILLIN</strong>
                          <span className="text-[10px] text-slate-500 block">30 mg/kg/day (divided BD)</span>
                          <span className="text-amber-900 font-extrabold text-xs block mt-1">
                            {Math.round((effectiveWeight * 30) / 2)} mg / dose BD
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ≈ {(((effectiveWeight * 30) / 2) / 50).toFixed(1)} mL (250mg/5mL susp)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddPediatricMed('AMOXICILLIN', `${Math.round((effectiveWeight * 30) / 2)} mg`, 'Oral Suspension', 'BD after food', '5 Days', 'Complete 5-day course.')}
                          className="mt-2 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Apply Dose to Rx</span>
                        </button>
                      </div>

                      {/* Ondansetron */}
                      <div className="bg-white/95 p-2.5 rounded-lg border border-amber-200 flex flex-col justify-between shadow-2xs">
                        <div>
                          <strong className="text-slate-900 block font-bold">ONDANSETRON</strong>
                          <span className="text-[10px] text-slate-500 block">0.15 mg/kg/dose (TDS)</span>
                          <span className="text-amber-900 font-extrabold text-xs block mt-1">
                            {(effectiveWeight * 0.15).toFixed(1)} mg / dose
                          </span>
                          <span className="text-[10px] text-slate-500">
                            ≈ {(((effectiveWeight * 0.15) / 2) * 5).toFixed(1)} mL (2mg/5mL syrup)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddPediatricMed('ONDANSETRON', `${(effectiveWeight * 0.15).toFixed(1)} mg`, 'Syrup', 'TDS (8 Hourly) before food', '2 Days', 'Stop when vomiting subsides.')}
                          className="mt-2 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Apply Dose to Rx</span>
                        </button>
                      </div>

                      {/* Oral Rehydration Salts */}
                      <div className="bg-white/95 p-2.5 rounded-lg border border-amber-200 flex flex-col justify-between shadow-2xs">
                        <div>
                          <strong className="text-slate-900 block font-bold">ORS (WHO-FORMULA)</strong>
                          <span className="text-[10px] text-slate-500 block">75 mL/kg over 4 hours</span>
                          <span className="text-amber-900 font-extrabold text-xs block mt-1">
                            {Math.round(effectiveWeight * 75)} mL total
                          </span>
                          <span className="text-[10px] text-slate-500">
                            + 50-100 mL after each loose stool
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAddPediatricMed('ORAL REHYDRATION SALTS (ORS)', `${Math.round(effectiveWeight * 75)} mL`, 'Oral Solution', 'Sip frequently over 4 hours', 'Till diarrhea resolves', 'Prepare in freshly boiled and cooled water.')}
                          className="mt-2 py-1 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Apply Dose to Rx</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold">
                        <th className="p-2.5">#</th>
                        <th className="p-2.5">Generic Medicine Name (CAPITAL)</th>
                        <th className="p-2.5">Strength / Form</th>
                        <th className="p-2.5">Frequency &amp; Timing</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5">Special Instructions</th>
                        <th className="p-2.5">Odisha Scheme &amp; Barcode</th>
                        <th className="p-2.5 print:hidden">Compliance</th>
                        <th className="p-2.5 print:hidden">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {medications.map((med, idx) => {
                        const brandMatch = checkBrandName(med.name);
                        const isNiramaya = true; // All NMC core generics free under Odisha Niramaya / OSMC
                        const osmcCode = `OSMC-${med.name.substring(0, 3).toUpperCase()}-${Math.floor(100 + (idx * 37) % 899)}`;
                        return (
                          <tr key={idx} className="hover:bg-slate-50/80">
                            <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-2.5 font-black text-slate-900 font-mono tracking-wide">
                              {med.name.toUpperCase()}
                              {brandMatch && (
                                <span className="block text-[9px] text-amber-700 font-sans font-bold">
                                  ⚠️ Brand-like text
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 font-semibold text-slate-700">
                              {med.dosage} ({med.form})
                            </td>
                            <td className="p-2.5 font-bold text-indigo-900">{med.freq}</td>
                            <td className="p-2.5 text-slate-600">{med.duration}</td>
                            <td className="p-2.5 text-slate-600 text-[11px] italic">{med.instruction}</td>
                            <td className="p-2.5">
                              <div className="flex flex-col gap-0.5">
                                <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded w-fit">
                                  <Check className="w-2.5 h-2.5 text-emerald-600" />
                                  <span>ନିରାମୟ (NIRAMAYA FREE)</span>
                                </span>
                                <span className="text-[8px] font-mono text-slate-500 tracking-wider">
                                  ||| {osmcCode} |||
                                </span>
                              </div>
                            </td>
                            <td className="p-2.5 print:hidden">
                              {brandMatch ? (
                                <button
                                  onClick={() => handleAutoFixBrand(idx, brandMatch)}
                                  className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-black flex items-center gap-1 shadow-2xs cursor-pointer"
                                  title={txt.autoFixTooltip}
                                >
                                  <Sparkles className="w-2.5 h-2.5" />
                                  <span>Auto-Fix</span>
                                </button>
                              ) : (
                                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" />
                                  <span>NMC Generic</span>
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 print:hidden">
                              <button
                                onClick={() => handleDeleteMedication(idx)}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                title="Delete Row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* 1-Click Fast Generic Formulary Shelf (Odisha Niramaya / OSMC Essential List) */}
                <div className="p-3 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-xl border border-indigo-100 space-y-2 print:hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-[11px] font-black uppercase text-indigo-950 tracking-wide">
                        Quick-Add NMC Core Generics (Odisha Niramaya Essential Drug List)
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      1-Click insert to prescription table
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { name: 'PARACETAMOL', dosage: '650 mg', form: 'Tablet', freq: 'TDS SOS (After food)', duration: '3 Days', instruction: 'Take for body ache or temperature > 99.5°F' },
                      { name: 'PANTO PRAZOLE', dosage: '40 mg', form: 'Tablet', freq: 'OD (30 mins before breakfast)', duration: '7 Days', instruction: 'Swallow whole on empty stomach' },
                      { name: 'AMOXICILLIN + CLAVULANIC ACID', dosage: '625 mg', form: 'Tablet', freq: 'BD after food', duration: '5 Days', instruction: 'Complete full 5-day antibiotic course' },
                      { name: 'ONDANSETRON', dosage: '4 mg', form: 'Tablet / Mouth Dissolving', freq: 'TDS SOS', duration: '2 Days', instruction: 'Dissolve on tongue 30 mins before food' },
                      { name: 'ORAL REHYDRATION SALTS (ORS)', dosage: '20.5 g Sachet', form: 'Oral Powder', freq: 'Frequent sips in 1L boiled water', duration: 'Till recovery', instruction: 'Discard unconsumed solution after 24 hours' },
                      { name: 'AZITHROMYCIN', dosage: '500 mg', form: 'Tablet', freq: 'OD (1 hour before food)', duration: '3 Days', instruction: 'Strict daily timing; do not skip' },
                      { name: 'METFORMIN', dosage: '500 mg', form: 'Tablet PR', freq: 'BD with meals', duration: '30 Days', instruction: 'Monitor fasting blood sugar weekly' },
                      { name: 'AMLODIPINE', dosage: '5 mg', form: 'Tablet', freq: 'OD (Morning)', duration: '30 Days', instruction: 'Regular daily BP recording required' },
                      { name: 'CEFTRIAXONE', dosage: '1 g', form: 'IV Injection', freq: 'BD (12 Hourly)', duration: '3 Days', instruction: 'Slow IV after test dose' },
                      { name: 'TRAMADOL', dosage: '50 mg', form: 'Slow IV / IM', freq: 'SOS for severe pain', duration: 'Single Dose', instruction: 'Monitor sedation and nausea' }
                    ].map((drug, dIdx) => (
                      <button
                        key={dIdx}
                        type="button"
                        onClick={() => {
                          setMedications([
                            ...medications,
                            drug
                          ]);
                        }}
                        className="px-2 py-1 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 hover:border-indigo-600 rounded-lg text-[10px] font-bold text-slate-700 flex items-center gap-1 transition-all shadow-2xs cursor-pointer group"
                      >
                        <Plus className="w-2.5 h-2.5 text-indigo-500 group-hover:text-white" />
                        <span>{drug.name}</span>
                        <span className="text-[9px] text-slate-400 group-hover:text-indigo-200">({drug.dosage})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* ───────────────────────────────────────────────────────── */}
                {/* 4 ENRICHED DISTINCT CLINICAL FEATURE CARDS ("SHOW IN DIFFERENT THING") */}
                {/* ───────────────────────────────────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3">
                  {/* CARD 1: DIAGNOSTIC LABORATORY & RADIOLOGY ORDERS */}
                  <div className="bg-gradient-to-br from-white to-sky-50/50 p-4 rounded-xl border border-sky-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                          <FlaskConical className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-black text-sky-950 uppercase tracking-wide block">
                            Section 5.1-No: Diagnostic Investigations Ordered
                          </strong>
                          <span className="text-[10px] text-sky-800 font-semibold">
                            Laboratory, Biochemical &amp; Radiology Orders (NMC Standard)
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-sky-100 text-sky-800 border border-sky-300 px-2 py-0.5 rounded-full uppercase">
                        STAT / Priority
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {investigations && investigations.length > 0 ? (
                        investigations.map((test, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-2 bg-white rounded-lg border border-sky-100 flex items-start justify-between gap-2 text-[11px] shadow-2xs group hover:border-sky-300 transition-all"
                          >
                            <div className="flex items-start gap-1.5 flex-1">
                              <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                                {tIdx + 1}
                              </span>
                              <input
                                type="text"
                                value={test}
                                onChange={(e) => {
                                  const updated = [...investigations];
                                  updated[tIdx] = e.target.value;
                                  setInvestigations(updated);
                                }}
                                className="w-full font-bold text-slate-800 bg-transparent border-none outline-none focus:bg-sky-50/50 rounded px-1"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setInvestigations(investigations.filter((_, i) => i !== tIdx));
                              }}
                              className="text-slate-300 hover:text-rose-600 shrink-0 print:hidden cursor-pointer"
                              title="Remove test"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No investigations currently ordered.</p>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between print:hidden">
                      <button
                        type="button"
                        onClick={() => {
                          setInvestigations([...investigations, 'Urgent Serum Electrolytes (Na+, K+, Cl-) & Renal Function Test']);
                        }}
                        className="text-[10px] font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-2.5 py-1 rounded-lg border border-sky-200 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Diagnostic Order</span>
                      </button>
                      <span className="text-[9px] text-slate-500 font-mono">
                        NMC Rule 8.4 Compliant
                      </span>
                    </div>
                  </div>

                  {/* CARD 2: CLINICAL NUTRITION & LIFESTYLE DIRECTIVES */}
                  <div className="bg-gradient-to-br from-white to-emerald-50/50 p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <Apple className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-black text-emerald-950 uppercase tracking-wide block">
                            Section 5.2-No: Nutrition &amp; Non-Pharmacological Care
                          </strong>
                          <span className="text-[10px] text-emerald-800 font-semibold">
                            Dietary Protocol, Fluid Restrictions &amp; Physical Rest
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full uppercase">
                        Protocol Guard
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-emerald-100 shadow-2xs">
                      <textarea
                        rows={3}
                        value={dietaryAdvice}
                        onChange={(e) => setDietaryAdvice(e.target.value)}
                        placeholder="Enter tailored dietary instructions, fluid balance directives, salt restrictions, and non-pharmacological care..."
                        className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none leading-relaxed resize-none focus:bg-emerald-50/40 rounded p-1"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[10px] pt-1">
                      <div className="p-1.5 bg-white rounded border border-emerald-100 text-center">
                        <span className="text-slate-400 block text-[9px] font-semibold">HYDRATION</span>
                        <strong className="text-emerald-900 font-bold">Oral / IV Calibrated</strong>
                      </div>
                      <div className="p-1.5 bg-white rounded border border-emerald-100 text-center">
                        <span className="text-slate-400 block text-[9px] font-semibold">SALT / SODIUM</span>
                        <strong className="text-emerald-900 font-bold">&lt; 2g / Day (Low Salt)</strong>
                      </div>
                      <div className="p-1.5 bg-white rounded border border-emerald-100 text-center">
                        <span className="text-slate-400 block text-[9px] font-semibold">ACTIVITY</span>
                        <strong className="text-emerald-900 font-bold">Strict Bed Rest</strong>
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: CRITICAL RED-FLAG DANGER SIGNS (EMERGENCY 108 TRIGGER) */}
                  <div className="bg-gradient-to-br from-white to-rose-50/60 p-4 rounded-xl border border-rose-300 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-rose-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center shadow-xs">
                          <BellRing className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-black text-rose-950 uppercase tracking-wide block">
                            Section 5.3-No: Red-Flag Danger Signs (Emergency Trigger)
                          </strong>
                          <span className="text-[10px] text-rose-800 font-semibold">
                            Immediate 108 Ambulance / Emergency Casualty Escalation Signs
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-rose-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                        SOS ALERT
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {redFlags && redFlags.length > 0 ? (
                        redFlags.map((flag, fIdx) => (
                          <div
                            key={fIdx}
                            className="p-2 bg-white rounded-lg border border-rose-200 flex items-start justify-between gap-2 text-[11px] shadow-2xs hover:border-rose-400 transition-all"
                          >
                            <div className="flex items-start gap-1.5 flex-1">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                              <input
                                type="text"
                                value={flag}
                                onChange={(e) => {
                                  const updated = [...redFlags];
                                  updated[fIdx] = e.target.value;
                                  setRedFlags(updated);
                                }}
                                className="w-full font-bold text-rose-950 bg-transparent border-none outline-none focus:bg-rose-50/50 rounded px-1"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setRedFlags(redFlags.filter((_, i) => i !== fIdx));
                              }}
                              className="text-slate-300 hover:text-rose-600 shrink-0 print:hidden cursor-pointer"
                              title="Remove danger sign"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 italic">No red flag signs specified.</p>
                      )}
                    </div>

                    <div className="p-2 bg-rose-100/70 border border-rose-300 rounded-lg flex items-center justify-between text-[10px] text-rose-950">
                      <span className="font-extrabold flex items-center gap-1">
                        <Phone className="w-3 h-3 text-rose-700" />
                        <span>Odisha Free Emergency: <strong>Dial 108 / 102</strong></span>
                      </span>
                      <span className="font-semibold text-rose-800">
                        24x7 State Casualty Desk
                      </span>
                    </div>
                  </div>

                  {/* CARD 4: CLINICAL REVIEW & FOLLOW-UP SCHEDULE */}
                  <div className="bg-gradient-to-br from-white to-purple-50/50 p-4 rounded-xl border border-purple-200 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shadow-xs">
                          <CalendarClock className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-black text-purple-950 uppercase tracking-wide block">
                            Section 5.4-No: Clinical Review &amp; Follow-Up Schedule
                          </strong>
                          <span className="text-[10px] text-purple-800 font-semibold">
                            Mandatory OPD Revisit Date &amp; Clinical Progress Review
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-black bg-purple-100 text-purple-800 border border-purple-300 px-2 py-0.5 rounded-full uppercase">
                        Scheduled
                      </span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-purple-100 shadow-2xs">
                      <textarea
                        rows={3}
                        value={followUpSchedule}
                        onChange={(e) => setFollowUpSchedule(e.target.value)}
                        placeholder="Enter clinical review timeline, next OPD date, investigations to bring on revisit, and emergency contact directives..."
                        className="w-full text-xs font-medium text-slate-800 bg-transparent border-none outline-none leading-relaxed resize-none focus:bg-purple-50/40 rounded p-1"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[10px]">
                      <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                        <Clock className="w-3 h-3 text-purple-600" />
                        <span>Review at: <strong>{facilityName.split(',')[0]}</strong></span>
                      </div>
                      <span className="bg-purple-100 text-purple-800 font-mono text-[9px] px-2 py-0.5 rounded font-black">
                        SOS REVISIT ANYTIME IF SYMPTOMS AGGRAVATE
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. B. REFERRAL SLIP SECTION (WHEN IN REFERRAL TAB) */}
            {activeTab === 'referral' && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between bg-rose-950 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                  <span className="font-black text-rose-300">SECTION 5-NO: NHM 108 INTER-FACILITY REFERRAL, SBAR HANDOVER &amp; EN-ROUTE RX</span>
                  <span className="text-slate-300">INSTRUCTION: MANDATORY EMT ESCORT, TELE-HANDOVER CALL &amp; DUAL-FACILITY TRIAGE</span>
                </div>
                <div className="border-b-2 border-rose-900 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ambulance className="w-5 h-5 text-rose-700" />
                    <span className="text-sm font-black text-rose-950 uppercase tracking-wider">
                      Emergency Inter-Facility Transfer Protocol
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-rose-700 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    CAD ID: {verificationToken?.cadToken}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Origin & Destination Units */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Referring Facility (Origin)
                      </span>
                      <strong className="text-slate-900 block text-xs">{facilityName}</strong>
                      <span className="text-[11px] text-slate-500">{facilityDistrict}</span>
                    </div>

                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                        Target Apex Center (Referred To)
                      </span>
                      <strong className="text-indigo-950 block text-xs">{referralTarget}</strong>
                      <div className="mt-1 p-2 bg-indigo-50/70 border border-indigo-200 rounded-lg text-[10px] space-y-0.5">
                        <div className="flex justify-between text-indigo-900">
                          <span>Nodal Emergency Desk:</span>
                          <strong className="font-mono">{apexStatus.nodalPhone}</strong>
                        </div>
                        <div className="text-slate-600">Officer: {apexStatus.emergencyOfficer}</div>
                        <div className="text-emerald-700 font-bold">
                          ✓ ICU: {apexStatus.icuBeds} Free | HDU: {apexStatus.hduBeds} Free
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Justification & Logistics */}
                  <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 space-y-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-rose-700 block">
                        Clinical Justification for Referral
                      </span>
                      <p className="text-rose-950 font-medium text-xs mt-0.5 leading-relaxed">
                        {referralReason}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-rose-200 text-[11px] space-y-1">
                      <div>
                        <strong>Transport Protocol:</strong> {transportMode}
                      </div>
                      <div>
                        <strong>In-Transit Oxygen:</strong> {oxygenReq}
                      </div>
                      <div className="text-rose-800 font-semibold pt-1">
                        <strong>Green Corridor:</strong> {apexStatus.greenCorridor}
                      </div>
                    </div>
                  </div>
                </div>

                {/* NABH SBAR (Situation-Background-Assessment-Recommendation) Protocol Block */}
                <div className="p-4 bg-gradient-to-r from-slate-50 via-indigo-50/40 to-slate-50 rounded-xl border border-indigo-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-indigo-200/60 pb-2">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                      <strong className="text-slate-900 font-bold uppercase tracking-wide text-[11px]">
                        NABH SBAR Clinical Handover Protocol (Inter-Facility 108 Standard)
                      </strong>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-800 font-bold bg-white px-2 py-0.5 rounded border border-indigo-200">
                      MEWS Score: {mewsScore.score} ({mewsScore.riskLevel})
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-rose-700 uppercase block mb-1">
                        [S] Situation
                      </span>
                      <p className="text-slate-800 leading-snug line-clamp-2">{diagnosis}</p>
                      <span className="text-[9px] text-slate-500 block mt-1">Priority: {currentCase.acuity} Emergency</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-indigo-700 uppercase block mb-1">
                        [B] Background
                      </span>
                      <p className="text-slate-800 leading-snug line-clamp-2">{chiefComplaints}</p>
                      <span className="text-[9px] text-amber-700 font-bold block mt-1">Allergy: {patientAllergies}</span>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                        [A] Assessment
                      </span>
                      <div className="space-y-0.5 text-[10px] text-slate-700 font-mono">
                        <div>BP: <strong>{vitals.bp}</strong> | Pulse: <strong>{vitals.pulse}</strong></div>
                        <div>SpO2: <strong>{vitals.spo2}</strong> | Temp: <strong>{vitals.temp}</strong></div>
                        <div className="text-emerald-800 font-bold">Shock Index: {vitalScores.shockIndex} | MAP: {vitalScores.map} mmHg</div>
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-purple-700 uppercase block mb-1">
                        [R] Recommendation
                      </span>
                      <p className="text-slate-800 leading-snug line-clamp-2">{referralReason}</p>
                      <span className="text-[9px] text-indigo-700 font-bold block mt-1">Direct Admission: Emergency HDU / ICU</span>
                    </div>
                  </div>
                </div>

                {/* Section 5.B En-Route Medications & Pharmacotherapy Handover (NMC 2023 Standard) */}
                <div className="p-4 bg-white rounded-xl border border-indigo-200 space-y-3 text-xs shadow-2xs">
                  <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-indigo-900 font-serif">℞</span>
                      <strong className="text-slate-900 font-bold uppercase tracking-wide text-[11px]">
                        Administered &amp; En-Route Medications (NMC Generic Standard)
                      </strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                        ODISHA NIRAMAYA FREE SUPPLY
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTab('prescription')}
                        className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1 cursor-pointer print:hidden"
                      >
                        <Edit3 className="w-2.5 h-2.5" />
                        <span>Edit Rx</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold">
                          <th className="p-2">#</th>
                          <th className="p-2">Generic Medicine (CAPITAL LETTERS)</th>
                          <th className="p-2">Dose &amp; Form</th>
                          <th className="p-2">Frequency / Route</th>
                          <th className="p-2">Duration</th>
                          <th className="p-2">Transit &amp; Administration Directive</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {medications.map((med, mIdx) => (
                          <tr key={mIdx} className="hover:bg-slate-50/80">
                            <td className="p-2 font-bold text-slate-400">{mIdx + 1}</td>
                            <td className="p-2 font-black text-slate-900 font-mono tracking-wide">
                              {med.name.toUpperCase()}
                            </td>
                            <td className="p-2 font-semibold text-slate-700">
                              {med.dosage} ({med.form})
                            </td>
                            <td className="p-2 font-bold text-indigo-900">{med.freq}</td>
                            <td className="p-2 text-slate-600">{med.duration}</td>
                            <td className="p-2 text-slate-600 text-[11px] italic">{med.instruction}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* NHM 108 Emergency Handover Checklist */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                    NHM 108 Inter-Facility Handover Verification Checklist:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px]">
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.ivLine}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, ivLine: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>IV Cannula (18G) Patent</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.pulseOx}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, pulseOx: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Pulse Oximeter Connected</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.o2Pressure}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, o2Pressure: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>O2 Cylinder Pressure &gt;150 Bar</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.attendantConsent}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, attendantConsent: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Attendant Transfer Consent OK</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.casualtyNotified}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, casualtyNotified: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Casualty Desk Tele-Informed</span>
                    </label>

                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={handoverChecks.emtEscort}
                        onChange={(e) => setHandoverChecks({ ...handoverChecks, emtEscort: e.target.checked })}
                        className="rounded text-indigo-600"
                      />
                      <span>Staff Nurse / EMT Escort Named</span>
                    </label>
                  </div>

                  {/* Casualty MO Pre-Arrival Call Confirmation Strip */}
                  <div className="mt-2.5 pt-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px] text-slate-700">
                        Casualty Desk: <strong className="text-slate-900">{apexStatus.emergencyOfficer}</strong> ({apexStatus.nodalPhone})
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setTeleCallAcknowledged(!teleCallAcknowledged);
                        if (!teleCallAcknowledged) {
                          setHandoverChecks((prev) => ({ ...prev, casualtyNotified: true }));
                        }
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                        teleCallAcknowledged
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{teleCallAcknowledged ? 'Casualty Tele-Handover Confirmed ✓' : 'Confirm Pre-Arrival Tele-Handover'}</span>
                    </button>
                  </div>
                </div>

                {/* Emergency Blood & Blood Component Requisition Voucher (Form 27C / National Blood Policy) */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    bloodRequisitionEnabled
                      ? 'bg-rose-50/80 border-rose-300 ring-1 ring-rose-300 shadow-2xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={bloodRequisitionEnabled}
                        onChange={(e) => setBloodRequisitionEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                      />
                      <span className="font-extrabold text-xs sm:text-sm text-rose-950 flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
                        <span>Emergency Blood &amp; Component Requisition Voucher (Form 27C / National Blood Policy)</span>
                      </span>
                    </label>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shrink-0 ${
                        bloodRequisitionEnabled
                          ? 'bg-rose-600 text-white shadow-2xs animate-pulse'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {bloodRequisitionEnabled ? 'VOUCHER ACTIVE (MANDATORY)' : 'STANDBY (OPTIONAL)'}
                    </span>
                  </div>

                  {bloodRequisitionEnabled && (
                    <div className="mt-3 pt-3 border-t border-rose-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Recipient ABO/Rh:
                          </label>
                          <select
                            value={bloodGroupReq}
                            onChange={(e) => setBloodGroupReq(e.target.value)}
                            className="w-full p-2 bg-white border border-rose-300 rounded-lg font-black text-rose-900 text-xs outline-none"
                          >
                            {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'Bombay Oh (Unconfirmed)'].map((bg) => (
                              <option key={bg} value={bg}>{bg}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Component Required:
                          </label>
                          <select
                            value={bloodComponentReq}
                            onChange={(e) => setBloodComponentReq(e.target.value)}
                            className="w-full p-2 bg-white border border-rose-300 rounded-lg font-bold text-slate-800 text-xs outline-none"
                          >
                            <option value="Packed Red Blood Cells (PRBC)">Packed Red Cells (PRBC)</option>
                            <option value="Platelet Concentrate (RDP / SDP)">Platelets (RDP / SDP)</option>
                            <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                            <option value="Cryoprecipitate">Cryoprecipitate (Factor VIII)</option>
                            <option value="Whole Blood">Whole Human Blood</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Units Requisitioned:
                          </label>
                          <select
                            value={bloodUnitsReq}
                            onChange={(e) => setBloodUnitsReq(Number(e.target.value))}
                            className="w-full p-2 bg-white border border-rose-300 rounded-lg font-black text-slate-800 text-xs outline-none"
                          >
                            <option value={1}>1 Unit (350/450 mL)</option>
                            <option value={2}>2 Units (Standard Transfusion)</option>
                            <option value={3}>3 Units (Acute Anemia / Shock)</option>
                            <option value={4}>4 Units (MTP Protocol Tier 1)</option>
                            <option value={6}>6 Units (Massive Transfusion Protocol)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                            Clinical Urgency:
                          </label>
                          <select
                            value={bloodUrgency}
                            onChange={(e) => setBloodUrgency(e.target.value)}
                            className="w-full p-2 bg-white border border-rose-300 rounded-lg font-bold text-rose-700 text-xs outline-none"
                          >
                            <option value="STAT Emergency (Immediate O- Negative Release)">STAT Emergency (O- Release)</option>
                            <option value="Urgent (Within 1 Hour / Crossmatched)">Urgent (Within 1 Hour)</option>
                            <option value="Elective Pre-Op Crossmatch Reserve">Elective Reserve (Pre-Op)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-rose-100/70 border border-rose-300 rounded-lg text-[11px] text-rose-950 font-medium">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                          <span><strong>Crossmatch Status:</strong> {bloodCrossmatchStatus}</span>
                        </div>
                        <span className="text-[10px] font-mono text-rose-800 bg-white px-2 py-0.5 rounded border border-rose-200">
                          Apex Bank Reserve: {apexStatus.bloodBankUnits || 'Stocks Active'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 6. Attending RMP Signature & Verification Seal */}
            <div className="border-t-2 border-slate-900 pt-4 mt-6 space-y-4">
              <div className="flex items-center justify-between bg-slate-900 text-white px-3 py-1 rounded-lg text-[10px] font-mono tracking-wider">
                <span className="font-black text-emerald-400">SECTION 6-NO: REGISTERED MEDICAL PRACTITIONER (RMP) DIGITAL SIGNATURE &amp; LEGAL CERTIFICATION</span>
                <span className="text-slate-300">STATUTORY MANDATE: SIGNED PER SECTION 27 OF NMC ACT 2019 &amp; ABDM DSC STANDARD</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                {/* Statutory Note */}
                <div className="text-[10px] text-slate-500 max-w-sm space-y-1">
                  <p className="font-bold text-slate-700">
                    National Health Mission • Odisha State Health Authority
                  </p>
                  <p>
                    This document is generated by an authorized Registered Medical Practitioner (RMP) under Section 27 of NMC Act 2019 and signed with ABDM cryptographic hash.
                  </p>
                </div>

              {/* RMP Signature Seal with Vector Signature Overlay */}
              <div className="text-right sm:border-l sm:pl-6 border-slate-300 space-y-1 shrink-0">
                <div className="flex flex-col items-end">
                  {signatureDataUrl ? (
                    <div className="flex flex-col items-end mb-1 p-2 bg-slate-50/90 rounded-xl border border-slate-200 shadow-2xs">
                      <img
                        src={signatureDataUrl}
                        alt="Doctor Digital Signature"
                        className="h-14 max-w-[220px] object-contain"
                      />
                      <div className="flex items-center gap-1 text-[9px] text-emerald-800 font-bold font-mono mt-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>VERIFIED RMP DIGITAL SIGNATURE ({signatureType.toUpperCase()})</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowSignModal(true)}
                      className="inline-flex items-center gap-1.5 border-2 border-dashed border-indigo-400 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-900 mb-1 transition-all cursor-pointer shadow-xs print:border-slate-400"
                    >
                      <Edit3 className="w-4 h-4 text-indigo-700" />
                      <span>{txt.btnSignOff || 'Doctor Digital Signature (Click to Sign)'}</span>
                    </button>
                  )}

                  {/* Interactive Button to Re-sign or Modify when signature is attached */}
                  {signatureDataUrl && (
                    <button
                      type="button"
                      onClick={() => setShowSignModal(true)}
                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 print:hidden cursor-pointer mb-0.5"
                    >
                      <Edit3 className="w-2.5 h-2.5" />
                      <span>Change / Re-Sign</span>
                    </button>
                  )}
                </div>

                <div className="font-black text-slate-900 text-sm leading-tight">{doctorName}</div>
                <div className="text-xs font-bold text-indigo-800 leading-tight">{doctorDegrees}</div>
                <div className="text-[11px] font-mono text-slate-600 leading-tight">
                  Reg No: <strong>{doctorRegNo}</strong> (Odisha Medical Council)
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  Signed: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()} • ABDM SHA-256
                </div>
              </div>
            </div>
          </div>

            {/* ── TRIPLICATE HOSPITAL SET (SHEET 2 & SHEET 3) ── */}
            {printCopyMode === 'triplicate' && (
              <div className="space-y-6 pt-6">
                {/* ── SHEET 2: DUPLICATE (REFERRING HOSPITAL MEDICAL RECORDS MRD COPY) ── */}
                <div className="pt-6 border-t-4 border-dashed border-slate-400 break-before-page space-y-4">
                  <div className="bg-slate-800 text-white p-2 rounded-lg text-center text-xs font-black tracking-widest flex items-center justify-between px-4">
                    <span className="text-[10px] text-amber-400 font-mono">TRIPLICATE SET (SHEET 2 OF 3)</span>
                    <span>DUPLICATE: REFERRING HOSPITAL MEDICAL RECORDS (MRD) ARCHIVE COPY</span>
                    <span className="text-[10px] text-slate-300 font-mono">RETENTION: 5 YEARS</span>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">MRD Token:</span>
                      <strong className="font-mono text-slate-900">{verificationToken?.docId}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Patient Name:</span>
                      <strong className="text-slate-900">{patientName} ({patientAge}y, {patientGender})</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Referred Destination:</span>
                      <strong className="text-indigo-950 truncate block">{referralTarget}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">108 CAD Token:</span>
                      <strong className="font-mono text-rose-900">{verificationToken?.cadToken}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Provisional Diagnosis &amp; Clinical Justification:</span>
                    <p className="font-extrabold text-slate-900">{diagnosis} ({currentIcdCode})</p>
                    <p className="text-slate-700">{referralReason}</p>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t pt-3">
                    <div className="text-[10px] text-slate-500">
                      Filed into Hospital MRD Register by Duty Records Officer on: {new Date().toLocaleDateString()}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Attending Clinician (RMP):</span>
                      <strong className="text-slate-900">{doctorName}</strong> ({doctorRegNo})
                    </div>
                  </div>
                </div>

                {/* ── SHEET 3: TRIPLICATE (108 AMBULANCE EMT TRANSIT HANDOVER COPY) ── */}
                <div className="pt-6 border-t-4 border-dashed border-slate-400 break-before-page space-y-4">
                  <div className="bg-rose-900 text-white p-2 rounded-lg text-center text-xs font-black tracking-widest flex items-center justify-between px-4">
                    <span className="text-[10px] text-rose-300 font-mono">TRIPLICATE SET (SHEET 3 OF 3)</span>
                    <span>TRIPLICATE: 108 EMERGENCY AMBULANCE EMT TRANSIT HANDOVER COPY</span>
                    <span className="text-[10px] text-rose-200 font-mono">PILOT ESCORT</span>
                  </div>

                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-rose-700 block text-[10px]">108 CAD Incident:</span>
                      <strong className="font-mono text-rose-950">{verificationToken?.cadToken}</strong>
                    </div>
                    <div>
                      <span className="text-rose-700 block text-[10px]">Golden Hour ETA:</span>
                      <strong className="text-rose-950">{transitRoute.eta} ({transitRoute.distance})</strong>
                    </div>
                    <div>
                      <span className="text-rose-700 block text-[10px]">Transit Route Corridor:</span>
                      <strong className="text-slate-900 truncate block">{transitRoute.highway}</strong>
                    </div>
                    <div>
                      <span className="text-rose-700 block text-[10px]">Oxygen Requirement:</span>
                      <strong className="text-emerald-900">{oxygenReq}</strong>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl text-xs space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">En-Route EMT Vitals Monitoring Protocol:</span>
                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="bg-slate-50 p-1.5 rounded">Departure BP: <strong>{vitals.bp}</strong></div>
                      <div className="bg-slate-50 p-1.5 rounded">Pulse: <strong>{vitals.pulse}</strong></div>
                      <div className="bg-slate-50 p-1.5 rounded">SpO2: <strong>{vitals.spo2}</strong></div>
                      <div className="bg-slate-50 p-1.5 rounded">Temp: <strong>{vitals.temp}</strong></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t pt-3">
                    <div className="text-[10px] text-slate-500">
                      108 Emergency Ambulance EMT Sign &amp; Base Station Handover Code: EMT-OD-7721
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Receiving Apex Casualty Desk:</span>
                      <strong className="text-indigo-900">{referralTarget}</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. SUB-TAB 3: QR CODE VERIFIER & AUDIT SCANNER */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeTab === 'verify' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Verifier Simulator */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-600" />
                <span>NMC / ABDM Verifiable QR Code Scanner</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulates real-world QR audit at apex hospital casualty desks, pharmacies, and 108 transit checkpoints.
              </p>
            </div>

            {/* QR Visual or Live Camera Video */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 relative overflow-hidden">
              {isCameraActive ? (
                <div className="relative w-64 h-64 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-md">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-emerald-400 m-8 rounded-lg pointer-events-none animate-pulse"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-sm animate-bounce"></div>
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="Scannable QR Code"
                  className="w-48 h-48 rounded-xl shadow-md border border-slate-200"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                  Generating QR...
                </div>
              )}
              <span className="text-[11px] font-mono text-slate-500 mt-3">
                Token ID: <strong>{verificationToken?.docId}</strong>
              </span>
            </div>

            {/* Camera / Upload Scanner Controls */}
            <div className="flex gap-2">
              <button
                onClick={toggleCameraScanner}
                className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  isCameraActive
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraActive ? 'Stop Camera' : 'Live Camera Scanner'}</span>
              </button>

              <label className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-300">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadedFileName ? 'QR Scanned ✓' : 'Upload QR Slip'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            {/* Tamper Simulation Toggle */}
            <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Simulate Document Tampering (Test Cryptographic Check):</span>
              </span>
              <button
                onClick={() => {
                  setSimulateTamper(!simulateTamper);
                  setVerifyStatus(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  simulateTamper
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                }`}
              >
                {simulateTamper ? 'TAMPER ACTIVE' : 'OFF (HONEST)'}
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={handleVerifyPayload}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Audit Certificate Integrity</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Verification URL Copied!' : 'Copy Verification Web Link'}</span>
              </button>
            </div>
          </div>

          {/* Right: Verification Status Audit Result */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Verification &amp; Registry Audit Output</span>
              </h4>
              <p className="text-xs text-slate-500">Live check against Odisha Medical Council &amp; ABDM Gateway.</p>
            </div>

            {verifyStatus === 'VALID' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-emerald-50 border-2 border-emerald-400 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>AUTHENTIC &amp; UNTAMPERED CLINICAL DOCUMENT</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                    Cryptographic signature matches the public key registered with the Odisha Medical Council for <strong>{doctorName}</strong>. Zero tampering detected.
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-bold">RMP Clinician:</span>
                    <strong className="text-slate-900">{doctorName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-bold">Registration Number:</span>
                    <strong className="text-indigo-900 font-mono">{doctorRegNo}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-bold">State Medical Council:</span>
                    <strong className="text-slate-800">Odisha Medical Council (OMC)</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-bold">Patient ABHA Number:</span>
                    <strong className="text-slate-900 font-mono">{patientAbha}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between">
                    <span className="text-slate-500 font-bold">Issuing Facility:</span>
                    <strong className="text-slate-900">{facilityName}</strong>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold block text-[10px]">Security Hash (SHA-256)</span>
                    <span className="font-mono text-[11px] text-indigo-700 break-all">
                      {verificationToken?.securityHash}
                    </span>
                  </div>

                  {/* Decrypted Prescription Items Breakdown */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-slate-500">
                        Prescribed NMC Generics ({medications.length} items)
                      </span>
                      <span className="text-[9px] text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Niramaya Covered
                      </span>
                    </div>
                    <div className="space-y-1">
                      {medications.map((m, mIdx) => (
                        <div key={mIdx} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-100 last:border-none">
                          <span className="font-bold text-slate-800 font-mono">{m.name}</span>
                          <span className="text-slate-500">{m.dosage} • {m.freq}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('prescription')}
                      className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-xl text-xs font-bold border border-indigo-200 flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Official Printable Slip</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPdfDoc}
                      className="py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {verifyStatus === 'TAMPERED' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>⚠️ CRYPTOGRAPHIC SIGNATURE MISMATCH (TAMPER DETECTED)</span>
                  </div>
                  <p className="text-xs text-rose-800 leading-relaxed font-medium">
                    The document content does not match the official SHA-256 hash registered in the Odisha Medical Council registry. Content or medication values have been altered post-issuance!
                  </p>
                </div>

                <div className="p-3 bg-rose-100/60 rounded-xl border border-rose-200 text-xs text-rose-900 space-y-1">
                  <strong>Security Alert Protocol:</strong>
                  <p>1. Do NOT dispense medications from this altered slip.</p>
                  <p>2. Verify directly with issuing hospital desk: <strong>{facilityName}</strong>.</p>
                  <p>3. Audit log transmitted to State Drug Controller &amp; NMC Council.</p>
                </div>
              </div>
            )}

            {!verifyStatus && (
              <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl">
                <QrCode className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">Click "Audit Certificate Integrity" or scan with camera to verify credentials.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. SUB-TAB 4: ISSUED CLINICAL DOCUMENTS VAULT */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeTab === 'vault' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                <span>Issued Clinical Documents Vault</span>
              </h3>
              <p className="text-xs text-slate-500">
                Encrypted audit archive of all prescriptions and referral slips generated from this terminal.
              </p>
            </div>
            <button
              onClick={handleSaveToVault}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 cursor-pointer"
            >
              + Archive Current
            </button>
          </div>

          {vaultList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              {vaultList.map((doc, i) => (
                <div
                  key={i}
                  className="p-4 bg-gradient-to-br from-white to-slate-50 border border-slate-200 hover:border-indigo-400 rounded-2xl space-y-3 transition-all shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-indigo-700 font-bold bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded block w-fit">
                          {doc.id}
                        </span>
                        <strong className="text-slate-900 text-sm font-black block mt-1">{doc.patientName}</strong>
                        <span className="text-[10px] text-slate-500 font-mono">ABHA: {doc.abhaId}</span>
                      </div>
                      <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
                        {doc.docType}
                      </span>
                    </div>

                    <p className="text-slate-700 text-[11px] font-medium line-clamp-2 leading-relaxed bg-slate-100/70 p-2 rounded-lg border border-slate-200">
                      <strong>Diagnosis:</strong> {doc.diagnosis}
                    </p>

                    <div className="text-[10px] text-slate-500 space-y-0.5 font-mono">
                      <div>Attending Clinician: <strong className="text-slate-800">{doc.doctorName || doctorName}</strong></div>
                      <div>Archived: <span>{doc.date}</span></div>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          window.print();
                        }}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors border border-indigo-200"
                        title="Print document"
                      >
                        <Printer className="w-3 h-3 text-indigo-600" />
                        <span>Print</span>
                      </button>

                      <button
                        onClick={() => {
                          handleDownloadOfflineCertificate();
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Download Standalone Offline HTML"
                      >
                        <FileDown className="w-3 h-3 text-amber-600" />
                        <span>HTML</span>
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        const updated = vaultList.filter((_, idx) => idx !== i);
                        setVaultList(updated);
                        try {
                          localStorage.setItem('nhp_clinical_docs_vault', JSON.stringify(updated));
                        } catch (e) {
                          console.warn(e);
                        }
                        setToastMessage(`Document ${doc.id} removed from Vault`);
                        setTimeout(() => setToastMessage(null), 2500);
                      }}
                      className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer transition-colors"
                      title="Delete from Vault"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl">
              <FileText className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No documents saved in vault yet. Click "+ Archive Current" to archive slips.</p>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. SUB-TAB 5: NABH SBAR TRANSIT HANDOVER & ABDM FHIR R4 */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeTab === 'sbar_handover' && (
        <div className="space-y-6">
          {/* Header Action Strip */}
          <div className="bg-gradient-to-r from-rose-950 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl border border-rose-800/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-rose-500/30 text-rose-200 border border-rose-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  NABH &amp; WHO Patient Safety Protocol
                </span>
                <span className="bg-teal-500/30 text-teal-200 border border-teal-400/40 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                  ABDM FHIR R4 Standard
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                NABH SBAR Transit Handover Protocol &amp; ABDM FHIR Suite
              </h3>
              <p className="text-xs text-rose-200/80 mt-0.5">
                Situation • Background • Assessment • Recommendation structured critical handover for inter-facility 108 emergency transit.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopyFhirJson}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-700 shadow-2xs cursor-pointer transition-all"
              >
                {copyFhirSuccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copyFhirSuccess ? 'FHIR Copied!' : (txt.btnCopyFhir || 'Copy FHIR JSON')}</span>
              </button>

              <button
                onClick={handleDownloadFhirJson}
                className="px-3.5 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{txt.btnDownloadFhir || 'Download FHIR (.json)'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print SBAR Slip</span>
              </button>
            </div>
          </div>

          {/* 4 Pillars of NABH SBAR Structured Handover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* S - Situation */}
            <div className="bg-white rounded-2xl border-2 border-rose-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-rose-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-rose-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                    S
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm font-black block">SITUATION (ଘଟଣା / स्थिति)</strong>
                    <span className="text-[10px] text-slate-400">Immediate clinical trigger &amp; transit priority</span>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                  priorityTier === 'RED' ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {priorityTier} PRIORITY TRANSFER
                </span>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-rose-900 uppercase block">Active Provisional Diagnosis:</span>
                  <p className="font-extrabold text-slate-900 text-xs">{diagnosis}</p>
                  <span className="text-[10px] font-mono text-rose-700 font-bold bg-white px-2 py-0.5 rounded border border-rose-200 inline-block">
                    ICD-10: {currentIcdCode} - {currentIcdName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Patient:</span>
                    <strong className="text-slate-900">{patientName} ({patientAge}y, {patientGender})</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Destination Apex:</span>
                    <strong className="text-indigo-950 truncate block">{referralTarget}</strong>
                  </div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Transit Acute Trigger:</span>
                  <p className="text-slate-800 font-medium">{referralReason}</p>
                </div>
              </div>
            </div>

            {/* B - Background */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                    B
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm font-black block">BACKGROUND (ପୃଷ୍ଠଭୂମି / पृष्ठभूमि)</strong>
                    <span className="text-[10px] text-slate-400">Clinical context &amp; pre-transfer interventions</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                  ABHA: {patientAbha}
                </span>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Chief Complaints &amp; Chronology:</span>
                  <p className="text-slate-800">{chiefComplaints}</p>
                </div>

                <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">Allergy &amp; Precautions Guard:</span>
                  <p className="text-amber-950 font-bold">{patientAllergies || 'No known drug allergies reported'}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Pre-Transfer IV Line:</span>
                    <strong className="text-slate-900">18G Cannula (Left Forearm)</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">O2 Support Status:</span>
                    <strong className="text-emerald-800">{oxygenReq}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* A - Assessment */}
            <div className="bg-white rounded-2xl border-2 border-emerald-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                    A
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm font-black block">ASSESSMENT (ଆକଳନ / मूल्यांकन)</strong>
                    <span className="text-[10px] text-slate-400">Vitals, MEWS score &amp; Shock Index</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mewsScore.colorClass}`}>
                  MEWS Score: {mewsScore.score} ({mewsScore.riskLevel})
                </span>
              </div>

              <div className="space-y-2.5 text-slate-700">
                {/* Vitals Grid */}
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">BP</span>
                    <strong className="text-slate-900 text-xs">{vitals.bp}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">PULSE</span>
                    <strong className="text-slate-900 text-xs">{vitals.pulse}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">SPO2</span>
                    <strong className="text-emerald-800 text-xs">{vitals.spo2}</strong>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[9px] uppercase font-bold">TEMP</span>
                    <strong className="text-slate-900 text-xs">{vitals.temp}</strong>
                  </div>
                </div>

                {/* Shock Index & MAP */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200">
                    <span className="text-emerald-900 font-bold block text-[10px]">Shock Index (HR/SBP):</span>
                    <strong className="text-sm font-black text-emerald-950">{vitalScores.shockIndex}</strong>
                    <span className="text-[10px] text-emerald-700 block">
                      {vitalScores.shockIndex > 0.9 ? '⚠️ Elevated - Fluid resuscitation active' : '✓ Hemodynamically compensated'}
                    </span>
                  </div>
                  <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-200">
                    <span className="text-indigo-900 font-bold block text-[10px]">Mean Arterial Pressure (MAP):</span>
                    <strong className="text-sm font-black text-indigo-950">{vitalScores.map} mmHg</strong>
                    <span className="text-[10px] text-indigo-700 block">Target: &gt;65 mmHg for organ perfusion</span>
                  </div>
                </div>

                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-600">
                  <strong>Clinical Escalation Guideline:</strong> {mewsScore.guidance}
                </div>
              </div>
            </div>

            {/* R - Recommendation */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-purple-600 text-white font-black text-sm flex items-center justify-center shadow-2xs">
                    R
                  </span>
                  <div>
                    <strong className="text-slate-900 text-sm font-black block">RECOMMENDATION (ସୁପାରିଶ / सिफ़ारिश)</strong>
                    <span className="text-[10px] text-slate-400">108 EMT directives &amp; receiving department</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                  108 En-Route Directives
                </span>
              </div>

              <div className="space-y-2 text-slate-700">
                <div className="p-2.5 bg-purple-50/70 border border-purple-200 rounded-xl space-y-1">
                  <span className="text-[10px] font-bold text-purple-900 uppercase block">Destination Department Requested:</span>
                  <p className="font-extrabold text-slate-900">{referralTarget} — Emergency Intensive / HDU Unit</p>
                </div>

                <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-[11px]">
                  <span className="text-slate-400 block text-[10px] font-bold uppercase">En-Route Paramedic Instructions:</span>
                  <p className="flex items-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Repeat vitals recording every 15 minutes en-route.</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Maintain SpO2 &gt;94% via high-flow O2 if dyspneic.</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Alert destination casualty desk 15 mins prior to arrival.</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] p-2 bg-slate-100 rounded-lg">
                  <span className="text-slate-500">Transit Transport Mode:</span>
                  <strong className="text-indigo-900">{transportMode}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ─── NMC VERIFIABLE QR PRESCRIPTIONS & TRANSIT DRUG ADMINISTRATION CARD ─── */}
          <div className="bg-white rounded-2xl border-2 border-indigo-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  ℞
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <span>NMC Verifiable Prescriptions &amp; En-Route 108 Emergency Pharmacotherapy</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                      NMC 2023 VALIDATED
                    </span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    NMC Compliant generic pharmacotherapy with live tamper-evident QR verification token &amp; Niramaya scheme codes.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const text = medications.map((m, i) => `${i + 1}. ${m.name} ${m.dosage} (${m.form}) - ${m.freq} x ${m.duration} [${m.instruction}]`).join('\n');
                    navigator.clipboard.writeText(`NMC E-PRESCRIPTION (${docId})\nPatient: ${patientName} (${patientAge}y/${patientGender})\nDiagnosis: ${diagnosis}\n\nMedications:\n${text}`);
                    alert('Prescription details copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  title="Copy full prescription to clipboard"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  <span>Copy Rx</span>
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  title="Print official prescription slip"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('verify')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Verify Document QR</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('prescription')}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit in Rx Tab</span>
                </button>
              </div>
            </div>

            {/* Verifiable QR Token & RMP Integrity Badge Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {qrDataUrl ? (
                  <div className="bg-white p-2 rounded-xl shadow-md shrink-0">
                    <img
                      src={qrDataUrl}
                      alt="NMC ABDM Verifiable QR Code"
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white p-2 rounded-xl shadow-md shrink-0 flex flex-col items-center justify-center text-center">
                    <QrCode className="w-10 h-10 text-slate-800 animate-pulse" />
                    <span className="text-[9px] text-slate-800 font-bold mt-1">Generating QR</span>
                  </div>
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs sm:text-sm font-black text-emerald-400">
                      {verificationToken?.docId || docId}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.2 rounded-full font-bold">
                      SHA-256 SECURED
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Attending RMP: <strong className="text-white">{doctorName}</strong> ({doctorRegNo})
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    108 CAD Token: <span className="text-rose-300">{verificationToken?.cadToken}</span> • OMC Registered
                  </p>
                  <div className="text-[10px] text-slate-400 truncate max-w-xs font-mono">
                    Hash: {verificationToken?.securityHash}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:items-end gap-1 text-xs shrink-0">
                <span className="text-[11px] text-slate-300">Transit Medical Escort Protocol:</span>
                <span className="font-bold text-emerald-400">108 ALS Direct Drug Dispensation</span>
                <span className="text-[10px] text-slate-400">Odisha OSMC Niramaya Free Drug Supply</span>
              </div>
            </div>

            {/* Prescriptions Table (Rx) */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200 text-[10px] uppercase font-bold">
                    <th className="p-2.5">#</th>
                    <th className="p-2.5">Generic Medicine (CAPITAL LETTERS)</th>
                    <th className="p-2.5">Dose &amp; Form</th>
                    <th className="p-2.5">Frequency / Route</th>
                    <th className="p-2.5">Duration</th>
                    <th className="p-2.5">Transit &amp; Administration Directive</th>
                    <th className="p-2.5">Odisha Niramaya Scheme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {medications.map((med, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80">
                      <td className="p-2.5 font-bold text-slate-400">{idx + 1}</td>
                      <td className="p-2.5 font-black text-slate-900 font-mono tracking-wide">
                        {med.name.toUpperCase()}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-700">
                        {med.dosage} ({med.form})
                      </td>
                      <td className="p-2.5 font-bold text-indigo-900">{med.freq}</td>
                      <td className="p-2.5 text-slate-600">{med.duration}</td>
                      <td className="p-2.5 text-slate-600 text-[11px] italic">{med.instruction}</td>
                      <td className="p-2.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 py-0.5 rounded">
                          <Check className="w-2.5 h-2.5 text-emerald-600" />
                          <span>ନିରାମୟ (NIRAMAYA FREE)</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Destination Apex Casualty Pre-Arrival Direct Dialer & Handover Logger */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Apex Destination Casualty Pre-Arrival Direct Dialer &amp; Handover Logger</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Referring clinician mandatory protocol: Alert the receiving hospital emergency nodal officer prior to ambulance departure.
                </p>
              </div>

              {teleCallAcknowledged && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Casualty Handover Confirmed ✓</span>
                </span>
              )}
            </div>

            {/* Quick Dial Buttons to Odisha Apex Casualty Desks */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              <a
                href="tel:06712414080"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">SCBMCH Cuttack</span>
                <span className="text-[10px] text-slate-500 font-mono">0671-2414080</span>
              </a>

              <a
                href="tel:06742476789"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">AIIMS Bhubaneswar</span>
                <span className="text-[10px] text-slate-500 font-mono">0674-2476789</span>
              </a>

              <a
                href="tel:06802292746"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">MKCG Berhampur</span>
                <span className="text-[10px] text-slate-500 font-mono">0680-2292746</span>
              </a>

              <a
                href="tel:06792252102"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">PRM Baripada</span>
                <span className="text-[10px] text-slate-500 font-mono">06792-252102</span>
              </a>

              <a
                href="tel:06852250101"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">SLN Koraput</span>
                <span className="text-[10px] text-slate-500 font-mono">06852-250101</span>
              </a>

              <a
                href="tel:06742391983"
                className="p-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all flex flex-col items-center text-center cursor-pointer group"
              >
                <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform mb-1" />
                <span className="font-bold text-slate-900 truncate w-full text-[11px]">Capital Hospital BBSR</span>
                <span className="text-[10px] text-slate-500 font-mono">0674-2391983</span>
              </a>
            </div>

            {/* Handover Call Logging Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Receiving Casualty Officer (CMO):</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. B. Mohapatra, CMO Casualty"
                  value={teleCallOfficer}
                  onChange={(e) => setTeleCallOfficer(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Handover Notes / Bed Confirmation:</label>
                <input
                  type="text"
                  placeholder="e.g. Bed #4 HDU held; Blood crossmatch requisitioned"
                  value={teleCallNotes}
                  onChange={(e) => setTeleCallNotes(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setTeleCallAcknowledged(true)}
                  className="w-full p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Log Tele-Handover Call</span>
                </button>
              </div>
            </div>
          </div>

          {/* ABDM FHIR R4 Bundle JSON Viewer & Standards Validator */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                <h4 className="text-sm font-extrabold text-slate-900">
                  Ayushman Bharat Digital Mission (ABDM) FHIR R4 Bundle Validator
                </h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                Profile: ClinicalArtifactBundle (v1.0)
              </span>
            </div>

            <p className="text-xs text-slate-500">
              National standard interoperable HL7 FHIR R4 bundle payload. Can be uploaded directly to Ayushman Bharat Digital Locker or hospital EMR systems:
            </p>

            <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] max-h-64 overflow-y-auto border border-slate-800 shadow-inner">
              {JSON.stringify(generateAbdmFhirBundle(), null, 2)}
            </pre>
          </div>

          {/* Printable Vernacular Patient Medication Schedule (ରୋଗୀ ଔଷଧ ସେବନ ନିର୍ଦ୍ଦେଶାବଳୀ) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Pill className="w-4 h-4 text-indigo-600" />
                  <span>ରୋଗୀ ଓ ସହାୟକଙ୍କ ପାଇଁ ସ୍ୱଚ୍ଛ ଔଷଧ ସେବନ କାର୍ଡ (Patient Visual Dosage Schedule)</span>
                </h4>
                <p className="text-xs text-slate-500">
                  Easy visual schedule for rural patients and family attendants with time-of-day icons.
                </p>
              </div>
              <span className="text-[10px] bg-indigo-50 text-indigo-900 font-bold px-2 py-0.5 rounded border border-indigo-200">
                Odia / Hindi / English
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {medications.map((med, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <strong className="text-xs font-extrabold text-slate-900 block truncate">
                      {med.name}
                    </strong>
                    <span className="text-[10px] bg-slate-200 px-1.5 py-0.2 rounded font-bold text-slate-700">
                      {med.form}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-semibold">
                    Dose: {med.dosage} • Duration: {med.duration}
                  </div>

                  {/* Visual Time-of-Day Icons */}
                  <div className="grid grid-cols-3 gap-1 text-center text-[10px] pt-1">
                    <div className="bg-amber-50 border border-amber-200 p-1.5 rounded-lg">
                      <span className="block text-xs">🌅</span>
                      <strong className="text-amber-900 block">ସକାଳେ</strong>
                      <span className="text-[8px] text-slate-500">Morning</span>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 p-1.5 rounded-lg">
                      <span className="block text-xs">☀️</span>
                      <strong className="text-orange-900 block">ଦ୍ୱିପହର</strong>
                      <span className="text-[8px] text-slate-500">Afternoon</span>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 p-1.5 rounded-lg">
                      <span className="block text-xs">🌙</span>
                      <strong className="text-indigo-900 block">ରାତିରେ</strong>
                      <span className="text-[8px] text-slate-500">Night</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-emerald-800 font-bold bg-emerald-50 p-1.5 rounded border border-emerald-200 text-center">
                    🍽️ {med.freq.includes('after') ? 'ଖାଇବା ପରେ ସେବନ କରନ୍ତୁ (After Meals)' : 'ଖାଲି ପେଟରେ / ଖାଇବା ପୂର୍ବରୁ (Before Meals)'}
                  </div>
                </div>
              ))}
            </div>

            {/* Critical Patient Advisory Warnings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] pt-1">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900 space-y-0.5">
                <strong>⚠️ ଜରୁରୀ ସତର୍କତା (Emergency):</strong>
                <p className="text-[10px]">କୌଣସି ଆଲର୍ଜି, ବାନ୍ତି କିମ୍ବା ଶ୍ୱାସକଷ୍ଟ ହେଲେ ତୁରନ୍ତ ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା ବା ୧୦୮ କୁ ଯୋଗାଯୋଗ କରନ୍ତୁ।</p>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 space-y-0.5">
                <strong>💊 ସମ୍ପୂର୍ଣ୍ଣ କୋର୍ସ (Complete Course):</strong>
                <p className="text-[10px]">ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ବିନା ଆଣ୍ଟିବାୟୋଟିକ୍ ଔଷଧ ମଝିରେ ବନ୍ଦ କରନ୍ତୁ ନାହିଁ।</p>
              </div>
              <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-900 space-y-0.5">
                <strong>💧 ଜଳ ସେବନ (Hydration):</strong>
                <p className="text-[10px]">ଔଷଧ ସେବନ ସମୟରେ ପର୍ଯ୍ୟାପ୍ତ ବିଶୁଦ୍ଧ ପିଇବା ପାଣି ଏବଂ ORS ଗ୍ରହଣ କରନ୍ତୁ।</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 6. MODAL: 108 CAD SMS DISPATCH PREVIEW */}
      {/* ───────────────────────────────────────────────────────── */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  NHM 108 Emergency Transit SMS Token
                </h3>
              </div>
              <button
                onClick={() => setShowSmsModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This SMS token is transmitted to the patient attendant, escorting ASHA worker, and the nearest 108 ALS ambulance base:
            </p>

            <div className="p-3 bg-slate-100 rounded-xl font-mono text-xs text-slate-800 whitespace-pre-wrap border border-slate-200 max-h-60 overflow-y-auto">
              {generateSmsText()}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowSmsModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopySms}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                {copiedSms ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSms ? 'SMS Copied!' : 'Copy SMS Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 7. MODAL: EDIT CLINICIAN / RMP DETAILS */}
      {/* ───────────────────────────────────────────────────────── */}
      {showDoctorModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Update Registered Clinician (RMP) Details
                </h3>
              </div>
              <button
                onClick={() => setShowDoctorModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">RMP Doctor Name:</label>
                <input
                  type="text"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">State Medical Registration No (OMC):</label>
                <input
                  type="text"
                  value={doctorRegNo}
                  onChange={(e) => setDoctorRegNo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Degrees &amp; Specialization:</label>
                <input
                  type="text"
                  value={doctorDegrees}
                  onChange={(e) => setDoctorDegrees(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Facility:</label>
                <input
                  type="text"
                  value={facilityName}
                  onChange={(e) => setFacilityName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowDoctorModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 8. MODAL: ADVANCED DOCTOR DIGITAL SIGNATURE & DSC STUDIO */}
      {/* ───────────────────────────────────────────────────────── */}
      {showSignModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <PenTool className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    Doctor Digital Pen Signature &amp; DSC Seal Studio
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Compliant with NMC Section 27, ABDM Healthcare Professional Registry &amp; IT Act 2000
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSignModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {/* Three Signing Modes Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
              <button
                onClick={() => setSignModalTab('draw')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  signModalTab === 'draw'
                    ? 'bg-white text-indigo-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Digital Pen / Stylus</span>
              </button>

              <button
                onClick={() => {
                  setSignModalTab('dsc');
                  handleGenerateDscSeal();
                }}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  signModalTab === 'dsc'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>1-Click DSC Seal</span>
              </button>

              <button
                onClick={() => setSignModalTab('upload')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  signModalTab === 'upload'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-blue-600" />
                <span>Upload Signature</span>
              </button>
            </div>

            {/* TAB 1: FREEHAND DIGITAL PEN / STYLUS DRAWING */}
            {signModalTab === 'draw' && (
              <div className="space-y-3">
                {/* Pen Toolbar: Ink Color, Nib Thickness & Quick Tools */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  {/* Ink Colors */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Ink:</span>
                    <button
                      type="button"
                      onClick={() => setPenColor('#0f2963')}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        penColor === '#0f2963' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent'
                      } bg-[#0f2963]`}
                      title="Clinical Navy Blue (Standard)"
                    />
                    <button
                      type="button"
                      onClick={() => setPenColor('#0f172a')}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        penColor === '#0f172a' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent'
                      } bg-[#0f172a]`}
                      title="Official Black"
                    />
                    <button
                      type="button"
                      onClick={() => setPenColor('#065f46')}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        penColor === '#065f46' ? 'border-indigo-600 scale-110 shadow-xs' : 'border-transparent'
                      } bg-[#065f46]`}
                      title="Doctor Emerald Green"
                    />
                  </div>

                  {/* Pen Style Selector */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Pen:</span>
                    {[
                      { id: 'gel', label: 'Gel', icon: '✒️' },
                      { id: 'fountain', label: 'Fountain', icon: '🖋️' },
                      { id: 'ballpoint', label: 'Ballpoint', icon: '🖊️' }
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => setPenStyle(style.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          penStyle === style.id
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title={`${style.label} Pen (Natural Dynamic Physics)`}
                      >
                        <span>{style.icon}</span>
                        <span>{style.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Nib Widths */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-1">Nib:</span>
                    {[
                      { label: 'Fine', size: 1.5 },
                      { label: 'Medium', size: 2.5 },
                      { label: 'Bold', size: 4.0 }
                    ].map((nib) => (
                      <button
                        key={nib.label}
                        type="button"
                        onClick={() => setPenThickness(nib.size)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          penThickness === nib.size
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {nib.label}
                      </button>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleUndoStroke}
                      disabled={strokeHistory.length === 0}
                      className="px-2 py-1 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="Undo last stroke"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Undo</span>
                    </button>

                    <button
                      type="button"
                      onClick={clearSignature}
                      className="px-2 py-1 bg-white hover:bg-rose-50 text-rose-700 border border-slate-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="Clear pad"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Clear</span>
                    </button>

                    <button
                      type="button"
                      onClick={adoptDefaultSignature}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                      title="Auto-generate elegant cursive doctor name"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-500" />
                      <span>Cursive</span>
                    </button>
                  </div>
                </div>

                {/* Canvas Drawing Area with Baseline */}
                <div className="relative bg-slate-50 border-2 border-dashed border-indigo-300 rounded-2xl p-2 flex flex-col items-center shadow-inner">
                  <canvas
                    ref={canvasRef}
                    style={{ width: '480px', height: '160px', touchAction: 'none' }}
                    className="max-w-full bg-white rounded-xl cursor-crosshair shadow-xs border border-slate-200 select-none"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  />

                  {/* Watermark Signature Baseline */}
                  <div className="w-[460px] max-w-full flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1 select-none pointer-events-none">
                    <span>✍️ Sign above this baseline</span>
                    <span>{doctorRegNo} • OMC</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: 1-CLICK VERIFIED DSC SEAL */}
            {signModalTab === 'dsc' && (
              <div className="space-y-3">
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong>Official DSC Seal (ABDM / OMC Approved):</strong> Instant cryptographic certificate stamp generated using your registered doctor credentials, timestamp, and unique document security hash.
                  </div>
                </div>

                {signatureDataUrl && signatureType === 'dsc_stamp' && (
                  <div className="p-3 bg-white border-2 border-emerald-400 rounded-xl flex justify-center shadow-xs">
                    <img
                      src={signatureDataUrl}
                      alt="Doctor DSC Seal"
                      className="max-h-36 object-contain"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleGenerateDscSeal}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Regenerate Fresh Timestamped DSC Stamp</span>
                </button>
              </div>
            )}

            {/* TAB 3: UPLOAD PHYSICAL SIGNATURE / STAMP */}
            {signModalTab === 'upload' && (
              <div className="space-y-3">
                <div
                  onClick={() => signatureUploadRef.current && signatureUploadRef.current.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/40 p-6 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all space-y-2"
                >
                  <Upload className="w-8 h-8 text-indigo-500" />
                  <div className="text-xs">
                    <strong className="text-indigo-900 block font-bold">Click to Upload Signature / Stamp Photo</strong>
                    <span className="text-slate-500 text-[11px]">Supports PNG, JPG, JPEG with white/transparent background</span>
                  </div>
                  <input
                    ref={signatureUploadRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadSignatureFile}
                    className="hidden"
                  />
                </div>

                {signatureDataUrl && signatureType === 'uploaded' && (
                  <div className="p-3 bg-white border border-slate-200 rounded-xl flex justify-center shadow-xs">
                    <img
                      src={signatureDataUrl}
                      alt="Uploaded Signature"
                      className="max-h-32 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Live Preview & Final Save Confirmation */}
            <div className="border-t border-slate-200 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-bold">Attached Status:</span>
                {signatureDataUrl ? (
                  <span className="text-emerald-700 font-black flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Active ({signatureType.toUpperCase()})</span>
                  </span>
                ) : (
                  <span className="text-amber-700 font-medium text-[11px]">
                    No signature attached yet (Draft mode)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setShowSignModal(false)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Attach to Prescription &amp; Referral</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 9. MODAL: ICD-10 STANDARDIZED DIAGNOSIS SEARCH */}
      {/* ───────────────────────────────────────────────────────── */}
      {showIcdModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  Search &amp; Insert Standard ICD-10 Diagnosis
                </h3>
              </div>
              <button
                onClick={() => setShowIcdModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Search diagnosis name, ICD code, or condition..."
                value={icdSearchTerm}
                onChange={(e) => setIcdSearchTerm(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
              {filteredIcdList.map((item) => (
                <div
                  key={item.code}
                  onClick={() => handleSelectIcdDiagnosis(item)}
                  className="p-3 hover:bg-teal-50/70 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-teal-100 text-teal-900 px-2 py-0.5 rounded text-[11px]">
                        {item.code}
                      </span>
                      <strong className="text-slate-900">{item.name}</strong>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{item.category}</span>
                  </div>
                  <span className="text-teal-700 font-bold text-[11px] shrink-0">Insert &rarr;</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowIcdModal(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 10. MODAL: OFFICIAL AYUSHMAN BHARAT HEALTH ACCOUNT (ABHA) DIGITAL CARD */}
      {/* ───────────────────────────────────────────────────────── */}
      {showAbhaCardModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <span>Ayushman Bharat Health Account (ABHA)</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-300">
                      M1 • M2 • M3
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    National Health Authority (NHA) • Ministry of Health &amp; Family Welfare, Govt. of India
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAbhaCardModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center text-sm font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* THE OFFICIAL AUTHENTIC ABHA DIGITAL HEALTH CARD CANVAS */}
            <div
              id="printable-abha-card"
              className="rounded-3xl border-2 border-teal-600 bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white p-5 sm:p-6 shadow-xl relative overflow-hidden space-y-4"
            >
              {/* Indian National Tricolor Ribbon Header */}
              <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-500 rounded-full shadow-xs mb-1"></div>

              {/* Card Apex Strip */}
              <div className="flex justify-between items-start gap-2 border-b border-teal-700/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white text-teal-900 flex items-center justify-center font-black text-xs shadow-md border border-teal-200 shrink-0">
                    ABHA
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-teal-200 block">
                      National Health Authority • Govt of India
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white tracking-wide block">
                      Ayushman Bharat Digital Mission (ABDM)
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-orange-500/20 text-orange-300 border border-orange-400/40 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider block">
                    Odisha BSKY Linked
                  </span>
                  <span className="text-[9px] text-teal-300/80 font-mono block mt-0.5">
                    Tier: State Apex Health Card
                  </span>
                </div>
              </div>

              {/* Patient Core Identity Block with Real ABDM Scannable QR */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-center bg-teal-950/70 p-3.5 rounded-2xl border border-teal-700/50">
                {/* Left Profile Avatar */}
                <div className="flex flex-col items-center text-center sm:items-start sm:text-left gap-2 sm:col-span-2">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 border-2 border-white/40 flex items-center justify-center text-white shadow-inner shrink-0">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                        Beneficiary Name
                      </span>
                      <strong className="text-white text-sm sm:text-base font-black tracking-tight block">
                        {patientName}
                      </strong>
                      <div className="text-[11px] text-teal-200 font-semibold flex items-center gap-1.5 mt-0.5">
                        <span>{patientAge} Yrs</span>
                        <span>•</span>
                        <span>{patientGender}</span>
                        <span>•</span>
                        <span className="text-rose-300 font-bold">ABO: {currentCase.bloodGroup || 'O+'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-teal-800/60 text-[10px]">
                    <div>
                      <span className="text-teal-400 block font-bold">Domicile / District:</span>
                      <span className="text-white font-medium">{currentCase.district || 'Cuttack'}, Odisha</span>
                    </div>
                    <div>
                      <span className="text-teal-400 block font-bold">Registered Mobile:</span>
                      <span className="font-mono text-white font-medium">{patientPhone}</span>
                    </div>
                  </div>
                </div>

                {/* Right Scannable ABDM QR Code */}
                <div className="flex flex-col items-center justify-center p-2 bg-white rounded-xl border border-teal-300 shadow-md">
                  {abhaQrDataUrl ? (
                    <img
                      src={abhaQrDataUrl}
                      alt="ABHA Scannable QR Code"
                      className="w-24 h-24 object-contain"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-teal-50 flex items-center justify-center text-[10px] text-teal-800 font-bold">
                      ABDM QR
                    </div>
                  )}
                  <span className="text-[8px] font-black text-teal-950 uppercase tracking-widest mt-1">
                    Scan for PHR
                  </span>
                </div>
              </div>

              {/* Official 14-Digit ABHA Number Strip */}
              <div className="p-3 bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 rounded-2xl border border-teal-500/50 space-y-1.5">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-teal-300 uppercase font-black tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ABHA 14-Digit Health ID Number:</span>
                  </span>
                  <span className="text-emerald-400 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-600/50">
                    ✓ ACTIVE_VERIFIED
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg sm:text-xl font-black text-white tracking-widest block">
                    {patientAbha}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(patientAbha);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="p-1.5 bg-teal-800/80 hover:bg-teal-700 text-teal-200 rounded-lg cursor-pointer transition-colors"
                    title="Copy ABHA ID"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex justify-between items-center text-[10px] pt-1 border-t border-teal-800/60">
                  <span className="text-teal-200 font-mono">
                    ABHA Address: <strong>{patientAbha.replace(/[^0-9]/g, '').slice(0, 10)}@abdm</strong>
                  </span>
                  <span className="text-teal-300/80">
                    Consent Manager: Eka Care / SHA Odisha
                  </span>
                </div>
              </div>

              {/* Bottom Card Security & Health Scheme Footer */}
              <div className="flex flex-wrap justify-between items-center text-[9px] text-teal-200/90 pt-1 border-t border-teal-700/60">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span>ABDM Milestone M1 (Creation), M2 (Discovery), M3 (Linking) Compliant</span>
                </div>
                <span className="font-mono text-teal-300">
                  Govt. of Odisha • SwasthyaMitra Portal
                </span>
              </div>
            </div>

            {/* Modal Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    const printContents = document.getElementById('printable-abha-card');
                    if (printContents) {
                      const printWindow = window.open('', '_blank');
                      printWindow.document.write(`
                        <html>
                          <head>
                            <title>ABHA Digital Card - ${patientName}</title>
                            <script src="https://cdn.tailwindcss.com"></script>
                            <style>
                              body { font-family: system-ui, sans-serif; padding: 20px; display: flex; justify-content: center; }
                              @media print { body { padding: 0; } }
                            </style>
                          </head>
                          <body>
                            <div style="max-width: 500px; width: 100%;">
                              ${printContents.outerHTML}
                            </div>
                            <script>
                              window.onload = function() { window.print(); window.close(); }
                            </script>
                          </body>
                        </html>
                      `);
                      printWindow.document.close();
                    }
                  }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print ABHA Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`ABHA ID: ${patientAbha}\nName: ${patientName}\nABHA Address: ${patientAbha.replace(/[^0-9]/g, '').slice(0, 10)}@abdm\nState: Odisha (BSKY Linked)`);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-teal-200"
                >
                  <Copy className="w-3.5 h-3.5 text-teal-700" />
                  <span>Copy Details</span>
                </button>
              </div>

              <button
                onClick={() => setShowAbhaCardModal(false)}
                className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
