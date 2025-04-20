const assessmentService = require("../services/assessments.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const appointments = await assessmentService.getAllAssessments();

    res.jsonSuccess(
      200,
      "Successfully fetched all assessments data",
      appointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await assessmentService.getAssessmentById(
      assessmentId
    );

    res.jsonSuccess(200, "Successfully fetched assessment data", assessment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const {
      appointmentId,
      client,
      psychologistId,
      result,
    } = req.body;

    const bodyData = {
      appointmentId,
      client,
      psychologistId,
      result,
    };

    const createdAppointment = await assessmentService.createAssessment(
      bodyData
    );

    res.jsonSuccess(201, "Successfully created new assessment data",createdAppointment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    const { available_quantity } = req.body;
    const updatedAssessment = await assessmentService.updateAssessmentById(
      assessmentId,
      
    );
    res.jsonSuccess(200, "Successfully updated assessment data", updatedAssessment);
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

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
