import { Button } from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import { getUser } from "@/lib/actionsUsers"
import Image from "next/image"
import BadgePrenium from "@/public/badge-premium.svg"
import { createCustomerPortal,createSubscription,getDataStripeUSer } from "@/lib/actionsStripe"


export default async function PagePayment() {

  const user = await getUser()
  const dataStripe = await getDataStripeUSer(user?.id as string)

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
    <section className="h-auto w-full ">
        <h1 id="tarifs" className="font-bold text-4xl mb-8">Nos Offres :</h1>
        <div className="flex flex-col lg:flex-row items-center justify-around">
            <div className="bg-green-700 w-4/6 lg:w-3/12 flex flex-col px-4 py-4 rounded-xl border-2 border-green-700">
              <div className="bg-[#faf5ef] h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl text-green-700 ">Offre Mensuelle</h2>
                <h1 className="font-bold text-3xl my-4 md:text-center">29€99</h1>
                <form action={createSubscription} className="">
                  <Button className="bg-green-700 hover:bg-green-800 text-white">Commencer</Button>
                </form>
              </div>
              <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-white">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-white space-y-1">
                    <li>CRAs illimités</li>
                    <li>Clients illimités</li>
                    <li>Signature numérique</li>
                    <li>Génération de PDF</li>
                    <li>Time tracker</li>
                    <li>Reporting</li>
                  </ul>
              </div>
          </div>
          <div className="bg-purple-700 w-5/6 lg:w-3/12 flex flex-col px-4 py-4 rounded-xl">
            <h2 className="text-center text-white pb-2 underline underline-offset-2 font-bold">Best Seller ! eco 5%</h2>
            <div className="bg-[#faf5ef] h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
              <h2 className="font-semibold text-xl text-purple-700">Offre 6 mois</h2>
              <h1 className="font-bold text-3xl my-4 md:text-center">89€99</h1>
              <form action={createSubscription} className="">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white">Commencer</Button>
              </form>
            </div>
            <div className="mt-6 px-4">
              <h3 className="text-sm font-bold text-white">Inclus :</h3>
              <ul className="mt-2 font-semibold list-disc list-inside text-white space-y-1">
                <li>CRAs illimités</li>
                <li>Clients illimités</li>
                <li>Signature numérique</li>
                <li>Génération de PDF</li>
                <li>Time tracker</li>
                <li>Reporting</li>
              </ul>
            </div>
          </div>

          <div className="bg-green-700 w-5/6 lg:w-3/12 flex flex-col px-4 py-4 rounded-xl border-2 border-green-700">
          <h2 className="text-center font-bold text-white pb-2 underline underline-offset-2">economiser 11%</h2>
              <div className="bg-[#faf5ef] h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl text-green-700">Offre Annuelle</h2>
                <h1 className="font-bold text-3xl my-4 md:text-center">109€99</h1>
                <form action={createSubscription} className="">
                  <Button className="bg-green-700 hover:bg-green-800 text-white">Commencer</Button>
                </form>
              </div>
              <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-white">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-white space-y-1 flex flex-col">
                    <li>CRAs illimités</li>
                    <li>Clients illimités</li>
                    <li>Signature numérique</li>
                    <li>Génération de PDF</li>
                    <li>Time tracker</li>
                    <li>Reporting</li>
                  </ul>
              </div>
          </div>
        </div>
      </section>
  )
}
