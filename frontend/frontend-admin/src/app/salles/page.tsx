"use client"
import { useState,useEffect } from "react"
import CreatePlanningForm from "../components/CreatePlanningForm"
import ClassroomStatusChart from "../components/ClassroomStatutChart"
import PlanningCard from "../components/planningCard"
import Filter from "../components/Filter"
import SalleCard from "../components/SalleCard"
import CreateSalle from "../components/CreateSalle"
import { getSalleDeClasse } from "../api/apiServices"
import ItemCountCard from "../components/ItemCountCard"

export default function SallePage(){
        const [visible,setVisible]=useState(false)
        const [OpenFilter,setOpenFilter]=useState(false)
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
        

            return(
                <div className="flex justify-between pt-12 w-[100vw] p-4">
                
                    <div className=" flex flex-col gap-4 w-fit mx-4">
                        <h1 className="text-3xl font-bold text-black text-center mt-18">Liste des salles</h1>
                        <div className="flex w-full justify-between">
                        <button
                        className=" p-4 rounded-2xl mb-4  bg-[#14467a] text-white font-semibold "
                        onClick={()=>setVisible(!visible)}>
                            {!visible?"Ajouter Une Nouvelle Salle":"Fermer le formulaire"}
                        </button>
                        <button
                        className=" p-4 rounded-2xl mb-4  bg-[#14467a] text-white font-semibold "
                        onClick={()=>setOpenFilter(!OpenFilter)}>
                            {!OpenFilter?"Filtrer le tableau":"Fermer le filtre"}
                        </button>
                        </div>
                        
                        {visible&&(
                            <div className="mb-4">
                                <CreateSalle visible={visible}/>
                            </div>
                        )}
                        {OpenFilter&&(<Filter visible={OpenFilter} />)}
            {   loading?  
                (<div>
                        <h1>Chargement des salles de classes...</h1>
                </div> ) : <div className="mt-4 w-fit">
                            <div className="w-[30vw] rounded-md  font-bold flex justify-between p-4 bg-[#14467a] text-white dark:bg-white dark:text-[#14467a] ">
                                <label>Salle</label>
                                <label>Status</label>
                                <label className="ml-20">Action</label>
                            </div>
                            <div className="overflow-y-scroll h-[70vh]">
                            {SalleData.map((s)=>(
                            <div key={s.id}>
                                <SalleCard salle={s}/>
                            </div>

                        ))}
                            </div>
                        </div>}
                    </div>
                    <div className="w-52 pt-52 h-[80vh] flex flex-col justify-between" >
                        <ItemCountCard label="Salles" nbre={SalleData.length} statut="Libre"/>
                        <ItemCountCard label="Salles" nbre={0} statut="RESERVE"/>
                        <ItemCountCard label="Salles" nbre={0} statut="OCCUPEE"/>
                        
                    </div>
                    <div className="w-[35vw] items-center pt-40"> 
                        <ClassroomStatusChart />
                    </div>
                </div>
            )
}