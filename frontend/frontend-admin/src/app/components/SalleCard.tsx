"use client"

import React from "react";
import { deleteSalleDeClasse } from "../api/apiServices";

type Salle = {
    id: number;
    nom: string;
    statut: string;
  };
export default function SalleCard( {salle}:{salle:Salle}){
    
    const handleDelete=async (e:React.FormEvent)=>{
        e.preventDefault()
        try{
            const reponse = await deleteSalleDeClasse(salle.id);
            alert("suppression effectuer de :"+ salle + reponse)
        }catch (err:any) {
            alert("suppression echouer : "+ err?.toString())
        }
    }

    return (
            
      <div className="
      flex flex-col sm:flex-row justify-between items-start sm:items-center
      p-4 border-b border-gray-200 dark:border-gray-700
      hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200
      last:border-b-0 // Supprime la bordure inférieure de la dernière carte
    ">
      {/* Chaque span devient un bloc sur mobile pour une meilleure lisibilité */}
    
      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
        <span className="sm:hidden font-bold">Salle: </span>{salle.nom}
      </span>
  
      <span className="flex-1 text-left text-gray-700 dark:text-gray-300 mb-1 sm:mb-0">
        <span className="sm:hidden font-bold">Statut: </span>{salle.statut}
      </span>
      {/* Conteneur des actions, devient flex-row sur mobile et s'aligne à droite sur desktop */}
      <div className="min-w-[120px] flex justify-end space-x-2 mt-2 sm:mt-0 w-full sm:w-auto">
        <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
          Éditer
        </button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm">
          Supprimer
        </button>
      </div>
    </div>
    )
}