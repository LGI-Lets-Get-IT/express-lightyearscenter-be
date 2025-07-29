const { format } = require("date-fns/format");
const db = require("../models");
const assessmentRepository =
  require("../repositories/assessments.repositories")(db);
const customError = new Error();

const getAllSchedules = async () => {
  const schedules = await assessmentRepository.findAll();

  return schedules;
};

const getScheduleById = async (scheduleId) => {
  const schedule = await employeeAvailability.findOneById(scheduleId);

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
    const createdSchedule = await assessmentRepository.create(bodyData, tr);

    if (!createdSchedule) {
      customError.statusCode = 500;
      customError.message = "Failed to create client assessment data";
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
    const updatedSchedule = await assessmentRepository.updateById(
      id,
      bodyData,
      tr
    );

    if (!updatedSchedule[0]) {
      customError.statusCode = 500;
      customError.message = "Failed to update assessment data";
      throw customError;
    }

    await tr.commit();

    return updatedSchedule;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteScheduleByIds = async (assessmentIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedSchedule = await assessmentRepository.deleteByIds(
      assessmentIds,
      tr
    );
    if (!deletedSchedule) {
      customError.statusCode = 500;
      customError.message = "Failed to delete assessments data";

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
  getScheduleById,
  createSchedule,
  updateScheduleById,
  deleteScheduleByIds,
};
