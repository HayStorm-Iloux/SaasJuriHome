import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"


export default function ButtonProvider() {
  return (
    <div className="flex flex-col space-y-4">
        <Button onClick={() => signIn('google')} className="bg-green-600 hover:bg-green-700 text-white">Commencer</Button>
    </div>
  )
}
