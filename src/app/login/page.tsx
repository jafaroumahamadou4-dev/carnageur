
'use client';

import { useEffect } from 'react';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Chrome, Loader2 } from 'lucide-react';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';


export default function LoginPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();


  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    if (!db || !auth) {
        console.error("Firebase services are not available yet.");
        // Optionally, show a toast to the user
        return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
       if (user) {
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }, { merge: true });
        router.push('/');
      }
    } catch (error) {
      console.error('Error signing in with Google: ', error);
    }
  };

  if (loading || user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
        </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>Accédez à votre espace membre.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full" disabled={!db || loading}>
            {(!db || loading) ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Chrome className="mr-2 h-5 w-5" />}
            {(!db || loading) ? 'Initialisation...' : 'Se connecter avec Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
