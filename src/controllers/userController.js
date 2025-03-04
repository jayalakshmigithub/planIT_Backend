import * as userServices from "../services/userServices.js";
import { otpGenerate } from "../utils/otpgenerate.js";
import { generateTokens } from "../utils/jwt/generateToken.js";
import { comparePassword, hashPassword } from "../utils/functions/password.js";
import { workspaceModel } from "../model/workspaceModel.js";
import { getWorkspace } from "../services/workspaceServices.js";
import * as workspaceServices from "../services/workspaceServices.js";
import { userModel } from "../model/userModel.js";
import httpStatus from "../utils/functions/httpStatus.js";
import constants from "../utils/functions/constants.js";

const otpgenerate = async (req, res, next) => {
  console.log("in otp generate");
  try {
    const { email, userId } = req.body;
    let otp = await otpGenerate(email);
    console.log(otp, "otp");

    const user = await userServices.getUpdateUserOtp(userId, otp);

    setTimeout(async () => {
      await userModel.updateOne({ email: email }, { $unset: { otp: 1 } });
    }, 60000);
    return res
      .status(httpStatus.OK)
      .json({ message: "OTP generated and sent successfully" });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    

    const { userData } = req.body;
    const email = userData.email;
    const name = userData.name;
    const password = userData.password;
    console.log(userData, "userData");
    const existUser = await userServices.getByEmail(email);
    if (existUser) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "User already exists" });
    }
    if (!name || !email || !password) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Name, email, and password are required" });
    }
    const securePassword = await hashPassword(userData.password);
    let otp = await otpGenerate(email);
    const data = {
      name: userData.name,
      email: userData.email,
      password: securePassword,
      workspaceId: userData.workspaceId,
      otp,
    };
    console.log(otp);
    const user = await userServices.getCreateUser(data);
    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
    const userId = user._id.toString();
    const { accessToken, refreshToken } = generateTokens(res, {
      userId,
      userRole: "user",
    });
    setTimeout(async () => {
      await userModel.updateOne({ _id: userId }, { $unset: { otp: 1 } });
    }, 60000);

    return res.status(httpStatus.OK).json({ user });
  } catch (error) {
    console.log("Error happened", error.message);
    next(error);
  }
};

const otpVerify = async (req, res, next) => {
  const { userData, origin } = req.body;
  const otp = Number(req.body.otp);
  console.log("req.body", userData);
  const email = req.body.userData;
  const userId = req.body.userData._id;
  console.log(userId, "idd");
  const isUser = await userServices.getUserNotVerified(userId);
  if (!userData || !otp) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "credential missing" });
  }

  if (!isUser?.otp) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "please click Resend OTP" });
  }

  if (otp !== isUser?.otp) {
    return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid OTP" });
  }

  console.log("Received OTP:", otp);
  try {
    if (origin == "signup") {
      const user = await userServices.getUpdateUserIsVerified(isUser?._id);
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
      }
      const userId = user._id.toString();
      const { accessToken, refreshToken } = generateTokens(res, {
        userId,
        userRole: "user",
      });

      return res.status(httpStatus.OK).json({
        user,
        accessToken,
        refreshToken,
        message: "registration success",
      });
    } else {
      const user = await userServices.getUserById(userId);

      // res.clearCookie("otp");
      return res.status(httpStatus.OK).json({
        user,
      });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    let user = await userServices.getUserByEmail(email);
    if (!user) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: constants.AUTH.INVALID_EMAIL });
    }

    if (!user.password) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: constants.AUTH.INVALID_PASSWORD });
    }
    if (user.isBlocked) {
      return res.status(httpStatus.FORBIDDEN).json({
        message: constants.AUTH.USER_BLOCKED
      });
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: constants.AUTH.INVALID_PASSWORD });
    }

    const userId = user._id;

    const { accessToken, refreshToken } = generateTokens(res, {
      userId,
    });
    return res.status(httpStatus.OK).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};

const signinByGoogle = async (req, res, next) => {
  try {
    const { name, email, image } = req.body;
    let imageUrl;

    const data = { name, email, image: imageUrl, isGoogle: true };
    let user = await userServices.getByEmail(email);
    if (!user) {
      user = await userServices.getCreateUserByGoogle(data);
    }
    if (user?.isBlocked == true) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: "User is Blocked" });
    }
    const userId = user._id.toString();
    const { accessToken, refreshToken } = generateTokens(res, {
      userId,
    });
    return res.status(httpStatus.OK).json({ user, accessToken, refreshToken });
  } catch (error) {
    console.error("error occured in google login", error);
    next(error);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { formData } = req.body;
    const { name, email } = formData;
 

    const userId = req.params.userId;
    const existUser = await userServices.getUserById(userId);
    if (!existUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "user not found" });
    }

    const user = {
      name,
      email,
    };

    const updatedUser = await userServices.getUpdatedUser(userId, user);
    // const updatedUser = await userServices.getUpdatedUser(userId, {
    //     name: formData.name,
    //     email: formData.email,
    //   });

    return res.status(httpStatus.OK).json({ user: updatedUser });
  } catch (error) {
    console.error("error in updating user", error.message);
    next(error);
  }
};

const changePasswordController = async (req, res, next) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const updatedUser = await userServices.changePassword(
      email,
      currentPassword,
      newPassword
    );

    return res.status(httpStatus.OK).json({
      message: "Password successfully changed",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const validateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const isValidEmail = await userServices.getByEmail(email);
    if (!isValidEmail) {
      return res.status(httpStatus.NOT_FOUND).json({ message: constants.AUTH.INVALID_EMAIL });
    }
    const otp = await otpGenerate(email);
    const userId = isValidEmail?._id;

    const user = await userServices.getUpdateUserOtp(userId, otp);

    setTimeout(async () => {
      await user.updateOne({ _id: userId }, { $unset: { otp: 1 } });
    }, 60000);
    console.log(user, "user all");
    return res.status(httpStatus.OK).json({ user });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const isUser = await userServices.getByEmail(email);
    if (!isUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
    const securePassword = await hashPassword(password);
    const user = await userServices.getUpdatePassword(email, securePassword);
    return res.status(httpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { userId, password, currentPassword } = req.body;
    const isUser = await userServices.getUserById(userId);
    if (!isUser) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
    }
    const isPasswordValid = await comparePassword(
      currentPassword,
      isUser.password
    );
    if (!isPasswordValid) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Your current password is incorrect" });
    }
    const securePassword = await hashPassword(password);
    const user = await userServices.getUpdatePassword(userId, securePassword);
    return res.status(httpStatus.OK).json({ user });
  } catch (error) {
    next(error);
  }
};

const getBlockStatus = async (req, res, next) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "User  ID is missing." });
    }

    const user = await userServices.getUserById(userId);

    if (!user) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "User  not found." });
    }

    if (user.isBlocked) {
      return res
        .status(httpStatus.OK)
        .json({ isBlocked: true, message: "Your account has been blocked." });
    }

    return res.status(httpStatus.OK).json({ isBlocked: false });
  } catch (error) {
    console.error("Error in getBlockStatus:", error);
    next(error);
  }
};

export {
  signup,
  otpgenerate,
  otpVerify,
  signin,
  signinByGoogle,
  validateEmail,
  resetPassword,
  changePassword,
  updateUserProfile,
  changePasswordController,
  getBlockStatus,
};
