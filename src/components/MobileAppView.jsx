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
  Search,
  Copy,
  HeartPulse,
  Database,
  Layers,
  Video,
  Hospital,
  Shield,
  Clock,
  Check,
  Share2
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
  const [selectedMobileTab, setSelectedMobileTab] = useState(null);

  const abhaNumber = currentUser?.staffId || '91-7712-4439-0021';
  const patientName = currentUser?.name || 'PRASANT KUMAR ROUT';
  const patientFacility = currentUser?.facility || 'Capital Hospital, BBSR';
  const patientAge = currentUser?.age || 42;
  const patientGender = currentUser?.gender || 'Male';

  // Multilingual translations
  const t = useMemo(() => {
    return {
      'or-IN': {
        brandTitle: 'ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର ଓଡ଼ିଶା',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA Health ID',
        emergency108: 'EMERGENCY 108',
        healthAlertTitle: 'ALERT: Maintain Vigilance for Heatwave. Stay hydrated with ORS and avoid peak sun.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'ଡାକ୍ତର, ହସ୍ପିଟାଲ୍ ବେଡ୍, ଆମ୍ବୁଲାନ୍ସ ଖୋଜନ୍ତୁ...',
        triageTitle: 'AI Symptom Triage',
        triageSub: 'AI ଲକ୍ଷଣ ନିରୂପଣ ଓ ଭଏସ୍ ଇନପୁଟ୍',
        bedTitle: 'Hospital Bed Availability',
        bedSub: 'ଲାଇଭ୍ ICU ଓ ଜେନେରାଲ୍ ବେଡ୍',
        ambTitle: '108 Ambulance Dispatch',
        ambSub: 'ଜରୁରୀକାଳୀନ ଜିପିଏସ୍ ଆମ୍ବୁଲାନ୍ସ',
        docTitle: 'Doctor Tele-Consultation',
        docSub: '୨,୫୨୩ OMC ସ୍ପେଶାଲିଷ୍ଟ ଡାକ୍ତର',
        gpsTitle: 'Nearest Medical GPS',
        gpsSub: 'ନିକଟସ୍ଥ PHC / CHC ହସ୍ପିଟାଲ୍',
        bloodTitle: 'Blood Bank Network',
        bloodSub: 'OSBTC ଲାଇଭ୍ ରକ୍ତ ଭଣ୍ଡାର',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'ଔଷଧ ସୁରକ୍ଷା ଓ ଏକ୍ସପାଏରୀ ସ୍କାନର',
        rxTitle: 'Doctor Prescription & Referral',
        rxSub: 'ଡାକ୍ତରୀ ପ୍ରେସକ୍ରିପସନ୍ ଓ ରେଫରାଲ୍ ସ୍ଲିପ୍',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'ଜିରୋ ଇଣ୍ଟରନେଟ୍ ଗ୍ରାମୀଣ ଡାଟା ସିଙ୍କ୍',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସର୍ଭେକ୍ଷଣ',
        adminTitle: 'State Command Hub',
        adminSub: '୩୦ ଜିଲ୍ଲା ଟେଲିମେଟ୍ରି ଓ ପ୍ରଶାସନ',
        home: 'Home',
        services: 'Services',
        records: 'My Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!'
      },
      'hi-IN': {
        brandTitle: 'स्वास्थ्यमित्र ओडिशा',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA Health ID',
        emergency108: 'EMERGENCY 108',
        healthAlertTitle: 'ALERT: लू और भीषण गर्मी से बचाव हेतु सतर्क रहें व ओआरएस का सेवन करें।',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'डॉक्टर, अस्पताल बेड, एम्बुलेंस खोजें...',
        triageTitle: 'AI Symptom Triage',
        triageSub: 'AI लक्षण जांच एवं वॉइस इनपुट',
        bedTitle: 'Hospital Bed Availability',
        bedSub: 'लाइव ICU व जनरल बेड उपलब्धता',
        ambTitle: '108 Ambulance Dispatch',
        ambSub: 'आपातकालीन 108 एम्बुलेंस जीपीएस',
        docTitle: 'Doctor Tele-Consultation',
        docSub: '2,523 OMC विशेषज्ञ डॉक्टर',
        gpsTitle: 'Nearest Medical GPS',
        gpsSub: 'निकटतम PHC / CHC अस्पताल मैप',
        bloodTitle: 'Blood Bank Network',
        bloodSub: 'OSBTC रियल-टाइम रक्त भंडार',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'दवा सुरक्षा व एक्सपायरी स्कैनर',
        rxTitle: 'Doctor Prescription & Referral',
        rxSub: 'डिजिटल प्रिस्क्रिप्शन व रेफरल पर्ची',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'जीरो इंटरनेट ग्रामीण डाटा सिंक',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'मातृ एवं शिशु स्वास्थ्य सर्वेक्षण',
        adminTitle: 'State Command Hub',
        adminSub: '30 जिला कमान एवं टेलीमेट्री',
        home: 'Home',
        services: 'Services',
        records: 'My Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!'
      },
      'en-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        abhaCardTitle: 'ABHA Health ID',
        emergency108: 'EMERGENCY 108',
        healthAlertTitle: 'ALERT: Maintain Vigilance for Heatwave. Stay hydrated with ORS and avoid peak sun.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, beds, ambulance, blood...',
        triageTitle: 'AI Symptom Triage',
        triageSub: 'Multilingual Voice & Triage Note',
        bedTitle: 'Hospital Bed Availability',
        bedSub: '10,770 Live ICU & General Beds',
        ambTitle: '108 Ambulance Dispatch',
        ambSub: 'Instant GPS Emergency SOS',
        docTitle: 'Doctor Tele-Consultation',
        docSub: '2,523 OMC Verified Specialists',
        gpsTitle: 'Nearest Medical GPS',
        gpsSub: 'PHC, CHC & DHH Navigator',
        bloodTitle: 'Blood Bank Network',
        bloodSub: '8,420 OSBTC Blood Stock Units',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'OCR & Drug Interaction Guard',
        rxTitle: 'Doctor Prescription & Referral',
        rxSub: 'NMC Digital Rx & Transfer Slips',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'Zero-Internet Rural Clinic DB',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'Maternal & Child Health Surveys',
        adminTitle: 'State Command Hub',
        adminSub: '30-District Health Governance',
        home: 'Home',
        services: 'Services',
        records: 'My Records',
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

  // Action Portal Cards (Matching Mockup 2 Clean Layout)
  const actionCards = useMemo(() => [
    {
      id: 'intake',
      hub: 'citizen',
      title: t.triageTitle,
      sub: t.triageSub,
      icon: Activity,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300',
      badge: 'VOICE AI'
    },
    {
      id: 'beds',
      hub: 'citizen',
      title: t.bedTitle,
      sub: t.bedSub,
      icon: Bed,
      iconBg: 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300',
      badge: '10,770 BEDS'
    },
    {
      id: 'ambulance',
      hub: 'citizen',
      title: t.ambTitle,
      sub: t.ambSub,
      icon: Truck,
      iconBg: 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300',
      badge: 'GPS SOS'
    },
    {
      id: 'doctors',
      hub: 'citizen',
      title: t.docTitle,
      sub: t.docSub,
      icon: Stethoscope,
      iconBg: 'bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300',
      badge: '2,523 DRS'
    },
    {
      id: 'prescriptions',
      hub: 'doctor',
      title: t.rxTitle,
      sub: t.rxSub,
      icon: FileText,
      iconBg: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300',
      badge: 'NMC Rx'
    },
    {
      id: 'nearest',
      hub: 'citizen',
      title: t.gpsTitle,
      sub: t.gpsSub,
      icon: MapPin,
      iconBg: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300',
      badge: 'MAP GPS'
    },
    {
      id: 'blood',
      hub: 'citizen',
      title: t.bloodTitle,
      sub: t.bloodSub,
      icon: Droplet,
      iconBg: 'bg-red-100 dark:bg-red-900/60 text-red-700 dark:text-red-300',
      badge: '8,420 UNITS'
    },
    {
      id: 'medicines',
      hub: 'citizen',
      title: t.medTitle,
      sub: t.medSub,
      icon: Pill,
      iconBg: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300',
      badge: 'SAFETY'
    },
    {
      id: 'phc_offline',
      hub: 'asha',
      title: t.phcTitle,
      sub: t.phcSub,
      icon: Database,
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200',
      badge: 'OFFLINE'
    },
    {
      id: 'asha_field',
      hub: 'asha',
      title: t.ashaTitle,
      sub: t.ashaSub,
      icon: HeartPulse,
      iconBg: 'bg-pink-100 dark:bg-pink-900/60 text-pink-700 dark:text-pink-300',
      badge: 'FIELD'
    },
    {
      id: 'admin',
      hub: 'admin',
      title: t.adminTitle,
      sub: t.adminSub,
      icon: Layers,
      iconBg: 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200',
      badge: 'COMMAND'
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
      (c) => c.title.toLowerCase().includes(q) || c.sub.toLowerCase().includes(q)
    );
  }, [actionCards, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 flex justify-center selection:bg-emerald-500 selection:text-white">
      {/* 📱 Phone Shell Container (380px - 480px width) */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 min-h-screen shadow-2xl relative flex flex-col pb-24 border-x border-slate-200/80 dark:border-slate-800">

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

              <div className="font-bold text-sm text-white truncate text-center flex-1">
                {actionCards.find((c) => c.id === selectedMobileTab)?.title || 'Health Module'}
              </div>

              {/* Language Pill */}
              <div className="flex items-center bg-black/20 rounded-full p-0.5 text-[10px] font-bold">
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
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all cursor-pointer hover:border-emerald-500"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center shadow-xs`}>
                      <IconComp className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{card.title}</h3>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{card.sub}</p>
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
                <h2 className="text-xl font-black text-slate-900 dark:text-white">My Health Records</h2>
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
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Doctor Appointments</div>
                    <div className="text-[10px] text-slate-500">Upcoming OPD tokens & video consultations</div>
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
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 flex items-center justify-center">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Past AI Triage Notes</div>
                    <div className="text-[10px] text-slate-500">Voice symptom records & risk assessments</div>
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
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Profile & Settings</h2>
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Language Preference (ଭାଷା ଚୟନ)</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    appLang === 'or-IN'
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
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
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
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
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme Mode */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Color Theme</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setThemeMode('light')}
                  className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    themeMode === 'light'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
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
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
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
                      : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-600'
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
              <span>Switch User / Staff Login</span>
            </button>

            {currentUser && (
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
          /* HOME SCREEN (EXACT MATCH TO MOCKUP 2)                         */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col space-y-3.5 animate-fadeIn">
            {/* 1. GREEN APP HEADER */}
            <div className="bg-[#065f46] text-white px-4 pt-4 pb-5 rounded-b-[2rem] shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-lg shadow-inner">
                    🏥
                  </div>
                  <div>
                    <h1 className="text-sm font-black tracking-tight leading-tight">{t.brandTitle}</h1>
                    <p className="text-[11px] text-emerald-200 font-medium">{t.brandSubtitle}</p>
                  </div>
                </div>

                {/* Language Switch Pill */}
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
              </div>

              {/* 2. METALLIC ABHA HEALTH ID HERO CARD */}
              <div className="bg-gradient-to-tr from-[#047857] via-[#065f46] to-[#0f172a] rounded-2xl p-3.5 border border-emerald-400/40 shadow-xl text-white space-y-3">
                {/* Card Top Title & Emergency Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-200">
                      {t.abhaCardTitle}
                    </span>
                  </div>

                  <a
                    href="tel:108"
                    className="flex items-center gap-1 bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1 rounded-full text-[10px] font-black shadow-md animate-pulse border border-rose-400 cursor-pointer"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{t.emergency108}</span>
                  </a>
                </div>

                {/* Card Main Info: Photo Avatar + Name & Details + QR Code */}
                <div className="flex items-center gap-3">
                  {/* Photo Avatar */}
                  <div className="w-13 h-13 rounded-xl bg-gradient-to-tr from-amber-400 via-amber-500 to-yellow-600 p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full rounded-[10px] bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                      {patientName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xs font-black truncate tracking-wide text-white">
                      {patientName}
                    </h2>
                    <div className="text-[10px] text-emerald-200 font-medium">
                      {patientAge} Yrs • {patientGender}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAbha}
                      className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-300 bg-black/30 px-2 py-0.5 rounded-md mt-1 border border-emerald-500/30 cursor-pointer hover:text-white"
                    >
                      <span>{abhaNumber}</span>
                      {copiedAbha ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                    </button>
                  </div>

                  {/* QR Code Action Preview */}
                  <button
                    type="button"
                    onClick={() => setShowQrModal(true)}
                    className="w-11 h-11 bg-white rounded-xl p-1 shadow-md flex items-center justify-center shrink-0 cursor-pointer active:scale-95 transition-all"
                    title="View Full QR Code"
                  >
                    <QrCode className="w-8 h-8 text-slate-900" />
                  </button>
                </div>

                {/* Card Footer Location */}
                <div className="text-[10px] text-emerald-300/90 font-medium flex items-center gap-1 pt-0.5 border-t border-emerald-600/40 truncate">
                  <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="truncate">{patientFacility}</span>
                </div>
              </div>
            </div>

            {/* 3. HEALTH ALERTS SECTION (MATCHING MOCKUP) */}
            <div className="px-3.5">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-800 rounded-2xl p-3 text-amber-950 dark:text-amber-200 shadow-2xs space-y-1.5">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs font-bold leading-snug">
                    {t.healthAlertTitle}
                  </div>
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdvisoryDetail(true)}
                    className="text-[10px] font-black text-amber-900 dark:text-amber-200 underline uppercase tracking-wider cursor-pointer"
                  >
                    {t.viewDetails} →
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
                  className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
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

            {/* 5. CLEAN 2-COLUMN ACTION GRID (MATCHING MOCKUP 2) */}
            <div className="px-3.5 pb-2">
              <div className="grid grid-cols-2 gap-2.5">
                {filteredCards.map((card) => {
                  const IconComp = card.icon;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleOpenModule(card.id, card.hub)}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 shadow-xs flex flex-col items-start text-left space-y-2.5 active:scale-95 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="w-full flex items-center justify-between">
                        <div className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}>
                          <IconComp className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 group-hover:text-emerald-600 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md">
                          {card.badge}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                          {card.title}
                        </h3>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                          {card.sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* 6. FLOATING ISLAND BOTTOM NAVIGATION BAR (MATCHING MOCKUP 2)  */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="fixed bottom-3 left-4 right-4 max-w-md mx-auto z-40">
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

            {/* 3. My Records */}
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
        {/* HEATWAVE ADVISORY DETAIL MODAL                                */}
        {/* ───────────────────────────────────────────────────────────── */}
        {showAdvisoryDetail && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3.5">
              <div className="flex items-center justify-between border-b pb-2.5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Public Health Heatwave Advisory</span>
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
                  <li>Avoid direct exposure to sunlight between 11:00 AM and 3:30 PM.</li>
                  <li>Drink plenty of water, buttermilk, lemon water, and ORS.</li>
                  <li>In case of dizziness, high fever, or muscle cramps, visit nearest Jalachhatra or PHC immediately.</li>
                  <li>Free ORS corners are active across all 30 District Hospitals.</li>
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
      </div>
    </div>
  );
}
