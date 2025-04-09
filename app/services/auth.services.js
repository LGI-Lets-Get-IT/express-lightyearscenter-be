const clientService = require('../services/clients.services')
const employeeService = require('../services/employees.services')
const roleConstant = require('../constants/roles.constant');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');
const customError = new Error()

const login = async (currentToken, email, resetPassword) => {
    if (currentToken && currentToken !== 'undefined') {
        customError.message = "You are already logged in";
        throw customError;
    }

    const employeeData = await employeeService.findOneEmployeeByEmail(email);
    if(!employeeData) {
        
    }

    const isPasswordMatch = await bcrypt.compare(
        resetPassword,
        existingUserData.resetPassword
    );
    if (!isPasswordMatch) {
        customError.message = "Password is incorrect";
        throw customError;
    }

    const updatedToken = await userService.updateToken(
        existingUserData.id,
        currentToken
    );
    if (!updatedToken) {
        customError.message = "Failed to update token";
        throw customError;
    }

    const accessToken = generateAccessToken(existingUserData, { expiresIn: '5m' });
    const refreshToken = generateRefreshToken(existingUserData, { expiresIn: '60m'});
    return {
        accessToken,
        refreshToken,
    };
}

module.exports = {
    login
}