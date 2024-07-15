
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getUser } from "@/lib/actionsUsers"
import { getAllAGOs, searchAGOs } from "@/lib/actionsAGO"
import {Delete, Divide, File,FilePenLine, Download} from "lucide-react"
import ButtonDelete from "@/app/components/ButtonDelete"
import ButtonDL from "@/app/components/ButtonDL"
import { Card } from "@/components/ui/card"
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { useState } from "react"
import ButtonCreate from "@/app/components/ButtonCreate"


interface SearchParams {
  search?: string;
}

export default async function PageNotes({ searchParams }: { searchParams: SearchParams }) {

  const user = await getUser();
  const searchTerm = searchParams.search || "";
  const agos = searchTerm
    ? await searchAGOs(user?.id as string, searchTerm)
    : await getAllAGOs(user?.id as string);

  if (!user) {
    redirect("/");
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
          <h2 className="text-3xl uppercase font-black">ASSEMBLÉES GÉNÉRALES</h2>
          <p className="text-lg text-muted-foreground ">
            Faites autant d'AGO que nécessaire !
          </p>
          <div className="w-12 bg-white my-2 mx-1 h-[1px]"></div>
        </div>
        {!hasActiveSubscription ? (
            <Link href="/dashboard/payment">
            <Button>
              Créer une AGO
            </Button>
            </Link>
          ) : (
            <ButtonCreate />
          )}
        
      </div>

      {/* Ajouter la barre de recherche */}
      <form className="mb-4">
        <input
          type="text"
          name="search"
          placeholder="Rechercher une AGO par nom"
          defaultValue={searchTerm}
          className="p-2 border border-gray-300 rounded-md w-full"
        />
        <Button type="submit" className="mt-2">
          Rechercher
        </Button>
      </form>

      {agos.length < 1 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-3 animate-in fade-in-50">
          <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-500 bg-opacity-20 mb-4">
            <File className="text-green-900" />
          </div>
          <p className="text-lg ">Vous n'avez aucune AGO</p>
          <p className="text-muted-foreground text-sm">
            Commencez des maintenant à créer des AGO via notre application
          </p>
          {!hasActiveSubscription ? (
            <Link href="/dashboard/payment">
              <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">
                Créer une nouvelle AGO
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/createAGO">
              <Button className="bg-green-500 hover:bg-green-600 text-white mt-4">
                Créer une nouvelle AGO
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-4 ">
          {agos?.map((item, index) => (
            <Card key={index} className="flex items-center justify-between p-4">
              <div>
                <h2 className="text-green-600 text-xl font-bold">{item.societeName}</h2>

                <p className="text-sm text-muted-foreground">
                  écrit le{" "}
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "full",
                  }).format(new Date(item.createdAt))}
                </p>
              </div>
              <div className="flex items-center gap-2">
                    <ButtonDL id={item.id}/>
                    <Link href={`ago/${item.id}`}>
                    <Button type="button" className="bg-gray-400 hover:bg-gray-700 text-white">
                      <FilePenLine/>
                      </Button>
                    </Link>
                    <ButtonDelete id={item.id}/>
              </div>
            </Card>
          ))}

        </div>
      )}

    </section>
  )
}
