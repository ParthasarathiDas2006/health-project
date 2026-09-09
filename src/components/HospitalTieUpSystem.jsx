import React, { useState, useEffect } from 'react';
import {
  Building2,
  ShieldCheck,
  Activity,
  Phone,
  MapPin,
  Clock,
  Search,
  FileText,
  CheckCircle2,
  Printer,
  X,
  ArrowRight,
  AlertTriangle,
  Award,
  HeartPulse,
  Send,
  Trash2,
  ExternalLink,
  ChevronRight,
  Calendar,
  Sparkles
} from 'lucide-react';
import { getHospitalTransfers, saveHospitalTransfer, cancelHospitalTransfer } from '../utils/authStorage';
import { getHospitalPartners, HOSPITAL_CITIES } from '../data/hospitalPartners';


/**
 * Hospital Tie-Up & Apex Referral Network
 * Features:
 * 1. Directory of major empaneled Apex & Multi-Specialty partner hospitals.
 * 2. Real-time live ICU bed, ventilator, and emergency bay tracker.
 * 3. Fast-track digital transfer pass generation with ABHA & Triage note link.
 * 4. Scheme filters (BSKY 100% Cashless, Ayushman Bharat PM-JAY, CGHS, ESIC).
 * 5. 100% pure trilingual localization: Odia ('or-IN'), Hindi ('hi-IN'), English ('en-IN').
 */
