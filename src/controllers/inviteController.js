import sendInvitation from "../services/inviteServices.js";
import { findToken, markTokenAsUsed } from "../repository/inviteRepository.js";
import decryptEmail from "../utils/functions/decryptEmail.js";



const sendInvitationController = async (req, res) => {
  const { emails, workspace } = req.body;
  try {
    const result = await sendInvitation(emails, workspace);
    if (result) {
      res.status(200).json({ message: result.message });
    } else {
      res.status(400).json({ message: result.message });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};



const verifyInvitationController = async (req, res) => {
  const { token, email: encryptedEmail, workspaceId } = req.query;
  const email = decryptEmail(encryptedEmail);

  try {
    const invitation = await findToken(token, email, workspaceId);
    if (invitation) {
      await markTokenAsUsed(token, email, workspaceId);
      res.redirect(
        `http://localhost:5173/signup?token=${token}&workspaceId=${workspaceId}&email=${encryptedEmail}`
      );
    } else {
      res.status(400).json({ message: "Invalid or expired invitation link" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export { sendInvitationController, verifyInvitationController };
