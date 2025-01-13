
import * as userServices from '../../services/userServices.js'

export const checkBlocked = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(400).json({ message: "User ID is missing." });
        }

        const user = await userServices.getUserById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isBlocked) {
            return res.status(403).json({ message: "Your account has been blocked." });
        }

        next(); 
    } catch (error) {
        console.error("Error in checkBlocked middleware:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};