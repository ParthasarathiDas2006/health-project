/**
 * Clinical Intake NLP & Semantic Parsing Model
 * Specialized for rural Indian healthcare (Odia, Hindi, English).
 * Provides multi-lingual symptom entity extraction, duration parsing,
 * red-flag emergency detection, and clinical translation.
 */

export const CONDITION_PROTOCOLS = {
  cardiac: {
    id: 'cardiac',
    name: { en: 'Cardiac / Chest', hi: 'सीने में दर्द / हृदय', or: 'ଛାତି / ହୃଦୟ' },
    color: 'rose',
    primaryVitals: ['pulse', 'systolic', 'diastolic', 'durationDays'],
    questions: [
      {
        id: 'chest_spread',
        text: {
          en: 'Does the pain or heaviness spread to your left arm, neck, or jaw?',
          hi: 'क्या दर्द या भारीपन बाएं हाथ, गर्दन या जबड़े की तरफ फैल रहा है?',
          or: 'ଯନ୍ତ୍ରଣା କିମ୍ବା ଭାରୀପଣ ବାମ ହାତ, ବେକ କିମ୍ବା ମୁଖଗହ୍ୱର/ହନୁ ଆଡ଼କୁ ବ୍ୟାପୁଛି କି?'
        },
        options: [
          { val: 'no', en: 'No, localized in chest only', hi: 'नहीं, केवल सीने में', or: 'ନାହିଁ, କେବଳ ଛାତିରେ' },
          { val: 'yes_arm', en: 'Yes, radiates to left arm / jaw (CRITICAL)', hi: 'हाँ, बाएं हाथ/जबड़े में फैल रहा है (अति गंभीर)', or: 'ହଁ, ବାମ ହାତ/ମାଢ଼ି ଆଡ଼କୁ ବ୍ୟାପୁଛି (ଅତ୍ୟନ୍ତ ଜରୁରୀ)' }
        ]
      },
      {
        id: 'cold_sweating',
        text: {
          en: 'Are you experiencing profuse cold sweating or severe dizziness?',
          hi: 'क्या ठंडा पसीना आ रहा है या बहुत अधिक चक्कर आ रहे हैं?',
          or: 'ଆପଣଙ୍କୁ କଣ ପ୍ରଚୁର ଥଣ୍ଡା ଝାଳ ବାହାରୁଛି କିମ୍ବା ଭୀଷଣ ମୁଣ୍ଡ ବୁଲାଉଛି?'
        },
        options: [
          { val: 'none', en: 'No cold sweating', hi: 'ठंडा पसीना नहीं है', or: 'ଥଣ୍ଡା ଝାଳ ନାହିଁ' },
          { val: 'heavy_sweat', en: 'Yes, heavy cold sweating & nausea (High Urgency)', hi: 'हाँ, ठंडा पसीना और घबराहट (तत्काल)', or: 'ହଁ, ପ୍ରଚୁର ଥଣ୍ଡା ଝାଳ ଓ ଅସ୍ଥିରତା (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  respiratory: {
    id: 'respiratory',
    name: { en: 'Breathing / Cough', hi: 'सांस / खांसी', or: 'ନିଶ୍ୱାସ / କାଶ' },
    color: 'sky',
    primaryVitals: ['spo2', 'pulse', 'durationDays'],
    questions: [
      {
        id: 'breath_speech',
        text: {
          en: 'Can the patient speak a full sentence without pausing for breath?',
          hi: 'क्या मरीज बिना सांस फूले एक पूरा वाक्य बोल पा रहे हैं?',
          or: 'ରୋଗୀ ଅଣନିଶ୍ୱାସୀ ନହୋଇ ଗୋଟିଏ ପୂରା ବାକ୍ୟ କହିପାରୁଛନ୍ତି କି?'
        },
        options: [
          { val: 'full_sentences', en: 'Yes, speaks full sentences normally', hi: 'हाँ, पूरा वाक्य बोल पा रहे हैं', or: 'ହଁ, ପୂରା ବାକ୍ୟ କହିପାରୁଛନ୍ତି' },
          { val: 'broken_words', en: 'No, gasping / breathless on single words (ALERT)', hi: 'नहीं, एक-एक शब्द में सांस फूल रही है (गंभीर)', or: 'ନାହିଁ, କଥା କହିଲା ବେଳେ ଅଣନିଶ୍ୱାସୀ ହେଉଛନ୍ତି' }
        ]
      },
      {
        id: 'cough_blood',
        text: {
          en: 'Is there any blood or pink froth in the cough / sputum?',
          hi: 'क्या खांसी या बलगम में खून आ रहा है?',
          or: 'କାଶ କିମ୍ବା କଫରେ କଣ ରକ୍ତ ପଡୁଛି କି?'
        },
        options: [
          { val: 'none', en: 'No blood (yellow/white phlegm)', hi: 'खून नहीं है', or: 'ରକ୍ତ ନାହିଁ' },
          { val: 'hemoptysis', en: 'Yes, blood streaks in sputum (Alert)', hi: 'हाँ, बलगम में खून (चेतावनी)', or: 'ହଁ, କଫରେ ରକ୍ତ ଆସୁଛି (ସତର୍କତା)' }
        ]
      }
    ]
  },
  fever: {
    id: 'fever',
    name: { en: 'Fever / Chills', hi: 'बुखार / कंपकंपी', or: 'ଜ୍ୱର / କମ୍ପ' },
    color: 'amber',
    primaryVitals: ['temperature', 'pulse', 'durationDays'],
    questions: [
      {
        id: 'rigors',
        text: {
          en: 'Are you having shaking chills or severe shivering (rigors)?',
          hi: 'क्या आपको ठंड लगकर कंपकंपी के साथ बुखार आता है?',
          or: 'ଆପଣଙ୍କୁ କଣ ଥଣ୍ଡା ଲାଗି କମ୍ପ ସହିତ ଜ୍ୱର ଆସୁଛି (କମ୍ପ ଜ୍ୱର)?'
        },
        options: [
          { val: 'yes', en: 'Yes, with shaking chills/rigors', hi: 'हाँ, कंपकंपी के साथ', or: 'ହଁ, କମ୍ପ ସହିତ' },
          { val: 'no', en: 'No shivering, regular warm fever', hi: 'नहीं, सामान्य बुखार', or: 'ନାହିଁ, ସାଧାରଣ ଜ୍ୱର' }
        ]
      },
      {
        id: 'bleeding',
        text: {
          en: 'Any red spots on skin, nose bleeding, or gum bleeding?',
          hi: 'क्या त्वचा पर लाल चकत्ते, नाक या मसूड़ों से खून आ रहा है?',
          or: 'ଚର୍ମରେ ନାଲି ଦାଗ, ନାକ କିମ୍ବା ମାଢ଼ିରୁ ରକ୍ତସ୍ରାବ ହେଉଛି କି?'
        },
        options: [
          { val: 'none', en: 'None', hi: 'कोई नहीं', or: 'କିଛି ନାହିଁ' },
          { val: 'gum_bleed', en: 'Gum bleeding / red rash (Urgent Dengue Sign)', hi: 'मसूड़ों से खून / लाल चकत्ते (तत्काल)', or: 'ମାଢ଼ିରୁ ରକ୍ତ / ନାଲି ଦାଗ (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  gastro: {
    id: 'gastro',
    name: { en: 'Gastro / Diarrhea', hi: 'पेट / दस्त / उल्टी', or: 'ପେଟ / ଝାଡ଼ା / ବାନ୍ତି' },
    color: 'emerald',
    primaryVitals: ['pulse', 'durationDays'],
    questions: [
      {
        id: 'diarrhea_freq',
        text: {
          en: 'Episodes of loose watery motions or vomiting in last 12 hours:',
          hi: 'पिछले 12 घंटों में दस्त या उल्टी के दौरों की संख्या:',
          or: 'ଗତ ୧୨ ଘଣ୍ଟାରେ କେତେ ଥର ଝାଡ଼ା କିମ୍ବା ବାନ୍ତି ହୋଇଛି:'
        },
        options: [
          { val: '1_to_3', en: '1 to 3 times (Mild - moderate)', hi: '1 से 3 बार (हल्का)', or: '୧ ରୁ ୩ ଥର (ସାମାନ୍ୟ)' },
          { val: 'more_than_6', en: 'More than 6 times (Severe Dehydration Risk)', hi: '6 से अधिक बार (तत्काल निर्जलीकरण)', or: '୬ ରୁ ଅଧିକ ଥର (ଗୁରୁତର ଜଳକ୍ଷୟ)' }
        ]
      },
      {
        id: 'urine_output',
        text: {
          en: 'Patient urine frequency & hydration status:',
          hi: 'मरीज का पेशाब आना एवं पानी पीने की स्थिति:',
          or: 'ରୋଗୀଙ୍କ ପରିସ୍ରା ହେବା ଓ ପାଣି ପିଇବା ସ୍ଥିତି:'
        },
        options: [
          { val: 'normal', en: 'Normal urination, able to drink ORS', hi: 'सामान्य पेशाब, पानी पी पा रहे हैं', or: 'ସାଧାରଣ ପରିସ୍ରା, ଓଆରଏସ୍ ପିଉଛନ୍ତି' },
          { val: 'no_urine', en: 'No urine in 8+ hours, sunken eyes, dry tongue (Urgent)', hi: '8 घंटे से पेशाब बंद, आंखें धंसी (अति गंभीर)', or: '୮ ଘଣ୍ଟାରୁ ପରିସ୍ରା ବନ୍ଦ, ଆଖି ଗାତ (ଜରୁରୀ)' }
        ]
      }
    ]
  },
  neuro: {
    id: 'neuro',
    name: { en: 'Headache / Neuro', hi: 'सिरदर्द / चक्कर', or: 'ମୁଣ୍ଡବିନ୍ଧା / ସ୍ନାୟୁ' },
    color: 'violet',
    primaryVitals: ['systolic', 'diastolic', 'durationDays'],
    questions: [
      {
        id: 'headache_type',
        text: {
          en: 'Nature of headache onset:',
          hi: 'सिरदर्द शुरू होने का प्रकार:',
          or: 'ମୁଣ୍ଡବିନ୍ଧା କିପରି ଭାବରେ ଆରମ୍ଭ ହେଲା:'
        },
        options: [
          { val: 'gradual', en: 'Gradual / regular throbbing or tension', hi: 'धीरे-धीरे शुरू हुआ', or: 'ଧୀରେ ଧୀରେ ବଢ଼ିଲା' },
          { val: 'thunderclap', en: 'Sudden severe "worst headache of life" (RED ALERT)', hi: 'अचानक भयंकर तीव्र सिरदर्द (रेड अलर्ट)', or: 'ହଠାତ୍ ପ୍ରଚଣ୍ଡ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା (ରେଡ୍ ଆଲର୍ଟ)' }
        ]
      },
      {
        id: 'neuro_deficit',
        text: {
          en: 'Any facial drooping, speech slurring, or weakness in one arm/leg?',
          hi: 'क्या चेहरे में टेढ़ापन, बोली लड़खड़ाना या एक हाथ/पैर में कमजोरी है?',
          or: 'ମୁହଁ ବଙ୍କା ହେବା, କଥା ଅସ୍ପଷ୍ଟ ହେବା କିମ୍ବା ଗୋଟିଏ ହାତ/ଗୋଡ଼ ଦୁର୍ବଳ ଲାଗୁଛି କି?'
        },
        options: [
          { val: 'no', en: 'No weakness or speech issues', hi: 'कोई कमजोरी नहीं', or: 'କୌଣସି ଦୁର୍ବଳତା ନାହିଁ' },
          { val: 'stroke_sign', en: 'Yes, sudden weakness / slurred speech (STROKE ALERT)', hi: 'हाँ, एक तरफ कमजोरी या लड़खड़ाहट (स्ट्रोक अलर्ट)', or: 'ହଁ, ଏକପାଖିଆ ଦୁର୍ବଳତା / କଥା ଅସ୍ପଷ୍ଟ (ଷ୍ଟ୍ରୋକ୍ ଆଲର୍ଟ)' }
        ]
      }
    ]
  },
  maternal_pediatric: {
    id: 'maternal_pediatric',
    name: { en: 'Maternal / Pediatric', hi: 'मातृ एवं शिशु', or: 'ମାତୃ ଓ ଶିଶୁ' },
    color: 'teal',
    primaryVitals: ['temperature', 'pulse', 'durationDays'],
    questions: [
      {
        id: 'pregnancy_risk',
        text: {
          en: 'If pregnant: Severe headache, vision blurring, or swollen feet?',
          hi: 'यदि गर्भवती हैं: तेज़ सिरदर्द, आंखों में धुंधलापन या पैरों में सूजन?',
          or: 'ଗର୍ଭବତୀ ହୋଇଥିଲେ: ପ୍ରବଳ ମୁଣ୍ଡବିନ୍ଧା, ଆଖିକୁ ଝାପ୍‌ସା କିମ୍ବା ଗୋଡ଼ ଫୁଲା?'
        },
        options: [
          { val: 'no', en: 'None of these', hi: 'कोई नहीं', or: 'କିଛି ନାହିଁ' },
          { val: 'preeclampsia', en: 'Yes, headache + blurred vision + edema (Pre-eclampsia)', hi: 'हाँ, सिरदर्द + धुंधलापन + सूजन (हाई रिस्क)', or: 'ହଁ, ମୁଣ୍ଡବିନ୍ଧା + ଝାପ୍‌ସା + ଗୋଡ଼ ଫୁଲା (ଉଚ୍ଚ ବିପଦ)' }
        ]
      }
    ]
  },
  trauma_emergency: {
    id: 'trauma_emergency',
    name: { en: 'Emergency / Trauma', hi: 'आघात / आपातकाल', or: 'ଆଘାତ / ଜରୁରୀକାଳୀନ' },
    color: 'rose',
    primaryVitals: ['pulse', 'systolic', 'diastolic', 'durationDays'],
    questions: [
      {
        id: 'active_bleeding',
        text: {
          en: 'Is there heavy active bleeding, suspected fracture, or loss of consciousness?',
          hi: 'क्या भारी रक्तस्राव, फ्रैक्चर या बेहोशी है?',
          or: 'ପ୍ରଚୁର ରକ୍ତସ୍ରାବ, ହାଡ଼ ଭାଙ୍ଗିବା କିମ୍ବା ଅଚେତ ଅବସ୍ଥା ଅଛି କି?'
        },
        options: [
          { val: 'no', en: 'No heavy bleeding', hi: 'भारी रक्तस्राव नहीं', or: 'ରକ୍ତସ୍ରାବ ନାହିଁ' },
          { val: 'severe_trauma', en: 'Yes, heavy bleeding / fracture / unconscious (CRITICAL)', hi: 'हाँ, भारी खून / फ्रैक्चर / बेहोशी (अति गंभीर)', or: 'ହଁ, ପ୍ରଚୁର ରକ୍ତସ୍ରାବ / ଭଙ୍ଗା / ଅଚେତ (ଅତି ଜରୁରୀ)' }
        ]
      }
    ]
  }
};

/**
 * Multi-lingual symptom knowledge database with clinical mappings
 * Accurately categorizes symptoms into critical, severe, moderate, and mild tiers.
 */
const CLINICAL_LEXICON = [
  // ─── Cardiac & Chest (High acuity / Emergency) ───
  {
    id: 'chest_pain_radiating',
    category: 'cardiac',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Potential Acute Coronary Syndrome: Precordial chest pain radiating to left arm / jaw',
    labelEn: 'Radiating Chest Pain',
    labelHi: 'बाएं हाथ में फैलता सीने का दर्द',
    labelOr: 'ବାମ ହାତକୁ ବ୍ୟାପୁଥିବା ଛାତି କଷ୍ଟ',
    patterns: [
      /ବାମ ହାତ|ବାମ ହାତକୁ ଯନ୍ତ୍ରଣା|ବାମ ହାତ ବିନ୍ଧା|ମାଢ଼ି ଆଡ଼କୁ|ବେକ ଆଡ଼କୁ/gi,
      /बाएं हाथ|बाएं बाजू|गर्दन में फैलता दर्द|सीने से हाथ में|जबड़े में दर्द/gi,
      /radiating to left arm|left arm pain|chest to neck|chest to jaw|radiating chest pain/gi
    ]
  },
  {
    id: 'chest_pain',
    category: 'cardiac',
    severity: 'severe',
    labelEn: 'Chest Pain / Angina / Pressure',
    labelHi: 'सीने में दर्द / भारीपन',
    labelOr: 'ଛାତି ଯନ୍ତ୍ରଣା / ଭାରୀପଣ',
    patterns: [
      /ଛାତିରେ ବହୁତ କଷ୍ଟ|ଛାତି କଷ୍ଟ|ଛାତି ଯନ୍ତ୍ରଣା|ଛାତି ଭାରୀ|ଛାତି ବିନ୍ଧା|ଛାତି ଧଡ଼ଧଡ଼|ଛାତିରେ ଚାପ/gi,
      /सीने में दर्द|छाती में दर्द|सीने में भारीपन|छाती में दबाव|दिल में दर्द|घबराहट/gi,
      /chest pain|chest heaviness|chest pressure|angina|palpitations|heart pain/gi
    ]
  },
  {
    id: 'cold_sweating',
    category: 'cardiac',
    severity: 'severe',
    labelEn: 'Profuse Cold Sweating',
    labelHi: 'ठंडा पसीना',
    labelOr: 'ପ୍ରଚୁର ଥଣ୍ଡା ଝାଳ',
    patterns: [
      /ଥଣ୍ଡା ଝାଳ|ପ୍ରଚୁର ଝାଳ|ଝାଳ ବାହାରୁଛି|ଝାଳରେ ଭିଜି|ଝାଳ ବୋହୁଛି/gi,
      /ठंडा पसीना|पसीना छूट रहा|भीषण पसीना|अचानक पसीना|पसीने से लथपथ/gi,
      /cold sweat|profuse sweating|diaphoresis|drenched in sweat|sweating profusely/gi
    ]
  },

  // ─── Respiratory (Airway & Breathing) ───
  {
    id: 'severe_dyspnea',
    category: 'respiratory',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Acute Respiratory Distress: Severe shortness of breath or cyanosis signal',
    labelEn: 'Severe Breathlessness (Gasping)',
    labelHi: 'तीव्र सांस संकट (दम फूलना)',
    labelOr: 'ତୀବ୍ର ନିଶ୍ୱାସ କଷ୍ଟ (ଅଣନିଶ୍ୱାସୀ)',
    patterns: [
      /ଅଣନିଶ୍ୱାସୀ|ନିଶ୍ୱାସ ନେବାରେ ଭୀଷଣ କଷ୍ଟ|ନିଶ୍ୱାସ ନେଇପାରୁନି|ଦମ ଲାଗୁଛି|ଦମ ବନ୍ଦ|ନିଶ୍ୱାସ ଅଟକି/gi,
      /सांस लेने में बहुत ज्यादा तकलीफ|दम फूल रहा|सांस अटक रही|सांस नहीं आ रही|होंठ नीले|सांस बंद/gi,
      /severe shortness of breath|cannot breathe|gasping|severe dyspnea|respiratory distress|choking/gi
    ]
  },
  {
    id: 'hemoptysis',
    category: 'respiratory',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Hemoptysis Alert: Blood noted in sputum/cough (Suspected TB or pulmonary hemorrhage)',
    labelEn: 'Blood in Cough (Hemoptysis)',
    labelHi: 'खांसी में खून (हेमोप्टाइसिस)',
    labelOr: 'କାଶରେ ରକ୍ତ ପଡ଼ିବା',
    patterns: [
      /କଫରେ ରକ୍ତ|କାଶରେ ରକ୍ତ|ରକ୍ତ କାଶ|ରକ୍ତ ପଡୁଛି/gi,
      /खांसी में खून|बलगम में खून|खून की उल्टी जैसी खांसी|खांसी के साथ खून/gi,
      /blood in cough|blood in sputum|coughing blood|hemoptysis|blood tinged sputum/gi
    ]
  },
  {
    id: 'dyspnea',
    category: 'respiratory',
    severity: 'severe',
    labelEn: 'Shortness of Breath / Wheezing',
    labelHi: 'सांस लेने में कठिनाई / घबराहट',
    labelOr: 'ନିଶ୍ୱାସ କଷ୍ଟ / ଶଁ ଶଁ ଶବ୍ଦ',
    patterns: [
      /ନିଶ୍ୱାସ ନେବାରେ କଷ୍ଟ|ନିଶ୍ୱାସ କଷ୍ଟ|ନିଶ୍ୱାସ ଫୁଲୁଛି|ଶଁ ଶଁ ଶବ୍ଦ|ଛାତି ଘଡ଼ଘଡ଼/gi,
      /सांस लेने में तकलीफ|सांस फूलना|दम घुटना|सांस में सीटी|घरघराहट/gi,
      /shortness of breath|breathless|dyspnea|wheezing|asthma|bronchospasm/gi
    ]
  },
  {
    id: 'productive_cough',
    category: 'respiratory',
    severity: 'moderate',
    labelEn: 'Productive Cough with Phlegm',
    labelHi: 'बलगम वाली खांसी',
    labelOr: 'କଫ ସହ କାଶ',
    patterns: [
      /କଫ ସହ କାଶ|କଫ ପଡୁଛି|ଘଡ଼ଘଡ଼ କାଶ|କାଶରେ କଫ|ପାଚିଲା କଫ/gi,
      /बलगम वाली खांसी|खांसी में बलगम|कफ आ रहा|पीला बलगम/gi,
      /cough with phlegm|productive cough|wet cough|expectoration|yellow phlegm/gi
    ]
  },
  {
    id: 'cough',
    category: 'respiratory',
    severity: 'mild',
    labelEn: 'Dry Cough',
    labelHi: 'सूखी खांसी',
    labelOr: 'ଶୁଖିଲା କାଶ',
    patterns: [
      /ଶୁଖିଲା କାଶ|କାଶ ହେଉଛି|ସାମାନ୍ୟ କାଶ|ଟିକେ କାଶ/gi,
      /सूखी खांसी|हल्की खांसी|खांसी हो रही|खांसी/gi,
      /dry cough|mild cough|coughing|irritating cough/gi
    ]
  },
  {
    id: 'rhinitis_cold',
    category: 'respiratory',
    severity: 'mild',
    labelEn: 'Common Cold / Runny Nose',
    labelHi: 'जुकाम / छींकें / बहती नाक',
    labelOr: 'ଥଣ୍ଡା ସର୍ଦ୍ଦି / ଛିଙ୍କ / ନାକରୁ ପାଣି',
    patterns: [
      /ଛିଙ୍କ|ସର୍ଦ୍ଦି|ନାକରୁ ପାଣି|ନାକ ବନ୍ଦ|ସାମାନ୍ୟ ଥଣ୍ଡା|ଗଳା ଖସଖସ/gi,
      /जुकाम|छींक|छींकें|बहती नाक|नाक बंद|गले में खराश/gi,
      /runny nose|sneezing|common cold|coryza|nasal congestion|sore throat/gi
    ]
  },

  // ─── Fever & Systemic Infections ───
  {
    id: 'bleeding_rash',
    category: 'fever',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Hemorrhagic / Dengue Alert: Bleeding gums, epistaxis, or petechial rash observed',
    labelEn: 'Bleeding Gums / Petechial Rash',
    labelHi: 'मसूड़ों से खून / लाल चकत्ते',
    labelOr: 'ମାଢ଼ିରୁ ରକ୍ତ / ନାଲି ଦାଗ',
    patterns: [
      /ମାଢ଼ିରୁ ରକ୍ତ|ନାକରୁ ରକ୍ତ|ଚର୍ମରେ ନାଲି ଦାଗ|ନାଲି ଚିହ୍ନ|ରକ୍ତ ଦାଗ/gi,
      /मसूड़ों से खून|नाक से खून|लाल चकत्ते|शरीर पर लाल दाने|रक्तस्राव/gi,
      /gum bleeding|nose bleeding|red spots|petechiae|bleeding rash|purpura/gi
    ]
  },
  {
    id: 'high_fever_rigors',
    category: 'fever',
    severity: 'severe',
    labelEn: 'High Fever with Chills & Rigors',
    labelHi: 'कंपकंपी के साथ तेज बुखार',
    labelOr: 'କମ୍ପ ଜ୍ୱର (ଥଣ୍ଡା ଲାଗି ଜ୍ୱର)',
    patterns: [
      /ଥଣ୍ଡା ଲାଗି କମ୍ପ|କମ୍ପ ସହିତ ଜ୍ୱର|ଥଣ୍ଡା ଲାଗି ଜ୍ୱର|କମ୍ପି କମ୍ପି ଜ୍ୱର|କମ୍ପ ହେଉଛି/gi,
      /कंपकंपी के साथ बुखार|ठंड लगकर बुखार|थरथराहट के साथ बुखार|कंपकंपी/gi,
      /fever with chills|shivering fever|rigors|chills and high temp|shaking chills/gi
    ]
  },
  {
    id: 'high_fever',
    category: 'fever',
    severity: 'severe',
    labelEn: 'High Grade Fever',
    labelHi: 'तेज बुखार',
    labelOr: 'ପ୍ରବଳ ଜ୍ୱର',
    patterns: [
      /ପ୍ରବଳ ଜ୍ୱର|ଭୀଷଣ ଜ୍ୱର|ପ୍ରବଳ ତାତି|ଜ୍ୱର ଛାଡୁନି|ଉଚ୍ଚ ଜ୍ୱର/gi,
      /तेज़ बुखार|तेज बुखार|बहुत तेज बुखार|बुखार नहीं उतर रहा|तेज ताप/gi,
      /high fever|high grade fever|high temperature|burning fever|fever not subsiding/gi
    ]
  },
  {
    id: 'mild_fever',
    category: 'fever',
    severity: 'mild',
    labelEn: 'Mild / Low Grade Fever',
    labelHi: 'हल्का बुखार',
    labelOr: 'ସାମାନ୍ୟ ଜ୍ୱର',
    patterns: [
      /ସାମାନ୍ୟ ଜ୍ୱର|ହାଲୁକା ଜ୍ୱର|ଟିକେ ତାତି|ଜ୍ୱର ଜ୍ୱର ଲାଗୁଛି/gi,
      /हल्का बुखार|धीमा बुखार|हल्का गरम बदन/gi,
      /mild fever|low grade fever|slight fever|feeling warm/gi
    ]
  },
  {
    id: 'mild_bodyache',
    category: 'fever',
    severity: 'mild',
    labelEn: 'Body Ache / Fatigue',
    labelHi: 'बदन दर्द / थकावट',
    labelOr: 'ଦେହ ଘୋଳାବିନ୍ଧା / ଦୁର୍ବଳତା',
    patterns: [
      /ଦେହ ଘୋଳାବିନ୍ଧା|ହାତ ଗୋଡ଼ ବିନ୍ଧା|ଅଣ୍ଟା ବିନ୍ଧା|ଦୁର୍ବଳ ଲାଗୁଛି/gi,
      /बदन दर्द|हाथ पैर दर्द|थकावट|कमजोरी|कमर दर्द/gi,
      /body ache|body pain|myalgia|mild fatigue|tiredness/gi
    ]
  },

  // ─── Gastrointestinal ───
  {
    id: 'severe_diarrhea_vomiting',
    category: 'gastro',
    severity: 'severe',
    labelEn: 'Acute Diarrhea & Vomiting',
    labelHi: 'तीव्र दस्त एवं उल्टी',
    labelOr: 'ପ୍ରବଳ ଝାଡ଼ା ଓ ବାନ୍ତି (ଜଳକ୍ଷୟ)',
    patterns: [
      /ଝାଡ଼ା ବାନ୍ତି|ଝାଡା ବାନ୍ତି|ପାଣି ଭଳି ଝାଡ଼ା|ପ୍ରବଳ ଝାଡ଼ା|ବାରମ୍ବାର ଝାଡ଼ା/gi,
      /दस्त और उल्टी|पानी जैसा दस्त|लगातार उल्टी दस्त|बार-बार दस्त/gi,
      /diarrhea and vomiting|watery loose stools|frequent loose motions|acute gastroenteritis/gi
    ]
  },
  {
    id: 'severe_abdominal_pain',
    category: 'gastro',
    severity: 'severe',
    labelEn: 'Severe Abdominal Pain / Colic',
    labelHi: 'तीव्र असहनीय पेट दर्द',
    labelOr: 'ଅସହ୍ୟ ତୀବ୍ର ପେଟ ଯନ୍ତ୍ରଣା',
    patterns: [
      /ପେଟରେ ଭୀଷଣ ଯନ୍ତ୍ରଣା|ପେଟ କାଟି ପକାଉଛି|ଅସହ୍ୟ ପେଟ କଷ୍ଟ|ପେଟ ଫାଟିଯାଉଛି/gi,
      /पेट में बहुत तेज दर्द|असहनीय पेट दर्द|पेट फटा जा रहा|भयंकर पेट दर्द/gi,
      /severe abdominal pain|acute stomach pain|severe stomach cramps|intense belly pain/gi
    ]
  },
  {
    id: 'abdominal_pain',
    category: 'gastro',
    severity: 'moderate',
    labelEn: 'Abdominal Cramps / Pain',
    labelHi: 'पेट में दर्द / मरोड़',
    labelOr: 'ପେଟ ଯନ୍ତ୍ରଣା / ମୋଡ଼ିବା',
    patterns: [
      /ପେଟ ଯନ୍ତ୍ରଣା|ପେଟ ବିନ୍ଧା|ପେଟ କାଟୁଛି|ପେଟ ମୋଡ଼ୁଛି|ପେଟରେ ଯନ୍ତ୍ରଣା/gi,
      /पेट में दर्द|पेट दर्द|पेट मरोड़|पेट में ऐंठन/gi,
      /abdominal pain|stomach ache|stomach cramps|belly pain/gi
    ]
  },
  {
    id: 'vomiting',
    category: 'gastro',
    severity: 'moderate',
    labelEn: 'Persistent Vomiting / Nausea',
    labelHi: 'लगातार उल्टी / जी मिचलाना',
    labelOr: 'ବାନ୍ତି ହେବା / ବାନ୍ତି ଲାଗିବା',
    patterns: [
      /ବାନ୍ତି ହେଉଛି|ବାନ୍ତି ଲାଗୁଛି|ବାନ୍ତି ହେବା|ବାନ୍ତି/gi,
      /उल्टी हो रही|उल्टी आ रही|जी मिचला रहा|उल्टी/gi,
      /vomiting|nausea|throwing up|emesis/gi
    ]
  },
  {
    id: 'indigestion_acidity',
    category: 'gastro',
    severity: 'mild',
    labelEn: 'Indigestion / Acidity',
    labelHi: 'गैस / अपच / एसिडिटी',
    labelOr: 'ଗ୍ୟାସ୍ / ଅଜୀର୍ଣ୍ଣ / ଖଟା ଢେକୁର',
    patterns: [
      /ଗ୍ୟାସ୍|ଖଟା ଢେକୁର|ପେଟ ଫୁଲା|ଅଜୀର୍ଣ୍ଣ/gi,
      /गैस बन रही|खट्टी डकार|पेट भारी|एसिडिटी|अपच/gi,
      /acidity|gas|indigestion|heartburn|bloating|dyspepsia/gi
    ]
  },

  // ─── Neurological ───
  {
    id: 'thunderclap_headache',
    category: 'neuro',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Thunderclap Cephalea Alert: Sudden unbearable worst headache (Suspected Subarachnoid Hemorrhage/Stroke)',
    labelEn: 'Sudden Unbearable Headache',
    labelHi: 'अचानक असहनीय भीषण सिरदर्द',
    labelOr: 'ହଠାତ୍ ଅସହ୍ୟ ପ୍ରଚଣ୍ଡ ମୁଣ୍ଡବିନ୍ଧା',
    patterns: [
      /ହଠାତ୍ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା|ମୁଣ୍ଡ ଫାଟିଯାଉଛି|ଭୀଷଣ ମୁଣ୍ଡ ଯନ୍ତ୍ରଣା|ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା/gi,
      /अचानक भयंकर सिरदर्द|सिर फटा जा रहा|जीवन का सबसे भयानक सिरदर्द|असहनीय सिरदर्द/gi,
      /worst headache of life|thunderclap headache|sudden explosive headache|unbearable headache/gi
    ]
  },
  {
    id: 'stroke_weakness',
    category: 'neuro',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Acute Stroke Signal (FAST): Facial drooping, unilateral limb weakness or speech slurring',
    labelEn: 'Limb Weakness / Slurred Speech',
    labelHi: 'एक तरफ कमजोरी / लड़खड़ाती बोली',
    labelOr: 'ଏକପାଖିଆ ଦୁର୍ବଳତା / ଅସ୍ପଷ୍ଟ କଥା',
    patterns: [
      /ହାତ ଗୋଡ଼ ଅବଶ|ମୁହଁ ବଙ୍କା|କଥା ଅସ୍ପଷ୍ଟ|ଏକପାଖିଆ ଦୁର୍ବଳ|ଗୋଟିଏ ପାଖ କାମ କରୁନି/gi,
      /हाथ पैर सुन्न|लकवा जैसा|मुंह टेढ़ा|बोली लड़खड़ा रही|एक तरफ कमजोरी/gi,
      /facial droop|slurred speech|arm weakness|unilateral numbness|stroke signs|paralysis/gi
    ]
  },
  {
    id: 'unconscious_syncope',
    category: 'neuro',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Altered Sensorium / Syncope: Unconscious or acute collapse',
    labelEn: 'Loss of Consciousness / Fainting',
    labelHi: 'बेहोशी / चक्कर खाकर गिरना',
    labelOr: 'ଅଚେତ / ଚେତା ବୁଲିଯିବା',
    patterns: [
      /ଅଚେତ|ଚେତା ବୁଲିଗଲା|ହୋସ୍ ନାହିଁ|ପଡ଼ିଗଲେ|ଚେତା ହରାଇ/gi,
      /बेहोश|बेहोशी|चक्कर खाकर गिर पड़े|होश नहीं|अचेत/gi,
      /unconscious|fainted|syncope|passed out|blackout|collapsed/gi
    ]
  },
  {
    id: 'seizures_convulsions',
    category: 'neuro',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Active Convulsions / Seizures: High emergency risk',
    labelEn: 'Convulsions / Fits / Seizures',
    labelHi: 'दौरे / झटके / मिर्गी',
    labelOr: 'ବାତ ମାରିବା / କମ୍ପନ',
    patterns: [
      /ବାତ ମାରୁଛି|ବାତ ଆସିଲା|ଶରୀର ଟାଣି ହୋଇଗଲା|ଖିଞ୍ଚଣି/gi,
      /दौरे पड़ रहे|झटके आ रहे|मिर्गी|ऐंठन/gi,
      /seizure|convulsions|fits|epileptic attack/gi
    ]
  },
  {
    id: 'severe_headache',
    category: 'neuro',
    severity: 'severe',
    labelEn: 'Severe Headache / Migraine',
    labelHi: 'तेज सिरदर्द / माइग्रेन',
    labelOr: 'ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା / ମାଇଗ୍ରେନ୍',
    patterns: [
      /ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା|ମୁଣ୍ଡ ଯନ୍ତ୍ରଣା|ପ୍ରବଳ ମୁଣ୍ଡ ବିନ୍ଧା|ମାଇଗ୍ରେନ୍/gi,
      /सिर में तेज़ दर्द|भयंकर सिरदर्द|माइग्रेन|माथा फटा जा रहा/gi,
      /severe headache|throbbing headache|migraine|intense headache/gi
    ]
  },
  {
    id: 'dizziness_vertigo',
    category: 'neuro',
    severity: 'moderate',
    labelEn: 'Dizziness / Vertigo',
    labelHi: 'चक्कर आना / सिर घूमना',
    labelOr: 'ମୁଣ୍ଡ ବୁଲାଇବା / ଅଚେତ ଭାବ',
    patterns: [
      /ମୁଣ୍ଡ ବୁଲାଉଛି|ମୁଣ୍ଡ ବୁଲାଇବା|ଆଖି ଆଗରେ ଅନ୍ଧାର|ଘୂର୍ଣ୍ଣି/gi,
      /चक्कर आ रहा|चक्कर आना|सिर घूम रहा|आंखों के आगे अंधेरा/gi,
      /dizziness|vertigo|feeling faint|lightheadedness|giddiness/gi
    ]
  },
  {
    id: 'mild_headache',
    category: 'neuro',
    severity: 'mild',
    labelEn: 'Mild Tension Headache',
    labelHi: 'हल्का सिरदर्द',
    labelOr: 'ସାମାନ୍ୟ ମୁଣ୍ଡବିନ୍ଧା',
    patterns: [
      /ସାମାନ୍ୟ ମୁଣ୍ଡବିନ୍ଧା|ହାଲୁକା ମୁଣ୍ଡ ବିନ୍ଧା|ଟିକେ ମୁଣ୍ଡ ଭାରୀ/gi,
      /हल्का सिरदर्द|माथा भारी/gi,
      /mild headache|slight headache|tension headache/gi
    ]
  },

  // ─── Maternal & Pediatric ───
  {
    id: 'preeclampsia_triad',
    category: 'maternal_pediatric',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Severe Pre-eclampsia Alert: High risk pregnant woman with headache, visual blurring, or swelling',
    labelEn: 'Pregnancy Pre-eclampsia Signs',
    labelHi: 'गर्भावस्था में उच्च जोखिम (प्री-एक्लेमप्सिया)',
    labelOr: 'ଗର୍ଭାବସ୍ଥାରେ ପ୍ରି-ଏକ୍ଲାମ୍ପସିଆ ଲକ୍ଷଣ',
    patterns: [
      /ଗର୍ଭବତୀ|୮ ମାସ ଗର୍ଭ|ଗର୍ଭାବସ୍ଥା|ଗୋଡ଼ ଫୁଲିଯାଇଛି|ଆଖିକୁ ଝାପ୍‌ସା/gi,
      /गर्भवती|8 महीने का गर्भ|पैरों में भारी सूजन|आंखों से धुंधला|गर्भावस्था में सिरदर्द/gi,
      /pregnant|8 months pregnant|blurred vision in pregnancy|pedal edema pregnant|preeclampsia/gi
    ]
  },
  {
    id: 'pediatric_dehydration',
    category: 'maternal_pediatric',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Severe Pediatric Dehydration: Infant with sunken eyes, lethargy, or absent urine output',
    labelEn: 'Pediatric Sunken Eyes / Anuria',
    labelHi: 'शिशु में गंभीर निर्जलीकरण (धंसी आंखें / पेशाब बंद)',
    labelOr: 'ଶିଶୁ ଗୁରୁତର ଜଳକ୍ଷୟ (ଆଖି ଗାତ / ପରିସ୍ରା ବନ୍ଦ)',
    patterns: [
      /ଛୁଆକୁ|ପିଲାଟି|ଆଖି ଗାତ|ପରିସ୍ରା ହେଉନି|ଶିଶୁ କାନ୍ଦୁନି/gi,
      /बच्चे को|शिशु|आंखें धंसी|पेशाब नहीं आ रहा|दूध नहीं पी रहा/gi,
      /child sunken eyes|infant dehydration|no urine child|not feeding child/gi
    ]
  },

  // ─── Trauma, Injuries & Toxicological Emergencies ───
  {
    id: 'severe_trauma_fracture',
    category: 'trauma_emergency',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Severe Trauma / Fracture / Active Hemorrhage',
    labelEn: 'Trauma / Fracture / Bleeding',
    labelHi: 'गंभीर चोट / फ्रैक्चर / भारी रक्तस्राव',
    labelOr: 'ଗୁରୁତର ଆଘାତ / ହାଡ଼ ଭାଙ୍ଗିବା / ରକ୍ତସ୍ରାବ',
    patterns: [
      /ଆକ୍ସିଡେଣ୍ଟ|ଦୁର୍ଘଟଣା|ହାଡ଼ ଭାଙ୍ଗି|ପ୍ରଚୁର ରକ୍ତ|ଗଭୀର କ୍ଷତ/gi,
      /एक्सीडेंट|दुर्घटना|हड्डी टूट|भारी खून|गहरा घाव|फ्रैक्चर/gi,
      /accident|fracture|broken bone|heavy bleeding|open fracture|deep wound/gi
    ]
  },
  {
    id: 'poisoning_snakebite',
    category: 'trauma_emergency',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Snakebite / Poisoning: Requires Immediate Anti-Venom or Resuscitation',
    labelEn: 'Snakebite / Poison Ingestion',
    labelHi: 'सर्पदंश / विषैला पदार्थ निगलना',
    labelOr: 'ସାପ କାମୁଡ଼ା / ବିଷପାନ',
    patterns: [
      /ସାପ କାମୁଡ଼ି|ବିଷ ପିଇ|କୀଟନାଶକ/gi,
      /सांप ने काटा|जहर खा लिया|कीटनाशक/gi,
      /snake bite|snakebite|poisoning|ingested poison|pesticide/gi
    ]
  },
  {
    id: 'severe_burns',
    category: 'trauma_emergency',
    severity: 'critical',
    isRedFlag: true,
    redFlagNote: 'Severe Thermal Burn Injury: Immediate emergency fluid and burn care',
    labelEn: 'Severe Burn Injury',
    labelHi: 'गंभीर रूप से जलना',
    labelOr: 'ଗୁରୁତର ପୋଡ଼ିଯିବା',
    patterns: [
      /ପୋଡ଼ିଯାଇଛି|ନିଆଁ ଲାଗି/gi,
      /जल गया|आग से जलना|गंभीर जलन/gi,
      /severe burn|fire burn|chemical burn/gi
    ]
  }
];

/**
 * Common phrase replacements for clinical English translation
 */
const TRANSLATION_PATTERNS = [
  // Odia to Clinical English
  { regex: /ମୋ ଛାତିରେ ବହୁତ କଷ୍ଟ ହେଉଛି/gi, rep: 'Severe retrosternal chest pain' },
  { regex: /ବାମ ହାତକୁ ଯନ୍ତ୍ରଣା ଯାଉଛି/gi, rep: 'radiating to left arm' },
  { regex: /ପ୍ରଚୁର ଝାଳ ବାହାରୁଛି|ଥଣ୍ଡା ଝାଳ/gi, rep: 'with profuse cold diaphoresis' },
  { regex: /ପ୍ରବଳ ଜ୍ୱର|ଭୀଷଣ ଜ୍ୱର/gi, rep: 'high-grade fever' },
  { regex: /ସାମାନ୍ୟ ଜ୍ୱର|ହାଲୁକା ଜ୍ୱର/gi, rep: 'low-grade mild fever' },
  { regex: /ଥଣ୍ଡା ଲାଗି କମ୍ପ|କମ୍ପ ସହିତ ଜ୍ୱର/gi, rep: 'with shaking chills and rigors' },
  { regex: /କଫ ସହ କାଶ/gi, rep: 'cough with productive sputum' },
  { regex: /ଶୁଖିଲା କାଶ/gi, rep: 'dry non-productive cough' },
  { regex: /ସାମାନ୍ୟ କାଶ ଓ ଛିଙ୍କ|ଛିଙ୍କ/gi, rep: 'mild coryza and sneezing' },
  { regex: /ନାକରୁ ପାଣି ବୋହୁଛି|ନାକ ବନ୍ଦ/gi, rep: 'rhinorrhea and nasal congestion' },
  { regex: /ନିଶ୍ୱାସ ନେବାରେ ଭୀଷଣ କଷ୍ଟ|ଅଣନିଶ୍ୱାସୀ/gi, rep: 'severe dyspnea / respiratory distress' },
  { regex: /ନିଶ୍ୱାସ କଷ୍ଟ/gi, rep: 'shortness of breath' },
  { regex: /କାଶରେ ରକ୍ତ/gi, rep: 'hemoptysis (blood in sputum)' },
  { regex: /ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧା|ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା/gi, rep: 'severe intractable cephalea' },
  { regex: /ସାମାନ୍ୟ ମୁଣ୍ଡବିନ୍ଧା/gi, rep: 'mild tension headache' },
  { regex: /ପ୍ରବଳ ଝାଡ଼ା ଓ ବାନ୍ତି|ଝାଡ଼ା ବାନ୍ତି/gi, rep: 'acute watery diarrhea and vomiting' },
  { regex: /ପେଟରେ ଭୀଷଣ ଯନ୍ତ୍ରଣା/gi, rep: 'acute severe abdominal colic' },
  { regex: /ପେଟ ଯନ୍ତ୍ରଣା|ପେଟ ବିନ୍ଧା/gi, rep: 'abdominal pain / cramps' },
  { regex: /ମାଢ଼ିରୁ ରକ୍ତ|ଚର୍ମରେ ନାଲି ଦାଗ/gi, rep: 'bleeding gums / petechial rash' },
  { regex: /ମୁଣ୍ଡ ବୁଲାଉଛି|ମୁଣ୍ଡ ବୁଲାଇବା/gi, rep: 'vertigo and dizziness' },
  { regex: /ପରିସ୍ରା ହେଉନି/gi, rep: 'anuria / absent urine output' },

  // Hindi to Clinical English
  { regex: /सीने में दर्द|छाती में दर्द|सीने में भारीपन/gi, rep: 'severe chest pressure and discomfort' },
  { regex: /बाएं हाथ में फैलता|बाएं हाथ में खिंचाव/gi, rep: 'radiating to left upper limb' },
  { regex: /ठंडा पसीना छूट रहा|पसीना आ रहा/gi, rep: 'associated with cold sweating' },
  { regex: /तेज़ बुखार|तेज बुखार/gi, rep: 'high pyrexia / fever' },
  { regex: /हल्का बुखार/gi, rep: 'low-grade mild fever' },
  { regex: /कंपकंपी के साथ|ठंड लगकर/gi, rep: 'with chills and rigors' },
  { regex: /सांस लेने में बहुत ज्यादा तकलीफ|दम फूल रहा/gi, rep: 'acute respiratory distress / severe breathlessness' },
  { regex: /बलगम वाली खांसी/gi, rep: 'cough with phlegm' },
  { regex: /हल्की खांसी और छींकें|छींकें आ रही हैं/gi, rep: 'mild cough, coryza and sneezing' },
  { regex: /सिर में तेज़ दर्द/gi, rep: 'severe throbbing headache' },
  { regex: /दस्त और उल्टी|उल्टी दस्त/gi, rep: 'gastroenteritis with loose watery stools and emesis' },
  { regex: /पेट में असहनीय दर्द|पेट में तेज दर्द/gi, rep: 'acute abdominal pain' },
  { regex: /मसूड़ों से खून|लाल चकत्ते/gi, rep: 'gum bleeding and hemorrhagic petechial spots' },
  { regex: /चक्कर आ रहे हैं|चक्कर आना/gi, rep: 'lightheadedness and vertigo' }
];

/**
 * Normalizes Odia and Hindi digits into standard Arabic digits
 */
export function normalizeIndicDigits(text = '') {
  if (!text) return '';
  const indicMap = {
    '୦': '0', '୧': '1', '୨': '2', '୩': '3', '୪': '4',
    '୫': '5', '୬': '6', '୭': '7', '୮': '8', '୯': '9',
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  return text.replace(/[୦-୯०-९]/g, (char) => indicMap[char] || char);
}

/**
 * Duration parsing regex across languages (Odia, Hindi, English)
 */
export function parseDurationDays(text = '') {
  if (!text) return null;
  const normalized = normalizeIndicDigits(text);

  // Odia numbers or words
  if (/(\d+)\s*ଦିନ/i.test(normalized)) {
    const match = normalized.match(/(\d+)\s*ଦିନ/i);
    return match ? match[1] : null;
  }
  if (/ଦୁଇ\s*ଦିନ/i.test(text)) return '2';
  if (/ତିନି\s*ଦିନ/i.test(text)) return '3';
  if (/ଚାରି\s*ଦିନ/i.test(text)) return '4';
  if (/ଗୋଟିଏ\s*ଦିନ/i.test(text)) return '1';
  if (/ଗତକାଲିଠାରୁ/i.test(text)) return '1';

  // Hindi numbers or words
  if (/(\d+)\s*दिन/i.test(normalized)) {
    const match = normalized.match(/(\d+)\s*दिन/i);
    return match ? match[1] : null;
  }
  if (/दो\s*दिन/i.test(text)) return '2';
  if (/तीन\s*दिन/i.test(text)) return '3';
  if (/चार\s*दिन/i.test(text)) return '4';
  if (/एक\s*दिन|कल\s*से/i.test(text)) return '1';
  if (/एक\s*हफ्ते|1\s*हफ्ते/i.test(normalized)) return '7';

  // English numbers or words
  const engMatch = normalized.match(/(\d+)\s*(day|days|d)\b/i);
  if (engMatch) return engMatch[1];
  if (/two days/i.test(text)) return '2';
  if (/three days/i.test(text)) return '3';
  if (/four days/i.test(text)) return '4';
  if (/since yesterday/i.test(text)) return '1';
  if (/one week/i.test(text)) return '7';

  return null;
}

/**
 * Temperature parsing from spoken text across languages (e.g. 102 fever, 101.5 degree, 103 bukhar, ୧୦୨ ଜ୍ୱର)
 */
export function parseSpokenTemperature(text = '') {
  if (!text) return null;
  const normalized = normalizeIndicDigits(text);
  const match = normalized.match(/\b(9[7-9]|10[0-6])(?:\.[0-9])?\s*(?:degree|deg|f|fahrenheit|डिग्री|ଡିଗ୍ରୀ)?/i);
  if (match) {
    const num = parseFloat(match[0].replace(/[^\d.]/g, ''));
    if (num >= 96 && num <= 107) {
      return num.toFixed(1);
    }
  }
  return null;
}

/**
 * Spoken pain level parsing (1-10 scale or verbal descriptors)
 */
export function parseSpokenPainLevel(text = '') {
  if (!text) return null;
  const normalized = normalizeIndicDigits(text);

  // Look for numeric pain scale (e.g. pain 8/10, dard 7 out of 10)
  const numMatch = normalized.match(/(?:pain|dard|jantrana|ଯନ୍ତ୍ରଣା|दर्द)\s*(?:is|level|score|ମାତ୍ରା)?\s*([1-9]|10)(?:\s*(?:\/|out of|ମଧ୍ୟରୁ|में से)\s*10)?/i);
  if (numMatch) return parseInt(numMatch[1], 10);

  // Verbal pain descriptors
  if (/ଅସହ୍ୟ ଯନ୍ତ୍ରଣା|ଭୀଷଣ କଷ୍ଟ|ଅସହ୍ୟ କଷ୍ଟ|ପ୍ରଚଣ୍ଡ ଯନ୍ତ୍ରଣା|ଫାଟିଯାଉଛି/i.test(text)) return 9;
  if (/असहनीय दर्द|भयंकर दर्द|बहुत ज्यादा दर्द|सिर फटा जा रहा/i.test(text)) return 9;
  if (/unbearable pain|severe pain|excruciating|worst pain|agony/i.test(text)) return 9;
  if (/ମଧ୍ୟମ ଯନ୍ତ୍ରଣା|ଟିକେ କଷ୍ଟ|मध्यम दर्द|moderate pain/i.test(text)) return 5;
  if (/ସାମାନ୍ୟ କଷ୍ଟ|ହଲକା|हल्का दर्द|mild pain/i.test(text)) return 2;

  return null;
}

/**
 * Main AI / NLP Clinical Entity Extraction & Urgency Stratification Function
 * Analyzes unstructured raw speech across languages and extracts:
 * - Detected symptoms with severity (critical, severe, moderate, mild)
 * - Red flag emergency warnings
 * - Multi-tier Urgency ranking (RED / YELLOW / GREEN) and realistic clinical score (0-100)
 * - Auto-detected primary category
 * - Extracted vitals (duration, temperature, pain level)
 * - Professional clinical English translation
 */
export function processIntakeSpeech(rawText = '', currentLanguage = 'or-IN', context = {}) {
  if (!rawText || !rawText.trim()) {
    return {
      rawSpeech: '',
      clinicalTranslation: '',
      detectedSymptoms: [],
      redFlags: [],
      urgencyTier: 'GREEN',
      urgencyScore: 20,
      urgencyLabel: 'Stable / Routine Care (PHC OPD)',
      primaryCategory: 'fever',
      durationDays: null,
      extractedTemp: null,
      chiefComplaint: ''
    };
  }

  const clean = rawText.trim();
  const lower = clean.toLowerCase();

  // 1. Match Clinical Symptoms & Red Flags
  const detectedSymptoms = [];
  const redFlags = [];
  const categoryCounts = {};

  for (const item of CLINICAL_LEXICON) {
    let matched = false;
    for (const pat of item.patterns) {
      if (pat.test(clean)) {
        matched = true;
        break;
      }
    }

    if (matched) {
      detectedSymptoms.push({
        id: item.id,
        category: item.category,
        severity: item.severity,
        labelEn: item.labelEn,
        labelHi: item.labelHi,
        labelOr: item.labelOr
      });

      categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;

      if (item.isRedFlag) {
        redFlags.push({
          id: item.id,
          note: item.redFlagNote,
          symptom: item.labelEn
        });
      }
    }
  }

  // 2. Determine Primary Category based on highest match or default
  let primaryCategory = 'fever';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      primaryCategory = cat;
    }
  }

  // Fallback category detection via keywords
  if (detectedSymptoms.length === 0) {
    const kwMap = {
      cardiac: ['chest', 'heart', 'sweat', 'छाती', 'सीने', 'दिल', 'ଛାତି', 'ହୃଦୟ'],
      respiratory: ['cough', 'breath', 'phlegm', 'wheezing', 'cold', 'sneeze', 'खांसी', 'सांस', 'जुकाम', 'छींक', 'କାଶ', 'କଫ', 'ଛିଙ୍କ', 'ସର୍ଦ୍ଦି'],
      gastro: ['stomach', 'diarrhea', 'vomit', 'motions', 'cramp', 'पेट', 'दस्त', 'उल्टी', 'ପେଟ', 'ବାନ୍ତି', 'ଝାଡ଼ା'],
      neuro: ['headache', 'dizzy', 'vertigo', 'सिरदर्द', 'चक्कर', 'ମୁଣ୍ଡ', 'ବିନ୍ଧା'],
      trauma_emergency: ['accident', 'bleeding', 'fracture', 'burn', 'snake', 'चोट', 'खून', 'एक्सीडेंट', 'ଆଘାତ', 'ରକ୍ତ', 'ଦୁର୍ଘଟଣା'],
      maternal_pediatric: ['pregnant', 'baby', 'child', 'infant', 'गर्भवती', 'बच्चा', 'ଗର୍ଭବତୀ', 'ଶିଶୁ']
    };
    for (const [cat, kws] of Object.entries(kwMap)) {
      if (kws.some((k) => lower.includes(k))) {
        primaryCategory = cat;
        break;
      }
    }
  }

  // 3. Extract Duration, Temperature, and Pain Level
  const durationDays = parseDurationDays(clean) || (context?.vitals?.durationDays ? String(context.vitals.durationDays) : null);
  const extractedTemp = parseSpokenTemperature(clean) || (context?.vitals?.temperature ? String(context.vitals.temperature) : null);
  const painScore = context?.painLevel ? parseInt(context.painLevel, 10) : (parseSpokenPainLevel(clean) || 3);

  const parsedTempNum = extractedTemp ? parseFloat(extractedTemp) : (context?.vitals?.temperature ? parseFloat(context.vitals.temperature) : null);
  const parsedDurationNum = durationDays ? parseInt(durationDays, 10) : 1;
  const spo2Val = context?.vitals?.spo2 ? parseInt(context.vitals.spo2, 10) : null;
  const sbpVal = context?.vitals?.systolic ? parseInt(context.vitals.systolic, 10) : null;

  // 4. Clinical Evidence Counting
  const criticalSymptoms = detectedSymptoms.filter((s) => s.severity === 'critical');
  const severeSymptoms = detectedSymptoms.filter((s) => s.severity === 'severe');
  const moderateSymptoms = detectedSymptoms.filter((s) => s.severity === 'moderate');
  const mildSymptoms = detectedSymptoms.filter((s) => s.severity === 'mild');

  // Specific high-risk clinical presentations
  const hasRadiatingChest = detectedSymptoms.some((s) => s.id === 'chest_pain_radiating');
  const hasChestWithColdSweat = detectedSymptoms.some((s) => s.id === 'chest_pain') && detectedSymptoms.some((s) => s.id === 'cold_sweating');
  const hasSevereDyspnea = detectedSymptoms.some((s) => s.id === 'severe_dyspnea') || (spo2Val && spo2Val < 92);
  const hasHemoptysis = detectedSymptoms.some((s) => s.id === 'hemoptysis');
  const hasStrokeSigns = detectedSymptoms.some((s) => s.id === 'stroke_weakness');
  const hasThunderclap = detectedSymptoms.some((s) => s.id === 'thunderclap_headache');
  const hasUnconscious = detectedSymptoms.some((s) => s.id === 'unconscious_syncope' || s.id === 'seizures_convulsions');
  const hasTraumaEmergency = detectedSymptoms.some((s) => s.category === 'trauma_emergency' && s.severity === 'critical');
  const hasSevereHemorrhage = detectedSymptoms.some((s) => s.id === 'bleeding_rash' || s.id === 'severe_trauma_fracture');
  const hasPreeclampsia = detectedSymptoms.some((s) => s.id === 'preeclampsia_triad');
  const hasPediatricDehydration = detectedSymptoms.some((s) => s.id === 'pediatric_dehydration');
  const hasBPCrisis = sbpVal && (sbpVal >= 175 || (sbpVal > 0 && sbpVal < 90));

  // 5. Dynamic Urgency Tier & Score Stratification
  let urgencyTier = 'GREEN';
  let urgencyScore = 20;
  let urgencyLabel = 'Routine Assessment (PHC OPD / Home Care)';

  // RED TIER (Immediate Emergency, score 85-98)
  if (
    redFlags.length > 0 ||
    criticalSymptoms.length > 0 ||
    hasRadiatingChest ||
    hasChestWithColdSweat ||
    hasSevereDyspnea ||
    hasHemoptysis ||
    hasStrokeSigns ||
    hasThunderclap ||
    hasUnconscious ||
    hasTraumaEmergency ||
    hasSevereHemorrhage ||
    hasPreeclampsia ||
    hasPediatricDehydration ||
    hasBPCrisis
  ) {
    urgencyTier = 'RED';
    const baseRed = 88;
    const additionalRed = Math.min(10, redFlags.length * 3 + criticalSymptoms.length * 2);
    urgencyScore = Math.min(98, baseRed + additionalRed);
    urgencyLabel = 'Emergency Immediate Referral (108 / DHH / CHC)';
  }
  // YELLOW TIER (Priority Consultation < 2 Hours, score 55-84)
  else if (
    severeSymptoms.length > 0 ||
    moderateSymptoms.length >= 2 ||
    (parsedTempNum && parsedTempNum >= 101.0) ||
    (parsedDurationNum >= 3 && (parsedTempNum >= 100.0 || moderateSymptoms.length >= 1)) ||
    (painScore >= 6) ||
    (spo2Val && spo2Val <= 94) ||
    detectedSymptoms.some((s) => s.id === 'high_fever_rigors' || s.id === 'severe_diarrhea_vomiting' || s.id === 'severe_abdominal_pain' || s.id === 'severe_headache' || s.id === 'dyspnea')
  ) {
    urgencyTier = 'YELLOW';
    let yellowCalc = 58;
    yellowCalc += severeSymptoms.length * 7;
    yellowCalc += moderateSymptoms.length * 4;
    if (parsedTempNum && parsedTempNum >= 102.0) yellowCalc += 8;
    else if (parsedTempNum && parsedTempNum >= 101.0) yellowCalc += 4;
    if (painScore >= 8) yellowCalc += 8;
    else if (painScore >= 6) yellowCalc += 4;
    if (parsedDurationNum >= 3) yellowCalc += 5;
    urgencyScore = Math.min(84, Math.max(55, yellowCalc));
    urgencyLabel = 'Priority Clinical Consultation (< 2 Hours)';
  }
  // GREEN TIER (Routine / Mild Illness, score 15-45)
  else {
    urgencyTier = 'GREEN';
    let greenCalc = 18;
    greenCalc += mildSymptoms.length * 4;
    if (painScore >= 4) greenCalc += 6;
    urgencyScore = Math.min(45, Math.max(15, greenCalc));
    urgencyLabel = 'Routine Assessment (PHC OPD / Home Care)';
  }

  // 6. Build Standardized Clinical English Translation
  let clinicalTranslation = '';
  if (currentLanguage === 'en-IN' || currentLanguage === 'en-US') {
    clinicalTranslation = clean;
  } else if (detectedSymptoms.length > 0) {
    const symptomList = [...new Set(detectedSymptoms.map((s) => s.labelEn))].join(', ');
    const tempClause = extractedTemp ? ` (measured temperature: ${extractedTemp}°F)` : '';
    const durationClause = durationDays ? ` lasting for ${durationDays} days` : '';
    const painClause = painScore >= 6 ? ` with severity ${painScore}/10` : '';
    clinicalTranslation = `Patient presents with ${symptomList}${tempClause}${durationClause}${painClause}.`;
  } else {
    let trans = clean;
    for (const p of TRANSLATION_PATTERNS) {
      trans = trans.replace(p.regex, p.rep);
    }
    clinicalTranslation = trans !== clean ? `Reported: ${trans}` : `Reported: "${clean}"`;
  }

  // 7. Build Medical Chief Complaint
  let chiefComplaint = '';
  if (detectedSymptoms.length > 0) {
    const primaryNames = detectedSymptoms.map((s) => s.labelEn).join(', ');
    const durClause = durationDays ? ` x ${durationDays} days` : '';
    chiefComplaint = `${primaryNames}${durClause}`;
  } else {
    chiefComplaint = clinicalTranslation;
  }

  return {
    rawSpeech: clean,
    clinicalTranslation,
    detectedSymptoms,
    redFlags,
    urgencyTier,
    urgencyScore,
    urgencyLabel,
    primaryCategory,
    durationDays,
    extractedTemp,
    painScore,
    chiefComplaint
  };
}

/**
 * Balanced, Realistic Rural Case Scenarios covering RED, YELLOW, and GREEN across Odia, Hindi, and English
 */
export const SAMPLE_VOICE_CASES = [
  // ─── ODIA SCENARIOS ───
  {
    id: 'case_or_cardiac',
    lang: 'or-IN',
    langLabel: 'ଓଡ଼ିଆ (Odia)',
    badge: 'Cardiac Emergency (RED)',
    category: 'cardiac',
    preview: 'ଛାତି କଷ୍ଟ + ବାମ ହାତ ଯନ୍ତ୍ରଣା + ଥଣ୍ଡା ଝାଳ',
    speech: 'ମୋ ଛାତିରେ ବହୁତ କଷ୍ଟ ହେଉଛି, ବାମ ହାତକୁ ଯନ୍ତ୍ରଣା ଯାଉଛି ଏବଂ ପ୍ରଚୁର ଥଣ୍ଡା ଝାଳ ବାହାରୁଛି।'
  },
  {
    id: 'case_or_fever',
    lang: 'or-IN',
    langLabel: 'ଓଡ଼ିଆ (Odia)',
    badge: 'Febrile Rigors (YELLOW)',
    category: 'fever',
    preview: '୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ଓ କମ୍ପ',
    speech: '୩ ଦିନ ହେଲା ପ୍ରବଳ ଜ୍ୱର ସହିତ ଥଣ୍ଡା ଲାଗି କମ୍ପ ହେଉଛି ଏବଂ ମୁଣ୍ଡ ଭୀଷଣ ବିନ୍ଧୁଛି।'
  },
  {
    id: 'case_or_gastro',
    lang: 'or-IN',
    langLabel: 'ଓଡ଼ିଆ (Odia)',
    badge: 'Gastroenteritis (YELLOW)',
    category: 'gastro',
    preview: 'ଝାଡ଼ା ଓ ବାନ୍ତି + ପେଟ କାଟୁଛି',
    speech: 'ଗତକାଲିଠାରୁ ପାଣି ଭଳି ଝାଡ଼ା ଓ ବାନ୍ତି ବାରମ୍ବାର ହେଉଛି ଏବଂ ପେଟ କାଟି ପକାଉଛି।'
  },
  {
    id: 'case_or_mild',
    lang: 'or-IN',
    langLabel: 'ଓଡ଼ିଆ (Odia)',
    badge: 'Mild Cold & Rhinitis (GREEN)',
    category: 'respiratory',
    preview: 'ସାମାନ୍ୟ କାଶ, ଛିଙ୍କ ଓ ନାକରୁ ପାଣି',
    speech: 'ଗତକାଲିଠାରୁ ସାମାନ୍ୟ କାଶ, ଛିଙ୍କ ଏବଂ ନାକରୁ ପାଣି ବୋହୁଛି, ଦେହରେ କୌଣସି ଜ୍ୱର ନାହିଁ।'
  },

  // ─── HINDI SCENARIOS ───
  {
    id: 'case_hi_cardiac',
    lang: 'hi-IN',
    langLabel: 'हिंदी (Hindi)',
    badge: 'Cardiac Emergency (RED)',
    category: 'cardiac',
    preview: 'सीने में भारीपन + बाएं हाथ में दर्द + पसीना',
    speech: 'सीने में बहुत तेज भारीपन और दर्द है, बाएं हाथ में खिंचाव हो रहा है और ठंडा पसीना छूट रहा है।'
  },
  {
    id: 'case_hi_fever',
    lang: 'hi-IN',
    langLabel: 'हिंदी (Hindi)',
    badge: '102°F Malaria / Rigors (YELLOW)',
    category: 'fever',
    preview: '3 दिन से 102 बुखार और कंपकंपी',
    speech: '3 दिन से ठंड लगकर 102 बुखार आ रहा है, बदन और सिर में भयंकर दर्द है।'
  },
  {
    id: 'case_hi_resp',
    lang: 'hi-IN',
    langLabel: 'हिंदी (Hindi)',
    badge: 'Severe Dyspnea (RED)',
    category: 'respiratory',
    preview: 'सांस लेने में भयंकर तकलीफ + दम फूलना',
    speech: 'सांस लेने में बहुत ज्यादा तकलीफ हो रही है, दम फूल रहा है और बोलने पर सांस अटक रही है।'
  },
  {
    id: 'case_hi_mild',
    lang: 'hi-IN',
    langLabel: 'हिंदी (Hindi)',
    badge: 'Mild Cold & Coryza (GREEN)',
    category: 'respiratory',
    preview: 'हल्की खांसी और जुकाम',
    speech: 'कल से हल्की खांसी और छींकें आ रही हैं, नाक बह रही है और कोई तेज बुखार नहीं है।'
  },

  // ─── ENGLISH SCENARIOS ───
  {
    id: 'case_en_cardiac',
    lang: 'en-IN',
    langLabel: 'English (India)',
    badge: 'Acute Angina (RED)',
    category: 'cardiac',
    preview: 'Severe chest pain radiating to left arm',
    speech: 'Severe chest pressure radiating to left arm with profuse cold sweating for the past 45 minutes.'
  },
  {
    id: 'case_en_fever',
    lang: 'en-IN',
    langLabel: 'English (India)',
    badge: 'Fever 103°F with Rigors (YELLOW)',
    category: 'fever',
    preview: 'High fever 103F with shaking chills',
    speech: 'High grade fever 103 degree with shaking chills and rigors for 2 days.'
  },
  {
    id: 'case_en_gastro',
    lang: 'en-IN',
    langLabel: 'English (India)',
    badge: 'Gastroenteritis (YELLOW)',
    category: 'gastro',
    preview: 'Watery loose motions and vomiting',
    speech: 'Watery diarrhea more than 6 times and severe vomiting since yesterday with abdominal cramps.'
  },
  {
    id: 'case_en_mild',
    lang: 'en-IN',
    langLabel: 'English (India)',
    badge: 'Mild Cold & Runny Nose (GREEN)',
    category: 'respiratory',
    preview: 'Mild cold, sneezing and slight throat irritation',
    speech: 'Mild runny nose, sneezing and slight dry throat since yesterday without any fever.'
  }
];

/**
 * Clinical Medicine Recommendations Database & Decision Support
 * Conforms to Indian National Health Mission (NHM) & Standard First-Aid Protocols.
 */
export const CLINICAL_MEDICINE_PROTOCOLS = {
  fever: {
    healthIssue: {
      en: 'Acute Febrile Illness / Suspected Viral Infection or Malaria',
      hi: 'तीव्र ज्वर / संभावित वायरल संक्रमण या मलेरिया',
      or: 'ତୀବ୍ର ଜ୍ୱର / ସମ୍ଭାବ୍ୟ ଭୂତାଣୁ ସଂକ୍ରମଣ କିମ୍ବା ମ୍ୟାଲେରିଆ'
    },
    summary: {
      en: 'Elevated body temperature with systemic fatigue and chills. Primary goal is temperature control and hydration.',
      hi: 'कंपकंपी और थकान के साथ तेज बुखार। प्राथमिकता तापमान नियंत्रण एवं शरीर में जल संतुलन बनाए रखना है।',
      or: 'ଥଣ୍ଡା ଲାଗିବା ଓ ଦୁର୍ବଳତା ସହିତ ପ୍ରବଳ ଜ୍ୱର। ପ୍ରାଥମିକ ଲକ୍ଷ୍ୟ ହେଉଛି ଶରୀରର ତାପମାତ୍ରା କମାଇବା ଓ ଜଳୀୟ ଅଂଶ ବଜାୟ ରଖିବା।'
    },
    medicines: [
      {
        id: 'paracetamol',
        name: 'Paracetamol (Dolo 650mg / Calpol 500mg)',
        generic: 'Paracetamol (Acetaminophen)',
        category: 'Antipyretic / Analgesic',
        dosage: {
          en: '1 tablet (650mg) after food every 6-8 hours if temperature > 100°F (Max 3-4 tablets in 24 hours)',
          hi: '1 गोली (650mg) खाना खाने के बाद हर 6-8 घंटे में यदि बुखार 100°F से अधिक हो (24 घंटे में अधिकतम 3-4 गोलियां)',
          or: '୧ ଟି ବଟିକା (୬୫୦ ମିଗ୍ରା) ଖାଇବା ପରେ ପ୍ରତି ୬-୮ ଘଣ୍ଟାରେ ଥରେ ଯଦି ଜ୍ୱର ୧୦୦°F ରୁ ଅଧିକ ଥାଏ (୨୪ ଘଣ୍ଟାରେ ସର୍ବାଧିକ ୩-୪ ଟି)'
        },
        purpose: {
          en: 'Safely reduces fever and relieves associated bodyache and headache.',
          hi: 'सुरक्षित रूप से बुखार कम करता है एवं बदन दर्द व सिरदर्द से राहत देता है।',
          or: 'ଜ୍ୱର କମାଏ ଏବଂ ଶରୀର ବିନ୍ଧା ଓ ମୁଣ୍ଡବିନ୍ଧାରୁ ଆରାମ ଦିଏ।'
        },
        precautions: {
          en: 'Do not take on empty stomach. Avoid alcohol. If dengue or red rash is suspected, strictly avoid Ibuprofen/Aspirin.',
          hi: 'खाली पेट न लें। शराब से बचें। यदि डेंगू या लाल चकत्ते हों, तो ब्रूफेन/एस्पिरिन बिल्कुल न लें।',
          or: 'ଖାଲି ପେଟରେ ଖାଆନ୍ତୁ ନାହିଁ। ଡେଙ୍ଗୁ କିମ୍ବା ନାଲି ଦାଗ ଥିଲେ ବ୍ରୁଫେନ୍ କିମ୍ବା ଏସପିରିନ୍ ବିଲକୁଲ ଖାଆନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹12 / 10 tablets (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'ors_hydration',
        name: 'WHO-ORS Oral Rehydration Salts',
        generic: 'Electrolytes + Dextrose Oral Powder',
        category: 'Electrolyte Replenisher',
        dosage: {
          en: 'Dissolve 1 sachet in 1 Litre of boiled & cooled drinking water. Sip 1-2 glasses throughout the day.',
          hi: '1 पैकेट 1 लीटर उबले व ठंडे पानी में घोलें। दिनभर में घूंट-घूंट करके पिएं।',
          or: '୧ ପ୍ୟାକେଟ୍ ୧ ଲିଟର ଫୁଟା ଥଣ୍ଡା ପାଣିରେ ମିଶାନ୍ତୁ। ଦିନସାରା ଘଡ଼ିଏ ଘଡ଼ିଏ ପିଅନ୍ତୁ।'
        },
        purpose: {
          en: 'Prevents dehydration, weakness, and maintains vital electrolyte balance.',
          hi: 'कमजोरी एवं निर्जलीकरण से बचाता है और शरीर में लवण का संतुलन रखता है।',
          or: 'ଦୁର୍ବଳତା ଓ ଜଳକ୍ଷୟ ରୋକିବା ସହିତ ଶରୀରରେ ଶକ୍ତି ଯୋଗାଏ।'
        },
        precautions: {
          en: 'Discard prepared solution after 24 hours. Do not mix with milk or juice.',
          hi: 'बनाया हुआ घोल 24 घंटे बाद फेंक दें। दूध या जूस में न मिलाएं।',
          or: 'ପ୍ରସ୍ତୁତ ଓଆରଏସ୍ କୁ ୨୪ ଘଣ୍ଟା ପରେ ବ୍ୟବହାର କରନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹4.50 / sachet (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'zinc_vitc',
        name: 'Zinc + Vitamin C (Limcee / Becozinc)',
        generic: 'Ascorbic Acid 500mg + Zinc 50mg',
        category: 'Immune Support Supplement',
        dosage: {
          en: '1 chewable tablet once daily after breakfast for 7 days.',
          hi: '1 चबाने वाली गोली नाश्ते के बाद रोजाना 7 दिन तक।',
          or: '୧ ଟି ଚୋବାଇବା ବଟିକା ସକାଳ ଜଳଖିଆ ପରେ ଦିନକୁ ଥରେ ୭ ଦିନ ପାଇଁ।'
        },
        purpose: {
          en: 'Strengthens cellular immunity and accelerates recovery from viral illness.',
          hi: 'रोग प्रतिरोधक क्षमता बढ़ाता है और शीघ्र स्वस्थ होने में मदद करता है।',
          or: 'ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବଢ଼ାଏ ଏବଂ ଶୀଘ୍ର ଆରୋଗ୍ୟ ହେବାରେ ସାହାଯ୍ୟ କରେ।'
        },
        precautions: {
          en: 'Chew thoroughly before swallowing with water.',
          hi: 'पानी के साथ निगलने से पहले अच्छी तरह चबाएं।',
          or: 'ପାଣି ପିଇବା ପୂର୍ବରୁ ଭଲ ଭାବରେ ଚୋବାନ୍ତୁ।'
        },
        priceJanAushadhi: '₹15 / 15 tablets',
        inStockPHC: true,
        isOtc: true
      }
    ],
    homeCare: {
      en: ['Apply room-temperature wet cloth compress on forehead.', 'Drink tender coconut water and clear soups.', 'Rest completely and monitor temperature every 4 hours.'],
      hi: ['माथे पर सामान्य पानी की ठंडी पट्टी रखें।', 'नारियल पानी और हल्का सूप पिएं।', 'पूर्ण आराम करें और हर 4 घंटे में बुखार नापें।'],
      or: ['କପାଳରେ ଓଦା କନା ପଟି ପକାନ୍ତୁ।', 'ଡାବ ପାଣି ଓ ତରଳ ଖାଦ୍ୟ ପିଅନ୍ତୁ।', 'ସମ୍ପୂର୍ଣ୍ଣ ବିଶ୍ରାମ ନିଅନ୍ତୁ ଏବଂ ପ୍ରତି ୪ ଘଣ୍ଟାରେ ତାପମାତ୍ରା ମାପନ୍ତୁ।']
    }
  },

  cardiac: {
    healthIssue: {
      en: 'Suspected Acute Coronary Syndrome / Angina (CRITICAL EMERGENCY)',
      hi: 'संभावित तीव्र कोरोनरी सिंड्रोम / एनजाइना (अति गंभीर आपातकाल)',
      or: 'ସନ୍ଦିଗ୍ଧ ହୃଦରୋଗ ସଙ୍କଟ / ଆକ୍ୟୁଟ୍ କରୋନାରୀ ସିଣ୍ଡ୍ରୋମ୍ (ଅତ୍ୟନ୍ତ ଜରୁରୀ)'
    },
    summary: {
      en: 'Chest pressure with potential left arm radiation or diaphoresis. Requires immediate emergency medical care and 108 ambulance transfer.',
      hi: 'सीने में दबाव जो बाएं हाथ में फैल रहा है या ठंडा पसीना। तुरंत 108 एम्बुलेंस और अस्पताल की आवश्यकता है।',
      or: 'ଛାତିରେ ଭାରୀପଣ ଯାହା ବାମ ହାତକୁ ଯାଉଛି ଏବଂ ଥଣ୍ଡା ଝାଳ। ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଓ ଡାକ୍ତରଖାନା ଯିବା ଆବଶ୍ୟକ।'
    },
    medicines: [
      {
        id: 'aspirin_stat',
        name: 'Dispersible Aspirin (Ecosprin 300mg / 325mg)',
        generic: 'Acetylsalicylic Acid 300mg',
        category: 'Antiplatelet (Emergency First-Aid)',
        dosage: {
          en: '1 tablet (300mg) CHEWED IMMEDIATELY (STAT dose) before hospital transit.',
          hi: '1 गोली (300mg) तुरंत चबाकर खाएं (आपातकालीन खुराक) अस्पताल जाने से पहले।',
          or: '୧ ଟି ବଟିକା (୩୦୦ ମିଗ୍ରା) ତୁରନ୍ତ ଚୋବାଇ ଖାଆନ୍ତୁ (ଜରୁରୀକାଳୀନ ଡୋଜ୍) ଡାକ୍ତରଖାନା ଯିବା ପୂର୍ବରୁ।'
        },
        purpose: {
          en: 'Emergency antiplatelet that stops heart artery blood clots from expanding.',
          hi: 'हृदय की धमनियों में खून का थक्का जमने से रोकता है।',
          or: 'ହୃତପିଣ୍ଡ ରକ୍ତନଳୀରେ ରକ୍ତ ଜମାଟ ବାନ୍ଧିବାକୁ ରୋକେ।'
        },
        precautions: {
          en: 'EMERGENCY USE ONLY. Do not give if active bleeding or known aspirin allergy.',
          hi: 'केवल आपातकालीन उपयोग। यदि खून बह रहा हो या एलर्जी हो तो न दें।',
          or: 'କେବଳ ଜରୁରୀକାଳୀନ ବ୍ୟବହାର। ରକ୍ତସ୍ରାବ ଥିଲେ ଦିଅନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹5 / 10 tablets',
        inStockPHC: true,
        isOtc: false,
        isEmergency: true
      },
      {
        id: 'sorbitrate',
        name: 'Sorbitrate 5mg (Sublingual)',
        generic: 'Isosorbide Dinitrate 5mg',
        category: 'Vasodilator / Anti-anginal',
        dosage: {
          en: 'Place 1 tablet UNDER THE TONGUE, do not swallow (only if Systolic BP > 100 mmHg).',
          hi: '1 गोली जीभ के नीचे रखें, निगलें नहीं (केवल यदि BP 100 से ऊपर हो)।',
          or: '୧ ଟି ବଟିକା ଜିଭ ତଳେ ରଖନ୍ତୁ, ଗିଳନ୍ତୁ ନାହିଁ (କେବଳ BP ୧୦୦ ରୁ ଅଧିକ ଥିଲେ)।'
        },
        purpose: {
          en: 'Quickly dilates coronary blood vessels to relieve cardiac chest tightness.',
          hi: 'सीने के दर्द और भारीपन को कम करने के लिए धमनियों को तुरंत फैलाता है।',
          or: 'ଛାତି ଯନ୍ତ୍ରଣା ଶୀଘ୍ର କମାଇବା ପାଇଁ ହୃଦୟ ରକ୍ତନଳୀକୁ ପ୍ରସାରିତ କରେ।'
        },
        precautions: {
          en: 'May cause sudden drop in BP or dizziness. Patient must lie down or sit.',
          hi: 'चक्कर आ सकते हैं। मरीज को लेटाकर या बैठाकर ही दें।',
          or: 'ମୁଣ୍ଡ ବୁଲାଇପାରେ। ରୋଗୀଙ୍କୁ ଶୁଆଇ ରଖି ଦିଅନ୍ତୁ।'
        },
        priceJanAushadhi: '₹8 / 10 tablets',
        inStockPHC: true,
        isOtc: false,
        isEmergency: true
      }
    ],
    homeCare: {
      en: ['CALL 108 AMBULANCE IMMEDIATELY.', 'Keep patient completely still in half-seated posture.', 'Loosen tight collar, belt, or clothes. Do NOT allow patient to walk.'],
      hi: ['तुरंत 108 एम्बुलेंस को कॉल करें।', 'मरीज को आधा बैठाकर शांत रखें।', 'तंग कपड़े ढीले करें। मरीज को बिल्कुल चलने न दें।'],
      or: ['ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ।', 'ରୋଗୀଙ୍କୁ ଅଧା-ବସା ଅବସ୍ଥାରେ ଶାନ୍ତ ରଖନ୍ତୁ।', 'ଚାଲିବାକୁ ବିଲକୁଲ ଦିଅନ୍ତୁ ନାହିଁ।']
    }
  },

  respiratory: {
    healthIssue: {
      en: 'Acute Bronchitis / Respiratory Infection / Cough with Phlegm',
      hi: 'तीव्र ब्रोंकाइटिस / श्वसन संक्रमण / बलगम वाली खांसी',
      or: 'ତୀବ୍ର ଶ୍ୱାସନଳୀ ସଂକ୍ରମଣ / କଫ ସହ କାଶ'
    },
    summary: {
      en: 'Airway congestion, productive cough or bronchospasm. Priority is clearing airway mucus and reducing bronchospasm.',
      hi: 'सांस की नली में रुकावट, बलगम या सांस फूलना। बलगम साफ करना और सांस आसान करना मुख्य लक्ष्य है।',
      or: 'ଶ୍ୱାସନଳୀରେ କଫ ଜମିବା ଓ କାଶ। ଶ୍ୱାସକ୍ରିୟା ସହଜ କରିବା ଓ କଫ ବାହାର କରିବା ପ୍ରାଥମିକତା।'
    },
    medicines: [
      {
        id: 'mucolytic_syrup',
        name: 'Ambroxol + Terbutaline Syrup (Ascoril / Mucolite)',
        generic: 'Ambroxol 30mg + Terbutaline 1.25mg + Guaiphenesin 50mg / 5ml',
        category: 'Bronchodilator & Mucolytic Expectorant',
        dosage: {
          en: '10 ml (2 teaspoons) three times daily after food with warm water for 5 days.',
          hi: '10 मिली (2 चम्मच) दिन में 3 बार खाना खाने के बाद गुनगुने पानी के साथ 5 दिन।',
          or: '୧୦ ମିଲି (୨ ଚାମଚ) ଦିନକୁ ୩ ଥର ଖାଇବା ପରେ ଉଷୁମ ପାଣି ସହ ୫ ଦିନ।'
        },
        purpose: {
          en: 'Thins thick bronchial mucus, makes phlegm easy to cough out, and dilates airways.',
          hi: 'गाढ़े बलगम को पतला करके बाहर निकालता है और सांस की नली खोलता है।',
          or: 'କଫକୁ ତରଳ କରି ବାହାର କରେ ଏବଂ ଶ୍ୱାସନଳୀ ଖୋଲିବାରେ ସାହାଯ୍ୟ କରେ।'
        },
        precautions: {
          en: 'May cause mild tremors or rapid heart rate. Drink warm water after dose.',
          hi: 'हाथों में हल्की कंपकंपी हो सकती है। दवा के बाद गर्म पानी पिएं।',
          or: 'ହାତରେ ସାମାନ୍ୟ କମ୍ପନ ହୋଇପାରେ। ଔଷଧ ପରେ ଉଷୁମ ପାଣି ପିଅନ୍ତୁ।'
        },
        priceJanAushadhi: '₹28 / 100ml bottle (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'cetirizine',
        name: 'Cetirizine 10mg (Cetzine / Alerid)',
        generic: 'Cetirizine Hydrochloride 10mg',
        category: 'Antihistamine (Anti-allergic)',
        dosage: {
          en: '1 tablet (10mg) once daily at BEDTIME with water for 5 days.',
          hi: '1 गोली (10mg) रात को सोने से पहले पानी के साथ 5 दिन।',
          or: '୧ ଟି ବଟିକା (୧୦ ମିଗ୍ରା) ରାତିରେ ଶୋଇବା ପୂର୍ବରୁ ପାଣି ସହ ୫ ଦିନ।'
        },
        purpose: {
          en: 'Relieves allergic sneezing, runny nose, throat tickle, and watery eyes.',
          hi: 'छींक, बहती नाक, गले की खराश और एलर्जी से राहत देता है।',
          or: 'ଛିଙ୍କ, ନାକରୁ ପାଣି ବୋହିବା ଓ ଗଳା ଖସଖସରୁ ଉପଶମ ଦିଏ।'
        },
        precautions: {
          en: 'Causes mild drowsiness. Do not drive or operate machinery after taking.',
          hi: 'हल्की नींद आ सकती है। गाड़ी न चलाएं।',
          or: 'ସାମାନ୍ୟ ନିଦ ଲାଗିପାରେ। ଗାଡ଼ି ଚଳାନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹6 / 10 tablets (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'salbutamol_inhaler',
        name: 'Salbutamol Inhaler (Asthalin 100mcg)',
        generic: 'Salbutamol / Albuterol 100mcg per puff',
        category: 'Fast-Acting Bronchodilator (SOS)',
        dosage: {
          en: '2 puffs via spacer / mouth for acute shortness of breath or wheezing as needed.',
          hi: '2 पफ सांस फूलने या सीटी जैसी आवाज आने पर जरूरत पड़ने पर।',
          or: 'ଶ୍ୱାସ କଷ୍ଟ ବା ଶଁ ଶଁ ଶବ୍ଦ ହେଲେ ୨ ପଫ୍ ମୁହଁରେ ଟାଣନ୍ତୁ।'
        },
        purpose: {
          en: 'Relieves acute chest tightness and opens constricted bronchial tubes within 5 minutes.',
          hi: '5 मिनट में सांस की नली खोलकर राहत देता है।',
          or: '୫ ମିନିଟ୍ ମଧ୍ୟରେ ଶ୍ୱାସନଳୀ ଖୋଲି ଆରାମ ଦିଏ।'
        },
        precautions: {
          en: 'Rinse mouth with water after use. If SpO2 < 92%, seek urgent oxygen support.',
          hi: 'इस्तेमाल के बाद कुल्ला करें। SpO2 92 से कम हो तो तुरंत अस्पताल जाएं।',
          or: 'ବ୍ୟବହାର ପରେ କୁଳି କରନ୍ତୁ। SpO2 ୯୨ ରୁ କମ ଥିଲେ ତୁରନ୍ତ ଅକ୍ସିଜେନ୍ ନିଅନ୍ତୁ।'
        },
        priceJanAushadhi: '₹85 / 200 doses inhaler',
        inStockPHC: true,
        isOtc: false
      }
    ],
    homeCare: {
      en: ['Steam inhalation twice daily with plain water.', 'Warm saline gargle morning and night.', 'Sleep with upper body propped up on 2 pillows.'],
      hi: ['दिन में 2 बार सादे पानी की भाप लें।', 'सुबह-शाम गुनगुने नमक के पानी से गरारे करें।', 'सोते समय सिर ऊंचा रखें।'],
      or: ['ଦିନକୁ ୨ ଥର ଗରମ ପାଣିର ଭାପ ନିଅନ୍ତୁ।', 'ଉଷୁମ ଲୁଣ ପାଣିରେ କୁଳି କରନ୍ତୁ।', 'ମୁଣ୍ଡ ତଳେ ୨ଟି ତକିଆ ଦେଇ ଶୁଅନ୍ତୁ।']
    }
  },

  gastro: {
    healthIssue: {
      en: 'Acute Gastroenteritis / Dehydration / Abdominal Colic',
      hi: 'तीव्र आंत्रशोथ / दस्त एवं उल्टी / पेट दर्द',
      or: 'ତୀବ୍ର ଝାଡ଼ା ଓ ବାନ୍ତି (ଗ୍ୟାଷ୍ଟ୍ରୋଏଣ୍ଟେରାଇଟିସ୍) / ପେଟ ଯନ୍ତ୍ରଣା'
    },
    summary: {
      en: 'Fluid loss through loose stools and emesis with high risk of dehydration. Immediate rehydration is the life-saving priority.',
      hi: 'दस्त और उल्टी से शरीर में पानी की गंभीर कमी। तुरंत ओआरएस से निर्जलीकरण रोकना आवश्यक है।',
      or: 'ଝାଡ଼ା ଓ ବାନ୍ତି ଯୋଗୁଁ ପ୍ରବଳ ଜଳକ୍ଷୟ। ଓଆରଏସ୍ ଦ୍ୱାରା ଶରୀରରେ ଜଳ ସ୍ତର ବଜାୟ ରଖିବା ପ୍ରାଥମିକତା।'
    },
    medicines: [
      {
        id: 'ors_gastro',
        name: 'WHO-ORS Oral Rehydration Solution',
        generic: 'Sodium, Potassium, Citrate, Dextrose Oral Electrolytes',
        category: 'First-Line Rehydration Fluid',
        dosage: {
          en: 'Drink 1 full glass (200 ml) immediately after EVERY loose watery motion or vomiting episode.',
          hi: 'हर बार दस्त या उल्टी होने के बाद 1 पूरा गिलास (200 ml) तुरंत पिएं।',
          or: 'ପ୍ରତ୍ୟେକ ଥର ଝାଡ଼ା କିମ୍ବା ବାନ୍ତି ହେବା ପରେ ୧ ଗ୍ଲାସ୍ (୨୦୦ ମିଲି) ତୁରନ୍ତ ପିଅନ୍ତୁ।'
        },
        purpose: {
          en: 'Replaces lost bodily electrolytes and prevents hypovolemic shock.',
          hi: 'शरीर के जरूरी लवणों की पूर्ति करता है और बेहोशी से बचाता है।',
          or: 'ଶରୀରର ଜଳୀୟ ଅଂଶ ପୂରଣ କରେ ଏବଂ ଗୁରୁତର ଅସୁସ୍ଥତାରୁ ରକ୍ଷା କରେ।'
        },
        precautions: {
          en: 'Sip slowly, do not gulp rapidly to avoid triggering nausea.',
          hi: 'धीरे-धीरे घूंट-घूंट करके पिएं, एक साथ न गटकें।',
          or: 'ଧୀରେ ଧୀରେ ଚାମଚରେ ବା ଢୋକରେ ପିଅନ୍ତୁ, ଏକାଥରେ ପିଅନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹4.50 / sachet (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'zinc_sulphate',
        name: 'Zinc Sulphate 20mg (Zinconia / Zinc 20)',
        generic: 'Elemental Zinc 20mg',
        category: 'Intestinal Mucosal Healing Agent',
        dosage: {
          en: '1 tablet once daily after food for 14 continuous days (do not stop when diarrhea stops).',
          hi: '1 गोली दिन में 1 बार 14 दिन तक लगातार (दस्त रुकने के बाद भी पूरा कोर्स करें)।',
          or: '୧ ଟି ବଟିକା ଦିନକୁ ଥରେ ୧୪ ଦିନ ଧରି ଲଗାତାର (ଝାଡ଼ା ବନ୍ଦ ହେଲେ ମଧ୍ୟ କୋର୍ସ ପୂରା କରନ୍ତୁ)।'
        },
        purpose: {
          en: 'Repairs gut mucosal lining and reduces duration and future recurrence of diarrhea.',
          hi: 'आंतों को ठीक करता है और दस्त की अवधि कम करता है।',
          or: 'ଅନ୍ତନଳୀ ଘା’ ଶୁଖାଏ ଏବଂ ଝାଡ଼ା ବାରମ୍ବାର ହେବାରୁ ରୋକେ।'
        },
        precautions: {
          en: 'Take after food to avoid stomach upset.',
          hi: 'खाना खाने के बाद ही लें।',
          or: 'ଖାଇବା ପରେ ଖାଆନ୍ତୁ।'
        },
        priceJanAushadhi: '₹14 / 14 tablets (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'ondansetron',
        name: 'Ondansetron 4mg (Vomikind / Emeset)',
        generic: 'Ondansetron 4mg',
        category: 'Antiemetic (Anti-vomiting)',
        dosage: {
          en: '1 tablet dissolved on tongue 30 minutes before taking food or ORS fluids (Max twice daily).',
          hi: '1 गोली जीभ पर रखें, खाना या ओआरएस पीने से आधा घंटा पहले (दिन में अधिकतम 2 बार)।',
          or: '୧ ଟି ବଟିକା ଜିଭରେ ରଖନ୍ତୁ, ଖାଇବା କିମ୍ବା ଓଆରଏସ୍ ପିଇବା ପୂର୍ବରୁ (ଦିନକୁ ସର୍ବାଧିକ ୨ ଥର)।'
        },
        purpose: {
          en: 'Controls nausea and stops vomiting so the patient can retain life-saving oral fluids.',
          hi: 'उल्टी रोकता है ताकि मरीज पानी और ओआरएस पचा सके।',
          or: 'ବାନ୍ତି ବନ୍ଦ କରେ ଯାହାଫଳରେ ରୋଗୀ ଓଆରଏସ୍ ପାଣି ପିଇପାରିବେ।'
        },
        precautions: {
          en: 'Use only when active vomiting prevents drinking fluids.',
          hi: 'केवल तभी लें जब उल्टी के कारण पानी भी न पच रहा हो।',
          or: 'କେବଳ ବାନ୍ତି ହେଉଥିବା ସମୟରେ ହିଁ ବ୍ୟବହାର କରନ୍ତୁ।'
        },
        priceJanAushadhi: '₹8 / 10 tablets',
        inStockPHC: true,
        isOtc: true
      }
    ],
    homeCare: {
      en: ['Eat light soft foods: Boiled rice congee (Pey), mashed banana, and curd.', 'Strictly avoid milk, spicy fried food, and raw salads.', 'If no urination in 8 hours or sunken eyes appear, visit PHC immediately.'],
      hi: ['हल्का खाना खाएं: चावल की मांड, पका केला, दही।', 'दूध, तला-भुना और मसालेदार खाना बिल्कुल न खाएं।', 'यदि 8 घंटे तक पेशाब न आए तो तुरंत अस्पताल जाएं।'],
      or: ['ହାଲୁକା ଖାଦ୍ୟ ଖାଆନ୍ତୁ: ଜାଉ ଭାତ, କଦଳୀ, ଦହି।', 'କ୍ଷୀର ଓ ତେଲ ମସଲା ଯୁକ୍ତ ଖାଦ୍ୟ ଖାଆନ୍ତୁ ନାହିଁ।', '୮ ଘଣ୍ଟା ପର୍ଯ୍ୟନ୍ତ ପରିସ୍ରା ନହେଲେ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।']
    }
  },

  neuro: {
    healthIssue: {
      en: 'Tension / Migraine Cephalea / Gastric Headache or Vertigo',
      hi: 'सिरदर्द / माइग्रेन / गैस का सिरदर्द या चक्कर',
      or: 'ତୀବ୍ର ମୁଣ୍ଡବିନ୍ଧା / ମାଇଗ୍ରେନ୍ / ଗ୍ୟାସ୍ ଜନିତ ମୁଣ୍ଡବିନ୍ଧା କିମ୍ବା ଚକ୍କର'
    },
    summary: {
      en: 'Severe craniofacial discomfort or throbbing headache. Exclude sudden thunderclap onset or neurological stroke deficits.',
      hi: 'सिर में तेज दर्द, भारीपन या चक्कर। यदि अचानक भयानक सिरदर्द हो तो आपातकालीन जांच आवश्यक है।',
      or: 'ମୁଣ୍ଡରେ ପ୍ରଚଣ୍ଡ ଯନ୍ତ୍ରଣା କିମ୍ବା ବିନ୍ଧା। ହଠାତ୍ ଅସହ୍ୟ ମୁଣ୍ଡବିନ୍ଧା ହେଲେ ତୁରନ୍ତ ପରୀକ୍ଷା ଆବଶ୍ୟକ।'
    },
    medicines: [
      {
        id: 'paracetamol_neuro',
        name: 'Paracetamol 650mg (Dolo 650 / Crocin)',
        generic: 'Paracetamol 650mg',
        category: 'Analgesic',
        dosage: {
          en: '1 tablet with a full glass of water after food. Repeat after 6 hours if headache persists.',
          hi: '1 गोली खाना खाने के बाद एक गिलास पानी के साथ। जरूरत पड़ने पर 6 घंटे बाद दोहराएं।',
          or: '୧ ଟି ବଟିକା ଖାଇବା ପରେ ପୂରା ଗ୍ଲାସ୍ ପାଣି ସହ ଖାଆନ୍ତୁ। ଆବଶ୍ୟକ ହେଲେ ୬ ଘଣ୍ଟା ପରେ ଖାଆନ୍ତୁ।'
        },
        purpose: {
          en: 'First-line relief for acute tension headache, vascular throbbing, and eye strain.',
          hi: 'सिरदर्द, भारीपन और तनाव से तुरंत राहत देता है।',
          or: 'ମୁଣ୍ଡବିନ୍ଧା ଓ ମୁଣ୍ଡ ଭାରୀପଣରୁ ଶୀଘ୍ର ଆରାମ ଦିଏ।'
        },
        precautions: {
          en: 'Do not take more than 3 tablets in 24 hours.',
          hi: '24 घंटे में 3 से अधिक गोलियां न लें।',
          or: '୨୪ ଘଣ୍ଟାରେ ୩ ରୁ ଅଧିକ ବଟିକା ଖାଆନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹12 / 10 tablets',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'pantoprazole',
        name: 'Pantoprazole 40mg (Pan 40 / Pantocid)',
        generic: 'Pantoprazole Sodium 40mg',
        category: 'Proton Pump Inhibitor (Antacid)',
        dosage: {
          en: '1 tablet once daily, 30 minutes BEFORE morning breakfast with water for 5 days.',
          hi: '1 गोली सुबह नाश्ते से आधा घंटा पहले खाली पेट पानी के साथ 5 दिन।',
          or: '୧ ଟି ବଟିକା ସକାଳ ଜଳଖିଆର ଅଧା ଘଣ୍ଟା ପୂର୍ବରୁ ଖାଲି ପେଟରେ ୫ ଦିନ।'
        },
        purpose: {
          en: 'Treats acid reflux and hyperacidity that frequently triggers gastric headaches and nausea.',
          hi: 'पेट में एसिड बनना कम करता है जिससे गैस वाला सिरदर्द ठीक होता है।',
          or: 'ପେଟର ଏସିଡିଟି କମାଏ ଯାହା ଗ୍ୟାସ୍ ଜନିତ ମୁଣ୍ଡବିନ୍ଧାର ମୁଖ୍ୟ କାରଣ।'
        },
        precautions: {
          en: 'Swallow whole, do not crush or chew.',
          hi: 'गोली को चबाएं नहीं, साबुत निगलें।',
          or: 'ଚୋବାନ୍ତୁ ନାହିଁ, ସିଧାସଳଖ ପାଣି ସହ ଗିଳନ୍ତୁ।'
        },
        priceJanAushadhi: '₹16 / 10 tablets',
        inStockPHC: true,
        isOtc: true
      }
    ],
    homeCare: {
      en: ['Rest in a cool, dark, quiet room away from bright phone or TV screens.', 'Drink at least 2 glasses of water to correct dehydration.', 'Apply gentle temple massage or cold forehead compress.'],
      hi: ['अंधेरे और शांत कमरे में आराम करें। फोन या टीवी की स्क्रीन से दूर रहें।', 'कम से कम 2 गिलास पानी पिएं।', 'माथे पर ठंडी पट्टी रखें।'],
      or: ['ଅନ୍ଧାର ଓ ଶାନ୍ତ କୋଠରୀରେ ବିଶ୍ରାମ ନିଅନ୍ତୁ। ମୋବାଇଲ୍ ବା ଟିଭି ଦେଖନ୍ତୁ ନାହିଁ।', '୨ ଗ୍ଲାସ୍ ପାଣି ପିଅନ୍ତୁ।', 'କପାଳରେ ଥଣ୍ଡା ପଟି ଦିଅନ୍ତୁ।']
    }
  },

  maternal_pediatric: {
    healthIssue: {
      en: 'Maternal or Pediatric Clinical Attention Required',
      hi: 'मातृ अथवा बाल स्वास्थ्य परीक्षण आवश्यक',
      or: 'ମାତୃ କିମ୍ବା ଶିଶୁ ସ୍ୱାସ୍ଥ୍ୟ ସତର୍କତା ଆବଶ୍ୟକ'
    },
    summary: {
      en: 'Specialized vulnerable population protocol for pregnant mothers or young children. Prioritize ANM/Doctor review.',
      hi: 'गर्भवती महिलाओं या छोटे बच्चों के लिए विशेष सुरक्षा प्रोटोकॉल। तुरंत एएनएम/डॉक्टर से संपर्क करें।',
      or: 'ଗର୍ଭବତୀ ମହିଳା କିମ୍ବା ଛୋଟ ପିଲାଙ୍କ ପାଇଁ ସ୍ୱତନ୍ତ୍ର ସୁରକ୍ଷା। ତୁରନ୍ତ ଡାକ୍ତର ବା ଏଏନ୍ଏମ୍ ଙ୍କୁ ଦେଖାନ୍ତୁ।'
    },
    medicines: [
      {
        id: 'paracetamol_pedia',
        name: 'Paracetamol Drops / Syrup (Calpol 120mg/5ml or 250mg/5ml)',
        generic: 'Paracetamol Pediatric Oral Suspension',
        category: 'Pediatric Antipyretic',
        dosage: {
          en: 'Dose strictly by child weight (15 mg/kg per dose) every 6 hours if fever > 100°F.',
          hi: 'बच्चे के वजन के अनुसार (15 mg प्रति किलो) हर 6 घंटे में यदि बुखार 100°F से अधिक हो।',
          or: 'ପିଲାଙ୍କ ଓଜନ ଅନୁସାରେ (ପ୍ରତି କିଲୋ ୧୫ ମିଗ୍ରା) ପ୍ରତି ୬ ଘଣ୍ଟାରେ ଥରେ ଯଦି ଜ୍ୱର ଥାଏ।'
        },
        purpose: {
          en: 'Safely controls fever and prevents febrile seizures in infants and children.',
          hi: 'बच्चों में बुखार नियंत्रित करता है और झटके आने से रोकता है।',
          or: 'ଶିଶୁଙ୍କ ଜ୍ୱର କମାଏ ଏବଂ ବାତ ଆସିବାରୁ ରକ୍ଷା କରେ।'
        },
        precautions: {
          en: 'Always use marked dropper or syringe for exact measurement. Never give adult tablets.',
          hi: 'दवा नापने वाले ड्रॉपर का ही इस्तेमाल करें। बड़ों की गोली कभी न दें।',
          or: 'ସର୍ବଦା ମାପ କପ୍ ବା ଡ୍ରପର୍ ବ୍ୟବହାର କରନ୍ତୁ। ବଡ଼ ମଣିଷ ବଟିକା ବିଲକୁଲ ଦିଅନ୍ତୁ ନାହିଁ।'
        },
        priceJanAushadhi: '₹18 / 60ml bottle (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      },
      {
        id: 'zinc_pedia',
        name: 'Zinc Pediatric Syrup (20mg/5ml)',
        generic: 'Zinc Sulphate Suspension',
        category: 'Pediatric Gut Mucosal Restorer',
        dosage: {
          en: 'Infants < 6 months: 2.5 ml (10mg) daily; Children > 6 months: 5 ml (20mg) daily for 14 days.',
          hi: '6 माह से छोटे शिशु: 2.5 मिली; 6 माह से बड़े बच्चे: 5 मिली रोजाना 14 दिन तक।',
          or: '୬ ମାସରୁ କମ୍ ଶିଶୁ: ୨.୫ ମିଲି; ୬ ମାସରୁ ବଡ଼ ଶିଶୁ: ୫ ମିଲି ପ୍ରତିଦିନ ୧୪ ଦିନ ଯାଏଁ।'
        },
        purpose: {
          en: 'Crucial for recovery from diarrhea and preventing dehydration.',
          hi: 'दस्त से शीघ्र स्वस्थ होने और आंतों की मजबूती के लिए अति आवश्यक।',
          or: 'ଝାଡ଼ାରୁ ଶୀଘ୍ର ସୁସ୍ଥ ହେବା ଓ ଶିଶୁର ରୋଗ ପ୍ରତିରୋଧକ ଶକ୍ତି ବୃଦ୍ଧି ପାଇଁ ଅତ୍ୟନ୍ତ ଜରୁରୀ।'
        },
        precautions: {
          en: 'Give after feeding or with food.',
          hi: 'दूध पिलाने या भोजन के बाद दें।',
          or: 'ଖାଇବା ପରେ ବା ସ୍ତନ୍ୟପାନ ପରେ ଦିଅନ୍ତୁ।'
        },
        priceJanAushadhi: '₹22 / 60ml bottle (Free at PHC)',
        inStockPHC: true,
        isOtc: true
      }
    ],
    homeCare: {
      en: ['Continue active breastfeeding / feeding.', 'Offer ORS frequently in small sips.', 'Immediately consult PHC or ANM/ASHA worker.'],
      hi: ['मां का दूध लगातार पिलाते रहें।', 'ओआरएस थोड़ा-थोड़ा करके बार-बार दें।', 'तुरंत निकटतम आशा या प्राथमिक स्वास्थ्य केंद्र से संपर्क करें।'],
      or: ['ମାଆ କ୍ଷୀର ଲଗାତାର ଦିଅନ୍ତୁ।', 'ଓଆରଏସ୍ ଚାମଚ ଚାମଚ କରି ବାରମ୍ବାର ଦିଅନ୍ତୁ।', 'ତୁରନ୍ତ ଆଶା କର୍ମୀ ବା ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।']
    }
  },

  trauma_emergency: {
    healthIssue: {
      en: 'Acute Trauma / Fracture / Heavy Hemorrhage (CRITICAL EMERGENCY)',
      hi: 'गंभीर आघात / फ्रैक्चर / अत्यधिक रक्तस्राव (अति गंभीर आपातकाल)',
      or: 'ଗୁରୁତର ଆଘାତ / ହାଡ଼ ଭାଙ୍ଗିବା / ପ୍ରଚୁର ରକ୍ତସ୍ରାବ (ଅତ୍ୟନ୍ତ ଜରୁରୀ)'
    },
    summary: {
      en: 'Severe injury with active bleeding, suspected fracture, or collapse. Direct 108 ambulance transfer and emergency surgical care required.',
      hi: 'गंभीर चोट, भारी खून बहना या हड्डी टूटना। तुरंत 108 एम्बुलेंस और अस्पताल में भर्ती की आवश्यकता है।',
      or: 'ପ୍ରଚୁର ରକ୍ତସ୍ରାବ, ହାଡ଼ ଭାଙ୍ଗିବା କିମ୍ବା ଆଘାତ। ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକି ଡାକ୍ତରଖାନା ଯିବା ଆବଶ୍ୟକ।'
    },
    medicines: [
      {
        id: 'pressure_bandage',
        name: 'Sterile Compression Dressing & Tourniquet Bandage',
        generic: 'Sterile Hemostatic Cotton Gauge Dressing',
        category: 'First-Aid Hemostatic Care',
        dosage: {
          en: 'Apply firm direct pressure with clean sterile cloth/gauze directly over bleeding site continuously.',
          hi: 'खून बहने वाली जगह पर साफ कपड़े या पट्टी से लगातार सीधा दबाव बनाकर रखें।',
          or: 'ରକ୍ତ ବାହାରୁଥିବା ସ୍ଥାନରେ ସଫା କପଡ଼ା ବା ଗଜ୍ ବ୍ୟାଣ୍ଡେଜ୍ ଦ୍ୱାରା ଲଗାତାର ଚାପ ଦେଇ ବାନ୍ଧନ୍ତୁ।'
        },
        purpose: {
          en: 'Stops rapid arterial/venous blood loss and prevents hypovolemic shock.',
          hi: 'खून का बहना रोककर बेहोशी और जानलेवा स्थिति से बचाता है।',
          or: 'ରକ୍ତସ୍ରାବ ବନ୍ଦ କରି ରୋଗୀଙ୍କ ଜୀବନ ରକ୍ଷା କରେ।'
        },
        precautions: {
          en: 'Do not remove pressure bandage once applied. Call 108 immediately.',
          hi: 'पट्टी बांधने के बाद बार-बार न खोलें। 108 तुरंत बुलाएं।',
          or: 'ଥରେ ବାନ୍ଧିବା ପରେ ବାରମ୍ବାର ଖୋଲନ୍ତୁ ନାହିଁ। ତୁରନ୍ତ ୧୦୮ ଡାକନ୍ତୁ।'
        },
        priceJanAushadhi: 'Free at PHC / Subcenter',
        inStockPHC: true,
        isOtc: true,
        isEmergency: true
      },
      {
        id: 'tt_injection',
        name: 'Tetanus Toxoid Vaccine (TT 0.5ml IM)',
        generic: 'Adsorbed Tetanus Vaccine 0.5ml',
        category: 'Prophylactic Antitoxin',
        dosage: {
          en: '0.5 ml Intramuscular (IM) in deltoid arm muscle at PHC within 24 hours of injury.',
          hi: '0.5 मिली कंधे की मांसपेशी में 24 घंटे के अंदर अस्पताल/पीएचसी में।',
          or: '୦.୫ ମିଲି ବାହୁରେ ୨୪ ଘଣ୍ଟା ମଧ୍ୟରେ PHC ଡାକ୍ତରଖାନାରେ ଦିଅନ୍ତୁ।'
        },
        purpose: {
          en: 'Prevents life-threatening Clostridium tetani wound infection and lockjaw.',
          hi: 'घाव में टेटनस संक्रमण और धनुर्वात होने से बचाता है।',
          or: 'କ୍ଷତରେ ଧନୁଷ୍ଟଙ୍କାର ସଂକ୍ରମଣ ହେବାରୁ ରକ୍ଷା କରେ।'
        },
        precautions: {
          en: 'Must be administered by qualified nurse/pharmacist/doctor with sterile syringe.',
          hi: 'योग्य स्वास्थ्य कर्मी द्वारा ही लगवाया जाए।',
          or: 'କେବଳ ପ୍ରଶିକ୍ଷିତ ସ୍ୱାସ୍ଥ୍ୟକର୍ମୀ ବା ଡାକ୍ତରଙ୍କ ଦ୍ୱାରା ଦିଅନ୍ତୁ।'
        },
        priceJanAushadhi: '₹10 (Free at all Odisha PHCs)',
        inStockPHC: true,
        isOtc: false,
        isEmergency: true
      }
    ],
    homeCare: {
      en: ['CALL 108 AMBULANCE IMMEDIATELY.', 'Do NOT move or bend suspected broken limb or bone; keep immobilized.', 'Keep patient warm and elevated to maintain blood pressure.'],
      hi: ['तुरंत 108 एम्बुलेंस को बुलाएं।', 'टूटी हुई हड्डी को हिलाएं-डुलाएं नहीं; बिल्कुल स्थिर रखें।', 'मरीज को शांत और गर्म रखें।'],
      or: ['ତୁରନ୍ତ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ।', 'ଭଙ୍ଗା ହାଡ଼କୁ ବିଲକୁଲ ହଲାନ୍ତୁ ନାହିଁ, ସ୍ଥିର ରଖନ୍ତୁ।', 'ରୋଗୀଙ୍କୁ ଶୁଆଇ ରଖନ୍ତୁ ଓ ଶାନ୍ତ ରଖନ୍ତୁ।']
    }
  }
};

/**
 * Generates full clinical medicine recommendations and spoken script
 */
export function getClinicalMedicineRecommendations(clinicalState = {}, language = 'or-IN') {
  const category = clinicalState.primaryCategory || 'fever';
  const protocol = CLINICAL_MEDICINE_PROTOCOLS[category] || CLINICAL_MEDICINE_PROTOCOLS.fever;

  const langKey = language.startsWith('or') ? 'or' : language.startsWith('hi') ? 'hi' : 'en';

  const healthIssueTitle = protocol.healthIssue[langKey] || protocol.healthIssue.en;
  const healthIssueSummary = protocol.summary[langKey] || protocol.summary.en;
  const homeCareList = protocol.homeCare[langKey] || protocol.homeCare.en;

  // Format medications for this language
  const localizedMedicines = protocol.medicines.map((m) => ({
    id: m.id,
    name: m.name,
    generic: m.generic,
    category: m.category,
    dosage: m.dosage[langKey] || m.dosage.en,
    purpose: m.purpose[langKey] || m.purpose.en,
    precautions: m.precautions[langKey] || m.precautions.en,
    priceJanAushadhi: m.priceJanAushadhi,
    inStockPHC: m.inStockPHC,
    isOtc: m.isOtc,
    isEmergency: m.isEmergency || false
  }));

  // Build spoken dialogue script (Strictly non-diagnostic triage summary)
  let spokenScript = '';
  if (langKey === 'or') {
    spokenScript = `ଧନ୍ୟବାଦ। ଆପଣଙ୍କ ଲକ୍ଷଣ ଓ ଭାଇଟାଲ୍ସ ସଫଳତାର ସହ ଲିପିବଦ୍ଧ ହୋଇଛି: ${healthIssueTitle}। ଏହା କେବଳ ଏକ ଟ୍ରାଏଜ୍ ନୋଟ୍ ଅଟେ, କୌଣସି ରୋଗ ନିର୍ଣ୍ଣୟ ବା ଔଷଧ ବ୍ୟବସ୍ଥାପତ୍ର ନୁହେଁ। ଦୟାକରି କର୍ତ୍ତବ୍ୟରତ ଡାକ୍ତରଙ୍କ ସହ ପରାମର୍ଶ କରନ୍ତୁ।`;
  } else if (langKey === 'hi') {
    spokenScript = `धन्यवाद। आपके लक्षण और वाइटल संकेत दर्ज कर लिए गए हैं: ${healthIssueTitle}। यह केवल एक संरचित ट्रायज नोट है, कोई चिकित्सकीय निदान या दवा पर्ची नहीं है। कृपया ड्यूटी डॉक्टर से परामर्श करें।`;
  } else {
    spokenScript = `Thank you. Your reported symptoms and vitals have been structured under: ${healthIssueTitle}. This is an assistive triage note only, not a clinical diagnosis or prescription. Please consult the attending Medical Officer.`;
  }

  return {
    category,
    healthIssueTitle,
    healthIssueSummary,
    urgencyLevel: clinicalState.urgencyTier || 'GREEN',
    urgencyScore: clinicalState.urgencyScore || 30,
    medicines: localizedMedicines,
    homeCare: homeCareList,
    spokenScript
  };
}

/**
 * Turn-by-Turn Clinical Intake & Scribe Engine
 * Conversational triage questions for structured intake. Strictly non-diagnostic.
 */
export const DOCTOR_CONVERSATION_QUESTIONS = {
  turn1_chief_complaint: {
    id: 'turn1',
    stepNumber: 1,
    title: { en: 'Chief Health Complaint', hi: 'मुख्य स्वास्थ्य समस्या', or: 'ମୁଖ୍ୟ ସ୍ୱାସ୍ଥ୍ୟ ସମସ୍ୟା' },
    prompts: {
      en: 'Namaste! I am your AI Swasthya Mitra Triage Scribe. Please tell me: what main symptoms or discomfort are you experiencing today?',
      hi: 'नमस्ते! मैं आपका एआई स्वास्थ्य मित्र ट्रायज सहायक हूँ। कृपया बताएं: आज आपको क्या मुख्य तकलीफ या लक्षण महसूस हो रहे हैं?',
      or: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ ଏଆଇ ସ୍ୱାସ୍ଥ୍ୟ ମିତ୍ର ଟ୍ରାଏଜ ସହାୟକ। ଦୟାକରି କୁହନ୍ତୁ: ଆଜି ଆପଣଙ୍କର କଣ ମୁଖ୍ୟ ଅସୁବିଧା ବା ଲକ୍ଷଣ ହେଉଛି?'
    }
  },
  turn2_targeted_inquiry: {
    id: 'turn2',
    stepNumber: 2,
    title: { en: 'Targeted Clinical Follow-up', hi: 'विशिष्ट लक्षण जांच', or: 'ବିଶେଷ ଲକ୍ଷଣ ପରୀକ୍ଷା' },
    getPrompt: (category, language) => {
      const langKey = language.startsWith('or') ? 'or' : language.startsWith('hi') ? 'hi' : 'en';
      const prompts = {
        fever: {
          en: 'I understand you have fever. Let me ask: Are you having shaking chills or severe shivering? Any headache, vomiting, or bodyache?',
          hi: 'समझ गया, आपको बुखार है। क्या ठंड लगकर कंपकंपी भी आ रही है? और क्या सिर में तेज़ दर्द, बदन दर्द या उल्टी का मन हो रहा है?',
          or: 'ବୁଝିଲି, ଆପଣଙ୍କୁ ଜ୍ୱର ଅଛି। କଣ ଥଣ୍ଡା ଲାଗି କମ୍ପ ହେଉଛି? ଆଉ ମୁଣ୍ଡ ବିନ୍ଧା କିମ୍ବା ବାନ୍ତି ଲାଗୁଛି କି?'
        },
        cardiac: {
          en: 'Please tell me carefully: Does this chest pain or pressure spread to your left arm, neck, or jaw? And are you sweating profusely with cold sweats?',
          hi: 'कृपया ध्यान से बताएं: क्या यह सीने का दर्द आपके बाएं हाथ, गर्दन या जबड़े की तरफ फैल रहा है? और क्या ठंडा पसीना छूट रहा है?',
          or: 'ଦୟାକରି ଧ୍ୟାନ ଦେଇ କୁହନ୍ତୁ: ଏହି ଛାତି କଷ୍ଟ କଣ ଆପଣଙ୍କ ବାମ ହାତ, ବେକ କିମ୍ବା ମୁଖଗହ୍ୱର ଆଡ଼କୁ ଯାଉଛି? ଆଉ ଥଣ୍ଡା ଝାଳ ବାହାରୁଛି କି?'
        },
        respiratory: {
          en: 'Is there phlegm or yellow mucus in your cough? And are you getting breathless or gasping while speaking full sentences?',
          hi: 'क्या खांसी में बलगम आ रहा है? और क्या सांस फूलने के कारण पूरा वाक्य बोलने में तकलीफ हो रही है?',
          or: 'କାଶରେ କଣ କଫ ବା ରକ୍ତ ପଡୁଛି? ଆଉ କଥା କହିବା ବେଳେ ଅଣନିଶ୍ୱାସୀ ଲାଗୁଛି କି?'
        },
        gastro: {
          en: 'How many episodes of loose motions or vomiting have happened in the last 12 hours? And do you have severe stomach cramps?',
          hi: 'पिछले 12 घंटों में कितनी बार दस्त या उल्टी हुई है? और क्या पेट में मरोड़ या असहनीय दर्द हो रहा है?',
          or: 'ଗତ ୧୨ ଘଣ୍ଟାରେ କେତେ ଥର ଝାଡ଼ା କିମ୍ବା ବାନ୍ତି ହୋଇଛି? ଆଉ ପେଟ କାଟୁଛି କି?'
        },
        neuro: {
          en: 'Did this headache start suddenly as the worst headache of your life? Are you having dizziness or weakness in any arm or leg?',
          hi: 'क्या यह सिरदर्द अचानक बहुत तेज शुरू हुआ? क्या चक्कर आ रहे हैं, आंखों से धुंधला दिख रहा है, या हाथ-पैर में कमजोरी लग रही है?',
          or: 'ଏହି ମୁଣ୍ଡବିନ୍ଧା କଣ ହଠାତ୍ ଅସହ୍ୟ ଭାବେ ଆରମ୍ଭ ହେଲା? ମୁଣ୍ଡ ବୁଲାଉଛି କିମ୍ବା ହାତ ଗୋଡ଼ ଦୁର୍ବଳ ଲାଗୁଛି କି?'
        },
        maternal_pediatric: {
          en: 'For mother or child: Is there severe swelling in the feet, blurry vision, or child dehydration with sunken eyes and low urine?',
          hi: 'गर्भवती मां या बच्चे के लिए: क्या पैरों में भारी सूजन है, धुंधला दिख रहा है, या बच्चे को पेशाब कम आ रहा है और आंखें धंसी हैं?',
          or: 'ଗର୍ଭବତୀ ମାଆ ବା ଶିଶୁ ପାଇଁ: ଗୋଡ଼ ଫୁଲିଛି କି, ଆଖିକୁ ଝାପ୍‌ସା ଦେଖାଯାଉଛି, କିମ୍ବା ପିଲାଟି ପରିସ୍ରା କରୁନି କି?'
        }
      };
      const catPrompts = prompts[category] || prompts.fever;
      return catPrompts[langKey] || catPrompts.en;
    }
  },
  turn3_timeline_vitals: {
    id: 'turn3',
    stepNumber: 3,
    title: { en: 'Timeline & Critical Vitals', hi: 'अवधि एवं वाइटल संकेत', or: 'ସମୟ ଓ ଜୀବନ ସୂଚକ' },
    prompts: {
      en: 'How many days have you had these symptoms? And do you know your temperature or oxygen level? Are there any red spots on your skin?',
      hi: 'यह तकलीफ कितने दिनों से हो रही है? और क्या आपने बुखार या बीपी नापा है? शरीर पर कोई लाल चकत्ते तो नहीं हैं?',
      or: 'ଏହି ସମସ୍ୟା କେତେ ଦିନ ହେଲା ହେଉଛି? ଆପଣଙ୍କ ଜ୍ୱର ତାପମାତ୍ରା କେତେ ଥିଲା? ଚର୍ମରେ କୌଣସି ନାଲି ଦାଗ ଅଛି କି?'
    }
  }
};

/**
 * Builds empathetic triage scribe summary script for Medical Officer review.
 * Strictly non-diagnostic and non-prescriptive.
 */
export function buildTriageScribeCompletionSpeech(clinicalState, medRecs, language = 'or-IN') {
  const langKey = language.startsWith('or') ? 'or' : language.startsWith('hi') ? 'hi' : 'en';
  const issue = medRecs.healthIssueTitle;

  if (langKey === 'hi') {
    return `बहुत-बहुत धन्यवाद। मैंने आपके सभी लक्षणों, समय-सीमा और वाइटल संकेतों को ड्यूटी पर उपस्थित मेडिकल ऑफिसर की समीक्षा हेतु ट्रायज नोट में दर्ज कर लिया है। संभावित लक्षण समूह: ${issue}। सुरक्षा नियमों के अनुसार, यह एआई प्रणाली कोई चिकित्सीय निदान या दवा पर्ची जारी नहीं करती है। प्राथमिक देखभाल हेतु पर्याप्त पानी पिएं, और क्लिनिकल जांच व दवा पर्ची के लिए कृपया उपस्थित डॉक्टर से परामर्श लें।`;
  } else if (langKey === 'or') {
    return `ଅନେକ ଅନେକ ଧନ୍ୟବାଦ। ମୁଁ ଆପଣଙ୍କ ସମସ୍ତ ଲକ୍ଷଣ, ସମୟସୀମା ଏବଂ ଭାଇଟାଲ୍ସ ସୂଚନାକୁ କର୍ତ୍ତବ୍ୟରତ ମେଡିକାଲ୍ ଅଫିସରଙ୍କ ସମୀକ୍ଷା ପାଇଁ ଏକ ସଂରଚିତ ଟ୍ରାଏଜ୍ ନୋଟ୍‌ରେ ଲିପିବଦ୍ଧ କରିଛି। ଲକ୍ଷଣ ସମୂହ: ${issue}। ନିରାପତ୍ତା ନିୟମ ଅନୁସାରେ ଏହି ସହାୟକ କୌଣସି ରୋଗ ନିର୍ଣ୍ଣୟ କରେ ନାହିଁ ବା ଔଷଧ ଲେଖେ ନାହିଁ। ଦୟାକରି କର୍ତ୍ତବ୍ୟରତ ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ନିଅନ୍ତୁ।`;
  } else {
    return `Thank you very much. I have transcribed and structured your symptoms, timeline, and vital indicators into an objective triage note for the attending Medical Officer to evaluate. Symptom cluster: ${issue}. By strict safety protocol, this AI assistant does not diagnose conditions or prescribe medications. Please consult the qualified Medical Officer on duty for clinical evaluation and prescription.`;
  }
}

/**
 * Backward compatibility alias for buildTriageScribeCompletionSpeech
 */
export function buildDoctorPrescriptionSpeech(clinicalState, medRecs, language = 'or-IN') {
  return buildTriageScribeCompletionSpeech(clinicalState, medRecs, language);
}

