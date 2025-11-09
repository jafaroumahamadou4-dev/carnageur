
'use client';

import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const mentors = [
  {
    name: 'Aïchatou Ibrahim',
    promotion: '2005 - Génie Civil',
    company: 'Ingénieur chez SATOM',
    photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHx3b21hbiUyMHBvcnRyYWl0fGVufDB8fHx8MTc2MjI0NDMxOHww&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Spécialisée dans la construction de ponts et chaussées, passionnée par le transfert de compétences.'
  },
  {
    name: 'Moussa Hamidou',
    promotion: '2008 - Électrotechnique',
    company: 'Chef de projet à la NIGELEC',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIxODc0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'Expert en réseaux électriques haute tension et en gestion de projets énergétiques.'
  },
  {
    name: 'Fatima Saley',
    promotion: '2012 - Comptabilité',
    company: 'Auditrice chez Deloitte',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxwZXJzb24lMjBwb3J0cmFpdHxlbnwwfHx8fDE3NjIyODA1NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    bio: 'J\'aide les jeunes diplômés à naviguer le monde de la finance et de l\'audit.'
  },
];

export default function DirectoryPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-[calc(100vh-4rem)] w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-muted/40">
        <div className="container py-16 md:py-24">
            <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold text-primary">Annuaire des Mentors</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Connectez-vous avec des anciens élèves expérimentés prêts à vous guider.
                </p>
            </div>

            <Card className="mt-12">
                <CardHeader>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <Input placeholder="Rechercher par nom, filière, entreprise..." className="flex-1" />
                        <Button><Search className="mr-2 h-4 w-4" />Rechercher</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {mentors.map((mentor) => (
                            <Card key={mentor.name}>
                                <CardHeader className="items-center text-center">
                                    <Avatar className="h-24 w-24 border-4 border-accent">
                                        <AvatarImage src={mentor.photoURL} alt={mentor.name} />
                                        <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <CardTitle className="mt-4">{mentor.name}</CardTitle>
                                    <CardDescription className="text-accent font-semibold">{mentor.promotion}</CardDescription>
                                    <p className="text-sm text-muted-foreground">{mentor.company}</p>
                                </CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-sm text-muted-foreground px-4 italic">"{mentor.bio}"</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
