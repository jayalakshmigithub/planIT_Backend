import * as notificationService from '../services/notificationService.js';


const getUserNotifications = async (req, res) => {
    try {
      const userId = req.user._id; 
      console.log(userId,'userId in notification controller')
  
      const notifications = await notificationService.fetchUserNotifications(userId);
  
      res.status(200).json({
        success: true,
        data: notifications,
      });
    } catch (error) {
      console.error("Error in notification controller:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to fetch notifications.",
      });
    }
  };
  
  export { getUserNotifications };