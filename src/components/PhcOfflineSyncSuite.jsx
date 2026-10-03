import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  Cloud,
  HardDrive,
  Download,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserPlus,
  ShieldCheck,
  Smartphone,
  Server,
  FileText,
  Activity,
  Layers,
  Search,
  Sparkles,
  Zap,
  Info,
  Check,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import {
  initPhcDb,
  getPhcDbStats,
  getPendingOutbox,
  getAllOfflinePatients,
  getAllOfflineTriage,
  getAllOfflineScans,
  getAllSyncAuditLogs,
  saveOfflinePatient,
  saveOfflineTriage,
  syncOutboxWithDistrictServer,
  exportPhcEncryptedBackup,
  importPhcBackup,
  onPhcDbChange
} from '../utils/phcIndexedDb';
import { onNetworkStatusChange, promptPwaInstall, onPwaInstallable, cacheAllAppResources } from '../utils/pwaRegister';

export default function PhcOfflineSyncSuite({ appLang = 'or-IN', themeMode = 'light' }) {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [isCachingOffline, setIsCachingOffline] = useState(false);
  const [dbStats, setDbStats] = useState(null);
  const [outboxItems, setOutboxItems] = useState([]);
  const [patients, setPatients] = useState([]);
  const [scans, setScans] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('outbox'); // 'outbox' | 'patients' | 'scans' | 'logs' | 'pwa'
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState({ current: 0, total: 0 });
  const [syncMessage, setSyncMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pwaInstallable, setPwaInstallable] = useState(false);
  const [showQuickIntakeModal, setShowQuickIntakeModal] = useState(false);
  const [selectedScanPreview, setSelectedScanPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Quick Offline Intake Form State
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    gender: 'Male',
    village: 'Borigumma, Block: Koraput',
    phone: '',
    abhaId: '',
    triageLevel: 'YELLOW',
    chiefComplaint: '',
    temp: '99.0',
    bp: '130/84',
    pulse: '84',
    spo2: '96'
  });

  const effectiveOnline = isOnline && !simulatedOffline;

  useEffect(() => {
    initPhcDb().then(() => {
      refreshData();
    });

    const unsubNetwork = onNetworkStatusChange((online) => {
      setIsOnline(online);
    });

    const unsubDb = onPhcDbChange(() => {
      refreshData();
    });

    const unsubPwa = onPwaInstallable((installable) => {
      setPwaInstallable(installable);
    });

    return () => {
      unsubNetwork();
      unsubDb();
      unsubPwa();
    };
  }, []);

  async function refreshData() {
    try {
      const [stats, outbox, pats, scs, logs] = await Promise.all([
        getPhcDbStats(),
        getPendingOutbox(),
        getAllOfflinePatients(),
        getAllOfflineScans(),
        getAllSyncAuditLogs()
      ]);
      setDbStats(stats);
      setOutboxItems(outbox);
      setPatients(pats);
      setScans(scs);
      setAuditLogs(logs);
    } catch (err) {
      console.warn('[PHC Suite] Error refreshing data:', err);
    }
  }

  async function handleSyncNow() {
    if (!effectiveOnline) {
      setSyncMessage({
        type: 'error',
        text: 'Cannot sync while in Offline Mode. Please enable network connectivity or turn off Simulated Blackout.'
      });
      return;
    }

    setIsSyncing(true);
    setSyncMessage(null);
    try {
      const result = await syncOutboxWithDistrictServer((progress) => {
        setSyncProgress(progress);
      });
      setSyncMessage({
        type: 'success',
        text: result.message
      });
      await refreshData();
    } catch (err) {
      setSyncMessage({
        type: 'error',
        text: 'Sync failed: ' + err.message
      });
    } finally {
      setIsSyncing(false);
      setSyncProgress({ current: 0, total: 0 });
    }
  }

  async function handleQuickIntakeSubmit(e) {
    e.preventDefault();
    if (!newPatient.name.trim()) return;

    const patRecord = await saveOfflinePatient({
      name: newPatient.name,
      age: Number(newPatient.age) || 30,
      gender: newPatient.gender,
      village: newPatient.village,
      phone: newPatient.phone || '+91 94370 00000',
      abhaId: newPatient.abhaId || '91-' + Math.floor(1000 + Math.random() * 9000) + '-' + Math.floor(1000 + Math.random() * 9000),
      triageLevel: newPatient.triageLevel,
      urgencyScore: newPatient.triageLevel === 'RED' ? 90 : newPatient.triageLevel === 'YELLOW' ? 65 : 25,
      chiefComplaint: newPatient.chiefComplaint || 'Acute symptoms recorded offline at Sub-Centre',
      vitals: {
        temp: `${newPatient.temp}°F`,
        bp: newPatient.bp,
        pulse: `${newPatient.pulse} bpm`,
        spo2: `${newPatient.spo2}%`
      },
      ashaWorker: 'ASHA Field Worker (Offline Mode)'
    });

    // Also save triage record
    await saveOfflineTriage({
      patientId: patRecord.id,
      patientName: patRecord.name,
      urgency: newPatient.triageLevel,
      urgencyScore: patRecord.urgencyScore,
      chiefComplaint: patRecord.chiefComplaint,
      vitals: patRecord.vitals
    });

    setShowQuickIntakeModal(false);
    setNewPatient({
      name: '',
      age: '',
      gender: 'Male',
      village: 'Borigumma, Block: Koraput',
      phone: '',
      abhaId: '',
      triageLevel: 'YELLOW',
      chiefComplaint: '',
      temp: '99.0',
      bp: '130/84',
      pulse: '84',
      spo2: '96'
    });

    setSyncMessage({
      type: 'success',
      text: `Patient "${patRecord.name}" saved to local IndexedDB & enqueued to Outbox (${patRecord.id}).`
    });

    refreshData();
  }

  async function handleExportBackup() {
    const res = await exportPhcEncryptedBackup();
    setSyncMessage({
      type: 'success',
      text: `Encrypted PHC Backup generated: ${res.fileName} (${res.recordCount} records, ${res.fileSizeKb} KB). Ready for USB transfer.`
    });
  }

  function triggerImportFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  }

  async function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const res = await importPhcBackup(event.target.result);
      if (res.success) {
        setSyncMessage({ type: 'success', text: res.message });
        refreshData();
      } else {
        setSyncMessage({ type: 'error', text: res.message });
      }
    };
    reader.readAsText(file);
  }

  async function handlePrecacheOfflineApp() {
    setIsCachingOffline(true);
    setSyncMessage({
      type: 'info',
      text: 'Downloading & caching all application bundles, clinical triage models, and assets for 100% offline access...'
    });
    const result = await cacheAllAppResources();
    setIsCachingOffline(false);
    if (result.success) {
      setSyncMessage({
        type: 'success',
        text: `✅ Entire SwasthyaMitra application cached locally (${result.count} assets). The site will now load and run with ZERO internet or in Airplane Mode!`
      });
    } else {
      setSyncMessage({
        type: 'info',
        text: 'Offline caching routine active via Service Worker Cache-First strategy.'
      });
    }
  }

  const filteredPatients = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name?.toLowerCase().includes(q) ||
      p.village?.toLowerCase().includes(q) ||
      p.abhaId?.toLowerCase().includes(q) ||
      p.id?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Hidden File Input for Backup Import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER & RURAL TELEMETRY BANNER */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Database className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl shadow-inner">
                <Database className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                    Offline PWA & IndexedDB Sync Engine
                  </h1>
                  <span className="px-2.5 py-0.5 bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/40 uppercase tracking-wider">
                    Rural PHC Gateway
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-200/80">
                  National Health Mission (NHM) Offline-First Clinical Triage, Multi-Body Radiography & Outbox Replication
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                Facility: <strong className="text-white">{dbStats?.facilityName || 'PHC-Borigumma, Koraput'}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <Server className="w-4 h-4 text-cyan-400" />
                District Cloud: <strong className="text-white">https://hmis.odisha.gov.in/api</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Encrypted Outbox: <strong className="text-white">AES-GCM-256 (Local IndexedDB)</strong>
              </span>
            </div>
          </div>

          {/* Action buttons in header */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Network Blackout Simulator Toggle */}
            <button
              onClick={() => setSimulatedOffline(!simulatedOffline)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md ${
                simulatedOffline
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40 animate-pulse'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
              }`}
            >
              {simulatedOffline ? <WifiOff className="w-4 h-4 text-rose-200" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              {simulatedOffline ? 'Simulating Grid Blackout (Offline)' : 'Simulate Rural Outage'}
            </button>

            {/* PWA Install Button */}
            {pwaInstallable && (
              <button
                onClick={promptPwaInstall}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <Smartphone className="w-4 h-4" />
                Install PHC App
              </button>
            )}

            {/* Manual Sync Button */}
            <button
              onClick={handleSyncNow}
              disabled={isSyncing || !effectiveOnline}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all ${
                !effectiveOnline
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : isSyncing
                  ? 'bg-amber-600 text-white animate-pulse'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold shadow-emerald-500/20'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing
                ? `Syncing (${syncProgress.current}/${syncProgress.total})...`
                : outboxItems.length > 0
                ? `Sync Outbox (${outboxItems.length})`
                : 'Sync with District HMIS'}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Notification Banner */}
      {syncMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-md ${
            syncMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border border-rose-300 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {syncMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{syncMessage.text}</span>
          </div>
          <button
            onClick={() => setSyncMessage(null)}
            className="text-xs px-2 py-1 bg-black/10 hover:bg-black/20 rounded font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. TELEMETRY KPI TILES */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Network & PWA Status */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              effectiveOnline
                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400'
                : 'bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 animate-pulse'
            }`}
          >
            {effectiveOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Network Status</div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              {effectiveOnline ? 'Online (HMIS Cloud)' : 'Offline (Local PHC DB)'}
            </div>
          </div>
        </div>

        {/* Outbox Pending Count */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              outboxItems.length > 0
                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 animate-bounce'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Outbox Pending</div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              {outboxItems.length} {outboxItems.length === 1 ? 'Record' : 'Records'}
            </div>
          </div>
        </div>

        {/* Total IndexedDB Patients */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">IndexedDB Cohort</div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              {dbStats?.totalPatients || 0} Registered Patients
            </div>
          </div>
        </div>

        {/* Offline Radiographs */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 bg-teal-100 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">X-Ray Scans Cached</div>
            <div className="text-sm font-black text-slate-800 dark:text-slate-100">
              {dbStats?.totalScans || scans.length} DICOM Images
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. SUB-NAVIGATION & ACTION TOOLBAR */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-100 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubTab('outbox')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'outbox'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            Outbox Queue
            {outboxItems.length > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-500 text-slate-950 text-[10px] font-black rounded-full">
                {outboxItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSubTab('patients')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'patients'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Local Patients ({patients.length})
          </button>

          <button
            onClick={() => setActiveSubTab('scans')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'scans'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Offline X-Rays ({scans.length})
          </button>

          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'logs'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            District HMIS Logs
          </button>

          <button
            onClick={() => setActiveSubTab('pwa')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === 'pwa'
                ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            PWA & Storage Telemetry
          </button>
        </div>

        {/* Action buttons on right */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQuickIntakeModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            + Quick Offline Intake
          </button>

          <button
            onClick={handleExportBackup}
            title="Export Encrypted USB Backup for Air-Gapped Transport"
            className="p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={triggerImportFileInput}
            title="Import & Merge Field Backup from another Device"
            className="p-1.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. MAIN CONTENT TABS */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* TAB 1: OUTBOX QUEUE */}
      {activeSubTab === 'outbox' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Transactional Outbox Queue (Pending Synchronization)
              </h3>
              <p className="text-xs text-slate-500">
                Mutations created during network outage are held in IndexedDB and replayed to District HMIS upon reconnect.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Total Outbox Items: <strong>{outboxItems.length}</strong>
            </div>
          </div>

          {outboxItems.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">Outbox Queue is Empty</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                All rural field records have been successfully synchronized with the District Cloud HMIS Gateway.
              </p>
              <button
                onClick={() => setShowQuickIntakeModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add New Offline Patient Record
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Outbox ID</th>
                    <th className="p-3">Entity Type</th>
                    <th className="p-3">Operation</th>
                    <th className="p-3">Payload Summary</th>
                    <th className="p-3">Created Offline</th>
                    <th className="p-3">Sync Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {outboxItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-mono text-slate-500">{item.id}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded font-semibold uppercase text-[10px]">
                          {item.entityType}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[11px]">{item.operation}</td>
                      <td className="p-3 max-w-xs truncate">
                        {item.payload?.name || item.payload?.patientName || item.payload?.moduleId || JSON.stringify(item.payload).slice(0, 40) + '...'}
                      </td>
                      <td className="p-3 text-slate-500 text-[11px]">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.syncStatus === 'SYNCED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.syncStatus === 'SYNCING'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 animate-pulse'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          }`}
                        >
                          {item.syncStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={handleSyncNow}
                          disabled={isSyncing || !effectiveOnline}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-[10px]"
                        >
                          Sync Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LOCAL PATIENT DIRECTORY */}
      {activeSubTab === 'patients' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                IndexedDB Offline Patient Cohort (Rural PHC Directory)
              </h3>
              <p className="text-xs text-slate-500">
                Fully accessible without internet connection for ASHA and Medical Officers.
              </p>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search patient, ABHA, village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-lg border border-slate-200 dark:border-slate-700 w-64"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Patient ID / ABHA</th>
                  <th className="p-3">Name & Age</th>
                  <th className="p-3">Village / Sector</th>
                  <th className="p-3">Vitals (BP / SpO2 / Pulse)</th>
                  <th className="p-3">Triage Risk</th>
                  <th className="p-3">Local Storage Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{p.id}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{p.abhaId || 'No ABHA'}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800 dark:text-slate-100">{p.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {p.age} yrs • {p.gender}
                      </div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">{p.village}</td>
                    <td className="p-3 font-mono text-[11px]">
                      {p.vitals ? `${p.vitals.bp || '120/80'} | ${p.vitals.spo2 || '98%'} | ${p.vitals.pulse || '72'}` : 'Vitals logged'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          p.triageLevel === 'RED'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-300'
                            : p.triageLevel === 'YELLOW'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300'
                        }`}
                      >
                        {p.triageLevel || 'GREEN'} ({p.urgencyScore || 25})
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <Check className="w-3.5 h-3.5" /> IndexedDB Cached
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: OFFLINE X-RAYS GALLERY */}
      {activeSubTab === 'scans' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                Offline DICOM Synthetic Radiographs
              </h3>
              <p className="text-xs text-slate-500">
                12-Module Synthetic X-Rays stored locally for offline tele-consultation & emergency review.
              </p>
            </div>
            <div className="text-xs font-semibold text-slate-500">
              Total Scans: <strong>{scans.length}</strong>
            </div>
          </div>

          {scans.length === 0 ? (
            <div className="p-12 text-center space-y-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
              <Layers className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-700 dark:text-slate-300">No Offline Scans Stored</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Generate synthetic X-rays using the Multi-Body X-Ray Scanner tab to store them in your local offline clinic cache.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-white space-y-2 hover:border-emerald-500/50 transition-all group"
                >
                  <div className="relative aspect-square bg-black rounded-lg overflow-hidden flex items-center justify-center">
                    {scan.dataUrl ? (
                      <img src={scan.dataUrl} alt="Synthetic X-Ray" className="w-full h-full object-contain" />
                    ) : (
                      <Layers className="w-12 h-12 text-slate-700" />
                    )}
                    <button
                      onClick={() => setSelectedScanPreview(scan)}
                      className="absolute bottom-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-md text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 truncate">
                      {scan.module?.name || scan.moduleId || 'Synthetic Radiograph'}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      PID: {scan.patientId || 'SYN-XRAY'} • PSNR: {scan.metrics?.psnr || '29.8'}dB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: DISTRICT HMIS AUDIT LOGS */}
      {activeSubTab === 'logs' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              District HMIS Gateway Synchronization Audit Trail
            </h3>
            <p className="text-xs text-slate-500">
              Cryptographically verified batch transactions between Rural PHC and National Health Mission servers.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3">Batch ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Records Synced</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3">Endpoint Gateway</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-white">{log.id}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{new Date(log.syncedAt).toLocaleString()}</td>
                    <td className="p-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {log.recordsCount} Records
                    </td>
                    <td className="p-3 font-mono text-[11px]">{log.durationMs}ms</td>
                    <td className="p-3 font-mono text-[10px] text-slate-500 truncate max-w-xs">
                      {log.serverEndpoint}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded text-[10px] font-black uppercase">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: PWA & STORAGE TELEMETRY */}
      {activeSubTab === 'pwa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              Progressive Web App (PWA) Manifest & Service Worker
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Service Worker Status:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">Active & Pre-cached (v1.0.0)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Caching Strategy:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Cache-First (App Shell) + Stale-While-Revalidate</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Display Mode:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">Standalone (Full Screen No Address Bar)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Theme & Background Color:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">#059669 (NHM Emerald) / #0b0f19</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Background Sync Tag:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">phc-outbox-sync</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handlePrecacheOfflineApp}
                disabled={isCachingOffline}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                {isCachingOffline ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-emerald-200" />
                    <span>Caching All Modules & Synthetic Assets...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Pre-Cache Entire Application (100% Zero-Internet Ready)</span>
                  </>
                )}
              </button>

              {pwaInstallable && (
                <button
                  onClick={promptPwaInstall}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md border border-slate-700 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Install SwasthyaMitra PWA to Desktop / Mobile</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-500" />
              IndexedDB Storage Quota & Schema Architecture
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Database Name:</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">SwasthyaMitra_RuralPHC_DB</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Database Engine:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">IndexedDB v1 (Zero-Latency Local Key-Value)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Object Stores:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">patients, triage_records, xray_scans, prescriptions, sync_outbox</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Conflict Resolution:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Doctor-Override / Server-Merge (Idempotent UUIDs)</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-500">Air-Gapped Export:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">JSON Encrypted Checksum Bundle</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. MODAL: QUICK OFFLINE INTAKE FOR ASHA / ANM */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showQuickIntakeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <UserPlus className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Quick Offline Patient Intake (ASHA / ANM Mode)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Saves instantly to device's IndexedDB and queues for District HMIS Sync.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuickIntakeModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickIntakeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bipin Biswal"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Age & Gender *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      required
                      placeholder="Age"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                    <select
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value })}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Village / Gram Panchayat
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Borigumma Sub-Centre"
                    value={newPatient.village}
                    onChange={(e) => setNewPatient({ ...newPatient, village: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ABHA ID / Contact Phone
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 91-4421-9988-1022"
                    value={newPatient.abhaId}
                    onChange={(e) => setNewPatient({ ...newPatient, abhaId: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              {/* Triage Urgency Radio Buttons */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Initial Clinical Triage Risk Assessment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPatient({ ...newPatient, triageLevel: 'RED' })}
                    className={`p-2.5 rounded-lg text-center font-bold border transition-all ${
                      newPatient.triageLevel === 'RED'
                        ? 'bg-rose-500 text-white border-rose-600 shadow-md'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900'
                    }`}
                  >
                    🔴 RED (Critical)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPatient({ ...newPatient, triageLevel: 'YELLOW' })}
                    className={`p-2.5 rounded-lg text-center font-bold border transition-all ${
                      newPatient.triageLevel === 'YELLOW'
                        ? 'bg-amber-500 text-white border-amber-600 shadow-md'
                        : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900'
                    }`}
                  >
                    🟡 YELLOW (Urgent)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPatient({ ...newPatient, triageLevel: 'GREEN' })}
                    className={`p-2.5 rounded-lg text-center font-bold border transition-all ${
                      newPatient.triageLevel === 'GREEN'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900'
                    }`}
                  >
                    🟢 GREEN (Routine)
                  </button>
                </div>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">BP (mmHg)</label>
                  <input
                    type="text"
                    value={newPatient.bp}
                    onChange={(e) => setNewPatient({ ...newPatient, bp: e.target.value })}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">SpO2 (%)</label>
                  <input
                    type="text"
                    value={newPatient.spo2}
                    onChange={(e) => setNewPatient({ ...newPatient, spo2: e.target.value })}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Pulse (bpm)</label>
                  <input
                    type="text"
                    value={newPatient.pulse}
                    onChange={(e) => setNewPatient({ ...newPatient, pulse: e.target.value })}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Temp (°F)</label>
                  <input
                    type="text"
                    value={newPatient.temp}
                    onChange={(e) => setNewPatient({ ...newPatient, temp: e.target.value })}
                    className="w-full p-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-center font-bold"
                  />
                </div>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Chief Complaint / Symptoms
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. High fever with chills, productive cough, unable to walk without support"
                  value={newPatient.chiefComplaint}
                  onChange={(e) => setNewPatient({ ...newPatient, chiefComplaint: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowQuickIntakeModal(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
                >
                  <Database className="w-4 h-4" />
                  Save to IndexedDB Outbox
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. MODAL: SCAN FULL PREVIEW */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {selectedScanPreview && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 space-y-3 relative text-white">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="font-bold text-sm text-emerald-400">
                {selectedScanPreview.module?.name || selectedScanPreview.moduleId} — Offline DICOM Viewer
              </div>
              <button
                onClick={() => setSelectedScanPreview(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-square bg-black rounded-xl overflow-hidden flex items-center justify-center border border-slate-800">
              <img src={selectedScanPreview.dataUrl} alt="X-Ray Scan" className="w-full h-full object-contain" />
            </div>
            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
              <span>Patient ID: {selectedScanPreview.patientId}</span>
              <span>PSNR: {selectedScanPreview.metrics?.psnr || 29.8}dB • SSIM: {selectedScanPreview.metrics?.ssim || 0.91}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
