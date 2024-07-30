import axios, {AxiosResponse} from 'axios'

export interface Admin{
    email:string,
    password:string,
    userName:string
}

export interface UserAPI{
    authToken:(token:string)=>Promise<AxiosResponse>;
    login:(user:Admin)=>Promise<AxiosResponse>
    sendOTP:(email:string,accountVerification:boolean)=>Promise<AxiosResponse>
    verifyOTP:(email:string,otp:string)=>Promise<AxiosResponse>
    resetPassword:(email:string,password:string)=>Promise<AxiosResponse>
    updateAdmin:(email:string,password:string,userName:string)=>Promise<AxiosResponse>
}

const BASE_URL = "https://it-augmentation-server.vercel.app"

class UserAPIService implements UserAPI{ 
     async login (user:Admin): Promise<AxiosResponse>{
         return await axios.post(`${BASE_URL}/signin-email`,{...user},{withCredentials:true,headers:{
             "Content-Type":"application/json"
         }})
     }

     async authToken ():Promise<AxiosResponse>{
         return await axios.post(`${BASE_URL}/auth-user`,{},{withCredentials:true,headers:{
             "Content-Type":"application/json"
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
 
     async updateAdmin (email:string,password:string,userName:string):Promise<AxiosResponse>{
         return await axios.put(`${BASE_URL}/update-user`,{
            email,password,userName
         })
     }
 }
 

export const adminApi = new UserAPIService()