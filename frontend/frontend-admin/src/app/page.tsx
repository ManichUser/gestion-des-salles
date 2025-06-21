"use client"
// import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend } from "recharts";
import { Building2, CalendarCheck, AlertTriangle } from "lucide-react";
import * as Select from "@radix-ui/react-select";
import { useEffect, useState } from "react";
import { getSalleDeClasse } from "./api/apiServices";

const COLORS = ["#4ade80", "#60a5fa", "#f87171"]; // vert, bleu, rouge


export default function AdminPage() {
  const [selectedRoom, setSelectedRoom] = useState("Salle 101");

  // Simule des données différentes selon la salle
  const statsPerRoom = {
    "Salle 101": { tauxOccupation: 75, tauxReservation: 60, tauxConflit: 8 },
    "Salle 102": { tauxOccupation: 50, tauxReservation: 30, tauxConflit: 12 },
    "Salle 103": { tauxOccupation: 90, tauxReservation: 80, tauxConflit: 5 },
  };

  const stats = statsPerRoom[selectedRoom];

  const pieData = [
    { name: "Occupation", value: stats.tauxOccupation },
    { name: "Réservation", value: stats.tauxReservation },
    { name: "Conflit", value: stats.tauxConflit },
  ];
  const [SalleData,setSalleData]=useState<any[]>([])
  const [loading, setLoading] = useState(true);
  useEffect(() => {
      const fetchSalles = async () => {
        try {
          const data = await getSalleDeClasse();
          
          setSalleData(data);
        } catch (err) {
          console.error("Erreur lors de la récupération des salles :", err);
          alert("erreur")
        } finally {
          setLoading(false);
        }
      };
  
      fetchSalles();
    }, []);
  return (
    <div className="p-6 pt-40 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Tableau de bord</h1>
        {/* Sélecteur de salle */}
        <Select.Root value={selectedRoom} onValueChange={setSelectedRoom}>
          <Select.Trigger className="border px-4 py-2 rounded-md bg-white text-black dark:bg-gray-800 dark:text-white">
            Choisir une autre salle: <Select.Value />
          </Select.Trigger>
          <Select.Content className="bg-white h-[30vw] overflow-y-scroll mt-[40vw] w-44 dark:bg-gray-800 border rounded-md shadow-lg">
            {SalleData.map((room) => (
              <Select.Item key={room.id} value={room.nom} className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                {room.nom}
              </Select.Item>
            ))}
          </Select.Content>
      </Select.Root>
      </div>

      <h2 className="text-lg text-gray-500 dark:text-gray-300 mb-8">
        Suivi d'occupation, réservation et conflits - <strong>{selectedRoom}</strong>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Occupation */}
        <div className="shadow-xl rounded-2xl">
          <div className="p-6 flex items-center space-x-4">
            <Building2 className="text-green-500 w-8 h-8" />
            <div>
              <h3 className="text-xl font-semibold">Taux d'occupation</h3>
              <p className="text-sm mt-1">{stats.tauxOccupation}% des créneaux sont occupés</p>
            </div>
          </div>
        </div>

        {/* Carte Réservation */}
        <div className="shadow-xl rounded-2xl">
          <div className="p-6 flex items-center space-x-4">
            <CalendarCheck className="text-blue-500 w-8 h-8"  />
            <div>
              <h3 className="text-xl font-semibold">Taux de réservation</h3>
              <p className="text-sm mt-1">{stats.tauxReservation}% des créneaux sont réservés</p>
            </div>
          </div>
        </div>

        {/* Carte Conflit */}
        <div className="shadow-xl rounded-2xl">
          <div className="p-6 flex items-center space-x-4">
            <AlertTriangle className="text-red-500 w-8 h-8" />
            <div>
              <h3 className="text-xl font-semibold">Taux de conflit</h3>
              <p className="text-sm mt-1">{stats.tauxConflit}% de tentatives en conflit</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graphique camembert */}
      <div className="mt-12 flex justify-center">
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}
