const { google } = require('googleapis')
const { generatePdf } = require('../utils/generatePdf.utils')
const { treatmentSessions, employees, clients } = require('../models')
const db = require('../models')

const getAllFiles = async (appointmentId, uuid, clientName) => {
    const authClient = new google.auth.GoogleAuth({
        keyFile: './the-lightyears-cdc-0cb82813d8e5.json',
        scopes: [ "https://www.googleapis.com/auth/drive" ]
    })

    const driveApi = google.drive({
        version: 'v3',
        auth: authClient
    })
    const folderName = `Appointment_${appointmentId}/${clientName}_${uuid}`

    const folderId = await driveApi.files.list({
        q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
    })

    if (!folderId.data.files.length) {
        throw new Error(`Fol    der "${folderName}" not found.`);
    }

    const filesList = await driveApi.files.list({
        q: `'${folderId.data.files[0].id}' in parents`,
        fields: 'files(id, name, mimeType, webViewLink, size, createdTime)',
    })
    return filesList.data.files
}

const generateDailyProgressReport = async () => {
    const progressData = await treatmentSessions.findOne({
        raw: true,
        nest: true,
        attributes: [
            [db.sequelize.col(`client.full_name`), 'clientName'],
            'activities',
            'short_term_goals',
            'progress'
        ],
        include: [
            {
                model: clients,
                as: 'client',
                attributes: [],
            },
        ]
    })
    const generatedFile = await generatePdf( 'DAILY_PROGRESS_REPORT', progressData)
    return generatedFile
}

const generateTreatmentPlanDoc = async () => {
    const planData = await db.treatmentPlans.findOne({
        plain: true,
        attributes: [
            'consultDate',
            'presentProblem',
            'parentPlan',
        ],
        where: {
            id: 1,
        },
        include: [
            {
                model: db.clients,
                as: 'client',
                attributes: [
                    'fullName',
                    'dateOfBirth',
                    'guardianName',
                    'guardianRelationship',
                ],
                include: [
                    {
                        model: db.clientAssessments,
                        as: 'assessments',
                        include: [
                            {
                                model: db.testTypes,
                                as: 'testType'
                            }
                        ]
                    },
                    {
                        model: db.schools,
                        as: 'school',
                        attributes: ['name'],
                    },
                ]
            },
            {
                model: db.treatmentPrograms,
                as: 'programs',
                attributes: [
                    'id',
                    'aimOfTreatment',
                    'sessionFrequency',
                    'sessionDuration',
                ],
                include: [
                    {
                        model: db.employees,
                        as: 'therapist',
                        attributes: ['full_name'],
                    },
                    {
                        model: db.treatmentTypes,
                        as: 'treatmentType',
                        attributes: ['name'],
                    },
                ]
            },
            {
                model: db.targetedBehaviors,
                as: 'targetedBehaviors',
                // attributes: [],
            }
        ]
    });
    const test = planData.get({ plain: true})
    console.log('test.', test.client.assessments)
    console.log('PLANDATA PLAIN', planData.get({ plain: true }))
    const generatedFile = await generatePdf('TREATMENT_PLAN_REPORT', planData.get({ plain: true }))
    return generatedFile
}

module.exports = {
    getAllFiles,
    generateDailyProgressReport,
    generateTreatmentPlanDoc,
}