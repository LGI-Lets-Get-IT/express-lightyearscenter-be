const rolesNameConstant = require("../constants/rolesName.constant");
const assessmentService = require("../services/assessments.services");
const customError = new Error();

const getAll = async (req, res) => {
  const { user } = req;
  const { appointmentId } = req.query;
  try {
    let assessments = [];
    if (appointmentId) {
      assessments = await assessmentService.getAssessmentByAppointmentId(
        appointmentId
      );
    } else {
      if (
        user.role === rolesNameConstant.SUPER_ADMIN ||
        user.role === rolesNameConstant.STAFF ||
        user.role === rolesNameConstant.SPED_TEACHER
      ) {
        assessments = await assessmentService.getAllAssessments();
      } else if (user.role === rolesNameConstant.PSYCHOLOGIST) {
        assessments = await assessmentService.getAllAssessmentsByQueryParams({
          psychologistId: user.id,
        });
      } else if (user.role === rolesNameConstant.THERAPIST) {
        plans = await treatmentPlanService.getAllPlansByQueryParams({
          therapistId: user.id,
        });
        const clientIds = plans.map((dt) => dt.clientId);
        assessments = await assessmentService.getAllAssessmentsByQueryParams({
          clientId: [clientIds],
        });
      } else if (!user?.role) {
        assessments = await assessmentService.getAllAssessmentsByQueryParams({
          clientId: user.id,
        });
      }
    }

    res.jsonSuccess(
      200,
      "Successfully fetched all assessments data",
      assessments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const assessment = await assessmentService.getAssessmentById(assessmentId);

    res.jsonSuccess(200, "Successfully fetched assessment data", assessment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getByAppointmentId = async (req, res) => {
  try {
    const { appointmentId } = req.query;
    const assessments = await assessmentService.getAssessmentByAppointmentId(
      appointmentId
    );
    res.jsonSuccess(
      200,
      "Successfully fetched appointment assessment data",
      assessments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const create = async (req, res) => {
  try {
    const { appointmentId, clientId, psychologistId, testId, result } =
      req.body;

    const bodyData = {
      appointmentId,
      clientId,
      psychologistId,
      testTypeId: testId,
      result,
    };

    const createdAppointment = await assessmentService.createAssessment(
      bodyData
    );

    res.jsonSuccess(
      201,
      "Successfully created new assessment data",
      createdAppointment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const { assessmentId } = req.params;
    const { appointmentId, clientId, psychologistId, testId, result } =
      req.body;

    const bodyData = {
      appointmentId,
      clientId,
      psychologistId,
      testTypeId: testId,
      result,
    };
    const updatedAssessment = await assessmentService.updateAssessmentById(
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
    const { assessmentIds } = req.body;
    const deletedAssessments = await assessmentService.deleteAssessmentByIds(
      assessmentIds
    );

    res.jsonSuccess(
      200,
      "Successfully deleted assessments data",
      deletedAssessments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getByAppointmentId,
  updateById,
  deleteIds,
};
