import React, { useState, useEffect, Suspense, lazy } from 'react';
import MultimodalIntakeForm from './components/MultimodalIntakeForm';
import {
  getCurrentUser,
  setCurrentUser,
  logoutUser,
  getBookedAppointments,
  getHospitalTransfers,
  getStoredUsers
} from './utils/authStorage';
import { DoctorAvatar } from './utils/doctorPhotos';
import MobileAppView from './components/MobileAppView';

// Code-split heavy & secondary components to load on demand for instant site loading
const GovtGovTechSuite = lazy(() => import('./components/GovtGovTechSuite'));
const HospitalTieUpSystem = lazy(() => import('./components/HospitalTieUpSystem'));
const TriageDoctorDashboard = lazy(() => import('./components/TriageDoctorDashboard'));
const OcrUploader = lazy(() => import('./components/OcrUploader'));
const AuthPage = lazy(() => import('./components/AuthPage'));
const DoctorBookingSystem = lazy(() => import('./components/DoctorBookingSystem'));
const BloodBankSystem = lazy(() => import('./components/BloodBankSystem'));
const MedicineExpiryChecker = lazy(() => import('./components/MedicineExpiryChecker'));
const NearestMedicalGPS = lazy(() => import('./components/NearestMedicalGPS'));
const BedBookingSystem = lazy(() => import('./components/BedBookingSystem'));
const AmbulanceBooking = lazy(() => import('./components/AmbulanceBooking'));
const AdminPage = lazy(() => import('./components/AdminPage'));
const DrugAllergySafetyGuard = lazy(() => import('./components/DrugAllergySafetyGuard'));
import FirebaseConfigModal from './components/FirebaseConfigModal';
import { isFirebaseConfigured } from './config/firebase';
import { saveFirestoreDoc, FIRESTORE_COLLECTIONS } from './services/firebaseDb';
import { syncAllAuthFromFirestore } from './utils/authStorage';
import { syncBloodBankFromFirestore } from './utils/bloodBankStorage';
const NmcReferralPrescriptionSuite = lazy(() => import('./components/NmcReferralPrescriptionSuite'));
const PhcOfflineSyncSuite = lazy(() => import('./components/PhcOfflineSyncSuite'));
const TelemedicineVideoSuite = lazy(() => import('./components/TelemedicineVideoSuite'));

import {
  Activity,
  Brain,
  FileText,
  UploadCloud,
  Stethoscope,
  ShieldCheck,
  AlertTriangle,
  Building,
  ArrowRight,
  LogIn,
  LogOut,
  ChevronDown,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  Calendar,
  Droplet,
  Pill,
  Navigation,
  Bed,
  Truck,
  Sun,
  Moon,
  BookOpen,
  Flame,
  Database,
  Wifi,
  WifiOff,
  User,
  HeartHandshake,
  Layers,
  Sparkles,
  Zap,
  CheckCircle2,
  Users,
  Shield,
  KeyRound,
  ExternalLink,
  TrendingUp,
  Smartphone,
  Monitor,
  Video
} from 'lucide-react';

