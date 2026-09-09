import React, { useState } from 'react';
import MultimodalIntakeForm from './components/MultimodalIntakeForm';
import OcrUploader from './components/OcrUploader';
import TriageDoctorDashboard from './components/TriageDoctorDashboard';
import DoctorBookingSystem from './components/DoctorBookingSystem';
import BloodBankSystem from './components/BloodBankSystem';
import AuthPage from './components/AuthPage';
import { getCurrentUser, setCurrentUser, logoutUser, getBookedAppointments } from './utils/authStorage';
import {
  Activity,
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
  Droplet
} from 'lucide-react';

export default function App() {
  const [currentUser, setLoggedInUser] = useState(() => getCurrentUser());
  const [appLang, setAppLang] = useState(() => currentUser?.preferredLanguage || 'or-IN');
  const [showAuthPage, setShowAuthPage] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentIntake, setCurrentIntake] = useState(null);
  const [currentOcr, setCurrentOcr] = useState(null);
  const [generatedTriageNote, setGeneratedTriageNote] = useState(null);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [bookedCount, setBookedCount] = useState(() => getBookedAppointments().length);

  // Authentication callbacks
  const handleLoginSuccess = (user) => {
    setLoggedInUser(user);
    if (user.preferredLanguage) {
      setAppLang(user.preferredLanguage);
    }
    setShowAuthPage(false);
    setShowProfileMenu(false);
    if (user.roleCategory === 'patient') {
      setActiveTab('intake');
    } else {
      setActiveTab('dashboard');
    }
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

  // Handle Intake submission
  const handleIntakeComplete = (data) => {
    setCurrentIntake({
      ...data,
      intakeBy: currentUser?.name || 'Healthcare Worker',
      intakeFacility: currentUser?.facility || 'Primary Health Center'
    });
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

      const note = {
        id: `TRG-${Math.floor(1000 + Math.random() * 9000)}`,
        patientName: currentIntake?.patientName || currentUser?.name || (appLang === 'or-IN' ? 'ରୋଗୀ' : (appLang === 'hi-IN' ? 'मरीज' : 'Intake Patient')),
        urgency,
        urgencyScore: score,
        urgencyReason: flags.length > 0 ? flags[0] : (appLang === 'or-IN' ? 'ସାଧାରଣ ଲକ୍ଷଣ ସ୍ତର' : (appLang === 'hi-IN' ? 'सामान्य प्राथमिक लक्षण' : 'Routine mild acute presentation')),
        redFlags: flags,
        chiefComplaint: currentIntake?.translatedSummary || (appLang === 'or-IN' ? 'ତୀବ୍ର ଲକ୍ଷଣ' : (appLang === 'hi-IN' ? 'प्राथमिक लक्षण' : 'Acute symptomatic presentation')),
        vitals: {
          temp: `${vitals.temperature || '98.6'}°F`,
          pulse: `${vitals.pulse || '76'} bpm`,
          spo2: `${vitals.spo2 || '98'}%`,
          bp: `${vitals.systolic || '120'}/${vitals.diastolic || '80'}`
        },
        labFindings:
          currentOcr?.metrics?.map((m) => ({
            test: m.name,
            val: m.value,
            status: m.status
          })) || [],
        missingInfo: [
          appLang === 'or-IN' ? 'ଗତ ୮ ଘଣ୍ଟାରେ ତରଳ ପାନୀୟ ସେବନ ବିବରଣୀ' : (appLang === 'hi-IN' ? 'पिछले 8 घंटों में तरल पदार्थ सेवन का विवरण' : 'Hydration & oral fluid intake history in previous 8 hours'),
          appLang === 'or-IN' ? 'ଦୀର୍ଘସ୍ଥାୟୀ ରୋଗ ବିବରଣୀ (ମଧୁମେହ, ରକ୍ତଚାପ, ସିକିଲ୍ ସେଲ୍)' : (appLang === 'hi-IN' ? 'पुरानी बीमारियों का इतिहास (मधुमेह, बीपी, सिकल सेल)' : 'History of known chronic conditions (Diabetes, Hypertension, Sickle Cell)')
        ],
        suggestedQuestions: [
          appLang === 'or-IN' ? 'ଚର୍ମରେ ନାଲି ଦାଗ କିମ୍ବା ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ ଯାଞ୍ଚ କରନ୍ତୁ।' : (appLang === 'hi-IN' ? 'मसूड़ों से खून या त्वचा पर लाल चकत्ते जांचें।' : 'Ask patient regarding any spontaneous bleeding, gum bleeding or petechial spots.'),
          appLang === 'or-IN' ? 'ଘରର ଅନ୍ୟ ସଦସ୍ୟଙ୍କର ଏପରି ଜ୍ୱର ବା ଲକ୍ଷଣ ଅଛି କି ନାହିଁ ବୁଝନ୍ତୁ।' : (appLang === 'hi-IN' ? 'क्या परिवार के अन्य सदस्यों को भी ऐसा बुखार है?' : 'Verify if household members or co-workers have experienced similar fever/symptoms.')
        ],
        referralRecommendation:
          urgency === 'RED'
            ? (appLang === 'or-IN' ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା / SCBMCH HDU' : (appLang === 'hi-IN' ? 'जिला अस्पताल इमरजेंसी / HDU' : 'District Hospital Emergency / SCBMCH HDU'))
            : (appLang === 'or-IN' ? 'ପ୍ରାଥମିକ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (PHC) ସାଧାରଣ OPD' : (appLang === 'hi-IN' ? 'प्राथमिक स्वास्थ्य केंद्र (PHC) सामान्य OPD' : 'Primary Health Center (PHC) General OPD Bay')),
        reviewedBy: currentUser?.name || 'Assigned Medical Officer'
      };

      setGeneratedTriageNote(note);
      setIsGeneratingNote(false);
      setActiveTab('dashboard');
    }, 800);
  };

  // If user requested Auth page or no user logged in
  if (showAuthPage || !currentUser) {
    return (
      <AuthPage
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
      title: 'ବହୁମୁଖୀ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ସହାୟକ',
      subtitle: 'AI ସ୍କ୍ରାଇବ୍, ଲ୍ୟାବ୍ OCR ଓ କ୍ଲିନିକାଲ୍ ଟ୍ରାଏଜ୍ (ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ)',
      safetyLabel: 'ସୁରକ୍ଷା ନିୟମ:',
      protocol: 'ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ ପୋର୍ଟାଲ୍ (Non-Diagnostic) | ଆୟୁଷ୍ମାନ ଭାରତ ଓ BSKY ଅନ୍ତର୍ଭୁକ୍ତ',
      facilityLabel: 'କେନ୍ଦ୍ର:',
      portalTag: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ପୋର୍ଟାଲ୍',
      patientIntakeTab: '୧. ମୋର ଲକ୍ଷଣ ଦାଖଲ',
      patientOcrTab: '୨. ରିପୋର୍ଟ ଅପଲୋଡ୍',
      patientQueueTab: '୩. ହସ୍ପିଟାଲ୍ ଟ୍ରାଏଜ୍ ଧାଡ଼ି',
      doctorDeskTab: '୧. ଡାକ୍ତର ରିଭ୍ୟୁ ଡେସ୍କ',
      doctorIntakeTab: '୨. ରୋଗୀ ବିବରଣୀ',
      doctorOcrTab: '୩. ଲ୍ୟାବ୍ ରିପୋର୍ଟ ଯାଞ୍ଚ',
      doctorBookingTab: '୪. ଡାକ୍ତର ତାଲିକା ଓ ବୁକିଂ',
      bloodBankTab: '୫. ରକ୍ତ ଭଣ୍ଡାର (Blood Bank)',
      scenariosTab: '୬. ସ୍ୱାସ୍ଥ୍ୟ କ୍ଷେତ୍ର ନିୟମ',
      noteReadyBadge: 'ନୋଟ୍ ପ୍ରସ୍ତୁତ',
      oneNewBadge: '୧ ନୂଆ',
      verifiedDoctorBadge: 'RMP ପ୍ରମାଣିତ',
      verifiedPatientBadge: 'ABHA ପ୍ରମାଣିତ',
      switchUser: 'ଖାତା ବଦଳାନ୍ତୁ',
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
      scenariosHeading: 'ଭାରତୀୟ ଓ ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ କ୍ଷେତ୍ରରେ କ୍ଲିନିକାଲ୍ ଟ୍ରାଏଜ୍ ନିୟମାବଳୀ',
      scenariosSubheading: '୭ ଟି କାର୍ଯ୍ୟକ୍ଷମ ସ୍ୱାସ୍ଥ୍ୟ କ୍ଷେତ୍ରର ପରୀକ୍ଷିତ ଲାଲ୍ ସଙ୍କେତ ଓ ରେଫରାଲ୍ ପ୍ରୋଟୋକଲ୍:',
      footerText: 'ବହୁମୁଖୀ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ସହାୟକ • ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ପୋର୍ଟାଲ୍ • ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ (Non-Diagnostic)'
    },
    'hi-IN': {
      title: 'मल्टीमॉडल हेल्थकेयर ट्रायज सहायक',
      subtitle: 'AI स्क्राइब, लैब OCR एवं क्लिनिकल ट्रायज (राष्ट्रीय स्वास्थ्य मिशन)',
      safetyLabel: 'सुरक्षा नियम:',
      protocol: 'क्लिनिकल निर्णय समर्थन (Non-Diagnostic) | आयुष्मान भारत एवं राष्ट्रीय स्वास्थ्य मिशन',
      facilityLabel: 'केंद्र:',
      portalTag: 'राष्ट्रीय स्वास्थ्य पोर्टल',
      patientIntakeTab: '1. लक्षण दर्ज करें',
      patientOcrTab: '2. रिपोर्ट अपलोड',
      patientQueueTab: '3. अस्पताल ट्रायज कतार',
      doctorDeskTab: '1. डॉक्टर रिव्यू डेस्क',
      doctorIntakeTab: '2. मरीज विवरण',
      doctorOcrTab: '3. लैब रिपोर्ट OCR',
      doctorBookingTab: '4. डॉक्टर सूची एवं बुकिंग',
      bloodBankTab: '5. ब्लड बैंक (Blood Bank)',
      scenariosTab: '6. फील्ड परिदृश्य',
      noteReadyBadge: 'नोट तैयार',
      oneNewBadge: '1 नया',
      verifiedDoctorBadge: 'RMP सत्यापित',
      verifiedPatientBadge: 'ABHA सत्यापित',
      switchUser: 'खाता बदलें',
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
      scenariosHeading: 'भारतीय स्वास्थ्य सेवा क्षेत्रों में क्लिनिकल ट्रायज प्रोटोकॉल',
      scenariosSubheading: '7 परिचालन स्वास्थ्य परिवेशों में परीक्षित खतरे के लक्षण एवं रेफरल दिशा-निर्देश:',
      footerText: 'मल्टीमॉडल हेल्थकेयर ट्रायज सहायक • राष्ट्रीय स्वास्थ्य पोर्टल • गैर-निदान निर्णय समर्थन'
    },
    'en-IN': {
      title: 'Multimodal Healthcare Triage Assistant',
      subtitle: 'AI Scribe, Lab OCR & Clinical Urgency Prioritizer (National Health Mission)',
      safetyLabel: 'Safety Mandate:',
      protocol: 'Human-in-the-Loop Decision Support (Non-Diagnostic) | MoHFW Aligned',
      facilityLabel: 'Facility:',
      portalTag: 'National Health Portal',
      patientIntakeTab: '1. My Symptom Intake',
      patientOcrTab: '2. Upload Lab Reports',
      patientQueueTab: '3. Hospital Triage Queue',
      doctorDeskTab: '1. Doctor Review Desk',
      doctorIntakeTab: '2. Patient Intake',
      doctorOcrTab: '3. Lab Report OCR',
      doctorBookingTab: '4. Doctor Directory & Booking',
      bloodBankTab: '5. Blood Bank Portal',
      scenariosTab: '6. Field Scenarios',
      noteReadyBadge: 'Note Ready',
      oneNewBadge: '1 New',
      verifiedDoctorBadge: 'Verified RMP',
      verifiedPatientBadge: 'ABHA Verified',
      switchUser: 'Switch User',
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
      scenariosHeading: 'Field Triage Protocols Across Indian & Odisha Healthcare Contexts',
      scenariosSubheading: 'Tested clinical triggers, red flags, and referral pipelines across 7 operational healthcare environments:',
      footerText: 'Multimodal Healthcare Triage Assistant • National Health Mission • Non-Diagnostic Decision Support'
    }
  }[appLang] || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Banner: Clinical Safety Mandate & Session Status */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-white">{uiText.safetyLabel}</span>
          <span>{uiText.protocol}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {uiText.facilityLabel} <strong>{currentUser.facility?.split(',')[0]}</strong>
          </span>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:inline">{uiText.portalTag}</span>
        </div>
      </div>

      {/* Main Navbar with Tabs, Language Switcher, and User Profile */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center justify-between py-2.5 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 text-white p-2 rounded-xl shadow-sm">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">
                {uiText.title}
              </h1>
              <p className="text-[11px] text-slate-500">
                {uiText.subtitle}
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
            {currentUser.roleCategory === 'patient' ? (
              <>
                <button
                  onClick={() => setActiveTab('intake')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'intake'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-200" />
                  {uiText.patientIntakeTab}
                  {currentIntake && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'ocr'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-200" />
                  {uiText.patientOcrTab}
                  {currentOcr && <span className="w-1.5 h-1.5 rounded-full bg-blue-300"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  {uiText.patientQueueTab}
                  {generatedTriageNote && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {uiText.noteReadyBadge}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'booking'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-200" />
                  {uiText.doctorBookingTab}
                  {bookedCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {bookedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('bloodbank')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'bloodbank'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-300 fill-rose-200" />
                  {uiText.bloodBankTab}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'dashboard'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  {uiText.doctorDeskTab}
                  {generatedTriageNote && (
                    <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {uiText.oneNewBadge}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('intake')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'intake'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  {uiText.doctorIntakeTab}
                  {currentIntake && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('ocr')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'ocr'
                      ? 'bg-blue-50 text-blue-700 border border-blue-300'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                  {uiText.doctorOcrTab}
                  {currentOcr && <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>}
                </button>

                <button
                  onClick={() => setActiveTab('booking')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'booking'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-teal-200" />
                  {uiText.doctorBookingTab}
                  {bookedCount > 0 && (
                    <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                      {bookedCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('bloodbank')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    activeTab === 'bloodbank'
                      ? 'bg-rose-700 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Droplet className="w-3.5 h-3.5 text-rose-300 fill-rose-200" />
                  {uiText.bloodBankTab}
                </button>
              </>
            )}

            <button
              onClick={() => setActiveTab('scenarios')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                activeTab === 'scenarios'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-indigo-600" />
              {uiText.scenariosTab}
            </button>
          </nav>

          {/* Right Controls: Global Language Switcher & User Profile Pill */}
          <div className="flex items-center gap-2 self-end md:self-auto">
            {/* App-wide Language Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <select
                value={appLang}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer"
                title="Change Platform Language"
              >
                <option value="or-IN">ଓଡ଼ିଆ (Odia)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="en-IN">English</option>
              </select>
            </div>

            {/* User Profile Pill & Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all text-left shadow-2xs group ${
                  currentUser.roleCategory === 'patient'
                    ? 'border-amber-300 bg-amber-50/70 hover:bg-amber-100/60'
                    : 'border-slate-200 hover:border-emerald-500 bg-slate-50 hover:bg-white'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs ${
                    currentUser.roleCategory === 'patient'
                      ? 'bg-gradient-to-br from-amber-600 to-orange-700'
                      : 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  }`}
                >
                  {userInitials}
                </div>
                <div className="hidden sm:block">
                  <div
                    className={`text-xs font-bold leading-tight ${
                      currentUser.roleCategory === 'patient'
                        ? 'text-amber-950 group-hover:text-amber-800'
                        : 'text-slate-900 group-hover:text-emerald-700'
                    }`}
                  >
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {currentUser.role.split('/')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform" />
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 text-xs animate-fadeIn">
                  <div className="px-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          currentUser.roleCategory === 'patient'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {currentUser.roleCategory === 'patient' ? uiText.verifiedPatientBadge : uiText.verifiedDoctorBadge}
                      </span>
                    </div>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        currentUser.roleCategory === 'patient'
                          ? 'text-amber-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {currentUser.role}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      ID: {currentUser.staffId}
                    </p>
                    {currentUser.age && (
                      <p className="text-[10px] text-slate-500 mt-1">
                        {currentUser.age} {uiText.years} • {currentUser.gender === 'Female' ? uiText.female : uiText.male} • {uiText.bloodGroup}: {currentUser.bloodGroup || 'B+'}
                      </p>
                    )}
                  </div>

                  <div className="px-4 py-2.5 space-y-1.5 text-slate-600 border-b border-slate-100 text-[11px]">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.facility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{currentUser.district}, {currentUser.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{currentUser.phone}</span>
                    </div>
                  </div>

                  <div className="pt-2 px-2 space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setShowAuthPage(true);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-500" />
                      {uiText.switchUser}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      {uiText.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* TAB 1: DOCTOR DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            {generatedTriageNote && (
              <div className="max-w-7xl mx-auto mb-4 p-3.5 bg-rose-50 border border-rose-300 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
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
            <TriageDoctorDashboard
              currentUser={{ ...currentUser, preferredLanguage: appLang }}
              appLang={appLang}
              onSwitchUser={() => setShowAuthPage(true)}
            />
          </div>
        )}

        {/* TAB 2: INTAKE */}
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

        {/* TAB 3: OCR REPORT UPLOADER */}
        {activeTab === 'ocr' && (
          <div>
            {currentIntake && (
              <div className="max-w-2xl mx-auto mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
                <span>
                  <strong>{uiText.linkedIntakeLabel} </strong>
                  {currentIntake.translatedSummary.slice(0, 70)}...
                </span>
                <span className="font-semibold text-emerald-700">{uiText.vitalsAttached}</span>
              </div>
            )}

            <OcrUploader appLang={appLang} onOcrComplete={handleOcrComplete} />

            <div className="max-w-2xl mx-auto mt-6 text-center">
              <button
                onClick={handleGenerateTriage}
                disabled={isGeneratingNote}
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
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

        {/* TAB 4: DOCTOR DIRECTORY & BOOKING */}
        {activeTab === 'booking' && (
          <div>
            <DoctorBookingSystem
              currentUser={currentUser}
              appLang={appLang}
              onBookedCountChange={(cnt) => setBookedCount(cnt)}
            />
          </div>
        )}

        {/* TAB 5: ODISHA BLOOD BANK PORTAL */}
        {activeTab === 'bloodbank' && (
          <div>
            <BloodBankSystem
              currentUser={currentUser}
              appLang={appLang}
            />
          </div>
        )}

        {/* TAB 6: INDIA & ODISHA SCENARIOS REFERENCE */}
        {activeTab === 'scenarios' && (
          <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-2">
              <Building className="w-5 h-5 text-indigo-600" />
              {uiText.scenariosHeading}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              {uiText.scenariosSubheading}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Odisha Special Scenario */}
              <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50/70 md:col-span-2 shadow-xs">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                    {appLang === 'or-IN'
                      ? '୭. ଓଡ଼ିଶା ଉପକୂଳ, ବାତ୍ୟା ଓ ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର'
                      : (appLang === 'hi-IN'
                      ? '7. ओडिशा तटीय, चक्रवात एवं जनजातीय स्वास्थ्य केंद्र'
                      : '7. Odisha Cyclone, Coastal & Tribal Health Outposts')}
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'BSKY / NHM ଓଡ଼ିଶା' : (appLang === 'hi-IN' ? 'BSKY / NHM ओडिशा' : 'BSKY / NHM Odisha')}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1.5">
                  <strong>{appLang === 'or-IN' ? 'କ୍ଷେତ୍ର:' : (appLang === 'hi-IN' ? 'परिवेश:' : 'Setting:')}</strong>{' '}
                  {appLang === 'or-IN'
                    ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍ କଟକ, ପୁରୀ/ବାଲେଶ୍ୱର ଉପକୂଳ CHC, କୋରାପୁଟ/ମାଲକାନଗିରି ଆଦିବାସୀ କେନ୍ଦ୍ର।'
                    : (appLang === 'hi-IN'
                    ? 'एससीबी मेडिकल कॉलेज कटक, पुरी/बालासोर तटीय सीएचसी, कोरापुट/मलकानगिरी जनजातीय केंद्र।'
                    : 'SCB Medical College Cuttack, Puri/Balasore Coastal CHCs, Koraput/Malkangiri Tribal Outposts.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong>{' '}
                  {appLang === 'or-IN'
                    ? 'ବାତ୍ୟା ବନ୍ୟା ପରେ ପ୍ରବଳ ଜଳୀୟ ଝାଡ଼ା (କଲେରା ପ୍ରୋଟୋକଲ୍), ଗାଢ଼ ଚାହା ରଙ୍ଗର ପରିସ୍ରା ସହ ଜ୍ୱର (ଫାଲସିପାରମ୍ ମ୍ୟାଲେରିଆ), ଗଣ୍ଠି ଯନ୍ତ୍ରଣା ସହ ରକ୍ତହୀନତା (ସିକିଲ୍ ସେଲ୍ ସଙ୍କଟ)।'
                    : (appLang === 'hi-IN'
                    ? 'बाढ़ उपरांत तीव्र दस्त (हैजा प्रोटोकॉल), गहरे रंग का मूत्र एवं तेज बुखार (फाल्सीपेरम मलेरिया), जोड़ों में तीव्र दर्द एवं रक्ताल्पता (सिकल सेल संकट)।'
                    : 'Acute watery diarrhea post-cyclone flooding (Cholera protocol), fever with tea-colored urine (Severe Falciparum Malaria), severe joint crisis with pallor (Sickle Cell crisis).')}
                </p>
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN'
                    ? 'ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା (BSKY) ଜରିଆରେ ସିକିଲ୍ ସେଲ୍ ଡେ-କେୟାର ସେଣ୍ଟର୍ କିମ୍ବା ଜିଲ୍ଲା HDU କୁ ତୁରନ୍ତ ସ୍ଥାନାନ୍ତର।'
                    : (appLang === 'hi-IN'
                    ? 'बीजू स्वास्थ्य कल्याण योजना (BSKY) के तहत सिकल सेल डे-केयर केंद्र अथवा जिला HDU में तत्काल स्थानांतरण।'
                    : 'Biju Swasthya Kalyan Yojana (BSKY) expedited transfer to Sickle Cell Day-Care Center or District Infectious Disease HDU.')}
                </p>
              </div>

              {/* Scenario 1 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୧. ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ OPD ଧାଡ଼ି' : (appLang === 'hi-IN' ? '1. जिला अस्पताल ओपीडी कतार' : '1. Civil Hospital OPD Queue')}
                  </h3>
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ଅତ୍ୟଧିକ ଭିଡ଼' : (appLang === 'hi-IN' ? 'अत्यधिक भार' : 'High Volume')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN'
                    ? 'ପ୍ରତି ଶିଫ୍ଟ୍‌ରେ ୧୫୦-୨୦୦ ରୋଗୀ; ଜରୁରୀ ରୋଗୀ ଅଜ୍ଞାତ ଭାବେ ଘଣ୍ଟା ଘଣ୍ଟା ଅପେକ୍ଷା କରନ୍ତି।'
                    : (appLang === 'hi-IN'
                    ? 'प्रति शिफ्ट 150-200 मरीज; गंभीर मरीज घंटों कतार में बिना ध्यान दिए खड़े रहते हैं।'
                    : '150-200 patients per doctor shift; critical patients wait hours unnoticed.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong> SpO2 &lt; 92%, BP &gt; 180/110, {appLang === 'or-IN' ? 'ଛାତିରେ ଭୀଷଣ ଯନ୍ତ୍ରଣା' : (appLang === 'hi-IN' ? 'सीने में जकड़न' : 'sudden chest tightness')}.
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ତୁରନ୍ତ ଜରୁରୀକାଳୀନ ୱାର୍ଡ (Emergency Bay) କୁ ସ୍ଥାନାନ୍ତର।' : (appLang === 'hi-IN' ? 'तत्काल आपातकालीन वार्ड में प्रवेश।' : 'Immediate bypass to Emergency Bay.')}
                </p>
              </div>

              {/* Scenario 2 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୨. ଶିଳ୍ପାଞ୍ଚଳ କ୍ଲିନିକ୍ (MIDC/ପାରାଦ୍ୱୀପ)' : (appLang === 'hi-IN' ? '2. औद्योगिक क्षेत्र (MIDC/GIDC)' : '2. Industrial Estate (MIDC/GIDC)')}
                  </h3>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ବୃତ୍ତିଗତ ସ୍ୱାସ୍ଥ୍ୟ' : (appLang === 'hi-IN' ? 'व्यावसायिक' : 'Occupational')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ବିଷାକ୍ତ କେମିକାଲ୍ ଧୂଆଁ, ଏସିଡ୍ ସ୍ପ୍ଲାସ୍, ମେସିନାରୀ ଆଘାତ।' : (appLang === 'hi-IN' ? 'विषाक्त विलायक धुआं, एसिड के छींटे, मशीनरी चोटें।' : 'Toxic solvent fumes, caustic acid splashes, machinery crush injuries.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ନିଶ୍ୱାସ ନେବାରେ ଶବ୍ଦ (Stridor), ଆଖିରେ ଏସିଡ୍ ଆଘାତ।' : (appLang === 'hi-IN' ? 'गले में रुकावट, आंखों में जलन, क्रश सिंड्रोम।' : 'Chemical inhalation with stridor, ocular caustic burns, crush syndrome risk.')}
                </p>
                <p className="text-xs text-indigo-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ତୁରନ୍ତ ଆଖି ଧୋଇବା + ESIC ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍।' : (appLang === 'hi-IN' ? 'तुरंत आई-वॉश अलर्ट + ESIC अस्पताल फॉर्म 16 रेफरल।' : 'On-site eyewash alert + ESIC Hospital Form 16 referral.')}
                </p>
              </div>

              {/* Scenario 3 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୩. ଶିକ୍ଷାନୁଷ୍ଠାନ କ୍ୟାମ୍ପସ୍ ଜ୍ୱର ଟ୍ରାଏଜ୍' : (appLang === 'hi-IN' ? '3. परिसर बुखार ट्रायज (विश्वविद्यालय)' : '3. Campus Fever Triage (Universities)')}
                  </h3>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ସଂକ୍ରମଣ ସତର୍କତା' : (appLang === 'hi-IN' ? 'प्रकोप चेतावनी' : 'Outbreak Alert')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଛାତ୍ରାବାସରେ ଭାଇରାଲ୍ ଜ୍ୱରର ଦ୍ରୁତ ସଂକ୍ରମଣ।' : (appLang === 'hi-IN' ? 'हॉस्टल में वायरल बुखार का तेजी से प्रसार।' : 'Rapid transmission of viral febrile illnesses in student hostels.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଜ୍ୱର + ବେକ ଟାଣି ଧରିବା, ଚର୍ମରେ ନାଲି ଦାଗ, ଗୋଟିଏ ହଷ୍ଟେଲରୁ ୩ ରୁ ଅଧିକ ରୋଗୀ।' : (appLang === 'hi-IN' ? 'बुखार + गर्दन में अकड़न, चकत्ते, 1 ही विंग से 3 से अधिक मरीज।' : 'Fever + neck stiffness (meningism), petechiae, >3 cases from single wing.')}
                </p>
                <p className="text-xs text-blue-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଔଷଧାଳୟରେ ପୃଥକୀକରଣ + IDSP ବିଜ୍ଞପ୍ତି।' : (appLang === 'hi-IN' ? 'इन्फर्मरी आइसोलेशन + IDSP क्लस्टर अधिसूचना।' : 'Infirmary isolation + IDSP cluster notification.')}
                </p>
              </div>

              {/* Scenario 4 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୪. ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ ସେବା (ଗ୍ରାମୀଣ PHC / ANC)' : (appLang === 'hi-IN' ? '4. मातृ स्वास्थ्य (ग्रामीण PHC ANC)' : '4. Maternal Health (Rural PHC ANC)')}
                  </h3>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ମାତୃ ପ୍ରାଥମିକତା' : (appLang === 'hi-IN' ? 'मातृ प्राथमिकता' : 'MCH Priority')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଗର୍ଭାବସ୍ଥାରେ ପ୍ରି-ଏକ୍ଲାମ୍ପସିଆ ଏବଂ ଜଟିଳତା ଚିହ୍ନଟ।' : (appLang === 'hi-IN' ? 'प्री-एक्लेमप्सिया एवं जटिलताओं की समय पर पहचान।' : 'Early detection of pre-eclampsia and gestational complications.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong> BP &ge; 140/90, {appLang === 'or-IN' ? 'ଆଖିକୁ ଝାପ୍‌ସା ଦେଖାଯିବା, ପେଟ ଯନ୍ତ୍ରଣା' : (appLang === 'hi-IN' ? 'धुंधलापन, पेट में दर्द' : 'visual blurring, epigastric pain')}.
                </p>
                <p className="text-xs text-purple-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'FRU / DWH କୁ ତୁରନ୍ତ ରେଫରାଲ୍।' : (appLang === 'hi-IN' ? 'प्रथम रेफरल यूनिट (FRU) को तत्काल रेफरल।' : '1-Click transfer slip to First Referral Unit (FRU).')}
                </p>
              </div>

              {/* Scenario 5 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୫. ଅଣସଂକ୍ରାମକ ରୋଗ ଯାଞ୍ଚ (ଆୟୁଷ୍ମାନ ମନ୍ଦିର)' : (appLang === 'hi-IN' ? '5. दीर्घकालिक रोग जांच (आयुष्मान मंदिर)' : '5. Chronic NCD Check-in (Ayushman Mandir)')}
                  </h3>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ପ୍ରତିରୋଧକ' : (appLang === 'hi-IN' ? 'निवारक' : 'Preventive')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ମଧୁମେହ ଓ ଉଚ୍ଚ ରକ୍ତଚାପ ରୋଗୀଙ୍କ ନିୟମିତ ମାସିକ ଔଷଧ ଯାଞ୍ଚ।' : (appLang === 'hi-IN' ? 'हाइपरटेंशन एवं मधुमेह मरीजों की नियमित दवा रिफिल।' : 'Routine monthly refills for Hypertension and Diabetes patients.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong> RBS &gt; 350 mg/dL, {appLang === 'or-IN' ? '୭ ଦିନରୁ ଅଧିକ ଔଷଧ ନ ଖାଇବା' : (appLang === 'hi-IN' ? '7 दिन से अधिक दवा छूटना' : 'missed medication > 7 days')}.
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ସେହିଦିନ ଡାକ୍ତରୀ ଯାଞ୍ଚ + ଆଲବୁମିନ୍ ପରୀକ୍ଷା।' : (appLang === 'hi-IN' ? 'उसी दिन चिकित्सा अधिकारी समीक्षा।' : 'Same-day Medical Officer review + microalbuminuria test.')}
                </p>
              </div>

              {/* Scenario 6 */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {appLang === 'or-IN' ? '୬. ଭ୍ରାମ୍ୟମାଣ ଜନସ୍ୱାସ୍ଥ୍ୟ ଶିବିର' : (appLang === 'hi-IN' ? '6. मोबाइल जनस्वास्थ्य शिविर' : '6. Mobile Public Health Camp')}
                  </h3>
                  <span className="text-[10px] font-bold bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                    {appLang === 'or-IN' ? 'ଦୁର୍ଗମ ଅଞ୍ଚଳ' : (appLang === 'hi-IN' ? 'दूरस्थ / ऑफलाइन' : 'Remote / Offline')}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  <strong>{appLang === 'or-IN' ? 'ସମସ୍ୟା:' : (appLang === 'hi-IN' ? 'चुनौती:' : 'Challenge:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଦୁର୍ଗମ କିମ୍ବା ଆଦିବାସୀ ଅଞ୍ଚଳରେ ଇଣ୍ଟରନେଟ୍ ଅଭାବ।' : (appLang === 'hi-IN' ? 'दूरदराज के क्षेत्रों में इंटरनेट नेटवर्क की अनुपलब्धता।' : 'Zero or intermittent 2G internet in remote or tribal regions.')}
                </p>
                <p className="text-xs text-slate-700 mt-2">
                  <strong>{appLang === 'or-IN' ? 'ଲାଲ୍ ସଙ୍କେତ:' : (appLang === 'hi-IN' ? 'खतरे के लक्षण:' : 'Red Flags:')}</strong> MUAC &lt; 115mm ({appLang === 'or-IN' ? 'ଅତି ଗୁରୁତର ଅପପୁଷ୍ଟି' : (appLang === 'hi-IN' ? 'अति गंभीर कुपोषण' : 'Severe Acute Malnutrition')}), {appLang === 'or-IN' ? '୨ ସପ୍ତାହରୁ ଅଧିକ କାଶ ସହ ରକ୍ତ ପଡ଼ିବା' : (appLang === 'hi-IN' ? '2 सप्ताह से अधिक खांसी में खून' : 'cough > 2 weeks with hemoptysis')}.
                </p>
                <p className="text-xs text-rose-700 font-semibold mt-1">
                  <strong>{appLang === 'or-IN' ? 'କାର୍ଯ୍ୟାନୁଷ୍ଠାନ:' : (appLang === 'hi-IN' ? 'कार्रवाई:' : 'Action:')}</strong>{' '}
                  {appLang === 'or-IN' ? 'ଅଫଲାଇନ୍ ଡାଟା ସଂରକ୍ଷଣ + ଯକ୍ଷ୍ମା / NRC ରେଫରାଲ୍।' : (appLang === 'hi-IN' ? 'ऑफलाइन डाटा संधारण + टीबी / एनआरसी रेफरल।' : 'Offline IndexedDB queuing + TB / NRC referral slips.')}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-400">
        {uiText.footerText}
      </footer>
    </div>
  );
}
