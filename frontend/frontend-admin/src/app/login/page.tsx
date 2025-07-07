"use client";
import { useState } from "react";
import { loginAdmin } from "../api/apiServices";

import { useRouter } from "next/navigation";

export default function Login() {
    const [adminData, setAdminData] = useState({ email: '', password: ''});
    const router = useRouter();

    const [message, setMessage] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const user = await loginAdmin(adminData);
      router.push('/'); // redirige vers la page protégée
    } catch (err: any) {
        console.error(err);
        setMessage("Échec de la connexion");
    }
    };

  return (
    <div className="flex items-center h-[100vh] gap-4 flex-col justify-center  bg-[#14467a] text-white">
        <div className="flex gap-2   items-center">
                <img className="w-8 h-8"
                src='/logo.png' alt="logo roomwise" />
                <label className="text-amber-50 text-4xl font-bold">RoomWise</label>
        </div>
      <form onSubmit={handleSubmit} className="bg-white text-[#14467a] p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Connexion Admin</h2>

        {message && <div className="mb-4 text-red-500 text-sm text-center">{message}</div>}

        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={adminData.email}
            onChange={handleChange}
            placeholder="Entrer votre adresse mail"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14467a]"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block font-medium mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            value={adminData.password}
            onChange={handleChange}
            placeholder="Entrer votre mot de passe"
            className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#14467a]"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#14467a] hover:bg-[#0e355c] text-white p-3 rounded-xl font-semibold transition-colors"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
