import * as notificationService from '../services/notificationService.js';


const getUserNotifications = async (req, res) => {
  
    try {
      const userId = req.userId; 
      
  
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