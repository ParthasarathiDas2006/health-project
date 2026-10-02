import React, { useState, useEffect } from 'react';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Server,
  Save,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Flame,
  UploadCloud,
  X
} from 'lucide-react';
import {
  getStoredFirebaseConfig,
  saveFirebaseConfig,
  clearFirebaseConfig,
  testFirebaseConnection,
  isFirebaseConfigured
} from '../config/firebase';
import { syncAllLocalDataToFirestore, FIRESTORE_COLLECTIONS } from '../services/firebaseDb';

export default function FirebaseConfigModal({ isOpen, onClose, onConfigSaved }) {
  const [config, setConfig] = useState(() => {
    const existing = getStoredFirebaseConfig();
    return {
      apiKey: existing?.apiKey || 'AIzaSyDM7KYsOQ1o-NSCbJHb9lzC0YHNeEcE29A',
      authDomain: existing?.authDomain || 'swasthya-mitra-48b58.firebaseapp.com',
      projectId: existing?.projectId || 'swasthya-mitra-48b58',
      storageBucket: existing?.storageBucket || 'swasthya-mitra-48b58.appspot.com',
      messagingSenderId: existing?.messagingSenderId || '395410615396',
      appId: existing?.appId || '1:395410615396:web:ababcd25af50370de24371'
    };
  });

  const [rawSnippet, setRawSnippet] = useState('');
  const [testingStatus, setTestingStatus] = useState(null); // 'testing' | 'success' | 'error'
  const [testMessage, setTestMessage] = useState('');
  const [syncStatus, setSyncStatus] = useState(null); // 'syncing' | 'success' | 'error'
  const [syncMessage, setSyncMessage] = useState('');
  const [copiedEnv, setCopiedEnv] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('fields'); // 'fields' | 'paste'

  // Load existing config on open
  useEffect(() => {
    if (isOpen) {
      const existing = getStoredFirebaseConfig();
      setConfig({
        apiKey: existing?.apiKey || 'AIzaSyDM7KYsOQ1o-NSCbJHb9lzC0YHNeEcE29A',
        authDomain: existing?.authDomain || 'swasthya-mitra-48b58.firebaseapp.com',
        projectId: existing?.projectId || 'swasthya-mitra-48b58',
        storageBucket: existing?.storageBucket || 'swasthya-mitra-48b58.appspot.com',
        messagingSenderId: existing?.messagingSenderId || '395410615396',
        appId: existing?.appId || '1:395410615396:web:ababcd25af50370de24371'
      });
      setTestingStatus(null);
      setTestMessage('');
      setSyncStatus(null);
      setSyncMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Parse raw JS snippet from Firebase Console
  const handleParseSnippet = () => {
    try {
      const text = rawSnippet;
      const getVal = (key) => {
        const regex = new RegExp(`${key}\\s*:\\s*["']([^"']+)["']`, 'i');
        const match = text.match(regex);
        return match ? match[1] : '';
      };

      const extracted = {
        apiKey: getVal('apiKey'),
        authDomain: getVal('authDomain'),
        projectId: getVal('projectId'),
        storageBucket: getVal('storageBucket'),
        messagingSenderId: getVal('messagingSenderId'),
        appId: getVal('appId')
      };

      if (!extracted.projectId && !extracted.apiKey) {
        setTestMessage('Could not extract Firebase keys. Please ensure you pasted the firebaseConfig block.');
        setTestingStatus('error');
        return;
      }

      setConfig((prev) => ({
        ...prev,
        ...extracted
      }));
      setActiveTab('fields');
      setTestMessage('Successfully parsed Firebase credentials! Click "Test Connection" or "Save & Connect".');
      setTestingStatus('success');
    } catch (err) {
      setTestMessage('Failed to parse snippet: ' + err.message);
      setTestingStatus('error');
    }
  };

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setTestMessage('Contacting Firebase Cloud Firestore...');
    const result = await testFirebaseConnection(config);

    if (result.success) {
      setTestingStatus('success');
      setTestMessage(result.message);
    } else {
      setTestingStatus('error');
      setTestMessage(result.message);
    }
  };

  const handleSave = () => {
    try {
      if (!config.projectId || !config.apiKey) {
        setTestingStatus('error');
        setTestMessage('Project ID and API Key are required.');
        return;
      }

      saveFirebaseConfig(config);
      setTestingStatus('success');
      setTestMessage(`Firebase configured successfully for project "${config.projectId}"!`);

      if (onConfigSaved) onConfigSaved(config);
    } catch (err) {
      setTestingStatus('error');
      setTestMessage(err.message);
    }
  };

  const handleClear = () => {
    clearFirebaseConfig();
    setConfig({
      apiKey: '',
      authDomain: '',
      projectId: '',
      storageBucket: '',
      messagingSenderId: '',
      appId: ''
    });
    setTestingStatus(null);
    setTestMessage('Firebase configuration removed. Using local storage fallback.');
    if (onConfigSaved) onConfigSaved(null);
  };

  const handleSyncData = async () => {
    setSyncStatus('syncing');
    setSyncMessage('Uploading local records to Cloud Firestore...');

    const res = await syncAllLocalDataToFirestore();
    if (res.success) {
      setSyncStatus('success');
      setSyncMessage('Successfully synced local records to Cloud Firestore collections!');
    } else {
      setSyncStatus('error');
      setSyncMessage(res.message || 'Sync failed.');
    }
  };

  const envFileContent = `# SwasthyaMitra Firebase Configuration (.env)
VITE_FIREBASE_API_KEY=${config.apiKey || 'your_api_key_here'}
VITE_FIREBASE_AUTH_DOMAIN=${config.authDomain || (config.projectId ? `${config.projectId}.firebaseapp.com` : 'your_project.firebaseapp.com')}
VITE_FIREBASE_PROJECT_ID=${config.projectId || 'your_project_id'}
VITE_FIREBASE_STORAGE_BUCKET=${config.storageBucket || (config.projectId ? `${config.projectId}.appspot.com` : 'your_project.appspot.com')}
VITE_FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId || ''}
VITE_FIREBASE_APP_ID=${config.appId || ''}
`;

  const copyEnvToClipboard = () => {
    navigator.clipboard.writeText(envFileContent);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2500);
  };

  const isConnected = isFirebaseConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 flex items-center justify-center border border-amber-300">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Firebase Cloud Firestore Setup</h2>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Connected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    Setup Required
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Link SwasthyaMitra data to Google Cloud Firestore (Users, Appointments, Beds, Ambulance, Blood Bank)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Quick Guide Toggle */}
          <div className="border border-blue-200 bg-blue-50/70 rounded-xl p-3.5">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-blue-900 hover:text-blue-950"
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>How to get your Firebase Credentials (5 quick steps)</span>
              </div>
              {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showGuide && (
              <div className="mt-3 text-xs text-blue-950 space-y-2 border-t border-blue-200 pt-2.5">
                <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed">
                  <li>
                    Go to{' '}
                    <a
                      href="https://console.firebase.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold underline text-blue-700 inline-flex items-center gap-1"
                    >
                      Firebase Console <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and click <strong>Add project</strong> (e.g. <code>swasthya-mitra</code>).
                  </li>
                  <li>
                    In the left sidebar, click <strong>Build &gt; Firestore Database</strong> &rarr; click{' '}
                    <strong>Create database</strong>.
                  </li>
                  <li>
                    Choose <strong>Start in test mode</strong> (or allow read/write rules) and select your nearest
                    region (e.g. <code>asia-south1 / Mumbai</code>).
                  </li>
                  <li>
                    Click the <strong>Project Settings ⚙️</strong> gear icon at the top of the sidebar &rarr; under{' '}
                    <em>Your apps</em>, click the Web icon <code>&lt;/&gt;</code> &rarr; register app.
                  </li>
                  <li>
                    Copy the <code>firebaseConfig</code> object and paste it below in the <strong>Paste Config</strong>{' '}
                    tab!
                  </li>
                </ol>
              </div>
            )}
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('fields')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === 'fields'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Form Fields
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'paste'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Copy className="w-3 h-3" />
              Paste Config Object
            </button>
          </div>

          {/* TAB 1: FORM FIELDS */}
          {activeTab === 'fields' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. swasthya-mitra-108"
                  value={config.projectId}
                  onChange={(e) => handleInputChange('projectId', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  API Key <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIzaSyB2e9u..."
                  value={config.apiKey}
                  onChange={(e) => handleInputChange('apiKey', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  placeholder="e.g. swasthya-mitra.firebaseapp.com"
                  value={config.authDomain}
                  onChange={(e) => handleInputChange('authDomain', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  placeholder="e.g. swasthya-mitra.appspot.com"
                  value={config.storageBucket}
                  onChange={(e) => handleInputChange('storageBucket', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Messaging Sender ID</label>
                <input
                  type="text"
                  placeholder="e.g. 104582910482"
                  value={config.messagingSenderId}
                  onChange={(e) => handleInputChange('messagingSenderId', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">App ID</label>
                <input
                  type="text"
                  placeholder="e.g. 1:104582910482:web:a9c..."
                  value={config.appId}
                  onChange={(e) => handleInputChange('appId', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 2: PASTE SNIPPET */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Paste the <code>firebaseConfig</code> code snippet from Firebase Console:
              </label>
              <textarea
                rows={6}
                value={rawSnippet}
                onChange={(e) => setRawSnippet(e.target.value)}
                placeholder={`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "swasthya-mitra.firebaseapp.com",
  projectId: "swasthya-mitra",
  storageBucket: "swasthya-mitra.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};`}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50"
              />
              <button
                type="button"
                onClick={handleParseSnippet}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                Parse & Populate Credentials
              </button>
            </div>
          )}

          {/* Feedback message banner */}
          {testMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testingStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : testingStatus === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-blue-50 border-blue-200 text-blue-900'
              }`}
            >
              {testingStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {testingStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {testingStatus === 'testing' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{testMessage}</span>
            </div>
          )}

          {syncMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                syncStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : syncStatus === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {syncStatus === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />}
              {syncStatus === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
              {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 text-amber-600 animate-spin shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{syncMessage}</span>
            </div>
          )}

          {/* Synced Collections Overview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-amber-600" />
                Active Cloud Firestore Collections ({Object.keys(FIRESTORE_COLLECTIONS).length}):
              </span>
              <button
                type="button"
                onClick={handleSyncData}
                disabled={syncStatus === 'syncing' || !config.projectId}
                className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-md transition-colors flex items-center gap-1 shadow-xs"
              >
                <UploadCloud className="w-3 h-3" />
                Push Local Data to Firestore
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              {Object.entries(FIRESTORE_COLLECTIONS).map(([key, name]) => (
                <span key={key} className="px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-600 font-mono">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Reset Config
            </button>
            <button
              type="button"
              onClick={copyEnvToClipboard}
              className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1"
              title="Copy .env file configuration"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedEnv ? 'Copied .env!' : 'Copy .env'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingStatus === 'testing' || !config.projectId || !config.apiKey}
              className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-50 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testingStatus === 'testing' ? 'animate-spin text-amber-600' : ''}`} />
              Test Connection
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Save & Connect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
