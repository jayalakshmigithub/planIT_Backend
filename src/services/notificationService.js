import * as notificationRepository from '../repository/notificationRepository.js'


const addNotification = async (notificationData) => {
    try {
      return await notificationRepository.createNotification(notificationData);
    } catch (error) {
      console.error("Error in addNotification service:", error); 
      throw error; 
    }
  };





const fetchUserNotifications = async (userId) => {
    try {
      const notifications = await notificationRepository.getNotifications(userId); 
      return notifications;
    } catch (error) {
      console.error("Error in notification service:", error.message);
      throw new Error("Unable to fetch user notifications.");
    }
  };
  
  export { fetchUserNotifications,
    addNotification
  };