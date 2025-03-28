const appointmentService = require("../services/appointments.services");
const customError = new Error();

const getAll = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();

    res.jsonSuccess(
      200,
      "Successfully fetched all appointments data",
      appointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const getById = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const appointment = await appointmentService.getAppointmentById(
      appointmentId
    );

    res.jsonSuccess(200, "Successfully fetched appointment data", appointment);
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message);
  }
};

const create = async (req, res) => {
  try {
    const {
      title,
      psychologistId,
      client,
      refCode,
      timeStart,
      timeEnd,
      appointmentType,
    } = req.body;

    const bodyData = {
      psychologistId,
      title: title,
      clientId: client,
      referenceCode: refCode,
      timeStart: timeStart,
      timeEnd: timeEnd,
      appointmentType: appointmentType,
    };

    const createdAppointment = await appointmentService.createAppointment(
      bodyData
    );

    res.jsonSuccess(
      201,
      "Successfully created new appointment data",
      createdAppointment
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const updateById = async (req, res) => {
  try {
    const ingredientId = req.params.id;
    const { available_quantity } = req.body;
    const updatedIngredient = await appointmentService.updateById(
      ingredientId,
      available_quantity
    );
    res.jsonSuccess(
      200,
      {
        indonesian: "Bahan produk berhasil diubah",
        english: "Product ingredient updated successfully",
      },
      updatedIngredient
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

const deleteIds = async (req, res) => {
  try {
    const { appointmentIds } = req.body;
    const deletedAppointments = await appointmentService.deleteAppointmentByIds(
      appointmentIds
    );

    res.jsonSuccess(
      200,
      "Successfully deleted appointments data",
      deletedAppointments
    );
  } catch (error) {
    res.jsonFailed(error?.statusCode, error?.message, error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  updateById,
  deleteIds,
};
