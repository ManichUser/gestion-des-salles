"use client"

import { useState } from "react"


export default  function Filter ({ visible })  {
    return (

    <div className={`
        transition-all duration-500 ease-in-out transform
        ${visible ? 'max-h-screen opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-4 overflow-hidden'}
        `}>
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white mt-4">
            <h2 className="text-2xl font-bold text-[#14467a] dark:text-white mb-4">Options de filtrage</h2>
            <p className="text-gray-700 dark:text-gray-300">
            Utilisez les options ci-dessous pour affiner l'affichage des plannings.
            </p>
          {/* Ici se trouveraient les champs réels de filtrage */}
          <div className="mt-4 space-y-4">
              <label htmlFor="filter-date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par date:</label>
              <input id="filter-date" type="date" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
  
              <label htmlFor="filter-room" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrer par salle:</label>
              <select id="filter-room" className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <option value="">Toutes les salles</option>
                  <option value="Salle 101">Salle 101</option>
                  <option value="Salle 102">Salle 102</option>
                  <option value="Salle 103">Salle 103</option>
              </select>
          </div>
          <button className="mt-6 w-full p-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors duration-200">
            Appliquer les filtres
          </button>
        </div>
      </div>
    );
  };
  