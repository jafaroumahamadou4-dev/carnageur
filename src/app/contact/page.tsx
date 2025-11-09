
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react';
import { useDoc, useFirestore } from '@/firebase';
import { doc, type DocumentData } from 'firebase/firestore';

interface ContactInfo extends DocumentData {
  address: string;
  phone: string;
  email: string;
  googleMapsEmbedUrl?: string;
}

export default function ContactPage() {
  const db = useFirestore();
  const contactInfoRef = db ? doc(db, 'contactInfo', 'main') : null;
  const { data: contactInfo, loading: contactInfoLoading } = useDoc<ContactInfo>(contactInfoRef);

  const defaultContactInfo: ContactInfo = {
    address: 'Lycée Technique Dan Kassawa, BP 123, Maradi, Niger',
    phone: '+227 20 00 00 00',
    email: 'contact@ltdk-maradi.ne',
    googleMapsEmbedUrl: undefined,
  };

  const finalContactInfo = contactInfo || defaultContactInfo;

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">Contactez-nous</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Nous sommes à votre écoute pour toute question ou information.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Envoyer un message</CardTitle>
              <CardDescription>Remplissez le formulaire et nous vous répondrons rapidement.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" placeholder="Votre nom complet" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Votre email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Sujet</Label>
                  <Input id="subject" placeholder="Sujet de votre message" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Votre message..." rows={5} />
                </div>
                <Button type="submit" className="w-full">Envoyer</Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
            <h2 className="text-2xl font-bold">Nos Coordonnées</h2>
            {contactInfoLoading ? (
                 <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="space-y-4 text-muted-foreground">
                    <div className="flex items-start gap-4">
                        <MapPin className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold text-foreground">Adresse</h3>
                            <p>{finalContactInfo.address}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Phone className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold text-foreground">Téléphone</h3>
                            <p>{finalContactInfo.phone}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <Mail className="h-6 w-6 text-accent mt-1"/>
                        <div>
                            <h3 className="font-semibold text-foreground">Email</h3>
                            <a href={`mailto:${finalContactInfo.email}`} className="hover:text-primary">{finalContactInfo.email}</a>
                        </div>
                    </div>
                </div>
            )}

             <div className="aspect-video w-full overflow-hidden rounded-lg border">
                {finalContactInfo.googleMapsEmbedUrl ? (
                    <iframe
                        src={finalContactInfo.googleMapsEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                        <MapPin className="h-8 w-8 mr-2"/>
                        Carte Google Maps
                    </div>
                )}
             </div>
        </div>
      </div>
    </div>
  );
}
