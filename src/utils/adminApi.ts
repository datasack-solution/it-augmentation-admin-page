import axios, { AxiosResponse} from 'axios'

export interface Admin{
    email:string,
    password:string,
    userName:string,
    role?:"admin"|"user"
}

export interface UserAPI{
    authToken:(token:string)=>Promise<AxiosResponse>;
    login:(user:Admin)=>Promise<AxiosResponse>
    sendOTP:(email:string,accountVerification:boolean)=>Promise<AxiosResponse>
    verifyOTP:(email:string,otp:string)=>Promise<AxiosResponse>
    resetPassword:(email:string,password:string)=>Promise<AxiosResponse>
    updateAdmin:(admin:Admin)=>Promise<AxiosResponse>
    createAdmin:(user:Admin)=>Promise<AxiosResponse>
    deleteAdmin:(email:string)=>Promise<AxiosResponse>
    getAllUsers:()=>Promise<{
        message:string,
        success:string,
        users:Admin[]
     }>
}

const  BASE_URL = process.env.NODE_ENV=='development'?'http://localhost:4000':'https://it-augmentation-server.vercel.app' 

class UserAPIService implements UserAPI{
    async createAdmin (user:Admin): Promise<AxiosResponse>{
        return await axios.post(`${BASE_URL}/signup-email`,{...user},{withCredentials:true,headers:{
            "Content-Type":"application/json"
        }})
    }
     async login (user:Admin): Promise<AxiosResponse>{
         return await axios.post(`${BASE_URL}/signin-email`,{...user},{withCredentials:true,headers:{
             "Content-Type":"application/json"
         }})
     }

     async authToken (token:string):Promise<AxiosResponse>{
         return await axios.post(`${BASE_URL}/auth-user`,{},{withCredentials:true,headers:{
             "Content-Type":"application/json",
             "Authorization":`Bearer ${token}`
         }})
     }
 
     async sendOTP (email:string,accountVerification:boolean):Promise<AxiosResponse>{
         return await axios.post(`${BASE_URL}/send-otp`,{email,accountVerification})
     }

     async verifyOTP (email:string,otp:string):Promise<AxiosResponse>{
        return await axios.post(`${BASE_URL}/verify-otp`,{email,otp})
    }
 
     async resetPassword (email:string,password:string):Promise<AxiosResponse> {
         return await axios.put(`${BASE_URL}/reset-password`,{email,password})
     }
 
     async updateAdmin (admin:Admin):Promise<AxiosResponse>{
         return await axios.put(`${BASE_URL}/update-user`,{
            ...admin
         })
     }

     async deleteAdmin (email:string):Promise<AxiosResponse>{
        return await axios.delete(`${BASE_URL}/delete-user/${email}`)
     }

     async getAllUsers ():Promise<{
        message:string,
        success:string,
        users:Admin[]
     }>{
        const res =await axios.get(`${BASE_URL}/get-users`)
        return res.data
     }
 }
 

export const adminApi = new UserAPIService()