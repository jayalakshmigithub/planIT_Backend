
import * as adminServices from '../services/adminServices.js'
import { generateTokens } from "../utils/jwt/generateToken.js";
import { comparePassword, hashPassword } from '../utils/functions/password.js';
import httpStatus from '../utils/functions/httpStatus.js';



const adminLogin = async(req,res)=>{
    try {
        const {email , password} = req.body;
        let admin = await adminServices.getAdminByEmail(email)
        if(!admin){
            return res.status(httpStatus.BAD_REQUEST).json({message:"invalid email"})
        }

        const isPasswordValid = await comparePassword(password,admin.password)
        if(!isPasswordValid){
            return res.status(httpStatus.BAD_REQUEST).json({message:"invalid password"})
        }

        const adminId = admin._id
        const {accessToken,refreshToken} = generateTokens(res,{
            userId:adminId,
            userRole:'admin'
        })
        return res.status(httpStatus.OK).json({admin,accessToken,refreshToken})
    } catch (error) {
        console.error(error.message)
        return res.status(httpStatus.BAD_REQUEST).json({message:'intrnal server error'});
        
    }
}


const usersList = async(req,res)=>{
    try {
        const users = await adminServices.getAllUsers()
        return res.status(httpStatus.OK).json(users)
    } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
    }
}


const blockUserAccount = async(req,res)=>{
    console.log('hiii in blockedUserAcc')
    const { _id } = req.body; 
  if (!_id) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID is required" });
  }
  
  try {
    const blockedUserAcc = await adminServices.getBlockUsers(_id); 
    console.log('blocked user',blockedUserAcc)
    if (!blockedUserAcc) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
    return res.status(httpStatus.OK).json(blockedUserAcc);
  } catch (error) {
    console.error("Error in blockUserAccount controller:", error.message);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
}

const unblockUserAccount = async(req,res)=>{
    const {_id} = req.body
    if(!_id){
        return res.status(httpStatus.BAD_REQUEST).json({message:'user id is required'})
    }
    try {
        const unblockedUserAcc = await adminServices.getUnblockUser(_id)
        if(!unblockedUserAcc){
            return res.status(httpStatus.NOT_FOUND).json({message:'usernot found'})
        }else{
            return res.status(httpStatus.OK).json(unblockedUserAcc)

        }
        
    } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:"internal server error"})
        
    }
}

const workspaceList = async(req,res)=>{
    try {
        const workspaceListInAdmin = await adminServices.getAllworkspacesAdmin()
        return res.status(httpStatus.OK).json(workspaceListInAdmin)
    } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
        
    }

}

const projectList = async(req,res)=>{
    try {
        const projectListInAdmin = await adminServices.getAllProjects()
        console.log(projectListInAdmin,'projectListInAdmin')
        return res.status(httpStatus.OK).json(projectListInAdmin)
    } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
    }
}

//chckng accessibity
const listWorkspace = async(req,res)=>{
    const {workspaceId} = req.body
    try {
        const listedWorkspace = await adminServices.listWorkspace(workspaceId)
        return res.status(httpStatus.OK).json(listedWorkspace)
        
    } catch (error) {
        console.log(error.message)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'internal server error'})   
    }
}

const delistWorkspace = async(req,res)=>{
    const {workspaceId} = req.body
    try {
        const delistedWorkspace = await adminServices.delistedWorkspace(workspaceId)
        return res.status(httpStatus.OK).json(delistedWorkspace)
    } catch (error) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({message:'internal server error'})
    }
}

export{
    adminLogin,
    usersList,
    blockUserAccount,
    unblockUserAccount,
    workspaceList,
    projectList,
    listWorkspace,
    delistWorkspace

  
}

