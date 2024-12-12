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
    addClient: (clientRecord:ClientRecord)=>Promise<void>
}

const  BASE_URL = process.env.NODE_ENV=='development'?'http://localhost:4000':'https://it-augmentation-server.vercel.app' 

class ClientAPIService implements ClientAPI{
   async getClients (): Promise<ClientRecord[]>{
        const res = await axios.get(`${BASE_URL}/clientsNew`)
        return res.data.map((client: ClientRecord) => ({
            ...client,
            createdAt: client.createdAt ? new Date(client.createdAt) : undefined,
        }));
    }
    
   async updateClient (clientRecord: ClientRecord):Promise<void>{
    return await axios.put(`${BASE_URL}/clientsNew/${clientRecord.email}`,clientRecord)
   }

   async addClient (clientRecord: ClientRecord):Promise<void>{
    return await axios.post(`${BASE_URL}/clientsNew`,clientRecord)
   }

   async deleteClient (clientEmail: string): Promise<void>{
    return await axios.delete(`${BASE_URL}/clientsNew/${clientEmail}`)
   }
}

export const clientApi = new ClientAPIService()