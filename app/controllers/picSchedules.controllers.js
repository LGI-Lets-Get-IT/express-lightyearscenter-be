const picScheduleService = require("../services/picSchedules.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const schedules = await picScheduleService.getAllSchedules();

    res.jsonSuccess(
      200,
      "Successfully fetched all PIC schedules data",
      schedules
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const schedule = await picScheduleService.getScheduleById(scheduleId);

    res.jsonSuccess(200, "Successfully fetched PIC schedule data", schedule);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const { employeeId, schedules } = req.body;
    const bodyData = {
      employeeId,
      schedules,
    }

    const createdSchedule = await picScheduleService.createSchedule(bodyData);

    res.jsonSuccess(
      201,
      "Successfully created new PIC schedule data",
      createdSchedule
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const { appointmentId, clientId, psychologistId, testId, result } =
      req.body;

    const bodyData = {
      appointmentId,
      clientId,
      psychologistId,
      testTypeId: testId,
      result,
    };
    const updatedAssessment = await picScheduleService.updateScheduleById(
      assessmentId,
      bodyData
    );
    res.jsonSuccess(
      200,
      "Successfully updated assessment data",
      updatedAssessment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
    const { scheduleIds } = req.body;
    const deletedSchedules = await picScheduleService.deleteScheduleByIds(
      scheduleIds
    );

    res.jsonSuccess(
      200,
      "Successfully deleted PIC schedules data",
      deletedSchedules
    );
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
