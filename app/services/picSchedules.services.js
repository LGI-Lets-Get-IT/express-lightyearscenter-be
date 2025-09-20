const { format } = require("date-fns/format");
const db = require("../models");
const picAvailabilityRepository =
  require("../repositories/picAvailability.repositories")(db);
const employeeService = require("../services/employees.services");
const customError = new Error();

const getAllSchedules = async () => {
  // const schedules = await picAvailabilityRepository.findAll();
  const employeeSchedules = await employeeService.getAllEmployeeSchedules();

  return employeeSchedules;
};

const getScheduleByEmployeeId = async (employeeId) => {
  const schedule = await employeeService.getScheduleByEmployeeId(employeeId);

  if (!schedule) {
    customError.statusCode = 404;
    customError.message = "Schedule data not found";

    throw customError;
  }

  return schedule;
};

const createSchedule = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const createdSchedule = await picAvailabilityRepository.bulkCreate(
      bodyData,
      tr
    );
    if (!createdSchedule) {
      customError.statusCode = 500;
      customError.message = "Failed to create PIC schedule data";
      throw customError;
    }

    await tr.commit();

    return createdSchedule;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateScheduleById = async (id, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedSchedule = await picAvailabilityRepository.updateById(
      id,
      bodyData,
      tr
    );

    if (!updatedSchedule[0]) {
      customError.statusCode = 500;
      customError.message = "Failed to update PIC schedule data";
      throw customError;
    }

    await tr.commit();

    return updatedSchedule;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteSchedulesByEmployeeId = async (employeeId) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedSchedules = await picAvailabilityRepository.deleteByEmployeeId(
      employeeId,
      tr
    );

    await tr.commit();

    return deletedSchedules;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteScheduleByIds = async (scheduleIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedSchedule = await picAvailabilityRepository.deleteByIds(
      scheduleIds,
      tr
    );
    if (!deletedSchedule) {
      customError.statusCode = 500;
      customError.message = "Failed to delete PIC schedule data";

      throw customError;
    }

    await tr.commit();

    return deletedSchedule;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getAllSchedules,
  getScheduleByEmployeeId,
  createSchedule,
  updateScheduleById,
  deleteSchedulesByEmployeeId,
  deleteScheduleByIds,
};
