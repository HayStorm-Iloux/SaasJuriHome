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
    <div className="">
      <Button onClick={handleSignOut} className="bg-green-600 hover:bg-green-700 text-white flex">
        <LogOut />
        <span className="hidden lg:block">Déconnexion</span>
      </Button>
    </div>
  )
}