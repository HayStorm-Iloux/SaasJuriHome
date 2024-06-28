"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"

export default function ButtonSignOut() {
  const router = useRouter()

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  return (
    <div className="flex items-center justify-end lg:mt-0 p-3">
      <Button onClick={handleSignOut} className="bg-green-600 hover:bg-green-700 text-white flex items-center">
        <LogOut />
        <span className="hidden lg:block ml-2">Déconnexion</span>
      </Button>
    </div>
  )
}