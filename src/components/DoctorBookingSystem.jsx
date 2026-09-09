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
  Trash2,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Filter,
  Sparkles,
  TrendingUp,
  ThumbsUp,
  BadgePercent,
  DollarSign,
  Check
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

  const [activeSubTab, setActiveSubTab] = useState('directory'); // 'directory', 'recommendations', or 'my-bookings'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');

  // Smart Recommendation System States
  const [recCondition, setRecCondition] = useState('ALL');
  const [recBudget, setRecBudget] = useState('ALL'); // 'ALL', 'free', 'affordable', 'private'
  const [recPriority, setRecPriority] = useState('fame'); // 'fame', 'success', 'degree', 'speed'
  const [recLocation, setRecLocation] = useState('ALL');

  // Booking Modal States
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [shiftFilter, setShiftFilter] = useState('all'); // 'all', 'early', 'morning', 'afternoon', 'evening'
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
      tabRecommendations: 'ସ୍ମାର୍ଟ ସୁପାରିଶ (Smart AI Recommender)',
      tabMyBookings: 'ମୋର ଆପଏଣ୍ଟମେଣ୍ଟ (My Bookings)',
      searchPlaceholder: 'ଡାକ୍ତରଙ୍କ ନାମ, ବିଭାଗ କିମ୍ବା ହସ୍ପିଟାଲ୍ ଖୋଜନ୍ତୁ...',
      allSpecialties: 'ସମସ୍ତ ବିଶେଷଜ୍ଞ ବିଭାଗ (All Specialties)',
      allLocations: 'ସମସ୍ତ ମେଡିକାଲ୍ କେନ୍ଦ୍ର (All Centers)',
      specialtyGenMed: 'ସାଧାରଣ ଚିକିତ୍ସା (General Medicine)',
      specialtyObGyn: 'ମାତୃ ଓ ସ୍ତ୍ରୀ ରୋଗ (OB-GYN)',
      specialtyPediatrics: 'ଶିଶୁ ରୋଗ ବିଶେଷଜ୍ଞ (Pediatrics)',
      specialtyCardio: 'ହୃଦରୋଗ ବିଶେଷଜ୍ଞ (Cardiology)',
      specialtyEmergency: 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା (Emergency & Trauma)',
      specialtyOrtho: 'ଅସ୍ଥିଶଲ୍ୟ ଚିକିତ୍ସା (Orthopedics)',
      specialtyPulmo: 'ଫୁସଫୁସ୍ ଓ ଶ୍ୱାସରୋଗ (Pulmonology & Chest)',
      specialtyDerma: 'ଚର୍ମ ରୋଗ ବିଶେଷଜ୍ଞ (Dermatology)',
      specialtyNeuro: 'ସ୍ନାୟୁ ଓ ମସ୍ତିଷ୍କ ରୋଗ (Neurology)',
      specialtyNephro: 'ବୃକ୍‌କ ଓ କିଡନୀ ରୋଗ (Nephrology & Dialysis)',
      specialtyGastro: 'ପେଟ ଓ ଯକୃତ ରୋଗ (Gastroenterology)',
      specialtyOphthal: 'ନେତ୍ର ଚିକିତ୍ସା (Ophthalmology & Eye)',
      specialtyENT: 'ନାକ, କାନ ଓ ଗଳା (ENT)',
      specialtyPsych: 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ (Psychiatry)',
      specialtyEndo: 'ମଧୁମେହ ଓ ଏଣ୍ଡୋକ୍ରାଇନ୍ (Endocrinology)',
      specialtySurgery: 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା (General Surgery)',
      specialtyOnco: 'କର୍କଟ ରୋଗ ଚିକିତ୍ସା (Oncology & Cancer)',
      specialtyDental: 'ଦନ୍ତ ଚିକିତ୍ସା (Dentistry & Oral Care)',
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
      step2Time: '୨. ସମୟ ସ୍ଲଟ୍ (Timing Slot) ଚୟନ କରନ୍ତୁ (ମୋଟ ୩୪ ସ୍ଲଟ୍):',
      shiftAll: 'ସମସ୍ତ ଶିଫ୍ଟ୍ (All 34)',
      shiftEarly: 'ପ୍ରଭାତ (Early OPD 07:30 - 09:00)',
      shiftMorning: 'ପ୍ରାତଃ ମୁଖ୍ୟ (Prime OPD 09:00 - 12:30)',
      shiftAfternoon: 'ଅପରାହ୍ନ (Afternoon OPD 13:30 - 16:30)',
      shiftEvening: 'ସାନ୍ଧ୍ୟ କ୍ଲିନିକ୍ (Evening Clinic 17:00 - 20:00)',
      earlyMorningShift: 'ପ୍ରଭାତ ସିଫ୍ଟ୍ (Early OPD 07:30 - 09:00)',
      morningShift: 'ପ୍ରାତଃ ମୁଖ୍ୟ ସିଫ୍ଟ୍ (Prime Morning OPD 09:00 - 12:30)',
      afternoonShift: 'ଅପରାହ୍ନ ସିଫ୍ଟ୍ (Afternoon OPD 13:30 - 16:30)',
      eveningShift: 'ସାନ୍ଧ୍ୟ ସ୍ୱତନ୍ତ୍ର କ୍ଲିନିକ୍ (Evening Clinic 17:00 - 20:00)',
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
      bookingSuccessAlert: 'ଆପଣଙ୍କର OPD ଆପଏଣ୍ଟମେଣ୍ଟ ସଫଳତାର ସହ ବୁକ୍ ହୋଇଛି!',
      doctorsFound: 'ଜଣ ବିଶେଷଜ୍ଞ ଚିକିତ୍ସକ ଉପଲବ୍ଧ',
      // Recommendation Engine Localization
      recTitle: 'ସ୍ମାର୍ଟ ହସ୍ପିଟାଲ୍ ଓ ବିଶେଷଜ୍ଞ ଡାକ୍ତର ସୁପାରିଶ ପ୍ରଣାଳୀ',
      recSubtitle: 'ନିର୍ଦ୍ଦିଷ୍ଟ ବିଭାଗ ପାଇଁ ପ୍ରସିଦ୍ଧ ହସ୍ପିଟାଲ୍ (ଯେପରି ନିର୍ବାଣ ଚକ୍ଷୁ ଚିକିତ୍ସାଳୟ), ବଜେଟ୍, କ୍ଲିନିକାଲ୍ ସଫଳତା ହାର ଓ ଡିଗ୍ରୀ ଆଧାରରେ ଶ୍ରେଷ୍ଠ ଚୟନ',
      recConditionLabel: '୧. ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା କିମ୍ବା ବିଭାଗ ଚୟନ କରନ୍ତୁ:',
      recBudgetLabel: '୨. ଆପଣଙ୍କ ବଜେଟ୍ ପସନ୍ଦ:',
      budgetAll: 'ସମସ୍ତ ବଜେଟ୍ (All Budgets)',
      budgetFree: 'BSKY / ଆୟୁଷ୍ମାନ ନିଃଶୁଳ୍କ (₹୦ OPD Free)',
      budgetAffordable: 'ସୁଲଭ ସରକାରୀ / ଟ୍ରଷ୍ଟ (₹୨୫୦ ରୁ କମ୍)',
      budgetPrivate: 'ବେସରକାରୀ ସୁପର-ସ୍ପେସିଆଲିଟି (₹୫୦୦+)',
      recPriorityLabel: '୩. ପ୍ରମୁଖ ପ୍ରାଥମିକତା:',
      priorityFame: 'ହସ୍ପିଟାଲ୍ ବିଶେଷଜ୍ଞ ଖ୍ୟାତି (Hospital Fame)',
      prioritySuccess: 'ସର୍ବୋଚ୍ଚ କ୍ଲିନିକାଲ୍ ସଫଳତା ହାର (Success Rate)',
      priorityDegree: 'ଡାକ୍ତରଙ୍କ ସର୍ବୋଚ୍ଚ ଡିଗ୍ରୀ (DM / MCh / Fellow)',
      prioritySpeed: 'ତୁରନ୍ତ ଉପଲବ୍ଧତା / ସର୍ବନିମ୍ନ ଅପେକ୍ଷା ସମୟ',
      recLocationLabel: '୪. ପସନ୍ଦର ସହର / କେନ୍ଦ୍ର:',
      matchScore: 'ମେଳ ଖାଉଛି (Match Score)',
      whyRecommended: 'କାହିଁକି ଏହି ହସ୍ପିଟାଲ୍ ଓ ଡାକ୍ତର ସୁପାରିଶ କରାଗଲା:',
      successRateLabel: 'କ୍ଲିନିକାଲ୍ ସଫଳତା ହାର:',
      doctorDegreeLabel: 'ଯୋଗ୍ୟତା ଓ ଡିଗ୍ରୀ:',
      hospitalFameLabel: 'ବିଭାଗୀୟ ପ୍ରସିଦ୍ଧି:',
      opdFeeLabel: 'OPD ଫିସ୍ ବର୍ଗ:',
      waitTimeLabel: 'ହାରାହାରି ଅପେକ୍ଷା:',
      bookWithDoc: 'ଏହି ବିଶେଷଜ୍ଞଙ୍କ ସହ ଆପଏଣ୍ଟମେଣ୍ଟ ବୁକ୍ କରନ୍ତୁ',
      bannerRecommenderTitle: 'ଉପଯୁକ୍ତ ହସ୍ପିଟାଲ୍ କିମ୍ବା ଡାକ୍ତର ଚୟନରେ ସାହାଯ୍ୟ ଆବଶ୍ୟକ କି?',
      bannerRecommenderBtn: 'ସ୍ମାର୍ଟ AI ସୁପାରିଶ ବ୍ୟବସ୍ଥା ଖୋଲନ୍ତୁ',
      topRecommendation: 'ଶ୍ରେଷ୍ଠ ସୁପାରିଶ (Top Ranked Match)',
      noRecFound: 'ଆପଣଙ୍କ ମାନଦଣ୍ଡ ସହିତ କୌଣସି ହସ୍ପିଟାଲ୍ ମେଳ ଖାଇଲା ନାହିଁ। ଦୟାକରି ଫିଲ୍ଟର୍ ପରିବର୍ତ୍ତନ କରନ୍ତୁ।'
    },
    'hi-IN': {
      tabDirectory: 'डॉक्टर सूची (Doctor Directory)',
      tabRecommendations: 'स्मार्ट सिफारिश (Smart AI Recommender)',
      tabMyBookings: 'मेरी बुकिंग (My Bookings)',
      searchPlaceholder: 'डॉक्टर का नाम, विशेषज्ञता अथवा अस्पताल खोजें...',
      allSpecialties: 'सभी विशेषज्ञ विभाग (All Specialties)',
      allLocations: 'सभी मेडिकल केंद्र (All Centers)',
      specialtyGenMed: 'सामान्य चिकित्सा (General Medicine)',
      specialtyObGyn: 'प्रसूति एवं स्त्री रोग (OB-GYN)',
      specialtyPediatrics: 'बाल रोग विशेषज्ञ (Pediatrics)',
      specialtyCardio: 'हृदय रोग विशेषज्ञ (Cardiology)',
      specialtyEmergency: 'आपातकालीन चिकित्सा (Emergency & Trauma)',
      specialtyOrtho: 'अस्थि एवं जोड़ रोग (Orthopedics)',
      specialtyPulmo: 'श्वसन एवं फेफड़ा रोग (Pulmonology)',
      specialtyDerma: 'त्वचा रोग विशेषज्ञ (Dermatology)',
      specialtyNeuro: 'तंत्रिका एवं मस्तिष्क रोग (Neurology)',
      specialtyNephro: 'गुर्दा एवं डायलिसिस रोग (Nephrology)',
      specialtyGastro: 'पेट एवं लिवर रोग (Gastroenterology)',
      specialtyOphthal: 'नेत्र रोग विशेषज्ञ (Ophthalmology)',
      specialtyENT: 'नाक, कान एवं गला रोग (ENT)',
      specialtyPsych: 'मानसिक स्वास्थ्य एवं मनोचिकित्सा (Psychiatry)',
      specialtyEndo: 'मधुमेह एवं अंतःस्रावी रोग (Endocrinology)',
      specialtySurgery: 'सामान्य शल्य चिकित्सा (General Surgery)',
      specialtyOnco: 'कैंसर एवं ट्यूमर चिकित्सा (Oncology)',
      specialtyDental: 'दंत एवं मुख चिकित्सा (Dentistry)',
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
      step2Time: '2. समय स्लॉट (Timing Slot) चुनें (कुल 34 स्लॉट उपलब्ध):',
      shiftAll: 'सभी शिफ्ट (All 34)',
      shiftEarly: 'प्रातः (Early OPD 07:30 - 09:00)',
      shiftMorning: 'मुख्य सुबह (Prime OPD 09:00 - 12:30)',
      shiftAfternoon: 'दोपहर (Afternoon OPD 13:30 - 16:30)',
      shiftEvening: 'शाम का क्लीनिक (Evening Clinic 17:00 - 20:00)',
      earlyMorningShift: 'प्रातः कालीन शिफ्ट (Early OPD 07:30 - 09:00)',
      morningShift: 'मुख्य सुबह की शिफ्ट (Prime Morning OPD 09:00 - 12:30)',
      afternoonShift: 'दोपहर की शिफ्ट (Afternoon OPD 13:30 - 16:30)',
      eveningShift: 'सांध्य विशेष क्लीनिक (Evening Clinic 17:00 - 20:00)',
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
      bookingSuccessAlert: 'आपकी OPD अपॉइंटमेंट सफलतापूर्वक दर्ज हो गई है!',
      doctorsFound: 'विशेषज्ञ चिकित्सक उपलब्ध',
      // Recommendation Engine Localization
      recTitle: 'स्मार्ट अस्पताल एवं विशेषज्ञ डॉक्टर सिफारिश प्रणाली',
      recSubtitle: 'विशिष्ट विभागों में प्रसिद्ध अस्पताल (जैसे निर्वाण नेत्र अस्पताल), बजट, क्लिनिकल सफलता दर एवं विशेषज्ञ डिग्री के आधार पर श्रेष्ठ सिफारिश',
      recConditionLabel: '1. अपनी स्वास्थ्य समस्या अथवा विभाग चुनें:',
      recBudgetLabel: '2. अपनी बजट प्राथमिकता:',
      budgetAll: 'सभी बजट (All Budgets)',
      budgetFree: 'आयुष्मान भारत / BSKY निःशुल्क (₹0 OPD Free)',
      budgetAffordable: 'किफायती सरकारी / ट्रस्ट (₹250 से कम)',
      budgetPrivate: 'प्राइवेट सुपर-स्पेशियलिटी (₹500+)',
      recPriorityLabel: '3. मुख्य निर्णय प्राथमिकता:',
      priorityFame: 'अस्पताल विभागीय ख्याति (Hospital Fame)',
      prioritySuccess: 'सर्वोच्च क्लिनिकल सफलता दर (Success Rate)',
      priorityDegree: 'डॉक्टर की सर्वोच्च योग्यता (DM / MCh / Fellow)',
      prioritySpeed: 'त्वरित परामर्श / न्यूनतम प्रतीक्षा समय',
      recLocationLabel: '4. पसंदीदा शहर / केंद्र:',
      matchScore: 'मैच स्कोर (Match Score)',
      whyRecommended: 'यह अस्पताल एवं डॉक्टर क्यों सर्वश्रेष्ठ हैं:',
      successRateLabel: 'क्लिनिकल सफलता दर:',
      doctorDegreeLabel: 'योग्यता एवं डिग्री:',
      hospitalFameLabel: 'विभागीय प्रतिष्ठा:',
      opdFeeLabel: 'OPD फीस वर्ग:',
      waitTimeLabel: 'औसत प्रतीक्षा:',
      bookWithDoc: 'इस अनुशंसित विशेषज्ञ के साथ अपॉइंटमेंट बुक करें',
      bannerRecommenderTitle: 'उचित अस्पताल अथवा डॉक्टर चुनने में सहायता चाहिए?',
      bannerRecommenderBtn: 'स्मार्ट AI सिफारिश प्रणाली खोलें',
      topRecommendation: 'शीर्ष अनुशंसित विकल्प (Top Ranked Match)',
      noRecFound: 'आपके मानदंडों से मेल खाने वाला कोई अस्पताल नहीं मिला। कृपया फिल्टर बदलें।'
    },
    'en-IN': {
      tabDirectory: 'Doctor Directory',
      tabRecommendations: 'Smart AI Recommender',
      tabMyBookings: 'My Bookings',
      searchPlaceholder: 'Search doctor by name, specialty, or facility...',
      allSpecialties: 'All Specialties',
      allLocations: 'All Medical Centers',
      specialtyGenMed: 'General Medicine',
      specialtyObGyn: 'Obstetrics & Gynecology',
      specialtyPediatrics: 'Pediatrics & Child Care',
      specialtyCardio: 'Cardiology & Heart Care',
      specialtyEmergency: 'Emergency Medicine & Trauma',
      specialtyOrtho: 'Orthopedics & Joint Care',
      specialtyPulmo: 'Pulmonology & Chest Medicine',
      specialtyDerma: 'Dermatology & Skin Care',
      specialtyNeuro: 'Neurology & Stroke Care',
      specialtyNephro: 'Nephrology & Dialysis',
      specialtyGastro: 'Gastroenterology & Hepatology',
      specialtyOphthal: 'Ophthalmology & Eye Care',
      specialtyENT: 'ENT / Otorhinolaryngology',
      specialtyPsych: 'Psychiatry & Behavioral Health',
      specialtyEndo: 'Endocrinology & Diabetology',
      specialtySurgery: 'General & Laparoscopic Surgery',
      specialtyOnco: 'Oncology & Cancer Care',
      specialtyDental: 'Dentistry & Maxillofacial',
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
      step2Time: '2. Select Appointment Time Slot (34 Active Slots):',
      shiftAll: 'All Shifts (34)',
      shiftEarly: 'Early (07:30 - 09:00)',
      shiftMorning: 'Prime (09:00 - 12:30)',
      shiftAfternoon: 'Afternoon (13:30 - 16:30)',
      shiftEvening: 'Evening (17:00 - 20:00)',
      earlyMorningShift: 'Early Morning OPD (07:30 - 09:00)',
      morningShift: 'Prime Morning OPD (09:00 - 12:30)',
      afternoonShift: 'Afternoon OPD (13:30 - 16:30)',
      eveningShift: 'Evening Special Clinic (17:00 - 20:00)',
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
      bookingSuccessAlert: 'Your OPD appointment has been successfully booked!',
      doctorsFound: 'specialist doctors available',
      // Recommendation Engine Localization
      recTitle: 'Smart Hospital & Specialist Recommendation Engine',
      recSubtitle: 'Department-renowned hospitals (e.g. Nirvana Eye Hospital), patient budget, clinical success rates & verified doctor credentials',
      recConditionLabel: '1. Select Medical Condition or Department:',
      recBudgetLabel: '2. Select Patient Budget Preference:',
      budgetAll: 'All Budgets',
      budgetFree: 'BSKY / Ayushman Zero-Cost (₹0 OPD)',
      budgetAffordable: 'Affordable Govt / Trust (< ₹250)',
      budgetPrivate: 'Private Super-Specialty (₹500+)',
      recPriorityLabel: '3. Primary Decision Priority:',
      priorityFame: 'Hospital Department Fame & Recognition',
      prioritySuccess: 'Highest Clinical Success Rate',
      priorityDegree: 'Doctor Highest Degree (DM / MCh / Fellow)',
      prioritySpeed: 'Fastest OPD Availability / Min Wait Time',
      recLocationLabel: '4. Preferred City / Medical Hub:',
      matchScore: 'Match Score',
      whyRecommended: 'Why this hospital & doctor is recommended:',
      successRateLabel: 'Clinical Success Rate:',
      doctorDegreeLabel: 'Doctor Credentials:',
      hospitalFameLabel: 'Department Fame:',
      opdFeeLabel: 'OPD Fee Category:',
      waitTimeLabel: 'Avg Wait Time:',
      bookWithDoc: 'Book Appointment with this Specialist',
      bannerRecommenderTitle: 'Unsure which hospital or doctor is best suited for your condition?',
      bannerRecommenderBtn: 'Open Smart AI Recommendation Engine',
      topRecommendation: 'Top Ranked Recommendation',
      noRecFound: 'No hospitals matched your exact filter combination. Please broaden your criteria.'
    }
  }[lang] || {};

  // Standard Verified Doctors Directory (Expanded to 20 Medical Specialists with Recommendation Metrics)
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
      color: 'from-emerald-600 to-teal-700',
      famousFor: lang === 'or-IN' ? 'ଜଟିଳ ରୋଗ ଚିକିତ୍ସା ଓ ସାଧାରଣ ଔଷଧ ବିଭାଗରେ ଓଡ଼ିଶାର ଶ୍ରେଷ୍ଠ ରେଫରାଲ୍ ମେଡିକାଲ୍ କଲେଜ୍' : (lang === 'hi-IN' ? 'जटिल चिकित्सा एवं सामान्य रोग विभाग में ओडिशा का शीर्ष रेफरल मेडिकल कॉलेज' : 'Apex State Referral Medical College for Critical Internal Medicine & Multisystem Care'),
      hospitalTier: 'Apex State Referral Medical College',
      successRate: 98.2,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: lang === 'or-IN' ? 'BSKY / ସରକାରୀ: ₹୦ (ନିଃଶୁଳ୍କ)' : (lang === 'hi-IN' ? 'आयुष्मान / सरकारी: ₹0 (निःशुल्क)' : 'BSKY / Govt: ₹0 (Free OPD)'),
      avgWaitTime: lang === 'or-IN' ? '୩୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '30 मिनट' : '30 mins'),
      avgWaitTimeMinutes: 30,
      awards: 'State Apex Referral Centre'
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
      color: 'from-purple-600 to-pink-700',
      famousFor: lang === 'or-IN' ? 'ଜଟିଳ ଗର୍ଭାବସ୍ଥା, ସୁରକ୍ଷିତ ପ୍ରସବ (MCH) ଓ ମାତୃ ସୁରକ୍ଷାରେ ରାଜ୍ୟର ପ୍ରମୁଖ ବିଶେଷଜ୍ଞ କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'जटिल गर्भावस्था, सुरक्षित प्रसव एवं मातृ-शिशु स्वास्थ्य का प्रमुख विशेषज्ञ केंद्र' : 'State Premier High-Risk ANC, Institutional Delivery & Maternal Emergency Hub'),
      hospitalTier: 'Premier Maternal & Child Care Centre',
      successRate: 99.1,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: lang === 'or-IN' ? 'JSSK / BSKY: ₹୦ (ସମ୍ପୂର୍ଣ୍ଣ ନିଃଶୁଳ୍କ)' : (lang === 'hi-IN' ? 'JSSK / BSKY: ₹0 (पूर्णतः निःशुल्क)' : 'JSSK / BSKY: ₹0 (100% Free)'),
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Excellence in Safe Motherhood'
    },
    {
      id: 'DOC-03',
      name: lang === 'or-IN' ? 'ଡା. ବିକାଶ ଚନ୍ଦ୍ର ଜେନା' : (lang === 'hi-IN' ? 'डॉ. बिकाश चंद्र जेना' : 'Dr. Bikash Chandra Jena'),
      specialty: 'Cardio',
      specialtyLabel: txt.specialtyCardio,
      qualifications: 'MBBS, MD, DM (Cardiology - Gold Medalist)',
      regNo: 'OMC-2012-33105',
      facility: lang === 'or-IN' ? 'MKCG ମେଡିକାଲ୍ କଲେଜ୍, ବ୍ରହ୍ମପୁର' : (lang === 'hi-IN' ? 'एमकेसीजी मेडिकल कॉलेज, ब्रह्मपुर' : 'MKCG Medical College, Berhampur'),
      location: 'Berhampur',
      room: lang === 'or-IN' ? 'କାର୍ଡିଓଲୋଜି ବିଭାଗ, କକ୍ଷ ୧୮' : (lang === 'hi-IN' ? 'कार्डियोलॉजी विभाग, कमरा 18' : 'Cardiology OPD, Room 18'),
      experience: 14,
      rating: 4.9,
      reviewsCount: 1580,
      days: lang === 'or-IN' ? 'ସୋମ, ବୁଧ, ଶୁକ୍ର (Mon, Wed, Fri)' : (lang === 'hi-IN' ? 'सोम, बुध, शुक्र (Mon, Wed, Fri)' : 'Mon, Wed, Fri'),
      teleAvailable: false,
      initials: 'BJ',
      color: 'from-rose-600 to-red-700',
      famousFor: lang === 'or-IN' ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶାର ପ୍ରମୁଖ ହୃଦରୋଗ କ୍ୟାଥ୍-ଲ୍ୟାବ୍ ଓ କାର୍ଡିଆକ୍ କେୟାର୍ ସେଣ୍ଟର' : (lang === 'hi-IN' ? 'दक्षिण ओडिशा का प्रमुख हृदय रोग कैथ लैब एवं कार्डियक केयर केंद्र' : 'Apex Southern Odisha Cardiac Science, 24x7 Cath Lab & Coronary Care'),
      hospitalTier: 'Apex Regional Medical College',
      successRate: 98.6,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: lang === 'or-IN' ? 'BSKY: ₹୦ (ନିଃଶୁଳ୍କ)' : (lang === 'hi-IN' ? 'आयुष्मान / BSKY: ₹0 (निःशुल्क)' : 'BSKY / Ayushman: ₹0 (Free)'),
      avgWaitTime: lang === 'or-IN' ? '୨୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '25 मिनट' : '25 mins'),
      avgWaitTimeMinutes: 25,
      awards: 'Top Cardiac Cath Lab in Southern Odisha'
    },
    {
      id: 'DOC-04',
      name: lang === 'or-IN' ? 'ଡା. ଅନନ୍ୟା ରାୟ' : (lang === 'hi-IN' ? 'डॉ. अनन्या राय' : 'Dr. Ananya Ray'),
      specialty: 'Pediatrics',
      specialtyLabel: txt.specialtyPediatrics,
      qualifications: 'MBBS, MD (Pediatrics), Fellowship in Neonatal Intensive Care (AIIMS)',
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
      color: 'from-amber-600 to-orange-700',
      famousFor: lang === 'or-IN' ? 'ଶିଶୁ ଆଇସିୟୁ (NICU/PICU) ଓ ଦୁର୍ଲଭ ଶିଶୁରୋଗ ପାଇଁ ଜାତୀୟ ସ୍ତରୀୟ ଶୀର୍ଷ ସଂସ୍ଥାନ' : (lang === 'hi-IN' ? 'शिशु गहन चिकित्सा (NICU/PICU) एवं दुर्लभ बाल रोगों हेतु राष्ट्रीय शीर्ष संस्थान' : 'National Apex Academic Pediatric Super-Specialty, NICU & Rare Disease Centre'),
      hospitalTier: 'National Institute of Excellence',
      successRate: 98.9,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: lang === 'or-IN' ? 'AIIMS Central: ₹୦ (ସମ୍ପୂର୍ଣ୍ଣ ନିଃଶୁଳ୍କ)' : (lang === 'hi-IN' ? 'AIIMS Central: ₹0 (पूर्णतः निःशुल्क)' : 'AIIMS Central: ₹0 (Free OPD)'),
      avgWaitTime: lang === 'or-IN' ? '୩୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '35 मिनट' : '35 mins'),
      avgWaitTimeMinutes: 35,
      awards: 'National Apex Institute of Eminence'
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
      color: 'from-blue-600 to-indigo-700',
      famousFor: lang === 'or-IN' ? '୨୪x୭ ଜରୁରୀକାଳୀନ ଟ୍ରମା ଟ୍ରାଏଜ୍ ଓ ଜୀବନ ରକ୍ଷାକାରୀ ଚିକିତ୍ସା କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? '24x7 आपातकालीन ट्रॉमा ट्रायज एवं जीवन रक्षक चिकित्सा केंद्र' : '24x7 Emergency Resuscitation, Trauma Triage & Critical Care Centre'),
      hospitalTier: 'District Hospital Trauma Hub',
      successRate: 97.5,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: '₹0 (Free Govt)',
      avgWaitTime: lang === 'or-IN' ? '୧୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '15 मिनट' : '15 mins'),
      avgWaitTimeMinutes: 15,
      awards: 'Rapid Response Trauma Unit'
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
      color: 'from-teal-600 to-cyan-700',
      famousFor: lang === 'or-IN' ? 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ପ୍ରମୁଖ ଅସ୍ଥିଶଲ୍ୟ, ଗଣ୍ଠି ପ୍ରତିରୋପଣ (Joint Replacement) ଓ ଟ୍ରମା କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'पश्चिम ओडिशा का प्रमुख अस्थिरोग, जोड़ प्रत्यारोपण एवं ट्रॉमा सेंटर' : 'Western Odisha Premier Joint Replacement, Sports Injury & Polytrauma Centre'),
      hospitalTier: 'Specialty Government Hospital',
      successRate: 97.8,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Western Odisha Ortho Centre of Excellence'
    },
    {
      id: 'DOC-07',
      name: lang === 'or-IN' ? 'ଡା. ଦେବୀ ପ୍ରସାଦ ସାହୁ' : (lang === 'hi-IN' ? 'डॉ. देबी प्रसाद साहू' : 'Dr. Debi Prasad Sahu'),
      specialty: 'Pulmo',
      specialtyLabel: txt.specialtyPulmo,
      qualifications: 'MBBS, MD (Pulmonary & Critical Care)',
      regNo: 'OMC-2014-48912',
      facility: lang === 'or-IN' ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍, କଟକ' : (lang === 'hi-IN' ? 'एससीबी मेडिकल कॉलेज अस्पताल, कटक' : 'SCB Medical College & Hospital, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'ଛାତି ଓ ଶ୍ୱାସରୋଗ OPD, କକ୍ଷ ୧୪' : (lang === 'hi-IN' ? 'वक्ष एवं फेफड़ा OPD, कमरा 14' : 'Chest & Respiratory OPD, Room 14'),
      experience: 13,
      rating: 4.9,
      reviewsCount: 1310,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'DS',
      color: 'from-cyan-600 to-blue-700',
      famousFor: lang === 'or-IN' ? 'ଫୁସଫୁସ୍, ଆଜ୍‌ମା, ବ୍ରୋଙ୍କୋସ୍କୋପି ଓ ଶ୍ୱାସରୋଗରେ ରାଜ୍ୟସ୍ତରୀୟ ମୁଖ୍ୟ କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'फेफड़े के रोग, दमा, ब्रोंकोस्कोपी एवं श्वसन चिकित्सा का राज्य स्तरीय केंद्र' : 'State Referral for Interventional Pulmonology, Bronchoscopy & Severe Asthma'),
      hospitalTier: 'Apex State Referral Medical College',
      successRate: 98.1,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୨୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '25 मिनट' : '25 mins'),
      avgWaitTimeMinutes: 25,
      awards: 'Pulmonary Care Excellence'
    },
    {
      id: 'DOC-08',
      name: lang === 'or-IN' ? 'ଡା. ସ୍ନେହଲତା ପଣ୍ଡା' : (lang === 'hi-IN' ? 'डॉ. स्नेहलता पंडा' : 'Dr. Snehalata Panda'),
      specialty: 'Derma',
      specialtyLabel: txt.specialtyDerma,
      qualifications: 'MBBS, MD (Dermatology, Venereology & Leprosy)',
      regNo: 'OMC-2018-72315',
      facility: lang === 'or-IN' ? 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍, ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'कैपिटल अस्पताल, भुवनेश्वर' : 'Capital Hospital, Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ଚର୍ମ ରୋଗ OPD, କକ୍ଷ ୦୭' : (lang === 'hi-IN' ? 'त्वचा रोग OPD, कमरा 07' : 'Dermatology OPD, Room 07'),
      experience: 7,
      rating: 4.8,
      reviewsCount: 680,
      days: lang === 'or-IN' ? 'ସୋମ - ଶୁକ୍ର (Mon - Fri)' : (lang === 'hi-IN' ? 'सोम - शुक्र (Mon - Fri)' : 'Mon - Fri'),
      teleAvailable: true,
      initials: 'SP',
      color: 'from-pink-600 to-rose-700',
      famousFor: lang === 'or-IN' ? 'ଚର୍ମ ରୋଗ, ଆଲର୍ଜି ଓ ଲେଜର ଫୋଟୋଥେରାପି ପାଇଁ ରାଜ୍ୟର ପ୍ରମୁଖ ଓପିଡି କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'त्वचा रोग, एलर्जी एवं फोटोथेरेपी हेतु प्रमुख विशेषज्ञ OPD केंद्र' : 'Comprehensive Clinical Dermatology, Allergies & Phototherapy Unit'),
      hospitalTier: 'Premier State Hospital',
      successRate: 98.4,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୧୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '15 मिनट' : '15 mins'),
      avgWaitTimeMinutes: 15,
      awards: 'Clinical Dermatology Gold Star'
    },
    {
      id: 'DOC-09',
      name: lang === 'or-IN' ? 'ଡା. ସତ୍ୟବ୍ରତ ମିଶ୍ର' : (lang === 'hi-IN' ? 'डॉ. सत्यव्रत मिश्र' : 'Dr. Satyabrata Mishra'),
      specialty: 'Neuro',
      specialtyLabel: txt.specialtyNeuro,
      qualifications: 'MBBS, MD, DM (Neurology - AIIMS Delhi)',
      regNo: 'NMC-2011-29401',
      facility: lang === 'or-IN' ? 'AIIMS ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'एम्स भुवनेश्वर' : 'AIIMS Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ନ୍ୟୁରୋଲୋଜି ସେଣ୍ଟର, କକ୍ଷ ୨୫' : (lang === 'hi-IN' ? 'न्यूरोलॉजी सेंटर, कमरा 25' : 'Neurology Center, Room 25'),
      experience: 16,
      rating: 4.9,
      reviewsCount: 1620,
      days: lang === 'or-IN' ? 'ମଙ୍ଗଳ, ଗୁରୁ, ଶନି (Tue, Thu, Sat)' : (lang === 'hi-IN' ? 'मंगल, गुरु, शनि (Tue, Thu, Sat)' : 'Tue, Thu, Sat'),
      teleAvailable: true,
      initials: 'SM',
      color: 'from-indigo-600 to-violet-700',
      famousFor: lang === 'or-IN' ? 'ଷ୍ଟ୍ରୋକ୍, ମସ୍ତିଷ୍କ ସ୍ନାୟୁ ଓ ଜଟିଳ ନ୍ୟୁରୋଲୋଜି ପାଇଁ ଜାତୀୟ ସ୍ତରୀୟ ଏକ ନମ୍ବର ସଂସ୍ଥାନ' : (lang === 'hi-IN' ? 'स्ट्रोक, मस्तिष्क तंत्रिका एवं जटिल न्यूरोलॉजी हेतु राष्ट्रीय शीर्ष संस्थान' : 'National Apex Stroke, Neuromuscular & Comprehensive Epilepsy Centre'),
      hospitalTier: 'National Institute of Excellence',
      successRate: 98.8,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'AIIMS Central: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୩୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '35 मिनट' : '35 mins'),
      avgWaitTimeMinutes: 35,
      awards: 'Apex Neurosciences Research Centre'
    },
    {
      id: 'DOC-10',
      name: lang === 'or-IN' ? 'ଡା. ଅରୁଣ କୁମାର ପାଣିଗ୍ରାହୀ' : (lang === 'hi-IN' ? 'डॉ. अरुण कुमार पाणिग्राही' : 'Dr. Arun Kumar Panigrahi'),
      specialty: 'Nephro',
      specialtyLabel: txt.specialtyNephro,
      qualifications: 'MBBS, MD, DM (Nephrology & Renal Transplant)',
      regNo: 'OMC-2013-39870',
      facility: lang === 'or-IN' ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍, କଟକ' : (lang === 'hi-IN' ? 'एससीबी मेडिकल कॉलेज, कटक' : 'SCB Medical College, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'ଡାଏଲିସିସ୍ ଓ କିଡନୀ ବିଭାଗ, କକ୍ଷ ୦୯' : (lang === 'hi-IN' ? 'डायलिसिस एवं गुर्दा विभाग, कमरा 09' : 'Dialysis & Renal OPD, Room 09'),
      experience: 15,
      rating: 4.9,
      reviewsCount: 1450,
      days: lang === 'or-IN' ? 'ସୋମ - ଶୁକ୍ର (Mon - Fri)' : (lang === 'hi-IN' ? 'सोम - शुक्र (Mon - Fri)' : 'Mon - Fri'),
      teleAvailable: false,
      initials: 'AP',
      color: 'from-blue-700 to-teal-800',
      famousFor: lang === 'or-IN' ? 'ବୃକ୍‌କ ପ୍ରତିରୋପଣ (Kidney Transplant) ଓ ଡାଏଲିସିସ୍ ପାଇଁ ପୂର୍ବ ଭାରତର ଅଗ୍ରଣୀ କେନ୍ଦ୍ର (୧୫୦୦+ ସଫଳ ଅସ୍ତ୍ରୋପଚାର)' : (lang === 'hi-IN' ? 'गुर्दा प्रत्यारोपण एवं डायलिसिस हेतु पूर्वी भारत का अग्रणी केंद्र (1500+ सफल सर्जरी)' : 'Eastern India Pioneer Renal Transplant Unit (1,500+ procedures) & Apex Dialysis Centre'),
      hospitalTier: 'Apex Renal Transplant Institute',
      successRate: 98.4,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY: ₹0 Free Dialysis & OPD',
      avgWaitTime: lang === 'or-IN' ? '୩୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '30 मिनट' : '30 mins'),
      avgWaitTimeMinutes: 30,
      awards: '1500+ Successful Renal Transplants'
    },
    {
      id: 'DOC-11',
      name: lang === 'or-IN' ? 'ଡା. ମନୋରଞ୍ଜନ ମହାନ୍ତି' : (lang === 'hi-IN' ? 'डॉ. मनोरंजन महंती' : 'Dr. Manoranjan Mohanty'),
      specialty: 'Gastro',
      specialtyLabel: txt.specialtyGastro,
      qualifications: 'MBBS, MD, DM (Gastroenterology & Hepatology)',
      regNo: 'OMC-2015-46721',
      facility: lang === 'or-IN' ? 'MKCG ମେଡିକାଲ୍ କଲେଜ୍, ବ୍ରହ୍ମପୁର' : (lang === 'hi-IN' ? 'एमकेसीजी मेडिकल कॉलेज, ब्रह्मपुर' : 'MKCG Medical College, Berhampur'),
      location: 'Berhampur',
      room: lang === 'or-IN' ? 'ଏଣ୍ଡୋସ୍କୋପି ଓ ପେଟରୋଗ, କକ୍ଷ ୧୧' : (lang === 'hi-IN' ? 'एंडोस्कोपी एवं गैस्ट्रो OPD, कमरा 11' : 'Gastro & Endoscopy, Room 11'),
      experience: 11,
      rating: 4.8,
      reviewsCount: 830,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'MM',
      color: 'from-emerald-700 to-green-800',
      famousFor: lang === 'or-IN' ? 'ଏଣ୍ଡୋସ୍କୋପି, ଲିଭର୍ କ୍ଲିନିକ୍ ଓ ପେଟରୋଗ ପାଇଁ ଦକ୍ଷିଣ ଓଡ଼ିଶାର ପ୍ରମୁଖ ରେଫରାଲ୍' : (lang === 'hi-IN' ? 'एंडोस्कोपी, लिवर क्लीनिक एवं पेट रोग हेतु दक्षिण ओडिशा का प्रमुख केंद्र' : 'Southern Odisha Hub for Advanced Therapeutic Endoscopy, ERCP & Hepatology'),
      hospitalTier: 'Apex Regional Medical College',
      successRate: 97.7,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୨୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '25 मिनट' : '25 mins'),
      avgWaitTimeMinutes: 25,
      awards: 'Therapeutic Endoscopy Milestone'
    },
    {
      id: 'DOC-12',
      name: lang === 'or-IN' ? 'ଡା. ଆଶୁତୋଷ ମହାନ୍ତି' : (lang === 'hi-IN' ? 'डॉ. आशुतोष महंती' : 'Dr. Ashutosh Mohanty'),
      specialty: 'Ophthal',
      specialtyLabel: txt.specialtyOphthal,
      qualifications: 'MBBS, MS (Ophthalmology), Fellowship Vitreo-Retina & Lasik (LVPEI, Royal College UK)',
      regNo: 'OMC-2010-22108',
      facility: lang === 'or-IN' ? 'ନିର୍ବାଣ ଚକ୍ଷୁ ଚିକିତ୍ସାଳୟ ଓ ଲେଜର ସେଣ୍ଟର, ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'निर्वाण नेत्र चिकित्सालय एवं लेजर सेंटर, भुवनेश्वर' : 'Nirvana Eye Hospital & Laser Centre, Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ସୁପର-ସ୍ପେସିଆଲିଟି ରେଟିନା ଓ ଲେସିକ୍ ସୁଇଟ୍ ୦୧' : (lang === 'hi-IN' ? 'सुपर-स्पेशियलिटी रेटिना एवं लेसिक सूट 01' : 'Super-Specialty Retina & Lasik Suite 01'),
      experience: 16,
      rating: 4.9,
      reviewsCount: 2450,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'AM',
      color: 'from-teal-600 to-emerald-700',
      famousFor: lang === 'or-IN' ? 'କାଚବିନ୍ଦୁ (Blade-Free Cataract), ରେଟିନା ଲେଜର ଓ ଲେସିକ୍ ସର୍ଜରୀ ପାଇଁ ଓଡ଼ିଶାର ସବୁଠାରୁ ପ୍ରସିଦ୍ଧ ସ୍ୱତନ୍ତ୍ର ଚକ୍ଷୁ ହସ୍ପିଟାଲ୍' : (lang === 'hi-IN' ? 'ब्लेड-रहित मोतियाबिंद, रेटिना लेजर एवं लेसिक सर्जरी हेतु ओडिशा का सर्वाधिक प्रसिद्ध नेत्र अस्पताल' : 'Odisha\'s Famous Specialty Eye Hospital for Blade-Free Cataract, Vitreo-Retina & LASIK Laser Surgery'),
      hospitalTier: 'Dedicated Eye Super-Specialty Hospital',
      successRate: 99.4,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'affordable',
      bskyAvailable: true,
      opdFee: lang === 'or-IN' ? 'BSKY / ଆୟୁଷ୍ମାନ: ₹୦ (ନିଃଶୁଳ୍କ) | ସାଧାରଣ OPD: ₹୨୫୦' : (lang === 'hi-IN' ? 'आयुष्मान / BSKY: ₹0 (निःशुल्क) | सामान्य OPD: ₹250' : 'BSKY Free (₹0) | Gen OPD: ₹250'),
      avgWaitTime: lang === 'or-IN' ? '୧୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '15 मिनट' : '15 mins'),
      avgWaitTimeMinutes: 15,
      awards: 'Odisha #1 Eye Hospital Award 2024'
    },
    {
      id: 'DOC-13',
      name: lang === 'or-IN' ? 'ଡା. ସୁରେନ୍ଦ୍ର ନାଥ ଷଡ଼ଙ୍ଗୀ' : (lang === 'hi-IN' ? 'डॉ. सुरेंद्र नाथ सारंगी' : 'Dr. Surendra Nath Sarangi'),
      specialty: 'ENT',
      specialtyLabel: txt.specialtyENT,
      qualifications: 'MBBS, MS (ENT / Otorhinolaryngology)',
      regNo: 'OMC-2012-31089',
      facility: lang === 'or-IN' ? 'ଭିମସାର୍ (VIMSAR), ବୁର୍ଲା, ସମ୍ବଲପୁର' : (lang === 'hi-IN' ? 'विमसार (VIMSAR), बुर्ला, संबलपुर' : 'VIMSAR, Burla, Sambalpur'),
      location: 'Burla',
      room: lang === 'or-IN' ? 'ENT OPD କକ୍ଷ ୧୫' : (lang === 'hi-IN' ? 'ENT OPD कक्ष 15' : 'ENT OPD Room 15'),
      experience: 15,
      rating: 4.9,
      reviewsCount: 1190,
      days: lang === 'or-IN' ? 'ସୋମ, ବୁଧ, ଗୁରୁ, ଶନି' : (lang === 'hi-IN' ? 'सोम, बुध, गुरु, शनि' : 'Mon, Wed, Thu, Sat'),
      teleAvailable: true,
      initials: 'SS',
      color: 'from-amber-700 to-red-800',
      famousFor: lang === 'or-IN' ? 'କାନ ମାଇକ୍ରୋ-ସର୍ଜରୀ, ନାକ ଏଣ୍ଡୋସ୍କୋପି ଓ ଗଳାରୋଗରେ ପଶ୍ଚିମ ଓଡ଼ିଶାର ଶ୍ରେଷ୍ଠ କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'कान की माइक्रो-सर्जरी, नाक एंडोस्कोपी एवं गला रोग हेतु पश्चिम ओडिशा का शीर्ष केंद्र' : 'Western Odisha Apex Ear Micro-Surgery, Endoscopic Sinus & Throat Surgery'),
      hospitalTier: 'Apex Regional Medical College',
      successRate: 98.2,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Western ENT Referral Leadership'
    },
    {
      id: 'DOC-14',
      name: lang === 'or-IN' ? 'ଡା. ପ୍ରୀତି ସ୍ୱରୂପା ପଟ୍ଟନାୟକ' : (lang === 'hi-IN' ? 'डॉ. प्रीति स्वरूपा पटनायक' : 'Dr. Priti Swarupa Pattnaik'),
      specialty: 'Psych',
      specialtyLabel: txt.specialtyPsych,
      qualifications: 'MBBS, MD (Psychiatry & Behavioral Sciences)',
      regNo: 'OMC-2019-81045',
      facility: lang === 'or-IN' ? 'SCB ମେଡିକାଲ୍ କଲେଜ୍, କଟକ' : (lang === 'hi-IN' ? 'एससीबी मेडिकल कॉलेज, कटक' : 'SCB Medical College, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ, କକ୍ଷ ୨୧' : (lang === 'hi-IN' ? 'मानसिक स्वास्थ्य विभाग, कमरा 21' : 'Mental Health OPD, Room 21'),
      experience: 7,
      rating: 4.9,
      reviewsCount: 640,
      days: lang === 'or-IN' ? 'ସୋମ - ଶୁକ୍ର (Mon - Fri)' : (lang === 'hi-IN' ? 'सोम - शुक्र (Mon - Fri)' : 'Mon - Fri'),
      teleAvailable: true,
      initials: 'PP',
      color: 'from-violet-600 to-purple-800',
      famousFor: lang === 'or-IN' ? 'ମାନସିକ ଚାପ, ଅବସାଦ ଓ କାଉନସେଲିଂରେ ରାଜ୍ୟର ଅଗ୍ରଣୀ ମନୋଚିକିତ୍ସା କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'तनाव, अवसाद एवं परामर्श हेतु राज्य का अग्रणी मानसिक स्वास्थ्य केंद्र' : 'State Apex Behavioral Health, Depression, Sleep & Cognitive Psychotherapy'),
      hospitalTier: 'Apex State Referral Medical College',
      successRate: 98.4,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Behavioral Health Distinction'
    },
    {
      id: 'DOC-15',
      name: lang === 'or-IN' ? 'ଡା. ଆଲୋକ ରଞ୍ଜନ ପ୍ରଧାନ' : (lang === 'hi-IN' ? 'डॉ. आलोक रंजन प्रधान' : 'Dr. Alok Ranjan Pradhan'),
      specialty: 'Endo',
      specialtyLabel: txt.specialtyEndo,
      qualifications: 'MBBS, MD, DM (Endocrinology & Diabetology)',
      regNo: 'OMC-2016-52771',
      facility: lang === 'or-IN' ? 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍, ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'कैपिटल अस्पताल, भुवनेश्वर' : 'Capital Hospital, Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ମଧୁମେହ କ୍ଲିନିକ୍, କକ୍ଷ ୦୫' : (lang === 'hi-IN' ? 'मधुमेह क्लीनिक, कमरा 05' : 'Diabetic Clinic, Room 05'),
      experience: 10,
      rating: 4.8,
      reviewsCount: 950,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'AP',
      color: 'from-sky-600 to-indigo-700',
      famousFor: lang === 'or-IN' ? 'ଡାଇବେଟିସ୍, ଥାଇରଏଡ୍ ଓ ହରମୋନ୍ ରୋଗ ନିୟନ୍ତ୍ରଣରେ ରାଜଧାନୀର ପ୍ରମୁଖ ସେଣ୍ଟର' : (lang === 'hi-IN' ? 'मधुमेह, थायरॉइड एवं हार्मोन रोगों के नियंत्रण हेतु राजधानी का प्रमुख केंद्र' : 'Comprehensive Diabetic Foot, Thyroid Disorders & Endocrine Metabolic Clinic'),
      hospitalTier: 'Premier State Hospital',
      successRate: 98.5,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Diabetes Free Odisha Initiative'
    },
    {
      id: 'DOC-16',
      name: lang === 'or-IN' ? 'ଡା. ପ୍ରଦୀପ କୁମାର ବେହେରା' : (lang === 'hi-IN' ? 'डॉ. प्रदीप कुमार बेहेरा' : 'Dr. Pradeep Kumar Behera'),
      specialty: 'Surgery',
      specialtyLabel: txt.specialtySurgery,
      qualifications: 'MBBS, MS (General & Laparoscopic Surgery)',
      regNo: 'OMC-2014-41120',
      facility: lang === 'or-IN' ? 'SLN ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍, କୋରାପୁଟ' : (lang === 'hi-IN' ? 'एसएलएन मेडिकल कॉलेज अस्पताल, कोरापुट' : 'SLN Medical College & Hospital, Koraput'),
      location: 'Koraput',
      room: lang === 'or-IN' ? 'ସର୍ଜିକାଲ୍ OPD କକ୍ଷ ୧୦' : (lang === 'hi-IN' ? 'सर्जिकल OPD कमरा 10' : 'Surgical OPD Room 10'),
      experience: 12,
      rating: 4.7,
      reviewsCount: 780,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: false,
      initials: 'PB',
      color: 'from-emerald-800 to-teal-900',
      famousFor: lang === 'or-IN' ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶାରେ ଲାପାରୋସ୍କୋପିକ୍ ଶଲ୍ୟ ଚିକିତ୍ସା ଓ ହର୍ଣ୍ଣିଆ ଅସ୍ତ୍ରୋପଚାର କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'दक्षिण ओडिशा में लेप्रोस्कोपिक शल्य चिकित्सा एवं हर्निया सर्जरी का प्रमुख केंद्र' : 'Southern Tribal Belt Advanced Laparoscopic, Gallbladder & General Surgery'),
      hospitalTier: 'Government Medical College Hospital',
      successRate: 97.4,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୨୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '20 मिनट' : '20 mins'),
      avgWaitTimeMinutes: 20,
      awards: 'Tribal Healthcare Surgical Milestone'
    },
    {
      id: 'DOC-17',
      name: lang === 'or-IN' ? 'ଡା. ମମତା ପତି' : (lang === 'hi-IN' ? 'डॉ. ममता पति' : 'Dr. Mamata Pati'),
      specialty: 'Onco',
      specialtyLabel: txt.specialtyOnco,
      qualifications: 'MBBS, MD (Radiation Oncology), Fellowship Tata Memorial Centre Mumbai',
      regNo: 'OMC-2013-37651',
      facility: lang === 'or-IN' ? 'ଆଚାର୍ଯ୍ୟ ହରିହର କର୍କଟ କେନ୍ଦ୍ର (AHPGIC), କଟକ' : (lang === 'hi-IN' ? 'आचार्य हरिहर कैंसर संस्थान (AHPGIC), कटक' : 'Acharya Harihar Post Graduate Institute of Cancer, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'ଅଙ୍କୋଲୋଜି OPD କକ୍ଷ ୦୬' : (lang === 'hi-IN' ? 'ऑन्कोलॉजी OPD कमरा 06' : 'Oncology OPD Room 06'),
      experience: 14,
      rating: 4.9,
      reviewsCount: 1390,
      days: lang === 'or-IN' ? 'ସୋମ - ଶୁକ୍ର (Mon - Fri)' : (lang === 'hi-IN' ? 'सोम - शुक्र (Mon - Fri)' : 'Mon - Fri'),
      teleAvailable: true,
      initials: 'MP',
      color: 'from-rose-700 to-pink-800',
      famousFor: lang === 'or-IN' ? 'କର୍କଟ ଚିକିତ୍ସା, ରେଡିଏସନ୍ ଓ କେମୋଥେରାପିରେ ପୂର୍ବ ଭାରତର ପ୍ରସିଦ୍ଧ ସରକାରୀ ସ୍ୱୟଂଶାସିତ କର୍କଟ ପ୍ରତିଷ୍ଠାନ' : (lang === 'hi-IN' ? 'कैंसर चिकित्सा, रेडिएशन एवं कीमोथेरेपी हेतु पूर्वी भारत का प्रसिद्ध सरकारी कैंसर संस्थान' : 'Regional Autonomous Cancer Institute for Advanced Radiotherapy & Medical Oncology'),
      hospitalTier: 'Apex Autonomous Regional Cancer Centre',
      successRate: 96.8,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'BSKY Free Cancer Care (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୩୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '30 मिनट' : '30 mins'),
      avgWaitTimeMinutes: 30,
      awards: 'Apex Cancer Institute of Odisha'
    },
    {
      id: 'DOC-18',
      name: lang === 'or-IN' ? 'ଡା. ହରପ୍ରସାଦ ତ୍ରିପାଠୀ' : (lang === 'hi-IN' ? 'डॉ. हरप्रसाद त्रिपाठी' : 'Dr. Haraprasad Tripathy'),
      specialty: 'Dental',
      specialtyLabel: txt.specialtyDental,
      qualifications: 'BDS, MDS (Oral & Maxillofacial Surgery)',
      regNo: 'ODC-2016-19402',
      facility: lang === 'or-IN' ? 'SCB ଡେଣ୍ଟାଲ୍ କଲେଜ୍, କଟକ' : (lang === 'hi-IN' ? 'एससीबी डेंटल कॉलेज, कटक' : 'SCB Dental College, Cuttack'),
      location: 'Cuttack',
      room: lang === 'or-IN' ? 'ଦନ୍ତ ଚିକିତ୍ସା କକ୍ଷ ୦୨' : (lang === 'hi-IN' ? 'दंत चिकित्सा कमरा 02' : 'Dental OPD Room 02'),
      experience: 9,
      rating: 4.8,
      reviewsCount: 810,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: false,
      initials: 'HT',
      color: 'from-teal-600 to-emerald-700',
      famousFor: lang === 'or-IN' ? 'ମୁଖ-ମଣ୍ଡଳ ଶଲ୍ୟ ଚିକିତ୍ସା (Maxillofacial) ଓ ଦନ୍ତ ପ୍ରତିରୋପଣରେ ଓଡ଼ିଶାର ଏକମାତ୍ର ସରକାରୀ ଡେଣ୍ଟାଲ୍ ବିଶ୍ୱବିଦ୍ୟାଳୟ' : (lang === 'hi-IN' ? 'मुख-मंडल शल्य चिकित्सा एवं दंत प्रत्यारोपण में ओडिशा का एकमात्र सरकारी डेंटल कॉलेज' : 'Odisha\'s Only University Maxillofacial Trauma, Dental Implant & Oral Surgery Hub'),
      hospitalTier: 'Apex University Dental College',
      successRate: 98.5,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୧୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '15 मिनट' : '15 mins'),
      avgWaitTimeMinutes: 15,
      awards: 'Premier Oral & Maxillofacial Centre'
    },
    {
      id: 'DOC-19',
      name: lang === 'or-IN' ? 'ଡା. ଜ୍ୟୋତି ରଞ୍ଜନ ପରିଡ଼ା' : (lang === 'hi-IN' ? 'डॉ. ज्योति रंजन परिड़ा' : 'Dr. Jyoti Ranjan Parida'),
      specialty: 'Ortho',
      specialtyLabel: txt.specialtyOrtho,
      qualifications: 'MBBS, MD, DM (Clinical Immunology & Rheumatology)',
      regNo: 'NMC-2010-21894',
      facility: lang === 'or-IN' ? 'AIIMS ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'एम्स भुवनेश्वर' : 'AIIMS Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ଗଣ୍ଠିବାତ ଓ ଆର୍ଥ୍ରାଇଟିସ୍ OPD, କକ୍ଷ ୧୯' : (lang === 'hi-IN' ? 'संधिवात एवं आर्थराइटिस OPD, कमरा 19' : 'Rheumatology & Arthritis OPD, Room 19'),
      experience: 17,
      rating: 4.9,
      reviewsCount: 1750,
      days: lang === 'or-IN' ? 'ସୋମ, ବୁଧ, ଶୁକ୍ର (Mon, Wed, Fri)' : (lang === 'hi-IN' ? 'सोम, बुध, शुक्र (Mon, Wed, Fri)' : 'Mon, Wed, Fri'),
      teleAvailable: true,
      initials: 'JP',
      color: 'from-orange-600 to-amber-700',
      famousFor: lang === 'or-IN' ? 'ଗଣ୍ଠିବାତ, ଲୁପସ୍ ଓ ଅଟୋ-ଇମ୍ୟୁନ୍ ରୋଗ ପାଇଁ ଜାତୀୟ ସ୍ତରୀୟ ଇମ୍ୟୁନୋଲୋଜି କେନ୍ଦ୍ର' : (lang === 'hi-IN' ? 'संधिवात, ल्यूपस एवं ऑटो-इम्यून रोगों हेतु राष्ट्रीय स्तर का इम्यूनोलॉजी केंद्र' : 'National Clinical Immunology & Advanced Biologic Therapy for Rheumatoid Arthritis'),
      hospitalTier: 'National Institute of Excellence',
      successRate: 98.6,
      doctorDegreeLevel: 'DM/MCh/Fellow',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'AIIMS Central: ₹0 Free',
      avgWaitTime: lang === 'or-IN' ? '୩୦ ମିନିଟ୍' : (lang === 'hi-IN' ? '30 मिनट' : '30 mins'),
      avgWaitTimeMinutes: 30,
      awards: 'National Immunology Excellence'
    },
    {
      id: 'DOC-20',
      name: lang === 'or-IN' ? 'ଡା. ନଳିନୀ କାନ୍ତ ମହାନ୍ତି' : (lang === 'hi-IN' ? 'डॉ. नलिनी कांत महंती' : 'Dr. Nalini Kanta Mohanty'),
      specialty: 'GenMed',
      specialtyLabel: txt.specialtyGenMed,
      qualifications: 'MBBS, MD (Internal & Geriatric Medicine)',
      regNo: 'OMC-2009-18342',
      facility: lang === 'or-IN' ? 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍, ଭୁବନେଶ୍ୱର' : (lang === 'hi-IN' ? 'कैपिटल अस्पताल, भुवनेश्वर' : 'Capital Hospital, Bhubaneswar'),
      location: 'Bhubaneswar',
      room: lang === 'or-IN' ? 'ବରିଷ୍ଠ ନାଗରିକ ଓ ଜେରିଆଟ୍ରିକ୍ OPD, କକ୍ଷ ୦୧' : (lang === 'hi-IN' ? 'वरिष्ठ नागरिक एवं जेरियाट्रिक OPD, कमरा 01' : 'Senior Citizen & Geriatric OPD, Room 01'),
      experience: 20,
      rating: 4.9,
      reviewsCount: 2100,
      days: lang === 'or-IN' ? 'ସୋମ - ଶନି (Mon - Sat)' : (lang === 'hi-IN' ? 'सोम - शनि (Mon - Sat)' : 'Mon - Sat'),
      teleAvailable: true,
      initials: 'NM',
      color: 'from-slate-700 to-emerald-800',
      famousFor: lang === 'or-IN' ? 'ବରିଷ୍ଠ ନାଗରିକଙ୍କ ବହୁବିଧ ବାର୍ଦ୍ଧକ୍ୟଜନିତ ରୋଗ ଚିକିତ୍ସାରେ ରାଜ୍ୟର ସ୍ୱତନ୍ତ୍ର ଜେରିଆଟ୍ରିକ୍ ୟୁନିଟ୍' : (lang === 'hi-IN' ? 'वरिष्ठ नागरिकों की बहुविध वृद्धावस्था जनित बीमारियों हेतु राज्य की समर्पित जेरियाट्रिक यूनिट' : 'State Dedicated Comprehensive Senior Citizen Geriatric & Multi-Morbidity Clinic'),
      hospitalTier: 'Premier State Hospital',
      successRate: 98.9,
      doctorDegreeLevel: 'MD/MS',
      budgetTier: 'free',
      bskyAvailable: true,
      opdFee: 'Govt Free (₹0)',
      avgWaitTime: lang === 'or-IN' ? '୧୫ ମିନିଟ୍' : (lang === 'hi-IN' ? '15 मिनट' : '15 mins'),
      avgWaitTimeMinutes: 15,
      awards: 'Elderly Care Lifetime Citation'
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

  // Comprehensive Timing Slots Organized in 4 Distinct Shifts (Total 34 Timing Slots)
  const earlyMorningSlots = [
    '07:30 AM', '07:50 AM', '08:10 AM', '08:30 AM', '08:50 AM'
  ];

  const morningPrimeSlots = [
    '09:00 AM', '09:20 AM', '09:40 AM', '10:00 AM', '10:20 AM',
    '10:40 AM', '11:00 AM', '11:20 AM', '11:40 AM', '12:00 PM', '12:20 PM'
  ];

  const afternoonSlots = [
    '01:30 PM', '01:50 PM', '02:10 PM', '02:30 PM', '02:50 PM',
    '03:10 PM', '03:30 PM', '03:50 PM', '04:10 PM'
  ];

  const eveningSlots = [
    '05:00 PM', '05:20 PM', '05:40 PM', '06:00 PM', '06:20 PM',
    '06:40 PM', '07:00 PM', '07:20 PM', '07:40 PM'
  ];

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

  // Intelligent Hospital & Doctor Recommendation Engine
  const getRecommendations = () => {
    // 1. Initial candidates filtering
    let candidates = doctorsList.filter((doc) => {
      // Condition filter
      if (recCondition !== 'ALL' && doc.specialty !== recCondition) {
        return false;
      }
      // Location filter
      if (recLocation !== 'ALL' && doc.location !== recLocation) {
        return false;
      }
      // Budget filter
      if (recBudget === 'free' && !doc.bskyAvailable && doc.budgetTier !== 'free') {
        return false;
      }
      if (recBudget === 'affordable' && doc.budgetTier === 'private') {
        return false;
      }
      if (recBudget === 'private' && doc.budgetTier === 'free' && !doc.hospitalTier.includes('Private')) {
        return false;
      }
      return true;
    });

    // 2. Score calculation for each doctor & hospital
    const scored = candidates.map((doc) => {
      let score = 65; // Base score
      const reasons = [];

      // A. Condition relevance
      if (recCondition !== 'ALL' && doc.specialty === recCondition) {
        score += 15;
      }

      // B. Department Fame & Specialized Hospital Recognition
      if (doc.id === 'DOC-12') { // Nirvana Eye Hospital & Laser Centre
        score += 16;
        reasons.push(
          lang === 'or-IN'
            ? 'ଓଡ଼ିଶାର ଏକ ନମ୍ବର ସ୍ୱତନ୍ତ୍ର ଚକ୍ଷୁ ଚିକିତ୍ସାଳୟ (ନିର୍ବାଣ ଆଇ ହସ୍ପିଟାଲ୍) - ବ୍ଲେଡ୍-ଫ୍ରି କାଚବିନ୍ଦୁ, ରେଟିନା ଓ ଲେସିକ୍ ସର୍ଜରୀ ପାଇଁ ସର୍ବାଧିକ ପ୍ରସିଦ୍ଧ'
            : (lang === 'hi-IN'
            ? 'ओडिशा का शीर्ष प्रतिष्ठित नेत्र चिकित्सालय (निर्वाण आई हॉस्पिटल) - ब्लेड-फ्री मोतियाबिंद, रेटिना एवं लेसिक सर्जरी हेतु प्रसिद्ध'
            : 'Odisha\'s premier specialty eye hospital (Nirvana Eye Hospital) - Renowned for blade-free cataract, retina & LASIK laser surgery')
        );
      } else if (doc.facility.includes('SCB') || doc.facility.includes('AIIMS') || doc.facility.includes('AHPGIC')) {
        score += 12;
        reasons.push(
          lang === 'or-IN'
            ? `ରାଜ୍ୟର ଶୀର୍ଷ ସରକାରୀ ଆପେକ୍ସ ରେଫରାଲ୍ କେନ୍ଦ୍ର (${doc.facility.split(',')[0]})`
            : (lang === 'hi-IN'
            ? `राज्य का शीर्ष सरकारी एपेक्स रेफरल केंद्र (${doc.facility.split(',')[0]})`
            : `Premier State Apex Referral Centre (${doc.facility.split(',')[0]})`)
        );
      } else {
        score += 8;
        reasons.push(
          lang === 'or-IN'
            ? `${doc.facility} ରେ ସ୍ୱତନ୍ତ୍ର ବିଭାଗୀୟ ସୁପର-ସ୍ପେସିଆଲିଟି ସେବା ଉପଲବ୍ଧ`
            : (lang === 'hi-IN'
            ? `${doc.facility} में विशिष्ट सुपर-स्पेशियलिटी सेवाएं उपलब्ध`
            : `Recognized center for specialized care at ${doc.facility}`)
        );
      }

      // C. Clinical Success Rate
      if (doc.successRate >= 99.0) {
        score += 10;
        reasons.push(
          lang === 'or-IN'
            ? `ଅତ୍ୟନ୍ତ ଉଚ୍ଚ କ୍ଲିନିକାଲ୍ ପ୍ରକ୍ରିୟା ସଫଳତା ହାର (${doc.successRate}%) ଏବଂ ଉତ୍ତମ ପରିଣାମ`
            : (lang === 'hi-IN'
            ? `अत्यंत उच्च क्लिनिकल प्रक्रिया सफलता दर (${doc.successRate}%) एवं बेहतरीन परिणाम`
            : `Outstanding clinical procedure success rate of ${doc.successRate}%`)
        );
      } else if (doc.successRate >= 97.5) {
        score += 7;
        reasons.push(
          lang === 'or-IN'
            ? `ଉଲ୍ଲେଖନୀୟ ରୋଗୀ ଆରୋଗ୍ୟ ହାର (${doc.successRate}%)`
            : (lang === 'hi-IN'
            ? `विश्वसनीय रोगी आरोग्य दर (${doc.successRate}%)`
            : `High documented clinical success rate of ${doc.successRate}%`)
        );
      }

      // D. Doctor Qualifications & Highest Degree
      if (doc.doctorDegreeLevel === 'DM/MCh/Fellow') {
        score += 8;
        reasons.push(
          lang === 'or-IN'
            ? `ଶୀର୍ଷ ସଂସ୍ଥାନରୁ ସୁପର-ସ୍ପେସିଆଲିଟି ଡିଗ୍ରୀ / ଫେଲୋସିପ୍ (${doc.qualifications})`
            : (lang === 'hi-IN'
            ? `शीर्ष संस्थानों से सुपर-स्पेशियलिटी डिग्री / फेलोशिप (${doc.qualifications})`
            : `Premier institute Super-Specialty / Fellowship credentials (${doc.qualifications})`)
        );
      } else {
        score += 5;
        reasons.push(
          lang === 'or-IN'
            ? `ଅଭିଜ୍ଞ ମେଡିକାଲ୍ ସ୍ନାତକୋତ୍ତର ବିଶେଷଜ୍ଞ (${doc.experience}+ ବର୍ଷର କ୍ଲିନିକାଲ୍ ଅନୁଭବ)`
            : (lang === 'hi-IN'
            ? `अनुभवी मेडिकल स्नातकोत्तर विशेषज्ञ (${doc.experience}+ वर्ष का अनुभव)`
            : `Experienced specialist with ${doc.experience}+ years clinical practice`)
        );
      }

      // E. Budget Alignment
      if (doc.bskyAvailable) {
        score += 6;
        reasons.push(
          lang === 'or-IN'
            ? 'BSKY ଏବଂ ଆୟୁଷ୍ମାନ ଭାରତ କାର୍ଡଧାରୀଙ୍କ ପାଇଁ ₹୦ ରେ ସମ୍ପୂର୍ଣ୍ଣ ମାଗଣା ପରାମର୍ଶ'
            : (lang === 'hi-IN'
            ? 'आयुष्मान भारत एवं BSKY कार्डधारकों हेतु ₹0 में पूर्णतः निःशुल्क परामर्श'
            : 'Zero-cost OPD consultation covered under BSKY & Ayushman Bharat')
        );
      } else {
        reasons.push(
          lang === 'or-IN'
            ? `ସୁଲଭ ଓ ପାରଦର୍ଶୀ OPD ଫିସ୍ (${doc.opdFee})`
            : (lang === 'hi-IN'
            ? `किफायती एवं पारदर्शी OPD परामर्श शुल्क (${doc.opdFee})`
            : `Transparent OPD pricing structure (${doc.opdFee})`)
        );
      }

      // F. Priority Adjustment Bonuses
      if (recPriority === 'fame') {
        if (doc.id === 'DOC-12' || doc.hospitalTier.includes('Apex') || doc.hospitalTier.includes('Dedicated')) {
          score += 6;
        }
      } else if (recPriority === 'success') {
        if (doc.successRate >= 99.0) score += 6;
      } else if (recPriority === 'degree') {
        if (doc.doctorDegreeLevel === 'DM/MCh/Fellow') score += 6;
      } else if (recPriority === 'speed') {
        if (doc.avgWaitTimeMinutes <= 20) {
          score += 6;
          reasons.push(
            lang === 'or-IN'
              ? `ଦ୍ରୁତ OPD ସେବା: ହାରାହାରି ଅପେକ୍ଷା ସମୟ ମାତ୍ର ${doc.avgWaitTime}`
              : (lang === 'hi-IN'
              ? `त्वरित OPD सेवा: औसत प्रतीक्षा मात्र ${doc.avgWaitTime}`
              : `Fast-track OPD: Minimum average wait time of only ${doc.avgWaitTime}`)
          );
        }
      }

      // Clamp between 72% and 99%
      const finalScore = Math.min(99, Math.max(72, Math.round(score)));

      return {
        ...doc,
        matchScore: finalScore,
        reasons: reasons.slice(0, 4)
      };
    });

    // Sort by match score descending
    scored.sort((a, b) => b.matchScore - a.matchScore);
    return scored;
  };

  const recommendations = getRecommendations();

  const handleStartBooking = (doc) => {
    setSelectedDoctor(doc);
    setSelectedDate(availableDays[0].iso);
    setSelectedTimeSlot(morningPrimeSlots[1]); // Default 09:20 AM
    setShiftFilter('all');
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
              ? '୨୦ ଜଣ ବିଶେଷଜ୍ଞ ଚିକିତ୍ସକ • ୩୪ ଟି ସମୟ ସ୍ଲଟ୍ (ସକାଳ ୭:୩୦ ରୁ ରାତି ୮:୦୦) • BSKY / ଆୟୁଷ୍ମାନ ନିଃଶୁଳ୍କ ସେବା'
              : (lang === 'hi-IN'
              ? '20 विशेषज्ञ चिकित्सक • 34 समय स्लॉट (सुबह 7:30 से रात 8:00) • आयुष्मान भारत / BSKY निःशुल्क परामर्श'
              : '20 Verified Medical Specialists • 34 Daily OPD Timing Slots (07:30 AM - 08:00 PM) • BSKY / Ayushman Free')}
          </p>
        </div>

        {/* Sub-tab Pill Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-300 text-xs shadow-2xs self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setActiveSubTab('directory')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'directory'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            {txt.tabDirectory}
          </button>
          <button
            onClick={() => setActiveSubTab('recommendations')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 relative cursor-pointer ${
              activeSubTab === 'recommendations'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-emerald-800 hover:bg-emerald-50 bg-emerald-100/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            {txt.tabRecommendations}
            <span className="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.2 rounded-full font-black tracking-wider">
              AI
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('my-bookings')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 relative cursor-pointer ${
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
          {/* Smart Recommendation Prompt Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 rounded-2xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-emerald-600/40">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0 text-amber-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  {txt.bannerRecommenderTitle}
                  <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                    AI POWERED
                  </span>
                </h3>
                <p className="text-xs text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
                  {txt.recSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveSubTab('recommendations')}
              className="shrink-0 px-4 py-2.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              {txt.bannerRecommenderBtn}
              <ChevronRight className="w-4 h-4 text-slate-950" />
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
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
                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 outline-none cursor-pointer max-w-[200px] truncate"
              >
                <option value="ALL">{txt.allSpecialties}</option>
                <option value="GenMed">{txt.specialtyGenMed}</option>
                <option value="ObGyn">{txt.specialtyObGyn}</option>
                <option value="Pediatrics">{txt.specialtyPediatrics}</option>
                <option value="Cardio">{txt.specialtyCardio}</option>
                <option value="Emergency">{txt.specialtyEmergency}</option>
                <option value="Ortho">{txt.specialtyOrtho}</option>
                <option value="Pulmo">{txt.specialtyPulmo}</option>
                <option value="Derma">{txt.specialtyDerma}</option>
                <option value="Neuro">{txt.specialtyNeuro}</option>
                <option value="Nephro">{txt.specialtyNephro}</option>
                <option value="Gastro">{txt.specialtyGastro}</option>
                <option value="Ophthal">{txt.specialtyOphthal}</option>
                <option value="ENT">{txt.specialtyENT}</option>
                <option value="Psych">{txt.specialtyPsych}</option>
                <option value="Endo">{txt.specialtyEndo}</option>
                <option value="Surgery">{txt.specialtySurgery}</option>
                <option value="Onco">{txt.specialtyOnco}</option>
                <option value="Dental">{txt.specialtyDental}</option>
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
                <option value="Burla">Sambalpur / Burla (ସମ୍ବଲପୁର / ବୁର୍ଲା)</option>
                <option value="Puri">Puri (ପୁରୀ)</option>
                <option value="Koraput">Koraput (କୋରାପୁଟ)</option>
                <option value="Wardha">Wardha (वर्धा)</option>
              </select>

              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                {filteredDoctors.length} {txt.doctorsFound}
              </span>
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

      {/* SUB-TAB 2: SMART HOSPITAL & SPECIALIST RECOMMENDATIONS */}
      {activeSubTab === 'recommendations' && (
        <div className="space-y-6">
          {/* Engine Header Hero Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800/40 shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                AI Health Advisory • Clinical Matching Engine
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {txt.recTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                {txt.recSubtitle}
              </p>
            </div>
          </div>

          {/* 4-Parameter Questionnaire / Filter Panel */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Parameter 1: Medical Condition / Specialty */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                  {txt.recConditionLabel}
                </label>
                <select
                  value={recCondition}
                  onChange={(e) => setRecCondition(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">{txt.allSpecialties}</option>
                  <option value="Ophthal">{txt.specialtyOphthal} (ଚକ୍ଷୁ / Eye Care - e.g. Nirvana)</option>
                  <option value="Cardio">{txt.specialtyCardio}</option>
                  <option value="Neuro">{txt.specialtyNeuro}</option>
                  <option value="Nephro">{txt.specialtyNephro}</option>
                  <option value="Onco">{txt.specialtyOnco}</option>
                  <option value="Ortho">{txt.specialtyOrtho}</option>
                  <option value="ObGyn">{txt.specialtyObGyn}</option>
                  <option value="Pediatrics">{txt.specialtyPediatrics}</option>
                  <option value="Pulmo">{txt.specialtyPulmo}</option>
                  <option value="Gastro">{txt.specialtyGastro}</option>
                  <option value="GenMed">{txt.specialtyGenMed}</option>
                  <option value="ENT">{txt.specialtyENT}</option>
                  <option value="Derma">{txt.specialtyDerma}</option>
                  <option value="Psych">{txt.specialtyPsych}</option>
                  <option value="Endo">{txt.specialtyEndo}</option>
                  <option value="Surgery">{txt.specialtySurgery}</option>
                  <option value="Dental">{txt.specialtyDental}</option>
                  <option value="Emergency">{txt.specialtyEmergency}</option>
                </select>
              </div>

              {/* Parameter 2: Patient Budget Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {txt.recBudgetLabel}
                </label>
                <select
                  value={recBudget}
                  onChange={(e) => setRecBudget(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">{txt.budgetAll}</option>
                  <option value="free">{txt.budgetFree}</option>
                  <option value="affordable">{txt.budgetAffordable}</option>
                  <option value="private">{txt.budgetPrivate}</option>
                </select>
              </div>

              {/* Parameter 3: Primary Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  {txt.recPriorityLabel}
                </label>
                <select
                  value={recPriority}
                  onChange={(e) => setRecPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="fame">{txt.priorityFame}</option>
                  <option value="success">{txt.prioritySuccess}</option>
                  <option value="degree">{txt.priorityDegree}</option>
                  <option value="speed">{txt.prioritySpeed}</option>
                </select>
              </div>

              {/* Parameter 4: Location / City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {txt.recLocationLabel}
                </label>
                <select
                  value={recLocation}
                  onChange={(e) => setRecLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="ALL">{txt.allLocations}</option>
                  <option value="Bhubaneswar">ଭୁବନେଶ୍ୱର (Bhubaneswar)</option>
                  <option value="Cuttack">କଟକ (Cuttack)</option>
                  <option value="Burla">ବୁର୍ଲା / ସମ୍ବଲପୁର (Burla, Sambalpur)</option>
                  <option value="Berhampur">ବ୍ରହ୍ମପୁର (Berhampur)</option>
                </select>
              </div>
            </div>

            {/* Active Criteria Quick Chips */}
            <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 flex-wrap text-xs">
              <span className="text-slate-500">
                {lang === 'or-IN'
                  ? `ସର୍ବୋଚ୍ଚ ସୁପାରିଶ ପ୍ରାପ୍ତ: ${recommendations.length} ଜଣ ବିଶେଷଜ୍ଞ ଏବଂ ହସ୍ପିଟାଲ୍ ଉପଲବ୍ଧ`
                  : (lang === 'hi-IN'
                  ? `शीर्ष अनुशंसित: ${recommendations.length} विशेषज्ञ एवं अस्पताल उपलब्ध`
                  : `Top Recommendations: ${recommendations.length} specialists and hospitals found`)}
              </span>
              {(recCondition !== 'ALL' || recBudget !== 'ALL' || recLocation !== 'ALL' || recPriority !== 'fame') && (
                <button
                  type="button"
                  onClick={() => {
                    setRecCondition('ALL');
                    setRecBudget('ALL');
                    setRecPriority('fame');
                    setRecLocation('ALL');
                  }}
                  className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer"
                >
                  {lang === 'or-IN' ? 'ଫିଲ୍ଟର୍ ରିସେଟ୍ କରନ୍ତୁ' : (lang === 'hi-IN' ? 'फिल्टर रीसेट करें' : 'Reset Filters')}
                </button>
              )}
            </div>
          </div>

          {/* Recommendations Results List */}
          {recommendations.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 mb-1">{txt.noRecFound}</h3>
              <button
                type="button"
                onClick={() => {
                  setRecCondition('ALL');
                  setRecBudget('ALL');
                  setRecPriority('fame');
                  setRecLocation('ALL');
                }}
                className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                {lang === 'or-IN' ? 'ସମସ୍ତ ସୁପାରିଶ ଦେଖନ୍ତୁ' : (lang === 'hi-IN' ? 'सभी सिफारिशें देखें' : 'View All Recommendations')}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((doc, idx) => {
                const isTop = idx === 0;
                return (
                  <div
                    key={doc.id}
                    className={`rounded-2xl p-5 sm:p-6 transition-all relative ${
                      isTop
                        ? 'bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 border-2 border-emerald-500 shadow-lg ring-4 ring-emerald-500/10'
                        : 'bg-white border border-slate-200 shadow-xs hover:shadow-md'
                    }`}
                  >
                    {/* Top Ranked Badge */}
                    {isTop && (
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 uppercase tracking-wide">
                        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                        {txt.topRecommendation} • #1
                      </div>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mt-1">
                      {/* Left: Doctor & Hospital Identity */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${doc.color} text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-md`}
                        >
                          {doc.initials}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-base sm:text-lg font-black text-slate-950">
                              {doc.name}
                            </h3>
                            <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200">
                              {doc.specialtyLabel}
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {doc.regNo}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <strong className="text-slate-900 font-semibold">{doc.facility}</strong>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 font-medium">{doc.location}</span>
                          </div>

                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {doc.qualifications} • {doc.experience} {txt.experience}
                          </p>
                        </div>
                      </div>

                      {/* Right: Match Score Pill */}
                      <div className="flex items-center gap-3 self-start lg:self-center shrink-0">
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm">
                            <TrendingUp className="w-4 h-4 text-emerald-200" />
                            <span>{doc.matchScore}% {txt.matchScore}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-semibold mt-1">
                            {doc.reviewsCount.toLocaleString()}+ {txt.reviews} (★ {doc.rating})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Department Fame Highlight Callout */}
                    <div className="mt-4 bg-gradient-to-r from-amber-50 to-orange-50/60 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="text-xs">
                        <span className="font-extrabold text-amber-950 block tracking-tight">
                          {txt.hospitalFameLabel} {doc.hospitalTier}
                        </span>
                        <p className="text-amber-900/90 leading-relaxed mt-0.5 font-medium">
                          {doc.famousFor}
                        </p>
                      </div>
                    </div>

                    {/* 4 Core Metrics Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                      {/* Metric 1: Clinical Success Rate */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
                          <BadgePercent className="w-3.5 h-3.5 text-emerald-600" />
                          {txt.successRateLabel}
                        </span>
                        <span className="text-sm font-black text-emerald-700 block mt-0.5">
                          {doc.successRate}%
                        </span>
                      </div>

                      {/* Metric 2: Doctor Degree Level */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-indigo-600" />
                          {txt.doctorDegreeLabel}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 block mt-0.5 truncate">
                          {doc.doctorDegreeLevel}
                        </span>
                      </div>

                      {/* Metric 3: OPD Fee Category */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          {txt.opdFeeLabel}
                        </span>
                        <span className="text-xs font-extrabold text-emerald-800 block mt-0.5 truncate">
                          {doc.opdFee}
                        </span>
                      </div>

                      {/* Metric 4: Avg OPD Wait Time */}
                      <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold uppercase block flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          {txt.waitTimeLabel}
                        </span>
                        <span className="text-xs font-extrabold text-slate-800 block mt-0.5">
                          {doc.avgWaitTime}
                        </span>
                      </div>
                    </div>

                    {/* Why Recommended Callout List */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                        {txt.whyRecommended}
                      </h4>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                        {doc.reasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-2 text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="leading-snug">{reason}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Bar */}
                    <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {doc.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {doc.days}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartBooking(doc)}
                        className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        {txt.bookWithDoc}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: MY BOOKINGS LIST */}
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

              {/* Step 2: Select Time Slot (Organized across 4 Shifts with Shift Filter) */}
              <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    {txt.step2Time}
                  </label>

                  {/* Shift Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                    <button
                      type="button"
                      onClick={() => setShiftFilter('all')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                        shiftFilter === 'all'
                          ? 'bg-slate-800 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {txt.shiftAll}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShiftFilter('early')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                        shiftFilter === 'early'
                          ? 'bg-amber-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      07:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setShiftFilter('morning')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                        shiftFilter === 'morning'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      09:00
                    </button>
                    <button
                      type="button"
                      onClick={() => setShiftFilter('afternoon')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                        shiftFilter === 'afternoon'
                          ? 'bg-sky-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      13:30
                    </button>
                    <button
                      type="button"
                      onClick={() => setShiftFilter('evening')}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                        shiftFilter === 'evening'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      17:00
                    </button>
                  </div>
                </div>

                {/* Shift 1: Early Morning OPD (07:30 - 09:00) */}
                {(shiftFilter === 'all' || shiftFilter === 'early') && (
                  <div className="mb-3.5">
                    <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px] mb-1.5">
                      <Sunrise className="w-3.5 h-3.5" />
                      <span>{txt.earlyMorningShift}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({earlyMorningSlots.length} slots)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {earlyMorningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                            selectedTimeSlot === slot
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shift 2: Prime Morning OPD (09:00 - 12:30) */}
                {(shiftFilter === 'all' || shiftFilter === 'morning') && (
                  <div className="mb-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px] mb-1.5">
                      <Sun className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{txt.morningShift}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({morningPrimeSlots.length} slots)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {morningPrimeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                            selectedTimeSlot === slot
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shift 3: Afternoon OPD (13:30 - 16:30) */}
                {(shiftFilter === 'all' || shiftFilter === 'afternoon') && (
                  <div className="mb-3.5">
                    <div className="flex items-center gap-1.5 text-sky-800 font-bold text-[11px] mb-1.5">
                      <Sunset className="w-3.5 h-3.5 text-sky-600" />
                      <span>{txt.afternoonShift}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({afternoonSlots.length} slots)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {afternoonSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                            selectedTimeSlot === slot
                              ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-sky-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shift 4: Evening Special Clinic (17:00 - 20:00) */}
                {(shiftFilter === 'all' || shiftFilter === 'evening') && (
                  <div>
                    <div className="flex items-center gap-1.5 text-indigo-800 font-bold text-[11px] mb-1.5">
                      <Moon className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{txt.eveningShift}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({eveningSlots.length} slots)</span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                      {eveningSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border text-center ${
                            selectedTimeSlot === slot
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Selected Slot Confirmation Indicator */}
                {selectedTimeSlot && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Selected Slot:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-md flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {selectedDate} at {selectedTimeSlot}
                    </span>
                  </div>
                )}
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
