import React, { useState, useEffect, useMemo } from 'react';
import {
  Bed,
  Building2,
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  X,
  Printer,
  ChevronRight,
  Activity,
  Heart,
  Baby,
  Stethoscope,
  Info,
  Calendar,
  User,
  Trash2,
  ExternalLink,
  Sparkles,
  FileText,
  Lock,
  Key,
  Copy,
  Check,
  Compass,
  Navigation,
  DoorOpen
} from 'lucide-react';
import { getBedBookings, saveBedBooking, cancelBedBooking } from '../utils/authStorage';

// High-resolution bed showcase data with real generated images & specifications
const BED_TYPES = [
  {
    id: 'icu',
    name: {
      'or-IN': 'ଆଇସିୟୁ ଭେଣ୍ଟିଲେଟର୍ ବେଡ୍ (ICU Bed)',
      'hi-IN': 'आईसीयू वेंटिलेटर बेड (ICU Bed with Ventilator)',
      'en-IN': 'ICU Bed (with Mechanical Ventilator)'
    },
    category: 'Critical Care',
    image: '/beds/icu_ventilator.jpg',
    description: {
      'or-IN': 'ଅତ୍ୟାଧୁନିକ ଭେଣ୍ଟିଲେଟର୍, ମଲ୍ଟି-ପାରାମିଟର୍ ଇସିଜି ଓ ଅକ୍ସିଜେନ୍ ମନିଟର୍ ସହିତ ଗୁରୁତର ରୋଗୀଙ୍କ ପାଇଁ।',
      'hi-IN': 'उन्नत वेंटिलेटर, मल्टी-पैरामीटर ईसीजी और ऑक्सीजन मॉनिटर के साथ गंभीर रोगियों के लिए।',
      'en-IN': 'Advanced mechanical ventilator, continuous ECG, SpO2 & invasive arterial pressure telemetry.'
    },
    features: ['Mechanical Ventilator', 'Multi-param Monitor', 'Motorized Fowler', 'Infusion Pumps'],
    color: 'from-rose-500 to-red-600',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹4,500 Pvt',
    totalAvailable: 48
  },
  {
    id: 'oxygen',
    name: {
      'or-IN': 'ଅକ୍ସିଜେନ୍ ଏଚ୍.ଡି.ୟୁ ବେଡ୍ (Oxygen HDU)',
      'hi-IN': 'ऑक्सीजन एचडीयू बेड (Oxygen HDU Bed)',
      'en-IN': 'Oxygen HDU Bed (High Dependency Unit)'
    },
    category: 'High Dependency',
    image: '/beds/oxygen_hdu.jpg',
    description: {
      'or-IN': 'ନିରନ୍ତର ସେଣ୍ଟ୍ରାଲ୍ ପାଇପ୍ ଅକ୍ସିଜେନ୍ ଯୋଗାଣ, ପଲ୍ସ ଅକ୍ସିମିଟର ଏବଂ ନର୍ସିଂ ତଦାରଖ।',
      'hi-IN': 'निरंतर सेंट्रल पाइप्ड ऑक्सीजन आपूर्ति, पल्स ऑक्सीमीटर और विशेष नर्सिंग निगरानी।',
      'en-IN': 'Central high-flow piped oxygen, dedicated flowmeters, pulse oximetry, and 24/7 nursing.'
    },
    features: ['Central Piped O2', 'HFNC Support', 'Pulse Oximetry', 'Emergency Call Bell'],
    color: 'from-blue-500 to-cyan-600',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹2,200 Pvt',
    totalAvailable: 86
  },
  {
    id: 'trauma',
    name: {
      'or-IN': 'ଟ୍ରମା / ଜରୁରୀକାଳୀନ କାଜୁଆଲଟି ବେଡ୍',
      'hi-IN': 'आपातकालीन ट्रॉमा कैजुअल्टी बेड',
      'en-IN': 'Emergency Trauma & Casualty Resuscitation'
    },
    category: 'Emergency',
    image: '/beds/emergency_trauma.jpg',
    description: {
      'or-IN': 'ଦୁର୍ଘଟଣା, ହାର୍ଟ ଆଟାକ୍ ଓ ଆଶୁ ଚିକିତ୍ସା ପାଇଁ କ୍ରାସ୍ କାର୍ଟ ଏବଂ ଡିଫିବ୍ରିଲେଟର୍ ସୁବିଧା।',
      'hi-IN': 'दुर्घटना, आघात व तीव्र आपातकालीन उपचार हेतु क्रैश कार्ट व डिफाइब्रिलेटर युक्त।',
      'en-IN': 'Rapid hydraulic Trendelenburg tilt, immediate crash cart, defibrillator & resuscitation bay.'
    },
    features: ['Crash Cart Access', 'Defibrillator Ready', 'Hydraulic Gurney', 'Overhead Surgical Light'],
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹1,800 Pvt',
    totalAvailable: 34
  },
  {
    id: 'maternity',
    name: {
      'or-IN': 'ପ୍ରସବ ଓ ନବଜାତ ଶିଶୁ NICU ବେଡ୍',
      'hi-IN': 'प्रसूति एवं नवजात शिशु NICU बेड',
      'en-IN': 'Maternity & Neonatal NICU Bed'
    },
    category: 'Maternity & NICU',
    image: '/beds/maternity_nicu.jpg',
    description: {
      'or-IN': 'ମାଆ ଏବଂ ନବଜାତ ଶିଶୁଙ୍କ ପାଇଁ ପ୍ରସବ ବେଡ୍, ରେଡିଆଣ୍ଟ ୱାର୍ମର ଏବଂ ଇନକ୍ୟୁବେଟର୍।',
      'hi-IN': 'मातृ एवं नवजात शिशु सुरक्षा, प्रसव बेड, रेडिएंट वार्मर एवं इनक्यूबेटर युक्त।',
      'en-IN': 'Obstetric motorized delivery bed, attached neonatal radiant warmer, fetal heart Doppler.'
    },
    features: ['Electric Birthing Bed', 'Radiant Baby Warmer', 'Fetal Doppler', 'NICU Incubator Ready'],
    color: 'from-pink-500 to-rose-500',
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹2,000 Pvt',
    totalAvailable: 52
  },
  {
    id: 'general',
    name: {
      'or-IN': 'ଜେନେରାଲ୍ ୱାର୍ଡ ବେଡ୍ (General Inpatient)',
      'hi-IN': 'जनरल वार्ड बेड (General Inpatient)',
      'en-IN': 'General Inpatient Ward Bed'
    },
    category: 'General Ward',
    image: '/beds/general_ward.jpg',
    description: {
      'or-IN': 'ସୁରକ୍ଷା ରେଲିଂ, ସାଲାଇନ୍ ଷ୍ଟାଣ୍ଡ୍, ବେଡସାଇଡ୍ ଲକର୍ ଏବଂ ସାଧାରଣ ଚିକିତ୍ସା ସୁବିଧା।',
      'hi-IN': 'सुरक्षा रेलिंग, सलाइन स्टैंड, बेडसाइड लॉकर एवं नियमित उपचार सुविधा।',
      'en-IN': 'Ergonomic mattress, collapsible safety rails, IV infusion pole, and bedside cabinet.'
    },
    features: ['Collapsible Side Rails', 'IV Fluid Stand', 'Bedside Call System', 'Privacy Curtain'],
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹800 Pvt',
    totalAvailable: 168
  },
  {
    id: 'pediatric',
    name: {
      'or-IN': 'ଶିଶୁ ଚିକିତ୍ସା ବେଡ୍ (Pediatric Care)',
      'hi-IN': 'बाल चिकित्सा वार्ड बेड (Pediatric Care)',
      'en-IN': 'Pediatric Child Care Bed'
    },
    category: 'Pediatric',
    image: '/beds/pediatric_bed.jpg',
    description: {
      'or-IN': 'ପିଲାମାନଙ୍କ ସୁରକ୍ଷା ପାଇଁ ଉଚ୍ଚ ରେଲିଂ, ଶିଶୁ-ଅନୁକୂଳ ପରିବେଶ ଓ ସ୍ୱତନ୍ତ୍ର ନିରୀକ୍ଷଣ।',
      'hi-IN': 'बच्चों की सुरक्षा हेतु ऊंची रेलिंग, बाल-अनुकूल परिवेश और समर्पित चिकित्सा मॉनिटर।',
      'en-IN': 'High safety surround crib rails, child-friendly atmosphere, and specialized pediatric vitals monitor.'
    },
    features: ['Child Security Rails', 'Pediatric Monitor', 'Infant Drip Regulator', 'Parent Accommodating'],
    color: 'from-purple-500 to-indigo-600',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    baseRate: '₹0 (BSKY / PM-JAY Cashless) / ₹1,200 Pvt',
    totalAvailable: 42
  }
];

