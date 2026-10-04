/**
 * Cloud Firestore Database Service for SwasthyaMitra
 * Manages collections for Users, Appointments, Bed Bookings, Ambulance, Blood Bank,
 * Triage Assessments, Hospital Transfers, and Security Audit Logs.
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { getFirestoreDb, isFirebaseConfigured } from '../config/firebase';

export const FIRESTORE_COLLECTIONS = {
  USERS: 'swasthya_users',
  APPOINTMENTS: 'swasthya_appointments',
  BED_BOOKINGS: 'swasthya_bed_bookings',
  BED_BOOKINGS_ALT: 'swasthya_bed_booking',
  AMBULANCE_REQUESTS: 'swasthya_ambulance_requests',
  BLOOD_REQUESTS: 'swasthya_blood_requests',
  BLOOD_DONORS: 'swasthya_blood_donors',
  HOSPITAL_TRANSFERS: 'swasthya_hospital_transfers',
  TRIAGE_NOTES: 'swasthya_triage_notes',
  AUDIT_LOGS: 'swasthya_audit_logs'
};

/**
 * Fetch all documents in a specified Firestore collection
 */
export const fetchFirestoreCollection = async (collectionName, maxItems = 150) => {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  try {
    const colRef = collection(db, collectionName);
    const q = query(colRef, limit(maxItems));
    const querySnapshot = await getDocs(q);

    const items = [];
    querySnapshot.forEach((docSnap) => {
      items.push({ ...docSnap.data(), id: docSnap.id });
    });

    // Auto-detect singular/plural collection created by user in Firebase console
    if (items.length === 0 && collectionName === FIRESTORE_COLLECTIONS.BED_BOOKINGS) {
      try {
        const altRef = collection(db, FIRESTORE_COLLECTIONS.BED_BOOKINGS_ALT);
        const altSnap = await getDocs(query(altRef, limit(maxItems)));
        altSnap.forEach((docSnap) => {
          items.push({ ...docSnap.data(), id: docSnap.id });
        });
      } catch (_) {}
    }

    return items;
  } catch (error) {
    console.error(`Failed to fetch Firestore collection "${collectionName}":`, error);
    return null;
  }
};

/**
 * Save or update a single document in Firestore
 */
export const saveFirestoreDoc = async (collectionName, docId, data) => {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const cleanId = String(docId || data.id || `DOC-${Date.now()}`);
    const docRef = doc(db, collectionName, cleanId);
    
    const payload = {
      ...data,
      id: cleanId,
      _updatedAt: new Date().toISOString()
    };

    await setDoc(docRef, payload, { merge: true });

    // Also mirror to swasthya_bed_booking if bed bookings so user sees it in their exact console collection
    if (collectionName === FIRESTORE_COLLECTIONS.BED_BOOKINGS) {
      try {
        const altRef = doc(db, FIRESTORE_COLLECTIONS.BED_BOOKINGS_ALT, cleanId);
        await setDoc(altRef, payload, { merge: true });
      } catch (_) {}
    }

    return true;
  } catch (error) {
    console.error(`Failed to save doc in "${collectionName}":`, error);
    return false;
  }
};

/**
 * Delete a document from Firestore
 */
