import bcrypt from 'bcryptjs';

export const hashPassword = async(password)=>{
   let securePassword=await bcrypt.hash(password,10)
   return securePassword
}

export const comparePassword = async(password,hashPassword)=>{
   return await bcrypt.compare(password,hashPassword)
}