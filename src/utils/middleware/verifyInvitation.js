import { findToken } from "../../repository/inviteRepository";

const verifyInvitation = async (req, res, next) => {
  const { email, workspaceId, token } = req.query;

  if (!email || !workspaceId || !token) {
    return res.status(400).json({ success: false, message: 'Invalid  link' });
  }

  try {
    const tokenRecord = await findToken(token, email, workspaceId);

    if (!tokenRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    req.invitationData = { email, workspaceId };
    next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = verifyInvitation;
