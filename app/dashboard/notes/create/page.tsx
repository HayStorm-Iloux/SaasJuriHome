import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createNote } from "@/lib/actionsNotes"



export default function CreatePage() {
  return (
    <Card>
        <form action={createNote}>
            <CardHeader>
                <CardTitle>Nouvelle Note</CardTitle>
                <CardDescription>Quelques mot pour ne pas oublier</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5 ">
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="title">Titre</Label>
                    <Input type="text" id="title" name="title" placeholder="Titre de votre note"required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Description de votre note"required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="completed">En attente ou complet</Label>
                    <Input type="checkbox" id="completed" name="completed" placeholder="Titre de votre note" className="w-6 cursor-pointer"/>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button type="button" className="bg-red-500 hover:bg-red-600 text-white">
                    <Link href="/dashboard/notes">Annuler</Link>
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Créer Note
                </Button>
            </CardFooter>
        </form>
    </Card>
  )
}
