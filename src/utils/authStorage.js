/**
 * Authentication & User Storage Utility
 * Manages user accounts and active sessions in localStorage
 */

const USERS_STORAGE_KEY = 'triage_registered_users';
const CURRENT_USER_KEY = 'triage_current_user';

// Pre-seeded standard verified clinical profiles for instant testing & demonstration
const DEFAULT_USERS = [
  {
    id: 'USR-DOC-101',
    name: 'Dr. Rajesh Verma',
    role: 'Medical Officer / Doctor (RMP)',
    roleCategory: 'doctor',
    staffId: 'MCI-2016-77824',
    facility: 'Civil District Hospital, Wardha',
    state: 'Maharashtra',
    district: 'Wardha',
    email: 'dr.rajesh@civilhosp.gov.in',
    phone: '+91 98230 45671',
    password: 'password123',
    department: 'Emergency & Triage Medicine',
    shift: 'Morning Shift (08:00 - 16:00)',
    qualifications: 'MBBS, MD (Emergency Medicine)',
    createdAt: '2026-01-15T08:00:00.000Z'
  },
  {
    id: 'USR-NUR-202',
    name: 'Sister Priya Nair',
    role: 'Triage Staff Nurse',
    roleCategory: 'nurse',
    staffId: 'INC-2019-54312',
    facility: 'Primary Health Center (PHC), Bhojpur',
    state: 'Bihar',
    district: 'Bhojpur',
    email: 'priya.nair@phc.gov.in',
    phone: '+91 94312 88765',
    password: 'password123',
    department: 'Outpatient Triage Bay',
    shift: 'General Day (09:00 - 17:00)',
    qualifications: 'B.Sc. Nursing, BLS/ACLS Certified',
    createdAt: '2026-02-10T09:30:00.000Z'
  },
  {
    id: 'USR-ASH-303',
    name: 'Sunita Devi',
    role: 'Community Health Worker (ASHA / ANM)',
    roleCategory: 'asha',
    staffId: 'ASHA-UP-2021-998',
    facility: 'Ayushman Arogya Mandir (Sub-Center), Gorakhpur',
    state: 'Uttar Pradesh',
    district: 'Gorakhpur',
    email: 'sunita.asha@nhm.gov.in',
    phone: '+91 91234 56789',
    password: 'password123',
    department: 'Maternal & Primary Care',
    shift: 'Field & Sub-Center Intake',
    qualifications: 'Certified Community Health Mobilizer',
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'USR-PAT-404',
    name: 'Rameshwar Lal',
    role: 'Patient / Citizen (मरीज / नागरिक)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-8842-1209-7711',
    facility: 'Civil District Hospital, Wardha',
    state: 'Maharashtra',
    district: 'Wardha',
    email: 'rameshwar.lal@patient.in',
    phone: '+91 97654 32109',
    password: 'password123',
    department: 'General Patient Outpatient Care',
    shift: 'Citizen Self-Service Access',
    qualifications: 'ABHA Cardholder (Ayushman Bharat)',
    age: '48',
    gender: 'Male',
    bloodGroup: 'B+',
    createdAt: '2026-03-05T11:00:00.000Z'
  },
  {
    id: 'USR-DOC-505',
    name: 'Dr. Soumya Ranjan Nayak',
    role: 'Medical Officer / ଡାକ୍ତର (RMP)',
    roleCategory: 'doctor',
    staffId: 'OMC-2017-66431',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha',
    district: 'Cuttack',
    email: 'dr.soumya@scbmch.odisha.gov.in',
    phone: '+91 94370 12345',
    password: 'password123',
    department: 'General & Emergency Medicine',
    shift: 'Morning OPD Shift (୦୮:୦୦ - ୧୬:୦୦)',
    qualifications: 'MBBS, MD (General Medicine) - Odisha Medical Council',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-08T08:00:00.000Z'
  },
  {
    id: 'USR-PAT-606',
    name: 'Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-7712-4439-0021',
    facility: 'Capital Hospital, Bhubaneswar, Odisha',
    state: 'Odisha',
    district: 'Khurda',
    email: 'pratap.mohanty@patient.in',
    phone: '+91 98610 55432',
    password: 'password123',
    department: 'Outpatient Triage',
    shift: 'Citizen Access',
    qualifications: 'Biju Swasthya Kalyan Yojana (BSKY) / ABHA',
    age: '42',
    gender: 'Male',
    bloodGroup: 'O+',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-08T09:00:00.000Z'
  },
  {
    id: 'USR-ADM-001',
    name: 'Sunil Biswal (ସୁନୀଲ ବିଶ୍ୱାଳ)',
    role: 'State Health Portal Administrator (ରାଜ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ପ୍ରଶାସକ)',
    roleCategory: 'admin',
    staffId: 'ADMIN-OD-2026',
    facility: 'National Health Mission (NHM) Directorate, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'admin@health.odisha.gov.in',
    phone: '+91 94370 99881',
    password: 'password123',
    department: 'State Digital Health Mission & Clinical Portal Governance',
    shift: '24x7 System Oversight & Administrative Command',
    qualifications: 'Chief State Portal Administrator, IT & Health Informatics',
    preferredLanguage: 'or-IN',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const getStoredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    // Ensure all default demo users (including USR-ADM-001) exist in the stored list and sync updated fields
    let updated = false;
    DEFAULT_USERS.forEach((def) => {
      const existingIdx = parsed.findIndex((u) => u.id === def.id || u.email === def.email);
      if (existingIdx === -1) {
        parsed.push(def);
        updated = true;
      } else if (def.id === 'USR-ADM-001' && parsed[existingIdx].name !== def.name) {
        parsed[existingIdx].name = def.name;
        updated = true;
      }
    });
    if (updated) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Failed to load users from localStorage:', e);
    return DEFAULT_USERS;
  }
};

