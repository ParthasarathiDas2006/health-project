import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import {
  Pill,
  Search,
  Filter,
  Scissors,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ShieldCheck,
  Building2,
  Sparkles,
  ExternalLink,
  Layers,
  Info,
  QrCode,
  X,
  ChevronRight,
  TrendingDown,
  ShoppingBag,
  ShoppingCart,
  ArrowRight,
  BadgeCheck,
  Zap,
  Tag,
  Plus,
  Minus,
  Check,
  Truck,
  CreditCard,
  Printer,
  Receipt,
  MapPin,
  Phone,
  User,
  PackageCheck,
  Mail,
  Bell,
  Smartphone,
  History,
  CheckCheck,
  Send,
  Eye,
  Image as ImageIcon
} from 'lucide-react';
import {
  MEDICINE_MARKET_DATABASE,
  MEDICINE_CATEGORIES
} from '../data/medicineMarketData';
import {
  saveMedicineOrderToFirebase,
  fetchMedicineOrdersFromFirebase,
  triggerMedicineExpiryAlert
} from '../services/firebaseDb';
import {
  generateFullStripSvg,
  generateScissoredStripSvg
} from '../utils/pillImageGenerator';

export default function MedicineMarketplace({
  appLang = 'or-IN',
  currentUser,
  onTestCutStrip,
  onNavigateTab
}) {
  const lang = appLang || 'or-IN';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all'); // 'all' | 'SAFE' | 'EXPIRING_SOON' | 'EXPIRED'
  const [onlyJanAushadhi, setOnlyJanAushadhi] = useState(false);
  const [inspectModalMed, setInspectModalMed] = useState(null);
  const [inspectViewMode, setInspectViewMode] = useState('scissored'); // 'scissored' | 'full' | 'qr'
  const [cardImageModes, setCardImageModes] = useState({}); // { [medId]: 'scissored' | 'full' | 'qr' }
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState({});
  const [spotlightMedId, setSpotlightMedId] = useState('MED-MOX-500');
  const [spotlightViewMode, setSpotlightViewMode] = useState('scissored'); // 'scissored' | 'full' | 'qr'
  const [spotlightQty, setSpotlightQty] = useState(1);

  // ── Cart & Purchase State ──────────────────────────────────────────────────
  const [cartItems, setCartItems] = useState({}); // { [medId]: { medicine, quantity } }
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutDirectMed, setCheckoutDirectMed] = useState(null);
  const [checkoutDirectQty, setCheckoutDirectQty] = useState(1);
  const [deliveryMode, setDeliveryMode] = useState('pickup'); // 'pickup' | 'delivery'
  const [selectedKendra, setSelectedKendra] = useState('PMBJP Kendra #1042 - Capital Hospital Road, Unit-6, Bhubaneswar');
  const [paymentMethod, setPaymentMethod] = useState('bsky'); // 'bsky' | 'upi' | 'cod'
  const [patientName, setPatientName] = useState(currentUser?.name || 'Ransuman Sahoo');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '9876543210');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || 'ransuman.sahoo@gmail.com');
  const [patientAddress, setPatientAddress] = useState('Plot 42, Saheed Nagar, Bhubaneswar, Odisha - 751007');
  const [enableExpiryAlerts, setEnableExpiryAlerts] = useState(true);
  const [orderReceipt, setOrderReceipt] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [firestoreSyncStatus, setFirestoreSyncStatus] = useState(null);

  // ── My Orders & Firebase Expiry Tracking State ─────────────────────────────
  const [showOrdersDrawer, setShowOrdersDrawer] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [sentAlertNotification, setSentAlertNotification] = useState(null);

  // Generate QR codes for all medicines on mount
  useEffect(() => {
    let isMounted = true;
    const generateAllQrs = async () => {
      const qrs = {};
      for (const med of MEDICINE_MARKET_DATABASE) {
        try {
          const url = await QRCode.toDataURL(med.qrData, {
            width: 160,
            margin: 1,
            color: { dark: '#0f172a', light: '#ffffff' }
          });
          qrs[med.id] = url;
        } catch (err) {
          console.warn('QR generation note:', err);
        }
      }
      if (isMounted) setQrCodeDataUrls(qrs);
    };

    generateAllQrs();
    return () => { isMounted = false; };
  }, []);

  // Fetch orders from Firebase / LocalStorage on mount
  useEffect(() => {
    const loadOrders = async () => {
      const orders = await fetchMedicineOrdersFromFirebase();
      setUserOrders(orders);
    };
    loadOrders();
  }, []);

  // Trilingual Localization
  const txt = {
    'or-IN': {
      heroTitle: 'ଜନ ଔଷଧି ବଜାର ଓ ସ୍ମାର୍ଟ ଫାର୍ମାସୀ',
      heroSubtitle: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଭାରତୀୟ ଜନଔଷଧି କେନ୍ଦ୍ର (PMBJP) ଓ ଜେନେରିକ୍ ଔଷଧ ବଜାର। କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ କିମ୍ବା ସମ୍ପୂର୍ଣ୍ଣ ଷ୍ଟ୍ରିପ୍ ଦେଖି ସୁଲଭ ମୂଲ୍ୟରେ ଔଷଧ କିଣନ୍ତୁ। କିଣିବା ପରେ Firebase ରେ ରେକର୍ଡ ସଂରକ୍ଷିତ ହେବ ଏବଂ ମିଆଦ ସରିବା ପୂର୍ବରୁ SMS/Email ଆଲର୍ଟ ମିଳିବ।',
      searchPlaceholder: 'ଔଷଧର ନାମ, ସଲ୍ଟ, ରୋଗ ବା ବ୍ୟାଚ୍ ନମ୍ବର ସର୍ଚ୍ଚ କରନ୍ତୁ (ଉଦା: Amoxicillin, Dolo, BP)...',
      allCategories: 'ସମସ୍ତ ବର୍ଗ',
      testScannerBtn: '✂️ କଟା ଷ୍ଟ୍ରିପ୍ AI ସ୍କାନର୍ କୁ ଯାଆନ୍ତୁ',
      myOrdersBtn: '📦 ମୋ ଅର୍ଡର ଓ ଏକ୍ସପାଏରୀ ଆଲର୍ଟ',
      filterAll: 'ସମସ୍ତ',
      filterSafe: '✅ ସୁରକ୍ଷିତ (ବୈଧ)',
      filterSoon: '⚠️ ଶୀଘ୍ର ମିଆଦ ସରିବ',
      filterExpired: '🚨 ଏକ୍ସପାଏର୍ଡ (ଟେଷ୍ଟ୍ ନମୁନା)',
      onlyJanAushadhiBadge: 'କେବଳ ଜନ ଔଷଧି (୮୦% ଶସ୍ତା)',
      btnTestCutStrip: '✂️ କଟା ଷ୍ଟ୍ରିପ୍ ସ୍କାନର୍',
      btnInspect: '🔍 ବ୍ଲିଷ୍ଟର ଫଟୋ ଓ QR',
      btnBuyNow: '🛍️ ଔଷଧ କିଣନ୍ତୁ (Buy Now)',
      btnAddToCart: 'କାର୍ଟରେ ଯୋଡ଼ନ୍ତୁ',
      viewCart: 'କାର୍ଟ ଦେଖନ୍ତୁ',
      mrpLabel: 'ବଜାର ମୂଲ୍ୟ (MRP):',
      janPriceLabel: 'ଜନ ଔଷଧି ମୂଲ୍ୟ:',
      saveUpto: 'ସଞ୍ଚୟ',
      batchLabel: 'ବ୍ୟାଚ୍:',
      expLabel: 'EXP ତାରିଖ:',
      mfgLabel: 'MFG:',
      dosageForm: 'ଫର୍ମ:',
      manufacturer: 'ନିର୍ମାତା:',
      statusSafe: 'ସୁରକ୍ଷିତ ଓ ବୈଧ',
      statusSoon: 'ଶୀଘ୍ର ମିଆଦ ସରିବ',
      statusExpired: 'ଏକ୍ସପାଏର୍ଡ (ମିଆଦ ସରିଛି)',
      modalTitle: 'ଔଷଧ ପ୍ୟାକେଜିଂ, ଫଟୋ ଓ QR ସିକ୍ୟୁରିଟି ଯାଞ୍ଚ',
      modalSub: 'ପ୍ରମାଣିକ ବ୍ଲିଷ୍ଟର ଫଏଲ୍ ଫଟୋ, କଟା ଅଂଶ ସିମୁଲେସନ୍ ଏବଂ 2D ସୁରକ୍ଷା QR କୋଡ୍',
      indications: 'ବ୍ୟବହାର / ଲକ୍ଷଣ:',
      storage: 'ସଂରକ୍ଷଣ ନିୟମ:',
      qrVerified: '✓ ସ୍ୱାସ୍ଥ୍ୟ ମନ୍ତ୍ରଣାଳୟ ଯାଞ୍ଚିତ QR କୋଡ୍',
      checkoutTitle: 'ଔଷଧ ଅର୍ଡର ଓ Firebase ଡାଟାବେସ୍ ବୁକିଂ',
      checkoutSub: 'ପ୍ରଧାନମନ୍ତ୍ରୀ ଜନ ଔଷଧି କେନ୍ଦ୍ର (PMBJP) • ସ୍ୱୟଂଚାଳିତ SMS ଏକ୍ସପାଏରୀ ସତର୍କତା',
      deliveryOption: 'ଔଷଧ ପ୍ରାପ୍ତି ପ୍ରଣାଳୀ:',
      pickupKendra: '🏥 ଜନ ଔଷଧି କେନ୍ଦ୍ରରୁ ସିଧା ସଂଗ୍ରହ (ମାଗଣା - ୧୫ ମିନିଟ୍ ମଧ୍ୟରେ ଉପଲବ୍ଧ)',
      expressDelivery: '🚚 ଏକ୍ସପ୍ରେସ୍ ହୋମ୍ ଡେଲିଭରୀ (୨ ଘଣ୍ଟା ମଧ୍ୟରେ ଘରେ ପହଞ୍ଚିବ)',
      selectKendraLabel: 'ନିକଟସ୍ଥ ଜନ ଔଷଧି କେନ୍ଦ୍ର ବାଛନ୍ତୁ:',
      patientDetails: 'ରୋଗୀ ଓ କ୍ରେତାଙ୍କ ବିବରଣୀ (Firebase ରେ ସୁରକ୍ଷିତ ରହିବ):',
      patientNameLabel: 'ନାମ:',
      phoneLabel: 'ମୋବାଇଲ୍ ନମ୍ବର (SMS ଆଲର୍ଟ ପାଇଁ):',
      emailLabel: 'ଇମେଲ୍ ଠିକଣା (Email ଆଲର୍ଟ ପାଇଁ):',
      addressLabel: 'ଠିକଣା / ପିନ୍ କୋଡ୍:',
      firebaseExpiryAlertNotice: '🔔 ମିଆଦ ସରିବା ପୂର୍ବରୁ SMS ଏବଂ Email ସତର୍କତା ପାଆନ୍ତୁ',
      paymentOption: 'ପେମେଣ୍ଟ୍ ମୋଡ୍:',
      payBsky: '💳 BSKY ସ୍ମାର୍ଟ କାର୍ଡ (ଓଡ଼ିଶା ସରକାରଙ୍କ ୧୦୦% ମାଗଣା କ୍ୟାସଲେସ୍)',
      payUpi: '📱 UPI (GPay, PhonePe, Paytm, BHIM)',
      payCod: '💵 କ୍ୟାସ୍ ଅନ୍ ଡେଲିଭରୀ / କେନ୍ଦ୍ରରେ ଦେୟ',
      expiredSafeguardTitle: 'ରୋଗୀ ସୁରକ୍ଷା ସତର୍କତା (Patient Safety Guard):',
      expiredSafeguardText: 'ଚୟନ କରାଯାଇଥିବା ବ୍ୟାଚ୍‌ଟି କେବଳ ଟେଷ୍ଟିଂ ନମୁନା ଥିଲା। ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ସୁରକ୍ଷା ପାଇଁ, ଆମେ ସ୍ୱୟଂଚାଳିତ ଭାବରେ ସଦ୍ୟ ଏବଂ ବୈଧ PMBJP ଜନଔଷଧି ଷ୍ଟକ୍ (EXP: 11/2028) ସହିତ ବଦଳାଇ ଦେଇଛୁ। ଆପଣଙ୍କୁ ୧୦୦% ସୁରକ୍ଷିତ ଔଷଧ ମିଳିବ।',
      totalMrp: 'ମୋଟ ବଜାର ମୂଲ୍ୟ (MRP):',
      janSubsidized: 'ଜନ ଔଷଧି ରିହାତି ମୂଲ୍ୟ:',
      totalSavings: 'ଆପଣଙ୍କ ମୋଟ ସଞ୍ଚୟ:',
      btnConfirmOrder: '✓ ଅର୍ଡର ନିଶ୍ଚିତ କରନ୍ତୁ ଓ Firebase ରେ ସେଭ୍ କରନ୍ତୁ',
      orderSuccessTitle: 'ଅର୍ଡର ସଫଳତାପୂର୍ବକ ଗୃହୀତ ହୋଇଛି!',
      orderSuccessSub: 'ଆପଣଙ୍କ ଡାଟା Cloud Firestore ରେ ସୁରକ୍ଷିତ ଭାବେ ସଂରକ୍ଷିତ ହୋଇଛି। ମିଆଦ ସରିବା ପୂର୍ବରୁ SMS ଏବଂ Email ପଠାଯିବ।',
      orderIdLabel: 'ଅର୍ଡର ନମ୍ବର:',
      firebaseStoredBadge: '✓ Firebase Cloud Firestore ରେ ସେଭ୍ ହୋଇଛି',
      testSmsBtn: '📲 ଏକ୍ସପାଏରୀ SMS ଓ Email ଆଲର୍ଟ ପରୀକ୍ଷା କରନ୍ତୁ',
      printReceipt: '🖨️ ରସିଦ୍ ପ୍ରିଣ୍ଟ୍ କରନ୍ତୁ',
      testPurchasedInScanner: '✂️ ଏହି ଔଷଧକୁ କଟା ଷ୍ଟ୍ରିପ୍ ସ୍କାନର୍‌ରେ ଯାଞ୍ଚ କରନ୍ତୁ',
      btnDone: 'ସମ୍ପନ୍ନ (Done)',
      tabCutStripImg: '✂️ କଟା ଷ୍ଟ୍ରିପ୍ ଫଟୋ (Cut Strip)',
      tabFullStripImg: '🖼️ ପୂର୍ଣ୍ଣ ଷ୍ଟ୍ରିପ୍ ଫଟୋ (Full Pack)',
      tabQrCode: '📱 2D QR ସିଲ୍'
    },
    'hi-IN': {
      heroTitle: 'जन औषधि बाज़ार एवं स्मार्ट फ़ार्मेसी',
      heroSubtitle: 'प्रधानमंत्री भारतीय जनऔषधि परियोजना (PMBJP) एवं जेनेरिक दवा बाज़ार। कटी स्ट्रिप अथवा पूरी स्ट्रिप की फोटो देखकर दवा खरीदें। डेटा Firebase में सुरक्षित रहेगा और एक्सपायरी होने पर SMS/ईमेल अलर्ट भेजा जाएगा।',
      searchPlaceholder: 'दवा का नाम, सॉल्ट, रोग या बैच नंबर खोजें (उदा: Amoxicillin, Dolo, BP)...',
      allCategories: 'सभी श्रेणियां',
      testScannerBtn: '✂️ कटी स्ट्रिप AI स्कैनर खोलें',
      myOrdersBtn: '📦 मेरे ऑर्डर एवं एक्सपायरी अलर्ट',
      filterAll: 'सभी',
      filterSafe: '✅ सुरक्षित (वैध)',
      filterSoon: '⚠️ जल्द समाप्त',
      filterExpired: '🚨 एक्सपायर्ड (टेस्ट नमूने)',
      onlyJanAushadhiBadge: 'केवल जन औषधि (80% बचत)',
      btnTestCutStrip: '✂️ कटी स्ट्रिप स्कैनर',
      btnInspect: '🔍 ब्लिस्टर फोटो व QR',
      btnBuyNow: '🛍️ दवा खरीदें (Buy Now)',
      btnAddToCart: 'कार्ट में जोड़ें',
      viewCart: 'कार्ट देखें',
      mrpLabel: 'बाज़ार मूल्य (MRP):',
      janPriceLabel: 'जन औषधि मूल्य:',
      saveUpto: 'बचत',
      batchLabel: 'बैच:',
      expLabel: 'EXP तारीख:',
      mfgLabel: 'MFG:',
      dosageForm: 'प्रकार:',
      manufacturer: 'निर्माता:',
      statusSafe: 'सुरक्षित एवं वैध',
      statusSoon: 'जल्द समाप्त होने वाली',
      statusExpired: 'एक्सपायर्ड (अवैध)',
      modalTitle: 'दवा पैकेजिंग, फोटो एवं QR सुरक्षा निरीक्षण',
      modalSub: 'प्रामाणिक ब्लिस्टर फ़ॉइल फोटो, कटी हुई स्ट्रिप सिमुलेशन एवं 2D सुरक्षा QR कोड',
      indications: 'उपयोग एवं संकेत:',
      storage: 'भंडारण निर्देश:',
      qrVerified: '✓ स्वास्थ्य मंत्रालय सत्यापित QR कोड',
      checkoutTitle: 'दवा खरीद एवं Firebase डेटाबेस बुकिंग',
      checkoutSub: 'प्रधानमंत्री जन औषधि केंद्र (PMBJP) • स्वचालित SMS एक्सपायरी अलर्ट',
      deliveryOption: 'दवा प्राप्ति माध्यम:',
      pickupKendra: '🏥 जन औषधि केंद्र से स्वयं लें (निःशुल्क - 15 मिनट में तैयार)',
      expressDelivery: '🚚 एक्सप्रेस होम डिलीवरी (2 घंटे के भीतर घर पर)',
      selectKendraLabel: 'निकटतम जन औषधि केंद्र चुनें:',
      patientDetails: 'मरीज व खरीदार का विवरण (Firebase में सुरक्षित):',
      patientNameLabel: 'नाम:',
      phoneLabel: 'मोबाइल नंबर (SMS अलर्ट हेतु):',
      emailLabel: 'ईमेल पता (Email अलर्ट हेतु):',
      addressLabel: 'पता / पिन कोड:',
      firebaseExpiryAlertNotice: '🔔 एक्सपायरी से पहले स्वचालित SMS और ईमेल अलर्ट प्राप्त करें',
      paymentOption: 'भुगतान विकल्प:',
      payBsky: '💳 BSKY स्मार्ट कार्ड (ओडिशा सरकार 100% कैशलेस)',
      payUpi: '📱 UPI (GPay, PhonePe, Paytm, BHIM)',
      payCod: '💵 कैश ऑन डिलीवरी / केंद्र पर भुगतान',
      expiredSafeguardTitle: 'रोगी सुरक्षा गारंटी (Safety Guard):',
      expiredSafeguardText: 'चुना गया बैच परीक्षण नमूना था। आपके स्वास्थ्य की सुरक्षा हेतु हमने आपके ऑर्डर को तुरंत ताज़ा एवं वैध PMBJP जन औषधि स्टॉक (EXP: 11/2028) से बदल दिया है।',
      totalMrp: 'कुल बाज़ार मूल्य (MRP):',
      janSubsidized: 'जन औषधि रियायती मूल्य:',
      totalSavings: 'आपकी कुल बचत:',
      btnConfirmOrder: '✓ ऑर्डर बुक करें एवं Firebase में सेव करें',
      orderSuccessTitle: 'ऑर्डर सफलतापूर्वक दर्ज हो गया!',
      orderSuccessSub: 'आपका डेटा Cloud Firestore में सुरक्षित रूप से दर्ज है। एक्सपायरी से पूर्व SMS और Email सूचना भेजी जाएगी।',
      orderIdLabel: 'ऑर्डर नंबर:',
      firebaseStoredBadge: '✓ Firebase Cloud Firestore में सुरक्षित',
      testSmsBtn: '📲 एक्सपायरी SMS व Email अलर्ट टेस्ट करें',
      printReceipt: '🖨️ रसीद प्रिंट करें',
      testPurchasedInScanner: '✂️ इस दवा को कटी स्ट्रिप स्कैनर में जांचें',
      btnDone: 'समाप्त (Done)',
      tabCutStripImg: '✂️ कटी स्ट्रिप फोटो (Cut Strip)',
      tabFullStripImg: '🖼️ पूरा पत्ता फोटो (Full Pack)',
      tabQrCode: '📱 2D QR कोड'
    },
    'en-IN': {
      heroTitle: 'Jan Aushadhi Medicine Market & Smart Pharmacy',
      heroSubtitle: 'Direct public health pharmacy network under PMBJP. View realistic scissored cut pill strip photos and full strip packaging to buy subsidized medicines. Your purchase is saved in Firebase to send automatic SMS/Email alerts when medicines expire.',
      searchPlaceholder: 'Search brand name, generic salt, condition or batch (e.g. Amoxicillin, Dolo, BP)...',
      allCategories: 'All Categories',
      testScannerBtn: '✂️ Open Cut-Strip AI Scanner',
      myOrdersBtn: '📦 My Orders & Expiry Alerts',
      filterAll: 'All',
      filterSafe: '✅ Safe & Valid',
      filterSoon: '⚠️ Expiring Soon',
      filterExpired: '🚨 Expired (Test Cases)',
      onlyJanAushadhiBadge: 'Jan Aushadhi Subsidized (Save 80%)',
      btnTestCutStrip: '✂️ Test Cut Strip',
      btnInspect: '🔍 Inspect Photo & QR',
      btnBuyNow: '🛍️ Buy Medicine',
      btnAddToCart: 'Add to Cart',
      viewCart: 'View Cart',
      mrpLabel: 'Market MRP:',
      janPriceLabel: 'Jan Aushadhi Price:',
      saveUpto: 'Save',
      batchLabel: 'Batch:',
      expLabel: 'EXP Date:',
      mfgLabel: 'MFG:',
      dosageForm: 'Pack Form:',
      manufacturer: 'Manufacturer:',
      statusSafe: 'Safe & Valid',
      statusSoon: 'Expiring Soon',
      statusExpired: 'Expired (Unsafe)',
      modalTitle: 'Pharmaceutical Blister, Photo & QR Security Inspection',
      modalSub: 'Realistic full blister pack images, scissors-cut foil simulation, and cryptographic 2D QR Code seal',
      indications: 'Indications & Uses:',
      storage: 'Storage Instructions:',
      qrVerified: '✓ MoHFW Verified Authentication QR Seal',
      checkoutTitle: 'Medicine Order & Cloud Firebase Registration',
      checkoutSub: 'PMBJP Network • Automated SMS & Email Expiry Alert Notification Protection',
      deliveryOption: 'Fulfillment & Delivery Method:',
      pickupKendra: '🏥 Free Pickup at Jan Aushadhi Kendra (Ready in 15 mins)',
      expressDelivery: '🚚 Express Doorstep Delivery (Within 2 Hours across Odisha)',
      selectKendraLabel: 'Select Designated Jan Aushadhi Kendra:',
      patientDetails: 'Buyer & Patient Details (Stored in Cloud Firestore):',
      patientNameLabel: 'Full Name:',
      phoneLabel: 'Mobile Phone (for Expiry SMS):',
      emailLabel: 'Email Address (for Expiry Email):',
      addressLabel: 'Delivery Address & PIN:',
      firebaseExpiryAlertNotice: '🔔 Automatically alert me by SMS and Email when this medicine expires',
      paymentOption: 'Payment Method:',
      payBsky: '💳 BSKY Health Card (100% Cashless Govt of Odisha Scheme)',
      payUpi: '📱 UPI (Google Pay, PhonePe, Paytm, BHIM)',
      payCod: '💵 Cash on Delivery / Pay at Kendra Counter',
      expiredSafeguardTitle: 'Patient Safety & Drug Efficacy Guard:',
      expiredSafeguardText: 'The selected item was flagged as an expired test scenario. To safeguard patient safety, our clinical system has automatically swapped your order to freshly manufactured, active PMBJP Jan Aushadhi stock (Batch: PMB-2026X, EXP: 11/2028). You will receive 100% genuine and safe medication.',
      totalMrp: 'Total Market MRP:',
      janSubsidized: 'Subsidized Jan Aushadhi Price:',
      totalSavings: 'Total Public Subsidy Savings:',
      btnConfirmOrder: '✓ Confirm Order & Save to Firebase',
      orderSuccessTitle: 'Medicine Order Successfully Registered!',
      orderSuccessSub: 'Your buyer details are saved in Cloud Firestore. Automated SMS and Email notifications will alert you prior to expiration.',
      orderIdLabel: 'Order Reference ID:',
      firebaseStoredBadge: '✓ Stored in Firebase Cloud Firestore',
      testSmsBtn: '📲 Test Send Expiry Alert SMS & Email Now',
      printReceipt: '🖨️ Print Invoice & Receipt',
      testPurchasedInScanner: '✂️ Test This Strip in Cut-Strip Expiry Scanner',
      btnDone: 'Done',
      tabCutStripImg: '✂️ Scissored Cut Strip Photo',
      tabFullStripImg: '🖼️ Full Strip Pack Photo',
      tabQrCode: '📱 2D QR Code'
    }
  }[lang] || {};

  const JAN_AUSHADHI_KENDRAS = [
    'PMBJP Kendra #1042 - Capital Hospital Road, Unit-6, Bhubaneswar',
    'PMBJP Kendra #882 - SCB Medical College Gate #2, Cuttack',
    'PMBJP Kendra #319 - District HQ Hospital Campus, Balasore',
    'PMBJP Kendra #450 - MKCG Medical College Main Gate, Berhampur',
    'PMBJP Kendra #710 - Rourkela Govt Hospital Road, Panposh, Rourkela'
  ];

  // Filtered medicines
  const filteredMedicines = useMemo(() => {
    return MEDICINE_MARKET_DATABASE.filter((med) => {
      if (selectedCategory !== 'all' && med.category !== selectedCategory) return false;
      if (selectedStatusFilter !== 'all' && med.status !== selectedStatusFilter) return false;
      if (onlyJanAushadhi && med.janAushadhiPrice === med.mrp) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = med.name.toLowerCase().includes(q);
        const matchesGeneric = med.generic.toLowerCase().includes(q);
        const matchesBatch = med.batchNo.toLowerCase().includes(q);
        const matchesIndications = med.indications.toLowerCase().includes(q);
        const matchesMfr = med.manufacturer.toLowerCase().includes(q);
        if (!matchesName && !matchesGeneric && !matchesBatch && !matchesIndications && !matchesMfr) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedStatusFilter, onlyJanAushadhi]);

  // Handler to test a medicine in the Expiry Scanner
  const handleLaunchTest = (med) => {
    if (onTestCutStrip) {
      onTestCutStrip(med, qrCodeDataUrls[med.id]);
    } else if (onNavigateTab) {
      onNavigateTab('expiry');
    }
  };

  // Instant Buy Now trigger
  const handleInitiateBuyNow = (med) => {
    setCheckoutDirectMed(med);
    setCheckoutDirectQty(1);
    setShowCheckoutModal(true);
  };

  // Add / Remove from Cart
  const handleUpdateCartQuantity = (med, delta) => {
    setCartItems((prev) => {
      const currentQty = prev[med.id]?.quantity || 0;
      const nextQty = Math.max(0, currentQty + delta);
      if (nextQty === 0) {
        const nextState = { ...prev };
        delete nextState[med.id];
        return nextState;
      }
      return {
        ...prev,
        [med.id]: { medicine: med, quantity: nextQty }
      };
    });
  };

  const totalCartCount = useMemo(() => {
    return Object.values(cartItems).reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Pricing calculations for Checkout
  const checkoutItems = useMemo(() => {
    if (checkoutDirectMed) {
      return [{ medicine: checkoutDirectMed, quantity: checkoutDirectQty }];
    }
    return Object.values(cartItems);
  }, [checkoutDirectMed, checkoutDirectQty, cartItems]);

  const pricingTotals = useMemo(() => {
    let mrpTotal = 0;
    let janTotal = 0;
    let hasExpiredBatch = false;

    checkoutItems.forEach(({ medicine, quantity }) => {
      mrpTotal += medicine.mrp * quantity;
      janTotal += medicine.janAushadhiPrice * quantity;
      if (medicine.status === 'EXPIRED') hasExpiredBatch = true;
    });

    const savings = Math.max(0, mrpTotal - janTotal);
    return {
      mrpTotal: mrpTotal.toFixed(2),
      janTotal: janTotal.toFixed(2),
      savings: savings.toFixed(2),
      hasExpiredBatch
    };
  }, [checkoutItems]);

  // Execute Order Placement & Store in Firebase
  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    const generatedOrderId = `PMBJP-OD-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderData = {
      orderId: generatedOrderId,
      date: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      items: [...checkoutItems],
      mrpTotal: pricingTotals.mrpTotal,
      janTotal: pricingTotals.janTotal,
      savings: pricingTotals.savings,
      deliveryMode,
      kendra: selectedKendra,
      paymentMethod,
      patientName,
      patientPhone,
      patientEmail,
      address: patientAddress,
      hasExpiredSubstituted: pricingTotals.hasExpiredBatch,
      enableExpiryAlerts
    };

    // Store in Cloud Firestore & LocalStorage
    const saveResult = await saveMedicineOrderToFirebase(orderData);
    setFirestoreSyncStatus(saveResult.firestoreSaved ? 'FIRESTORE_SYNCED' : 'LOCAL_PERSISTED');

    setIsPlacingOrder(false);
    setOrderReceipt({ ...orderData, firestoreSaved: saveResult.firestoreSaved });
    setShowCheckoutModal(false);
    setCartItems({});
    setCheckoutDirectMed(null);

    // Refresh user orders list
    const updated = await fetchMedicineOrdersFromFirebase();
    setUserOrders(updated);
  };

  // Test send simulated SMS & Email Expiry Alert
  const handleTestSendExpiryAlert = async (order) => {
    const med = order.items?.[0]?.medicine || { name: 'Mox 500', batchNo: 'AMX-4410X', expDate: '03/2023' };
    const alertRes = await triggerMedicineExpiryAlert({
      orderId: order.orderId,
      medicineName: med.name,
      batchNo: med.batchNo,
      expDate: med.expDate,
      phone: order.patientPhone || order.buyerPhone,
      email: order.patientEmail || order.buyerEmail,
      patientName: order.patientName || order.buyerName
    });

    setSentAlertNotification({
      orderId: order.orderId,
      phone: order.patientPhone || order.buyerPhone,
      email: order.patientEmail || order.buyerEmail,
      message: alertRes.smsMessage,
      time: new Date().toLocaleTimeString()
    });

    // Refresh orders to reflect dispatched flag
    const updated = await fetchMedicineOrdersFromFirebase();
    setUserOrders(updated);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 font-sans">
      {/* ── 1. Top Hero Banner ────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-teal-700/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>PMBJP Jan Aushadhi • Firebase Expiry Alert Protection</span>
              <span className="bg-amber-400 text-slate-950 text-[10px] px-2 py-0.2 rounded-full font-black">
                80% OFF
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Pill className="w-8 h-8 text-teal-400" />
              <span>{txt.heroTitle}</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {txt.heroSubtitle}
            </p>
          </div>

          {/* Cart, Orders, and Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 self-start md:self-auto shrink-0">
            {/* View Orders & Expiry Alerts Button */}
            <button
              type="button"
              onClick={() => setShowOrdersDrawer(true)}
              className="px-4 py-3 bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-indigo-400/30"
            >
              <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{txt.myOrdersBtn}</span>
              <span className="bg-white text-indigo-950 px-2 py-0.2 rounded-full text-[10px] font-black">
                {userOrders.length}
              </span>
            </button>

            {totalCartCount > 0 && (
              <button
                type="button"
                onClick={() => {
                  setCheckoutDirectMed(null);
                  setShowCheckoutModal(true);
                }}
                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-emerald-400/40 animate-pulse"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-100" />
                <span>{txt.viewCart} ({totalCartCount})</span>
                <span className="bg-white text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                  ₹{pricingTotals.janTotal}
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigateTab && onNavigateTab('expiry')}
              className="px-4 py-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer border border-rose-400/40 group active:scale-98"
            >
              <Scissors className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
              <span>{txt.testScannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlight Pills Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span><strong>Full Blister & Scissored Strip Images</strong> on all medicines</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-teal-400" />
            <span><strong>Firebase Stored SMS & Email Expiry Alerts</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span><strong>BSKY 100% Cashless</strong> Govt. Healthcare</span>
          </div>
        </div>
      </div>

      {/* ── Active Alert Sent Toast Banner ─────────────────────────────────── */}
      {sentAlertNotification && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-xl flex items-center justify-between gap-3 animate-scaleUp">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5 text-white animate-bounce" />
            </div>
            <div>
              <div className="font-black text-xs sm:text-sm flex items-center gap-2">
                <span>📲 SMS & Email Expiry Alert Dispatched!</span>
                <span className="text-[10px] bg-black/25 px-2 py-0.2 rounded font-mono">{sentAlertNotification.time}</span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5 line-clamp-1">
                To: {sentAlertNotification.phone} / {sentAlertNotification.email} — "{sentAlertNotification.message}"
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSentAlertNotification(null)}
            className="p-1 hover:bg-white/20 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── 2. Search & Filter Bar ────────────────────────────────────────── */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={txt.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-400 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Expiry Status Filter Segment */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {txt.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('SAFE')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'SAFE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
              }`}
            >
              {txt.filterSafe}
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('EXPIRING_SOON')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'EXPIRING_SOON'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
            >
              {txt.filterSoon}
            </button>
            <button
              type="button"
              onClick={() => setSelectedStatusFilter('EXPIRED')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === 'EXPIRED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40'
              }`}
            >
              {txt.filterExpired}
            </button>
          </div>
        </div>

        {/* Therapeutic Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {MEDICINE_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const label = cat.label[lang] || cat.label['en-IN'];
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Featured Medicine Inspection & Cut Strip Showcase ── */}
      {(() => {
        const spotlightMed = MEDICINE_MARKET_DATABASE.find(m => m.id === spotlightMedId) || filteredMedicines[0] || MEDICINE_MARKET_DATABASE[0];
        if (!spotlightMed) return null;
        const spotlightSavings = Math.round(((spotlightMed.mrp - spotlightMed.janAushadhiPrice) / spotlightMed.mrp) * 100);
        const spotlightScissored = spotlightMed.scissoredStripImage || generateScissoredStripSvg(spotlightMed);
        const spotlightFull = spotlightMed.fullStripImage || generateFullStripSvg(spotlightMed);
        const spotlightQr = qrCodeDataUrls[spotlightMed.id];

        return (
          <div className="bg-slate-900/90 text-white rounded-3xl p-5 sm:p-7 border border-teal-500/40 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              {/* Left Column: Featured Inspection Card (7 cols) */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold block">
                        FEATURED MEDICINE INSPECTION CARD
                      </span>
                      <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
                        {spotlightMed.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-medium">{spotlightMed.generic}</p>
                    </div>

                    {/* 3-Tab Visual Packaging Switcher */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                      <button
                        type="button"
                        onClick={() => setSpotlightViewMode('scissored')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          spotlightViewMode === 'scissored'
                            ? 'bg-rose-600 text-white font-black shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ✂️ Cut Strip View
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpotlightViewMode('full')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          spotlightViewMode === 'full'
                            ? 'bg-teal-600 text-white font-black shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        💊 Full Strip
                      </button>
                      <button
                        type="button"
                        onClick={() => setSpotlightViewMode('qr')}
                        className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                          spotlightViewMode === 'qr'
                            ? 'bg-indigo-600 text-white font-black shadow-md'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📱 2D QR Code
                      </button>
                    </div>
                  </div>

                  {/* Packaging Visual Canvas */}
                  <div className="my-4 aspect-16/9 rounded-2xl bg-slate-950/80 border border-slate-800 p-4 flex items-center justify-center relative overflow-hidden group">
                    {spotlightViewMode === 'scissored' ? (
                      <img
                        src={spotlightScissored}
                        alt={spotlightMed.name}
                        className="w-full h-full object-contain filter drop-shadow-2xl"
                      />
                    ) : spotlightViewMode === 'full' ? (
                      <img
                        src={spotlightFull}
                        alt={spotlightMed.name}
                        className="w-full h-full object-contain filter drop-shadow-2xl"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center">
                        {spotlightQr ? (
                          <img src={spotlightQr} alt="QR" className="w-32 h-32 bg-white p-2 rounded-xl" />
                        ) : (
                          <div className="w-32 h-32 bg-slate-800 rounded-xl animate-pulse" />
                        )}
                        <span className="font-mono text-[10px] text-teal-300 mt-2 font-bold">
                          GS1 Cryptographic 2D DataMatrix Seal
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Savings Pill Bar */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-slate-400">Jan Aushadhi Price:</span>
                    <span className="text-xl font-black text-emerald-400">₹{spotlightMed.janAushadhiPrice.toFixed(2)}/strip</span>
                    <span className="text-xs text-slate-500 line-through">MRP ₹{spotlightMed.mrp.toFixed(2)}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black text-xs">
                    {spotlightSavings}% CHEAPER than Branded {spotlightMed.brand}
                  </span>
                </div>
              </div>

              {/* Right Column: Quick Order & Automated Expiry Registration Drawer (5 cols) */}
              <div className="lg:col-span-5 bg-slate-950/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-emerald-400" />
                      <span>Quick Order & Expiry Registration</span>
                    </h3>
                    <span className="text-[10px] font-mono bg-teal-500/20 text-teal-300 px-2 py-0.5 rounded-full">
                      IN STOCK
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <span className="text-xs font-bold text-slate-300">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSpotlightQty(Math.max(1, spotlightQty - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white cursor-pointer"
                      >
                        -
                      </button>
                      <span className="font-mono font-bold text-sm text-white">{spotlightQty}</span>
                      <button
                        type="button"
                        onClick={() => setSpotlightQty(spotlightQty + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center font-bold text-white cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Delivery Estimate */}
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 block text-[11px]">Estimated Delivery:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-teal-400" />
                      <span>Today, 4:00 PM (from Bhubaneswar Jan Aushadhi Kendra)</span>
                    </span>
                  </div>

                  {/* Firebase Expiry Reminder Toggle */}
                  <div className="p-3.5 bg-gradient-to-r from-teal-950/60 to-indigo-950/60 rounded-xl border border-teal-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <Bell className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs text-white block">Enable Firebase Expiry Alerts</span>
                        <span className="text-[10px] text-slate-300">SMS & WhatsApp notification 30 days before batch expires</span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableExpiryAlerts}
                      onChange={(e) => setEnableExpiryAlerts(e.target.checked)}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => handleAddToCart(spotlightMed, spotlightQty)}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/50 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4 text-slate-950" />
                    <span>Add to Cart & Save ₹{((spotlightMed.mrp - spotlightMed.janAushadhiPrice) * spotlightQty).toFixed(2)}</span>
                  </button>

                  {onTestCutStrip && (
                    <button
                      type="button"
                      onClick={() => onTestCutStrip(spotlightMed)}
                      className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Scissors className="w-3.5 h-3.5 text-rose-400" />
                      <span>Test Cut Strip in AI Expiry Scanner</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ── 3. Medicine Cards Grid with Scissored Pill & Full Strip Images ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedicines.map((med) => {
          const qrUrl = qrCodeDataUrls[med.id];
          const savings = Math.round(((med.mrp - med.janAushadhiPrice) / med.mrp) * 100);
          const cartItemQty = cartItems[med.id]?.quantity || 0;
          const activeViewMode = cardImageModes[med.id] || 'scissored'; // 'scissored' (default) | 'full' | 'qr'
          const scissoredImg = med.scissoredStripImage || generateScissoredStripSvg(med);
          const fullStripImg = med.fullStripImage || generateFullStripSvg(med);

          return (
            <div
              key={med.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
            >
              {/* Card Header: Category & Expiry Status Badge */}
              <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2.5 py-0.5 rounded-lg border border-teal-200 dark:border-teal-900">
                  {med.categoryName[lang] || med.categoryName['en-IN']}
                </span>

                {med.status === 'SAFE' && (
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>EXP {med.expDate}</span>
                  </span>
                )}
                {med.status === 'EXPIRING_SOON' && (
                  <span className="text-[10px] font-black text-amber-800 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-300 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    <span>SOON: {med.expDate}</span>
                  </span>
                )}
                {med.status === 'EXPIRED' && (
                  <span className="text-[10px] font-black text-rose-800 bg-rose-100 dark:bg-rose-950 dark:text-rose-300 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-rose-300">
                    <AlertOctagon className="w-3 h-3 text-rose-600" />
                    <span>EXPIRED: {med.expDate}</span>
                  </span>
                )}
              </div>

              {/* Medicine Name & Salt */}
              <div className="p-4 space-y-1.5 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {med.name}
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded shrink-0">
                    {med.batchNo}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {med.generic}
                </p>

                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{med.manufacturer}</span>
                </div>

                {/* ── VISUAL BLISTER & SCISSORED PILL IMAGE VIEWER ──────────── */}
                <div className="my-3 rounded-2xl bg-slate-950 border border-slate-700/80 p-2.5 shadow-inner space-y-2">
                  {/* Image View Toggle Mode */}
                  <div className="flex items-center justify-between text-[10px] font-bold pb-1 border-b border-slate-800">
                    <span className="text-slate-300 flex items-center gap-1">
                      <ImageIcon className="w-3 h-3 text-teal-400" />
                      <span>VISUAL PACKAGING</span>
                    </span>

                    <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[9px]">
                      <button
                        type="button"
                        onClick={() => setCardImageModes((prev) => ({ ...prev, [med.id]: 'scissored' }))}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          activeViewMode === 'scissored' ? 'bg-rose-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        ✂️ Cut Strip
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardImageModes((prev) => ({ ...prev, [med.id]: 'full' }))}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          activeViewMode === 'full' ? 'bg-teal-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        🖼️ Full Strip
                      </button>
                      <button
                        type="button"
                        onClick={() => setCardImageModes((prev) => ({ ...prev, [med.id]: 'qr' }))}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-all ${
                          activeViewMode === 'qr' ? 'bg-indigo-600 text-white font-black' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        📱 QR
                      </button>
                    </div>
                  </div>

                  {/* Rendered Visual Image Container */}
                  <div className="relative aspect-16/10 rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center group-hover:ring-1 group-hover:ring-teal-500/50 transition-all">
                    {activeViewMode === 'scissored' ? (
                      <img
                        src={scissoredImg}
                        alt={`Scissored strip of ${med.name}`}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : activeViewMode === 'full' ? (
                      <img
                        src={fullStripImg}
                        alt={`Full strip pack of ${med.name}`}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-2 text-center">
                        {qrUrl ? (
                          <img src={qrUrl} alt={`QR ${med.name}`} className="w-24 h-24 bg-white p-1 rounded-xl shadow" />
                        ) : (
                          <div className="w-24 h-24 bg-slate-800 animate-pulse rounded-xl" />
                        )}
                        <span className="font-mono text-[9px] text-slate-400 mt-1">GS1 2D DataMatrix Seal</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                    <span>{med.dosageForm}</span>
                    <span className="text-teal-400 font-bold">{med.pillShape.toUpperCase()} • {med.pillColor}</span>
                  </div>
                </div>

                {/* Price & Savings Pill */}
                <div className="pt-1 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 line-through mr-1.5">
                      MRP ₹{med.mrp.toFixed(2)}
                    </span>
                    <span className="text-base font-black text-emerald-700 dark:text-emerald-400">
                      ₹{med.janAushadhiPrice.toFixed(2)}
                    </span>
                  </div>

                  {savings > 0 && (
                    <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-0.5">
                      <TrendingDown className="w-3 h-3 text-emerald-600" />
                      <span>{savings}% {txt.saveUpto}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* ── Card Primary Buying & Testing Action ───────────────────── */}
              <div className="p-3 bg-teal-50/50 dark:bg-teal-950/20 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2">
                  {/* Buy Now Button */}
                  <button
                    type="button"
                    onClick={() => handleInitiateBuyNow(med)}
                    className="flex-1 py-2 px-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                    <span>{txt.btnBuyNow} (₹{med.janAushadhiPrice.toFixed(2)})</span>
                  </button>

                  {/* Quantity Counter / Cart Stepper */}
                  <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 shrink-0 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleUpdateCartQuantity(med, -1)}
                      disabled={cartItemQty === 0}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 disabled:opacity-30 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 font-mono font-bold text-xs text-slate-800 dark:text-slate-100">
                      {cartItemQty}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleUpdateCartQuantity(med, 1)}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-teal-700 dark:text-teal-400 font-bold cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Secondary Inspection & Scanner Actions */}
                <div className="flex items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setInspectModalMed(med);
                      setInspectViewMode('scissored');
                    }}
                    className="flex-1 py-1.5 px-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-teal-600" />
                    <span>{txt.btnInspect}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLaunchTest(med)}
                    className="flex-1 py-1.5 px-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[11px] rounded-lg border border-rose-200 dark:border-rose-900 transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Scissors className="w-3 h-3 text-rose-500" />
                    <span>{txt.btnTestCutStrip}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── 4. Inspection Modal with High-Res Strip & Cut Pill Gallery ────── */}
      {inspectModalMed && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 animate-scaleUp">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Pill className="w-5 h-5 text-teal-600" />
                  <span>{txt.modalTitle}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {txt.modalSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setInspectModalMed(null)}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              {/* Medicine Overview Card */}
              <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-black text-sm text-teal-950 dark:text-teal-200">
                    {inspectModalMed.name}
                  </h4>
                  <p className="text-xs text-teal-700 dark:text-teal-300 font-medium">
                    {inspectModalMed.generic}
                  </p>
                  <p className="text-[11px] text-teal-600 dark:text-teal-400 mt-1">
                    {inspectModalMed.dosageForm} • {inspectModalMed.manufacturer}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">{txt.janPriceLabel}</div>
                  <div className="text-lg font-black text-emerald-600">₹{inspectModalMed.janAushadhiPrice.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 line-through">MRP ₹{inspectModalMed.mrp.toFixed(2)}</div>
                </div>
              </div>

              {/* ── Interactive 3-Tab Visual Packaging Viewer ── */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="font-bold text-xs text-white flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-teal-400" />
                    <span>Visual Blister Packaging Gallery</span>
                  </span>

                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setInspectViewMode('scissored')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        inspectViewMode === 'scissored' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {txt.tabCutStripImg}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectViewMode('full')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        inspectViewMode === 'full' ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {txt.tabFullStripImg}
                    </button>
                    <button
                      type="button"
                      onClick={() => setInspectViewMode('qr')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        inspectViewMode === 'qr' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {txt.tabQrCode}
                    </button>
                  </div>
                </div>

                {/* Display Selected Image */}
                <div className="w-full h-56 rounded-xl bg-slate-900 flex items-center justify-center overflow-hidden p-2 shadow-inner">
                  {inspectViewMode === 'scissored' ? (
                    <img
                      src={inspectModalMed.scissoredStripImage || generateScissoredStripSvg(inspectModalMed)}
                      alt="Scissored cut strip"
                      className="w-full h-full object-contain"
                    />
                  ) : inspectViewMode === 'full' ? (
                    <img
                      src={inspectModalMed.fullStripImage || generateFullStripSvg(inspectModalMed)}
                      alt="Full blister strip pack"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      {qrCodeDataUrls[inspectModalMed.id] ? (
                        <img
                          src={qrCodeDataUrls[inspectModalMed.id]}
                          alt="QR seal"
                          className="w-36 h-36 bg-white p-2 rounded-2xl shadow-lg"
                        />
                      ) : (
                        <div className="w-36 h-36 bg-slate-800 animate-pulse rounded-2xl" />
                      )}
                      <span className="font-mono text-[10px] text-teal-300 font-bold mt-2">
                        MoHFW Cryptographic GS1 2D DataMatrix Seal
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 font-mono">
                  <span>Batch: <strong>{inspectModalMed.batchNo}</strong></span>
                  <span>MFG: {inspectModalMed.mfgDate}</span>
                  <span className={inspectModalMed.status === 'EXPIRED' ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
                    EXP: {inspectModalMed.expDate}
                  </span>
                </div>
              </div>

              {/* Indications & Storage Instructions */}
              <div className="space-y-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                <div>
                  <strong className="text-slate-900 dark:text-white">{txt.indications}</strong> {inspectModalMed.indications}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">{txt.storage}</strong> {inspectModalMed.storage}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => setInspectModalMed(null)}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const m = inspectModalMed;
                    setInspectModalMed(null);
                    handleLaunchTest(m);
                  }}
                  className="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Scissors className="w-3.5 h-3.5 text-rose-500" />
                  <span>{txt.btnTestCutStrip}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const m = inspectModalMed;
                    setInspectModalMed(null);
                    handleInitiateBuyNow(m);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-amber-200" />
                  <span>{txt.btnBuyNow} (₹{inspectModalMed.janAushadhiPrice.toFixed(2)})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Checkout Modal with Firebase Expiry Alerts Integration ─────── */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 animate-scaleUp">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-teal-950 to-slate-900 text-white">
              <div>
                <h3 className="font-black text-base flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-300" />
                  <span>{txt.checkoutTitle}</span>
                </h3>
                <p className="text-xs text-teal-200/80 mt-0.5">
                  {txt.checkoutSub}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* Expired Safety Swap Warning */}
              {pricingTotals.hasExpiredBatch && (
                <div className="p-3.5 bg-amber-500/15 border border-amber-500/40 rounded-2xl flex items-start gap-3 text-amber-900 dark:text-amber-200">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <strong className="block text-xs font-bold text-amber-800 dark:text-amber-300">
                      {txt.expiredSafeguardTitle}
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      {txt.expiredSafeguardText}
                    </p>
                  </div>
                </div>
              )}

              {/* Order Items Breakdown with Image Thumbnails */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Order Items ({checkoutItems.length})
                </div>
                {checkoutItems.map(({ medicine, quantity }) => (
                  <div
                    key={medicine.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    {/* Visual Scissored Strip Thumbnail */}
                    <img
                      src={medicine.scissoredStripImage || generateScissoredStripSvg(medicine)}
                      alt="Strip preview"
                      className="w-14 h-10 object-contain bg-slate-950 rounded-lg p-0.5 shrink-0 border border-slate-700"
                    />

                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {medicine.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {medicine.generic} • {medicine.dosageForm}
                      </p>
                      <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                        Batch: {medicine.status === 'EXPIRED' ? 'PMB-2026X (Fresh Stock)' : medicine.batchNo} • EXP: {medicine.status === 'EXPIRED' ? '11/2028' : medicine.expDate}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                        ₹{(medicine.janAushadhiPrice * quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 line-through">
                        MRP ₹{(medicine.mrp * quantity).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-emerald-600 font-bold">
                        Qty: {quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Fulfillment Option */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {txt.deliveryOption}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('pickup')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryMode === 'pickup'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 dark:text-teal-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{txt.pickupKendra}</div>
                    <div className="text-[10px] text-emerald-600 font-black mt-1">₹0 Delivery Fee</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('delivery')}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      deliveryMode === 'delivery'
                        ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 dark:text-teal-200'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-xs">{txt.expressDelivery}</div>
                    <div className="text-[10px] text-emerald-600 font-black mt-1">Free PMBJP Logistics</div>
                  </button>
                </div>

                {deliveryMode === 'pickup' ? (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold">{txt.selectKendraLabel}</span>
                    <select
                      value={selectedKendra}
                      onChange={(e) => setSelectedKendra(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                    >
                      {JAN_AUSHADHI_KENDRAS.map((k, idx) => (
                        <option key={idx} value={k}>
                          {k}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold">{txt.addressLabel}</span>
                    <textarea
                      rows={2}
                      value={patientAddress}
                      onChange={(e) => setPatientAddress(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                      placeholder="Delivery address in Odisha..."
                    />
                  </div>
                )}
              </div>

              {/* Patient Info for Firebase Storage & SMS Alerts */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {txt.patientDetails}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">{txt.patientNameLabel}</span>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">{txt.phoneLabel}</span>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">{txt.emailLabel}</span>
                    <input
                      type="email"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Firebase Expiry Alert Checkbox */}
                <label className="flex items-center gap-2 p-2.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableExpiryAlerts}
                    onChange={(e) => setEnableExpiryAlerts(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-teal-950 dark:text-teal-200 block">
                      {txt.firebaseExpiryAlertNotice}
                    </span>
                    <span className="text-[10px] text-teal-700 dark:text-teal-400">
                      Stores prescription expiry timeline in Firebase so we send you SMS/Email when medicines expire.
                    </span>
                  </div>
                </label>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                  {txt.paymentOption}
                </label>
                <div className="space-y-1.5">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer ${
                      paymentMethod === 'bsky'
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'bsky'}
                      onChange={() => setPaymentMethod('bsky')}
                      className="text-emerald-600"
                    />
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-xs">{txt.payBsky}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer ${
                      paymentMethod === 'upi'
                        ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'upi'}
                      onChange={() => setPaymentMethod('upi')}
                      className="text-teal-600"
                    />
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span className="font-bold text-xs">{txt.payUpi}</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 text-amber-900 dark:text-amber-200'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="text-amber-600"
                    />
                    <PackageCheck className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs">{txt.payCod}</span>
                  </label>
                </div>
              </div>

              {/* Price Calculation Bill Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border border-slate-300 dark:border-slate-700 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-500 dark:text-slate-400">
                  <span>{txt.totalMrp}</span>
                  <span className="line-through">₹{pricingTotals.mrpTotal}</span>
                </div>
                <div className="flex justify-between font-bold text-emerald-700 dark:text-emerald-400 text-sm">
                  <span>{txt.janSubsidized}</span>
                  <span>₹{pricingTotals.janTotal}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-300 dark:border-slate-700 flex justify-between font-bold text-emerald-800 dark:text-emerald-300">
                  <span>{txt.totalSavings}</span>
                  <span className="bg-emerald-200 dark:bg-emerald-900/80 px-2 py-0.5 rounded">
                    ₹{pricingTotals.savings} Saved
                  </span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold text-xs cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPlacingOrder || checkoutItems.length === 0}
                onClick={handlePlaceOrder}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-amber-200" />
                    <span>Saving to Firebase...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>{txt.btnConfirmOrder} (₹{pricingTotals.janTotal})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 6. Order Confirmation & Firebase Receipt Modal ─────────────────── */}
      {orderReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-4 animate-scaleUp">
            {/* Top Success Banner */}
            <div className="p-6 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white text-center space-y-2 relative overflow-hidden">
              <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-8 h-8 text-white animate-scaleUp" />
              </div>
              <h3 className="font-black text-lg">
                {txt.orderSuccessTitle}
              </h3>
              <p className="text-xs text-emerald-100 max-w-sm mx-auto">
                {txt.orderSuccessSub}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                <span className="px-3 py-1 bg-white/15 rounded-full font-mono text-xs font-bold border border-white/20">
                  {txt.orderIdLabel} {orderReceipt.orderId}
                </span>
                <span className="px-2.5 py-1 bg-emerald-500 text-slate-950 rounded-full text-[10px] font-black flex items-center gap-1 shadow">
                  <CheckCheck className="w-3 h-3" />
                  <span>{txt.firebaseStoredBadge}</span>
                </span>
              </div>
            </div>

            {/* Receipt Body */}
            <div className="p-5 space-y-3.5 text-xs font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Buyer:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{orderReceipt.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Phone (SMS):</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">{orderReceipt.patientPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-bold text-teal-700 dark:text-teal-400">{orderReceipt.patientEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Firebase Collection:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">swasthya_medicine_orders</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 flex justify-between">
                  <span>Item & Expiry</span>
                  <span>Price</span>
                </div>
                {orderReceipt.items.map(({ medicine, quantity }, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between border-b last:border-0 border-slate-100 dark:border-slate-800 gap-2">
                    <img
                      src={medicine.scissoredStripImage || generateScissoredStripSvg(medicine)}
                      alt="Scissored pill"
                      className="w-12 h-8 object-contain bg-slate-900 rounded p-0.5 border shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{medicine.name} (x{quantity})</div>
                      <div className="text-[10px] text-teal-600 font-black">EXP: {medicine.expDate} • B.No: {medicine.batchNo}</div>
                    </div>
                    <div className="text-right font-bold text-slate-800 dark:text-slate-200 shrink-0">
                      ₹{(medicine.janAushadhiPrice * quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Firebase Automated Expiry Notice Box */}
              <div className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-900 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-teal-950 dark:text-teal-200 font-bold">
                  <Bell className="w-4 h-4 text-teal-600" />
                  <span>Automated Expiry Alert Active</span>
                </div>
                <p className="text-[11px] text-teal-800 dark:text-teal-300 font-sans leading-relaxed">
                  Your medicine details and expiry dates are stored in Firebase. SwasthyaMitra will automatically dispatch an SMS and Email to <strong>{orderReceipt.patientPhone}</strong> & <strong>{orderReceipt.patientEmail}</strong> as soon as the batch expires.
                </p>
                <button
                  type="button"
                  onClick={() => handleTestSendExpiryAlert(orderReceipt)}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-bold text-xs rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{txt.testSmsBtn}</span>
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== 'undefined') window.print();
                }}
                className="px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-slate-100"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{txt.printReceipt}</span>
              </button>

              <div className="flex items-center gap-2">
                {orderReceipt.items[0] && (
                  <button
                    type="button"
                    onClick={() => {
                      const item = orderReceipt.items[0].medicine;
                      setOrderReceipt(null);
                      handleLaunchTest(item);
                    }}
                    className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{txt.testPurchasedInScanner}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setOrderReceipt(null)}
                  className="px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer hover:bg-slate-800"
                >
                  {txt.btnDone}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── 7. My Orders & Firebase Expiry Alerts Drawer ───────────────────── */}
      {showOrdersDrawer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-end animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 overflow-hidden animate-slideLeft">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-black text-sm">Firebase Stored Orders & Expiry Alerts</h3>
                  <p className="text-[10px] text-slate-400">Track expired medicines & send SMS warnings</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOrdersDrawer(false)}
                className="p-1.5 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3.5 text-xs">
              {userOrders.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="font-bold">No medicine orders found in Firebase.</p>
                  <p className="text-[11px]">Purchase any medicine to register automated SMS expiry alerts!</p>
                </div>
              ) : (
                userOrders.map((ord, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-teal-700 dark:text-teal-400 text-xs">
                        {ord.orderId}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {ord.date || ord.createdAt?.split('T')[0]}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div><strong>Buyer:</strong> {ord.patientName || ord.buyerName}</div>
                      <div><strong>Phone (SMS):</strong> {ord.patientPhone || ord.buyerPhone}</div>
                      <div><strong>Email:</strong> {ord.patientEmail || ord.buyerEmail}</div>
                    </div>

                    {/* Medicines List with Scissored Pill Images */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-200 dark:border-slate-700">
                      {(ord.items || []).map((it, itemIdx) => {
                        const med = it.medicine || it;
                        const isExp = med.status === 'EXPIRED';
                        return (
                          <div
                            key={itemIdx}
                            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                          >
                            <img
                              src={med.scissoredStripImage || generateScissoredStripSvg(med)}
                              alt="Pill strip"
                              className="w-12 h-8 object-contain bg-slate-950 rounded p-0.5 border shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{med.name}</div>
                              <div className={`text-[10px] font-mono font-bold ${isExp ? 'text-rose-600' : 'text-emerald-600'}`}>
                                EXP: {med.expDate} {isExp ? '• EXPIRED!' : '• Safe'}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleLaunchTest(med)}
                              className="px-2 py-1 bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded text-[10px] font-bold border border-rose-200 cursor-pointer"
                            >
                              Scan
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Trigger SMS Alert Button */}
                    <button
                      type="button"
                      onClick={() => handleTestSendExpiryAlert(ord)}
                      className="w-full py-1.5 bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3 h-3" />
                      <span>📲 Send Simulated Expiry Alert SMS & Email</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
