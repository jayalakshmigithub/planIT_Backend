import * as messageServices from '../services/messageServices.js'


const createMessageController = async (req, res) => {

    const userId = req.userId
    const { senderId, message, chatId } = req.body;
    try {
        const NewMessage = await messageServices.createMessage({senderId, message, chatId},userId);
        return res.status(201).json({ message:NewMessage });
    } catch (error) {
        console.error("Error creating message in controller:", error);
        return res.status(500).json({ message: "Error creating message" });
    }
};

const fetchMessagesController = async (req, res) => {
    try {
        const chatId = req.query.chatId;

        const result = await messageServices.getMessages(chatId);

        return res.status(200).json({ message: result });
    } catch (error) {
        console.error("Error fetching messages in controller:", error);
        return res.status(500).json({ message: "Error fetching messages" }); 
    }
};



export{
    createMessageController,
    fetchMessagesController
}