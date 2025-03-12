import * as notificationRepository from "../repository/notificationRepository.js"

const userSockets = new Map(); 
const chatSockets = new Map();




export function initializeSocket(io) {

    console.log('hiii from socket connection')
    const activeRooms  = new Map()

    io.on("connection", (socket) => {
      
        
        socket.on("join-chat", (currentChatRoomId) => {
            if (currentChatRoomId) {
                if (!chatSockets.has(currentChatRoomId)) {
                    chatSockets.set(currentChatRoomId, new Set());
                }
                chatSockets.get(currentChatRoomId).add(socket.id);
             
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
                        
                    });
                } else {
                    console.log(`No active sockets found for chat ${chatRoomId}`);
                }
            } catch (error) {
              console.error("Error handling send-message event:", error);
            }
          });


          socket.on("register-for-notifications", (userId) => {
            if (userId) {
                if (!userSockets.has(userId)) {
                    userSockets.set(userId, new Set());
                }
                userSockets.get(userId).add(socket.id);
                console.log(`User ${userId} registered for notifications with socket ${socket.id}`);
            }
        });




socket.on("send-notification", async (data) => {
    const { userId, message , projectName} = data;
    

    if (userId && message  && projectName) {
        try {
            
            await notificationRepository.createNotification({ userId, message,  projectName });
            

           
            userSockets.get(userId)?.forEach((socketId) => {
                io.to(socketId).emit("receive-notification", { message,projectName, });
                console.log(`Notification sent to socket ${socketId}`);
                console.log('hiii in recieve')
            });
        } catch (error) {
            console.error("Error saving notification:", error.message);
        }
    } else {
        console.error("Invalid notification data:", data);
    }
});









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
               
            });
        }
    }
});
            } catch (error) {
                console.error("Error handling mark-as-read event:", error);
            }
        });


//for initate the call
socket.on("initiate-call", ({ roomId, callerId, participants, chatRoomId }) => {
    try {
        console.log('Initiate call received:', { roomId, callerId, participants, chatRoomId });

        if (!activeRooms.has(roomId)) {
            activeRooms.set(roomId, {
                participants: new Set([callerId]),
                chatRoomId,
                callerId,
                initiatedAt: Date.now()
            });

            setTimeout(() => {
                const room = activeRooms.get(roomId);
                if (room && room.participants.size <= 1) {
                    
                    console.log(`Call in room ${roomId} expired - cleaning up`);
                    activeRooms.delete(roomId)
                    
                   
                    if (userSockets.has(callerId)) {
                        userSockets.get(callerId).forEach(socketId => {
                            io.to(socketId).emit("call-expired", { roomId , message: "Call expired - no answer within 30 seconds" });
                        });
                    }

                    
                    participants.forEach(participantId => {
                        if (participantId !== callerId && userSockets.has(participantId)) {
                            userSockets.get(participantId).forEach(socketId => {
                                io.to(socketId).emit("call-expired", { roomId, message: "Call expired - no answer within 30 seconds" });
                            });
                        }
                    });
                }
            }, 29000); 
        }

        if (!Array.isArray(participants)) {
            throw new Error('Participants must be an array');
        }

        participants.forEach(participantId => {
            console.log('Checking participant:', participantId);
            
            if (participantId !== callerId && userSockets.has(participantId)) {
                const participantSockets = userSockets.get(participantId);
                console.log(`Found ${participantSockets.size} sockets for participant:`, participantId);
                
                participantSockets.forEach(socketId => {
                    console.log('Emitting incoming-call to socket:', socketId);
                    io.to(socketId).emit("incoming-call", {
                        roomId,
                        callerId,
                        chatRoomId
                    });
                });
            }
        });

        console.log(`Call initiated by ${callerId} in room ${roomId}`);
    } catch (error) {
        console.error("Error handling initiate call event:", error);
        socket.emit("call-error", { message: 'Failed to initiate call' });
    }
});


//accept call

socket.on("accept-call",({roomId,userId})=>{
    if(activeRooms.has(roomId)){
        activeRooms.get(roomId).participants.add(userId)
        socket.join(roomId)
        socket.to(roomId).emit("user-joined-call", { userId });
    }
})

//reject call

// socket.on("reject-call", ({ roomId, userId, callerId }) => {
//     if (userSockets.has(callerId)) {
//         userSockets.get(callerId).forEach(socketId => {
//             io.to(socketId).emit("call-rejected", { userId, roomId });
//         });
//     }
// });

