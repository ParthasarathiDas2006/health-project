import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';

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

// ─────────────────────────────────────────────────────────────────────────────
// 1. COMMAND OVERVIEW: 30 ODISHA DISTRICTS TELEMETRY & APEX MEDICAL COLLEGES
// ─────────────────────────────────────────────────────────────────────────────
const SEED_DISTRICTS = [
  { id: 'OD-01', name: 'Khurda (ଖୋର୍ଦ୍ଧା)', zone: 'Coastal', cdmo: 'Dr. Artabandhu Nayak', hospital: 'Capital Hospital, Bhubaneswar & DHH Khurda', beds: 850, occupied: 720, icuBeds: 120, ambulanceUnits: 28, status: 'Normal', phone: '+91 674 2390124', alertCount: 0 },
  { id: 'OD-02', name: 'Cuttack (କଟକ)', zone: 'Coastal', cdmo: 'Dr. Umesh Chandra Ray', hospital: 'SCB Medical College & Hospital & DHH Cuttack', beds: 1350, occupied: 1190, icuBeds: 210, ambulanceUnits: 34, status: 'High Load', phone: '+91 671 2414011', alertCount: 2 },
  { id: 'OD-03', name: 'Ganjam (ଗଞ୍ଜାମ)', zone: 'Southern', cdmo: 'Dr. Bijay Kumar Panigrahi', hospital: 'MKCG Medical College & Hospital, Berhampur', beds: 950, occupied: 780, icuBeds: 140, ambulanceUnits: 26, status: 'Normal', phone: '+91 680 2220199', alertCount: 1 },
  { id: 'OD-04', name: 'Sambalpur (ସମ୍ବଲପୁର)', zone: 'Western', cdmo: 'Dr. Pankaj Kumar Patel', hospital: 'VIMSAR Medical College, Burla & DHH Sambalpur', beds: 820, occupied: 690, icuBeds: 110, ambulanceUnits: 22, status: 'Alert', phone: '+91 663 2400331', alertCount: 3 },
  { id: 'OD-05', name: 'Puri (ପୁରୀ)', zone: 'Coastal', cdmo: 'Dr. Sujata Mishra', hospital: 'District Headquarters Hospital (DHH), Puri', beds: 480, occupied: 360, icuBeds: 60, ambulanceUnits: 18, status: 'Normal', phone: '+91 6752 222045', alertCount: 0 },
  { id: 'OD-06', name: 'Mayurbhanj (ମୟୂରଭଞ୍ଜ)', zone: 'Northern', cdmo: 'Dr. Roopnarayan Marndi', hospital: 'PRM Medical College & Hospital, Baripada', beds: 650, occupied: 510, icuBeds: 75, ambulanceUnits: 24, status: 'Normal', phone: '+91 6792 252100', alertCount: 1 },
  { id: 'OD-07', name: 'Sundargarh (ସୁନ୍ଦରଗଡ଼)', zone: 'Western', cdmo: 'Dr. Dharanidhar Sahu', hospital: 'GMC Sundargarh & IGH Rourkela', beds: 780, occupied: 610, icuBeds: 95, ambulanceUnits: 25, status: 'Normal', phone: '+91 6622 272201', alertCount: 0 },
  { id: 'OD-08', name: 'Balasore (ବାଲେଶ୍ୱର)', zone: 'Coastal', cdmo: 'Dr. Dulalsen Jagatdeo', hospital: 'FM Medical College & Hospital, Balasore', beds: 590, occupied: 470, icuBeds: 80, ambulanceUnits: 20, status: 'Normal', phone: '+91 6782 262022', alertCount: 0 },
  { id: 'OD-09', name: 'Kalahandi (କଳାହାଣ୍ଡି)', zone: 'Southern', cdmo: 'Dr. Nihar Ranjan Das', hospital: 'Saheed Rendo Majhi GMC & Hospital, Bhawanipatna', beds: 520, occupied: 410, icuBeds: 65, ambulanceUnits: 19, status: 'Normal', phone: '+91 6670 230412', alertCount: 0 },
  { id: 'OD-10', name: 'Koraput (କୋରାପୁଟ)', zone: 'Southern', cdmo: 'Dr. Arun Kumar Padhi', hospital: 'SLN Medical College & Hospital, Koraput', beds: 580, occupied: 460, icuBeds: 70, ambulanceUnits: 22, status: 'Normal', phone: '+91 6852 250341', alertCount: 1 },
  { id: 'OD-11', name: 'Angul (ଅନୁଗୋଳ)', zone: 'Central', cdmo: 'Dr. Trilochan Pradhan', hospital: 'District Headquarters Hospital, Angul', beds: 380, occupied: 290, icuBeds: 45, ambulanceUnits: 16, status: 'Normal', phone: '+91 6764 230214', alertCount: 0 },
  { id: 'OD-12', name: 'Balangir (ବଲାଙ୍ଗୀର)', zone: 'Western', cdmo: 'Dr. Kuber Chandra Mahanta', hospital: 'Bhima Bhoi Medical College, Balangir', beds: 560, occupied: 450, icuBeds: 70, ambulanceUnits: 20, status: 'Alert', phone: '+91 6652 232145', alertCount: 2 },
  { id: 'OD-13', name: 'Bargarh (ବରଗଡ଼)', zone: 'Western', cdmo: 'Dr. Sadhu Charan Sahoo', hospital: 'District Headquarters Hospital, Bargarh', beds: 360, occupied: 280, icuBeds: 40, ambulanceUnits: 15, status: 'Normal', phone: '+91 6646 233211', alertCount: 0 },
  { id: 'OD-14', name: 'Bhadrak (ଭଦ୍ରକ)', zone: 'Coastal', cdmo: 'Dr. Santosh Kumar Patra', hospital: 'District Headquarters Hospital, Bhadrak', beds: 410, occupied: 320, icuBeds: 50, ambulanceUnits: 16, status: 'Normal', phone: '+91 6784 251200', alertCount: 0 },
  { id: 'OD-15', name: 'Boudh (ବୌଦ୍ଧ)', zone: 'Central', cdmo: 'Dr. Madan Mohan Pradhan', hospital: 'District Headquarters Hospital, Boudh', beds: 240, occupied: 170, icuBeds: 25, ambulanceUnits: 12, status: 'Normal', phone: '+91 6841 222310', alertCount: 0 },
  { id: 'OD-16', name: 'Deogarh (ଦେବଗଡ଼)', zone: 'Western', cdmo: 'Dr. Manoj Kumar Upadhyay', hospital: 'District Headquarters Hospital, Deogarh', beds: 210, occupied: 140, icuBeds: 20, ambulanceUnits: 10, status: 'Normal', phone: '+91 6641 226201', alertCount: 0 },
  { id: 'OD-17', name: 'Dhenkanal (ଢେଙ୍କାନାଳ)', zone: 'Central', cdmo: 'Dr. Ashok Kumar Das', hospital: 'District Headquarters Hospital, Dhenkanal', beds: 390, occupied: 295, icuBeds: 45, ambulanceUnits: 15, status: 'Normal', phone: '+91 6762 224320', alertCount: 0 },
  { id: 'OD-18', name: 'Gajapati (ଗଜପତି)', zone: 'Southern', cdmo: 'Dr. Pradeep Kumar Patra', hospital: 'District Headquarters Hospital, Paralakhemundi', beds: 280, occupied: 205, icuBeds: 30, ambulanceUnits: 14, status: 'Normal', phone: '+91 6815 222411', alertCount: 0 },
  { id: 'OD-19', name: 'Jagatsinghpur (ଜଗତସିଂହପୁର)', zone: 'Coastal', cdmo: 'Dr. Basanta Kumar Jena', hospital: 'District Headquarters Hospital, Jagatsinghpur', beds: 350, occupied: 270, icuBeds: 40, ambulanceUnits: 14, status: 'Normal', phone: '+91 6724 220202', alertCount: 0 },
  { id: 'OD-20', name: 'Jajpur (ଯାଜପୁର)', zone: 'Coastal', cdmo: 'Dr. Shibasis Mohanty', hospital: 'Jajpur GMC & DHH Jajpur', beds: 520, occupied: 410, icuBeds: 65, ambulanceUnits: 18, status: 'Normal', phone: '+91 6728 222123', alertCount: 0 },
  { id: 'OD-21', name: 'Jharsuguda (ଝାରସୁଗୁଡ଼ା)', zone: 'Western', cdmo: 'Dr. Jayakrushna Naik', hospital: 'District Headquarters Hospital, Jharsuguda', beds: 320, occupied: 250, icuBeds: 40, ambulanceUnits: 14, status: 'Normal', phone: '+91 6645 272101', alertCount: 0 },
  { id: 'OD-22', name: 'Kandhamal (କନ୍ଧମାଳ)', zone: 'Central', cdmo: 'Dr. Manoranjan Routray', hospital: 'District Headquarters Hospital, Phulbani', beds: 340, occupied: 260, icuBeds: 35, ambulanceUnits: 16, status: 'Normal', phone: '+91 6842 253210', alertCount: 1 },
  { id: 'OD-23', name: 'Kendrapara (କେନ୍ଦ୍ରାପଡ଼ା)', zone: 'Coastal', cdmo: 'Dr. Anita Patnaik', hospital: 'District Headquarters Hospital, Kendrapara', beds: 390, occupied: 305, icuBeds: 45, ambulanceUnits: 16, status: 'Normal', phone: '+91 6727 232410', alertCount: 0 },
  { id: 'OD-24', name: 'Keonjhar (କେନ୍ଦୁଝର)', zone: 'Northern', cdmo: 'Dr. Kishore Kumar Prusty', hospital: 'Dharani Dhar GMC & Hospital, Keonjhar', beds: 560, occupied: 430, icuBeds: 70, ambulanceUnits: 20, status: 'Normal', phone: '+91 6766 255200', alertCount: 0 },
  { id: 'OD-25', name: 'Malkangiri (ମାଲକାନଗିରି)', zone: 'Southern', cdmo: 'Dr. Prafulla Kumar Nanda', hospital: 'District Headquarters Hospital, Malkangiri', beds: 320, occupied: 240, icuBeds: 35, ambulanceUnits: 16, status: 'Normal', phone: '+91 6861 230214', alertCount: 1 },
  { id: 'OD-26', name: 'Nabarangpur (ନବରଙ୍ଗପୁର)', zone: 'Southern', cdmo: 'Dr. Santosh Kumar Nayak', hospital: 'District Headquarters Hospital, Nabarangpur', beds: 350, occupied: 275, icuBeds: 40, ambulanceUnits: 16, status: 'Normal', phone: '+91 6858 222144', alertCount: 0 },
  { id: 'OD-27', name: 'Nayagarh (ନୟାଗଡ଼)', zone: 'Central', cdmo: 'Dr. Swarnalata Mohapatra', hospital: 'District Headquarters Hospital, Nayagarh', beds: 340, occupied: 260, icuBeds: 40, ambulanceUnits: 14, status: 'Normal', phone: '+91 6753 252123', alertCount: 0 },
  { id: 'OD-28', name: 'Nuapada (ନୂଆପଡ଼ା)', zone: 'Western', cdmo: 'Dr. Kali Prasad Sahu', hospital: 'District Headquarters Hospital, Nuapada', beds: 260, occupied: 195, icuBeds: 30, ambulanceUnits: 12, status: 'Normal', phone: '+91 6678 223400', alertCount: 0 },
  { id: 'OD-29', name: 'Rayagada (ରାୟଗଡ଼ା)', zone: 'Southern', cdmo: 'Dr. Lalmohan Routray', hospital: 'District Headquarters Hospital, Rayagada', beds: 360, occupied: 285, icuBeds: 45, ambulanceUnits: 16, status: 'Normal', phone: '+91 6856 222134', alertCount: 1 },
  { id: 'OD-30', name: 'Subarnapur (ସୁବର୍ଣ୍ଣପୁର)', zone: 'Western', cdmo: 'Dr. Bisweswar Mishra', hospital: 'District Headquarters Hospital, Sonepur', beds: 240, occupied: 175, icuBeds: 25, ambulanceUnits: 12, status: 'Normal', phone: '+91 6654 220211', alertCount: 0 }
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. HOSPITAL BED RESERVATIONS & OCCUPANCY
// ─────────────────────────────────────────────────────────────────────────────
const SEED_BEDS = [
  {
    id: 'BED-CAP-ICU-04',
    facilityName: 'Capital Hospital, Bhubaneswar',
    facilityType: 'District Headquarters Hospital',
    wardType: 'Emergency ICU / HDU',
    bedNumber: 'ICU-Bed-04 (Oxygen Supported)',
    bedType: 'ICU Ventilator Bed',
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
    bedType: 'High Dependency HDU Bed',
    patientName: 'Kailash Chandra Sahoo',
    patientAge: 62,
    patientGender: 'Male',
    patientPhone: '+91 94375 66778',
    admissionDate: '2026-03-10',
    status: 'Occupied',
    assignedDoctor: 'Dr. Lipsa Rath'
  },
  {
    id: 'BED-GEN-CAP-12',
    facilityName: 'Capital Hospital, Bhubaneswar',
    facilityType: 'District Hospital',
    wardType: 'General Medical Ward',
    bedNumber: 'GEN-WARD-12',
    bedType: 'General Inpatient Ward Bed',
    patientName: 'Ramesh Chandra Patra',
    patientAge: 44,
    patientGender: 'Male',
    patientPhone: '+91 98610 33412',
    admissionDate: '2026-03-11',
    status: 'Occupied',
    assignedDoctor: 'Dr. Soumya Ranjan Nayak'
  },
  {
    id: 'BED-MAT-SCB-06',
    facilityName: 'SCB Medical College & Hospital, Cuttack',
    facilityType: 'Apex Maternal Center',
    wardType: 'Maternal & Neonatal Wing',
    bedNumber: 'MCH-NICU-06',
    bedType: 'Maternity & Neonatal NICU Bed',
    patientName: 'Priyanka Mohapatra',
    patientAge: 27,
    patientGender: 'Female',
    patientPhone: '+91 94371 99882',
    admissionDate: '2026-03-11',
    status: 'Occupied',
    assignedDoctor: 'Dr. Lipsa Rath'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. BLOOD BANK NETWORK: BLOOD INVENTORY & REQUISITIONS
// ─────────────────────────────────────────────────────────────────────────────
const SEED_BLOOD_INVENTORY = [
  { id: 'BLD-CAP-A-POS', hospital: 'Capital Hospital Blood Centre, Bhubaneswar', bloodGroup: 'A+', unitsAvailable: 48, status: 'Sufficient', lastStockCheck: '2026-03-12' },
  { id: 'BLD-CAP-B-POS', hospital: 'Capital Hospital Blood Centre, Bhubaneswar', bloodGroup: 'B+', unitsAvailable: 62, status: 'Sufficient', lastStockCheck: '2026-03-12' },
  { id: 'BLD-CAP-O-POS', hospital: 'Capital Hospital Blood Centre, Bhubaneswar', bloodGroup: 'O+', unitsAvailable: 74, status: 'Sufficient', lastStockCheck: '2026-03-12' },
  { id: 'BLD-CAP-AB-POS', hospital: 'Capital Hospital Blood Centre, Bhubaneswar', bloodGroup: 'AB+', unitsAvailable: 22, status: 'Normal', lastStockCheck: '2026-03-12' },
  { id: 'BLD-CAP-O-NEG', hospital: 'Capital Hospital Blood Centre, Bhubaneswar', bloodGroup: 'O-', unitsAvailable: 6, status: 'Critical Shortage', lastStockCheck: '2026-03-12' },
  { id: 'BLD-SCB-B-POS', hospital: 'SCB Medical College Blood Bank, Cuttack', bloodGroup: 'B+', unitsAvailable: 85, status: 'Sufficient', lastStockCheck: '2026-03-12' },
  { id: 'BLD-SCB-AB-NEG', hospital: 'SCB Medical College Blood Bank, Cuttack', bloodGroup: 'AB-', unitsAvailable: 4, status: 'Critical Shortage', lastStockCheck: '2026-03-12' }
];

const SEED_BLOOD_REQUESTS = [
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
  },
  {
    id: 'REQ-BLD-102942',
    patientName: 'Alok Kumar Behera',
    bloodGroup: 'O Negative (O-)',
    unitsRequired: 3,
    component: 'Single Donor Platelets (SDP)',
    hospital: 'SCB Medical College Blood Bank, Cuttack',
    urgency: 'CRITICAL',
    contactPerson: 'Sunil Behera',
    contactPhone: '+91 94370 77123',
    createdAt: '2026-03-11T10:15:00.000Z',
    status: 'ACTIVE_SEARCH'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. IDSP OUTBREAK RADAR: DISTRICT EPIDEMIC SURVEILLANCE ALERTS
// ─────────────────────────────────────────────────────────────────────────────
const SEED_OUTBREAK_ALERTS = [
  {
    id: 'OUT-IDSP-2026-01',
    district: 'Balangir',
    block: 'Patnagarh',
    diseaseName: 'Acute Watery Diarrhea Cluster Surge',
    suspectedPathogen: 'Vibrio cholerae / Water contamination',
    caseCount24h: 19,
    cumulativeCases: 42,
    severity: 'RED ALERT',
    primarySymptoms: 'Watery Stools, Dehydration, Vomiting',
    idspFormStatus: 'Form S Auto-Generated & Dispatched',
    nodalOfficer: 'District Surveillance Officer (DSO), Balangir',
    officerPhone: '+91 6652 232145',
    containmentActions: 'Chlorination of water sources, 2,000 ORS packets & halogen tablets mobilized',
    status: 'ACTIVE_OUTBREAK',
    reportedAt: '2026-03-12T06:30:00.000Z'
  },
  {
    id: 'OUT-IDSP-2026-02',
    district: 'Khurda',
    block: 'Khandagiri Ward, Bhubaneswar',
    diseaseName: 'Dengue Serotype-2 Cluster Spike',
    suspectedPathogen: 'Dengue Virus (DENV-2)',
    caseCount24h: 12,
    cumulativeCases: 28,
    severity: 'AMBER WARNING',
    primarySymptoms: 'High Fever, Retro-orbital Pain, Thrombocytopenia',
    idspFormStatus: 'Form L Lab Verification Confirmed',
    nodalOfficer: 'Chief Municipal Health Officer (CMHO), BMC',
    officerPhone: '+91 674 2390124',
    containmentActions: 'Intensive vector fogging and dry-day campaign initiated',
    status: 'UNDER_SURVEILLANCE',
    reportedAt: '2026-03-11T14:00:00.000Z'
  },
  {
    id: 'OUT-IDSP-2026-03',
    district: 'Koraput',
    block: 'Bandhugaon Block',
    diseaseName: 'Plasmodium Falciparum Malaria Cluster',
    suspectedPathogen: 'P. Falciparum',
    caseCount24h: 15,
    cumulativeCases: 37,
    severity: 'AMBER WARNING',
    primarySymptoms: 'Chills, Rigors, High Fever, Splenomegaly',
    idspFormStatus: 'Form S Auto-Generated',
    nodalOfficer: 'CDMO Office, Koraput',
    officerPhone: '+91 6852 250341',
    containmentActions: 'Rapid diagnostic kits (RDT) and ACT therapy buffer stocks dispatched',
    status: 'CONTAINED',
    reportedAt: '2026-03-10T11:20:00.000Z'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// 5. DRUG STOCK LINKAGE: ESSENTIAL MEDICINES INVENTORY (NLEM ODISHA)
// ─────────────────────────────────────────────────────────────────────────────
const SEED_DRUG_INVENTORY = [
  { id: 'DRG-NLEM-01', medicineName: 'Paracetamol 500mg Tablets', category: 'Antipyretic / Analgesic', totalStock: 48000, unit: 'Tablets', threshold: 10000, facility: 'Central Medical Store, Capital Hospital', batchNo: 'PCM-2025-A18', expiryDate: '2027-08-31', status: 'Adequate' },
  { id: 'DRG-NLEM-02', medicineName: 'Amoxicillin 500mg Capsules', category: 'Antibiotic', totalStock: 18500, unit: 'Capsules', threshold: 5000, facility: 'Central Medical Store, Capital Hospital', batchNo: 'AMX-2025-C09', expiryDate: '2027-04-30', status: 'Adequate' },
  { id: 'DRG-NLEM-03', medicineName: 'Oral Rehydration Salts (ORS) WHO Formula', category: 'Electrolyte Replenisher', totalStock: 12400, unit: 'Sachets', threshold: 4000, facility: 'Balangir DHH Store', batchNo: 'ORS-2025-D11', expiryDate: '2028-01-31', status: 'Adequate (Dispatched to Outbreak)' },
  { id: 'DRG-NLEM-04', medicineName: 'Anti-Rabies Vaccine (ARV 2.5 IU)', category: 'Biological / Emergency Vaccine', totalStock: 140, unit: 'Vials', threshold: 200, facility: 'Capital Hospital Emergency Bay', batchNo: 'ARV-2025-R02', expiryDate: '2026-11-30', status: 'Low Stock Alert (Reorder Sent)' },
  { id: 'DRG-NLEM-05', medicineName: 'Polyvalent Snake Antivenom (ASV)', category: 'Emergency Antidote', totalStock: 85, unit: 'Vials', threshold: 100, facility: 'MKCG Medical College Store', batchNo: 'ASV-2025-S44', expiryDate: '2027-09-30', status: 'Low Stock Alert' },
  { id: 'DRG-NLEM-06', medicineName: 'Human Actrapid Insulin 100 IU/ml', category: 'Endocrine / Diabetes', totalStock: 620, unit: 'Vials', threshold: 250, facility: 'SCB Medical College Pharmacy', batchNo: 'INS-2025-I08', expiryDate: '2026-12-31', status: 'Adequate' },
  { id: 'DRG-NLEM-07', medicineName: 'Iron & Folic Acid (IFA) Tablets', category: 'Maternal ANC Nutrition', totalStock: 65000, unit: 'Tablets', threshold: 15000, facility: 'Bhubaneswar Urban CHC', batchNo: 'IFA-2025-M01', expiryDate: '2027-10-31', status: 'Adequate' },
  { id: 'DRG-NLEM-08', medicineName: 'Ceftriaxone 1g Injection', category: 'Broad Spectrum Antibiotic', totalStock: 3400, unit: 'Vials', threshold: 1500, facility: 'Capital Hospital ICU', batchNo: 'CFT-2025-E91', expiryDate: '2027-06-30', status: 'Adequate' }
];

// ─────────────────────────────────────────────────────────────────────────────
// 6. DPDP ACT 2023 CONSENT LOGS & DOCTOR RLHF ACCURACY FEEDBACK
// ─────────────────────────────────────────────────────────────────────────────
const SEED_DPDP_CONSENTS = [
  {
    id: 'DPDP-AUD-2026-001',
    citizenName: 'partha sarathi das',
    userId: 'USR-273871',
    phone: '7682055855',
    district: 'Khurda',
    consentType: 'Audio Multilingual Consent & ABDM Transit Protocol',
    language: 'or-IN',
    consentPrompt: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଡାକ୍ତର ସମୀକ୍ଷା ପାଇଁ ବ୍ୟବହୃତ ହେବ। (Your health data will be used for clinician review)',
    timestamp: '2026-10-04T05:21:13.871Z',
    status: 'CONSENT_GRANTED_ENCRYPTED',
    hashSignature: 'SHA256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069'
  },
  {
    id: 'DPDP-AUD-2026-002',
    citizenName: 'Basanta Kumar Sahoo',
    userId: 'USR-PAT-001',
    phone: '+91 94372 88190',
    district: 'Khurda',
    consentType: 'Audio Multilingual Consent & ABDM Transit Protocol',
    language: 'or-IN',
    consentPrompt: 'ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଡାକ୍ତର ସମୀକ୍ଷା ପାଇଁ ବ୍ୟବହୃତ ହେବ।',
    timestamp: '2026-03-10T09:00:00.000Z',
    status: 'CONSENT_GRANTED_ENCRYPTED',
    hashSignature: 'SHA256:d8578edf8458ce06fbc5bb76a58c5ca4D1794f28'
  }
];

const SEED_RLHF_FEEDBACK = [
  {
    id: 'RLHF-DOC-2026-101',
    evaluator: 'Dr. Rajesh Verma',
    staffId: 'MCI-2016-77824',
    ticketId: 'TRG-101',
    patientSymptomCluster: 'Severe Fever 103.1F, low platelet 42k, bleeding gums',
    aiDifferential: 'Dengue Hemorrhagic Fever (Severity: RED, Confidence: 94.2%)',
    doctorVerdict: 'CORRECT & CLINICALLY VALIDATED',
    clinicalAccuracyScore: 9.8,
    actionNotes: 'Immediate platelet monitoring, IV fluid replacement per NVBDCP protocols',
    modelTunedAt: '2026-03-12T09:30:00.000Z'
  },
  {
    id: 'RLHF-DOC-2026-102',
    evaluator: 'Dr. Soumya Ranjan Nayak',
    staffId: 'OMC-2017-66431',
    ticketId: 'TRG-102',
    patientSymptomCluster: 'BP 164/102, headache, pregnant 32 weeks, visual disturbance',
    aiDifferential: 'Severe Pre-Eclampsia (Severity: RED, Confidence: 82.5%)',
    doctorVerdict: 'ACCURATE - CRITICAL LIFE SAVING ALERT',
    clinicalAccuracyScore: 10.0,
    actionNotes: 'Referred directly to SCB Apex Maternal HDU, MgSO4 protocol initiated',
    modelTunedAt: '2026-03-12T10:00:00.000Z'
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTE SEEDING TO CLOUD FIRESTORE
// ─────────────────────────────────────────────────────────────────────────────
async function seedAllModules() {
  console.log('================================================================');
  console.log('Seeding ALL 6 Super Admin Modules to Firestore (swasthya-mitra-48b58)');
  console.log('================================================================');

  try {
    // Batch 1: Districts, Beds, Blood Inventory, Blood Requests
    const batch1 = writeBatch(db);

    console.log('1. Adding 30 Odisha Districts to swasthya_command_districts ...');
    for (const d of SEED_DISTRICTS) {
      batch1.set(doc(db, 'swasthya_command_districts', d.id), { ...d, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    console.log('2. Adding Hospital Bed Reservations to swasthya_bed_bookings & swasthya_bed_booking ...');
    for (const b of SEED_BEDS) {
      batch1.set(doc(db, 'swasthya_bed_bookings', b.id), { ...b, _syncedAt: new Date().toISOString() }, { merge: true });
      batch1.set(doc(db, 'swasthya_bed_booking', b.id), { ...b, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    console.log('3. Adding Blood Inventory & Requests to swasthya_blood_inventory & swasthya_blood_requests ...');
    for (const bld of SEED_BLOOD_INVENTORY) {
      batch1.set(doc(db, 'swasthya_blood_inventory', bld.id), { ...bld, _syncedAt: new Date().toISOString() }, { merge: true });
    }
    for (const req of SEED_BLOOD_REQUESTS) {
      batch1.set(doc(db, 'swasthya_blood_requests', req.id), { ...req, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    await batch1.commit();
    console.log('✓ Batch 1 (Districts, Beds, Blood Bank) committed successfully!\n');

    // Batch 2: IDSP Outbreaks, Drug Stock, DPDP Consents, RLHF
    const batch2 = writeBatch(db);

    console.log('4. Adding IDSP Epidemic Outbreaks to swasthya_idsp_outbreaks ...');
    for (const out of SEED_OUTBREAK_ALERTS) {
      batch2.set(doc(db, 'swasthya_idsp_outbreaks', out.id), { ...out, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    console.log('5. Adding Drug Stocks to swasthya_drug_inventory ...');
    for (const drg of SEED_DRUG_INVENTORY) {
      batch2.set(doc(db, 'swasthya_drug_inventory', drg.id), { ...drg, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    console.log('6. Adding DPDP Consents to swasthya_dpdp_consents ...');
    for (const dpdp of SEED_DPDP_CONSENTS) {
      batch2.set(doc(db, 'swasthya_dpdp_consents', dpdp.id), { ...dpdp, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    console.log('7. Adding Doctor RLHF Feedback to swasthya_rlhf_feedback ...');
    for (const rlhf of SEED_RLHF_FEEDBACK) {
      batch2.set(doc(db, 'swasthya_rlhf_feedback', rlhf.id), { ...rlhf, _syncedAt: new Date().toISOString() }, { merge: true });
    }

    await batch2.commit();
    console.log('✓ Batch 2 (IDSP Outbreak Radar, Drug Stock, DPDP & RLHF) committed successfully!\n');

    console.log('================================================================');
    console.log('ALL 6 SUPER ADMIN MODULES ARE NOW LIVE IN YOUR FIRESTORE CLOUD!');
    console.log('================================================================');
  } catch (err) {
    console.error('SEEDING_FAILED:', err.code, err.message);
  }
  process.exit(0);
}

seedAllModules();
