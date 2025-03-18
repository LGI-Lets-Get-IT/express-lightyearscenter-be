const clientService = require("../services/clients.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();

    res.jsonSuccess(200, "Successfully fetched all clients data", clients);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { clientId } = req.params;

    const client = await clientService.getClientById(clientId);

    res.jsonSuccess(200, "Successfully fetched client data", client);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const {
      schoolId,
      fullName,
      age,
      gender,
      nationality,
      dateOfBirth,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianNationality,
      guardianRelationship,
    } = req.body;

    const bodyData = {
      schoolId,
      fullName,
      age,
      gender,
      nationality,
      dateOfBirth,
      address,
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianNationality,
      guardianRelationship,
    };

    const createdClient = await clientService.createClient(bodyData);

    res.jsonSuccess(201, "Successfully created new client", createdClient);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const {
      schoolId,
      fullName,
      age,
      gender,
      nationality,
      dateOfBirth,
      address,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianNationality,
      guardianRelationship,
    } = req.body;

    const bodyData = {
      schoolId,
      fullName,
      age,
      gender,
      nationality,
      dateOfBirth,
      address,
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianNationality,
      guardianRelationship,
    };

    const updatedClient = await clientService.updateClientById(
      clientId,
      bodyData
    );
    res.jsonSuccess(200, "Successfully updated client data", updatedClient);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
    const { clientIds } = req.body;
    const deletedClient = await clientService.deleteClientById(clientIds);

    res.jsonSuccess(200, "Successfully deleted clients data", deletedClient);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
