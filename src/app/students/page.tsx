
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Award, Briefcase, Lightbulb, Loader2, Moon, Sparkles, Handshake } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, orderBy, type DocumentData } from 'firebase/firestore';
import { PostCard } from './components/post-card';

interface Post extends DocumentData {
  id: string;
  title: string;
  content: string;
  association: 'cjm' | 'ajp' | 'amicale';
  authorName: string;
  authorPhotoURL?: string;
  imageURL?: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function StudentsPage() {
  const galleryImg1 = PlaceHolderImages.find(p => p.id === 'gallery-1');
  const galleryImg2 = PlaceHolderImages.find(p => p.id === 'gallery-2');

  const opportunities = [
    { icon: Award, title: "Bourse d'Excellence AELTDK", description: "Récompense les meilleurs élèves de chaque filière pour leurs performances académiques.", status: "Ouvert" },
    { icon: Briefcase, title: "Stages de vacances chez Nigelec", description: "Immersion professionnelle pour les élèves en électrotechnique et maintenance.", status: "Fermé" },
    { icon: Sparkles, title: "Concours National d'Innovation", description: "Participez et représentez le LTDK avec vos projets les plus créatifs.", status: "À venir" },
  ];

  const db = useFirestore();
  const postsQuery = db ? query(collection(db, 'posts'), orderBy('createdAt', 'desc')) : null;
  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  return (
    <div className="bg-muted/40">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-primary">Espace Élèves</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Le cœur de la vie étudiante, des associations et des opportunités au LTDK.
          </p>
        </div>

        <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">La Vie Associative</h2>
             <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader className="items-center text-center">
                        <div className="p-4 bg-primary text-primary-foreground rounded-full">
                            <Moon className="h-8 w-8" />
                        </div>
                        <CardTitle>Club des Jeunes Musulmans (CJM)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground text-center">Le CJM organise des activités culturelles, des cours de soutien et des actions sociales pour renforcer la fraternité et les valeurs morales au sein du lycée.</p>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader className="items-center text-center">
                         <div className="p-4 bg-primary text-primary-foreground rounded-full">
                            <Handshake className="h-8 w-8" />
                        </div>
                        <CardTitle>Association des Jeunes Progressistes (AJP)</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground text-center">L'AJP promeut l'engagement citoyen, l'excellence académique et l'ouverture d'esprit à travers des débats, des conférences et des projets communautaires.</p>
                    </CardContent>
                </Card>
            </div>
        </section>


        <Tabs defaultValue="associations" className="mt-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="associations">Fil d'Actualités Associatif</TabsTrigger>
            <TabsTrigger value="opportunities">Opportunités</TabsTrigger>
          </TabsList>
          
          <TabsContent value="associations">
            <div className="mt-6 space-y-6">
              {postsLoading && (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {!postsLoading && posts && posts.length > 0 && (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
               {!postsLoading && (!posts || posts.length === 0) && (
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle>Aucune publication pour le moment</CardTitle>
                    <CardDescription>Revenez bientôt pour voir les actualités des associations !</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="opportunities">
            <Card className="mt-6">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-6 w-6 text-accent"/>
                  <CardTitle>Tableau des Opportunités</CardTitle>
                </div>
                <CardDescription>
                  Bourses, stages, concours... Retrouvez ici les opportunités pour enrichir votre parcours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {opportunities.map((opp, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-md border p-4">
                      <opp.icon className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                      <div className="flex-grow">
                        <h3 className="font-semibold">{opp.title}</h3>
                        <p className="text-sm text-muted-foreground">{opp.description}</p>
                      </div>
                      <div className={`text-xs font-semibold px-2 py-1 rounded-full ${opp.status === 'Ouvert' ? 'bg-green-100 text-green-800' : opp.status === 'Fermé' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                        {opp.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <section className="mt-24">
          <h2 className="mb-12 text-center text-3xl font-bold">Galerie de la Vie Étudiante</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <Card className="overflow-hidden">
                {galleryImg1 && <Image src={galleryImg1.imageUrl} alt={galleryImg1.description} data-ai-hint={galleryImg1.imageHint} width={600} height={400} className="w-full h-auto object-cover"/>}
                <CardHeader>
                    <CardTitle>Club Robotique en action</CardTitle>
                </CardHeader>
            </Card>
             <Card className="overflow-hidden">
                {galleryImg2 && <Image src={galleryImg2.imageUrl} alt={galleryImg2.description} data-ai-hint={galleryImg2.imageHint} width={600} height={400} className="w-full h-auto object-cover"/>}
                <CardHeader>
                    <CardTitle>Journée culturelle</CardTitle>
                </CardHeader>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
}

    