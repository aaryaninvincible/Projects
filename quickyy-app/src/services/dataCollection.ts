import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firebaseDb, firebaseEnabled } from '../lib/firebase';

type JsonRecord = Record<string, unknown>;

const writeDoc = async (collectionName: string, payload: JsonRecord) => {
  if (!firebaseEnabled || !firebaseDb) return;
  try {
    await addDoc(collection(firebaseDb, collectionName), {
      ...payload,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Failed writing ${collectionName}`, error);
  }
};

export const trackEvent = async (event: string, payload: JsonRecord = {}) =>
  writeDoc('analytics_events', { event, payload });

export const collectReview = async (payload: JsonRecord) => writeDoc('reviews', payload);

export const collectSettings = async (payload: JsonRecord) => writeDoc('user_settings', payload);
