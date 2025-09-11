const db = require("../models");
const {
  format,
  addBusinessDays,
  set,
  getHours,
  getMinutes,
  addDays,
} = require("date-fns");
const appointmentRepository =
  require("../repositories/appointments.repositories")(db);
const employeeService = require("./employees.services");
const clientService = require("./clients.services");
const mailService = require("./mail.services");
const emailQueue = require("./emailQueue.service");
const { getAgeInYearsMonthDays } = require("../utils/getAge.utils");
const customError = new Error();
const roomOptions = require("../constants/rooms.constant");

const getAllAppointments = async () => {
  const result = await appointmentRepository.findAll();

  // Get all unique PIC IDs to fetch employee data in one query
  const picIds = [...new Set(result.map((appointment) => appointment.picId))];

  // Fetch all employee data at once
  const employeesData = await Promise.all(
    picIds.map((picId) => employeeService.getEmployeeById(picId))
  );

  // Create a map for quick lookup
  const employeeMap = new Map();
  employeesData.forEach((employee) => {
    if (employee) {
      employeeMap.set(employee.id, employee);
    }
  });

  // Map appointments with employee data
  const appointments = result.map((appointment) => ({
    ...appointment,
    picName: employeeMap.get(appointment.picId)?.fullName || "Unknown",
  }));

  return appointments;
};

const getAllAppointmentsByQueryParams = async (queryParams) => {
  const result = await appointmentRepository.findAll(queryParams);

  // Get all unique PIC IDs to fetch employee data in one query
  const picIds = [...new Set(result.map((appointment) => appointment.picId))];

  // Fetch all employee data at once
  const employeesData = await Promise.all(
    picIds.map((picId) => employeeService.getEmployeeById(picId))
  );

  // Create a map for quick lookup
  const employeeMap = new Map();
  employeesData.forEach((employee) => {
    if (employee) {
      employeeMap.set(employee.id, employee);
    }
  });

  // Map appointments with employee data
  const appointments = result.map((appointment) => ({
    ...appointment,
    picName: employeeMap.get(appointment.picId)?.fullName || "-",
  }));

  return appointments;
};

const getAppointmentById = async (appointmentId) => {
  const result = await appointmentRepository.findOneById(appointmentId);

  const picData = await employeeService.getEmployeeById(result.picId);
  const appointment = {
    ...result,
    picName: picData.fullName,
    client: {
      ...result.client,
      age: getAgeInYearsMonthDays(result.client.dateOfBirth),
    },
  };

  return appointment;
};

const getAppointmentsByClientUuid = async (clientUuid) => {
  const result = await appointmentRepository.findByClientUuid(clientUuid);

  return result;
};

