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

const getByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;

    const client = await clientService.getClientByUuidWithAppointments(clientUuid);

    res.jsonSuccess(200, "Successfully fetched client data", client);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getClientAppointmentsByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;

    const clientAppointments = await clientService.getClientAppointments(clientUuid);

    res.jsonSuccess(
      200,
      "Successfully fetched client appointments data",
      clientAppointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const {
      schoolId,
      fullName,
      childAge,
      childGender,
      childNationality,
      childDob,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianNationality,
      guardianRelationship,
    } = req.body;

    const bodyData = {
      schoolId,
      fullName,
      age: childAge,
      gender: childGender,
      nationality: childNationality,
      dateOfBirth: childDob,
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

const updateByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;
    const {
      schoolId,
      fullName,
      age,
      gender,
      nationality,
      dateOfBirth,
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
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianNationality,
      guardianRelationship,
    };

    const updatedClient = await clientService.updateClientByUuid(
      clientUuid,
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
  getByUuid,
  getClientAppointmentsByUuid,
  updateByUuid,
  deleteIds,
};
