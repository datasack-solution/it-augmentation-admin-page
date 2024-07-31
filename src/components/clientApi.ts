import { ClientRecord } from "@/util/util";
import axios from "axios";

interface ClientAPI{
    getClients:()=>Promise<ClientRecord[]>
    updateClient:(clientRecord:ClientRecord)=>Promise<void>
    deleteClient: (clientEmail:string)=>Promise<void>
}

// const url = 'https://it-augmentation-server.vercel.app'
const url = 'http://localhost:4000'

class ClientAPIService implements ClientAPI{
   async getClients (): Promise<ClientRecord[]>{
        const res = await axios.get(`${url}/clients`)
        return res.data
    }
   async updateClient (clientRecord: ClientRecord):Promise<void>{
    return await axios.put(`${url}/clients/${clientRecord.email}`,clientRecord)
   }
   async deleteClient (clientEmail: string): Promise<void>{
    return await axios.delete(`${url}/clients/${clientEmail}`)
   }
}

export const clientApi = new ClientAPIService()