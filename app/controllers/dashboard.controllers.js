const roleConstant = require("../constants/roles.constant");
const rolesNameConstant = require("../constants/rolesName.constant");
const appointmentService = require("../services/appointments.services");
const assessmentService = require("../services/assessments.services");
const clientService = require("../services/clients.services");
const treatmentPlanService = require("../services/treatmentPlans.services");
const employeeService = require("../services/employees.services");
const schoolService = require("../services/schools.services");

const getDashboardData = async (req, res) => {
  try {
    const { user } = req;
    let assessments = [],
      appointments = [],
      employees = [],
      clients = [],
      plans = [],
      schools = [];

    let data = {};
    if (
      user.role === rolesNameConstant.SUPER_ADMIN ||
      user.role === rolesNameConstant.SPED_TEACHER
    ) {
      appointments = await appointmentService.getAllAppointments();
      clients = await clientService.getAllClients();
      assessments = await assessmentService.getAllAssessments();
      plans = await treatmentPlanService.getAllPlans();
      schools = await schoolService.getAllSchools();
      employees = await employeeService.getAllEmployees();

      data = {
        totalAppointments: appointments.length,
        totalClients: clients.length,
        totalAssessments: assessments.length,
        totalEmployees: employees.length,
        totalPlans: plans.length,
        totalSchools: schools.length,
      };
    } else if (user.role === rolesNameConstant.STAFF) {
      appointments = await appointmentService.getAllAppointments();
      clients = await clientService.getAllClients();
      schools = await schoolService.getAllSchools();

      data = {
        totalAppointments: appointments.length,
        totalClients: clients.length,
        totalSchools: schools.length,
      };
    } else if (user.role === rolesNameConstant.PSYCHOLOGIST) {
      appointments = await appointmentService.getAllAppointmentsByQueryParams({
        picId: user.id,
        picType: rolesNameConstant.PSYCHOLOGIST,
      });
      assessments = await assessmentService.getAllAssessmentsByQueryParams({
        psychologistId: user.id,
      });
      plans = await treatmentPlanService.getAllPlansByQueryParams({
        psychologistId: user.id,
      });

      const relatedClientUuids = [
        ...new Set(appointments.map((appointment) => appointment.clientId)),
      ];

      if (relatedClientUuids.length) {
        clients = await clientService.getAllClientsByUuid(relatedClientUuids);
      }
      data = {
        totalAppointments: appointments.length,
        totalAssessments: assessments.length,
        totalPlans: plans.length,
        totalClients: clients.length,
      };
    } else if (user.role === rolesNameConstant.SCHOOL_PIC) {
    } else if (user.role === rolesNameConstant.THERAPIST) {
      appointments = await appointmentService.getAllAppointmentsByQueryParams({
        picId: user.id,
        picType: rolesNameConstant.THERAPIST,
      });
      plans = await treatmentPlanService.getAllPlansByQueryParams({
        therapistId: user.id,
      });

      const clientIds = plans.map((dt) => dt.clientId);
      const clientIds2 = appointments.map((dt) => dt.clientRawId);
      const mergedClientIds = Array.from(
        new Set([...clientIds, ...clientIds2])
      );
      if (mergedClientIds.length > 0) {
        assessments = await assessmentService.getAllAssessmentsByQueryParams({
          clientId: [mergedClientIds],
        });
        clients = await clientService.getAllClientsById(mergedClientIds);
      }

      data = {
        totalAppointments: appointments.length,
        totalAssessments: assessments.length,
        totalPlans: plans.length,
        totalClients: clients.length,
      };
    } else {
      const clientData = await clientService.getClientByUuidWithAppointments(
        user.id
      );
      appointments = await appointmentService.getAllAppointmentsByQueryParams({
        clientId: clientData.id,
      });
      assessments = await assessmentService.getAllAssessmentsByQueryParams({
        clientId: clientData.id,
      });
      plans = await treatmentPlanService.getAllPlansByClientId(user.id);
      data = {
        totalAppointments: appointments.length,
        totalAssessments: assessments.length,
        totalPlans: plans.length,
      };
    }

    res.jsonSuccess(200, "Successfully fetched dashboard data", data);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  getDashboardData,
};
