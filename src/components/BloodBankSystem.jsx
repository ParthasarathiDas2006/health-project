import React, { useState } from 'react';
import {
  Droplet,
  Search,
  Filter,
  MapPin,
  Phone,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Clock,
  User,
  FileText,
  Printer,
  X,
  Award,
  HeartHandshake,
  ArrowRight,
  RefreshCw,
  Share2,
  Info
} from 'lucide-react';
import {
  ODISHA_DISTRICTS,
  BLOOD_GROUPS,
  BLOOD_COMPONENTS,
  ODISHA_BLOOD_BANKS,
  ODISHA_DONATION_CAMPS
} from '../utils/bloodBankData';
import {
  getBloodRequests,
  saveBloodRequest,
  getDonorPledges,
  saveDonorPledge
} from '../utils/bloodBankStorage';

export default function BloodBankSystem({ currentUser, appLang }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  // Sub-tabs: 'receiver' | 'donor' | 'camps' | 'my-tokens'
  const [activeSubTab, setActiveSubTab] = useState('receiver');

  // Search & Filter state for Receiver
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(currentUser?.bloodGroup || 'B+');
  const [selectedComponent, setSelectedComponent] = useState('PRBC');

  // Reservation Modal state (Receiver)
  const [reservingBloodBank, setReservingBloodBank] = useState(null);
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [unitsNeeded, setUnitsNeeded] = useState(1);
  const [hospitalAttending, setHospitalAttending] = useState(currentUser?.facility || '');
  const [doctorPrescriptionId, setDoctorPrescriptionId] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Donor Eligibility Quiz state
  const [eligibilityAnswers, setEligibilityAnswers] = useState({
    age: true,
    weight: true,
    hemoglobin: true,
    lastDonation: true,
    healthHistory: true
  });

  // Donor Registration Modal state
  const [schedulingBloodBank, setSchedulingBloodBank] = useState(null);
  const [donorName, setDonorName] = useState(currentUser?.name || '');
  const [donorPhone, setDonorPhone] = useState(currentUser?.phone || '');
  const [donorGroup, setDonorGroup] = useState(currentUser?.bloodGroup || 'O+');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('Morning (09:00 AM - 12:00 PM)');
  const [donationType, setDonationType] = useState('Whole Blood');
  const [confirmedPledge, setConfirmedPledge] = useState(null);

  // Stored Records
  const [myRequests, setMyRequests] = useState(() => getBloodRequests());
  const [myPledges, setMyPledges] = useState(() => getDonorPledges());

  // Localization Dictionary
  const txt = {
    'or-IN': {
      title: 'ଓଡ଼ିଶା ହସ୍ପିଟାଲ୍ ରକ୍ତ ଭଣ୍ଡାର ଓ ରକ୍ତଦାନ ପୋର୍ଟାଲ୍',
      subtitle: 'ଇ-ରକ୍ତକୋଷ ଓ ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ ପ୍ରମାଣିତ ( e-BloodBank Odisha )',
      tabReceiver: '୧. ରକ୍ତ ଆବଶ୍ୟକତା (Receiver)',
      tabDonor: '୨. ରକ୍ତଦାନ ସେବା (Donor)',
      tabCamps: '୩. ରକ୍ତଦାନ ଶିବିର (Camps)',
      tabMyTokens: '୪. ମୋର ଟିକେଟ୍ ଓ କାର୍ଡ (My Tokens)',

      // Receiver UI
      searchPlaceholder: 'ହସ୍ପିଟାଲ୍, ରକ୍ତ ଭଣ୍ଡାର କିମ୍ବା ସହର ଖୋଜନ୍ତୁ...',
      selectDistrict: 'ଜିଲ୍ଲା ଚୟନ କରନ୍ତୁ:',
      selectGroup: 'ରକ୍ତ ବର୍ଗ (Blood Group):',
      selectComponent: 'ରକ୍ତ ଉପାଦାନ (Component):',
      bskyFreeLabel: 'BSKY / NHM ନିଃଶୁଳ୍କ ସେବା',
      availableUnits: 'ଉପଲବ୍ଧ ୟୁନିଟ୍',
      unitsCount: 'ୟୁନିଟ୍',
      statusAvailable: 'ପର୍ଯ୍ୟାପ୍ତ ଷ୍ଟକ୍',
      statusLow: 'ସୀମିତ ଷ୍ଟକ୍ (Low)',
      statusCritical: 'ଜରୁରୀ / ଶୂନ୍ୟ ଷ୍ଟକ୍',
      btnReserve: 'ରକ୍ତ ୟୁନିଟ୍ ସଂରକ୍ଷଣ କରନ୍ତୁ (Reserve)',
      btnCall: 'ହେଲ୍ପଲାଇନ୍ ୧୦୪ କଲ୍ କରନ୍ତୁ',

      // Modal Reserve
      modalReserveTitle: 'ଜରୁରୀ ରକ୍ତ ୟୁନିଟ୍ ସଂରକ୍ଷଣ ଫର୍ମ (e-BloodBank)',
      pName: 'ରୋଗୀଙ୍କ ନାମ *',
      pAge: 'ବୟସ',
      pGender: 'ଲିଙ୍ଗ',
      unitsLabel: 'ଆବଶ୍ୟକ ୟୁନିଟ୍ ସଂଖ୍ୟା',
      hospLabel: 'ଚିକିତ୍ସିତ ହେଉଥିବା ହସ୍ପିଟାଲ୍ ନାମ',
      rxLabel: 'ଡାକ୍ତରୀ ପ୍ରେସକ୍ରିପସନ୍ / ଟ୍ରାଏଜ୍ ଟିକେଟ୍ ନମ୍ବର',
      confirmReserveBtn: 'ସଂରକ୍ଷଣ ଟୋକନ୍ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',

      // Token Slip
      tokenHeader: 'ଓଡ଼ିଶା ଇ-ରକ୍ତକୋଷ ଜରୁରୀ ରକ୍ତ ସଂରକ୍ଷଣ ଟୋକନ୍',
      validityNotice: 'ଏହି ଟୋକନ୍ ୧୨ ଘଣ୍ଟା ପାଇଁ ବୈଧ। ଦୟାକରି ଡାକ୍ତରୀ ପ୍ରେସକ୍ରିପସନ୍ ସହ ରକ୍ତ ଭଣ୍ଡାରରେ ଉପସ୍ଥିତ ହୁଅନ୍ତୁ।',
      printSlip: 'ଟୋକନ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',

      // Donor UI
      eligibilityHeader: 'ରକ୍ତଦାତା ଯୋଗ୍ୟତା ପରୀକ୍ଷା (Donor Eligibility Check)',
      q1: 'ଆପଣଙ୍କ ବୟସ ୧୮ ରୁ ୬୫ ବର୍ଷ ମଧ୍ୟରେ କି?',
      q2: 'ଆପଣଙ୍କ ଓଜନ ୪୫ କିଲୋଗ୍ରାମ୍ ରୁ ଅଧିକ କି?',
      q3: 'ଆପଣଙ୍କ ହିମୋଗ୍ଲୋବିନ୍ ସ୍ତର > ୧୨.୫ g/dL ଓ ଆପଣ ସୁସ୍ଥ ଅଛନ୍ତି କି?',
      q4: 'ଗତ ୩ ମାସ ମଧ୍ୟରେ ଆପଣ ରକ୍ତଦାନ କରିନାହାନ୍ତି କି?',
      q5: 'ଗତ ୬ ମାସରେ ଆପଣଙ୍କର କୌଣସି ଶଲ୍ୟଚିକିତ୍ସା କିମ୍ବା ଟାଟୁ ହୋଇନାହିଁ କି?',
      eligibleBadge: '✓ ଆପଣ ରକ୍ତଦାନ ପାଇଁ ଯୋଗ୍ୟ!',
      ineligibleBadge: '⚠ ରକ୍ତଦାନ ପାଇଁ ବର୍ତ୍ତମାନ ଯୋଗ୍ୟ ନୁହଁନ୍ତି',
      btnScheduleDonor: 'ହସ୍ପିଟାଲ୍‌ରେ ରକ୍ତଦାନ ସମୟ ସ୍ଲଟ୍ ବୁକ୍ କରନ୍ତୁ',

      // Donor Schedule Modal
      modalDonorTitle: 'ସ୍ୱେଚ୍ଛାକୃତ ରକ୍ତଦାନ ନିବନ୍ଧନ ଫର୍ମ',
      dName: 'ରକ୍ତଦାତାଙ୍କ ନାମ *',
      dPhone: 'ମୋବାଇଲ୍ ନମ୍ବର *',
      dGroup: 'ରକ୍ତ ବର୍ଗ',
      dDate: 'ରକ୍ତଦାନ ତାରିଖ',
      dSlot: 'ସମୟ ସ୍ଲଟ୍',
      dType: 'ରକ୍ତଦାନ ପ୍ରକାର',
      confirmPledgeBtn: 'ରକ୍ତଦାତା କାର୍ଡ଼ ପ୍ରସ୍ତୁତ କରନ୍ତୁ',

      // Donor Card
      donorCardHeader: 'ଓଡ଼ିଶା ସ୍ୱେଚ୍ଛାକୃତ ରକ୍ତଦାତା ପରିଚୟ ପତ୍ର (Donor Card)',
      thankNotice: 'ଆପଣଙ୍କର ମହତ୍ ରକ୍ତଦାନ ପାଇଁ ଧନ୍ୟବାଦ। ଏହା ଜଣଙ୍କର ଜୀବନ ବଞ୍ଚାଇବ।',

      // Camps UI
      campsHeader: 'ଓଡ଼ିଶାର ଆଗାମୀ ସ୍ୱେଚ୍ଛାକୃତ ରକ୍ତଦାନ ଶିବିର',
      campLocation: 'ସ୍ଥାନ:',
      campOrg: 'ଆୟୋଜକ:',
      campTarget: 'ଲକ୍ଷ୍ୟ:',

      emptyRequests: 'କୌଣସି ଜରୁରୀ ସଂରକ୍ଷଣ ଟୋକନ୍ ନାହିଁ।',
      emptyPledges: 'କୌଣସି ରକ୍ତଦାନ କାର୍ଡ ନାହିଁ।'
    },
    'hi-IN': {
      title: 'ओडिशा अस्पताल रक्त बैंक एवं रक्तदान पोर्टल',
      subtitle: 'ई-रक्तकोश एवं ओडिशा स्वास्थ्य विभाग सत्यापित (e-BloodBank Odisha)',
      tabReceiver: '1. रक्त आवश्यकता (Receiver)',
      tabDonor: '2. रक्तदान सेवा (Donor)',
      tabCamps: '3. रक्तदान शिविर (Camps)',
      tabMyTokens: '4. मेरे टोकन एवं कार्ड (My Tokens)',

      // Receiver UI
      searchPlaceholder: 'अस्पताल, रक्त बैंक या शहर खोजें...',
      selectDistrict: 'जिला चुनें:',
      selectGroup: 'रक्त समूह (Blood Group):',
      selectComponent: 'रक्त घटक (Component):',
      bskyFreeLabel: 'BSKY / NHM निशुल्क सेवा',
      availableUnits: 'उपलब्ध यूनिट',
      unitsCount: 'यूनिट',
      statusAvailable: 'पर्याप्त स्टॉक',
      statusLow: 'सीमित स्टॉक (Low)',
      statusCritical: 'अत्यंत आवश्यक / शून्य',
      btnReserve: 'रक्त यूनिट आरक्षित करें (Reserve)',
      btnCall: 'हेल्पलाइन 104 कॉल करें',

      // Modal Reserve
      modalReserveTitle: 'आपात्कालीन रक्त यूनिट आरक्षण फॉर्म (e-BloodBank)',
      pName: 'मरीज का नाम *',
      pAge: 'आयु',
      pGender: 'लिंग',
      unitsLabel: 'आवश्यक यूनिट संख्या',
      hospLabel: 'इलाजरत अस्पताल का नाम',
      rxLabel: 'डॉक्टर प्रिस्क्रिप्शन / ट्रायज टिकट नंबर',
      confirmReserveBtn: 'आरक्षण टोकन जारी करें',

      // Token Slip
      tokenHeader: 'ओडिशा ई-रक्तकोश आपात्कालीन रक्त आरक्षण टोकन',
      validityNotice: 'यह टोकन 12 घंटे के लिए वैध है। कृपया डॉक्टर प्रिस्क्रिप्शन के साथ रक्त बैंक में उपस्थित हों।',
      printSlip: 'टोकन प्रिंट करें',

      // Donor UI
      eligibilityHeader: 'रक्तदाता पात्रता जांच (Donor Eligibility Check)',
      q1: 'क्या आपकी आयु 18 से 65 वर्ष के बीच है?',
      q2: 'क्या आपका वजन 45 किलोग्राम से अधिक है?',
      q3: 'क्या आपका हीमोग्लोबिन > 12.5 g/dL है और आप स्वस्थ हैं?',
      q4: 'क्या आपने पिछले 3 महीनों में रक्तदान नहीं किया है?',
      q5: 'क्या पिछले 6 महीनों में कोई सर्जरी या टैटू नहीं हुआ है?',
      eligibleBadge: '✓ आप रक्तदान के लिए पात्र हैं!',
      ineligibleBadge: '⚠ रक्तदान के लिए वर्तमान में पात्र नहीं हैं',
      btnScheduleDonor: 'अस्पताल में रक्तदान समय स्लॉट बुक करें',

      // Donor Schedule Modal
      modalDonorTitle: 'स्वेच्छापूर्वक रक्तदान पंजीकरण फॉर्म',
      dName: 'रक्तदाता का नाम *',
      dPhone: 'मोबाइल नंबर *',
      dGroup: 'रक्त समूह',
      dDate: 'रक्तदान तिथि',
      dSlot: 'समय स्लॉट',
      dType: 'रक्तदान प्रकार',
      confirmPledgeBtn: 'रक्तदाता कार्ड जारी करें',

      // Donor Card
      donorCardHeader: 'ओडिशा स्वेच्छापूर्वक रक्तदाता पहचान पत्र (Donor Card)',
      thankNotice: 'आपके अमूल्य रक्तदान के लिए धन्यवाद। यह एक जीवन बचाएगा।',

      // Camps UI
      campsHeader: 'ओडिशा में आगामी स्वेच्छापूर्वक रक्तदान शिविर',
      campLocation: 'स्थान:',
      campOrg: 'आयोजक:',
      campTarget: 'लक्ष्य:',

      emptyRequests: 'कोई आपातकालीन आरक्षण टोकन उपलब्ध नहीं है।',
      emptyPledges: 'कोई रक्तदान कार्ड उपलब्ध नहीं है।'
    },
    'en-IN': {
      title: 'Odisha Hospital Blood Bank & Donor Portal',
      subtitle: 'e-RaktKosh & Odisha Health Dept Aligned (e-BloodBank Odisha)',
      tabReceiver: '1. Need Blood (Receiver)',
      tabDonor: '2. Donate Blood (Donor)',
      tabCamps: '3. Donation Camps (Camps)',
      tabMyTokens: '4. My Tokens & Cards',

      // Receiver UI
      searchPlaceholder: 'Search blood bank, hospital or city...',
      selectDistrict: 'Select District:',
      selectGroup: 'Blood Group:',
      selectComponent: 'Blood Component:',
      bskyFreeLabel: 'BSKY / NHM Free Supply',
      availableUnits: 'Available Units',
      unitsCount: 'Units',
      statusAvailable: 'Stock Available',
      statusLow: 'Low Stock',
      statusCritical: 'Critical / Out of Stock',
      btnReserve: 'Reserve Blood Unit',
      btnCall: 'Call Helpline 104',

      // Modal Reserve
      modalReserveTitle: 'Emergency Blood Unit Reservation Form (e-BloodBank)',
      pName: 'Patient Name *',
      pAge: 'Age',
      pGender: 'Gender',
      unitsLabel: 'Number of Units Needed',
      hospLabel: 'Attending Hospital Name',
      rxLabel: 'Doctor Prescription / Triage Ticket No.',
      confirmReserveBtn: 'Generate Reservation Token',

      // Token Slip
      tokenHeader: 'Odisha e-BloodBank Emergency Unit Reservation Slip',
      validityNotice: 'This token is valid for 12 hours. Please report to the blood bank counter with physician prescription.',
      printSlip: 'Print Token Slip',

      // Donor UI
      eligibilityHeader: 'Blood Donor Self-Eligibility Check',
      q1: 'Are you aged between 18 and 65 years?',
      q2: 'Is your body weight above 45 kg?',
      q3: 'Is your hemoglobin > 12.5 g/dL & feeling healthy?',
      q4: 'Have you NOT donated blood in the last 3 months?',
      q5: 'Free of recent surgery, tattoo (6 mos), or major infection?',
      eligibleBadge: '✓ You Are Eligible To Donate Blood!',
      ineligibleBadge: '⚠ Currently Ineligible To Donate',
      btnScheduleDonor: 'Schedule Blood Donation Slot at Hospital',

      // Donor Schedule Modal
      modalDonorTitle: 'Voluntary Blood Donor Registration Form',
      dName: 'Donor Name *',
      dPhone: 'Mobile Number *',
      dGroup: 'Blood Group',
      dDate: 'Preferred Donation Date',
      dSlot: 'Time Slot',
      dType: 'Donation Type',
      confirmPledgeBtn: 'Issue Digital Donor Card',

      // Donor Card
      donorCardHeader: 'Odisha Voluntary Blood Donor Certificate Card',
      thankNotice: 'Thank you for your noble gesture. Your blood donation saves critical lives!',

      // Camps UI
      campsHeader: 'Upcoming Voluntary Blood Donation Drives in Odisha',
      campLocation: 'Venue:',
      campOrg: 'Organizer:',
      campTarget: 'Target:',

      emptyRequests: 'No active blood reservation tokens.',
      emptyPledges: 'No active donor pledge cards.'
    }
  }[lang] || {};

  // Filtered Blood Banks
  const filteredBloodBanks = ODISHA_BLOOD_BANKS.filter((bb) => {
    const matchesSearch =
      bb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bb.hospitalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bb.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bb.nameOdia && bb.nameOdia.includes(searchQuery));
    const matchesDistrict =
      selectedDistrict === 'ALL' || bb.district.toLowerCase().includes(selectedDistrict.toLowerCase());
    return matchesSearch && matchesDistrict;
  });

  // Calculate Donor Eligibility
  const isEligibleToDonate = Object.values(eligibilityAnswers).every((val) => val === true);

  // Handle Blood Reservation Submit
  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!reservingBloodBank) return;

    const requestData = {
      bloodBankId: reservingBloodBank.id,
      bloodBankName: reservingBloodBank.name,
      hospitalName: reservingBloodBank.hospitalName,
      district: reservingBloodBank.district,
      patientName: patientName || 'Emergency Patient',
      patientAge: patientAge || '40',
      patientGender: patientGender || 'Male',
      bloodGroup: selectedBloodGroup,
      component: selectedComponent,
      unitsNeeded: parseInt(unitsNeeded, 10) || 1,
      attendingHospital: hospitalAttending || reservingBloodBank.hospitalName,
      prescriptionId: doctorPrescriptionId || `TRG-${Math.floor(1000 + Math.random() * 9000)}`,
      nodalPhone: reservingBloodBank.nodalPhone,
      helpline: reservingBloodBank.helpline
    };

    const saved = saveBloodRequest(requestData);
    setConfirmedReservation(saved);
    setMyRequests(getBloodRequests());
    setReservingBloodBank(null);
  };

  // Handle Donor Pledge Submit
  const handleConfirmPledge = (e) => {
    e.preventDefault();
    if (!schedulingBloodBank) return;

    const pledgeData = {
      bloodBankId: schedulingBloodBank.id,
      bloodBankName: schedulingBloodBank.name,
      hospitalName: schedulingBloodBank.hospitalName,
      district: schedulingBloodBank.district,
      donorName: donorName || 'Voluntary Donor',
      donorPhone: donorPhone || '+91 99999 00000',
      bloodGroup: donorGroup,
      donationDate: preferredDate || new Date().toISOString().split('T')[0],
      timeSlot: preferredSlot,
      donationType: donationType,
      nodalPhone: schedulingBloodBank.nodalPhone
    };

    const saved = saveDonorPledge(pledgeData);
    setConfirmedPledge(saved);
    setMyPledges(getDonorPledges());
    setSchedulingBloodBank(null);
  };

  return (
    <div className="space-y-6">
      {/* Sub-Header / Portal Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-rose-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20">
              <Droplet className="w-8 h-8 text-rose-300 fill-rose-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {txt.title}
                </h2>
                <span className="bg-rose-500/30 text-rose-200 border border-rose-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  e-BloodBank Odisha
                </span>
              </div>
              <p className="text-xs text-rose-200 mt-0.5">{txt.subtitle}</p>
            </div>
          </div>

          {/* Emergency Helpline Pill */}
          <div className="flex items-center gap-2.5 bg-rose-950/70 border border-rose-500/40 px-4 py-2 rounded-xl text-xs">
            <Phone className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <div className="text-[10px] text-rose-300 font-semibold uppercase tracking-wider">
                Odisha Blood Helpline
              </div>
              <div className="text-sm font-extrabold text-white">104 / 0671-2414080</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 border-t border-rose-800/60 pt-4">
          <button
            onClick={() => setActiveSubTab('receiver')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSubTab === 'receiver'
                ? 'bg-white text-rose-900 shadow-md'
                : 'bg-rose-950/40 text-rose-200 hover:bg-rose-800/50'
            }`}
          >
            <Droplet className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
            {txt.tabReceiver}
          </button>

          <button
            onClick={() => setActiveSubTab('donor')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSubTab === 'donor'
                ? 'bg-white text-rose-900 shadow-md'
                : 'bg-rose-950/40 text-rose-200 hover:bg-rose-800/50'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
            {txt.tabDonor}
          </button>

          <button
            onClick={() => setActiveSubTab('camps')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSubTab === 'camps'
                ? 'bg-white text-rose-900 shadow-md'
                : 'bg-rose-950/40 text-rose-200 hover:bg-rose-800/50'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            {txt.tabCamps}
          </button>

          <button
            onClick={() => setActiveSubTab('my-tokens')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeSubTab === 'my-tokens'
                ? 'bg-white text-rose-900 shadow-md'
                : 'bg-rose-950/40 text-rose-200 hover:bg-rose-800/50'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            {txt.tabMyTokens}
            {(myRequests.length > 0 || myPledges.length > 0) && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-extrabold">
                {myRequests.length + myPledges.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: RECEIVER / BLOOD SEARCH & AVAILABILITY */}
      {/* ========================================================= */}
      {activeSubTab === 'receiver' && (
        <div className="space-y-5">
          {/* Search & Filter Controls */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Search Bar */}
              <div className="relative md:col-span-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={txt.searchPlaceholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-rose-500 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* District Filter Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                  {txt.selectDistrict}
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-rose-500 focus:bg-white"
                >
                  {ODISHA_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>
                      {dist === 'ALL'
                        ? lang === 'or-IN'
                          ? 'ସମସ୍ତ ଜିଲ୍ଲା (All Odisha)'
                          : lang === 'hi-IN'
                          ? 'सभी जिले (All Odisha)'
                          : 'All Districts'
                        : dist}
                    </option>
                  ))}
                </select>
              </div>

              {/* Component Filter Dropdown */}
              <div>
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                  {txt.selectComponent}
                </label>
                <select
                  value={selectedComponent}
                  onChange={(e) => setSelectedComponent(e.target.value)}
                  className="w-full py-2.5 px-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-rose-500 focus:bg-white"
                >
                  {BLOOD_COMPONENTS.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {lang === 'or-IN' ? comp.or : lang === 'hi-IN' ? comp.hi : comp.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Blood Group Quick Pill Selector */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 mb-1.5 block flex items-center justify-between">
                <span>{txt.selectGroup}</span>
                <span className="text-rose-600 font-extrabold">{selectedBloodGroup}</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {BLOOD_GROUPS.map((grp) => (
                  <button
                    key={grp}
                    onClick={() => setSelectedBloodGroup(grp)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all border ${
                      selectedBloodGroup === grp
                        ? 'bg-rose-600 text-white border-rose-700 shadow-sm scale-105'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-rose-50 hover:text-rose-700'
                    }`}
                  >
                    {grp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Blood Banks Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBloodBanks.map((bb) => {
              const compStock =
                bb.stock[selectedBloodGroup]?.[selectedComponent] ?? 0;
              const wholeStock = bb.stock[selectedBloodGroup]?.WHOLE ?? 0;

              // Determine Stock Status Badge
              let statusText = txt.statusAvailable;
              let statusBg = 'bg-emerald-100 text-emerald-800 border-emerald-300';
              let stockColor = 'text-emerald-700';

              if (compStock === 0) {
                statusText = txt.statusCritical;
                statusBg = 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse';
                stockColor = 'text-rose-700';
              } else if (compStock < 5) {
                statusText = txt.statusLow;
                statusBg = 'bg-amber-100 text-amber-800 border-amber-300';
                stockColor = 'text-amber-700';
              }

              return (
                <div
                  key={bb.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-rose-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Card Header: Name & BSKY Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                          {lang === 'or-IN' && bb.nameOdia ? bb.nameOdia : bb.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {bb.category} • {bb.city}, {bb.district}
                        </p>
                      </div>

                      <span className="text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        ✓ {txt.bskyFreeLabel}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 flex items-center gap-1 mb-3">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{bb.address}</span>
                    </p>

                    {/* Stock Status Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {selectedBloodGroup} ({selectedComponent})
                        </div>
                        <div className={`text-2xl font-black ${stockColor} leading-none mt-0.5`}>
                          {compStock}{' '}
                          <span className="text-xs font-semibold text-slate-500">
                            {txt.unitsCount}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Whole Blood: {wholeStock} units
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${statusBg}`}>
                        {statusText}
                      </span>
                    </div>

                    {/* Nodal Officer Contact */}
                    <div className="text-[11px] text-slate-500 space-y-0.5 mb-4">
                      <div>
                        <strong>Nodal Officer:</strong> {bb.nodalOfficer}
                      </div>
                      <div className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>Helpline: {bb.helpline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setReservingBloodBank(bb)}
                      disabled={compStock === 0}
                      className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs ${
                        compStock === 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-rose-600 hover:bg-rose-700 text-white'
                      }`}
                    >
                      <Droplet className="w-3.5 h-3.5 text-rose-200 fill-white" />
                      {txt.btnReserve}
                    </button>

                    <a
                      href={`tel:${bb.nodalPhone || '104'}`}
                      className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1"
                      title="Call Helpline"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-600" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: DONOR PORTAL & ELIGIBILITY CHECK */}
      {/* ========================================================= */}
      {activeSubTab === 'donor' && (
        <div className="space-y-6">
          {/* Quick 5-Point Donor Eligibility Self-Check Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {txt.eligibilityHeader}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Odisha State Blood Transfusion Council (OSBTC) Standard Protocol
                </p>
              </div>

              <span
                className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                  isEligibleToDonate
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                {isEligibleToDonate ? txt.eligibleBadge : txt.ineligibleBadge}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
              {[
                { key: 'age', q: txt.q1 },
                { key: 'weight', q: txt.q2 },
                { key: 'hemoglobin', q: txt.q3 },
                { key: 'lastDonation', q: txt.q4 },
                { key: 'healthHistory', q: txt.q5 }
              ].map(({ key, q }) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white cursor-pointer transition-all"
                >
                  <input
                    type="checkbox"
                    checked={eligibilityAnswers[key]}
                    onChange={(e) =>
                      setEligibilityAnswers({
                        ...eligibilityAnswers,
                        [key]: e.target.checked
                      })
                    }
                    className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                  />
                  <span className="font-medium">{q}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hospital Blood Banks Accepting Donors */}
          <div className="space-y-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              {txt.btnScheduleDonor}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ODISHA_BLOOD_BANKS.map((bb) => (
                <div
                  key={bb.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {lang === 'or-IN' && bb.nameOdia ? bb.nameOdia : bb.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {bb.district} • Donor Hours: {bb.donorTimings}
                    </p>
                    <p className="text-[11px] text-slate-600 mt-2">
                      📍 {bb.address}
                    </p>
                  </div>

                  <button
                    onClick={() => setSchedulingBloodBank(bb)}
                    disabled={!isEligibleToDonate}
                    className={`mt-4 w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isEligibleToDonate
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-emerald-200" />
                    {txt.btnScheduleDonor}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: ODISHA BLOOD DONATION CAMPS */}
      {/* ========================================================= */}
      {activeSubTab === 'camps' && (
        <div className="space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            {txt.campsHeader}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ODISHA_DONATION_CAMPS.map((camp) => (
              <div
                key={camp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm">
                      {lang === 'or-IN' ? camp.titleOdia : camp.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-semibold">
                      {txt.campOrg} {camp.organizer}
                    </p>
                  </div>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0">
                    {camp.district}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      <strong>{txt.campLocation}</strong> {camp.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      <strong>Date:</strong> {camp.date} ({camp.time})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      <strong>Contact:</strong> {camp.contact}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>
                    <strong>{txt.campTarget}</strong> {camp.targetUnits} Units
                  </span>
                  <span className="text-emerald-700 font-bold">
                    ✓ Open for Walk-ins
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: MY TOKENS & PLEDGE CARDS */}
      {/* ========================================================= */}
      {activeSubTab === 'my-tokens' && (
        <div className="space-y-6">
          {/* Active Blood Requests */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Droplet className="w-4 h-4 text-rose-600 fill-rose-500" />
              Emergency Blood Unit Reservation Tokens
            </h3>

            {myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                {txt.emptyRequests}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-mono text-xs font-extrabold text-rose-700">
                        #{req.id}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Patient:</strong> {req.patientName} ({req.patientAge} yrs, {req.patientGender})
                      </div>
                      <div>
                        <strong>Blood Group & Component:</strong>{' '}
                        <span className="font-black text-rose-700">{req.bloodGroup}</span> ({req.component}) - {req.unitsNeeded} Unit(s)
                      </div>
                      <div>
                        <strong>Hospital:</strong> {req.bloodBankName}
                      </div>
                      <div>
                        <strong>Prescription/Triage Ref:</strong> {req.prescriptionId}
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmedReservation(req)}
                      className="w-full py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      View & Print Token Slip
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Donor Pledges */}
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-emerald-600" />
              Digital Donor Pledge Cards
            </h3>

            {myPledges.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-200">
                {txt.emptyPledges}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myPledges.map((plg) => (
                  <div
                    key={plg.id}
                    className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-mono text-xs font-extrabold text-emerald-700">
                        #{plg.id}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {plg.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div>
                        <strong>Donor:</strong> {plg.donorName}
                      </div>
                      <div>
                        <strong>Blood Group:</strong>{' '}
                        <span className="font-black text-emerald-700">{plg.bloodGroup}</span> ({plg.donationType})
                      </div>
                      <div>
                        <strong>Hospital Facility:</strong> {plg.bloodBankName}
                      </div>
                      <div>
                        <strong>Scheduled Date:</strong> {plg.donationDate} ({plg.timeSlot})
                      </div>
                    </div>

                    <button
                      onClick={() => setConfirmedPledge(plg)}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-200" />
                      View & Print Donor Certificate Card
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: RECEIVER BLOOD UNIT RESERVATION FORM */}
      {/* ========================================================= */}
      {reservingBloodBank && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {txt.modalReserveTitle}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {reservingBloodBank.name} ({reservingBloodBank.district})
                </p>
              </div>
              <button
                onClick={() => setReservingBloodBank(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReservation} className="space-y-3 text-xs">
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center justify-between text-rose-900">
                <span>
                  Group: <strong>{selectedBloodGroup}</strong> ({selectedComponent})
                </span>
                <span className="font-bold">
                  Available: {reservingBloodBank.stock[selectedBloodGroup]?.[selectedComponent] || 0} Units
                </span>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.pName}</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">{txt.pAge}</label>
                  <input
                    type="number"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">{txt.pGender}</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.unitsLabel}</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={unitsNeeded}
                  onChange={(e) => setUnitsNeeded(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.hospLabel}</label>
                <input
                  type="text"
                  value={hospitalAttending}
                  onChange={(e) => setHospitalAttending(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.rxLabel}</label>
                <input
                  type="text"
                  placeholder="e.g. TRG-9921 or Dr. Prescription Ref"
                  value={doctorPrescriptionId}
                  onChange={(e) => setDoctorPrescriptionId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReservingBloodBank(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {txt.confirmReserveBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CONFIRMED RESERVATION TOKEN PRINT SLIP */}
      {/* ========================================================= */}
      {confirmedReservation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <Droplet className="w-5 h-5 fill-rose-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {txt.tokenHeader}
                </h3>
              </div>
              <button
                onClick={() => setConfirmedReservation(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Token Printable Card */}
            <div className="bg-slate-50 border-2 border-dashed border-rose-300 rounded-2xl p-5 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    e-BloodBank Odisha Token ID
                  </div>
                  <div className="text-lg font-black text-rose-700 font-mono">
                    #{confirmedReservation.id}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-bold">Issued At</div>
                  <div className="font-semibold text-slate-700">
                    {new Date(confirmedReservation.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Patient</span>
                  <strong className="text-slate-900">{confirmedReservation.patientName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Group & Component</span>
                  <strong className="text-rose-700">{confirmedReservation.bloodGroup}</strong> ({confirmedReservation.component})
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Units Reserved</span>
                  <strong>{confirmedReservation.unitsNeeded} Unit(s)</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Triage / Rx ID</span>
                  <strong className="font-mono text-slate-700">{confirmedReservation.prescriptionId}</strong>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <span className="text-[10px] text-slate-400 font-bold block">Facility</span>
                <strong className="text-slate-900">{confirmedReservation.bloodBankName}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Helpline: {confirmedReservation.helpline} | Nodal: {confirmedReservation.nodalPhone}
                </p>
              </div>

              <div className="bg-amber-50 text-amber-800 p-2 rounded-lg text-[10px] border border-amber-200 font-medium">
                {txt.validityNotice}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setConfirmedReservation(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                {txt.printSlip}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: DONOR REGISTRATION SCHEDULE FORM */}
      {/* ========================================================= */}
      {schedulingBloodBank && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {txt.modalDonorTitle}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {schedulingBloodBank.name} ({schedulingBloodBank.district})
                </p>
              </div>
              <button
                onClick={() => setSchedulingBloodBank(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmPledge} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.dName}</label>
                <input
                  type="text"
                  required
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">{txt.dPhone}</label>
                  <input
                    type="text"
                    required
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 mb-1 block">{txt.dGroup}</label>
                  <select
                    value={donorGroup}
                    onChange={(e) => setDonorGroup(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                  >
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.dDate}</label>
                <input
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.dSlot}</label>
                <select
                  value={preferredSlot}
                  onChange={(e) => setPreferredSlot(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">{txt.dType}</label>
                <select
                  value={donationType}
                  onChange={(e) => setDonationType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                >
                  <option value="Whole Blood">Whole Blood (ସମ୍ପୂର୍ଣ୍ଣ ରକ୍ତ)</option>
                  <option value="Platelet Apheresis">Platelet Apheresis (SDP)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSchedulingBloodBank(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {txt.confirmPledgeBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 4: CONFIRMED DONOR CERTIFICATE CARD */}
      {/* ========================================================= */}
      {confirmedPledge && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-emerald-700">
                <Award className="w-5 h-5" />
                <h3 className="font-black text-slate-900 text-sm">
                  {txt.donorCardHeader}
                </h3>
              </div>
              <button
                onClick={() => setConfirmedPledge(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Donor Certificate Card */}
            <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-2xl p-5 shadow-lg border border-emerald-700/50 font-sans text-xs space-y-3">
              <div className="flex justify-between items-start border-b border-emerald-800 pb-2">
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                    Odisha Voluntary Donor Pass
                  </div>
                  <div className="text-lg font-black text-white font-mono">
                    #{confirmedPledge.id}
                  </div>
                </div>
                <span className="bg-emerald-500/30 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-400/30">
                  {confirmedPledge.donationType}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-emerald-300 block">Donor Name</span>
                  <strong className="text-sm font-bold text-white">{confirmedPledge.donorName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Blood Group</span>
                  <strong className="text-lg font-black text-amber-300">{confirmedPledge.bloodGroup}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Scheduled Date</span>
                  <strong className="text-white">{confirmedPledge.donationDate}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block">Slot</span>
                  <strong className="text-white">{confirmedPledge.timeSlot}</strong>
                </div>
              </div>

              <div className="border-t border-emerald-800/80 pt-2">
                <span className="text-[10px] text-emerald-300 block">Donation Facility</span>
                <strong className="text-white">{confirmedPledge.bloodBankName}</strong>
              </div>

              <div className="bg-emerald-950/80 p-2 rounded-xl text-[10px] text-emerald-200 border border-emerald-700/40 text-center font-medium">
                {txt.thankNotice}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setConfirmedPledge(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                {txt.printSlip}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
