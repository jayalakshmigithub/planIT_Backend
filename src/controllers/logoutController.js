import { BlacklistedModel } from "../model/blackListedTokens.js";
import httpStatus from '../utils/functions/httpStatus.js'

const logoutUser = async(req,res)=>{

    const {refreshtoken} = req.body;
    if(!refreshtoken){
        return res.status(httpStatus.NOT_FOUND).json({message:"Please provide refresh token"});
    }
    try {
    const tokenExpiry = new Date();
    tokenExpiry.setDate(tokenExpiry.getDate() + 7); 

    await BlacklistedModel.create({ token: refreshtoken, expiresAt: tokenExpiry });

    return res.status(httpStatus.OK).json({ message: "Logged out successfully" });
        
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Failed to logout user" });
   
    }
}

export default logoutUser