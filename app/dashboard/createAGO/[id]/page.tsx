"use client";
import { useState, useEffect, ChangeEvent, use } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import CheckboxItem from "@/app/components/ordreJour";
import { Button } from "@/components/ui/button";
import { getAGO, createAGO } from "@/lib/actionsAGO";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { getSub } from "@/lib/actionsUsers";
import Tooltip from "@/app/components/Tooltip";
import { HelpCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { set } from "date-fns";
import { Value } from "@radix-ui/react-select";

interface Participant {
    gerant: boolean;
    sexe: string;
    firstName: string;
    lastName: string;
    shares: string;
    remuneration: string;
    remunerationFuture: string;
  }



interface UpdatePageProps {
    params: { id: string };
}


export default function UpdatePage({ params }: UpdatePageProps) {


    //protection Souscription
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            const sub = await getSub();
            console.log(sub);
            const hasActiveSubscription = sub?.subscription.some(
                (subscription) => subscription.status === "active"
            );
            if (!hasActiveSubscription) {
                router.push("/dashboard/payment");
            }
        };
        fetchData();
    }, []);
    
    // decla const
    const [ago, setAgo] = useState<any>(null);
    const [totalShares, setTotalShares] = useState<string>('');
    const [totalSharesNum, setTotalSharesNum] = useState<number>(0);
    const [totalParticipantShares, setTotalParticipantShares] = useState(0);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [warningMessage, setWarningMessage] = useState<string>('');
    const [hideTable, setHideTable] = useState(false);
    const [beneficiaire, setBeneficiaire] = useState<string>('');
    const [deficitaire, setDeficitaire] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([
        { gerant: false, sexe: "", firstName: "", lastName: "", shares: "", remuneration: "", remunerationFuture: "" },
    ]);
    const [hasCommissaire, setHasCommissaire] = useState(false);

    const[c1,setc1] = useState(false);
    const[c2,setc2] = useState(false);
    const[c3,setc3] = useState(false);
    const[c4,setc4] = useState(false);
    const[c5,setc5] = useState(false);
    const[c6,setc6] = useState(false);
    const[c7,setc7] = useState(false);
    const[c8,setc8] = useState(false);

    const handlesetc1 = (e: ChangeEvent<HTMLInputElement>) => {
        setc1(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc2 = (e: ChangeEvent<HTMLInputElement>) => {
        setc2(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc3 = (e: ChangeEvent<HTMLInputElement>) => {
        setc3(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc4 = (e: ChangeEvent<HTMLInputElement>) => {
        setc4(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc5 = (e: ChangeEvent<HTMLInputElement>) => {
        setc5(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc6 = (e: ChangeEvent<HTMLInputElement>) => {
        setc6(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc7 = (e: ChangeEvent<HTMLInputElement>) => {
        setc7(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };
    const handlesetc8 = (e: ChangeEvent<HTMLInputElement>) => {
        setc8(e.target.checked); // Met à jour l'état en fonction de la checkbox
    };

    // récupération participants et ago
    useEffect(() => {
        const fetchData = async () => {
            const fetchedAgo = await getAGO(params.id);
            if (fetchedAgo) {
                setAgo(fetchedAgo);
                setParticipants(
                    fetchedAgo.participants.map((participant: any) => ({
                        gerant: participant.gerant ?? false,
                        remuneration: participant.remuneration ?? "",
                        remunerationFuture: participant.remunerationFuture ?? "",
                        sexe: participant.sexe ?? "",
                        firstName: participant.firstName ?? "",
                        lastName: participant.lastName ?? "",
                        shares: participant.shares ?? "",
                    }))
                );
                setc1(fetchedAgo.approbationCompte);
                setc2(fetchedAgo.affectation);
                setc3(fetchedAgo.approbationBoss);
                setc4(fetchedAgo.pouvoir);
                setc5(fetchedAgo.lecture);
                setc6(fetchedAgo.fixation);
                setc7(fetchedAgo.distribution);
                setc8(fetchedAgo.absence);
                setHasCommissaire(fetchedAgo.commissaire);
                setHideTable(fetchedAgo.completed);
                setTotalShares(fetchedAgo.partsNumber?.toString() || '');
                setTotalSharesNum(parseInt(fetchedAgo.partsNumber?.toString() || '0') || 0);
                setBeneficiaire(fetchedAgo.benef?.toString() || '');
                setDeficitaire(fetchedAgo.deficite?.toString() || '');
            }

        };
        fetchData();
    }, [params.id]);

    

    // fonction pour ajouter/suppr un participant
    const handleAddParticipant = () => {
        setParticipants([...participants, {gerant: false, remuneration: "", remunerationFuture: "", sexe: "", firstName: "", lastName: "", shares: "" }]);
    };

    const handleRemoveParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleParticipantChange = (index: number, field: keyof Participant, value: string | number | boolean) => {
        setParticipants(
        participants.map((participant, i) =>
            i === index ? { ...participant, [field]: value } : participant
        )
        );
    };


    //fonction sécuriser le formulaire
    useEffect(() => {
        const newTotalShares = participants.reduce((sum, participant) => sum + (parseInt(participant.shares) || 0), 0);
        setTotalParticipantShares(newTotalShares);
    }, [participants]);



    const handleTotalSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTotalShares(value);
        setTotalSharesNum(parseInt(value) || 0);
    };


    //rend le formulaire impossible si benef ou deficit est rempli

    const handleDeficitaireChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeficitaire(value);
        if (value !== '') {
            setBeneficiaire('');
        }
    };

    const handleBeneficiaireChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBeneficiaire(value);
        if (value !== '') {
            setDeficitaire('');
        }
    };


    //regarde checkbox pour afficher tableau
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHideTable(event.target.checked);
    };

    //fonction pour valider les parts avec les participants
    useEffect(() => {
        validateShares();
    }, [totalShares, participants]);

    const validateShares = () => {
        const participantSharesSum = participants.reduce((sum, participant) => sum + (parseInt(participant.shares) || 0), 0);
        if (totalSharesNum < participantSharesSum) {
            setIsValid(false);
            setErrorMessage("La somme des parts des participants ne peut pas dépasser le nombre total de parts de la société.");
            setWarningMessage('');
        } else if (participantSharesSum < totalSharesNum / 2) {
            setIsValid(true);
            setErrorMessage('');
            setWarningMessage("Impossible de créer une AGO avec moins de la moitié des parts de la société.");
        } else {
            setIsValid(true);
            setErrorMessage('');
            setWarningMessage('');
        }
    }


    if (!ago) return <div className="text-green-700 font-bold text-3xl text-center">Chargement...</div>;

    return (
        <Card>
            <form action={createAGO}>
                <Input type="hidden" name="id" value={ago.id} />
                <CardHeader>
                    <CardTitle>Modifier AGO</CardTitle>
                    <CardDescription>Quelques informations pour mettre à jour l'AGO</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5 ">
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="societeName">Dénomination sociale</Label>
                        <Input type="text" id="societeName" name="societeName" defaultValue={ago.societeName} required />
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="societeType">Type de société</Label>
                        <Select name="societeType" defaultValue={ago.societeType} required>
                            <SelectTrigger>
                                <SelectValue placeholder="ex : SARL" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="Société à Responsabilité Limitée (SARL)">SARL - Société à Responsabilité Limitée</SelectItem>
                                    <SelectItem value="Société Anonyme (SA)">SA - Société Anonyme</SelectItem>
                                    <SelectItem value="Société par Actions Simplifiée (SAS)">SAS - Société par Actions Simplifiée</SelectItem>
                                    <SelectItem value="Société par Actions Simplifiée Unipersonnelle (SASU)">SASU - Société par Actions Simplifiée Unipersonnelle</SelectItem>
                                    <SelectItem value="Société en Nom Collectif (SNC)">SNC - Société en Nom Collectif</SelectItem>
                                    <SelectItem value="Société Civile Immobilière (SCI)">SCI - Société Civile Immobilière</SelectItem>
                                    <SelectItem value="Entreprise unipersonnelle à responsabilité limitée (EURL)">EURL - Entreprise unipersonnelle à responsabilité limitée</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="capitalAmount">Montant du capital (en euros)</Label>
                        <Input type="number" onWheel={(e) => (e.target as HTMLInputElement).blur()} id="capitalAmount" name="capitalAmount" defaultValue={ago.capitalAmount} required />
                    </div>
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="adresse">Adresse du siège social figurant sur le kbis</Label>
                            <Input type="text" id="adresse" name="adresse" defaultValue={ago.adresse} required />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="adresse">Adresse du siège social figurant sur le kbis</Label>
                                <Tooltip text="L'adresse qui est sur le Kbis d'une société c'est l'adresse de son siège sociale c'est-à-dire que c'est l'adresse fiscale ou encore l'adresse de domiciliation">
                                    <HelpCircle className="w-4 h-4 cursor-help" />
                                </Tooltip>
                            </div>
                            <Input type="number" id="postal" name="postal" defaultValue={ago.postal} required />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="ville">Ville</Label>
                            <Input type="text" id="ville" name="ville" defaultValue={ago.ville} required />
                        </div>
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="siret">Numéro de SIREN</Label>
                            <Tooltip text="Les numéros de SIREN sont les 9 premiers chiffres du numéro de SIRET de votre entreprise (sans les 5 chiffres du NIC)">
                                <HelpCircle className="w-4 h-4 cursor-help" />
                            </Tooltip>
                        </div>
                        <Input type="number" id="siret" name="siret" defaultValue={ago.siret} required />
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="rcs">RCS</Label>
                            <Tooltip text="Registre du commerce et des sociétés auquel se rattache la société">
                                <HelpCircle className="w-4 h-4 cursor-help" />
                            </Tooltip>
                        </div>
                        <Select name="rcs" defaultValue={ago.rcs} required>
                            <SelectTrigger>
                                <SelectValue placeholder="ex : Lille Métropole" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>01 - Ain</SelectLabel>
                                <SelectItem value="RCS Bourg-en-Bresse">Bourg-en-Bresse</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>02 - Aisne</SelectLabel>
                                <SelectItem value="RCS Saint-Quentin">Saint-Quentin</SelectItem>
                                <SelectItem value="RCS Soissons">Soissons</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>03 - Allier</SelectLabel>
                                <SelectItem value="RCS Cusset">Cusset</SelectItem>
                                <SelectItem value="RCS Montluçon">Montluçon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>04 - Alpes-de-Haute-Provence</SelectLabel>
                                <SelectItem value="RCS Manosque">Manosque</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>05 - Hautes-Alpes</SelectLabel>
                                <SelectItem value="RCS Gap">Gap</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>06 - Alpes-Maritimes</SelectLabel>
                                <SelectItem value="RCS Antibes">Antibes</SelectItem>
                                <SelectItem value="RCS Cannes">Cannes</SelectItem>
                                <SelectItem value="RCS Grasse">Grasse</SelectItem>
                                <SelectItem value="RCS Nice">Nice</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>07 - Ardèche</SelectLabel>
                                <SelectItem value="RCS Aubenas">Aubenas</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>08 - Ardennes</SelectLabel>
                                <SelectItem value="RCS Sedan">Sedan</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>09 - Ariège</SelectLabel>
                                <SelectItem value="RCS Foix">Foix</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>10 - Aube</SelectLabel>
                                <SelectItem value="RCS Troyes">Troyes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>11 - Aude</SelectLabel>
                                <SelectItem value="RCS Carcassonne">Carcassonne</SelectItem>
                                <SelectItem value="RCS Narbonne">Narbonne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>12 - Aveyron</SelectLabel>
                                <SelectItem value="RCS Rodez">Rodez</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>13 - Bouches-du-Rhône</SelectLabel>
                                <SelectItem value="RCS Aix-en-Provence">Aix-en-Provence</SelectItem>
                                <SelectItem value="RCS Marseille">Marseille</SelectItem>
                                <SelectItem value="RCS Salon-de-Provence">Salon-de-Provence</SelectItem>
                                <SelectItem value="RCS Tarascon">Tarascon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>14 - Calvados</SelectLabel>
                                <SelectItem value="RCS Caen">Caen</SelectItem>
                                <SelectItem value="RCS Lisieux">Lisieux</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>15 - Cantal</SelectLabel>
                                <SelectItem value="RCS Aurillac">Aurillac</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>16 - Charente</SelectLabel>
                                <SelectItem value="RCS Angoulême">Angoulême</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>17 - Charente-Maritime</SelectLabel>
                                <SelectItem value="RCS La Rochelle">La Rochelle</SelectItem>
                                <SelectItem value="RCS Saintes">Saintes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>18 - Cher</SelectLabel>
                                <SelectItem value="RCS Bourges">Bourges</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>19 - Corrèze</SelectLabel>
                                <SelectItem value="RCS Brive-la-Gaillarde">Brive-la-Gaillarde</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>2A - Corse-du-Sud</SelectLabel>
                                <SelectItem value="RCS Ajaccio">Ajaccio</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>2B - Corse du Nord</SelectLabel>
                                <SelectItem value="RCS Bastia">Bastia</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>21 - Côte-d'Or</SelectLabel>
                                <SelectItem value="RCS Dijon">Dijon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>22 - Côtes-d'Armor</SelectLabel>
                                <SelectItem value="RCS Saint-Brieuc">Saint-Brieuc</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>23 - Creuse</SelectLabel>
                                <SelectItem value="RCS Guéret">Guéret</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>24 - Dordogne</SelectLabel>
                                <SelectItem value="RCS Bergerac">Bergerac</SelectItem>
                                <SelectItem value="RCS Périgueux">Périgueux</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>25 - Doubs</SelectLabel>
                                <SelectItem value="RCS Besançon">Besançon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>26 - Drôme</SelectLabel>
                                <SelectItem value="RCS Romans-sur-Isère">Romans-sur-Isère</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>27 - Eure</SelectLabel>
                                <SelectItem value="RCS Evreux">Evreux</SelectItem>
                                <SelectItem value="RCS Bernay">Bernay</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>28 - Eure-et-Loir</SelectLabel>
                                <SelectItem value="RCS Chartres">Chartres</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>29 - Finistère</SelectLabel>
                                <SelectItem value="RCS Brest">Brest</SelectItem>
                                <SelectItem value="RCS Quimper">Quimper</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>30 - Gard</SelectLabel>
                                <SelectItem value="RCS Nîmes">Nîmes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>31 - Haute Garonne</SelectLabel>
                                <SelectItem value="RCS Toulouse">Toulouse</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>32 - Gers</SelectLabel>
                                <SelectItem value="RCS Auch">Auch</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>33 - Gironde</SelectLabel>
                                <SelectItem value="RCS Bordeaux">Bordeaux</SelectItem>
                                <SelectItem value="RCS Libourne">Libourne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>34 - Hérault</SelectLabel>
                                <SelectItem value="RCS Béziers">Béziers</SelectItem>
                                <SelectItem value="RCS Montpellier">Montpellier</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>35 - Ille-et-Vilaine</SelectLabel>
                                <SelectItem value="RCS Rennes">Rennes</SelectItem>
                                <SelectItem value="RCS Saint-Malo">Saint-Malo</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>36 - Indre</SelectLabel>
                                <SelectItem value="RCS Châteauroux">Châteauroux</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>37 - Indre-et-Loire</SelectLabel>
                                <SelectItem value="RCS Tours">Tours</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>38 - Isère</SelectLabel>
                                <SelectItem value="RCS Grenoble">Grenoble</SelectItem>
                                <SelectItem value="RCS Vienne">Vienne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>39 - Jura</SelectLabel>
                                <SelectItem value="RCS Lons-le-Saunier">Lons-le-Saunier</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>40 - Landes</SelectLabel>
                                <SelectItem value="RCS Dax">Dax</SelectItem>
                                <SelectItem value="RCS Mont-de-Marsan">Mont-de-Marsan</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>41 - Loir-et-Cher</SelectLabel>
                                <SelectItem value="RCS Blois">Blois</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>42 - Loire</SelectLabel>
                                <SelectItem value="RCS Roanne">Roanne</SelectItem>
                                <SelectItem value="RCS Saint-Etienne">Saint-Etienne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>43 - Haute-Loire</SelectLabel>
                                <SelectItem value="RCS Le Puy-en-Velay">Le Puy-en-Velay</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>44 - Loire-Atlantique</SelectLabel>
                                <SelectItem value="RCS Nantes">Nantes</SelectItem>
                                <SelectItem value="RCS Saint-Nazaire">Saint-Nazaire</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>45 - Loiret</SelectLabel>
                                <SelectItem value="RCS Orléans">Orléans</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>46 - Lot</SelectLabel>
                                <SelectItem value="RCS Cahors">Cahors</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>47 - Lot-et-Garonne</SelectLabel>
                                <SelectItem value="RCS Agen">Agen</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>48 - Lozère</SelectLabel>
                                <SelectItem value="RCS Mende">Mende</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>49 - Maine-et-Loire</SelectLabel>
                                <SelectItem value="RCS Angers">Angers</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>50 - Manche</SelectLabel>
                                <SelectItem value="RCS Cherbourg-Octeville">Cherbourg-Octeville</SelectItem>
                                <SelectItem value="RCS Coutances">Coutances</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>51 - Marne</SelectLabel>
                                <SelectItem value="RCS Châlons-en-Champagne">Châlons-en-Champagne</SelectItem>
                                <SelectItem value="RCS Reims">Reims</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>52 - Haute-Marne</SelectLabel>
                                <SelectItem value="RCS Chaumont">Chaumont</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>53 - Mayenne</SelectLabel>
                                <SelectItem value="RCS Laval">Laval</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>54 - Meurthe-et-Moselle</SelectLabel>
                                <SelectItem value="RCS Nancy">Nancy</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>55 - Meuse</SelectLabel>
                                <SelectItem value="RCS Bar-le-Duc">Bar-le-Duc</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>56 - Morbihan</SelectLabel>
                                <SelectItem value="RCS Lorient">Lorient</SelectItem>
                                <SelectItem value="RCS Vannes">Vannes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>57 - Moselle</SelectLabel>
                                <SelectItem value="RCS Metz">Metz</SelectItem>
                                <SelectItem value="RCS Sarreguemines">Sarreguemines</SelectItem>
                                <SelectItem value="RCS Thionville">Thionville</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>58 - Nièvre</SelectLabel>
                                <SelectItem value="RCS Nevers">Nevers</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>59 - Nord</SelectLabel>
                                <SelectItem value="RCS Douai">Douai</SelectItem>
                                <SelectItem value="RCS Dunkerque">Dunkerque</SelectItem>
                                <SelectItem value="RCS Lille">Lille Métropole</SelectItem>
                                <SelectItem value="RCS Valenciennes">Valenciennes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>60 - Oise</SelectLabel>
                                <SelectItem value="RCS Beauvais">Beauvais</SelectItem>
                                <SelectItem value="RCS Compiègne">Compiègne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>61 - Orne</SelectLabel>
                                <SelectItem value="RCS Alençon">Alençon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>62 - Pas-de-Calais</SelectLabel>
                                <SelectItem value="RCS Arras">Arras</SelectItem>
                                <SelectItem value="RCS Boulogne-sur-Mer">Boulogne-sur-Mer</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>63 - Puy-de-Dôme</SelectLabel>
                                <SelectItem value="RCS Clermont-Ferrand">Clermont-Ferrand</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>64 - Pyrénées-Atlantiques</SelectLabel>
                                <SelectItem value="RCS Bayonne">Bayonne</SelectItem>
                                <SelectItem value="RCS Pau">Pau</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>65 - Hautes-Pyrénées</SelectLabel>
                                <SelectItem value="RCS Tarbes">Tarbes</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>66 - Pyrénées-Orientales</SelectLabel>
                                <SelectItem value="RCS Perpignan">Perpignan</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>67 - Bas-Rhin</SelectLabel>
                                <SelectItem value="RCS Saverne">Saverne</SelectItem>
                                <SelectItem value="RCS Strasbourg">Strasbourg</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>68 - Haut-Rhin</SelectLabel>
                                <SelectItem value="RCS Colmar">Colmar</SelectItem>
                                <SelectItem value="RCS Mulhouse">Mulhouse</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>69 - Rhône</SelectLabel>
                                <SelectItem value="RCS Lyon">Lyon</SelectItem>
                                <SelectItem value="RCS Villefranche-Tarare">Villefranche-Tarare</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>70 - Haute-Saône</SelectLabel>
                                <SelectItem value="RCS Vesoul">Vesoul</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>71 - Saône-et-Loire</SelectLabel>
                                <SelectItem value="RCS Chalon-sur-Saône">Chalon-sur-Saône</SelectItem>
                                <SelectItem value="RCS Mâcon">Mâcon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>72 - Sarthe</SelectLabel>
                                <SelectItem value="RCS Le Mans">Le Mans</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>73 - Savoie</SelectLabel>
                                <SelectItem value="RCS Chambéry">Chambéry</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>74 - Haute-Savoie</SelectLabel>
                                <SelectItem value="RCS Annecy">Annecy</SelectItem>
                                <SelectItem value="RCS Thonon-les-Bains">Thonon-les-Bains</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>75 - Paris</SelectLabel>
                                <SelectItem value="RCS Paris">Paris</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>76 - Seine-Maritime</SelectLabel>
                                <SelectItem value="RCS Dieppe">Dieppe</SelectItem>
                                <SelectItem value="RCS Le Havre">Le Havre</SelectItem>
                                <SelectItem value="RCS Rouen">Rouen</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>77 - Seine-et-Marne</SelectLabel>
                                <SelectItem value="RCS Meaux">Meaux</SelectItem>
                                <SelectItem value="RCS Melun">Melun</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>78 - Yvelines</SelectLabel>
                                <SelectItem value="RCS Versailles">Versailles</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>79 - Deux-Sèvres</SelectLabel>
                                <SelectItem value="RCS Niort">Niort</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>80 - Somme</SelectLabel>
                                <SelectItem value="RCS Amiens">Amiens</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>81 - Tarn</SelectLabel>
                                <SelectItem value="RCS Albi">Albi</SelectItem>
                                <SelectItem value="RCS Castres">Castres</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>82 - Tarn-et-Garonne</SelectLabel>
                                <SelectItem value="RCS Montauban">Montauban</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>83 - Var</SelectLabel>
                                <SelectItem value="RCS Draguignan">Draguignan</SelectItem>
                                <SelectItem value="RCS Fréjus">Fréjus</SelectItem>
                                <SelectItem value="RCS Toulon">Toulon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>84 - Vaucluse</SelectLabel>
                                <SelectItem value="RCS Avignon">Avignon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>85 - Vendée</SelectLabel>
                                <SelectItem value="RCS La Roche-sur-Yon">La Roche-sur-Yon</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>86 - Vienne</SelectLabel>
                                <SelectItem value="RCS Poitiers">Poitiers</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>87 - Haute-Vienne</SelectLabel>
                                <SelectItem value="RCS Limoges">Limoges</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>88 - Vosges</SelectLabel>
                                <SelectItem value="RCS Epinal">Epinal</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>89 - Yonne</SelectLabel>
                                <SelectItem value="RCS Auxerre">Auxerre</SelectItem>
                                <SelectItem value="RCS Sens">Sens</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>90 - Territoire-de-Belfort</SelectLabel>
                                <SelectItem value="RCS Belfort">Belfort</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>91 - Essonne</SelectLabel>
                                <SelectItem value="RCS Evry">Evry</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>92 - Hauts-de-Seine</SelectLabel>
                                <SelectItem value="RCS Nanterre">Nanterre</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>93 - Seine-Saint-Denis</SelectLabel>
                                <SelectItem value="RCS Bobigny">Bobigny</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>94 - Val-de-Marne</SelectLabel>
                                <SelectItem value="RCS Créteil">Créteil</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>95 - Val-d'Oise</SelectLabel>
                                <SelectItem value="RCS Pontoise">Pontoise</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>971 - Guadeloupe</SelectLabel>
                                <SelectItem value="RCS Pointe à Pitre">Pointe à Pitre</SelectItem>
                                <SelectItem value="RCS Basse Terre">Basse Terre</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>972 - Martinique</SelectLabel>
                                <SelectItem value="RCS Fort de France">Fort de France</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>973 - Guyanne</SelectLabel>
                                <SelectItem value="RCS Cayenne">Cayenne</SelectItem>
                                </SelectGroup>
                                <SelectGroup>
                                <SelectLabel>974 - Réunion</SelectLabel>
                                <SelectItem value="RCS Saint Denis">Saint Denis</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="partsNumber">Nombre de parts de la société</Label>
                        <Input 
                            type="number" 
                            onWheel={(e) => (e.target as HTMLInputElement).blur()}
                            id="partsNumber" 
                            name="partsNumber" 
                            min="0"
                            className="border-gray-300 border"
                            placeholder="ex : 500" 
                            required
                            defaultValue={ago.partsNumber}
                            onChange={handleTotalSharesChange}
                        />
                    </div>
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="meetingDate">Date de l'assemblée</Label>
                            <Input type="date" id="meetingDate" name="meetingDate" defaultValue={ago.meetingDate} required />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="meetingTime">Heure de l'assemblée</Label>
                            <Input type="time" id="meetingTime" name="meetingTime" defaultValue={ago.meetingTime} required />
                        </div>
                    </div>
                    <div className="gap-y-2 flex flex-col border-2 border-gray-500 p-6">
                    <div>
                        <h1 className="text-green-700 font-bold text-2xl text-center mb-4 underline underline-offset-2">Participants :</h1>
                    </div>
                    {participants.map((participant, index) => (
                    <div key={index} className={`flex space-x-5 mb-2 pb-4 ${
                                participants.length > 1 && index !== participants.length - 1 
                                ? 'border-b border-b-green-700' 
                                : ''
                            }`}
                        >
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label className="text-center" htmlFor={`gerant-${index}`}>Est-il gérant ?</Label>
                        <Input
                            type="checkbox"
                            id={`gerant-${index}`}
                            name={`gerant-${index}`}
                            className="border border-gray-300"
                            defaultChecked={participant.gerant}
                            onChange={(e) => handleParticipantChange(index, "gerant", e.target.checked)}
                        />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor={`sexe-${index}`}>Sexe</Label>
                        <Select
                            name={`sexe-${index}`}
                            value={participant.sexe}
                            defaultValue={participant.sexe}
                            onValueChange={(value) => handleParticipantChange(index, "sexe", value as string)}
                            required
                        >
                            <SelectTrigger className="border border-gray-300">
                            <SelectValue placeholder="------"  />
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup >
                                <SelectItem value="Monsieur">Monsieur</SelectItem>
                                <SelectItem value="Madame">Madame</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor={`firstName-${index}`}>Prénom</Label>
                        <Input
                            type="text"
                            id={`firstName-${index}`}
                            name={`firstName-${index}`}
                            defaultValue={participant.firstName}
                            onChange={(e) => handleParticipantChange(index, "firstName", e.target.value)}
                            placeholder="ex : Jean"
                            className="border border-gray-300"
                            required
                        />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor={`lastName-${index}`}>Nom</Label>
                        <Input
                            type="text"
                            id={`lastName-${index}`}
                            name={`lastName-${index}`}
                            defaultValue={participant.lastName}
                            onChange={(e) => handleParticipantChange(index, "lastName", e.target.value)}
                            placeholder="ex : Dupont"
                            className="border border-gray-300"
                            required
                        />
                        </div>
                        
                        <div className="gap-y-2 flex flex-col w-1/4">
                            <Label htmlFor={`shares-${index}`}>Nombre de parts</Label>
                            <Input
                            type="number"
                            id={`shares-${index}`}
                            name={`shares-${index}`}
                            defaultValue={participant.shares}
                            onChange={(e) => handleParticipantChange(index, "shares", e.target.value)}
                            min="0"
                            className="border border-gray-300"
                            placeholder="ex : 10"
                            required
                            />
                        </div>
                        <div className="flex items-center pt-5">
                        
                        <Button
                            type="button"
                            className="bg-red-500 hover:bg-red-600 text-white"
                            onClick={() => handleRemoveParticipant(index)}
                        >
                            Supprimer
                        </Button>
                        
                        </div>
                    </div>
                    ))}
                    <div className="flex flex-col items-center pt-3">
                        {!isValid && <p className="text-red-500 text-sm mb-2">{errorMessage}</p>}
                        {warningMessage && <p className="text-red-500 text-sm mb-2">{warningMessage}</p>}   
                        <Button type="button" className="bg-green-700 hover:bg-green-800 text-white w-[180px] font-semibold" onClick={handleAddParticipant}>
                        Ajouter un participant
                        </Button>
                    </div>
                </div>
                    <input type="hidden" name="participants" value={JSON.stringify(participants)} />
                    <div className="flex flex-col border-2 border-gray-500 p-4">
                    <Label htmlFor="ordreDuJour" className="text-2xl underline underline-offset-2 text-green-700 font-bold text-center">Ordre du Jour :</Label>
                       
                       <div className="flex items-center justify-start gap-4">
                            <Input type="checkbox" className="w-6" onChange={handlesetc1} id="approbationCompte" defaultChecked={ago.approbationCompte} name="approbationCompte"/>
                            <Label htmlFor="approbationCompte">Approbation des comptes de l'exercice clos et quitus à la gérance</Label>
                            {c1 && (
                                <label
                                htmlFor="approbationCompteShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="approbationCompteShares"
                                    defaultValue={ago.approbationCompteShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">
                            <Input type="checkbox" className="w-6" onChange={handlesetc2} id="affectation" defaultChecked={ago.affectation} name="affectation"/>
                            <Label htmlFor="affectation">Affectation du résultat de l'exercice</Label>
                            {c2 && (
                                <label
                                htmlFor="affectationShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="affectationShares"
                                    defaultValue={ago.affectationShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-start gap-4">                          
                            <Input type="checkbox" className="w-6" onChange={handlesetc3} id="approbationBoss" defaultChecked={ago.approbationBoss} name="approbationBoss"/>
                            <Label htmlFor="approbationBoss">Approbation de la rémunération allouée aux Gérants</Label>
                            {c3 && (
                                <label
                                htmlFor="approbationBossShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="approbationBossShares"
                                    defaultValue={ago.approbationBossShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">                      
                            <Input type="checkbox" className="w-6" onChange={handlesetc4} id="pouvoir" defaultChecked={ago.pouvoir} name="pouvoir"/>
                            <Label htmlFor="pouvoir">Pouvoirs pour l'accomplissement des formalités</Label>
                            {c4 && (
                                <label
                                htmlFor="pouvoirShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="pouvoirShares"
                                    defaultValue={ago.pouvoirShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">                
                            <Input type="checkbox" className="w-6" onChange={handlesetc5} id="lecture" defaultChecked={ago.lecture} name="lecture"/>
                            <Label htmlFor="lecture">Lecture du rapport spécial sur les conventions visées à l'article L. 223-19 du Code de commerce, et décision à cet égard</Label>
                            {c5 && (
                                <label
                                htmlFor="lectureShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="lectureShares"
                                    defaultValue={ago.lectureShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">  
                            <Input type="checkbox" className="w-6" onChange={handlesetc6} id="fixation" defaultChecked={ago.fixation} name="fixation"/>
                            <Label htmlFor="fixation">Fixation de la rémunération aux Gérants</Label>
                            {c6 && (
                                <label
                                htmlFor="fixationShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="fixationShares"
                                    defaultValue={ago.fixationShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">                
                            <Input type="checkbox" className="w-6" onChange={handlesetc7} id="distribution" defaultChecked={ago.distribution} name="distribution"/>
                            <Label htmlFor="distribution">Distribution de dividende</Label>
                            {c7 && (
                                <label
                                htmlFor="distributionShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="distributionShares"
                                    defaultValue={ago.distributionShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>

                        <div className="flex items-center justify-start gap-4">                           
                            <Input type="checkbox" className="w-6" onChange={handlesetc8} id="absence" defaultChecked={ago.absence} name="absence"/>
                            <Label htmlFor="absence">Absence de rémunération du dirigeant</Label>
                            {c8 && (
                                <label
                                htmlFor="absenceShares"
                                className="p-1 text-sm font-semibold pl-6 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700"
                                >
                                Voté à 
                                <input 
                                    className=" mx-1 text-center border w-1/3 border-green-700"
                                    type="number"
                                    min="0"
                                    name="absenceShares"
                                    defaultValue={ago.absenceShares}
                                    max={totalParticipantShares}
                                    required
                                />
                                /{totalParticipantShares}
                                </label>
                            )}
                        </div>
                                        
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="exerciceDate">Date de cloture de l'exercice social</Label>
                        <Input type="date" id="exerciceDate" defaultValue={ago.exerciceDate} name="exerciceDate" required/>
                    </div>
                    <div className={`${hasCommissaire ? 'border-2 border-gray-500 p-4 rounded' : ''}`}>
                        <div className="gap-y-2 flex flex-col ">
                        <div className="flex items-center space-x-2">
                            <Input className="w-5" type="checkbox" id="commissaire"
                                name="commissaire" 
                                defaultChecked={ago.commissaire}
                                onChange={(e) => setHasCommissaire(e.target.checked)}
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Avez-vous un commissaire aux comptes
                            </label>
                        </div>
                        </div>
                    {hasCommissaire && (
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/4">
                            <Label htmlFor="sexeCommissaire">Informations commissaire aux comptes</Label>
                            <Select name="sexeCommissaire" defaultValue={ago.sexeCommissaire} required>
                                <SelectTrigger className="border border-gray-300">
                                    <SelectValue placeholder="-------"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="Monsieur">Monsieur</SelectItem>
                                        <SelectItem value="Madame">Madame</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                            <Label htmlFor="prenomCommissaire">Prénom</Label>
                            <Input
                                type="text"
                                id="prenomCommissaire"
                                name="prenomCommissaire"
                                defaultValue={ago.prenomCommissaire}
                                className="border border-gray-300"
                                placeholder="ex : Jean"
                                required
                            />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                            <Label htmlFor="nomCommissaire">Nom</Label>
                            <Input
                                type="text"
                                id="nomCommissaire"
                                defaultValue={ago.nomCommissaire}
                                className="border border-gray-300"
                                name="nomCommissaire"
                                placeholder="ex : Dupont"
                                required
                            />
                        </div>
                        <div className="gap-y-2 flex flex-col items-center justify-center w-1/4">
                            <Label htmlFor="presenceCommissaire">Présent à l'assemblée</Label>
                            <Switch defaultChecked={ago.presenceCommissaire} name="presenceCommissaire" className="border border-gray-300"/>
                        </div>
                    </div>
                )}
                    </div>
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <div className="flex items-center gap-2">
                                <Label htmlFor="adressePerso">Adresse Personnelle</Label>
                                <Tooltip text="Cette adresse doit correspondre au premier gérant que vous avez renseigné">
                                    <HelpCircle className="w-4 h-4 cursor-help" />
                                </Tooltip>
                            </div>
                            <Input type="text" id="adressePerso" name="adressePerso" defaultValue={ago.adressePerso} placeholder="ex : 47 Rue de l'Hôpital Militaire" required/>
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="postalPerso">Code Postal</Label>
                            <Input type="number" id="postalPerso" name="postalPerso" defaultValue={ago.postalPerso} min="0" max="99999" placeholder="ex : 59000" required/>
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="villePerso">Ville</Label>
                            <Input type="text" id="villePerso" name="villePerso" defaultValue={ago.villePerso} placeholder="ex : Lille" required/>
                        </div>
                    </div>

                    <div className="gap-y-2 flex flex-col">
                    <div className="flex space-x-5">
                        <div className="w-2/12 flex items-center justify-center pt-5">
                        
                        <Label htmlFor="comptable">Expert-Comptable :</Label>
                        
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="sexeComptable">Sexe</Label>
                        <Select
                            name="sexeComptable"
                            required
                            defaultValue={ago.sexeComptable}
                        >
                            <SelectTrigger className="border border-gray-300">
                            <SelectValue placeholder="-------"/>
                            </SelectTrigger>
                            <SelectContent>
                            <SelectGroup>
                                <SelectItem value="Monsieur">Monsieur</SelectItem>
                                <SelectItem value="Madame">Madame</SelectItem>
                            </SelectGroup>
                            </SelectContent>
                        </Select>
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="prenomComptable">Prénom</Label>
                        <Input
                            type="text"
                            className="border border-gray-300"
                            defaultValue={ago.prenomComptable}
                            id="prenomComptable"
                            name="prenomComptable"
                            placeholder="ex : Jean"
                            required
                        />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="nomComptable">Nom</Label>
                        <Input
                            type="text"
                            className="border border-gray-300"
                            defaultValue={ago.nomComptable}
                            id="nomComptable"
                            name="nomComptable"
                            placeholder="ex : Dupont"
                            required
                        />
                        </div>
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="societeNameComptable">Dénomination sociale du cabinet</Label>
                    <Input defaultValue={ago.societeNameComptable} className="border border-gray-300" type="text" id="societeNameComptable" name="societeNameComptable" placeholder="ex : OpenAI"required/>
                </div>
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="adresseComptable">Adresse du cabinet</Label>
                        <Input defaultValue={ago.adresseComptable} className="border border-gray-300" type="text" id="adresseComptable" name="adresseComptable" placeholder="ex : 47 Rue de l'Hôpital Militaire" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="postalComptable">Code Postal</Label>
                        <Input defaultValue={ago.postalComptable} className="border border-gray-300" type="number" id="postalComptable" name="postalComptable" min="0" max="99999" placeholder="ex : 59000" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="villeComptable">Ville</Label>
                        <Input defaultValue={ago.villeComptable} className="border border-gray-300" type="text" id="villeComptable" name="villeComptable" placeholder="ex : Lille" required/>
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="siretComptable">Numéro de SIREN du cabinet</Label>
                    <Input defaultValue={ago.siretComptable} className="border border-gray-300" type="number" id="siretComptable" name="siretComptable" min="0" pattern="[0-9]{9}" placeholder="ex : 123456789" required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="rcsComptable">RCS du cabinet</Label>
                        <Tooltip text="Registre du commerce et des sociétés auquel est rattaché le cabinet comptable">
                            <HelpCircle className="w-4 h-4 cursor-help" />
                        </Tooltip>
                   </div>
                    <Select name="rcsComptable" defaultValue={ago.rcsComptable} required>
                        <SelectTrigger className="border border-gray-300">
                            <SelectValue placeholder="-----------" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>01 - Ain</SelectLabel>
                            <SelectItem value="RCS Bourg-en-Bresse">Bourg-en-Bresse</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>02 - Aisne</SelectLabel>
                            <SelectItem value="RCS Saint-Quentin">Saint-Quentin</SelectItem>
                            <SelectItem value="RCS Soissons">Soissons</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>03 - Allier</SelectLabel>
                            <SelectItem value="RCS Cusset">Cusset</SelectItem>
                            <SelectItem value="RCS Montluçon">Montluçon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>04 - Alpes-de-Haute-Provence</SelectLabel>
                            <SelectItem value="RCS Manosque">Manosque</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>05 - Hautes-Alpes</SelectLabel>
                            <SelectItem value="RCS Gap">Gap</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>06 - Alpes-Maritimes</SelectLabel>
                            <SelectItem value="RCS Antibes">Antibes</SelectItem>
                            <SelectItem value="RCS Cannes">Cannes</SelectItem>
                            <SelectItem value="RCS Grasse">Grasse</SelectItem>
                            <SelectItem value="RCS Nice">Nice</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>07 - Ardèche</SelectLabel>
                            <SelectItem value="RCS Aubenas">Aubenas</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>08 - Ardennes</SelectLabel>
                            <SelectItem value="RCS Sedan">Sedan</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>09 - Ariège</SelectLabel>
                            <SelectItem value="RCS Foix">Foix</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>10 - Aube</SelectLabel>
                            <SelectItem value="RCS Troyes">Troyes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>11 - Aude</SelectLabel>
                            <SelectItem value="RCS Carcassonne">Carcassonne</SelectItem>
                            <SelectItem value="RCS Narbonne">Narbonne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>12 - Aveyron</SelectLabel>
                            <SelectItem value="RCS Rodez">Rodez</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>13 - Bouches-du-Rhône</SelectLabel>
                            <SelectItem value="RCS Aix-en-Provence">Aix-en-Provence</SelectItem>
                            <SelectItem value="RCS Marseille">Marseille</SelectItem>
                            <SelectItem value="RCS Salon-de-Provence">Salon-de-Provence</SelectItem>
                            <SelectItem value="RCS Tarascon">Tarascon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>14 - Calvados</SelectLabel>
                            <SelectItem value="RCS Caen">Caen</SelectItem>
                            <SelectItem value="RCS Lisieux">Lisieux</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>15 - Cantal</SelectLabel>
                            <SelectItem value="RCS Aurillac">Aurillac</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>16 - Charente</SelectLabel>
                            <SelectItem value="RCS Angoulême">Angoulême</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>17 - Charente-Maritime</SelectLabel>
                            <SelectItem value="RCS La Rochelle">La Rochelle</SelectItem>
                            <SelectItem value="RCS Saintes">Saintes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>18 - Cher</SelectLabel>
                            <SelectItem value="RCS Bourges">Bourges</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>19 - Corrèze</SelectLabel>
                            <SelectItem value="RCS Brive-la-Gaillarde">Brive-la-Gaillarde</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>2A - Corse-du-Sud</SelectLabel>
                            <SelectItem value="RCS Ajaccio">Ajaccio</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>2B - Corse du Nord</SelectLabel>
                            <SelectItem value="RCS Bastia">Bastia</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>21 - Côte-d'Or</SelectLabel>
                            <SelectItem value="RCS Dijon">Dijon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>22 - Côtes-d'Armor</SelectLabel>
                            <SelectItem value="RCS Saint-Brieuc">Saint-Brieuc</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>23 - Creuse</SelectLabel>
                            <SelectItem value="RCS Guéret">Guéret</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>24 - Dordogne</SelectLabel>
                            <SelectItem value="RCS Bergerac">Bergerac</SelectItem>
                            <SelectItem value="RCS Périgueux">Périgueux</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>25 - Doubs</SelectLabel>
                            <SelectItem value="RCS Besançon">Besançon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>26 - Drôme</SelectLabel>
                            <SelectItem value="RCS Romans-sur-Isère">Romans-sur-Isère</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>27 - Eure</SelectLabel>
                            <SelectItem value="RCS Evreux">Evreux</SelectItem>
                            <SelectItem value="RCS Bernay">Bernay</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>28 - Eure-et-Loir</SelectLabel>
                            <SelectItem value="RCS Chartres">Chartres</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>29 - Finistère</SelectLabel>
                            <SelectItem value="RCS Brest">Brest</SelectItem>
                            <SelectItem value="RCS Quimper">Quimper</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>30 - Gard</SelectLabel>
                            <SelectItem value="RCS Nîmes">Nîmes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>31 - Haute Garonne</SelectLabel>
                            <SelectItem value="RCS Toulouse">Toulouse</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>32 - Gers</SelectLabel>
                            <SelectItem value="RCS Auch">Auch</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>33 - Gironde</SelectLabel>
                            <SelectItem value="RCS Bordeaux">Bordeaux</SelectItem>
                            <SelectItem value="RCS Libourne">Libourne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>34 - Hérault</SelectLabel>
                            <SelectItem value="RCS Béziers">Béziers</SelectItem>
                            <SelectItem value="RCS Montpellier">Montpellier</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>35 - Ille-et-Vilaine</SelectLabel>
                            <SelectItem value="RCS Rennes">Rennes</SelectItem>
                            <SelectItem value="RCS Saint-Malo">Saint-Malo</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>36 - Indre</SelectLabel>
                            <SelectItem value="RCS Châteauroux">Châteauroux</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>37 - Indre-et-Loire</SelectLabel>
                            <SelectItem value="RCS Tours">Tours</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>38 - Isère</SelectLabel>
                            <SelectItem value="RCS Grenoble">Grenoble</SelectItem>
                            <SelectItem value="RCS Vienne">Vienne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>39 - Jura</SelectLabel>
                            <SelectItem value="RCS Lons-le-Saunier">Lons-le-Saunier</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>40 - Landes</SelectLabel>
                            <SelectItem value="RCS Dax">Dax</SelectItem>
                            <SelectItem value="RCS Mont-de-Marsan">Mont-de-Marsan</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>41 - Loir-et-Cher</SelectLabel>
                            <SelectItem value="RCS Blois">Blois</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>42 - Loire</SelectLabel>
                            <SelectItem value="RCS Roanne">Roanne</SelectItem>
                            <SelectItem value="RCS Saint-Etienne">Saint-Etienne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>43 - Haute-Loire</SelectLabel>
                            <SelectItem value="RCS Le Puy-en-Velay">Le Puy-en-Velay</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>44 - Loire-Atlantique</SelectLabel>
                            <SelectItem value="RCS Nantes">Nantes</SelectItem>
                            <SelectItem value="RCS Saint-Nazaire">Saint-Nazaire</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>45 - Loiret</SelectLabel>
                            <SelectItem value="RCS Orléans">Orléans</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>46 - Lot</SelectLabel>
                            <SelectItem value="RCS Cahors">Cahors</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>47 - Lot-et-Garonne</SelectLabel>
                            <SelectItem value="RCS Agen">Agen</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>48 - Lozère</SelectLabel>
                            <SelectItem value="RCS Mende">Mende</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>49 - Maine-et-Loire</SelectLabel>
                            <SelectItem value="RCS Angers">Angers</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>50 - Manche</SelectLabel>
                            <SelectItem value="RCS Cherbourg-Octeville">Cherbourg-Octeville</SelectItem>
                            <SelectItem value="RCS Coutances">Coutances</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>51 - Marne</SelectLabel>
                            <SelectItem value="RCS Châlons-en-Champagne">Châlons-en-Champagne</SelectItem>
                            <SelectItem value="RCS Reims">Reims</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>52 - Haute-Marne</SelectLabel>
                            <SelectItem value="RCS Chaumont">Chaumont</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>53 - Mayenne</SelectLabel>
                            <SelectItem value="RCS Laval">Laval</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>54 - Meurthe-et-Moselle</SelectLabel>
                            <SelectItem value="RCS Nancy">Nancy</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>55 - Meuse</SelectLabel>
                            <SelectItem value="RCS Bar-le-Duc">Bar-le-Duc</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>56 - Morbihan</SelectLabel>
                            <SelectItem value="RCS Lorient">Lorient</SelectItem>
                            <SelectItem value="RCS Vannes">Vannes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>57 - Moselle</SelectLabel>
                            <SelectItem value="RCS Metz">Metz</SelectItem>
                            <SelectItem value="RCS Sarreguemines">Sarreguemines</SelectItem>
                            <SelectItem value="RCS Thionville">Thionville</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>58 - Nièvre</SelectLabel>
                            <SelectItem value="RCS Nevers">Nevers</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>59 - Nord</SelectLabel>
                            <SelectItem value="RCS Douai">Douai</SelectItem>
                            <SelectItem value="RCS Dunkerque">Dunkerque</SelectItem>
                            <SelectItem value="RCS Lille">Lille Métropole</SelectItem>
                            <SelectItem value="RCS Valenciennes">Valenciennes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>60 - Oise</SelectLabel>
                            <SelectItem value="RCS Beauvais">Beauvais</SelectItem>
                            <SelectItem value="RCS Compiègne">Compiègne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>61 - Orne</SelectLabel>
                            <SelectItem value="RCS Alençon">Alençon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>62 - Pas-de-Calais</SelectLabel>
                            <SelectItem value="RCS Arras">Arras</SelectItem>
                            <SelectItem value="RCS Boulogne-sur-Mer">Boulogne-sur-Mer</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>63 - Puy-de-Dôme</SelectLabel>
                            <SelectItem value="RCS Clermont-Ferrand">Clermont-Ferrand</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>64 - Pyrénées-Atlantiques</SelectLabel>
                            <SelectItem value="RCS Bayonne">Bayonne</SelectItem>
                            <SelectItem value="RCS Pau">Pau</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>65 - Hautes-Pyrénées</SelectLabel>
                            <SelectItem value="RCS Tarbes">Tarbes</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>66 - Pyrénées-Orientales</SelectLabel>
                            <SelectItem value="RCS Perpignan">Perpignan</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>67 - Bas-Rhin</SelectLabel>
                            <SelectItem value="RCS Saverne">Saverne</SelectItem>
                            <SelectItem value="RCS Strasbourg">Strasbourg</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>68 - Haut-Rhin</SelectLabel>
                            <SelectItem value="RCS Colmar">Colmar</SelectItem>
                            <SelectItem value="RCS Mulhouse">Mulhouse</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>69 - Rhône</SelectLabel>
                            <SelectItem value="RCS Lyon">Lyon</SelectItem>
                            <SelectItem value="RCS Villefranche-Tarare">Villefranche-Tarare</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>70 - Haute-Saône</SelectLabel>
                            <SelectItem value="RCS Vesoul">Vesoul</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>71 - Saône-et-Loire</SelectLabel>
                            <SelectItem value="RCS Chalon-sur-Saône">Chalon-sur-Saône</SelectItem>
                            <SelectItem value="RCS Mâcon">Mâcon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>72 - Sarthe</SelectLabel>
                            <SelectItem value="RCS Le Mans">Le Mans</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>73 - Savoie</SelectLabel>
                            <SelectItem value="RCS Chambéry">Chambéry</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>74 - Haute-Savoie</SelectLabel>
                            <SelectItem value="RCS Annecy">Annecy</SelectItem>
                            <SelectItem value="RCS Thonon-les-Bains">Thonon-les-Bains</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>75 - Paris</SelectLabel>
                            <SelectItem value="RCS Paris">Paris</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>76 - Seine-Maritime</SelectLabel>
                            <SelectItem value="RCS Dieppe">Dieppe</SelectItem>
                            <SelectItem value="RCS Le Havre">Le Havre</SelectItem>
                            <SelectItem value="RCS Rouen">Rouen</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>77 - Seine-et-Marne</SelectLabel>
                            <SelectItem value="RCS Meaux">Meaux</SelectItem>
                            <SelectItem value="RCS Melun">Melun</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>78 - Yvelines</SelectLabel>
                            <SelectItem value="RCS Versailles">Versailles</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>79 - Deux-Sèvres</SelectLabel>
                            <SelectItem value="RCS Niort">Niort</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>80 - Somme</SelectLabel>
                            <SelectItem value="RCS Amiens">Amiens</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>81 - Tarn</SelectLabel>
                            <SelectItem value="RCS Albi">Albi</SelectItem>
                            <SelectItem value="RCS Castres">Castres</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>82 - Tarn-et-Garonne</SelectLabel>
                            <SelectItem value="RCS Montauban">Montauban</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>83 - Var</SelectLabel>
                            <SelectItem value="RCS Draguignan">Draguignan</SelectItem>
                            <SelectItem value="RCS Fréjus">Fréjus</SelectItem>
                            <SelectItem value="RCS Toulon">Toulon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>84 - Vaucluse</SelectLabel>
                            <SelectItem value="RCS Avignon">Avignon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>85 - Vendée</SelectLabel>
                            <SelectItem value="RCS La Roche-sur-Yon">La Roche-sur-Yon</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>86 - Vienne</SelectLabel>
                            <SelectItem value="RCS Poitiers">Poitiers</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>87 - Haute-Vienne</SelectLabel>
                            <SelectItem value="RCS Limoges">Limoges</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>88 - Vosges</SelectLabel>
                            <SelectItem value="RCS Epinal">Epinal</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>89 - Yonne</SelectLabel>
                            <SelectItem value="RCS Auxerre">Auxerre</SelectItem>
                            <SelectItem value="RCS Sens">Sens</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>90 - Territoire-de-Belfort</SelectLabel>
                            <SelectItem value="RCS Belfort">Belfort</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>91 - Essonne</SelectLabel>
                            <SelectItem value="RCS Evry">Evry</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>92 - Hauts-de-Seine</SelectLabel>
                            <SelectItem value="RCS Nanterre">Nanterre</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>93 - Seine-Saint-Denis</SelectLabel>
                            <SelectItem value="RCS Bobigny">Bobigny</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>94 - Val-de-Marne</SelectLabel>
                            <SelectItem value="RCS Créteil">Créteil</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>95 - Val-d'Oise</SelectLabel>
                            <SelectItem value="RCS Pontoise">Pontoise</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>971 - Guadeloupe</SelectLabel>
                            <SelectItem value="RCS Pointe à Pitre">Pointe à Pitre</SelectItem>
                            <SelectItem value="RCS Basse Terre">Basse Terre</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>972 - Martinique</SelectLabel>
                            <SelectItem value="RCS Fort de France">Fort de France</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>973 - Guyanne</SelectLabel>
                            <SelectItem value="RCS Cayenne">Cayenne</SelectItem>
                            </SelectGroup>
                            <SelectGroup>
                            <SelectLabel>974 - Réunion</SelectLabel>
                            <SelectItem value="RCS Saint Denis">Saint Denis</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                {c1 && (
                    <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="nondeduc">
                        Dépenses et charges non déductibles des bénéfices soumis à l'impôt sur les sociétés
                    </Label>
                    <Input
                        className="border border-gray-300"
                        defaultValue={ago?.nondeduc || 0}
                        type="number"
                        id="nondeduc"
                        name="nondeduc"
                        min="0"
                        placeholder="ex : 123456789"
                    />
                    </div>
                )}
                {c5 && (
                    <div className="gap-y-2 flex flex-col">
                        
                        <Label htmlFor="convreg">
                        Conventions réglementées
                        </Label>
                        <div className="text-sm flex items-center gap-2">
                        <Input type="checkbox" defaultValue={ago.convreg} id="convreg" name="convreg" className="w-6 cursor-pointer"/>
                <p>Cochez si vous avez des conventions réglementées conclues entre les associés et la société au cours de l’exercice écoulé</p>
                    </div>
                    </div>
                )}
                {c3 && (
                <div className="gap-y-2 flex space-x-5">
                <div className="gap-y-2 flex flex-col w-full border-2 border-green-700 p-4">
                <Label className="text-green-700 text-xl font-bold underline underline-offset-2">Approbation de la rémunération allouée aux Gérants :</Label>
                    {participants
                        .filter(participant => participant.gerant)
                        .map((participant, index) => (
                            <div className="gap-y-2 flex items-center space-x-5 p-2">
                                <div className=" flex items-center  w-1/3">
                                  <p key={index}>{participant.sexe} {participant.lastName} {participant.firstName}</p>  
                                </div>
                            <div className="gap-y-2 flex flex-col">
                            <Label htmlFor={`remuneration-${index}`}>Rémunération brute</Label>
                            <Input
                            type="number"
                            id={`remuneration-${index}`}
                            name={`remuneration-${index}`}
                            value={participant.remuneration}
                            onChange={(e) => handleParticipantChange(index, "remuneration", e.target.value)}
                            min="0"
                            placeholder="ex : 10000"
                            required
                            />
                            </div>
                            </div>
                            
                        ))}
                </div>
                </div>
                )}
                {c6 && (
                <div className="gap-y-2 flex space-x-5">
                <div className="gap-y-2 flex flex-col w-full border-2 border-gray-700 p-4">
                <Label className="text-gray-700 text-xl font-bold underline underline-offset-2">Fixation de la rémunération aux Gérants :</Label>
                <Label htmlFor="acompter">Date de mise en application</Label>
                <Input className="border border-gray-300" defaultValue={ago.acompter} type="date" id="acompter" name="acompter" required/>
                    {participants
                        .filter(participant => participant.gerant)
                        .map((participant, index) => (
                            <div className="gap-y-2 flex items-center space-x-5">
                                <div className=" flex items-center  w-1/3">
                                    <p key={index}>{participant.sexe} {participant.lastName} {participant.firstName}</p>
                                </div>
                            <div className="gap-y-2 flex flex-col">
                            <Label htmlFor={`remunerationFuture-${index}`}>Rémunération fixée</Label>
                            <Input
                            type="number"
                            id={`remunerationFuture-${index}`}
                            name={`remunerationFuture-${index}`}
                            value={participant.remunerationFuture}
                            onChange={(e) => handleParticipantChange(index, "remunerationFuture", e.target.value)}
                            min="0"
                            placeholder="ex : 10000"
                            required
                            />
                            </div>
                            </div>
                            
                        ))}
                </div>
                </div>
                )}
                
                {c2 && (
                <div>
                    <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/2">
                        <Label htmlFor="benef">Résultat Bénéficiaire</Label>
                        <Input 
                        type="number" 
                        className="border border-gray-300"
                        id="benef" 
                        name="benef" 
                        defaultValue={ago.benef}
                        min="0" 
                        step="0.01" 
                        placeholder="ex : 20000"
                        onChange={handleBeneficiaireChange}
                        disabled={deficitaire !== ''}
                        />
                    </div>
                    <p className="pt-7 font-semibold text-lg">ou</p>
                    <div className="gap-y-2 flex flex-col w-1/2">
                        <Label htmlFor="deficite">Résultat Déficitaire</Label>
                        <Input 
                        className="border border-gray-300"
                        type="number" 
                        id="deficite" 
                        name="deficite" 
                        defaultValue={ago.deficite}
                        min="0" 
                        step="0.01" 
                        placeholder="ex : 20000"
                        onChange={handleDeficitaireChange}
                        disabled={beneficiaire !== ''}
                        />
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col mt-6">
                <Label htmlFor="affect">Affectation du résultat</Label>
                <table className="border-collapse border border-black">
                    <tbody>
                    <tr>
                        <th colSpan={2} rowSpan={4} className="border border-black p-2">Origine</th>
                        <th colSpan={2} className="border border-black p-2">Destination</th>
                    </tr>
                    <tr>
                        <td className="border border-black p-2">Réserve légale</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a12} id="a12" name="a12" className="w-full" placeholder="0 €" disabled={deficitaire !== ''}/></td>
                    </tr>
                    <tr>
                        
                        <td className="border border-black p-2">Report à nouveau créditeur</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a22} id="a22" name="a22" className="w-full" placeholder="0 €" disabled={deficitaire !== ''}/></td>
                    </tr>
                    <tr>
                        
                        <td className="border border-black p-2">Distribution de dividendes</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a32} id="a32" name="a32" className="w-full" placeholder="0 €"/></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-2">Résultat de l'exercice</td>
                    <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" id="a11" value={beneficiaire ? beneficiaire : deficitaire ? -deficitaire : ''} name="a11" className="w-full" placeholder="0 €" disabled/></td>
                        <td className="border border-black p-2">Report à nouveau débiteur</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a42} id="a42" name="a42" className="w-full" placeholder="0 €" disabled={beneficiaire !== ''}/></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-2">Report à nouveau débiteur</td>
                    <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a21} id="a21" name="a21" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">Autres réserves</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a52} id="a52" name="a52" className="w-full" placeholder="0 €" disabled={deficitaire !== ''}/></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-2">Report à nouveau créditeur</td>
                    <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a31} id="a31" name="a31" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">En diminution de "Report à nouveau débiteur"</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a62} id="a62" name="a62" className="w-full" placeholder="0 €" disabled={deficitaire !== ''}/></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-2">Réserve légale antérieure</td>
                    <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a41} id="a41" name="a41" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">En diminution de "Report à nouveau créditeur"</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a72} id="a72" name="a72" className="w-full" placeholder="0 €" disabled={beneficiaire !== ''}/></td>
                    </tr>
                    <tr>
                    <td className="border border-black p-2">Autres réserves antérieures</td>
                    <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a51} id="a51" name="a51" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">En diminution de "Autres réserves"</td>
                        <td className="border border-black p-2"><Input type='number' onWheel={(e) => (e.target as HTMLInputElement).blur()} min="0" defaultValue={ago.a82} id="a82" name="a82" className="w-full" placeholder="0 €" disabled={beneficiaire !== ''}/></td>
                    </tr>
                    </tbody>
                </table>
                {beneficiaire !== '' && (
                <div>
                <p>1 - Doter la réserve légale au minimum à hauteur de 5% du bénéfice et dans la limite de 10% du capital social</p>
                <p>2 - Si report à nouveau débiteur antérieur, alors l'apurer en totalité ou en partie si le résultat ne permet pas de couvrir la totalité</p>
                <p>3 - Décider ou non de la mise en distribution de dividendes</p>
                <p>4 - Mettre le solde en report à nouveau créditeur ou en Autres réserves</p>
                </div>
                )}
                {deficitaire !== '' && (
                <div>
                <p>1 - Si report à nouveau créditeur antérieur alors apurer en totalité ou en partie le déficit si le report ne permet pas de couvrir la totalité</p>
                <p>2 - Si réserve antérieur alors apurer en totalité ou en partie le déficit si la réserve ne permet pas de couvrir la totalité</p>
                <p>3 - mettre le solde en report à nouveau débiteur</p>
                <p>4 - Possibilité de distribution de dividendes s'il reste de l'argent en réserve après l'apuration de la totalité du déficit</p>
                </div>
                )}
                </div>
                <div className="flex flex-col mt-4">
                <Label htmlFor="3exercices">Les 3 derniers exercices</Label>
                <div className="text-sm flex items-center gap-2">
                <Input type="checkbox" id="completed" defaultChecked={ago.completed} name="completed" className="w-6 cursor-pointer" onChange={handleCheckboxChange}/>
                <p>Cochez si vous avez des dividendes distribués sur les 3 derniers exercices</p>
                </div>
                {hideTable && (
                    <table className="border-collapse border border-black">
                        <tbody>
                        <tr>
                            <th rowSpan={2} className="border border-black p-2">Exercice clos le</th>
                            <th colSpan={2} className="border border-black p-2">Revenus éligibles à<br/> l'abattement</th>
                            <th rowSpan={2} className="border border-black p-2">Revenus non<br/> éligibles à<br/> l'abattement</th>
                        </tr>
                        <tr>
                            <th className="border border-black p-2">Dividendes</th>
                            <th className="border border-black p-2">Autres revenus<br/> distribués</th>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-1 : <Input defaultValue={ago.n1Date} type="date" id="n1Date" name="n1Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input defaultValue={ago.n1DateAGO} type="date" id="n1DateAGO" name="n1DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant11} type='number' min="0" id="montant11" name="montant11" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant12} type='number' min="0" id="montant12" name="montant12" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant13} type='number' min="0" id="montant13" name="montant13" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-2 : <Input defaultValue={ago.n2Date} type="date" id="n2Date" name="n2Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input defaultValue={ago.n2DateAGO} type="date" id="n2DateAGO" name="n2DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant21} type='number' min="0" id="montant21" name="montant21" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant22} type='number' min="0" id="montant22" name="montant22" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant23} type='number' min="0" id="montant23" name="montant23" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-3 : <Input defaultValue={ago.n3Date} type="date" id="n3Date" name="n3Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input defaultValue={ago.n3DateAGO} type="date" id="n3DateAGO" name="n3DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant31} type='number' min="0" id="montant31" name="montant31" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant32} type='number' min="0" id="montant32" name="montant32" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input defaultValue={ago.montant33} type='number' min="0" id="montant33" name="montant33" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        </tbody>
                        </table>
                    )}
                </div>
                </div>
                )}

                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Link href="/dashboard">
                        <Button type="button" className="bg-red-500 hover:bg-red-600 text-white">
                            Annuler
                        </Button>
                    </Link>
                    <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Mettre à jour
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
