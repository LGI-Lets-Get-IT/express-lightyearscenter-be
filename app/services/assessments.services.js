const { format } = require("date-fns/format");
const db = require("../models");
const assessmentRepository =
  require("../repositories/assessments.repositories")(db);
const customError = new Error();
const emailQueue = require("../services/emailQueue.service");
const clientService = require("../services/clients.services");
const testTypeService = require("../services/testTypes.services");
const employeeService = require("../services/employees.services");

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

const getAllAssessments = async () => {
  const assessments = await assessmentRepository.findAll();

  const mappedAssessments = assessments.map((assessment) => ({
    ...assessment,
    assessmentDate: format(assessment.assessmentDate, "dd MMM yyyy"),
  }));

  return mappedAssessments;
};

const getAllAssessmentsByQueryParams = async (queryParams) => {
  const assessments = await assessmentRepository.findAll(queryParams);

  const mappedAssessments = assessments.map((assessment) => ({
    ...assessment,
    assessmentDate: format(assessment.assessmentDate, "dd MMM yyyy"),
  }));

  return mappedAssessments;
};

const getAssessmentById = async (assessmentId) => {
  const assessment = await assessmentRepository.findOneById(assessmentId);

  if (!assessment) {
    customError.statusCode = 404;
    customError.message = "Assessment data not found";

    throw customError;
  }

  return assessment;
};

const getAssessmentByAppointmentId = async (appointmentId) => {
  const assessments = await assessmentRepository.findAllByAppointmentId(
    appointmentId
  );

  return assessments;
};

const createAssessment = async (bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const createdAssessment = await assessmentRepository.create(bodyData, tr);

    console.log("CREATEDASSESSMENT", createdAssessment);
    if (!createdAssessment) {
      customError.statusCode = 500;
      customError.message = "Failed to create client assessment data";
      throw customError;
    }

    const [employeeData, clientData, testData] = await Promise.all([
      employeeService.getEmployeeById(bodyData.psychologistId),
      clientService.getClientById(bodyData.clientId),
      testTypeService.getTestTypeById(bodyData.testTypeId),
    ]);

    console.log("EMPLOYEE DATA", employeeData);
    console.log("CLIENT DATA", clientData);
    console.log("TEST DATA", testData);

    emailQueue.add({
      to: clientData.guardianEmail,
      subject: `Client Assessment Created`,
      template: "ASSESSMENT_CREATED",
      data: {
        guardianName: clientData.guardianName,
        clientName: clientData.fullName,
        psychologistName: employeeData.fullName,
        assessmentDate: formatForEmail(bodyData.assessmentDate, "dd MMM yyyy"),
        testName: testData.name,
        testResult: bodyData.result,
        link: `https://dashboard.thelightyearscdc.com/assessments/${createdAssessment.id}`,
      },
    });

    await tr.commit();

    return createdAssessment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const updateAssessmentById = async (id, bodyData) => {
  const tr = await db.sequelize.transaction();
  try {
    const updatedAssessment = await assessmentRepository.updateById(
      id,
      bodyData,
      tr
    );

    if (!updatedAssessment[0]) {
      customError.statusCode = 500;
      customError.message = "Failed to update assessment data";
      throw customError;
    }

    await tr.commit();

    return updatedAssessment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

const deleteAssessmentByIds = async (assessmentIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedAssessment = await assessmentRepository.deleteByIds(
      assessmentIds,
      tr
    );
    if (!deletedAssessment) {
      customError.statusCode = 500;
      customError.message = "Failed to delete assessments data";

      throw customError;
    }

    await tr.commit();

    return deletedAssessment;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
};

module.exports = {
  getAllAssessments,
  getAllAssessmentsByQueryParams,
  getAssessmentById,
  getAssessmentByAppointmentId,
  createAssessment,
  updateAssessmentById,
  deleteAssessmentByIds,
};