// Hospital Inventory Database (Odisha & Premier Regional Centers)
const HOSPITALS_DATABASE = [
  {
    id: 'hosp-1',
    name: {
      'or-IN': 'ଏମ୍ସ ଭୁବନେଶ୍ୱର (AIIMS Bhubaneswar)',
      'hi-IN': 'एम्स भुवनेश्वर (AIIMS Bhubaneswar)',
      'en-IN': 'AIIMS Bhubaneswar (Apex Trauma & Tertiary Care)'
    },
    district: 'Khordha',
    city: 'Bhubaneswar',
    address: 'Sijua, Patrapada, Bhubaneswar - 751019',
    helpline: '+91 674 247 6789 / 1800-419-108',
    type: 'Apex Government Super-Specialty',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.9',
    distance: '3.8 km',
    beds: {
      icu: { total: 40, available: 8 },
      oxygen: { total: 120, available: 26 },
      trauma: { total: 25, available: 6 },
      maternity: { total: 30, available: 11 },
      general: { total: 300, available: 45 },
      pediatric: { total: 35, available: 9 }
    }
  },
  {
    id: 'hosp-2',
    name: {
      'or-IN': 'ଏସ୍.ସି.ବି ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (SCB Medical College)',
      'hi-IN': 'एससीबी मेडिकल कॉलेज एवं अस्पताल, कटक',
      'en-IN': 'SCB Medical College & Hospital, Cuttack'
    },
    district: 'Cuttack',
    city: 'Cuttack',
    address: 'Mangalabag, Cuttack - 753007',
    helpline: '+91 671 241 4080 / 108',
    type: 'Government Medical College',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.8',
    distance: '24.5 km',
    beds: {
      icu: { total: 50, available: 12 },
      oxygen: { total: 180, available: 38 },
      trauma: { total: 30, available: 8 },
      maternity: { total: 60, available: 16 },
      general: { total: 450, available: 72 },
      pediatric: { total: 40, available: 14 }
    }
  },
  {
    id: 'hosp-3',
    name: {
      'or-IN': 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍ (Capital Hospital, PGI)',
      'hi-IN': 'कैपिटल अस्पताल (Capital Hospital, Bhubaneswar)',
      'en-IN': 'Capital Hospital & PGI, Bhubaneswar'
    },
    district: 'Khordha',
    city: 'Bhubaneswar',
    address: 'Unit-6, Ganga Nagar, Bhubaneswar - 751001',
    helpline: '+91 674 239 1983',
    type: 'State District Apex Hospital',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.6',
    distance: '6.2 km',
    beds: {
      icu: { total: 25, available: 5 },
      oxygen: { total: 80, available: 14 },
      trauma: { total: 20, available: 5 },
      maternity: { total: 45, available: 12 },
      general: { total: 220, available: 31 },
      pediatric: { total: 30, available: 7 }
    }
  },
  {
    id: 'hosp-4',
    name: {
      'or-IN': 'ଏମ୍.କେ.ସି.ଜି ମେଡିକାଲ୍ କଲେଜ୍ (MKCG Medical College)',
      'hi-IN': 'एमकेसीजी मेडिकल कॉलेज, बेरहामपुर',
      'en-IN': 'MKCG Medical College & Hospital, Berhampur'
    },
    district: 'Ganjam',
    city: 'Berhampur',
    address: 'Medical Campus, Berhampur, Ganjam - 760004',
    helpline: '+91 680 229 2746',
    type: 'Southern Odisha Apex Medical College',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.7',
    distance: '168 km',
    beds: {
      icu: { total: 30, available: 7 },
      oxygen: { total: 90, available: 20 },
      trauma: { total: 18, available: 4 },
      maternity: { total: 40, available: 9 },
      general: { total: 280, available: 44 },
      pediatric: { total: 25, available: 6 }
    }
  },
  {
    id: 'hosp-5',
    name: {
      'or-IN': 'ଭିମ୍ସାର୍ ବୁର୍ଲା (VIMSAR Burla)',
      'hi-IN': 'विमसार बुर्ला, संबलपुर (VIMSAR Burla)',
      'en-IN': 'VIMSAR Hospital, Burla, Sambalpur'
    },
    district: 'Sambalpur',
    city: 'Sambalpur',
    address: 'Burla, Sambalpur - 768017',
    helpline: '+91 663 243 0768',
    type: 'Western Odisha Apex Medical College',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.7',
    distance: '270 km',
    beds: {
      icu: { total: 32, available: 9 },
      oxygen: { total: 85, available: 19 },
      trauma: { total: 20, available: 7 },
      maternity: { total: 35, available: 8 },
      general: { total: 260, available: 38 },
      pediatric: { total: 25, available: 5 }
    }
  },
  {
    id: 'hosp-6',
    name: {
      'or-IN': 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ (DHH Puri)',
      'hi-IN': 'जिला मुख्य चिकित्सालय (DHH Puri)',
      'en-IN': 'District Headquarters Hospital (DHH), Puri'
    },
    district: 'Puri',
    city: 'Puri',
    address: 'Grand Road, Puri - 752001',
    helpline: '+91 675 222 2104',
    type: 'District Headquarters Hospital',
    bskyAccepted: true,
    pmjayAccepted: true,
    rating: '4.5',
    distance: '58 km',
    beds: {
      icu: { total: 16, available: 4 },
      oxygen: { total: 55, available: 12 },
      trauma: { total: 15, available: 4 },
      maternity: { total: 30, available: 7 },
      general: { total: 160, available: 22 },
      pediatric: { total: 20, available: 4 }
    }
  }
];

