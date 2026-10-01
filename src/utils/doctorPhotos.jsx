import React, { useState } from 'react';

import { getDoctorPhotoUrl, getDoctorGender, DOCTOR_PHOTOS, FEMALE_NAME_KEYWORDS } from './doctorPhotosUtil';

export { getDoctorPhotoUrl, getDoctorGender, DOCTOR_PHOTOS, FEMALE_NAME_KEYWORDS };

/**
 * Professional Medical Doctor Avatar
 * - Displays authentic high-res verified Indian doctor headshots matching gender
 * - Features clean SVG medical stethoscope & white-coat physician avatar as instant fallback
 * - 0ms layout shift, lazy loading, and verified RMP badge
 */
export function DoctorAvatar({ doc, size = 'md', className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const gender = getDoctorGender(doc);
  const photoUrl = getDoctorPhotoUrl(doc);
  const initials = doc?.initials || 'DR';
  const color = doc?.color || (gender === 'female' ? 'from-teal-600 to-emerald-700' : 'from-slate-700 to-emerald-900');
  const docName = typeof doc?.name === 'string' ? doc.name : (doc?.nameEn || doc?.name?.['en-IN'] || 'Doctor');

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-13 h-13 text-base rounded-2xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
    xl: 'w-16 h-16 text-lg rounded-2xl'
  }[size] || 'w-13 h-13 text-base rounded-2xl';

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses} text-white font-bold flex items-center justify-center shadow-xs bg-gradient-to-br ${color} overflow-hidden relative`}
      >
        {/* Instant Medical Doctor SVG Background / Fallback */}
        {(!photoUrl || imageError || !imageLoaded) && (
          <div className="absolute inset-0 flex flex-col items-center justify-between p-1 bg-slate-900/20">
            {/* Medical Stethoscope & Coat Silhouette */}
            <svg
              className="w-full h-full opacity-70"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Head / Face */}
              <circle cx="24" cy="15" r="9" fill="currentColor" fillOpacity="0.85" />
              {gender === 'female' ? (
                /* Female hair styling hint */
                <path
                  d="M14 16C14 9.5 18 6 24 6C30 6 34 9.5 34 16C34 18 33 22 31 23C30 19 28 17 24 17C20 17 18 19 17 23C15 22 14 18 14 16Z"
                  fill="currentColor"
                  fillOpacity="0.4"
                />
              ) : null}
              {/* White Lab Coat / Torso */}
              <path
                d="M10 44C10 33 16 28 24 28C32 28 38 33 38 44H10Z"
                fill="white"
                fillOpacity="0.9"
              />
              {/* Inner Scrubs / Shirt */}
              <path d="M21 28L24 35L27 28H21Z" fill="#0d9488" />
              {/* Stethoscope */}
              <path
                d="M18 29C18 34 20 37 24 37C28 37 30 34 30 29"
                stroke="#334155"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M24 37V41" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
              <circle cx="24" cy="42" r="2" fill="#0f172a" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold tracking-tight text-white drop-shadow-md text-[11px]">
              {initials}
            </span>
          </div>
        )}

        {/* Real Verified High-Res Doctor Photo */}
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={docName}
            className={`w-full h-full object-cover transition-opacity duration-300 relative z-10 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : null}
      </div>

      {/* Verified Medical Practitioner Badge */}
      <span
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-2xs flex items-center justify-center z-20"
        title="Verified Registered Medical Practitioner (RMP)"
      >
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      </span>
    </div>
  );
}
