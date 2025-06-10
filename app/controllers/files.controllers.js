const fileService = require("../services/files.services");
const getAll = async (req, res) => {
  try {
    const { uuid, clientName } = req.query;
    const files = await fileService.getAllFiles(
      uuid,
      clientName
    );

    res.jsonSuccess(200, "Successfully fetched all files data", files);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const uploadFile = async (req, res) => {
  try {
    const { uuid, clientName } = req.body
    const uploadedFile = await fileService.uploadFile(uuid, clientName, req.file)
    res.jsonSuccess(200, "Successfully uploaded file", uploadedFile);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const generateDailyProgressReport = async (req, res) => {
  try {
    const { id } = req.params
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
    const generatedDoc = await fileService.generateTreatmentPlanDoc(id);

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

module.exports = {
  getAll,
  uploadFile,
  generateDailyProgressReport,
  generateTreatmentPlanReport,
};
