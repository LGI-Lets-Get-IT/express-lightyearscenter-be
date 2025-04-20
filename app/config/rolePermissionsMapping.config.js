const { SUPER_ADMIN, STAFF, THERAPIST, SCHOOL_ADMIN, PSYCHOLOGIST,CLIENT } = require('../constants/roles.constant');
const permissions = require('../constants/permissions.constant');

module.exports = {
    [SUPER_ADMIN]: [
        ...permissions.APPOINTMENTS.ALL,
        ...permissions.ASSESSMENTS.ALL,
        ...permissions.TREATMENT_PLANS.ALL,
        ...permissions.TREATMENT_TYPES.ALL,
        ...permissions.TEST_TYPES.ALL,
        ...permissions.CLIENTS.ALL,
        ...permissions.SCHOOLS.ALL,
        ...permissions.EMPLOYEES.ALL,
        permissions.DASHBOARD.VIEW,
        permissions.SETTINGS.VIEW,
    ],
    [PSYCHOLOGIST]: [
        permissions.DASHBOARD.VIEW,
        permissions.SETTINGS.VIEW,

        permissions.APPOINTMENTS.CREATE,
        permissions.APPOINTMENTS.VIEW,
        permissions.APPOINTMENTS.UPDATE,

        ...permissions.ASSESSMENTS.ALL,

        ...permissions.TREATMENT_PLANS.ALL,

        permissions.CLIENTS.VIEW,
        permissions.CLIENTS.UPDATE,

        permissions.SCHOOLS.VIEW,

        ...permissions.TEST_TYPES.ALL,
        ...permissions.TREATMENT_TYPES.ALL,
    ],
    [STAFF]: [
        permissions.DASHBOARD.VIEW,
        ...permissions.APPOINTMENTS.ALL,
        // permissions.APPOINTMENTS.CREATE,
        // permissions.APPOINTMENTS.VIEW,
        // permissions.APPOINTMENTS.UPDATE,
        // permissions.APPOINTMENTS.DELETE,
    ],
    [THERAPIST]: [
        permissions.DASHBOARD.VIEW,
        permissions.SETTINGS.VIEW,

        ...permissions.TREATMENT_SESSIONS.ALL,
        permissions.APPOINTMENTS.VIEW,
        // permissions.APPOINTMENTS.UPDATE,
        permissions.CLIENTS.VIEW,

        permissions.SCHOOLS.VIEW,

        ...permissions.TREATMENT_TYPES.ALL,
    ],
}