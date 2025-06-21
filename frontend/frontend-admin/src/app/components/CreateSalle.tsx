"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { postSalleDeClasse } from "../api/apiServices"

export default function CreateSalle( {visible}){
    const [formData,setFormData]=useState({
        nom:"",
        statut:"Libre"
        })
        const router= useRouter()
        const handleChange=(
            e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>
        )=>{
            const {name, value}=e.target
            setFormData((prev)=>({...prev,[name]:value?.toString().toLocaleUpperCase()}))
        }
        const handleSubmit= async (e: React.FormEvent)=>{
            e.preventDefault()
            try{
                const reponse=await postSalleDeClasse(formData);
                alert("Ajout effectuer avec succes:"+reponse)
                router.push('/salles')
            } catch (err:any){
                alert("l'ajout a echoue "+err?.toString())
            }
        }
    return (
        <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800 dark:text-white mt-4">
            <form className="flex gap-8 " 
            onSubmit={handleSubmit}
            >
                

                <div className="flex flex-col gap-4">
                    <label>Salles</label>
                    <input  
                    type="text" 
                    value={formData.nom.toLocaleUpperCase()} 
                    id="entrer-Salle" 
                    name="nom"
                    placeholder="Nom salle de classe"
                    onChange={handleChange}
                    className=" border rounded px-3 py-2"
                    />
                </div>
     
                <div className="flex flex-col gap-4">
                    <label>statut</label>
                    <input  
                    type="text" 
                    name="statut" 
                    id="entrer-statut" 
                    value={formData.statut.toLocaleUpperCase()}
                    onChange={handleChange}
                    className=" border  rounded px-3 py-2"
                    />
                </div>
                <div className="flex flex-col gap-4 justify-center">
                    <input className="rounded-lg  text-white bg-[#14467a] p-1" type="submit" value="Ajouter" />
                    <input className="rounded-lg  text-white bg-[#14467a] p-1" type='reset' value="Annuler" />
                </div>
                
            </form>
        </div>
    )
}