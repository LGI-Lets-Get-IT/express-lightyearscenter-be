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

const getByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const schedule = await picScheduleService.getScheduleByEmployeeId(
      employeeId
    );

    res.jsonSuccess(200, "Successfully fetched PIC schedule data", schedule);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const { employeeId, schedules } = req.body;

    const mappedBody = [];
    for (const schedule of schedules) {
      mappedBody.push({
        employeeId,
        availableDays: schedule.availableDays,
        availableStartTime: schedule.availableStartTime,
        availableEndTime: schedule.availableEndTime,
      });
    }

    const createdSchedule = await picScheduleService.createSchedule(mappedBody);

    res.jsonSuccess(
      201,
      "Successfully created new PIC schedule data",
      createdSchedule
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { schedules } = req.body;

    // First, delete all existing schedules for this employee
    await picScheduleService.deleteSchedulesByEmployeeId(employeeId);

    // Then create new schedules
    const mappedBody = [];
    for (const schedule of schedules) {
      mappedBody.push({
        employeeId,
        availableDays: schedule.availableDays,
        availableStartTime: schedule.availableStartTime,
        availableEndTime: schedule.availableEndTime,
      });
    }

    const updatedSchedules = await picScheduleService.createSchedule(
      mappedBody
    );

    res.jsonSuccess(
      200,
      "Successfully updated PIC schedule data",
      updatedSchedules
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
  getByEmployeeId,
  updateByEmployeeId,
  deleteIds,
};
