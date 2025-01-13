import * as chatRoomRepository from '../repository/chatRoomRepository.js'

const existingChatRoom = async(workspaceId,projectId)=>{
   try {
     const chatroom = await chatRoomRepository.existingChatRoom(workspaceId,projectId)
     console.log(chatroom,'chatroom in serviceee')
     return chatroom
   } catch (error) {
    console.error('error occured in service',error);
    throw error 
   }
}

const createChatRoom = async(workspaceId,projectId)=>{
    try {
        const chatRoom = await chatRoomRepository.createChatRoom(workspaceId,projectId)
        return chatRoom
    } catch (error) {
        console.error('error occured in service',error);
        throw error
        
    }
}

// const fetchChatRooms = async(chatRoomId)=>{
//     try {
//         const chatRooms = await chatRoomRepository.fetchChatRooms(chatRoomId)
//         return chatRooms
//     } catch (error) {
//         console.error('error in fetching chatrooms serv',error);
        
//     }
// }

const fetchChatRooms = async (workspaceId,user) => {
    if (!workspaceId||!user) {
      throw new Error("Workspace ID is required");
    }
  
    const chatRooms = await chatRoomRepository.fetchChatRoomsByWorkspace(workspaceId,user);
    return chatRooms;
  };

  

export {
    createChatRoom,
    existingChatRoom,
    fetchChatRooms
}