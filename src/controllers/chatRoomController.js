import * as chatRoomServices from '../services/chatRoomServices.js'

const existingChatRoomController = async (req, res) => {
    const { selectedWorkspace, selectedProject,  } = req.body;
    console.log('req.bodyyy',req.body)
    try {
        const chatRoom = await chatRoomServices.existingChatRoom(selectedWorkspace, selectedProject);
        console.log('got chatrrooom',chatRoom)
        return res.status(201).json({ chatRoom });
    } catch (error) {
        return res.status(500).json({ message: "Error existing chat room" });
    }
};

const createChatRoomController = async(req,res)=>{
    const {workspaceId,projectId} = req.body;
console.log(workspaceId, projectId,'workspaceId, projectId'); 

    
try {
    const chatRoom = await chatRoomServices.createChatRoom(workspaceId,projectId)
    return res.status(201).json({ chatRoom });
} catch (error) {
    return res.status(500).json({ message: "Error creating chat room" });  
}
}

const fetchChatRoomsController = async (req, res) => {
    console.log('hiii in fetchChatRoomsController')
    const { chatRoomId } = req.query;
    console.log('chatRoomId......',chatRoomId)

    if (!chatRoomId) {
        return res.status(400).json({ message: "Chat room ID is required" });
    }

    try {
        const fetchingChatRooms = await chatRoomServices.fetchChatRooms(chatRoomId);
        console.log('fetchingChatRooms',fetchingChatRooms)
        return res.status(200).json({ fetchingChatRooms });
    } catch (error) {
        console.error("Error in controller:", error);
        return res.status(500).json({ message: "Error fetching chat room" });
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
      return res.status(500).json({ message: "Error fetching chat rooms" });
    }
  };





export {
    createChatRoomController ,
    existingChatRoomController,
    fetchChatRoomsController,
    fetchChatRoomsWorkspaceController
}