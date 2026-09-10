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
  Trash2,
  Thermometer,
  Wind,
  HeartPulse,
  Stethoscope,
  Activity,
  ChevronDown,
  ChevronUp,
  HelpCircle
} from 'lucide-react';

/**
 * Condition-Specific Intake Protocols
 * Tailors questions & required vitals based on primary complaint category.
 */
export const CONDITION_PROTOCOLS = {
  fever: {
    id: 'fever',
    icon: Thermometer,
    name: { en: 'Fever & Infection', hi: 'बुखार एवं संक्रमण', or: 'ଜ୍ୱର ଓ ସଂକ୍ରମଣ' },
    keywords: ['fever', 'temp', 'temperature', 'बुखार', 'तापमान', 'ଜ୍ୱର', 'ତାପମାତ୍ରା'],
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
      },
      {
        id: 'hydration',
        text: {
          en: 'Able to drink water/ORS and passing urine normally?',
          hi: 'क्या पानी/ओआरएस पी पा रहे हैं और पेशाब सामान्य हो रहा है?',
          or: 'ପାଣି/ଓଆରଏସ୍ ପିଇପାରୁଛନ୍ତି ଓ ପରିସ୍ରା ସ୍ୱାଭାବିକ ଭାବେ ହେଉଛି କି?'
        },
        options: [
          { val: 'good', en: 'Drinking well & normal urine', hi: 'सामान्य रूप से पी रहे हैं', or: 'ସ୍ୱାଭାବିକ ପିଉଛନ୍ତି ଓ ପରିସ୍ରା ହେଉଛି' },
          { val: 'poor', en: 'Poor intake / dark decreased urine', hi: 'कम पानी / गहरा पेशाब', or: 'କମ ପାଣି ପିଉଛନ୍ତି / କମ ପରିସ୍ରା' }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    icon: Wind,
    name: { en: 'Cough & Breathing', hi: 'खांसी एवं सांस', or: 'କାଶ ଓ ନିଶ୍ୱାସ' },
    keywords: ['cough', 'breath', 'shortness of breath', 'phlegm', 'wheezing', 'खांसी', 'सांस', 'दम', 'କାଶ', 'କଫ', 'ନିଶ୍ୱାସ'],
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
      },
      {
        id: 'cough_type',
        text: {
          en: 'Type of cough and phlegm color:',
          hi: 'खांसी का प्रकार एवं बलगम का रंग:',
          or: 'କାଶର ପ୍ରକାର ଓ କଫର ରଙ୍ଗ:'
        },
        options: [
          { val: 'dry', en: 'Dry irritating cough', hi: 'सूखी खांसी', or: 'ଶୁଖିଲା କାଶ' },
          { val: 'yellow_phlegm', en: 'Thick yellow/green phlegm', hi: 'गाढ़ा पीला/हरा बलगम', or: 'ହଳଦିଆ/ଶାଗୁଆ କଫ' },
          { val: 'blood_stained', en: 'Blood traces in phlegm (Urgent)', hi: 'बलगम में खून (तत्काल)', or: 'କଫରେ ରକ୍ତ ଛିଟା (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  chest: {
    id: 'chest',
    icon: HeartPulse,
    name: { en: 'Chest Pain / Heart', hi: 'छाती में दर्द / हृदय', or: 'ଛାତି ଯନ୍ତ୍ରଣା / ହୃଦୟ' },
    keywords: ['chest', 'heart', 'heaviness', 'छाती', 'सीने', 'ଛାତି'],
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
      },
      {
        id: 'cold_sweat',
        text: {
          en: 'Accompanied by cold sweating, dizziness, or nausea?',
          hi: 'क्या साथ में ठंडा पसीना, घबराहट या चक्कर आ रहे हैं?',
          or: 'ସାଙ୍ଗରେ ଥଣ୍ଡା ଝାଳ ବୋହିବା, ଛାତି ଧଡ଼ପଡ଼ ବା ମୁଣ୍ଡ ବୁଲାଇବା ହେଉଛି କି?'
        },
        options: [
          { val: 'no', en: 'No cold sweating', hi: 'नहीं', or: 'ନାହିଁ' },
          { val: 'sweating', en: 'Yes, cold sweating & dizziness (Alert)', hi: 'हाँ, ठंडा पसीना व घबराहट', or: 'ହଁ, ଥଣ୍ଡା ଝାଳ ଓ ମୁଣ୍ଡ ବୁଲାଇବା (ସତର୍କ)' }
        ]
      }
    ]
  },
  gastro: {
    id: 'gastro',
    icon: Activity,
    name: { en: 'Stomach & Vomiting', hi: 'पेट दर्द एवं दस्त', or: 'ପେଟ ଓ ଝାଡ଼ା/ବାନ୍ତି' },
    keywords: ['abdominal', 'stomach', 'diarrhea', 'motions', 'vomit', 'vomiting', 'पेट', 'दस्त', 'उल्टी', 'ପେଟ', 'ଝାଡ଼ା', 'ବାନ୍ତି'],
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
          { val: '4_to_6', en: '4 to 6 times (Moderate)', hi: '4 से 6 बार (मध्यम)', or: '୪ ରୁ ୬ ଥର (ମଧ୍ୟମ)' },
          { val: 'more_than_6', en: 'More than 6 times / watery rice stool (Urgent)', hi: '6 से अधिक बार / चावल के पानी जैसा दस्त (तत्काल)', or: '୬ ରୁ ଅଧିକ ଥର / ଚାଉଳ ଧୁଆ ପାଣି ପରି ଝାଡ଼ା (ଜରୁରୀ)' }
        ]
      },
      {
        id: 'blood_stool',
        text: {
          en: 'Any blood in stool or black colored stool?',
          hi: 'क्या मल में खून या काला मल आ रहा है?',
          or: 'ଝାଡ଼ାରେ ରକ୍ତ କିମ୍ବା କଳା ଝାଡ଼ା ହେଉଛି କି?'
        },
        options: [
          { val: 'no', en: 'No blood', hi: 'नहीं', or: 'ନାହିଁ' },
          { val: 'yes_blood', en: 'Yes, visible blood or black stool', hi: 'हाँ, मल में खून या काला रंग', or: 'ହଁ, ରକ୍ତ କିମ୍ବା କଳା ଝାଡ଼ା' }
        ]
      }
    ]
  },
  neuro: {
    id: 'neuro',
    icon: Stethoscope,
    name: { en: 'Headache & Neuro', hi: 'सिरदर्द एवं चक्कर', or: 'ମୁଣ୍ଡବିନ୍ଧା ଓ ଚକ୍କର' },
    keywords: ['headache', 'head', 'dizziness', 'vertigo', 'सिरदर्द', 'सिर', 'चक्कर', 'ମୁଣ୍ଡ', 'ବିନ୍ଧା', 'ବୁଲାଇବା'],
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
          { val: 'gradual', en: 'Gradual / regular tension', hi: 'धीरे-धीरे शुरू हुआ', or: 'ଧୀରେ ଧୀରେ ଆରମ୍ଭ ହୋଇଛି' },
          { val: 'thunderclap', en: 'Sudden severe "worst headache of life" (Red Flag)', hi: 'अचानक तीव्र "जीवन का सबसे तेज सिरदर्द"', or: 'ହଠାତ୍ ପ୍ରଚଣ୍ଡ ମୁଣ୍ଡବିନ୍ଧା (ବିପଦ ସଙ୍କେତ)' }
        ]
      },
      {
        id: 'neck_stiffness',
        text: {
          en: 'Any stiffness in neck or discomfort looking at bright lights?',
          hi: 'क्या गर्दन में अकड़न या रोशनी से आंखों में दर्द हो रहा है?',
          or: 'ବେକ ଟାଣ ଲାଗିବା କିମ୍ବା ଆଲୁଅକୁ ଚାହିଁଲେ କଷ୍ଟ ହେଉଛି କି?'
        },
        options: [
          { val: 'no', en: 'No neck stiffness', hi: 'नहीं', or: 'ନାହିଁ' },
          { val: 'stiff', en: 'Yes, neck stiffness with fever (Urgent)', hi: 'हाँ, गर्दन अकड़न व बुखार (तत्काल)', or: 'ହଁ, ବେକ ଟାଣ ଓ ଜ୍ୱର (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  general: {
    id: 'general',
    icon: FileText,
    name: { en: 'General / Other', hi: 'अन्य सामान्य लक्षण', or: 'ଅନ୍ୟାନ୍ୟ ସାଧାରଣ ଲକ୍ଷଣ' },
    keywords: [],
    primaryVitals: ['durationDays'],
    questions: [
      {
        id: 'daily_activity',
        text: {
          en: 'How is this illness affecting your daily activities?',
          hi: 'यह बीमारी आपकी दैनिक गतिविधियों को कैसे प्रभावित कर रही है?',
          or: 'ଏହି ଅସୁସ୍ଥତା ଆପଣଙ୍କ ଦୈନନ୍ଦିନ କାର୍ଯ୍ୟକୁ କିପରି ପ୍ରଭାବିତ କରୁଛି:'
        },
        options: [
          { val: 'mild', en: 'Mild, able to do routine work', hi: 'हल्का, सामान्य काम कर पा रहे हैं', or: 'ସାମାନ୍ୟ, ସାଧାରଣ କାମ କରିପାରୁଛନ୍ତି' },
          { val: 'bedridden', en: 'Severe weakness, unable to get out of bed', hi: 'गंभीर कमजोरी, बिस्तर से उठना कठिन', or: 'ଅତ୍ୟଧିକ ଦୁର୍ବଳତା, ଶଯ୍ୟାଶାୟୀ' }
        ]
      }
    ]
  }
};

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

  // Condition category & adaptive questions state
  const [activeCategory, setActiveCategory] = useState('fever');
  const [targetedAnswers, setTargetedAnswers] = useState({});
  const [showExtraVitals, setShowExtraVitals] = useState(false);

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
    { en: 'High Fever', hi: 'तेज़ बुखार', or: 'ପ୍ରବଳ ଜ୍ୱର', category: 'fever' },
    { en: 'Cough with Phlegm', hi: 'बलगम वाली खांसी', or: 'କଫ ସହ କାଶ', category: 'respiratory' },
    { en: 'Shortness of Breath', hi: 'सांस लेने में तकलीफ', or: 'ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ', category: 'respiratory' },
    { en: 'Severe Headache', hi: 'सिर में तेज़ दर्द', or: 'ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା', category: 'neuro' },
    { en: 'Abdominal Pain', hi: 'पेट में दर्द', or: 'ପେଟ ଯନ୍ତ୍ରଣା', category: 'gastro' },
    { en: 'Loose Motions / Diarrhea', hi: 'दस्त / उल्टी', or: 'ଝାଡ଼ା / ବାନ୍ତି', category: 'gastro' },
    { en: 'Chest Heaviness', hi: 'छाती में भारीपन', or: 'ଛାତି ଭାରୀ ଲାଗିବା', category: 'chest' },
    { en: 'Dizziness / Vertigo', hi: 'चक्कर आना', or: 'ମୁଣ୍ଡ ବୁଲାଇବା', category: 'neuro' },
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
      categorySelect: 'ମୁଖ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ଚୟନ କରନ୍ତୁ:',
      targetedTitle: 'ସମ୍ବନ୍ଧିତ ପ୍ରାଥମିକ ପ୍ରଶ୍ନାବଳୀ (ଡାକ୍ତରୀ ଆକଳନ)',
      vitalsTitle: 'ଆବଶ୍ୟକ ଜୀବନ ସୂଚକ',
      extraVitalsToggleOpen: '+ ଅତିରିକ୍ତ ଯାଞ୍ଚ ଯୋଡ଼ନ୍ତୁ (ରକ୍ତଚାପ / ଅମ୍ଳଜାନ SpO2 / ନାଡ଼ି)',
      extraVitalsToggleClose: '- ଅତିରିକ୍ତ ଯାଞ୍ଚ ଲୁଚାନ୍ତୁ',
      optionalNotice: 'ଯଦି ଘରେ ବ୍ଲଡପ୍ରେସର କିମ୍ବା ପଲ୍ସ ଅକ୍ସିମିଟର ଥାଏ, ତେବେ ଲେଖନ୍ତୁ (ବାଧ୍ୟତାମୂଳକ ନୁହେଁ)',
      scribeTitle: 'ପ୍ରମାଣିତ ଇଂରାଜୀ ସାରାଂଶ:',
      temp: 'ତାପମାତ୍ରା (°F)',
      pulse: 'ନାଡ଼ି ସ୍ପନ୍ଦନ (BPM)',
      spo2: 'ଅକ୍ସିଜେନ୍ SpO2 (%)',
      systolic: 'ରକ୍ତଚାପ ସିଷ୍ଟୋଲିକ୍ (SBP)',
      diastolic: 'ରକ୍ତଚାପ ଡାୟାଷ୍ଟୋଲିକ୍ (DBP)',
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
      categorySelect: 'मुख्य स्वास्थ्य समस्या चुनें:',
      targetedTitle: 'संबंधित प्राथमिक प्रश्न (क्लिनिकल मूल्यांकन)',
      vitalsTitle: 'प्राथमिक आवश्यक वाइटल्स',
      extraVitalsToggleOpen: '+ अतिरिक्त जांच दर्ज करें (ब्लड प्रेशर / SpO2 / पल्स)',
      extraVitalsToggleClose: '- अतिरिक्त जांच छिपाएं',
      optionalNotice: 'यदि घर पर बीपी मशीन या पल्स ऑक्सीमीटर है तो दर्ज करें (अनिवार्य नहीं)',
      scribeTitle: 'प्रमाणित क्लिनिकल सारांश (English):',
      temp: 'तापमान (°F)',
      pulse: 'नाड़ी दर (BPM)',
      spo2: 'ऑक्सीजन SpO2 (%)',
      systolic: 'रक्तचाप सिस्टोलिक (SBP)',
      diastolic: 'रक्तचाप डायस्टोलिक (DBP)',
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
      categorySelect: 'Select Primary Condition:',
      targetedTitle: 'Focused Clinical Inquiries',
      vitalsTitle: 'Primary Required Vitals',
      extraVitalsToggleOpen: '+ Add Home Device Vitals (BP / SpO2 / Pulse)',
      extraVitalsToggleClose: '- Hide Optional Home Vitals',
      optionalNotice: 'Optional: Enter home BP or Pulse Oximeter readings if available',
      scribeTitle: 'Normalized Clinical Scribe (English):',
      temp: 'Temp (°F)',
      pulse: 'Pulse (BPM)',
      spo2: 'SpO2 (%)',
      systolic: 'BP Systolic (SBP)',
      diastolic: 'BP Diastolic (DBP)',
      duration: 'Duration (Days)',
      disclaimer: 'Triage Non-Diagnostic Notice: This intake organizes symptoms and highlights urgency factors. It does not formulate diagnoses or prescribe medication. Final triage level is determined by the attending clinician.',
      submitBtn: 'Proceed to Lab Report & Triage Note Generation',
      alertValidation: 'Please enter symptoms or at least one vital sign.'
    }
  }[language] || {};

  const recognitionRef = useRef(null);
  const baseTextRef = useRef('');
  const transcriptRef = useRef('');
  const translateTimerRef = useRef(null);

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  // Compiled dictionary for clinical translation (cached statically)
  const CLINICAL_DICT = useRef([
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
  ]).current;

  // Clean debounced clinical translator
  const translateClinicalText = (text) => {
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
      if (language === 'en-IN') {
        setTranslatedText(text);
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
          setTranslatedText(`[Normalized Clinical English]: ${translated}`);
        } else {
          setTranslatedText(`[Normalized Clinical English]: Reported symptoms - "${text}"`);
        }
      }
      setIsTranslating(false);
    }, 350);
  };

  // Initialize Web Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition = null;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();
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

    return () => {
      if (translateTimerRef.current) {
        clearTimeout(translateTimerRef.current);
      }
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
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
    if (symptom.category && CONDITION_PROTOCOLS[symptom.category]) {
      setActiveCategory(symptom.category);
    }
    setTranscript((prev) => {
      const updated = prev && prev.trim() ? `${prev.trim()}, ${addition}` : addition;
      transcriptRef.current = updated;
      baseTextRef.current = updated;
      translateClinicalText(updated);
      return updated;
    });
  };

  const handleSelectAnswer = (questionId, optionValue) => {
    setTargetedAnswers((prev) => ({
      ...prev,
      [questionId]: optionValue
    }));
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
    const hasAnyTargeted = Object.keys(targetedAnswers).length > 0;
    if (!transcript && !vitals.temperature && !vitals.spo2 && !hasAnyTargeted) {
      alert(ui.alertValidation);
      return;
    }

    onIntakeComplete({
      language,
      rawSpeech: transcript,
      translatedSummary: translatedText || transcript,
      selectedCategory: activeCategory,
      targetedAnswers,
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

        {/* 1. Condition Selector Tabs */}
        <div className="border-t pt-4">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            {ui.categorySelect}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.values(CONDITION_PROTOCOLS).map((proto) => {
              const IconComponent = proto.icon;
              const isSelected = activeCategory === proto.id;
              const protoName = language === 'or-IN' ? proto.name.or : (language === 'hi-IN' ? proto.name.hi : proto.name.en);
              return (
                <button
                  key={proto.id}
                  type="button"
                  onClick={() => {
                    setActiveCategory(proto.id);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-semibold transition-all text-left ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-700' : 'text-slate-500'}`} />
                  <span className="truncate">{protoName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Targeted Clinical Questions (Adaptive for Selected Condition) */}
        {CONDITION_PROTOCOLS[activeCategory]?.questions?.length > 0 && (
          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200/80 space-y-3.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>{ui.targetedTitle}</span>
            </div>

            <div className="space-y-3">
              {CONDITION_PROTOCOLS[activeCategory].questions.map((q) => {
                const questionText = language === 'or-IN' ? q.text.or : (language === 'hi-IN' ? q.text.hi : q.text.en);
                const currentAnswer = targetedAnswers[q.id];

                return (
                  <div key={q.id} className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
                    <p className="text-xs font-semibold text-slate-800 mb-2">{questionText}</p>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const optLabel = language === 'or-IN' ? opt.or : (language === 'hi-IN' ? opt.hi : opt.en);
                        const isChosen = currentAnswer === opt.val;
                        const isAlert = opt.val.includes('bleed') || opt.val.includes('broken') || opt.val.includes('arm') || opt.val.includes('more_than_6') || opt.val.includes('thunderclap') || opt.val.includes('stiff') || opt.val.includes('bedridden');

                        return (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, opt.val)}
                            className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 font-medium ${
                              isChosen
                                ? (isAlert
                                    ? 'bg-rose-50 border-rose-500 text-rose-800 font-bold ring-1 ring-rose-400'
                                    : 'bg-emerald-600 border-emerald-600 text-white font-semibold shadow-xs')
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isChosen ? (isAlert ? 'bg-rose-500' : 'bg-white') : 'bg-slate-300'}`} />
                            {optLabel}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Primary Required Vitals (Focused on Active Condition) */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600" />
              {ui.vitalsTitle}
            </h3>
            <span className="text-[11px] text-slate-500">
              {activeCategory === 'fever' ? 'Fever focused' : (activeCategory === 'respiratory' ? 'Oxygen & Respiratory' : 'Condition specific')}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {/* Always show durationDays */}
            <div>
              <label className="text-xs text-slate-700 font-medium">{ui.duration}</label>
              <input
                type="number"
                value={vitals.durationDays}
                onChange={(e) => setVitals({ ...vitals, durationDays: e.target.value })}
                className="w-full mt-1 p-2 text-sm rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* If condition requires temperature (e.g. fever) */}
            {CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('temperature') && (
              <div>
                <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                  {ui.temp}
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                  className="w-full mt-1 p-2 text-sm rounded border border-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-900 bg-emerald-50/20"
                />
              </div>
            )}

            {/* If condition requires spo2 (e.g. respiratory) */}
            {CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('spo2') && (
              <div>
                <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-sky-500" />
                  {ui.spo2}
                </label>
                <input
                  type="number"
                  placeholder="98"
                  value={vitals.spo2}
                  onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                  className="w-full mt-1 p-2 text-sm rounded border border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none font-medium text-slate-900 bg-sky-50/20"
                />
              </div>
            )}

            {/* If condition requires pulse (e.g. chest) */}
            {CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('pulse') && (
              <div>
                <label className="text-xs text-slate-700 font-medium flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5 text-rose-600" />
                  {ui.pulse}
                </label>
                <input
                  type="number"
                  placeholder="78"
                  value={vitals.pulse}
                  onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                  className="w-full mt-1 p-2 text-sm rounded border border-rose-300 focus:ring-2 focus:ring-rose-500 outline-none font-medium text-slate-900"
                />
              </div>
            )}
          </div>

          {/* 4. Expandable Home Vitals Drawer (Optional) */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowExtraVitals(!showExtraVitals)}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 focus:outline-none"
            >
              {showExtraVitals ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showExtraVitals ? ui.extraVitalsToggleClose : ui.extraVitalsToggleOpen}
            </button>
            <p className="text-[11px] text-slate-400 mt-1">{ui.optionalNotice}</p>

            {showExtraVitals && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-fadeIn">
                {!CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('temperature') && (
                  <div>
                    <label className="text-xs text-slate-600 font-medium">{ui.temp}</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={vitals.temperature}
                      onChange={(e) => setVitals({ ...vitals, temperature: e.target.value })}
                      className="w-full mt-1 p-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                    />
                  </div>
                )}
                {!CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('pulse') && (
                  <div>
                    <label className="text-xs text-slate-600 font-medium">{ui.pulse}</label>
                    <input
                      type="number"
                      placeholder="78"
                      value={vitals.pulse}
                      onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                      className="w-full mt-1 p-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                    />
                  </div>
                )}
                {!CONDITION_PROTOCOLS[activeCategory]?.primaryVitals?.includes('spo2') && (
                  <div>
                    <label className="text-xs text-slate-600 font-medium">{ui.spo2}</label>
                    <input
                      type="number"
                      placeholder="98"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                      className="w-full mt-1 p-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                    />
                  </div>
                )}
                <div>
                  <label className="text-xs text-slate-600 font-medium">{ui.systolic}</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={vitals.systolic}
                    onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                    className="w-full mt-1 p-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 font-medium">{ui.diastolic}</label>
                  <input
                    type="number"
                    placeholder="80"
                    value={vitals.diastolic}
                    onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                    className="w-full mt-1 p-2 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-emerald-500 outline-none bg-white"
                  />
                </div>
              </div>
            )}
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
