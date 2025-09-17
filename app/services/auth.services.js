const bcrypt = require("bcrypt");
const db = require("../models");
const clientService = require("../services/clients.services");
const employeeService = require("../services/employees.services");
const mailService = require("../services/mail.services");
const roleConstant = require("../constants/roles.constant");
const generateRandomPassword = require("../utils/generatePassword.utils");
const {
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
} = require("../utils/jwt.utils");
const rolePermissionsMappingConfig = require("../config/rolePermissionsMapping.config");
const employeeRepository = require("../repositories/employees.repositories")(
  db
);
const clientRepository = require("../repositories/clients.repositories")(db);
const customError = new Error();

const login = async (currentToken, email, password) => {
  // Check if user is already logged in with a valid token
  if (currentToken && currentToken !== "undefined") {
    try {
      // Validate the existing token
      const decodedToken = decodeToken(
        currentToken,
        process.env.REFRESH_TOKEN_SECRET,
        "refresh"
      );

      // Check if the token belongs to the same user trying to log in
      let existingUser = await clientRepository.findOneByRefreshToken(
        currentToken
      );
      if (!existingUser) {
        existingUser = await employeeRepository.findOneByRefreshToken(
          currentToken
        );
      }

      if (existingUser) {
        const existingEmail =
          existingUser?.email ?? existingUser?.guardianEmail;
        if (existingEmail === email) {
          customError.statusCode = 403;
          customError.message = "You are already logged in";
          throw customError;
        }
      }
    } catch (error) {
      // If token is invalid/expired, continue with login process
      console.log(
        "Existing token is invalid, proceeding with login:",
        error.message
      );
    }
  }

  let userData = await clientRepository.findOneByEmail(email);
  if (!userData) {
    userData = await employeeRepository.findOneByEmail(email);
    if (!userData) {
      customError.statusCode = 404;
      customError.message = "User data not found";

      throw customError;
    }
  }

  const isPasswordMatch = await bcrypt.compare(password, userData.password);
  if (!isPasswordMatch) {
    customError.message = "Password is incorrect";
    throw customError;
  }

  const accessToken = generateAccessToken({
    id: userData?.uuid ?? userData?.id,
    fullName: userData?.fullName,
    email: userData?.email ?? userData?.guardianEmail,
    ...(userData?.role && { role: userData?.role?.name }),
    // permissions: rolePermissionsMappingConfig[userData?.roleId] || []
    permissions: userData?.roleId
      ? rolePermissionsMappingConfig[userData?.roleId]
      : rolePermissionsMappingConfig[roleConstant.CLIENT],
  });
  const refreshToken = generateRefreshToken({
    id: userData?.uuid ?? userData?.id,
    fullName: userData?.fullName,
    email: userData?.email ?? userData?.guardianEmail,
    ...(userData?.role && { role: userData?.role?.name }),
    // permissions: rolePermissionsMappingConfig[userData?.roleId] || []
    permissions: userData?.roleId
      ? rolePermissionsMappingConfig[userData?.roleId]
      : rolePermissionsMappingConfig[roleConstant.CLIENT],
  });

  // Clear any existing tokens for this user before setting new ones
  const updatedToken = await userData.update({
    refreshToken: refreshToken,
  });

  if (!updatedToken) {
    customError.statusCode = 500;
    customError.message = "Failed to update token";
    throw customError;
  }

  return {
    user: {
      id: userData?.uuid ?? userData?.id,
      email: userData?.email ?? userData?.guardianEmail,
      fullName: userData?.fullName,
      ...(userData?.role && { role: userData?.role?.name }),
      permissions: userData?.roleId
        ? rolePermissionsMappingConfig[userData?.roleId]
        : rolePermissionsMappingConfig[roleConstant.CLIENT],
    },
    accessToken,
    refreshToken,
  };
};

const logout = async (currentToken) => {
  if (!currentToken || currentToken == "undefined") {
    // If no token provided, consider logout successful (user might have already logged out)
    // return { message: "Already logged out" };
    customError.statusCode = 401;
    customError.message = "You are already logged out";
    throw customError;
  }

  let userData = await clientRepository.findOneByRefreshToken(currentToken);
  if (!userData) {
    userData = await employeeRepository.findOneByRefreshToken(currentToken);
    if (!userData) {
      // If token not found in database, consider logout successful
      // return { message: "Token already invalidated" };
      customError.statusCode = 404;
      customError.message = "Token is invalid or expired";
      throw customError;
    }
  }

  const updatedData = await userData.update({
    refreshToken: null,
  });

  if (!updatedData) {
    customError.statusCode = 500;
    customError.message = "Failed to update token";
    throw customError;
  }

  return updatedData;
};

