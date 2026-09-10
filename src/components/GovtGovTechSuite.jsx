import React, { useState } from 'react';
import {
  Brain,
  ShieldAlert,
  AlertTriangle,
  Activity,
  PhoneCall,
  MessageSquare,
  Mic,
  Smile,
  Users,
  Tv,
  FileCheck2,
  Scan,
  Radar,
  Package,
  Volume2,
  Lock,
  BarChart3,
  ThumbsUp,
  FileText,
  Baby,
  HeartHandshake,
  Smartphone,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

export default function GovtGovTechSuite({ currentUser, appLang, initialFeature }) {
  const lang = appLang || 'or-IN';
  const [activeSubTab, setActiveSubTab] = useState(initialFeature || 'abha_history');

  React.useEffect(() => {
    if (initialFeature) {
      setActiveSubTab(initialFeature);
    }
  }, [initialFeature]);

  // Interactive State Demos
  const [patientAbha, setPatientAbha] = useState('91-8842-1209-7711');
  const [painLevel, setPainLevel] = useState(6);
  const [selectedBodyPart, setSelectedBodyPart] = useState('Chest / Thorax');
  const [familyMembers, setFamilyMembers] = useState([
    { name: 'Rameshwar Lal', age: 48, symptom: 'High Fever & Chills', status: 'RED' },
    { name: 'Sunita Devi', age: 44, symptom: 'Mild Headache', status: 'GREEN' }
  ]);
  const [newMemName, setNewMemName] = useState('');
  const [newMemSymptom, setNewMemSymptom] = useState('');
  
  // Consent
  const [consentGiven, setConsentGiven] = useState(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Doctor RLHF feedback score
  const [doctorRating, setDoctorRating] = useState(94);
  const [feedbackCount, setFeedbackCount] = useState(142);

  // Counterfeit Detector
  const [labFileStatus, setLabFileStatus] = useState(null);

  const txt = {
    'or-IN': {
      headerBadge: '🇮🇳 ମୋହଫୱ୍ ଓ ABDM ସ୍ୱୀକୃତିପ୍ରାପ୍ତ • ଜାତୀୟ GovTech ମାନକ',
      featureCountBadge: '୨୨ଟି ଉନ୍ନତ ଏଣ୍ଟରପ୍ରାଇଜ୍ ଫିଚର',
      headerTitle: 'ରାଷ୍ଟ୍ରୀୟ ସ୍ୱାସ୍ଥ୍ୟ AI ଏବଂ ଅପରେସନ୍ ସୁଇଟ୍',
      headerSubtitle: 'କ୍ଲିନିକାଲ୍ ନିଷ୍ପତ୍ତି ସହାୟକ, ଆଶା ଭଏସ୍ କୋପାଇଲଟ୍, ଜିରୋ-ଟଚ୍ କିଓସ୍କ, IDSP ମହାମାରୀ ରାଡାର ଓ DPDP ସମ୍ମତି।',
      humanLoop: 'ଡାକ୍ତରୀ ନିଷ୍ପତ୍ତି ସହାୟକ',
      nonDiag: 'Non-Diagnostic ସୁରକ୍ଷିତ',
      
      t1Title: '୧. ABHA ଐତିହାସିକ ଗ୍ରାଫ୍ (Longitudinal Trend Analysis)',
      t1Subtitle: 'ABDM ଗେଟୱେ ମାଧ୍ୟମରେ ରୋଗୀଙ୍କ ଗତ ୩ଟି ଡାକ୍ତରୀ ଗସ୍ତର ସ୍ୱାସ୍ଥ୍ୟ ସୂଚକ ଏବଂ ରକ୍ତ ଶର୍କରା ଟ୍ରେଣ୍ଡ୍ ବିଶ୍ଲେଷଣ।',
      v1: 'ଗସ୍ତ ୧ (୧୪ ଜାନୁଆରୀ)',
      v2: 'ଗସ୍ତ ୨ (୧୮ ଫେବୃଆରୀ)',
      v3: 'ଆଜିର ଲକ୍ଷଣ (୧୦ ମାର୍ଚ୍ଚ)',
      bs: 'ରକ୍ତ ଶର୍କରା:',
      stable: 'ସ୍ଥିର Baseline',
      mod: '⚡ ମଧ୍ୟମ ବୃଦ୍ଧି',
      alert: '⚠️ ଅବନତି ସଙ୍କେତ ALERT',
      aiInsight: 'ଡାକ୍ତରଙ୍କ ପାଇଁ AI ଲଙ୍ଗିଚ୍ୟୁଡିନାଲ୍ ଅନୁଧ୍ୟାନ:',
      aiInsightTxt: 'ଗତ ୬୦ ଦିନରେ ରୋଗୀଙ୍କ ରକ୍ତ ଶର୍କରା ୭୧% ବୃଦ୍ଧି ପାଇଛି। ରକ୍ତଚାପ ବୃଦ୍ଧି ପାଉଥିବାରୁ ଡାଇବେଟିକ୍ କିଟୋଏସିଡୋସିସ୍ ରିସ୍କ ରହିଛି।',

      t2Title: '୨. ନିରାପଦ ଡିଫରେନ୍ସିଆଲ୍ ଟ୍ରାଏଜ୍ (Human-in-the-Loop)',
      t2Subtitle: 'ଚୂଡ଼ାନ୍ତ ରୋଗ ନିରୂପଣ ବଦଳରେ ଡାକ୍ତରଙ୍କ ପରୀକ୍ଷା ପାଇଁ ସମ୍ଭାବ୍ୟ କ୍ଲିନିକାଲ୍ ତାଲିକା ଏବଂ ପ୍ରଶ୍ନାବଳୀ।',
      probTitle: 'ଡାକ୍ତରଙ୍କ ସମୀକ୍ଷା ପାଇଁ ସମ୍ଭାବ୍ୟ କ୍ଲିନିକାଲ୍ ସମ୍ଭାବନା:',
      sugQuest: '💡 ଡାକ୍ତର / ଆଶା କର୍ମୀଙ୍କ ପାଇଁ ପରାମର୍ଶିତ ପ୍ରଶ୍ନ:',

      t3Title: '୩. ଔଷଧ-ଔଷଧ ଏବଂ ଆଲର୍ଜି ଚେତାବନୀ ସିଷ୍ଟମ୍',
      t3Subtitle: 'ABHA ପ୍ରୋଫାଇଲରେ ଥିବା ଆଲର୍ଜି ରେକର୍ଡ ସହ ଅପଲୋଡ୍ ଔଷଧ ସ୍ଲିପ୍‌ର ସ୍ୱୟଂଚାଳିତ ଯାଞ୍ଚ।',
      critAlert: 'ଡାକ୍ତରଙ୍କ ପାଇଁ ଗୁରୁତର ଔଷଧ ଆଲର୍ଜି ALERT',

      t4Title: '୪. କ୍ଲିନିକାଲ୍ ରିସ୍କ ସ୍କୋର କାଲକୁଲେଟର୍',
      t4Subtitle: 'ଜୀବନ ସୂଚକରୁ qSOFA (ସେପ୍ସିସ୍), GCS (ମୁଣ୍ଡ ଆଘାତ), APGAR (ନବଜାତ ଶିଶୁ) ଏବଂ MME ସ୍କୋର।',

      t6Title: '୬-୯. ଆଶା ଭଏସ୍ କୋପାଇଲଟ୍, ପେନ୍ ମ୍ୟାପ୍ ଓ ପରିବାର ଟ୍ରାଏଜ୍',
      t6Subtitle: 'ଗ୍ରାମୀଣ ଆଶା କର୍ମୀଙ୍କ ପାଇଁ ବିନା ଟାଇପିଂରେ କଣ୍ଠସ୍ୱର ମାଧ୍ୟମରେ ଲକ୍ଷଣ ଗ୍ରହଣ ଏବଂ ଶିବିର ଟ୍ରାଏଜ୍।',

      t13Title: '୧୩. IDSP ମହାମାରୀ ରାଡାର (ଜିଲ୍ଲା ସ୍ୱାସ୍ଥ୍ୟ ନଜର)',
      t13Subtitle: 'ଓଡ଼ିଶାର ୩୦ଟି ଜିଲ୍ଲାରେ ସଂକ୍ରାମକ ରୋଗର ହଠାତ୍ ବୃଦ୍ଧି ଉପରେ ୨୪x୭ ନଜର।',

      t15Title: '୧୫-୧୮. DPDP Act ୨୦୨୩ ଅଡିଓ Consent ଓ AI ନିରପେକ୍ଷତା',
      t15Subtitle: 'ଆଞ୍ଚଳିକ ଭାଷାରେ ୫ ସେକେଣ୍ଡ୍ ଅଡିଓ ସମ୍ମତି ଏବଂ ଡାକ୍ତର ଫିଡବ୍ୟାକ୍ ଶିକ୍ଷଣ।',

      t20Title: '୨୦-୨୨. ANC ଗର୍ଭବତୀ ମାତୃ ସୁରକ୍ଷା ଓ SMS ରସିଦ୍',
      t20Subtitle: 'ଉଚ୍ଚ-ପ୍ରାଥମିକତା ଗର୍ଭବତୀ ମାତୃ ପରୀକ୍ଷା ଏବଂ ନାଗରିକ ମୋବାଇଲ୍ SMS ଟୋକନ୍।'
    },
    'hi-IN': {
      headerBadge: '🇮🇳 MoHFW एवं ABDM स्वीकृत • राष्ट्रीय GovTech मानक',
      featureCountBadge: '22 उन्नत एंटरप्राइज फीचर्स',
      headerTitle: 'राष्ट्रीय स्वास्थ्य AI एवं ऑपरेशन्स सूट',
      headerSubtitle: 'क्लिनिकल निर्णय समर्थन, आशा वॉइस कोपायलट, ज़ीरो-टच कियोस्क, IDSP आउटब्रेक रडार एवं DPDP अनुपालन।',
      humanLoop: 'डॉक्टर निर्णय सहायता',
      nonDiag: 'Non-Diagnostic सुरक्षित',
      
      t1Title: '1. ABHA ट्रेंड ग्राफ (Longitudinal Trend Analysis)',
      t1Subtitle: 'ABDM गेटवे से मरीज के पिछले 3 दौरों के स्वास्थ्य मापदंडों का स्वचालित विश्लेषण।',
      v1: 'दौरा 1 (14 जनवरी)',
      v2: 'दौरा 2 (18 फरवरी)',
      v3: 'आज का विवरण (10 मार्च)',
      bs: 'ब्लड शुगर:',
      stable: 'स्थिर Baseline',
      mod: '⚡ मध्यम वृद्धि',
      alert: '⚠️ गंभीर स्थिति ALERT',
      aiInsight: 'डॉक्टर के लिए AI क्लिनिकल इनसाइट:',
      aiInsightTxt: 'पिछले 60 दिनों में ब्लड शुगर 71% बढ़ा है। रक्तचाप बढ़ने से डायबिटिक कीटोएसिडोसिस का जोखिम है।',

      t2Title: '2. सुरक्षित डिफरेंशियल ट्रायज (Human-in-the-Loop)',
      t2Subtitle: 'निश्चित निदान के बजाय डॉक्टर के परीक्षण के लिए संभावित क्लिनिकल सूची एवं प्रश्न।',
      probTitle: 'डॉक्टर समीक्षा हेतु संभावित क्लिनिकल संभावनाएं:',
      sugQuest: '💡 डॉक्टर / आशा कार्यकर्ता हेतु अनुशंसित प्रश्न:',

      t3Title: '3. दवा-दवा एवं एलर्जी चेतावनी सिस्टम',
      t3Subtitle: 'ABHA प्रोफाइल में मौजूद एलर्जी रिकॉर्ड के साथ पर्चे का स्वचालित मिलान।',
      critAlert: 'डॉक्टर के लिए गंभीर दवा एलर्जी ALERT',

      t4Title: '4. क्लिनिकल रिस्क स्कोर कैलकुलेटर',
      t4Subtitle: 'वाइटल्स से qSOFA (सेप्सिस), GCS (सिर की चोट), APGAR (नवजात) एवं MME स्कोर।',

      t6Title: '6-9. आशा वॉइस कोपायलट, पेन मैप एवं परिवार ट्रायज',
      t6Subtitle: 'बिना टाइप किए आवाज द्वारा लक्षण दर्ज करने की सुविधा एवं कैंप ट्रायज।',

      t13Title: '13. IDSP आउटब्रेक रडार (जिला महामारी निगरानी)',
      t13Subtitle: 'ओडिशा के 30 जिलों में संक्रामक रोगों की वृद्धि पर 24x7 निगरानी।',

      t15Title: '15-18. DPDP Act 2023 ऑडियो सहमति एवं AI निष्पक्षता',
      t15Subtitle: 'क्षेत्रीय भाषा में 5 सेकंड ऑडियो सहमति एवं डॉक्टर फीडबैक लर्निंग।',

      t20Title: '20-22. ANC गर्भवती मातृ सुरक्षा एवं SMS रसीद',
      t20Subtitle: 'उच्च-जोखिम गर्भावस्था जांच एवं नागरिक मोबाइल SMS टोकन।'
    },
    'en-IN': {
      headerBadge: '🇮🇳 MoHFW & ABDM Aligned • National GovTech Hackathon Standard',
      featureCountBadge: '22 Advanced Enterprise Features',
      headerTitle: 'National Health GovTech AI & Operations Suite',
      headerSubtitle: 'Clinical decision support, low-literacy ASHA voice copilot, zero-touch kiosks, IDSP outbreak radar, DPDP consent compliance, and federated privacy architecture.',
      humanLoop: 'Human-in-the-Loop',
      nonDiag: 'Non-Diagnostic Certified',
      
      t1Title: '1. ABHA Temporal History Builder (Automated Longitudinal Trend Analysis)',
      t1Subtitle: 'Auto-fetches last 3 clinical visits via ABDM gateway and calculates vital progression curves.',
      v1: 'Visit 1 (14 Jan)',
      v2: 'Visit 2 (18 Feb)',
      v3: "Today's Intake (10 Mar)",
      bs: 'Fasting Blood Sugar:',
      stable: 'Stable Baseline',
      mod: '⚡ Moderate Escalation',
      alert: '⚠️ WORSENING TREND ALERT',
      aiInsight: 'AI Longitudinal Insight for Doctor:',
      aiInsightTxt: "Patient's glycemic control has deteriorated by 71% over 60 days. Rapid spikes in systolic BP observed. High probability of diabetic ketoacidosis risk.",

      t2Title: '2. Safe Non-Diagnostic Differential Triage (Human-in-the-Loop)',
      t2Subtitle: 'Instead of definitive diagnosis, AI outputs structured clinical possibilities and targeted history questions.',
      probTitle: 'Clinical Differential Possibilities for Qualified Doctor Review:',
      sugQuest: '💡 Suggested Targeted Questions for Attending Doctor / ASHA:',

      t3Title: '3. Automated Drug-Drug & Allergy Contraindication Guard',
      t3Subtitle: 'Cross-analyzes uploaded prescriptions against known patient drug allergy records in ABHA profile.',
      critAlert: 'CRITICAL CONTRAINDICATION ALERT TO DOCTOR',

      t4Title: '4. Automated Standardized Clinical Risk Calculator Suite',
      t4Subtitle: 'Calculates qSOFA for Sepsis, GCS for Head Trauma, APGAR for Neonates, and MME for Maternal Risk directly from vitals.',

      t6Title: '6-9. ASHA Low-Literacy Voice Copilot & Multi-Member Camp Triage',
      t6Subtitle: 'Voice-first handsfree intake for community health workers, pictorial pain scales, and family camp batch processing.',

      t13Title: '13. IDSP Outbreak Radar (Automated District Epidemic Surveillance)',
      t13Subtitle: 'Monitors cluster symptom spikes across 30 Odisha blocks in real-time.',

      t15Title: '15-18. DPDP Act 2023 Digital Consent, AI Fairness & RLHF Dashboard',
      t15Subtitle: 'Legal data protection compliance, local language audio consent, and doctor feedback reinforcement learning.',

      t20Title: '20-22. Maternal ANC Module & Citizen Carbon Copy SMS Receipts',
      t20Subtitle: 'Specialized high-risk pregnancy screening and zero-internet SMS token dispatch.'
    }
  }[lang] || {};

  // Quick Pain Smileys
  const smileys = ['😊 Zero', '😐 Mild', '😣 Moderate', '😫 Severe', '😱 Extreme'];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner & Navigation Pills - ONLY rendered when used as a full combined suite without initialFeature */}
      {!initialFeature && (
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl shadow-lg border border-indigo-900/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-400/30 tracking-wider">
                  {txt.headerBadge}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  {txt.featureCountBadge}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-400" />
                {txt.headerTitle}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {txt.headerSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 bg-white/10 p-2 rounded-2xl border border-white/10 backdrop-blur-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div className="text-xs">
                <p className="font-extrabold text-white">{txt.humanLoop}</p>
                <p className="text-[10px] text-slate-300">{txt.nonDiag}</p>
              </div>
            </div>
          </div>

          {/* Category Navigation Pills */}
          <div className="mt-6 pt-4 border-t border-indigo-900/60 flex flex-wrap gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('abha_history')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'abha_history' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> 1. Temporal History (ABHA)
            </button>
            <button
              onClick={() => setActiveSubTab('differential')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'differential' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Brain className="w-3.5 h-3.5" /> 2. Safe Differential Triage
            </button>
            <button
              onClick={() => setActiveSubTab('drug_safety')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'drug_safety' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" /> 3. Drug-Allergy Alerts
            </button>
            <button
              onClick={() => setActiveSubTab('scores')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'scores' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> 4. Clinical Risk Scores
            </button>
            <button
              onClick={() => setActiveSubTab('asha_copilot')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'asha_copilot' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-amber-300" /> 6-8. ASHA Voice & Pain Map
            </button>
            <button
              onClick={() => setActiveSubTab('outbreak')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'outbreak' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-rose-300" /> 13. IDSP Outbreak Radar
            </button>
            <button
              onClick={() => setActiveSubTab('compliance')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'compliance' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-emerald-300" /> 15-18. DPDP & AI Fairness
            </button>
            <button
              onClick={() => setActiveSubTab('maternal')}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all ${
                activeSubTab === 'maternal' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white/10 text-slate-300 hover:bg-white/20'
              }`}
            >
              <Baby className="w-3.5 h-3.5 text-pink-300" /> 20-22. ANC & Citizen SMS
            </button>
          </div>
        </div>
      )}

      {/* Feature 1 / Tab 11: ABHA Temporal History Builder */}
      {activeSubTab === 'abha_history' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                {txt.t1Title || '11. ABHA Temporal History Builder (Automated Longitudinal Trend Analysis)'}
              </h3>
              <p className="text-xs text-slate-500">
                {txt.t1Subtitle || 'Auto-fetches last 3 clinical visits via ABDM gateway and calculates vital progression curves.'}
              </p>
            </div>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-3.5 py-1.5 rounded-full border border-indigo-200 shadow-2xs">
              🆔 ABHA ID: {patientAbha}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">{txt.v1 || 'Visit 1 (14 Jan)'}</span>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">{txt.stable || 'Stable Baseline'}</span>
              </div>
              <p className="font-extrabold text-slate-900 text-sm mt-1">{txt.bs || 'Fasting Blood Sugar:'} 140 mg/dL</p>
              <p className="text-slate-600 font-medium">BP: 128/82 mmHg • SpO2: 98% • Hb: 13.2 g/dL</p>
              <p className="text-[11px] text-slate-400 pt-1">Facility: SCB Medical College OPD, Cuttack</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-wider">{txt.v2 || 'Visit 2 (18 Feb)'}</span>
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">{txt.mod || '⚡ Moderate Escalation'}</span>
              </div>
              <p className="font-extrabold text-amber-950 text-sm mt-1">{txt.bs || 'Fasting Blood Sugar:'} 180 mg/dL</p>
              <p className="text-amber-800 font-medium">BP: 136/88 mmHg • SpO2: 96% • Hb: 12.8 g/dL</p>
              <p className="text-[11px] text-amber-700 pt-1">Facility: Capital Hospital PHC, Bhubaneswar</p>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200 space-y-1.5 shadow-2xs">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider">{txt.v3 || "Today's Intake (10 Mar)"}</span>
                <span className="inline-block text-[10px] font-black px-2.5 py-0.5 rounded bg-rose-600 text-white animate-pulse">{txt.alert || '⚠️ WORSENING TREND ALERT'}</span>
              </div>
              <p className="font-extrabold text-rose-950 text-base mt-1">{txt.bs || 'Fasting Blood Sugar:'} 240 mg/dL</p>
              <p className="text-rose-900 font-medium">BP: 148/94 mmHg • SpO2: 93% • Hb: 11.4 g/dL</p>
              <p className="text-[11px] text-rose-700 font-bold pt-1">Facility: Active Triage Intake Desk</p>
            </div>
          </div>

          <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-xl text-xs text-indigo-950 flex items-start gap-3 shadow-2xs">
            <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-extrabold text-indigo-900">{txt.aiInsight || 'AI Longitudinal Insight for Doctor:'}</p>
              <p className="mt-0.5 leading-relaxed text-indigo-800">
                {txt.aiInsightTxt || "Patient's glycemic control has deteriorated by 71% over 60 days. Rapid spikes in systolic BP observed. High probability of diabetic ketoacidosis risk."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Safe Differential Triage */}
      {activeSubTab === 'differential' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              2. Safe Non-Diagnostic Differential Triage (Human-in-the-Loop Legal Mandate)
            </h3>
            <p className="text-xs text-slate-500">Instead of definitive diagnosis, AI outputs structured clinical possibilities and targeted history questions.</p>
          </div>

          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-emerald-400 font-bold">✓ MoHFW Safety Protocol Verified</span>
              <span className="text-slate-400 text-[10px]">Non-Diagnostic Support</span>
            </div>
            
            <p className="text-slate-300">Symptom Input: "Productive cough for 3 weeks, low-grade evening fever, mild breathlessness"</p>
            
            <div className="bg-slate-800 p-3 rounded-xl space-y-2">
              <p className="font-bold text-amber-400">Clinical Differential Possibilities for Qualified Doctor Review:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="p-2 bg-slate-900 rounded border border-amber-500/40">
                  <p className="font-bold text-white">1. Pulmonary TB</p>
                  <p className="text-[10px] text-slate-400">Likelihood: High (78%)</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-700">
                  <p className="font-bold text-white">2. LRTI / Bacterial Pneumonia</p>
                  <p className="text-[10px] text-slate-400">Likelihood: Moderate (52%)</p>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-700">
                  <p className="font-bold text-white">3. COPD Exacerbation</p>
                  <p className="text-[10px] text-slate-400">Likelihood: Low (24%)</p>
                </div>
              </div>
            </div>

            <div className="bg-indigo-950/80 border border-indigo-800 p-3 rounded-xl">
              <p className="font-bold text-indigo-300">💡 Suggested Targeted Questions for Attending Doctor / ASHA:</p>
              <ul className="text-slate-300 mt-1 space-y-1 text-[11px]">
                <li>• Ask patient about drenching night sweats and unpredicted weight loss (&gt;3kg).</li>
                <li>• Verify hemoptysis (blood in sputum) history in last 7 days.</li>
                <li>• Check family contact history with known TB index patient.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Feature 3: Drug Allergy Alert */}
      {activeSubTab === 'drug_safety' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              3. Automated Drug-Drug & Allergy Contraindication Guard
            </h3>
            <p className="text-xs text-slate-500">Cross-analyzes uploaded prescriptions against known patient drug allergy records in ABHA profile.</p>
          </div>

          <div className="p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-600 text-white rounded-xl shadow-md">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black text-rose-900 uppercase tracking-wide">
                  CRITICAL CONTRAINDICATION ALERT TO DOCTOR
                </h4>
                <p className="text-xs text-rose-800">Prescription OCR scan detected potential severe adverse drug reaction.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Known ABHA Allergy Profile</span>
                <p className="font-black text-rose-700 text-sm mt-0.5">Penicillin / Beta-Lactam Class Allergy</p>
                <p className="text-slate-500 text-[11px]">Severity: Severe Anaphylaxis Risk</p>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-rose-200">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase">Prescription OCR Drug Detected</span>
                <p className="font-black text-slate-900 text-sm mt-0.5">Tab. Amoxicillin + Clavulanic Acid 625mg</p>
                <p className="text-rose-600 text-[11px] font-bold">⚠️ Direct Cross-Allergy (Beta-lactam ring)</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs border-t border-rose-200">
              <span className="font-bold text-rose-900">Recommended Alternative: Tab. Azithromycin 500mg or Ciprofloxacin</span>
              <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg font-bold shadow-xs hover:bg-rose-700">
                Flag to Doctor &amp; Block Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 4: Risk Scores */}
      {activeSubTab === 'scores' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              4. Automated Standardized Clinical Risk Calculator Suite
            </h3>
            <p className="text-xs text-slate-500">Calculates qSOFA for Sepsis, GCS for Head Trauma, APGAR for Neonates, and MME for Maternal Risk directly from vitals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* qSOFA */}
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-rose-900 text-sm">qSOFA Sepsis Score</span>
                <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-md">HIGH RISK</span>
              </div>
              <p className="text-2xl font-black text-rose-700">2 / 3</p>
              <ul className="text-[11px] text-rose-800 space-y-1">
                <li>✓ RR ≥ 22/min (Present: 26)</li>
                <li>✓ Altered Mental Status (GCS 13)</li>
                <li>✗ Systolic BP ≤ 100 (Present: 110)</li>
              </ul>
            </div>

            {/* GCS */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-amber-900 text-sm">Glasgow Coma Scale</span>
                <span className="px-2 py-0.5 bg-amber-600 text-white text-[10px] font-black rounded-md">MODERATE</span>
              </div>
              <p className="text-2xl font-black text-amber-800">12 / 15</p>
              <ul className="text-[11px] text-amber-900 space-y-1">
                <li>• Eye Opening: E3 (To Voice)</li>
                <li>• Verbal: V4 (Confused)</li>
                <li>• Motor: M5 (Localizes Pain)</li>
              </ul>
            </div>

            {/* APGAR */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-emerald-900 text-sm">Neonatal APGAR</span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-black rounded-md">NORMAL</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">9 / 10</p>
              <ul className="text-[11px] text-emerald-800 space-y-1">
                <li>• Heart Rate &gt; 100 bpm (2)</li>
                <li>• Strong Cry &amp; Breathing (2)</li>
                <li>• Good Muscle Tone (2)</li>
              </ul>
            </div>

            {/* MME Maternal Risk */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-indigo-900 text-sm">Maternal Risk (ANC)</span>
                <span className="px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-black rounded-md">ELEVATED</span>
              </div>
              <p className="text-2xl font-black text-indigo-800">High Risk (HRP)</p>
              <ul className="text-[11px] text-indigo-900 space-y-1">
                <li>• Hb: 8.4 g/dL (Moderate Anemia)</li>
                <li>• BP: 142/90 (Preeclampsia Risk)</li>
                <li>• EDD: 24 Oct 2026</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Feature 6-9: ASHA Voice, Pain Map & Family Triage */}
      {activeSubTab === 'asha_copilot' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-amber-600" />
              6-9. ASHA Low-Literacy Voice Copilot &amp; Multi-Member Camp Triage
            </h3>
            <p className="text-xs text-slate-500">Voice-first handsfree intake for community health workers, pictorial pain scales, and family camp batch processing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ASHA Voice Copilot & Pain Map */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-amber-900 text-sm flex items-center gap-2">
                    <Mic className="w-4 h-4 text-amber-600" />
                    7. ASHA Voice Copilot (Odia / Hindi Guided Voice Intake)
                  </h4>
                  <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded">No Typing Needed</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-amber-200 flex items-center gap-3">
                  <button className="p-3 bg-amber-600 text-white rounded-full shadow-md animate-bounce shrink-0">
                    <Mic className="w-5 h-5" />
                  </button>
                  <div className="text-xs text-amber-900">
                    <p className="font-bold text-slate-900">"କଣ ଛାତି ପୋଡା କିମ୍ବା କଷ୍ଟ ହେଉଛି?"</p>
                    <p className="text-[11px] text-slate-500">ASHA holds mic button and speaks in Odia/Hindi. AI asks logical next triage question.</p>
                  </div>
                </div>
              </div>

              {/* Pictorial Pain Map */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Smile className="w-4 h-4 text-indigo-600" />
                  8. Pictorial Pain Scale &amp; Triage Body Map
                </h4>
                <p className="text-xs text-slate-500">Tap body region and select pain intensity smiley (Ideal for children and non-literate patients).</p>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Body Location:</label>
                    <select
                      value={selectedBodyPart}
                      onChange={(e) => setSelectedBodyPart(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg font-bold"
                    >
                      <option value="Chest / Thorax">🫁 Chest / Thorax</option>
                      <option value="Abdomen / Stomach">🫄 Abdomen / Stomach</option>
                      <option value="Head / Cranial">🧠 Head / Cranial</option>
                      <option value="Lower Back / Spine">🦴 Lower Back / Spine</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Pain Rating (1-10):</label>
                    <div className="p-2 bg-white border border-slate-200 rounded-lg text-center font-extrabold text-indigo-700">
                      Level {painLevel}/10 ({smileys[Math.min(4, Math.floor(painLevel/2))]})
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 9: Family Triage */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-600" />
                  9. Multi-Member Family Triage &amp; Camp Mode
                </h4>
                <span className="text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded">Single Household Batch</span>
              </div>
              <p className="text-xs text-indigo-800">Allows ASHA workers to triage entire households in one camp session (e.g. viral fever outbreaks).</p>

              <div className="space-y-2">
                {familyMembers.map((m, i) => (
                  <div key={i} className="p-2.5 bg-white rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{m.name} ({m.age} yrs)</p>
                      <p className="text-slate-500 text-[11px]">{m.symptom}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                      m.status === 'RED' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Family Member Name"
                  value={newMemName}
                  onChange={(e) => setNewMemName(e.target.value)}
                  className="flex-1 p-2 bg-white border border-indigo-200 rounded-lg text-xs"
                />
                <button
                  onClick={() => {
                    if (newMemName) {
                      setFamilyMembers([...familyMembers, { name: newMemName, age: 22, symptom: 'Fever & Fatigue', status: 'YELLOW' }]);
                      setNewMemName('');
                    }
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                >
                  + Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 13: IDSP Outbreak Radar */}
      {activeSubTab === 'outbreak' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Radar className="w-5 h-5 text-rose-600" />
                13. IDSP Outbreak Radar (Automated District Epidemic Surveillance)
              </h3>
              <p className="text-xs text-slate-500">Monitors cluster symptom spikes across 30 Odisha blocks in real-time.</p>
            </div>
            <span className="px-3 py-1 bg-rose-600 text-white text-xs font-black rounded-full shadow-xs animate-pulse">
              🚨 1 ACTIVE OUTBREAK ALERT
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-200 px-2 py-0.5 rounded">
                  Block: Patnagarh, Balangir District
                </span>
                <h4 className="text-base font-black text-rose-900 mt-1">
                  Acute Watery Diarrhea Cluster Surge (&gt;18 cases in 24 Hours)
                </h4>
              </div>
              <span className="text-xs font-bold text-rose-800">IDSP Form S Auto-Generated</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-rose-200">
                <span className="text-slate-400 font-bold text-[10px] block">24h Case Spike</span>
                <span className="text-xl font-black text-rose-700">19 Patients</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-rose-200">
                <span className="text-slate-400 font-bold text-[10px] block">Primary Symptoms</span>
                <span className="font-bold text-slate-800">Watery Stools, Dehydration</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-rose-200">
                <span className="text-slate-400 font-bold text-[10px] block">Nodal Officer Alerted</span>
                <span className="font-bold text-indigo-700">District Surveillance Officer (DSO)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 15-18: Compliance, DPDP, Fairness & RLHF */}
      {activeSubTab === 'compliance' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-600" />
              15-18. DPDP Act 2023 Digital Consent, AI Fairness &amp; RLHF Dashboard
            </h3>
            <p className="text-xs text-slate-500">Legal data protection compliance, local language audio consent, and doctor feedback reinforcement learning.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consent DPDP */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 text-xs">
              <h4 className="font-extrabold text-emerald-900 text-sm flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-600" />
                15. DPDP Act 2023 Multilingual Audio Consent
              </h4>
              <p className="text-emerald-800">
                Plays a 5-second audio consent in Odia/Hindi before symptom upload explaining how health data is processed.
              </p>

              <div className="p-3 bg-white rounded-xl border border-emerald-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-900">🔊 "ଆପଣଙ୍କ ସ୍ୱାସ୍ଥ୍ୟ ତଥ୍ୟ ଡାକ୍ତର ସମୀକ୍ଷା ପାଇଁ ବ୍ୟବହୃତ ହେବ।"</p>
                  <p className="text-[10px] text-slate-400">Recorded e-Signature Consent Stamp</p>
                </div>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold"
                >
                  {isPlayingAudio ? 'Pause' : 'Play Audio'}
                </button>
              </div>

              <div className="flex items-center gap-2 text-emerald-900 font-bold">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>I explicitly consent to encrypted ABDM health data processing.</span>
              </div>
            </div>

            {/* RLHF & Fairness */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-3 text-xs">
              <h4 className="font-extrabold text-indigo-900 text-sm flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-indigo-600" />
                18. Doctor Feedback Loop (RLHF Accuracy Curve)
              </h4>
              <p className="text-indigo-800">
                Every doctor validation continuously trains local PHC model node without data leaving facility.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white rounded-xl border border-indigo-200 text-center">
                  <span className="text-2xl font-black text-indigo-700">{doctorRating}%</span>
                  <span className="text-[10px] text-slate-500 block font-bold">Doctor Agreement Rate</span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-indigo-200 text-center">
                  <span className="text-2xl font-black text-emerald-600">{feedbackCount}</span>
                  <span className="text-[10px] text-slate-500 block font-bold">Validated Intakes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 20-22: ANC & SMS Receipts */}
      {activeSubTab === 'maternal' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-600" />
              20-22. Maternal ANC Module &amp; Citizen Carbon Copy SMS Receipts
            </h3>
            <p className="text-xs text-slate-500">Specialized high-risk pregnancy screening and zero-internet SMS token dispatch.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 space-y-2">
              <h4 className="font-extrabold text-pink-900 text-sm flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-pink-600" />
                20. ANC High-Risk Pregnancy &amp; EDD Calculator
              </h4>
              <ul className="space-y-1 text-pink-800 font-medium">
                <li>• Estimated Date of Delivery (EDD): <strong>24 October 2026</strong></li>
                <li>• Gestational Age: 16 Weeks 3 Days</li>
                <li>• Risk Protocol: High-Risk Flagged (Severe Anemia &amp; Elevated BP)</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 font-mono">
              <h4 className="font-extrabold text-emerald-400 text-sm flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                22. Carbon Copy Citizen SMS Receipt
              </h4>
              <p className="text-xs text-slate-300">
                "Apanka Token No 23. Medicine OPD Room 2 re dakhantu. High priority triage recorded."
              </p>
              <div className="text-[10px] text-slate-400">✓ Auto-dispatched via NIC SMS Gateway</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
