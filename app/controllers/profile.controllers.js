const clientService = require('../services/clients.services');
const employeeService = require('../services/employees.services');
const { getAge } = require('../utils/getAge.utils');

const getUserProfile = async (req, res) => {
    try {
        let user = null;
        if (req.user?.role) {
            user = await employeeService.getEmployeeById(req.user.id);
        } else {
            user = await clientService.getUserProfile(req.user.id)
        }

        const userProfile = {
            ...user.dataValues,
            ...(user?.dateOfBirth && { age: getAge(user.dateOfBirth) }),
            email: user.email || user.guardianEmail,
        }

        res.jsonSuccess(200, "Successfully fetched user profile", userProfile)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error);
    }
}

const editUserProfile = async (req, res) => {
    try {
        // const updatedUser = await clientService
        const updatedUser = true;
        res.jsonSuccess(200, "Successfully updated user profile", updatedUser)
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error)
    }
}

module.exports = {
    getUserProfile,
    editUserProfile,
}