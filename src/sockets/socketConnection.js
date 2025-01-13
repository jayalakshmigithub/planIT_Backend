import * as notificationRepository from "../repository/notificationRepository.js"

const userSockets = new Map(); 
const chatSockets = new Map();

export function initializeSocket(io) {
    console.log('hiii from socket connection')
    io.on("connection", (socket) => {
       
        
        socket.on("join-chat", (currentChatRoomId) => {
            if (currentChatRoomId) {
                if (!chatSockets.has(currentChatRoomId)) {
                    chatSockets.set(currentChatRoomId, new Set());
                }
                chatSockets.get(currentChatRoomId).add(socket.id);
                console.log(`Socket ${socket.id} joined chat ${currentChatRoomId}`);
            }
        });
        
        socket.on("send-message", async (data) => {
            try {
              const { message } = data;
              const {senderId,chatRoomId} = message
              if (!senderId || !chatRoomId) {
                  throw new Error("Invalid message data");
                }
                if (chatSockets.has(chatRoomId)) {
                    console.log(message,'mesage backend sockreet')
                    chatSockets.get(chatRoomId).forEach((socketId) => {
                        io.to(socketId).emit("receive-message", message);
                        console.log(`Message sent to socket ${socketId} in chat ${chatRoomId}`);
                    });
                } else {
                    console.log(`No active sockets found for chat ${chatRoomId}`);
                }
            } catch (error) {
              console.error("Error handling send-message event:", error);
            }
          });


 // Send a notification to a specific user
//  socket.on("send-notification", (notification) => {
//     const { userId, message } = notification;

//     if (userSockets.has(userId)) {
//         userSockets.get(userId).forEach((socketId) => {
//             io.to(socketId).emit("receive-notification", message);
//             console.log(`Notification sent to user ${userId} on socket ${socketId}: ${message}`);
//         });
//     } else {
//         console.log(`User ${userId} is not connected`);
//     }
// });

// socket.on("send-notification", (data) => {
//     const { userId, message } = data;

//     if (userId && message) {
//         if (userSockets.has(userId)) {
//             // Notify all sockets connected to this user
//             userSockets.get(userId).forEach((socketId) => {
//                 io.to(socketId).emit("receive-notification", { message });
//             });

//             console.log(`Notification sent to user ${userId}`);
//         } else {
//             console.log(`No active sockets for user ${userId}`);
//         }
//     } else {
//         console.error("Invalid notification data:", data);
//     }
// });


// socket.on("send-notification", (data) => {
//     const { userId, message } = data;

//     if (userId && message) {
//         if (userSockets.has(userId)) {
//             userSockets.get(userId).forEach((socketId) => {
//                 io.to(socketId).emit("receive-notification", { message });
//             });
//             console.log(`Notification sent to user ${userId}`);
//         } else {
//             console.log(`No active sockets for user ${userId}`);
//         }
//     } else {
//         console.error("Invalid notification data:", data);
//     }
// });

// socket.on("send-notification", async (data) => {
//     const { userId, message } = data;

//     if (userId && message) {
//         try {
           
//             await notificationRepository.createNotification({ userId, message });

//             if (userSockets.has(userId)) {
//                 userSockets.get(userId).forEach((socketId) => {
//                     io.to(socketId).emit("receive-notification", { message });
//                 });
//                 console.log(`Notification sent to user ${userId}`);
//             } else {
//                 console.log(`User ${userId} is offline. Notification saved.`);
//             }
//         } catch (error) {
//             console.error("Error saving notification:", error.message);
//         }
//     } else {
//         console.error("Invalid notification data:", data);
//     }
// });



// socket.on("add-member", (data) => {
//     const { email, projectId, projectName } = data;

//     if (email && projectId && projectName) {
//         let userSocketId;

//         for (const [userId, sockets] of userSockets.entries()) {

//             if (userId === email) {
//                 userSocketId = sockets.values().next().value;
//                 break;
//             }
//         }

//         if (userSocketId) {
//             io.to(userSocketId).emit("receive-notification", {
//                 message: `You have been added to the project: ${projectName}`,
//                 projectId,
//             });
//             console.log(`Notification sent to ${email}`);
//         } else {
//             console.log(`User with email ${email} is not online.`);
//         }
//     } else {
//         console.error("Invalid data for add-member");
//     }
// });


// socket.on("add-member", async (data) => {
//     const { email, projectId, projectName } = data;

//     if (email && projectId && projectName) {
//         try {
//             let userSocketId;
//             let userId; 

//             for (const [id, sockets] of userSockets.entries()) {
//                 if (id === email) {
//                     userSocketId = sockets.values().next().value;
//                     userId = id;
//                     break;
//                 }
//             }

//             const notification = {
//                 userId: email, 
//                 type: "project",
//                 message: `You have been added to the project: ${projectName}`,
//                 projectId,
//             };
            
//             console.log("Notification payload:", notification);
            
           
//             if (!notification.userId || !notification.type || !notification.message) {
//                 console.error("Invalid notification data:", notification);
//                 return;
//             }
            
//             await notificationRepository.createNotification(notification);
            

//             if (userSocketId) {
//                 io.to(userSocketId).emit("receive-notification", notification);
//                 console.log(`Notification sent to ${email}`);
//             } else {
//                 console.log(`User with email ${email} is offline. Notification saved.`);
//             }
//         } catch (error) {
//             console.error("Error saving notification:", error.message);
//         }
//     } else {
//         console.error("Invalid data for add-member");
//     }
// });







        socket.on("mark-as-read", (data) => {
            try {
                const { messageIds, userId } = data;

        
                if (!messageIds || !userId) {
                    throw new Error("Invalid data for mark-as-read");
                }
        
messageIds.forEach((messageId) => {
    for (const [chatRoomId, sockets] of chatSockets.entries()) {
        if (sockets.has(socket.id)) {
            sockets.forEach((socketId) => {
                io.to(socketId).emit("message-read", {
                    messageIds: [messageId], 
                    readerId: userId,
                });
                console.log(
                    `Message ${messageId} marked as read by user ${userId} in chat ${chatRoomId}`
                );
            });
        }
    }
});
            } catch (error) {
                console.error("Error handling mark-as-read event:", error);
            }
        });





        


        socket.on("disconnect", () => {
            for (const [userId, sockets] of userSockets.entries()) {
                if (sockets.has(socket.id)) {
                    sockets.delete(socket.id);
                    if (sockets.size === 0) {
                        userSockets.delete(userId);
                    }
                    break;
                }
            }
        });
    });
}





