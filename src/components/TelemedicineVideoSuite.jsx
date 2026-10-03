import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Phone,
  Monitor,
  MessageSquare,
  Send,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  HeartPulse,
  Activity,
  User,
  Stethoscope,
  ShieldCheck,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Sliders,
  Settings,
  ChevronRight,
  Info,
  Radio,
  Share2,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  Volume2,
  VolumeX,
  Users,
  Plus,
  Pill,
  TestTube,
  Image,
  Play,
  Pause,
  HelpCircle,
  Paperclip,
  CheckCheck,
  Camera,
  Grid,
  Printer,
  QrCode,
  Smartphone
} from 'lucide-react';
import { DoctorAvatar } from '../utils/doctorPhotos';
import { getBookedAppointments } from '../utils/authStorage';

/**
 * Play harmonic synthetic tones for call audio cues via Web Audio API (Zero external file dependencies)
 */
const playTone = (type = 'connect') => {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'connect') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.12); // G5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'end') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(329.63, ctx.currentTime + 0.18); // E4
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } else if (type === 'message') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.07, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'audio_note') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(554.37, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {
    // AudioContext blocked by browser autoplay policy before user interaction
  }
};

/**
 * In-App WebRTC Telemedicine Call Suite (Doctor-Patient Video Consultation)
 *
 * Improvised Message Types:
 * - 'text': Standard conversational messages with read status (✓✓)
 * - 'rx': Official e-Prescription advice cards with dosage and warnings
 * - 'vitals': Live telemetry snapshot cards with BP, Pulse, SpO2, Temp & Acuity
 * - 'lab': Diagnostic lab test requisition cards (STAT priority, specimen notes)
 * - 'image': Clinical examination photos (throat / skin rash) with expand lightbox
 * - 'audio': Voice consultation clips with interactive waveform & audio tone playback
 * - 'triage_query': Interactive clinical questions with 1-click selectable responses
 * - 'system': ABDM encrypted session audit and security banners
 */
