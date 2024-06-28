import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Ban } from "lucide-react";


export default function SuccessPage(){
    return (
        <section className="w-full h-screen pt-20 text-center">
            <Card className="w-[400px] mx-auto p-4">
                <Ban className="mb-3 text-red-500 text-center w-full "/>
                <h1 className="text-xl font-black mb-2 text-center uppercase">Paiement Réussie</h1>
                <p className="text-muted-foreground text-sm mb-2">Vous êtes maintenant membre</p>*
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                    <Link href="/dashboard/payment">
                        Retour vers le dashboard
                    </Link>
                </Button>
            </Card>
        </section>
    )
}