import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Pill,
  Sparkles,
  Search,
  Plus,
  Trash2,
  FileText,
  Printer,
  Share2,
  RefreshCw,
  Info,
  Activity,
  HeartPulse,
  User,
  Building2,
  Clock,
  ArrowRight,
  ChevronDown,
  Camera,
  UploadCloud,
  Check,
  X,
  Stethoscope,
  Send,
  Zap,
  Lock,
  Layers,
  Droplet,
  TrendingUp,
  Wind,
  SlidersHorizontal,
  ChevronRight,
  UserPlus,
  BookOpen
} from 'lucide-react';
import {
  INDIAN_DRUG_DATABASE,
  ALLERGY_CLASSES,
  DRUG_INTERACTION_RULES,
  COMORBIDITY_CONTRAINDICATIONS,
  PRELOADED_ABHA_PATIENTS,
  PRESET_CLINICAL_CASES,
  DRUG_CATEGORIES
} from '../data/drugSafetyData';

export default function DrugAllergySafetyGuard({ appLang = 'or-IN', currentUser }) {
  const lang = appLang || 'or-IN';

  // Active Workspace Tab: 'safety' (Primary), 'formulary' (Catalog), 'patient' (Dossier)
  const [activeTab, setActiveTab] = useState('safety');

  // 1. Dynamic Patient State (Preloaded + Custom New Patients)
  const [patients, setPatients] = useState(() => {
    try {
      const saved = localStorage.getItem('swasthya_patients_cache');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return PRELOADED_ABHA_PATIENTS;
  });

  const [selectedAbhaId, setSelectedAbhaId] = useState(() => {
    return PRELOADED_ABHA_PATIENTS[0].abhaId;
  });

  const activePatient = useMemo(() => {
    return patients.find((p) => p.abhaId === selectedAbhaId) || patients[0] || PRELOADED_ABHA_PATIENTS[0];
  }, [patients, selectedAbhaId]);

  // New Patient Modal & Form State
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAbha, setNewPatientAbha] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('36');
  const [newPatientGender, setNewPatientGender] = useState('Male');
  const [newPatientBlood, setNewPatientBlood] = useState('B+');
  const [newPatientDistrict, setNewPatientDistrict] = useState('Bhubaneswar, Odisha');
  const [newPatientFacility, setNewPatientFacility] = useState('Capital Hospital OPD');
  const [newPatientPhone, setNewPatientPhone] = useState('+91 94370 55120');
  const [newPatientEgfr, setNewPatientEgfr] = useState('92');
  const [newPatientSelectedAllergies, setNewPatientSelectedAllergies] = useState([]);
  const [newPatientSelectedComorbidities, setNewPatientSelectedComorbidities] = useState([]);
  const [newPatientSelectedMeds, setNewPatientSelectedMeds] = useState([]);

  // Generate random standard ABHA ID format
  const handleGenerateAbhaId = () => {
    const p1 = Math.floor(1000 + Math.random() * 9000);
    const p2 = Math.floor(1000 + Math.random() * 9000);
    const p3 = Math.floor(1000 + Math.random() * 9000);
    setNewPatientAbha(`91-${p1}-${p2}-${p3}`);
  };

  // Auto-fill from currently logged in user
  const handleAutoFillCurrentUser = () => {
    if (!currentUser) return;
    setNewPatientName(currentUser.name || '');
    if (currentUser.age) setNewPatientAge(String(currentUser.age));
    if (currentUser.gender) setNewPatientGender(currentUser.gender);
    if (currentUser.bloodGroup) setNewPatientBlood(currentUser.bloodGroup);
    if (currentUser.facility) setNewPatientFacility(currentUser.facility);
    if (!newPatientAbha) handleGenerateAbhaId();
  };

  // Save new patient and activate immediately
  const handleSaveNewPatient = (e) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    const abhaIdToUse = newPatientAbha.trim() || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const formattedAllergies = newPatientSelectedAllergies.map((key) => {
      const def = ALLERGY_CLASSES[key];
      return {
        classKey: key,
        name: def ? def.name : key,
        severity: 'EHR / Patient Self-Reported',
        dateRecorded: new Date().toLocaleDateString('en-IN')
      };
    });

    const newObj = {
      abhaId: abhaIdToUse,
      name: newPatientName.trim(),
      age: parseInt(newPatientAge, 10) || 30,
      gender: newPatientGender,
      bloodGroup: newPatientBlood,
      district: newPatientDistrict,
      facility: newPatientFacility,
      knownAllergies: formattedAllergies,
      comorbidities: newPatientSelectedComorbidities,
      eGFR: parseInt(newPatientEgfr, 10) || 90,
      activeMedications: newPatientSelectedMeds,
      emergencyContact: `${newPatientPhone} (Family)`
    };

    const updated = [newObj, ...patients.filter((p) => p.abhaId !== abhaIdToUse)];
    setPatients(updated);
    try {
      localStorage.setItem('swasthya_patients_cache', JSON.stringify(updated));
    } catch (err) {}
    setSelectedAbhaId(abhaIdToUse);
    setShowNewPatientModal(false);
    setIsOverridden(false);
    setActiveTab('safety');
    // Reset form fields
    setNewPatientName('');
    setNewPatientAbha('');
    setNewPatientSelectedAllergies([]);
    setNewPatientSelectedComorbidities([]);
    setNewPatientSelectedMeds([]);
  };

  // 2. Prescribed Drugs State (List of drug objects)
  const [prescribedDrugs, setPrescribedDrugs] = useState(() => {
    const defaultIds = ['augmentin', 'paracetamol', 'pantoprazole'];
    return INDIAN_DRUG_DATABASE.filter((d) => defaultIds.includes(d.id));
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');
  const [activePresetCaseId, setActivePresetCaseId] = useState('case_anaphylaxis_penicillin');

  // OCR Prescription Scan Simulation State
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrSuccessMessage, setOcrSuccessMessage] = useState(null);
  const fileInputRef = useRef(null);

  // Doctor Override State
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');
  const [doctorRmpNumber, setDoctorRmpNumber] = useState(currentUser?.staffId || 'RMP-OD-2024-8842');
  const [isOverridden, setIsOverridden] = useState(false);
  const [overrideTimestamp, setOverrideTimestamp] = useState(null);

  // SMS Notification State
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [smsSentStatus, setSmsSentStatus] = useState(false);

  // Print Slip State
  const printSlipRef = useRef(null);

  // UI Multi-lingual Text
  const txt = {
    'or-IN': {
      moduleBadge: 'ମଡ୍ୟୁଲ୍ ୧୩ • ସୁରକ୍ଷା ଗାର୍ଡ',
      moduleTitle: 'ଔଷଧ-ଔଷଧ ଓ ଆଲର୍ଜି କଣ୍ଟ୍ରା-ଇଣ୍ଡିକେସନ୍ ସୁରକ୍ଷା ଗାର୍ଡ',
      moduleSubtitle: 'ABHA ରେକର୍ଡ ସହିତ ପ୍ରିସ୍କ୍ରିପସନ୍ ଯାଞ୍ଚ କରି ଆଲର୍ଜି, DDI ଓ କୋମର୍ବିଡିଟି ବିପଦ ରୋକନ୍ତୁ।',
      legalMandate: 'ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ (Non-Diagnostic) | MoHFW / NMC ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁଯାୟୀ',
      tabSafety: '📋 ପ୍ରିସ୍କ୍ରିପସନ୍ ଓ ସୁରକ୍ଷା ଯାଞ୍ଚ (Rx & Safety)',
      tabFormulary: '📚 ଫାର୍ମାକୋପିଆ ଡାଇରେକ୍ଟୋରୀ (Drug Catalog)',
      tabPatient: '👤 ରୋଗୀ ABHA ଡୋସିୟର୍ (Patient Dossier)',
      quickCasesTitle: 'କ୍ଲିନିକାଲ୍ ପରୀକ୍ଷଣ ନମୁନା (Quick Test Scenarios):',
      rxSectionTitle: 'ପରୀକ୍ଷା ପାଇଁ ଥିବା ପ୍ରିସ୍କ୍ରିପସନ୍',
      addDrugPlaceholder: 'ଔଷଧ ଖୋଜନ୍ତୁ (ଯଥା: Augmentin, Voveran, Metformin, Ciplox)...',
      btnAddCustom: 'ଯୋଡ଼ନ୍ତୁ',
      btnScanRx: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ସ୍କାନ୍ (OCR)',
      scanningOcr: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ଫଟୋ ସ୍କାନ୍ ଚାଲିଛି...',
      currentRxCount: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ଔଷଧ:',
      clearAll: 'ଖାଲି କରନ୍ତୁ',
      noDrugsSelected: 'କୌଣସି ଔଷଧ ଯୋଡ଼ା ହୋଇନାହିଁ। ନିମ୍ନରୁ ଖୋଜନ୍ତୁ କିମ୍ବା ଉପରୋକ୍ତ ୧-କ୍ଲିକ୍ ନମୁନା ବାଛନ୍ତୁ।',
      safetyAnalysisTitle: 'କ୍ଲିନିକାଲ୍ ସୁରକ୍ଷା ବିଶ୍ଳେଷଣ ଫଳାଫଳ',
      criticalBlockVerdict: 'ଅତ୍ୟନ୍ତ ଜରୁରୀ: ମାରାତ୍ମକ ଆଲର୍ଜି / DDI ଚିହ୍ନଟ (DISPENSING BLOCKED)',
      majorCautionVerdict: 'ସତର୍କତା: ଉଚ୍ଚ-ବିପଦ ଔଷଧ ପ୍ରତିକ୍ରିୟା ଚେତାବନୀ (MAJOR CAUTION)',
      safePassVerdict: 'ସୁରକ୍ଷିତ: କୌଣସି ଆଲର୍ଜି ବା ବିପଦଜନକ ଟକରାବ ନାହିଁ (SAFE TO DISPENSE)',
      directAllergyAlerts: 'ପ୍ରତ୍ୟକ୍ଷ ଆଲର୍ଜି ବିପଦ (Direct Allergies)',
      crossAllergyAlerts: 'କ୍ରସ୍-ଆଲର୍ଜି ସତର୍କତା (Cross-Reactivity)',
      ddiAlerts: 'ଔଷଧ-ଔଷଧ ଟକରାବ (Drug-Drug Interactions)',
      comorbidityAlerts: 'ରୋଗ ଓ ଅଙ୍ଗ ସମ୍ବନ୍ଧୀୟ ଚେତାବନୀ (Organ/Comorbidity)',
      safeAlternativesTitle: 'AI ନିରାପଦ ବିକଳ୍ପ ସୁପାରିଶ (Safe Substitutes)',
      applyAlternativeBtn: 'ଏହି ବିକଳ୍ପ ବଦଳାନ୍ତୁ',
      overrideBtn: 'ଡାକ୍ତରୀ ଅନୁମୋଦନ (Doctor Override)',
      printSlipBtn: 'ଅଡିଟ୍ ସ୍ଲିପ୍ ପ୍ରିଣ୍ଟ୍ (Slip)',
      smsBtn: 'ରୋଗୀଙ୍କୁ SMS ସତର୍କତା',
      overriddenBadge: 'ଡାକ୍ତରୀ ଅନୁମୋଦିତ (Overridden)',
      dose: 'ମାତ୍ରା:',
      pregnancyCategory: 'ଗର୍ଭାବସ୍ଥା:',
      renalLimit: 'କିଡନୀ eGFR ସୀମା:',
      sendSmsTitle: 'ରୋଗୀଙ୍କୁ ସୁରକ୍ଷା SMS ପ୍ରେରଣ',
      sendSmsSub: 'ABHA ନମ୍ବରକୁ ଆଲର୍ଜି ସତର୍କତା ଓ ସୁରକ୍ଷିତ ବିକଳ୍ପ ସୂଚନା ପଠାଯିବ।',
      btnSendNow: 'ତୁରନ୍ତ SMS ପଠାନ୍ତୁ',
      smsSentSuccess: 'SMS ସଫଳତାର ସହ ପଠାଗଲା! ଟୋକନ୍: #RX-SAFE-8821'
    },
    'hi-IN': {
      moduleBadge: 'मॉड्यूल 13 • सुरक्षा गार्ड',
      moduleTitle: 'दवा-दवा एवं एलर्जी कॉन्ट्रा-इंडिकेशन सुरक्षा गार्ड',
      moduleSubtitle: 'ABHA रिकॉर्ड के साथ पर्चे की त्वरित जांच कर एनाफिलेक्सिस, DDI और अंग जोखिम रोकें।',
      legalMandate: 'क्लिनिकल निर्णय समर्थन (Non-Diagnostic) | MoHFW / NMC दिशानिर्देशों के अनुरूप',
      tabSafety: '📋 पर्चा एवं सुरक्षा जांच (Rx & Safety)',
      tabFormulary: '📚 दवा डायरेक्टरी (Drug Catalog)',
      tabPatient: '👤 मरीज ABHA रिकॉर्ड (Patient Dossier)',
      quickCasesTitle: '1-क्लिक क्लिनिकल टेस्ट केस (Quick Scenarios):',
      rxSectionTitle: 'जांच हेतु सक्रिय प्रिस्क्रिप्शन',
      addDrugPlaceholder: 'दवा खोजें (उदा: Augmentin, Voveran, Metformin, Ciplox)...',
      btnAddCustom: 'जोड़ें',
      btnScanRx: 'पर्चा स्कैन (OCR)',
      scanningOcr: 'पर्चे का OCR स्कैन जारी है...',
      currentRxCount: 'पर्चे में दवाएं:',
      clearAll: 'साफ़ करें',
      noDrugsSelected: 'कोई दवा नहीं है। दवा खोजें या ऊपर से 1-क्लिक टेस्ट केस चुनें।',
      safetyAnalysisTitle: 'क्लिनिकल सुरक्षा परिणाम',
      criticalBlockVerdict: 'अत्यंत गंभीर: जानलेवा एलर्जी / टकराव अलर्ट (DISPENSING BLOCKED)',
      majorCautionVerdict: 'सावधानी: उच्च-जोखिम ड्रग टकराव (MAJOR CAUTION)',
      safePassVerdict: 'सुरक्षित: कोई एलर्जी या घातक टकराव नहीं मिला (SAFE TO DISPENSE)',
      directAllergyAlerts: 'प्रत्यक्ष एलर्जी अलर्ट (Direct Allergies)',
      crossAllergyAlerts: 'क्रॉस-एलर्जी चेतावनी (Cross-Reactivity)',
      ddiAlerts: 'दवा-दवा टकराव (Drug-Drug Interactions)',
      comorbidityAlerts: 'रोग एवं अंग चेतावनी (Organ/Comorbidity)',
      safeAlternativesTitle: 'AI सुरक्षित विकल्प सुझाव (Safe Substitutes)',
      applyAlternativeBtn: 'विकल्प बदलें',
      overrideBtn: 'डॉक्टर अनुमति (Doctor Override)',
      printSlipBtn: 'ऑडिट स्लिप प्रिंट (Slip)',
      smsBtn: 'मरीज को SMS भेजें',
      overriddenBadge: 'डॉक्टर द्वारा स्वीकृत (Overridden)',
      dose: 'खुराक:',
      pregnancyCategory: 'गर्भावस्था:',
      renalLimit: 'किडनी eGFR सीमा:',
      sendSmsTitle: 'मरीज को सुरक्षा SMS भेजें',
      sendSmsSub: 'ABHA नंबर पर एलर्जी चेतावनी और सुरक्षित विकल्प की सूचना भेजी जाएगी।',
      btnSendNow: 'तुरंत SMS भेजें',
      smsSentSuccess: 'SMS सफलतापूर्वक भेजा गया! टोकन: #RX-SAFE-8821'
    },
    'en-IN': {
      moduleBadge: 'MODULE 13 • SAFETY GUARD',
      moduleTitle: 'Automated Drug-Drug & Allergy Contraindication Guard',
      moduleSubtitle: 'Cross-analyzes prescriptions against ABHA EHR to prevent anaphylaxis, toxic DDIs, and organ contraindications.',
      legalMandate: 'Clinical Decision Support (Non-Diagnostic) | Aligned with MoHFW & NMC Guidelines',
      tabSafety: '📋 Rx & Safety Scanner',
      tabFormulary: '📚 Formulary Catalog',
      tabPatient: '👤 Patient EHR Dossier',
      quickCasesTitle: '1-Click Clinical Test Scenarios:',
      rxSectionTitle: 'Active Prescription Cart',
      addDrugPlaceholder: 'Search 50+ Indian drugs (e.g. Augmentin, Warfarin, Dolo, Ciplox)...',
      btnAddCustom: 'Add to Rx',
      btnScanRx: 'Scan Rx Slip (OCR)',
      scanningOcr: 'Scanning Prescription via OCR...',
      currentRxCount: 'Prescription Drugs:',
      clearAll: 'Clear All',
      noDrugsSelected: 'No medications in cart. Search drugs or select a 1-click test scenario above.',
      safetyAnalysisTitle: 'Clinical Safety Radar',
      criticalBlockVerdict: 'CRITICAL ALERT: LIFE-THREATENING CONTRAINDICATION (DISPENSING BLOCKED)',
      majorCautionVerdict: 'MAJOR WARNING: HIGH-RISK DRUG INTERACTION (CLINICAL CAUTION)',
      safePassVerdict: '100% CLINICALLY SAFE: NO CONTRAINDICATIONS DETECTED',
      directAllergyAlerts: 'Direct Allergy Contraindications',
      crossAllergyAlerts: 'Cross-Reactivity Allergy Warnings',
      ddiAlerts: 'Severe Drug-Drug Interactions (DDI)',
      comorbidityAlerts: 'Organ & Comorbidity Contraindications',
      safeAlternativesTitle: 'AI-Recommended Safe Substitutes',
      applyAlternativeBtn: 'Substitute Drug',
      overrideBtn: 'Doctor Override (RMP)',
      printSlipBtn: 'Print Audit Slip',
      smsBtn: 'Send Citizen SMS Alert',
      overriddenBadge: 'Clinically Overridden by Doctor',
      dose: 'Dosage:',
      pregnancyCategory: 'Pregnancy:',
      renalLimit: 'Renal eGFR Cutoff:',
      sendSmsTitle: 'Send Citizen Safety SMS Alert',
      sendSmsSub: 'Dispatches instant safety token and contraindication advisory to patient mobile and local ASHA worker.',
      btnSendNow: 'Send SMS Now',
      smsSentSuccess: 'SMS alert successfully dispatched! Token: #RX-SAFE-8821'
    }
  }[lang] || {};

  // 3. Clinical Safety Evaluation Engine (Pure function evaluated via useMemo)
  const safetyReport = useMemo(() => {
    const directAllergies = [];
    const crossAllergies = [];
    const ddiHits = [];
    const comorbidityHits = [];
    const alternativeSuggestions = [];

    const patientAllergies = activePatient.knownAllergies || [];
    const patientComorbidities = activePatient.comorbidities || [];
    const ongoingMedIds = activePatient.activeMedications || [];

    const prescribedIds = prescribedDrugs.map((d) => d.id);
    const allDrugIds = Array.from(new Set([...prescribedIds, ...ongoingMedIds]));

    // A. Check Direct Allergies & Cross-Reactivity
    prescribedDrugs.forEach((drug) => {
      patientAllergies.forEach((allergy) => {
        const rule = ALLERGY_CLASSES[allergy.classKey];
        if (!rule) return;

        // Direct Trigger Match
        if (rule.directTriggers.includes(drug.id) || drug.allergyClass === allergy.classKey) {
          directAllergies.push({
            drug,
            allergy,
            rule,
            severity: 'CRITICAL',
            title: lang === 'or-IN' ? `ପ୍ରତ୍ୟକ୍ଷ ଆଲର୍ଜି ବିପଦ: ${drug.name}` : (lang === 'hi-IN' ? `प्रत्यक्ष एलर्जी चेतावनी: ${drug.name}` : `Direct Allergy: ${drug.name}`),
            detail: lang === 'or-IN'
              ? `ରୋଗୀଙ୍କ ରେକର୍ଡରେ ${allergy.name} ଆଲର୍ଜି (${allergy.severity}) ଅଛି। ଏହାଦ୍ୱାରା ତୀବ୍ର ଆନାଫାଇଲାକ୍ସିସ୍ ହୋଇପାରେ।`
              : (lang === 'hi-IN'
              ? `मरीज के रिकॉर्ड में ${allergy.name} एलर्जी दर्ज है। इससे गंभीर एनाफिलेक्सिस हो सकता है।`
              : `Documented allergy to ${allergy.name}. High risk of acute anaphylactic reaction.`)
          });

          // Propose safe alternatives
          if (rule.safeAlternatives) {
            rule.safeAlternatives.forEach((alt) => {
              const fullAlt = INDIAN_DRUG_DATABASE.find((d) => d.id === alt.id);
              if (fullAlt && !prescribedIds.includes(fullAlt.id)) {
                alternativeSuggestions.push({
                  replaceDrug: drug,
                  suggestedDrug: fullAlt,
                  reason: alt.note,
                  reasonOr: lang === 'or-IN' ? `${drug.name} ବଦଳରେ ସୁରକ୍ଷିତ: ${alt.note}` : (lang === 'hi-IN' ? `${drug.name} के स्थान पर सुरक्षित: ${alt.note}` : `Safe alternative for ${drug.name}: ${alt.note}`)
                });
              }
            });
          }
        }

        // Cross-Reactivity Match
        if (rule.crossReactiveClasses) {
          rule.crossReactiveClasses.forEach((cross) => {
            if (drug.allergyClass === cross.targetAllergyClass && !rule.directTriggers.includes(drug.id)) {
              crossAllergies.push({
                drug,
                allergy,
                cross,
                severity: 'HIGH',
                title: lang === 'or-IN' ? `କ୍ରସ୍-ଆଲର୍ଜି ସତର୍କତା: ${drug.name}` : (lang === 'hi-IN' ? `क्रॉस-एलर्जी चेतावनी: ${drug.name}` : `Cross-Reactivity Risk: ${drug.name}`),
                detail: lang === 'or-IN' ? cross.mechanismOr || cross.mechanism : (lang === 'hi-IN' ? cross.mechanismHi || cross.mechanism : cross.mechanism),
                frequency: cross.frequency
              });
            }
          });
        }
      });
    });

    // B. Check Drug-Drug Interactions (DDI)
    const evaluatedPairs = new Set();
    prescribedDrugs.forEach((drug1) => {
      allDrugIds.forEach((drug2Id) => {
        if (drug1.id === drug2Id) return;
        const pairKey = [drug1.id, drug2Id].sort().join('___');
        if (evaluatedPairs.has(pairKey)) return;
        evaluatedPairs.add(pairKey);

        const drug2 = INDIAN_DRUG_DATABASE.find((d) => d.id === drug2Id);
        if (!drug2) return;

        const match = DRUG_INTERACTION_RULES.find(
          (r) => (r.drugA === drug1.id && r.drugB === drug2Id) || (r.drugA === drug2Id && r.drugB === drug1.id)
        );

        if (match) {
          const isOngoing = ongoingMedIds.includes(drug2Id) && !prescribedIds.includes(drug2Id);
          ddiHits.push({
            drugA: drug1,
            drugB: drug2,
            isWithOngoing: isOngoing,
            rule: match,
            severity: match.severity,
            title: lang === 'or-IN' ? match.titleOr : (lang === 'hi-IN' ? match.titleHi : match.title),
            detail: lang === 'or-IN' ? match.descriptionOr : (lang === 'hi-IN' ? match.descriptionHi : match.description),
            action: match.action
          });
        }
      });
    });

    // C. Check Comorbidity & Physiological Contraindications
    prescribedDrugs.forEach((drug) => {
      patientComorbidities.forEach((comorbidityKey) => {
        const contra = COMORBIDITY_CONTRAINDICATIONS.find((c) => c.condition === comorbidityKey);
        if (contra && contra.dangerousDrugs.includes(drug.id)) {
          comorbidityHits.push({
            drug,
            comorbidity: contra,
            severity: contra.severity,
            title: lang === 'or-IN' ? `${contra.nameOr} ରେ ${drug.name} ନିଷିଦ୍ଧ` : (lang === 'hi-IN' ? `${contra.nameHi} में ${drug.name} वर्जित` : `${contra.name} vs ${drug.name}`),
            detail: lang === 'or-IN' ? contra.warningOr : (lang === 'hi-IN' ? contra.warningHi : contra.warning),
            safeSubs: contra.safeSubs
          });
        }
      });

      // Renal clearance alert
      if (activePatient.eGFR && drug.renalCutoff && activePatient.eGFR < drug.renalCutoff) {
        comorbidityHits.push({
          drug,
          severity: 'HIGH',
          title: lang === 'or-IN' ? `କିଡନୀ ବିପଦ: eGFR ${activePatient.eGFR} ml/min କମ୍ ଅଛି` : (lang === 'hi-IN' ? `किडनी चेतावनी: eGFR ${activePatient.eGFR} ml/min कम है` : `Renal Impairment: eGFR ${activePatient.eGFR} ml/min`),
          detail: lang === 'or-IN'
            ? `${drug.name} ସୁରକ୍ଷିତ ସୀମା eGFR > ${drug.renalCutoff} ml/min। ଡୋଜ୍ ହ୍ରାସ କରନ୍ତୁ କିମ୍ବା ବଦଳାନ୍ତୁ।`
            : (lang === 'hi-IN'
            ? `${drug.name} की सुरक्षित सीमा eGFR > ${drug.renalCutoff} ml/min है। खुराक कम करें या बदलें।`
            : `${drug.name} renal threshold exceeded below eGFR ${drug.renalCutoff} ml/min. Requires dose adjustment.`),
          safeSubs: 'Reduce dose by 50% or substitute with hepatically eliminated agent.'
        });
      }
    });

    // D. Determine Overall Urgency Tier
    let overallTier = 'SAFE_PASS';
    if (directAllergies.length > 0 || ddiHits.some((d) => d.severity === 'CRITICAL') || comorbidityHits.some((c) => c.severity === 'CRITICAL')) {
      overallTier = 'CRITICAL_BLOCK';
    } else if (crossAllergies.length > 0 || ddiHits.some((d) => d.severity === 'MAJOR') || comorbidityHits.some((c) => c.severity === 'HIGH')) {
      overallTier = 'MAJOR_CAUTION';
    }

    return {
      directAllergies,
      crossAllergies,
      ddiHits,
      comorbidityHits,
      alternativeSuggestions,
      overallTier,
      totalAlerts: directAllergies.length + crossAllergies.length + ddiHits.length + comorbidityHits.length
    };
  }, [prescribedDrugs, activePatient, lang]);

  // Load Preset Case
  const handleSelectPresetCase = (caseItem) => {
    setActivePresetCaseId(caseItem.id);
    setSelectedAbhaId(caseItem.patientAbha);
    const drugs = INDIAN_DRUG_DATABASE.filter((d) => caseItem.prescribedDrugIds.includes(d.id));
    setPrescribedDrugs(drugs);
    setIsOverridden(false);
    setOverrideReason('');
    setOcrSuccessMessage(null);
  };

  // Add Drug to Cart
  const handleAddDrug = (drug) => {
    if (!prescribedDrugs.some((d) => d.id === drug.id)) {
      setPrescribedDrugs([...prescribedDrugs, drug]);
      setIsOverridden(false);
    }
  };

  // Remove Drug from Cart
  const handleRemoveDrug = (drugId) => {
    setPrescribedDrugs(prescribedDrugs.filter((d) => d.id !== drugId));
    setIsOverridden(false);
  };

  // Apply Safe Alternative Substitution
  const handleApplyAlternative = (replaceDrug, suggestedDrug) => {
    const updated = prescribedDrugs.map((d) => (d.id === replaceDrug.id ? suggestedDrug : d));
    setPrescribedDrugs(updated);
    setIsOverridden(false);
  };

  // Trigger Simulated Prescription OCR Scanner
  const handleTriggerOcr = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrScanning(true);
    setOcrProgress(15);
    setOcrSuccessMessage(null);

    const timer1 = setTimeout(() => setOcrProgress(55), 400);
    const timer2 = setTimeout(() => setOcrProgress(90), 800);
    const timer3 = setTimeout(() => {
      setOcrProgress(100);
      setIsOcrScanning(false);
      const recognized = INDIAN_DRUG_DATABASE.filter((d) =>
        ['augmentin', 'diclofenac', 'pantoprazole'].includes(d.id)
      );
      setPrescribedDrugs(recognized);
      setOcrSuccessMessage(
        lang === 'or-IN'
          ? `✓ ଫଟୋରୁ ୩ଟି ଔଷଧ ଚିହ୍ନଟ ହୋଇଛି: Augmentin 625, Diclofenac 50mg, Pan 40`
          : (lang === 'hi-IN'
          ? `✓ पर्चे से 3 दवाएं सफलतापूर्वक पहचानी गईं: Augmentin 625, Diclofenac 50mg, Pan 40`
          : `✓ Successfully parsed 3 drugs from prescription scan: Augmentin 625, Diclofenac 50mg, Pan 40`)
      );
    }, 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // Submit Doctor Override
  const handleSubmitOverride = (e) => {
    e.preventDefault();
    if (!overrideReason.trim()) return;
    setIsOverridden(true);
    setOverrideTimestamp(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setShowOverrideModal(false);
  };

  // Handle Print Slip
  const handlePrintSlip = () => {
    window.print();
  };

  // Current active category configuration object
  const currentCategoryObj = useMemo(() => {
    return DRUG_CATEGORIES.find((c) => c.id === selectedFilterCategory) || DRUG_CATEGORIES[0];
  }, [selectedFilterCategory]);

  // Fast helper to compute patient safety status for any drug in the catalog
  const getDrugSafetyStatusForPatient = (drug) => {
    const patientAllergies = activePatient.knownAllergies || [];
    const patientComorbidities = activePatient.comorbidities || [];
    const ongoingMedIds = activePatient.activeMedications || [];

    // 1. Direct allergy
    for (const al of patientAllergies) {
      const rule = ALLERGY_CLASSES[al.classKey];
      if (rule && (rule.directTriggers.includes(drug.id) || drug.allergyClass === al.classKey)) {
        return {
          status: 'CRITICAL',
          badgeText: lang === 'or-IN' ? '🔴 ଆଲର୍ଜି' : (lang === 'hi-IN' ? '🔴 एलर्जी' : '🔴 ALLERGY'),
          badgeClass: 'bg-rose-600 text-white font-black',
          reason: `${al.name} (${al.severity})`
        };
      }
    }

    // 2. Cross-allergy
    for (const al of patientAllergies) {
      const rule = ALLERGY_CLASSES[al.classKey];
      if (rule?.crossReactiveClasses) {
        for (const cross of rule.crossReactiveClasses) {
          if (drug.allergyClass === cross.targetAllergyClass) {
            return {
              status: 'HIGH',
              badgeText: lang === 'or-IN' ? `🟠 କ୍ରସ୍-ଆଲର୍ଜି` : (lang === 'hi-IN' ? `🟠 क्रॉस-एलर्जी` : `🟠 CROSS-ALLERGY`),
              badgeClass: 'bg-orange-500 text-white font-bold',
              reason: cross.mechanism
            };
          }
        }
      }
    }

    // 3. Comorbidity
    for (const cKey of patientComorbidities) {
      const contra = COMORBIDITY_CONTRAINDICATIONS.find((c) => c.condition === cKey);
      if (contra?.dangerousDrugs.includes(drug.id)) {
        return {
          status: 'CRITICAL',
          badgeText: lang === 'or-IN' ? `⚠️ ${cKey}` : (lang === 'hi-IN' ? `⚠️ ${cKey}` : `⚠️ ${cKey}`),
          badgeClass: 'bg-rose-700 text-white font-bold',
          reason: contra.warning
        };
      }
    }

    // 4. DDI with ongoing medications
    for (const ongoingId of ongoingMedIds) {
      const match = DRUG_INTERACTION_RULES.find(
        (r) => (r.drugA === drug.id && r.drugB === ongoingId) || (r.drugA === ongoingId && r.drugB === drug.id)
      );
      if (match) {
        const ongoingDrug = INDIAN_DRUG_DATABASE.find((d) => d.id === ongoingId);
        return {
          status: match.severity,
          badgeText: `⚠️ DDI: ${ongoingDrug?.name.split(' ')[0] || 'Ongoing'}`,
          badgeClass: match.severity === 'CRITICAL' ? 'bg-rose-600 text-white font-black' : 'bg-amber-600 text-white font-bold',
          reason: match.description
        };
      }
    }

    // 5. Renal check
    if (activePatient.eGFR && drug.renalCutoff && activePatient.eGFR < drug.renalCutoff) {
      return {
        status: 'HIGH',
        badgeText: `⚠️ eGFR < ${drug.renalCutoff}`,
        badgeClass: 'bg-amber-600 text-white font-bold',
        reason: `Renal clearance threshold (Patient eGFR: ${activePatient.eGFR})`
      };
    }

    return {
      status: 'SAFE',
      badgeText: lang === 'or-IN' ? '🟢 ସୁରକ୍ଷିତ' : (lang === 'hi-IN' ? '🟢 सुरक्षित' : '🟢 SAFE'),
      badgeClass: 'bg-emerald-100 text-emerald-800 font-bold',
      reason: 'No documented contraindications'
    };
  };

  // Helper to load sample Rx for the selected category
  const handleLoadCategorySampleRx = (catObj) => {
    if (!catObj?.sampleRxDrugIds) return;
    const drugs = INDIAN_DRUG_DATABASE.filter((d) => catObj.sampleRxDrugIds.includes(d.id));
    setPrescribedDrugs(drugs);
    setIsOverridden(false);
    setOverrideReason('');
    setOcrSuccessMessage(null);
    setActiveTab('safety'); // Jump straight to safety radar
  };

  // Helper to count drugs per category
  const getCategoryCount = (catId) => {
    if (catId === 'ALL') return INDIAN_DRUG_DATABASE.length;
    return INDIAN_DRUG_DATABASE.filter((drug) => {
      if (catId === 'Antibiotic') return drug.category === 'Antibiotic';
      if (catId === 'Analgesic') return drug.category === 'Analgesic' || drug.category === 'NSAID' || drug.category === 'Opioid Analgesic';
      if (catId === 'Anticoagulant') return drug.category === 'Anticoagulant' || drug.category === 'Antiplatelet';
      if (catId === 'Anti-Diabetic') return drug.category === 'Anti-Diabetic';
      if (catId === 'Cardiovascular') return drug.category === 'Cardiovascular' || drug.category === 'Anti-Hypertensive' || drug.category === 'Diuretic';
      if (catId === 'Gastrointestinal') return drug.category === 'Gastrointestinal';
      if (catId === 'Corticosteroid') return drug.category === 'Corticosteroid';
      if (catId === 'Respiratory') return drug.category === 'Respiratory';
      return drug.category === catId;
    }).length;
  };

  // Filtered drug database for searching & category browsing
  const filteredDrugs = useMemo(() => {
    return INDIAN_DRUG_DATABASE.filter((drug) => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        drug.name.toLowerCase().includes(query) ||
        drug.generic.toLowerCase().includes(query) ||
        drug.class.toLowerCase().includes(query);

      let matchesCat = true;
      if (selectedFilterCategory !== 'ALL') {
        if (selectedFilterCategory === 'Antibiotic') {
          matchesCat = drug.category === 'Antibiotic';
        } else if (selectedFilterCategory === 'Analgesic') {
          matchesCat = drug.category === 'Analgesic' || drug.category === 'NSAID' || drug.category === 'Opioid Analgesic';
        } else if (selectedFilterCategory === 'Anticoagulant') {
          matchesCat = drug.category === 'Anticoagulant' || drug.category === 'Antiplatelet';
        } else if (selectedFilterCategory === 'Anti-Diabetic') {
          matchesCat = drug.category === 'Anti-Diabetic';
        } else if (selectedFilterCategory === 'Cardiovascular') {
          matchesCat = drug.category === 'Cardiovascular' || drug.category === 'Anti-Hypertensive' || drug.category === 'Diuretic';
        } else if (selectedFilterCategory === 'Gastrointestinal') {
          matchesCat = drug.category === 'Gastrointestinal';
        } else if (selectedFilterCategory === 'Corticosteroid') {
          matchesCat = drug.category === 'Corticosteroid';
        } else if (selectedFilterCategory === 'Respiratory') {
          matchesCat = drug.category === 'Respiratory';
        } else {
          matchesCat = drug.category === selectedFilterCategory;
        }
      }
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedFilterCategory]);

  // Autocomplete suggestions in search bar (top 6 results)
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return INDIAN_DRUG_DATABASE.filter(
      (d) => d.name.toLowerCase().includes(q) || d.generic.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 font-sans text-slate-800">
      
      {/* 1. Header Banner & Safety Mandate (Clean & Modern) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-5 rounded-3xl shadow-lg border border-indigo-900/60 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-rose-400/40 tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                {txt.moduleBadge}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                ABDM FHIR R4 Connected
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                50+ Indian Drug Knowledge Base
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              {txt.moduleTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {txt.moduleSubtitle}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0 text-xs flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-amber-300 font-extrabold text-[11px]">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              NON-DIAGNOSTIC DECISION SUPPORT
            </div>
            <p className="text-[10px] text-slate-300 max-w-xs leading-normal mt-0.5">
              {txt.legalMandate}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Patient Profile Ribbon (Compact, Always Visible, Easy Switcher) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black shrink-0">
            {activePatient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-slate-900 text-sm">{activePatient.name}</span>
              <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                ABHA: {activePatient.abhaId}
              </span>
              <span className="text-[11px] text-slate-500">
                {activePatient.age} Yrs • {activePatient.gender} • {activePatient.bloodGroup}
              </span>
            </div>

            {/* Quick Medical Tags */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap text-[10px]">
              {/* Allergies tag */}
              {activePatient.knownAllergies?.length > 0 ? (
                <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <AlertOctagon className="w-2.5 h-2.5 text-rose-600" />
                  Allergies: {activePatient.knownAllergies.map((a) => a.name.split(' ')[0]).join(', ')}
                </span>
              ) : (
                <span className="bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full">
                  No Known Allergies
                </span>
              )}

              {/* Comorbidities tag */}
              {activePatient.comorbidities?.length > 0 && (
                <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                  ⚠️ {activePatient.comorbidities.join(', ')}
                </span>
              )}

              {/* Renal eGFR tag */}
              <span
                className={`font-bold px-2 py-0.5 rounded-full ${
                  activePatient.eGFR < 60 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                }`}
              >
                eGFR: {activePatient.eGFR} ml/min
              </span>

              {/* Active Meds tag */}
              {activePatient.activeMedications?.length > 0 && (
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  💊 {activePatient.activeMedications.length} Ongoing Meds
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Patient Switcher & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <select
            value={selectedAbhaId}
            onChange={(e) => {
              setSelectedAbhaId(e.target.value);
              setIsOverridden(false);
            }}
            className="bg-slate-50 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 cursor-pointer max-w-[200px] truncate"
            title="Switch Patient"
          >
            {patients.map((p) => (
              <option key={p.abhaId} value={p.abhaId}>
                {p.name} ({p.abhaId.slice(-4)})
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setShowNewPatientModal(true);
              if (!newPatientAbha) handleGenerateAbhaId();
            }}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            title="Register New Walk-in Patient / ABHA Profile"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'or-IN' ? '➕ ନୂଆ ରୋଗୀ' : (lang === 'hi-IN' ? '➕ नया मरीज' : '+ New Patient')}</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Navigation Tabs (Clean 3-Tab Architecture) */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('safety')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'safety'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {txt.tabSafety}
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'safety' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              {prescribedDrugs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('formulary')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'formulary'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            {txt.tabFormulary}
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                activeTab === 'formulary' ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}
            >
              50+
            </span>
          </button>

          <button
            onClick={() => setActiveTab('patient')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'patient'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {txt.tabPatient}
          </button>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintSlip}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-100 border border-slate-300 font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Print Clinical Audit Slip"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">{txt.printSlipBtn}</span>
          </button>

          <button
            onClick={() => setShowSmsModal(true)}
            className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Dispatch SMS to Patient"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">{txt.smsBtn}</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRESCRIPTION & SAFETY RADAR (PRIMARY USER-FRIENDLY WORKSPACE)      */}
      {/* ========================================================================= */}
      {activeTab === 'safety' && (
        <div className="space-y-4">
          
          {/* Quick 1-Click Clinical Test Scenarios Bar */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <span className="text-[11px] font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              {txt.quickCasesTitle}
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {PRESET_CLINICAL_CASES.map((c) => {
                const isSelected = activePresetCaseId === c.id;
                const titleText = lang === 'or-IN' ? c.caseTitleOr : (lang === 'hi-IN' ? c.caseTitleHi : c.caseTitle);
                return (
                  <button
                    key={c.id}
                    onClick={() => handleSelectPresetCase(c)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {titleText.split('—')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2-Column Responsive Layout: Left = Cart & Search, Right = Safety Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN: PRESCRIPTION BUILDER (5 COLS) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3.5">
                
                {/* Search Bar with Autocomplete Dropdown */}
                <div className="relative">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={txt.addDrugPlaceholder}
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-2xs font-medium"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden divide-y divide-slate-100 animate-fadeIn">
                      {searchSuggestions.map((drug) => {
                        const inRx = prescribedDrugs.some((d) => d.id === drug.id);
                        const safety = getDrugSafetyStatusForPatient(drug);
                        return (
                          <div
                            key={drug.id}
                            className="p-2.5 hover:bg-slate-50 flex items-center justify-between gap-2 text-xs transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-extrabold text-slate-900">{drug.name}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-md ${safety.badgeClass}`}>
                                  {safety.badgeText}
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                {drug.generic} • {drug.defaultDose}
                              </p>
                            </div>

                            {inRx ? (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                                In Rx
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  handleAddDrug(drug);
                                  setSearchQuery('');
                                }}
                                className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Camera / OCR Rx Scan & Fast Actions */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleTriggerOcr}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isOcrScanning}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{txt.btnScanRx}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('formulary')}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                    >
                      <span>Formulary Catalog</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    {prescribedDrugs.length > 0 && (
                      <button
                        onClick={() => setPrescribedDrugs([])}
                        className="text-xs font-semibold text-slate-400 hover:text-rose-600 ml-1"
                        title={txt.clearAll}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* OCR Scanning Progress Bar */}
                {isOcrScanning && (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex justify-between items-center text-indigo-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                        {txt.scanningOcr}
                      </span>
                      <span>{ocrProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-indigo-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                        style={{ width: `${ocrProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {ocrSuccessMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 font-bold flex items-center justify-between">
                    <span>{ocrSuccessMessage}</span>
                    <button onClick={() => setOcrSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Prescribed Drug List (The Cart) */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                      {txt.currentRxCount} ({prescribedDrugs.length})
                    </span>
                  </div>

                  {prescribedDrugs.length > 0 ? (
                    <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                      {prescribedDrugs.map((drug) => {
                        const isFlagged =
                          safetyReport.directAllergies.some((a) => a.drug.id === drug.id) ||
                          safetyReport.crossAllergies.some((c) => c.drug.id === drug.id) ||
                          safetyReport.ddiHits.some((d) => d.drugA.id === drug.id || d.drugB.id === drug.id) ||
                          safetyReport.comorbidityHits.some((c) => c.drug.id === drug.id);

                        return (
                          <div
                            key={drug.id}
                            className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 shadow-2xs ${
                              isFlagged
                                ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/30'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-xs">{drug.name}</span>
                                {isFlagged ? (
                                  <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase">
                                    Flagged
                                  </span>
                                ) : (
                                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-md">
                                    Safe
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-slate-600">
                                {txt.dose} <strong>{drug.defaultDose}</strong> • <span className="text-slate-500">{drug.class}</span>
                              </p>
                              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span>Preg: <strong>Cat {drug.pregnancyCat}</strong></span>
                                <span>•</span>
                                <span>Renal: {drug.renalCutoff ? `eGFR > ${drug.renalCutoff}` : 'Normal'}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveDrug(drug.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove from Rx"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs">
                      <Pill className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      {txt.noDrugsSelected}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: REAL-TIME SAFETY RADAR & FIXES (7 COLS) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Master Safety Verdict Banner */}
              <div
                className={`p-5 rounded-3xl border-2 shadow-md transition-all ${
                  safetyReport.overallTier === 'CRITICAL_BLOCK'
                    ? 'bg-rose-50 border-rose-500'
                    : safetyReport.overallTier === 'MAJOR_CAUTION'
                    ? 'bg-amber-50 border-amber-500'
                    : 'bg-emerald-50 border-emerald-500'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-2xl text-white shadow-md shrink-0 ${
                        safetyReport.overallTier === 'CRITICAL_BLOCK'
                          ? 'bg-rose-600 animate-pulse'
                          : safetyReport.overallTier === 'MAJOR_CAUTION'
                          ? 'bg-amber-600'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {safetyReport.overallTier === 'CRITICAL_BLOCK' ? (
                        <AlertOctagon className="w-7 h-7" />
                      ) : safetyReport.overallTier === 'MAJOR_CAUTION' ? (
                        <AlertTriangle className="w-7 h-7" />
                      ) : (
                        <CheckCircle2 className="w-7 h-7" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full text-white ${
                            safetyReport.overallTier === 'CRITICAL_BLOCK'
                              ? 'bg-rose-700'
                              : safetyReport.overallTier === 'MAJOR_CAUTION'
                              ? 'bg-amber-700'
                              : 'bg-emerald-700'
                          }`}
                        >
                          {safetyReport.overallTier === 'CRITICAL_BLOCK'
                            ? '🔴 CRITICAL BLOCK'
                            : safetyReport.overallTier === 'MAJOR_CAUTION'
                            ? '🟠 MAJOR CLINICAL CAUTION'
                            : '🟢 CLINICAL PASS (100% SAFE)'}
                        </span>
                        {isOverridden && (
                          <span className="bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Stethoscope className="w-3 h-3 text-amber-300" />
                            {txt.overriddenBadge} ({overrideTimestamp})
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-black tracking-tight ${
                          safetyReport.overallTier === 'CRITICAL_BLOCK'
                            ? 'text-rose-950'
                            : safetyReport.overallTier === 'MAJOR_CAUTION'
                            ? 'text-amber-950'
                            : 'text-emerald-950'
                        }`}
                      >
                        {safetyReport.overallTier === 'CRITICAL_BLOCK'
                          ? txt.criticalBlockVerdict
                          : safetyReport.overallTier === 'MAJOR_CAUTION'
                          ? txt.majorCautionVerdict
                          : txt.safePassVerdict}
                      </h3>

                      <p
                        className={`text-xs mt-0.5 font-medium leading-relaxed ${
                          safetyReport.overallTier === 'CRITICAL_BLOCK'
                            ? 'text-rose-800'
                            : safetyReport.overallTier === 'MAJOR_CAUTION'
                            ? 'text-amber-950'
                            : 'text-emerald-800'
                        }`}
                      >
                        {safetyReport.overallTier === 'CRITICAL_BLOCK'
                          ? 'Dispensing restricted. Life-threatening allergy or toxic drug collision detected. Review below or use 1-click substitute.'
                          : safetyReport.overallTier === 'MAJOR_CAUTION'
                          ? 'High-risk interaction or organ clearance cutoff warning detected. Clinician verification advised.'
                          : 'Prescription passed all cross-checks against patient ABHA allergies, DDI matrix, and organ thresholds.'}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Override Button */}
                  {safetyReport.overallTier !== 'SAFE_PASS' && !isOverridden && (
                    <button
                      onClick={() => setShowOverrideModal(true)}
                      className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 shrink-0 self-start cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-amber-300" />
                      {txt.overrideBtn}
                    </button>
                  )}
                </div>
              </div>

              {/* 1-Click AI Safe Alternative Substitution Panel (Prominent Fix) */}
              {safetyReport.alternativeSuggestions.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-3xl border border-emerald-200 shadow-xs space-y-2.5">
                  <div className="flex items-center gap-2 text-emerald-950 font-black text-xs border-b border-emerald-200/80 pb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {txt.safeAlternativesTitle} ({safetyReport.alternativeSuggestions.length})
                  </div>

                  <div className="space-y-2">
                    {safetyReport.alternativeSuggestions.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-rose-600 line-through font-bold">{item.replaceDrug.name}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 font-extrabold text-sm">{item.suggestedDrug.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.reasonOr}</p>
                        </div>

                        <button
                          onClick={() => handleApplyAlternative(item.replaceDrug, item.suggestedDrug)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-2xs transition-all flex items-center gap-1.5 text-xs shrink-0 self-end sm:self-auto cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {txt.applyAlternativeBtn}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Itemized Alert Panels (Only shown when issues exist) */}
              <div className="space-y-3">
                {/* 1. Direct Allergies */}
                {safetyReport.directAllergies.length > 0 && (
                  <div className="bg-white p-4 rounded-3xl border border-rose-200 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-rose-900 font-black text-xs border-b border-rose-100 pb-1.5">
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                      {txt.directAllergyAlerts} ({safetyReport.directAllergies.length})
                    </div>
                    {safetyReport.directAllergies.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-rose-50 border border-rose-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-rose-950 text-xs flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                            {item.title}
                          </span>
                          <span className="bg-rose-700 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            Direct Anaphylaxis
                          </span>
                        </div>
                        <p className="text-xs text-rose-900 font-medium leading-relaxed">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Cross-Reactivity */}
                {safetyReport.crossAllergies.length > 0 && (
                  <div className="bg-white p-4 rounded-3xl border border-orange-200 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-orange-950 font-black text-xs border-b border-orange-100 pb-1.5">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      {txt.crossAllergyAlerts} ({safetyReport.crossAllergies.length})
                    </div>
                    {safetyReport.crossAllergies.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-orange-50 border border-orange-300 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-orange-950 text-xs">{item.title}</span>
                          <span className="bg-orange-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                            {item.frequency}
                          </span>
                        </div>
                        <p className="text-xs text-orange-900 leading-relaxed font-medium">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Drug-Drug Interactions (DDI) */}
                {safetyReport.ddiHits.length > 0 && (
                  <div className="bg-white p-4 rounded-3xl border border-amber-200 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-amber-950 font-black text-xs border-b border-amber-100 pb-1.5">
                      <Zap className="w-4 h-4 text-amber-600" />
                      {txt.ddiAlerts} ({safetyReport.ddiHits.length})
                    </div>
                    {safetyReport.ddiHits.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border space-y-1.5 ${
                          item.severity === 'CRITICAL'
                            ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                            : 'bg-amber-50/80 border-amber-300 text-amber-950'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-black text-xs">
                            ⚠️ {item.drugA.name} + {item.drugB.name}
                            {item.isWithOngoing && (
                              <span className="ml-1 text-[10px] text-blue-700 font-bold">(Ongoing Med)</span>
                            )}
                          </span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white uppercase ${
                              item.severity === 'CRITICAL' ? 'bg-rose-700' : 'bg-amber-600'
                            }`}
                          >
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-xs font-semibold leading-relaxed">{item.detail}</p>
                        <div className="pt-1 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                          <span className="text-slate-600">Action:</span>
                          <span className="text-indigo-700">{item.action}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4. Comorbidity & Organ Clearance Contraindications */}
                {safetyReport.comorbidityHits.length > 0 && (
                  <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2 text-slate-900 font-black text-xs border-b border-slate-100 pb-1.5">
                      <HeartPulse className="w-4 h-4 text-rose-600" />
                      {txt.comorbidityAlerts} ({safetyReport.comorbidityHits.length})
                    </div>
                    {safetyReport.comorbidityHits.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900">{item.title}</span>
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-slate-700 leading-relaxed font-medium">{item.detail}</p>
                        {item.safeSubs && (
                          <p className="text-[11px] text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                            💡 {item.safeSubs}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PHARMACOPOEIA / FORMULARY CATALOG (CLEAN & CATEGORIZED BROWSER)    */}
      {/* ========================================================================= */}
      {activeTab === 'formulary' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          
          {/* Category Filter Pills */}
          <div className="space-y-2">
            <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
              Filter by Therapeutic Class:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {DRUG_CATEGORIES.map((cat) => {
                const isSelected = selectedFilterCategory === cat.id;
                const count = getCategoryCount(cat.id);
                const label = lang === 'or-IN' ? cat.labelOr : (lang === 'hi-IN' ? cat.labelHi : cat.label);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedFilterCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-md ring-2 ring-indigo-500/40'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                        isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Clinical Protocol Guide Banner with 1-Click Sample Rx Loader */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/60 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                    {currentCategoryObj.id} Category Formulary
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {filteredDrugs.length} Medicines Available
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  {lang === 'or-IN' ? `${currentCategoryObj.labelOr} କ୍ଲିନିକାଲ୍ ଗାଇଡ୍ ଓ ସୁରକ୍ଷା ନିୟମ` : (lang === 'hi-IN' ? `${currentCategoryObj.labelHi} क्लिनिकल गाइड एवं सुरक्षा प्रोटोकॉल` : `${currentCategoryObj.label} Clinical Protocol Guide`)}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {currentCategoryObj.description}
                </p>
              </div>

              {currentCategoryObj.sampleRxDrugIds && (
                <button
                  onClick={() => handleLoadCategorySampleRx(currentCategoryObj)}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0 self-start md:self-auto cursor-pointer"
                  title={currentCategoryObj.sampleDescription}
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  {lang === 'or-IN'
                    ? `⚡ ନମୁନା ${currentCategoryObj.id} ପ୍ରିସ୍କ୍ରିପସନ୍ ଲୋଡ୍ କରନ୍ତୁ`
                    : (lang === 'hi-IN'
                    ? `⚡ नमूना ${currentCategoryObj.id} लोड करें`
                    : `⚡ Load Sample ${currentCategoryObj.id} Rx`)}
                </button>
              )}
            </div>

            {/* Risk Highlights */}
            {currentCategoryObj.riskHighlights && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-indigo-900/60 text-[11px] text-slate-300">
                {currentCategoryObj.riskHighlights.map((rh, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{rh}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Search Input for Formulary */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by drug trade name, active generic salt, or pharmacological class..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 text-slate-900 shadow-2xs font-medium"
            />
          </div>

          {/* Formulary Drug Cards Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Showing {filteredDrugs.length} drugs for <strong>{currentCategoryObj.id}</strong></span>
              <span>Patient: <strong>{activePatient.name}</strong></span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredDrugs.map((drug) => {
                const inRx = prescribedDrugs.some((d) => d.id === drug.id);
                const safety = getDrugSafetyStatusForPatient(drug);

                return (
                  <div
                    key={drug.id}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 shadow-2xs ${
                      inRx
                        ? 'bg-indigo-50/50 border-indigo-300 ring-1 ring-indigo-400/30'
                        : safety.status === 'CRITICAL'
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                        : 'bg-white border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-extrabold text-slate-900 text-xs leading-tight">
                          {drug.name}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${safety.badgeClass}`}>
                          {safety.badgeText}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 font-medium">
                        {drug.class} • <span className="font-bold text-slate-800">{drug.defaultDose}</span>
                      </p>

                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                        <span>Preg: <strong>Cat {drug.pregnancyCat}</strong></span>
                        <span>•</span>
                        <span>Renal: {drug.renalCutoff ? `eGFR > ${drug.renalCutoff}` : 'Normal'}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 truncate max-w-[140px]" title={drug.notes}>
                        {drug.notes}
                      </span>
                      {inRx ? (
                        <button
                          onClick={() => handleRemoveDrug(drug.id)}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Remove from Rx"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          In Rx
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddDrug(drug)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-bold shadow-2xs transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          Add to Rx
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PATIENT CLINICAL DOSSIER (CLEAR, ACCESSIBLE EHR RECORDS)            */}
      {/* ========================================================================= */}
      {activeTab === 'patient' && (
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-600" />
                {activePatient.name} — ABDM Clinical Dossier
              </h3>
              <p className="text-xs text-slate-500">
                Verified Health Records synced via Ayushman Bharat Digital Mission (ABDM)
              </p>
            </div>

            <button
              onClick={() => {
                setShowNewPatientModal(true);
                if (!newPatientAbha) handleGenerateAbhaId();
              }}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Patient</span>
            </button>
          </div>

          {/* Demographics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">ABHA Number</span>
              <span className="font-mono font-bold text-slate-900">{activePatient.abhaId}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Age / Gender / Blood</span>
              <span className="font-bold text-slate-800">{activePatient.age} Yrs • {activePatient.gender} • {activePatient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Facility / District</span>
              <span className="font-bold text-indigo-700">{activePatient.district}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Emergency Phone</span>
              <span className="font-bold text-slate-800">{activePatient.emergencyContact}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">eGFR Renal Function</span>
              <span className={`font-black ${activePatient.eGFR < 60 ? 'text-rose-600' : 'text-emerald-700'}`}>
                {activePatient.eGFR} ml/min {activePatient.eGFR < 60 ? '(Stage 3+ CKD)' : '(Normal)'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">NHA Registry Status</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active &amp; Linked
              </span>
            </div>
          </div>

          {/* Clinical Records 3-Box Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Allergies Card */}
            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2">
              <span className="text-xs font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                Verified Drug Allergies ({activePatient.knownAllergies?.length || 0})
              </span>
              <div className="space-y-2">
                {activePatient.knownAllergies?.length > 0 ? (
                  activePatient.knownAllergies.map((al, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-xl border border-rose-200 shadow-2xs">
                      <p className="font-black text-rose-950 text-xs">{al.name}</p>
                      <p className="text-[11px] text-rose-700 font-medium">{al.severity} • {al.dateRecorded}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">No known documented drug allergies.</p>
                )}
              </div>
            </div>

            {/* Chronic Medications Card */}
            <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-blue-600" />
                Ongoing Chronic Medications ({activePatient.activeMedications?.length || 0})
              </span>
              <div className="space-y-1.5">
                {activePatient.activeMedications?.length > 0 ? (
                  activePatient.activeMedications.map((mId) => {
                    const med = INDIAN_DRUG_DATABASE.find((d) => d.id === mId);
                    return (
                      <div key={mId} className="bg-white p-2.5 rounded-xl border border-blue-200 shadow-2xs flex items-center justify-between">
                        <div>
                          <p className="font-bold text-blue-950 text-xs">{med?.name || mId}</p>
                          <p className="text-[10px] text-slate-500">{med?.class} • {med?.defaultDose}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-xs italic">No ongoing daily medications documented.</p>
                )}
              </div>
            </div>

            {/* Comorbidities Card */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
              <span className="text-xs font-black text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-amber-700" />
                Chronic Conditions / Comorbidities
              </span>
              <div className="space-y-1.5">
                {activePatient.comorbidities?.length > 0 ? (
                  activePatient.comorbidities.map((cKey) => {
                    const cObj = COMORBIDITY_CONTRAINDICATIONS.find((c) => c.condition === cKey);
                    return (
                      <div key={cKey} className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-2xs">
                        <p className="font-extrabold text-amber-950 text-xs">⚠️ {cObj?.name || cKey}</p>
                        <p className="text-[10px] text-slate-600">{cObj?.warning}</p>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-slate-500 text-xs italic">No chronic comorbidities documented.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: NEW PATIENT INTAKE & CUSTOM ABHA PROFILE REGISTRATION            */}
      {/* ========================================================================= */}
      {showNewPatientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-base">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="leading-tight">
                    {lang === 'or-IN' ? 'ନୂତନ ରୋଗୀ ABHA ପଞ୍ଜୀକରଣ ଓ ଆଲର୍ଜି ପ୍ରୋଫାଇଲ୍' : (lang === 'hi-IN' ? 'नया मरीज ABHA पंजीकरण एवं एलर्जी प्रोफाइल' : 'New Patient Intake & ABHA Safety Profile')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Walk-in patient registration for real-time drug allergy & contraindication detection.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowNewPatientModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto-fill buttons */}
            <div className="flex items-center justify-between gap-2 flex-wrap pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Quick Intake Shortcuts:</span>
              <div className="flex items-center gap-2">
                {currentUser && (
                  <button
                    type="button"
                    onClick={handleAutoFillCurrentUser}
                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold border border-indigo-200 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Fill My Account
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setNewPatientName('Sushree Sunita Jena');
                    setNewPatientAge('42');
                    setNewPatientGender('Female');
                    setNewPatientBlood('O+');
                    setNewPatientDistrict('Puri, Odisha');
                    setNewPatientEgfr('22');
                    setNewPatientSelectedAllergies(['PENICILLIN_BETA_LACTAM']);
                    setNewPatientSelectedComorbidities(['ASTHMA', 'CKD']);
                    setNewPatientSelectedMeds(['warfarin', 'metformin']);
                    handleGenerateAbhaId();
                  }}
                  className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-[11px] font-bold border border-amber-200 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-600" />
                  Auto-Fill Sample (Severe CKD + Asthma)
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveNewPatient} className="space-y-4 text-xs">
              {/* Row 1: Name and ABHA ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    placeholder="e.g. Manoj Kumar Sahoo"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">ABHA Number (14 Digits)</label>
                    <button
                      type="button"
                      onClick={handleGenerateAbhaId}
                      className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer"
                    >
                      Generate Random ABHA
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={newPatientAbha}
                    onChange={(e) => setNewPatientAbha(e.target.value)}
                    placeholder="91-XXXX-XXXX-XXXX"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              {/* Row 2: Age, Gender, Blood Group, eGFR */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Age (Years)</label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    <option value="Male">Male (ପୁରୁଷ)</option>
                    <option value="Female">Female (ମହିଳା)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={newPatientBlood}
                    onChange={(e) => setNewPatientBlood(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1" title="Estimated Glomerular Filtration Rate">
                    Renal eGFR (ml/min)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="150"
                    value={newPatientEgfr}
                    onChange={(e) => setNewPatientEgfr(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              {/* Row 3: District & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">District / PHC Facility</label>
                  <input
                    type="text"
                    value={newPatientDistrict}
                    onChange={(e) => setNewPatientDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Emergency Mobile</label>
                  <input
                    type="text"
                    value={newPatientPhone}
                    onChange={(e) => setNewPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* SECTION: Known Allergies Checklist */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
                <span className="font-black text-rose-950 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  Select Documented / Patient-Reported Drug Allergies:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {[
                    { key: 'PENICILLIN_BETA_LACTAM', label: 'Penicillins & Beta-Lactams (Amoxicillin, Ampicillin)' },
                    { key: 'SULFA_DRUGS', label: 'Sulfa Drugs / Sulfonamides (Septran, Bactrim)' },
                    { key: 'NSAIDS_ASPIRIN', label: 'NSAIDs & Aspirin (Brufen, Voveran, Combiflam)' },
                    { key: 'FLUOROQUINOLONE', label: 'Fluoroquinolones (Ciprofloxacin, Levofloxacin)' },
                    { key: 'ACE_INHIBITOR', label: 'ACE Inhibitors (Ramipril - Angioedema)' }
                  ].map((al) => {
                    const isChecked = newPatientSelectedAllergies.includes(al.key);
                    return (
                      <label
                        key={al.key}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-rose-600 text-white font-bold border-rose-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-rose-200 hover:bg-rose-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPatientSelectedAllergies([...newPatientSelectedAllergies, al.key]);
                            } else {
                              setNewPatientSelectedAllergies(newPatientSelectedAllergies.filter((k) => k !== al.key));
                            }
                          }}
                          className="rounded text-rose-600 focus:ring-rose-500"
                        />
                        <span className="text-[11px] leading-tight">{al.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: Existing Comorbidities Checklist */}
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
                <span className="font-black text-amber-950 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                  <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
                  Select Patient Health Conditions / Comorbidities:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { key: 'ASTHMA', label: 'Asthma / Reactive Airway' },
                    { key: 'DIABETES', label: 'Type 2 Diabetes Mellitus' },
                    { key: 'CKD', label: 'Chronic Kidney Disease' },
                    { key: 'PEPTIC_ULCER', label: 'Peptic Ulcer / Acidity' },
                    { key: 'PREGNANCY', label: 'Pregnancy (Maternal ANC)' }
                  ].map((cm) => {
                    const isChecked = newPatientSelectedComorbidities.includes(cm.key);
                    return (
                      <label
                        key={cm.key}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-amber-600 text-white font-bold border-amber-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPatientSelectedComorbidities([...newPatientSelectedComorbidities, cm.key]);
                            } else {
                              setNewPatientSelectedComorbidities(newPatientSelectedComorbidities.filter((k) => k !== cm.key));
                            }
                          }}
                          className="rounded text-amber-600 focus:ring-amber-500"
                        />
                        <span className="text-[11px] leading-tight">{cm.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* SECTION: Ongoing Chronic Daily Medications */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl space-y-2">
                <span className="font-black text-blue-950 uppercase tracking-wider block text-[11px] flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-blue-700" />
                  Select Ongoing Chronic Medications Patient Takes Daily:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { id: 'metformin', label: 'Metformin 500mg (Diabetes)' },
                    { id: 'amlodipine', label: 'Amlodipine 5mg (BP)' },
                    { id: 'telmisartan', label: 'Telmisartan 40mg (BP)' },
                    { id: 'salbutamol', label: 'Salbutamol Inhaler (Asthma)' },
                    { id: 'warfarin', label: 'Warfarin 2mg (Blood Thinner)' },
                    { id: 'autrin_iron', label: 'Autrin / Iron Supplement' }
                  ].map((m) => {
                    const isChecked = newPatientSelectedMeds.includes(m.id);
                    return (
                      <label
                        key={m.id}
                        className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-600 text-white font-bold border-blue-700 shadow-2xs'
                            : 'bg-white text-slate-700 border-blue-200 hover:bg-blue-100/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewPatientSelectedMeds([...newPatientSelectedMeds, m.id]);
                            } else {
                              setNewPatientSelectedMeds(newPatientSelectedMeds.filter((id) => id !== m.id));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[11px] leading-tight">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save &amp; Activate Patient for Drug Check
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DOCTOR RMP OVERRIDE MODAL                                        */}
      {/* ========================================================================= */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-purple-900 font-black text-base">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Registered Medical Practitioner Override
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              In accordance with National Medical Commission (NMC) regulations, an RMP may clinically override contraindications under specialized monitoring or desensitization protocols. This will be logged with your timestamp and credentials in the ABDM audit trail.
            </p>

            <form onSubmit={handleSubmitOverride} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Doctor RMP / Registration Number:
                </label>
                <input
                  type="text"
                  required
                  value={doctorRmpNumber}
                  onChange={(e) => setDoctorRmpNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mandatory Clinical Justification / Rationale:
                </label>
                <textarea
                  required
                  rows={3}
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  placeholder="e.g., ICU monitoring active, patient desensitized, clinical benefit strongly outweighs bleeding risk..."
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-md cursor-pointer"
                >
                  Confirm &amp; Digitally Sign Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CITIZEN SMS NOTIFICATION MODAL                                   */}
      {/* ========================================================================= */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Share2 className="w-5 h-5 text-indigo-600" />
                {txt.sendSmsTitle}
              </div>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {txt.sendSmsSub}
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono space-y-1.5 text-slate-800">
              <p className="font-bold text-slate-900">SMS PREVIEW ({lang}):</p>
              <p className="text-[11px] text-slate-600">
                SwasthyaMitra Alert: Dear {activePatient.name}, Rx safety check completed for ABHA {activePatient.abhaId}.
                Status: {safetyReport.overallTier}. {safetyReport.totalAlerts} contraindications checked by Dr. {currentUser?.name || 'RMP'}.
              </p>
            </div>

            {smsSentStatus ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 text-center">
                {txt.smsSentSuccess}
              </div>
            ) : (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowSmsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSmsSentStatus(true);
                    setTimeout(() => setShowSmsModal(false), 1800);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {txt.btnSendNow}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE CLINICAL AUDIT SLIP (Only shown when printing)                  */}
      {/* ========================================================================= */}
      <div ref={printSlipRef} className="hidden print:block p-6 text-slate-900 text-xs space-y-4">
        <div className="border-b-2 border-slate-900 pb-3 text-center">
          <h1 className="text-lg font-black uppercase">Government of Odisha • Department of Health &amp; Family Welfare</h1>
          <h2 className="text-sm font-bold">Ayushman Bharat Digital Mission (ABDM) • Clinical Safety Clearance Slip</h2>
          <p className="text-[10px] text-slate-500">Module 13: Automated Drug-Drug &amp; Allergy Contraindication Audit</p>
        </div>

        <div className="grid grid-cols-2 gap-2 border p-3 rounded-lg text-[11px]">
          <div><strong>Patient Name:</strong> {activePatient.name}</div>
          <div><strong>ABHA ID:</strong> {activePatient.abhaId}</div>
          <div><strong>Age / Gender:</strong> {activePatient.age} Yrs / {activePatient.gender}</div>
          <div><strong>Nodal Facility:</strong> {activePatient.facility}</div>
          <div><strong>Safety Verdict:</strong> {safetyReport.overallTier}</div>
          <div><strong>Audit Date:</strong> {new Date().toLocaleDateString('en-IN')}</div>
        </div>

        <div>
          <h4 className="font-bold border-b pb-1 mb-2">Prescribed Medications Evaluated:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {prescribedDrugs.map((d) => (
              <li key={d.id}><strong>{d.name}</strong> - {d.defaultDose} ({d.class})</li>
            ))}
          </ul>
        </div>

        {safetyReport.totalAlerts > 0 && (
          <div>
            <h4 className="font-bold text-rose-700 border-b pb-1 mb-2">Clinical Contraindications &amp; Safety Flags:</h4>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              {safetyReport.directAllergies.map((a, i) => (
                <li key={i} className="text-rose-700 font-bold">{a.title}: {a.detail}</li>
              ))}
              {safetyReport.ddiHits.map((d, i) => (
                <li key={i}>{d.title}: {d.detail}</li>
              ))}
              {safetyReport.comorbidityHits.map((c, i) => (
                <li key={i}>{c.title}: {c.detail}</li>
              ))}
            </ul>
          </div>
        )}

        {isOverridden && (
          <div className="border border-purple-300 p-2.5 rounded bg-purple-50 text-[11px]">
            <strong>Doctor Clinical Override:</strong> {overrideReason} (Signed by RMP: {doctorRmpNumber} at {overrideTimestamp})
          </div>
        )}

        <div className="pt-8 flex justify-between items-end border-t border-slate-300 text-[10px]">
          <div>
            <p>NON-DIAGNOSTIC CLINICAL DECISION SUPPORT</p>
            <p>Generated by SwasthyaMitra AI Engine • Odisha Health Portal</p>
          </div>
          <div className="text-right">
            <p className="border-t border-slate-400 pt-1 w-44 text-center font-bold">RMP / Attending Physician Signature</p>
          </div>
        </div>
      </div>

    </div>
  );
}
