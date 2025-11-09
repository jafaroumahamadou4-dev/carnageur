import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Goal, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Eye,
      title: 'Vision',
      description: 'Former une élite technique responsable au service du développement du Niger.',
    },
    {
      icon: Goal,
      title: 'Mission',
      description: 'Offrir une formation technique de qualité et inculquer l’esprit d’innovation.',
    },
    {
      icon: HeartHandshake,
      title: 'Valeurs',
      description: 'Discipline – Excellence – Solidarité.',
    },
  ];

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">À Propos du LTDK</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Notre engagement envers l'éducation technique et le développement national.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title} className="text-center">
            <CardHeader className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-accent p-4 text-accent-foreground">
                <value.icon className="h-10 w-10" />
              </div>
              <CardTitle className="text-2xl">{value.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{value.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
