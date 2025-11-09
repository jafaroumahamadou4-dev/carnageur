
'use client';

import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartHandshake, Milestone, GraduationCap, Award, UserPlus, Loader2 } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, type DocumentData } from 'firebase/firestore';
import { PostCard } from '@/app/students/components/post-card';
import { MentorshipSection } from './components/mentorship-dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { submitMembershipApplication } from '@/app/actions';


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

interface Alumnus extends DocumentData {
  id: string;
  name: string;
  promotion: string;
  testimonial: string;
  photoURL: string;
}

const eventImage = PlaceHolderImages.find(p => p.id === 'event-image');
const examplePost: Post = {
  id: 'example-1',
  title: "Lancement du programme de mentorat 2024",
  content: "L'Amicale a le plaisir d'annoncer le lancement officiel de son programme de mentorat annuel. Les anciens élèves expérimentés sont invités à s'inscrire pour guider la nouvelle génération. Les élèves actuels et jeunes diplômés peuvent également postuler pour trouver un mentor.",
  association: 'amicale',
  authorName: "Bureau de l'Amicale",
  authorPhotoURL: '',
  imageURL: eventImage?.imageUrl,
  createdAt: {
    seconds: Math.floor(Date.now() / 1000),
    nanoseconds: 0,
  }
};

const exampleAlumniPortraits: Alumnus[] = [
    { id: '1', name: 'Aïchatou Ibrahim', promotion: '2005 - Génie Civil', photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MjI0NDMxOHww&ixlib=rb-4.1.0&q=80&w=1080', testimonial: 'Le LTDK m\'a donné les bases solides pour devenir l\'ingénieure que je suis aujourd\'hui.' },
    { id: '2', name: 'Moussa Hamidou', promotion: '2008 - Électrotechnique', photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIxODc0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080', testimonial: 'Une formation d\'excellence qui ouvre les portes des plus grandes entreprises.' },
    { id: '3', name: 'Fatima Saley', promotion: '2012 - Comptabilité', photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIyODA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080', testimonial: 'Les valeurs de rigueur et de discipline apprises ici me servent chaque jour.' },
];

function MembershipForm() {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        const result = await submitMembershipApplication(data);
        if (result.success) {
            toast({
                title: "Demande d'adhésion envoyée",
                description: "Merci ! Votre demande a été reçue. Nous vous contacterons bientôt.",
            });
            reset();
        } else {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: result.message || "Une erreur s'est produite lors de l'envoi de votre demande.",
            });
        }
    };

    return (
        <section className="mt-24">
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-accent text-accent-foreground rounded-full p-3 w-fit">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <CardTitle className="mt-4">Rejoindre l'Amicale</CardTitle>
                    <CardDescription>
                        Remplissez ce formulaire pour devenir membre de l'Amicale des Anciens Élèves du LTDK.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input id="name" {...register('name', { required: 'Le nom complet est requis.' })} placeholder="Votre nom" />
                                {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="promotion">Promotion</Label>
                                <Input id="promotion" {...register('promotion', { required: 'La promotion est requise.' })} placeholder="Ex: 2012 - F4" />
                                {errors.promotion && <p className="text-sm text-destructive">{String(errors.promotion.message)}</p>}
                            </div>
                        </div>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Adresse Email</Label>
                                <Input id="email" type="email" {...register('email', { required: 'Un email valide est requis.'})} placeholder="votre.email@example.com" />
                                {errors.email && <p className="text-sm text-destructive">{String(errors.email.message)}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Numéro de téléphone</Label>
                                <Input id="phone" type="tel" {...register('phone', { required: 'Le numéro de téléphone est requis.'})} placeholder="+227 XX XX XX XX" />
                                {errors.phone && <p className="text-sm text-destructive">{String(errors.phone.message)}</p>}
                            </div>
                        </div>
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Soumettre ma demande d'adhésion
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
}

export default function AlumniPage() {
  const amicaleLogo = PlaceHolderImages.find(p => p.id === 'amicale-logo');

  const objectives = [
      { icon: HeartHandshake, title: "Réseau et Solidarité", description: "Renforcer les liens et l'entraide entre les anciens et actuels élèves." },
      { icon: Milestone, title: "Rayonnement du Lycée", description: "Contribuer à la renommée et au développement du LTDK." },
      { icon: GraduationCap, title: "Soutien aux Élèves", description: "Appuyer matériellement, moralement et via du mentorat." },
      { icon: Award, title: "Promotion de l'Excellence", description: "Organiser des événements comme le 'Prix de l'Excellence' pour motiver les élèves." },
  ]
  
  const db = useFirestore();
  
  const postsQuery = db 
    ? query(
        collection(db, 'posts'), 
        where('association', '==', 'amicale'),
        orderBy('createdAt', 'desc')
      ) 
    : null;
  const { data: posts, loading: postsLoading } = useCollection<Post>(postsQuery);

  const alumniQuery = db 
    ? query(collection(db, 'alumniPortraits'), orderBy('order', 'asc'))
    : null;
  const { data: alumni, loading: alumniLoading } = useCollection<Alumnus>(alumniQuery);

  const alumniPortraits = (alumni && alumni.length > 0) ? alumni : exampleAlumniPortraits;

  return (
    <div className="bg-muted/40">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
            {amicaleLogo && (
                <Image
                src={amicaleLogo.imageUrl}
                alt={amicaleLogo.description}
                width={150}
                height={150}
                className="mx-auto mb-6"
                data-ai-hint={amicaleLogo.imageHint}
                />
            )}
          <h1 className="text-4xl font-bold text-primary">Amicale des Anciens Élèves du LTDK (AELTDK)</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Ensemble, pour le rayonnement du LTDK et la réussite de ses élèves.
          </p>
        </div>

        <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Objectifs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {objectives.map(obj => (
                    <Card key={obj.title} className="text-center">
                        <CardHeader className="items-center">
                            <div className="p-4 bg-primary text-primary-foreground rounded-full">
                                <obj.icon className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">{obj.title}</h3>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{obj.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">Activités de l'Amicale</h2>
           <div className="space-y-6 max-w-4xl mx-auto">
              {postsLoading && (
                <div className="flex justify-center items-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              {!postsLoading && posts && posts.length > 0 && (
                posts.map(post => <PostCard key={post.id} post={post} />)
              )}
               {!postsLoading && (!posts || posts.length === 0) && (
                 <PostCard post={examplePost} />
              )}
            </div>
        </section>

        <section className="mt-24">
          <h2 className="mb-12 text-center text-3xl font-bold">Portraits d'Anciens</h2>
          {alumniLoading ? (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {alumniPortraits.map((alumnus) => (
                <Card key={alumnus.id} className="overflow-hidden">
                    <CardHeader className="flex-row items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={alumnus.photoURL} alt={alumnus.name} />
                        <AvatarFallback>{alumnus.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-2xl font-semibold leading-none tracking-tight">{alumnus.name}</h3>
                        <CardDescription>{alumnus.promotion}</CardDescription>
                    </div>
                    </CardHeader>
                    <CardContent>
                    <blockquote className="border-l-2 pl-4 text-sm italic text-muted-foreground">
                        "{alumnus.testimonial}"
                    </blockquote>
                    </CardContent>
                </Card>
                ))}
            </div>
           )}
        </section>

        <MentorshipSection />
        
        <MembershipForm />

      </div>
    </div>
  );
}

    