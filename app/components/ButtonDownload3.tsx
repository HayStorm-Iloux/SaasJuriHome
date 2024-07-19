"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { getAGO } from "@/lib/actionsAGO";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, ITableCellOptions } from "docx"; // Import the necessary classes

interface DownloadProps {
  id: string;
}

function formatDate(inputDate: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const date = new Date(inputDate);
  return date.toLocaleDateString('fr-FR', options);
}

function formatDate2(inputDate: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric'
  };
  const date = new Date(inputDate);
  return date.toLocaleDateString('fr-FR', options);
}

const days: string[] = [
  "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
  "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept",
  "dix-huit", "dix-neuf", "vingt", "vingt-et-un", "vingt-deux", "vingt-trois",
  "vingt-quatre", "vingt-cinq", "vingt-six", "vingt-sept", "vingt-huit", "vingt-neuf",
  "trente", "trente-et-un"
];

const months: string[] = [
  "", "janvier", "février", "mars", "avril", "mai", "juin", "juillet",
  "août", "septembre", "octobre", "novembre", "décembre"
];

const units: string[] = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
const tens: string[] = ["", "", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante-dix", "quatre-vingt", "quatre-vingt-dix"];

function numberToWords(num: number): string {
  if (num === 0) return "zéro";
  
  if (num < 20) return days[num];
  
  if (num < 100) {
    let unit = num % 10;
    let ten = Math.floor(num / 10);
    let tenWord = tens[ten];
    if (unit === 1 && ten !== 8 && ten !== 9) {
      return tenWord + "-et-un";
    }
    return tenWord + (unit ? "-" + units[unit] : "");
  }
  
  if (num < 1000) {
    let remainder = num % 100;
    let hundred = Math.floor(num / 100);
    let hundredWord = hundred > 1 ? units[hundred] + " cent" : "cent";
    return hundredWord + (remainder ? " " + numberToWords(remainder) : "");
  }
  
  if (num < 10000) {
    let remainder = num % 1000;
    let thousand = Math.floor(num / 1000);
    let thousandWord = thousand > 1 ? units[thousand] + " mille" : "mille";
    return thousandWord + (remainder ? " " + numberToWords(remainder) : "");
  }
  
  // For numbers larger than 9999, the current implementation doesn't handle
  // it, you may add handling as per your requirements.
  throw new Error("Number out of range for conversion: " + num);
}

// Function to format date into words
function formatDateInWords(inputDate: string): string {
  const date = new Date(inputDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
  const year = date.getFullYear();
  
  const dayInWords = numberToWords(day);
  const monthInWords = months[month];
  const yearInWords = numberToWords(year);
  
  return `${dayInWords} ${monthInWords} ${yearInWords}`;
}


export default function ButtonDownload3({ id }: DownloadProps) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const fetchedAgo = await getAGO(id);

    const premierGerant = fetchedAgo?.participants.find(participant => participant.gerant === true);

    const nombreGerants = fetchedAgo?.participants.filter(participant => participant.gerant === true).length || 0;
    const estSAS = fetchedAgo?.societeType === "Société par Actions Simplifiée (SAS)";

// Déterminer le libellé approprié
    let libelleGerant ;
    if (estSAS) {
      libelleGerant  = nombreGerants > 1 ? "président associé" : "président";
    } else {
      libelleGerant  = nombreGerants > 1 ? "gérant associé" : "gérant";
    }

    const totalShares = fetchedAgo?.participants.reduce((total, participant) => {
      const shares = participant.shares ? parseInt(participant.shares) : 0;
      return total + shares;
    }, 0);

    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            run: {
              font: "Garamond",
            },
          },
        ],
        
      },
      sections: [
          {
              properties: {},
              children: [
                new Paragraph({
                  children: [
                      new TextRun({
                          text: 'Déclaration de confidentialité des comptes annuels', 
                          size: 24,
                          bold: true,
                      }),
                  ],
                  alignment: 'center',
                  border: {
                    top: { style: "single", size: 6 },
                    left: { style: "single", size: 6 },
                    right: { style: "single", size: 6 },
                },
                spacing: { before: 200 },
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: 'Article R.123-111-1 du code de commerce',
                          size: 24,
                          bold: true,
                      }),
                  ],
                  alignment: 'center',
                  border: {
                    left: { style: "single", size: 6 },
                    right: { style: "single", size: 6 },
                },
              }),
              new Paragraph({
                  children: [
                      new TextRun({
                          text: 'Annexe 1-5 à l’article A. 123-61-1 du code de commerce',
                          size: 24,
                          italics: true,
                      }),
                  ],
                  alignment: 'center',
                  border: {
                    bottom: { style: "single", size: 6 },
                    left: { style: "single", size: 6 },
                    right: { style: "single", size: 6 },
                },
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `1.  Déclarant`, size: 24, bold: true})], alignment: 'center',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `Dénomination ou raison sociale de la personne morale : ${(fetchedAgo?.societeName as string).toUpperCase()}`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `Immatriculée au ${(fetchedAgo?.rcs as string).toUpperCase()}, numéro : ${parseInt(fetchedAgo?.siret as string).toLocaleString('fr-FR')}`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `Identité et qualité du représentant légal signataire : ${premierGerant?.sexe} ${(premierGerant?.lastName as string).toUpperCase() || ''} ${premierGerant?.firstName}, ${libelleGerant}`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `2.  Objet de la déclaration`, size: 24, bold: true})], alignment: 'center',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `Déclare que les comptes annuels de l’exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} et qui sont déposés an annexe au registre du commerce et des sociétés auront une publicité restreinte en application de l’article L.232-25 du code de commerce.`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),
              new Paragraph({ children: [new TextRun({ text: `3.	Engagement du déclarant`, size: 24, bold: true})], alignment: 'center',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({ children: [new TextRun({ text: `La soussignée atteste sur l’honneur que les renseignements contenus dans la présente déclaration sont exacts et que la société susvisée répond à la définition des micro-entreprises au sens de l’article L. 123-16-1 du code de commerce, n’est pas mentionnée à l’article L. 123-16-2 et n’a pas pour activité la gestion des titres de participations et de valeurs mobilières.`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({ children: [new TextRun({ text: `Toute fausse déclaration de confidentialité des comptes annuels constitue un faux et un usage de faux passible des peines d’amende et d’emprisonnement prévues aux articles 441-1 et suivants du code pénal.`, size: 24})], alignment: 'both',}),
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({ children: [new TextRun({ text: `Fait à ${fetchedAgo?.ville},`, size: 24})], alignment: 'both',}),
              new Paragraph({ children: [new TextRun({ text: `Le ${formatDate(fetchedAgo?.meetingDate as string)}`, size: 24})], alignment: 'both',}),
    
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({
                children: [new TextRun({ text: ''})],
                alignment: 'center',
              }),  
              new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.participants[0]?.sexe || ''} ${(fetchedAgo?.participants[0]?.lastName as string).toUpperCase() || ''} ${fetchedAgo?.participants[0]?.firstName || ''}`, size: 24, bold: true})], alignment: 'center',}),
              new Paragraph({ children: [new TextRun({ text: `${libelleGerant}`, size: 24, bold: true})], alignment: 'center',}),
              ],
          },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'declaration_confidentialité.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="hidden" name="id" value={id} />
      <Button type="submit" className="w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border-b border-gray-300">
        Déclaration de confidentialité
      </Button>
    </form>
  );
}
