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

const createTestType = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await testTypeRepository.create(bodyData, tr)

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

const updateTestTypeById = async (typeId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await testTypeRepository.updateById(typeId, bodyData, transaction)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
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
