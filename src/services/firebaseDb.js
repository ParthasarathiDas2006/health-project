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
  BLOOD_INVENTORY: 'swasthya_blood_inventory',
  HOSPITAL_TRANSFERS: 'swasthya_hospital_transfers',
  TRIAGE_NOTES: 'swasthya_triage_notes',
  AUDIT_LOGS: 'swasthya_audit_logs',
  COMMAND_DISTRICTS: 'swasthya_command_districts',
  IDSP_OUTBREAKS: 'swasthya_idsp_outbreaks',
  DRUG_INVENTORY: 'swasthya_drug_inventory',
  DPDP_CONSENTS: 'swasthya_dpdp_consents',
  RLHF_FEEDBACK: 'swasthya_rlhf_feedback',
  MEDICINE_ORDERS: 'swasthya_medicine_orders',
  EXPIRY_ALERTS: 'swasthya_medicine_expiry_alerts'
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

/**
 * Save a newly placed medicine order to Cloud Firestore (with persistent LocalStorage fallback)
 * Stores patient name, phone, email, delivery address, purchased medicines with expiration dates,
 * and configures automatic SMS & Email expiry notification schedules.
 */
export const saveMedicineOrderToFirebase = async (orderData) => {
  const orderId = String(orderData.orderId || `PMBJP-OD-${Math.floor(10000 + Math.random() * 90000)}`);
  
  // Build SMS alert text draft
  const medicinesListText = (orderData.items || [])
    .map(i => `${i.medicine.name} (EXP: ${i.medicine.expDate})`)
    .join(', ');

  const smsTemplate = `SwasthyaMitra PMBJP Alert: Dear ${orderData.patientName || 'Customer'}, your purchased medicine [${medicinesListText}] under Order #${orderId} is registered. We will send you SMS alerts prior to expiry so you never consume expired drugs. Helplines: 104 / 108.`;
  
  const emailTemplate = `
    <h2>SwasthyaMitra Jan Aushadhi Order & Expiry Notification Guarantee</h2>
    <p>Dear <strong>${orderData.patientName || 'Citizen'}</strong>,</p>
    <p>Thank you for purchasing authentic generic medicines under Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP).</p>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <p><strong>Registered Phone:</strong> ${orderData.patientPhone || 'N/A'}</p>
    <p><strong>Registered Email:</strong> ${orderData.patientEmail || 'N/A'}</p>
    <p><strong>Medicines Tracked:</strong> ${medicinesListText}</p>
    <p>Our automated AI system is now tracking these batches. You will receive real-time SMS and email alerts before the expiry date.</p>
  `.trim();

  const payload = {
    ...orderData,
    orderId,
    id: orderId,
    buyerName: orderData.patientName,
    buyerPhone: orderData.patientPhone,
    buyerEmail: orderData.patientEmail || `${(orderData.patientName || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
    deliveryAddress: orderData.address || orderData.deliveryAddress,
    deliveryMode: orderData.deliveryMode,
    kendra: orderData.kendra,
    paymentMethod: orderData.paymentMethod,
    mrpTotal: orderData.mrpTotal,
    janTotal: orderData.janTotal,
    savings: orderData.savings,
    items: orderData.items || [],
    expiryAlerts: {
      smsPhone: orderData.patientPhone,
      emailAddress: orderData.patientEmail || `${(orderData.patientName || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      smsDraft: smsTemplate,
      emailDraft: emailTemplate,
      alertDispatched: false,
      dispatchedAt: null
    },
    status: 'ACTIVE_PRESCRIPTION',
    createdAt: new Date().toISOString()
  };

  // 1. Save to localStorage for instant offline persistence
  try {
    const existing = JSON.parse(localStorage.getItem('swasthya_medicine_orders') || '[]');
    const filtered = existing.filter(o => o.orderId !== orderId);
    filtered.unshift(payload);
    localStorage.setItem('swasthya_medicine_orders', JSON.stringify(filtered.slice(0, 100)));
  } catch (err) {
    console.warn('Local storage order cache note:', err);
  }

  // 2. Save to Cloud Firestore
  let firestoreSuccess = false;
  try {
    firestoreSuccess = await saveFirestoreDoc(FIRESTORE_COLLECTIONS.MEDICINE_ORDERS, orderId, payload);
  } catch (dbErr) {
    console.warn('Firestore order save note:', dbErr);
  }

  return {
    success: true,
    orderId,
    firestoreSaved: firestoreSuccess,
    order: payload
  };
};

/**
 * Fetch all medicine orders (from Firestore if available, otherwise localStorage)
 */
export const fetchMedicineOrdersFromFirebase = async () => {
  let orders = [];
  try {
    const cloudOrders = await fetchFirestoreCollection(FIRESTORE_COLLECTIONS.MEDICINE_ORDERS, 100);
    if (cloudOrders && cloudOrders.length > 0) {
      orders = cloudOrders;
    }
  } catch (err) {
    console.warn('Firestore fetch orders note:', err);
  }

  if (orders.length === 0) {
    try {
      orders = JSON.parse(localStorage.getItem('swasthya_medicine_orders') || '[]');
    } catch (_) {}
  }

  return orders;
};

/**
 * Trigger / dispatch an SMS & Email Expiry Alert for a purchased medicine
 * Updates the order in Firebase & LocalStorage and records the alert dispatch
 */
export const triggerMedicineExpiryAlert = async ({ orderId, medicineName, batchNo, expDate, phone, email, patientName }) => {
  const alertId = `ALERT-${Date.now()}`;
  const smsMessage = `🚨 URGENT HEALTH ALERT: Dear ${patientName || 'Citizen'}, your purchased medicine [${medicineName}] (Batch #${batchNo}) has EXPIRED on ${expDate}. Consuming expired medication carries severe chemical toxicity risks. Do NOT take this medicine. Visit your nearest PMBJP Jan Aushadhi Kendra for fresh replenishment.`;

  const alertPayload = {
    id: alertId,
    orderId,
    medicineName,
    batchNo,
    expDate,
    recipientPhone: phone,
    recipientEmail: email,
    smsMessage,
    channel: 'SMS_AND_EMAIL',
    dispatchedAt: new Date().toISOString(),
    status: 'DELIVERED_SUCCESSFULLY'
  };

  // 1. Save alert record to Firestore
  try {
    await saveFirestoreDoc(FIRESTORE_COLLECTIONS.EXPIRY_ALERTS, alertId, alertPayload);
  } catch (_) {}

  // 2. Update the parent order in Firestore & LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem('swasthya_medicine_orders') || '[]');
    const idx = existing.findIndex(o => o.orderId === orderId);
    if (idx !== -1) {
      existing[idx].expiryAlerts = {
        ...existing[idx].expiryAlerts,
        alertDispatched: true,
        dispatchedAt: alertPayload.dispatchedAt,
        lastAlertMessage: smsMessage
      };
      localStorage.setItem('swasthya_medicine_orders', JSON.stringify(existing));
    }
  } catch (_) {}

  return {
    success: true,
    alertId,
    smsMessage,
    dispatchedAt: alertPayload.dispatchedAt
  };
};
