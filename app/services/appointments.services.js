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

// Helper function to format dates and times for emails in local timezone
const formatForEmail = (date, formatString) => {
  if (formatString === "dd MMM yyyy") {
    // For dates, convert to local timezone
    const localDate = new Date(date);
    return localDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Jakarta",
    });
  } else if (formatString === "HH:mm") {
    // For times, convert to local timezone
    const localTime = new Date(date);
    return localTime.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  }
  return format(date, formatString);
};

const getAllAppointments = async () => {
  console.log(
    "DATE",
    format("2025-09-22", "yyyy-MM-dd"),
    format("2025-09-22", "EEEE")
  );
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

const createAppointmentV1 = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    // Parallel availability checks and data fetching for better performance
    const [
      checkPICAvailability,
      checkRoomAvailability,
      employeeData,
      clientData,
    ] = await Promise.all([
      appointmentRepository.checkPICAvailable(
        bodyData.picId,
        bodyData.appointmentDate,
        bodyData.bookingTimeStart,
        bodyData.bookingTimeEnd
      ),
      appointmentRepository.checkRoomAvailable(
        bodyData.roomId,
        bodyData.appointmentDate,
        bodyData.bookingTimeStart,
        bodyData.bookingTimeEnd
      ),
      employeeService.getEmployeeById(bodyData.picId),
      clientService.getClientById(bodyData.clientId),
    ]);

    if (!checkPICAvailability) {
      customError.statusCode = 400;
      customError.message = "PIC already has an appointment at that time";
      throw customError;
    }

    if (!checkRoomAvailability) {
      customError.statusCode = 400;
      customError.message = "Room is already booked at that time";
      throw customError;
    }

    const createdAppointment = await appointmentRepository.create(bodyData, tr);

    if (!createdAppointment) {
      customError.message = "Failed to create appointment data";
      throw customError;
    }

    // Queue emails for background processing to avoid blocking response
    const emailQueue = require("./emailQueue.service");

    // Queue client email
    emailQueue.add({
      to: clientData.guardianEmail,
      subject: `New Appointment Confirmation: ${
        createdAppointment.title
      } on ${formatForEmail(
        createdAppointment.appointmentDate,
        "dd MMM yyyy"
      )}`,
      template: "APPOINTMENT_CREATED",
      data: {
        guardianName: clientData.guardianName,
        clientName: clientData.fullName,
        picName: employeeData.fullName,
        picType: createdAppointment.picType,
        appointmentTitle: createdAppointment.title,
        appointmentType: createdAppointment.appointmentType,
        appointmentDate: formatForEmail(
          createdAppointment.appointmentDate,
          "dd MMM yyyy"
        ),
        startTime: formatForEmail(createdAppointment.bookingTimeStart, "HH:mm"),
        endTime: formatForEmail(createdAppointment.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[createdAppointment.roomId],
        // link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
        link:
          process.env.NODE_ENV === "production"
            ? `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`
            : `https://dashboard-staging.thelightyearscdc.com/appointments/${createdAppointment.id}`,
      },
    });

    // Queue PIC email
    emailQueue.add({
      to: employeeData.email,
      subject: `New Appointment Assigned: ${createdAppointment.title} with ${
        clientData.fullName
      } on ${formatForEmail(
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
        appointmentDate: formatForEmail(
          createdAppointment.appointmentDate,
          "dd MMM yyyy"
        ),
        startTime: formatForEmail(createdAppointment.bookingTimeStart, "HH:mm"),
        endTime: formatForEmail(createdAppointment.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[createdAppointment.roomId],
        link:
          process.env.NODE_ENV === "production"
            ? `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`
            : `https://dashboard-staging.thelightyearscdc.com/appointments/${createdAppointment.id}`,
      },
    });

    await tr.commit();

    return createdAppointment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const createAppointmentV2 = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  const { treatmentId, numberOfRepetition, therapyDays, ...rest } = bodyData;

  try {
    // Check PIC availability
    const checkPICAvailability = await appointmentRepository.checkPICAvailable(
      bodyData.picId,
      bodyData.appointmentDate,
      bodyData.bookingTimeStart,
      bodyData.bookingTimeEnd
    );
    if (!checkPICAvailability) {
      customError.statusCode = 400;
      customError.message = "PIC already has an appointment at that time";
      throw customError;
    }

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
        // Fix timezone issue: Get day name without UTC conversion
        const dayNames = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayName = dayNames[currentDate.getDay()];

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
            } on ${formatForEmail(appointment.appointmentDate, "dd MMM yyyy")}`,
            template: "APPOINTMENT_CREATED",
            data: {
              guardianName: clientData.guardianName,
              clientName: clientData.fullName,
              picName: employeeData.fullName,
              picType: appointment.picType,
              appointmentTitle: appointment.title,
              appointmentType: appointment.appointmentType,
              appointmentDate: formatForEmail(
                appointment.appointmentDate,
                "dd MMM yyyy"
              ),
              startTime: formatForEmail(appointment.bookingTimeStart, "HH:mm"),
              endTime: formatForEmail(appointment.bookingTimeEnd, "HH:mm"),
              roomName: roomOptions[appointment.roomId],
              // link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
              link:
                process.env.NODE_ENV === "production"
                  ? `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`
                  : `https://dashboard-staging.thelightyearscdc.com/appointments/${appointment.id}`,
            },
          });

          // Queue PIC email
          emailQueue.add({
            to: employeeData.email,
            subject: `New Appointment Assigned: ${appointment.title} with ${
              clientData.fullName
            } on ${formatForEmail(appointment.appointmentDate, "dd MMM yyyy")}`,
            template: "APPOINTMENT_PIC_ASSIGNED",
            data: {
              fullName: employeeData.fullName,
              clientName: clientData.fullName,
              picType: appointment.picType,
              appointmentTitle: appointment.title,
              appointmentType: appointment.appointmentType,
              appointmentDate: formatForEmail(
                appointment.appointmentDate,
                "dd MMM yyyy"
              ),
              startTime: formatForEmail(appointment.bookingTimeStart, "HH:mm"),
              endTime: formatForEmail(appointment.bookingTimeEnd, "HH:mm"),
              roomName: roomOptions[appointment.roomId],
              // link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
              link:
                process.env.NODE_ENV === "production"
                  ? `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`
                  : `https://dashboard-staging.thelightyearscdc.com/appointments/${appointment.id}`,
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
            // link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
            link:
              process.env.NODE_ENV === "production"
                ? `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`
                : `https://dashboard-staging.thelightyearscdc.com/appointments/${createdAppointment.id}`,
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
            // link: `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`,
            link:
              process.env.NODE_ENV === "production"
                ? `https://dashboard.thelightyearscdc.com/appointments/${createdAppointment.id}`
                : `https://dashboard-staging.thelightyearscdc.com/appointments/${createdAppointment.id}`,
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

const confirmAppointmentById = async (appointmentId) => {
  const tr = await db.sequelize.transaction();

  try {
    const updateBody = {
      isConfirmed: true,
    };
    const result = await appointmentRepository.updateById(
      appointmentId,
      updateBody,
      tr
    );

    await tr.commit();

    return result;
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
      `Appointment Updated: ${bodyData.title} on ${formatForEmail(
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
        appointmentDate: formatForEmail(
          bodyData.appointmentDate,
          "dd MMM yyyy"
        ),
        startTime: formatForEmail(bodyData.bookingTimeStart, "HH:mm"),
        endTime: formatForEmail(bodyData.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[bodyData.roomId],
        // link: `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`,
        link:
          process.env.NODE_ENV === "production"
            ? `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`
            : `https://dashboard-staging.thelightyearscdc.com/appointments/${appointmentId}`,
      }
    );

    const sendEmailToPIC = await mailService.sendMail(
      employeeData.email,
      `Appointment Updated: ${bodyData.title} with ${
        clientData.fullName
      } on ${formatForEmail(bodyData.appointmentDate, "dd MMM yyyy")}`,
      "APPOINTMENT_PIC_UPDATED",
      {
        fullName: employeeData.fullName,
        clientName: clientData.fullName,
        picType: bodyData.picType,
        appointmentTitle: bodyData.title,
        appointmentType: bodyData.appointmentType,
        appointmentDate: formatForEmail(
          bodyData.appointmentDate,
          "dd MMM yyyy"
        ),
        startTime: formatForEmail(bodyData.bookingTimeStart, "HH:mm"),
        endTime: formatForEmail(bodyData.bookingTimeEnd, "HH:mm"),
        roomName: roomOptions[bodyData.roomId],
        // link: `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`,
        link:
          process.env.NODE_ENV === "production"
            ? `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`
            : `https://dashboard-staging.thelightyearscdc.com/appointments/${appointmentId}`,
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
    const deletedAppointmentData = await appointmentRepository.findOneById(
      ...appointmentIds
    );
    console.log("deletedAppointmentData", deletedAppointmentData);
    const deletedAppointments = await appointmentRepository.deleteByIds(
      appointmentIds,
      tr
    );
    if (!deletedAppointments) {
      customError.message = "Failed to delete appointment data";
      throw customError;
    }

    const employeeData = await employeeService.getEmployeeById(
      deletedAppointmentData.picId
    );
    const sendEmailToClient = await mailService.sendMail(
      deletedAppointmentData.client?.guardianEmail,
      `Appointment Cancelled: ${
        deletedAppointmentData.title
      } on ${formatForEmail(
        deletedAppointmentData.appointmentDate,
        "dd MMM yyyy"
      )}`,
      "APPOINTMENT_CANCELLED",
      {
        guardianName: deletedAppointmentData.client?.guardianName,
        clientName: deletedAppointmentData.client?.fullName,
        picName: employeeData.fullName,
        picType: deletedAppointmentData.picType,
        appointmentTitle: deletedAppointmentData.title,
        appointmentType: deletedAppointmentData.appointmentType,
        appointmentDate: formatForEmail(
          deletedAppointmentData.appointmentDate,
          "dd MMM yyyy"
        ),
        appointmentTime: deletedAppointmentData.appointmentTime,
        roomName: roomOptions[deletedAppointmentData.roomId],
      }
    );

    // const sendEmailToPIC = await mailService.sendMail(
    //   employeeData.email,
    //   `Appointment Cancelled: ${bodyData.title} with ${
    //     clientData.fullName
    //   } on ${formatForEmail(bodyData.appointmentDate, "dd MMM yyyy")}`,
    //   "APPOINTMENT_PIC_UPDATED",
    //   {
    //     fullName: employeeData.fullName,
    //     clientName: clientData.fullName,
    //     picType: bodyData.picType,
    //     appointmentTitle: bodyData.title,
    //     appointmentType: bodyData.appointmentType,
    //     appointmentDate: formatForEmail(
    //       bodyData.appointmentDate,
    //       "dd MMM yyyy"
    //     ),
    //     startTime: formatForEmail(bodyData.bookingTimeStart, "HH:mm"),
    //     endTime: formatForEmail(bodyData.bookingTimeEnd, "HH:mm"),
    //     roomName: roomOptions[bodyData.roomId],
    //     link: `https://dashboard.thelightyearscdc.com/appointments/${appointmentId}`,
    //   }
    // );
    await tr.commit();

    return deletedAppointments;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const createBulkAppointments = async (appointmentsData) => {
  const tr = await db.sequelize.transaction();

  try {
    // Validate that all appointments have the same PIC
    const picIds = [...new Set(appointmentsData.map((apt) => apt.picId))];
    if (picIds.length > 1) {
      customError.statusCode = 400;
      customError.message = "All appointments must have the same PIC";
      throw customError;
    }

    const picId = picIds[0];
    const clientId = appointmentsData[0].clientId;
    const roomId = appointmentsData[0].roomId;

    // Fetch employee and client data once
    const [employeeData, clientData] = await Promise.all([
      employeeService.getEmployeeById(picId),
      clientService.getClientById(clientId),
    ]);

    // Validate PIC availability for all dates
    const employeeSchedule = await employeeService.getScheduleByEmployeeId(
      picId
    );

    console.log(
      "Employee schedule for PIC:",
      picId,
      employeeSchedule,
      employeeSchedule.schedules
    );

    for (const appointment of appointmentsData) {
      // const appointmentDay = format(
      //   new Date(appointment.appointmentDate),
      //   "EEEE"
      // );
      console.log(
        "APPOINTMENTT DATE",
        appointment.appointmentDate,
        format(appointment.appointmentDate, "yyyy-MM-dd HH:mm:ss xx")
      );
      // Fix timezone issue: Parse date without UTC conversion
      const dateStr = appointment.appointmentDate.split(" ")[0]; // Extract YYYY-MM-DD part
      const dateParts = dateStr.split("-");
      const year = parseInt(dateParts[0]);
      const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed
      const day = parseInt(dateParts[2]);
      const dateObj = new Date(year, month, day);

      const dayNames = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const appointmentDay = dayNames[dateObj.getDay()];

      console.log(`Checking appointment for ${appointmentDay}:`, appointment);

      // Check if PIC is available on this day
      const daySchedule = employeeSchedule.schedules?.find((schedule) =>
        schedule.availableDays.includes(appointmentDay)
      );

      console.log(`Day schedule for ${appointmentDay}:`, daySchedule);

      if (!daySchedule) {
        customError.statusCode = 400;
        customError.message = `PIC is not available on ${appointmentDay}`;
        throw customError;
      }

      // Check if time is within PIC's available hours
      // const appointmentStartTime = format(
      //   new Date(appointment.bookingTimeStart),
      //   "HH:mm"
      // );
      // const appointmentEndTime = format(
      //   new Date(appointment.bookingTimeEnd),
      //   "HH:mm"
      // );
      // Fix timezone issue: Convert UTC times to local time for comparison
      const appointmentStartTimeUTC = new Date(appointment.bookingTimeStart);
      const appointmentEndTimeUTC = new Date(appointment.bookingTimeEnd);

      // Get local time by using the server's timezone
      const appointmentStartTime = appointmentStartTimeUTC.toLocaleTimeString(
        "en-US",
        {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta", // +7 timezone
        }
      );
      const appointmentEndTime = appointmentEndTimeUTC.toLocaleTimeString(
        "en-US",
        {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Jakarta", // +7 timezone
        }
      );

      console.log(
        `Time check: ${appointmentStartTime}-${appointmentEndTime} vs ${daySchedule.availableStartTime}-${daySchedule.availableEndTime}`
      );

      if (
        appointmentStartTime < daySchedule.availableStartTime ||
        appointmentEndTime > daySchedule.availableEndTime
      ) {
        customError.statusCode = 400;
        customError.message = `PIC is not available at the selected time on ${appointmentDay}`;
        throw customError;
      }

      // Check PIC availability for each appointment
      const checkPICAvailability =
        await appointmentRepository.checkPICAvailable(
          picId,
          appointment.appointmentDate,
          appointment.bookingTimeStart,
          appointment.bookingTimeEnd
        );

      if (!checkPICAvailability) {
        customError.statusCode = 400;
        customError.message = `PIC already has an appointment on ${format(
          // new Date(appointment.appointmentDate),
          appointment.appointmentDate,
          "dd MMM yyyy"
        )} at ${appointmentStartTime}-${appointmentEndTime}`;
        throw customError;
      }

      // Check room availability for each appointment
      const checkRoomAvailability =
        await appointmentRepository.checkRoomAvailable(
          roomId,
          appointment.appointmentDate,
          appointment.bookingTimeStart,
          appointment.bookingTimeEnd
        );

      if (!checkRoomAvailability) {
        customError.statusCode = 400;
        customError.message = `Room is already booked on ${format(
          // new Date(appointment.appointmentDate),
          appointment.appointmentDate,
          "dd MMM yyyy"
        )} at ${appointmentStartTime}-${appointmentEndTime}`;
        throw customError;
      }
    }

    // Create all appointments
    const bulkCreatedAppointments = await appointmentRepository.bulkCreate(
      appointmentsData,
      tr
    );

    if (!bulkCreatedAppointments || bulkCreatedAppointments.length === 0) {
      customError.statusCode = 400;
      customError.message = "Failed to create bulk appointments";
      throw customError;
    }

    // Commit transaction first, then queue emails
    await tr.commit();

    // Queue emails with rate limiting
    setTimeout(() => {
      bulkCreatedAppointments.forEach((appointment, index) => {
        // Queue client email
        emailQueue.add({
          to: clientData.guardianEmail,
          subject: `New Appointment Confirmation: ${
            appointment.title
          } on ${formatForEmail(appointment.appointmentDate, "dd MMM yyyy")}`,
          template: "APPOINTMENT_CREATED",
          data: {
            guardianName: clientData.guardianName,
            clientName: clientData.fullName,
            picName: employeeData.fullName,
            picType: appointment.picType,
            appointmentTitle: appointment.title,
            appointmentType: appointment.appointmentType,
            appointmentDate: formatForEmail(
              appointment.appointmentDate,
              "dd MMM yyyy"
            ),
            startTime: formatForEmail(appointment.bookingTimeStart, "HH:mm"),
            endTime: formatForEmail(appointment.bookingTimeEnd, "HH:mm"),
            roomName: roomOptions[appointment.roomId],
            // link: `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`,
            link:
              process.env.NODE_ENV === "production"
                ? `https://dashboard.thelightyearscdc.com/appointments/${appointment.id}`
                : `https://dashboard-staging.thelightyearscdc.com/appointments/${appointment.id}`,
          },
        });

        // Queue PIC email (only once for bulk appointments)
        if (index === 0) {
          emailQueue.add({
            to: employeeData.email,
            subject: `New Appointment Assigned: ${appointmentsData.length} appointments with ${clientData.fullName}`,
            template: "APPOINTMENT_PIC_ASSIGNED",
            data: {
              fullName: employeeData.fullName,
              clientName: clientData.fullName,
              appointmentCount: appointmentsData.length,
              appointmentTitle: appointmentsData[0].title,
              appointmentType: appointmentsData[0].appointmentType,
              // link: `https://dashboard.thelightyearscdc.com/appointments`,
              link:
                process.env.NODE_ENV === "production"
                  ? `https://dashboard.thelightyearscdc.com/appointments`
                  : `https://dashboard-staging.thelightyearscdc.com/appointments`,
            },
          });
        }
      });
    }, 0);

    return bulkCreatedAppointments;
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
  createAppointmentV1,
  createAppointmentV2,
  createBulkAppointments,
  updateAppointmentById,
  deleteAppointmentByIds,
  confirmAppointmentById,
};
