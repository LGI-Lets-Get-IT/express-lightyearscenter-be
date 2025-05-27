const bcrypt = require('bcrypt')
const db = require('../models')
const clientService = require('../services/clients.services')
const employeeService = require('../services/employees.services')
const roleConstant = require('../constants/roles.constant');
const generateRandomPassword = require('../utils/generatePassword.utils')
const { generateAccessToken, generateRefreshToken, decodeToken } = require('../utils/jwt.utils');
const rolePermissionsMappingConfig = require('../config/rolePermissionsMapping.config');
const employeeRepository = require('../repositories/employees.repositories')(db);
const clientRepository = require('../repositories/clients.repositories')(db);
const customError = new Error()

const login = async (currentToken, email, password) => {
    if (currentToken && currentToken !== 'undefined') {
        customError.statusCode = 403;
        customError.message = "You are already logged in";
        throw customError;
    }

    let userData = await clientRepository.findOneByEmail(email);
    if (!userData) {
        userData = await employeeRepository.findOneByEmail(email);
        if (!userData) {
            customError.statusCode = 404;
            customError.message = "User data not found"

            throw customError;
        }
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        userData.password
    );
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
        permissions: userData?.roleId ? rolePermissionsMappingConfig[userData?.roleId] : rolePermissionsMappingConfig[roleConstant.CLIENT],
    });
    const refreshToken = generateRefreshToken({
        id: userData?.uuid ?? userData?.id,
        fullName: userData?.fullName,
        email: userData?.email ?? userData?.guardianEmail,
        ...(userData?.role && { role: userData?.role?.name }),
        // permissions: rolePermissionsMappingConfig[userData?.roleId] || []
        permissions: userData?.roleId ? rolePermissionsMappingConfig[userData?.roleId] : rolePermissionsMappingConfig[roleConstant.CLIENT],
    });

    const updatedToken = await userData.update({
        refreshToken: refreshToken
    })

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
            permissions: userData?.roleId ? rolePermissionsMappingConfig[userData?.roleId] : rolePermissionsMappingConfig[roleConstant.CLIENT],
        },
        accessToken,
        refreshToken,
    };
}

const logout = async (currentToken) => {
    if (!currentToken || currentToken == "undefined") {
        customError.statusCode = 401;
        customError.message = "You are not logged in";
        throw customError;
    }

    let userData = await clientRepository.findOneByRefreshToken(currentToken);
    if (!userData) {
        userData = await employeeRepository.findOneByRefreshToken(currentToken);
        if (!userData) {
            customError.statusCode = 404;
            customError.message = "Token is invalid or expired";
            throw customError;
        }
    }

    const updatedData = await userData.update({
        refreshToken: null
    })

    if (!updatedData) {
        customError.statusCode = 500;
        customError.message = "Failed to update token";
        throw customError;
    }

    return updatedData;
}

const getRefreshToken = async (currentToken) => {
    if (!currentToken) {
        customError.statusCode = 401;
        customError.message = "Refresh token invalid.";
        throw customError
    }

    let userData = await clientRepository.findOneByRefreshToken(currentToken);
    if (!userData) {
        userData = await employeeRepository.findOneByRefreshToken(currentToken);
        if (!userData) {
            customError.statusCode = 404;
            customError.message = "Token not found";
            throw customError;
        }
    }

    const decodedToken = decodeToken(currentToken, process.env.REFRESH_TOKEN_SECRET, 'refresh');
    if (decodedToken.id !== userData.id) {
        customError.message = "Token is incorrect";
        throw customError;
    }

    const newAccessToken = generateAccessToken({
        id: userData?.uuid ?? userData?.id,
        email: userData?.email ?? userData?.guardianEmail,
        fullName: userData?.fullName,
        ...(userData?.role && { role: userData?.role?.name }),
        permissions: userData?.roleId ? rolePermissionsMappingConfig[userData?.roleId] : rolePermissionsMappingConfig[roleConstant.CLIENT],
        // permissions: rolePermissionsMappingConfig[userData?.roleId] || []
    });

    return {
        accessToken: newAccessToken
    }
}

const resetPassword = async (email) => {
    let userData = await clientRepository.findOneByEmail(email);
    if (!userData) {
        userData = await employeeRepository.findOneByEmail(email);
        if (!userData) {
            customError.statusCode = 404;
            customError.message = "User with that email not found"

            throw customError;
        }
    }

    const generatedPassword = await generateRandomPassword()

    const updatedUser = await userData.update({
        password: generatedPassword
    });

    // const sentEmail = await mailService.

    return updatedUser;
}

module.exports = {
    login,
    logout,
    getRefreshToken,
    resetPassword,
}