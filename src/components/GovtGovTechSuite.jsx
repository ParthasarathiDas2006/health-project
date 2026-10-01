import React, { useState, useEffect } from 'react';
import XRayScanner from './XRayScanner';
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
import ClinicalRiskScoreSuite from './ClinicalRiskScoreSuite';

const DrugAllergySafetyGuard = React.lazy(() => import('./DrugAllergySafetyGuard'));
// ─── Differential Triage Module (Feature 12) ────────────────────────────────
const SYMPTOM_PRESETS = [
  {
    id: 'resp',
    label: 'Respiratory',
    emoji: '🫁',
    image: '/images/respiratory_triage.jpg',
    imageCaption: 'Chest X-Ray: TB Cavitation, Hilar Lymphadenopathy & Pulmonary Infiltration',
    symptoms: 'Productive cough 3 weeks, low-grade evening fever, mild breathlessness, night sweats',
    age: 34, gender: 'Male',
    spo2: 94, rr: 22, temp: 99.4, hr: 96,
    differentials: [
      { name: 'Pulmonary Tuberculosis', icd: 'A15.0', pct: 78, color: 'red', flag: true,
        redFlags: ['Evening fever >2 weeks', 'Night sweats', 'Weight loss >3kg'],
        doctorQs: ['History of drenching night sweats?', 'Hemoptysis (blood in sputum) in last 7 days?', 'Household contact with known TB patient?', 'Sputum AFB / CBNAAT done?'],
        ashaAction: 'Refer to DOTS centre immediately. Do not start empirical antibiotics.' },
      { name: 'LRTI / Bacterial Pneumonia', icd: 'J22', pct: 52, color: 'amber', flag: false,
        redFlags: ['SpO₂ <94%', 'RR >20', 'Pleuritic chest pain'],
        doctorQs: ['Sputum colour (yellow/green/rusty)?', 'Chest X-Ray done?', 'Any prior antibiotic use in last 2 weeks?'],
        ashaAction: 'Monitor SpO₂ every 2h. Refer if SpO₂ drops below 92%.' },
      { name: 'COPD Exacerbation', icd: 'J44.1', pct: 24, color: 'slate', flag: false,
        redFlags: ['Wheeze on auscultation', 'Barrel chest', 'Smoking history'],
        doctorQs: ['History of smoking (pack-years)?', 'Previous COPD diagnosis or spirometry?', 'Use of inhalers?'],
        ashaAction: 'Document smoking history. Escalate to PHC doctor for spirometry referral.' },
    ]
  },
  {
    id: 'cardiac',
    label: 'Cardiac',
    emoji: '❤️',
    image: '/images/cardiac_triage.jpg',
    imageCaption: 'Cardiac Anatomy: Occluded LAD Artery (STEMI site) & ST-Elevation on ECG',
    symptoms: 'Chest tightness, radiating left arm pain, diaphoresis, nausea since 1 hour',
    age: 58, gender: 'Male',
    spo2: 96, rr: 18, temp: 98.6, hr: 110,
    differentials: [
      { name: 'Acute MI (STEMI/NSTEMI)', icd: 'I21', pct: 85, color: 'red', flag: true,
        redFlags: ['Chest pain >30 min', 'Diaphoresis', 'Radiating arm/jaw pain'],
        doctorQs: ['ECG done? ST elevation present?', 'Troponin / CKMB available?', 'Time of onset of pain?', 'Aspirin 325mg given?'],
        ashaAction: 'EMERGENCY — Call 108 immediately. Give Aspirin 325mg if no allergy. Do not delay.' },
      { name: 'Unstable Angina', icd: 'I20.0', pct: 60, color: 'amber', flag: true,
        redFlags: ['Recurrent chest pain at rest', 'New onset within 2 months'],
        doctorQs: ['Pain at rest or exertion?', 'Previous angina history?', 'Nitrate use?'],
        ashaAction: 'Urgent PHC referral. Oxygen if available. Keep patient supine.' },
      { name: 'GERD / Esophageal Spasm', icd: 'K21.0', pct: 20, color: 'slate', flag: false,
        redFlags: ['Burning after food', 'Relieved by antacids'],
        doctorQs: ['Pain related to meals?', 'Antacid trial response?', 'Any dysphagia?'],
        ashaAction: 'Rule out cardiac cause first. Document response to antacids for doctor.' },
    ]
  },
  {
    id: 'maternal',
    label: 'Maternal',
    emoji: '🤰',
    image: '/images/maternal_triage.jpg',
    imageCaption: 'ANC Monitoring: BP Reading & Pre-eclampsia Warning Signs (Headache, Oedema, Visual Disturbance)',
    symptoms: 'Severe headache, visual disturbance, swollen feet, 34 weeks pregnant',
    age: 26, gender: 'Female',
    spo2: 98, rr: 16, temp: 99.0, hr: 88,
    differentials: [
      { name: 'Pre-eclampsia / Eclampsia', icd: 'O14.1', pct: 82, color: 'red', flag: true,
        redFlags: ['BP >140/90', 'Proteinuria', 'Severe headache', 'Visual changes'],
        doctorQs: ['BP reading (both arms)?', 'Dipstick urine protein?', 'Platelet count?', 'Any seizures?'],
        ashaAction: 'EMERGENCY — Refer to FRU / district hospital NOW. Give MgSO4 if available per JSY protocol.' },
      { name: 'Pregnancy-Induced Hypertension', icd: 'O13', pct: 55, color: 'amber', flag: false,
        redFlags: ['BP 130-139/80-89', 'Persistent headache'],
        doctorQs: ['Baseline BP in first trimester?', 'ANC visit frequency?', 'Fetal movements normal?'],
        ashaAction: 'Monitor BP every 4h. Document in MCP card. Refer if BP worsens.' },
      { name: 'Tension Headache (Pregnancy)', icd: 'G44.2', pct: 15, color: 'slate', flag: false,
        redFlags: ['No neurological symptoms', 'BP normal'],
        doctorQs: ['Duration of headache?', 'Associated nausea/vomiting?', 'Visual aura?'],
        ashaAction: 'Safe analgesic (Paracetamol) per doctor advice. Monitor BP and fetal movements.' },
    ]
  },
  {
    id: 'pediatric',
    label: 'Paediatric',
    emoji: '👶',
    image: '/images/pediatric_triage.jpg',
    imageCaption: 'Paediatric Meningitis: Neck Stiffness (Nuchal Rigidity), Kernig\'s Sign & Petechial Rash',
    symptoms: 'Child 3 years, high fever 104°F, neck stiffness, photophobia, rash on trunk',
    age: 3, gender: 'Male',
    spo2: 97, rr: 28, temp: 104.0, hr: 130,
    differentials: [
      { name: 'Bacterial Meningitis', icd: 'G00.9', pct: 75, color: 'red', flag: true,
        redFlags: ['Neck stiffness', 'Photophobia', 'Petechial rash', 'High fever'],
        doctorQs: ['Kernig / Brudzinski sign positive?', 'Fontanelle status?', 'CSF analysis done?', 'Vaccination history (Hib, MenC)?'],
        ashaAction: 'EMERGENCY — Rush to district hospital. Do not delay antibiotics. Isolate.' },
      { name: 'Viral Encephalitis', icd: 'A86', pct: 48, color: 'amber', flag: true,
        redFlags: ['Altered consciousness', 'Seizures', 'Fever with behavioural change'],
        doctorQs: ['Any seizure activity?', 'Consciousness level (AVPU)?', 'MRI / EEG possible?'],
        ashaAction: 'Urgent referral to paediatric ward. Monitor airway. Seizure precautions.' },
      { name: 'Dengue Fever', icd: 'A90', pct: 35, color: 'slate', flag: false,
        redFlags: ['Thrombocytopenia', 'Retro-orbital pain', 'Dengue endemic area'],
        doctorQs: ['NS1 antigen / IgM done?', 'Platelet count?', 'Bleeding from any site?'],
        ashaAction: 'Dengue rapid test. Oral fluids. Monitor platelet. No NSAIDs.' },
    ]
  },
];

