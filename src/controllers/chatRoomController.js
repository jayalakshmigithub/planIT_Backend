import * as chatRoomServices from '../services/chatRoomServices.js'
import constants from '../utils/functions/constants.js';

const existingChatRoomController = async (req, res) => {
    const { selectedWorkspace, selectedProject,  } = req.body;
    try {
        const chatRoom = await chatRoomServices.existingChatRoom(selectedWorkspace, selectedProject);
        return res.status(201).json({ chatRoom });
    } catch (error) {
        return res.status(500).json({ message: constants.CHATS.ERROR_EXISTING_CHATROOM });
    }
};

const createChatRoomController = async(req,res)=>{
    const {workspaceId,projectId} = req.body;
console.log(workspaceId, projectId,'workspaceId, projectId'); 
try {
    const chatRoom = await chatRoomServices.createChatRoom(workspaceId,projectId)
    return res.status(201).json({ chatRoom });
} catch (error) {
    return res.status(500).json({ message: constants.CHATS.ERROR_CREATING_CHATROOM });  
}
}

const fetchChatRoomsController = async (req, res) => {
    const { chatRoomId } = req.query;
    if (!chatRoomId) {
        return res.status(400).json({ message: constants.CHATS.CHATROOM_ID_REQUIRED });
    }

    try {
        const fetchingChatRooms = await chatRoomServices.fetchChatRooms(chatRoomId);
        return res.status(200).json({ fetchingChatRooms });
    } catch (error) {
        console.error("Error in controller:", error);
        return res.status(500).json({ message: constants.CHATS.ERROR_FETCHING_CHATROOM });
    }
};

const fetchChatRoomsWorkspaceController = async (req, res) => {
   
    const { id: workspaceId } = req.params;
    const user = req.userId
    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace ID is required" });
    }
  
    try {
      const chatRooms = await chatRoomServices.fetchChatRooms(workspaceId,user);
      return res.status(200).json({ chatRooms });
    } catch (error) {
      console.error("Error in fetchChatRoomsController:", error);
      return res.status(500).json({ message: constants.CHATS.ERROR_FETCHING_CHATROOMS });
    }
  };





export {
    createChatRoomController ,
    existingChatRoomController,
    fetchChatRoomsController,

    fetchChatRoomsWorkspaceController
}