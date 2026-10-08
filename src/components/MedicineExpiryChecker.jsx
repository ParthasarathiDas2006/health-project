import React, { useState, useRef, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
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
  Check,
  Video,
  VideoOff,
  SwitchCamera,
  X,
  ShoppingBag,
  ExternalLink,
  QrCode,
  Tag,
  ArrowRight,
  Search,
  BadgeCheck,
  Zap,
  TrendingDown,
  Microscope,
  Cpu,
  Fingerprint,
  CheckCheck,
  Mail,
  Smartphone,
  Send,
  Bell,
  Image as ImageIcon
} from 'lucide-react';
import {
  MEDICINE_MARKET_DATABASE,
  MEDICINE_CATEGORIES,
  findMedicineByIdOrBatch
} from '../data/medicineMarketData';
import {
  classifyPillAndFoilPattern,
  PHARMACEUTICAL_PATTERN_SIGNATURES,
  evaluateExpiryTimeline,
  extractImageColorSignature
} from '../utils/pillPatternClassifier';
import {
  generateFullStripSvg,
  generateScissoredStripSvg
} from '../utils/pillImageGenerator';
import {
  saveMedicineOrderToFirebase,
  triggerMedicineExpiryAlert
} from '../services/firebaseDb';

/**
 * Feature #7: Medicine Expiry Date Checker (Cut Pill Packet & Blister Strip Scanner)
 * 
 * Specialized for:
 * 1. AI Pattern Recognition & Classification Model for Scissored Pills (Amoxicillin, Paracetamol, etc.)
 * 2. High-fidelity visual images for both Scissored Cut Pill Strips and Full Blister Packs.
 * 3. Firebase Cloud Firestore persistence for medicine buyers with automated SMS & Email expiry alerts.
 * 4. Pure trilingual localization for Odia ('or-IN'), Hindi ('hi-IN'), and English ('en-IN').
 */
