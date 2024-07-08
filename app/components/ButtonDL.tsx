'use client'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'

export default function ButtonDL() {
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
        <Download className=""/>
      </Button>
      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-10">
          <div>
            <Button className='w-full px-4 py-2 bg-white text-gray-700 hover:bg-gray-100 border-b border-gray-300'>Baptiste</Button>
            {[...Array(7)].map((_, index) => (
              <button
                key={index}
                type="button"
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 border-b border-gray-300"
              >
                Option {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