export default function App() {
  const [currentUser, setLoggedInUser] = useState(() => getCurrentUser());
  const [teleconsultSession, setTeleconsultSession] = useState(null);
  const [appLang, setAppLang] = useState(() => currentUser?.preferredLanguage || 'or-IN');
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  // Role Category computation
  const userRole = currentUser?.roleCategory || 'patient';
  const isAdmin = userRole === 'admin';
  const isDoctor = userRole === 'doctor' || userRole === 'nurse';
  const isAsha = userRole === 'asha' || userRole === 'anm';
  const isPatient = userRole === 'patient';

  // 4 Core Role-Based Hubs: 'citizen' | 'doctor' | 'phc' | 'admin'
  const [activeHub, setActiveHub] = useState(() => {
    const user = getCurrentUser();
    if (user?.roleCategory === 'admin') return 'admin';
    if (user?.roleCategory === 'doctor' || user?.roleCategory === 'nurse') return 'doctor';
    if (user?.roleCategory === 'asha' || user?.roleCategory === 'anm') return 'phc';
    return 'citizen';
  });

  // Active sub-tab inside current hub
  const [activeTab, setActiveTab] = useState(() => {
    const user = getCurrentUser();
    if (user?.roleCategory === 'admin') return 'admin';
    if (user?.roleCategory === 'doctor' || user?.roleCategory === 'nurse') return 'dashboard';
    if (user?.roleCategory === 'asha' || user?.roleCategory === 'anm') return 'phc_offline';
    return 'intake';
  });

  const [currentIntake, setCurrentIntake] = useState(() => {
    try {
      const saved = localStorage.getItem('nhp_current_intake');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [currentOcr, setCurrentOcr] = useState(null);
  const [generatedTriageNote, setGeneratedTriageNote] = useState(null);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [bookedCount, setBookedCount] = useState(() => getBookedAppointments().length);
  const [transfersCount, setTransfersCount] = useState(() => getHospitalTransfers().length);

  // Automatic responsive screen detection (Mobile < 1024px, Desktop >= 1024px, or Mobile Device UserAgent)
  const checkIsMobileScreen = () => {
    if (typeof window === 'undefined') return false;
    const isTouchOrMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    return isTouchOrMobileUA || window.innerWidth < 1024 || window.matchMedia('(max-width: 1023px)').matches;
  };

  const [isMobile, setIsMobile] = useState(checkIsMobileScreen);
  const [viewModeOverride, setViewModeOverride] = useState(null); // 'mobile' | 'desktop' | null
  const effectiveIsMobile = viewModeOverride === 'mobile' ? true : viewModeOverride === 'desktop' ? false : isMobile;

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 1023px)');
    const updateMobileState = () => {
      setIsMobile(checkIsMobileScreen());
    };

    if (mql.addEventListener) {
      mql.addEventListener('change', updateMobileState);
    } else if (mql.addListener) {
      mql.addListener(updateMobileState);
    }
    window.addEventListener('resize', updateMobileState);
    window.addEventListener('orientationchange', updateMobileState);
    
    // Check immediately on mount
    updateMobileState();

    return () => {
      if (mql.removeEventListener) {
        mql.removeEventListener('change', updateMobileState);
      } else if (mql.removeListener) {
        mql.removeListener(updateMobileState);
      }
      window.removeEventListener('resize', updateMobileState);
      window.removeEventListener('orientationchange', updateMobileState);
    };
  }, []);

  // Monitor network online/offline state
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

  // Theme Mode: 'light', 'dark', or 'reading'
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('nhp_theme_mode') || 'light';
  });

  // Firebase Cloud Firestore integration state (ADMIN ONLY)
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [isFirebaseReady, setIsFirebaseReady] = useState(() => isFirebaseConfigured());

  useEffect(() => {
    if (isFirebaseConfigured()) {
      setIsFirebaseReady(true);
      syncAllAuthFromFirestore();
      syncBloodBankFromFirestore();
    }
  }, []);

  const handleFirebaseConfigSaved = (cfg) => {
    const ready = Boolean(cfg && cfg.apiKey && cfg.projectId);
    setIsFirebaseReady(ready);
    if (ready) {
      syncAllAuthFromFirestore();
      syncBloodBankFromFirestore();
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-dark', 'theme-reading', 'dark');
    if (themeMode === 'dark') {
      root.classList.add('theme-dark', 'dark');
    } else if (themeMode === 'reading') {
      root.classList.add('theme-reading');
    }
    localStorage.setItem('nhp_theme_mode', themeMode);
  }, [themeMode]);

  // Authentication callbacks
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    if (user.preferredLanguage) {
      setAppLang(user.preferredLanguage);
    }
    setShowAuthPage(false);
    setShowProfileMenu(false);
    if (user.roleCategory === 'admin') {
      setActiveHub('admin');
      setActiveTab('admin');
    } else if (user.roleCategory === 'doctor' || user.roleCategory === 'nurse') {
      setActiveHub('doctor');
      setActiveTab('dashboard');
    } else if (user.roleCategory === 'asha' || user.roleCategory === 'anm') {
      setActiveHub('phc');
      setActiveTab('phc_offline');
    } else {
      setActiveHub('citizen');
      setActiveTab('intake');
    }
  };

  // Quick 1-Click Persona Switcher for Live Demo & Review
  const handleQuickPersonaSwitch = (targetRoleCategory) => {
    const allUsers = getStoredUsers();
    let targetUser = null;
    if (targetRoleCategory === 'admin') {
      targetUser = allUsers.find((u) => u.id === 'USR-ADM-001') || allUsers.find((u) => u.roleCategory === 'admin');
    } else if (targetRoleCategory === 'doctor') {
      targetUser = allUsers.find((u) => u.id === 'USR-DOC-505') || allUsers.find((u) => u.roleCategory === 'doctor');
    } else if (targetRoleCategory === 'asha') {
      targetUser = allUsers.find((u) => u.id === 'USR-ASH-303') || allUsers.find((u) => u.roleCategory === 'asha');
    } else {
      targetUser = allUsers.find((u) => u.id === 'USR-PAT-606') || allUsers.find((u) => u.roleCategory === 'patient');
    }
    if (!targetUser) {
      targetUser = allUsers[0];
    }
    setCurrentUser(targetUser);
    handleLoginSuccess(targetUser);
  };

  const handleLogout = () => {
    logoutUser();
    setLoggedInUser(null);
    setShowProfileMenu(false);
    setShowAuthPage(true);
  };

  const handleLanguageChange = (newLang) => {
    setAppLang(newLang);
    if (currentUser) {
      const updated = { ...currentUser, preferredLanguage: newLang };
      setCurrentUser(updated);
      setLoggedInUser(updated);
    }
  };

  const handleOpenTeleconsult = (sessionContext = null) => {
    if (sessionContext) {
      setTeleconsultSession(sessionContext);
    }
    setActiveTab('teleconsult');
  };

  // Switch Hub Controller
  const switchHub = (hubId) => {
    setActiveHub(hubId);
    if (hubId === 'citizen') {
      if (!['intake', 'ocr', 'booking', 'nearest', 'ambulance', 'expiry', 'beds', 'bloodbank', 'teleconsult'].includes(activeTab)) {
        setActiveTab('intake');
      }
    } else if (hubId === 'doctor') {
      if (!['dashboard', 'nmc_referral', 'drugallergy', 'differential', 'xray', 'riskscores', 'hospitals', 'abha_history', 'teleconsult'].includes(activeTab)) {
        setActiveTab('dashboard');
      }
    } else if (hubId === 'phc') {
      if (!['phc_offline', 'asha_voice', 'family_triage', 'maternal_anc', 'pain_map'].includes(activeTab)) {
        setActiveTab('phc_offline');
      }
    } else if (hubId === 'admin') {
      if (!['admin', 'beds', 'bloodbank', 'outbreak', 'inventory', 'compliance', 'abha_history'].includes(activeTab)) {
        setActiveTab('admin');
      }
    }
  };

  // Cross-hub navigation router for child components
  const handleNavigateTab = (tab) => {
    setActiveTab(tab);
    if (['intake', 'ocr', 'booking', 'nearest', 'ambulance', 'expiry'].includes(tab)) {
      setActiveHub('citizen');
    } else if (['dashboard', 'nmc_referral', 't29_nmc_referral', 't29_discharge', 'drugallergy', 't13_drugallergy', 'differential', 't12_differential', 'xray', 'riskscores', 't14_riskscores', 'hospitals'].includes(tab)) {
      setActiveHub('doctor');
    } else if (['phc_offline', 'asha_voice', 't17_asha_voice', 'family_triage', 't19_family_triage', 'maternal_anc', 't30_anc_maternal', 'pain_map', 't18_pain_map'].includes(tab)) {
      setActiveHub('phc');
    } else if (['admin', 'beds', 'bloodbank', 'outbreak', 't23_outbreak', 'inventory', 't24_inventory', 'compliance', 'abha_history'].includes(tab)) {
      setActiveHub('admin');
    } else if (tab === 'teleconsult') {
      if (!['citizen', 'doctor'].includes(activeHub)) {
        setActiveHub(currentUser?.roleCategory === 'doctor' ? 'doctor' : 'citizen');
      }
    }
  };

  // Handle Intake submission
  const handleIntakeComplete = (data) => {
    const intakeRecord = {
      ...data,
      patientName: currentUser?.name || 'Rajendra Naik',
      age: currentUser?.age || 42,
      gender: currentUser?.gender || 'Male',
      village: currentUser?.village || 'Borigumma, Koraput',
      abhaId: currentUser?.abhaId || '91-4829-1049-2819',
      chiefComplaint: data.translatedSummary || data.rawSpeech || 'Reported symptoms',
      originalSpeech: data.rawSpeech,
      intakeBy: currentUser?.name || 'Healthcare Worker',
      intakeFacility: currentUser?.facility || 'Primary Health Center'
    };
    setCurrentIntake(intakeRecord);
    try {
      localStorage.setItem('nhp_current_intake', JSON.stringify(intakeRecord));
    } catch (e) {
      console.warn('Could not store intake in localStorage:', e);
    }
    setActiveTab('ocr');
  };

  // Handle OCR extraction
  const handleOcrComplete = (data) => {
    setCurrentOcr(data);
  };

  // Generate structured triage note combining intake + OCR
  const handleGenerateTriage = () => {
    setIsGeneratingNote(true);
    setTimeout(() => {
      let urgency = 'GREEN';
      let score = 25;
      const flags = [];

      const vitals = currentIntake?.vitals || {};
      const temp = parseFloat(vitals.temperature || '98.6');
      const pulse = parseInt(vitals.pulse || '72', 10);
      const spo2 = parseInt(vitals.spo2 || '98', 10);
      const sbp = parseInt(vitals.systolic || '120', 10);

      if (spo2 < 92) {
        urgency = 'RED';
        score = 95;
        flags.push(
          appLang === 'or-IN'
            ? `ଅମ୍ଳଜାନ ସ୍ତର ଚିନ୍ତାଜନକ: SpO2 ${spo2}% (<୯୨% ଜରୁରୀ ସୀମା)`
            : (appLang === 'hi-IN'
            ? `हाइपोक्सिया अलर्ट: कमरे की हवा पर SpO2 ${spo2}% (<92% क्रिटिकल)`
            : `Hypoxia Alert: SpO2 ${spo2}% on room air (<92% critical threshold)`)
        );
      } else if (spo2 <= 94) {
        urgency = 'YELLOW';
        score = 60;
        flags.push(
          appLang === 'or-IN'
            ? `ସାମାନ୍ୟ ଅମ୍ଳଜାନ ହ୍ରାସ: SpO2 ${spo2}%`
            : (appLang === 'hi-IN'
            ? `हल्की ऑक्सीजन कमी: SpO2 ${spo2}%`
            : `Mild Desaturation: SpO2 ${spo2}%`)
        );
      }

      if (sbp >= 170) {
        urgency = 'RED';
        score = 90;
        flags.push(
          appLang === 'or-IN'
            ? `ଅତ୍ୟଧିକ ରକ୍ତଚାପ ସଙ୍କଟ: ସିଷ୍ଟୋଲିକ୍ BP ${sbp} mmHg`
            : (appLang === 'hi-IN'
            ? `अत्यधिक उच्च रक्तचाप संकट: सिस्टोलिक BP ${sbp} mmHg`
            : `Hypertensive Crisis Range: Systolic BP ${sbp} mmHg`)
        );
      }

      if (temp >= 102.5 && pulse > 105) {
        flags.push(
          appLang === 'or-IN'
            ? `ପ୍ରବଳ ଜ୍ୱର (${temp}°F) ସହିତ ଦ୍ରୁତ ନାଡ଼ି ସ୍ପନ୍ଦନ (${pulse} bpm)`
            : (appLang === 'hi-IN'
            ? `तेज बुखार (${temp}°F) के साथ तेज नाड़ी दर (${pulse} bpm)`
            : `High Grade Fever (${temp}°F) with systemic Tachycardia (${pulse} bpm)`)
        );
        if (urgency !== 'RED') urgency = 'YELLOW';
      }

      // Check OCR lab metrics
      if (currentOcr?.metrics) {
        currentOcr.metrics.forEach((m) => {
          if (m.status.includes('CRITICAL')) {
            urgency = 'RED';
            score = 92;
            flags.push(
              appLang === 'or-IN'
                ? `ଲ୍ୟାବ୍ ବିପଦ ସଙ୍କେତ: ${m.name} ହେଉଛି ${m.value} (${m.alert})`
                : (appLang === 'hi-IN'
                ? `लैब क्रिटिकल: ${m.name} मान ${m.value} (${m.alert})`
                : `Lab Critical: ${m.name} is ${m.value} (${m.alert})`)
            );
          }
        });
      }

      // Check targeted clinical inquiries from adaptive intake
      const answers = currentIntake?.targetedAnswers || {};
      if (answers.bleeding === 'gum_bleed') {
        urgency = 'RED';
        score = Math.max(score, 94);
        flags.push(
          appLang === 'or-IN'
            ? 'ଜରୁରୀ ରକ୍ତସ୍ରାବ ସତର୍କତା: ଚର୍ମରେ ନାଲି ଦାଗ କିମ୍ବା ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ (ହେମୋରେଜିକ୍ ବିପଦ)'
            : (appLang === 'hi-IN'
            ? 'गंभीर रक्तस्राव चेतावनी: मसूड़ों से खून अथवा त्वचा पर चकत्ते (हेमरेजिक लक्षण)'
            : 'Hemorrhagic Alert: Active gum bleeding / petechial spots reported')
        );
      }
      if (answers.rigors === 'yes') {
        if (urgency !== 'RED') urgency = 'YELLOW';
        score = Math.max(score, 65);
        flags.push(
          appLang === 'or-IN'
            ? 'କମ୍ପ ଜ୍ୱର ସୂଚନା: ଥଣ୍ଡା ଲାଗି କମ୍ପ ସହିତ ଜ୍ୱର (ପାରାସାଇଟ୍/ବ୍ୟାକ୍ଟେରିଆଲ୍ ସଂକ୍ରମଣ ଆଶଙ୍କା)'
            : (appLang === 'hi-IN'
            ? 'कंपकंपी के साथ बुखार: तेज ठंड लगकर बुखार (मलेरिया/गंभीर संक्रमण संभावना)'
            : 'Febrile Rigors: High fever with shaking chills reported')
        );
      }
      if (answers.hydration === 'poor') {
        if (urgency !== 'RED') urgency = 'YELLOW';
        score = Math.max(score, 60);
        flags.push(
          appLang === 'or-IN'
            ? 'ଶରୀରରେ ଜଳୀୟ ଅଂଶ ହ୍ରାସ: କମ୍ ପାଣି ପିଇବା ଓ କମ ପରିସ୍ରା'
            : (appLang === 'hi-IN'
            ? 'निर्जलीकरण चेतावनी: तरल पदार्थ का कम सेवन एवं गहरा पेशाब'
            : 'Dehydration Risk: Inadequate fluid intake with reduced urine output')
        );
      }
      if (answers.breath_speech === 'broken_words') {
        urgency = 'RED';
        score = Math.max(score, 95);
        flags.push(
          appLang === 'or-IN'
            ? 'ତୀବ୍ର ନିଶ୍ୱାସ କଷ୍ଟ: ରୋଗୀ ଗୋଟିଏ ଶବ୍ଦ କହିଲା ବେଳେ ଅଣନିଶ୍ୱାସୀ ହେଉଛନ୍ତି'
            : (appLang === 'hi-IN'
            ? 'तीव्र श्वसन संकट: बोलने पर सांस फूल रही है (रेस्पिरेटरी डिस्ट्रेस)'
            : 'Severe Respiratory Distress: Inability to speak in full sentences')
        );
      }

      const note = {
        id: Math.floor(1000 + Math.random() * 9000),
        ticketId: `OD-${Math.floor(100000 + Math.random() * 900000)}`,
        patientName: currentIntake?.patientName || 'Rajendra Naik',
        age: currentIntake?.age || 42,
        gender: currentIntake?.gender || 'Male',
        village: currentIntake?.village || 'Borigumma, Koraput',
        abhaId: currentIntake?.abhaId || '91-4829-1049-2819',
        urgency,
        urgencyScore: score,
        urgencyReason:
          urgency === 'RED'
            ? (appLang === 'or-IN' ? 'ତତକ୍ଷଣାତ୍ ଡାକ୍ତରୀ ଚିକିତ୍ସା ଆବଶ୍ୟକ' : (appLang === 'hi-IN' ? 'तत्काल डॉक्टर समीक्षा आवश्यक' : 'Immediate Resuscitation / Senior Doctor Review Required'))
            : urgency === 'YELLOW'
            ? (appLang === 'or-IN' ? 'ପ୍ରାଥମିକତା ଡାକ୍ତରୀ ଯାଞ୍ଚ' : (appLang === 'hi-IN' ? 'प्राथमिकता डॉक्टर जांच' : 'Priority Care / Urgent Medical Attention'))
            : (appLang === 'or-IN' ? 'ସ୍ଥିର / ସାଧାରଣ OPD' : (appLang === 'hi-IN' ? 'स्थिर / सामान्य ओपीडी' : 'Routine OPD Care')),
        flags,
        chiefComplaint: currentIntake?.chiefComplaint || currentIntake?.translatedSummary || 'High fever with productive cough',
        vitals: currentIntake?.vitals || { temperature: '101.4', pulse: '98', systolic: '138', diastolic: '88', spo2: '94' },
        ocrMetrics: currentOcr?.metrics || [],
        sourceAudioSummary: currentIntake?.originalSpeech || null,
        englishTranslation: currentIntake?.translatedSummary || null,
        status: 'PENDING_VALIDATION',
        timestamp: new Date().toISOString()
      };

      setGeneratedTriageNote(note);
      if (isFirebaseReady) {
        saveFirestoreDoc(FIRESTORE_COLLECTIONS.TRIAGE_NOTES, note.ticketId, note).catch((e) =>
          console.warn('Firestore triage note save note:', e)
        );
      }
      setIsGeneratingNote(false);
      if (isAdmin || isDoctor) {
        setActiveHub('doctor');
        setActiveTab('dashboard');
      } else {
        setActiveTab('intake');
      }
    }, 800);
  };

  // If user requested Auth page or no user logged in
  if (showAuthPage || !currentUser) {
    return (
      <AuthPage
        themeMode={themeMode}
        onThemeChange={(mode) => setThemeMode(mode)}
        onLoginSuccess={handleLoginSuccess}
        onCancel={currentUser ? () => setShowAuthPage(false) : null}
      />
    );
  }

  const userInitials = currentUser.name
    ? currentUser.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
    : 'U';

  // 100% Pure Multilingual UI Text
  const uiText = {
    'or-IN': {
      title: 'SwasthyaMitra',
      subtitle: 'AI ସ୍କ୍ରାଇବ୍, ଲ୍ୟାବ୍ OCR ଓ କ୍ଲିନିକାଲ୍ ଟ୍ରାଏଜ୍ (ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ)',
      safetyLabel: 'ସୁରକ୍ଷା ନିୟମ:',
      protocol: 'ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ (Non-Diagnostic) | BSKY & NHM ଅନ୍ତର୍ଭୁକ୍ତ',
      facilityLabel: 'କେନ୍ଦ୍ର:',
      portalTag: isAdmin ? 'ରାଜ୍ୟ ସୁପର ଆଡମିନ୍' : isDoctor ? 'ଡାକ୍ତରୀ କକ୍‌ପିଟ୍' : isAsha ? 'ଆଶା ଫିଲ୍ଡ ଷ୍ଟେସନ୍' : 'ନାଗରିକ ପୋର୍ଟାଲ୍',
      // Hubs
      hubCitizen: isAdmin ? '୪. ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ ଡେସ୍କ' : '୧. ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ ଡେସ୍କ',
      hubDoctor: '୨. ଡାକ୍ତର କ୍ଲିନିକାଲ୍ କକ୍‌ପିଟ୍',
      hubPhc: '୩. ଗ୍ରାମୀଣ PHC ଓ ଆଶା',
      hubAdmin: isAdmin ? '୧. ରାଜ୍ୟ କମାଣ୍ଡ ଓ ପ୍ରଶାସନ' : '୪. ରାଜ୍ୟ କମାଣ୍ଡ ଓ ଲଜିଷ୍ଟିକ୍ସ',
      // Citizen Subtabs
      sub_intake: 'ମୋର ଲକ୍ଷଣ ଦାଖଲ',
      sub_ocr: 'ଲ୍ୟାବ୍ ରିପୋର୍ଟ OCR',
      sub_booking: 'ଡାକ୍ତର ତାଲିକା ଓ ବୁକିଂ',
      sub_nearest: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ (GPS)',
      sub_ambulance: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ',
      sub_expiry: 'ଔଷଧ ମିଆଦ ଯାଞ୍ଚ',
      sub_teleconsult: 'ଭିଡିଓ ଟେଲି-ପରାମର୍ଶ (WebRTC)',
      // Doctor Subtabs
      sub_review: 'ଟ୍ରାଏଜ୍ ରିଭ୍ୟୁ ଡେସ୍କ',
      sub_nmc_rx: 'NMC QR ପ୍ରେସକ୍ରିପସନ୍',
      sub_drug_allergy: 'ଔଷଧ ଆଲର୍ଜି ଗାର୍ଡ',
      sub_diff: 'ଡିଫରେନ୍ସିଆଲ୍ ଟ୍ରାଏଜ୍',
      sub_scores: 'ରିସ୍କ ସ୍କୋର (qSOFA/GCS)',
      sub_transfers: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଟ୍ରାନ୍ସଫର୍',
      // Rural PHC Subtabs
      sub_offline_pwa: 'PWA ଅଫଲାଇନ୍ ସିଙ୍କ୍ (DB)',
      sub_asha_voice: 'ଆଶା ଭଏସ୍ କୋପାଇଲଟ୍',
      sub_family_camp: 'ପରିବାର କ୍ୟାମ୍ପ ଟ୍ରାଏଜ୍',
      sub_maternal: 'ANC ଗର୍ଭବତୀ ମାତୃ ସୁରକ୍ଷା',
      sub_pain_map: 'ପେନ୍ ମ୍ୟାପ୍ ଓ ସ୍କେଲ୍',
      // State Admin Subtabs
      sub_admin_desk: 'ପ୍ରଶାସନ ଡେସ୍କ',
      sub_beds: 'ହସ୍ପିଟାଲ୍ ବେଡ୍ ରିଜର୍ଭେସନ୍',
      sub_blood: 'ରକ୍ତ ଭଣ୍ଡାର (Blood Bank)',
      sub_outbreak: 'IDSP ମହାମାରୀ ରାଡାର',
      sub_inventory: 'ଔଷଧ ଷ୍ଟକ୍ ଲିଙ୍କେଜ୍',
      // Badges & Labels
      noteReadyBadge: 'ନୋଟ୍ ପ୍ରସ୍ତୁତ',
      oneNewBadge: '୧ ନୂଆ',
      verifiedDoctorBadge: 'RMP ପ୍ରମାଣିତ ଡାକ୍ତର',
      verifiedPatientBadge: 'ABHA ପ୍ରମାଣିତ ନାଗରିକ',
      verifiedAdminBadge: 'Super Admin',
      switchUser: 'ଖାତା ବଦଳାନ୍ତୁ (Login)',
      signOut: 'ଲଗ୍ ଆଉଟ୍',
      years: 'ବର୍ଷ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      bloodGroup: 'ରକ୍ତ ବର୍ଗ',
      priorityAlertPrefix: 'ନୂତନ ପ୍ରାଥମିକତା ରୋଗୀ ଆସିଛି:',
      ticketLabel: 'ଟିକେଟ୍',
      urgencyLabel: 'ଜରୁରୀ ସ୍ତର',
      doctorValidationReq: 'ଡାକ୍ତରୀ ଯାଞ୍ଚ ଆବଶ୍ୟକ',
      linkedIntakeLabel: 'ସଂଯୁକ୍ତ ରୋଗୀ ବିବରଣୀ:',
      vitalsAttached: '✓ ଜୀବନ ସୂଚକ ସଂଲଗ୍ନ',
      btnGeneratingNote: 'କ୍ଲିନିକାଲ୍ ରେଡ୍ ଫ୍ଲାଗ୍ ଏବଂ ଟ୍ରାଏଜ୍ ନୋଟ୍ ପ୍ରକ୍ରିୟାକରଣ ଚାଲିଛି...',
      btnGenerateNote: 'ସଂରଚିତ ଟ୍ରାଏଜ୍ ନୋଟ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ ଏବଂ ଡାକ୍ତର ଧାଡ଼ିକୁ ପଠାନ୍ତୁ',
      footerText: 'SwasthyaMitra • ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ପୋର୍ଟାଲ୍ • ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ (Non-Diagnostic)'
    },
    'hi-IN': {
      title: 'SwasthyaMitra',
      subtitle: 'स्मार्ट क्लिनिकल ट्रायज एवं रेफरल वर्कस्टेशन (राष्ट्रीय स्वास्थ्य मिशन)',
      safetyLabel: 'सुरक्षा नियम:',
      protocol: 'क्लिनिकल निर्णय समर्थन (Non-Diagnostic) | आयुष्मान भारत एवं NHM',
      facilityLabel: 'केंद्र:',
      portalTag: isAdmin ? 'राज्य सुपर एडमिन' : isDoctor ? 'डॉक्टर कॉकपिट' : isAsha ? 'आशा फील्ड स्टेशन' : 'नागरिक पोर्टल',
      // Hubs
      hubCitizen: isAdmin ? '4. नागरिक स्वास्थ्य डेस्क' : '1. नागरिक स्वास्थ्य डेस्क',
      hubDoctor: '2. डॉक्टर क्लिनिकल कॉकपिट',
      hubPhc: '3. ग्रामीण PHC एवं आशा',
      hubAdmin: isAdmin ? '1. राज्य कमान एवं प्रशासन' : '4. राज्य प्रशासन एवं लॉजिस्टिक्स',
      // Citizen Subtabs
      sub_intake: 'लक्षण दर्ज करें',
      sub_ocr: 'लैब रिपोर्ट OCR',
      sub_booking: 'डॉक्टर निर्देशिका एवं बुकिंग',
      sub_nearest: 'निकटतम अस्पताल (GPS Map)',
      sub_ambulance: '108 एम्बुलेंस बुकिंग',
      sub_expiry: 'दवा एक्सपायरी जांच',
      sub_teleconsult: 'वीडियो टेलीमेडिसिन (WebRTC)',
      // Doctor Subtabs
      sub_review: 'ट्रायज समीक्षा डेस्क',
      sub_nmc_rx: 'NMC QR प्रिस्क्रिप्शन',
      sub_drug_allergy: 'ड्रग एलर्जी अलर्ट गार्ड',
      sub_diff: 'डिफरेंशियल ट्रायज',
      sub_scores: 'क्लिनिकल रिस्क स्कोर (qSOFA)',
      sub_transfers: 'स्वास्थ्य मित्र रेफरल नेटवर्क',
      // Rural PHC Subtabs
      sub_offline_pwa: 'PWA ऑफलाइन सिंक (DB)',
      sub_asha_voice: 'आशा वॉइस कोपायलट',
      sub_family_camp: 'परिवार कैंप ट्रायज',
      sub_maternal: 'मातृ स्वास्थ्य एवं ANC',
      sub_pain_map: 'दर्द नक्शा एवं स्माइली',
      // State Admin Subtabs
      sub_admin_desk: 'प्रशासन डेस्क',
      sub_beds: 'अस्पताल बेड रिज़र्वेशन',
      sub_blood: 'ब्लड बैंक (Blood Bank)',
      sub_outbreak: 'IDSP आउटब्रेक रडार',
      sub_inventory: 'दवा स्टॉक लिंकेज',
      // Badges & Labels
      noteReadyBadge: 'नोट तैयार',
      oneNewBadge: '1 नया',
      verifiedDoctorBadge: 'RMP सत्यापित डॉक्टर',
      verifiedPatientBadge: 'ABHA सत्यापित नागरिक',
      verifiedAdminBadge: 'Super Admin',
      switchUser: 'खाता बदलें (Login)',
      signOut: 'लॉग आउट',
      years: 'वर्ष',
      male: 'पुरुष',
      female: 'महिला',
      bloodGroup: 'रक्त समूह',
      priorityAlertPrefix: 'नई प्राथमिकता वाला मरीज आया:',
      ticketLabel: 'टिकट',
      urgencyLabel: 'प्राथमिकता',
      doctorValidationReq: 'डॉक्टर सत्यापन आवश्यक',
      linkedIntakeLabel: 'संलग्न मरीज विवरण:',
      vitalsAttached: '✓ वाइटल्स संलग्न',
      btnGeneratingNote: 'क्लिनिकल रेड फ्लैग एवं ट्रायज नोट तैयार हो रहा है...',
      btnGenerateNote: 'संरचित ट्रायज नोट तैयार करें और डॉक्टर कतार में भेजें',
      footerText: 'SwasthyaMitra • राष्ट्रीय स्वास्थ्य पोर्टल • गैर-निदान निर्णय समर्थन'
    },
    'en-IN': {
      title: 'SwasthyaMitra',
      subtitle: 'Clinical Urgency Prioritizer, AI Scribe & Outbox Sync (National Health Mission)',
      safetyLabel: 'Safety Mandate:',
      protocol: 'Human-in-the-Loop Decision Support (Non-Diagnostic) | MoHFW Aligned',
      facilityLabel: 'Facility:',
      portalTag: isAdmin ? 'State Super Admin' : isDoctor ? 'Doctor Cockpit' : isAsha ? 'ASHA Field Station' : 'Citizen Portal',
      // Hubs
      hubCitizen: isAdmin ? '4. Citizen Health Desk' : '1. Citizen Health Desk',
      hubDoctor: '2. Doctor Clinical Cockpit',
      hubPhc: '3. Rural PHC & ASHA Station',
      hubAdmin: isAdmin ? '1. State Health Command' : '4. State Health Command',
      // Citizen Subtabs
      sub_intake: 'Symptom Intake',
      sub_ocr: 'Lab Report OCR',
      sub_booking: 'Doctor Directory & Booking',
      sub_nearest: 'Nearest Medical (GPS)',
      sub_ambulance: '108 Ambulance',
      sub_expiry: 'Medicine Expiry Checker',
      sub_teleconsult: 'Video Teleconsultation (WebRTC)',
      // Doctor Subtabs
      sub_review: 'Triage Review Desk',
      sub_nmc_rx: 'NMC QR Prescriptions',
      sub_drug_allergy: 'Drug-Allergy Guard',
      sub_diff: 'Differential Triage',
      sub_scores: 'Clinical Risk Scores',
      sub_transfers: 'Apex Hospital Tie-ups',
      // Rural PHC Subtabs
      sub_offline_pwa: 'Offline PWA & Outbox',
      sub_asha_voice: 'ASHA Voice Copilot',
      sub_family_camp: 'Family Camp Triage',
      sub_maternal: 'Maternal ANC High-Risk',
      sub_pain_map: 'Pictorial Pain Map',
      // State Admin Subtabs
      sub_admin_desk: 'Command Overview',
      sub_beds: 'Hospital Bed Reservation',
      sub_blood: 'Blood Bank Network',
      sub_outbreak: 'IDSP Outbreak Radar',
      sub_inventory: 'Drug Stock Linkage',
      // Badges & Labels
      noteReadyBadge: 'Note Ready',
      oneNewBadge: '1 New',
      verifiedDoctorBadge: 'Verified RMP Doctor',
      verifiedPatientBadge: 'ABHA Verified Citizen',
      verifiedAdminBadge: 'Super Admin',
      switchUser: 'Switch User (Login)',
      signOut: 'Sign Out',
      years: 'yrs',
      male: 'Male',
      female: 'Female',
      bloodGroup: 'Blood',
      priorityAlertPrefix: 'New Priority Intake Arrived:',
      ticketLabel: 'Ticket',
      urgencyLabel: 'URGENCY',
      doctorValidationReq: 'Requires Doctor Validation',
      linkedIntakeLabel: 'Linked Intake:',
      vitalsAttached: '✓ Vitals Attached',
      btnGeneratingNote: 'Processing Clinical Red Flags & Triage Note...',
      btnGenerateNote: 'Generate Structured Triage Note & Send to Doctor Queue',
      footerText: 'SwasthyaMitra • National Health Mission • Non-Diagnostic Decision Support'
    }
  }[appLang] || {};

  // Helper function to render active workspace component for both desktop & mobile views
  const renderActiveWorkspace = () => (
    <>
      {/* ─── CITIZEN MODULES ─── */}
      {activeTab === 'intake' && (
        <div>
          <MultimodalIntakeForm
            currentUser={{ ...currentUser, preferredLanguage: appLang }}
            appLang={appLang}
            onLanguageChange={handleLanguageChange}
            onIntakeComplete={handleIntakeComplete}
          />
        </div>
      )}

      {activeTab === 'ocr' && (
        <div>
          {currentIntake && (
            <div className="max-w-2xl mx-auto mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <span>
                <strong>{uiText.linkedIntakeLabel} </strong>
                {currentIntake.translatedSummary?.slice(0, 70)}...
              </span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{uiText.vitalsAttached}</span>
            </div>
          )}

          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading OCR Uploader...</div>}>
            <OcrUploader appLang={appLang} onOcrComplete={handleOcrComplete} />
          </Suspense>

          <div className="max-w-2xl mx-auto mt-6 text-center">
            <button
              onClick={handleGenerateTriage}
              disabled={isGeneratingNote}
              className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {isGeneratingNote ? (
                <span>{uiText.btnGeneratingNote}</span>
              ) : (
                <>
                  <Activity className="w-4 h-4 text-emerald-400" />
                  {uiText.btnGenerateNote}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {(activeTab === 'booking' || activeTab === 'doctors') && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Doctor Directory...</div>}>
            <DoctorBookingSystem
              currentUser={currentUser}
              appLang={appLang}
              onBookedCountChange={(cnt) => setBookedCount(cnt)}
              onOpenNmcSuite={() => handleNavigateTab('nmc_referral')}
              onOpenTeleconsult={handleOpenTeleconsult}
            />
          </Suspense>
        </div>
      )}

      {activeTab === 'nearest' && (
        <div className="space-y-6">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading GPS Emergency Map...</div>}>
            <NearestMedicalGPS
              currentUser={currentUser}
              appLang={appLang}
              onNavigateToAmbulance={() => handleNavigateTab('ambulance')}
            />
          </Suspense>
        </div>
      )}

      {activeTab === 'ambulance' && (
        <div className="space-y-6">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading 108 Ambulance System...</div>}>
            <AmbulanceBooking
              currentUser={currentUser}
              appLang={appLang}
              onNavigateToNearest={() => handleNavigateTab('nearest')}
            />
          </Suspense>
        </div>
      )}

      {(activeTab === 'expiry' || activeTab === 'medicines') && (
        <div className="space-y-6">
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Medicine Expiry Scanner...</div>}>
            <MedicineExpiryChecker
              appLang={appLang}
              currentUser={currentUser}
              onBookDoctor={() => handleNavigateTab('booking')}
            />
          </Suspense>
        </div>
      )}

      {/* ─── DOCTOR CLINICAL MODULES ─── */}
      {activeTab === 'dashboard' && (
        <div>
          {generatedTriageNote && (
            <div className="max-w-7xl mx-auto mb-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>{uiText.priorityAlertPrefix} </strong>
                  {uiText.ticketLabel} #{generatedTriageNote.id} ({generatedTriageNote.urgency} {uiText.urgencyLabel} - {generatedTriageNote.urgencyReason})
                </span>
              </div>
              <span className="bg-rose-600 text-white font-bold px-2 py-0.5 rounded text-[11px]">
                {uiText.doctorValidationReq}
              </span>
            </div>
          )}
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Doctor Dashboard...</div>}>
            <TriageDoctorDashboard
              currentUser={{ ...currentUser, preferredLanguage: appLang }}
              appLang={appLang}
              onSwitchUser={() => setShowAuthPage(true)}
              onNavigateToNmc={() => handleNavigateTab('nmc_referral')}
              onOpenTeleconsult={handleOpenTeleconsult}
            />
          </Suspense>
        </div>
      )}

      {/* ─── WEBRTC TELEMEDICINE VIDEO CONSULTATION (CROSS-HUB) ─── */}
      {activeTab === 'teleconsult' && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Telemedicine Suite...</div>}>
            <TelemedicineVideoSuite
              currentUser={currentUser}
              appLang={appLang}
              initialPatient={
                teleconsultSession?.patient ||
                (teleconsultSession?.patientName
                  ? {
                      name: teleconsultSession.patientName,
                      age: teleconsultSession.patientAge || 48,
                      gender: teleconsultSession.patientGender || 'Male',
                      abhaId: teleconsultSession.patientAbha || '91-4412-8820-1945',
                      phone: teleconsultSession.patientPhone || '+91 94371 90214',
                      district: teleconsultSession.district || 'Cuttack',
                      bloodGroup: teleconsultSession.bloodGroup || 'B+',
                      chiefComplaint:
                        teleconsultSession.reason ||
                        teleconsultSession.urgencyReason ||
                        'Acute symptoms requiring teleconsultation',
                      vitals: teleconsultSession.vitals || {
                        bp: '104/68 mmHg',
                        pulse: '106 bpm',
                        spo2: '97%',
                        temp: '101.4°F',
                        rr: '20/min'
                      },
                      acuity: teleconsultSession.urgency || 'YELLOW'
                    }
                  : null)
              }
              initialDoctor={
                teleconsultSession?.doctorName
                  ? {
                      name:
                        typeof teleconsultSession.doctorName === 'object'
                          ? teleconsultSession.doctorName[appLang] || teleconsultSession.doctorName['en-IN']
                          : teleconsultSession.doctorName,
                      degrees: teleconsultSession.doctorQualifications || 'MBBS, MD (Internal Medicine)',
                      regNo: teleconsultSession.doctorRegNo || 'OMC-2017-66431',
                      facility:
                        typeof teleconsultSession.facility === 'object'
                          ? teleconsultSession.facility[appLang] || teleconsultSession.facility['en-IN']
                          : teleconsultSession.facility,
                      department:
                        typeof teleconsultSession.department === 'object'
                          ? teleconsultSession.department[appLang] || teleconsultSession.department['en-IN']
                          : teleconsultSession.department
                    }
                  : null
              }
              onNavigateToNmc={() => handleNavigateTab('nmc_referral')}
              onNavigateBack={() => handleNavigateTab(activeHub === 'doctor' ? 'dashboard' : 'booking')}
            />
          </Suspense>
        </div>
      )}

      {(activeTab === 'nmc_referral' || activeTab === 't29_nmc_referral' || activeTab === 't29_discharge') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading NMC Prescription Suite...</div>}>
          <NmcReferralPrescriptionSuite
            appLang={appLang}
            currentUser={currentUser}
            onNavigateBack={() => handleNavigateTab('dashboard')}
          />
        </Suspense>
      )}

      {(activeTab === 'drugallergy' || activeTab === 't13_drugallergy') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Drug Allergy Safety Guard...</div>}>
          <DrugAllergySafetyGuard
            currentUser={currentUser}
            appLang={appLang}
          />
        </Suspense>
      )}

      {(activeTab === 'differential' || activeTab === 't12_differential' || activeTab === 'xray') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Differential Triage & X-Ray...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="differential" />
        </Suspense>
      )}

      {(activeTab === 'riskscores' || activeTab === 't14_riskscores') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Clinical Risk Scores...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="scores" />
        </Suspense>
      )}

      {(activeTab === 'abha_history' || activeTab === 't11_abha_history') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading ABHA Temporal History...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="abha_history" />
        </Suspense>
      )}

      {(activeTab === 'hospitals' || activeTab === 'transfers') && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Hospital Tie-ups...</div>}>
            <HospitalTieUpSystem
              currentUser={currentUser}
              appLang={appLang}
              onTransfersCountChange={(cnt) => setTransfersCount(cnt)}
            />
          </Suspense>
        </div>
      )}

      {/* ─── RURAL PHC & ASHA MODULES ─── */}
      {activeTab === 'phc_offline' && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Rural PHC Offline Suite...</div>}>
            <PhcOfflineSyncSuite appLang={appLang} themeMode={themeMode} />
          </Suspense>
        </div>
      )}

      {(activeTab === 'asha_voice' || activeTab === 't17_asha_voice') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading ASHA Voice Copilot...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="asha_copilot" />
        </Suspense>
      )}

      {(activeTab === 'family_triage' || activeTab === 't19_family_triage') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Family Camp Triage...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="asha_copilot" />
        </Suspense>
      )}

      {(activeTab === 'maternal_anc' || activeTab === 't30_anc_maternal') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Maternal ANC Module...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="maternal" />
        </Suspense>
      )}

      {(activeTab === 'pain_map' || activeTab === 't18_pain_map') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Pictorial Pain Map...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="asha_copilot" />
        </Suspense>
      )}

      {/* ─── STATE ADMIN & LOGISTICS MODULES ─── */}
      {activeTab === 'admin' && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Admin Portal...</div>}>
            <AdminPage
              currentUser={currentUser}
              appLang={appLang}
              onNavigateTab={(tab) => handleNavigateTab(tab)}
              onLogout={handleLogout}
              onSwitchUser={() => setShowAuthPage(true)}
            />
          </Suspense>
        </div>
      )}

      {activeTab === 'beds' && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Bed Reservation...</div>}>
            <BedBookingSystem
              currentUser={currentUser}
              appLang={appLang}
            />
          </Suspense>
        </div>
      )}

      {(activeTab === 'bloodbank' || activeTab === 'blood') && (
        <div>
          <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Blood Bank Portal...</div>}>
            <BloodBankSystem
              currentUser={currentUser}
              appLang={appLang}
            />
          </Suspense>
        </div>
      )}

      {(activeTab === 'outbreak' || activeTab === 't23_outbreak') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading IDSP Outbreak Radar...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="outbreak" />
        </Suspense>
      )}

      {(activeTab === 'inventory' || activeTab === 't24_inventory') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Drug Inventory Linkage...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="drug_safety" />
        </Suspense>
      )}

      {(activeTab === 'compliance' || activeTab === 't15_compliance') && (
        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading DPDP Compliance & RLHF...</div>}>
          <GovtGovTechSuite appLang={appLang} currentUser={currentUser} initialFeature="compliance" />
        </Suspense>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE & TABLET VIEW (SCREEN < 1024px, iPhone, Android, Touch)   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {effectiveIsMobile ? (
        <div className="w-full min-h-screen">
          <MobileAppView
            currentUser={currentUser}
            appLang={appLang}
            setAppLang={handleLanguageChange}
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            activeHub={activeHub}
            setActiveHub={setActiveHub}
            onOpenAuth={() => setShowAuthPage(true)}
            onLogout={handleLogout}
            renderActiveComponent={renderActiveWorkspace}
            onSwitchToDesktop={() => setViewModeOverride('desktop')}
          />
        </div>
      ) : (
        /* ─────────────────────────────────────────────────────────────────── */
        /* 2. DESKTOP & LAPTOP WORKSPACE (SCREEN >= 1024px — Full Multi-Hub)   */
        /* ─────────────────────────────────────────────────────────────────── */
        <div className="flex flex-col min-h-screen">
          {/* 1. TOP STATUS & CLINICAL SAFETY BANNER (ROLE-TAILORED) */}
          <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
          {isAdmin ? (
            <Shield className="w-4 h-4 text-purple-400" />
          ) : isDoctor ? (
            <Stethoscope className="w-4 h-4 text-emerald-400" />
          ) : isAsha ? (
            <Database className="w-4 h-4 text-teal-400" />
          ) : (
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          )}
          <span className="font-semibold text-white">{uiText.safetyLabel}</span>
          <span className="text-slate-300">
            {isAdmin
              ? 'State Digital Health Mission Governance & Infrastructure Oversight'
              : isDoctor
              ? 'RMP Decision Support (Non-Diagnostic) | MoHFW & Odisha Medical Council'
              : isAsha
              ? 'Rural Community Health Outreach Station | Offline PWA Active'
              : 'Citizen Healthcare Portal | BSKY & Ayushman Bharat (ଓଡ଼ିଶା)'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          {/* Offline / Online Sync Indicator */}
          <button
            onClick={() => {
              if (isAsha || isAdmin || isDoctor) {
                setActiveHub('phc');
                setActiveTab('phc_offline');
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all ${
              isAsha || isAdmin || isDoctor ? 'cursor-pointer' : 'cursor-default'
            } ${
              isOnline
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                : 'bg-amber-950/90 text-amber-300 border border-amber-500/60 animate-pulse hover:bg-amber-900'
            }`}
            title="Rural PHC Offline & IndexedDB Sync Status"
          >
            {isOnline ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3 text-amber-400" />}
            <span>{isOnline ? 'Cloud Synced' : 'Offline Mode (IndexedDB)'}</span>
          </button>

          {/* 🔑 FIREBASE CLOUD / API CONFIGURATION BUTTON: STRICTLY ADMIN ONLY */}
          {isAdmin && (
            <button
              onClick={() => setShowFirebaseModal(true)}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                isFirebaseReady
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                  : 'bg-purple-950 text-purple-300 border border-purple-500/60 hover:bg-purple-900'
              }`}
              title="Super Admin: Configure Cloud Firestore & API Credentials"
            >
              <Flame className="w-3 h-3 text-amber-400" />
              <span>{isFirebaseReady ? 'Firestore Live (Admin)' : 'API Config (Admin)'}</span>
            </button>
          )}

          <span className="hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {uiText.facilityLabel} <strong>{currentUser.facility?.split(',')[0]}</strong>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {uiText.portalTag}
          </span>
          <span className="hidden sm:inline">|</span>
          <button
            onClick={() => setViewModeOverride('mobile')}
            className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-900/80 hover:bg-indigo-800 text-indigo-200 border border-indigo-500/40 text-[10px] font-bold transition-all cursor-pointer shadow-xs"
            title="Switch to Mobile Smartphone App View"
          >
            <Smartphone className="w-3 h-3 text-indigo-400" />
            <span>Mobile App</span>
          </button>
          <span className="hidden sm:inline">|</span>
          <button
            onClick={() => {
              setShowProfileMenu(false);
              setShowAuthPage(true);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-semibold transition-all cursor-pointer"
            title="Switch user account"
          >
            <LogIn className="w-2.5 h-2.5 text-emerald-400" />
            <span>{uiText.switchUser || 'Switch'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300 hover:text-white border border-rose-800/60 text-[10px] font-semibold transition-all cursor-pointer"
            title="Sign out of current session"
          >
            <LogOut className="w-2.5 h-2.5 text-rose-400" />
            <span>{uiText.signOut || 'Sign Out'}</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. MAIN NAVBAR WITH DYNAMIC ROLE-BASED HUB SELECTORS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between py-2.5 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl shadow-md text-white ${
              isAdmin
                ? 'bg-gradient-to-br from-purple-700 to-indigo-800'
                : isDoctor
                ? 'bg-gradient-to-br from-slate-900 to-emerald-800'
                : isAsha
                ? 'bg-gradient-to-br from-teal-700 to-emerald-800'
                : 'bg-gradient-to-br from-amber-600 to-orange-700'
            }`}>
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {uiText.title}
                </h1>
                <span className={`px-2 py-0.5 text-[10px] font-black rounded-md border ${
                  isAdmin
                    ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                    : isDoctor
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                    : isAsha
                    ? 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {isAdmin ? 'ADMIN' : isDoctor ? 'DOCTOR' : isAsha ? 'ASHA / PHC' : 'CITIZEN'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-md">
                {uiText.subtitle}
              </p>
            </div>
          </div>

          {/* 4 CORE ROLE-BASED HUBS (Prioritized: Admin first for Administrators) */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
            {isAdmin ? (
              <>
                {/* HUB 1 (ADMIN): STATE COMMAND */}
                <button
                  onClick={() => switchHub('admin')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'admin'
                      ? 'bg-purple-800 text-white shadow-md ring-2 ring-purple-400/40'
                      : 'text-purple-950 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-100/60 dark:hover:bg-purple-950/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{uiText.hubAdmin}</span>
                  <span className="bg-amber-400 text-purple-950 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                    COMMAND
                  </span>
                </button>

                {/* HUB 2: DOCTOR */}
                <button
                  onClick={() => switchHub('doctor')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'doctor'
                      ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-md ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>{uiText.hubDoctor}</span>
                  {generatedTriageNote && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                      1
                    </span>
                  )}
                </button>

                {/* HUB 3: RURAL PHC & ASHA */}
                <button
                  onClick={() => switchHub('phc')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'phc'
                      ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Database className="w-4 h-4 text-teal-300" />
                  <span>{uiText.hubPhc}</span>
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    OFFLINE
                  </span>
                </button>

                {/* HUB 4: CITIZEN */}
                <button
                  onClick={() => switchHub('citizen')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'citizen'
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{uiText.hubCitizen}</span>
                </button>
              </>
            ) : (
              <>
                {/* HUB 1: CITIZEN */}
                <button
                  onClick={() => switchHub('citizen')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'citizen'
                      ? 'bg-amber-600 text-white shadow-md ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>{uiText.hubCitizen}</span>
                </button>

                {/* HUB 2: DOCTOR */}
                <button
                  onClick={() => switchHub('doctor')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'doctor'
                      ? 'bg-slate-900 dark:bg-slate-950 text-white shadow-md ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-emerald-800 dark:hover:text-emerald-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  <span>{uiText.hubDoctor}</span>
                  {generatedTriageNote && (
                    <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                      1
                    </span>
                  )}
                </button>

                {/* HUB 3: RURAL PHC & ASHA */}
                <button
                  onClick={() => switchHub('phc')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'phc'
                      ? 'bg-teal-700 text-white shadow-md ring-2 ring-teal-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:text-teal-800 dark:hover:text-teal-300 hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <Database className="w-4 h-4 text-teal-300" />
                  <span>{uiText.hubPhc}</span>
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                    OFFLINE
                  </span>
                </button>

                {/* HUB 4: STATE COMMAND */}
                <button
                  onClick={() => switchHub('admin')}
                  className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeHub === 'admin'
                      ? 'bg-purple-800 text-white shadow-md ring-2 ring-purple-400/40'
                      : 'text-purple-950 dark:text-purple-300 hover:text-purple-800 hover:bg-purple-100/60 dark:hover:bg-purple-950/60'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{uiText.hubAdmin}</span>
                  <span className="bg-amber-400 text-purple-950 text-[9px] px-1.5 py-0.2 rounded-full font-black">
                    GOV
                  </span>
                </button>
              </>
            )}
          </div>

          {/* Right Controls: Theme Switcher, Language Switcher & User Profile */}
          <div className="flex items-center gap-2 self-end lg:self-auto">
            {/* Theme Mode Switcher */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                title="Light Mode"
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-white text-amber-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('reading')}
                title="Reading Mode (Eye-Care)"
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'reading'
                    ? 'bg-amber-100 text-amber-900 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                title="Dark Mode"
                className={`p-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-slate-900 text-purple-400 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-300 dark:border-slate-700 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
              <button
                onClick={() => handleLanguageChange('or-IN')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  appLang === 'or-IN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                onClick={() => handleLanguageChange('hi-IN')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  appLang === 'hi-IN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                हिंदी
              </button>
              <button
                onClick={() => handleLanguageChange('en-IN')}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  appLang === 'en-IN'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                Eng
              </button>
            </div>

            {/* User Profile Pill with Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-white dark:bg-slate-900 transition-all text-left group cursor-pointer"
              >
                {currentUser.roleCategory === 'doctor' ? (
                  <DoctorAvatar
                    gender={currentUser.gender || 'Male'}
                    name={currentUser.name}
                    className="w-8 h-8 rounded-lg shadow-xs"
                    size="sm"
                  />
                ) : (
                  <div className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                    isAdmin
                      ? 'bg-gradient-to-br from-purple-700 to-indigo-800'
                      : isAsha
                      ? 'bg-gradient-to-br from-teal-700 to-emerald-800'
                      : 'bg-gradient-to-br from-amber-600 to-orange-700'
                  }`}>
                    {userInitials}
                  </div>
                )}
                <div className="hidden sm:block">
                  <div className="text-xs font-bold leading-tight text-slate-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                    {currentUser.role.split('/')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
              </button>

              {/* Enhanced Profile Menu & Instant Demo Persona Switcher */}
              {showProfileMenu && (
                <>
                  {/* Click-outside backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/10 backdrop-blur-[0.5px]"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 text-xs animate-fadeIn">
                    <div className="px-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</span>
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          isAdmin
                            ? 'bg-purple-100 text-purple-800 border border-purple-300'
                            : isDoctor
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isAsha
                            ? 'bg-teal-100 text-teal-800 border border-teal-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {isAdmin
                            ? uiText.verifiedAdminBadge
                            : isDoctor
                            ? uiText.verifiedDoctorBadge
                            : isAsha
                            ? 'ASHA Outreach'
                            : uiText.verifiedPatientBadge}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 mt-0.5">{currentUser.role}</p>
                      <p className="text-[10px] text-slate-400 font-mono">ID: {currentUser.staffId}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-1">📍 {currentUser.facility}</p>
                    </div>

                    {/* 🎭 1-CLICK INSTANT DEMO PERSONA SWITCHER */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50">
                      <div className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
                        <span>🎭 Switch Persona (Live Demo)</span>
                        <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">1-Click</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleQuickPersonaSwitch('patient')}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isPatient
                              ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
                            <User className="w-3.5 h-3.5" />
                            <span>Citizen</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Pratap (Patient)</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersonaSwitch('doctor')}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isDoctor
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
                            <Stethoscope className="w-3.5 h-3.5" />
                            <span>Doctor (RMP)</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Dr. Soumya (MO)</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersonaSwitch('asha')}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isAsha
                              ? 'bg-teal-100 border-teal-400 text-teal-950 font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-teal-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 dark:text-teal-400">
                            <Database className="w-3.5 h-3.5" />
                            <span>ASHA / PHC</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Sunita Devi (ASHA)</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleQuickPersonaSwitch('admin')}
                          className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                            isAdmin
                              ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-400'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Super Admin</span>
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">Sunil Biswal (State Admin)</div>
                        </button>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowAuthPage(true);
                        }}
                        className="w-full text-left px-3 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <LogIn className="w-3.5 h-3.5 text-slate-500" />
                        {uiText.switchUser}
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg flex items-center gap-2 font-medium cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        {uiText.signOut}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. SUB-TAB NAVIGATION RIBBON (ROLE-SPECIFIC FEATURE PILLS) */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="bg-slate-50/90 dark:bg-slate-950/80 border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-6 py-2 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5">
            {/* ─── HUB 1: CITIZEN FEATURES ─── */}
            {activeHub === 'citizen' && (
              <>
                <button
                  onClick={() => setActiveTab('intake')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'intake'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-300" />
                  <span>{uiText.sub_intake}</span>
                  {currentIntake && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'ocr'
                      ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-300" />
                  <span>{uiText.sub_ocr}</span>
                  {currentOcr && <span className="w-2 h-2 rounded-full bg-blue-300"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'booking'
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-300" />
                  <span>{uiText.sub_booking}</span>
                  {bookedCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {bookedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('nearest')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'nearest'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{uiText.sub_nearest}</span>
                </button>

                <button
                  onClick={() => setActiveTab('ambulance')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'ambulance'
                      ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5 text-rose-300" />
                  <span>{uiText.sub_ambulance}</span>
                </button>

                <button
                  onClick={() => setActiveTab('expiry')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'expiry'
                      ? 'bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{uiText.sub_expiry}</span>
                </button>

                <button
                  onClick={() => setActiveTab('beds')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'beds'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Bed className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{uiText.sub_beds}</span>
                </button>

                <button
                  onClick={() => setActiveTab('bloodbank')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'bloodbank'
                      ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-300" />
                  <span>{uiText.sub_blood}</span>
                </button>

                <button
                  onClick={() => setActiveTab('teleconsult')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'teleconsult'
                      ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-purple-300" />
                  <span>{uiText.sub_teleconsult}</span>
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
                    LIVE
                  </span>
                </button>
              </>
            )}

            {/* ─── HUB 2: DOCTOR CLINICAL FEATURES ─── */}
            {activeHub === 'doctor' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{uiText.sub_review}</span>
                  {generatedTriageNote && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {uiText.noteReadyBadge}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('nmc_referral')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'nmc_referral' || activeTab === 't29_nmc_referral' || activeTab === 't29_discharge'
                      ? 'bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{uiText.sub_nmc_rx}</span>
                  <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                    QR
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('drugallergy')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'drugallergy' || activeTab === 't13_drugallergy'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{uiText.sub_drug_allergy}</span>
                </button>

                <button
                  onClick={() => setActiveTab('differential')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'differential' || activeTab === 't12_differential' || activeTab === 'xray'
                      ? 'bg-cyan-700 text-white shadow-sm ring-2 ring-cyan-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-cyan-300" />
                  <span>{uiText.sub_diff}</span>
                </button>

                <button
                  onClick={() => setActiveTab('riskscores')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'riskscores' || activeTab === 't14_riskscores'
                      ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-purple-300" />
                  <span>{uiText.sub_scores}</span>
                </button>

                <button
                  onClick={() => setActiveTab('abha_history')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'abha_history' || activeTab === 't11_abha_history'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                  <span>ABHA History</span>
                </button>

                <button
                  onClick={() => setActiveTab('hospitals')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'hospitals'
                      ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-indigo-300" />
                  <span>{uiText.sub_transfers}</span>
                  <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {transfersCount > 0 ? transfersCount : '110'}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('teleconsult')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'teleconsult'
                      ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-purple-300" />
                  <span>{uiText.sub_teleconsult}</span>
                  <span className="bg-indigo-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black">
                    WebRTC
                  </span>
                </button>
              </>
            )}

            {/* ─── HUB 3: RURAL PHC & ASHA FEATURES ─── */}
            {activeHub === 'phc' && (
              <>
                <button
                  onClick={() => setActiveTab('phc_offline')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'phc_offline'
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Database className="w-3.5 h-3.5 text-teal-300" />
                  <span>{uiText.sub_offline_pwa}</span>
                </button>

                <button
                  onClick={() => setActiveTab('asha_voice')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'asha_voice' || activeTab === 't17_asha_voice'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{uiText.sub_asha_voice}</span>
                </button>

                <button
                  onClick={() => setActiveTab('family_triage')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'family_triage' || activeTab === 't19_family_triage'
                      ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Building className="w-3.5 h-3.5 text-amber-300" />
                  <span>{uiText.sub_family_camp}</span>
                </button>

                <button
                  onClick={() => setActiveTab('maternal_anc')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'maternal_anc' || activeTab === 't30_anc_maternal'
                      ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5 text-rose-300" />
                  <span>{uiText.sub_maternal}</span>
                </button>

                <button
                  onClick={() => setActiveTab('pain_map')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'pain_map' || activeTab === 't18_pain_map'
                      ? 'bg-purple-700 text-white shadow-sm ring-2 ring-purple-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-purple-300" />
                  <span>{uiText.sub_pain_map}</span>
                </button>
              </>
            )}

            {/* ─── HUB 4: STATE ADMIN & LOGISTICS ─── */}
            {activeHub === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'admin'
                      ? 'bg-purple-800 text-white shadow-sm ring-2 ring-purple-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{uiText.sub_admin_desk}</span>
                </button>

                <button
                  onClick={() => setActiveTab('beds')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'beds'
                      ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Bed className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{uiText.sub_beds}</span>
                </button>

                <button
                  onClick={() => setActiveTab('bloodbank')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'bloodbank'
                      ? 'bg-rose-700 text-white shadow-sm ring-2 ring-rose-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-300" />
                  <span>{uiText.sub_blood}</span>
                </button>

                <button
                  onClick={() => setActiveTab('outbreak')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'outbreak' || activeTab === 't23_outbreak'
                      ? 'bg-amber-700 text-white shadow-sm ring-2 ring-amber-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span>{uiText.sub_outbreak}</span>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'inventory' || activeTab === 't24_inventory'
                      ? 'bg-teal-700 text-white shadow-sm ring-2 ring-teal-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Pill className="w-3.5 h-3.5 text-teal-300" />
                  <span>{uiText.sub_inventory}</span>
                </button>

                <button
                  onClick={() => setActiveTab('compliance')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === 'compliance'
                      ? 'bg-indigo-700 text-white shadow-sm ring-2 ring-indigo-400/40'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 hover:shadow-xs'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-indigo-300" />
                  <span>DPDP & RLHF</span>
                </button>

                {/* 🔑 Direct API Modal Trigger strictly for Admins */}
                {isAdmin && (
                  <button
                    onClick={() => setShowFirebaseModal(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-gradient-to-r from-purple-900 to-indigo-900 text-purple-200 hover:text-white border border-purple-700/50 shadow-sm cursor-pointer ml-auto"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Cloud API Infrastructure</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      {/* 4. MAIN WORKSPACE CONTENT AREA (DESKTOP) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 overflow-y-auto">
        {renderActiveWorkspace()}
      </main>

      {/* 5. FOOTER */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-3 text-center text-xs text-slate-400">
        {uiText.footerText}
      </footer>
    </div>
    )}

      {/* Auth / Switch User Modal */}
      {showAuthPage && (
        <Suspense fallback={null}>
          <AuthPage
            themeMode={themeMode}
            onThemeChange={(mode) => setThemeMode(mode)}
            onLoginSuccess={handleLoginSuccess}
            onCancel={() => setShowAuthPage(false)}
          />
        </Suspense>
      )}

      {/* Firebase Cloud Firestore Config & Live Sync Modal (ADMIN ONLY) */}
      {isAdmin && (
        <FirebaseConfigModal
          isOpen={showFirebaseModal}
          onClose={() => setShowFirebaseModal(false)}
          onConfigSaved={handleFirebaseConfigSaved}
        />
      )}
    </div>
  );
}
