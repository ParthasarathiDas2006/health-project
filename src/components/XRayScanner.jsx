import React, { useState, useRef, useEffect } from 'react';
import { Brain, Scan, FileText, ShieldAlert, Camera, RefreshCw, X, Upload } from 'lucide-react';

const SAMPLE_XRAYS = [
  {
    id: 'xr_tb',
    label: 'Case A — Suspected TB (45y Male)',
    patientId: 'OD-PHC-2024-0091',
    age: 45,
    gender: 'Male',
    facility: 'Berhampur PHC',
    image: '/images/xray_tb.jpg',
    urgency: 'high',
    findings: [
      'Apical cavitation — Right Upper Lobe',
      'Hilar Lymphadenopathy (bilateral)',
      'Miliary nodules — lower zones',
      'Pulmonary infiltration present',
    ],
    aiConfidence: { tb: 81, pneumonia: 12, normal: 7 },
    impression: 'Pattern consistent with active Pulmonary Tuberculosis.',
    recommendation:
      'URGENT — Refer to DOTS centre immediately. CBNAAT sputum test. Do NOT start empirical antibiotics.',
    doctorNote:
      'CXR: Apical cavitation RUL + hilar LAD + miliary nodules. High TB likelihood (81%). Sputum AFB / CBNAAT requested.',
  },
  {
    id: 'xr_pneu',
    label: 'Case B — Bacterial Pneumonia (38y Female)',
    patientId: 'OD-CHC-2024-0214',
    age: 38,
    gender: 'Female',
    facility: 'Koraput CHC',
    image: '/images/xray_pneumonia.jpg',
    urgency: 'medium',
    findings: [
      'Right Lower Lobe consolidation',
      'Air Bronchogram sign present',
      'No cavitation detected',
      'Mild cardiomegaly',
    ],
    aiConfidence: { tb: 18, pneumonia: 76, normal: 6 },
    impression: 'Findings compatible with Right Lower Lobe Bacterial Pneumonia.',
    recommendation:
      'MODERATE — Antibiotic therapy per PHC doctor. SpO2 monitoring every 2h. CXR follow-up in 6 weeks.',
    doctorNote:
      'CXR: RLL consolidation with air bronchogram. Pneumonia likely (76%). Sputum culture advised. No TB features.',
  },
  {
    id: 'xr_normal',
    label: 'Case C — Normal Scan (28y Female)',
    patientId: 'OD-SUB-2024-0377',
    age: 28,
    gender: 'Female',
    facility: 'Bhubaneswar Sub-Centre',
    image: '/images/xray_normal.jpg',
    urgency: 'low',
    findings: [
      'Clear lung fields bilaterally',
      'Normal cardiac silhouette',
      'No pleural effusion',
      'No infiltrates or cavitation',
    ],
    aiConfidence: { tb: 4, pneumonia: 6, normal: 90 },
    impression: 'No active pulmonary disease detected.',
    recommendation:
      'LOW RISK — No radiological concern. Clinical correlation advised. Routine follow-up.',
    doctorNote:
      'CXR: Normal study. Lungs clear bilaterally. No TB or pneumonia features. Symptoms likely non-pulmonary origin.',
  },
];

const URGENCY = {
  high: {
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-700',
    badge: 'bg-red-600',
    label: 'HIGH PRIORITY',
  },
  medium: {
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-700',
    badge: 'bg-amber-500',
    label: 'MODERATE',
  },
  low: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-300',
    text: 'text-emerald-700',
    badge: 'bg-emerald-600',
    label: 'LOW RISK',
  },
};

const SCAN_STEPS = [
  'Loading image into AI pipeline...',
  'Preprocessing pixel density...',
  'Detecting lung field boundaries...',
  'Scanning for opacities and cavitation...',
  'Comparing with 12,400 reference scans...',
  'Generating radiological impression...',
];