const createAppointment = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  const { treatmentId, numberOfRepetition, therapyDays, ...rest } = bodyData;

  try {
    const checkRoomAvailability =
      await appointmentRepository.checkRoomAvailable(
        bodyData.roomId,
        bodyData.appointmentDate,
        bodyData.bookingTimeStart,
        bodyData.bookingTimeEnd
      );
    if (!checkRoomAvailability) {
      customError.statusCode = 400;
      customError.message = "Room is already booked at that time";
      throw customError;
    }

    // Fetch employee and client data once
    const [employeeData, clientData] = await Promise.all([
      employeeService.getEmployeeById(bodyData.picId),
      clientService.getClientById(bodyData.clientId),
    ]);

    if (
      bodyData.appointmentType.toLowerCase() === "treatment" &&
      bodyData.treatmentId &&
      numberOfRepetition > 0
    ) {
      const mapBulkAppointment = [];

      let currentDate = new Date(bodyData.appointmentDate);
      let repetitionCount = 1;
      while (repetitionCount <= numberOfRepetition) {
        const dayName = format(currentDate, "EEEE"); // Monday, Tuesday, etc.

        if (therapyDays.includes(dayName)) {
          // Adjust start and end times for this date
          const startTime = set(currentDate, {
            hours: getHours(new Date(bodyData.bookingTimeStart)),
            minutes: getMinutes(new Date(bodyData.bookingTimeStart)),
          });

          const endTime = set(currentDate, {
            hours: getHours(new Date(bodyData.bookingTimeEnd)),
            minutes: getMinutes(new Date(bodyData.bookingTimeEnd)),
          });

          mapBulkAppointment.push({
            ...rest,
            appointmentDate: currentDate,
            bookingTimeStart: startTime,
            bookingTimeEnd: endTime,
            title: `${bodyData.title} - ${bodyData.treatmentName} - Session ${repetitionCount}`,
          });

          repetitionCount++;
        }

        // Move to next day
        currentDate = addDays(currentDate, 1);
      }

      const bulkCreatedAppointment = await appointmentRepository.bulkCreate(
        mapBulkAppointment,
        tr
      );

      if (!bulkCreatedAppointment) {
        customError.message = "Failed to create appointment data";
        throw customError;
      }

      // Commit transaction first, then queue emails
      await tr.commit();

      // Queue emails with rate limiting
      setTimeout(() => {
        bulkCreatedAppointment.forEach((appointment) => {
          // Queue client email
          emailQueue.add({
            to: clientData.guardianEmail,
            subject: `New Appointment Confirmation: ${
              appointment.title
            } on ${format(appointment.appointmentDate, "dd MMM yyyy")}`,
            template: "APPOINTMENT_CREATED",
            data: {
              guardianName: clientData.guardianName,
              clientName: clientData.fullName,
              picName: employeeData.fullName,
              picType: appointment.picType,
              appointmentTitle: appointment.title,
              appointmentType: appointment.appointmentType,
              appointmentDate: format(
                appointment.appointmentDate,
                "dd MMM yyyy"
              ),
              startTime: format(appointment.bookingTimeStart, "HH:mm"),
              endTime: format(appointment.bookingTimeEnd, "HH:mm"),
              roomName: roomOptions[appointment.roomId],
              link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
            },
          });

          // Queue PIC email
          emailQueue.add({
            to: employeeData.email,
            subject: `New Appointment Assigned: ${appointment.title} with ${
              clientData.fullName
            } on ${format(appointment.appointmentDate, "dd MMM yyyy")}`,
            template: "APPOINTMENT_PIC_ASSIGNED",
            data: {
              fullName: employeeData.fullName,
              clientName: clientData.fullName,
              picType: appointment.picType,
              appointmentTitle: appointment.title,
              appointmentType: appointment.appointmentType,
              appointmentDate: format(
                appointment.appointmentDate,
                "dd MMM yyyy"
              ),
              startTime: format(appointment.bookingTimeStart, "HH:mm"),
              endTime: format(appointment.bookingTimeEnd, "HH:mm"),
              roomName: roomOptions[appointment.roomId],
              link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
            },
          });
        });
      }, 0);
    } else {
      const createdAppointment = await appointmentRepository.create(rest, tr);
      if (!createdAppointment) {
        customError.message = "Failed to create appointment data";
        throw customError;
      }

      // Commit transaction first, then queue emails
      await tr.commit();

      // Queue emails with rate limiting
      setTimeout(() => {
        // Queue client email
        emailQueue.add({
          to: clientData.guardianEmail,
          subject: `New Appointment Confirmation: ${
            createdAppointment.title
          } on ${format(createdAppointment.appointmentDate, "dd MMM yyyy")}`,
          template: "APPOINTMENT_CREATED",
          data: {
            guardianName: clientData.guardianName,
            clientName: clientData.fullName,
            picName: employeeData.fullName,
            picType: createdAppointment.picType,
            appointmentTitle: createdAppointment.title,
            appointmentType: createdAppointment.appointmentType,
            appointmentDate: format(
              createdAppointment.appointmentDate,
              "dd MMM yyyy"
            ),
            startTime: format(createdAppointment.bookingTimeStart, "HH:mm"),
            endTime: format(createdAppointment.bookingTimeEnd, "HH:mm"),
            roomName: roomOptions[createdAppointment.roomId],
            link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
          },
        });

        // Queue PIC email
        emailQueue.add({
          to: employeeData.email,
          subject: `New Appointment Assigned: ${
            createdAppointment.title
          } with ${clientData.fullName} on ${format(
            createdAppointment.appointmentDate,
            "dd MMM yyyy"
          )}`,
          template: "APPOINTMENT_PIC_ASSIGNED",
          data: {
            fullName: employeeData.fullName,
            clientName: clientData.fullName,
            picType: createdAppointment.picType,
            appointmentTitle: createdAppointment.title,
            appointmentType: createdAppointment.appointmentType,
            appointmentDate: format(
              createdAppointment.appointmentDate,
              "dd MMM yyyy"
            ),
            startTime: format(createdAppointment.bookingTimeStart, "HH:mm"),
            endTime: format(createdAppointment.bookingTimeEnd, "HH:mm"),
            roomName: roomOptions[createdAppointment.roomId],
            link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
          },
        });
      }, 0);
    }

    return;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateAppointmentById = async (appointmentId, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await appointmentRepository.updateById(
      appointmentId,
      bodyData,
      tr
    );

    const employeeData = await employeeService.getEmployeeById(bodyData.picId);
    const clientData = await clientService.getClientById(bodyData.clientId);
    const sendEmailToClient = await mailService.sendMail(
      clientData.guardianEmail,
      `Appointment Updated: ${bodyData.title} on ${format(
        bodyData.appointmentDate,
        "dd MMM yyyy"
      )}`,
      "APPOINTMENT_UPDATED",
      {
        guardianName: clientData.guardianName,
        clientName: clientData.fullName,
        picName: employeeData.fullName,
        picType: bodyData.picType,
        appointmentTitle: bodyData.title,
        appointmentType: bodyData.appointmentType,
        appointmentDate: format(bodyData.appointmentDate, "dd MMM yyyy"),
        startTime: format(bodyData.bookingTimeStart, "HH:mm"),
        endTime: format(bodyData.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[bodyData.roomId],
        link: `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`,
      }
    );

    const sendEmailToPIC = await mailService.sendMail(
      employeeData.email,
      `Appointment Updated: ${bodyData.title} with ${
        clientData.fullName
      } on ${format(bodyData.appointmentDate, "dd MMM yyyy")}`,
      "APPOINTMENT_PIC_UPDATED",
      {
        fullName: employeeData.fullName,
        clientName: clientData.fullName,
        picType: bodyData.picType,
        appointmentTitle: bodyData.title,
        appointmentType: bodyData.appointmentType,
        appointmentDate: format(bodyData.appointmentDate, "dd MMM yyyy"),
        startTime: format(bodyData.bookingTimeStart, "HH:mm"),
        endTime: format(bodyData.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[bodyData.roomId],
        link: `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`,
      }
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
    const deletedAppointments = await appointmentRepository.deleteByIds(
      appointmentIds,
      tr
    );
    if (!deletedAppointments) {
      customError.message = "Failed to delete appointment data";
      throw customError;
    }
    await tr.commit();

    return deletedAppointments;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getAllAppointments,
  getAllAppointmentsByQueryParams,
  getAppointmentById,
  getAppointmentsByClientUuid,
  createAppointment,
  updateAppointmentById,
  deleteAppointmentByIds,
};
