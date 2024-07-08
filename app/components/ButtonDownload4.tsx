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


export default function ButtonDownload4({ id }: DownloadProps) {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const fetchedAgo = await getAGO(id);

    const totalShares = fetchedAgo?.participants.reduce((total, participant) => {
      const shares = participant.shares ? parseInt(participant.shares) : 0;
      return total + shares;
    }, 0);

    const deficitText = `L'Assemblée Générale décide d'affecter le déficit de l’exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} s’élevant à ${parseFloat(fetchedAgo?.deficite as string).toLocaleString('fr-FR')} Euros de la façon suivante :`
    const benefitText = `L'Assemblée Générale décide d'affecter le bénéfice de l’exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} s’élevant à ${parseFloat(fetchedAgo?.benef as string).toLocaleString('fr-FR')} Euros de la façon suivante :`
    const textToInclude = (fetchedAgo?.deficite !== '' && fetchedAgo?.deficite !== '0') ? deficitText : benefitText;

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
                    children: [new TextRun({ text: 'AFFECTATION DU RÉSULTAT', bold: true, size: 24 })],
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
                  new Paragraph({
                    children: [new TextRun({ text: 'DEUXIEME RÉSOLUTION', underline: {
                      type: 'single', // ou 'double' pour une double sous-ligne
                      color: '000000', // Couleur de la sous-ligne en hexadécimal
                  }, size: 24, bold: true })],
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: textToInclude, size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Section 1 - Origine', bold: true, size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: (fetchedAgo?.deficite !== '' && fetchedAgo?.deficite !== '0') ? `Résultat déficitaire :        ${parseFloat(fetchedAgo?.deficite as string).toLocaleString('fr-FR')} Euros` : `Résultat Bénéficiaire :        ${parseFloat(fetchedAgo?.benef as string).toLocaleString('fr-FR')} Euros`, size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Section 2 - Affectation', bold: true, size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Rajouter l\'affectation du résultat ici', size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Section 3 - Rappel des dividendes distribués', bold: true, size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: 'Conformément aux dispositions de l\'article 243 bis du CGI, l\'assemblée générale rappelle le montant des dividendes distribués au titre des 3 précédents exercices :', size: 24})],
                    alignment: 'both',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Table({
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: 'Exercice clos le', bold: true, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 475, after: 50 },
                                        })
                                    ],
                                    rowSpan: 2,
                                    width: { size: 2000, type: 'dxa' },
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: 'Revenus éligibles à l\'abattement', bold: true, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 50, after: 50 },
                                        })
                                    ],
                                    colSpan: 2,
                                    width: { size: 4000, type: 'dxa' },
                                } as any as ITableCellOptions),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: 'Revenus éligibles à l\'abattement', bold: true, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 50, after: 50 },
                                        })
                                    ],
                                    colSpan: 2,
                                    width: { size: 4000, type: 'dxa' },
                                }as any as ITableCellOptions),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: 'Revenus non éligibles à l\'abattement', bold: true, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 350, after: 50 },
                                        })
                                    ],
                                    rowSpan: 2,
                                    width: { size: 4000, type: 'dxa' },
                                })
                            ]
                        }),
                        new TableRow({
                          children: [
                              new TableCell({
                                  children: [
                                      new Paragraph({
                                          children: [new TextRun({ text: 'Dividendes', bold: true, size: 23 })],
                                          alignment: 'center',
                                          spacing: { before: 150 },
                                      })
                                  ],
                              }),
                              new TableCell({
                                  children: [
                                      new Paragraph({
                                          children: [new TextRun({ text: 'Autres revenus distribués', bold: true, size: 23 })],
                                          alignment: 'center',
                                          spacing: { before: 50, after: 50 },
                                      })
                                  ],
                              })
                          ]
                      }),
                        
                        // Row 1 data
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: `N-1 : ${formatDate2(fetchedAgo?.n1Date as string)}\nAGO du ${formatDate2(fetchedAgo?.n1DateAGO as string)}`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 50, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant11 !== '' && fetchedAgo?.montant11 !== '0') ? `${parseInt(fetchedAgo?.montant11 as string).toLocaleString('fr-FR')} €` : `-`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant12 !== '' && fetchedAgo?.montant12 !== '0') ? `${parseInt(fetchedAgo?.montant12 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant13 !== '' && fetchedAgo?.montant13 !== '0') ? `${parseInt(fetchedAgo?.montant13 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                })
                            ]
                        }),
                        // Row 2 data
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: `N-2 : ${formatDate2(fetchedAgo?.n2Date as string)}\nAGO du ${formatDate2(fetchedAgo?.n2DateAGO as string)}`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 50, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant21 !== '' && fetchedAgo?.montant21 !== '0') ? `${parseInt(fetchedAgo?.montant21 as string).toLocaleString('fr-FR')} €` : `-`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant22 !== '' && fetchedAgo?.montant22 !== '0') ? `${parseInt(fetchedAgo?.montant22 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant23 !== '' && fetchedAgo?.montant23 !== '0') ? `${parseInt(fetchedAgo?.montant23 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                })
                            ]
                        }),
                        // Row 3 data
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: `N-3 : ${formatDate2(fetchedAgo?.n3Date as string)}\nAGO du ${formatDate2(fetchedAgo?.n3DateAGO as string)}`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 50, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant31 !== '' && fetchedAgo?.montant31 !== '0') ? `${parseInt(fetchedAgo?.montant31 as string).toLocaleString('fr-FR')} €` : `-`, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant32 !== '' && fetchedAgo?.montant32 !== '0') ? `${parseInt(fetchedAgo?.montant32 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                }),
                                new TableCell({
                                    children: [
                                        new Paragraph({
                                            children: [new TextRun({ text: (fetchedAgo?.montant33 !== '' && fetchedAgo?.montant33 !== '0') ? `${parseInt(fetchedAgo?.montant33 as string).toLocaleString('fr-FR')} €` : ``, size: 23 })],
                                            alignment: 'center',
                                            spacing: { before: 175, after: 50 },
                                        })
                                    ],
                                })
                            ]
                        })
                    ],
                    alignment: 'center'
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),
                new Paragraph({
                  children: [new TextRun({ text: 'Cette résolution est adoptée à l\'unanimité.', size: 24})],
                  alignment: 'both',
                }),
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),  
                new Paragraph({
                  children: [new TextRun({ text: ''})],
                  alignment: 'center',
                }),  
                new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.participants[0]?.sexe || ''} ${(fetchedAgo?.participants[0]?.lastName as string).toUpperCase() || ''} ${fetchedAgo?.participants[0]?.firstName || ''}`, size: 24, bold: true})], alignment: 'center',}),
                new Paragraph({ children: [new TextRun({ text: `Gérant Associé`, size: 24, bold: true})], alignment: 'center',}),
              ],
          },
      ],
    });
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'affectation_du_resultat.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="hidden" name="id" value={id} />
      <Button type="submit" className="w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border-b border-gray-300">
        Affectation du résultat
      </Button>
    </form>
  );
}
