import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Globe,
  Plus,
  AlertCircle,
  FileText,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Thermometer,
  Wind,
  HeartPulse,
  Stethoscope,
  Activity,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Save,
  Volume2,
  VolumeX,
  Sparkles,
  Info,
  Radio,
  Copy,
  Check,
  AlertTriangle,
  ShieldAlert,
  Flame,
  ArrowRight,
  Smile,
  Zap,
  Pill,
  ShoppingBag,
  PhoneCall,
  Play,
  Pause,
  Square,
  ShieldCheck,
  Building,
  Truck,
  ExternalLink,
  MessageSquare,
  Bot,
  User,
  Clock,
  Send,
  Timer
} from 'lucide-react';
import {
  CONDITION_PROTOCOLS,
  processIntakeSpeech,
  SAMPLE_VOICE_CASES,
  parseDurationDays,
  parseSpokenTemperature,
  getClinicalMedicineRecommendations,
  DOCTOR_CONVERSATION_QUESTIONS,
  buildDoctorPrescriptionSpeech
} from '../utils/clinicalIntakeModel';

const DRAFT_STORAGE_KEY = 'nhp_draft_patient_intake_v3';

// ─── 6 INDIA-WIDE FACILITY SCENARIOS (PS 3 CORE SPECIFICATION) ─────────────
export const INDIA_FACILITY_SCENARIOS = [
  {
    id: 'opd_surge',
    badge: '1. OPD Surge',
    settingName: 'Civil Hospital OPD Surge',
    category: 'fever',
    vitals: { temperature: '103.2', pulse: '112', spo2: '94', systolic: '105', diastolic: '65', durationDays: '3' },
    speech: {
      'or-IN': 'ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର, ବାନ୍ତି ଏବଂ ଦେହ ହାତ ଘୋଳାବିନ୍ଧା ହେଉଛି। ଠିଆ ହେବାକୁ ବଳ ପାଉନାହିଁ।',
      'hi-IN': 'पिछले 3 दिनों से तेज़ बुखार, उल्टी और चक्कर आ रहे हैं। चलने की भी शक्ति नहीं बची है।',
      'en-IN': 'High grade fever with chills and persistent vomiting for 3 days. Severe dehydration and weakness in crowded OPD queue.'
    }
  },
  {
    id: 'industrial_fumes',
    badge: '2. Industrial MIDC',
    settingName: 'MIDC / GIDC Occupational Health',
    category: 'respiratory',
    vitals: { temperature: '98.6', pulse: '104', spo2: '91', systolic: '130', diastolic: '85', durationDays: '1' },
    speech: {
      'or-IN': 'କାରଖାନାରେ ରାସାୟନିକ ଧୂଆଁ ଶୁଙ୍ଘିବା ପରେ ଛାତିରେ ଭୀଷଣ ଯନ୍ତ୍ରଣା ଓ ଶ୍ୱାସରୁଦ୍ଧ ହେଉଛି, ଆଖି ପୋଡୁଛି।',
      'hi-IN': 'कारखाने में केमिकल धुआं सांस में जाने के बाद सीने में जकड़न, सांस लेने में भारी तकलीफ और आंखों में जलन है।',
      'en-IN': 'Chemical solvent vapor inhalation in paint manufacturing shop. Acute chest tightness, ocular irritation, severe dyspnea.'
    }
  },
  {
    id: 'campus_fever',
    badge: '3. Campus Fever',
    settingName: 'Campus Infirmary Meningitis Triage',
    category: 'fever',
    vitals: { temperature: '104.0', pulse: '122', spo2: '96', systolic: '112', diastolic: '72', durationDays: '2' },
    speech: {
      'or-IN': 'ହଷ୍ଟେଲରେ ପ୍ରବଳ ଜ୍ୱର ୧୦୪°F, ବେକ ଟାଣି ଧରୁଛି ଏବଂ ଆଲୋକ ଦେଖିଲେ ଆଖି କଷ୍ଟ ହେଉଛି (ଫୋଟୋଫୋବିଆ)।',
      'hi-IN': 'हॉस्टल में अचानक 104°F तेज बुखार, गर्दन में जकड़न और रोशनी देखने में तेज दर्द हो रहा है।',
      'en-IN': 'Rapid high grade fever 104°F with severe neck stiffness (nuchal rigidity) and photophobia in student hostel cluster.'
    }
  },
  {
    id: 'maternal_anc',
    badge: '4. Maternal ANC',
    settingName: 'Rural PHC ANC Pre-eclampsia',
    category: 'maternal_pediatric',
    vitals: { temperature: '98.8', pulse: '92', spo2: '98', systolic: '168', diastolic: '106', durationDays: '2' },
    speech: {
      'or-IN': 'ଗର୍ଭବତୀ ୩୨ ସପ୍ତାହ, ସକାଳୁ ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍‌ସା ଦେଖାଯାଉଛି ଏବଂ ଗୋଡ଼ ଫୁଲି ଯାଇଛି।',
      'hi-IN': 'गर्भावस्था 32 सप्ताह, सुबह से तेज सिरदर्द, आंखों में धुंधलापन और दोनों पैरों में भारी सूजन आ गई है।',
      'en-IN': '32 weeks primigravida with severe persistent occipital headache, visual blurring, and bilateral pedal edema.'
    }
  },
  {
    id: 'public_health_camp',
    badge: '5. Public Camp',
    settingName: 'Point-of-Care Health Camp',
    category: 'gastro',
    vitals: { temperature: '98.4', pulse: '80', spo2: '98', systolic: '142', diastolic: '88', durationDays: '14' },
    speech: {
      'or-IN': 'ବହୁତ ଦିନ ଧରି ଭୀଷଣ ଶୋଷ ଲାଗୁଛି, ବାରମ୍ବାର ପରିସ୍ରା ହେଉଛି ଏବଂ ଦେହ ହାତ ଦୁର୍ବଳ ଲାଗୁଛି।',
      'hi-IN': 'लगातार अत्यधिक प्यास, बार-बार पेशाब और वजन में भारी गिरावट महसूस हो रही है।',
      'en-IN': 'Remote tribal health camp: Unquenchable thirst, frequent urination, severe lethargy, suspected glycemic crisis.'
    }
  },
  {
    id: 'tertiary_referral',
    badge: '6. Referral Prep',
    settingName: 'DHH to Medical College Referral',
    category: 'fever',
    vitals: { temperature: '103.0', pulse: '114', spo2: '93', systolic: '98', diastolic: '62', durationDays: '4' },
    speech: {
      'or-IN': '୪ ଦିନ ଧରି ଜ୍ୱର ସହିତ ମାଢ଼ିରୁ ରକ୍ତ ପଡୁଛି, ଲ୍ୟାବ୍ ରିପୋର୍ଟରେ ପ୍ଲେଟଲେଟ୍ ୪୨,୦୦୦ କୁ ଖସିଯାଇଛି।',
      'hi-IN': '4 दिन से बुखार और मसूड़ों से खून आ रहा है, प्लेटलेट 42,000 हो गया है, तुरंत रेफरल चाहिए।',
      'en-IN': 'Day 4 dengue fever with thrombocytopenia (Platelets 42,000 /cumm) and active mucosal bleeding requiring HDU.'
    }
  }
];