export const saveUser = (newUser) => {
  const users = getStoredUsers();
  const existing = users.find(
    (u) =>
      u.email.toLowerCase() === newUser.email.toLowerCase() ||
      (newUser.staffId && u.staffId?.toLowerCase() === newUser.staffId.toLowerCase())
  );

  if (existing) {
    throw new Error('An account with this Email or Staff/Registration ID already exists.');
  }

  const userRecord = {
    ...newUser,
    id: `USR-${Date.now().toString().slice(-6)}`,
    createdAt: new Date().toISOString()
  };

  users.push(userRecord);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  return userRecord;
};

export const verifyCredentials = (identifier, password) => {
  const users = getStoredUsers();
  const cleanedId = identifier.trim().toLowerCase();

  const matched = users.find(
    (u) =>
      u.email.toLowerCase() === cleanedId ||
      u.staffId?.toLowerCase() === cleanedId ||
      u.phone?.replace(/\s+/g, '') === cleanedId.replace(/\s+/g, '')
  );

  if (!matched) {
    throw new Error('No user found with this Email, Staff ID, or Mobile number.');
  }

  if (matched.password !== password) {
    throw new Error('Incorrect password. Please verify and try again.');
  }

  return matched;
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      // Default initial login for effortless first-time exploration
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_USERS[0]));
      return DEFAULT_USERS[0];
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.id === 'USR-ADM-001' && parsed.name && parsed.name.includes('Dash')) {
      parsed.name = 'Sunil Biswal (ସୁନୀଲ ବିଶ୍ୱାଳ)';
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    console.error('Failed to read current user:', e);
    return DEFAULT_USERS[0];
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

const APPOINTMENTS_STORAGE_KEY = 'triage_booked_appointments';

export const getBookedAppointments = () => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read appointments:', e);
    return [];
  }
};

