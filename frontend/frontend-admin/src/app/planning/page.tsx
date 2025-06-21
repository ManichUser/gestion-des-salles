
"use client" 

import { useState } from "react"
import CreatePlanningForm from "../components/CreatePlanningForm";
import  Filter from "../components/Filter";
import {  PlanningData,getSalleNomById } from "../data/Planning";
import  PlanningCard from "../components/planningCard";


export default function PlanningPage() {
    const [visible, setVisible] = useState(false); // État pour la visibilité du formulaire d'ajout
    const [OpenFilter, setOpenFilter] = useState(false); // État pour la visibilité du filtre
  
    return (
      <div className="min-h-screen pt-12  bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <h1 className="text-4xl font-extrabold text-center mt-8 mb-8 text-[#14467a] dark:text-white">
            Occupation des salles
          </h1>
  
          <div className="flex flex-col sm:flex-row w-full justify-center sm:justify-end gap-4 mb-8">
            {/* Bouton pour ajouter un nouveau planning */}
            <button
              className="
                flex-1 sm:flex-none p-4 rounded-xl shadow-lg
                bg-[#14467a] text-white font-semibold
                hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300
                transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
              "
              onClick={() => {
                setVisible(!visible);
                setOpenFilter(false); // Ferme le filtre si le formulaire s'ouvre
              }}
            >
              {!visible ? "Ajouter un nouveau planning" : "Fermer le formulaire"}
            </button>
  
            {/* Bouton pour filtrer le tableau */}
            <button
              className="
                flex-1 sm:flex-none p-4 rounded-xl shadow-lg
                bg-blue-500 text-white font-semibold
                hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300
                transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95
              "
              onClick={() => {
                setOpenFilter(!OpenFilter);
                setVisible(false); // Ferme le formulaire si le filtre s'ouvre
              }}
            >
              {!OpenFilter ? "Filtrer le tableau" : "Fermer le filtre"}
            </button>
          </div>
  
          {/* Conteneur pour le formulaire d'ajout avec animation */}
          {visible && (
            <div className="mb-6">
              <CreatePlanningForm visible={visible} />
            </div>
          )}
  
          {/* Conteneur pour le filtre avec animation */}
          {OpenFilter && (
            <div className="mb-6">
              <Filter visible={OpenFilter} />
            </div>
          )}
  
          {/* Section du tableau des plannings */}
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
            {/* En-tête du tableau (caché sur mobile, affiché sur sm+) */}
            <div className="
              hidden sm:flex w-full font-bold justify-between p-4
              bg-[#14467a] text-white dark:bg-gray-700 dark:text-white
              border-b border-gray-700 dark:border-gray-600
            ">
              <label className="min-w-[80px] text-left">Date</label>
              <label className="min-w-[280px] text-center">Horaire</label>
              <label className="flex-1 text-left">Salle</label>
              <label className="flex-1 text-left">Filière</label>
              <label className="flex-1  text-left">Niveau</label>
              <label className="min-w-[120px] text-right">Action</label>
            </div>
  
            {/* Liste des plannings */}
            {PlanningData.map((p) => (
              <PlanningCard key={p.id} planning={p} />
            ))}
          </div>
        </div>
      </div>
    );
  }