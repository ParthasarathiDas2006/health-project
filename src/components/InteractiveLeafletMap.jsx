import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LocateFixed, Maximize2, Navigation, Layers, PhoneCall, Bed, ShieldCheck } from 'lucide-react';

export default function InteractiveLeafletMap({
  userCoords,
  hospitals = [],
  activeHospitalId,
  onSelectHospital,
  ambulances = [],
  isNavigating = false,
  activeStepIndex = 0,
  lang = 'en-IN'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const userMarkerRef = useRef(null);
  const hospitalMarkersRef = useRef({});
  const ambulanceMarkersRef = useRef({});
  const routePolylineRef = useRef(null);
  const routeDecorationsRef = useRef([]);

  const [mapStyle, setMapStyle] = useState('osm'); // 'osm' | 'carto'
  const tileLayerRef = useRef(null);

  const activeHospital = hospitals.find((h) => h.id === activeHospitalId) || hospitals[0];

  // Tile layer URLs
  const TILE_LAYERS = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    },
    carto: {
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      attribution: '&copy; CARTO &copy; OpenStreetMap contributors'
    }
  };

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return; // Prevent double init

    const initialLat = userCoords?.lat || 20.2668;
    const initialLng = userCoords?.lng || 85.8398;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 13,
      zoomControl: false,
      attributionControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    const layerConfig = TILE_LAYERS.osm;
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      maxZoom: 19,
      attribution: layerConfig.attribution
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 2. Handle Tile Layer Switch
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const config = TILE_LAYERS[mapStyle] || TILE_LAYERS.osm;
    tileLayerRef.current = L.tileLayer(config.url, {
      maxZoom: 19,
      attribution: config.attribution
    }).addTo(mapInstanceRef.current);
  }, [mapStyle]);

  // 3. Update User GPS Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords?.lat || !userCoords?.lng) return;

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <span class="absolute w-8 h-8 rounded-full bg-blue-500/30 animate-ping"></span>
        <span class="absolute w-6 h-6 rounded-full bg-blue-500/40"></span>
        <div class="relative w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
        <div class="absolute -bottom-5 whitespace-nowrap bg-blue-900/90 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow border border-blue-400/40 pointer-events-none">
          ${lang === 'or-IN' ? 'ଆପଣଙ୍କ ଅବସ୍ଥାନ' : (lang === 'hi-IN' ? 'आप यहाँ हैं' : 'You')}
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'user-pin-marker',
      html: userHtml,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userCoords.lat, userCoords.lng]);
    } else {
      userMarkerRef.current = L.marker([userCoords.lat, userCoords.lng], {
        icon: userIcon,
        zIndexOffset: 1000
      }).addTo(map);

      userMarkerRef.current.bindPopup(`
        <div class="p-1 font-sans text-xs">
          <div class="font-extrabold text-blue-800 flex items-center gap-1">
            📍 ${lang === 'or-IN' ? 'ଆପଣଙ୍କ GPS ଅବସ୍ଥାନ' : (lang === 'hi-IN' ? 'आपकी GPS स्थिति' : 'Current GPS Location')}
          </div>
          <div class="text-[11px] text-slate-600 mt-1 font-mono">
            Lat: ${userCoords.lat.toFixed(4)}°, Lng: ${userCoords.lng.toFixed(4)}°
          </div>
          <div class="text-[10px] text-emerald-700 font-bold mt-1">
            ✓ ${userCoords.isLiveGps ? 'Live High-Precision Device GPS' : 'Simulated Preset Landmark'}
          </div>
        </div>
      `);
    }
  }, [userCoords, lang]);

  // 4. Update Hospital Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old hospital markers not in current list
    Object.keys(hospitalMarkersRef.current).forEach((id) => {
      if (!hospitals.find((h) => h.id === id)) {
        hospitalMarkersRef.current[id].remove();
        delete hospitalMarkersRef.current[id];
      }
    });

    hospitals.forEach((hosp) => {
      const isSelected = hosp.id === activeHospitalId;
      const isApex = hosp.category.includes('Apex') || hosp.category.includes('Medical College');
      const isTrauma = hosp.traumaLevel.includes('Level-1');

      let pinColor = '#10b981'; // emerald
      let badgeBg = 'bg-emerald-600';
      if (isTrauma) {
        pinColor = '#e11d48'; // rose
        badgeBg = 'bg-rose-600';
      } else if (isApex) {
        pinColor = '#2563eb'; // blue
        badgeBg = 'bg-blue-600';
      }

      const hospName = lang === 'or-IN' && hosp.nameOdia ? hosp.nameOdia : (lang === 'hi-IN' && hosp.nameHindi ? hosp.nameHindi : hosp.name);

      const hospitalHtml = `
        <div class="relative cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
          ${isSelected ? '<span class="absolute -inset-2 rounded-full bg-emerald-400/40 animate-ping"></span>' : ''}
          <div class="relative flex items-center justify-center">
            <svg width="34" height="42" viewBox="0 0 34 42" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35));">
              <path d="M17 0C7.61 0 0 7.61 0 17C0 29.75 17 42 17 42C17 42 34 29.75 34 17C34 7.61 26.39 0 17 0Z" fill="${pinColor}"/>
              <circle cx="17" cy="17" r="11" fill="#FFFFFF"/>
              <path d="M17 11V23M11 17H23" stroke="${pinColor}" stroke-width="3" stroke-linecap="round"/>
            </svg>
            <div class="absolute -top-1.5 -right-1 ${badgeBg} text-white font-mono text-[9px] font-black px-1 rounded-full shadow border border-white">
              ${hosp.beds?.emergency || 0}
            </div>
          </div>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow pointer-events-none max-w-[120px] truncate">
            ${hosp.name.slice(0, 16)}
          </div>
        </div>
      `;

      const hospIcon = L.divIcon({
        className: 'hospital-pin-marker',
        html: hospitalHtml,
        iconSize: [34, 42],
        iconAnchor: [17, 42],
        popupAnchor: [0, -40]
      });

      if (hospitalMarkersRef.current[hosp.id]) {
        hospitalMarkersRef.current[hosp.id].setLatLng([hosp.lat, hosp.lng]);
        hospitalMarkersRef.current[hosp.id].setIcon(hospIcon);
      } else {
        const marker = L.marker([hosp.lat, hosp.lng], {
          icon: hospIcon,
          zIndexOffset: isSelected ? 500 : 100
        }).addTo(map);

        marker.on('click', () => {
          if (onSelectHospital) {
            onSelectHospital(hosp.id);
          }
        });

        hospitalMarkersRef.current[hosp.id] = marker;
      }

      // Bind rich popup
      const marker = hospitalMarkersRef.current[hosp.id];
      const popupHtml = `
        <div class="p-2 font-sans text-xs max-w-[240px]">
          <div class="font-extrabold text-slate-900 text-sm leading-tight">
            ${hospName}
          </div>
          <div class="text-[10px] text-emerald-700 font-bold mt-0.5">
            ${hosp.category}
          </div>
          <p class="text-[11px] text-slate-500 mt-1 line-clamp-2">
            📍 ${hosp.address}
          </p>
          <div class="grid grid-cols-2 gap-1.5 my-2 pt-2 border-t border-slate-100 text-center text-[10px]">
            <div class="bg-emerald-50 p-1 rounded border border-emerald-200">
              <span class="text-emerald-600 block">Emergency Beds</span>
              <strong class="text-emerald-900 font-extrabold text-sm">${hosp.beds?.emergency || 0}</strong>
            </div>
            <div class="bg-blue-50 p-1 rounded border border-blue-200">
              <span class="text-blue-600 block">ICU Ventilator</span>
              <strong class="text-blue-900 font-extrabold text-sm">${hosp.beds?.icuVentilator || 0}</strong>
            </div>
          </div>
          <div class="flex items-center justify-between text-[11px] text-slate-600 pb-2">
            <span>Distance: <strong>${hosp.distanceKm || 0} km</strong></span>
            <span>Rating: <strong>★ ${hosp.rating || 4.8}</strong></span>
          </div>
          <div class="flex items-center gap-1.5 pt-1">
            <a href="tel:${hosp.phone.replace(/[^0-9+]/g, '')}" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 rounded text-center text-[10px] no-underline">
              📞 Emergency Call
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${hosp.lat},${hosp.lng}" target="_blank" rel="noopener noreferrer" class="bg-slate-900 hover:bg-black text-white font-bold px-2 py-1.5 rounded text-[10px] no-underline">
              Directions ↗
            </a>
          </div>
        </div>
      `;
      marker.bindPopup(popupHtml);
    });
  }, [hospitals, activeHospitalId, lang, onSelectHospital]);

  // 5. Update Ambulance Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Cleanup old ambulances
    Object.keys(ambulanceMarkersRef.current).forEach((id) => {
      if (!ambulances.find((a) => a.id === id)) {
        ambulanceMarkersRef.current[id].remove();
        delete ambulanceMarkersRef.current[id];
      }
    });

    ambulances.forEach((amb) => {
      const ambHtml = `
        <div class="relative cursor-pointer">
          <span class="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping"></span>
          <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
            🚑
          </div>
          <div class="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-rose-950 text-rose-200 text-[8px] font-black px-1 rounded shadow">
            ${amb.code}
          </div>
        </div>
      `;

      const ambIcon = L.divIcon({
        className: 'amb-pin-marker',
        html: ambHtml,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      if (ambulanceMarkersRef.current[amb.id]) {
        ambulanceMarkersRef.current[amb.id].setLatLng([amb.lat, amb.lng]);
      } else {
        const marker = L.marker([amb.lat, amb.lng], {
          icon: ambIcon,
          zIndexOffset: 300
        }).addTo(map);

        marker.bindPopup(`
          <div class="p-1 font-sans text-xs">
            <div class="font-bold text-rose-700 flex items-center gap-1">
              🚑 ${amb.type}
            </div>
            <div class="text-[11px] text-slate-600 mt-0.5">
              Vehicle: <strong>${amb.vehicleNo}</strong>
            </div>
            <div class="text-[10px] text-slate-500">
              Pilot: <strong>${amb.driverName}</strong> (${amb.driverPhone})
            </div>
            <div class="text-[10px] text-emerald-600 font-bold mt-1">
              ✓ Ready for Immediate 108 Dispatch
            </div>
          </div>
        `);

        ambulanceMarkersRef.current[amb.id] = marker;
      }
    });
  }, [ambulances]);

  // 6. Draw Green Corridor Route between User and Active Hospital
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userCoords?.lat || !activeHospital?.lat) return;

    // Remove existing polyline and decor
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }
    routeDecorationsRef.current.forEach((layer) => map.removeLayer(layer));
    routeDecorationsRef.current = [];

    // Synthesize a realistic curved highway polyline with 4 waypoints
    const startLat = userCoords.lat;
    const startLng = userCoords.lng;
    const endLat = activeHospital.lat;
    const endLng = activeHospital.lng;

    // Midpoints with slight highway curvature
    const midLat1 = startLat + (endLat - startLat) * 0.33 + 0.005;
    const midLng1 = startLng + (endLng - startLng) * 0.33 - 0.004;
    const midLat2 = startLat + (endLat - startLat) * 0.66 - 0.003;
    const midLng2 = startLng + (endLng - startLng) * 0.66 + 0.006;

    const latLngs = [
      [startLat, startLng],
      [midLat1, midLng1],
      [midLat2, midLng2],
      [endLat, endLng]
    ];

    // Glow background line
    const glowLine = L.polyline(latLngs, {
      color: '#10b981',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    // Main dashed green corridor line
    const mainLine = L.polyline(latLngs, {
      color: '#059669',
      weight: 4,
      opacity: 0.95,
      dashArray: '8, 8',
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);

    routePolylineRef.current = mainLine;
    routeDecorationsRef.current = [glowLine];

    // Fit bounds to show both user and destination
    try {
      const bounds = L.latLngBounds([[startLat, startLng], [endLat, endLng]]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } catch (e) {
      // fallback
    }
  }, [userCoords, activeHospital]);

  // Handle Recenter
  const handleRecenter = () => {
    if (!mapInstanceRef.current || !userCoords?.lat) return;
    mapInstanceRef.current.setView([userCoords.lat, userCoords.lng], 14, { animate: true });
  };

  // Handle Fit Route
  const handleFitRoute = () => {
    if (!mapInstanceRef.current || !userCoords?.lat || !activeHospital?.lat) return;
    const bounds = L.latLngBounds([
      [userCoords.lat, userCoords.lng],
      [activeHospital.lat, activeHospital.lng]
    ]);
    mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[520px] rounded-2xl overflow-hidden border border-slate-300 shadow-md">
      {/* Real Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-100 z-0" />

      {/* Floating Header Overlay */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white text-xs font-bold pointer-events-auto flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Odisha Emergency GPS Corridors</span>
          <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
            {hospitals.length} Facilities Active
          </span>
        </div>
      </div>

      {/* Floating Action Controls (Recenter, Fit Route, Map Layer) */}
      <div className="absolute bottom-4 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleRecenter}
          title="Center on My GPS Location"
          className="bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <LocateFixed className="w-4 h-4 text-blue-600" />
        </button>

        <button
          onClick={handleFitRoute}
          title="Fit Route to Destination"
          className="bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <Maximize2 className="w-4 h-4 text-emerald-600" />
        </button>

        <button
          onClick={() => setMapStyle((s) => (s === 'osm' ? 'carto' : 'osm'))}
          title="Switch Map Tiles (Streets / Voyager)"
          className="bg-white/95 hover:bg-white text-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <Layers className="w-4 h-4 text-purple-600" />
        </button>
      </div>

      {/* Floating Route Badge Bottom Left */}
      {activeHospital && (
        <div className="absolute bottom-4 left-3 z-10 max-w-[280px] bg-slate-950/90 backdrop-blur-md p-2.5 rounded-xl border border-emerald-500/40 text-white shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between text-[10px] text-emerald-400 font-bold uppercase tracking-wider pb-1 border-b border-white/10">
            <span>Target Route</span>
            <span className="font-mono text-white">⚡ {activeHospital.distanceKm} km</span>
          </div>
          <div className="text-xs font-black truncate mt-1">
            {lang === 'or-IN' && activeHospital.nameOdia ? activeHospital.nameOdia : activeHospital.name}
          </div>
          <div className="text-[10px] text-slate-300 flex items-center justify-between mt-1">
            <span>{activeHospital.bestTrafficCorridor?.split('(')[0] || 'Clear Flow Corridor'}</span>
            <span className="text-emerald-400 font-bold">~{activeHospital.route?.optimalEtaMinutes || 10} min</span>
          </div>
        </div>
      )}
    </div>
  );
}