// Hospital Campus Plot & Room Allotment Database
const HOSPITAL_CAMPUS_PLOTS = {
  'hosp-1': {
    plotNumber: 'Plot No. 1, Patrapada Health City, Sector-A',
    campus: 'Apex AIIMS Campus',
    blocks: {
      icu: { block: 'Block-A (Trauma & Critical Care Tower)', floor: '2nd Floor', room: 'Room 204 (ICU Isolation Suite)' },
      oxygen: { block: 'Block-B (Super-Specialty HDU Wing)', floor: '3rd Floor', room: 'Room 312 (High Flow O2 Ward)' },
      trauma: { block: 'Block-A (Apex Resuscitation Complex)', floor: 'Ground Floor', room: 'Room G-04 (Emergency Bay 1)' },
      maternity: { block: 'Block-C (Mother & Child Center - MCH)', floor: '1st Floor', room: 'Room 108 (Obstetric Suite)' },
      pediatric: { block: 'Block-C (Pediatric Care Wing)', floor: '2nd Floor', room: 'Room 216 (Pediatric HDU)' },
      general: { block: 'Block-D (Inpatient Ward Block)', floor: '4th Floor', room: 'Room 405 (Inpatient Ward Section)' }
    }
  },
  'hosp-2': {
    plotNumber: 'Plot No. 14, Mangalabag Apex Enclave (North Campus)',
    campus: 'SCB Medical Campus',
    blocks: {
      icu: { block: 'New Super Specialty Block (SSB-1)', floor: '3rd Floor', room: 'Room 302 (Cardiothoracic ICU)' },
      oxygen: { block: 'Medicine Complex (Wing-B)', floor: '2nd Floor', room: 'Room 210 (Oxygen HDU Unit)' },
      trauma: { block: 'Central Emergency Casualty Complex', floor: 'Ground Floor', room: 'Room G-02 (Red Triage Bay)' },
      maternity: { block: 'MCH Center of Excellence (Block-E)', floor: '1st Floor', room: 'Room 114 (Maternity Suite)' },
      pediatric: { block: 'Sardar Vallabhbhai Patel Sishu Bhawan', floor: '2nd Floor', room: 'Room 208 (Neonatal Care)' },
      general: { block: 'Main Medical Inpatient Wing (Block-M)', floor: '3rd Floor', room: 'Room 318 (Medicine Ward-D)' }
    }
  },
  'hosp-3': {
    plotNumber: 'Plot No. 6, Ganga Nagar Medical Enclave (Unit-6)',
    campus: 'Capital PGI Campus',
    blocks: {
      icu: { block: 'PGI Super Specialty Wing (Block-P)', floor: '2nd Floor', room: 'Room 201 (ICU Care)' },
      oxygen: { block: 'Respiratory & Pulmonology Ward (Block-2)', floor: '3rd Floor', room: 'Room 305 (HDU Bay)' },
      trauma: { block: '24x7 Casualty & Trauma Center', floor: 'Ground Floor', room: 'Room G-01 (Acute Resuscitation)' },
      maternity: { block: 'Janani Suraksha MCH Building', floor: '1st Floor', room: 'Room 106 (Labor & Delivery)' },
      pediatric: { block: 'Pediatric Care Center (Block-C)', floor: '2nd Floor', room: 'Room 212 (Child Care Bay)' },
      general: { block: 'Civil Inpatient Block (Wing-A)', floor: '2nd Floor', room: 'Room 220 (General Ward)' }
    }
  },
  'hosp-4': {
    plotNumber: 'Plot No. 22, Medical College Campus, Berhampur',
    campus: 'MKCG Southern Regional Campus',
    blocks: {
      icu: { block: 'Apex Multi-Specialty Block-1', floor: '2nd Floor', room: 'Room 206 (Ventilator ICU)' },
      oxygen: { block: 'High Dependency HDU Complex (East Wing)', floor: '3rd Floor', room: 'Room 309 (Oxygen Unit)' },
      trauma: { block: 'Central Casualty Emergency Wing', floor: 'Ground Floor', room: 'Room G-05 (Trauma Bay)' },
      maternity: { block: 'Janani Suraksha MCH Wing', floor: '1st Floor', room: 'Room 111 (Postnatal Suite)' },
      pediatric: { block: 'Pediatric ICU Complex (PICU)', floor: '2nd Floor', room: 'Room 215 (Pediatric Care)' },
      general: { block: 'Male & Female Inpatient Ward Block 5', floor: '3rd Floor', room: 'Room 325 (Inpatient Ward)' }
    }
  },
  'hosp-5': {
    plotNumber: 'Plot No. 9, Institutional Health Enclave, Burla',
    campus: 'VIMSAR Western Apex Campus',
    blocks: {
      icu: { block: 'Super Specialty Complex (Wing-A)', floor: '2nd Floor', room: 'Room 208 (Critical CCU)' },
      oxygen: { block: 'Pulmonology & HDU Building', floor: '3rd Floor', room: 'Room 315 (O2 Supported Ward)' },
      trauma: { block: 'Apex Trauma Care Center', floor: 'Ground Floor', room: 'Room G-03 (Resuscitation Bay)' },
      maternity: { block: 'Obstetrics & Gynaecology Hospital', floor: '1st Floor', room: 'Room 104 (Delivery Ward)' },
      pediatric: { block: 'Special Child Care Unit (SNCU)', floor: '2nd Floor', room: 'Room 218 (Pediatric Ward)' },
      general: { block: 'General Medicine Hospital Complex', floor: '4th Floor', room: 'Room 412 (Medical Ward)' }
    }
  },
  'hosp-6': {
    plotNumber: 'Plot No. 3, Grand Road Healthcare Sector, Puri',
    campus: 'DHH Puri District Campus',
    blocks: {
      icu: { block: 'District ICU & Critical Care Tower', floor: '2nd Floor', room: 'Room 203 (ICU Ward)' },
      oxygen: { block: 'Oxygen Supported HDU Wing', floor: '2nd Floor', room: 'Room 207 (HDU Ward)' },
      trauma: { block: 'Emergency Casualty & Trauma Block', floor: 'Ground Floor', room: 'Room G-01 (Casualty Bay)' },
      maternity: { block: 'Mother & Child Care Center (MCH)', floor: '1st Floor', room: 'Room 102 (Maternity Bay)' },
      pediatric: { block: 'SNCU Pediatric Ward', floor: '1st Floor', room: 'Room 109 (Child Care)' },
      general: { block: 'Main District Inpatient Block', floor: '3rd Floor', room: 'Room 304 (General Ward)' }
    }
  }
};

function getAllocationDetails(hospital, bedTypeId) {
  const hospId = hospital?.id;
  const config = HOSPITAL_CAMPUS_PLOTS[hospId];
  if (config && config.blocks && config.blocks[bedTypeId]) {
    const b = config.blocks[bedTypeId];
    return {
      plotNumber: config.plotNumber,
      campus: config.campus,
      blockWing: b.block,
      floor: b.floor,
      roomNumber: b.room,
      wayfinding: `Enter via Main Campus Gate ➔ Proceed to ${config.plotNumber.split(',')[0]} ➔ Head to ${b.block} ➔ Take Elevator/Ramp to ${b.floor} ➔ Report to Nursing Station opposite ${b.room}`
    };
  }

  // Fallback generator
  const plotNum = hospital?.address ? `Plot No. 12, ${hospital.address.split(',')[0]} Sector` : 'Plot No. 5, Healthcare Zone';
  const floorMap = {
    icu: '2nd Floor',
    oxygen: '3rd Floor',
    trauma: 'Ground Floor',
    maternity: '1st Floor',
    pediatric: '2nd Floor',
    general: '4th Floor'
  };
  const roomMap = {
    icu: 'Room 204 (ICU Isolation Suite)',
    oxygen: 'Room 312 (High Dependency HDU)',
    trauma: 'Room G-04 (Emergency Casualty Bay)',
    maternity: 'Room 108 (Obstetric Delivery Suite)',
    pediatric: 'Room 216 (Pediatric Care Wing)',
    general: 'Room 405 (Inpatient Ward Unit)'
  };
  const blockMap = {
    icu: 'Block-A (Critical Care Wing)',
    oxygen: 'Block-B (HDU Oxygen Wing)',
    trauma: 'Casualty Emergency Building',
    maternity: 'Mother & Child Care Center (MCH)',
    pediatric: 'Pediatric Care Block',
    general: 'General Inpatient Block'
  };

  const floor = floorMap[bedTypeId] || '2nd Floor';
  const room = roomMap[bedTypeId] || 'Room 201 (Ward Unit)';
  const block = blockMap[bedTypeId] || 'Main Hospital Wing';

  return {
    plotNumber: plotNum,
    campus: hospital?.name?.['en-IN'] || 'Hospital Campus',
    blockWing: block,
    floor: floor,
    roomNumber: room,
    wayfinding: `Enter via Main Gate ➔ Proceed to ${plotNum.split(',')[0]} ➔ Go to ${block} ➔ ${floor} ➔ Check-in at ${room}`
  };
}

