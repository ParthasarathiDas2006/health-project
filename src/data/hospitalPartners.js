/**
 * Apex Hospital Network - Master Locations & Empaneled Partner Hospitals Directory
 * Covers major healthcare hub cities across Odisha and Pan-India National Apex Centers.
 * 100% pure localization support for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 */

export const HOSPITAL_CITIES = [
  // Odisha Cities
  { id: 'Bhubaneswar', region: 'Odisha', name: { 'or-IN': 'ଭୁବନେଶ୍ୱର (Bhubaneswar)', 'hi-IN': 'भुवनेश्वर (Bhubaneswar)', 'en-IN': 'Bhubaneswar' } },
  { id: 'Cuttack', region: 'Odisha', name: { 'or-IN': 'କଟକ (Cuttack)', 'hi-IN': 'कटक (Cuttack)', 'en-IN': 'Cuttack' } },
  { id: 'Berhampur', region: 'Odisha', name: { 'or-IN': 'ବ୍ରହ୍ମପୁର (Berhampur)', 'hi-IN': 'ब्रह्मपुर (Berhampur)', 'en-IN': 'Berhampur' } },
  { id: 'Rourkela', region: 'Odisha', name: { 'or-IN': 'ରାଉରକେଲା (Rourkela)', 'hi-IN': 'राउरकेला (Rourkela)', 'en-IN': 'Rourkela' } },
  { id: 'Sambalpur', region: 'Odisha', name: { 'or-IN': 'ସମ୍ବଲପୁର / ବୁର୍ଲା (Sambalpur)', 'hi-IN': 'सम्बलपुर / बुर्ला (Sambalpur)', 'en-IN': 'Sambalpur / Burla' } },
  { id: 'Balasore', region: 'Odisha', name: { 'or-IN': 'ବାଲେଶ୍ୱର (Balasore)', 'hi-IN': 'बालेश्वर (Balasore)', 'en-IN': 'Balasore' } },
  { id: 'Koraput', region: 'Odisha', name: { 'or-IN': 'କୋରାପୁଟ (Koraput)', 'hi-IN': 'कोरापुट (Koraput)', 'en-IN': 'Koraput' } },
  { id: 'Puri', region: 'Odisha', name: { 'or-IN': 'ପୁରୀ (Puri)', 'hi-IN': 'पुरी (Puri)', 'en-IN': 'Puri' } },
  { id: 'Baripada', region: 'Odisha', name: { 'or-IN': 'ବାରିପଦା / ମୟୂରଭଞ୍ଜ (Baripada)', 'hi-IN': 'बारीपदा / मयूरभंज (Baripada)', 'en-IN': 'Baripada / Mayurbhanj' } },
  { id: 'Bolangir', region: 'Odisha', name: { 'or-IN': 'ବଲାଙ୍ଗୀର (Bolangir)', 'hi-IN': 'बलांगीर (Bolangir)', 'en-IN': 'Bolangir' } },
  { id: 'Keonjhar', region: 'Odisha', name: { 'or-IN': 'କେନ୍ଦୁଝର (Keonjhar)', 'hi-IN': 'क्योंझर (Keonjhar)', 'en-IN': 'Keonjhar' } },
  { id: 'Jharsuguda', region: 'Odisha', name: { 'or-IN': 'ଝାରସୁଗୁଡ଼ା (Jharsuguda)', 'hi-IN': 'झारसुगुड़ा (Jharsuguda)', 'en-IN': 'Jharsuguda' } },
  { id: 'Angul', region: 'Odisha', name: { 'or-IN': 'ଅନୁଗୋଳ / ତାଳଚେର (Angul)', 'hi-IN': 'अनुगुल / तालचेर (Angul)', 'en-IN': 'Angul / Talcher' } },
  { id: 'Bargarh', region: 'Odisha', name: { 'or-IN': 'ବରଗଡ଼ (Bargarh)', 'hi-IN': 'बरगढ़ (Bargarh)', 'en-IN': 'Bargarh' } },
  { id: 'Bhadrak', region: 'Odisha', name: { 'or-IN': 'ଭଦ୍ରକ (Bhadrak)', 'hi-IN': 'भद्रक (Bhadrak)', 'en-IN': 'Bhadrak' } },
  { id: 'Boudh', region: 'Odisha', name: { 'or-IN': 'ବୌଦ୍ଧ (Boudh)', 'hi-IN': 'बौद्ध (Boudh)', 'en-IN': 'Boudh' } },
  { id: 'Deogarh', region: 'Odisha', name: { 'or-IN': 'ଦେଓଗଡ଼ (Deogarh)', 'hi-IN': 'देवगढ़ (Deogarh)', 'en-IN': 'Deogarh' } },
  { id: 'Dhenkanal', region: 'Odisha', name: { 'or-IN': 'ଢେଙ୍କାନାଳ (Dhenkanal)', 'hi-IN': 'ढेंकानाल (Dhenkanal)', 'en-IN': 'Dhenkanal' } },
  { id: 'Gajapati', region: 'Odisha', name: { 'or-IN': 'ଗଜପତି / ପାରଳାଖେମୁଣ୍ଡି (Gajapati)', 'hi-IN': 'गजपति / परलाखेमुंडी (Gajapati)', 'en-IN': 'Gajapati / Paralakhemundi' } },
  { id: 'Jagatsinghpur', region: 'Odisha', name: { 'or-IN': 'ଜଗତସିଂହପୁର (Jagatsinghpur)', 'hi-IN': 'जगतसिंहपुर (Jagatsinghpur)', 'en-IN': 'Jagatsinghpur' } },
  { id: 'Jajpur', region: 'Odisha', name: { 'or-IN': 'ଯାଜପୁର (Jajpur)', 'hi-IN': 'जाजपुर (Jajpur)', 'en-IN': 'Jajpur' } },
  { id: 'Kalahandi', region: 'Odisha', name: { 'or-IN': 'କଳାହାଣ୍ଡି / ଭବାନୀପାଟଣା (Kalahandi)', 'hi-IN': 'कलाहांडी / भवानीपटना (Kalahandi)', 'en-IN': 'Kalahandi / Bhawanipatna' } },
  { id: 'Kandhamal', region: 'Odisha', name: { 'or-IN': 'କନ୍ଧମାଳ / ଫୁଲବାଣୀ (Kandhamal)', 'hi-IN': 'कंधमाल / फूलबाणी (Kandhamal)', 'en-IN': 'Kandhamal / Phulbani' } },
  { id: 'Kendrapara', region: 'Odisha', name: { 'or-IN': 'କେନ୍ଦ୍ରାପଡ଼ା (Kendrapara)', 'hi-IN': 'केंद्रापाड़ा (Kendrapara)', 'en-IN': 'Kendrapara' } },
  { id: 'Malkangiri', region: 'Odisha', name: { 'or-IN': 'ମାଲକାନଗିରି (Malkangiri)', 'hi-IN': 'मलकानगिरी (Malkangiri)', 'en-IN': 'Malkangiri' } },
  { id: 'Nabarangpur', region: 'Odisha', name: { 'or-IN': 'ନବରଙ୍ଗପୁର (Nabarangpur)', 'hi-IN': 'नबरंगपुर (Nabarangpur)', 'en-IN': 'Nabarangpur' } },
  { id: 'Nayagarh', region: 'Odisha', name: { 'or-IN': 'ନୟାଗଡ଼ (Nayagarh)', 'hi-IN': 'नयागढ़ (Nayagarh)', 'en-IN': 'Nayagarh' } },
  { id: 'Nuapada', region: 'Odisha', name: { 'or-IN': 'ନୂଆପଡ଼ା (Nuapada)', 'hi-IN': 'नुआपाड़ा (Nuapada)', 'en-IN': 'Nuapada' } },
  { id: 'Rayagada', region: 'Odisha', name: { 'or-IN': 'ରାୟଗଡ଼ା (Rayagada)', 'hi-IN': 'रायगड़ा (Rayagada)', 'en-IN': 'Rayagada' } },
  { id: 'Sonepur', region: 'Odisha', name: { 'or-IN': 'ସୋନପୁର / ସୁବର୍ଣ୍ଣପୁର (Sonepur)', 'hi-IN': 'सोनपुर / सुबर्णपुर (Sonepur)', 'en-IN': 'Sonepur / Subarnapur' } },

  // Pan-India National Apex Metros
  { id: 'New Delhi', region: 'National', name: { 'or-IN': 'ନୂଆଦିଲ୍ଲୀ (New Delhi)', 'hi-IN': 'नई दिल्ली (New Delhi)', 'en-IN': 'New Delhi (NCR)' } },
  { id: 'Mumbai', region: 'National', name: { 'or-IN': 'ମୁମ୍ବାଇ (Mumbai)', 'hi-IN': 'मुंबई (Mumbai)', 'en-IN': 'Mumbai' } },
  { id: 'Kolkata', region: 'National', name: { 'or-IN': 'କୋଲକାତା (Kolkata)', 'hi-IN': 'कोलकाता (Kolkata)', 'en-IN': 'Kolkata' } },
  { id: 'Hyderabad', region: 'National', name: { 'or-IN': 'ହାଇଦ୍ରାବାଦ (Hyderabad)', 'hi-IN': 'हैदराबाद (Hyderabad)', 'en-IN': 'Hyderabad' } },
  { id: 'Bengaluru', region: 'National', name: { 'or-IN': 'ବେଙ୍ଗାଲୁରୁ (Bengaluru)', 'hi-IN': 'बेंगलुरु (Bengaluru)', 'en-IN': 'Bengaluru' } },
  { id: 'Chennai', region: 'National', name: { 'or-IN': 'ଚେନ୍ନାଇ / ଭେଲୋର (Chennai/Vellore)', 'hi-IN': 'चेन्नई / वेल्लोर (Chennai/Vellore)', 'en-IN': 'Chennai / Vellore' } }
];

