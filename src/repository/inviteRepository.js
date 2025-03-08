import { invitationModel } from "../model/invitationModel.js";
import { userModel } from "../model/userModel.js";


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

const findByUserEmail = async(email)=> {
   console.log(email,'email')
  return await userModel.findOne({email});
}

export { 
    saveToken, 
    findToken, 
    markTokenAsUsed,
    findByUserEmail
};