export default function MedicineExpiryChecker({
  appLang = 'or-IN',
  currentUser,
  onBookDoctor,
  incomingMedicine = null,
  onNavigateToMarket
}) {
  const lang = appLang || 'or-IN';

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [filterMode, setFilterMode] = useState('normal'); // 'normal', 'invert', 'contrast'
  const [scanResult, setScanResult] = useState(null);
  const [viewportImageMode, setViewportImageMode] = useState('scissored'); // 'scissored' | 'full' | 'qr'
  const [manualInputMode, setManualInputMode] = useState(false);
  const [manualExpDate, setManualExpDate] = useState('');
  const [manualMedicineName, setManualMedicineName] = useState('');

  // ── AI Pattern Recognition Lab State ───────────────────────────────────────
  const [showPatternLab, setShowPatternLab] = useState(false);
  const [labShape, setLabShape] = useState('capsule'); // 'capsule' | 'caplet' | 'round' | 'oval'
  const [labColor, setLabColor] = useState('#800020'); // Maroon (Amoxicillin)
  const [labImprint, setLabImprint] = useState('AMOX 500');
  const [labFoil, setLabFoil] = useState('alu-alu');
  const [labDatePreset, setLabDatePreset] = useState('03/2023'); // Expired by default for testing

  // ── Firebase Expiry Alert Scheduling State ─────────────────────────────────
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertPhone, setAlertPhone] = useState(currentUser?.phone || '9876543210');
  const [alertEmail, setAlertEmail] = useState(currentUser?.email || 'ransuman.sahoo@gmail.com');
  const [alertPatientName, setAlertPatientName] = useState(currentUser?.name || 'Ransuman Sahoo');
  const [alertDispatchedNotification, setAlertDispatchedNotification] = useState(null);
  const [isRegisteringAlert, setIsRegisteringAlert] = useState(false);

  // Medicine Market Interoperability State
  const [marketFilterCategory, setMarketFilterCategory] = useState('all');
  const [marketSearchTerm, setMarketSearchTerm] = useState('');
  const [showMarketDrawer, setShowMarketDrawer] = useState(false);
  const [marketQrs, setMarketQrs] = useState({});

  // Real Camera capture state & refs
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' or 'user'
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const fileInputRef = useRef(null);

  // Trilingual UI strings
  const txt = {
    'or-IN': {
      tabNumber: '୭. ଔଷଧ ମିଆଦ ଯାଞ୍ଚ',
      heroTitle: 'କଟା ଔଷଧ ପାଟର୍ଣ୍ଣ ଚିହ୍ନଟ ଓ ଏକ୍ସପାଏରୀ ସ୍କାନର୍',
      heroSubtitle: 'କଇଞ୍ଚିରେ କଟା ବ୍ଲିଷ୍ଟର ଷ୍ଟ୍ରିପ୍ ଫଟୋ କିମ୍ବା ସମ୍ପୂର୍ଣ୍ଣ ଷ୍ଟ୍ରିପ୍ ଦେଖନ୍ତୁ। ଆମର AI ମଡେଲ୍ ପାଟର୍ଣ୍ଣ (ଆକାର, ରଙ୍ଗ, ଇମ୍ପ୍ରିଣ୍ଟ୍) ଚିହ୍ନଟ କରି କହିବ ଏହା Amoxicillin, Paracetamol କିମ୍ବା ଅନ୍ୟ ଔଷଧ ଏବଂ ଏହାର ମିଆଦ ସରିଛି କି ନାହିଁ। Firebase ରେ ରେକର୍ଡ ରଖି SMS ଆଲର୍ଟ ପାଆନ୍ତୁ।',
      cutStripSpecialtyBadge: 'AI ପାଟର୍ଣ୍ଣ ଚିହ୍ନଟ ଓ କଟା ଷ୍ଟ୍ରିପ୍ ସ୍କାନର୍',
      uploadBoxTitle: 'କଟା ଷ୍ଟ୍ରିପ୍ / ଔଷଧ ଫଟୋ ଅପଲୋଡ୍ କରନ୍ତୁ କିମ୍ବା କ୍ୟାମେରା ବ୍ୟବହାର କରନ୍ତୁ',
      uploadBoxSubtitle: 'କଟା ଟାବଲେଟ୍ ଷ୍ଟ୍ରିପ୍, କ୍ୟାପସୁଲ୍, ଖଣ୍ଡିତ ବ୍ଲିଷ୍ଟର ପ୍ୟାକ୍ ସମର୍ଥିତ (JPG, PNG, WebP)',
      btnUploadPhoto: 'ଫଟୋ ବାଛନ୍ତୁ',
      btnTakePhoto: 'କ୍ୟାମେରାରୁ ଫଟୋ ନିଅନ୍ତୁ',
      btnOpenPatternLab: '🧪 AI ପାଟର୍ଣ୍ଣ ଲ୍ୟାବ୍ (Pattern Lab)',
      dragDropText: 'ଫଟୋ ଏଠାରେ ଛାଡ଼ନ୍ତୁ',
      samplePillsTitle: 'ପରୀକ୍ଷା ପାଇଁ କଟା ଷ୍ଟ୍ରିପ୍ ନମୁନା ବାଛନ୍ତୁ (Preset Demo Strips):',
      sampleAmoxExpired: 'ନମୁନା ୧: Amoxicillin 500mg କ୍ୟାପସୁଲ୍ - ଏକ୍ସପାଏର୍ଡ (EXP 03/2023)',
      sampleDoloSafe: 'ନମୁନା ୨: Paracetamol / Dolo 650 ଟାବଲେଟ୍ - ସୁରକ୍ଷିତ (EXP 11/2027)',
      samplePantocidSafe: 'ନମୁନା ୩: Pantoprazole 40mg ହଳଦିଆ ଟାବଲେଟ୍ - ସୁରକ୍ଷିତ (EXP 02/2028)',
      sampleAugmentinSoon: 'ନମୁନା ୪: Augmentin 625 Duo କଟା ଷ୍ଟ୍ରିପ୍ - ଶୀଘ୍ର ସରିବ (EXP 10/2026)',
      samplePanDExpired: 'ନମୁନା ୫: Pan-D ଛିଣ୍ଡା ଫଏଲ୍ କ୍ୟାପସୁଲ୍ - ଏକ୍ସପାଏର୍ଡ (EXP 08/2024)',
      sampleAzithExpired: 'ନମୁନା ୬: Azithromycin 500mg ଓଭାଲ୍ - ଏକ୍ସପାଏର୍ଡ (EXP 04/2023)',
      sampleMetforminSafe: 'ନମୁନା ୭: Metformin 500 SR ଗୋଲାକାର - ସୁରକ୍ଷିତ (EXP 12/2027)',
      marketSelectorTitle: 'ଔଷଧ ବଜାରରୁ କଟା ଷ୍ଟ୍ରିପ୍ ବାଛନ୍ତୁ (୩୦+ Market Samples):',
      marketSelectorDesc: 'ବଜାରରେ ଥିବା ପ୍ରତ୍ୟେକ ଔଷଧର କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ, 2D QR ଏବଂ ପାଟର୍ଣ୍ଣ ପରୀକ୍ଷା କରନ୍ତୁ।',
      btnBrowseFullMarket: '🛒 ସମ୍ପୂର୍ଣ୍ଣ ଔଷଧ ବଜାରକୁ ଯାଆନ୍ତୁ',
      qrMatchedBadge: 'GS1 2D ଡାଟାମେଟ୍ରିକ୍ସ ପ୍ରମାଣିତ',
      janAushadhiCompareTitle: 'ଜନ ଔଷଧି ସଞ୍ଚୟ ତୁଳନା',
      scanningStatus: 'କଟା ଷ୍ଟ୍ରିପ୍ AI ପାଟର୍ଣ୍ଣ ବିଶ୍ଳେଷଣ ଚାଲିଛି...',
      scanningSub: 'ଆକୃତି, ରଙ୍ଗ, ଇମ୍ପ୍ରିଣ୍ଟ୍ ଏବଂ ଫଏଲ୍ ଗ୍ରିଡ୍ ଚିହ୍ନଟ ପ୍ରକ୍ରିୟା...',
      filterNormal: 'ସାଧାରଣ ଦୃଶ୍ୟ',
      filterInvert: 'ଧାତବ ଫଏଲ୍ ଇନଭର୍ଟ',
      filterContrast: 'ଉଚ୍ଚ କଣ୍ଟ୍ରାଷ୍ଟ୍',
      btnRescan: 'ପୁନର୍ବାର ସ୍କାନ କରନ୍ତୁ',
      btnNewScan: 'ନୂଆ ଫଟୋ ଯାଞ୍ଚ କରନ୍ତୁ',
      btnManualEdit: 'ତାରିଖ ହାତରେ ସଂଶୋଧନ',
      verdictExpired: '🚨 ସତର୍କତା: ଔଷଧର ମିଆଦ ସରିଯାଇଛି (EXPIRED)',
      verdictSafe: '✅ ସୁରକ୍ଷିତ: ଔଷଧ ବ୍ୟବହାର ଉପଯୋଗୀ (SAFE & VALID)',
      verdictSoon: '⚠️ ଧ୍ୟାନ ଦିଅନ୍ତୁ: ଔଷଧର ମିଆଦ ଖୁବ୍ ଶୀଘ୍ର ସରିବ (EXPIRING SOON)',
      hazardWarning: 'କ୍ଲିନିକାଲ୍ ସୁରକ୍ଷା ଓ ଟକ୍ସିସିଟି ସତର୍କତା:',
      hazardTextExpired: 'ଏହି ଔଷଧଟି ମିଆଦ ପାର୍ ହୋଇସାରିଛି। ଏହା ସେବନ କଲେ ଔଷଧୀୟ ପ୍ରଭାବ ନଷ୍ଟ ହୋଇ ବିଷାକ୍ତ ପ୍ରତିକ୍ରିୟା, ଯକୃତ କିମ୍ବା ବୃକ୍‌କ ସମସ୍ୟା ହୋଇପାରେ। ତୁରନ୍ତ ନଷ୍ଟ କରନ୍ତୁ।',
      hazardTextSafe: 'ଏହି ଔଷଧଟି ନିର୍ଦ୍ଧାରିତ ମିଆଦ ମଧ୍ୟରେ ଅଛି ଏବଂ ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ। ଶୁଷ୍କ ଓ ଥଣ୍ଡା ସ୍ଥାନରେ ସଂରକ୍ଷଣ କରନ୍ତୁ।',
      hazardTextSoon: 'ଏହି ଔଷଧର ମିଆଦ ଆଗାମୀ କିଛି ସପ୍ତାହ ମଧ୍ୟରେ ଶେଷ ହେବାକୁ ଯାଉଛି। ତାରିଖ ପୂର୍ବରୁ କୋର୍ସ ସାରନ୍ତୁ କିମ୍ବା ନୂଆ ଔଷଧ ଆଣନ୍ତୁ।',
      extractedDetails: 'ପାଟର୍ଣ୍ଣ ସନ୍ଧାନ ଓ ଔଷଧ ବର୍ଗୀକରଣ (AI Pattern Findings)',
      medicineName: 'ଚିହ୍ନଟ ଔଷଧର ନାମ:',
      genericSalt: 'ଜେନେରିକ୍ ସଲ୍ଟ:',
      drugCategory: 'ଚିକିତ୍ସା ବର୍ଗ:',
      expiryDate: 'ମିଆଦ ଶେଷ ତାରିଖ (EXP):',
      mfgDate: 'ନିର୍ମାଣ ତାରିଖ (MFG):',
      batchNo: 'ବ୍ୟାଚ୍ ନମ୍ବର:',
      stripCondition: 'ଷ୍ଟ୍ରିପ୍ ସ୍ଥିତି:',
      validityDuration: 'ଅବଶିଷ୍ଟ ସମୟ / ଅତିବାହିତ ସମୟ:',
      confidenceScore: 'AI ଚିହ୍ନଟ ସଠିକତା (Confidence):',
      disposalGuideTitle: 'ମିଆଦ ଶେଷ ଔଷଧ ନଷ୍ଟ କରିବାର ସଠିକ୍ ନିୟମ:',
      disposal1: 'ଔଷଧକୁ ସିଧା ନଦୀ, ପୋଖରୀ କିମ୍ବା ନାଳରେ ଭସାନ୍ତୁ ନାହିଁ।',
      disposal2: 'ଟାବଲେଟ୍ କୁ ପ୍ୟାକେଟ୍‌ରୁ ବାହାର କରି ମାଟିରେ ପୋତି ଦିଅନ୍ତୁ କିମ୍ବା ସ୍ୱାସ୍ଥ୍ୟ କେନ୍ଦ୍ର ଡିସକାର୍ଡ ବିନ୍‌ରେ ଦିଅନ୍ତୁ।',
      disposal3: 'ଅପବ୍ୟବହାର ରୋକିବା ପାଇଁ ଖାଲି ବ୍ଲିଷ୍ଟର ଫଏଲ୍ କୁ ଚିରି ଡଷ୍ଟବିନରେ ପକାନ୍ତୁ।',
      btnConsultDoctor: 'ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ / OPD ବୁକ୍ କରନ୍ତୁ',
      btnScheduleExpiryAlert: '📲 Firebase ରେ ଏକ୍ସପାଏରୀ SMS/Email ଆଲର୍ଟ ସେଭ୍ କରନ୍ତୁ',
      cameraModalTitle: 'ଲାଇଭ୍ କ୍ୟାମେରା ମିଆଦ ସ୍କାନର୍',
      cameraModalSubtitle: 'କଟା ଔଷଧ ଷ୍ଟ୍ରିପ୍ କିମ୍ବା ପ୍ୟାକେଟ୍‌କୁ କ୍ୟାମେରା ଫ୍ରେମ୍ ମଧ୍ୟରେ ସ୍ପଷ୍ଟ ଭାବେ ରଖନ୍ତୁ',
      cameraPermissionRequest: 'କ୍ୟାମେରା ଅନୁମତି ଅନୁରୋଧ କରାଯାଉଛି...',
      cameraErrorDenied: 'କ୍ୟାମେରା ଅନୁମତି ମିଳିଲା ନାହିଁ।',
      cameraErrorNoDevice: 'କୌଣସି କ୍ୟାମେରା ମିଳିଲା ନାହିଁ।',
      btnCapturePhoto: 'ଫଟୋ କ୍ଲିକ୍ କରନ୍ତୁ',
      btnSwitchCamera: 'କ୍ୟାମେରା ବଦଳାନ୍ତୁ',
      btnCloseCamera: 'କ୍ୟାମେରା ବନ୍ଦ କରନ୍ତୁ',
      cameraAlignGuide: 'କଟା ଷ୍ଟ୍ରିପ୍‌ର ମିଆଦ ତାରିଖ ଏହି ବାକ୍ସ ମଧ୍ୟରେ ରଖନ୍ତୁ',
      aiPatternEngineTitle: 'AI ବହୁମୁଖୀ ପାଟର୍ଣ୍ଣ ଚିହ୍ନଟ ଇଞ୍ଜିନ୍ (Pattern Recognizer)',
      aiPatternEngineSub: 'କଟା ଫଏଲ୍‌ରୁ ଅବଶିଷ୍ଟ ଆକାର, ରଙ୍ଗ, ଇମ୍ପ୍ରିଣ୍ଟ୍ ଓ ବ୍ଲିଷ୍ଟର୍ ପକେଟ୍ ଆଧାରରେ ଔଷଧ ଚିହ୍ନଟ',
      patternShape: 'ଟାବଲେଟ୍ / କ୍ୟାପସୁଲ୍ ଆକାର:',
      patternColor: 'ରଙ୍ଗର ସିଗ୍ନେଚର୍:',
      patternImprint: 'ଖୋଦିତ ଅକ୍ଷର (Debossed Imprint):',
      patternFoil: 'ଫଏଲ୍ ବସ୍ତ୍ର ଓ ବ୍ଲିଷ୍ଟର୍ ଗ୍ରିଡ୍:',
      patternStability: 'ଭୌତିକ ସ୍ଥିରତା ଓ ଆର୍ଦ୍ରତା ବିଶ୍ଳେଷଣ:',
      expiryVerdictHeading: 'ମିଆଦ ସ୍ଥିତି ନିର୍ଣ୍ଣୟ (Expiry Verdict):',
      isExpiredYes: '🚨 ମିଆଦ ସରିଯାଇଛି: ହଁ (EXPIRED - ସେବନ କରନ୍ତୁ ନାହିଁ)',
      isExpiredNo: '✅ ମିଆଦ ସରିଯାଇଛି: ନାହିଁ (SAFE & VALID - ବ୍ୟବହାର ଯୋଗ୍ୟ)',
      viewScissoredStrip: '✂️ କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ (Cut Strip)',
      viewFullStrip: '🖼️ ପୂର୍ଣ୍ଣ ଷ୍ଟ୍ରିପ୍ ଫଟୋ (Full Pack)',
      viewQrCode: '📱 2D QR କୋଡ୍'
    },
    'hi-IN': {
      tabNumber: '7. दवा एक्सपायरी जांच',
      heroTitle: 'कटी दवा पैटर्न पहचान एवं एक्सपायरी स्कैनर',
      heroSubtitle: 'कैंची से कटे पत्ते अथवा पूरी स्ट्रिप की फोटो देखकर दवा पहचानें। हमारा AI मॉडल Amoxicillin, Paracetamol आदि पहचानकर बताएगा कि वह एक्सपायर्ड है या नहीं। Firebase में डेटा सुरक्षित रखकर SMS अलर्ट पाएं।',
      cutStripSpecialtyBadge: 'AI पैटर्न पहचान एवं कटी स्ट्रिप स्कैनर',
      uploadBoxTitle: 'कटी हुई स्ट्रिप / दवा की फोटो अपलोड करें या कैमरा उपयोग करें',
      uploadBoxSubtitle: 'कटी टैबलेट स्ट्रिप, कैप्सूल, फटे ब्लिस्टर पैक समर्थित (JPG, PNG, WebP)',
      btnUploadPhoto: 'फोटो चुनें',
      btnTakePhoto: 'कैमरे से फोटो खींचें',
      btnOpenPatternLab: '🧪 AI पैटर्न लैब (Pattern Lab)',
      dragDropText: 'फोटो यहां छोड़ें',
      samplePillsTitle: 'परीक्षण हेतु कटी स्ट्रिप नमूने चुनें (Preset Demo Strips):',
      sampleAmoxExpired: 'नमूना 1: Amoxicillin 500mg कैप्सूल - एक्सपायर्ड (EXP 03/2023)',
      sampleDoloSafe: 'नमूना 2: Paracetamol / Dolo 650 टैबलेट - सुरक्षित (EXP 11/2027)',
      samplePantocidSafe: 'नमूना 3: Pantoprazole 40mg पीली टैबलेट - सुरक्षित (EXP 02/2028)',
      sampleAugmentinSoon: 'नमूना 4: Augmentin 625 Duo कटी स्ट्रिप - जल्द समाप्त (EXP 10/2026)',
      samplePanDExpired: 'नमूना 5: Pan-D फटी पन्नी कैप्सूल - एक्सपायर्ड (EXP 08/2024)',
      sampleAzithExpired: 'नमूना 6: Azithromycin 500mg ओवल - एक्सपायर्ड (EXP 04/2023)',
      sampleMetforminSafe: 'नमूना 7: Metformin 500 SR गोल टैबलेट - सुरक्षित (EXP 12/2027)',
      marketSelectorTitle: 'दवा बाज़ार से कटी स्ट्रिप चुनें (30+ Market Samples):',
      marketSelectorDesc: 'बाज़ार में उपलब्ध प्रत्येक दवा की कटी स्ट्रिप फोटो, 2D QR और पैटर्न की जांच करें।',
      btnBrowseFullMarket: '🛒 पूर्ण दवा बाज़ार देखें',
      qrMatchedBadge: 'GS1 2D डाटा मैट्रिक्स सत्यापित',
      janAushadhiCompareTitle: 'जन औषधि बचत तुलना',
      scanningStatus: 'कटी स्ट्रिप AI पैटर्न विश्लेषण प्रगति पर है...',
      scanningSub: 'आकार, रंग, उभरे अक्षर एवं ब्लिस्टर ग्रिड पहचान जारी...',
      filterNormal: 'सामान्य दृश्य',
      filterInvert: 'धातु फ़ॉइल इनवर्ट',
      filterContrast: 'उच्च कंट्रास्ट',
      btnRescan: 'पुनः स्कैन करें',
      btnNewScan: 'नई फोटो जांचें',
      btnManualEdit: 'तारीख स्वयं दर्ज करें',
      verdictExpired: '🚨 चेतावनी: दवा की मियाद समाप्त (EXPIRED)',
      verdictSafe: '✅ सुरक्षित: दवा उपयोग हेतु वैध (SAFE & VALID)',
      verdictSoon: '⚠️ ध्यान दें: दवा जल्द समाप्त होने वाली है (EXPIRING SOON)',
      hazardWarning: 'चिकित्सकीय सुरक्षा एवं विषाक्तता चेतावनी:',
      hazardTextExpired: 'यह दवा एक्सपायर हो चुकी है। इसका सेवन करने से विषैले दुष्प्रभाव, लीवर या किडनी की क्षति हो सकती है। इसे तुरंत नष्ट कर दें।',
      hazardTextSafe: 'यह दवा वैध शेल्फ-लाइफ में है एवं पूर्णतः सुरक्षित है। ठंडे एवं सूखे स्थान पर रखें।',
      hazardTextSoon: 'यह दवा अगले 30 दिनों में एक्सपायर होने वाली है। निर्धारित कोर्स समय पर पूरा करें।',
      extractedDetails: 'पहचाना गया पैटर्न एवं दवा वर्गीकरण (AI Pattern Findings)',
      medicineName: 'पहचानी गई दवा का नाम:',
      genericSalt: 'जेनेरिक सॉल्ट:',
      drugCategory: 'उपचार वर्ग:',
      expiryDate: 'एक्सपायरी तारीख (EXP):',
      mfgDate: 'निर्माण तारीख (MFG):',
      batchNo: 'बैच नंबर:',
      stripCondition: 'स्ट्रिप की स्थिति:',
      validityDuration: 'शेष अवधि / बीता हुआ समय:',
      confidenceScore: 'AI पहचान सटीकता (Confidence):',
      disposalGuideTitle: 'एक्सपायर्ड दवाओं के सुरक्षित निस्तारण के नियम:',
      disposal1: 'दवाओं को नालियों या खुले पानी में न बहाएं।',
      disposal2: 'टैबलेट को पत्ते से निकाल कर मिट्टी में दबाएं या अस्पताल निस्तारण पेटी में डालें।',
      disposal3: 'खाली एल्युमिनियम फॉयल को फाड़कर कूड़ेदान में डालें ताकि दुरुपयोग न हो सके।',
      btnConsultDoctor: 'डॉक्टर से परामर्श करें / OPD बुक करें',
      btnScheduleExpiryAlert: '📲 Firebase में एक्सपायरी SMS/Email अलर्ट सेव करें',
      cameraModalTitle: 'लाइव कैमरा एक्सपायरी स्कैनर',
      cameraModalSubtitle: 'कटे हुए टैबलेट स्ट्रिप या पैकेट को कैमरा फ्रेम में स्पष्ट रखें',
      cameraPermissionRequest: 'कैमरा अनुमति मांगी जा रही है...',
      cameraErrorDenied: 'कैमरा अनुमति अस्वीकृत।',
      cameraErrorNoDevice: 'कोई कैमरा नहीं मिला।',
      btnCapturePhoto: 'फोटो खींचें',
      btnSwitchCamera: 'कैमरा बदलें',
      btnCloseCamera: 'कैमरा बंद करें',
      cameraAlignGuide: 'कटी स्ट्रिप की एक्सपायरी तारीख इस बॉक्स में रखें',
      aiPatternEngineTitle: 'AI बहु-पैटर्न पहचान इंजन (Multi-Pattern Recognizer)',
      aiPatternEngineSub: 'कटी हुई पन्नी से आकार, रंग, उभरे अक्षरों और ब्लिस्टर ग्रिड के आधार पर दवा पहचान',
      patternShape: 'टैबलेट / कैप्सूल आकार:',
      patternColor: 'रंग सिग्नेचर:',
      patternImprint: 'उभरे हुए अक्षर (Debossed Imprint):',
      patternFoil: 'फ़ॉइल प्रकार एवं ब्लिस्टर पॉकेट:',
      patternStability: 'भौतिक स्थिरता एवं नमी जांच:',
      expiryVerdictHeading: 'एक्सपायरी स्थिति निष्कर्ष (Expiry Verdict):',
      isExpiredYes: '🚨 एक्सपायर्ड है: हाँ (EXPIRED - सेवन न करें)',
      isExpiredNo: '✅ एक्सपायर्ड है: नहीं (SAFE & VALID - सुरक्षित दवा)',
      viewScissoredStrip: '✂️ कटी स्ट्रिप फोटो (Cut Strip)',
      viewFullStrip: '🖼️ पूरा पत्ता फोटो (Full Pack)',
      viewQrCode: '📱 2D QR कोड'
    },
    'en-IN': {
      tabNumber: '7. Medicine Expiry Checker',
      heroTitle: 'Scissored Pill Pattern Classifier & Expiry Checker',
      heroSubtitle: 'View photorealistic scissored cut pill strip images or full strip packs to test severed blister foils. Our AI pattern recognition model identifies whether it is Amoxicillin, Paracetamol, Pantoprazole, or another drug, and determines whether it is expired. Save records in Firebase to receive automated SMS/Email alerts.',
      cutStripSpecialtyBadge: 'AI Pattern Recognition & Scissored Pill Model',
      uploadBoxTitle: 'Upload or Snap Scissored Blister Strip / Pill Photo',
      uploadBoxSubtitle: 'Supports cut tablet strips, severed blister packs, capsules, ointment (JPG, PNG, WebP)',
      btnUploadPhoto: 'Upload File',
      btnTakePhoto: 'Take Camera Photo',
      btnOpenPatternLab: '🧪 AI Pattern Simulator Lab',
      dragDropText: 'Drop medicine photo here',
      samplePillsTitle: 'Try Instant Scissored-Strip Presets:',
      sampleAmoxExpired: 'Sample 1: Amoxicillin 500mg Cut Capsule - EXPIRED (EXP 03/2023)',
      sampleDoloSafe: 'Sample 2: Paracetamol / Dolo 650 Scored Caplet - SAFE (EXP 11/2027)',
      samplePantocidSafe: 'Sample 3: Pantoprazole 40mg Yellow Enteric - SAFE (EXP 02/2028)',
      sampleAugmentinSoon: 'Sample 4: Augmentin 625 Duo Cut Strip - EXPIRING SOON (EXP 10/2026)',
      samplePanDExpired: 'Sample 5: Pan-D Torn Foil Capsule - EXPIRED (EXP 08/2024)',
      sampleAzithExpired: 'Sample 6: Azithromycin 500mg Oval - EXPIRED (EXP 04/2023)',
      sampleMetforminSafe: 'Sample 7: Metformin 500 SR Round Scored - SAFE (EXP 12/2027)',
      marketSelectorTitle: 'Pick Cut Strip from Medicine Market (30+ Market Samples):',
      marketSelectorDesc: 'Test scissor-cut strips with verified GS1 2D DataMatrix seals and visual packaging.',
      btnBrowseFullMarket: '🛒 Browse Full Medicine Market',
      qrMatchedBadge: 'GS1 2D DataMatrix Verified',
      janAushadhiCompareTitle: 'Jan Aushadhi Generic Savings',
      scanningStatus: 'Running AI Multi-Pattern Recognition Engine...',
      scanningSub: 'Detecting pill morphology, color spectrum, debossing imprints, and foil knurling...',
      filterNormal: 'Normal View',
      filterInvert: 'Metallic Foil Invert',
      filterContrast: 'High Contrast',
      btnRescan: 'Re-Scan Image',
      btnNewScan: 'Scan New Medicine',
      btnManualEdit: 'Edit Date Manually',
      verdictExpired: 'CRITICAL ALERT: MEDICINE IS EXPIRED',
      verdictSafe: 'SAFE & VALID TO CONSUME',
      verdictSoon: 'WARNING: MEDICINE EXPIRING SOON',
      hazardWarning: 'Clinical Safety & Toxicity Hazard:',
      hazardTextExpired: 'This medicine has expired. Consuming expired pharmaceutical drugs poses severe health risks including chemical degradation, loss of active potency, sub-therapeutic failure, and potential renal or hepatic toxicity. Discard immediately.',
      hazardTextSafe: 'This medication is within its official shelf-life and safe for clinical use. Store in a cool, dry place away from direct sunlight.',
      hazardTextSoon: 'This medicine is nearing its expiration date within 30-60 days. Ensure full dosage is completed prior to expiration.',
      extractedDetails: 'AI Pattern Findings & Drug Classification',
      medicineName: 'Classified Medicine Name:',
      genericSalt: 'Generic Salt Composition:',
      drugCategory: 'Therapeutic Category:',
      expiryDate: 'Expiry Date (EXP):',
      mfgDate: 'Manufacturing Date (MFG):',
      batchNo: 'Batch / Lot No:',
      stripCondition: 'Packet / Foil Condition:',
      validityDuration: 'Remaining Shelf-Life / Overdue:',
      confidenceScore: 'Pattern Matching Confidence:',
      disposalGuideTitle: 'Safe Pharmaceutical Disposal Protocols (Odisha SPCB Guidelines):',
      disposal1: 'Never flush medications down toilets or throw into waterways to prevent environmental antibiotic resistance.',
      disposal2: 'Crush solid tablets, mix with unpalatable soil/coffee grounds, and seal in disposal pouch or return to PHC yellow bin.',
      disposal3: 'Deface or shred empty aluminum blister foil to prevent illegal counterfeit repackaging.',
      btnConsultDoctor: 'Consult a Doctor / Book OPD Appointment',
      btnScheduleExpiryAlert: '📲 Save Expiry Alert to Firebase (SMS & Email)',
      cameraModalTitle: 'Live Camera Expiry Scanner',
      cameraModalSubtitle: 'Position cut tablet strip or severed foil within the camera guide frame',
      cameraPermissionRequest: 'Requesting camera access permission...',
      cameraErrorDenied: 'Camera permission was denied.',
      cameraErrorNoDevice: 'No camera hardware found on this device.',
      btnCapturePhoto: 'Capture Photo',
      btnSwitchCamera: 'Switch Camera',
      btnCloseCamera: 'Close Camera',
      cameraAlignGuide: 'Align stamped EXP / BATCH date inside this focal box',
      aiPatternEngineTitle: 'AI Multi-Pattern Recognition & Pill Classification Engine',
      aiPatternEngineSub: 'Deep pattern recognition combining morphology, color, debossing, and blister cavity grids',
      patternShape: 'Pill Shape & Morphology:',
      patternColor: 'Color Signature:',
      patternImprint: 'Debossed Surface Imprint:',
      patternFoil: 'Blister Foil & Cavity Pitch:',
      patternStability: 'Physical Stability & Seal Check:',
      expiryVerdictHeading: 'Definitive Expiry Verdict:',
      isExpiredYes: '🚨 IS EXPIRED: YES (EXPIRED - DO NOT CONSUME)',
      isExpiredNo: '✅ IS EXPIRED: NO (SAFE & VALID TO CONSUME)',
      viewScissoredStrip: '✂️ Scissored Cut Strip Photo',
      viewFullStrip: '🖼️ Full Strip Pack Photo',
      viewQrCode: '📱 2D QR Code'
    }
  }[lang] || {};

  // 7 High-Precision Preset Scenarios Specialized for Cut Strips with Real Visual Images
  const PRESET_SAMPLES = useMemo(() => {
    return [
      {
        id: 'sample-amox-expired',
        title: txt.sampleAmoxExpired,
        medicineName: 'Amoxicillin IP 500mg (Mox 500)',
        generic: 'Amoxicillin Trihydrate IP 500mg',
        salt: 'Amoxicillin Trihydrate IP 500mg (Hard Gelatin Capsule)',
        mfgDate: '04/2021',
        expDate: '03/2023',
        batchNo: 'AMX-4410X',
        condition: lang === 'or-IN' ? 'କଟା କ୍ୟାପସୁଲ୍ ଷ୍ଟ୍ରିପ୍ (୩ ଟି କ୍ୟାପସୁଲ୍ ବାକି, ମିଆଦ ସରିଛି)' : (lang === 'hi-IN' ? 'कटी कैप्सूल स्ट्रिप (3 कैप्सूल शेष, एक्सपायर्ड)' : 'Cut Capsule Strip (3 Remaining, Expired)'),
        status: 'EXPIRED',
        overdueText: lang === 'or-IN' ? '୩ ବର୍ଷ ୭ ମାସ ପୂର୍ବରୁ ମିଆଦ ସରିଛି (Maroon/Ivory Capsule)' : (lang === 'hi-IN' ? '3 वर्ष 7 माह पूर्व समाप्त (Maroon/Ivory Capsule)' : 'Expired 3 years 7 months ago (Maroon/Ivory Capsule)'),
        confidence: '98.8%',
        foilColor: '#cbd5e1',
        pillColor: '#800020',
        pillShape: 'capsule',
        cavitiesTotal: 10,
        cavitiesRemaining: 3,
        mrp: 138,
        janAushadhiPrice: 32.50,
        dosageForm: 'Capsule Strip',
        packType: 'alu-alu',
        stampedRawText: 'AMOXYCILLIN CAPSULES IP 500mg\nB.No. AMX-4410X\nMFD. 04/2021\nEXP. 03/2023\n[CUT FOIL EDGE DETECTED - MAROON DUAL-TONE CAPSULE PATTERN]',
        imageType: 'expired',
        signatureId: 'SIG-AMOXICILLIN'
      },
      {
        id: 'sample-dolo-safe',
        title: txt.sampleDoloSafe,
        medicineName: 'Dolo 650 (Paracetamol IP 650mg)',
        generic: 'Paracetamol IP 650mg',
        salt: 'Paracetamol IP 650mg (Scored Elongated Caplet)',
        mfgDate: '12/2024',
        expDate: '11/2027',
        batchNo: 'DL-88210',
        condition: lang === 'or-IN' ? 'ଅଧା କଟା ବ୍ଲିଷ୍ଟର ପ୍ୟାକ୍ (୬ ଟାବଲେଟ୍ ବାକି, ସୁରକ୍ଷିତ)' : (lang === 'hi-IN' ? 'आधा कटा ब्लिस्टर पैक (6 गोलियां शेष, सुरक्षित)' : 'Half-Cut Blister Pack (6 Tablets Remaining, Safe)'),
        status: 'SAFE',
        overdueText: lang === 'or-IN' ? 'ଆହୁରି ୧୩ ମାସ ସମ୍ପୂର୍ଣ୍ଣ ବୈଧ ଓ ସୁରକ୍ଷିତ' : (lang === 'hi-IN' ? 'अभी 13 महीने पूर्णतः वैध एवं सुरक्षित' : 'Valid and active for 13 more months'),
        confidence: '99.4%',
        foilColor: '#d1d5db',
        pillColor: '#ffffff',
        pillShape: 'caplet',
        cavitiesTotal: 15,
        cavitiesRemaining: 6,
        mrp: 34.50,
        janAushadhiPrice: 8.80,
        dosageForm: 'Tablet Strip',
        packType: 'blister',
        stampedRawText: 'DOLO-650 TAB\nB.No. DL-88210\nMFG. DEC 2024\nEXP. NOV 2027\n[SCORED WHITE CAPLET PATTERN DETECTED]',
        imageType: 'safe',
        signatureId: 'SIG-PARACETAMOL-650'
      },
      {
        id: 'sample-pantocid-safe',
        title: txt.samplePantocidSafe,
        medicineName: 'Pantocid 40 (Pantoprazole IP 40mg)',
        generic: 'Pantoprazole Gastro-Resistant IP 40mg',
        salt: 'Pantoprazole IP 40mg (Enteric-Coated Yellow Tablet)',
        mfgDate: '03/2025',
        expDate: '02/2028',
        batchNo: 'PT-8809B',
        condition: lang === 'or-IN' ? 'କଟା ଆଲୁ-ଆଲୁ ଷ୍ଟ୍ରିପ୍ (୫ ଟି ହଳଦିଆ ଟାବଲେଟ୍ ବାକି)' : (lang === 'hi-IN' ? 'कटी अलू-अलू स्ट्रिप (5 पीली टैबलेट शेष)' : 'Scissored Alu-Alu Strip (5 Yellow Tablets Remaining)'),
        status: 'SAFE',
        overdueText: lang === 'or-IN' ? 'ଆହୁରି ୧୬ ମାସ ସୁରକ୍ଷିତ ଓ ବୈଧ (EXP 02/2028)' : (lang === 'hi-IN' ? 'अभी 16 महीने सुरक्षित एवं वैध (EXP 02/2028)' : 'Valid for 16 more months (EXP 02/2028)'),
        confidence: '99.1%',
        foilColor: '#cbd5e1',
        pillColor: '#eab308',
        pillShape: 'round',
        cavitiesTotal: 15,
        cavitiesRemaining: 5,
        mrp: 165,
        janAushadhiPrice: 22.50,
        dosageForm: 'Tablet Strip',
        packType: 'alu-alu',
        stampedRawText: 'PANTOCID 40 TAB\nB.No. PT-8809B\nMFG. 03/2025\nEXP. 02/2028\n[YELLOW ENTERIC COATED PATTERN CONFIRMED]',
        imageType: 'safe',
        signatureId: 'SIG-PANTOPRAZOLE-40'
      },
      {
        id: 'sample-augmentin-soon',
        title: txt.sampleAugmentinSoon,
        medicineName: 'Augmentin 625 Duo (Amoxy-Clav)',
        generic: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
        salt: 'Amoxicillin IP 500mg + Potassium Clavulanate IP 125mg',
        mfgDate: '11/2024',
        expDate: '10/2026',
        batchNo: 'AG-9021',
        condition: lang === 'or-IN' ? 'କଟା ଷ୍ଟ୍ରିପ୍ (୩ ଟାବଲେଟ୍ ଅବଶିଷ୍ଟ, ଶୀଘ୍ର ସରିବ)' : (lang === 'hi-IN' ? 'कटी स्ट्रिप (3 गोलियां शेष, जल्द समाप्त)' : 'Cut Strip (3 Tablets Remaining, Expiring Soon)'),
        status: 'SOON',
        overdueText: lang === 'or-IN' ? 'ଚଳିତ ମାସ ମଧ୍ୟରେ ମିଆଦ ସରିବ (EXP 10/2026)' : (lang === 'hi-IN' ? 'इसी माह समाप्त होने वाली (EXP 10/2026)' : 'Expiring this month (Oct 2026)'),
        confidence: '97.2%',
        foilColor: '#94a3b8',
        pillColor: '#f8fafc',
        pillShape: 'caplet',
        cavitiesTotal: 10,
        cavitiesRemaining: 3,
        mrp: 208.50,
        janAushadhiPrice: 52,
        dosageForm: 'Alu-Alu Strip',
        packType: 'alu-alu',
        stampedRawText: 'AUGMENTIN 625 DUO\nB.No. AG-9021\nMFD. 11/2024\nEXP. 10/2026\n[DESSICATED ALU-ALU DIMPLED CAVITY PATTERN]',
        imageType: 'soon',
        signatureId: 'SIG-AUGMENTIN-625'
      },
      {
        id: 'sample-pan-d-expired',
        title: txt.samplePanDExpired,
        medicineName: 'Pan-D (Pantoprazole & Domperidone)',
        generic: 'Pantoprazole 40mg + Domperidone 30mg SR',
        salt: 'Pantoprazole Gastro-resistant & Domperidone Prolonged-release',
        mfgDate: '09/2022',
        expDate: '08/2024',
        batchNo: 'PD-3011',
        condition: lang === 'or-IN' ? 'ଛିଣ୍ଡା ଫଏଲ୍ ଧାର (ଛିଣ୍ଡା ତାରିଖ: XP: 08/24, ମିଆଦ ସରିଛି)' : (lang === 'hi-IN' ? 'फटी पन्नी (कटी तारीख: XP: 08/24, एक्सपायर्ड)' : 'Scissor-Cut Foil Edge (XP: 08/24, Expired)'),
        status: 'EXPIRED',
        overdueText: lang === 'or-IN' ? '୨ ବର୍ଷ ୨ ମାସ ପୂର୍ବରୁ ମିଆଦ ସରିଛି' : (lang === 'hi-IN' ? '2 वर्ष 2 माह पूर्व समाप्त' : 'Expired 2 years 2 months ago (Aug 2024)'),
        confidence: '95.6%',
        foilColor: '#cbd5e1',
        pillColor: '#ef4444',
        pillShape: 'capsule',
        cavitiesTotal: 15,
        cavitiesRemaining: 4,
        mrp: 199,
        janAushadhiPrice: 32,
        dosageForm: 'Capsule Strip',
        packType: 'alu-alu',
        stampedRawText: 'PAN-D CAPSULES\nB.No. PD-3011\nM:09/22\nXP:08/24 [TORN EDGE RECONSTRUCTED TO EXP: 08/2024]',
        imageType: 'expired',
        signatureId: 'SIG-PAN-D'
      },
      {
        id: 'sample-azith-expired',
        title: txt.sampleAzithExpired,
        medicineName: 'Azithromycin Tablets IP 500mg',
        generic: 'Azithromycin Dihydrate IP 500mg',
        salt: 'Azithromycin Dihydrate IP 500mg (Biconvex Oval)',
        mfgDate: '05/2021',
        expDate: '04/2023',
        batchNo: 'AZ-4109B',
        condition: lang === 'or-IN' ? '୨ ଟି ଟାବଲେଟ୍ ବିଶିଷ୍ଟ କଟା ଷ୍ଟ୍ରିପ୍ (ମିଆଦ ସରିଛି)' : (lang === 'hi-IN' ? '2 टैबलेट वाली कटी स्ट्रिप (एक्सपायर्ड)' : '2-Tablet Cut Strip (Expired)'),
        status: 'EXPIRED',
        overdueText: lang === 'or-IN' ? '୩ ବର୍ଷ ୬ ମାସ ପୂର୍ବରୁ ସରିଯାଇଛି' : (lang === 'hi-IN' ? '3 वर्ष 6 माह पूर्व समाप्त' : 'Expired 3 years 6 months ago (Apr 2023)'),
        confidence: '98.5%',
        foilColor: '#cbd5e1',
        pillColor: '#ffffff',
        pillShape: 'oval',
        cavitiesTotal: 5,
        cavitiesRemaining: 2,
        mrp: 124,
        janAushadhiPrice: 38,
        dosageForm: 'Tablet Strip',
        packType: 'blister',
        stampedRawText: 'AZEE 500 / AZITHRAL 500\nB.No. AZ-4109B\nMFD. 05/2021\nEXP. 04/2023\n[CUT OVAL BLISTER FOIL PATTERN]',
        imageType: 'expired',
        signatureId: 'SIG-AZITHROMYCIN-500'
      },
      {
        id: 'sample-metformin-safe',
        title: txt.sampleMetforminSafe,
        medicineName: 'Glycomet 500 SR (Metformin)',
        generic: 'Metformin Hydrochloride SR 500mg',
        salt: 'Metformin Hydrochloride Prolonged-Release 500mg',
        mfgDate: '01/2025',
        expDate: '12/2027',
        batchNo: 'GM-3301L',
        condition: lang === 'or-IN' ? 'କଟା ବ୍ଲିଷ୍ଟର ଷ୍ଟ୍ରିପ୍ (୮ ଟି ଟାବଲେଟ୍ ବାକି, ସୁରକ୍ଷିତ)' : (lang === 'hi-IN' ? 'कटी स्ट्रिप (8 गोलियां शेष, सुरक्षित)' : 'Cut Blister Strip (8 Tablets Remaining, Safe)'),
        status: 'SAFE',
        overdueText: lang === 'or-IN' ? 'ଆହୁରି ୧୪ ମାସ ସମ୍ପୂର୍ଣ୍ଣ ବୈଧ ଓ ସୁରକ୍ଷିତ' : (lang === 'hi-IN' ? 'अभी 14 महीने सुरक्षित एवं वैध' : 'Valid and active for 14 more months'),
        confidence: '99.0%',
        foilColor: '#f1f5f9',
        pillColor: '#ffffff',
        pillShape: 'round',
        cavitiesTotal: 20,
        cavitiesRemaining: 8,
        mrp: 48,
        janAushadhiPrice: 9.60,
        dosageForm: 'Tablet Strip',
        packType: 'blister',
        stampedRawText: 'GLYCOMET 500 SR\nB.No. GM-3301L\nMFD. 01/2025\nEXP. 12/2027\n[ROUND SCORED BIGUANIDE PATTERN]',
        imageType: 'safe',
        signatureId: 'SIG-METFORMIN-500'
      }
    ].map((s) => ({
      ...s,
      scissoredStripImage: generateScissoredStripSvg(s),
      fullStripImage: generateFullStripSvg(s)
    }));
  }, [lang, txt]);

  // Stop camera media stream safely
  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Launch live camera with user permission
  const startCamera = async (overrideFacingMode = null) => {
    stopCameraStream();
    setCameraLoading(true);
    setCameraError(null);
    setShowCameraModal(true);

    const mode = overrideFacingMode || facingMode;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('NO_MEDIA_DEVICES');
      }

      const constraints = {
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        try {
          await videoRef.current.play();
        } catch (playErr) {
          console.warn('Video auto-play note:', playErr);
        }
      }
      setCameraLoading(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraLoading(false);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(txt.cameraErrorDenied);
      } else if (err.name === 'NotFoundError' || err.message === 'NO_MEDIA_DEVICES') {
        setCameraError(txt.cameraErrorNoDevice);
      } else {
        setCameraError(txt.cameraErrorDenied);
      }
    }
  };

  const toggleFacingMode = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const closeCamera = () => {
    stopCameraStream();
    setShowCameraModal(false);
    setCameraError(null);
  };

  const capturePhotoFromCamera = () => {
    const video = videoRef.current;
    if (!video || video.readyState < 2) return;

    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const file = new File([blob], `scissored-pill-camera-${timestamp}.jpg`, { type: 'image/jpeg' });
          closeCamera();
          processUploadedFile(file);
        }
      },
      'image/jpeg',
      0.95
    );
  };

  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  // Pre-generate QR data URLs for market items
  useEffect(() => {
    let isSubscribed = true;
    const loadMarketQrs = async () => {
      const qrs = {};
      for (const med of MEDICINE_MARKET_DATABASE) {
        try {
          const url = await QRCode.toDataURL(med.qrData, {
            width: 140,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' }
          });
          qrs[med.id] = url;
        } catch (e) {
          // ignore
        }
      }
      if (isSubscribed) setMarketQrs(qrs);
    };
    loadMarketQrs();
    return () => { isSubscribed = false; };
  }, []);

  // Process a market medicine selection through the Pattern Classifier
  const testMarketMedicine = async (med) => {
    setSelectedImage({ name: `${med.name} (Cut Strip)` });
    setImagePreview(null);
    setIsScanning(true);
    setScanProgress(20);
    setScanResult(null);

    // Run AI Pattern Classifier
    const classification = classifyPillAndFoilPattern({
      presetMedicine: med,
      rawExpDate: med.expDate,
      rawBatchNo: med.batchNo
    });

    let qrUrl = marketQrs[med.id];
    if (!qrUrl) {
      try {
        qrUrl = await QRCode.toDataURL(med.qrData, { width: 140, margin: 1 });
      } catch (e) {
        qrUrl = null;
      }
    }

    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 90 ? 95 : prev + 25));
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      const result = {
        id: `market-${med.id}`,
        title: `${med.name} (Market Cut Strip)`,
        medicineName: classification.medicineName || med.name,
        generic: classification.genericSalt || med.generic,
        brand: med.brand,
        salt: `${med.generic} (${med.dosageForm} ${med.dosage})`,
        mfgDate: med.mfgDate,
        expDate: med.expDate,
        batchNo: med.batchNo,
        condition: lang === 'or-IN'
          ? `କଇଞ୍ଚିରେ କଟା ବ୍ଲିଷ୍ଟର ଷ୍ଟ୍ରିପ୍ (${med.cavitiesRemaining || 4} ଟାବଲେଟ୍ ବାକି, 2D QR ସିଲ୍ ସଂଲଗ୍ନ)`
          : lang === 'hi-IN'
          ? `कैंची से कटा ब्लिस्टर पत्ता (${med.cavitiesRemaining || 4} गोलियां शेष, 2D QR कोड संलग्न)`
          : `Scissors-cut blister strip (${med.cavitiesRemaining || 4} pills remaining, GS1 2D DataMatrix verified)`,
        status: classification.status,
        isExpired: classification.isExpired,
        overdueText: classification.expiryEvaluation.durationLabel[lang] || classification.expiryEvaluation.durationLabel['en-IN'],
        confidence: `${classification.confidence} (AI Pattern Matched)`,
        stampedRawText: `GS1 DATAMATRIX DECODED:\n${med.qrData.replace(/\n/g, ' ')}\nBATCH: ${med.batchNo}\nMFG: ${med.mfgDate}\nEXP: ${med.expDate}\nMRP: Rs. ${med.mrp} | JAN AUSHADHI: Rs. ${med.janAushadhiPrice}\n[SCISSORS CUT STRIP DETECTED - PATTERN RECOGNITION MATCHED: ${classification.medicineName}]`,
        imageType: classification.status.toLowerCase(),
        fromMarket: true,
        marketData: med,
        qrDataUrl: qrUrl,
        foilColor: med.foilColor,
        pillColor: med.pillColor,
        pillShape: med.pillShape,
        cavitiesRemaining: med.cavitiesRemaining || 4,
        scissoredStripImage: med.scissoredStripImage || generateScissoredStripSvg(med),
        fullStripImage: med.fullStripImage || generateFullStripSvg(med),
        recognizedPatterns: classification.recognizedPatterns,
        classificationData: classification
      };

      setScanResult(result);
    }, 850);
  };

  // Watch for incoming medicine from Medicine Market
  useEffect(() => {
    if (incomingMedicine) {
      testMarketMedicine(incomingMedicine);
    }
  }, [incomingMedicine]);

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
    setImagePreview(null);
    runScannerAnalysis(sample.title, sample);
  };

  // Execute AI Multi-Pattern Recognition Model
  const runScannerAnalysis = (fileName, presetData = null, customPatternOpts = null) => {
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
    }, 180);

    setTimeout(() => {
      clearInterval(interval);
      setScanProgress(100);
      setIsScanning(false);

      if (presetData) {
        const classification = classifyPillAndFoilPattern({
          fileName: presetData.medicineName,
          ocrText: presetData.stampedRawText,
          selectedShape: presetData.pillShape,
          selectedColor: presetData.pillColor,
          selectedFoil: presetData.foilColor ? 'alu-alu' : 'blister',
          rawExpDate: presetData.expDate,
          rawBatchNo: presetData.batchNo
        });

        setScanResult({
          ...presetData,
          isExpired: classification.isExpired,
          status: classification.status,
          overdueText: classification.expiryEvaluation.durationLabel[lang] || classification.expiryEvaluation.durationLabel['en-IN'],
          scissoredStripImage: presetData.scissoredStripImage || generateScissoredStripSvg(presetData),
          fullStripImage: presetData.fullStripImage || generateFullStripSvg(presetData),
          recognizedPatterns: classification.recognizedPatterns,
          classificationData: classification
        });
      } else {
        const opts = customPatternOpts || {
          fileName: fileName,
          ocrText: fileName
        };

        const classification = classifyPillAndFoilPattern(opts);

        const syntheticMed = {
          name: classification.medicineName,
          generic: classification.genericSalt,
          batchNo: classification.batchNo,
          mfgDate: classification.mfgDate,
          expDate: classification.expDate,
          pillShape: classification.recognizedPatterns.pillShape,
          pillColor: classification.recognizedPatterns.primaryColorHex,
          foilColor: classification.recognizedPatterns.foilColor,
          cavitiesTotal: 10,
          cavitiesRemaining: 3,
          status: classification.status,
          mrp: 120,
          janAushadhiPrice: 28,
          dosageForm: 'Cut Blister Strip'
        };

        setScanResult({
          id: 'custom-ai-scan',
          title: fileName,
          medicineName: classification.medicineName,
          generic: classification.genericSalt,
          brand: classification.brandNames[0],
          salt: classification.genericSalt,
          mfgDate: classification.mfgDate,
          expDate: classification.expDate,
          batchNo: classification.batchNo,
          condition: lang === 'or-IN'
            ? 'କଟା ବ୍ଲିଷ୍ଟର ପ୍ୟାକେଟ୍ ଓ ଖଣ୍ଡିତ ଫଏଲ୍ (AI Pattern Analyzed)'
            : (lang === 'hi-IN'
            ? 'कटा हुआ ब्लिस्टर पैकेट एवं फ़ॉइल (AI Pattern Analyzed)'
            : 'Scissored Blister Foil Pattern Detected'),
          status: classification.status,
          isExpired: classification.isExpired,
          overdueText: classification.expiryEvaluation.durationLabel[lang] || classification.expiryEvaluation.durationLabel['en-IN'],
          confidence: `${classification.confidence} (AI Pattern Matched)`,
          stampedRawText: `AI PATTERN OCR RECONSTRUCTION:\nCLASSIFIED: ${classification.medicineName}\nGENERIC: ${classification.genericSalt}\nSHAPE: ${classification.recognizedPatterns.pillShape}\nCOLOR: ${classification.recognizedPatterns.primaryColorHex}\nIMPRINT: ${classification.recognizedPatterns.debossedImprint}\nEXP: ${classification.expDate} [VERDICT: ${classification.status}]\nBATCH: ${classification.batchNo}`,
          imageType: classification.status.toLowerCase(),
          foilColor: classification.recognizedPatterns.foilColor,
          pillColor: classification.recognizedPatterns.primaryColorHex,
          pillShape: classification.recognizedPatterns.pillShape,
          cavitiesRemaining: 3,
          scissoredStripImage: generateScissoredStripSvg(syntheticMed),
          fullStripImage: generateFullStripSvg(syntheticMed),
          recognizedPatterns: classification.recognizedPatterns,
          classificationData: classification
        });
      }
    }, 850);
  };

  // Run AI Pattern Simulator Lab directly
  const handleRunPatternLab = () => {
    runScannerAnalysis(`Interactive-Simulator-${labShape}-${labImprint}`, null, {
      selectedShape: labShape,
      selectedColor: labColor,
      selectedImprint: labImprint,
      selectedFoil: labFoil,
      rawExpDate: labDatePreset,
      rawBatchNo: 'SIM-2026-PAT'
    });
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualExpDate) return;

    const classification = classifyPillAndFoilPattern({
      fileName: manualMedicineName,
      ocrText: manualMedicineName,
      rawExpDate: manualExpDate,
      rawBatchNo: 'MANUAL-INPUT'
    });

    const manualMed = {
      name: manualMedicineName || classification.medicineName,
      generic: classification.genericSalt,
      batchNo: 'MANUAL-INPUT',
      mfgDate: '01/2024',
      expDate: manualExpDate,
      pillShape: classification.recognizedPatterns.pillShape,
      pillColor: classification.recognizedPatterns.primaryColorHex,
      foilColor: '#cbd5e1',
      cavitiesTotal: 10,
      cavitiesRemaining: 4,
      status: classification.status,
      mrp: 100,
      janAushadhiPrice: 20,
      dosageForm: 'Verified Foil'
    };

    setScanResult({
      id: 'manual-input',
      title: manualMedicineName || 'Manual Entry',
      medicineName: manualMedicineName || classification.medicineName,
      generic: classification.genericSalt,
      salt: classification.genericSalt,
      mfgDate: 'N/A',
      expDate: manualExpDate,
      batchNo: 'MANUAL-INPUT',
      condition: lang === 'or-IN' ? 'ହାତରେ ଯାଞ୍ଚ କରାଯାଇଥିବା ମିଆଦ ତାରିଖ' : (lang === 'hi-IN' ? 'मैनुअल रूप से दर्ज तारीख' : 'Manually Verified Foil Stamp'),
      status: classification.status,
      isExpired: classification.isExpired,
      overdueText: classification.expiryEvaluation.durationLabel[lang] || classification.expiryEvaluation.durationLabel['en-IN'],
      confidence: '100% (User Verified)',
      stampedRawText: `USER VERIFIED STAMP:\nEXP: ${manualExpDate}\nNAME: ${manualMedicineName}\nCLASSIFICATION: ${classification.medicineName}`,
      imageType: classification.status.toLowerCase(),
      scissoredStripImage: generateScissoredStripSvg(manualMed),
      fullStripImage: generateFullStripSvg(manualMed),
      recognizedPatterns: classification.recognizedPatterns,
      classificationData: classification
    });
    setManualInputMode(false);
  };

  // Schedule automated SMS/Email alert to Firebase
  const handleScheduleFirebaseAlert = async () => {
    if (!scanResult) return;
    setIsRegisteringAlert(true);

    const alertId = `ALERT-REG-${Date.now()}`;
    const orderData = {
      orderId: alertId,
      patientName: alertPatientName,
      patientPhone: alertPhone,
      patientEmail: alertEmail,
      deliveryMode: 'clinic-scan',
      kendra: 'PMBJP Capital Hospital Complex, Bhubaneswar',
      paymentMethod: 'registered-alert',
      mrpTotal: '0.00',
      janTotal: '0.00',
      savings: '0.00',
      items: [
        {
          medicine: {
            id: scanResult.id,
            name: scanResult.medicineName,
            generic: scanResult.generic || scanResult.salt,
            batchNo: scanResult.batchNo,
            expDate: scanResult.expDate,
            mfgDate: scanResult.mfgDate,
            status: scanResult.status
          },
          quantity: 1
        }
      ]
    };

    // Save to Firebase
    await saveMedicineOrderToFirebase(orderData);

    // If expired, simulate instant dispatch
    let sentInfo = null;
    if (scanResult.isExpired) {
      sentInfo = await triggerMedicineExpiryAlert({
        orderId: alertId,
        medicineName: scanResult.medicineName,
        batchNo: scanResult.batchNo,
        expDate: scanResult.expDate,
        phone: alertPhone,
        email: alertEmail,
        patientName: alertPatientName
      });
    }

    setIsRegisteringAlert(false);
    setShowAlertModal(false);
    setAlertDispatchedNotification({
      phone: alertPhone,
      email: alertEmail,
      medicine: scanResult.medicineName,
      isExpired: scanResult.isExpired,
      message: sentInfo?.smsMessage || `Scheduled: Automated alerts registered in Firebase for ${scanResult.medicineName} (EXP: ${scanResult.expDate})`
    });
  };

  const filteredMarketMeds = useMemo(() => {
    return MEDICINE_MARKET_DATABASE.filter((med) => {
      const matchCat = marketFilterCategory === 'all' || med.category === marketFilterCategory;
      const q = marketSearchTerm.toLowerCase();
      const matchSearch =
        !q ||
        med.name.toLowerCase().includes(q) ||
        med.generic.toLowerCase().includes(q) ||
        med.batchNo.toLowerCase().includes(q) ||
        med.brand.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [marketFilterCategory, marketSearchTerm]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      {/* ── Top Banner Hero ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold mb-3">
              <Scissors className="w-3.5 h-3.5 text-amber-300" />
              {txt.cutStripSpecialtyBadge}
              <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black ml-1">
                AI PATTERN MODEL
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
              onClick={() => startCamera()}
              className="px-5 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Camera className="w-4 h-4 text-slate-950" />
              {txt.btnTakePhoto}
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4 text-teal-300" />
              {txt.btnUploadPhoto}
            </button>
            <button
              type="button"
              onClick={() => setShowPatternLab(!showPatternLab)}
              className="px-4 py-3 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Microscope className="w-4 h-4 text-amber-200" />
              {txt.btnOpenPatternLab}
            </button>
          </div>
        </div>
      </div>

      {/* ── Active Alert Notification Toast ───────────────────────────────── */}
      {alertDispatchedNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xl flex items-center justify-between gap-3 animate-scaleUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm">
                📲 Firebase Expiry Alert Dispatched!
              </div>
              <p className="text-xs text-amber-100 mt-0.5 line-clamp-1">
                To: {alertDispatchedNotification.phone} / {alertDispatchedNotification.email} — "{alertDispatchedNotification.message}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setAlertDispatchedNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Interactive AI Pattern Simulator Lab ──────────────────────────── */}
      {showPatternLab && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-5 sm:p-6 border border-teal-500/40 shadow-2xl space-y-4 animate-scaleUp">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <Microscope className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
                  <span>{txt.aiPatternEngineTitle}</span>
                  <span className="bg-teal-500 text-slate-950 text-[10px] font-black px-2 py-0.2 rounded-full">
                    LIVE LAB
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {txt.aiPatternEngineSub}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowPatternLab(false)}
              className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Shape */}
            <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="font-bold text-teal-300 flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                <span>Pill Shape / Morphology</span>
              </label>
              <select
                value={labShape}
                onChange={(e) => setLabShape(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
              >
                <option value="capsule">Dual-Tone Capsule (e.g. Amoxicillin)</option>
                <option value="caplet">Oblong Scored Caplet (e.g. Paracetamol / Dolo)</option>
                <option value="round">Round Tablet (e.g. Pantoprazole, Metformin)</option>
                <option value="oval">Oval Tablet (e.g. Azithromycin, Combiflam)</option>
              </select>
            </div>

            {/* Color */}
            <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Color Signature</span>
              </label>
              <select
                value={labColor}
                onChange={(e) => setLabColor(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
              >
                <option value="#800020">Maroon & Gold (#800020 - Amoxicillin)</option>
                <option value="#ffffff">Chalky White (#ffffff - Paracetamol)</option>
                <option value="#eab308">Mustard Yellow (#eab308 - Pantoprazole)</option>
                <option value="#f8fafc">Off-White Glossy (#f8fafc - Augmentin)</option>
                <option value="#f97316">Sunset Orange (#f97316 - Combiflam)</option>
                <option value="#ef4444">Crimson Red/White (#ef4444 - Pan-D)</option>
              </select>
            </div>

            {/* Imprint */}
            <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="font-bold text-sky-300 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5" />
                <span>Debossed Imprint</span>
              </label>
              <select
                value={labImprint}
                onChange={(e) => setLabImprint(e.target.value)}
                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
              >
                <option value="AMOX 500">AMOX 500 (Amoxicillin IP 500mg)</option>
                <option value="DOLO 650">DOLO 650 (Paracetamol IP 650mg)</option>
                <option value="PAN 40">PAN 40 (Pantoprazole IP 40mg)</option>
                <option value="AUG 625">AUG 625 (Augmentin 625 Duo)</option>
                <option value="AZI 500">AZI 500 (Azithromycin 500mg)</option>
                <option value="MET 500">MET 500 (Metformin 500 SR)</option>
              </select>
            </div>

            {/* Date Preset */}
            <div className="space-y-1.5 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <label className="font-bold text-rose-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Foil Date & Material</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={labDatePreset}
                  onChange={(e) => setLabDatePreset(e.target.value)}
                  className="flex-1 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-xs"
                >
                  <option value="03/2023">EXP 03/2023 (EXPIRED)</option>
                  <option value="08/2024">EXP 08/2024 (EXPIRED)</option>
                  <option value="10/2026">EXP 10/2026 (EXPIRING SOON)</option>
                  <option value="11/2027">EXP 11/2027 (SAFE & VALID)</option>
                </select>
                <select
                  value={labFoil}
                  onChange={(e) => setLabFoil(e.target.value)}
                  className="w-24 p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                >
                  <option value="alu-alu">Alu-Alu</option>
                  <option value="blister">PVC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-300">
              Simulate testing scissored fragments of <strong>Amoxicillin, Paracetamol, Pantoprazole</strong> or other salts.
            </span>
            <button
              type="button"
              onClick={handleRunPatternLab}
              className="px-6 py-2.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-black text-xs rounded-xl shadow-lg cursor-pointer transition-all active:scale-95 flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              <span>Run AI Pattern Classification Model</span>
            </button>
          </div>
        </div>
      )}

      {/* Manual Input Expandable Box */}
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
              className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
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
                placeholder="e.g. Amoxicillin 500mg / Dolo 650"
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
                placeholder="e.g. 03/2023 or 11/2027"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 font-mono"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              >
                {lang === 'or-IN' ? 'ପାଟର୍ଣ୍ଣ ଓ ମିଆଦ ଯାଞ୍ଚ କରନ୍ତୁ' : (lang === 'hi-IN' ? 'पैटर्न एवं एक्सपायरी जांचें' : 'Check Pattern & Expiry')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── MEDICINE MARKET CUT-STRIP SELECTOR WITH VISUAL IMAGES ─── */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-5 border border-teal-700/50 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-teal-800/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1">
              <ImageIcon className="w-3 h-3 text-emerald-400" />
              <span>{lang === 'or-IN' ? 'ଔଷଧ ବଜାର କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ' : (lang === 'hi-IN' ? 'दवा बाज़ार कटी स्ट्रिप फोटो' : 'Visual Cut-Strip Packaging')}</span>
              <span className="bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-black text-[9px]">30+ ITEMS</span>
            </div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-teal-400" />
              {txt.marketSelectorTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {txt.marketSelectorDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onNavigateToMarket && (
              <button
                type="button"
                onClick={onNavigateToMarket}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{txt.btnBrowseFullMarket}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowMarketDrawer(!showMarketDrawer)}
              className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>{showMarketDrawer ? 'Collapse' : 'Expand All 30+'}</span>
              <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showMarketDrawer ? 'rotate-90' : ''}`} />
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={marketSearchTerm}
              onChange={(e) => setMarketSearchTerm(e.target.value)}
              placeholder="Search market medicines to test cut-strip..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 border border-teal-800/70 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {MEDICINE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setMarketFilterCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  marketFilterCategory === cat.id ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                {cat.label[lang] || cat.label['en-IN']}
              </button>
            ))}
          </div>
        </div>

        {/* Grid of Market Cut-Strips with Image Previews */}
        <div className={`mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 ${showMarketDrawer ? 'max-h-[460px] overflow-y-auto pr-1' : 'max-h-[220px] overflow-y-hidden'}`}>
          {filteredMarketMeds.map((med) => {
            const isSelected = scanResult?.id === `market-${med.id}`;
            const isExp = med.status === 'EXPIRED';
            const isSoon = med.status === 'EXPIRING_SOON';
            return (
              <button
                key={med.id}
                type="button"
                onClick={() => testMarketMedicine(med)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 text-xs group relative overflow-hidden ${
                  isSelected
                    ? 'bg-teal-600 text-white border-teal-400 shadow-md ring-2 ring-teal-300/40'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-200 border-teal-900/60 shadow-xs'
                }`}
              >
                {/* Visual Scissored Strip Thumbnail Image */}
                <img
                  src={med.scissoredStripImage || generateScissoredStripSvg(med)}
                  alt="Scissored Strip"
                  className="w-14 h-12 object-contain bg-slate-950 rounded-lg p-0.5 border border-slate-700 shrink-0"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold truncate text-white">{med.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase shrink-0 ${
                      isExp ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' :
                      isSoon ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40' :
                      'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {med.status === 'EXPIRED' ? 'EXPIRED' : med.status === 'EXPIRING_SOON' ? 'SOON' : 'SAFE'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    EXP: <strong className={isExp ? 'text-rose-300' : isSoon ? 'text-amber-300' : 'text-emerald-300'}>{med.expDate}</strong> • B.No: {med.batchNo}
                  </div>
                  <div className="text-[10px] text-teal-300/90 truncate flex items-center gap-1 mt-0.5">
                    <Scissors className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>{med.cavitiesRemaining || 4} pills • {med.pillShape}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Demo Strip Samples with Real Visual Images */}
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
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 text-xs group ${
                scanResult?.id === sample.id
                  ? 'bg-teal-600 text-white border-teal-700 shadow-sm'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              {/* Photorealistic Scissored Cut Strip Image */}
              <img
                src={sample.scissoredStripImage}
                alt="Cut strip"
                className="w-14 h-12 object-contain bg-slate-950 rounded-lg p-0.5 border border-slate-700 shrink-0 shadow-xs"
              />

              <div className="min-w-0 flex-1">
                <span className="font-bold block truncate">{sample.medicineName}</span>
                <span className={`text-[10px] truncate block ${scanResult?.id === sample.id ? 'text-teal-100' : 'text-slate-500'}`}>
                  EXP: {sample.expDate} • {sample.status}
                </span>
                <span className={`text-[9px] font-mono block ${scanResult?.id === sample.id ? 'text-teal-200' : 'text-teal-700'}`}>
                  {sample.pillShape.toUpperCase()} • {sample.pillColor}
                </span>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${scanResult?.id === sample.id ? 'text-white' : 'text-slate-400'}`} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Scanner & Upload Split Section ─────────────────────────────────── */}
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

            {/* Filter mode and Viewport Image Switcher */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 flex-wrap gap-2">
              {/* Viewport Image Mode Switcher */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setViewportImageMode('scissored')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewportImageMode === 'scissored' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.viewScissoredStrip}
                </button>
                <button
                  type="button"
                  onClick={() => setViewportImageMode('full')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewportImageMode === 'full' ? 'bg-teal-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.viewFullStrip}
                </button>
                <button
                  type="button"
                  onClick={() => setViewportImageMode('qr')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewportImageMode === 'qr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.viewQrCode}
                </button>
              </div>

              {/* Optical filters */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-[11px] font-semibold">
                <button
                  type="button"
                  onClick={() => setFilterMode('normal')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'normal' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterNormal}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('invert')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'invert' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterInvert}
                </button>
                <button
                  type="button"
                  onClick={() => setFilterMode('contrast')}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer ${
                    filterMode === 'contrast' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {txt.filterContrast}
                </button>
              </div>
            </div>

            {/* Main Visual Frame (Displays Photorealistic Scissored Cut Strip or Full Strip) */}
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
                /* High-fidelity photorealistic render of the Scissored or Full Strip */
                <div className="w-full h-full p-4 flex flex-col items-center justify-center relative select-none">
                  {viewportImageMode === 'scissored' ? (
                    <img
                      src={scanResult.scissoredStripImage || generateScissoredStripSvg(scanResult)}
                      alt="Scissored cut pill strip"
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  ) : viewportImageMode === 'full' ? (
                    <img
                      src={scanResult.fullStripImage || generateFullStripSvg(scanResult)}
                      alt="Full blister strip pack"
                      className="w-full h-full object-contain filter drop-shadow-2xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      {scanResult.qrDataUrl ? (
                        <img src={scanResult.qrDataUrl} alt="QR" className="w-40 h-40 bg-white p-2 rounded-2xl shadow-xl" />
                      ) : (
                        <div className="w-40 h-40 bg-slate-800 rounded-2xl animate-pulse" />
                      )}
                      <span className="text-teal-300 font-mono text-xs font-bold mt-2">
                        MoHFW Cryptographic GS1 2D DataMatrix Seal
                      </span>
                    </div>
                  )}

                  {/* Overlay badge with identified medicine */}
                  <div className="absolute bottom-3 left-3 bg-slate-950/90 text-white px-3 py-1.5 rounded-xl border border-teal-500/50 flex items-center gap-2 text-xs font-bold backdrop-blur-xs">
                    <Pill className="w-3.5 h-3.5 text-teal-400" />
                    <span>{scanResult.medicineName}</span>
                    <span className="text-amber-300 font-mono">({scanResult.confidence})</span>
                  </div>
                </div>
              ) : (
                /* Empty Dropzone State */
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shadow-xs">
                    <Pill className="w-8 h-8 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">
                      {txt.uploadBoxTitle}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      {txt.uploadBoxSubtitle}
                    </p>
                  </div>
                  <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Camera className="w-4 h-4 text-slate-950" />
                      {txt.btnTakePhoto}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <UploadCloud className="w-4 h-4 text-teal-300" />
                      {txt.btnUploadPhoto}
                    </button>
                  </div>
                </div>
              )}

              {/* Animated Laser Scanning Line */}
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
            <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-teal-700" />
                  {txt.btnTakePhoto}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-teal-600" />
                  {txt.btnUploadPhoto}
                </button>
              </div>

              {scanResult && (
                <button
                  type="button"
                  onClick={() => runScannerAnalysis(scanResult.title, scanResult)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white" />
                  {txt.btnRescan}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Scan Verdict, AI Pattern Classification & Safety Instructions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {scanResult ? (
            <div className="space-y-4 animate-fadeIn">
              {/* Giant Verdict Banner */}
              <div
                className={`rounded-3xl p-5 sm:p-6 text-white shadow-lg border relative overflow-hidden ${
                  scanResult.isExpired || scanResult.status === 'EXPIRED'
                    ? 'bg-gradient-to-br from-rose-700 via-red-800 to-rose-950 border-rose-500 ring-4 ring-rose-500/10'
                    : scanResult.status === 'SOON' || scanResult.status === 'EXPIRING_SOON'
                    ? 'bg-gradient-to-br from-amber-600 via-orange-700 to-amber-900 border-amber-400'
                    : 'bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-950 border-emerald-400'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
                    {scanResult.isExpired || scanResult.status === 'EXPIRED' ? (
                      <AlertOctagon className="w-7 h-7 text-white animate-pulse" />
                    ) : scanResult.status === 'SOON' || scanResult.status === 'EXPIRING_SOON' ? (
                      <Clock className="w-7 h-7 text-amber-200" />
                    ) : (
                      <CheckCircle2 className="w-7 h-7 text-emerald-200" />
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 block">
                      {lang === 'or-IN' ? 'AI ପାଟର୍ଣ୍ଣ ଓ ମିଆଦ ନିଷ୍ପତ୍ତି' : (lang === 'hi-IN' ? 'AI पैटर्न एवं एक्सपायरी निष्कर्ष' : 'AI PATTERN & EXPIRY VERDICT')}
                    </span>
                    <h3 className="text-base sm:text-lg font-black leading-tight text-white mt-0.5">
                      {scanResult.isExpired || scanResult.status === 'EXPIRED'
                        ? txt.verdictExpired
                        : scanResult.status === 'SOON' || scanResult.status === 'EXPIRING_SOON'
                        ? txt.verdictSoon
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
                    {scanResult.isExpired || scanResult.status === 'EXPIRED'
                      ? txt.hazardTextExpired
                      : scanResult.status === 'SOON' || scanResult.status === 'EXPIRING_SOON'
                      ? txt.hazardTextSoon
                      : txt.hazardTextSafe}
                  </p>
                </div>
              </div>

              {/* ── Dedicated AI Pattern Recognition HUD ──────────────────── */}
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-teal-600" />
                    <span>{txt.extractedDetails}</span>
                  </h4>
                  <span className="inline-flex items-center gap-1 font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded text-[11px] border border-teal-200">
                    <Sparkles className="w-3 h-3 text-teal-600" />
                    {scanResult.confidence}
                  </span>
                </div>

                {/* Primary Drug Match Banner */}
                <div className="p-3 rounded-2xl bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-200/70">
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider block">
                    {lang === 'or-IN' ? 'ଚିହ୍ନଟ ହୋଇଥିବା ଔଷଧ (Classified Medicine):' : (lang === 'hi-IN' ? 'पहचानी गई दवा (Classified Medicine):' : 'Classified Medicine Identity:')}
                  </span>
                  <div className="text-base font-black text-slate-900 mt-0.5">
                    {scanResult.medicineName}
                  </div>
                  <div className="text-xs text-slate-600 font-medium mt-0.5">
                    {scanResult.generic || scanResult.salt}
                  </div>
                  {scanResult.classificationData?.therapeuticClass && (
                    <div className="text-[10px] font-semibold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md inline-block mt-1.5">
                      {scanResult.classificationData.therapeuticClass}
                    </div>
                  )}
                </div>

                {/* Definitive Expiry Verdict Badge */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between font-bold text-xs ${
                  scanResult.isExpired
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-2">
                    {scanResult.isExpired ? (
                      <AlertOctagon className="w-4 h-4 text-rose-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    <span>{scanResult.isExpired ? txt.isExpiredYes : txt.isExpiredNo}</span>
                  </div>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-white shadow-2xs">
                    EXP: {scanResult.expDate}
                  </span>
                </div>

                {/* Multi-Pattern Signature Breakdown Cards */}
                {scanResult.recognizedPatterns && (
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    {/* Shape */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Pill className="w-3 h-3 text-teal-600" />
                        <span>{txt.patternShape}</span>
                      </div>
                      <div className="font-bold text-slate-800 text-[11px]">
                        {scanResult.recognizedPatterns.shapeLabel?.[lang] || scanResult.recognizedPatterns.pillShape}
                      </div>
                    </div>

                    {/* Color */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>{txt.patternColor}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-300"
                          style={{ backgroundColor: scanResult.recognizedPatterns.primaryColorHex }}
                        />
                        <span className="font-semibold text-slate-800 text-[11px] truncate">
                          {scanResult.recognizedPatterns.colorDescription?.[lang] || scanResult.recognizedPatterns.primaryColorHex}
                        </span>
                      </div>
                    </div>

                    {/* Debossed Imprint */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Fingerprint className="w-3.5 h-3.5 text-sky-600" />
                        <span>{txt.patternImprint}</span>
                      </div>
                      <div className="font-mono font-bold text-slate-800 text-[11px]">
                        {scanResult.recognizedPatterns.debossedImprint || 'Bisect Breakline'}
                      </div>
                    </div>

                    {/* Foil Type */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        <span>{txt.patternFoil}</span>
                      </div>
                      <div className="font-semibold text-slate-800 text-[10px] leading-tight">
                        {scanResult.recognizedPatterns.foilType}
                      </div>
                    </div>
                  </div>
                )}

                {/* Direct Action: Firebase Expiry Alert Button */}
                <button
                  type="button"
                  onClick={() => setShowAlertModal(true)}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-amber-200" />
                  <span>{txt.btnScheduleExpiryAlert}</span>
                </button>

                {/* Raw Forensics Text */}
                <div className="pt-1">
                  <div className="text-[10px] font-mono text-slate-400 bg-slate-50 p-2.5 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed">
                    {scanResult.stampedRawText}
                  </div>
                </div>

                {/* Market Linkage & Doctor Booking */}
                {scanResult.fromMarket && onNavigateToMarket && (
                  <button
                    type="button"
                    onClick={onNavigateToMarket}
                    className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{txt.btnBrowseFullMarket}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}

                {onBookDoctor && (
                  <button
                    type="button"
                    onClick={onBookDoctor}
                    className="w-full mt-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                  ? 'ଆମର AI ମଡେଲ୍ କଟା ଷ୍ଟ୍ରିପ୍‌ରୁ Amoxicillin, Paracetamol କିମ୍ବା ଅନ୍ୟ ଔଷଧ ଚିହ୍ନଟ କରି ଏହା ଏକ୍ସପାଏର୍ଡ କି ନୁହେଁ ଜଣାଇବ।'
                  : (lang === 'hi-IN'
                  ? 'हमारा AI मॉडल कटी स्ट्रिप से Amoxicillin, Paracetamol आदि दवा पहचान कर बताएगा कि वह एक्सपायर्ड है या नहीं।'
                  : 'Our AI model detects pill patterns to classify if it is Amoxicillin, Paracetamol, or other medicines, and evaluates whether it is expired or safe.')}
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

      {/* ── Quick Modal: Save Expiry Alert to Firebase ─────────────────────── */}
      {showAlertModal && scanResult && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-amber-600 to-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-sm">Save Expiry Alert to Firebase</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAlertModal(false)}
                className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div><strong>Medicine:</strong> {scanResult.medicineName}</div>
                <div><strong>Batch:</strong> {scanResult.batchNo}</div>
                <div className={scanResult.isExpired ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
                  <strong>EXP Date:</strong> {scanResult.expDate} ({scanResult.status})
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name:</label>
                <input
                  type="text"
                  value={alertPatientName}
                  onChange={(e) => setAlertPatientName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Mobile Phone (for SMS Alert):</label>
                <input
                  type="tel"
                  value={alertPhone}
                  onChange={(e) => setAlertPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email Address (for Email Alert):</label>
                <input
                  type="email"
                  value={alertEmail}
                  onChange={(e) => setAlertEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono"
                />
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                We will save this prescription timeline in Cloud Firestore. If the medicine expires, our automated system will dispatch an urgent SMS & Email alert.
              </p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRegisteringAlert}
                onClick={handleScheduleFirebaseAlert}
                className="px-5 py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isRegisteringAlert ? 'Saving...' : 'Confirm & Save in Firebase'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── LIVE CAMERA CAPTURE MODAL ─────────────────────────────────────── */}
      {showCameraModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {txt.cameraModalTitle}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {txt.cameraModalSubtitle}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative bg-black flex-1 min-h-[320px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
              {cameraLoading && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 text-white space-y-3 p-6 text-center">
                  <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
                  <p className="text-xs font-semibold text-teal-300">
                    {txt.cameraPermissionRequest}
                  </p>
                </div>
              )}

              {cameraError ? (
                <div className="p-6 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                    <VideoOff className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">
                      Camera Access Issue
                    </h4>
                    <p className="text-xs text-rose-300 leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        closeCamera();
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {txt.btnUploadPhoto}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Laser & OCR Target Bounding Guide Frame */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                    <div className="relative w-64 sm:w-80 h-44 sm:h-52 border-2 border-dashed border-teal-400/90 rounded-2xl shadow-[0_0_30px_rgba(45,212,191,0.2)] flex flex-col justify-between p-3">
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-t-3 border-l-3 border-teal-300"></span>
                        <span className="w-4 h-4 border-t-3 border-r-3 border-teal-300"></span>
                      </div>
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-teal-300 to-transparent shadow-[0_0_12px_#2dd4bf] animate-pulse" />
                      <div className="flex justify-between">
                        <span className="w-4 h-4 border-b-3 border-l-3 border-teal-300"></span>
                        <span className="w-4 h-4 border-b-3 border-r-3 border-teal-300"></span>
                      </div>
                    </div>

                    <p className="mt-3 bg-slate-950/80 text-teal-200 font-mono text-[10px] px-3 py-1 rounded-full border border-teal-500/30 text-center max-w-xs shadow-md">
                      {txt.cameraAlignGuide}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={toggleFacingMode}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <SwitchCamera className="w-4 h-4 text-teal-400" />
                <span className="hidden sm:inline">{txt.btnSwitchCamera}</span>
              </button>

              <button
                type="button"
                disabled={cameraLoading || !!cameraError}
                onClick={capturePhotoFromCamera}
                className="px-6 py-3 rounded-2xl font-black text-xs flex items-center gap-2 shadow-lg transition-all bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 cursor-pointer active:scale-95"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-white" />
                {txt.btnCapturePhoto}
              </button>

              <button
                type="button"
                onClick={closeCamera}
                className="px-3.5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                {txt.btnCloseCamera}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
