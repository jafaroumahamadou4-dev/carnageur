
'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { initializeFirebase } from '@/firebase';
import { FirebaseProvider } from '@/firebase/provider';
import type { FirebaseApp, FirebaseOptions } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const [firebase, setFirebase] = useState<{
    app: FirebaseApp;
    auth: Auth;
    db: Firestore;
  } | null>(null);

  useEffect(() => {
    // We build the config object here, on the client.
    // Forcing hardcoded values to ensure deployment works.
    const firebaseConfig: FirebaseOptions = {
        projectId: "studio-2556998890-59a01",
        appId: "1:460495286841:web:64646d8cf9111d40e693e8",
        apiKey: "AIzaSyBbJfuVGEOygqDbP5yLQVmQN9lUbTtl_cQ",
        authDomain: "studio-2556998890-59a01.firebaseapp.com",
        storageBucket: "studio-2556998890-59a01.appspot.com",
        messagingSenderId: "460495286841",
    };

    if (firebaseConfig.apiKey) {
      const app = initializeFirebase(firebaseConfig);
      setFirebase(app);
    } else {
        // This block should not be reached anymore.
        console.error("Firebase config is still missing.");
    }
  }, []);

  if (!firebase) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-muted-foreground">Initialisation de la connexion...</p>
            </div>
        </div>
    );
  }

  return (
    <FirebaseProvider
      app={firebase.app}
      auth={firebase.auth}
      db={firebase.db}
    >
      {children}
    </FirebaseProvider>
  );
}
