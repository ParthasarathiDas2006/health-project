import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  FileText,
  Activity,
  ShieldCheck,
  Languages,
  Maximize2,
  Minimize2,
  RefreshCw,
  Camera,
  Share2,
  Volume2,
  Send,
  Plus,
  Trash2,
  Printer,
  Download,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Sparkles,
  QrCode,
  Clock,
  User,
  Radio
} from 'lucide-react';
import { getDoctorPhotoUrl, DoctorAvatar } from '../utils/doctorPhotos';

export default function TeleConsultationSuite({
  currentUser,
  appLang = 'or-IN',
  initialDoctor = null,
  onClose,
  onPrescriptionGenerated
}) {
  const lang = appLang || 'or-IN';

  // Active Specialist Doctor
  const doctor = useMemo(() => {
    if (initialDoctor) return initialDoctor;
    return {
      id: 'doc-scb-01',
      name: 'Dr. Soumya Ranjan Mohanty',
      specialty: 'MD (General Medicine), SCB Medical College & Hospital',
      regNo: 'OMC-48921-2014',
      facility: 'SCB Medical College & Hospital, Cuttack',
      rating: '4.9',
      reviews: 412,
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80'
    };
  }, [initialDoctor]);

  // Video Consultation States
  const [callStatus, setCallStatus] = useState('connecting'); // 'connecting' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' or 'environment'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState('chat'); // 'chat' | 'rx' | 'vitals'

  // Live Subtitles / Speech Translation States (Odia <-> English)
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);
  const [captionLang, setCaptionLang] = useState(lang === 'or-IN' ? 'or' : 'en');
  const [liveCaptions, setLiveCaptions] = useState([
    {
      speaker: 'doctor',
      textOdia: 'ନମସ୍କାର, ମୁଁ ଡାକ୍ତର ମହାନ୍ତି। ଆପଣଙ୍କ ଛାତିରେ କି ପ୍ରକାର ଯନ୍ତ୍ରଣା ହେଉଛି କୁହନ୍ତୁ?',
      textEn: 'Hello, I am Dr. Mohanty. Can you describe what kind of chest discomfort you are experiencing?',
      timestamp: '00:05'
    }
  ]);

  // Live Chat Stream
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'doctor',
      name: doctor.name,
      text: 'Namaskar! Welcome to the Odisha Tele-OPD Consultation Portal. How can I assist you today?',
      time: 'Just now'
    }
  ]);
  const [inputChat, setInputChat] = useState('');

  // Live Prescription Pad States
  const [rxDiagnosis, setRxDiagnosis] = useState('Acute Bronchitis with Mild Respiratory Distress');
  const [rxMedicines, setRxMedicines] = useState([
    { id: 1, name: 'Tab. Azithromycin 500mg', dosage: '1 Tab Daily', timing: 'After Meal', duration: '5 Days' },
    { id: 2, name: 'Syp. Ascoril-D', dosage: '10ml TDS', timing: 'After Food', duration: '5 Days' },
    { id: 3, name: 'Tab. Paracetamol 650mg', dosage: 'SOS on Fever', timing: 'After Meal', duration: '3 Days' }
  ]);
  const [rxAdvice, setRxAdvice] = useState('Steam inhalation twice daily. Warm saline gargle. Maintain adequate hydration.');
  const [rxFollowUp, setRxFollowUp] = useState('3 Days (or immediately if SpO2 drops below 94%)');
  const [issuedPrescription, setIssuedPrescription] = useState(null);

  // Live Vitals Telemetry (Simulated IoT Stream)
  const [vitals, setVitals] = useState({
    spO2: 97,
    heartRate: 78,
    bp: '122/82',
    temperature: 98.6,
    respiratoryRate: 18
  });

  // Media Stream References
  const localVideoRef = useRef(null);
  const containerRef = useRef(null);

  // Call Duration Timer
  useEffect(() => {
    let timer;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  // Format Duration seconds to MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // WebRTC User Media Initializer
  useEffect(() => {
    let mediaStream = null;

    const startLocalStream = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: cameraFacing },
            audio: true
          });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
        }
      } catch (err) {
        console.warn('[WebRTC Video] Camera stream unavailable or permission declined, falling back to simulated avatar:', err);
      }
      
      // Simulate doctor connection handshake
      setTimeout(() => {
        setCallStatus('connected');
      }, 1200);
    };

    startLocalStream();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing]);

  // Live Automated Dialogue / Subtitle Simulation Stream
  useEffect(() => {
    if (callStatus !== 'connected') return;

    const script = [
      {
        speaker: 'patient',
        textOdia: 'ଡାକ୍ତର ବାବୁ, ଗତ ୩ ଦିନ ହେବ କାଶ ଓ ଜ୍ୱର ଅଛି, ନିଶ୍ୱାସ ନେବାରେ ଟିକେ କଷ୍ଟ ହେଉଛି।',
        textEn: 'Doctor, I have had cough and fever for the last 3 days, and having some difficulty breathing.',
        delay: 5000
      },
      {
        speaker: 'doctor',
        textOdia: 'ବୁଝିଲି। ଆପଣଙ୍କ ପଲ୍ସ ଅକ୍ସିମିଟରରେ SpO2 ଚେକ୍ କରିଥିଲେ କି? ବର୍ତ୍ତମାନ ୯୭% ଦେଖାଉଛି, ଯାହା ସ୍ୱାଭାବିକ ଅଟେ।',
        textEn: 'Understood. Did you check your pulse oximeter? It currently reads 97%, which is reassuring.',
        delay: 12000
      },
      {
        speaker: 'doctor',
        textOdia: 'ମୁଁ ଆପଣଙ୍କ ପାଇଁ ଆଣ୍ଟିବାୟୋଟିକ୍ ଓ କାଶ ସିରପ୍ ଡିଜିଟାଲ୍ ପ୍ରେସ୍କ୍ରିପସନ୍ ପ୍ରସ୍ତୁତ କରୁଛି।',
        textEn: 'I am preparing a digital prescription with antibiotic and cough syrup for you right now.',
        delay: 20000
      }
    ];

    const timeouts = script.map((item) => {
      return setTimeout(() => {
        setLiveCaptions((prev) => [
          ...prev,
          {
            speaker: item.speaker,
            textOdia: item.textOdia,
            textEn: item.textEn,
            timestamp: formatDuration(callDuration + Math.floor(item.delay / 1000))
          }
        ]);
      }, item.delay);
    });

    return () => timeouts.forEach((t) => clearTimeout(t));
  }, [callStatus]);

  // Dynamic Vitals Telemetry Jitter
  useEffect(() => {
    if (callStatus !== 'connected') return;
    const interval = setInterval(() => {
      setVitals((prev) => ({
        spO2: Math.min(99, Math.max(95, prev.spO2 + (Math.random() > 0.5 ? 1 : -1))),
        heartRate: Math.min(88, Math.max(72, prev.heartRate + Math.floor(Math.random() * 3 - 1))),
        bp: '120/80',
        temperature: 98.6,
        respiratoryRate: 18
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, [callStatus]);

  // Send In-Call Chat Message
  const handleSendChat = (e) => {
    if (e) e.preventDefault();
    if (!inputChat.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'patient',
      name: currentUser?.name || 'Patient',
      text: inputChat.trim(),
      time: formatDuration(callDuration)
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputChat('');

    // Doctor auto response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'doctor',
          name: doctor.name,
          text: 'Noted. I have updated your electronic health record with these clinical observations.',
          time: formatDuration(callDuration + 2)
        }
      ]);
    }, 1500);
  };

  // Add Medicine Item to Rx
  const handleAddMedicine = () => {
    setRxMedicines((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: 'Tab. Montelukast 10mg',
        dosage: '1 Tab at Bedtime',
        timing: 'After Food',
        duration: '7 Days'
      }
    ]);
  };

  const handleRemoveMedicine = (id) => {
    setRxMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  // Issue & Sign Digital Rx
  const handleIssuePrescription = () => {
    const rxSlip = {
      prescriptionId: `RX-TELE-${Math.floor(100000 + Math.random() * 900000)}`,
      consultDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      consultTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      doctor: {
        name: doctor.name,
        specialty: doctor.specialty,
        regNo: doctor.regNo,
        facility: doctor.facility
      },
      patient: {
        name: currentUser?.name || 'Pratap Mohanty',
        abha: currentUser?.staffId || '91-7712-4439-8021',
        age: currentUser?.age || 42,
        gender: currentUser?.gender || 'Male'
      },
      diagnosis: rxDiagnosis,
      medicines: rxMedicines,
      advice: rxAdvice,
      followUp: rxFollowUp,
      vitalsSnapshot: vitals,
      nmcCompliant: true,
      digitalSignature: `SHA256: ${Math.random().toString(36).substring(2, 15).toUpperCase()}`
    };

    setIssuedPrescription(rxSlip);
    if (onPrescriptionGenerated) {
      onPrescriptionGenerated(rxSlip);
    }
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col overflow-hidden font-sans select-none animate-fadeIn"
    >
      {/* ── Top Header Navigation Bar ────────────────────────────────────────── */}
      <div className="h-14 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
            <Stethoscope className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-black text-white">{doctor.name}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 text-[9px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>E2EE 256-BIT</span>
              </span>
            </div>
            <p className="text-[10px] text-slate-400">{doctor.specialty}</p>
          </div>
        </div>

        {/* Live Call Duration & Telemetry */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-xs font-mono font-bold text-emerald-300">
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>{callStatus === 'connected' ? formatDuration(callDuration) : 'Connecting...'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-slate-800/60 border border-slate-700/60 rounded-xl p-0.5 text-[10px]">
            <button
              onClick={() => setCaptionLang('or')}
              className={`px-2 py-0.5 rounded-lg transition-all ${captionLang === 'or' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              ଓଡ଼ିଆ
            </button>
            <button
              onClick={() => setCaptionLang('en')}
              className={`px-2 py-0.5 rounded-lg transition-all ${captionLang === 'en' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
            >
              EN
            </button>
          </div>

          <button
            onClick={handleToggleFullscreen}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ── Main Video Workspace + Side Drawer ──────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* Left/Center: Video Streams & Subtitle Stage */}
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          {/* Main Remote Specialist Doctor Stream */}
          <div className="w-full h-full relative flex items-center justify-center">
            {callStatus === 'connecting' ? (
              <div className="text-center space-y-4 p-8">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto flex items-center justify-center text-2xl">
                  👨‍⚕️
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Connecting with Specialist...</h3>
                  <p className="text-xs text-slate-400">{doctor.facility}</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                {/* Doctor Video Feed Simulation */}
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-full h-full object-cover opacity-90 filter brightness-95"
                />

                {/* Ambient Doctor Overlay Badge */}
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 flex items-center gap-2.5 shadow-lg">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    👨‍⚕️
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{doctor.name}</span>
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div className="text-[10px] text-emerald-300 font-mono">OMC: {doctor.regNo}</div>
                  </div>
                </div>

                {/* In-Call Live Vitals Overlay HUD */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 space-y-1.5 shadow-lg hidden sm:block">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Activity className="w-3 h-3 text-rose-400 animate-pulse" />
                    <span>Real-Time Vitals HUD</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/50">
                      <div className="text-[9px] text-slate-400">SpO2</div>
                      <div className="text-xs font-black text-emerald-400">{vitals.spO2}%</div>
                    </div>
                    <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/50">
                      <div className="text-[9px] text-slate-400">Pulse</div>
                      <div className="text-xs font-black text-rose-400">{vitals.heartRate} bpm</div>
                    </div>
                    <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/50">
                      <div className="text-[9px] text-slate-400">BP</div>
                      <div className="text-xs font-black text-amber-300">{vitals.bp}</div>
                    </div>
                    <div className="bg-slate-900/80 px-2 py-1 rounded-lg border border-slate-700/50">
                      <div className="text-[9px] text-slate-400">Temp</div>
                      <div className="text-xs font-black text-sky-400">{vitals.temperature}°F</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Picture-in-Picture Self Patient Video Stream (Bottom Right) */}
          <div className="absolute bottom-24 right-4 w-28 h-36 sm:w-36 sm:h-48 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-2xl bg-slate-900 z-20 group">
            {isVideoOff ? (
              <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center text-slate-400 p-2 text-center">
                <VideoOff className="w-6 h-6 mb-1 text-slate-500" />
                <span className="text-[10px] font-bold">Camera Off</span>
              </div>
            ) : (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            )}
            <div className="absolute bottom-1 left-1.5 bg-black/60 backdrop-blur-xs px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1">
              <span>{currentUser?.name || 'You'}</span>
              {isMicMuted && <MicOff className="w-2.5 h-2.5 text-rose-400" />}
            </div>
          </div>

          {/* Real-Time Live Translated Captions / Subtitles Stage */}
          {subtitlesEnabled && liveCaptions.length > 0 && (
            <div className="absolute bottom-20 left-4 right-4 sm:left-12 sm:right-44 z-20 flex flex-col items-center pointer-events-none">
              <div className="bg-black/75 backdrop-blur-md border border-white/15 px-4 py-2.5 rounded-2xl max-w-xl text-center shadow-2xl space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-400">
                  <Sparkles className="w-3 h-3 animate-spin" />
                  <span>
                    {liveCaptions[liveCaptions.length - 1].speaker === 'doctor'
                      ? doctor.name
                      : currentUser?.name || 'Patient'}
                  </span>
                  <span className="text-slate-400">• Live Odia ↔ English Translation</span>
                </div>
                <p className="text-xs sm:text-sm font-black text-white leading-snug">
                  {captionLang === 'or'
                    ? liveCaptions[liveCaptions.length - 1].textOdia
                    : liveCaptions[liveCaptions.length - 1].textEn}
                </p>
                <p className="text-[11px] text-slate-300 italic">
                  {captionLang === 'or'
                    ? `(EN): "${liveCaptions[liveCaptions.length - 1].textEn}"`
                    : `(ଓଡ଼ିଆ): "${liveCaptions[liveCaptions.length - 1].textOdia}"`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Drawer: Tabs for Chat, Digital Prescription Pad, and Vitals */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-72 lg:h-full shrink-0">
          {/* Panel Selector Header */}
          <div className="h-11 bg-slate-950/60 border-b border-slate-800 px-3 flex items-center gap-2">
            <button
              onClick={() => setActiveSidePanel('chat')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSidePanel === 'chat'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>In-Call Chat</span>
            </button>
            <button
              onClick={() => setActiveSidePanel('rx')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSidePanel === 'rx'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Digital Rx Pad</span>
            </button>
            <button
              onClick={() => setActiveSidePanel('vitals')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeSidePanel === 'vitals'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Vitals &amp; ECG</span>
            </button>
          </div>

          {/* Panel Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
            {/* 1. CHAT CHANNEL */}
            {activeSidePanel === 'chat' && (
              <div className="flex flex-col h-full space-y-3">
                <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-0.5">
                        <span className="font-bold">{msg.name}</span>
                        <span>•</span>
                        <span>{msg.time}</span>
                      </div>
                      <div
                        className={`p-2.5 rounded-2xl max-w-[85%] text-xs leading-relaxed ${
                          msg.sender === 'patient'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    value={inputChat}
                    onChange={(e) => setInputChat(e.target.value)}
                    placeholder="Type clinical query or symptom..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. LIVE NMC DIGITAL PRESCRIPTION PAD */}
            {activeSidePanel === 'rx' && (
              <div className="space-y-3">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                    <span className="font-black text-emerald-400 flex items-center gap-1">
                      <Stethoscope className="w-3.5 h-3.5" />
                      NMC e-Prescription Pad
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Verifiable QR</span>
                  </div>

                  {/* Diagnosis */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Clinical Diagnosis</label>
                    <input
                      type="text"
                      value={rxDiagnosis}
                      onChange={(e) => setRxDiagnosis(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Medicines List */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold text-slate-400">Rx Medicines</label>
                      <button
                        type="button"
                        onClick={handleAddMedicine}
                        className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Drug</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {rxMedicines.map((med) => (
                        <div
                          key={med.id}
                          className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center justify-between gap-2"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-white text-xs truncate">{med.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {med.dosage} • {med.timing} • {med.duration}
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(med.id)}
                            className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Advice & Instructions */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Advice &amp; Diet</label>
                    <textarea
                      rows={2}
                      value={rxAdvice}
                      onChange={(e) => setRxAdvice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  {/* Follow-up */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-0.5">Follow-up Date</label>
                    <input
                      type="text"
                      value={rxFollowUp}
                      onChange={(e) => setRxFollowUp(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>

                  {/* Issue Rx Button */}
                  <button
                    type="button"
                    onClick={handleIssuePrescription}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Sign &amp; Issue e-Prescription</span>
                  </button>
                </div>

                {/* Issued Confirmation Badge */}
                {issuedPrescription && (
                  <div className="bg-emerald-950/60 border border-emerald-500/50 rounded-xl p-3 text-emerald-200 space-y-2 animate-fadeIn">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>e-Prescription Generated Successfully!</span>
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400/90">
                      ID: {issuedPrescription.prescriptionId}
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => window.print()}
                        className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Rx Slip</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. VITALS TELEMETRY & ECG MONITOR */}
            {activeSidePanel === 'vitals' && (
              <div className="space-y-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                      Live Patient Telemetry
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono">Sensors Connected</span>
                  </div>

                  {/* ECG Rhythm Waveform Graphic */}
                  <div className="h-16 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-0.5 bg-emerald-500/30" />
                    </div>
                    {/* Simulated ECG SVG path */}
                    <svg className="w-full h-full text-emerald-400" viewBox="0 0 300 60" preserveAspectRatio="none">
                      <path
                        d="M0,30 L40,30 L50,10 L60,50 L70,30 L110,30 L120,8 L130,52 L140,30 L180,30 L190,12 L200,48 L210,30 L250,30 L260,10 L270,50 L280,30 L300,30"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    </svg>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Blood Oxygen (SpO2)</div>
                      <div className="text-lg font-black text-emerald-400 mt-0.5">{vitals.spO2}%</div>
                      <div className="text-[9px] text-emerald-500 font-medium">Optimal Range</div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Heart Rate (Pulse)</div>
                      <div className="text-lg font-black text-rose-400 mt-0.5">{vitals.heartRate} bpm</div>
                      <div className="text-[9px] text-rose-400/80 font-medium">Normal Sinus Rhythm</div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Blood Pressure</div>
                      <div className="text-lg font-black text-amber-300 mt-0.5">{vitals.bp} mmHg</div>
                      <div className="text-[9px] text-slate-400 font-medium">Normotensive</div>
                    </div>

                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                      <div className="text-[10px] text-slate-400">Body Temp</div>
                      <div className="text-lg font-black text-sky-300 mt-0.5">{vitals.temperature} °F</div>
                      <div className="text-[9px] text-slate-400 font-medium">Afebrile</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Bottom Call Controls Dock ───────────────────────────────────────── */}
      <div className="h-20 bg-slate-900 border-t border-slate-800 px-4 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-2">
          {/* Subtitles Toggle */}
          <button
            onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
            className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
              subtitlesEnabled
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Live Multilingual Captions"
          >
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">Live Subtitles</span>
          </button>
        </div>

        {/* Primary In-Call Actions */}
        <div className="flex items-center gap-3">
          {/* Mic Mute Button */}
          <button
            onClick={() => setIsMicMuted(!isMicMuted)}
            className={`p-3.5 rounded-2xl transition shadow-lg cursor-pointer ${
              isMicMuted
                ? 'bg-rose-600 text-white ring-4 ring-rose-900/40'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isMicMuted ? 'Unmute Microphone' : 'Mute Microphone'}
          >
            {isMicMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Video Camera Toggle */}
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`p-3.5 rounded-2xl transition shadow-lg cursor-pointer ${
              isVideoOff
                ? 'bg-rose-600 text-white ring-4 ring-rose-900/40'
                : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
          >
            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>

          {/* Camera Flip (User / Environment) */}
          <button
            onClick={() => setCameraFacing(cameraFacing === 'user' ? 'environment' : 'user')}
            className="p-3.5 bg-slate-800 text-white hover:bg-slate-700 rounded-2xl transition shadow-lg cursor-pointer hidden sm:block"
            title="Flip Camera (Front/Rear)"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              setCallStatus('ended');
              if (onClose) onClose();
            }}
            className="px-5 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-xs flex items-center gap-2 shadow-xl shadow-rose-950/40 cursor-pointer active:scale-95 transition-all"
            title="End Tele-Consultation"
          >
            <PhoneOff className="w-5 h-5" />
            <span>End Call</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Speaker Sound Toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`p-2.5 rounded-xl text-xs transition cursor-pointer ${
              isSpeakerOn ? 'bg-slate-800 text-white' : 'bg-slate-800/40 text-slate-500'
            }`}
            title="Toggle Speaker"
          >
            <Volume2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