socket.on("reject-call", ({ roomId, userId, callerId, reason }) => {
    if (userSockets.has(callerId)) {
        userSockets.get(callerId).forEach(socketId => {
            io.to(socketId).emit("call-rejected", { userId, roomId, reason});
        });
    }
    if(activeRooms.has(roomId)){
        activeRooms.delete(roomId)
    }
});






        socket.on("join-call", ({ roomId, userId }) => {
          
            try {
                
                socket.join(roomId);

                if (!activeRooms.has(roomId)) {
                    activeRooms.set(roomId, new Set());
                }
                activeRooms.get(roomId).add(userId);

                
                socket.to(roomId).emit("user-joined", { 
                    userId,
                    participantCount: activeRooms.get(roomId).size
                });

                console.log(`User ${userId} joined video call room: ${roomId}`);
                
             
                socket.emit("room-info", {
                    participants: Array.from(activeRooms.get(roomId)),
                    participantCount: activeRooms.get(roomId).size
                });
            } catch (error) {
                console.error(`Error in join-call: ${error.message}`);
                socket.emit("call-error", { message: "Failed to join call" });
            }
        });

        socket.on("leave-call", ({ roomId, userId }) => {
            try {
                socket.leave(roomId);
                
           
                if (activeRooms.has(roomId)) {
                    activeRooms.get(roomId).delete(userId);
                    
                   
                    if (activeRooms.get(roomId).size === 0) {
                        activeRooms.delete(roomId);
                    }
                }

                socket.to(roomId).emit("user-left", { 
                    userId,
                    participantCount: activeRooms.get(roomId)?.size || 0
                });

                console.log(`User ${userId} left video call room: ${roomId}`);
            } catch (error) {
                console.error(`Error in leave-call: ${error.message}`);
            }
        });

        socket.on("disconnect", () => {
            activeRooms.forEach(({ participants }, roomId) => { 
                participants.forEach(userId => {
                    if (socket.rooms.has(roomId)) {
                        socket.to(roomId).emit("user-left", { userId });
                        participants.delete(userId);
                    }
                });
        
                if (participants.size === 0) {
                    activeRooms.delete(roomId);
                }
            });
        });
        
    });
}




//latest
// socket.on("join-call", ({ roomId, userId }) => {
        //     console.log("Received join-call event:", roomId, userId);
        //     socket.join(roomId);
        //     socket.to(roomId).emit("user-joined", { userId });
        //     console.log(`User joined room: ${roomId}, userId: ${userId}`);
        // });
    
        // socket.on("leave-call", ({ roomId, userId }) => {
        //     console.log("Received leave-call event:", roomId, userId);
        //     socket.to(roomId).emit("user-left", { userId });
        //     socket.leave(roomId);
        // });











// socket.on("join-call", ({roomId,userId})=>{
//     try {
//         console.log('hiii injoin call event',roomId,userId)
//         // console.log(`user ${userId} joined call ${roomId}`);
//         socket.join(roomId);
//         // io.to(roomId).emit("user-joined", {userId:userId})
//         socket.to(roomId).emit("user-joined", { userId });
//         console.log(`user joined ${userId}`)
    
//     } catch (error) {
//         console.log('error occured',error)
        
//     }
// })

// socket.on("leave-call",({roomId,userId})=>{
//     try {
//         console.log(`user ${userId} left call ${roomId}`);
//         io.to(roomId).emit("user-left", {userId:userId})
//         socket.leave(roomId);
//     } catch (error) {
//         console.log('error in leave call',error)
//     }
// })
// socket.on("leave-call", ({ roomId, userId }) => {
//     try {
//         socket.to(roomId).emit("user-left", { userId });
//         socket.leave(roomId);
//         console.log(`User left: ${userId}`);
//     } catch (error) {
//         console.log("Error in leave-call:", error);
//     }
// });




        // socket.on("disconnect", () => {
        //     for (const [userId, sockets] of userSockets.entries()) {
        //         if (sockets.has(socket.id)) {
        //             sockets.delete(socket.id);
        //             if (sockets.size === 0) {
        //                 userSockets.delete(userId);
        //             }
        //             break;
        //         }
        //     }
        // });
        
        // socket.on("disconnect", () => {
        //     // Find and clean up any rooms this socket was in
        //     activeRooms.forEach((participants, roomId) => {
        //         participants.forEach(userId => {
        //             if (socket.rooms.has(roomId)) {
        //                 socket.to(roomId).emit("user-left", { userId });
        //                 participants.delete(userId);
        //             }
        //         });
                
        //         if (participants.size === 0) {
        //             activeRooms.delete(roomId);
        //         }
        //     });
        //     });

//og working
// socket.on("initiate-call", ({ roomId, callerId, participants, chatRoomId }) => {
//     try {
      
//         console.log('Initiate call received:', { roomId, callerId, participants, chatRoomId });

//         if (!activeRooms.has(roomId)) {
//             activeRooms.set(roomId, {
//                 participants: new Set([callerId]),
//                 chatRoomId,
//                 callerId
//             });
//         }

//         if (!Array.isArray(participants)) {
//             throw new Error('Participants must be an array');
//         }

//         participants.forEach(participantId => {
//             console.log('Checking participant:', participantId);
            
//             if (participantId !== callerId && userSockets.has(participantId)) {
//                 const participantSockets = userSockets.get(participantId);
//                 console.log(`Found ${participantSockets.size} sockets for participant:`, participantId);
                
//                 participantSockets.forEach(socketId => {
//                     console.log('Emitting incoming-call to socket:', socketId);
//                     io.to(socketId).emit("incoming-call", {
//                         roomId,
//                         callerId,
//                         chatRoomId
//                     });
//                 });
//             }
//         });

//         console.log(`Call initiated by ${callerId} in room ${roomId}`);
//     } catch (error) {
//         console.error("Error handling initiate call event:", error);
//         socket.emit("call-error", { message: 'Failed to initiate call' });
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

//og
// socket.on("send-notification", async (data) => {
    
//     const { userId, message } = data;
//     console.log(data,'datataa')

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




