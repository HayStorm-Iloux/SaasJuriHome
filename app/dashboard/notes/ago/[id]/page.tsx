"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAGO, updateAGO } from "@/lib/actionsAGO";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Participant {
    sexe: string;
    firstName: string;
    lastName: string;
    shares: string;
}

interface UpdatePageProps {
    params: { id: string };
}

export default function UpdatePage({ params }: UpdatePageProps) {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [ago, setAgo] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const fetchedAgo = await getAGO(params.id);
            if (fetchedAgo) {
                setAgo(fetchedAgo);
                setParticipants(
                    fetchedAgo.participants.map((participant: any) => ({
                        sexe: participant.sexe ?? "",
                        firstName: participant.firstName ?? "",
                        lastName: participant.lastName ?? "",
                        shares: participant.shares ?? "",
                    }))
                );
            }
        };
        fetchData();
    }, [params.id]);

    const handleAddParticipant = () => {
        setParticipants([...participants, { sexe: "", firstName: "", lastName: "", shares: "" }]);
    };

    const handleRemoveParticipant = (index: number) => {
        setParticipants(participants.filter((_, i) => i !== index));
    };

    const handleParticipantChange = (index: number, field: keyof Participant, value: string | number) => {
        setParticipants(
            participants.map((participant, i) =>
                i === index ? { ...participant, [field]: value } : participant
            )
        );
    };

    if (!ago) return <div>Loading...</div>;

    return (
        <Card>
            <form action={updateAGO}>
                <Input type="hidden" name="id" value={ago.id} />
                <CardHeader>
                    <CardTitle>Modifier AGO</CardTitle>
                    <CardDescription>Quelques informations pour mettre à jour l'AGO</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-y-5 ">
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="societeName">Nom de la société</Label>
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
                                    <SelectItem value="Entreprise Individuelle (EI)">EI - Entreprise Individuelle</SelectItem>
                                    <SelectItem value="Auto-Entreprise (Micro-Entreprise)">Micro-Entreprise - Auto-Entreprise</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="capitalAmount">Montant du capital (en euros)</Label>
                        <Input type="number" id="capitalAmount" name="capitalAmount" defaultValue={ago.capitalAmount} required />
                    </div>
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="adresse">Adresse</Label>
                            <Input type="text" id="adresse" name="adresse" defaultValue={ago.adresse} required />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="postal">Code Postal</Label>
                            <Input type="number" id="postal" name="postal" defaultValue={ago.postal} required />
                        </div>
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="ville">Ville</Label>
                            <Input type="text" id="ville" name="ville" defaultValue={ago.ville} required />
                        </div>
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="siret">Numéro de SIRET</Label>
                        <Input type="number" id="siret" name="siret" defaultValue={ago.siret} required />
                    </div>
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="rcs">RCS</Label>
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
                    <div className="gap-y-2 flex flex-col">
                        {participants.map((participant, index) => (
                            <div key={index} className="flex space-x-5">
                                <div className="w-2/12 flex items-center justify-center pt-5">
                                    {index === 0 ? (
                                        <Label htmlFor="president">Président :</Label>
                                    ) : (
                                        <Label htmlFor="participant">Participant {index} :</Label>
                                    )}
                                </div>
                                <div className="gap-y-2 flex flex-col w-1/4">
                                    <Label htmlFor={`sexe-${index}`}>Sexe</Label>
                                    <Select
                                        name={`sexe-${index}`}
                                        value={participant.sexe}
                                        onValueChange={(value) => handleParticipantChange(index, "sexe", value)}
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
                                        placeholder="ex : 50"
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
                        <div className="flex justify-center pt-5">
                            <Button type="button" variant="outline" className="bg-green-500 hover:bg-green-600 text-white w-[180px]" onClick={handleAddParticipant}>
                                Ajouter un participant
                            </Button>
                        </div>
                    </div>
                    <input type="hidden" name="participants" value={JSON.stringify(participants)} />
                    <div className="gap-y-2 flex flex-col">
                        <Label htmlFor="exerciceDate">Date de cloture de l'exercice social</Label>
                        <Input type="date" id="exerciceDate" defaultValue={ago.exerciceDate} name="exerciceDate" required/>
                    </div>
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/3">
                            <Label htmlFor="adressePerso">Adresse Personnelle</Label>
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
                    <div className="gap-y-2 flex space-x-5">
                        <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="benef">Résultat Bénéficiaire</Label>
                            <Input type="number" id="benef" name="benef" defaultValue={ago.benef} min="0" step="0.01" placeholder="ex : 20000"/>
                        </div>
                        <p className="pt-7">ou</p>
                        <div className="gap-y-2 flex flex-col w-1/2">
                            <Label htmlFor="deficite">Résultat Déficitaire</Label>
                            <Input type="number" id="deficite" name="deficite" defaultValue={ago.deficite} min="0" step="0.01" placeholder="ex : 20000"/>
                        </div>
                    </div>
                    <div className="flex flex-col gap-y-2">
                    <Label htmlFor="3exercices">Les 3 derniers exercices</Label>
                    <div className="text-sm">
                    <p>Cochez si vous n'avez pas de dividendes distribués</p>
                    <Input type="checkbox" id="completed" name="completed" defaultValue={ago.completed} className="w-6 cursor-pointer"/>
                    </div>
                    <p>sinon</p>
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
                                N-1 : <Input type="date" id="n1Date" name="n1Date" defaultValue={ago.n1Date} className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n1DateAGO" name="n1DateAGO" defaultValue={ago.n1DateAGO} className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant11" name="montant11" defaultValue={ago.montant11} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant12" name="montant12" defaultValue={ago.montant12} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant13" name="montant13" defaultValue={ago.montant13} className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-2 : <Input type="date" id="n2Date" name="n2Date" defaultValue={ago.n2Date} className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n2DateAGO" name="n2DateAGO" defaultValue={ago.n2DateAGO} className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant21" name="montant21" defaultValue={ago.montant21} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant22" name="montant22" defaultValue={ago.montant22} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant23" name="montant23" defaultValue={ago.montant23} className="w-full" placeholder="0 €"/></td>
                        </tr>
                        <tr>
                            <td className="cell-container border border-black">
                            <div className="upper-cell text-center">
                                N-3 : <Input type="date" id="n3Date" name="n3Date" defaultValue={ago.n3Date} className="w-full" required/>
                            </div>
                            <div className="lower-cell text-center">
                                AGO du <Input type="date" id="n3DateAGO" name="n3DateAGO" defaultValue={ago.n3DateAGO} className="w-full" required/>
                            </div>
                            </td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant31" name="montant31" defaultValue={ago.montant31} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant32" name="montant32" defaultValue={ago.montant32} className="w-full" placeholder="0 €"/></td>
                            <td className="border border-black p-2"><Input type='number' min="0" id="montant33" name="montant33" defaultValue={ago.montant33} className="w-full" placeholder="0 €"/></td>
                        </tr>
                        </tbody>
                        </table>

                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                    <Link href="/dashboard/notes">
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
