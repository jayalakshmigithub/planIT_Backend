import {ChatRoom} from '../model/chatRoom.js'
import { projectModel } from '../model/projectModel.js';
import { Message } from '../model/message.js';



const existingChatRoom = async (workspaceId, projectId) => {
    try {
        const existingChatRoom = await ChatRoom.findOne({ workspaceId, projectId });
        console.log('existingChatRoom',existingChatRoom)
        return existingChatRoom;
    } catch (error) {
        console.error("Error creating chat room:", error);
        throw error;
    }
};


const createChatRoom = async(workspaceId, projectId)=>{
    try {
        const existingChatRoom = await ChatRoom.findOne({ workspaceId, projectId });
        if (existingChatRoom) {
            return existingChatRoom;
        }
        const project = await projectModel.findById({
            _id:projectId})
            console.log(project,'projeeect')

        if (!project ) {
            throw new Error('No  project');
        }
        const newChatRoom = new ChatRoom({
            workspaceId,
            projectId,
            members: project.members 
        });
        console.log('newChatRoommm',newChatRoom)
        await newChatRoom.save();
       
        return newChatRoom;
    } catch (error) {
        console.error("Error creating chat room:", error);
        throw error;
}
}

 const fetchChatRooms = async(chatRoomId)=>{
    try {
        
        const messages = await Message.find({ chatRoomId })
            .populate({
                path: "senderId", 
                model: "user", 
                select: "name email" 
            })
            .sort({ createdAt: 1 }); 

        if (!messages) {
            throw new Error("No messages found for this chat room");
        }

        return messages;
    } catch (error) {
        console.error("Error in repository while fetching chat history:", error);
        throw error;
    }
 }


 const fetchChatRoomsByWorkspace = async (workspaceId, userId) => {
    try {
        console.log('workspceidd',workspaceId)
      const chatRooms = await ChatRoom.find({
        workspaceId,
        members: { $in: [userId] }, 
      })
        .populate("members") 
        .populate("messageId") 
        .populate("projectId")
        
  
      return chatRooms; 
    } catch (error) {
      console.error("Error in chatRoomRepository:", error);
      throw error;
    }
  };
  







export {
    createChatRoom,
    existingChatRoom,
    fetchChatRooms,
    fetchChatRoomsByWorkspace

     
}