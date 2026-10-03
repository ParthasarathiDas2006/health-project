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
  Sparkles,
  Info,
  Radio
} from 'lucide-react';

/**
 * Condition-Specific Intake Protocols
 * Tailors questions & required vitals based on primary complaint category.
 */
export const CONDITION_PROTOCOLS = {
  fever: {
    id: 'fever',
    icon: Thermometer,
    name: { en: 'Fever', hi: 'बुखार', or: 'ଜ୍ୱର' },
    keywords: ['fever', 'temp', 'temperature', 'chills', 'rigor', 'बुखार', 'तापमान', 'ठंड', 'कंपकंपी', 'ଜ୍ୱର', 'ତାପମାତ୍ରା', 'ଥଣ୍ଡା', 'କମ୍ପ'],
    primaryVitals: ['temperature', 'durationDays'],
    questions: [
      {
        id: 'rigors',
        text: {
          en: 'Are you having chills or severe shivering (rigors)?',
          hi: 'क्या आपको ठंड लगकर कंपकंपी के साथ बुखार आता है?',
          or: 'ଆପଣଙ୍କୁ କଣ ଥଣ୍ଡା ଲାଗି କମ୍ପ ସହିତ ଜ୍ୱର ଆସୁଛି (କମ୍ପ ଜ୍ୱର)?'
        },
        options: [
          { val: 'yes', en: 'Yes, with shivering', hi: 'हाँ, कंपकंपी के साथ', or: 'ହଁ, କମ୍ପ ସହିତ' },
          { val: 'no', en: 'No shivering', hi: 'नहीं, सामान्य बुखार', or: 'ନାହିଁ, ସାଧାରଣ ଜ୍ୱର' }
        ]
      },
      {
        id: 'bleeding',
        text: {
          en: 'Any red spots on skin, nose bleeding, or gum bleeding?',
          hi: 'क्या त्वचा पर लाल चकत्ते, नाक या मसूड़ों से खून आ रहा है?',
          or: 'ଚର୍ମରେ ନାଲି ଦାଗ, ନାକ କିମ୍ବା ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ ହେଉଛି କି?'
        },
        options: [
          { val: 'none', en: 'None', hi: 'कोई नहीं', or: 'କିଛି ନାହିଁ' },
          { val: 'gum_bleed', en: 'Gum bleeding / red spots (Urgent)', hi: 'मसूड़ों से खून / चकत्ते (तत्काल)', or: 'ମାଢ଼ିରୁ ରକ୍ତ / ନାଲି ଦାଗ (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    icon: Wind,
    name: { en: 'Breathing', hi: 'सांस/खांसी', or: 'ନିଶ୍ୱାସ/କାଶ' },
    keywords: ['cough', 'breath', 'shortness of breath', 'phlegm', 'wheezing', 'asthma', 'खांसी', 'सांस', 'दम', 'बलगम', 'କାଶ', 'କଫ', 'ନିଶ୍ୱାସ', 'ଦମ'],
    primaryVitals: ['spo2', 'durationDays'],
    questions: [
      {
        id: 'breath_speech',
        text: {
          en: 'Can the patient speak a full sentence without pausing for breath?',
          hi: 'क्या मरीज बिना सांस फूले एक पूरा वाक्य बोल पा रहे हैं?',
          or: 'ରୋଗୀ ଅଣନିଶ୍ୱାସୀ ନହୋଇ ଗୋଟିଏ ପୂରା ବାକ୍ୟ କହିପାରୁଛନ୍ତି କି?'
        },
        options: [
          { val: 'full_sentences', en: 'Yes, speaks full sentences', hi: 'हाँ, पूरा वाक्य बोल पा रहे हैं', or: 'ହଁ, ପୂରା ବାକ୍ୟ କହିପାରୁଛନ୍ତି' },
          { val: 'broken_words', en: 'No, breathless on single words (Alert)', hi: 'नहीं, एक-एक शब्द में सांस फूल रही है', or: 'ନାହିଁ, କଥା କହିଲା ବେଳେ ଅଣନିଶ୍ୱାସୀ ହେଉଛନ୍ତି' }
        ]
      }
    ]
  },
  chest: {
    id: 'chest',
    icon: HeartPulse,
    name: { en: 'Chest', hi: 'सीने में दर्द', or: 'ଛାତି ଯନ୍ତ୍ରଣା' },
    keywords: ['chest', 'heart', 'heaviness', 'sweat', 'angina', 'छाती', 'सीने', 'दिल', 'पसीना', 'ଛାତି', 'ହୃଦୟ', 'ଝାଳ'],
    primaryVitals: ['pulse', 'durationDays'],
    questions: [
      {
        id: 'chest_spread',
        text: {
          en: 'Does chest pain/pressure spread to left arm, neck, or jaw?',
          hi: 'क्या दर्द बाएं हाथ, गर्दन या जबड़े की तरफ फैल रहा है?',
          or: 'ଯନ୍ତ୍ରଣା ବାମ ହାତ, ବେକ କିମ୍ବା ମୁଖଗହ୍ୱର/ହନୁ ହାଡ଼ ଆଡ଼କୁ ବ୍ୟାପୁଛି କି?'
        },
        options: [
          { val: 'no', en: 'No, localized only', hi: 'नहीं, केवल सीने में', or: 'ନାହିଁ, କେବଳ ଛାତିରେ' },
          { val: 'yes_arm', en: 'Yes, radiates to arm/jaw (High Urgency)', hi: 'हाँ, बाएं हाथ/जबड़े में फैल रहा है', or: 'ହଁ, ବାମ ହାତ/ମାଢ଼ି ଆଡ଼କୁ ବ୍ୟାପୁଛି (ଅତ୍ୟନ୍ତ ଜରୁରୀ)' }
        ]
      }
    ]
  },
  gastro: {
    id: 'gastro',
    icon: Activity,
    name: { en: 'Gastro', hi: 'पेट/दस्त', or: 'ପେଟ/ବାନ୍ତି' },
    keywords: ['abdominal', 'stomach', 'diarrhea', 'motions', 'vomit', 'vomiting', 'loose', 'पेट', 'दस्त', 'उल्टी', 'मरोड़', 'ପେଟ', 'ଝାଡ଼ା', 'ବାନ୍ତି'],
    primaryVitals: ['durationDays'],
    questions: [
      {
        id: 'diarrhea_freq',
        text: {
          en: 'Episodes of loose motions/vomiting in last 12 hours:',
          hi: 'पिछले 12 घंटों में दस्त या उल्टी के दौरों की संख्या:',
          or: 'ଗତ ୧୨ ଘଣ୍ଟାରେ କେତେ ଥର ଝାଡ଼ା କିମ୍ବା ବାନ୍ତି ହୋଇଛି:'
        },
        options: [
          { val: '1_to_3', en: '1 to 3 times (Mild)', hi: '1 से 3 बार (हल्का)', or: '୧ ରୁ ୩ ଥର (ସାମାନ୍ୟ)' },
          { val: 'more_than_6', en: 'More than 6 times (Urgent)', hi: '6 से अधिक बार (तत्काल)', or: '୬ ରୁ ଅଧିକ ଥର (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  neuro: {
    id: 'neuro',
    icon: Stethoscope,
    name: { en: 'Headache', hi: 'सिरदर्द', or: 'ମୁଣ୍ଡବିନ୍ଧା' },
    keywords: ['headache', 'head', 'dizziness', 'vertigo', 'fainting', 'सिरदर्द', 'सिर', 'चक्कर', 'बेहोशी', 'ମୁଣ୍ଡ', 'ବିନ୍ଧା', 'ବୁଲାଇବା', 'ଅଚେତ'],
    primaryVitals: ['durationDays'],
    questions: [
      {
        id: 'headache_type',
        text: {
          en: 'Nature of headache onset:',
          hi: 'सिरदर्द शुरू होने का प्रकार:',
          or: 'ମୁଣ୍ଡବିନ୍ଧା କିପରି ଭାବରେ ଆରମ୍ଭ ହେଲା:'
        },
        options: [
          { val: 'gradual', en: 'Gradual / regular tension', hi: 'धीरे-धीरे शुरू हुआ', or: 'ଧୀରେ ଧୀରେ' },
          { val: 'thunderclap', en: 'Sudden severe "worst headache" (Alert)', hi: 'अचानक तीव्र', or: 'ହଠାତ୍ ପ୍ରଚଣ୍ଡ' }
        ]
      }
    ]
  }
};

const DRAFT_STORAGE_KEY = 'nhp_draft_patient_intake';

export default function MultimodalIntakeForm({ onIntakeComplete, currentUser, appLang, onLanguageChange }) {
  const [language, setLanguage] = useState(appLang || currentUser?.preferredLanguage || 'or-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [micSupported, setMicSupported] = useState(true);
  const [micError, setMicError] = useState(null);
  const [isSavedDraft, setIsSavedDraft] = useState(false);
  const [painSeverity, setPainSeverity] = useState('3');

  // Condition category & adaptive questions state
  const [activeCategory, setActiveCategory] = useState('fever');
  const [targetedAnswers, setTargetedAnswers] = useState({});
  const [showExtraVitals, setShowExtraVitals] = useState(false);

  // Vitals State
  const [vitals, setVitals] = useState({
    temperature: '99.4',
    pulse: '84',
    spo2: '97',
    systolic: '120',
    diastolic: '80',
    durationDays: '2',
  });

  // Keep references for stable event handlers
  const recognitionRef = useRef(null);
  const isListeningRef = useRef(false);
  const baseTextRef = useRef('');
  const fullTextRef = useRef('');
  const translateTimerRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const saveTimerRef = useRef(null);

  // Sync internal language with appLang prop
  useEffect(() => {
    if (appLang && appLang !== language) {
      setLanguage(appLang);
    }
  }, [appLang]);

  // Check Web Speech API support
  useEffect(() => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
    }
  }, []);

  // Restore draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.transcript) {
          setTranscript(parsed.transcript);
          baseTextRef.current = parsed.transcript;
          fullTextRef.current = parsed.transcript;
        }
        if (parsed.translatedText) setTranslatedText(parsed.translatedText);
        if (parsed.activeCategory) setActiveCategory(parsed.activeCategory);
        if (parsed.targetedAnswers) setTargetedAnswers(parsed.targetedAnswers);
        if (parsed.vitals) setVitals((prev) => ({ ...prev, ...parsed.vitals }));
        if (parsed.painSeverity) setPainSeverity(parsed.painSeverity);
        if (parsed.language && !appLang) setLanguage(parsed.language);
        setIsSavedDraft(true);
      }
    } catch (e) {
      console.warn('Could not restore intake draft:', e);
    }
  }, []);

  // Auto-save draft to localStorage debounced
  const persistDraft = useCallback((data) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({
          transcript: data.transcript ?? fullTextRef.current,
          translatedText: data.translatedText ?? translatedText,
          activeCategory: data.activeCategory ?? activeCategory,
          targetedAnswers: data.targetedAnswers ?? targetedAnswers,
          vitals: data.vitals ?? vitals,
          painSeverity: data.painSeverity ?? painSeverity,
          language: data.language ?? language,
          savedAt: new Date().toISOString()
        }));
        setIsSavedDraft(true);
      } catch (e) {
        console.warn('Error saving draft intake:', e);
      }
    }, 400);
  }, [activeCategory, targetedAnswers, vitals, language, translatedText, painSeverity]);

  // Common quick chips for Indian PHC/Camp settings
  const commonSymptoms = [
    { en: 'High Fever', hi: 'तेज़ बुखार', or: 'ପ୍ରବଳ ଜ୍ୱର', category: 'fever' },
    { en: 'Cough with Phlegm', hi: 'बलगम वाली खांसी', or: 'କଫ ସହ କାଶ', category: 'respiratory' },
    { en: 'Shortness of Breath', hi: 'सांस लेने में तकलीफ', or: 'ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ', category: 'respiratory' },
    { en: 'Severe Headache', hi: 'सिर में तेज़ दर्द', or: 'ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା', category: 'neuro' },
    { en: 'Abdominal Pain', hi: 'पेट में दर्द', or: 'ପେଟ ଯନ୍ତ୍ରଣା', category: 'gastro' },
    { en: 'Chest Heaviness', hi: 'छाती में भारीपन', or: 'ଛାତି ଭାରୀ ଲାଗିବା', category: 'chest' }
  ];

  // Pure UI Text Dictionary
  const ui = {
    'or-IN': {
      title: 'AI ଲକ୍ଷଣ ନିରୂପଣ (ଭଏସ୍ ଟ୍ରାଏଜ୍)',
      listening: 'ଶୁଣୁଛି... କୁହନ୍ତୁ',
      listeningLong: 'ମାଇକ୍ ଚାଲୁ ଅଛି... ସ୍ପଷ୍ଟ ଭାବେ କୁହନ୍ତୁ',
      tapToSpeak: 'ଭଏସ୍ ଇନପୁଟ୍ ପାଇଁ ମାଇକ୍ ଚାପନ୍ତୁ',
      placeholder: 'ମାଇକ୍ ଦବାଇ କୁହନ୍ତୁ (ଯେପରି: ୨ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ ଛାତି କଷ୍ଟ...)',
      conditionCategory: 'ମୁଖ୍ୟ ଲକ୍ଷଣ ଚୟନ (Condition)',
      painScale: 'ଯନ୍ତ୍ରଣାର ତୀବ୍ରତା (Severity 1-10):',
      primaryVitals: 'ପ୍ରାଥମିକ ଜୀବନ ସୂଚକ (Primary Vitals)',
      temp: 'ତାପମାତ୍ରା (°F)',
      pulse: 'ନାଡ଼ି (BPM)',
      spo2: 'SpO2 (%)',
      duration: 'ଦିନ (Days)',
      submitBtn: 'Save Intake & Generate Triage',
      alertValidation: 'ଦୟାକରି କିଛି ଲକ୍ଷଣ କିମ୍ବା ଜୀବନ ସୂଚକ ପ୍ରବେଶ କରନ୍ତୁ।'
    },
    'hi-IN': {
      title: 'AI लक्षण जांच (वॉइस ट्रायज)',
      listening: 'सुन रहा है... बोलें',
      listeningLong: 'माइक चालू है... स्पष्ट बोलें',
      tapToSpeak: 'वॉइस इनपुट हेतु माइक दबाएं',
      placeholder: 'माइक दबाकर बोलें (जैसे: 2 दिन से तेज़ बुखार व सीने में दर्द...)',
      conditionCategory: 'लक्षण का प्रकार (Condition)',
      painScale: 'दर्द की तीव्रता (Severity 1-10):',
      primaryVitals: 'प्राथमिक वाइटल्स (Primary Vitals)',
      temp: 'तापमान (°F)',
      pulse: 'पल्स (BPM)',
      spo2: 'SpO2 (%)',
      duration: 'दिन (Days)',
      submitBtn: 'Save Intake & Generate Triage',
      alertValidation: 'कृपया लक्षण अथवा वाइटल संकेत दर्ज करें।'
    },
    'en-IN': {
      title: 'AI Symptom Voice Triage',
      listening: 'Listening... speak now',
      listeningLong: 'Microphone active... speak symptoms',
      tapToSpeak: 'Tap Mic to Start Voice Triage',
      placeholder: 'Speak or type symptoms (e.g. Fever for 2 days, chest heaviness...)',
      conditionCategory: 'Symptom condition',
      painScale: 'Severity of pain? (1-10)',
      primaryVitals: 'Primary Vitals',
      temp: 'Temperature',
      pulse: 'Pulse',
      spo2: 'SpO2 level',
      duration: 'Duration',
      submitBtn: 'Save Intake & Generate Triage',
      alertValidation: 'Please enter symptoms or at least one vital sign.'
    }
  }[language] || {};

  // Compiled dictionary for clinical translation
  const CLINICAL_DICT = useRef([
    { pattern: /ପ୍ରବଳ ଜ୍ୱର|ପ୍ରବଳ ଜ୍ବର|ଜ୍ୱର|ଜ୍ବର/gi, en: 'high fever' },
    { pattern: /ଥଣ୍ଡା ଲାଗିବା|ଥଣ୍ଡା ଲାଗି|ଥଣ୍ଡା/gi, en: 'chills / rigor' },
    { pattern: /ବାନ୍ତି ହେବା|ବାନ୍ତି ହେଉଛି|ବାନ୍ତି/gi, en: 'vomiting' },
    { pattern: /ଝାଡ଼ା|ପେଟ ଖରାପ/gi, en: 'diarrhea / loose motions' },
    { pattern: /ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ|ନିଶ୍ୱାସ କଷ୍ଟ|ଅଣନିଶ୍ୱାସୀ/gi, en: 'shortness of breath' },
    { pattern: /ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା|ମୁଣ୍ଡ ବିନ୍ଧା|ମୁଣ୍ଡ ଯନ୍ତ୍ରଣା/gi, en: 'severe headache' },
    { pattern: /ଛାତି ଭାରୀ ଲାଗିବା|ଛାତି ଭାରୀ|ଛାତି ଯନ୍ତ୍ରଣା|ଛାତି ବିନ୍ଧା/gi, en: 'chest pain / heaviness' },
    { pattern: /ବାମ ହାତ/gi, en: 'radiating to left arm' },
    { pattern: /ଥଣ୍ଡା ଝାଳ/gi, en: 'cold sweating' },
    { pattern: /ପେଟ ଯନ୍ତ୍ରଣା|ପେଟ ବିନ୍ଧା/gi, en: 'abdominal pain' },
    { pattern: /ମୁଣ୍ଡ ବୁଲାଇବା/gi, en: 'dizziness' },
    { pattern: /କଫ ସହ କାଶ|କାଶ|କଫ/gi, en: 'cough with phlegm' },
    { pattern: /୩ ଦିନ|୩ଦିନ|3 ଦିନ/gi, en: 'duration 3 days' },
    { pattern: /୨ ଦିନ|୨ଦିନ|2 ଦିନ/gi, en: 'duration 2 days' },

    { pattern: /तेज़ बुखार|तेज बुखार|बुखार/gi, en: 'high fever' },
    { pattern: /ठंड लग रही|ठंड/gi, en: 'chills' },
    { pattern: /उल्टी हो रही|उल्टी/gi, en: 'vomiting' },
    { pattern: /दस्त/gi, en: 'diarrhea' },
    { pattern: /सांस लेने में तकलीफ|सांस फूल रही/gi, en: 'shortness of breath' },
    { pattern: /सिर में तेज़ दर्द|सिर दर्द/gi, en: 'severe headache' },
    { pattern: /छाती में भारीपन|छाती में दर्द|सीने में दर्द/gi, en: 'chest heaviness' },
    { pattern: /3 दिन|तीन दिन/gi, en: 'duration 3 days' },
    { pattern: /2 दिन|दो दिन/gi, en: 'duration 2 days' }
  ]).current;

  // Auto-detect condition category from speech/text keywords
  const autoDetectCategory = useCallback((text) => {
    if (!text) return;
    const lower = text.toLowerCase();
    for (const [catId, proto] of Object.entries(CONDITION_PROTOCOLS)) {
      if (proto.keywords && proto.keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
        setActiveCategory(catId);
        break;
      }
    }
  }, []);

  // Clean debounced clinical translator
  const translateClinicalText = useCallback((text) => {
    if (translateTimerRef.current) {
      clearTimeout(translateTimerRef.current);
    }

    if (!text || !text.trim()) {
      setTranslatedText('');
      setIsTranslating(false);
      return;
    }

    setIsTranslating(true);
    translateTimerRef.current = setTimeout(() => {
      let finalTrans = text;
      if (language === 'en-IN') {
        finalTrans = text;
      } else {
        let translated = text;
        let matched = false;
        CLINICAL_DICT.forEach(({ pattern, en }) => {
          if (pattern.test(translated)) {
            matched = true;
            translated = translated.replace(pattern, en);
          }
        });

        if (matched) {
          finalTrans = `${translated}`;
        } else {
          finalTrans = `Reported: ${text}`;
        }
      }
      setTranslatedText(finalTrans);
      setIsTranslating(false);
      autoDetectCategory(text);
      persistDraft({ transcript: text, translatedText: finalTrans });
    }, 250);
  }, [language, autoDetectCategory, persistDraft]);

  // Speech Recognition Initializer & Auto-Restart Keep-Alive
  const startSpeechRecognition = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicSupported(false);
      setMicError('Speech recognition is not supported in this browser.');
      return;
    }

    setMicError(null);
    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }

      const recognition = new SpeechRec();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        isListeningRef.current = true;
        setMicError(null);
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
          const newBase = (baseTextRef.current ? baseTextRef.current.trim() + ' ' : '') + finalChunk.trim();
          baseTextRef.current = newBase;
          fullTextRef.current = newBase;
          setTranscript(newBase);
          setInterimTranscript('');
          translateClinicalText(newBase);
        } else {
          setInterimTranscript(interim);
          const combined = (baseTextRef.current ? baseTextRef.current.trim() + ' ' : '') + interim;
          fullTextRef.current = combined;
        }
      };

      recognition.onerror = (err) => {
        if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setMicError('Microphone permission denied. Tap sample buttons or type.');
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
          const finalText = baseTextRef.current.trim();
          setTranscript(finalText);
          fullTextRef.current = finalText;
          translateClinicalText(finalText);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      isListeningRef.current = true;

      setRecordSeconds(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);

    } catch (e) {
      setIsListening(false);
      isListeningRef.current = false;
      setMicError('Could not start microphone.');
    }
  };

  const stopSpeechRecognition = () => {
    isListeningRef.current = false;
    setIsListening(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setInterimTranscript('');
    const finalVal = (baseTextRef.current || transcript).trim();
    setTranscript(finalVal);
    fullTextRef.current = finalVal;
    translateClinicalText(finalVal);
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  useEffect(() => {
    return () => {
      isListeningRef.current = false;
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (translateTimerRef.current) clearTimeout(translateTimerRef.current);
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const handleSelectSeverity = (val) => {
    setPainSeverity(val);
    persistDraft({ painSeverity: val });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalSpeech = (transcript || fullTextRef.current || '').trim();

    if (!finalSpeech && !vitals.temperature && !vitals.spo2) {
      alert(ui.alertValidation);
      return;
    }

    const payload = {
      language,
      rawSpeech: finalSpeech,
      translatedSummary: translatedText || finalSpeech,
      selectedCategory: activeCategory,
      painSeverity,
      targetedAnswers,
      vitals,
      intakeMode: 'native_mobile_voice_triage',
      timestamp: new Date().toISOString(),
    };

    try {
      localStorage.setItem('nhp_current_intake', JSON.stringify(payload));
    } catch {}

    onIntakeComplete(payload);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto font-sans">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. GLOWING PULSING MICROPHONE ORB (MATCHING MOCKUP SLIDE 2)   */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative pt-2 pb-4 flex flex-col items-center justify-center text-center">
        {/* Animated Background Glow Waves */}
        <div className="relative flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-40 h-40 rounded-full bg-emerald-400/20 animate-ping" />
              <div className="absolute w-32 h-32 rounded-full bg-emerald-400/30 animate-pulse" />
              <div className="absolute w-28 h-28 rounded-full bg-teal-300/40" />
            </>
          )}

          {/* Central Mic Orb Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`relative z-10 w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-all cursor-pointer active:scale-90 ${
              isListening
                ? 'bg-gradient-to-tr from-rose-500 to-red-600 ring-4 ring-rose-300 text-white animate-pulse scale-105'
                : 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 text-white hover:scale-105 shadow-emerald-500/30'
            }`}
          >
            {isListening ? (
              <MicOff className="w-9 h-9 text-white stroke-[2.2]" />
            ) : (
              <Mic className="w-9 h-9 text-white stroke-[2.2]" />
            )}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mt-3 flex items-center gap-1.5 text-xs font-bold">
          {isListening ? (
            <span className="text-rose-600 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full animate-pulse flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              {ui.listening} ({recordSeconds}s)
            </span>
          ) : (
            <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {ui.tapToSpeak}
            </span>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. LIVE SPEECH BUBBLE CARD (ODIA + ENGLISH TRANSLATION)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-2">
        <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
          <span className="flex items-center gap-1">
            <Radio className="w-3.5 h-3.5" />
            <span>{isListening ? 'ଶୁଣୁଛି (Live Capturing)...' : 'Recorded Speech:'}</span>
          </span>
          {transcript && (
            <button
              type="button"
              onClick={() => {
                setTranscript('');
                setTranslatedText('');
                baseTextRef.current = '';
                fullTextRef.current = '';
              }}
              className="text-rose-600 text-[10px] hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="min-h-[50px] text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
          {transcript || interimTranscript ? (
            <span>{transcript} <span className="text-emerald-600 italic">{interimTranscript}</span></span>
          ) : (
            <span className="text-slate-400 font-normal">{ui.placeholder}</span>
          )}
        </div>

        {/* English Clinical Translation */}
        {translatedText && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-xs text-blue-900 dark:text-blue-300 font-medium leading-snug">
            <span className="font-bold text-blue-950 dark:text-blue-200">[English Translation]: </span>
            {translatedText}
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. SYMPTOM CONDITION SELECTOR PILLS (SLIDE 2 MATCH)           */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          {ui.conditionCategory}
        </label>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {Object.values(CONDITION_PROTOCOLS).map((proto) => {
            const isSelected = activeCategory === proto.id;
            const pName = proto.name[language] || proto.name.en;
            return (
              <button
                key={proto.id}
                type="button"
                onClick={() => {
                  setActiveCategory(proto.id);
                  persistDraft({ activeCategory: proto.id });
                }}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  isSelected
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600'
                }`}
              >
                {pName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. SEVERITY OF PAIN / SYMPTOM SCALE (1-10 PILLS)              */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
          <span>{ui.painScale}</span>
          <span className="text-emerald-700 font-mono font-black">{painSeverity}/10</span>
        </div>
        <div className="flex items-center justify-between gap-1 overflow-x-auto text-xs pb-1">
          {['1', '2', '3', '4-5', '6', '7', '8', '9-10'].map((val) => {
            const isChosen = painSeverity === val;
            return (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectSeverity(val)}
                className={`w-9 h-9 rounded-full font-bold flex items-center justify-center transition-all cursor-pointer text-xs ${
                  isChosen
                    ? 'bg-[#1e3a8a] text-white shadow-xs'
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
      {/* 5. PRIMARY VITALS TOUCH INPUT CARDS (MATCHING SLIDE 2)        */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-3.5 border border-slate-200/90 dark:border-slate-700 shadow-xs space-y-2.5">
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {ui.primaryVitals}
        </h3>

        <div className="grid grid-cols-3 gap-2">
          {/* Temperature */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">{ui.temp}</span>
            <input
              type="number"
              step="0.1"
              value={vitals.temperature}
              onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
              className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>

          {/* Pulse */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">{ui.pulse}</span>
            <input
              type="number"
              value={vitals.pulse}
              onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
              className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>

          {/* SpO2 */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">{ui.spo2}</span>
            <input
              type="number"
              value={vitals.spo2}
              onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
              className="w-full text-xs font-bold text-slate-900 dark:text-white bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. STICKY FULL-WIDTH GREEN ACTION BUTTON                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <CheckCircle2 className="w-4 h-4" />
        <span>{ui.submitBtn}</span>
      </button>
    </div>
  );
}
