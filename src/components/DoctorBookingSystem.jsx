import React, { useState, useEffect } from 'react';
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Building2,
  Stethoscope,
  ShieldCheck,
  CheckCircle2,
  Star,
  Search,
  Printer,
  X,
  AlertCircle,
  FileText,
  Phone,
  Video,
  Award,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { getBookedAppointments, saveAppointment, cancelAppointment } from '../utils/authStorage';

/**
 * Doctor Directory & Appointment Booking System
 * Features:
 * 1. Filterable doctor directory by specialty and facility.
 * 2. Real-time time slot selector (Morning & Afternoon shifts).
 * 3. Digital OPD token generator & confirmation modal with printable slip.
 * 4. "My Appointments" manager with cancel & re-print support.
 * 5. 100% pure localization for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 */
export default function DoctorBookingSystem({ currentUser, appLang, onBookedCountChange }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory' or 'my-bookings'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Booking Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [consultType, setConsultType] = useState('in-person'); // 'in-person' or 'tele'
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [visitReason, setVisitReason] = useState('');
  const [confirmedSlip, setConfirmedSlip] = useState(null);

  // Stored Bookings
  const [bookings, setBookings] = useState(() => getBookedAppointments());

  useEffect(() => {
    if (onBookedCountChange) {
      onBookedCountChange(bookings.length);
    }
  }, [bookings, onBookedCountChange]);

  // Comprehensive localized text dictionary
  const txt = {
    'or-IN': {
      tabDirectory: 'ଡାକ୍ତର ତାଲିକା (Doctor Directory)',
      tabMyBookings: 'ମୋର ଆପଏଣ୍ଟମେଣ୍ଟ (My Bookings)',
      searchPlaceholder: 'ଡାକ୍ତରଙ୍କ ନାମ, ବିଭାଗ କିମ୍ବା ହସ୍ପିଟାଲ୍ ଖୋଜନ୍ତୁ...',
      allSpecialties: 'ସମସ୍ତ ବିଶେଷଜ୍ଞ',
      allLocations: 'ସମସ୍ତ କେନ୍ଦ୍ର',
      specialtyGenMed: 'ସାଧାରଣ ଚିକିତ୍ସା (General Medicine)',
      specialtyObGyn: 'ମାତୃ ଓ ସ୍ତ୍ରୀ ରୋଗ (OB-GYN)',
      specialtyPediatrics: 'ଶିଶୁ ରୋଗ (Pediatrics)',
      specialtyCardio: 'ହୃଦରୋଗ (Cardiology)',
      specialtyEmergency: 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା (Emergency)',
      specialtyOrtho: 'ଅସ୍ଥିଶଲ୍ୟ (Orthopedics)',
      bookBtn: 'ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ କରନ୍ତୁ',
      experience: 'ବର୍ଷର ଅଭିଜ୍ଞତା',
      reviews: 'ସମୀକ୍ଷା',
      chamber: 'ଚାମ୍ବର / ରୁମ୍:',
      availableDays: 'ଉପଲବ୍ଧ ଦିନ:',
      bskyBeneficiary: 'BSKY / ଆୟୁଷ୍ମାନ ନିଃଶୁଳ୍କ ସେବା',
      inPerson: 'ହସ୍ପିଟାଲ୍ OPD ପରାମର୍ଶ',
      teleConsult: 'ଇ-ସଞ୍ଜୀବନୀ ଟେଲି-ପରାମର୍ଶ',
      modalTitle: 'ଡାକ୍ତରୀ ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକିଂ ଫର୍ମ',
      step1Date: '୧. ପରାମର୍ଶ ତାରିଖ ଚୟନ କରନ୍ତୁ:',
      step2Time: '୨. ସମୟ ସ୍ଲଟ୍ (Timing Slot) ଚୟନ କରନ୍ତୁ:',
      morningShift: 'ପ୍ରାତଃ ସିଫ୍ଟ୍ (Morning OPD)',
      afternoonShift: 'ଅପରାହ୍ନ ସିଫ୍ଟ୍ (Afternoon OPD)',
      step3Type: '୩. ପରାମର୍ଶ ମାଧ୍ୟମ:',
      step4Details: '୪. ରୋଗୀଙ୍କ ବିବରଣୀ:',
      nameLabel: 'ରୋଗୀଙ୍କ ନାମ *',
      phoneLabel: 'ମୋବାଇଲ୍ ନମ୍ବର *',
      abhaLabel: 'ABHA ଆଇଡି / ପରିଚୟ ପତ୍ର *',
      ageLabel: 'ବୟସ',
      genderLabel: 'ଲିଙ୍ଗ',
      male: 'ପୁରୁଷ',
      female: 'ମହିଳା',
      reasonLabel: 'ଲକ୍ଷଣ କିମ୍ବା ପରାମର୍ଶର କାରଣ',
      reasonPlaceholder: 'ଯେପରି: ୩ ଦିନ ଧରି ଜ୍ୱର, ମୁଣ୍ଡବିନ୍ଧା, ନିୟମିତ ଯାଞ୍ଚ...',
      confirmBtn: 'ଆପଏଣ୍ଟମେଣ୍ଟ ନିଶ୍ଚିତ କରନ୍ତୁ ଓ OPD ସ୍ଲିପ୍ ପାଆନ୍ତୁ',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      slipTitle: 'ଅଫିସିଆଲ୍ ହସ୍ପିଟାଲ୍ OPD ଆପଏଣ୍ଟମେଣ୍ଟ ସ୍ଲିପ୍',
      slipSubtitle: 'ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ଓ ପରିବାର କଲ୍ୟାଣ ବିଭାଗ | BSKY ସୁବିଧାପ୍ରାପ୍ତ',
      tokenNo: 'ଟୋକନ୍ ସଂଖ୍ୟା:',
      appId: 'ଆପଏଣ୍ଟମେଣ୍ଟ ID:',
      appointedDoctor: 'ନିର୍ଦ୍ଧାରିତ ଚିକିତ୍ସକ:',
      dateTime: 'ତାରିଖ ଓ ସମୟ:',
      reportingRoom: 'ରିପୋର୍ଟିଂ କାଉଣ୍ଟର / ରୁମ୍:',
      statusConfirmed: 'ନିଶ୍ଚିତ (Confirmed)',
      printSlip: 'OPD ସ୍ଲିପ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noBookings: 'ବର୍ତ୍ତମାନ କୌଣସି ବୁକ୍ ହୋଇଥିବା ଆପଏଣ୍ଟମେଣ୍ଟ ନାହିଁ।',
      cancelBookingConfirm: 'ଆପଣ ଏହି ଆପଏଣ୍ଟମେଣ୍ଟ ବାତିଲ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?',
      selectSlotNotice: 'ଦୟାକରି ଏକ ତାରିଖ ଏବଂ ସମୟ ସ୍ଲଟ୍ ଚୟନ କରନ୍ତୁ।',
      bookingSuccessAlert: 'ଆପଣଙ୍କର OPD ଆପଏଣ୍ଟମେଣ୍ଟ ସଫଳତାର ସହ ବୁକ୍ ହୋଇଛି!'
    },
    'hi-IN': {
      tabDirectory: 'डॉक्टर सूची (Doctor Directory)',
      tabMyBookings: 'मेरी बुकिंग (My Bookings)',
      searchPlaceholder: 'डॉक्टर का नाम, विशेषज्ञता अथवा अस्पताल खोजें...',
      allSpecialties: 'सभी विशेषज्ञताएं',
      allLocations: 'सभी केंद्र',
      specialtyGenMed: 'सामान्य चिकित्सा (General Medicine)',
      specialtyObGyn: 'प्रसूति एवं स्त्री रोग (OB-GYN)',
      specialtyPediatrics: 'बाल रोग विशेषज्ञ (Pediatrics)',
      specialtyCardio: 'हृदय रोग (Cardiology)',
      specialtyEmergency: 'आपातकालीन चिकित्सा (Emergency)',
      specialtyOrtho: 'अस्थि रोग (Orthopedics)',
      bookBtn: 'अपॉइंटमेंट बुक करें',
      experience: 'वर्ष का अनुभव',
      reviews: 'समीक्षाएं',
      chamber: 'कमरा / कक्ष:',
      availableDays: 'उपलब्ध दिन:',
      bskyBeneficiary: 'आयुष्मान भारत / BSKY निःशुल्क परामर्श',
      inPerson: 'अस्पताल OPD परामर्श',
      teleConsult: 'ई-संजीवनी टेली-परामर्श',
      modalTitle: 'डॉक्टर अपॉइंटमेंट बुकिंग फॉर्म',
      step1Date: '1. परामर्श की तारीख चुनें:',
      step2Time: '2. समय स्लॉट (Timing Slot) चुनें:',
      morningShift: 'सुबह की शिफ्ट (Morning OPD)',
      afternoonShift: 'दोपहर की शिफ्ट (Afternoon OPD)',
      step3Type: '3. परामर्श का प्रकार:',
      step4Details: '4. मरीज का विवरण:',
      nameLabel: 'मरीज का नाम *',
      phoneLabel: 'मोबाइल नंबर *',
      abhaLabel: 'ABHA आईडी / पहचान पत्र *',
      ageLabel: 'आयु',
      genderLabel: 'लिंग',
      male: 'पुरुष',
      female: 'महिला',
      reasonLabel: 'लक्षण अथवा परामर्श का कारण',
      reasonPlaceholder: 'जैसे: 3 दिन से बुखार, सिरदर्द, मासिक नियमित जांच...',
      confirmBtn: 'अपॉइंटमेंट कन्फर्म करें एवं OPD पर्ची प्राप्त करें',
      cancelBtn: 'रद्द करें',
      slipTitle: 'आधिकारिक अस्पताल OPD अपॉइंटमेंट पर्ची',
      slipSubtitle: 'राष्ट्रीय स्वास्थ्य मिशन | आयुष्मान भारत योजना',
      tokenNo: 'टोकन संख्या:',
      appId: 'अपॉइंटमेंट ID:',
      appointedDoctor: 'निर्धारित चिकित्सक:',
      dateTime: 'दिनांक एवं समय:',
      reportingRoom: 'रिपोर्टिंग काउंटर / कमरा:',
      statusConfirmed: 'कन्फर्म (Confirmed)',
      printSlip: 'OPD पर्ची प्रिंट करें',
      closeBtn: 'बंद करें',
      noBookings: 'वर्तमान में कोई सक्रिय अपॉइंटमेंट नहीं है।',
      cancelBookingConfirm: 'क्या आप इस अपॉइंटमेंट को रद्द करना चाहते हैं?',
      selectSlotNotice: 'कृपया परामर्श की तारीख एवं समय स्लॉट चुनें।',
      bookingSuccessAlert: 'आपकी OPD अपॉइंटमेंट सफलतापूर्वक दर्ज हो गई है!'
    },
    'en-IN': {
      tabDirectory: 'Doctor Directory',
      tabMyBookings: 'My Bookings',
      searchPlaceholder: 'Search doctor by name, specialty, or facility...',
      allSpecialties: 'All Specialties',
      allLocations: 'All Locations',
      specialtyGenMed: 'General Medicine',
      specialtyObGyn: 'Obstetrics & Gynecology',
      specialtyPediatrics: 'Pediatrics',
      specialtyCardio: 'Cardiology',
      specialtyEmergency: 'Emergency Medicine',
      specialtyOrtho: 'Orthopedics',
      bookBtn: 'Book Appointment',
      experience: 'yrs experience',
      reviews: 'reviews',
      chamber: 'Chamber / OPD Room:',
      availableDays: 'Available Days:',
      bskyBeneficiary: 'BSKY / Ayushman Zero-Cost OPD',
      inPerson: 'In-Person Hospital OPD',
      teleConsult: 'e-Sanjeevani Tele-Consult',
      modalTitle: 'Doctor Appointment Booking Form',
      step1Date: '1. Select Consultation Date:',
      step2Time: '2. Select Time Slot:',
      morningShift: 'Morning Shift (09:00 - 12:00)',
      afternoonShift: 'Afternoon Shift (14:00 - 17:00)',
      step3Type: '3. Consultation Mode:',
      step4Details: '4. Patient Demographics & Complaint:',
      nameLabel: 'Patient Full Name *',
      phoneLabel: 'Contact Mobile *',
      abhaLabel: 'ABHA ID / National Health ID *',
      ageLabel: 'Age',
      genderLabel: 'Gender',
      male: 'Male',
      female: 'Female',
      reasonLabel: 'Reason for Visit / Symptoms',
      reasonPlaceholder: 'e.g. Fever x 3 days, headache, routine hypertension follow-up...',
      confirmBtn: 'Confirm Appointment & Generate OPD Slip',
      cancelBtn: 'Cancel',
      slipTitle: 'Official Hospital OPD Appointment Slip',
      slipSubtitle: 'National Health Mission • ABDM e-Hospital Transit Protocol',
      tokenNo: 'Token No:',
      appId: 'Appointment ID:',
      appointedDoctor: 'Consulting Physician:',
      dateTime: 'Date & Time:',
      reportingRoom: 'Reporting Chamber / Counter:',
      statusConfirmed: 'Confirmed',
      printSlip: 'Print OPD Slip',
      closeBtn: 'Close',
      noBookings: 'No booked appointments found.',
      cancelBookingConfirm: 'Are you sure you want to cancel this appointment?',
      selectSlotNotice: 'Please select a date and an appointment time slot.',
      bookingSuccessAlert: 'Your OPD appointment has been successfully booked!'
    }
  }[lang] || {};

  // Standard Verified Doctors Directory
  const doctorsList = [
    {
      id: 'DOC-01',
      name: lang === 'or-IN' ? 'ଡା. ସୌମ୍ୟ ରଞ୍ଜନ ନାୟକ' : (lang === 'hi-IN' ? 'डॉ. सौम्य रंजन नायक' : 'Dr. Soumya Ranjan Nayak'),
      specialty: 'GenMed',
      specialtyLabel: txt.specialtyGenMed,
      qualifications: 'MBBS, MD (General Medicine)',
      regNo: 'OMC-2017-66431',
      facility: lang === 'or-IN' ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍, କଟକ' : (lang === 'hi-IN' ? 'एससीबी मेडिकल कॉलेज अस्पताल, कटक' : 'SCB Medical College & Hospital, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'OPD ବ୍ଲକ୍ A, କକ୍ଷ ୧୨' : (lang === 'hi-IN' ? 'OPD ब्लॉक A, कमरा 12' : 'OPD Block A, Room 12'),
      experience: 11,
      rating: 4.9,
      reviewsCount: 1240,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'SN',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'DOC-02',
      name: lang === 'or-IN' ? 'ଡା. ତନ୍ମୟୀ ମହାପାତ୍ର' : (lang === 'hi-IN' ? 'डॉ. तन्मयी महापात्र' : 'Dr. Tanmayee Mohapatra'),
      specialty: 'ObGyn',
      specialtyLabel: txt.specialtyObGyn,
      qualifications: 'MBBS, MS, DGO (Obstetrics & Gynaecology)',
      regNo: 'OMC-2015-44219',
      facility: lang === 'or-IN' ? 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍, ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'कैपिटल अस्पताल, भुवनेश्वर' : 'Capital Hospital, Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ମାତୃ ଓ ଶିଶୁ ବିଭାଗ, କକ୍ଷ ୦୪' : (lang === 'hi-IN' ? 'मातृ एवं शिशु विंग, कमरा 04' : 'MCH Wing, Room 04'),
      experience: 9,
      rating: 4.8,
      reviewsCount: 890,
      days: lang === 'or-IN' ? 'ସୋମ - ଶୁକ୍ର (Mon - Fri)' : (lang === 'hi-IN' ? 'सोम - शुक्र (Mon - Fri)' : 'Mon - Fri'),
      teleAvailable: true,
      initials: 'TM',
      color: 'from-purple-600 to-pink-700'
    },
    {
      id: 'DOC-03',
      name: lang === 'or-IN' ? 'ଡା. ବିକାଶ ଚନ୍ଦ୍ର ଜେନା' : (lang === 'hi-IN' ? 'डॉ. बिकाश चंद्र जेना' : 'Dr. Bikash Chandra Jena'),
      specialty: 'Cardio',
      specialtyLabel: txt.specialtyCardio,
      qualifications: 'MBBS, MD, DM (Cardiology)',
      regNo: 'OMC-2012-33105',
      facility: lang === 'or-IN' ? 'MKCG ମେଡିକାଲ୍ କଲେଜ୍, ବ୍ରହ୍ମପୁର' : (lang === 'hi-IN' ? 'एमकेसीजी मेडिकल कॉलेज, ब्रह्मपुर' : 'MKCG Medical College, Berhampur'),
      location: 'Berhampur',
      room: lang === 'or-IN' ? 'କାର୍ଡିଓଲୋଜି ବିଭାଗ, କକ୍ଷ ୧୮' : (lang === 'hi-IN' ? 'कार्डियोलॉजी विभाग, कमरा 18' : 'Cardiology OPD, Room 18'),
      experience: 14,
      rating: 4.9,
      reviewsCount: 1580,
      days: lang === 'or-IN' ? 'ସୋମ, ବୁଧ, ଶୁକ୍ର' : (lang === 'hi-IN' ? 'सोम, बुध, शुक्र' : 'Mon, Wed, Fri'),
      teleAvailable: false,
      initials: 'BJ',
      color: 'from-rose-600 to-red-700'
    },
    {
      id: 'DOC-04',
      name: lang === 'or-IN' ? 'ଡା. ଅନନ୍ୟା ରାୟ' : (lang === 'hi-IN' ? 'डॉ. अनन्या राय' : 'Dr. Ananya Ray'),
      specialty: 'Pediatrics',
      specialtyLabel: txt.specialtyPediatrics,
      qualifications: 'MBBS, MD (Pediatrics & Neonatology)',
      regNo: 'NMC-2018-99120',
      facility: lang === 'or-IN' ? 'AIIMS ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'एम्स भुवनेश्वर' : 'AIIMS Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ଶିଶୁ OPD ୱିଙ୍ଗ୍ C, କକ୍ଷ ୦୮' : (lang === 'hi-IN' ? 'शिशु OPD विंग C, कमरा 08' : 'Pediatric OPD Wing C, Room 08'),
      experience: 8,
      rating: 4.9,
      reviewsCount: 940,
      days: lang === 'or-IN' ? 'ମଙ୍ଗଳ - ରବି (Tue - Sun)' : (lang === 'hi-IN' ? 'मंगल - रवि (Tue - Sun)' : 'Tue - Sun'),
      teleAvailable: true,
      initials: 'AR',
      color: 'from-amber-600 to-orange-700'
    },
    {
      id: 'DOC-05',
      name: lang === 'or-IN' ? 'ଡା. ରାଜେଶ ବର୍ମା' : (lang === 'hi-IN' ? 'डॉ. राजेश वर्मा' : 'Dr. Rajesh Verma'),
      specialty: 'Emergency',
      specialtyLabel: txt.specialtyEmergency,
      qualifications: 'MBBS, MD (Emergency Medicine)',
      regNo: 'MCI-2016-77824',
      facility: lang === 'or-IN' ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ୱାର୍ଦ୍ଧା' : (lang === 'hi-IN' ? 'सिविल जिला अस्पताल, वर्धा' : 'Civil District Hospital, Wardha'),
      location: 'Wardha',
      room: lang === 'or-IN' ? 'ଟ୍ରମା ଓ ଟ୍ରାଏଜ୍ ବେ, ଡେସ୍କ ୦୧' : (lang === 'hi-IN' ? 'ट्रॉमा एवं ट्रायज बे, डेस्क 01' : 'Trauma & Triage Bay, Desk 01'),
      experience: 12,
      rating: 4.8,
      reviewsCount: 1120,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: false,
      initials: 'RV',
      color: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'DOC-06',
      name: lang === 'or-IN' ? 'ଡା. ଶୁଭଶ୍ରୀ ଦାଶ' : (lang === 'hi-IN' ? 'डॉ. शुभश्री दाश' : 'Dr. Subhashree Dash'),
      specialty: 'Ortho',
      specialtyLabel: txt.specialtyOrtho,
      qualifications: 'MBBS, MS (Orthopedic & Trauma Surgery)',
      regNo: 'OMC-2016-51208',
      facility: lang === 'or-IN' ? 'ରାଉରକେଲା ସରକାରୀ ହସ୍ପିଟାଲ୍ (RGH)' : (lang === 'hi-IN' ? 'राउरकेला सरकारी अस्पताल (RGH)' : 'Rourkela Government Hospital (RGH)'),
      location: 'Rourkela',
      room: lang === 'or-IN' ? 'ଅସ୍ଥିଶଲ୍ୟ OPD, କକ୍ଷ ୨୨' : (lang === 'hi-IN' ? 'अस्थिरोग OPD, कमरा 22' : 'Ortho OPD, Room 22'),
      experience: 10,
      rating: 4.7,
      reviewsCount: 760,
      days: lang === 'or-IN' ? 'ସୋମ, ମଙ୍ଗଳ, ଗୁରୁ, ଶୁକ୍ର' : (lang === 'hi-IN' ? 'सोम, मंगल, गुरु, शुक्र' : 'Mon, Tue, Thu, Fri'),
      teleAvailable: true,
      initials: 'SD',
      color: 'from-teal-600 to-cyan-700'
    }
  ];

  // Next 7 days generator
  const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString(lang === 'or-IN' ? 'or-IN' : (lang === 'hi-IN' ? 'hi-IN' : 'en-IN'), { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString(lang === 'or-IN' ? 'or-IN' : (lang === 'hi-IN' ? 'hi-IN' : 'en-IN'), { month: 'short' });
      days.push({ iso, label: `${dayName}, ${dayNum} ${monthName}`, isToday: i === 0 });
    }
    return days;
  };

  const availableDays = getNextDays();

  // Timing Slots
  const morningSlots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM'];
  const afternoonSlots = ['02:00 PM', '02:30 PM', '03:15 PM', '04:00 PM'];

  // Filter Doctors
  const filteredDoctors = doctorsList.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialtyLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.facility.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'ALL' || doc.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === 'ALL' || doc.location === selectedLocation;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const handleStartBooking = (doc) => {
    setSelectedDoctor(doc);
    setSelectedDate(availableDays[0].iso);
    setSelectedTimeSlot(morningSlots[1]); // Default 09:30 AM
    setPatientName(currentUser?.name || '');
    setPatientPhone(currentUser?.phone || '+91 94370 00000');
    setPatientAbha(currentUser?.staffId || 'ABHA: 91-0000-0000-0000');
    setPatientAge(currentUser?.age || '32');
    setPatientGender(currentUser?.gender || 'Male');
    setVisitReason('');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTimeSlot) {
      alert(txt.selectSlotNotice);
      return;
    }

    const newAppointment = {
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      tokenNo: `OPD-${Math.floor(10 + Math.random() * 90)}`,
      doctorName: selectedDoctor.name,
      doctorQualifications: selectedDoctor.qualifications,
      doctorRegNo: selectedDoctor.regNo,
      department: selectedDoctor.specialtyLabel,
      facility: selectedDoctor.facility,
      room: selectedDoctor.room,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      consultType: consultType === 'tele' ? txt.teleConsult : txt.inPerson,
      patientName: patientName || 'Citizen Patient',
      patientPhone: patientPhone || 'N/A',
      patientAbha: patientAbha || 'N/A',
      patientAge: patientAge || '30',
      patientGender: patientGender || 'Male',
      reason: visitReason || (lang === 'or-IN' ? 'ସାଧାରଣ ସ୍ୱାସ୍ଥ୍ୟ ଯାଞ୍ଚ' : (lang === 'hi-IN' ? 'सामान्य परामर्श' : 'Routine Consultation')),
      bookedAt: new Date().toISOString(),
      status: txt.statusConfirmed
    };

    const updated = saveAppointment(newAppointment);
    setBookings(updated);
    setConfirmedSlip(newAppointment);
    setSelectedDoctor(null);
  };

  const handleCancel = (aptId) => {
    if (window.confirm(txt.cancelBookingConfirm)) {
      const updated = cancelAppointment(aptId);
      setBookings(updated);
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-sans text-slate-800 pb-12">
      {/* Top Banner Navigation: Directory vs My Bookings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {lang === 'or-IN'
                ? 'ଡାକ୍ତର ତାଲିକା ଏବଂ OPD ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକିଂ'
                : (lang === 'hi-IN'
                ? 'डॉक्टर डायरेक्टरी एवं OPD अपॉइंटमेंट बुकिंग'
                : 'Doctor Directory & OPD Appointment System')}
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'or-IN'
              ? 'ସରକାରୀ ମେଡିକାଲ୍ କଲେଜ୍, DHH ଏବଂ CHC ର ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ସହିତ ସମୟ ସ୍ଲଟ୍ ନିର୍ଦ୍ଧାରଣ'
              : (lang === 'hi-IN'
              ? 'सरकारी मेडिकल कॉलेज एवं अस्पतालों के विशेषज्ञ चिकित्सकों के साथ समय स्लॉट बुकिंग'
              : 'Book confirmed OPD & Tele-Consultation slots with verified Government Medical Specialists')}
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            {txt.tabDirectory}
          </button>
          <button
            onClick={() => setActiveSubTab('my-bookings')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 relative ${
              activeSubTab === 'my-bookings'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            {txt.tabMyBookings}
            {bookings.length > 0 && (
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {bookings.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: DOCTOR DIRECTORY */}
      {activeSubTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={txt.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">{txt.allSpecialties}</option>
                <option value="GenMed">{txt.specialtyGenMed}</option>
                <option value="ObGyn">{txt.specialtyObGyn}</option>
                <option value="Pediatrics">{txt.specialtyPediatrics}</option>
                <option value="Cardio">{txt.specialtyCardio}</option>
                <option value="Emergency">{txt.specialtyEmergency}</option>
                <option value="Ortho">{txt.specialtyOrtho}</option>
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="ALL">{txt.allLocations}</option>
                <option value="Cuttack">Cuttack (କଟକ)</option>
                <option value="Bhubaneswar">Bhubaneswar (ଭୁବନେଶ୍ୱର)</option>
                <option value="Berhampur">Berhampur (ବ୍ରହ୍ମପୁର)</option>
                <option value="Rourkela">Rourkela (ରାଉରକେଲା)</option>
                <option value="Wardha">Wardha (वर्धा)</option>
              </select>
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Profile Header */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div
                      className={`w-13 h-13 rounded-2xl text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0 bg-gradient-to-br ${doc.color}`}
                    >
                      {doc.initials}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{doc.name}</h3>
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          RMP
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-emerald-700 mt-0.5">
                        {doc.specialtyLabel}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">{doc.qualifications}</p>
                    </div>
                  </div>

                  {/* Rating & Stats Strip */}
                  <div className="flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100 mb-3">
                    <div className="flex items-center gap-1 text-amber-600 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-400 font-normal">({doc.reviewsCount} {txt.reviews})</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      <strong>{doc.experience}</strong> {txt.experience}
                    </div>
                  </div>

                  {/* Facility & Chamber Details */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-800">{doc.facility}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{doc.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-600">{txt.availableDays} <strong>{doc.days}</strong></span>
                    </div>
                  </div>

                  {/* Benefits Tag */}
                  <div className="mb-4">
                    <span className="inline-block text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                      ✓ {txt.bskyBeneficiary}
                    </span>
                  </div>
                </div>

                {/* Book Action Button */}
                <button
                  type="button"
                  onClick={() => handleStartBooking(doc)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {txt.bookBtn}
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MY BOOKINGS LIST */}
      {activeSubTab === 'my-bookings' && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-600" />
              {txt.tabMyBookings} ({bookings.length})
            </h2>
            <span className="text-xs text-slate-400">ABDM e-Hospital Verified Tokens</span>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">{txt.noBookings}</p>
              <button
                type="button"
                onClick={() => setActiveSubTab('directory')}
                className="mt-3 text-xs font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
              >
                {txt.tabDirectory} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold uppercase">Token</span>
                      <span className="text-sm font-extrabold leading-none">{b.tokenNo.split('-')[1]}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-500">{b.id}</span>
                        <h3 className="text-sm font-bold text-slate-900">{b.doctorName}</h3>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.2 rounded-full">
                          {b.status}
                        </span>
                      </div>

                      <p className="text-xs text-emerald-700 font-medium">{b.department} • {b.facility}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" /> <strong>{b.date}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-emerald-600" /> <strong>{b.timeSlot}</strong>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {b.room}
                        </span>
                        <span className="text-slate-400">
                          Patient: <strong>{b.patientName}</strong> ({b.patientAge} yrs, {b.patientGender})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => setConfirmedSlip(b)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg flex items-center gap-1 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      {txt.printSlip}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCancel(b.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-1"
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

      {/* BOOKING MODAL WITH DATE & TIME SLOT SELECTOR */}
      {selectedDoctor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden font-sans">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">{txt.modalTitle}</h3>
              </div>
              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor Info Banner */}
            <div className="p-4 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{selectedDoctor.name}</h4>
                <p className="text-xs text-emerald-800 font-medium">
                  {selectedDoctor.specialtyLabel} • {selectedDoctor.facility}
                </p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{selectedDoctor.room}</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                BSKY OPD Free
              </span>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleConfirmBooking} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              {/* Step 1: Select Date */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">{txt.step1Date}</label>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {availableDays.map((d) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => setSelectedDate(d.iso)}
                      className={`px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-all text-center ${
                        selectedDate === d.iso
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span className="block text-[10px] text-slate-400">{d.label.split(',')[0]}</span>
                      <span className="block font-bold">{d.label.split(',')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Time Slot */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">{txt.step2Time}</label>

                {/* Morning Slots */}
                <div className="mb-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    {txt.morningShift}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {morningSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          selectedTimeSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Afternoon Slots */}
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    {txt.afternoonShift}
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {afternoonSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTimeSlot(slot)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          selectedTimeSlot === slot
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-emerald-300'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Consultation Mode */}
              <div>
                <label className="font-bold text-slate-700 block mb-1.5">{txt.step3Type}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultType('in-person')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 font-semibold transition-all ${
                      consultType === 'in-person'
                        ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-1 ring-emerald-500'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{txt.inPerson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setConsultType('tele')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 font-semibold transition-all ${
                      consultType === 'tele'
                        ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Video className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{txt.teleConsult}</span>
                  </button>
                </div>
              </div>

              {/* Step 4: Patient Details */}
              <div className="border-t border-slate-100 pt-3 space-y-2.5">
                <span className="font-bold text-slate-700 block">{txt.step4Details}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500">{txt.nameLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500">{txt.phoneLabel}</label>
                    <input
                      type="text"
                      required
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-500">{txt.abhaLabel}</label>
                    <input
                      type="text"
                      value={patientAbha}
                      onChange={(e) => setPatientAbha(e.target.value)}
                      className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs font-mono font-semibold outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-slate-500">{txt.ageLabel}</label>
                      <input
                        type="number"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs font-semibold outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500">{txt.genderLabel}</label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value)}
                        className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs font-semibold outline-none bg-white"
                      >
                        <option value="Male">{txt.male}</option>
                        <option value="Female">{txt.female}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-500">{txt.reasonLabel}</label>
                  <input
                    type="text"
                    value={visitReason}
                    onChange={(e) => setVisitReason(e.target.value)}
                    placeholder={txt.reasonPlaceholder}
                    className="w-full mt-0.5 p-2 rounded-lg border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDoctor(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl"
                >
                  {txt.cancelBtn}
                </button>

                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {txt.confirmBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMED OPD APPOINTMENT SLIP MODAL */}
      {confirmedSlip && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden font-sans">
            {/* Slip Header */}
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">{txt.slipTitle}</h3>
                  <p className="text-[10px] text-slate-400">{txt.slipSubtitle}</p>
                </div>
              </div>
              <button
                onClick={() => setConfirmedSlip(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* Token & ID Banner */}
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                    {txt.tokenNo}
                  </span>
                  <span className="text-2xl font-black text-emerald-900 font-mono">
                    {confirmedSlip.tokenNo}
                  </span>
                  <p className="text-[10px] text-slate-500 font-mono">{confirmedSlip.id}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 font-bold">
                    {confirmedSlip.status}
                  </span>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-1">
                    {confirmedSlip.consultType}
                  </p>
                </div>
              </div>

              {/* Consultation Details */}
              <div className="space-y-2 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span className="text-slate-500">{txt.appointedDoctor}</span>
                  <strong className="text-slate-900">{confirmedSlip.doctorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800 font-semibold">{confirmedSlip.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Facility:</span>
                  <span className="text-slate-800 font-medium">{confirmedSlip.facility}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{txt.reportingRoom}</span>
                  <strong className="text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded font-mono">
                    {confirmedSlip.room}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{txt.dateTime}</span>
                  <strong className="text-slate-900 font-mono">
                    {confirmedSlip.date} at {confirmedSlip.timeSlot}
                  </strong>
                </div>
              </div>

              {/* Patient Demographics */}
              <div className="space-y-1.5 text-[11px] bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <strong>{confirmedSlip.patientName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Demographics:</span>
                  <span>{confirmedSlip.patientAge} yrs • {confirmedSlip.patientGender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ABHA / Reg ID:</span>
                  <span className="font-mono">{confirmedSlip.patientAbha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Chief Reason:</span>
                  <span className="text-slate-700 italic">{confirmedSlip.reason}</span>
                </div>
              </div>

              {/* Barcode & Verification Footer */}
              <div className="pt-2 flex justify-between items-end border-t border-slate-200">
                <div className="text-[10px] text-slate-400 font-mono">
                  <p className="font-bold text-slate-700">ABDM e-Hospital Queue Pass</p>
                  <p>Booked: {new Date(confirmedSlip.bookedAt).toLocaleString()}</p>
                </div>
                <div className="text-right text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-1 rounded">
                  ✓ BSKY Free Beneficiary
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setConfirmedSlip(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold"
              >
                {txt.closeBtn}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
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
