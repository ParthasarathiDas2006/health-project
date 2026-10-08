import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Phone,
  MessageSquare,
  Smartphone,
  Smile,
  Users,
  Copy,
  Check,
  RotateCcw,
  Send,
  ShieldAlert,
  Globe,
  Activity
} from 'lucide-react';

export default function AshaVoiceAssistSuite({ appLang = 'or-IN', currentUser }) {
  // Active Mode: 'voice_assist' | 'whatsapp' | 'ussd' | 'pain_family'
  const [activeMode, setActiveMode] = useState('voice_assist');

  // Selected Speech Recognition Language: 'or-IN' | 'hi-IN' | 'en-IN'
  const [selectedVoiceLang, setSelectedVoiceLang] = useState('or-IN');

  // Live Speech Recognition States
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [speechError, setSpeechError] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const recognitionRef = useRef(null);

  // ─── 12 Preloaded Rural Healthcare Audio / Voice Case Records ─────────────
  const VOICE_CASES = [
    {
      id: 'case_or_cardiac',
      lang: 'or-IN',
      langLabel: 'ଓଡ଼ିଆ (Odia)',
      patient: 'Ramesh Mohapatra (56M, Puri)',
      category: 'Cardiac Emergency',
      urgency: 'RED',
      urgencyLabel: 'ତୁରନ୍ତ ଡାକ୍ତରଖାନା / 108 ଆମ୍ବୁଲାନ୍ସ',
      voiceQuery: 'ମୋ ଛାତିରେ ବହୁତ କଷ୍ଟ ହେଉଛି, ବାମ ହାତକୁ ଯନ୍ତ୍ରଣା ଯାଉଛି ଏବଂ ପ୍ରଚୁର ଝାଳ ବାହାରୁଛି।',
      phonetic: 'Mo chhatire bahuta kasta heuchhi, bama hataku jantrana jauchhi ebam prachura jhala baharuchhi.',
      translation: 'I have severe chest pain radiating to my left arm with profuse cold sweating since 45 minutes.',
      detectedSymptoms: ['Severe Retro-sternal Pain', 'Radiation to Left Arm', 'Profuse Diaphoresis'],
      aiTriageAnalysis: 'ସନ୍ଦିଗ୍ଧ ଆକ୍ୟୁଟ୍ ମାୟୋକାର୍ଡିଆଲ୍ ଇନଫାର୍କସନ୍ (Heart Attack). ତୁରନ୍ତ Aspirin 325mg ଦିଅନ୍ତୁ, ରୋଗୀଙ୍କୁ ଶୁଆଇ ରଖନ୍ତୁ ଏବଂ 108 ଡାକନ୍ତୁ।',
      ashaGuideline: 'ତୁରନ୍ତ ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH) କିମ୍ବା SCB Cuttack କୁ ସ୍ଥାନାନ୍ତର କରନ୍ତୁ। ଚାଲିବାକୁ ଦିଅନ୍ତୁ ନାହିଁ।',
      nextFollowUpQuestion: 'କଣ ପୂର୍ବରୁ ହୃଦରୋଗ କିମ୍ବା ଉଚ୍ଚ ରକ୍ତଚାପ (High BP) ର ଇତିହାସ ଅଛି?'
    },
    {
      id: 'case_or_maternal',
      lang: 'or-IN',
      langLabel: 'ଓଡ଼ିଆ (Odia)',
      patient: 'Sasmita Sahoo (24F, Khordha)',
      category: 'Maternal Preeclampsia',
      urgency: 'RED',
      urgencyLabel: 'ଉଚ୍ଚ ବିପଦପୂର୍ଣ୍ଣ ଗର୍ଭଧାରଣ (HRP)',
      voiceQuery: 'ମୁଁ ୮ ମାସ ଗର୍ଭବତୀ, ମୁଣ୍ଡ ବହୁତ ବିନ୍ଧୁଛି, ଆଖିକୁ ଝାପ୍‌ସା ଦେଖାଯାଉଛି ଏବଂ ଗୋଡ଼ ଫୁଲିଯାଇଛି।',
      phonetic: 'Muin 8 masa garbhabati, munda bahuta bindhuchhi, akhiku jhapsa dekhajauchhi ebam goda phulijaichhi.',
      translation: 'I am 8 months pregnant, severe throbbing headache, blurred vision, and both feet swollen.',
      detectedSymptoms: ['Severe Headache', 'Visual Disturbance (Scotomata)', 'Bilateral Pedal Edema'],
      aiTriageAnalysis: 'ତୀବ୍ର ପ୍ରି-ଏକ୍ଲାମ୍ପସିଆ (Severe Pre-eclampsia). ରକ୍ତଚାପ ମାପନ୍ତୁ ଏବଂ କମ୍ପନ (Seizure) ରୋକିବା ପାଇଁ MgSO4 ପ୍ରୋଟୋକଲ୍ ବ୍ୟବସ୍ଥା କରନ୍ତୁ।',
      ashaGuideline: 'ମା’ ଓ ଶିଶୁ ସୁରକ୍ଷା (MCP) କାର୍ଡରେ ଲାଲ୍ ଷ୍ଟିକର ଲଗାନ୍ତୁ। ଫାଷ୍ଟ ରେଫରାଲ୍ ୟୁନିଟ୍ (FRU) କୁ ପଠାନ୍ତୁ।',
      nextFollowUpQuestion: 'କଣ କେବେ ବାତ କିମ୍ବା ଝଟକା ଆସିଛି?'
    },
    {
      id: 'case_or_child',
      lang: 'or-IN',
      langLabel: 'ଓଡ଼ିଆ (Odia)',
      patient: 'Infant Aryan (18 Months, Balasore)',
      category: 'Pediatric Dehydration',
      urgency: 'RED',
      urgencyLabel: 'ଗୁରୁତର ଶିଶୁ ଅସୁସ୍ଥତା',
      voiceQuery: 'ଛୁଆକୁ ୨ ଦିନ ହେଲା ଝାଡ଼ା ବାନ୍ତି ହେଉଛି, ଆଖି ଗାତ ହୋଇଗଲାଣି, କିଛି ଖାଉନି ଏବଂ ପରିସ୍ରା ହେଉନି।',
      phonetic: 'Chhuaku 2 dina hela jhada banti heuchhi, akhi gata hoigalani, kichhi khauni ebam parisra heuni.',
      translation: 'Child has severe diarrhea and vomiting for 2 days, sunken eyes, not feeding, no urine output.',
      detectedSymptoms: ['Severe Diarrhea', 'Persistent Vomiting', 'Sunken Eyes / Anuria'],
      aiTriageAnalysis: 'ଗୁରୁତର ଜଳକ୍ଷୟ (Severe Dehydration & Hypovolemic Shock Risk). ତୁରନ୍ତ ଚାମଚରେ ORS ଦିଅନ୍ତୁ ଏବଂ ସାଲାଇନ୍ ପାଇଁ PHC ନିଅନ୍ତୁ।',
      ashaGuideline: 'ଜିଙ୍କ୍ ସିରପ୍ ୨୦ ମିଗ୍ରା ଏବଂ ପ୍ରତି ୫ ମିନିଟରେ ଓଆରଏସ୍ ଦିଅନ୍ତୁ। ଅଙ୍ଗନୱାଡ଼ି କାର୍ଯ୍ୟକର୍ତ୍ତାଙ୍କୁ ଜଣାନ୍ତୁ।',
      nextFollowUpQuestion: 'ପିଲାଟି ସଚେତନ ଅଛି ନା ନିସ୍ତେଜ ହୋଇ ଶୋଇ ରହୁଛି?'
    },
    {
      id: 'case_or_tb',
      lang: 'or-IN',
      langLabel: 'ଓଡ଼ିଆ (Odia)',
      patient: 'Bikram Nayak (42M, Mayurbhanj)',
      category: 'Respiratory / TB',
      urgency: 'YELLOW',
      urgencyLabel: 'ଜରୁରୀ ପରୀକ୍ଷା ଆବଶ୍ୟକ (DOTS)',
      voiceQuery: '୩ ସପ୍ତାହରୁ ଅଧିକ ହେବ କାଶ ହେଉଛି, ସନ୍ଧ୍ୟା ବେଳେ ଜ୍ୱର ଆସୁଛି ଏବଂ କଫରେ ରକ୍ତ ପଡୁଛି।',
      phonetic: '3 saptaharu adhika heba kasa heuchhi, sandhya bele jwara asuchhi ebam kaphare rakta paduchhi.',
      translation: 'Coughing for more than 3 weeks, low-grade evening fever, and coughing up blood in sputum.',
      detectedSymptoms: ['Chronic Cough >21 Days', 'Evening Fever Pyrexia', 'Hemoptysis (Blood in Sputum)'],
      aiTriageAnalysis: 'ସମ୍ଭାବ୍ୟ ଫୁସଫୁସ୍ ଯକ୍ଷ୍ମା (Pulmonary TB). କଫ ପରୀକ୍ଷା (CBNAAT) ଏବଂ ଛାତି ଏକ୍ସ-ରେ ତୁରନ୍ତ କରାନ୍ତୁ।',
      ashaGuideline: 'ଦୁଇଟି କଫ ନମୁନା ସଂଗ୍ରହ କରି PHC DOTS କେନ୍ଦ୍ରକୁ ପଠାନ୍ତୁ। ମାସ୍କ ବ୍ୟବହାର କରିବାକୁ କୁହନ୍ତୁ।',
      nextFollowUpQuestion: 'ଘରେ କାହାର ପୂର୍ବରୁ ଯକ୍ଷ୍ମା କିମ୍ବା ଦୀର୍ଘସ୍ଥାୟୀ କାଶ ହୋଇଥିଲା କି?'
    },
    {
      id: 'case_hi_resp',
      lang: 'hi-IN',
      langLabel: 'हिंदी (Hindi)',
      patient: 'Ramvilas Sharma (62M, Rourkela)',
      category: 'Acute Respiratory Distress',
      urgency: 'RED',
      urgencyLabel: 'आपातकालीन सांस संकट (Red Alert)',
      voiceQuery: 'सांस लेने में बहुत ज्यादा तकलीफ हो रही है, छाती में सीटी जैसी आवाज आ रही है और होंठ नीले पड़ रहे हैं।',
      phonetic: 'Saans lene me bahut jyada takleef ho rahi hai, chhati me seeti jaisi aawaz aur honth neele pad rahe hain.',
      translation: 'Severe breathlessness, high-pitched wheezing in chest, and lips turning cyanotic blue.',
      detectedSymptoms: ['Severe Dyspnea', 'Expiratory Wheeze', 'Central Cyanosis'],
      aiTriageAnalysis: 'गंभीर श्वसन विफलता / तीव्र अस्थमा या सीओपीडी का दौरा (Severe Hypoxia & Respiratory Failure). तुरंत ऑक्सीजन लगाएं।',
      ashaGuideline: 'रोगी को बैठाकर रखें, 108 एम्बुलेंस को कॉल करें और निकटतम सामुदायिक स्वास्थ्य केंद्र (CHC) ले जाएं।',
      nextFollowUpQuestion: 'क्या पल्स ऑक्सीमीटर पर SpO2 नापा गया है? कितना आ रहा है?'
    },
    {
      id: 'case_hi_malaria',
      lang: 'hi-IN',
      langLabel: 'हिंदी (Hindi)',
      patient: 'Sunita Devi (38F, Koraput)',
      category: 'Fever Outbreak / Malaria',
      urgency: 'YELLOW',
      urgencyLabel: 'त्वरित जांच आवश्यक (PHC)',
      voiceQuery: 'चार दिन से बहुत तेज कंपकंपी के साथ बुखार आ रहा है, बदन और सिर में भयंकर दर्द है और उल्टी का मन हो रहा है।',
      phonetic: 'Chaar din se bahut tez kampkampi ke sath bukhar aa raha hai, badan aur sar me bhayankar dard hai.',
      translation: 'High-grade fever with shaking chills and rigors for 4 days, severe bodyache, headache and nausea.',
      detectedSymptoms: ['High Fever with Chills & Rigors', 'Severe Headache', 'Myalgia / Nausea'],
      aiTriageAnalysis: 'संभावित फाल्सीपेरम मलेरिया या डेंगू (Suspected Plasmodium Falciparum Malaria). तुरंत RDT किट से रक्त जांच करें।',
      ashaGuideline: 'खून की पट्टी (Blood slide) बनाएं और RDT किट से जांच करें। सकारात्मक आने पर ACT थेरेपी शुरू करें।',
      nextFollowUpQuestion: 'क्या पेशाब का रंग गहरा पीला या लाल-भूरा आ रहा है?'
    },
    {
      id: 'case_hi_abdomen',
      lang: 'hi-IN',
      langLabel: 'हिंदी (Hindi)',
      patient: 'Mohit Kumar (19M, Sambalpur)',
      category: 'Acute Abdomen / Appendicitis',
      urgency: 'RED',
      urgencyLabel: 'शल्य चिकित्सा आपातकाल (Surgical)',
      voiceQuery: 'पेट के निचले दाहिने हिस्से में असहनीय दर्द है, उल्टी हो रही है और दायां पैर सीधा नहीं कर पा रहा हूं।',
      phonetic: 'Pet ke nichle dahine hisse me asahneey dard hai, ulti ho rahi hai aur daayan pair seedha nahi kar pa raha.',
      translation: 'Excruciating pain in right lower quadrant of abdomen, vomiting, unable to extend right leg.',
      detectedSymptoms: ['RLQ Abdominal Pain', 'McBurney Point Tenderness', 'Vomiting & Psoas Sign'],
      aiTriageAnalysis: 'तीव्र एपेंडिसाइटिस या आंतों में रुकावट (Acute Appendicitis). पेट फटने (Perforation) का गंभीर खतरा।',
      ashaGuideline: 'मरीज को मुंह से कुछ भी खाने-पीने न दें (NPO रखें)। तुरंत जिला अस्पताल सर्जन के पास भेजें।',
      nextFollowUpQuestion: 'क्या पेट छूने पर एकदम कड़ा या पत्थर जैसा लग रहा है?'
    },
    {
      id: 'case_hi_snake',
      lang: 'hi-IN',
      langLabel: 'हिंदी (Hindi)',
      patient: 'Dhananjay Gond (45M, Kalahandi)',
      category: 'Toxic Snakebite Envenomation',
      urgency: 'RED',
      urgencyLabel: 'अत्यंत गंभीर सर्पदंश (Anti-Snake Venom)',
      voiceQuery: 'खेत में काम करते वक्त जहरीले सांप ने पैर में काट लिया, सूजन तेजी से ऊपर बढ़ रही है और पलकें भारी हो रही हैं।',
      phonetic: 'Khet me kaam karte waqt saanp ne kaat liya, sujan tezi se badh rahi hai aur palke bhaari ho rahi hain.',
      translation: 'Venomous snake bite on lower leg while working in fields, rapid ascending swelling, eyelid ptosis.',
      detectedSymptoms: ['Snakebite Fang Punctures', 'Rapid Local Edema', 'Bilateral Ptosis (Neurotoxic Sign)'],
      aiTriageAnalysis: 'न्यूरोटॉक्सिक / हेमटॉक्सिक सर्पदंश (Severe Snake Envenomation). तुरंत पॉलीवैलेंट ASV की 10 शीशियां आवश्यक।',
      ashaGuideline: 'काटे हुए स्थान को न चीरें, न कसकर बांधें। मरीज को शांत रखें और बिना देरी 108 एम्बुलेंस से FRU ले जाएं।',
      nextFollowUpQuestion: 'क्या मरीज को सांस लेने या निगलने में परेशानी हो रही है?'
    },
    {
      id: 'case_en_stemi',
      lang: 'en-IN',
      langLabel: 'English (India)',
      patient: 'Gopal Krishna Dash (52M, Bhubaneswar)',
      category: 'Acute STEMI / MI',
      urgency: 'RED',
      urgencyLabel: 'Cardiac Cath Lab Emergency',
      voiceQuery: 'I have severe crushing chest pressure like an elephant sitting on my chest, dizzy, nauseous for 40 minutes.',
      phonetic: 'Severe crushing chest pressure like an elephant sitting on chest, dizzy, nauseous.',
      translation: 'Crushing retrosternal chest pain with nausea and diaphoresis lasting over 30 minutes.',
      detectedSymptoms: ['Crushing Retrosternal Pain', 'Levine Sign Characteristic', 'Presyncope & Nausea'],
      aiTriageAnalysis: 'Acute ST-Elevation Myocardial Infarction (STEMI). High risk of ventricular arrhythmias or cardiogenic shock.',
      ashaGuideline: 'Administer Chewable Aspirin 325mg + Clopidogrel 300mg immediately. Urgent ECG and Golden Hour cath transfer.',
      nextFollowUpQuestion: 'Is the patient experiencing any shortness of breath or radiating pain to the jaw?'
    },
    {
      id: 'case_en_pph',
      lang: 'en-IN',
      langLabel: 'English (India)',
      patient: 'Mamata Swain (22F, Jagatsinghpur)',
      category: 'Obstetric Hemorrhage',
      urgency: 'RED',
      urgencyLabel: 'Critical Postpartum Hemorrhage',
      voiceQuery: 'Baby delivered at home two hours ago, mother is soaking pads continuously, hands are cold and she is fainting.',
      phonetic: 'Home delivery 2 hours ago, continuous vaginal bleeding, cold peripheries, syncopal.',
      translation: 'Postpartum home delivery with continuous massive hemorrhage, peripheral hypoperfusion, and shock.',
      detectedSymptoms: ['Severe Postpartum Bleeding', 'Pallor & Cold Clammy Skin', 'Hypovolemic Shock / Syncope'],
      aiTriageAnalysis: 'Postpartum Hemorrhage (PPH) secondary to uterine atony. Immediate two wide-bore IV lines & Oxytocin needed.',
      ashaGuideline: 'Perform external bimanual uterine compression. Call 108 ALS ambulance immediately. Notify blood bank.',
      nextFollowUpQuestion: 'Has the placenta been completely expelled or is it retained?'
    },
    {
      id: 'case_en_sugar',
      lang: 'en-IN',
      langLabel: 'English (India)',
      patient: 'Subhashini Senapati (60F, Cuttack)',
      category: 'Severe Hypoglycemia',
      urgency: 'YELLOW',
      urgencyLabel: 'Urgent Glycemic Correction',
      voiceQuery: 'Elderly diabetic mother took her morning tablet but skipped food, now sweating profusely, trembling, and talking incoherently.',
      phonetic: 'Elderly diabetic took tablet skipped meal, profuse diaphoresis, tremors, confusion.',
      translation: 'Diabetic patient with drug-nutrient mismatch presenting with autonomic hyperactivity and neuroglycopenia.',
      detectedSymptoms: ['Severe Diaphoresis', 'Coarse Tremors', 'Neuroglycopenic Confusion'],
      aiTriageAnalysis: 'Acute Drug-Induced Hypoglycemia (Suspected capillary blood glucose < 50 mg/dL). High risk of hypoglycemic coma.',
      ashaGuideline: 'If conscious and able to swallow, give 4-5 teaspoons of sugar dissolved in water or fruit juice immediately.',
      nextFollowUpQuestion: 'Can she swallow safely or is she completely unresponsive?'
    },
    {
      id: 'case_en_heat',
      lang: 'en-IN',
      langLabel: 'English (India)',
      patient: 'Duryodhan Sethi (48M, Titilagarh)',
      category: 'Heat Hyperpyrexia / Loo',
      urgency: 'RED',
      urgencyLabel: 'Life-Threatening Heat Stroke',
      voiceQuery: 'Working under scorching direct sun since morning, body temperature 104 degrees, skin is burning hot and completely dry, disoriented.',
      phonetic: 'Working under direct sun, temperature 104F, skin dry and hot, disoriented.',
      translation: 'Extreme environmental heat exposure with hyperthermia > 104°F, anhidrosis, and central nervous system dysfunction.',
      detectedSymptoms: ['Hyperpyrexia Temp 104°F', 'Anhidrosis (Dry Hot Skin)', 'Encephalopathy / Delirium'],
      aiTriageAnalysis: 'Classical Heat Stroke (Thermoregulatory failure). High risk of multi-organ failure and rhabdomyolysis.',
      ashaGuideline: 'Move to shade immediately. Spray cold water and fan vigorously. Place ice packs on groins, axillae, and neck.',
      nextFollowUpQuestion: 'Has he had any seizures or lost consciousness?'
    }
  ];

  // Active Selected Voice Case
  const [selectedCase, setSelectedCase] = useState(VOICE_CASES[0]);

  // Sync selected voice language when case changes
  const loadCase = (c) => {
    setSelectedCase(c);
    setSelectedVoiceLang(c.lang);
    setTranscript(c.voiceQuery);
    setInterimTranscript('');
    setSpeechError('');
  };

  // ─── Web Speech Recognition API Integration ──────────────────────────────
  const startListening = () => {
    setSpeechError('');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech Recognition is not supported by your browser. Please use Chrome/Edge or click a preloaded clinical voice sample below.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = selectedVoiceLang; // 'or-IN' | 'hi-IN' | 'en-IN'

      recognition.onstart = () => {
        setIsListening(true);
        setSpeechError('');
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTrans = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          } else {
            currentInterim += event.results[i][0].transcript;
          }
        }

        if (finalTrans) {
          setTranscript(finalTrans);
          setInterimTranscript('');
          matchSpokenSymptoms(finalTrans);
        } else {
          setInterimTranscript(currentInterim);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        if (event.error === 'no-speech') {
          setSpeechError('No speech detected. Please speak closer to the microphone.');
        } else if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission was denied. Please allow mic access in your browser settings.');
        } else {
          setSpeechError(`Speech recognition note: ${event.error}. You can test anytime with preloaded voice cases below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      setIsListening(false);
      setSpeechError('Could not initialize speech recognition. Use test voice cases below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  // Simple keyword matching for custom live-spoken input
  const matchSpokenSymptoms = (text) => {
    const lower = text.toLowerCase();
    const matched = VOICE_CASES.find(c => {
      return (
        lower.includes('chhati') || lower.includes('chest') || lower.includes('heart') ||
        lower.includes('chhuan') || lower.includes('fever') || lower.includes('jwara') ||
        lower.includes('garbha') || lower.includes('bukhar') || lower.includes('saans') ||
        lower.includes('saanp') || lower.includes('pet') || lower.includes('pain')
      );
    });
    if (matched) {
      setSelectedCase({
        ...matched,
        voiceQuery: text
      });
    }
  };

  // ─── Text-to-Speech (Voice Assistant speaks back to ASHA / Patient) ────────
  const speakResponse = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Use matching voice language tag
    utterance.lang = selectedVoiceLang === 'hi-IN' ? 'hi-IN' : selectedVoiceLang === 'en-IN' ? 'en-IN' : 'hi-IN'; // Fallback to Hindi/Indian voice for Odia phonetics
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Copy clinical note
  const handleCopy = () => {
    const note = `=== ASHA MULTILINGUAL VOICE TRIAGE ADVISORY ===
Patient / Case: ${selectedCase.patient}
Selected Language: ${selectedCase.langLabel}
Audio Transcript: "${transcript || selectedCase.voiceQuery}"
English Translation: "${selectedCase.translation}"
Triage Urgency: ${selectedCase.urgency} (${selectedCase.urgencyLabel})
Identified Symptoms: ${selectedCase.detectedSymptoms.join(', ')}
AI Clinical Assessment: ${selectedCase.aiTriageAnalysis}
Village ASHA Protocol: ${selectedCase.ashaGuideline}
Follow-up Question: ${selectedCase.nextFollowUpQuestion}
Verified by SwasthyaMitra Community Voice Assistant Engine.`;

    navigator.clipboard.writeText(note);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter cases by current selected language
  const filteredCases = VOICE_CASES.filter(c => c.lang === selectedVoiceLang);

  // ─── WhatsApp Chat Simulation State ───────────────────────────────────────
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', time: '10:00 AM', text: 'ନମସ୍କାର! ମୁଁ ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର WhatsApp AI ସହାୟକ। ଆପଣଙ୍କ ରୋଗର ଲକ୍ଷଣ ଟାଇପ୍ କରନ୍ତୁ କିମ୍ବା Voice Note ପଠାନ୍ତୁ। (नमस्ते! स्वास्थ्यमित्र व्हाट्सएप में आपका स्वागत है।)' },
    { sender: 'user', time: '10:01 AM', isAudio: true, text: '🎙️ Voice Note (0:14) - "ମୋ ଛାତିରେ ବହୁତ କଷ୍ଟ ହେଉଛି ଏବଂ ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ହେଉଛି"' },
    { sender: 'bot', time: '10:01 AM', isUrgent: true, text: '🚨 ତୁରନ୍ତ ସତର୍କତା: ଆପଣଙ୍କ ଲକ୍ଷଣ ହୃଦରୋଗ (Heart Attack) ସମ୍ଭାବନା ଦର୍ଶାଉଛି।\n\n୧. ତୁରନ୍ତ 108 କଲ୍ କରନ୍ତୁ।\n୨. ରୋଗୀଙ୍କୁ ଶୋଇ ରଖନ୍ତୁ।\n୩. ନିକଟତମ SCB କଟକ କିମ୍ବା ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟକୁ ଯାଆନ୍ତୁ।' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { sender: 'user', time: '10:05 AM', text: chatInput };
    const reply = {
      sender: 'bot',
      time: '10:05 AM',
      isUrgent: chatInput.toLowerCase().includes('pain') || chatInput.includes('କଷ୍ଟ') || chatInput.includes('दर्द'),
      text: `ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର ପରାମର୍ଶ:\n• ଲକ୍ଷଣ ବିଶ୍ଳେଷଣ କରାଗଲା: "${chatInput}"\n• ସୁପାରିଶ: ନିକଟତମ PHC ରେ ରକ୍ତଚାପ ଏବଂ ଜ୍ୱର ମାପନ୍ତୁ। ତୁରନ୍ତ ଡାକ୍ତର ପରାମର୍ଶ ଲୋଡା।`
    };

    setChatMessages([...chatMessages, newMsg, reply]);
    setChatInput('');
  };

  // ─── USSD *123# Offline Simulation State ──────────────────────────────────
  const [ussdStep, setUssdStep] = useState(0); // 0: dialed, 1: lang chosen, 2: symptom chosen, 3: result
  const [ussdInput, setUssdInput] = useState('');

  const handleUssdSubmit = (e) => {
    e.preventDefault();
    if (ussdStep === 0 && ussdInput === '*123#') {
      setUssdStep(1);
    } else if (ussdStep === 1) {
      setUssdStep(2);
    } else if (ussdStep === 2) {
      setUssdStep(3);
    }
    setUssdInput('');
  };

  // ─── Pictorial Pain Map State ─────────────────────────────────────────────
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest / Thorax');
  const [painLevel, setPainLevel] = useState(7);
  const smileys = ['😊 (Mild 1-2)', '🙂 (Mild 3-4)', '😐 (Moderate 5-6)', '😣 (Severe 7-8)', '😭 (Excruciating 9-10)'];

  // Multi-Member Family Camp State
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Kailash Sahoo (Head)', age: 54, symptom: 'Persistent Dry Cough & Fever', status: 'YELLOW' },
    { name: 'Basanti Sahoo (Spouse)', age: 48, symptom: 'Chest Heaviness & Palpitations', status: 'RED' },
    { name: 'Bapun Sahoo (Son)', age: 14, symptom: 'Mild Headache & Runny Nose', status: 'GREEN' }
  ]);
  const [newMemName, setNewMemName] = useState('');
  const [newMemAge, setNewMemAge] = useState('');
  const [newMemSymptom, setNewMemSymptom] = useState('');

  return (
    <div className="bg-white p-4 sm:p-7 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
              <Mic className="w-3 h-3 text-amber-600" /> ASHA Low-Literacy Speech Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <Languages className="w-3 h-3 text-emerald-600" /> Trilingual: Odia • Hindi • English
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
              WhatsApp &amp; Offline USSD *123#
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <Mic className="w-6 h-6 text-amber-600 shrink-0" />
            16. Multilingual ASHA Voice Assist &amp; Community Triage Suite
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Speech-to-text triage recognizing native rural spoken dialects in <strong>Odia (ଓଡ଼ିଆ)</strong>, <strong>Hindi (हिंदी)</strong>, and <strong>English</strong>, with conversational follow-up questions, WhatsApp chatbot, and offline feature phone USSD support.
          </p>
        </div>

        {/* Global Action: Copy Triage Note */}
        <div className="flex items-center gap-2 self-start lg:self-center">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition-all ${
              copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Triage Note Copied!' : 'Copy Clinical Note'}
          </button>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveMode('voice_assist')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeMode === 'voice_assist'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Mic className="w-4 h-4" /> Multilingual Voice Assist (Odia / Hindi / English)
        </button>
        <button
          onClick={() => setActiveMode('whatsapp')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeMode === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" /> WhatsApp Triage Bot
        </button>
        <button
          onClick={() => setActiveMode('ussd')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeMode === 'ussd'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Phone className="w-4 h-4" /> USSD *123# (Offline Non-Smartphone)
        </button>
        <button
          onClick={() => setActiveMode('pain_family')}
          className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap ${
            activeMode === 'pain_family'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Smile className="w-4 h-4" /> Pain Scale &amp; Family Camp Mode
        </button>
      </div>

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 1: TRILINGUAL VOICE ASSIST ENGINE (ODIA / HINDI / ENGLISH)
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMode === 'voice_assist' && (
        <div className="space-y-6">
          {/* Language Selector Bar */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
              <Globe className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Select Speech Recognition &amp; Triage Language:</span>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: 'or-IN', label: 'ଓଡ଼ିଆ (Odia)', badge: 'Regional Priority' },
                { id: 'hi-IN', label: 'हिंदी (Hindi)', badge: 'National' },
                { id: 'en-IN', label: 'English', badge: 'Standard' }
              ].map(lang => (
                <button
                  key={lang.id}
                  onClick={() => {
                    setSelectedVoiceLang(lang.id);
                    const firstCase = VOICE_CASES.find(c => c.lang === lang.id);
                    if (firstCase) loadCase(firstCase);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                    selectedVoiceLang === lang.id
                      ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                      : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100/50'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Voice Assistant Interactive Console ── */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-7 rounded-3xl shadow-lg border border-slate-800 space-y-5">
            {/* Live Mic Control Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`relative p-4 rounded-full transition-all shadow-md shrink-0 ${
                    isListening
                      ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse ring-4 ring-rose-400/40'
                      : 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-black'
                  }`}
                  title={isListening ? 'Click to stop listening' : 'Click to start speaking in Odia, Hindi, or English'}
                >
                  {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  {isListening && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full animate-ping" />
                  )}
                </button>

                <div>
                  <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                    {isListening ? (
                      <span className="text-rose-400 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping" />
                        Listening in {selectedVoiceLang === 'or-IN' ? 'Odia (ଓଡ଼ିଆ)' : selectedVoiceLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'}...
                      </span>
                    ) : (
                      'ASHA Handsfree Voice Input'
                    )}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {isListening
                      ? 'Speak your symptoms clearly into your microphone...'
                      : `Click microphone to speak or click any of the ${filteredCases.length} verified clinical voice records below.`}
                  </p>
                </div>
              </div>

              {/* Text-to-speech replay of response */}
              <button
                onClick={() => speakResponse(selectedCase.aiTriageAnalysis)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                {isSpeaking ? 'Stop Voice' : 'Hear Voice Advisory'}
              </button>
            </div>

            {/* Speech Recognition Error Notice if any */}
            {speechError && (
              <div className="p-3 bg-amber-500/20 border border-amber-400/40 rounded-xl text-xs text-amber-200">
                ℹ️ {speechError}
              </div>
            )}

            {/* Live Transcript Screen */}
            <div className="bg-slate-950/80 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Recognized Speech Transcript ({selectedCase.langLabel}):</span>
                {isListening && <span className="text-emerald-400 font-bold animate-pulse">● Live Recording Active</span>}
              </div>
              <p className="text-base sm:text-lg font-bold text-amber-300 min-h-[48px] leading-relaxed">
                "{transcript || interimTranscript || selectedCase.voiceQuery}"
              </p>
              {selectedCase.translation && (
                <p className="text-xs text-slate-400 italic pt-1 border-t border-white/10">
                  <span className="font-bold text-slate-300 not-italic">English Meaning: </span>
                  "{selectedCase.translation}"
                </p>
              )}
            </div>

            {/* 3 Essential Vitals Capsules & Medical Officer Action */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">PULSE</span>
                  <span className="text-base font-black text-white font-mono">84 bpm</span>
                  <span className="text-[10px] text-emerald-400 block font-medium">Normal</span>
                </div>
                <Activity className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">OXYGEN SpO2</span>
                  <span className="text-base font-black text-white font-mono">98%</span>
                  <span className="text-[10px] text-teal-400 block font-medium">Normal</span>
                </div>
                <Activity className="w-5 h-5 text-teal-400" />
              </div>

              <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TEMPERATURE</span>
                  <span className="text-base font-black text-white font-mono">100.2°F</span>
                  <span className="text-[10px] text-amber-400 block font-medium">Mild Pyrexia</span>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    handleCopy();
                    alert('Clinical note submitted to Primary Health Center Medical Officer queue!');
                  }}
                  className="w-full h-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit to Doctor Queue</span>
                </button>
              </div>
            </div>

            {/* AI Triage & Extraction Output Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {/* Urgency Badge */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Triage Urgency Level</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                    selectedCase.urgency === 'RED'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-500 text-slate-950'
                  }`}>
                    {selectedCase.urgency === 'RED' ? 'EMERGENCY RED' : 'URGENT YELLOW'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">{selectedCase.urgencyLabel}</p>
              </div>

              {/* Detected Symptoms */}
              <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-1.5 md:col-span-2">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">AI Detected Clinical Tokens</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCase.detectedSymptoms.map((sym, idx) => (
                    <span key={idx} className="bg-indigo-900/60 border border-indigo-400/40 text-indigo-200 px-2 py-0.5 rounded-md text-[11px] font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-400" /> {sym}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Clinical Directive & Next ASHA Follow-up Question */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-100 space-y-1.5">
                <span className="font-black text-amber-300 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  AI Clinical Triage Analysis:
                </span>
                <p className="leading-relaxed font-medium">{selectedCase.aiTriageAnalysis}</p>
                <p className="text-[11px] text-amber-200/80 pt-1 border-t border-amber-400/20">
                  <strong>ASHA Guideline:</strong> {selectedCase.ashaGuideline}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-indigo-100 space-y-1.5">
                <span className="font-black text-indigo-300 text-xs flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Next Logical Conversational Question to Ask Patient:
                </span>
                <p className="text-sm font-bold text-white leading-relaxed italic">
                  "{selectedCase.nextFollowUpQuestion}"
                </p>
                <p className="text-[11px] text-indigo-200/80 pt-1 border-t border-indigo-400/20">
                  ASHA asks this question to confirm immediate red-flag complications.
                </p>
              </div>
            </div>
          </div>

          {/* ── Preloaded Rural Healthcare Voice Cases Database ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                Verified Clinical Voice Scenarios in {selectedVoiceLang === 'or-IN' ? 'Odia (ଓଡ଼ିଆ)' : selectedVoiceLang === 'hi-IN' ? 'Hindi (हिंदी)' : 'English'} ({filteredCases.length} Cases)
              </h4>
              <span className="text-xs text-slate-500 hidden sm:inline">Click any case to test speech parsing &amp; AI triage</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {filteredCases.map((c) => {
                const isSelected = selectedCase.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => loadCase(c)}
                    className={`p-3.5 rounded-2xl border text-left transition-all space-y-2 relative shadow-2xs ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-600 ring-2 ring-amber-500/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        c.urgency === 'RED' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {c.category}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] font-black bg-amber-600 text-white px-1.5 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <p className="font-extrabold text-slate-900 text-xs">{c.patient}</p>
                    <p className="text-[11px] text-slate-600 italic line-clamp-2">"{c.voiceQuery}"</p>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-amber-800">
                      <span>{c.detectedSymptoms.length} Symptoms</span>
                      <span>Click to Load →</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 2: WHATSAPP TRIAGE BOT SIMULATOR
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMode === 'whatsapp' && (
        <div className="max-w-2xl mx-auto bg-emerald-50/40 p-4 sm:p-6 rounded-3xl border border-emerald-200 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">SwasthyaMitra WhatsApp AI Helpline (+91 7978X XXXXX)</h3>
                <p className="text-xs text-emerald-700">Online • Govt of Odisha Certified ABDM Bot</p>
              </div>
            </div>
            <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
              Trilingual Bot
            </span>
          </div>

          {/* WhatsApp Chat Body */}
          <div className="bg-[#efeae2] p-4 rounded-2xl h-80 overflow-y-auto space-y-3 text-xs border border-emerald-200/60 shadow-inner">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] space-y-1 shadow-2xs ${
                  msg.sender === 'user'
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none'
                    : msg.isUrgent
                    ? 'bg-rose-50 border border-rose-300 text-rose-950 rounded-tl-none'
                    : 'bg-white text-slate-900 rounded-tl-none'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed font-medium">{msg.text}</p>
                  <p className="text-[9px] text-slate-400 text-right">{msg.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form onSubmit={sendChatMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type message in Odia, Hindi, or English (e.g. ଛାତି କଷ୍ଟ / Chest pain)..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-white p-2.5 rounded-xl border border-emerald-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Preload Test Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-medium pt-1">
            <span className="text-slate-500 text-[10px]">Test Quick Reply:</span>
            <button onClick={() => setChatInput('ମୋତେ ୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର')} className="bg-white border border-emerald-300 hover:bg-emerald-50 px-2 py-1 rounded-lg">
              "ପ୍ରବଳ ଜ୍ୱର" (Odia)
            </button>
            <button onClick={() => setChatInput('मुझे सांस लेने में भारी तकलीफ है')} className="bg-white border border-emerald-300 hover:bg-emerald-50 px-2 py-1 rounded-lg">
              "सांस में तकलीफ" (Hindi)
            </button>
            <button onClick={() => setChatInput('Severe chest pain and vomiting')} className="bg-white border border-emerald-300 hover:bg-emerald-50 px-2 py-1 rounded-lg">
              "Chest Pain" (English)
            </button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 3: USSD *123# OFFLINE FEATURE PHONE SIMULATOR
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMode === 'ussd' && (
        <div className="max-w-md mx-auto bg-slate-900 text-white p-6 rounded-3xl border border-slate-700 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-sm text-white">USSD *123# Offline Triage Gateway</h3>
            </div>
            <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
              No Internet Required
            </span>
          </div>

          {/* Mobile Screen Display */}
          <div className="bg-emerald-950/80 p-4 rounded-2xl border-2 border-emerald-600 font-mono text-xs text-emerald-300 space-y-2.5 min-h-[160px]">
            {ussdStep === 0 && (
              <div>
                <p className="font-bold text-white mb-2">Welcome to Odisha National Health Portal USSD</p>
                <p>Dial *123# and press Send to begin triage without internet.</p>
              </div>
            )}

            {ussdStep === 1 && (
              <div>
                <p className="font-bold text-white mb-1.5">Select Language / ଭାଷା ବାଛନ୍ତୁ:</p>
                <p>1. ଓଡ଼ିଆ (Odia)</p>
                <p>2. हिंदी (Hindi)</p>
                <p>3. English</p>
              </div>
            )}

            {ussdStep === 2 && (
              <div>
                <p className="font-bold text-white mb-1.5">Select Emergency Category:</p>
                <p>1. Chest Pain / Heart (ଛାତି ଯନ୍ତ୍ରଣା)</p>
                <p>2. Maternal / Delivery (ପ୍ରସବ / ଗର୍ଭଧାରଣ)</p>
                <p>3. High Fever / Outbreak (ଜ୍ୱର / ଡେଙ୍ଗୁ)</p>
                <p>4. Injury / Snakebite (ଦୁର୍ଘଟଣା / ସାପକାମୁଡା)</p>
              </div>
            )}

            {ussdStep === 3 && (
              <div className="text-amber-200">
                <p className="font-bold text-rose-400 mb-1.5">🚨 SWASTHYAMITRA TRIAGE ADVISORY:</p>
                <p>EMERGENCY TICKET: #OD-9921</p>
                <p>108 Ambulance dispatched to nearest PHC tower.</p>
                <p>ASHA worker notified via SMS.</p>
                <button
                  onClick={() => setUssdStep(0)}
                  className="mt-3 text-[10px] bg-emerald-600 text-white px-2 py-1 rounded font-sans font-bold"
                >
                  Dial *123# Again
                </button>
              </div>
            )}
          </div>

          {/* USSD Keypad Form */}
          {ussdStep < 3 && (
            <form onSubmit={handleUssdSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder={ussdStep === 0 ? "Type *123#" : "Enter option number (e.g. 1)"}
                value={ussdInput}
                onChange={(e) => setUssdInput(e.target.value)}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold font-mono"
              >
                Send
              </button>
            </form>
          )}
        </div>
      )}

      {/* ═════════════════════════════════════════════════════════════════════
          TAB 4: PICTORIAL PAIN MAP & FAMILY BATCH CAMP MODE
      ═════════════════════════════════════════════════════════════════════ */}
      {activeMode === 'pain_family' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Pictorial Pain Map */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Smile className="w-4 h-4 text-indigo-600" />
                Pictorial Pain Rating Scale &amp; Body Map
              </h4>
              <p className="text-slate-500 text-xs mt-0.5">Designed for pediatric, geriatric, and low-literacy community patients.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Body Region:</label>
                <select
                  value={selectedBodyPart}
                  onChange={(e) => setSelectedBodyPart(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-xl font-bold"
                >
                  <option value="Chest / Thorax">🫁 Chest / Thorax (ଛାତି)</option>
                  <option value="Abdomen / Stomach">🫄 Abdomen / Stomach (ପେଟ)</option>
                  <option value="Head / Cranial">🧠 Head / Cranial (ମୁଣ୍ଡ)</option>
                  <option value="Lower Back / Spine">🦴 Lower Back / Spine (କମର)</option>
                  <option value="Lower Extremity / Knee">🦵 Lower Limbs (ଗୋଡ଼)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Intensity Level (1-10):</label>
                <div className="p-2 bg-white border border-slate-200 rounded-xl text-center font-extrabold text-indigo-700">
                  Level {painLevel}/10 ({smileys[Math.min(4, Math.floor(painLevel/2))]})
                </div>
              </div>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-bold">
              <span>😊 Mild (1)</span>
              <span>😐 Moderate (5)</span>
              <span>😭 Severe (10)</span>
            </div>
          </div>

          {/* Family Batch Camp Mode */}
          <div className="bg-indigo-50/60 p-4 sm:p-5 rounded-2xl border border-indigo-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-indigo-950 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Multi-Member Family Camp Triage
              </h4>
              <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                Batch Mode
              </span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {familyMembers.map((m, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{m.name} ({m.age} Yrs)</p>
                    <p className="text-slate-500 text-[11px]">{m.symptom}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                    m.status === 'RED'
                      ? 'bg-rose-600 text-white'
                      : m.status === 'YELLOW'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {m.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Add Family Member */}
            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-indigo-200">
              <input
                type="text"
                placeholder="Name"
                value={newMemName}
                onChange={(e) => setNewMemName(e.target.value)}
                className="p-1.5 bg-white border border-indigo-200 rounded-lg text-xs"
              />
              <input
                type="text"
                placeholder="Complaint"
                value={newMemSymptom}
                onChange={(e) => setNewMemSymptom(e.target.value)}
                className="p-1.5 bg-white border border-indigo-200 rounded-lg text-xs"
              />
              <button
                onClick={() => {
                  if (newMemName.trim()) {
                    setFamilyMembers([...familyMembers, { name: newMemName, age: 25, symptom: newMemSymptom || 'Fever & Fatigue', status: 'YELLOW' }]);
                    setNewMemName('');
                    setNewMemSymptom('');
                  }
                }}
                className="bg-indigo-600 text-white font-bold rounded-lg text-xs hover:bg-indigo-700"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
