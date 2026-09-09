/**
 * Odisha Blood Bank & Hospital Stock Dataset
 * Aligned with e-BloodBank Odisha, e-RaktKosh & Odisha State Blood Transfusion Council (OSBTC)
 * Covers ALL 30 DISTRICTS of Odisha — Govt, Medical Colleges, DHH, SDH, Private & Red Cross
 */

export const ODISHA_DISTRICTS = [
  "ALL",
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Cuttack",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam (Berhampur)",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapada",
  "Keonjhar",
  "Khurda (Bhubaneswar)",
  "Koraput",
  "Malkangiri",
  "Mayurbhanj (Baripada)",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Puri",
  "Rayagada",
  "Sambalpur (Burla)",
  "Sonepur",
  "Sundargarh (Rourkela)"
];

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
  "Bombay Group (Rare)"
];

export const BLOOD_COMPONENTS = [
  {
    "id": "WHOLE",
    "en": "Whole Blood",
    "or": "ସମ୍ପୂର୍ଣ୍ଣ ରକ୍ତ",
    "hi": "संपूर्ण रक्त"
  },
  {
    "id": "PRBC",
    "en": "Packed Red Blood Cells (PRBC)",
    "or": "ପ୍ୟାକ୍ଡ୍ ରେଡ୍ ବ୍ଲଡ୍ ସେଲ୍ (PRBC)",
    "hi": "पैक रेड ब्लड सेल्स (PRBC)"
  },
  {
    "id": "FFP",
    "en": "Fresh Frozen Plasma (FFP)",
    "or": "ଫ୍ରେସ୍ ଫ୍ରୋଜନ୍ ପ୍ଲାଜ୍ମା (FFP)",
    "hi": "ताजा फ्रोजन प्लाज्मा (FFP)"
  },
  {
    "id": "PLATELETS",
    "en": "Platelet Concentrate (RDP)",
    "or": "ପ୍ଲେଟଲେଟ୍ କନସେଣ୍ଟ୍ରେଟ୍ (RDP)",
    "hi": "प्लेटलेट सांद्रता (RDP)"
  },
  {
    "id": "SDP",
    "en": "Single Donor Platelets (SDP/Apheresis)",
    "or": "ସିଙ୍ଗଲ୍ ଡୋନର୍ ପ୍ଲେଟଲେଟ୍ (SDP)",
    "hi": "सिंगल डोनर प्लेटलेट्स (SDP)"
  }
];

