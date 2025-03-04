
import * as userServices from '../../services/userServices.js'
import constants from '../functions/constants.js';
import httpStatus from '../functions/httpStatus.js';

export const checkBlocked = async (req, res, next) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID is missing." });
        }

        const user = await userServices.getUserById(userId);

        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: constants.AUTH.USER_NOTFOUND});
        }

        if (user.isBlocked) {
            return res.status(httpStatus.FORBIDDEN).json({ message: "Your account has been blocked." });
        }

        next(); 
    } catch (error) {
        console.error("Error in checkBlocked middleware:", error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: constants.COMMON.INTERNAL_SERVER_ERROR });
    }
};