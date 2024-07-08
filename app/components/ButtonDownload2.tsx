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


export default function ButtonDownload2({ id }: DownloadProps) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const fetchedAgo = await getAGO(id);

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
                new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.societeName as string).toUpperCase()}`, bold: true, size: 24})], alignment: 'center',spacing: { after: 50 },}),
                new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.societeType}`, bold: true, size: 24})], alignment: 'center',spacing: { after: 50 },}),
                new Paragraph({ children: [new TextRun({ text: `Au capital de ${parseInt(fetchedAgo?.capitalAmount as string).toLocaleString('fr-FR')} Euros`, bold: true, size: 24})], alignment: 'center', spacing: { after: 50 },}),
                new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.adresse}`, bold: true, size: 24})], alignment: 'center',spacing: { after: 50 },}),
                new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.postal} ${(fetchedAgo?.ville as string).toUpperCase()}`, bold: true, size: 24})], alignment: 'center',spacing: { after: 50 },}),
                new Paragraph({ children: [new TextRun({ text: `${parseInt(fetchedAgo?.siret as string).toLocaleString('fr-FR')} ${(fetchedAgo?.rcs as string).toUpperCase()}`, bold: true, size: 24})], alignment: 'center'}),
                new Paragraph({ children: [new TextRun({ text: ''})], alignment: 'center',}),
                new Paragraph({ children: [new TextRun({ text: '__________________________________________________________________________________________'})], alignment: 'center',}),
                new Paragraph({ children: [new TextRun({ text: ''})], alignment: 'center',}),
                new Paragraph({ children: [new TextRun({ text: ''})], alignment: 'center',}),
                new Paragraph({
                  children: [new TextRun({ text: 'FEUILLE DE PRÉSENCE', bold: true, size: 24 })],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'ASSEMBLEE GENERALE ORDINAIRE ANNUELLE', bold: true, size: 24 })],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({ children: [new TextRun({ text: `DU ${formatDate(fetchedAgo?.meetingDate as string).toUpperCase()}`, bold: true, size: 24})], alignment: 'center',}),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
    
    
                new Table({
                  rows: [
                    new TableRow({
                      children: [
                        // Colonnes avec les noms spécifiés 'ASSOCIÉES Nom, Prénoms' 'NOMBRE DE PARTS' 'NOMBRE DE VOIX' 'MANDATAIRE Nom, Prénoms' 'SIGNATURE'
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: 'ASSOCIÉS', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: 'Nom, Prénoms', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { after: 300 },
                        })],
                        width: { size: 2000, type: 'dxa' }, }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: 'NOMBRE DE PARTS', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300, after: 300 },
                        })],
                        width: { size: 2000, type: 'dxa' }, }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: 'NOMBRE DE VOIX', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300, after: 300 },
                        })],
                        width: { size: 2000, type: 'dxa' }, }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: 'MANDATAIRE', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300 },
                        }),
                        new Paragraph({
                          children: [new TextRun({ text: 'Nom, Prénoms', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { after: 300 },
                        })],
                        width: { size: 2000, type: 'dxa' }, }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: 'SIGNATURE', bold: true, size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300, after: 300 },
                        })],
                        width: { size: 2000, type: 'dxa' }, }),
                      ]
                    }),
                    // Ajoutez des lignes vides pour les données (facultatif)
                    ...(fetchedAgo?.participants as { id: string; sexe: string | null; firstName: string | null; lastName: string | null; shares: string | null; createdAt: Date; updatedAt: Date; agoId: string; }[]).map((participant, index) => ( new TableRow({
                      children: [
                        new TableCell({ children:  [new Paragraph({
                          children: [new TextRun({ text: `${participant.sexe} ${(participant.lastName as string).toUpperCase()} ${participant.firstName}` , size: 23 })],
                          spacing: { before: 300, after: 300 },
                        })] }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: `${participant.shares}` , size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300, after: 300 },
                        })] }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun({ text: `${participant.shares}` , size: 23 })],
                          alignment: 'center',
                          spacing: { before: 300, after: 300 },
                        })] }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun(``)],
                          spacing: { before: 300, after: 300 },
                        })] }),
                        new TableCell({ children: [new Paragraph({
                          children: [new TextRun(``)],
                          spacing: { before: 300, after: 300 },
                        })] })
                      ]
                    })
                  )),
                  new TableRow({
                    children: [
                      // Colonnes avec les noms spécifiés
                      new TableCell({ children: [new Paragraph({
                        children: [new TextRun(`Total`)],
                        spacing: { before: 300, after: 300 },
                      })] }),
                      new TableCell({ children: [new Paragraph({
                        children: [new TextRun({ text: `${totalShares}` , size: 23 })],
                        alignment: 'center',
                        spacing: { before: 300, after: 300 },
                      })] }),
                      new TableCell({ children: [new Paragraph({
                        children: [new TextRun({ text: `${totalShares}` , size: 23 })],
                        alignment: 'center',
                        spacing: { before: 300, after: 300 },
                      })] }),
                      new TableCell({ children: [new Paragraph({
                        children: [new TextRun(``)],
                        alignment: 'center',
                        spacing: { before: 300, after: 300 },
                      })] }),
                      new TableCell({ children: [new Paragraph({
                        children: [new TextRun(``)],
                        alignment: 'center',
                        spacing: { before: 300, after: 300 },
                      })] })
                    ]
                  }),
                  ],alignment: 'center',
    
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({ children: [new TextRun({ text: `Le Président de séance certifie exacte la présente feuille de présence, faisant apparaître que ${fetchedAgo?.participants.length} associés sont présents, totalisant ${totalShares} parts sociales ayant droit de vote, et auxquelles sont attachées ${totalShares} voix. A la présente ne sont annexés aucun pouvoir.`, size: 24})], alignment: 'both',}),
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
                new Paragraph({ children: [new TextRun({ text: `Président de Séance`, size: 24})], alignment: 'center',}),
              ],
          },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'feuille_de_presence.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="hidden" name="id" value={id} />
      <Button type="submit" className="w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border-b border-gray-300">
        Feuille de Présence
      </Button>
    </form>
  );
}
