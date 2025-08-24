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
const { getAgeInYearsMonthDays } = require("../utils/getAge.utils");
const customError = new Error();
const roomOptions = require("../constants/rooms.constant");

const getAllAppointments = async () => {
  const result = await appointmentRepository.findAll();

  const appointments = await Promise.all(
    result.map(async (appointment) => {
      const picData = await employeeService.getEmployeeById(appointment.picId);
      return {
        ...appointment,
        picName: picData?.fullName,
      };
    })
  );

  return appointments;
};

const getAllAppointmentsByQueryParams = async (queryParams) => {
  const result = await appointmentRepository.findAll(queryParams);
  const appointments = await Promise.all(
    result.map(async (appointment) => {
      const picData = await employeeService.getEmployeeById(appointment.picId);
      return {
        ...appointment,
        picName: picData?.fullName,
      };
    })
  );

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

    const employeeData = await employeeService.getEmployeeById(bodyData.picId);
    const clientData = await clientService.getClientById(bodyData.clientId);

    if (
      bodyData.appointmentType.toLowerCase() === "treatment" &&
      bodyData.treatmentId &&
      numberOfRepetition > 0
    ) {
      const mapBulkAppointment = [];
      // for (let repetition = 0; repetition < numberOfRepetition; repetition++) {
      //   const newDate = addBusinessDays(
      //     new Date(format(bodyData.appointmentDate, "yyyy-MM-dd")),
      //     7 * repetition
      //   );
      //   const newStartTime = addBusinessDays(
      //     new Date(format(bodyData.bookingTimeStart, "yyyy-MM-dd HH:mm")),
      //     7 * repetition
      //   );
      //   const newEndTime = addBusinessDays(
      //     new Date(format(bodyData.bookingTimeEnd, "yyyy-MM-dd HH:mm")),
      //     7 * repetition
      //   );

      //   mapBulkAppointment.push({
      //     ...rest,
      //     appointmentDate: newDate,
      //     bookingTimeStart: newStartTime,
      //     bookingTimeEnd: newEndTime,
      //     title: `${bodyData.title} - Session ${repetition + 1}`,
      //   });
      // }

      let currentDate = new Date(bodyData.appointmentDate);
      let repetitionCount = 0;
      while (repetitionCount < numberOfRepetition) {
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
            title: `${bodyData.title} - Session ${repetitionCount + 1}`,
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

      for (const appointment of bulkCreatedAppointment) {
        const sendEmailToClient = await mailService.sendMail(
          clientData.guardianEmail,
          `New Appointment Confirmation: ${appointment.title} on ${format(
            appointment.appointmentDate,
            "dd MMM yyyy"
          )}`,
          "APPOINTMENT_CREATED",
          {
            guardianName: clientData.guardianName,
            clientName: clientData.fullName,
            picName: employeeData.fullName,
            picType: appointment.picType,
            appointmentTitle: appointment.title,
            appointmentType: appointment.appointmentType,
            appointmentDate: format(appointment.appointmentDate, "dd MMM yyyy"),
            startTime: format(appointment.bookingTimeStart, "HH:mm"),
            endTime: format(appointment.bookingTimeEnd, "HH:mm"),
            roomName: roomOptions[appointment.roomId],
            link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
          }
        );

        const sendEmailToPIC = await mailService.sendMail(
          employeeData.email,
          `New Appointment Assigned: ${appointment.title} with ${
            clientData.fullName
          } on ${format(appointment.appointmentDate, "dd MMM yyyy")}`,
          "APPOINTMENT_PIC_ASSIGNED",
          {
            fullName: employeeData.fullName,
            clientName: clientData.fullName,
            picType: appointment.picType,
            appointmentTitle: appointment.title,
            appointmentType: appointment.appointmentType,
            appointmentDate: format(appointment.appointmentDate, "dd MMM yyyy"),
            startTime: format(appointment.bookingTimeStart, "HH:mm"),
            endTime: format(appointment.bookingTimeEnd, "HH:mm"),
            roomName: roomOptions[appointment.roomId],
            link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
          }
        );
      }
    } else {
      const createdAppointment = await appointmentRepository.create(rest, tr);
      if (!createdAppointment) {
        customError.message = "Failed to create appointment data";
        throw customError;
      }

      const sendEmailToClient = await mailService.sendMail(
        clientData.guardianEmail,
        `New Appointment Confirmation: ${createdAppointment.title} on ${format(
          createdAppointment.appointmentDate,
          "dd MMM yyyy"
        )}`,
        "APPOINTMENT_CREATED",
        {
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
        }
      );

      const sendEmailToPIC = await mailService.sendMail(
        employeeData.email,
        `New Appointment Assigned: ${createdAppointment.title} with ${
          clientData.fullName
        } on ${format(createdAppointment.appointmentDate, "dd MMM yyyy")}`,
        "APPOINTMENT_PIC_ASSIGNED",
        {
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
        }
      );
    }

    console.log("SAMPE SINI LINE 228 SEBELUM COMMIT");

    await tr.commit();

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
