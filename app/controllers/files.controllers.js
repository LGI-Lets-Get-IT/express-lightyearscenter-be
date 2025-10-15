const { format } = require("sequelize/lib/utils");
const fileService = require("../services/files.services");
const mailService = require("../services/mail.services");

const getAll = async (req, res) => {
  try {
    const { uuid, clientName } = req.query;
    const files = await fileService.getAllFiles(uuid, clientName);

    res.jsonSuccess(200, "Successfully fetched all files data", files);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const uploadFile = async (req, res) => {
  try {
    const { uuid, clientName } = req.body;
    const uploadedFile = await fileService.uploadFile(
      req.user,
      uuid,
      clientName,
      req.file
    );
    res.jsonSuccess(200, "Successfully uploaded file", uploadedFile);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const generateDailyProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const generatedDoc = await fileService.generateDailyProgressReport(id);
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment",
      "Content-Length": generatedDoc.length,
    });

    res.status(200).end(generatedDoc);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const generateTreatmentPlanReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { generatedFile } = await fileService.generateTreatmentPlanDoc(id);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment",
      "Content-Length": generatedFile.length,
    });
    res.status(200).end(generatedFile);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const sendMailDailyProgressReport = async (req, res) => {
  try {
    const { id } = req.params;
    const generatedFile = await fileService.generateDailyProgressReport(id);

    const fileAttachment = [
      {
        filename: "DAILY_PROGRESS_REPORT.pdf",
        content: Buffer.from(generatedFile),
      },
    ];

    const sendMail = await mailService.sendMail(
      req.user.email,
      "Daily Progress Report",
      "DAILY_PROGRESS_REPORT",
      {
        parentName: planData?.client?.guardianName,
        childName: planData?.client?.fullName,
        childDob: format(planData?.client?.dateOfBirth, "dd MMM yyyy"),
        consultDate: format(planData?.consultDate, "dd MMM yyyy"),
        psychologistName: planData?.psychologist?.fullName,
      },
      fileAttachment
    );

    res.jsonSuccess(
      200,
      "Daily Progress Report has been sent to your email",
      true
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const sendMailTreatmentPlanReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, generatedFile } = await fileService.generateTreatmentPlanDoc(
      id
    );

    const fileAttachment = [
      {
        filename: "TREATMENT_PLAN_REPORT.pdf",
        content: Buffer.from(generatedFile),
      },
    ];

    console.log("DATAA", data);

    console.log("REQ.USER.EMAIL", req.user.email);
    const sendMail = await mailService.sendMail(
      req.user.email,
      "Treatment Plan Report",
      "MAIL_TREATMENT_PLAN_REPORT",
      {
        parentName: data?.client?.guardianName,
        childName: data?.client?.fullName,
        consultDate: data?.consultDate,
        childDob: data?.client?.formattedDOB,
        // childDob: format(data?.client?.dateOfBirth, "dd MMM yyyy"),
        // consultDate: format(data?.consultDate, "dd MMM yyyy"),
        psychologistName: data?.psychologist?.fullName,
      },
      fileAttachment
    );

    res.jsonSuccess(
      200,
      "Daily Progress Report has been sent to your email",
      true
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  getAll,
  uploadFile,
  generateDailyProgressReport,
  generateTreatmentPlanReport,
  sendMailDailyProgressReport,
  sendMailTreatmentPlanReport,
};