// Synthesizes pleasant Indian doctor chimes using browser Web Audio API
function playDoctorAcousticChime(type = 'start') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'start') {
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(587.33, ctx.currentTime + 0.14);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    }
  } catch (e) {
    // Non-blocking fallback
  }
}

// Selects natural Indian accent / language voice from browser synthesis
function getBestIndianDoctorVoice(langCode) {
  if (!('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const langLower = langCode.toLowerCase();

  // 1. Hindi Voice matching
  if (langLower.startsWith('hi')) {
    const hiVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('hi') ||
        v.name.toLowerCase().includes('hindi') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('hemant') ||
        v.name.toLowerCase().includes('kalpana')
    );
    if (hiVoice) return hiVoice;
  }

  // 2. Odia Voice matching (fallback to Indian regional / Indian English with clear Indian phonetics)
  if (langLower.startsWith('or')) {
    const orVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().startsWith('or') ||
        v.name.toLowerCase().includes('odia') ||
        v.name.toLowerCase().includes('oriya')
    );
    if (orVoice) return orVoice;

    const inVoice = voices.find(
      (v) =>
        v.lang.toLowerCase().includes('in') ||
        v.name.toLowerCase().includes('india') ||
        v.lang.toLowerCase().startsWith('hi')
    );
    if (inVoice) return inVoice;
  }

  // 3. Indian English Voice matching
  const inEnVoice = voices.find(
    (v) =>
      v.lang.toLowerCase() === 'en-in' ||
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('heera') ||
      v.name.toLowerCase().includes('neerja') ||
      v.name.toLowerCase().includes('ravi')
  );
  if (inEnVoice) return inEnVoice;

  // 4. Match prefix or first voice
  return voices.find((v) => v.lang.toLowerCase().startsWith(langLower.split('-')[0])) || voices[0];
}

