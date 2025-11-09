
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowRight, BookOpen, Briefcase, GraduationCap, Newspaper, Phone, Building, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useDoc, useFirestore, useCollection } from '@/firebase';
import { doc, collection, query, orderBy, limit, where, type DocumentData } from 'firebase/firestore';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SchoolOfficial extends DocumentData {
  name: string;
  role: string;
  message: string;
  photoURL: string;
}

interface Post extends DocumentData {
  id: string;
  title: string;
  content: string;
  association?: 'cjm' | 'ajp' | 'amicale';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-background');
  const fallbackProviseurImage = PlaceHolderImages.find(p => p.id === 'proviseur-portrait');

  const db = useFirestore();
  const headmasterDocRef = db ? doc(db, 'schoolOfficials', 'headmaster') : null;
  const { data: headmasterData, loading: headmasterLoading } = useDoc<SchoolOfficial>(headmasterDocRef);

  const postsQuery = db 
    ? query(
        collection(db, 'posts'), 
        where('association', '==', ''),
        orderBy('createdAt', 'desc'),
        limit(3)
      ) 
    : null;
  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  const proviseur = {
      name: headmasterData?.name || "M. Noungo Oumarou",
      role: headmasterData?.role || "Proviseur du LTDK",
      message: headmasterData?.message || "\"C'est avec une immense fierté que je vous accueille sur le site de notre prestigieux établissement. Le LTDK est plus qu'une école, c'est une famille unie par l'excellence, la discipline et la solidarité. Nous formons aujourd'hui les leaders techniques de demain. Rejoignez-nous dans cette belle aventure.\"",
      photoURL: headmasterData?.photoURL || fallbackProviseurImage?.imageUrl,
      photoDescription: headmasterData?.name || "Portrait du proviseur",
      photoHint: fallbackProviseurImage?.imageHint || "man portrait"
  }

  const quickLinks = [
    { title: 'Le Lycée', icon: Building, href: '/school', description: 'Découvrez notre histoire et nos valeurs.' },
    { title: 'Filières', icon: Briefcase, href: '/courses', description: 'Explorez nos programmes de formation.' },
    { title: 'Anciens', icon: GraduationCap, href: '/alumni', description: 'Rejoignez le réseau des anciens élèves.' },
    { title: 'Bibliothèque', icon: BookOpen, href: '/library', description: 'Accédez aux ressources pédagogiques.' },
    { title: 'Contact', icon: Phone, href: '/contact', description: 'Prenez contact avec notre administration.' },
  ];

  const defaultNewsItems = [
    { id: '1', title: 'Concours national d\'innovation', createdAt: { seconds: new Date('2024-05-15T10:00:00').getTime() / 1000, nanoseconds: 0 }, content: 'Nos élèves remportent le premier prix avec leur projet de drone agricole.' },
    { id: '2', title: 'Visite du Ministre de l\'Éducation', createdAt: { seconds: new Date('2024-05-02T10:00:00').getTime() / 1000, nanoseconds: 0 }, content: 'Le ministre a salué l\'excellence de nos infrastructures et formations.' },
    { id: '3', title: 'Journée portes ouvertes', createdAt: { seconds: new Date('2024-04-20T10:00:00').getTime() / 1000, nanoseconds: 0 }, content: 'Un grand succès avec plus de 500 visiteurs découvrant le lycée.' },
  ];

  const newsItems = !postsLoading && posts && posts.length > 0 ? posts : defaultNewsItems;


  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] min-h-[400px] w-full">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            data-ai-hint={heroImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-primary-foreground">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Lycée Technique Dan Kassawa de Maradi
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Ensemble bâtissons le Niger
          </p>
          <Button asChild className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/courses">Découvrir les filières <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="container">
          <Card className="overflow-hidden md:grid md:grid-cols-3">
            <div className="p-8 md:col-span-2">
              <h2 className="text-3xl font-bold text-primary">Message de bienvenue du Proviseur</h2>
              {headmasterLoading ? (
                  <div className="mt-6 flex items-center justify-center h-24">
                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
              ) : (
                <blockquote className="mt-6 border-l-4 border-accent pl-6 text-muted-foreground">
                    <p className="text-lg">
                    {proviseur.message}
                    </p>
                </blockquote>
              )}
            </div>
            <div className="flex flex-col items-center justify-center bg-muted/50 p-8">
              {headmasterLoading ? (
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : proviseur.photoURL && (
                 <Avatar className="h-32 w-32 border-4 border-accent">
                    <AvatarImage src={proviseur.photoURL} alt={proviseur.photoDescription} data-ai-hint={proviseur.photoHint}/>
                    <AvatarFallback>{proviseur.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
              )}
              <h3 className="mt-4 text-xl font-semibold">{proviseur.name}</h3>
              <p className="text-muted-foreground">{proviseur.role}</p>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Accès Rapide</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {quickLinks.map((link) => (
              <Link href={link.href} key={link.href} className="group">
                <Card className="h-full text-center transition-all duration-300 hover:border-primary hover:shadow-lg">
                  <CardHeader className="flex flex-col items-center gap-4">
                    <div className="rounded-full bg-primary p-4 text-primary-foreground transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <link.icon className="h-8 w-8" />
                    </div>
                    <CardTitle>{link.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{link.description}</p>

                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted/40 py-16 md:py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">Actualités Récentes</h2>
           {postsLoading ? (
             <div className="flex justify-center items-center h-48">
               <Loader2 className="h-10 w-10 animate-spin text-primary" />
             </div>
           ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {newsItems.map((item) => (
                <Card key={item.id} className="flex flex-col">
                    <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="rounded-md bg-accent p-3 text-accent-foreground">
                            <Newspaper className="h-6 w-6"/>
                        </div>
                        <div>
                            <CardTitle className="text-lg">{item.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                {format(new Date(item.createdAt.seconds * 1000), 'd MMMM yyyy', { locale: fr })}
                            </p>
                        </div>
                    </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{item.content}</p>
                    </CardContent>
                </Card>
                ))}
            </div>
           )}
        </div>
      </section>
    </div>
  );
}

    