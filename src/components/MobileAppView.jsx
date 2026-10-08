import React, { useState, useMemo, useEffect } from 'react';
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
  Search,
  Copy,
  HeartPulse,
  Database,
  Layers,
  Bell,
  Check,
  Globe,
  Radio,
  Clock,
  ExternalLink,
  Monitor,
  Smartphone,
  Video,
  ShoppingBag
} from 'lucide-react';
import TeleConsultationSuite from './TeleConsultationSuite';

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
  renderActiveComponent,
  onSwitchToDesktop
}) {
  const [mobileSection, setMobileSection] = useState('home'); // 'home' | 'services' | 'records' | 'profile' | 'detail'
  const [showAdvisoryDetail, setShowAdvisoryDetail] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [copiedAbha, setCopiedAbha] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMobileTab, setSelectedMobileTab] = useState(null);
  const [showMobileTeleModal, setShowMobileTeleModal] = useState(false);

  useEffect(() => {
    setMobileSection('home');
    setSelectedMobileTab(null);
  }, [currentUser?.id]);

  const abhaNumber = currentUser?.staffId || '91-1234-5678-9012';
  const patientName = currentUser?.name || 'Ravi Kumar';
  const patientFacility = currentUser?.facility || 'Capital Hospital, Bhubaneswar';
  const patientAge = currentUser?.age || 42;
  const patientGender = currentUser?.gender || 'Male';
  const patientDob = '10/10/1982';

  // Multilingual translations
  const t = useMemo(() => {
    return {
      'or-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        odishaGov: 'ଓଡ଼ିଶା ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ',
        abhaCardTitle: 'ABHA Digital Health ID',
        emergency108: '108 EMERGENCY SOS',
        healthAlertTitle: 'PUBLIC HEALTH ALERT: Dengue & Heatwave Prevention Protocols Active in Odisha. Report Symptoms Immediately.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, beds, ambulance, blood...',
        triageTitle: 'AI Symptom Voice Triage',
        triageSub: 'Multilingual Voice & Triage Note',
        bedTitle: 'Hospital Bed Tracker',
        bedSub: '10,770 Live ICU & General Beds',
        ambTitle: 'GPS 108 Ambulance Dispatch',
        ambSub: 'Instant GPS Emergency SOS',
        docTitle: 'Doctor Video Consultation',
        docSub: '2,523 OMC Verified Specialists',
        rxTitle: 'Digital Prescription Slips',
        rxSub: 'NMC Digital Rx & Referral Slips',
        gpsTitle: 'Nearest Hospital GPS',
        gpsSub: 'PHC, CHC & DHH Navigator',
        bloodTitle: 'Blood Bank Network',
        bloodSub: '8,420 OSBTC Blood Units',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'OCR & Drug Interaction Guard',
        marketTitle: 'ଔଷଧ ବଜାର ଓ ଜନଔଷଧି',
        marketSub: '୨୮+ ଔଷଧ ଓ କଟା ଷ୍ଟ୍ରିପ୍ QR',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'Zero-Internet Rural Clinic DB',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'Maternal & Child Health Surveys',
        adminTitle: 'State Command Hub',
        adminSub: '30-District Health Governance',
        teleconsultTitle: 'ଭିଡିଓ ଟେଲିକନସଲଟେସନ୍',
        teleconsultSub: 'ଲାଇଭ୍ WebRTC ଭିଡିଓ କଲ୍ ଓ ଡିଜିଟାଲ୍ Rx',
        teleconsultNav: 'ଭିଡିଓ OPD',
        home: 'Home',
        services: 'Services',
        records: 'Health Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!'
      },
      'hi-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        odishaGov: 'ओडिशा डिजिटल हेल्थ मिशन',
        abhaCardTitle: 'ABHA Digital Health ID',
        emergency108: '108 EMERGENCY SOS',
        healthAlertTitle: 'PUBLIC HEALTH ALERT: ओडिशा में डेंगू व लू से बचाव निर्देश जारी। लक्षण दिखने पर तुरंत जांच करें।',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, beds, ambulance, blood...',
        triageTitle: 'AI Symptom Voice Triage',
        triageSub: 'AI लक्षण जांच एवं वॉइस इनपुट',
        bedTitle: 'Hospital Bed Tracker',
        bedSub: 'लाइव ICU व जनरल बेड उपलब्धता',
        ambTitle: 'GPS 108 Ambulance Dispatch',
        ambSub: 'आपातकालीन 108 एम्बुलेंस जीपीएस',
        docTitle: 'Doctor Video Consultation',
        docSub: '2,523 OMC विशेषज्ञ डॉक्टर',
        rxTitle: 'Digital Prescription Slips',
        rxSub: 'डिजिटल प्रिस्क्रिप्शन व रेफरल पर्ची',
        gpsTitle: 'Nearest Hospital GPS',
        gpsSub: 'निकटतम PHC / CHC अस्पताल मैप',
        bloodTitle: 'Blood Bank Network',
        bloodSub: 'OSBTC रियल-टाइम रक्त भंडार',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'दवा सुरक्षा व एक्सपायरी स्कैनर',
        marketTitle: 'दवा बाज़ार एवं जन औषधि',
        marketSub: '28+ दवाएं व कटी स्ट्रिप QR',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'जीरो इंटरनेट ग्रामीण डाटा सिंक',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'मातृ एवं शिशु स्वास्थ्य सर्वेक्षण',
        adminTitle: 'State Command Hub',
        adminSub: '30 जिला कमान एवं टेलीमेट्री',
        teleconsultTitle: 'लाइव वीडियो टेलीपरामर्श',
        teleconsultSub: 'WebRTC वीडियो कॉल एवं डिजिटल पर्ची',
        teleconsultNav: 'वीडियो OPD',
        home: 'Home',
        services: 'Services',
        records: 'Health Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!'
      },
      'en-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        odishaGov: 'ODISHA DIGITAL HEALTH MISSION',
        abhaCardTitle: 'ABHA Digital Health ID',
        emergency108: '108 EMERGENCY SOS',
        healthAlertTitle: 'PUBLIC HEALTH ALERT: Dengue Prevention Protocols Active in Bhubaneswar. Report Symptoms Immediately.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, beds, ambulance, blood...',
        triageTitle: 'AI Symptom Voice Triage',
        triageSub: 'Multilingual Voice & Triage Note',
        bedTitle: 'Hospital Bed Tracker',
        bedSub: '10,770 Live ICU & General Beds',
        ambTitle: 'GPS 108 Ambulance Dispatch',
        ambSub: 'Instant GPS Emergency SOS',
        docTitle: 'Doctor Video Consultation',
        docSub: '2,523 OMC Verified Specialists',
        rxTitle: 'Digital Prescription Slips',
        rxSub: 'NMC Digital Rx & Referral Slips',
        gpsTitle: 'Nearest Hospital GPS',
        gpsSub: 'PHC, CHC & DHH Navigator',
        bloodTitle: 'Blood Bank Network',
        bloodSub: '8,420 OSBTC Blood Units',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'OCR & Drug Interaction Guard',
        marketTitle: 'Medicine Market & Jan Aushadhi',
        marketSub: '28+ Medicines & Cut Strip QR',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'Zero-Internet Rural Clinic DB',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'Maternal & Child Health Surveys',
        adminTitle: 'State Command Hub',
        adminSub: '30-District Health Governance',
        teleconsultTitle: 'Live Video Teleconsult',
        teleconsultSub: 'In-App WebRTC Video & AI SOAP Scribe',
        teleconsultNav: 'Video OPD',
        home: 'Home',
        services: 'Services',
        records: 'Health Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!'
      }
    }[appLang] || {};
  }, [appLang]);

  // Copy ABHA handler
  const handleCopyAbha = () => {
    navigator.clipboard?.writeText(abhaNumber);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  // Action Portal Cards (Matching the 2-Column Mockup 1 & 2)
  const actionCards = useMemo(() => [
    {
      id: 'intake',
      hub: 'citizen',
      title: t.triageTitle,
      icon: Activity,
      iconBg: 'bg-rose-50 text-rose-500 border border-rose-200',
      tag: 'AI Mic'
    },
    {
      id: 'beds',
      hub: 'citizen',
      title: t.bedTitle,
      icon: Bed,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      tag: 'Live Beds'
    },
    {
      id: 'ambulance',
      hub: 'citizen',
      title: t.ambTitle,
      icon: Truck,
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
      tag: '108 SOS'
    },
    {
      id: 'doctors',
      hub: 'citizen',
      title: t.docTitle,
      icon: Stethoscope,
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
      tag: 'OPD Directory'
    },
    {
      id: 'teleconsult',
      hub: 'citizen',
      title: t.teleconsultTitle,
      icon: Video,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      tag: 'Live WebRTC'
    },
    {
      id: 'prescriptions',
      hub: 'doctor',
      title: t.rxTitle,
      icon: FileText,
      iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
      tag: 'NMC Rx'
    },
    {
      id: 'nearest',
      hub: 'citizen',
      title: t.gpsTitle,
      icon: MapPin,
      iconBg: 'bg-sky-50 text-sky-600 border border-sky-200',
      tag: 'GPS Map'
    },
    {
      id: 'blood',
      hub: 'citizen',
      title: t.bloodTitle,
      icon: Droplet,
      iconBg: 'bg-red-50 text-red-600 border border-red-200',
      tag: 'OSBTC Stock'
    },
    {
      id: 'medicines',
      hub: 'citizen',
      title: t.medTitle,
      icon: Pill,
      iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
      tag: 'OCR Safe'
    },
    {
      id: 'market',
      hub: 'citizen',
      title: t.marketTitle,
      icon: ShoppingBag,
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
      tag: '28+ Meds'
    },
    {
      id: 'phc_offline',
      hub: 'asha',
      title: t.phcTitle,
      icon: Database,
      iconBg: 'bg-teal-50 text-teal-600 border border-teal-200',
      tag: 'Offline'
    },
    {
      id: 'asha_field',
      hub: 'asha',
      title: t.ashaTitle,
      icon: HeartPulse,
      iconBg: 'bg-pink-50 text-pink-600 border border-pink-200',
      tag: 'Field'
    },
    {
      id: 'admin',
      hub: 'admin',
      title: t.adminTitle,
      icon: Layers,
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-300',
      tag: 'Command'
    }
  ], [t]);

  // Open a specific module in full screen mobile detail
  const handleOpenModule = (tabKey, hubKey) => {
    if (hubKey) setActiveHub(hubKey);
    setActiveTab(tabKey);
    setSelectedMobileTab(tabKey);
    setMobileSection('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedMobileTab(null);
    setMobileSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Cards based on search
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return actionCards;
    const q = searchQuery.toLowerCase();
    return actionCards.filter(
      (c) => c.title.toLowerCase().includes(q)
    );
  }, [actionCards, searchQuery]);

  return (
    <div className="min-h-screen bg-[#e2e8f0] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white antialiased py-0 sm:py-6">
      {/* 📱 Authentic Smartphone Container (Max 430px) */}
      <div className="w-full max-w-[430px] bg-[#f8fafc] dark:bg-slate-900 min-h-screen sm:min-h-[860px] sm:rounded-[40px] shadow-2xl relative flex flex-col pb-24 overflow-hidden border-x sm:border border-slate-300/80 dark:border-slate-800">

        {/* ───────────────────────────────────────────────────────────── */}
        {/* DETAIL VIEW: WHEN A MODULE IS OPEN (AI Triage, Beds, GPS...)  */}
        {/* ───────────────────────────────────────────────────────────── */}
        {mobileSection === 'detail' && selectedMobileTab ? (
          <div className="flex-1 flex flex-col">
            {/* Top Clean App Bar */}
            <div className="sticky top-0 z-50 bg-[#065f46] text-white px-3.5 py-3 shadow-md flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={handleBackToHome}
                className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.backToHome}</span>
              </button>

              <div className="font-bold text-xs sm:text-sm text-white truncate text-center flex-1">
                {actionCards.find((c) => c.id === selectedMobileTab)?.title || 'Health Module'}
              </div>

              {/* Language Pill */}
              <div className="flex items-center bg-black/25 rounded-full p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`px-2 py-0.5 rounded-full ${appLang === 'or-IN' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200'}`}
                >
                  ଓଡ଼ିଆ
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('en-IN')}
                  className={`px-2 py-0.5 rounded-full ${appLang === 'en-IN' ? 'bg-white text-emerald-950 shadow-xs' : 'text-emerald-200'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* Active Component Container */}
            <div className="p-3 sm:p-4 flex-1 overflow-y-auto">
              {renderActiveComponent()}
            </div>
          </div>
        ) : mobileSection === 'services' ? (
          /* ───────────────────────────────────────────────────────────── */
          /* SERVICES TAB: ALL 11 HEALTHCARE SERVICES                      */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col p-4 space-y-4 animate-fadeIn">
            <div className="pt-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Healthcare Services</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">All available Odisha ABDM clinical modules</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {actionCards.map((card) => {
                const IconComp = card.icon;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => handleOpenModule(card.id, card.hub)}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all cursor-pointer hover:border-emerald-500"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{card.title}</h3>
                      <span className="inline-block mt-1 text-[9px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                        {card.tag}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : mobileSection === 'records' ? (
          /* ───────────────────────────────────────────────────────────── */
          /* MY RECORDS TAB: ABDM RECORDS & APPOINTMENTS                  */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col p-4 space-y-4 animate-fadeIn">
            <div className="pt-2 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Health Records</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ayushman Bharat Digital Health Vault</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300">
                ABDM 256-BIT
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Linked ABHA: {abhaNumber}</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                Your hospital visits, diagnostic prescriptions, and triage history are securely synced with the Odisha Health Network.
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOpenModule('doctors', 'citizen')}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 flex items-center justify-center">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Doctor Consultations</div>
                    <div className="text-[10px] text-slate-500">Upcoming OPD tokens & video call history</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenModule('intake', 'citizen')}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Past AI Triage Assessments</div>
                    <div className="text-[10px] text-slate-500">Voice symptom records & emergency triage logs</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => handleOpenModule('prescriptions', 'doctor')}
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Hospital Referral Slips</div>
                    <div className="text-[10px] text-slate-500">Official inter-hospital clinical transfer memos</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        ) : mobileSection === 'profile' ? (
          /* ───────────────────────────────────────────────────────────── */
          /* PROFILE TAB: USER DETAILS & THEME/LANGUAGE CONTROLS           */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col p-4 space-y-4 animate-fadeIn">
            <div className="pt-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile & Preferences</h2>
            </div>

            {/* Profile Avatar Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-800 text-white shadow-md flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-black border border-white/30">
                {patientName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm truncate">{patientName}</h3>
                <div className="text-xs text-emerald-200 font-mono mt-0.5">{abhaNumber}</div>
                <div className="text-[11px] text-emerald-300 truncate mt-0.5">📍 {patientFacility}</div>
              </div>
            </div>

            {/* Language Switcher */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Language Preference (ଭାଷା ଚୟନ)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    appLang === 'or-IN'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  ଓଡ଼ିଆ
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('hi-IN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    appLang === 'hi-IN'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('en-IN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    appLang === 'en-IN'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme Mode */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Color Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('dark')}
                  className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'dark'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-purple-400" />
                  <span>Dark</span>
                </button>
                <button
                  type="button"
                  onClick={() => setThemeMode('reading')}
                  className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'reading'
                      ? 'bg-amber-800 text-white border-amber-800 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                  <span>Sepia</span>
                </button>
              </div>
            </div>

            {/* Switch User / Role Portal */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Switch User / Staff Portal</span>
            </button>

            {onSwitchToDesktop && (
              <button
                type="button"
                onClick={onSwitchToDesktop}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>Switch to Desktop Multi-Hub View</span>
              </button>
            )}

            {currentUser?.isGuest ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer animate-pulse"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Create Account (ଲଗ୍-ଇନ୍ / ଖାତା ଖୋଲନ୍ତୁ)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            )}
          </div>
        ) : (
          /* ───────────────────────────────────────────────────────────── */
          /* HOME SCREEN (PIXEL-PERFECT MATCH TO MOCKUP 1 & 2)             */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col space-y-3 animate-fadeIn">
            {/* 1. NATIVE STATUS & BRAND HEADER (EMERALD GREEN) */}
            <div className="bg-[#065f46] text-white px-4 pt-3.5 pb-4 shadow-sm">
              {/* Top System Bar */}
              <div className="flex items-center justify-between text-[11px] font-mono text-emerald-100/90 pb-2">
                <span>10:09</span>
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-emerald-300" />
                  <span className="font-bold">5G</span>
                  <div className="w-4 h-2 border border-emerald-300 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-300 rounded-2xs" />
                  </div>
                </div>
              </div>

              {/* App Brand & Header */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center text-base shadow-inner">
                    🏥
                  </div>
                  <div>
                    <h1 className="text-sm font-black tracking-tight leading-tight">{t.brandTitle}</h1>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Language Toggle */}
                  <div className="flex items-center bg-black/25 rounded-full p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAppLang('or-IN')}
                      className={`px-2 py-0.5 rounded-full transition-all ${appLang === 'or-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200'}`}
                    >
                      ଓଡ଼ିଆ
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppLang('en-IN')}
                      className={`px-2 py-0.5 rounded-full transition-all ${appLang === 'en-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200'}`}
                    >
                      EN
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMobileSection('profile')}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  >
                    <User className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowAdvisoryDetail(true)}
                    className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-white relative"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 absolute top-0.5 right-0.5 animate-ping" />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. AUTHENTIC ABHA DIGITAL HEALTH ID CARD (WHITE EMBOSSED HERO) */}
            <div className="px-3.5 -mt-1">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-md space-y-3 relative overflow-hidden">
                {/* Top Mission Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center text-[10px] font-bold">
                      🏛️
                    </div>
                    <div>
                      <div className="text-[10px] font-black tracking-wide text-slate-800 dark:text-slate-200 uppercase">
                        {t.odishaGov}
                      </div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400">
                        {t.abhaCardTitle}
                      </div>
                    </div>
                  </div>

                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold border border-amber-300">
                    🌿
                  </div>
                </div>

                {/* Patient Information & QR Code */}
                <div className="flex items-center gap-3">
                  {/* Photo Avatar */}
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 p-0.5 shadow-xs shrink-0 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600">
                    <div className="w-full h-full rounded-[10px] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-lg">
                      👤
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-slate-900 dark:text-white truncate">
                      {patientName}
                    </div>
                    <div className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                      <span>ABHA: {abhaNumber}</span>
                      <button
                        type="button"
                        onClick={handleCopyAbha}
                        className="hover:text-emerald-900 dark:hover:text-emerald-200 cursor-pointer"
                        title="Copy ABHA Number"
                      >
                        {copiedAbha ? <Check className="w-2.5 h-2.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 text-slate-400" />}
                      </button>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      DOB: {patientDob} • {patientGender}
                    </div>
                  </div>

                  {/* Scannable QR Code */}
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600 shadow-2xs hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                    title="Tap to zoom QR"
                  >
                    <QrCode className="w-11 h-11 text-slate-900 dark:text-white" />
                  </button>
                </div>

                {/* 🚨 Emergency 108 SOS & Live Video Teleconsultation Grid */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <a
                    href="tel:108"
                    className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/20 active:scale-98 transition-all cursor-pointer border border-rose-400/60"
                  >
                    <Phone className="w-3.5 h-3.5 text-white animate-bounce shrink-0" />
                    <span className="tracking-wide truncate">{t.emergency108}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenModule('teleconsult', 'citizen')}
                    className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 text-white font-black text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/20 active:scale-98 transition-all cursor-pointer border border-purple-400/60"
                  >
                    <Video className="w-3.5 h-3.5 text-white animate-pulse shrink-0" />
                    <span className="tracking-wide truncate">{t.teleconsultTitle}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3. PUBLIC HEALTH ALERT BANNER (AMBER ROUNDED CARD) */}
            <div className="px-3.5">
              <div className="bg-[#fef3c7] dark:bg-amber-950/40 border border-[#fde68a] dark:border-amber-800 rounded-2xl p-3 text-[#92400e] dark:text-amber-200 shadow-2xs space-y-1">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#d97706] shrink-0 mt-0.5" />
                  <div className="flex-1 text-[11px] font-bold leading-tight">
                    {t.healthAlertTitle}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAdvisoryDetail(true)}
                    className="p-0.5 text-amber-700 dark:text-amber-300 hover:text-amber-900 cursor-pointer shrink-0"
                    title="Information"
                  >
                    ⓘ
                  </button>
                </div>
              </div>
            </div>

            {/* 4. SEARCH BAR */}
            <div className="px-3.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 5. CLEAN 2-COLUMN ACTION TILES (MATCHING MOCKUP 1 & 2) */}
            <div className="px-3.5 pb-2">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredCards.map((card) => {
                  const IconComp = card.icon;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleOpenModule(card.id, card.hub)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex items-center gap-3 active:scale-95 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer text-left"
                    >
                      <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center shadow-2xs shrink-0`}>
                        <IconComp className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {card.title}
                        </h3>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 6. FLOATING ISLAND BOTTOM NAVIGATION BAR (MATCHING MOCKUP 1)  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="fixed bottom-3 left-4 right-4 max-w-[398px] mx-auto z-40">
          <nav className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around">
            {/* 1. Home */}
            <button
              type="button"
              onClick={() => {
                setMobileSection('home');
                setSelectedMobileTab(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                mobileSection === 'home' && !selectedMobileTab
                  ? 'text-[#065f46] dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${mobileSection === 'home' && !selectedMobileTab ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shadow-2xs' : 'bg-transparent'}`}>
                <Activity className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold">{t.home}</span>
            </button>

            {/* 2. Services */}
            <button
              type="button"
              onClick={() => {
                setMobileSection('services');
                setSelectedMobileTab(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                mobileSection === 'services'
                  ? 'text-[#065f46] dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${mobileSection === 'services' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shadow-2xs' : 'bg-transparent'}`}>
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold">{t.services}</span>
            </button>

            {/* 3. Live Video Tele-OPD (WebRTC) */}
            <button
              type="button"
              onClick={() => handleOpenModule('teleconsult', 'citizen')}
              className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-2xl transition-all cursor-pointer ${
                selectedMobileTab === 'teleconsult'
                  ? 'text-purple-600 dark:text-purple-400 font-bold'
                  : 'text-slate-500 hover:text-purple-600 dark:hover:text-purple-300'
              }`}
            >
              <div className={`p-1.5 rounded-xl relative ${selectedMobileTab === 'teleconsult' ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 shadow-2xs' : 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400'}`}>
                <Video className="w-5 h-5 stroke-[2.2]" />
                <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-1 right-1 animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300">{t.teleconsultNav}</span>
            </button>

            {/* 4. Health Records */}
            <button
              type="button"
              onClick={() => {
                setMobileSection('records');
                setSelectedMobileTab(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                mobileSection === 'records'
                  ? 'text-[#065f46] dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${mobileSection === 'records' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shadow-2xs' : 'bg-transparent'}`}>
                <FileText className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold">{t.records}</span>
            </button>

            {/* 4. Profile */}
            <button
              type="button"
              onClick={() => {
                setMobileSection('profile');
                setSelectedMobileTab(null);
              }}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                mobileSection === 'profile'
                  ? 'text-[#065f46] dark:text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${mobileSection === 'profile' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 shadow-2xs' : 'bg-transparent'}`}>
                <User className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[10px] font-bold">{t.profile}</span>
            </button>
          </nav>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* QR MODAL DIALOG                                               */}
        {/* ───────────────────────────────────────────────────────────── */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 text-center">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="font-bold text-sm text-slate-900 dark:text-white">ABHA Digital QR</span>
                <button
                  type="button"
                  onClick={() => setShowQrModal(false)}
                  className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 inline-block shadow-inner">
                <QrCode className="w-44 h-44 text-slate-900 mx-auto" />
              </div>

              <div>
                <div className="font-bold text-sm text-slate-900 dark:text-white">{patientName}</div>
                <div className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">{abhaNumber}</div>
                <p className="text-[11px] text-slate-500 mt-2">Scan at any PHC, CHC, or DHH OPD counter for instant paperless registration.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PUBLIC HEALTH ADVISORY DETAIL MODAL                           */}
        {/* ───────────────────────────────────────────────────────────── */}
        {showAdvisoryDetail && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Public Health Dengue & Heatwave Advisory</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdvisoryDetail(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 space-y-2 leading-relaxed">
                <p><strong>Issued by:</strong> Health & Family Welfare Dept, Govt of Odisha.</p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>Dengue early testing and platelet counters active across all CHCs.</li>
                  <li>Avoid direct exposure to sunlight between 11:00 AM and 3:30 PM.</li>
                  <li>Drink plenty of water, buttermilk, lemon water, and ORS.</li>
                  <li>In case of fever with shivering or body ache, use <strong>AI Symptom Triage</strong> or visit nearest PHC immediately.</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvisoryDetail(false)}
                className="w-full py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs"
              >
                Understood
              </button>
            </div>
          </div>
        )}

        {/* Live Emergency TeleConsultation Suite Modal */}
        {showMobileTeleModal && (
          <TeleConsultationSuite
            currentUser={currentUser}
            appLang={appLang}
            onClose={() => setShowMobileTeleModal(false)}
          />
        )}
      </div>
    </div>
  );
}
