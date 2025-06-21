"use client"

export default function ItemCountCard({label,nbre,statut}:{label:string,nbre:number,statut:string}){
    return (
        <section className="  w-full  ">
        <div className="   mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white w-52 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {label}
                </h3>
                    <p className="text-sm font-bold text-gray-600">{nbre}{" "+statut}</p>
            </div>
   
        </div>
      </section>
    )
}