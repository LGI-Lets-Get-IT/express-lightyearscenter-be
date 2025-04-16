const db = require("../models");
const authService = require('../services/auth.services')

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const cookies = req.headers['cookie']

    const loginData = await authService.login(cookies, email, password)

    res.cookie("token", loginData.refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 60 * 60 * 1000,
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
        sameSite: "None",
        secure: true,
      })

      res.jsonSuccess(200, "Logout successful");
    } catch (error) {
      res.jsonFailed(error?.statusCode, error?.message, error);
    }
} 

const forgotPassword = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const resetPassword = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}


module.exports = {
  userLogin,
  userLogout,
  forgotPassword,
  resetPassword
};
