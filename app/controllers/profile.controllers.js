const clientService = require('../services/clients.services');

const getUserProfile = async (req, res) => {
    try {
        const user = await clientService.getUserProfile(req.user.id)

        res.jsonSuccess(200, "Successfully fetched user profile", user)
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