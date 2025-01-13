import { userModel } from "../model/userModel.js";
import { workspaceModel } from "../model/workspaceModel.js";

const findEmail = async (email) => {
  const emailUser = await userModel.findOne({ email: email });
  return emailUser;
};

const findGmail = async (email) => {
  return await userModel.findOne({ email });
};

const createUser = async (userData) => {
    const { name, email, password, workspaceId ,otp} = userData;
    console.log(otp)
    try {
      const newUser = await new userModel({
        name,
        email,
        password,
        sharedWorkspaces: workspaceId ? [workspaceId] : [],
        otp:otp
      }).save();
      console.log(newUser,'newUser')
      if (workspaceId) {
        const workspace = await workspaceModel.findById(workspaceId);
        if (workspace) {
          if (!workspace.members || !workspace.members.some(memberId => memberId.equals(newUser._id))) {
            workspace.members.push(newUser._id);
            await workspace.save();
          } else {
            console.log("User is already a member of the workspace.");
          }
        }
      }
  
      return newUser;
    } catch (error) {
      console.error("Error in createUser:", error);
      throw error;
    }
  };
  
  

const findUserById = async (_id) => {
  try {
    const user = await userModel.findById(_id);
    return user;
  } catch (error) {
    console.log("Error findUserById:", error);
    throw error;
  }
};

const findUserByEmail = async (email) => {
  try {
    return await userModel.findOne({ email });
  } catch (error) {
    console.log("Error findUserByEmail:", error);
    throw error;
  }
};

const findUserNotVerified=async(userId)=> {
  try {
      return await userModel.findById({ _id: userId, isEmailVerified: false });
  } catch (error) {
      console.log("Error findUserNotVerified:", error);
      throw error;
    }
  }

  const findUpdateUserIsVerified=async(userId)=>{
    try {
        return await userModel.findByIdAndUpdate(
            { _id: userId },
            { isEmailVerified: true }
        );
    } catch (error) {
        console.log("Error findUpdateUserIsVerified:", error);
        throw error;
      }
    }

    const findUpdateUserOtp = async(userId,otp)=>{
      try {
          return await userModel.findByIdAndUpdate({ _id: userId }, { otp: otp },{new:true});
      } catch (error) {
          console.log("Error findUpdateUserOtp:", error);
          throw error;
        }
      }

const createUserByGoogle = async (userData) => {
  try {
    return new userModel({
      name: userData.name,
      email: userData.email,
      image: userData.image,
      isGoogle: true,
    }).save();
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updateUser = async (userId, filteredUsers) => {
  try {
    const currentUser = await userModel.findById({ _id: userId });
    if (!currentUser) {
      return null;
    } else {
      const updatedFields = {
        name: filteredUsers.name || currentUser.name,
        email: filteredUsers.email || currentUser.email,
      };
      const updatedUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        updatedFields,
        { new: true }
      );
      if (!updatedUser) {
        console.log("error in updating the user");
        return null;
      }
      return updatedUser;
    }
  } catch (error) {
    console.error("error in updating the user", error);
    throw error;
  }
};



const updatePassword = async(email,securePassword)=>{
  try{
    return await userModel.findOneAndUpdate({email:email},{$set:{password:securePassword}},{new:true})
  }catch (error) {
    console.error("error in updating the password", error);
    throw error;
  }
}


const changePassword = async(userId,securePassword)=>{
  try{
    return await userModel.findByIdAndUpdate({_id:userId},{$set:{password:securePassword}},{new:true})
  }catch (error) {
    console.error("error in updating the change password", error);
    throw error;
  }
}

export {
  findEmail,
  findGmail,
  createUser,
  findUserById,
  findUserByEmail,
  createUserByGoogle,
  updateUser,
  updatePassword,
  changePassword,
  findUserNotVerified,
  findUpdateUserIsVerified,
  findUpdateUserOtp

};
