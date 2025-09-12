const bcrypt = require("bcrypt");
const db = require("../models");
const employeeRepository = require("../repositories/employees.repositories")(
  db
);
const customError = new Error();
const RoleConstant = require("../constants/roles.constant");
const mailService = require("../services/mail.services");

const getAllEmployees = async () => {
  const employees = await employeeRepository.findAll();

  // Convert Sequelize models to plain objects
  return employees.map((employee) =>
    employee.toJSON ? employee.toJSON() : employee
  );
};

const getAllPsychologists = async () => {
  const psychologists = await employeeRepository.findAllByRoleId(
    RoleConstant.PSYCHOLOGIST
  );

  // Convert Sequelize models to plain objects
  return psychologists.map((psychologist) =>
    psychologist.toJSON ? psychologist.toJSON() : psychologist
  );
};

const getAllTherapists = async () => {
  const therapists = await employeeRepository.findAllByRoleId(
    RoleConstant.THERAPIST
  );

  // Convert Sequelize models to plain objects
  return therapists.map((therapist) =>
    therapist.toJSON ? therapist.toJSON() : therapist
  );
};

const getAllEmployeeSchedules = async () => {
  const schedules =
    await employeeRepository.findAllEmployeeWithSchedulesByRoleId([
      RoleConstant.PSYCHOLOGIST,
      RoleConstant.THERAPIST,
    ]);

  // Convert Sequelize models to plain objects
  return schedules.map((schedule) =>
    schedule.toJSON ? schedule.toJSON() : schedule
  );
};

const getAllEmployeesByScheduleWithAvailability = async (
  roleId,
  appointmentDay,
  startTime,
  endTime,
  appointmentDate
) => {
  console.log("getAllEmployeesByScheduleWithAvailability called with:", {
    roleId,
    appointmentDay,
    startTime,
    endTime,
    appointmentDate,
  });

  const schedules = await employeeRepository.findAllBySchedules(
    roleId,
    appointmentDay,
    startTime,
    endTime
  );

  console.log("APPOINTMENTDAY", schedules, appointmentDate);

  // Handle both single date and multiple dates
  const datesToCheck = Array.isArray(appointmentDate)
    ? appointmentDate
    : [appointmentDate];

  console.log("Dates to check for existing appointments:", datesToCheck);

  // Check existing appointments for each employee across all dates
  const schedulesWithAvailability = await Promise.all(
    schedules.map(async (employee) => {
      // Check if employee has existing appointments on ANY of the selected dates
      const hasExistingAppointment = await Promise.all(
        datesToCheck.map((date) =>
          employeeRepository.checkEmployeeAppointment(
            employee.id,
            date,
            startTime,
            endTime
          )
        )
      ).then((results) => results.some((hasAppointment) => hasAppointment));

      // Convert Sequelize model to plain object to avoid circular references
      const employeeData = employee.toJSON ? employee.toJSON() : employee;

      console.log(`Employee ${employeeData.fullName}:`, {
        hasExistingAppointment,
        isAvailable: !hasExistingAppointment,
        datesChecked: datesToCheck,
      });

      return {
        ...employeeData,
        hasExistingAppointment,
        isAvailable: !hasExistingAppointment,
      };
    })
  );

  return schedulesWithAvailability;
};

const getScheduleByEmployeeId = async (employeeId) => {
  const schedules = await employeeRepository.findOneWithSchedulesById(
    employeeId
  );
  return schedules;
};

const getEmployeeByEmail = async (email) => {
  const employee = await employeeRepository.findOneByEmail(email);

  return employee;
};

const getEmployeeById = async (employeeId) => {
  const employee = await employeeRepository.findOneById(employeeId);

  if (!employee) {
    customError.statusCode = 404;
    customError.message = "Employee data not found";

    throw customError;
  }

  return employee;
};

const createEmployee = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  const { password, ...bodyRest } = bodyData;
  const { password: generatedPassword, hashedPassword } = password;
  try {
    const body = {
      ...bodyRest,
      password: hashedPassword,
    };
    const createdEmployee = await employeeRepository.create(body, tr);

    if (!createdEmployee) {
      customError.statusCode = 400;
      customError.message = "Failed to create employee data";

      throw customError;
    }

    await mailService.sendMail(
      bodyRest.email,
      "The Light Years CDC: Employee Account Created",
      "ACCOUNT_CREATED",
      {
        fullName: bodyRest.fullName,
        email: bodyRest.email,
        password: generatedPassword,
      }
    );

    await tr.commit();
    return createdEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateEmployeeById = async (employeeId, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedEmployee = await employeeRepository.updateById(
      employeeId,
      bodyData,
      tr
    );

    if (!updatedEmployee) {
      customError.statusCode = 400;
      customError.message = "Failed to update employee data";

      throw customError;
    }

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateEmployeePasswordById = async (id, password) => {
  const tr = await db.sequelize.transaction();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedEmployee = await employeeRepository.updateById(
      id,
      {
        password: hashedPassword,
      },
      tr
    );

    const employee = await employeeRepository.findOneById(id);
    await mailService.sendMail(
      employee.email,
      "Employee Password Changed",
      "FORGOT_PASSWORD",
      {
        fullName: employee.fullName,
        email: employee.email,
        password: password,
      }
    );

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateEmployeeToken = async (employeeId, token) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedEmployee = await employeeRepository.updateById(employeeId, {
      refreshToken: token,
    });

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const changePassword = async (employeeId, oldPassword, newPassword) => {
  const tr = await db.sequelize.transaction();
  try {
    const employee = await employeeRepository.findPasswordById(employeeId);
    const checkCurrentPassword = await bcrypt.compare(
      oldPassword,
      employee.password
    );

    if (!checkCurrentPassword) {
      customError.statusCode = 400;
      customError.message = "The old password you entered is incorrect";

      throw customError;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedEmployee = await employeeRepository.updateById(
      employeeId,
      {
        password: hashedPassword,
      },
      tr
    );

    await tr.commit();
    return updatedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteEmployeeByIds = async (employeeIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedEmployee = await employeeRepository.deleteByIds(
      employeeIds,
      tr
    );

    await tr.commit();
    return deletedEmployee;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getAllEmployees,
  getAllTherapists,
  getAllPsychologists,
  getAllEmployeeSchedules,
  // getAllEmployeesBySchedule,
  getAllEmployeesByScheduleWithAvailability,
  getScheduleByEmployeeId,
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployeeToken,
  updateEmployeeById,
  updateEmployeePasswordById,
  changePassword,
  deleteEmployeeByIds,
};
