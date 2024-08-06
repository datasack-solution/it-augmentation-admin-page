import { Admin } from '@/utils/adminApi';
import { Describe, enums, min, object, optional, refine, string } from 'superstruct';


const emailPattern = /^[a-zA-Z0-9._%+-]+@datasack\.in$/;

export const emailValidation = refine(string(),'email', (email:string) => {
    if (typeof email !== 'string') {
      return 'Email must be a string';
    }
    if (!emailPattern.test(email)) {
      return 'Email must be from datasack.in domain!';
    }
    return true;
  });

const passwordValidation = refine(string(),'password',(password:string)=>{
    if (password.length<3){
        return 'Password length should not be less than 3'
    }
    return true
})
  
const userNameSchema = refine(string(),'userName',(userName:string)=>{
    if (userName==''){
        return 'User Name should not be empty'
    }
    return true
})

export const adminSchema:Describe<Admin> = object({
    email:emailValidation,
    password:passwordValidation,
    userName:userNameSchema,
    role:optional(enums(['admin','user']))
})