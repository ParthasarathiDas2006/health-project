import React, { useState } from 'react';
import {
  AlertCircle,
  Clock,
  User,
  Activity,
  ArrowRight,
  Send,
  Building2,
  HelpCircle,
  CheckCircle2,
  Printer,
  ShieldCheck,
  Award,
  Stethoscope,
  X,
  MapPin
} from 'lucide-react';
import { DoctorAvatar } from '../utils/doctorPhotos';
import { getHospitalPartners } from '../data/hospitalPartners';

/**
 * Triage Doctor / Nurse Dashboard
 * 100% pure localization for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 * Displays human-in-the-loop clinical prioritization, triage tickets, and official referral generation.
 */
export default function TriageDoctorDashboard({ currentUser, onSwitchUser, appLang }) {
  const activeLang = appLang || currentUser?.preferredLanguage || 'or-IN';
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [acceptedTicketId, setAcceptedTicketId] = useState(null);
  const [customApexHospital, setCustomApexHospital] = useState('');
  const apexHospitals = getHospitalPartners(activeLang);

  // Default fallback clinician profile
  const activeUser = currentUser || {
    name: activeLang === 'or-IN' ? 'ଡା. ସୌମ୍ୟ ରଞ୍ଜନ ନାୟକ' : (activeLang === 'hi-IN' ? 'डॉ. राजेश वर्मा' : 'Dr. Soumya Ranjan Nayak'),
    role: activeLang === 'or-IN' ? 'ଚିକିତ୍ସା ଅଧିକାରୀ / ଡାକ୍ତର (RMP)' : (activeLang === 'hi-IN' ? 'चिकित्सा अधिकारी / डॉक्टर (RMP)' : 'Medical Officer / Doctor (RMP)'),
    roleCategory: 'doctor',
    staffId: 'OMC-2017-66431',
    facility: activeLang === 'or-IN' ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍, କଟକ' : (activeLang === 'hi-IN' ? 'सिविल जिला अस्पताल, वर्धा' : 'SCB Medical College & Hospital, Cuttack'),
    state: activeLang === 'or-IN' ? 'ଓଡ଼ିଶା' : (activeLang === 'hi-IN' ? 'महाराष्ट्र' : 'Odisha'),
    district: activeLang === 'or-IN' ? 'କଟକ' : (activeLang === 'hi-IN' ? 'वर्धा' : 'Cuttack'),
    department: activeLang === 'or-IN' ? 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରାଏଜ୍ ବିଭାଗ' : (activeLang === 'hi-IN' ? 'इमरजेंसी एवं ट्रायज विभाग' : 'Emergency & Triage Medicine'),
    shift: activeLang === 'or-IN' ? 'ପ୍ରାତଃ କାଳୀନ ଡ୍ୟୁଟି (୦୮:୦୦ - ୧୬:୦୦)' : (activeLang === 'hi-IN' ? 'सुबह की शिफ्ट (08:00 - 16:00)' : 'Morning Shift (08:00 - 16:00)'),
    qualifications: activeLang === 'or-IN' ? 'MBBS, MD (ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା)' : (activeLang === 'hi-IN' ? 'एमबीबीएस, एमडी (इमरजेंसी मेडिसिन)' : 'MBBS, MD (Emergency Medicine)'),
    phone: '+91 94370 88219',
    email: 'dr.soumya@scbmch.odisha.gov.in'
  };

  // Pure Multilingual Ticket Database
  const ticketsByLang = {
    'or-IN': [
      {
        id: 'TRG-104',
        patientName: 'ରମେଶ୍ୱର ଲାଲ୍ (ପୁରୁଷ, ୪୮ ବର୍ଷ)',
        facility: 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH), କଟକ',
        waitTime: '୬ ମିନିଟ୍ ପୂର୍ବରୁ',
        urgency: 'RED',
        urgencyReason: 'ପ୍ଲେଟଲେଟ୍ ୪୨,୦୦୦ + ୧୦୩°F ଜ୍ୱର + ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ ଆଶଙ୍କା (ଡେଙ୍ଗୁ ଲକ୍ଷଣ)',
        chiefComplaint: '୩ ଦିନ ଧରି ପ୍ରବଳ ଜ୍ୱର, ବାନ୍ତି ଏବଂ ଦାନ୍ତ ମାଢ଼ିରୁ ସାମାନ୍ୟ ରକ୍ତ ବାହାରୁଛି',
        vitals: { temp: '103.1°F', pulse: '112 bpm', spo2: '94%', bp: '100/60' },
        labFindings: [
          { test: 'ପ୍ଲେଟଲେଟ୍ ଗଣନା', val: '୪୨,୦୦୦ /cumm', status: 'ଅତ୍ୟନ୍ତ କମ୍ (ବିପଦ)' },
          { test: 'TLC (ଶ୍ୱେତ ରକ୍ତ କଣିକା)', val: '୩,୧୦୦ /cumm', status: 'ସ୍ୱଳ୍ପ' }
        ],
        missingInfo: [
          'ହିମାଟୋକ୍ରିଟ୍ (PCV) ରେକର୍ଡ ହୋଇନାହିଁ',
          'ଡେଙ୍ଗୁ NS1 କିମ୍ବା IgM ଆଣ୍ଟିଜେନ୍ ରିପୋର୍ଟ ନାହିଁ'
        ],
        suggestedQuestions: [
          'ଚର୍ମରେ ନାଲି ଦାଗ କିମ୍ବା ମାଢ଼ିରୁ ସକ୍ରିୟ ରକ୍ତସ୍ରାବ ଯାଞ୍ଚ କରନ୍ତୁ।',
          'ଗତ ୬ ଘଣ୍ଟାରେ ପରିସ୍ରାର ରଙ୍ଗ ଓ ପରିମାଣ ପଚାରନ୍ତୁ।',
          'ହଠାତ୍ ପେଟରେ ଅତ୍ୟଧିକ ଯନ୍ତ୍ରଣା ହେଉଛି କି ନାହିଁ ପଚାରନ୍ତୁ।'
        ],
        referralRecommendation: 'SCB ମେଡିକାଲ୍ କଲେଜ୍ HDU / ମେଡିସିନ୍ ୱାର୍ଡ'
      },
      {
        id: 'TRG-102',
        patientName: 'ସୁନୀତା ଦେବୀ (ମହିଳା, ୨୬ ବର୍ଷ, ଗର୍ଭବତୀ ୩୨ ସପ୍ତାହ)',
        facility: 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC), ବ୍ରହ୍ମପୁର',
        waitTime: '୧୪ ମିନିଟ୍ ପୂର୍ବରୁ',
        urgency: 'RED',
        urgencyReason: 'ରକ୍ତଚାପ ୧୬୪/୧୦୨ mmHg + ପ୍ରବଳ ମୁଣ୍ଡବିନ୍ଧା (ପ୍ରି-ଏକ୍ଲାମ୍ପସିଆ ସଙ୍କେତ)',
        chiefComplaint: 'ସକାଳୁ ଭୀଷଣ ମୁଣ୍ଡବିନ୍ଧା ଏବଂ ଆଖିକୁ ଝାପ୍‌ସା ଦେଖାଯାଉଛି',
        vitals: { temp: '98.8°F', pulse: '88 bpm', spo2: '98%', bp: '164/102' },
        labFindings: [{ test: 'ପରିସ୍ରାରେ ଆଲବୁମିନ୍', val: '+++ (ଅତ୍ୟଧିକ)', status: 'ଅତ୍ୟଧିକ ବୃଦ୍ଧି' }],
        missingInfo: [
          'ଡିପ୍ ଟେଣ୍ଡନ୍ ରିଫ୍ଲେକ୍ସ (DTR) ଯାଞ୍ଚ ହୋଇନାହିଁ',
          'ଗର୍ଭସ୍ଥ ଶିଶୁର ହୃଦସ୍ପନ୍ଦନ (FHS) ରିପୋର୍ଟ ବାକି ଅଛି'
        ],
        suggestedQuestions: [
          'ପେଟର ଉପର ଡାହାଣ ଭାଗରେ ଯନ୍ତ୍ରଣା ହେଉଛି କି ପଚାରନ୍ତୁ।',
          'ଗୋଡ଼ରେ ଫୁଲା ଏବଂ ହାତପାଦ ଟାଣି ଧରିବା ପରୀକ୍ଷା କରନ୍ତୁ।',
          'ଆଜି ଶିଶୁର ଚଳପ୍ରଚଳ ସ୍ୱାଭାବିକ ଅଛି କି ନାହିଁ ବୁଝନ୍ତୁ।'
        ],
        referralRecommendation: 'ଜିଲ୍ଲା ମାତୃ ଓ ଶିଶୁ ଚିକିତ୍ସାଳୟ (DWH / FRU)'
      },
      {
        id: 'TRG-108',
        patientName: 'ଦିନେଶ କୁମାର (ପୁରୁଷ, ୩୪ ବର୍ଷ)',
        facility: 'ପାରାଦ୍ୱୀପ ଶିଳ୍ପାଞ୍ଚଳ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
        waitTime: '୨୨ ମିନିଟ୍ ପୂର୍ବରୁ',
        urgency: 'YELLOW',
        urgencyReason: 'ରାସାୟନିକ ସଲଭେଣ୍ଟ୍ ସ୍ପ୍ଲାସ୍ + ଆଖି ଜଳାପୋଡ଼ା',
        chiefComplaint: 'କାରଖାନାରେ କେମିକାଲ୍ ଧୂଆଁ ଯୋଗୁଁ ଆଖି ନାଲି ପଡ଼ିବା ଓ ପାଣି ବୋହିବା',
        vitals: { temp: '98.4°F', pulse: '82 bpm', spo2: '98%', bp: '128/84' },
        labFindings: [],
        missingInfo: ['ନିର୍ଦ୍ଦିଷ୍ଟ କେମିକାଲ୍ SDS (Safety Data Sheet) ନାମ ଅନିଶ୍ଚିତ'],
        suggestedQuestions: [
          'କାରଖାନାରେ ତୁରନ୍ତ ସାଲାଇନ୍ ପାଣିରେ ଆଖି ଧୁଆ ହୋଇଥିଲା କି?',
          'ନିଶ୍ୱାସ ନେଲାବେଳେ ତଣ୍ଟିରେ କୌଣସି କଷ୍ଟ ହେଉଛି କି?'
        ],
        referralRecommendation: 'ESIC ଶିଳ୍ପ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର / ଚକ୍ଷୁ ରୋଗ ବିଭାଗ'
      },
      {
        id: 'TRG-110',
        patientName: 'ଅନନ୍ୟା ଶର୍ମା (ମହିଳା, ୨୦ ବର୍ଷ)',
        facility: 'କ୍ୟାମ୍ପସ୍ ହେଲ୍‌ଥ୍ ସେଣ୍ଟର୍, ଉତ୍କଳ ବିଶ୍ୱବିଦ୍ୟାଳୟ',
        waitTime: '୩୫ ମିନିଟ୍ ପୂର୍ବରୁ',
        urgency: 'GREEN',
        urgencyReason: 'ସାଧାରଣ ଭାଇରାଲ୍ ସଂକ୍ରମଣ / ତଣ୍ଟି ଯନ୍ତ୍ରଣା',
        chiefComplaint: '୨ ଦିନ ହେବ ତଣ୍ଟି ଯନ୍ତ୍ରଣା ଓ ଶୁଖିଲା କାଶ, ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ ନାହିଁ',
        vitals: { temp: '99.1°F', pulse: '74 bpm', spo2: '99%', bp: '116/76' },
        labFindings: [],
        missingInfo: [],
        suggestedQuestions: ['ଟନ୍‌ସିଲ୍ ଫୁଲା କିମ୍ବା ବେକର ଗ୍ରନ୍ଥି ବୃଦ୍ଧି ପରୀକ୍ଷା କରନ୍ତୁ।'],
        referralRecommendation: 'କ୍ୟାମ୍ପସ୍ ଔଷଧାଳୟରେ ବହିର୍ବିଭାଗ (OPD) ପରାମର୍ଶ'
      }
    ],
    'hi-IN': [
      {
        id: 'TRG-104',
        patientName: 'रामेश्वर लाल (पुरुष, 48 वर्ष)',
        facility: 'सिविल जिला अस्पताल, वर्धा',
        waitTime: '6 मिनट पहले',
        urgency: 'RED',
        urgencyReason: 'प्लेटलेट्स 42,000 + 103°F बुखार + मसूड़ों से रक्तस्राव का खतरा (डेंगू)',
        chiefComplaint: '3 दिनों से तेज बुखार, उल्टी और मसूड़ों से हल्का खून आना',
        vitals: { temp: '103.1°F', pulse: '112 bpm', spo2: '94%', bp: '100/60' },
        labFindings: [
          { test: 'प्लेटलेट काउंट', val: '42,000 /cumm', status: 'अति गंभीर रूप से कम' },
          { test: 'TLC (श्वेत रक्त कणिकाएं)', val: '3,100 /cumm', status: 'कम' }
        ],
        missingInfo: ['हेमेटोक्रिट (PCV) दर्ज नहीं है', 'डेंगू NS1 / IgM एंटीजन रिपोर्ट उपलब्ध नहीं'],
        suggestedQuestions: [
          'त्वचा पर लाल चकत्ते (Petechiae) या मसूड़ों से रक्तस्राव की जांच करें।',
          'पिछले 6 घंटों में पानी पीने और पेशाब की मात्रा/रंग के बारे में पूछें।',
          'अचानक तेज पेट दर्द के बारे में पूछें।'
        ],
        referralRecommendation: 'जिला अस्पताल HDU / मेडिसिन वार्ड'
      },
      {
        id: 'TRG-102',
        patientName: 'सुनीता देवी (महिला, 26 वर्ष, गर्भावस्था 32 सप्ताह)',
        facility: 'प्राथमिक स्वास्थ्य केंद्र (PHC), भोजपुर',
        waitTime: '14 मिनट पहले',
        urgency: 'RED',
        urgencyReason: 'रक्तचाप 164/102 mmHg + सिर में तीव्र दर्द (प्री-एक्लेमप्सिया संकेत)',
        chiefComplaint: 'सुबह से सिर में तेज दर्द और आंखों के सामने धुंधलापन',
        vitals: { temp: '98.8°F', pulse: '88 bpm', spo2: '98%', bp: '164/102' },
        labFindings: [{ test: 'मूत्र में एल्ब्यूमिन', val: '+++ (अत्यधिक)', status: 'अत्यधिक उच्च' }],
        missingInfo: ['डीप टेंडन रिफ्लेक्स (DTR) दर्ज नहीं', 'गर्भस्थ शिशु की धड़कन (FHS) लंबित'],
        suggestedQuestions: [
          'पेट के ऊपरी दाहिने हिस्से में दर्द की जांच करें।',
          'हाथ-पैर की सूजन और झटके की स्थिति देखें।',
          'आज शिशु की हलचल की स्थिति सत्यापित करें।'
        ],
        referralRecommendation: 'प्रथम रेफरल इकाई (FRU) / जिला महिला अस्पताल'
      },
      {
        id: 'TRG-108',
        patientName: 'दिनेश कुमार (पुरुष, 34 वर्ष)',
        facility: 'MIDC औद्योगिक स्वास्थ्य केंद्र, पुणे',
        waitTime: '22 मिनट पहले',
        urgency: 'YELLOW',
        urgencyReason: 'रासायनिक विलायक का छिड़काव + आंखों में जलन',
        chiefComplaint: 'पेंट शॉप में केमिकल धुएं से आंखों में जलन, लालिमा और पानी आना',
        vitals: { temp: '98.4°F', pulse: '82 bpm', spo2: '98%', bp: '128/84' },
        labFindings: [],
        missingInfo: ['विशिष्ट केमिकल SDS (सुरक्षा डेटा शीट) नाम की पुष्टि बाकी'],
        suggestedQuestions: [
          'क्या फैक्ट्री में तुरंत सेलाइन पानी से आंखें धोई गई थीं?',
          'क्या गहरी सांस लेने में गले में कोई घरघराहट या रुकावट है?'
        ],
        referralRecommendation: 'ESIC व्यावसायिक स्वास्थ्य केंद्र / नेत्र रोग OPD'
      },
      {
        id: 'TRG-110',
        patientName: 'अनन्या शर्मा (महिला, 20 वर्ष)',
        facility: 'परिसर स्वास्थ्य केंद्र, IIT कानपुर',
        waitTime: '35 मिनट पहले',
        urgency: 'GREEN',
        urgencyReason: 'सामान्य वायरल संक्रमण / गले में खराश',
        chiefComplaint: '2 दिन से गले में दर्द और सूखी खांसी, सांस लेने में कोई परेशानी नहीं',
        vitals: { temp: '99.1°F', pulse: '74 bpm', spo2: '99%', bp: '116/76' },
        labFindings: [],
        missingInfo: [],
        suggestedQuestions: ['टॉन्सिल में सूजन अथवा गर्दन की ग्रंथियों की जांच करें।'],
        referralRecommendation: 'कैंपस इन्फर्मरी में बाह्य रोगी (OPD) परामर्श'
      }
    ],
    'en-IN': [
      {
        id: 'TRG-104',
        patientName: 'Rameshwar Lal (M, 48)',
        facility: 'Civil District Hospital, Wardha',
        waitTime: '6 mins ago',
        urgency: 'RED',
        urgencyReason: 'Platelets 42k + Fever 103°F + Epistaxis risk (Dengue signal)',
        chiefComplaint: 'Acute high grade fever x 3 days with nausea and mild bleeding gums',
        vitals: { temp: '103.1°F', pulse: '112 bpm', spo2: '94%', bp: '100/60' },
        labFindings: [
          { test: 'Platelets', val: '42,000 /cumm', status: 'CRITICAL_LOW' },
          { test: 'TLC', val: '3,100 /cumm', status: 'LOW' }
        ],
        missingInfo: ['Hematocrit (PCV) not recorded', 'No Dengue NS1 / IgM antigen status'],
        suggestedQuestions: [
          'Check skin for petechiae, purpura or active gum bleed.',
          'Inquire about fluid intake or urine color/frequency in the last 6 hours.',
          'Ask about sudden severe abdominal pain.'
        ],
        referralRecommendation: 'District Hospital HDU / Medicine Unit'
      },
      {
        id: 'TRG-102',
        patientName: 'Sunita Devi (F, 26, Primigravida 32 wks)',
        facility: 'Primary Health Center (PHC), Bhojpur',
        waitTime: '14 mins ago',
        urgency: 'RED',
        urgencyReason: 'BP 164/102 mmHg + Severe Headache (Pre-eclampsia signal)',
        chiefComplaint: 'Persistent occipital headache and visual blurring since morning',
        vitals: { temp: '98.8°F', pulse: '88 bpm', spo2: '98%', bp: '164/102' },
        labFindings: [{ test: 'Urine Albumin', val: '+++ (Heavy)', status: 'CRITICAL_HIGH' }],
        missingInfo: ['No Deep Tendon Reflexes (DTR) documented', 'Fetal heart sound pending'],
        suggestedQuestions: [
          'Assess for epigastric / right upper quadrant pain.',
          'Check for hyperreflexia or ankle clonus.',
          'Verify fetal movements count today.'
        ],
        referralRecommendation: 'First Referral Unit (FRU) / District Women Hospital'
      },
      {
        id: 'TRG-108',
        patientName: 'Dinesh Kumar (M, 34)',
        facility: 'MIDC Industrial Health Post, Pune',
        waitTime: '22 mins ago',
        urgency: 'YELLOW',
        urgencyReason: 'Chemical solvent splash + Eye irritation',
        chiefComplaint: 'Mild chemical fume exposure in paint shop, ocular redness, tearing',
        vitals: { temp: '98.4°F', pulse: '82 bpm', spo2: '98%', bp: '128/84' },
        labFindings: [],
        missingInfo: ['Specific solvent SDS (Safety Data Sheet) chemical name unconfirmed'],
        suggestedQuestions: [
          'Was immediate copious saline eye irrigation performed at the factory floor?',
          'Any throat tightness or wheezing on deep inspiration?'
        ],
        referralRecommendation: 'ESIC Occupational Health Center / Ophthalmology OPD'
      },
      {
        id: 'TRG-110',
        patientName: 'Ananya Sharma (F, 20)',
        facility: 'Campus Health Center, IIT Kanpur',
        waitTime: '35 mins ago',
        urgency: 'GREEN',
        urgencyReason: 'Mild Viral Pharyngitis / Sore throat',
        chiefComplaint: 'Throat pain and dry cough x 2 days, no breathlessness',
        vitals: { temp: '99.1°F', pulse: '74 bpm', spo2: '99%', bp: '116/76' },
        labFindings: [],
        missingInfo: [],
        suggestedQuestions: ['Assess tonsillar exudate or cervical lymphadenopathy.'],
        referralRecommendation: 'Outpatient symptomatic management at Campus Infirmary'
      }
    ]
  };

  const activeTickets = ticketsByLang[activeLang] || ticketsByLang['or-IN'];
  const [selectedTicket, setSelectedTicket] = useState(activeTickets[0]);

  // Update selected ticket when language changes
  React.useEffect(() => {
    setSelectedTicket((prev) => {
      if (!prev) return activeTickets[0];
      const match = activeTickets.find((t) => t.id === prev.id);
      return match || activeTickets[0];
    });
  }, [activeLang]);

  // Comprehensive localized UI text map
  const txt = {
    'or-IN': {
      headerTitle: 'ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ସମୀକ୍ଷା ଡେସ୍କ',
      headerSubtitle: 'ପଞ୍ଜୀକୃତ ଚିକିତ୍ସକ (RMP) ଏବଂ ଟ୍ରାଏଜ୍ ନର୍ସ ନିଷ୍ପତ୍ତି ସହାୟକ ପୋର୍ଟାଲ୍',
      filterLabel: 'ଶ୍ରେଣୀ:',
      filterAll: 'ସମସ୍ତ',
      filterRed: 'ଅତି ଜରୁରୀ (ଲାଲ୍)',
      filterYellow: 'ମଧ୍ୟମ (ହଳଦିଆ)',
      filterGreen: 'ସାଧାରଣ (ସବୁଜ)',
      queueTitle: 'ପ୍ରାଥମିକତା ପ୍ରାପ୍ତ ରୋଗୀ ତାଲିକା',
      autoRefreshed: 'ସ୍ୱୟଂକ୍ରିୟ ନବୀକରଣ',
      reviewNote: 'ନୋଟ୍ ଯାଞ୍ଚ କରନ୍ତୁ',
      urgencySuffix: 'ଜରୁରୀ ସ୍ତର',
      tierSuffix: 'ପ୍ରାଥମିକତା ସ୍ତର',
      printSlip: 'ଟ୍ରାଏଜ୍ ପତ୍ର ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      reviewingClinician: 'ସମୀକ୍ଷାକାରୀ ଚିକିତ୍ସକ:',
      temp: 'ତାପମାତ୍ରା',
      pulse: 'ନାଡ଼ି ସ୍ପନ୍ଦନ',
      spo2: 'ଅକ୍ସିଜେନ୍ (SpO2)',
      bp: 'ରକ୍ତଚାପ (BP)',
      reportedComplaint: 'ରୋଗୀଙ୍କ ଲକ୍ଷଣ ଓ ସମୟ ବିବରଣୀ',
      labAbnormalities: 'ଲ୍ୟାବ୍ ରିପୋର୍ଟରୁ ଚିହ୍ନଟ ଅସ୍ୱାଭାବିକତା',
      criticalGaps: 'ଅନୁପସ୍ଥିତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ତଥ୍ୟ',
      doctorQuestions: 'ଡାକ୍ତର କିମ୍ବା ନର୍ସଙ୍କ ପାଇଁ ଅନୁଶଂସିତ ପ୍ରଶ୍ନ',
      targetFacility: 'ସ୍ଥାନାନ୍ତରଣ କେନ୍ଦ୍ର:',
      generateReferral: 'ରେଫରାଲ୍ ପତ୍ର ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
      acceptPatient: 'ରୋଗୀଙ୍କୁ OPD କୁ ଗ୍ରହଣ କରନ୍ତୁ',
      emptyQueue: 'ସମ୍ପୂର୍ଣ୍ଣ ଟ୍ରାଏଜ୍ ନୋଟ୍ ଦେଖିବା ପାଇଁ ଧାଡ଼ିରୁ ଜଣେ ରୋଗୀଙ୍କ ଟିକେଟ୍ ଚୟନ କରନ୍ତୁ',
      sessionStatus: 'ଅଧିବେଶନ ସ୍ଥିତି',
      activeSigner: 'ସକ୍ରିୟ ଡାକ୍ତରୀ ସ୍ୱାକ୍ଷରକାରୀ',
      citizenAccess: 'ନାଗରିକ ସ୍ୱାସ୍ଥ୍ୟ ସେବା',
      switchAccount: 'ଖାତା ବଦଳାନ୍ତୁ',
      patientBannerTitle: 'ରୋଗୀ ଧାଡ଼ି ବିବରଣୀ:',
      patientBannerText: 'ଆପଣ ବର୍ତ୍ତମାନ ହସ୍ପିଟାଲର ଲାଇଭ୍ ଟ୍ରାଏଜ୍ ଧାଡ଼ି ଏବଂ ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଯାଞ୍ଚ ହୋଇଥିବା ସାରାଂଶ ଦେଖୁଛନ୍ତି।',
      acceptToastSuccess: 'ତୁରନ୍ତ ପରାମର୍ଶ ପାଇଁ ଗ୍ରହଣ କରାଗଲା। OPD ଫାଇଲ୍ ଖୋଲାଗଲା।',
      signedByRmp: 'RMP ଦ୍ୱାରା ପ୍ରମାଣିତ',
      badgeVerifiedDoctor: 'RMP ପ୍ରମାଣିତ',
      badgeVerifiedPatient: 'ABHA ପ୍ରମାଣିତ',
      years: 'ବର୍ଷ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      bloodGroup: 'ରକ୍ତ ବର୍ଗ',
      referralModalTitle: 'କ୍ଲିନିକାଲ୍ ଟ୍ରାଏଜ୍ ରେଫରାଲ୍ ପତ୍ର (ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ)',
      slipId: 'ସ୍ଲିପ୍ ID:',
      dateTime: 'ତାରିଖ ଓ ସମୟ:',
      origin: 'ମୂଳ କେନ୍ଦ୍ର:',
      referringFacility: 'ପଠାଉଥିବା ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର',
      referredToFacility: 'ଉଚ୍ଚତର ଚିକିତ୍ସାଳୟକୁ ସ୍ଥାନାନ୍ତର',
      criticalCareDept: 'ଜରୁରୀକାଳୀନ HDU / ଆଇସିୟୁ ୱାର୍ଡ',
      vitalsAtTransfer: 'ସ୍ଥାନାନ୍ତର ସମୟରେ ଜୀବନ ସୂଚକ (Vitals):',
      clinicalIndication: 'କ୍ଲିନିକାଲ୍ ସୂଚନା ଓ ଲାଲ୍ ସଙ୍କେତ (Red Flags):',
      transitProtocol: 'ABDM ଇ-ହସ୍ପିଟାଲ୍ ସ୍ଥାନାନ୍ତରଣ ନିୟମ | ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ ପତ୍ର',
      verifiedMedicalSigner: 'ପ୍ରମାଣିତ ଚିକିତ୍ସକଙ୍କ ସ୍ୱାକ୍ଷର',
      regNo: 'ପଞ୍ଜୀକରଣ:',
      btnPrintSlip: 'ରେଫରାଲ୍ ପତ୍ର ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      btnDispatchDigital: 'ଡିଜିଟାଲ୍ ରେଫରାଲ୍ ପ୍ରେରଣ କରନ୍ତୁ',
      alertDispatched: 'ରେଫରାଲ୍ ରେକର୍ଡ ସଫଳତାର ସହ ଇ-ସଞ୍ଜୀବନୀ / ଜିଲ୍ଲା ଟ୍ରାଞ୍ଜିଟ୍ ହବ୍ କୁ ପଠାଗଲା।'
    },
    'hi-IN': {
      headerTitle: 'राष्ट्रीय स्वास्थ्य ट्रायज समीक्षा डेस्क',
      headerSubtitle: 'पंजीकृत चिकित्सा व्यवसायी (RMP) एवं ट्रायज नर्स निर्णय सहायता पोर्टल',
      filterLabel: 'फ़िल्टर:',
      filterAll: 'सभी',
      filterRed: 'अति गंभीर (लाल)',
      filterYellow: 'मध्यम (पीला)',
      filterGreen: 'सामान्य (हरा)',
      queueTitle: 'प्राथमिकता प्राप्त मरीज कतार',
      autoRefreshed: 'स्वतः नवीनीकृत',
      reviewNote: 'नोट की समीक्षा करें',
      urgencySuffix: 'प्राथमिकता',
      tierSuffix: 'प्राथमिकता श्रेणी',
      printSlip: 'ट्रायज पर्ची प्रिंट करें',
      reviewingClinician: 'समीक्षक चिकित्सक:',
      temp: 'तापमान',
      pulse: 'नाड़ी (Pulse)',
      spo2: 'ऑक्सीजन (SpO2)',
      bp: 'रक्तचाप (BP)',
      reportedComplaint: 'लक्षण एवं समय-क्रम विवरण',
      labAbnormalities: 'लैब रिपोर्ट से प्राप्त असामान्यताएं',
      criticalGaps: 'अनुपस्थित महत्वपूर्ण जानकारी',
      doctorQuestions: 'डॉक्टर अथवा नर्स के लिए अनुशंसित प्रश्न',
      targetFacility: 'अनुशंसित रेफरल केंद्र:',
      generateReferral: 'रेफरल पर्ची तैयार करें',
      acceptPatient: 'मरीज को OPD में स्वीकार करें',
      emptyQueue: 'ट्रायज नोट देखने के लिए कतार में से किसी मरीज का टिकट चुनें',
      sessionStatus: 'सत्र स्थिति',
      activeSigner: 'सक्रिय क्लिनिकल हस्ताक्षरकर्ता',
      citizenAccess: 'नागरिक स्वास्थ्य सेवा',
      switchAccount: 'खाता बदलें',
      patientBannerTitle: 'मरीज कतार दृश्य:',
      patientBannerText: 'आप अस्पताल की लाइव ट्रायज कतार और डॉक्टरों द्वारा सत्यापित गैर-निदान ट्रायज सारांश देख रहे हैं।',
      acceptToastSuccess: 'तत्काल परामर्श हेतु स्वीकार किया गया। OPD फाइल खोली गई।',
      signedByRmp: 'RMP द्वारा सत्यापित',
      badgeVerifiedDoctor: 'RMP सत्यापित',
      badgeVerifiedPatient: 'ABHA सत्यापित',
      years: 'वर्ष',
      male: 'पुरुष',
      female: 'महिला',
      bloodGroup: 'रक्त समूह',
      referralModalTitle: 'क्लिनिकल ट्रायज रेफरल पर्ची (राष्ट्रीय स्वास्थ्य मिशन)',
      slipId: 'पर्ची ID:',
      dateTime: 'दिनांक एवं समय:',
      origin: 'मूल स्वास्थ्य केंद्र:',
      referringFacility: 'रेफर करने वाला स्वास्थ्य केंद्र',
      referredToFacility: 'उच्च केंद्र में रेफर',
      criticalCareDept: 'आपातकालीन HDU / क्रिटिकल केयर वार्ड',
      vitalsAtTransfer: 'स्थानांतरण के समय महत्वपूर्ण संकेत (Vitals):',
      clinicalIndication: 'क्लिनिकल संकेत एवं खतरे के लक्षण (Red Flags):',
      transitProtocol: 'ABDM ई-अस्पताल ट्रांजिट प्रोटोकॉल | क्लिनिकल निर्णय पत्र',
      verifiedMedicalSigner: 'सत्यापित चिकित्सा हस्ताक्षरकर्ता',
      regNo: 'पंजीकरण संख्या:',
      btnPrintSlip: 'रेफरल पर्ची प्रिंट करें',
      btnDispatchDigital: 'डिजिटल रेफरल भेजें',
      alertDispatched: 'रेफरल रिकॉर्ड ई-संजीवनी / जिला ट्रांजिट हब को भेज दिया गया है।'
    },
    'en-IN': {
      headerTitle: 'National Triage Review Station',
      headerSubtitle: 'Registered Medical Practitioner (RMP) / Triage Nurse Decision-Support Portal',
      filterLabel: 'Filter:',
      filterAll: 'ALL',
      filterRed: 'CRITICAL (RED)',
      filterYellow: 'MODERATE (YELLOW)',
      filterGreen: 'ROUTINE (GREEN)',
      queueTitle: 'Prioritized Intake Queue',
      autoRefreshed: 'Auto-refreshed',
      reviewNote: 'Review Note',
      urgencySuffix: 'URGENCY',
      tierSuffix: 'TIER',
      printSlip: 'Print Triage Slip',
      reviewingClinician: 'Reviewing Clinician:',
      temp: 'Temp',
      pulse: 'Pulse',
      spo2: 'SpO2',
      bp: 'Blood Press',
      reportedComplaint: 'Reported Complaint & Chronology',
      labAbnormalities: 'Extracted Lab Abnormalities',
      criticalGaps: 'Critical Data Gaps Identified',
      doctorQuestions: 'Recommended Questions for Doctor / Triage Nurse',
      targetFacility: 'Target Facility:',
      generateReferral: 'Generate Referral Slip',
      acceptPatient: 'Accept Patient to OPD Bay',
      emptyQueue: 'Select a patient ticket from the queue to review structured triage note',
      sessionStatus: 'Session Status',
      activeSigner: 'Active Clinical Signer',
      citizenAccess: 'Citizen Health Access',
      switchAccount: 'Switch Account',
      patientBannerTitle: 'Patient Queue View:',
      patientBannerText: 'You are viewing live hospital triage queue status and non-diagnostic triage summaries verified by attending doctors.',
      acceptToastSuccess: 'accepted for immediate consultation. OPD file opened.',
      signedByRmp: 'Signed by RMP',
      badgeVerifiedDoctor: 'Verified RMP',
      badgeVerifiedPatient: 'ABHA Verified',
      years: 'yrs',
      male: 'Male',
      female: 'Female',
      bloodGroup: 'Blood',
      referralModalTitle: 'Clinical Triage Referral Slip (National Health Mission)',
      slipId: 'Slip ID:',
      dateTime: 'Date & Time:',
      origin: 'Origin Facility:',
      referringFacility: 'Referring Healthcare Unit',
      referredToFacility: 'Referred To Higher Center',
      criticalCareDept: 'Emergency HDU / Critical Care Bay',
      vitalsAtTransfer: 'Triage Vitals at Transfer:',
      clinicalIndication: 'Clinical Indication / Red Flags:',
      transitProtocol: 'ABDM e-Hospital Transit Protocol | Non-Diagnostic Triage Decision Note',
      verifiedMedicalSigner: 'Verified Medical Signer',
      regNo: 'Reg No:',
      btnPrintSlip: 'Print Referral Slip',
      btnDispatchDigital: 'Dispatch Digital Referral',
      alertDispatched: 'Referral record pushed to e-Sanjeevani / District Transit Hub.'
    }
  }[activeLang] || {};

  const filteredTickets = activeTickets.filter((t) => {
    if (filterUrgency === 'ALL') return true;
    return t.urgency === filterUrgency;
  });

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case 'RED':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'YELLOW':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-semibold';
      case 'GREEN':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const handleAcceptPatient = (ticket) => {
    setAcceptedTicketId(ticket.id);
    setTimeout(() => {
      setAcceptedTicketId(null);
    }, 4000);
  };

  return (
    <div className="bg-slate-100 min-h-screen p-4 sm:p-6 font-sans text-slate-800">
      {/* Clinician or Patient Profile Station Banner */}
      <div className="max-w-7xl mx-auto mb-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* User Details Block */}
          <div className="flex items-start sm:items-center gap-4">
            {activeUser.roleCategory === 'doctor' ? (
              <DoctorAvatar
                doc={{
                  id: activeUser.staffId || activeUser.name,
                  name: activeUser.name,
                  initials: activeUser.name.split(' ').map((n) => n[0]).slice(0, 2).join(''),
                  color: 'from-emerald-600 to-teal-700'
                }}
                size="lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0 bg-gradient-to-br from-amber-600 to-orange-700">
                {activeUser.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{activeUser.name}</h2>
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    activeUser.roleCategory === 'patient'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}
                >
                  <ShieldCheck
                    className={`w-3.5 h-3.5 ${
                      activeUser.roleCategory === 'patient' ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  />
                  {activeUser.role}
                </span>
                <span className="text-[11px] font-mono font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                  {activeUser.staffId}
                </span>
                {activeUser.age && (
                  <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {activeUser.age} {txt.years} • {activeUser.gender === 'Female' ? txt.female : txt.male} • {txt.bloodGroup}: {activeUser.bloodGroup || 'B+'}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1.5">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-slate-700">{activeUser.facility}</strong>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {activeUser.state}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  {activeUser.shift || txt.citizenAccess}
                </span>
                {activeUser.qualifications && (
                  <span className="hidden sm:inline text-slate-400">
                    • {activeUser.qualifications}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions & Status */}
          <div className="flex items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-medium">{txt.sessionStatus}</span>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  activeUser.roleCategory === 'patient' ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    activeUser.roleCategory === 'patient' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                ></span>
                {activeUser.roleCategory === 'patient' ? txt.citizenAccess : txt.activeSigner}
              </span>
            </div>

            {onSwitchUser && (
              <button
                type="button"
                onClick={onSwitchUser}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 border border-slate-300 rounded-xl transition-all"
              >
                {txt.switchAccount}
              </button>
            )}
          </div>
        </div>

        {/* Patient Perspective Notice if logged in as patient */}
        {activeUser.roleCategory === 'patient' && (
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-amber-900 bg-amber-50/70 p-2.5 rounded-xl border border-amber-200">
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>{txt.patientBannerTitle}</strong> {txt.patientBannerText} (<strong>{activeUser.facility}</strong>)
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Top Header & Filters */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-300 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {txt.headerTitle}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {txt.headerSubtitle}
          </p>
        </div>

        {/* Urgency Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm text-xs">
          <span className="text-slate-400 px-2 font-medium">{txt.filterLabel}</span>
          <button
            onClick={() => setFilterUrgency('ALL')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              filterUrgency === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {txt.filterAll}
          </button>
          <button
            onClick={() => setFilterUrgency('RED')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              filterUrgency === 'RED'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            {txt.filterRed}
          </button>
          <button
            onClick={() => setFilterUrgency('YELLOW')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              filterUrgency === 'YELLOW'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            {txt.filterYellow}
          </button>
          <button
            onClick={() => setFilterUrgency('GREEN')}
            className={`px-3 py-1 rounded font-medium transition-all ${
              filterUrgency === 'GREEN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            {txt.filterGreen}
          </button>
        </div>
      </div>

      {/* Accepted Patient Alert Toast */}
      {acceptedTicketId && (
        <div className="max-w-7xl mx-auto mt-4 p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-fadeIn">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              #{acceptedTicketId} - <strong>{activeUser.name}</strong> ({activeUser.role}): {txt.acceptToastSuccess}
            </span>
          </div>
          <span className="text-[11px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-bold">
            {txt.signedByRmp}
          </span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left: Queue Column (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              {txt.queueTitle} ({filteredTickets.length})
            </h2>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {txt.autoRefreshed}
            </span>
          </div>

          {filteredTickets.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`p-4 rounded-xl border transition-all cursor-pointer bg-white shadow-xs hover:shadow-md ${
                selectedTicket?.id === t.id
                  ? 'ring-2 ring-emerald-600 border-emerald-600'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold text-slate-500">{t.id}</span>
                <span
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(
                    t.urgency
                  )}`}
                >
                  {t.urgency} {txt.urgencySuffix}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{t.patientName}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t.facility}</p>

              <p className="text-xs text-rose-700 font-medium mt-2 bg-rose-50 p-2 rounded border border-rose-100 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                {t.urgencyReason}
              </p>

              <div className="flex justify-between items-center text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {t.waitTime}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  {txt.reviewNote} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detailed Structured Triage Note (7 cols) */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sticky top-6">
              {/* Card Header */}
              <div className="flex justify-between items-start border-b pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{selectedTicket.id}</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full border ${getUrgencyBadge(
                        selectedTicket.urgency
                      )}`}
                    >
                      {selectedTicket.urgency} {txt.tierSuffix}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    {selectedTicket.patientName}
                  </h2>
                  <p className="text-xs text-slate-500">{selectedTicket.facility}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs flex items-center gap-1"
                    title={txt.printSlip}
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reviewing Clinician Attribution */}
              <div className="mb-4 px-3 py-2 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-medium">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-700" />
                  {txt.reviewingClinician} <strong>{activeUser.name}</strong> ({activeUser.staffId})
                </span>
                <span className="text-[11px] text-emerald-700 font-mono">
                  {activeUser.facility.split(',')[0]}
                </span>
              </div>

              {/* Vitals Summary Strip */}
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-center mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{txt.temp}</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedTicket.vitals.temp}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{txt.pulse}</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedTicket.vitals.pulse}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{txt.spo2}</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedTicket.vitals.spo2}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">{txt.bp}</span>
                  <p className="text-sm font-semibold text-slate-800">{selectedTicket.vitals.bp}</p>
                </div>
              </div>

              {/* Chief Complaint & Timeline */}
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {txt.reportedComplaint}
                  </h4>
                  <p className="text-sm text-slate-800 mt-1 font-medium bg-slate-50 p-2.5 rounded border border-slate-100">
                    {selectedTicket.chiefComplaint}
                  </p>
                </div>

                {/* Lab Highlights */}
                {selectedTicket.labFindings.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {txt.labAbnormalities}
                    </h4>
                    <div className="space-y-1.5 mt-1">
                      {selectedTicket.labFindings.map((f, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-center text-xs p-2 bg-rose-50 border border-rose-200 rounded text-rose-900"
                        >
                          <span className="font-semibold">{f.test}</span>
                          <span className="font-mono font-bold">
                            {f.val} ({f.status})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Identified Gaps */}
                {selectedTicket.missingInfo.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      {txt.criticalGaps}
                    </h4>
                    <ul className="list-disc list-inside text-xs text-slate-600 mt-1 space-y-1 bg-amber-50/60 p-2.5 rounded border border-amber-200">
                      {selectedTicket.missingInfo.map((gap, i) => (
                        <li key={i}>{gap}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Questions for Clinician */}
                <div>
                  <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                    {txt.doctorQuestions}
                  </h4>
                  <ul className="mt-1 space-y-1 text-xs text-slate-700 bg-indigo-50/50 p-2.5 rounded border border-indigo-100">
                    {selectedTicket.suggestedQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons: Sign-off or Refer */}
              <div className="pt-4 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-lg text-xs">
                  <span className="text-slate-600 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    {txt.targetFacility} <strong>{selectedTicket.referralRecommendation}</strong>
                  </span>
                  <button
                    onClick={() => {
                      setCustomApexHospital(selectedTicket.referralRecommendation);
                      setShowReferralModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded font-medium transition-colors flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {txt.generateReferral}
                  </button>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => handleAcceptPatient(selectedTicket)}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {txt.acceptPatient} ({activeUser.name})
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
              <User className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p className="text-sm font-medium">
                {txt.emptyQueue}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Official Referral Slip Modal */}
      {showReferralModal && selectedTicket && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden font-sans">
            {/* Slip Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  {txt.referralModalTitle}
                </h3>
              </div>
              <button
                onClick={() => setShowReferralModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* Reference Info */}
              <div className="flex justify-between border-b pb-3 text-slate-500">
                <span>
                  {txt.slipId} <strong className="font-mono text-slate-800">REF-{selectedTicket.id}-2026</strong>
                </span>
                <span>{txt.dateTime} <strong>{new Date().toLocaleString(activeLang === 'or-IN' ? 'or-IN' : (activeLang === 'hi-IN' ? 'hi-IN' : 'en-IN'))}</strong></span>
              </div>

              {/* Patient & Urgency Banner */}
              <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{selectedTicket.patientName}</h4>
                  <p className="text-slate-500 text-[11px]">{txt.origin} {selectedTicket.facility}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full border font-bold ${getUrgencyBadge(
                    selectedTicket.urgency
                  )}`}
                >
                  {selectedTicket.urgency} {txt.urgencySuffix}
                </span>
              </div>

              {/* Referral Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {txt.referringFacility}
                  </span>
                  <p className="font-semibold text-slate-800 text-xs mt-0.5">{activeUser.facility}</p>
                  <p className="text-[11px] text-slate-500">{activeUser.district}, {activeUser.state}</p>
                </div>
                <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-indigo-700 block">
                      {txt.referredToFacility}
                    </span>
                    <span className="text-[9px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.2 rounded">
                      Apex Tie-Up Network
                    </span>
                  </div>
                  <select
                    value={customApexHospital || selectedTicket.referralRecommendation}
                    onChange={(e) => setCustomApexHospital(e.target.value)}
                    className="w-full mt-0.5 p-1.5 bg-white border border-indigo-300 rounded text-xs font-bold text-indigo-950 outline-none focus:border-indigo-600"
                  >
                    <option value={selectedTicket.referralRecommendation}>
                      ★ {selectedTicket.referralRecommendation} ({activeLang === 'or-IN' ? 'ପ୍ରସ୍ତାବିତ' : (activeLang === 'hi-IN' ? 'प्रस्तावित' : 'Recommended')})
                    </option>
                    <optgroup label={activeLang === 'or-IN' ? 'ଓଡ଼ିଶାର ସହବନ୍ଧିତ ଏପେକ୍ସ ହସ୍ପିଟାଲ୍ (Odisha Apex)' : (activeLang === 'hi-IN' ? 'ओडिशा संबद्ध शीर्ष अस्पताल' : 'Odisha Partner Apex Hospitals')}>
                      {apexHospitals.filter((h) => h.region === 'Odisha').map((h) => (
                        <option key={h.id} value={`${h.name} - ${h.cityLabel}`}>
                          {h.name} ({h.cityLabel})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label={activeLang === 'or-IN' ? 'ଜାତୀୟ ଏପେକ୍ସ ସେଣ୍ଟର୍ (National Metros)' : (activeLang === 'hi-IN' ? 'राष्ट्रीय शीर्ष संस्थान' : 'National Apex Metro Centers')}>
                      {apexHospitals.filter((h) => h.region === 'National').map((h) => (
                        <option key={h.id} value={`${h.name} - ${h.cityLabel}`}>
                          {h.name} ({h.cityLabel})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="text-[11px] text-indigo-700 mt-1">{txt.criticalCareDept}</p>
                </div>
              </div>

              {/* Vitals at Transfer */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">{txt.vitalsAtTransfer}</span>
                <div className="grid grid-cols-4 gap-2 bg-slate-100 p-2 rounded text-center">
                  <div>{txt.temp}: <strong>{selectedTicket.vitals.temp}</strong></div>
                  <div>{txt.pulse}: <strong>{selectedTicket.vitals.pulse}</strong></div>
                  <div>{txt.spo2}: <strong>{selectedTicket.vitals.spo2}</strong></div>
                  <div>{txt.bp}: <strong>{selectedTicket.vitals.bp}</strong></div>
                </div>
              </div>

              {/* Clinical Indication */}
              <div>
                <span className="font-bold text-slate-700 block mb-1">{txt.clinicalIndication}</span>
                <p className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900 font-medium">
                  {selectedTicket.urgencyReason}
                </p>
              </div>

              {/* Doctor Official Stamp / Sign-off */}
              <div className="border-t pt-4 mt-4 flex justify-between items-end">
                <div className="text-slate-500 text-[11px]">
                  <p className="font-semibold text-slate-700">{txt.transitProtocol}</p>
                </div>

                <div className="text-right border-l pl-4 border-slate-200">
                  <div className="font-bold text-slate-900 text-sm">{activeUser.name}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold">{activeUser.role}</div>
                  <div className="text-[10px] font-mono text-slate-500">{txt.regNo} {activeUser.staffId}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{txt.verifiedMedicalSigner}</div>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                {txt.btnPrintSlip}
              </button>

              <button
                onClick={() => {
                  alert(txt.alertDispatched);
                  setShowReferralModal(false);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                {txt.btnDispatchDigital}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