export const saveAppointment = (appointment) => {
  const current = getBookedAppointments();
  const updated = [appointment, ...current];
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelAppointment = (appointmentId) => {
  const current = getBookedAppointments();
  const updated = current.filter((a) => a.id !== appointmentId);
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// ─────────────────────────────────────────────
// Ambulance Booking Storage (same pattern as appointments)
// ─────────────────────────────────────────────
const AMBULANCE_STORAGE_KEY = 'triage_ambulance_requests';

export const getAmbulanceRequests = () => {
  try {
    const raw = localStorage.getItem(AMBULANCE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read ambulance requests:', e);
    return [];
  }
};

export const saveAmbulanceRequest = (request) => {
  const current = getAmbulanceRequests();
  const updated = [request, ...current];
  localStorage.setItem(AMBULANCE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelAmbulanceRequest = (requestId) => {
  const current = getAmbulanceRequests();
  const updated = current.filter((r) => r.id !== requestId);
  localStorage.setItem(AMBULANCE_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

// ─────────────────────────────────────────────
// Bed Booking Storage
// ─────────────────────────────────────────────
const BED_STORAGE_KEY = 'triage_bed_bookings';

export const getBedBookings = () => {
  try {
    const raw = localStorage.getItem(BED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read bed bookings:', e);
    return [];
  }
};

export const saveBedBooking = (booking) => {
  const current = getBedBookings();
  const updated = [booking, ...current];
  localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelBedBooking = (bookingId) => {
  const current = getBedBookings();
  const updated = current.filter((b) => b.id !== bookingId);
  localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

const HOSPITAL_TRANSFERS_KEY = 'triage_hospital_transfers';

export const getHospitalTransfers = () => {
  try {
    const raw = localStorage.getItem(HOSPITAL_TRANSFERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read hospital transfers:', e);
    return [];
  }
};

export const saveHospitalTransfer = (transfer) => {
  const current = getHospitalTransfers();
  const updated = [transfer, ...current];
  localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelHospitalTransfer = (transferId) => {
  const current = getHospitalTransfers();
  const updated = current.filter((t) => t.id !== transferId);
  localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(updated));
  return updated;
};

// ─────────────────────────────────────────────
// Admin Portal User Management & System Logs
// ─────────────────────────────────────────────
export const deleteStoredUser = (userId) => {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== userId);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(filtered));
  logSystemEvent({
    type: 'USER_DELETED',
    description: `User ${userId} was deleted from database`,
    severity: 'warning'
  });
  return filtered;
};

export const updateStoredUser = (userId, updatedFields) => {
  const users = getStoredUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error('User not found.');
  }
  users[index] = { ...users[index], ...updatedFields };
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  logSystemEvent({
    type: 'USER_UPDATED',
    description: `User account ${users[index].name} (${userId}) was updated`,
    severity: 'info'
  });
  return users[index];
};

const AUDIT_LOGS_KEY = 'triage_system_audit_logs';

const DEFAULT_AUDIT_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '2026-03-10T08:15:20.000Z',
    type: 'SYSTEM_BOOT',
    actor: 'State Portal Engine',
    description: 'All 30 District Health Command servers synchronized. SSL/TLS AES-256 active.',
    severity: 'success'
  },
  {
    id: 'LOG-002',
    timestamp: '2026-03-10T08:45:10.000Z',
    type: 'ADMIN_AUTH',
    actor: 'State Portal Super Administrator',
    description: 'Super Administrator session authenticated via NHM Secure Gateway.',
    severity: 'info'
  },
  {
    id: 'LOG-003',
    timestamp: '2026-03-10T09:12:44.000Z',
    type: 'BED_RESERVATION',
    actor: 'SCB Medical College & Hospital',
    description: 'Critical ICU bed assigned to emergency coronary referral.',
    severity: 'warning'
  }
];

export const getSystemAuditLogs = () => {
  try {
    const raw = localStorage.getItem(AUDIT_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
      return DEFAULT_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read audit logs:', e);
    return DEFAULT_AUDIT_LOGS;
  }
};

export const logSystemEvent = ({ type, actor = 'System Admin', description, severity = 'info' }) => {
  try {
    const logs = getSystemAuditLogs();
    const newEntry = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type,
      actor,
      description,
      severity
    };
    const updated = [newEntry, ...logs.slice(0, 99)]; // Keep latest 100
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to log audit event:', e);
    return [];
  }
};

