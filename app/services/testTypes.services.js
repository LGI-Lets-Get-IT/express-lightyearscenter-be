const db = require("../models");
const testTypeRepository = require("../repositories/testTypes.repositories")(db);
const customError = new Error()

const getAllTestTypes = async () => {
  const result = await testTypeRepository.findAll();

  return result;
};

const getTestTypeById = async (TestTypeId) => {
  const result = await testTypeRepository.findOneById(TestTypeId)

  return result;
}

const createTestType = async (name, description) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await testTypeRepository.create(name, description, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = "Failed to create test type data"
      throw customError
    }

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updateTestTypeById = async (categoryId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const { name, description, order } = bodyData
    const result = await testTypeRepository.update(categoryId, { name, description, order}, transaction)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
  }
}

const deleteTestTypeById = async () => {

}

module.exports = {
  createTestType,
  getAllTestTypes,
  getTestTypeById,
  updateTestTypeById,
  deleteTestTypeById,
};
