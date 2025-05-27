const roleConstant = require('../constants/roles.constant');
const rolesNameConstant = require('../constants/rolesName.constant');
const { appointments } = require('../models');
const appointmentService = require('../services/appointments.services')
const clientService = require('../services/clients.services')

const getDashboardData = async (req, res) => {
    try {
        const { user } = req;
        let totalClients = 0, totalAppointments = 0, totalAssessments = 0, totalEmployees = 0, totalPlans = 0, totalSchools = 0
        let data = {}
        switch (user.role) {
            case rolesNameConstant.SUPER_ADMIN:
                totalAppointments = await appointmentService.getAllAppointments()
                totalAppointments = totalAppointments.length;
                totalClients = await clientService.getAllClients();
                totalClients = totalClients.length;
                data = { totalAppointments, totalClients, totalAssessments, totalEmployees, totalPlans, totalSchools }
                break;
            case rolesNameConstant.ADMIN:
                totalAppointments = await appointmentService.getAllAppointments();
                totalAppointments = totalAppointments.length
                totalClients = await clientService.getAllClients();
                totalClients = totalClients.length;
                data = { totalAppointments, totalClients, totalAssessments, totalEmployees, totalPlans, totalSchools }
                break;
            case rolesNameConstant.PSYCHOLOGIST:
                totalAppointments = await appointmentService.getAllAppointmentsByQueryParams({
                    picId: user.id,
                    picType: rolesNameConstant.PSYCHOLOGIST,
                });
                totalAppointments = totalAppointments.length
                data = { totalAppointments, totalAssessments, totalPlans }
                break;
            case rolesNameConstant.THERAPIST:
                totalAppointments = await appointmentService.getAllAppointmentsByQueryParams({
                    picId: user.id,
                    picType: rolesNameConstant.THERAPIST,
                });
                totalAppointments = totalAppointments.length
                data = { totalAppointments, totalAssessments, totalPlans }
                break;
            // case rolesNameConstant.SPED_TEACHER:
            //     // Fetch data for special education teacher
            //     break;

            default:
                // Handle other roles or default case
                break;
        }

        res.jsonSuccess(200, "Successfully fetched dashboard data", data);
    } catch (error) {
        res.jsonFailed(error?.statusCode, error?.message, error);
    }
}

module.exports = {
    getDashboardData,
}