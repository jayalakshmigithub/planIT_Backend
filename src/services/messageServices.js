import * as messageRepository from '../repository/messageRepository.js'


const createMessage = async (data ,userId) => {
    try {
       
        const NewMessage = await messageRepository.createMessage(data ,userId);
        return NewMessage;
    } catch (error) {
        console.error("Error in message service:", error);
        throw error;
    }
};
const getMessages = async (chatId) => {
    try {
        const messages = await messageRepository.getMessages(chatId);
        return messages;
    } catch (error) {
        console.error("Error in get message service:", error);
        throw error;
    }
};

export{
 createMessage ,
 getMessages

}