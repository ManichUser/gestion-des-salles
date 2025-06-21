"use client"

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";

// Couleurs basées sur l'image fournie (Bleu, Vert, Gris)
const COLORS = ["#3b82f6", "#22c55e", "#6b7280"]; // bg-blue-500, bg-green-500, bg-gray-500

export default function ClassroomStatusChart() {
  // Données simulées basées sur l'image fournie (42% Réservé, 45% Libre, 13% Conflit)
  const [data, setData] = useState([
    { name: "Réservé", value: 0 },
    { name: "Libre", value: 100 },
    { name: "Occupee", value: 0 },
  ]);

  // Optionnel: Pourrait charger des données réelles ici ou les passer par props
  useEffect(() => {
    // Par exemple, si vous vouliez simuler un chargement de données asynchrone:
    // setTimeout(() => {
    //   setData([
    //     { name: "Réservé", value: 40 },
    //     { name: "Libre", value: 50 },
    //     { name: "Conflit", value: 10 },
    //   ]);
    // }, 1000);
  }, []);

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg dark:bg-gray-800 dark:text-white max-w-lg mx-auto my-8">
      <h2 className="text-2xl font-bold text-center mb-6 text-[#14467a] dark:text-white">
        Statut des Salles de Classe
      </h2>

      {/* ResponsiveContainer pour s'assurer que le graphique s'adapte à la taille de son parent */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={120} // Taille du camembert
            innerRadius={70} // Crée un effet de "donut"
            fill="#8884d8" // Couleur par défaut (sera remplacée par les couleurs des cellules)
            dataKey="value"
            // Ajoute des étiquettes directement sur les tranches
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            labelLine={false} // Ne pas afficher les lignes des étiquettes
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          {/* Affiche une info-bulle au survol des tranches */}
          <Tooltip formatter={(value) => `${value}%`} />
          {/* Affiche la légende en dessous du graphique */}
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-8 text-center text-gray-700 dark:text-gray-300">
        <p>Ce graphique représente l'état actuel des créneaux horaires des salles de classe :</p>
        <ul className="list-disc list-inside mt-2 mx-auto inline-block text-left">
          <li><span className="font-semibold" style={{ color: COLORS[0] }}>Réservé :</span> Créneaux déjà alloués et planifiés.</li>
          <li><span className="font-semibold" style={{ color: COLORS[1] }}>Libre :</span> Créneaux disponibles pour de nouvelles réservations.</li>
          <li><span className="font-semibold" style={{ color: COLORS[2] }}>Occupee :</span> Créneaux où les salles de classes sont occupees.</li>
        </ul>
        <p className="mt-4 text-sm italic">
          Les pourcentages sont basés sur les données les plus récentes disponibles.
        </p>
      </div>
    </div>
  );
}
