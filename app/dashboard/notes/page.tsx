import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser } from "@/lib/actionsUsers"
import { getAllNotes } from "@/lib/actionsNotes"
import {Delete, Divide, File,FilePenLine} from "lucide-react"
import ButtonDelete from "@/app/components/ButtonDelete"
import { Card } from "@/components/ui/card"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

export default async function PageNotes() {

  const user = await getUser();
  const data = await getAllNotes(user?.id as string);

  if (!user) {
    redirect('/')
  }

  const sub = await prisma.user.findUnique({
    where: { id: user?.id },
    include: { subscription: true },
  });

  const hasActiveSubscription = sub?.subscription.some(
    (subscription) => subscription.status === "active"
  );


  return (
    <section className="grid items-start gap-y-8">
      <div className="flex md:items-center md:justify-between flex-col md:flex-row px-2">
        <div className="grid gap-1">
          <h2 className="text-3xl uppercase font-black">Notes</h2>
          <p className="text-lg text-muted-foreground ">Ne perdais pas tes idées, prend des notes grand fou</p>
          <div className="w-12 bg-white my-2 mx-1 h-[1px]"></div>
        </div>
        <Button>
          <Link href="/dashboard/notes/create">Créer une note</Link>
        </Button>
      </div>

      {data.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-3 animate-in fade-in-50">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500 bg-opacity-20 mb-4">
            <File className="text-green-900"/>
            </div>
            <p className="text-lg ">Vous n'avez aucune note</p>
            <p className="text-muted-foreground text-sm">Commencez des maintenant à créer des notes via notre application</p>
              {!hasActiveSubscription ? (
                <Link href="/dashboard/payment">
                  <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">Créer une nouvelle note</Button>
                </Link>
              ):(
                <Link href="/dashboard/notes/create">
                  <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">Créer une nouvelle note</Button>
                </Link>
              )}
          </div>
      ) : (
        <div className="flex flex-col space-y-4 ">
          {data?.map((item, index) => (
            <Card key={index} className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-green-600 text-xl font-bold">{item.title}</h2>

                <p className="text-sm text-muted-foreground">
                  écrit le {new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'full',
                  }).format(new Date(item.createdAt))}
                </p>

              </div>
              <div className="flex items-center gap-2">
                  <Button type="button" className="bg-gray-400 hover:bg-gray-700 mt-4 text-white mb-3">
                    <Link href={`notes/note/${item.id}`}>
                      <FilePenLine className="w-4"/>
                    </Link>
                  </Button>
                  <ButtonDelete id={item.id}/>
              </div>
            </Card>
          ))}

        </div>
      )}

    </section>
  )
}
