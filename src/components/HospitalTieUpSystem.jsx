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
  Sparkles,
  Ambulance,
  LifeBuoy,
  CreditCard,
  UserCheck,
  Stethoscope
} from 'lucide-react';
import { getHospitalTransfers, saveHospitalTransfer, cancelHospitalTransfer } from '../utils/authStorage';
import { getHospitalPartners, HOSPITAL_CITIES } from '../data/hospitalPartners';

/**
 * Swasthya Mitra - 5 Section Integrated Healthcare Support System
 * 
 * 5 Sections:
 * 1. 🏥 Empaneled Hospital Directory & Search (30 Odisha Districts + 6 Metros)
 * 2. 🛏️ Live Bed & ICU Capacity Tracker (Real-time ICU/Ventilator status)
 * 3. 🎫 Digital Fast-Track Transfer Pass (ABHA Linked Referral Token)
 * 4. 🚑 Emergency 108 Dispatch & Tele-ICU Hotline (Instant Helpdesks)
 * 5. 📜 BSKY & PM-JAY Cashless Helpdesk (₹5L/₹10L Scheme Guidance)
 */
export default function HospitalTieUpSystem({ currentUser, appLang, onTransfersCountChange }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  // Active Section State (1 through 5)
  const [activeSection, setActiveSection] = useState('sec-directory'); // 'sec-directory' | 'sec-bedtracker' | 'sec-transfers' | 'sec-emergency' | 'sec-schemes'

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
      systemTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ୫-ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ସହାୟତା ପୋର୍ଟାଲ୍',
      systemSubtitle: 'ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା ଓ ଜାତୀୟ ହସ୍ପିଟାଲ୍ ସହବନ୍ଧିତା, ଲାଇଭ୍ ବେଡ୍, ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଓ BSKY ସହାୟତା',
      networkBadge: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସେବା',
      
      // 5 Sections Nav
      sec1: '୧. ହସ୍ପିଟାଲ୍ ଡାଇରେକ୍ଟରୀ',
      sec2: '୨. ଲାଇଭ୍ ବେଡ୍ ଓ ICU ଟ୍ରାକର୍',
      sec3: '୩. ଡିଜିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍',
      sec4: '୪. ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଓ ଟେଲି-ICU',
      sec5: '୫. BSKY / PM-JAY ସହାୟତା',

      searchPlaceholder: 'ହସ୍ପିଟାଲ୍ ନାମ, ବିଶେଷଜ୍ଞ ବିଭାଗ କିମ୍ବା ୩୦ଟି ଜିଲ୍ଲା ଖୋଜନ୍ତୁ...',
      allSchemes: 'ସମସ୍ତ ସରକାରୀ ଯୋଜନା',
      bskyScheme: 'BSKY (୧୦୦% ନିଃଶୁଳ୍କ କ୍ୟାସଲେସ୍)',
      pmjayScheme: 'ଆୟୁଷ୍ମାନ ଭାରତ PM-JAY',
      allCities: 'ସମସ୍ତ ୩୦ଟି ଜିଲ୍ଲା ଓ ମେଟ୍ରୋ',
      allSpecialties: 'ସମସ୍ତ ବିଶେଷଜ୍ଞ ବିଭାଗ',
      specTrauma: 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା (Level-1 Trauma & ICU)',
      specCardio: 'ହୃଦରୋଗ ଓ STEMI କେୟାର (Cardiology)',
      specOncology: 'କର୍କଟ ଚିକିତ୍ସା (Comprehensive Oncology)',
      specNephro: 'ବୃକ୍‌କ ଓ ଡାୟାଲିସିସ୍ (Nephrology & Dialysis)',
      specPedia: 'ନିଓନେଟାଲ୍ ଓ ଶିଶୁ ICU (Level-3 NICU/PICU)',

      partnerStatsTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଲାଇଭ୍ ବେଡ୍ ଓ ଜରୁରୀକାଳୀନ କ୍ଷମତା',
      totalPartners: 'ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍',
      availableIcu: 'ଉପଲବ୍ଧ ICU ବେଡ୍',
      availableVentilators: 'ଉପଲବ୍ଧ ଭେଣ୍ଟିଲେଟର୍',
      teleEmergencyReady: '୨୪x୭ ଟେଲି-ଇମରଜେନ୍ସି ସକ୍ରିୟ',
      bedsAvailable: 'ବେଡ୍ ଉପଲବ୍ଧ',
      fastTrackTransferBtn: 'ତୁରନ୍ତ ରେଫରାଲ୍ ଓ ବେଡ୍ ସଂରକ୍ଷଣ',
      emergencyHelpline: 'ଜରୁରୀକାଳୀନ ହେଲ୍ପଲାଇନ୍:',
      schemesEmpaneled: 'ଅନ୍ତର୍ଭୁକ୍ତ ସ୍ୱାସ୍ଥ୍ୟ ଯୋଜନା:',
      tieUpProtocols: 'ସହବନ୍ଧିତା ସୁବିଧା ଓ ପ୍ରୋଟୋକଲ୍:',
      modalTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଫାଷ୍ଟ-ଟ୍ରାକ୍ ରେଫରାଲ୍ ଓ ବେଡ୍ ସଂରକ୍ଷଣ ଫର୍ମ',
      step1Hospital: '୧. ଚୟନିତ ହସ୍ପିଟାଲ୍:',
      step2Dept: '୨. ସ୍ଥାନାନ୍ତର ବିଭାଗ ଚୟନ କରନ୍ତୁ *:',
      step3Urgency: '୩. ଟ୍ରାଏଜ୍ ପ୍ରାଥମିକତା ସ୍ତର (Clinical Urgency) *:',
      urgencyRed: 'RED (ତୁରନ୍ତ ଜରୁରୀକାଳୀନ / ICU)',
      urgencyYellow: 'YELLOW (ଅଗ୍ରାଧିକାର ପରାମର୍ଶ / HDU)',
      urgencyGreen: 'GREEN (ସାଧାରଣ ସ୍ପେଶାଲିଷ୍ଟ OPD)',
      step4Details: '୪. ରୋଗୀ ଓ ଆୟୁଷ୍ମାନ ବିବରଣୀ:',
      nameLabel: 'ରୋଗୀଙ୍କ ନାମ *',
      phoneLabel: 'ଯୋଗାଯୋଗ ନମ୍ବର *',
      abhaLabel: 'ABHA ଆଇଡି / ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ନମ୍ବର *',
      reasonLabel: 'କ୍ଲିନିକାଲ୍ ସ୍ଥାନାନ୍ତରଣର କାରଣ ଓ ଲକ୍ଷଣ',
      reasonPlaceholder: 'ଉଦାହରଣ: SpO2 ୯୧%, પ્લેଟଲେଟ୍ ୪୨,୦୦୦, ତୁରନ୍ତ ଆଇସିୟୁ କେୟାର ଆବଶ୍ୟକ...',
      ambulanceCheckbox: '୧୦୮ / ହସ୍ପିଟାଲ୍ ଆମ୍ବୁଲାନ୍ସ ଏବଂ ଗ୍ରୀନ୍ କରିଡର୍ ସହାୟତା ଆବଶ୍ୟକ',
      confirmTransferBtn: 'ଡିଜିଟାଲ୍ ରେଫରାଲ୍ ପାସ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      passTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅଫିସିଆଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍ (Digital Transfer Token)',
      passSubtitle: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ • ABDM e-Hospital Protocol',
      tokenLabel: 'ଟ୍ରାନ୍ସଫର୍ ଟୋକନ୍:',
      referralIdLabel: 'ରେଫରାଲ୍ ଆଇଡି:',
      destinationLabel: 'ଗନ୍ତବ୍ୟ ହସ୍ପିଟାଲ୍:',
      departmentLabel: 'ଉଦ୍ଦିଷ୍ଟ ବିଭାଗ / ବ୍ଲକ୍:',
      assignedCounter: 'ରିପୋର୍ଟିଂ କାଉଣ୍ଟର୍ / ଇମରଜେନ୍ସି ବେ:',
      emergencyOfficer: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର କୋଅର୍ଡିନେଟର୍:',
      statusApproved: 'ଅନୁମୋଦିତ ଏବଂ ବେଡ୍ ସଂରକ୍ଷିତ (Approved & Reserved)',
      printSlip: 'ଡିଜିଟାଲ୍ ପାସ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noTransfers: 'କୌଣସି ସକ୍ରିୟ ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସ୍ଥାନାନ୍ତରଣ ରେକର୍ଡ ନାହିଁ।',
      cancelTransferConfirm: 'ଆପଣ ଏହି ସ୍ଥାନାନ୍ତରଣ ପାସ୍ ବାତିଲ୍ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      transferSuccessAlert: 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଡିଜିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ପାସ୍ ସଫଳତାର ସହ ପ୍ରସ୍ତୁତ ହେଲା!',
      viewOnMap: 'ହସ୍ପିଟାଲ୍ ସ୍ଥାନ',
      bhubaneswar: 'ଭୁବନେଶ୍ୱର',
      cuttack: 'କଟକ',
      national: 'ଜାତୀୟ ନେଟୱାର୍କ'
    },
    'hi-IN': {
      systemTitle: 'स्वास्थ्य मित्र 5-स्तरीय स्वास्थ्य सहायता पोर्टल',
      systemSubtitle: 'ओडिशा के 30 जिलों एवं राष्ट्रीय अस्पतालों की संबद्धता, लाइव बेड, 108 एम्बुलेंस एवं BSKY सहायता',
      networkBadge: 'ओडिशा स्वास्थ्य मित्र सेवा',
      
      sec1: '1. अस्पताल निर्देशिका',
      sec2: '2. लाइव बेड एवं ICU ट्रैकर',
      sec3: '3. डिजिटल स्थानांतरण पास',
      sec4: '4. 108 एम्बुलेंस एवं टेली-ICU',
      sec5: '5. BSKY / PM-JAY सहायता',

      searchPlaceholder: 'अस्पताल का नाम, विशेषज्ञता या 30 जिले खोजें...',
      allSchemes: 'सभी सरकारी योजनाएं',
      bskyScheme: 'BSKY (100% कैशलेस)',
      pmjayScheme: 'आयुष्मान भारत PM-JAY',
      allCities: 'सभी 30 जिले एवं मेट्रो',
      allSpecialties: 'सभी विशेषज्ञ विभाग',
      specTrauma: 'आपातकालीन एवं ट्रॉमा (Level-1 Trauma & ICU)',
      specCardio: 'हृदय रोग एवं STEMI केयर (Cardiology)',
      specOncology: 'कैंसर संस्थान (Comprehensive Oncology)',
      specNephro: 'गुर्दा रोग एवं डायलिसिस (Nephrology & Dialysis)',
      specPedia: 'शिशु गहन चिकित्सा (Level-3 NICU/PICU)',

      partnerStatsTitle: 'स्वास्थ्य मित्र लाइव बेड एवं आपातकालीन क्षमता',
      totalPartners: 'संबद्ध अस्पताल',
      availableIcu: 'उपलब्ध ICU बेड',
      availableVentilators: 'उपलब्ध वेंटिलेटर',
      teleEmergencyReady: '24x7 टेली-इमरजेंसी सक्रिय',
      bedsAvailable: 'बेड उपलब्ध',
      fastTrackTransferBtn: 'फास्ट-ट्रैक रेफरल एवं बेड बुक करें',
      emergencyHelpline: 'आपातकालीन हेल्पलाइन:',
      schemesEmpaneled: 'संबद्ध स्वास्थ्य योजनाएं:',
      tieUpProtocols: 'संबद्धता सुविधाएं एवं प्रोटोकॉल:',
      modalTitle: 'स्वास्थ्य मित्र डिजिटल रेफरल एवं बेड आरक्षण फॉर्म',
      step1Hospital: '1. चयनित अस्पताल:',
      step2Dept: '2. स्थानांतरण विभाग चुनें *:',
      step3Urgency: '3. क्लिनिकल प्राथमिकता *:',
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
      passTitle: 'स्वास्थ्य मित्र आधिकारिक स्थानांतरण पास (Digital Transfer Token)',
      passSubtitle: 'राष्ट्रीय स्वास्थ्य मिशन • ABDM e-Hospital Protocol',
      tokenLabel: 'ट्रांसफर टोकन:',
      referralIdLabel: 'रेफरल आईडी:',
      destinationLabel: 'गंतव्य अस्पताल:',
      departmentLabel: 'लक्ष्य विभाग / विंग:',
      assignedCounter: 'रिपोर्टिंग काउंटर / इमरजेंसी बे:',
      emergencyOfficer: 'स्वास्थ्य मित्र समन्वयक:',
      statusApproved: 'स्वीकृत एवं बेड आरक्षित (Approved & Reserved)',
      printSlip: 'डिजिटल पास प्रिंट करें',
      closeBtn: 'बंद करें',
      noTransfers: 'कोई सक्रिय स्वास्थ्य मित्र स्थानांतरण रिकॉर्ड नहीं मिला।',
      cancelTransferConfirm: 'क्या आप इस स्थानांतरण पास को रद्द करना चाहते हैं?',
      transferSuccessAlert: 'स्वास्थ्य मित्र डिजिटल स्थानांतरण पास सफलतापूर्वक तैयार हो गया!',
      viewOnMap: 'स्थान देखें',
      bhubaneswar: 'भुवनेश्वर',
      cuttack: 'कटक',
      national: 'राष्ट्रीय नेटवर्क'
    },
    'en-IN': {
      systemTitle: 'Swasthya Mitra 5-Section Support Portal',
      systemSubtitle: 'Empaneled Hospital Network across 30 Odisha Districts & Metros, Live Beds, 108 Dispatch & BSKY Assistance',
      networkBadge: 'Odisha Swasthya Mitra System',
      
      sec1: '1. Hospital Directory',
      sec2: '2. Live Bed & ICU Tracker',
      sec3: '3. Digital Transfer Pass',
      sec4: '4. 108 Dispatch & Tele-ICU',
      sec5: '5. BSKY / PM-JAY Helpdesk',

      searchPlaceholder: 'Search hospital name, specialty, or any of 30 Odisha districts...',
      allSchemes: 'All Health Schemes',
      bskyScheme: 'BSKY (100% Cashless Treatment)',
      pmjayScheme: 'Ayushman Bharat PM-JAY',
      allCities: 'All 30 Districts & Metros',
      allSpecialties: 'All Super-Specialties',
      specTrauma: 'Emergency & Level-1 Trauma ICU',
      specCardio: 'Cardiology & STEMI Corridor',
      specOncology: 'Comprehensive Cancer Care',
      specNephro: 'Nephrology & Dialysis Unit',
      specPedia: 'Pediatric & Level-3 NICU',

      partnerStatsTitle: 'Swasthya Mitra Live Capacity & Bed Tracker',
      totalPartners: 'Empaneled Hospitals',
      availableIcu: 'Available ICU Beds',
      availableVentilators: 'Active Ventilators',
      teleEmergencyReady: '24x7 Tele-Emergency Desk',
      bedsAvailable: 'Beds Available',
      fastTrackTransferBtn: 'Fast-Track Transfer & Reserve Bed',
      emergencyHelpline: 'Emergency Triage Hotline:',
      schemesEmpaneled: 'Empaneled Cashless Schemes:',
      tieUpProtocols: 'Tie-Up Privileges & Protocols:',
      modalTitle: 'Swasthya Mitra Fast-Track Transfer & Bed Slip',
      step1Hospital: '1. Selected Hospital:',
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
      passTitle: 'Swasthya Mitra Official Inter-Facility Transfer Pass',
      passSubtitle: 'National Health Mission • ABDM e-Hospital Transit Protocol',
      tokenLabel: 'Transfer Token:',
      referralIdLabel: 'Referral ID:',
      destinationLabel: 'Destination Hospital:',
      departmentLabel: 'Assigned Department / Wing:',
      assignedCounter: 'Reporting Triage Counter:',
      emergencyOfficer: 'Swasthya Mitra Nodal Officer:',
      statusApproved: 'Confirmed & Fast-Track Reserved',
      printSlip: 'Print Digital Transfer Pass',
      closeBtn: 'Close',
      noTransfers: 'No active Swasthya Mitra transfers found.',
      cancelTransferConfirm: 'Are you sure you want to cancel this transfer booking?',
      transferSuccessAlert: 'Swasthya Mitra digital transfer pass successfully created!',
      viewOnMap: 'View Location',
      bhubaneswar: 'Bhubaneswar',
      cuttack: 'Cuttack',
      national: 'National Network'
    }
  }[lang] || {};

  // Get Hospitals Master Data
  const hospitalsList = getHospitalPartners(lang);

  // Totals calculation
  const totalIcuBedsCount = hospitalsList.reduce((acc, h) => acc + (h.availableIcuBeds || 0), 0);
  const totalVentilatorsCount = hospitalsList.reduce((acc, h) => acc + (h.availableVentilators || 0), 0);
  const totalBedsCount = hospitalsList.reduce((acc, h) => acc + (h.totalBeds || 0), 0);

  // Filter Logic
  const filteredHospitals = hospitalsList.filter((hosp) => {
    const matchesQuery =
      searchQuery === '' ||
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.cityLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesScheme = selectedScheme === 'ALL' || hosp.schemes.includes(selectedScheme);
    const matchesCity = selectedCity === 'ALL' || hosp.city === selectedCity;
    const matchesSpecialty = selectedSpecialty === 'ALL' || hosp.specialtyCategory === selectedSpecialty;

    return matchesQuery && matchesScheme && matchesCity && matchesSpecialty;
  });

  // Handle Transfer Booking
  const handleOpenTransferModal = (hosp) => {
    setSelectedHospital(hosp);
    setSelectedDept(hosp.departments[0] || '');
    setTransferUrgency('RED');
    setClinicalReason('');
  };

  const handleConfirmTransfer = (e) => {
    e.preventDefault();
    if (!selectedHospital || !selectedDept || !patientName || !patientPhone) {
      alert(lang === 'or-IN' ? 'ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକୀୟ ତଥ୍ୟ ପୂରଣ କରନ୍ତୁ।' : 'Please fill all required fields.');
      return;
    }

    const transferData = {
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      cityLabel: selectedHospital.cityLabel,
      department: selectedDept,
      urgency: transferUrgency,
      patientName,
      patientPhone,
      patientAbha,
      clinicalReason: clinicalReason || 'Urgent Specialist Evaluation & Emergency Stabilization',
      ambulanceRequired,
      assignedCounter: selectedHospital.counter,
      coordinator: selectedHospital.coordinator,
      contactPhone: selectedHospital.phone,
      schemes: selectedHospital.schemes
    };

    const savedRecord = saveHospitalTransfer(transferData);
    setTransfers(getHospitalTransfers());
    setConfirmedTransferSlip(savedRecord);
    setSelectedHospital(null);
  };

  const handleCancelTransfer = (transferId) => {
    if (window.confirm(txt.cancelTransferConfirm)) {
      cancelHospitalTransfer(transferId);
      setTransfers(getHospitalTransfers());
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-indigo-900/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight">{txt.systemTitle}</h2>
                <span className="bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                  {txt.networkBadge}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {txt.systemSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Live Network KPI Bar */}
        <div className="mt-5 pt-4 border-t border-indigo-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-indigo-800/40">
            <span className="text-slate-400 text-[11px] block">{txt.totalPartners}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-black text-white">{hospitalsList.length}</span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-800/50">
                30 Districts + 6 Metros
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40">
            <span className="text-rose-300 text-[11px] block font-semibold">{txt.availableIcu}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-black text-rose-200">{totalIcuBedsCount}</span>
              <span className="text-[10px] text-rose-400 font-medium">Live Beds</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-800/40">
            <span className="text-blue-300 text-[11px] block font-semibold">{txt.availableVentilators}</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-black text-blue-200">{totalVentilatorsCount}</span>
              <span className="text-[10px] text-blue-400 font-medium">Active HDU</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
            <span className="text-emerald-300 text-[11px] block font-semibold">Total Network Capacity</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-lg font-black text-emerald-200">{totalBedsCount.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-medium">Empaneled Beds</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-SECTION SWASTHYA MITRA NAV TABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveSection('sec-directory')}
            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'sec-directory'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{txt.sec1}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('sec-bedtracker')}
            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'sec-bedtracker'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-400" />
            <span>{txt.sec2}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('sec-transfers')}
            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'sec-transfers'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>{txt.sec3}</span>
            {transfers.length > 0 && (
              <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {transfers.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('sec-emergency')}
            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'sec-emergency'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Ambulance className="w-4 h-4 text-amber-400" />
            <span>{txt.sec4}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('sec-schemes')}
            className={`px-3 py-2.5 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeSection === 'sec-schemes'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <CreditCard className="w-4 h-4 text-teal-400" />
            <span>{txt.sec5}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: HOSPITALS DIRECTORY & FILTERING */}
      {activeSection === 'sec-directory' && (
        <div className="space-y-4">
          {/* Search & Filter Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={txt.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* City Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Location / City Filter
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">📍 {txt.allCities} ({HOSPITAL_CITIES.length})</option>
                  <optgroup label={lang === 'or-IN' ? 'ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲା (Odisha Districts)' : 'Odisha Districts (30)'}>
                    {HOSPITAL_CITIES.filter((c) => c.region === 'Odisha').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[lang] || c.name['en-IN']}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={lang === 'or-IN' ? 'ଜାତୀୟ ଏପେକ୍ସ ମେଟ୍ରୋ (National Metros)' : 'National Metros'}>
                    {HOSPITAL_CITIES.filter((c) => c.region === 'National').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[lang] || c.name['en-IN']}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Specialty Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Specialty Filter
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">⚕️ {txt.allSpecialties}</option>
                  <option value="Trauma">{txt.specTrauma}</option>
                  <option value="Cardio">{txt.specCardio}</option>
                  <option value="Oncology">{txt.specOncology}</option>
                  <option value="Nephro">{txt.specNephro}</option>
                  <option value="Pedia">{txt.specPedia}</option>
                </select>
              </div>

              {/* Scheme Filter */}
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Government Scheme Filter
                </label>
                <select
                  value={selectedScheme}
                  onChange={(e) => setSelectedScheme(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="ALL">💳 {txt.allSchemes}</option>
                  <option value="BSKY">{txt.bskyScheme}</option>
                  <option value="PMJAY">{txt.pmjayScheme}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hospital Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHospitals.map((hosp) => (
              <div
                key={hosp.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {hosp.cityLabel}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {hosp.region}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1.5 leading-snug">
                        {hosp.name}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{hosp.tier}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                        <span className="text-xs font-black">{hosp.availableIcuBeds} ICU Beds</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hosp.address}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <a href={`tel:${hosp.phone}`} className="font-bold text-indigo-600 hover:underline">
                        {hosp.phone} ({hosp.coordinator})
                      </a>
                    </div>
                  </div>

                  {/* Specialties / Departments */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {hosp.departments.map((dept, i) => (
                      <span key={i} className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-lg">
                        • {dept}
                      </span>
                    ))}
                  </div>

                  {/* Scheme Badges */}
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {hosp.schemeLabels.map((scheme, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1"
                      >
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {scheme}
                      </span>
                    ))}
                  </div>

                  {/* Protocol note */}
                  <p className="mt-3 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 leading-relaxed italic">
                    "{hosp.protocols}"
                  </p>
                </div>

                {/* Transfer Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-medium">
                    📍 {hosp.counter}
                  </div>

                  <button
                    onClick={() => handleOpenTransferModal(hosp)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>{txt.fastTrackTransferBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE BED & ICU CAPACITY TRACKER */}
      {activeSection === 'sec-bedtracker' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-rose-500 animate-pulse" />
                  Live Odisha District & Metro ICU Bed Availability Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time bed counts across all 30 Odisha district hospitals and pan-India apex centers.
                </p>
              </div>
              <span className="text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                24x7 Live Feed
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {hospitalsList.map((hosp) => (
                <div key={hosp.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:shadow-sm transition-all space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded uppercase">
                        {hosp.cityLabel}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{hosp.name}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-xs">
                    <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">Total Beds</span>
                      <span className="font-extrabold text-slate-800">{hosp.totalBeds}</span>
                    </div>

                    <div className="bg-rose-50 p-1.5 rounded-lg border border-rose-200">
                      <span className="text-[10px] text-rose-600 block font-semibold">ICU Beds</span>
                      <span className="font-black text-rose-700">{hosp.availableIcuBeds}</span>
                    </div>

                    <div className="bg-blue-50 p-1.5 rounded-lg border border-blue-200">
                      <span className="text-[10px] text-blue-600 block font-semibold">Ventilators</span>
                      <span className="font-black text-blue-700">{hosp.availableVentilators}</span>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 truncate max-w-[170px]">{hosp.counter}</span>
                    <a href={`tel:${hosp.phone}`} className="font-bold text-indigo-600 hover:underline flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {hosp.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: DIGITAL FAST-TRACK TRANSFER PASSES */}
      {activeSection === 'sec-transfers' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-600" />
                  Active Swasthya Mitra Fast-Track Digital Transfer Passes
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ABHA-linked inter-facility transfer slips and emergency priority tokens.
                </p>
              </div>
            </div>

            {transfers.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-xs">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold">{txt.noTransfers}</p>
                <p className="text-slate-400 mt-1">Select any hospital in Section 1 to issue a fast-track digital pass.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transfers.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                          {t.token}
                        </span>
                        <span className="text-xs font-bold text-slate-700">{t.hospitalName}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {t.department}
                        </span>
                      </div>

                      <div className="mt-2 text-xs text-slate-600 space-y-0.5">
                        <p>👤 <strong>{t.patientName}</strong> • Phone: {t.patientPhone} {t.patientAbha && `• ABHA: ${t.patientAbha}`}</p>
                        <p className="text-slate-500">📍 Counter: {t.assignedCounter} • Coordinator: {t.coordinator}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setConfirmedTransferSlip(t)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Pass</span>
                      </button>

                      <button
                        onClick={() => handleCancelTransfer(t.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: EMERGENCY 108 DISPATCH & TELE-ICU */}
      {activeSection === 'sec-emergency' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-rose-600 to-red-700 text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="p-3 bg-white/20 rounded-xl w-fit">
                <Ambulance className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black">108 Free Emergency Ambulance</h3>
                <p className="text-xs text-rose-100 mt-1">
                  24x7 Odisha Free Emergency Dispatch with Oxygen & ALS support.
                </p>
              </div>
              <a href="tel:108" className="inline-flex items-center gap-2 bg-white text-rose-700 px-4 py-2 rounded-xl text-xs font-black shadow-xs">
                <Phone className="w-4 h-4" />
                Dial 108 Toll-Free
              </a>
            </div>

            <div className="bg-gradient-to-br from-amber-600 to-orange-700 text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="p-3 bg-white/20 rounded-xl w-fit">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black">102 Maternal & Child Ambulance</h3>
                <p className="text-xs text-amber-100 mt-1">
                  Free pick-up and drop for pregnant women & sick newborns.
                </p>
              </div>
              <a href="tel:102" className="inline-flex items-center gap-2 bg-white text-amber-800 px-4 py-2 rounded-xl text-xs font-black shadow-xs">
                <Phone className="w-4 h-4" />
                Dial 102 Toll-Free
              </a>
            </div>

            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-5 rounded-2xl shadow-md space-y-3">
              <div className="p-3 bg-white/20 rounded-xl w-fit">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-black">Tele-ICU Specialist Desk</h3>
                <p className="text-xs text-indigo-100 mt-1">
                  Direct doctor-to-doctor clinical consultation hotline for critical transfers.
                </p>
              </div>
              <a href="tel:104" className="inline-flex items-center gap-2 bg-white text-indigo-800 px-4 py-2 rounded-xl text-xs font-black shadow-xs">
                <Phone className="w-4 h-4" />
                Dial 104 Health Helpline
              </a>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: BSKY & PM-JAY CASHLESS HELPDESK */}
      {activeSection === 'sec-schemes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">BSKY & Ayushman Bharat PM-JAY Cashless Assistance</h3>
                <p className="text-xs text-slate-500">100% Cashless treatment guidelines across Odisha & Empaneled National Hospitals</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Biju Swasthya Kalyan Yojana (BSKY)
                </h4>
                <ul className="space-y-1.5 text-emerald-800 font-medium">
                  <li>• <strong>₹5 Lakhs</strong> per family per annum for general secondary/tertiary care.</li>
                  <li>• <strong>₹10 Lakhs</strong> coverage for female family members.</li>
                  <li>• 100% Cashless for IPD, ICU, Surgeries & Oncology in empaneled hospitals.</li>
                  <li>• BSKY Nodal Helpdesk available at CDMO offices in all 30 districts.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2">
                <h4 className="font-extrabold text-blue-900 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-600" />
                  Ayushman Bharat PM-JAY
                </h4>
                <ul className="space-y-1.5 text-blue-800 font-medium">
                  <li>• <strong>₹5 Lakhs</strong> health cover per family per year across India.</li>
                  <li>• Inter-state portable coverage in AIIMS, Tata Memorial, NIMHANS & CMC Vellore.</li>
                  <li>• Pre-authorization desk directly linked at hospital admission counters.</li>
                  <li>• ABHA ID card auto-verifies cashless entitlement.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAST-TRACK TRANSFER MODAL */}
      {selectedHospital && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                {txt.modalTitle}
              </h3>
              <button
                onClick={() => setSelectedHospital(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmTransfer} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">{txt.step1Hospital}</label>
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="font-extrabold text-indigo-900 text-sm">{selectedHospital.name}</p>
                  <p className="text-indigo-700 text-[11px] mt-0.5">
                    📍 {selectedHospital.cityLabel} • {selectedHospital.counter}
                  </p>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{txt.step2Dept}</label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
                >
                  {selectedHospital.departments.map((dept, i) => (
                    <option key={i} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{txt.step3Urgency}</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('RED')}
                    className={`p-2 rounded-xl border font-black text-center transition-all ${
                      transferUrgency === 'RED'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    RED (ICU)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('YELLOW')}
                    className={`p-2 rounded-xl border font-black text-center transition-all ${
                      transferUrgency === 'YELLOW'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    YELLOW (HDU)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransferUrgency('GREEN')}
                    className={`p-2 rounded-xl border font-black text-center transition-all ${
                      transferUrgency === 'GREEN'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    GREEN (OPD)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{txt.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{txt.phoneLabel}</label>
                  <input
                    type="text"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{txt.abhaLabel}</label>
                <input
                  type="text"
                  value={patientAbha}
                  onChange={(e) => setPatientAbha(e.target.value)}
                  placeholder="ABHA-1234-5678"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{txt.reasonLabel}</label>
                <textarea
                  rows={2}
                  value={clinicalReason}
                  onChange={(e) => setClinicalReason(e.target.value)}
                  placeholder={txt.reasonPlaceholder}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <label className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ambulanceRequired}
                  onChange={(e) => setAmbulanceRequired(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-bold text-[11px]">{txt.ambulanceCheckbox}</span>
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedHospital(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  {txt.cancelBtn}
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-md shadow-indigo-600/20"
                >
                  {txt.confirmTransferBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMED DIGITAL TRANSFER PASS MODAL */}
      {confirmedTransferSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-slate-900">{txt.passTitle}</h3>
              <p className="text-[11px] text-slate-500">{txt.passSubtitle}</p>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold">
                <span>{txt.tokenLabel}</span>
                <span className="text-indigo-600">{confirmedTransferSlip.token}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{txt.destinationLabel}</span>
                <span className="font-bold">{confirmedTransferSlip.hospitalName}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{txt.departmentLabel}</span>
                <span>{confirmedTransferSlip.department}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Patient Name:</span>
                <span>{confirmedTransferSlip.patientName}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>{txt.assignedCounter}</span>
                <span className="font-bold text-emerald-700">{confirmedTransferSlip.assignedCounter}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center gap-1.5 text-xs"
              >
                <Printer className="w-4 h-4" />
                <span>{txt.printSlip}</span>
              </button>

              <button
                onClick={() => setConfirmedTransferSlip(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
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
