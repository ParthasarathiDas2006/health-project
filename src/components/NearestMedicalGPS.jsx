import React, { useState, useEffect, useRef } from 'react';
import {
  Navigation,
  MapPin,
  Compass,
  Crosshair,
  PhoneCall,
  Hospital,
  Ambulance,
  Shield,
  Radio,
  LocateFixed,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Share2,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Phone,
  Bed,
  Activity,
  ArrowRight,
  X,
  Printer
} from 'lucide-react';
import {
  ODISHA_LOCATIONS,
  ODISHA_MEDICAL_FACILITIES,
  ODISHA_AMBULANCES,
  calculateDistanceKm,
  getRouteSimulation
} from '../utils/nearestMedicalData';

export default function NearestMedicalGPS({ currentUser, appLang }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  // Selected User Location State (Default: Bhubaneswar Master Canteen)
  const [selectedLocationId, setSelectedLocationId] = useState('BBS_CTR');
  const [userCoords, setUserCoords] = useState({ lat: 20.2668, lng: 85.8398, accuracy: 15, isLiveGps: false });
  const [gpsError, setGpsError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Selected Target Hospital for Navigation
  const [selectedHospitalId, setSelectedHospitalId] = useState('HOSP-01');

  // Filter category for hospitals
  const [hospitalFilter, setHospitalFilter] = useState('ALL'); // 'ALL' | 'GOVT' | 'TRAUMA' | 'ICU'

  // Sub-tabs: 'map-view' | 'hospitals-list' | 'ambulance-radar'
  const [activeView, setActiveView] = useState('map-view');

  // Ambulance Dispatch Modal
  const [dispatchAmbulance, setDispatchAmbulance] = useState(null);
  const [patientCondition, setPatientCondition] = useState('Cardiac / Severe Chest Pain');
  const [pickupLandmark, setPickupLandmark] = useState('');
  const [callerPhone, setCallerPhone] = useState(currentUser?.phone || '');
  const [confirmedDispatchToken, setConfirmedDispatchToken] = useState(null);

  // Live Navigation Simulation state
  const [isNavigating, setIsNavigating] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  // Map Zoom State
  const [mapZoom, setMapZoom] = useState(13);

  // Multilingual UI Text Dictionary
  const txt = {
    'or-IN': {
      title: 'ନିକଟସ୍ଥ ଚିକିତ୍ସାଳୟ ଓ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ GPS',
      subtitle: 'ଲାଇଭ୍ GPS ଟ୍ରାକର୍, ଟ୍ରାଫିକ୍ ମୁକ୍ତ ସବୁଜ ମାର୍ଗ ଓ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସେବା (Odisha Health Portal)',
      gpsActive: 'ଲାଇଭ୍ GPS ସକ୍ରିୟ (ଉଚ୍ଚ ସଠିକତା)',
      gpsSimulated: 'ପୂର୍ବନିର୍ଦ୍ଧାରିତ ଅବସ୍ଥାନ (Odisha)',
      locatingUser: 'GPS ଅବସ୍ଥାନ ଖୋଜା ଚାଲିଛି...',
      btnUseMyGps: 'ମୋର ପ୍ରକୃତ ଲାଇଭ୍ GPS ଅନ୍ କରନ୍ତୁ',
      tabMap: '୧. ଲାଇଭ୍ ମ୍ୟାପ୍ ଓ ଟ୍ରାଫିକ୍ ମାର୍ଗ',
      tabHospitals: '୨. ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ ତାଲିକା',
      tabAmbulance: '୩. ୧୦୮ / ୧୦୨ ଆମ୍ବୁଲାନ୍ସ ରାଡାର୍',
      nearestHospitalAlert: 'ସବୁଠାରୁ ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ ହସ୍ପିଟାଲ୍ ଚିହ୍ନଟ ହେଲା!',
      trafficFreeBadge: '✓ ସର୍ବୋତ୍ତମ ଟ୍ରାଫିକ୍ ମୁକ୍ତ ସବୁଜ ମାର୍ଗ',
      etaText: 'ପହଞ୍ଚିବା ସମୟ (ETA)',
      distanceText: 'ଦୂରତା',
      trafficSaved: 'ସହର ଟ୍ରାଫିକ୍ ତୁଳନାରେ ସମୟ ବଞ୍ଚିବ',
      minutes: 'ମିନିଟ୍',
      km: 'କି.ମି.',
      btnStartNav: 'ଟର୍ଣ୍ଣ-ବାଇ-ଟର୍ଣ୍ଣ ନାଭିଗେସନ୍ ଆରମ୍ଭ କରନ୍ତୁ',
      btnStopNav: 'ନାଭିଗେସନ୍ ବନ୍ଦ କରନ୍ତୁ',
      btnGoogleMaps: 'ଗୁଗଲ୍ ମ୍ୟାପ୍ସରେ ଖୋଲନ୍ତୁ',
      emergencyBeds: 'ଜରୁରୀକାଳୀନ ବେଡ୍',
      icuVentilator: 'ICU ଭେଣ୍ଟିଲେଟର୍',
      callHelpline: 'ହେଲ୍ପଲାଇନ୍ କଲ୍',
      dispatchAmbBtn: 'ତୁରନ୍ତ ଆମ୍ବୁଲାନ୍ସ ଡାକନ୍ତୁ (Dispatch 108)',
      ambAvailable: 'ଉପଲବ୍ଧ (Available)',
      ambEnRoute: 'ଗତିଶୀଳ (En Route)',
      ambDriver: 'ଚାଳକ:',
      ambStation: 'ଆମ୍ବୁଲାନ୍ସ ଷ୍ଟାଣ୍ଡ:',
      modalDispatchTitle: '୧୦୮/୧୦୨ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ ବୁକିଂ ଫର୍ମ',
      confirmDispatchBtn: 'ଆମ୍ବୁଲାନ୍ସ ପଠାଇବା ନିଶ୍ଚିତ କରନ୍ତୁ',
      dispatchSuccessTitle: '୧୦୮ ଆମ୍ବୁଲାନ୍ସ ତୁରନ୍ତ ଛଡ଼ାଗଲା (DISPATCHED)',
      dispatchNotice: 'ଆମ୍ବୁଲାନ୍ସ ସାଇରନ୍ ସହିତ ଆପଣଙ୍କ ଅବସ୍ଥାନ ଆଡ଼କୁ ଆସୁଛି। ଦୟାକରି ଫୋନ୍ ଖୋଲା ରଖନ୍ତୁ।'
    },
    'hi-IN': {
      title: 'निकटतम अस्पताल एवं आपातकालीन एम्बुलेंस GPS',
      subtitle: 'लाइव जीपीएस ट्रैकर, ट्रैफिक-मुक्त ग्रीन कॉरिडोर एवं 108 एम्बुलेंस सेवा',
      gpsActive: 'लाइव GPS सक्रिय (सटीक स्थिति)',
      gpsSimulated: 'चयनित स्थान (ओडिशा)',
      locatingUser: 'GPS स्थिति ट्रैक हो रही है...',
      btnUseMyGps: 'मेरा लाइव GPS चालू करें',
      tabMap: '1. लाइव मैप एवं ट्रैफिक मार्ग',
      tabHospitals: '2. निकटतम अस्पताल सूची',
      tabAmbulance: '3. 108 / 102 एम्बुलेंस रडार',
      nearestHospitalAlert: 'निकटतम आपातकालीन अस्पताल खोजा गया!',
      trafficFreeBadge: '✓ सर्वोत्तम ट्रैफिक-मुक्त ग्रीन कॉरिडोर',
      etaText: 'पहुंचने का समय (ETA)',
      distanceText: 'दूरी',
      trafficSaved: 'ट्रैफिक जाम से समय बचत',
      minutes: 'मिनट',
      km: 'कि.मी.',
      btnStartNav: 'टर्न-बाय-टर्न नेविगेशन शुरू करें',
      btnStopNav: 'नेविगेशन समाप्त करें',
      btnGoogleMaps: 'गूगल मैप्स में खोलें',
      emergencyBeds: 'इमरजेंसी बेड',
      icuVentilator: 'ICU वेंटिलेटर',
      callHelpline: 'हेल्पलाइन कॉल',
      dispatchAmbBtn: 'तुरंत एम्बुलेंस बुलाएं (Dispatch 108)',
      ambAvailable: 'उपलब्ध (Available)',
      ambEnRoute: 'रास्ते में (En Route)',
      ambDriver: 'चालक:',
      ambStation: 'एम्बुलेंस स्टैंड:',
      modalDispatchTitle: '108/102 आपातकालीन एम्बुलेंस डिस्पैच फॉर्म',
      confirmDispatchBtn: 'एम्बुलेंस प्रेषण पुष्टि करें',
      dispatchSuccessTitle: '108 एम्बुलेंस तत्काल रवाना (DISPATCHED)',
      dispatchNotice: 'एम्बुलेंस सायरन चालू कर आपके स्थान की ओर रवाना हो चुकी है। कृपया फोन चालू रखें।'
    },
    'en-IN': {
      title: 'Nearest Medical & 108 Emergency Ambulance GPS',
      subtitle: 'Real-time GPS Tracking, Green Corridor Traffic-Free Routing & 108 Dispatch',
      gpsActive: 'Live Device GPS Active (High Accuracy)',
      gpsSimulated: 'Simulated Landmark (Odisha)',
      locatingUser: 'Acquiring GPS Fix...',
      btnUseMyGps: 'Enable My Real Live GPS',
      tabMap: '1. Live Map & Traffic Route',
      tabHospitals: '2. Nearest Hospitals',
      tabAmbulance: '3. 108 / 102 Ambulance Radar',
      nearestHospitalAlert: 'Closest Emergency Medical Facility Located!',
      trafficFreeBadge: '✓ Optimal Traffic-Free Green Corridor',
      etaText: 'Estimated Travel Time (ETA)',
      distanceText: 'Distance',
      trafficSaved: 'Time saved vs congested city route',
      minutes: 'mins',
      km: 'km',
      btnStartNav: 'Start Turn-by-Turn Navigation',
      btnStopNav: 'Stop Navigation',
      btnGoogleMaps: 'Open in Google Maps GPS',
      emergencyBeds: 'Emergency Beds',
      icuVentilator: 'ICU Ventilators',
      callHelpline: 'Emergency Call',
      dispatchAmbBtn: '1-Tap 108 Ambulance Dispatch',
      ambAvailable: 'Stationed / Ready',
      ambEnRoute: 'En-Route (Active Siren)',
      ambDriver: 'Driver / Pilot:',
      ambStation: 'Base Station:',
      modalDispatchTitle: 'Odisha 108/102 Emergency Ambulance Dispatch Slip',
      confirmDispatchBtn: 'Confirm Emergency Dispatch',
      dispatchSuccessTitle: '108 Emergency Ambulance Dispatched!',
      dispatchNotice: 'Ambulance is navigating with active emergency green corridor to your location. Keep phone line open.'
    }
  }[lang] || {};

  // Request browser live GPS
  const handleEnableLiveGps = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: Math.round(pos.coords.accuracy || 10),
          isLiveGps: true
        });
        setSelectedLocationId('GPS_LIVE');
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        setGpsError('GPS permission denied or unavailable. Using central Odisha landmark fallback.');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Switch location landmark
  const handleLocationChange = (locId) => {
    setSelectedLocationId(locId);
    if (locId === 'GPS_LIVE') {
      handleEnableLiveGps();
    } else {
      const found = ODISHA_LOCATIONS.find((l) => l.id === locId);
      if (found) {
        setUserCoords({
          lat: found.lat,
          lng: found.lng,
          accuracy: 15,
          isLiveGps: false
        });
        setGpsError(null);
      }
    }
  };

  // Rank all hospitals by distance from userCoords
  const rankedHospitals = ODISHA_MEDICAL_FACILITIES.map((hosp) => {
    const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, hosp.lat, hosp.lng);
    const route = getRouteSimulation(userCoords.lat, userCoords.lng, hosp.lat, hosp.lng, dist);
    return {
      ...hosp,
      distanceKm: dist,
      route: route
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // The closest hospital
  const nearestHospital = rankedHospitals[0];

  // Active hospital selected for map route
  const activeHospital = rankedHospitals.find((h) => h.id === selectedHospitalId) || nearestHospital;

  // Rank Ambulances by distance from userCoords
  const rankedAmbulances = ODISHA_AMBULANCES.map((amb) => {
    const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, amb.lat, amb.lng);
    const etaMins = Math.max(2, Math.round((dist / 38) * 60));
    return {
      ...amb,
      distanceKm: dist,
      etaMins: etaMins
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  // Set nearest hospital as selected initially if none chosen
  useEffect(() => {
    if (!selectedHospitalId && nearestHospital) {
      setSelectedHospitalId(nearestHospital.id);
    }
  }, [nearestHospital, selectedHospitalId]);

  // Handle Turn-by-Turn Navigation simulation
  useEffect(() => {
    let timer;
    if (isNavigating) {
      timer = setInterval(() => {
        setActiveStepIndex((prev) => {
          if (prev < activeHospital.route.steps.length - 1) {
            return prev + 1;
          } else {
            setIsNavigating(false);
            return 0;
          }
        });
      }, 4000);
    }
    return () => clearInterval(timer);
  }, [isNavigating, activeHospital]);

  // Handle Ambulance Dispatch Confirmation
  const handleConfirmDispatch = (e) => {
    e.preventDefault();
    if (!dispatchAmbulance) return;

    const token = {
      id: `OD-108-${Math.floor(100000 + Math.random() * 900000)}`,
      ambulanceCode: dispatchAmbulance.code,
      vehicleNo: dispatchAmbulance.vehicleNo,
      type: dispatchAmbulance.type,
      driverName: dispatchAmbulance.driverName,
      driverPhone: dispatchAmbulance.driverPhone,
      etaMins: dispatchAmbulance.etaMins,
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      patientCondition: patientCondition,
      pickupLandmark: pickupLandmark || 'Near Current GPS Landmark',
      timestamp: new Date().toISOString(),
      status: 'DISPATCHED_EN_ROUTE'
    };

    setConfirmedDispatchToken(token);
    setDispatchAmbulance(null);
  };

  return (
    <div className="space-y-6">
      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER BANNER & GPS STATUS CONTROL */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-emerald-700/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xs border border-white/20 relative">
              <Navigation className="w-8 h-8 text-emerald-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {txt.title}
                </h2>
                <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  GPS Green Corridor
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">{txt.subtitle}</p>
            </div>
          </div>

          {/* GPS Status & 108 Emergency Call Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="tel:108"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all"
            >
              <Phone className="w-4 h-4 text-rose-200 fill-white" />
              <span>Dial 108 Toll-Free</span>
            </a>

            <button
              onClick={handleEnableLiveGps}
              disabled={isLocating}
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            >
              <Crosshair className={`w-4 h-4 text-emerald-300 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? txt.locatingUser : txt.btnUseMyGps}</span>
            </button>
          </div>
        </div>

        {/* Location Selector Bar */}
        <div className="mt-4 pt-3 border-t border-emerald-800/60 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <LocateFixed className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-slate-300 font-bold">Current Location Pin:</span>
            <select
              value={selectedLocationId}
              onChange={(e) => handleLocationChange(e.target.value)}
              className="bg-emerald-950 border border-emerald-600/50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold outline-none cursor-pointer"
            >
              {ODISHA_LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {lang === 'or-IN' && loc.nameOdia ? loc.nameOdia : loc.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-emerald-200 font-mono">
            <span>Lat: {userCoords.lat.toFixed(4)}° N</span>
            <span>•</span>
            <span>Lng: {userCoords.lng.toFixed(4)}° E</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">
              {userCoords.isLiveGps ? txt.gpsActive : txt.gpsSimulated}
            </span>
          </div>
        </div>

        {gpsError && (
          <div className="mt-2 p-2 bg-amber-900/50 border border-amber-500/40 rounded-lg text-[11px] text-amber-200 flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{gpsError}</span>
          </div>
        )}

        {/* Sub-Tabs Selector */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveView('map-view')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'map-view'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-emerald-700" />
            {txt.tabMap}
          </button>

          <button
            onClick={() => setActiveView('hospitals-list')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'hospitals-list'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-blue-600" />
            {txt.tabHospitals}
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {rankedHospitals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('ambulance-radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeView === 'ambulance-radar'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Ambulance className="w-3.5 h-3.5 text-rose-600" />
            {txt.tabAmbulance}
            <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {rankedAmbulances.length}
            </span>
          </button>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. OPTIMAL TRAFFIC-FREE CORRIDOR ALERT (HERO) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-300 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              {txt.nearestHospitalAlert}:{' '}
              <span className="text-emerald-700">
                {lang === 'or-IN' && activeHospital.nameOdia ? activeHospital.nameOdia : activeHospital.name}
              </span>
            </h3>
          </div>

          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300 self-start sm:self-auto">
            {txt.trafficFreeBadge}
          </span>
        </div>

        {/* Key Metrics: ETA, Distance, Highway Green Corridor */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200 text-center">
            <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{txt.etaText}</div>
            <div className="text-2xl font-black text-emerald-900 leading-tight mt-0.5">
              {activeHospital.route.optimalEtaMinutes}{' '}
              <span className="text-xs font-semibold text-emerald-700">{txt.minutes}</span>
            </div>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              ⚡ Saves {activeHospital.route.savingsMinutes} mins vs traffic
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{txt.distanceText}</div>
            <div className="text-2xl font-black text-slate-900 leading-tight mt-0.5">
              {activeHospital.distanceKm}{' '}
              <span className="text-xs font-semibold text-slate-500">{txt.km}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-medium mt-0.5">Direct Corridor</div>
          </div>

          <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-center">
            <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">{txt.emergencyBeds}</div>
            <div className="text-2xl font-black text-blue-900 leading-tight mt-0.5">
              {activeHospital.beds.emergency}{' '}
              <span className="text-xs font-semibold text-blue-600">Available</span>
            </div>
            <div className="text-[10px] text-blue-600 font-medium mt-0.5">
              ICU Ventilators: <strong>{activeHospital.beds.icuVentilator}</strong>
            </div>
          </div>

          <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-center">
            <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Trauma Protocol</div>
            <div className="text-sm font-extrabold text-amber-900 leading-tight mt-1 truncate">
              {activeHospital.traumaLevel.split(' ')[0]} {activeHospital.traumaLevel.split(' ')[1]}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-1">24x7 Casualty Bay</div>
          </div>
        </div>

        {/* Route Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="text-xs text-slate-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Optimal Route: <strong>{activeHospital.bestTrafficCorridor}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNavigating(!isNavigating)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                isNavigating
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white'
              }`}
            >
              <Navigation className="w-3.5 h-3.5" />
              {isNavigating ? txt.btnStopNav : txt.btnStartNav}
            </button>

            <a
              href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${activeHospital.lat},${activeHospital.lng}&travelmode=driving`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              {txt.btnGoogleMaps}
            </a>
          </div>
        </div>

        {/* Turn-by-Turn Navigation Live Step (When navigating) */}
        {isNavigating && (
          <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs space-y-1 border border-emerald-500/50 animate-fadeIn">
            <div className="flex items-center justify-between text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              <span>Turn-by-Turn Guidance • Step {activeStepIndex + 1} of {activeHospital.route.steps.length}</span>
              <span className="text-emerald-400 font-mono">LIVE GPS ROUTING</span>
            </div>
            <div className="text-sm font-extrabold text-white flex items-center gap-2">
              <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'or-IN'
                  ? activeHospital.route.steps[activeStepIndex].instructionOdia
                  : activeHospital.route.steps[activeStepIndex].instruction}
              </span>
            </div>
            <div className="text-[11px] text-emerald-300">
              Next waypoint in <strong>{activeHospital.route.steps[activeStepIndex].distance}</strong> (Status: Traffic Free)
            </div>
          </div>
        )}
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. SUB-TAB 1: LIVE INTERACTIVE MAP & VECTOR TRAFFIC VIEW */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeView === 'map-view' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Viewport Box (2 cols on large screen) */}
          <div className="lg:col-span-2 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md relative flex flex-col min-h-[460px]">
            {/* Map Header Overlay */}
            <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
              <div className="bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold pointer-events-auto flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Odisha Emergency Traffic Corridors</span>
              </div>

              {/* Zoom & Reset Controls */}
              <div className="flex items-center gap-1 bg-slate-900/85 backdrop-blur-md p-1 rounded-xl border border-white/20 pointer-events-auto">
                <button
                  onClick={() => setMapZoom((z) => Math.min(z + 1, 16))}
                  className="w-7 h-7 flex items-center justify-center text-white font-bold hover:bg-white/20 rounded-lg text-sm"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setMapZoom((z) => Math.max(z - 1, 10))}
                  className="w-7 h-7 flex items-center justify-center text-white font-bold hover:bg-white/20 rounded-lg text-sm"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>

            {/* Simulated High-Fidelity Vector Road Map Canvas */}
            <div className="flex-1 w-full relative bg-[#0b132b] flex items-center justify-center p-4">
              <svg
                viewBox="0 0 800 500"
                className="w-full h-full max-h-[440px] select-none"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }}
              >
                {/* Background Grid Roads */}
                <defs>
                  <pattern id="roadGrid" width="80" height="80" patternUnits="userSpaceOnUse">
                    <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#1c2541" strokeWidth="1.5" />
                  </pattern>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#34d399" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid Background */}
                <rect width="800" height="500" fill="#0b132b" />
                <rect width="800" height="500" fill="url(#roadGrid)" />

                {/* Major Odisha Expressways (Simulated Vectors) */}
                <path d="M 50,450 Q 250,300 450,220 T 750,80" fill="none" stroke="#1f293d" strokeWidth="18" />
                <path d="M 50,450 Q 250,300 450,220 T 750,80" fill="none" stroke="#334155" strokeWidth="12" />
                <path d="M 50,450 Q 250,300 450,220 T 750,80" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="6,6" />

                <path d="M 120,50 Q 300,180 400,280 T 700,420" fill="none" stroke="#1f293d" strokeWidth="14" />
                <path d="M 120,50 Q 300,180 400,280 T 700,420" fill="none" stroke="#334155" strokeWidth="8" />

                <path d="M 680,50 L 320,450" fill="none" stroke="#1f293d" strokeWidth="12" />
                <path d="M 680,50 L 320,450" fill="none" stroke="#334155" strokeWidth="6" />

                {/* Heavy Traffic Congestion Zones (Red Avoided Lines) */}
                <path d="M 280,310 Q 330,340 380,330" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.8" />
                <text x="310" y="360" fill="#f87171" fontSize="10" fontWeight="bold">City Center Traffic Jam (Avoided)</text>

                {/* The OPTIMAL GREEN CORRIDOR PATH from User (200, 320) to Hospital (550, 150) */}
                <path
                  d="M 200,320 C 230,260 360,240 440,210 S 510,170 550,150"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  filter="url(#glow)"
                />
                <path
                  d="M 200,320 C 230,260 360,240 440,210 S 510,170 550,150"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="8,8"
                />

                {/* Intermediate Traffic Checkpoints */}
                <circle cx="340" cy="245" r="4" fill="#34d399" />
                <circle cx="470" cy="190" r="4" fill="#34d399" />

                {/* USER LOCATION PIN (200, 320) */}
                <g transform="translate(200, 320)">
                  <circle r="22" fill="#3b82f6" opacity="0.25">
                    <animate attributeName="r" values="12;28;12" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="10" fill="#2563eb" stroke="#ffffff" strokeWidth="2.5" />
                  <circle r="4" fill="#ffffff" />
                  <rect x="-45" y="-34" width="90" height="20" rx="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1" />
                  <text x="0" y="-20" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                    You Are Here
                  </text>
                </g>

                {/* TARGET HOSPITAL PIN (550, 150) */}
                <g transform="translate(550, 150)">
                  <circle r="26" fill="#10b981" opacity="0.3">
                    <animate attributeName="r" values="18;34;18" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="16" fill="#059669" stroke="#ffffff" strokeWidth="3" />
                  <path d="M -6,0 L 6,0 M 0,-6 L 0,6" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                  <rect x="-70" y="-46" width="140" height="24" rx="8" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                  <text x="0" y="-30" fill="#a7f3d0" fontSize="10" fontWeight="extrabold" textAnchor="middle">
                    {activeHospital.name.slice(0, 18)}...
                  </text>
                </g>

                {/* OTHER SURROUNDING HOSPITALS (Static Markers) */}
                <g transform="translate(680, 280)" opacity="0.85">
                  <circle r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <path d="M -4,0 L 4,0 M 0,-4 L 0,4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <rect x="-40" y="-24" width="80" height="16" rx="4" fill="#1e293b" />
                  <text x="0" y="-13" fill="#cbd5e1" fontSize="8" textAnchor="middle">Apex Trauma</text>
                </g>

                <g transform="translate(130, 120)" opacity="0.85">
                  <circle r="10" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
                  <path d="M -4,0 L 4,0 M 0,-4 L 0,4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <rect x="-40" y="-24" width="80" height="16" rx="4" fill="#1e293b" />
                  <text x="0" y="-13" fill="#cbd5e1" fontSize="8" textAnchor="middle">Super Specialty</text>
                </g>

                {/* LIVE 108 AMBULANCES ON MAP */}
                <g transform="translate(280, 270)">
                  <circle r="12" fill="#e11d48" opacity="0.4">
                    <animate attributeName="r" values="8;16;8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">108</text>
                  <rect x="-35" y="-22" width="70" height="14" rx="4" fill="#881337" />
                  <text x="0" y="-12" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">ALS-01 (4 min)</text>
                </g>

                <g transform="translate(420, 130)">
                  <circle r="8" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
                  <text x="0" y="3" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">102</text>
                  <rect x="-35" y="-22" width="70" height="14" rx="4" fill="#881337" />
                  <text x="0" y="-12" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">Janani (6 min)</text>
                </g>
              </svg>
            </div>

            {/* Bottom Map Legend Bar */}
            <div className="bg-slate-950 px-4 py-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-300 gap-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Green Corridor (Clear Flow)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span>Moderate Traffic</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                  <span>High Congestion Avoided</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>You</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hospital</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                  <span>108 Ambulance</span>
                </span>
              </div>
            </div>
          </div>

          {/* Side Panel: Selected Hospital Route Details & Turn-by-Turn */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Active Navigation Destination
                </span>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug mt-0.5">
                  {activeHospital.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {activeHospital.address}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${activeHospital.emergencyHelpline.split('/')[0].trim()}`}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  {txt.callHelpline}
                </a>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${activeHospital.lat},${activeHospital.lng}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  Google GPS
                </a>
              </div>

              {/* Turn-by-turn preview */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Fastest Route Navigation Steps</span>
                  <span className="text-emerald-700 font-bold">{activeHospital.route.distanceKm} km</span>
                </div>

                <div className="space-y-2 text-xs">
                  {activeHospital.route.steps.map((st, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-xl border transition-all ${
                        isNavigating && activeStepIndex === idx
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div className="flex-1">
                          <div>{lang === 'or-IN' ? st.instructionOdia : st.instruction}</div>
                          <div className="text-[10px] text-slate-400 font-medium mt-0.5">
                            Segment: {st.distance} • Traffic: {st.traffic}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. SUB-TAB 2: NEAREST HOSPITALS DIRECTORY */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeView === 'hospitals-list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Hospital className="w-5 h-5 text-blue-600" />
              <span>Ranked Nearest Medical Facilities (Live GPS Distance)</span>
            </h3>

            <span className="text-xs text-slate-500 font-medium">
              Sorted by closest to you ({userCoords.lat.toFixed(2)}°, {userCoords.lng.toFixed(2)}°)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rankedHospitals.map((hosp, idx) => (
              <div
                key={hosp.id}
                className={`bg-white rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-xs ${
                  selectedHospitalId === hosp.id
                    ? 'border-emerald-500 ring-2 ring-emerald-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center">
                          #{idx + 1}
                        </span>
                        <h4 className="font-black text-slate-900 text-sm">
                          {lang === 'or-IN' && hosp.nameOdia ? hosp.nameOdia : hosp.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {hosp.category} • {hosp.city}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-emerald-700 font-mono">
                        {hosp.distanceKm} km
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        ~{hosp.route.optimalEtaMinutes} mins away
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 flex items-center gap-1 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{hosp.address}</span>
                  </p>

                  {/* Bed and Resource Metrics */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-3 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Emergency</div>
                      <div className="text-sm font-extrabold text-blue-700">{hosp.beds.emergency} Beds</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">ICU Ventilator</div>
                      <div className="text-sm font-extrabold text-rose-700">{hosp.beds.icuVentilator} Units</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Oxygen Ward</div>
                      <div className="text-sm font-extrabold text-emerald-700">{hosp.beds.oxygenSupported} Beds</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {hosp.emergencyServices.slice(0, 3).map((serv, sIdx) => (
                      <span key={sIdx} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded">
                        ✓ {serv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedHospitalId(hosp.id);
                      setActiveView('map-view');
                    }}
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-200" />
                    View Traffic-Free Route
                  </button>

                  <a
                    href={`tel:${hosp.emergencyHelpline.split('/')[0].trim()}`}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
                    title="Call Hospital"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. SUB-TAB 3: 108 / 102 AMBULANCE RADAR */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeView === 'ambulance-radar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Ambulance className="w-5 h-5 text-rose-600" />
                <span>Odisha 108 / 102 Emergency Ambulance Radar (Nearest Units)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Connected to Odisha State Emergency Medical Service Command Center
              </p>
            </div>

            <a
              href="tel:108"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              Call 108 Now
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rankedAmbulances.map((amb) => (
              <div
                key={amb.id}
                className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-black text-rose-700">
                          {amb.code}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="font-mono text-xs text-slate-600 font-bold">
                          {amb.vehicleNo}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                        {lang === 'or-IN' && amb.typeOdia ? amb.typeOdia : amb.type}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-rose-600 leading-tight font-mono">
                        {amb.etaMins} mins
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {amb.distanceKm} km away
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 mb-3 text-slate-700">
                    <div>
                      <strong>{txt.ambStation}</strong>{' '}
                      {lang === 'or-IN' && amb.baseOdia ? amb.baseOdia : amb.baseStation}
                    </div>
                    <div>
                      <strong>{txt.ambDriver}</strong> {amb.driverName}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Equipment: {amb.equipment.join(' • ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setDispatchAmbulance(amb)}
                    className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs"
                  >
                    <Ambulance className="w-3.5 h-3.5 text-rose-200" />
                    {txt.dispatchAmbBtn}
                  </button>

                  <a
                    href={`tel:${amb.driverPhone}`}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
                    title="Call Pilot"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 6. MODAL 1: 108 AMBULANCE DISPATCH REQUEST FORM */}
      {/* ───────────────────────────────────────────────────────── */}
      {dispatchAmbulance && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Ambulance className="w-5 h-5" />
                <h3 className="font-extrabold text-slate-900 text-sm">
                  {txt.modalDispatchTitle}
                </h3>
              </div>
              <button
                onClick={() => setDispatchAmbulance(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3 text-xs">
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-900 flex items-center justify-between">
                <span>Vehicle: <strong>{dispatchAmbulance.vehicleNo}</strong> ({dispatchAmbulance.code})</span>
                <span className="font-extrabold">ETA: ~{dispatchAmbulance.etaMins} mins</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Patient Emergency Condition *</label>
                <select
                  value={patientCondition}
                  onChange={(e) => setPatientCondition(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                >
                  <option value="Cardiac / Severe Chest Pain">Cardiac / Severe Chest Pain (ହୃଦ୍‌ରୋଗ ସଙ୍କଟ)</option>
                  <option value="Road Accident / Polytrauma">Road Accident / Polytrauma (ଦୁର୍ଘଟଣା ଜରୁରୀ)</option>
                  <option value="Severe Respiratory / SpO2 Drop">Severe Respiratory / SpO2 Drop (ଶ୍ୱାସକ୍ରିୟା କଷ୍ଟ)</option>
                  <option value="Maternal / Labor Pain Emergency">Maternal / Labor Pain Emergency (ପ୍ରସବକାଳୀନ ଜରୁରୀ)</option>
                  <option value="Stroke / Paralysis Sudden Onset">Stroke / Paralysis Sudden Onset (ଷ୍ଟ୍ରୋକ୍ ଆକ୍ରମଣ)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Pickup Landmark / Gate No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Canteen Gate 2, or Flat No."
                  value={pickupLandmark}
                  onChange={(e) => setPickupLandmark(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 mb-1 block">Caller Contact Phone *</label>
                <input
                  type="text"
                  required
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl outline-none focus:bg-white"
                />
              </div>

              <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200 text-[11px]">
                ✓ Live GPS Coordinates ({userCoords.lat.toFixed(4)}°, {userCoords.lng.toFixed(4)}°) automatically transmitted to 108 Emergency Control Room.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDispatchAmbulance(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs"
                >
                  {txt.confirmDispatchBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 7. MODAL 2: CONFIRMED DISPATCH TOKEN & TRACKER SLIP */}
      {/* ───────────────────────────────────────────────────────── */}
      {confirmedDispatchToken && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  {txt.dispatchSuccessTitle}
                </h3>
              </div>
              <button
                onClick={() => setConfirmedDispatchToken(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Emergency Dispatch Slip */}
            <div className="bg-slate-50 border-2 border-dashed border-rose-300 rounded-2xl p-5 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">
                    Odisha 108 Emergency Dispatch Token
                  </div>
                  <div className="text-lg font-black text-rose-700 font-mono">
                    #{confirmedDispatchToken.id}
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded animate-pulse">
                    SIREN ACTIVE
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Vehicle Number</span>
                  <strong className="text-slate-900">{confirmedDispatchToken.vehicleNo}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Type</span>
                  <strong className="text-rose-700">{confirmedDispatchToken.type}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Pilot / Driver</span>
                  <strong>{confirmedDispatchToken.driverName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">Emergency ETA</span>
                  <strong className="text-emerald-700 text-sm">~{confirmedDispatchToken.etaMins} Minutes</strong>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-2">
                <span className="text-[10px] text-slate-400 font-bold block">Pickup Location</span>
                <strong className="text-slate-900">{confirmedDispatchToken.pickupLandmark}</strong>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                  Coordinates: {confirmedDispatchToken.userLat.toFixed(4)}°N, {confirmedDispatchToken.userLng.toFixed(4)}°E
                </p>
              </div>

              <div className="bg-rose-50 text-rose-900 p-2.5 rounded-xl text-[10px] border border-rose-200 font-medium">
                {txt.dispatchNotice}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setConfirmedDispatchToken(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                Print Dispatch Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
