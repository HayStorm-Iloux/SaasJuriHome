import { Button } from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import { getUser } from "@/lib/actionsUsers"
import Image from "next/image"
import BadgePrenium from "@/public/badge-premium.svg"
import { createCustomerPortal,createSubscription,getDataStripeUSer } from "@/lib/actionsStripe"


export default async function PagePayment() {

  const user = await getUser()
  const dataStripe = await getDataStripeUSer(user?.id as string)

  const itemsPremium = [
      {name: "Hébergement Web fiable et sécurisé"},
      {name: "Conception Responsive et Conviviale"},
      {name: "Fonctionnalités Avancées"},
      {name: "Support Technique et Mises à Jour"},
    ]

    if(dataStripe?.status === "active"){
      return (
        <div className="max-w-lg mx-auto space-y-4 my-3">
          <Card className="flex flex-col ">
            <CardContent className="py-8">
              <div>
                <h3 className="text-md font-black uppercase bg-orange-900 bg-opacity-20 text-orange-500 p-3 rounded-md inline">
                  Pass Prenium
                </h3>
                <p className="mt-4 text-sm text-muted-foreground">Modifier votre abonnement prenium</p>
                <Image src={BadgePrenium} width={100} height={100} alt="badge" className="block my-4"/>
                <form action={createCustomerPortal} className="w-full mt-4 ">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full">Modifier Abonnement</Button>
                </form>
              </div>
            </CardContent>
          </Card>

        </div>
      )
    }
  

  return (
    <div className="maw-w-lg mx-auto space-y-4 mt-3 ">
      <Card className="flex flex-col">
        <CardContent className="py-8">
          <div>
            <h3 className="text-md font-black uppercase bg-orange-900 bg-opacity-20 text-orange-500 p-3 rounded-md inline">
              Pass Prenium
            </h3>
          </div>
          <div className="mt-4 text-6xl font-black">
            <span>29,99€</span><span className="text-sm text-muted-foreground">/ par mois</span>

          </div>
          <p className="mt-4 text-muted-foreground">
            Découvrez les Plaisirs exvlusifs de notre Pass Prenium.
            Avec le Pass Prenium, vous bénéficiez d'un hébergement web fiable et sécurisé, d'une conception responsive et conviviale, de fonctionnalités avancées, d'un support technique et de mises à jour.
          </p>
          <div className="flex-1 flex  flex-col justify-between px-6 py-4 bg-secondary rounded-lg m-1 space-t-6 p-3 mt-4">
            <ul className="space-y-3">
              {itemsPremium.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground">
                  <span>✅</span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>

            <form action={createSubscription} className="w-full mt-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">Devenir membre Prenium</Button>
            </form>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
