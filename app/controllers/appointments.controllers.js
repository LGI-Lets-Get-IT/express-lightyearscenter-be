const appointmentService = require("../services/appointments.services");
const clientService = require("../services/clients.services");
const roleConstant = require("../constants/roles.constant");
const rolesNameConstant = require("../constants/rolesName.constant");

const getAll = async (req, res) => {
  try {
    let appointments = [];
    if (req.user.role === rolesNameConstant.SUPER_ADMIN || req.user.role === rolesNameConstant.STAFF) {
      appointments = await appointmentService.getAllAppointments();
    } else if (req.user.role === rolesNameConstant.PSYCHOLOGIST) {
      const queryParams = {
        picId: req.user.id,
        picType: rolesNameConstant.PSYCHOLOGIST,
      };

      appointments = await appointmentService.getAllAppointmentsByQueryParams(
        queryParams
      );
    } else if (req.user.role === rolesNameConstant.THERAPIST) {
      const queryParams = {
        picId: req.user.id,
        picType: rolesNameConstant.THERAPIST,
      };

      appointments = await appointmentService.getAllAppointmentsByQueryParams(
        queryParams
      );
    } else {
      const findUser = await clientService.getClientByUuid(req.user.id)
      const queryParams = {
        clientId: findUser.id
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

const create = async (req, res) => {
  try {
    const {
      title,
      clientId,
      picId,
      picType,
      timeStart,
      timeEnd,
      appointmentDate,
      appointmentType,
    } = req.body;

    const bodyData = {
      title,
      clientId,
      picId,
      picType,
      appointmentType,
      appointmentDate,
      bookingTimeStart: timeStart,
      bookingTimeEnd: timeEnd,
    };

    const createdAppointment = await appointmentService.createAppointment(
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
    const appointmentId = req.params.id;
    const {
      psychologistId,
      title,
      appointmentType,
      appointmentDate,
      timeStart,
      timeEnd,
    } = req.body;
    const bodyData = {
      psychologistId,
      title,
      appointmentType,
      appointmentDate,
      timeStart,
      timeEnd,
    }
    const updatedAppointment = await appointmentService.updateAppointmentById(
      appointmentId,
      bodyData
    );
    res.jsonSuccess(200, "Successfully updated appointment data", updatedAppointment);
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

    res.jsonSuccess(200, "Successfully deleted appointments data", deletedAppointments);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
