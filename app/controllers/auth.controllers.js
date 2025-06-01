const db = require("../models");
const authService = require('../services/auth.services')

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const cookies = req.cookies.token

    const loginData = await authService.login(cookies, email, password)

    res.cookie("token", loginData.refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    res.jsonSuccess(200, "Login successful", loginData);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const userLogout = async (req, res) => {
  try {
    const cookie = req.cookies.token;

    const logoutData = await authService.logout(cookie)

    res.clearCookie('token', {
      httpOnly: true,
      sameSite: "Strict",
      secure: true,
    })

    res.jsonSuccess(200, "Logout successful");
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
}

const userRefreshToken = async (req, res) => {
  try {
    const currentToken = req.cookies.token;
    const newTokenData = await authService.getRefreshToken(currentToken)
    res.jsonSuccess(200, "Successfully get new refresh token", newTokenData)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const forgotPassword = await authService.forgotPassword(email);
    res.jsonSuccess(200, "Successfully forgot password", forgotPassword);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
}

const resetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const updatedUser = await authService.resetPassword(email);
    
    res.jsonSuccess(200, "Successfully reset password", updatedUser)
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error)
  }
}


module.exports = {
  userLogin,
  userLogout,
  userRefreshToken,
  forgotPassword,
  resetPassword
};