export const ODISHA_BLOOD_BANKS = [
  {
    "id": "BB-CTC-001",
    "name": "Central Red Cross Blood Bank, SCB Medical College",
    "nameOdia": "ସେଣ୍ଟ୍ରାଲ୍ ରେଡ୍ କ୍ରସ୍ ରକ୍ତ ଭଣ୍ଡାର, SCB ମେଡିକାଲ୍ କଲେଜ୍",
    "hospitalName": "SCB Medical College & Hospital",
    "district": "Cuttack",
    "city": "Cuttack",
    "address": "Mangalabag, SCB Medical College Campus, Cuttack - 753007",
    "category": "Govt / Regional Transfusion Center",
    "bskyCovered": true,
    "helpline": "+91 671 2414080 / 104",
    "nodalOfficer": "Dr. Pankajini Mallick (Director, RBTC)",
    "nodalPhone": "+91 94370 88210",
    "email": "bloodbank.scb@odisha.gov.in",
    "operatingHours": "24x7 Emergency & Routine",
    "lastUpdated": "2026-09-09T09:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 16,
        "PRBC": 36,
        "FFP": 44,
        "PLATELETS": 12,
        "SDP": 4
      },
      "A-": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 8,
        "PLATELETS": 2,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 24,
        "PRBC": 50,
        "FFP": 60,
        "PLATELETS": 20,
        "SDP": 6
      },
      "B-": {
        "WHOLE": 4,
        "PRBC": 8,
        "FFP": 10,
        "PLATELETS": 4,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 12,
        "PRBC": 20,
        "FFP": 28,
        "PLATELETS": 8,
        "SDP": 2
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 2,
        "FFP": 4,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 30,
        "PRBC": 64,
        "FFP": 80,
        "PLATELETS": 28,
        "SDP": 8
      },
      "O-": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 12,
        "PLATELETS": 4,
        "SDP": 2
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "08:00 AM - 08:00 PM (Daily)"
  },
  {
    "id": "BB-CTC-002",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Cuttack",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, କଟକ",
    "hospitalName": "District Headquarter Hospital, Cuttack",
    "district": "Cuttack",
    "city": "Cuttack",
    "address": "Dolamundai, Near Badambadi, Cuttack - 753001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 671 2301234 / 104",
    "nodalOfficer": "Dr. Sarat Kumar Mohanty",
    "nodalPhone": "+91 94370 66123",
    "email": "bloodbank.dhhctc@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 9,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 13,
        "PRBC": 28,
        "FFP": 33,
        "PLATELETS": 11,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 44,
        "PLATELETS": 15,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-CTC-003",
    "name": "Ashwini Hospital Blood Bank, Cuttack",
    "nameOdia": "ଅଶ୍ୱିନୀ ହସ୍ପିଟାଲ ରକ୍ତ ଭଣ୍ଡାର, କଟକ",
    "hospitalName": "Ashwini Hospital & Research Institute",
    "district": "Cuttack",
    "city": "Cuttack",
    "address": "Sector-1, CDA, Cuttack - 753014",
    "category": "Private / NABH",
    "bskyCovered": false,
    "helpline": "+91 671 2363001",
    "nodalOfficer": "Dr. Subrata Samal",
    "nodalPhone": "+91 94370 88912",
    "email": "bloodbank@ashwinihospital.com",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:40:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 12,
        "PRBC": 25,
        "FFP": 30,
        "PLATELETS": 10,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 14,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 15,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 14,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-BBS-001",
    "name": "Capital Hospital Blood Bank, Bhubaneswar",
    "nameOdia": "କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍ ରକ୍ତ ଭଣ୍ଡାର, ଭୁବନେଶ୍ୱର",
    "hospitalName": "Capital Hospital",
    "district": "Khurda (Bhubaneswar)",
    "city": "Bhubaneswar",
    "address": "Unit-6, Near Forest Park, Bhubaneswar - 751001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 674 2391980 / 104",
    "nodalOfficer": "Dr. Debasis Swain",
    "nodalPhone": "+91 98611 44520",
    "email": "bloodbank.capital@odisha.gov.in",
    "operatingHours": "24x7 Emergency Services",
    "lastUpdated": "2026-09-09T10:15:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 14,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 11,
        "SDP": 4
      },
      "A-": {
        "WHOLE": 4,
        "PRBC": 5,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 22,
        "PRBC": 45,
        "FFP": 54,
        "PLATELETS": 18,
        "SDP": 5
      },
      "B-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 9,
        "PLATELETS": 4,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 11,
        "PRBC": 18,
        "FFP": 25,
        "PLATELETS": 7,
        "SDP": 2
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 2,
        "FFP": 4,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 27,
        "PRBC": 58,
        "FFP": 72,
        "PLATELETS": 25,
        "SDP": 7
      },
      "O-": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 11,
        "PLATELETS": 4,
        "SDP": 2
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-BBS-002",
    "name": "AIIMS Bhubaneswar Blood Bank",
    "nameOdia": "AIIMS ଭୁବନେଶ୍ୱର ରକ୍ତ ଭଣ୍ଡାର",
    "hospitalName": "All India Institute of Medical Sciences (AIIMS), Bhubaneswar",
    "district": "Khurda (Bhubaneswar)",
    "city": "Bhubaneswar",
    "address": "Sijua, Patrapada, Bhubaneswar - 751019",
    "category": "Central Govt (AIIMS)",
    "bskyCovered": true,
    "helpline": "+91 674 2476789 / 104",
    "nodalOfficer": "Dr. Prashanta Rath",
    "nodalPhone": "+91 94370 34521",
    "email": "bloodbank.aiimsbbs@aiims.edu.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T11:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 18,
        "PRBC": 40,
        "FFP": 48,
        "PLATELETS": 13,
        "SDP": 4
      },
      "A-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 9,
        "PLATELETS": 2,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 26,
        "PRBC": 55,
        "FFP": 66,
        "PLATELETS": 22,
        "SDP": 7
      },
      "B-": {
        "WHOLE": 4,
        "PRBC": 9,
        "FFP": 11,
        "PLATELETS": 4,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 13,
        "PRBC": 22,
        "FFP": 31,
        "PLATELETS": 9,
        "SDP": 2
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 2,
        "FFP": 4,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 33,
        "PRBC": 70,
        "FFP": 88,
        "PLATELETS": 31,
        "SDP": 9
      },
      "O-": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 2
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "08:00 AM - 06:00 PM (Daily)"
  },
  {
    "id": "BB-BBS-003",
    "name": "KIMS Hospital Blood Bank, Bhubaneswar",
    "nameOdia": "KIMS ହସ୍ପିଟାଲ ରକ୍ତ ଭଣ୍ଡାର, ଭୁବନେଶ୍ୱର",
    "hospitalName": "Kalinga Institute of Medical Sciences (KIMS)",
    "district": "Khurda (Bhubaneswar)",
    "city": "Bhubaneswar",
    "address": "KIIT Campus-5, Patia, Bhubaneswar - 751024",
    "category": "Private (NABH Accredited)",
    "bskyCovered": false,
    "helpline": "+91 674 6646000",
    "nodalOfficer": "Dr. Saroj Panda",
    "nodalPhone": "+91 94370 21456",
    "email": "bloodbank@kimshealth.org",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T09:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 10,
        "PRBC": 23,
        "FFP": 29,
        "PLATELETS": 8,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 16,
        "PRBC": 33,
        "FFP": 39,
        "PLATELETS": 13,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 7,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 8,
        "PRBC": 13,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 20,
        "PRBC": 42,
        "FFP": 52,
        "PLATELETS": 18,
        "SDP": 5
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 8,
        "PLATELETS": 3,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-BBS-004",
    "name": "Hi-Tech Medical College Blood Bank, Bhubaneswar",
    "nameOdia": "ହାଇ-ଟେକ ମେଡିକାଲ କଲେଜ ରକ୍ତ ଭଣ୍ଡାର, ଭୁବନେଶ୍ୱର",
    "hospitalName": "Hi-Tech Medical College & Hospital",
    "district": "Khurda (Bhubaneswar)",
    "city": "Bhubaneswar",
    "address": "Pandara, Rasulgarh, Bhubaneswar - 751025",
    "category": "Private Medical College",
    "bskyCovered": false,
    "helpline": "+91 674 2360007",
    "nodalOfficer": "Dr. Namita Rath",
    "nodalPhone": "+91 94370 55678",
    "email": "bloodbank@hitech.edu.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 12,
        "PRBC": 25,
        "FFP": 30,
        "PLATELETS": 10,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 14,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 15,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 14,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-BBS-005",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Khurda",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଖୋର୍ଦ୍ଧା ଟାଉନ୍",
    "hospitalName": "District Headquarter Hospital, Khurda Town",
    "district": "Khurda (Bhubaneswar)",
    "city": "Khurda Town",
    "address": "Palla Totapada Road, Khurda - 752055",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6755 220104 / 104",
    "nodalOfficer": "Dr. Bibhuti Bhusan Pradhan",
    "nodalPhone": "+91 94371 44556",
    "email": "bloodbank.dhhkhurda@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-MKCG-001",
    "name": "MKCG Medical College Blood Bank, Berhampur",
    "nameOdia": "ଏମ୍.କେ.ସି.ଜି. ମେଡିକାଲ୍ କଲେଜ୍ ରକ୍ତ ଭଣ୍ଡାର, ବ୍ରହ୍ମପୁର",
    "hospitalName": "MKCG Medical College & Hospital",
    "district": "Ganjam (Berhampur)",
    "city": "Berhampur",
    "address": "Medical College Campus, Berhampur - 760004",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 680 2292700 / 104",
    "nodalOfficer": "Dr. Santosh Kumar Sahu",
    "nodalPhone": "+91 94372 33410",
    "email": "bloodbank.mkcg@odisha.gov.in",
    "operatingHours": "24x7 Emergency Services",
    "lastUpdated": "2026-09-09T08:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 14,
        "PRBC": 31,
        "FFP": 37,
        "PLATELETS": 10,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 20,
        "PRBC": 43,
        "FFP": 51,
        "PLATELETS": 17,
        "SDP": 5
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 7,
        "FFP": 9,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 10,
        "PRBC": 17,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 26,
        "PRBC": 54,
        "FFP": 68,
        "PLATELETS": 24,
        "SDP": 7
      },
      "O-": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 2
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "08:30 AM - 06:00 PM"
  },
  {
    "id": "BB-GNJ-002",
    "name": "DHH Blood Bank, Chhatrapur, Ganjam",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଛତ୍ରପୁର",
    "hospitalName": "District Headquarter Hospital, Chhatrapur",
    "district": "Ganjam (Berhampur)",
    "city": "Chhatrapur",
    "address": "Collectorate Road, Chhatrapur, Ganjam - 761020",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6811 222104 / 104",
    "nodalOfficer": "Dr. Sunil Kumar Biswal",
    "nodalPhone": "+91 94373 12340",
    "email": "bloodbank.dhhganjam@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-GNJ-003",
    "name": "Sub-Divisional Hospital (SDH) Blood Bank, Bhanjanagar",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଭଞ୍ଜନଗର",
    "hospitalName": "Sub-Divisional Hospital, Bhanjanagar",
    "district": "Ganjam (Berhampur)",
    "city": "Bhanjanagar",
    "address": "Hospital Road, Bhanjanagar, Ganjam - 761126",
    "category": "Govt Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6821 241104 / 104",
    "nodalOfficer": "Dr. P. K. Panigrahi",
    "nodalPhone": "+91 94374 88711",
    "email": "bloodbank.sdhbhanjanagar@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:15:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-VIM-001",
    "name": "VIMSAR Hospital Blood Bank, Burla",
    "nameOdia": "ଭିମ୍‌ସାର୍ ହସ୍ପିଟାଲ୍ ରକ୍ତ ଭଣ୍ଡାର, ବୁର୍ଲା",
    "hospitalName": "VSS Institute of Medical Sciences & Research (VIMSAR)",
    "district": "Sambalpur (Burla)",
    "city": "Burla",
    "address": "VIMSAR Hospital Campus, Burla, Sambalpur - 768017",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 663 2430768 / 104",
    "nodalOfficer": "Dr. Subash Chandra Mishra",
    "nodalPhone": "+91 94371 66201",
    "email": "bloodbank.vimsar@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T11:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 13,
        "PRBC": 29,
        "FFP": 35,
        "PLATELETS": 10,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 19,
        "PRBC": 40,
        "FFP": 48,
        "PLATELETS": 16,
        "SDP": 5
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 8,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 10,
        "PRBC": 16,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 24,
        "PRBC": 51,
        "FFP": 64,
        "PLATELETS": 22,
        "SDP": 6
      },
      "O-": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 2
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-SBP-002",
    "name": "DHH Blood Bank, Sambalpur",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ସମ୍ବଲପୁର",
    "hospitalName": "District Headquarter Hospital, Sambalpur",
    "district": "Sambalpur (Burla)",
    "city": "Sambalpur",
    "address": "VSS Nagar, Modipara, Sambalpur - 768001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 663 2402234 / 104",
    "nodalOfficer": "Dr. Mamata Singh",
    "nodalPhone": "+91 94371 55678",
    "email": "bloodbank.dhhsbp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 12,
        "PRBC": 25,
        "FFP": 30,
        "PLATELETS": 10,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 14,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 15,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 14,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:30 PM"
  },
  {
    "id": "BB-BAL-001",
    "name": "FM Medical College & Hospital Blood Bank, Balasore",
    "nameOdia": "ଫକୀର ମୋହନ ମେଡିକାଲ୍ କଲେଜ୍ ରକ୍ତ ଭଣ୍ଡାର, ବାଲେଶ୍ୱର",
    "hospitalName": "Fakir Mohan Medical College & Hospital",
    "district": "Balasore",
    "city": "Balasore",
    "address": "Remuna, Balasore - 756019",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 6782 220104 / 104",
    "nodalOfficer": "Dr. Sujata Priyadarshini",
    "nodalPhone": "+91 94373 55190",
    "email": "bloodbank.fmmch@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:50:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 10,
        "PRBC": 22,
        "FFP": 26,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 14,
        "PRBC": 30,
        "FFP": 36,
        "PLATELETS": 12,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 12,
        "FFP": 17,
        "PLATELETS": 5,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 18,
        "PRBC": 38,
        "FFP": 48,
        "PLATELETS": 17,
        "SDP": 5
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:30 PM"
  },
  {
    "id": "BB-BAL-002",
    "name": "Red Cross Blood Bank, Balasore",
    "nameOdia": "ରେଡ୍ କ୍ରସ୍ ରକ୍ତ ଭଣ୍ଡାର, ବାଲେଶ୍ୱର",
    "hospitalName": "Indian Red Cross Society Blood Bank",
    "district": "Balasore",
    "city": "Balasore",
    "address": "Civil Lines, Near Collectorate, Balasore - 756001",
    "category": "Red Cross / Voluntary",
    "bskyCovered": true,
    "helpline": "+91 6782 260011 / 104",
    "nodalOfficer": "Dr. Pinaki Ranjan Das",
    "nodalPhone": "+91 94373 88220",
    "email": "redcross.balasore@odisha.gov.in",
    "operatingHours": "08:00 AM - 08:00 PM",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "08:00 AM - 06:00 PM"
  },
  {
    "id": "BB-RGH-001",
    "name": "Rourkela Government Hospital (RGH) Blood Bank",
    "nameOdia": "ରାଉରକେଲା ସରକାରୀ ହସ୍ପିଟାଲ୍ (RGH) ରକ୍ତ ଭଣ୍ଡାର",
    "hospitalName": "Rourkela Government Hospital (RGH)",
    "district": "Sundargarh (Rourkela)",
    "city": "Rourkela",
    "address": "Panposh Road, Rourkela - 769004",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 661 2510104 / 104",
    "nodalOfficer": "Dr. Anupama Ekka",
    "nodalPhone": "+91 94371 99312",
    "email": "bloodbank.rgh@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T10:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 11,
        "PRBC": 25,
        "FFP": 31,
        "PLATELETS": 8,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 42,
        "PLATELETS": 14,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 8,
        "PRBC": 14,
        "FFP": 20,
        "PLATELETS": 6,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 21,
        "PRBC": 45,
        "FFP": 56,
        "PLATELETS": 20,
        "SDP": 6
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 8,
        "PLATELETS": 3,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "08:30 AM - 05:00 PM"
  },
  {
    "id": "BB-SGD-002",
    "name": "DHH Blood Bank, Sundargarh Town",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ସୁନ୍ଦରଗଡ଼",
    "hospitalName": "District Headquarter Hospital, Sundargarh",
    "district": "Sundargarh (Rourkela)",
    "city": "Sundargarh",
    "address": "NH-143, Sundargarh Town - 770001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6622 232104 / 104",
    "nodalOfficer": "Dr. Ramesh Kiro",
    "nodalPhone": "+91 94371 76543",
    "email": "bloodbank.dhhsgd@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-RKL-003",
    "name": "Ispat General Hospital (IGH) Blood Bank, Rourkela",
    "nameOdia": "ଇସ୍ପାତ ଜେନେରାଲ ହସ୍ପିଟାଲ (IGH) ରକ୍ତ ଭଣ୍ଡାର, ରାଉରକେଲା",
    "hospitalName": "Ispat General Hospital (SAIL RSP)",
    "district": "Sundargarh (Rourkela)",
    "city": "Rourkela",
    "address": "Sector 19, Rourkela - 769005",
    "category": "PSU / SAIL Hospital",
    "bskyCovered": true,
    "helpline": "+91 661 2511000 / 104",
    "nodalOfficer": "Dr. Manoranjan Rout",
    "nodalPhone": "+91 94372 44100",
    "email": "bloodbank.igh@sail.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 10,
        "PRBC": 23,
        "FFP": 29,
        "PLATELETS": 8,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 16,
        "PRBC": 33,
        "FFP": 39,
        "PLATELETS": 13,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 7,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 8,
        "PRBC": 13,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 20,
        "PRBC": 42,
        "FFP": 52,
        "PLATELETS": 18,
        "SDP": 5
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 8,
        "PLATELETS": 3,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-PURI-001",
    "name": "DHH Blood Bank, Puri",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ପୁରୀ",
    "hospitalName": "District Headquarter Hospital, Puri",
    "district": "Puri",
    "city": "Puri",
    "address": "Grand Road, Near Jagannath Temple, Puri - 752001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6752 222104 / 104",
    "nodalOfficer": "Dr. Ramakanta Dash",
    "nodalPhone": "+91 94370 51234",
    "email": "bloodbank.dhhpuri@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T09:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 10,
        "PRBC": 22,
        "FFP": 26,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 14,
        "PRBC": 30,
        "FFP": 36,
        "PLATELETS": 12,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 12,
        "FFP": 17,
        "PLATELETS": 5,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 18,
        "PRBC": 38,
        "FFP": 48,
        "PLATELETS": 17,
        "SDP": 5
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-MYB-001",
    "name": "Pandit Raghunath Murmu Medical College Blood Bank, Baripada",
    "nameOdia": "ପଣ୍ଡିତ ରଘୁନାଥ ମୁର୍ମୁ ମେଡିକାଲ କଲେଜ ରକ୍ତ ଭଣ୍ଡାର, ବାରିପଦା",
    "hospitalName": "PRM Medical College & Hospital, Baripada",
    "district": "Mayurbhanj (Baripada)",
    "city": "Baripada",
    "address": "Near Airport Road, Baripada, Mayurbhanj - 757001",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 6792 255104 / 104",
    "nodalOfficer": "Dr. Saroja Soren",
    "nodalPhone": "+91 94372 87654",
    "email": "bloodbank.prmmch@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 10,
        "PRBC": 23,
        "FFP": 29,
        "PLATELETS": 8,
        "SDP": 3
      },
      "A-": {
        "WHOLE": 3,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 16,
        "PRBC": 33,
        "FFP": 39,
        "PLATELETS": 13,
        "SDP": 4
      },
      "B-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 7,
        "PLATELETS": 3,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 8,
        "PRBC": 13,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 3,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 20,
        "PRBC": 42,
        "FFP": 52,
        "PLATELETS": 18,
        "SDP": 5
      },
      "O-": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 8,
        "PLATELETS": 3,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 05:00 PM"
  },
  {
    "id": "BB-MYB-002",
    "name": "SDH Blood Bank, Rairangpur",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ରାଇରଙ୍ଗପୁର",
    "hospitalName": "Sub-Divisional Hospital, Rairangpur",
    "district": "Mayurbhanj (Baripada)",
    "city": "Rairangpur",
    "address": "Hospital Square, Rairangpur, Mayurbhanj - 757043",
    "category": "Govt Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6794 222104 / 104",
    "nodalOfficer": "Dr. D. C. Murmu",
    "nodalPhone": "+91 94374 77610",
    "email": "bloodbank.sdhrairangpur@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:20:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-KPT-001",
    "name": "SLN Medical College Blood Bank, Koraput",
    "nameOdia": "ଶାହୀଦ ଲକ୍ଷ୍ମଣ ନାୟକ ମେଡିକାଲ୍ କଲେଜ୍ ରକ୍ତ ଭଣ୍ଡାର, କୋରାପୁଟ",
    "hospitalName": "Saheed Laxman Nayak Medical College & Hospital",
    "district": "Koraput",
    "city": "Koraput",
    "address": "Janiguda, Koraput - 764020",
    "category": "Govt Tribal Regional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6852 250104 / 104",
    "nodalOfficer": "Dr. Bijay Kumar Tudu",
    "nodalPhone": "+91 94374 88120",
    "email": "bloodbank.slnmch@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:10:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 9,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 13,
        "PRBC": 28,
        "FFP": 33,
        "PLATELETS": 11,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 44,
        "PLATELETS": 15,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-KPT-002",
    "name": "DHH Blood Bank, Jeypore, Koraput",
    "nameOdia": "ସବ୍-ଡିଭିଜନାଲ୍ / DHH ରକ୍ତ ଭଣ୍ଡାର, ଜୟପୁର",
    "hospitalName": "District Sub-Divisional Hospital, Jeypore",
    "district": "Koraput",
    "city": "Jeypore",
    "address": "MG Road, Jeypore, Koraput - 764001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6854 230104 / 104",
    "nodalOfficer": "Dr. Prasanta Kumar Hota",
    "nodalPhone": "+91 94373 66120",
    "email": "bloodbank.jeypore@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-ANG-001",
    "name": "DHH Blood Bank, Angul",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଅନୁଗୁଳ",
    "hospitalName": "District Headquarter Hospital, Angul",
    "district": "Angul",
    "city": "Angul",
    "address": "Hospital Road, Angul - 759122",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6764 231104 / 104",
    "nodalOfficer": "Dr. Bikram Keshari Nanda",
    "nodalPhone": "+91 94370 44321",
    "email": "bloodbank.dhhangul@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 12,
        "PRBC": 25,
        "FFP": 30,
        "PLATELETS": 10,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 14,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 15,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 14,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-ANG-002",
    "name": "SDH Blood Bank, Talcher",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ତାଳଚେର",
    "hospitalName": "Sub-Divisional Hospital, Talcher",
    "district": "Angul",
    "city": "Talcher",
    "address": "Colliery Road, Talcher, Angul - 759100",
    "category": "Govt Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6760 240104 / 104",
    "nodalOfficer": "Dr. G. C. Behera",
    "nodalPhone": "+91 94371 99201",
    "email": "bloodbank.sdhtalcher@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:15:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-BLG-001",
    "name": "Bhima Bhoi Medical College Blood Bank, Balangir",
    "nameOdia": "ଭୀମ ଭୋଇ ମେଡିକାଲ କଲେଜ ରକ୍ତ ଭଣ୍ଡାର, ବଲାଙ୍ଗୀର",
    "hospitalName": "Bhima Bhoi Medical College & Hospital",
    "district": "Balangir",
    "city": "Balangir",
    "address": "Hospital Road, Balangir - 767001",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 6652 230104 / 104",
    "nodalOfficer": "Dr. Niranjan Sahu",
    "nodalPhone": "+91 94372 44561",
    "email": "bloodbank.bbmch@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 9,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 13,
        "PRBC": 28,
        "FFP": 33,
        "PLATELETS": 11,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 44,
        "PLATELETS": 15,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:30 PM"
  },
  {
    "id": "BB-BLG-002",
    "name": "SDH Blood Bank, Titilagarh",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ତିତିଲାଗଡ଼",
    "hospitalName": "Sub-Divisional Hospital, Titilagarh",
    "district": "Balangir",
    "city": "Titilagarh",
    "address": "Station Road, Titilagarh, Balangir - 767033",
    "category": "Govt Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6655 220104 / 104",
    "nodalOfficer": "Dr. Subhranshu Panda",
    "nodalPhone": "+91 94373 88102",
    "email": "bloodbank.sdhtitilagarh@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-BRG-001",
    "name": "DHH Blood Bank, Bargarh",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ବରଗଡ଼",
    "hospitalName": "District Headquarter Hospital, Bargarh",
    "district": "Bargarh",
    "city": "Bargarh",
    "address": "Near Town Square, Bargarh - 768028",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6646 232104 / 104",
    "nodalOfficer": "Dr. Laxmi Priya Choudhury",
    "nodalPhone": "+91 94371 88099",
    "email": "bloodbank.dhhbrg@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-BDK-001",
    "name": "DHH Blood Bank, Bhadrak",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଭଦ୍ରକ",
    "hospitalName": "District Headquarter Hospital, Bhadrak",
    "district": "Bhadrak",
    "city": "Bhadrak",
    "address": "Aradi Road, Bhadrak - 756100",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6784 252104 / 104",
    "nodalOfficer": "Dr. Asutosh Samal",
    "nodalPhone": "+91 94374 55678",
    "email": "bloodbank.dhhbdk@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 22,
        "PLATELETS": 6,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 12,
        "PRBC": 25,
        "FFP": 30,
        "PLATELETS": 10,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 6,
        "PRBC": 10,
        "FFP": 14,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 15,
        "PRBC": 32,
        "FFP": 40,
        "PLATELETS": 14,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-BDH-001",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Boudh",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ବୌଦ୍ଧ",
    "hospitalName": "District Headquarter Hospital, Boudh",
    "district": "Boudh",
    "city": "Boudh Town",
    "address": "Hospital Square, Near Mahanadi Bridge, Boudh - 762014",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6841 222104 / 104",
    "nodalOfficer": "Dr. Manoranjan Pradhan",
    "nodalPhone": "+91 94373 77812",
    "email": "bloodbank.dhhboudh@odisha.gov.in",
    "operatingHours": "24x7 Emergency Services",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-DGH-001",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Deogarh",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଦେବଗଡ଼",
    "hospitalName": "District Headquarter Hospital, Deogarh",
    "district": "Deogarh",
    "city": "Deogarh",
    "address": "Purunagarh, Near Pradhanpat Falls Road, Deogarh - 768108",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6641 226104 / 104",
    "nodalOfficer": "Dr. Trilochan Majhi",
    "nodalPhone": "+91 94372 99014",
    "email": "bloodbank.dhhdeogarh@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-DKL-001",
    "name": "DHH Blood Bank, Dhenkanal",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଢ଼େଙ୍କାନାଳ",
    "hospitalName": "District Headquarter Hospital, Dhenkanal",
    "district": "Dhenkanal",
    "city": "Dhenkanal",
    "address": "Hospital Road, Dhenkanal - 759001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6762 222104 / 104",
    "nodalOfficer": "Dr. Krushna Chandra Jena",
    "nodalPhone": "+91 94370 77889",
    "email": "bloodbank.dhhdkl@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-GJP-001",
    "name": "DHH Blood Bank, Gajapati (Paralakhemundi)",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଗଜପତି",
    "hospitalName": "District Headquarter Hospital, Paralakhemundi",
    "district": "Gajapati",
    "city": "Paralakhemundi",
    "address": "Hospital Road, Paralakhemundi, Gajapati - 761200",
    "category": "Govt Tribal District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6815 222104 / 104",
    "nodalOfficer": "Dr. Aparajita Panda",
    "nodalPhone": "+91 94374 99011",
    "email": "bloodbank.dhhgjp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-JSP-001",
    "name": "DHH Blood Bank, Jagatsinghpur",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଜଗତ୍‌ସିଂହପୁର",
    "hospitalName": "District Headquarter Hospital, Jagatsinghpur",
    "district": "Jagatsinghpur",
    "city": "Jagatsinghpur",
    "address": "College Road, Jagatsinghpur - 754103",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6724 220104 / 104",
    "nodalOfficer": "Dr. Sasmita Patra",
    "nodalPhone": "+91 94370 33456",
    "email": "bloodbank.dhhjsp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-JSP-002",
    "name": "Biju Patnaik Port Hospital Blood Bank, Paradip",
    "nameOdia": "ପାରାଦ୍ୱୀପ ପୋର୍ଟ ହସ୍ପିଟାଲ ରକ୍ତ ଭଣ୍ଡାର",
    "hospitalName": "Paradip Port Trust Hospital",
    "district": "Jagatsinghpur",
    "city": "Paradip",
    "address": "Port Trust Area, Paradip, Jagatsinghpur - 754142",
    "category": "PSU / Port Hospital",
    "bskyCovered": true,
    "helpline": "+91 6722 222104 / 104",
    "nodalOfficer": "Dr. C. R. Biswal",
    "nodalPhone": "+91 94371 33201",
    "email": "bloodbank.ppthospital@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:10:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-JJP-001",
    "name": "DHH Blood Bank, Jajpur",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଯାଜପୁର",
    "hospitalName": "District Headquarter Hospital, Jajpur",
    "district": "Jajpur",
    "city": "Jajpur Town",
    "address": "Hospital Road, Jajpur Town - 755001",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6728 222104 / 104",
    "nodalOfficer": "Dr. Pradyumna Kumar Nayak",
    "nodalPhone": "+91 94370 11234",
    "email": "bloodbank.dhhjjp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-JHR-001",
    "name": "DHH Blood Bank, Jharsuguda",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଝାରସୁଗୁଡ଼ା",
    "hospitalName": "District Headquarter Hospital, Jharsuguda",
    "district": "Jharsuguda",
    "city": "Jharsuguda",
    "address": "Main Road, Near Railway Station, Jharsuguda - 768201",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6645 272104 / 104",
    "nodalOfficer": "Dr. Sanjiv Kumar Patel",
    "nodalPhone": "+91 94374 33456",
    "email": "bloodbank.dhhjhr@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-KLD-001",
    "name": "SRM Medical College Blood Bank, Bhawanipatna, Kalahandi",
    "nameOdia": "ସହିଦ ରେଣ୍ଡୋ ମାଝୀ ମେଡିକାଲ କଲେଜ ରକ୍ତ ଭଣ୍ଡାର, ଭବାନୀପାଟଣା",
    "hospitalName": "Saheed Rendo Majhi Medical College & Hospital",
    "district": "Kalahandi",
    "city": "Bhawanipatna",
    "address": "Station Road, Bhawanipatna, Kalahandi - 766001",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 6670 230104 / 104",
    "nodalOfficer": "Dr. Arun Kumar Padhi",
    "nodalPhone": "+91 94372 11230",
    "email": "bloodbank.srmmch@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 9,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 13,
        "PRBC": 28,
        "FFP": 33,
        "PLATELETS": 11,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 44,
        "PLATELETS": 15,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-KDM-001",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Phulbani, Kandhamal",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ଫୁଲବାଣୀ, କନ୍ଧମାଳ",
    "hospitalName": "District Headquarter Hospital, Phulbani",
    "district": "Kandhamal",
    "city": "Phulbani",
    "address": "Hospital Square, Phulbani, Kandhamal - 762001",
    "category": "Govt Tribal District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6842 253104 / 104",
    "nodalOfficer": "Dr. Rabindra Nath Pradhan",
    "nodalPhone": "+91 94373 66720",
    "email": "bloodbank.dhhphulbani@odisha.gov.in",
    "operatingHours": "24x7 Emergency Services",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-KDM-002",
    "name": "SDH Blood Bank, Baliguda, Kandhamal",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ବାଲିଗୁଡ଼ା",
    "hospitalName": "Sub-Divisional Hospital, Baliguda",
    "district": "Kandhamal",
    "city": "Baliguda",
    "address": "Main Road, Baliguda, Kandhamal - 762103",
    "category": "Govt Tribal Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6846 243104 / 104",
    "nodalOfficer": "Dr. Suresh Chandra Mallick",
    "nodalPhone": "+91 94374 11980",
    "email": "bloodbank.sdhbaliguda@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:15:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 5,
        "PRBC": 11,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 2,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 7,
        "PRBC": 15,
        "FFP": 18,
        "PLATELETS": 6,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 8,
        "PLATELETS": 2,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 9,
        "PRBC": 19,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:00 PM"
  },
  {
    "id": "BB-KDP-001",
    "name": "DHH Blood Bank, Kendrapada",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, କେନ୍ଦ୍ରାପଡ଼ା",
    "hospitalName": "District Headquarter Hospital, Kendrapada",
    "district": "Kendrapada",
    "city": "Kendrapada",
    "address": "Hospital Square, Kendrapada - 754211",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6727 232104 / 104",
    "nodalOfficer": "Dr. Lipsa Mohanty",
    "nodalPhone": "+91 94370 22345",
    "email": "bloodbank.dhhkdp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 7,
        "PRBC": 16,
        "FFP": 20,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 11,
        "PRBC": 23,
        "FFP": 27,
        "PLATELETS": 9,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 9,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 14,
        "PRBC": 29,
        "FFP": 36,
        "PLATELETS": 13,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 5,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-KNJ-001",
    "name": "DD Medical College & Hospital Blood Bank, Keonjhar",
    "nameOdia": "ଧରଣୀଧର ମେଡିକାଲ କଲେଜ ରକ୍ତ ଭଣ୍ଡାର, କେନ୍ଦୁଝର",
    "hospitalName": "Dharanidhar Medical College & Hospital",
    "district": "Keonjhar",
    "city": "Keonjhar",
    "address": "Hospital Chowk, Keonjhar - 758001",
    "category": "Govt Medical College",
    "bskyCovered": true,
    "helpline": "+91 6766 255104 / 104",
    "nodalOfficer": "Dr. Gitanjali Mahanta",
    "nodalPhone": "+91 94374 22345",
    "email": "bloodbank.ddmch@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 9,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 7,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 13,
        "PRBC": 28,
        "FFP": 33,
        "PLATELETS": 11,
        "SDP": 3
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 6,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 7,
        "PRBC": 11,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 17,
        "PRBC": 35,
        "FFP": 44,
        "PLATELETS": 15,
        "SDP": 4
      },
      "O-": {
        "WHOLE": 3,
        "PRBC": 6,
        "FFP": 7,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:30 PM"
  },
  {
    "id": "BB-MLK-001",
    "name": "DHH Blood Bank, Malkangiri",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ମାଲକାନଗିରି",
    "hospitalName": "District Headquarter Hospital, Malkangiri",
    "district": "Malkangiri",
    "city": "Malkangiri",
    "address": "NH-326, Malkangiri - 764045",
    "category": "Govt Tribal District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6861 230104 / 104",
    "nodalOfficer": "Dr. Suman Lata Panda",
    "nodalPhone": "+91 94374 11020",
    "email": "bloodbank.dhhmlk@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 13,
        "FFP": 15,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 8,
        "PRBC": 18,
        "FFP": 21,
        "PLATELETS": 7,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 7,
        "FFP": 10,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 11,
        "PRBC": 22,
        "FFP": 28,
        "PLATELETS": 10,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-NBP-001",
    "name": "DHH Blood Bank, Nabarangpur",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ନବରଙ୍ଗପୁର",
    "hospitalName": "District Headquarter Hospital, Nabarangpur",
    "district": "Nabarangpur",
    "city": "Nabarangpur",
    "address": "Main Road, Nabarangpur - 764059",
    "category": "Govt Tribal District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6858 222104 / 104",
    "nodalOfficer": "Dr. Sudha Rani Pujari",
    "nodalPhone": "+91 94374 22099",
    "email": "bloodbank.dhhnbp@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:30:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-NYG-001",
    "name": "DHH Blood Bank, Nayagarh",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ନୟାଗଡ଼",
    "hospitalName": "District Headquarter Hospital, Nayagarh",
    "district": "Nayagarh",
    "city": "Nayagarh",
    "address": "Hospital Road, Nayagarh - 752069",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6753 252104 / 104",
    "nodalOfficer": "Dr. Bijaya Kumar Sahu",
    "nodalPhone": "+91 94370 66789",
    "email": "bloodbank.dhhnyg@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-NPD-001",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Nuapada",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ନୂଆପଡ଼ା",
    "hospitalName": "District Headquarter Hospital, Nuapada",
    "district": "Nuapada",
    "city": "Nuapada",
    "address": "Near Collectorate Square, Nuapada - 766105",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6678 223104 / 104",
    "nodalOfficer": "Dr. Khageswar Bishi",
    "nodalPhone": "+91 94373 55012",
    "email": "bloodbank.dhhnuapada@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-NPD-002",
    "name": "Khariar Mission Hospital Blood Bank, Khariar, Nuapada",
    "nameOdia": "ଖଡ଼ିଆଳ ମିଶନ ହସ୍ପିଟାଲ ରକ୍ତ ଭଣ୍ଡାର, ନୂଆପଡ଼ା",
    "hospitalName": "Evangelical Hospital, Khariar",
    "district": "Nuapada",
    "city": "Khariar",
    "address": "Main Road, Khariar, Nuapada - 766107",
    "category": "Trust / Mission Hospital",
    "bskyCovered": true,
    "helpline": "+91 6671 232104 / 104",
    "nodalOfficer": "Dr. Thomas Varghese",
    "nodalPhone": "+91 94371 88204",
    "email": "bloodbank.khariar@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 5,
        "PRBC": 11,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 2,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 7,
        "PRBC": 15,
        "FFP": 18,
        "PLATELETS": 6,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 8,
        "PLATELETS": 2,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 9,
        "PRBC": 19,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:30 PM"
  },
  {
    "id": "BB-RYG-001",
    "name": "DHH Blood Bank, Rayagada",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ରାୟଗଡ଼ା",
    "hospitalName": "District Headquarter Hospital, Rayagada",
    "district": "Rayagada",
    "city": "Rayagada",
    "address": "Hospital Road, Rayagada - 765001",
    "category": "Govt Tribal District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6856 222104 / 104",
    "nodalOfficer": "Dr. Jagannath Majhi",
    "nodalPhone": "+91 94374 66778",
    "email": "bloodbank.dhhryg@odisha.gov.in",
    "operatingHours": "24x7",
    "lastUpdated": "2026-09-09T07:45:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-SNP-001",
    "name": "District Headquarter Hospital (DHH) Blood Bank, Sonepur",
    "nameOdia": "ଜିଲ୍ଲା ମୁଖ୍ୟ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ସୁବର୍ଣ୍ଣପୁର (ସୋନପୁର)",
    "hospitalName": "District Headquarter Hospital, Sonepur",
    "district": "Sonepur",
    "city": "Sonepur",
    "address": "Manamunda Road, Near Block Chowk, Sonepur - 767017",
    "category": "Govt District Hospital",
    "bskyCovered": true,
    "helpline": "+91 6654 220104 / 104",
    "nodalOfficer": "Dr. Hemant Kumar Meher",
    "nodalPhone": "+91 94372 66512",
    "email": "bloodbank.dhhsonepur@odisha.gov.in",
    "operatingHours": "24x7 Emergency Services",
    "lastUpdated": "2026-09-09T08:00:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 6,
        "PRBC": 14,
        "FFP": 18,
        "PLATELETS": 5,
        "SDP": 2
      },
      "A-": {
        "WHOLE": 2,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 10,
        "PRBC": 20,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 2,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 5,
        "PRBC": 8,
        "FFP": 11,
        "PLATELETS": 3,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 2,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 12,
        "PRBC": 26,
        "FFP": 32,
        "PLATELETS": 11,
        "SDP": 3
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 4,
        "FFP": 5,
        "PLATELETS": 2,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 04:00 PM"
  },
  {
    "id": "BB-SNP-002",
    "name": "SDH Blood Bank, Birmaharajpur, Sonepur",
    "nameOdia": "ଉପଖଣ୍ଡ ଡାକ୍ତରଖାନା ରକ୍ତ ଭଣ୍ଡାର, ବୀରମହାରାଜପୁର",
    "hospitalName": "Sub-Divisional Hospital, Birmaharajpur",
    "district": "Sonepur",
    "city": "Birmaharajpur",
    "address": "Hospital Square, Birmaharajpur, Sonepur - 767018",
    "category": "Govt Sub-Divisional Hospital",
    "bskyCovered": true,
    "helpline": "+91 6651 240104 / 104",
    "nodalOfficer": "Dr. Basanta Sethi",
    "nodalPhone": "+91 94374 88310",
    "email": "bloodbank.sdhbirmaharajpur@odisha.gov.in",
    "operatingHours": "24x7 Emergency",
    "lastUpdated": "2026-09-09T07:20:00.000Z",
    "stock": {
      "A+": {
        "WHOLE": 5,
        "PRBC": 11,
        "FFP": 13,
        "PLATELETS": 4,
        "SDP": 1
      },
      "A-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 2,
        "PLATELETS": 1,
        "SDP": 0
      },
      "B+": {
        "WHOLE": 7,
        "PRBC": 15,
        "FFP": 18,
        "PLATELETS": 6,
        "SDP": 2
      },
      "B-": {
        "WHOLE": 1,
        "PRBC": 2,
        "FFP": 3,
        "PLATELETS": 1,
        "SDP": 0
      },
      "AB+": {
        "WHOLE": 4,
        "PRBC": 6,
        "FFP": 8,
        "PLATELETS": 2,
        "SDP": 1
      },
      "AB-": {
        "WHOLE": 0,
        "PRBC": 1,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      },
      "O+": {
        "WHOLE": 9,
        "PRBC": 19,
        "FFP": 24,
        "PLATELETS": 8,
        "SDP": 2
      },
      "O-": {
        "WHOLE": 2,
        "PRBC": 3,
        "FFP": 4,
        "PLATELETS": 1,
        "SDP": 1
      },
      "Bombay Group (Rare)": {
        "WHOLE": 0,
        "PRBC": 0,
        "FFP": 1,
        "PLATELETS": 0,
        "SDP": 0
      }
    },
    "acceptingDonors": true,
    "donorTimings": "09:00 AM - 03:00 PM"
  }
];

