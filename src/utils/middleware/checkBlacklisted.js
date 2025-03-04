import { BlacklistedModel } from "../../model/blackListedTokens.js";


const checkBlacklisted = async(req,res,next)=>{
    try {
        const refreshToken = req.cookies?.userRefreshToken || req.cookies?.adminRefreshToken;
        
        if (!refreshToken) {
            return res.status(401).json({ message: "Unauthorized: No refresh token provided" });
        }

        const isBlacklisted = await BlacklistedModel.findOne({ token: refreshToken });

        if (isBlacklisted) {
            return res.status(403).json({ message: "Forbidden: Token is blacklisted" });
        }

        next(); 
    } catch (error) {
        console.error("Error checking blacklisted token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export default checkBlacklisted