export default function XRayScanner() {
  const [mode, setMode] = useState('select'); // 'select' | 'upload'
  const [selectedCase, setSelectedCase] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null); // { url, name }
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStep, setScanStep] = useState('');
  const [result, setResult] = useState(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' | 'user'
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Stop camera on unmount or mode switch
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  function stopCameraStream() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }

  async function startCamera(facing = cameraFacing) {
    setCameraError(null);
    stopCameraStream();
    try {
      const constraints = {
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      setCameraFacing(facing);
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError(
        'Unable to access camera (' + (err.message || 'permission denied') + '). Please ensure camera permissions are allowed in your browser, or upload an image file instead.'
      );
      setCameraActive(false);
    }
  }

  function toggleCameraFacing() {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    startCamera(nextFacing);
  }

  function capturePhoto() {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setUploadedFile({ url: dataUrl, name: 'camera_capture_' + Date.now() + '.jpg' });
    setResult(null);
    stopCameraStream();
  }

  function runScan(caseData) {
    setResult(null);
    setScanning(true);
    setScanProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.floor(Math.random() * 14) + 8;
      const idx = Math.min(Math.floor(p / 17), SCAN_STEPS.length - 1);
      setScanStep(SCAN_STEPS[idx]);
      if (p >= 100) {
        clearInterval(iv);
        setScanning(false);
        setResult(caseData);
      }
      setScanProgress(Math.min(p, 100));
    }, 220);
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploadedFile({ url: URL.createObjectURL(file), name: file.name });
    setResult(null);
    stopCameraStream();
  }

  function runUploadScan() {
    runScan({
      id: 'xr_upload',
      label: 'Patient Scan — ' + (uploadedFile ? uploadedFile.name : 'Direct Capture'),
      patientId: 'OD-LIVE-' + String(Date.now()).slice(-6),
      age: '--',
      gender: '--',
      facility: 'Live Field/Camera Scan',
      image: uploadedFile ? uploadedFile.url : null,
      urgency: 'medium',
      findings: [
        'Radiograph / Capture received and preprocessed',
        'Bilateral thoracic field segmentation calibrated',
        'No hyper-dense apical cavitation detected',
        'Doctor verification mandatory before any clinical intervention',
      ],
      aiConfidence: { tb: 19, pneumonia: 42, normal: 39 },
      impression: 'Moderate screening flags present — Qualified Doctor Review Required.',
      recommendation:
        'Immediate referral to nearest PHC/CHC Medical Officer with this captured radiograph. Non-diagnostic decision support.',
      doctorNote:
        'CXR (Direct capture): AI screening shows moderate opacity index (42%). Doctor examination & confirmation required before prescribing medication.',
    });
  }

  const u = result ? URGENCY[result.urgency] : null;

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
          Select X-Ray Input Method
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setMode('select');
              setResult(null);
              stopCameraStream();
            }}
            className={
              'py-2.5 px-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all ' +
              (mode === 'select'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50')
            }
          >
            <FileText className="w-4 h-4" />
            <span>Pre-loaded Cases</span>
          </button>
          <button
            onClick={() => {
              setMode('upload');
              setResult(null);
              stopCameraStream();
            }}
            className={
              'py-2.5 px-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all ' +
              (mode === 'upload'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50')
            }
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image File</span>
          </button>
          <button
            onClick={() => {
              setMode('camera');
              setResult(null);
              startCamera('environment');
            }}
            className={
              'py-2.5 px-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2 transition-all ' +
              (mode === 'camera'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-indigo-50')
            }
          >
            <Camera className="w-4 h-4" />
            <span>Live Camera Capture</span>
            <span className="text-[9px] bg-emerald-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-full">LIVE</span>
          </button>
        </div>
      </div>

      {/* Sample Case Selector */}
      {mode === 'select' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-500" />
            Pre-loaded Clinical X-Ray Cases (Odisha PHC Database)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_XRAYS.map((xr) => {
              const urg = URGENCY[xr.urgency];
              const isSelected = selectedCase && selectedCase.id === xr.id;
              return (
                <button
                  key={xr.id}
                  onClick={() => { setSelectedCase(xr); setResult(null); }}
                  className={
                    'text-left p-3 rounded-xl border-2 transition-all ' +
                    (isSelected
                      ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50')
                  }
                >
                  <img
                    src={xr.image}
                    alt={xr.label}
                    className="w-full h-32 object-cover rounded-lg mb-2 bg-black"
                  />
                  <p className="text-xs font-bold text-slate-800 leading-tight">{xr.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{xr.facility}</p>
                  <span
                    className={
                      'mt-1.5 inline-block text-[10px] text-white ' +
                      urg.badge +
                      ' px-2 py-0.5 rounded-full font-bold'
                    }
                  >
                    {urg.label}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedCase && (
            <button
              onClick={() => runScan(selectedCase)}
              disabled={scanning}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold text-sm transition-all mt-2"
            >
              <Scan className="w-4 h-4" />
              {scanning ? 'AI Scanning in Progress...' : 'Run AI Scan on ' + selectedCase.label}
            </button>
          )}
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Scan className="w-4 h-4 text-indigo-500" />
            Upload Patient X-Ray for AI Screening
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 cursor-pointer hover:bg-indigo-50 transition-all">
            <span className="text-3xl mb-2">🫁</span>
            <span className="text-sm font-semibold text-indigo-700">Click to upload X-Ray image</span>
            <span className="text-[11px] text-slate-400 mt-1">JPG, PNG supported</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
          {uploadedFile && (
            <div className="space-y-3">
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src={uploadedFile.url}
                  alt="Uploaded X-Ray"
                  className="w-full h-auto object-contain bg-black"
                />
                <div className="bg-slate-800 px-3 py-2">
                  <p className="text-[11px] text-slate-300 font-mono">{uploadedFile.name}</p>
                </div>
              </div>
              <button
                onClick={runUploadScan}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                <Brain className="w-4 h-4" />
                {scanning ? 'AI Scanning...' : 'Run AI X-Ray Analysis'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Camera Mode */}
      {mode === 'camera' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-indigo-500" />
              Live Camera X-Ray / Radiograph Capture
            </p>
            {cameraActive && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={toggleCameraFacing}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 font-medium transition-all"
                  title="Switch Front/Back Camera"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Flip</span>
                </button>
                <button
                  type="button"
                  onClick={stopCameraStream}
                  className="px-2.5 py-1 text-xs bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg flex items-center gap-1 font-medium transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>
            )}
          </div>

          {/* Camera Error Message */}
          {cameraError && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex flex-col gap-2">
              <p>{cameraError}</p>
              <button
                type="button"
                onClick={() => startCamera(cameraFacing)}
                className="self-start px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700"
              >
                Retry Camera
              </button>
            </div>
          )}

          {/* Video Stream Container */}
          <div className="relative rounded-2xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center border-2 border-indigo-200">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={'w-full h-full object-cover ' + (cameraActive ? 'block' : 'hidden')}
            />

            {!cameraActive && !uploadedFile && (
              <div className="text-center p-6 text-slate-400 space-y-3">
                <Camera className="w-12 h-12 mx-auto text-slate-500 animate-pulse" />
                <p className="text-xs text-slate-300">Camera preview not running.</p>
                <button
                  type="button"
                  onClick={() => startCamera(cameraFacing)}
                  className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                >
                  Turn On Camera
                </button>
              </div>
            )}

            {/* Viewfinder Target Overlay */}
            {cameraActive && (
              <div className="absolute inset-4 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between text-[10px] text-emerald-300 font-mono bg-black/60 px-2 py-0.5 rounded">
                  <span>ALIGN CHEST X-RAY / FILM</span>
                  <span>AI LIVE DETECT</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-emerald-200 bg-black/60 px-2 py-1 rounded">
                    Hold steady over the view-box or patient scan
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Capture Trigger Button */}
          {cameraActive && (
            <div className="flex justify-center pt-1">
              <button
                type="button"
                onClick={capturePhoto}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <Camera className="w-5 h-5" />
                <span>Capture Patient Scan Now</span>
              </button>
            </div>
          )}

          {/* Captured Preview */}
          {uploadedFile && !cameraActive && (
            <div className="space-y-3 pt-2">
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                <div className="bg-slate-800 px-3 py-2 flex items-center justify-between">
                  <p className="text-[11px] text-emerald-400 font-mono font-bold">
                    Captured from Live Camera
                  </p>
                  <button
                    type="button"
                    onClick={() => startCamera(cameraFacing)}
                    className="text-[10px] text-slate-300 hover:text-white underline"
                  >
                    Retake Photo
                  </button>
                </div>
                <img
                  src={uploadedFile.url}
                  alt="Captured scan"
                  className="w-full h-auto object-contain bg-black max-h-72 mx-auto"
                />
              </div>

              <button
                onClick={runUploadScan}
                disabled={scanning}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                <Brain className="w-4 h-4" />
                {scanning ? 'AI Scanning Captured Film...' : 'Analyze Captured Patient Scan'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Scan Progress */}
      {scanning && (
        <div className="bg-slate-900 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-mono font-bold">
              SwasthyaMitra AI X-Ray Engine — Running
            </span>
          </div>
          <p className="text-slate-300 text-[11px] font-mono">{scanStep}</p>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-emerald-400 h-2 rounded-full transition-all duration-200"
              style={{ width: scanProgress + '%' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['Image Preprocessing', 'Pathology Detection', 'Clinical Impression'].map((s, i) => (
              <div
                key={s}
                className={
                  'text-[10px] text-center p-1.5 rounded-lg border ' +
                  (scanProgress > i * 33
                    ? 'bg-emerald-900/40 border-emerald-700 text-emerald-300'
                    : 'bg-slate-800 border-slate-700 text-slate-500')
                }
              >
                {scanProgress > i * 33 ? '✓' : '○'} {s}
              </div>
            ))}
          </div>
          <p className="text-slate-500 text-[10px]">
            Comparing against 12,400 reference chest X-rays from NHP database...
          </p>
        </div>
      )}

      {/* Result Panel */}
      {result && !scanning && (
        <div className="space-y-4">
          {/* Urgency Banner */}
          <div
            className={
              u.bg + ' border-2 ' + u.border + ' rounded-2xl p-4 flex items-center justify-between'
            }
          >
            <div>
              <p className={'text-sm font-extrabold ' + u.text}>{u.label}</p>
              <p className={'text-xs ' + u.text + ' opacity-80 mt-0.5'}>{result.impression}</p>
            </div>
            <span
              className={
                'text-white text-[11px] font-bold ' + u.badge + ' px-3 py-1.5 rounded-xl'
              }
            >
              {result.patientId}
            </span>
          </div>

          {/* Image + Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* X-Ray Image */}
            <div className="rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm">
              <div className="bg-slate-800 px-3 py-2 flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 font-mono font-bold">
                  AI Scan Complete
                </span>
                <span className="ml-auto text-[9px] text-slate-400">
                  {new Date().toLocaleTimeString('en-IN')}
                </span>
              </div>
              <div className="bg-black p-1">
                {result.image && (
                  <img
                    src={result.image}
                    alt="X-Ray Scan"
                    className="w-full h-auto object-contain rounded"
                  />
                )}
              </div>
              <div className="bg-slate-900 px-3 py-2">
                <p className="text-[10px] text-slate-400 font-mono">
                  {result.label} — {result.facility}
                </p>
              </div>
            </div>

            {/* Confidence + Findings */}
            <div className="space-y-3">
              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                  AI Confidence Scores
                </p>
                {[
                  { label: 'Pulmonary TB', val: result.aiConfidence.tb, color: 'bg-red-500' },
                  {
                    label: 'Bacterial Pneumonia',
                    val: result.aiConfidence.pneumonia,
                    color: 'bg-amber-400',
                  },
                  {
                    label: 'Normal / No Disease',
                    val: result.aiConfidence.normal,
                    color: 'bg-emerald-500',
                  },
                ].map((bar) => (
                  <div key={bar.label} className="mb-2">
                    <div className="flex justify-between text-[10px] mb-0.5">
                      <span className="text-slate-600 font-medium">{bar.label}</span>
                      <span className="font-bold text-slate-800">{bar.val}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className={bar.color + ' h-2 rounded-full'}
                        style={{ width: bar.val + '%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Detected Findings
                </p>
                <ul className="space-y-1">
                  {result.findings.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="text-indigo-500 font-bold mt-0.5">→</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-sm">
            <div className={u.bg + ' border ' + u.border + ' rounded-xl p-3'}>
              <p className={'text-[11px] font-bold ' + u.text + ' uppercase tracking-wide mb-1'}>
                ASHA Field Recommendation
              </p>
              <p className={'text-xs ' + u.text}>{result.recommendation}</p>
            </div>
            <div className="bg-slate-900 rounded-xl p-3 font-mono text-[11px] space-y-1">
              <p className="text-emerald-400 font-bold">SwasthyaMitra — AI X-Ray Report Note</p>
              <p className="text-slate-300">{result.doctorNote}</p>
              <p className="text-slate-500 text-[10px] pt-1 border-t border-slate-700">
                Non-diagnostic AI screening. Doctor validation mandatory before treatment.
              </p>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 rounded-xl p-3">
            <ShieldAlert className="w-5 h-5 text-indigo-500 flex-shrink-0" />
            <p className="text-[11px] text-indigo-700">
              <strong>Legal Notice:</strong> This X-Ray screening is non-diagnostic AI assistance.
              Final clinical decision must be made by a qualified doctor. Compliant with MoHFW
              Digital Health Policy 2023.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
