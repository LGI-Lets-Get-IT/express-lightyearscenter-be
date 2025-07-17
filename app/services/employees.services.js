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

  return employees;
};

const getAllPsychologists = async () => {
  const psychologists = await employeeRepository.findAllByRoleId(
    RoleConstant.PSYCHOLOGIST
  );

  return psychologists;
};

const getAllTherapists = async () => {
  const psychologists = await employeeRepository.findAllByRoleId(
    RoleConstant.THERAPIST
  );

  return psychologists;
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
  getEmployeeById,
  getEmployeeByEmail,
  createEmployee,
  updateEmployeeToken,
  updateEmployeeById,
  updateEmployeePasswordById,
  changePassword,
  deleteEmployeeByIds,
};