export default function BedBookingSystem({ currentUser, appLang, onOpenNmcSuite, onRequireAuth }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  const [activeSubTab, setActiveSubTab] = useState('inventory'); // 'inventory' | 'my-reservations'
  const [selectedBedType, setSelectedBedType] = useState('ALL');
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [targetHospital, setTargetHospital] = useState(null);
  const [targetBedType, setTargetBedType] = useState(BED_TYPES[0]);

  // Form Fields
  const [patientName, setPatientName] = useState(currentUser?.name || '');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '');
  const [patientAbha, setPatientAbha] = useState(currentUser?.staffId || '');
  const [patientAge, setPatientAge] = useState(currentUser?.age || '');
  const [patientGender, setPatientGender] = useState(currentUser?.gender || 'Male');
  const [urgency, setUrgency] = useState('emergency'); // 'emergency' | 'scheduled'
  const [scheme, setScheme] = useState('bsky'); // 'bsky' | 'pmjay' | 'general'
  const [referralReason, setReferralReason] = useState('');
  const [attendantContact, setAttendantContact] = useState('');

  // Confirmation Slip Modal
  const [confirmedSlip, setConfirmedSlip] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = (key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(key);
    }
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  // Stored Reservations
  const [reservations, setReservations] = useState(() => getBedBookings());

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setPatientName(currentUser.name);
      if (currentUser.phone) setPatientPhone(currentUser.phone);
      if (currentUser.staffId) setPatientAbha(currentUser.staffId);
      if (currentUser.age) setPatientAge(currentUser.age);
      if (currentUser.gender) setPatientGender(currentUser.gender);
    }
  }, [currentUser]);

  // Translations
  const txt = {
    'or-IN': {
      headerTitle: 'ଡାକ୍ତରଖାନା ବେଡ୍ ଉପଲବ୍ଧତା ଓ ଡିଜିଟାଲ୍ ଆଡମିଶନ୍',
      headerSubtitle: 'ଓଡ଼ିଶାର ସମସ୍ତ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ସୁପର-ସ୍ପେସିଆଲିଟି ହସ୍ପିଟାଲ୍‌ରେ ଲାଇଭ୍ ବେଡ୍ ସ୍ଥିତି ଏବଂ BSKY / ଆୟୁଷ୍ମାନ ଭାରତ କ୍ୟାସଲେସ୍ ସୁବିଧା',
      tabInventory: '🛏️ ଲାଇଭ୍ ବେଡ୍ ଇନଭେଣ୍ଟୋରୀ ଓ ବୁକିଂ',
      tabReservations: '📋 ମୋର ବେଡ୍ ବୁକିଂ',
      filterAllBeds: 'ସମସ୍ତ ବେଡ୍ ପ୍ରକାର',
      filterAllDistricts: 'ସମସ୍ତ ଜିଲ୍ଲା',
      searchPlaceholder: 'ହସ୍ପିଟାଲ୍ କିମ୍ବା ସହର ଖୋଜନ୍ତୁ (AIIMS, SCB, Capital, Cuttack)...',
      liveAvailability: 'ଲାଇଭ୍ ଉପଲବ୍ଧତା',
      bedsFree: 'ବେଡ୍ ଖାଲି ଅଛି',
      bookBedBtn: 'ତୁରନ୍ତ ବେଡ୍ ବୁକ୍ କରନ୍ତୁ',
      viewHospitals: 'ଏହି ବେଡ୍ ଉପଲବ୍ଧ ଡାକ୍ତରଖାନା ଦେଖନ୍ତୁ',
      featuresTitle: 'ମୁଖ୍ୟ ମେଡିକାଲ୍ ଯନ୍ତ୍ରାଂଶ:',
      modalTitle: 'ଡିଜିଟାଲ୍ ହସ୍ପିଟାଲ୍ ବେଡ୍ ରିଜର୍ଭେସନ୍',
      modalSubtitle: 'ଜରୁରୀକାଳୀନ ଭର୍ତ୍ତି ଓ ତତକ୍ଷଣାତ୍ ପ୍ରବେଶ ଅନୁମତି',
      patientInfo: 'ରୋଗୀଙ୍କ ବିବରଣୀ',
      fullName: 'ସମ୍ପୂର୍ଣ୍ଣ ନାମ *',
      phone: 'ଫୋନ୍ ନମ୍ବର *',
      abha: 'ABHA ଆଇଡି / ସ୍ୱାସ୍ଥ୍ୟ କାର୍ଡ ନମ୍ବର',
      age: 'ବୟସ *',
      gender: 'ଲିଙ୍ଗ *',
      urgencyTitle: 'ଭର୍ତ୍ତି ଜରୁରୀତା (Admission Urgency) *',
      urgencyEmergency: 'ଜରୁରୀକାଳୀନ ଆଡମିଶନ୍ (< ୩୦ ମିନିଟ୍)',
      urgencyScheduled: 'ନିର୍ଦ୍ଧାରିତ ଆଡମିଶନ୍ (ଆଜି / ଆଗାମୀ କାଲି)',
      schemeTitle: 'ସ୍ୱାସ୍ଥ୍ୟ ବୀମା / ସରକାରୀ ଯୋଜନା *',
      schemeBsky: 'BSKY (ବିଜୁ ସ୍ୱାସ୍ଥ୍ୟ କଲ୍ୟାଣ ଯୋଜନା - ୧୦୦% ମାଗଣା)',
      schemePmjay: 'ଆୟୁଷ୍ମାନ ଭାରତ (PM-JAY କ୍ୟାସଲେସ୍)',
      schemeGeneral: 'ଜେନେରାଲ୍ / ସ୍ୱୟଂ ଦେୟ (Self-Paid)',
      diagnosis: 'ରୋଗର ଲକ୍ଷଣ / ଡାକ୍ତରୀ ପରାମର୍ଶ ଟିପ୍ପଣୀ *',
      diagnosisPlaceholder: 'ଉଦାହରଣ: ଶ୍ୱାସକ୍ରିୟାରେ କଷ୍ଟ, ଅକ୍ସିଜେନ୍ ସ୍ତର ୮୨%, କିମ୍ବା ଆଇସିୟୁ ଆବଶ୍ୟକ...',
      attendant: 'ସହାୟକଙ୍କ ମୋବାଇଲ୍ ନମ୍ବର (Attendant Phone)',
      confirmBookingBtn: 'ବେଡ୍ ରିଜର୍ଭେସନ୍ ନିଶ୍ଚିତ କରନ୍ତୁ',
      cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',
      slipTitle: 'ହସ୍ପିଟାଲ୍ ଆଡମିଶନ୍ ପାସ୍ (ADMISSION SLIP)',
      slipSubtitle: 'ଏହି ପାସ୍‌କୁ ହସ୍ପିଟାଲ୍ ଜରୁରୀକାଳୀନ କାଉଣ୍ଟରରେ ଦେଖାନ୍ତୁ',
      tokenNumber: 'ଟୋକନ୍ / ବୁକିଂ ଆଇଡି',
      allocatedBed: 'ନିର୍ଦ୍ଧାରିତ ବେଡ୍ ପ୍ରକାର',
      hospitalName: 'ଡାକ୍ତରଖାନା',
      wardNumber: 'ୱାର୍ଡ ଓ ବ୍ଲକ୍',
      cmoDesk: 'ଜରୁରୀକାଳୀନ CMO ଫୋନ୍',
      statusConfirmed: 'ନିଶ୍ଚିତ ହୋଇଛି (CONFIRMED)',
      printSlip: 'ପାସ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      closeBtn: 'ବନ୍ଦ କରନ୍ତୁ',
      noReservations: 'କୌଣସି ସକ୍ରିୟ ବେଡ୍ ବୁକିଂ ମିଳିଲା ନାହିଁ।',
      cancelBookingPrompt: 'ଆପଣ ଏହି ବେଡ୍ ବୁକିଂ ବାତିଲ କରିବାକୁ ଚାହାଁନ୍ତି କି?',
      bedGalleryTitle: 'ବେଡ୍ ପ୍ରକାର ଓ ଫଟୋ ଗ୍ୟାଲେରୀ (Bed Types & Imagery)',
      totalFreeOverall: 'ମୋଟ ଖାଲି ବେଡ୍:',
      icuBedsFree: 'ଆଇସିୟୁ ବେଡ୍ ଖାଲି:',
      guestLockMsg: 'ଅତିଥି ଭାବରେ ହସ୍ପିଟାଲ୍ ବେଡ୍ ରିଜର୍ଭେସନ୍ କରିବା ଅନୁମୋଦିତ ନୁହେଁ। ବେଡ୍ ନିଶ୍ଚିତ କରିବା ପାଇଁ ଦୟାକରି ଲଗ୍-ଇନ୍ କରନ୍ତୁ।',
      guestLoginBtn: '🔑 ଲଗ୍-ଇନ୍ / ରେଜିଷ୍ଟ୍ରେସନ୍ କରନ୍ତୁ',
      reservationKeyTitle: 'ଅଫିସିଆଲ୍ ରିଜର୍ଭେସନ୍ କି (Reservation Key)',
      plotNumber: 'ପ୍ଲଟ୍ ନମ୍ବର ଓ କ୍ୟାମ୍ପସ (Plot & Campus)',
      roomNumber: 'ନିର୍ଦ୍ଧାରିତ ରୁମ୍ ନମ୍ବର (Room No)',
      floorLevel: 'ମହଲା / ସ୍ତର (Floor)',
      blockWing: 'ବ୍ଲକ୍ ଓ ୱିଙ୍ଗ୍ (Block & Wing)',
      assignedBedNo: 'ନିର୍ଦ୍ଧାରିତ ବେଡ୍ ନମ୍ବର (Bed No)',
      wayfindingTitle: 'ହସ୍ପିଟାଲ୍ ମାର୍ଗଦର୍ଶନ (Route & Wayfinding)',
      locationHeader: 'ନିର୍ଦ୍ଧାରିତ ପ୍ଲଟ୍, ବ୍ଲକ୍ ଓ ରୁମ୍ ସ୍ଥାନ (Plot & Room Allocation)',
      copyKeyBtn: 'ରିଜର୍ଭେସନ୍ କି କପି କରନ୍ତୁ',
      copied: 'କପି ହୋଇଗଲା! ✓',
      viewPass: 'ପାସ୍ ଓ ରୁମ୍ ମାର୍ଗଦର୍ଶନ ଦେଖନ୍ତୁ'
    },
    'hi-IN': {
      headerTitle: 'अस्पताल बेड उपलब्धता एवं डिजिटल प्रवेश (Bed Booking)',
      headerSubtitle: 'ओडिशा के प्रमुख मेडिकल कॉलेज व अस्पतालों में लाइव बेड स्थिति एवं BSKY / आयुष्मान भारत कैशलेस सुविधा',
      tabInventory: '🛏️ लाइव बेड इन्वेंट्री एवं बुकिंग',
      tabReservations: '📋 मेरे बेड आरक्षण',
      filterAllBeds: 'सभी बेड प्रकार',
      filterAllDistricts: 'सभी जिले',
      searchPlaceholder: 'अस्पताल या शहर खोजें (AIIMS, SCB, Capital, Cuttack)...',
      liveAvailability: 'लाइव उपलब्धता',
      bedsFree: 'बेड खाली हैं',
      bookBedBtn: 'तुरंत बेड बुक करें',
      viewHospitals: 'इस बेड प्रकार के अस्पताल देखें',
      featuresTitle: 'प्रमुख चिकित्सा उपकरण:',
      modalTitle: 'डिजिटल अस्पताल बेड आरक्षण',
      modalSubtitle: 'आपातकालीन प्रवेश एवं तत्काल ई-पास',
      patientInfo: 'रोगी विवरण',
      fullName: 'पूरा नाम *',
      phone: 'फोन नंबर *',
      abha: 'ABHA आईडी / स्वास्थ्य कार्ड संख्या',
      age: 'आयु *',
      gender: 'लिंग *',
      urgencyTitle: 'प्रवेश तात्कालिकता (Admission Urgency) *',
      urgencyEmergency: 'आपातकालीन प्रवेश (< 30 मिनट)',
      urgencyScheduled: 'निर्धारित प्रवेश (आज / कल)',
      schemeTitle: 'स्वास्थ्य योजना / बीमा *',
      schemeBsky: 'BSKY (बीजू स्वास्थ्य कल्याण योजना - 100% नि:शुल्क)',
      schemePmjay: 'आयुष्मान भारत (PM-JAY कैशलेस)',
      schemeGeneral: 'सामान्य / स्व-भुगतान',
      diagnosis: 'लक्षण / डॉक्टर रेफरल नोट *',
      diagnosisPlaceholder: 'उदाहरण: सांस लेने में तकलीफ, ऑक्सीजन 84%, आईसीयू की आवश्यकता...',
      attendant: 'परिचारक का संपर्क नंबर (Attendant Phone)',
      confirmBookingBtn: 'बेड आरक्षण पक्का करें',
      cancelBtn: 'रद्द करें',
      slipTitle: 'अस्पताल प्रवेश पर्ची (ADMISSION SLIP)',
      slipSubtitle: 'अस्पताल के आपातकालीन काउंटर पर यह डिजिटल पर्ची दिखाएं',
      tokenNumber: 'टोकन / बुकिंग आईडी',
      allocatedBed: 'आवंटित बेड प्रकार',
      hospitalName: 'अस्पताल',
      wardNumber: 'वार्ड एवं ब्लॉक',
      cmoDesk: 'इमरजेंसी सीएमओ हेल्पलाइन',
      statusConfirmed: 'पुष्ट (CONFIRMED)',
      printSlip: 'पर्ची प्रिंट करें',
      closeBtn: 'बंद करें',
      noReservations: 'कोई सक्रिय बेड आरक्षण नहीं मिला।',
      cancelBookingPrompt: 'क्या आप इस बेड आरक्षण को रद्द करना चाहते हैं?',
      bedGalleryTitle: 'बेड प्रकार एवं फोटोग्राफ गैलरी (Bed Types & Real Imagery)',
      totalFreeOverall: 'कुल खाली बेड:',
      icuBedsFree: 'आईसीयू खाली बेड:',
      guestLockMsg: 'अतिथि खाते से अस्पताल बेड आरक्षित करना मान्य नहीं है। कृपया डिजिटल प्रवेश पास जारी करने हेतु लॉगिन करें।',
      guestLoginBtn: '🔑 लॉगिन / नया खाता बनाएं',
      reservationKeyTitle: 'आधिकारिक आरक्षण कुंजी (Official Reservation Key)',
      plotNumber: 'प्लॉट नंबर एवं परिसर (Plot & Campus)',
      roomNumber: 'आवंटित कमरा नंबर (Room No)',
      floorLevel: 'मंजिल (Floor)',
      blockWing: 'ब्लॉक एवं विंग (Block & Wing)',
      assignedBedNo: 'आवंटित बेड नंबर (Bed No)',
      wayfindingTitle: 'अस्पताल मार्गदर्शिका (कमरे तक कैसे पहुंचें)',
      locationHeader: 'आवंटित प्लॉट, ब्लॉक एवं कमरा विवरण (Plot & Room Allocation)',
      copyKeyBtn: 'आरक्षण कुंजी कॉपी करें',
      copied: 'कुंजी कॉपी हो गई! ✓',
      viewPass: 'प्रवेश पर्ची एवं कमरा विवरण देखें'
    },
    'en-IN': {
      headerTitle: 'Hospital Bed Availability & Digital Admission Pass',
      headerSubtitle: 'Live bed inventory across Odisha medical colleges & apex centers with BSKY & Ayushman Bharat (PM-JAY) cashless reservation',
      tabInventory: '🛏️ Live Bed Inventory & Booking',
      tabReservations: '📋 My Bed Reservations',
      filterAllBeds: 'All Bed Categories',
      filterAllDistricts: 'All Districts',
      searchPlaceholder: 'Search hospital by name, city or district (AIIMS, SCB, Cuttack)...',
      liveAvailability: 'Live Availability',
      bedsFree: 'Beds Free',
      bookBedBtn: 'Book Bed Now',
      viewHospitals: 'View Hospitals with this Bed',
      featuresTitle: 'Key Medical Equipment:',
      modalTitle: 'Hospital Bed Reservation',
      modalSubtitle: 'Direct priority admission token & digital gate pass',
      patientInfo: 'Patient Information',
      fullName: 'Full Patient Name *',
      phone: 'Primary Contact Phone *',
      abha: 'ABHA ID / State Health Card',
      age: 'Age *',
      gender: 'Gender *',
      urgencyTitle: 'Admission Urgency *',
      urgencyEmergency: 'Emergency Immediate (< 30 Mins)',
      urgencyScheduled: 'Scheduled Admission (Today / Tomorrow)',
      schemeTitle: 'Government Health Scheme / Insurance *',
      schemeBsky: 'BSKY (Biju Swasthya Kalyan Yojana - 100% Cashless)',
      schemePmjay: 'Ayushman Bharat (PM-JAY Cashless)',
      schemeGeneral: 'General / Private Admission',
      diagnosis: 'Clinical Symptoms & Admission Reason *',
      diagnosisPlaceholder: 'E.g., Acute respiratory distress, SpO2 82%, ICU ventilator requirement...',
      attendant: 'Attendant Phone Number',
      confirmBookingBtn: 'Confirm Bed Reservation',
      cancelBtn: 'Cancel',
      slipTitle: 'HOSPITAL ADMISSION PASS (EMERGENCY TOKEN)',
      slipSubtitle: 'Present this digital admission pass at the Emergency Triage / Casualty desk',
      tokenNumber: 'Admission Token ID',
      allocatedBed: 'Allocated Bed Category',
      hospitalName: 'Hospital Facility',
      wardNumber: 'Ward & Resuscitation Unit',
      cmoDesk: 'Emergency CMO Desk',
      statusConfirmed: 'CONFIRMED & RESERVED',
      printSlip: 'Print Admission Pass',
      closeBtn: 'Close',
      noReservations: 'No active bed reservations found.',
      cancelBookingPrompt: 'Are you sure you want to cancel this bed reservation?',
      bedGalleryTitle: 'Bed Categories & Visual Showcase (Real Medical Imagery)',
      totalFreeOverall: 'Total Available Beds:',
      icuBedsFree: 'Free ICU Beds:',
      guestLockMsg: 'Hospital bed reservation is restricted for Guest accounts. Please sign in or register to secure your digital admission pass.',
      guestLoginBtn: '🔑 Sign In / Register to Book Bed',
      reservationKeyTitle: 'Official Reservation Key (Digital Pass Key)',
      plotNumber: 'Plot Number & Campus Sector',
      roomNumber: 'Allotted Room Number',
      floorLevel: 'Floor Level',
      blockWing: 'Building Block & Wing',
      assignedBedNo: 'Assigned Bed No',
      wayfindingTitle: 'Hospital Wayfinding & Route Directions',
      locationHeader: 'Allotted Plot, Block & Room Allocation',
      copyKeyBtn: 'Copy Reservation Key',
      copied: 'Key Copied! ✓',
      viewPass: 'View Admission Pass & Route'
    }
  }[lang] || {};

  // Open booking modal
  const handleOpenBooking = (hospital, bedTypeObj) => {
    setTargetHospital(hospital);
    setTargetBedType(bedTypeObj);
    setBookingModalOpen(true);
  };

  // Submit booking
  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (currentUser?.isGuest) {
      if (onRequireAuth) {
        setBookingModalOpen(false);
        onRequireAuth();
      } else {
        alert(txt.guestLockMsg);
      }
      return;
    }
    if (!patientName.trim() || !patientPhone.trim() || !targetHospital || !targetBedType) {
      alert('Please fill in all mandatory fields.');
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const bookingId = `BED-OD-${dateCode}-${randomSuffix}`;
    const reservationKey = bookingId;

    const allocation = getAllocationDetails(targetHospital, targetBedType.id);
    const bedNumber = `${targetBedType.id.toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;

    const newBooking = {
      id: bookingId,
      reservationKey,
      timestamp: new Date().toISOString(),
      hospitalId: targetHospital.id,
      hospitalName: targetHospital.name[lang] || targetHospital.name['en-IN'],
      hospitalAddress: targetHospital.address,
      hospitalPhone: targetHospital.helpline,
      bedTypeId: targetBedType.id,
      bedTypeName: targetBedType.name[lang] || targetBedType.name['en-IN'],
      bedTypeImage: targetBedType.image,
      plotNumber: allocation.plotNumber,
      campus: allocation.campus,
      blockWing: allocation.blockWing,
      floor: allocation.floor,
      roomNumber: allocation.roomNumber,
      wardName: `${allocation.blockWing}, ${allocation.floor}`,
      bedNumber,
      wayfinding: allocation.wayfinding,
      patientName,
      patientPhone,
      patientAbha: patientAbha || 'N/A',
      patientAge,
      patientGender,
      urgency,
      scheme,
      referralReason: referralReason || 'Acute clinical admission',
      attendantContact: attendantContact || patientPhone,
      status: 'CONFIRMED'
    };

    saveBedBooking(newBooking);
    setReservations(getBedBookings());
    setBookingModalOpen(false);
    setConfirmedSlip(newBooking);
  };

  const handleCancelBooking = (bookingId) => {
    if (window.confirm(txt.cancelBookingPrompt || 'Cancel this bed reservation?')) {
      const updated = cancelBedBooking(bookingId);
      setReservations(updated);
      if (confirmedSlip && confirmedSlip.id === bookingId) {
        setConfirmedSlip(null);
      }
    }
  };

  // Filtered hospitals - memoized to avoid repeated reprocessing on every render
  const filteredHospitals = useMemo(() => {
    return HOSPITALS_DATABASE.filter((hosp) => {
      if (selectedDistrict !== 'ALL' && hosp.district !== selectedDistrict) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = Object.values(hosp.name).some((n) => n.toLowerCase().includes(q));
        const cityMatch = hosp.city.toLowerCase().includes(q);
        const distMatch = hosp.district.toLowerCase().includes(q);
        if (!nameMatch && !cityMatch && !distMatch) return false;
      }

      if (selectedBedType !== 'ALL') {
        const available = hosp.beds[selectedBedType]?.available || 0;
        if (available <= 0) return false;
      }

      return true;
    });
  }, [selectedDistrict, searchQuery, selectedBedType]);

  // Calculate totals efficiently and only when source data changes
  const totals = useMemo(() => {
    const totalAvailableBeds = HOSPITALS_DATABASE.reduce((sum, h) => {
      return sum + Object.values(h.beds).reduce((s, b) => s + b.available, 0);
    }, 0);

    const totalIcuBeds = HOSPITALS_DATABASE.reduce((sum, h) => sum + (h.beds.icu?.available || 0), 0);

    return { totalAvailableBeds, totalIcuBeds };
  }, []);

  const { totalAvailableBeds, totalIcuBeds } = totals;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-800 to-teal-950 rounded-2xl p-6 text-white shadow-md border border-teal-700/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-xs font-semibold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BSKY & PM-JAY Integrated 100% Cashless Admissions</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Bed className="w-7 h-7 text-emerald-300" />
              {txt.headerTitle}
            </h1>
            <p className="text-sm text-emerald-100/80 max-w-3xl leading-relaxed">
              {txt.headerSubtitle}
            </p>
          </div>

          {/* Live Quick Counters */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-xs border border-white/15 px-4 py-2.5 rounded-xl text-center">
              <div className="text-[11px] text-emerald-200 uppercase tracking-wider font-semibold">
                {txt.totalFreeOverall}
              </div>
              <div className="text-2xl font-black text-white">{totalAvailableBeds}</div>
            </div>
            <div className="bg-rose-500/20 border border-rose-400/30 px-4 py-2.5 rounded-xl text-center">
              <div className="text-[11px] text-rose-200 uppercase tracking-wider font-semibold">
                {txt.icuBedsFree}
              </div>
              <div className="text-2xl font-black text-rose-300">{totalIcuBeds}</div>
            </div>
          </div>
        </div>

        {/* Sub Navigation Bar */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-teal-700/60">
          <button
            onClick={() => setActiveSubTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'inventory'
                ? 'bg-emerald-400 text-teal-950 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Bed className="w-4 h-4" />
            {txt.tabInventory}
          </button>

          <button
            onClick={() => setActiveSubTab('my-reservations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 relative ${
              activeSubTab === 'my-reservations'
                ? 'bg-emerald-400 text-teal-950 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            {txt.tabReservations}
            {reservations.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
                {reservations.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* VIEW 1: INVENTORY & BED TYPES */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-8">
          {/* BED TYPES VISUAL GALLERY WITH REAL IMAGES */}
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-teal-600" />
                  {txt.bedGalleryTitle}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select any bed type to inspect real hospital room equipment and filter availability
                </p>
              </div>
              {selectedBedType !== 'ALL' && (
                <button
                  onClick={() => setSelectedBedType('ALL')}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-800 underline"
                >
                  Clear Bed Filter
                </button>
              )}
            </div>

            {/* Grid of Bed Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {BED_TYPES.map((bed) => {
                const isSelected = selectedBedType === bed.id;
                return (
                  <div
                    key={bed.id}
                    onClick={() => setSelectedBedType(isSelected ? 'ALL' : bed.id)}
                    className={`group relative flex flex-col rounded-xl overflow-hidden border transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-teal-500 border-teal-500 shadow-lg scale-[1.01]'
                        : 'border-slate-200 hover:border-teal-400 hover:shadow-md bg-white'
                    }`}
                  >
                    {/* Bed Image with Category Badge */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={bed.image}
                        alt={bed.name['en-IN']}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                      <div className="absolute top-3 left-3">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs border ${bed.badgeColor}`}>
                          {bed.category}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="bg-emerald-600/90 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                          {bed.totalAvailable} {txt.bedsFree}
                        </span>
                      </div>

                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <h3 className="font-bold text-sm leading-snug drop-shadow-md">
                          {bed.name[lang] || bed.name['en-IN']}
                        </h3>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {bed.description[lang] || bed.description['en-IN']}
                      </p>

                      {/* Equipment Tags */}
                      <div>
                        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                          {txt.featuresTitle}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {bed.features.map((feat, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Tariff & Selection Action */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <div className="text-[11px] font-bold text-emerald-700">
                          {bed.baseRate}
                        </div>
                        <button
                          type="button"
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                            isSelected
                              ? 'bg-teal-700 text-white'
                              : 'bg-teal-50 text-teal-700 hover:bg-teal-100'
                          }`}
                        >
                          {isSelected ? 'Filtered' : 'Filter by Bed'}
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SEARCH & DISTRICT FILTERS */}
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={txt.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Bed Category Selector */}
            <select
              value={selectedBedType}
              onChange={(e) => setSelectedBedType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">{txt.filterAllBeds}</option>
              {BED_TYPES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name['en-IN']} ({b.totalAvailable} free)
                </option>
              ))}
            </select>

            {/* District Selector */}
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full md:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">{txt.filterAllDistricts}</option>
              <option value="Khordha">Khordha (Bhubaneswar)</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Ganjam">Ganjam (Berhampur)</option>
              <option value="Sambalpur">Sambalpur (Burla)</option>
              <option value="Puri">Puri</option>
            </select>
          </div>

          {/* HOSPITAL AVAILABILITY CARDS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">
                Participating Hospitals ({filteredHospitals.length})
              </h3>
              <span className="text-xs text-slate-500">
                Updated in real-time with Odisha State Health Portal
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredHospitals.map((hospital) => {
                const totalHospFree = Object.values(hospital.beds).reduce((s, b) => s + b.available, 0);
                const isTargetBedAvailable = selectedBedType === 'ALL' 
                  ? true 
                  : (hospital.beds[selectedBedType]?.available || 0) > 0;

                return (
                  <div
                    key={hospital.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    {/* Hospital Info Header */}
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wide bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md">
                              {hospital.type}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-rose-500" />
                              {hospital.distance}
                            </span>
                          </div>
                          <h4 className="text-base font-bold text-slate-900 mt-1">
                            {hospital.name[lang] || hospital.name['en-IN']}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">{hospital.address}</p>
                        </div>

                        {/* Total Free Badge */}
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-1.5 rounded-xl text-center shrink-0">
                          <div className="text-base font-black leading-tight">{totalHospFree}</div>
                          <div className="text-[9px] uppercase font-bold tracking-wider">{txt.bedsFree}</div>
                        </div>
                      </div>

                      {/* Cashless Schemes */}
                      <div className="flex items-center gap-2 mt-3 text-[11px]">
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          BSKY Cashless
                        </span>
                        <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-medium border border-blue-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          PM-JAY Accepted
                        </span>
                      </div>
                    </div>

                    {/* Bed Category Status Pills */}
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">
                        {txt.liveAvailability}:
                      </div>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                        {BED_TYPES.map((b) => {
                          const bedInfo = hospital.beds[b.id] || { total: 0, available: 0 };
                          const isHighlighted = selectedBedType === b.id;
                          return (
                            <button
                              key={b.id}
                              onClick={() => handleOpenBooking(hospital, b)}
                              className={`p-1.5 rounded-lg border text-left transition-all ${
                                isHighlighted
                                  ? 'bg-teal-600 text-white border-teal-700 shadow-xs'
                                  : bedInfo.available > 0
                                  ? 'bg-white border-slate-200 hover:border-teal-400 text-slate-800'
                                  : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                              }`}
                            >
                              <div className="text-[10px] font-bold truncate">
                                {b.category.split(' ')[0]}
                              </div>
                              <div className="text-xs font-black">
                                {bedInfo.available} <span className="text-[9px] font-normal">/ {bedInfo.total}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer Contact & Booking Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="font-semibold">{hospital.helpline}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const preferred = selectedBedType !== 'ALL'
                            ? BED_TYPES.find((b) => b.id === selectedBedType)
                            : BED_TYPES[0];
                          handleOpenBooking(hospital, preferred);
                        }}
                        disabled={!isTargetBedAvailable}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                          isTargetBedAvailable
                            ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Bed className="w-4 h-4" />
                        {txt.bookBedBtn}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: MY BED RESERVATIONS */}
      {activeSubTab === 'my-reservations' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                {txt.tabReservations}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage confirmed hospital bed bookings and re-print digital admission passes
              </p>
            </div>
            <button
              onClick={() => setActiveSubTab('inventory')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-800 flex items-center gap-1"
            >
              + Book Another Bed
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <Bed className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-sm font-medium">{txt.noReservations}</p>
              <button
                onClick={() => setActiveSubTab('inventory')}
                className="px-4 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold hover:bg-teal-700"
              >
                Browse Available Beds
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="rounded-2xl border border-slate-200 p-5 bg-white transition-all space-y-4 shadow-sm hover:shadow-md"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center font-bold shadow-xs">
                        <Bed className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-900">{res.hospitalName}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-mono text-xs font-bold">
                            <Key className="w-3 h-3 text-amber-700" />
                            {res.reservationKey || res.id}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyKey(res.reservationKey || res.id)}
                            className="text-[11px] text-teal-700 hover:text-teal-900 font-semibold flex items-center gap-1 cursor-pointer bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                            title="Copy Reservation Key"
                          >
                            <Copy className="w-3 h-3" />
                            <span>{copiedKey ? txt.copied : txt.copyKeyBtn}</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {txt.statusConfirmed}
                      </span>
                    </div>
                  </div>

                  {/* Which Plot & Which Room Highlight Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 bg-gradient-to-br from-slate-50 to-teal-50/40 p-3.5 rounded-xl border border-teal-100 text-xs">
                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500" />
                        {txt.plotNumber}
                      </span>
                      <div className="font-extrabold text-slate-900 leading-snug">
                        {res.plotNumber || 'Main Hospital Enclave'}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-teal-600 flex items-center gap-1">
                        <DoorOpen className="w-3 h-3 text-teal-600" />
                        {txt.roomNumber}
                      </span>
                      <div className="font-black text-teal-900 bg-white/90 px-2 py-0.5 rounded border border-teal-200 inline-block">
                        {res.roomNumber || 'Room 204'}
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold">
                        Floor: {res.floor || '2nd Floor'}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-indigo-500" />
                        {txt.blockWing}
                      </span>
                      <div className="font-bold text-slate-800">
                        {res.blockWing || res.wardName}
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                        <Bed className="w-3 h-3 text-emerald-600" />
                        {txt.assignedBedNo}
                      </span>
                      <div className="font-black text-emerald-900 bg-white/90 px-2 py-0.5 rounded border border-emerald-200 inline-block font-mono">
                        {res.bedNumber}
                      </div>
                      <div className="text-[10px] text-teal-700 font-semibold truncate">
                        {res.bedTypeName}
                      </div>
                    </div>
                  </div>

                  {/* Patient Info & Contact */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        {txt.patientInfo}
                      </span>
                      <span className="font-bold text-slate-900">
                        {res.patientName} ({res.patientAge}y, {res.patientGender})
                      </span>
                      <div className="text-[11px] text-slate-500">Phone: {res.patientPhone}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        ABHA & Health Scheme
                      </span>
                      <span className="font-semibold text-slate-800">ABHA: {res.patientAbha}</span>
                      <div className="text-[11px] text-emerald-700 font-bold uppercase">{res.scheme}</div>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                        Hospital Desk & Helpline
                      </span>
                      <span className="font-bold text-rose-600">{res.hospitalPhone}</span>
                      <div className="text-[11px] text-slate-500">
                        Admitted: {res.timestamp ? new Date(res.timestamp).toLocaleDateString() : 'Active'}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleCancelBooking(res.id)}
                      className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {txt.cancelBtn}
                    </button>

                    <button
                      onClick={() => setConfirmedSlip(res)}
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                    >
                      <Printer className="w-4 h-4" />
                      <span>{txt.viewPass}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {bookingModalOpen && targetHospital && targetBedType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-800 to-emerald-900 p-5 text-white flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded border border-emerald-400/30">
                  Direct Hospital Reservation
                </span>
                <h3 className="text-lg font-bold text-white mt-1">{txt.modalTitle}</h3>
                <p className="text-xs text-emerald-100/80">{targetHospital.name[lang] || targetHospital.name['en-IN']}</p>
              </div>
              <button
                onClick={() => setBookingModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Bed Preview Strip */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-3">
              <img
                src={targetBedType.image}
                alt={targetBedType.name['en-IN']}
                loading="lazy"
                className="w-16 h-12 object-cover rounded-lg border border-slate-300"
              />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  {targetBedType.name[lang] || targetBedType.name['en-IN']}
                </div>
                <div className="text-[11px] text-teal-700 font-semibold">
                  Tariff: {targetBedType.baseRate}
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleConfirmBooking} className="p-6 space-y-4 text-xs">
              <div className="font-bold text-slate-800 border-b border-slate-100 pb-2">
                {txt.patientInfo}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{txt.fullName}</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{txt.phone}</label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">{txt.abha}</label>
                  <input
                    type="text"
                    value={patientAbha}
                    onChange={(e) => setPatientAbha(e.target.value)}
                    placeholder="e.g. 14-digit ABHA or BSKY Card No"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{txt.age}</label>
                    <input
                      type="number"
                      required
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-semibold mb-1">{txt.gender}</label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Urgency Selection */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">{txt.urgencyTitle}</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    urgency === 'emergency' ? 'bg-rose-50 border-rose-300 text-rose-900 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="urgency"
                      value="emergency"
                      checked={urgency === 'emergency'}
                      onChange={() => setUrgency('emergency')}
                      className="text-rose-600"
                    />
                    <span>🚨 {txt.urgencyEmergency}</span>
                  </label>

                  <label className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer ${
                    urgency === 'scheduled' ? 'bg-teal-50 border-teal-300 text-teal-900 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="urgency"
                      value="scheduled"
                      checked={urgency === 'scheduled'}
                      onChange={() => setUrgency('scheduled')}
                      className="text-teal-600"
                    />
                    <span>📅 {txt.urgencyScheduled}</span>
                  </label>
                </div>
              </div>

              {/* Government Scheme Selection */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1.5">{txt.schemeTitle}</label>
                <select
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="bsky">{txt.schemeBsky}</option>
                  <option value="pmjay">{txt.schemePmjay}</option>
                  <option value="general">{txt.schemeGeneral}</option>
                </select>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="block text-slate-600 font-semibold mb-1">{txt.diagnosis}</label>
                <textarea
                  required
                  rows={2}
                  value={referralReason}
                  onChange={(e) => setReferralReason(e.target.value)}
                  placeholder={txt.diagnosisPlaceholder}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">{txt.attendant}</label>
                <input
                  type="tel"
                  value={attendantContact}
                  onChange={(e) => setAttendantContact(e.target.value)}
                  placeholder="Primary phone of accompanying family member"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Live Allotment Preview */}
              {(() => {
                const preview = getAllocationDetails(targetHospital, targetBedType.id);
                return (
                  <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-3.5 border border-teal-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-teal-900">
                        <Building2 className="w-4 h-4 text-teal-600" />
                        <span>{txt.locationHeader}</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Direct Reservation
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/90 p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-500" />
                          {txt.plotNumber}
                        </span>
                        <span className="font-extrabold text-slate-900 block mt-0.5 text-[11px] leading-tight">
                          {preview.plotNumber}
                        </span>
                      </div>
                      <div className="bg-white/90 p-2.5 rounded-lg border border-teal-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                          <DoorOpen className="w-3 h-3 text-teal-600" />
                          {txt.roomNumber} &amp; {txt.floorLevel}
                        </span>
                        <span className="font-black text-teal-900 block mt-0.5 text-[11px] leading-tight">
                          {preview.roomNumber} ({preview.floor})
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-teal-800 font-medium bg-teal-100/60 p-2 rounded flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                      <span className="truncate">{preview.wayfinding}</span>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                {currentUser?.isGuest && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-[11px] font-semibold leading-relaxed">
                        {txt.guestLockMsg}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setBookingModalOpen(false);
                          if (onRequireAuth) onRequireAuth();
                        }}
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer transition active:scale-95"
                      >
                        {txt.guestLoginBtn}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold cursor-pointer"
                  >
                    {txt.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 text-white font-bold rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer ${
                      currentUser?.isGuest
                        ? 'bg-amber-600 hover:bg-amber-700'
                        : 'bg-teal-600 hover:bg-teal-700'
                    }`}
                  >
                    {currentUser?.isGuest ? (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>{txt.guestLoginBtn}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{txt.confirmBookingBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMED ADMISSION PASS SLIP MODAL */}
      {confirmedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-teal-900 text-white p-5 text-center relative">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-2 shadow-inner">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-base font-black tracking-wide">{txt.slipTitle}</h3>
              <p className="text-xs text-emerald-100 mt-0.5">{txt.slipSubtitle}</p>
              <button
                type="button"
                onClick={() => setConfirmedSlip(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Slip Body */}
            <div className="p-6 space-y-4 text-xs bg-slate-50/70">
              {/* Prominent RESERVATION KEY Container */}
              <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl p-4 border-2 border-emerald-500 shadow-sm text-center relative">
                <div className="inline-flex items-center gap-1.5 text-[11px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2 border border-emerald-300">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>{txt.reservationKeyTitle || 'OFFICIAL RESERVATION KEY'}</span>
                </div>
                
                <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-widest my-1 drop-shadow-xs selection:bg-amber-200">
                  {confirmedSlip.reservationKey || confirmedSlip.id}
                </div>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(confirmedSlip.reservationKey || confirmedSlip.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-50 text-teal-800 font-bold rounded-lg border border-teal-300 shadow-2xs cursor-pointer transition active:scale-95"
                  >
                    {copiedKey ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">{txt.copied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-teal-600" />
                        <span>{txt.copyKeyBtn}</span>
                      </>
                    )}
                  </button>
                  <span className="inline-block bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                    {txt.statusConfirmed}
                  </span>
                </div>
              </div>

              {/* WHICH PLOT & WHICH ROOM (Prominent 4-tile Allotment Section) */}
              <div className="bg-white rounded-2xl p-4 border border-teal-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-black text-slate-900 text-xs">
                    <Building2 className="w-4 h-4 text-teal-600" />
                    <span>{txt.locationHeader || 'Allocated Plot & Room Location'}</span>
                  </div>
                  <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    Hospital Allotment
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PLOT */}
                  <div className="bg-gradient-to-br from-slate-50 to-rose-50/30 p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {txt.plotNumber || 'Plot & Campus Location'}
                    </span>
                    <div className="font-extrabold text-slate-900 text-sm leading-snug">
                      {confirmedSlip.plotNumber || 'Main Hospital Enclave'}
                    </div>
                    <div className="text-[11px] text-slate-500 font-semibold truncate">
                      {confirmedSlip.hospitalName}
                    </div>
                  </div>

                  {/* ROOM */}
                  <div className="bg-gradient-to-br from-teal-50 to-emerald-50/50 p-3 rounded-xl border border-teal-200 space-y-1">
                    <span className="text-teal-700 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                      {txt.roomNumber || 'Allotted Room Number'}
                    </span>
                    <div className="font-black text-teal-950 text-base leading-snug">
                      {confirmedSlip.roomNumber || 'Room 204'}
                    </div>
                    <div className="text-[11px] text-teal-700 font-bold">
                      {txt.floorLevel}: {confirmedSlip.floor || '2nd Floor'}
                    </div>
                  </div>

                  {/* BLOCK / WARD */}
                  <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                      {txt.blockWing || 'Block & Wing'}
                    </span>
                    <div className="font-bold text-slate-800 text-xs">
                      {confirmedSlip.blockWing || confirmedSlip.wardName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Ward: {confirmedSlip.wardName}
                    </div>
                  </div>

                  {/* BED */}
                  <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 p-3 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-emerald-600" />
                      {txt.assignedBedNo || 'Assigned Bed No'}
                    </span>
                    <div className="font-black text-emerald-900 text-sm font-mono">
                      {confirmedSlip.bedNumber}
                    </div>
                    <div className="text-[10px] text-slate-600 font-semibold truncate">
                      {confirmedSlip.bedTypeName}
                    </div>
                  </div>
                </div>

                {/* WAYFINDING NAVIGATION */}
                {confirmedSlip.wayfinding && (
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-teal-600" />
                      <span>{txt.wayfindingTitle || 'Route Directions to Your Room'}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium leading-relaxed">
                      {confirmedSlip.wayfinding}
                    </p>
                  </div>
                )}
              </div>

              {/* Patient Info */}
              <div className="bg-white rounded-xl p-4 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">
                    {confirmedSlip.patientName} ({confirmedSlip.patientAge}y, {confirmedSlip.patientGender})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Contact:</span>
                  <span className="font-medium text-slate-800">{confirmedSlip.patientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">ABHA / Health ID:</span>
                  <span className="font-medium text-slate-800">{confirmedSlip.patientAbha}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheme:</span>
                  <span className="font-bold text-emerald-700 uppercase">{confirmedSlip.scheme}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">{txt.cmoDesk}:</span>
                  <span className="font-bold text-rose-600">{confirmedSlip.hospitalPhone}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>{txt.printSlip}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmedSlip(null)}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl cursor-pointer transition"
                >
                  {txt.closeBtn}
                </button>
              </div>

              {onOpenNmcSuite && (
                <button
                  type="button"
                  onClick={() => {
                    setConfirmedSlip(null);
                    onOpenNmcSuite();
                  }}
                  className="w-full mt-2 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs text-xs cursor-pointer transition-all"
                >
                  <FileText className="w-4 h-4 text-emerald-200" />
                  <span>Generate NMC Referral Slip &amp; Clinical Rx (Verifiable QR)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
