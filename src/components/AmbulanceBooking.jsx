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
  Check
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAmbulanceRequests, saveAmbulanceRequest, cancelAmbulanceRequest } from '../utils/authStorage';
import { ODISHA_MEDICAL_FACILITIES, ODISHA_LOCATIONS, calculateDistanceKm } from '../utils/nearestMedicalData';
import TeleConsultationSuite from './TeleConsultationSuite';

export default function AmbulanceBooking({ currentUser, appLang, onNavigateToNearest, onOpenNmcSuite }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('book'); // 'book' | 'track' | 'my-requests'
  const [selectedEmergency, setSelectedEmergency] = useState('cardiac');
  const [ambulanceType, setAmbulanceType] = useState('ALS');
  const [patientName, setPatientName] = useState(currentUser?.name || 'Pratap Mohanty');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '+91 94370 12345');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '91-7712-4439-8021');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '42');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [pickupAddress, setPickupAddress] = useState('Master Canteen Square, Station Link');
  const [pickupDistrict, setPickupDistrict] = useState(currentUser?.district || 'Khordha');
  const [pickupState, setPickupState] = useState(currentUser?.state || 'Odisha');
  const [destinationHospital, setDestinationHospital] = useState('Capital Hospital & Trauma Care');
  const [attendants, setAttendants] = useState('1');
  const [additionalNotes, setAdditionalNotes] = useState('Patient experiencing crushing chest pain, cold sweating, SpO2 93%');
  const [formError, setFormError] = useState('');

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
      stage4: '୪. ହସ୍ପିଟାଲ୍ ଯାତ୍ରା (Transporting)'
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
      stage4: '4. अस्पताल यात्रा (Transporting)'
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
      stage4: '4. Transporting to Hospital'
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

  // Handle Dispatch Form Submit
  const handleDispatch = (e) => {
    if (e) e.preventDefault();
    setFormError('');

    if (!patientName.trim() || !patientPhone.trim() || !pickupAddress.trim()) {
      setFormError(txt.errorFields);
      return;
    }

    const vehiclePool = [
      { no: 'OD-02-AB-1081', pilot: 'Sanjay Kumar Barik', phone: '+91 94371 10801', base: 'Master Canteen Emergency Bay' },
      { no: 'OD-02-CB-1084', pilot: 'Bikram Keshari Rout', phone: '+91 94371 10804', base: 'Baramunda Fire Station Stand' },
      { no: 'OD-05-AB-1082', pilot: 'Ranjit Sahoo', phone: '+91 94371 10812', base: 'SCB Medical College Gate 1' },
      { no: 'OD-33-ICU-9901', pilot: 'Debendra Pradhan', phone: '+91 94373 99011', base: 'AIIMS Bhubaneswar Emergency Terminal' }
    ];

    const chosenVehicle = vehiclePool[Math.floor(Math.random() * vehiclePool.length)];
    const emergItem = emergencyTypes.find((et) => et.id === selectedEmergency);
    const emergLabel = emergItem ? emergItem.label[lang] || emergItem.label['en-IN'] : selectedEmergency;

    const newSlip = {
      id: `OD-108-${Math.floor(100000 + Math.random() * 900000)}`,
      emergencyType: emergLabel,
      emergencyId: selectedEmergency,
      ambulanceType: ambulanceType,
      vehicleNo: chosenVehicle.no,
      driverName: chosenVehicle.pilot,
      paramedicPhone: chosenVehicle.phone,
      baseStation: chosenVehicle.base,
      etaMins: ambulanceType === 'ALS' ? 7 : 5,
      speedKmh: 58,
      distanceRemainingKm: 3.2,
      oxygenBar: 94,
      batteryVolt: '13.8V',
      fuelLevel: '78%',
      patient: {
        name: patientName,
        phone: patientPhone,
        abha: patientAbha,
        age: patientAge,
        gender: patientGender
      },
      pickup: `${pickupAddress}, ${pickupDistrict}, ${pickupState}`,
      destination: destinationHospital,
      attendants: attendants,
      notes: additionalNotes,
      status: 'DISPATCHED_EN_ROUTE',
      requestedAt: new Date().toLocaleString('en-IN'),
      startCoords: { lat: 20.2640, lng: 85.8390 }, // Ambulance location
      pickupCoords: { lat: 20.2710, lng: 85.8440 }, // Patient pickup
      hospCoords: { lat: 20.2640, lng: 85.8235 } // Capital Hospital
    };

    const updated = saveAmbulanceRequest(newSlip);
    setRequests(updated);
    setActiveMission(newSlip);
    setConfirmedSlip(newSlip);
    setActiveSubTab('track');
    setMissionStage(2); // En route immediately
    setEtaSeconds(420);
  };

  // Automated 1-Click WhatsApp SOS Trigger
  const handleTriggerWhatsAppSos = () => {
    if (!activeMission) return;
    const coords = activeMission.pickupCoords || { lat: 20.2710, lng: 85.8440 };
    const gMapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    const message = `🚨 *EMERGENCY MEDICAL SOS — 108 AMBULANCE DISPATCHED*\n\n` +
      `*Patient:* ${activeMission.patient?.name || 'Patient'} (${activeMission.patient?.age || '42'} yrs, ${activeMission.patient?.gender || 'Male'})\n` +
      `*Condition:* ${activeMission.emergencyType} (${activeMission.ambulanceType})\n` +
      `*Vehicle:* ${activeMission.vehicleNo} | *Pilot:* ${activeMission.driverName} (${activeMission.paramedicPhone})\n` +
      `*Live ETA:* ~${Math.ceil(etaSeconds / 60)} Mins (${activeMission.distanceRemainingKm || 2.8} km away)\n` +
      `*Pickup Location:* ${activeMission.pickup}\n` +
      `*Destination Hospital:* ${activeMission.destination}\n` +
      `*Live GPS Coordinates:* ${gMapsLink}\n\n` +
      `_Sent via Odisha SwasthyaMitra National Health Mission (108 SOS)_`;

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    setSosSentToast(true);
    setTimeout(() => setSosSentToast(false), 3000);
  };

  // Automated 1-Click SMS SOS Trigger
  const handleTriggerSmsSos = () => {
    if (!activeMission) return;
    const coords = activeMission.pickupCoords || { lat: 20.2710, lng: 85.8440 };
    const gMapsLink = `https://www.google.com/maps?q=${coords.lat},${coords.lng}`;
    const message = `EMERGENCY 108 SOS: ${activeMission.patient?.name} (${activeMission.emergencyType}). Amb: ${activeMission.vehicleNo} arriving in ${Math.ceil(etaSeconds / 60)}m. GPS: ${gMapsLink}`;
    window.location.href = `sms:?body=${encodeURIComponent(message)}`;
    setSosSentToast(true);
    setTimeout(() => setSosSentToast(false), 3000);
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

        {/* 1-Click WhatsApp SOS Dispatch Button */}
        {activeMission && (
          <button
            type="button"
            onClick={handleTriggerWhatsAppSos}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center gap-1.5 shadow-md cursor-pointer transition active:scale-95"
            title="Send Automated Emergency WhatsApp SOS to Family & PHC Duty Doctor"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp SOS</span>
          </button>
        )}

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
        <div className="bg-emerald-600 text-white p-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-200" />
          <span>Emergency SOS with Live GPS Coordinates dispatched successfully!</span>
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
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          TAB 2: BOOK AMBULANCE FORM
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-6">
          {/* 1. Emergency Condition Selector */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-2.5">
              {txt.emergencyTypeLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {emergencyTypes.map((et) => (
                <button
                  key={et.id}
                  type="button"
                  onClick={() => setSelectedEmergency(et.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                    selectedEmergency === et.id
                      ? `${et.color} shadow-sm font-bold ring-2 ring-rose-500/50`
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <span className="text-xl shrink-0">{et.icon}</span>
                  <span className="text-xs leading-tight">
                    {et.label[lang] || et.label['en-IN']}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Ambulance Configuration Selector */}
          <div>
            <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-2.5">
              {txt.ambulanceTypeLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ambulanceTypeOptions.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setAmbulanceType(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                    ambulanceType === opt.id
                      ? `${opt.selectedBorder} shadow-sm ring-2 ring-rose-500/40 font-bold`
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full ${opt.badgeColor}`}>
                      {opt.badge}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900 leading-tight">
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Patient Details & Location Form */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">
              {txt.patientDetailsLabel}
            </h4>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.nameLabel}</label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="e.g. Pratap Mohanty"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.phoneLabel}</label>
                <input
                  type="tel"
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+91 94370 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.abhaLabel}</label>
                <input
                  type="text"
                  value={patientAbha}
                  onChange={(e) => setPatientAbha(e.target.value)}
                  placeholder="91-7712-4439-8021"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{txt.ageLabel}</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{txt.genderLabel}</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900"
                  >
                    <option value="Male">{txt.male}</option>
                    <option value="Female">{txt.female}</option>
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.pickupLabel}</label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder={txt.pickupPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.destinationLabel}</label>
                <input
                  type="text"
                  value={destinationHospital}
                  onChange={(e) => setDestinationHospital(e.target.value)}
                  placeholder={txt.destinationPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">{txt.notesLabel}</label>
                <textarea
                  rows={2}
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={txt.notesPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-xs text-slate-900"
                />
              </div>
            </div>

            {/* Dispatch Button */}
            <button
              type="button"
              onClick={handleDispatch}
              className="w-full py-3.5 bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm cursor-pointer border border-rose-500/40"
            >
              <Phone className="w-4 h-4 text-white" />
              <span>{txt.dispatchBtn}</span>
            </button>
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
    </div>
  );
}
