'use client'
import { NotebookPen, Settings,CreditCard,Handshake  } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation"
import ButtonSignOut from './ButtonSignOut';



export default function DashboardNav() {

  const pathname = usePathname()

  const menuDashboard = [
    { name: "AGO", icon: NotebookPen, path: "/dashboard" },
    { name: "AGE", icon: NotebookPen, path: "/dashboard/age" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    { name: "Paiement", icon: CreditCard , path: "/dashboard/payment" },
  ];


  return (
    <nav className="fixed flex flex-row sm:flex-col items-center sm:items-start ">
      <div className='flex items-center mb-4 text-xl font-semibold w-full mt-4'>
          <div className='flex mx-auto mr-1 my-auto'>
            <img src="/logo3.png" alt="logo site" className="w-12 rounded-lg shadow-lg" />
          </div>
          <div className='hidden lg:block'>
            Juri<span className="text-green-700">Home</span>
          </div>
      </div>
      <div className='flex flex-row sm:flex-col w-full'>
        {menuDashboard.map((link, index) => {
          const isActive = pathname.endsWith(link.path);
          return (
            <Link href={link.path} key={index} passHref>
              <div className={`flex items-center justify-center lg:justify-start gap-2 cursor-pointer p-3 hover:bg-green-600 hover:bg-opacity-50 hover:text-white text-sm font-bold rounded-md ${isActive && "bg-green-600 text-white"}`}>
                <link.icon className='w-4' />
                <span className="hidden lg:block">{link.name}</span>
              </div>
            </Link>
          );
        })}
      </div>
      <div className="ml-2 sm:ml-0 mt-0 sm:mt-2 ">
        <ButtonSignOut />
      </div>
    </nav>
  );
}