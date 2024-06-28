"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2 } from "lucide-react"
import {toast} from "react-toastify"
import {deleteNote} from "@/lib/actionsNotes"

interface DeleteButtonProps {
    id: string
}

const handleSubmit = () => {
  toast.success("la Note est bien supprimée")
}

export default function ButtonDelete({id}:DeleteButtonProps) {
  return (
    <form action={deleteNote} onClick={handleSubmit}>
        <Input type="hidden" name="id" value={id}/>
        <Button type="submit" className="bg-red-500 hover:bg-red-600 text-white mt-1"><Trash2/></Button>
    </form>
  )
}
