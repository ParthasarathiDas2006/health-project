import React, { useState } from 'react';
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
  Globe
} from 'lucide-react';
import { getStoredUsers, saveUser, verifyCredentials, setCurrentUser } from '../utils/authStorage';

/**
 * Authentication Page (Sign In & Create Account)
 * Designed for Indian Public Health & Clinical Triage System
 * Supports English, Hindi, and Odia (ଓଡ଼ିଆ) with instant demo credentials
 */
export default function AuthPage({ onLoginSuccess, onCancel }) {
  const [authLang, setAuthLang] = useState('or-IN'); // Default to Odia as requested
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In form fields
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

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
    confirmPassword: ''
  });

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
    }
  ];

  // Multilingual Strings dictionary
  const i18n = {
    'or-IN': {
      title: 'ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ଡେସ୍କ',
      subtitle: 'ଚିକିତ୍ସକ ଏବଂ ରୋଗୀଙ୍କ ପାଇଁ ବହୁଭାଷୀ ଡିଜିଟାଲ୍ ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାଏଜ୍ ପୋର୍ଟାଲ୍ (ଓଡ଼ିଶା ସଂସ୍କରଣ)',
      badge: 'ଆୟୁଷ୍ମାନ ଭାରତ ଏବଂ ଓଡ଼ିଶା ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (BSKY ଅନ୍ତର୍ଭୁକ୍ତ)',
      signInTab: 'ଲଗ୍ ଇନ୍',
      signUpTab: 'ନୂଆ ଖାତା ଖୋଲନ୍ତୁ',
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
      registerBtn: 'ପଞ୍ଜୀକରଣ କରନ୍ତୁ ଓ ଡେସ୍କ ସକ୍ରିୟ କରନ୍ତୁ'
    },
    'hi-IN': {
      title: 'राष्ट्रीय स्वास्थ्य ट्रायज डेस्क',
      subtitle: 'चिकित्सकों एवं नागरिकों के लिए सुरक्षित बहुभाषी डिजिटल ट्रायज पोर्टल',
      badge: 'आयुष्मान भारत एवं राष्ट्रीय स्वास्थ्य मिशन',
      signInTab: 'साइन इन',
      signUpTab: 'नया खाता बनाएं',
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
      registerBtn: 'पंजीकरण करें और डेस्क सक्रिय करें'
    },
    'en-IN': {
      title: 'National Healthcare Triage Desk',
      subtitle: 'Multimodal Decision-Support & Clinical Intake Portal for Medical Staff & Citizens',
      badge: 'Ayushman Arogya Mandir & National Health Mission',
      signInTab: 'Sign In',
      signUpTab: 'Create Account',
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
      registerBtn: 'Register & Activate Triage Workstation'
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

    if (!signInIdentifier.trim() || !signInPassword.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଦୟାକରି ଆପଣଙ୍କର ଇମେଲ୍ / ଆଭା ଆଇଡି ଏବଂ ପାସୱାର୍ଡ ଦିଅନ୍ତୁ।'
          : 'Please provide both your Email/Staff/ABHA ID and Password.'
      );
      return;
    }

    try {
      const authenticatedUser = verifyCredentials(signInIdentifier, signInPassword);
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

  // Submit Sign Up / Create Account
  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!signUpData.name.trim()) {
      setErrorMsg(authLang === 'or-IN' ? 'ପୂରା ନାମ ଆବଶ୍ୟକ।' : 'Full Name is required.');
      return;
    }
    if (!signUpData.facility.trim()) {
      setErrorMsg(
        authLang === 'or-IN'
          ? 'ଡାକ୍ତରଖାନା କିମ୍ବା ସ୍ୱାସ୍ଥ୍ୟକେନ୍ଦ୍ର ନାମ ଆବଶ୍ୟକ।'
          : 'Healthcare Facility / Hospital Name is required.'
      );
      return;
    }
    if (!signUpData.email.trim() || !signUpData.email.includes('@')) {
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
        email: signUpData.email.trim().toLowerCase(),
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
    <div className="min-h-screen bg-slate-900 py-8 px-4 sm:px-6 flex flex-col justify-center items-center font-sans relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Language Switcher Bar */}
      <div className="z-20 mb-4 flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-full shadow-md text-xs">
        <Globe className="w-3.5 h-3.5 text-emerald-400" />
        <span className="text-slate-400 font-medium">ଭାଷା / Language:</span>
        <button
          type="button"
          onClick={() => setAuthLang('or-IN')}
          className={`px-2.5 py-0.5 rounded-full font-bold transition-colors ${
            authLang === 'or-IN'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          ଓଡ଼ିଆ (Odia)
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

      {/* Brand Header */}
      <div className="text-center mb-6 z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {currentStrings.badge}
        </div>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-emerald-600 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-900/40">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {currentStrings.title}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          {currentStrings.subtitle}
        </p>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 transition-all">
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-slate-100 border-b border-slate-200 text-xs sm:text-sm font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3.5 flex items-center justify-center gap-2 transition-all ${
              mode === 'signin'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4" />
            {currentStrings.signInTab}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-3.5 flex items-center justify-center gap-2 transition-all ${
              mode === 'signup'
                ? 'bg-white text-emerald-700 border-b-2 border-emerald-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            {currentStrings.signUpTab}
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
                    onChange={(e) => setSignInIdentifier(e.target.value)}
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
                  <span className="text-[11px] text-emerald-600 hover:underline cursor-pointer">
                    Demo: password123
                  </span>
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
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm mt-2"
              >
                <LogIn className="w-4 h-4" />
                {currentStrings.loginBtn}
              </button>
            </form>

            {/* Quick 1-Click Demo Profiles (Includes Odisha Doctors & Patients) */}
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
                  className="p-2.5 bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-300 rounded-xl text-left transition-all group ring-1 ring-emerald-200"
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
                  className="p-2.5 bg-amber-50/80 hover:bg-amber-100 border border-amber-300 rounded-xl text-left transition-all group ring-1 ring-amber-300"
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
                  className="p-2.5 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 rounded-xl text-left transition-all group"
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
                  className="p-2.5 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-left transition-all group"
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
                  className="p-2.5 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 border border-slate-200 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-purple-700">
                    <Activity className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="truncate">Sunita Devi</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">ଆଶା କର୍ମୀ (ASHA)</p>
                  <p className="text-[9px] text-slate-400 font-mono">Sub-Center</p>
                </button>

                {/* Patient Rameshwar */}
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('USR-PAT-404')}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded-xl text-left transition-all group"
                >
                  <div className="flex items-center gap-1 text-slate-900 font-bold text-xs group-hover:text-amber-700">
                    <User className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span className="truncate">Rameshwar</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Citizen Patient</p>
                  <p className="text-[9px] text-slate-400 font-mono">ABHA User</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: CREATE ACCOUNT */}
        {mode === 'signup' && (
          <div className="px-6 pb-6 pt-2">
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
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
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
    </div>
  );
}
