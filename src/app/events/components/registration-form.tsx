'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function RegistrationForm() {
  const { toast } = useToast();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: 'Inscription enregistrée',
      description: 'Merci de vous être inscrit à notre événement !',
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Participer à l'événement</CardTitle>
        <CardDescription>Remplissez le formulaire pour confirmer votre présence.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input id="name" type="text" placeholder="Votre nom complet" required/>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="votre.email@example.com" required/>
          </div>
          <div>
            <Label htmlFor="status">Vous êtes...</Label>
            <Select required>
                <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionnez votre statut" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="student">Élève ou Étudiant</SelectItem>
                    <SelectItem value="alumni">Ancien élève</SelectItem>
                    <SelectItem value="parent">Parent d'élève</SelectItem>
                    <SelectItem value="staff">Membre du personnel</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full">
            Confirmer ma présence
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
