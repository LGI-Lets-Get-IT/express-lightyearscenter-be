const db = require("../models");
const { Readable } = require("stream");
const { google } = require("googleapis");
const { generatePdf } = require("../utils/generatePdf.utils");
const mailService = require("../services/mail.services");
const { treatmentSessions, employees, clients } = require("../models");
const { format } = require("date-fns/format");
const clientService = require("./clients.services");
const treatmentPlanService = require("./treatmentPlans.services");

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
    q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed = false`,
    spaces: "drive",
    supportsAllDrives: true,
    driveId: process.env.DRIVE_ID,
    includeItemsFromAllDrives: true,
    corpora: "drive",
  });

  if (!folderId.data.files.length) {
    return;
  }

  const filesList = await driveApi.files.list({
    q: `'${folderId.data.files[0].id}' in parents`,
    fields: "files(id, name, mimeType, webViewLink, size, createdTime)",
    supportsAllDrives: true,
    driveId: process.env.DRIVE_ID,
    includeItemsFromAllDrives: true,
    corpora: "drive",
  });
  return filesList.data.files.map((file) => ({
    id: file.id,
    name: file.name,
    link: file.webViewLink,
    // uploader: file.owners[0].emailAddress,
    size: file.size,
    mimeType: file.mimeType,
    createdTime: file.createdTime,
  }));
};

const uploadFile = async (currentUser, uuid, clientName, fileData) => {
  const tr = await db.sequelize.transaction();
  try {
    const authClient = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_KEY_FILE,
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
      supportsAllDrives: true,
      driveId: process.env.DRIVE_ID,
      includeItemsFromAllDrives: true,
      corpora: "drive",
    });

    let folderId;
    if (existingFolder.data.files.length > 0) {
      folderId = existingFolder.data.files[0].id;
    } else {
      const folderMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [`${process.env.DRIVE_ID}`],
      };
      const createdFolder = await driveApi.files.create({
        requestBody: folderMetadata,
        fields: "id, name",
        supportsAllDrives: true,
      });

      folderId = createdFolder.data.id;
    }

    console.log("FILEDATAAA", fileData);
    const uploadedFile = await driveApi.files.create({
      supportsAllDrives: true,
      requestBody: {
        name: fileData.originalname,
        mimeType: fileData.mimetype,
        parents: [folderId],
      },
      media: {
        mimeType: fileData.mimetype,
        body: Readable.from(fileData.buffer),
      },
      fields: "id, name, webViewLink",
    });

    const client = await clientService.getClientByUuid(uuid);
    const plans = await treatmentPlanService.getAllPlansWithProgramsByClientId(
      client.id
    );
    const psychologistEmails = plans.map((plan) => plan.psychologist.email);
    console.log("psychologistEmails", psychologistEmails);
    const therapistEmails = plans.flatMap((plan) =>
      plan.programs.map((program) => program.therapist.email)
    );
    console.log("therapistEmails", therapistEmails);
    const emailToShare = [
      currentUser.email,
      client.guardianEmail,
      ...psychologistEmails,
      ...therapistEmails,
    ];
    console.log("EMAILTOSHARE", emailToShare);
    for (const email of emailToShare) {
      const addPermission = await driveApi.permissions.create({
        sendNotificationEmail: false,
        fileId: folderId,
        requestBody: {
          emailAddress: email,
          type: "user",
          role: "writer",
        },
        supportsAllDrives: true,
      });
    }

    await tr.commit();

    console.log("UPLOADEDFILE", uploadedFile, uploadedFile.data);

    return {
      fileId: uploadedFile.data.id,
      fileName: uploadedFile.data.name,
      folderId: folderId,
      webViewLink: uploadedFile.data.webViewLink,
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
        attributes: ["fullName", "dateOfBirth"],
      },
      {
        model: db.appointments,
        as: "appointment",
        attributes: [
          [
            db.sequelize.fn(
              "TO_CHAR",
              db.sequelize.col("appointment_date"),
              "DD Mon YYYY"
            ),
            "appointmentDate",
          ],
        ],
      },
      {
        model: db.treatmentPrograms,
        as: "program",
        include: [
          {
            model: db.employees,
            as: "therapist",
            attributes: ["fullName"],
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
          "guardianEmail",
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

  return { data: planData?.get({ plain: true }), generatedFile };
};

module.exports = {
  getAllFiles,
  uploadFile,
  generateDailyProgressReport,
  generateTreatmentPlanDoc,
};
