import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Youtube, School } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center gap-2">
              <School className="h-8 w-8 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold">LTDK Maradi</span>
                <span className="text-xs text-muted-foreground">Ensemble bâtissons le Niger</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Lycée Technique Dan Kassawa de Maradi. Former une élite technique responsable au service du développement du Niger.
            </p>
          </div>
          <div className="md:justify-self-center">
            <h3 className="mb-4 font-semibold">Liens rapides</h3>
            <ul className="space-y-2">
              <li><Link href="/school" className="text-sm text-muted-foreground hover:text-primary">Le Lycée</Link></li>
              <li><Link href="/courses" className="text-sm text-muted-foreground hover:text-primary">Filières</Link></li>
              <li><Link href="/alumni" className="text-sm text-muted-foreground hover:text-primary">Amicale</Link></li>
              <li><Link href="/library" className="text-sm text-muted-foreground hover:text-primary">Bibliothèque</Link></li>
              <li><Link href="/events" className="text-sm text-muted-foreground hover:text-primary">Événements</Link></li>
            </ul>
          </div>
          <div className="md:justify-self-end">
             <h3 className="mb-4 font-semibold">Contact</h3>
             <address className="space-y-2 not-italic text-sm text-muted-foreground">
                <p>BP 123, Maradi, Niger</p>
                <p>Email: <a href="mailto:contact@ltdk-maradi.ne" className="hover:text-primary">contact@ltdk-maradi.ne</a></p>
                <p>Tél: +227 96 00 00 00</p>
             </address>
             <div className="mt-4 flex space-x-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Facebook"><Facebook className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="Instagram"><Instagram className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5" /></a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                    <a href="#" aria-label="YouTube"><Youtube className="h-5 w-5" /></a>
                </Button>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Lycée Technique Dan Kassawa de Maradi. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
