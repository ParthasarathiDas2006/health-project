import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { DoctorAvatar } from '../utils/doctorPhotos';

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
  const [selectedMobileTab, setSelectedMobileTab] = useState(null);

  const isPatient = !currentUser || currentUser.roleCategory === 'patient';
  const isAdmin = currentUser?.roleCategory === 'admin';
  const isDoctor = currentUser?.roleCategory === 'doctor' || currentUser?.roleCategory === 'nurse';
  const isAsha = currentUser?.roleCategory === 'asha' || currentUser?.roleCategory === 'anm';

  // Multilingual text
  const t = {
    'or-IN': {
      brandTitle: 'ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର ଓଡ଼ିଶା',
      brandSubtitle: 'SwasthyaMitra Odisha',
      abhaCardTitle: 'ABHA ସ୍ୱାସ୍ଥ୍ୟ ପରିଚୟପତ୍ର',
      emergency: 'ଜରୁରୀକାଳୀନ',
      emergency108: '108',
      healthAlertTitle: 'ସତର୍କ ସୂଚନା: ଗ୍ରୀଷ୍ମ ପ୍ରବାହ ସତର୍କତା ଓ ପର୍ଯ୍ୟାପ୍ତ ଜଳପାନ ପରାମର୍ଶ।',
      viewDetails: 'ବିସ୍ତୃତ ଦେଖନ୍ତୁ',
      triageTitle: 'AI ଲକ୍ଷଣ ନିରୂପଣ',
      triageSub: 'AI Symptom Triage',
      bedTitle: 'ହସ୍ପିଟାଲ୍ ବେଡ୍',
      bedSub: 'Hospital Beds',
      ambTitle: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ',
      ambSub: '108 Ambulance',
      docTitle: 'ଡାକ୍ତର ପରାମର୍ଶ',
      docSub: 'Doctor Consult',
      gpsTitle: 'ନିକଟସ୍ଥ ଡାକ୍ତରଖାନା',
      gpsSub: 'Nearest Medical GPS',
      bloodTitle: 'ରକ୍ତ ଭଣ୍ଡାର',
      bloodSub: 'Blood Bank',
      phcTitle: 'PHC ଅଫଲାଇନ୍ ସିଙ୍କ୍',
      phcSub: 'Offline Sync Engine',
      adminTitle: 'ରାଜ୍ୟ କମାଣ୍ଡ ହବ୍',
      adminSub: 'State Command Hub',
      home: 'ମୁଖ୍ୟ',
      services: 'ସେବା ସମୂହ',
      records: 'ମୋର ରେକର୍ଡ',
      profile: 'ପ୍ରୋଫାଇଲ୍',
      backToHome: 'ମୁଖ୍ୟ ପୃଷ୍ଠାକୁ ଫେରନ୍ତୁ'
    },
    'hi-IN': {
      brandTitle: 'स्वास्थ्यमित्र ओडिशा',
      brandSubtitle: 'SwasthyaMitra Odisha',
      abhaCardTitle: 'ABHA स्वास्थ्य पहचान पत्र',
      emergency: 'आपातकालीन',
      emergency108: '108',
      healthAlertTitle: 'चेतावनी: लू और भीषण गर्मी से बचाव हेतु सतर्क रहें व ओआरएस लें।',
      viewDetails: 'विवरण देखें',
      triageTitle: 'AI लक्षण जांच',
      triageSub: 'AI Symptom Triage',
      bedTitle: 'अस्पताल बेड',
      bedSub: 'Hospital Beds',
      ambTitle: '108 एम्बुलेंस',
      ambSub: '108 Ambulance',
      docTitle: 'डॉक्टर परामर्श',
      docSub: 'Doctor Consult',
      gpsTitle: 'निकटतम अस्पताल',
      gpsSub: 'Nearest Medical GPS',
      bloodTitle: 'रक्त बैंक',
      bloodSub: 'Blood Bank',
      phcTitle: 'PHC ऑफलाइन सिंक',
      phcSub: 'Offline Sync Engine',
      adminTitle: 'राज्य कमान हब',
      adminSub: 'State Command Hub',
      home: 'होम',
      services: 'सेवाएं',
      records: 'रिकॉर्ड',
      profile: 'प्रोफाइल',
      backToHome: 'मुख्य पृष्ठ पर वापस'
    },
    'en-IN': {
      brandTitle: 'SwasthyaMitra Odisha',
      brandSubtitle: 'Rural Health & Telemetry Mission',
      abhaCardTitle: 'ABHA Health ID Card',
      emergency: 'EMERGENCY',
      emergency108: '108',
      healthAlertTitle: 'ALERT: Maintain Vigilance for Heatwave. Stay Hydrated & Stock ORS.',
      viewDetails: 'VIEW DETAILS',
      triageTitle: 'AI Symptom Triage',
      triageSub: 'AI Clinical Assessment',
      bedTitle: 'Bed Availability',
      bedSub: 'Live Ward Capacity',
      ambTitle: '108 Ambulance',
      ambSub: 'Emergency Dispatch',
      docTitle: 'Doctor Consult',
      docSub: '2,523 OMC Specialists',
      gpsTitle: 'Nearest Medical GPS',
      gpsSub: 'PHC/CHC Locator',
      bloodTitle: 'Blood Bank Status',
      bloodSub: 'OSBTC Live Units',
      phcTitle: 'PHC Offline Sync',
      phcSub: 'Offline Sync Engine',
      adminTitle: 'State Command Hub',
      adminSub: '30 District Telemetry',
      home: 'Home',
      services: 'Services',
      records: 'My Records',
      profile: 'Profile',
      backToHome: 'Back to Home'
    }
  }[appLang] || {};

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

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-24 font-sans select-none antialiased">
      {/* ───────────────────────────────────────────────────────────── */}
      {/* FULL MODULE VIEW ON MOBILE (WITH STICKY BACK BAR)             */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileSection === 'detail' && selectedMobileTab ? (
        <div className="animate-fadeIn space-y-3 p-3">
          {/* Top Mobile Return Ribbon */}
          <div className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-xl flex items-center justify-between border border-slate-800">
            <button
              type="button"
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-xs font-black text-emerald-400 hover:text-emerald-300 active:scale-95 transition-all cursor-pointer py-1 px-2.5 rounded-xl bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.backToHome}</span>
            </button>

            {/* Language Pill Switcher */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setAppLang('or-IN')}
                className={`px-2 py-0.5 rounded-lg ${appLang === 'or-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                type="button"
                onClick={() => setAppLang('hi-IN')}
                className={`px-2 py-0.5 rounded-lg ${appLang === 'hi-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLang('en-IN')}
                className={`px-2 py-0.5 rounded-lg ${appLang === 'en-IN' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}
              >
                EN
              </button>
            </div>
          </div>

          {/* Render Active Component Body */}
          <div className="mt-2">{renderActiveComponent()}</div>
        </div>
      ) : mobileSection === 'services' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* SERVICES HUB ON MOBILE                                        */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-5 rounded-3xl shadow-lg space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">SwasthyaMitra Suite</span>
            <h2 className="text-xl font-black">{t.services}</h2>
            <p className="text-xs text-slate-300">All 12 Clinical, Emergency, and Telemetry Portals</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleOpenModule('intake', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <Activity className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.triageTitle}</span>
              <span className="text-[10px] text-slate-500">{t.triageSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('doctors', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-700">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.docTitle}</span>
              <span className="text-[10px] text-slate-500">{t.docSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('beds', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-700">
                <Bed className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.bedTitle}</span>
              <span className="text-[10px] text-slate-500">{t.bedSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('ambulance', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.ambTitle}</span>
              <span className="text-[10px] text-slate-500">{t.ambSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('nearest', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
                <MapPin className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.gpsTitle}</span>
              <span className="text-[10px] text-slate-500">{t.gpsSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('blood', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-rose-100 text-rose-600">
                <Droplet className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.bloodTitle}</span>
              <span className="text-[10px] text-slate-500">{t.bloodSub}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('medicines', 'citizen')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-700">
                <Pill className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-slate-900">Drug Safety & Expiry</span>
              <span className="text-[10px] text-slate-500">QR / OCR Scanner</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('phc_offline', 'phc')}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-2 active:scale-95 transition-all"
            >
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                <Zap className="w-6 h-6 text-amber-600" />
              </div>
              <span className="text-xs font-black text-slate-900">{t.phcTitle}</span>
              <span className="text-[10px] text-slate-500">{t.phcSub}</span>
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={() => handleOpenModule('admin', 'admin')}
                className="col-span-2 p-4 rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 text-white shadow-md flex items-center justify-between active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/30 text-purple-300">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-black">{t.adminTitle}</div>
                    <div className="text-[10px] text-purple-200">{t.adminSub}</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-purple-300" />
              </button>
            )}
          </div>
        </div>
      ) : mobileSection === 'records' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* MY RECORDS ON MOBILE                                          */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>{t.records}</span>
            </h2>
            <p className="text-xs text-slate-500">
              Your synced consultations, verified prescriptions, and hospital admissions
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block">ABHA Unified Health Interface (UHI) Synced</span>
              <p className="text-[11px] text-emerald-800">
                All records are securely encrypted and connected to your ABHA ID: <strong>{currentUser?.staffId || '12-3456-7890-1234'}</strong>
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleOpenModule('appointments', 'citizen')}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900">Scheduled Consultations</div>
                  <div className="text-[10px] text-slate-500">View upcoming doctor appointments</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenModule('transfers', 'citizen')}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-slate-900">Hospital Referral Slips</div>
                  <div className="text-[10px] text-slate-500">Tertiary inter-hospital transfer slips</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      ) : mobileSection === 'profile' ? (
        /* ───────────────────────────────────────────────────────────── */
        /* PROFILE / SETTINGS ON MOBILE                                  */
        /* ───────────────────────────────────────────────────────────── */
        <div className="p-4 space-y-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-lg flex items-center justify-center shadow-md">
                {currentUser?.name?.slice(0, 2)?.toUpperCase() || 'SM'}
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">{currentUser?.name || 'Citizen User'}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {currentUser?.role || 'Verified Citizen'}
                </span>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ABHA: {currentUser?.staffId || '12-3456-7890-1234'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Language Preference</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAppLang('or-IN')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  appLang === 'or-IN' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                ଓଡ଼ିଆ
              </button>
              <button
                type="button"
                onClick={() => setAppLang('hi-IN')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  appLang === 'hi-IN' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setAppLang('en-IN')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  appLang === 'en-IN' ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-4 border border-slate-200 shadow-sm space-y-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Display Mode</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setThemeMode('light')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                  themeMode === 'light' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('dark')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                  themeMode === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                type="button"
                onClick={() => setThemeMode('reading')}
                className={`py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 ${
                  themeMode === 'reading' ? 'bg-amber-800 text-white' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sepia</span>
              </button>
            </div>
          </div>

          <div className="pt-2">
            {currentUser ? (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-black text-xs flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out / Switch Role</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Staff Portal</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ───────────────────────────────────────────────────────────── */
        /* MAIN SMARTPHONE DASHBOARD VIEW (MATCHING MOCKUP DESIGN)       */
        /* ───────────────────────────────────────────────────────────── */
        <div className="space-y-4 animate-fadeIn">
          {/* Top Emerald Green Header Card */}
          <div className="bg-gradient-to-b from-emerald-800 via-emerald-700 to-emerald-800 text-white px-4 pt-5 pb-6 rounded-b-[2.5rem] shadow-xl space-y-4">
            {/* Top Brand & Language Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 text-white font-black text-sm">
                  🏥
                </div>
                <div>
                  <h1 className="text-sm font-black tracking-tight leading-tight">{t.brandTitle}</h1>
                  <p className="text-[10px] text-emerald-200 font-semibold">{t.brandSubtitle}</p>
                </div>
              </div>

              {/* Language Pills */}
              <div className="flex items-center gap-1 bg-emerald-900/60 p-1 rounded-xl text-[10px] font-bold border border-emerald-600/50">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${appLang === 'or-IN' ? 'bg-white text-emerald-900 font-extrabold shadow-xs' : 'text-emerald-200'}`}
                >
                  ଓଡ଼ିଆ
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('en-IN')}
                  className={`px-2 py-0.5 rounded-lg transition-all ${appLang === 'en-IN' ? 'bg-white text-emerald-900 font-extrabold shadow-xs' : 'text-emerald-200'}`}
                >
                  EN
                </button>
              </div>
            </div>

            {/* ABHA Health ID & Emergency 108 Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/25 flex items-center justify-between gap-3 shadow-inner">
              {/* Patient ABHA Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-white text-slate-800 font-black text-xs flex items-center justify-center shrink-0 shadow-sm border border-emerald-200 overflow-hidden">
                  <span className="text-base">👤</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[9px] font-extrabold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
                    <span>{t.abhaCardTitle}</span>
                    <span className="text-[8px] bg-emerald-500/30 px-1 rounded text-white font-mono">VERIFIED</span>
                  </div>
                  <div className="text-xs font-black text-white truncate mt-0.5">
                    {currentUser?.name || 'PRASHANT KUMAR'}
                  </div>
                  <div className="text-[10px] text-emerald-100 font-mono tracking-tight">
                    {currentUser?.staffId || '12-3456-7890-1234'}
                  </div>
                </div>
              </div>

              {/* QR Code graphic */}
              <div className="p-1.5 rounded-lg bg-white shrink-0 shadow-xs text-slate-900">
                <QrCode className="w-6 h-6 text-slate-800" />
                <span className="text-[7px] font-black block text-center mt-0.5">ABHA</span>
              </div>

              {/* Red EMERGENCY 108 Button */}
              <a
                href="tel:108"
                className="px-3.5 py-2.5 bg-gradient-to-b from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800 text-white rounded-xl flex flex-col items-center justify-center shrink-0 shadow-lg shadow-rose-950/40 active:scale-95 transition-all border border-rose-400"
              >
                <div className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-white animate-bounce" />
                  <span className="text-[8px] font-black uppercase tracking-wider">{t.emergency}</span>
                </div>
                <span className="text-sm font-black leading-none mt-0.5">{t.emergency108}</span>
              </a>
            </div>
          </div>

          {/* Public Health Alerts Banner */}
          <div className="px-4">
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-amber-950 shadow-xs space-y-1.5">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1 text-[11px] font-bold leading-snug">
                  {t.healthAlertTitle}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-amber-200/60 text-[10px]">
                <span className="text-amber-800 font-semibold">Odisha State Public Health Cell</span>
                <button
                  type="button"
                  onClick={() => setShowAdvisoryDetail(true)}
                  className="font-black text-amber-900 underline uppercase cursor-pointer"
                >
                  {t.viewDetails} →
                </button>
              </div>
            </div>
          </div>

          {/* 4 Core Action Cards (2x2 Grid) */}
          <div className="px-4 space-y-3">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Card 1: AI Symptom Triage */}
              <button
                type="button"
                onClick={() => handleOpenModule('intake', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-emerald-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.triageTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.triageSub}</p>
                </div>
              </button>

              {/* Card 2: Hospital Bed Availability */}
              <button
                type="button"
                onClick={() => handleOpenModule('beds', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-blue-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-inner">
                  <Bed className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.bedTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.bedSub}</p>
                </div>
              </button>

              {/* Card 3: 108 Ambulance Dispatch */}
              <button
                type="button"
                onClick={() => handleOpenModule('ambulance', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-rose-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-inner">
                  <Truck className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.ambTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.ambSub}</p>
                </div>
              </button>

              {/* Card 4: Doctor Tele-Consultation */}
              <button
                type="button"
                onClick={() => handleOpenModule('doctors', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-teal-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shadow-inner">
                  <Stethoscope className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.docTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.docSub}</p>
                </div>
              </button>

              {/* Card 5: Nearest Medical GPS */}
              <button
                type="button"
                onClick={() => handleOpenModule('nearest', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-indigo-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 shadow-inner">
                  <MapPin className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.gpsTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.gpsSub}</p>
                </div>
              </button>

              {/* Card 6: Blood Bank Units */}
              <button
                type="button"
                onClick={() => handleOpenModule('blood', 'citizen')}
                className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col items-center text-center space-y-2 active:scale-95 hover:border-rose-400 transition-all cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-700 shadow-inner">
                  <Droplet className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight">{t.bloodTitle}</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.bloodSub}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* FLOATING BOTTOM NAVIGATION BAR (FIXED ON MOBILE SCREENS)      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="fixed bottom-3 left-3 right-3 z-50 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-2xl p-2 flex items-center justify-around">
        <button
          type="button"
          onClick={() => {
            setSelectedMobileTab(null);
            setMobileSection('home');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileSection === 'home' && !selectedMobileTab
              ? 'text-emerald-700 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl ${
              mobileSection === 'home' && !selectedMobileTab ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'
            }`}
          >
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t.home}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMobileTab(null);
            setMobileSection('services');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileSection === 'services' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${mobileSection === 'services' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'}`}>
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t.services}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMobileTab(null);
            setMobileSection('records');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileSection === 'records' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${mobileSection === 'records' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'}`}>
            <FileText className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t.records}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedMobileTab(null);
            setMobileSection('profile');
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileSection === 'profile' ? 'text-emerald-700 font-black' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className={`p-1.5 rounded-xl ${mobileSection === 'profile' ? 'bg-emerald-100 text-emerald-800' : 'bg-transparent'}`}>
            <User className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold">{t.profile}</span>
        </button>
      </div>

      {/* Advisory Detail Modal on Mobile */}
      {showAdvisoryDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-700 font-black text-sm">
                <AlertTriangle className="w-5 h-5" />
                <span>State Health Alert</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisoryDetail(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              <strong>Severe Heatwave Orange Alert:</strong> Temperatures exceeding 42°C in western/interior Odisha. 24x7 cooling bays mobilized at all PHCs/CHCs. Free ORS packets available at all ASHA centers. Mandate shade halts between 11 AM - 3 PM.
            </p>
            <button
              type="button"
              onClick={() => setShowAdvisoryDetail(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