export default function TelemedicineVideoSuite({
  currentUser,
  appLang = 'or-IN',
  onNavigateToNmc,
  onNavigateBack,
  initialRoomId = null,
  initialPatient = null,
  initialDoctor = null
}) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';
  const isDoctorUser = currentUser?.roleCategory === 'doctor';

  // Active Role: 'doctor' or 'patient'
  const [activeRole, setActiveRole] = useState(() => {
    if (isDoctorUser) return 'doctor';
    return 'patient';
  });

  // Call Lifecycle: 'lobby' | 'consenting' | 'connecting' | 'connected' | 'ended'
  const [callState, setCallState] = useState('lobby');

  // Room & Session Details
  const [roomId, setRoomId] = useState(
    initialRoomId || `TELE-OD-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSoap, setCopiedSoap] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  // Hardware Media States
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaPermissionError, setMediaPermissionError] = useState(null);
  const [audioLevel, setAudioLevel] = useState(35); // Simulated / Live VU meter
  const [networkQuality, setNetworkQuality] = useState('HD • 60fps (24ms)');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Examination Digital Zoom & Visual Controls
  const [zoomLevel, setZoomLevel] = useState(1); // 1, 1.5, 2, 2.5, 3
  const [showClosedCaptions, setShowClosedCaptions] = useState(true);
  const [includeAsha, setIncludeAsha] = useState(false);

  // Interactive Clinical Sidebar: 'chat' | 'vitals' | 'notes' | 'none'
  const [activeSidePanel, setActiveSidePanel] = useState('chat');
  
  // Improvised Chat States: Multiple Message Types, Action Menu & Lightbox
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [expandedImage, setExpandedImage] = useState(null);
  const [inputChat, setInputChat] = useState('');

  // Improvised Clinical Examination & Prescription Hand-off States
  const [showMeasurementGrid, setShowMeasurementGrid] = useState(false);
  const [isSyncingVitals, setIsSyncingVitals] = useState(false);
  const [showNmcRxModal, setShowNmcRxModal] = useState(false);
  const [whatsappSentNotice, setWhatsappSentNotice] = useState(false);
  const [rxPrescriptions, setRxPrescriptions] = useState([
    {
      id: 'rx-1',
      name: 'Tab Paracetamol 650mg (Dolo)',
      generic: 'Paracetamol IP 650mg',
      dosage: '1 Tablet',
      freq: 'TDS (3 times/day)',
      timing: 'After meals (SOS for fever > 100°F)',
      days: '3 Days',
      instruction: 'Do not exceed 3 tablets in 24 hours. Maintain hydration.'
    },
    {
      id: 'rx-2',
      name: 'Electral ORS Powder (WHO Formula)',
      generic: 'Oral Rehydration Salts IP',
      dosage: '1 Sachet',
      freq: 'Throughout day',
      timing: 'Mix in 1 Liter boiled cooled water',
      days: '3 Days',
      instruction: 'Sip 2 to 3 liters daily to prevent hemoconcentration.'
    },
    {
      id: 'rx-3',
      name: 'Tab Pantoprazole 40mg',
      generic: 'Pantoprazole Sodium IP 40mg',
      dosage: '1 Tablet',
      freq: 'OD (Once daily)',
      timing: '30 mins before breakfast',
      days: '5 Days',
      instruction: 'Gastric mucosal protection during antipyretic course.'
    },
    {
      id: 'rx-4',
      name: 'Syrup Zinc Sulphate 20mg/5ml',
      generic: 'Zinc Sulphate Monohydrate',
      dosage: '5 ml',
      freq: 'OD (Once daily)',
      timing: 'After dinner',
      days: '7 Days',
      instruction: 'Immune mucosal support during viral recovery.'
    }
  ]);

  // Patient Clinical Telemetry Profile
  const [patientData, setPatientData] = useState(() => {
    if (initialPatient) return initialPatient;
    return {
      name: 'Rameshwar Lal (ରମେଶ୍ୱର ଲାଲ୍)',
      age: 48,
      gender: 'Male',
      abhaId: '91-4412-8820-1945',
      phone: '+91 94371 90214',
      district: 'Cuttack',
      bloodGroup: 'B+',
      weight: '68 kg',
      chiefComplaint: 'Continuous High Fever for 3 days with severe retro-orbital headache and joint pains',
      vitals: {
        bp: '104/68 mmHg',
        pulse: '106 bpm',
        spo2: '97%',
        temp: '101.4°F',
        rr: '20/min'
      },
      acuity: 'YELLOW'
    };
  });

  // Doctor Clinical Profile
  const doctorData = useMemo(() => {
    if (initialDoctor) return initialDoctor;
    return {
      name: isDoctorUser ? currentUser?.name || 'Dr. Soumya Ranjan Nayak' : 'Dr. Soumya Ranjan Nayak',
      degrees: 'MBBS, MD (Internal & Emergency Medicine)',
      regNo: 'OMC-2017-66431',
      facility: 'SCB Medical College & Hospital, Cuttack',
      department: 'Telemedicine & Triage Unit'
    };
  }, [initialDoctor, isDoctorUser, currentUser]);

  // Initial Multi-Type Chat Messages
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      msgType: 'system',
      sender: 'system',
      text: 'ABDM Encrypted Telemedicine Session Initialized (TLS 1.3 / DTLS-SRTP • e-Sanjeevani Protocol)',
      time: '10:00 AM'
    },
    {
      id: 'msg-2',
      msgType: 'text',
      sender: 'doctor',
      senderName: 'Dr. Soumya Ranjan Nayak',
      text: 'Namaskar Rameshwar ji! I am reviewing your preliminary intake. Can you hear and see me clearly?',
      time: '10:01 AM'
    },
    {
      id: 'msg-3',
      msgType: 'vitals',
      sender: 'patient',
      senderName: 'Rameshwar Lal (Patient)',
      time: '10:01 AM',
      data: {
        bp: '104/68 mmHg',
        pulse: '106 bpm',
        spo2: '97%',
        temp: '101.4°F',
        acuity: 'YELLOW'
      }
    },
    {
      id: 'msg-4',
      msgType: 'triage_query',
      sender: 'doctor',
      senderName: 'Dr. Soumya Ranjan Nayak',
      time: '10:02 AM',
      data: {
        question: 'Have you noticed any spontaneous bleeding from gums, nose, or severe abdominal pain?',
        options: ['No bleeding noticed', 'Mild abdominal discomfort', 'Severe pain / Bleeding']
      }
    },
    {
      id: 'msg-5',
      msgType: 'lab',
      sender: 'doctor',
      senderName: 'Dr. Soumya Ranjan Nayak',
      time: '10:03 AM',
      data: {
        testName: 'Dengue NS1 Antigen + Platelet Count (STAT)',
        priority: 'STAT (Urgent - 2h Report)',
        sample: 'Venous Blood (2 mL EDTA + Plain)',
        notes: 'Fasting not required. Immediate collection at nearest CHC / PHC Tigiria.'
      }
    },
    {
      id: 'msg-6',
      msgType: 'rx',
      sender: 'doctor',
      senderName: 'Dr. Soumya Ranjan Nayak',
      time: '10:04 AM',
      data: {
        drugName: 'Tab. Paracetamol 650mg PO TID SOS',
        regimen: '1 Tablet • 3 Times Daily • After Meals • 3 Days',
        instructions: 'Strictly avoid Aspirin / Ibuprofen / NSAIDs. Maintain 2.5L ORS hydration.',
        doctorReg: 'OMC-2017-66431'
      }
    }
  ]);

  // AI Scribe & Live Clinical Dialogue State
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);
  const [clinicalSoapNotes, setClinicalSoapNotes] = useState({
    subjective: '3-day acute febrile illness with retro-orbital headache, arthralgia, postural dizziness. Denies spontaneous bleeding or dark stools.',
    objective: 'BP: 104/68 mmHg, Pulse: 106 bpm (tachycardia), SpO2: 97% on room air, Temp: 101.4°F, RR: 20/min. Oral mucosa dry. No petechiae observed on forearm test.',
    assessment: 'Acute Febrile Syndrome - Suspicious of Dengue with warning signs (ICD-10: A97) vs Viral Pyrexia of Unknown Origin.',
    plan: '1. STAT NS1 Antigen + Platelet Count + Dengue Serology\n2. Oral Rehydration Solution (ORS Electral) 2.5 - 3.0 Liters/day\n3. Tab Paracetamol 650mg PO TID SOS for fever > 100°F (Do NOT take NSAIDs / Ibuprofen)\n4. Red-flag advisory: Report to DHH / CHC if abdominal pain, repeated vomiting, or bleeding occurs.'
  });

  // Multilingual Dialogue Stream for Live Captions
  const captionDialogues = useMemo(() => {
    return {
      'or-IN': [
        { speaker: 'Dr. S. R. Nayak', text: 'ନମସ୍କାର ରମେଶ୍ୱର ବାବୁ! ଆପଣଙ୍କ ଜ୍ୱର କେବେଠାରୁ ଆରମ୍ଭ ହେଲା? ଶରୀରରେ ଯନ୍ତ୍ରଣା ଅଛି କି?' },
        { speaker: 'Rameshwar Lal', text: '୩ ଦିନ ହେଲା ପ୍ରବଳ ଥଣ୍ଡା ସହ ଉଚ୍ଚ ଜ୍ୱର ହେଉଛି । ଆଖି ପଛରେ ଓ ଆଣ୍ଠୁରେ ପ୍ରବଳ ଯନ୍ତ୍ରଣା ହେଉଛି ।' },
        { speaker: 'Dr. S. R. Nayak', text: 'ମୁଁ ଦେଖୁଛି ଆପଣଙ୍କ ପଲ୍ସ ୧୦୬ ଅଛି । ଦୟାକରି ଆପଣଙ୍କ ଜିଭ ଓ ଗଳା କ୍ୟାମେରା ଆଗରେ ଦେଖାନ୍ତୁ ।' },
        { speaker: 'ASHA Minati', text: 'ସାର୍, ଆମେ ଘରେ ତାଙ୍କ ରକ୍ତଚାପ (BP) ମାପିଛୁ ୧୦୪/୬୮ ଏବଂ SpO2 ୯୭% ଅଛି ।' },
        { speaker: 'Dr. S. R. Nayak', text: 'ଧନ୍ୟବାଦ । ଡେଙ୍ଗୁ NS1 ଟେଷ୍ଟ କରନ୍ତୁ । ଦିନକୁ ୨-୩ ଲିଟର ORS ପାଣି ପିଅନ୍ତୁ । ଆଇବୁପ୍ରୋଫେନ୍ ଜମା ନେବେ ନାହିଁ ।' }
      ],
      'hi-IN': [
        { speaker: 'Dr. S. R. Nayak', text: 'नमस्ते रामेश्वर जी! आपको बुखार कितने दिनों से है? क्या आँखों के पीछे या बदन में दर्द है?' },
        { speaker: 'Rameshwar Lal', text: 'डॉक्टर साहब, ३ दिनों से तेज बुखार और कंपकंपी है। सिर और जोड़ों में बहुत दर्द है।' },
        { speaker: 'Dr. S. R. Nayak', text: 'आपका पल्स १०६ बीपीएम है। कृपया जीभ और गला कैमरे के सामने दिखाएं।' },
        { speaker: 'ASHA Minati', text: 'सर, हमने इनका बीपी १०४/६८ और ऑक्सीजन ९७% चेक किया है।' },
        { speaker: 'Dr. S. R. Nayak', text: 'बहुत बढ़िया। डेंगू NS1 टेस्ट करवाएं और दिन में २-३ लीटर ओआरएस पिएं। केवल पैरासिटामोल लें।' }
      ],
      'en-IN': [
        { speaker: 'Dr. S. R. Nayak', text: 'Hello Rameshwar! Tell me about the fever onset. Any chills or retro-orbital pain?' },
        { speaker: 'Rameshwar Lal', text: 'High fever for 3 days with intense shivering, severe headache behind my eyes, and joint stiffness.' },
        { speaker: 'Dr. S. R. Nayak', text: 'Noted. Pulse is elevated at 106 bpm. Please open your mouth towards the light to inspect the pharynx.' },
        { speaker: 'ASHA Minati', text: 'Doctor, preliminary vitals at PHC outpost show BP 104/68 mmHg, SpO2 97% on room air.' },
        { speaker: 'Dr. S. R. Nayak', text: 'Good. We will order a STAT NS1 Antigen & Platelet count. Drink 2-3L ORS daily; avoid all NSAIDs.' }
      ]
    }[lang] || [];
  }, [lang]);

  // Cycle Live Closed Captions during connected call
  useEffect(() => {
    let interval = null;
    if (callState === 'connected' && showClosedCaptions && captionDialogues.length > 0) {
      interval = setInterval(() => {
        setActiveCaptionIndex((prev) => (prev + 1) % captionDialogues.length);
      }, 5500);
    }
    return () => clearInterval(interval);
  }, [callState, showClosedCaptions, captionDialogues]);

  // Video & Stream DOM Refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const signalingChannelRef = useRef(null);
  const videoContainerRef = useRef(null);
  const chatBottomRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Digital Patient Informed Consent Checkboxes
  const [consentChecks, setConsentChecks] = useState({
    identityConsent: true,
    audioVideoConsent: true,
    ePrescriptionConsent: true,
    dataPrivacyConsent: true
  });

  // Translations
  const txt = {
    'or-IN': {
      title: 'ଇନ୍-ଆପ୍ ୱେବ୍-ଆର୍-ଟି-ସି ଟେଲିମେଡିସିନ୍ ପରାମର୍ଶ',
      subtitle: 'ଡାକ୍ତର-ରୋଗୀ ଲାଇଭ୍ ଭିଡିଓ କଲ୍ • ଇ-ସଞ୍ଜୀବନୀ ଓ ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (NHM)',
      lobbyTitle: 'ଡିଜିଟାଲ୍ ଓପିଡି ଭିଡିଓ କନସଲଟେସନ୍ ଲବି',
      lobbyDesc: 'ଜାତୀୟ ଟେଲିମେଡିସିନ୍ ନିର୍ଦ୍ଦେଶାବଳୀ ଅନୁଯାୟୀ ଏନକ୍ରିପ୍ଟେଡ୍ ଭିଡିଓ ପରାମର୍ଶ କକ୍ଷ ।',
      joinAsDoctor: 'ଡାକ୍ତର ଭାବରେ ଯୋଗ ଦିଅନ୍ତୁ (RMP କକ୍ଷ)',
      joinAsPatient: 'ରୋଗୀ ଭାବରେ ଯୋଗ ଦିଅନ୍ତୁ (ABHA ଯାଞ୍ଚ)',
      enterRoomId: 'କନସଲ୍ଟେସନ୍ ରୁମ୍ ID ଲେଖନ୍ତୁ',
      startCallBtn: 'ଭିଡିଓ ପରାମର୍ଶ ଆରମ୍ଭ କରନ୍ତୁ',
      connectingTitle: 'ସୁରକ୍ଷିତ ୱେବ୍-ଆର୍-ଟି-ସି ସଂଯୋଗ ହେଉଛି...',
      consentTitle: 'ମୋହଫ୍‌ଡବ୍ଲୁ (MoHFW) ଟେଲିମେଡିସିନ୍ ଡିଜିଟାଲ୍ ସମ୍ମତି ପତ୍ର',
      consentSubtitle: 'ପରାମର୍ଶ ଆରମ୍ଭ କରିବା ପୂର୍ବରୁ ସମସ୍ତ ସର୍ତ୍ତାବଳୀ ଗ୍ରହଣ କରନ୍ତୁ:',
      checkIdentity: 'ମୁଁ ସ୍ୱେଚ୍ଛାକୃତ ଭାବରେ ମୋର ପରିଚୟ (ABHA / ଆଧାର) ପ୍ରଦାନ କରୁଛି ।',
      checkAv: 'ଡାକ୍ତରୀ ନିରୀକ୍ଷଣ ପାଇଁ ଲାଇଭ୍ ଭିଡିଓ ଏବଂ ଅଡିଓ ଯୋଗାଯୋଗରେ ସହମତ ।',
      checkRx: 'ଟେଲି-ପରାମର୍ଶ ପରେ ଡିଜିଟାଲ୍ କ୍ୟୁଆର୍ ପ୍ରିସ୍କ୍ରିପସନ୍ ଗ୍ରହଣ କରିବାକୁ ପ୍ରସ୍ତୁତ ।',
      checkPrivacy: 'ମୋର ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଗୋପନୀୟତା ନିୟମାବଳୀ ମୁତାବକ ସଂରକ୍ଷିତ ରହିବ ।',
      btnProceedCall: 'ସମ୍ମତି ପୂର୍ବକ ଭିଡିଓ କକ୍ଷକୁ ପ୍ରବେଶ କରନ୍ତୁ',
      endCallBtn: 'କଲ୍ ଶେଷ କରନ୍ତୁ',
      tabChat: 'ଲାଇଭ୍ ଚାଟ୍',
      tabVitals: 'ରୋଗୀ ଭାଇଟାଲ୍ସ',
      tabSoap: 'AI କ୍ଲିନିକାଲ୍ ସ୍କ୍ରାଇବ୍ (SOAP)',
      typeMessage: 'ଡାକ୍ତରଙ୍କ ସହିତ ବାର୍ତ୍ତାଳାପ ଲେଖନ୍ତୁ...',
      sendBtn: 'ପଠାନ୍ତୁ',
      btnGenerateRx: 'ତୁରନ୍ତ NMC ପ୍ରିସ୍କ୍ରିପସନ୍ ଲେଖନ୍ତୁ',
      callEndedTitle: 'ଟେଲିମେଡିସିନ୍ ପରାମର୍ଶ ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ ହେଲା',
      callDurationLabel: 'ପରାମର୍ଶ ଅବଧି:',
      reconnectBtn: 'ପୁନର୍ବାର କଲ୍ କରନ୍ତୁ',
      backToDesk: 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ',
      ashaToggle: 'ଆଶା କର୍ମୀ ଯୋଗଦାନ',
      zoomLabel: 'ଜୁମ୍',
      quickPlanTitle: 'କ୍ଲିନିକାଲ୍ ଔଷଧ ଯୋଡନ୍ତୁ'
    },
    'hi-IN': {
      title: 'इन-ऐप WebRTC टेलीमेडिसिन परामर्श',
      subtitle: 'डॉक्टर-मरीज लाइव वीडियो कंसल्टेशन • ई-संजीवनी एवं राष्ट्रीय स्वास्थ्य मिशन',
      lobbyTitle: 'डिजिटल ओपीडी वीडियो परामर्श लॉबी',
      lobbyDesc: 'राष्ट्रीय टेलीमेडिसिन दिशानिर्देशों के अनुरूप एनक्रिप्टेड वीडियो परामर्श कक्ष।',
      joinAsDoctor: 'डॉक्टर के रूप में जुड़ें (RMP केबिन)',
      joinAsPatient: 'मरीज के रूप में जुड़ें (ABHA सत्यापन)',
      enterRoomId: 'कंसल्टेशन रूम ID दर्ज करें',
      startCallBtn: 'वीडियो परामर्श शुरू करें',
      connectingTitle: 'सुरक्षित WebRTC कनेक्शन स्थापित हो रहा है...',
      consentTitle: 'MoHFW टेलीमेडिसिन डिजिटल सहमति पत्र',
      consentSubtitle: 'परामर्श शुरू करने से पहले डिजिटल सहमति अनिवार्य है:',
      checkIdentity: 'मैं स्वेच्छा से अपनी पहचान (ABHA / आधार) साझा कर रहा हूँ।',
      checkAv: 'नैदानिक परीक्षण हेतु लाइव वीडियो एवं ऑडियो वार्तालाप में सहमत हूँ।',
      checkRx: 'परामर्शोपरांत डिजिटल QR प्रिस्क्रिप्शन प्राप्त करने हेतु सहमत हूँ।',
      checkPrivacy: 'मेरा स्वास्थ्य डेटा पूर्णतः सुरक्षित एवं गोपनीय रहेगा।',
      btnProceedCall: 'सहमति दर्ज कर वीडियो कक्ष में प्रवेश करें',
      endCallBtn: 'कॉल समाप्त करें',
      tabChat: 'लाइव चैट',
      tabVitals: 'मरीज वाइटल्स',
      tabSoap: 'AI क्लिनिकल स्क्राइब (SOAP)',
      typeMessage: 'डॉक्टर के साथ संवाद लिखें...',
      sendBtn: 'भेजें',
      btnGenerateRx: 'तत्काल NMC प्रिस्क्रिप्शन बनाएं',
      callEndedTitle: 'टेलीमेडिसिन परामर्श सफलतापूर्वक संपन्न हुआ',
      callDurationLabel: 'परामर्श समय:',
      reconnectBtn: 'पुनः कॉल करें',
      backToDesk: 'डैशबोर्ड पर लौटें',
      ashaToggle: 'आशा कार्यकर्ता शामिल करें',
      zoomLabel: 'ज़ूम',
      quickPlanTitle: 'शीघ्र औषधि जोड़ें'
    },
    'en-IN': {
      title: 'In-App WebRTC Telemedicine Suite',
      subtitle: 'Live Doctor-Patient Video Consultation • eSanjeevani & ABDM Aligned',
      lobbyTitle: 'Digital OPD Teleconsultation Lobby',
      lobbyDesc: 'End-to-end encrypted medical video consultation per MoHFW Telemedicine Guidelines 2020.',
      joinAsDoctor: 'Join as Doctor (RMP Cockpit)',
      joinAsPatient: 'Join as Patient (ABHA Verified)',
      enterRoomId: 'Consultation Room ID',
      startCallBtn: 'Start Teleconsultation',
      connectingTitle: 'Establishing Secure WebRTC Peer Connection...',
      consentTitle: 'MoHFW Digital Informed Consent Mandate',
      consentSubtitle: 'Please review and accept telemedicine terms before video connection:',
      checkIdentity: 'I verify my demographic identity (ABHA / Government ID).',
      checkAv: 'I consent to real-time audio-video assessment for clinical diagnosis.',
      checkRx: 'I agree to receive a digitally signed NMC QR prescription & referral if needed.',
      checkPrivacy: 'I understand clinical confidentiality under DISHA and Digital Personal Data Protection.',
      btnProceedCall: 'Consent & Enter Video Room',
      endCallBtn: 'End Consultation',
      tabChat: 'In-Call Chat',
      tabVitals: 'Patient Vitals',
      tabSoap: 'AI Scribe (SOAP)',
      typeMessage: 'Type message or clinical question...',
      sendBtn: 'Send',
      btnGenerateRx: 'Write NMC Prescription',
      callEndedTitle: 'Teleconsultation Completed Successfully',
      callDurationLabel: 'Consultation Duration:',
      reconnectBtn: 'Re-join Session',
      backToDesk: 'Return to Dashboard',
      ashaToggle: '3-Way ASHA Call',
      zoomLabel: 'Exam Zoom',
      quickPlanTitle: 'Quick Rx Additives'
    }
  }[lang] || {};

  // Setup Web Audio Analyser for Real Microphone VU Meter
  const setupAudioAnalyser = (stream) => {
    try {
      const audioTrack = stream?.getAudioTracks?.()[0];
      if (!audioTrack) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.max(12, Math.round((avg / 110) * 100)));
        setAudioLevel(normalized);
        animFrameRef.current = requestAnimationFrame(updateMeter);
      };
      updateMeter();
    } catch (e) {
      console.warn('Audio meter analyser fallback active:', e);
    }
  };

  // Initialize Media Devices on Room Entry
  const startLocalMedia = async () => {
    try {
      setMediaPermissionError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setupAudioAnalyser(stream);
      }
    } catch (err) {
      console.warn('Camera/Mic permission warning. Interactive virtual stream active:', err);
      setMediaPermissionError('Virtual High-Fidelity Simulation Stream Active (Hardware webcam optional)');
    }
  };

  // Stop Media Streams cleanly
  const stopLocalMedia = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // BroadcastChannel WebRTC Signaling for multi-tab / real network peer connections
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(`nhp_teleconsult_${roomId}`);
      signalingChannelRef.current = channel;

      channel.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'CHAT_MESSAGE') {
          setChatMessages((prev) => [...prev, payload]);
          playTone('message');
        } else if (type === 'USER_JOINED') {
          if (callState === 'connecting') {
            setCallState('connected');
            playTone('connect');
          }
        } else if (type === 'CALL_ENDED') {
          handleEndCall(false);
        }
      };

      return () => {
        channel.close();
      };
    } catch (e) {
      console.warn('BroadcastChannel not supported in this environment:', e);
    }
  }, [roomId, callState]);

  // Duration Timer when call is connected
  useEffect(() => {
    let interval = null;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
        if (!analyserRef.current) {
          setAudioLevel((prev) => Math.min(95, Math.max(15, Math.floor(Math.random() * 80))));
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  // Toggle Microphone
  const toggleAudio = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsAudioMuted((prev) => !prev);
  };

  // Toggle Video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoDisabled((prev) => !prev);
  };

  // Toggle Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await startLocalMedia();
      setIsScreenSharing(false);
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          screenStream.getVideoTracks()[0].onended = () => {
            startLocalMedia();
            setIsScreenSharing(false);
          };
          setIsScreenSharing(true);
        } else {
          alert('Screen sharing is not supported by your browser.');
        }
      } catch (err) {
        console.warn('Screen share canceled or failed:', err);
      }
    }
  };

  // Send In-Call Standard Chat Message
  const handleSendChat = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!inputChat.trim()) return;

    handleSendSpecialMessage('text', {}, inputChat.trim());
    setInputChat('');
  };

  // Send Multi-Type Clinical Message (Text, Rx, Vitals, Lab, Image, Audio, Triage Query)
  const handleSendSpecialMessage = (msgType = 'text', data = {}, text = '') => {
    const newMsg = {
      id: `msg-${Date.now()}`,
      msgType,
      sender: activeRole,
      senderName: activeRole === 'doctor' ? doctorData.name : patientData.name,
      text: text || '',
      data,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, newMsg]);
    playTone('message');
    setShowAttachmentMenu(false);

    // Broadcast to remote peer
    if (signalingChannelRef.current) {
      try {
        signalingChannelRef.current.postMessage({ type: 'CHAT_MESSAGE', payload: newMsg });
      } catch (err) {}
    }

    setTimeout(() => {
      if (chatBottomRef.current) {
        chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Handle Play Voice Note Simulation
  const handlePlayVoiceNote = (msgId) => {
    if (playingAudioId === msgId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(msgId);
      playTone('audio_note');
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 3500);
    }
  };

  // Copy Meeting Room Link
  const handleCopyLink = () => {
    const link = `${window.location.origin}/?teleconsult=${roomId}`;
    navigator.clipboard.writeText(link).catch(() => {});
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Copy SOAP Notes
  const handleCopySoap = () => {
    const text = `--- ODISHA DIGITAL HEALTH MISSION: TELEMEDICINE ENCOUNTER NOTE ---\nPatient: ${patientData.name} | ABHA: ${patientData.abhaId}\nDoctor: ${doctorData.name} | Reg: ${doctorData.regNo}\nEncounter Room: ${roomId} | Duration: ${formatTime(callDuration)}\n\n[SUBJECTIVE]\n${clinicalSoapNotes.subjective}\n\n[OBJECTIVE]\n${clinicalSoapNotes.objective}\n\n[ASSESSMENT]\n${clinicalSoapNotes.assessment}\n\n[PLAN]\n${clinicalSoapNotes.plan}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedSoap(true);
    setTimeout(() => setCopiedSoap(false), 2500);
  };

  // Download Encounter Summary TXT
  const handleDownloadEncounter = () => {
    const text = `--- ODISHA HEALTH TELEMEDICINE ENCOUNTER RECORD ---\nDate: ${new Date().toLocaleDateString('en-IN')}\nRoom ID: ${roomId}\nDuration: ${formatTime(callDuration)}\n\nPatient Name: ${patientData.name}\nAge/Gender: ${patientData.age} Y / ${patientData.gender}\nABHA ID: ${patientData.abhaId}\nPhone: ${patientData.phone}\nDistrict: ${patientData.district}\n\nVitals: BP: ${patientData.vitals.bp}, Pulse: ${patientData.vitals.pulse}, SpO2: ${patientData.vitals.spo2}, Temp: ${patientData.vitals.temp}\n\nTreating Physician: ${doctorData.name}\nQualifications: ${doctorData.degrees}\nOMC Reg No: ${doctorData.regNo}\nFacility: ${doctorData.facility}\n\n[SOAP CLINICAL SUMMARY]\nSubjective:\n${clinicalSoapNotes.subjective}\n\nObjective:\n${clinicalSoapNotes.objective}\n\nAssessment:\n${clinicalSoapNotes.assessment}\n\nPlan:\n${clinicalSoapNotes.plan}\n\nVerified under MoHFW Telemedicine Guidelines 2020.`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Encounter-${roomId}-${patientData.name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Append Quick Rx Item to SOAP Plan
  const handleAddQuickRemedy = (item) => {
    setClinicalSoapNotes((prev) => ({
      ...prev,
      plan: `${prev.plan}\n• ${item}`
    }));
  };

  // Native Picture-in-Picture trigger
  const handleTriggerPiP = async () => {
    if (localVideoRef.current && document.pictureInPictureEnabled) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await localVideoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('PiP not permitted or active:', err);
      }
    }
  };

  // Advance from Lobby to Consent Step
  const handleProceedToConsent = () => {
    setCallState('consenting');
  };

  // Connect Call after Consent Verified
  const handleEnterCall = async () => {
    setCallState('connecting');
    await startLocalMedia();

    if (signalingChannelRef.current) {
      try {
        signalingChannelRef.current.postMessage({ type: 'USER_JOINED' });
      } catch (e) {}
    }

    setTimeout(() => {
      setCallState('connected');
      playTone('connect');
    }, 1100);
  };

  // End Call Cleanly
  const handleEndCall = (broadcast = true) => {
    playTone('end');
    if (broadcast && signalingChannelRef.current) {
      try {
        signalingChannelRef.current.postMessage({ type: 'CALL_ENDED' });
      } catch (e) {}
    }
    stopLocalMedia();
    setCallState('ended');
  };

  // Toggle Full Screen Mode
  const toggleFullScreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullScreen(false);
    }
  };

  // Capture In-Call Clinical Examination Photo & attach to SOAP
  const handleCaptureExamSnapshot = () => {
    playTone('audio_note');
    const newSnapshot = {
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=700&q=80',
      caption: `Clinical Exam Snapshot • ${patientData.name} • ${formatTime(callDuration)} • Room: ${roomId}`
    };
    handleSendSpecialMessage('image', newSnapshot);
    setClinicalSoapNotes((prev) => ({
      ...prev,
      objective: `${prev.objective}\n• Attached Clinical Snapshot: Pharyngeal inspection captured at ${formatTime(callDuration)}.`
    }));
  };

  // Sync Bluetooth Peripheral Vitals (Pulse Oximeter & BP Cuff)
  const handleSyncBluetoothVitals = () => {
    setIsSyncingVitals(true);
    playTone('connect');
    setTimeout(() => {
      const updatedVitals = {
        bp: '118/74 mmHg',
        pulse: '84 bpm',
        spo2: '98%',
        temp: '99.4°F',
        rr: '18/min'
      };
      setPatientData((prev) => ({
        ...prev,
        vitals: updatedVitals,
        acuity: 'GREEN'
      }));
      handleSendSpecialMessage('vitals', {
        ...updatedVitals,
        acuity: 'GREEN',
        source: 'Synced via Bluetooth BLE (Omron HEM-7120 & ChoiceMMed Oximeter)'
      });
      setIsSyncingVitals(false);
      playTone('connect');
    }, 1200);
  };

  // Launch Instant NMC Prescription Suite with current patient pre-loaded
  const handleOpenNmcPrescription = () => {
    if (onNavigateToNmc) {
      onNavigateToNmc(patientData);
    } else {
      setShowNmcRxModal(true);
    }
  };

  // Dispatch Prescription to WhatsApp
  const handleSendWhatsAppRx = () => {
    setWhatsappSentNotice(true);
    playTone('message');
    setTimeout(() => setWhatsappSentNotice(false), 3500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-4">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & TELEMEDICINE STATUS BAR                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 text-white flex items-center justify-center shadow-md shrink-0">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                {txt.title}
              </h2>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black rounded-md border border-emerald-300 dark:border-emerald-700 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>e-Sanjeevani ABDM</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {txt.subtitle}
            </p>
          </div>
        </div>

        {/* Room Code Badge & Role Switcher */}
        <div className="flex items-center flex-wrap gap-2 self-stretch md:self-auto justify-end">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <span>Room:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black">{roomId}</span>
            <button
              onClick={handleCopyLink}
              className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all text-slate-500 hover:text-slate-900 cursor-pointer"
              title="Copy consultation invite link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Quick Role Toggle (Doctor vs Patient) for interactive testing */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold">
            <button
              onClick={() => setActiveRole('doctor')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeRole === 'doctor'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Doctor View</span>
            </button>
            <button
              onClick={() => setActiveRole('patient')}
              className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeRole === 'patient'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Patient View</span>
            </button>
          </div>

          {onNavigateBack && (
            <button
              onClick={onNavigateBack}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {txt.backToDesk}
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. STATE A: LOBBY & PRE-FLIGHT HARDWARE TEST                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {callState === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          {/* Left Column: Camera Preview Box */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 rounded-2xl p-6 min-h-[380px] relative overflow-hidden border border-slate-800 text-white shadow-inner">
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-slate-700 flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>WebRTC Pre-Flight Testing</span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 text-center z-10 max-w-sm">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-600 to-indigo-700 p-1 shadow-2xl relative">
                {activeRole === 'doctor' ? (
                  <DoctorAvatar
                    gender="Male"
                    name={doctorData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-3xl font-black text-amber-300">
                    RL
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-950">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-black">
                  {activeRole === 'doctor' ? doctorData.name : patientData.name}
                </h3>
                <p className="text-xs text-slate-400">
                  {activeRole === 'doctor' ? `${doctorData.degrees} • ${doctorData.regNo}` : `ABHA: ${patientData.abhaId} • ${patientData.district}`}
                </p>
              </div>

              {/* Hardware Quick Test Buttons */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAudioMuted ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isAudioMuted ? 'Unmute Microphone' : 'Mute Microphone'}
                >
                  {isAudioMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span className="text-xs">{isAudioMuted ? 'Mic Muted' : 'Mic Ready'}</span>
                </button>

                <button
                  type="button"
                  onClick={toggleVideo}
                  className={`p-3 rounded-2xl transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVideoDisabled ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isVideoDisabled ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoDisabled ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  <span className="text-xs">{isVideoDisabled ? 'Camera Off' : 'Camera Ready'}</span>
                </button>
              </div>

              {/* Real-time Microphone VU Meter in Lobby */}
              <div className="flex items-center gap-2 bg-slate-900/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs">
                <span className="text-[10px] text-slate-400 font-mono">MIC INPUT:</span>
                <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-100"
                    style={{ width: `${isAudioMuted ? 0 : audioLevel}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-emerald-400">{isAudioMuted ? '0%' : `${audioLevel}%`}</span>
              </div>

              {mediaPermissionError && (
                <div className="text-[11px] text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1.5 rounded-xl">
                  {mediaPermissionError}
                </div>
              )}
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Latency: 24ms • 1080p HD</span>
              </span>
              <span>DTLS-SRTP AES-256</span>
            </div>
          </div>

          {/* Right Column: Appointment Details & Join Room */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {txt.lobbyTitle}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  Ready for Consultation
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {txt.lobbyDesc}
                </p>
              </div>

              {/* Patient / Doctor Summary Card */}
              <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-bold text-slate-500">Patient File:</span>
                  <span className="text-xs font-black text-slate-900 dark:text-white">{patientData.name}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Age & Gender:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{patientData.age} Yrs • {patientData.gender}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Chief Complaint:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-right max-w-[200px] truncate">{patientData.chiefComplaint}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Consulting RMP:</span>
                  <span className="font-bold text-indigo-700 dark:text-indigo-400">{doctorData.name}</span>
                </div>
              </div>

              {/* Consultation Room Code Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {txt.enterRoomId}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="e.g. TELE-OD-8820"
                  />
                  <button
                    type="button"
                    onClick={() => setRoomId(`TELE-OD-${Math.floor(1000 + Math.random() * 9000)}`)}
                    className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    title="Generate new room ID"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Launch Call Button */}
            <button
              type="button"
              onClick={handleProceedToConsent}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25 transition-all cursor-pointer"
            >
              <Video className="w-5 h-5 text-indigo-200" />
              <span>{txt.startCallBtn}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. STATE B: MOHFW DIGITAL INFORMED CONSENT STEP              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {callState === 'consenting' && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-2xl">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {txt.consentTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {txt.consentSubtitle}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { id: 'identityConsent', text: txt.checkIdentity },
              { id: 'audioVideoConsent', text: txt.checkAv },
              { id: 'ePrescriptionConsent', text: txt.checkRx },
              { id: 'dataPrivacyConsent', text: txt.checkPrivacy }
            ].map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={consentChecks[item.id]}
                  onChange={(e) =>
                    setConsentChecks((prev) => ({ ...prev, [item.id]: e.target.checked }))
                  }
                  className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {item.text}
                </span>
              </label>
            ))}
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Emergency Limitation Notice:</strong> Telemedicine is not a substitute for in-person emergency care in life-threatening conditions (e.g. active massive hemorrhage, cardiac arrest, coma). In acute critical emergencies, call <strong>108 Ambulance</strong> immediately.
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCallState('lobby')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Back to Lobby
            </button>
            <button
              type="button"
              disabled={!Object.values(consentChecks).every(Boolean)}
              onClick={handleEnterCall}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{txt.btnProceedCall}</span>
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. STATE C: CONNECTING MODAL OVERLAY                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {callState === 'connecting' && (
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl text-center space-y-4">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mx-auto"></div>
          <h3 className="text-base font-black text-slate-900 dark:text-white">
            {txt.connectingTitle}
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            STUN Handshake: stun.l.google.com:19302
          </p>
          <div className="text-[11px] text-slate-400">
            Admitting {patientData.name} into virtual clinical consultation cabin...
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. STATE D: ACTIVE LIVE WEBRTC CALL INTERFACE                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      {callState === 'connected' && (
        <div
          ref={videoContainerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-950 text-white rounded-3xl p-3 sm:p-5 border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          {/* Main Video Viewport (8 Columns) */}
          <div className="lg:col-span-8 flex flex-col justify-between space-y-3 min-h-[500px]">
            {/* Top Video HUD Header */}
            <div className="flex items-center justify-between bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800 z-10">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>LIVE {formatTime(callDuration)}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs text-slate-300 font-medium truncate max-w-[200px] sm:max-w-none">
                  {activeRole === 'doctor' ? `Consulting: ${patientData.name}` : `Doctor: ${doctorData.name}`}
                </span>
              </div>

              {/* Action Controls Header */}
              <div className="flex items-center gap-2 text-xs">
                {/* 3-Way ASHA Toggle */}
                <button
                  type="button"
                  onClick={() => setIncludeAsha((prev) => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    includeAsha ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                  title="Toggle 3-Way Call with Rural ASHA Outpost Worker"
                >
                  <Users className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{txt.ashaToggle}</span>
                </button>

                {/* Subtitles Toggle */}
                <button
                  type="button"
                  onClick={() => setShowClosedCaptions((prev) => !prev)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    showClosedCaptions ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                  title="Toggle Real-Time Multilingual Closed Captions"
                >
                  CC
                </button>

                {/* Zoom Controls */}
                <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.5))}
                    disabled={zoomLevel <= 1}
                    className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Zoom Out Examination"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 font-bold text-amber-300">{zoomLevel}x</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(3, z + 0.5))}
                    disabled={zoomLevel >= 3}
                    className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    title="Zoom In (Inspect Pharynx/Skin)"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Clinical Camera Snapshot Button */}
                <button
                  type="button"
                  onClick={handleCaptureExamSnapshot}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                  title="Capture Examination Photo & Append to SOAP Record"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Snapshot</span>
                </button>

                {/* Millimeter Measurement Grid Overlay */}
                <button
                  type="button"
                  onClick={() => setShowMeasurementGrid((g) => !g)}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold ${
                    showMeasurementGrid ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title="Toggle Millimeter Examination Grid for Skin/Throat Analysis"
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Grid</span>
                </button>

                <span className="text-[11px] font-mono text-emerald-400 hidden md:inline">
                  {networkQuality}
                </span>

                <button
                  type="button"
                  onClick={toggleFullScreen}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
                  title="Toggle Fullscreen"
                >
                  {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Video Canvas Container (Main Remote Feed + Picture-in-Picture Local Feed) */}
            <div className="relative flex-1 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[400px]">
              {/* Scalable Video Frame for Clinical Examination Zoom */}
              <div
                className="w-full h-full flex flex-col items-center justify-center relative transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                {activeRole === 'doctor' ? (
                  // Doctor looking at Patient
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 via-orange-600 to-amber-700 flex items-center justify-center text-5xl font-black text-white shadow-2xl ring-4 ring-amber-500/40 relative">
                      RL
                      <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{patientData.name}</h4>
                      <p className="text-xs text-slate-400">ABHA: {patientData.abhaId} • Cuttack, Odisha</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full text-[11px] border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Patient Audio Stream Active • 48 kHz Opus</span>
                    </div>
                  </div>
                ) : (
                  // Patient looking at Doctor
                  <div className="flex flex-col items-center space-y-3 text-center">
                    <div className="w-36 h-36 rounded-full overflow-hidden shadow-2xl ring-4 ring-indigo-500/40 relative">
                      <DoctorAvatar
                        gender="Male"
                        name={doctorData.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white">{doctorData.name}</h4>
                      <p className="text-xs text-indigo-300 font-semibold">{doctorData.degrees}</p>
                      <p className="text-[11px] text-slate-400">{doctorData.facility}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1 rounded-full text-[11px] border border-slate-700">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Verified RMP • Odisha Medical Council ({doctorData.regNo})</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Millimeter Medical Calibration Grid Overlay */}
              {showMeasurementGrid && (
                <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, rgba(245, 158, 11, 0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 158, 11, 0.35) 1px, transparent 1px)',
                      backgroundSize: '24px 24px'
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-amber-950/90 border border-amber-500/60 text-amber-300 px-2 py-0.5 rounded text-[9px] font-mono">
                    CALIBRATED 10mm DERMATOLOGY SCALE
                  </div>
                  {/* Center Reticle */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border border-amber-400/80 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-amber-400 rounded-full" />
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Live Vitals HUD Floating Overlay */}
              <div className="absolute top-3 left-3 bg-slate-900/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-700/80 text-[10px] space-y-1.5 shadow-xl select-none hidden sm:block z-20">
                <div className="flex items-center justify-between gap-3 text-slate-400 font-bold border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <HeartPulse className="w-3 h-3 text-rose-500 animate-pulse" />
                    <span>VITALS TELEMETRY</span>
                  </span>
                  <span className="text-amber-400 font-mono">{patientData.acuity} ACUITY</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-slate-200">
                  <span>SpO2: <strong className="text-emerald-400">{patientData.vitals.spo2}</strong></span>
                  <span>Pulse: <strong className="text-amber-400">{patientData.vitals.pulse}</strong></span>
                  <span>BP: <strong>{patientData.vitals.bp}</strong></span>
                  <span>Temp: <strong className="text-rose-400">{patientData.vitals.temp}</strong></span>
                </div>
                <div className="pt-1 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] text-slate-500 font-mono">BLE Omron/ChoiceMMed</span>
                  <button
                    type="button"
                    onClick={handleSyncBluetoothVitals}
                    disabled={isSyncingVitals}
                    className="flex items-center gap-1 text-[9px] font-bold text-sky-400 hover:text-sky-300 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isSyncingVitals ? 'animate-spin' : ''}`} />
                    <span>{isSyncingVitals ? 'Syncing...' : 'Sync BLE'}</span>
                  </button>
                </div>
              </div>

              {/* 3-Way ASHA Worker Outpost Floating Feed (When Enabled) */}
              {includeAsha && (
                <div className="absolute top-3 right-3 w-36 h-28 bg-slate-950/95 rounded-xl overflow-hidden border border-teal-500/80 shadow-2xl z-20 flex flex-col items-center justify-center p-2 text-center">
                  <div className="w-9 h-9 rounded-full bg-teal-800 text-teal-200 flex items-center justify-center font-bold text-xs shadow-inner">
                    ASHA
                  </div>
                  <div className="text-[10px] font-bold text-teal-300 mt-1 truncate max-w-full">
                    Smt. Minati Behera
                  </div>
                  <div className="text-[8px] text-slate-400 truncate max-w-full">
                    PHC Tigiria, Cuttack
                  </div>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Vitals Verified</span>
                  </div>
                </div>
              )}

              {/* Live Closed Captions (Live Subtitles Banner) */}
              {showClosedCaptions && captionDialogues.length > 0 && (
                <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-center pointer-events-none">
                  <div className="max-w-xl bg-slate-950/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2 text-center shadow-2xl flex items-center gap-2.5">
                    <span className="px-2 py-0.5 bg-indigo-900/80 text-indigo-300 text-[10px] font-black rounded-full shrink-0 border border-indigo-700/60">
                      {captionDialogues[activeCaptionIndex].speaker}
                    </span>
                    <p className="text-xs text-slate-100 font-medium tracking-wide leading-relaxed">
                      "{captionDialogues[activeCaptionIndex].text}"
                    </p>
                  </div>
                </div>
              )}

              {/* Local Picture-in-Picture (PiP) Window */}
              <div className="absolute bottom-3 right-3 w-36 h-28 sm:w-44 sm:h-32 bg-slate-950 rounded-xl overflow-hidden border-2 border-indigo-500/80 shadow-2xl z-20 flex items-center justify-center group">
                {isVideoDisabled ? (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400">
                    <VideoOff className="w-5 h-5 mb-1 text-rose-400" />
                    <span className="text-[10px] font-bold">Camera Off</span>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover scale-x-[-1]"
                  />
                )}
                <div className="absolute bottom-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
                  <span>You ({activeRole === 'doctor' ? 'Dr.' : 'Patient'})</span>
                </div>
                <button
                  type="button"
                  onClick={handleTriggerPiP}
                  className="absolute top-1.5 right-1.5 bg-black/70 hover:bg-black p-1 rounded text-white text-[9px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  title="Float Picture-in-Picture"
                >
                  PiP
                </button>
              </div>
            </div>

            {/* Bottom Call Media Controls Bar */}
            <div className="bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 z-10">
              <div className="flex items-center gap-2">
                {/* Mic Mute Button */}
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`p-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isAudioMuted
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isAudioMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isAudioMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  <span className="text-xs hidden md:inline">{isAudioMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                {/* Video Turn Off Button */}
                <button
                  type="button"
                  onClick={toggleVideo}
                  className={`p-3 rounded-2xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    isVideoDisabled
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title={isVideoDisabled ? 'Turn Camera On' : 'Turn Camera Off'}
                >
                  {isVideoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                  <span className="text-xs hidden md:inline">{isVideoDisabled ? 'Start Video' : 'Stop Video'}</span>
                </button>

                {/* Screen Share Button */}
                <button
                  type="button"
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-2xl font-bold transition-all cursor-pointer hidden sm:flex items-center gap-1.5 ${
                    isScreenSharing
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                  }`}
                  title="Share Screen to Review Scans / Lab Reports"
                >
                  <Monitor className="w-5 h-5" />
                  <span className="text-xs hidden md:inline">Share Screen</span>
                </button>
              </div>

              {/* Center Audio Level Waveform Indicator */}
              <div className="hidden md:flex items-center gap-1.5 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 font-mono">LIVE VU</span>
                <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden flex items-center">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-100"
                    style={{ width: `${isAudioMuted ? 0 : audioLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* End Consultation Button & NMC Link */}
              <div className="flex items-center gap-2">
                {activeRole === 'doctor' && (
                  <button
                    type="button"
                    onClick={handleOpenNmcPrescription}
                    className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                    title="Write and sign official NMC e-Prescription with QR code"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">{txt.btnGenerateRx}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleEndCall(true)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg hover:shadow-rose-500/25"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>{txt.endCallBtn}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Clinical Sidebar (4 Columns: Chat, Vitals, AI SOAP Scribe) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between overflow-hidden min-h-[500px]">
            {/* Sidebar Mode Tabs */}
            <div className="flex items-center border-b border-slate-800 bg-slate-950/60 p-1">
              <button
                type="button"
                onClick={() => setActiveSidePanel('chat')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeSidePanel === 'chat'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>{txt.tabChat}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSidePanel('notes')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeSidePanel === 'notes'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Scribe</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSidePanel('vitals')}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                  activeSidePanel === 'vitals'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Vitals</span>
              </button>
            </div>

            {/* PANEL 1: IN-CALL MULTI-TYPE CLINICAL CHAT */}
            {activeSidePanel === 'chat' && (
              <div className="flex-1 flex flex-col justify-between p-3 overflow-hidden">
                {/* Scrollable Message List */}
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[360px]">
                  {chatMessages.map((msg) => {
                    const isSelf = msg.sender === activeRole;

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col text-xs ${
                          msg.msgType === 'system'
                            ? 'items-center text-center my-1'
                            : isSelf
                            ? 'items-end'
                            : 'items-start'
                        }`}
                      >
                        {/* 1. SYSTEM AUDIT MESSAGE TYPE */}
                        {msg.msgType === 'system' && (
                          <div className="bg-slate-950/90 text-slate-400 text-[10px] px-3 py-1.5 rounded-full border border-slate-800 flex items-center gap-1.5 shadow-xs max-w-[95%]">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{msg.text}</span>
                          </div>
                        )}

                        {/* 2. STANDARD TEXT MESSAGE TYPE */}
                        {msg.msgType === 'text' && (
                          <div
                            className={`max-w-[85%] rounded-2xl p-2.5 space-y-1 shadow-sm ${
                              isSelf
                                ? 'bg-indigo-600 text-white rounded-br-none'
                                : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2 text-[10px] opacity-75 font-semibold">
                              <span>{msg.senderName}</span>
                              <span className="flex items-center gap-0.5">
                                <span>{msg.time}</span>
                                {isSelf && <CheckCheck className="w-3 h-3 text-indigo-200" />}
                              </span>
                            </div>
                            <p className="leading-relaxed text-xs">{msg.text}</p>
                          </div>
                        )}

                        {/* 3. VITALS TELEMETRY SNAPSHOT MESSAGE TYPE */}
                        {msg.msgType === 'vitals' && (
                          <div
                            className={`max-w-[90%] rounded-2xl p-3 border shadow-md space-y-2 ${
                              isSelf
                                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-100 rounded-br-none'
                                : 'bg-slate-900 border-slate-700 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                              <span className="flex items-center gap-1.5 text-[11px] font-black text-emerald-400">
                                <HeartPulse className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                <span>Vitals Snapshot</span>
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                {msg.data?.acuity || 'YELLOW'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                              <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-slate-400 block">Blood Pressure</span>
                                <strong className="text-white text-xs">{msg.data?.bp || '104/68'}</strong>
                              </div>
                              <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-slate-400 block">Pulse Rate</span>
                                <strong className="text-amber-400 text-xs">{msg.data?.pulse || '106 bpm'}</strong>
                              </div>
                              <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-slate-400 block">SpO2 Level</span>
                                <strong className="text-emerald-400 text-xs">{msg.data?.spo2 || '97%'}</strong>
                              </div>
                              <div className="bg-black/30 p-1.5 rounded-lg border border-white/5">
                                <span className="text-[9px] text-slate-400 block">Temperature</span>
                                <strong className="text-rose-400 text-xs">{msg.data?.temp || '101.4°F'}</strong>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                              <span>BLE Telemetry Hub</span>
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        )}

                        {/* 4. DIGITAL PRESCRIPTION (RX) ADVICE MESSAGE TYPE */}
                        {msg.msgType === 'rx' && (
                          <div
                            className={`max-w-[90%] rounded-2xl p-3 border shadow-md space-y-2 ${
                              isSelf
                                ? 'bg-indigo-950/80 border-indigo-500/50 text-indigo-100 rounded-br-none'
                                : 'bg-slate-900 border-indigo-500/40 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-indigo-500/30 pb-1.5">
                              <span className="flex items-center gap-1.5 text-[11px] font-black text-indigo-300">
                                <Pill className="w-3.5 h-3.5 text-amber-400" />
                                <span>e-Prescription Order</span>
                              </span>
                              <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                                NMC Signed
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-white">
                                {msg.data?.drugName || 'Tab. Paracetamol 650mg'}
                              </div>
                              <div className="text-[11px] text-slate-300">
                                💊 {msg.data?.regimen || '1 tab TID after food'}
                              </div>
                              {msg.data?.instructions && (
                                <div className="text-[10px] text-amber-300 bg-amber-950/40 p-1.5 rounded-lg border border-amber-500/30 mt-1">
                                  ⚠️ {msg.data.instructions}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                              <span>RMP Reg: {msg.data?.doctorReg || doctorData.regNo}</span>
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        )}

                        {/* 5. DIAGNOSTIC LAB INVESTIGATION ORDER MESSAGE TYPE */}
                        {msg.msgType === 'lab' && (
                          <div
                            className={`max-w-[90%] rounded-2xl p-3 border shadow-md space-y-2 ${
                              isSelf
                                ? 'bg-purple-950/80 border-purple-500/50 text-purple-100 rounded-br-none'
                                : 'bg-slate-900 border-purple-500/40 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-purple-500/30 pb-1.5">
                              <span className="flex items-center gap-1.5 text-[11px] font-black text-purple-300">
                                <TestTube className="w-3.5 h-3.5 text-purple-400" />
                                <span>Diagnostic Lab Order</span>
                              </span>
                              <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-800 animate-pulse">
                                {msg.data?.priority || 'STAT (2h)'}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="font-bold text-xs text-white">
                                {msg.data?.testName || 'Dengue NS1 Antigen + CBC'}
                              </div>
                              <div className="text-[10px] text-slate-300">
                                🧪 Specimen: {msg.data?.sample || 'Venous Blood'}
                              </div>
                              {msg.data?.notes && (
                                <div className="text-[10px] text-slate-400 italic">
                                  Note: {msg.data.notes}
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                              <span>Requisition: ODHM-LAB-882</span>
                              <span>{msg.time}</span>
                            </div>
                          </div>
                        )}

                        {/* 6. CLINICAL EXAMINATION PHOTO / IMAGE MESSAGE TYPE */}
                        {msg.msgType === 'image' && (
                          <div
                            className={`max-w-[85%] rounded-2xl p-2.5 border shadow-md space-y-1.5 ${
                              isSelf
                                ? 'bg-indigo-950/70 border-indigo-500/40 text-white rounded-br-none'
                                : 'bg-slate-900 border-slate-700 text-white rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1">
                              <span className="flex items-center gap-1 font-bold text-indigo-300">
                                <Image className="w-3 h-3" />
                                <span>Clinical Photo</span>
                              </span>
                              <span>{msg.time}</span>
                            </div>
                            <div
                              onClick={() => setExpandedImage(msg.data?.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80')}
                              className="w-full h-32 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden relative cursor-pointer group"
                            >
                              <img
                                src={msg.data?.imageUrl || 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80'}
                                alt="Clinical Exam"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold gap-1 text-white">
                                <ZoomIn className="w-4 h-4" />
                                <span>Click to Zoom</span>
                              </div>
                            </div>
                            {msg.data?.caption && (
                              <p className="text-[11px] text-slate-300 italic">{msg.data.caption}</p>
                            )}
                          </div>
                        )}

                        {/* 7. VOICE NOTE / AUDIO CONSULT CLIP MESSAGE TYPE */}
                        {msg.msgType === 'audio' && (
                          <div
                            className={`max-w-[85%] rounded-2xl p-2.5 border shadow-md space-y-1.5 ${
                              isSelf
                                ? 'bg-indigo-900/80 border-indigo-500/40 text-white rounded-br-none'
                                : 'bg-slate-800 border-slate-700 text-white rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>{msg.senderName}</span>
                              <span>{msg.time}</span>
                            </div>
                            <div className="flex items-center gap-2.5 bg-black/30 p-2 rounded-xl border border-white/5">
                              <button
                                type="button"
                                onClick={() => handlePlayVoiceNote(msg.id)}
                                className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white cursor-pointer shadow-md shrink-0"
                              >
                                {playingAudioId === msg.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                              </button>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-1 h-4">
                                  {[12, 24, 18, 28, 14, 20, 32, 16, 22, 10, 26, 18, 14, 22].map((h, i) => (
                                    <div
                                      key={i}
                                      className={`w-1 rounded-full transition-all duration-150 ${
                                        playingAudioId === msg.id ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                                      }`}
                                      style={{ height: `${playingAudioId === msg.id ? Math.max(6, (h * Math.random()).toFixed(0)) : h * 0.5}px` }}
                                    />
                                  ))}
                                </div>
                                <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                                  <span>{playingAudioId === msg.id ? 'Playing...' : 'Voice Note'}</span>
                                  <span>{msg.data?.audioDuration || '0:14'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 8. INTERACTIVE CLINICAL TRIAGE QUERY MESSAGE TYPE */}
                        {msg.msgType === 'triage_query' && (
                          <div
                            className={`max-w-[90%] rounded-2xl p-3 border shadow-md space-y-2 ${
                              isSelf
                                ? 'bg-amber-950/80 border-amber-500/50 text-amber-100 rounded-br-none'
                                : 'bg-slate-900 border-amber-500/40 text-slate-100 rounded-bl-none'
                            }`}
                          >
                            <div className="flex items-center justify-between border-b border-amber-500/30 pb-1.5">
                              <span className="flex items-center gap-1.5 text-[11px] font-black text-amber-300">
                                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                                <span>Clinical Triage Question</span>
                              </span>
                              <span className="text-[9px] text-slate-400">{msg.time}</span>
                            </div>
                            <p className="text-xs text-white font-medium">
                              {msg.data?.question || msg.text}
                            </p>
                            {msg.data?.options && (
                              <div className="space-y-1.5 pt-1">
                                <span className="text-[9px] text-slate-400 font-bold block">SELECT TO RESPOND:</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {msg.data.options.map((opt, oIdx) => (
                                    <button
                                      key={oIdx}
                                      type="button"
                                      onClick={() => handleSendSpecialMessage('text', {}, `Response to query: "${opt}"`)}
                                      className="px-2.5 py-1 bg-amber-900/60 hover:bg-amber-800 text-amber-200 border border-amber-500/40 rounded-lg text-[10px] font-bold transition-all cursor-pointer shadow-xs active:scale-95"
                                    >
                                      {opt}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>

                {/* Quick Clinical Tool Attachment Tray (Collapsible) */}
                {showAttachmentMenu && (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2.5 mb-2 shadow-2xl space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[10px] font-bold text-slate-400">
                      <span>SEND SPECIAL CLINICAL MESSAGE:</span>
                      <button
                        type="button"
                        onClick={() => setShowAttachmentMenu(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('rx', {
                            drugName: 'Tab. Paracetamol 650mg PO TID SOS',
                            regimen: '1 Tablet • 3 Times Daily • After Meals • 3 Days',
                            instructions: 'Strictly avoid Aspirin / NSAIDs. Hydrate with 2.5L ORS daily.',
                            doctorReg: doctorData.regNo
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-indigo-300 transition-all cursor-pointer"
                      >
                        <Pill className="w-4 h-4 text-amber-400" />
                        <span>Prescribe Rx</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('vitals', {
                            bp: patientData.vitals.bp,
                            pulse: patientData.vitals.pulse,
                            spo2: patientData.vitals.spo2,
                            temp: patientData.vitals.temp,
                            acuity: patientData.acuity
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-emerald-300 transition-all cursor-pointer"
                      >
                        <HeartPulse className="w-4 h-4 text-rose-400" />
                        <span>Share Vitals</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('lab', {
                            testName: 'STAT Dengue NS1 + Platelet Count',
                            priority: 'STAT (Urgent - 2h)',
                            sample: 'Venous Blood (EDTA + Plain)',
                            notes: 'Fasting not required. Immediate report.'
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-purple-300 transition-all cursor-pointer"
                      >
                        <TestTube className="w-4 h-4 text-purple-400" />
                        <span>Order Lab</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('image', {
                            imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80',
                            caption: 'Throat & Pharyngeal Erythema Inspection'
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-sky-300 transition-all cursor-pointer"
                      >
                        <Image className="w-4 h-4 text-sky-400" />
                        <span>Send Photo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('audio', {
                            audioDuration: '0:18',
                            note: 'Clinical audio instructions regarding fever management'
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-teal-300 transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4 text-teal-400" />
                        <span>Voice Memo</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleSendSpecialMessage('triage_query', {
                            question: 'Do you feel severe dizziness or breathlessness right now?',
                            options: ['No dizziness', 'Mild weakness when standing', 'Severe dizziness / Need urgent help']
                          })
                        }
                        className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 flex flex-col items-center gap-1 text-[10px] font-bold text-amber-300 transition-all cursor-pointer"
                      >
                        <HelpCircle className="w-4 h-4 text-amber-400" />
                        <span>Ask Query</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Reply Chips Carousel */}
                <div className="py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
                  {(activeRole === 'doctor'
                    ? [
                        'Please open mouth & show throat',
                        'Drink 2-3L ORS solution daily',
                        'Any gum or nose bleeding?',
                        'Take Tab Paracetamol 650mg SOS'
                      ]
                    : [
                        'Fever is 101.4°F with chills',
                        'Severe body ache behind eyes',
                        'No bleeding noticed so far',
                        'Feeling weak when standing up'
                      ]
                  ).map((phrase, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      onClick={() => handleSendSpecialMessage('text', {}, phrase)}
                      className="px-2 py-0.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-white rounded-full whitespace-nowrap transition-all cursor-pointer"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* Chat Input Bar */}
                <form onSubmit={handleSendChat} className="pt-2 flex items-center gap-1.5 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAttachmentMenu((prev) => !prev)}
                    className={`p-2 rounded-xl transition-all cursor-pointer ${
                      showAttachmentMenu
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                    title="Attach Clinical Card (Rx, Vitals, Lab, Photo, Voice)"
                  >
                    <Plus className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    placeholder={txt.typeMessage}
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  />

                  <button
                    type="submit"
                    className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* PANEL 2: AI CLINICAL SCRIBE & SOAP NOTES */}
            {activeSidePanel === 'notes' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[440px] text-xs">
                <div className="flex items-center justify-between bg-indigo-950/60 border border-indigo-500/40 p-2.5 rounded-xl text-indigo-300">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Live AI Clinical Speech Scribe</span>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                    Listening...
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase">Subjective (S):</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{clinicalSoapNotes.subjective}</p>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">Objective (O):</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{clinicalSoapNotes.objective}</p>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase">Assessment (A):</span>
                    <p className="text-slate-300 leading-relaxed text-[11px]">{clinicalSoapNotes.assessment}</p>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-rose-400 uppercase">Plan (P):</span>
                    <p className="text-slate-300 leading-relaxed text-[11px] whitespace-pre-line">{clinicalSoapNotes.plan}</p>
                  </div>
                </div>

                {/* 1-Click Quick Remedy Additives for Doctor */}
                {activeRole === 'doctor' && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{txt.quickPlanTitle}:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Tab Paracetamol 650mg PO TID SOS',
                        'ORS Electral 2.5 - 3.0 Liters/day',
                        'STAT CBC & Dengue NS1 Antigen',
                        'Tab Pantoprazole 40mg 1 tab OD AC',
                        'Strict Bed Rest & Hydration Log'
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddQuickRemedy(item)}
                          className="px-2 py-1 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Plus className="w-3 h-3 text-emerald-400" />
                          <span>{item.split(' ')[1] || item}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons: Copy SOAP, Download TXT, Transition to NMC Rx */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleCopySoap}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {copiedSoap ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSoap ? 'Copied' : 'Copy SOAP'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadEncounter}
                    className="py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download TXT</span>
                  </button>
                </div>

                {activeRole === 'doctor' && (
                  <button
                    type="button"
                    onClick={handleOpenNmcPrescription}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Transfer SOAP to Official NMC Prescription</span>
                  </button>
                )}
              </div>
            )}

            {/* PANEL 3: PATIENT VITALS & CLINICAL RISK PROFILE */}
            {activeSidePanel === 'vitals' && (
              <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[440px] text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-bold">Blood Pressure:</span>
                    <strong className="text-white font-mono text-sm">{patientData.vitals.bp}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-bold">Oxygen Saturation:</span>
                    <strong className="text-emerald-400 font-mono text-sm">{patientData.vitals.spo2}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-bold">Pulse Rate:</span>
                    <strong className="text-amber-400 font-mono text-sm">{patientData.vitals.pulse}</strong>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-slate-400 font-bold">Body Temperature:</span>
                    <strong className="text-rose-400 font-mono text-sm">{patientData.vitals.temp}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold">Respiratory Rate:</span>
                    <strong className="text-slate-200 font-mono">{patientData.vitals.rr}</strong>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Safety Checks:</span>
                  <div className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>qSOFA Score: 0 (Normal hemodynamics)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-300 text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Watch for Platelet fall & Dengue NS1</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 6. STATE E: POST-CALL SUMMARY & RX GENERATION CONFIRMATION   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {callState === 'ended' && (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-lg text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">
              {txt.callEndedTitle}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {txt.callDurationLabel} <strong>{formatTime(callDuration)}</strong> • Room: {roomId}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-500 font-bold">Patient:</span>
              <span className="font-black text-slate-900 dark:text-white">{patientData.name} ({patientData.abhaId})</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
              <span className="text-slate-500 font-bold">Clinician:</span>
              <span className="font-bold text-indigo-700 dark:text-indigo-400">{doctorData.name} ({doctorData.regNo})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold">Assessment:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300 max-w-[320px] text-right truncate">
                {clinicalSoapNotes.assessment}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCallState('lobby')}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              {txt.reconnectBtn}
            </button>

            <button
              type="button"
              onClick={handleDownloadEncounter}
              className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Record (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleOpenNmcPrescription}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText className="w-4 h-4" />
              <span>Generate Official NMC e-Prescription (QR)</span>
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 7. CLINICAL IMAGE LIGHTBOX MODAL                              */}
      {/* ───────────────────────────────────────────────────────────── */}
      {expandedImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 space-y-3 relative shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Image className="w-4 h-4 text-indigo-400" />
                <span>Clinical Visual Evidence Inspection</span>
              </span>
              <button
                type="button"
                onClick={() => setExpandedImage(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="max-h-[70vh] rounded-2xl overflow-hidden bg-black flex items-center justify-center">
              <img
                src={expandedImage}
                alt="Enlarged Clinical Inspection"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Patient: {patientData.name} ({patientData.abhaId})</span>
              <span>Encrypted ABDM Artifact</span>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 8. OFFICIAL NMC DIGITAL E-PRESCRIPTION & QR VERIFICATION MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showNmcRxModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl max-w-3xl w-full p-4 sm:p-6 shadow-2xl relative space-y-4 my-auto">
            {/* Top Close & Print Controls */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs">
                  Rx
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    ODISHA DIGITAL HEALTH MISSION • NMC VERIFIED E-PRESCRIPTION
                  </h3>
                  <p className="text-[10px] text-slate-500 font-mono">
                    Token: RX-OD-{roomId} • MoHFW Telemedicine Guidelines 2020 Aligned
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Print Official Prescription Slip"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="hidden sm:inline">Print Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowNmcRxModal(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Doctor & Clinic Identification Banner */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Consulting Registered Medical Practitioner (RMP):</span>
                <div className="font-black text-sm text-slate-900 dark:text-white">{doctorData.name}</div>
                <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{doctorData.degrees}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono">OMC Reg No: {doctorData.regNo}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Facility: {doctorData.facility}</div>
              </div>

              <div className="sm:border-l sm:border-slate-200 dark:sm:border-slate-700 sm:pl-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Patient Information & ABHA Digital Identity:</span>
                <div className="font-black text-sm text-slate-900 dark:text-white">{patientData.name}</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono font-bold">ABHA: {patientData.abhaId}</div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400">Age: {patientData.age} Y • Gender: {patientData.gender} • District: {patientData.district}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Vitals: BP {patientData.vitals.bp} | Pulse {patientData.vitals.pulse} | SpO2 {patientData.vitals.spo2}
                </div>
              </div>
            </div>

            {/* Clinical Assessment & Provisional Impression */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-3 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center justify-between">
                <span>Clinical Impression / Provisional Diagnosis:</span>
                <span className="text-[10px] bg-emerald-200 dark:bg-emerald-900 text-emerald-950 dark:text-emerald-200 px-2 py-0.5 rounded-full font-mono">
                  ICD-11: 1D22 (Acute Febrile Illness)
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {clinicalSoapNotes.assessment}
              </p>
            </div>

            {/* Prescribed Medications Table */}
            <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden text-xs">
              <div className="bg-slate-100 dark:bg-slate-800 px-3.5 py-2 font-black text-slate-800 dark:text-slate-200 flex items-center justify-between">
                <span>Prescription (Rx) & Dosage Regimen</span>
                <span className="text-[10px] text-slate-500 font-mono">{rxPrescriptions.length} Prescribed Medicines</span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {rxPrescriptions.map((med, idx) => (
                  <div key={med.id} className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <strong className="text-slate-900 dark:text-white font-bold">{med.name}</strong>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 ml-7">
                        Generic: {med.generic} • <span className="text-indigo-600 dark:text-indigo-400 font-medium">{med.instruction}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] shrink-0 ml-7 sm:ml-0">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded font-mono font-bold">
                        {med.dosage}
                      </span>
                      <span className="px-2 py-0.5 bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 rounded font-bold">
                        {med.freq}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-bold">
                        {med.days}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Non-Pharmacological Directives & Red Flag Advice */}
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-2xl p-3 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px]">Dietary, Hydration & Follow-up Directives:</span>
              <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed whitespace-pre-line">
                {clinicalSoapNotes.plan}
              </p>
            </div>

            {/* Verifiable ABDM QR Code & Digital Signature Stamp */}
            <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-2xs shrink-0">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <div className="text-xs">
                  <div className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>ABDM Cryptographically Verified Slip</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 max-w-xs leading-tight">
                    Scan with any smartphone or ABDM PHR app to verify doctor registration on the National Medical Council portal.
                  </p>
                  <div className="text-[9px] font-mono text-emerald-700 dark:text-emerald-400 mt-1">
                    SHA-256: 7f83b1..49e2 (NHA National Gateway)
                  </div>
                </div>
              </div>

              {/* Digital Doctor Signature Stamp */}
              <div className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl p-2.5 text-center min-w-[200px]">
                <div className="text-[9px] font-black tracking-wider uppercase text-indigo-700 dark:text-indigo-300">
                  Digitally Authenticated
                </div>
                <div className="font-serif italic font-bold text-base text-indigo-950 dark:text-indigo-200 my-0.5">
                  {doctorData.name}
                </div>
                <div className="text-[9px] font-mono text-slate-500 dark:text-slate-400">
                  Reg: {doctorData.regNo} • {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

            {/* Notification Banner when Sent via WhatsApp */}
            {whatsappSentNotice && (
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center justify-center gap-2 animate-bounce shadow-md">
                <Check className="w-4 h-4" />
                <span>e-Prescription slip sent successfully via WhatsApp to {patientData.phone}!</span>
              </div>
            )}

            {/* Footer Multi-Channel Hand-Off Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendWhatsAppRx}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Smartphone className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  alert(`Prescription #${roomId} transmitted to Jan Aushadhi & PHC Pharmacy Queue.`);
                  playTone('message');
                }}
                className="py-2.5 px-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Building2 className="w-4 h-4" />
                <span>Transmit to Pharmacy</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNmcRxModal(false)}
                className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Done & Return to Call</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