export default function HospitalTieUpSystem({ currentUser, appLang, onTransfersCountChange }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory' or 'my-transfers'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('ALL');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');

  // Fast-Track Transfer Modal States
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDept, setSelectedDept] = useState('');
  const [transferUrgency, setTransferUrgency] = useState('RED');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '');
  const [clinicalReason, setClinicalReason] = useState('');
  const [ambulanceRequired, setAmbulanceRequired] = useState(true);
  const [confirmedTransferSlip, setConfirmedTransferSlip] = useState(null);

  // Stored Transfers
  const [transfers, setTransfers] = useState(() => getHospitalTransfers());

  useEffect(() => {
    if (onTransfersCountChange) {
      onTransfersCountChange(transfers.length);
    }
  }, [transfers, onTransfersCountChange]);

  // Multilingual Text Dictionary
  const txt = {
    'or-IN': {
      tabDirectory: 'ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍ ନେଟୱାର୍କ (Apex Hospital Directory)',
      tabMyTransfers: 'ମୋର ରେଫରାଲ୍ ଓ ବେଡ୍ ବୁକିଂ (My Transfers)',
      networkBadge: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ସହବନ୍ଧିତା ନେଟୱାର୍କ',
      searchPlaceholder: 'ହସ୍ପିଟାଲ୍ ନାମ, ବିଶେଷଜ୍ଞ ବିଭାଗ କିମ୍ବା ସହର ଖୋଜନ୍ତୁ...',
      allSchemes: 'ସମସ୍ତ ସରକାରୀ ଯୋଜନା',
      bskyScheme: 'BSKY (୧୦୦% ନିଃଶୁଳ୍କ କ୍ୟାସଲେସ୍)',
      pmjayScheme: 'ଆୟୁଷ୍ମାନ ଭାରତ PM-JAY',
      allCities: 'ସମସ୍ତ ସହର',
      allSpecialties: 'ସମସ୍ତ ବିଶେଷଜ୍ଞ ବିଭାଗ',
      specTrauma: 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା (Level-1 Trauma & ICU)',
      specCardio: 'ହୃଦରୋଗ ଓ STEMI କେୟାର (Cardiology)',
      specOncology: 'କର୍କଟ ଚିକିତ୍ସା (Comprehensive Oncology)',
      specNephro: 'ବୃକ୍‌କ ଓ ଡାୟାଲିସିସ୍ (Nephrology & Dialysis)',
      specPedia: 'ନିଓନେଟାଲ୍ ଓ ଶିଶୁ ICU (Level-3 NICU/PICU)',
      partnerStatsTitle: 'ଲାଇଭ୍ ହସ୍ପିଟାଲ୍ ବେଡ୍ ଓ ଜରୁରୀକାଳୀନ ସ୍ଥିତି',
      totalPartners: 'ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍',
      availableIcu: 'ଉପଲବ୍ଧ ICU ବେଡ୍',
      availableVentilators: 'ଉପଲବ୍ଧ ଭେଣ୍ଟିଲେଟର୍',
      teleEmergencyReady: '୨୪x୭ ଟେଲି-ଇମରଜେନ୍ସି ସକ୍ରିୟ',
      bedsAvailable: 'ବେଡ୍ ଉପଲବ୍ଧ',
      fastTrackTransferBtn: 'ତୁରନ୍ତ ରେଫରାଲ୍ ଓ ବେଡ୍ ସଂରକ୍ଷଣ',
      emergencyHelpline: 'ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍:',
      schemesEmpaneled: 'ଅନ୍ତର୍ଭୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା:',
      tieUpProtocols: 'ସହବନ୍ଧିତା ସୁବିଧା ଓ ପ୍ରୋଟୋକଲ୍:',
      modalTitle: 'ହସ୍ପିଟାଲ୍ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ରେଫରାଲ୍ ଓ ବେଡ୍ ସଂରକ୍ଷଣ ଫର୍ମ',
      step1Hospital: '୧. ଚୟନିତ ଆପେକ୍ସ ହସ୍ପିଟାଲ୍:',
      step2Dept: '୨. ସ୍ଥାନାନ୍ତର ବିଭାଗ (Target Department) ଚୟନ କରନ୍ତୁ *:',
      step3Urgency: '୩. ଟ୍ରାଏଜ୍ ପ୍ରାଥମିକତା ସ୍ତର (Clinical Urgency) *:',
      urgencyRed: 'RED (ତୁରନ୍ତ ଜରୁରୀକାଳୀନ / ICU)',
      urgencyYellow: 'YELLOW (ଅଗ୍ରାଧିକାର ପରାମର୍ଶ / HDU)',
      urgencyGreen: 'GREEN (ସାଧାରଣ ସ୍ପେଶାଲିଷ୍ଟ OPD)',
      step4Details: '୪. ରୋଗୀ ଓ ଆୟୁଷ୍ମାନ ବିବରଣୀ:',
      nameLabel: 'ରୋଗୀଙ୍କ ନାମ *',
      phoneLabel: 'ଯୋଗାଯୋଗ ନମ୍ବର *',
      abhaLabel: 'ABHA ଆଇଡି / ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ନମ୍ବର *',
      reasonLabel: 'କ୍ଲିନିକାଲ୍ ସ୍ଥାନାନ୍ତରଣର କାରଣ ଓ ଲକ୍ଷଣ',
      reasonPlaceholder: 'ଉଦାହରଣ: SpO2 ୯୧%, ପ୍ଲେଟଲେଟ୍ ୪୨,୦୦୦, ତୁରନ୍ତ ଆଇସିୟୁ କେୟାର ଆବଶ୍ୟକ...',
      ambulanceCheckbox: '୧୦୮ / ହସ୍ପିଟାଲ୍ ଆମ୍ବୁଲାନ୍ସ ଏବଂ ଗ୍ରୀନ୍ କରିଡର୍ ସହାୟତା ଆବଶ୍ୟକ',
      confirmTransferBtn: 'ଡିଜିଟାଲ୍ ରେଫରାଲ୍ ପାସ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      passTitle: 'ଅଫିସିଆଲ୍ ଆପେକ୍ସ ହସ୍ପିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍ (Digital Transfer Token)',
      passSubtitle: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ • ABDM e-Hospital Protocol',
      tokenLabel: 'ଟ୍ରାନ୍ସଫର୍ ଟୋକନ୍:',
      referralIdLabel: 'ରେଫରାଲ୍ ଆଇଡି:',
      destinationLabel: 'ଗନ୍ତବ୍ୟ ହସ୍ପିଟାଲ୍:',
      departmentLabel: 'ଉଦ୍ଦିଷ୍ଟ ବିଭାଗ / ବ୍ଲକ୍:',
      assignedCounter: 'ରିପୋର୍ଟିଂ କାଉଣ୍ଟର୍ / ଇମରଜେନ୍ସି ବେ:',
      emergencyOfficer: 'ହସ୍ପିଟାଲ୍ କୋଅର୍ଡିନେଟର୍:',
      statusApproved: 'ଅନୁମୋଦିତ ଏବଂ ବେଡ୍ ସଂରକ୍ଷିତ (Approved & Reserved)',
      printSlip: 'ଡିଜିଟାଲ୍ ପାସ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noTransfers: 'କୌଣସି ସକ୍ରିୟ ହସ୍ପିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ରେକର୍ଡ ନାହିଁ।',
      cancelTransferConfirm: 'ଆପଣ ଏହି ସ୍ଥାନାନ୍ତରଣ ପାସ୍ ବାତିଲ୍ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      transferSuccessAlert: 'ହସ୍ପିଟାଲ୍ ଡିଜିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍ ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!',
      viewOnMap: 'ହସ୍ପିଟାଲ୍ ସ୍ଥାନ',
      bhubaneswar: 'ଭୁବନେଶ୍ୱର',
      cuttack: 'କଟକ',
      national: 'ଜାତୀୟ ନେଟୱାର୍କ'
    },
    'hi-IN': {
      tabDirectory: 'संबद्ध अस्पताल नेटवर्क (Apex Hospital Directory)',
      tabMyTransfers: 'मेरे रेफरल एवं बेड आरक्षण (My Transfers)',
      networkBadge: 'राष्ट्रीय स्वास्थ्य संबद्धता नेटवर्क',
      searchPlaceholder: 'अस्पताल का नाम, विशेषज्ञता या शहर खोजें...',
      allSchemes: 'सभी सरकारी योजनाएं',
      bskyScheme: 'BSKY (100% कैशलेस)',
      pmjayScheme: 'आयुष्मान भारत PM-JAY',
      allCities: 'सभी शहर',
      allSpecialties: 'सभी विशेषज्ञ विभाग',
      specTrauma: 'आपातकालीन एवं ट्रॉमा (Level-1 Trauma & ICU)',
      specCardio: 'हृदय रोग एवं STEMI केयर (Cardiology)',
      specOncology: 'कैंसर संस्थान (Comprehensive Oncology)',
      specNephro: 'गुर्दा रोग एवं डायलिसिस (Nephrology & Dialysis)',
      specPedia: 'शिशु गहन चिकित्सा (Level-3 NICU/PICU)',
      partnerStatsTitle: 'लाइव अस्पताल बेड एवं आपातकालीन स्थिति',
      totalPartners: 'संबद्ध अस्पताल',
      availableIcu: 'उपलब्ध ICU बेड',
      availableVentilators: 'उपलब्ध वेंटिलेटर',
      teleEmergencyReady: '24x7 टेली-इमरजेंसी सक्रिय',
      bedsAvailable: 'बेड उपलब्ध',
      fastTrackTransferBtn: 'फास्ट-ट्रैक रेफरल एवं बेड बुक करें',
      emergencyHelpline: 'आपातकालीन हेल्पलाइन:',
      schemesEmpaneled: 'संबद्ध स्वास्थ्य योजनाएं:',
      tieUpProtocols: 'संबद्धता सुविधाएं एवं प्रोटोकॉल:',
      modalTitle: 'अस्पताल डिजिटल रेफरल एवं बेड आरक्षण फॉर्म',
      step1Hospital: '1. चयनित एपेक्स अस्पताल:',
      step2Dept: '2. स्थानांतरण विभाग (Target Department) चुनें *:',
      step3Urgency: '3. क्लिनिकल प्राथमिकता (Clinical Urgency) *:',
      urgencyRed: 'RED (तत्काल आपातकालीन / ICU)',
      urgencyYellow: 'YELLOW (प्राथमिकता परामर्श / HDU)',
      urgencyGreen: 'GREEN (सामान्य विशेषज्ञ OPD)',
      step4Details: '4. मरीज एवं आयुष्मान विवरण:',
      nameLabel: 'मरीज का नाम *',
      phoneLabel: 'संपर्क मोबाइल *',
      abhaLabel: 'ABHA आईडी / राष्ट्रीय स्वास्थ्य आईडी *',
      reasonLabel: 'क्लिनिकल स्थानांतरण का कारण एवं लक्षण',
      reasonPlaceholder: 'उदा. SpO2 91%, प्लेटलेट 42,000, तत्काल ICU निगरानी आवश्यक...',
      ambulanceCheckbox: '108 / अस्पताल एम्बुलेंस एवं ग्रीन कॉरिडोर सहायता की आवश्यकता है',
      confirmTransferBtn: 'डिजिटल रेफरल पास बनाएं',
      cancelBtn: 'रद्द करें',
      passTitle: 'आधिकारिक एपेक्स अस्पताल स्थानांतरण पास (Digital Transfer Token)',
      passSubtitle: 'राष्ट्रीय स्वास्थ्य मिशन • ABDM e-Hospital Protocol',
      tokenLabel: 'ट्रांसफर टोकन:',
      referralIdLabel: 'रेफरल आईडी:',
      destinationLabel: 'गंतव्य अस्पताल:',
      departmentLabel: 'लक्ष्य विभाग / विंग:',
      assignedCounter: 'रिपोर्टिंग काउंटर / इमरजेंसी बे:',
      emergencyOfficer: 'अस्पताल समन्वयक:',
      statusApproved: 'स्वीकृत एवं बेड आरक्षित (Approved & Reserved)',
      printSlip: 'डिजिटल पास प्रिंट करें',
      closeBtn: 'बंद करें',
      noTransfers: 'कोई सक्रिय अस्पताल स्थानांतरण रिकॉर्ड नहीं मिला।',
      cancelTransferConfirm: 'क्या आप इस स्थानांतरण पास को रद्द करना चाहते हैं?',
      transferSuccessAlert: 'अस्पताल डिजिटल स्थानांतरण पास सफलतापूर्वक तैयार हो गया!',
      viewOnMap: 'स्थान देखें',
      bhubaneswar: 'भुवनेश्वर',
      cuttack: 'कटक',
      national: 'राष्ट्रीय नेटवर्क'
    },
    'en-IN': {
      tabDirectory: 'Empaneled Apex Hospital Directory',
      tabMyTransfers: 'My Transfers & Bed Reservations',
      networkBadge: 'Apex Hospital Tie-Up Network',
      searchPlaceholder: 'Search hospital name, specialty, or city...',
      allSchemes: 'All Health Schemes',
      bskyScheme: 'BSKY (100% Cashless Treatment)',
      pmjayScheme: 'Ayushman Bharat PM-JAY',
      allCities: 'All Locations',
      allSpecialties: 'All Super-Specialties',
      specTrauma: 'Emergency & Level-1 Trauma ICU',
      specCardio: 'Cardiology & STEMI Corridor',
      specOncology: 'Comprehensive Cancer Care',
      specNephro: 'Nephrology & Dialysis Unit',
      specPedia: 'Pediatric & Level-3 NICU',
      partnerStatsTitle: 'Live Apex Network Capacity & Bed Tracker',
      totalPartners: 'Empaneled Apex Hospitals',
      availableIcu: 'Available ICU Beds',
      availableVentilators: 'Active Ventilators',
      teleEmergencyReady: '24x7 Tele-Emergency Desk',
      bedsAvailable: 'Beds Available',
      fastTrackTransferBtn: 'Fast-Track Transfer & Reserve Bed',
      emergencyHelpline: 'Emergency Triage Hotline:',
      schemesEmpaneled: 'Empaneled Cashless Schemes:',
      tieUpProtocols: 'Tie-Up Privileges & Protocols:',
      modalTitle: 'Fast-Track Apex Transfer & Bed Reservation Slip',
      step1Hospital: '1. Selected Apex Hospital:',
      step2Dept: '2. Target Admission Department *:',
      step3Urgency: '3. Clinical Urgency Tier *:',
      urgencyRed: 'RED (Immediate Critical Care / ICU)',
      urgencyYellow: 'YELLOW (Priority Care / HDU Transfer)',
      urgencyGreen: 'GREEN (Specialist OPD / Day-Care)',
      step4Details: '4. Patient & Health ID Details:',
      nameLabel: 'Patient Full Name *',
      phoneLabel: 'Contact Mobile *',
      abhaLabel: 'ABHA ID / National Health ID *',
      reasonLabel: 'Clinical Transfer Indication & Summary',
      reasonPlaceholder: 'e.g. SpO2 91%, Platelets 42,000, suspected Dengue Shock, urgent HDU admission required...',
      ambulanceCheckbox: 'Require 108 / Hospital Ambulance Dispatch with Green Corridor Coordination',
      confirmTransferBtn: 'Generate Official Digital Transfer Token',
      cancelBtn: 'Cancel',
      passTitle: 'Official Apex Hospital Inter-Facility Transfer Pass',
      passSubtitle: 'National Health Mission • ABDM e-Hospital Transit Protocol',
      tokenLabel: 'Transfer Token:',
      referralIdLabel: 'Referral ID:',
      destinationLabel: 'Destination Hospital:',
      departmentLabel: 'Assigned Department / Wing:',
      assignedCounter: 'Reporting Triage Counter:',
      emergencyOfficer: 'Apex Bed Coordinator:',
      statusApproved: 'Confirmed & Fast-Track Reserved',
      printSlip: 'Print Digital Transfer Pass',
      closeBtn: 'Close',
      noTransfers: 'No active hospital transfers found.',
      cancelTransferConfirm: 'Are you sure you want to cancel this transfer booking?',
      transferSuccessAlert: 'Apex hospital digital transfer pass successfully created!',
      viewOnMap: 'View Location',
      bhubaneswar: 'Bhubaneswar',
      cuttack: 'Cuttack',
      national: 'National Network'
    }
  }[lang] || {};

  // Partner Apex Hospitals Master Database (All Cities & Locations)
  const hospitalsList = getHospitalPartners(lang);

  // Filtering Logic
  const filteredHospitals = hospitalsList.filter((hosp) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      hosp.name.toLowerCase().includes(q) ||
      hosp.city.toLowerCase().includes(q) ||
      hosp.cityLabel.toLowerCase().includes(q) ||
      hosp.address.toLowerCase().includes(q) ||
      hosp.departments.some((d) => d.toLowerCase().includes(q));

    const matchesScheme =
      selectedScheme === 'ALL' || hosp.schemes.includes(selectedScheme);

    const matchesCity =
      selectedCity === 'ALL' || hosp.city === selectedCity;

    const matchesSpecialty =
      selectedSpecialty === 'ALL' || hosp.specialtyCategory === selectedSpecialty;

    return matchesSearch && matchesScheme && matchesCity && matchesSpecialty;

  });

  // Capacity Totals
  const totalBedsCount = hospitalsList.reduce((acc, h) => acc + h.totalBeds, 0);
  const totalIcuBedsCount = hospitalsList.reduce((acc, h) => acc + h.availableIcuBeds, 0);
  const totalVentilatorsCount = hospitalsList.reduce((acc, h) => acc + h.availableVentilators, 0);

  // Open Transfer Booking Modal
  const handleInitiateTransfer = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDept(hospital.departments[0] || '');
    setTransferUrgency('RED');
    setClinicalReason('');
    setAmbulanceRequired(true);
  };

  // Submit Fast-Track Transfer
  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    if (!selectedHospital || !selectedDept) return;

    const transferId = `APX-TRF-${Math.floor(100000 + Math.random() * 900000)}`;
    const tokenNo = `T-${Math.floor(10 + Math.random() * 89)}`;

    const newTransfer = {
      id: transferId,
      tokenNo,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      hospitalCity: selectedHospital.city,
      department: selectedDept,
      urgency: transferUrgency,
      patientName: patientName || currentUser?.name || 'Patient Citizen',
      patientPhone: patientPhone || currentUser?.phone || 'Not Provided',
      patientAbha: patientAbha || currentUser?.staffId || 'ABHA-VERIFIED',
      clinicalReason: clinicalReason || 'Urgent apex medical evaluation requested via multimodal triage',
      ambulanceRequired,
      counter: selectedHospital.counter,
      coordinator: selectedHospital.coordinator,
      phone: selectedHospital.phone,
      referringFacility: currentUser?.facility || 'Primary Health Center (PHC)',
      referringClinician: currentUser?.name || 'Assigned Medical Officer',
      createdAt: new Date().toISOString()
    };

    const updated = saveHospitalTransfer(newTransfer);
    setTransfers(updated);
    setConfirmedTransferSlip(newTransfer);
    setSelectedHospital(null);
  };

  // Cancel Booking
  const handleCancelBooking = (id) => {
    if (window.confirm(txt.cancelTransferConfirm)) {
      const updated = cancelHospitalTransfer(id);
      setTransfers(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      {/* Network Header Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-2 rounded-xl shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                    {txt.tabDirectory}
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    {txt.networkBadge}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'or-IN'
                    ? 'AIIMS, SCB, Apollo, KIMS ଓ Tata Memorial ସହିତ ଡିଜିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ଓ ନିଃଶୁଳ୍କ BSKY/ଆୟୁଷ୍ମାନ ସେବା'
                    : (lang === 'hi-IN'
                    ? 'AIIMS, SCB, Apollo, KIMS एवं Tata Memorial के साथ फास्ट-ट्रैक ट्रांसफर एवं कैशलेस BSKY/PM-JAY सुविधाएं'
                    : 'Fast-Track Emergency Transfers, Tele-ICU Escalations & Cashless BSKY/PM-JAY Apex Care')}
                </p>
              </div>
            </div>
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('directory')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'directory'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>{txt.tabDirectory.split('(')[0]}</span>
              <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {hospitalsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('my-transfers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeSubTab === 'my-transfers'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>{txt.tabMyTransfers.split('(')[0]}</span>
              {transfers.length > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                  {transfers.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Live Network Bed Tracker KPI bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-slate-400 text-[11px] block">{txt.totalPartners}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-slate-900">{hospitalsList.length}</span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                100% Verified
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
            <span className="text-rose-700 text-[11px] block font-semibold">{txt.availableIcu}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-rose-900">{totalIcuBedsCount}</span>
              <span className="text-[10px] text-rose-600 font-medium">
                {lang === 'or-IN' ? 'ତୁରନ୍ତ ଉପଲବ୍ଧ' : (lang === 'hi-IN' ? 'तत्काल उपलब्ध' : 'Live Ready')}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200">
            <span className="text-blue-700 text-[11px] block font-semibold">{txt.availableVentilators}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-blue-900">{totalVentilatorsCount}</span>
              <span className="text-[10px] text-blue-600 font-medium">Active HDU</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-emerald-700 text-[11px] block font-semibold">{txt.teleEmergencyReady}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-900">100% Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: HOSPITAL DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          {/* Filters & Search Toolbar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={txt.searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400"
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

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Scheme Filter */}
              <select
                value={selectedScheme}
                onChange={(e) => setSelectedScheme(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">{txt.allSchemes}</option>
                <option value="BSKY">{txt.bskyScheme}</option>
                <option value="PMJAY">{txt.pmjayScheme}</option>
              </select>

              {/* City Filter */}
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer max-w-[200px]"
              >
                <option value="ALL">
                  {txt.allCities} ({hospitalsList.length})
                </option>
                <optgroup label={lang === 'or-IN' ? 'ଓଡ଼ିଶାର ସହର ସମୂହ (Odisha Locations)' : (lang === 'hi-IN' ? 'ओडिशा के शहर (Odisha Locations)' : 'Odisha Locations')}>
                  {HOSPITAL_CITIES.filter((c) => c.region === 'Odisha').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[lang] || c.name['en-IN']}
                    </option>
                  ))}
                </optgroup>
                <optgroup label={lang === 'or-IN' ? 'ଜାତୀୟ ଏପେକ୍ସ ମେଟ୍ରୋ (National Metros)' : (lang === 'hi-IN' ? 'राष्ट्रीय शीर्ष मेट्रो (National Metros)' : 'National Apex Metro Hubs')}>
                  {HOSPITAL_CITIES.filter((c) => c.region === 'National').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name[lang] || c.name['en-IN']}
                    </option>
                  ))}
                </optgroup>
              </select>

              {/* Specialty Filter */}
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-2 font-medium outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="ALL">{txt.allSpecialties}</option>
                <option value="Trauma">{txt.specTrauma}</option>
                <option value="Cardio">{txt.specCardio}</option>
                <option value="Oncology">{txt.specOncology}</option>
                <option value="Nephro">{txt.specNephro}</option>
                <option value="Pedia">{txt.specPedia}</option>
              </select>
            </div>
          </div>

          {/* Hospitals Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredHospitals.map((hospital) => (
              <div
                key={hospital.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar: Name & Tier Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl bg-gradient-to-br ${hospital.badgeColor} text-white flex items-center justify-center font-extrabold text-sm shadow-xs shrink-0`}
                      >
                        {hospital.name.slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {hospital.name}
                        </h3>
                        <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">
                          {hospital.tier}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 bg-slate-100 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded border border-slate-200">
                      {hospital.cityLabel}
                    </span>
                  </div>

                  {/* Address & Emergency Helpline */}
                  <div className="space-y-1 text-xs text-slate-600 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hospital.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-rose-700 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>{txt.emergencyHelpline} <strong>{hospital.phone}</strong></span>
                    </div>
                  </div>

                  {/* Bed & ICU Capacity Badges */}
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="text-[10px] text-slate-500 block">Total Beds</span>
                      <strong className="text-slate-900 text-xs font-extrabold">{hospital.totalBeds}+</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-rose-50 border border-rose-200">
                      <span className="text-[10px] text-rose-700 block font-semibold">Available ICU</span>
                      <strong className="text-rose-900 text-xs font-extrabold">{hospital.availableIcuBeds} Beds</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-50 border border-blue-200">
                      <span className="text-[10px] text-blue-700 block font-semibold">Ventilators</span>
                      <strong className="text-blue-900 text-xs font-extrabold">{hospital.availableVentilators} Units</strong>
                    </div>
                  </div>

                  {/* Key Departments */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {lang === 'or-IN' ? 'ବିଶେଷଜ୍ଞ ୱିଙ୍ଗ୍ ଓ ଇମରଜେନ୍ସି ବେ:' : (lang === 'hi-IN' ? 'विशेषज्ञ विंग एवं इमरजेंसी बे:' : 'Key Super-Specialty Wings:')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.departments.map((dept, i) => (
                        <span
                          key={i}
                          className="bg-indigo-50 text-indigo-800 text-[11px] font-medium px-2 py-0.5 rounded-md border border-indigo-100"
                        >
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Schemes Empaneled */}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      {txt.schemesEmpaneled}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hospital.schemeLabels.map((sc, i) => (
                        <span
                          key={i}
                          className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          {sc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tie-Up Privileges */}
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950">
                    <span className="font-bold block text-[11px] text-amber-900 mb-0.5">
                      {txt.tieUpProtocols}
                    </span>
                    <p className="text-[11px] text-amber-900/90 leading-relaxed">
                      {hospital.protocols}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-500">
                    <span>{txt.emergencyOfficer}: </span>
                    <strong className="text-slate-800">{hospital.coordinator.split('(')[0]}</strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleInitiateTransfer(hospital)}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{txt.fastTrackTransferBtn}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: MY TRANSFERS & BOOKINGS */}
      {activeSubTab === 'my-transfers' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {txt.tabMyTransfers}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'or-IN'
                  ? 'ଆପଣଙ୍କ ଦ୍ୱାରା ପ୍ରସ୍ତୁତ ହୋଇଥିବା ଡିଜିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍ ଏବଂ ବେଡ୍ ବୁକିଂ ତାଲିକା'
                  : (lang === 'hi-IN'
                  ? 'आपके द्वारा जारी किए गए डिजिटल अस्पताल स्थानांतरण पास एवं बेड आरक्षण की सूची'
                  : 'Active Digital Inter-Hospital Transfer Tokens & Bed Reservations')}
              </p>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              {transfers.length} {lang === 'or-IN' ? 'ଟି ରେକର୍ଡ' : (lang === 'hi-IN' ? 'रिकॉर्ड' : 'Records')}
            </span>
          </div>

          {transfers.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-xs font-medium">{txt.noTransfers}</p>
              <button
                type="button"
                onClick={() => setActiveSubTab('directory')}
                className="mt-2 text-xs font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
              >
                <span>{txt.fastTrackTransferBtn}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {item.patientName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          item.urgency === 'RED'
                            ? 'bg-rose-100 text-rose-800'
                            : item.urgency === 'YELLOW'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.urgency} URGENCY
                      </span>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {item.id}
                      </span>
                    </div>

                    <div className="text-slate-600 text-[11px] flex flex-wrap items-center gap-3">
                      <span><strong>{txt.destinationLabel}</strong> {item.hospitalName}</span>
                      <span>•</span>
                      <span><strong>{txt.departmentLabel}</strong> {item.department}</span>
                      <span>•</span>
                      <span>{new Date(item.createdAt).toLocaleDateString(lang === 'or-IN' ? 'or-IN' : (lang === 'hi-IN' ? 'hi-IN' : 'en-IN'))}</span>
                    </div>

                    <div className="text-slate-500 text-[11px]">
                      <strong>{txt.assignedCounter} </strong> {item.counter} ({item.coordinator})
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => setConfirmedTransferSlip(item)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-slate-500" />
                      <span>{txt.printSlip}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCancelBooking(item.id)}
                      className="px-2.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-lg font-semibold text-xs flex items-center gap-1"
                      title={txt.cancelBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: FAST-TRACK TRANSFER INITIATION FORM */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden font-sans animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-sm">
                  {txt.modalTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedHospital(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleConfirmTransfer} className="p-5 space-y-4 text-xs text-slate-700 max-h-[78vh] overflow-y-auto">
              {/* Selected Hospital Info Card */}
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-700">
                  {txt.step1Hospital}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{selectedHospital.name}</h4>
                <p className="text-[11px] text-slate-600">{selectedHospital.tier} • {selectedHospital.cityLabel}</p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-semibold text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{selectedHospital.schemeLabels.join(' • ')}</span>
                </div>
              </div>

              {/* Department Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {txt.step2Dept}
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:border-indigo-500"
                >
                  {selectedHospital.departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency Selector */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">
                  {txt.step3Urgency}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('RED')}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      transferUrgency === 'RED'
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    RED (Critical)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('YELLOW')}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      transferUrgency === 'YELLOW'
                        ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    YELLOW (Priority)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('GREEN')}
                    className={`p-2 rounded-lg border font-bold text-center transition-all ${
                      transferUrgency === 'GREEN'
                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    GREEN (Routine)
                  </button>
                </div>
              </div>

              {/* Patient Details */}
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <span className="font-bold text-slate-800 block">
                  {txt.step4Details}
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">{txt.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-600 block mb-0.5">{txt.phoneLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-0.5">{txt.abhaLabel}</label>
                  <input
                    type="text"
                    required
                    value={patientAbha}
                    onChange={(e) => setPatientAbha(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-600 block mb-0.5">{txt.reasonLabel}</label>
                  <textarea
                    rows={2}
                    value={clinicalReason}
                    onChange={(e) => setClinicalReason(e.target.value)}
                    placeholder={txt.reasonPlaceholder}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:border-indigo-500"
                  />
                </div>

                {/* 108 Ambulance Dispatch Checkbox */}
                <label className="flex items-center gap-2 p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl cursor-pointer">
                  <input
                    type="checkbox"
                    checked={ambulanceRequired}
                    onChange={(e) => setAmbulanceRequired(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span className="text-[11px] font-semibold text-rose-950">
                    {txt.ambulanceCheckbox}
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHospital(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  {txt.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{txt.confirmTransferBtn}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CONFIRMED TRANSFER DIGITAL PASS SLIP */}
      {confirmedTransferSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden font-sans animate-fadeIn">
            {/* Slip Top Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {txt.passTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setConfirmedTransferSlip(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body Content */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between border-b pb-3 text-slate-500">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{txt.referralIdLabel}</span>
                  <strong className="font-mono text-slate-900 text-sm">{confirmedTransferSlip.id}</strong>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">{txt.tokenLabel}</span>
                  <strong className="font-mono text-indigo-700 text-base">{confirmedTransferSlip.tokenNo}</strong>
                </div>
              </div>

              {/* Status Banner */}
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <div>
                    <strong className="text-xs block">{txt.statusApproved}</strong>
                    <span className="text-[11px] text-emerald-700">
                      {confirmedTransferSlip.ambulanceRequired
                        ? (lang === 'or-IN' ? '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଏବଂ ଗ୍ରୀନ୍ କରିଡର୍ ସୂଚିତ ହୋଇଛି' : (lang === 'hi-IN' ? '108 एम्बुलेंस एवं ग्रीन कॉरिडोर अधिसूचित' : '108 Ambulance & Green Corridor Dispatch Notified'))
                        : (lang === 'or-IN' ? 'ସ୍ୱୟଂ ଯାତାୟାତ ସ୍ଥାନାନ୍ତର' : (lang === 'hi-IN' ? 'स्वयं परिवहन स्थानांतरण' : 'Self-Transit Transit Pass'))}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                    confirmedTransferSlip.urgency === 'RED'
                      ? 'bg-rose-600 text-white'
                      : confirmedTransferSlip.urgency === 'YELLOW'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {confirmedTransferSlip.urgency} URGENCY
                </span>
              </div>

              {/* Hospital & Department Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">{txt.destinationLabel}</span>
                  <p className="font-bold text-slate-900 text-xs mt-0.5">{confirmedTransferSlip.hospitalName}</p>
                  <p className="text-[11px] text-slate-500">{confirmedTransferSlip.hospitalCity}</p>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                  <span className="text-[10px] uppercase font-bold text-indigo-600 block">{txt.departmentLabel}</span>
                  <p className="font-bold text-indigo-900 text-xs mt-0.5">{confirmedTransferSlip.department}</p>
                  <p className="text-[11px] text-indigo-700">{confirmedTransferSlip.counter}</p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="p-3 bg-slate-50 rounded-lg border space-y-1">
                <div className="flex justify-between">
                  <span>Patient: <strong>{confirmedTransferSlip.patientName}</strong></span>
                  <span>Contact: <strong>{confirmedTransferSlip.patientPhone}</strong></span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>ABHA: <strong className="font-mono text-slate-700">{confirmedTransferSlip.patientAbha}</strong></span>
                  <span>From: <strong>{confirmedTransferSlip.referringFacility}</strong></span>
                </div>
              </div>

              {/* Clinical Indication */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">Clinical Indication:</span>
                <p className="p-2.5 bg-slate-50 border rounded text-slate-800">
                  {confirmedTransferSlip.clinicalReason}
                </p>
              </div>

              {/* Apex Coordinator Contact */}
              <div className="border-t pt-3 flex justify-between items-center text-[11px] text-slate-500">
                <div>
                  <span>Coordinator: <strong>{confirmedTransferSlip.coordinator}</strong></span>
                  <p>Helpline: <strong>{confirmedTransferSlip.phone}</strong></p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{confirmedTransferSlip.referringClinician}</p>
                  <span className="text-[10px] text-slate-400">Referring Medical Officer</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{txt.printSlip}</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmedTransferSlip(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors"
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
