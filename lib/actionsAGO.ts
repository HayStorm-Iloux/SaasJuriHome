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
    const partsNumber = formData.get("partsNumber") as string;
    const meetingDate = formData.get("meetingDate") as string;
    const meetingTime = formData.get("meetingTime") as string;
    const approbationCompte = formData.get("approbationCompte");
    const approbationCompteShares = formData.get("approbationCompteShares") as string;
    const affectation = formData.get("affectation");
    const affectationShares = formData.get("affectationShares") as string;
    const approbationBoss = formData.get("approbationBoss");
    const approbationBossShares = formData.get("approbationBossShares") as string;
    const pouvoir = formData.get("pouvoir");
    const pouvoirShares = formData.get("pouvoirShares") as string;
    const lecture = formData.get("lecture");
    const lectureShares = formData.get("lectureShares") as string;
    const fixation = formData.get("fixation");
    const fixationShares = formData.get("fixationShares") as string;
    const distribution = formData.get("distribution");
    const distributionShares = formData.get("distributionShares") as string;
    const absence = formData.get("absence");
    const absenceShares = formData.get("absenceShares") as string;
    const exerciceDate = formData.get("exerciceDate") as string;
    const commissaire = formData.get("commissaire");
    const sexeCommissaire = formData.get("sexeCommissaire") as string;
    const prenomCommissaire = formData.get("prenomCommissaire") as string;
    const nomCommissaire = formData.get("nomCommissaire") as string;
    const presenceCommissaire = formData.get("presenceCommissaire");
    const adressePerso = formData.get("adressePerso") as string;
    const postalPerso = formData.get("postalPerso") as string;
    const villePerso = formData.get("villePerso") as string;
    const sexeComptable = formData.get("sexeComptable") as string;
    const prenomComptable = formData.get("prenomComptable") as string;
    const nomComptable = formData.get("nomComptable") as string;
    const societeNameComptable = formData.get("societeNameComptable") as string;
    const adresseComptable = formData.get("adresseComptable") as string;
    const postalComptable = formData.get("postalComptable") as string;
    const villeComptable = formData.get("villeComptable") as string;
    const siretComptable = formData.get("siretComptable") as string;
    const rcsComptable = formData.get("rcsComptable") as string;
    const acompter = formData.get("acompter") as string;
    const nondeduc = formData.get("nondeduc") as string;
    const convreg = formData.get("convreg");
    const benef = formData.get("benef") as string;
    const deficite = formData.get("deficite") as string;
    const a11 = formData.get("a11") as string;
    const a12 = formData.get("a12") as string;
    const a21 = formData.get("a21") as string;
    const a22 = formData.get("a22") as string;
    const a31 = formData.get("a31") as string;
    const a32 = formData.get("a32") as string;
    const a41 = formData.get("a41") as string;
    const a42 = formData.get("a42") as string;
    const a51 = formData.get("a51") as string;
    const a52 = formData.get("a52") as string;
    const a62 = formData.get("a62") as string;
    const a72 = formData.get("a72") as string;
    const a82 = formData.get("a82") as string;
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
        partsNumber: partsNumber,
        meetingDate: meetingDate,
        meetingTime: meetingTime,
        approbationCompte: approbationCompte === "on",
        approbationCompteShares: approbationCompteShares,
        affectation: affectation === "on",
        affectationShares: affectationShares,
        approbationBoss: approbationBoss === "on",
        approbationBossShares: approbationBossShares,
        pouvoir: pouvoir === "on",
        pouvoirShares: pouvoirShares,
        lecture: lecture === "on",
        lectureShares: lectureShares,
        fixation: fixation === "on",
        fixationShares: fixationShares,
        distribution: distribution === "on",
        distributionShares: distributionShares,
        absence: absence === "on",
        absenceShares: absenceShares,
        exerciceDate: exerciceDate,
        commissaire: commissaire === "on",
        sexeCommissaire: sexeCommissaire,
        prenomCommissaire: prenomCommissaire,
        nomCommissaire: nomCommissaire,
        presenceCommissaire: presenceCommissaire === "on",
        adressePerso: adressePerso,
        postalPerso: postalPerso,
        villePerso: villePerso,
        sexeComptable: sexeComptable,
        prenomComptable: prenomComptable,
        nomComptable: nomComptable,
        societeNameComptable: societeNameComptable,
        adresseComptable: adresseComptable,
        postalComptable: postalComptable,
        villeComptable: villeComptable,
        siretComptable: siretComptable,
        rcsComptable: rcsComptable,
        acompter: acompter,
        nondeduc: nondeduc,
        convreg: convreg === "on",
        benef: benef,
        deficite: deficite,
        a11: a11,
        a12: a12,
        a21: a21,
        a22: a22,
        a31: a31,
        a32: a32,
        a41: a41,
        a42: a42,
        a51: a51,
        a52: a52,
        a62: a62,
        a72: a72,
        a82: a82,
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
                    remuneration: participant.remuneration,
                    remunerationFuture: participant.remunerationFuture,
                    gerant: participant.gerant,
                })),
            },
        
    }
});

    redirect("/dashboard");
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
    revalidatePath("/dashboard");
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
        const partsNumber = formData.get("partsNumber") as string;
        const meetingDate = formData.get("meetingDate") as string;
        const meetingTime = formData.get("meetingTime") as string;
        const approbationCompte = formData.get("approbationCompte");
        const approbationCompteShares = formData.get("approbationCompteShares") as string;
        const affectation = formData.get("affectation");
        const affectationShares = formData.get("affectationShares") as string;
        const approbationBoss = formData.get("approbationBoss");
        const approbationBossShares = formData.get("approbationBossShares") as string;
        const pouvoir = formData.get("pouvoir");
        const pouvoirShares = formData.get("pouvoirShares") as string;
        const lecture = formData.get("lecture");
        const lectureShares = formData.get("lectureShares") as string;
        const fixation = formData.get("fixation");
        const fixationShares = formData.get("fixationShares") as string;
        const distribution = formData.get("distribution");
        const distributionShares = formData.get("distributionShares") as string;
        const absence = formData.get("absence");
        const absenceShares = formData.get("absenceShares") as string;
        const exerciceDate = formData.get("exerciceDate") as string;
        const commissaire = formData.get("commissaire");
        const sexeCommissaire = formData.get("sexeCommissaire") as string;
        const prenomCommissaire = formData.get("prenomCommissaire") as string;
        const nomCommissaire = formData.get("nomCommissaire") as string;
        const presenceCommissaire = formData.get("presenceCommissaire");
        const adressePerso = formData.get("adressePerso") as string;
        const postalPerso = formData.get("postalPerso") as string;
        const villePerso = formData.get("villePerso") as string;
        const sexeComptable = formData.get("sexeComptable") as string;
        const prenomComptable = formData.get("prenomComptable") as string;
        const nomComptable = formData.get("nomComptable") as string;
        const societeNameComptable = formData.get("societeNameComptable") as string;
        const adresseComptable = formData.get("adresseComptable") as string;
        const postalComptable = formData.get("postalComptable") as string;
        const villeComptable = formData.get("villeComptable") as string;
        const siretComptable = formData.get("siretComptable") as string;
        const rcsComptable = formData.get("rcsComptable") as string;
        const acompter = formData.get("acompter") as string;
        const nondeduc = formData.get("nondeduc") as string;
        const convreg = formData.get("convreg");
        const benef = formData.get("benef") as string;
        const deficite = formData.get("deficite") as string;
        const a11 = formData.get("a11") as string;
        const a12 = formData.get("a12") as string;
        const a21 = formData.get("a21") as string;
        const a22 = formData.get("a22") as string;
        const a31 = formData.get("a31") as string;
        const a32 = formData.get("a32") as string;
        const a41 = formData.get("a41") as string;
        const a42 = formData.get("a42") as string;
        const a51 = formData.get("a51") as string;
        const a52 = formData.get("a52") as string;
        const a62 = formData.get("a62") as string;
        const a72 = formData.get("a72") as string;
        const a82 = formData.get("a82") as string;
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
                remuneration: participant.remuneration,
                remunerationFuture: participant.remunerationFuture,
                gerant: participant.gerant,
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
            partsNumber: partsNumber,
            meetingDate: meetingDate,
            meetingTime: meetingTime,
            approbationCompte: approbationCompte === "on",
            approbationCompteShares: approbationCompteShares,
            affectation: affectation === "on",
            affectationShares: affectationShares,
            approbationBoss: approbationBoss === "on",
            approbationBossShares: approbationBossShares,
            pouvoir: pouvoir === "on",
            pouvoirShares: pouvoirShares,
            lecture: lecture === "on",
            lectureShares: lectureShares,
            fixation: fixation === "on",
            fixationShares: fixationShares,
            distribution: distribution === "on",
            distributionShares: distributionShares,
            absence: absence === "on",
            absenceShares: absenceShares,
            exerciceDate: exerciceDate,
            commissaire: commissaire === "on",
            sexeCommissaire: sexeCommissaire,
            prenomCommissaire: prenomCommissaire,
            nomCommissaire: nomCommissaire,
            presenceCommissaire: presenceCommissaire === "on",
            adressePerso: adressePerso,
            postalPerso: postalPerso,
            villePerso: villePerso,
            sexeComptable: sexeComptable,
            prenomComptable: prenomComptable,
            nomComptable: nomComptable,
            societeNameComptable: societeNameComptable,
            adresseComptable: adresseComptable,
            postalComptable: postalComptable,
            villeComptable: villeComptable,
            siretComptable: siretComptable,
            rcsComptable: rcsComptable,
            acompter: acompter,
            nondeduc: nondeduc,
            convreg: convreg === "on",
            benef: benef,
            deficite: deficite,
            a11: a11,
            a12: a12,
            a21: a21,
            a22: a22,
            a31: a31,
            a32: a32,
            a41: a41,
            a42: a42,
            a51: a51,
            a52: a52,
            a62: a62,
            a72: a72,
            a82: a82,
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
        redirect("/dashboard");
    }
}