export const ODISHA_DONATION_CAMPS = [
  {
    "id": "CAMP-01",
    "title": "Utkal University Campus Blood Donation Drive",
    "titleOdia": "ଉତ୍କଳ ବିଶ୍ୱବିଦ୍ୟାଳୟ କ୍ୟାମ୍ପସ ରକ୍ତଦାନ ଶିବିର",
    "organizer": "Red Cross Odisha & Utkal University NSS Unit",
    "location": "Student Activity Centre, Utkal University, Vani Vihar, Bhubaneswar",
    "district": "Khurda (Bhubaneswar)",
    "date": "2026-09-12",
    "time": "09:00 AM - 04:00 PM",
    "contact": "+91 94371 12345",
    "targetUnits": 250
  },
  {
    "id": "CAMP-02",
    "title": "Cuttack Smart City Mega Blood Camp",
    "titleOdia": "କଟକ ସ୍ମାର୍ଟ ସିଟି ମେଗା ରକ୍ତଦାନ ଶିବିର",
    "organizer": "Odisha State Blood Transfusion Council (OSBTC) & SCBMCH",
    "location": "Barabati Stadium Pavilion, Cuttack",
    "district": "Cuttack",
    "date": "2026-09-15",
    "time": "08:30 AM - 05:00 PM",
    "contact": "+91 94370 88210",
    "targetUnits": 500
  },
  {
    "id": "CAMP-03",
    "title": "Berhampur Youth Rotary Blood Drive",
    "titleOdia": "ବ୍ରହ୍ମପୁର ଯୁବ ରୋଟାରୀ ରକ୍ତଦାନ ଶିବିର",
    "organizer": "Rotary Club Berhampur & MKCG Blood Bank",
    "location": "Town Hall, Near Bus Stand, Berhampur",
    "district": "Ganjam (Berhampur)",
    "date": "2026-09-18",
    "time": "09:00 AM - 03:30 PM",
    "contact": "+91 94372 33410",
    "targetUnits": 200
  },
  {
    "id": "CAMP-04",
    "title": "Rourkela Steel City Community Donation Camp",
    "titleOdia": "ରାଉରକେଲା ଇସ୍ପାତ ନଗରୀ ସାମୁହିକ ରକ୍ତଦାନ ଶିବିର",
    "organizer": "RGH Blood Bank & RSP Voluntary Donors",
    "location": "Sector 5 Community Centre, Rourkela",
    "district": "Sundargarh (Rourkela)",
    "date": "2026-09-20",
    "time": "09:30 AM - 04:30 PM",
    "contact": "+91 94371 99312",
    "targetUnits": 300
  },
  {
    "id": "CAMP-05",
    "title": "AIIMS Bhubaneswar Annual Mega Blood Donation Drive",
    "titleOdia": "AIIMS ଭୁବନେଶ୍ୱର ବାର୍ଷିକ ରକ୍ତଦାନ ଶିବିର",
    "organizer": "AIIMS Bhubaneswar & Resident Doctors Association",
    "location": "AIIMS Campus, Sijua, Bhubaneswar",
    "district": "Khurda (Bhubaneswar)",
    "date": "2026-09-22",
    "time": "08:00 AM - 05:00 PM",
    "contact": "+91 94370 34521",
    "targetUnits": 600
  },
  {
    "id": "CAMP-06",
    "title": "Baripada Tribal Youth Blood Donation Mahotsav",
    "titleOdia": "ବାରିପଦା ଆଦିବାସୀ ଯୁବ ରକ୍ତଦାନ ମହୋତ୍ସବ",
    "organizer": "PRM Medical College & Mayurbhanj Youth Network",
    "location": "Baripada Town Hall, Mayurbhanj",
    "district": "Mayurbhanj (Baripada)",
    "date": "2026-09-25",
    "time": "09:00 AM - 04:00 PM",
    "contact": "+91 94372 87654",
    "targetUnits": 200
  },
  {
    "id": "CAMP-07",
    "title": "Sambalpur Corporate & NCC Blood Drive",
    "titleOdia": "ସମ୍ବଲପୁର କର୍ପୋରେଟ ଓ NCC ରକ୍ତଦାନ ଶିବିର",
    "organizer": "VIMSAR Blood Bank & NCC 14 Odisha Bn",
    "location": "Shyam Lal Memorial Ground, Sambalpur",
    "district": "Sambalpur (Burla)",
    "date": "2026-09-28",
    "time": "09:00 AM - 04:00 PM",
    "contact": "+91 94371 66201",
    "targetUnits": 250
  },
  {
    "id": "CAMP-08",
    "title": "Puri Sea Beach Blood Donation Festival",
    "titleOdia": "ପୁରୀ ସମୁଦ୍ର ତଟ ରକ୍ତଦାନ ଉତ୍ସବ",
    "organizer": "DHH Puri Blood Bank & Lions Club Puri",
    "location": "Swargadwar Road Near Beach, Puri",
    "district": "Puri",
    "date": "2026-10-02",
    "time": "07:00 AM - 02:00 PM",
    "contact": "+91 94370 51234",
    "targetUnits": 300
  },
  {
    "id": "CAMP-09",
    "title": "Phulbani Hill Station Blood Donation Camp",
    "titleOdia": "ଫୁଲବାଣୀ ପାହାଡ଼ିଆ ଅଞ୍ଚଳ ରକ୍ତଦାନ ଶିବିର",
    "organizer": "Kandhamal District Administration & Red Cross",
    "location": "Biju Patnaik Indoor Stadium, Phulbani",
    "district": "Kandhamal",
    "date": "2026-10-05",
    "time": "09:00 AM - 03:30 PM",
    "contact": "+91 94373 66720",
    "targetUnits": 180
  },
  {
    "id": "CAMP-10",
    "title": "Boudh & Sonepur River Valley Voluntary Blood Camp",
    "titleOdia": "ବୌଦ୍ଧ ଓ ସୋନପୁର ମହାନଦୀ ଉପତ୍ୟକା ରକ୍ତଦାନ ଶିବିର",
    "organizer": "DHH Boudh & Nehru Yuva Kendra",
    "location": "Town Hall, Boudh Town",
    "district": "Boudh",
    "date": "2026-10-10",
    "time": "09:00 AM - 04:00 PM",
    "contact": "+91 94373 77812",
    "targetUnits": 200
  }
];
