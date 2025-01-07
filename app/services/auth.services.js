const bcrypt = require("bcrypt");
const UserService = require("../services/user.services");
const {
  generateAccessToken,
  generateRefreshToken,
  decodeToken,
} = require("../utils/jwt.utils");
const { throwError } = require("../utils/messageHandler.utils");
const {
  FORBIDDEN,
  NOT_FOUND,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require("../constants/httpStatusCode.constant");
const { CLIENT_RESPONSE } = require("../constants/message.constant");

/**
 * Login function for user authentication
 * @param {string} currentToken - The current token in the cookies
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @param {object} transaction - The transaction object for the database
 * @returns {object} - The access and refresh tokens
 */
const login = async (currentToken, username, password, transaction) => {
  /*
    1. Check if token already exists in cookies. If not exist, then throw error
    2. Check if username exists in database. If not exist then throw error
    3. Compare the password in database and password inputted by user
    4. If the password is valid, then generate access and refresh tokens
  */

  // Check if token already exists
  if (currentToken && currentToken !== "undefined") {
    throwError(CLIENT_RESPONSE.ALREADY_LOGGED_IN);
  }

  // Check if username exists in database
  const existingUserData = await UserService.getUserByIdentifier(
    { username: username },
    true
  );
  if (!existingUserData) {
    throwError(NOT_FOUND, {
      indonesian: "Username tidak ditemukan",
      english: "Username not found",
    });
  }

  // Compare password in database and password inputted by user
  const isPasswordMatch = await bcrypt.compare(
    password,
    existingUserData.password
  );

  if (!isPasswordMatch) {
    throwError({
      code: FORBIDDEN,
      message: {
        indonesian: "Password salah",
        english: "Incorrect password",
      },
    });
  }

  // Generate access and refresh tokens
  const accessToken = generateAccessToken(
    {
      _id: existingUserData.id,
      groups: existingUserData.groups,
      permissions: existingUserData.permissions,
    },
    { expiresIn: "60m" }
  );

  const refreshToken = generateRefreshToken(
    { _id: existingUserData.id },
    { expiresIn: "60m" }
  );

  // Update user data in database with new refresh token
  await UserService.updateUserDataById(
    existingUserData.id,
    { refresh_token: refreshToken },
    transaction
  );

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
  };
};

/**
 * Registers a new user.
 *
 * @param {string} full_name - The full name of the user.
 * @param {string} username - The username of the user.
 * @param {string} email - The email of the user.
 * @param {string} phone_number - The phone number of the user.
 * @param {string} password - The password of the user.
 * @param {object} transaction - The database transaction object.
 * @returns {Promise<object>} The newly created user object.
 * @throws {Error} If the username or email already exists.
 * @throws {Error} If the registration fails.
 */
const register = async (
  full_name,
  username,
  email,
  phone_number,
  password,
  transaction
) => {
  // Check if the username already exists
  const isUsernameExist = await UserService.getUserByIdentifier({ username });
  if (isUsernameExist) {
    throwError(FORBIDDEN, {
      indonesian: "Username sudah terdaftar. Silahkan gunakan username lain",
      english: "Username already registered. Please choose another username",
    });
  }

  // Check if the email already exists
  const isEmailExist = await UserService.getUserByEmail(email);
  if (isEmailExist) {
    throwError(FORBIDDEN, {
      indonesian: "Email sudah terdaftar. Silahkan gunakan email lain",
      english: "Email already registered. Please choose another email",
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the new user data object
  const newUserData = {
    full_name,
    username,
    email,
    phone_number,
    password: hashedPassword,
    active_flag: true,
  };

  // Create the user in the database
  const user = await UserService.createUser(newUserData, transaction);
  if (!user) {
    throwError(INTERNAL_SERVER_ERROR, {
      indonesian: "Registrasi gagal. Silahkan coba lagi",
      english: "Registration failed. Please try again",
    });
  }

  // Return the newly created user object
  return {
    _id: user.id,
    username: user.username,
  };
};

/**
 * Logout function to clear the refresh token for the user.
 *
 * @param {Object} cookies - The cookies object from the request.
 * @param {Object} transaction - The database transaction object.
 * @throws {Error} If the refresh token is not found or invalid.
 */
const logout = async (cookies, transaction) => {
  // Check if the refresh token is present in the cookies
  // const refreshToken = cookies?.token;
  const refreshToken = cookies;
  if (!refreshToken || refreshToken == "undefined") {
    throwError(CLIENT_RESPONSE.NOT_LOGGED_IN);
  }

  // Check if the refresh token is valid
  const isRefreshTokenExist = await UserService.getUserByIdentifier({
    refresh_token: refreshToken,
  });

  if (!isRefreshTokenExist) {
    throwError(CLIENT_RESPONSE.INVALID_TOKEN);
  }

  // Update the user data to clear the refresh token
  await UserService.updateUserDataById(
    isRefreshTokenExist.id,
    {
      refresh_token: null,
    },
    transaction
  );
};

/**
 * Retrieves a new access token using a refresh token.
 *
 * @param {Object} cookies - The cookies object from the request.
 * @throws {Error} If the refresh token is not found or invalid.
 * @returns {Object} An object containing the new access token.
 */
const getRefreshToken = async (cookies) => {
  // Check if the refresh token is present in the cookies
  // const refreshToken = cookies?.token;
  const refreshToken = cookies;
  if (!refreshToken) {
    throwError(CLIENT_RESPONSE.NOT_LOGGED_IN);
  }

  // Check if the refresh token is valid
  const isRefreshTokenExist = await UserService.getUserByIdentifier(
    { refresh_token: refreshToken },
    true // Include permissions in the response
  );

  if (!isRefreshTokenExist) {
    throwError(CLIENT_RESPONSE.INVALID_TOKEN);
  }

  // Decode the refresh token to get the user ID
  const decodedToken = decodeToken(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  // Check if the user ID in the refresh token matches the user ID in the database
  if (decodedToken._id !== isRefreshTokenExist.id) {
    throwError(CLIENT_RESPONSE.INVALID_TOKEN);
  }

  // Generate a new access token with the user ID, groups, and permissions from the database
  const accessToken = generateAccessToken(
    {
      _id: isRefreshTokenExist.id,
      groups: isRefreshTokenExist.groups,
      permissions: isRefreshTokenExist.permissions,
    },
    { expiresIn: "5m" }
  );

  return {
    access_token: accessToken,
  };
};

module.exports = {
  login,
  register,
  logout,
  getRefreshToken,
};
