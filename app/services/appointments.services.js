const db = require("../models");
const appointmentRepository =
  require("../repositories/appointments.repositories")(db);
const customError = new Error();

const getAllAppointments = async () => {
  const result = await appointmentRepository.findAll();

  return result;
};

const getAppointmentById = async (appointmentId) => {
  const result = await appointmentRepository.findOneById(appointmentId)
  console.log('result', result)

  return result;
}

const getAppointmentsByClientUuid = async (clientUuid) => {
  const result = await appointmentRepository.findByClientUuid(clientUuid);
  
  return result;
}

const createAppointment = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const createdAppointment = await appointmentRepository.create(bodyData, tr);

    if (!createdAppointment) {
      customError.message = "Failed to create appointment data";
      throw customError;
    }

    await tr.commit();

    return createdAppointment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateAppointmentById = async (ingredientId, availQty) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await appointmentRepository.updateById(
      ingredientId,
      {
        available_quantity: availQty,
      },
      tr
    );
    await tr.commit();

    return result;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteAppointmentByIds = async (appointmentIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedAppointments = await appointmentRepository.deleteByIds(appointmentIds, tr);
    if (!deletedAppointments) {
      customError.message = "Failed to delete appointment data";
      throw customError
    }
    await tr.commit();

    return deletedAppointments;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
}

module.exports = {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByClientUuid,
  createAppointment,
  updateAppointmentById,
  deleteAppointmentByIds,
};
