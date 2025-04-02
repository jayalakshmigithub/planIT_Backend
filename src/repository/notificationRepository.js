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
        // .populate("taskId", "name") 
        .sort({ createdAt: -1 }); 
  
      return notifications;
    } catch (error) {
      console.error("Error fetching notifications:", error.message);
      throw new Error("Failed to fetch notifications.");
    }
  };

const markNotificationAsRead = async(notificationId,userId)=>{
  console.log('notificationId,userId in repository',notificationId,userId)
  try {
    const updatedNotification =  await notificationModel.findByIdAndUpdate(
      {_id:notificationId,userId},
      { $set: {isRead: true}},
      { new: true }
    )
    if(!updatedNotification){
      console.log('notification not found')
      return null
    }
console.log(`notifiaction read ${notificationId} marked as read`)
return updatedNotification
    
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    throw new Error("Failed to mark notification as read.");
    
  }

}


  export{

    getNotifications,
    createNotification,
    markNotificationAsRead
  }