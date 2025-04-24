const fileService = require('../services/files.services');
const getAll = async (req, res) => {
    try {
        const { appointmentId, uuid, clientName } = req.query
        const files = await fileService.getAllFiles(appointmentId, uuid, clientName);
    
        res.jsonSuccess(200, "Successfully fetched all files data", files);
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message);
    }
}

module.exports = {
    getAll,
}