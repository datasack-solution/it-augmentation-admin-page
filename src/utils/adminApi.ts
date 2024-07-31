import axios, {Axios, AxiosResponse} from 'axios'

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
    // signout:(email:string)=>Promise<AxiosResponse>
}

const BASE_URL = "https://it-augmentation-server.vercel.app"
// const BASE_URL = "http://localhost:4000"

class UserAPIService implements UserAPI{
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
 
     async updateAdmin (email:string,password:string,userName:string):Promise<AxiosResponse>{
         return await axios.put(`${BASE_URL}/update-user`,{
            email,password,userName
         })
     }

    //  async signout (email:string):Promise<AxiosResponse>{
    //     return await axios.post(`${BASE_URL}/signout`,{email},{withCredentials:true})
    //  }
 }
 

export const adminApi = new UserAPIService()