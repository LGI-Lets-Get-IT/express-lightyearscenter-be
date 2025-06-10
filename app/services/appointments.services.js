const db = require("../models");
const { format } = require('date-fns')
const appointmentRepository =
  require("../repositories/appointments.repositories")(db);
const employeeService = require('./employees.services');
const clientService = require('./clients.services');
const mailService = require('./mail.services');
const { getAgeInYearsMonthDays } = require('../utils/getAge.utils');
const customError = new Error();
const roomOptions = require('../constants/rooms.constant')

const getAllAppointments = async () => {
  console.log('ROOMOPTIONS', roomOptions, roomOptions[1])
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
  const appointment = {
    ...result,
    picName: picData.fullName,
    client: {
      ...result.client,
      age: getAgeInYearsMonthDays(result.client.dateOfBirth),
    }
  }

  return appointment;
}

const getAppointmentsByClientUuid = async (clientUuid) => {
  const result = await appointmentRepository.findByClientUuid(clientUuid);

  return result;
}

const createAppointment = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const checkRoomAvailability = await appointmentRepository.checkRoomAvailable(bodyData.roomId, bodyData.appointmentDate, bodyData.bookingTimeStart, bodyData.bookingTimeEnd);
    if(!checkRoomAvailability) {
      customError.statusCode = 400;
      customError.message = "Room is already booked at that time";
      throw customError
    }
    const createdAppointment = await appointmentRepository.create(bodyData, tr);

    if (!createdAppointment) {
      customError.message = "Failed to create appointment data";
      throw customError;
    }

    console.log('CREATEDAPPOINTMENT', roomOptions, createdAppointment.roomId, roomOptions[createdAppointment.roomId])
    const employeeData = await employeeService.getEmployeeById(bodyData.picId);
    const clientData = await clientService.getClientById(bodyData.clientId)
    const sendEmailToClient = await mailService.sendMail(clientData.guardianEmail, `New Appointment Confirmation: ${createdAppointment.title} on ${format(createdAppointment.appointmentDate, 'dd MMM yyyy')}`, 'APPOINTMENT_CREATED', {
      guardianName: clientData.guardianName,
      clientName: clientData.fullName,
      picName: employeeData.fullName,
      picType: createdAppointment.picType,
      appointmentTitle: createdAppointment.title,
      appointmentType: createdAppointment.appointmentType,
      appointmentDate: format(createdAppointment.appointmentDate, 'dd MMM yyyy'),
      startTime: format(createdAppointment.bookingTimeStart, 'HH:mm'),
      endTime: format(createdAppointment.bookingTimeEnd, 'HH:mm'),
      roomName: roomOptions[createdAppointment.roomId],
      link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
    });

    const sendEmailToPIC = await mailService.sendMail(employeeData.email, `New Appointment Assigned: ${createdAppointment.title} with ${clientData.fullName} on ${format(createdAppointment.appointmentDate, 'dd MMM yyyy')}`, 'APPOINTMENT_PIC_ASSIGNED', {
      fullName: employeeData.fullName,
      clientName: clientData.fullName,
      picType: createdAppointment.picType,
      appointmentTitle: createdAppointment.title,
      appointmentType: createdAppointment.appointmentType,
      appointmentDate: format(createdAppointment.appointmentDate, 'dd MMM yyyy'),
      startTime: format(createdAppointment.bookingTimeStart, 'HH:mm'),
      endTime: format(createdAppointment.bookingTimeEnd, 'HH:mm'),
      roomName: roomOptions[createdAppointment.roomId],
      link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
    });

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
