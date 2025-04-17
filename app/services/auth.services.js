const bcrypt = require('bcrypt')
const db = require('../models')
const clientService = require('../services/clients.services')
const employeeService = require('../services/employees.services')
const roleConstant = require('../constants/roles.constant');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');
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
    if(!userData) {
        userData = await employeeRepository.findOneByEmail(email);
        if(!userData) {
            customError.statusCode = 404;
            customError.message = "User data not found"
            
            throw customError;
        }
    }

    // const isPasswordMatch = await bcrypt.compare(
    //     password,
    //     userData.password
    // );
    // if (!isPasswordMatch) {
    //     customError.message = "Password is incorrect";
    //     throw customError;
    // }

    const accessToken = generateAccessToken({
        id: userData?.id,
        permissions: rolePermissionsMappingConfig[userData?.roleId] || []
    }, { expiresIn: '15m' });
    const refreshToken = generateRefreshToken({
        id: userData?.id,
        permissions: rolePermissionsMappingConfig[userData?.roleId] || []
    }, { expiresIn: '60m'});

    const updatedToken = userData.update({
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
            role: userData?.role.name,
            permissions: rolePermissionsMappingConfig[userData?.roleId],
        },
        accessToken,
        refreshToken,
    };
}

const logout = async (currentToken) => {
    if (!currentToken || currentToken == "undefined") {
        customError.statusCode = 403;
        customError.message = "You are not logged in";
        throw customError;
    }

    let userData = await clientRepository.findOneByRefreshToken(currentToken);
    if(!userData) {
        userData = await employeeRepository.findOneByRefreshToken(currentToken);
        if(!userData) {
            customError.statusCode = 404;
            customError.message = "Token is invalid or expired";
            throw customError;
        }
    }

    const updatedData = userData.update({
        refreshToken: null
    })

    if (!updatedData) {
        customError.statusCode = 500;
        customError.message = "Failed to update token";
        throw customError;
    }

    return updatedData;
} 

module.exports = {
    login,
    logout,
}