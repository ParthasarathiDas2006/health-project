import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Globe,
  Plus,
  AlertCircle,
  FileText,
  CheckCircle2,
  RefreshCw,
  Trash2
} from 'lucide-react';

/**
 * Multimodal Intake Form
 * Pure localization across Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 * Supports continuous speech accumulation (SpeechRecognition), symptoms chips,
 * and deterministic vital signs capture.
 */
export default function MultimodalIntakeForm({ onIntakeComplete, currentUser, appLang, onLanguageChange }) {
  const [language, setLanguage] = useState(appLang || currentUser?.preferredLanguage || 'or-IN');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Sync internal language with appLang prop whenever it changes
  useEffect(() => {
    if (appLang && appLang !== language) {
      setLanguage(appLang);
    }
  }, [appLang]);

  // Vitals State
  const [vitals, setVitals] = useState({
    temperature: '',
    pulse: '',
    spo2: '',
    systolic: '',
    diastolic: '',
    durationDays: '3',
  });

  // Common quick chips for Indian PHC/Camp settings
  const commonSymptoms = [
    { en: 'High Fever', hi: 'तेज़ बुखार', or: 'ପ୍ରବଳ ଜ୍ୱର' },
    { en: 'Cough with Phlegm', hi: 'बलगम वाली खांसी', or: 'କଫ ସହ କାଶ' },
    { en: 'Shortness of Breath', hi: 'सांस लेने में तकलीफ', or: 'ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ' },
    { en: 'Severe Headache', hi: 'सिर में तेज़ दर्द', or: 'ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା' },
    { en: 'Abdominal Pain', hi: 'पेट में दर्द', or: 'ପେଟ ଯନ୍ତ୍ରଣା' },
    { en: 'Loose Motions / Diarrhea', hi: 'दस्त / उल्टी', or: 'ଝାଡ଼ା / ବାନ୍ତି' },
    { en: 'Chest Heaviness', hi: 'छाती में भारीपन', or: 'ଛାତି ଭାରୀ ଲାଗିବା' },
    { en: 'Dizziness / Vertigo', hi: 'चक्कर आना', or: 'ମୁଣ୍ଡ ବୁଲାଇବା' },
  ];

  // Pure UI Text Dictionary
  const ui = {
    'or-IN': {
      title: 'ରୋଗୀଙ୍କ ବହୁମୁଖୀ ବିବରଣୀ ଫର୍ମ',
      subtitle: 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର, ଜିଲ୍ଲା ଡାକ୍ତରଖାନା ଓ ଶିଳ୍ପାଞ୍ଚଳ କ୍ଲିନିକ୍ ପାଇଁ',
      patientSelf: 'ରୋଗୀ ନିଜେ ଦାଖଲ କରୁଛନ୍ତି:',
      intakeOfficer: 'ତଥ୍ୟ ସଂଗ୍ରହକାରୀ କର୍ମଚାରୀ:',
      chiefComplaints: 'ମୁଖ୍ୟ ଲକ୍ଷଣ ଓ ସମସ୍ୟା',
      listening: 'ମାଇକ୍ ଚାଲୁ ଅଛି... କୁହନ୍ତୁ',
      clear: 'ହଟାନ୍ତୁ',
      speakOrType: 'କୁହନ୍ତୁ କିମ୍ବା ଲେଖନ୍ତୁ',
      placeholder: 'ମାଇକ୍ ଦବାଇ ଓଡ଼ିଆରେ କୁହନ୍ତୁ କିମ୍ବା ଏଠାରେ ଲେଖନ୍ତୁ (ଯେପରି: ୩ ଦିନ ହେବ ପ୍ରବଳ ଜ୍ୱର, ବାନ୍ତି, ଛାତି କଷ୍ଟ...)',
      micStop: 'ରିକର୍ଡିଂ ବନ୍ଦ କରନ୍ତୁ',
      micStart: 'ଭଏସ୍ ଇନପୁଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      quickAdd: 'ଶୀଘ୍ର ଯୋଡ଼ନ୍ତୁ:',
      scribeTitle: 'ପ୍ରମାଣିତ ଇଂରାଜୀ ସାରାଂଶ:',
      vitalsTitle: 'ମୁଖ୍ୟ ଜୀବନ ସୂଚକ ଓ ସମୟ ଅବଧି',
      temp: 'ତାପମାତ୍ରା (°F)',
      pulse: 'ନାଡ଼ି ସ୍ପନ୍ଦନ (BPM)',
      spo2: 'ଅକ୍ସିଜେନ୍ SpO2 (%)',
      systolic: 'ରକ୍ତଚାପ ସିଷ୍ଟୋଲିକ୍',
      diastolic: 'ରକ୍ତଚାପ ଡାୟାଷ୍ଟୋଲିକ୍',
      duration: 'ଅସୁସ୍ଥତା ଅବଧି (ଦିନ)',
      disclaimer: 'ସୁରକ୍ଷା ନିୟମ: ଏହି ପୋର୍ଟାଲ୍ ରୋଗୀଙ୍କ ଲକ୍ଷଣ ସଜାଡ଼ି ଜରୁରୀ ସ୍ତର ଚିହ୍ନଟ କରେ। ଏହା କୌଣସି ଚିକିତ୍ସା କିମ୍ବା ଔଷଧ ନିର୍ଦ୍ଦେଶ ଦିଏ ନାହିଁ। ଚୂଡ଼ାନ୍ତ ନିଷ୍ପତ୍ତି ପଞ୍ଜୀକୃତ ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ନିଆଯାଏ।',
      submitBtn: 'ଲ୍ୟାବ୍ ରିପୋର୍ଟ ଓ ଟ୍ରାଏଜ୍ ନୋଟ୍ ପ୍ରସ୍ତୁତି ପାଇଁ ଆଗକୁ ବଢ଼ନ୍ତୁ',
      alertValidation: 'ଦୟାକରି କିଛି ଲକ୍ଷଣ କିମ୍ବା ଅତି କମରେ ଗୋଟିଏ ଜୀବନ ସୂଚକ ପ୍ରବେଶ କରନ୍ତୁ।'
    },
    'hi-IN': {
      title: 'मरीज बहुआयामी विवरण फॉर्म',
      subtitle: 'प्राथमिक स्वास्थ्य केंद्र, जिला अस्पताल एवं स्वास्थ्य शिविरों हेतु',
      patientSelf: 'मरीज स्वयं विवरण दर्ज कर रहे हैं:',
      intakeOfficer: 'डाटा संग्रहकर्ता स्वास्थ्यकर्मी:',
      chiefComplaints: 'मुख्य लक्षण एवं समस्याएं',
      listening: 'माइक चालू है... बोलें',
      clear: 'हटाएं',
      speakOrType: 'बोलें या टाइप करें',
      placeholder: 'माइक दबाकर बोलें या यहाँ लिखें (जैसे: 3 दिन से तेज़ बुखार, सांस लेने में तकलीफ, उल्टी हो रही है...)',
      micStop: 'रिकॉर्डिंग बंद करें',
      micStart: 'वॉइस इनपुट शुरू करें',
      quickAdd: 'त्वरित जोड़ें:',
      scribeTitle: 'प्रमाणित क्लिनिकल सारांश (English):',
      vitalsTitle: 'मुख्य जीवन सूचक एवं समय-क्रम',
      temp: 'तापमान (°F)',
      pulse: 'नाड़ी दर (BPM)',
      spo2: 'ऑक्सीजन SpO2 (%)',
      systolic: 'रक्तचाप सिस्टोलिक',
      diastolic: 'रक्तचाप डायस्टोलिक',
      duration: 'बीमारी की अवधि (दिन)',
      disclaimer: 'सुरक्षा निर्देश: यह प्रणाली केवल लक्षणों को व्यवस्थित कर तात्कालिकता का स्तर दर्शाती है। यह कोई प्रत्यक्ष निदान या दवा निर्धारित नहीं करती। अंतिम निर्णय उपस्थित चिकित्सक द्वारा लिया जाता है।',
      submitBtn: 'लैब रिपोर्ट एवं ट्रायज नोट के लिए आगे बढ़ें',
      alertValidation: 'कृपया लक्षण अथवा कम से कम एक वाइटल संकेत दर्ज करें।'
    },
    'en-IN': {
      title: 'Patient Multimodal Clinical Intake',
      subtitle: 'For PHCs, Civil Hospitals, Health Camps & Occupational Clinics',
      patientSelf: 'Patient Self-Reporting:',
      intakeOfficer: 'Intake Officer:',
      chiefComplaints: 'Chief Complaints & Symptoms',
      listening: 'Listening... speak now',
      clear: 'Clear',
      speakOrType: 'Speak or Type',
      placeholder: 'Tap the mic or type symptoms (e.g. Fever for 3 days, cough with phlegm, shortness of breath...)',
      micStop: 'Stop Recording',
      micStart: 'Start Voice Input',
      quickAdd: 'Quick add:',
      scribeTitle: 'Normalized Clinical Scribe (English):',
      vitalsTitle: 'Key Vitals & Timeline',
      temp: 'Temp (°F)',
      pulse: 'Pulse (BPM)',
      spo2: 'SpO2 (%)',
      systolic: 'BP Systolic',
      diastolic: 'BP Diastolic',
      duration: 'Duration (Days)',
      disclaimer: 'Triage Non-Diagnostic Notice: This intake organizes symptoms and highlights urgency factors. It does not formulate diagnoses or prescribe medication. Final triage level is determined by the attending clinician.',
      submitBtn: 'Proceed to Lab Report & Triage Note Generation',
      alertValidation: 'Please enter symptoms or at least one vital sign.'
    }
  }[language] || {};

  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const transcriptRef = useRef('');

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Clinical dictionary translator for Indian healthcare complaints (Hindi & Odia)
  const translateClinicalText = (text) => {
    if (!text || !text.trim()) {
      setTranslatedText('');
      return;
    }

    setIsTranslating(true);
    setTimeout(() => {
      if (language === 'en-IN') {
        setTranslatedText(text);
      } else {
        let translated = text;
        const dict = [
          // Odia clinical phrases
          { pattern: /ପ୍ରବଳ ଜ୍ୱର|ଜ୍ବର|ଜ୍ୱର/gi, en: 'high grade fever' },
          { pattern: /ଥଣ୍ଡା ଲାଗିବା|ଥଣ୍ଡା/gi, en: 'chills / rigor' },
          { pattern: /ବାନ୍ତି ହେବା|ବାନ୍ତି/gi, en: 'vomiting' },
          { pattern: /ଝାଡ଼ା|ପେଟ ଖରାପ/gi, en: 'diarrhea / loose watery stools' },
          { pattern: /ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ|ନିଶ୍ୱାସ କଷ୍ଟ/gi, en: 'severe dyspnea / shortness of breath' },
          { pattern: /ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା|ମୁଣ୍ଡ ବିନ୍ଧା|ମୁଣ୍ଡ ଯନ୍ତ୍ରଣା/gi, en: 'severe headache' },
          { pattern: /ଛାତି ଭାରୀ ଲାଗିବା|ଛାତି ଯନ୍ତ୍ରଣା|ଛାତି ବିନ୍ଧା/gi, en: 'chest pain / heaviness' },
          { pattern: /ପେଟ ଯନ୍ତ୍ରଣା|ପେଟ ବିନ୍ଧା/gi, en: 'acute abdominal pain' },
          { pattern: /ମୁଣ୍ଡ ବୁଲାଇବା/gi, en: 'dizziness / vertigo' },
          { pattern: /କଫ ସହ କାଶ|କାଶ|କଫ/gi, en: 'cough with expectoration' },
          { pattern: /ଦେହ ହାତ ବିନ୍ଧା|ଅଣ୍ଟା ବିନ୍ଧା|ଦେହ ଯନ୍ତ୍ରଣା/gi, en: 'generalized body ache / myalgia' },
          { pattern: /ଅତ୍ୟଧିକ ଦୁର୍ବଳତା|ଦୁର୍ବଳ/gi, en: 'severe weakness / asthenia' },
          { pattern: /୩ ଦିନ|୩ଦିନ|3 ଦିନ/gi, en: 'duration 3 days' },
          { pattern: /୨ ଦିନ|୨ଦିନ|2 ଦିନ/gi, en: 'duration 2 days' },
          { pattern: /୪ ଦିନ|୪ଦିନ|4 ଦିନ/gi, en: 'duration 4 days' },
          { pattern: /୫ ଦିନ|୫ଦିନ|5 ଦିନ/gi, en: 'duration 5 days' },
          { pattern: /୧ ସପ୍ତାହ|୧ସପ୍ତାହ/gi, en: 'duration 1 week' },

          // Hindi clinical phrases
          { pattern: /तेज़ बुखार|तेज बुखार|बुखार/gi, en: 'high fever' },
          { pattern: /ठंड लग रही|ठंड/gi, en: 'chills' },
          { pattern: /उल्टी हो रही|उल्टी/gi, en: 'vomiting' },
          { pattern: /दस्त|पेट खराब/gi, en: 'diarrhea / loose motions' },
          { pattern: /सांस लेने में तकलीफ|सांस फूल रही/gi, en: 'shortness of breath (dyspnea)' },
          { pattern: /सिर में तेज़ दर्द|सिर दर्द|सर दर्द/gi, en: 'severe headache' },
          { pattern: /छाती में भारीपन|छाती में दर्द/gi, en: 'chest heaviness / retrosternal pain' },
          { pattern: /पेट में दर्द|पेट दर्द/gi, en: 'abdominal pain' },
          { pattern: /चक्कर आना|चक्कर/gi, en: 'dizziness / syncope' },
          { pattern: /खांसी|बलगम/gi, en: 'cough with phlegm' },
          { pattern: /शरीर में दर्द|बदन दर्द/gi, en: 'generalized body ache' },
          { pattern: /कमजोरी/gi, en: 'severe asthenia / fatigue' },
          { pattern: /3 दिन|तीन दिन/gi, en: 'duration 3 days' },
          { pattern: /2 दिन|दो दिन/gi, en: 'duration 2 days' },
          { pattern: /4 दिन|चार दिन/gi, en: 'duration 4 days' },
          { pattern: /5 दिन|पांच दिन/gi, en: 'duration 5 days' },
          { pattern: /1 हफ्ता|एक हफ्ता/gi, en: 'duration 1 week' }
        ];

        let matched = false;
        dict.forEach(({ pattern, en }) => {
          if (pattern.test(translated)) {
            matched = true;
            translated = translated.replace(pattern, en);
          }
        });

        if (matched) {
          setTranslatedText(`[Normalized Clinical English]: ${translated}`);
        } else {
          setTranslatedText(`[Normalized Clinical English]: Reported symptoms - "${text}"`);
        }
      }
      setIsTranslating(false);
    }, 200);
  };

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;

      recognition.onresult = (event) => {
        let sessionFinal = '';
        let sessionInterim = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            sessionFinal += res[0].transcript + ' ';
          } else {
            sessionInterim += res[0].transcript;
          }
        }

        const currentSpoken = (sessionFinal + sessionInterim).trim();
        const prefix = baseTextRef.current ? baseTextRef.current.trim() + ' ' : '';
        const fullTranscript = (prefix + currentSpoken).trim();

        setTranscript(fullTranscript);
        transcriptRef.current = fullTranscript;

        if (sessionFinal.trim()) {
          translateClinicalText(fullTranscript);
        }
      };

      recognition.onerror = (err) => {
        console.warn('Speech recognition notice:', err.error);
        if (err.error !== 'no-speech') {
          setIsListening(false);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        baseTextRef.current = transcriptRef.current;
        translateClinicalText(transcriptRef.current);
      };

      recognitionRef.current = recognition;
    }
  }, [language]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser. Please use Chrome/Edge or type manually.');
      return;
    }

    if (isListening) {
      try {
        recognitionRef.current?.stop();
      } catch (e) {
        console.error(e);
      }
      setIsListening(false);
      baseTextRef.current = transcriptRef.current;
      translateClinicalText(transcriptRef.current);
    } else {
      baseTextRef.current = transcriptRef.current;
      if (recognitionRef.current) {
        recognitionRef.current.lang = language;
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          try {
            recognitionRef.current.stop();
          } catch {}
          setTimeout(() => {
            try {
              recognitionRef.current.start();
              setIsListening(true);
            } catch (err) {
              console.error(err);
            }
          }, 150);
        }
      }
    }
  };

  const handleClearText = () => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      setIsListening(false);
    }
    setTranscript('');
    setTranslatedText('');
    baseTextRef.current = '';
    transcriptRef.current = '';
  };

  const handleChipClick = (symptom) => {
    const addition =
      language === 'or-IN'
        ? symptom.or
        : language === 'hi-IN'
        ? symptom.hi
        : symptom.en;
    setTranscript((prev) => {
      const updated = prev && prev.trim() ? `${prev.trim()}, ${addition}` : addition;
      transcriptRef.current = updated;
      baseTextRef.current = updated;
      translateClinicalText(updated);
      return updated;
    });
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!transcript && !vitals.temperature && !vitals.spo2) {
      alert(ui.alertValidation);
      return;
    }

    onIntakeComplete({
      language,
      rawSpeech: transcript,
      translatedSummary: translatedText || transcript,
      vitals,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 max-w-2xl mx-auto font-sans">
      <div className="flex justify-between items-center border-b pb-4 mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="text-emerald-600 w-6 h-6" />
            {ui.title}
          </h2>
          <p className="text-xs text-slate-500">
            {ui.subtitle}
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-300">
          <Globe className="w-4 h-4 text-emerald-700" />
          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
          >
            <option value="or-IN">ଓଡ଼ିଆ (Odia)</option>
            <option value="hi-IN">हिन्दी (Hindi)</option>
            <option value="en-IN">English</option>
          </select>
        </div>
      </div>

      {/* Conducting Staff or Patient Self-Intake Attribution */}
      {currentUser && (
        <div
          className={`mb-5 px-3.5 py-2.5 rounded-lg flex items-center justify-between text-xs ${
            currentUser.roleCategory === 'patient'
              ? 'bg-amber-50 border border-amber-200 text-amber-900'
              : 'bg-slate-50 border border-slate-200 text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${
                currentUser.roleCategory === 'patient' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            ></span>
            {currentUser.roleCategory === 'patient' ? (
              <span>
                {ui.patientSelf}{' '}
                <strong className="text-slate-900">{currentUser.name}</strong>
                {currentUser.age && ` (${currentUser.age} yrs, ${currentUser.gender || 'M'})`}
                <span className="ml-1.5 text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded font-mono font-bold">
                  {currentUser.staffId}
                </span>
              </span>
            ) : (
              <span>
                {ui.intakeOfficer} <strong className="text-slate-800">{currentUser.name}</strong>{' '}
                ({currentUser.role.split('/')[0]})
              </span>
            )}
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline font-mono">
            {currentUser.facility?.split(',')[0]}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Voice & Chief Complaints Input Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              {ui.chiefComplaints}
              {isListening && (
                <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  {ui.listening}
                </span>
              )}
            </label>

            <div className="flex items-center gap-2">
              {transcript && (
                <button
                  type="button"
                  onClick={handleClearText}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1 hover:underline"
                  title="Clear all text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {ui.clear}
                </button>
              )}
              <span className="text-xs text-slate-400">{ui.speakOrType}</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => {
                const val = e.target.value;
                setTranscript(val);
                transcriptRef.current = val;
                baseTextRef.current = val;
                translateClinicalText(val);
              }}
              placeholder={ui.placeholder}
              className={`w-full p-3.5 pr-14 text-sm rounded-lg border transition-all outline-none resize-none text-slate-900 ${
                isListening
                  ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                  : 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              }`}
            />

            {/* Mic Toggle Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`absolute right-3 bottom-3 p-3 rounded-full shadow-md transition-all ${
                isListening
                  ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-200 scale-105'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-105'
              }`}
              title={isListening ? ui.micStop : ui.micStart}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Symptoms Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 self-center font-medium">{ui.quickAdd}</span>
            {commonSymptoms.map((sym, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(sym)}
                className="text-xs bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-full text-slate-600 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {language === 'or-IN' ? sym.or : (language === 'hi-IN' ? sym.hi : sym.en)}
              </button>
            ))}
          </div>

          {/* Normalized Clinical Translation Preview */}
          {translatedText && (
            <div className="mt-3.5 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-start gap-2.5 animate-fadeIn">
              <RefreshCw
                className={`w-4 h-4 mt-0.5 text-blue-600 shrink-0 ${
                  isTranslating ? 'animate-spin' : ''
                }`}
              />
              <div className="flex-1">
                <span className="font-bold text-blue-950">{ui.scribeTitle} </span>
                <span className="text-blue-900 font-medium">{translatedText}</span>
              </div>
            </div>
          )}
        </div>

        {/* Basic Vitals Input Grid */}
        <div className="border-t pt-4">
          <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-1.5">
            {ui.vitalsTitle}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.temp}</label>
              <input
                type="number"
                step="0.1"
                placeholder="98.6"
                value={vitals.temperature}
                onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.pulse}</label>
              <input
                type="number"
                placeholder="78"
                value={vitals.pulse}
                onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.spo2}</label>
              <input
                type="number"
                placeholder="98"
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.systolic}</label>
              <input
                type="number"
                placeholder="120"
                value={vitals.systolic}
                onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.diastolic}</label>
              <input
                type="number"
                placeholder="80"
                value={vitals.diastolic}
                onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 font-medium">{ui.duration}</label>
              <input
                type="number"
                value={vitals.durationDays}
                onChange={(e) => setVitals({ ...vitals, durationDays: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Clinical Guardrail Disclaimer */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2.5 text-xs text-amber-800">
          <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 shrink-0" />
          <p>{ui.disclaimer}</p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 text-sm"
        >
          <CheckCircle2 className="w-4 h-4" />
          {ui.submitBtn}
        </button>
      </form>
    </div>
  );
}
