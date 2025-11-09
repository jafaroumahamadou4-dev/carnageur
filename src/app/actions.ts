
'use server';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { z } from 'zod';
import type { FirebaseOptions } from 'firebase/app';


// This function should be defined once, perhaps in a separate config file
function initializeDb() {
    const firebaseConfig: FirebaseOptions = {
        projectId: "studio-2556998890-59a01",
        appId: "1:460495286841:web:64646d8cf9111d40e693e8",
        apiKey: "AIzaSyBbJfuVGEOygqDbP5yLQVmQN9lUbTtl_cQ",
        authDomain: "studio-2556998890-59a01.firebaseapp.com",
        storageBucket: "studio-2556998890-59a01.appspot.com",
        messagingSenderId: "460495286841",
    };

    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    return getFirestore(app);
}


const membershipApplicationSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  promotion: z.string().min(1, 'La promotion est requise.'),
  email: z.string().email("L'email est invalide."),
  phone: z.string().min(1, 'Le téléphone est requis.'),
});

export async function submitMembershipApplication(formData: unknown) {
  const parsedData = membershipApplicationSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Données invalides.' };
  }

  try {
    const db = initializeDb();
    await addDoc(collection(db, 'membershipApplications'), {
      ...parsedData.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: 'Demande envoyée avec succès.' };
  } catch (error) {
    console.error('Error submitting membership application:', error);
    return { success: false, message: "Une erreur s'est produite." };
  }
}

const mentorApplicationSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  contact: z.string().min(1, 'Le contact est requis.'),
  promotion: z.string().min(1, 'La promotion est requise.'),
  field: z.string().min(1, 'Le domaine est requis.'),
  motivation: z.string().min(1, 'La motivation est requise.'),
});

export async function submitMentorApplication(formData: unknown) {
  const parsedData = mentorApplicationSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Données invalides.' };
  }

  try {
    const db = initializeDb();
    await addDoc(collection(db, 'mentorshipRequests'), {
      ...parsedData.data,
      type: 'mentor',
      createdAt: serverTimestamp(),
    });
    return { success: true, message: 'Demande envoyée avec succès.' };
  } catch (error) {
    console.error('Error submitting mentor application:', error);
    return { success: false, message: "Une erreur s'est produite." };
  }
}

const menteeApplicationSchema = z.object({
  name: z.string().min(1, 'Le nom est requis.'),
  email: z.string().email("L'email est invalide."),
  promotion: z.string().min(1, 'La promotion est requise.'),
  domain: z.string().min(1, 'Le domaine est requis.'),
  status: z.enum(['student', 'young_alumni']),
  need: z.string().min(1, 'Le besoin est requis.'),
});

export async function submitMenteeApplication(formData: unknown) {
  const parsedData = menteeApplicationSchema.safeParse(formData);

  if (!parsedData.success) {
    return { success: false, message: 'Données invalides.' };
  }

  try {
    const db = initializeDb();
    await addDoc(collection(db, 'mentorshipRequests'), {
      type: 'mentee',
      name: parsedData.data.name,
      contact: parsedData.data.email,
      promotion: parsedData.data.promotion,
      field: parsedData.data.domain,
      status: parsedData.data.status,
      need: parsedData.data.need,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: 'Demande envoyée avec succès.' };
  } catch (error) {
    console.error('Error submitting mentee application:', error);
    return { success: false, message: "Une erreur s'est produite." };
  }
}
