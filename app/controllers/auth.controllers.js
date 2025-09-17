const db = require("../models");
const authService = require("../services/auth.services");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookies = req.cookies.refreshToken;

    const loginData = await authService.login(cookies, email, password);

    // FIXED: Align cookie expiration with JWT expiration (1 day = 24 hours)
    res.cookie("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day to match JWT expiration
      // maxAge: 5 * 60 * 1000,
      maxAge: 2 * 60 * 1000, // OLD CODE - commented out (3 minutes)
    });

    // FIXED: Align cookie expiration with JWT expiration (60 minutes)
    res.cookie("accessToken", loginData.accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      // maxAge: 60 * 60 * 1000, // 60 minutes to match JWT expiration
      maxAge: 30 * 1000,
    });

    res.jsonSuccess(200, "Login successful", loginData);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const userLogout = async (req, res) => {
  try {
    // FIXED: Use refreshToken instead of accessToken for logout
    // const cookie = req.cookies.accessToken; // OLD CODE - commented out
    const cookie = req.cookies.refreshToken;

    const logoutData = await authService.logout(cookie);

    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    });

    res.jsonSuccess(200, "Logout successful");
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const userRefreshToken = async (req, res) => {
  try {
    const currentToken = req.cookies.refreshToken;
    console.log(
      "Refresh token controller - currentToken:",
      currentToken ? "present" : "missing"
    );
    console.log("All cookies:", req.cookies);

    const newTokenData = await authService.getRefreshToken(currentToken);
    console.log("Refresh token service successful, setting new cookies...");

    // FIXED: Set new refresh token cookie when refreshing with aligned expiration
    res.cookie("refreshToken", newTokenData.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      // maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day to match JWT expiration
      maxAge: 2 * 60 * 1000, // local testing purpose, 5 minutes
    });

    res.cookie("accessToken", newTokenData.accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      // maxAge: 60 * 60 * 1000, // 60 minutes to match JWT expiration // local testing purpose, 2 minutes
      maxAge: 30 * 1000,
    });

    res.jsonSuccess(200, "Successfully get new refresh token", newTokenData);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const forgotPassword = await authService.forgotPassword(email);
    res.jsonSuccess(200, "Successfully forgot password", forgotPassword);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const updatedUser = await authService.changePassword(
      req.user,
      oldPassword,
      newPassword
    );

    res.jsonSuccess(200, "Successfully reset password", updatedUser);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  userLogin,
  userLogout,
  userRefreshToken,
  forgotPassword,
  changePassword,
};
