"use client"
import { useState } from "react";
import Sidebar from "./Siderbar";

export default function NavBar(){
    const [openSiderBar,setOpenSiderBar] = useState(false)
    return(
        <div className=" p-12  fixed top-0 w-[100vw] bg-[#14467a] h-[12vh] flex justify-between items-center  ">
            <div className="flex gap-2 items-center">
                <img className="w-8 h-8"
                src='/logo.png' alt="logo roomwise" />
                <label className="text-amber-50 text-4xl font-bold">RoomWise-Admin</label>
            </div>
            <div className="justify-center flex gap-2 items-center ">
                <button 
                className="bg-white h-12 p-2 text-[#14467a] rounded-xl hover:bg-black/50 hover:text-white "
                onClick={()=>setOpenSiderBar(!openSiderBar)}>
                    {openSiderBar?"Fermer le  menu":"Ouvrir le menu"}
                </button>
            </div>
            <Sidebar isOpen={openSiderBar} onClose={()=>{setOpenSiderBar(false)}}/>
        </div>
    )
}