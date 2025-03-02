const db = require("../models");
const appointmentRepository = require("../repositories/appointments.repositories")(db);
const customError = new Error()

const getAllAppointments = async () => {
  const result = await appointmentRepository.findAll();

  return result;
};


const createAppointment = async (name, unit_type, available_quantity, supplier_id, updated_by) => {
  const tr = await db.sequelize.transaction()
  try {
    const keyName = name.trim().replace(/\s+/g, '_').toLowerCase()
    const result = await appointmentRepository.create(name, keyName, unit_type, available_quantity, supplier_id, updated_by, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = {
        indonesian: "Produk gagal dibuat",
        english: "Failed to create product data"
      }
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updateAppointmentById = async (ingredientId, availQty) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await appointmentRepository.updateById(ingredientId, {
      available_quantity: availQty
    }, tr)
    await tr.commit()

    return result
  } catch (error) {
    await tr.rollback()
    throw error
  }
}

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointmentById,
};
