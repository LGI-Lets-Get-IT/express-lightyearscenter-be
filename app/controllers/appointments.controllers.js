const appointmentService = require("../services/appointments.services");
const clientService = require("../services/clients.services");
const employeeService = require("../services/employees.services");
const roleConstant = require("../constants/roles.constant");
const rolesNameConstant = require("../constants/rolesName.constant");

const getAll = async (req, res) => {
  const { user } = req;
  try {
    let appointments = [];
    if (
      user.role === rolesNameConstant.SUPER_ADMIN ||
      user.role === rolesNameConstant.STAFF ||
      user.role === rolesNameConstant.SPED_TEACHER
    ) {
      appointments = await appointmentService.getAllAppointments();
    } else if (user.role === rolesNameConstant.PSYCHOLOGIST) {
      const queryParams = {
        picId: user.id,
        picType: rolesNameConstant.PSYCHOLOGIST,
      };

      appointments = await appointmentService.getAllAppointmentsByQueryParams(
        queryParams
      );
    } else if (user.role === rolesNameConstant.THERAPIST) {
      const queryParams = {
        picId: user.id,
        picType: rolesNameConstant.THERAPIST,
      };

      appointments = await appointmentService.getAllAppointmentsByQueryParams(
        queryParams
      );
    } else if (!user?.role) {
      const findUser = await clientService.getClientByUuid(user.id);
      const queryParams = {
        clientId: findUser.id,
      };

      appointments = await appointmentService.getAllAppointmentsByQueryParams(
        queryParams
      );
    }

    res.jsonSuccess(
      200,
      "Successfully fetched all appointments data",
      appointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getAppointmentById(
      appointmentId
    );

    res.jsonSuccess(200, "Successfully fetched appointment data", appointment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getForTreatmentProgress = async (req, res) => {
  try {
    const queryParams = {
      clientId: req.query.clientId,
      appointmentType: "Treatment",
    };
    const appointment =
      await appointmentService.getAllAppointmentsByQueryParams(queryParams);

    res.jsonSuccess(200, "Successfully fetched appointment data", appointment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getForAssessments = async (req, res) => {
  try {
    const queryParams = {
      clientId: req.query.clientId,
      appointmentType: "Assessment",
    };
    const appointment =
      await appointmentService.getAllAppointmentsByQueryParams(queryParams);

    res.jsonSuccess(200, "Successfully fetched appointment data", appointment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const {
      title,
      clientId,
      picId,
      roomId,
      timeStart,
      timeEnd,
      appointmentDate,
      appointmentType,
      // treatmentId,
      // treatmentName,
      // numberOfRepetition,
      // therapyDays,
    } = req.body;

    const bodyData = {
      title,
      clientId,
      picId,
      roomId,
      picType:
        appointmentType.toLowerCase() === "treatment"
          ? "Therapist"
          : "Psychologist",
      appointmentType,
      appointmentDate,
      bookingTimeStart: timeStart,
      bookingTimeEnd: timeEnd,
      // treatmentId,
      // treatmentName,
      // numberOfRepetition,
      // therapyDays,
    };

    const createdAppointment = await appointmentService.createAppointmentV1(
      bodyData
    );

    res.jsonSuccess(
      201,
      "Successfully created new appointment data",
      createdAppointment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const {
      title,
      picId,
      roomId,
      appointmentType,
      appointmentDate,
      timeStart,
      timeEnd,
      clientId,
    } = req.body;
    const bodyData = {
      title,
      picId,
      roomId,
      clientId,
      appointmentType,
      appointmentDate,
      picType:
        appointmentType.toLowerCase() === "treatment"
          ? "Therapist"
          : "Psychologist",
      bookingTimeStart: timeStart,
      bookingTimeEnd: timeEnd,
    };
    const updatedAppointment = await appointmentService.updateAppointmentById(
      appointmentId,
      bodyData
    );
    res.jsonSuccess(
      200,
      "Successfully updated appointment data",
      updatedAppointment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const confirmPicAttendanceById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const bodyData = {
      isConfirmed: true,
    };
    console.log("APPOINTMENTID", appointmentId);
    // const updatedAppointment = await appointmentService.updateAppointmentById(
    //   appointmentId,
    //   bodyData
    // );
    const confirmedAppointment =
      await appointmentService.confirmAppointmentById(appointmentId);
    res.jsonSuccess(
      200,
      "Successfully confirmed attandence",
      confirmedAppointment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
    const { appointmentIds } = req.body;
    const deletedAppointments = await appointmentService.deleteAppointmentByIds(
      appointmentIds
    );

    res.jsonSuccess(
      200,
      "Successfully deleted appointments data",
      deletedAppointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const createBulk = async (req, res) => {
  try {
    const { appointments } = req.body;

    if (
      !appointments ||
      !Array.isArray(appointments) ||
      appointments.length === 0
    ) {
      return res.jsonFailed(
        400,
        "Appointments array is required and must not be empty"
      );
    }

    // Transform the appointments data to match the expected format
    const transformedAppointments = appointments.map((appointment) => ({
      title: appointment.title,
      clientId: appointment.clientId,
      picId: appointment.picId,
      roomId: appointment.roomId,
      picType:
        appointment.appointmentType.toLowerCase() === "treatment"
          ? "Therapist"
          : "Psychologist",
      appointmentType: appointment.appointmentType,
      appointmentDate: appointment.appointmentDate,
      bookingTimeStart: appointment.timeStart,
      bookingTimeEnd: appointment.timeEnd,
      treatmentId: appointment.treatmentId,
    }));

    const createdAppointments = await appointmentService.createBulkAppointments(
      transformedAppointments
    );

    res.jsonSuccess(
      201,
      `Successfully created ${createdAppointments.length} bulk appointments`,
      createdAppointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  createBulk,
  getAll,
  getById,
  getForTreatmentProgress,
  getForAssessments,
  updateById,
  confirmPicAttendanceById,
  deleteIds,
};
