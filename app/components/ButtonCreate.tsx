"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/actionsUsers";
import { getAllAGOs, searchAGOs } from "@/lib/actionsAGO";
import { Plus,PencilLine  } from 'lucide-react';

const CreateAGOPopup = () => {
  const [showPopup, setShowPopup] = useState(false); // State to manage popup visibility
  const [agos, setAgos] = useState<{ id: string; societeName: string | null;  userId: string; createdAt : string; }[]>([]);
  const [showAllAgos, setShowAllAgos] = useState(false);

  const fetchAGOs = async () => {
    const user = await getUser();
    if (!user) {
      return;
    }
    const searchTerm = "";
    const fetchedAgos = searchTerm ? await searchAGOs(user?.id as string, searchTerm) : await getAllAGOs(user?.id as string);
    const formattedAgos = fetchedAgos.map((ago) => ({
      ...ago,
      createdAt: ago.createdAt.toString(),
    }));
    setAgos(formattedAgos);
  };

  const handleButtonClick = async () => {
    await fetchAGOs();
    setShowPopup(true);
  };

  const toggleShowAllAgos = () => {
    setShowAllAgos(!showAllAgos);
  };

   return (
    <>
      <Button onClick={handleButtonClick}>Créer une AGO</Button>
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl ">
            <h2 className="text-2xl font-bold mb-4">Créer une AGO :</h2>
            <div className="flex justify-between gap-6">
              <div className="flex items-center flex-col justify-center w-1/2 bg-green-600  rounded-xl shadow-lg py-4 ">
                <h3 className="text-xl font-semibold mb-2">Nouvelle AGO :</h3>
                <Link href="/dashboard/notes/createAGO">
                  <Button className='bg-white border-2 border-gray-700 hover:bg-[#f7e0c3] w-[100px] h-[100px] rounded-xl text-green-600 hover:text-gray-800'><Plus size={60}/></Button>
                </Link>
              </div>
              <div className="flex flex-1 flex-col w-1/2 bg-green-600  rounded-xl shadow-lg p-4">
                <h3 className="text-xl font-semibold mb-2 text-center">À partir :</h3>
                {agos.length > 0 ? (
                  <ul className={`max-h-48 overflow-y-auto hideScrollbar`}>

                    {agos.map((ago) => (
                      
                      <li key={ago.id} className="flex justify-between items-center border-2 bg-white mb-2 border-gray-700 rounded-lg p-2 text-gray-900 font-semibold hover:bg-[#f7e0c3]">
                        <Link href={`/dashboard/notes/createAGO/${ago.id}`} className='w-full '>
                          <div className='flex items-center justify-between'>
                            <div className='flex flex-col'>
                              <span>{ago.societeName}</span>
                              <p className="text-sm text-muted-foreground">
                                écrit le{" "}
                                {new Intl.DateTimeFormat("fr-FR", {
                                  dateStyle: "full",
                                }).format(new Date(ago.createdAt))}
                              </p> 
                            </div>
                            <div className=''>
                              <PencilLine size={25} className='text-gray-800 mr-2'/>
                            </div>
                          </div>
                          
                        </Link>
                      </li>
                      
                    ))}
                  </ul>
                ) : (
                  <p>Aucune AGO existante</p>
                )}
              </div>
            </div>
            <Button onClick={() => setShowPopup(false)} className="mt-6">Fermer</Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateAGOPopup;