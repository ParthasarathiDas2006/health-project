import React, { useState } from 'react';
import {
  ShieldCheck,
  Truck,
  Stethoscope,
  Database,
  User,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2,
  X,
  Lock,
  Layers,
  Activity,
  HeartPulse,
  Radio,
  FileText,
  Bed,
  MapPin,
  ChevronRight,
  ExternalLink,
  Shield
} from 'lucide-react';

export default function HealthcareHierarchyModal({
  isOpen,
  onClose,
  currentUser,
  appLang = 'en-IN',
  activeHub,
  onSwitchHub,
  onSwitchPersona
}) {
  const [activeTab, setActiveTab] = useState('pyramid'); // 'pyramid' | 'dataflow' | 'matrix'

  if (!isOpen) return null;

  const currentRole = currentUser?.roleCategory || 'patient';
  const isAdmin = currentRole === 'admin';
  const isDriver = currentRole === 'driver' || currentRole === 'ambulance';
  const isDoctor = currentRole === 'doctor' || currentRole === 'nurse';
  const isAsha = currentRole === 'asha' || currentRole === 'anm';
  const isPatient = !isAdmin && !isDriver && !isDoctor && !isAsha;

  // Determine current tier number
  const currentTier = isAdmin ? 5 : isDriver ? 4 : isDoctor ? 3 : isAsha ? 2 : 1;

  // Translations
  const t = {
    'or-IN': {
      modalTitle: 'ଭାରତୀୟ ୫-ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଣାଳୀ ଓ ଭୂମିକା ସଂରଚନା',
      modalSubtitle: 'ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (NHM) ଏବଂ ଆୟୁଷ୍ମାନ ଭାରତ ଅନୁରୂପ ପଦାନୁକ୍ରମିକ ବ୍ୟବସ୍ଥା',
      tabPyramid: '୧. ପିରାମିଡ୍ ସ୍ତର ସଂରଚନା',
      tabDataflow: '୨. ସୂଚନା ଓ ରେଫରାଲ୍ ପ୍ରବାହ',
      tabMatrix: '୩. ଭୂମିକା ଅନୁମତି ମ୍ୟାଟ୍ରିକ୍ସ (RBAC)',
      yourClearance: 'ଆପଣଙ୍କ ସକ୍ରିୟ ସୁରକ୍ଷା ସ୍ତର:',
      tierBadge: (num) => `ସ୍ତର ${num}`,
      activeUserTag: 'ସକ୍ରିୟ ଲଗ୍-ଇନ୍ ଉପଭୋକ୍ତା',
      viewHub: 'ଏହି ସ୍ତର ଦେଖନ୍ତୁ',
      restricted: 'ସୁରକ୍ଷିତ / ସୀମିତ',
      close: 'ବନ୍ଦ କରନ୍ତୁ',
      tiers: [
        {
          tier: 5,
          id: 'admin',
          name: 'ରାଜ୍ୟ କମାଣ୍ଡ ଓ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସନ',
          subtitle: 'State Apex Command & Health Governance',
          color: 'purple',
          border: 'border-purple-500',
          bg: 'bg-purple-900/10 dark:bg-purple-950/40',
          badgeBg: 'bg-purple-700 text-white',
          stakeholders: 'ସ୍ୱାସ୍ଥ୍ୟ ସଚିବ, CDMO, ରାଜ୍ୟ ନୋଡାଲ୍ ଅଧିକାରୀ, ସୁପର ଆଡମିନ୍',
          scope: '୩୦ ଜିଲ୍ଲାର ୧୦,୭୭୦ ବେଡ୍ ଲାଇଭ୍ ଟ୍ରାକିଂ, IDSP ମହାମାରୀ ରାଡାର, ରକ୍ତ ଭଣ୍ଡାର ନେଟୱର୍କ, ଔଷଧ ଯୋଗାଣ ଶୃଙ୍ଖଳା, ନିୟାମକ ଅଡିଟ୍।',
          inflow: 'ଜିଲ୍ଲା ଚିକିତ୍ସାଳୟ (DHH/CHC) ବେଡ୍ ତଥ୍ୟ, ଆମ୍ବୁଲାନ୍ସ ଟ୍ରାଞ୍ଜିଟ୍ ଲଗ୍, ସଂକ୍ରାମକ ରୋଗ କ୍ଲଷ୍ଟର୍ ରିପୋର୍ଟ।',
          outflow: 'ଜରୁରୀକାଳୀନ ICU ଆବଣ୍ଟନ, ଔଷଧ ସାମଗ୍ରୀ ପ୍ରେରଣ, ସ୍ୱାସ୍ଥ୍ୟ ନୀତି ଓ ଆଡଭାଇଜରୀ ନିର୍ଦ୍ଦେଶ।',
          securityClearance: 'LEVEL 5 (APEX STATE DIRECTIVE)'
        },
        {
          tier: 4,
          id: 'driver',
          name: '୧୦୮ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ କମାଣ୍ଡ (MDT)',
          subtitle: 'Emergency Medical Transport & Dispatch',
          color: 'rose',
          border: 'border-rose-500',
          bg: 'bg-rose-900/10 dark:bg-rose-950/40',
          badgeBg: 'bg-rose-700 text-white',
          stakeholders: '୧୦୮ ALS/BLS ପାଇଲଟ୍, ଜରୁରୀକାଳୀନ ଟେକ୍ନିସିଆନ୍ (EMT), ଷ୍ଟେଟ୍ ଡିସପାଚର୍',
          scope: 'ଜରୁରୀକାଳୀନ CAD GPS ଡିସପାଚ୍, ରୋଗୀ ଓ ହସ୍ପିଟାଲ୍ ମାର୍ଗ ନାଭିଗେସନ୍, ଲାଇଭ୍ SpO2/BP ଟେଲିମେଟ୍ରି, ଟ୍ରାଫିକ୍ ଗ୍ରୀନ୍ କରିଡର, ହସ୍ପିଟାଲ୍ ER ଆଗୁଆ ସୂଚନା।',
          inflow: 'ନାଗରିକ SOS ଅନୁରୋଧ, ଡାକ୍ତର ରେଡ୍ ଫ୍ଲାଗ୍ ଏସ୍କାଲେସନ୍, GPS କୋଅର୍ଡିନେଟ୍ସ।',
          outflow: 'ଗାଡ଼ିରୁ ହସ୍ପିଟାଲ୍ କୁ ଲାଇଭ୍ ଭାଇଟାଲ୍ସ, ଆଗମନ ସମୟ (ETA), ER ହ୍ୟାଣ୍ଡଓଭର ସାରାଂଶ।',
          securityClearance: 'LEVEL 4 (TACTICAL TRANSIT)'
        },
        {
          tier: 3,
          id: 'doctor',
          name: 'ଡାକ୍ତର କ୍ଲିନିକାଲ୍ କକ୍‌ପିଟ୍ ଓ ଟେଲିମେଡିସିନ୍',
          subtitle: 'Secondary / Tertiary Clinical Decision Support',
          color: 'emerald',
          border: 'border-emerald-500',
          bg: 'bg-emerald-900/10 dark:bg-emerald-950/40',
          badgeBg: 'bg-emerald-700 text-white',
          stakeholders: 'ପଞ୍ଜୀକୃତ ଡାକ୍ତର (RMP), ମେଡିକାଲ୍ ଅଫିସର୍ (MO), ବିଶେଷଜ୍ଞ ଚିକିତ୍ସକ',
          scope: 'AI ଟ୍ରାଏଜ୍ ଧାଡ଼ି (ଲାଲ୍/ହଳଦିଆ/ସବୁଜ), SBAR ହ୍ୟାଣ୍ଡଓଭର, NEWS2/qSOFA କ୍ଲିନିକାଲ୍ ରିସ୍କ, NMC QR ପ୍ରେସକ୍ରିପସନ୍, ଔଷଧ ଆଲର୍ଜି ଗାର୍ଡ, WebRTC ଟେଲି-ପରାମର୍ଶ।',
          inflow: 'ନାଗରିକ ଲକ୍ଷଣ ଟିକେଟ୍, ଆଶା ଫିଲ୍ଡ ସ୍କ୍ରିନିଂ, ଲ୍ୟାବ୍ ରିପୋର୍ଟ OCR ତଥ୍ୟ।',
          outflow: 'ଯାଞ୍ଚ ହୋଇଥିବା ପ୍ରେସକ୍ରିପସନ୍, ଡିସଚାର୍ଜ ନୋଟ୍, ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍ ଅର୍ଡର।',
          securityClearance: 'LEVEL 3 (CLINICAL DECISION AUTHORITY)'
        },
        {
          tier: 2,
          id: 'phc',
          name: 'ଗ୍ରାମୀଣ PHC ଓ ଆଶା ଫ୍ରଣ୍ଟଲାଇନ୍ ଷ୍ଟେସନ୍',
          subtitle: 'Primary Health Centre & Community Outreach',
          color: 'teal',
          border: 'border-teal-500',
          bg: 'bg-teal-900/10 dark:bg-teal-950/40',
          badgeBg: 'bg-teal-700 text-white',
          stakeholders: 'ଆଶା କର୍ମୀ (ASHA), ANM, ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ଅଧିକାରୀ (CHO), ଉପକେନ୍ଦ୍ର ନର୍ସ',
          scope: 'ଅଫଲାଇନ୍ PWA ଡାଟାବେସ୍ (IndexedDB ସିଙ୍କ୍), ଓଡ଼ିଆ/ହିନ୍ଦୀ ଭଏସ୍ କୋପାଇଲଟ୍, ANC ଗର୍ଭବତୀ ମାତୃ ସୁରକ୍ଷା, ଶିଶୁ ଟୀକାକରଣ, ପରିବାର କ୍ୟାମ୍ପ ସ୍କ୍ରିନିଂ, ପେନ୍ ମ୍ୟାପ୍।',
          inflow: 'ଘର-ଘର ସର୍ବେକ୍ଷଣ, ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ପାରାମିଟର, ଇଣ୍ଟରନେଟ୍ ବିହୀନ ଗ୍ରାମୀଣ ତଥ୍ୟ।',
          outflow: 'PHC କ୍ଲିନିକ୍ କୁ ଅଫଲାଇନ୍ ସିଙ୍କ୍, ଉଚ୍ଚ-ବିପଦ ଗର୍ଭବତୀ ଆଲର୍ଟ, ଡାକ୍ତର ପରାମର୍ଶ ପାଇଁ ଫରୱାର୍ଡ଼।',
          securityClearance: 'LEVEL 2 (FRONTLINE OUTREACH)'
        },
        {
          tier: 1,
          id: 'citizen',
          name: 'ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ ଡେସ୍କ ଓ ସ୍ୱୟଂ-ଟ୍ରାଏଜ୍',
          subtitle: 'Citizen Care Desk & Self-Triage Front-Door',
          color: 'amber',
          border: 'border-amber-500',
          bg: 'bg-amber-900/10 dark:bg-amber-950/40',
          badgeBg: 'bg-amber-600 text-white',
          stakeholders: 'ସାଧାରଣ ନାଗରିକ, ରୋଗୀ, ପରିବାର, ABHA ସ୍ୱାସ୍ଥ୍ୟ ID ଧାରକ',
          scope: 'ସ୍ଥାନୀୟ ଭାଷାରେ ଭଏସ୍/ଟେକ୍ସଟ୍ ଲକ୍ଷଣ ପ୍ରବେଶ, ହସ୍ପିଟାଲ୍ ବେଡ୍ ରିଜର୍ଭେସନ୍ (ପ୍ଲଟ୍ ଓ ରୁମ୍ କି\' ସହିତ), ୧୦୮ SOS ଡାକରା, ଜନଔଷଧି ବଜାର, ଭିଡିଓ କଲ୍।',
          inflow: 'ବ୍ୟକ୍ତିଗତ ଲକ୍ଷଣ, ରକ୍ତଚାପ/ନାଡ଼ି ସୂଚକ, ଫଟୋ ଲ୍ୟାବ୍ ସ୍ଲିପ୍।',
          outflow: 'ଡାକ୍ତର ଧାଡ଼ିକୁ ସଂରଚିତ ଟ୍ରାଏଜ୍ ଟିକେଟ୍, ବେଡ୍ ନିଶ୍ଚିତୀକରଣ କାର୍ଡ, ଡାକ୍ତର ବୁକିଂ।',
          securityClearance: 'LEVEL 1 (PUBLIC CITIZEN ACCESS)'
        }
      ]
    },
    'hi-IN': {
      modalTitle: 'भारतीय 5-स्तरीय स्वास्थ्य प्रणाली एवं भूमिका संरचना',
      modalSubtitle: 'राष्ट्रीय स्वास्थ्य मिशन (NHM) एवं आयुष्मान भारत अनुरूप पदानुक्रमित संरचना',
      tabPyramid: '1. पिरामिड स्तरीय संरचना',
      tabDataflow: '2. डेटा एवं रेफरल प्रवाह',
      tabMatrix: '3. भूमिका अनुमति मैट्रिक्स (RBAC)',
      yourClearance: 'आपकी सक्रिय सुरक्षा स्वीकृति:',
      tierBadge: (num) => `स्तर ${num}`,
      activeUserTag: 'सक्रिय लॉग-इन उपयोगकर्ता',
      viewHub: 'इस स्तर पर जाएं',
      restricted: 'प्रतिबंधित / सीमित',
      close: 'बंद करें',
      tiers: [
        {
          tier: 5,
          id: 'admin',
          name: 'राज्य कमान एवं स्वास्थ्य प्रशासन',
          subtitle: 'State Apex Command & Health Governance',
          color: 'purple',
          border: 'border-purple-500',
          bg: 'bg-purple-900/10 dark:bg-purple-950/40',
          badgeBg: 'bg-purple-700 text-white',
          stakeholders: 'स्वास्थ्य सचिव, CDMO, राज्य नोडल अधिकारी, सुपर एडमिन',
          scope: '30 जिलों में 10,770 बेड की लाइव ट्रैकिंग, IDSP महामारी रडार, ब्लड बैंक नेटवर्क, दवा आपूर्ति श्रृंखला, विनियामक गैर-निदान ऑडिट।',
          inflow: 'जिला अस्पताल बेड आंकड़े, 108 एम्बुलेंस ट्रांजिट लॉग, महामारी रिपोर्ट।',
          outflow: 'आपातकालीन ICU आवंटन, दवा आपूर्ति आदेश, राज्य स्वास्थ्य सलाह।',
          securityClearance: 'LEVEL 5 (APEX STATE DIRECTIVE)'
        },
        {
          tier: 4,
          id: 'driver',
          name: '108 आपातकालीन एम्बुलेंस कमान (MDT)',
          subtitle: 'Emergency Medical Transport & Dispatch',
          color: 'rose',
          border: 'border-rose-500',
          bg: 'bg-rose-900/10 dark:bg-rose-950/40',
          badgeBg: 'bg-rose-700 text-white',
          stakeholders: '108 ALS/BLS पायलट, आपातकालीन तकनीशियन (EMT), डिस्पैचर',
          scope: 'आपातकालीन CAD GPS डिस्पैच, टर्न-बाय-टर्न नेविगेशन, लाइव SpO2/BP टेलीमेट्री, ग्रीन कॉरिडोर, अस्पताल ER पूर्व सूचना।',
          inflow: 'नागरिक SOS कॉल, डॉक्टर रेड फ्लैग आदेश, GPS निर्देशांक।',
          outflow: 'चलती एम्बुलेंस से अस्पताल को लाइव वाइटल्स, ETA, ER हैंडओवर।',
          securityClearance: 'LEVEL 4 (TACTICAL TRANSIT)'
        },
        {
          tier: 3,
          id: 'doctor',
          name: 'डॉक्टर क्लिनिकल कॉकपिट एवं टेलीमेडिसिन',
          subtitle: 'Secondary / Tertiary Clinical Decision Support',
          color: 'emerald',
          border: 'border-emerald-500',
          bg: 'bg-emerald-900/10 dark:bg-emerald-950/40',
          badgeBg: 'bg-emerald-700 text-white',
          stakeholders: 'पंजीकृत चिकित्सक (RMP), मेडिकल ऑफिसर, विशेषज्ञ डॉक्टर',
          scope: 'AI ट्रायज कतार (लाल/पीला/हरा), SBAR हैंडओवर, NEWS2/qSOFA जोखिम गणना, NMC QR प्रिस्क्रिप्शन, ड्रग एलर्जी गार्ड, WebRTC वीडियो परामर्श।',
          inflow: 'नागरिक लक्षण टिकट, आशा फील्ड स्क्रीनिंग, लैब रिपोर्ट OCR डेटा।',
          outflow: 'प्रमाणित प्रिस्क्रिप्शन, डिस्चार्ज समरी, 108 एम्बुलेंस रेफरल।',
          securityClearance: 'LEVEL 3 (CLINICAL DECISION AUTHORITY)'
        },
        {
          tier: 2,
          id: 'phc',
          name: 'ग्रामीण PHC एवं आशा फील्ड स्टेशन',
          subtitle: 'Primary Health Centre & Community Outreach',
          color: 'teal',
          border: 'border-teal-500',
          bg: 'bg-teal-900/10 dark:bg-teal-950/40',
          badgeBg: 'bg-teal-700 text-white',
          stakeholders: 'आशा कार्यकर्ता (ASHA), ANM, सामुदायिक स्वास्थ्य अधिकारी (CHO)',
          scope: 'ऑफलाइन PWA डेटाबेस (IndexedDB सिंक), हिंदी/उड़िया वॉइस कोपायलट, ANC गर्भवती मातृ सुरक्षा, टीकाकरण, परिवार कैंप ट्रायज, पेन मैप।',
          inflow: 'डोर-टू-डोर सर्वे, मातृ-शिशु स्वास्थ्य वाइटल्स, नो-इंटरनेट रिकॉर्ड्स।',
          outflow: 'PHC केंद्र को ऑटो-सिंक, हाई-रिस्क मातृ चेतावनी, डॉक्टर रेफरल।',
          securityClearance: 'LEVEL 2 (FRONTLINE OUTREACH)'
        },
        {
          tier: 1,
          id: 'citizen',
          name: 'नागरिक स्वास्थ्य डेस्क एवं सेल्फ-ट्रायज',
          subtitle: 'Citizen Care Desk & Self-Triage Front-Door',
          color: 'amber',
          border: 'border-amber-500',
          bg: 'bg-amber-900/10 dark:bg-amber-950/40',
          badgeBg: 'bg-amber-600 text-white',
          stakeholders: 'आम नागरिक, मरीज, परिजन, आयुष्मान ABHA धारक',
          scope: 'स्थानीय भाषा में वॉइस/टेक्स्ट लक्षण दर्ज, अस्पताल बेड रिजर्वेशन (कमरा व प्लॉट सहित), 108 SOS कॉल, जन औषधि सस्ती दवाएं, वीडियो कंसल्ट।',
          inflow: 'व्यक्तिगत लक्षण, वाइटल्स (SpO2/BP), लैब रिपोर्ट फोटो।',
          outflow: 'डॉक्टर कतार को संरचित टिकट, बेड बुकिंग पास, डॉक्टर अपॉइंटमेंट।',
          securityClearance: 'LEVEL 1 (PUBLIC CITIZEN ACCESS)'
        }
      ]
    },
    'en-IN': {
      modalTitle: 'Indian 5-Tier Healthcare Hierarchy Architecture',
      modalSubtitle: 'National Health Mission (NHM) & Ayushman Bharat Multi-Tier Governance Framework',
      tabPyramid: '1. Tier Hierarchy Pyramid',
      tabDataflow: '2. Information & Referral Flow',
      tabMatrix: '3. Role-Based Access Control (RBAC)',
      yourClearance: 'Your Active Security Clearance:',
      tierBadge: (num) => `Tier ${num}`,
      activeUserTag: 'Active Logged-In Persona',
      viewHub: 'Open Tier Workspace',
      restricted: 'Restricted / Locked',
      close: 'Close',
      tiers: [
        {
          tier: 5,
          id: 'admin',
          name: 'State Health Command & Governance',
          subtitle: 'Apex Health Directorate & State Mission Command',
          color: 'purple',
          border: 'border-purple-500',
          bg: 'bg-purple-900/10 dark:bg-purple-950/40',
          badgeBg: 'bg-purple-700 text-white',
          stakeholders: 'Health Secretary, CDMO, State Nodal Officers, Super Admins',
          scope: 'State-wide bed matrix (10,770 beds across 30 districts), IDSP Outbreak Heatmap & Radar, Blood Bank Network, NHM Drug Linkages, Transfer Approvals, Regulatory Non-Diagnostic Audits.',
          inflow: 'District Hospital bed occupancy streams, 108 fleet telemetry, epidemic anomaly flags.',
          outflow: 'ICU quota allocations, emergency drug stock dispatches, state health directives.',
          securityClearance: 'LEVEL 5 (APEX STATE DIRECTIVE)'
        },
        {
          tier: 4,
          id: 'driver',
          name: '108 Emergency Ambulance Command (MDT)',
          subtitle: 'Mobile Data Terminal & Tactical EMS Transit',
          color: 'rose',
          border: 'border-rose-500',
          bg: 'bg-rose-900/10 dark:bg-rose-950/40',
          badgeBg: 'bg-rose-700 text-white',
          stakeholders: '108 ALS/BLS Pilots, Emergency Medical Technicians (EMTs), Dispatchers',
          scope: 'Live CAD GPS dispatch, Turn-by-Turn transit navigation, En-route telemetry uplink (SpO2, NIBP, Pulse), Emergency green corridor, Hospital ER advance notice.',
          inflow: 'Citizen SOS requests, Clinician red flag escalations, Patient GPS coordinates.',
          outflow: 'In-transit live vitals to receiving ER, accurate ETA, digital SBAR handover.',
          securityClearance: 'LEVEL 4 (TACTICAL TRANSIT)'
        },
        {
          tier: 3,
          id: 'doctor',
          name: 'Doctor Clinical Cockpit & Telemedicine',
          subtitle: 'Secondary / Tertiary Clinical Decision Support',
          color: 'emerald',
          border: 'border-emerald-500',
          bg: 'bg-emerald-900/10 dark:bg-emerald-950/40',
          badgeBg: 'bg-emerald-700 text-white',
          stakeholders: 'Registered Medical Practitioners (RMPs), Medical Officers (MOs), Specialists',
          scope: 'AI-assisted Triage Queue (RED/YELLOW/GREEN acuity), SBAR clinical handovers, NEWS2 & qSOFA risk calculators, Differential AI triage, Drug-Allergy Safety Guard, MoHFW Compliant NMC QR Prescriptions.',
          inflow: 'Patient symptom intake tickets, ASHA field screenings, Lab OCR extracted metrics.',
          outflow: 'Clinically validated prescriptions, discharge summaries, 108 ambulance transfer orders.',
          securityClearance: 'LEVEL 3 (CLINICAL DECISION AUTHORITY)'
        },
        {
          tier: 2,
          id: 'phc',
          name: 'Rural PHC & Frontline ASHA Station',
          subtitle: 'Primary Health Centre & Community Outreach',
          color: 'teal',
          border: 'border-teal-500',
          bg: 'bg-teal-900/10 dark:bg-teal-950/40',
          badgeBg: 'bg-teal-700 text-white',
          stakeholders: 'ASHA Workers, ANMs, Community Health Officers (CHOs), Sub-Center Nurses',
          scope: 'Offline-First PWA (IndexedDB Sync Outbox), Voice Copilot in Odia & Hindi, High-Risk Maternal ANC Tracking, Child Immunization, Family Camp Multi-Member Screening, Pictorial Pain Map.',
          inflow: 'Door-to-door village surveys, maternal & child vitals, zero-connectivity rural records.',
          outflow: 'Automated background sync to PHC database, high-risk maternal alerts, teleconsultation referrals.',
          securityClearance: 'LEVEL 2 (FRONTLINE OUTREACH)'
        },
        {
          tier: 1,
          id: 'citizen',
          name: 'Citizen Care Desk & Self-Triage Front-Door',
          subtitle: 'Citizen Health Desk & Patient Portal',
          color: 'amber',
          border: 'border-amber-500',
          bg: 'bg-amber-900/10 dark:bg-amber-950/40',
          badgeBg: 'bg-amber-600 text-white',
          stakeholders: 'Citizens, Patients, Family Caregivers, ABHA Health ID Holders',
          scope: 'Multimodal Voice & Text Symptom Intake in local dialect, Real-time Hospital Bed Reservation (Plot & Room visual keys), 108 SOS Quick Dispatch, Jan Aushadhi Generic Medicine Search, Video Teleconsultation.',
          inflow: 'Self-reported symptoms, wearable/measured vitals (BP/Pulse/SpO2), phone photo lab slips.',
          outflow: 'Structured triage note forwarded to on-duty RMP queue, bed reservation pass, appointment tokens.',
          securityClearance: 'LEVEL 1 (PUBLIC CITIZEN ACCESS)'
        }
      ]
    }
  };

  const currentStrings = t[appLang] || t['en-IN'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-5xl max-h-[92vh] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                  {currentStrings.modalTitle}
                </h2>
                <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                  NHM / ABDM
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentStrings.modalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={currentStrings.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current User Clearance Banner */}
        <div className="px-5 py-3 bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-bold text-slate-600 dark:text-slate-400">
              {currentStrings.yourClearance}
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 rounded-lg font-black text-white shadow-xs ${
                currentTier === 5
                  ? 'bg-purple-700'
                  : currentTier === 4
                  ? 'bg-rose-700'
                  : currentTier === 3
                  ? 'bg-emerald-700'
                  : currentTier === 2
                  ? 'bg-teal-700'
                  : 'bg-amber-600'
              }`}>
                TIER {currentTier}: {currentUser?.role?.split('/')[0] || 'Citizen'}
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                ID: {currentUser?.staffId || 'USR-606'}
              </span>
              <span className="text-slate-600 dark:text-slate-300 font-medium truncate max-w-[220px]">
                📍 {currentUser?.facility || 'Community Front-Desk'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500">
            <Shield className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Strict RBAC Active • Zero Cross-Role Data Leak</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('pyramid')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'pyramid'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{currentStrings.tabPyramid}</span>
          </button>
          <button
            onClick={() => setActiveTab('dataflow')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'dataflow'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{currentStrings.tabDataflow}</span>
          </button>
          <button
            onClick={() => setActiveTab('matrix')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentStrings.tabMatrix}</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {activeTab === 'pyramid' && (
            <div className="space-y-3">
              {currentStrings.tiers.map((tItem) => {
                const isUserTier = currentTier === tItem.tier;
                const canAccessThisHub = isAdmin || (isDriver && (tItem.tier === 4 || tItem.tier === 1)) || (isDoctor && (tItem.tier === 3 || tItem.tier === 1)) || (isAsha && (tItem.tier === 2 || tItem.tier === 1)) || (isPatient && tItem.tier === 1);

                return (
                  <div
                    key={tItem.tier}
                    className={`rounded-2xl p-4 border transition-all relative ${
                      isUserTier
                        ? `${tItem.border} ${tItem.bg} shadow-md ring-2 ring-indigo-500/40`
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-slate-300'
                    }`}
                  >
                    {isUserTier && (
                      <div className="absolute -top-2.5 right-4 bg-indigo-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>{currentStrings.activeUserTag} (TIER {tItem.tier})</span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${tItem.badgeBg}`}>
                          T{tItem.tier}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white">
                              {tItem.name}
                            </h3>
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              • {tItem.subtitle}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                            {tItem.scope}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]">
                            <span className="text-slate-500">
                              <strong className="text-slate-700 dark:text-slate-300">Stakeholders:</strong> {tItem.stakeholders}
                            </span>
                            <span className="text-slate-500 font-mono text-[10px]">
                              Clearance: <strong className="text-indigo-600 dark:text-indigo-400">{tItem.securityClearance}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                        {canAccessThisHub ? (
                          <button
                            onClick={() => {
                              if (onSwitchHub) {
                                onSwitchHub(tItem.id);
                                onClose();
                              }
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>{currentStrings.viewHub}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <div className="px-2.5 py-1 bg-slate-200/60 dark:bg-slate-800 text-slate-500 rounded-lg text-[11px] font-medium flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>{currentStrings.restricted}</span>
                          </div>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          canAccessThisHub
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {canAccessThisHub ? 'Authorized' : 'Locked for Current Role'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'dataflow' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200">
                <strong className="block font-bold mb-1">
                  🏛️ Bidirectional Clinical & Logistics Pipeline:
                </strong>
                Data flows continuously between the 5 tiers. Low-tier intake escalates upward into clinical queues and emergency telemetry, while apex directives and doctor prescriptions cascade downward directly to citizens.
              </div>

              {/* Step 1 to 5 Diagram */}
              <div className="relative pl-6 sm:pl-8 border-l-2 border-indigo-200 dark:border-indigo-800 space-y-6 my-2">
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    1
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">Tier 1: Grassroots Front-Door</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">Citizen Multimodal Intake</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Patient speaks in Odia/Hindi. AI extracts structured vitals (BP, SpO2, pain) and photo lab slips, assigning non-diagnostic initial acuity score.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-teal-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    2
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-teal-600 tracking-wider">Tier 2: Primary Care Outreach</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">ASHA Field Screening & Offline Sync</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      ASHA worker records maternal ANC risk or child immunization in no-network village. Queues in IndexedDB Outbox and synchronizes when connectivity restores.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    3
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider">Tier 3: Clinical Decision Station</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">RMP Triage & NMC QR E-Prescriptions</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      Attending Medical Officer evaluates high-risk ticket (NEWS2/qSOFA), reviews drug allergy warnings, and generates tamper-proof QR referral slip or e-prescription.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    4
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-rose-600 tracking-wider">Tier 4: Tactical EMS Fleet</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">108 Ambulance Dispatch & En-Route Vitals</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      RED urgency triggers CAD dispatch to nearest 108 ALS vehicle. Pilot navigates to GPS location while telemetry stream updates the receiving Emergency Department.
                    </p>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="relative">
                  <div className="absolute -left-[31px] sm:-left-[39px] top-0.5 w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-black flex items-center justify-center shadow-xs">
                    5
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                    <span className="text-[10px] font-black uppercase text-purple-600 tracking-wider">Tier 5: Apex Directorate</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">State Command & IDSP Epidemic Radar</h4>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                      District-wide incidents aggregate on CDMO radar. Real-time ICU bed reservations ensure zero patient denial; outbreak anomalies trigger quarantine directives.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">User Role</th>
                      <th className="p-3">Tier 1: Citizen Desk</th>
                      <th className="p-3">Tier 2: ASHA Outreach</th>
                      <th className="p-3">Tier 3: Doctor Cockpit</th>
                      <th className="p-3">Tier 4: 108 Pilot MDT</th>
                      <th className="p-3">Tier 5: State Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-[11px]">
                    <tr className={isPatient ? 'bg-amber-50/50 dark:bg-amber-950/20 font-bold' : ''}>
                      <td className="p-3 font-bold text-amber-700 dark:text-amber-400">
                        Citizen / Patient {isPatient && '✓ (Active)'}
                      </td>
                      <td className="p-3 text-emerald-600 font-bold">FULL ACCESS</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                    </tr>
                    <tr className={isAsha ? 'bg-teal-50/50 dark:bg-teal-950/20 font-bold' : ''}>
                      <td className="p-3 font-bold text-teal-700 dark:text-teal-400">
                        ASHA / ANM {isAsha && '✓ (Active)'}
                      </td>
                      <td className="p-3 text-emerald-600">Reference</td>
                      <td className="p-3 text-emerald-600 font-bold">FULL ACCESS</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                    </tr>
                    <tr className={isDoctor ? 'bg-emerald-50/50 dark:bg-emerald-950/20 font-bold' : ''}>
                      <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400">
                        Doctor / RMP {isDoctor && '✓ (Active)'}
                      </td>
                      <td className="p-3 text-emerald-600">Reference</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-emerald-600 font-bold">FULL ACCESS</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                    </tr>
                    <tr className={isDriver ? 'bg-rose-50/50 dark:bg-rose-950/20 font-bold' : ''}>
                      <td className="p-3 font-bold text-rose-700 dark:text-rose-400">
                        108 Ambulance Pilot {isDriver && '✓ (Active)'}
                      </td>
                      <td className="p-3 text-emerald-600">Reference</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-slate-400">Locked</td>
                      <td className="p-3 text-emerald-600 font-bold">FULL ACCESS</td>
                      <td className="p-3 text-slate-400">Locked</td>
                    </tr>
                    <tr className={isAdmin ? 'bg-purple-50/50 dark:bg-purple-950/20 font-bold' : ''}>
                      <td className="p-3 font-bold text-purple-700 dark:text-purple-400">
                        Super Admin / CDMO {isAdmin && '✓ (Active)'}
                      </td>
                      <td className="p-3 text-emerald-600 font-bold">Oversight</td>
                      <td className="p-3 text-emerald-600 font-bold">Oversight</td>
                      <td className="p-3 text-emerald-600 font-bold">Oversight</td>
                      <td className="p-3 text-emerald-600 font-bold">Oversight</td>
                      <td className="p-3 text-purple-700 dark:text-purple-300 font-black">FULL COMMAND</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center justify-between">
                <span>🛡️ Non-Diagnostic Guard: All clinical prescriptions mandate verified RMP digital signature.</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">Audit Hash: #NHM-SEC-2026-OK</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-[11px] text-slate-500">
            Odisha Digital Health Mission (ABDM) • 5-Tier Integrated Architecture
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            {currentStrings.close}
          </button>
        </div>
      </div>
    </div>
  );
}
