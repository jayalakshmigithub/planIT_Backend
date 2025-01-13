import { invitationModel } from "../model/invitationModel.js";


const saveToken = async ({ email, workspaceId, token }) => {
  const invitation = new invitationModel({
    email,
    workspaceId,
    token
  });
  await invitation.save();
};

const findToken = async (token, email, workspaceId) => {
  return await invitationModel.findOne({ token, email, workspaceId });
};

const markTokenAsUsed = async (token, email, workspaceId) => {
  await invitationModel.findOneAndDelete({ token, email, workspaceId });
};

export { 
    saveToken, 
    findToken, 
    markTokenAsUsed 
};

