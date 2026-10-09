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
  onSwitchToDesktop,
  onSwitchPersona
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

  // Language normalization & active language resolver
  const normalizedLang = useMemo(() => {
    if (!appLang) return 'or-IN';
    if (appLang.startsWith('hi')) return 'hi-IN';
    if (appLang.startsWith('en')) return 'en-IN';
    return 'or-IN';
  }, [appLang]);

  // Multilingual translations dictionary
  const t = useMemo(() => {
    const dict = {
      'or-IN': {
        brandTitle: 'ସ୍ୱାସ୍ଥ୍ୟମିତ୍ର ଓଡ଼ିଶା',
        brandSubtitle: 'ଓଡ଼ିଶା ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (ABDM)',
        odishaGov: 'ଓଡ଼ିଶା ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ',
        abhaCardTitle: 'ଆଭା (ABHA) ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ID',
        emergency108: '୧୦୮ ଜରୁରୀକାଳୀନ SOS',
        healthAlertTitle: 'ଜନସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା: ଓଡ଼ିଶାରେ ଡେଙ୍ଗୁ ଓ ତାତି ପ୍ରକୋପ ନିୟନ୍ତ୍ରଣ ପ୍ରୋଟୋକଲ୍ ଜାରି। ଲକ୍ଷଣ ଦେଖାଦେଲେ ତୁରନ୍ତ ଯାଞ୍ଚ କରନ୍ତୁ।',
        viewDetails: 'ବିବରଣୀ ଦେଖନ୍ତୁ',
        searchPlaceholder: 'ଡାକ୍ତର, ବେଡ୍, ଆମ୍ବୁଲାନ୍ସ, ରକ୍ତ ଭଣ୍ଡାର ଖୋଜନ୍ତୁ...',
        triageTitle: 'AI ଲକ୍ଷଣ ଓ ସ୍ୱର ଟ୍ରିଆଜ୍',
        triageSub: 'ବହୁଭାଷୀ ଭଏସ୍ ଓ ଡାକ୍ତରୀ ଟ୍ରିଆଜ୍ ସାରାଂଶ',
        triageTag: 'AI ମାଇକ୍',
        bedTitle: 'ହସ୍ପିଟାଲ୍ ବେଡ୍ ଟ୍ରାକର୍',
        bedSub: '୧୦,୭୭୦ ଲାଇଭ୍ ଆଇସିୟୁ ଓ ସାଧାରଣ ବେଡ୍',
        bedTag: 'ଲାଇଭ୍ ବେଡ୍',
        ambTitle: 'GPS ୧୦୮ ଆମ୍ବୁଲାନ୍ସ କଲ୍',
        ambSub: 'ତୁରନ୍ତ ଜରୁରୀକାଳୀନ SOS ଡିସପାଚ୍',
        ambTag: '୧୦୮ SOS',
        docTitle: 'ଡାକ୍ତର ଭିଡିଓ ପରାମର୍ଶ',
        docSub: '୨,୫୨୩ OMC ପଞ୍ଜୀକୃତ ବିଶେଷଜ୍ଞ',
        docTag: 'OPD ତାଲିକା',
        rxTitle: 'ଡିଜିଟାଲ୍ ପ୍ରେସକ୍ରିପସନ୍ ସ୍ଲିପ୍',
        rxSub: 'NMC ଡିଜିଟାଲ୍ Rx ଏବଂ ରେଫରାଲ୍ ସ୍ଲିପ୍',
        rxTag: 'NMC Rx',
        gpsTitle: 'ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ GPS',
        gpsSub: 'PHC, CHC ଓ DHH ମାର୍ଗଦର୍ଶକ',
        gpsTag: 'GPS ମ୍ୟାପ୍',
        bloodTitle: 'ରକ୍ତ ଭଣ୍ଡାର ନେଟୱର୍କ',
        bloodSub: '୮,୪୨୦ OSBTC ରକ୍ତ ୟୁନିଟ୍ ଉପଲବ୍ଧ',
        bloodTag: 'OSBTC ରକ୍ତ',
        medTitle: 'ଔଷଧ ସୁରକ୍ଷା ଓ ଅବଧି ଯାଞ୍ଚ',
        medSub: 'OCR ସ୍କାନର୍ ଓ ଔଷଧ ପାରସ୍ପରିକ କ୍ରିୟା ସୁରକ୍ଷା',
        medTag: 'OCR ଯାଞ୍ଚ',
        marketTitle: 'ଔଷଧ ବଜାର ଓ ଜନଔଷଧି',
        marketSub: '୨୮+ ଔଷଧ ଓ କଟା ଷ୍ଟ୍ରିପ୍ QR',
        marketTag: '୨୮+ ଔଷଧ',
        phcTitle: 'PHC ଅଫଲାଇନ୍ ସିଙ୍କ୍ ଇଞ୍ଜିନ୍',
        phcSub: 'ଇଣ୍ଟରନେଟ୍ ବିନା ଗ୍ରାମୀଣ କ୍ଲିନିକ୍ ଡାଟାବେସ୍',
        phcTag: 'ଅଫଲାଇନ୍ DB',
        ashaTitle: 'ଆଶା କର୍ମୀ ଫିଲ୍ଡ ପୋର୍ଟାଲ୍',
        ashaSub: 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସର୍ଭେକ୍ଷଣ',
        ashaTag: 'ଆଶା ଫିଲ୍ଡ',
        adminTitle: 'ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ କମାଣ୍ଡ ହବ୍',
        adminSub: '୩୦-ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ପରିଚାଳନା ଓ ଟେଲିମେଟ୍ରି',
        adminTag: 'କମାଣ୍ଡ',
        pilotTitle: '୧୦୮ ପାଇଲଟ୍ MDT କନସୋଲ୍',
        pilotTag: '୧୦୮ MDT',
        teleconsultTitle: 'ଲାଇଭ୍ ଭିଡିଓ ଟେଲିକନସଲ୍ଟ',
        teleconsultSub: 'ଲାଇଭ୍ WebRTC ଭିଡିଓ କଲ୍ ଓ ଡିଜିଟାଲ୍ Rx',
        teleconsultTag: 'ଲାଇଭ୍ ଭିଡିଓ',
        teleconsultNav: 'ଭିଡିଓ OPD',
        home: 'ମୂଳପୃଷ୍ଠା',
        services: 'ସେବା ସମୂହ',
        records: 'ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ',
        profile: 'ପ୍ରୋଫାଇଲ୍',
        backToHome: 'ଫେରନ୍ତୁ',
        copySuccess: 'ଆଭା ନମ୍ବର କପି ହୋଇଛି!',
        linkedAbha: 'ସଂଯୁକ୍ତ ଆଭା:',
        recordsHeading: 'ସ୍ୱାସ୍ଥ୍ୟ ରେକର୍ଡ ସମୂହ',
        recordsSub: 'ଆୟୁଷ୍ମାନ ଭାରତ ଡିଜିଟାଲ୍ ହେଲଥ୍ ଭଲ୍ଟ',
        recordsShieldText: 'ଆପଣଙ୍କ ହସ୍ପିଟାଲ୍ ଭିଜିଟ୍, ପ୍ରେସକ୍ରିପସନ୍ ଏବଂ ଟ୍ରିଆଜ୍ ଇତିହାସ ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ନେଟୱର୍କ ସହ ସୁରକ୍ଷିତ ଭାବେ ସିଙ୍କ୍ ହୋଇଛି।',
        doctorConsultations: 'ଡାକ୍ତର ପରାମର୍ଶ ରେକର୍ଡ',
        doctorConsultationsSub: 'ଆଗାମୀ OPD ଟୋକନ୍ ଓ ଭିଡିଓ କଲ୍ ଇତିହାସ',
        triageAssessments: 'ପୂର୍ବ AI ଟ୍ରିଆଜ୍ ଆକଳନ',
        triageAssessmentsSub: 'ସ୍ୱର ଲକ୍ଷଣ ରେକର୍ଡ ଓ ଜରୁରୀକାଳୀନ ଟ୍ରିଆଜ୍ ଲଗ୍',
        referralSlips: 'ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍ ସ୍ଲିପ୍',
        referralSlipsSub: 'ସରକାରୀ ଆନ୍ତଃ-ହସ୍ପିଟାଲ୍ କ୍ଲିନିକାଲ୍ ଟ୍ରାନ୍ସଫର ମେମୋ',
        medicineRecords: 'ଔଷଧ ସୁରକ୍ଷା ଓ ଅବଧି ରେକର୍ଡ',
        medicineRecordsSub: 'ସ୍କାନ୍ ହୋଇଥିବା ଔଷଧ ବ୍ୟାଚ୍ ସୁରକ୍ଷା ଭଲ୍ଟ',
        servicesHeading: 'ସ୍ୱାସ୍ଥ୍ୟ ସେବା ସମୂହ',
        servicesSub: 'ସମସ୍ତ ଓଡ଼ିଶା ABDM କ୍ଲିନିକାଲ୍ ମଡ୍ୟୁଲ୍',
        profileHeading: 'ପ୍ରୋଫାଇଲ୍ ଏବଂ ପସନ୍ଦ',
        langPref: 'ଭାଷା ପସନ୍ଦ (Language Preference)',
        colorTheme: 'ରଙ୍ଗ ଥିମ୍ (Color Theme)',
        themeLight: 'ଉଜ୍ଜ୍ୱଳ',
        themeDark: 'ଗାଢ଼',
        themeSepia: 'ସେପିଆ',
        switchRoleDemo: 'ଭୂମିକା ପରିବର୍ତ୍ତନ (ଲାଇଭ୍ ଡେମୋ ରିଭ୍ୟୁ)',
        citizenRole: 'ନାଗରିକ (Citizen)',
        citizenRoleSub: 'ସ୍ତର ୧: ସାଧାରଣ ସେବା',
        doctorRole: 'ଡାକ୍ତର (Doctor / RMP)',
        doctorRoleSub: 'ସ୍ତର ୩: କ୍ଲିନିକାଲ୍',
        ashaRole: 'ଆଶା କର୍ମୀ (ASHA / PHC)',
        ashaRoleSub: 'ସ୍ତର ୨: ଫିଲ୍ଡ ଆଉଟରିଚ୍',
        adminRole: 'ସୁପର ଆଡମିନ୍ (Super Admin)',
        adminRoleSub: 'ସ୍ତର ୫: ରାଜ୍ୟ ସରକାର',
        driverRole: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ପାଇଲଟ୍',
        driverRoleSub: 'ସ୍ତର ୪: ଜରୁରୀକାଳୀନ MDT',
        switchUserPortal: 'ଉପଭୋକ୍ତା / ଷ୍ଟାଫ୍ ପୋର୍ଟାଲ୍ ବଦଳାନ୍ତୁ',
        switchToDesktop: 'ଡେସ୍କଟପ୍ ମଲ୍ଟି-ହବ୍ ଭ୍ୟୁ କୁ ଯାଆନ୍ତୁ',
        signIn: 'ଲଗ୍-ଇନ୍ / ଖାତା ଖୋଲନ୍ତୁ',
        signOut: 'ଲଗ୍-ଆଉଟ୍ କରନ୍ତୁ',
        abhaQrTitle: 'ଆଭା (ABHA) ଡିଜିଟାଲ୍ QR କୋଡ୍',
        abhaQrSub: 'ଯେକୌଣସି PHC, CHC, କିମ୍ବା DHH OPD କାଉଣ୍ଟରରେ କାଗଜହୀନ ପଞ୍ଜୀକରଣ ପାଇଁ ସ୍କାନ୍ କରନ୍ତୁ।',
        advisoryTitle: 'ଓଡ଼ିଶା ଜନସ୍ୱାସ୍ଥ୍ୟ ଡେଙ୍ଗୁ ଓ ତାତି ପରାମର୍ଶ',
        issuedBy: 'ଜାରିକର୍ତ୍ତା: ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ, ଓଡ଼ିଶା ସରକାର।',
        advisoryP1: 'ସମସ୍ତ CHC ରେ ଡେଙ୍ଗୁ ପ୍ରାରମ୍ଭିକ ପରୀକ୍ଷା ଓ ପ୍ଲେଟଲେଟ୍ କାଉଣ୍ଟର ସକ୍ରିୟ।',
        advisoryP2: 'ଦିବା ୧୧:୦୦ ରୁ ଅପରାହ୍ନ ୩:୩୦ ମଧ୍ୟରେ ସିଧାସଳଖ ସୂର୍ଯ୍ୟକିରଣରୁ ଦୂରେଇ ରୁହନ୍ତୁ।',
        advisoryP3: 'ପ୍ରଚୁର ପାଣି, ଘୋଳଦହି, ଲେମ୍ବୁ ପାଣି ଏବଂ ORS ପିଅନ୍ତୁ।',
        advisoryP4: 'ଜ୍ୱର ସହିତ କମ୍ପନ କିମ୍ବା ଦେହ ହାତ ବିନ୍ଧା ହେଲେ AI ଲକ୍ଷଣ ଟ୍ରିଆଜ୍ ବ୍ୟବହାର କରନ୍ତୁ କିମ୍ବା ନିକଟସ୍ଥ PHC କୁ ତୁରନ୍ତ ଯାଆନ୍ତୁ।',
        understood: 'ବୁଝିଗଲି (Understood)',
        close: 'ବନ୍ଦ କରନ୍ତୁ (Close)',
        genderMale: 'ପୁରୁଷ',
        genderFemale: 'ମହିଳା',
        genderOther: 'ଅନ୍ୟାନ୍ୟ',
        dobLabel: 'ଜନ୍ମ:'
      },
      'hi-IN': {
        brandTitle: 'स्वास्थ्यमित्र ओडिशा',
        brandSubtitle: 'ओडिशा डिजिटल हेल्थ मिशन (ABDM)',
        odishaGov: 'ओडिशा डिजिटल हेल्थ मिशन',
        abhaCardTitle: 'आभा (ABHA) डिजिटल हेल्थ आईडी',
        emergency108: '108 आपातकालीन SOS',
        healthAlertTitle: 'जनस्वास्थ्य चेतावनी: ओडिशा में डेंगू व लू से बचाव निर्देश जारी। लक्षण दिखने पर तुरंत जांच करें।',
        viewDetails: 'विवरण देखें',
        searchPlaceholder: 'डॉक्टर, बेड, एम्बुलेंस, ब्लड बैंक खोजें...',
        triageTitle: 'AI लक्षण व स्वर ट्राइएज',
        triageSub: 'बहुभाषी वॉइस इनपुट एवं क्लिनिकल ट्राइएज नोट',
        triageTag: 'AI माइक',
        bedTitle: 'अस्पताल बेड ट्रैकर',
        bedSub: '10,770 लाइव ICU व सामान्य बेड',
        bedTag: 'लाइव बेड',
        ambTitle: 'GPS 108 एम्बुलेंस डिस्पैच',
        ambSub: 'तत्काल 108 आपातकालीन जीपीएस कॉल',
        ambTag: '108 SOS',
        docTitle: 'डॉक्टर वीडियो परामर्श',
        docSub: '2,523 OMC सत्यापित विशेषज्ञ डॉक्टर',
        docTag: 'OPD सूची',
        rxTitle: 'डिजिटल प्रिस्क्रिप्शन पर्ची',
        rxSub: 'NMC डिजिटल Rx एवं रेफरल पर्ची',
        rxTag: 'NMC Rx',
        gpsTitle: 'निकटतम अस्पताल GPS',
        gpsSub: 'PHC, CHC व DHH नेविगेटर मैप',
        gpsTag: 'GPS मैप',
        bloodTitle: 'ब्लड बैंक नेटवर्क',
        bloodSub: '8,420 OSBTC ब्लड यूनिट्स उपलब्धता',
        bloodTag: 'OSBTC रक्त',
        medTitle: 'दवा सुरक्षा व एक्सपायरी जांच',
        medSub: 'OCR स्कैनर व ड्रग इंटरेक्शन सुरक्षा',
        medTag: 'OCR जांच',
        marketTitle: 'दवा बाज़ार एवं जन औषधि',
        marketSub: '28+ दवाएं व कटी स्ट्रिप QR जांच',
        marketTag: '28+ दवाएं',
        phcTitle: 'PHC ऑफलाइन सिंक इंजन',
        phcSub: 'जीरो-इंटरनेट ग्रामीण क्लीनिक डेटाबेस',
        phcTag: 'ऑफलाइन DB',
        ashaTitle: 'आशा कार्यकर्ता फील्ड पोर्टल',
        ashaSub: 'मातृ एवं शिशु स्वास्थ्य सर्वेक्षण',
        ashaTag: 'आशा फील्ड',
        adminTitle: 'राज्य स्वास्थ्य कमांड हब',
        adminSub: '30-जिला स्वास्थ्य प्रशासन व टेलीमेट्री',
        adminTag: 'कमांड',
        pilotTitle: '108 एम्बुलेंस पायलट कंसोल',
        pilotTag: '108 MDT',
        teleconsultTitle: 'लाइव वीडियो टेली-परामर्श',
        teleconsultSub: 'लाइव WebRTC वीडियो कॉल एवं डिजिटल पर्ची',
        teleconsultTag: 'लाइव वीडियो',
        teleconsultNav: 'वीडियो OPD',
        home: 'होम',
        services: 'सेवाएं',
        records: 'स्वास्थ्य रिकॉर्ड्स',
        profile: 'प्रोफ़ाइल',
        backToHome: 'वापस',
        copySuccess: 'आभा नंबर कॉपी किया गया!',
        linkedAbha: 'लिंक्ड आभा:',
        recordsHeading: 'स्वास्थ्य रिकॉर्ड्स',
        recordsSub: 'आयुष्मान भारत डिजिटल हेल्थ वॉल्ट',
        recordsShieldText: 'आपके अस्पताल परामर्श, प्रिस्क्रिप्शन और ट्राइएज इतिहास ओडिशा स्वास्थ्य नेटवर्क पर सुरक्षित रूप से सिंक हैं।',
        doctorConsultations: 'डॉक्टर परामर्श रिकॉर्ड',
        doctorConsultationsSub: 'आगामी OPD टोकन एवं वीडियो कॉल इतिहास',
        triageAssessments: 'विगत AI ट्राइएज आकलन',
        triageAssessmentsSub: 'वॉइस लक्षण रिकॉर्ड एवं आपातकालीन ट्राइएज लॉग',
        referralSlips: 'अस्पताल रेफरल पर्चियां',
        referralSlipsSub: 'आधिकारिक अंतर-अस्पताल क्लीनिकल ट्रांसफर मेमो',
        medicineRecords: 'दवा सुरक्षा व एक्सपायरी रिकॉर्ड',
        medicineRecordsSub: 'स्कैन की गई स्ट्रिप बैच सुरक्षा एवं सत्यापन वॉल्ट',
        servicesHeading: 'स्वास्थ्य सेवाएं',
        servicesSub: 'उपलब्ध ओडिशा ABDM क्लीनिकल मॉड्यूल्स',
        profileHeading: 'प्रोफ़ाइल एवं प्राथमिकताएं',
        langPref: 'भाषा प्राथमिकता (Language Preference)',
        colorTheme: 'रंग थीम (Color Theme)',
        themeLight: 'लाइट',
        themeDark: 'डार्क',
        themeSepia: 'सेपिया',
        switchRoleDemo: 'भूमिका बदलें (लाइव डेमो रिव्यू)',
        citizenRole: 'नागरिक (Citizen)',
        citizenRoleSub: 'स्तर 1: सार्वजनिक सेवा',
        doctorRole: 'डॉक्टर (Doctor / RMP)',
        doctorRoleSub: 'स्तर 3: क्लीनिकल',
        ashaRole: 'आशा कार्यकर्ता (ASHA / PHC)',
        ashaRoleSub: 'स्तर 2: आउटरीच',
        adminRole: 'सुपर एडमिन (Super Admin)',
        adminRoleSub: 'स्तर 5: राज्य प्रशासन',
        driverRole: '108 एम्बुलेंस पायलट',
        driverRoleSub: 'स्तर 4: डिस्पैच MDT',
        switchUserPortal: 'उपयोगकर्ता / स्टाफ पोर्टल बदलें',
        switchToDesktop: 'डेस्कटॉप मल्टी-हब व्यू पर जाएं',
        signIn: 'साइन इन / खाता बनाएं',
        signOut: 'साइन आउट',
        abhaQrTitle: 'आभा (ABHA) डिजिटल QR कोड',
        abhaQrSub: 'किसी भी PHC, CHC या DHH OPD काउंटर पर तत्काल पेपरलेस पंजीकरण के लिए स्कैन करें।',
        advisoryTitle: 'जनस्वास्थ्य डेंगू एवं लू परामर्श',
        issuedBy: 'जारीकर्ता: स्वास्थ्य एवं परिवार कल्याण विभाग, ओडिशा सरकार।',
        advisoryP1: 'सभी CHC में डेंगू की प्रारंभिक जांच एवं प्लेटलेट काउंटर सक्रिय हैं।',
        advisoryP2: 'सुबह 11:00 बजे से दोपहर 3:30 बजे तक सीधी धूप से बचें।',
        advisoryP3: 'पर्याप्त मात्रा में पानी, छाछ, नींबू पानी और ओआरएस पिएं।',
        advisoryP4: 'कंपकंपी के साथ बुखार या बदन दर्द होने पर AI लक्षण ट्राइएज का उपयोग करें या तुरंत निकटतम PHC जाएं।',
        understood: 'समझ गया (Understood)',
        close: 'बंद करें (Close)',
        genderMale: 'पुरुष',
        genderFemale: 'महिला',
        genderOther: 'अन्य',
        dobLabel: 'जन्म:'
      },
      'en-IN': {
        brandTitle: 'SwasthyaMitra Odisha',
        brandSubtitle: 'Odisha Digital Health Mission (ABDM)',
        odishaGov: 'ODISHA DIGITAL HEALTH MISSION',
        abhaCardTitle: 'ABHA Digital Health ID',
        emergency108: '108 EMERGENCY SOS',
        healthAlertTitle: 'PUBLIC HEALTH ALERT: Dengue & Heatwave Prevention Protocols Active in Odisha. Report Symptoms Immediately.',
        viewDetails: 'VIEW DETAILS',
        searchPlaceholder: 'Search doctors, beds, ambulance, blood...',
        triageTitle: 'AI Symptom Voice Triage',
        triageSub: 'Multilingual Voice & Triage Note',
        triageTag: 'AI Mic',
        bedTitle: 'Hospital Bed Tracker',
        bedSub: '10,770 Live ICU & General Beds',
        bedTag: 'Live Beds',
        ambTitle: 'GPS 108 Ambulance Dispatch',
        ambSub: 'Instant GPS Emergency SOS',
        ambTag: '108 SOS',
        docTitle: 'Doctor Video Consultation',
        docSub: '2,523 OMC Verified Specialists',
        docTag: 'OPD Directory',
        rxTitle: 'Digital Prescription Slips',
        rxSub: 'NMC Digital Rx & Referral Slips',
        rxTag: 'NMC Rx',
        gpsTitle: 'Nearest Hospital GPS',
        gpsSub: 'PHC, CHC & DHH Navigator',
        gpsTag: 'GPS Map',
        bloodTitle: 'Blood Bank Network',
        bloodSub: '8,420 OSBTC Blood Units',
        bloodTag: 'OSBTC Stock',
        medTitle: 'Medicine Expiry & Safety',
        medSub: 'OCR & Drug Interaction Guard',
        medTag: 'OCR Safe',
        marketTitle: 'Medicine Market & Jan Aushadhi',
        marketSub: '28+ Medicines & Cut Strip QR',
        marketTag: '28+ Meds',
        phcTitle: 'PHC Offline Sync Engine',
        phcSub: 'Zero-Internet Rural Clinic DB',
        phcTag: 'Offline DB',
        ashaTitle: 'ASHA Field Worker Portal',
        ashaSub: 'Maternal & Child Health Surveys',
        ashaTag: 'Field Outreach',
        adminTitle: 'State Command Hub',
        adminSub: '30-District Health Governance',
        adminTag: 'Command',
        pilotTitle: '108 Pilot MDT Console',
        pilotTag: '108 MDT',
        teleconsultTitle: 'Live Video Teleconsult',
        teleconsultSub: 'In-App WebRTC Video & AI SOAP Scribe',
        teleconsultTag: 'Live Video',
        teleconsultNav: 'Video OPD',
        home: 'Home',
        services: 'Services',
        records: 'Health Records',
        profile: 'Profile',
        backToHome: 'Back',
        copySuccess: 'ABHA Copied!',
        linkedAbha: 'Linked ABHA:',
        recordsHeading: 'Health Records',
        recordsSub: 'Ayushman Bharat Digital Health Vault',
        recordsShieldText: 'Your hospital visits, diagnostic prescriptions, and triage history are securely synced with the Odisha Health Network.',
        doctorConsultations: 'Doctor Consultations',
        doctorConsultationsSub: 'Upcoming OPD tokens & video call history',
        triageAssessments: 'Past AI Triage Assessments',
        triageAssessmentsSub: 'Voice symptom records & emergency triage logs',
        referralSlips: 'Hospital Referral Slips',
        referralSlipsSub: 'Official inter-hospital clinical transfer memos',
        medicineRecords: 'Medicine Safety & Expiry Records',
        medicineRecordsSub: 'Scanned strip batch safety and verification vault',
        servicesHeading: 'Healthcare Services',
        servicesSub: 'All available Odisha ABDM clinical modules',
        profileHeading: 'Profile & Preferences',
        langPref: 'Language Preference',
        colorTheme: 'Color Theme',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeSepia: 'Sepia',
        switchRoleDemo: 'Switch Role (Live Demo Review)',
        citizenRole: 'Citizen',
        citizenRoleSub: 'Tier 1: Public Care',
        doctorRole: 'Doctor (RMP)',
        doctorRoleSub: 'Tier 3: Clinical',
        ashaRole: 'ASHA / PHC',
        ashaRoleSub: 'Tier 2: Outreach',
        adminRole: 'Super Admin',
        adminRoleSub: 'Tier 5: State Gov',
        driverRole: '108 Ambulance Pilot',
        driverRoleSub: 'Tier 4: Dispatch MDT',
        switchUserPortal: 'Switch User / Staff Portal',
        switchToDesktop: 'Switch to Desktop Multi-Hub View',
        signIn: 'Sign In / Create Account',
        signOut: 'Sign Out',
        abhaQrTitle: 'ABHA Digital QR',
        abhaQrSub: 'Scan at any PHC, CHC, or DHH OPD counter for instant paperless registration.',
        advisoryTitle: 'Public Health Dengue & Heatwave Advisory',
        issuedBy: 'Issued by: Health & Family Welfare Dept, Govt of Odisha.',
        advisoryP1: 'Dengue early testing and platelet counters active across all CHCs.',
        advisoryP2: 'Avoid direct exposure to sunlight between 11:00 AM and 3:30 PM.',
        advisoryP3: 'Drink plenty of water, buttermilk, lemon water, and ORS.',
        advisoryP4: 'In case of fever with shivering or body ache, use AI Symptom Triage or visit nearest PHC immediately.',
        understood: 'Understood',
        close: 'Close',
        genderMale: 'Male',
        genderFemale: 'Female',
        genderOther: 'Other',
        dobLabel: 'DOB:'
      }
    };
    return dict[normalizedLang] || dict['or-IN'];
  }, [normalizedLang]);

  // Localized Gender
  const localizedGender = useMemo(() => {
    const g = (patientGender || '').toLowerCase();
    if (g.includes('fem') || g.includes('महिला') || g.includes('ମହିଳା')) return t.genderFemale;
    if (g.includes('mal') || g.includes('पुरुष') || g.includes('ପୁରୁଷ')) return t.genderMale;
    return patientGender || t.genderOther;
  }, [patientGender, t]);

  // Copy ABHA handler
  const handleCopyAbha = () => {
    navigator.clipboard?.writeText(abhaNumber);
    setCopiedAbha(true);
    setTimeout(() => setCopiedAbha(false), 2000);
  };

  const userRole = currentUser?.roleCategory || 'patient';
  const isAdmin = userRole === 'admin';
  const isDriver = userRole === 'driver' || userRole === 'ambulance';
  const isDoctor = userRole === 'doctor' || userRole === 'nurse';
  const isAsha = userRole === 'asha' || userRole === 'anm';

  // Action Portal Cards (Strict Hierarchical Role-Based Access Control)
  const actionCards = useMemo(() => {
    // 1. Citizen Tier Base Cards (Public Healthcare Services)
    const list = [
      {
        id: 'intake',
        hub: 'citizen',
        title: t.triageTitle,
        sub: t.triageSub,
        icon: Activity,
        iconBg: 'bg-rose-50 text-rose-500 border border-rose-200',
        tag: t.triageTag,
        searchKeywords: 'triage symptom voice mic ଆଇ ଲକ୍ଷଣ ସ୍ୱର ଟ୍ରିଆଜ୍ लक्षण जांच'
      },
      {
        id: 'beds',
        hub: 'citizen',
        title: t.bedTitle,
        sub: t.bedSub,
        icon: Bed,
        iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        tag: t.bedTag,
        searchKeywords: 'beds icu general hospital ବେଡ୍ ଆଇସିୟୁ ହସ୍ପିଟାଲ୍ बेड'
      },
      {
        id: 'ambulance',
        hub: 'citizen',
        title: t.ambTitle,
        sub: t.ambSub,
        icon: Truck,
        iconBg: 'bg-amber-50 text-amber-600 border border-amber-200',
        tag: t.ambTag,
        searchKeywords: 'ambulance 108 emergency gps ଆମ୍ବୁଲାନ୍ସ ଏମରଜେନ୍ସି एम्बुलेंस'
      },
      {
        id: 'doctors',
        hub: 'citizen',
        title: t.docTitle,
        sub: t.docSub,
        icon: Stethoscope,
        iconBg: 'bg-blue-50 text-blue-600 border border-blue-200',
        tag: t.docTag,
        searchKeywords: 'doctor opd specialist consultation ଡାକ୍ତର ଡାକ୍ତରଖାନା डॉक्टर'
      },
      {
        id: 'teleconsult',
        hub: 'citizen',
        title: t.teleconsultTitle,
        sub: t.teleconsultSub,
        icon: Video,
        iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
        tag: t.teleconsultTag,
        searchKeywords: 'teleconsult video call webrtc ଭିଡିଓ କଲ୍ ଟେଲିକନସଲ୍ଟ वीडियो'
      },
      {
        id: 'nearest',
        hub: 'citizen',
        title: t.gpsTitle,
        sub: t.gpsSub,
        icon: MapPin,
        iconBg: 'bg-sky-50 text-sky-600 border border-sky-200',
        tag: t.gpsTag,
        searchKeywords: 'hospital gps map phc chc dhh ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ ମ୍ୟାପ୍ अस्पताल'
      },
      {
        id: 'blood',
        hub: 'citizen',
        title: t.bloodTitle,
        sub: t.bloodSub,
        icon: Droplet,
        iconBg: 'bg-red-50 text-red-600 border border-red-200',
        tag: t.bloodTag,
        searchKeywords: 'blood bank donor osbtc ରକ୍ତ ଭଣ୍ଡାର ब्लड बैंक'
      },
      {
        id: 'medicines',
        hub: 'citizen',
        title: t.medTitle,
        sub: t.medSub,
        icon: Pill,
        iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-200',
        tag: t.medTag,
        searchKeywords: 'medicine expiry ocr safety ଔଷଧ ଏକ୍ସପାଏରୀ ସୁରକ୍ଷା दवा जांच'
      },
      {
        id: 'market',
        hub: 'citizen',
        title: t.marketTitle,
        sub: t.marketSub,
        icon: ShoppingBag,
        iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        tag: t.marketTag,
        searchKeywords: 'medicine market generic jan aushadhi ଔଷଧ ବଜାର ଜନଔଷଧି दवा बाज़ार'
      }
    ];

    // 2. Doctor Tier Modules
    if (isDoctor || isAdmin) {
      list.push({
        id: 'prescriptions',
        hub: 'doctor',
        title: t.rxTitle,
        sub: t.rxSub,
        icon: FileText,
        iconBg: 'bg-purple-50 text-purple-600 border border-purple-200',
        tag: t.rxTag,
        searchKeywords: 'nmc prescription rx referral ଡିଜିଟାଲ୍ ପ୍ରେସକ୍ରିପସନ୍ पर्ची'
      });
    }

    // 3. ASHA Frontline Tier Modules
    if (isAsha || isAdmin || isDoctor) {
      list.push({
        id: 'phc_offline',
        hub: 'phc',
        title: t.phcTitle,
        sub: t.phcSub,
        icon: Database,
        iconBg: 'bg-teal-50 text-teal-600 border border-teal-200',
        tag: t.phcTag,
        searchKeywords: 'phc offline rural clinic sync ଅଫଲାଇନ୍ ସିଙ୍କ୍ ऑफलाइन'
      });
    }

    if (isAsha || isAdmin) {
      list.push({
        id: 'asha_field',
        hub: 'phc',
        title: t.ashaTitle,
        sub: t.ashaSub,
        icon: HeartPulse,
        iconBg: 'bg-pink-50 text-pink-600 border border-pink-200',
        tag: t.ashaTag,
        searchKeywords: 'asha frontline outreach survey ମାତୃ ଶିଶୁ ଆଶା आशा'
      });
    }

    // 4. Logistics 108 Ambulance Pilot Tier
    if (isDriver || isAdmin) {
      list.push({
        id: 'ambulance_driver',
        hub: 'driver',
        title: t.pilotTitle,
        sub: t.ambSub,
        icon: Truck,
        iconBg: 'bg-rose-50 text-rose-600 border border-rose-200',
        tag: t.pilotTag,
        searchKeywords: '108 driver pilot mdt dispatch ଆମ୍ବୁଲାନ୍ସ ପାଇଲଟ୍ पायलट'
      });
    }

    // 5. State Administration Tier
    if (isAdmin) {
      list.push({
        id: 'admin',
        hub: 'admin',
        title: t.adminTitle,
        sub: t.adminSub,
        icon: Layers,
        iconBg: 'bg-slate-100 text-slate-700 border border-slate-300',
        tag: t.adminTag,
        searchKeywords: 'admin command governance ରାଜ୍ୟ କମାଣ୍ଡ प्रशासन'
      });
    }

    return list;
  }, [t, isAdmin, isDoctor, isAsha, isDriver]);

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

  // Filtered Cards based on search with multilingual keyword support
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return actionCards;
    const q = searchQuery.toLowerCase().trim();
    return actionCards.filter(
      (c) =>
        (c.title && c.title.toLowerCase().includes(q)) ||
        (c.sub && c.sub.toLowerCase().includes(q)) ||
        (c.tag && c.tag.toLowerCase().includes(q)) ||
        (c.searchKeywords && c.searchKeywords.toLowerCase().includes(q))
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

              {/* 3-Language Pill (Odia | Hindi | English) */}
              <div className="flex items-center bg-black/25 rounded-full p-0.5 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    normalizedLang === 'or-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  ଓଡ଼ିଆ
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('hi-IN')}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    normalizedLang === 'hi-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
                <button
                  type="button"
                  onClick={() => setAppLang('en-IN')}
                  className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                    normalizedLang === 'en-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                  }`}
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
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.servicesHeading}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.servicesSub}</p>
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
                <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.recordsHeading}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">{t.recordsSub}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-300">
                ABDM 256-BIT
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{t.linkedAbha} {abhaNumber}</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                {t.recordsShieldText}
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
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.doctorConsultations}</div>
                    <div className="text-[10px] text-slate-500">{t.doctorConsultationsSub}</div>
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
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{t.triageAssessments}</div>
                    <div className="text-[10px] text-slate-500">{t.triageAssessmentsSub}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {isDoctor || isAdmin ? (
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
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.referralSlips}</div>
                      <div className="text-[10px] text-slate-500">{t.referralSlipsSub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleOpenModule('medicines', 'citizen')}
                  className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs flex items-center justify-between active:scale-98 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 flex items-center justify-center">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 dark:text-white">{t.medicineRecords}</div>
                      <div className="text-[10px] text-slate-500">{t.medicineRecordsSub}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>
        ) : mobileSection === 'profile' ? (
          /* ───────────────────────────────────────────────────────────── */
          /* PROFILE TAB: USER DETAILS & THEME/LANGUAGE CONTROLS           */
          /* ───────────────────────────────────────────────────────────── */
          <div className="flex-1 flex flex-col p-4 space-y-4 animate-fadeIn">
            <div className="pt-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">{t.profileHeading}</h2>
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t.langPref}</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAppLang('or-IN')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    normalizedLang === 'or-IN'
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
                    normalizedLang === 'hi-IN'
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
                    normalizedLang === 'en-IN'
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
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">{t.colorTheme}</label>
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
                  <span>{t.themeLight}</span>
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
                  <span>{t.themeDark}</span>
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
                  <span>{t.themeSepia}</span>
                </button>
              </div>
            </div>

            {/* 🎭 1-CLICK INSTANT DEMO PERSONA SWITCHER */}
            {onSwitchPersona && (
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>🎭 {t.switchRoleDemo}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                    Hierarchical RBAC
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onSwitchPersona('patient')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      userRole === 'patient'
                        ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-400">{t.citizenRole}</div>
                    <div className="text-[10px] text-slate-500">{t.citizenRoleSub}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchPersona('doctor')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isDoctor
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400">{t.doctorRole}</div>
                    <div className="text-[10px] text-slate-500">{t.doctorRoleSub}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchPersona('asha')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isAsha
                        ? 'bg-teal-100 border-teal-400 text-teal-950 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-teal-800 dark:text-teal-400">{t.ashaRole}</div>
                    <div className="text-[10px] text-slate-500">{t.ashaRoleSub}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchPersona('admin')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isAdmin
                        ? 'bg-purple-100 border-purple-400 text-purple-950 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-purple-800 dark:text-purple-400">{t.adminRole}</div>
                    <div className="text-[10px] text-slate-500">{t.adminRoleSub}</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSwitchPersona('driver')}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer col-span-2 ${
                      isDriver
                        ? 'bg-rose-100 border-rose-400 text-rose-950 font-bold shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold text-rose-800 dark:text-rose-400">{t.driverRole}</div>
                    <div className="text-[10px] text-slate-500">{t.driverRoleSub}</div>
                  </button>
                </div>
              </div>
            )}

            {/* Switch User / Role Portal */}
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{t.switchUserPortal}</span>
            </button>

            {onSwitchToDesktop && (
              <button
                type="button"
                onClick={onSwitchToDesktop}
                className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 shadow-sm active:scale-98 transition-all cursor-pointer"
              >
                <Monitor className="w-4 h-4 text-emerald-400" />
                <span>{t.switchToDesktop}</span>
              </button>
            )}

            {currentUser?.isGuest ? (
              <button
                type="button"
                onClick={onOpenAuth}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer animate-pulse"
              >
                <LogIn className="w-4 h-4" />
                <span>{t.signIn}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onLogout}
                className="w-full py-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.signOut} ({currentUser.name})</span>
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
                  {/* Language Toggle: Odia | Hindi | English */}
                  <div className="flex items-center bg-black/25 rounded-full p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setAppLang('or-IN')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        normalizedLang === 'or-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                      }`}
                    >
                      ଓଡ଼ିଆ
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppLang('hi-IN')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        normalizedLang === 'hi-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                      }`}
                    >
                      हिन्दी
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppLang('en-IN')}
                      className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                        normalizedLang === 'en-IN' ? 'bg-white text-emerald-950 font-black shadow-xs' : 'text-emerald-200 hover:text-white'
                      }`}
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
                      {t.dobLabel} {patientDob} • {localizedGender}
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
                <span className="font-bold text-sm text-slate-900 dark:text-white">{t.abhaQrTitle}</span>
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
                <p className="text-[11px] text-slate-500 mt-2">{t.abhaQrSub}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                {t.close}
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
                  <span>{t.advisoryTitle}</span>
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
                <p><strong>{t.issuedBy}</strong></p>
                <ul className="list-disc pl-4 space-y-1 text-[11px]">
                  <li>{t.advisoryP1}</li>
                  <li>{t.advisoryP2}</li>
                  <li>{t.advisoryP3}</li>
                  <li>{t.advisoryP4}</li>
                </ul>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvisoryDetail(false)}
                className="w-full py-2.5 rounded-xl bg-amber-700 text-white font-bold text-xs"
              >
                {t.understood}
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
