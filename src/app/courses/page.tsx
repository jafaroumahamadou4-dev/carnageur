import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Briefcase, Wrench, Atom, Calculator, CircuitBoard, DraftingCompass, Factory, Scroll, ShoppingCart } from 'lucide-react';

export default function CoursesPage() {
  const industrialCourses = [
    { 
      name: 'F1 : Mécanique Générale', 
      icon: Factory,
      description: 'Cette filière forme des techniciens polyvalents capables de concevoir, fabriquer, et entretenir des ensembles mécaniques. L\'accent est mis sur les techniques d\'usinage, la construction métallique et la maintenance.',
      opportunities: ['Technicien de maintenance industrielle', 'Ajusteur-monteur', 'Dessinateur-projeteur en mécanique', 'Opérateur sur machine à commande numérique']
    },
    { 
      name: 'F3 : Électrotechnique',
      icon: CircuitBoard,
      description: 'Forme des spécialistes des installations électriques, des automatismes et de la maintenance des équipements. Les élèves apprennent à câbler, dépanner et mettre en service des systèmes complexes.',
      opportunities: ['Électricien du bâtiment ou industriel', 'Technicien en automatismes', 'Agent de maintenance en électrotechnique', 'Technicien de bureau d\'études']
    },
    { 
      name: 'F4 : Génie Civil',
      icon: DraftingCompass,
      description: 'Cette filière est axée sur la conception et la réalisation des ouvrages de construction (bâtiments, routes, ponts). Elle couvre le dessin de plans, l\'étude des sols, et la conduite de chantiers.',
      opportunities: ['Dessinateur en bâtiment', 'Chef de chantier', 'Technicien de laboratoire BTP', 'Conducteur de travaux']
    },
    { 
      name: 'E : Mathématiques et Mécanique',
      icon: Atom,
      description: 'Filière d\'excellence qui prépare aux études supérieures d\'ingénieur. Elle offre une formation théorique poussée en mathématiques et en sciences physiques, avec une application à la mécanique.',
      opportunities: ['Classes préparatoires aux grandes écoles', 'Licences scientifiques et techniques', 'Carrières dans l\'ingénierie et la recherche']
    },
  ];

  const administrativeCourses = [
    { 
      name: 'G1 : Techniques Administratives',
      icon: Scroll,
      description: 'Prépare aux métiers du secrétariat et de l\'assistanat de direction. La formation inclut la communication professionnelle, l\'organisation administrative et l\'utilisation des outils bureautiques.',
      opportunities: ['Secrétaire de direction', 'Assistant administratif', 'Agent d\'accueil', 'Gestionnaire de dossiers']
    },
    { 
      name: 'G2 : Techniques Comptables',
      icon: Calculator,
      description: 'Forme des techniciens capables de tenir la comptabilité d\'une entreprise. Le programme couvre les opérations courantes, la paie, les déclarations fiscales et l\'analyse financière.',
      opportunities: ['Aide-comptable', 'Comptable en entreprise ou en cabinet', 'Gestionnaire de paie', 'Assistant de gestion PME/PMI']
    },
    { 
      name: 'G3 : Techniques Commerciales',
      icon: ShoppingCart,
      description: 'Cette filière prépare aux métiers de la vente, du marketing et de la gestion de la relation client. Elle aborde la négociation, la gestion des stocks et les techniques de merchandising.',
      opportunities: ['Attaché commercial', 'Vendeur conseil', 'Assistant marketing', 'Chef de rayon dans la grande distribution']
    },
  ];

  return (
    <div className="container py-16 md:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold text-primary">Filières de Formation</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Découvrez nos programmes techniques et tertiaires, leurs objectifs et les carrières qu'ils permettent d'envisager.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-2">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <Wrench className="h-10 w-10 text-primary"/>
            <h2 className="text-3xl font-bold">Filières Industrielles</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {industrialCourses.map((course) => (
              <AccordionItem value={course.name} key={course.name}>
                <AccordionTrigger className="text-lg hover:no-underline">
                  <div className="flex items-center gap-4">
                    <course.icon className="h-6 w-6 text-accent"/>
                    {course.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-md">
                  <p className="mb-4 text-sm text-muted-foreground">{course.description}</p>
                  <h4 className="font-semibold mb-2">Filières universitaires :</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {course.opportunities.map(op => <li key={op}>{op}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8">
            <Briefcase className="h-10 w-10 text-primary"/>
            <h2 className="text-3xl font-bold">Filières Administratives</h2>
          </div>
           <Accordion type="single" collapsible className="w-full">
            {administrativeCourses.map((course) => (
              <AccordionItem value={course.name} key={course.name}>
                <AccordionTrigger className="text-lg hover:no-underline">
                   <div className="flex items-center gap-4">
                    <course.icon className="h-6 w-6 text-accent"/>
                    {course.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 bg-muted/50 rounded-md">
                  <p className="mb-4 text-sm text-muted-foreground">{course.description}</p>
                  <h4 className="font-semibold mb-2">Filières universitaires :</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {course.opportunities.map(op => <li key={op}>{op}</li>)}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
