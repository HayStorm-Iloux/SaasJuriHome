"use client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { createAGO } from "@/lib/actionsAGO"
import { prisma } from "@/lib/db"
import { redirect, useRouter } from "next/navigation"
import { getSub, getUser } from "@/lib/actionsUsers"
import CheckboxItem from "@/app/components/ordreJour";
import Tooltip from "@/app/components/Tooltip";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChangeEvent, use, useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch"
import { HelpCircle } from "lucide-react";
interface Participant {
    gerant: boolean;
    sexe: string;
    firstName: string;
    lastName: string;
    shares: string;
    remuneration: string;
    remunerationFuture: string;
  }
  
  
export default function CreatePage() {

    const checkboxItems = [
        { name: "approbationCompte", label: "Approbation des comptes de l'exercice clos et quitus à la gérance" },
        { name: "affectation", label: "Affectation du résultat de l'exercice" },
        { name: "approbationBoss", label: "Approbation de la rémunération allouée aux Gérants" },
        { name: "pouvoir", label: "Pouvoirs pour l'accomplissement des formalités" },
        { name: "lecture", label: "Lecture du rapport spécial sur les conventions visées à l'article L. 223-19 du Code de commerce, et décision à cet égard" },
        { name: "fixation", label: "Fixation de la rémunération aux Gérants" },
        { name: "distribution", label: "Distribution de dividende" },
        { name: "absence", label: "Absence de rémunération du dirigeant" },
    ];

    const router = useRouter();

    const [hideTable, setHideTable] = useState(false);
    const [beneficiaire, setBeneficiaire] = useState<string>('');
    const [deficitaire, setDeficitaire] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([
        { gerant: false, sexe: "", firstName: "", lastName: "", shares: "", remuneration: "", remunerationFuture: "" },
    ]);

    //Constantes pour la vérification des parts
    const [totalShares, setTotalShares] = useState<string>('');
    const [totalParticipantShares, setTotalParticipantShares] = useState(0);
    const [isValid, setIsValid] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [warningMessage, setWarningMessage] = useState<string>('');

    const [isApprobationCompteChecked, setIsApprobationCompteChecked] = useState(false);
    const [hasCommissaire, setHasCommissaire] = useState(false);
    const [isApprobationBossChecked, setIsApprobationBossChecked] = useState(false);
    const [isFixationChecked, setIsFixationChecked] = useState(false);


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

    useEffect(() => {
    const newTotalShares = participants.reduce((sum, participant) => sum + (parseInt(participant.shares) || 0), 0);
    setTotalParticipantShares(newTotalShares);
  }, [participants]);

    useEffect(() => {
        validateShares();
    }, [totalShares, participants]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHideTable(event.target.checked);
    };

    const handleBeneficiaireChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBeneficiaire(value);
        if (value !== '') {
        setDeficitaire('');
        }
    };

    const handleDeficitaireChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDeficitaire(value);
        if (value !== '') {
        setBeneficiaire('');
        }
    };

    const handleAddParticipant = () => {
        setParticipants([...participants, { gerant: false, sexe: "", firstName: "", lastName: "", shares: "", remuneration: "", remunerationFuture: "" }]);
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

    //fonctions pour la vérification des parts
    const handleTotalSharesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTotalShares(e.target.value);
    };

    const validateShares = () => {
        const totalSharesNum = parseInt(totalShares) || 0;
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
    };

  return (
    <Card>
        <form action={createAGO}>
            <CardHeader>
                <CardTitle>Nouvelle Note</CardTitle>
                <CardDescription>Quelques mot pour ne pas oublier</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-y-5 ">
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="societeName">Dénomination sociale</Label>
                    <Input type="text" id="societeName" name="societeName" placeholder="ex : OpenAI"required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="societeType">Type de société</Label>
                    <Select name="societeType" required>
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
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="capitalAmount">Montant du capital (en euros)</Label>
                    <Input type="number" id="capitalAmount" name="capitalAmount" min="0" placeholder="ex : 40000" required/>
                </div>
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/3">
                    <div className="flex items-center gap-2">
                            <Label htmlFor="adresse">Adresse du siège social figurant sur le kbis</Label>
                            <Tooltip text="L'adresse qui est sur le Kbis d'une société c'est l'adresse de son siège sociale c'est-à-dire que c'est l'adresse fiscale ou encore l'adresse de domiciliation">
                                <HelpCircle className="w-4 h-4 cursor-help" />
                            </Tooltip>
                        </div>
                        <Input type="text" id="adresse" name="adresse" placeholder="ex : 47 Rue de l'Hôpital Militaire" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="postal">Code Postal</Label>
                        <Input type="number" id="postal" name="postal" min="0" max="99999" placeholder="ex : 59000" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="ville">Ville</Label>
                        <Input type="text" id="ville" name="ville" placeholder="ex : Lille" required/>
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                <div className="flex items-center gap-2">
                        <Label htmlFor="siret">Numéro de SIREN</Label>
                        <Tooltip text="Les numéros de SIREN sont les 9 premiers chiffres du numéro de SIRET de votre entreprise (sans les 5 chiffres du NIC)">
                            <HelpCircle className="w-4 h-4 cursor-help" />
                        </Tooltip>
                   </div>
                    <Input type="number" id="siret" name="siret" min="0" pattern="[0-9]{9}" placeholder="ex : 123456789" required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="rcs">RCS</Label>
                    <Select name="rcs" required>
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
                    id="partsNumber" 
                    name="partsNumber" 
                    min="0" 
                    placeholder="ex : 500" 
                    required
                    value={totalShares}
                    onChange={handleTotalSharesChange}
                    />
                </div>
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="meetingDate">Date de l'assemblée</Label>
                            <Input type="date" id="meetingDate" name="meetingDate"required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="meetingTime">Heure de l'assemblée</Label>
                            <Input type="time" id="meetingTime" name="meetingTime"required/>
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                    {participants.map((participant, index) => (
                    <div key={index} className="flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label className="text-center" htmlFor={`gerant-${index}`}>Est-il gérant ?</Label>
                        <Input
                            type="checkbox"
                            id={`gerant-${index}`}
                            name={`gerant-${index}`}
                            onChange={(e) => handleParticipantChange(index, "gerant", e.target.checked)}
                            required
                        />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor={`sexe-${index}`}>Sexe</Label>
                        <Select
                            name={`sexe-${index}`}
                            value={participant.sexe}
                            onValueChange={(value) => handleParticipantChange(index, "sexe", value as string)}
                            required
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="ex : Monsieur" />
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
                        <Label htmlFor={`firstName-${index}`}>Prénom</Label>
                        <Input
                            type="text"
                            id={`firstName-${index}`}
                            name={`firstName-${index}`}
                            value={participant.firstName}
                            onChange={(e) => handleParticipantChange(index, "firstName", e.target.value)}
                            placeholder="ex : Jean"
                            required
                        />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor={`lastName-${index}`}>Nom</Label>
                        <Input
                            type="text"
                            id={`lastName-${index}`}
                            name={`lastName-${index}`}
                            value={participant.lastName}
                            onChange={(e) => handleParticipantChange(index, "lastName", e.target.value)}
                            placeholder="ex : Dupont"
                            required
                        />
                        </div>
                        
                        <div className="gap-y-2 flex flex-col w-1/4">
                            <Label htmlFor={`shares-${index}`}>Nombre de parts</Label>
                            <Input
                            type="number"
                            id={`shares-${index}`}
                            name={`shares-${index}`}
                            value={participant.shares}
                            onChange={(e) => handleParticipantChange(index, "shares", e.target.value)}
                            min="0"
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
                        <Button type="button" className="bg-green-500 hover:bg-green-600 text-white w-[180px]" onClick={handleAddParticipant}>
                        Ajouter un participant
                        </Button>
                    </div>
                </div>
                <input type="hidden" name="participants" value={JSON.stringify(participants)} />
                <div className="flex flex-col">
                    <Label htmlFor="ordreDuJour">Ordre du Jour</Label>
                    <div>
                        {checkboxItems.map((item, index) => (
                        <CheckboxItem 
                            key={index}
                            name={item.name}
                            label={item.label}
                            totalShares={totalParticipantShares}
                            onCheckChange={(name, checked) => {
                            if (name === 'approbationCompte') {
                                setIsApprobationCompteChecked(checked);
                            }
                            if (name === 'approbationBoss') {
                                setIsApprobationBossChecked(checked);
                            }
                            if (name === 'fixation') {
                                setIsFixationChecked(checked);
                            }
                            }}
                        />
                        ))}
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="exerciceDate">Date de cloture de l'exercice social</Label>
                    <Input type="date" id="exerciceDate" name="exerciceDate" required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <div className="flex items-center space-x-2">
                        <Input className="w-5" type="checkbox" id="commissaire"
                            name="commissaire" 
                            onChange={(e) => setHasCommissaire(e.target.checked)}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Avez-vous un commissaire aux comptes
                        </label>
                    </div>
                </div>
                {hasCommissaire && (
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor="sexeCommissaire">Informations commissaire aux comptes</Label>
                        <Select name="sexeCommissaire" required>
                            <SelectTrigger>
                                <SelectValue placeholder="ex : Monsieur" />
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
                            placeholder="ex : Jean"
                            required
                        />
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/4">
                        <Label htmlFor="nomCommissaire">Nom</Label>
                        <Input
                            type="text"
                            id="nomCommissaire"
                            name="nomCommissaire"
                            placeholder="ex : Dupont"
                            required
                        />
                    </div>
                    <div className="gap-y-2 flex flex-col items-center justify-center w-1/4">
                        <Label htmlFor="presenceCommissaire">Présent à l'assemblée</Label>
                        <Switch name="presenceCommissaire"/>
                    </div>
                </div>
            )}
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="adressePerso">Adresse Personnelle</Label>
                        <Input type="text" id="adressePerso" name="adressePerso" placeholder="ex : 47 Rue de l'Hôpital Militaire" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="postalPerso">Code Postal</Label>
                        <Input type="number" id="postalPerso" name="postalPerso" min="0" max="99999" placeholder="ex : 59000" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="villePerso">Ville</Label>
                        <Input type="text" id="villePerso" name="villePerso" placeholder="ex : Lille" required/>
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
                        >
                            <SelectTrigger>
                            <SelectValue placeholder="ex : Monsieur" />
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
                    <Input type="text" id="societeNameComptable" name="societeNameComptable" placeholder="ex : OpenAI"required/>
                </div>
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="adresseComptable">Adresse du cabinet</Label>
                        <Input type="text" id="adresseComptable" name="adresseComptable" placeholder="ex : 47 Rue de l'Hôpital Militaire" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="postalComptable">Code Postal</Label>
                        <Input type="number" id="postalComptable" name="postalComptable" min="0" max="99999" placeholder="ex : 59000" required/>
                    </div>
                    <div className="gap-y-2 flex flex-col w-1/3">
                        <Label htmlFor="villeComptable">Ville</Label>
                        <Input type="text" id="villeComptable" name="villeComptable" placeholder="ex : Lille" required/>
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="siretComptable">Numéro de SIREN du cabinet</Label>
                    <Input type="number" id="siretComptable" name="siretComptable" min="0" pattern="[0-9]{9}" placeholder="ex : 123456789" required/>
                </div>
                <div className="gap-y-2 flex flex-col">
                    <Label htmlFor="rcsComptable">RCS du cabinet</Label>
                    <Select name="rcsComptable" required>
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
                {isApprobationCompteChecked && (
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="nondeduc">
                        Dépenses et charges non déductibles des bénéfices soumis à l'impôt sur les sociétés
                        </Label>
                        <Input 
                        type="number" 
                        id="nondeduc" 
                        name="nondeduc" 
                        min="0" 
                        placeholder="ex : 123456789"
                        />
                    </div>
                )}
                {isApprobationBossChecked && (
                <div className="gap-y-2 flex space-x-5">
                <div className="gap-y-2 flex flex-col w-1/2">
                <Label>Approbation de la rémunération allouée aux Gérants</Label>
                    {participants
                        .filter(participant => participant.gerant)
                        .map((participant, index) => (
                            <div className="gap-y-2 flex items-center space-x-5">
                            <p key={index}>{participant.sexe} {participant.lastName} {participant.firstName}</p>
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
                {isFixationChecked && (
                <div className="gap-y-2 flex space-x-5">
                <div className="gap-y-2 flex flex-col w-1/2">
                <Label>Fixation de la rémunération aux Gérants</Label>
                    {participants
                        .filter(participant => participant.gerant)
                        .map((participant, index) => (
                            <div className="gap-y-2 flex items-center space-x-5">
                            <p key={index}>{participant.sexe} {participant.lastName} {participant.firstName}</p>
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
                <div className="gap-y-2 flex space-x-5">
                    <div className="gap-y-2 flex flex-col w-1/2">
                        <Label htmlFor="benef">Résultat Bénéficiaire</Label>
                        <Input 
                        type="number" 
                        id="benef" 
                        name="benef" 
                        min="0" 
                        step="0.01" 
                        placeholder="ex : 20000"
                        value={beneficiaire}
                        onChange={handleBeneficiaireChange}
                        disabled={deficitaire !== ''}
                        />
                    </div>
                    <p className="pt-7">ou</p>
                    <div className="gap-y-2 flex flex-col w-1/2">
                        <Label htmlFor="deficite">Résultat Déficitaire</Label>
                        <Input 
                        type="number" 
                        id="deficite" 
                        name="deficite" 
                        min="0" 
                        step="0.01" 
                        placeholder="ex : 20000"
                        value={deficitaire}
                        onChange={handleDeficitaireChange}
                        disabled={beneficiaire !== ''}
                        />
                    </div>
                </div>
                <div className="gap-y-2 flex flex-col">
                <Label htmlFor="affect">Affectation du résultat</Label>
                <table className="border-collapse border border-black">
                    <tbody>
                    <tr>
                        <th colSpan={2} className="border border-black p-2">Origine</th>
                        <th colSpan={2} className="border border-black p-2">Destination</th>
                    </tr>
                    <tr>
                        <td className="border border-black p-2">Report à nouveau</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">Réserve légale</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2">Réserve légale antérieure</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">Report à nouveau créditeur</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2">Autres réserves antérieures</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">Distribution de dividendes</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                    </tr>
                    <tr>
                        <td className="border border-black p-2">Résultat de l'exercice</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                        <td className="border border-black p-2">Report à nouveau créditeur</td>
                        <td className="border border-black p-2"><Input type='number' min="0" className="w-full" placeholder="0 €"/></td>
                    </tr>
                    </tbody>
                </table>
                </div>
                <div className="flex flex-col gap-y-2">
                <Label htmlFor="3exercices">Les 3 derniers exercices</Label>
                <div className="text-sm flex items-center gap-4">
                <Input type="checkbox" id="completed" name="completed" className="w-6 cursor-pointer" onChange={handleCheckboxChange}/>
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
                                N-1 : <Input type="date" id="n1Date" name="n1Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n1DateAGO" name="n1DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant11" name="montant11" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant12" name="montant12" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant13" name="montant13" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-2 : <Input type="date" id="n2Date" name="n2Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n2DateAGO" name="n2DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant21" name="montant21" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant22" name="montant22" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant23" name="montant23" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-3 : <Input type="date" id="n3Date" name="n3Date" className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n3DateAGO" name="n3DateAGO" className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant31" name="montant31" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant32" name="montant32" className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant33" name="montant33" className="w-full" placeholder="0 €"/></td>
                        </tr>
                        </tbody>
                        </table>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Button type="button" className="bg-red-500 hover:bg-red-600 text-white">
                    <Link href="/dashboard">Annuler</Link>
                </Button>
                <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">
                    Créer une AGO
                </Button>
            </CardFooter>
        </form>
    </Card>
  )
}