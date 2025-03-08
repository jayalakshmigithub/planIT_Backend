import sendInvitation from "../services/inviteServices.js";
import { findByUserEmail, findToken, markTokenAsUsed } from "../repository/inviteRepository.js";
import decryptEmail from "../utils/functions/decryptEmail.js";
import httpStatus from '../utils/functions/httpStatus.js'



const sendInvitationController = async (req, res) => {
  const { emails, workspace } = req.body;
  console.log('workspace in sendinivtaion::',workspace)
  try {
    const result = await sendInvitation(emails, workspace);
    if (result) {
      res.status(httpStatus.OK).json({ message: result.message });
    } else {
      res.status(httpStatus.BAD_REQUEST).json({ message: result.message });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};



const verifyInvitationController = async (req, res) => {
  const { token, email: encryptedEmail, workspaceId } = req.query;
  console.log('workspaceId in verifyinvitaion::',workspaceId)
  const email = decryptEmail(encryptedEmail);

  try {
    
    const invitation = await findToken(token, email, workspaceId);

   
    
    if (invitation) {
      await markTokenAsUsed(token, email, workspaceId);
      res.redirect(
        `http://localhost:5173/signup?token=${token}&workspaceId=${workspaceId}&email=${encryptedEmail}`
      );
    } else {
      res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid or expired invitation link" });
    }
  } catch (error) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
  }
};



// const verifyInvitationController = async (req, res) => {
//   const { token, email: encryptedEmail, workspaceId } = req.query;
//   console.log('workspaceId in verifyinvitaion::', workspaceId);
//   const email = decryptEmail(encryptedEmail);

//   try {
//     const invitation = await findToken(token, email, workspaceId);
    
//     if (invitation) {
   
//       const existingUser = await findByUserEmail(email);
//       await markTokenAsUsed(token, email, workspaceId);
      
//       if (existingUser) {
      
//         res.redirect(
//           `http://localhost:5173/signin?workspaceId=${workspaceId}&email=${encryptedEmail}`
//         );
//       } else {
     
//         res.redirect(
//           `http://localhost:5173/signup?token=${token}&workspaceId=${workspaceId}&email=${encryptedEmail}`
//         );
//       }
//     } else {
//       res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid or expired invitation link" });
//     }
//   } catch (error) {
//     res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
//   }
// };

export { sendInvitationController, verifyInvitationController };
