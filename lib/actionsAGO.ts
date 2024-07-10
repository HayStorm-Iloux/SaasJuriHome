"use server"

import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getUser } from "./actionsUsers";
import { revalidatePath } from "next/cache";
import { Participants } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export const getAllAGOs = async (userId: string) => {
    const data = await prisma.ago.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            participants: true
        }
    });
    return data;
}

export const createAGO = async (formData: FormData) => {
    const societeName = formData.get("societeName") as string;
    const societeType = formData.get("societeType") as string;
    const capitalAmount = formData.get("capitalAmount") as string;
    const adresse = formData.get("adresse") as string;
    const postal = formData.get("postal") as string;
    const ville = formData.get("ville") as string;
    const siret = formData.get("siret") as string;
    const rcs = formData.get("rcs") as string;
    const meetingDate = formData.get("meetingDate") as string;
    const meetingTime = formData.get("meetingTime") as string;
    const exerciceDate = formData.get("exerciceDate") as string;
    const adressePerso = formData.get("adressePerso") as string;
    const postalPerso = formData.get("postalPerso") as string;
    const villePerso = formData.get("villePerso") as string;
    const benef = formData.get("benef") as string;
    const deficite = formData.get("deficite") as string;
    const n1Date = formData.get("n1Date") as string;
    const n1DateAGO = formData.get("n1DateAGO") as string;
    const montant11 = formData.get("montant11") as string;
    const montant12 = formData.get("montant12") as string;
    const montant13 = formData.get("montant13") as string;
    const n2Date = formData.get("n2Date") as string;
    const n2DateAGO = formData.get("n2DateAGO") as string;
    const montant21 = formData.get("montant21") as string;
    const montant22 = formData.get("montant22") as string;
    const montant23 = formData.get("montant23") as string;
    const n3Date = formData.get("n3Date") as string;
    const n3DateAGO = formData.get("n3DateAGO") as string;
    const montant31 = formData.get("montant31") as string;
    const montant32 = formData.get("montant32") as string;
    const montant33 = formData.get("montant33") as string;
    const completed = formData.get("completed");
    const user = await getUser();
    const userId = user?.id as string;
    const participantsData = JSON.parse(formData.get("participants") as string) || [];

    await prisma.ago.create({
        data: {
        userId: userId,
        societeName: societeName,
        societeType: societeType,
        capitalAmount: capitalAmount,
        adresse: adresse,
        postal: postal,
        ville: ville,
        siret: siret,
        rcs: rcs,
        meetingDate: meetingDate,
        meetingTime: meetingTime,
        exerciceDate: exerciceDate,
        adressePerso: adressePerso,
        postalPerso: postalPerso,
        villePerso: villePerso,
        benef: benef,
        deficite: deficite,
        n1Date: n1Date,
        n1DateAGO: n1DateAGO,
        montant11: montant11,
        montant12: montant12,
        montant13: montant13,
        n2Date: n2Date,
        n2DateAGO: n2DateAGO,
        montant21: montant21,
        montant22: montant22,
        montant23: montant23,
        n3Date: n3Date,
        n3DateAGO: n3DateAGO,
        montant31: montant31,
        montant32: montant32,
        montant33: montant33,
        completed: completed === "on",
        participants: {
                create: participantsData.map((participant: Participants) => ({
                    sexe: participant.sexe,
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    shares: participant.shares,
                })),
            },
        
    }
});

    redirect("/dashboard/notes");
}

export const searchAGOs = async (userId: string, searchTerm: string) => {
    const data = await prisma.ago.findMany({
        where: {
            userId: userId,
            societeName: {
                contains: searchTerm,
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return data;
};


export const deleteAGO = async (formData: FormData) => {
    const id = formData.get("id") as string;
    await prisma.ago.delete({
        where: {
            id: id
        }
    });
    revalidatePath("/");
}

export const getAGO = async (id: string) => {
    const ago = prisma.ago.findUnique({
        where: {
            id: id
        },
        include: {
            participants: true
        }
    });
    return ago;
}

export const updateAGO = async (formData: FormData) => {
    try {
        const id = formData.get("id") as string;
        const societeName = formData.get("societeName") as string;
        const societeType = formData.get("societeType") as string;
        const capitalAmount = formData.get("capitalAmount") as string;
        const adresse = formData.get("adresse") as string;
        const postal = formData.get("postal") as string;
        const ville = formData.get("ville") as string;
        const siret = formData.get("siret") as string;
        const rcs = formData.get("rcs") as string;
        const meetingDate = formData.get("meetingDate") as string;
        const meetingTime = formData.get("meetingTime") as string;
        const exerciceDate = formData.get("exerciceDate") as string;
        const adressePerso = formData.get("adressePerso") as string;
        const postalPerso = formData.get("postalPerso") as string;
        const villePerso = formData.get("villePerso") as string;
        const benef = formData.get("benef") as string;
        const deficite = formData.get("deficite") as string;
        const n1Date = formData.get("n1Date") as string;
        const n1DateAGO = formData.get("n1DateAGO") as string;
        const montant11 = formData.get("montant11") as string;
        const montant12 = formData.get("montant12") as string;
        const montant13 = formData.get("montant13") as string;
        const n2Date = formData.get("n2Date") as string;
        const n2DateAGO = formData.get("n2DateAGO") as string;
        const montant21 = formData.get("montant21") as string;
        const montant22 = formData.get("montant22") as string;
        const montant23 = formData.get("montant23") as string;
        const n3Date = formData.get("n3Date") as string;
        const n3DateAGO = formData.get("n3DateAGO") as string;
        const montant31 = formData.get("montant31") as string;
        const montant32 = formData.get("montant32") as string;
        const montant33 = formData.get("montant33") as string;
        const completed = formData.get("completed");
        const participantsData = JSON.parse(formData.get("participants") as string) || [];

        // Supprimer tous les participants affiliés à cet AGO
        await prisma.participants.deleteMany({
            where: {
                agoId: id,
            },
        });

        // Créer de nouveaux participants à partir des données du formulaire
        const createdParticipants = await prisma.participants.createMany({
            data: participantsData.map((participant: Participants) => ({
                agoId: id,
                sexe: participant.sexe,
                firstName: participant.firstName,
                lastName: participant.lastName,
                shares: participant.shares,
            })),
        });

        // Mettre à jour l'AGO avec les autres données
        await prisma.ago.update({
            where: { id },
            data: {
                societeName: societeName,
                societeType: societeType,
                capitalAmount: capitalAmount,
                adresse: adresse,
                postal: postal,
                ville: ville,
                siret: siret,
                rcs: rcs,
                meetingDate: meetingDate,
                meetingTime: meetingTime,
                exerciceDate: exerciceDate,
                adressePerso: adressePerso,
                postalPerso: postalPerso,
                villePerso: villePerso,
                benef: benef,
                deficite: deficite,
                n1Date: n1Date,
                n1DateAGO: n1DateAGO,
                montant11: montant11,
                montant12: montant12,
                montant13: montant13,
                n2Date: n2Date,
                n2DateAGO: n2DateAGO,
                montant21: montant21,
                montant22: montant22,
                montant23: montant23,
                n3Date: n3Date,
                n3DateAGO: n3DateAGO,
                montant31: montant31,
                montant32: montant32,
                montant33: montant33,
                completed: completed === "on",
            },
        });

    } catch (error) {
        console.error("Error lors de la modif de l'AGO", error);
    } finally {
        redirect("/");
    }
}
