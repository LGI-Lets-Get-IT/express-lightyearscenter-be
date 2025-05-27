const db = require("../models");
const testTypeRepository = require("../repositories/testTypes.repositories")(db);
const customError = new Error()

const getAllTestTypes = async () => {
  const result = await testTypeRepository.findAll();

  return result;
};

const getTestTypeById = async (testTypeId) => {
  const result = await testTypeRepository.findOneById(testTypeId)

  return result;
}

const createTestType = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await testTypeRepository.create(bodyData, tr)

    if (!result) {
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
    const result = await testTypeRepository.updateById(typeId, bodyData, tr)

    await tr.commit()

    return result;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deleteTestTypeByIds = async (testIds) => {
  const tr = await db.sequelize.transaction();
  try {
    const deletedTests = await testTypeRepository.deleteByIds(testIds, tr);
    if(!deletedTests) {
      customError.statusCode = 500;
      customError.message = "Failed to delete test type data";
      
      throw customError;
    }

    await tr.commit();
    return deletedTests;
  } catch (error) {
    await tr.rollback();
    throw error;
  }
}

module.exports = {
  createTestType,
  getAllTestTypes,
  getTestTypeById,
  updateTestTypeById,
  deleteTestTypeByIds,
};
