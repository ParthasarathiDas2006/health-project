import React, { useState } from 'react';

import { getDoctorPhotoUrl, getDoctorGender, DOCTOR_PHOTOS, FEMALE_NAME_KEYWORDS } from './doctorPhotosUtil';

export { getDoctorPhotoUrl, getDoctorGender, DOCTOR_PHOTOS, FEMALE_NAME_KEYWORDS };

export function DoctorAvatar({ doc, size = 'md', className = '' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const photoUrl = getDoctorPhotoUrl(doc);
  const initials = doc?.initials || 'DR';
  const color = doc?.color || 'from-teal-600 to-emerald-800';

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs rounded-xl',
    md: 'w-13 h-13 text-base rounded-2xl',
    lg: 'w-14 h-14 text-base rounded-2xl',
    xl: 'w-16 h-16 text-lg rounded-2xl'
  }[size] || 'w-13 h-13 text-base rounded-2xl';

  return (
    <div className={`relative shrink-0 select-none ${className}`}>
      <div
        className={`${sizeClasses} text-white font-bold flex items-center justify-center shadow-xs bg-gradient-to-br ${color} overflow-hidden`}
      >
        {photoUrl && !imageError ? (
          <img
            src={photoUrl}
            alt={typeof doc?.name === 'string' ? doc.name : (doc?.name?.['en-IN'] || 'Doctor')}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : null}

        {(!photoUrl || imageError || !imageLoaded) && (
          <span className="absolute inset-0 flex items-center justify-center">
            {initials}
          </span>
        )}
      </div>

      <span
        className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full shadow-2xs flex items-center justify-center"
        title="Verified Medical Practitioner"
      >
        <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
      </span>
    </div>
  );
}
