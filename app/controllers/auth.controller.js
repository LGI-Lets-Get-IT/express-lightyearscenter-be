const db = require("../models/index");
const AuthService = require("../services/auth.services");

const {
  sendResponse,
  jsonFailed,
  jsonSuccess,
} = require("../utils/messageHandler.utils");
const { SUCCESS } = require("../constants/httpStatusCode.constant");

const loginUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { username, password } = req.body;
    const cookies = req.headers["cookie"];

    const loginData = await AuthService.login(
      // req?.cookies?.token,
      cookies,
      username,
      password,
      transaction
    );

    res.cookie("token", loginData.refresh_token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    await transaction.commit();

    const successMsg = {
      indonesian: "Login berhasil",
      english: "Login succeessful",
    };
    sendResponse(
      res,
      jsonSuccess({ code: SUCCESS, message: successMsg }, loginData)
    );
  } catch (error) {
    await transaction.rollback();
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

const loginWithGoogle = async (req, res) => {
  try {
  } catch (error) {
    await transaction.rollback();
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

const registerUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { full_name, username, email, phone_number, password } = req.body;
    const data = await AuthService.register(
      full_name,
      username,
      email,
      phone_number,
      password,
      transaction
    );

    await transaction.commit();

    const successMsg = {
      indonesian: "Registrasi berhasil",
      english: "Registration successful",
    };

    sendResponse(
      res,
      jsonSuccess({ code: SUCCESS, message: successMsg }, data)
    );
  } catch (error) {
    await transaction.rollback();
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

const logoutUser = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const cookies = req.headers["cookie"];
    await AuthService.logout(cookies, transaction);

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    await transaction.commit();
    const successMsg = {
      indonesian: "Logout berhasil",
      english: "Logout successful",
    };

    sendResponse(res, jsonSuccess({ code: SUCCESS, message: successMsg }));
  } catch (error) {
    await transaction.rollback();
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

const getRefreshToken = async (req, res) => {
  try {
    const cookies = req.headers["cookie"];
    const data = await AuthService.getRefreshToken(cookies);

    const successMsg = {
      indonesian: "Token berhasil diperbarui",
      english: "Token refreshed successfully",
    };
    sendResponse(
      res,
      jsonSuccess({ code: SUCCESS, message: successMsg }, data)
    );
  } catch (error) {
    sendResponse(
      res,
      jsonFailed({ code: error.code, message: error.message }, error)
    );
  }
};

module.exports = {
  loginUser,
  registerUser,
  logoutUser,
  getRefreshToken,
};