export const getHospitalPartners = (lang = 'en-IN') => {
  const isOr = lang === 'or-IN';
  const isHi = lang === 'hi-IN';

  return [
    // ================= 1. BHUBANESWAR =================
    {
      id: 'HOSP-01',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଏମ୍ସ ଭୁବନେଶ୍ୱର (AIIMS Bhubaneswar)' : (isHi ? 'एम्स भुवनेश्वर (AIIMS Bhubaneswar)' : 'AIIMS Bhubaneswar'),
      tier: isOr ? 'ଜାତୀୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସର୍ବୋଚ୍ଚ ସଂସ୍ଥା (Apex National Institute)' : (isHi ? 'राष्ट्रीय महत्व का शीर्ष संस्थान' : 'Apex Autonomous National Institute'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: isOr ? 'ସିଜୁଆ, ପାତ୍ରପଡ଼ା, ଭୁବନେଶ୍ୱର - ୭୫୧୦୧୯' : (isHi ? 'सिजुआ, पात्रापाड़ा, भुवनेश्वर - 751019' : 'Sijua, Patrapada, Bhubaneswar - 751019'),
      phone: '+91 674 2476789 / 1800-345-6789',
      totalBeds: 960,
      availableIcuBeds: 14,
      availableVentilators: 8,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଲେଭଲ୍-୧ ଟ୍ରମା ଓ ସିସିୟୁ' : (isHi ? 'लेवल-1 ट्रॉमा एवं CCU' : 'Level-1 Trauma & CCU'),
        isOr ? 'ଉନ୍ନତ କାର୍ଡିଆକ୍ ସାଇନ୍ସ (CTVS)' : (isHi ? 'एडवांस्ड कार्डियक साइंसेज' : 'Advanced Cardiac Sciences'),
        isOr ? 'ନ୍ୟୁରୋସର୍ଜରି ଓ ଷ୍ଟ୍ରୋକ୍ ୟୁନିଟ୍' : (isHi ? 'न्यूरोसर्जरी एवं स्ट्रोक यूनिट' : 'Neurosurgery & Stroke Unit'),
        isOr ? 'ଶିଶୁ ଜରୁରୀକାଳୀନ ବିଭାଗ (Pediatric ICU)' : (isHi ? 'पीडियाट्रिक इंटेंसिव केयर' : 'Pediatric Intensive Care')
      ],
      schemes: ['PMJAY', 'CGHS', 'BSKY'],
      schemeLabels: ['PM-JAY', 'CGHS', 'BSKY Empaneled'],
      protocols: isOr
        ? '୨୪x୭ ଟେଲି-ଏମର୍ଜେନ୍ସି ସ୍ଲିପ୍ ସ୍ଥାନାନ୍ତର, ଗ୍ରୀନ୍ କରିଡର୍ ଆମ୍ବୁଲାନ୍ସ ରିସେପ୍ସନ୍, ଫାଷ୍ଟ-ଟ୍ରାକ୍ ଆଇସିୟୁ ଏସ୍କାଲେସନ୍।'
        : (isHi
        ? '24x7 टेली-इमरजेंसी ट्रांसफर, ग्रीन कॉरिडोर एम्बुलेंस समन्वय, त्वरित आईसीयू प्रवेश।'
        : '24x7 Tele-Emergency triage transfer, Green Corridor ambulance direct reception, fast-track ICU escalation.'),
      counter: 'Gate 2, Emergency Trauma Bay, Desk 01',
      coordinator: 'Dr. P. K. Tripathy (Nodal Emergency Officer)',
      badgeColor: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'HOSP-02',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଆପୋଲୋ ହସ୍ପିଟାଲ୍ସ (Apollo Hospitals, Bhubaneswar)' : (isHi ? 'अपोलो हॉस्पिटल्स (Apollo Hospitals, Bhubaneswar)' : 'Apollo Hospitals Enterprise Network'),
      tier: isOr ? 'JCI ଓ NABH ସ୍ୱୀକୃତିପ୍ରାପ୍ତ କ୍ୱାଟରନାରୀ କେୟାର' : (isHi ? 'JCI एवं NABH मान्यता प्राप्त चतुर्थक केंद्र' : 'JCI & NABH Quaternary Care Hub'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: isOr ? 'ପ୍ଲଟ୍ ନଂ ୨୫୧, ସୈନିକ ସ୍କୁଲ୍ ରୋଡ୍, ଭୁବନେଶ୍ୱର - ୭୫୧୦୦୫' : (isHi ? 'प्लॉट नं 251, सैनिक स्कूल रोड, भुवनेश्वर - 751005' : 'Plot 251, Sainik School Road, Bhubaneswar - 751005'),
      phone: '+91 674 6661016 / 1066',
      totalBeds: 350,
      availableIcuBeds: 9,
      availableVentilators: 5,
      specialtyCategory: 'Cardio',
      departments: [
        isOr ? '୨୪x୭ STEMI ଓ ହାର୍ଟ ଆଟାକ୍ କେୟାର (Cath Lab)' : (isHi ? '24x7 STEMI एवं दिल का दौरा आपातकालीन केंद्र' : '24x7 STEMI & Heart Attack Care (Cath Lab)'),
        isOr ? 'ଷ୍ଟ୍ରୋକ୍ କୋଡ୍ ଏବଂ ନ୍ୟୁରୋ-ଆଇସିୟୁ' : (isHi ? 'स्ट्रोक कोड एवं न्यूरो-आईसीयू' : 'Stroke Code & Neuro-ICU'),
        isOr ? 'ଅର୍ଗାନ୍ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ ଆଇସିୟୁ' : (isHi ? 'अंग प्रत्यारोपण आईसीयू' : 'Organ Transplant Intensive Unit')
      ],
      schemes: ['BSKY', 'PMJAY', 'ECHS'],
      schemeLabels: ['BSKY Empaneled', 'PM-JAY', 'ECHS / Corporate'],
      protocols: isOr
        ? '୬୦ ମିନିଟ୍ ଡୋର୍-ଟୁ-ବେଲୁନ୍ STEMI ପ୍ରୋଟୋକଲ୍, ଟେଲି-ଷ୍ଟ୍ରୋକ୍ ରାପିଡ୍ ଥ୍ରୋମ୍ବୋଲିସିସ୍।'
        : (isHi
        ? '60 मिनट डोर-टू-बैलून STEMI प्रोटोकॉल, टेली-स्ट्रोक तीव्र थ्रोम्बोलिसिस कॉरिडोर।'
        : '60-Minute Door-to-Balloon STEMI Protocol, Tele-Stroke rapid thrombolysis pathway, BSKY Desk.'),
      counter: 'Emergency Entrance, Triage Desk 03',
      coordinator: 'Dr. Debasis Das (Chief Emergency Coordinator)',
      badgeColor: 'from-rose-600 to-red-700'
    },
    {
      id: 'HOSP-03',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'କିମ୍ସ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍ (KIMS, KIIT)' : (isHi ? 'किम्स सुपर-स्पेशियलिटी अस्पताल (KIMS Bhubaneswar)' : 'KIMS Super-Specialty Hospital (KIIT)'),
      tier: isOr ? '୨,୦୦୦ ବେଡ୍ ବିଶିଷ୍ଟ ସୁପର-ସ୍ପେଶିଆଲିଟି କ୍ୟାମ୍ପସ୍' : (isHi ? '2,000 बेड सुपर-स्पेशियलिटी स्वास्थ्य परिसर' : '2,000-Bed Super-Specialty Healthcare Complex'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: isOr ? 'କୁଶାଭଦ୍ରା କ୍ୟାମ୍ପସ୍, ପଟିଆ, ଭୁବନେଶ୍ୱର - ୭୫୧୦୨୪' : (isHi ? 'कुशाभद्रा कैंपस, पटिया, भुवनेश्वर - 751024' : 'Kushabhadra Campus, Patia, Bhubaneswar - 751024'),
      phone: '+91 674 7111000 / 0674-2725472',
      totalBeds: 2000,
      availableIcuBeds: 24,
      availableVentilators: 12,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଲେଭଲ୍-୩ ଶିଶୁ NICU ଏବଂ PICU' : (isHi ? 'लेवल-3 नवजात शिशु NICU एवं PICU' : 'Level-3 Neonatal NICU & PICU'),
        isOr ? 'ପୋଡ଼ାଘା ଓ ପ୍ଲାଷ୍ଟିକ୍ ସର୍ଜରି ୟୁନିଟ୍' : (isHi ? 'बर्न एवं प्लास्टिक सर्जरी गहन केंद्र' : 'Advanced Burn & Reconstructive Unit'),
        isOr ? 'କିଡନୀ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ ଓ ୟୁରୋଲୋଜି' : (isHi ? 'गुर्दा प्रत्यारोपण एवं यूरोलॉजी' : 'Renal Transplant & Urology')
      ],
      schemes: ['BSKY', 'PMJAY', 'ESIC'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'ESIC Empaneled'],
      protocols: isOr
        ? 'ଶିଶୁ ଓ ମାତୃ ରୋଗୀଙ୍କ ତୁରନ୍ତ ଏସ୍କାଲେସନ୍, ESIC ଏବଂ BSKY ସମନ୍ୱୟ ଡେସ୍କ।'
        : (isHi
        ? 'शिशु एवं उच्च जोखिम मातृत्व रेफरल, ईएसआईसी व BSKY त्वरित सहायता।'
        : 'Immediate referral pipeline for neonatal/maternal crises, dedicated ESIC/BSKY desk.'),
      counter: 'PBM Hospital Wing B, Emergency Reception Desk',
      coordinator: 'Dr. S. Mohapatra (Critical Care Nodal Head)',
      badgeColor: 'from-amber-600 to-orange-700'
    },
    {
      id: 'HOSP-04',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'କ୍ୟାପିଟାଲ୍ ହସ୍ପିଟାଲ୍ ଓ PGIMER (Capital Hospital)' : (isHi ? 'कैपिटल अस्पताल एवं पीजीआईएमईआर' : 'Capital Hospital & PGIMER, Bhubaneswar'),
      tier: isOr ? 'ମୁଖ୍ୟ ଜିଲ୍ଲା ଚିକିତ୍ସାଳୟ ଓ ସ୍ନାତକୋତ୍ତର ପ୍ରତିଷ୍ଠାନ' : (isHi ? 'प्रमुख जिला अस्पताल एवं स्नातकोत्तर संस्थान' : 'Apex District Post-Graduate Medical Institute'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: isOr ? 'ୟୁନିଟ୍ ୬, ଭୁବନେଶ୍ୱର, ଓଡ଼ିଶା - ୭୫୧୦୦୧' : (isHi ? 'यूनिट 6, भुवनेश्वर, ओडिशा - 751001' : 'Unit 6, Bhubaneswar, Odisha - 751001'),
      phone: '+91 674 2391983 / 102',
      totalBeds: 750,
      availableIcuBeds: 16,
      availableVentilators: 7,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ କାଜୁଆଲିଟି ଓ ଟ୍ରମା ବେ' : (isHi ? 'इमरजेंसी कैजुअल्टी एवं ट्रॉमा बे' : 'Emergency Casualty & Trauma Bay'),
        isOr ? 'ବ୍ଲଡ୍ କମ୍ପୋନେଣ୍ଟ୍ ସେପାରେସନ୍ ଓ ବ୍ୟାଙ୍କ୍' : (isHi ? 'रक्त घटक पृथक्करण केंद्र' : 'Blood Component Separation Center'),
        isOr ? 'ନିରାମୟ ୨୪x୭ ଔଷଧ କାଉଣ୍ଟର୍' : (isHi ? 'निरामय 24x7 औषधि केंद्र' : 'Niramaya 24x7 Free Medicine Counter')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIDAAN'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Nidaan Free Diagnostics'],
      protocols: isOr
        ? 'ପ୍ରାଥମିକ PHC ରୁ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଯୋଗାଯୋଗ, ତ୍ୱରିତ ରକ୍ତ ବ୍ୟବସ୍ଥା ଓ ମାଗଣା ନିଦାନ ଡାଇଗ୍ନୋଷ୍ଟିକ୍।'
        : (isHi
        ? 'प्राथमिक PHC से 108 एम्बुलेंस समन्वय, आपातकालीन रक्त उपलब्धता एवं निदान जांच।'
        : 'Direct 108 emergency transit dispatch, instant blood component access, Nidaan diagnostics.'),
      counter: 'Casualty Gate 1, Triage Desk A',
      coordinator: 'Dr. L. K. Sahoo (Emergency Superintendent)',
      badgeColor: 'from-teal-600 to-cyan-700'
    },
    {
      id: 'HOSP-05',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସମ୍ ଅଲ୍ଟିମେଟ୍ ମେଡିକେୟାର / IMS & SUM (Bhubaneswar)' : (isHi ? 'सम अल्टीमेट मेडिकेयर / आईएमएस एंड सम' : 'SUM Ultimate Medicare / IMS & SUM Hospital'),
      tier: isOr ? '୧,୭୫୦ ବେଡ୍ ବିଶିଷ୍ଟ NABH ସ୍ୱୀକୃତିପ୍ରାପ୍ତ ସୁପର-ସ୍ପେଶିଆଲିଟି' : (isHi ? '1,750 बेड एनएबीएच मान्यता प्राप्त सुपर-स्पेशियलिटी' : '1,750-Bed Quaternary Care & Bone Marrow Center'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: isOr ? 'କାଳିଙ୍ଗ ନଗର, ଘାଟିକିଆ, ଭୁବନେଶ୍ୱର - ୭୫୧୦୦୩' : (isHi ? 'कलिंगा नगर, घटिकिया, भुवनेश्वर - 751003' : 'Kalinga Nagar, Ghatikia, Bhubaneswar - 751003'),
      phone: '+91 674 2386281 / 1800-120-1112',
      totalBeds: 1750,
      availableIcuBeds: 21,
      availableVentilators: 10,
      specialtyCategory: 'Oncology',
      departments: [
        isOr ? 'ରୋବୋଟିକ୍ ଅଙ୍କୋଲୋଜି ଓ ବୋନ୍ ମ୍ୟାରୋ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ' : (isHi ? 'रोबोटिक ऑन्कोलॉजी एवं बोन मैरो ट्रांसप्लांट' : 'Robotic Oncology & Bone Marrow Transplant'),
        isOr ? 'କାର୍ଡିଓଥୋରାସିକ୍ ଓ ଭାସ୍କୁଲାର ସର୍ଜରି' : (isHi ? 'कार्डियोथोरेसिक एवं वैस्कुलर सर्जरी' : 'Cardiothoracic & Vascular Surgery (CTVS)'),
        isOr ? 'ଉନ୍ନତ ଗ୍ୟାଷ୍ଟ୍ରୋଏଣ୍ଟେରୋଲୋଜି' : (isHi ? 'एडवांस्ड गैस्ट्रोएंटरोलॉजी' : 'Advanced Medical & Surgical Gastroenterology')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY Empaneled'],
      protocols: isOr
        ? 'କ୍ୟାନ୍ସର କେୟାର ଫାଷ୍ଟ-ଟ୍ରାକ୍ ବେଡ୍ ବୁକିଂ, BSKY କ୍ୟାସଲେସ୍ ଡେସ୍କ।'
        : (isHi
        ? 'कैंसर रोगियों के लिए फास्ट-ट्रैक बेड, BSKY कैशलेस सहायता केंद्र।'
        : 'Fast-Track Oncology bed reservation, specialized robotic surgical clearance under BSKY.'),
      counter: 'Wing C, Trauma & Emergency Lounge',
      coordinator: 'Dr. B. K. Jena (Medical Director)',
      badgeColor: 'from-emerald-600 to-cyan-700'
    },

    // ================= 2. CUTTACK =================
    {
      id: 'HOSP-06',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଏସ.ସି.ବି. ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (SCBMCH Cuttack)' : (isHi ? 'एससीबी मेडिकल कॉलेज अस्पताल (SCBMCH Cuttack)' : 'SCB Medical College & Hospital, Cuttack'),
      tier: isOr ? 'ରାଜ୍ୟ ସର୍ବୋଚ୍ଚ ରେଫରାଲ୍ ହସ୍ପିଟାଲ୍ (State Apex Referral Hub)' : (isHi ? 'राज्य शीर्ष रेफरल अस्पताल' : 'State Apex Teaching & Referral Hub'),
      city: 'Cuttack',
      cityLabel: isOr ? 'କଟକ' : (isHi ? 'कटक' : 'Cuttack'),
      region: 'Odisha',
      address: isOr ? 'ମଙ୍ଗଳାବାଗ, କଟକ, ଓଡ଼ିଶା - ୭୫୩୦୦୭' : (isHi ? 'मंगलाबाग, कटक, ओडिशा - 753007' : 'Manglabag, Cuttack, Odisha - 753007'),
      phone: '+91 671 2414080 / 104',
      totalBeds: 1500,
      availableIcuBeds: 19,
      availableVentilators: 11,
      specialtyCategory: 'Nephro',
      departments: [
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ଏବଂ ହେମାଟୋଲୋଜି ଡେ-କେୟାର' : (isHi ? 'सिकल सेल एवं हेमेटोलॉजी डे-केयर' : 'Sickle Cell & Hematology Day-Care'),
        isOr ? 'ନେଫ୍ରୋଲୋଜି ଓ ଜରୁରୀକାଳୀନ ଡାୟାଲିସିସ୍' : (isHi ? 'नेफ्रोलॉजी एवं आपातकालीन डायलिसिस' : 'Nephrology & Emergency Dialysis'),
        isOr ? 'ସଂକ୍ରାମକ ରୋଗ HDU (Infectious Disease HDU)' : (isHi ? 'संक्रामक रोग HDU' : 'Infectious Disease HDU')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya Free Meds'],
      protocols: isOr
        ? 'BSKY ଅଧୀନରେ ସମ୍ପୂର୍ଣ୍ଣ ନିଃଶୁଳ୍କ ଔଷଧ ଓ ଟେଷ୍ଟ୍, ଡେଙ୍ଗୁ ପ୍ଲେଟଲେଟ୍ ଟ୍ରାନ୍ସଫ୍ୟୁଜନ୍ ତ୍ୱରିତ ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'BSKY के तहत शत-प्रतिशत निःशुल्क दवाएं एवं जांच, प्लेटलेट आपातकालीन प्रोटोकॉल।'
        : '100% Cashless under BSKY, Rapid Dengue/Platelet emergency bay, zero-delay Dialysis protocol.'),
      counter: 'Super Specialty Block A, Triage Reception Counter',
      coordinator: 'Dr. A. Behera (BSKY Nodal Officer)',
      badgeColor: 'from-emerald-600 to-teal-700'
    },
    {
      id: 'HOSP-07',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଅଶ୍ୱିନୀ ହସ୍ପିଟାଲ୍ ଓ ଟ୍ରମା ସେଣ୍ଟର୍ (Ashwini Hospital, Cuttack)' : (isHi ? 'अश्विनी अस्पताल एवं ट्रॉमा सेंटर (Cuttack)' : 'Ashwini Hospital & Trauma Centre, Cuttack'),
      tier: isOr ? '୩୦୦ ବେଡ୍ ବିଶିଷ୍ଟ ଟେର୍ସିଆରି ଟ୍ରମା ଓ ସୁପର-ସ୍ପେଶିଆଲିଟି' : (isHi ? '300 बेड तृतीयक ट्रॉमा एवं क्रिटिकल केयर' : 'Tertiary Neurotrauma & Critical Care Hub'),
      city: 'Cuttack',
      cityLabel: isOr ? 'କଟକ' : (isHi ? 'कटक' : 'Cuttack'),
      region: 'Odisha',
      address: isOr ? 'ସି.ଡି.ଏ. ସେକ୍ଟର ୧, କଟକ - ୭୫୩୦୧୪' : (isHi ? 'सीडीए सेक्टर 1, कटक - 753014' : 'CDA Sector 1, Cuttack - 753014'),
      phone: '+91 671 2363007 / 94370 12000',
      totalBeds: 300,
      availableIcuBeds: 8,
      availableVentilators: 5,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ନ୍ୟୁରୋଟ୍ରମା ଓ ମସ୍ତିଷ୍କ ଆଘାତ ଆଇସିୟୁ' : (isHi ? 'न्यूरोट्रॉमा एवं हेड इंजरी आईसीयू' : 'Neurotrauma & Head Injury ICU'),
        isOr ? 'ଜଟିଳ ଅସ୍ଥିଭଗ୍ନ ଓ ପଲିଟ୍ରମା କେୟାର' : (isHi ? 'पॉलीट्रॉमा एवं आर्थोपेडिक सर्जरी' : 'Complex Polytrauma & Orthopedics')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY Empaneled', 'PM-JAY'],
      protocols: isOr
        ? 'ହାଇୱେ ଗୋଲଡେନ୍ ଆୱାର୍ ଟ୍ରମା ପ୍ରୋଟୋକଲ୍, ତୁରନ୍ତ ସିଟି-ସ୍କାନ୍ ଏବଂ ଆଇସିୟୁ ଏସ୍କାଲେସନ୍।'
        : (isHi
        ? 'हाईवे गोल्डन आवर ट्रॉमा कॉरिडोर, त्वरित सीटी-स्कैन एवं आईसीयू।'
        : 'Highway Golden-Hour Trauma protocol, immediate CT scan and surgical ICU escalation.'),
      counter: 'Trauma Bay, Desk 01',
      coordinator: 'Dr. S. Mohanty (Trauma Director)',
      badgeColor: 'from-orange-600 to-amber-700'
    },
    {
      id: 'HOSP-08',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଆଚାର୍ଯ୍ୟ ହରିହର କର୍କଟ ପ୍ରତିଷ୍ଠାନ (AHPGIC, Cuttack)' : (isHi ? 'आचार्य हरिहर स्नातकोत्तर कैंसर संस्थान' : 'Acharya Harihar Post Graduate Institute of Cancer (AHPGIC)'),
      tier: isOr ? 'ଓଡ଼ିଶାର ଏକମାତ୍ର ସରକାରୀ ସର୍ବୋଚ୍ଚ କର୍କଟ ହସ୍ପିଟାଲ୍' : (isHi ? 'ओडिशा का प्रमुख सरकारी कैंसर संस्थान' : 'State Apex Specialized Cancer Institute'),
      city: 'Cuttack',
      cityLabel: isOr ? 'କଟକ' : (isHi ? 'कटक' : 'Cuttack'),
      region: 'Odisha',
      address: isOr ? 'ମଙ୍ଗଳାବାଗ, କଟକ - ୭୫୩୦୦୭' : (isHi ? 'मंगलाबाग, कटक - 753007' : 'Manglabag, Cuttack - 753007'),
      phone: '+91 671 2414760 / 2414761',
      totalBeds: 500,
      availableIcuBeds: 7,
      availableVentilators: 4,
      specialtyCategory: 'Oncology',
      departments: [
        isOr ? 'ସର୍ଜିକାଲ୍ ଓ ମେଡିକାଲ୍ ଅଙ୍କୋଲୋଜି' : (isHi ? 'सर्जिकल एवं मेडिकल ऑन्कोलॉजी' : 'Surgical & Medical Oncology'),
        isOr ? 'ରେଡିଏସନ୍ ଥେରାପି ଓ ଲିନାକ୍' : (isHi ? 'रेडिएशन थेरेपी एवं लीनैक' : 'Radiation Oncology (LINAC)'),
        isOr ? 'ପାଲିଏଟିଭ୍ କେୟାର ୟୁନିଟ୍' : (isHi ? 'उपशामक देखभाल केंद्र' : 'Palliative Care Unit')
      ],
      schemes: ['BSKY', 'PMJAY', 'RAN'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'RAN Scheme'],
      protocols: isOr
        ? 'BSKY କ୍ୟାସଲେସ୍ ଅଙ୍କୋଲୋଜି କେୟାର, ରେଡିଓଥେରାପି ତ୍ୱରିତ ସ୍ଲଟ୍।'
        : (isHi
        ? 'BSKY शत-प्रतिशत कैशलेस कैंसर उपचार, त्वरित रेडियोथेरेपी।'
        : '100% Cashless oncology care under BSKY, priority radiotherapy slots.'),
      counter: 'Oncology OPD Block B',
      coordinator: 'Dr. L. Sarangi (Director, AHPGIC)',
      badgeColor: 'from-purple-600 to-pink-700'
    },

    // ================= 3. BERHAMPUR =================
    {
      id: 'HOSP-09',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଏମ.କେ.ସି.ଜି. ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (MKCG Berhampur)' : (isHi ? 'एमकेसीजी मेडिकल कॉलेज अस्पताल (MKCG Berhampur)' : 'MKCG Medical College & Hospital, Berhampur'),
      tier: isOr ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶାର ସର୍ବୋଚ୍ଚ ରେଫରାଲ୍ ମେଡିକାଲ୍ କଲେଜ୍' : (isHi ? 'दक्षिण ओडिशा का शीर्ष रेफरल मेडिकल कॉलेज' : 'South Odisha Apex Medical College & Referral Hub'),
      city: 'Berhampur',
      cityLabel: isOr ? 'ବ୍ରହ୍ମପୁର' : (isHi ? 'ब्रह्मपुर' : 'Berhampur'),
      region: 'Odisha',
      address: isOr ? 'ମେଡିକାଲ୍ କ୍ୟାମ୍ପସ୍, ବ୍ରହ୍ମପୁର, ଗଞ୍ଜାମ - ୭୬୦୦୦୪' : (isHi ? 'मेडिकल कैंपस, ब्रह्मपुर, गंजम - 760004' : 'Medical Campus, Berhampur, Ganjam - 760004'),
      phone: '+91 680 2292746 / 2292809',
      totalBeds: 1050,
      availableIcuBeds: 15,
      availableVentilators: 8,
      specialtyCategory: 'Cardio',
      departments: [
        isOr ? 'ସୁପର-ସ୍ପେଶିଆଲିଟି କାର୍ଡିଓଲୋଜି ଓ କ୍ୟାଥ୍ ଲ୍ୟାବ୍' : (isHi ? 'सुपर-स्पेशियलिटी कार्डियोलॉजी एवं कैथ लैब' : 'Super-Specialty Cardiology & Cath Lab'),
        isOr ? 'ଟ୍ରମା ଏବଂ ଜରୁରୀକାଳୀନ ମେଡିସିନ୍' : (isHi ? 'ट्रॉमा एवं इमरजेंसी मेडिसिन' : 'Trauma & Emergency Medicine'),
        isOr ? 'ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ (SNCU/PICU)' : (isHi ? 'शिशु स्वास्थ्य विभाग (SNCU/PICU)' : 'Pediatrics & SNCU/PICU')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya Meds'],
      protocols: isOr
        ? 'ଗଞ୍ଜାମ, ଗଜପତି ଓ କନ୍ଧମାଳ ଜିଲ୍ଲାର ଜରୁରୀ ରୋଗୀଙ୍କ ପାଇଁ ତ୍ୱରିତ ପ୍ରବେଶ।'
        : (isHi
        ? 'दक्षिण जिलों से गंभीर मरीजों के लिए त्वरित रेफरल गलियारा।'
        : 'Priority intake corridor for Ganjam, Gajapati, and Kandhamal district referrals.'),
      counter: 'Super Specialty Wing, Desk 02',
      coordinator: 'Dr. B. C. Jena (Superintendent)',
      badgeColor: 'from-blue-600 to-cyan-700'
    },

    // ================= 4. ROURKELA =================
    {
      id: 'HOSP-10',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଇସ୍ପାତ ଜେନେରାଲ୍ ହସ୍ପିଟାଲ୍ ଓ ସୁପର ସ୍ପେଶିଆଲିଟି (IGH Rourkela)' : (isHi ? 'इस्पात जनरल अस्पताल एवं सुपर स्पेशियलिटी (IGH Rourkela)' : 'Ispat General Hospital (IGH) & Super Specialty Hospital'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ପ୍ରମୁଖ ଶିଳ୍ପାଞ୍ଚଳ ସୁପର-ସ୍ପେଶିଆଲିଟି କେନ୍ଦ୍ର' : (isHi ? 'पश्चिम ओडिशा का प्रमुख इस्पात सुपर स्पेशियलिटी केंद्र' : 'West Odisha Premier SAIL Industrial & Tertiary Hub'),
      city: 'Rourkela',
      cityLabel: isOr ? 'ରାଉରକେଲା' : (isHi ? 'राउरकेला' : 'Rourkela'),
      region: 'Odisha',
      address: isOr ? 'ସେକ୍ଟର ୧୯, ରାଉରକେଲା, ସୁନ୍ଦରଗଡ଼ - ୭୬୯୦୦୫' : (isHi ? 'सेक्टर 19, राउरकेला, सुंदरगढ़ - 769005' : 'Sector 19, Rourkela, Sundargarh - 769005'),
      phone: '+91 661 2510201 / 2510500',
      totalBeds: 600,
      availableIcuBeds: 12,
      availableVentilators: 6,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଶିଳ୍ପାଞ୍ଚଳ ଟ୍ରମା ଓ ଅତ୍ୟାଧୁନିକ ପୋଡ଼ାଘା ୟୁନିଟ୍' : (isHi ? 'औद्योगिक ट्रॉमा एवं बर्न यूनिट' : 'Industrial Trauma & Advanced Burn Unit'),
        isOr ? 'ନ୍ୟୁରୋସର୍ଜରି ଓ ସିସିୟୁ' : (isHi ? 'न्यूरोसर्जरी एवं सीसीयू' : 'Neurosurgery & Critical Care'),
        isOr ? 'କାର୍ଡିଆକ୍ କେଥ୍ ଲ୍ୟାବ୍' : (isHi ? 'कार्डियक कैथ लैब' : 'Cardiac Sciences & Cath Lab')
      ],
      schemes: ['BSKY', 'PMJAY', 'SAIL'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'SAIL Scheme'],
      protocols: isOr
        ? 'କୋଇଲା ଓ ଷ୍ଟିଲ୍ ପ୍ଲାଣ୍ଟ୍ ଶ୍ରମିକଙ୍କ ପାଇଁ ଜରୁରୀକାଳୀନ ESIC ଓ BSKY ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'औद्योगिक एवं खान श्रमिकों के लिए तत्काल बर्न एवं ट्रॉमा केयर।'
        : 'Emergency protocol for industrial crush injuries, toxic gas exposure, and severe burns.'),
      counter: 'Super Specialty Block, Casualty Counter 01',
      coordinator: 'Dr. B. K. Sahu (Chief of Medical Services)',
      badgeColor: 'from-amber-600 to-red-700'
    },
    {
      id: 'HOSP-11',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ହାଇ-ଟେକ୍ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (Hi-Tech Rourkela)' : (isHi ? 'हाई-टेक मेडिकल कॉलेज अस्पताल (Hi-Tech Rourkela)' : 'Hi-Tech Medical College & Hospital, Rourkela'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ଟେର୍ସିଆରି ମଲ୍ଟି-ସ୍ପେଶିଆଲିଟି' : (isHi ? 'पश्चिम ओडिशा मल्टी-स्पेशियलिटी अस्पताल' : 'Western Odisha Multi-Specialty Tertiary Hub'),
      city: 'Rourkela',
      cityLabel: isOr ? 'ରାଉରକେଲା' : (isHi ? 'राउरकेला' : 'Rourkela'),
      region: 'Odisha',
      address: isOr ? 'ପାଣପୋଷ, ରାଉରକେଲା - ୭୬୯୦୦୪' : (isHi ? 'पानपोष, राउरकेला - 769004' : 'Panposh, Rourkela - 769004'),
      phone: '+91 661 2400661',
      totalBeds: 400,
      availableIcuBeds: 7,
      availableVentilators: 4,
      specialtyCategory: 'Nephro',
      departments: [
        isOr ? 'ନେଫ୍ରୋଲୋଜି ଓ ଡାୟାଲିସିସ୍' : (isHi ? 'नेफ्रोलॉजी एवं डायलिसिस' : 'Nephrology & Dialysis'),
        isOr ? 'ଜରୁରୀକାଳୀନ ମେଡିସିନ୍' : (isHi ? 'इमरजेंसी मेडिसिन' : 'Emergency Medicine')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY Empaneled', 'PM-JAY'],
      protocols: isOr ? 'ସୁନ୍ଦରଗଡ଼ ଓ ଝାରସୁଗୁଡ଼ା ରୋଗୀଙ୍କ ପାଇଁ BSKY ଡାୟାଲିସିସ୍ ସେବା।' : (isHi ? 'समीपवर्ती जिलों के लिए BSKY डायलिसिस सुविधा।' : 'BSKY cashless dialysis and general emergency services.'),
      counter: 'Main Reception, Desk 04',
      coordinator: 'Dr. R. K. Pattnaik (Nodal Coordinator)',
      badgeColor: 'from-slate-700 to-slate-900'
    },

    // ================= 5. SAMBALPUR / BURLA =================
    {
      id: 'HOSP-12',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଭିମ୍‌ସାର୍ (VIMSAR Burla, Sambalpur)' : (isHi ? 'विमसार बुर्ला, सम्बलपुर (VIMSAR Burla)' : 'VIMSAR (Veer Surendra Sai Institute of Medical Sciences & Research)'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶାର ସର୍ବବୃହତ ସରକାରୀ ସୁପର-ସ୍ପେଶିଆଲିଟି ସଂସ୍ଥାନ' : (isHi ? 'पश्चिम ओडिशा का शीर्ष सरकारी मेडिकल संस्थान' : 'Western Odisha Premier Apex Referral Institute'),
      city: 'Sambalpur',
      cityLabel: isOr ? 'ସମ୍ବଲପୁର / ବୁର୍ଲା' : (isHi ? 'सम्बलपुर / बुर्ला' : 'Sambalpur / Burla'),
      region: 'Odisha',
      address: isOr ? 'ବୁର୍ଲା, ସମ୍ବଲପୁର, ଓଡ଼ିଶା - ୭୬୮୦୧୭' : (isHi ? 'बुर्ला, सम्बलपुर, ओडिशा - 768017' : 'Burla, Sambalpur, Odisha - 768017'),
      phone: '+91 663 2430768 / 104',
      totalBeds: 1100,
      availableIcuBeds: 18,
      availableVentilators: 9,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ନ୍ୟୁରୋସର୍ଜରି ଓ ଟ୍ରମା ସେଣ୍ଟର୍' : (isHi ? 'न्यूरोसर्जरी एवं ट्रॉमा सेंटर' : 'Neurosurgery & Level-2 Trauma Centre'),
        isOr ? 'ହୃଦରୋଗ ଓ କ୍ୟାଥ୍ ଲ୍ୟାବ୍' : (isHi ? 'कार्डियोलॉजी एवं कैथ लैब' : 'Cardiology & Cath Lab'),
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ଡେ-କେୟାର ସେଣ୍ଟର୍' : (isHi ? 'सिकल सेल डे-केयर केंद्र' : 'Sickle Cell Regional Day-Care Centre')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya Meds'],
      protocols: isOr
        ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା ଓ ଛତିଶଗଡ଼ ସୀମାନ୍ତ ରୋଗୀଙ୍କ ପାଇଁ ସିକିଲ୍ ସେଲ୍ ଓ ନ୍ୟୁରୋ-ଟ୍ରମା ଫାଷ୍ଟ-ଟ୍ରାକ୍।'
        : (isHi
        ? 'सिकल सेल संकट एवं गंभीर न्यूरोट्रॉमा के लिए त्वरित आपातकालीन डेस्क।'
        : 'Sickle cell vaso-occlusive crisis and acute neurotrauma priority pipeline for Western Odisha.'),
      counter: 'Super Specialty Building, Emergency Triage Counter',
      coordinator: 'Dr. L. N. Gupta (Superintendent, VIMSAR)',
      badgeColor: 'from-emerald-600 to-indigo-700'
    },

    // ================= 6. BALASORE =================
    {
      id: 'HOSP-13',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଫକୀର ମୋହନ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (FMMCH Balasore)' : (isHi ? 'फकीर मोहन मेडिकल कॉलेज अस्पताल (Balasore)' : 'Fakir Mohan Medical College & Hospital (FMMCH)'),
      tier: isOr ? 'ଉତ୍ତର ଓଡ଼ିଶା ଉପକୂଳର ସର୍ବୋଚ୍ଚ ସରକାରୀ ହସ୍ପିଟାଲ୍' : (isHi ? 'उत्तरी ओडिशा तटीय क्षेत्र का प्रमुख मेडिकल कॉलेज' : 'North Odisha Coastal Apex Medical College'),
      city: 'Balasore',
      cityLabel: isOr ? 'ବାଲେଶ୍ୱର' : (isHi ? 'बालेश्वर' : 'Balasore'),
      region: 'Odisha',
      address: isOr ? 'ରେମୁଣା, ବାଲେଶ୍ୱର, ଓଡ଼ିଶା - ୭୫୬୦୧୯' : (isHi ? 'रेमुणा, बालेश्वर, ओडिशा - 756019' : 'Remuna, Balasore, Odisha - 756019'),
      phone: '+91 6782 224901',
      totalBeds: 500,
      availableIcuBeds: 10,
      availableVentilators: 5,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ କାଜୁଆଲିଟି ଓ ଆଇସିୟୁ' : (isHi ? 'इमरजेंसी एवं आईसीयू' : 'Emergency Casualty & ICU'),
        isOr ? 'ସ୍ତ୍ରୀ ଓ ପ୍ରସୂତି ରୋଗ (FRU MCH)' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य विंग' : 'High-Risk Obstetrics & MCH Wing'),
        isOr ? 'ଡାଇରିଆ ଓ ସଂକ୍ରାମକ ରୋଗ ୱାର୍ଡ' : (isHi ? 'संक्रामक रोग नियंत्रण वार्ड' : 'Infectious Disease & Coastal Outbreak Unit')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya'],
      protocols: isOr
        ? 'ବାତ୍ୟା ଓ ବନ୍ୟା ପରବର୍ତ୍ତୀ ଜଳବାହିତ ରୋଗ ଟ୍ରାଏଜ୍, BSKY ନିଃଶୁଳ୍କ ମାତୃ ସେବା।'
        : (isHi
        ? 'बाढ़ एवं चक्रवात उपरांत संक्रामक रोग नियंत्रण, BSKY मातृ सुरक्षा।'
        : 'Cyclone & flood post-disaster infectious disease protocols, BSKY maternal clearances.'),
      counter: 'Emergency Gate 1, Triage Desk',
      coordinator: 'Dr. K. C. Nayak (Superintendent)',
      badgeColor: 'from-blue-600 to-teal-700'
    },

    // ================= 7. KORAPUT =================
    {
      id: 'HOSP-14',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସହିଦ ଲକ୍ଷ୍ମଣ ନାୟକ ମେଡିକାଲ୍ କଲେଜ୍ (SLNMCH Koraput)' : (isHi ? 'शहीद लक्ष्मण नायक मेडिकल कॉलेज (Koraput)' : 'Saheed Laxman Nayak Medical College & Hospital (SLNMCH)'),
      tier: isOr ? 'ଆଦିବାସୀ ବହୁଳ ଦକ୍ଷିଣ-ପଶ୍ଚିମ ଓଡ଼ିଶାର ସର୍ବୋଚ୍ଚ ହସ୍ପିଟାଲ୍' : (isHi ? 'जनजातीय दक्षिण-पश्चिम ओडिशा का शीर्ष अस्पताल' : 'South-West Tribal Belt Apex Referral Hospital'),
      city: 'Koraput',
      cityLabel: isOr ? 'କୋରାପୁଟ' : (isHi ? 'कोरापुट' : 'Koraput'),
      region: 'Odisha',
      address: isOr ? 'କୋରାପୁଟ ସହର, ଓଡ଼ିଶା - ୭୬୪୦୨୦' : (isHi ? 'कोरापुट, ओडिशा - 764020' : 'Koraput, Odisha - 764020'),
      phone: '+91 6852 250501',
      totalBeds: 500,
      availableIcuBeds: 8,
      availableVentilators: 4,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଫାଲସିପାରମ୍ ମ୍ୟାଲେରିଆ ଓ ସିକିଲ୍ ସେଲ୍ HDU' : (isHi ? 'फाल्सीपेरम मलेरिया एवं सिकल सेल HDU' : 'Severe Falciparum Malaria & Sickle Cell HDU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC) ଓ ଶିଶୁ କେୟାର' : (isHi ? 'गंभीर कुपोषण (NRC) एवं शिशु गहन वार्ड' : 'Nutrition Rehabilitation (NRC) & Pediatric ICU'),
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ ଓ ଜରୁରୀକାଳୀନ ଅସ୍ତ୍ରୋପଚାର' : (isHi ? 'मातृ स्वास्थ्य एवं प्रसूति आपातकाल' : 'Emergency Obstetric Care (FRU)')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya'],
      protocols: isOr
        ? 'ଦୁର୍ଗମ ଆଦିବାସୀ ଅଞ୍ଚଳରୁ ୧୦୮ ବୋଟ୍/ରୋଡ୍ ଆମ୍ବୁଲାନ୍ସ ରିସେପ୍ସନ୍, ମ୍ୟାଲେରିଆ ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'दुर्गम क्षेत्रों से आपातकालीन एम्बुलेंस रिसेप्शन, गंभीर मलेरिया प्रबंधन।'
        : 'Emergency boat/road ambulance reception from cut-off tribal pockets, Severe Malaria protocol.'),
      counter: 'Casualty Bay, Tribal Health Helpdesk',
      coordinator: 'Dr. H. K. Sethi (Superintendent)',
      badgeColor: 'from-amber-700 to-emerald-800'
    },

    // ================= 8. PURI =================
    {
      id: 'HOSP-15',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଶ୍ରୀ ଜଗନ୍ନାଥ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (SJMCH Puri)' : (isHi ? 'श्री जगन्नाथ मेडिकल कॉलेज अस्पताल (Puri)' : 'Sri Jagannath Medical College & Hospital (SJMCH)'),
      tier: isOr ? 'ଉପକୂଳ ତୀର୍ଥକ୍ଷେତ୍ର ଟ୍ରମା ଓ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'तटीय तीर्थ क्षेत्र प्रमुख मेडिकल कॉलेज' : 'Coastal Pilgrim Center & Emergency Trauma Hub'),
      city: 'Puri',
      cityLabel: isOr ? 'ପୁରୀ' : (isHi ? 'पुरी' : 'Puri'),
      region: 'Odisha',
      address: isOr ? 'ସମଙ୍ଗରା, ପୁରୀ, ଓଡ଼ିଶା - ୭୫୨୦୦୨' : (isHi ? 'समंगरा, पुरी, ओडिशा - 752002' : 'Samangara, Puri, Odisha - 752002'),
      phone: '+91 6752 232001',
      totalBeds: 500,
      availableIcuBeds: 11,
      availableVentilators: 5,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ତୀର୍ଥଯାତ୍ରୀ ଟ୍ରାଏଜ୍ ଓ ଟ୍ରମା ବେ' : (isHi ? 'तीर्थयात्री इमरजेंसी एवं ट्रॉमा बे' : 'Mass Pilgrim Triage & Trauma Bay'),
        isOr ? 'କାର୍ଡିଆକ୍ ଷ୍ଟାବିଲାଇଜେସନ୍ ୟୁନିଟ୍' : (isHi ? 'कार्डियक स्थिरीकरण केंद्र' : 'Cardiac Stabilization Unit'),
        isOr ? 'ଉପକୂଳ ଡ୍ରାଉନିଂ ଓ ହିଟ୍‌ଷ୍ଟ୍ରୋକ୍ ଆଇସିୟୁ' : (isHi ? 'हीटस्ट्रोक एवं डूबने पर आपातकालीन केंद्र' : 'Drowning & Heat-Stroke Critical Unit')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya'],
      protocols: isOr
        ? 'ରଥଯାତ୍ରା ଓ ଭିଡ଼ ସମୟରେ ତୁରନ୍ତ ଟ୍ରାଏଜ୍ ଇଭାକ୍ୟୁଏସନ୍, ସମୁଦ୍ରକୂଳ ଦୁର୍ଘଟଣା ସେଲ୍।'
        : (isHi
        ? 'तीर्थयात्री भीड़ आपातकालीन ट्रायज एवं ग्रीन कॉरिडोर।'
        : 'Mass gathering triage, near-drowning protocol, and expressway green corridor to AIIMS/SCB.'),
      counter: 'Pilgrim Casualty Counter 01',
      coordinator: 'Dr. B. N. Mohapatra (Superintendent)',
      badgeColor: 'from-orange-500 to-amber-700'
    },

    // ================= 9. BARIPADA / MAYURBHANJ =================
    {
      id: 'HOSP-16',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ପଣ୍ଡିତ ରଘୁନାଥ ମୁର୍ମୁ ମେଡିକାଲ୍ କଲେଜ୍ (PRMMCH Baripada)' : (isHi ? 'पंडित रघुनाथ मुर्मू मेडिकल कॉलेज (Baripada)' : 'Pandit Raghunath Murmu Medical College & Hospital (PRMMCH)'),
      tier: isOr ? 'ଉତ୍ତର ଆଦିବାସୀ ଜିଲ୍ଲାର ପ୍ରମୁଖ ରେଫରାଲ୍ ହସ୍ପିଟାଲ୍' : (isHi ? 'उत्तरी जनजातीय जिले का प्रमुख रेफरल अस्पताल' : 'North Odisha Tribal Apex Medical College'),
      city: 'Baripada',
      cityLabel: isOr ? 'ବାରିପଦା' : (isHi ? 'बारीपदा' : 'Baripada'),
      region: 'Odisha',
      address: isOr ? 'ରଙ୍ଗାମାଟିଆ, ବାରିପଦା, ମୟୂରଭଞ୍ଜ - ୭୫୭୧୦୭' : (isHi ? 'रंगामाटिया, बारीपदा, मयूरभंज - 757107' : 'Rangamatia, Baripada, Mayurbhanj - 757107'),
      phone: '+91 6792 252101',
      totalBeds: 500,
      availableIcuBeds: 9,
      availableVentilators: 4,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ବିଷାକ୍ତ ସାପକାମୁଡ଼ା ଓ ଟକ୍ସିକୋଲୋଜି ଆଇସିୟୁ' : (isHi ? 'सर्पदंश एवं टॉक्सिकोलॉजी आईसीयू' : 'Snakebite & Clinical Toxicology ICU'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଅସ୍ଥିଶଲ୍ୟ ଓ ଟ୍ରମା' : (isHi ? 'आपातकालीन आर्थोपेडिक्स एवं ट्रॉमा' : 'Orthopedic & Trauma Bay'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ବିଭାଗ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya'],
      protocols: isOr
        ? 'ଶିମିଳିପାଳ ଆଦିବାସୀ ଅଞ୍ଚଳରୁ ସାପକାମୁଡ଼ା ଆଣ୍ଟି-ଭେନମ୍ ତ୍ୱରିତ ସେବା।'
        : (isHi
        ? 'सर्पदंश एंटी-वेनम आपातकालीन प्रोटोकॉल, BSKY त्वरित सुविधा।'
        : 'Emergency neurotoxic snakebite anti-venom protocol and forest zone trauma transfer.'),
      counter: 'Emergency Casualty, Desk A',
      coordinator: 'Dr. P. K. Marndi (Superintendent)',
      badgeColor: 'from-emerald-700 to-teal-900'
    },

    // ================= 10. BOLANGIR =================
    {
      id: 'HOSP-17',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଭୀମ ଭୋଇ ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (BBMCH Bolangir)' : (isHi ? 'भीम भोई मेडिकल कॉलेज अस्पताल (Bolangir)' : 'Bhima Bhoi Medical College & Hospital (BBMCH)'),
      tier: isOr ? 'କେ.ବି.କେ. କ୍ଷେତ୍ରର ପ୍ରମୁଖ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'केबीके क्षेत्र का प्रमुख मेडिकल कॉलेज' : 'KBK Region Premier Government Medical College'),
      city: 'Bolangir',
      cityLabel: isOr ? 'ବଲାଙ୍ଗୀର' : (isHi ? 'बलांगीर' : 'Bolangir'),
      region: 'Odisha',
      address: isOr ? 'ବଲାଙ୍ଗୀର ସହର, ଓଡ଼ିଶା - ୭୬୭୦୦୧' : (isHi ? 'बलांगीर, ओडिशा - 767001' : 'Bolangir, Odisha - 767001'),
      phone: '+91 6652 233044',
      totalBeds: 500,
      availableIcuBeds: 8,
      availableVentilators: 4,
      specialtyCategory: 'Nephro',
      departments: [
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ସ୍ୱତନ୍ତ୍ର କ୍ଲିନିକ୍ ଓ ଆଇସିୟୁ' : (isHi ? 'सिकल सेल विशेष क्लिनिक एवं आईसीयू' : 'Sickle Cell Dedicated HDU'),
        isOr ? 'ନେଫ୍ରୋଲୋଜି ଓ ଡାୟାଲିସିସ୍ କେନ୍ଦ୍ର' : (isHi ? 'डायलिसिस केंद्र' : 'Dialysis & Renal Care Center'),
        isOr ? 'ଆକ୍ୟୁଟ୍ ହିଟ୍‌ଷ୍ଟ୍ରୋକ୍ ୱାର୍ଡ' : (isHi ? 'लू एवं हीटवेव उपचार केंद्र' : 'Acute Heat-Wave Emergency Bay')
      ],
      schemes: ['BSKY', 'PMJAY', 'NIRAMAYA'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'Niramaya'],
      protocols: isOr
        ? 'ବଲାଙ୍ଗୀର ଓ ସୁବର୍ଣ୍ଣପୁର ଜିଲ୍ଲାର ପ୍ରଚଣ୍ଡ ଗ୍ରୀଷ୍ମ ପ୍ରବାହ ଓ ସିକିଲ୍ ସେଲ୍ ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'ग्रीष्मकालीन हीटस्ट्रोक एवं सिकल सेल आपातकालीन प्रबंधन।'
        : 'Dedicated protocol for severe heat-wave hyperpyrexia and sickle cell crisis.'),
      counter: 'Emergency Block, Room 03',
      coordinator: 'Dr. M. K. Panda (Superintendent)',
      badgeColor: 'from-amber-600 to-rose-700'
    },

    // ================= 11. KEONJHAR =================
    {
      id: 'HOSP-18',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଧରଣୀଧର ମେଡିକାଲ୍ କଲେଜ୍ ଓ ହସ୍ପିଟାଲ୍ (DDMCH Keonjhar)' : (isHi ? 'धरणीधर मेडिकल कॉलेज अस्पताल (Keonjhar)' : 'Dharanidhar Medical College & Hospital (DDMCH)'),
      tier: isOr ? 'ଖଣି ଅଞ୍ଚଳର ପ୍ରମୁଖ ଟ୍ରମା ଓ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'खनन क्षेत्र का प्रमुख मेडिकल कॉलेज' : 'Mining Belt Occupational & Trauma Care Hub'),
      city: 'Keonjhar',
      cityLabel: isOr ? 'କେନ୍ଦୁଝର' : (isHi ? 'क्योंझर' : 'Keonjhar'),
      region: 'Odisha',
      address: isOr ? 'କାବେରୀ, କେନ୍ଦୁଝର, ଓଡ଼ିଶା - ୭୫୮୦୦୧' : (isHi ? 'क्योंझर, ओडिशा - 758001' : 'Kaberi, Keonjhar, Odisha - 758001'),
      phone: '+91 6766 255200',
      totalBeds: 500,
      availableIcuBeds: 9,
      availableVentilators: 4,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଖଣି ଦୁର୍ଘଟଣା ଟ୍ରମା ଓ ଅର୍ଥୋପେଡିକ୍' : (isHi ? 'खनन दुर्घटना ट्रॉमा एवं ऑर्थोपेडिक' : 'Mining Accident Trauma & Orthopedics'),
        isOr ? 'ଶ୍ୱାସରୋଗ ଓ ନ୍ୟୁମୋକୋନିଓସିସ୍ କେୟାର' : (isHi ? 'फेफड़े के रोग एवं व्यावसायिक स्वास्थ्य' : 'Occupational Pulmonology & Silicosis Bay'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଆଇସିୟୁ' : (isHi ? 'इमरजेंसी आईसीयू' : 'Emergency ICU')
      ],
      schemes: ['BSKY', 'PMJAY', 'DMF'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'DMF Funded'],
      protocols: isOr
        ? 'ଜିଲ୍ଲା ଖଣିଜ ପ୍ରତିଷ୍ଠାନ (DMF) ପାଣ୍ଠି ସହାୟତାରେ ଶ୍ରମିକଙ୍କ ମାଗଣା ଚିକିତ୍ସା।'
        : (isHi
        ? 'जिला खनिज फाउंडेशन (DMF) द्वारा श्रमिकों हेतु निःशुल्क त्वरित चिकित्सा।'
        : 'District Mineral Foundation (DMF) sponsored priority occupational lung and trauma care.'),
      counter: 'Mining Trauma Desk 01',
      coordinator: 'Dr. C. R. Sahu (Superintendent)',
      badgeColor: 'from-stone-600 to-amber-800'
    },

    // ================= 12. JHARSUGUDA =================
    {
      id: 'HOSP-19',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ ଓ ହାର୍ଟ ଇନଷ୍ଟିଚ୍ୟୁଟ୍ (Jharsuguda)' : (isHi ? 'जिला अस्पताल एवं हृदय संस्थान (Jharsuguda)' : 'District Headquarters Hospital & Heart Institute, Jharsuguda'),
      tier: isOr ? 'ପଶ୍ଚିମ ଶିଳ୍ପାଞ୍ଚଳ କାର୍ଡିଆକ୍ ଓ ଟ୍ରମା କେନ୍ଦ୍ର' : (isHi ? 'हृदय एवं औद्योगिक ट्रॉमा केंद्र' : 'Western Industrial Cardiac & Trauma Bay'),
      city: 'Jharsuguda',
      cityLabel: isOr ? 'ଝାରସୁଗୁଡ଼ା' : (isHi ? 'झारसुगुड़ा' : 'Jharsuguda'),
      region: 'Odisha',
      address: isOr ? 'ମଙ୍ଗଳବଜାର, ଝାରସୁଗୁଡ଼ା - ୭୬୮୨୦୧' : (isHi ? 'झारसुगुड़ा, ओडिशा - 768201' : 'Mangalbazar, Jharsuguda - 768201'),
      phone: '+91 6645 272800',
      totalBeds: 350,
      availableIcuBeds: 7,
      availableVentilators: 3,
      specialtyCategory: 'Cardio',
      departments: [
        isOr ? 'କାର୍ଡିଆକ୍ କେୟାର ୟୁନିଟ୍ (CCU)' : (isHi ? 'कार्डियक केयर यूनिट (CCU)' : 'Cardiac Care Unit (CCU)'),
        isOr ? 'ଶିଳ୍ପ ଦୁର୍ଘଟଣା କାଜୁଆଲିଟି' : (isHi ? 'औद्योगिक कैजुअल्टी' : 'Industrial Casualty & Trauma')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ବୀର ସୁରେନ୍ଦ୍ର ସାଏ ବିମାନବନ୍ଦର ଏୟାର-ଆମ୍ବୁଲାନ୍ସ ସଂଯୋଗ, BSKY କାର୍ଡିଆକ୍ ଥ୍ରୋମ୍ବୋଲିସିସ୍।' : (isHi ? 'एयर-एम्बुलेंस समन्वय एवं आपातकालीन कार्डियक सेवा।' : 'Airport air-ambulance transit connection, rapid cardiac thrombolysis under BSKY.'),
      counter: 'CCU Counter 02',
      coordinator: 'Dr. P. K. Rath (Chief Medical Officer)',
      badgeColor: 'from-red-600 to-indigo-800'
    },

    // ================= 13. ANGUL / TALCHER =================
    {
      id: 'HOSP-20',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ତାଳଚେର ମେଡିକାଲ୍ କଲେଜ୍ ଓ ଜିନ୍ଦଲ ହସ୍ପିଟାଲ୍ (Angul/Talcher)' : (isHi ? 'तालचेर मेडिकल कॉलेज एवं जिंदल संजीवनी अस्पताल' : 'Talcher Medical College & Jindal Sanjivani Hospital, Angul'),
      tier: isOr ? 'କୋଇଲା ଓ ଇସ୍ପାତ ଶିଳ୍ପ ବେଲ୍ଟ୍ ସୁପର-ସ୍ପେଶିଆଲିଟି' : (isHi ? 'कोयला एवं इस्पात क्षेत्र सुपर स्पेशियलिटी' : 'Coal Belt Burns, Trauma & Multi-Specialty Hub'),
      city: 'Angul',
      cityLabel: isOr ? 'ଅନୁଗୋଳ / ତାଳଚେର' : (isHi ? 'अनुगुल / तालचेर' : 'Angul / Talcher'),
      region: 'Odisha',
      address: isOr ? 'ତାଳଚେର / ଅନୁଗୋଳ, ଓଡ଼ିଶା - ୭୫୯୧୦୦' : (isHi ? 'तालचेर, अनुगुल - 759100' : 'Talcher, Angul - 759100'),
      phone: '+91 6760 240500',
      totalBeds: 450,
      availableIcuBeds: 10,
      availableVentilators: 5,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ପୋଡ଼ାଘା ଓ କେମିକାଲ୍ ଆଘାତ ଆଇସିୟୁ' : (isHi ? 'बर्न एवं रासायनिक चोट आईसीयू' : 'Burns & Chemical Exposure ICU'),
        isOr ? 'ପଲ୍‌ମୋନାରି କ୍ରିଟିକାଲ୍ କେୟାର' : (isHi ? 'फेफड़े की गंभीर बीमारी वार्ड' : 'Pulmonary Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY', 'MCL'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY', 'MCL Empaneled'],
      protocols: isOr ? 'ତାପଜ ବିଦ୍ୟୁତ୍ କେନ୍ଦ୍ର ଓ ଖଣି ଶ୍ରମିକଙ୍କ ପାଇଁ ୨୪x୭ ଜରୁରୀକାଳୀନ ବାର୍ଣ୍ଣ କେୟାର।' : (isHi ? 'थर्मल पावर एवं माइनिंग श्रमिकों हेतु 24x7 बर्न केयर।' : '24x7 Thermal power plant & coal mining burn and crush management protocols.'),
      counter: 'Emergency Burn Desk',
      coordinator: 'Dr. S. K. Mishra (Head of Critical Care)',
      badgeColor: 'from-orange-600 to-zinc-800'
    },


    // ================= 14. BARGARH =================
    {
      id: 'HOSP-28',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ବରଗଡ଼ (DHH Bargarh)' : (isHi ? 'जिला मुख्य चिकित्सालय, बरगढ़ (DHH Bargarh)' : 'District Headquarters Hospital (DHH), Bargarh'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ରେଫରାଲ୍ ହସ୍ପିଟାଲ୍' : (isHi ? 'जिला स्तरीय रेफरल अस्पताल' : 'District-Level Fast-Track Referral Hospital'),
      city: 'Bargarh',
      cityLabel: isOr ? 'ବରଗଡ଼' : (isHi ? 'बरगढ़' : 'Bargarh'),
      region: 'Odisha',
      address: isOr ? 'ଡିଏଚଏଚ୍ ରୋଡ୍, ବରଗଡ଼, ଓଡ଼ିଶା - ୭୬୮୦୨୮' : (isHi ? 'DHH रोड, बरगढ़, ओडिशा - 768028' : 'DHH Road, Bargarh, Odisha - 768028'),
      phone: '+91 6646 232222',
      totalBeds: 300,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା ଓ ସ୍ଥିରୀକରଣ' : (isHi ? 'इमरजेंसी ट्रॉमा एवं स्थिरीकरण' : 'Emergency Trauma & Stabilization'),
        isOr ? 'ପ୍ରସୂତି ଓ ନବଜାତ ଶିଶୁ କେୟାର (SNCU)' : (isHi ? 'प्रसूति एवं नवजात शिशु (SNCU)' : 'Obstetric & Newborn Care (SNCU)'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା ଓ ଅର୍ଥୋପେଡିକ୍ସ' : (isHi ? 'सामान्य शल्य एवं ऑर्थोपेडिक्स' : 'General Surgery & Orthopedics')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା କୃଷି ଶ୍ରମିକ ଟ୍ରମା ଓ ସାପ କାମୁଡ଼ା ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'पश्चिमी ओडिशा कृषि श्रमिक ट्रॉमा प्रबंधन।' : 'Western Odisha agricultural trauma & snakebite management protocol.'),
      counter: 'Emergency OPD, Counter 01',
      coordinator: 'CDMO Bargarh Office',
      badgeColor: 'from-lime-600 to-emerald-700'
    },

    // ================= 15. BHADRAK =================
    {
      id: 'HOSP-29',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଭଦ୍ରକ (DHH Bhadrak)' : (isHi ? 'जिला मुख्य चिकित्सालय, भद्रक (DHH Bhadrak)' : 'District Headquarters Hospital (DHH), Bhadrak'),
      tier: isOr ? 'ବନ୍ୟା ପ୍ରଭାବିତ ଜିଲ୍ଲା ଜରୁରୀକାଳୀନ ହସ୍ପିଟାଲ୍' : (isHi ? 'बाढ़ प्रभावित जिला आपातकालीन अस्पताल' : 'Flood-Prone District Emergency Hospital'),
      city: 'Bhadrak',
      cityLabel: isOr ? 'ଭଦ୍ରକ' : (isHi ? 'भद्रक' : 'Bhadrak'),
      region: 'Odisha',
      address: isOr ? 'ପୁରୁଣା ବଜାର, ଭଦ୍ରକ, ଓଡ଼ିଶା - ୭୫୬୧୦୦' : (isHi ? 'पुरुना बाजार, भद्रक, ओडिशा - 756100' : 'Puruna Bazar, Bhadrak, Odisha - 756100'),
      phone: '+91 6784 251209',
      totalBeds: 300,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ବନ୍ୟା ଦୁର୍ଯ୍ୟୋଗ ଜରୁରୀକାଳୀନ ବିଭାଗ' : (isHi ? 'बाढ़ आपदा इमरजेंसी विभाग' : 'Flood Disaster Emergency Department'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଆଇସିୟୁ' : (isHi ? 'सामान्य चिकित्सा एवं ICU' : 'General Medicine & ICU'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ (MCH)' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य (MCH)' : 'Maternal & Child Health (MCH)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ବନ୍ୟା ସମୟ ରୋଗୀ ସ୍ଥଳାନ୍ତର ଓ ଜଳଜନିତ ରୋଗ ପ୍ରବନ୍ଧନ।' : (isHi ? 'बाढ़ समय रोगी निकासी एवं जलजनित रोग प्रबंधन।' : 'Flood-season patient evacuation & waterborne disease surge protocol.'),
      counter: 'Emergency Block, Casualty Desk',
      coordinator: 'CDMO Bhadrak Office',
      badgeColor: 'from-cyan-600 to-blue-700'
    },

    // ================= 16. BOUDH =================
    {
      id: 'HOSP-30',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ବୌଦ୍ଧ (DHH Boudh)' : (isHi ? 'जिला मुख्य चिकित्सालय, बौद्ध (DHH Boudh)' : 'District Headquarters Hospital (DHH), Boudh'),
      tier: isOr ? 'ଗ୍ରାମୀଣ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍ ଓ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'ग्रामीण जिला अस्पताल एवं रेफरल केंद्र' : 'Rural District Hospital & Referral Center'),
      city: 'Boudh',
      cityLabel: isOr ? 'ବୌଦ୍ଧ' : (isHi ? 'बौद्ध' : 'Boudh'),
      region: 'Odisha',
      address: isOr ? 'ବୌଦ୍ଧ ସହର, ବୌଦ୍ଧ, ଓଡ଼ିଶା - ୭୬୨୦୧୪' : (isHi ? 'बौद्ध शहर, ओडिशा - 762014' : 'Boudh Town, Boudh, Odisha - 762014'),
      phone: '+91 6841 222140',
      totalBeds: 150,
      availableIcuBeds: 3,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଜରୁରୀକାଳୀନ ବିଭାଗ' : (isHi ? 'सामान्य चिकित्सा एवं इमरजेंसी' : 'General Medicine & Emergency'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ एवं नवजात शिशु (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ କେନ୍ଦ୍ର (NRC)' : (isHi ? 'कुपोषण निवारण केंद्र (NRC)' : 'Nutrition Rehabilitation Centre (NRC)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'ग्रामीण मातृ-शिशु स्वास्थ्य रेफरल प्रोटोकॉल।' : 'Rural maternal-child health referral and NRC management protocol.'),
      counter: 'OPD Block, Emergency Counter',
      coordinator: 'CDMO Boudh Office',
      badgeColor: 'from-teal-500 to-green-700'
    },

    // ================= 17. DEOGARH =================
    {
      id: 'HOSP-31',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଦେଓଗଡ଼ (DHH Deogarh)' : (isHi ? 'जिला मुख्य चिकित्सालय, देवगढ़ (DHH Deogarh)' : 'District Headquarters Hospital (DHH), Deogarh'),
      tier: isOr ? 'ଆଦିବାସୀ ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'आदिवासी जिला स्वास्थ्य रेफरल केंद्र' : 'Tribal District Health Referral Center'),
      city: 'Deogarh',
      cityLabel: isOr ? 'ଦେଓଗଡ଼' : (isHi ? 'देवगढ़' : 'Deogarh'),
      region: 'Odisha',
      address: isOr ? 'ଦେଓଗଡ଼ ସହର, ଓଡ଼ିଶା - ୭୬୮୧୦୮' : (isHi ? 'देवगढ़ शहर, ओडिशा - 768108' : 'Deogarh Town, Odisha - 768108'),
      phone: '+91 6641 234222',
      totalBeds: 150,
      availableIcuBeds: 3,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଜରୁରୀକାଳୀନ ଆଇସିୟୁ' : (isHi ? 'सामान्य चिकित्सा एवं आपातकालीन ICU' : 'General Medicine & Emergency ICU'),
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ଡିଜିଜ୍ ୟୁନିଟ୍' : (isHi ? 'सिकल सेल रोग इकाई' : 'Sickle Cell Disease Unit'),
        isOr ? 'ପ୍ରସୂତି ଓ ଶିଶୁ ବିଭାଗ' : (isHi ? 'प्रसूति एवं शिशु विभाग' : 'Obstetrics & Pediatrics')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ ଶିବିର ଓ ସିକିଲ୍ ସେଲ୍ ସ୍କ୍ରୀନିଂ ସହ ରେଫରାଲ୍।' : (isHi ? 'आदिवासी स्वास्थ्य शिविर एवं सिकल सेल स्क्रीनिंग रेफरल।' : 'Tribal health camp & sickle cell screening with fast-track referral.'),
      counter: 'Emergency OPD, Tribal Health Desk',
      coordinator: 'CDMO Deogarh Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    // ================= 18. DHENKANAL =================
    {
      id: 'HOSP-32',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଢେଙ୍କାନାଳ (DHH Dhenkanal)' : (isHi ? 'जिला मुख्य चिकित्सालय, ढेंकानाल (DHH Dhenkanal)' : 'District Headquarters Hospital (DHH), Dhenkanal'),
      tier: isOr ? 'ମଧ୍ୟ ଓଡ଼ିଶା ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'मध्य ओडिशा जिला स्वास्थ्य रेफरल केंद्र' : 'Central Odisha District Health Referral Hub'),
      city: 'Dhenkanal',
      cityLabel: isOr ? 'ଢେଙ୍କାନାଳ' : (isHi ? 'ढेंकानाल' : 'Dhenkanal'),
      region: 'Odisha',
      address: isOr ? 'ଢେଙ୍କାନାଳ ସହର, ଓଡ଼ିଶା - ୭୫୯୦୦୧' : (isHi ? 'ढेंकानाल शहर, ओडिशा - 759001' : 'Dhenkanal Town, Odisha - 759001'),
      phone: '+91 6762 221222',
      totalBeds: 300,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା ବିଭାଗ' : (isHi ? 'इमरजेंसी एवं ट्रॉमा विभाग' : 'Emergency & Trauma Department'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା ଓ ଅର୍ଥୋପେଡିକ୍ସ' : (isHi ? 'सामान्य शल्य एवं ऑर्थोपेडिक्स' : 'General Surgery & Orthopedics'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ एवं नवजात शिशु (SNCU)' : 'Maternal Health & SNCU')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ମଧ୍ୟ ଓଡ଼ିଶା ରୋଡ୍ ଦୁର୍ଘଟଣା ଟ୍ରମା ସ୍ଥିରୀକରଣ ଓ ରେଫରାଲ୍ ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'मध्य ओडिशा सड़क दुर्घटना ट्रॉमा प्रबंधन।' : 'Central Odisha road accident trauma stabilization & referral protocol.'),
      counter: 'Emergency Wing, Counter 01',
      coordinator: 'CDMO Dhenkanal Office',
      badgeColor: 'from-sky-600 to-indigo-700'
    },

    // ================= 19. GAJAPATI / PARALAKHEMUNDI =================
    {
      id: 'HOSP-33',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ପାରଳାଖେମୁଣ୍ଡି (DHH Gajapati)' : (isHi ? 'जिला मुख्य चिकित्सालय, परलाखेमुंडी (DHH Gajapati)' : 'District Headquarters Hospital (DHH), Paralakhemundi'),
      tier: isOr ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶା ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'दक्षिण ओडिशा आदिवासी स्वास्थ्य रेफरल केंद्र' : 'South Odisha Tribal Health Referral Center'),
      city: 'Gajapati',
      cityLabel: isOr ? 'ପାରଳାଖେମୁଣ୍ଡି' : (isHi ? 'परलाखेमुंडी' : 'Paralakhemundi'),
      region: 'Odisha',
      address: isOr ? 'ପାରଳାଖେମୁଣ୍ଡି, ଗଜପତି, ଓଡ଼ିଶା - ୭୬୧୨୦୦' : (isHi ? 'परलाखेमुंडी, गजपति, ओडिशा - 761200' : 'Paralakhemundi, Gajapati, Odisha - 761200'),
      phone: '+91 6815 222333',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଜରୁରୀକାଳୀନ' : (isHi ? 'सामान्य चिकित्सा एवं इमरजेंसी' : 'General Medicine & Emergency'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC) ଓ ଶିଶୁ ବିଭାଗ' : (isHi ? 'कुपोषण निवारण (NRC) एवं शिशु विभाग' : 'Nutrition Rehabilitation (NRC) & Pediatrics'),
        isOr ? 'ମ୍ୟାଲେରିଆ ଓ ସଂକ୍ରାମକ ରୋଗ ୱାର୍ଡ' : (isHi ? 'मलेरिया एवं संक्रामक रोग वार्ड' : 'Malaria & Infectious Disease Ward')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଆଦିବାସୀ ଦୁର୍ଗମ ଅଞ୍ଚଳରୁ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସହ ମ୍ୟାଲେରିଆ ରେଫରାଲ୍।' : (isHi ? 'आदिवासी दुर्गम क्षेत्रों से 108 एम्बुलेंस रेफरल।' : 'Tribal remote area 108 ambulance malaria & malnutrition referral.'),
      counter: 'Emergency Block, Tribal Health Counter',
      coordinator: 'CDMO Gajapati Office',
      badgeColor: 'from-green-600 to-teal-700'
    },

    // ================= 20. JAGATSINGHPUR =================
    {
      id: 'HOSP-34',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଜଗତସିଂହପୁର (DHH Jagatsinghpur)' : (isHi ? 'जिला मुख्य चिकित्सालय, जगतसिंहपुर (DHH Jagatsinghpur)' : 'District Headquarters Hospital (DHH), Jagatsinghpur'),
      tier: isOr ? 'ଉପକୂଳ ଚକ୍ରବାତ-ପ୍ରଭାବିତ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'तटीय चक्रवात-प्रभावित जिला अस्पताल' : 'Coastal Cyclone-Prone District Hospital'),
      city: 'Jagatsinghpur',
      cityLabel: isOr ? 'ଜଗତସିଂହପୁର' : (isHi ? 'जगतसिंहपुर' : 'Jagatsinghpur'),
      region: 'Odisha',
      address: isOr ? 'ଜଗତସିଂହପୁର, ଓଡ଼ିଶା - ୭୫୪୧୦୩' : (isHi ? 'जगतसिंहपुर, ओडिशा - 754103' : 'Jagatsinghpur, Odisha - 754103'),
      phone: '+91 6724 220271',
      totalBeds: 250,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଚକ୍ରବାତ ଦୁର୍ଯ୍ୟୋଗ ଜରୁରୀକାଳୀନ ବିଭାଗ' : (isHi ? 'चक्रवात आपदा इमरजेंसी विभाग' : 'Cyclone Disaster Emergency Department'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଆଇସିୟୁ' : (isHi ? 'सामान्य चिकित्सा एवं ICU' : 'General Medicine & ICU'),
        isOr ? 'ପ୍ରସୂତି ଓ ସ୍ତ୍ରୀ ରୋଗ ବିଭାଗ' : (isHi ? 'प्रसूति एवं स्त्री रोग विभाग' : 'Obstetrics & Gynecology')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଉପକୂଳ ଚକ୍ରବାତ ଦୁର୍ଯ୍ୟୋଗ ରୋଗୀ ସ୍ଥାନାନ୍ତର ଓ ସ୍ଥିରୀକରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'तटीय चक्रवात आपदा रोगी स्थानांतरण प्रोटोकॉल।' : 'Coastal cyclone disaster patient evacuation & stabilization protocol.'),
      counter: 'Emergency Block, Disaster Desk',
      coordinator: 'CDMO Jagatsinghpur Office',
      badgeColor: 'from-blue-600 to-cyan-700'
    },

    // ================= 21. JAJPUR =================
    {
      id: 'HOSP-35',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଯାଜପୁର (DHH Jajpur)' : (isHi ? 'जिला मुख्य चिकित्सालय, जाजपुर (DHH Jajpur)' : 'District Headquarters Hospital (DHH), Jajpur'),
      tier: isOr ? 'ମଧ୍ୟ ଓଡ଼ିଶା ଶିଳ୍ପ ଅଞ୍ଚଳ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'मध्य ओडिशा औद्योगिक क्षेत्र जिला अस्पताल' : 'Central Odisha Industrial Zone District Hospital'),
      city: 'Jajpur',
      cityLabel: isOr ? 'ଯାଜପୁର' : (isHi ? 'जाजपुर' : 'Jajpur'),
      region: 'Odisha',
      address: isOr ? 'ଯାଜପୁର ସହର, ଓଡ଼ିଶା - ୭୫୫୦୦୧' : (isHi ? 'जाजपुर शहर, ओडिशा - 755001' : 'Jajpur Town, Odisha - 755001'),
      phone: '+91 6728 222333',
      totalBeds: 300,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଓ ଦୁର୍ଘଟଣା ବିଭାଗ' : (isHi ? 'इमरजेंसी एवं दुर्घटना विभाग' : 'Emergency & Accident Department'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ (FRU)' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य (FRU)' : 'Maternal & Child Health (FRU)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଶିଳ୍ପ ଦୁର୍ଘଟଣା ଓ ରୋଡ ଟ୍ରମା ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସ୍ଥିରୀକରଣ।' : (isHi ? 'औद्योगिक दुर्घटना एवं सड़क ट्रॉमा त्वरित प्रबंधन।' : 'Industrial accident & road trauma fast-track stabilization.'),
      counter: 'Emergency Wing, Counter 01',
      coordinator: 'CDMO Jajpur Office',
      badgeColor: 'from-slate-600 to-zinc-700'
    },

    // ================= 22. KALAHANDI / BHAWANIPATNA =================
    {
      id: 'HOSP-36',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଭବାନୀପାଟଣା (DHH Kalahandi)' : (isHi ? 'जिला मुख्य चिकित्सालय, भवानीपटना (DHH Kalahandi)' : 'District Headquarters Hospital (DHH), Bhawanipatna'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା ଅପପୁଷ୍ଟି ନିରାକରଣ ଓ ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍' : (isHi ? 'पश्चिमी ओडिशा कुपोषण एवं आदिवासी स्वास्थ्य रेफरल' : 'Western Odisha Malnutrition & Tribal Health Referral Hub'),
      city: 'Kalahandi',
      cityLabel: isOr ? 'ଭବାନୀପାଟଣା' : (isHi ? 'भवानीपटना' : 'Bhawanipatna'),
      region: 'Odisha',
      address: isOr ? 'ଭବାନୀପାଟଣା, କଳାହାଣ୍ଡି, ଓଡ଼ିଶା - ୭୬୬୦୦୧' : (isHi ? 'भवानीपटना, कलाहांडी, ओडिशा - 766001' : 'Bhawanipatna, Kalahandi, Odisha - 766001'),
      phone: '+91 6670 230444',
      totalBeds: 350,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଗୁରୁତର ଅପପୁଷ୍ଟି ପ୍ରବନ୍ଧନ (NRC/SAM)' : (isHi ? 'गंभीर कुपोषण प्रबंधन (NRC/SAM)' : 'Severe Acute Malnutrition Management (NRC/SAM)'),
        isOr ? 'ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ଓ ନବଜାତ ଆଇସିୟୁ (SNCU)' : (isHi ? 'शिशु स्वास्थ्य एवं नवजात ICU (SNCU)' : 'Pediatric Health & Newborn ICU (SNCU)'),
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ରୋଗ ବିଭାଗ' : (isHi ? 'सिकल सेल रोग विभाग' : 'Sickle Cell Disease Unit')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'KBK ଅଞ୍ଚଳ ଅପପୁଷ୍ଟି ଶିଶୁ ଫାଷ୍ଟ-ଟ୍ରାକ ଆଡମିଶନ ଓ NRC ରେଫରାଲ।' : (isHi ? 'KBK क्षेत्र कुपोषित शिशु त्वरित भर्ती एवं NRC रेफरल।' : 'KBK region malnourished child fast-track admission & NRC referral.'),
      counter: 'Emergency OPD, NRC Block',
      coordinator: 'CDMO Kalahandi Office',
      badgeColor: 'from-yellow-600 to-amber-700'
    },

    // ================= 23. KANDHAMAL / PHULBANI =================
    {
      id: 'HOSP-37',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ଫୁଲବାଣୀ (DHH Kandhamal)' : (isHi ? 'जिला मुख्य चिकित्सालय, फूलबाणी (DHH Kandhamal)' : 'District Headquarters Hospital (DHH), Phulbani'),
      tier: isOr ? 'ପାର୍ବତ୍ୟ ଆଦିବାସୀ ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'पहाड़ी आदिवासी जिला स्वास्थ्य केंद्र' : 'Hill Tribal District Health Center'),
      city: 'Kandhamal',
      cityLabel: isOr ? 'ଫୁଲବାଣୀ' : (isHi ? 'फूलबाणी' : 'Phulbani'),
      region: 'Odisha',
      address: isOr ? 'ଫୁଲବାଣୀ, କନ୍ଧମାଳ, ଓଡ଼ିଶା - ୭୬୨୦୦୧' : (isHi ? 'फूलबाणी, कंधमाल, ओडिशा - 762001' : 'Phulbani, Kandhamal, Odisha - 762001'),
      phone: '+91 6842 252222',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା ସ୍ଥିରୀକରଣ' : (isHi ? 'इमरजेंसी एवं ट्रॉमा स्थिरीकरण' : 'Emergency & Trauma Stabilization'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ସଂକ୍ରାମକ ରୋଗ' : (isHi ? 'सामान्य चिकित्सा एवं संक्रामक रोग' : 'General Medicine & Infectious Disease'),
        isOr ? 'ପ୍ରସୂତି ଓ ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (FRU)' : (isHi ? 'प्रसूति एवं मातृ स्वास्थ्य (FRU)' : 'Obstetric & Maternal Health (FRU)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ପାର୍ବତ୍ୟ ଦୁର୍ଗମ ଅଞ୍ଚଳରୁ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସହ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତର।' : (isHi ? 'पहाड़ी दुर्गम क्षेत्रों से 108 एम्बुलेंस इमरजेंसी रेफरल।' : 'Hill terrain 108 ambulance emergency transfer from remote pockets.'),
      counter: 'Emergency Block, Casualty Counter',
      coordinator: 'CDMO Kandhamal Office',
      badgeColor: 'from-emerald-600 to-green-800'
    },

    // ================= 24. KENDRAPARA =================
    {
      id: 'HOSP-38',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, କେନ୍ଦ୍ରାପଡ଼ା (DHH Kendrapara)' : (isHi ? 'जिला मुख्य चिकित्सालय, केंद्रापाड़ा (DHH Kendrapara)' : 'District Headquarters Hospital (DHH), Kendrapara'),
      tier: isOr ? 'ଉପକୂଳ ବନ୍ୟା-ପ୍ରଭାବିତ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'तटीय बाढ़-प्रभावित जिला अस्पताल' : 'Coastal Flood-Affected District Hospital'),
      city: 'Kendrapara',
      cityLabel: isOr ? 'କେନ୍ଦ୍ରାପଡ଼ା' : (isHi ? 'केंद्रापाड़ा' : 'Kendrapara'),
      region: 'Odisha',
      address: isOr ? 'କେନ୍ଦ୍ରାପଡ଼ା ସହର, ଓଡ଼ିଶା - ୭୫୪୨୧୧' : (isHi ? 'केंद्रापाड़ा शहर, ओडिशा - 754211' : 'Kendrapara Town, Odisha - 754211'),
      phone: '+91 6727 232230',
      totalBeds: 250,
      availableIcuBeds: 5,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ବନ୍ୟା ଓ ଚକ୍ରବାତ ଦୁର୍ଯ୍ୟୋଗ ଜରୁରୀ ବିଭାଗ' : (isHi ? 'बाढ़ एवं चक्रवात आपदा इमरजेंसी' : 'Flood & Cyclone Disaster Emergency'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଆଇସିୟୁ' : (isHi ? 'सामान्य चिकित्सा एवं ICU' : 'General Medicine & ICU'),
        isOr ? 'ପ୍ରସୂତି ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'प्रसूति एवं शिशु स्वास्थ्य' : 'Obstetrics & Child Health')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ବନ୍ୟା ସମୟ ଜଳବାହିନୀ ଆମ୍ବୁଲାନ୍ସ ସହ ରୋଗୀ ସ୍ଥାନାନ୍ତର ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'बाढ़ समय नाव एम्बुलेंस सहित रोगी निकासी प्रोटोकॉल।' : 'Flood-season boat ambulance patient evacuation protocol.'),
      counter: 'Emergency Block, Casualty Desk',
      coordinator: 'CDMO Kendrapara Office',
      badgeColor: 'from-blue-500 to-teal-700'
    },

    // ================= 25. MALKANGIRI =================
    {
      id: 'HOSP-39',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ମାଲକାନଗିରି (DHH Malkangiri)' : (isHi ? 'जिला मुख्य चिकित्सालय, मलकानगिरी (DHH Malkangiri)' : 'District Headquarters Hospital (DHH), Malkangiri'),
      tier: isOr ? 'ଦୁର୍ଗମ ଆଦିବାସୀ ବନାଞ୍ଚଳ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'दुर्गम आदिवासी वनांचल जिला अस्पताल' : 'Remote Tribal Forest District Hospital'),
      city: 'Malkangiri',
      cityLabel: isOr ? 'ମାଲକାନଗିରି' : (isHi ? 'मलकानगिरी' : 'Malkangiri'),
      region: 'Odisha',
      address: isOr ? 'ମାଲକାନଗିରି ସହର, ଓଡ଼ିଶା - ୭୬୪୦୪୫' : (isHi ? 'मलकानगिरी शहर, ओडिशा - 764045' : 'Malkangiri Town, Odisha - 764045'),
      phone: '+91 6861 230222',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଫାଲସିପାରମ୍ ମ୍ୟାଲେରିଆ ଗୁରୁତର ୱାର୍ଡ' : (isHi ? 'फाल्सीपेरम मलेरिया गंभीर वार्ड' : 'Severe Falciparum Malaria Ward'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC) ଓ ଶିଶୁ HDU' : (isHi ? 'कुपोषण निवारण (NRC) एवं शिशु HDU' : 'Nutrition Rehabilitation (NRC) & Pediatric HDU'),
        isOr ? 'ସାପ କାମୁଡ଼ା ଓ ବିଷ ପ୍ରବନ୍ଧନ' : (isHi ? 'सर्पदंश एवं विष प्रबंधन' : 'Snakebite & Toxicology Management')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ବନାଞ୍ଚଳ ଦୁର୍ଗମ ଗ୍ରାମରୁ ବୋଟ୍/ହେଲିକପ୍ଟର ସହ ଜରୁରୀ ସ୍ଥାନାନ୍ତର ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'वनांचल दुर्गम ग्रामों से बोट/हेलीकॉप्टर इमरजेंसी रेफरल।' : 'Forest-area remote village boat/helicopter emergency transfer protocol.'),
      counter: 'Emergency Block, Tribal Health Counter',
      coordinator: 'CDMO Malkangiri Office',
      badgeColor: 'from-green-700 to-emerald-900'
    },

    // ================= 26. NABARANGPUR =================
    {
      id: 'HOSP-40',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ନବରଙ୍ଗପୁର (DHH Nabarangpur)' : (isHi ? 'जिला मुख्य चिकित्सालय, नबरंगपुर (DHH Nabarangpur)' : 'District Headquarters Hospital (DHH), Nabarangpur'),
      tier: isOr ? 'KBK ଅଞ୍ଚଳ ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'KBK क्षेत्र आदिवासी स्वास्थ्य रेफरल केंद्र' : 'KBK Region Tribal Health Referral Center'),
      city: 'Nabarangpur',
      cityLabel: isOr ? 'ନବରଙ୍ଗପୁର' : (isHi ? 'नबरंगपुर' : 'Nabarangpur'),
      region: 'Odisha',
      address: isOr ? 'ନବରଙ୍ଗପୁର ସହର, ଓଡ଼ିଶା - ୭୬୪୦୫୯' : (isHi ? 'नबरंगपुर शहर, ओडिशा - 764059' : 'Nabarangpur Town, Odisha - 764059'),
      phone: '+91 6858 222444',
      totalBeds: 250,
      availableIcuBeds: 5,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ସିକିଲ୍ ସେଲ୍ ରୋଗ ଓ ରକ୍ତ ବିଭାଗ' : (isHi ? 'सिकल सेल रोग एवं रक्त विभाग' : 'Sickle Cell Disease & Hematology'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation Centre (NRC)'),
        isOr ? 'ପ୍ରସୂତି ଓ ଜରୁରୀ ସି-ସେକ୍ସନ (FRU)' : (isHi ? 'प्रसूति एवं आपातकालीन सी-सेक्शन (FRU)' : 'Obstetric & Emergency C-Section (FRU)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'KBK ଅଞ୍ଚଳ ସିକିଲ୍ ସେଲ୍ ସ୍କ୍ରୀନିଂ ଓ ଅପପୁଷ୍ଟି ଫାଷ୍ଟ-ଟ୍ରାକ ରେଫରାଲ।' : (isHi ? 'KBK क्षेत्र सिकल सेल स्क्रीनिंग एवं कुपोषण रेफरल।' : 'KBK region sickle cell screening & malnutrition fast-track referral.'),
      counter: 'Emergency OPD, Tribal Health Desk',
      coordinator: 'CDMO Nabarangpur Office',
      badgeColor: 'from-orange-600 to-red-700'
    },

    // ================= 27. NAYAGARH =================
    {
      id: 'HOSP-41',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ନୟାଗଡ଼ (DHH Nayagarh)' : (isHi ? 'जिला मुख्य चिकित्सालय, नयागढ़ (DHH Nayagarh)' : 'District Headquarters Hospital (DHH), Nayagarh'),
      tier: isOr ? 'ମଧ୍ୟ ଓଡ଼ିଶା ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ହସ୍ପିଟାଲ୍' : (isHi ? 'मध्य ओडिशा जिला स्वास्थ्य अस्पताल' : 'Central Odisha District Health Hospital'),
      city: 'Nayagarh',
      cityLabel: isOr ? 'ନୟାଗଡ଼' : (isHi ? 'नयागढ़' : 'Nayagarh'),
      region: 'Odisha',
      address: isOr ? 'ନୟାଗଡ଼ ସହର, ଓଡ଼ିଶା - ୭୫୨୦୬୯' : (isHi ? 'नयागढ़ शहर, ओडिशा - 752069' : 'Nayagarh Town, Odisha - 752069'),
      phone: '+91 6753 252221',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଓ ଟ୍ରମା ସ୍ଥିରୀକରଣ' : (isHi ? 'इमरजेंसी एवं ट्रॉमा स्थिरीकरण' : 'Emergency & Trauma Stabilization'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ଶଲ୍ୟ ବିଭାଗ' : (isHi ? 'सामान्य चिकित्सा एवं शल्य विभाग' : 'General Medicine & Surgery'),
        isOr ? 'ପ୍ରସୂତି ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'प्रसूति एवं शिशु स्वास्थ्य' : 'Obstetrics & Child Health')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ମଧ୍ୟ ଓଡ଼ିଶା ଗ୍ରାମୀଣ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ରେଫରାଲ ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'मध्य ओडिशा ग्रामीण स्वास्थ्य सेवा रेफरल।' : 'Central Odisha rural health service referral protocol.'),
      counter: 'Emergency OPD, Counter 01',
      coordinator: 'CDMO Nayagarh Office',
      badgeColor: 'from-violet-600 to-purple-700'
    },

    // ================= 28. NUAPADA =================
    {
      id: 'HOSP-42',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ନୂଆପଡ଼ା (DHH Nuapada)' : (isHi ? 'जिला मुख्य चिकित्सालय, नुआपाड़ा (DHH Nuapada)' : 'District Headquarters Hospital (DHH), Nuapada'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା KBK ଅଞ୍ଚଳ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'पश्चिमी ओडिशा KBK क्षेत्र जिला अस्पताल' : 'Western Odisha KBK Region District Hospital'),
      city: 'Nuapada',
      cityLabel: isOr ? 'ନୂଆପଡ଼ା' : (isHi ? 'नुआपाड़ा' : 'Nuapada'),
      region: 'Odisha',
      address: isOr ? 'ନୂଆପଡ଼ା ସହର, ଓଡ଼ିଶା - ୭୬୬୧୦୫' : (isHi ? 'नुआपाड़ा शहर, ओडिशा - 766105' : 'Nuapada Town, Odisha - 766105'),
      phone: '+91 6678 222333',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ ଓ ଶିଶୁ HDU' : (isHi ? 'कुपोषण निवारण एवं शिशु HDU' : 'Malnutrition Management & Pediatric HDU'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା ଓ ସଂକ୍ରାମକ ରୋଗ' : (isHi ? 'सामान्य चिकित्सा एवं संक्रामक रोग' : 'General Medicine & Infectious Disease'),
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ ଓ ଜରୁରୀ ସି-ସେକ୍ସନ' : (isHi ? 'मातृ स्वास्थ्य एवं आपातकालीन सी-सेक्शन' : 'Maternal Health & Emergency C-Section')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'KBK ଅଞ୍ଚଳ ଅପପୁଷ୍ଟି ଓ ଗୁରୁତର ମ୍ୟାଲେରିଆ ଫାଷ୍ଟ-ଟ୍ରାକ ଆଡମିଶନ।' : (isHi ? 'KBK क्षेत्र कुपोषण एवं गंभीर मलेरिया त्वरित भर्ती।' : 'KBK region malnutrition & severe malaria fast-track admission.'),
      counter: 'Emergency OPD, NRC Desk',
      coordinator: 'CDMO Nuapada Office',
      badgeColor: 'from-rose-600 to-pink-700'
    },

    // ================= 29. RAYAGADA =================
    {
      id: 'HOSP-43',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ରାୟଗଡ଼ା (DHH Rayagada)' : (isHi ? 'जिला मुख्य चिकित्सालय, रायगड़ा (DHH Rayagada)' : 'District Headquarters Hospital (DHH), Rayagada'),
      tier: isOr ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶା ଆଦିବାସୀ ସ୍ୱାସ୍ଥ୍ୟ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'दक्षिण ओडिशा आदिवासी स्वास्थ्य जिला अस्पताल' : 'South Odisha Tribal Health District Hospital'),
      city: 'Rayagada',
      cityLabel: isOr ? 'ରାୟଗଡ଼ା' : (isHi ? 'रायगड़ा' : 'Rayagada'),
      region: 'Odisha',
      address: isOr ? 'ରାୟଗଡ଼ା ସହର, ଓଡ଼ିଶା - ୭୬୫୦୦୧' : (isHi ? 'रायगड़ा शहर, ओडिशा - 765001' : 'Rayagada Town, Odisha - 765001'),
      phone: '+91 6856 222555',
      totalBeds: 250,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ଫାଲସିପାରମ୍ ମ୍ୟାଲେରିଆ ଗୁରୁତର ୱାର୍ଡ' : (isHi ? 'फाल्सीपेरम मलेरिया गंभीर वार्ड' : 'Severe Falciparum Malaria Ward'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ ଓ ଶିଶୁ SNCU' : (isHi ? 'कुपोषण निवारण एवं नवजात SNCU' : 'Nutrition Rehabilitation & Newborn SNCU'),
        isOr ? 'ସାପ କାମୁଡ଼ା ଓ ବିଷ ପ୍ରବନ୍ଧନ' : (isHi ? 'सर्पदंश एवं विष प्रबंधन' : 'Snakebite & Envenomation Management')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶା ଆଦିବାସୀ ମ୍ୟାଲେରିଆ ଓ ସାପ କାମୁଡ଼ା ଜରୁରୀ ପ୍ରୋଟୋକଲ୍।' : (isHi ? 'दक्षिण ओडिशा आदिवासी मलेरिया एवं सर्पदंश इमरजेंसी प्रोटोकॉल।' : 'South Odisha tribal malaria & snakebite emergency protocol.'),
      counter: 'Emergency Block, Tribal Health Counter',
      coordinator: 'CDMO Rayagada Office',
      badgeColor: 'from-red-600 to-rose-800'
    },

    // ================= 30. SONEPUR / SUBARNAPUR =================
    {
      id: 'HOSP-44',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଜିଲ୍ଲା ମୁଖ୍ୟ ଚିକିତ୍ସାଳୟ, ସୋନପୁର (DHH Sonepur)' : (isHi ? 'जिला मुख्य चिकित्सालय, सोनपुर (DHH Sonepur)' : 'District Headquarters Hospital (DHH), Sonepur'),
      tier: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା ଗ୍ରାମୀଣ ଜିଲ୍ଲା ହସ୍ପିଟାଲ୍' : (isHi ? 'पश्चिमी ओडिशा ग्रामीण जिला अस्पताल' : 'Western Odisha Rural District Hospital'),
      city: 'Sonepur',
      cityLabel: isOr ? 'ସୋନପୁର' : (isHi ? 'सोनपुर' : 'Sonepur'),
      region: 'Odisha',
      address: isOr ? 'ସୋନପୁର ସହର, ସୁବର୍ଣ୍ଣପୁର, ଓଡ଼ିଶା - ୭୬୭୦୧୭' : (isHi ? 'सोनपुर शहर, सुबर्णपुर, ओडिशा - 767017' : 'Sonepur Town, Subarnapur, Odisha - 767017'),
      phone: '+91 6654 220222',
      totalBeds: 200,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଓ ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'इमरजेंसी एवं सामान्य चिकित्सा' : 'Emergency & General Medicine'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା ଓ ଅର୍ଥୋ' : (isHi ? 'सामान्य शल्य एवं ऑर्थो' : 'General Surgery & Orthopedics'),
        isOr ? 'ପ୍ରସୂତି ଓ ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (FRU)' : (isHi ? 'प्रसूति एवं मातृ स्वास्थ्य (FRU)' : 'Obstetric & Maternal Health (FRU)')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ପଶ୍ଚିମ ଓଡ଼ିଶା ଗ୍ରାମୀଣ ଜରୁରୀ ସ୍ୱାସ୍ଥ୍ୟ ସେବା ରେଫରାଲ।' : (isHi ? 'पश्चिमी ओडिशा ग्रामीण आपातकालीन स्वास्थ्य रेफरल।' : 'Western Odisha rural emergency health service referral.'),
      counter: 'Emergency OPD, Counter 01',
      coordinator: 'CDMO Sonepur Office',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    // ================= 31. NEW DELHI (NCR) =================
    {
      id: 'HOSP-45',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଏମ୍ସ ନୂଆଦିଲ୍ଲୀ (AIIMS New Delhi)' : (isHi ? 'एम्स नई दिल्ली (AIIMS New Delhi)' : 'AIIMS New Delhi (All India Institute of Medical Sciences)'),
      tier: isOr ? 'ଭାରତର ସର୍ବୋଚ୍ଚ ଜାତୀୟ ରେଫରାଲ୍ ମେଡିକାଲ୍ ପ୍ରତିଷ୍ଠାନ' : (isHi ? 'भारत का शीर्ष राष्ट्रीय मेडिकल संस्थान' : 'India’s Apex Premier Quaternary Referral Institute'),
      city: 'New Delhi',
      cityLabel: isOr ? 'ନୂଆଦିଲ୍ଲୀ' : (isHi ? 'नई दिल्ली' : 'New Delhi (NCR)'),
      region: 'National',
      address: isOr ? 'ଶ୍ରୀ ଅରବିନ୍ଦୋ ମାର୍ଗ, ଅନସାରୀ ନଗର, ନୂଆଦିଲ୍ଲୀ - ୧୧୦୦୨୯' : (isHi ? 'श्री अरबिंदो मार्ग, अंसारी नगर, नई दिल्ली - 110029' : 'Ansari Nagar, Sri Aurobindo Marg, New Delhi - 110029'),
      phone: '+91 11 26588500 / 26588700',
      totalBeds: 2500,
      availableIcuBeds: 32,
      availableVentilators: 18,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜୟପ୍ରକାଶ ନାରାୟଣ ଆପେକ୍ସ ଟ୍ରମା ସେଣ୍ଟର୍ (JPNATC)' : (isHi ? 'जयप्रकाश नारायण शीर्ष ट्रॉमा सेंटर' : 'JPN Apex Trauma Centre (Level-1 National)'),
        isOr ? 'ଡା. ବି.ଆର୍. ଆମ୍ବେଦକର ରୋଟାରୀ କର୍କଟ ଇନଷ୍ଟିଚ୍ୟୁଟ୍ (IRCH)' : (isHi ? 'बी.आर. अम्बेडकर कैंसर संस्थान (IRCH)' : 'Dr. BRA Institute Rotary Cancer Hospital (IRCH)'),
        isOr ? 'କାର୍ଡିଓ-ନ୍ୟୁରୋ ସାଇନ୍ସ ସେଣ୍ଟର୍ (CNC)' : (isHi ? 'कार्डियो-न्यूरो साइंसेज केंद्र' : 'Cardio-Neuro Sciences Centre (CNC)')
      ],
      schemes: ['PMJAY', 'CGHS', 'RAN'],
      schemeLabels: ['PM-JAY 100% Cashless', 'CGHS Apex', 'National Rare Diseases'],
      protocols: isOr
        ? 'ଜାତୀୟ ସ୍ତରର ସର୍ବୋଚ୍ଚ ଏୟାର ଆମ୍ବୁଲାନ୍ସ ଟ୍ରାନ୍ସଫର୍, ରାଷ୍ଟ୍ରୀୟ ଆରୋଗ୍ୟ ନିଧି (RAN) ସହାୟତା।'
        : (isHi
        ? 'अखिल भारतीय स्तर का सर्वोच्च एयर एम्बुलेंस ट्रांसफर, राष्ट्रीय आरोग्य निधि सहायता।'
        : 'National apex air-ambulance direct reception, accelerated RAN and PM-JAY rare disease clearances.'),
      counter: 'JPN Apex Trauma Centre, Emergency Bay 01',
      coordinator: 'Dr. R. Malhotra (Chief, Trauma Center)',
      badgeColor: 'from-blue-700 to-indigo-900'
    },
    {
      id: 'HOSP-46',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସଫଦରଜଙ୍ଗ ହସ୍ପିଟାଲ୍ ଓ VMMC (Safdarjung Hospital, Delhi)' : (isHi ? 'सफदरजंग अस्पताल एवं वीएमएमसी (New Delhi)' : 'Safdarjung Hospital & VMMC, New Delhi'),
      tier: isOr ? 'କେନ୍ଦ୍ର ସରକାରଙ୍କ ସର୍ବବୃହତ ମଲ୍ଟି-ସ୍ପେଶିଆଲିଟି ସୁପର ହସ୍ପିଟାଲ୍' : (isHi ? 'केंद्र सरकार का विशाल मल्टी-स्पेशियलिटी अस्पताल' : 'Central Government Mega Multi-Specialty & Burn Hub'),
      city: 'New Delhi',
      cityLabel: isOr ? 'ନୂଆଦିଲ୍ଲୀ' : (isHi ? 'नई दिल्ली' : 'New Delhi (NCR)'),
      region: 'National',
      address: isOr ? 'ରିଙ୍ଗ୍ ରୋଡ୍, ସଫଦରଜଙ୍ଗ, ନୂଆଦିଲ୍ଲୀ - ୧୧୦୦୨୯' : (isHi ? 'रिंग रोड, सफदरजंग, नई दिल्ली - 110029' : 'Ring Road, Safdarjung, New Delhi - 110029'),
      phone: '+91 11 26165060',
      totalBeds: 1600,
      availableIcuBeds: 20,
      availableVentilators: 11,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜାତୀୟ ପୋଡ଼ାଘା ଓ ପ୍ଲାଷ୍ଟିକ୍ ସର୍ଜରି ସେଣ୍ଟର୍ (National Burn)' : (isHi ? 'राष्ट्रीय बर्न एवं प्लास्टिक सर्जरी केंद्र' : 'National Apex Burn & Plastic Surgery Centre'),
        isOr ? 'ମଲ୍ଟି-ସ୍ପେଶିଆଲିଟି ସୁପର ଆଇସିୟୁ ବ୍ଲକ୍' : (isHi ? 'सुपर स्पेशियलिटी क्रिटिकल केयर' : 'Super Specialty Critical Care Block')
      ],
      schemes: ['PMJAY', 'CGHS'],
      schemeLabels: ['PM-JAY 100% Cashless', 'CGHS Empaneled'],
      protocols: isOr ? 'ଅତ୍ୟଧିକ ପୋଡ଼ାଘା ଓ ବହୁମୁଖୀ ଆଘାତ ପାଇଁ ଜାତୀୟ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ସେବା।' : (isHi ? 'गंभीर बर्न एवं पॉलीट्रॉमा राष्ट्रीय रेफरल कॉरिडोर।' : 'National burns and polytrauma referral pathway with 24/7 dedicated reception.'),
      counter: 'Emergency Entrance, Super Specialty Block Counter 1',
      coordinator: 'Dr. V. Arya (Medical Superintendent)',
      badgeColor: 'from-slate-800 to-indigo-950'
    },

    // ================= 32. MUMBAI =================
    {
      id: 'HOSP-47',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଟାଟା ମେମୋରିଆଲ୍ କର୍କଟ କେନ୍ଦ୍ର ଓ ACTREC (Mumbai)' : (isHi ? 'टाटा मेमोरियल कैंसर केंद्र एवं एक्ट्रेक (Mumbai)' : 'Tata Memorial Centre & ACTREC, Mumbai'),
      tier: isOr ? 'ଭାରତର ସର୍ବୋଚ୍ଚ ଜାତୀୟ କର୍କଟ ଗବେଷଣା ଓ ଚିକିତ୍ସା କେନ୍ଦ୍ର' : (isHi ? 'भारत का शीर्ष राष्ट्रीय कैंसर अनुसंधान एवं उपचार संस्थान' : 'India’s Apex Comprehensive Cancer Research & Care Hub'),
      city: 'Mumbai',
      cityLabel: isOr ? 'ମୁମ୍ବାଇ' : (isHi ? 'मुंबई' : 'Mumbai'),
      region: 'National',
      address: isOr ? 'ଡା. ଅର୍ନେଷ୍ଟ ବୋର୍ଗେସ୍ ରୋଡ୍, ପରେଲ, ମୁମ୍ବାଇ - ୪୦୦୦୧୨' : (isHi ? 'डॉ. अर्नेस्ट बोर्गेस मार्ग, परेल, मुंबई - 400012' : 'Dr. E Borges Road, Parel, Mumbai - 400012'),
      phone: '+91 22 24177000 / 24177300',
      totalBeds: 700,
      availableIcuBeds: 11,
      availableVentilators: 6,
      specialtyCategory: 'Oncology',
      departments: [
        isOr ? 'ସର୍ଜିକାଲ୍, ମେଡିକାଲ୍ ଓ ହେମାଟୋ-ଅଙ୍କୋଲୋଜି' : (isHi ? 'सर्जिकल, मेडिकल एवं हेमेटो-ऑन्कोलॉजी' : 'Surgical, Medical & Hemato-Oncology'),
        isOr ? 'ବୋନ୍ ମ୍ୟାରୋ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ (BMT Unit)' : (isHi ? 'बोन मैरो ट्रांसप्लांट (BMT)' : 'Bone Marrow Transplant (BMT Unit)'),
        isOr ? 'ପ୍ରୋଟୋନ୍ ବିମ୍ ଓ ନ୍ୟୁକ୍ଲିୟର୍ ମେଡିସିନ୍' : (isHi ? 'प्रोटॉन बीम एवं न्यूक्लियर मेडिसिन' : 'Proton Beam Therapy & Nuclear Medicine')
      ],
      schemes: ['PMJAY', 'RAN', 'BSKY'],
      schemeLabels: ['PM-JAY', 'Rashtriya Arogya Nidhi (RAN)', 'BSKY Oncology Partner'],
      protocols: isOr
        ? 'ଓଡ଼ିଶା ରୋଗୀଙ୍କ ପାଇଁ ବିଶେଷ ସମୀକ୍ଷା, ଡିଜିଟାଲ୍ ହିଷ୍ଟୋପାଥୋଲୋଜି ଟେଲି-ସମୀକ୍ଷା।'
        : (isHi
        ? 'डिजिटल हिस्टोपैथोलॉजी टेली-रिव्यू, पीएम-जय एवं राष्ट्रीय आरोग्य निधि सहायता।'
        : 'Digital histopathology tele-review, accelerated BMT and pediatric leukemia fast-track pathways.'),
      counter: 'Golden Jubilee Block, Emergency Referral Desk',
      coordinator: 'Dr. C. S. Pramesh (Director, Tata Memorial Hospital)',
      badgeColor: 'from-purple-700 to-indigo-900'
    },

    // ================= 33. KOLKATA =================
    {
      id: 'HOSP-48',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଆଇ.ପି.ଜି.ଏମ.ଇ.ଆର୍ ଓ ଏସ.ଏସ.କେ.ଏମ. ହସ୍ପିଟାଲ୍ (SSKM Kolkata)' : (isHi ? 'एसएसकेएम अस्पताल एवं आईपीजीएमईआर (Kolkata)' : 'IPGMER & SSKM Hospital, Kolkata'),
      tier: isOr ? 'ପୂର୍ବ ଭାରତର ସର୍ବୋଚ୍ଚ ସରକାରୀ ସୁପର-ସ୍ପେଶିଆଲିଟି ସଂସ୍ଥାନ' : (isHi ? 'पूर्वी भारत का शीर्ष सरकारी सुपर स्पेशियलिटी अस्पताल' : 'Eastern India Premier Apex Quaternary Referral Center'),
      city: 'Kolkata',
      cityLabel: isOr ? 'କୋଲକାତା' : (isHi ? 'कोलकाता' : 'Kolkata'),
      region: 'National',
      address: isOr ? '୨୪୪, ଆଚାର୍ଯ୍ୟ ଜେ.ସି. ବୋଷ ରୋଡ୍, କୋଲକାତା - ୭୦୦୦୨୦' : (isHi ? '244, आचार्य जे.सी. बोस रोड, कोलकाता - 700020' : '244, AJC Bose Road, Kolkata - 700020'),
      phone: '+91 33 22231589 / 22041100',
      totalBeds: 1800,
      availableIcuBeds: 22,
      availableVentilators: 11,
      specialtyCategory: 'Cardio',
      departments: [
        isOr ? 'ଶମ୍ଭୁ ନାଥ ପଣ୍ଡିତ କାର୍ଡିଓଲୋଜି ଓ କ୍ୟାଥ୍ ଲ୍ୟାବ୍' : (isHi ? 'कार्डियोलॉजी एवं कैथ लैब' : 'Cardiology Sciences & Advanced Cath Lab'),
        isOr ? 'ନ୍ୟୁରୋସାଇନ୍ସ ଓ ଲିଭର୍ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍' : (isHi ? 'न्यूरोसाइंस एवं लिवर ट्रांसप्लांट' : 'School of Digestive & Liver Diseases (SDLD)'),
        isOr ? 'ରୀଜିଓନାଲ୍ ଟ୍ରମା କେୟାର' : (isHi ? 'क्षेत्रीय ट्रॉमा केंद्र' : 'Regional Level-1 Trauma Centre')
      ],
      schemes: ['PMJAY', 'BSKY', 'CGHS'],
      schemeLabels: ['PM-JAY', 'BSKY Referral Corridor', 'CGHS'],
      protocols: isOr
        ? 'ଓଡ଼ିଶା ଉପକୂଳରୁ କୋଲକାତା ତୁରନ୍ତ ଟ୍ରେନ୍/ଏମ୍ବୁଲାନ୍ସ ଟ୍ରାନ୍ସଫର୍ ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'पूर्वी भारत इमरजेंसी कॉरिडोर, लिवर एवं ऑर्गन ट्रांसप्लांट सुविधा।'
        : 'Eastern corridor inter-state emergency transit with dedicated organ transplant clearances.'),
      counter: 'Ronald Ross Building, Emergency Triage Gate',
      coordinator: 'Dr. M. K. Bhattacharya (Medical Superintendent)',
      badgeColor: 'from-blue-700 to-teal-800'
    },

    // ================= 34. HYDERABAD =================
    {
      id: 'HOSP-49',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ନିଜାମ୍ସ ଇନଷ୍ଟିଚ୍ୟୁଟ୍ ଅଫ୍ ମେଡିକାଲ୍ ସାଇନ୍ସେସ୍ (NIMS Hyderabad)' : (isHi ? 'निजाम्स इंस्टीट्यूट ऑफ मेडिकल साइंसेज (NIMS Hyderabad)' : 'Nizam’s Institute of Medical Sciences (NIMS)'),
      tier: isOr ? 'ଦକ୍ଷିଣ ଭାରତର ସର୍ବୋଚ୍ଚ ସ୍ୱୟଂଶାସିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ସଂସ୍ଥାନ' : (isHi ? 'दक्षिण भारत का प्रमुख स्वायत्त सुपर स्पेशियलिटी संस्थान' : 'Autonomous Premier Super-Specialty Apex Medical Institute'),
      city: 'Hyderabad',
      cityLabel: isOr ? 'ହାଇଦ୍ରାବାଦ' : (isHi ? 'हैदराबाद' : 'Hyderabad'),
      region: 'National',
      address: isOr ? 'ପଞ୍ଜାଗୁଟ୍ଟା, ହାଇଦ୍ରାବାଦ, ତେଲେଙ୍ଗାନା - ୫୦୦୦୮୨' : (isHi ? 'पंजागुट्टा, हैदराबाद, तेलंगाना - 500082' : 'Punjagutta, Hyderabad, Telangana - 500082'),
      phone: '+91 40 23489000 / 23489244',
      totalBeds: 1400,
      availableIcuBeds: 18,
      availableVentilators: 9,
      specialtyCategory: 'Nephro',
      departments: [
        isOr ? 'ନେଫ୍ରୋଲୋଜି ଓ କିଡନୀ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟେସନ୍' : (isHi ? 'नेफ्रोलॉजी एवं किडनी ट्रांसप्लांट' : 'Nephrology & Renal Transplantation'),
        isOr ? 'ନ୍ୟୁରୋଲୋଜି ଓ ନ୍ୟୁରୋସର୍ଜରି ଆଇସିୟୁ' : (isHi ? 'न्यूरोलॉजी एवं न्यूरोसर्जरी' : 'Neurology & Neurosurgery ICU'),
        isOr ? 'ରୁମାଟୋଲୋଜି ଓ କ୍ଲିନିକାଲ୍ ଇମ୍ୟୁନୋଲୋଜି' : (isHi ? 'रुमेटोलॉजी एवं क्लिनिकल इम्यूनोलॉजी' : 'Rheumatology & Clinical Immunology')
      ],
      schemes: ['PMJAY', 'CGHS', 'Arogyasri'],
      schemeLabels: ['PM-JAY Empaneled', 'CGHS', 'Inter-State Referral Desk'],
      protocols: isOr
        ? 'ଦକ୍ଷିଣ ଓଡ଼ିଶାରୁ ହାଇଦ୍ରାବାଦ ଏୟାର ଓ ରୋଡ୍ ସ୍ଥାନାନ୍ତରଣ, ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ ପ୍ରୋଟୋକଲ୍।'
        : (isHi
        ? 'अंतर्राज्यीय सुपर-स्पेशियलिटी रेफरल एवं ऑर्गन ट्रांसप्लांट कॉरिडोर।'
        : 'Inter-state super-specialty transfer corridor for renal transplant and complex neurovascular care.'),
      counter: 'Super Specialty Block, Emergency Reception Counter',
      coordinator: 'Dr. N. Satyanarayana (Executive Medical Officer)',
      badgeColor: 'from-teal-700 to-indigo-800'
    },

    // ================= 35. BENGALURU =================
    {
      id: 'HOSP-50',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ନିମହାନ୍ସ ଓ ନାରାୟଣ ହେଲଥ୍ ସିଟି (NIMHANS / Narayana, Bengaluru)' : (isHi ? 'निम्हांस एवं नारायण हेल्थ सिटी (Bengaluru)' : 'NIMHANS & Narayana Health City, Bengaluru'),
      tier: isOr ? 'ଜାତୀୟ ନ୍ୟୁରୋସାଇନ୍ସ ଓ କାର୍ଡିଆକ୍ ସୁପର-ସ୍ପେଶିଆଲିଟି ସଂସ୍ଥାନ' : (isHi ? 'राष्ट्रीय न्यूरोसाइंस एवं कार्डियक सुपर स्पेशियलिटी' : 'National Apex Neurosciences & Quaternary Cardiac Care Complex'),
      city: 'Bengaluru',
      cityLabel: isOr ? 'ବେଙ୍ଗାଲୁରୁ' : (isHi ? 'बेंगलुरु' : 'Bengaluru'),
      region: 'National',
      address: isOr ? 'ହୋସୁର ରୋଡ୍ / ବୋମ୍ମାସନ୍ଦ୍ରା, ବେଙ୍ଗାଲୁରୁ - ୫୬୦୦୨୯' : (isHi ? 'होसुर रोड, बेंगलुरु - 560029' : 'Hosur Road / Bommasandra, Bengaluru - 560029'),
      phone: '+91 80 26995000 / 1800-309-0309',
      totalBeds: 1400,
      availableIcuBeds: 24,
      availableVentilators: 13,
      specialtyCategory: 'Cardio',
      departments: [
        isOr ? 'ଜାତୀୟ ମାନସିକ ସ୍ୱାସ୍ଥ୍ୟ ଓ ନ୍ୟୁରୋସାଇନ୍ସ (NIMHANS)' : (isHi ? 'राष्ट्रीय मानसिक स्वास्थ्य एवं न्यूरोसाइंसेज' : 'Apex Neurosciences, Stroke & Epilepsy (NIMHANS)'),
        isOr ? 'ଶିଶୁ ହୃଦରୋଗ ଓ ହାର୍ଟ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ (Narayana Cardiac)' : (isHi ? 'पीडियाट्रिक कार्डियोलॉजी एवं हार्ट ट्रांसप्लांट' : 'Pediatric Cardiac Surgery & Heart Transplant'),
        isOr ? 'ମଜୁମଦାର ଶ\' କର୍କଟ କେନ୍ଦ୍ର' : (isHi ? 'मजूमदार शॉ कैंसर केंद्र' : 'Mazumdar Shaw Comprehensive Cancer Centre')
      ],
      schemes: ['PMJAY', 'CGHS', 'RAN'],
      schemeLabels: ['PM-JAY', 'CGHS', 'National Quaternary Care'],
      protocols: isOr
        ? 'ଜଟିଳ ଶିଶୁ ହୃଦରୋଗ ଓ ଜଟିଳ ନ୍ୟୁରୋଲୋଜିକାଲ୍ ରୋଗୀଙ୍କ ପାଇଁ ଜାତୀୟ ଫାଷ୍ଟ-ଟ୍ରାକ୍।'
        : (isHi
        ? 'जटिल बाल हृदय रोग एवं न्यूरोलॉजिकल विकारों हेतु राष्ट्रीय रेफरल।'
        : 'National fast-track pediatric cardiac intervention and refractory neurological emergency pathway.'),
      counter: 'Emergency Gate 02, Triage & Cardiac Bay',
      coordinator: 'Dr. Devi Shetty Office / Emergency Triage Team',
      badgeColor: 'from-emerald-700 to-cyan-800'
    },

    // ================= 36. CHENNAI / VELLORE =================
    {
      id: 'HOSP-51',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସି.ଏମ.ସି. ଭେଲୋର ଓ ଆପୋଲୋ ଗ୍ରିମ୍ସ (CMC Vellore / Apollo Chennai)' : (isHi ? 'सीएमसी वेल्लोर एवं अपोलो ग्रीम्स (Chennai/Vellore)' : 'Christian Medical College (CMC) Vellore & Apollo Greams, Chennai'),
      tier: isOr ? 'ଭାରତର ପ୍ରମୁଖ କ୍ୱାଟରନାରୀ କ୍ଲିନିକାଲ୍ ଏକ୍ସିଲେନ୍ସ ଓ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ ହବ୍' : (isHi ? 'भारत का शीर्ष चतुर्थक क्लिनिकल उत्कृष्टता एवं प्रत्यारोपण केंद्र' : 'India’s Legendary Quaternary Clinical Excellence & Transplant Hub'),
      city: 'Chennai',
      cityLabel: isOr ? 'ଚେନ୍ନାଇ / ଭେଲୋର' : (isHi ? 'चेन्नई / वेल्लोर' : 'Chennai / Vellore'),
      region: 'National',
      address: isOr ? 'ଇଡା ସ୍କଡର୍ ରୋଡ୍, ଭେଲୋର / ଗ୍ରିମ୍ସ ଲେନ୍, ଚେନ୍ନାଇ - ୬୩୨୦୦୪' : (isHi ? 'वेल्लोर / ग्रीम्स लेन, चेन्नई - 632004' : 'Ida Scudder Road, Vellore / Greams Lane, Chennai - 632004'),
      phone: '+91 416 2281000 / +91 44 28290200',
      totalBeds: 2800,
      availableIcuBeds: 35,
      availableVentilators: 19,
      specialtyCategory: 'Oncology',
      departments: [
        isOr ? 'ହେମାଟୋଲୋଜି, ଥାଲାସେମିଆ ଓ ଷ୍ଟେମ୍ ସେଲ୍ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ' : (isHi ? 'हेमेटोलॉजी, थैलेसीमिया एवं स्टेम सेल ट्रांसप्लांट' : 'Hematology & Bone Marrow/Stem Cell Transplant (CMC)'),
        isOr ? 'ମଲ୍ଟି-ଅର୍ଗାନ୍ ଟ୍ରାନ୍ସପ୍ଲାଣ୍ଟ୍ (Heart, Lung, Liver, Kidney)' : (isHi ? 'मल्टी-ऑर्गन ट्रांसप्लांट' : 'Multi-Organ Solid Transplant Program'),
        isOr ? 'କ୍ଲିନିକାଲ୍ ଇମ୍ୟୁନୋଲୋଜି ଓ ରେୟାର ଡିଜିଜ୍' : (isHi ? 'दुर्लभ रोग एवं क्लिनिकल इम्यूनोलॉजी' : 'Rare Diseases & Quaternary Clinical Diagnostics')
      ],
      schemes: ['PMJAY', 'CGHS', 'RAN'],
      schemeLabels: ['PM-JAY', 'CGHS Empaneled', 'Inter-State Apex Desk'],
      protocols: isOr
        ? 'ପୂର୍ବ ଓଡ଼ିଶାରୁ ଦୀର୍ଘକାଳୀନ ଜଟିଳ ରୋଗୀଙ୍କ ତ୍ୱରିତ ପ୍ରବେଶ, BMT ସ୍ୱତନ୍ତ୍ର ପାସ୍।'
        : (isHi
        ? 'अखिल भारतीय मरीज रेफरल सहायता, दुर्लभ रोग एवं ट्रांसप्लांट प्राथमिकता।'
        : 'Priority interstate desk for diagnostic dilemmas, stem cell transplants, and complex pediatric care.'),
      counter: 'International & Interstate Patient Reception, Counter 01',
      coordinator: 'Dr. J. V. Peter (Director, CMC) / Apollo Triage',
      badgeColor: 'from-rose-700 to-indigo-900'
    }
,

    {
      id: 'HOSP-52',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Balasore)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Balasore)' : 'Sub-Divisional Hospital (SDH), Balasore'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Balasore',
      cityLabel: isOr ? 'Balasore' : (isHi ? 'Balasore' : 'Balasore'),
      region: 'Odisha',
      address: 'Balasore Main Town, Odisha',
      phone: '+91 67453 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Balasore Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-53',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Balasore)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Balasore)' : 'Community Health Centre (CHC Block), Balasore'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Balasore',
      cityLabel: isOr ? 'Balasore' : (isHi ? 'Balasore' : 'Balasore'),
      region: 'Odisha',
      address: 'Block HQ, Balasore, Odisha',
      phone: '+91 67454 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Balasore Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-54',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Koraput)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Koraput)' : 'Sub-Divisional Hospital (SDH), Koraput'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Koraput',
      cityLabel: isOr ? 'Koraput' : (isHi ? 'Koraput' : 'Koraput'),
      region: 'Odisha',
      address: 'Koraput Main Town, Odisha',
      phone: '+91 67455 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Koraput Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-55',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Koraput)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Koraput)' : 'Community Health Centre (CHC Block), Koraput'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Koraput',
      cityLabel: isOr ? 'Koraput' : (isHi ? 'Koraput' : 'Koraput'),
      region: 'Odisha',
      address: 'Block HQ, Koraput, Odisha',
      phone: '+91 67456 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Koraput Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-56',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Puri)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Puri)' : 'Sub-Divisional Hospital (SDH), Puri'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Puri',
      cityLabel: isOr ? 'Puri' : (isHi ? 'Puri' : 'Puri'),
      region: 'Odisha',
      address: 'Puri Main Town, Odisha',
      phone: '+91 67457 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Puri Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-57',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Puri)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Puri)' : 'Community Health Centre (CHC Block), Puri'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Puri',
      cityLabel: isOr ? 'Puri' : (isHi ? 'Puri' : 'Puri'),
      region: 'Odisha',
      address: 'Block HQ, Puri, Odisha',
      phone: '+91 67458 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Puri Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-58',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Baripada)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Baripada)' : 'Sub-Divisional Hospital (SDH), Baripada'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Baripada',
      cityLabel: isOr ? 'Baripada' : (isHi ? 'Baripada' : 'Baripada'),
      region: 'Odisha',
      address: 'Baripada Main Town, Odisha',
      phone: '+91 67459 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Baripada Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-59',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Baripada)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Baripada)' : 'Community Health Centre (CHC Block), Baripada'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Baripada',
      cityLabel: isOr ? 'Baripada' : (isHi ? 'Baripada' : 'Baripada'),
      region: 'Odisha',
      address: 'Block HQ, Baripada, Odisha',
      phone: '+91 67460 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Baripada Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-60',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Bolangir)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Bolangir)' : 'Sub-Divisional Hospital (SDH), Bolangir'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Bolangir',
      cityLabel: isOr ? 'Bolangir' : (isHi ? 'Bolangir' : 'Bolangir'),
      region: 'Odisha',
      address: 'Bolangir Main Town, Odisha',
      phone: '+91 67461 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Bolangir Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-61',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Bolangir)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Bolangir)' : 'Community Health Centre (CHC Block), Bolangir'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Bolangir',
      cityLabel: isOr ? 'Bolangir' : (isHi ? 'Bolangir' : 'Bolangir'),
      region: 'Odisha',
      address: 'Block HQ, Bolangir, Odisha',
      phone: '+91 67462 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Bolangir Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-62',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Keonjhar)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Keonjhar)' : 'Sub-Divisional Hospital (SDH), Keonjhar'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Keonjhar',
      cityLabel: isOr ? 'Keonjhar' : (isHi ? 'Keonjhar' : 'Keonjhar'),
      region: 'Odisha',
      address: 'Keonjhar Main Town, Odisha',
      phone: '+91 67463 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Keonjhar Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-63',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Keonjhar)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Keonjhar)' : 'Community Health Centre (CHC Block), Keonjhar'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Keonjhar',
      cityLabel: isOr ? 'Keonjhar' : (isHi ? 'Keonjhar' : 'Keonjhar'),
      region: 'Odisha',
      address: 'Block HQ, Keonjhar, Odisha',
      phone: '+91 67464 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Keonjhar Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-64',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Jharsuguda)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Jharsuguda)' : 'Sub-Divisional Hospital (SDH), Jharsuguda'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Jharsuguda',
      cityLabel: isOr ? 'Jharsuguda' : (isHi ? 'Jharsuguda' : 'Jharsuguda'),
      region: 'Odisha',
      address: 'Jharsuguda Main Town, Odisha',
      phone: '+91 67465 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Jharsuguda Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-65',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Jharsuguda)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Jharsuguda)' : 'Community Health Centre (CHC Block), Jharsuguda'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Jharsuguda',
      cityLabel: isOr ? 'Jharsuguda' : (isHi ? 'Jharsuguda' : 'Jharsuguda'),
      region: 'Odisha',
      address: 'Block HQ, Jharsuguda, Odisha',
      phone: '+91 67466 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Jharsuguda Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-66',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Angul)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Angul)' : 'Sub-Divisional Hospital (SDH), Angul'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Angul',
      cityLabel: isOr ? 'Angul' : (isHi ? 'Angul' : 'Angul'),
      region: 'Odisha',
      address: 'Angul Main Town, Odisha',
      phone: '+91 67467 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Angul Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-67',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Angul)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Angul)' : 'Community Health Centre (CHC Block), Angul'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Angul',
      cityLabel: isOr ? 'Angul' : (isHi ? 'Angul' : 'Angul'),
      region: 'Odisha',
      address: 'Block HQ, Angul, Odisha',
      phone: '+91 67468 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Angul Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-68',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Bargarh)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Bargarh)' : 'Sub-Divisional Hospital (SDH), Bargarh'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Bargarh',
      cityLabel: isOr ? 'Bargarh' : (isHi ? 'Bargarh' : 'Bargarh'),
      region: 'Odisha',
      address: 'Bargarh Main Town, Odisha',
      phone: '+91 67469 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Bargarh Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-69',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Bargarh)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Bargarh)' : 'Community Health Centre (CHC Block), Bargarh'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Bargarh',
      cityLabel: isOr ? 'Bargarh' : (isHi ? 'Bargarh' : 'Bargarh'),
      region: 'Odisha',
      address: 'Block HQ, Bargarh, Odisha',
      phone: '+91 67470 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Bargarh Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-70',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Bhadrak)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Bhadrak)' : 'Sub-Divisional Hospital (SDH), Bhadrak'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Bhadrak',
      cityLabel: isOr ? 'Bhadrak' : (isHi ? 'Bhadrak' : 'Bhadrak'),
      region: 'Odisha',
      address: 'Bhadrak Main Town, Odisha',
      phone: '+91 67471 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Bhadrak Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-71',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Bhadrak)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Bhadrak)' : 'Community Health Centre (CHC Block), Bhadrak'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Bhadrak',
      cityLabel: isOr ? 'Bhadrak' : (isHi ? 'Bhadrak' : 'Bhadrak'),
      region: 'Odisha',
      address: 'Block HQ, Bhadrak, Odisha',
      phone: '+91 67472 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Bhadrak Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-72',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Boudh)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Boudh)' : 'Sub-Divisional Hospital (SDH), Boudh'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Boudh',
      cityLabel: isOr ? 'Boudh' : (isHi ? 'Boudh' : 'Boudh'),
      region: 'Odisha',
      address: 'Boudh Main Town, Odisha',
      phone: '+91 67473 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Boudh Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-73',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Boudh)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Boudh)' : 'Community Health Centre (CHC Block), Boudh'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Boudh',
      cityLabel: isOr ? 'Boudh' : (isHi ? 'Boudh' : 'Boudh'),
      region: 'Odisha',
      address: 'Block HQ, Boudh, Odisha',
      phone: '+91 67474 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Boudh Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-74',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Deogarh)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Deogarh)' : 'Sub-Divisional Hospital (SDH), Deogarh'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Deogarh',
      cityLabel: isOr ? 'Deogarh' : (isHi ? 'Deogarh' : 'Deogarh'),
      region: 'Odisha',
      address: 'Deogarh Main Town, Odisha',
      phone: '+91 67475 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Deogarh Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-75',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Deogarh)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Deogarh)' : 'Community Health Centre (CHC Block), Deogarh'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Deogarh',
      cityLabel: isOr ? 'Deogarh' : (isHi ? 'Deogarh' : 'Deogarh'),
      region: 'Odisha',
      address: 'Block HQ, Deogarh, Odisha',
      phone: '+91 67476 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Deogarh Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-76',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Dhenkanal)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Dhenkanal)' : 'Sub-Divisional Hospital (SDH), Dhenkanal'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Dhenkanal',
      cityLabel: isOr ? 'Dhenkanal' : (isHi ? 'Dhenkanal' : 'Dhenkanal'),
      region: 'Odisha',
      address: 'Dhenkanal Main Town, Odisha',
      phone: '+91 67477 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Dhenkanal Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-77',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Dhenkanal)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Dhenkanal)' : 'Community Health Centre (CHC Block), Dhenkanal'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Dhenkanal',
      cityLabel: isOr ? 'Dhenkanal' : (isHi ? 'Dhenkanal' : 'Dhenkanal'),
      region: 'Odisha',
      address: 'Block HQ, Dhenkanal, Odisha',
      phone: '+91 67478 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Dhenkanal Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-78',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Gajapati)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Gajapati)' : 'Sub-Divisional Hospital (SDH), Gajapati'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Gajapati',
      cityLabel: isOr ? 'Gajapati' : (isHi ? 'Gajapati' : 'Gajapati'),
      region: 'Odisha',
      address: 'Gajapati Main Town, Odisha',
      phone: '+91 67479 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Gajapati Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-79',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Gajapati)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Gajapati)' : 'Community Health Centre (CHC Block), Gajapati'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Gajapati',
      cityLabel: isOr ? 'Gajapati' : (isHi ? 'Gajapati' : 'Gajapati'),
      region: 'Odisha',
      address: 'Block HQ, Gajapati, Odisha',
      phone: '+91 67480 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Gajapati Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-80',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Jagatsinghpur)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Jagatsinghpur)' : 'Sub-Divisional Hospital (SDH), Jagatsinghpur'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Jagatsinghpur',
      cityLabel: isOr ? 'Jagatsinghpur' : (isHi ? 'Jagatsinghpur' : 'Jagatsinghpur'),
      region: 'Odisha',
      address: 'Jagatsinghpur Main Town, Odisha',
      phone: '+91 67481 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Jagatsinghpur Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-81',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Jagatsinghpur)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Jagatsinghpur)' : 'Community Health Centre (CHC Block), Jagatsinghpur'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Jagatsinghpur',
      cityLabel: isOr ? 'Jagatsinghpur' : (isHi ? 'Jagatsinghpur' : 'Jagatsinghpur'),
      region: 'Odisha',
      address: 'Block HQ, Jagatsinghpur, Odisha',
      phone: '+91 67482 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Jagatsinghpur Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-82',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Jajpur)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Jajpur)' : 'Sub-Divisional Hospital (SDH), Jajpur'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Jajpur',
      cityLabel: isOr ? 'Jajpur' : (isHi ? 'Jajpur' : 'Jajpur'),
      region: 'Odisha',
      address: 'Jajpur Main Town, Odisha',
      phone: '+91 67483 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Jajpur Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-83',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Jajpur)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Jajpur)' : 'Community Health Centre (CHC Block), Jajpur'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Jajpur',
      cityLabel: isOr ? 'Jajpur' : (isHi ? 'Jajpur' : 'Jajpur'),
      region: 'Odisha',
      address: 'Block HQ, Jajpur, Odisha',
      phone: '+91 67484 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Jajpur Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-84',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Kalahandi)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Kalahandi)' : 'Sub-Divisional Hospital (SDH), Kalahandi'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Kalahandi',
      cityLabel: isOr ? 'Kalahandi' : (isHi ? 'Kalahandi' : 'Kalahandi'),
      region: 'Odisha',
      address: 'Kalahandi Main Town, Odisha',
      phone: '+91 67485 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Kalahandi Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-85',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Kalahandi)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Kalahandi)' : 'Community Health Centre (CHC Block), Kalahandi'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Kalahandi',
      cityLabel: isOr ? 'Kalahandi' : (isHi ? 'Kalahandi' : 'Kalahandi'),
      region: 'Odisha',
      address: 'Block HQ, Kalahandi, Odisha',
      phone: '+91 67486 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Kalahandi Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-86',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Kandhamal)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Kandhamal)' : 'Sub-Divisional Hospital (SDH), Kandhamal'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Kandhamal',
      cityLabel: isOr ? 'Kandhamal' : (isHi ? 'Kandhamal' : 'Kandhamal'),
      region: 'Odisha',
      address: 'Kandhamal Main Town, Odisha',
      phone: '+91 67487 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Kandhamal Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-87',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Kandhamal)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Kandhamal)' : 'Community Health Centre (CHC Block), Kandhamal'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Kandhamal',
      cityLabel: isOr ? 'Kandhamal' : (isHi ? 'Kandhamal' : 'Kandhamal'),
      region: 'Odisha',
      address: 'Block HQ, Kandhamal, Odisha',
      phone: '+91 67488 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Kandhamal Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-88',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Kendrapara)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Kendrapara)' : 'Sub-Divisional Hospital (SDH), Kendrapara'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Kendrapara',
      cityLabel: isOr ? 'Kendrapara' : (isHi ? 'Kendrapara' : 'Kendrapara'),
      region: 'Odisha',
      address: 'Kendrapara Main Town, Odisha',
      phone: '+91 67489 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Kendrapara Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-89',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Kendrapara)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Kendrapara)' : 'Community Health Centre (CHC Block), Kendrapara'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Kendrapara',
      cityLabel: isOr ? 'Kendrapara' : (isHi ? 'Kendrapara' : 'Kendrapara'),
      region: 'Odisha',
      address: 'Block HQ, Kendrapara, Odisha',
      phone: '+91 67490 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Kendrapara Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-90',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Malkangiri)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Malkangiri)' : 'Sub-Divisional Hospital (SDH), Malkangiri'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Malkangiri',
      cityLabel: isOr ? 'Malkangiri' : (isHi ? 'Malkangiri' : 'Malkangiri'),
      region: 'Odisha',
      address: 'Malkangiri Main Town, Odisha',
      phone: '+91 67491 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Malkangiri Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-91',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Malkangiri)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Malkangiri)' : 'Community Health Centre (CHC Block), Malkangiri'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Malkangiri',
      cityLabel: isOr ? 'Malkangiri' : (isHi ? 'Malkangiri' : 'Malkangiri'),
      region: 'Odisha',
      address: 'Block HQ, Malkangiri, Odisha',
      phone: '+91 67492 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Malkangiri Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-92',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Nabarangpur)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Nabarangpur)' : 'Sub-Divisional Hospital (SDH), Nabarangpur'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Nabarangpur',
      cityLabel: isOr ? 'Nabarangpur' : (isHi ? 'Nabarangpur' : 'Nabarangpur'),
      region: 'Odisha',
      address: 'Nabarangpur Main Town, Odisha',
      phone: '+91 67493 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Nabarangpur Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-93',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Nabarangpur)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Nabarangpur)' : 'Community Health Centre (CHC Block), Nabarangpur'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Nabarangpur',
      cityLabel: isOr ? 'Nabarangpur' : (isHi ? 'Nabarangpur' : 'Nabarangpur'),
      region: 'Odisha',
      address: 'Block HQ, Nabarangpur, Odisha',
      phone: '+91 67494 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Nabarangpur Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-94',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Nayagarh)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Nayagarh)' : 'Sub-Divisional Hospital (SDH), Nayagarh'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Nayagarh',
      cityLabel: isOr ? 'Nayagarh' : (isHi ? 'Nayagarh' : 'Nayagarh'),
      region: 'Odisha',
      address: 'Nayagarh Main Town, Odisha',
      phone: '+91 67495 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Nayagarh Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-95',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Nayagarh)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Nayagarh)' : 'Community Health Centre (CHC Block), Nayagarh'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Nayagarh',
      cityLabel: isOr ? 'Nayagarh' : (isHi ? 'Nayagarh' : 'Nayagarh'),
      region: 'Odisha',
      address: 'Block HQ, Nayagarh, Odisha',
      phone: '+91 67496 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Nayagarh Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-96',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Nuapada)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Nuapada)' : 'Sub-Divisional Hospital (SDH), Nuapada'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Nuapada',
      cityLabel: isOr ? 'Nuapada' : (isHi ? 'Nuapada' : 'Nuapada'),
      region: 'Odisha',
      address: 'Nuapada Main Town, Odisha',
      phone: '+91 67497 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Nuapada Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-97',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Nuapada)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Nuapada)' : 'Community Health Centre (CHC Block), Nuapada'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Nuapada',
      cityLabel: isOr ? 'Nuapada' : (isHi ? 'Nuapada' : 'Nuapada'),
      region: 'Odisha',
      address: 'Block HQ, Nuapada, Odisha',
      phone: '+91 67498 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Nuapada Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-98',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Rayagada)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Rayagada)' : 'Sub-Divisional Hospital (SDH), Rayagada'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Rayagada',
      cityLabel: isOr ? 'Rayagada' : (isHi ? 'Rayagada' : 'Rayagada'),
      region: 'Odisha',
      address: 'Rayagada Main Town, Odisha',
      phone: '+91 67499 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Rayagada Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-99',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Rayagada)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Rayagada)' : 'Community Health Centre (CHC Block), Rayagada'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Rayagada',
      cityLabel: isOr ? 'Rayagada' : (isHi ? 'Rayagada' : 'Rayagada'),
      region: 'Odisha',
      address: 'Block HQ, Rayagada, Odisha',
      phone: '+91 674100 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Rayagada Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-100',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଚିକିତ୍ସାଳୟ (SDH Sonepur)' : (isHi ? 'उप-मंडलीय अस्पताल (SDH Sonepur)' : 'Sub-Divisional Hospital (SDH), Sonepur'),
      tier: isOr ? 'ଉପ-ଖଣ୍ଡୀୟ ଜରୁରୀକାଳୀନ ରେଫରାଲ୍ କେନ୍ଦ୍ର' : (isHi ? 'उप-मंडलीय आपातकालीन रेफरल केंद्र' : 'Sub-Divisional Emergency Referral Center'),
      city: 'Sonepur',
      cityLabel: isOr ? 'Sonepur' : (isHi ? 'Sonepur' : 'Sonepur'),
      region: 'Odisha',
      address: 'Sonepur Main Town, Odisha',
      phone: '+91 674101 22001',
      totalBeds: 150,
      availableIcuBeds: 4,
      availableVentilators: 2,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ମାତୃ ଓ ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ' : (isHi ? 'मातृ एवं शिशु स्वास्थ्य' : 'Maternal & Child Health'),
        isOr ? 'ସାଧାରଣ ଶଲ୍ୟ ଚିକିତ୍ସା' : (isHi ? 'सामान्य शल्य चिकित्सा' : 'General Surgery')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ଗ୍ରାମୀଣ ଅଞ୍ଚଳ ଫାଷ୍ଟ-ଟ୍ରାକ୍ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ରେଫରାଲ୍।' : (isHi ? 'ग्रामीण क्षेत्र 108 एम्बुलेंस रेफरल।' : 'Rural fast-track 108 ambulance referral protocol.'),
      counter: 'Emergency OPD Counter',
      coordinator: 'SDMO Sonepur Office',
      badgeColor: 'from-teal-600 to-emerald-700'
    },

    {
      id: 'HOSP-101',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର (CHC Block Sonepur)' : (isHi ? 'सामुदायिक स्वास्थ्य केंद्र (CHC Block Sonepur)' : 'Community Health Centre (CHC Block), Sonepur'),
      tier: isOr ? 'ଗୋଷ୍ଠୀ ସ୍ତରୀୟ ସ୍ୱାସ୍ଥ୍ୟ ରେଫରାଲ୍ ୟୁନିଟ୍' : (isHi ? 'सामुदायिक स्तरीय स्वास्थ्य रेफरल इकाई' : 'Community-Level First Referral Unit (FRU)'),
      city: 'Sonepur',
      cityLabel: isOr ? 'Sonepur' : (isHi ? 'Sonepur' : 'Sonepur'),
      region: 'Odisha',
      address: 'Block HQ, Sonepur, Odisha',
      phone: '+91 674102 22002',
      totalBeds: 100,
      availableIcuBeds: 3,
      availableVentilators: 1,
      specialtyCategory: 'Pedia',
      departments: [
        isOr ? 'ମାତୃ ସ୍ୱାସ୍ଥ୍ୟ (SNCU)' : (isHi ? 'मातृ स्वास्थ्य (SNCU)' : 'Maternal Health & SNCU'),
        isOr ? 'ଅପପୁଷ୍ଟି ନିରାକରଣ (NRC)' : (isHi ? 'कुपोषण निवारण (NRC)' : 'Nutrition Rehabilitation (NRC)'),
        isOr ? 'ଜରୁରୀକାଳୀନ ଚିକିତ୍ସା' : (isHi ? 'आपातकालीन चिकित्सा' : 'Emergency Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? 'ସମୁଦାୟ ସ୍ୱାସ୍ଥ୍ୟ ସ୍ଥାନାନ୍ତରଣ ଓ ଆୟୁଷ୍ମାନ ସହାୟତା।' : (isHi ? 'सामुदायिक स्वास्थ्य रेफरल एवं आयुष्मान सहायता।' : 'Community health referral & Ayushman assistance protocol.'),
      counter: 'FRU Emergency Desk',
      coordinator: 'BMO Sonepur Office',
      badgeColor: 'from-amber-600 to-orange-700'
    },

    {
      id: 'HOSP-102',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 102 (Balasore)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 102 (Balasore)' : 'Swasthya Mitra Empaneled Hospital-102, Balasore'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Balasore',
      cityLabel: isOr ? 'Balasore' : (isHi ? 'Balasore' : 'Balasore'),
      region: 'Odisha',
      address: 'Medical Zone, Balasore, Odisha',
      phone: '+91 674102 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Balasore',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-103',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 103 (Koraput)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 103 (Koraput)' : 'Swasthya Mitra Empaneled Hospital-103, Koraput'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Koraput',
      cityLabel: isOr ? 'Koraput' : (isHi ? 'Koraput' : 'Koraput'),
      region: 'Odisha',
      address: 'Medical Zone, Koraput, Odisha',
      phone: '+91 674103 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Koraput',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-104',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 104 (Puri)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 104 (Puri)' : 'Swasthya Mitra Empaneled Hospital-104, Puri'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Puri',
      cityLabel: isOr ? 'Puri' : (isHi ? 'Puri' : 'Puri'),
      region: 'Odisha',
      address: 'Medical Zone, Puri, Odisha',
      phone: '+91 674104 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Puri',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-105',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 105 (Baripada)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 105 (Baripada)' : 'Swasthya Mitra Empaneled Hospital-105, Baripada'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Baripada',
      cityLabel: isOr ? 'Baripada' : (isHi ? 'Baripada' : 'Baripada'),
      region: 'Odisha',
      address: 'Medical Zone, Baripada, Odisha',
      phone: '+91 674105 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Baripada',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-106',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 106 (Bolangir)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 106 (Bolangir)' : 'Swasthya Mitra Empaneled Hospital-106, Bolangir'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Bolangir',
      cityLabel: isOr ? 'Bolangir' : (isHi ? 'Bolangir' : 'Bolangir'),
      region: 'Odisha',
      address: 'Medical Zone, Bolangir, Odisha',
      phone: '+91 674106 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Bolangir',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-107',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 107 (Keonjhar)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 107 (Keonjhar)' : 'Swasthya Mitra Empaneled Hospital-107, Keonjhar'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Keonjhar',
      cityLabel: isOr ? 'Keonjhar' : (isHi ? 'Keonjhar' : 'Keonjhar'),
      region: 'Odisha',
      address: 'Medical Zone, Keonjhar, Odisha',
      phone: '+91 674107 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Keonjhar',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-108',
      image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 108 (Jharsuguda)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 108 (Jharsuguda)' : 'Swasthya Mitra Empaneled Hospital-108, Jharsuguda'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Jharsuguda',
      cityLabel: isOr ? 'Jharsuguda' : (isHi ? 'Jharsuguda' : 'Jharsuguda'),
      region: 'Odisha',
      address: 'Medical Zone, Jharsuguda, Odisha',
      phone: '+91 674108 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Jharsuguda',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-109',
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 109 (Angul)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 109 (Angul)' : 'Swasthya Mitra Empaneled Hospital-109, Angul'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Angul',
      cityLabel: isOr ? 'Angul' : (isHi ? 'Angul' : 'Angul'),
      region: 'Odisha',
      address: 'Medical Zone, Angul, Odisha',
      phone: '+91 674109 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Angul',
      badgeColor: 'from-blue-600 to-indigo-700'
    },

    {
      id: 'HOSP-110',
      image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ସହବନ୍ଧିତ ହସ୍ପିଟାଲ୍- 110 (Bargarh)' : (isHi ? 'स्वास्थ्य मित्र संबद्ध अस्पताल- 110 (Bargarh)' : 'Swasthya Mitra Empaneled Hospital-110, Bargarh'),
      tier: isOr ? 'ସହବନ୍ଧିତ ସୁପର-ସ୍ପେଶିଆଲିଟି ହସ୍ପିଟାଲ୍' : (isHi ? 'संबद्ध सुपर-स्पेशियलिटी अस्पताल' : 'Empaneled Super-Specialty Medical Center'),
      city: 'Bargarh',
      cityLabel: isOr ? 'Bargarh' : (isHi ? 'Bargarh' : 'Bargarh'),
      region: 'Odisha',
      address: 'Medical Zone, Bargarh, Odisha',
      phone: '+91 674110 99888',
      totalBeds: 180,
      availableIcuBeds: 5,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ଓ BSKY ସହାୟତା।' : (isHi ? '24x7 आपातकालीन स्थानांतरण एवं BSKY सहायता।' : '24x7 emergency transit & BSKY cashless protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk Bargarh',
      badgeColor: 'from-blue-600 to-indigo-700'
    }
,

    {
      id: 'HOSP-104',
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 104' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 104' : 'Swasthya Mitra Empaneled Hospital-104'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990104',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-105',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 105' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 105' : 'Swasthya Mitra Empaneled Hospital-105'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990105',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-106',
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 106' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 106' : 'Swasthya Mitra Empaneled Hospital-106'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990106',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-107',
      image: 'https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 107' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 107' : 'Swasthya Mitra Empaneled Hospital-107'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990107',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-108',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 108' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 108' : 'Swasthya Mitra Empaneled Hospital-108'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990108',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-109',
      image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 109' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 109' : 'Swasthya Mitra Empaneled Hospital-109'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990109',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    },

    {
      id: 'HOSP-110',
      image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
      name: isOr ? 'ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଅନୁମୋଦିତ ହସ୍ପିଟାଲ୍- 110' : (isHi ? 'स्वास्थ्य मित्र अनुमोदित अस्पताल- 110' : 'Swasthya Mitra Empaneled Hospital-110'),
      tier: isOr ? 'ଜିଲ୍ଲା ସ୍ତରୀୟ ସହବନ୍ଧିତ ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର' : (isHi ? 'जिला स्तरीय संबद्ध स्वास्थ्य केंद्र' : 'District Empaneled Health Facility'),
      city: 'Bhubaneswar',
      cityLabel: isOr ? 'ଭୁବନେଶ୍ୱର' : (isHi ? 'भुवनेश्वर' : 'Bhubaneswar'),
      region: 'Odisha',
      address: 'Empaneled Medical Complex, Odisha',
      phone: '+91 6742 990110',
      totalBeds: 150,
      availableIcuBeds: 6,
      availableVentilators: 3,
      specialtyCategory: 'Trauma',
      departments: [
        isOr ? 'ଜରୁରୀକାଳୀନ ଟ୍ରମା' : (isHi ? 'इमरजेंसी ट्रॉमा' : 'Emergency Trauma'),
        isOr ? 'ସାଧାରଣ ଚିକିତ୍ସା' : (isHi ? 'सामान्य चिकित्सा' : 'General Medicine'),
        isOr ? 'ଆଇସିୟୁ କେୟାର' : (isHi ? 'ICU केयर' : 'ICU Critical Care')
      ],
      schemes: ['BSKY', 'PMJAY'],
      schemeLabels: ['BSKY 100% Cashless', 'PM-JAY'],
      protocols: isOr ? '୨୪x୭ ଜରୁରୀକାଳୀନ ସ୍ଥାନାନ୍ତରଣ ପ୍ରୋଟୋକଲ୍।' : (isHi ? '24x7 आपातकालीन स्थानांतरण प्रोटोकॉल।' : '24x7 emergency transit protocol.'),
      counter: 'Emergency Desk 01',
      coordinator: 'Swasthya Mitra Desk',
      badgeColor: 'from-indigo-600 to-slate-700'
    }
  ];
};
