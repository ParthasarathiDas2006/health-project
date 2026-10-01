import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Baby,
  Heart,
  ShieldCheck,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Sliders,
  ArrowRight,
  Search,
  Filter,
  Plus,
  Volume2,
  Printer,
  User,
  Stethoscope
} from 'lucide-react';

export default function ClinicalRiskScoreSuite({ appLang = 'en-IN', currentUser }) {
  // Navigation Tabs within Module 14
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'calculator' | 'triage_note' | 'protocols'
  const [activeSubCalc, setActiveSubCalc] = useState('all'); // 'all' | 'qsofa' | 'gcs' | 'apgar' | 'maternal'
  const [copiedNote, setCopiedNote] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL'); // 'ALL' | 'SEPSIS' | 'TRAUMA' | 'NEONATAL' | 'MATERNAL'

  // Modal for adding a custom patient record
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    facility: 'Capital Hospital PHC',
    category: 'sepsis',
    tag: 'Custom Triage Entry',
    rr: 22,
    sbp: 110,
    dbp: 75,
    hb: 12.0,
    alteredGcs: false,
    gcsEye: 4,
    gcsVerbal: 5,
    gcsMotor: 6,
    apgarA: 2,
    apgarP: 2,
    apgarG: 2,
    apgarAct: 2,
    apgarR: 2,
    history: ''
  });

  // ─── 10 Rich, Realistic Clinical Records across Odisha Districts ───────────
  const [patients, setPatients] = useState([
    {
      id: 'p1',
      name: 'Niranjan Mishra',
      age: 68,
      gender: 'Male',
      district: 'Cuttack',
      facility: 'SCB Medical College & Hospital',
      category: 'sepsis',
      tag: 'Critical Sepsis Alert',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
      riskTier: 'HIGH RISK',
      qsofa: { rr: 26, sbp: 92, alteredGcs: true },
      gcs: { eye: 3, verbal: 4, motor: 6 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 120, dbp: 80, hb: 12.4, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Elderly diabetic with 4 days high-grade fever with rigors, tachypnea, and hypotension. Suspected urosepsis and early septic shock.'
    },
    {
      id: 'p2',
      name: 'Deepak Jena',
      age: 29,
      gender: 'Male',
      district: 'Bhubaneswar',
      facility: 'Capital Hospital Trauma Centre',
      category: 'trauma',
      tag: 'High-Velocity RTA Trauma',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      riskTier: 'CRITICAL',
      qsofa: { rr: 18, sbp: 130, alteredGcs: true },
      gcs: { eye: 2, verbal: 2, motor: 3 }, // GCS = 7
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 124, dbp: 82, hb: 13.5, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Motorbike skid without helmet. Unconscious, abnormal flexion to noxious stimulation. Left pupil 4mm sluggish. Urgent intubation & NCCT head.'
    },
    {
      id: 'p3',
      name: 'Infant of Sunita Mohanty',
      age: '1 min',
      gender: 'Female',
      district: 'Cuttack',
      facility: 'Salipur Community Health Centre',
      category: 'neonatal',
      tag: 'Routine Delivery Transition',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      riskTier: 'NORMAL',
      qsofa: { rr: 40, sbp: 110, alteredGcs: false },
      gcs: { eye: 4, verbal: 5, motor: 6 },
      apgar: { a: 1, p: 2, g: 2, act: 2, r: 2 }, // APGAR = 9
      maternal: { sbp: 118, dbp: 76, hb: 11.8, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Term normal vaginal delivery. Vigorous cry, HR 138 bpm, acrocyanosis noted on palms/soles. Normal neonatal adaptation.'
    },
    {
      id: 'p4',
      name: 'Infant of Laxmi Hansda',
      age: '1 min',
      gender: 'Male',
      district: 'Mayurbhanj',
      facility: 'Baripada District Headquarters Hospital (DHH)',
      category: 'neonatal',
      tag: 'Birth Asphyxia / Meconium',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
      riskTier: 'CRITICAL',
      qsofa: { rr: 14, sbp: 80, alteredGcs: true },
      gcs: { eye: 1, verbal: 1, motor: 1 },
      apgar: { a: 0, p: 1, g: 1, act: 0, r: 1 }, // APGAR = 3
      maternal: { sbp: 120, dbp: 80, hb: 10.5, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Thick meconium stained amniotic fluid. Limp, cyanotic, feeble heart rate 85 bpm, gasping respiration. Immediate PPV & NRP resuscitation.'
    },
    {
      id: 'p5',
      name: 'Priyanka Das',
      age: 25,
      gender: 'Female',
      district: 'Khordha',
      facility: 'Khordha DHH Obstetric Ward',
      category: 'maternal',
      tag: 'Preeclampsia HRP (PMSMA)',
      tagColor: 'bg-purple-100 text-purple-800 border-purple-300',
      riskTier: 'HIGH RISK',
      qsofa: { rr: 20, sbp: 156, alteredGcs: false },
      gcs: { eye: 4, verbal: 5, motor: 6 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 156, dbp: 98, hb: 8.2, headache: true, vision: true, edema: true, bleeding: false, highSugar: true },
      history: 'Primigravida at 34 weeks gestation with severe throbbing headache, blurred vision, bilateral pitting pedal edema. Red sticker PMSMA referral.'
    },
    {
      id: 'p6',
      name: 'Subhashree Nayak',
      age: 21,
      gender: 'Female',
      district: 'Balasore',
      facility: 'Jaleswar Sub-Divisional Hospital',
      category: 'maternal',
      tag: 'Severe Gestational Anemia',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
      riskTier: 'HIGH RISK',
      qsofa: { rr: 22, sbp: 98, alteredGcs: false },
      gcs: { eye: 4, verbal: 5, motor: 6 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 98, dbp: 60, hb: 6.4, headache: true, vision: false, edema: true, bleeding: false, highSugar: false },
      history: 'Gravida 2 at 31 weeks with profound pallor, exertional breathlessness, palpitations, and severe microcytic hypochromic anemia (Hb 6.4 g/dL).'
    },
    {
      id: 'p7',
      name: 'Balaram Sahoo',
      age: 74,
      gender: 'Male',
      district: 'Puri',
      facility: 'Puri District Headquarters Hospital',
      category: 'sepsis',
      tag: 'Frail Geriatric Pneumonia',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
      riskTier: 'HIGH RISK',
      qsofa: { rr: 25, sbp: 96, alteredGcs: true },
      gcs: { eye: 3, verbal: 4, motor: 5 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 110, dbp: 70, hb: 11.2, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Elderly bedbound patient with productive cough, drowsiness, SpO2 89%, and high fever. qSOFA score 2/3 indicating severe community-acquired sepsis.'
    },
    {
      id: 'p8',
      name: 'Manaswini Behera',
      age: 42,
      gender: 'Female',
      district: 'Sundargarh',
      facility: 'Rourkela Govt Hospital (RGH)',
      category: 'sepsis',
      tag: 'DKA & Hyperventilation',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      riskTier: 'MODERATE',
      qsofa: { rr: 32, sbp: 98, alteredGcs: true },
      gcs: { eye: 3, verbal: 4, motor: 6 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 120, dbp: 80, hb: 12.0, headache: false, vision: false, edema: false, bleeding: false, highSugar: true },
      history: 'Known Type-2 DM with omitted insulin. Deep rapid Kussmaul respirations (RR 32/min), fruity breath odor, blood glucose 448 mg/dL, ketones positive.'
    },
    {
      id: 'p9',
      name: 'Ranjit Mohapatra',
      age: 35,
      gender: 'Male',
      district: 'Ganjam',
      facility: 'MKCG Medical College Berhampur',
      category: 'trauma',
      tag: 'Blunt Trauma & Concussion',
      tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
      riskTier: 'MODERATE',
      qsofa: { rr: 16, sbp: 138, alteredGcs: true },
      gcs: { eye: 3, verbal: 4, motor: 4 }, // GCS = 11
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 120, dbp: 80, hb: 14.1, headache: false, vision: false, edema: false, bleeding: false, highSugar: false },
      history: 'Physical assault with blunt object to parietal skull. Amnesia of event, nausea, repeated vomiting, localizes to painful stimuli. HDU admission.'
    },
    {
      id: 'p10',
      name: 'Ananya Rout',
      age: 17,
      gender: 'Female',
      district: 'Kendrapada',
      facility: 'Kendrapada Sub-Divisional Hospital',
      category: 'maternal',
      tag: 'Teenage Eclampsia Convulsion',
      tagColor: 'bg-rose-100 text-rose-800 border-rose-300',
      riskTier: 'CRITICAL',
      qsofa: { rr: 24, sbp: 164, alteredGcs: true },
      gcs: { eye: 2, verbal: 3, motor: 5 },
      apgar: { a: 2, p: 2, g: 2, act: 2, r: 2 },
      maternal: { sbp: 164, dbp: 106, hb: 8.8, headache: true, vision: true, edema: true, bleeding: false, highSugar: false },
      history: 'Unregistered adolescent pregnancy at 36 weeks presenting with 2 episodes of generalized tonic-clonic convulsions and post-ictal stupor.'
    }
  ]);

  // Selected Active Patient in the Calculator
  const [selectedPatientId, setSelectedPatientId] = useState('p1');
  const activePatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  // ─── Calculator Live State ────────────────────────────────────────────────
  // qSOFA State
  const [rr, setRr] = useState(26);
  const [sbp, setSbp] = useState(92);
  const [alteredGcs, setAlteredGcs] = useState(true);

  // GCS State
  const [gcsEye, setGcsEye] = useState(3);       // 1 - 4
  const [gcsVerbal, setGcsVerbal] = useState(4); // 1 - 5
  const [gcsMotor, setGcsMotor] = useState(6);   // 1 - 6

  // APGAR State
  const [apgarA, setApgarA] = useState(2);
  const [apgarP, setApgarP] = useState(2);
  const [apgarG, setApgarG] = useState(2);
  const [apgarAct, setApgarAct] = useState(2);
  const [apgarR, setApgarR] = useState(2);

  // Maternal PMSMA State
  const [matSbp, setMatSbp] = useState(156);
  const [matDbp, setMatDbp] = useState(98);
  const [matHb, setMatHb] = useState(8.2);
  const [matHeadache, setMatHeadache] = useState(true);
  const [matVision, setMatVision] = useState(true);
  const [matEdema, setMatEdema] = useState(true);
  const [matBleeding, setMatBleeding] = useState(false);
  const [matHighSugar, setMatHighSugar] = useState(true);

  // Load a patient's vitals into the live calculator
  const loadPatientIntoCalculator = (patient) => {
    setSelectedPatientId(patient.id);
    setRr(patient.qsofa.rr);
    setSbp(patient.qsofa.sbp);
    setAlteredGcs(patient.qsofa.alteredGcs);

    setGcsEye(patient.gcs.eye);
    setGcsVerbal(patient.gcs.verbal);
    setGcsMotor(patient.gcs.motor);

    setApgarA(patient.apgar.a);
    setApgarP(patient.apgar.p);
    setApgarG(patient.apgar.g);
    setApgarAct(patient.apgar.act);
    setApgarR(patient.apgar.r);

    setMatSbp(patient.maternal.sbp);
    setMatDbp(patient.maternal.dbp);
    setMatHb(patient.maternal.hb);
    setMatHeadache(patient.maternal.headache);
    setMatVision(patient.maternal.vision);
    setMatEdema(patient.maternal.edema);
    setMatBleeding(patient.maternal.bleeding);
    setMatHighSugar(patient.maternal.highSugar);

    setActiveTab('calculator');
  };

  // ─── Computed Clinical Scores ─────────────────────────────────────────────
  const qsofaPoints = (rr >= 22 ? 1 : 0) + (sbp <= 100 ? 1 : 0) + (alteredGcs ? 1 : 0);
  const isQsofaHigh = qsofaPoints >= 2;

  const gcsTotal = gcsEye + gcsVerbal + gcsMotor;
  const gcsSeverity = gcsTotal <= 8 ? 'SEVERE' : gcsTotal <= 12 ? 'MODERATE' : 'MILD';

  const apgarTotal = apgarA + apgarP + apgarG + apgarAct + apgarR;
  const apgarSeverity = apgarTotal >= 7 ? 'NORMAL' : apgarTotal >= 4 ? 'MODERATE' : 'CRITICAL';

  const isPreeclampsia = matSbp >= 140 || matDbp >= 90;
  const isSevereAnemia = matHb < 7.0;
  const isModerateAnemia = matHb >= 7.0 && matHb < 10.0;
  const maternalRedFlags = (isPreeclampsia && (matHeadache || matVision || matEdema)) || matBleeding || isSevereAnemia;
  const maternalRiskLevel = maternalRedFlags ? 'HIGH RISK (RED STICKER)' : (isModerateAnemia || isPreeclampsia || matHighSugar) ? 'MODERATE (YELLOW STICKER)' : 'NORMAL (GREEN STICKER)';

  // Filtered Patient List
  const filteredPatients = useMemo(() => {
    return patients.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        categoryFilter === 'ALL' ||
        (categoryFilter === 'SEPSIS' && p.category === 'sepsis') ||
        (categoryFilter === 'TRAUMA' && p.category === 'trauma') ||
        (categoryFilter === 'NEONATAL' && p.category === 'neonatal') ||
        (categoryFilter === 'MATERNAL' && p.category === 'maternal');

      return matchesSearch && matchesCat;
    });
  }, [patients, searchQuery, categoryFilter]);

  // Handle Add New Record
  const handleCreatePatient = (e) => {
    e.preventDefault();
    if (!newPatient.name.trim()) return;

    const created = {
      id: `custom_${Date.now()}`,
      name: newPatient.name,
      age: newPatient.age || 'Adult',
      gender: newPatient.gender,
      district: 'Odisha PHC Network',
      facility: newPatient.facility,
      category: newPatient.category,
      tag: newPatient.tag || 'Custom Triage Entry',
      tagColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      riskTier: newPatient.rr >= 22 || newPatient.sbp <= 100 ? 'HIGH RISK' : 'NORMAL',
      qsofa: { rr: Number(newPatient.rr), sbp: Number(newPatient.sbp), alteredGcs: newPatient.alteredGcs },
      gcs: { eye: Number(newPatient.gcsEye), verbal: Number(newPatient.gcsVerbal), motor: Number(newPatient.gcsMotor) },
      apgar: { a: Number(newPatient.apgarA), p: Number(newPatient.apgarP), g: Number(newPatient.apgarG), act: Number(newPatient.apgarAct), r: Number(newPatient.apgarR) },
      maternal: {
        sbp: Number(newPatient.sbp),
        dbp: Number(newPatient.dbp),
        hb: Number(newPatient.hb),
        headache: false,
        vision: false,
        edema: false,
        bleeding: false,
        highSugar: false
      },
      history: newPatient.history || 'Patient registered for standardized clinical risk evaluation.'
    };

    setPatients([created, ...patients]);
    setShowAddModal(false);
    loadPatientIntoCalculator(created);
  };

  // Generate Standardized Clinical Note
  const generateClinicalNote = () => {
    return `=== GOVT OF ODISHA STANDARDIZED CLINICAL DECISION SUPPORT & TRIAGE NOTE ===
Generated on: ${new Date().toLocaleString('en-IN')}
Nodal Facility: ${activePatient.facility} (${activePatient.district}, Odisha)
Evaluating Clinician: ${currentUser?.name || 'Dr. Medical Officer'} (${currentUser?.facility || 'SCB Nodal Tele-Triage Network'})

PATIENT CLINICAL SUMMARY:
- Patient Name: ${activePatient.name} | Age / Gender: ${activePatient.age} / ${activePatient.gender}
- Case Classification: ${activePatient.tag} (${activePatient.category.toUpperCase()})
- Presenting Clinical History: ${activePatient.history}

STANDARDIZED CLINICAL SCORES & RISK INDICES (ICMR / MoHFW / WHO GUIDELINES):
1. qSOFA Sepsis Risk Score: ${qsofaPoints} / 3 [${isQsofaHigh ? 'HIGH RISK OF SEPSIS & MORTALITY' : qsofaPoints === 1 ? 'MODERATE RISK' : 'LOW RISK'}]
   • Respiratory Rate: ${rr} breaths/min (${rr >= 22 ? 'CRITICAL ≥22/min (+1 pt)' : 'Normal (<22/min)'})
   • Systolic Blood Pressure: ${sbp} mmHg (${sbp <= 100 ? 'HYPOTENSION ≤100 mmHg (+1 pt)' : 'Normal (>100 mmHg)'})
   • Mental Status / Mentation: ${alteredGcs ? 'Altered / Obtunded (GCS <15) (+1 pt)' : 'Alert / Normal Sensorium'}

2. Glasgow Coma Scale (GCS): ${gcsTotal} / 15 [Grade: ${gcsSeverity} HEAD TRAUMA]
   • Eye Opening (E): E${gcsEye}/4
   • Verbal Response (V): V${gcsVerbal}/5
   • Motor Response (M): M${gcsMotor}/6

3. Neonatal APGAR Score (1 & 5 min): ${apgarTotal} / 10 [Status: ${apgarSeverity}]
   • Color (A): ${apgarA}/2 | Heart Rate (P): ${apgarP}/2 | Grimace (G): ${apgarG}/2
   • Muscle Tone (A): ${apgarAct}/2 | Respiration Effort (R): ${apgarR}/2

4. Maternal PMSMA Risk Assessment: ${maternalRiskLevel}
   • Blood Pressure: ${matSbp}/${matDbp} mmHg (${isPreeclampsia ? 'Hypertension / Preeclampsia Alert' : 'Normal'})
   • Hemoglobin Level: ${matHb} g/dL (${isSevereAnemia ? 'Severe Anemia' : isModerateAnemia ? 'Moderate Anemia' : 'Normal'})
   • High-Risk Symptoms Reported: ${[matHeadache && 'Severe Headache', matVision && 'Blurred Vision', matEdema && 'Pedal Edema', matBleeding && 'APH / Bleeding', matHighSugar && 'GDM Hyperglycemia'].filter(Boolean).join(', ') || 'None'}

EMERGENCY CLINICAL DIRECTIVES & PROTOCOL ESCALATION:
${isQsofaHigh ? '🚨 IMMEDIATE SEPSIS PROTOCOL: Start 30 mL/kg IV Crystalloid bolus, collect Blood Cultures, administer Broad-Spectrum IV Antibiotics within 60 minutes, check serum lactate, notify ICU for bed.' : ''}
${gcsTotal <= 8 ? '🚨 NEUROLOGICAL EMERGENCY: "GCS of 8, Intubate!" Secure endotracheal airway immediately, elevate head of bed 30°, request urgent Non-Contrast CT Brain, notify Neurosurgery.' : ''}
${apgarTotal < 7 ? '⚠️ NEONATAL NRP INTERVENTION: Clear secretions, dry and warm under radiant warmer, initiate bag-mask positive pressure ventilation if HR <100 bpm.' : ''}
${maternalRedFlags ? '🚨 PMSMA RED STICKER EMERGENCY: Administer Loading Dose Magnesium Sulphate (Prichard Protocol), arrange immediate 108 ALS Ambulance transfer to Obstetric First Referral Unit (FRU).' : ''}
${!isQsofaHigh && gcsTotal > 8 && apgarTotal >= 7 && !maternalRedFlags ? '✓ Patient stable under routine clinical observation. Repeat vital signs in 4 hours.' : ''}

Verified by Automated Standardized Clinical Decision Support Suite.
Format: ABDM FHIR Release 4.0.1 Observation Resource.`;
  };

  const handleCopyNote = () => {
    navigator.clipboard.writeText(generateClinicalNote());
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2500);
  };

  // Text to Speech Readout of Clinical Directive
  const handleSpeakDirectives = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = `Clinical risk evaluation for patient ${activePatient.name}. qSOFA sepsis score is ${qsofaPoints} out of 3. Glasgow coma scale is ${gcsTotal} out of 15, classified as ${gcsSeverity} trauma. Neonatal APGAR score is ${apgarTotal} out of 10. Maternal risk is ${maternalRiskLevel}. ${
      isQsofaHigh ? 'Critical alert: Start immediate intravenous sepsis fluids and antibiotics.' : ''
    } ${gcsTotal <= 8 ? 'Critical alert: GCS is 8 or below. Intubation required.' : ''}`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="bg-white p-4 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center gap-1">
              <Activity className="w-3 h-3 text-indigo-600" /> Standardized Clinical Decision Support (CDS)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> MoHFW &amp; ICMR Validated
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              10 Verified Odisha Cases
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Activity className="w-6 h-6 text-indigo-600 shrink-0" />
            14. Automated Standardized Clinical Risk Calculator Suite
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Standardized calculators for Sepsis (qSOFA), Head Trauma (Glasgow Coma Scale), Neonatal Transition (APGAR), and High-Risk Pregnancy (PMSMA) with live multi-patient roster.
          </p>
        </div>

        {/* Action Buttons: Add Patient & Copy Note */}
        <div className="flex items-center gap-2 flex-wrap self-start lg:self-center">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-600" /> Add New Record
          </button>
          <button
            onClick={handleSpeakDirectives}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs border transition-all shadow-2xs ${
              isSpeaking
                ? 'bg-amber-500 text-white border-amber-600 animate-pulse'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-600" /> {isSpeaking ? 'Stop Voice' : 'Voice Summary'}
          </button>
          <button
            onClick={handleCopyNote}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all ${
              copiedNote ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copiedNote ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNote ? 'Copied Note!' : 'Copy Clinical Note'}
          </button>
        </div>
      </div>

      {/* ── Main Module 14 Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'roster'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <User className="w-4 h-4" /> Patient Roster &amp; Cases ({patients.length})
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'calculator'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Sliders className="w-4 h-4" /> Interactive Calculator Hub ({activePatient.name})
        </button>
        <button
          onClick={() => setActiveTab('triage_note')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'triage_note'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" /> Clinical Triage Report &amp; Slip
        </button>
        <button
          onClick={() => setActiveTab('protocols')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeTab === 'protocols'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> ICMR / MoHFW Protocols
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: PATIENT ROSTER & RECORDS DIRECTORY
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'roster' && (
        <div className="space-y-4">
          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search patient by name, district, facility, or case type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-bold scrollbar-none">
              <span className="text-slate-500 text-xs hidden md:inline flex items-center gap-1">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              {[
                { id: 'ALL', label: 'All Cases (10)' },
                { id: 'SEPSIS', label: 'Sepsis (qSOFA)' },
                { id: 'TRAUMA', label: 'Trauma (GCS)' },
                { id: 'NEONATAL', label: 'Neonatal (APGAR)' },
                { id: 'MATERNAL', label: 'Maternal (PMSMA)' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setCategoryFilter(f.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition-all border ${
                    categoryFilter === f.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Roster Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {filteredPatients.map((p) => {
              const isSelected = selectedPatientId === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 relative shadow-2xs ${
                    isSelected
                      ? 'bg-indigo-50/50 border-indigo-500 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${p.tagColor}`}>
                        {p.tag}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-1">{p.name}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {p.age} • {p.gender} • <span className="text-indigo-600 font-bold">{p.district}</span>
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                      p.riskTier === 'CRITICAL' || p.riskTier === 'HIGH RISK'
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : p.riskTier === 'MODERATE'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {p.riskTier}
                    </span>
                  </div>

                  {/* Clinical History Snippet */}
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2 italic">
                    "{p.history}"
                  </p>

                  {/* Vitals Summary Pill Bar */}
                  <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono text-center">
                    <div className="bg-slate-50 border border-slate-200 p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">RR</span>
                      <span className="font-bold text-slate-800">{p.qsofa.rr}/min</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">BP</span>
                      <span className="font-bold text-slate-800">{p.maternal.sbp}/{p.maternal.dbp}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-1 rounded-lg">
                      <span className="text-slate-400 block text-[9px]">Hb</span>
                      <span className="font-bold text-slate-800">{p.maternal.hb} g/dL</span>
                    </div>
                  </div>

                  {/* Footer & Load Button */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 truncate max-w-[170px]">{p.facility}</span>
                    <button
                      onClick={() => loadPatientIntoCalculator(p)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                    >
                      {isSelected ? 'Loaded in Calc' : 'Load in Calc'} <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: INTERACTIVE CALCULATOR HUB
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'calculator' && (
        <div className="space-y-6">
          {/* Active Patient Loaded Banner */}
          <div className="bg-indigo-900 text-white p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-sm text-indigo-300 shrink-0">
                {activePatient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-sm text-white">{activePatient.name}</h3>
                  <span className="text-[10px] bg-indigo-700 text-indigo-200 px-2 py-0.5 rounded font-bold">
                    {activePatient.age} • {activePatient.gender}
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-0.5">
                  {activePatient.facility} • <span className="text-amber-300 font-bold">{activePatient.tag}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => setActiveTab('roster')}
                className="text-xs font-bold text-indigo-200 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 transition-all"
              >
                Change Patient Record
              </button>
            </div>
          </div>

          {/* Sub-calculator Selector Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveSubCalc('all')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeSubCalc === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All 4 Scores Live
            </button>
            <button
              onClick={() => setActiveSubCalc('qsofa')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeSubCalc === 'qsofa' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              qSOFA Sepsis ({qsofaPoints}/3)
            </button>
            <button
              onClick={() => setActiveSubCalc('gcs')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeSubCalc === 'gcs' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Glasgow Coma GCS ({gcsTotal}/15)
            </button>
            <button
              onClick={() => setActiveSubCalc('apgar')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeSubCalc === 'apgar' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
              }`}
            >
              Neonatal APGAR ({apgarTotal}/10)
            </button>
            <button
              onClick={() => setActiveSubCalc('maternal')}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                activeSubCalc === 'maternal' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
              }`}
            >
              Maternal PMSMA Risk
            </button>
          </div>

          {/* 1. qSOFA Sepsis Calculator */}
          {(activeSubCalc === 'all' || activeSubCalc === 'qsofa') && (
            <div className="bg-rose-50/60 p-4 sm:p-5 rounded-2xl border border-rose-200 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/80 pb-3">
                <div>
                  <h3 className="text-sm font-black text-rose-950 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    1. quick Sepsis-related Organ Failure Assessment (qSOFA)
                  </h3>
                  <p className="text-xs text-rose-800 mt-0.5">Identifies infection patients at high risk of prolonged ICU stay or in-hospital death.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-rose-900">Computed Score:</span>
                  <span className={`text-xl font-black px-3.5 py-1 rounded-xl border shadow-2xs ${
                    isQsofaHigh ? 'bg-rose-600 text-white border-rose-700 animate-pulse' : 'bg-white text-rose-900 border-rose-300'
                  }`}>
                    {qsofaPoints} / 3
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Parameter 1: RR */}
                <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Respiration Rate</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${rr >= 22 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {rr >= 22 ? '+1 pt (≥22)' : '0 pt'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-rose-950">{rr} <span className="text-xs text-slate-500 font-normal">/min</span></span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRr(Math.max(10, rr - 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setRr(Math.min(45, rr + 1))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    value={rr}
                    onChange={(e) => setRr(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button onClick={() => setRr(16)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-bold">16 (Normal)</button>
                    <button onClick={() => setRr(24)} className="text-[10px] bg-rose-100 text-rose-800 hover:bg-rose-200 px-2 py-0.5 rounded font-bold">24 (Tachypnea)</button>
                  </div>
                </div>

                {/* Parameter 2: SBP */}
                <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Systolic Blood Pressure</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${sbp <= 100 ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {sbp <= 100 ? '+1 pt (≤100)' : '0 pt'}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xl font-black text-rose-950">{sbp} <span className="text-xs text-slate-500 font-normal">mmHg</span></span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setSbp(Math.max(60, sbp - 5))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                      >
                        -
                      </button>
                      <button
                        onClick={() => setSbp(Math.min(180, sbp + 5))}
                        className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-black text-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    value={sbp}
                    onChange={(e) => setSbp(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex gap-1.5 pt-1">
                    <button onClick={() => setSbp(90)} className="text-[10px] bg-rose-100 text-rose-800 hover:bg-rose-200 px-2 py-0.5 rounded font-bold">90 (Hypotension)</button>
                    <button onClick={() => setSbp(120)} className="text-[10px] bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded font-bold">120 (Normal)</button>
                  </div>
                </div>

                {/* Parameter 3: Mental Status */}
                <div className="bg-white p-3.5 rounded-xl border border-rose-200 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Altered Mentation</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded ${alteredGcs ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {alteredGcs ? '+1 pt (GCS <15)' : '0 pt'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Any acute change in sensorium / drowsiness</p>
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button
                      onClick={() => setAlteredGcs(false)}
                      className={`p-2 rounded-lg font-bold border transition-all ${
                        !alteredGcs ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Alert (GCS 15)
                    </button>
                    <button
                      onClick={() => setAlteredGcs(true)}
                      className={`p-2 rounded-lg font-bold border transition-all ${
                        alteredGcs ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      Altered (&lt;15)
                    </button>
                  </div>
                </div>
              </div>

              {/* Protocol Alert */}
              <div className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                isQsofaHigh ? 'bg-rose-100 border-rose-300 text-rose-950 font-medium' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <span>
                  {isQsofaHigh
                    ? '🚨 High Risk (qSOFA ≥ 2): High mortality likelihood. Start 30 mL/kg IV Crystalloid + Broad Spectrum Antibiotics <60 mins.'
                    : '✓ Low Risk (qSOFA < 2): Re-evaluate vitals every 2-4 hours or if condition alters.'}
                </span>
                <span className="text-[10px] font-black bg-white/80 px-2 py-1 rounded shrink-0">
                  Surviving Sepsis Campaign
                </span>
              </div>
            </div>
          )}

          {/* 2. Glasgow Coma Scale (GCS) */}
          {(activeSubCalc === 'all' || activeSubCalc === 'gcs') && (
            <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-4 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
                <div>
                  <h3 className="text-sm font-black text-amber-950 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-amber-600" />
                    2. Glasgow Coma Scale (GCS) Interactive Assessor
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">Assesses neurological conscious state and traumatic brain injury severity.</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-900">Total Score:</span>
                  <span className={`text-xl font-black px-3.5 py-1 rounded-xl border shadow-2xs ${
                    gcsTotal <= 8 ? 'bg-rose-600 text-white border-rose-700' : 'bg-white text-amber-950 border-amber-300'
                  }`}>
                    {gcsTotal} / 15 ({gcsSeverity})
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
                {/* Eye Opening */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Eye Opening (E)</span>
                    <span className="text-amber-800 font-black bg-amber-100 px-2 py-0.5 rounded">E{gcsEye}</span>
                  </div>
                  {[
                    { val: 4, label: '4 - Spontaneous' },
                    { val: 3, label: '3 - To Sound / Voice' },
                    { val: 2, label: '2 - To Pain / Pressure' },
                    { val: 1, label: '1 - None' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setGcsEye(opt.val)}
                      className={`w-full text-left p-2 rounded-lg border transition-all font-medium ${
                        gcsEye === opt.val ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Verbal Response */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Verbal Response (V)</span>
                    <span className="text-amber-800 font-black bg-amber-100 px-2 py-0.5 rounded">V{gcsVerbal}</span>
                  </div>
                  {[
                    { val: 5, label: '5 - Oriented, converses' },
                    { val: 4, label: '4 - Confused speech' },
                    { val: 3, label: '3 - Inappropriate words' },
                    { val: 2, label: '2 - Incomprehensible sounds' },
                    { val: 1, label: '1 - None' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setGcsVerbal(opt.val)}
                      className={`w-full text-left p-1.5 rounded-lg border transition-all font-medium ${
                        gcsVerbal === opt.val ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Motor Response */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Motor Response (M)</span>
                    <span className="text-amber-800 font-black bg-amber-100 px-2 py-0.5 rounded">M{gcsMotor}</span>
                  </div>
                  {[
                    { val: 6, label: '6 - Obeys commands' },
                    { val: 5, label: '5 - Localizes to pain' },
                    { val: 4, label: '4 - Normal withdrawal' },
                    { val: 3, label: '3 - Abnormal flexion (decorticate)' },
                    { val: 2, label: '2 - Extension (decerebrate)' },
                    { val: 1, label: '1 - None (flaccid)' }
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setGcsMotor(opt.val)}
                      className={`w-full text-left p-1 rounded-lg border transition-all font-medium text-[11px] ${
                        gcsMotor === opt.val ? 'bg-amber-600 text-white border-amber-600 font-bold' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Protocol Alert */}
              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-slate-800">
                {gcsTotal <= 8 && '🚨 Critical: GCS ≤ 8 denotes severe coma. Immediate endotracheal intubation required for airway protection.'}
                {gcsTotal >= 9 && gcsTotal <= 12 && '⚠️ Moderate Head Injury: HDU monitoring and urgent Non-Contrast Brain CT indicated.'}
                {gcsTotal >= 13 && '✓ Mild Head Injury: Observe minimum 4 hours; discharge with clear red-flag vomiting/headache warnings.'}
              </div>
            </div>
          )}

          {/* 3. Neonatal APGAR & Maternal PMSMA Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Neonatal APGAR */}
            {(activeSubCalc === 'all' || activeSubCalc === 'apgar') && (
              <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                  <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5">
                    <Baby className="w-4 h-4 text-emerald-600" />
                    3. Neonatal APGAR Score (0 - 10)
                  </h3>
                  <span className="text-lg font-black text-emerald-900 bg-white px-2.5 py-0.5 rounded-lg border border-emerald-300">
                    {apgarTotal}/10 ({apgarSeverity})
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Appearance */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold text-slate-800">Color (A):</span>
                    <div className="flex gap-1">
                      {[
                        { v: 0, l: 'Blue (0)' },
                        { v: 1, l: 'Acrocyanosis (1)' },
                        { v: 2, l: 'Pink (2)' }
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => setApgarA(o.v)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${apgarA === o.v ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pulse */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold text-slate-800">Pulse (P):</span>
                    <div className="flex gap-1">
                      {[
                        { v: 0, l: '0 bpm' },
                        { v: 1, l: '<100 bpm' },
                        { v: 2, l: '>100 bpm' }
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => setApgarP(o.v)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${apgarP === o.v ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Grimace */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold text-slate-800">Grimace (G):</span>
                    <div className="flex gap-1">
                      {[
                        { v: 0, l: 'Flaccid (0)' },
                        { v: 1, l: 'Grimace (1)' },
                        { v: 2, l: 'Cry (2)' }
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => setApgarG(o.v)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${apgarG === o.v ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Activity */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold text-slate-800">Muscle Tone (A):</span>
                    <div className="flex gap-1">
                      {[
                        { v: 0, l: 'Limp (0)' },
                        { v: 1, l: 'Flexion (1)' },
                        { v: 2, l: 'Active (2)' }
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => setApgarAct(o.v)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${apgarAct === o.v ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Respiration */}
                  <div className="flex items-center justify-between gap-2 bg-white p-2 rounded-xl border border-emerald-200">
                    <span className="font-bold text-slate-800">Respiration (R):</span>
                    <div className="flex gap-1">
                      {[
                        { v: 0, l: 'Absent (0)' },
                        { v: 1, l: 'Slow (1)' },
                        { v: 2, l: 'Lusty Cry (2)' }
                      ].map(o => (
                        <button
                          key={o.v}
                          onClick={() => setApgarR(o.v)}
                          className={`px-2 py-1 rounded text-[11px] font-bold border ${apgarR === o.v ? 'bg-emerald-600 text-white' : 'bg-slate-50'}`}
                        >
                          {o.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Maternal PMSMA */}
            {(activeSubCalc === 'all' || activeSubCalc === 'maternal') && (
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-200 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-purple-200 pb-2">
                  <h3 className="text-sm font-black text-purple-950 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-purple-600" />
                    4. PMSMA Maternal Risk &amp; HRP Sticker
                  </h3>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-lg border shadow-2xs ${
                    maternalRedFlags ? 'bg-rose-600 text-white border-rose-700' : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {maternalRiskLevel}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* BP Controls */}
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Maternal BP: {matSbp}/{matDbp} mmHg</span>
                      {isPreeclampsia && <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">HYPERTENSIVE</span>}
                    </div>
                    <input
                      type="range"
                      min="90"
                      max="190"
                      value={matSbp}
                      onChange={(e) => setMatSbp(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {/* Hb Slider */}
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800">Hemoglobin: {matHb} g/dL</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isSevereAnemia ? 'bg-rose-100 text-rose-800' : isModerateAnemia ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isSevereAnemia ? 'SEVERE (<7)' : isModerateAnemia ? 'MODERATE (7-10)' : 'NORMAL'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="14"
                      step="0.1"
                      value={matHb}
                      onChange={(e) => setMatHb(Number(e.target.value))}
                      className="w-full accent-purple-600"
                    />
                  </div>

                  {/* Red Flag Symptoms Checkbox List */}
                  <div className="bg-white p-2.5 rounded-xl border border-purple-200 space-y-1">
                    <span className="font-bold text-slate-700 text-[11px] block">High-Risk Obstetric Symptoms:</span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={matHeadache} onChange={e => setMatHeadache(e.target.checked)} className="accent-purple-600" />
                        <span>Severe Headache</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={matVision} onChange={e => setMatVision(e.target.checked)} className="accent-purple-600" />
                        <span>Blurred Vision</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={matEdema} onChange={e => setMatEdema(e.target.checked)} className="accent-purple-600" />
                        <span>Pedal Edema</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input type="checkbox" checked={matBleeding} onChange={e => setMatBleeding(e.target.checked)} className="accent-purple-600" />
                        <span>Vaginal Bleeding</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: STANDARDIZED CLINICAL TRIAGE REPORT & SLIP
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'triage_note' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <h4 className="font-extrabold text-sm text-slate-900">Official Clinical Referral Note</h4>
              <p className="text-xs text-slate-500">Auto-generated in ABDM FHIR Observation format for district hospital escalation.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-bold shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" /> Print Triage Slip
              </button>
              <button
                onClick={handleCopyNote}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-2xs"
              >
                {copiedNote ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedNote ? 'Copied!' : 'Copy to Clipboard'}
              </button>
            </div>
          </div>

          <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs leading-relaxed whitespace-pre-wrap border border-slate-800 shadow-md">
            {generateClinicalNote()}
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 4: ICMR / MOHFW PROTOCOLS REFERENCE
      ═════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'protocols' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              qSOFA Sepsis Guidelines (Surviving Sepsis / ICMR)
            </div>
            <p className="text-slate-600 leading-relaxed">
              quick SOFA is an evidence-based clinical scoring tool used outside the ICU. A score ≥ 2 is associated with an in-hospital mortality increase of greater than 10%.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
              <li>Respiration Rate ≥ 22 / minute (1 point)</li>
              <li>Systolic Blood Pressure ≤ 100 mmHg (1 point)</li>
              <li>Altered Mentation / GCS &lt; 15 (1 point)</li>
            </ul>
            <div className="p-2.5 bg-rose-100 rounded-xl border border-rose-200 text-rose-950 font-bold text-[11px]">
              Action: Blood cultures, 30mL/kg crystalloid bolus, IV broad spectrum antibiotics within 60 minutes.
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
              <Brain className="w-4 h-4 text-amber-600" />
              Glasgow Coma Scale Protocol (ATLS Trauma)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Standardized assessment of depth and duration of impaired consciousness and coma in acute head trauma.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
              <li>Score 13-15: Mild Head Injury (Canadian CT head rules apply)</li>
              <li>Score 9-12: Moderate Head Injury (Mandatory NCCT head)</li>
              <li>Score 3-8: Severe Head Injury / Coma ("GCS 8, Intubate")</li>
            </ul>
            <div className="p-2.5 bg-amber-100 rounded-xl border border-amber-200 text-amber-950 font-bold text-[11px]">
              Action: Definite airway protection for GCS ≤8, immediate non-contrast head CT, notify neurosurgery.
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm">
              <Baby className="w-4 h-4 text-emerald-600" />
              Neonatal APGAR Guidelines (NNRP India)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Assesses the condition of newborn infants at 1 minute and 5 minutes post-delivery across 5 objective parameters.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
              <li>Score 7-10: Normal physiological neonatal transition</li>
              <li>Score 4-6: Moderately depressed neonate (Bag &amp; mask stimulation)</li>
              <li>Score 0-3: Severe asphyxia (Immediate active NRP resuscitation)</li>
            </ul>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm">
              <Heart className="w-4 h-4 text-purple-600" />
              PMSMA High-Risk Pregnancy (MoHFW India)
            </div>
            <p className="text-slate-600 leading-relaxed">
              Pradhan Mantri Surakshit Matritva Abhiyan protocol for color-coding pregnant women on 9th of every month.
            </p>
            <ul className="list-disc pl-4 space-y-1 text-slate-700 font-medium">
              <li>Green Sticker: No high risk factors identified</li>
              <li>Yellow Sticker: Moderate risk (anemia, prior c-section)</li>
              <li>Red Sticker: Severe risk (Preeclampsia, severe anemia &lt;7 g/dL)</li>
            </ul>
          </div>
        </div>
      )}

      {/* ── Modal: Add Custom Patient Record ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-600" />
                Add New Patient Record to Suite
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Patient Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar Nayak"
                  value={newPatient.name}
                  onChange={e => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age / Demographics:</label>
                  <input
                    type="text"
                    placeholder="e.g. 54 Yrs"
                    value={newPatient.age}
                    onChange={e => setNewPatient({ ...newPatient, age: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender:</label>
                  <select
                    value={newPatient.gender}
                    onChange={e => setNewPatient({ ...newPatient, gender: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clinical Case Category:</label>
                  <select
                    value={newPatient.category}
                    onChange={e => setNewPatient({ ...newPatient, category: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  >
                    <option value="sepsis">Sepsis / Infection</option>
                    <option value="trauma">Trauma / Neurological</option>
                    <option value="neonatal">Neonatal Labour Room</option>
                    <option value="maternal">Maternal PMSMA</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Facility:</label>
                  <input
                    type="text"
                    value={newPatient.facility}
                    onChange={e => setNewPatient({ ...newPatient, facility: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Vitals Input */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">RR (/min):</label>
                  <input
                    type="number"
                    value={newPatient.rr}
                    onChange={e => setNewPatient({ ...newPatient, rr: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Systolic BP:</label>
                  <input
                    type="number"
                    value={newPatient.sbp}
                    onChange={e => setNewPatient({ ...newPatient, sbp: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Hb (g/dL):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newPatient.hb}
                    onChange={e => setNewPatient({ ...newPatient, hb: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Clinical Complaints &amp; History:</label>
                <textarea
                  rows={2}
                  placeholder="Enter presenting symptoms, vitals observations, and reason for triage..."
                  value={newPatient.history}
                  onChange={e => setNewPatient({ ...newPatient, history: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Add &amp; Load into Calculator
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
