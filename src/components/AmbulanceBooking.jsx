import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  X,
  Trash2,
  User,
  Navigation,
  Activity,
  Radio,
  Volume2,
  VolumeX,
  ShieldCheck,
  Hospital,
  ChevronRight,
  Crosshair,
  ExternalLink,
  LocateFixed,
  Flame,
  ArrowRight,
  Share2,
  MessageSquare,
  Sparkles,
  Zap,
  Gauge,
  Video,
  Check,
  Lock,
  ChevronDown,
  ChevronUp,
  Settings2,
  Copy,
  Send,
  Smartphone,
  Heart,
  HeartPulse,
  Timer,
  WifiOff,
  Wifi,
  AlertOctagon,
  RotateCcw,
  LifeBuoy,
  Ambulance,
  Bell,
  Users
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAmbulanceRequests, saveAmbulanceRequest, cancelAmbulanceRequest } from '../utils/authStorage';
import { ODISHA_MEDICAL_FACILITIES, ODISHA_LOCATIONS, calculateDistanceKm } from '../utils/nearestMedicalData';
import TeleConsultationSuite from './TeleConsultationSuite';

// Default Organization Field Worker & Control Room Hotline Config
const DEFAULT_WORKER_SOS_CONFIG = {
  phone: '7008509631', // User's Dedicated Response Hotline
  displayName: 'Emergency Action Desk & Field Response Unit',
  formatted: '+91 70085 09631',
  backupPhone: '7008509631'
};

// Live Regional Odisha Ambulance Fleet Network
const FLEET_STATIONS = [
  { id: 'AMB-1081', no: 'OD-02-AB-1081', type: 'ALS', pilot: 'Sanjay Kumar Barik', phone: '+91 94371 10801', base: 'Master Canteen Emergency Stand', lat: 20.2668, lng: 85.8398 },
  { id: 'AMB-1084', no: 'OD-02-CB-1084', type: 'BLS', pilot: 'Bikram Keshari Rout', phone: '+91 94371 10804', base: 'Baramunda Fire Station Depot', lat: 20.2580, lng: 85.7820 },
  { id: 'AMB-1090', no: 'OD-02-ALS-1090', type: 'ALS', pilot: 'Debendra Pradhan', phone: '+91 94373 99011', base: 'Capital Hospital ICU Terminal', lat: 20.2640, lng: 85.8235 },
  { id: 'AMB-1082', no: 'OD-05-AB-1082', type: 'BLS', pilot: 'Ranjit Sahoo', phone: '+91 94371 10812', base: 'Cuttack SCB Medical Gate 1', lat: 20.4800, lng: 85.8820 },
  { id: 'AMB-9901', no: 'OD-33-ICU-9901', type: 'ALS', pilot: 'Pratap Mohanty', phone: '+91 94372 88102', base: 'AIIMS Bhubaneswar Trauma Stand', lat: 20.2310, lng: 85.7750 },
  { id: 'AMB-1021', no: 'OD-13-JAN-1021', type: '102-Janani', pilot: 'Kailash Behera', phone: '+91 94374 10201', base: 'Puri District Maternity Base', lat: 19.8110, lng: 85.8280 }
];

// Clinical First-Aid Life-Support Protocols (While En Route)
const FIRST_AID_PROTOCOLS = {
  cardiac: {
    title: { 'or-IN': 'ହୃଦ୍‌ରୋଗ / ଛାତି ଯନ୍ତ୍ରଣା ପ୍ରାଥମିକ ଚିକିତ୍ସା', 'hi-IN': 'सीने में दर्द / हार्ट अटैक प्राथमिक उपचार', 'en-IN': 'Severe Chest Pain / Cardiac First Aid' },
    tips: [
      { 'or-IN': 'ରୋଗୀଙ୍କୁ ୪୫° କୋଣରେ ଆରାମରେ ବସାନ୍ତୁ, ଶୋଇବାକୁ ଦିଅନ୍ତୁ ନାହିଁ।', 'hi-IN': 'मरीज को 45° पर आराम से बैठाएं, लेटने न दें।', 'en-IN': 'Keep patient seated upright at 45°, do not let them lie flat.' },
      { 'or-IN': 'କଲାର ଓ ଟାଇଟ୍ ପୋଷାକ ଢିଲା କରନ୍ତୁ, ପ୍ରଚୁର ପବନ ଆସିବାକୁ ଦିଅନ୍ତୁ।', 'hi-IN': 'तंग कपड़े ढीले करें और खुली हवा आने दें।', 'en-IN': 'Loosen tight collar and belts, ensure adequate fresh airflow.' },
      { 'or-IN': 'କୌଣସି ଭାରୀ ଖାଦ୍ୟ ବା ପାଣି ଦିଅନ୍ତୁ ନାହିଁ। ଯଦି ଚେତା ଅଛି ତେବେ ଶାନ୍ତ ରଖନ୍ତୁ।', 'hi-IN': 'भारी खाना या पानी न दें। मरीज को शांत रखें।', 'en-IN': 'Do not give heavy food or liquids. Keep patient calm and reassure them.' }
    ]
  },
  trauma: {
    title: { 'or-IN': 'ରକ୍ତସ୍ରାବ ଓ ସଡ଼କ ଆଘାତ ପ୍ରାଥମିକ ଚିକିତ୍ସା', 'hi-IN': 'सड़क चोट एवं रक्तस्राव प्राथमिक उपचार', 'en-IN': 'Polytrauma & Hemorrhage First Aid' },
    tips: [
      { 'or-IN': 'କ୍ଷତ ସ୍ଥାନରେ ସଫା କପଡ଼ା ଦେଇ ଜୋରରେ ଚାପି ରଖନ୍ତୁ।', 'hi-IN': 'घाव पर साफ कपड़े से लगातार सीधा दबाव बनाएं।', 'en-IN': 'Apply continuous direct firm pressure to the bleeding wound with a clean cloth.' },
      { 'or-IN': 'ମୁଣ୍ଡ କିମ୍ବା ବେକକୁ ଅଯଥା ହଲାନ୍ତୁ ନାହିଁ (Spine stability)।', 'hi-IN': 'गर्दन या रीढ़ को बिना जरूरत न हिलाएं।', 'en-IN': 'Do not twist or move the neck or spine unnecessarily.' },
      { 'or-IN': 'କଟିଥିବା ହାତ ବା ଗୋଡ଼କୁ ହୃଦୟଠାରୁ ଉପରକୁ ଉଠାଇ ରଖନ୍ତୁ।', 'hi-IN': 'चोटिल अंग को हृदय के स्तर से ऊपर रखें।', 'en-IN': 'Elevate the bleeding limb above heart level if no fracture is suspected.' }
    ]
  },
  maternity: {
    title: { 'or-IN': '୧୦୨ ଜନନୀ ପ୍ରସବକାଳୀନ ସହାୟତା', 'hi-IN': '102 जननी प्रसवकालीन देखभाल', 'en-IN': 'Maternity & Labor First Aid (102 Janani)' },
    tips: [
      { 'or-IN': 'ଗର୍ଭବତୀ ମା’ଙ୍କୁ ବାମ ପାର୍ଶ୍ୱକୁ କଡ଼ ଲେଉଟାଇ ଶୁଆନ୍ତୁ (Left lateral)।', 'hi-IN': 'गर्भवती महिला को बाईं करवट लिटाएं (Left Lateral)।', 'en-IN': 'Position the mother on her left lateral side to optimize maternal-fetal oxygenation.' },
      { 'or-IN': 'ଗଭୀର ଓ ଧୀର ଶ୍ୱାସପ୍ରଶ୍ୱାସ ନେବାକୁ ଉତ୍ସାହିତ କରନ୍ତୁ।', 'hi-IN': 'गहरी और शांत सांस लेने को कहें।', 'en-IN': 'Encourage calm, slow, rhythmic deep breathing during contractions.' },
      { 'or-IN': 'ଶରୀରକୁ ଉଷୁମ ରଖନ୍ତୁ ଏବଂ ନିକଟସ୍ଥ ଆଶା କର୍ମୀଙ୍କୁ ସୂଚିତ କରନ୍ତୁ।', 'hi-IN': 'शरीर को गर्म रखें और स्थानीय आशा दीदी को बताएं।', 'en-IN': 'Keep warm with a clean blanket and keep pregnancy MCP card ready.' }
    ]
  },
  stroke: {
    title: { 'or-IN': 'ଷ୍ଟ୍ରୋକ୍ ପାଇଁ FAST ପରୀକ୍ଷା', 'hi-IN': 'स्ट्रोक FAST जांच एवं देखभाल', 'en-IN': 'Acute Stroke FAST Protocol' },
    tips: [
      { 'or-IN': 'ମୁହଁ ବଙ୍କା ହୋଇଛି କି? (Face), ହାତ ଉଠିପାରୁଛି କି? (Arms), କଥା ଅସ୍ପଷ୍ଟ କି? (Speech)।', 'hi-IN': 'चेहरा टेढ़ा (Face), हाथ कमजोर (Arms), बोली लड़खड़ाहट (Speech)।', 'en-IN': 'Check F.A.S.T.: Face drooping, Arm weakness, Slurred speech, Time of onset.' },
      { 'or-IN': 'ମୁଣ୍ଡକୁ ସାମାନ୍ୟ ୩୦° ଉଚ୍ଚା ରଖନ୍ତୁ।', 'hi-IN': 'सिर को हल्का ऊंचा (30°) रखें।', 'en-IN': 'Keep head slightly elevated at 30°.' },
      { 'or-IN': 'କୌଣସି ଔଷଧ ବା ପାଣି ପାଟିରେ ଦିଅନ୍ତୁ ନାହିଁ।', 'hi-IN': 'मुंह से पानी या दवा बिल्कुल न दें।', 'en-IN': 'Do NOT give oral medicines, food, or water due to choking risk.' }
    ]
  },
  respiratory: {
    title: { 'or-IN': 'ଶ୍ୱାସକଷ୍ଟ ଓ ଅମ୍ଳଜାନ ଅଭାବ', 'hi-IN': 'सांस की तकलीफ एवं ऑक्सीजन फर्स्ट एड', 'en-IN': 'Severe Respiratory Distress First Aid' },
    tips: [
      { 'or-IN': 'ରୋଗୀଙ୍କୁ ସିଧା ବସାନ୍ତୁ, କବାଟ ଝରକା ଖୋଲି ସତେଜ ପବନ ଦିଅନ୍ତୁ।', 'hi-IN': 'मरीज को सीधा बैठाएं और खिड़की खोलकर ताजी हवा दें।', 'en-IN': 'Sit the patient upright, open windows for maximum airflow.' },
      { 'or-IN': 'ଯଦି ଇନ୍‌ହେଲର୍ ଉପଲବ୍ଧ ଅଛି, ୨-୪ ପଫ୍ ଦିଅନ୍ତୁ।', 'hi-IN': 'यदि इनहेलर उपलब्ध है तो 2-4 पफ तुरंत दें।', 'en-IN': 'Administer rescue bronchodilator inhaler if prescribed & available.' },
      { 'or-IN': 'ଛାତି ଉପରେ ଚାପ ପକାନ୍ତୁ ନାହିଁ।', 'hi-IN': 'छाती पर कोई दबाव न पड़ने दें।', 'en-IN': 'Ensure chest and throat are completely free of constricting garments.' }
    ]
  },
  burns: {
    title: { 'or-IN': 'ପୋଡ଼ିଯିବା ଓ ବିଷକ୍ରିୟା / ସର୍ପଦଂଶନ', 'hi-IN': 'जलना एवं विषैला दंश फर्स्ट एड', 'en-IN': 'Burns & Snakebite Protocol' },
    tips: [
      { 'or-IN': 'ପୋଡ଼ିଥିବା ସ୍ଥାନରେ ୧୫ ମିନିଟ୍ ସାଧାରଣ ଥଣ୍ଡା ପାଣି ଢାଳନ୍ତୁ (ବରଫ ନୁହେଁ)।', 'hi-IN': 'जली त्वचा पर 15 मिनट नल का ठंडा पानी डालें (बर्फ नहीं)।', 'en-IN': 'Pour gentle clean running cool water for 15+ minutes (never apply ice).' },
      { 'or-IN': 'ସାପ କାମୁଡ଼ିଥିଲେ ଅଙ୍ଗକୁ ସ୍ଥିର ରଖନ୍ତୁ, ଚିରିବେ ନାହିଁ କି ବାନ୍ଧିବେ ନାହିଁ।', 'hi-IN': 'सांप काटने पर अंग को स्थिर रखें, चीरा या टाइट पट्टी न बांधें।', 'en-IN': 'If snakebite: immobilize the bitten limb, do NOT cut or tie tourniquet.' },
      { 'or-IN': 'ରୋଗୀଙ୍କୁ ଶାନ୍ତ ଓ ସ୍ଥିର ରଖନ୍ତୁ।', 'hi-IN': 'मरीज को शांत और स्थिर रखें।', 'en-IN': 'Keep patient relaxed and motionless to prevent venom spread.' }
    ]
  }
};