export const deleteFirestoreDoc = async (collectionName, docId) => {
  const db = getFirestoreDb();
  if (!db) return false;

  try {
    const docRef = doc(db, collectionName, String(docId));
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Failed to delete doc "${docId}" in "${collectionName}":`, error);
    return false;
  }
};

/**
 * Subscribe to real-time updates for a Firestore collection
 */
export const subscribeFirestoreCollection = (collectionName, callback, errorCallback) => {
  const db = getFirestoreDb();
  if (!db) return () => {};

  try {
    const colRef = collection(db, collectionName);
    const unsubscribe = onSnapshot(
      colRef,
      (snapshot) => {
        const items = [];
        snapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id });
        });
        callback(items);
      },
      (err) => {
        console.error(`Snapshot error on ${collectionName}:`, err);
        if (errorCallback) errorCallback(err);
      }
    );
    return unsubscribe;
  } catch (err) {
    console.error(`Error attaching listener for ${collectionName}:`, err);
    return () => {};
  }
};

/**
 * Batch upload an array of items to a Firestore collection
 */
export const uploadBatchToFirestore = async (collectionName, items) => {
  const db = getFirestoreDb();
  if (!db) return { success: false, error: 'Database not initialized' };

  if (!Array.isArray(items) || items.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const batch = writeBatch(db);
    let count = 0;

    for (const item of items) {
      const docId = String(item.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`);
      const docRef = doc(db, collectionName, docId);
      batch.set(docRef, { ...item, id: docId, _syncedAt: new Date().toISOString() }, { merge: true });

      if (collectionName === FIRESTORE_COLLECTIONS.BED_BOOKINGS) {
        const altRef = doc(db, FIRESTORE_COLLECTIONS.BED_BOOKINGS_ALT, docId);
        batch.set(altRef, { ...item, id: docId, _syncedAt: new Date().toISOString() }, { merge: true });
      }

      count++;
    }

    await batch.commit();
    return { success: true, count };
  } catch (error) {
    console.error(`Batch upload failed for ${collectionName}:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Comprehensive sync: Push all local storage entities into Cloud Firestore
 */
export const syncAllLocalDataToFirestore = async () => {
  if (!isFirebaseConfigured()) {
    return { success: false, message: 'Firebase is not yet configured.' };
  }

  const results = {};

  try {
    // 1. Users
    const rawUsers = localStorage.getItem('triage_registered_users');
    if (rawUsers) {
      const parsed = JSON.parse(rawUsers);
      results.users = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.USERS, parsed);
    }

    // 2. Appointments
    const rawAppts = localStorage.getItem('triage_booked_appointments');
    if (rawAppts) {
      const parsed = JSON.parse(rawAppts);
      results.appointments = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.APPOINTMENTS, parsed);
    }

    // 3. Bed Bookings
    const rawBeds = localStorage.getItem('triage_bed_bookings');
    if (rawBeds) {
      const parsed = JSON.parse(rawBeds);
      results.bedBookings = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.BED_BOOKINGS, parsed);
    }

    // 4. Ambulance Requests
    const rawAmb = localStorage.getItem('triage_ambulance_requests');
    if (rawAmb) {
      const parsed = JSON.parse(rawAmb);
      results.ambulanceRequests = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.AMBULANCE_REQUESTS, parsed);
    }

    // 5. Hospital Transfers
    const rawTrans = localStorage.getItem('triage_hospital_transfers');
    if (rawTrans) {
      const parsed = JSON.parse(rawTrans);
      results.hospitalTransfers = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.HOSPITAL_TRANSFERS, parsed);
    }

    // 6. Blood Requests & Donors
    const rawBloodReq = localStorage.getItem('triage_blood_requests');
    if (rawBloodReq) {
      const parsed = JSON.parse(rawBloodReq);
      results.bloodRequests = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.BLOOD_REQUESTS, parsed);
    }

    const rawDonors = localStorage.getItem('triage_blood_donor_pledges');
    if (rawDonors) {
      const parsed = JSON.parse(rawDonors);
      results.bloodDonors = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.BLOOD_DONORS, parsed);
    }

    // 7. Audit Logs
    const rawLogs = localStorage.getItem('triage_system_audit_logs');
    if (rawLogs) {
      const parsed = JSON.parse(rawLogs);
      results.auditLogs = await uploadBatchToFirestore(FIRESTORE_COLLECTIONS.AUDIT_LOGS, parsed);
    }

    return {
      success: true,
      message: 'All local data successfully synced to Cloud Firestore!',
      details: results
    };
  } catch (error) {
    console.error('Error during full data sync to Firestore:', error);
    return {
      success: false,
      message: error.message || 'Sync failed.'
    };
  }
};
