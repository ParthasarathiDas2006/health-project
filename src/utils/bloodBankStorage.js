/**
 * Storage utility for Blood Requests & Donor Pledges
 */

const BLOOD_REQUESTS_KEY = 'triage_blood_requests';
const DONOR_PLEDGES_KEY = 'triage_blood_donor_pledges';

export const getBloodRequests = () => {
  try {
    const raw = localStorage.getItem(BLOOD_REQUESTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load blood requests:', e);
    return [];
  }
};

export const saveBloodRequest = (requestData) => {
  const current = getBloodRequests();
  const newReq = {
    ...requestData,
    id: `REQ-BLD-${Math.floor(100000 + Math.random() * 900000)}`,
    createdAt: new Date().toISOString(),
    status: 'CONFIRMED'
  };
  const updated = [newReq, ...current];
  localStorage.setItem(BLOOD_REQUESTS_KEY, JSON.stringify(updated));
  return newReq;
};

export const getDonorPledges = () => {
  try {
    const raw = localStorage.getItem(DONOR_PLEDGES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load donor pledges:', e);
    return [];
  }
};

export const saveDonorPledge = (donorData) => {
  const current = getDonorPledges();
  const newPledge = {
    ...donorData,
    id: `DNR-OD-${Math.floor(100000 + Math.random() * 900000)}`,
    pledgeDate: new Date().toISOString(),
    status: 'ACTIVE'
  };
  const updated = [newPledge, ...current];
  localStorage.setItem(DONOR_PLEDGES_KEY, JSON.stringify(updated));
  return newPledge;
};
