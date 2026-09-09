import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Printer,
  X,
  Trash2,
  User,
  Navigation
} from 'lucide-react';
import { getAmbulanceRequests, saveAmbulanceRequest, cancelAmbulanceRequest } from '../utils/authStorage';

/**
 * Ambulance Booking System
 * Features:
 * 1. Emergency type quick-tiles (Cardiac, Trauma, Maternity, Stroke, Respiratory, Other).
 * 2. Ambulance type selector: BLS / ALS / Patient Transport.
 * 3. Patient form pre-filled from currentUser profile.
 * 4. Printable Dispatch Slip with booking ID, ETA, and 108 helpline.
 * 5. "My Requests" manager with cancel & re-print support.
 * 6. 100% pure localization for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 */
export default function AmbulanceBooking({ currentUser, appLang }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('book');
  const [selectedEmergency, setSelectedEmergency] = useState('');
  const [ambulanceType, setAmbulanceType] = useState('BLS');
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [pickupAddress, setPickupAddress] = useState('');
  const [pickupDistrict, setPickupDistrict] = useState(currentUser?.district || '');
  const [pickupState, setPickupState] = useState(currentUser?.state || '');
  const [destinationHospital, setDestinationHospital] = useState('');
  const [attendants, setAttendants] = useState('1');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [confirmedSlip, setConfirmedSlip] = useState(null);
  const [formError, setFormError] = useState('');
  const [requests, setRequests] = useState(() => getAmbulanceRequests());

  // ─── Localization Dictionary ────────────────────────────────────────────────
  const txt = {
    'or-IN': {
      tabBook: '🚑 ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ',
      tabMyRequests: '📋 ମୋର ଅନୁରୋଧ',
      pageTitle: 'ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ସେବା',
      pageSubtitle: 'NHM 108 ଆମ୍ବୁଲାନ୍ସ | BSKY ଅନ୍ତର୍ଭୁକ୍ତ | ତୁରନ୍ତ ଡିସ୍ପ୍ୟାଚ୍',
      helplineBanner: '📞 ଜାତୀୟ ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ସେବା: 108',
      emergencyTypeLabel: '1. ଜରୁରୀ ଅବସ୍ଥାର ପ୍ରକାର ବାଛନ୍ତୁ:',
      ambulanceTypeLabel: '2. ଆମ୍ବୁଲାନ୍ସ ପ୍ରକାର:',
      patientDetailsLabel: '3. ରୋଗୀ ଓ ସ୍ଥାନ ବିବରଣୀ:',
      nameLabel: 'ରୋଗୀଙ୍କ ନାମ *',
      phoneLabel: 'ମୋବାଇଲ୍ ନମ୍ବର *',
      abhaLabel: 'ABHA ଆଇଡି / ପରିଚୟ ପତ୍ର',
      ageLabel: 'ବୟସ',
      genderLabel: 'ଲିଙ୍ଗ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      pickupLabel: 'ପିକ୍‌ଅପ୍ ଠିକଣା *',
      pickupPlaceholder: 'ଘର ନମ୍ବର, ଗ୍ରାମ / ୱାର୍ଡ, ଲ୍ୟାଣ୍ଡମାର୍କ...',
      districtLabel: 'ଜିଲ୍ଲା *',
      stateLabel: 'ରାଜ୍ୟ *',
      destinationLabel: 'ଗନ୍ତବ୍ୟ ହସ୍ପିଟାଲ *',
      destinationPlaceholder: 'ନିକଟସ୍ଥ ଜିଲ୍ଲା / ମେଡ଼ିକାଲ କଲେଜ ହସ୍ପିଟାଲ...',
      attendantsLabel: 'ସ୍ୱଜନ ସଂଖ୍ୟା (ଆମ୍ବୁଲାନ୍ସରେ)',
      notesLabel: 'ଅତିରିକ୍ତ ସୂଚନା (ପ୍ୟାରାମେଡ଼ିକ ପାଇଁ)',
      notesPlaceholder: 'ଉଦା: ଡ଼ାୟବେଟିକ ରୋଗୀ, ଗର୍ଭ ୮ ମାସ, ଅଚ୍ଛ ନ ଥିବା ଆଘାତ ସ୍ଥଳ...',
      dispatchBtn: '🚨 ଆମ୍ବୁଲାନ୍ସ ଡ଼ିସ୍ପ୍ୟାଚ୍ ନିଶ୍ଚିତ କରନ୍ତୁ',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      slipTitle: 'ଆମ୍ବୁଲାନ୍ସ ଡ଼ିସ୍ପ୍ୟାଚ୍ ନିଶ୍ଚିତ ସ୍ଲିପ୍',
      slipSubtitle: 'NHM 108 ଆମ୍ବୁଲାନ୍ସ ସେବା | ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ',
      bookingId: 'ବୁକିଂ ID:',
      emergencyType: 'ଜରୁରୀ ପ୍ରକାର:',
      ambulanceTypeLbl: 'ଆମ୍ବୁଲାନ୍ସ ପ୍ରକାର:',
      vehicleNo: 'ଯାନ ସଂଖ୍ୟା:',
      paramedic: 'ପ୍ୟାରାମେଡ଼ିକ ଯୋଗାଯୋଗ:',
      estimatedEta: 'ଆନୁମାନିକ ଆଗମନ ସମୟ:',
      statusDispatched: '✓ ଡ଼ିସ୍ପ୍ୟାଚ୍ ହୋଇଛି',
      helpline108: 'ଜାତୀୟ ହେଲ୍‌ଲାଇନ୍: 108',
      printSlip: 'ଡ଼ିସ୍ପ୍ୟାଚ୍ ସ୍ଲିପ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noRequests: 'ବର୍ତ୍ତମାନ କୌଣସି ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ ନାହିଁ।',
      cancelRequestConfirm: 'ଆପଣ ଏହି ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ ବାତିଲ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
      errorFields: 'ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକ ସ୍ଥାନ ପୂରଣ କରନ୍ତୁ।',
      errorEmergency: 'ଦୟାକରି ଜରୁରୀ ଅବସ୍ଥାର ପ୍ରକାର ଚୟନ କରନ୍ତୁ।',
      blsLabel: 'BLS — ମୂଳ ଜୀବନ ସହାୟତା (NHM 108)',
      alsLabel: 'ALS — ଉନ୍ନତ ଜୀବନ ସହାୟତା (ICU ଯାନ)',
      transportLabel: 'ରୋଗୀ ପରିବହନ (ଅଜରୁରୀ ସ୍ଥାନାନ୍ତର)',
      pickupLocation: 'ପିକ୍‌ଅପ୍ ସ୍ଥାନ:',
      destination: 'ଗନ୍ତବ୍ୟ:',
      patient: 'ରୋଗୀ:',
      requestedOn: 'ଅନୁରୋଧ ତାରିଖ:',
      cancelRequest: 'ଅନୁରୋଧ ବାତିଲ'
    },
    'hi-IN': {
      tabBook: '🚑 एम्बुलेंस बुलाएं',
      tabMyRequests: '📋 मेरे अनुरोध',
      pageTitle: 'आपातकालीन एम्बुलेंस सेवा',
      pageSubtitle: 'NHM 108 एम्बुलेंस | आयुष्मान भारत | त्वरित प्रेषण',
      helplineBanner: '📞 राष्ट्रीय आपातकालीन एम्बुलेंस सेवा: 108',
      emergencyTypeLabel: '1. आपात स्थिति का प्रकार चुनें:',
      ambulanceTypeLabel: '2. एम्बुलेंस प्रकार:',
      patientDetailsLabel: '3. मरीज एवं स्थान का विवरण:',
      nameLabel: 'मरीज का नाम *',
      phoneLabel: 'मोबाइल नंबर *',
      abhaLabel: 'ABHA आईडी / पहचान पत्र',
      ageLabel: 'आयु',
      genderLabel: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      pickupLabel: 'पिकअप पता *',
      pickupPlaceholder: 'मकान नंबर, मोहल्ला / गाँव, लैंडमार्क...',
      districtLabel: 'जिला *',
      stateLabel: 'राज्य *',
      destinationLabel: 'गंतव्य अस्पताल *',
      destinationPlaceholder: 'नजदीकी जिला / मेडिकल कॉलेज अस्पताल...',
      attendantsLabel: 'साथ जाने वाले (एम्बुलेंस में)',
      notesLabel: 'अतिरिक्त जानकारी (पैरामेडिक के लिए)',
      notesPlaceholder: 'जैसे: मधुमेह का मरीज, 8 माह की गर्भवती, बेहोश चोट...',
      dispatchBtn: '🚨 एम्बुलेंस डिस्पैच कन्फर्म करें',
      cancelBtn: 'रद्द करें',
      slipTitle: 'एम्बुलेंस डिस्पैच पुष्टि पर्ची',
      slipSubtitle: 'NHM 108 एम्बुलेंस सेवा | राष्ट्रीय स्वास्थ्य मिशन',
      bookingId: 'बुकिंग ID:',
      emergencyType: 'आपात प्रकार:',
      ambulanceTypeLbl: 'एम्बुलेंस प्रकार:',
      vehicleNo: 'वाहन संख्या:',
      paramedic: 'पैरामेडिक संपर्क:',
      estimatedEta: 'अनुमानित आगमन समय:',
      statusDispatched: '✓ डिस्पैच हो गया',
      helpline108: 'राष्ट्रीय हेल्पलाइन: 108',
      printSlip: 'डिस्पैच पर्ची प्रिंट करें',
      closeBtn: 'बंद करें',
      noRequests: 'वर्तमान में कोई एम्बुलेंस अनुरोध नहीं है।',
      cancelRequestConfirm: 'क्या आप इस एम्बुलेंस अनुरोध को रद्द करना चाहते हैं?',
      errorFields: 'कृपया सभी अनिवार्य फ़ील्ड भरें।',
      errorEmergency: 'कृपया आपात स्थिति का प्रकार चुनें।',
      blsLabel: 'BLS — बेसिक लाइफ सपोर्ट (NHM 108)',
      alsLabel: 'ALS — एडवांस्ड लाइफ सपोर्ट (ICU वाहन)',
      transportLabel: 'रोगी परिवहन (गैर-आपातकालीन)',
      pickupLocation: 'पिकअप स्थान:',
      destination: 'गंतव्य:',
      patient: 'मरीज:',
      requestedOn: 'अनुरोध दिनांक:',
      cancelRequest: 'अनुरोध रद्द करें'
    },
    'en-IN': {
      tabBook: '🚑 Book Ambulance',
      tabMyRequests: '📋 My Requests',
      pageTitle: 'Emergency Ambulance Service',
      pageSubtitle: 'NHM 108 Ambulance | Ayushman Bharat | Immediate Dispatch',
      helplineBanner: '📞 National Emergency Ambulance Helpline: 108',
      emergencyTypeLabel: '1. Select Emergency Type:',
      ambulanceTypeLabel: '2. Ambulance Type:',
      patientDetailsLabel: '3. Patient & Location Details:',
      nameLabel: 'Patient Name *',
      phoneLabel: 'Mobile Number *',
      abhaLabel: 'ABHA ID / Identity Card',
      ageLabel: 'Age',
      genderLabel: 'Gender',
      male: 'Male',
      female: 'Female',
      pickupLabel: 'Pickup Address *',
      pickupPlaceholder: 'House no., Colony / Village, Landmark...',
      districtLabel: 'District *',
      stateLabel: 'State *',
      destinationLabel: 'Destination Hospital *',
      destinationPlaceholder: 'Nearest District / Medical College Hospital...',
      attendantsLabel: 'Attendants (in ambulance)',
      notesLabel: 'Additional Notes (for paramedic)',
      notesPlaceholder: 'e.g., Diabetic patient, 8-month pregnant, unconscious with head injury...',
      dispatchBtn: '🚨 Confirm Ambulance Dispatch',
      cancelBtn: 'Cancel',
      slipTitle: 'Ambulance Dispatch Confirmation Slip',
      slipSubtitle: 'NHM 108 Ambulance Service | National Health Mission',
      bookingId: 'Booking ID:',
      emergencyType: 'Emergency Type:',
      ambulanceTypeLbl: 'Ambulance Type:',
      vehicleNo: 'Vehicle No.:',
      paramedic: 'Paramedic Contact:',
      estimatedEta: 'Estimated Arrival:',
      statusDispatched: 'Dispatched',
      helpline108: 'National Helpline: 108',
      printSlip: 'Print Dispatch Slip',
      closeBtn: 'Close',
      noRequests: 'No active ambulance requests found.',
      cancelRequestConfirm: 'Are you sure you want to cancel this ambulance request?',
      errorFields: 'Please fill in all required fields.',
      errorEmergency: 'Please select an emergency type.',
      blsLabel: 'BLS — Basic Life Support (NHM 108)',
      alsLabel: 'ALS — Advanced Life Support (ICU vehicle)',
      transportLabel: 'Patient Transport (Non-emergency transfer)',
      pickupLocation: 'Pickup:',
      destination: 'Destination:',
      patient: 'Patient:',
      requestedOn: 'Requested On:',
      cancelRequest: 'Cancel Request'
    }
  };

  const t = txt[lang] || txt['en-IN'];

  // ─── Emergency Type Quick-Tiles ──────────────────────────────────────────────
  const emergencyTypes = [
    { id: 'cardiac',     icon: '🫀', label: { 'or-IN': 'ହୃଦ ଜରୁରୀ',          'hi-IN': 'हृदय आपात',       'en-IN': 'Cardiac' },             color: 'border-rose-400 bg-rose-50 text-rose-800' },
    { id: 'trauma',      icon: '🩸', label: { 'or-IN': 'ଆଘାତ / ଦୁର୍ଘଟଣା',   'hi-IN': 'ट्रॉमा / चोट',    'en-IN': 'Trauma / Accident' },    color: 'border-orange-400 bg-orange-50 text-orange-800' },
    { id: 'maternity',   icon: '🤱', label: { 'or-IN': 'ପ୍ରସବ ଜରୁରୀ',        'hi-IN': 'प्रसव आपात',      'en-IN': 'Maternity' },            color: 'border-pink-400 bg-pink-50 text-pink-800' },
    { id: 'stroke',      icon: '🧠', label: { 'or-IN': 'ଷ୍ଟ୍ରୋକ / ଅଚ୍ଛ',   'hi-IN': 'स्ट्रोक / बेहोशी','en-IN': 'Stroke / Unconscious' }, color: 'border-purple-400 bg-purple-50 text-purple-800' },
    { id: 'respiratory', icon: '🫁', label: { 'or-IN': 'ଶ୍ୱାସ ଜରୁରୀ',        'hi-IN': 'सांस की तकलीफ',   'en-IN': 'Respiratory' },          color: 'border-blue-400 bg-blue-50 text-blue-800' },
    { id: 'other',       icon: '🏥', label: { 'or-IN': 'ଅନ୍ୟ ଜରୁରୀ',         'hi-IN': 'अन्य आपात',       'en-IN': 'Other Emergency' },      color: 'border-slate-400 bg-slate-50 text-slate-800' }
  ];

  // ─── Ambulance Type Options ──────────────────────────────────────────────────
  const ambulanceTypeOptions = [
    { id: 'BLS',       icon: '🚑', badge: 'NHM 108',  label: t.blsLabel,       badgeColor: 'bg-emerald-600', selectedBorder: 'border-emerald-500 bg-emerald-50' },
    { id: 'ALS',       icon: '🚑', badge: 'ICU',      label: t.alsLabel,       badgeColor: 'bg-rose-600',    selectedBorder: 'border-rose-500 bg-rose-50' },
    { id: 'Transport', icon: '🚐', badge: 'Transfer', label: t.transportLabel, badgeColor: 'bg-slate-600',   selectedBorder: 'border-slate-400 bg-slate-50' }
  ];

  // ─── Simulated vehicle / paramedic data ─────────────────────────────────────
  const vehiclePool = ['OD-02-AM-1108', 'MH-12-AM-5566', 'UP-32-AM-7741', 'KA-04-AM-3392', 'TN-09-AM-8812'];
  const paramedics  = ['+91 97800 10800', '+91 98450 10800', '+91 94430 10800'];

  const ambBadgeColor = { BLS: 'bg-emerald-600', ALS: 'bg-rose-600', Transport: 'bg-slate-600' };

  // ─── Dispatch Handler ────────────────────────────────────────────────────────
  const handleDispatch = () => {
    setFormError('');
    if (!selectedEmergency) { setFormError(t.errorEmergency); return; }
    if (!patientName.trim() || !patientPhone.trim() || !pickupAddress.trim() || !pickupDistrict.trim() || !pickupState.trim() || !destinationHospital.trim()) {
      setFormError(t.errorFields); return;
    }
    const etaMinutes   = ambulanceType === 'ALS' ? '12–18' : '8–12';
    const vehicle      = vehiclePool[Math.floor(Math.random() * vehiclePool.length)];
    const paramedic    = paramedics[Math.floor(Math.random() * paramedics.length)];
    const emergLabel   = emergencyTypes.find(e => e.id === selectedEmergency)?.label[lang] || selectedEmergency;
    const ambOpt       = ambulanceTypeOptions.find(a => a.id === ambulanceType);

    const slip = {
      id: `AMB-${Math.floor(1000 + Math.random() * 9000)}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
      emergencyType:   emergLabel,
      ambulanceType:   ambOpt ? `${ambulanceType} — ${ambOpt.label}` : ambulanceType,
      ambulanceTypeId: ambulanceType,
      vehicleNo: vehicle,
      paramedic,
      eta: `${etaMinutes} min`,
      patient: { name: patientName, phone: patientPhone, abha: patientAbha, age: patientAge, gender: patientGender },
      pickup: `${pickupAddress}, ${pickupDistrict}, ${pickupState}`,
      destination: destinationHospital,
      attendants,
      notes: additionalNotes,
      requestedAt: new Date().toLocaleString('en-IN'),
      status: 'DISPATCHED'
    };

    const updated = saveAmbulanceRequest(slip);
    setRequests(updated);
    setConfirmedSlip(slip);
  };

  const handleCancelRequest = (id) => {
    if (!window.confirm(t.cancelRequestConfirm)) return;
    setRequests(cancelAmbulanceRequest(id));
  };

  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="mb-5 p-4 bg-gradient-to-r from-rose-600 to-orange-500 rounded-2xl text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <span className="text-2xl">🚑</span>
              {t.pageTitle}
            </h2>
            <p className="text-rose-100 text-xs mt-0.5">{t.pageSubtitle}</p>
          </div>
          <a
            href="tel:108"
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-xl border border-white/30 font-bold text-sm whitespace-nowrap"
          >
            <Phone className="w-4 h-4" />
            {t.helplineBanner}
          </a>
        </div>
      </div>

      {/* ── Sub-Tabs ────────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-5">
        {[
          { id: 'book',        label: t.tabBook },
          { id: 'my-requests', label: `${t.tabMyRequests}${requests.length > 0 ? ` (${requests.length})` : ''}` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeSubTab === tab.id
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          BOOKING FORM TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'book' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 space-y-7">

          {/* Step 1 — Emergency Type Quick-Tiles */}
          <div>
            <p className="text-sm font-bold text-slate-800 mb-3">{t.emergencyTypeLabel}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {emergencyTypes.map((et) => (
                <button
                  key={et.id}
                  onClick={() => setSelectedEmergency(et.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                    selectedEmergency === et.id
                      ? et.color + ' ring-2 ring-offset-1 ring-rose-400 scale-[1.03] shadow-md'
                      : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-2xl">{et.icon}</span>
                  <span className="text-center leading-tight text-xs">{et.label[lang]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Ambulance Type */}
          <div>
            <p className="text-sm font-bold text-slate-800 mb-3">{t.ambulanceTypeLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ambulanceTypeOptions.map((at) => (
                <button
                  key={at.id}
                  onClick={() => setAmbulanceType(at.id)}
                  className={`text-left p-3.5 rounded-xl border-2 transition-all ${
                    ambulanceType === at.id
                      ? at.selectedBorder + ' ring-2 ring-offset-1 ring-rose-400 shadow-md'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{at.icon}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${at.badgeColor}`}>
                      {at.badge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 leading-tight">{at.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 — Patient & Location Details */}
          <div>
            <p className="text-sm font-bold text-slate-800 mb-3">{t.patientDetailsLabel}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.nameLabel}</label>
                <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.phoneLabel}</label>
                <input type="tel" value={patientPhone} onChange={(e) => setPatientPhone(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.abhaLabel}</label>
                <input type="text" value={patientAbha} onChange={(e) => setPatientAbha(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t.ageLabel}</label>
                  <input type="number" min="0" max="120" value={patientAge} onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{t.genderLabel}</label>
                  <select value={patientGender} onChange={(e) => setPatientGender(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
                    <option value="Male">{t.male}</option>
                    <option value="Female">{t.female}</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.pickupLabel}</label>
                <textarea rows={2} value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder={t.pickupPlaceholder}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.districtLabel}</label>
                <input type="text" value={pickupDistrict} onChange={(e) => setPickupDistrict(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.stateLabel}</label>
                <input type="text" value={pickupState} onChange={(e) => setPickupState(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.destinationLabel}</label>
                <input type="text" value={destinationHospital} onChange={(e) => setDestinationHospital(e.target.value)}
                  placeholder={t.destinationPlaceholder}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.attendantsLabel}</label>
                <select value={attendants} onChange={(e) => setAttendants(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white">
                  {['0','1','2','3'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">{t.notesLabel}</label>
                <textarea rows={2} value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder={t.notesPlaceholder}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 resize-none" />
              </div>
            </div>
          </div>

          {/* Error Banner */}
          {formError && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-lg px-4 py-2.5 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {formError}
            </div>
          )}

          {/* Dispatch Button */}
          <button
            onClick={handleDispatch}
            className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-extrabold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Phone className="w-4 h-4" />
            {t.dispatchBtn}
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          MY REQUESTS TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'my-requests' && (
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-sm shadow-sm">
              <span className="text-4xl block mb-3">🚑</span>
              {t.noRequests}
            </div>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 bg-rose-50 border-b border-rose-100">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚑</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-600">{req.id}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${ambBadgeColor[req.ambulanceTypeId] || 'bg-slate-600'}`}>
                          {req.ambulanceTypeId}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          ✓ {req.status}
                        </span>
                      </div>
                      <p className="text-xs text-rose-700 font-semibold mt-0.5">{req.emergencyType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setConfirmedSlip(req)} title="Re-print slip"
                      className="p-2 hover:bg-white rounded-lg text-slate-500 hover:text-slate-700 transition">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleCancelRequest(req.id)} title={t.cancelRequest}
                      className="p-2 hover:bg-rose-100 rounded-lg text-slate-400 hover:text-rose-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-start gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>{t.patient}</strong> {req.patient.name} | {req.patient.phone}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>{t.pickupLocation}</strong> {req.pickup}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Navigation className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>{t.destination}</strong> {req.destination}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span><strong>{t.requestedOn}</strong> {req.requestedAt}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DISPATCH CONFIRMATION SLIP MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {confirmedSlip && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full my-4">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">{t.slipTitle}</h3>
                <p className="text-xs text-slate-500">{t.slipSubtitle}</p>
              </div>
              <button onClick={() => setConfirmedSlip(null)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">✓ {t.statusDispatched}</p>
                  <p className="text-xs text-emerald-600">{t.estimatedEta} <strong>{confirmedSlip.eta}</strong></p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {[
                  { label: t.bookingId,       value: confirmedSlip.id,             mono: true },
                  { label: t.emergencyType,    value: confirmedSlip.emergencyType,  mono: false },
                  { label: t.ambulanceTypeLbl, value: confirmedSlip.ambulanceTypeId,mono: false },
                  { label: t.vehicleNo,        value: confirmedSlip.vehicleNo,      mono: true },
                  { label: t.paramedic,        value: confirmedSlip.paramedic,      mono: true },
                  { label: t.pickupLocation,   value: confirmedSlip.pickup,         mono: false },
                  { label: t.destination,      value: confirmedSlip.destination,    mono: false }
                ].map(({ label, value, mono }) => (
                  <div key={label} className="flex justify-between items-start gap-2 pb-1.5 border-b border-slate-100 last:border-0">
                    <span className="text-xs text-slate-500 shrink-0">{label}</span>
                    <span className={`text-xs font-semibold text-slate-800 text-right ${mono ? 'font-mono' : ''}`}>{value}</span>
                  </div>
                ))}
              </div>
              <a href="tel:108"
                className="flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold py-3 rounded-xl transition text-sm">
                <Phone className="w-4 h-4" />
                {t.helpline108}
              </a>
            </div>
            <div className="flex gap-2 px-5 pb-5">
              <button onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-xl text-xs transition">
                <Printer className="w-3.5 h-3.5" />
                {t.printSlip}
              </button>
              <button onClick={() => setConfirmedSlip(null)}
                className="flex-1 border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold py-2.5 rounded-xl text-xs transition">
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
