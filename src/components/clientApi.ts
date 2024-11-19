// import { ClientRecord, MainCategory, TechnologyItem } from "@/util/util";
import {  ClientRecord } from "@/util/util";
import axios from "axios";

// for test clients - arrskillsets

// export interface SkillSet1 {
//     _id:string;
//     predefinedTechData: MainCategory[];
//     customTechsData?: TechnologyItem[];
// }

// export interface ClientModel1 {
//     industry: string;
//     name: string;
//     email: string;
//     phone: string;
//     date: string;
//     requirements: string;
//     nda: boolean;
//     arrSkillsets?: SkillSet1[];
// }

// export interface ClientRecord extends ClientModel{
//     city?:string,
//     contactedChannel?:'Call'|'WhatsApp'|'VoiceMail'|'Email',
//     responded?:boolean,
//     isInterested?:boolean,
//     remarks?:string
// }




interface ClientAPI{
    getClients:()=>Promise<ClientRecord[]>
    updateClient:(clientRecord:ClientRecord)=>Promise<void>
    deleteClient: (clientEmail:string)=>Promise<void>
}

// const url = 'https://it-augmentation-server.vercel.app'
const url = 'http://localhost:4000'

class ClientAPIService implements ClientAPI{
   async getClients (): Promise<ClientRecord[]>{
        const res = await axios.get(`${url}/clientsNew`)
        return res.data
    }
   async updateClient (clientRecord: ClientRecord):Promise<void>{
    return await axios.put(`${url}/clientsNew/${clientRecord.email}`,clientRecord)
   }
   async deleteClient (clientEmail: string): Promise<void>{
    return await axios.delete(`${url}/clientsNew/${clientEmail}`)
   }
}

export const clientApi = new ClientAPIService()