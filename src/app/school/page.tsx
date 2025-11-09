
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, History, Wrench, PersonStanding, Loader2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection, useFirestore } from '@/firebase';
import { collection, query, where, orderBy, type DocumentData } from 'firebase/firestore';

// Interfaces for Firestore data
interface AdminMember extends DocumentData {
  id: string;
  name: string;
  role: string;
}

interface InfrastructureImage extends DocumentData {
  id: string;
  title: string;
  imageUrl: string;
  imageHint: string;
}

interface SchoolStat extends DocumentData {
  id: string;
  label: string;
  value: string;
  icon: string; // Storing icon name as string: 'Users', 'PersonStanding', 'Wrench'
}

interface SchoolHistory extends DocumentData {
  id: string;
  content: string;
}

// Map icon names to Lucide components
const iconMap: { [key: string]: React.ElementType } = {
  Users: Users,
  PersonStanding: PersonStanding,
  Wrench: Wrench,
};


// Default data
const defaultInfraImg1 = PlaceHolderImages.find(p => p.id === 'school-infra-1');
const defaultInfraImg2 = PlaceHolderImages.find(p => p.id === 'school-infra-2');

const defaultStats: SchoolStat[] = [
  { id: '1', icon: 'Users', value: '2500+', label: 'Élèves et étudiants' },
  { id: '2', icon: 'PersonStanding', value: '150+', label: 'Enseignants et personnel' },
  { id: '3', icon: 'Wrench', value: '20+', label: 'Ateliers et laboratoires' },
];

const defaultAdministration: AdminMember[] = [
    { id: '1', role: "Proviseur", name: "M. Noungo Oumarou" },
    { id: '2', role: "Censeur", name: "M. Abdoul Azizou" },
    { id: '3', role: "Surveillant Général", name: "M. Hamidou" },
    { id: '4', role: "Chef des travaux", name: "M. Issa Oumarou" },
];

const defaultHistory = {
    content: "Fondé en 1967, le Lycée Technique Dan Kassawa de Maradi (LTDK) fut un acte stratégique de l'État nigérien post-indépendance pour construire son autonomie en cadres techniques. Le lycée a été conçu pour former des techniciens et cadres intermédiaires afin de soutenir l'industrialisation et le développement du pays, jouant un rôle pilier dans la souveraineté technique nigérienne."
};

const defaultInfrastructure: InfrastructureImage[] = [
    { id: '1', title: 'Ateliers Modernes', imageUrl: defaultInfraImg1?.imageUrl || '', imageHint: defaultInfraImg1?.imageHint || 'technical workshop' },
    { id: '2', title: 'Laboratoires Équipés', imageUrl: defaultInfraImg2?.imageUrl || '', imageHint: defaultInfraImg2?.imageHint || 'computer lab' }
]


export default function SchoolPage() {
  const db = useFirestore();

  // Fetching data from Firestore
  const adminQuery = db ? query(collection(db, 'schoolOfficials'), where('type', '==', 'administration'), orderBy('order', 'asc')) : null;
  const { data: administration, loading: adminLoading } = useCollection<AdminMember>(adminQuery);

  const statsQuery = db ? query(collection(db, 'schoolPageContent'), where('section', '==', 'statistics'), orderBy('order', 'asc')) : null;
  const { data: stats, loading: statsLoading } = useCollection<SchoolStat>(statsQuery);

  const historyQuery = db ? query(collection(db, 'schoolPageContent'), where('section', '==', 'history')) : null;
  const { data: historyData, loading: historyLoading } = useCollection<SchoolHistory>(historyQuery);

  const infraQuery = db ? query(collection(db, 'schoolPageContent'), where('section', '==', 'infrastructure'), orderBy('order', 'asc')) : null;
  const { data: infra, loading: infraLoading } = useCollection<InfrastructureImage>(infraQuery);

  const isLoading = adminLoading || statsLoading || historyLoading || infraLoading;

  // Use Firestore data if available, otherwise use default data
  const finalAdmin = administration && administration.length > 0 ? administration : defaultAdministration;
  const finalStats = stats && stats.length > 0 ? stats : defaultStats;
  const finalHistory = historyData && historyData.length > 0 ? historyData[0] : defaultHistory;
  const finalInfra = infra && infra.length > 0 ? infra : defaultInfrastructure;

  return (
    <div className="bg-muted/40">
        <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-primary">Le Lycée Technique Dan Kassawa</h1>
            <p className="mt-4 text-lg text-muted-foreground">
            Un pôle d'excellence pour la formation technique et professionnelle au Niger depuis 1967.
            </p>
        </div>

        <section className="mt-16">
            <Card>
                <CardHeader className="items-center">
                    <History className="h-12 w-12 text-accent"/>
                    <CardTitle className="text-2xl mt-2">Notre Histoire</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-muted-foreground max-w-3xl mx-auto">
                    {historyLoading ? (
                        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                    ) : (
                        <p>{finalHistory.content}</p>
                    )}
                </CardContent>
            </Card>
        </section>

        <section className="mt-24">
            <h2 className="mb-12 text-center text-3xl font-bold">Nos Infrastructures</h2>
            {infraLoading ? (
                 <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {finalInfra.map(item => (
                         <div key={item.id} className="relative aspect-video w-full overflow-hidden rounded-lg">
                            <Image src={item.imageUrl} alt={item.title} data-ai-hint={item.imageHint} fill className="object-cover" />
                            <div className="absolute bottom-0 left-0 bg-primary/80 text-primary-foreground p-4 rounded-tr-lg">{item.title}</div>
                        </div>
                    ))}
                </div>
            )}
        </section>

        <section className="mt-24 text-center">
            <h2 className="mb-12 text-center text-3xl font-bold">Le Lycée en Chiffres</h2>
            {statsLoading ? (
                <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {finalStats.map(stat => {
                        const IconComponent = iconMap[stat.icon] || Users; // Fallback to Users icon
                        return (
                            <Card key={stat.id}>
                                <CardHeader className="items-center gap-4">
                                    <IconComponent className="h-10 w-10 text-accent"/>
                                    <p className="text-4xl font-bold text-primary">{stat.value}</p>
                                    <p className="text-muted-foreground">{stat.label}</p>
                                </CardHeader>
                            </Card>
                        );
                    })}
                </div>
            )}
        </section>

         <section className="mt-24 text-center">
            <h2 className="mb-12 text-center text-3xl font-bold">Administration</h2>
            {adminLoading ? (
                 <div className="flex justify-center items-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {finalAdmin.map(person => (
                        <Card key={person.id}>
                            <CardHeader className="items-center">
                                <CardTitle>{person.name}</CardTitle>
                                <CardDescription className="text-accent font-semibold">{person.role}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </section>
        </div>
    </div>
  );
}

    