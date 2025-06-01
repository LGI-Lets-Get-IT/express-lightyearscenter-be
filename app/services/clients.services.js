const bcrypt = require("bcrypt");
const db = require("../models");
const clientRepository = require("../repositories/clients.repositories")(db);
const clientDetailRepository = require("../repositories/clientDetails.repositories")(db);
const appointmentService = require("../services/appointments.services");
const mailService = require("../services/mail.services");
const { getAgeInYearsMonthDays } = require("../utils/getAge.utils");
const { format } = require("date-fns/format");
const customError = new Error();

const getUserProfile = async (uuid) => {
  const userProfile = await clientRepository.findOneByUuid(uuid);

  if (!userProfile) {
    customError.statusCode = 404;
    customError.message = "User profile not found";

    throw customError;
  }

  return userProfile;
}

const getAllClients = async () => {
  const clients = await clientRepository.findAll();

  return clients;
};

const getClientById = async (clientId) => {
  const client = await clientRepository.findOneById(clientId);

  if (!client) {
    customError.statusCode = 404;
    customError.message = "Client data not found";

    throw customError;
  }

  return client;
};

const getClientByUuid = async (uuid) => {
  const result = await clientRepository.findOneByUuid(uuid);

  if (!result) {
    customError.statusCode = 404;
    customError.message = "Client data not found";

    throw customError;
  }

  return result;
};

const getClientByUuidWithAppointments = async (uuid) => {
  const result = await clientRepository.findOneByUuidWithAppointments(uuid);

  if (!result) {
    customError.statusCode = 404;
    customError.message = "Client data not found";

    throw customError;
  }

  const client = {
    ...result.dataValues,
    age: getAgeInYearsMonthDays(result.dateOfBirth),
    dateOfBirth: format(result.dateOfBirth, 'dd MMM yyyy')
  };
  return client;
};

const getClientByEmail = async (email) => {
  const client = await clientRepository.findOneByEmail(email);

  return client;
}

const getClientAppointments = async (uuid) => {
  const clientAppointments = await appointmentService.getAppointmentsByClientUuid(uuid);

  return clientAppointments;
}
const createClient = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  const { intakeForm, ...bodyRest } = bodyData;  
  const { password, hashedPassword } = bodyData.password
  try {
    const body = {
      ...bodyRest,
      password: hashedPassword,
    }
    const createdClient = await clientRepository.create(body, tr);

    if (!createdClient) {
      customError.message = "Failed to create school data";
      throw customError;
    }

    const createdClientDetails = await clientDetailRepository.create({
      ...intakeForm,
      clientId: createdClient.id,
      institutionsData: intakeForm.institutions,
      guardiansData: intakeForm.guardians
    }, tr)

    await mailService.sendMail(bodyData.guardianEmail, 'Client account created', 'ACCOUNT_CREATED', {
      fullName: bodyData.guardianName,
      email: bodyData.guardianEmail,
      password: password,
    })

    await tr.commit();

    return createdClient;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateClientByUuid = async (uuid, bodyData) => {
  const tr = await db.sequelize.transaction();
  const { intakeForm, ...bodyRest } = bodyData;
  try {
    const updatedClient = await clientRepository.updateByUuid(
      uuid,
      bodyRest,
      tr
    );

    const user = await clientRepository.findOneByUuid(uuid);

    const updatedClientDetails = await clientDetailRepository.updateByClientId(user.id, {
      ...intakeForm,
      institutionsData: intakeForm.institutions,
      guardiansData: intakeForm.guardians,
    }, tr)

    if (!updatedClient[0]) {
      customError.statusCode = 500
      customError.message = "Failed to update client data";
      throw customError;
    }

    await tr.commit();

    return { ...updatedClient[1][0] };
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateClientPasswordByUuid = async (uuid, password) => {
  const tr = await db.sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedClient = await clientRepository.updateByUuid(uuid, {
        password: hashedPassword
      }, tr)

    await tr.commit()

    return updatedClient
  } catch (error) {
    await tr.rollback()
    throw error
  }
}

const deleteClientByUuids = async (clientIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedClient = await clientRepository.deleteByUuids(clientIds, tr);
    if (!deletedClient) {
      customError.message = "Failed to delete clients data";

      throw customError;
    }

    await tr.commit();

    return deletedClient;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getUserProfile,
  getAllClients,
  getClientById,
  getClientByUuid,
  getClientByUuidWithAppointments,
  getClientByEmail,
  getClientAppointments,
  createClient,
  updateClientByUuid,
  updateClientPasswordByUuid,
  deleteClientByUuids,
};
