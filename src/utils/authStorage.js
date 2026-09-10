/**
 * Authentication & User Storage Utility
 * Manages user accounts and active sessions in localStorage
 */

const USERS_STORAGE_KEY = 'triage_registered_users';
const CURRENT_USER_KEY = 'triage_current_user';

// Pre-seeded standard verified clinical profiles for instant testing & demonstration across Odisha
const DEFAULT_USERS = [
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
    password: 'password123',
    department: 'Emergency & Triage Medicine',
    shift: 'Morning Shift (08:00 - 16:00)',
    qualifications: 'MBBS, MD (Emergency Medicine)',
    createdAt: '2026-01-15T08:00:00.000Z'
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
    password: 'password123',
    department: 'Cardiovascular & Emergency Medicine',
    shift: 'Morning OPD Shift (୦୮:୦୦ - ୧୬:୦୦)',
    qualifications: 'MBBS, MD (General Medicine) - Odisha Medical Council',
    preferredLanguage: 'or-IN',
    createdAt: '2026-01-18T08:00:00.000Z'
  },
  {
    id: 'USR-DOC-506',
    name: 'Dr. Lipsa Rath (ଡା. ଲିପ୍ସା ରଥ)',
    role: 'Chief Interventional Cardiologist',
    roleCategory: 'doctor',
    staffId: 'OMC-2015-44129',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Cuttack',
    email: 'dr.lipsa@scbmch.odisha.gov.in',
    phone: '+91 94371 99002',
    password: 'password123',
    department: 'Cardiology & Cath Lab',
    shift: 'Rotational Emergency On-Call',
    qualifications: 'MBBS, MD, DM (Cardiology)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-01-20T09:00:00.000Z'
  },
  {
    id: 'USR-DOC-507',
    name: 'Dr. Manoj Kumar Mohapatra (ଡା. ମନୋଜ ମହାପାତ୍ର)',
    role: 'Senior Consultant Neurologist',
    roleCategory: 'doctor',
    staffId: 'AIIMS-BBSR-2018-88',
    facility: 'AIIMS Hospital, Sijua, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'dr.manoj@aiimsbhubaneswar.edu.in',
    phone: '+91 98610 22119',
    password: 'password123',
    department: 'Neurology & Stroke Triage Bay',
    shift: 'Apex Specialist OPD (09:00 - 17:00)',
    qualifications: 'MBBS, MD, DM (Neurology)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-01-25T10:30:00.000Z'
  },
  {
    id: 'USR-DOC-508',
    name: 'Dr. Snehalata Jena (ଡା. ସ୍ନେହଲତା ଜେନା)',
    role: 'Pediatric & Neonatal Specialist',
    roleCategory: 'doctor',
    staffId: 'OMC-2019-55104',
    facility: 'Capital Hospital, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'dr.snehalata@capitalhosp.gov.in',
    phone: '+91 94380 44321',
    password: 'password123',
    department: 'Special Newborn Care Unit (SNCU)',
    shift: 'Morning & Ward Rounds',
    qualifications: 'MBBS, MD (Pediatrics)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-01T08:30:00.000Z'
  },
  {
    id: 'USR-DOC-509',
    name: 'Dr. Bibhuti Bhusan Nayak (ଡା. ବିଭୂତି ଭୂଷଣ ନାୟକ)',
    role: 'Orthopedic Trauma Surgeon',
    roleCategory: 'doctor',
    staffId: 'OMC-2014-33290',
    facility: 'MKCG Medical College & Hospital, Berhampur',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Ganjam',
    email: 'dr.bibhuti@mkcgmch.odisha.gov.in',
    phone: '+91 94372 77810',
    password: 'password123',
    department: 'Orthopedic Trauma & Casualty',
    shift: 'Emergency Trauma Shift',
    qualifications: 'MBBS, MS (Orthopedics)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-05T11:00:00.000Z'
  },
  {
    id: 'USR-DOC-510',
    name: 'Dr. Jayant Kumar Panda (ଡା. ଜୟନ୍ତ କୁମାର ପଣ୍ଡା)',
    role: 'Professor & Head of Critical Care',
    roleCategory: 'doctor',
    staffId: 'OMC-2012-11094',
    facility: 'VIMSAR Medical College & Hospital, Burla',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Sambalpur',
    email: 'dr.jayant@vimsar.ac.in',
    phone: '+91 99370 55123',
    password: 'password123',
    department: 'Intensive Care Unit (ICU)',
    shift: '24x7 Critical Command',
    qualifications: 'MBBS, MD (Medicine), FCCP',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-12T09:15:00.000Z'
  },
  {
    id: 'USR-DOC-511',
    name: 'Dr. Madhusmita Behera (ଡା. ମଧୁସ୍ମିତା ବେହେରା)',
    role: 'Obstetrician & Gynecologist',
    roleCategory: 'doctor',
    staffId: 'OMC-2018-72019',
    facility: 'District Headquarters Hospital (DHH), Puri',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Puri',
    email: 'dr.madhusmita@dhhpuri.gov.in',
    phone: '+91 94391 66543',
    password: 'password123',
    department: 'Maternal & Child Health Wing (MCH)',
    shift: 'Obstetric Emergency Call',
    qualifications: 'MBBS, MS (ObGyn)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-18T10:00:00.000Z'
  },
  {
    id: 'USR-DOC-512',
    name: 'Dr. Alok Ranjan Sahoo (ଡା. ଆଲୋକ ରଞ୍ଜନ ସାହୁ)',
    role: 'Casualty Medical Officer (CMO)',
    roleCategory: 'doctor',
    staffId: 'OMC-2020-88123',
    facility: 'District Headquarters Hospital (DHH), Balasore',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Balasore',
    email: 'dr.alok@dhhbalasore.gov.in',
    phone: '+91 94373 11890',
    password: 'password123',
    department: '24x7 Emergency Casualty Bay',
    shift: 'Evening Emergency (14:00 - 22:00)',
    qualifications: 'MBBS, DNB (Emergency Medicine)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-22T14:00:00.000Z'
  },
  // NURSES
  {
    id: 'USR-NUR-202',
    name: 'Sister Priya Nair',
    role: 'Triage Staff Nurse',
    roleCategory: 'nurse',
    staffId: 'INC-2019-54312',
    facility: 'Capital Hospital, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'priya.nair@capitalhosp.gov.in',
    phone: '+91 94312 88765',
    password: 'password123',
    department: 'Outpatient Triage Bay',
    shift: 'General Day (09:00 - 17:00)',
    qualifications: 'B.Sc. Nursing, BLS/ACLS Certified',
    createdAt: '2026-02-10T09:30:00.000Z'
  },
  {
    id: 'USR-NUR-203',
    name: 'Sister Sabita Pradhan (ସବିତା ପ୍ରଧାନ)',
    role: 'Head Nurse - Emergency Resuscitation',
    roleCategory: 'nurse',
    staffId: 'ONC-2016-99201',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Cuttack',
    email: 'sabita.nurse@scbmch.odisha.gov.in',
    phone: '+91 94371 44091',
    password: 'password123',
    department: 'Acute Casualty & Triage Wing',
    shift: 'Night Duty (20:00 - 08:00)',
    qualifications: 'Post Basic B.Sc Nursing, Critical Care Nurse',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-15T08:00:00.000Z'
  },
  {
    id: 'USR-NUR-204',
    name: 'Sister Minati Barik (ମିନତୀ ବାରିକ)',
    role: 'Staff Nurse - Intensive Care Unit',
    roleCategory: 'nurse',
    staffId: 'ONC-2020-41092',
    facility: 'MKCG Medical College & Hospital, Berhampur',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Ganjam',
    email: 'minati.nurse@mkcgmch.odisha.gov.in',
    phone: '+91 94372 11984',
    password: 'password123',
    department: 'Medical ICU Bay-1',
    shift: 'Morning Shift (07:00 - 15:00)',
    qualifications: 'GNM, Advanced Mechanical Ventilation Care',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-20T07:00:00.000Z'
  },
  {
    id: 'USR-NUR-205',
    name: 'Sister Pratima Sethi (ପ୍ରତିମା ସେଠୀ)',
    role: 'MCH Sister-in-Charge',
    roleCategory: 'nurse',
    staffId: 'ONC-2017-33180',
    facility: 'District Headquarters Hospital (DHH), Puri',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Puri',
    email: 'pratima.nurse@dhhpuri.gov.in',
    phone: '+91 94391 77209',
    password: 'password123',
    department: 'Labor Room & Postnatal Ward',
    shift: 'Afternoon Shift (14:00 - 21:00)',
    qualifications: 'B.Sc Nursing, SBA Certified',
    preferredLanguage: 'or-IN',
    createdAt: '2026-02-25T14:00:00.000Z'
  },
  // ASHA & ANM GRASSROOTS HEALTH WORKERS
  {
    id: 'USR-ASH-303',
    name: 'Sunita Devi (ସୁନୀତା ଦେବୀ)',
    role: 'Community Health Worker (ASHA / ANM)',
    roleCategory: 'asha',
    staffId: 'ASHA-OD-2021-998',
    facility: 'Ayushman Arogya Mandir (Sub-Center), Pipli',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Puri',
    email: 'sunita.asha@nhm.gov.in',
    phone: '+91 91234 56789',
    password: 'password123',
    department: 'Maternal & Primary Care Outreach',
    shift: 'Field & Sub-Center Intake',
    qualifications: 'Certified Community Health Mobilizer',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-01T10:00:00.000Z'
  },
  {
    id: 'USR-ASH-304',
    name: 'Kalyani Moharana (କଲ୍ୟାଣୀ ମହାରଣା)',
    role: 'Senior ASHA Sahayogini',
    roleCategory: 'asha',
    staffId: 'ASHA-OD-2019-441',
    facility: 'Hinjilicut Community Health Center (CHC)',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Ganjam',
    email: 'kalyani.asha@nhm.gov.in',
    phone: '+91 94372 90123',
    password: 'password123',
    department: 'Village Health Sanitation & Nutrition Committee',
    shift: 'Community Door-to-Door Triage',
    qualifications: 'State Gold Medalist ASHA Worker',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-02T09:00:00.000Z'
  },
  {
    id: 'USR-ASH-305',
    name: 'Basanti Marndi (ବାସନ୍ତୀ ମାରାଣ୍ଡି)',
    role: 'Auxiliary Nurse Midwife (ANM)',
    roleCategory: 'asha',
    staffId: 'ANM-OD-2020-112',
    facility: 'Baripada Rural Sub-Center, Mayurbhanj',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Mayurbhanj',
    email: 'basanti.anm@nhm.gov.in',
    phone: '+91 94374 12390',
    password: 'password123',
    department: 'Immunization & Tribal Maternal Health',
    shift: 'Mobile Health Unit (MHU)',
    qualifications: 'Registered Auxiliary Nurse Midwife (ANM)',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-03T08:30:00.000Z'
  },
  {
    id: 'USR-ASH-306',
    name: 'Shantilata Biswal (ଶାନ୍ତିଲତା ବିଶ୍ୱାଳ)',
    role: 'ASHA Worker - Coastal Ward',
    roleCategory: 'asha',
    staffId: 'ASHA-OD-2022-772',
    facility: 'Konark Urban PHC, Puri',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Puri',
    email: 'shantilata.asha@nhm.gov.in',
    phone: '+91 94392 55431',
    password: 'password123',
    department: 'Maternal Nutrition & First Aid',
    shift: 'Field Outreach',
    qualifications: 'Certified NCD Screening Worker',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-04T10:00:00.000Z'
  },
  {
    id: 'USR-ASH-307',
    name: 'Rebati Majhi (ରେବତୀ ମାଝୀ)',
    role: 'Community Health Mobilizer',
    roleCategory: 'asha',
    staffId: 'ASHA-OD-2023-319',
    facility: 'Bhawanipatna Sub-Center, Kalahandi',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Kalahandi',
    email: 'rebati.asha@nhm.gov.in',
    phone: '+91 94383 66102',
    password: 'password123',
    department: 'Malaria & Sickle Cell Screening Cell',
    shift: 'Tribal Outreach Program',
    qualifications: 'Community Healthcare Assistant',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-05T09:30:00.000Z'
  },
  // CITIZENS / PATIENTS
  {
    id: 'USR-PAT-404',
    name: 'Rameshwar Lal (ରାମେଶ୍ୱର ଲାଲ)',
    role: 'Patient / Citizen (ମରୀଜ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-8842-1209-7711',
    facility: 'Capital Hospital, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'rameshwar.lal@patient.in',
    phone: '+91 97654 32109',
    password: 'password123',
    department: 'General Patient Outpatient Care',
    shift: 'Citizen Self-Service Access',
    qualifications: 'ABHA Cardholder (Ayushman Bharat)',
    age: '48',
    gender: 'Male',
    bloodGroup: 'B+',
    preferredLanguage: 'hi-IN',
    createdAt: '2026-03-05T11:00:00.000Z'
  },
  {
    id: 'USR-PAT-606',
    name: 'Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-7712-4439-0021',
    facility: 'Capital Hospital, Bhubaneswar, Odisha',
    state: 'Odisha (ଓଡ଼ିଶା)',
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
    id: 'USR-PAT-607',
    name: 'Ananya Priyadarshini (ଅନନ୍ୟା ପ୍ରିୟଦର୍ଶିନୀ)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-9988-1122-3344',
    facility: 'AIIMS Hospital, Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'ananya.p@patient.in',
    phone: '+91 98612 88401',
    password: 'password123',
    department: 'Neurology Consultation',
    shift: 'Citizen Portal Access',
    qualifications: 'Ayushman Bharat PM-JAY Cardholder',
    age: '28',
    gender: 'Female',
    bloodGroup: 'A+',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-08T10:00:00.000Z'
  },
  {
    id: 'USR-PAT-608',
    name: 'Subash Chandra Lenka (ସୁବାଷ ଚନ୍ଦ୍ର ଲେଙ୍କା)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-4456-7890-1234',
    facility: 'SCB Medical College & Hospital, Cuttack',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Cuttack',
    email: 'subash.lenka@patient.in',
    phone: '+91 94371 66209',
    password: 'password123',
    department: 'Cardiovascular Care',
    shift: 'Citizen Portal Access',
    qualifications: 'BSKY Gold Cardholder: BSKY-CTC-9901',
    age: '61',
    gender: 'Male',
    bloodGroup: 'B+',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-08T11:30:00.000Z'
  },
  {
    id: 'USR-PAT-609',
    name: 'Rabindra Kumar Sahu (ରବୀନ୍ଦ୍ର କୁମାର ସାହୁ)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-6677-8899-0011',
    facility: 'MKCG Medical College, Berhampur',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Ganjam',
    email: 'rabindra.sahu@patient.in',
    phone: '+91 94372 33490',
    password: 'password123',
    department: 'Orthopedics & Joint Clinic',
    shift: 'Citizen Access',
    qualifications: 'Senior Citizen Health Cardholder',
    age: '65',
    gender: 'Male',
    bloodGroup: 'O-',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-09T08:15:00.000Z'
  },
  {
    id: 'USR-PAT-610',
    name: 'Saraswati Munda (ସରସ୍ୱତୀ ମୁଣ୍ଡା)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-3344-5566-7788',
    facility: 'Ispat General Hospital (IGH), Rourkela',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Sundargarh',
    email: 'saraswati.munda@patient.in',
    phone: '+91 94374 77612',
    password: 'password123',
    department: 'General Outpatient Care',
    shift: 'Citizen Access',
    qualifications: 'BSKY Tribal Welfare Beneficiary',
    age: '34',
    gender: 'Female',
    bloodGroup: 'B-',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-09T09:45:00.000Z'
  },
  {
    id: 'USR-PAT-611',
    name: 'Dinabandhu Tarai (ଦୀନବନ୍ଧୁ ତରାଇ)',
    role: 'Patient / Citizen (ରୋଗୀ / ନାଗରିକ)',
    roleCategory: 'patient',
    staffId: 'ABHA: 91-5566-7788-9900',
    facility: 'District Headquarters Hospital, Kendrapara',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Kendrapara',
    email: 'dinabandhu.tarai@patient.in',
    phone: '+91 94381 22901',
    password: 'password123',
    department: 'Respiratory Care Unit',
    shift: 'Citizen Access',
    qualifications: 'Ayushman Bharat Cardholder',
    age: '52',
    gender: 'Male',
    bloodGroup: 'AB+',
    preferredLanguage: 'or-IN',
    createdAt: '2026-03-09T11:00:00.000Z'
  },
  // ADMINISTRATORS
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
  },
  {
    id: 'USR-ADM-002',
    name: 'Er. Tanmay Dash (ଇଂ. ତନ୍ମୟ ଦାଶ)',
    role: 'Director of Health Telemetry & Cloud Infrastructure',
    roleCategory: 'admin',
    staffId: 'ADMIN-OD-IT-002',
    facility: 'Odisha State Data Center (OSDC), Bhubaneswar',
    state: 'Odisha (ଓଡ଼ିଶା)',
    district: 'Khurda',
    email: 'tanmay.dash@osdc.gov.in',
    phone: '+91 94370 88204',
    password: 'password123',
    department: 'State Digital Infrastructure & Telemetry Services',
    shift: 'Administrative Command',
    qualifications: 'Chief Technology Director, State e-Health Grid',
    preferredLanguage: 'or-IN',
    createdAt: '2026-01-05T00:00:00.000Z'
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
    // Ensure all default verified users exist in the stored list and sync updated fields
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

// ─────────────────────────────────────────────
// Pre-seeded Default Data for System Telemetry
// ─────────────────────────────────────────────
const DEFAULT_BED_BOOKINGS = [
  {
    id: 'BED-OD-9012',
    timestamp: '2026-03-10T06:30:00.000Z',
    hospitalId: 'scb_cuttack',
    hospitalName: 'SCB Medical College & Hospital, Cuttack',
    hospitalAddress: 'Mangalabag, Cuttack, Odisha 753007',
    hospitalPhone: '0671-2414080',
    bedTypeId: 'icu',
    bedTypeName: 'ICU with Mechanical Ventilator',
    wardName: 'Cardiothoracic ICU (CTVS Bay-2), 3rd Floor',
    bedNumber: 'ICU-VENT-04',
    patientName: 'Trilochan Mohapatra',
    patientPhone: '+91 94371 88201',
    patientAbha: '91-4481-9023-1144',
    patientAge: '62',
    patientGender: 'Male',
    urgency: 'CRITICAL',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'Acute Coronary Syndrome with Cardiogenic Shock',
    attendantContact: '+91 94371 88202 (Son - Debashis)',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-8841',
    timestamp: '2026-03-10T07:15:00.000Z',
    hospitalId: 'aiims_bbsr',
    hospitalName: 'AIIMS Hospital, Bhubaneswar',
    hospitalAddress: 'Sijua, Patrapada, Bhubaneswar, Odisha 751019',
    hospitalPhone: '0674-2476789',
    bedTypeId: 'trauma',
    bedTypeName: 'Emergency Trauma Resuscitation Bed',
    wardName: 'Emergency Apex Trauma Bay, Ground Floor',
    bedNumber: 'TRAUMA-BAY-02',
    patientName: 'Bikram Keshari Rout',
    patientPhone: '+91 98612 34509',
    patientAbha: '91-7712-4091-8821',
    patientAge: '29',
    patientGender: 'Male',
    urgency: 'CRITICAL',
    scheme: 'Ayushman Bharat PM-JAY',
    referralReason: 'Polytrauma with pelvic fracture following NH-16 collision',
    attendantContact: '+91 98612 34510',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-7723',
    timestamp: '2026-03-10T08:00:00.000Z',
    hospitalId: 'capital_bbsr',
    hospitalName: 'Capital Hospital, Bhubaneswar',
    hospitalAddress: 'Unit 6, Ganga Nagar, Bhubaneswar, Odisha 751001',
    hospitalPhone: '0674-2391983',
    bedTypeId: 'hdu',
    bedTypeName: 'High Dependency Oxygen Bed',
    wardName: 'High Dependency Unit (HDU-B), 2nd Floor',
    bedNumber: 'HDU-O2-09',
    patientName: 'Soudamini Nayak',
    patientPhone: '+91 94380 77123',
    patientAbha: '91-2290-6611-3456',
    patientAge: '54',
    patientGender: 'Female',
    urgency: 'HIGH',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'Severe Acute Bronchospasm & SpO2 Desaturation (86%)',
    attendantContact: '+91 94380 77124',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-6619',
    timestamp: '2026-03-10T08:25:00.000Z',
    hospitalId: 'mkcg_berhampur',
    hospitalName: 'MKCG Medical College & Hospital, Berhampur',
    hospitalAddress: 'Medical Campus, Berhampur, Ganjam, Odisha 760004',
    hospitalPhone: '0680-2292704',
    bedTypeId: 'general',
    bedTypeName: 'General Medicine Inpatient Bed',
    wardName: 'Male Medicine Ward No. 4, Block-C',
    bedNumber: 'GEN-MED-18',
    patientName: 'Kalu Charan Padhi',
    patientPhone: '+91 94372 66551',
    patientAbha: '91-8841-3322-9901',
    patientAge: '46',
    patientGender: 'Male',
    urgency: 'MODERATE',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'Complicated Falciparum Malaria with Thrombocytopenia',
    attendantContact: '+91 94372 66552',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-5504',
    timestamp: '2026-03-10T08:50:00.000Z',
    hospitalId: 'vimsar_burla',
    hospitalName: 'VIMSAR Medical College & Hospital, Burla',
    hospitalAddress: 'Burla, Sambalpur, Odisha 768017',
    hospitalPhone: '0663-2430768',
    bedTypeId: 'surgical',
    bedTypeName: 'Surgical High Dependency Bed',
    wardName: 'Surgical Step-Down Ward, 3rd Floor',
    bedNumber: 'SURG-POST-06',
    patientName: 'Hemanta Meher',
    patientPhone: '+91 99370 88992',
    patientAbha: '91-5512-3344-7788',
    patientAge: '38',
    patientGender: 'Male',
    urgency: 'HIGH',
    scheme: 'Ayushman Bharat PM-JAY',
    referralReason: 'Post-Emergency Laparotomy Monitoring & Drainage',
    attendantContact: '+91 99370 88993',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-4431',
    timestamp: '2026-03-10T09:10:00.000Z',
    hospitalId: 'dhh_puri',
    hospitalName: 'District Headquarters Hospital (DHH), Puri',
    hospitalAddress: 'Hospital Square, Grand Road, Puri, Odisha 752001',
    hospitalPhone: '06752-222046',
    bedTypeId: 'maternity',
    bedTypeName: 'Maternal Delivery Care Bed',
    wardName: 'MCH Labor & Delivery Observation, 1st Floor',
    bedNumber: 'MAT-DELIV-03',
    patientName: 'Priyanka Das',
    patientPhone: '+91 94391 22334',
    patientAbha: '91-3311-6655-2244',
    patientAge: '24',
    patientGender: 'Female',
    urgency: 'HIGH',
    scheme: 'Janani Suraksha Yojana (JSY)',
    referralReason: 'Full-Term Primigravida with Gestational Pre-eclampsia',
    attendantContact: '+91 94391 22335',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-3398',
    timestamp: '2026-03-10T09:35:00.000Z',
    hospitalId: 'dhh_balasore',
    hospitalName: 'District Headquarters Hospital (DHH), Balasore',
    hospitalAddress: 'Station Road, Balasore, Odisha 756001',
    hospitalPhone: '06782-262032',
    bedTypeId: 'pediatric',
    bedTypeName: 'Pediatric Intensive Care Bed',
    wardName: 'Special Newborn Care Unit (SNCU) & PICU',
    bedNumber: 'PED-ICU-05',
    patientName: 'Baby of Sanjukta Giri (4 Months)',
    patientPhone: '+91 94373 44112',
    patientAbha: '91-6622-4411-9988',
    patientAge: '4 Months',
    patientGender: 'Female',
    urgency: 'CRITICAL',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'Severe Acute Bronchiolitis with Subcostal Retractions',
    attendantContact: '+91 94373 44113 (Father - Balaram)',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-2287',
    timestamp: '2026-03-10T09:55:00.000Z',
    hospitalId: 'igh_rourkela',
    hospitalName: 'Ispat General Hospital (IGH), Rourkela',
    hospitalAddress: 'Sector 19, Rourkela, Sundargarh, Odisha 769005',
    hospitalPhone: '0661-2646201',
    bedTypeId: 'burn',
    bedTypeName: 'Burn ICU Isolation Bed',
    wardName: 'Acute Burn ICU & Decontamination Bay',
    bedNumber: 'BURN-ICU-02',
    patientName: 'Mahendra Kisan',
    patientPhone: '+91 94374 88771',
    patientAbha: '91-1199-3355-7711',
    patientAge: '35',
    patientGender: 'Male',
    urgency: 'CRITICAL',
    scheme: 'Steel Plant Welfare / BSKY',
    referralReason: '35% Deep Dermal Thermal Burns (Industrial Flash)',
    attendantContact: '+91 94374 88772',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-1192',
    timestamp: '2026-03-10T10:15:00.000Z',
    hospitalId: 'sln_koraput',
    hospitalName: 'Saheed Laxman Nayak MCH & DHH, Koraput',
    hospitalAddress: 'Medical College Road, Koraput, Odisha 764020',
    hospitalPhone: '06852-250102',
    bedTypeId: 'hdu',
    bedTypeName: 'High Dependency Inpatient Bed',
    wardName: 'High Dependency Infectious Disease Unit',
    bedNumber: 'HDU-INF-04',
    patientName: 'Dambaru Jani',
    patientPhone: '+91 94382 11990',
    patientAbha: '91-7744-1188-3322',
    patientAge: '51',
    patientGender: 'Male',
    urgency: 'HIGH',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'Severe Scrub Typhus with Acute Kidney Injury',
    attendantContact: '+91 94382 11991',
    status: 'CONFIRMED'
  },
  {
    id: 'BED-OD-1045',
    timestamp: '2026-03-10T10:40:00.000Z',
    hospitalId: 'capital_bbsr',
    hospitalName: 'Capital Hospital, Bhubaneswar',
    hospitalAddress: 'Unit 6, Bhubaneswar, Odisha 751001',
    hospitalPhone: '0674-2391983',
    bedTypeId: 'renal',
    bedTypeName: 'Dialysis Post-Procedure Recovery Bed',
    wardName: 'Renal Care & Hemodialysis Recovery, 2nd Floor',
    bedNumber: 'RENAL-HDU-01',
    patientName: 'Prafulla Kumar Samal',
    patientPhone: '+91 98611 77224',
    patientAbha: '91-9933-2211-4477',
    patientAge: '67',
    patientGender: 'Male',
    urgency: 'MODERATE',
    scheme: 'Biju Swasthya Kalyan Yojana (BSKY)',
    referralReason: 'End-Stage Renal Disease (ESRD) on Dialysis Maintenance',
    attendantContact: '+91 98611 77225',
    status: 'CONFIRMED'
  }
];

const DEFAULT_AMBULANCE_REQUESTS = [
  {
    id: 'AMB-108-OD-9811',
    emergencyType: 'Acute Myocardial Infarction / Severe Chest Pain',
    ambulanceType: '108 ALS — Advanced Life Support',
    ambulanceTypeId: 'ALS',
    vehicleNo: 'OD-02-AX-1081',
    paramedic: 'Santosh Jena (EMT-108 Senior)',
    driver: 'Manoj Behera (+91 94371 10801)',
    eta: '6 mins',
    patient: {
      name: 'Niranjan Swain',
      phone: '+91 94375 66778',
      abha: '91-4455-8899-2211',
      age: '58',
      gender: 'Male'
    },
    patientName: 'Niranjan Swain',
    phone: '+91 94375 66778',
    location: 'Badambadi Bus Stand, Cuttack',
    pickup: 'Badambadi Bus Stand, Cuttack, Odisha',
    destination: 'SCB Medical College & Hospital, Cuttack',
    contact: '+91 94375 66778',
    urgency: 'CRITICAL 108 EMERGENCY',
    status: 'EN_ROUTE_HOSPITAL',
    requestedAt: '2026-03-10T10:48:00.000Z'
  },
  {
    id: 'AMB-108-OD-9812',
    emergencyType: 'Road Traffic Accident / Polytrauma',
    ambulanceType: '108 ALS — Advanced Life Support',
    ambulanceTypeId: 'ALS',
    vehicleNo: 'OD-02-AY-1084',
    paramedic: 'Babulal Murmu (EMT-108 Trauma)',
    driver: 'Ramesh Sahoo (+91 94371 10802)',
    eta: '9 mins',
    patient: {
      name: 'Lipsa Dash',
      phone: '+91 98613 22445',
      abha: '91-7788-1122-4455',
      age: '26',
      gender: 'Female'
    },
    patientName: 'Lipsa Dash',
    phone: '+91 98613 22445',
    location: 'Master Canteen Square, Bhubaneswar',
    pickup: 'Master Canteen Square, Bhubaneswar, Khurda',
    destination: 'Capital Hospital, Bhubaneswar',
    contact: '+91 98613 22445',
    urgency: 'HIGH PRIORITY 108',
    status: 'PATIENT_ON_BOARD',
    requestedAt: '2026-03-10T10:52:00.000Z'
  },
  {
    id: 'AMB-102-OD-9813',
    emergencyType: 'Maternal Full-Term Active Labor',
    ambulanceType: '102 Janani Shishu Express (Maternal Care)',
    ambulanceTypeId: '102_JANANI',
    vehicleNo: 'OD-13-JS-1021',
    paramedic: 'Sister Bharati Mallick (ANM Attendant)',
    driver: 'Pramod Mohapatra (+91 94371 10203)',
    eta: '11 mins',
    patient: {
      name: 'Sulochana Sahu',
      phone: '+91 94392 44331',
      abha: '91-3322-5544-7788',
      age: '23',
      gender: 'Female'
    },
    patientName: 'Sulochana Sahu',
    phone: '+91 94392 44331',
    location: 'Brahmagiri Block PHC, Puri',
    pickup: 'Brahmagiri Block PHC, Puri, Odisha',
    destination: 'District Headquarters Hospital (DHH) MCH, Puri',
    contact: '+91 94392 44331',
    urgency: 'URGENT MATERNAL 102',
    status: 'TRANSIT_TO_APEX',
    requestedAt: '2026-03-10T10:55:00.000Z'
  },
  {
    id: 'AMB-108-OD-9814',
    emergencyType: 'Acute Neuro Deficit / Ischemic Stroke Window',
    ambulanceType: '108 ALS — Advanced Life Support (Stroke Ready)',
    ambulanceTypeId: 'ALS',
    vehicleNo: 'OD-02-AZ-1089',
    paramedic: 'Rajesh Pradhan (EMT-108 Neuro Specialist)',
    driver: 'Bikash Barik (+91 94371 10804)',
    eta: '7 mins',
    patient: {
      name: 'Chhabila Hansdah',
      phone: '+91 94378 99112',
      abha: '91-5544-1188-9900',
      age: '64',
      gender: 'Male'
    },
    patientName: 'Chhabila Hansdah',
    phone: '+91 94378 99112',
    location: 'Khurda Road Railway Station, Khurda',
    pickup: 'Platform 1 Exit, Khurda Road Station, Khurda',
    destination: 'AIIMS Hospital, Bhubaneswar',
    contact: '+91 94378 99112',
    urgency: 'CRITICAL STROKE WINDOW (108)',
    status: 'EN_ROUTE_PICKUP',
    requestedAt: '2026-03-10T11:02:00.000Z'
  },
  {
    id: 'AMB-108-OD-9815',
    emergencyType: 'Severe Hypoxemic Respiratory Failure',
    ambulanceType: '108 BLS — Basic Life Support (Oxygen Equipped)',
    ambulanceTypeId: 'BLS',
    vehicleNo: 'OD-07-BL-1082',
    paramedic: 'Tapas Swain (EMT-108 General)',
    driver: 'Kishore Sethi (+91 94371 10805)',
    eta: '14 mins',
    patient: {
      name: 'Gopal Krishna Panda',
      phone: '+91 94372 88440',
      abha: '91-8899-2233-5566',
      age: '59',
      gender: 'Male'
    },
    patientName: 'Gopal Krishna Panda',
    phone: '+91 94372 88440',
    location: 'Gopalpur Main Chowk, Ganjam',
    pickup: 'Gopalpur Main Chowk, Ganjam, Odisha',
    destination: 'MKCG Medical College & Hospital, Berhampur',
    contact: '+91 94372 88440',
    urgency: 'HIGH PRIORITY 108',
    status: 'PATIENT_ON_BOARD',
    requestedAt: '2026-03-10T11:06:00.000Z'
  },
  {
    id: 'AMB-108-OD-9816',
    emergencyType: 'High-Voltage Electric Shock & Burns',
    ambulanceType: '108 ALS — Advanced Life Support',
    ambulanceTypeId: 'ALS',
    vehicleNo: 'OD-15-EM-1085',
    paramedic: 'Debendra Bhoi (EMT-108 Trauma)',
    driver: 'Lalit Mirdha (+91 94371 10806)',
    eta: '12 mins',
    patient: {
      name: 'Surendra Nath Bishi',
      phone: '+91 99371 55667',
      abha: '91-1122-6677-8899',
      age: '33',
      gender: 'Male'
    },
    patientName: 'Surendra Nath Bishi',
    phone: '+91 99371 55667',
    location: 'Hirakud Industrial Area, Sambalpur',
    pickup: 'Gate No. 3, Hirakud Industrial Estate, Sambalpur',
    destination: 'VIMSAR Medical College & Hospital, Burla',
    contact: '+91 99371 55667',
    urgency: 'CRITICAL 108 EMERGENCY',
    status: 'TRANSIT_TO_APEX',
    requestedAt: '2026-03-10T11:10:00.000Z'
  },
  {
    id: 'AMB-102-OD-9817',
    emergencyType: 'Neonatal Jaundice & Severe Hypothermia',
    ambulanceType: '102 Janani Shishu Express (Warm Incubator)',
    ambulanceTypeId: '102_JANANI',
    vehicleNo: 'OD-01-JS-1028',
    paramedic: 'Sister Pratibha Marndi (SNCU Nurse)',
    driver: 'Dharanidhar Hansdah (+91 94371 10207)',
    eta: 'Arrived',
    patient: {
      name: 'Sita Soren (with Infant)',
      phone: '+91 94373 88120',
      abha: '91-4477-1100-3322',
      age: '22',
      gender: 'Female'
    },
    patientName: 'Sita Soren (with Infant)',
    phone: '+91 94373 88120',
    location: 'Remuna Block Primary Health Center, Balasore',
    pickup: 'Remuna Block PHC, Balasore, Odisha',
    destination: 'District Headquarters Hospital (DHH) SNCU, Balasore',
    contact: '+91 94373 88120',
    urgency: 'NEONATAL EMERGENCY 102',
    status: 'ARRIVED_HOSPITAL',
    requestedAt: '2026-03-10T11:14:00.000Z'
  },
  {
    id: 'AMB-108-OD-9818',
    emergencyType: 'Suspected Organophosphate Insecticide Toxicity',
    ambulanceType: '108 ALS — Advanced Life Support',
    ambulanceTypeId: 'ALS',
    vehicleNo: 'OD-04-AX-1083',
    paramedic: 'Bipin Bihari Rout (EMT-108 Senior)',
    driver: 'Akshay Jena (+91 94371 10808)',
    eta: '10 mins',
    patient: {
      name: 'Binod Bihari Samal',
      phone: '+91 94379 22001',
      abha: '91-6655-9988-1122',
      age: '49',
      gender: 'Male'
    },
    patientName: 'Binod Bihari Samal',
    phone: '+91 94379 22001',
    location: 'Bhadrak Puruna Bazar, Bhadrak',
    pickup: 'Puruna Bazar Market Chowk, Bhadrak',
    destination: 'District Headquarters Hospital (DHH), Bhadrak',
    contact: '+91 94379 22001',
    urgency: 'CRITICAL TOXICOLOGY 108',
    status: 'EN_ROUTE_PICKUP',
    requestedAt: '2026-03-10T11:18:00.000Z'
  }
];

const DEFAULT_APPOINTMENTS = [
  {
    id: 'APT-OD-2026-01',
    doctorName: {
      'or-IN': 'ଡା. ସୌମ୍ୟରଞ୍ଜନ ନାୟକ',
      'hi-IN': 'डॉ. सौम्य रंजन नायक',
      'en-IN': 'Dr. Soumya Ranjan Nayak'
    },
    doctorQualifications: 'MBBS, MD (General Medicine)',
    doctorRegNo: 'OMC-2017-66431',
    department: 'General & Emergency Medicine',
    facility: 'SCB Medical College & Hospital, Cuttack',
    district: 'Cuttack',
    room: 'OPD Room 12',
    date: '2026-03-11',
    timeSlot: '09:30 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Pratap Mohanty (ପ୍ରତାପ ମହାନ୍ତି)',
    patientPhone: '+91 98610 55432',
    patientAbha: '91-7712-4439-0021',
    patientAge: '42',
    patientGender: 'Male',
    reason: 'Hypertension follow-up & ECG evaluation',
    bookedAt: '2026-03-10T08:00:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-02',
    doctorName: {
      'or-IN': 'ଡା. ଲିପ୍ସା ରଥ',
      'hi-IN': 'डॉ. लिप्सा रथ',
      'en-IN': 'Dr. Lipsa Rath'
    },
    doctorQualifications: 'MBBS, MD, DM (Cardiology)',
    doctorRegNo: 'OMC-2015-44129',
    department: 'Cardiology & Cath Lab',
    facility: 'SCB Medical College & Hospital, Cuttack',
    district: 'Cuttack',
    room: 'Cardiac OPD Room 4',
    date: '2026-03-11',
    timeSlot: '10:15 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Nirupama Tripathy',
    patientPhone: '+91 94371 44552',
    patientAbha: '91-8844-3322-1100',
    patientAge: '56',
    patientGender: 'Female',
    reason: 'Post-PTCA Angioplasty Echo Review',
    bookedAt: '2026-03-10T08:30:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-03',
    doctorName: {
      'or-IN': 'ଡା. ମନୋଜ କୁମାର ମହାପାତ୍ର',
      'hi-IN': 'डॉ. मनोज कुमार महापात्र',
      'en-IN': 'Dr. Manoj Kumar Mohapatra'
    },
    doctorQualifications: 'MBBS, MD, DM (Neurology)',
    doctorRegNo: 'AIIMS-BBSR-2018-88',
    department: 'Neurology & Stroke Bay',
    facility: 'AIIMS Hospital, Bhubaneswar',
    district: 'Khurda',
    room: 'Super Specialty Wing Room 204',
    date: '2026-03-11',
    timeSlot: '11:00 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Ashok Kumar Sahu',
    patientPhone: '+91 98610 88221',
    patientAbha: '91-3322-4411-9988',
    patientAge: '49',
    patientGender: 'Male',
    reason: 'Frequent Hemifacial Spasms & Migraine',
    bookedAt: '2026-03-10T09:00:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-04',
    doctorName: {
      'or-IN': 'ଡା. ସ୍ନେହଲତା ଜେନା',
      'hi-IN': 'डॉ. स्नेहलता जेना',
      'en-IN': 'Dr. Snehalata Jena'
    },
    doctorQualifications: 'MBBS, MD (Pediatrics)',
    doctorRegNo: 'OMC-2019-55104',
    department: 'Pediatrics & Child Care',
    facility: 'Capital Hospital, Bhubaneswar',
    district: 'Khurda',
    room: 'Pediatric OPD Room 06',
    date: '2026-03-11',
    timeSlot: '11:45 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Master Soubhagya Behera (8 Years)',
    patientPhone: '+91 94380 99887',
    patientAbha: '91-1122-3344-5566',
    patientAge: '8',
    patientGender: 'Male',
    reason: 'Recurrent Childhood Asthma & Allergy Test',
    bookedAt: '2026-03-10T09:20:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-05',
    doctorName: {
      'or-IN': 'ଡା. ବିଭୂତି ଭୂଷଣ ନାୟକ',
      'hi-IN': 'डॉ. विभूति भूषण नायक',
      'en-IN': 'Dr. Bibhuti Bhusan Nayak'
    },
    doctorQualifications: 'MBBS, MS (Orthopedics)',
    doctorRegNo: 'OMC-2014-33290',
    department: 'Orthopedic Trauma & Joint Surgery',
    facility: 'MKCG Medical College & Hospital, Berhampur',
    district: 'Ganjam',
    room: 'Ortho OPD Room 18',
    date: '2026-03-12',
    timeSlot: '10:00 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Bipin Bihari Das',
    patientPhone: '+91 94372 55109',
    patientAbha: '91-5566-7788-2233',
    patientAge: '58',
    patientGender: 'Male',
    reason: 'Bilateral Osteoarthritis Knee Replacement Assessment',
    bookedAt: '2026-03-10T09:40:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-06',
    doctorName: {
      'or-IN': 'ଡା. ଜୟନ୍ତ କୁମାର ପଣ୍ଡା',
      'hi-IN': 'डॉ. जयंत कुमार पंडा',
      'en-IN': 'Dr. Jayant Kumar Panda'
    },
    doctorQualifications: 'MBBS, MD (Medicine)',
    doctorRegNo: 'OMC-2012-11094',
    department: 'Internal Medicine & Critical Care',
    facility: 'VIMSAR Medical College & Hospital, Burla',
    district: 'Sambalpur',
    room: 'Medicine OPD Room 02',
    date: '2026-03-12',
    timeSlot: '10:30 AM',
    consultType: 'Tele-Consultation (e-Sanjeevani)',
    patientName: 'Gitanjali Meher',
    patientPhone: '+91 99370 22441',
    patientAbha: '91-7788-9900-1122',
    patientAge: '43',
    patientGender: 'Female',
    reason: 'Uncontrolled Type-2 Diabetes & Neuropathy',
    bookedAt: '2026-03-10T10:00:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-07',
    doctorName: {
      'or-IN': 'ଡା. ମଧୁସ୍ମିତା ବେହେରା',
      'hi-IN': 'डॉ. मधुस्मिता बेहेरा',
      'en-IN': 'Dr. Madhusmita Behera'
    },
    doctorQualifications: 'MBBS, MS (ObGyn)',
    doctorRegNo: 'OMC-2018-72019',
    department: 'Obstetrics & Gynaecology',
    facility: 'District Headquarters Hospital (DHH), Puri',
    district: 'Puri',
    room: 'MCH OPD Room 01',
    date: '2026-03-12',
    timeSlot: '11:15 AM',
    consultType: 'In-Person Consultation',
    patientName: 'Runu Pradhan',
    patientPhone: '+91 94391 88320',
    patientAbha: '91-2233-4455-6677',
    patientAge: '27',
    patientGender: 'Female',
    reason: 'Antenatal 28-Week Ultrasound & Anemia Screening',
    bookedAt: '2026-03-10T10:30:00.000Z',
    status: 'Confirmed'
  },
  {
    id: 'APT-OD-2026-08',
    doctorName: {
      'or-IN': 'ଡା. ଆଲୋକ ରଞ୍ଜନ ସାହୁ',
      'hi-IN': 'डॉ. आलोक रंजन साहु',
      'en-IN': 'Dr. Alok Ranjan Sahoo'
    },
    doctorQualifications: 'MBBS, DNB (Emergency Medicine)',
    doctorRegNo: 'OMC-2020-88123',
    department: 'Emergency & Acute Care',
    facility: 'District Headquarters Hospital (DHH), Balasore',
    district: 'Balasore',
    room: 'Casualty Room 03',
    date: '2026-03-12',
    timeSlot: '12:00 PM',
    consultType: 'In-Person Consultation',
    patientName: 'Kamal Lochan Jena',
    patientPhone: '+91 94373 55902',
    patientAbha: '91-9900-1122-3344',
    patientAge: '37',
    patientGender: 'Male',
    reason: 'Post-Accident Wound Dressing & Pain Management',
    bookedAt: '2026-03-10T11:00:00.000Z',
    status: 'Confirmed'
  }
];

const DEFAULT_TRANSFERS = [
  {
    id: 'TRF-OD-8801',
    patientName: 'Gajendra Nath Nayak',
    patientPhone: '+91 94371 33441',
    patientAbha: '91-4433-2211-5566',
    urgency: 'CRITICAL APEX TRANSFER',
    reason: 'Acute ST-Elevation Coronary Thrombosis needing Primary PCI',
    clinicalReason: 'Acute ST-Elevation Coronary Thrombosis needing Primary PCI',
    originFacility: 'District Headquarters Hospital, Jagatsinghpur',
    destinationHospital: 'SCB Medical College & Hospital, Cuttack',
    ward: 'Cath Lab Emergency Post-Op Bay-1',
    assignedCounter: 'Swasthya Mitra Green Corridor Window 1',
    coordinator: 'Dr. Debabrata Mohanty (Nodal Officer)',
    contactPhone: '0671-2414080',
    schemes: 'Biju Swasthya Kalyan Yojana (BSKY)',
    ambulanceRequired: true,
    timestamp: '2026-03-10T09:15:00.000Z'
  },
  {
    id: 'TRF-OD-8802',
    patientName: 'Sumitra Senapati',
    patientPhone: '+91 94378 11209',
    patientAbha: '91-6655-4433-2211',
    urgency: 'CRITICAL NEUROLOGY',
    reason: 'Acute Traumatic Subdural Hematoma with Mass Effect',
    clinicalReason: 'Acute Traumatic Subdural Hematoma with Mass Effect',
    originFacility: 'District Headquarters Hospital, Nayagarh',
    destinationHospital: 'AIIMS Hospital, Bhubaneswar',
    ward: 'Neurosurgical ICU Bed 03',
    assignedCounter: 'Apex Trauma Fast-Track Counter A',
    coordinator: 'Dr. Sandeep Tripathy',
    contactPhone: '0674-2476789',
    schemes: 'Ayushman Bharat PM-JAY',
    ambulanceRequired: true,
    timestamp: '2026-03-10T09:40:00.000Z'
  },
  {
    id: 'TRF-OD-8803',
    patientName: 'Bhagaban Swain',
    patientPhone: '+91 94381 66772',
    patientAbha: '91-8877-6655-4433',
    urgency: 'HIGH PRIORITY NEPHROLOGY',
    reason: 'Uremic Encephalopathy needing urgent hemodialysis',
    clinicalReason: 'Uremic Encephalopathy needing urgent hemodialysis',
    originFacility: 'District Headquarters Hospital, Kendrapara',
    destinationHospital: 'Capital Hospital, Bhubaneswar',
    ward: 'Dialysis Emergency Recovery Ward',
    assignedCounter: 'Swasthya Mitra Desk 2',
    coordinator: 'Sister Minakshi Behera',
    contactPhone: '0674-2391983',
    schemes: 'Biju Swasthya Kalyan Yojana (BSKY)',
    ambulanceRequired: true,
    timestamp: '2026-03-10T10:05:00.000Z'
  },
  {
    id: 'TRF-OD-8804',
    patientName: 'Krushna Chandra Sahu',
    patientPhone: '+91 94372 99881',
    patientAbha: '91-1100-2299-3388',
    urgency: 'HIGH PRIORITY CARDIAC',
    reason: 'Non-ST Elevation MI with pulmonary edema',
    clinicalReason: 'Non-ST Elevation MI with pulmonary edema',
    originFacility: 'Aska Community Health Center (CHC), Ganjam',
    destinationHospital: 'MKCG Medical College & Hospital, Berhampur',
    ward: 'ICCU Step-Down Unit',
    assignedCounter: 'Apex Emergency Referral Cell',
    coordinator: 'Dr. R. K. Patro',
    contactPhone: '0680-2292704',
    schemes: 'Biju Swasthya Kalyan Yojana (BSKY)',
    ambulanceRequired: true,
    timestamp: '2026-03-10T10:30:00.000Z'
  },
  {
    id: 'TRF-OD-8805',
    patientName: 'Rukmini Padhan',
    patientPhone: '+91 99370 11993',
    patientAbha: '91-3344-8899-0011',
    urgency: 'SURGICAL EMERGENCY',
    reason: 'Perforated Peptic Ulcer with Generalized Peritonitis',
    clinicalReason: 'Perforated Peptic Ulcer with Generalized Peritonitis',
    originFacility: 'District Headquarters Hospital, Bargarh',
    destinationHospital: 'VIMSAR Medical College & Hospital, Burla',
    ward: 'Emergency Surgical OT & Recovery',
    assignedCounter: 'Fast-Track Emergency Desk',
    coordinator: 'Dr. S. K. Nanda',
    contactPhone: '0663-2430768',
    schemes: 'Ayushman Bharat PM-JAY',
    ambulanceRequired: true,
    timestamp: '2026-03-10T10:50:00.000Z'
  },
  {
    id: 'TRF-OD-8806',
    patientName: 'Laxmi Priya Barik',
    patientPhone: '+91 94392 77110',
    patientAbha: '91-5522-8811-4433',
    urgency: 'OBSTETRIC HIGH RISK',
    reason: 'Obstructed Labor with Fetal Distress',
    clinicalReason: 'Obstructed Labor with Fetal Distress',
    originFacility: 'Konark Urban PHC, Puri',
    destinationHospital: 'District Headquarters Hospital (DHH), Puri',
    ward: 'MCH Emergency Cesarean Section OT',
    assignedCounter: '102 Janani Fast-Track Desk',
    coordinator: 'Sister Bharati Das',
    contactPhone: '06752-222046',
    schemes: 'Janani Shishu Suraksha Karyakram (JSSK)',
    ambulanceRequired: true,
    timestamp: '2026-03-10T11:15:00.000Z'
  }
];

const APPOINTMENTS_STORAGE_KEY = 'triage_booked_appointments';

export const getBookedAppointments = () => {
  try {
    const raw = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!raw || JSON.parse(raw).length === 0) {
      localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_APPOINTMENTS));
      return DEFAULT_APPOINTMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read appointments:', e);
    return DEFAULT_APPOINTMENTS;
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
// Ambulance Booking Storage
// ─────────────────────────────────────────────
const AMBULANCE_STORAGE_KEY = 'triage_ambulance_requests';

export const getAmbulanceRequests = () => {
  try {
    const raw = localStorage.getItem(AMBULANCE_STORAGE_KEY);
    if (!raw || JSON.parse(raw).length === 0) {
      localStorage.setItem(AMBULANCE_STORAGE_KEY, JSON.stringify(DEFAULT_AMBULANCE_REQUESTS));
      return DEFAULT_AMBULANCE_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read ambulance requests:', e);
    return DEFAULT_AMBULANCE_REQUESTS;
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

export const updateAmbulanceStatus = (requestId, newStatus) => {
  const current = getAmbulanceRequests();
  const updated = current.map((r) => (r.id === requestId ? { ...r, status: newStatus } : r));
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
    if (!raw || JSON.parse(raw).length === 0) {
      localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(DEFAULT_BED_BOOKINGS));
      return DEFAULT_BED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read bed bookings:', e);
    return DEFAULT_BED_BOOKINGS;
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
    if (!raw || JSON.parse(raw).length === 0) {
      localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(DEFAULT_TRANSFERS));
      return DEFAULT_TRANSFERS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read hospital transfers:', e);
    return DEFAULT_TRANSFERS;
  }
};

export const saveHospitalTransfer = (transfer) => {
  const current = getHospitalTransfers();
  const record = {
    ...transfer,
    id: transfer.id || `TRF-OD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: transfer.timestamp || new Date().toISOString()
  };
  const updated = [record, ...current];
  localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(updated));
  return updated;
};

export const cancelHospitalTransfer = (transferId) => {
  const current = getHospitalTransfers();
  const updated = current.filter((t) => t.id !== transferId);
  localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(updated));
  return updated;
};

export const resetSystemToDefaults = () => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
  localStorage.setItem(BED_STORAGE_KEY, JSON.stringify(DEFAULT_BED_BOOKINGS));
  localStorage.setItem(AMBULANCE_STORAGE_KEY, JSON.stringify(DEFAULT_AMBULANCE_REQUESTS));
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_APPOINTMENTS));
  localStorage.setItem(HOSPITAL_TRANSFERS_KEY, JSON.stringify(DEFAULT_TRANSFERS));
  localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(DEFAULT_AUDIT_LOGS));
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

