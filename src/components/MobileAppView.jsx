import React, { useState, useMemo } from 'react';
import {
  Phone,
  QrCode,
  AlertTriangle,
  Stethoscope,
  Bed,
  Truck,
  MapPin,
  Droplet,
  Pill,
  Activity,
  Calendar,
  User,
  LogOut,
  LogIn,
  Sun,
  Moon,
  BookOpen,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  X,
  FileText,
  Sparkles,
  Zap,
  Globe,
  Search,
  Copy,
  ExternalLink,
  Shield,
  HeartPulse,
  Radio,
  Clock,
  Compass,
  Database,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function MobileAppView({
  currentUser,
  appLang,
  setAppLang,
  themeMode,
  setThemeMode,
  activeTab,
  setActiveTab,
  activeHub,
  setActiveHub,
  onOpenAuth,
  onLogout,
  renderActiveComponent
}) {
  const [mobileSection, setMobileSection] = useState('home'); // 'home' | 'services' | 'records' | 'profile' | 'detail'
  const [showAdvisoryDetail, setShowAdvisoryDetail] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterPill, setActiveFilterPill] = useState('all');
  const [selectedMobileTab, setSelectedMobileTab] = useState(null);

  const isPatient = !currentUser || currentUser.roleCategory === 'patient';
  const isAdmin = currentUser?.roleCategory === 'admin';
  const isDoctor = currentUser?.roleCategory === 'doctor' || currentUser?.roleCategory === 'nurse';
  const isAsha = currentUser?.roleCategory === 'asha' || currentUser?.roleCategory === 'anm';

  const abhaNumber = currentUser?.staffId || '14-8921-4092-7719';
  const patientName = currentUser?.name || 'PRASHANT KUMAR ROUT';
  const patientFacility = currentUser?.facility || 'Capital Hospital, Bhubaneswar';

  // Multilingual translations
  const t = useMemo(() => {
    return {
      'or-IN': {
        brandTitle: 'ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର ଓଡ଼ିଶା',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA ସ୍ୱାସ୍ଥ୍ୟ ପରିଚୟପତ୍ର',
        emergency: 'ଜରୁରୀକାଳୀନ',
        emergency108: '108',
        emergencySub: 'ତୁରନ୍ତ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ (Instant SOS 108)',
        healthAlertTitle: 'ସତର୍କ ସୂଚନା: ପଶ୍ଚିମ ଓଡ଼ିଶାରେ ପ୍ରଚଣ୍ଡ ଗ୍ରୀଷ୍ମ ପ୍ରବାହ। ପର୍ଯ୍ୟାପ୍ତ ଜଳପାନ ଓ ORS ବ୍ୟବହାର କରନ୍ତୁ।',
        viewDetails: 'ବିସ୍ତୃତ ଦେଖନ୍ତୁ',
        searchPlaceholder: 'ଡାକ୍ତର, ହସ୍ପିଟାଲ୍ ବେଡ୍, ଆମ୍ବୁଲାନ୍ସ ଖୋଜନ୍ତୁ...',
        filterAll: 'ସମସ୍ତ ସେବା',
        filterEmergency: '🚨 ୧୦୮ ଆମ୍ବୁଲାନ୍ସ',
        filterBeds: '🛏️ ହସ୍ପିଟାଲ୍ ବେଡ୍',
        filterDoctors: '🩺 ଡାକ୍ତର ପରାମର୍ଶ',
        filterBlood: '🩸 ରକ୍ତ ଭଣ୍ଡାର',
        filterMedicines: '💊 ଔଷଧ ଯାଞ୍ଚ',
        filterOffline: '⚡ PHC ଅଫଲାଇନ୍',
        triageTitle: 'AI ଲକ୍ଷଣ ନିରୂପଣ',
        triageSub: 'AI Clinical Triage',
        triageBadge: 'ଲକ୍ଷଣ ଯାଞ୍ଚ',
        bedTitle: 'ହସ୍ପିଟାଲ୍ ବେଡ୍ ଉପଲବ୍ଧତା',
        bedSub: 'Live ICU & General Beds',
        bedBadge: '୧୦,୭୭୦ ବେଡ୍',
        ambTitle: '୧୦୮ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ',
        ambSub: 'Live GPS SOS Dispatch',
        ambBadge: 'ତୁରନ୍ତ ଡିସପାଚ୍',
        docTitle: 'ଡାକ୍ତର ପରାମର୍ଶ ଓ ବୁକିଂ',
        docSub: '2,523 OMC Specialists',
        docBadge: '୨,୫୨୩ ଡାକ୍ତର',
        gpsTitle: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ GPS',
        gpsSub: 'PHC / CHC / DHH Locator',
        gpsBadge: 'ମ୍ୟାପ୍ ନାଭିଗେସନ୍',
        bloodTitle: 'ରକ୍ତ ଭଣ୍ଡାର (OSBTC)',
        bloodSub: 'Real-Time Blood Stock',
        bloodBadge: '୮,୪୨୦ ୟୁନିଟ୍',
        phcTitle: 'PHC ଅଫଲାଇନ୍ ସିଙ୍କ୍',
        phcSub: 'Offline SQLite Sync Engine',
        phcBadge: 'ଜିରୋ ଇଣ୍ଟରନେଟ୍',
        ashaTitle: 'ଆଶା ଫିଲ୍ଡ ପୋର୍ଟାଲ୍',
        ashaSub: 'Maternal & Child Tracker',
        ashaBadge: 'ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ',
        teleTitle: 'ଟେଲି-କନସଲ୍ଟେସନ୍',
        teleSub: 'HD Video OPD Call',
        teleBadge: 'ଲାଇଭ୍ କଲ୍',
        medTitle: 'ଔଷଧ ସୁରକ୍ଷା ଓ ଏକ୍ସପାଏରୀ',
        medSub: 'QR / OCR Safety Scanner',
        medBadge: 'ସୁରକ୍ଷିତ ଔଷଧ',
        adminTitle: 'ରାଜ୍ୟ କମାଣ୍ଡ ହବ୍',
        adminSub: '30 District Telemetry',
        adminBadge: '୩୦ ଜିଲ୍ଲା',
        home: 'ମୁଖ୍ୟ',
        services: 'ସେବା ସମୂହ',
        records: 'ମୋର ରେକର୍ଡ',
        profile: 'ପ୍ରୋଫାଇଲ୍',
        backToHome: 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ',
        telemetryBeds: '୧୦,୭୭୦ ବେଡ୍',
        telemetryAmbulance: '୧୦୮ ଜିପିଏସ୍',
        telemetryDoctors: '୨,୫୨୩ ଡାକ୍ତର',
        telemetryBlood: '୮,୪୨୦ ୟୁନିଟ୍',
        copySuccess: 'ABHA ନମ୍ବର କପି ହୋଇଗଲା!'
      },
      'hi-IN': {
        brandTitle: 'स्वास्थ्यमित्र ओडिशा',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA स्वास्थ्य पहचान पत्र',
        emergency: 'आपातकालीन',
        emergency108: '108',
        emergencySub: 'त्वरित एम्बुलेंस कॉल (Instant SOS 108)',
        healthAlertTitle: 'चेतावनी: लू और भीषण गर्मी से बचाव हेतु सतर्क रहें व ओआरएस का सेवन करें।',
        viewDetails: 'विवरण देखें',
        searchPlaceholder: 'डॉक्टर, अस्पताल बेड, एम्बुलेंस खोजें...',
        filterAll: 'सभी सेवाएं',
        filterEmergency: '🚨 108 आपातकालीन',
        filterBeds: '🛏️ अस्पताल बेड',
        filterDoctors: '🩺 डॉक्टर परामर्श',
        filterBlood: '🩸 रक्त बैंक',
        filterMedicines: '💊 दवा सुरक्षा',
        filterOffline: '⚡ PHC ऑफलाइन',
        triageTitle: 'AI लक्षण जांच',
        triageSub: 'AI Clinical Triage',
        triageBadge: 'लक्षण जांच',
        bedTitle: 'अस्पताल बेड उपलब्धता',
        bedSub: 'Live ICU & General Beds',
        bedBadge: '10,770 बेड',
        ambTitle: '108 आपातकालीन एम्बुलेंस',
        ambSub: 'Live GPS SOS Dispatch',
        ambBadge: 'त्वरित डिस्पैच',
        docTitle: 'डॉक्टर परामर्श व बुकिंग',
        docSub: '2,523 OMC Specialists',
        docBadge: '2,523 डॉक्टर',
        gpsTitle: 'निकटतम अस्पताल GPS',
        gpsSub: 'PHC / CHC / DHH Locator',
        gpsBadge: 'मैप नेविगेशन',
        bloodTitle: 'रक्त बैंक (OSBTC)',
        bloodSub: 'Real-Time Blood Stock',
        bloodBadge: '8,420 यूनिट',
        phcTitle: 'PHC ऑफलाइन सिंक',
        phcSub: 'Offline SQLite Sync Engine',
        phcBadge: 'जीरो इंटरनेट',
        ashaTitle: 'आशा फील्ड पोर्टल',
        ashaSub: 'Maternal & Child Tracker',
        ashaBadge: 'ग्रामीण स्वास्थ्य',
        teleTitle: 'टेली-परामर्श',
        teleSub: 'HD Video OPD Call',
        teleBadge: 'लाइव कॉल',
        medTitle: 'दवा सुरक्षा व एक्सपायरी',
        medSub: 'QR / OCR Safety Scanner',
        medBadge: 'सुरक्षित दवा',
        adminTitle: 'राज्य कमान हब',
        adminSub: '30 District Telemetry',
        adminBadge: '30 जिले',
        home: 'होम',
        services: 'सेवाएं',
        records: 'रिकॉर्ड',
        profile: 'प्रोफाइल',
        backToHome: 'मुख्य पृष्ठ पर वापस',
        telemetryBeds: '10,770 बेड',
        telemetryAmbulance: '108 जीपीएस',
        telemetryDoctors: '2,523 डॉक्टर',
        telemetryBlood: '8,420 यूनिट',
        copySuccess: 'ABHA संख्या कॉपी हो गई!'
      },
      'en-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA Health ID Card',
        emergency: 'EMERGENCY',
        emergency108: '108',
        emergencySub: 'Instant Ambulance SOS 108',
        healthAlertTitle: 'ALERT: Severe Heatwave in Interior Odisha. Stay Hydrated & Stock ORS Packets.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, hospital beds, ambulance, blood...',
        filterAll: 'All Services',
        filterEmergency: '🚨 108 SOS',
        filterBeds: '🛏️ Hospital Beds',
        filterDoctors: '🩺 Doctors',
        filterBlood: '🩸 Blood Stock',
        filterMedicines: '💊 Drug Safety',
        filterOffline: '⚡ Offline PHC',
        triageTitle: 'AI Symptom Triage',
        triageSub: 'AI Clinical Assessment',
        triageBadge: 'Symptom Triage',
        bedTitle: 'Hospital Bed Availability',
        bedSub: 'Live ICU & General Capacity',
        bedBadge: '10,770 Beds',
        ambTitle: '108 Emergency Ambulance',
        ambSub: 'Live GPS SOS Dispatch',
        ambBadge: 'Instant SOS',
        docTitle: 'Doctor Consult & OPD',
        docSub: '2,523 OMC Specialists',
        docBadge: '2,523 Doctors',
        gpsTitle: 'Nearest Medical GPS',
        gpsSub: 'PHC / CHC / DHH Locator',
        gpsBadge: 'Live Radar',
        bloodTitle: 'Blood Bank (OSBTC)',
        bloodSub: 'Real-Time Blood Stock',
        bloodBadge: '8,420 Units',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'Offline SQLite Gateway',
        phcBadge: 'Zero-Net SQLite',
        ashaTitle: 'ASHA Field Portal',
        ashaSub: 'Maternal & Child Tracking',
        ashaBadge: 'Community Care',
        teleTitle: 'Tele-Consultation OPD',
        teleSub: 'HD Video Consultation',
        teleBadge: 'HD Video Call',
        medTitle: 'Drug Safety & Expiry',
        medSub: 'QR / OCR Safety Scanner',
        medBadge: 'Verified Safe',
        adminTitle: 'State Command Hub',
        adminSub: '30 District Telemetry',
        adminBadge: '30 Districts',
        home: 'Home',
        services: 'Services',
        records: 'My Records',
        profile: 'Profile',
        backToHome: 'Back to Dashboard',
        telemetryBeds: '10,770 Beds',
        telemetryAmbulance: '108 Active',
        telemetryDoctors: '2,523 Online',
        telemetryBlood: '8,420 Units',
        copySuccess: 'ABHA Number Copied!'
      }
    }[appLang] || {};
  }, [appLang]);

  const handleCopyAbha = () => {
    navigator.clipboard?.writeText(abhaNumber.replace(/-/g, ''));
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2500);
  };

  const handleOpenModule = (tabKey, hubKey = 'citizen') => {
    setActiveHub(hubKey);
    setActiveTab(tabKey);
    setSelectedMobileTab(tabKey);
    setMobileSection('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDashboard = () => {
    setSelectedMobileTab(null);
    setMobileSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 12 Health Portals
  const allCards = [
    {
      id: 'intake',
      hub: 'citizen',
      title: t.triageTitle,
      sub: t.triageSub,
      badge: t.triageBadge,
      icon: Activity,
      gradient: 'from-emerald-600 to-teal-700',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderLight: 'border-emerald-300 dark:border-emerald-800',
      textColor: 'text-emerald-900 dark:text-emerald-200',
      badgeBg: 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200',
      category: 'triage'
    },
    {
      id: 'beds',
      hub: 'citizen',
      title: t.bedTitle,
      sub: t.bedSub,
      badge: t.bedBadge,
      icon: Bed,
      gradient: 'from-blue-600 to-indigo-700',
      bgLight: 'bg-blue-50 dark:bg-blue-950/40',
      borderLight: 'border-blue-300 dark:border-blue-800',
      textColor: 'text-blue-900 dark:text-blue-200',
      badgeBg: 'bg-blue-200/80 text-blue-900 dark:bg-blue-900 dark:text-blue-200',
      category: 'beds'
    },
    {
      id: 'ambulance',
      hub: 'citizen',
      title: t.ambTitle,
      sub: t.ambSub,
      badge: t.ambBadge,
      icon: Truck,
      gradient: 'from-rose-600 to-red-700',
      bgLight: 'bg-rose-50 dark:bg-rose-950/40',
      borderLight: 'border-rose-300 dark:border-rose-800',
      textColor: 'text-rose-900 dark:text-rose-200',
      badgeBg: 'bg-rose-200/80 text-rose-900 dark:bg-rose-900 dark:text-rose-200',
      category: 'emergency'
    },
    {
      id: 'doctors',
      hub: 'citizen',
      title: t.docTitle,
      sub: t.docSub,
      badge: t.docBadge,
      icon: Stethoscope,
      gradient: 'from-teal-600 to-cyan-700',
      bgLight: 'bg-teal-50 dark:bg-teal-950/40',
      borderLight: 'border-teal-300 dark:border-teal-800',
      textColor: 'text-teal-900 dark:text-teal-200',
      badgeBg: 'bg-teal-200/80 text-teal-900 dark:bg-teal-900 dark:text-teal-200',
      category: 'doctors'
    },
    {
      id: 'nearest',
      hub: 'citizen',
      title: t.gpsTitle,
      sub: t.gpsSub,
      badge: t.gpsBadge,
      icon: MapPin,
      gradient: 'from-indigo-600 to-purple-700',
      bgLight: 'bg-indigo-50 dark:bg-indigo-950/40',
      borderLight: 'border-indigo-300 dark:border-indigo-800',
      textColor: 'text-indigo-900 dark:text-indigo-200',
      badgeBg: 'bg-indigo-200/80 text-indigo-900 dark:bg-indigo-900 dark:text-indigo-200',
      category: 'nearest'
    },
    {
      id: 'blood',
      hub: 'citizen',
      title: t.bloodTitle,
      sub: t.bloodSub,
      badge: t.bloodBadge,
      icon: Droplet,
      gradient: 'from-red-600 to-rose-700',
      bgLight: 'bg-red-50 dark:bg-red-950/40',
      borderLight: 'border-red-300 dark:border-red-800',
      textColor: 'text-red-900 dark:text-red-200',
      badgeBg: 'bg-red-200/80 text-red-900 dark:bg-red-900 dark:text-red-200',
      category: 'blood'
    },
    {
      id: 'medicines',
      hub: 'citizen',
      title: t.medTitle,
      sub: t.medSub,
      badge: t.medBadge,
      icon: Pill,
      gradient: 'from-amber-600 to-orange-700',
      bgLight: 'bg-amber-50 dark:bg-amber-950/40',
      borderLight: 'border-amber-300 dark:border-amber-800',
      textColor: 'text-amber-900 dark:text-amber-200',
      badgeBg: 'bg-amber-200/80 text-amber-900 dark:bg-amber-900 dark:text-amber-200',
      category: 'medicines'
    },
    {
      id: 'phc_offline',
      hub: 'phc',
      title: t.phcTitle,
      sub: t.phcSub,
      badge: t.phcBadge,
      icon: Zap,
      gradient: 'from-yellow-600 to-amber-700',
      bgLight: 'bg-yellow-50 dark:bg-yellow-950/40',
      borderLight: 'border-yellow-300 dark:border-yellow-800',
      textColor: 'text-yellow-950 dark:text-yellow-200',
      badgeBg: 'bg-yellow-200/80 text-yellow-950 dark:bg-yellow-900 dark:text-yellow-200',
      category: 'offline'
    },
    {
      id: 'asha_portal',
      hub: 'phc',
      title: t.ashaTitle,
      sub: t.ashaSub,
      badge: t.ashaBadge,
      icon: HeartPulse,
      gradient: 'from-emerald-600 to-teal-800',
      bgLight: 'bg-emerald-50 dark:bg-emerald-950/40',
      borderLight: 'border-emerald-300 dark:border-emerald-800',
      textColor: 'text-emerald-900 dark:text-emerald-200',
      badgeBg: 'bg-emerald-200/80 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200',
      category: 'asha'
    },
    {
      id: 'appointments',
      hub: 'citizen',
      title: 'Doctor Bookings',
      sub: 'View Scheduled OPD Tokens',
      badge: 'Active OPD',
      icon: Calendar,
      gradient: 'from-cyan-600 to-blue-700',
      bgLight: 'bg-cyan-50 dark:bg-cyan-950/40',
      borderLight: 'border-cyan-300 dark:border-cyan-800',
      textColor: 'text-cyan-900 dark:text-cyan-200',
      badgeBg: 'bg-cyan-200/80 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-200',
      category: 'records'
    },
    {
      id: 'transfers',
      hub: 'citizen',
      title: 'Hospital Referral Slips',
      sub: 'Tertiary Transfer Certificates',
      badge: 'ABDM Verified',
      icon: FileText,
      gradient: 'from-violet-600 to-purple-700',
      bgLight: 'bg-violet-50 dark:bg-violet-950/40',
      borderLight: 'border-violet-300 dark:border-violet-800',
      textColor: 'text-violet-900 dark:text-violet-200',
      badgeBg: 'bg-violet-200/80 text-violet-900 dark:bg-violet-900 dark:text-violet-200',
      category: 'records'
    },
    {
      id: 'admin',
      hub: 'admin',
      title: t.adminTitle,
      sub: t.adminSub,
      badge: t.adminBadge,
      icon: ShieldCheck,
      gradient: 'from-purple-900 via-indigo-950 to-slate-900',
      bgLight: 'bg-purple-50 dark:bg-purple-950/40',
      borderLight: 'border-purple-300 dark:border-purple-800',
      textColor: 'text-purple-950 dark:text-purple-200',
      badgeBg: 'bg-purple-200/80 text-purple-950 dark:bg-purple-900 dark:text-purple-200',
      category: 'admin',
      showOnlyIfAdmin: true
    }
  ];

  // Active module meta
  const activeModuleMeta = useMemo(() => {
    return allCards.find((c) => c.id === selectedMobileTab) || {
      title: 'Medical Module',
      icon: Activity
    };
  }, [allCards, selectedMobileTab]);

  // Filtered cards for search
  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
      if (card.showOnlyIfAdmin && !isAdmin) return false;
      if (activeFilterPill === 'emergency' && card.category !== 'emergency') return false;
      if (activeFilterPill === 'beds' && card.category !== 'beds') return false;
      if (activeFilterPill === 'doctors' && card.category !== 'doctors') return false;
      if (activeFilterPill === 'blood' && card.category !== 'blood') return false;
      if (activeFilterPill === 'medicines' && card.category !== 'medicines') return false;
      if (activeFilterPill === 'offline' && card.category !== 'offline') return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        card.title.toLowerCase().includes(q) ||
        card.sub.toLowerCase().includes(q) ||
        card.badge.toLowerCase().includes(q)
      );
    });
  }, [allCards, searchQuery, activeFilterPill, isAdmin]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased transition-colors">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. FULL MODULE VIEW (WHEN A FEATURE IS OPEN)                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileSection === 'detail' && selectedMobileTab ? (
        <div className="min-h-screen pb-12">
          {/* Top High-Contrast Sticky App Bar */}
          <div className="sticky top-0 z-50 bg-slate-900 text-white shadow-xl px-3 py-3 border-b border-slate-800">
            <div className="max-w-3xl mx-auto flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleBackToDashboard}
                className="flex items-center gap-1.5 text-xs font-black bg-emerald-700 hover:bg-emerald-600 text-white py-2 px-3 rounded-xl shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>{t.backToHome}</span>
              </button>

              <div className="flex items-center gap-1.5 min-w-0 text-center flex-1 px-1">
                <activeModuleMeta.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-xs sm:text-sm font-black text-white truncate">
                  {activeModuleMeta.title}
                </span>
              </div>

              {/* Right Controls: Language & Instant Sign Out */}
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center gap-0.5 bg-slate-800 p-1 rounded-xl text-[10px] font-black border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setAppLang('or-IN')}
                    className={`px-1.5 py-0.5 rounded-lg ${appLang === 'or-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    ଓଡ଼ିଆ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppLang('en-IN')}
                    className={`px-1.5 py-0.5 rounded-lg ${appLang === 'en-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
                  >
                    EN
                  </button>
                </div>

                {currentUser ? (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden xs:inline">Sign Out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-md active:scale-95 flex items-center gap-1"
                    title="Sign In / Staff Portal"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden xs:inline">Sign In</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Module Body Container */}
          <div className="max-w-4xl mx-auto p-2 sm:p-4 overflow-x-auto">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-2 sm:p-4">
              {renderActiveComponent()}
            </div>
          </div>
        </div>
      ) : mobileSection === 'services' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* 2. SERVICES DIRECTORY (ALL 12 MODULES)                        */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-3.5 sm:p-6 max-w-3xl mx-auto space-y-4 pb-28 animate-fadeIn">
          <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-2 border border-emerald-800/60">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-400/30">
                SwasthyaMitra Healthcare Suite
              </span>
              <span className="text-xs text-emerald-200 font-mono font-bold">12 Active Services</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{t.services}</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Instant access to all clinical triage tools, emergency dispatch, hospital bed counters, and offline rural systems.
            </p>
          </div>

          {/* 2-Column Responsive Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {allCards.map((card) => {
              const IconComp = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleOpenModule(card.id, card.hub)}
                  className={`p-4 rounded-3xl ${card.bgLight} border-2 ${card.borderLight} shadow-sm flex flex-col items-center text-center space-y-2.5 active:scale-[0.96] hover:shadow-md transition-all cursor-pointer`}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md`}
                  >
                    <IconComp className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                      {card.title}
                    </h3>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{card.sub}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${card.badgeBg}`}>
                    {card.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ) : mobileSection === 'records' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* 3. MY RECORDS & ABDM CLINICAL LOGS                            */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-3.5 sm:p-6 max-w-3xl mx-auto space-y-4 pb-28 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>{t.records}</span>
              </h2>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-3 py-1 rounded-full border border-emerald-400">
                ABDM ENCRYPTED
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Your synced medical records, digital prescriptions, tele-OPD bookings, and hospital referral memos.
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-950 dark:text-emerald-200 space-y-1.5">
              <div className="flex items-center gap-2 font-black text-sm text-emerald-900 dark:text-emerald-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>Ayushman Bharat Unified Health Interface (UHI) Synced</span>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-300">
                Encrypted with 256-bit DPDP consent protocol. Linked to ABHA: <strong>{abhaNumber}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOpenModule('appointments', 'citizen')}
              className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-blue-500"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200">
                  <Calendar className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Scheduled Doctor Consultations
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    View upcoming appointment token numbers and OPD queue
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('transfers', 'citizen')}
              className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-purple-500"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-2xl bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200">
                  <FileText className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Hospital Referral & Transfer Slips
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Verified inter-hospital clinical transfer certificates
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('intake', 'citizen')}
              className="w-full p-4 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer hover:border-emerald-500"
            >
              <div className="flex items-center gap-3.5">
                <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                  <Activity className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-black text-slate-900 dark:text-white">
                    Past AI Triage Assessments
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Voice symptom records, risk categories, and doctor notes
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      ) : mobileSection === 'profile' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* 4. PROFILE, LANGUAGE & THEME PREFERENCES                     */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-3.5 sm:p-6 max-w-3xl mx-auto space-y-4 pb-28 animate-fadeIn">
          {/* User Info */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-700 via-teal-600 to-cyan-600 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                {patientName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg truncate">
                    {patientName}
                  </h3>
                  <span className="shrink-0 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ABDM Verified</span>
                  </span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 mt-1">
                  ABHA: {abhaNumber}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  📍 {patientFacility}
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Language Preference (ଭାଷା ଚୟନ)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setAppLang('or-IN')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                  appLang === 'or-IN'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                type="button"
                onClick={() => setAppLang('hi-IN')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                  appLang === 'hi-IN'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLang('en-IN')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all cursor-pointer ${
                  appLang === 'en-IN'
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400/40'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-100'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Theme Mode Selection */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Color Theme (ରଙ୍ଗ ଥିମ୍)
            </span>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-emerald-700 text-white border-emerald-600 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('reading')}
                className={`py-3 rounded-2xl text-xs sm:text-sm font-black border-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  themeMode === 'reading'
                    ? 'bg-amber-800 text-white border-amber-800 shadow-md'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Sepia</span>
              </button>
            </div>
          </div>

          {/* Quick Switch Staff Role / Persona */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
                Instant Role Switch (Live Demo)
              </span>
              <button
                type="button"
                onClick={onOpenAuth}
                className="text-xs font-black text-emerald-600 dark:text-emerald-400 underline cursor-pointer"
              >
                Full Staff Login →
              </button>
            </div>
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Open Staff Portal & Switch Roles</span>
            </button>
          </div>

          {/* Authentication */}
          <div className="pt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 text-rose-800 dark:text-rose-300 hover:bg-rose-100 font-black text-xs sm:text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* 5. MAIN MOBILE & TABLET DASHBOARD                            */
        /* ───────────────────────────────────────────────────────────── */
        <div className="space-y-4 pb-28 animate-fadeIn max-w-3xl mx-auto">
          {/* TOP HEALTH BRAND & ABHA CARD */}
          <div className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-teal-950 text-white px-4 sm:px-6 pt-5 pb-6 rounded-b-[2.5rem] sm:rounded-b-[3rem] shadow-2xl space-y-4 border-b border-emerald-800/60">
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner text-white font-black text-lg">
                  🏥
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-black tracking-tight leading-tight flex items-center gap-2">
                    <span>{t.brandTitle}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h1>
                  <p className="text-xs text-emerald-300 font-bold">{t.brandSubtitle}</p>
                </div>
              </div>

              {/* Language Switcher & Quick Sign Out */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 bg-emerald-950 p-1 rounded-xl text-xs font-black border border-emerald-700">
                  <button
                    type="button"
                    onClick={() => setAppLang('or-IN')}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      appLang === 'or-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200'
                    }`}
                  >
                    ଓଡ଼ିଆ
                  </button>
                  <button
                    type="button"
                    onClick={() => setAppLang('en-IN')}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      appLang === 'en-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200'
                    }`}
                  >
                    EN
                  </button>
                </div>

                {currentUser && currentUser.roleCategory !== 'patient' && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2 py-1 rounded-xl text-[10px] font-black shadow-md cursor-pointer active:scale-95"
                    title="Sign Out of Session"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>OUT</span>
                  </button>
                )}
              </div>
            </div>

            {/* AYUSHMAN BHARAT ABHA HEALTH ID CARD */}
            <div className="bg-gradient-to-tr from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-emerald-400/50 shadow-2xl space-y-3.5">
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-6 rounded-md bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-600 border border-amber-200 shadow-sm flex items-center justify-center">
                    <span className="text-[8px] font-black text-amber-950 font-mono">CHIP</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 font-mono">
                    NATIONAL HEALTH AUTHORITY
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/30 px-2.5 py-0.5 rounded-full border border-emerald-400/50">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-[9px] font-black text-emerald-200 uppercase tracking-wider">VERIFIED ABDM</span>
                </div>
              </div>

              {/* Patient Name & ABHA Number */}
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  {t.abhaCardTitle}
                </div>
                <div className="text-base sm:text-lg font-black text-white tracking-wide">
                  {patientName}
                </div>
                <div className="flex items-center gap-2 flex-wrap pt-0.5">
                  <button
                    type="button"
                    onClick={handleCopyAbha}
                    className="flex items-center gap-1.5 text-xs font-mono font-black text-emerald-300 bg-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-700/60 hover:text-white transition-all cursor-pointer"
                  >
                    <span>{abhaNumber}</span>
                    <Copy className="w-3.5 h-3.5 text-emerald-400" />
                    {copiedAbha && (
                      <span className="text-[10px] text-emerald-200 font-sans font-bold animate-fadeIn">
                        ✓ Copied
                      </span>
                    )}
                  </button>
                  <span className="text-xs text-emerald-300 font-bold truncate">📍 {patientFacility}</span>
                </div>
              </div>

              {/* Action Buttons: Zoom QR & Emergency 108 */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowQrModal(true)}
                  className="py-2.5 px-3 rounded-2xl bg-white text-slate-900 font-black text-xs flex items-center justify-center gap-2 shadow-md hover:bg-slate-100 active:scale-95 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-slate-900" />
                  <span>View QR Code</span>
                </button>

                <a
                  href="tel:108"
                  className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/60 active:scale-95 transition-all border border-rose-400 cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-white animate-bounce" />
                  <span>EMERGENCY 108</span>
                </a>
              </div>
            </div>
          </div>

          {/* STATE TELEMETRY 4-METRIC PULSE CARDS */}
          <div className="px-4 sm:px-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border-2 border-emerald-200 dark:border-emerald-800 shadow-xs">
                <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400">10,770</div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">Vacant Beds</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border-2 border-rose-200 dark:border-rose-800 shadow-xs">
                <div className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">108 Fleet</div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">GPS Active</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border-2 border-blue-200 dark:border-blue-800 shadow-xs">
                <div className="text-base sm:text-lg font-black text-blue-700 dark:text-blue-400">2,523</div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">Doctors Online</div>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 border-2 border-red-200 dark:border-red-800 shadow-xs">
                <div className="text-base sm:text-lg font-black text-red-600 dark:text-red-400">8,420 Units</div>
                <div className="text-[11px] font-bold text-slate-600 dark:text-slate-400 mt-0.5">Blood Stock</div>
              </div>
            </div>
          </div>

          {/* SEARCH & CATEGORY PILLS */}
          <div className="px-4 sm:px-6 space-y-2.5">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-xs sm:text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveFilterPill('all')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'all'
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterAll}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('emergency')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'emergency'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterEmergency}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('beds')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'beds'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterBeds}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('doctors')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'doctors'
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterDoctors}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('blood')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'blood'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterBlood}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('medicines')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'medicines'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterMedicines}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilterPill('offline')}
                className={`px-3.5 py-2 rounded-xl font-black whitespace-nowrap transition-all cursor-pointer ${
                  activeFilterPill === 'offline'
                    ? 'bg-yellow-700 text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-800'
                }`}
              >
                {t.filterOffline}
              </button>
            </div>
          </div>

          {/* PUBLIC HEALTH HEATWAVE ALERT */}
          <div className="px-4 sm:px-6">
            <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-800/80 rounded-3xl p-4 text-amber-950 dark:text-amber-200 shadow-xs space-y-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 text-xs sm:text-sm font-bold leading-snug">
                  {t.healthAlertTitle}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200 dark:border-amber-900 text-xs">
                <span className="text-amber-800 dark:text-amber-300 font-bold">Odisha Public Health Cell</span>
                <button
                  type="button"
                  onClick={() => setShowAdvisoryDetail(true)}
                  className="font-black text-amber-900 dark:text-amber-200 underline uppercase cursor-pointer"
                >
                  {t.viewDetails} →
                </button>
              </div>
            </div>
          </div>

          {/* 2-COLUMN ACTION PORTALS */}
          <div className="px-4 sm:px-6 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Instant Healthcare Portals
              </h2>
              <span className="text-xs text-slate-500 font-mono font-bold">
                {filteredCards.length} Portals Ready
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4">
              {filteredCards.map((card) => {
                const IconComp = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleOpenModule(card.id, card.hub)}
                    className={`p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center space-y-2.5 active:scale-[0.96] hover:shadow-lg hover:border-emerald-500 transition-all cursor-pointer group`}
                  >
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${card.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <IconComp className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                        {card.sub}
                      </p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING DOCK (ONLY ON HOME/SERVICES/RECORDS/PROFILE TABS)    */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileSection !== 'detail' && (
        <div className="fixed bottom-3 left-3 right-3 sm:left-1/2 sm:-translate-x-1/2 sm:max-w-md z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl p-2 flex items-center justify-around">
          <button
            type="button"
            onClick={() => {
              setSelectedMobileTab(null);
              setMobileSection('home');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              mobileSection === 'home'
                ? 'text-emerald-700 dark:text-emerald-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                mobileSection === 'home'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-transparent'
              }`}
            >
              <Activity className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-black">{t.home}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMobileTab(null);
              setMobileSection('services');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              mobileSection === 'services'
                ? 'text-emerald-700 dark:text-emerald-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                mobileSection === 'services'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-transparent'
              }`}
            >
              <Sparkles className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-black">{t.services}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMobileTab(null);
              setMobileSection('records');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              mobileSection === 'records'
                ? 'text-emerald-700 dark:text-emerald-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                mobileSection === 'records'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-transparent'
              }`}
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-black">{t.records}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedMobileTab(null);
              setMobileSection('profile');
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
              mobileSection === 'profile'
                ? 'text-emerald-700 dark:text-emerald-400 font-black'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
            }`}
          >
            <div
              className={`p-2 rounded-xl ${
                mobileSection === 'profile'
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                  : 'bg-transparent'
              }`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-[11px] font-black">{t.profile}</span>
          </button>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ABHA QR CODE MODAL                                            */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border-2 border-slate-300 dark:border-slate-800 text-center">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-emerald-600 tracking-wider">
                ABDM Digital Check-in QR
              </span>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 bg-white rounded-2xl border-2 border-slate-800 inline-block shadow-inner mx-auto">
              <QrCode className="w-48 h-48 text-slate-950" />
            </div>

            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">{patientName}</h3>
              <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                ABHA: {abhaNumber}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Scan this QR code at any hospital or PHC counter for instant OPD slip generation.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="w-full py-3.5 rounded-2xl bg-slate-900 dark:bg-emerald-600 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              Done / Close
            </button>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PUBLIC HEALTH ADVISORY MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAdvisoryDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 space-y-4 border-2 border-amber-400 dark:border-amber-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-base">
                <AlertTriangle className="w-5 h-5" />
                <span>Odisha Public Health Advisory</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisoryDetail(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-bold text-slate-900 dark:text-white">
                Severe Heatwave Orange Alert — Department of Health & Family Welfare, Govt. of Odisha:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>Temperatures forecasted to exceed 43°C in interior districts (Sambalpur, Bolangir, Jharsuguda, Kalahandi).</li>
                <li>24x7 dedicated Heat Stroke Treatment Wards (Cooling Bays) activated at all DHH, SDH, CHC, and PHC facilities.</li>
                <li>Free ORS & Jal Seva Kendra points functional at all ASHA village hubs.</li>
                <li>Avoid direct sun exposure between 11:00 AM and 03:30 PM.</li>
                <li>Dial <strong>108</strong> for emergency ambulance or <strong>104</strong> for 24x7 doctor advisory.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvisoryDetail(false)}
              className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs sm:text-sm cursor-pointer shadow-md"
            >
              Understood / Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
