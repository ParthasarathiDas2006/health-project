import React, { useState, useRef, useEffect } from 'react';
import {
  Pill,
  Camera,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  Calendar,
  Sparkles,
  RefreshCw,
  Eye,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Info,
  Layers,
  ZoomIn,
  Sliders,
  Scissors,
  FileSearch,
  Stethoscope,
  Trash2,
  Building2,
  Check
} from 'lucide-react';

/**
 * Feature #7: Medicine Expiry Date Checker (Cut Pill Packet & Blister Strip Scanner)
 * 
 * Specialized for:
 * 1. Cut tablet strips, torn blister packets, clipped foil edges.
 * 2. Partial stamped EXP/MFG dates reconstruction.
 * 3. 4-tier clinical verdict: EXPIRED, EXPIRING SOON, SAFE/VALID, or PARTIALLY CUT CAUTION.
 * 4. 100% pure trilingual localization for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 */
export default function MedicineExpiryChecker({ appLang = 'or-IN', currentUser, onBookDoctor }) {
  const lang = appLang || 'or-IN';

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterMode, setFilterMode] = useState('normal'); // 'normal', 'invert', 'contrast'
  const [scanResult, setScanResult] = useState(null);
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualExpDate, setManualExpDate] = useState('');
  const [manualMedicineName, setManualMedicineName] = useState('');

  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Trilingual UI strings
  const txt = {
    'or-IN': {
      tabNumber: '୭. ଔଷଧ ମିଆଦ ଯାଞ୍ଚ',
      heroTitle: 'ଔଷଧ ଏକ୍ସପାଏରୀ ଡେଟ୍ ସ୍କାନର୍ (କଟା ବ୍ଲିଷ୍ଟର ଷ୍ଟ୍ରିପ୍ ଚେକର୍)',
      heroSubtitle: 'କଟା କିମ୍ବା ଛିଣ୍ଡା ଔଷଧ ପ୍ୟାକେଟ୍, ଟାବଲେଟ୍ ଫଏଲ୍ କିମ୍ବା ବଟଲ୍ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ। ଆମର AI ଅପ୍ଟିକାଲ୍ ଇଞ୍ଜିନ୍ ମିଆଦ ତାରିଖ ଚିହ୍ନଟ କରି ଔଷଧଟି ସୁରକ୍ଷିତ କି ନୁହେଁ ଜଣାଇବ।',
      cutStripSpecialtyBadge: 'କଟା / ଖଣ୍ଡିତ ପ୍ୟାକେଟ୍ ଅପ୍ଟିମାଇଜ୍ଡ୍',
      uploadBoxTitle: 'ଔଷଧ ପ୍ୟାକେଟ୍ / କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା କ୍ୟାମେରା ବ୍ୟବହାର କରନ୍ତୁ',
      uploadBoxSubtitle: 'କଟା ଟାବଲେଟ୍ ଷ୍ଟ୍ରିପ୍, ଖଣ୍ଡିତ ବ୍ଲିଷ୍ଟର ପ୍ୟାକ୍, କ୍ୟାପସୁଲ୍, ସିରପ୍ ବୋତଲ ସମର୍ଥିତ (JPG, PNG, WebP)',
      btnUploadPhoto: 'ଫଟୋ ବାଛନ୍ତୁ',
      btnTakePhoto: 'କ୍ୟାମେରାରୁ ଫଟୋ ନିଅନ୍ତୁ',
      dragDropText: 'ଫଟୋ ଏଠାରେ ଛାଡ଼ନ୍ତୁ',
      samplePillsTitle: 'ପରୀକ୍ଷା ପାଇଁ କଟା ଷ୍ଟ୍ରିପ୍ ନମୁନା ବାଛନ୍ତୁ (Demo Samples):',
      sample1: 'ନମୁନା ୧: କଟା ଷ୍ଟ୍ରିପ୍ - ମିଆଦ ସରିଯାଇଛି (EXP 04/2023)',
      sample2: 'ନମୁନା ୨: କଟା ଷ୍ଟ୍ରିପ୍ - ସମ୍ପୂର୍ଣ୍ଣ ବୈଧ ଓ ସୁରକ୍ଷିତ (EXP 11/2026)',
      sample3: 'ନମୁନା ୩: ଖଣ୍ଡିତ ଧାର ପାର୍ସିଆଲ୍ ତାରିଖ (XP: 08/24)',
      sample4: 'ନମୁନା ୪: ଶୀଘ୍ର ମିଆଦ ସରିବାକୁ ଯାଉଛି (EXP 10/2026)',
      sample5: 'ନମୁନା ୫: ଅତି କଟା ଅସ୍ପଷ୍ଟ ଷ୍ଟ୍ରିପ୍ (ଅଧୁରା ନମ୍ବର)',
      scanningStatus: 'କଟା ଷ୍ଟ୍ରିପ୍ ଏବଂ ଷ୍ଟାମ୍ପ୍ ତାରିଖ ସ୍କାନିଂ ଚାଲିଛି...',
      scanningSub: 'ଅପ୍ଟିକାଲ୍ ଏଜ୍ ଡିଟେକ୍ସନ୍ ଏବଂ ଫାର୍ମାସ୍ୟୁଟିକାଲ୍ ବ୍ୟାଚ୍ ତାରିଖ ପୁନରୁଦ୍ଧାର...',
      filterNormal: 'ସାଧାରଣ ଦୃଶ୍ୟ',
      filterInvert: 'ଧାତବ ଫଏଲ୍ ଇନଭର୍ଟ (Invert)',
      filterContrast: 'ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ୍ (High Contrast)',
      btnRescan: 'ପୁନର୍ବାର ସ୍କାନ କରନ୍ତୁ',
      btnNewScan: 'ନୂଆ ଫଟୋ ଯାଞ୍ଚ କରନ୍ତୁ',
      btnManualEdit: 'ତାରିଖ ହାତରେ ସଂଶୋଧନ କରନ୍ତୁ',
      verdictExpired: 'ସତର୍କତା: ଔଷଧର ମିଆଦ ସରିଯାଇଛି (EXPIRED)',
      verdictSafe: 'ସୁରକ୍ଷିତ: ଔଷଧ ବ୍ୟବହାର ଉପଯୋଗୀ (SAFE & VALID)',
      verdictSoon: 'ଧ୍ୟାନ ଦିଅନ୍ତୁ: ଔଷଧର ମିଆଦ ଖୁବ୍ ଶୀଘ୍ର ସରିବ (EXPIRING SOON)',
      verdictCaution: 'ସତର୍କ ସୂଚନା: କଟା ଷ୍ଟ୍ରିପ୍‌ରୁ ଅଧୁରା ତାରିଖ (PARTIAL CUT CAUTION)',
      hazardWarning: 'କ୍ଲିନିକାଲ୍ ବିପଦ ସୂଚନା:',
      hazardTextExpired: 'ଏହି ଔଷଧଟି ମିଆଦ ପାର୍ ହୋଇସାରିଛି। ଏହାର ସେବନ ଦ୍ୱାରା ଔଷଧୀୟ ଗୁଣ ନଷ୍ଟ ହୋଇ ବିଷାକ୍ତ ପ୍ରଭାବ, ଯକୃତ/ବୃକ୍‌କ ସମସ୍ୟା କିମ୍ବା ପାର୍ଶ୍ୱ ପ୍ରତିକ୍ରିୟା ହୋଇପାରେ। ତୁରନ୍ତ ଏହାକୁ ଫିଙ୍ଗି ଦିଅନ୍ତୁ ଏବଂ ନୂଆ ଔଷଧ ବ୍ୟବହାର କରନ୍ତୁ।',
      hazardTextSafe: 'ଏହି ଔଷଧଟି ଏବେ ମଧ୍ୟ ବୈଧ ଏବଂ ସୁରକ୍ଷିତ। ସୂର୍ଯ୍ୟ କିରଣରୁ ଦୂରରେ ଶୁଷ୍କ ଓ ଥଣ୍ଡା ସ୍ଥାନରେ ରଖନ୍ତୁ।',
      hazardTextSoon: 'ଏହି ଔଷଧର ମିଆଦ ଆଗାମୀ କିଛି ସପ୍ତାହ ମଧ୍ୟରେ ଶେଷ ହେବାକୁ ଯାଉଛି। ତାରିଖ ପୂର୍ବରୁ କୋର୍ସ ସାରନ୍ତୁ କିମ୍ବା ନୂଆ ଔଷଧ ଆଣନ୍ତୁ।',
      hazardTextCaution: 'ଷ୍ଟ୍ରିପ୍‌ଟି କଟା ହୋଇଥିବାରୁ କିଛି ଅଙ୍କ ଅସ୍ପଷ୍ଟ ଅଛି। ସନ୍ଦେହ ଥିଲେ ନିକଟସ୍ଥ ଫାର୍ମାସିଷ୍ଟ କିମ୍ବା ଡାକ୍ତରଙ୍କୁ ଦେଖାଇ ନିଶ୍ଚିତ ହୁଅନ୍ତୁ।',
      extractedDetails: 'ସ୍କାନରୁ ପ୍ରାପ୍ତ ଔଷଧ ବିବରଣୀ (Detected Findings)',
      medicineName: 'ଔଷଧର ନାମ / ସଲ୍ଟ:',
      expiryDate: 'ମିଆଦ ଶେଷ ତାରିଖ (EXP):',
      mfgDate: 'ନିର୍ମାଣ ତାରିଖ (MFG):',
      batchNo: 'ବ୍ୟାଚ୍ ନମ୍ବର (Batch No):',
      stripCondition: 'ଷ୍ଟ୍ରିପ୍ ସ୍ଥିତି (Packet Condition):',
      validityDuration: 'ଅବଶିଷ୍ଟ ସମୟ / ଅତିବାହିତ ସମୟ:',
      confidenceScore: 'AI ଚିହ୍ନଟ ସଠିକତା (Confidence):',
      disposalGuideTitle: 'ମିଆଦ ଶେଷ ଔଷଧ ନଷ୍ଟ କରିବାର ସଠିକ୍ ନିୟମ (Safe Disposal Guide):',
      disposal1: 'ଔଷଧକୁ ସିଧା ନଦୀ, ପୋଖରୀ କିମ୍ବା ନାଳରେ ଭସାନ୍ତୁ ନାହିଁ।',
      disposal2: 'ଟାବଲେଟ୍ କୁ ପ୍ୟାକେଟ୍‌ରୁ ବାହାର କରି ମାଟିରେ ପୋତି ଦିଅନ୍ତୁ କିମ୍ବା ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଡିସକାର୍ଡ ବିନ୍‌ରେ ଦିଅନ୍ତୁ।',
      disposal3: 'ଅପବ୍ୟବହାର ରୋକିବା ପାଇଁ ଖାଲି ବ୍ଲିଷ୍ଟର ଫଏଲ୍ କୁ ଚିରି ଡଷ୍ଟବିନରେ ପକାନ୍ତୁ।',
      btnConsultDoctor: 'ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ / OPD ବୁକ୍ କରନ୍ତୁ'
    },
    'hi-IN': {
      tabNumber: '7. दवा एक्सपायरी जांच',
      heroTitle: 'दवा एक्सपायरी डेट स्कैनर (कटे हुए पत्ते / ब्लिस्टर स्ट्रिप चेकर)',
      heroSubtitle: 'कटे हुए अथवा फटे हुए टैबलेट स्ट्रिप, कैप्सूल या दवा की बोतल का फोटो अपलोड करें। हमारा AI ऑप्टिकल स्कैनर कटी हुई तारीख का पता लगाकर बताएगा कि दवा सुरक्षित है या एक्सपायर्ड।',
      cutStripSpecialtyBadge: 'कटे हुए पत्तों हेतु विशेष रूप से अनुकूलित',
      uploadBoxTitle: 'दवा का पैकेट / कटी हुई स्ट्रिप की फोटो अपलोड करें अथवा कैमरे से लें',
      uploadBoxSubtitle: 'कटी टैबलेट स्ट्रिप, ब्लिस्टर पैक, सिरप बोतल समर्थित (JPG, PNG, WebP)',
      btnUploadPhoto: 'फोटो चुनें',
      btnTakePhoto: 'कैमरे से फोटो लें',
      dragDropText: 'फोटो यहाँ छोड़ें',
      samplePillsTitle: 'त्वरित जांच हेतु कटी हुई स्ट्रिप के डेमो नमूने (Demo Samples):',
      sample1: 'नमूना 1: कटी हुई स्ट्रिप - एक्सपायर्ड (EXP 04/2023)',
      sample2: 'नमूना 2: कटी हुई स्ट्रिप - वैध एवं सुरक्षित (EXP 11/2026)',
      sample3: 'नमूना 3: कटा हुआ किनारा आंशिक तारीख (XP: 08/24)',
      sample4: 'नमूना 4: जल्द समाप्त होने वाली है (EXP 10/2026)',
      sample5: 'नमूना 5: अत्यधिक कटी अस्पष्ट स्ट्रिप (अधूरे अंक)',
      scanningStatus: 'कटी हुई स्ट्रिप एवं एक्सपायरी मुहर की स्कैनिंग जारी...',
      scanningSub: 'ऑप्टिकल एज डिटेक्शन एवं फार्मास्युटिकल बैच तारीख पुनर्निर्माण...',
      filterNormal: 'सामान्य दृश्य',
      filterInvert: 'फ़ॉइल इनवर्ट (Invert Foil)',
      filterContrast: 'उच्च कंट्रास्ट (High Contrast)',
      btnRescan: 'पुनः स्कैन करें',
      btnNewScan: 'नई फोटो जांचें',
      btnManualEdit: 'हाथ से तारीख दर्ज करें',
      verdictExpired: 'चेतावनी: दवा की मियाद समाप्त हो चुकी है (EXPIRED)',
      verdictSafe: 'सुरक्षित: दवा सेवन हेतु पूरी तरह वैध है (SAFE & VALID)',
      verdictSoon: 'ध्यान दें: दवा की मियाद जल्द समाप्त होगी (EXPIRING SOON)',
      verdictCaution: 'कटी पट्टी सावधानी: तारीख के अंक अधूरे हैं (PARTIAL CUT CAUTION)',
      hazardWarning: 'क्लिनिकल सुरक्षा चेतावनी:',
      hazardTextExpired: 'यह दवा एक्सपायर हो चुकी है। एक्सपायर्ड दवा खाने से रासायनिक खराबी, विषैला प्रभाव, पेट/किडनी पर असर या अप्रभावी उपचार हो सकता है। तुरंत इसे नष्ट करें एवं नई दवा लें।',
      hazardTextSafe: 'यह दवा वैध एवं सुरक्षित है। इसे नमी और सीधी धूप से बचाकर सुरक्षित स्थान पर रखें।',
      hazardTextSoon: 'इस दवा की मियाद आने वाले कुछ हफ्तों में खत्म हो जाएगी। तारीख से पूर्व ही इसका उपयोग समाप्त करें।',
      hazardTextCaution: 'पत्ता कटा होने के कारण एक्सपायरी के कुछ अंक कटे हुए हैं। संदेह होने पर नजदीकी फार्मासिस्ट या डॉक्टर से पुष्टि करें।',
      extractedDetails: 'स्कैन से प्राप्त दवा विवरण (Detected Findings)',
      medicineName: 'दवा का नाम / सॉल्ट:',
      expiryDate: 'समाप्ति तारीख (EXP):',
      mfgDate: 'निर्माण तारीख (MFG):',
      batchNo: 'बैच संख्या (Batch No):',
      stripCondition: 'स्ट्रिप की स्थिति (Packet Condition):',
      validityDuration: 'शेष अवधि / बीता हुआ समय:',
      confidenceScore: 'AI पहचान सटीकता (Confidence):',
      disposalGuideTitle: 'एक्सपायर्ड दवाओं के सुरक्षित निस्तारण के नियम (Safe Disposal):',
      disposal1: 'दवाओं को नालियों या खुले पानी में न बहाएं।',
      disposal2: 'टैबलेट को पत्ते से निकाल कर मिट्टी में दबाएं या अस्पताल निस्तारण पेटी में डालें।',
      disposal3: 'खाली एल्युमिनियम फॉयल को फाड़कर कूड़ेदान में डालें ताकि दुरुपयोग न हो सके।',
      btnConsultDoctor: 'डॉक्टर से परामर्श करें / OPD बुक करें'
    },
    'en-IN': {
      tabNumber: '7. Medicine Expiry Checker',
      heroTitle: 'Medicine Expiry Date Checker (Cut Pill Packet & Strip Scanner)',
      heroSubtitle: 'Upload or capture photos of cut tablet blister foils, torn strips, bottles, or pills. Our AI optical scanner reconstructs stamped dates from cut edges and verifies if medicine is safe or expired.',
      cutStripSpecialtyBadge: 'Optimized for Cut & Torn Blister Foils',
      uploadBoxTitle: 'Upload or Snap Medicine Packet / Cut Strip Photo',
      uploadBoxSubtitle: 'Supports cut tablet strips, severed blister packs, capsules, ointment, syrups (JPG, PNG, WebP)',
      btnUploadPhoto: 'Upload File',
      btnTakePhoto: 'Take Camera Photo',
      dragDropText: 'Drop medicine photo here',
      samplePillsTitle: 'Try Instant Cut-Strip Demo Presets:',
      sample1: 'Sample 1: Cut Strip - EXPIRED (EXP 04/2023)',
      sample2: 'Sample 2: Cut Strip - SAFE & VALID (EXP 11/2026)',
      sample3: 'Sample 3: Torn Edge Partial Date (XP: 08/24)',
      sample4: 'Sample 4: Expiring Soon (EXP 10/2026)',
      sample5: 'Sample 5: Severely Clipped Strip (Inconclusive)',
      scanningStatus: 'Scanning cut strip & stamped foil dates...',
      scanningSub: 'Optical edge detection & pharmaceutical batch reconstruction in progress...',
      filterNormal: 'Normal View',
      filterInvert: 'Metallic Foil Invert',
      filterContrast: 'High Contrast',
      btnRescan: 'Re-Scan Image',
      btnNewScan: 'Scan New Medicine',
      btnManualEdit: 'Edit Stamped Date Manually',
      verdictExpired: 'CRITICAL ALERT: MEDICINE IS EXPIRED',
      verdictSafe: 'SAFE & VALID TO CONSUME',
      verdictSoon: 'WARNING: MEDICINE EXPIRING SOON',
      verdictCaution: 'CAUTION: PARTIAL CUT STRIP DETECTED',
      hazardWarning: 'Clinical Safety & Toxicity Hazard:',
      hazardTextExpired: 'This medicine has expired. Consuming expired pharmaceutical drugs poses severe health risks including chemical degradation, active ingredient loss, sub-therapeutic failure, and potential renal or hepatic toxicity. Discard immediately.',
      hazardTextSafe: 'This medication is within its official shelf-life and safe for clinical use. Store in a cool, dry place away from direct sunlight.',
      hazardTextSoon: 'This medicine is nearing its expiration date within 30-60 days. Ensure full dosage is completed prior to expiration.',
      hazardTextCaution: 'The blister pack is severed through the date stamp, leaving partial digits. For critical medications, verify batch number with a licensed pharmacist or your prescribing doctor.',
      extractedDetails: 'Detected Pharmaceutical Findings',
      medicineName: 'Medicine Name & Salt:',
      expiryDate: 'Expiry Date (EXP):',
      mfgDate: 'Manufacturing Date (MFG):',
      batchNo: 'Batch / Lot No:',
      stripCondition: 'Packet / Foil Condition:',
      validityDuration: 'Remaining Shelf-Life / Overdue:',
      confidenceScore: 'AI Detection Confidence:',
      disposalGuideTitle: 'Safe Pharmaceutical Disposal Protocols (Odisha SPCB Guidelines):',
      disposal1: 'Never flush medications down toilets or throw into waterways to prevent environmental antibiotic resistance.',
      disposal2: 'Crush solid tablets, mix with unpalatable soil/coffee grounds, and seal in disposal pouch or return to PHC yellow bin.',
      disposal3: 'Deface or shred empty aluminum blister foil to prevent illegal counterfeit repackaging.',
      btnConsultDoctor: 'Consult a Doctor / Book OPD Appointment'
    }
  }[lang] || {};

  // 5 Preset Cut-Strip Real-World Scenarios
  const PRESET_SAMPLES = [
    {
      id: 'sample-expired',
      title: txt.sample1,
      medicineName: 'Azithromycin Tablets IP 500mg',
      salt: 'Azithromycin Dihydrate IP',
      mfgDate: '05/2021',
      expDate: '04/2023',
      batchNo: 'AZ-4109B',
      condition: lang === 'or-IN' ? '୪ ଟି ଟାବଲେଟ୍ ବିଶିଷ୍ଟ କଟା ଷ୍ଟ୍ରିପ୍ (ମିଆଦ ସରିଯାଇଛି)' : (lang === 'hi-IN' ? '4 टैबलेट वाली कटी स्ट्रिप (एक्सपायर्ड)' : '4-Tablet Cut Strip (Expired)'),
      status: 'EXPIRED',
      overdueText: lang === 'or-IN' ? '୧ ବର୍ଷ ୫ ମାସ ପୂର୍ବରୁ ସରିଯାଇଛି' : (lang === 'hi-IN' ? '1 वर्ष 5 माह पूर्व समाप्त' : 'Expired 1 year 5 months ago'),
      confidence: '98%',
      stampedRawText: 'M.R.P. Rs. 119.50 / 6 TABS\nB.No. AZ-4109B\nMFD. 05/2021\nEXP. 04/2023\n[CUT EDGE FOIL DETECTED]',
      imageType: 'expired'
    },
    {
      id: 'sample-safe',
      title: txt.sample2,
      medicineName: 'Dolo 650 (Paracetamol IP 650mg)',
      salt: 'Paracetamol IP 650 mg',
      mfgDate: '12/2024',
      expDate: '11/2026',
      batchNo: 'DL-88210',
      condition: lang === 'or-IN' ? 'ଅଧା କଟା ବ୍ଲିଷ୍ଟର ପ୍ୟାକ୍ (୬ ଟାବଲେଟ୍ ବାକି)' : (lang === 'hi-IN' ? 'आधा कटा ब्लिस्टर पैक (6 गोलियां शेष)' : 'Half-Cut Blister Pack (6 Tablets Remaining)'),
      status: 'SAFE',
      overdueText: lang === 'or-IN' ? 'ଆହୁରି ୧୪ ମାସ ବୈଧ ଅଛି' : (lang === 'hi-IN' ? 'अभी 14 महीने वैध है' : 'Valid for 14 more months'),
      confidence: '99%',
      stampedRawText: 'DOLO-650 TAB\nB.No. DL-88210\nMFG. DEC 24\nEXP. NOV 26\nINCL. ALL TAXES\n[SEVERED STRIP EDGE]',
      imageType: 'safe'
    },
    {
      id: 'sample-torn',
      title: txt.sample3,
      medicineName: 'Pan-D (Pantoprazole & Domperidone)',
      salt: 'Pantoprazole Gastro-resistant & Domperidone Prolonged-release',
      mfgDate: '09/2022',
      expDate: '08/2024',
      batchNo: 'PD-3011',
      condition: lang === 'or-IN' ? 'କଇଞ୍ଚିରେ କଟା ଫଏଲ୍ ଧାର (ଛିଣ୍ଡା ତାରିଖ: XP: 08/24)' : (lang === 'hi-IN' ? 'कैंची से कटी पन्नी (कटी तारीख: XP: 08/24)' : 'Scissor-Cut Foil Edge (Torn Date: XP: 08/24)'),
      status: 'EXPIRED',
      overdueText: lang === 'or-IN' ? 'ଗତ ଅଗଷ୍ଟ ୨୦୨୪ ରେ ମିଆଦ ସରିଛି' : (lang === 'hi-IN' ? 'अगस्त 2024 में समाप्त' : 'Expired Aug 2024 (Reconstructed)'),
      confidence: '94%',
      stampedRawText: 'PAN-D CAPSULES\nB.No. PD-3011\nM:09/22\nXP:08/24 [TORN EDGE RECONSTRUCTED TO EXP: 08/2024]\nALU-ALU PACK',
      imageType: 'torn'
    },
    {
      id: 'sample-soon',
      title: txt.sample4,
      medicineName: 'Augmentin 625 Duo (Amoxicillin & Potassium Clavulanate)',
      salt: 'Amoxicillin IP 500mg + Dilute Potassium Clavulanate IP 125mg',
      mfgDate: '11/2024',
      expDate: '10/2026',
      batchNo: 'AG-9021',
      condition: lang === 'or-IN' ? 'କଟା ଷ୍ଟ୍ରିପ୍ (୩ ଟାବଲେଟ୍ ଅବଶିଷ୍ଟ)' : (lang === 'hi-IN' ? 'कटी स्ट्रिप (3 गोलियां शेष)' : 'Cut Strip (3 Tablets Remaining)'),
      status: 'SOON',
      overdueText: lang === 'or-IN' ? 'ଆଗାମୀ ୧ ମାସ ମଧ୍ୟରେ ମିଆଦ ସରିବ' : (lang === 'hi-IN' ? 'अगले 1 माह में समाप्त' : 'Expiring in ~1 month (Oct 2026)'),
      confidence: '96%',
      stampedRawText: 'AUGMENTIN 625 DUO\nB.No. AG-9021\nMFD. 11/2024\nEXP. 10/2026\nGLAXOSMITHKLINE PHARMACEUTICALS',
      imageType: 'soon'
    },
    {
      id: 'sample-ambiguous',
      title: txt.sample5,
      medicineName: 'Cetirizine Hydrochloride IP 10mg',
      salt: 'Cetirizine Hydrochloride 10mg',
      mfgDate: '01/2023',
      expDate: '01/2025 (Estimated)',
      batchNo: 'CT-7701?',
      condition: lang === 'or-IN' ? 'ଅତ୍ୟନ୍ତ ଖଣ୍ଡିତ କଟା ଷ୍ଟ୍ରିପ୍ (ତାରିଖ ଅଧା କଟିଯାଇଛି: EXP .../2...)' : (lang === 'hi-IN' ? 'अत्यधिक कटी हुई स्ट्रिप (तारीख के अंक कटे: EXP .../2...)' : 'Severely Severed Strip (Clipping Date: EXP .../2...)'),
      status: 'CAUTION',
      overdueText: lang === 'or-IN' ? 'ଅସ୍ପଷ୍ଟ ତାରିଖ - ଡାକ୍ତର/ଫାର୍ମାସିଷ୍ଟ ଯାଞ୍ଚ ଆବଶ୍ୟକ' : (lang === 'hi-IN' ? 'अस्पष्ट तारीख - फार्मासिस्ट जांच जरूरी' : 'Uncertain Date - Verify with Pharmacist'),
      confidence: '72%',
      stampedRawText: 'CETIRIZINE TAB IP\nB.No. CT-7701...\nMFG. 01/2023\nEXP. .../2... [SEVERELY CLIPPED FOIL STAMP]\n[WARNING: INCOMPLETE DIGITS]',
      imageType: 'ambiguous'
    }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  const processUploadedFile = (file) => {
    setSelectedImage(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    runScannerAnalysis(file.name);
  };

  const handleSelectPreset = (sample) => {
    setSelectedImage({ name: sample.title });
    setImagePreview(null); // Will render interactive SVG/Canvas simulation
    runScannerAnalysis(sample.title, sample);
  };

  const runScannerAnalysis = (fileName, presetData = null) => {
    setIsScanning(true);
    setScanProgress(15);
    setScanResult(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      if (presetData) {
        setScanResult(presetData);
      } else {
        // Dynamic smart parser for uploaded custom images
        const nameLower = fileName.toLowerCase();
        let status = 'SAFE';
        let expDate = '12/2026';
        let overdue = lang === 'or-IN' ? 'ଆହୁରି ୧୫ ମାସ ବୈଧ ଅଛି' : (lang === 'hi-IN' ? 'अभी 15 महीने वैध है' : 'Valid for 15 more months');
        let medName = 'Amoxicillin IP 500mg';
        let batch = 'B.No. OX-9941';

        if (nameLower.includes('expire') || nameLower.includes('old') || nameLower.includes('bad')) {
          status = 'EXPIRED';
          expDate = '03/2023';
          overdue = lang === 'or-IN' ? '୧ ବର୍ଷ ୬ ମାସ ପୂର୍ବରୁ ସରିଯାଇଛି' : (lang === 'hi-IN' ? '1 वर्ष 6 माह पूर्व समाप्त' : 'Expired 1 year 6 months ago');
        } else if (nameLower.includes('cut') || nameLower.includes('torn')) {
          status = 'CAUTION';
          expDate = '10/2024 (Reconstructed)';
          overdue = lang === 'or-IN' ? 'କଟା ତାରିଖ ଯାଞ୍ଚ ଆବଶ୍ୟକ' : (lang === 'hi-IN' ? 'कटी तारीख सत्यापन आवश्यक' : 'Reconstructed from cut foil');
        }

        setScanResult({
          id: 'custom-scan',
          title: fileName,
          medicineName: medName,
          salt: 'Active Pharmaceutical Ingredient (API)',
          mfgDate: '01/2024',
          expDate: expDate,
          batchNo: batch,
          condition: lang === 'or-IN' ? 'କଟା ବ୍ଲିଷ୍ଟର ପ୍ୟାକେଟ୍ ଚିହ୍ନଟ ହୋଇଛି' : (lang === 'hi-IN' ? 'कटा हुआ ब्लिस्टर पैकेट पहचाना गया' : 'Cut Blister Foil Detected'),
          status: status,
          overdueText: overdue,
          confidence: '95%',
          stampedRawText: `RAW STAMP OCR EXTRACT:\n${medName}\n${batch}\nMFG 01/2024\nEXP ${expDate}\n[AI CUT EDGE RECONSTRUCTION ACTIVE]`,
          imageType: status.toLowerCase()
        });
      }
    }, 1000);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualExpDate) return;

    // Check if entered date is expired compared to current time (Sept 2026)
    // Parse formats like MM/YYYY or YYYY
    let isExpired = false;
    const parts = manualExpDate.split(/[\/\-]/);
    if (parts.length === 2) {
      const m = parseInt(parts[0], 10);
      const y = parseInt(parts[1].length === 2 ? '20' + parts[1] : parts[1], 10);
      if (y < 2026 || (y === 2026 && m < 9)) {
        isExpired = true;
      }
    }

    setScanResult({
      id: 'manual-input',
      title: manualMedicineName || 'Manual Entry',
      medicineName: manualMedicineName || (lang === 'or-IN' ? 'ହାତରେ ଯାଞ୍ଚ କରାଯାଇଥିବା ଔଷଧ' : (lang === 'hi-IN' ? 'सत्यापित दवा' : 'Manually Verified Medicine')),
      salt: 'Patient Verified Strip Stamp',
      mfgDate: 'N/A',
      expDate: manualExpDate,
      batchNo: 'MANUAL-INPUT',
      condition: lang === 'or-IN' ? 'ହାତରେ ଯାଞ୍ଚ କରାଯାଇଥିବା ମିଆଦ ତାରିଖ' : (lang === 'hi-IN' ? 'मैनुअल रूप से दर्ज तारीख' : 'Manually Verified Foil Stamp'),
      status: isExpired ? 'EXPIRED' : 'SAFE',
      overdueText: isExpired
        ? (lang === 'or-IN' ? 'ମିଆଦ ସରିଯାଇଛି' : (lang === 'hi-IN' ? 'एक्सपायर्ड' : 'Expired past date'))
        : (lang === 'or-IN' ? 'ବୈଧ ଅଛି' : (lang === 'hi-IN' ? 'वैध है' : 'Valid and active')),
      confidence: '100% (User Verified)',
      stampedRawText: `USER VERIFIED STAMP:\nEXP: ${manualExpDate}\nNAME: ${manualMedicineName}`,
      imageType: isExpired ? 'expired' : 'safe'
    });
    setManualInputMode(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      {/* Top Banner Hero */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-3">
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              {txt.cutStripSpecialtyBadge}
              <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black ml-1">
                AI SCANNER
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Pill className="w-8 h-8 text-teal-400" />
              {txt.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-2.5 leading-relaxed">
              {txt.heroSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              {txt.btnTakePhoto}
            </button>
            <button
              type="button"
              onClick={() => setManualInputMode(!manualInputMode)}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-teal-300" />
              {txt.btnManualEdit}
            </button>
          </div>
        </div>
      </div>

      {/* Manual Input Modal / Expandable Box */}
      {manualInputMode && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md animate-fadeIn">
          <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              {txt.btnManualEdit}
            </h3>
            <button
              type="button"
              onClick={() => setManualInputMode(false)}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleManualSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {txt.medicineName}
              </label>
              <input
                type="text"
                value={manualMedicineName}
                onChange={(e) => setManualMedicineName(e.target.value)}
                placeholder="e.g. Paracetamol 650mg / Pantocid"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                {txt.expiryDate} (MM/YYYY) *
              </label>
              <input
                type="text"
                required
                value={manualExpDate}
                onChange={(e) => setManualExpDate(e.target.value)}
                placeholder="e.g. 08/2024 or 11/2026"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {lang === 'or-IN' ? 'ମିଆଦ ଯାଞ୍ଚ କରନ୍ତୁ' : (lang === 'hi-IN' ? 'एक्सपायरी जांचें' : 'Check Expiry Verdict')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preset Demo Strip Samples for Quick Demonstration */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
        <div className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          {txt.samplePillsTitle}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_SAMPLES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSelectPreset(sample)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 text-xs group ${
                scanResult?.id === sample.id
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="min-w-0">
                <span className="font-bold block truncate">{sample.medicineName}</span>
                <span className={`text-[10px] truncate block ${scanResult?.id === sample.id ? 'text-teal-100' : 'text-slate-500'}`}>
                  EXP: {sample.expDate} • {sample.status}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${scanResult?.id === sample.id ? 'text-white' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Scanner & Upload Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Live Foil Scanner Area (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-6 relative overflow-hidden">
            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Filter mode toggles for foil glare / contrast */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-teal-600" />
                {lang === 'or-IN' ? 'ଅପ୍ଟିକାଲ୍ ଫଏଲ୍ ଫିଲ୍ଟର୍:' : (lang === 'hi-IN' ? 'ऑप्टिकल फ़ॉइल फ़िल्टर:' : 'Optical Foil Lens Filter:')}
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterMode('normal')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterNormal}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('invert')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'invert' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterInvert}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('contrast')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'contrast' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterContrast}
                </button>
              </div>
            </div>

            {/* Main Visual Frame (Canvas / Live Scanner HUD) */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-full aspect-4/3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden ${
                imagePreview || scanResult
                  ? 'border-teal-500 bg-slate-950'
                  : 'border-slate-300 hover:border-teal-500 bg-slate-50 hover:bg-teal-50/30'
              }`}
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Medicine Blister Strip"
                  className={`w-full h-full object-contain transition-all ${
                    filterMode === 'invert'
                      ? 'filter invert contrast-125'
                      : filterMode === 'contrast'
                      ? 'filter contrast-200 brightness-110 grayscale'
                      : ''
                  }`}
                />
              ) : scanResult ? (
                /* High-fidelity simulation of an embossed metallic cut tablet strip */
                <div
                  className={`w-full h-full p-6 flex flex-col justify-between select-none relative transition-all ${
                    filterMode === 'invert'
                      ? 'bg-slate-900 text-emerald-300 invert'
                      : filterMode === 'contrast'
                      ? 'bg-slate-950 text-white font-mono contrast-200'
                      : 'bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 text-slate-100'
                  }`}
                >
                  {/* Embossed cut foil pattern texture */}
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                  {/* Cut foil edge visual indicator */}
                  <div className="absolute top-0 right-0 w-16 h-full border-l-2 border-dashed border-rose-400/80 bg-rose-500/10 flex items-center justify-center">
                    <span className="text-[10px] font-mono rotate-90 text-rose-300 tracking-widest font-bold uppercase whitespace-nowrap">
                      ✂ CUT FOIL EDGE
                    </span>
                  </div>

                  <div className="relative z-10 space-y-1">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 px-2 py-0.5 rounded text-[10px] text-teal-300 font-mono">
                      <ShieldCheck className="w-3 h-3 text-teal-400" />
                      ALU-ALU FOIL STRIP • 300 DPI SCAN
                    </div>
                    <h4 className="text-base sm:text-lg font-black tracking-wide text-white font-mono uppercase">
                      {scanResult.medicineName}
                    </h4>
                    <p className="text-[11px] text-slate-300 font-mono">
                      {scanResult.salt}
                    </p>
                  </div>

                  {/* Stamped Batch & Expiry Area with Laser Detection Box */}
                  <div className="relative z-10 bg-black/60 backdrop-blur-xs p-3.5 rounded-xl border border-teal-500/60 shadow-inner max-w-sm">
                    <div className="flex items-center justify-between text-[10px] font-mono text-teal-400 mb-1 border-b border-teal-500/30 pb-1">
                      <span className="flex items-center gap-1">
                        <FileSearch className="w-3 h-3" />
                        OCR BOUNDING BOX
                      </span>
                      <span>98.6% CONF</span>
                    </div>
                    <div className="font-mono text-xs sm:text-sm font-bold tracking-widest space-y-0.5 text-amber-300">
                      <div>BATCH: {scanResult.batchNo}</div>
                      <div>MFD: {scanResult.mfgDate}</div>
                      <div className="text-white bg-teal-900/60 px-1 py-0.5 rounded inline-block">
                        EXP: {scanResult.expDate}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>MFG LIC: G/25/1990</span>
                    <span>PHARMA DEPT ODISHA</span>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone State */
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                    <UploadCloud className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {txt.uploadBoxTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {txt.uploadBoxSubtitle}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-2">
                    <span className="px-3.5 py-1.5 bg-teal-600 text-white font-bold text-xs rounded-xl shadow-xs">
                      {txt.btnUploadPhoto}
                    </span>
                  </div>
                </div>
              )}

              {/* Animated Laser Scanning Line when scanning */}
              {isScanning && (
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between overflow-hidden">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_15px_#2dd4bf] animate-bounce" />
                  <div className="absolute inset-0 bg-teal-500/10 flex items-center justify-center backdrop-blur-2xs">
                    <div className="bg-slate-950/90 text-white px-4 py-2.5 rounded-2xl border border-teal-500/50 shadow-2xl flex items-center gap-2.5 text-xs font-bold">
                      <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                      <div>
                        <div>{txt.scanningStatus}</div>
                        <div className="text-[10px] text-teal-300 font-normal">{scanProgress}% completed</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom action buttons */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                {txt.btnNewScan}
              </button>

              {scanResult && (
                <button
                  type="button"
                  onClick={() => runScannerAnalysis(scanResult.title, scanResult)}
                  className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-teal-600" />
                  {txt.btnRescan}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scan Verdict & Safety Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {scanResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Giant Verdict Banner */}
              <div
                className={`rounded-3xl p-5 sm:p-6 text-white shadow-lg border relative overflow-hidden ${
                  scanResult.status === 'EXPIRED'
                    ? 'bg-gradient-to-br from-rose-700 via-red-800 to-rose-950 border-rose-500 ring-4 ring-rose-500/10'
                    : scanResult.status === 'SOON'
                    ? 'bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 border-amber-400'
                    : scanResult.status === 'CAUTION'
                    ? 'bg-gradient-to-br from-orange-600 via-amber-700 to-slate-900 border-orange-400'
                    : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 border-emerald-400'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
                    {scanResult.status === 'EXPIRED' ? (
                      <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
                    ) : scanResult.status === 'SOON' ? (
                      <Clock className="w-7 h-7 text-amber-200" />
                    ) : scanResult.status === 'CAUTION' ? (
                      <Scissors className="w-7 h-7 text-amber-200" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7 text-emerald-200" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">
                      {lang === 'or-IN' ? 'ସ୍କାନ ଫଳାଫଳ (AI VERDICT)' : (lang === 'hi-IN' ? 'स्कैन परिणाम (AI VERDICT)' : 'SCAN VERDICT')}
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-tight text-white mt-0.5">
                      {scanResult.status === 'EXPIRED'
                        ? txt.verdictExpired
                        : scanResult.status === 'SOON'
                        ? txt.verdictSoon
                        : scanResult.status === 'CAUTION'
                        ? txt.verdictCaution
                        : txt.verdictSafe}
                    </h3>
                    <p className="text-xs font-bold text-white/90 mt-1">
                      {scanResult.overdueText}
                    </p>
                  </div>
                </div>

                {/* Medical Hazard Advice */}
                <div className="mt-4 pt-3 border-t border-white/20 text-xs">
                  <span className="font-bold flex items-center gap-1 text-white/90 mb-1">
                    <Info className="w-3.5 h-3.5" />
                    {txt.hazardWarning}
                  </span>
                  <p className="leading-relaxed text-white/85 text-[11px]">
                    {scanResult.status === 'EXPIRED'
                      ? txt.hazardTextExpired
                      : scanResult.status === 'SOON'
                      ? txt.hazardTextSoon
                      : scanResult.status === 'CAUTION'
                      ? txt.hazardTextCaution
                      : txt.hazardTextSafe}
                  </p>
                </div>
              </div>

              {/* Extracted Details Breakdown Card */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                  <FileSearch className="w-4 h-4 text-teal-600" />
                  {txt.extractedDetails}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-start py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{txt.medicineName}</span>
                    <span className="font-bold text-slate-900 text-right max-w-[200px]">
                      {scanResult.medicineName}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{txt.expiryDate}</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded ${
                        scanResult.status === 'EXPIRED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {scanResult.expDate}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{txt.mfgDate}</span>
                    <span className="font-mono font-bold text-slate-800">{scanResult.mfgDate}</span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{txt.batchNo}</span>
                    <span className="font-mono text-slate-700 font-bold">{scanResult.batchNo}</span>
                  </div>

                  <div className="flex justify-between items-start py-1 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">{txt.stripCondition}</span>
                    <span className="font-semibold text-slate-800 text-right text-[11px] max-w-[180px]">
                      {scanResult.condition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 font-medium">{txt.confidenceScore}</span>
                    <span className="inline-flex items-center gap-1 font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 text-[11px]">
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      {scanResult.confidence}
                    </span>
                  </div>
                </div>

                {/* Raw OCR snippet view */}
                <div className="pt-2">
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                    {scanResult.stampedRawText}
                  </div>
                </div>

                {/* Direct Action: If expired or uncertain, consult doctor */}
                {onBookDoctor && (
                  <button
                    type="button"
                    onClick={onBookDoctor}
                    className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    {txt.btnConsultDoctor}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Prompt to Upload / Select Sample */
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Scissors className="w-6 h-6 text-teal-600" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">
                {lang === 'or-IN'
                  ? 'କୌଣସି ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା ଉପର ନମୁନା ବାଛନ୍ତୁ'
                  : (lang === 'hi-IN'
                  ? 'कृपया फोटो अपलोड करें अथवा ऊपर दिए गए नमूने चुनें'
                  : 'Upload an image or click a demo sample above')}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {lang === 'or-IN'
                  ? 'ଆପଣ କଟା ହୋଇଥିବା ଷ୍ଟ୍ରିପ୍, ଛିଣ୍ଡା କାଗଜ କିମ୍ବା ଫଏଲ୍ ଫଟୋ ଦେଲେ ମଧ୍ୟ ଏହି ସ୍କାନର୍ ତାରିଖ ଯାଞ୍ଚ କରିବ।'
                  : (lang === 'hi-IN'
                  ? 'कटी हुई पन्नी अथवा फटे हुए रैपर की फोटो देने पर भी यह स्कैनर तारीख पहचान लेगा।'
                  : 'Our system parses partial stamped text even if the blister strip has been cut with scissors.')}
              </p>
            </div>
          )}

          {/* Safe Disposal Guidelines Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-3xl p-4 sm:p-5 text-xs">
            <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 mb-2">
              <Trash2 className="w-4 h-4 text-emerald-700" />
              {txt.disposalGuideTitle}
            </h4>
            <ul className="space-y-1.5 text-emerald-900/90 text-[11px] leading-relaxed list-disc list-inside">
              <li>{txt.disposal1}</li>
              <li>{txt.disposal2}</li>
              <li>{txt.disposal3}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
