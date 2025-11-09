import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface EventCardProps {
  title: string;
  date: string;
  location: string;
  description: string;
}

export function EventCard({ title, date, location, description }: EventCardProps) {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>Date:</strong> {date}</p>
        <p><strong>Location:</strong> {location}</p>
        <p className="mt-4">{description}</p>
      </CardContent>
    </Card>
  );
}
