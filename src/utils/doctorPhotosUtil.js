// Common Indian female first names and patterns in Odisha to accurately match doctor gender
export const FEMALE_NAME_KEYWORDS = [
  'rashmi', 'priti', 'archana', 'swarnalata', 'priyanka', 'sunita', 'anita', 'geeta',
  'monalisa', 'deepa', 'sanghamitra', 'subhashree', 'lipsa', 'madhusmita', 'tanushree',
  'namita', 'kavita', 'swati', 'rojalin', 'mamata', 'pooja', 'shradha', 'anjali',
  'manaswini', 'tapashwini', 'meenakshi', 'smita', 'alaka', 'minati', 'sasmita',
  'snehalata', 'padmaja', 'suchitra', 'sabita', 'pratima', 'runu', 'jharna', 'basanti',
  'binodini', 'sukanti', 'manorama', 'arundhati', 'sudhanshubala', 'sanjukta',
  'jyotsna', 'sharmistha', 'lopamudra', 'ananya', 'ishita', 'sneha', 'aditi', 'rituparna'
];

/**
 * Deterministically determines if a doctor is female based on their name.
 */
export function getDoctorGender(doc) {
  if (doc?.gender) return doc.gender;
  const nameEn = (doc?.name?.['en-IN'] || doc?.name || '').toLowerCase();
  const cleanName = nameEn.replace(/^dr\.\s*/i, '').trim();
  const firstName = cleanName.split(/\s+/)[0] || '';

  for (const kw of FEMALE_NAME_KEYWORDS) {
    if (firstName.includes(kw) || cleanName.includes(kw)) {
      return 'female';
    }
  }

  // Common female suffix endings in Odia/Indian names
  if (
    firstName.endsWith('lata') ||
    firstName.endsWith('rekha') ||
    firstName.endsWith('bala') ||
    firstName.endsWith('devi') ||
    firstName.endsWith('shree') ||
    firstName.endsWith('sri') ||
    firstName.endsWith('mati') ||
    firstName.endsWith('kumari')
  ) {
    return 'female';
  }

  return 'male';
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Curated high-resolution professional medical headshots of Indian/South Asian doctors
export const DOCTOR_PHOTOS = {
  male: [
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1582753380962-e64e52e90c8a?w=200&h=200&fit=crop&crop=faces&q=80'
  ],
  female: [
    'https://images.unsplash.com/photo-1594824813572-88285521b4a3?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1584516150909-c43483ee7932?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200&h=200&fit=crop&crop=faces&q=80'
  ]
};

export function getDoctorPhotoUrl(doc) {
  if (!doc) return null;
  const gender = getDoctorGender(doc);
  const photoList = DOCTOR_PHOTOS[gender];
  const idStr = doc.id || doc.name?.['en-IN'] || doc.name || 'DOC';
  const index = hashString(idStr) % photoList.length;
  return photoList[index];
}
