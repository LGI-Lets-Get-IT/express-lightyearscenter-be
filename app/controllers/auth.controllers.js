const db = require("../models");
const authService = require("../services/auth.services");

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cookies = req.cookies.refreshToken;

    const loginData = await authService.login(cookies, email, password);

    res.cookie("refreshToken", loginData.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 6 * 60 * 1000,
      // maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.cookie("accessToken", loginData.accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 3 * 60 * 1000,
    });

    res.jsonSuccess(200, "Login successful", loginData);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const userLogout = async (req, res) => {
  try {
    const cookie = req.cookies.accessToken;

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
    const newTokenData = await authService.getRefreshToken(currentToken);
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
