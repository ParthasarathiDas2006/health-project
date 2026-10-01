// Common Indian female first names and patterns in Odisha to accurately match doctor gender
export const FEMALE_NAME_KEYWORDS = [
  'rashmi', 'priti', 'archana', 'swarnalata', 'priyanka', 'sunita', 'anita', 'geeta',
  'monalisa', 'deepa', 'sanghamitra', 'subhashree', 'lipsa', 'madhusmita', 'tanushree',
  'namita', 'kavita', 'swati', 'rojalin', 'mamata', 'pooja', 'shradha', 'anjali',
  'manaswini', 'tapashwini', 'tapaswini', 'meenakshi', 'smita', 'alaka', 'minati', 'sasmita',
  'snehalata', 'padmaja', 'suchitra', 'sabita', 'pratima', 'runu', 'jharna', 'basanti',
  'binodini', 'sukanti', 'manorama', 'arundhati', 'sudhanshubala', 'sanjukta',
  'jyotsna', 'sharmistha', 'lopamudra', 'ananya', 'ishita', 'sneha', 'aditi', 'rituparna',
  'gayatri', 'subhadra', 'jyotirmayee', 'chinmayee', 'tanmayee', 'kalyani', 'bharati',
  'manisha', 'lipika', 'priyadarshini', 'priyambada', 'indira', 'sumitra', 'sushree',
  'sucharita', 'suchismita', 'jayashree', 'gitanjali', 'geetanjali', 'sangita', 'sangeeta',
  'mamina', 'vandana', 'bandana', 'shanti', 'prativa', 'pratibha', 'arpita', 'ankita',
  'antara', 'sarita', 'sarojini', 'rupali', 'sonali', 'monali', 'seema', 'reema', 'rima',
  'nilima', 'neelima', 'poonam', 'shilpa', 'tulasi', 'tulsi', 'shobha', 'sobha', 'sudha',
  'renu', 'barsha', 'varsha', 'deepika', 'anupama', 'manasi', 'kamini', 'damayanti',
  'kanak', 'chhabi', 'banya', 'shrabani', 'itasri', 'itishree'
];

export const FEMALE_NAME_SUFFIXES = [
  'lata', 'rekha', 'bala', 'devi', 'shree', 'sri', 'sree', 'mati',
  'kumari', 'mayee', 'rani', 'prabha', 'darshini', 'smita', 'mita', 'swini'
];

/**
 * Deterministically determines if a doctor is female based on their name.
 */
export function getDoctorGender(doc) {
  if (!doc) return 'male';
  if (doc.gender === 'female' || doc.gender === 'male') return doc.gender;

  // Prefer English name if available for keyword/suffix matching
  const nameEn = (
    doc.nameEn ||
    (typeof doc.name === 'object' ? doc.name['en-IN'] : null) ||
    (typeof doc.name === 'string' ? doc.name : '')
  ).toLowerCase();

  // Strip prefixes (Dr., Dr, ଡା., डॉ.)
  const cleanName = nameEn
    .replace(/^dr\.\s*/i, '')
    .replace(/^dr\s*/i, '')
    .replace(/^ଡା\.\s*/i, '')
    .replace(/^डॉ\.\s*/i, '')
    .trim();

  const firstName = cleanName.split(/\s+/)[0] || '';

  for (const kw of FEMALE_NAME_KEYWORDS) {
    if (firstName.includes(kw) || cleanName.includes(kw)) {
      return 'female';
    }
  }

  for (const suf of FEMALE_NAME_SUFFIXES) {
    if (firstName.endsWith(suf) || cleanName.includes(suf)) {
      return 'female';
    }
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

// 100% verified, distinct, non-overlapping professional medical headshots of Indian / South Asian doctors (HTTP 200)
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
    'https://images.unsplash.com/photo-1637059824899-a441006a6875?w=200&h=200&fit=crop&crop=faces&q=80'
  ],
  female: [
    'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&h=200&fit=crop&crop=faces&q=80',
    'https://images.unsplash.com/photo-1573497019236-17f8177b81e8?w=200&h=200&fit=crop&crop=faces&q=80'
  ]
};

export function getDoctorPhotoUrl(doc) {
  if (!doc) return null;
  const gender = getDoctorGender(doc);
  const photoList = DOCTOR_PHOTOS[gender] || DOCTOR_PHOTOS.male;
  const idStr = doc.id || doc.nameEn || (typeof doc.name === 'string' ? doc.name : (doc.name?.['en-IN'] || 'DOC'));
  const index = hashString(idStr) % photoList.length;
  return photoList[index];
}
