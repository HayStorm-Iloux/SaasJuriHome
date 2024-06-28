import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {  getNote,updateNote } from "@/lib/actionsNotes"


interface Params {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface UpdatePageProps {
  params: Params;
}


export default async function PageNote({params}: UpdatePageProps) {

  const note = await getNote(params.id);

  return (
    <Card>
        <form action={updateNote}>
          <Input type="hidden" name="id" value={note?.id as string}/>
            <CardHeader>
                <CardTitle>Modifier Note</CardTitle>
                <CardDescription>Quelques mot pour ne pas oublier</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5 ">
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="title">Titre</Label>
                    <Input defaultValue={note?.title as string} type="text" id="title" name="title" placeholder="Titre de votre note"required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="description">Description</Label>
                    <Textarea defaultValue={note?.description as string} id="description" name="description" placeholder="Description de votre note"required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="completed">En attente ou complet</Label>
                    <Input defaultChecked={note?.completed as boolean} type="checkbox" id="completed" name="completed" placeholder="Titre de votre note" className="w-6 cursor-pointer"/>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button type="button" className="bg-red-500 hover:bg-red-600 text-white">
                    <Link href="/dashboard/notes">Annuler</Link>
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Modifier Note
                </Button>
            </CardFooter>
        </form>
    </Card>
  )
}
