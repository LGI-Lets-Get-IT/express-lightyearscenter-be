const db = require("../models");
const { Readable } = require("stream");
const { google } = require("googleapis");
const { generatePdf } = require("../utils/generatePdf.utils");
const { treatmentSessions, employees, clients } = require("../models");
// const clientService = require("./clients.services");

const getAllFiles = async (uuid, clientName) => {
  const authClient = new google.auth.GoogleAuth({
    keyFile: "./the-lightyears-cdc-0cb82813d8e5.json",
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  const driveApi = google.drive({
    version: "v3",
    auth: authClient,
  });
  const folderName = `${clientName}_${uuid}`;

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
  console.log('FILESSS', filesList.data)
  return filesList.data.files.map((file) => ({
    id: file.id,
    name: file.name,
    link: file.webViewLink,
    uploader: file.owners[0].emailAddress,
    size: file.size,
    mimeType: file.mimeType,
    createdTime: file.createdTime,
  }));
};

const uploadFile = async (uuid, clientName, fileData) => {
  const tr = await db.sequelize.transaction();
  try {
    const authClient = new google.auth.GoogleAuth({
      keyFile: "./the-lightyears-cdc-0cb82813d8e5.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    const driveApi = google.drive({
      version: "v3",
      auth: authClient,
    });

    const folderName = `${clientName}_${uuid}`;
    const existingFolder = await driveApi.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed = false`,
      fields: "files(id, name)",
      spaces: "drive",
    });

    let folderId;
    if (existingFolder.data.files.length > 0) {
      folderId = existingFolder.data.files[0].id;
    } else {
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: ["1vT39BW-fwBTjuq5g67Lm0RqYSoPDxX4z"],
      };

      const createdFolder = await driveApi.files.create({
        requestBody: folderMetadata,
        fields: "id, name",
      });

      folderId = createdFolder.data.id;
    }

    const uploadedFile = await driveApi.files.create({
      requestBody: {
        name: fileData.originalname,
        mimeType: fileData.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: fileData.mimetype,
        body: Readable.from(fileData.buffer),
      },
    });

    await tr.commit();

    return {
      fileId: uploadedFile.data.id,
      fileName: uploadedFile.data.name,
      folderId: folderId,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    await tr.rollback();
    throw error;
  }
};

const generateDailyProgressReport = async (sessionId) => {
  const progressData = await treatmentSessions.findOne({
    raw: true,
    nest: true,
    where: {
      id: sessionId,
    },
    attributes: [
      [db.sequelize.col(`client.full_name`), "clientName"],
      "activities",
      "short_term_goals",
      "progress",
      // [
      //   db.sequelize.fn(
      //     "TO_CHAR",
      //     db.sequelize.col("TreatmentSession.created_at"),
      //     "DD Mon YYYY"
      //   ),
      //   "createdAt",
      // ],
    ],
    include: [
      {
        model: db.clients,
        as: "client",
        attributes: ['fullName', 'dateOfBirth'],
      },
      {
        model: db.appointments,
        as: 'appointment',
        attributes: [
          [
            db.sequelize.fn(
              "TO_CHAR",
              db.sequelize.col("appointment_date"),
              "DD Mon YYYY"
            ),
            "appointmentDate",
          ],
        ]
      },
      {
        model: db.treatmentPrograms,
        as: "program",
        include: [
          {
            model: db.employees,
            as: "therapist",
            attributes: ['fullName'],
          },
          {
            model: db.treatmentTypes,
            as: "treatmentType",
            attributes: ["name"],
          },
        ],
      },
    ],
  });
  console.log('progressData', progressData.appointment)
  const generatedFile = await generatePdf(
    "DAILY_PROGRESS_REPORT",
    progressData
  );
  return generatedFile;
};

const generateTreatmentPlanDoc = async (planId) => {
  const planData = await db.treatmentPlans.findOne({
    plain: true,
    attributes: [
      [
        db.sequelize.fn(
          "TO_CHAR",
          db.sequelize.col("consult_date"),
          "DD Mon YYYY"
        ),
        "consultDate",
      ],
      "presentProblem",
      "parentPlan",
    ],
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
          [
            db.sequelize.fn(
              "TO_CHAR",
              db.sequelize.col("date_of_birth"),
              "DD Mon YYYY"
            ),
            "formattedDOB",
          ],
          "dateOfBirth",
          [
            db.sequelize.literal(`
              date_part('year', age(current_date, "client"."date_of_birth")) || ' years ' ||
              date_part('month', age(current_date, "client"."date_of_birth")) || ' months ' ||
              date_part('days', age(current_date, "client"."date_of_birth")) || ' days'`),
            "age",
          ],
          "guardianName",
          "guardianRelationship",
          "guardianPhone",
        ],
        include: [
          {
            model: db.clientAssessments,
            as: "assessments",
            attributes: [
              "result",
              [
                db.sequelize.fn(
                  "TO_CHAR",
                  db.sequelize.col("client->assessments.created_at"),
                  "DD Mon YYYY"
                ),
                "createdAt",
              ],
            ],
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
