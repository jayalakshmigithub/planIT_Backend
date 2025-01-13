import { notificationModel } from "../model/notificationModel.js";

const createNotification = async (notificationData) => {
    try {
      const notification = new notificationModel(notificationData); 
      return await notification.save(); 
    } catch (error) {
      console.error("Error creating notification:", error); 
      throw error; 
    }
  };

const getNotifications = async (userId) => {
    try {
   
      const notifications = await notificationModel
        .find({ userId })
        .populate("projectId", "projectName") 
        .populate("taskId", "name") 
        .sort({ createdAt: -1 }); 
  
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      throw new Error("Failed to fetch notifications.");
    }
  };

  export{
    getNotifications,
    createNotification
  }