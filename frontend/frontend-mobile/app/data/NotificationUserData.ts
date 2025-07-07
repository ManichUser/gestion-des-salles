export interface Notification{
    id:string,
    title:string,
    idSender:string,
    description:string,
    type:'PASSIF'|'ACTIF',
    idReceive:string|string[],
    statusNotification:StatusNotification[],
}
interface StatusNotification{
    idUser:string,
    value:'Lue'|'Non Lue'
}

export const sampleNotifData:Notification[]=[
    {
        id: "n1",
        title: "Confirmation reservation",
        idSender: "1",
        description: "Le délégué X souhaite réserver la salle Y le [date, horaire]. Veuillez confirmer.",
        type: 'ACTIF',
        idReceive: "2",
        statusNotification: [
            {
                idUser: "2",
                value: "Lue"
            }
        ]
    },
    {
        id: "n2",
        title: "Notification",
        idSender: "1",
        description: "Votre demande de réservation de la salle Y le [date, horaire] est en attente de confirmation.",
        type: "PASSIF",
        idReceive: "2",
        statusNotification: [
            {
                idUser: '2',
                value: "Lue"
            }
        ]
    },
    {
        id: "n3",
        title: "Important",
        idSender: "SYSTEM",
        description: "Resercation de la salle A pour votre cours le [date, horaire]",
        type: "PASSIF",
        idReceive: ["1", "2"],
        statusNotification: [
            {
                idUser: "2",
                value: "Non Lue"
            },
            {
                idUser: "1",
                value: "Lue"
            }
        ]
    }
]
export function changeStatus(indexNotif:number,indexNotifUser:number){
    sampleNotifData[indexNotif].statusNotification[indexNotifUser].value='Lue'
    console.log('Fait')
}
export function consulter(idNotif:string,idUser:string):boolean{
    const notification=sampleNotifData.find((notif)=>notif.id===idNotif)
    const statusNotifForUser=notification?.statusNotification.find((statut)=>statut.idUser===idUser)
    if(statusNotifForUser?.value==='Lue'){
        const indexNotif=sampleNotifData.findIndex((notif)=>notif.id===notification?.id)
        const indexNotifUser=notification?.statusNotification.findIndex((notifStatus)=>notifStatus.idUser===statusNotifForUser.idUser)||0
        changeStatus(indexNotif,indexNotifUser)
        return true
    } 
    return false
}