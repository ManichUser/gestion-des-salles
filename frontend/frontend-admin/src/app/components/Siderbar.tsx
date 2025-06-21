"use client";
import Link from "next/link";
import { deleteCookie } from "cookies-next";
const logout = () => {
  deleteCookie("token");
  window.location.href = "/login";
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <div
      className={`fixed inset-0  bg-black/30 z-30 transition-opacity ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
      onClick={onClose}
    >
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#14467a] shadow-lg transform transition-transform ${
          isOpen ? "-translate-x-0" : "translate-x-full"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className=" text-white  font-bold text-lg">Menu</h2>
          <button onClick={onClose} className="text-white  font-bold" >✕</button>
        </div>
        <nav className="flex flex-col p-4  space-y-4">
        <Link href="/" className="font-bold text-xl text-white">
          Dashboard
        </Link> 
        {["Utilisateurs", "Salles","Planning", "Notifications", "Rapports"].map((link) => (
              <h2 key={link}>
                <Link href={`/${link.toLowerCase()}`} className=" font-bold text-xl text-white">
                  {link}
                </Link>
              </h2>
            ))}
        <label onClick={()=>logout()} className="font-bold text-lg text-center mt-44 text-red-600">
            Deconnexion
        </label> 
        </nav>
      </aside>
    </div>
  );
}
