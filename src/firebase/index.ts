
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import type { FirebaseOptions } from 'firebase/app';

export function initializeFirebase(firebaseConfig: FirebaseOptions): { app: FirebaseApp, auth: Auth, db: Firestore } {
  if (!firebaseConfig.apiKey) {
    throw new Error('Missing Firebase API Key. The configuration object provided to initializeFirebase was missing an apiKey.');
  }
  
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const db = getFirestore(app);

  return { app, auth, db };
}

export * from './provider';
export * from './client-provider';
export * from './auth/use-user';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
