import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EventCard } from './components/event-card';
import { RegistrationForm } from './components/registration-form';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function EventsPage() {
  const eventImage = PlaceHolderImages.find(p => p.id === 'event-image');
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">Événements du LTDK</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Participez aux moments forts qui animent la vie de notre établissement.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          {eventImage && (
            <Image
              src={eventImage.imageUrl}
              alt={eventImage.description}
              width={600}
              height={400}
              className="rounded-lg shadow-lg"
              data-ai-hint={eventImage.imageHint}
            />
          )}
          <EventCard
            title="Cérémonie de remise du Prix de l'Excellence"
            date="Samedi 14 Juin 2025"
            location="Grande salle du Lycée"
            description="Rejoignez-nous pour célébrer nos élèves les plus méritants. Un moment de fierté et d'inspiration pour toute la communauté du LTDK, parrainé par l'Amicale des Anciens Élèves."
          />
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
}
