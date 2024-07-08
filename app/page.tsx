"use client"

import Image from "next/image";
import Link from "next/link"
import { useSession } from "next-auth/react";
import {redirect} from "next/navigation"
import { useState, useEffect, useCallback} from "react";
import { Button } from "@/components/ui/button";
import Nav from "./components/Nav";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import NumberTicker from "@/components/magicui/number-ticker";
import ButtonProvider from "./components/ButtonProvider";
import { signIn } from "next-auth/react"



export default function Home() { 

  const {data: session} = useSession()

  useEffect(() => {
    if (session) {
      redirect("/dashboard/notes");
    }
    console.log(session)
  }, [session]);


  const [selectedSection, setSelectedSection] = useState('section1');
  const [progress, setProgress] = useState(0);
  const sections = ['section1', 'section2', 'section3', 'section4'];
  let autoNavigateInterval: NodeJS.Timeout;
  let progressInterval: NodeJS.Timeout;
  
  const clearIntervals = useCallback((): void => {
    clearInterval(autoNavigateInterval);
    clearInterval(progressInterval);
  }, []);

  const startAutoNavigate = useCallback((): void => {
    clearIntervals();
    autoNavigateInterval = setInterval(() => {
      setSelectedSection(prevSection => {
        const currentIndex = sections.indexOf(prevSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        return sections[nextIndex];
      });
    }, 5000);
  }, [clearIntervals]);

  const startProgress = useCallback((): void => {
    clearInterval(progressInterval);
    setProgress(0);
    progressInterval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prevProgress + 2; // 100 / 50 = 2 (incrément de 2% chaque 100ms pour atteindre 100% en 5 secondes)
      });
    }, 100);
  }, []);

  useEffect(() => {
    startAutoNavigate();
    startProgress();
    return () => clearIntervals();
  }, [selectedSection, startAutoNavigate, startProgress, clearIntervals]);

  const handleSectionClick = (section: string): void => {
    setSelectedSection(section);
    startAutoNavigate();
    startProgress();
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'section1':
        return (
          <div className="flex items-center justify-between xl:border-l-2 border-[#E3D6BF] xl:px-14">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Gagnez du temps</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...</p>
            </div>
            <img src="/fast.svg" alt="tkt" width={450} height={450} className="hidden lg:block md:w-80 md:h-80" />
          </div>
        );
      case 'section2':
        return (
          <div className="flex items-center justify-between xl:border-l-2 border-[#E3D6BF] xl:px-14">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Gagnez de l'argent</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...</p>
            </div>
            <img src="/moneyy.svg" alt="tkt" width={450} height={450} className="hidden lg:block md:w-80 md:h-80" />
          </div>
        );
      case 'section3':
        return (
          <div className="flex items-center justify-between xl:border-l-2 border-[#E3D6BF] xl:px-14">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl ">Tous vos documents</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...</p>
            </div>
            <img src="/list.svg" alt="tkt" width={450} height={450} className="hidden lg:block md:w-80 md:h-80" />
          </div>
        );
      case 'section4':
        return (
          <div className="flex items-center justify-between xl:border-l-2 border-[#E3D6BF] xl:px-14">
            <div className="flex flex-col justify-center text-center px-12">
              <h1 className="text-semibold text-2xl">Autres Avantages</h1>
              <p> It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged...</p>
            </div>
            <img src="/fast.svg" alt="tkt" width={450} height={450} className="hidden lg:block md:w-80 md:h-80" />
          </div>
        );
      default:
        return <div className="flex items-center">Veuillez sélectionner une section</div>;
    }
  };





  return (
    <div className="min-h-screen bg-[#faf5ef] overflow-x-hidden lg:mt-12">
      <Nav />
      <section className="w-11/12 lg:w-10/12 h-[80vh] flex flex-col lg:flex-row mx-auto mt-12 lg:mt-16 relative">
        <div className="w-full lg:w-1/2 flex flex-col text-center items-center mt-20">
          <h1 className="mt-10 lg:mt-0 tracking-tight text-balance font-bold leading-tight text-gray-900 text-3xl lg:text-5xl">
            Votre Assemblée Générale
            <br />
            <span className="text-gradient">En seulement 5 minutes !</span>
          </h1>
          <p className="text-center font-semibold text-xl my-10 px-16">
            <span className="underline">JuriHome</span> vous permet de gérer votre assemblée générale en ligne, facilement et rapidement.
            Remplissez le formulaire et obtenez vos documents en quelques minutes.
          </p>
          <div className="flex flex-col space-y-4">
            <Button onClick={() => signIn('google')} className="bg-green-700 hover:bg-green-800 text-white">Commencer Maintenant</Button>
          </div>
        </div>
        <div className="w-1/2 mt-8 hidden lg:block">
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

      <section className="flex mx-auto text-center justify-between lg:flex-row lg:w-9/12 w-10/12 lg:mt-8">

        <div className="flex flex-col items-center w-1/4 py-8">
          <h1 className=" text-3xl lg:text-5xl font-bold">4.7/5</h1>
          <p className="text-sm lg:text-xl font-semibold my-2">Note sur 106 avis</p>
          <div className="flex gap-1">
          <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          className="w-4 h-4 lg:w-5 lg:h-5"
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          className="w-4 h-4 lg:w-5 lg:h-5"
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          className="w-4 h-4 lg:w-5 lg:h-5"
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          className="w-4 h-4 lg:w-5 lg:h-5"
          />
                <Image 
          src="/star.svg"
          alt="star"
          width={25}
          height={25}
          className="w-4 h-4 lg:w-5 lg:h-5"
          />
          </div>

        </div>
        <div className="flex flex-col items-center w-1/4 py-8">
          <h1 className="text-3xl lg:text-5xl font-bold"><NumberTicker value={150} /></h1>
          <p className="text-sm lg:text-xl font-semibold my-2">Nouveaux utilisateur / Mois</p>

        </div>
        <div className="flex flex-col items-center w-1/4 py-8">
          <h1 className="text-3xl lg:text-5xl font-bold"><NumberTicker value={300} /> +</h1>
          <p className="text-sm lg:text-xl font-semibold my-2">AG générées / Mois</p>

        </div>
      </section>


      <section className="mt-8">
      <div className="w-full">
        <img src="/wave.svg" alt="bg" className="w-full" id="avantages" />
      </div>
      <div className="mt-[-1px] w-full bg-green-700 h-auto px-8 xl:px-28 flex flex-col">
        <h1 className="text-[#faf5ef] font-semibold text-4xl text-center">Nos Avantages :</h1>
        <div className="flex flex-col xl:flex-row w-full items-center justify-between h-auto my-12 bg-[#faf5ef] rounded-xl transition-all duration-500 ease-in-out py-8">
          <div className="w-full xl:w-1/3 p-4 text-center rounded-lg px-12 py-8">
            <ul className="flex flex-col xl:flex-col sm:flex-row justify-between">
              {sections.map((section, index) => (
                <li
                  key={index}
                  className={`p-2 cursor-pointer transition-all duration-300 ease-in-out relative ${
                    selectedSection === section
                      ? 'bg-[#E3D6BF] rounded-lg text-lg shadow-xl md:text-sm'
                      : 'bg-[#ffffff] rounded-md opacity-70 my-2 flex items-center justify-center text-sm lg:text-sm'
                  }`}
                  onClick={() => handleSectionClick(section)}
                >
                  <div className="section-title">
                    {section === 'section1' && (
                      <h1 className={`${
                        selectedSection === section
                          ? 'font-bold lg:text-2xl text-xl my-8 transition-all duration-300 ease-in-out'
                          : 'font-medium lg:text-lg text-md my-2 transition-all duration-300 ease-in-out'
                        }`}>
                        Gagnez du temps
                      </h1>
                    )}
                    {section === 'section2' && (
                      <div className="flex items-center justify-center">
                        <h1 className={`${
                          selectedSection === section
                            ? 'font-bold lg:text-2xl text-xl my-8 transition-all duration-300 ease-in-out'
                            : 'font-medium lg:text-lg text-md my-2 transition-all duration-300 ease-in-out'
                          }`}>
                          Gagnez de l'argent
                        </h1>
                      </div>
                    )}
                    {section === 'section3' && (
                      <h1 className={`${
                        selectedSection === section
                          ? 'font-bold lg:text-2xl text-xl my-8 transition-all duration-300 ease-in-out'
                          : 'font-medium lg:text-lg text-md my-2 transition-all duration-300 ease-in-out'
                        }`}>
                        Tous vos documents
                      </h1>
                    )}
                    {section === 'section4' && (
                      <h1 className={`${
                        selectedSection === section
                          ? 'font-bold lg:text-2xl text-xl my-8 transition-all duration-300 ease-in-out'
                          : 'font-medium lg:text-lg text-md my-2 transition-all duration-300 ease-in-out'
                        }`}>
                        Autres Avantages
                      </h1>
                    )}
                  </div>
                  {selectedSection === section && (
                    <div
                      className="absolute inset-0 border-4 border-green-700 rounded-lg"
                      style={{ clipPath: `inset(0 ${95 - progress}% 0 0)` }}
                    ></div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full xl:w-3/4 transition-all duration-300 ease-in-out">
            {renderContent()}
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Button onClick={() => signIn('google')} className="bg-[#faf5ef] hover:bg-[#E3D6BF] text-black font-bold rounded-md mb-6 mx-auto">Commencer Maintenant</Button>
        </div>
      </div>
    </section>

      <section className="h-auto w-full bg-white py-14">
        <h1 id="tarifs" className="font-bold text-4xl text-center">Nos Tarifs :</h1>
        <div className="flex flex-col lg:flex-row items-center justify-center">
            <div className="bg-[#faf5ef] w-5/6 lg:w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20 shadow-sm">
              <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-green-700 ">Offre Mensuelle</h2>
                <h1 className="font-bold text-3xl my-4 md:text-center">29€99</h1>
                <Button onClick={() => signIn('google')} className="bg-green-700 hover:bg-green-800 text-white rounded-md mt-6">Commencer</Button>
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
          <div className="bg-[#faf5ef] w-5/6 lg:w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20 border border-purple-700">
            <h2 className="text-center font-semibold text-purple-700 pb-2">Best Seller ! eco 5%</h2>
            <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-purple-700">Offre 6 mois</h2>
                <h1 className="font-bold text-3xl my-4 md:text-center">89€99</h1>
                <Button onClick={() => signIn('google')} className="bg-purple-700  text-white rounded-md mt-6">Commencer</Button>
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
          <div className="bg-[#faf5ef] w-5/6 lg:w-1/6 flex flex-col px-4 py-4 rounded-xl mt-20 mx-20">
          <h2 className="text-center font-semibold text-green-700 pb-2">economiser 11%</h2>
              <div className="bg-white h-1/3 px-4 py-4 rounded-xl flex flex-col shadow-xl">
                <h2 className="font-semibold text-xl my-4 text-green-700">Offre Annuelle</h2>
                <h1 className="font-bold text-3xl my-4 md:text-center">109€99</h1>
                <Button onClick={() => signIn('google')} className="bg-green-700 hover:bg-green-800 text-white rounded-md mt-6">Commencer</Button>
              </div>
              <div className="mt-6 px-4">
                  <h3 className="text-sm font-bold text-gray-700">Inclus :</h3>
                  <ul className="mt-2 font-semibold list-disc list-inside text-gray-600 space-y-1 flex flex-col">
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

      <section className="w-full flex items-center p-4 justify-center bg-green-700 shadow-md py-10">
          <div className="bg-[#faf5ef] p-8 rounded-lg w-10/12">
            <h2 id="contact" className="text-3xl font-semibold mb-6 text-center text-green-700 underline underline-offset-4">Contactez-nous</h2>
            <form className="space-y-4 w-full mx-auto">
              <div>
                <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Prénom
                </Label>
                <Input
                  type="text"
                  id="firstName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Votre prénom"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Nom
                </Label>
                <Input
                  type="text"
                  id="lastName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Votre nom"
                />
              </div>
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Votre email"
                />
              </div>
              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message
                </Label>
                <Textarea
                  id="message"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  placeholder="Votre message"
                ></Textarea>
              </div>
              <div className="flex justify-center">
                <Button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 w-1/3 rounded-lg shadow-lg"
                >
                  Envoyer
                </Button>
              </div>
            </form>
          </div>
    </section>

    <footer className="bg-[#363c48] w-full flex justify-center py-6">
      <section className="w-3/4 flex flex-col md:flex-row justify-around">
            <div className="flex flex-col justify-center sm:justify-around">
              <Link href="/" className="flex items-center justify-center my-2 font-semibold text-xl md:text-2xl text-white">
                <img src="/logo3.png" alt="logo site" className="w-8 rounded-lg shadow-lg mr-2" />
                Juri<span className="text-green-700">Home</span>
              </Link>
              <p className="text-white text-center my-2">Votre logiciel spécialiser <br/> en assemblée générale</p>
            </div>
            <div className="flex flex-col justify-around items-center text-white mb-6 lg:mb-2">
              <h2 className="font-bold text-lg underline underline-offset-2">Menu</h2>
              <a href="#avantages"><h3 className="font-normal mt-2 hover:text-green-500">Avantages</h3></a>
              <a href="#tarifs"><h3 className="font-normal mt-2 hover:text-green-500">Tarifs</h3></a>
              <a href="#contact"><h3 className="font-normal mt-2 hover:text-green-500">Contactez-nous</h3></a>
            </div>
            <div className="flex flex-col justify-around items-center text-white mb-6 lg:mb-2">
              <h2 className="font-bold text-lg underline underline-offset-2">Mention Légales</h2>
              <h3 className="font-normal mt-2 hover:text-green-500">CGU</h3>
              <h3 className="font-normal mt-2 hover:text-green-500">CGV</h3>
              <h3 className="font-normal mt-2 hover:text-green-500">Confidentialité</h3>
            </div>
            <div className="flex flex-col justify-around items-center text-white">
              <h2 className="font-bold text-lg underline underline-offset-2 mb-6 lg:mb-2">Application</h2>
              <ButtonProvider/>
            </div>
      </section>
    </footer>

    </div>

  );
}