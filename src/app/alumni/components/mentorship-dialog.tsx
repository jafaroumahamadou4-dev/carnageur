
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { submitMentorApplication, submitMenteeApplication } from '@/app/actions';

function MentorForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        const result = await submitMentorApplication(data);
        if (result.success) {
            toast({
                title: 'Demande Soumise',
                description: "Merci pour votre proposition ! Votre demande pour devenir mentor a été soumise.",
            });
            setOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: result.message,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Devenir un Mentor</DialogTitle>
                <DialogDescription>
                    Partagez votre expérience avec la nouvelle génération. Remplissez ce formulaire.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" {...register('name', { required: true })} />
                    {errors.name && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contact">Email/Numéro</Label>
                    <Input id="contact" {...register('contact', { required: true })} />
                     {errors.contact && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="promotion">Promotion</Label>
                    <Input id="promotion" placeholder="Ex: 2010 - F3" {...register('promotion', { required: true })} />
                     {errors.promotion && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="field">Domaine d'expertise</Label>
                    <Input id="field" placeholder="Ex: Génie Civil, Finance..." {...register('field', { required: true })} />
                     {errors.field && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="motivation">Motivation</Label>
                    <Textarea id="motivation" placeholder="Pourquoi souhaitez-vous devenir mentor ?" {...register('motivation', { required: true })} />
                     {errors.motivation && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Soumettre la demande
                </Button>
            </DialogFooter>
        </form>
    );
}

function MenteeForm({ setOpen }: { setOpen: (open: boolean) => void }) {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm();
    const { toast } = useToast();

    const onSubmit = async (data: any) => {
        const result = await submitMenteeApplication(data);
         if (result.success) {
            toast({
                title: 'Demande Soumise',
                description: "Votre demande de mentorat a bien été envoyée. Nous vous contacterons bientôt.",
            });
            setOpen(false);
        } else {
            toast({
                variant: 'destructive',
                title: 'Erreur',
                description: result.message,
            });
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
                <DialogTitle>Trouver un Mentor</DialogTitle>
                <DialogDescription>
                    Besoin de conseils pour votre carrière ? Décrivez votre besoin et nous vous mettrons en relation.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                 <div className="space-y-2">
                    <Label htmlFor="name">Nom</Label>
                    <Input id="name" {...register('name', { required: true })} />
                    {errors.name && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register('email', { required: true })} />
                     {errors.email && <p className="text-destructive text-sm">Un email valide est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="promotion">Promotion</Label>
                    <Input id="promotion" placeholder="Ex: 2022 - G2" {...register('promotion', { required: true })} />
                     {errors.promotion && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="domain">Domaine souhaité</Label>
                    <Input id="domain" placeholder="Le domaine qui vous intéresse" {...register('domain', { required: true })} />
                    {errors.domain && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                     <Controller
                        name="status"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Sélectionnez..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">Élève au LTDK</SelectItem>
                                    <SelectItem value="young_alumni">Jeune diplômé(e)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.status && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="need">Besoin</Label>
                    <Textarea id="need" placeholder="Décrivez le type d'aide ou de conseils que vous recherchez..." {...register('need', { required: true })} />
                     {errors.need && <p className="text-destructive text-sm">Ce champ est requis.</p>}
                </div>
            </div>
            <DialogFooter>
                 <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Envoyer la demande
                </Button>
            </DialogFooter>
        </form>
    );
}


export function MentorshipSection() {
    const [mentorDialogOpen, setMentorDialogOpen] = useState(false);
    const [menteeDialogOpen, setMenteeDialogOpen] = useState(false);
    
  return (
    <section className="mt-24">
      <Card className="bg-primary text-primary-foreground border-accent border-2">
        <CardHeader className="items-center text-center">
          <UserCheck className="h-12 w-12 text-accent" />
          <CardTitle className="text-3xl mt-2">Programme de Mentorat</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Partagez votre expérience, guidez la nouvelle génération.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="max-w-3xl mx-auto text-center">
            Notre programme de mentorat met en relation des anciens élèves expérimentés avec des élèves actuels ou de
            jeunes diplômés. Que vous souhaitiez partager votre savoir ou que vous cherchiez des conseils pour votre
            carrière, le mentorat est une expérience enrichissante pour tous.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4 pb-6">
          <Dialog open={mentorDialogOpen} onOpenChange={setMentorDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="lg">Devenir Mentor</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                 <MentorForm setOpen={setMentorDialogOpen} />
            </DialogContent>
          </Dialog>

          <Dialog open={menteeDialogOpen} onOpenChange={setMenteeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Trouver un Mentor
              </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-md">
                <MenteeForm setOpen={setMenteeDialogOpen} />
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </section>
  );
}
