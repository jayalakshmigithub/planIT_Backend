import * as workspaceServices from "../services/workspaceServices.js";
import { workspaceModel } from "../model/workspaceModel.js";
import { userModel } from "../model/userModel.js";
import httpStatus from "../utils/functions/httpStatus.js";

const createWorkspace = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const OwnerId = req.userId;

    const workspaceData = { name, description, OwnerId };
    const workspace = await workspaceServices.getWorkspace(workspaceData);
    return res.status(httpStatus.OK).json({ workspace });
  } catch (error) {
    next(error);
  }
};

const getWorkspaces = async (req, res, next) => {
  try {
    const ownerId = req.userId;
    const userId = req.userId;

    if (!ownerId) {
      // return res.status(500).json({ message: 'No user ID error' });
      const error = new Error("No user ID error");
      error.statusCode = httpStatus.BAD_REQUEST;
      return next(error);
    }

    const workspace = await workspaceServices.listWorkspaceByOwner(ownerId);
    const sharedWorkspace = await workspaceServices.getSharedWorkspaces(userId);
    return res.status(httpStatus.OK).json({ workspace, sharedWorkspace });
  } catch (error) {
    next(error);
  }
};

const sharedWorkspace = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No user ID found" });
    }
    const sharedWorkspace = await workspaceServices.getSharedWorkspaces(userId);
    return res.status(httpStatus.OK).json({ sharedWorkspace });
  } catch (error) {
    console.error("error happenend in sharedWorkspace controller fn", error);
    next(error);
  }
};

const getMemberWorkspaces = async (req, res, next) => {
  try {
    const userId = req.userId;
    const email = req.email;

    if (!userId || !email) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID or email not provided" });
    }

    const workspaces = await workspaceServices.listWorkspaceByMember(
      userId,
      email
    );

    return res.status(httpStatus.OK).json({ workspaces });
  } catch (error) {
    next(error);
  }
};

const getEachWorkspace = async (req, res, next) => {
  try {
    const { id: workspaceId } = req.params;

    if (!workspaceId) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "No workspace ID found" });
    }
    const workspacePanel = await workspaceServices.listEachWorkspace(
      workspaceId
    );
    if (!workspacePanel) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Workspace not found" });
    }

    return res.status(httpStatus.OK).json({ workspace: workspacePanel });
  } catch (error) {
    next(error);
  }
};

const inviteUserToWorkspace = async (req, res, next) => {
  const { userId, workspaceId } = req.body;

  try {
    await userModel.findByIdAndUpdate(userId, {
      $set: { isInvited: true },
      $push: { sharedWorkspaces: workspaceId },
    });

    await workspaceModel.findByIdAndUpdate(workspaceId, {
      $push: { invitedUsers: userId },
    });

    res.status(httpStatus.OK).json({ message: "User successfully invited to workspace" });
  } catch (error) {
    next(error);
  }
};

const addMembersToWorkspace = async (req, res, next) => {
  try {
    const { workspaceId, updateMembers } = req.body;

    if (!workspaceId || !updateMembers) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Workspace ID or members not provided" });
    }

    const updatedMembers = await workspaceServices.addMembersToWorkspace({
      workspaceId,
      updateMembers,
    });

    return res.status(httpStatus.OK).json({ updatedMembers });
  } catch (error) {
    next(error);
  }
};
const getAllWorkspaces = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "User ID not provided" });
    }

    const allWorkspaces = await workspaceServices.listAllWorkspaces(userId);

    return res.status(httpStatus.OK).json({ allWorkspaces });
  } catch (error) {
    next(error);
  }
};

const getAllMembersByWorkspaceId = async (req, res, next) => {
  try {
    const { workspaceId } = req.params;
    const memberEmails = await workspaceServices.findMembersByWorkspaceId(
      workspaceId
    );
    return res.status(httpStatus.OK).json(memberEmails);
  } catch (error) {
    next(error);
  }
};

const deleteWorkspaceController = async (req, res, next) => {
  const workspaceId = req.params.id;

  try {
    await workspaceServices.deleteWorkspace(workspaceId);
    res.status(httpStatus.OK).json({ message: "Workspace deleted successfully" });
  } catch (error) {
    if (error.message === "Workspace not found") {
      res.status(httpStatus.NOT_FOUND).json({ error: error.message });
    } else {
      console.error("Error deleting workspace:", error);
      next(error);
    }
  }
};

export {
  createWorkspace,
  getWorkspaces,
  sharedWorkspace,
  getEachWorkspace,
  getMemberWorkspaces,
  inviteUserToWorkspace,
  addMembersToWorkspace,
  getAllWorkspaces,
  getAllMembersByWorkspaceId,
  deleteWorkspaceController,
};
