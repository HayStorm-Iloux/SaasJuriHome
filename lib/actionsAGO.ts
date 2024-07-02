"use server"

import { redirect } from "next/navigation";
import { prisma } from "./db";
import { getUser } from "./actionsUsers";
import { revalidatePath } from "next/cache";

export const getAllAGOs = async (userId: string) => {
    const data = await prisma.ago.findMany({
        where: {
            userId: userId
        },
        orderBy: {
            createdAt: "desc"
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
    const capitalAmount = Number(formData.get("capitalAmount")) || 0;
    const adresse = formData.get("adresse") as string;
    const postal = Number(formData.get("postal")) || 0;
    const ville = formData.get("ville") as string;
    const siret = Number(formData.get("siret")) || 0;
    const rcs = formData.get("rcs") as string;
    const meetingDate = new Date(formData.get("meetingDate") as string) || new Date();
    const meetingTime = formData.get("meetingTime") as string;
    const participants = JSON.parse(formData.get("participants") as string || '[]') as any[];
    const exerciceDate = new Date(formData.get("exerciceDate") as string) || new Date();
    const adressePerso = formData.get("adressePerso") as string;
    const postalPerso = Number(formData.get("postalPerso")) || 0;
    const villePerso = formData.get("villePerso") as string;
    const benef = formData.get("benef") as string;
    const deficite = formData.get("deficite") as string;
    const n1Date = new Date(formData.get("n1Date") as string) || new Date();
    const n1DateAGO = new Date(formData.get("n1DateAGO") as string) || new Date();
    const montant11 = Number(formData.get("montant11")) || 0;
    const montant12 = Number(formData.get("montant12")) || 0;
    const montant13 = Number(formData.get("montant13")) || 0;
    const n2Date = new Date(formData.get("n2Date") as string) || new Date();
    const n2DateAGO = new Date(formData.get("n2DateAGO") as string) || new Date();
    const montant21 = Number(formData.get("montant21")) || 0;
    const montant22 = Number(formData.get("montant22")) || 0;
    const montant23 = Number(formData.get("montant23")) || 0;
    const n3Date = new Date(formData.get("n3Date") as string) || new Date();
    const n3DateAGO = new Date(formData.get("n3DateAGO") as string) || new Date();
    const montant31 = Number(formData.get("montant31")) || 0;
    const montant32 = Number(formData.get("montant32")) || 0;
    const montant33 = Number(formData.get("montant33")) || 0;
    const completed = formData.get("completed");
    const user = await getUser();
    const userId = user?.id as string;

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
            participants: {
                create: participants.map((participant: any) => ({
                    sexe: participant.sexe,
                    firstName: participant.firstName,
                    lastName: participant.lastName,
                    shares: participant.shares
                }))
            },
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
            completed: completed === "on"
        }
    });
    redirect("/dashboard/notes");
}

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
        const capitalAmount = Number(formData.get("capitalAmount")) || 0;
        const adresse = formData.get("adresse") as string;
        const postal = Number(formData.get("postal")) || 0;
        const ville = formData.get("ville") as string;
        const siret = Number(formData.get("siret")) || 0;
        const rcs = formData.get("rcs") as string;
        const meetingDate = new Date(formData.get("meetingDate") as string) || new Date();
        const meetingTime = formData.get("meetingTime") as string;
        const participants = JSON.parse(formData.get("participants") as string || '[]') as any[];
        const exerciceDate = new Date(formData.get("exerciceDate") as string) || new Date();
        const adressePerso = formData.get("adressePerso") as string;
        const postalPerso = Number(formData.get("postalPerso")) || 0;
        const villePerso = formData.get("villePerso") as string;
        const benef = formData.get("benef") as string;
        const deficite = formData.get("deficite") as string;
        const n1Date = new Date(formData.get("n1Date") as string) || new Date();
        const n1DateAGO = new Date(formData.get("n1DateAGO") as string) || new Date();
        const montant11 = Number(formData.get("montant11")) || 0;
        const montant12 = Number(formData.get("montant12")) || 0;
        const montant13 = Number(formData.get("montant13")) || 0;
        const n2Date = new Date(formData.get("n2Date") as string) || new Date();
        const n2DateAGO = new Date(formData.get("n2DateAGO") as string) || new Date();
        const montant21 = Number(formData.get("montant21")) || 0;
        const montant22 = Number(formData.get("montant22")) || 0;
        const montant23 = Number(formData.get("montant23")) || 0;
        const n3Date = new Date(formData.get("n3Date") as string) || new Date();
        const n3DateAGO = new Date(formData.get("n3DateAGO") as string) || new Date();
        const montant31 = Number(formData.get("montant31")) || 0;
        const montant32 = Number(formData.get("montant32")) || 0;
        const montant33 = Number(formData.get("montant33")) || 0;
        const completed = formData.get("completed");

        if (societeName !== null || societeType !== null) {
            await prisma.ago.update({
                where: {
                    id
                },
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
                    participants: {
                        set: participants.map((participant: any) => ({
                            id: participant.id,
                            sexe: participant.sexe,
                            firstName: participant.firstName,
                            lastName: participant.lastName,
                            shares: participant.shares
                        }))
                    },
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
                    completed: completed === "on"
                }
            });
        }

    } catch (error) {
        console.error("Error lors de la modif de l'AGO", error);
    } finally {
        redirect("/");
    }
}