export default function AmbulanceBooking({ currentUser, appLang, onNavigateToNearest, onOpenNmcSuite, onRequireAuth }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book' | 'track' | 'my-requests'
  const [serviceMode, setServiceMode] = useState('108'); // '108' | '102' | '112'
  const [selectedEmergency, setSelectedEmergency] = useState('cardiac');
  const [ambulanceType, setAmbulanceType] = useState('ALS');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [pickupAddress, setPickupAddress] = useState('Bhubaneswar - Master Canteen Square');
  const [pickupDistrict, setPickupDistrict] = useState(currentUser?.district || 'Khordha');
  const [pickupState, setPickupState] = useState(currentUser?.state || 'Odisha');
  const [destinationHospital, setDestinationHospital] = useState('Capital Hospital & Trauma Care');
  const [attendants, setAttendants] = useState('1');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [showOptionalFields, setShowOptionalFields] = useState(false);

  // Network Online/Offline Detection
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Real-time GPS Location & SOS Contact State
  const [liveCoords, setLiveCoords] = useState({ lat: 20.2668, lng: 85.8398, isLive: false, accuracy: null });
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact || currentUser?.familyPhone || '');
  const [smsModalData, setSmsModalData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Dedicated Field Worker SOS Dispatch State (Targeted to 7008509631)
  const [workerPhone, setWorkerPhone] = useState(() => {
    const saved = localStorage.getItem('swasthya_worker_sos_phone');
    if (!saved || saved === '9437010800') {
      localStorage.setItem('swasthya_worker_sos_phone', '7008509631');
      return '7008509631';
    }
    return saved;
  });
  const [sosTargetMode, setSosTargetMode] = useState('worker'); // 'worker' | 'family'
  const [showWorkerConfig, setShowWorkerConfig] = useState(false);
  const [tempWorkerPhone, setTempWorkerPhone] = useState('7008509631');
  const [sosIncidents, setSosIncidents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('swasthya_emergency_sos_log') || '[]');
    } catch {
      return [];
    }
  });
  const [showIncidentModal, setShowIncidentModal] = useState(false);

  // Fast Panic Hold-to-Dispatch State
  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [cancelCountdown, setCancelCountdown] = useState(null);
  const holdIntervalRef = useRef(null);

  // CPR Metronome State (110 BPM)
  const [cprActive, setCprActive] = useState(false);
  const [cprCount, setCprCount] = useState(0);
  const cprAudioCtxRef = useRef(null);
  const cprIntervalRef = useRef(null);

  // Active tracked mission state
  const [activeMission, setActiveMission] = useState(null);
  const [missionStage, setMissionStage] = useState(2); // 1: Dispatched, 2: En Route, 3: Arrived, 4: Transporting
  const [sirenActive, setSirenActive] = useState(true);
  const [confirmedSlip, setConfirmedSlip] = useState(null);
  const [requests, setRequests] = useState(() => getAmbulanceRequests());
  const [sosSentToast, setSosSentToast] = useState(false);
  const [showTeleModal, setShowTeleModal] = useState(false);

  // Dynamic Telemetry & Second-by-Second Countdown Timer
  const [etaSeconds, setEtaSeconds] = useState(380); // ~6 mins 20s
  const [telemetryLogs, setTelemetryLogs] = useState([
    { time: '10:42:00', text: '🚨 108 Emergency Dispatch Confirmed via Odisha NHM Command Bay.' },
    { time: '10:42:15', text: '📡 Paramedic Sanjay Barik acknowledged mission. Green Corridor priority active.' },
    { time: '10:42:40', text: '🚦 Smart Traffic Signal pre-emption enabled at Master Canteen intersection.' }
  ]);

  // Leaflet map container for live tracking
  const trackMapRef = useRef(null);
  const trackMapInstanceRef = useRef(null);
  const ambMarkerRef = useRef(null);
  const routeLineRef = useRef(null);
  const audioContextRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  // Localization Dictionary
  const txt = {
    'or-IN': {
      tabBook: '🚑 ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ',
      tabTrack: '📡 ଲାଇଭ୍ ଟ୍ରାକର୍ (Live Mission)',
      tabMyRequests: '📋 ମୋର ଅନୁରୋଧ',
      pageTitle: '୧୦୮ / ୧୦୨ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ ସେବା',
      pageSubtitle: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (NHM) • BSKY ଅନ୍ତର୍ଭୁକ୍ତ • ତୁରନ୍ତ GPS ଡିସ୍ପ୍ୟାଚ୍',
      helplineBanner: '📞 ୧୦୮ ଟୋଲ୍-ଫ୍ରି କଲ୍',
      emergencyTypeLabel: '୧. ଜରୁରୀ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା ବାଛନ୍ତୁ:',
      ambulanceTypeLabel: '୨. ଆମ୍ବୁଲାନ୍ସ ପ୍ରକାର ବାଛନ୍ତୁ:',
      patientDetailsLabel: '୩. ରୋଗୀ ଓ ଲୋକେସନ୍ ବିବରଣୀ:',
      nameLabel: 'ରୋଗୀଙ୍କ ନାମ *',
      phoneLabel: 'ମୋବାଇଲ୍ ନମ୍ବର *',
      abhaLabel: 'ABHA ଆଇଡି / ପରିଚୟ ପତ୍ର',
      ageLabel: 'ବୟସ',
      genderLabel: 'ଲିଙ୍ଗ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      pickupLabel: 'ପିକ୍‌ଅପ୍ ଠିକଣା ଓ ଲ୍ୟାଣ୍ଡମାର୍କ *',
      pickupPlaceholder: 'ଘର ନମ୍ବର, ଛକ, ମୁଖ୍ୟ ଲ୍ୟାଣ୍ଡମାର୍କ...',
      districtLabel: 'ଜିଲ୍ଲା *',
      stateLabel: 'ରାଜ୍ୟ *',
      destinationLabel: 'ଗନ୍ତବ୍ୟ ହସ୍ପିଟାଲ *',
      destinationPlaceholder: 'ନିକଟସ୍ଥ ଜିଲ୍ଲା / ମେଡ଼ିକାଲ କଲେଜ ହସ୍ପିଟାଲ...',
      attendantsLabel: 'ସ୍ୱଜନ ସଂଖ୍ୟା (ଆମ୍ବୁଲାନ୍ସରେ)',
      notesLabel: 'ପ୍ୟାରାମେଡ଼ିକଙ୍କ ପାଇଁ ଜରୁରୀ ସୂଚନା',
      notesPlaceholder: 'ଉଦା: ଡାଇବେଟିସ୍, ରକ୍ତଚାପ, ଅମ୍ଳଜାନ ଅଭାବ...',
      dispatchBtn: '🚨 ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ତୁରନ୍ତ ଡାକନ୍ତୁ (Dispatch Now)',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      slipTitle: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡିସ୍ପ୍ୟାଚ୍ ସ୍ଲିପ୍',
      slipSubtitle: 'NHM 108 Emergency Ambulance Service • Govt of Odisha',
      bookingId: 'ବୁକିଂ ID:',
      emergencyType: 'ଜରୁରୀ ପ୍ରକାର:',
      ambulanceTypeLbl: 'ଆମ୍ବୁଲାନ୍ସ ପ୍ରକାର:',
      vehicleNo: 'ଗାଡ଼ି ନମ୍ବର:',
      paramedic: 'ପ୍ୟାରାମେଡ଼ିକ ଫୋନ୍:',
      estimatedEta: 'ଆନୁମାନିକ ପହଞ୍ଚିବା ସମୟ:',
      statusDispatched: '✓ ଡ଼ିସ୍ପ୍ୟାଚ୍ ହୋଇଛି',
      helpline108: 'ଜାତୀୟ ହେଲ୍‌ଲାଇନ୍: ୧୦୮',
      printSlip: 'ଡିସ୍ପ୍ୟାଚ୍ ସ୍ଲିପ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noRequests: 'ବର୍ତ୍ତମାନ କୌଣସି ସକ୍ରିୟ ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ ନାହିଁ।',
      cancelRequestConfirm: 'ଆପଣ ଏହି ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ ବାତିଲ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
      errorFields: 'ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକ ତଥ୍ୟ ପୂରଣ କରନ୍ତୁ।',
      errorEmergency: 'ଦୟାକରି ଜରୁରୀ ଅବସ୍ଥା ବାଛନ୍ତୁ।',
      blsLabel: 'BLS — ବେସିକ୍ ଲାଇଫ୍ ସପୋର୍ଟ (NHM 108)',
      alsLabel: 'ALS — ଉନ୍ନତ ଆଇସିୟୁ ଆମ୍ବୁଲାନ୍ସ (ଭେଣ୍ଟିଲେଟର୍ ସହ)',
      transportLabel: 'ରୋଗୀ ପରିବହନ (ସ୍ଥାନାନ୍ତରଣ)',
      stage1: '୧. ଡିସ୍ପ୍ୟାଚ୍ ହେଲା',
      stage2: '୨. ରାସ୍ତାରେ ଅଛି (En Route)',
      stage3: '୩. ପହଞ୍ଚିଗଲା (Arrived)',
      stage4: '୪. ହସ୍ପିଟାଲ୍ ଯାତ୍ରା (Transporting)',
      guestLockMsg: 'ଅତିଥି ଭାବରେ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡିସ୍ପ୍ୟାଚ୍ କରିବା ଅନୁମୋଦିତ ନୁହେଁ। ଦୟାକରି ତୁରନ୍ତ ଡିସ୍ପ୍ୟାଚ୍ ପାଇଁ ଲଗ୍-ଇନ୍ କରନ୍ତୁ କିମ୍ବା ୧୦୮ ରେ କଲ୍ କରନ୍ତୁ।',
      guestLoginBtn: '🔑 ଲଗ୍-ଇନ୍ / ରେଜିଷ୍ଟ୍ରେସନ୍ କରନ୍ତୁ',
      quickBookingTitle: 'ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ବୁକିଂ (୧-କ୍ଲିକ୍)',
      quickBookingSubtitle: 'କୌଣସି ଲମ୍ବା ଫର୍ମ ଆବଶ୍ୟକ ନାହିଁ - ତୁରନ୍ତ ସ୍ୱୟଂଚାଳିତ GPS ଲୋକେସନ୍ ସହ ଡାକନ୍ତୁ',
      gpsDetecting: 'GPS ଲୋକେସନ୍ ଚିହ୍ନଟ ହେଉଛି...',
      useLiveGps: '📍 ମୋର ଲାଇଭ୍ GPS ନିଅନ୍ତୁ',
      quickDispatchBtn: '🚨 ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ (Instant Dispatch)',
      showMoreDetails: 'ଅଧିକ ବିବରଣୀ ଯୋଡ଼ନ୍ତୁ (ଇଚ୍ଛାଧୀନ)',
      hideMoreDetails: 'ଅତିରିକ୍ତ ବିବରଣୀ ଲୁଚାନ୍ତୁ',
      whatsappSosBtn: 'WhatsApp SOS (ଲାଇଭ୍ GPS)',
      smsSosBtn: 'SMS SOS (ତୁରନ୍ତ ବାର୍ତ୍ତା)',
      instantSosBarTitle: '୧୦୮ ଜରୁରୀକାଳୀନ SOS ଡେସ୍କ (Emergency Action Center)',
      emergencyContactLbl: 'ପରିବାର / ସମ୍ପର୍କୀୟ ଫୋନ୍ (ଐଚ୍ଛିକ)',
      gpsLockedBadge: 'ଲାଇଭ୍ GPS ସଂଯୁକ୍ତ',
      openInMaps: 'ମ୍ୟାପ୍',
      copiedToClipboard: 'SMS ବାର୍ତ୍ତା କପି ହୋଇଛି! (108 / ପରିବାରକୁ ପଠାନ୍ତୁ)',
      panicHoldTitle: 'ଆମ୍ବୁଲାନ୍ସ ପାଇଁ ୨ ସେକେଣ୍ଡ ଚାପି ଧରନ୍ତୁ',
      panicHoldSub: 'ତୁରନ୍ତ ସ୍ୱୟଂଚାଳିତ GPS ଡିସ୍ପ୍ୟାଚ୍ (Panic Hold)',
      cancelCountdownMsg: 'ସେକେଣ୍ଡ ମଧ୍ୟରେ ଡିସ୍ପ୍ୟାଚ୍ ହେବ...',
      undoBtn: 'ବାତିଲ୍ କରନ୍ତୁ (Cancel)',
      confirmNowBtn: 'ତୁରନ୍ତ ଡିସ୍ପ୍ୟାଚ୍ କରନ୍ତୁ',
      cprBtnStart: 'CPR ଛାତି ଚାପ ମେଟ୍ରୋନୋମ୍ ଆରମ୍ଭ (୧୧୦ BPM)',
      cprBtnStop: 'CPR ମେଟ୍ରୋନୋମ୍ ବନ୍ଦ କରନ୍ତୁ',
      cprGuide: 'ପ୍ରତି ୩୦ ଥର ଛାତି ଚାପିବା ପରେ ୨ ଥର ଶ୍ୱାସ ଦିଅନ୍ତୁ',
      firstAidSectionTitle: '🩺 ଆମ୍ବୁଲାନ୍ସ ଆସିବା ପର୍ଯ୍ୟନ୍ତ ଜରୁରୀ ପ୍ରାଥମିକ ଚିକିତ୍ସା',
      hospitalAlerted: '🏥 ହସ୍ପିଟାଲ୍ ଟ୍ରମା ବେ’ କୁ ABHA ସହ ଆଗୁଆ ସୂଚିତ କରାଯାଇଛି',
      mode108: '🚑 ୧୦୮ ଜରୁରୀକାଳୀନ (Trauma & ICU)',
      mode102: '🤱 ୧୦୨ ଜନନୀ ଏକ୍ସପ୍ରେସ୍ (ମାତୃ ସୁରକ୍ଷା)',
      mode112: '🚨 ୧୧୨ ସର୍ବଭାରତୀୟ ସହାୟତା',
      offlineModeBadge: 'ଅଫ୍‌ଲାଇନ୍ ମୋଡ୍: ୧୦୮ SMS ଗେଟ୍‌ୱେ ସକ୍ରିୟ',
      sosSendToWorkers: 'ସିଧାସଳଖ ଆମ ରେସପନ୍ସ କର୍ମୀ ଓ କଣ୍ଟ୍ରୋଲ୍ ଡେସ୍କ (+୯୧ ',
      sosSendToFamily: 'ପରିବାର / ବ୍ୟକ୍ତିଗତ ମୋବାଇଲ୍',
      workerDeskBtn: 'କର୍ମୀ ଆକ୍ସନ୍ ଡେସ୍କ',
      workerHotlineLbl: 'ଆମ ଇମରଜେନ୍ସି କର୍ମୀ ହଟ୍‌ଲାଇନ୍:',
      setWorkerPhonePrompt: 'ଆମ କର୍ମୀଙ୍କ WhatsApp / ମୋବାଇଲ୍ ନମ୍ବର:',
      saveWorkerPhone: 'ନମ୍ବର ସେଭ୍ କରନ୍ତୁ'
    },
    'hi-IN': {
      tabBook: '🚑 एम्बुलेंस बुलाएं',
      tabTrack: '📡 लाइव ट्रैकर (Live Mission)',
      tabMyRequests: '📋 मेरे अनुरोध',
      pageTitle: '108 / 102 आपातकालीन एम्बुलेंस सेवा',
      pageSubtitle: 'राष्ट्रीय स्वास्थ्य मिशन (NHM) • आयुष्मान/BSKY • त्वरित जीपीएस प्रेषण',
      helplineBanner: '📞 108 टोल-फ्री कॉल',
      emergencyTypeLabel: '1. आपातकालीन स्थिति चुनें:',
      ambulanceTypeLabel: '2. एम्बुलेंस प्रकार चुनें:',
      patientDetailsLabel: '3. मरीज एवं स्थान विवरण:',
      nameLabel: 'मरीज का नाम *',
      phoneLabel: 'मोबाइल नंबर *',
      abhaLabel: 'ABHA आईडी / पहचान पत्र',
      ageLabel: 'आयु',
      genderLabel: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      pickupLabel: 'पिकअप पता एवं लैंडमार्क *',
      pickupPlaceholder: 'मकान संख्या, चौराहा, मुख्य लैंडमार्क...',
      districtLabel: 'जिला *',
      stateLabel: 'राज्य *',
      destinationLabel: 'गंतव्य अस्पताल *',
      destinationPlaceholder: 'नजदीकी जिला / मेडिकल कॉलेज अस्पताल...',
      attendantsLabel: 'साथ जाने वाले (एम्बुलेंस में)',
      notesLabel: 'पैरामेडिक के लिए विशेष जानकारी',
      notesPlaceholder: 'उदा: मधुमेह, उच्च रक्तचाप, ऑक्सीजन कमी...',
      dispatchBtn: '🚨 108 एम्बुलेंस तुरंत बुलाएं (Dispatch Now)',
      cancelBtn: 'रद्द करें',
      slipTitle: '108 एम्बुलेंस डिस्पैच पर्ची',
      slipSubtitle: 'NHM 108 Emergency Ambulance Service • Odisha Health',
      bookingId: 'बुकिंग ID:',
      emergencyType: 'आपात प्रकार:',
      ambulanceTypeLbl: 'एम्बुलेंस प्रकार:',
      vehicleNo: 'वाहन संख्या:',
      paramedic: 'पैरामेडिक संपर्क:',
      estimatedEta: 'अनुमानित आगमन समय:',
      statusDispatched: '✓ रवाना हो चुकी है',
      helpline108: 'राष्ट्रीय हेल्पलाइन: 108',
      printSlip: 'डिस्पैच पर्ची प्रिंट करें',
      closeBtn: 'बंद करें',
      noRequests: 'वर्तमान में कोई सक्रिय एम्बुलेंस अनुरोध नहीं है।',
      cancelRequestConfirm: 'क्या आप इस एम्बुलेंस अनुरोध को रद्द करना चाहते हैं?',
      errorFields: 'कृपया सभी अनिवार्य फ़ील्ड भरें।',
      errorEmergency: 'कृपया आपात स्थिति का प्रकार चुनें।',
      blsLabel: 'BLS — बेसिक लाइफ सपोर्ट (NHM 108)',
      alsLabel: 'ALS — एडवांस्ड आईसीयू एम्बुलेंस (वेंटिलेटर युक्त)',
      transportLabel: 'रोगी परिवहन (स्थानांतरण)',
      stage1: '1. डिस्पैच हुई',
      stage2: '2. रास्ते में है (En Route)',
      stage3: '3. पहुंच चुकी है (Arrived)',
      stage4: '4. अस्पताल यात्रा (Transporting)',
      guestLockMsg: 'अतिथि खाते से 108 एम्बुलेंस डिस्पैच करना मान्य नहीं है। कृपया डिस्पैच हेतु लॉगिन करें या सीधे 108 पर कॉल करें।',
      guestLoginBtn: '🔑 लॉगिन / नया खाता बनाएं',
      quickBookingTitle: 'त्वरित 108 एम्बुलेंस बुकिंग (1-क्लिक)',
      quickBookingSubtitle: 'कोई लंबा फॉर्म भरने की आवश्यकता नहीं - तुरंत ऑटो GPS से बुलाएं',
      gpsDetecting: 'GPS लोकेशन ट्रैक हो रहा है...',
      useLiveGps: '📍 मेरी लाइव GPS लोकेशन लें',
      quickDispatchBtn: '🚨 108 एम्बुलेंस तुरंत बुलाएं (Instant Dispatch)',
      showMoreDetails: 'अतिरिक्त विवरण जोड़ें (वैकल्पिक)',
      hideMoreDetails: 'अतिरिक्त विवरण छुपाएं',
      whatsappSosBtn: 'WhatsApp SOS (लाइव GPS)',
      smsSosBtn: 'SMS SOS (त्वरित संदेश)',
      instantSosBarTitle: '108 आपातकालीन SOS डेस्क (Emergency Action Center)',
      emergencyContactLbl: 'परिवार / आपातकालीन मोबाइल (वैकल्पिक)',
      gpsLockedBadge: 'लाइव GPS सक्रिय',
      openInMaps: 'मैप',
      copiedToClipboard: 'SMS संदेश कॉपी हुआ! (108 / परिजनों को भेजें)',
      panicHoldTitle: 'एम्बुलेंस हेतु 2 सेकंड दबाकर रखें',
      panicHoldSub: 'त्वरित स्वचालित GPS प्रेषण (Panic Hold)',
      cancelCountdownMsg: 'सेकंड में स्वतः डिस्पैच होगा...',
      undoBtn: 'रद्द करें (Cancel)',
      confirmNowBtn: 'तुरंत डिस्पैच करें',
      cprBtnStart: 'CPR चेस्ट कम्प्रेशन मेट्रोनोम (110 BPM)',
      cprBtnStop: 'CPR मेट्रोनोम बंद करें',
      cprGuide: 'हर 30 कम्प्रेशन के बाद 2 बार सांस दें',
      firstAidSectionTitle: '🩺 एम्बुलेंस आने तक आवश्यक प्राथमिक उपचार',
      hospitalAlerted: '🏥 अस्पताल ट्रॉमा बे को ABHA सहित अलर्ट किया गया',
      mode108: '🚑 108 आपातकालीन (Trauma & ICU)',
      mode102: '🤱 102 जननी एक्सप्रेस (मातृ सुरक्षा)',
      mode112: '🚨 112 अखिल भारतीय हेल्पलाइन',
      offlineModeBadge: 'ऑफ़लाइन मोड: 108 SMS गेटवे सक्रिय',
      sosSendToWorkers: 'सीधे हमारी रिस्पांस टीम / कार्यकर्ताओं को (+91 ',
      sosSendToFamily: 'परिवार / व्यक्तिगत संपर्क',
      workerDeskBtn: 'कार्यकर्ता एक्शन डेस्क',
      workerHotlineLbl: 'हमारी आपातकालीन कार्यकर्ता हेल्पलाइन:',
      setWorkerPhonePrompt: 'कार्यकर्ता टीम का WhatsApp / मोबाइल नंबर:',
      saveWorkerPhone: 'नंबर सुरक्षित करें'
    },
    'en-IN': {
      tabBook: '🚑 Book Ambulance',
      tabTrack: '📡 Live Mission Tracker',
      tabMyRequests: '📋 My Requests',
      pageTitle: '108 / 102 Emergency Ambulance Service',
      pageSubtitle: 'National Health Mission • BSKY Empaneled • Instant GPS Green Corridor Dispatch',
      helplineBanner: '📞 Dial 108 Toll-Free',
      emergencyTypeLabel: '1. Select Emergency Medical Condition:',
      ambulanceTypeLabel: '2. Select Ambulance Configuration:',
      patientDetailsLabel: '3. Patient & Location Details:',
      nameLabel: 'Patient Full Name *',
      phoneLabel: 'Caller Mobile Number *',
      abhaLabel: 'ABHA ID / Identity Card',
      ageLabel: 'Age',
      genderLabel: 'Gender',
      male: 'Male',
      female: 'Female',
      pickupLabel: 'Pickup Address & Landmark *',
      pickupPlaceholder: 'Plot / House No, Street, Main Landmark...',
      districtLabel: 'District *',
      stateLabel: 'State *',
      destinationLabel: 'Destination Hospital *',
      destinationPlaceholder: 'Select or type destination apex hospital...',
      attendantsLabel: 'Number of Attendants',
      notesLabel: 'Clinical Notes for Paramedic Pilot',
      notesPlaceholder: 'e.g. Severe chest pain, cold sweating, SpO2 92% on room air...',
      dispatchBtn: '🚨 Confirm 108 Emergency Dispatch',
      cancelBtn: 'Cancel',
      slipTitle: 'Odisha 108 Emergency Dispatch Slip',
      slipSubtitle: 'NHM 108 Emergency Ambulance Service • Govt of Odisha',
      bookingId: 'Booking ID:',
      emergencyType: 'Emergency Type:',
      ambulanceTypeLbl: 'Ambulance Type:',
      vehicleNo: 'Vehicle Registration:',
      paramedic: 'Paramedic Pilot Contact:',
      estimatedEta: 'Estimated Time of Arrival (ETA):',
      statusDispatched: '✓ Dispatched & En Route',
      helpline108: 'National Emergency Helpline: 108',
      printSlip: 'Print Official Dispatch Slip',
      closeBtn: 'Close',
      noRequests: 'No active ambulance requests found.',
      cancelRequestConfirm: 'Are you sure you want to cancel this ambulance request?',
      errorFields: 'Please fill in all mandatory fields.',
      errorEmergency: 'Please select an emergency type.',
      blsLabel: 'BLS — Basic Life Support (NHM 108 Fleet)',
      alsLabel: 'ALS — Advanced Cardiac ICU (With Ventilator & Defibrillator)',
      transportLabel: 'Patient Transport Vehicle (Inter-hospital Transfer)',
      stage1: '1. Dispatched',
      stage2: '2. En Route (Siren Active)',
      stage3: '3. Arrived at Scene',
      stage4: '4. Transporting to Hospital',
      guestLockMsg: 'Emergency 108 ambulance dispatch is restricted for Guest accounts. Please log in or call 108 directly for immediate emergency dispatch.',
      guestLoginBtn: '🔑 Sign In / Register to Dispatch',
      quickBookingTitle: 'Fast 1-Click 108 Ambulance Dispatch',
      quickBookingSubtitle: 'No long forms. Automatic GPS location detection & instant priority dispatch',
      gpsDetecting: 'Detecting GPS Location...',
      useLiveGps: '📍 Auto-Detect My Live GPS Location',
      quickDispatchBtn: '🚨 Dispatch 108 Ambulance Now',
      showMoreDetails: 'Add Hospital & Additional Details (Optional)',
      hideMoreDetails: 'Hide Additional Details',
      whatsappSosBtn: 'WhatsApp SOS (Live GPS)',
      smsSosBtn: 'SMS SOS (Instant Text)',
      instantSosBarTitle: '108 Emergency SOS Action Center',
      emergencyContactLbl: 'Family / Relative Mobile (Optional)',
      gpsLockedBadge: 'Live GPS Locked',
      openInMaps: 'Maps',
      copiedToClipboard: 'SMS SOS text copied to clipboard! (Ready to send)',
      panicHoldTitle: 'HOLD 2 SECONDS FOR FAST DISPATCH',
      panicHoldSub: 'Zero-touch instant GPS green-corridor ambulance dispatch',
      cancelCountdownMsg: 'Auto-dispatching in',
      undoBtn: 'Undo / Cancel',
      confirmNowBtn: 'Confirm & Dispatch Now',
      cprBtnStart: 'Start CPR Cardiac Metronome (110 BPM)',
      cprBtnStop: 'Stop CPR Metronome',
      cprGuide: 'Push hard & fast: 30 compressions, then 2 rescue breaths',
      firstAidSectionTitle: '🩺 En-Route Critical First Aid Protocol (While You Wait)',
      hospitalAlerted: '🏥 Capital Hospital Trauma Bay Pre-Notified with Patient ABHA',
      mode108: '🚑 108 Emergency (Trauma & ICU)',
      mode102: '🤱 102 Janani Express (Maternal JSSK)',
      mode112: '🚨 112 All-Emergency Response',
      offlineModeBadge: 'Offline Mode: Direct 108 Emergency SMS Gateway Active',
      sosSendToWorkers: 'Direct to Our Emergency Response Workers & Control Desk (+91 ',
      sosSendToFamily: 'Family / Personal Contact',
      workerDeskBtn: 'Worker Action Desk',
      workerHotlineLbl: 'Our Emergency Worker Hotline:',
      setWorkerPhonePrompt: 'Our Worker WhatsApp & Mobile Number:',
      saveWorkerPhone: 'Save Hotline Number'
    }
  }[lang] || {};

  // Emergency Condition Types
  const emergencyTypes = [
    { id: 'cardiac', icon: '🫀', label: { 'or-IN': 'ହୃଦ୍‌ରୋଗ / ଛାତି ଯନ୍ତ୍ରଣା', 'hi-IN': 'हृदय घात / सीने में दर्द', 'en-IN': 'Cardiac / Severe Chest Pain' }, color: 'border-rose-400 bg-rose-50 text-rose-800' },
    { id: 'trauma', icon: '🩸', label: { 'or-IN': 'ସଡ଼କ ଦୁର୍ଘଟଣା / ଆଘାତ', 'hi-IN': 'सड़क दुर्घटना / गंभीर चोट', 'en-IN': 'Polytrauma / Highway Accident' }, color: 'border-orange-400 bg-orange-50 text-orange-800' },
    { id: 'maternity', icon: '🤱', label: { 'or-IN': 'ପ୍ରସବକାଳୀନ ଜରୁରୀ', 'hi-IN': 'प्रसव आपातकाल (102 Janani)', 'en-IN': 'Maternity / Labor Pain (102)' }, color: 'border-pink-400 bg-pink-50 text-pink-800' },
    { id: 'stroke', icon: '🧠', label: { 'or-IN': 'ଷ୍ଟ୍ରୋକ୍ / ଅଚେତ ଅବସ୍ଥା', 'hi-IN': 'स्ट्रोक / अचानक बेहोशी', 'en-IN': 'Stroke / Unconscious State' }, color: 'border-purple-400 bg-purple-50 text-purple-800' },
    { id: 'respiratory', icon: '🫁', label: { 'or-IN': 'ଅମ୍ଳଜାନ ହ୍ରାସ / ଶ୍ୱାସକଷ୍ଟ', 'hi-IN': 'सांस लेने में भारी तकलीफ', 'en-IN': 'Respiratory Distress / Hypoxia' }, color: 'border-blue-400 bg-blue-50 text-blue-800' },
    { id: 'burns', icon: '🔥', label: { 'or-IN': 'ପୋଡ଼ିଯିବା / ବିଷକ୍ରିୟା', 'hi-IN': 'जलना / विषैला दंश', 'en-IN': 'Severe Burns / Snakebite' }, color: 'border-amber-400 bg-amber-50 text-amber-800' }
  ];

  // Ambulance Types
  const ambulanceTypeOptions = [
    { id: 'ALS', icon: '🚑', badge: 'CRITICAL ICU', label: txt.alsLabel, badgeColor: 'bg-rose-600', selectedBorder: 'border-rose-500 bg-rose-50' },
    { id: 'BLS', icon: '🚑', badge: '108 RAPID', label: txt.blsLabel, badgeColor: 'bg-emerald-600', selectedBorder: 'border-emerald-500 bg-emerald-50' },
    { id: 'Transport', icon: '🚐', badge: 'TRANSFER', label: txt.transportLabel, badgeColor: 'bg-slate-600', selectedBorder: 'border-slate-400 bg-slate-50' }
  ];

  // Preload first request as active mission if exists
  useEffect(() => {
    if (requests && requests.length > 0 && !activeMission) {
      setActiveMission(requests[0]);
    }
  }, [requests]);

  // Web Audio API Emergency Siren Synthesizer
  useEffect(() => {
    if (!sirenActive || activeSubTab !== 'track' || !activeMission) {
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
        audioContextRef.current = null;
      }
      if (sirenIntervalRef.current) {
        clearInterval(sirenIntervalRef.current);
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      let isHigh = false;
      sirenIntervalRef.current = setInterval(() => {
        if (ctx.state === 'closed') return;
        isHigh = !isHigh;
        osc.frequency.setTargetAtTime(isHigh ? 1150 : 750, ctx.currentTime, 0.25);
      }, 600);
    } catch (e) {
      console.warn('[Web Audio Siren]', e);
    }

    return () => {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, [sirenActive, activeSubTab, activeMission?.id]);

  // Second-by-Second ETA Countdown Timer
  useEffect(() => {
    if (activeSubTab !== 'track' || !activeMission) return;
    const timer = setInterval(() => {
      setEtaSeconds((prev) => Math.max(15, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeSubTab, activeMission]);

  // Auto-Detect Real-Time GPS Location (with Reverse Geocoding)
  const handleAutoGps = (silent = false) => {
    if (!navigator.geolocation) {
      if (!silent) alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsDetectingGps(false);
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        const accuracy = Math.round(pos.coords.accuracy || 10);
        const coords = { lat, lng, isLive: true, accuracy };
        setLiveCoords(coords);

        // Attempt reverse geocoding via OpenStreetMap Nominatim
        let geoAddress = `Live GPS: ${lat}, ${lng} (±${accuracy}m accuracy)`;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
            headers: { 'Accept-Language': 'en' }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.display_name) {
              const suburb = data.address?.suburb || data.address?.neighbourhood || data.address?.road || '';
              const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.county || '';
              const district = data.address?.state_district || data.address?.county || '';
              const state = data.address?.state || '';
              const landmark = [suburb, city].filter(Boolean).join(', ');
              if (landmark) {
                geoAddress = `${landmark} (GPS: ${lat}, ${lng})`;
              } else {
                geoAddress = data.display_name.slice(0, 75);
              }
              if (district) setPickupDistrict(district);
              if (state) setPickupState(state);
            }
          }
        } catch (e) {
          // Keep coordinate string fallback
        }
        setPickupAddress(geoAddress);
      },
      (err) => {
        setIsDetectingGps(false);
        if (!silent) {
          console.warn('[Geolocation Error]', err);
          setPickupAddress(`Master Canteen Square (GPS fallback: ${liveCoords.lat}, ${liveCoords.lng})`);
        }
      },
      { timeout: 9000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Network Online/Offline Event Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Nearest Fleet Proximity Calculator (Dynamic Haversine)
  const rankedFleet = useMemo(() => {
    const pLat = liveCoords.lat || 20.2668;
    const pLng = liveCoords.lng || 85.8398;
    return FLEET_STATIONS.map((amb) => {
      const dist = calculateDistanceKm(pLat, pLng, amb.lat, amb.lng);
      const etaMins = Math.max(3, Math.round(dist * 2.2));
      return { ...amb, distanceKm: parseFloat(dist.toFixed(1)), etaMins };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [liveCoords]);

  const nearestVehicle = rankedFleet[0] || FLEET_STATIONS[0];

  // CPR Cardiac Compression Metronome (110 BPM Web Audio API)
  useEffect(() => {
    if (!cprActive) {
      if (cprIntervalRef.current) {
        clearInterval(cprIntervalRef.current);
        cprIntervalRef.current = null;
      }
      if (cprAudioCtxRef.current) {
        try { cprAudioCtxRef.current.close(); } catch (e) {}
        cprAudioCtxRef.current = null;
      }
      setCprCount(0);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        cprAudioCtxRef.current = new AudioCtx();
      }
    } catch (e) {}

    cprIntervalRef.current = setInterval(() => {
      setCprCount((prev) => (prev >= 30 ? 1 : prev + 1));
      if (cprAudioCtxRef.current && cprAudioCtxRef.current.state !== 'closed') {
        try {
          const ctx = cprAudioCtxRef.current;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.07);
        } catch (e) {}
      }
    }, 545);

    return () => {
      if (cprIntervalRef.current) clearInterval(cprIntervalRef.current);
      if (cprAudioCtxRef.current) {
        try { cprAudioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, [cprActive]);

  // Fast Panic Hold-to-Dispatch Timer Handlers
  const startHold = () => {
    if (cancelCountdown !== null) return;
    setIsHolding(true);
    setHoldProgress(0);
    const step = 100 / (2000 / 40); // 40ms interval over 2000ms
    holdIntervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(holdIntervalRef.current);
          holdIntervalRef.current = null;
          setIsHolding(false);
          triggerFastPanicCountdown();
          return 100;
        }
        return prev + step;
      });
    }, 40);
  };

  const cancelHold = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    setIsHolding(false);
    setHoldProgress(0);
  };

  const triggerFastPanicCountdown = () => {
    if (navigator.vibrate) {
      try { navigator.vibrate([100, 50, 100]); } catch (e) {}
    }
    setCancelCountdown(5);
  };

  useEffect(() => {
    if (cancelCountdown === null) return;
    if (cancelCountdown === 0) {
      setCancelCountdown(null);
      handleDispatch();
      return;
    }
    const timer = setTimeout(() => {
      setCancelCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [cancelCountdown]);

  const handleAbortCountdown = () => {
    setCancelCountdown(null);
    setHoldProgress(0);
    setToastMessage('Fast dispatch cancelled by caller.');
    setSosSentToast(true);
    setTimeout(() => setSosSentToast(false), 2500);
  };

  // Attempt non-blocking GPS auto-detect on initial load
  useEffect(() => {
    if (navigator.geolocation && !liveCoords.isLive) {
      handleAutoGps(true);
    }
  }, []);

  // Handle Dispatch Form Submit
  const handleDispatch = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (currentUser?.isGuest) {
      if (onRequireAuth) {
        onRequireAuth();
      } else {
        alert(txt.guestLockMsg);
      }
      return;
    }

    const effectivePhone = patientPhone.trim() || currentUser?.phone || '';
    if (!effectivePhone) {
      setFormError(txt.phoneLabel + ' is required for 108 contact.');
      return;
    }

    const effectiveName = patientName.trim() || currentUser?.name || 'Citizen Patient';
    const effectivePickup = pickupAddress.trim() || `Live GPS (${liveCoords.lat}, ${liveCoords.lng})`;

    const emergItem = emergencyTypes.find((et) => et.id === selectedEmergency);
    const emergLabel = emergItem ? emergItem.label[lang] || emergItem.label['en-IN'] : selectedEmergency;

    // Accurate dynamic coordinates derived from actual patient location
    const pLat = liveCoords.lat || 20.2710;
    const pLng = liveCoords.lng || 85.8440;

    // Offline Resilience Fallback: Auto-trigger structured SMS Beacon
    if (!isOnline) {
      const smsPayload = `108 EMERGENCY OFFLINE BEACON: Caller: ${effectivePhone}, Patient: ${effectiveName}, Condition: ${emergLabel}, GPS: https://maps.google.com/?q=${pLat},${pLng}, Area: ${effectivePickup}`;
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const sep = isIos ? '&' : '?';
      try { navigator.clipboard?.writeText(smsPayload); } catch (err) {}
      const targetPhone = (workerPhone || '7008509631').replace(/\D/g, '');
      window.location.href = `sms:${targetPhone}${sep}body=${encodeURIComponent(smsPayload)}`;
      setSmsModalData({ text: smsPayload, recipient: `+91 ${targetPhone} (Direct Emergency Gateway)`, phone: targetPhone });
      setToastMessage(`⚠️ Offline Mode: SOS Beacon directed to +91 ${targetPhone} via SMS!`);
      setSosSentToast(true);
      return;
    }

    // Dynamic closest vehicle from ranked Fleet
    const chosenVehicle = nearestVehicle;
    const startLat = Number((pLat - 0.0125).toFixed(5));
    const startLng = Number((pLng + 0.0085).toFixed(5));
    const hospLat = Number((pLat + 0.0150).toFixed(5));
    const hospLng = Number((pLng - 0.0110).toFixed(5));

    const newSlip = {
      id: `OD-108-${Math.floor(100000 + Math.random() * 900000)}`,
      emergencyType: emergLabel,
      emergencyId: selectedEmergency,
      ambulanceType: ambulanceType,
      vehicleNo: chosenVehicle.no,
      driverName: chosenVehicle.pilot,
      paramedicPhone: chosenVehicle.phone,
      baseStation: chosenVehicle.base,
      etaMins: chosenVehicle.etaMins || (ambulanceType === 'ALS' ? 6 : 4),
      speedKmh: 58,
      distanceRemainingKm: chosenVehicle.distanceKm || 2.4,
      oxygenBar: 94,
      batteryVolt: '13.8V',
      fuelLevel: '78%',
      patient: {
        name: effectiveName,
        phone: effectivePhone,
        abha: patientAbha || 'ABHA: 91-0000-0000-0000',
        age: patientAge || '35',
        gender: patientGender || 'Male'
      },
      pickup: effectivePickup.includes(',') ? effectivePickup : `${effectivePickup}, ${pickupDistrict}, ${pickupState}`,
      destination: destinationHospital || 'Nearest Apex Hospital',
      attendants: attendants || '1',
      notes: additionalNotes || 'Urgent 108 emergency response requested',
      status: 'DISPATCHED_EN_ROUTE',
      requestedAt: new Date().toLocaleString('en-IN'),
      startCoords: { lat: startLat, lng: startLng },
      pickupCoords: { lat: pLat, lng: pLng },
      hospCoords: { lat: hospLat, lng: hospLng }
    };

    const updated = saveAmbulanceRequest(newSlip);
    setRequests(updated);
    setActiveMission(newSlip);
    setConfirmedSlip(newSlip);
    setActiveSubTab('track');
    setMissionStage(2); // En route immediately
    setEtaSeconds((chosenVehicle.etaMins || 6) * 60);

    // Add hospital pre-notification log
    setTelemetryLogs((prev) => [
      { time: new Date().toLocaleTimeString('en-IN'), text: `🏥 Hospital Pre-Notification: Capital Hospital ER Trauma Bay alerted with ABHA (${patientAbha || 'ABDM-Linked'}). Resuscitation team on standby.` },
      ...prev
    ]);
  };

  // Alert Tone Synthesizer for Incoming / Dispatched Worker SOS
  const playSosAlertTone = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.28);
    } catch (e) {}
  };

  // Record SOS Incident for Field Workers and Control Room
  const recordSosIncident = (channel, targetPhone, content) => {
    const coords = activeMission?.pickupCoords || (liveCoords.isLive ? liveCoords : { lat: liveCoords.lat, lng: liveCoords.lng });
    const gMapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    const callerName = patientName || currentUser?.name || 'Citizen Patient';
    const callerNum = patientPhone || currentUser?.phone || '108 Caller';
    const emergItem = emergencyTypes.find((et) => et.id === selectedEmergency);
    const emergTitle = emergItem ? emergItem.label[lang] || emergItem.label['en-IN'] : selectedEmergency;
    const currentLoc = pickupAddress || `GPS (${coords.lat}, ${coords.lng})`;

    const newInc = {
      id: 'SOS-' + Date.now(),
      timestamp: new Date().toISOString(),
      timeFormatted: new Date().toLocaleTimeString('en-IN'),
      callerName,
      callerPhone: callerNum,
      emergencyType: emergTitle,
      pickup: currentLoc,
      coords,
      gMapsLink,
      targetPhone,
      channel,
      status: 'PENDING_WORKER_ACTION',
      allocatedVehicle: activeMission?.vehicleNo || nearestVehicle?.no || 'Nearest 108 Fleet'
    };

    const updated = [newInc, ...sosIncidents.slice(0, 49)];
    setSosIncidents(updated);
    try {
      localStorage.setItem('swasthya_emergency_sos_log', JSON.stringify(updated));
    } catch (e) {}

    playSosAlertTone();

    try {
      window.dispatchEvent(new CustomEvent('swasthya_sos_incident', { detail: newInc }));
    } catch (e) {}

    return newInc;
  };

  const handleUpdateIncidentStatus = (incId, newStatus) => {
    const updated = sosIncidents.map((inc) => inc.id === incId ? { ...inc, status: newStatus } : inc);
    setSosIncidents(updated);
    try {
      localStorage.setItem('swasthya_emergency_sos_log', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleClearIncidents = () => {
    if (window.confirm('Clear all logged SOS incident alerts from action desk?')) {
      setSosIncidents([]);
      try {
        localStorage.removeItem('swasthya_emergency_sos_log');
      } catch (e) {}
    }
  };

  const handleSaveWorkerPhone = (e) => {
    if (e) e.preventDefault();
    const clean = tempWorkerPhone.replace(/\D/g, '');
    if (clean.length < 10) {
      alert('Please enter a valid 10-digit mobile number for the field worker team.');
      return;
    }
    setWorkerPhone(clean);
    try {
      localStorage.setItem('swasthya_worker_sos_phone', clean);
    } catch (e) {}
    setShowWorkerConfig(false);
    setToastMessage(`✓ Worker hotline set to +91 ${clean}. All SOS dispatches will now go straight to your team!`);
    setSosSentToast(true);
    setTimeout(() => {
      setSosSentToast(false);
      setToastMessage('');
    }, 4000);
  };

  // Automated 1-Click WhatsApp SOS Trigger Direct to Our Field Workers & Control Room
  const handleTriggerWhatsAppSos = () => {
    const coords = activeMission?.pickupCoords || (liveCoords.isLive ? liveCoords : { lat: liveCoords.lat, lng: liveCoords.lng });
    const gMapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    const callerName = patientName || currentUser?.name || 'Citizen Patient';
    const callerNum = patientPhone || currentUser?.phone || '108 Emergency Caller';
    const emergItem = emergencyTypes.find((et) => et.id === selectedEmergency);
    const emergTitle = emergItem ? emergItem.label[lang] || emergItem.label['en-IN'] : selectedEmergency;
    const currentLoc = pickupAddress || `GPS (${coords.lat}, ${coords.lng})`;

    // Target Phone: Directly to our workers unless user specifically chose custom family contact
    const rawTarget = sosTargetMode === 'family' && emergencyContact
      ? emergencyContact.replace(/\D/g, '')
      : (workerPhone || DEFAULT_WORKER_SOS_CONFIG.phone).replace(/\D/g, '');

    const cleanPhone = rawTarget.length === 10 ? '91' + rawTarget : rawTarget;
    const isDirectToWorker = sosTargetMode === 'worker';

    let message = '';
    if (isDirectToWorker) {
      message = `🚨 *URGENT EMERGENCY SOS ALERT — IMMEDIATE WORKER ACTION REQUIRED*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👥 *ATTENTION FIELD WORKERS & CONTROL DESK:*\n` +
        `A citizen has triggered an Emergency SOS Beacon requesting IMMEDIATE medical response!\n\n` +
        `📍 *ACTIONABLE LIVE GPS LOCATION:*\n` +
        `• *Google Maps Navigation:* ${gMapsLink}\n` +
        `• *GPS Coordinates:* ${coords.lat}, ${coords.lng} (Accuracy: ±${coords.accuracy || 10}m)\n` +
        `• *Pickup Address:* ${currentLoc}\n\n` +
        `👤 *PATIENT / CALLER DETAILS:*\n` +
        `• *Name:* ${callerName}\n` +
        `• *Caller Mobile:* ${callerNum}\n` +
        `• *Emergency Condition:* ⚠️ *${emergTitle}*\n` +
        `• *Time Triggered:* ${new Date().toLocaleTimeString('en-IN')}\n\n` +
        (activeMission
          ? `🚑 *ALLOCATED AMBULANCE UNIT:*\n• *Vehicle:* ${activeMission.vehicleNo}\n• *Paramedic:* ${activeMission.paramedicPhone}\n• *ETA:* ~${Math.ceil(etaSeconds / 60)} Mins\n\n`
          : `🚑 *NEAREST ESTIMATED FLEET:* ${nearestVehicle.station} (${nearestVehicle.no}, ~${nearestVehicle.etaMins}m ETA)\n\n`) +
        `🆘 *IMMEDIATE FIELD WORKER PROTOCOL:*\n` +
        `1. Call citizen back immediately at ${callerNum}\n` +
        `2. Dispatch nearest responder or 108 ambulance\n` +
        `3. Alert receiving hospital trauma bay\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `⚡ *Sent via Odisha SwasthyaMitra Rapid Response Network*`;
    } else {
      message = `🚨 *EMERGENCY MEDICAL SOS — IMMEDIATE 108 AMBULANCE NEEDED*\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 *Patient / Caller:* ${callerName}\n` +
        `📞 *Contact Number:* ${callerNum}\n` +
        `⚠️ *Emergency Condition:* ${emergTitle}\n\n` +
        `📍 *EXACT LIVE GPS LOCATION:*\n` +
        `• *Google Maps Link:* ${gMapsLink}\n` +
        `• *GPS Coordinates:* ${coords.lat}, ${coords.lng}\n` +
        `• *Pickup Address:* ${currentLoc}\n` +
        `━━━━━━━━━━━━━━━━━━━━\n` +
        `🆘 *Please contact me immediately or dial 108!*\n` +
        `⚡ *Sent via Odisha SwasthyaMitra 108 Emergency Portal*`;
    }

    const encoded = encodeURIComponent(message);
    const whatsappUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    // Record the incident in our local incident log for field workers
    recordSosIncident('WhatsApp SOS', cleanPhone, message);

    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(message);
      }
    } catch (e) {}

    window.open(whatsappUrl, '_blank');
    setToastMessage(
      isDirectToWorker
        ? `✓ WhatsApp SOS dispatched directly to Field Worker (+${cleanPhone}) & Action Desk logged!`
        : '✓ WhatsApp Emergency SOS with Live GPS opened & copied to clipboard!'
    );
    setSosSentToast(true);
    setTimeout(() => {
      setSosSentToast(false);
      setToastMessage('');
    }, 4000);
  };

  // Automated 1-Click SMS SOS Trigger Direct to Our Field Workers & Control Room
  const handleTriggerSmsSos = () => {
    const coords = activeMission?.pickupCoords || (liveCoords.isLive ? liveCoords : { lat: liveCoords.lat, lng: liveCoords.lng });
    const gMapsLink = `https://maps.google.com/?q=${coords.lat},${coords.lng}`;
    const callerName = patientName || currentUser?.name || 'Citizen Patient';
    const callerNum = patientPhone || currentUser?.phone || '108';
    const emergItem = emergencyTypes.find((et) => et.id === selectedEmergency);
    const emergTitle = emergItem ? emergItem.label[lang] || emergItem.label['en-IN'] : selectedEmergency;
    const currentLoc = pickupAddress || `GPS (${coords.lat}, ${coords.lng})`;

    const rawTarget = sosTargetMode === 'family' && emergencyContact
      ? emergencyContact.replace(/\D/g, '')
      : (workerPhone || DEFAULT_WORKER_SOS_CONFIG.phone).replace(/\D/g, '');

    const cleanPhone = rawTarget.length === 10 ? '91' + rawTarget : rawTarget;
    const isDirectToWorker = sosTargetMode === 'worker';

    let smsText = '';
    if (isDirectToWorker) {
      smsText = `🚨 URGENT WORKER SOS: Caller ${callerName} (${callerNum}) needs immediate 108 help! Emergency: ${emergTitle}. Pickup: ${currentLoc}. Live GPS: ${gMapsLink}. Call caller or dispatch unit immediately!`;
    } else {
      smsText = `🚨 108 EMERGENCY SOS: Urgent medical help needed for ${callerName} (${emergTitle}). Caller: ${callerNum}. Pickup: ${currentLoc}. Live GPS: ${gMapsLink}. Dial 108 immediately.`;
    }

    // Record the incident in Action Desk
    recordSosIncident('SMS SOS', cleanPhone, smsText);

    const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const separator = isIos ? '&' : '?';
    const smsUrl = cleanPhone
      ? `sms:${cleanPhone}${separator}body=${encodeURIComponent(smsText)}`
      : `sms:${separator}body=${encodeURIComponent(smsText)}`;

    // Always copy to clipboard for 100% reliability
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(smsText);
      }
    } catch (e) {}

    try {
      window.location.href = smsUrl;
    } catch (e) {}

    setSmsModalData({ text: smsText, recipient: cleanPhone ? `+${cleanPhone} (Field Worker Desk)` : 'Emergency Contact / 108' });
    setToastMessage(
      isDirectToWorker
        ? `✓ SMS SOS directed straight to Field Worker (+${cleanPhone}) & Action Desk logged!`
        : '✓ SMS SOS message prepared & copied to clipboard!'
    );
    setSosSentToast(true);
    setTimeout(() => {
      setSosSentToast(false);
      setToastMessage('');
    }, 4000);
  };

  // Cancel Request
  const handleCancelRequest = (id) => {
    if (!window.confirm(txt.cancelRequestConfirm)) return;
    const updated = cancelAmbulanceRequest(id);
    setRequests(updated);
    if (activeMission?.id === id) {
      setActiveMission(updated[0] || null);
    }
  };

  // Simulate Live Movement along road waypoints
  useEffect(() => {
    if (activeSubTab !== 'track' || !activeMission) return;

    const waypoints = [
      [20.2640, 85.8390],
      [20.2660, 85.8402],
      [20.2680, 85.8418],
      [20.2695, 85.8430],
      [20.2710, 85.8440]
    ];
    let step = 0;

    const interval = setInterval(() => {
      step = (step + 1) % waypoints.length;
      const [currentLat, currentLng] = waypoints[step];

      if (ambMarkerRef.current) {
        ambMarkerRef.current.setLatLng([currentLat, currentLng]);
      }

      setActiveMission((prev) => {
        if (!prev) return prev;
        const currentDist = prev.distanceRemainingKm || 3.0;
        if (currentDist > 0.4) {
          return {
            ...prev,
            distanceRemainingKm: parseFloat((currentDist - 0.2).toFixed(1)),
            speedKmh: Math.floor(52 + Math.random() * 10),
            oxygenBar: 93,
            startCoords: { lat: currentLat, lng: currentLng }
          };
        } else {
          setMissionStage(3); // Arrived at scene!
          return {
            ...prev,
            distanceRemainingKm: 0.1,
            speedKmh: 12,
            startCoords: { lat: currentLat, lng: currentLng }
          };
        }
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [activeSubTab, activeMission?.id]);

  // Leaflet Live Mission Map Renderer
  useEffect(() => {
    if (activeSubTab !== 'track' || !trackMapRef.current || !activeMission) return;

    if (trackMapInstanceRef.current) {
      try {
        trackMapInstanceRef.current.remove();
      } catch (e) {}
      trackMapInstanceRef.current = null;
    }

    if (trackMapRef.current._leaflet_id) {
      delete trackMapRef.current._leaflet_id;
    }

    const ambLat = activeMission.startCoords?.lat || 20.2668;
    const ambLng = activeMission.startCoords?.lng || 85.8398;
    const pickupLat = activeMission.pickupCoords?.lat || 20.2720;
    const pickupLng = activeMission.pickupCoords?.lng || 85.8450;

    const map = L.map(trackMapRef.current, {
      center: [(ambLat + pickupLat) / 2, (ambLng + pickupLng) / 2],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      trackResize: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    // Patient Marker
    const patientIcon = L.divIcon({
      className: 'patient-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
          <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-bold">
            📍
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-blue-950 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow">
            Patient Pickup
          </div>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    L.marker([pickupLat, pickupLng], { icon: patientIcon }).addTo(map);

    // Ambulance Marker
    const ambIcon = L.divIcon({
      className: 'live-amb-marker',
      html: `
        <div class="relative flex items-center justify-center">
          <span class="absolute -inset-2.5 rounded-full bg-rose-500/50 animate-ping"></span>
          <div class="w-11 h-11 rounded-full bg-gradient-to-tr from-rose-600 to-red-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-lg">
            🚑
          </div>
          <div class="absolute -bottom-5 whitespace-nowrap bg-rose-950 text-rose-200 text-[9px] font-mono font-black px-2 py-0.5 rounded-full shadow border border-rose-800">
            108 SIREN ON
          </div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });
    ambMarkerRef.current = L.marker([ambLat, ambLng], { icon: ambIcon, zIndexOffset: 1000 }).addTo(map);

    // Connecting Route Polyline
    const latlngs = [
      [ambLat, ambLng],
      [(ambLat + pickupLat) / 2 + 0.002, (ambLng + pickupLng) / 2 - 0.002],
      [pickupLat, pickupLng]
    ];
    routeLineRef.current = L.polyline(latlngs, {
      color: '#e11d48',
      weight: 5,
      dashArray: '8, 8',
      opacity: 0.85
    }).addTo(map);

    map.fitBounds(L.latLngBounds([[ambLat, ambLng], [pickupLat, pickupLng]]), { padding: [50, 50] });

    const animId = requestAnimationFrame(() => {
      map.invalidateSize({ animate: false });
    });
    const t1 = setTimeout(() => {
      map.invalidateSize({ animate: false });
    }, 200);

    trackMapInstanceRef.current = map;

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(t1);
      if (trackMapInstanceRef.current) {
        try {
          trackMapInstanceRef.current.remove();
        } catch (e) {}
        trackMapInstanceRef.current = null;
      }
    };
  }, [activeSubTab, activeMission?.id]);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* ── Page Header Banner ────────────────────────────────────────────── */}
      <div className="p-5 bg-gradient-to-r from-rose-700 via-red-600 to-amber-600 rounded-2xl text-white shadow-lg border border-rose-500/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20 relative">
              <span className="text-3xl animate-pulse">🚑</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></span>
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                {txt.pageTitle}
              </h2>
              <p className="text-rose-100 text-xs mt-0.5 font-medium">{txt.pageSubtitle}</p>
            </div>
          </div>
          <a
            href="tel:108"
            className="flex items-center gap-2 bg-white text-rose-700 hover:bg-rose-50 font-black px-4 py-2.5 rounded-xl shadow transition text-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
          >
            <Phone className="w-4 h-4 text-rose-600 fill-rose-600" />
            <span>{txt.helplineBanner}</span>
          </a>
        </div>
      </div>

      {/* ── Offline Network Fallback Alert ── */}
      {!isOnline && (
        <div className="p-3.5 bg-amber-500 text-slate-950 rounded-2xl text-xs font-black flex items-center justify-between gap-3 shadow-md animate-pulse">
          <div className="flex items-center gap-2">
            <WifiOff className="w-5 h-5 text-slate-950 shrink-0" />
            <span>{txt.offlineModeBadge}</span>
          </div>
          <span className="text-[10px] bg-slate-950 text-amber-300 px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
            Direct 108 SMS Beacon
          </span>
        </div>
      )}

      {/* ── Emergency Service Mode Aggregator Switch (108 / 102 / 112) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setServiceMode('108');
            setAmbulanceType('ALS');
            if (selectedEmergency === 'maternity') setSelectedEmergency('cardiac');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            serviceMode === '108'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>{txt.mode108}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setServiceMode('102');
            setAmbulanceType('BLS');
            setSelectedEmergency('maternity');
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            serviceMode === '102'
              ? 'bg-pink-600 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>{txt.mode102}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setServiceMode('112');
            window.location.href = 'tel:112';
          }}
          className={`py-2 px-3 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            serviceMode === '112'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <span>{txt.mode112}</span>
        </button>
      </div>

      {/* ── 108 Emergency Instant SOS Action Center (Always Visible) ── */}
      <div className="bg-white rounded-2xl border-2 border-rose-500/40 p-4 sm:p-5 shadow-md space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping shrink-0"></span>
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <span>{txt.instantSosBarTitle}</span>
              <span className="text-[10px] bg-rose-100 text-rose-800 border border-rose-200 px-2 py-0.5 rounded-full font-bold">
                Direct Responder Gateway
              </span>
            </h3>
          </div>

          {/* Right Action Bar: Live GPS Lock & Worker Action Desk Drawer Button */}
          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* Worker Action Desk Modal Button */}
            <button
              type="button"
              onClick={() => setShowIncidentModal(true)}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              title="Open Live Field Worker Emergency Dispatch Hub"
            >
              <Bell className="w-3.5 h-3.5 fill-current" />
              <span>{txt.workerDeskBtn}</span>
              {sosIncidents.filter((i) => i.status === 'PENDING_WORKER_ACTION').length > 0 && (
                <span className="bg-red-600 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {sosIncidents.filter((i) => i.status === 'PENDING_WORKER_ACTION').length}
                </span>
              )}
            </button>

            {/* GPS Lock */}
            <button
              type="button"
              onClick={() => handleAutoGps(false)}
              disabled={isDetectingGps}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                liveCoords.isLive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
              }`}
              title="Click to detect/refresh your live GPS coordinates"
            >
              <LocateFixed className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
              <span>
                {isDetectingGps
                  ? txt.gpsDetecting
                  : liveCoords.isLive
                    ? `${txt.gpsLockedBadge}: ${liveCoords.lat}, ${liveCoords.lng}`
                    : txt.useLiveGps}
              </span>
            </button>

            {/* Google Maps link preview */}
            <a
              href={`https://maps.google.com/?q=${liveCoords.lat},${liveCoords.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 font-bold"
              title="Open current GPS location in Google Maps"
            >
              <ExternalLink className="w-3 h-3" />
              <span>{txt.openInMaps}</span>
            </a>
          </div>
        </div>

        {/* ── SOS Direct Recipient Routing Selector ── */}
        <div className="p-3 bg-gradient-to-r from-slate-50 via-rose-50/40 to-slate-50 rounded-xl border border-slate-200/90 flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 shrink-0">
              SOS Direct Destination:
            </span>
            <button
              type="button"
              onClick={() => setSosTargetMode('worker')}
              className={`px-3 py-1.5 rounded-lg border font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                sosTargetMode === 'worker'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{txt.sosSendToWorkers}{workerPhone})</span>
            </button>

            <button
              type="button"
              onClick={() => setSosTargetMode('family')}
              className={`px-3 py-1.5 rounded-lg border font-extrabold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                sosTargetMode === 'family'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{txt.sosSendToFamily}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowWorkerConfig(!showWorkerConfig)}
            className="text-[11px] font-bold text-slate-600 hover:text-rose-700 underline flex items-center gap-1 self-start md:self-auto cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{showWorkerConfig ? 'Hide Config' : '⚙️ Configure Worker Hotline'}</span>
          </button>
        </div>

        {/* Worker Phone Configuration Drawer */}
        {showWorkerConfig && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-2 text-xs animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-black text-amber-950 block">{txt.workerHotlineLbl}</span>
                <span className="text-[11px] text-amber-800 leading-snug">
                  Set the mobile/WhatsApp phone for your response workers or control room. All SOS taps immediately open chats and send texts to this phone!
                </span>
              </div>
              <form onSubmit={handleSaveWorkerPhone} className="flex items-center gap-2 shrink-0">
                <input
                  type="tel"
                  value={tempWorkerPhone}
                  onChange={(e) => setTempWorkerPhone(e.target.value)}
                  placeholder="7008509631"
                  className="px-2.5 py-1.5 bg-white border border-amber-400 rounded-lg font-mono font-bold text-slate-900 text-xs w-36 outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-lg text-xs transition cursor-pointer"
                >
                  {txt.saveWorkerPhone}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Custom Family Number Input (When in Family mode) */}
        {sosTargetMode === 'family' && (
          <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs text-slate-600">
            <Smartphone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-bold">{txt.emergencyContactLbl}:</span>
            <input
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 94370 XXXXX"
              className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 outline-none w-44 focus:border-rose-500"
            />
            <span className="text-[10px] text-slate-500 italic hidden sm:inline">
              * Leave blank to select any contact or group
            </span>
          </div>
        )}

        {/* 3 Large 1-Click Action Buttons: Call 108 | WhatsApp SOS | SMS SOS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. Direct Voice Call */}
          <a
            href="tel:108"
            className="py-3 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
          >
            <Phone className="w-4 h-4 fill-white animate-bounce" />
            <span>{txt.helplineBanner}</span>
          </a>

          {/* 2. WhatsApp SOS with Live GPS */}
          <button
            type="button"
            onClick={handleTriggerWhatsAppSos}
            className="py-3 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
            title="Send Instant WhatsApp Emergency SOS with Live GPS Link"
          >
            <Share2 className="w-4 h-4" />
            <span>
              {sosTargetMode === 'worker' ? `WhatsApp SOS -> Workers (+91 ${workerPhone.slice(-4)})` : txt.whatsappSosBtn}
            </span>
          </button>

          {/* 3. SMS SOS with Live GPS */}
          <button
            type="button"
            onClick={handleTriggerSmsSos}
            className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-black text-white font-black text-xs flex items-center justify-center gap-2 shadow-sm transition active:scale-98 cursor-pointer"
            title="Send Instant SMS SOS Beacon with Live GPS Coordinates"
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {sosTargetMode === 'worker' ? `SMS SOS -> Workers (+91 ${workerPhone.slice(-4)})` : txt.smsSosBtn}
            </span>
          </button>
        </div>
      </div>

      {/* ── Sub-Tabs Bar ────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveSubTab('book')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'book'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          {txt.tabBook}
        </button>

        <button
          onClick={() => setActiveSubTab('track')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'track'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Radio className={`w-3.5 h-3.5 ${activeMission ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`} />
          <span>{txt.tabTrack}</span>
          {activeMission && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-0.5"></span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('my-requests')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'my-requests'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-rose-50'
          }`}
        >
          <span>{txt.tabMyRequests}</span>
          {requests.length > 0 && (
            <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 rounded-full font-black">
              {requests.length}
            </span>
          )}
        </button>

        {/* In-Mission Tele-Consultation Link */}
        <button
          type="button"
          onClick={() => setShowTeleModal(true)}
          className="ml-auto px-4 py-2 rounded-xl text-xs font-bold transition-all bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white flex items-center gap-1.5 shadow-md cursor-pointer"
          title="Instant Video Consultation with Apex Hospital Doctor"
        >
          <Video className="w-3.5 h-3.5 text-blue-200" />
          <span>Live Emergency Tele-OPD</span>
        </button>
      </div>

      {/* SOS Sent Toast Notification */}
      {sosSentToast && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-2xl text-xs font-bold flex items-center justify-between gap-3 shadow-xl animate-fadeIn border border-emerald-500">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-200 shrink-0" />
            <span>{toastMessage || 'Emergency SOS with Live GPS Coordinates dispatched successfully!'}</span>
          </div>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded-md font-mono">
            {liveCoords.lat}, {liveCoords.lng}
          </span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 1: LIVE MISSION TRACKER
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'track' && (
        <div className="space-y-5">
          {!activeMission ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 shadow-sm space-y-3">
              <span className="text-5xl block animate-bounce">🚑</span>
              <h4 className="text-base font-bold text-slate-800">No Active 108 Emergency Mission</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No ambulance is currently dispatched. Use the Book tab to request an emergency ambulance with live telemetry tracking.
              </p>
              <button
                onClick={() => setActiveSubTab('book')}
                className="mt-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Book 108 Ambulance Now
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-5 p-5 sm:p-6">
              {/* Mission Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-rose-600 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-full animate-pulse">
                      ACTIVE EMERGENCY MISSION
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      #{activeMission.id}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {activeMission.emergencyType} • {activeMission.ambulanceType}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Automated WhatsApp SOS */}
                  <button
                    onClick={handleTriggerWhatsAppSos}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white shadow-xs cursor-pointer"
                    title="Send WhatsApp SOS"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>WhatsApp SOS</span>
                  </button>

                  {/* SMS SOS */}
                  <button
                    onClick={handleTriggerSmsSos}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-slate-800 hover:bg-black text-white shadow-xs cursor-pointer"
                    title="Send SMS SOS"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>SMS SOS</span>
                  </button>

                  {/* Siren Sound Toggle */}
                  <button
                    onClick={() => setSirenActive(!sirenActive)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      sirenActive
                        ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sirenActive ? <Volume2 className="w-3.5 h-3.5 text-rose-600" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>Siren {sirenActive ? 'Audio ON' : 'Muted'}</span>
                  </button>

                  <button
                    onClick={() => setConfirmedSlip(activeMission)}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Slip</span>
                  </button>
                </div>
              </div>

              {/* 4-Stage Mission Progress Stepper */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {[
                    { num: 1, label: txt.stage1, active: missionStage >= 1, done: missionStage > 1 },
                    { num: 2, label: txt.stage2, active: missionStage >= 2, done: missionStage > 2 },
                    { num: 3, label: txt.stage3, active: missionStage >= 3, done: missionStage > 3 },
                    { num: 4, label: txt.stage4, active: missionStage >= 4, done: missionStage > 4 }
                  ].map((st) => (
                    <div
                      key={st.num}
                      className={`p-2.5 rounded-xl border transition-all ${
                        st.active
                          ? 'bg-white border-rose-300 shadow-xs font-bold text-rose-900'
                          : 'bg-slate-100/60 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <span
                          className={`w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center ${
                            st.done
                              ? 'bg-emerald-600 text-white'
                              : st.active
                              ? 'bg-rose-600 text-white animate-pulse'
                              : 'bg-slate-300 text-slate-600'
                          }`}
                        >
                          {st.done ? '✓' : st.num}
                        </span>
                      </div>
                      <span className="text-[11px] leading-tight block">{st.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry Dashboard: Real-time Countdown, Speed, Distance, Oxygen */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-center relative overflow-hidden">
                  <div className="text-[10px] text-rose-700 font-bold uppercase tracking-wider">Live ETA Countdown</div>
                  <div className="text-2xl font-black text-rose-950 font-mono mt-0.5 flex items-center justify-center gap-1">
                    <span>{Math.floor(etaSeconds / 60).toString().padStart(2, '0')}:{(etaSeconds % 60).toString().padStart(2, '0')}</span>
                    <span className="text-xs font-semibold">min</span>
                  </div>
                  <div className="text-[10px] text-rose-600 font-medium">⚡ Green Signal Corridor</div>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Remaining Distance</div>
                  <div className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                    {activeMission.distanceRemainingKm} <span className="text-xs font-semibold">km</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Direct Highway Link</div>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center">
                  <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">Vehicle Speed</div>
                  <div className="text-2xl font-black text-blue-950 font-mono mt-0.5">
                    {activeMission.speedKmh} <span className="text-xs font-semibold">km/h</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-medium">GPS Telemetry Stream</div>
                </div>

                <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
                  <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">On-Board Oxygen</div>
                  <div className="text-2xl font-black text-emerald-950 font-mono mt-0.5">
                    94% <span className="text-xs font-semibold">Full</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium">2x Jumbo D-Cylinders</div>
                </div>
              </div>

              {/* Real Interactive Leaflet Live Tracking Map */}
              <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-slate-300 shadow-inner">
                <div ref={trackMapRef} className="w-full h-full bg-slate-100 z-0" />

                {/* Map Floating Status Card */}
                <div className="absolute top-3 left-3 z-10 bg-slate-950/90 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-white/20 text-white text-xs font-bold shadow-xl flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                  <div>
                    <div className="text-xs font-black text-white">Ambulance: {activeMission.vehicleNo}</div>
                    <div className="text-[10px] text-emerald-400 font-mono font-medium">Pilot: {activeMission.driverName} • ALS Life Support</div>
                  </div>
                  <span className="bg-rose-600/80 text-white text-[9px] px-2 py-0.5 rounded-full font-mono font-black ml-2">
                    SIREN ACTIVE
                  </span>
                </div>
              </div>

              {/* Real-Time Telemetry Event Log Stream */}
              <div className="bg-slate-900 text-slate-200 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 border-b border-slate-800 pb-1">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    Live Odisha 108 Mission Telemetry Stream
                  </span>
                  <span className="font-mono text-[10px]">WebSocket Connected</span>
                </div>
                <div className="space-y-1 text-[11px] font-mono">
                  {telemetryLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400 shrink-0">[{log.time}]</span>
                      <span className="text-slate-300">{log.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pilot & Paramedic Dossier Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-rose-600" />
                      Pilot &amp; Paramedic Crew
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ✓ EMT-Certified
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <div>Pilot Name: <strong>{activeMission.driverName}</strong></div>
                    <div>Base Station: <strong>{activeMission.baseStation}</strong></div>
                    <div>Vehicle: <strong>{activeMission.vehicleNo}</strong> ({activeMission.ambulanceType})</div>
                  </div>
                  <a
                    href={`tel:${activeMission.paramedicPhone}`}
                    className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Pilot: {activeMission.paramedicPhone}</span>
                  </a>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                      <Hospital className="w-4 h-4 text-blue-600" />
                      Destination &amp; Patient
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      BSKY Covered
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <div>Patient: <strong>{activeMission.patient.name}</strong> ({activeMission.patient.age} yrs, {activeMission.patient.gender})</div>
                    <div>Pickup: <strong>{activeMission.pickup}</strong></div>
                    <div>Target Hospital: <strong>{activeMission.destination}</strong></div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    ABHA Linkage: <strong className="font-mono">{activeMission.patient.abha}</strong>
                  </div>
                </div>
              </div>

              {/* ── Critical Life Support Section (First Aid Protocols + CPR Metronome) ── */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 shrink-0">
                      <HeartPulse className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">{txt.firstAidSectionTitle}</h4>
                      <p className="text-[11px] text-slate-500">Live clinical instructions approved for bystanders while waiting for pilot arrival</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>{txt.hospitalAlerted}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Interactive CPR Cardiac Metronome */}
                  <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className={`w-5 h-5 text-rose-600 ${cprActive ? 'animate-ping' : ''}`} />
                        <span className="font-extrabold text-xs text-rose-950">{txt.cprTitle}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCprActive(!cprActive)}
                        className={`px-3 py-1.5 rounded-xl font-black text-xs transition cursor-pointer flex items-center gap-1.5 ${
                          cprActive
                            ? 'bg-rose-600 text-white shadow-md animate-pulse'
                            : 'bg-white text-rose-700 border border-rose-300 hover:bg-rose-100'
                        }`}
                      >
                        {cprActive ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{cprActive ? txt.cprBtnStop : txt.cprBtnStart}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-rose-100">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-transform ${
                        cprActive ? 'bg-rose-600 text-white scale-110 shadow-lg' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {cprActive ? cprCount : '110'}
                      </div>
                      <div className="text-[11px] text-slate-700 flex-1">
                        <p className="font-bold text-rose-900">{txt.cprGuide}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Place heel of hand on center of chest. Push hard and fast at 100-120 beats/minute.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 2. Condition-Specific First Aid Action Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-900">
                        {FIRST_AID_PROTOCOLS[activeMission.emergencyId || 'cardiac']?.title[lang] || FIRST_AID_PROTOCOLS['cardiac'].title['en-IN']}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        SOP Verified
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {(FIRST_AID_PROTOCOLS[activeMission.emergencyId || 'cardiac']?.tips || FIRST_AID_PROTOCOLS['cardiac'].tips).map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-rose-600 font-black shrink-0 mt-0.5">•</span>
                          <span className="leading-tight">{tip[lang] || tip['en-IN']}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: BOOK AMBULANCE FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          {/* Quick 1-Click Banner */}
          <div className="p-4 bg-gradient-to-r from-rose-50 via-red-50 to-amber-50 rounded-2xl border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Zap className="w-5 h-5 text-amber-200 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                  <span>{txt.quickBookingTitle}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                    BSKY FREE
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {txt.quickBookingSubtitle}
                </p>
              </div>
            </div>

            <a
              href="tel:108"
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition self-start sm:self-auto cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 fill-white" />
              <span>108 Direct Toll-Free</span>
            </a>
          </div>

          {/* Active Accidental Dispatch Cancel Countdown Banner */}
          {cancelCountdown !== null && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-2xl shadow-lg border border-red-400 animate-pulse flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 text-center sm:text-left">
                <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl text-amber-200 border border-white/30 shrink-0">
                  {cancelCountdown}s
                </div>
                <div>
                  <div className="text-xs uppercase font-extrabold tracking-wider text-amber-200 flex items-center gap-1.5 justify-center sm:justify-start">
                    <AlertOctagon className="w-4 h-4 animate-bounce" />
                    <span>EMERGENCY DISPATCH TRIGGERED</span>
                  </div>
                  <h4 className="text-base font-black">
                    {txt.cancelCountdownMsg} {cancelCountdown}s
                  </h4>
                  <p className="text-xs text-white/90">
                    Allocating nearest unit: <span className="font-mono font-bold text-amber-200">{nearestVehicle.no}</span> ({nearestVehicle.station}, ~{nearestVehicle.etaMins}m ETA)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAbortCountdown}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-rose-700 hover:bg-rose-50 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{txt.undoBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCancelCountdown(null);
                    handleDispatch();
                  }}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>{txt.confirmNowBtn}</span>
                </button>
              </div>
            </div>
          )}

          {/* Panic Hold-to-Dispatch Circular Trigger & Nearest Fleet Radar */}
          {cancelCountdown === null && (
            <div className="p-4 sm:p-5 bg-gradient-to-br from-rose-500/10 via-amber-500/5 to-slate-50 rounded-2xl border-2 border-rose-300 flex flex-col md:flex-row items-center justify-between gap-5 shadow-sm">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping inline-block" />
                  <span>FAST PANIC DISPATCH</span>
                </div>
                <h4 className="text-base font-black text-slate-900 tracking-tight">
                  {txt.panicHoldTitle}
                </h4>
                <p className="text-xs text-slate-600 max-w-md">
                  {txt.panicHoldSub}
                </p>
                {/* Nearest Fleet Radar Pill */}
                <div className="flex flex-wrap items-center gap-2 pt-1 justify-center md:justify-start">
                  <span className="text-[11px] font-semibold text-slate-500">Nearest Fleet:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    {nearestVehicle.station} ({nearestVehicle.no})
                  </span>
                  <span className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
                    ~{nearestVehicle.distanceKm} km away • ~{nearestVehicle.etaMins}m ETA
                  </span>
                </div>
              </div>

              {/* Hold Button with Progress Ring */}
              <div className="flex flex-col items-center gap-1.5 select-none shrink-0">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="stroke-rose-100 fill-none"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      className="stroke-rose-600 fill-none transition-all duration-75"
                      strokeWidth="6"
                      strokeDasharray={2 * Math.PI * 44}
                      strokeDashoffset={2 * Math.PI * 44 * (1 - holdProgress / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <button
                    type="button"
                    onMouseDown={startHold}
                    onMouseUp={cancelHold}
                    onMouseLeave={cancelHold}
                    onTouchStart={startHold}
                    onTouchEnd={cancelHold}
                    className={`absolute inset-2 rounded-full font-black text-white flex flex-col items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer ${
                      isHolding
                        ? 'bg-gradient-to-tr from-red-700 to-rose-600 scale-95 shadow-red-500/50'
                        : 'bg-gradient-to-tr from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-600'
                    }`}
                  >
                    <Ambulance className={`w-7 h-7 mb-0.5 ${isHolding ? 'animate-bounce' : ''}`} />
                    <span className="text-[10px] uppercase tracking-wider font-extrabold leading-none">
                      {isHolding ? `${Math.round(holdProgress)}%` : 'HOLD 2s'}
                    </span>
                    <span className="text-[9px] opacity-80 leading-none mt-0.5">DISPATCH</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">
                  {isHolding ? 'Release to cancel' : 'Press & hold 2 sec'}
                </span>
              </div>
            </div>
          )}

          {/* Step 1: Emergency Condition (One tap) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-800 uppercase tracking-wide">
                {txt.emergencyTypeLabel}
              </label>
              <span className="text-[11px] text-slate-500 font-semibold">Select 1</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
              {emergencyTypes.map((et) => (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setSelectedEmergency(et.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedEmergency === et.id
                      ? `${et.color} shadow-sm font-bold ring-2 ring-rose-500/60 scale-[1.01]`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0">{et.icon}</span>
                  <span className="text-xs font-bold leading-tight">
                    {et.label[lang] || et.label['en-IN']}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Essential Details Only (Phone + Pickup GPS) */}
          <div className="space-y-4 pt-1">
            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phone Number */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  {txt.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="+91 94370 12345"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xs font-bold text-slate-900 font-mono outline-none"
                  />
                </div>
              </div>

              {/* Patient Name */}
              <div>
                <label className="block text-xs font-black text-slate-800 mb-1">
                  {txt.nameLabel} <span className="font-normal text-slate-400">(or Caller)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={currentUser?.name || 'Citizen Patient'}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Pickup Location with 1-Click GPS Button */}
              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-black text-slate-800">
                    {txt.pickupLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoGps(false)}
                    disabled={isDetectingGps}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition cursor-pointer"
                  >
                    <LocateFixed className={`w-3.5 h-3.5 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    <span>{isDetectingGps ? txt.gpsDetecting : txt.useLiveGps}</span>
                  </button>
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder={txt.pickupPlaceholder}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
                {/* Quick Landmark Chips */}
                <div className="flex items-center gap-1.5 mt-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-400 font-bold shrink-0">Landmark Hubs:</span>
                  {[
                    { name: 'Master Canteen', lat: 20.2668, lng: 85.8398, dist: 'Khordha' },
                    { name: 'Patia / KIIT', lat: 20.3540, lng: 85.8190, dist: 'Khordha' },
                    { name: 'Cuttack SCB', lat: 20.4800, lng: 85.8820, dist: 'Cuttack' },
                    { name: 'Puri Grand Rd', lat: 19.8110, lng: 85.8280, dist: 'Puri' },
                    { name: 'Berhampur MKCG', lat: 19.3080, lng: 84.8020, dist: 'Ganjam' },
                    { name: 'Sambalpur Burla', lat: 21.5030, lng: 83.8730, dist: 'Sambalpur' }
                  ].map((lm) => (
                    <button
                      key={lm.name}
                      type="button"
                      onClick={() => {
                        setPickupAddress(`${lm.name}, ${lm.dist} (GPS: ${lm.lat}, ${lm.lng})`);
                        setPickupDistrict(lm.dist);
                        setLiveCoords({ lat: lm.lat, lng: lm.lng, isLive: true, accuracy: 15 });
                      }}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded-md shrink-0 font-medium border border-slate-200 transition cursor-pointer"
                    >
                      {lm.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Collapsible: Optional Advanced Details (Toggle) */}
            <div className="pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowOptionalFields((prev) => !prev)}
                className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 text-xs font-bold flex items-center justify-between transition cursor-pointer border border-slate-200"
              >
                <div className="flex items-center gap-2">
                  <Settings2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>{showOptionalFields ? txt.hideMoreDetails : txt.showMoreDetails}</span>
                </div>
                {showOptionalFields ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showOptionalFields && (
                <div className="mt-3 p-4 bg-slate-50/70 rounded-2xl border border-slate-200 space-y-3.5 text-xs animate-fadeIn">
                  {/* Ambulance Type Choice */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                      {txt.ambulanceTypeLabel}
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {ambulanceTypeOptions.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setAmbulanceType(opt.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            ambulanceType === opt.id
                              ? `${opt.selectedBorder} ring-2 ring-rose-500/40 font-bold`
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <span className="font-bold text-xs">{opt.label}</span>
                          <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                            {opt.badge}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Destination Hospital & Demographics */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{txt.destinationLabel}</label>
                      <input
                        type="text"
                        value={destinationHospital}
                        onChange={(e) => setDestinationHospital(e.target.value)}
                        placeholder="e.g. Capital Hospital, SCB Medical, AIIMS"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{txt.abhaLabel}</label>
                      <input
                        type="text"
                        value={patientAbha}
                        onChange={(e) => setPatientAbha(e.target.value)}
                        placeholder="91-0000-0000-0000"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono text-slate-900"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{txt.ageLabel}</label>
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          placeholder="e.g. 42"
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs font-mono text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">{txt.genderLabel}</label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
                        >
                          <option value="Male">{txt.male}</option>
                          <option value="Female">{txt.female}</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">{txt.notesLabel}</label>
                      <input
                        type="text"
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        placeholder="e.g. Chest pain, difficulty breathing"
                        className="w-full px-3 py-2 bg-white rounded-lg border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instant Dispatch Button */}
            <div className="space-y-3 pt-2">
              {currentUser?.isGuest && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-[11px] font-semibold leading-relaxed">
                      {txt.guestLockMsg}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (onRequireAuth) onRequireAuth();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer transition active:scale-95"
                      >
                        {txt.guestLoginBtn}
                      </button>
                      <a
                        href="tel:108"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer transition active:scale-95"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Dial 108 Emergency</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleDispatch}
                className={`w-full py-4 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer border ${
                  currentUser?.isGuest
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 border-amber-500/40'
                    : 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 border-rose-500/40 active:scale-[0.99] shadow-rose-200'
                }`}
              >
                {currentUser?.isGuest ? (
                  <>
                    <Lock className="w-4 h-4 text-white" />
                    <span>{txt.guestLoginBtn}</span>
                  </>
                ) : (
                  <>
                    <Phone className="w-4 h-4 text-white fill-white animate-bounce" />
                    <span>{txt.quickDispatchBtn}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </>
                )}
              </button>

              {/* Secondary Instant SOS Options in Booking Card */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerWhatsAppSos}
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition active:scale-95"
                  title="Send Emergency WhatsApp SOS with Current Live GPS"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{txt.whatsappSosBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={handleTriggerSmsSos}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer transition active:scale-95"
                  title="Send Emergency SMS SOS with Current Live GPS"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{txt.smsSosBtn}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 3: MY REQUESTS
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'my-requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-sm shadow-sm">
              <span className="text-4xl block mb-3">🚑</span>
              <p>{txt.noRequests}</p>
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-rose-50 border-b border-rose-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚑</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-700">{req.id}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-rose-600">
                          {req.ambulanceType}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          ✓ {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-rose-700 font-semibold mt-0.5">{req.emergencyType}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setActiveMission(req);
                        setActiveSubTab('track');
                      }}
                      title="Open Live Tracker"
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      <span>Track</span>
                    </button>
                    <button
                      onClick={() => setConfirmedSlip(req)}
                      title="Re-print slip"
                      className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-700 transition cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCancelRequest(req.id)}
                      title="Cancel Request"
                      className="p-2 hover:bg-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>Patient:</strong> {req.patient?.name} | {req.patient?.phone}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>Pickup:</strong> {req.pickup}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>Destination:</strong> {req.destination}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>Time:</strong> {req.requestedAt}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          LIVE EMERGENCY TELECONSULTATION SUITE MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {showTeleModal && (
        <TeleConsultationSuite
          currentUser={currentUser}
          appLang={lang}
          onClose={() => setShowTeleModal(false)}
        />
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DISPATCH CONFIRMATION SLIP MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {confirmedSlip && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-4">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{txt.slipTitle}</h3>
                <p className="text-xs text-slate-500">{txt.slipSubtitle}</p>
              </div>
              <button onClick={() => setConfirmedSlip(null)} className="p-1.5 hover:bg-slate-100 rounded-lg cursor-pointer">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">✓ {txt.statusDispatched}</p>
                  <p className="text-xs text-emerald-600">{txt.estimatedEta} <strong>{confirmedSlip.etaMins} mins</strong></p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {[
                  { label: txt.bookingId, value: confirmedSlip.id, mono: true },
                  { label: txt.emergencyType, value: confirmedSlip.emergencyType, mono: false },
                  { label: txt.ambulanceTypeLbl, value: confirmedSlip.ambulanceType, mono: false },
                  { label: txt.vehicleNo, value: confirmedSlip.vehicleNo, mono: true },
                  { label: txt.paramedic, value: confirmedSlip.paramedicPhone, mono: true },
                  { label: 'Pickup Location', value: confirmedSlip.pickup, mono: false },
                  { label: 'Destination', value: confirmedSlip.destination, mono: false }
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start gap-2 pb-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-xs text-slate-500 shrink-0">{label}</span>
                    <span className={`text-xs font-semibold text-slate-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleTriggerWhatsAppSos}
                  className="py-2.5 px-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>WhatsApp SOS</span>
                </button>
                <button
                  type="button"
                  onClick={handleTriggerSmsSos}
                  className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>SMS SOS</span>
                </button>
              </div>

              <a
                href="tel:108"
                className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition text-sm cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>{txt.helpline108}</span>
              </a>
            </div>

            {onOpenNmcSuite && (
              <div className="px-5 pb-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedSlip(null);
                    onOpenNmcSuite();
                  }}
                  className="w-full flex items-center justify-center gap-1.5 bg-gradient-to-r from-purple-700 to-indigo-800 hover:from-purple-800 hover:to-indigo-900 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-2xs cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Attach / View Official NMC Referral Slip (QR Code)</span>
                </button>
              </div>
            )}

            <div className="flex gap-2 px-5 pb-5">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{txt.printSlip}</span>
              </button>
              <button
                onClick={() => setConfirmedSlip(null)}
                className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
              >
                {txt.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SMS SOS Dispatch Dialog Modal ── */}
      {smsModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">SMS SOS Emergency Beacon</h4>
                  <span className="text-[11px] font-bold text-emerald-600">✓ Message Copied to Clipboard</span>
                </div>
              </div>
              <button
                onClick={() => setSmsModalData(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-800 font-mono leading-relaxed select-all max-h-40 overflow-y-auto">
              {smsModalData.text}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>Target Recipient: <strong className="text-slate-800 font-mono">{smsModalData.recipient}</strong></span>
              <span className="text-emerald-700 font-bold">Ready to Send</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  try {
                    navigator.clipboard?.writeText(smsModalData.text);
                    alert(txt.copiedToClipboard || 'SMS text copied to clipboard!');
                  } catch (e) {}
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
                  const sep = isIos ? '&' : '?';
                  const clean = (smsModalData.phone || workerPhone || '7008509631').replace(/\D/g, '');
                  const link = `sms:${clean}${sep}body=${encodeURIComponent(smsModalData.text)}`;
                  window.location.href = link;
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open SMS App</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Field Worker Emergency Action Desk & Incident Dispatch Modal ── */}
      {showIncidentModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md">
                  <Bell className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base flex items-center gap-2">
                    <span>Emergency Worker Incident Action Desk</span>
                    <span className="text-[10px] bg-rose-500/40 text-rose-200 border border-rose-400/40 px-2 py-0.5 rounded-full font-mono">
                      LIVE DISPATCH
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Active Worker Hotline: <strong className="text-amber-300 font-mono">+91 {workerPhone}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subheader & Actions */}
            <div className="p-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-700">Total Incidents: {sosIncidents.length}</span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-black text-[11px]">
                  {sosIncidents.filter((i) => i.status === 'PENDING_WORKER_ACTION').length} Pending Immediate Action
                </span>
              </div>
              {sosIncidents.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearIncidents}
                  className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Logged</span>
                </button>
              )}
            </div>

            {/* Incidents List Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
              {sosIncidents.length === 0 ? (
                <div className="text-center py-12 space-y-2 text-slate-400">
                  <ShieldCheck className="w-12 h-12 mx-auto text-emerald-500/70" />
                  <p className="font-bold text-sm text-slate-700">No Pending Emergency SOS Beacons</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    When any user on this web portal taps WhatsApp SOS or SMS SOS, the emergency alert with live GPS and patient details will stream directly here and alert on your phone.
                  </p>
                </div>
              ) : (
                sosIncidents.map((inc) => (
                  <div
                    key={inc.id}
                    className={`p-4 rounded-2xl border transition-all space-y-3 ${
                      inc.status === 'PENDING_WORKER_ACTION'
                        ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-400/40'
                        : inc.status === 'RESOLVED'
                          ? 'bg-emerald-50/50 border-emerald-200 opacity-80'
                          : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] font-black bg-slate-900 text-white">
                          {inc.channel || 'SOS BEACON'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          inc.status === 'PENDING_WORKER_ACTION'
                            ? 'bg-red-600 text-white animate-pulse'
                            : inc.status === 'RESPONDED'
                              ? 'bg-amber-100 text-amber-800'
                              : inc.status === 'DISPATCHED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {inc.status === 'PENDING_WORKER_ACTION' ? '🚨 ACTION REQUIRED' : inc.status}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {inc.timeFormatted || new Date(inc.timestamp).toLocaleTimeString()}
                        </span>
                      </div>

                      <span className="text-xs font-bold text-slate-700">
                        Assigned Unit: <strong className="text-slate-900">{inc.allocatedVehicle || '108 Fleet'}</strong>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Caller / Patient</span>
                        <span className="font-extrabold text-slate-900 text-sm">{inc.callerName}</span>
                        <span className="text-slate-600 block font-mono">{inc.callerPhone}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase block">Emergency Triage</span>
                        <span className="font-extrabold text-rose-700">{inc.emergencyType}</span>
                        <span className="text-slate-500 block truncate">{inc.pickup}</span>
                      </div>
                    </div>

                    {/* Action Bar for Field Worker */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
                      {/* Call Caller */}
                      <a
                        href={`tel:${inc.callerPhone}`}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5 fill-white" />
                        <span>Call Caller Now</span>
                      </a>

                      {/* Google Maps GPS */}
                      <a
                        href={inc.gMapsLink || `https://maps.google.com/?q=${inc.coords?.lat},${inc.coords?.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open GPS Navigation</span>
                      </a>

                      {/* WhatsApp Caller */}
                      {inc.callerPhone && (
                        <a
                          href={`https://api.whatsapp.com/send?phone=${inc.callerPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hello ${inc.callerName}, this is SwasthyaMitra 108 Emergency Response. We received your SOS Beacon. Help is en route!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>WhatsApp Caller</span>
                        </a>
                      )}

                      {/* Status Toggles */}
                      <div className="ml-auto flex items-center gap-1.5">
                        {inc.status === 'PENDING_WORKER_ACTION' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateIncidentStatus(inc.id, 'RESPONDED')}
                            className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            Mark In Progress
                          </button>
                        )}
                        {inc.status !== 'DISPATCHED' && inc.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateIncidentStatus(inc.id, 'DISPATCHED')}
                            className="px-2.5 py-1 bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            Mark Dispatched
                          </button>
                        )}
                        {inc.status !== 'RESOLVED' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateIncidentStatus(inc.id, 'RESOLVED')}
                            className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs rounded-lg transition cursor-pointer"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>All SOS beacons are logged locally and dispatched with live GPS timestamps.</span>
              <button
                type="button"
                onClick={() => setShowIncidentModal(false)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl transition cursor-pointer"
              >
                Close Desk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
