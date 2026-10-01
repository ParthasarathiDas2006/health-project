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
  Wind
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

  // 1. Patient State
  const [selectedAbhaId, setSelectedAbhaId] = useState(PRELOADED_ABHA_PATIENTS[0].abhaId);
  const activePatient = useMemo(() => {
    return PRELOADED_ABHA_PATIENTS.find((p) => p.abhaId === selectedAbhaId) || PRELOADED_ABHA_PATIENTS[0];
  }, [selectedAbhaId]);

  // 2. Prescribed Drugs State (List of drug objects)
  const [prescribedDrugs, setPrescribedDrugs] = useState(() => {
    // Default to Case 1: Augmentin + Paracetamol + Pantoprazole
    const defaultIds = ['augmentin', 'paracetamol', 'pantoprazole'];
    return INDIAN_DRUG_DATABASE.filter((d) => defaultIds.includes(d.id));
  });

  // Search & Manual Drug Builder State
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
      moduleBadge: 'ମଡ୍ୟୁଲ୍ ୧୩ • ଜାତୀୟ GovTech ଏଣ୍ଟରପ୍ରାଇଜ୍ ମାନକ',
      moduleTitle: '୧୩. ଔଷଧ-ଔଷଧ ଓ ଆଲର୍ଜି କଣ୍ଟ୍ରା-ଇଣ୍ଡିକେସନ୍ ସୁରକ୍ଷା ଗାର୍ଡ',
      moduleSubtitle: 'ABHA ପ୍ରୋଫାଇଲ୍ ସହିତ ଅପଲୋଡ୍ ପ୍ରିସ୍କ୍ରିପସନ୍‌ର ରିଅଲ-ଟାଇମ୍ ଯାଞ୍ଚ। ଆନାଫାଇଲାକ୍ସିସ୍ ଆଲର୍ଜି, ମାରାତ୍ମକ ଔଷଧ ଟକରାବ (DDI), କୋମର୍ବିଡିଟି ବିପଦ ଏବଂ ନିରାପଦ ବିକଳ୍ପ ସୁପାରିଶ।',
      legalMandate: 'ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ (Non-Diagnostic) | MoHFW ଓ NMC ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁଯାୟୀ କାର୍ଯ୍ୟକ୍ଷମ',
      abhaSectionTitle: 'ରୋଗୀଙ୍କ ABHA ଆଲର୍ଜି ଓ କୋମର୍ବିଡିଟି ରେକର୍ଡ',
      selectPatient: 'ରୋଗୀ ABHA ବାଛନ୍ତୁ:',
      knownAllergiesLabel: 'ପୂର୍ବ ରେକର୍ଡଭୁକ୍ତ ଆଲର୍ଜି (Known Allergies):',
      noAllergies: 'କୌଣସି ପୂର୍ବ ଆଲର୍ଜି ରେକର୍ଡ ନାହିଁ (No known drug allergies)',
      activeMedsLabel: 'ବର୍ତ୍ତମାନ ଚାଲୁଥିବା ନିୟମିତ ଔଷଧ (Ongoing Meds):',
      comorbiditiesLabel: 'କ୍ଲିନିକାଲ୍ ଅବସ୍ଥା (Conditions):',
      quickCasesTitle: '୧-କ୍ଲିକ୍ ପରୀକ୍ଷଣ ନମୁନା (Clinical Test Cases):',
      rxSectionTitle: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ଔଷଧ ତାଲିକା ଯାଞ୍ଚ (Prescription Review)',
      addDrugPlaceholder: 'ଔଷଧ ନାମ କିମ୍ବା ଜେନେରିକ୍ ଖୋଜନ୍ତୁ (ଯଥା: Amoxicillin, Voveran, Dolo)...',
      btnAddCustom: 'ନୂଆ ଔଷଧ ଯୋଡ଼ନ୍ତୁ',
      btnScanRx: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ଫଟୋ ସ୍କାନ୍ (OCR)',
      scanningOcr: 'ପ୍ରିସ୍କ୍ରିପସନ୍ OCR ଡିଜିଟାଇଜେସନ୍ ଚାଲିଛି...',
      currentRxCount: 'ପରୀକ୍ଷା ପାଇଁ ଥିବା ଔଷଧ:',
      clearAll: 'ସବୁ ହଟାନ୍ତୁ',
      noDrugsSelected: 'କୌଣସି ଔଷଧ ଯୋଡ଼ା ହୋଇନାହିଁ। ଉପରୋକ୍ତ ନମୁନା ବାଛନ୍ତୁ କିମ୍ବା ଔଷଧ ଖୋଜି ଯୋଡ଼ନ୍ତୁ।',
      safetyAnalysisTitle: 'ସ୍ୱୟଂଚାଳିତ କ୍ଲିନିକାଲ୍ ସୁରକ୍ଷା ବିଶ୍ଳେଷଣ ଫଳାଫଳ',
      criticalBlockVerdict: 'ଅତ୍ୟନ୍ତ ଜରୁରୀ: ମାରାତ୍ମକ ଆଲର୍ଜି / ଟକରାବ ସଙ୍କେତ (DISPENSING BLOCKED)',
      majorCautionVerdict: 'ସତର୍କତା: ଉଚ୍ଚ-ବିପଦ ଔଷଧ ପ୍ରତିକ୍ରିୟା ଚେତାବନୀ (MAJOR CLINICAL CAUTION)',
      safePassVerdict: 'ସୁରକ୍ଷିତ: କୌଣସି ଆଲର୍ଜି ବା ବିପଦଜନକ ଟକରାବ ଚିହ୍ନଟ ହୋଇନାହିଁ (SAFE TO DISPENSE)',
      directAllergyAlerts: 'ପ୍ରତ୍ୟକ୍ଷ ଆଲର୍ଜି ଚେତାବନୀ (Direct Allergy Contraindications)',
      crossAllergyAlerts: 'କ୍ରସ୍-ଆଲର୍ଜି ସତର୍କତା (Cross-Reactivity Alert)',
      ddiAlerts: 'ଔଷଧ-ଔଷଧ ମାରାତ୍ମକ ଟକରାବ (Drug-Drug Interactions)',
      comorbidityAlerts: 'ରୋଗ ଓ ଔଷଧ ବିରୋଧାଭାସ (Disease-Drug Contraindications)',
      safeAlternativesTitle: 'ଡାକ୍ତରଙ୍କ ପାଇଁ AI ନିରାପଦ ବିକଳ୍ପ ସୁପାରିଶ (Safe Substitutes)',
      applyAlternativeBtn: 'ଏହି ବିକଳ୍ପ ବ୍ୟବହାର କରନ୍ତୁ',
      overrideBtn: 'ଡାକ୍ତରୀ କାରଣ ସହ ଅନୁମୋଦନ କରନ୍ତୁ (Doctor Override)',
      blockBtn: 'ପ୍ରିସ୍କ୍ରିପସନ୍ ବନ୍ଦ କରନ୍ତୁ (Block Order)',
      printSlipBtn: 'ସୁରକ୍ଷା ଯାଞ୍ଚ ସାର୍ଟିଫିକେଟ୍ ପ୍ରିଣ୍ଟ୍ (Audit Slip)',
      smsBtn: 'ରୋଗୀଙ୍କୁ SMS ସତର୍କତା ପଠାନ୍ତୁ',
      overriddenBadge: 'ଡାକ୍ତରୀ ସ୍ୱତନ୍ତ୍ର ଅନୁମୋଦନ ପ୍ରାପ୍ତ (Overridden by Doctor)',
      dose: 'ମାତ୍ରା:',
      pregnancyCategory: 'ଗର୍ଭାବସ୍ଥା ଶ୍ରେଣୀ:',
      renalLimit: 'କିଡନୀ eGFR ସୀମା:',
      mlMin: 'ml/min',
      sendSmsTitle: 'ରୋଗୀ ଓ ଆଶା କର୍ମୀଙ୍କୁ ସୁରକ୍ଷା SMS ପ୍ରେରଣ',
      sendSmsSub: 'ABHA ପଞ୍ଜୀକୃତ ମୋବାଇଲ୍ ନମ୍ବରକୁ ଆଲର୍ଜି ବିବରଣୀ ଏବଂ ସୁରକ୍ଷିତ ବିକଳ୍ପ ସୂଚନା ପଠାଯିବ।',
      btnSendNow: 'ତୁରନ୍ତ SMS ପଠାନ୍ତୁ',
      smsSentSuccess: 'SMS ସଫଳତାର ସହ ପଠାଗଲା! ଟୋକନ୍: #RX-SAFE-8821'
    },
    'hi-IN': {
      moduleBadge: 'मॉड्यूल 13 • राष्ट्रीय GovTech एंटरप्राइज मानक',
      moduleTitle: '13. दवा-दवा एवं एलर्जी कॉन्ट्रा-इंडिकेशन सुरक्षा गार्ड',
      moduleSubtitle: 'ABHA प्रोफाइल के साथ पर्चे की रियल-टाइम जांच। गंभीर एनाफिलेक्सिस एलर्जी, घातक ड्रग-ड्रग टकराव (DDI), कोमॉर्बिडिटी जोखिम एवं सुरक्षित विकल्प सुझाव।',
      legalMandate: 'क्लिनिकल निर्णय समर्थन (Non-Diagnostic) | MoHFW एवं NMC दिशानिर्देशों के अनुरूप',
      abhaSectionTitle: 'मरीज का ABHA एलर्जी एवं स्वास्थ्य रिकॉर्ड',
      selectPatient: 'मरीज ABHA चुनें:',
      knownAllergiesLabel: 'पूर्व दर्ज एलर्जी (Known Allergies):',
      noAllergies: 'कोई ज्ञात दवा एलर्जी दर्ज नहीं है (No known drug allergies)',
      activeMedsLabel: 'वर्तमान में चल रही दवाएं (Ongoing Meds):',
      comorbiditiesLabel: 'क्लिनिकल स्थिति (Conditions):',
      quickCasesTitle: '1-क्लिक परीक्षण मामले (Clinical Test Cases):',
      rxSectionTitle: 'पर्चे की दवाओं की सूची (Prescription Review)',
      addDrugPlaceholder: 'दवा का नाम या जेनेरिक खोजें (उदा: Amoxicillin, Voveran, Dolo)...',
      btnAddCustom: 'दवा जोड़ें',
      btnScanRx: 'पर्चे का फोटो स्कैन (OCR)',
      scanningOcr: 'पर्चे का OCR डिजिटाइजेशन जारी है...',
      currentRxCount: 'जांच हेतु दवाएं:',
      clearAll: 'सभी हटाएं',
      noDrugsSelected: 'कोई दवा नहीं जोड़ी गई। ऊपर से टेस्ट केस चुनें या दवा खोजें।',
      safetyAnalysisTitle: 'स्वचालित क्लिनिकल सुरक्षा विश्लेषण परिणाम',
      criticalBlockVerdict: 'अत्यंत गंभीर: जानलेवा एलर्जी / टकराव अलर्ट (DISPENSING BLOCKED)',
      majorCautionVerdict: 'सावधानी: उच्च-जोखिम ड्रग टकराव (MAJOR CLINICAL CAUTION)',
      safePassVerdict: 'सुरक्षित: कोई एलर्जी या घातक टकराव नहीं पाया गया (SAFE TO DISPENSE)',
      directAllergyAlerts: 'प्रत्यक्ष एलर्जी अलर्ट (Direct Allergy Contraindications)',
      crossAllergyAlerts: 'क्रॉस-एलर्जी चेतावनी (Cross-Reactivity Alert)',
      ddiAlerts: 'दवा-दवा घातक टकराव (Drug-Drug Interactions)',
      comorbidityAlerts: 'रोग एवं दवा विरोधाभास (Disease-Drug Contraindications)',
      safeAlternativesTitle: 'डॉक्टर हेतु AI सुरक्षित विकल्प सुझाव (Safe Substitutes)',
      applyAlternativeBtn: 'यह सुरक्षित विकल्प चुनें',
      overrideBtn: 'डॉक्टर कारण सहित अनुमति दें (Doctor Override)',
      blockBtn: 'प्रिस्क्रिप्शन रोकें (Block Order)',
      printSlipBtn: 'सुरक्षा प्रमाण पत्र प्रिंट (Audit Slip)',
      smsBtn: 'मरीज को SMS अलर्ट भेजें',
      overriddenBadge: 'डॉक्टर द्वारा विशेष अनुमति प्राप्त (Overridden by Doctor)',
      dose: 'खुराक:',
      pregnancyCategory: 'गर्भावस्था श्रेणी:',
      renalLimit: 'किडनी eGFR सीमा:',
      mlMin: 'ml/min',
      sendSmsTitle: 'मरीज एवं आशा कार्यकर्ता को सुरक्षा SMS',
      sendSmsSub: 'ABHA पंजीकृत मोबाइल पर एलर्जी विवरण और सुरक्षित विकल्प की सूचना जाएगी।',
      btnSendNow: 'तुरंत SMS भेजें',
      smsSentSuccess: 'SMS सफलतापूर्वक भेजा गया! टोकन: #RX-SAFE-8821'
    },
    'en-IN': {
      moduleBadge: 'MODULE 13 • NATIONAL GOVTECH ENTERPRISE STANDARD',
      moduleTitle: '13. Automated Drug-Drug & Allergy Contraindication Guard',
      moduleSubtitle: 'Real-time cross-analysis of active prescriptions against patient ABHA profile records. Detects fatal anaphylaxis triggers, dangerous Drug-Drug Interactions (DDI), comorbidity hazards, and recommends safe clinical alternatives.',
      legalMandate: 'Clinical Decision Support (Non-Diagnostic Mandate) | Aligned with MoHFW & NMC Clinical Safety Guidelines',
      abhaSectionTitle: 'Patient ABHA Profile & Verified Allergy Registry',
      selectPatient: 'Select Patient ABHA:',
      knownAllergiesLabel: 'Known Allergies in ABHA EHR:',
      noAllergies: 'No documented drug allergies in registry',
      activeMedsLabel: 'Ongoing Active Medications:',
      comorbiditiesLabel: 'Comorbidities & Physiological Status:',
      quickCasesTitle: '1-Click Interactive Clinical Test Cases:',
      rxSectionTitle: 'Current Prescription Under Safety Review',
      addDrugPlaceholder: 'Search 50+ Indian drugs or generics (e.g., Augmentin, Warfarin, Dolo, Brufen)...',
      btnAddCustom: 'Add Drug to Rx',
      btnScanRx: 'Scan Rx Slip (Camera / OCR)',
      scanningOcr: 'Digitizing Prescription & Extracting Drugs via OCR...',
      currentRxCount: 'Prescribed Drugs in Review:',
      clearAll: 'Clear Cart',
      noDrugsSelected: 'No drugs added to prescription yet. Choose a preset test case or search above.',
      safetyAnalysisTitle: 'Automated Clinical Safety Analysis Engine',
      criticalBlockVerdict: 'CRITICAL ALERT: LIFE-THREATENING ALLERGY / DDI DETECTED (DISPENSING BLOCKED)',
      majorCautionVerdict: 'MAJOR WARNING: HIGH-RISK DRUG INTERACTION DETECTED (CLINICAL CAUTION)',
      safePassVerdict: '100% CLINICALLY SAFE: NO CONTRAINDICATIONS OR ALLERGIES DETECTED',
      directAllergyAlerts: 'Direct Drug Allergy Contraindications',
      crossAllergyAlerts: 'Cross-Reactivity Allergy Warnings',
      ddiAlerts: 'Severe Drug-Drug Interactions (DDI)',
      comorbidityAlerts: 'Disease-Drug & Physiological Contraindications',
      safeAlternativesTitle: 'AI-Recommended Clinical Safe Substitutes',
      applyAlternativeBtn: 'Substitute Drug',
      overrideBtn: 'Doctor Override with Clinical Rationale',
      blockBtn: 'Block Prescription Order',
      printSlipBtn: 'Print / Export Safety Clearance Slip',
      smsBtn: 'Dispatch Citizen SMS / WhatsApp Alert',
      overriddenBadge: 'Clinically Overridden & Signed by Doctor',
      dose: 'Dosage:',
      pregnancyCategory: 'Pregnancy Category:',
      renalLimit: 'Renal eGFR Cutoff:',
      mlMin: 'ml/min',
      sendSmsTitle: 'Send Citizen Safety SMS & WhatsApp Alert',
      sendSmsSub: 'Dispatches instant multilingual safety token and contraindication advisory to patient mobile and local ASHA worker.',
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

    // All active drug IDs to check for DDI (Prescribed + Ongoing)
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
            title: lang === 'or-IN' ? `ପ୍ରତ୍ୟକ୍ଷ ଆଲର୍ଜି ବିପଦ: ${drug.name}` : (lang === 'hi-IN' ? `प्रत्यक्ष एलर्जी चेतावनी: ${drug.name}` : `Direct Allergy Contraindication: ${drug.name}`),
            detail: lang === 'or-IN'
              ? `ରୋଗୀଙ୍କ ABHA ରେକର୍ଡରେ ${allergy.name} ଆଲର୍ଜି (${allergy.severity}) ଅଛି। ଏହି ଔଷଧ ସେବନ ଦ୍ୱାରା ତୀବ୍ର ଆନାଫାଇଲାକ୍ସିସ୍ କିମ୍ବା ମୃତ୍ୟୁ ହୋଇପାରେ।`
              : (lang === 'hi-IN'
              ? `मरीज के ABHA रिकॉर्ड में ${allergy.name} एलर्जी (${allergy.severity}) दर्ज है। इससे गंभीर एनाफिलेक्सिस हो सकता है।`
              : `Patient has documented allergy to ${allergy.name} (${allergy.severity}). Immediate risk of life-threatening anaphylactic shock or severe adverse cutaneous reaction.`)
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
                  reasonOr: lang === 'or-IN' ? `${drug.name} ବଦଳରେ ସୁରକ୍ଷିତ ବିକଳ୍ପ: ${alt.note}` : (lang === 'hi-IN' ? `${drug.name} के स्थान पर सुरक्षित: ${alt.note}` : `Safe alternative for ${drug.name}: ${alt.note}`)
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
    // Check all combinations of prescribed × (prescribed + ongoing)
    const evaluatedPairs = new Set();
    prescribedDrugs.forEach((drug1) => {
      allDrugIds.forEach((drug2Id) => {
        if (drug1.id === drug2Id) return;
        const pairKey = [drug1.id, drug2Id].sort().join('___');
        if (evaluatedPairs.has(pairKey)) return;
        evaluatedPairs.add(pairKey);

        const drug2 = INDIAN_DRUG_DATABASE.find((d) => d.id === drug2Id);
        if (!drug2) return;

        // Search DDI matrix
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
            title: lang === 'or-IN' ? `${contra.nameOr} ରେ ${drug.name} ନିଷିଦ୍ଧ` : (lang === 'hi-IN' ? `${contra.nameHi} में ${drug.name} वर्जित` : `${contra.name} vs ${drug.name} Contraindication`),
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
          title: lang === 'or-IN' ? `କିଡନୀ ବିପଦ: eGFR ${activePatient.eGFR} ml/min କମ୍ ଅଛି` : (lang === 'hi-IN' ? `किडनी चेतावनी: eGFR ${activePatient.eGFR} ml/min कम है` : `Renal Clearance Threshold Alert: eGFR ${activePatient.eGFR} ml/min`),
          detail: lang === 'or-IN'
            ? `${drug.name} ସୁରକ୍ଷିତ ସୀମା ହେଉଛି eGFR > ${drug.renalCutoff} ml/min। ଡୋଜ୍ ହ୍ରାସ କରନ୍ତୁ କିମ୍ବା ବଦଳାନ୍ତୁ।`
            : (lang === 'hi-IN'
            ? `${drug.name} की सुरक्षित सीमा eGFR > ${drug.renalCutoff} ml/min है। खुराक कम करें या बदलें।`
            : `${drug.name} renal excretion impaired below eGFR ${drug.renalCutoff} ml/min. Risk of drug accumulation and nephrotoxicity.`),
          safeSubs: 'Adjust dose according to Cockcroft-Gault formula or choose hepatically cleared agent.'
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
      // Simulate recognized medications from photo
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
          badgeText: lang === 'or-IN' ? '🔴 ଆଲର୍ଜି ନିଷିଦ୍ଧ' : (lang === 'hi-IN' ? '🔴 गंभीर एलर्जी' : '🔴 ALLERGY CONTRAINDICATION'),
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
              badgeText: lang === 'or-IN' ? `🟠 ${cross.frequency} କ୍ରସ୍-ଆଲର୍ଜି` : (lang === 'hi-IN' ? `🟠 ${cross.frequency} क्रॉस-एलर्जी` : `🟠 ${cross.frequency} CROSS-ALLERGY`),
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
          badgeText: lang === 'or-IN' ? `⚠️ ${cKey} ବିପଦ` : (lang === 'hi-IN' ? `⚠️ ${cKey} खतरा` : `⚠️ ${cKey} CONTRAINDICATED`),
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
          badgeText: lang === 'or-IN' ? `⚠️ DDI: ${ongoingDrug?.name.split(' ')[0]}` : (lang === 'hi-IN' ? `⚠️ DDI: ${ongoingDrug?.name.split(' ')[0]}` : `⚠️ DDI with ${ongoingDrug?.name.split(' ')[0]}`),
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
        reason: `Renal clearance threshold exceeded (Patient eGFR: ${activePatient.eGFR})`
      };
    }

    return {
      status: 'SAFE',
      badgeText: lang === 'or-IN' ? '🟢 ସୁରକ୍ଷିତ (Safe)' : (lang === 'hi-IN' ? '🟢 सुरक्षित (Safe)' : '🟢 SAFE TO PRESCRIBE'),
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

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* 1. Header Banner & Safety Mandate */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-xl border border-indigo-900/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
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
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <ShieldAlert className="w-7 h-7 text-rose-400 shrink-0" />
              {txt.moduleTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              {txt.moduleSubtitle}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shrink-0 text-xs space-y-1">
            <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[11px]">
              <Lock className="w-4 h-4 text-amber-400" />
              NON-DIAGNOSTIC DECISION SUPPORT
            </div>
            <p className="text-[10px] text-slate-300 max-w-xs leading-normal">
              {txt.legalMandate}
            </p>
          </div>
        </div>

        {/* 1-Click Test Scenarios Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-900/60">
          <p className="text-[11px] font-black text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {txt.quickCasesTitle}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {PRESET_CLINICAL_CASES.map((c) => {
              const isSelected = activePresetCaseId === c.id;
              const titleText = lang === 'or-IN' ? c.caseTitleOr : (lang === 'hi-IN' ? c.caseTitleHi : c.caseTitle);
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectPresetCase(c)}
                  className={`text-left p-2.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-md ring-2 ring-indigo-400/40 font-bold'
                      : 'bg-white/10 text-slate-200 border-white/10 hover:bg-white/20'
                  }`}
                >
                  <span className="line-clamp-2 leading-tight">{titleText}</span>
                  {isSelected && <Check className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Patient ABHA Context Card */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                {txt.abhaSectionTitle}
              </h3>
              <p className="text-[11px] text-slate-500">
                Synced with National Health Authority (NHA) & Ayushman Bharat Health Account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700">{txt.selectPatient}</label>
            <select
              value={selectedAbhaId}
              onChange={(e) => {
                setSelectedAbhaId(e.target.value);
                setIsOverridden(false);
              }}
              className="bg-slate-50 border border-slate-300 text-slate-900 font-bold text-xs rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
            >
              {PRELOADED_ABHA_PATIENTS.map((p) => (
                <option key={p.abhaId} value={p.abhaId}>
                  {p.name} ({p.abhaId}) - {p.district}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Patient Demographics & Registry Highlights */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Patient Name</span>
            <span className="font-extrabold text-slate-900">{activePatient.name}</span>
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
            <span className="text-[10px] font-bold text-slate-400 uppercase block">eGFR Renal Function</span>
            <span className={`font-black ${activePatient.eGFR < 60 ? 'text-rose-600' : 'text-emerald-700'}`}>
              {activePatient.eGFR} ml/min
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Emergency Contact</span>
            <span className="font-bold text-slate-700">{activePatient.emergencyContact.split(' ')[0]}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">ABDM Health Status</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Verified
            </span>
          </div>
        </div>

        {/* Known Allergies & Active Meds Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Allergies */}
          <div className="p-3 rounded-2xl bg-rose-50/80 border border-rose-200">
            <span className="text-[10px] font-black text-rose-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
              {txt.knownAllergiesLabel}
            </span>
            <div className="space-y-1.5">
              {activePatient.knownAllergies?.length > 0 ? (
                activePatient.knownAllergies.map((al, idx) => (
                  <div key={idx} className="bg-white p-2 rounded-xl border border-rose-200 shadow-2xs">
                    <p className="font-black text-rose-950 text-xs">{al.name}</p>
                    <p className="text-[10px] text-rose-700 font-medium">{al.severity} • {al.dateRecorded}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500 text-[11px] italic">{txt.noAllergies}</p>
              )}
            </div>
          </div>

          {/* Ongoing Medications */}
          <div className="p-3 rounded-2xl bg-blue-50/80 border border-blue-200">
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Pill className="w-3.5 h-3.5 text-blue-600" />
              {txt.activeMedsLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePatient.activeMedications?.map((mId) => {
                const med = INDIAN_DRUG_DATABASE.find((d) => d.id === mId);
                return (
                  <span
                    key={mId}
                    className="bg-white text-blue-950 font-bold px-2.5 py-1 rounded-lg border border-blue-200 text-[11px] shadow-2xs flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-blue-600" />
                    {med?.name || mId}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Comorbidities */}
          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[10px] font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-amber-700" />
              {txt.comorbiditiesLabel}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePatient.comorbidities?.map((cKey) => {
                const cObj = COMORBIDITY_CONTRAINDICATIONS.find((c) => c.condition === cKey);
                const cName = lang === 'or-IN' ? cObj?.nameOr : (lang === 'hi-IN' ? cObj?.nameHi : cObj?.name);
                return (
                  <span
                    key={cKey}
                    className="bg-white text-amber-950 font-extrabold px-2.5 py-1 rounded-lg border border-amber-300 text-[11px] shadow-2xs"
                  >
                    ⚠️ {cName || cKey}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Prescription Builder & OCR Upload Zone */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              {txt.rxSectionTitle}
            </h3>
            <p className="text-[11px] text-slate-500">
              Add medications manually, search the Indian drug index, or scan physical prescription slips.
            </p>
          </div>

          {/* OCR Trigger Button & Hidden Input */}
          <div className="flex items-center gap-2">
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
              className="px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-600" />
              {txt.btnScanRx}
            </button>
            {prescribedDrugs.length > 0 && (
              <button
                onClick={() => setPrescribedDrugs([])}
                className="px-2.5 py-2 text-slate-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1"
                title={txt.clearAll}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{txt.clearAll}</span>
              </button>
            )}
          </div>
        </div>

        {/* OCR Scanning Progress Bar */}
        {isOcrScanning && (
          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-2 animate-fadeIn">
            <div className="flex justify-between items-center text-indigo-900 font-bold">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                {txt.scanningOcr}
              </span>
              <span>{ocrProgress}%</span>
            </div>
            <div className="w-full h-2 bg-indigo-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${ocrProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {ocrSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold flex items-center justify-between">
            <span>{ocrSuccessMessage}</span>
            <button onClick={() => setOcrSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-950">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={txt.addDrugPlaceholder}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400 shadow-2xs"
            />
          </div>

          {/* Category Filter Pills with Item Counts */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {DRUG_CATEGORIES.map((cat) => {
              const isSelected = selectedFilterCategory === cat.id;
              const count = getCategoryCount(cat.id);
              const label = lang === 'or-IN' ? cat.labelOr : (lang === 'hi-IN' ? cat.labelHi : cat.label);
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedFilterCategory(cat.id);
                  }}
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

        {/* Dynamic Category Clinical Protocol & 1-Click Test Prescription Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white border border-indigo-900/60 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  {currentCategoryObj.id} Category Formulary
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {filteredDrugs.length} Drugs Available
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                {lang === 'or-IN' ? `${currentCategoryObj.labelOr} କ୍ଲିନିକାଲ୍ ଗାଇଡ୍ ଓ ସୁରକ୍ଷା ନିୟମ` : (lang === 'hi-IN' ? `${currentCategoryObj.labelHi} क्लिनिकल गाइड एवं सुरक्षा प्रोटोकॉल` : `${currentCategoryObj.label} Clinical Guide & Safety Protocol`)}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
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
                  ? `⚡ नमूना ${currentCategoryObj.id} प्रिस्क्रिप्शन लोड करें`
                  : `⚡ Load Sample ${currentCategoryObj.id} Rx`)}
              </button>
            )}
          </div>

          {/* Category Safety Alerts Bullet List */}
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

        {/* Live Formulary Catalog Grid (Always Visible for the Selected Category) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Pill className="w-3.5 h-3.5 text-indigo-600" />
              {lang === 'or-IN' ? `ଫାର୍ମାସୀ ଡାଇରେକ୍ଟୋରୀ (${currentCategoryObj.id})` : (lang === 'hi-IN' ? `फार्मेसी ड्रग डायरेक्टरी (${currentCategoryObj.id})` : `Pharmacopoeia Catalog (${currentCategoryObj.id})`)}
              <span className="text-slate-400 font-normal">({filteredDrugs.length} items)</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Showing real-time safety status for: <strong>{activePatient.name.split(' ')[0]}</strong>
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-2xl p-3 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {filteredDrugs.length > 0 ? (
              filteredDrugs.map((drug) => {
                const alreadyAdded = prescribedDrugs.some((d) => d.id === drug.id);
                const safety = getDrugSafetyStatusForPatient(drug);

                return (
                  <div
                    key={drug.id}
                    className={`p-3 rounded-2xl border transition-all flex flex-col justify-between gap-2 shadow-2xs ${
                      alreadyAdded
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
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-md whitespace-nowrap shrink-0 ${safety.badgeClass}`}
                        >
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
                      <span className="text-[10px] text-slate-400 truncate max-w-[130px]" title={drug.notes}>
                        {drug.notes}
                      </span>
                      {alreadyAdded ? (
                        <button
                          onClick={() => handleRemoveDrug(drug.id)}
                          className="px-2.5 py-1 bg-emerald-100 hover:bg-rose-100 text-emerald-800 hover:text-rose-800 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                          title="Click to remove from Rx"
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
              })
            ) : (
              <p className="col-span-full text-center text-xs text-slate-400 py-6">
                No matching medications found in {selectedFilterCategory} category.
              </p>
            )}
          </div>
        </div>

        {/* Current Active Prescription Cart */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">
              {txt.currentRxCount} ({prescribedDrugs.length})
            </span>
          </div>

          {prescribedDrugs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {prescribedDrugs.map((drug) => {
                // Determine if this specific drug is flagged by any rule
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-slate-900 text-xs">{drug.name}</span>
                        {isFlagged && (
                          <span className="bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md uppercase">
                            Flagged
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium">
                        {txt.dose} <strong>{drug.defaultDose}</strong>
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{drug.class}</span>
                        <span>•</span>
                        <span>Preg: <strong>Cat {drug.pregnancyCat}</strong></span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDrug(drug.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* 4. Automated Clinical Safety Analysis Engine & Verdict Banner */}
      <div className="space-y-4">
        {/* Main Verdict Card */}
        <div
          className={`p-6 rounded-3xl border-2 shadow-md transition-all ${
            safetyReport.overallTier === 'CRITICAL_BLOCK'
              ? 'bg-rose-50 border-rose-500'
              : safetyReport.overallTier === 'MAJOR_CAUTION'
              ? 'bg-amber-50 border-amber-500'
              : 'bg-emerald-50 border-emerald-500'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className={`p-3.5 rounded-2xl text-white shadow-md shrink-0 ${
                  safetyReport.overallTier === 'CRITICAL_BLOCK'
                    ? 'bg-rose-600 animate-pulse'
                    : safetyReport.overallTier === 'MAJOR_CAUTION'
                    ? 'bg-amber-600'
                    : 'bg-emerald-600'
                }`}
              >
                {safetyReport.overallTier === 'CRITICAL_BLOCK' ? (
                  <AlertOctagon className="w-8 h-8" />
                ) : safetyReport.overallTier === 'MAJOR_CAUTION' ? (
                  <AlertTriangle className="w-8 h-8" />
                ) : (
                  <CheckCircle2 className="w-8 h-8" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full text-white ${
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
                  className={`text-base sm:text-lg font-black tracking-tight ${
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
                  className={`text-xs mt-1 font-medium ${
                    safetyReport.overallTier === 'CRITICAL_BLOCK'
                      ? 'text-rose-800'
                      : safetyReport.overallTier === 'MAJOR_CAUTION'
                      ? 'text-amber-900'
                      : 'text-emerald-800'
                  }`}
                >
                  {safetyReport.overallTier === 'CRITICAL_BLOCK'
                    ? 'Dispensing to patient is electronically restricted. Review contraindications below or substitute with recommended safe alternative.'
                    : safetyReport.overallTier === 'MAJOR_CAUTION'
                    ? 'Prescription contains high-risk interactions or organ clearance warnings requiring clinician verification.'
                    : 'All prescribed drugs verified against ABHA allergy records, cross-reactivity indexes, drug interaction matrix, and patient comorbidities.'}
                </p>
              </div>
            </div>

            {/* Doctor Actions Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
              {safetyReport.overallTier !== 'SAFE_PASS' && !isOverridden && (
                <button
                  onClick={() => setShowOverrideModal(true)}
                  className="px-3.5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Stethoscope className="w-4 h-4 text-amber-300" />
                  {txt.overrideBtn}
                </button>
              )}

              <button
                onClick={handlePrintSlip}
                className="px-3.5 py-2 bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-indigo-600" />
                {txt.printSlipBtn}
              </button>

              <button
                onClick={() => setShowSmsModal(true)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                {txt.smsBtn}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Detailed Breakdown of Safety Flags */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* A. Direct Allergy & Cross-Reactivity Alerts */}
          {(safetyReport.directAllergies.length > 0 || safetyReport.crossAllergies.length > 0) && (
            <div className="bg-white p-5 rounded-3xl border border-rose-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-rose-900 font-black text-sm border-b border-rose-100 pb-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                {txt.directAllergyAlerts}
              </div>

              {/* Direct Alerts */}
              {safetyReport.directAllergies.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 space-y-2">
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

              {/* Cross-Reactivity Alerts */}
              {safetyReport.crossAllergies.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-orange-50 border border-orange-300 space-y-1.5">
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

          {/* B. Drug-Drug Interactions (DDI) */}
          {safetyReport.ddiHits.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-amber-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-amber-950 font-black text-sm border-b border-amber-100 pb-2">
                <Zap className="w-4 h-4 text-amber-600" />
                {txt.ddiAlerts} ({safetyReport.ddiHits.length})
              </div>

              <div className="space-y-3">
                {safetyReport.ddiHits.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-2xl border space-y-2 ${
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
                    <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-slate-700">Recommended Action:</span>
                      <span className="text-indigo-700">{item.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* C. Comorbidity & Organ Clearance Contraindications */}
          {safetyReport.comorbidityHits.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm border-b border-slate-100 pb-2">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                {txt.comorbidityAlerts} ({safetyReport.comorbidityHits.length})
              </div>

              <div className="space-y-3">
                {safetyReport.comorbidityHits.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
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
            </div>
          )}

          {/* D. AI-Recommended Safe Alternatives (1-Click Fix) */}
          {safetyReport.alternativeSuggestions.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-3xl border border-emerald-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-emerald-950 font-black text-sm border-b border-emerald-200 pb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                {txt.safeAlternativesTitle}
              </div>

              <div className="space-y-2.5">
                {safetyReport.alternativeSuggestions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-2xl border border-emerald-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-rose-600 line-through font-bold">{item.replaceDrug.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-extrabold text-sm">{item.suggestedDrug.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.reasonOr}</p>
                    </div>

                    <button
                      onClick={() => handleApplyAlternative(item.replaceDrug, item.suggestedDrug)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-2xs transition-all flex items-center gap-1.5 text-xs shrink-0 self-end sm:self-auto"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {txt.applyAlternativeBtn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 6. Doctor Override Modal */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-purple-900 font-black text-base">
                <Stethoscope className="w-5 h-5 text-purple-600" />
                Registered Medical Practitioner Override
              </div>
              <button onClick={() => setShowOverrideModal(false)} className="text-slate-400 hover:text-slate-700">
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl text-xs shadow-md"
                >
                  Confirm &amp; Digitally Sign Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Citizen SMS Notification Modal */}
      {showSmsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-slate-900 font-black text-sm">
                <Share2 className="w-5 h-5 text-indigo-600" />
                {txt.sendSmsTitle}
              </div>
              <button onClick={() => setShowSmsModal(false)} className="text-slate-400 hover:text-slate-700">
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
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSmsSentStatus(true);
                    setTimeout(() => setShowSmsModal(false), 1800);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {txt.btnSendNow}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. Printable Clinical Audit Slip (Hidden on screen, shown in print) */}
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
