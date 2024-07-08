"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { deleteAGO } from "@/lib/actionsAGO";

interface DeleteButtonProps {
  id: string;
}

const handleDelete = (id: string) => {
  const formData = new FormData();
  formData.append('id', id);
  deleteAGO(formData);
  toast.success("L'AGO est bien supprimée");
};

const ConfirmationPopup = ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <p className="mb-4">Êtes-vous sûr de vouloir supprimer cette AGO?</p>
        <div className="flex justify-end">
          <Button className="bg-red-500 hover:bg-red-600 text-white mr-2" onClick={onConfirm}>Oui</Button>
          <Button className="bg-gray-300 hover:bg-gray-400 text-black" onClick={onCancel}>Non</Button>
        </div>
      </div>
    </div>
  );
};

export default function ButtonDelete({ id }: DeleteButtonProps) {
  const [showPopup, setShowPopup] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const handleConfirm = () => {
    setShowPopup(false);
    handleDelete(id);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  return (
    <>
      <form onSubmit={(e) => e.preventDefault()}>
        <Input type="hidden" name="id" value={id} />
        <Button type="button" className="bg-red-500 hover:bg-red-600 text-white" onClick={handleDeleteClick}>
          <Trash2 />
        </Button>
      </form>
      {showPopup && <ConfirmationPopup onConfirm={handleConfirm} onCancel={handleCancel} />}
    </>
  );
}