const db = require("../models");
const { Readable } = require('stream')
const { google } = require("googleapis");
const { generatePdf } = require("../utils/generatePdf.utils");
const { treatmentSessions, employees, clients } = require("../models");
// const clientService = require("./clients.services");

const getAllFiles = async (appointmentId, uuid, clientName) => {
  const authClient = new google.auth.GoogleAuth({
    keyFile: "./the-lightyears-cdc-0cb82813d8e5.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveApi = google.drive({
    version: "v3",
    auth: authClient,
  });
  const folderName = `Appointment_${appointmentId}/${clientName}_${uuid}`;

  const folderId = await driveApi.files.list({
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
  });

  if (!folderId.data.files.length) {
    return;
  }

  const filesList = await driveApi.files.list({
    q: `'${folderId.data.files[0].id}' in parents`,
    fields: "files(id, name, mimeType, webViewLink, size, createdTime, owners)",
  });
  return filesList.data.files.map((file) => ({
    name: file.name,
    link: file.webViewLink,
    uploader: file.owners[0].emailAddress,
    size: file.size,
    mimeType: file.mimeType,
    createdTime: file.createdTime,
  }));
};

const uploadFile = async (appointmentId, uuid, clientName, fileData) => {
  const authClient = new google.auth.GoogleAuth({
    keyFile: "./the-lightyears-cdc-0cb82813d8e5.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveApi = google.drive({
    version: "v3",
    auth: authClient,
  });

  const folderName = `Appointment_${appointmentId}/${clientName}_${uuid}`;
  const folderMetadata = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
    parents: ['1vT39BW-fwBTjuq5g67Lm0RqYSoPDxX4z']
  }

  const createdFolder = await driveApi.files.create({
    requestBody: folderMetadata,
    fields: 'id, name'
  });

  const uploadedFile = await driveApi.files.create({
    requestBody: {
      name: fileData.originalname,
      mimeType: fileData.mimetype,
      parents: [`${createdFolder.data.id}`]
    },
    media: {
      mimeType: fileData.mimetype,
      body: Readable.from(fileData.buffer)
    }
  })

  return createdFolder.data
}

const generateDailyProgressReport = async () => {
  const progressData = await treatmentSessions.findOne({
    raw: true,
    nest: true,
    attributes: [
      [db.sequelize.col(`client.full_name`), "clientName"],
      "activities",
      "short_term_goals",
      "progress",
    ],
    include: [
      {
        model: clients,
        as: "client",
        attributes: [],
      },
    ],
  });
  const generatedFile = await generatePdf(
    "DAILY_PROGRESS_REPORT",
    progressData
  );
  return generatedFile;
};

const generateTreatmentPlanDoc = async (planId) => {
  const planData = await db.treatmentPlans.findOne({
    plain: true,
    attributes: ["consultDate", "presentProblem", "parentPlan"],
    where: {
      id: planId,
    },
    include: [
      {
        model: db.employees,
        as: "psychologist",
        attributes: ["fullName"],
      },
      {
        model: db.clients,
        as: "client",
        attributes: [
          "fullName",
          "dateOfBirth",
          "guardianName",
          "guardianRelationship",
        ],
        include: [
          {
            model: db.clientAssessments,
            as: "assessments",
            include: [
              {
                model: db.testTypes,
                as: "testType",
              },
            ],
          },
          {
            model: db.schools,
            as: "school",
            attributes: ["name"],
          },
        ],
      },
      {
        model: db.treatmentPrograms,
        as: "programs",
        attributes: [
          "id",
          "aimOfTreatment",
          "sessionFrequency",
          "sessionDuration",
        ],
        include: [
          {
            model: db.employees,
            as: "therapist",
            attributes: ["full_name"],
          },
          {
            model: db.treatmentTypes,
            as: "treatmentType",
            attributes: ["name"],
          },
        ],
      },
      {
        model: db.targetedBehaviors,
        as: "targetedBehaviors",
        // attributes: [],
      },
    ],
  });
  const generatedFile = await generatePdf(
    "TREATMENT_PLAN_REPORT",
    planData?.get({ plain: true })
  );
  return generatedFile;
};

module.exports = {
  getAllFiles,
  uploadFile,
  generateDailyProgressReport,
  generateTreatmentPlanDoc,
};
