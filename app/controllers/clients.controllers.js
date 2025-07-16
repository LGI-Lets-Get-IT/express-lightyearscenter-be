const clientService = require("../services/clients.services");
const appointmentService = require("../services/appointments.services");
const treatmentPlanService = require("../services/treatmentPlans.services");
const generateRandomPassword = require("../utils/generatePassword.utils");
const rolesNameConstant = require("../constants/rolesName.constant");

const getAll = async (req, res) => {
  const { user } = req;
  try {
    let clients = [];
    if (
      user.role === rolesNameConstant.SUPER_ADMIN ||
      user.role === rolesNameConstant.STAFF ||
      user.role === rolesNameConstant.SPED_TEACHER
    ) {
      clients = await clientService.getAllClients();
    } else if (user.role === rolesNameConstant.PSYCHOLOGIST) {
      const appointments =
        await appointmentService.getAllAppointmentsByQueryParams({
          picId: user.id,
          picType: rolesNameConstant.PSYCHOLOGIST,
        });

      const relatedClientIds = appointments.map(
        (appointment) => appointment.clientId
      );

      clients = await clientService.getAllClientsById(relatedClientIds);
    } else if (user.role === rolesNameConstant.THERAPIST) {
      const plans = await treatmentPlanService.getAllPlansByQueryParams({
        therapistId: user.id,
      });
      const relatedClientIds = plans.map((plan) => plan.clientId);
      clients = await clientService.getAllClientsById(relatedClientIds);
    }

    res.jsonSuccess(200, "Successfully fetched all clients data", clients);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;

    const client = await clientService.getClientByUuidWithAppointments(
      clientUuid
    );

    res.jsonSuccess(200, "Successfully fetched client data", client);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getClientAppointmentsByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;

    const clientAppointments = await clientService.getClientAppointments(
      clientUuid
    );

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
      gender,
      nationality,
      dateOfBirth,
      problem,
      className,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianNationality,
      guardianRelationship,
      password,
      intakeForm,
    } = req.body;

    const bodyData = {
      schoolId,
      fullName,
      problem,
      gender,
      nationality,
      dateOfBirth,
      className,
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianNationality,
      guardianRelationship,
      password,
      intakeForm,
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
      gender,
      nationality,
      dateOfBirth,
      guardianName,
      guardianPhone,
      guardianEmail,
      guardianNationality,
      guardianRelationship,
      // intakeForm,
    } = req.body;

    const bodyData = {
      schoolId,
      fullName,
      gender,
      nationality,
      dateOfBirth,
      guardianName,
      guardianEmail,
      guardianPhone,
      guardianNationality,
      guardianRelationship,
      // intakeForm,
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

const updatePasswordByUuid = async (req, res) => {
  try {
    const { clientUuid } = req.params;
    const { password } = req.body;

    const updatedClient = await clientService.updateClientPasswordByUuid(
      clientUuid,
      password
    );
    res.jsonSuccess(200, "Successfully updated client password", updatedClient);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteByUuids = async (req, res) => {
  try {
    const { clientIds } = req.body;
    const deletedClient = await clientService.deleteClientByUuids(clientIds);

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
  updatePasswordByUuid,
  deleteByUuids,
};
