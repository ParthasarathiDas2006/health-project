import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDM7KYsOQ1o-NSCbJHb9lzC0YHNeEcE29A",
  authDomain: "swasthya-mitra-48b58.firebaseapp.com",
  projectId: "swasthya-mitra-48b58",
  storageBucket: "swasthya-mitra-48b58.appspot.com",
  messagingSenderId: "395410615396",
  appId: "1:395410615396:web:ababcd25af50370de24371"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const SEED_USERS = [
  {
    id: 'USR-DOC-101',
    name: 'Dr. Rajesh Verma',
    role: 'Medical Officer / Doctor (RMP)',
    roleCategory: 'doctor',
    staffId: 'MCI-2016-77824',
    facility: 'Capital Hospital, Unit-6, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'dr.rajesh@capitalhosp.gov.in',
    phone: '+91 98230 45671',
    department: 'Emergency & Triage Medicine',
    shift: 'Morning Shift (08:00 - 16:00)',
    qualifications: 'MBBS, MD (Emergency Medicine)'
  },
  {
    id: 'USR-DOC-505',
    name: 'Dr. Soumya Ranjan Nayak',
    role: 'Medical Officer / ଡାକ୍ତର (RMP)',
    roleCategory: 'doctor',
    staffId: 'OMC-2017-66431',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Cuttack',
    email: 'dr.soumya@scbmch.odisha.gov.in',
    phone: '+91 94370 12345',
    department: 'Cardiovascular & Emergency Medicine',
    shift: 'Morning OPD Shift (୦୮:୦୦ - ୧୬:୦୦)',
    qualifications: 'MBBS, MD (General Medicine)'
  },
  {
    id: 'USR-ADM-001',
    name: 'Dr. Manoj Kumar Mohapatra',
    role: 'State Health Command Administrator',
    roleCategory: 'admin',
    staffId: 'NHM-OD-ADMIN-01',
    facility: 'Odisha State Health Secretariat, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'admin.swasthya@odisha.gov.in',
    phone: '+91 98610 22119'
  },
  {
    id: 'USR-PAT-001',
    name: 'Basanta Kumar Sahoo',
    role: 'Patient (ABHA Verified)',
    roleCategory: 'patient',
    staffId: 'ABHA-91-8843-2210-9941',
    facility: 'Capital Hospital OPD, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'basanta.sahoo@gmail.com',
    phone: '+91 94372 88190',
    bloodGroup: 'B+',
    age: 48,
    gender: 'Male'
  }
];

const SEED_APPOINTMENTS = [
  {
    id: 'APT-DOC-101-0900',
    tokenNo: 'TK-01',
    doctorId: 'USR-DOC-101',
    doctorName: 'Dr. Rajesh Verma',
    specialty: 'Emergency & General Medicine',
    facility: 'Capital Hospital, Unit-6, Bhubaneswar',
    patientName: 'Subrat Mohanty',
    patientPhone: '+91 94371 22334',
    date: '2026-03-12',
    timeSlot: '09:00 AM - 09:30 AM',
    reason: 'Persistent fever and productive cough for 4 days',
    status: 'Confirmed'
  },
  {
    id: 'APT-DOC-505-1030',
    tokenNo: 'TK-04',
    doctorId: 'USR-DOC-505',
    doctorName: 'Dr. Soumya Ranjan Nayak',
    specialty: 'Cardiovascular Medicine',
    facility: 'SCB Medical College & Hospital, Cuttack',
    patientName: 'Pravat Kumar Jena',
    patientPhone: '+91 98610 55432',
    date: '2026-03-12',
    timeSlot: '10:30 AM - 11:00 AM',
    reason: 'Post-angioplasty routine follow-up evaluation',
    status: 'Confirmed'
  }
];

const SEED_BEDS = [
  {
    id: 'BED-CAP-ICU-04',
    facilityName: 'Capital Hospital, Bhubaneswar',
    facilityType: 'District Headquarters Hospital',
    wardType: 'Emergency ICU / HDU',
    bedNumber: 'ICU-Bed-04 (Oxygen Supported)',
    patientName: 'Debabrata Rout',
    patientAge: 58,
    patientGender: 'Male',
    patientPhone: '+91 94380 11223',
    admissionDate: '2026-03-10',
    status: 'Occupied',
    assignedDoctor: 'Dr. Rajesh Verma'
  },
  {
    id: 'BED-SCB-COR-02',
    facilityName: 'SCB Medical College & Hospital, Cuttack',
    facilityType: 'Apex Tertiary Medical College',
    wardType: 'Coronary Care Unit (CCU)',
    bedNumber: 'CCU-02 (Telemetry Monitored)',
    patientName: 'Kailash Chandra Sahoo',
    patientAge: 62,
    patientGender: 'Male',
    patientPhone: '+91 94375 66778',
    admissionDate: '2026-03-10',
    status: 'Occupied',
    assignedDoctor: 'Dr. Lipsa Rath'
  }
];

const SEED_AMBULANCE = [
  {
    id: 'AMB-108-OD-901',
    ambulanceNumber: 'OD-02-AK-1081',
    type: 'Advanced Life Support (ALS)',
    crew: 'Driver Niranjan Sahu & EMT Rakesh Das',
    callerName: 'Sunita Behera',
    callerPhone: '+91 94370 88990',
    pickupLocation: 'Rasulgarh Square, NH-16, Bhubaneswar',
    destinationHospital: 'Capital Hospital Emergency Bay, Unit-6',
    patientCondition: 'Suspected Acute Myocardial Infarction (Chest Pain)',
    requestTime: '2026-03-10T09:15:00.000Z',
    status: 'En Route to Hospital',
    etaMinutes: 8
  }
];

const SEED_BLOOD = [
  {
    id: 'REQ-BLD-102941',
    patientName: 'Mamata Mishra',
    bloodGroup: 'B Positive (B+)',
    unitsRequired: 2,
    component: 'Packed Red Blood Cells (PRBC)',
    hospital: 'Capital Hospital Blood Centre, Bhubaneswar',
    urgency: 'URGENT',
    contactPerson: 'Bikram Mishra (Attendant)',
    contactPhone: '+91 94382 33441',
    createdAt: '2026-03-10T08:45:00.000Z',
    status: 'CONFIRMED'
  }
];

async function seedData() {
  console.log('Seeding data to Firestore project swasthya-mitra-48b58 ...');
  try {
    const batch = writeBatch(db);

    // 1. Users
    for (const u of SEED_USERS) {
      batch.set(doc(db, 'swasthya_users', u.id), { ...u, _syncedAt: new Date().toISOString() });
    }

    // 2. Appointments
    for (const a of SEED_APPOINTMENTS) {
      batch.set(doc(db, 'swasthya_appointments', a.id), { ...a, _syncedAt: new Date().toISOString() });
    }

    // 3. Beds
    for (const b of SEED_BEDS) {
      batch.set(doc(db, 'swasthya_bed_bookings', b.id), { ...b, _syncedAt: new Date().toISOString() });
    }

    // 4. Ambulance
    for (const amb of SEED_AMBULANCE) {
      batch.set(doc(db, 'swasthya_ambulance_requests', amb.id), { ...amb, _syncedAt: new Date().toISOString() });
    }

    // 5. Blood Requests
    for (const bld of SEED_BLOOD) {
      batch.set(doc(db, 'swasthya_blood_requests', bld.id), { ...bld, _syncedAt: new Date().toISOString() });
    }

    await batch.commit();
    console.log('SUCCESS: All collections populated successfully in Firestore!');
  } catch (err) {
    console.error('SEED_FAILED:', err.code, err.message);
  }
  process.exit(0);
}

seedData();