function DifferentialTriageModule() {
  const [selectedPreset, setSelectedPreset] = useState(SYMPTOM_PRESETS[0]);
  const [customSymptoms, setCustomSymptoms] = useState('');
  const [analysing, setAnalysing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resultReady, setResultReady] = useState(true);
  const [expandedCard, setExpandedCard] = useState(0);
  const [doctorNoteGenerated, setDoctorNoteGenerated] = useState(false);
  const [activeModuleTab, setActiveModuleTab] = useState('differential'); // 'differential' | 'xray'

  const runAnalysis = () => {
    setAnalysing(true);
    setResultReady(false);
    setProgress(0);
    setDoctorNoteGenerated(false);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 18) + 6;
      if (p >= 100) { p = 100; clearInterval(iv); setAnalysing(false); setResultReady(true); }
      setProgress(p);
    }, 180);
  };

  const colorMap = {
    red: { bar: 'bg-red-500', badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-red-300', ring: 'ring-red-200' },
    amber: { bar: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-300', ring: 'ring-amber-100' },
    slate: { bar: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600 border-slate-200', border: 'border-slate-200', ring: '' },
  };

  const active = selectedPreset;
  const topDiff = active.differentials[0];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-indigo-900 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-5 h-5 text-indigo-200" />
              <h3 className="text-base font-extrabold">AI Differential Triage Engine</h3>
              <span className="text-[10px] bg-indigo-500/50 border border-indigo-400 px-2 py-0.5 rounded-full font-mono">Non-Diagnostic</span>
            </div>
            <p className="text-indigo-200 text-xs">Human-in-the-Loop • MoHFW Safety Protocol • For Doctor Review Only</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-1 rounded-lg">✓ ABDM Aligned</span>
            <span className="text-[10px] bg-indigo-500/20 border border-indigo-400/40 text-indigo-200 px-2 py-1 rounded-lg">NHP v2 Protocol</span>
            <span className="text-[10px] bg-amber-500/20 border border-amber-400/40 text-amber-300 px-2 py-1 rounded-lg">ICD-10 Coded</span>
          </div>
        </div>

        {/* Tab Switcher inside header */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveModuleTab('differential')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeModuleTab === 'differential'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Brain className="w-4 h-4" /> Symptom Differential
          </button>
          <button
            onClick={() => setActiveModuleTab('xray')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeModuleTab === 'xray'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Scan className="w-4 h-4" /> X-Ray AI Scanner
            <span className="text-[9px] bg-emerald-400 text-slate-900 font-bold px-1.5 py-0.5 rounded-full ml-1">NEW</span>
          </button>
        </div>
      </div>

      {activeModuleTab === 'differential' && (
        <>
          {/* Scenario Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Select Clinical Scenario</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SYMPTOM_PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => { setSelectedPreset(p); setResultReady(true); setExpandedCard(0); setDoctorNoteGenerated(false); }}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm font-semibold transition-all ${
                selectedPreset.id === p.id
                  ? 'bg-indigo-50 border-indigo-400 text-indigo-700 ring-2 ring-indigo-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{p.emoji}</span>
              <span className="text-xs">{p.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Patient Vitals Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1"><Activity className="w-4 h-4 text-indigo-500" /> Patient Snapshot</p>
          <span className="text-[10px] text-slate-400">{active.age}y / {active.gender}</span>
        </div>
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-3">
          <p className="text-xs text-slate-700 italic">"{active.symptoms}"</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: 'SpO₂', val: `${active.spo2}%`, warn: active.spo2 < 95, icon: '🫁' },
            { label: 'RR', val: `${active.rr}/min`, warn: active.rr > 20, icon: '💨' },
            { label: 'Temp', val: `${active.temp}°F`, warn: active.temp > 100.4, icon: '🌡️' },
            { label: 'HR', val: `${active.hr} bpm`, warn: active.hr > 100 || active.hr < 60, icon: '❤️' },
          ].map((v) => (
            <div key={v.label} className={`text-center p-2 rounded-xl border ${v.warn ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
              <div className="text-lg">{v.icon}</div>
              <div className={`text-sm font-bold ${v.warn ? 'text-red-600' : 'text-slate-800'}`}>{v.val}</div>
              <div className="text-[10px] text-slate-500">{v.label}</div>
              {v.warn && <div className="text-[9px] text-red-500 font-bold mt-0.5">⚠ Abnormal</div>}
            </div>
          ))}
        </div>

        {/* Clinical Reference Image — Full Display */}
        {active.image && (
          <div className="mt-4 rounded-2xl overflow-hidden border-2 border-indigo-100 shadow-sm">
            {/* Image Header */}
            <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-2 flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide">📋 Clinical Reference Diagram</span>
              <span className="ml-auto text-[9px] bg-indigo-100 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-mono">Educational Use Only</span>
            </div>
            {/* Full Image — no cropping */}
            <div className="bg-white p-2">
              <img
                src={active.image}
                alt={active.imageCaption}
                className="w-full h-auto object-contain rounded-lg"
                style={{ display: 'block' }}
                onError={(e) => { e.target.parentElement.parentElement.style.display = 'none'; }}
              />
            </div>
            {/* Caption Bar */}
            <div className="bg-slate-800 px-4 py-2.5 flex items-start justify-between gap-3">
              <p className="text-[11px] text-slate-300 italic leading-relaxed">{active.imageCaption}</p>
              <span className="text-[9px] bg-indigo-600 text-white px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0 font-semibold">Clinical Ref</span>
            </div>
          </div>
        )}
      </div>

      {/* AI Analysis Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={runAnalysis}
          disabled={analysing}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm"
        >
          <Brain className="w-4 h-4" />
          {analysing ? 'Analysing Clinical Patterns...' : 'Re-Run AI Differential Analysis'}
        </button>
        <span className="text-[10px] text-slate-400">Non-diagnostic. For doctor review only.</span>
      </div>

      {/* Progress Bar */}
      {analysing && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-slate-500">
            <span>Matching symptom vectors against NHP clinical database...</span>
            <span className="font-mono">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {['Symptom Vectorisation', 'ICD-10 Mapping', 'Red Flag Detection'].map((step, i) => (
              <div key={step} className={`text-[10px] text-center p-1.5 rounded-lg border ${progress > i * 33 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                {progress > i * 33 ? '✓' : '○'} {step}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Differentials Result */}
      {resultReady && !analysing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Differential Possibilities — For Doctor Review Only
            </h4>
            {topDiff.flag && (
              <span className="flex items-center gap-1 bg-red-100 text-red-700 border border-red-300 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <AlertTriangle className="w-3.5 h-3.5" /> High-Priority Referral
              </span>
            )}
          </div>

          <div className="space-y-3">
            {active.differentials.map((d, idx) => {
              const cm = colorMap[d.color];
              const isOpen = expandedCard === idx;
              return (
                <div key={d.name} className={`border rounded-2xl overflow-hidden shadow-xs transition-all ${cm.border} ${d.flag ? 'ring-2 ' + cm.ring : ''}`}>
                  {/* Card Header */}
                  <button
                    className="w-full flex items-center gap-3 p-4 bg-white hover:bg-slate-50 transition-colors text-left"
                    onClick={() => setExpandedCard(isOpen ? -1 : idx)}
                  >
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cm.badge}`}>
                      #{idx + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">{d.name}</p>
                        <span className="text-[10px] text-slate-400 font-mono">{d.icd}</span>
                        {d.flag && <span className="text-[10px] bg-red-100 text-red-600 border border-red-200 px-1.5 py-0.5 rounded font-bold">⚠ Red Flag</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                          <div className={`${cm.bar} h-1.5 rounded-full`} style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${d.color === 'red' ? 'text-red-600' : d.color === 'amber' ? 'text-amber-600' : 'text-slate-500'}`}>
                          {d.pct}% likelihood
                        </span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {/* Expanded Detail */}
                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50 p-4 space-y-3">
                      {/* Red Flags */}
                      <div>
                        <p className="text-[11px] font-bold text-red-600 uppercase tracking-wide mb-1.5">🚩 Clinical Red Flags to Confirm</p>
                        <div className="flex flex-wrap gap-1.5">
                          {d.redFlags.map(f => (
                            <span key={f} className="text-[11px] bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-lg">{f}</span>
                          ))}
                        </div>
                      </div>
                      {/* Doctor Questions */}
                      <div>
                        <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wide mb-1.5">💬 Targeted Questions for Attending Doctor</p>
                        <ul className="space-y-1">
                          {d.doctorQs.map((q, qi) => (
                            <li key={qi} className="flex items-start gap-2 text-xs text-slate-700">
                              <span className="mt-0.5 text-indigo-400 font-bold">{qi + 1}.</span>
                              {q}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {/* ASHA Action */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                        <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide mb-1">🏥 ASHA / ANM Field Action</p>
                        <p className="text-xs text-emerald-800">{d.ashaAction}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Doctor Referral Note Generator */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-500" />
                Generate Doctor Referral Note
              </p>
              <button
                onClick={() => setDoctorNoteGenerated(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1.5 rounded-lg font-semibold transition-all"
              >
                Generate Note
              </button>
            </div>
            {doctorNoteGenerated && (
              <div className="bg-slate-900 text-white rounded-xl p-4 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                  <span className="text-emerald-400 font-bold">SwasthyaMitra — AI Triage Summary Note</span>
                  <span className="text-slate-400">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <p className="text-slate-300">Patient: {active.age}y {active.gender} | SpO₂: {active.spo2}% | HR: {active.hr} | Temp: {active.temp}°F</p>
                <p className="text-amber-300">Presenting complaint: {active.symptoms}</p>
                <p className="text-white font-bold">Top Differential (AI — non-diagnostic): {active.differentials[0].name} ({active.differentials[0].pct}%) [ICD: {active.differentials[0].icd}]</p>
                <p className="text-indigo-300">Also consider: {active.differentials.slice(1).map(d => `${d.name} (${d.pct}%)`).join(', ')}</p>
                <p className="text-red-400">Red Flags Present: {active.differentials[0].redFlags.join(' • ')}</p>
                <p className="text-slate-400 text-[10px] mt-2 pt-2 border-t border-slate-700">⚠ This is a non-diagnostic AI triage support note. Final clinical decision rests with qualified physician. MoHFW Safety Protocol v2 compliant.</p>
              </div>
            )}
          </div>

          {/* MoHFW Compliance Footer */}
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <ShieldAlert className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <p className="text-[11px] text-indigo-700">
              <strong>Legal &amp; Safety Notice:</strong> This module provides clinical decision support only. AI outputs are non-diagnostic and do not replace qualified medical judgment. Compliant with MoHFW Digital Health Policy 2023 and DPDP Act 2023. All data is session-only and not stored.
            </p>
          </div>
            </div>
          )}
        </>
      )}

      {/* X-Ray Scanner Sub-Module */}
      {activeModuleTab === 'xray' && <XRayScanner />}
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

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

  // ABHA Mock Patient Profiles
  const abhaPatients = {
    '91-8842-1209-7711': {
      name: 'Ramesh Chandra Pati',
      age: 52,
      gender: 'Male',
      bloodGroup: 'O+',
      aadhaar: 'XXXX-XXXX-4921',
      district: 'Cuttack, Odisha',
      emergency: '+91 94370 XXXXX (Son)',
      primaryPhc: 'SCB Salipur Block PHC',
      vitals: [
        { date: '14 Nov 2025', facility: 'PHC Salipur', sugar: 126, bp: '120/80', spo2: '99%', hb: '13.5 g/dL', egfr: '92', status: 'STABLE', statusBg: 'bg-emerald-100 text-emerald-800' },
        { date: '14 Jan 2026', facility: 'SCB Medical College OPD', sugar: 140, bp: '128/82', spo2: '98%', hb: '13.2 g/dL', egfr: '88', status: 'MILD ELEVATION', statusBg: 'bg-blue-100 text-blue-800' },
        { date: '18 Feb 2026', facility: 'Capital Hospital PHC', sugar: 180, bp: '136/88', spo2: '96%', hb: '12.8 g/dL', egfr: '81', status: 'MODERATE ESCALATION', statusBg: 'bg-amber-200 text-amber-900' },
        { date: '01 Mar 2026', facility: 'DHH Khordha OPD', sugar: 210, bp: '142/90', spo2: '94%', hb: '12.0 g/dL', egfr: '74', status: 'HIGH RISK', statusBg: 'bg-orange-200 text-orange-950 font-bold' },
        { date: '10 Mar 2026 (Today)', facility: 'Active Triage Intake Desk', sugar: 240, bp: '148/94', spo2: '93%', hb: '11.4 g/dL', egfr: '68', status: '⚠️ CRITICAL ALERT', statusBg: 'bg-rose-600 text-white font-black animate-pulse' }
      ],
      hba1c: '9.4%',
      microalbumin: '45 mg/g',
      aiSummary: 'Patient glycemic control has deteriorated by 90.4% over 116 days. Rapid systolic BP spike & Hb decline observed. High DKA & early renal impairment risk.',
      prescriptions: [
        { date: '18 Feb 2026', doctor: 'Dr. P. K. Mohanty (Reg #38291)', meds: 'Tab. Metformin 500mg BD + Tab. Teneligliptin 20mg OD' },
        { date: '14 Jan 2026', doctor: 'Dr. S. N. Das (Reg #29102)', meds: 'Tab. Metformin 500mg OD' }
      ]
    },
    '91-4402-9912-3341': {
      name: 'Saraswati Sahoo',
      age: 46,
      gender: 'Female',
      bloodGroup: 'B+',
      aadhaar: 'XXXX-XXXX-8812',
      district: 'Puri, Odisha',
      emergency: '+91 98610 XXXXX (Husband)',
      primaryPhc: 'Gop Block PHC',
      vitals: [
        { date: '10 Dec 2025', facility: 'Gop PHC', sugar: 110, bp: '118/76', spo2: '99%', hb: '12.1 g/dL', egfr: '95', status: 'STABLE', statusBg: 'bg-emerald-100 text-emerald-800' },
        { date: '15 Jan 2026', facility: 'DHH Puri OPD', sugar: 135, bp: '124/80', spo2: '98%', hb: '11.8 g/dL', egfr: '91', status: 'MONITORING', statusBg: 'bg-blue-100 text-blue-800' },
        { date: '20 Feb 2026', facility: 'Capital Hospital', sugar: 155, bp: '130/84', spo2: '97%', hb: '11.2 g/dL', egfr: '86', status: 'MODERATE', statusBg: 'bg-amber-100 text-amber-900' },
        { date: '10 Mar 2026 (Today)', facility: 'Puri District Camp', sugar: 195, bp: '138/88', spo2: '95%', hb: '10.8 g/dL', egfr: '80', status: '⚠️ ESCALATING TREND', statusBg: 'bg-rose-500 text-white font-bold' }
      ],
      hba1c: '8.2%',
      microalbumin: '28 mg/g',
      aiSummary: 'Moderate Glycemic escalation over 90 days. Hemoglobin indicates mild microcytic anemia. Diet counseling and ASHA follow-up advised.',
      prescriptions: [
        { date: '20 Feb 2026', doctor: 'Dr. Anita Mishra (Reg #41029)', meds: 'Tab. Gliclazide 40mg OD + Tab. Autrin Iron Supplement' }
      ]
    },
    '91-1102-5544-8899': {
      name: 'Prakash Rout',
      age: 38,
      gender: 'Male',
      bloodGroup: 'A+',
      aadhaar: 'XXXX-XXXX-1109',
      district: 'Khordha, Odisha',
      emergency: '+91 97780 XXXXX (Wife)',
      primaryPhc: 'Jatni PHC',
      vitals: [
        { date: '01 Nov 2025', facility: 'Jatni PHC', sugar: 98, bp: '115/75', spo2: '99%', hb: '14.2 g/dL', egfr: '102', status: 'NORMAL', statusBg: 'bg-emerald-100 text-emerald-800' },
        { date: '10 Jan 2026', facility: 'AIIMS Bhubaneswar', sugar: 105, bp: '118/78', spo2: '99%', hb: '14.0 g/dL', egfr: '100', status: 'NORMAL', statusBg: 'bg-emerald-100 text-emerald-800' },
        { date: '10 Mar 2026 (Today)', facility: 'Jatni Health Camp', sugar: 112, bp: '120/80', spo2: '98%', hb: '13.9 g/dL', egfr: '98', status: 'STABLE BASELINE', statusBg: 'bg-emerald-600 text-white font-bold' }
      ],
      hba1c: '5.8%',
      microalbumin: '12 mg/g',
      aiSummary: 'Normal metabolic stability across 4 months. Glycemic & renal markers within optimal physiological baseline.',
      prescriptions: [
        { date: '10 Jan 2026', doctor: 'Dr. R. K. Sahoo (Reg #19201)', meds: 'Multivitamin Supplements OD' }
      ]
    }
  };

  const currentPatient = abhaPatients[patientAbha] || abhaPatients['91-8842-1209-7711'];
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Top Profile & ABDM Gateway Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  🟢 Live ABDM Gateway (HIE-CM v2.1 Connected)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  FHIR Release 4.0 Standard
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                ABHA Longitudinal Temporal History & Vital Progression
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Automated multi-visit clinical trend analysis synced across MoHFW PHC Network & ABDM Health Records.
              </p>
            </div>

            {/* Patient Selector */}
            <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Select ABHA ID:</label>
              <select
                value={patientAbha}
                onChange={(e) => setPatientAbha(e.target.value)}
                className="bg-white border border-indigo-200 text-indigo-950 font-extrabold text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 shadow-2xs"
              >
                <option value="91-8842-1209-7711">91-8842-1209-7711 (Ramesh Chandra Pati - High Risk)</option>
                <option value="91-4402-9912-3341">91-4402-9912-3341 (Saraswati Sahoo - Moderate)</option>
                <option value="91-1102-5544-8899">91-1102-5544-8899 (Prakash Rout - Normal)</option>
              </select>
            </div>
          </div>

          {/* Patient Demographics Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-4 rounded-2xl shadow-xs grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Patient Name</span>
              <span className="font-extrabold text-white text-sm">{currentPatient.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Age / Gender / Blood</span>
              <span className="font-bold text-slate-200">{currentPatient.age} Yrs • {currentPatient.gender} • {currentPatient.bloodGroup}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Linked Aadhaar</span>
              <span className="font-bold text-emerald-400">✓ {currentPatient.aadhaar}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">District / State</span>
              <span className="font-bold text-slate-200">{currentPatient.district}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Primary Nodal PHC</span>
              <span className="font-bold text-indigo-300">{currentPatient.primaryPhc}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Emergency Contact</span>
              <span className="font-bold text-amber-300">{currentPatient.emergency}</span>
            </div>
          </div>

          {/* 4 Key Vital Metric Progression Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-rose-50/90 border border-rose-200 space-y-1">
              <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">Fasting Blood Sugar Trend</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-rose-950">{currentPatient.vitals[currentPatient.vitals.length - 1].sugar} mg/dL</span>
                <span className="text-xs font-bold text-rose-700 bg-rose-200 px-1.5 py-0.5 rounded">HbA1c: {currentPatient.hba1c}</span>
              </div>
              <p className="text-[11px] text-rose-800 font-medium">Progression: {currentPatient.vitals[0].sugar} → {currentPatient.vitals[currentPatient.vitals.length - 1].sugar} mg/dL</p>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-1">
              <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Blood Pressure Curve</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-amber-950">{currentPatient.vitals[currentPatient.vitals.length - 1].bp} mmHg</span>
                <span className="text-xs font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">Stage-2 HTN</span>
              </div>
              <p className="text-[11px] text-amber-800 font-medium">Baseline: {currentPatient.vitals[0].bp} → Today: {currentPatient.vitals[currentPatient.vitals.length - 1].bp}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-indigo-50/90 border border-indigo-200 space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-800 uppercase tracking-wider">Hemoglobin Index</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-indigo-950">{currentPatient.vitals[currentPatient.vitals.length - 1].hb}</span>
                <span className="text-xs font-bold text-indigo-800 bg-indigo-200 px-1.5 py-0.5 rounded">Mild Anemia</span>
              </div>
              <p className="text-[11px] text-indigo-800 font-medium">Range: {currentPatient.vitals[0].hb} → {currentPatient.vitals[currentPatient.vitals.length - 1].hb}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Renal Function eGFR</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-black text-emerald-950">{currentPatient.vitals[currentPatient.vitals.length - 1].egfr} mL/min</span>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-200 px-1.5 py-0.5 rounded">ACR: {currentPatient.microalbumin}</span>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">Baseline: {currentPatient.vitals[0].egfr} → Today: {currentPatient.vitals[currentPatient.vitals.length - 1].egfr}</p>
            </div>
          </div>

          {/* Longitudinal Visit Cards (Timeline) */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Full Temporal Visit History ({currentPatient.vitals.length} Recorded ABDM Encounters)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
              {currentPatient.vitals.map((v, idx) => (
                <div key={idx} className={`p-3.5 rounded-xl border space-y-1.5 shadow-2xs ${idx === currentPatient.vitals.length - 1 ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/40' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Visit #{idx + 1}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded ${v.statusBg}`}>{v.status}</span>
                  </div>
                  <p className="font-extrabold text-slate-900 text-xs">{v.date}</p>
                  <p className="text-indigo-700 font-bold text-[11px]">Sugar: {v.sugar} mg/dL</p>
                  <p className="text-slate-600 text-[10px]">BP: {v.bp} • SpO2: {v.spo2}</p>
                  <p className="text-slate-500 text-[10px]">Hb: {v.hb} • eGFR: {v.egfr}</p>
                  <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-200/60 truncate">{v.facility}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Clinical Insight & Diagnostic Records */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* AI Insight */}
            <div className="p-4 bg-indigo-50/90 border border-indigo-200 rounded-xl text-indigo-950 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 font-extrabold text-indigo-900 text-sm">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
                AI Longitudinal Insight &amp; DKA Risk Assessment
              </div>
              <p className="leading-relaxed text-indigo-900 font-medium">
                {currentPatient.aiSummary}
              </p>
              <div className="pt-2 border-t border-indigo-200/80 flex items-center justify-between text-[11px] font-bold text-indigo-800">
                <span>Recommended Action: Dual Anti-Diabetic + Telmisartan Escalation</span>
                <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[10px]">Verified Protocol</span>
              </div>
            </div>

            {/* Past Prescriptions & Lab Reports */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 space-y-2">
              <h5 className="font-extrabold text-slate-900 text-xs flex items-center justify-between">
                <span>Linked ABDM Prescriptions &amp; Lab Slips</span>
                <span className="text-[10px] text-slate-400">FHIR Encounters</span>
              </h5>
              <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                {currentPatient.prescriptions.map((p, i) => (
                  <div key={i} className="p-2 bg-white rounded-lg border border-slate-200 text-[11px] space-y-0.5">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{p.date}</span>
                      <span className="text-indigo-600 text-[10px]">{p.doctor}</span>
                    </div>
                    <p className="text-slate-600 font-medium">{p.meds}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: Safe Differential Triage */}
      {activeSubTab === 'differential' && (
        <DifferentialTriageModule />
      )}

      {/* Feature 3 / Module 13: Drug Allergy Alert */}
      {activeSubTab === 'drug_safety' && (
        <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Module 13...</div>}>
          <DrugAllergySafetyGuard appLang={lang} currentUser={currentUser} />
        </React.Suspense>
      )}

      {/* Feature 4 / Tab 14: Automated Clinical Risk Scores */}
      {activeSubTab === 'scores' && (
        <ClinicalRiskScoreSuite appLang={lang} currentUser={currentUser} />
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