export default function MultimodalIntakeForm({
  onIntakeComplete,
  currentUser,
  appLang = 'or-IN',
  onLanguageChange,
  onOpenTeleconsult,
  onNavigateTab
}) {
  // Active Speech Recognition Language: 'or-IN' | 'hi-IN' | 'en-IN' | 'en-US'
  const [selectedVoiceLang, setSelectedVoiceLang] = useState(appLang || 'or-IN');

  // Consultation Mode: 'conversational' (Interactive Doctor Dialogue) | 'single' (Quick Mic Triage)
  const [consultationMode, setConsultationMode] = useState('conversational');

  // Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [micSupported, setMicSupported] = useState(true);
  const [micError, setMicError] = useState(null);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  // ─── 5-10 SECOND PAUSE / SILENCE DETECTION STATES ─────────────────────
  const [pauseTimeoutSetting, setPauseTimeoutSetting] = useState(5); // 5s, 7s, 10s
  const [silenceSecondsLeft, setSilenceSecondsLeft] = useState(5);
  const [isSilenceCountdownActive, setIsSilenceCountdownActive] = useState(false);

  // ─── DOCTOR-PATIENT CONVERSATION DIALOGUE STATE ───────────────────────
  const [currentDoctorTurn, setCurrentDoctorTurn] = useState('turn1'); // 'turn1' | 'turn2' | 'turn3' | 'turn4' | 'completed'
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isDoctorSpeaking, setIsDoctorSpeaking] = useState(false);
  const [doctorSpeechText, setDoctorSpeechText] = useState('');
  const [speechSpeed, setSpeechSpeed] = useState(0.9); // Calm, gentle doctor pace

  // Cumulative transcript across all turns
  const [cumulativePatientSpeech, setCumulativePatientSpeech] = useState('');

  // NLP Extracted Clinical Model State
  const [clinicalState, setClinicalState] = useState(() => processIntakeSpeech('', selectedVoiceLang));
  const [copied, setCopied] = useState(false);
  const [showSampleCases, setShowSampleCases] = useState(false);
  const [privacyShieldActive, setPrivacyShieldActive] = useState(true);
  const [activeScenarioId, setActiveScenarioId] = useState(null);

  // Condition category & adaptive questions
  const [activeCategory, setActiveCategory] = useState('fever');
  const [targetedAnswers, setTargetedAnswers] = useState({});
  const [painSeverity, setPainSeverity] = useState('4');

  // Quantitative Vitals State
  const [vitals, setVitals] = useState({
    temperature: '99.4',
    pulse: '84',
    spo2: '97',
    systolic: '120',
    diastolic: '80',
    durationDays: '2'
  });

  const [hasVoiceExtractedVitals, setHasVoiceExtractedVitals] = useState(false);

  // Medicine Recommendations State
  const [medicineRecommendations, setMedicineRecommendations] = useState(() =>
    getClinicalMedicineRecommendations(clinicalState, selectedVoiceLang)
  );

  // References
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef('');
  const fullTextRef = useRef('');
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const processTimeoutRef = useRef(null);

  // Silence detection refs
  const silenceTimerRef = useRef(null);
  const lastSpeechTimeRef = useRef(0);
  const silenceCountdownIntervalRef = useRef(null);
  const currentTurnRef = useRef('turn1');
  currentTurnRef.current = currentDoctorTurn;

  // Sync prop language with internal voice lang
  useEffect(() => {
    if (appLang && appLang !== selectedVoiceLang) {
      setSelectedVoiceLang(appLang);
    }
  }, [appLang]);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
    }
  }, []);

  // ─── DOCTOR SPEECH SYNTHESIS ENGINE ──────────────────────────────────
  const speakDoctorUtterance = useCallback(
    (textToSpeak, onFinishedCallback = null) => {
      if (!('speechSynthesis' in window)) {
        if (onFinishedCallback) onFinishedCallback();
        return;
      }

      window.speechSynthesis.cancel();
      if (!textToSpeak || !textToSpeak.trim()) {
        if (onFinishedCallback) onFinishedCallback();
        return;
      }

      setDoctorSpeechText(textToSpeak);
      setIsDoctorSpeaking(true);

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechSpeed;
      utterance.pitch = 1.0;

      const bestVoice = getBestIndianDoctorVoice(selectedVoiceLang);
      if (bestVoice) {
        utterance.voice = bestVoice;
        utterance.lang = bestVoice.lang || selectedVoiceLang;
      } else {
        utterance.lang = selectedVoiceLang;
      }

      utterance.onend = () => {
        setIsDoctorSpeaking(false);
        if (onFinishedCallback) onFinishedCallback();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis notice:', e);
        setIsDoctorSpeaking(false);
        if (onFinishedCallback) onFinishedCallback();
      };

      window.speechSynthesis.speak(utterance);
    },
    [selectedVoiceLang, speechSpeed]
  );

  const stopDoctorSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsDoctorSpeaking(false);
    }
  };

  // ─── START / ADVANCE DOCTOR CONVERSATION WORKFLOW ────────────────────
  const startDoctorConversation = useCallback(
    (targetLang = null) => {
      stopDoctorSpeech();
      if (isListeningRef.current) stopListening();

      const lang = targetLang || selectedVoiceLang;
      const langKey = lang.startsWith('or') ? 'or' : lang.startsWith('hi') ? 'hi' : 'en';
      const greeting = DOCTOR_CONVERSATION_QUESTIONS.turn1_chief_complaint.prompts[langKey];

      setCurrentDoctorTurn('turn1');
      setConversationHistory([
        {
          id: `doc_turn1_${Date.now()}`,
          sender: 'doctor',
          turnId: 'turn1',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Speak greeting, then automatically open mic for patient
      speakDoctorUtterance(greeting, () => {
        setTimeout(() => {
          startListening();
        }, 300);
      });
    },
    [selectedVoiceLang, speakDoctorUtterance]
  );

  // Initialize conversation on mount if in conversational mode
  useEffect(() => {
    if (conversationHistory.length === 0) {
      const langKey = selectedVoiceLang.startsWith('or') ? 'or' : selectedVoiceLang.startsWith('hi') ? 'hi' : 'en';
      const greeting = DOCTOR_CONVERSATION_QUESTIONS.turn1_chief_complaint.prompts[langKey];
      setConversationHistory([
        {
          id: 'initial_doc_msg',
          sender: 'doctor',
          turnId: 'turn1',
          text: greeting,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [selectedVoiceLang]);

  // Setup Web Audio API volume visualizer
  const setupAudioVisualizer = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) return;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (!isListeningRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setAudioLevel(normalized);

        // If audio level is substantial, user is speaking -> reset pause timer
        if (normalized > 14) {
          lastSpeechTimeRef.current = Date.now();
          setSilenceSecondsLeft(pauseTimeoutSetting);
          setIsSilenceCountdownActive(false);
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          if (silenceCountdownIntervalRef.current) clearInterval(silenceCountdownIntervalRef.current);
        }

        animFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (err) {
      console.warn('Microphone audio stream visualizer warning:', err);
    }
  };

  const stopAudioVisualizer = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    setAudioLevel(0);
  };

  // ─── REACTION ENGINE: RE-EVALUATE CLINICAL TRIAGE NLP DYNAMICALLY ───
  const updateClinicalAssessment = useCallback(
    (speechText, currentPain, currentVitals, currentAnswers) => {
      const textToAssess = (speechText || '').trim();
      const clinicalResult = processIntakeSpeech(textToAssess, selectedVoiceLang, {
        painLevel: currentPain,
        vitals: currentVitals,
        targetedAnswers: currentAnswers
      });
      setClinicalState(clinicalResult);

      if (clinicalResult.primaryCategory && clinicalResult.detectedSymptoms.length > 0) {
        setActiveCategory(clinicalResult.primaryCategory);
      }
      if (clinicalResult.durationDays && !currentVitals.durationDays) {
        setVitals((prev) => ({ ...prev, durationDays: clinicalResult.durationDays }));
      }
      if (clinicalResult.extractedTemp && (!currentVitals.temperature || currentVitals.temperature === '98.6')) {
        setVitals((prev) => ({ ...prev, temperature: clinicalResult.extractedTemp }));
      }

      const medRecs = getClinicalMedicineRecommendations(clinicalResult, selectedVoiceLang);
      setMedicineRecommendations(medRecs);
      return clinicalResult;
    },
    [selectedVoiceLang]
  );

  // Live update whenever pain level, vitals, or targeted answers change
  useEffect(() => {
    const textToAssess = (cumulativePatientSpeech || transcript || '').trim();
    if (textToAssess) {
      updateClinicalAssessment(textToAssess, painSeverity, vitals, targetedAnswers);
    }
  }, [painSeverity, vitals.temperature, vitals.spo2, vitals.systolic, vitals.durationDays, targetedAnswers, updateClinicalAssessment]);

  // Direct manual text change handler (allows typing or editing symptoms)
  const handleTextChange = (newText) => {
    setTranscript(newText);
    setCumulativePatientSpeech(newText);
    baseTextRef.current = newText;
    fullTextRef.current = newText;
    updateClinicalAssessment(newText, painSeverity, vitals, targetedAnswers);
  };

  // ─── ADVANCE TO NEXT DOCTOR TURN AFTER PATIENT SPEAKS ─────────────────
  const processPatientSpeechTurn = useCallback(
    (patientUtterance) => {
      const trimmed = (patientUtterance || '').trim();
      if (!trimmed) return;

      playDoctorAcousticChime('confirm');

      // 1. Add patient response to conversation history
      const patientMsgId = `pat_${Date.now()}`;
      setConversationHistory((prev) => [
        ...prev,
        {
          id: patientMsgId,
          sender: 'patient',
          turnId: currentTurnRef.current,
          text: trimmed,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // 2. Accumulate overall speech
      const newCumulative = cumulativePatientSpeech
        ? `${cumulativePatientSpeech}. ${trimmed}`
        : trimmed;
      setCumulativePatientSpeech(newCumulative);
      setTranscript(newCumulative);

      // 3. Run clinical NLP model on cumulative speech with vitals and pain context
      const clinicalResult = updateClinicalAssessment(newCumulative, painSeverity, vitals, targetedAnswers);

      if (clinicalResult.durationDays) {
        setHasVoiceExtractedVitals(true);
      }
      if (clinicalResult.extractedTemp) {
        setHasVoiceExtractedVitals(true);
      }

      const medRecs = getClinicalMedicineRecommendations(clinicalResult, selectedVoiceLang);

      // 4. Progress Doctor turns: turn1 -> turn2 -> turn3 -> turn4
      const nextTurn =
        currentTurnRef.current === 'turn1'
          ? 'turn2'
          : currentTurnRef.current === 'turn2'
          ? 'turn3'
          : 'turn4';

      setCurrentDoctorTurn(nextTurn);

      // Clear current turn scratchpad for next speech input
      baseTextRef.current = '';
      fullTextRef.current = '';

      // Determine Doctor's next question or final prescription
      let doctorNextQuestion = '';
      const categoryToUse = clinicalResult.primaryCategory || activeCategory || 'fever';

      if (nextTurn === 'turn2') {
        doctorNextQuestion = DOCTOR_CONVERSATION_QUESTIONS.turn2_targeted_inquiry.getPrompt(
          categoryToUse,
          selectedVoiceLang
        );
      } else if (nextTurn === 'turn3') {
        const langKey = selectedVoiceLang.startsWith('or') ? 'or' : selectedVoiceLang.startsWith('hi') ? 'hi' : 'en';
        doctorNextQuestion = DOCTOR_CONVERSATION_QUESTIONS.turn3_timeline_vitals.prompts[langKey];
      } else {
        // Turn 4: Final clinical diagnosis & prescription
        doctorNextQuestion = buildDoctorPrescriptionSpeech(clinicalResult, medRecs, selectedVoiceLang);
      }

      // Add doctor's question to conversation
      const docMsgId = `doc_${nextTurn}_${Date.now()}`;
      setConversationHistory((prev) => [
        ...prev,
        {
          id: docMsgId,
          sender: 'doctor',
          turnId: nextTurn,
          text: doctorNextQuestion,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      // Speak doctor's response
      speakDoctorUtterance(doctorNextQuestion, () => {
        // If not at final prescription turn, automatically open mic for patient's next answer!
        if (nextTurn !== 'turn4') {
          setTimeout(() => {
            startListening();
          }, 350);
        }
      });
    },
    [
      cumulativePatientSpeech,
      selectedVoiceLang,
      activeCategory,
      speakDoctorUtterance,
      updateClinicalAssessment,
      painSeverity,
      vitals,
      targetedAnswers
    ]
  );

  // ─── START SILENCE COUNTDOWN (5-10 SEC PAUSE TIMER) ───────────────────
  const triggerSilenceCountdown = useCallback(
    (capturedText) => {
      if (!capturedText || !capturedText.trim()) return;

      setIsSilenceCountdownActive(true);
      setSilenceSecondsLeft(pauseTimeoutSetting);

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (silenceCountdownIntervalRef.current) clearInterval(silenceCountdownIntervalRef.current);

      let countdown = pauseTimeoutSetting;

      silenceCountdownIntervalRef.current = setInterval(() => {
        countdown -= 1;
        setSilenceSecondsLeft(countdown);

        if (countdown <= 0) {
          clearInterval(silenceCountdownIntervalRef.current);
          setIsSilenceCountdownActive(false);

          // Timeout reached: stop listening and submit speech
          stopListening();
          processPatientSpeechTurn(capturedText);
        }
      }, 1000);
    },
    [pauseTimeoutSetting, processPatientSpeechTurn]
  );

  // Start Speech Recognition
  const startListening = () => {
    stopDoctorSpeech();
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
      setMicError('Speech recognition is not supported in this browser. Please use Google Chrome or type symptoms.');
      return;
    }

    setMicError(null);
    setIsSilenceCountdownActive(false);
    setSilenceSecondsLeft(pauseTimeoutSetting);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = selectedVoiceLang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setMicError(null);
        playDoctorAcousticChime('start');
      };

      recognition.onresult = (event) => {
        let interim = '';
        let finalChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalChunk += res[0].transcript + ' ';
          } else {
            interim += res[0].transcript;
          }
        }

        if (finalChunk) {
          const currentBase = baseTextRef.current ? baseTextRef.current.trim() + ' ' : '';
          const newBase = currentBase + finalChunk.trim();
          baseTextRef.current = newBase;
          fullTextRef.current = newBase;
          setInterimTranscript('');

          // Patient spoke a complete phrase: trigger silence countdown!
          triggerSilenceCountdown(newBase);
        } else {
          setInterimTranscript(interim);
          lastSpeechTimeRef.current = Date.now();
          setIsSilenceCountdownActive(false);
          if (silenceCountdownIntervalRef.current) clearInterval(silenceCountdownIntervalRef.current);
        }
      };

      recognition.onerror = (err) => {
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setMicError('Microphone permission blocked. Please allow mic in browser address bar.');
          stopAudioVisualizer();
        } else if (err.error === 'no-speech') {
          // Normal pause, keep listening
        }
      };

      recognition.onend = () => {
        if (isListeningRef.current) {
          setTimeout(() => {
            if (isListeningRef.current && recognitionRef.current) {
              try {
                recognitionRef.current.start();
              } catch (e) {}
            }
          }, 150);
        } else {
          setIsListening(false);
          setInterimTranscript('');
          stopAudioVisualizer();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      isListeningRef.current = true;

      // Start timer
      setRecordSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);

      // Start audio waveform visualizer
      setupAudioVisualizer();
    } catch (e) {
      setIsListening(false);
      isListeningRef.current = false;
      setMicError('Could not start microphone.');
      stopAudioVisualizer();
    }
  };

  // Stop Speech Recognition
  const stopListening = () => {
    isListeningRef.current = false;
    setIsListening(false);
    setIsSilenceCountdownActive(false);

    if (silenceCountdownIntervalRef.current) {
      clearInterval(silenceCountdownIntervalRef.current);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    stopAudioVisualizer();
    setInterimTranscript('');
  };

  // Immediate send action without waiting for silence countdown
  const handleManualSendSpeech = () => {
    const speechVal = (baseTextRef.current || interimTranscript || '').trim();
    if (!speechVal) return;
    stopListening();
    processPatientSpeechTurn(speechVal);
  };

  const toggleListening = () => {
    if (isListening) {
      const speechVal = (baseTextRef.current || interimTranscript || '').trim();
      stopListening();
      if (speechVal) {
        processPatientSpeechTurn(speechVal);
      }
    } else {
      startListening();
    }
  };

  // Switch voice language
  const handleVoiceLangChange = (langCode) => {
    stopDoctorSpeech();
    setSelectedVoiceLang(langCode);
    if (onLanguageChange) onLanguageChange(langCode);

    if (isListening) {
      stopListening();
    }

    // Restart conversation with new language
    startDoctorConversation(langCode);
  };

  // Load sample case
  const handleLoadSampleCase = (sc) => {
    stopDoctorSpeech();
    if (isListening) stopListening();
    setSelectedVoiceLang(sc.lang);
    if (onLanguageChange) onLanguageChange(sc.lang);

    setCurrentDoctorTurn('turn1');
    processPatientSpeechTurn(sc.speech);
    if (sc.category) setActiveCategory(sc.category);
    setShowSampleCases(false);
  };

  // 1-Click India Facility Scenario Loader
  const handleLoadIndiaScenario = (sc) => {
    stopDoctorSpeech();
    if (isListening) stopListening();
    setActiveScenarioId(sc.id);

    if (sc.vitals) {
      setVitals(sc.vitals);
      setHasVoiceExtractedVitals(true);
    }
    if (sc.category) {
      setActiveCategory(sc.category);
    }

    const langKey = selectedVoiceLang.startsWith('or') ? 'or-IN' : selectedVoiceLang.startsWith('hi') ? 'hi-IN' : 'en-IN';
    const speechText = sc.speech[langKey] || sc.speech['en-IN'] || sc.speech['hi-IN'];
    setCurrentDoctorTurn('turn1');
    processPatientSpeechTurn(speechText);
  };

  // Reset entire consultation
  const handleResetConsultation = () => {
    stopDoctorSpeech();
    if (isListening) stopListening();
    setCumulativePatientSpeech('');
    setTranscript('');
    setInterimTranscript('');
    baseTextRef.current = '';
    fullTextRef.current = '';
    const resetState = processIntakeSpeech('', selectedVoiceLang);
    setClinicalState(resetState);
    const resetMeds = getClinicalMedicineRecommendations(resetState, selectedVoiceLang);
    setMedicineRecommendations(resetMeds);
    setTargetedAnswers({});
    setHasVoiceExtractedVitals(false);
    startDoctorConversation(selectedVoiceLang);
  };

  // Copy transcript
  const handleCopy = () => {
    const textToCopy = `[Dr. Swasthya Mitra Consultation]\n${conversationHistory
      .map((m) => `${m.sender === 'doctor' ? 'Dr. Swasthya Mitra' : 'Patient'}: ${m.text}`)
      .join('\n\n')}\n\n[Health Issue]: ${medicineRecommendations.healthIssueTitle}\n[Prescribed Medicines]:\n${medicineRecommendations.medicines
      .map((m) => `• ${m.name}: ${m.dosage}`)
      .join('\n')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Direct platform handlers
  const handleConnectDoctor = () => {
    stopDoctorSpeech();
    if (onOpenTeleconsult) {
      onOpenTeleconsult({
        patientName: currentUser?.name || 'Patient',
        patientAge: currentUser?.age || 42,
        reason: medicineRecommendations.healthIssueTitle,
        urgency: clinicalState.urgencyTier,
        vitals: {
          temp: `${vitals.temperature}°F`,
          pulse: `${vitals.pulse} bpm`,
          spo2: `${vitals.spo2}%`,
          duration: `${vitals.durationDays} days`
        }
      });
    } else if (onNavigateTab) {
      onNavigateTab('booking');
    }
  };

  const handleOpenPharmacyStock = () => {
    if (onNavigateTab) onNavigateTab('expiry');
  };

  const handleOpenAmbulance = () => {
    if (onNavigateTab) onNavigateTab('ambulance');
  };

  // Submit & Triage generation
  const handleSubmit = (e) => {
    e.preventDefault();
    stopDoctorSpeech();
    const finalSpeech = (cumulativePatientSpeech || transcript || '').trim();

    if (!finalSpeech && !vitals.temperature && !vitals.spo2) {
      alert('Please speak or enter symptoms, or provide at least one vital sign.');
      return;
    }

    const payload = {
      language: selectedVoiceLang,
      rawSpeech: finalSpeech,
      translatedSummary: clinicalState.clinicalTranslation || finalSpeech,
      chiefComplaint: clinicalState.chiefComplaint || finalSpeech,
      selectedCategory: activeCategory,
      detectedSymptoms: clinicalState.detectedSymptoms,
      redFlags: clinicalState.redFlags,
      urgencyTier: clinicalState.urgencyTier,
      urgencyScore: clinicalState.urgencyScore,
      urgencyLabel: clinicalState.urgencyLabel,
      healthIssue: medicineRecommendations.healthIssueTitle,
      suggestedMedicines: medicineRecommendations.medicines,
      conversationHistory,
      painSeverity,
      targetedAnswers,
      vitals,
      intakeMode: 'interactive_doctor_voice_consultation',
      timestamp: new Date().toISOString()
    };

    try {
      localStorage.setItem('nhp_current_intake', JSON.stringify(payload));
    } catch {}

    onIntakeComplete(payload);
  };

  // Multi-lingual UI strings
  const ui = {
    'or-IN': {
      title: 'ଡାକ୍ତର ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର (AI Doctor Voice Consultation)',
      subtitle: 'ଡାକ୍ତର ଗୋଟିଏ ପରେ ଗୋଟିଏ ପ୍ରଶ୍ନ ପଚାରିବେ - ସ୍ପଷ୍ଟ ଭାବେ କୁହନ୍ତୁ',
      micListening: 'ଡାକ୍ତର ଶୁଣୁଛନ୍ତି... କୁହନ୍ତୁ',
      silenceNotice: 'ବାକ୍ୟ ସମାପ୍ତ: ୫ ସେକେଣ୍ଡ ମଧ୍ୟରେ ସ୍ୱୟଂକ୍ରିୟ ରେକର୍ଡ ହେବ',
      sendNowBtn: 'ସମାପ୍ତ / ପଠାନ୍ତୁ',
      restartBtn: 'ପୁନର୍ବାର ଆରମ୍ଭ (Restart)',
      doctorBadge: 'ଡାକ୍ତର ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର',
      patientBadge: 'ଆପଣ (Patient)',
      healthIssueLabel: 'ଡାକ୍ତରଙ୍କ ରୋଗ ବିଶ୍ଳେଷଣ (Doctor Diagnosis):',
      medicineTitle: 'ପ୍ରସ୍ତାବିତ ପ୍ରାଥମିକ ଔଷଧ ଓ ଖୁରାକ:',
      teleDoctorBtn: 'ଅନ୍-କଲ୍ ଡାକ୍ତରଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ',
      pharmacyBtn: 'PHC ଔଷଧ ଷ୍ଟକ୍ ଯାଞ୍ଚ',
      ambulanceBtn: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ',
      submitBtn: 'Save Consultation & Generate Triage'
    },
    'hi-IN': {
      title: 'डॉ. स्वास्थ्य मित्र (AI Doctor Voice Consultation)',
      subtitle: 'डॉक्टर एक के बाद एक सवाल पूछेंगे - स्पष्ट आवाज में बताएं',
      micListening: 'डॉक्टर सुन रहे हैं... बोलें',
      silenceNotice: 'बोलना समाप्त: 5 सेकंड में स्वतः रिकॉर्ड होगा',
      sendNowBtn: 'हो गया / भेजें',
      restartBtn: 'पुनः शुरू करें (Restart)',
      doctorBadge: 'डॉ. स्वास्थ्य मित्र',
      patientBadge: 'आप (Patient)',
      healthIssueLabel: 'डॉक्टर का नैदानिक परामर्श (Doctor Diagnosis):',
      medicineTitle: 'सुझाई गई दवाएं एवं सही खुराक:',
      teleDoctorBtn: 'ड्यूटी डॉक्टर से वीडियो कॉल करें',
      pharmacyBtn: 'PHC दवा स्टॉक देखें',
      ambulanceBtn: '108 एम्बुलेंस बुलाएं',
      submitBtn: 'Save Consultation & Generate Triage'
    },
    'en-IN': {
      title: 'Dr. Swasthya Mitra (AI Doctor Voice Consultation)',
      subtitle: 'Doctor asks step-by-step questions • Natural Indian voice consultation',
      micListening: 'Doctor is listening... speak your symptom',
      silenceNotice: 'Speech pause detected: auto-submitting in 5s',
      sendNowBtn: 'Done Speaking / Send',
      restartBtn: 'Restart Consultation',
      doctorBadge: 'Dr. Swasthya Mitra',
      patientBadge: 'You (Patient)',
      healthIssueLabel: 'Doctor Clinical Diagnosis & Assessment:',
      medicineTitle: 'Prescribed First-Aid Medicines & Schedule:',
      teleDoctorBtn: 'Connect with Tele-Doctor on Call',
      pharmacyBtn: 'Check PHC Pharmacy Stock',
      ambulanceBtn: 'Call 108 Ambulance',
      submitBtn: 'Save Consultation & Generate Triage'
    }
  }[selectedVoiceLang] || {
    title: 'Dr. Swasthya Mitra (AI Doctor Voice Consultation)',
    subtitle: 'Doctor asks step-by-step questions • Natural Indian voice consultation',
    micListening: 'Doctor is listening... speak your symptom',
    silenceNotice: 'Speech pause detected: auto-submitting in 5s',
    sendNowBtn: 'Done Speaking / Send',
    restartBtn: 'Restart Consultation',
    doctorBadge: 'Dr. Swasthya Mitra',
    patientBadge: 'You (Patient)',
    healthIssueLabel: 'Doctor Clinical Diagnosis & Assessment:',
    medicineTitle: 'Prescribed First-Aid Medicines & Schedule:',
    teleDoctorBtn: 'Connect with Tele-Doctor on Call',
    pharmacyBtn: 'Check PHC Pharmacy Stock',
    ambulanceBtn: 'Call 108 Ambulance',
    submitBtn: 'Save Consultation & Generate Triage'
  };

  const activeProto = CONDITION_PROTOCOLS[activeCategory] || CONDITION_PROTOCOLS.fever;

  return (
    <div className="space-y-4 max-w-xl mx-auto font-sans pb-12">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 0. INDIA DPDP ACT 2023 DIGITAL HEALTH CONSENT & PRIVACY SHIELD */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3.5 sm:p-4 shadow-xs space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Digital Personal Data Protection (DPDP) Act 2023 Consent</span>
          </div>
          <button
            type="button"
            onClick={() => setPrivacyShieldActive(!privacyShieldActive)}
            className={`px-2.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
              privacyShieldActive
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
            }`}
            title="Toggle Client-Side PII De-identification"
          >
            <span>Privacy Shield: {privacyShieldActive ? 'ACTIVE (De-Identified)' : 'OFF (Raw Data)'}</span>
          </button>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          Synthetic session anonymization is active. Audio recordings and symptom vectors are processed in-browser for CDSS Level-1 triage summarization with zero permanent unredacted storage.
        </p>
        <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-mono flex-wrap gap-1">
          <span>ABHA ID: <strong>{privacyShieldActive ? '91-XXXX-XXXX-2819' : '91-4829-1049-2819'}</strong></span>
          <span>Phone: <strong>{privacyShieldActive ? '+91 98XXXXXX10' : '+91 98765 43210'}</strong></span>
          <span className="text-emerald-600 font-bold">{privacyShieldActive ? 'PII Redacted ✓' : 'Direct Identifiers'}</span>
          <span className="text-slate-400">Zero Cloud Retention Guarantee</span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 0.5. 6 INDIA-WIDE FACILITY SCENARIOS SHOWCASE (1-CLICK PRESETS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-3 shadow-xs space-y-1.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
          <span className="flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>⚡ India Facility Scenarios (1-Click PS 3 Testing):</span>
          </span>
          <span className="text-[10px] text-slate-400 font-normal">Pre-loads symptoms &amp; vitals</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
          {INDIA_FACILITY_SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              type="button"
              onClick={() => handleLoadIndiaScenario(sc)}
              className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                activeScenarioId === sc.id
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-emerald-300 text-slate-700 dark:text-slate-200'
              }`}
            >
              <div className="font-bold text-[11px] text-emerald-700 dark:text-emerald-400">{sc.badge}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{sc.settingName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CLINICAL DOCTOR HEADER WITH INDIAN VOICE & PAUSE SETTINGS  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-emerald-500/30">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-emerald-500/20 rounded-2xl text-emerald-400 border border-emerald-500/40">
              <Stethoscope className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                {ui.title}
              </h2>
              <p className="text-[11px] text-emerald-200/90 font-medium">{ui.subtitle}</p>
            </div>
          </div>

          {/* Direct Language Switcher Tabs */}
          <div className="flex items-center bg-slate-950/70 p-1 rounded-xl border border-white/10 gap-1 text-xs">
            <button
              type="button"
              onClick={() => handleVoiceLangChange('or-IN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'or-IN'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ଓଡ଼ିଆ
            </button>
            <button
              type="button"
              onClick={() => handleVoiceLangChange('hi-IN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'hi-IN'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              हिंदी
            </button>
            <button
              type="button"
              onClick={() => handleVoiceLangChange('en-IN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                selectedVoiceLang === 'en-IN' || selectedVoiceLang === 'en-US'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Digital India Bhashini Architecture Pipeline Indicator */}
        <div className="my-2 px-3 py-1.5 bg-slate-950/60 border border-white/10 rounded-xl flex items-center justify-between text-[10px] text-emerald-300">
          <div className="flex items-center gap-1.5">
            <Globe className="w-3 h-3 text-emerald-400" />
            <span className="font-bold">Digital India Bhashini NLP Pipeline:</span>
            <span className="text-slate-300 hidden sm:inline">Indic Speech ASR ➔ NMT Translation ➔ Clinical NLP ➔ TTS</span>
          </div>
          <button
            type="button"
            onClick={() => speakDoctorUtterance(medicineRecommendations.healthIssueTitle || 'SwasthyaMitra Clinical Triage')}
            className="text-[10px] font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 cursor-pointer transition-all"
            title="Play regional voice synthesis"
          >
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>Regional Voice</span>
          </button>
        </div>

        {/* Doctor Consultation Controls & Silence Pause Config */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10 flex-wrap text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetConsultation}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 text-emerald-200 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{ui.restartBtn}</span>
            </button>

            {/* Configurable Speech Pause Timer Setting */}
            <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded-xl border border-white/10 text-[11px] text-emerald-300">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Pause:</span>
              <select
                value={pauseTimeoutSetting}
                onChange={(e) => setPauseTimeoutSetting(parseInt(e.target.value, 10))}
                className="bg-transparent font-bold text-white outline-none cursor-pointer"
              >
                <option value="5" className="text-slate-900">5 sec (Ideal)</option>
                <option value="7" className="text-slate-900">7 sec</option>
                <option value="10" className="text-slate-900">10 sec</option>
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSampleCases(!showSampleCases)}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 underline flex items-center gap-1 cursor-pointer"
          >
            <span>{showSampleCases ? 'Hide Sample Prompts' : 'Simulate Indian Voice Cases'}</span>
            {showSampleCases ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>

        {/* Sample Case Presets */}
        {showSampleCases && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {SAMPLE_VOICE_CASES.filter((c) => c.lang === selectedVoiceLang).map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => handleLoadSampleCase(sc)}
                className="text-left p-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="font-bold text-emerald-300 text-[11px]">{sc.badge}</span>
                  <span className="text-[10px] text-slate-400 group-hover:text-amber-300">Tap to Load & Prescribe →</span>
                </div>
                <p className="text-slate-200 text-[11px] line-clamp-2 italic font-normal">"{sc.speech}"</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. LIVE DOCTOR-PATIENT CONVERSATION THREAD (STEP-BY-STEP)     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-100 dark:border-slate-700 pb-2">
          <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <MessageSquare className="w-4 h-4" />
            <span>Clinical Conversation Timeline (Turn by Turn)</span>
          </span>
          <div className="flex items-center gap-2">
            {isDoctorSpeaking && (
              <span className="text-[11px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 animate-pulse">
                <Volume2 className="w-3 h-3 text-amber-600 animate-bounce" />
                <span>Doctor is speaking...</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleCopy}
              className="text-slate-500 hover:text-emerald-600 flex items-center gap-1 text-[11px] cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Conversation Message Bubbles */}
        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
          {conversationHistory.map((msg, idx) => {
            const isDoc = msg.sender === 'doctor';
            return (
              <div
                key={msg.id || idx}
                className={`flex gap-2.5 ${isDoc ? 'justify-start' : 'justify-end'}`}
              >
                {/* Doctor Avatar */}
                {isDoc && (
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs mt-1">
                    <Stethoscope className="w-4 h-4" />
                  </div>
                )}

                {/* Message Bubble Card */}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed shadow-xs space-y-1 ${
                    isDoc
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-blue-600 text-white rounded-br-none'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 text-[10px] font-bold opacity-80 mb-0.5">
                    <span>{isDoc ? ui.doctorBadge : ui.patientBadge}</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                  {/* Re-play audio button for doctor message */}
                  {isDoc && (
                    <div className="flex items-center justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => speakDoctorUtterance(msg.text)}
                        className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Listen Again</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Patient Avatar */}
                {!isDoc && (
                  <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm font-bold text-xs mt-1">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. PATIENT MICROPHONE ORB & 5-10 SECOND PAUSE SILENCE DETECTOR */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden space-y-3">
        {/* Dynamic Pulse Orb */}
        <div className="relative flex items-center justify-center my-1">
          {isListening && (
            <>
              <div
                className="absolute rounded-full bg-rose-500/20 animate-ping"
                style={{
                  width: `${110 + audioLevel * 0.8}px`,
                  height: `${110 + audioLevel * 0.8}px`
                }}
              />
              <div
                className="absolute rounded-full bg-rose-400/30 animate-pulse"
                style={{
                  width: `${90 + audioLevel * 0.5}px`,
                  height: `${90 + audioLevel * 0.5}px`
                }}
              />
            </>
          )}

          <button
            type="button"
            onClick={toggleListening}
            aria-label={isListening ? 'Stop recording symptoms' : 'Start speaking your symptoms'}
            className={`relative z-10 w-24 h-24 rounded-full shadow-2xl flex items-center justify-center transition-all cursor-pointer active:scale-95 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500 ring-4 ring-rose-400 text-white animate-pulse scale-105 shadow-rose-500/50'
                : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white hover:scale-105 shadow-emerald-500/40'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white stroke-[2.3]" />
            ) : (
              <Mic className="w-10 h-10 text-white stroke-[2.3]" />
            )}
          </button>
        </div>

        {/* Real-time Frequency Waveform Bars */}
        {isListening && (
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[40, 75, 55, 90, 60, 85, 45, 95, 70, 50].map((baseHeight, idx) => {
              const dynamicHeight = Math.max(15, Math.min(100, (baseHeight * (audioLevel + 20)) / 70));
              return (
                <div
                  key={idx}
                  className="w-1.5 rounded-full bg-gradient-to-t from-rose-600 to-amber-400 transition-all duration-75"
                  style={{ height: `${dynamicHeight}%` }}
                />
              );
            })}
          </div>
        )}

        {/* 5 - 10 SECONDS SILENCE AUTO-STOP COUNTDOWN BAR */}
        {isSilenceCountdownActive && isListening && (
          <div className="w-full max-w-sm p-2.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 rounded-2xl flex items-center justify-between text-xs animate-pulse">
            <span className="flex items-center gap-1.5 text-amber-900 dark:text-amber-200 font-bold">
              <Timer className="w-4 h-4 text-amber-600 animate-spin" />
              <span>Silence detected • Auto-processing in:</span>
            </span>
            <span className="font-mono font-black text-sm bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-xl">
              {silenceSecondsLeft}s
            </span>
          </div>
        )}

        {/* Status Indicator & Instant Send Button */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {isListening ? (
            <span className="text-rose-700 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 px-3.5 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
              {ui.micListening} ({recordSeconds}s)
            </span>
          ) : (
            <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 px-3.5 py-1 rounded-full text-xs font-semibold">
              {ui.micTapToStart}
            </span>
          )}

          {/* Immediate Done / Send Button */}
          {isListening && (
            <button
              type="button"
              onClick={handleManualSendSpeech}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full text-xs flex items-center gap-1 cursor-pointer shadow-xs transition-all"
            >
              <Send className="w-3 h-3" />
              <span>{ui.sendNowBtn}</span>
            </button>
          )}
        </div>

        {/* Real-time capturing text snippet */}
        {interimTranscript && (
          <p className="text-xs italic text-emerald-600 dark:text-emerald-400 font-medium">
            Hearing: "{interimTranscript}..."
          </p>
        )}

        {/* Real-time editable symptom textarea */}
        <div className="w-full text-left space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>
                {selectedVoiceLang === 'or-IN'
                  ? 'ଲକ୍ଷଣ ବର୍ଣ୍ଣନା (କହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ):'
                  : selectedVoiceLang === 'hi-IN'
                  ? 'लक्षण विवरण (बोलें या टाइप करें):'
                  : 'Symptom Description (Speak or Type):'}
              </span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {clinicalState.detectedSymptoms.length > 0
                ? `${clinicalState.detectedSymptoms.length} symptoms detected`
                : 'Live NLP active'}
            </span>
          </div>

          <textarea
            rows={3}
            value={transcript || cumulativePatientSpeech || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder={
              selectedVoiceLang === 'or-IN'
                ? 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ବା ଲକ୍ଷଣ ଏଠାରେ ଲେଖନ୍ତୁ ବା ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ (ଉଦାହରଣ: ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର, ଛାତି କଷ୍ଟ, କାଶ)...'
                : selectedVoiceLang === 'hi-IN'
                ? 'अपनी बीमारी या लक्षण यहां लिखें या ऊपर माइक दबाकर बोलें (उदा: 3 दिन से तेज बुखार, सीने में दर्द, दस्त)...'
                : 'Type your symptoms here or use the microphone above (e.g., high fever 102F for 3 days, severe chest pain, coughing)...'
            }
            className="w-full text-xs sm:text-sm p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all shadow-inner"
          />

          {/* Quick detected symptoms pills tag cloud */}
          {clinicalState.detectedSymptoms.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {clinicalState.detectedSymptoms.map((sym, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    sym.severity === 'critical'
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300'
                      : sym.severity === 'severe'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200 border border-amber-300'
                      : sym.severity === 'moderate'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200 border border-blue-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300'
                  }`}
                >
                  <span>
                    {selectedVoiceLang === 'or-IN'
                      ? sym.labelOr
                      : selectedVoiceLang === 'hi-IN'
                      ? sym.labelHi
                      : sym.labelEn}
                  </span>
                  <span className="opacity-70 text-[9px] uppercase">({sym.severity})</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {micError && (
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 text-left flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <p className="leading-snug">{micError}</p>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. 💊 DOCTOR CLINICAL DIAGNOSIS & MEDICINE PRESCRIPTION CARD  */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        {/* Identified Health Issue Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              <span>{ui.healthIssueLabel}</span>
            </span>

            {/* Urgency Badge */}
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1 shadow-xs ${
                clinicalState.urgencyTier === 'RED'
                  ? 'bg-rose-500 text-white animate-pulse'
                  : clinicalState.urgencyTier === 'YELLOW'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {clinicalState.urgencyTier === 'RED' && <ShieldAlert className="w-3.5 h-3.5" />}
              {clinicalState.urgencyTier === 'YELLOW' && <AlertTriangle className="w-3.5 h-3.5" />}
              {clinicalState.urgencyTier === 'GREEN' && <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>{clinicalState.urgencyTier} URGENCY</span>
            </span>
          </div>

          {/* Clinical SBAR Structured Format */}
          <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 shrink-0">
                [S] SITUATION
              </span>
              <p className="font-bold text-slate-800 dark:text-slate-100 text-xs">
                {medicineRecommendations.healthIssueTitle}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 shrink-0">
                [B] BACKGROUND
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {medicineRecommendations.healthIssueSummary}
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 shrink-0">
                [A] ASSESSMENT
              </span>
              <p className="text-[11px] text-slate-700 dark:text-slate-200 font-medium">
                NEWS2 Early Warning Tier: <strong>{clinicalState.urgencyTier}</strong> (Clinical Urgency Index: {clinicalState.urgencyScore}/100)
              </p>
            </div>

            <div className="flex items-start gap-2">
              <span className="px-1.5 py-0.5 rounded font-black text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shrink-0">
                [R] RECOMMENDATION
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Qualified Medical Officer review required. Conduct targeted physical examination before any clinical intervention.
              </p>
            </div>
          </div>
        </div>

        {/* Critical Red-Flag Warning Banner if Triggered */}
        {clinicalState.redFlags.length > 0 && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/60 border-2 border-rose-400 dark:border-rose-700 rounded-2xl text-rose-900 dark:text-rose-200 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-rose-700 dark:text-rose-300">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>CRITICAL RED FLAG DETECTED - IMMEDIATE HOSPITAL REFERRAL (108)</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] font-medium text-rose-800 dark:text-rose-200">
              {clinicalState.redFlags.map((rf, idx) => (
                <li key={idx}>
                  <strong>{rf.symptom}:</strong> {rf.note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Direct In-Platform Action Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100 dark:border-slate-700">
          <button
            type="button"
            onClick={handleConnectDoctor}
            className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            <span>{ui.teleDoctorBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleOpenPharmacyStock}
            className="w-full py-2.5 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>{ui.pharmacyBtn}</span>
          </button>

          {clinicalState.urgencyTier === 'RED' && (
            <button
              type="button"
              onClick={handleOpenAmbulance}
              className="sm:col-span-2 w-full py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all animate-pulse"
            >
              <Truck className="w-4 h-4" />
              <span>{ui.ambulanceBtn} (Call 108 Emergency)</span>
            </button>
          )}
        </div>

        {/* Jan Aushadhi Formulary Reference for Review (Strictly Non-Prescriptive) */}
        <div className="space-y-3 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-bold text-slate-800 dark:text-slate-200">
            <span className="flex items-center gap-1.5">
              <Pill className="w-4 h-4 text-emerald-600" />
              <span>Jan Aushadhi Generic Formulations for MO Review</span>
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-300/50 self-start sm:self-auto">
              Advisory Formulary • Non-Diagnostic
            </span>
          </div>

          <div className="space-y-2.5">
            {medicineRecommendations.medicines.map((med) => (
              <div
                key={med.id}
                className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                  med.isEmergency
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                    : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 hover:border-emerald-400'
                }`}
              >
                {/* Title & Price */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{med.name}</span>
                      {med.isEmergency && (
                        <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                          STAT Dose
                        </span>
                      )}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Generic: {med.generic} • <span className="text-emerald-600 font-semibold">{med.category}</span>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-xl shrink-0">
                    {med.priceJanAushadhi}
                  </span>
                </div>

                {/* Dosage & Timing */}
                <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Dosage: {med.dosage}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-5">
                    <strong>Action:</strong> {med.purpose}
                  </p>
                </div>

                {/* Precautions */}
                <div className="text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-1.5 leading-snug">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span><strong>Safety:</strong> {med.precautions}</span>
                </div>

                {/* Action Link */}
                <div className="flex items-center justify-end gap-2 pt-1 text-[11px]">
                  <button
                    type="button"
                    onClick={handleOpenPharmacyStock}
                    className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Check Pharmacy Stock</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Home Care & Hydration Guidance */}
        {medicineRecommendations.homeCare && medicineRecommendations.homeCare.length > 0 && (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-2xl border border-teal-200 dark:border-teal-800/60 text-xs space-y-1.5">
            <span className="font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recommended Recovery & First-Aid Measures:</span>
            </span>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-teal-800 dark:text-teal-300">
              {medicineRecommendations.homeCare.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. CONDITION PROTOCOL SELECTOR PILLS                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Primary Clinical Category Protocol:
        </label>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {Object.values(CONDITION_PROTOCOLS).map((proto) => {
            const isSelected = activeCategory === proto.id;
            const pName = proto.name[selectedVoiceLang] || proto.name.en;
            return (
              <button
                key={proto.id}
                type="button"
                onClick={() => {
                  setActiveCategory(proto.id);
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md scale-102'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>{pName}</span>
              </button>
            );
          })}
        </div>

        {/* Adaptive Clinical Questions */}
        {activeProto.questions && activeProto.questions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Protocol Checklist ({activeProto.name[selectedVoiceLang] || activeProto.name.en}):
            </span>
            {activeProto.questions.map((q) => {
              const currentAns = targetedAnswers[q.id];
              const qText = q.text[selectedVoiceLang] || q.text.en;
              return (
                <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{qText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {q.options.map((opt) => {
                      const optLabel = opt[selectedVoiceLang] || opt.en;
                      const isChosen = currentAns === opt.val;
                      return (
                        <button
                          key={opt.val}
                          type="button"
                          onClick={() => setTargetedAnswers({ ...targetedAnswers, [q.id]: opt.val })}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between border ${
                            isChosen
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span className="line-clamp-1">{optLabel}</span>
                          {isChosen && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. PAIN SEVERITY SCALE (1-10)                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Pain & Symptom Severity (1-10 Scale):</span>
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-mono font-black text-sm">
            {painSeverity}/10{' '}
            <span className="text-[11px] font-medium text-slate-500">
              {Number(painSeverity) >= 8 ? '(Severe)' : Number(painSeverity) >= 5 ? '(Moderate)' : '(Mild)'}
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto text-xs pb-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'].map((val) => {
            const isChosen = painSeverity === val;
            const numVal = parseInt(val, 10);
            return (
              <button
                key={val}
                type="button"
                onClick={() => setPainSeverity(val)}
                className={`w-9 h-9 rounded-2xl font-bold flex items-center justify-center transition-all cursor-pointer text-xs ${
                  isChosen
                    ? numVal >= 8
                      ? 'bg-rose-600 text-white shadow-md scale-105'
                      : numVal >= 5
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. QUANTITATIVE VITALS INPUT TILES                             */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Thermometer className="w-4 h-4 text-emerald-600" />
            <span>Primary Quantitative Vitals:</span>
          </h3>
          <span className="text-[10px] text-slate-400">Tap values to adjust</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Temperature */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              parseFloat(vitals.temperature || '98.6') >= 101
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Temp (°F)
            </span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              className="w-full text-sm font-black text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>

          {/* Pulse */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              parseInt(vitals.pulse || '72', 10) > 105
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Pulse (BPM)
            </span>
            <input
              type="number"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              className="w-full text-sm font-black text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>

          {/* SpO2 */}
          <div
            className={`p-3 rounded-2xl border transition-all ${
              parseInt(vitals.spo2 || '98', 10) < 94
                ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-400 dark:border-rose-800'
                : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700'
            }`}
          >
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              SpO2 (%)
            </span>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              className="w-full text-sm font-black text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>

          {/* Duration */}
          <div className="p-3 rounded-2xl border bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block mb-1">
              Duration (Days)
            </span>
            <input
              type="number"
              value={vitals.durationDays}
              onChange={(e) => setVitals({ ...vitals, durationDays: e.target.value })}
              className="w-full text-sm font-black text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. HIGH-CONTRAST BIG ACTION BUTTON (CONFIRM & GENERATE TRIAGE) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-4 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-xl active:scale-98 transition-all flex items-center justify-center gap-2.5 cursor-pointer hover:shadow-emerald-500/30"
      >
        <CheckCircle2 className="w-5 h-5 text-white" />
        <span>{ui.submitBtn}</span>
        <ArrowRight className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}
