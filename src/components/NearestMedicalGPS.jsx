import React, { useState, useEffect, useMemo } from 'react';
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
  Printer,
  Search,
  SlidersHorizontal,
  Flame,
  FileText
} from 'lucide-react';
import {
  ODISHA_LOCATIONS,
  ODISHA_MEDICAL_FACILITIES,
  ODISHA_AMBULANCES,
  calculateDistanceKm,
  getRouteSimulation
} from '../utils/nearestMedicalData';
import InteractiveLeafletMap from './InteractiveLeafletMap';
import { saveAmbulanceRequest } from '../utils/authStorage';

export default function NearestMedicalGPS({ currentUser, appLang, onNavigateToAmbulance, onOpenNmcSuite }) {
  const lang = appLang || currentUser?.preferredLanguage || 'or-IN';

  // Selected User Location State (Default: Bhubaneswar Master Canteen)
  const [selectedLocationId, setSelectedLocationId] = useState('BBS_CTR');
  const [userCoords, setUserCoords] = useState({ lat: 20.2668, lng: 85.8398, accuracy: 15, isLiveGps: false });
  const [gpsError, setGpsError] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  // Selected Target Hospital for Navigation
  const [selectedHospitalId, setSelectedHospitalId] = useState('HOSP-01');

  // Filter category for hospitals: 'ALL' | 'GOVT' | 'TRAUMA' | 'ICU' | 'EYE'
  const [hospitalCategory, setHospitalCategory] = useState('ALL');

  // Radius Filter: 'ALL' | 5 | 15 | 30 | 50 (in km)
  const [radiusFilter, setRadiusFilter] = useState('ALL');

  // District Filter: 'ALL' | specific district name
  const [districtFilter, setDistrictFilter] = useState('ALL');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

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


  // Multilingual UI Text Dictionary
  const txt = {
    'or-IN': {
      title: 'ନିକଟସ୍ଥ ଚିକିତ୍ସାଳୟ ଓ ଜରୁରୀକାଳୀନ ଆମ୍ବୁଲାନ୍ସ GPS',
      subtitle: 'ଲାଇଭ୍ GPS ଇଣ୍ଟରାକ୍ଟିଭ୍ ମ୍ୟାପ୍, ଟ୍ରାଫିକ୍ ମୁକ୍ତ ସବୁଜ ମାର୍ଗ ଓ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ସେବା (Odisha Health Portal)',
      gpsActive: 'ଲାଇଭ୍ GPS ସକ୍ରିୟ (ଉଚ୍ଚ ସଠିକତା)',
      gpsSimulated: 'ପୂର୍ବନିର୍ଦ୍ଧାରିତ ଅବସ୍ଥାନ (Odisha)',
      locatingUser: 'GPS ଅବସ୍ଥାନ ଖୋଜା ଚାଲିଛି...',
      btnUseMyGps: 'ମୋର ପ୍ରକୃତ ଲାଇଭ୍ GPS ଅନ୍ କରନ୍ତୁ',
      tabMap: '୧. ଲାଇଭ୍ ଇଣ୍ଟରାକ୍ଟିଭ୍ ମ୍ୟାପ୍',
      tabHospitals: '୨. ନିକଟସ୍ଥ ହସ୍ପିଟାଲ୍ ତାଲିକା',
      tabAmbulance: '୩. ୧୦୮ / ୧୦୨ ଆମ୍ବୁଲାନ୍ସ ରାଡାର୍',
      nearestHospitalAlert: 'ସବୁଠାରୁ ନିକଟସ୍ଥ ଜରୁରୀକାଳୀନ ହସ୍ପିଟାଲ୍ ଚିହ୍ନଟ ହେଲା!',
      trafficFreeBadge: '✓ ସର୍ବୋତ୍ତମ ଟ୍ରାଫିକ୍ ମୁକ୍ତ ସବୁଜ ମାର୍ଗ',
      etaText: 'ପହଞ୍ଚିବା ସମୟ (ETA)',
      distanceText: 'ଦୂରତା',
      trafficSaved: 'ସହର ଟ୍ରାଫିକ୍ ତୁଳନାରେ ସମୟ ବଞ୍ଚିବ',
      minutes: 'ମିନିଟ୍',
      km: 'କି.ମି.',
      btnStartNav: 'ଟର୍ଣ୍ଣ-ବାଇ-ଟର୍ଣ୍ଣ ନାଭିଗେସନ୍',
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
      dispatchNotice: 'ଆମ୍ବୁଲାନ୍ସ ସାଇରନ୍ ସହିତ ଆପଣଙ୍କ ଅବସ୍ଥାନ ଆଡ଼କୁ ଆସୁଛି। ଦୟାକରି ଫୋନ୍ ଖୋଲା ରଖନ୍ତୁ।',
      allRadius: 'ସମସ୍ତ ଓଡ଼ିଶା',
      radius5: '୫ କି.ମି. ମଧ୍ୟରେ',
      radius15: '୧୫ କି.ମି. ମଧ୍ୟରେ',
      radius30: '୩୦ କି.ମି. ମଧ୍ୟରେ',
      radius50: '୫୦ କି.ମି. ମଧ୍ୟରେ',
      searchPlaceholder: 'ହସ୍ପିଟାଲ୍ ନାମ, ବିଶେଷଜ୍ଞତା (ଟ୍ରମା, ହୃଦ୍, ଚକ୍ଷୁ) ଖୋଜନ୍ତୁ...',
      allDistricts: 'ସମସ୍ତ ଜିଲ୍ଲା (All Districts)',
      bookAmbulanceHere: 'ଏହି ହସ୍ପିଟାଲ୍ ପାଇଁ ୧୦୮ ଆମ୍ବୁଲାନ୍ସ ବୁକ୍ କରନ୍ତୁ'
    },
    'hi-IN': {
      title: 'निकटतम अस्पताल एवं आपातकालीन एम्बुलेंस GPS',
      subtitle: 'लाइव इंटरैक्टिव जीपीएस मैप, ट्रैफिक-मुक्त ग्रीन कॉरिडोर एवं 108 एम्बुलेंस सेवा',
      gpsActive: 'लाइव GPS सक्रिय (सटीक स्थिति)',
      gpsSimulated: 'चयनित स्थान (ओडिशा)',
      locatingUser: 'GPS स्थिति ट्रैक हो रही है...',
      btnUseMyGps: 'मेरा लाइव GPS चालू करें',
      tabMap: '1. लाइव इंटरैक्टिव मैप',
      tabHospitals: '2. निकटतम अस्पताल सूची',
      tabAmbulance: '3. 108 / 102 एम्बुलेंस रडार',
      nearestHospitalAlert: 'निकटतम आपातकालीन अस्पताल खोजा गया!',
      trafficFreeBadge: '✓ सर्वोत्तम ट्रैफिक-मुक्त ग्रीन कॉरिडोर',
      etaText: 'पहुंचने का समय (ETA)',
      distanceText: 'दूरी',
      trafficSaved: 'ट्रैफिक जाम से समय बचत',
      minutes: 'मिनट',
      km: 'कि.मी.',
      btnStartNav: 'टर्न-बाय-टर्न नेविगेशन',
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
      dispatchNotice: 'एम्बुलेंस सायरन चालू कर आपके स्थान की ओर रवाना हो चुकी है। कृपया फोन चालू रखें।',
      allRadius: 'संपूर्ण ओडिशा',
      radius5: '5 किमी के भीतर',
      radius15: '15 किमी के भीतर',
      radius30: '30 किमी के भीतर',
      radius50: '50 किमी के भीतर',
      searchPlaceholder: 'अस्पताल नाम, विशेषता (ट्रॉमा, कार्डियक, नेत्र) खोजें...',
      allDistricts: 'सभी जिले (All Districts)',
      bookAmbulanceHere: 'इस अस्पताल के लिए 108 एम्बुलेंस बुक करें'
    },
    'en-IN': {
      title: 'Nearest Medical & 108 Emergency Ambulance GPS',
      subtitle: 'Real-time Interactive GPS Map, Green Corridor Traffic-Free Routing & 108 Dispatch',
      gpsActive: 'Live Device GPS Active (High Accuracy)',
      gpsSimulated: 'Simulated Landmark (Odisha)',
      locatingUser: 'Acquiring GPS Fix...',
      btnUseMyGps: 'Enable My Real Live GPS',
      tabMap: '1. Live Interactive Map',
      tabHospitals: '2. Nearest Hospitals',
      tabAmbulance: '3. 108 / 102 Ambulance Radar',
      nearestHospitalAlert: 'Closest Emergency Medical Facility Located!',
      trafficFreeBadge: '✓ Optimal Traffic-Free Green Corridor',
      etaText: 'Estimated Travel Time (ETA)',
      distanceText: 'Distance',
      trafficSaved: 'Time saved vs congested city route',
      minutes: 'mins',
      km: 'km',
      btnStartNav: 'Turn-by-Turn Navigation',
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
      dispatchNotice: 'Ambulance is navigating with active emergency green corridor to your location. Keep phone line open.',
      allRadius: 'All Odisha',
      radius5: 'Within 5 km',
      radius15: 'Within 15 km',
      radius30: 'Within 30 km',
      radius50: 'Within 50 km',
      searchPlaceholder: 'Search hospital name, specialty (trauma, cardiac, cancer, eye)...',
      allDistricts: 'All Districts',
      bookAmbulanceHere: 'Book 108 Ambulance to this Hospital'
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

  // Extract all distinct districts from hospitals
  const availableDistricts = useMemo(() => {
    const set = new Set();
    ODISHA_MEDICAL_FACILITIES.forEach((h) => {
      if (h.district) set.add(h.district);
    });
    return Array.from(set).sort();
  }, []);

  // Compute all ranked hospitals from userCoords
  const allRankedHospitals = useMemo(() => {
    return ODISHA_MEDICAL_FACILITIES.map((hosp) => {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, hosp.lat, hosp.lng);
      const route = getRouteSimulation(userCoords.lat, userCoords.lng, hosp.lat, hosp.lng, dist);
      return {
        ...hosp,
        distanceKm: dist,
        route: route
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userCoords]);

  // Apply Filters (Category, Radius, District, Search)
  const filteredHospitals = useMemo(() => {
    return allRankedHospitals.filter((hosp) => {
      // 1. Category Filter
      if (hospitalCategory === 'GOVT' && !hosp.category.includes('Govt') && !hosp.category.includes('Apex')) {
        return false;
      }
      if (hospitalCategory === 'TRAUMA' && !hosp.traumaLevel.includes('Level-1')) {
        return false;
      }
      if (hospitalCategory === 'ICU' && (hosp.beds?.icuVentilator || 0) < 15) {
        return false;
      }
      if (hospitalCategory === 'EYE' && !hosp.category.includes('Ophthalmology') && !hosp.name.toLowerCase().includes('eye')) {
        return false;
      }

      // 2. Radius Filter
      if (radiusFilter !== 'ALL' && hosp.distanceKm > Number(radiusFilter)) {
        return false;
      }

      // 3. District Filter
      if (districtFilter !== 'ALL' && hosp.district !== districtFilter) {
        return false;
      }

      // 4. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = hosp.name?.toLowerCase().includes(q) || hosp.nameOdia?.includes(q) || hosp.nameHindi?.includes(q);
        const matchCity = hosp.city?.toLowerCase().includes(q) || hosp.district?.toLowerCase().includes(q);
        const matchAddress = hosp.address?.toLowerCase().includes(q);
        const matchServices = hosp.emergencyServices?.some((s) => s.toLowerCase().includes(q));
        if (!matchName && !matchCity && !matchAddress && !matchServices) {
          return false;
        }
      }

      return true;
    });
  }, [allRankedHospitals, hospitalCategory, radiusFilter, districtFilter, searchQuery]);

  // The closest hospital (unfiltered closest)
  const nearestHospital = allRankedHospitals[0] || ODISHA_MEDICAL_FACILITIES[0];

  // Active hospital selected for map route
  const activeHospital =
    filteredHospitals.find((h) => h.id === selectedHospitalId) ||
    allRankedHospitals.find((h) => h.id === selectedHospitalId) ||
    nearestHospital;

  // Rank Ambulances by distance from userCoords
  const rankedAmbulances = useMemo(() => {
    return ODISHA_AMBULANCES.map((amb) => {
      const dist = calculateDistanceKm(userCoords.lat, userCoords.lng, amb.lat, amb.lng);
      const etaMins = Math.max(2, Math.round((dist / 38) * 60));
      return {
        ...amb,
        distanceKm: dist,
        etaMins: etaMins
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [userCoords]);

  // Set nearest hospital as selected initially if none chosen
  useEffect(() => {
    if (!selectedHospitalId && nearestHospital) {
      setSelectedHospitalId(nearestHospital.id);
    }
  }, [nearestHospital, selectedHospitalId]);

  // Handle Turn-by-Turn Navigation simulation
  useEffect(() => {
    let timer;
    if (isNavigating && activeHospital?.route?.steps) {
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
      destinationHospital: activeHospital?.name || 'Nearest Apex Trauma Hospital',
      timestamp: new Date().toISOString(),
      status: 'DISPATCHED_EN_ROUTE'
    };

    setConfirmedDispatchToken(token);
    try {
      saveAmbulanceRequest({
        id: token.id,
        emergencyType: patientCondition,
        ambulanceType: dispatchAmbulance.type,
        patientName: currentUser?.name || 'Emergency GPS Caller',
        patientPhone: callerPhone || currentUser?.phone || '108',
        patientAbha: currentUser?.staffId || '',
        pickupAddress: pickupLandmark || 'Current GPS Location / Odisha Network',
        pickupDistrict: currentUser?.district || 'Khordha',
        destinationHospital: activeHospital?.name || 'Nearest District Hospital',
        vehicleNo: dispatchAmbulance.vehicleNo,
        eta: `~${dispatchAmbulance.etaMins} mins`,
        paramedic: `${dispatchAmbulance.driverName} (${dispatchAmbulance.driverPhone})`,
        status: 'DISPATCHED'
      });
    } catch (err) {
      console.warn('Syncing ambulance dispatch to storage', err);
    }
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
                  45+ Odisha Hospitals Live
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">{txt.subtitle}</p>
            </div>
          </div>

          {/* GPS Status & 108 Emergency Call Pill */}
          <div className="flex flex-wrap items-center gap-2.5">
            {onNavigateToAmbulance && (
              <button
                type="button"
                onClick={onNavigateToAmbulance}
                className="flex items-center gap-1.5 bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all border border-rose-400/40"
              >
                <Ambulance className="w-4 h-4 text-rose-200" />
                <span>Book 108 Ambulance</span>
              </button>
            )}

            <a
              href="tel:108"
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
            >
              <Phone className="w-4 h-4 text-rose-200 fill-white" />
              <span>Dial 108 Toll-Free</span>
            </a>

            <button
              onClick={handleEnableLiveGps}
              disabled={isLocating}
              className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-400/40 text-emerald-200 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
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
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
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
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeView === 'hospitals-list'
                ? 'bg-white text-emerald-900 shadow-md'
                : 'bg-emerald-950/50 text-emerald-200 hover:bg-emerald-800/60'
            }`}
          >
            <Hospital className="w-3.5 h-3.5 text-blue-600" />
            {txt.tabHospitals}
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {filteredHospitals.length}
            </span>
          </button>

          <button
            onClick={() => setActiveView('ambulance-radar')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
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
      {/* 2. SEARCH & FILTER CONTROLS BAR */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={txt.searchPlaceholder}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* District Dropdown */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold outline-none cursor-pointer focus:border-emerald-500"
            >
              <option value="ALL">{txt.allDistricts}</option>
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Radius Pills & Category Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          {/* Radius Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 mr-1">Radius:</span>
            {[
              { id: 'ALL', label: txt.allRadius },
              { id: '5', label: '5 km' },
              { id: '15', label: '15 km' },
              { id: '30', label: '30 km' },
              { id: '50', label: '50 km' }
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setRadiusFilter(r.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  radiusFilter === r.id
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Facility Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'ALL', label: 'All Types' },
              { id: 'GOVT', label: '🏛️ Govt / Apex' },
              { id: 'TRAUMA', label: '🚨 Level-1 Trauma' },
              { id: 'ICU', label: '🫁 15+ ICUs' },
              { id: 'EYE', label: '👁️ Eye Care' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setHospitalCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  hospitalCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. OPTIMAL TRAFFIC-FREE CORRIDOR ALERT (HERO) */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeHospital && (
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
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Direct Green Route</div>
            </div>

            <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200 text-center">
              <div className="text-[10px] text-blue-700 font-bold uppercase tracking-wider">{txt.emergencyBeds}</div>
              <div className="text-2xl font-black text-blue-900 leading-tight mt-0.5">
                {activeHospital.beds?.emergency || 0}{' '}
                <span className="text-xs font-semibold text-blue-600">Available</span>
              </div>
              <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                ICU Ventilators: <strong>{activeHospital.beds?.icuVentilator || 0}</strong>
              </div>
            </div>

            <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200 text-center">
              <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Trauma Protocol</div>
              <div className="text-sm font-extrabold text-amber-900 leading-tight mt-1 truncate">
                {activeHospital.traumaLevel?.split(' ')[0]} {activeHospital.traumaLevel?.split(' ')[1]}
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isNavigating
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                {isNavigating ? txt.btnStopNav : txt.btnStartNav}
              </button>

              <button
                onClick={() => {
                  const closest = rankedAmbulances[0];
                  if (closest) setDispatchAmbulance(closest);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Ambulance className="w-3.5 h-3.5 text-rose-200" />
                <span>Dispatch 108 Here</span>
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
          {isNavigating && activeHospital.route?.steps && (
            <div className="p-3 bg-emerald-950 text-white rounded-xl text-xs space-y-1 border border-emerald-500/50 animate-fadeIn">
              <div className="flex items-center justify-between text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                <span>Turn-by-Turn Guidance • Step {activeStepIndex + 1} of {activeHospital.route.steps.length}</span>
                <span className="text-emerald-400 font-mono">LIVE GPS ROUTING</span>
              </div>
              <div className="text-sm font-extrabold text-white flex items-center gap-2">
                <ArrowRight className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'or-IN'
                    ? activeHospital.route.steps[activeStepIndex]?.instructionOdia
                    : activeHospital.route.steps[activeStepIndex]?.instruction}
                </span>
              </div>
              <div className="text-[11px] text-emerald-300">
                Next waypoint in <strong>{activeHospital.route.steps[activeStepIndex]?.distance}</strong> (Status: Traffic Free)
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 4. SUB-TAB 1: LIVE INTERACTIVE LEAFLET MAP VIEW */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeView === 'map-view' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Viewport Container (2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-3">
            <InteractiveLeafletMap
              userCoords={userCoords}
              hospitals={filteredHospitals}
              activeHospitalId={selectedHospitalId}
              onSelectHospital={(id) => setSelectedHospitalId(id)}
              ambulances={rankedAmbulances}
              isNavigating={isNavigating}
              activeStepIndex={activeStepIndex}
              lang={lang}
            />

            {/* Map Legend */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2 shadow-2xs">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                  <span>Super-Specialty</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-600"></span>
                  <span>Level-1 Trauma</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <span>Medical College</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                  <span>You</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
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
                  Active Selected Hospital
                </span>
                <h4 className="text-base font-extrabold text-slate-900 leading-snug mt-0.5">
                  {lang === 'or-IN' && activeHospital.nameOdia ? activeHospital.nameOdia : activeHospital.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  📍 {activeHospital.address}
                </p>
              </div>

              {/* Resource Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">Available Beds</span>
                  <strong className="text-slate-800 text-sm">{activeHospital.beds?.emergency || 0} Emergency</strong>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block">ICU Ventilators</span>
                  <strong className="text-rose-700 text-sm">{activeHospital.beds?.icuVentilator || 0} Active</strong>
                </div>
              </div>

              {/* Fast Actions */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    const closest = rankedAmbulances[0];
                    if (closest) setDispatchAmbulance(closest);
                  }}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>{txt.bookAmbulanceHere}</span>
                </button>

                <a
                  href={`tel:${activeHospital.phone?.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>Call Hospital: {activeHospital.phone}</span>
                </a>

                {onOpenNmcSuite && (
                  <button
                    onClick={onOpenNmcSuite}
                    className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-200" />
                    <span>Issue NMC Referral (QR Code)</span>
                  </button>
                )}
              </div>

              {/* Highway Corridor Details */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200 text-xs space-y-1">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Corridor Flow Protocol</span>
                <p className="text-emerald-950 font-medium text-[11px] leading-relaxed">
                  ✓ {activeHospital.bestTrafficCorridor}
                </p>
                <div className="text-[10px] text-emerald-700 pt-1">
                  BSKY Cashless Emergency Coverage: <strong>{activeHospital.bskyBeneficiary ? 'Yes (Empaneled)' : 'Direct'}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 5. SUB-TAB 2: NEAREST HOSPITALS DIRECTORY */}
      {/* ───────────────────────────────────────────────────────── */}
      {activeView === 'hospitals-list' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Hospital className="w-5 h-5 text-blue-600" />
                <span>Ranked Nearest Medical Facilities ({filteredHospitals.length} Found)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Sorted by distance from your current location ({userCoords.lat.toFixed(2)}°, {userCoords.lng.toFixed(2)}°)
              </p>
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Showing {filteredHospitals.length} of {allRankedHospitals.length} hospitals
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHospitals.map((hosp, idx) => (
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
                          {lang === 'or-IN' && hosp.nameOdia ? hosp.nameOdia : (lang === 'hi-IN' && hosp.nameHindi ? hosp.nameHindi : hosp.name)}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                        {hosp.category} • {hosp.city} ({hosp.district})
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base font-black text-emerald-700 font-mono">
                        {hosp.distanceKm} km
                      </div>
                      <div className="text-[10px] font-bold text-slate-400">
                        ~{hosp.route?.optimalEtaMinutes || 10} mins away
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
                      <div className="text-sm font-extrabold text-blue-700">{hosp.beds?.emergency || 0} Beds</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">ICU Ventilator</div>
                      <div className="text-sm font-extrabold text-rose-700">{hosp.beds?.icuVentilator || 0} Units</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase">Oxygen Ward</div>
                      <div className="text-sm font-extrabold text-emerald-700">{hosp.beds?.oxygenSupported || 0} Beds</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {hosp.emergencyServices?.slice(0, 3).map((serv, sIdx) => (
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
                    className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-emerald-200" />
                    <span>View on GPS Map</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedHospitalId(hosp.id);
                      const closest = rankedAmbulances[0];
                      if (closest) setDispatchAmbulance(closest);
                    }}
                    className="py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-2xs cursor-pointer"
                    title="Dispatch 108"
                  >
                    <Ambulance className="w-3.5 h-3.5" />
                    <span>108</span>
                  </button>

                  <a
                    href={`tel:${hosp.phone?.replace(/[^0-9+]/g, '')}`}
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1"
                    title="Call Hospital"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                  </a>

                  {onOpenNmcSuite && (
                    <button
                      onClick={onOpenNmcSuite}
                      className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                      title="Generate NMC Referral Slip &amp; Clinical Rx (Verifiable QR)"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-700" />
                      <span className="hidden sm:inline">Referral</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 6. SUB-TAB 3: 108 / 102 AMBULANCE RADAR */}
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
                    className="flex-1 py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
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
      {/* 7. MODAL: 108 AMBULANCE DISPATCH REQUEST FORM */}
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
                <label className="font-bold text-slate-700 mb-1 block">Destination Hospital</label>
                <input
                  type="text"
                  disabled
                  value={activeHospital ? `${activeHospital.name} (${activeHospital.city})` : 'Nearest Apex Hospital'}
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
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
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  {txt.confirmDispatchBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* 8. MODAL: CONFIRMED DISPATCH TOKEN & TRACKER SLIP */}
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

              <div className="border-t border-slate-200 pt-2">
                <span className="text-[10px] text-slate-400 font-bold block">Destination Hospital</span>
                <strong className="text-emerald-900">{confirmedDispatchToken.destinationHospital}</strong>
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
                className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
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
