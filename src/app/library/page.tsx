
'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Upload, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCollection, useFirestore, useFirebaseApp } from '@/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, query, addDoc, serverTimestamp, type DocumentData } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface Document extends DocumentData {
  id: string;
  title: string;
  category: 'sujet_bac' | 'autre_document';
  type?: 'cours' | 'td' | 'exercice';
  year?: number;
  series?: string;
  subject: string;
  fileURL: string;
}

const uploadSchema = z.object({
    title: z.string().min(3, "Le titre est requis."),
    subject: z.string().min(2, "La matière est requise."),
    file: z.instanceof(FileList).refine((files) => files?.length === 1, "Le fichier est requis."),
    category: z.enum(['sujet_bac', 'autre_document']),
    type: z.enum(['cours', 'td', 'exercice']).optional(),
    year: z.coerce.number().optional(),
    series: z.string().optional(),
}).refine(data => data.category !== 'sujet_bac' || (data.year && data.series), {
    message: "L'année et la série sont requises pour les sujets de bac.",
    path: ['year'],
}).refine(data => data.category !== 'autre_document' || data.type, {
    message: "Le type est requis pour les autres documents.",
    path: ['type'],
});


type UploadFormValues = z.infer<typeof uploadSchema>;


export default function LibraryPage() {
  const db = useFirestore();
  const app = useFirebaseApp();
  const storage = app ? getStorage(app) : null;
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<UploadFormValues>({
    resolver: zodResolver(uploadSchema),
    defaultValues: {
      category: 'autre_document',
    },
  });
  
  const categoryWatcher = form.watch('category');

  const documentsQuery = db ? query(collection(db, 'documents')) : null;
  const { data: documents, loading: documentsLoading, error } = useCollection<Document>(documentsQuery);
  
  const [examSearch, setExamSearch] = useState({ keyword: '', year: 'all', series: 'all' });
  const [docSearch, setDocSearch] = useState({ keyword: '', type: 'all' });

  const examSubjects = useMemo(() => {
    let filtered = documents?.filter(d => d.category === 'sujet_bac') || [];
    if (examSearch.keyword) {
        filtered = filtered.filter(doc => doc.title.toLowerCase().includes(examSearch.keyword.toLowerCase()) || doc.subject.toLowerCase().includes(examSearch.keyword.toLowerCase()));
    }
    if (examSearch.year && examSearch.year !== 'all') {
        filtered = filtered.filter(doc => doc.year?.toString() === examSearch.year);
    }
    if (examSearch.series && examSearch.series !== 'all') {
        filtered = filtered.filter(doc => doc.series === examSearch.series);
    }
    return filtered;
  }, [documents, examSearch]);

  const otherDocuments = useMemo(() => {
    let filtered = documents?.filter(d => d.category === 'autre_document') || [];
    if (docSearch.keyword) {
        filtered = filtered.filter(doc => doc.title.toLowerCase().includes(docSearch.keyword.toLowerCase()) || doc.subject.toLowerCase().includes(docSearch.keyword.toLowerCase()));
    }
     if (docSearch.type && docSearch.type !== 'all') {
        filtered = filtered.filter(doc => doc.type === docSearch.type);
    }
    return filtered;
  }, [documents, docSearch]);
  
  const availableExamYears = useMemo(() => {
    const years = documents?.filter(d => d.category === 'sujet_bac' && d.year).map(d => d.year) || [];
    return [...new Set(years)].sort((a, b) => b! - a!);
  }, [documents]);

  const availableExamSeries = useMemo(() => {
    const series = documents?.filter(d => d.category === 'sujet_bac' && d.series).map(d => d.series) || [];
    return [...new Set(series)].sort();
  }, [documents]);

  const availableDocTypes = useMemo(() => {
    const types = documents?.filter(d => d.category === 'autre_document' && d.type).map(d => d.type) || [];
    return [...new Set(types)].sort();
  }, [documents]);


  const handleUpload = async (values: UploadFormValues) => {
    if (!db || !storage) {
        toast({ variant: 'destructive', title: 'Erreur', description: 'Le service de base de données n\'est pas disponible.' });
        return;
    }
    setIsSubmitting(true);
    
    try {
        const file = values.file[0];
        const storageRef = ref(storage, `documents/${Date.now()}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        const fileURL = await getDownloadURL(uploadResult.ref);

        const docData = {
          title: values.title,
          subject: values.subject,
          category: values.category,
          fileURL,
          createdAt: serverTimestamp(),
          ...(values.category === 'sujet_bac' && { year: values.year, series: values.series }),
          ...(values.category === 'autre_document' && { type: values.type }),
        };

        await addDoc(collection(db, 'documents'), docData);

        toast({ title: 'Succès', description: 'Document téléversé avec succès.' });
        form.reset();
    } catch (error: any) {
        console.error("Error uploading document:", error);
        toast({ variant: 'destructive', title: 'Erreur de téléversement', description: error.message });
    } finally {
        setIsSubmitting(false);
    }
  };


  return (
    <div className="bg-muted/40">
      <div className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-primary">Bibliothèque Numérique</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Accédez aux anciens sujets du Bac technique, cours, TDs et autres ressources pédagogiques.
          </p>
        </div>

        <Tabs defaultValue="exam-subjects" className="mt-16">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="exam-subjects">Banque des Sujets de Bac</TabsTrigger>
            <TabsTrigger value="other-documents">Documents (Cours, TD, Exercices)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="exam-subjects">
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Rechercher un sujet de Bac Technique</CardTitle>
                <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Input placeholder="Rechercher par mot-clé..." className="flex-1" onChange={(e) => setExamSearch(s => ({...s, keyword: e.target.value}))}/>
                  <Select value={examSearch.year} onValueChange={(value) => setExamSearch(s => ({...s, year: value}))}>
                    <SelectTrigger className="sm:w-[180px]">
                      <SelectValue placeholder="Année" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les années</SelectItem>
                      {availableExamYears.map(year => <SelectItem key={year} value={year!.toString()}>{year}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={examSearch.series} onValueChange={(value) => setExamSearch(s => ({...s, series: value}))}>
                    <SelectTrigger className="sm:w-[220px]">
                      <SelectValue placeholder="Série" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les séries</SelectItem>
                      {availableExamSeries.map(series => <SelectItem key={series} value={series!}>{series}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Année</TableHead>
                      <TableHead>Série</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documentsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : examSubjects.length > 0 ? (
                      examSubjects.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.year}</TableCell>
                          <TableCell>{doc.series}</TableCell>
                          <TableCell>{doc.subject}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" asChild>
                              <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" aria-label={`Télécharger ${doc.title}`}>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">Aucun sujet de bac trouvé pour les filtres sélectionnés.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="other-documents">
             <Card className="mt-6">
              <CardHeader>
                <CardTitle>Explorer les Documents Pédagogiques</CardTitle>
                 <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                  <Input placeholder="Rechercher par mot-clé..." className="flex-1" onChange={(e) => setDocSearch(s => ({...s, keyword: e.target.value}))}/>
                   <Select value={docSearch.type} onValueChange={(value) => setDocSearch(s => ({...s, type: value}))}>
                    <SelectTrigger className="sm:w-[180px]">
                      <SelectValue placeholder="Type de document" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {availableDocTypes.map(type => <SelectItem key={type} value={type!}>{type}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Matière</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  {documentsLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          <div className="flex justify-center items-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : otherDocuments.length > 0 ? (
                      otherDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{doc.subject}</TableCell>
                          <TableCell className="text-right">
                             <Button variant="ghost" size="icon" asChild>
                              <a href={doc.fileURL} target="_blank" rel="noopener noreferrer" aria-label={`Télécharger ${doc.title}`}>
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">Aucun document trouvé pour les filtres sélectionnés.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mt-24">
          <Card className="max-w-2xl mx-auto border-2 border-dashed border-accent">
            <CardHeader className="text-center">
              <div className="mx-auto bg-accent text-accent-foreground rounded-full p-3 w-fit">
                <Upload className="h-8 w-8"/>
              </div>
              <CardTitle className="text-primary mt-4">Proposer du Contenu</CardTitle>
              <CardDescription>Enseignants ou anciens, contribuez à la bibliothèque.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpload)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une catégorie" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="sujet_bac">Sujet de Bac</SelectItem>
                                <SelectItem value="autre_document">Autre Document</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du document</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Corrigé de Maths F3 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Matière</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Mathématiques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {categoryWatcher === 'sujet_bac' && (
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="year"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Année</FormLabel>
                                <FormControl>
                                <Input type="number" placeholder="Ex: 2023" {...field} onChange={e => field.onChange(e.target.valueAsNumber)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="series"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Série</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: F3" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                  )}

                  {categoryWatcher === 'autre_document' && (
                     <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de document</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez un type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="cours">Cours</SelectItem>
                                    <SelectItem value="td">TD (Travaux Dirigés)</SelectItem>
                                    <SelectItem value="exercice">Exercice</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="file"
                    render={({ field }) => (
                      <FormItem>
                          <FormLabel>Fichier du document</FormLabel>
                          <FormControl>
                            <Input type="file" accept=".pdf,.doc,.docx,.png,.jpg" onChange={(e) => field.onChange(e.target.files)} />
                          </FormControl>
                          <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                    {isSubmitting ? 'Envoi en cours...' : 'Soumettre le document'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
