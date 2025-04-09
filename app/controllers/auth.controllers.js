const db = require("../models");
const authService = require('../services/auth.services')

const customerLogin = async (req, res) => {
    const transaction = await db.sequelize.transaction()
  try {
    const { email, password } = req.body
    const cookies = req.headers['cookie']

    const loginData = await authService.login(cookies, username, password, transaction)

    res.cookie("token", loginData.refresh_token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 60 * 60 * 1000,
      });

      await transaction.commit()
  
    res.jsonSuccess(
      200,
      {
        indonesian: "Data pesanan berhasil diambil",
        english: "Order data fetched successfully",
      },
      loginData
    );
  } catch (error) {
    await transaction.rollback()
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const customerLoginWithGoogle = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
} 

const customerRegister = async (req, res) => {
    const transaction = await db.sequelize.transaction()
    try {
        const { full_name, username, email, phone_number, password } = req.body;
        const data = await authService.register(
            full_name,
            username,
            email,
            phone_number,
            password,
            transaction
        );
        
        await transaction.commit();
        
        res.jsonSuccess(
            201,
            {
                indonesian: "Order berhasil dibuat",
                english: "Order created successfully",
            },
            createdOrder
        );
  } catch (error) {
    await transaction.rollback()
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const employeeLogin = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const userLogout = async (req, res) => {
    try {
        
    } catch (error) {
        
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
  customerLogin,
  customerLoginWithGoogle,
  customerRegister,
  employeeLogin,
  userLogout,
  forgotPassword,
  resetPassword
};
