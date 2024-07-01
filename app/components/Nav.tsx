"use client"

import Link from "next/link"
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import LogoMdc from '@/public/logo.svg'
import Image from "next/image"
import { ThemeToggle } from "./ThemeToggle"
import ButtonProvider from "./ButtonProvider";
import ButtonSignOut from "./ButtonSignOut";
import { useState } from "react";


export default function Nav() {

  const {data: session} = useSession()
  const [open, setOpen] = useState(false);


  return (
      <nav className="flex justify-center">
        <div className="fixed top-0 bg-white bg-opacity-80 shadow-md w-full md:w-8/12 h-auto rounded-md mx-auto flex items-center justify-between mt-8 backdrop-blur-md px-8 z-40 py-3">
          <div className="flex items-center gap-4 md:gap-8">
            <Link href="/" className="flex items-center font-semibold text-xl md:text-2xl text-black">
              <img src="/logo3.png" alt="logo site" className="w-10 md:w-12 mx-2 rounded-lg shadow-lg" />
              Juri<span className="text-green-600">Home</span>
            </Link>
            <div className="hidden md:flex items-center gap-4 md:gap-8">
              <a href="/" className="text-gray-700 hover:text-green-500">Avantages</a>
              <a href="/" className="text-gray-700 hover:text-green-500">Tarifs</a>
              <a href="/" className="text-gray-700 hover:text-green-500">Contactez-Nous</a>
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            {session ? (
              <ButtonSignOut />
            ) : (
              <ButtonProvider />
            )}
          </div>
          <div className="md:hidden">
            <button className="text-gray-700 hover:text-green-500 focus:outline-none" onClick={() => setOpen(!open)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        {open && (
          <div className="fixed left-0 mt-4 right-0 bg-white bg-opacity-80 shadow-md w-full rounded-md mx-auto flex flex-col items-center backdrop-blur-md px-8 z-40 py-3 md:hidden">
            <a href="/" className="text-gray-700 hover:text-green-500 py-2">Avantages</a>
            <a href="/" className="text-gray-700 hover:text-green-500 py-2">Tarifs</a>
            <a href="/" className="text-gray-700 hover:text-green-500 py-2">Contactez-Nous</a>
            <div className="mt-4">
              {session ? (
                <ButtonSignOut />
              ) : (
                <ButtonProvider />
              )}
            </div>
          </div>
        )}
      </nav>

  )
}
