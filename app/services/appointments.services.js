const db = require("../models");
const appointmentRepository =
  require("../repositories/appointments.repositories")(db);
const employeeService = require('./employees.services')
const customError = new Error();

const getAllAppointments = async () => {
  const result = await appointmentRepository.findAll();

  const appointments = await Promise.all(result.map(async (appointment) => {
    // console.log('APPOINTMENT', appointment.picId)
    const picData = await employeeService.getEmployeeById(appointment.picId);
    return {
      ...appointment,
      picName: picData?.fullName,
    }
  }))

  return appointments;
};

const getAllAppointmentsByQueryParams = async (queryParams) => {
  const result = await appointmentRepository.findAll(queryParams);
  const appointments = await Promise.all(result.map(async (appointment) => {
    const picData = await employeeService.getEmployeeById(appointment.picId);
    return {
      ...appointment,
      picName: picData?.fullName,
    }
  }))

  return appointments;
}

const getAppointmentById = async (appointmentId) => {
  const result = await appointmentRepository.findOneById(appointmentId)

  const picData = await employeeService.getEmployeeById(result.picId);
  result.dataValues.picName = picData.fullName
  // if (!result) {
  //   customError.statusCode = 404;
  //   customError.message = "Appointment not found";
  //   throw customError;
  // }

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

const updateAppointmentById = async (appointmentId, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await appointmentRepository.updateById(
      appointmentId, bodyData,
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
  getAllAppointmentsByQueryParams,
  getAppointmentById,
  getAppointmentsByClientUuid,
  createAppointment,
  updateAppointmentById,
  deleteAppointmentByIds,
};
