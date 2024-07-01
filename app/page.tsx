"use client"

import Image from "next/image";
import Link from "next/link"
import { Typewriter, Cursor } from "react-simple-typewriter";
import ButtonProvider from "./components/ButtonProvider";
import { useSession } from "next-auth/react";
import {redirect} from "next/navigation"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Nav from "./components/Nav";


export default function Home() { 

  
const {data: session} = useSession()

  if(session){
    redirect("/dashboard/notes")
  }

  const [selectedSection, setSelectedSection] = useState('section1');
  const [progress, setProgress] = useState(0);
  const sections = ['section1', 'section2', 'section3', 'section4'];

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedSection(prevSection => {
        const currentIndex = sections.indexOf(prevSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        return sections[nextIndex];
      });
    }, 5000);

    // Nettoyage de l'intervalle
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Initialiser la barre de progression
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 2; // 100 / 50 = 2 (incrément de 2% chaque 100ms pour atteindre 100% en 5 secondes)
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [selectedSection]);

  const renderContent = () => {
    switch (selectedSection) {
      case 'section1':
        return <div className="flex items-center justify-between border-l-2 border-[#E3D6BF] px-12">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Gagnez du temps</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <img src="/fast.svg" alt="tkt" width={450} height={450} />
          </div>;
      case 'section2':
        return <div className="flex items-center justify-between px-12 border-l-2 border-[#E3D6BF]">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Gagnez de l'argent</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <img src="/moneyy.svg" alt="tkt" width={450} height={450} />
          </div>;
      case 'section3':
        return <div className="flex items-center justify-between px-12 border-l-2 border-[#E3D6BF]">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl ">Tous vos documents</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <img src="/list.svg" alt="tkt" width={450} height={450}/>
          </div>;
      case 'section4':
        return <div className="flex items-center justify-between px-12 border-l-2 border-[#E3D6BF]">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Gagnez du temps</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>
            <img src="/fast.svg" alt="tkt" width={450} height={450}  />
          </div>;
      default:
        return <div className="flex items-center">Veuillez sélectionner une section</div>;
    }
  };



  return (
    <div className="mt-20 min-h-screen bg-[#faf5ef] overflow-x-hidden ">
      <Nav />
      <section className="w-10/12 h-[80vh] flex flex-col lg:flex-row mx-auto mt-16 lg:mt-0 relative">
        <div className="w-full lg:w-1/2 flex flex-col items-center mt-20 lg:mt-0">
          <h1 className="mt-10 lg:mt-0 tracking-tight text-balance font-bold leading-tight text-gray-900 text-3xl lg:text-5xl">
            Votre Assemblée Générale
            <br />
            <span className="text-gradient">En seulement 5 minutes !</span>
          </h1>
          <p className="text-center font-semibold text-xl my-10 px-16">
            <span className="underline">JuriHome</span> vous permet de gérer votre assemblée générale en ligne, facilement et rapidement.
            Remplissez le formulaire et obtenez vos documents en quelques minutes.
          </p>
          <div className="mt-14">
            <button className="bg-[#22c55e] hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Commencer Maintenant
            </button>
          </div>
        </div>
        <div className="w-1/2 mt-8">
          <Image
            src="/test.avif"
            alt="home"
            width={1365}
            height={875}
            priority
            className="rounded-lg h-auto"
            style={{
              position: 'absolute',
              right: '-25%',
              width: '75%',
              height: 'auto',
              
            }}
          />
        </div>
      </section>

      <section className="flex mx-auto w-9/12 mt-8 ">

        <div className="flex flex-col items-center w-1/3 py-8">
          <h1 className="text-5xl font-bold">4.7/5</h1>
          <p className="text-md font-semibold my-2">Note sur 106 avis</p>
          <div className="flex gap-1">
          <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          />
          </div>

        </div>
        <div className="flex flex-col items-center w-1/3 py-8">
          <h1 className="text-5xl font-bold">150 +</h1>
          <p className="text-md font-semibold my-2">Nouveaux utilisateur / Mois</p>

        </div>
        <div className="flex flex-col items-center w-1/3 py-8">
          <h1 className="text-5xl font-bold">300 +</h1>
          <p className="text-md font-semibold my-2">AG générées / Mois</p>

        </div>
      </section>


      <section className="mt-8">

        <div className="w-full">
            <img src="/wave.svg" alt="bg" className="w-full"/>
        </div>
        <div className="mt-[-1px] w-full bg-[#22c55e] h-auto px-28 flex flex-col">
        <h1 className="text-[#faf5ef] font-semibold text-4xl text-center">Nos Avantages :</h1>
        <div className="flex items-center justify-between h-auto my-12 bg-[#faf5ef] rounded-xl transition-all duration-500 ease-in-out py-8">
        
        <div className="w-1/3 p-4 text-center rounded-lg px-12 py-8">
          <ul>
            {sections.map((section, index) => (
              <li
                key={index}
                className={`p-2 cursor-pointer transition-all duration-300 ease-in-out ${
                  selectedSection === section
                    ? 'bg-[#E3D6BF] rounded-lg text-lg shadow-xl'
                    : 'bg-[#ffffff] rounded-md opacity-70 my-4'
                }`}
                onClick={() => {
                  setSelectedSection(section);
                }}
              >
                <div className="section-title">
                  {section === 'section1' && (
                    <h1 className={`${
                      selectedSection === section
                        ? 'font-bold text-2xl my-8 transition-all duration-300 ease-in-out'
                        : 'font-medium text-lg my-2 transition-all duration-300 ease-in-out'
                      }`}>
                      Gagnez du temps
                    </h1>
                  )}
                  {section === 'section2' && (
                    <div className="flex items-center justify-center">
                        <h1 className={`${
                        selectedSection === section
                          ? 'font-bold text-2xl my-8 transition-all duration-300 ease-in-out'
                          : 'font-medium text-lg my-2 transition-all duration-300 ease-in-out'
                        }`}>
                        Gagner de l'argent
                      </h1>
                    </div>
                  )}
                  {section === 'section3' && (
                    <h1 className={`${
                      selectedSection === section
                        ? 'font-bold text-2xl my-8 transition-all duration-300 ease-in-out'
                        : 'font-medium text-lg my-2 transition-all duration-300 ease-in-out'
                      }`}>
                      Tous vos documents
                    </h1>
                  )}
                  {section === 'section4' && (
                    <h1 className={`${
                      selectedSection === section
                        ? 'font-bold text-2xl my-8 transition-all duration-300 ease-in-out'
                        : 'font-medium text-lg my-2 transition-all duration-300 ease-in-out'
                      }`}>
                      Autres Avantages
                    </h1>
                  )}
                </div>
                {selectedSection === section && (
                  <div
                    className="h-1 bg-[#22c55e] rounded-full transition-all duration-300 ease-in-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-3/4 transition-all duration-300 ease-in-out">{renderContent()}</div>

      </div>
      <Button className="bg-[#faf5ef] text-black font-bold rounded-md mb-6 mx-auto">Commencer Maintenant</Button>
    </div>



      </section>

      <section className="h-auto w-full bg-white py-14">
        <h1 className="font-bold text-4xl text-center">Nos Tarifs :</h1>
        <div className="flex items-center justify-center">
            <div className="bg-[#faf5ef] w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20 shadow-sm">
              <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-[#22c55e]">Offre Mensuelle</h2>
                <h1 className="font-bold text-3xl my-4">29€99</h1>
                <Button className="bg-[#22c55e]  text-white rounded-md mt-6">Commencer</Button>
              </div>
              <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-gray-700">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-gray-600 space-y-1">
                    <li>CRAs illimités</li>
                    <li>Clients illimités</li>
                    <li>Signature numérique</li>
                    <li>Génération de PDF</li>
                    <li>Time tracker</li>
                    <li>Reporting</li>
                  </ul>
              </div>
          </div>
          <div className="bg-[#faf5ef] w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20 border border-purple-700">
            <h2 className="text-center font-semibold text-purple-700 pb-2">Best Seller ! eco 5%</h2>
            <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-purple-700">Offre 6 mois</h2>
                <h1 className="font-bold text-3xl my-4">89€99</h1>
                <Button className="bg-purple-700  text-white rounded-md mt-6">Commencer</Button>
            </div>
                      <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-gray-700">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-gray-600 space-y-1">
                    <li>CRAs illimités</li>
                    <li>Clients illimités</li>
                    <li>Signature numérique</li>
                    <li>Génération de PDF</li>
                    <li>Time tracker</li>
                    <li>Reporting</li>
                  </ul>
              </div>
          </div>
          <div className="bg-[#faf5ef] w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20">
          <h2 className="text-center font-semibold text-[#22c55e] pb-2">economiser 11%</h2>
              <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-[#22c55e]">Offre Annuelle</h2>
                <h1 className="font-bold text-3xl my-4">109€99</h1>
                <Button className="bg-[#22c55e]  text-white rounded-md mt-6">Commencer</Button>
              </div>
              <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-gray-700">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-gray-600 space-y-1">
                    <li>CRAs illimités</li>
                    <li>Clients illimités</li>
                    <li>Signature numérique</li>
                    <li>Génération de PDF</li>
                    <li>Time tracker</li>
                    <li>Reporting</li>
                  </ul>
              </div>
          </div>
        </div>
      </section>

    </div>

  );
}
