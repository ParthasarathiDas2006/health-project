import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Heart,
  HeartPulse,
  Radio,
  Gauge,
  Volume2,
  VolumeX,
  Navigation,
  CheckCircle2,
  Check,
  X,
  ChevronRight,
  ChevronDown,
  User,
  Users,
  Flame,
  Zap,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Plus,
  Send,
  ExternalLink,
  Copy,
  FileText,
  Hospital,
  LocateFixed,
  ArrowRight,
  Lock,
  Battery,
  Download,
  Printer
} from 'lucide-react';
import InteractiveLeafletMap from './InteractiveLeafletMap';
import {
  getAmbulanceRequests,
  saveAmbulanceRequest,
  updateAmbulanceStatus,
  updateAmbulanceDetails,
  getStoredUsers
} from '../utils/authStorage';
import { ODISHA_MEDICAL_FACILITIES, calculateDistanceKm } from '../utils/nearestMedicalData';

// ─────────────────────────────────────────────────────────────────────────────
// FLEET PILOT PROFILES & VEHICLES REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
const FLEET_PILOTS = [
  {
    id: 'USR-DRV-1081',
    name: 'Sanjay Kumar Barik (ସଞ୍ଜୟ କୁମାର ବାରିକ)',
    shortName: 'Pilot Sanjay Barik',
    staffId: 'PILOT-108-OD-1081',
    role: '108 ALS Emergency Ambulance Pilot',
    vehicleNo: 'OD-02-AB-1081',
    ambulanceType: '108 ALS — Advanced Life Support',
    ambulanceTypeId: 'ALS',
    phone: '+91 94371 10801',
    base: 'Master Canteen Emergency Stand, Bhubaneswar',
    lat: 20.2668,
    lng: 85.8398,
    district: 'Khurda',
    emtName: 'Babulal Murmu (EMT-108 Senior)',
    emtPhone: '+91 94371 10822',
    shift: 'Apex Emergency Response (07:00 - 19:00)',
    o2Level: 1850, // PSI
    fuelLevel: 84 // %
  },
  {
    id: 'USR-DRV-1084',
    name: 'Bikram Keshari Rout (ବିକ୍ରମ କେଶରୀ ରାଉତ)',
    shortName: 'Pilot Bikram Rout',
    staffId: 'PILOT-108-OD-1084',
    role: '108 BLS Emergency Ambulance Pilot',
    vehicleNo: 'OD-02-CB-1084',
    ambulanceType: '108 BLS — Basic Life Support',
    ambulanceTypeId: 'BLS',
    phone: '+91 94371 10804',
    base: 'Baramunda Fire Station Depot, Bhubaneswar',
    lat: 20.2580,
    lng: 85.7820,
    district: 'Khurda',
    emtName: 'Tapas Swain (EMT-108 General)',
    emtPhone: '+91 94371 10825',
    shift: 'Night Emergency (19:00 - 07:00)',
    o2Level: 1650,
    fuelLevel: 72
  },
  {
    id: 'USR-DRV-1090',
    name: 'Debendra Pradhan (ଦେବେନ୍ଦ୍ର ପ୍ରଧାନ)',
    shortName: 'Pilot Debendra Pradhan',
    staffId: 'PILOT-108-OD-1090',
    role: '108 ALS Cardiac Resuscitation Pilot',
    vehicleNo: 'OD-02-ALS-1090',
    ambulanceType: '108 ALS — Advanced Life Support (ICU on Wheels)',
    ambulanceTypeId: 'ALS',
    phone: '+91 94373 99011',
    base: 'Capital Hospital ICU Terminal, Bhubaneswar',
    lat: 20.2640,
    lng: 85.8235,
    district: 'Khurda',
    emtName: 'Rajesh Pradhan (EMT Neuro-Trauma)',
    emtPhone: '+91 94373 99033',
    shift: 'Apex Emergency (09:00 - 21:00)',
    o2Level: 1950,
    fuelLevel: 90
  },
  {
    id: 'USR-DRV-1021',
    name: 'Kailash Behera (କୈଳାଶ ବେହେରା)',
    shortName: 'Pilot Kailash Behera',
    staffId: 'PILOT-102-OD-1021',
    role: '102 Janani Shishu Express Ambulance Pilot',
    vehicleNo: 'OD-13-JAN-1021',
    ambulanceType: '102 Janani Shishu Express (Maternal & Infant Care)',
    ambulanceTypeId: '102_JANANI',
    phone: '+91 94374 10201',
    base: 'Puri District Maternity Base Depot, Puri',
    lat: 19.8110,
    lng: 85.8280,
    district: 'Puri',
    emtName: 'Sister Pratibha Marndi (ANM Attendant)',
    emtPhone: '+91 94374 10234',
    shift: '24x7 Maternity Call Shift',
    o2Level: 1720,
    fuelLevel: 68
  },
  {
    id: 'USR-DRV-9901',
    name: 'Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)',
    shortName: 'Pilot Pratap Mohanty',
    staffId: 'PILOT-108-OD-9901',
    role: '108 ALS Highway Trauma Interceptor Pilot',
    vehicleNo: 'OD-33-ICU-9901',
    ambulanceType: '108 ALS — Trauma & Airway Support',
    ambulanceTypeId: 'ALS',
    phone: '+91 94372 88102',
    base: 'AIIMS Bhubaneswar Trauma Stand, Khurda',
    lat: 20.2310,
    lng: 85.7750,
    district: 'Khurda',
    emtName: 'Debendra Bhoi (EMT Trauma Specialist)',
    emtPhone: '+91 94372 88133',
    shift: 'Highway Trauma (08:00 - 20:00)',
    o2Level: 1900,
    fuelLevel: 88
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// EMERGENCY DISPATCH LIFECYCLE STAGES
// ─────────────────────────────────────────────────────────────────────────────
const DISPATCH_STAGES = [
  { key: 'DISPATCHED', labelEn: 'Dispatched', labelOr: 'ଡିସପାଚ୍ ହୋଇଛି', labelHi: 'डिस्पैच हुआ', color: 'bg-amber-500 text-white' },
  { key: 'EN_ROUTE_PICKUP', labelEn: 'En Route Pickup', labelOr: 'ରୋଗୀଙ୍କ ନିକଟକୁ ଯାଉଛି', labelHi: 'मरीज की ओर रवाना', color: 'bg-blue-600 text-white' },
  { key: 'AT_SCENE', labelEn: 'At Scene', labelOr: 'ଘଟଣାସ୍ଥଳରେ ପହଞ୍ଚିଛି', labelHi: 'घटनास्थल पर उपस्थित', color: 'bg-indigo-600 text-white' },
  { key: 'PATIENT_ON_BOARD', labelEn: 'Patient Onboard', labelOr: 'ରୋଗୀ ଗାଡ଼ିରେ ଅଛନ୍ତି', labelHi: 'मरीज सवार हुआ', color: 'bg-purple-600 text-white' },
  { key: 'TRANSIT_TO_APEX', labelEn: 'Transit to Hospital', labelOr: 'ଡାକ୍ତରଖାନା ଯାତ୍ରା ଚାଲିଛି', labelHi: 'अस्पताल ट्रांजिट', color: 'bg-rose-600 text-white' },
  { key: 'ARRIVED_HOSPITAL', labelEn: 'At Hospital (Handover)', labelOr: 'ଡାକ୍ତରଖାନାରେ ହସ୍ତାନ୍ତର', labelHi: 'अस्पताल में हैंडओवर', color: 'bg-emerald-600 text-white' }
];

// ─────────────────────────────────────────────────────────────────────────────
// EMERGENCY SPEED DIALS & HOTLINES
// ─────────────────────────────────────────────────────────────────────────────
const EMERGENCY_HOTLINES = [
  { id: '108_DISPATCH', nameEn: '108 State Central Dispatch Room', nameOr: '୧୦୮ ରାଜ୍ୟ କେନ୍ଦ୍ରୀୟ କଣ୍ଟ୍ରୋଲ୍ ରୁମ୍', phone: '108', badge: 'Toll Free • 24x7 Emergency', color: 'from-rose-600 to-red-700' },
  { id: '102_JANANI', nameEn: '102 Janani Shishu Express Desk', nameOr: '୧୦୨ ଜନନୀ ଶିଶୁ ଏକ୍ସପ୍ରେସ୍ ଡେସ୍କ', phone: '102', badge: 'Maternal & Newborn • 24x7', color: 'from-pink-600 to-rose-700' },
  { id: 'POLICE_112', nameEn: '112 Green Corridor & Police Control', nameOr: '୧୧୨ ପୋଲିସ୍ ଗ୍ରୀନ୍ କରିଡର୍ ନିୟନ୍ତ୍ରଣ', phone: '112', badge: 'Traffic Clearance & Highway Escort', color: 'from-blue-600 to-indigo-800' },
  { id: 'ODRAF_101', nameEn: '101 Fire & ODRAF Disaster Rescue', nameOr: '୧୦୧ ଅଗ୍ନିଶମ ଓ ଓଡ୍ରାଫ୍ ବିପର୍ଯ୍ୟୟ ଉଦ୍ଧାର', phone: '101', badge: 'Vehicle Extrication & HazMat', color: 'from-amber-600 to-orange-700' },
  { id: 'SCB_CASUALTY', nameEn: 'SCB Medical College Trauma ICU Desk', nameOr: 'SCB ମେଡିକାଲ୍ ଟ୍ରମା ICU ଡେସ୍କ', phone: '0671-2414080', badge: 'Cuttack Apex Casualty Bay', color: 'from-emerald-700 to-teal-800' },
  { id: 'AIIMS_EMERGENCY', nameEn: 'AIIMS Bhubaneswar Emergency Bay', nameOr: 'AIIMS ଭୁବନେଶ୍ୱର ଜରୁରୀକାଳୀନ ୟୁନିଟ୍', phone: '0674-2476789', badge: 'Apex National Trauma Bay', color: 'from-purple-700 to-indigo-900' },
  { id: 'CAPITAL_CASUALTY', nameEn: 'Capital Hospital Casualty Command', nameOr: 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍ କାଜୁଆଲିଟି କମାଣ୍ଡ', phone: '0674-2391983', badge: 'Bhubaneswar City Trauma Bay', color: 'from-slate-700 to-slate-900' }
];

export default function AmbulanceDriverAdmin({
  currentUser,
  appLang = 'or-IN',
  onNavigateTab,
  onSwitchUser
}) {
  // 1. ACTIVE PILOT IDENTITY
  const [activePilot, setActivePilot] = useState(() => {
    // Check if logged-in user is already a pilot
    if (currentUser?.vehicleNo || currentUser?.roleCategory === 'driver') {
      const match = FLEET_PILOTS.find(
        (p) => p.staffId === currentUser.staffId || p.vehicleNo === currentUser.vehicleNo
      );
      if (match) return match;
      return {
        id: currentUser.id || 'USR-DRV-CUSTOM',
        name: currentUser.name || 'Emergency Ambulance Pilot',
        shortName: currentUser.name?.split(' ')[0] || 'Pilot',
        staffId: currentUser.staffId || 'PILOT-108-OD',
        role: currentUser.role || 'Ambulance Pilot',
        vehicleNo: currentUser.vehicleNo || 'OD-02-AB-1081',
        ambulanceType: currentUser.ambulanceType || '108 ALS — Advanced Life Support',
        ambulanceTypeId: currentUser.ambulanceTypeId || 'ALS',
        phone: currentUser.phone || '+91 94371 10801',
        base: currentUser.facility || 'Master Canteen Emergency Stand',
        lat: 20.2668,
        lng: 85.8398,
        district: currentUser.district || 'Khurda',
        emtName: 'Assigned EMT Specialist',
        emtPhone: '+91 94371 10822',
        shift: 'Apex Emergency Response',
        o2Level: 1850,
        fuelLevel: 85
      };
    }
    return FLEET_PILOTS[0];
  });

  const [showPilotSwitcher, setShowPilotSwitcher] = useState(false);

  // 2. MDT ACTIVE SUB-TAB
  // 'mission' | 'map' | 'vitals' | 'queue' | 'inspection' | 'hotlines' | 'history'
  const [activeMdtTab, setActiveMdtTab] = useState('mission');

  // 3. ALL DISPATCHES & ACTIVE MISSION
  const [allRequests, setAllRequests] = useState(() => getAmbulanceRequests());
  const [activeMissionId, setActiveMissionId] = useState(() => {
    const list = getAmbulanceRequests();
    // Prefer one matching pilot vehicle, or first non-arrived request
    const pilotVehicleReq = list.find(
      (r) => r.vehicleNo === activePilot.vehicleNo && r.status !== 'ARRIVED_HOSPITAL'
    );
    if (pilotVehicleReq) return pilotVehicleReq.id;
    const firstActive = list.find((r) => r.status !== 'ARRIVED_HOSPITAL');
    return firstActive ? firstActive.id : list[0]?.id || null;
  });

  // Reload requests
  const refreshRequests = () => {
    const list = getAmbulanceRequests();
    setAllRequests(list);
  };

  useEffect(() => {
    refreshRequests();
    const interval = setInterval(refreshRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  // Compute active mission object
  const activeMission = useMemo(() => {
    return allRequests.find((r) => r.id === activeMissionId) || null;
  }, [allRequests, activeMissionId]);

  // 4. PILOT DUTY STATE
  // 'AVAILABLE' | 'EN_ROUTE_PICKUP' | 'AT_SCENE' | 'PATIENT_ON_BOARD' | 'TRANSIT_TO_APEX' | 'ARRIVED_HOSPITAL' | 'OFF_DUTY'
  const [dutyStatus, setDutyStatus] = useState(() => {
    if (activeMission) return activeMission.status || 'EN_ROUTE_PICKUP';
    return 'AVAILABLE';
  });

  // Sync duty status whenever active mission changes
  useEffect(() => {
    if (activeMission && activeMission.status) {
      setDutyStatus(activeMission.status);
    }
  }, [activeMission?.id, activeMission?.status]);

  // 5. LIVE VEHICLE TELEMETRY
  const [vehicleSpeed, setVehicleSpeed] = useState(dutyStatus === 'AVAILABLE' || dutyStatus === 'OFF_DUTY' ? 0 : 54);
  const [sirenActive, setSirenActive] = useState(false);
  const [greenCorridorActive, setGreenCorridorActive] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState('');

  // Audio siren context reference
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const sirenIntervalRef = useRef(null);

  const toggleSirenAudio = () => {
    if (!sirenActive) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          audioCtxRef.current = ctx;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          sirenOscRef.current = osc;

          let high = false;
          sirenIntervalRef.current = setInterval(() => {
            if (sirenOscRef.current && audioCtxRef.current) {
              const freq = high ? 650 : 920;
              sirenOscRef.current.frequency.setValueAtTime(freq, audioCtxRef.current.currentTime);
              high = !high;
            }
          }, 450);
        }
      } catch (err) {
        console.warn('AudioContext not allowed or supported:', err);
      }
      setSirenActive(true);
      showNotice(
        appLang === 'or-IN'
          ? '🚨 ଜରୁରୀ ସାଇରେନ୍ ଓ ଫ୍ଲାସ୍ ଲାଇଟ୍ ସକ୍ରିୟ ହୋଇଛି!'
          : '🚨 Emergency Siren & Strobe Bar ACTIVATED!'
      );
    } else {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (sirenOscRef.current) {
        try {
          sirenOscRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
      setSirenActive(false);
      showNotice(
        appLang === 'or-IN'
          ? 'ସାଇରେନ୍ ବନ୍ଦ କରାଗଲା।'
          : 'Siren deactivated.'
      );
    }
  };

  useEffect(() => {
    return () => {
      if (sirenIntervalRef.current) clearInterval(sirenIntervalRef.current);
      if (sirenOscRef.current) {
        try {
          sirenOscRef.current.stop();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  // 6. IN-TRANSIT VITALS & TELEMETRY LOGGER
  const [vitals, setVitals] = useState({
    heartRate: 88,
    spo2: 95,
    systolic: 128,
    diastolic: 82,
    respiration: 18,
    gcs: 14,
    o2FlowLpm: 4,
    o2Device: 'Nasal Cannula', // 'Room Air' | 'Nasal Cannula' | 'High Flow Mask' | 'BVM'
    interventions: {
      cpr: false,
      ivLine: true,
      defibrillation: false,
      cervicalCollar: false,
      tourniquet: false,
      aspirinGiven: false
    },
    lastTransmitted: null
  });

  const [isTransmitting, setIsTransmitting] = useState(false);

  // Compute Mean Arterial Pressure (MAP)
  const mapValue = useMemo(() => {
    return Math.round((2 * vitals.diastolic + vitals.systolic) / 3);
  }, [vitals.systolic, vitals.diastolic]);

  // Transmit vitals to ER
  const handleTransmitVitals = () => {
    if (!activeMission) {
      alert(appLang === 'or-IN' ? 'ଦୟାକରି ପ୍ରଥମେ ଏକ ସକ୍ରିୟ ମିଶନ ଚୟନ କରନ୍ତୁ।' : 'Please assign or select an active mission first.');
      return;
    }
    setIsTransmitting(true);
    setTimeout(() => {
      const now = new Date();
      const updatedVitals = {
        ...vitals,
        lastTransmitted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };
      setVitals(updatedVitals);
      updateAmbulanceDetails(activeMission.id, {
        latestVitals: {
          ...updatedVitals,
          transmittedAt: now.toISOString()
        }
      });
      refreshRequests();
      setIsTransmitting(false);
      showNotice(
        appLang === 'or-IN'
          ? `✓ ଭାଇଟାଲ୍ସ SCB/AIIMS ଜରୁରୀକାଳୀନ ଟ୍ରମା ଡେସ୍କକୁ ସଫଳତାର ସହ ପ୍ରେରିତ ହେଲା (${now.toLocaleTimeString()})`
          : `✓ Vitals successfully transmitted to ER Trauma Desk (${now.toLocaleTimeString()})`
      );
    }, 700);
  };

  // 7. PRE-TRIP VEHICLE & OXYGEN CHECKLIST
  const [inspectionChecks, setInspectionChecks] = useState({
    o2MainCylinder: true,
    o2PortableKit: true,
    aedBatteryPads: true,
    suctionMachine: true,
    spineBoardStretcher: true,
    ambuBagMasks: true,
    maternityKit: activePilot.ambulanceTypeId === '102_JANANI',
    firstAidSupplies: true,
    emergencySirenStrobe: true,
    fuelAdequate: true
  });
  const [inspectionSigned, setInspectionSigned] = useState(false);

  // 8. MISSION STATUS PROGRESSION
  const handleAdvanceStatus = (newStatus) => {
    if (!activeMission) return;
    updateAmbulanceStatus(activeMission.id, newStatus);
    setDutyStatus(newStatus);
    if (newStatus === 'ARRIVED_HOSPITAL') {
      setVehicleSpeed(0);
    } else if (newStatus === 'AVAILABLE') {
      setVehicleSpeed(0);
    } else {
      setVehicleSpeed(58);
    }
    refreshRequests();
    showNotice(
      appLang === 'or-IN'
        ? `ମିଶନ ସ୍ଥିତି ଅପଡେଟ୍: ${newStatus.replace(/_/g, ' ')}`
        : `Mission status updated to ${newStatus.replace(/_/g, ' ')}`
    );
  };

  // 9. CLAIM MISSION FROM QUEUE
  const handleClaimMission = (reqId) => {
    updateAmbulanceDetails(reqId, {
      vehicleNo: activePilot.vehicleNo,
      driver: `${activePilot.name} (${activePilot.phone})`,
      ambulanceType: activePilot.ambulanceType,
      ambulanceTypeId: activePilot.ambulanceTypeId,
      status: 'EN_ROUTE_PICKUP'
    });
    setActiveMissionId(reqId);
    setDutyStatus('EN_ROUTE_PICKUP');
    setVehicleSpeed(56);
    refreshRequests();
    setActiveMdtTab('mission');
    showNotice(
      appLang === 'or-IN'
        ? `ମିଶନ #${reqId} ଏହି ଆମ୍ବୁଲାନ୍ସ (${activePilot.vehicleNo}) ସହିତ ସଂଲଗ୍ନ ହେଲା!`
        : `Mission #${reqId} claimed for ${activePilot.vehicleNo}!`
    );
  };

  // 10. REQUEST POLICE GREEN CORRIDOR
  const handleToggleGreenCorridor = () => {
    const next = !greenCorridorActive;
    setGreenCorridorActive(next);
    if (next) {
      showNotice(
        appLang === 'or-IN'
          ? '🟢 ୧୧୨ ଟ୍ରାଫିକ୍ କଣ୍ଟ୍ରୋଲ୍: ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଗ୍ରୀନ୍ କରିଡର୍ ସକ୍ରିୟ କରାଗଲା!'
          : '🟢 112 Traffic Command: Emergency Green Corridor Activated!'
      );
    } else {
      showNotice(
        appLang === 'or-IN'
          ? 'ଗ୍ରୀନ୍ କରିଡର୍ ନିଷ୍କ୍ରିୟ ହୋଇଛି।'
          : 'Green Corridor cleared.'
      );
    }
  };

  // 11. HELPER NOTICE TOAST
  const showNotice = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => {
      setNotificationMsg((cur) => (cur === msg ? '' : cur));
    }, 4000);
  };

  // 12. SWITCH PILOT
  const handleSelectPilot = (pilot) => {
    setActivePilot(pilot);
    setShowPilotSwitcher(false);
    // Find active mission for this vehicle
    const vehicleMission = allRequests.find(
      (r) => r.vehicleNo === pilot.vehicleNo && r.status !== 'ARRIVED_HOSPITAL'
    );
    if (vehicleMission) {
      setActiveMissionId(vehicleMission.id);
      setDutyStatus(vehicleMission.status || 'EN_ROUTE_PICKUP');
    }
    showNotice(
      appLang === 'or-IN'
        ? `ପାଇଲଟ୍ ବଦଳାଗଲା: ${pilot.shortName} (${pilot.vehicleNo})`
        : `Active Pilot: ${pilot.shortName} (${pilot.vehicleNo})`
    );
  };

  // Coords for Map
  const mapCenter = useMemo(() => {
    return { lat: activePilot.lat, lng: activePilot.lng };
  }, [activePilot.lat, activePilot.lng]);

  const mapHospitals = useMemo(() => {
    return ODISHA_MEDICAL_FACILITIES.slice(0, 8);
  }, []);

  const simulatedAmbulances = useMemo(() => {
    return FLEET_PILOTS.map((p) => ({
      id: p.vehicleNo,
      name: `${p.vehicleNo} (${p.ambulanceTypeId})`,
      vehicleNo: p.vehicleNo,
      type: p.ambulanceTypeId,
      lat: p.lat,
      lng: p.lng,
      status: p.vehicleNo === activePilot.vehicleNo ? dutyStatus : 'AVAILABLE'
    }));
  }, [activePilot.vehicleNo, dutyStatus]);

  // Turn by turn mock guidance
  const navigationSteps = useMemo(() => {
    return [
      { text: 'Head East towards Janpath / Master Canteen Square', dist: '800 m' },
      { text: 'Turn Right onto Rajmahal Flyover Corridor', dist: '1.4 km' },
      { text: 'Merge onto Forest Park Link Road', dist: '1.2 km' },
      { text: 'Enter Emergency Trauma Bay Gate 2', dist: '400 m' }
    ];
  }, []);

  // UI Translation Dictionary
  const t = useMemo(() => {
    return {
      'or-IN': {
        portalTitle: 'ଆମ୍ବୁଲାନ୍ସ ପାଇଲଟ୍ ଓ ଡିସପାଚ୍ କମାଣ୍ଡ କନସୋଲ୍',
        portalSub: 'ଓଡ଼ିଶା ୧୦୮/୧୦୨ ଜରୁରୀକାଳୀନ ମେଡିକାଲ୍ ସେବା (EMAS) • ମୋବାଇଲ୍ ଡାଟା ଟର୍ମିନାଲ୍ (MDT)',
        tabMission: '🚨 ସକ୍ରିୟ ମିଶନ',
        tabMap: '🗺️ GPS ନାଭିଗେସନ୍',
        tabVitals: '💓 ରୋଗୀ ଭାଇଟାଲ୍ସ',
        tabQueue: '📋 ଡିସପାଚ୍ କତାର',
        tabInspection: '🛠️ ଅକ୍ସିଜେନ୍ ଓ ଗାଡ଼ି ଯାଞ୍ଚ',
        tabHotlines: '☎️ ସ୍ପିଡ୍ ଡାଏଲ୍',
        tabHistory: '📜 ଶିଫ୍ଟ ଇତିହାସ',
        activeMissionHeading: 'ସକ୍ରିୟ ଜରୁରୀ ଡିସପାଚ୍ କଲ୍',
        noActiveMission: 'କୌଣସି ସକ୍ରିୟ ମିଶନ ନାହିଁ - ଷ୍ଟେସନରେ ପ୍ରସ୍ତୁତ ରୁହନ୍ତୁ',
        callCaller: 'କଲ୍ କରନ୍ତୁ',
        copyAbha: 'ABHA କପି',
        pickupPoint: 'ପିକଅପ୍ ସ୍ଥାନ:',
        destinationHospital: 'ଲକ୍ଷ୍ୟ ଡାକ୍ତରଖାନା:',
        patientDetails: 'ରୋଗୀଙ୍କ ବିବରଣୀ:',
        advanceStage: 'ପରବର୍ତ୍ତୀ ସ୍ଥିତିକୁ ଅଗ୍ରସର କରନ୍ତୁ',
        transmitVitalsBtn: '📡 ଡାକ୍ତରଖାନା ICU ଡେସ୍କକୁ ଭାଇଟାଲ୍ସ ପଠାନ୍ତୁ',
        greenCorridorBtn: 'ଗ୍ରୀନ୍ କରିଡର୍ ଟ୍ରାଫିକ୍',
        sirenBtn: 'ସାଇରେନ୍'
      },
      'hi-IN': {
        portalTitle: 'एम्बुलेंस पायलट एवं डिस्पैच कमांड कंसोल',
        portalSub: 'ओडिशा 108/102 आपातकालीन चिकित्सा सेवा • मोबाइल डेटा टर्मिनल (MDT)',
        tabMission: '🚨 सक्रिय मिशन',
        tabMap: '🗺️ GPS नेविगेशन',
        tabVitals: '💓 मरीज वाइटल्स',
        tabQueue: '📋 डिस्पैच कतार',
        tabInspection: '🛠️ ऑक्सीजन व वाहन जांच',
        tabHotlines: '☎️ स्पीड डायल',
        tabHistory: '📜 शिफ्ट इतिहास',
        activeMissionHeading: 'सक्रिय आपातकालीन डिस्पैच कॉल',
        noActiveMission: 'कोई सक्रिय मिशन नहीं - स्टेशन पर तैयार रहें',
        callCaller: 'कॉल करें',
        copyAbha: 'ABHA कॉपी',
        pickupPoint: 'पिकअप स्थान:',
        destinationHospital: 'गंतव्य अस्पताल:',
        patientDetails: 'मरीज का विवरण:',
        advanceStage: 'अगली स्थिति पर जाएं',
        transmitVitalsBtn: '📡 अस्पताल ICU डेस्क को वाइटल्स भेजें',
        greenCorridorBtn: 'ग्रीन कॉरिडोर ट्रैफिक',
        sirenBtn: 'सायरन'
      },
      'en-IN': {
        portalTitle: 'Ambulance Pilot & MDT Command Terminal',
        portalSub: 'Odisha 108 / 102 Emergency Medical Response Grid • Mobile Data Terminal (MDT)',
        tabMission: '🚨 Active Mission',
        tabMap: '🗺️ Live GPS Route',
        tabVitals: '💓 In-Transit Vitals',
        tabQueue: '📋 Dispatch Queue',
        tabInspection: '🛠️ O2 & Pre-Trip Check',
        tabHotlines: '☎️ Speed Dials',
        tabHistory: '📜 Shift History',
        activeMissionHeading: 'Active Emergency Dispatch Call',
        noActiveMission: 'No Active Mission • On Standby at Base Depot',
        callCaller: 'Call Attendant',
        copyAbha: 'Copy ABHA',
        pickupPoint: 'Pickup Point:',
        destinationHospital: 'Destination Hospital:',
        patientDetails: 'Patient Profile:',
        advanceStage: 'Advance Mission Stage',
        transmitVitalsBtn: '📡 Transmit Vitals to Receiving ER Trauma Desk',
        greenCorridorBtn: 'Police Green Corridor',
        sirenBtn: 'Emergency Siren'
      }
    }[appLang] || {};
  }, [appLang]);

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-fadeIn pb-12">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. TOP EMERGENCY STROBE BAR & FLASH ANIMATION                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-950 text-white shadow-2xl border border-slate-800">
        {/* Flashing Police & EMS Strobe Lights */}
        {sirenActive && (
          <div className="h-2 w-full flex">
            <div className="w-1/2 h-full bg-rose-600 animate-pulse"></div>
            <div className="w-1/2 h-full bg-blue-600 animate-pulse delay-75"></div>
          </div>
        )}

        {/* Cockpit Header Main */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            {/* Pilot & Vehicle Info */}
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="relative">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-rose-600 via-amber-500 to-indigo-600 p-0.5 shadow-lg">
                  <div className="w-full h-full bg-slate-900 rounded-2xl flex items-center justify-center text-amber-400">
                    <Truck className="w-7 h-7" />
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
                </span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {activePilot.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {activePilot.vehicleNo}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950">
                    {activePilot.ambulanceTypeId}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                  <span>📍 {activePilot.base}</span>
                  <span>•</span>
                  <span>ID: <strong className="text-slate-300 font-mono">{activePilot.staffId}</strong></span>
                  <span>•</span>
                  <span>EMT: <strong className="text-slate-200">{activePilot.emtName}</strong></span>
                </p>
              </div>
            </div>

            {/* Quick Cockpit Controls */}
            <div className="flex flex-wrap items-center gap-2 sm:self-end lg:self-auto">
              {/* Switch Pilot Button */}
              <button
                type="button"
                onClick={() => setShowPilotSwitcher(true)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Switch Pilot or Vehicle"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Switch Pilot</span>
              </button>

              {/* Siren Audio Toggle */}
              <button
                type="button"
                onClick={toggleSirenAudio}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  sirenActive
                    ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 animate-pulse'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {sirenActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                <span>{sirenActive ? 'SIREN ON' : 'SIREN'}</span>
              </button>

              {/* Green Corridor Escort Toggle */}
              <button
                type="button"
                onClick={handleToggleGreenCorridor}
                className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  greenCorridorActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                <ShieldCheck className={`w-4 h-4 ${greenCorridorActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span>{greenCorridorActive ? '112 CORRIDOR ON' : 'GREEN CORRIDOR'}</span>
              </button>
            </div>
          </div>

          {/* Real-Time Live Telemetry Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 pt-1 text-xs">
            {/* Speedometer */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Vehicle Speed</span>
                <span className="text-base font-black text-white font-mono leading-none">
                  {vehicleSpeed} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                </span>
              </div>
            </div>

            {/* Oxygen Cylinder PSI */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">O₂ Main Tank</span>
                <span className="text-base font-black text-emerald-300 font-mono leading-none">
                  {activePilot.o2Level} <span className="text-[10px] text-slate-400 font-normal">PSI</span>
                </span>
              </div>
            </div>

            {/* Fuel Level */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
                <Battery className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Fuel Gauge</span>
                <span className="text-base font-black text-amber-300 font-mono leading-none">
                  {activePilot.fuelLevel}% <span className="text-[10px] text-slate-400 font-normal">Diesel</span>
                </span>
              </div>
            </div>

            {/* Current GPS Heading */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
                <Navigation className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">GPS Coordinates</span>
                <span className="text-[11px] font-mono font-bold text-slate-200 block truncate">
                  {activePilot.lat.toFixed(4)}° N, {activePilot.lng.toFixed(4)}° E
                </span>
              </div>
            </div>

            {/* MDT Wireless Signal */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <Radio className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Telemetry Link</span>
                <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  4G LTE Live
                </span>
              </div>
            </div>

            {/* Active Duty Status Badge */}
            <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Duty Status</span>
                <span className="text-[11px] font-black text-rose-400 truncate block">
                  {dutyStatus.replace(/_/g, ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Mission Stage Action Bar (Touch-Optimized for In-Vehicle Driver Use) */}
          <div className="pt-2 border-t border-slate-800/60">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-2 flex items-center justify-between">
              <span>{t.advanceStage || 'Advance Mission Stage'}</span>
              <span className="text-amber-400 font-mono">Mission ID: {activeMission ? activeMission.id : 'None'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {DISPATCH_STAGES.map((stg) => {
                const isCurrent = dutyStatus === stg.key;
                return (
                  <button
                    key={stg.key}
                    type="button"
                    onClick={() => handleAdvanceStatus(stg.key)}
                    disabled={!activeMission}
                    className={`py-2 px-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex flex-col items-center justify-center text-center gap-0.5 border ${
                      isCurrent
                        ? `${stg.color} ring-2 ring-amber-400 shadow-md scale-[1.02]`
                        : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
                    } ${!activeMission ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    <span className="text-[10px] opacity-75 font-mono">
                      {stg.key === 'EN_ROUTE_PICKUP' ? 'STEP 1' : stg.key === 'AT_SCENE' ? 'STEP 2' : stg.key === 'PATIENT_ON_BOARD' ? 'STEP 3' : stg.key === 'TRANSIT_TO_APEX' ? 'STEP 4' : stg.key === 'ARRIVED_HOSPITAL' ? 'STEP 5' : 'STEP 0'}
                    </span>
                    <span className="leading-tight text-[11px]">
                      {appLang === 'or-IN' ? stg.labelOr : appLang === 'hi-IN' ? stg.labelHi : stg.labelEn}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast Alert */}
      {notificationMsg && (
        <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl shadow-lg flex items-center justify-between text-xs font-bold animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
          <button onClick={() => setNotificationMsg('')} className="p-1 hover:bg-white/20 rounded cursor-pointer">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MDT TAB NAVIGATION BAR                                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto text-xs">
        {[
          { id: 'mission', label: t.tabMission, icon: Activity, count: activeMission ? 1 : 0 },
          { id: 'map', label: t.tabMap, icon: MapPin },
          { id: 'vitals', label: t.tabVitals, icon: HeartPulse },
          { id: 'queue', label: t.tabQueue, icon: FileText, count: allRequests.length },
          { id: 'inspection', label: t.tabInspection, icon: Flame },
          { id: 'hotlines', label: t.tabHotlines, icon: Phone },
          { id: 'history', label: t.tabHistory, icon: Clock }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeMdtTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveMdtTab(tab.id)}
              className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md ring-2 ring-rose-400/40'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive ? 'bg-white text-rose-700 font-black' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 1: ACTIVE MISSION (LIVE EMERGENCY DISPATCH CONSOLE)       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'mission' && (
        <div className="space-y-4">
          {activeMission ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
              {/* Mission Header Banner */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-rose-500 text-white shadow-sm flex items-center gap-1.5 animate-pulse">
                      <Flame className="w-3.5 h-3.5" />
                      {activeMission.urgency || activeMission.emergencyType || 'CRITICAL 108 EMERGENCY'}
                    </span>
                    <span className="font-mono text-xs text-amber-300 font-bold">
                      Mission #{activeMission.id}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Dispatched: {new Date(activeMission.requestedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h2 className="text-base sm:text-xl font-black text-white mt-1.5">
                    {activeMission.emergencyType || 'Emergency Life Support Transit'}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white font-mono text-xs font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    ETA: {activeMission.eta || '8 mins'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveMdtTab('map')}
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Open Route
                  </button>
                </div>
              </div>

              {/* Mission Body Details */}
              <div className="p-4 sm:p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Patient Info Card */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {t.patientDetails || 'Patient Profile'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
                        Priority Casualty
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white">
                        {activeMission.patientName || activeMission.patient?.name || 'Emergency Patient'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {activeMission.patient?.age || '45'} Years • {activeMission.patient?.gender || 'Male'} • ABHA: <strong className="font-mono text-slate-700 dark:text-slate-300">{activeMission.patient?.abha || '91-4433-2211-0099'}</strong>
                      </p>
                    </div>

                    {/* Caller & Contact Row */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">Caller Contact:</span>
                        <a
                          href={`tel:${activeMission.contact || activeMission.phone || '108'}`}
                          className="font-bold text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {activeMission.contact || activeMission.phone || '+91 94370 00108'}
                        </a>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${activeMission.contact || activeMission.phone || '108'}`}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {t.callCaller || 'Call'}
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(activeMission.patient?.abha || '');
                            showNotice('ABHA ID copied to clipboard!');
                          }}
                          className="px-2 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                          title="Copy ABHA ID"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Route & Destination Card */}
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Transit Route Navigation
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        GPS Locked
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                            {t.pickupPoint || 'Pickup Origin:'}
                          </strong>
                          <span className="font-bold text-slate-900 dark:text-white">
                            {activeMission.pickup || activeMission.location || 'Local PHC / Village Center'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <Hospital className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-bold">
                            {t.destinationHospital || 'Destination Hospital:'}
                          </strong>
                          <span className="font-black text-emerald-700 dark:text-emerald-300">
                            {activeMission.destination || 'Capital Hospital / SCB Medical College'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Google Maps External Navigation Link */}
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                        Distance: ~4.8 km (Est. 7 mins)
                      </span>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeMission.destination || 'Capital Hospital Bhubaneswar')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Google Maps GPS
                      </a>
                    </div>
                  </div>
                </div>

                {/* In-Transit Live Vitals Preview Bar */}
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-4 h-4 text-rose-500" />
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        In-Transit Live Vitals Telemetry (Transmitting to ER)
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveMdtTab('vitals')}
                      className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Adjust & Transmit Full Vitals</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                      <span className="text-[10px] text-rose-700 dark:text-rose-300 font-bold block uppercase">Heart Rate</span>
                      <span className="text-lg font-black text-rose-900 dark:text-rose-100 font-mono">
                        {vitals.heartRate} <span className="text-[10px] font-normal">BPM</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                      <span className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold block uppercase">SpO₂ Oxygen</span>
                      <span className="text-lg font-black text-emerald-900 dark:text-emerald-100 font-mono">
                        {vitals.spo2}% <span className="text-[10px] font-normal">({vitals.o2FlowLpm} L/min)</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                      <span className="text-[10px] text-blue-700 dark:text-blue-300 font-bold block uppercase">Blood Pressure</span>
                      <span className="text-lg font-black text-blue-900 dark:text-blue-100 font-mono">
                        {vitals.systolic}/{vitals.diastolic} <span className="text-[10px] font-normal">mmHg</span>
                      </span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                      <span className="text-[10px] text-purple-700 dark:text-purple-300 font-bold block uppercase">GCS Score</span>
                      <span className="text-lg font-black text-purple-900 dark:text-purple-100 font-mono">
                        {vitals.gcs} <span className="text-[10px] font-normal">/ 15</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {vitals.lastTransmitted ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          ✓ Last transmitted to Receiving Hospital at {vitals.lastTransmitted}
                        </span>
                      ) : (
                        'ER awaiting vital parameters pre-arrival transmission'
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={handleTransmitVitals}
                      disabled={isTransmitting}
                      className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isTransmitting ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Transmitting Telemetry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>{t.transmitVitalsBtn || 'Transmit to ER Trauma Desk'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {t.noActiveMission || 'On Standby at Base Depot'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                  Ambulance {activePilot.vehicleNo} is currently Available and connected to the State 108 Emergency Grid.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMdtTab('queue')}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Browse Available Dispatches in Queue ({allRequests.length})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 2: LIVE GPS NAVIGATION & INTERACTIVE MAP                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'map' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-rose-600" />
                Live GPS Route Navigation & Ambulance Fleet Map
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive real-time map displaying current vehicle GPS coordinates, patient pickup point, and apex hospital destination
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs rounded-full">
                GPS Locked: {activePilot.vehicleNo}
              </span>
            </div>
          </div>

          {/* Interactive Leaflet Map Component */}
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
            <InteractiveLeafletMap
              userCoords={mapCenter}
              hospitals={mapHospitals}
              activeHospitalId={mapHospitals[0]?.id}
              ambulances={simulatedAmbulances}
              isNavigating={dutyStatus !== 'AVAILABLE'}
              lang={appLang}
            />
          </div>

          {/* Turn-by-Turn Navigation Guidance Steps */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-blue-500" />
                Turn-by-Turn Pilot Navigation Telemetry
              </h3>
              <span className="text-[11px] font-bold text-slate-500 font-mono">
                Total Route: 4.8 km • Green Corridor Clearance OK
              </span>
            </div>

            <div className="space-y-2">
              {navigationSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px] text-slate-700 dark:text-slate-300 flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{step.text}</span>
                  </div>
                  <span className="font-mono text-slate-500 dark:text-slate-400 font-bold">{step.dist}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 3: IN-TRANSIT VITALS & TELEMETRY LOGGER                    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'vitals' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-rose-600" />
                Pre-Hospital Patient Vitals & Clinical Telemetry Console
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log real-time vital signs en route and transmit high-frequency telemetry to the receiving ER trauma resuscitation bay
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-mono font-bold text-xs rounded-full">
                MAP: {mapValue} mmHg
              </span>
            </div>
          </div>

          {/* Vitals Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 1. Heart Rate (BPM) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-500 animate-pulse" />
                  Heart Rate (BPM)
                </span>
                <span className="text-lg font-black text-rose-600 font-mono">{vitals.heartRate} bpm</span>
              </div>
              <input
                type="range"
                min="40"
                max="180"
                value={vitals.heartRate}
                onChange={(e) => setVitals({ ...vitals, heartRate: parseInt(e.target.value, 10) })}
                className="w-full accent-rose-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>40 (Bradycardia)</span>
                <span>Normal (60-100)</span>
                <span>180 (Tachycardia)</span>
              </div>
            </div>

            {/* 2. SpO2 Oxygen Saturation */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-emerald-500" />
                  SpO₂ Blood Oxygen (%)
                </span>
                <span className={`text-lg font-black font-mono ${vitals.spo2 < 92 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`}>
                  {vitals.spo2}%
                </span>
              </div>
              <input
                type="range"
                min="75"
                max="100"
                value={vitals.spo2}
                onChange={(e) => setVitals({ ...vitals, spo2: parseInt(e.target.value, 10) })}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>75% (Critical)</span>
                <span>92% (Hypoxia Limit)</span>
                <span>100%</span>
              </div>
            </div>

            {/* 3. Blood Pressure (BP) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Blood Pressure (mmHg)
                </span>
                <span className="text-lg font-black text-blue-600 font-mono">
                  {vitals.systolic}/{vitals.diastolic}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-500 block">Systolic</label>
                  <input
                    type="number"
                    value={vitals.systolic}
                    onChange={(e) => setVitals({ ...vitals, systolic: parseInt(e.target.value, 10) || 120 })}
                    className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block">Diastolic</label>
                  <input
                    type="number"
                    value={vitals.diastolic}
                    onChange={(e) => setVitals({ ...vitals, diastolic: parseInt(e.target.value, 10) || 80 })}
                    className="w-full p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            {/* 4. Respiration Rate */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Respiration Rate</span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{vitals.respiration} /min</span>
              </div>
              <input
                type="range"
                min="8"
                max="40"
                value={vitals.respiration}
                onChange={(e) => setVitals({ ...vitals, respiration: parseInt(e.target.value, 10) })}
                className="w-full accent-slate-800 dark:accent-slate-200 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>8 (Bradypnea)</span>
                <span>Normal (12-20)</span>
                <span>40 (Tachypnea)</span>
              </div>
            </div>

            {/* 5. Glasgow Coma Scale (GCS) */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">GCS Consciousness</span>
                <span className="text-lg font-black text-purple-600 font-mono">{vitals.gcs} / 15</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={vitals.gcs}
                onChange={(e) => setVitals({ ...vitals, gcs: parseInt(e.target.value, 10) })}
                className="w-full accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3 (Deep Coma)</span>
                <span>8 (Intubate)</span>
                <span>15 (Fully Alert)</span>
              </div>
            </div>

            {/* 6. Oxygen Administration Device & LPM */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Oxygen Delivery</span>
                <span className="text-xs font-black text-teal-600">{vitals.o2FlowLpm} L/min</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={vitals.o2Device}
                  onChange={(e) => setVitals({ ...vitals, o2Device: e.target.value })}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                >
                  <option value="Room Air">Room Air</option>
                  <option value="Nasal Cannula">Nasal Cannula (2-6 L)</option>
                  <option value="High Flow Mask">Non-Rebreather (10-15 L)</option>
                  <option value="BVM">Bag Valve Mask (15 L)</option>
                </select>
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={vitals.o2FlowLpm}
                  onChange={(e) => setVitals({ ...vitals, o2FlowLpm: parseInt(e.target.value, 10) || 0 })}
                  className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold"
                />
              </div>
            </div>
          </div>

          {/* En Route Clinical Interventions Checkboxes */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              En Route Emergency Life-Support Interventions Administered:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
              {[
                { key: 'ivLine', label: 'IV Cannula 18G' },
                { key: 'cpr', label: 'Active CPR' },
                { key: 'defibrillation', label: 'AED Shock Given' },
                { key: 'cervicalCollar', label: 'C-Spine Collar' },
                { key: 'tourniquet', label: 'Tourniquet' },
                { key: 'aspirinGiven', label: 'Aspirin 300mg' }
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer font-medium text-slate-800 dark:text-slate-200 text-xs"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(vitals.interventions[item.key])}
                    onChange={(e) =>
                      setVitals({
                        ...vitals,
                        interventions: {
                          ...vitals.interventions,
                          [item.key]: e.target.checked
                        }
                      })
                    }
                    className="accent-rose-600 rounded"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmit Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <div className="text-xs text-slate-500">
              Receiving ER: <strong className="text-slate-800 dark:text-slate-200">{activeMission ? activeMission.destination : 'Capital Hospital Trauma Resuscitation Bay'}</strong>
            </div>
            <button
              type="button"
              onClick={handleTransmitVitals}
              disabled={isTransmitting}
              className="px-6 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-sm font-black shadow-lg shadow-rose-950/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isTransmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transmitting Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.transmitVitalsBtn || 'Transmit Vitals to Receiving ER Trauma Desk'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 4: DISPATCH QUEUE & MISSION MANAGER                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'queue' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-600" />
                Statewide 108 / 102 Emergency Dispatch Queue
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Browse all live emergency calls across Odisha and claim dispatches directly to this ambulance unit ({activePilot.vehicleNo})
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 font-extrabold text-xs rounded-full">
              {allRequests.length} Total Registered Calls
            </span>
          </div>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allRequests.map((req) => {
              const isCurrentMission = activeMissionId === req.id;
              return (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all space-y-3 ${
                    isCurrentMission
                      ? 'border-rose-400 dark:border-rose-700 bg-rose-50/50 dark:bg-rose-950/30 ring-2 ring-rose-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                          {req.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                          {req.ambulanceTypeId || 'ALS'}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          req.status === 'ARRIVED_HOSPITAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {req.status?.replace(/_/g, ' ') || 'PENDING'}
                        </span>
                      </div>

                      <h4 className="font-black text-slate-900 dark:text-white text-sm mt-1.5">
                        {req.patientName || req.patient?.name || 'Emergency Caller'}
                      </h4>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-bold mt-0.5">
                        {req.urgency || req.emergencyType || 'HIGH PRIORITY 108'}
                      </p>
                    </div>

                    {isCurrentMission ? (
                      <span className="px-2.5 py-1 bg-rose-600 text-white font-black text-[11px] rounded-lg">
                        Active Mission
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleClaimMission(req.id)}
                        className="px-3 py-1 bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                      >
                        Claim Dispatch
                      </button>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{req.pickup || req.location}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Destination:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1">{req.destination}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 5: VEHICLE & OXYGEN PRE-TRIP INSPECTION CHECKLIST          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'inspection' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" />
                Ambulance Vehicle & Life-Support Equipment Pre-Trip Inspection
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mandatory pre-trip equipment sign-off aligned with Odisha National Health Mission and 108 EMS SOP
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 font-bold text-xs rounded-full ${
                inspectionSigned
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {inspectionSigned ? '✓ Shift Sign-Off Complete' : 'Pending Shift Sign-Off'}
              </span>
            </div>
          </div>

          {/* O2 Gauges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Primary D-Type Oxygen Cylinder (460 L)
                </span>
                <span className="text-base font-black text-emerald-600 font-mono">
                  {activePilot.o2Level} PSI
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (activePilot.o2Level / 2000) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                Sufficient for approximately 4.5 hours of continuous 6 LPM high-flow delivery
              </span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Portable Responder Oxygen Kit (C-Type)
                </span>
                <span className="text-base font-black text-emerald-600 font-mono">
                  1800 PSI
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                <div className="bg-emerald-500 h-3 rounded-full w-[90%]"></div>
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">
                Full charge verified for scene-to-ambulance stretcher carry
              </span>
            </div>
          </div>

          {/* Checklist items */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Pre-Trip Life-Support Equipment Status Checklist
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { key: 'o2MainCylinder', label: 'Primary O2 Tank Pressure & Regulator Sealed' },
                { key: 'o2PortableKit', label: 'Portable Carry O2 Kit & Key Spanner Present' },
                { key: 'aedBatteryPads', label: 'AED Defibrillator Battery >90% & Adult/Pediatric Pads' },
                { key: 'suctionMachine', label: 'Electric Suction Aspirator & Yankauer Catheters' },
                { key: 'spineBoardStretcher', label: 'Spine Board, Cervical Collars & Hydraulic Stretcher Lock' },
                { key: 'ambuBagMasks', label: 'Bag Valve Mask (Adult + Child) & Non-Rebreather Masks' },
                { key: 'firstAidSupplies', label: 'Tourniquets, Hemostatic Gauze & Burn Dressings' },
                { key: 'emergencySirenStrobe', label: 'Dual-Tone Siren, Strobe Bar & Public Address (PA)' },
                { key: 'fuelAdequate', label: 'Fuel Tank > 60% Capacity (Diesel)' }
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(inspectionChecks[item.key])}
                    onChange={(e) =>
                      setInspectionChecks({
                        ...inspectionChecks,
                        [item.key]: e.target.checked
                      })
                    }
                    className="w-4 h-4 accent-emerald-600 rounded"
                  />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sign Off Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              Pilot: <strong>{activePilot.name}</strong> • Vehicle: <strong>{activePilot.vehicleNo}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setInspectionSigned(true);
                showNotice('✓ Daily Pre-Trip Inspection successfully signed and logged in telemetry server!');
              }}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Submit Daily Shift Sign-Off</span>
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 6: EMERGENCY SPEED DIALS & DIRECT LINES                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'hotlines' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-rose-600" />
                Emergency Speed Dials & Direct Command Hotlines
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                1-Touch direct dial connectivity for control rooms, trauma receiving centers, and highway police escorts
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMERGENCY_HOTLINES.map((hl) => (
              <div
                key={hl.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 transition-all flex flex-col justify-between gap-3 shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                      {hl.badge}
                    </span>
                    <span className="font-mono text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {hl.phone}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-sm mt-1.5">
                    {appLang === 'or-IN' ? hl.nameOr : hl.nameEn}
                  </h3>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/80">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Direct Line
                  </span>
                  <a
                    href={`tel:${hl.phone}`}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-lg text-xs font-black shadow flex items-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Dial Hotline ({hl.phone})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* TAB 7: SHIFT COMPLETED MISSIONS HISTORY                       */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeMdtTab === 'history' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-600" />
                Completed Dispatches & Shift Log History
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Log of emergency runs completed by {activePilot.name} on vehicle {activePilot.vehicleNo}
              </p>
            </div>
            <button
              type="button"
              onClick={() => showNotice('Shift log report exported to telemetry archive!')}
              className="px-3.5 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Shift Log</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              {
                id: 'RUN-OD-901',
                time: '08:15 AM',
                patient: 'Laxman Majhi (52y, Male)',
                urgency: 'Acute Inferior Wall MI',
                origin: 'Khurda Road Junction',
                destination: 'AIIMS Hospital, Bhubaneswar',
                responseTime: '6.4 mins',
                outcome: 'Transferred to Cath Lab (Stable)'
              },
              {
                id: 'RUN-OD-902',
                time: '10:40 AM',
                patient: 'Minati Jena (29y, Female)',
                urgency: 'Active Second Stage Labor',
                origin: 'Jatni PHC Stand',
                destination: 'Capital Hospital MCH Wing',
                responseTime: '8.1 mins',
                outcome: 'Safe Delivery in Hospital OT'
              },
              {
                id: 'RUN-OD-903',
                time: '01:20 PM',
                patient: 'Rakesh Sahoo (24y, Male)',
                urgency: 'Polytrauma / Road Crash',
                origin: 'NH-16 Khandagiri Square',
                destination: 'SCB Medical College Trauma ICU',
                responseTime: '5.2 mins',
                outcome: 'Handover Completed (Surgical OT)'
              }
            ].map((run) => (
              <div
                key={run.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{run.id}</span>
                    <span className="text-[10px] text-slate-500 font-mono">• {run.time}</span>
                    <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                      {run.urgency}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white mt-1">
                    {run.patient}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Route: {run.origin} ➔ <strong className="text-slate-700 dark:text-slate-300">{run.destination}</strong>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                    ✓ {run.outcome}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Response Time: {run.responseTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. SWITCH PILOT / VEHICLE MODAL                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showPilotSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-slate-900 dark:text-white text-base">
                  Switch Active Pilot & Vehicle Terminal
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPilotSwitcher(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select any regional Odisha Emergency Ambulance Pilot to simulate their live mobile cockpit terminal:
            </p>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {FLEET_PILOTS.map((pilot) => {
                const isSelected = activePilot.vehicleNo === pilot.vehicleNo;
                return (
                  <button
                    key={pilot.vehicleNo}
                    type="button"
                    onClick={() => handleSelectPilot(pilot)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white text-xs">{pilot.name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {pilot.vehicleNo}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{pilot.role}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">📍 {pilot.base}</p>
                    </div>

                    {isSelected && (
                      <span className="px-2 py-1 bg-amber-400 text-slate-950 font-black text-[10px] rounded-lg shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPilotSwitcher(false)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
