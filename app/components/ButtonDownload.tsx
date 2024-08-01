"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";
import { getAGO } from "@/lib/actionsAGO";
import { Document, Packer, Paragraph, TextRun, Table, TableCell, TableRow, ITableCellOptions, TabStopType, TabStopPosition } from "docx"; // Import the necessary classes

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


export default function ButtonDownload({ id }: DownloadProps) {
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

    const numberToWordsFr = (number: number): string => {
      const units = ['', 'PREMIÈRE', 'DEUXIÈME', 'TROISIÈME', 'QUATRIÈME', 'CINQUIÈME', 'SIXIÈME', 'SEPTIÈME', 'HUITIÈME', 'NEUVIÈME', 'DIXIÈME'];
      return units[number] || number.toString();
    };

    const estSeul = fetchedAgo?.societeType === "Société par Actions Simplifiée Unipersonnelle (SASU)" || fetchedAgo?.societeType === "Entreprise unipersonnelle à responsabilité limitée (EURL)";

// Déterminer le libellé approprié
    let titreAssemblee ;
    if (estSeul) {
      titreAssemblee  = "Associé Unique";
    } else {
      titreAssemblee  = "Assemblée Générale";
    }
  
    let resolutionCounter = 1;

    const deficitText = `L'${titreAssemblee} décide d'affecter le déficit de l’exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} s’élevant à ${parseFloat(fetchedAgo?.deficite as string).toLocaleString('fr-FR')} Euros de la façon suivante :`
    const benefitText = `L'${titreAssemblee} décide d'affecter le bénéfice de l’exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} s’élevant à ${parseFloat(fetchedAgo?.benef as string).toLocaleString('fr-FR')} Euros de la façon suivante :`
    const textToInclude = (fetchedAgo?.deficite !== '' && fetchedAgo?.deficite !== '0' && fetchedAgo?.deficite !== null) ? deficitText : benefitText;

    const paragrap: any[] = [];
    if (fetchedAgo?.approbationCompte) {
      paragrap.push(
        new Paragraph({
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
            type: 'single', // ou 'double' pour une double sous-ligne
            color: '000000', // Couleur de la sous-ligne en hexadécimal
        }, size: 24, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `L'${titreAssemblee} approuve les comptes annuels, à savoir le bilan, le compte de résultat et l'annexe, arrêtés le ${formatDate(fetchedAgo?.exerciceDate as string)}, tels qu'ils lui ont été présentés
et qui font apparaitre un ${(fetchedAgo?.benef !== null && fetchedAgo?.benef !== '0' && fetchedAgo?.benef !== '') ? `bénéfice de ${parseFloat(fetchedAgo?.benef as string).toLocaleString('fr-FR')} euros.` : `déficite de ${parseFloat(fetchedAgo?.deficite as string).toLocaleString('fr-FR')} euros.`}`, size: 24})], alignment: 'both'}),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
      new Paragraph({ children: [new TextRun({ text: (fetchedAgo?.nondeduc !== null && fetchedAgo?.nondeduc !== '0' && fetchedAgo?.nondeduc !== '') ? `L'${titreAssemblee} approuve également le montant des dépenses et charges non déductibles des bénéfices soumis à l'impôt sur les sociétés et qui s’élève à ${parseFloat(fetchedAgo?.nondeduc as string).toLocaleString('fr-FR')}€.` : `Elle approuve également l’absence de dépenses et charges non déductibles des bénéfices assujettis à l'impôt sur les sociétés.`, size: 24})], alignment: 'both'}),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
      new Paragraph({ children: [new TextRun({ text: `En conséquence, l’${titreAssemblee} donne quitus entier à la gérance de l’exécution de son mandat pour ledit exercice.`, size: 24})], alignment: 'both'}),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
      new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.approbationCompteShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.approbationCompteShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.approbationCompteShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.approbationCompteShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
    );
    }
    const paragrap2: any[] = [];
    

    if (fetchedAgo?.affectation) {
      const tabaffec: any[] = [];
      const addTextRunIfValid = (text: string, value: any) => {
        if (value !== null && value !== '0' && value !== '') {
          tabaffec.push(new Paragraph({
            children: [
                new TextRun({
                    text: `${text} :`,
                    size: 24,
                }),
                new TextRun({
                    text: `\t${parseFloat(value).toLocaleString('fr-FR')} Euros`,
                    size: 24,
                })
            ],
            tabStops: [
                {
                    type: TabStopType.RIGHT,
                    position: TabStopPosition.MAX,
                },
            ],
        }));
        }
      };

      addTextRunIfValid("Réserve légale", fetchedAgo?.a12);
      addTextRunIfValid("En diminution du compte « Report à nouveau débiteur »", fetchedAgo?.a62);
      addTextRunIfValid("En diminution du compte « Report à nouveau créditeur »", fetchedAgo?.a72);
      addTextRunIfValid("En diminution du compte « Autres réserves »", fetchedAgo?.a82);
      addTextRunIfValid("Report à nouveau créditeur", fetchedAgo?.a22);
      addTextRunIfValid("Report à nouveau débiteur", fetchedAgo?.a42);
      addTextRunIfValid("Distribution de dividendes", fetchedAgo?.a32);
      addTextRunIfValid("Autres réserves", fetchedAgo?.a52);

      paragrap2.push(
        new Paragraph(
          {
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
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
          children: [new TextRun({ text: (fetchedAgo?.deficite !== '' && fetchedAgo?.deficite !== '0' && fetchedAgo?.deficite !== null) ? `Résultat déficitaire :        ${parseFloat(fetchedAgo?.deficite as string).toLocaleString('fr-FR')} Euros` : `Résultat Bénéficiaire :        ${parseFloat(fetchedAgo?.benef as string).toLocaleString('fr-FR')} Euros`, size: 24})],
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
        ...tabaffec,
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
        fetchedAgo?.completed ? (new Paragraph({
          children: [new TextRun({ text: `Conformément aux dispositions de l'article 243 bis du CGI, l'${titreAssemblee} rappelle le montant des dividendes distribués au titre des 3 précédents exercices :`, size: 24})],
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
      })):new Paragraph({
        children: [new TextRun({ text: `Conformément à la loi, l'${titreAssemblee} prend acte qu’il n’y a pas eu de dividendes distribués au cours des trois derniers exercices.`, size: 24})],
        alignment: 'both',
      }),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
      new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.affectationShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.affectationShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.affectationShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.affectationShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
      new Paragraph({
        children: [new TextRun({ text: ''})],
        alignment: 'center',
      }),
    );
    }

    const paragrap3: any[] = [];
    if (fetchedAgo?.lecture) {
      paragrap3.push(
        new Paragraph(
          {
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
            type: 'single', // ou 'double' pour une double sous-ligne
            color: '000000', // Couleur de la sous-ligne en hexadécimal
        }, size: 24, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({
          children: [new TextRun({ text: `L'${titreAssemblee} ${fetchedAgo?.convreg ? `approuve les conventions réglementées conclues entre les associés et la société au cours de l’exercice écoulé` : `constate l'abscence de convention réglementée conclue entre les associés et la société au cours de l’exercice écoulé`} conformément au rapport spécial du ${libelleGerant} sur les conventions visées à l’article L.223-19 du code de commerce.`, size: 24})],
          alignment: 'both',
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.lectureShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.lectureShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.lectureShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.lectureShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
      );
    }
    const paragrap4: any[] = [];
    if (fetchedAgo?.approbationBoss) {
      paragrap4.push(
        new Paragraph(
          {
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
            type: 'single', // ou 'double' pour une double sous-ligne
            color: '000000', // Couleur de la sous-ligne en hexadécimal
        }, size: 24, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: `L'${titreAssemblee} approuve ${nombreGerants > 1 ? `les rémunérations brutes perçues` : `la rémunération brute perçue`} par ${estSAS ? `le président` : nombreGerants > 1 ? ` chacun des cogérants` : `le gérant`} au titre de l'exercice écoulé, ${nombreGerants > 1 ? `telles qu’elles figurent` : `telle qu’elle figure`} dans les résultats de l'exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)}, à savoir :`, size: 24})],
          alignment: 'both',
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        ...fetchedAgo?.participants.filter(participant => participant.gerant).map((participant) => (
          new Paragraph({
            children: [new TextRun({ text: `${participant.sexe} ${participant.firstName} ${(participant?.lastName as string).toUpperCase() || ''} : ${parseFloat(participant.remuneration as string).toLocaleString('fr-FR')} euros ${estSAS ? `brute` : ``}`, size: 24})],
            alignment: 'both',
          })
        )),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({
          children: [new TextRun({ text: `${estSAS ? `` : `L’${titreAssemblee} approuve également la prise en charge par la société des cotisations dues au titre des régimes non salariés (CSG/CRDS, allocations familiales, assurance maladie, assurance vieillesse, ….) et des cotisations dites « Loi Madelin » pour ${estSAS ? `le président` : nombreGerants > 1 ? ` chacun des cogérants` : `le gérant`} et ${nombreGerants > 1 ? `relatives à ces rémunérations.` : `relative à cette rémunération.`}.`}`, size: 24})],
          alignment: 'both',
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${estSAS ? `` : `Leurs frais de déplacement et de représentation leur seront, en outre, respectivement remboursés, sur présentation de justificatifs.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.approbationBossShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.approbationBossShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.approbationBossShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.approbationBossShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
      );
    }
    const paragrap5: any[] = [];
    if (fetchedAgo?.pouvoir) {
      paragrap5.push(
        new Paragraph(
          {
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
            type: 'single', // ou 'double' pour une double sous-ligne
            color: '000000', // Couleur de la sous-ligne en hexadécimal
        }, size: 24, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({
          children: [new TextRun({ text: `L'${titreAssemblee} donne tous pouvoirs au porteur de copies ou d'extraits du présent procès-verbal pour remplir toutes formalités de droit.`, size: 24})],
          alignment: 'both',
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.pouvoirShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.pouvoirShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.pouvoirShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.pouvoirShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        );
    }
    

    const paragrap6: any[] = [];
    if (fetchedAgo?.fixation) {
      paragrap6.push(
        new Paragraph(
          {
          children: [new TextRun({ text: `${numberToWordsFr(resolutionCounter++)} RÉSOLUTION`, underline: {
            type: 'single', // ou 'double' pour une double sous-ligne
            color: '000000', // Couleur de la sous-ligne en hexadécimal
        }, size: 24, bold: true })],
        }),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({
          children: [new TextRun({ text: `L'${titreAssemblee} décide qu'à compter du ${formatDate(fetchedAgo?.acompter as string)}, ${nombreGerants > 1 ? `les rémunérations` : `la rémunérations`} ${estSAS ? `du président` : nombreGerants > 1 ? `de chacun des cogérants` : `du gérant`} ${nombreGerants > 1 ? `seront les suivantes` : `sera la suivante`} :`, size: 24})],
          alignment: 'both',
        }),
        ...fetchedAgo?.participants.filter(participant => participant.gerant).map((participant) => (
          new Paragraph({
            children: [new TextRun({ text: `${participant.sexe} ${participant.firstName} ${(participant?.lastName as string).toUpperCase() || ''} : ${parseFloat(participant.remunerationFuture as string).toLocaleString('fr-FR')} euros mensuel ${estSAS ? `brute` : ``}`, size: 24})],
            alignment: 'both',
          })
        )),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `Des primes exceptionnelles pourront toutefois être attribuées par décision collégiale.`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${estSAS ? `` : `L’${titreAssemblee} décide également la prise en charge par la société des cotisations dues au titre des régimes non salariés (CSG/CRDS, allocations familiales, assurance maladie, assurance vieillesse, ….) et des cotisations dites « Loi Madelin » relatives ${estSAS ? `au président` : nombreGerants > 1 ? `à chacun des cogérants` : `au gérant`}.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${estSAS ? `` : `Leurs frais de déplacement et de représentation leur seront, en outre, respectivement remboursés, sur présentation de justificatifs.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
        new Paragraph({ children: [new TextRun({ text: `${(fetchedAgo?.fixationShares === totalShares?.toString()) ? `Cette résolution est adoptée à l'unanimité.` : (fetchedAgo?.fixationShares === "0") ? `Cette résolution est rejetée à l'unanimité.` : `Cette résolution est ${Number(fetchedAgo?.fixationShares) < (totalShares as number)/2 ? `rejetée` : `adoptée`} à ${fetchedAgo?.fixationShares} voix sur ${totalShares}.`}`, size: 24})], alignment: 'both'}),
        new Paragraph({
          children: [new TextRun({ text: ''})],
          alignment: 'center',
        }),
            );
    }

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
                    children: [new TextRun({ text: 'PROCES-VERBAL', bold: true, size: 24 })],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({
                    children: [new TextRun({ text: `${'assemblée générale'.toUpperCase()} ORDINAIRE ANNUELLE`, bold: true, size: 24 })],
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
                  new Paragraph({ children: [new TextRun({ text: `Le ${formatDateInWords(fetchedAgo?.meetingDate as string)}, à ${fetchedAgo?.meetingTime} heures, les associés de ${(fetchedAgo?.societeName as string).toUpperCase()}, ${fetchedAgo?.societeType}, au capital de ${parseInt(fetchedAgo?.capitalAmount as string).toLocaleString('fr-FR')} Euros, se sont réunis en ${titreAssemblee} ordinaire, au siège social, sur convocation faite par ${estSAS ? `le président` : `la gérance`}. Les associés ont été convoqués conformément à la loi et aux statuts.`, size: 24})], alignment: 'both'}),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({ children: [new TextRun({ text: `Sont présents :`, size: 24})], alignment: 'both'}),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  ...(fetchedAgo?.participants as { id: string; sexe: string | null; firstName: string | null; lastName: string | null; shares: string | null; createdAt: Date; updatedAt: Date; agoId: string; }[]).map((participant, index) => (
                    new Paragraph({
                      children: [new TextRun({ text: `- ${participant.sexe} ${(participant.lastName as string).toUpperCase()} ${participant.firstName}, possédant `, size: 24 }), new TextRun({text: `${participant.shares} parts sociales `, size: 24})],
                      alignment: 'both',
                    })
                  )),
                  new Paragraph({
                    children: [new TextRun({ text: ''})],
                    alignment: 'center',
                  }),
                  new Paragraph({ children: [new TextRun({ text: `${Number(fetchedAgo?.partsNumber) === totalShares ? `Total de ${totalShares} parts, égales au nombre de parts composant le capital social.` : `Total de ${totalShares} parts, égales à ${Math.round((totalShares as number)*100)/(Number(fetchedAgo?.partsNumber))}% du nombre de parts composant le capital social.`}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `${Number(fetchedAgo?.partsNumber) === totalShares ? `Les associés présents ou représentés possédant ainsi la totalité des parts, l'${titreAssemblee} Ordinaire est déclarée régulièrement constituée et peut valablement délibérer.` : `${(totalShares as number) > (Number(fetchedAgo?.partsNumber)/2) ? `Les associés présents ou représentés possédant plus de la moitié des parts, l'${titreAssemblee} Ordinaire est déclarée régulièrement constituée et peut valablement délibérer.` : `Les associés présents ou représentés possédant moins de la moitié des parts, l'${titreAssemblee} Ordinaire est déclarée non régulièrement constituée et ne peut valablement délibérer.`}`}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.commissaire ? `${fetchedAgo?.sexeCommissaire} ${fetchedAgo?.prenomCommissaire} ${(fetchedAgo?.nomCommissaire as string).toUpperCase()}, commissaire aux comptes titulaire, régulièrement convoqué, ${fetchedAgo?.presenceCommissaire ? `participe à l'assemblée.`:`ne participe pas à l’assemblée et est excusé.`}`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `L'Assemblée est présidée par ${fetchedAgo?.participants[0]?.sexe || ''} ${(fetchedAgo?.participants[0]?.lastName as string).toUpperCase() || ''} ${fetchedAgo?.participants[0]?.firstName || ''} en sa qualité de ${libelleGerant} ${nombreGerants > 1 ? `associé.`: `.`}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Le Président rappelle que l'Assemblée est appelée à délibérer sur l'ordre du jour suivant :`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.lecture ? `-	Lecture du rapport spécial sur les conventions visées à l'article L. 223-19 du Code de commerce, et décision à cet égard`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.approbationCompte ? `-	Approbation des comptes de l'exercice clos le ${formatDate(fetchedAgo?.exerciceDate as string)} et quitus à la gérance`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.affectation ? `-	Affectation du résultat de l'exercice`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.approbationBoss ? `-	Approbation de la rémunération allouée ${nombreGerants > 1 ? "aux" : "au"} ${libelleGerant}`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.pouvoir ? `-	Pouvoirs pour l'accomplissement des formalités`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `${fetchedAgo?.fixation ? `-	Fixation de la rémunération allouée ${nombreGerants > 1 ? "aux" : "au"} ${libelleGerant}`:``}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Le Président dépose sur le bureau et met à la disposition des membres de l'Assemblée :`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `-	L'inventaire et les comptes annuels arrêtés au ${formatDate(fetchedAgo?.exerciceDate as string)},`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `-	Le rapport spécial sur les conventions visées à l'article L. 223-19 du Code de commerce,`, size: 24})], alignment: 'both'}),
            new Paragraph({ children: [new TextRun({ text: `-	Le texte du projet des résolutions qui sont soumises à l'Assemblée.`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Le Président déclare que les documents et renseignements prévus par les dispositions législatives et réglementaires ont été adressés aux associés ou tenus à leur disposition au siège social pendant le délai fixé par lesdites dispositions.`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `L'Assemblée lui donne acte de cette déclaration.`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Le Président présente et commente les comptes de l'exercice écoulé ${fetchedAgo?.lecture ? ` avant de donner lecture à l'Assemblée du rapport spécial sur les conventions visées à l'article L. 223-19 du Code de commerce, établis par la gérance.` : `.`}`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Puis, le Président déclare la discussion ouverte.`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            new Paragraph({ children: [new TextRun({ text: `Personne ne demandant la parole, le Président met successivement aux voix les résolutions suivantes :`, size: 24})], alignment: 'both'}),
            new Paragraph({
              children: [new TextRun({ text: ''})],
              alignment: 'center',
            }),
            ...paragrap,
            ...paragrap2,
            ...paragrap3,
            ...paragrap4,
            ...paragrap5,
            ...paragrap6,            
    new Paragraph({
      children: [new TextRun({ text: ''})],
      alignment: 'center',
    }),
    new Paragraph({
      children: [new TextRun({ text: `L'ordre du jour étant épuisé et personne ne demandant plus la parole, le Président déclare la séance levée.`, size: 24})],
      alignment: 'both',
    }),
    new Paragraph({
      children: [new TextRun({ text: ''})],
      alignment: 'center',
    }),
    new Paragraph({
      children: [new TextRun({ text: `De tout ce que dessus, il a été dressé le présent procès-verbal qui a été signé après lecture par ${estSAS ? `le président` : nombreGerants > 1 ? `les cogérants` : `le gérant`}, le président de séance et les associés.`, size: 24})],
      alignment: 'both',
    }),

      ],
          },
      ],
    });

    
    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'proces_verbal_AGO.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="hidden" name="id" value={id} />
      <Button type="submit" className="w-full text-left px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border-b border-gray-300">
        Procès Verbal
      </Button>
    </form>
  );
}
