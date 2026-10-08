/**
 * Unsplash Medical Images Service
 * Handles live photo fetching from Unsplash API using VITE_UNSPLASH_ACCESS_KEY
 * Falls back seamlessly to curated high-res Indian doctor photos
 */

import { DOCTOR_PHOTOS } from '../utils/doctorPhotosUtil';

const UNSPLASH_CACHE_KEY = 'swasthyamitra_unsplash_photos_v1';

// Read access key from environment or localStorage
export function getUnsplashAccessKey() {
  return (
    import.meta.env.VITE_UNSPLASH_ACCESS_KEY ||
    (typeof window !== 'undefined' ? window.__UNSPLASH_ACCESS_KEY__ || localStorage.getItem('VITE_UNSPLASH_ACCESS_KEY') : null) ||
    ''
  ).trim();
}

export function setUnsplashAccessKey(key) {
  if (typeof window !== 'undefined') {
    if (key) {
      localStorage.setItem('VITE_UNSPLASH_ACCESS_KEY', key.trim());
      window.__UNSPLASH_ACCESS_KEY__ = key.trim();
    } else {
      localStorage.removeItem('VITE_UNSPLASH_ACCESS_KEY');
      delete window.__UNSPLASH_ACCESS_KEY__;
    }
  }
}

/**
 * Fetches real doctor portraits directly from Unsplash API using the Access Key
 */
export async function fetchUnsplashDoctorPhotos(accessKey = getUnsplashAccessKey()) {
  if (!accessKey) {
    return null;
  }

  // Check cached photos in localStorage (valid for 24 hours)
  try {
    const cached = localStorage.getItem(UNSPLASH_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000 && parsed.photos?.male?.length && parsed.photos?.female?.length) {
        return parsed.photos;
      }
    }
  } catch (e) {
    console.warn('Failed to read unsplash cache:', e);
  }

  const queries = {
    male: ['indian doctor', 'male doctor', 'doctor portrait'],
    female: ['female doctor', 'indian female doctor', 'woman doctor hospital']
  };

  const results = {
    male: [...DOCTOR_PHOTOS.male],
    female: [...DOCTOR_PHOTOS.female]
  };

  try {
    for (const [gender, queryList] of Object.entries(queries)) {
      const fetchedList = [];
      for (const q of queryList) {
        try {
          const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=30&client_id=${accessKey}`;
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              for (const item of data.results) {
                const u = item.urls.raw
                  ? `${item.urls.raw}&auto=format&fit=crop&w=320&h=320&crop=faces&q=80`
                  : `${item.urls.small || item.urls.regular}&auto=format&fit=crop&w=320&h=320&crop=faces&q=80`;
                if (!fetchedList.includes(u)) fetchedList.push(u);
              }
            }
          }
        } catch (e) {
          console.warn(`Query failed: ${q}`, e);
        }
      }
      if (fetchedList.length > 0) {
        results[gender] = [...fetchedList, ...DOCTOR_PHOTOS[gender]];
      }
    }

    // Cache the retrieved photos
    try {
      localStorage.setItem(
        UNSPLASH_CACHE_KEY,
        JSON.stringify({
          timestamp: Date.now(),
          photos: results
        })
      );
    } catch (e) {
      // Storage full or private mode
    }

    return results;
  } catch (err) {
    console.error('Failed to fetch Unsplash photos:', err);
    return null;
  }
}
