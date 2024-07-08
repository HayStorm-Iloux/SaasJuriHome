'use client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import ButtonDownload from "@/app/components/ButtonDownload"
import ButtonDownload2 from "@/app/components/ButtonDownload2"
import ButtonDownload3 from "@/app/components/ButtonDownload3"
import ButtonDownload4 from "@/app/components/ButtonDownload4"
import ButtonDownload5 from "@/app/components/ButtonDownload5"

interface DownloadProps {
    id: string;
  }

export default function ButtonDL({ id }: DownloadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='relative inline-block text-left font-semibold' ref={dropdownRef}>
      <Button type="button" className="bg-orange-500 text-white rounded" onClick={toggleDropdown}>
        <Download/>
      </Button>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-10">
          <div>
          <ButtonDownload id={id}/>
          <ButtonDownload2 id={id}/>
          <ButtonDownload3 id={id}/>
          <ButtonDownload4 id={id}/>
          <ButtonDownload5 id={id}/>
          </div>
        </div>
      )}
    </div>
  )
}