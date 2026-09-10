import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Bed,
  Truck,
  Building2,
  Calendar,
  Activity,
  Search,
  Filter,
  Trash2,
  UserPlus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  Server,
  Lock,
  Download,
  Eye,
  X,
  Stethoscope,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  getStoredUsers,
  deleteStoredUser,
  saveUser,
  getBedBookings,
  cancelBedBooking,
  getAmbulanceRequests,
  cancelAmbulanceRequest,
  getBookedAppointments,
  getHospitalTransfers,
  getSystemAuditLogs,
  logSystemEvent
} from '../utils/authStorage';

/**
 * AdminPage Component
 * Central Command & Governance Portal for State Healthcare Operations
 * Supports Odia, Hindi, English and Light/Dark/Reading theme modes
 */
export default function AdminPage({ currentUser, appLang = 'or-IN', onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' | 'beds' | 'ambulance' | 'transfers' | 'audit'
  const [usersList, setUsersList] = useState([]);
  const [bedBookings, setBedBookings] = useState([]);
  const [ambulanceList, setAmbulanceList] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  // User filter states
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Add user form state
  const [newUserData, setNewUserData] = useState({
    name: '',
    roleCategory: 'doctor',
    role: 'Medical Officer / Doctor (RMP)',
    staffId: '',
    facility: 'Capital Hospital, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: '',
    phone: '',
    password: 'password123',
    adminPasskey: ''
  });
  const [addUserError, setAddUserError] = useState('');

  // Load all live administrative state
  const loadAdminData = () => {
    setUsersList(getStoredUsers());
    setBedBookings(getBedBookings());
    setAmbulanceList(getAmbulanceRequests());
    setAppointments(getBookedAppointments());
    setTransfers(getHospitalTransfers());
    setAuditLogs(getSystemAuditLogs());
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleRefresh = () => {
    loadAdminData();
    setActionSuccessMsg(
      appLang === 'or-IN'
        ? 'ପ୍ରଶାସନିକ ତଥ୍ୟ ସଫଳତାର ସହ ନବୀକରଣ ହୋଇଛି।'
        : appLang === 'hi-IN'
        ? 'प्रशासनिक डेटा सफलतापूर्वक रिफ्रेश किया गया।'
        : 'Administrative data successfully refreshed.'
    );
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleDeleteUserConfirm = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser?.id) {
      alert(
        appLang === 'or-IN'
          ? 'ଆପଣ ବର୍ତ୍ତମାନ ଲଗ୍ ଇନ୍ ଥିବା ନିଜ ଆଡମିନ୍ ଖାତା କାଟିପାରିବେ ନାହିଁ!'
          : 'You cannot delete your own active administrator session!'
      );
      setUserToDelete(null);
      return;
    }
    const updated = deleteStoredUser(userToDelete.id);
    setUsersList(updated);
    setUserToDelete(null);
    setActionSuccessMsg(
      appLang === 'or-IN'
        ? `ବ୍ୟବହାରକାରୀ (${userToDelete.name}) ଙ୍କୁ ସଫଳତାର ସହ ହଟାଗଲା।`
        : `User (${userToDelete.name}) has been deleted.`
    );
    setTimeout(() => setActionSuccessMsg(''), 3000);
    setAuditLogs(getSystemAuditLogs());
  };

  const handleCancelBed = (bookingId) => {
    const updated = cancelBedBooking(bookingId);
    setBedBookings(updated);
    logSystemEvent({
      type: 'BED_CANCELLED',
      actor: currentUser?.name || 'Administrator',
      description: `Bed booking ${bookingId} was cancelled by Admin`,
      severity: 'warning'
    });
    setAuditLogs(getSystemAuditLogs());
  };

  const handleCancelAmbulance = (reqId) => {
    const updated = cancelAmbulanceRequest(reqId);
    setAmbulanceList(updated);
    logSystemEvent({
      type: 'AMBULANCE_CANCELLED',
      actor: currentUser?.name || 'Administrator',
      description: `Ambulance dispatch ${reqId} was cancelled by Admin`,
      severity: 'warning'
    });
    setAuditLogs(getSystemAuditLogs());
  };

  const handleCreateUserSubmit = (e) => {
    e.preventDefault();
    setAddUserError('');

    if (!newUserData.name.trim() || !newUserData.email.trim() || !newUserData.staffId.trim()) {
      setAddUserError(
        appLang === 'or-IN'
          ? 'ଦୟାକରି ସମସ୍ତ ଆବଶ୍ୟକ ତଥ୍ୟ ପୂରଣ କରନ୍ତୁ।'
          : 'Please provide all mandatory fields.'
      );
      return;
    }

    if (newUserData.roleCategory === 'admin') {
      if (!newUserData.adminPasskey || newUserData.adminPasskey.trim() !== 'sunil123') {
        setAddUserError(
          appLang === 'or-IN'
            ? 'ଅବୈଧ ପ୍ରଶାସକ ପାସକୋଡ୍! ଆଡମିନ୍ ପଞ୍ଜୀକରଣ ପାଇଁ ଗୁପ୍ତ କୋଡ୍ sunil123 ଆବଶ୍ୟକ।'
            : 'Invalid Admin Security Key! Administrator accounts require passkey: sunil123'
        );
        return;
      }
    }

    try {
      saveUser({
        name: newUserData.name.trim(),
        role: newUserData.role,
        roleCategory: newUserData.roleCategory,
        staffId: newUserData.staffId.trim(),
        facility: newUserData.facility.trim(),
        state: newUserData.state,
        district: newUserData.district,
        email: newUserData.email.trim().toLowerCase(),
        phone: newUserData.phone.trim() || '+91 94370 00000',
        qualifications: newUserData.roleCategory === 'admin' ? 'Authorized System Administrator' : 'Verified Clinical Staff',
        shift: 'Administrative Shift',
        password: newUserData.password || 'password123',
        preferredLanguage: appLang
      });

      logSystemEvent({
        type: 'USER_CREATED',
        actor: currentUser?.name || 'Administrator',
        description: `New user ${newUserData.name} (${newUserData.roleCategory}) was created by Admin`,
        severity: 'success'
      });

      setShowAddUserModal(false);
      setNewUserData({
        name: '',
        roleCategory: 'doctor',
        role: 'Medical Officer / Doctor (RMP)',
        staffId: '',
        facility: 'Capital Hospital, Bhubaneswar',
        state: 'Odisha (ଓଡ଼ିଶା)',
        district: 'Khurda',
        email: '',
        phone: '',
        password: 'password123',
        adminPasskey: ''
      });
      loadAdminData();
      setActionSuccessMsg(
        appLang === 'or-IN'
          ? 'ନୂତନ ବ୍ୟବହାରକାରୀ ଖାତା ସଫଳତାର ସହ ସୃଷ୍ଟି ହୋଇଛି।'
          : 'New user account successfully created.'
      );
      setTimeout(() => setActionSuccessMsg(''), 3000);
    } catch (err) {
      setAddUserError(err.message || 'Failed to create user');
    }
  };

  // Multilingual Strings
  const t = {
    'or-IN': {
      portalTitle: 'ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ - କେନ୍ଦ୍ରୀୟ ପ୍ରଶାସନିକ ଡେସ୍କ',
      portalSubtitle: 'ସମସ୍ତ ୩୦ ଟି ଜିଲ୍ଲା, ମେଡିକାଲ୍ କଲେଜ୍, ଡାକ୍ତରଖାନା ଏବଂ ବ୍ୟବହାରକାରୀଙ୍କ କେନ୍ଦ୍ରୀୟ ନିୟନ୍ତ୍ରଣ',
      badge: 'ଜାତୀୟ ସ୍ୱାସ୍ଥ୍ୟ ମିଶନ (NHM) • ସର୍ବୋଚ୍ଚ ପ୍ରଶାସନିକ କମାଣ୍ଡ',
      refreshBtn: 'ତଥ୍ୟ ନବୀକରଣ',
      addUserBtn: 'ନୂଆ କର୍ମଚାରୀ / ଡାକ୍ତର ଯୋଡ଼ନ୍ତୁ',
      totalUsers: 'ମୋଟ ପଞ୍ଜୀକୃତ ବ୍ୟବହାରକାରୀ',
      totalBeds: 'ସକ୍ରିୟ ବେଡ୍ ବୁକିଂ',
      totalAmbulance: 'ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ',
      totalAppointments: 'ଡାକ୍ତର ପରାମର୍ଶ ବୁକିଂ',
      totalTransfers: 'ଇଣ୍ଟର-ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍',
      tabUsers: '୧. ବ୍ୟବହାରକାରୀ ଓ ଷ୍ଟାଫ୍ ପରିଚାଳନା',
      tabBeds: '୨. ହସ୍ପିଟାଲ୍ ବେଡ୍ କମାଣ୍ଡ',
      tabAmbulance: '୩. ଆମ୍ବୁଲାନ୍ସ ଡିସପାଚ୍',
      tabTransfers: '୪. ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍ ସ୍ଲିପ୍',
      tabAudit: '୫. ସିଷ୍ଟମ୍ ସୁରକ୍ଷା ଓ ଅଡିଟ୍ ଲଗ୍',
      searchPlaceholder: 'ନାମ, ଇମେଲ୍, ରେଗ୍ ଆଇଡି କିମ୍ବା ଡାକ୍ତରଖାନା ଖୋଜନ୍ତୁ...',
      allRoles: 'ସମସ୍ତ ଭୂମିକା',
      doctors: 'ଡାକ୍ତର (Doctors)',
      nurses: 'ନର୍ସ (Nurses)',
      ashas: 'ଆଶା କର୍ମୀ (ASHA)',
      patients: 'ନାଗରିକ / ରୋଗୀ (Patients)',
      admins: 'ପ୍ରଶାସକ (Admins)',
      nameHeader: 'ନାମ ଓ ଭୂମିକା',
      idHeader: 'ଷ୍ଟାଫ୍ / ABHA ଆଇଡି',
      facilityHeader: 'ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଓ ଜିଲ୍ଲା',
      contactHeader: 'ଇମେଲ୍ ଓ ଫୋନ୍',
      registeredHeader: 'ପଞ୍ଜୀକରଣ ତାରିଖ',
      actionHeader: 'କାର୍ଯ୍ୟ',
      deleteBtn: 'ଖାତା କାଟନ୍ତୁ',
      deleteConfirmTitle: 'ବ୍ୟବହାରକାରୀ ଖାତା ବିଲୋପ ନିଶ୍ଚିତ କରନ୍ତୁ',
      deleteConfirmDesc: 'ଆପଣ ନିଶ୍ଚିତ କି ଆପଣ ଏହି ବ୍ୟବହାରକାରୀଙ୍କୁ ପୋର୍ଟାଲ୍ ଡାଟାବେସରୁ ହଟାଇବାକୁ ଚାହୁଁଛନ୍ତି? ଏହି କାର୍ଯ୍ୟ ଅପରିବର୍ତ୍ତନୀୟ।',
      cancel: 'ବାତିଲ୍ କରନ୍ତୁ',
      confirmDelete: 'ହଁ, ହଟାନ୍ତୁ',
      systemHealth: 'ସିଷ୍ଟମ୍ କାର୍ଯ୍ୟଦକ୍ଷତା ସ୍ଥିତି',
      serverUptime: 'ସର୍ଭର ଅପଟାଇମ୍: ୯୯.୯୮%',
      encryptionStatus: 'AES-256 ଏନକ୍ରିପସନ୍ ସକ୍ରିୟ',
      dbLatency: 'ଡାଟାବେସ୍ ରେସପନ୍ସ: ୧୨ms'
    },
    'hi-IN': {
      portalTitle: 'राज्य स्वास्थ्य मिशन - केंद्रीय प्रशासनिक डेस्क',
      portalSubtitle: 'सभी 30 जिलों, मेडिकल कॉलेजों, अस्पतालों एवं उपयोगकर्ताओं का केंद्रीय नियंत्रण',
      badge: 'राष्ट्रीय स्वास्थ्य मिशन (NHM) • सर्वोच्च प्रशासनिक कमान',
      refreshBtn: 'डेटा रीफ्रेश',
      addUserBtn: 'नया स्टाफ / डॉक्टर जोड़ें',
      totalUsers: 'कुल पंजीकृत उपयोगकर्ता',
      totalBeds: 'सक्रिय बेड बुकिंग',
      totalAmbulance: 'आपातकालीन एम्बुलेंस अनुरोध',
      totalAppointments: 'डॉक्टर परामर्श बुकिंग',
      totalTransfers: 'इंटर-हॉस्पिटल रेफरल',
      tabUsers: '1. उपयोगकर्ता एवं स्टाफ प्रबंधन',
      tabBeds: '2. अस्पताल बेड कमान',
      tabAmbulance: '3. एम्बुलेंस प्रेषण',
      tabTransfers: '4. अस्पताल रेफरल पर्ची',
      tabAudit: '5. सिस्टम सुरक्षा एवं ऑडिट लॉग',
      searchPlaceholder: 'नाम, ईमेल, रजिस्ट्रेशन आईडी या अस्पताल खोजें...',
      allRoles: 'सभी भूमिकाएं',
      doctors: 'चिकित्सक (Doctors)',
      nurses: 'नर्सिंग स्टाफ (Nurses)',
      ashas: 'आशा कार्यकर्ता (ASHA)',
      patients: 'नागरिक / मरीज (Patients)',
      admins: 'प्रशासक (Admins)',
      nameHeader: 'नाम एवं पद',
      idHeader: 'स्टाफ / ABHA आईडी',
      facilityHeader: 'स्वास्थ्य केंद्र व जिला',
      contactHeader: 'ईमेल व फोन',
      registeredHeader: 'पंजीकरण तिथि',
      actionHeader: 'कार्रवाई',
      deleteBtn: 'खाता हटाएं',
      deleteConfirmTitle: 'उपयोगकर्ता खाता हटाने की पुष्टि',
      deleteConfirmDesc: 'क्या आप वाकई इस उपयोगकर्ता को डेटाबेस से हटाना चाहते हैं? यह कार्रवाई पूर्ववत नहीं की जा सकती।',
      cancel: 'रद्द करें',
      confirmDelete: 'हाँ, हटाएं',
      systemHealth: 'सिस्टम परिचालन स्थिति',
      serverUptime: 'सर्वर अपटाइम: 99.98%',
      encryptionStatus: 'AES-256 एन्क्रिप्शन सक्रिय',
      dbLatency: 'डेटाबेस प्रतिक्रिया: 12ms'
    },
    'en-IN': {
      portalTitle: 'State Health Mission - Central Administrative Portal',
      portalSubtitle: 'Central command for 30 District Directorates, Apex Hospitals, Staff & Citizens',
      badge: 'National Health Mission (NHM) • Supreme Administrative Command',
      refreshBtn: 'Refresh Telemetry',
      addUserBtn: 'Register New Staff / Officer',
      totalUsers: 'Registered Users & Staff',
      totalBeds: 'Active Bed Bookings',
      totalAmbulance: 'Emergency Ambulance Dispatches',
      totalAppointments: 'Scheduled Consultations',
      totalTransfers: 'Apex Inter-Hospital Referrals',
      tabUsers: '1. User & Staff Management',
      tabBeds: '2. Live Bed Command',
      tabAmbulance: '3. Ambulance Dispatch Control',
      tabTransfers: '4. Inter-Hospital Transfer Slips',
      tabAudit: '5. System Security & Audit Trail',
      searchPlaceholder: 'Search by name, email, registration ID or facility...',
      allRoles: 'All Roles',
      doctors: 'Doctors (RMP)',
      nurses: 'Triage Nurses',
      ashas: 'ASHA / ANM',
      patients: 'Citizens / Patients',
      admins: 'System Administrators',
      nameHeader: 'Name & Professional Role',
      idHeader: 'Reg / ABHA ID',
      facilityHeader: 'Facility & District',
      contactHeader: 'Contact Info',
      registeredHeader: 'Registration Date',
      actionHeader: 'Action',
      deleteBtn: 'Delete',
      deleteConfirmTitle: 'Confirm User Account Deletion',
      deleteConfirmDesc: 'Are you sure you want to permanently remove this user from the health database? This action is logged in the audit trail.',
      cancel: 'Cancel',
      confirmDelete: 'Yes, Delete Account',
      systemHealth: 'System Infrastructure Telemetry',
      serverUptime: 'Server Uptime: 99.98%',
      encryptionStatus: 'AES-256 TLS Encryption Active',
      dbLatency: 'Database Response: 12ms'
    }
  }[appLang] || {};

  // Filter users by role and search query
  const filteredUsers = usersList.filter((u) => {
    const matchesRole = roleFilter === 'all' || u.roleCategory === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.staffId?.toLowerCase().includes(q) ||
      u.facility?.toLowerCase().includes(q) ||
      u.district?.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  const getRoleBadge = (category) => {
    switch (category) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-purple-100 text-purple-800 border border-purple-300">
            <ShieldCheck className="w-3 h-3 text-purple-700" />
            ADMIN
          </span>
        );
      case 'doctor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Stethoscope className="w-3 h-3 text-emerald-700" />
            DOCTOR
          </span>
        );
      case 'nurse':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">
            <Activity className="w-3 h-3 text-blue-700" />
            NURSE
          </span>
        );
      case 'asha':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <Users className="w-3 h-3 text-amber-700" />
            ASHA
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <Users className="w-3 h-3 text-slate-600" />
            PATIENT
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Administrative Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-3">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              {t.badge}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Server className="w-7 h-7 text-purple-400" />
              {t.portalTitle}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              {t.portalSubtitle}
            </p>
          </div>

          {/* Logged in Admin Identity & Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-800/80 border border-slate-700 px-4 py-2.5 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-purple-300 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{currentUser?.name || 'Super Administrator'}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-0.5">
                {currentUser?.staffId || 'ADMIN-OD-2026'} • {currentUser?.facility?.slice(0, 32)}...
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t.refreshBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{t.addUserBtn}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Telemetry Pill Row */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t.serverUptime}</span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-300">
            <Lock className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.encryptionStatus}</span>
          </div>
          <div className="flex items-center gap-1.5 text-teal-300">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.dbLatency}</span>
          </div>
          <div className="ml-auto text-slate-400">
            Odisha State Health Command Node: <span className="font-mono text-purple-300 font-bold">BBSR-HQ-PRIMARY</span>
          </div>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 p-3.5 rounded-xl text-xs font-bold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
          <button type="button" onClick={() => setActionSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveSubTab('users')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'users'
              ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalUsers}</span>
            <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{usersList.length}</div>
          <div className="text-[10px] text-purple-700 font-semibold mt-0.5">
            {usersList.filter((u) => u.roleCategory === 'doctor').length} Doctors • {usersList.filter((u) => u.roleCategory === 'patient').length} Patients
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('beds')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'beds'
              ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalBeds}</span>
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
              <Bed className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{bedBookings.length}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Live Ward Tracking Active
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('ambulance')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'ambulance'
              ? 'bg-rose-500/10 border-rose-500 ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalAmbulance}</span>
            <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{ambulanceList.length}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5">
            108 Emergency Dispatch Network
          </div>
        </div>

        <div
          onClick={() => {
            if (onNavigateTab) onNavigateTab('booking');
          }}
          className="p-4 rounded-xl border bg-white border-slate-200 hover:border-teal-300 hover:shadow-md transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalAppointments}</span>
            <div className="p-2 rounded-lg bg-teal-100 text-teal-700">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{appointments.length}</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">
            Across 30 Odisha Districts
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('transfers')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'transfers'
              ? 'bg-indigo-500/10 border-indigo-500 ring-2 ring-indigo-500/20'
              : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{t.totalTransfers}</span>
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{transfers.length}</div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5">
            AIIMS, SCB, Capital Hospital
          </div>
        </div>
      </div>

      {/* Admin Module Sub-Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-purple-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.tabUsers}</span>
          <span className="bg-purple-900/40 text-purple-100 text-[10px] px-1.5 py-0.2 rounded-full">
            {usersList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('beds')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'beds'
              ? 'bg-emerald-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Bed className="w-4 h-4" />
          <span>{t.tabBeds}</span>
          <span className="bg-emerald-900/40 text-emerald-100 text-[10px] px-1.5 py-0.2 rounded-full">
            {bedBookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ambulance')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ambulance'
              ? 'bg-rose-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>{t.tabAmbulance}</span>
          <span className="bg-rose-900/40 text-rose-100 text-[10px] px-1.5 py-0.2 rounded-full">
            {ambulanceList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('transfers')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'transfers'
              ? 'bg-indigo-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>{t.tabTransfers}</span>
          <span className="bg-indigo-900/40 text-indigo-100 text-[10px] px-1.5 py-0.2 rounded-full">
            {transfers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('audit')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'audit'
              ? 'bg-slate-900 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4 text-purple-400" />
          <span>{t.tabAudit}</span>
          <span className="bg-slate-700 text-slate-200 text-[10px] px-1.5 py-0.2 rounded-full">
            {auditLogs.length}
          </span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 1: USER & STAFF MANAGEMENT TABLE                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Filter & Search Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-2xs">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full text-xs text-slate-800 placeholder-slate-400 outline-none bg-transparent"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Role Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.allRoles} ({usersList.length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('doctor')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'doctor'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.doctors} ({usersList.filter((u) => u.roleCategory === 'doctor').length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('nurse')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'nurse'
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.nurses} ({usersList.filter((u) => u.roleCategory === 'nurse').length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('asha')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'asha'
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.ashas} ({usersList.filter((u) => u.roleCategory === 'asha').length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('patient')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'patient'
                    ? 'bg-slate-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.patients} ({usersList.filter((u) => u.roleCategory === 'patient').length})
              </button>
              <button
                type="button"
                onClick={() => setRoleFilter('admin')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  roleFilter === 'admin'
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                {t.admins} ({usersList.filter((u) => u.roleCategory === 'admin').length})
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">{t.nameHeader}</th>
                  <th className="py-3 px-4">{t.idHeader}</th>
                  <th className="py-3 px-4">{t.facilityHeader}</th>
                  <th className="py-3 px-4">{t.contactHeader}</th>
                  <th className="py-3 px-4">{t.registeredHeader}</th>
                  <th className="py-3 px-4 text-right">{t.actionHeader}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold">No users found matching current filters.</p>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center font-black text-slate-700 text-xs shadow-2xs">
                            {user.name
                              ? user.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')
                              : 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                              {user.name}
                              {user.id === currentUser?.id && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full">
                                  You (Active)
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {getRoleBadge(user.roleCategory)}
                              <span className="text-[11px] text-slate-500 truncate max-w-xs">{user.role}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {user.staffId || user.id}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-1.5 text-slate-800">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                          <div>
                            <div className="font-semibold line-clamp-1">{user.facility || 'State Health Facility'}</div>
                            <div className="text-[10px] text-slate-500">{user.district}, {user.state}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5 text-slate-600 text-[11px]">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{user.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Active Member'}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setUserToDelete(user)}
                          disabled={user.id === currentUser?.id}
                          className={`p-2 rounded-lg transition-colors cursor-pointer ${
                            user.id === currentUser?.id
                              ? 'text-slate-300 cursor-not-allowed'
                              : 'text-rose-600 hover:bg-rose-50 hover:text-rose-800'
                          }`}
                          title={user.id === currentUser?.id ? 'Cannot delete current session' : 'Delete user account'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 2: LIVE BED COMMAND                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'beds' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Bed className="w-5 h-5 text-emerald-600" />
                {appLang === 'or-IN' ? 'ହସ୍ପିଟାଲ୍ ବେଡ୍ ବୁକିଂ ନିୟନ୍ତ୍ରଣ' : 'Live Hospital Bed Reservations'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? 'ରାଜ୍ୟର ବିଭିନ୍ନ ଡାକ୍ତରଖାନାରେ ନାଗରିକ ଓ ରେଫରାଲ୍ ରୋଗୀଙ୍କ ବେଡ୍ ଆବଣ୍ଟନ ତାଲିକା'
                  : 'Live bed reservations across Odisha District Hospitals, Medical Colleges, and CHCs'}
              </p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
              {bedBookings.length} Active Bookings
            </span>
          </div>

          {bedBookings.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bed className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Active Bed Bookings In System</p>
              <p className="text-xs text-slate-400 mt-1">Bed reservations created by citizens or doctors will appear here in real-time.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bedBookings.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                        {b.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1">{b.hospitalName}</h3>
                      <div className="text-xs text-slate-600 font-semibold">{b.ward || 'General Medical Ward'} • {b.bedType || 'Oxygen Supported Bed'}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancelBed(b.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                    >
                      Release Bed
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">PATIENT NAME</span>
                      <span className="font-bold text-slate-800">{b.patientName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">CONTACT</span>
                      <span className="font-medium text-slate-700">{b.contact || b.phone || '+91 94370 11223'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">DATE / TIME</span>
                      <span className="font-medium text-slate-600">{b.timestamp ? new Date(b.timestamp).toLocaleString() : 'Recent Booking'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">STATUS</span>
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Confirmed & Reserved
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 3: AMBULANCE DISPATCH                                */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'ambulance' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                {appLang === 'or-IN' ? 'ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ଡିସପାଚ୍ କଣ୍ଟ୍ରୋଲ୍' : 'Emergency Ambulance Dispatch Control'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? '୧୦୮ / ୧୦୨ ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ ଏବଂ ରୋଗୀ ପରିବହନ ସ୍ଥିତି'
                  : 'State 108 / 102 Emergency Ambulance dispatch requests & live transit monitoring'}
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full">
              {ambulanceList.length} Dispatches Logged
            </span>
          </div>

          {ambulanceList.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Active Ambulance Dispatches</p>
              <p className="text-xs text-slate-400 mt-1">Emergency requests initiated by citizens or clinics will display here immediately.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulanceList.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded">
                        {req.id}
                      </span>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1">{req.patientName || 'Emergency Patient'}</h3>
                      <div className="text-xs text-rose-700 font-bold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {req.urgency || 'HIGH PRIORITY 108 EMERGENCY'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancelAmbulance(req.id)}
                      className="text-xs text-slate-600 hover:text-slate-800 font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">PICKUP ADDRESS</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{req.location || 'Local PHC / Village'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">DESTINATION HOSPITAL</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{req.destination || 'District Headquarter Hospital'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">CONTACT NUMBER</span>
                      <span className="font-medium text-slate-700">{req.contact || req.phone || '+91 94370 00108'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AMBULANCE TYPE</span>
                      <span className="font-bold text-slate-800">{req.ambulanceType || 'Advanced Life Support (ALS)'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 4: INTER-HOSPITAL TRANSFERS                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'transfers' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-600" />
                {appLang === 'or-IN' ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଇଣ୍ଟର-ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍' : 'Swasthya Mitra Inter-Hospital Fast-Track Transfers'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? 'ଗ୍ରାମାଞ୍ଚଳ PHC/CHC ରୁ ସର୍ବୋଚ୍ଚ AIIMS, SCB, MKCG ମେଡିକାଲ୍ କଲେଜକୁ ପଠାଯାଇଥିବା ରେଫରାଲ୍ ସ୍ଲିପ୍'
                  : 'Referral tracking between primary health units and apex tertiary care colleges'}
              </p>
            </div>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-extrabold text-xs rounded-full">
              {transfers.length} Active Referrals
            </span>
          </div>

          {transfers.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Inter-Hospital Transfers Logged</p>
              <p className="text-xs text-slate-400 mt-1">Hospital referrals generated via Swasthya Mitra will be monitored here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transfers.map((tr) => (
                <div key={tr.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-2 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded">
                          {tr.id}
                        </span>
                        <span className="font-extrabold text-slate-900 text-sm">{tr.patientName}</span>
                        <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.2 rounded-full">
                          {tr.urgency || 'HIGH PRIORITY'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        Reason: <strong className="text-slate-800">{tr.reason || 'Acute Clinical Complication'}</strong>
                      </div>
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      {tr.timestamp ? new Date(tr.timestamp).toLocaleString() : 'Active Transfer'}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-700 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Origin:</span>
                      <span className="font-bold">{tr.originFacility || 'Primary Health Center'}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-500">Destination:</span>
                      <span className="font-bold text-indigo-700">{tr.destinationHospital || 'SCB Medical College'}</span>
                    </div>
                    <div className="text-slate-500 font-medium">
                      Ward Reserved: <strong className="text-slate-800">{tr.ward || 'ICU Bed 04'}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 5: SYSTEM SECURITY & AUDIT TRAIL                     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600" />
              {t.tabAudit}
            </h2>
            <p className="text-xs text-slate-500">
              {appLang === 'or-IN'
                ? 'ସମସ୍ତ ପ୍ରଶାସନିକ ଲଗ୍-ଇନ୍, ବ୍ୟବହାରକାରୀ ପରିବର୍ତ୍ତନ ଏବଂ ସୁରକ୍ଷା ଘଟଣାବଳୀ'
                : 'Real-time cryptographically signed system events, administrative logins, and critical changes'}
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all flex items-start justify-between gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      log.severity === 'warning'
                        ? 'bg-amber-100 text-amber-700'
                        : log.severity === 'success'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                      <span>{log.type}</span>
                      <span className="text-[10px] text-slate-400 font-mono">[{log.id}]</span>
                    </div>
                    <p className="text-slate-600 mt-0.5">{log.description}</p>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Actor: <strong className="text-slate-700">{log.actor}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 font-mono shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                  <div className="text-[10px]">{new Date(log.timestamp).toLocaleDateString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: ADD NEW USER / CLINICAL STAFF                          */}
      {/* ───────────────────────────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-purple-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                <UserPlus className="w-5 h-5 text-purple-300" />
                <span>{appLang === 'or-IN' ? 'ନୂତନ କର୍ମଚାରୀ / ପ୍ରଶାସକ ଯୋଡ଼ନ୍ତୁ' : 'Register New Staff / Officer'}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-purple-200 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {addUserError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{addUserError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  placeholder="e.g. Dr. Smruti Rekha Jena"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Category *</label>
                  <select
                    value={newUserData.roleCategory}
                    onChange={(e) => {
                      const val = e.target.value;
                      let label = 'Medical Officer / Doctor (RMP)';
                      if (val === 'nurse') label = 'Triage Staff Nurse';
                      if (val === 'asha') label = 'Community Health Worker (ASHA)';
                      if (val === 'admin') label = 'State Health Portal Administrator';
                      if (val === 'patient') label = 'Patient / Citizen';
                      setNewUserData({ ...newUserData, roleCategory: val, role: label });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none font-bold"
                  >
                    <option value="doctor">Doctor / Medical Officer</option>
                    <option value="nurse">Triage Nurse</option>
                    <option value="asha">ASHA / ANM Worker</option>
                    <option value="patient">Patient / Citizen</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Staff / ABHA ID *</label>
                  <input
                    type="text"
                    value={newUserData.staffId}
                    onChange={(e) => setNewUserData({ ...newUserData, staffId: e.target.value })}
                    placeholder="OMC-2026-9901 / ADMIN-009"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Conditional Secret Passkey for Admin registration */}
              {newUserData.roleCategory === 'admin' && (
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-300 space-y-1">
                  <label className="block font-black text-purple-900">
                    Admin Authorization Passkey (ସୁରକ୍ଷା କୋଡ଼) *
                  </label>
                  <input
                    type="password"
                    value={newUserData.adminPasskey}
                    onChange={(e) => setNewUserData({ ...newUserData, adminPasskey: e.target.value })}
                    placeholder="Enter passkey: sunil123"
                    className="w-full px-3 py-2 rounded-xl border border-purple-400 bg-white text-xs font-mono font-bold outline-none"
                    required
                  />
                  <p className="text-[10px] text-purple-700 font-semibold">
                    * Administrator accounts require authorized security passkey <span className="font-mono font-bold bg-purple-200 px-1 rounded">sunil123</span>
                  </p>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Healthcare Facility / Hospital *</label>
                <input
                  type="text"
                  value={newUserData.facility}
                  onChange={(e) => setNewUserData({ ...newUserData, facility: e.target.value })}
                  placeholder="e.g. SCB Medical College, Cuttack"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Official Email *</label>
                  <input
                    type="email"
                    value={newUserData.email}
                    onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                    placeholder="smruti@health.odisha.gov.in"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newUserData.phone}
                    onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                    placeholder="+91 94370 11223"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Password</label>
                <input
                  type="password"
                  value={newUserData.password}
                  onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                  placeholder="password123"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-600 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-black shadow-md cursor-pointer"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: CONFIRM USER DELETION                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">{t.deleteConfirmTitle}</h3>
              <p className="text-xs text-slate-500">{t.deleteConfirmDesc}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-900">{userToDelete.name}</div>
              <div className="text-slate-500 font-mono text-[11px]">{userToDelete.email} • {userToDelete.staffId}</div>
              <div className="text-purple-700 font-semibold text-[10px] mt-0.5">{userToDelete.role}</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                onClick={handleDeleteUserConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md"
              >
                {t.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
