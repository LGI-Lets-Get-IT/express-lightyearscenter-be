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
    ],
    [PSYCHOLOGIST]: [
        permissions.DASHBOARD,
        permissions.APPOINTMENTS.CREATE,
        permissions.APPOINTMENTS.VIEW,
        permissions.APPOINTMENTS.UPDATE,

        ...permissions.ASSESSMENTS.ALL,
        // permissions.ASSESSMENTS.CREATE,
        // permissions.ASSESSMENTS.VIEW,
        // permissions.ASSESSMENTS.UPDATE,
        // permissions.ASSESSMENTS.DELETE,

        ...permissions.TREATMENT_PLANS.ALL,
        // permissions.TREATMENT_PLANS.CREATE,
        // permissions.TREATMENT_PLANS.VIEW,
        // permissions.TREATMENT_PLANS.UPDATE,
        // permissions.TREATMENT_PLANS.DELETE,

        permissions.CLIENTS.VIEW,
        permissions.CLIENTS.UPDATE,

        permissions.SCHOOLS.VIEW,

        permissions.TEST_TYPES.VIEW,

        permissions.TREATMENT_TYPES.VIEW,
    ],
    [STAFF]: [
        permissions.DASHBOARD,
        ...permissions.APPOINTMENTS.ALL,
        // permissions.APPOINTMENTS.CREATE,
        // permissions.APPOINTMENTS.VIEW,
        // permissions.APPOINTMENTS.UPDATE,
        // permissions.APPOINTMENTS.DELETE,
    ],
    [THERAPIST]: [
        permissions.DASHBOARD,
        ...permissions.TREATMENT_SESSIONS.ALL,
        permissions.APPOINTMENTS.VIEW,
        permissions.CLIENTS.VIEW,
        // permissions.TREATMENT_SESSIONS.CREATE,
        // permissions.TREATMENT_SESSIONS.VIEW,
        // permissions.TREATMENT_SESSIONS.UPDATE,
        // permissions.TREATMENT_SESSIONS.DELETE,
    ],
}