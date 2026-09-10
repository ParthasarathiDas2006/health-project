import React, { useState, useEffect, useMemo } from 'react';
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
  Sparkles,
  Award,
  Check,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';
import { getDoctorsList, ODISHA_DISTRICTS } from '../data/doctorsData';
import { DoctorAvatar } from '../utils/doctorPhotos';
import {
  getStoredUsers,
  deleteStoredUser,
  saveUser,
  getBedBookings,
  cancelBedBooking,
  getAmbulanceRequests,
  cancelAmbulanceRequest,
  updateAmbulanceStatus,
  getBookedAppointments,
  cancelAppointment,
  getHospitalTransfers,
  getSystemAuditLogs,
  logSystemEvent,
  resetSystemToDefaults
} from '../utils/authStorage';

/**
 * AdminPage Component
 * Central Command & Governance Portal for State Healthcare Operations
 * Supports Odia, Hindi, English and Light/Dark/Reading theme modes
 */
export default function AdminPage({ currentUser, appLang = 'or-IN', onNavigateTab }) {
  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' | 'beds' | 'ambulance' | 'appointments' | 'transfers' | 'audit'
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

  // Bed filter states
  const [bedSearch, setBedSearch] = useState('');
  const [bedTypeFilter, setBedTypeFilter] = useState('all');

  // Ambulance filter states
  const [ambSearch, setAmbSearch] = useState('');
  const [ambTypeFilter, setAmbTypeFilter] = useState('all');

  // Appointment filter states
  const [aptSearch, setAptSearch] = useState('');
  const [aptDeptFilter, setAptDeptFilter] = useState('all');

  // Doctor Directory state (2,500+ records zero-lag memoized pagination)
  const [doctorSearch, setDoctorSearch] = useState('');
  const [doctorDistrictFilter, setDoctorDistrictFilter] = useState('all');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('all');
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorPageSize, setDoctorPageSize] = useState(25);
  const [selectedDoctorDetail, setSelectedDoctorDetail] = useState(null);

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

  const handleResetDefaultsConfirm = () => {
    if (
      window.confirm(
        appLang === 'or-IN'
          ? 'ଆପଣ ସମସ୍ତ ସରକାରୀ ଟେଲିମେଟ୍ରି, ୨୬+ ବ୍ୟବହାରକାରୀ, ୧୦ ଟି ବେଡ୍ ଏବଂ ୮ ଟି ଆମ୍ବୁଲାନ୍ସ ରେକର୍ଡକୁ ପୁନଃସ୍ଥାପନ କରିବାକୁ ଚାହାଁନ୍ତି କି?'
          : 'Restore all official state health records (26+ registered staff/citizens, 10 bed reservations, 8 ambulance dispatches, 8 appointments)?'
      )
    ) {
      resetSystemToDefaults();
      loadAdminData();
      setActionSuccessMsg(
        appLang === 'or-IN'
          ? 'ସମସ୍ତ ସରକାରୀ ରେକର୍ଡ ସଫଳତାର ସହ ପୁନଃସ୍ଥାପନ କରାଗଲା।'
          : 'All official state records have been restored successfully.'
      );
      setTimeout(() => setActionSuccessMsg(''), 3000);
    }
  };

  const handleExportCensus = () => {
    const csvRows = [];
    csvRows.push(['RECORD_TYPE', 'IDENTIFIER', 'NAME_OR_PATIENT', 'ROLE_OR_SPECIALTY_OR_TYPE', 'FACILITY_OR_DESTINATION', 'PHONE_CONTACT', 'STATUS']);

    usersList.forEach((u) => {
      csvRows.push(['USER', u.staffId || u.id, `"${u.name}"`, u.roleCategory, `"${u.facility}"`, u.phone, 'ACTIVE']);
    });
    bedBookings.forEach((b) => {
      csvRows.push(['BED', b.id, `"${b.patientName}"`, `"${b.wardName || b.bedTypeName}"`, `"${b.hospitalName}"`, b.patientPhone || b.contact, b.status || 'CONFIRMED']);
    });
    ambulanceList.forEach((a) => {
      csvRows.push(['AMBULANCE', a.id, `"${a.patientName}"`, `"${a.vehicleNo} (${a.ambulanceType})"`, `"${a.destination}"`, a.contact || a.phone, a.status]);
    });
    appointments.forEach((ap) => {
      csvRows.push(['APPOINTMENT', ap.id, `"${ap.patientName}"`, `"${ap.department}"`, `"${ap.facility}"`, ap.patientPhone, ap.status]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Odisha_State_Health_Census_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setActionSuccessMsg(
      appLang === 'or-IN'
        ? 'ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସେନ୍ସସ୍ CSV ଡାଉନଲୋଡ୍ ହୋଇଛି।'
        : 'State Health Census CSV successfully downloaded.'
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

  const handleUpdateAmbStatus = (reqId, newStatus) => {
    const updated = updateAmbulanceStatus(reqId, newStatus);
    setAmbulanceList(updated);
    logSystemEvent({
      type: 'AMBULANCE_STATUS_UPDATE',
      actor: currentUser?.name || 'Administrator',
      description: `Ambulance dispatch ${reqId} status changed to ${newStatus}`,
      severity: 'info'
    });
    setAuditLogs(getSystemAuditLogs());
    setActionSuccessMsg(
      appLang === 'or-IN'
        ? `ଆମ୍ବୁଲାନ୍ସ ${reqId} ର ସ୍ଥିତି ${newStatus} କୁ ପରିବର୍ତ୍ତନ ହୋଇଛି।`
        : `Ambulance dispatch ${reqId} updated to ${newStatus}.`
    );
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const handleCancelAppointmentConfirm = (aptId) => {
    const updated = cancelAppointment(aptId);
    setAppointments(updated);
    logSystemEvent({
      type: 'APPOINTMENT_CANCELLED',
      actor: currentUser?.name || 'Administrator',
      description: `Outpatient appointment ${aptId} was cancelled by Admin`,
      severity: 'warning'
    });
    setAuditLogs(getSystemAuditLogs());
    setActionSuccessMsg(
      appLang === 'or-IN'
        ? `ପରାମର୍ଶ ବୁକିଂ (${aptId}) ବାତିଲ୍ କରାଗଲା।`
        : `Appointment (${aptId}) was cancelled.`
    );
    setTimeout(() => setActionSuccessMsg(''), 3000);
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
            ? 'ଅବୈଧ ପ୍ରଶାସକ ସୁରକ୍ଷା କୋଡ଼! ଦୟାକରି ଅନୁମୋଦିତ ପ୍ରଶାସକ ପାସକୋଡ୍ ପ୍ରଦାନ କରନ୍ତୁ।'
            : 'Invalid Admin Security Key! Please enter the authorized administrator passkey.'
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
      exportCensusBtn: 'ସେନ୍ସସ୍ ଏକ୍ସପୋର୍ଟ (CSV)',
      restoreBtn: 'ସରକାରୀ ତଥ୍ୟ ପୁନଃସ୍ଥାପନ',
      totalUsers: 'ମୋଟ ପଞ୍ଜୀକୃତ ବ୍ୟବହାରକାରୀ',
      totalBeds: 'ସକ୍ରିୟ ବେଡ୍ ବୁକିଂ',
      totalAmbulance: 'ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ଅନୁରୋଧ',
      totalAppointments: 'ଡାକ୍ତର ପରାମର୍ଶ ବୁକିଂ',
      totalTransfers: 'ଇଣ୍ଟର-ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍',
      totalDoctors: 'ପଞ୍ଜୀକୃତ ବିଶେଷଜ୍ଞ ଡାକ୍ତର (OMC)',
      tabUsers: '୧. ବ୍ୟବହାରକାରୀ ଓ ଷ୍ଟାଫ୍ ପରିଚାଳନା',
      tabDoctors: '୨. ବିଶେଷଜ୍ଞ ଡାକ୍ତର ରେଜିଷ୍ଟ୍ରି (~୨,୫୦୦+)',
      tabBeds: '୩. ହସ୍ପିଟାଲ୍ ବେଡ୍ କମାଣ୍ଡ',
      tabAmbulance: '୪. ଆମ୍ବୁଲାନ୍ସ ଡିସପାଚ୍',
      tabAppointments: '୫. ଡାକ୍ତର ପରାମର୍ଶ କମାଣ୍ଡ',
      tabTransfers: '୬. ହସ୍ପିଟାଲ୍ ରେଫରାଲ୍ ସ୍ଲିପ୍',
      tabAudit: '୭. ସିଷ୍ଟମ୍ ସୁରକ୍ଷା ଓ ଅଡିଟ୍ ଲଗ୍',
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
      exportCensusBtn: 'डेटा निर्यात (CSV)',
      restoreBtn: 'आधिकारिक डेटा रीसेट',
      totalUsers: 'कुल पंजीकृत उपयोगकर्ता',
      totalBeds: 'सक्रिय बेड बुकिंग',
      totalAmbulance: 'आपातकालीन एम्बुलेंस अनुरोध',
      totalAppointments: 'डॉक्टर परामर्श बुकिंग',
      totalTransfers: 'इंटर-हॉस्पिटल रेफरल',
      totalDoctors: 'पंजीकृत विशेषज्ञ चिकित्सक (OMC)',
      tabUsers: '1. उपयोगकर्ता एवं स्टाफ प्रबंधन',
      tabDoctors: '2. विशेषज्ञ डॉक्टर रजिस्ट्री (~2,500+)',
      tabBeds: '3. अस्पताल बेड कमान',
      tabAmbulance: '4. एम्बुलेंस प्रेषण',
      tabAppointments: '5. डॉक्टर परामर्श कमान',
      tabTransfers: '6. अस्पताल रेफरल पर्ची',
      tabAudit: '7. सिस्टम सुरक्षा एवं ऑडिट लॉग',
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
      exportCensusBtn: 'Export Census (CSV)',
      restoreBtn: 'Restore State Telemetry',
      totalUsers: 'Registered Users & Staff',
      totalBeds: 'Active Bed Bookings',
      totalAmbulance: 'Emergency Ambulance Dispatches',
      totalAppointments: 'Scheduled Consultations',
      totalTransfers: 'Apex Inter-Hospital Referrals',
      totalDoctors: 'State Registered Doctors (OMC)',
      tabUsers: '1. User & Staff Management',
      tabDoctors: '2. Specialist Doctors Registry (~2,500+)',
      tabBeds: '3. Live Bed Command',
      tabAmbulance: '4. Ambulance Dispatch Control',
      tabAppointments: '5. Scheduled Consultations',
      tabTransfers: '6. Inter-Hospital Transfer Slips',
      tabAudit: '7. System Security & Audit Trail',
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

  // Filter beds by search and bed type
  const filteredBeds = bedBookings.filter((b) => {
    const matchesType = bedTypeFilter === 'all' || b.bedTypeId === bedTypeFilter;
    const q = bedSearch.toLowerCase();
    const matchesSearch =
      !q ||
      b.patientName?.toLowerCase().includes(q) ||
      b.hospitalName?.toLowerCase().includes(q) ||
      b.wardName?.toLowerCase().includes(q) ||
      b.bedNumber?.toLowerCase().includes(q) ||
      b.referralReason?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  // Filter ambulances by search and type
  const filteredAmbulances = ambulanceList.filter((a) => {
    const matchesType = ambTypeFilter === 'all' || a.ambulanceTypeId === ambTypeFilter;
    const q = ambSearch.toLowerCase();
    const matchesSearch =
      !q ||
      a.patientName?.toLowerCase().includes(q) ||
      a.vehicleNo?.toLowerCase().includes(q) ||
      a.paramedic?.toLowerCase().includes(q) ||
      a.destination?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.emergencyType?.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  // Filter appointments by search and department
  const filteredAppointments = appointments.filter((ap) => {
    const q = aptSearch.toLowerCase();
    const docName = typeof ap.doctorName === 'object' ? Object.values(ap.doctorName).join(' ') : (ap.doctorName || '');
    const matchesDept = aptDeptFilter === 'all' || ap.department?.toLowerCase().includes(aptDeptFilter.toLowerCase());
    const matchesSearch =
      !q ||
      ap.patientName?.toLowerCase().includes(q) ||
      docName.toLowerCase().includes(q) ||
      ap.department?.toLowerCase().includes(q) ||
      ap.facility?.toLowerCase().includes(q) ||
      ap.reason?.toLowerCase().includes(q);
    return matchesDept && matchesSearch;
  });

  // Zero-Lag Memoized Doctor Directory (2,523 State Specialists)
  const fullDoctorsRegistry = useMemo(() => {
    return getDoctorsList(appLang);
  }, [appLang]);

  // Extract unique specialties for the doctor filter dropdown
  const availableSpecialties = useMemo(() => {
    const set = new Set();
    fullDoctorsRegistry.forEach((d) => {
      if (d.specialty) set.add(d.specialty);
    });
    return Array.from(set).sort();
  }, [fullDoctorsRegistry]);

  // Fast Memoized Doctor Filter (executes in <2ms)
  const filteredDoctorsRegistry = useMemo(() => {
    const q = doctorSearch.toLowerCase().trim();
    return fullDoctorsRegistry.filter((d) => {
      const matchesDistrict = doctorDistrictFilter === 'all' || d.district === doctorDistrictFilter || d.location === doctorDistrictFilter;
      const matchesSpecialty = doctorSpecialtyFilter === 'all' || d.specialty === doctorSpecialtyFilter;
      const matchesSearch =
        !q ||
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.facility && d.facility.toLowerCase().includes(q)) ||
        (d.district && d.district.toLowerCase().includes(q)) ||
        (d.specialty && d.specialty.toLowerCase().includes(q)) ||
        (d.regNo && d.regNo.toLowerCase().includes(q)) ||
        (d.qualifications && d.qualifications.toLowerCase().includes(q));
      return matchesDistrict && matchesSpecialty && matchesSearch;
    });
  }, [fullDoctorsRegistry, doctorSearch, doctorDistrictFilter, doctorSpecialtyFilter]);

  // Zero-Lag Pagination Calculation (Only slices 25 items for DOM)
  const totalDoctorPages = Math.max(1, Math.ceil(filteredDoctorsRegistry.length / doctorPageSize));
  const safeDoctorPage = Math.min(doctorPage, totalDoctorPages);
  const paginatedDoctors = useMemo(() => {
    const start = (safeDoctorPage - 1) * doctorPageSize;
    return filteredDoctorsRegistry.slice(start, start + doctorPageSize);
  }, [filteredDoctorsRegistry, safeDoctorPage, doctorPageSize]);

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

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExportCensus}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Download CSV Census"
              >
                <Download className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">{t.exportCensusBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleRefresh}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Refresh Live Data"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">{t.refreshBtn}</span>
              </button>

              <button
                type="button"
                onClick={handleResetDefaultsConfirm}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title="Restore State Defaults"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">{t.restoreBtn}</span>
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
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div
          onClick={() => setActiveSubTab('users')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'users'
              ? 'bg-purple-500/10 border-purple-500 ring-2 ring-purple-500/20'
              : 'bg-white border-slate-200 hover:border-purple-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalUsers}</span>
            <div className="p-1.5 rounded-lg bg-purple-100 text-purple-700 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{usersList.length}</div>
          <div className="text-[10px] text-purple-700 font-semibold mt-0.5 truncate">
            {usersList.filter((u) => u.roleCategory === 'doctor').length} Staff Docs
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('doctors')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'doctors'
              ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalDoctors}</span>
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{fullDoctorsRegistry.length}</div>
          <div className="text-[10px] text-blue-700 font-semibold mt-0.5 truncate">
            30 Districts • 21 Specialties
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalBeds}</span>
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
              <Bed className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{bedBookings.length}</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5 truncate">
            Live Ward Tracking
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalAmbulance}</span>
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700 shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{ambulanceList.length}</div>
          <div className="text-[10px] text-rose-700 font-semibold mt-0.5 truncate">
            108 Emergency Network
          </div>
        </div>

        <div
          onClick={() => setActiveSubTab('appointments')}
          className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
            activeSubTab === 'appointments'
              ? 'bg-teal-500/10 border-teal-500 ring-2 ring-teal-500/20'
              : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalAppointments}</span>
            <div className="p-1.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{appointments.length}</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5 truncate">
            Scheduled Consults
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider line-clamp-1">{t.totalTransfers}</span>
            <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700 shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{transfers.length}</div>
          <div className="text-[10px] text-indigo-700 font-semibold mt-0.5 truncate">
            Tertiary Referrals
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
          onClick={() => setActiveSubTab('doctors')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'doctors'
              ? 'bg-blue-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{t.tabDoctors}</span>
          <span className="bg-blue-900/40 text-blue-100 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            {fullDoctorsRegistry.length}
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
          onClick={() => setActiveSubTab('appointments')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeSubTab === 'appointments'
              ? 'bg-teal-700 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t.tabAppointments}</span>
          <span className="bg-teal-900/40 text-teal-100 text-[10px] px-1.5 py-0.2 rounded-full">
            {appointments.length}
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
      {/* SUB-VIEW 2: STATE SPECIALIST DOCTOR REGISTRY (~2,500+ DOCTORS)*/}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'doctors' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header & Metric Banner */}
          <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-400/30 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                Odisha Medical Council (OMC) & NHM Verified Registry
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-blue-400" />
                {appLang === 'or-IN'
                  ? 'ଓଡ଼ିଶା ରାଜ୍ୟ ବିଶେଷଜ୍ଞ ଡାକ୍ତର ରେଜିଷ୍ଟ୍ରି (୨,୫୨୩ ଡାକ୍ତର)'
                  : appLang === 'hi-IN'
                  ? 'ओडिशा राज्य विशेषज्ञ चिकित्सक रजिस्ट्री (2,523 चिकित्सक)'
                  : 'Odisha State Specialist Medical Registry (2,523 Verified Doctors)'}
              </h2>
              <p className="text-slate-300 text-xs mt-1">
                {appLang === 'or-IN'
                  ? 'ସମସ୍ତ ୩୦ ଟି ଜିଲ୍ଲାର ୪୮+ ସରକାରୀ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍‌ର ପ୍ରତ୍ୟେକ ବିଭାଗରେ କାର୍ଯ୍ୟରତ ବିଶେଷଜ୍ଞ ଡାକ୍ତରମାନଙ୍କ ଡାଟାବେସ୍'
                  : 'Central administrative registry of all certified medical officers across 30 Districts, Medical Colleges & DHHs with zero UI latency'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-xs">
                <span className="text-blue-200 block text-[10px] font-bold uppercase">Total Registry</span>
                <span className="font-mono font-black text-lg text-white">{fullDoctorsRegistry.length} Specialists</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 text-xs">
                <span className="text-emerald-200 block text-[10px] font-bold uppercase">Covered Districts</span>
                <span className="font-mono font-black text-lg text-emerald-300">30 / 30</span>
              </div>
            </div>
          </div>

          {/* Real-time Filter & Search Bar */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-lg bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-2xs">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => {
                  setDoctorSearch(e.target.value);
                  setDoctorPage(1);
                }}
                placeholder={
                  appLang === 'or-IN'
                    ? 'ଡାକ୍ତରଙ୍କ ନାମ, OMC ରେଗ୍ ନମ୍ବର, ହସ୍ପିଟାଲ୍ କିମ୍ବା ଡିଗ୍ରୀ ଖୋଜନ୍ତୁ...'
                    : 'Search doctor name, OMC reg no, facility, degree or district...'
                }
                className="w-full text-xs outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
              />
              {doctorSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setDoctorSearch('');
                    setDoctorPage(1);
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* District Filter */}
              <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <select
                  value={doctorDistrictFilter}
                  onChange={(e) => {
                    setDoctorDistrictFilter(e.target.value);
                    setDoctorPage(1);
                  }}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="all">All 30 Districts (ସମସ୍ତ ୩୦ ଜିଲ୍ଲା)</option>
                  {ODISHA_DISTRICTS.map((dist) => (
                    <option key={dist.id} value={dist.id}>
                      {dist.nameEn} ({dist.nameOr})
                    </option>
                  ))}
                </select>
              </div>

              {/* Specialty Filter */}
              <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
                <Stethoscope className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                <select
                  value={doctorSpecialtyFilter}
                  onChange={(e) => {
                    setDoctorSpecialtyFilter(e.target.value);
                    setDoctorPage(1);
                  }}
                  className="bg-transparent text-slate-700 font-bold outline-none cursor-pointer text-xs"
                >
                  <option value="all">All Specialties (ସମସ୍ତ ବିଶେଷଜ୍ଞତା)</option>
                  {availableSpecialties.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page Size Selector */}
              <div className="flex items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-slate-300 text-slate-600 shadow-2xs">
                <span className="text-[11px] font-semibold">Per Page:</span>
                <select
                  value={doctorPageSize}
                  onChange={(e) => {
                    setDoctorPageSize(Number(e.target.value));
                    setDoctorPage(1);
                  }}
                  className="bg-transparent font-bold outline-none cursor-pointer text-xs text-slate-900"
                >
                  <option value={15}>15</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill Line */}
          <div className="px-5 py-2.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
            <div>
              Showing <strong className="text-slate-900 font-black">{Math.min(filteredDoctorsRegistry.length, (safeDoctorPage - 1) * doctorPageSize + 1)}</strong> -{' '}
              <strong className="text-slate-900 font-black">{Math.min(filteredDoctorsRegistry.length, safeDoctorPage * doctorPageSize)}</strong> of{' '}
              <strong className="text-blue-700 font-black">{filteredDoctorsRegistry.length}</strong> matching specialist records
              {filteredDoctorsRegistry.length !== fullDoctorsRegistry.length && (
                <span className="ml-1 text-slate-400"> (filtered from {fullDoctorsRegistry.length} total)</span>
              )}
            </div>

            {/* Pagination Controls (Top) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeDoctorPage <= 1}
                onClick={() => setDoctorPage((p) => Math.max(1, p - 1))}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-colors ${
                  safeDoctorPage <= 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <span className="font-mono font-bold text-slate-800 text-[11px] px-2 py-0.5 bg-white rounded border border-slate-200">
                Page {safeDoctorPage} / {totalDoctorPages}
              </span>
              <button
                type="button"
                disabled={safeDoctorPage >= totalDoctorPages}
                onClick={() => setDoctorPage((p) => Math.min(totalDoctorPages, p + 1))}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 border transition-colors ${
                  safeDoctorPage >= totalDoctorPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* High-Performance Paginated Doctors Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-600 font-extrabold text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Doctor & Specialty</th>
                  <th className="py-3 px-4">Registration & Qualifications</th>
                  <th className="py-3 px-4">Hospital / Apex Facility</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">OPD Room / Shift</th>
                  <th className="py-3 px-4">BSKY & Rating</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                {paginatedDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <Stethoscope className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                      <p className="font-bold text-sm">No doctors found matching criteria.</p>
                      <p className="text-xs text-slate-400 mt-1">Try resetting the district or specialty filter.</p>
                    </td>
                  </tr>
                ) : (
                  paginatedDoctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-blue-50/40 transition-colors">
                      {/* Name & Specialty */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <DoctorAvatar doctor={doc} sizeClass="w-9 h-9" />
                          <div>
                            <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                              <span>{doc.name}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" title="OMC Verified Specialist" />
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                                {doc.specialty}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono">
                                {doc.experience}y exp
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Reg No & Qualifications */}
                      <td className="py-3 px-4">
                        <div className="font-mono text-[11px] font-bold text-slate-800">
                          {doc.regNo || 'OMC-VERIFIED'}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1" title={doc.qualifications}>
                          {doc.qualifications}
                        </div>
                      </td>

                      {/* Facility */}
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1" title={doc.facility}>
                          {doc.facility}
                        </div>
                        <div className="text-[10px] text-indigo-700 font-bold">
                          {doc.hospitalTier || 'State Medical Facility'}
                        </div>
                      </td>

                      {/* District */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200 text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {doc.district}
                        </span>
                      </td>

                      {/* OPD Room & Timing */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800 text-[11px]">{doc.room}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{doc.days}</div>
                      </td>

                      {/* BSKY Status & Rating */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500 font-black text-xs">★ {doc.rating}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">({doc.reviewsCount || 800}+)</span>
                        </div>
                        <div className="mt-0.5">
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                            {doc.bskyAvailable ? 'BSKY FREE' : 'GOVT OPD'}
                          </span>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedDoctorDetail(doc)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-bold text-xs transition-colors cursor-pointer inline-flex items-center gap-1 shadow-2xs"
                          title="View Complete Clinical Credentials"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Credentials</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls (Bottom Bar) */}
          <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-600">
              Showing page <strong className="text-slate-900">{safeDoctorPage}</strong> of{' '}
              <strong className="text-slate-900">{totalDoctorPages}</strong> (Total{' '}
              <strong className="text-blue-700">{filteredDoctorsRegistry.length}</strong> doctors)
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safeDoctorPage <= 1}
                onClick={() => {
                  setDoctorPage(1);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                  safeDoctorPage <= 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
                title="First Page"
              >
                First
              </button>

              <button
                type="button"
                disabled={safeDoctorPage <= 1}
                onClick={() => {
                  setDoctorPage((p) => Math.max(1, p - 1));
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border transition-colors ${
                  safeDoctorPage <= 1
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Prev</span>
              </button>

              <div className="font-mono font-black text-slate-800 px-3 py-1 bg-white rounded-lg border border-slate-300">
                {safeDoctorPage} / {totalDoctorPages}
              </div>

              <button
                type="button"
                disabled={safeDoctorPage >= totalDoctorPages}
                onClick={() => {
                  setDoctorPage((p) => Math.min(totalDoctorPages, p + 1));
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 border transition-colors ${
                  safeDoctorPage >= totalDoctorPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                disabled={safeDoctorPage >= totalDoctorPages}
                onClick={() => {
                  setDoctorPage(totalDoctorPages);
                  window.scrollTo({ top: 350, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold border transition-colors ${
                  safeDoctorPage >= totalDoctorPages
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50'
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-100 cursor-pointer shadow-2xs'
                }`}
                title="Last Page"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 3: LIVE BED COMMAND                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'beds' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Bed className="w-5 h-5 text-emerald-600" />
                {appLang === 'or-IN' ? 'ହସ୍ପିଟାଲ୍ ବେଡ୍ ବୁକିଂ ନିୟନ୍ତ୍ରଣ' : 'Live Hospital Bed Command & Reservations'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? 'ରାଜ୍ୟର ସମସ୍ତ ମେଡିକାଲ୍ କଲେଜ୍ ଏବଂ ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟରେ ବେଡ୍ ଆବଣ୍ଟନ'
                  : 'Live bed reservations across Odisha District Hospitals, Apex Medical Colleges & CHCs'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-full">
                {bedBookings.length} Active Admissions
              </span>
            </div>
          </div>

          {/* Bed Fleet Telemetry Census Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-3 text-xs">
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">CRITICAL ICU & BURN</span>
              <span className="text-lg font-black text-emerald-950">
                {bedBookings.filter((b) => b.bedTypeId === 'icu' || b.bedTypeId === 'burn' || b.bedTypeId === 'trauma').length} Beds
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">HDU OXYGEN & RENAL</span>
              <span className="text-lg font-black text-emerald-950">
                {bedBookings.filter((b) => b.bedTypeId === 'hdu' || b.bedTypeId === 'surgical' || b.bedTypeId === 'renal').length} Beds
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">MATERNAL & PEDIATRIC</span>
              <span className="text-lg font-black text-emerald-950">
                {bedBookings.filter((b) => b.bedTypeId === 'maternity' || b.bedTypeId === 'pediatric').length} Beds
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">STATE BED OCCUPANCY</span>
              <span className="text-lg font-black text-emerald-950">
                78.4% Capacity
              </span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={bedSearch}
                onChange={(e) => setBedSearch(e.target.value)}
                placeholder="Search bed reservations by patient, hospital, ward, bed number..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Beds' },
                { id: 'icu', label: 'ICU Ventilator' },
                { id: 'hdu', label: 'HDU Oxygen' },
                { id: 'trauma', label: 'Trauma Bay' },
                { id: 'maternity', label: 'Maternity' },
                { id: 'pediatric', label: 'Pediatric' },
                { id: 'general', label: 'General' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setBedTypeFilter(filter.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    bedTypeFilter === filter.id
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredBeds.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Bed className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Bed Reservations Match Your Filter</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBeds.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">
                          {b.id}
                        </span>
                        {b.bedNumber && (
                          <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-slate-200 text-slate-800 rounded">
                            {b.bedNumber}
                          </span>
                        )}
                        {b.urgency && (
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                              b.urgency === 'CRITICAL'
                                ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {b.urgency}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">{b.hospitalName}</h3>
                      <div className="text-xs text-emerald-900 font-semibold mt-0.5">
                        {b.wardName || b.ward || 'General Medical Ward'} • {b.bedTypeName || b.bedType || 'Oxygen Bed'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCancelBed(b.id)}
                      className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2.5 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer shrink-0"
                    >
                      Release Bed
                    </button>
                  </div>

                  {b.referralReason && (
                    <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Clinical Indication:</span>
                      <p className="font-medium text-slate-800">{b.referralReason}</p>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">PATIENT PROFILE</span>
                      <span className="font-bold text-slate-900">{b.patientName}</span>
                      <span className="text-[11px] text-slate-500 block">
                        {b.patientAge ? `${b.patientAge}y` : ''} {b.patientGender || ''} • {b.patientAbha || 'ABHA Active'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">CONTACT & ATTENDANT</span>
                      <span className="font-medium text-slate-800">{b.patientPhone || b.contact || '+91 94370 11223'}</span>
                      {b.attendantContact && (
                        <span className="text-[10px] text-slate-500 block truncate" title={b.attendantContact}>
                          Attendant: {b.attendantContact}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">ADMISSION TIME</span>
                      <span className="font-medium text-slate-600">
                        {b.timestamp ? new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '08:30 AM'} • {b.timestamp ? new Date(b.timestamp).toLocaleDateString() : 'Today'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">HEALTH SCHEME</span>
                      <span className="font-bold text-emerald-700 text-[11px] truncate block">
                        {b.scheme || 'Biju Swasthya Kalyan (BSKY)'}
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-rose-600" />
                {appLang === 'or-IN' ? 'ଜରୁରୀ ଆମ୍ବୁଲାନ୍ସ ଡିସପାଚ୍ କଣ୍ଟ୍ରୋଲ୍' : '108 / 102 Emergency Ambulance Dispatch Command'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? 'ରାଜ୍ୟ ୧୦୮ ଓ ୧୦୨ ଆମ୍ବୁଲାନ୍ସ ନେଟୱାର୍କର ଲାଇଭ୍ GPS ଟ୍ରାକିଂ ଏବଂ ଡିସପାଚ୍'
                  : 'State 108 / 102 Emergency Ambulance GPS dispatch network, live transit & EMT monitoring'}
              </p>
            </div>
            <span className="px-3 py-1 bg-rose-100 text-rose-800 font-extrabold text-xs rounded-full">
              {ambulanceList.length} Active Dispatches
            </span>
          </div>

          {/* Fleet Telemetry Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-rose-50/60 border border-rose-200/80 rounded-xl p-3 text-xs">
            <div>
              <span className="text-[10px] text-rose-700 font-bold uppercase block">108 ADVANCED LIFE SUPPORT</span>
              <span className="text-lg font-black text-rose-950">
                {ambulanceList.filter((a) => a.ambulanceTypeId === 'ALS').length} Units Active
              </span>
            </div>
            <div>
              <span className="text-[10px] text-rose-700 font-bold uppercase block">108 BASIC LIFE SUPPORT</span>
              <span className="text-lg font-black text-rose-950">
                {ambulanceList.filter((a) => a.ambulanceTypeId === 'BLS').length} Units Active
              </span>
            </div>
            <div>
              <span className="text-[10px] text-rose-700 font-bold uppercase block">102 JANANI SHISHU EXPRESS</span>
              <span className="text-lg font-black text-rose-950">
                {ambulanceList.filter((a) => a.ambulanceTypeId === '102_JANANI').length} Units Active
              </span>
            </div>
            <div>
              <span className="text-[10px] text-rose-700 font-bold uppercase block">AVG RESPONSE TIME</span>
              <span className="text-lg font-black text-rose-950">
                8.6 Minutes
              </span>
            </div>
          </div>

          {/* Search & Type Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={ambSearch}
                onChange={(e) => setAmbSearch(e.target.value)}
                placeholder="Search dispatches by patient, vehicle number, pickup, paramedic, hospital..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-rose-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Fleet' },
                { id: 'ALS', label: '108 ALS' },
                { id: 'BLS', label: '108 BLS' },
                { id: '102_JANANI', label: '102 Janani' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setAmbTypeFilter(filter.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    ambTypeFilter === filter.id
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAmbulances.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Truck className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Ambulance Dispatches Match Your Filter</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAmbulances.map((req) => (
                <div key={req.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded border border-rose-200">
                          {req.id}
                        </span>
                        {req.vehicleNo && (
                          <span className="font-mono text-[10px] font-black px-2 py-0.5 bg-slate-900 text-amber-400 rounded">
                            {req.vehicleNo}
                          </span>
                        )}
                        {req.eta && (
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-rose-500" />
                            ETA: {req.eta}
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-sm mt-1.5">
                        {req.patientName || req.patient?.name || 'Emergency Patient'}
                      </h3>
                      <div className="text-xs text-rose-700 font-bold flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{req.urgency || req.emergencyType || 'HIGH PRIORITY 108 EMERGENCY'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCancelAmbulance(req.id)}
                      className="text-xs text-slate-600 hover:text-slate-800 font-bold px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors cursor-pointer shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>

                  {/* Status Pills & Fast Status Update Controls */}
                  <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-white rounded-lg border border-slate-200">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Live Status:</span>
                      <span
                        className={`font-black text-[10px] px-2 py-0.5 rounded-full ${
                          req.status === 'ARRIVED_HOSPITAL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'PATIENT_ON_BOARD'
                            ? 'bg-blue-100 text-blue-800'
                            : req.status === 'TRANSIT_TO_APEX'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800 animate-pulse'
                        }`}
                      >
                        {req.status?.replace(/_/g, ' ') || 'DISPATCHED'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateAmbStatus(req.id, 'PATIENT_ON_BOARD')}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-700 transition-colors cursor-pointer"
                        title="Mark Patient on Board"
                      >
                        Boarded
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAmbStatus(req.id, 'TRANSIT_TO_APEX')}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 hover:bg-purple-100 hover:text-purple-800 text-slate-700 transition-colors cursor-pointer"
                        title="Mark In Transit"
                      >
                        In Transit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateAmbStatus(req.id, 'ARRIVED_HOSPITAL')}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors cursor-pointer"
                        title="Mark Arrived at Hospital"
                      >
                        Arrived
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">GPS PICKUP ORIGIN</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{req.pickup || req.location || 'Local PHC / Village'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">APEX DESTINATION</span>
                      <span className="font-semibold text-slate-800 line-clamp-1">{req.destination || 'District Headquarters Hospital'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">PARAMEDIC / EMT</span>
                      <span className="font-medium text-slate-700 line-clamp-1">{req.paramedic || 'State EMT Officer'}</span>
                      {req.driver && <span className="text-[10px] text-slate-500 block truncate">Driver: {req.driver}</span>}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold uppercase">CALLER / EMERGENCY CONTACT</span>
                      <span className="font-bold text-slate-900">{req.contact || req.phone || req.patient?.phone || '+91 94370 00108'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 4: SCHEDULED DOCTOR CONSULTATIONS                   */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'appointments' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                {appLang === 'or-IN' ? 'ଡାକ୍ତର ପରାମର୍ଶ କମାଣ୍ଡ' : 'Scheduled Outpatient Consultations Command'}
              </h2>
              <p className="text-xs text-slate-500">
                {appLang === 'or-IN'
                  ? 'ରାଜ୍ୟର ସମସ୍ତ ବିଶେଷଜ୍ଞ ଡାକ୍ତରଙ୍କ ସହିତ ନାଗରିକଙ୍କ ପରାମର୍ଶ ତଥ୍ୟ'
                  : 'Central command of specialist outpatient & tele-consultations across 30 Odisha Districts'}
              </p>
            </div>
            <span className="px-3 py-1 bg-teal-100 text-teal-800 font-extrabold text-xs rounded-full">
              {appointments.length} Consultations Booked
            </span>
          </div>

          {/* Search & Department Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={aptSearch}
                onChange={(e) => setAptSearch(e.target.value)}
                placeholder="Search appointments by doctor, patient, specialty, facility, reason..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 text-xs rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs font-semibold">
              {[
                { id: 'all', label: 'All Specialties' },
                { id: 'cardio', label: 'Cardiology' },
                { id: 'neuro', label: 'Neurology' },
                { id: 'pediatric', label: 'Pediatrics' },
                { id: 'ortho', label: 'Orthopedics' },
                { id: 'medicine', label: 'Medicine' }
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setAptDeptFilter(filter.id)}
                  className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                    aptDeptFilter === filter.id
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-2" />
              <p className="font-bold text-sm">No Appointments Found</p>
              <p className="text-xs text-slate-400 mt-1">Try resetting the filter or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAppointments.map((ap) => {
                const docName = typeof ap.doctorName === 'object' ? (ap.doctorName[appLang] || ap.doctorName['en-IN']) : (ap.doctorName || 'Consultant Specialist');
                return (
                  <div key={ap.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition-all space-y-3 shadow-xs">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-teal-100 text-teal-800 rounded border border-teal-200">
                            {ap.id}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                            {ap.consultType || 'In-Person'}
                          </span>
                        </div>
                        <h3 className="font-extrabold text-slate-900 text-sm mt-1.5 flex items-center gap-1.5">
                          <Stethoscope className="w-4 h-4 text-teal-600" />
                          <span>{docName}</span>
                        </h3>
                        <div className="text-xs text-slate-600 font-semibold mt-0.5">
                          {ap.department} • {ap.facility}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCancelAppointmentConfirm(ap.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer shrink-0"
                      >
                        Cancel
                      </button>
                    </div>

                    {ap.reason && (
                      <div className="text-xs text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-0.5">Consultation Purpose:</span>
                        <p className="font-medium text-slate-800">{ap.reason}</p>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs text-slate-600">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">PATIENT DETAILS</span>
                        <span className="font-bold text-slate-900">{ap.patientName}</span>
                        <span className="text-[11px] text-slate-500 block">
                          {ap.patientAge ? `${ap.patientAge}y` : ''} {ap.patientGender || ''} • {ap.patientPhone}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">SCHEDULED SLOT</span>
                        <span className="font-bold text-teal-800">{ap.date} at {ap.timeSlot}</span>
                        <span className="text-[10px] text-slate-500 block">{ap.room || 'General OPD'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SUB-VIEW 5: INTER-HOSPITAL TRANSFERS                          */}
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
      {/* SUB-VIEW 6: SYSTEM SECURITY & AUDIT TRAIL                     */}
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
                    placeholder="Enter authorized security passkey"
                    className="w-full px-3 py-2 rounded-xl border border-purple-400 bg-white text-xs font-mono font-bold outline-none"
                    required
                  />
                  <p className="text-[10px] text-purple-700 font-semibold">
                    * Administrator accounts require authorized security passkey issued by the State Directorate.
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
      {/* ───────────────────────────────────────────────────────────── */}
      {/* MODAL: DOCTOR CREDENTIALS & CLINICAL VERIFICATION DETAIL     */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedDoctorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DoctorAvatar doctor={selectedDoctorDetail} sizeClass="w-12 h-12 text-sm" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-black text-white">{selectedDoctorDetail.name}</h3>
                    <CheckCircle2 className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-xs text-blue-200 font-medium mt-0.5">
                    {selectedDoctorDetail.specialty} • {selectedDoctorDetail.qualifications}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDoctorDetail(null)}
                className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <span className="text-[10px] text-blue-700 font-bold uppercase block">OMC Registration</span>
                  <span className="font-mono font-black text-slate-900 text-sm">{selectedDoctorDetail.regNo}</span>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">✓ State Medical Council Verified</span>
                </div>
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                  <span className="text-[10px] text-purple-700 font-bold uppercase block">Clinical Experience</span>
                  <span className="font-black text-slate-900 text-sm">{selectedDoctorDetail.experience} Years</span>
                  <span className="text-[10px] text-purple-700 font-bold block mt-0.5">★ {selectedDoctorDetail.rating} Rating ({selectedDoctorDetail.reviewsCount || 800}+ reviews)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase block">Healthcare Facility / Apex College</span>
                <p className="font-extrabold text-slate-900 text-sm">{selectedDoctorDetail.facility}</p>
                <div className="text-[11px] text-slate-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>District: <strong>{selectedDoctorDetail.district}</strong>, Odisha</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-indigo-700 font-semibold">{selectedDoctorDetail.hospitalTier}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">OPD Chamber</span>
                  <span className="font-black text-slate-900">{selectedDoctorDetail.room}</span>
                  <span className="text-[10px] text-slate-500 block mt-0.5">{selectedDoctorDetail.days}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Avg Wait Time & Fee</span>
                  <span className="font-black text-emerald-700">{selectedDoctorDetail.avgWaitTime || '15 mins'}</span>
                  <span className="text-[10px] text-slate-600 block mt-0.5">{selectedDoctorDetail.opdFee || 'Govt BSKY Free (₹0)'}</span>
                </div>
              </div>

              {selectedDoctorDetail.famousFor && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="text-[10px] text-amber-800 font-black uppercase flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    Specialist Departmental Recognition
                  </span>
                  <p className="text-xs font-medium">{selectedDoctorDetail.famousFor}</p>
                </div>
              )}

              {selectedDoctorDetail.awards && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>Honors: <strong className="text-slate-700">{selectedDoctorDetail.awards}</strong></span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoctorDetail(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
              >
                Close Credentials View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