const getRefreshToken = async (currentToken) => {
  console.log(
    "getRefreshToken called with token:",
    currentToken ? "present" : "missing"
  );

  if (!currentToken) {
    customError.statusCode = 401;
    customError.message = "Refresh token invalid.";
    throw customError;
  }

  let userData = await clientRepository.findOneByRefreshToken(currentToken);
  console.log(
    "Client refresh token lookup result:",
    userData ? "found" : "not found"
  );

  if (!userData) {
    userData = await employeeRepository.findOneByRefreshToken(currentToken);
    console.log(
      "Employee refresh token lookup result:",
      userData ? "found" : "not found"
    );
    if (!userData) {
      customError.statusCode = 404;
      customError.message = "Token not found";
      throw customError;
    }
  }

  const decodedToken = decodeToken(
    currentToken,
    process.env.REFRESH_TOKEN_SECRET,
    "refresh"
  );

  // FIXED: Check both uuid and id for consistency
  const tokenId = decodedToken.id;
  const userId = userData?.uuid ?? userData?.id;

  if (tokenId !== userId) {
    customError.message = "Token is incorrect";
    throw customError;
  }

  const newAccessToken = generateAccessToken({
    id: userData?.uuid ?? userData?.id,
    email: userData?.email ?? userData?.guardianEmail,
    fullName: userData?.fullName,
    ...(userData?.role && { role: userData?.role?.name }),
    permissions: userData?.roleId
      ? rolePermissionsMappingConfig[userData?.roleId]
      : rolePermissionsMappingConfig[roleConstant.CLIENT],
  });

  // FIXED: Generate new refresh token and update in database
  const newRefreshToken = generateRefreshToken({
    id: userData?.uuid ?? userData?.id,
    email: userData?.email ?? userData?.guardianEmail,
    fullName: userData?.fullName,
    ...(userData?.role && { role: userData?.role?.name }),
    permissions: userData?.roleId
      ? rolePermissionsMappingConfig[userData?.roleId]
      : rolePermissionsMappingConfig[roleConstant.CLIENT],
  });

  // Update the refresh token in database
  const updatedUser = await userData.update({
    refreshToken: newRefreshToken,
  });

  if (!updatedUser) {
    customError.statusCode = 500;
    customError.message = "Failed to update refresh token";
    throw customError;
  }

  return {
    user: {
      id: userData?.uuid ?? userData?.id,
      email: userData?.email ?? userData?.guardianEmail,
      fullName: userData?.fullName,
      ...(userData?.role && { role: userData?.role?.name }),
      permissions: userData?.roleId
        ? rolePermissionsMappingConfig[userData?.roleId]
        : rolePermissionsMappingConfig[roleConstant.CLIENT],
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken, // FIXED: Return new refresh token
  };
};

const forgotPassword = async (email) => {
  const tr = await db.sequelize.transaction();
  try {
    let userData = await clientRepository.findOneByEmail(email);
    if (!userData) {
      userData = await employeeRepository.findOneByEmail(email);
      if (!userData) {
        customError.statusCode = 404;
        customError.message = "User with that email not found";

        throw customError;
      }
    }

    const generatedPassword = await generateRandomPassword();
    const updatedUser = await userData.update({
      password: generatedPassword.hashedPassword,
    });
    const sentEmail = await mailService.sendMail(
      email,
      "Forgot Password",
      "FORGOT_PASSWORD",
      {
        fullName: userData.guardianName || userData.fullName,
        email,
        password: generatedPassword.password,
      }
    );

    await tr.commit();
    return updatedUser;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const changePassword = async (currentUser, oldPassword, newPassword) => {
  const tr = await db.sequelize.transaction();
  try {
    const isEmployee = currentUser?.role ? true : false;

    let updatedUser;
    if (isEmployee) {
      updatedUser = await employeeService.changePassword(
        currentUser.id,
        oldPassword,
        newPassword
      );
    } else {
      updatedUser = await clientService.changePassword(
        currentUser.id,
        oldPassword,
        newPassword
      );
    }

    await tr.commit();
    return updatedUser;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  login,
  logout,
  getRefreshToken,
  forgotPassword,
  changePassword,
};
