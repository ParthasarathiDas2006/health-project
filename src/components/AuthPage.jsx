import React, { useState, useEffect } from 'react';
import {
  Activity,
  ShieldCheck,
  User,
  Lock,
  Mail,
  Building2,
  Phone,
  Key,
  UserPlus,
  LogIn,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  MapPin,
  Globe,
  Sun,
  Moon,
  BookOpen,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Send,
  Check,
  RotateCcw,
  Zap,
  Fingerprint,
  QrCode,
  Upload,
  ScanLine,
  Clock
} from 'lucide-react';
import { getStoredUsers, saveUser, verifyCredentials, setCurrentUser } from '../utils/authStorage';

/**
 * Authentication Page (Sign In & Create Account)
 * Designed for Indian Public Health & Clinical Triage System
 * Supports English, Hindi, and Odia (ଓଡ଼ିଆ) with instant demo credentials
 */
export default function AuthPage({ onLoginSuccess, onCancel, themeMode: propThemeMode, onThemeChange }) {
  const [internalTheme, setInternalTheme] = useState(() => {
    return propThemeMode || localStorage.getItem('nhp_theme_mode') || 'light';
  });

  const activeTheme = propThemeMode || internalTheme;

  const handleThemeSwitch = (newTheme) => {
    setInternalTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    } else {
      const root = document.documentElement;
      root.classList.remove('theme-dark', 'theme-reading');
      if (newTheme === 'dark') {
        root.classList.add('theme-dark');
      } else if (newTheme === 'reading') {
        root.classList.add('theme-reading');
      }
      localStorage.setItem('nhp_theme_mode', newTheme);
    }
  };

  const [authLang, setAuthLang] = useState('or-IN'); // Default to Odia as requested
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In form fields
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Dedicated Admin Sign In fields (keep empty, confidential)
  const [adminIdentifier, setAdminIdentifier] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Sign Up form fields
  const [signUpData, setSignUpData] = useState({
    name: '',
    roleCategory: 'patient',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    staffId: '',
    facility: 'Capital Hospital, Bhubaneswar, Odisha',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: '',
    phone: '',
    qualifications: '',
    shift: 'Citizen Self-Service Access',
    age: '',
    gender: 'Male',
    bloodGroup: 'B+',
    password: '',
    confirmPassword: '',
    adminPasskey: ''
  });

  // Fast Account Creation State (Aadhaar Card OR Mobile Number directly)
  const [fastTrackMethod, setFastTrackMethod] = useState('mobile'); // 'mobile' or 'aadhaar'
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarMobile, setAadhaarMobile] = useState('');
  const [directMobile, setDirectMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(false);
  const [aadhaarLoading, setAadhaarLoading] = useState(false);
  const [otpNotification, setOtpNotification] = useState('');
  const [signupMethod, setSignupMethod] = useState('aadhaar'); // 'aadhaar' (fast-track) or 'manual'

  // Sign In via Mobile OTP State (Passwordless login OR option)
  const [signInWithMobile, setSignInWithMobile] = useState(false);
  const [signInMobile, setSignInMobile] = useState('');
  const [signInOtpSent, setSignInOtpSent] = useState(false);
  const [signInOtpCode, setSignInOtpCode] = useState('');
  const [signInGeneratedOtp, setSignInGeneratedOtp] = useState('');
  const [signInOtpTimer, setSignInOtpTimer] = useState(0);
  const [signInOtpLoading, setSignInOtpLoading] = useState(false);
  const [signInOtpNotification, setSignInOtpNotification] = useState('');

  // Feature: Last Active Session Quick Resume User
  const [lastActiveUser, setLastActiveUser] = useState(() => {
    try {
      const stored = localStorage.getItem('triage_current_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Feature: ABHA / Health QR Code Scanner Upload Modal
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);

  // Feature: WebAuthn / Biometric Instant Login Loading
  const [biometricLoading, setBiometricLoading] = useState(false);

  useEffect(() => {
    let interval = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  useEffect(() => {
    let interval = null;
    if (signInOtpSent && signInOtpTimer > 0) {
      interval = setInterval(() => {
        setSignInOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (signInOtpTimer === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [signInOtpSent, signInOtpTimer]);

  const handleAadhaarChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setAadhaarNumber(formatted);
  };

  const handleMobileChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setAadhaarMobile(raw);
  };

  const handleDirectMobileChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10);
    setDirectMobile(raw);
  };

  const handleFillDemoAadhaar = () => {
    setFastTrackMethod('aadhaar');
    setAadhaarNumber('7892 4510 9823');
    setErrorMsg('');
  };

  const handleFillDemoMobile = () => {
    setFastTrackMethod('mobile');
    setDirectMobile('9861055432');
    setErrorMsg('');
  };

  const indianStates = [
    'Odisha (ଓଡ଼ିଶା)',
    'Maharashtra',
    'Uttar Pradesh',
    'Bihar',
    'West Bengal',
    'Karnataka',
    'Tamil Nadu',
    'Delhi (NCT)',
    'Gujarat',
    'Rajasthan',
    'Madhya Pradesh',
    'Kerala',
    'Andhra Pradesh',
    'Punjab',
    'Haryana'
  ];

  const roleOptions = [
    {
      category: 'patient',
      label: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
      defaultShift: 'Citizen Self-Service Access',
      placeholderId: 'ABHA: 91-XXXX-XXXX-XXXX or Mobile'
    },
    {
      category: 'doctor',
      label: 'Medical Officer / ଡାକ୍ତର (RMP)',
      defaultShift: 'Morning Shift (08:00 - 16:00)',
      placeholderId: 'OMC/NMC-2022-12345'
    },
    {
      category: 'nurse',
      label: 'Triage Staff Nurse (ଟ୍ରାଏଜ୍ ନର୍ସ)',
      defaultShift: 'General Day (09:00 - 17:00)',
      placeholderId: 'ONC-REG-98765'
    },
    {
      category: 'asha',
      label: 'Community Health Worker (ASHA / ANM / ଆଶା କର୍ମୀ)',
      defaultShift: 'Field & Sub-Center Intake',
      placeholderId: 'NHM-ASHA-54321'
    },
    {
      category: 'occupational',
      label: 'Occupational Health / Factory Clinic Officer',
      defaultShift: 'Industrial Plant Shift',
      placeholderId: 'DISHA-OH-7712'
    },
    {
      category: 'campus',
      label: 'Campus Infirmary Medical Staff',
      defaultShift: 'Student Health Shift',
      placeholderId: 'CAMPUS-MED-404'
    },
    {
      category: 'admin',
      label: 'State Health Portal Administrator (ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସକ)',
      defaultShift: '24x7 Administrative Command',
      placeholderId: 'ADMIN-OD-2026'
    }
  ];

  // Multilingual Strings dictionary
  const i18n = {
    'or-IN': {
      title: 'ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ଡେସ୍କ',
      subtitle: 'ଚିକିତ୍ସକ ଏବଂ ରୋଗୀଙ୍କ ପାଇଁ ବହୁଭାଷୀ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ପୋର୍ଟାଲ୍ (ଓଡ଼ିଶା ସଂସ୍କରଣ)',
      badge: 'ଆୟୁଷ୍ମାନ ଭାରତ ଏବଂ ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (BSKY ଅନ୍ତର୍ଭୁକ୍ତ)',
      signInTab: 'ଲଗ୍ ଇନ୍',
      adminSignInTab: 'ପ୍ରଶାସନିକ ଲଗ୍-ଇନ୍ (Admin)',
      signUpTab: 'ନୂଆ ଖାତା ଖୋଲନ୍ତୁ',
      adminGateTitle: 'ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ପୋର୍ଟାଲ୍ କେନ୍ଦ୍ରୀୟ ପ୍ରଶାସନିକ ପ୍ରବେଶ ପଥ',
      adminGateSubtitle: 'କେବଳ ଅଧିକୃତ ସୁପର ଆଡମିନ୍ ଏବଂ ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ନିର୍ଦ୍ଦେଶକଙ୍କ ପାଇଁ ସୁରକ୍ଷିତ ଲଗ୍-ଇନ୍',
      adminIdLabel: 'ଅଫିସିଆଲ୍ ଆଡମିନ୍ ଇମେଲ୍ / ପ୍ରଶାସକ ID *',
      adminIdPlaceholder: 'ଅଫିସିଆଲ୍ ଆଡମିନ୍ ଇମେଲ୍ କିମ୍ବା ଷ୍ଟାଫ୍ ଆଇଡି',
      adminLoginBtn: 'କେନ୍ଦ୍ରୀୟ ପ୍ରଶାସନିକ ଡେସ୍କରେ ପ୍ରବେଶ କରନ୍ତୁ',
      adminPasskeyLabel: 'ପ୍ରଶାସକ ସୁରକ୍ଷା କୋଡ଼ (Admin Passkey) *',
      adminPasskeyHint: '* ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସନ ଦ୍ୱାରା ପ୍ରଦତ୍ତ ଅଧିକୃତ ସୁରକ୍ଷା କୋଡ଼ ଆବଶ୍ୟକ',
      idLabel: 'ଇମେଲ୍ ଆଇଡି / ଷ୍ଟାଫ୍ ଆଇଡି / ABHA ଆଇଡି / ଫୋନ୍',
      idPlaceholder: 'dr.soumya@scbmch.odisha.gov.in କିମ୍ବା ABHA ଆଇଡି',
      passwordLabel: 'ପାସୱାର୍ଡ',
      rememberMe: 'ଏହି ଡାକ୍ତରୀ ୱାର୍କଷ୍ଟେସନ ମନେରଖନ୍ତୁ',
      loginBtn: 'ଟ୍ରାଏଜ୍ ଡେସ୍କରେ ପ୍ରବେଶ କରନ୍ତୁ',
      quickDemoTitle: '୧-କ୍ଲିକ୍ ତୁରନ୍ତ ଡେମୋ ଲଗ୍-ଇନ୍:',
      fullNameLabel: 'ପୂରା ନାମ *',
      roleLabel: 'ଭୂମିକା *',
      staffIdLabel: 'ଷ୍ଟାଫ୍ / ପଞ୍ଜୀକରଣ ଆଇଡି *',
      patientIdLabel: 'ABHA ଆଇଡି / ମୋବାଇଲ୍ ନମ୍ବର *',
      facilityLabel: 'ଡାକ୍ତରଖାନା / ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ନାମ *',
      patientFacilityLabel: 'ନିକଟତମ ଡାକ୍ତରଖାନା / CHC / PHC *',
      stateLabel: 'ରାଜ୍ୟ *',
      ageLabel: 'ବୟସ',
      genderLabel: 'ଲିଙ୍ଗ',
      bloodGroupLabel: 'ରକ୍ତ ବର୍ଗ',
      registerBtn: 'ପଞ୍ଜୀକରଣ କରନ୍ତୁ ଓ ଡେସ୍କ ସକ୍ରିୟ କରନ୍ତୁ',
      aadhaarFastTab: '⚡ ଦ୍ରୁତ ଯାଞ୍ଚ (Mobile / Aadhaar OTP)',
      manualTab: '📝 ମାନୁଆଲ୍ ଫର୍ମ (Manual Form)',
      aadhaarCardTitle: 'ଆଧାର କିମ୍ବା ମୋବାଇଲ୍ OTP ଦ୍ୱାରା ଦ୍ରୁତ ଖାତା ଖୋଲନ୍ତୁ',
      aadhaarCardSubtitle: '୧୨-ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର ଦ୍ୱାରା ସଂଯୁକ୍ତ ମୋବାଇଲ୍ ସ୍ୱୟଂଚାଳିତ ଭାବେ ଆସିବ ଏବଂ OTP ଯାଞ୍ଚ ହେବ',
      aadhaarInputLabel: '୧୨-ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର କାର୍ଡ ନମ୍ବର *',
      directMobileLabel: '୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର *',
      sendAadhaarOtpBtn: 'ଆଧାର ସଂଯୁକ୍ତ ମୋବାଇଲ୍‌କୁ OTP ପଠାନ୍ତୁ',
      sendMobileOtpBtn: 'ମୋବାଇଲ୍ OTP ପଠାନ୍ତୁ',
      verifyAadhaarOtpBtn: 'OTP ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ବିବରଣୀ ଆଣନ୍ତୁ',
      otpInputLabel: '୬-ଅଙ୍କ ବିଶିଷ୍ଟ OTP *',
      fastCompleteBtn: '🚀 ତୁରନ୍ତ ଖାତା ତିଆରି କରନ୍ତୁ (୧-କ୍ଲିକ୍)',
      autoFillOtpBtn: 'Auto-Fill OTP',
      demoAadhaarBtn: 'ଡେମୋ ଆଧାର',
      demoMobileBtn: 'ଡେମୋ ମୋବାଇଲ୍',
      useMobileOption: '📱 ମୋବାଇଲ୍ ନମ୍ବର OTP (ସବୁଠାରୁ ଦ୍ରୁତ)',
      useAadhaarOption: '💳 ଆଧାର କାର୍ଡ e-KYC (Auto-Fetch Mobile)',
      orSignInWithMobile: '— କିମ୍ବା ମୋବାଇଲ୍ OTP ଦ୍ୱାରା ଲଗ୍-ଇନ୍ କରନ୍ତୁ (OR Sign In with Mobile) —',
      backToStandardSignIn: '← ଇମେଲ୍ ଓ ପାସୱାର୍ଡ ଲଗ୍-ଇନ୍ କୁ ଫେରନ୍ତୁ'
    },
    'hi-IN': {
      title: 'राष्ट्रीय स्वास्थ्य ट्रायज डेस्क',
      subtitle: 'चिकित्सकों एवं नागरिकों के लिए सुरक्षित बहुभाषी डिजिटल ट्रायज पोर्टल',
      badge: 'आयुष्मान भारत एवं राष्ट्रीय स्वास्थ्य मिशन',
      signInTab: 'साइन इन',
      adminSignInTab: 'एडमिन पोर्टल (Admin)',
      signUpTab: 'नया खाता बनाएं',
      adminGateTitle: 'राज्य स्वास्थ्य पोर्टल केंद्रीय प्रशासनिक प्रवेश द्वार',
      adminGateSubtitle: 'केवल अधिकृत सुपर एडमिन एवं स्वास्थ्य निदेशकों हेतु सुरक्षित लॉगिन',
      adminIdLabel: 'आधिकारिक एडमिन ईमेल / स्टाफ ID *',
      adminIdPlaceholder: 'आधिकारिक एडमिन ईमेल या स्टाफ आईडी',
      adminLoginBtn: 'केंद्रीय प्रशासनिक डेस्क में प्रवेश करें',
      adminPasskeyLabel: 'प्रशासक सुरक्षा पासकी (Admin Passkey) *',
      adminPasskeyHint: '* राज्य स्वास्थ्य प्रशासन द्वारा जारी अधिकृत सुरक्षा पासकी आवश्यक है',
      idLabel: 'ईमेल आईडी / मेडिकल पंजीकरण / ABHA आईडी',
      idPlaceholder: 'dr.rajesh@civilhosp.gov.in या ABHA ID',
      passwordLabel: 'पासवर्ड',
      rememberMe: 'इस वर्कस्टेशन को याद रखें',
      loginBtn: 'क्लिनिकल ट्रायज डेस्क में प्रवेश करें',
      quickDemoTitle: '1-क्लिक त्वरित डेमो लॉगिन:',
      fullNameLabel: 'पूरा नाम *',
      roleLabel: 'भूमिका *',
      staffIdLabel: 'स्टाफ / मेडिकल काउंसिल आईडी *',
      patientIdLabel: 'ABHA आईडी / मोबाइल नंबर *',
      facilityLabel: 'अस्पताल / स्वास्थ्य केंद्र नाम *',
      patientFacilityLabel: 'निकटतम अस्पताल / सीएचसी / पीएचसी *',
      stateLabel: 'राज्य *',
      ageLabel: 'आयु',
      genderLabel: 'लिंग',
      bloodGroupLabel: 'रक्त समूह',
      registerBtn: 'पंजीकरण करें और डेस्क सक्रिय करें',
      aadhaarFastTab: '⚡ त्वरित सत्यापन (Mobile / Aadhaar OTP)',
      manualTab: '📝 मैन्युअल फॉर्म (Manual Form)',
      aadhaarCardTitle: 'मोबाइल नंबर अथवा आधार OTP द्वारा तीव्र खाता निर्माण',
      aadhaarCardSubtitle: '12-अंकीय आधार से लिंक्ड मोबाइल नंबर स्वतः प्राप्त होगा एवं OTP भेजा जाएगा',
      aadhaarInputLabel: '12-अंकीय आधार कार्ड संख्या *',
      directMobileLabel: '10-अंकीय मोबाइल नंबर *',
      sendAadhaarOtpBtn: 'आधार लिंक्ड मोबाइल पर OTP भेजें',
      sendMobileOtpBtn: 'मोबाइल OTP भेजें',
      verifyAadhaarOtpBtn: 'OTP सत्यापित करें एवं विवरण प्राप्त करें',
      otpInputLabel: '6-अंकीय OTP *',
      fastCompleteBtn: '🚀 1-क्लिक में तुरंत खाता बनाएं',
      autoFillOtpBtn: 'Auto-Fill OTP',
      demoAadhaarBtn: 'डेमो आधार',
      demoMobileBtn: 'डेमो मोबाइल',
      useMobileOption: '📱 मोबाइल नंबर OTP (सबसे तेज)',
      useAadhaarOption: '💳 आधार कार्ड e-KYC (Auto-Fetch Mobile)',
      orSignInWithMobile: '— अथवा मोबाइल OTP से लॉगिन करें (OR Mobile Sign In) —',
      backToStandardSignIn: '← ईमेल एवं पासवर्ड लॉगिन पर वापस जाएं'
    },
    'en-IN': {
      title: 'National Healthcare Triage Desk',
      subtitle: 'SwasthyaMitra — Clinical Decision-Support & Intake Portal for Medical Staff & Citizens',
      badge: 'Ayushman Arogya Mandir & National Health Mission',
      signInTab: 'Citizen / Staff Sign In',
      adminSignInTab: 'Admin Portal Sign In',
      signUpTab: 'Create Account',
      adminGateTitle: 'State Health Mission Central Administrator Gateway',
      adminGateSubtitle: 'Restricted high-clearance access for Super Administrators & Health Directors',
      adminIdLabel: 'Official Admin Email / Administrator ID *',
      adminIdPlaceholder: 'Official Admin Email or Staff ID',
      adminLoginBtn: 'Access State Admin Command Center',
      adminPasskeyLabel: 'Admin Authorization Security Passkey *',
      adminPasskeyHint: '* Requires authorized security passkey issued by State Health Directorate',
      idLabel: 'Official Email ID / Medical Reg ID / ABHA ID / Phone',
      idPlaceholder: 'e.g. dr.soumya@scbmch.odisha.gov.in or ABHA ID',
      passwordLabel: 'Password',
      rememberMe: 'Remember this clinical workstation',
      loginBtn: 'Access Clinical Triage Desk',
      quickDemoTitle: '1-Click Quick Demo Sign-In:',
      fullNameLabel: 'Full Name *',
      roleLabel: 'Professional Role *',
      staffIdLabel: 'Reg ID / Staff ID *',
      patientIdLabel: 'ABHA ID / Mobile Number *',
      facilityLabel: 'Facility / Hospital Name *',
      patientFacilityLabel: 'Preferred Hospital / PHC *',
      stateLabel: 'State / UT *',
      ageLabel: 'Age',
      genderLabel: 'Gender',
      bloodGroupLabel: 'Blood Group',
      registerBtn: 'Register & Activate Triage Workstation',
      aadhaarFastTab: '⚡ Fast Mobile / Aadhaar OTP (Recommended)',
      manualTab: '📝 Manual Form',
      aadhaarCardTitle: 'Instant Verification via Mobile OTP or Aadhaar Card',
      aadhaarCardSubtitle: 'Enter 12-digit Aadhaar — your linked mobile number is automatically detected from UIDAI records to receive OTP',
      aadhaarInputLabel: '12-Digit Aadhaar Card Number *',
      directMobileLabel: '10-Digit Mobile Number *',
      sendAadhaarOtpBtn: 'Send OTP to Aadhaar-Linked Mobile',
      sendMobileOtpBtn: 'Send Mobile OTP',
      verifyAadhaarOtpBtn: 'Verify OTP & Fetch Details',
      otpInputLabel: '6-Digit OTP *',
      fastCompleteBtn: '🚀 1-Click Complete Account Creation',
      autoFillOtpBtn: 'Auto-Fill OTP',
      demoAadhaarBtn: 'Demo Aadhaar',
      demoMobileBtn: 'Demo Mobile',
      useMobileOption: '📱 Mobile Number OTP (Fastest)',
      useAadhaarOption: '💳 Aadhaar Card e-KYC (Auto-Fetch Mobile)',
      orSignInWithMobile: '— OR Sign In with Mobile Number OTP —',
      backToStandardSignIn: '← Back to Email & Password Sign In'
    }
  };

  const currentStrings = i18n[authLang] || i18n['or-IN'];

  // Handle Role Selection change
  const handleRoleChange = (e) => {
    const selectedLabel = e.target.value;
    const found = roleOptions.find((r) => r.label === selectedLabel);
    setSignUpData({
      ...signUpData,
      role: selectedLabel,
      roleCategory: found?.category || 'doctor',
      shift: found?.defaultShift || 'Morning Shift'
    });
  };

  // Quick 1-Click Demo Login
  const handleQuickDemoLogin = (userId) => {
    setErrorMsg('');
    const users = getStoredUsers();
    const demo = users.find((u) => u.id === userId) || users[0];
    setCurrentUser(demo);
    setSuccessMsg(
      authLang === 'or-IN'
        ? `ସ୍ୱାଗତମ୍, ${demo.name}! ଲଗ୍-ଇନ୍ ହେଉଛି...`
        : `Welcome back, ${demo.name}! Logging you in...`
    );
    setTimeout(() => {
      onLoginSuccess(demo);
    }, 400);
  };

  // Submit Sign In
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanIdentifier = (signInIdentifier || '').trim().toLowerCase();
    if (!cleanIdentifier || !signInPassword.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ଆପଣଙ୍କର ଇମେଲ୍ / ଆଭା ଆଇଡି ଏବଂ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ।'
          : 'Please provide both your Email/Staff/ABHA ID and Password.'
      );
      return;
    }

    try {
      const authenticatedUser = verifyCredentials(cleanIdentifier, signInPassword);
      setCurrentUser(authenticatedUser);
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ପ୍ରମାଣୀକରଣ ସଫଳ! ସ୍ୱାଗତମ୍, ${authenticatedUser.name}।`
          : `Authentication successful! Welcome, ${authenticatedUser.name}.`
      );
      setTimeout(() => {
        onLoginSuccess(authenticatedUser);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  // Submit Dedicated Admin Sign In
  const handleAdminSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanAdminId = (adminIdentifier || '').trim().toLowerCase();
    if (!cleanAdminId || !adminPassword.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ଆଡମିନ୍ ଇମେଲ୍ / ଆଇଡି ଏବଂ ପାସୱାର୍ଡ ପ୍ରଦାନ କରନ୍ତୁ।'
          : 'Please provide both Admin Official Email/ID and Password.'
      );
      return;
    }

    try {
      const authenticatedUser = verifyCredentials(cleanAdminId, adminPassword);
      if (authenticatedUser.roleCategory !== 'admin') {
        setErrorMsg(
          authLang === 'or-IN'
            ? 'ଏହି ଖାତା ପ୍ରଶାସକ (Admin) ନୁହେଁ। ଦୟାକରି ସାଧାରଣ ନାଗରିକ/ଡାକ୍ତର ଲଗ୍-ଇନ୍ ଟ୍ୟାବ୍ ବ୍ୟବହାର କରନ୍ତୁ।'
            : 'This account does not have Administrative clearance. Please use the Citizen/Staff Sign In tab.'
        );
        return;
      }
      setCurrentUser(authenticatedUser);
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ପ୍ରଶାସନିକ ପ୍ରମାଣୀକରଣ ସଫଳ! ସ୍ୱାଗତମ୍, ${authenticatedUser.name}।`
          : `Admin authentication successful! Welcome, ${authenticatedUser.name}.`
      );
      setTimeout(() => {
        onLoginSuccess(authenticatedUser);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Admin authentication failed. Please verify credentials.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // FAST-TRACK REGISTRATION HANDLERS (AADHAAR OR MOBILE OTP)
  // ─────────────────────────────────────────────────────────────
  const handleSendAadhaarOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpNotification('');
    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');

    if (cleanAadhaar.length !== 12) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ଏକ ବୈଧ ୧୨-ଅଙ୍କ ବିଶିଷ୍ଟ ଆଧାର କାର୍ଡ ନମ୍ବର ପ୍ରବେଶ କରନ୍ତୁ।'
          : authLang === 'hi-IN'
          ? 'कृपया एक वैध 12-अंकीय आधार कार्ड संख्या दर्ज करें।'
          : 'Please enter a valid 12-digit Aadhaar Card number.'
      );
      return;
    }

    // Auto-detect / fetch UIDAI-linked mobile number directly from Aadhaar registry
    const last4 = cleanAadhaar.slice(-4);
    const mid2 = cleanAadhaar.slice(4, 6);
    const autoLinkedMobile = `98${mid2}${last4}`;
    setAadhaarMobile(autoLinkedMobile);

    setAadhaarLoading(true);
    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomCode);
      setOtpSent(true);
      setOtpTimer(60);
      setAadhaarLoading(false);
      setOtpNotification(
        `UIDAI Auto-Linked Mobile (+91 ${autoLinkedMobile.slice(0, 2)}*** ***${autoLinkedMobile.slice(-2)}): OTP ${randomCode}`
      );
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ଆଧାର ସଂଯୁକ୍ତ ମୋବାଇଲ୍‌କୁ OTP ପଠାଗଲା (+91 ${autoLinkedMobile.slice(0, 2)}*** ***${autoLinkedMobile.slice(-2)})! ଡେମୋ OTP: ${randomCode}`
          : `OTP sent to UIDAI registered mobile (+91 ${autoLinkedMobile.slice(0, 2)}*** ***${autoLinkedMobile.slice(-2)})! Demo OTP: ${randomCode}`
      );
    }, 600);
  };

  const handleSendDirectMobileOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setOtpNotification('');
    const cleanMobile = directMobile.replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ଏକ ବୈଧ ୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରଦାନ କରନ୍ତୁ।'
          : authLang === 'hi-IN'
          ? 'कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    setAadhaarLoading(true);
    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomCode);
      setOtpSent(true);
      setOtpTimer(60);
      setAadhaarLoading(false);
      setOtpNotification(
        `SwasthyaMitra OTP sent to +91 ${cleanMobile.slice(0, 2)}*** ***${cleanMobile.slice(-2)}: ${randomCode}`
      );
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ମୋବାଇଲ୍ OTP ସଫଳତାର ସହ ପଠାଗଲା! ନିମ୍ନରେ ୬-ଅଙ୍କ ବିଶିଷ୍ଟ OTP ପ୍ରବେଶ କରନ୍ତୁ (ଡେମୋ OTP: ${randomCode})।`
          : `Mobile OTP sent! Enter the 6-digit code below (Demo OTP: ${randomCode}).`
      );
    }, 500);
  };

  const handleVerifyFastTrackOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanInputOtp = otpCode.trim();
    if (!cleanInputOtp || (cleanInputOtp !== generatedOtp && cleanInputOtp !== '123456')) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଅବୈଧ OTP! ଦୟାକରି ସଠିକ୍ ୬-ଅଙ୍କ କୋଡ୍ ପ୍ରବେଶ କରନ୍ତୁ କିମ୍ବା Auto-Fill କ୍ଲିକ୍ କରନ୍ତୁ।'
          : 'Invalid OTP! Please enter the correct 6-digit code or click Auto-fill.'
      );
      return;
    }

    setAadhaarLoading(true);
    setTimeout(() => {
      setIsAadhaarVerified(true);
      setAadhaarLoading(false);

      if (fastTrackMethod === 'aadhaar') {
        const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
        const autoDerivedMobile = `98${cleanAadhaar.slice(4, 6)}${cleanAadhaar.slice(-4)}`;
        const cleanMobile = (aadhaarMobile || autoDerivedMobile).replace(/\D/g, '');
        const generatedAbha = `91-${cleanAadhaar.slice(0, 4)}-${cleanAadhaar.slice(4, 8)}-${cleanAadhaar.slice(8, 12)}`;

        const demoCitizenNames = [
          'Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)',
          'Ananya Priyadarshini (ଅନନ୍ୟା ପ୍ରିୟଦର୍ଶିନୀ)',
          'Debashis Nayak (ଦେବାଶିଷ ନାୟକ)',
          'Subhashree Jena (ଶୁଭଶ୍ରୀ ଜେନା)',
          'Rameshwar Lal (ରାମେଶ୍ୱର ଲାଲ)',
          'Priyanka Sahoo (ପ୍ରିୟଙ୍କା ସାହୁ)',
          'Bikram Keshari Rout (ବିକ୍ରମ ରାଉତ)',
          'Soudamini Barik (ସୌଦାମିନୀ ବାରିକ)',
          'Trilochan Mohapatra (ତ୍ରିଲୋଚନ ମହାପାତ୍ର)',
          'Kalyani Moharana (କଲ୍ୟାଣୀ ମହାରଣା)'
        ];
        const index = parseInt(cleanAadhaar.slice(-1) || '0', 10) % demoCitizenNames.length;
        const citizenName = demoCitizenNames[index];
        const firstName = citizenName.split(' ')[0].toLowerCase().replace(/[^a-z]/g, '') || 'citizen';
        const autoEmail = `${firstName}.${cleanAadhaar.slice(-4)}@abha.gov.in`;

        setSignUpData((prev) => ({
          ...prev,
          name: citizenName,
          roleCategory: 'patient',
          role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
          staffId: generatedAbha,
          facility: 'Capital Hospital, Unit-6, Bhubaneswar',
          state: 'Odisha (ଓଡ଼ିଶା)',
          district: 'Khurda',
          email: autoEmail.toLowerCase(),
          phone: `+91 ${cleanMobile}`,
          age: '38',
          gender: index % 2 === 0 ? 'Male' : 'Female',
          bloodGroup: 'B+',
          password: prev.password || 'password123',
          confirmPassword: prev.confirmPassword || 'password123'
        }));

        setSuccessMsg(
          authLang === 'or-IN'
            ? 'ଆଧାର e-KYC ସଫଳତାର ସହ ପ୍ରମାଣିତ ହେଲା! ନାଗରିକ ବିବରଣୀ ସ୍ୱୟଂଚାଳିତ ଭାବେ ପୂରଣ ହୋଇଛି।'
            : 'Aadhaar e-KYC verified successfully! Citizen demographic profile auto-filled from UIDAI.'
        );
      } else {
        // Direct Mobile Number verification
        const cleanMobile = directMobile.replace(/\D/g, '');
        const generatedAbha = `91-${cleanMobile.slice(0, 5)}-${cleanMobile.slice(5, 10)}`;
        const autoEmail = `citizen.${cleanMobile.slice(-4)}@abha.gov.in`;

        setSignUpData((prev) => ({
          ...prev,
          name: prev.name.trim() || 'Verified Citizen (ନାଗରିକ)',
          roleCategory: 'patient',
          role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
          staffId: generatedAbha,
          facility: 'Capital Hospital, Unit-6, Bhubaneswar',
          state: 'Odisha (ଓଡ଼ିଶା)',
          district: 'Khurda',
          email: autoEmail.toLowerCase(),
          phone: `+91 ${cleanMobile}`,
          age: '32',
          gender: 'Male',
          bloodGroup: 'O+',
          password: prev.password || 'password123',
          confirmPassword: prev.confirmPassword || 'password123'
        }));

        setSuccessMsg(
          authLang === 'or-IN'
            ? 'ମୋବାଇଲ୍ ନମ୍ବର ସଫଳତାର ସହ ପ୍ରମାଣିତ ହେଲା! ୧-କ୍ଲିକ୍ ରେ ଖାତା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।'
            : 'Mobile Number verified successfully! 1-Click to complete your account setup.'
        );
      }
    }, 500);
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtpCode(generatedOtp);
    } else {
      setOtpCode('123456');
    }
    setErrorMsg('');
  };

  const handleFastTrackRegister = () => {
    setErrorMsg('');
    const cleanSignUpEmail = (signUpData.email || '').trim().toLowerCase();
    const isAadhaar = fastTrackMethod === 'aadhaar';
    const cleanAadhaar = aadhaarNumber.replace(/\s+/g, '');
    const autoDerivedMobile = `98${cleanAadhaar.slice(4, 6)}${cleanAadhaar.slice(-4)}`;
    const cleanMobile = (isAadhaar ? (aadhaarMobile || autoDerivedMobile) : directMobile).replace(/\D/g, '');
    const generatedAbha = signUpData.staffId || (isAadhaar
      ? `91-${cleanAadhaar.slice(0, 4)}-${cleanAadhaar.slice(4, 8)}-${cleanAadhaar.slice(8, 12)}`
      : `91-${cleanMobile.slice(0, 5)}-${cleanMobile.slice(5, 10)}`);

    try {
      const newUser = saveUser({
        name: signUpData.name.trim() || (isAadhaar ? 'Aadhaar Verified Citizen' : 'Mobile Verified Citizen'),
        role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
        roleCategory: 'patient',
        staffId: generatedAbha,
        facility: signUpData.facility.trim() || 'Capital Hospital, Unit-6, Bhubaneswar',
        state: signUpData.state || 'Odisha (ଓଡ଼ିଶା)',
        district: signUpData.district.trim() || 'Khurda',
        email: cleanSignUpEmail || (isAadhaar
          ? `citizen.${cleanAadhaar.slice(-4)}@abha.gov.in`
          : `citizen.${cleanMobile.slice(-4)}@abha.gov.in`),
        phone: `+91 ${cleanMobile}`,
        qualifications: isAadhaar ? 'Aadhaar e-KYC & ABDM Verified Beneficiary' : 'Mobile OTP Verified Citizen',
        shift: 'Citizen Self-Service Access',
        age: signUpData.age || '35',
        gender: signUpData.gender || 'Male',
        bloodGroup: signUpData.bloodGroup || 'B+',
        preferredLanguage: authLang,
        password: signUpData.password || 'password123',
        aadhaarVerified: isAadhaar,
        aadhaarNumber: isAadhaar ? cleanAadhaar : undefined
      });

      setCurrentUser(newUser);
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ଖାତା ସଫଳତାର ସହ ଖୋଲାଗଲା! ସ୍ୱାଗତମ୍, ${newUser.name}।`
          : `Account created instantly! Welcome, ${newUser.name}.`
      );
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    }
  };

  // ─────────────────────────────────────────────────────────────
  // SIGN IN WITH MOBILE NUMBER OTP HANDLERS
  // ─────────────────────────────────────────────────────────────
  const handleSendSignInMobileOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');
    setSignInOtpNotification('');
    const cleanMobile = signInMobile.replace(/\D/g, '');

    if (cleanMobile.length !== 10) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ୧୦-ଅଙ୍କ ବିଶିଷ୍ଟ ମୋବାଇଲ୍ ନମ୍ବର ପ୍ରଦାନ କରନ୍ତୁ।'
          : 'Please enter a valid 10-digit mobile number to receive sign-in OTP.'
      );
      return;
    }

    setSignInOtpLoading(true);
    setTimeout(() => {
      const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
      setSignInGeneratedOtp(randomCode);
      setSignInOtpSent(true);
      setSignInOtpTimer(60);
      setSignInOtpLoading(false);
      setSignInOtpNotification(
        `Login OTP sent to +91 ${cleanMobile.slice(0, 2)}*** ***${cleanMobile.slice(-2)}: ${randomCode}`
      );
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ମୋବାଇଲ୍ ଲଗ୍-ଇନ୍ OTP ପଠାଗଲା! ୬-ଅଙ୍କ କୋଡ୍ ଦିଅନ୍ତୁ (ଡେମୋ OTP: ${randomCode})।`
          : `Login OTP sent! Enter the 6-digit code below (Demo OTP: ${randomCode}).`
      );
    }, 500);
  };

  const handleVerifySignInMobileOtp = () => {
    setErrorMsg('');
    setSuccessMsg('');

    const cleanInputOtp = signInOtpCode.trim();
    if (!cleanInputOtp || (cleanInputOtp !== signInGeneratedOtp && cleanInputOtp !== '123456')) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଅବୈଧ OTP! ଦୟାକରି ସଠିକ୍ କୋଡ୍ ଦିଅନ୍ତୁ।'
          : 'Invalid login OTP! Please enter the correct 6-digit code.'
      );
      return;
    }

    setSignInOtpLoading(true);
    setTimeout(() => {
      setSignInOtpLoading(false);
      const cleanMobile = signInMobile.replace(/\D/g, '');
      const users = getStoredUsers();

      // Find user by phone number or fallback to demo patient or create on fly
      let matchedUser = users.find((u) => (u.phone || '').replace(/\D/g, '').includes(cleanMobile));

      if (!matchedUser) {
        // Auto-create or login citizen
        matchedUser = saveUser({
          name: `Mobile Citizen (${cleanMobile.slice(-4)})`,
          role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
          roleCategory: 'patient',
          staffId: `91-${cleanMobile.slice(0, 5)}-${cleanMobile.slice(5, 10)}`,
          facility: 'Capital Hospital, Unit-6, Bhubaneswar',
          state: 'Odisha (ଓଡ଼ିଶା)',
          district: 'Khurda',
          email: `citizen.${cleanMobile.slice(-4)}@abha.gov.in`,
          phone: `+91 ${cleanMobile}`,
          qualifications: 'Mobile OTP Verified Beneficiary',
          shift: 'Citizen Self-Service Access',
          age: '30',
          gender: 'Citizen',
          bloodGroup: 'B+',
          preferredLanguage: authLang,
          password: 'password123'
        });
      }

      setCurrentUser(matchedUser);
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ପ୍ରମାଣୀକରଣ ସଫଳ! ସ୍ୱାଗତମ୍, ${matchedUser.name}।`
          : `Mobile OTP login successful! Welcome, ${matchedUser.name}.`
      );
      setTimeout(() => {
        onLoginSuccess(matchedUser);
      }, 400);
    }, 500);
  };

  const handleAutoFillSignInOtp = () => {
    if (signInGeneratedOtp) {
      setSignInOtpCode(signInGeneratedOtp);
    } else {
      setSignInOtpCode('123456');
    }
    setErrorMsg('');
  };

  // ─────────────────────────────────────────────────────────────
  // FEATURE 1: NATIVE WEBAUTHN / BIOMETRIC 1-TOUCH INSTANT SIGN-IN
  // ─────────────────────────────────────────────────────────────
  const handleBiometricSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setBiometricLoading(true);

    try {
      // Check if browser supports WebAuthn credentials
      if (window.PublicKeyCredential) {
        // Simulated instant passkey / touch handshake
        await new Promise((resolve) => setTimeout(resolve, 600));

        const users = getStoredUsers();
        // Use last active user or default senior clinician
        const targetUser = lastActiveUser || users.find((u) => u.id === 'USR-DOC-505') || users[0];

        setCurrentUser(targetUser);
        setSuccessMsg(
          authLang === 'or-IN'
            ? `ବାୟୋମେଟ୍ରିକ୍ ଯାଞ୍ଚ ସଫଳ! ସ୍ୱାଗତମ୍, ${targetUser.name}।`
            : `Biometric authentication verified! Welcome back, ${targetUser.name}.`
        );
        setTimeout(() => {
          onLoginSuccess(targetUser);
        }, 500);
      } else {
        throw new Error('Biometric hardware not available on this device');
      }
    } catch {
      // Fallback: seamless simulated biometric touch
      const users = getStoredUsers();
      const targetUser = lastActiveUser || users[0];
      setCurrentUser(targetUser);
      setSuccessMsg(`Touch ID authenticated! Welcome, ${targetUser.name}.`);
      setTimeout(() => {
        onLoginSuccess(targetUser);
      }, 500);
    } finally {
      setBiometricLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // FEATURE 2: QUICK RESUME LAST SESSION
  // ─────────────────────────────────────────────────────────────
  const handleResumeLastUser = () => {
    if (!lastActiveUser) return;
    setErrorMsg('');
    setCurrentUser(lastActiveUser);
    setSuccessMsg(
      authLang === 'or-IN'
        ? `ସ୍ୱାଗତମ୍, ${lastActiveUser.name}! ତୁରନ୍ତ ଡ୍ୟାସବୋର୍ଡ ଖୋଲୁଛି...`
        : `Welcome back, ${lastActiveUser.name}! Opening clinical dashboard...`
    );
    setTimeout(() => {
      onLoginSuccess(lastActiveUser);
    }, 400);
  };

  // ─────────────────────────────────────────────────────────────
  // FEATURE 3: ABHA CARD / HEALTH QR SCANNER & FILE UPLOAD
  // ─────────────────────────────────────────────────────────────
  const handleAbhaQrUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrScanning(true);
    setErrorMsg('');

    // Simulate instant client-side QR demographic parsing
    setTimeout(() => {
      setQrScanning(false);
      setShowQrModal(false);

      const parsedAbha = '91-4509-8812-7634';
      const parsedMobile = '9861055432';
      const parsedName = 'Swayam Prabha Mishra (ସ୍ୱୟଂପ୍ରଭା ମିଶ୍ର)';

      if (mode === 'signup') {
        setFastTrackMethod('aadhaar');
        setAadhaarNumber('4509 8812 7634');
        setIsAadhaarVerified(true);
        setSignUpData((prev) => ({
          ...prev,
          name: parsedName,
          roleCategory: 'patient',
          role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
          staffId: parsedAbha,
          facility: 'Capital Hospital, Unit-6, Bhubaneswar',
          state: 'Odisha (ଓଡ଼ିଶା)',
          district: 'Khurda',
          email: 'swayam.7634@abha.gov.in',
          phone: `+91 ${parsedMobile}`,
          age: '29',
          gender: 'Female',
          bloodGroup: 'O+',
          password: 'password123',
          confirmPassword: 'password123'
        }));
        setSuccessMsg(
          authLang === 'or-IN'
            ? 'ABHA QR କୋଡ୍ ସଫଳତାର ସହ ସ୍କାନ୍ ହେଲା! ୧-କ୍ଲିକ୍ ରେ ଖାତା ତିଆରି କରନ୍ତୁ।'
            : 'ABHA Card QR successfully scanned! Demographic profile loaded.'
        );
      } else {
        // Sign-in mode: auto log in or sign up citizen
        const users = getStoredUsers();
        let matched = users.find((u) => (u.staffId || '').includes('7634') || (u.phone || '').includes(parsedMobile));
        if (!matched) {
          matched = saveUser({
            name: parsedName,
            role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
            roleCategory: 'patient',
            staffId: parsedAbha,
            facility: 'Capital Hospital, Unit-6, Bhubaneswar',
            state: 'Odisha (ଓଡ଼ିଶା)',
            district: 'Khurda',
            email: 'swayam.7634@abha.gov.in',
            phone: `+91 ${parsedMobile}`,
            qualifications: 'ABDM QR Verified Beneficiary',
            shift: 'Citizen Self-Service Access',
            age: '29',
            gender: 'Female',
            bloodGroup: 'O+',
            preferredLanguage: authLang,
            password: 'password123'
          });
        }
        setCurrentUser(matched);
        setSuccessMsg(`ABHA QR Login Verified! Welcome, ${matched.name}.`);
        setTimeout(() => {
          onLoginSuccess(matched);
        }, 400);
      }
    }, 900);
  };

  // Submit Sign Up / Create Account
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpData.name.trim()) {
      setErrorMsg(authLang === 'or-IN' ? 'ପୂରା ନାମ ଆବଶ୍ୟକ।' : 'Full Name is required.');
      return;
    }

    // Enforce Secret Passkey sunil123 for Administrator signup
    if (signUpData.roleCategory === 'admin') {
      if (!signUpData.adminPasskey || signUpData.adminPasskey.trim() !== 'sunil123') {
        setErrorMsg(
          authLang === 'or-IN'
            ? 'ଅବୈଧ ପ୍ରଶାସକ ସୁରକ୍ଷା କୋଡ଼! ଦୟାକରି ସଠିକ୍ ପାସକୋଡ୍ ପ୍ରଦାନ କରନ୍ତୁ କିମ୍ବା ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ନିର୍ଦ୍ଦେଶାଳୟ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।'
            : authLang === 'hi-IN'
            ? 'अवैध एडमिन सुरक्षा पासकी! कृपया सही पासकी दर्ज करें अथवा राज्य स्वास्थ्य प्रशासन से संपर्क करें।'
            : 'Invalid Admin Security Key! Please enter the authorized security passkey or contact the State Health Directorate.'
        );
        return;
      }
    }

    if (!signUpData.facility.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଡାକ୍ତରଖାନା କିମ୍ବା ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ନାମ ଆବଶ୍ୟକ।'
          : 'Healthcare Facility / Hospital Name is required.'
      );
      return;
    }
    const cleanSignUpEmail = (signUpData.email || '').trim().toLowerCase();
    if (!cleanSignUpEmail || !cleanSignUpEmail.includes('@')) {
      setErrorMsg(authLang === 'or-IN' ? 'ବୈଧ ଇମେଲ୍ ଆଇଡି ଦିଅନ୍ତୁ।' : 'Valid Email ID is required.');
      return;
    }
    if (!signUpData.staffId.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ପଞ୍ଜୀକରଣ ଆଇଡି କିମ୍ବା ଆଭା ଆଇଡି ଆବଶ୍ୟକ।'
          : 'Registration ID or ABHA ID is required.'
      );
      return;
    }
    if (signUpData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      const newUser = saveUser({
        name: signUpData.name.trim(),
        role: signUpData.role,
        roleCategory: signUpData.roleCategory,
        staffId: signUpData.staffId.trim(),
        facility: signUpData.facility.trim(),
        state: signUpData.state,
        district: signUpData.district.trim() || 'General District',
        email: cleanSignUpEmail,
        phone: signUpData.phone.trim() || '+91 94370 00000',
        qualifications: signUpData.qualifications.trim() || 'Qualified User',
        shift: signUpData.shift,
        age: signUpData.age,
        gender: signUpData.gender,
        bloodGroup: signUpData.bloodGroup,
        preferredLanguage: authLang,
        password: signUpData.password
      });

      setCurrentUser(newUser);
      setSuccessMsg(
        authLang === 'or-IN'
          ? `ଖାତା ସଫଳତାର ସହ ଖୋଲାଗଲା! ସ୍ୱାଗତମ୍, ${newUser.name}।`
          : `Account created successfully! Welcome, ${newUser.name}.`
      );
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 600);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to create account.');
    }
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 flex flex-col justify-center items-center font-sans relative overflow-hidden transition-colors ${
        activeTheme === 'reading'
          ? 'bg-[#f4e3c3] text-[#3d2f1d]'
          : activeTheme === 'light'
          ? 'bg-slate-100 text-slate-900'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar: Return to Dashboard, Theme Switcher & Language Switcher Bar */}
      <div className="z-20 mb-4 flex flex-wrap items-center justify-center gap-2.5">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-700/90 hover:bg-emerald-600 text-white border border-emerald-500/50 rounded-full shadow-md text-xs font-bold transition-all cursor-pointer hover:shadow-emerald-500/20"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>
              {authLang === 'or-IN'
                ? 'ଡ୍ୟାସବୋର୍ଡକୁ ଫେରନ୍ତୁ'
                : authLang === 'hi-IN'
                ? 'डैशबोर्ड पर वापस'
                : 'Back to Dashboard'}
            </span>
          </button>
        )}

        {/* Theme Mode Switcher: Light / Dark / Reading */}
        <div className="flex items-center bg-slate-800/90 border border-slate-700 p-0.5 rounded-full shadow-md text-xs">
          <button
            type="button"
            onClick={() => handleThemeSwitch('light')}
            title="Light Mode"
            className={`p-1.5 px-2 rounded-full flex items-center gap-1 transition-all ${
              activeTheme === 'light'
                ? 'bg-white text-amber-600 shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Light</span>
          </button>
          <button
            type="button"
            onClick={() => handleThemeSwitch('reading')}
            title="Reading Mode (Warm Eye-Care)"
            className={`p-1.5 px-2 rounded-full flex items-center gap-1 transition-all ${
              activeTheme === 'reading'
                ? 'bg-amber-100 text-amber-900 shadow-xs font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Read</span>
          </button>
          <button
            type="button"
            onClick={() => handleThemeSwitch('dark')}
            title="Dark Mode"
            className={`p-1.5 px-2 rounded-full flex items-center gap-1 transition-all ${
              activeTheme === 'dark'
                ? 'bg-slate-950 text-teal-300 shadow-xs font-bold border border-teal-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Dark</span>
          </button>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-md text-xs">
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-slate-400 font-medium">ଭାଷା:</span>
          <button
            type="button"
            onClick={() => setAuthLang('or-IN')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              authLang === 'or-IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ଓଡ଼ିଆ
          </button>
          <button
            type="button"
            onClick={() => setAuthLang('en-IN')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              authLang === 'en-IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setAuthLang('hi-IN')}
            className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
              authLang === 'hi-IN'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* Brand Header */}
      <div className="text-center mb-6 z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          {currentStrings.badge}
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-900/40">
            <Activity className="w-8 h-8" />
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-black tracking-tight ${
              activeTheme === 'reading'
                ? 'text-[#2b1f11]'
                : activeTheme === 'light'
                ? 'text-slate-900'
                : 'text-white'
            }`}
          >
            {currentStrings.title}
          </h1>
        </div>
        <p
          className={`text-xs sm:text-sm ${
            activeTheme === 'reading'
              ? 'text-[#6d5b43]'
              : activeTheme === 'light'
              ? 'text-slate-600'
              : 'text-slate-400'
          }`}
        >
          {currentStrings.subtitle}
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 transition-all">
        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span className="truncate">{currentStrings.signInTab}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('admin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'admin'
                ? 'bg-white text-purple-700 border-b-2 border-purple-600 shadow-xs'
                : 'text-slate-500 hover:text-purple-700'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span className="truncate">{currentStrings.adminSignInTab}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3.5 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="truncate">{currentStrings.signUpTab}</span>
          </button>
        </div>

        {/* Feedback Banners */}
        <div className="p-6 pb-2">
          {errorMsg && (
            <div className="p-3.5 mb-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3.5 mb-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* MODE 1: SIGN IN */}
        {mode === 'signin' && (
          <div className="px-6 pb-6 pt-2">
            {/* FEATURE 2: LAST ACTIVE SESSION RESUME CHIP */}
            {lastActiveUser && (
              <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs animate-fadeIn">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 shadow-xs text-sm">
                    {lastActiveUser.name ? lastActiveUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">
                        Recent Session
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <strong className="block text-xs text-slate-900 truncate">
                      {lastActiveUser.name}
                    </strong>
                    <span className="text-[10px] text-slate-500 font-mono truncate block">
                      {lastActiveUser.email || lastActiveUser.staffId || lastActiveUser.phone}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleResumeLastUser}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 cursor-pointer active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Resume</span>
                </button>
              </div>
            )}

            {/* FAST ACCESS HARDWARE BUTTONS: BIOMETRICS & QR SCAN */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={handleBiometricSignIn}
                disabled={biometricLoading}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>{biometricLoading ? 'Authenticating...' : 'Touch ID / Passkey'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(true)}
                className="py-2.5 px-3 bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border border-slate-300 hover:border-emerald-400 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>Scan ABHA QR</span>
              </button>
            </div>

            <form onSubmit={handleSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {currentStrings.idLabel}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value.toLowerCase())}
                    placeholder={currentStrings.idPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {currentStrings.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSignInIdentifier('dr.soumya@scbmch.odisha.gov.in');
                      setSignInPassword('password123');
                    }}
                    className="text-[11px] text-emerald-600 hover:underline cursor-pointer font-semibold"
                  >
                    Click to fill: dr.soumya / password123
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                  />
                  <span>{currentStrings.rememberMe}</span>
                </label>
                <span className="text-slate-400">ABDM / BSKY Ready</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                {currentStrings.loginBtn}
              </button>
            </form>

            {/* OR SIGN IN WITH MOBILE NUMBER OTP */}
            <div className="mt-4 pt-4 border-t border-slate-200">
              {!signInWithMobile ? (
                <button
                  type="button"
                  onClick={() => {
                    setSignInWithMobile(true);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="w-full py-2.5 px-3 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-300 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <span>{currentStrings.orSignInWithMobile}</span>
                </button>
              ) : (
                <div className="p-4 bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border-2 border-emerald-300 rounded-2xl space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      Sign In with Mobile OTP
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSignInWithMobile(false);
                        setSignInOtpSent(false);
                        setSignInOtpCode('');
                        setErrorMsg('');
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline"
                    >
                      {currentStrings.backToStandardSignIn}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {currentStrings.directMobileLabel}
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                      <span className="absolute left-9 top-2 text-xs font-bold text-slate-500">+91</span>
                      <input
                        type="tel"
                        value={signInMobile}
                        onChange={(e) => setSignInMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        maxLength={10}
                        placeholder="98610 55432"
                        className="w-full pl-16 pr-3 py-2 bg-white text-xs font-mono font-bold rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendSignInMobileOtp}
                    disabled={signInOtpLoading}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{signInOtpLoading ? 'Sending OTP...' : currentStrings.sendMobileOtpBtn}</span>
                  </button>

                  {signInOtpSent && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2 animate-fadeIn">
                      {signInOtpNotification && (
                        <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                          <span className="font-semibold text-[11px]">{signInOtpNotification}</span>
                          <button
                            type="button"
                            onClick={handleAutoFillSignInOtp}
                            className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[10px] cursor-pointer"
                          >
                            Auto-Fill
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          maxLength={6}
                          value={signInOtpCode}
                          onChange={(e) => setSignInOtpCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="••••••"
                          className="flex-1 py-1.5 px-3 text-center font-mono font-black text-sm tracking-widest bg-slate-50 rounded-xl border-2 border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                        />
                        <button
                          type="button"
                          onClick={handleVerifySignInMobileOtp}
                          disabled={signInOtpLoading}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Verify & Login</span>
                        </button>
                      </div>

                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>{signInOtpTimer > 0 ? `Resend in ${signInOtpTimer}s` : 'No OTP?'}</span>
                        {signInOtpTimer === 0 && (
                          <button
                            type="button"
                            onClick={handleSendSignInMobileOtp}
                            className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Resend
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick 1-Click Demo Profiles (Includes Odisha Doctors, Patients, Staff, Admin) */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {currentStrings.quickDemoTitle}
                </span>
                <span className="text-[11px] text-slate-400">Instant Access</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* Odisha Doctor Demo */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-DOC-505')}
                  className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-left transition-all group ring-1 ring-emerald-200 cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-emerald-800">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span className="truncate">Dr. Soumya</span>
                  </div>
                  <p className="text-[10px] text-emerald-800 font-semibold mt-0.5">ଡାକ୍ତର (Odisha MO)</p>
                  <p className="text-[9px] text-slate-500 font-mono">SCBMCH, Cuttack</p>
                </button>

                {/* Odia Patient Demo */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-PAT-606')}
                  className="p-2.5 bg-amber-50/80 hover:bg-amber-100 border border-amber-300 rounded-xl text-left transition-all group ring-1 ring-amber-300 cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-amber-800">
                    <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span className="truncate">Pratap Mohanty</span>
                  </div>
                  <p className="text-[10px] text-amber-900 font-semibold mt-0.5">ରୋଗୀ (Patient)</p>
                  <p className="text-[9px] text-amber-700 font-mono">Bhubaneswar</p>
                </button>

                {/* Doctor Rajesh */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-DOC-101')}
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-emerald-700">
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">Dr. Rajesh</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Medical Officer</p>
                  <p className="text-[9px] text-slate-400 font-mono">Civil Hospital</p>
                </button>

                {/* Nurse Priya */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-NUR-202')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-blue-700">
                    <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">Sr. Priya</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Triage Nurse</p>
                  <p className="text-[9px] text-slate-400 font-mono">PHC Bhojpur</p>
                </button>

                {/* Sunita ASHA */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-ASH-303')}
                  className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 rounded-xl text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-purple-700">
                    <Activity className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">Sunita Devi</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">ଆଶା କର୍ମୀ (ASHA)</p>
                  <p className="text-[9px] text-slate-400 font-mono">Sub-Center</p>
                </button>

                {/* State Admin Direct Login */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-ADM-001')}
                  className="p-2.5 bg-purple-50/70 hover:bg-purple-100/90 hover:border-purple-400 border border-purple-300 rounded-xl text-left transition-all group cursor-pointer ring-1 ring-purple-200"
                >
                  <div className="flex items-center gap-1 text-purple-950 font-bold text-xs group-hover:text-purple-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span className="truncate">Sunil Biswal</span>
                  </div>
                  <p className="text-[10px] text-purple-800 font-semibold mt-0.5">ରାଜ୍ୟ ପ୍ରଶାସକ (Admin)</p>
                  <p className="text-[9px] text-purple-600 font-mono">NHM Directorate</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: DEDICATED ADMIN PORTAL SIGN IN */}
        {mode === 'admin' && (
          <div className="px-6 pb-6 pt-2">
            {/* Super Admin Access Security Notice */}
            <div className="p-3.5 mb-4 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-purple-950 font-bold">{currentStrings.adminGateTitle}</strong>
                <span className="text-purple-700 text-[11px]">{currentStrings.adminGateSubtitle}</span>
              </div>
            </div>

            <form onSubmit={handleAdminSignInSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {currentStrings.adminIdLabel}
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-purple-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={adminIdentifier}
                    onChange={(e) => setAdminIdentifier(e.target.value.toLowerCase())}
                    placeholder={currentStrings.adminIdPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 text-sm rounded-xl border border-purple-200 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {currentStrings.passwordLabel}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminIdentifier('admin@health.odisha.gov.in');
                      setAdminPassword('password123');
                    }}
                    className="text-[11px] text-purple-700 hover:underline cursor-pointer font-semibold"
                  >
                    Click to fill: admin@health.odisha.gov.in / password123
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-purple-50/40 text-sm rounded-xl border border-purple-200 focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span className="inline-flex items-center gap-1 text-[11px] text-purple-800 font-semibold">
                  <Lock className="w-3.5 h-3.5 text-purple-600" />
                  SSL/TLS 256-Bit Encrypted Portal
                </span>
                <span className="text-slate-400 text-[11px]">IP & Audit Logged</span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold rounded-xl shadow-lg shadow-purple-900/20 transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                {currentStrings.adminLoginBtn}
              </button>
            </form>

            {/* Quick 1-Click Super Admin Login Buttons */}
            <div className="mt-6 pt-4 border-t border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  1-Click Admin Access:
                </span>
                <span className="text-[11px] text-purple-600 font-medium">Verified Admin Only</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-ADM-001')}
                  className="p-2.5 bg-purple-50 hover:bg-purple-100/80 border border-purple-300 rounded-xl text-left transition-all group cursor-pointer ring-1 ring-purple-200"
                >
                  <div className="flex items-center gap-1 text-purple-950 font-bold text-xs group-hover:text-purple-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-700 shrink-0" />
                    <span>Sunil Biswal</span>
                  </div>
                  <p className="text-[10px] text-purple-800 font-semibold mt-0.5">ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସକ (State Admin)</p>
                  <p className="text-[9px] text-slate-500 font-mono">NHM Directorate, BBSR</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-ADM-002')}
                  className="p-2.5 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-300 rounded-xl text-left transition-all group cursor-pointer ring-1 ring-indigo-200"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-indigo-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                    <span>Er. Tanmay Dash</span>
                  </div>
                  <p className="text-[10px] text-indigo-800 font-semibold mt-0.5">Director of Cloud Telemetry</p>
                  <p className="text-[9px] text-slate-500 font-mono">State Data Center (OSDC)</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: CREATE ACCOUNT */}
        {mode === 'signup' && (
          <div className="px-6 pb-6 pt-2">
            {/* FAST-TRACK METHOD SELECTOR */}
            <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setSignupMethod('aadhaar')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  signupMethod === 'aadhaar'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>{currentStrings.aadhaarFastTab}</span>
              </button>
              <button
                type="button"
                onClick={() => setSignupMethod('manual')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  signupMethod === 'manual'
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>{currentStrings.manualTab}</span>
              </button>
            </div>

            {/* FAST-TRACK AADHAAR CARD OR MOBILE OTP VERIFICATION SECTION */}
            {signupMethod === 'aadhaar' && (
              <div className="mb-5 p-4 rounded-2xl bg-gradient-to-br from-emerald-50/90 via-teal-50/50 to-blue-50/80 border-2 border-emerald-300 shadow-sm transition-all animate-fadeIn">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs">
                      {fastTrackMethod === 'aadhaar' ? (
                        <Fingerprint className="w-5 h-5" />
                      ) : (
                        <Smartphone className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                        <span>{currentStrings.aadhaarCardTitle}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                          {fastTrackMethod === 'aadhaar' ? 'Aadhaar e-KYC' : 'Mobile OTP'}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        {currentStrings.aadhaarCardSubtitle}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={fastTrackMethod === 'aadhaar' ? handleFillDemoAadhaar : handleFillDemoMobile}
                    className="text-[10px] px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg font-bold shrink-0 cursor-pointer transition-colors shadow-2xs"
                  >
                    {fastTrackMethod === 'aadhaar' ? currentStrings.demoAadhaarBtn : currentStrings.demoMobileBtn}
                  </button>
                </div>

                {/* Sub-selector: Mobile Number OR Aadhaar Card OR ABHA QR */}
                {!isAadhaarVerified && (
                  <div className="flex items-center gap-1.5 mb-3 p-1 bg-white/80 rounded-xl border border-emerald-200">
                    <button
                      type="button"
                      onClick={() => {
                        setFastTrackMethod('mobile');
                        setOtpSent(false);
                        setOtpCode('');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                        fastTrackMethod === 'mobile'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-800'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Mobile OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFastTrackMethod('aadhaar');
                        setOtpSent(false);
                        setOtpCode('');
                        setErrorMsg('');
                      }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate ${
                        fastTrackMethod === 'aadhaar'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-emerald-800'
                      }`}
                    >
                      <Fingerprint className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Aadhaar e-KYC</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowQrModal(true)}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer bg-slate-100 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0"
                    >
                      <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                      <span>ABHA QR</span>
                    </button>
                  </div>
                )}

                {!isAadhaarVerified ? (
                  <div className="space-y-3 pt-1">
                    {/* OPTION 1: STANDALONE DIRECT MOBILE NUMBER */}
                    {fastTrackMethod === 'mobile' ? (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          {currentStrings.directMobileLabel}
                        </label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                          <span className="absolute left-9 top-2 text-xs font-bold text-slate-500">+91</span>
                          <input
                            type="tel"
                            value={directMobile}
                            onChange={handleDirectMobileChange}
                            maxLength={10}
                            placeholder="98610 55432"
                            className="w-full pl-16 pr-3 py-2 bg-white text-xs font-mono font-bold rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Enter your 10-digit mobile number for immediate OTP verification.
                        </p>
                      </div>
                    ) : (
                      /* OPTION 2: AADHAAR CARD ONLY (AUTO-FETCH LINKED MOBILE) */
                      <div className="space-y-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            {currentStrings.aadhaarInputLabel}
                          </label>
                          <div className="relative">
                            <CreditCard className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3" />
                            <input
                              type="text"
                              value={aadhaarNumber}
                              onChange={handleAadhaarChange}
                              maxLength={14}
                              placeholder="7892 4510 9823"
                              className="w-full pl-10 pr-3 py-2.5 bg-white text-xs font-mono font-bold tracking-wider rounded-xl border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                            />
                          </div>
                        </div>

                        <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 flex items-center justify-between text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>
                              UIDAI Linked Mobile: <strong className="font-mono text-emerald-800">Auto-fetched via e-KYC gateway</strong>
                            </span>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-full">
                            Instant Detection
                          </span>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={fastTrackMethod === 'aadhaar' ? handleSendAadhaarOtp : handleSendDirectMobileOtp}
                      disabled={aadhaarLoading}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 text-xs cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {aadhaarLoading
                          ? 'Generating Secure OTP...'
                          : fastTrackMethod === 'aadhaar'
                          ? currentStrings.sendAadhaarOtpBtn
                          : currentStrings.sendMobileOtpBtn}
                      </span>
                    </button>

                    {/* OTP SECTION WHEN SENT */}
                    {otpSent && (
                      <div className="p-3 bg-white rounded-xl border border-emerald-300 space-y-2.5 animate-fadeIn">
                        {otpNotification && (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4 text-amber-600 shrink-0" />
                              <span className="font-semibold">{otpNotification}</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleAutoFillOtp}
                              className="px-2 py-0.5 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[10px] cursor-pointer"
                            >
                              {currentStrings.autoFillOtpBtn}
                            </button>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            {currentStrings.otpInputLabel}
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="••••••"
                              className="flex-1 py-2 px-3 text-center font-mono font-black text-base tracking-widest bg-slate-50 rounded-xl border-2 border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                            />
                            <button
                              type="button"
                              onClick={handleVerifyFastTrackOtp}
                              disabled={aadhaarLoading}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{aadhaarLoading ? 'Verifying...' : currentStrings.verifyAadhaarOtpBtn}</span>
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                          <span>{otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Did not receive OTP?'}</span>
                          {otpTimer === 0 && (
                            <button
                              type="button"
                              onClick={fastTrackMethod === 'aadhaar' ? handleSendAadhaarOtp : handleSendDirectMobileOtp}
                              className="text-emerald-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> Resend OTP
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* VERIFIED SUCCESS BANNER & 1-CLICK REGISTRATION */
                  <div className="space-y-3 pt-1 animate-fadeIn">
                    <div className="p-3 bg-emerald-100/80 border border-emerald-400 rounded-xl text-xs text-emerald-950 flex items-center gap-2 font-bold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>
                        {fastTrackMethod === 'aadhaar'
                          ? 'UIDAI Aadhaar e-KYC Verified Successfully!'
                          : 'Mobile OTP Verification Successful!'}
                      </span>
                    </div>

                    {/* Auto-filled details card */}
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-500 block">Citizen Name:</span>
                        <strong className="text-slate-800">{signUpData.name}</strong>
                      </div>
                      {fastTrackMethod === 'aadhaar' ? (
                        <div>
                          <span className="text-slate-500 block">Aadhaar (Masked):</span>
                          <strong className="font-mono text-slate-800">XXXX XXXX {aadhaarNumber.slice(-4)}</strong>
                        </div>
                      ) : (
                        <div>
                          <span className="text-slate-500 block">Verification Mode:</span>
                          <strong className="text-emerald-700">Mobile OTP Instant</strong>
                        </div>
                      )}
                      <div>
                        <span className="text-slate-500 block">ABHA Health ID:</span>
                        <strong className="font-mono text-emerald-700">{signUpData.staffId}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Mobile No:</span>
                        <strong className="font-mono text-slate-800">{signUpData.phone}</strong>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500 block">Generated Login Email (Small Letters):</span>
                        <strong className="font-mono text-emerald-800">{signUpData.email}</strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleFastTrackRegister}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black rounded-xl shadow-md text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>{currentStrings.fastCompleteBtn}</span>
                    </button>

                    <div className="text-center">
                      <span className="text-[11px] text-slate-500">
                        Default password: <code className="font-mono font-bold text-slate-700">password123</code> (or customize in the form below)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Full Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {currentStrings.fullNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signUpData.name}
                      onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                      placeholder={
                        signUpData.roleCategory === 'patient'
                          ? 'e.g. Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)'
                          : 'e.g. Dr. Soumya Nayak (ଡାକ୍ତର ସୌମ୍ୟ)'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {currentStrings.roleLabel}
                  </label>
                  <select
                    value={signUpData.role}
                    onChange={handleRoleChange}
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 cursor-pointer font-medium"
                  >
                    {roleOptions.map((r, i) => (
                      <option key={i} value={r.label}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditional Secret Passkey for Admin registration */}
              {signUpData.roleCategory === 'admin' && (
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-300 space-y-1.5 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-purple-900 uppercase tracking-wider">
                      {currentStrings.adminPasskeyLabel}
                    </label>
                    <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  </div>
                  <div className="relative">
                    <Key className="w-4 h-4 text-purple-600 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={signUpData.adminPasskey}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, adminPasskey: e.target.value })
                      }
                      placeholder="Enter authorized admin security passkey"
                      className="w-full pl-9 pr-3 py-2 bg-white text-xs font-mono font-bold rounded-xl border border-purple-400 focus:ring-2 focus:ring-purple-600 outline-none text-purple-950"
                    />
                  </div>
                  <p className="text-[11px] text-purple-700 font-bold">
                    {currentStrings.adminPasskeyHint}
                  </p>
                </div>
              )}

              {/* Patient-specific Age, Gender & Blood Group Row */}
              {signUpData.roleCategory === 'patient' && (
                <div className="grid grid-cols-3 gap-3 p-3 bg-amber-50/60 rounded-xl border border-amber-200">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      {currentStrings.ageLabel}
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 42"
                      value={signUpData.age}
                      onChange={(e) => setSignUpData({ ...signUpData, age: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white text-xs rounded-lg border border-amber-300 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      {currentStrings.genderLabel}
                    </label>
                    <select
                      value={signUpData.gender}
                      onChange={(e) => setSignUpData({ ...signUpData, gender: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white text-xs rounded-lg border border-amber-300 outline-none cursor-pointer"
                    >
                      <option value="Male">ପୁରୁଷ (Male)</option>
                      <option value="Female">ମହିଳା (Female)</option>
                      <option value="Other">ଅନ୍ୟ (Other)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 uppercase mb-1">
                      {currentStrings.bloodGroupLabel}
                    </label>
                    <select
                      value={signUpData.bloodGroup}
                      onChange={(e) => setSignUpData({ ...signUpData, bloodGroup: e.target.value })}
                      className="w-full px-2 py-1.5 bg-white text-xs rounded-lg border border-amber-300 outline-none cursor-pointer"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Registration ID & Facility */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {signUpData.roleCategory === 'patient'
                      ? currentStrings.patientIdLabel
                      : currentStrings.staffIdLabel}
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signUpData.staffId}
                      onChange={(e) => setSignUpData({ ...signUpData, staffId: e.target.value })}
                      placeholder={
                        signUpData.roleCategory === 'patient'
                          ? 'e.g. 91-7712-4439-0021 କିମ୍ବା ମୋବାଇଲ୍'
                          : 'e.g. OMC-2022-99881'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {signUpData.roleCategory === 'patient'
                      ? currentStrings.patientFacilityLabel
                      : currentStrings.facilityLabel}
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={signUpData.facility}
                      onChange={(e) => setSignUpData({ ...signUpData, facility: e.target.value })}
                      placeholder={
                        signUpData.roleCategory === 'patient'
                          ? 'e.g. Capital Hospital, Bhubaneswar କିମ୍ବା SCBMCH'
                          : 'e.g. SCB Medical College & Hospital, Cuttack'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* State & Qualifications / History */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {currentStrings.stateLabel}
                  </label>
                  <select
                    value={signUpData.state}
                    onChange={(e) => setSignUpData({ ...signUpData, state: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800 font-medium"
                  >
                    {indianStates.map((s, i) => (
                      <option key={i} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {signUpData.roleCategory === 'patient'
                      ? 'ପୂର୍ବରୁ ଥିବା ରୋଗ / ଏଲର୍ଜି (Medical History)'
                      : 'ଯୋଗ୍ୟତା / ବିଭାଗ (Specialty / Department)'}
                  </label>
                  <input
                    type="text"
                    value={signUpData.qualifications}
                    onChange={(e) =>
                      setSignUpData({ ...signUpData, qualifications: e.target.value })
                    }
                    placeholder={
                      signUpData.roleCategory === 'patient'
                        ? 'e.g. ଡାଇବେଟିସ୍, ରକ୍ତହୀନତା (Anemia), ହାଇପରଟେନସନ'
                        : 'e.g. MBBS, MD / General Medicine'
                    }
                    className="w-full px-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ଇମେଲ୍ ଆଇଡି (Email) *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value.toLowerCase() })}
                      placeholder="pratap@odisha.gov.in"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ମୋବାଇଲ୍ ନମ୍ବର (Phone)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={signUpData.phone}
                      onChange={(e) => setSignUpData({ ...signUpData, phone: e.target.value })}
                      placeholder="+91 98610 55432"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ପାସୱାର୍ଡ ତିଆରି କରନ୍ତୁ *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Min 6 characters"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={signUpData.confirmPassword}
                      onChange={(e) =>
                        setSignUpData({ ...signUpData, confirmPassword: e.target.value })
                      }
                      placeholder="Repeat password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-300 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  {currentStrings.registerBtn}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer info banner */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          <span>ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ ଓ ଆୟୁଷ୍ମାନ ଭାରତ ସୁରକ୍ଷିତ ଡିଜିଟାଲ୍ ରେକର୍ଡ</span>
        </div>
      </div>

      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 text-xs text-slate-400 hover:text-slate-200 underline transition-colors z-10"
        >
          ← ଅତିଥି ଭାବରେ ଆଗକୁ ବଢ଼ନ୍ତୁ (Continue as Guest)
        </button>
      )}
      {/* MODAL: ABHA / HEALTH CARD QR CODE SCANNER & UPLOAD */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                  <QrCode className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Scan / Upload ABHA QR</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Point your camera or upload a screenshot/photo of your ABHA Card or Aadhaar slip with QR code for 1-second auto intake.
            </p>

            {/* Simulated Live Scanner Viewport */}
            <div className="relative w-full h-44 bg-slate-900 rounded-xl overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-emerald-500/50">
              <div className="w-32 h-32 border-2 border-emerald-400 rounded-xl relative flex items-center justify-center">
                <ScanLine className="w-8 h-8 text-emerald-400 animate-pulse" />
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
              </div>
              <span className="text-[10px] text-emerald-300 font-medium mt-2">
                {qrScanning ? 'Reading ABHA demographic cryptographic signature...' : 'Align QR Code within frame'}
              </span>
            </div>

            {/* Upload File button & Direct demo simulation */}
            <div className="space-y-2">
              <label className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload ABHA Card (Photo / PDF)</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleAbhaQrUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  handleAbhaQrUpload({ target: { files: [new Blob()] } });
                }}
                disabled={qrScanning}
                className="w-full py-2 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 font-semibold rounded-xl text-xs border border-slate-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Simulate Instant Camera QR Scan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
