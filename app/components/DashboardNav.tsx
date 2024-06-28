'use client'
import { NotebookPen, Settings,CreditCard,Image,KeyRound   } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation"
import ButtonSignOut from './ButtonSignOut';



export default function DashboardNav() {

  const pathname = usePathname()

  const menuDashboard = [
    { name: "Notes", icon: NotebookPen, path: "/dashboard/notes" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
    { name: "Paiement", icon: CreditCard , path: "/dashboard/payment" },
  ];


  return (
    <nav className="flex flex-row md:flex-col md:h-full md:w-16 w-full lg:w-48 gap-2 px-4">
      <div className='flex flex-row md:flex-col items-center flex-grow'>
        {menuDashboard.map((link, index) => {
          const isActive = pathname.startsWith(link.path);
          return (
            <Link href={link.path} key={index} passHref>
              <div className={`flex items-center justify-center lg:justify-start gap-2 cursor-pointer lg:p-3 p-3 hover:bg-green-600 hover:bg-opacity-50 hover:text-white text-sm font-bold rounded-md ${isActive && "bg-green-600 text-white"}`}>
                <link.icon className='w-4' />
                <span className="hidden lg:block">{link.name}</span>
              </div>
            </Link>
          )
        })}
      </div>
      <div className="flex justify-end md:justify-center w-full">
        <ButtonSignOut />
      </div>
    </nav>
  );
}