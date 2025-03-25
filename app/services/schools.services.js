const db = require("../models");
const schoolRepository = require("../repositories/schools.repositories")(db);
const customError = new Error()

const getAllSchools = async () => {
  const schools = await schoolRepository.findAll();

  return schools.map(school => ({
    id: school.id,
    name: school.name,
    address: school.address,
    phoneNumber: school.phoneNumber,
    email: school.email,
    pic: {
      full_name: school.picFullName,
      phoneNumber: school.picPhoneNumber,
      email: school.picEmail
    },
    isActive: school.isActive,
  }))
};

const getSchoolById = async (schoolId) => {
  const school = await schoolRepository.findOneById(schoolId)

  return school;
}

const getSchoolByIdWithClients = async (schoolId) => {
  const school = await schoolRepository.findOneSchoolByIdWithClients(schoolId)

  return school;
}

const getSchoolClientsById = async (schoolId) => {
  const data = await schoolRepository.findClientsBySchoolId(schoolId)

  return data;
}

const createSchool = async (bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const createdSchool = await schoolRepository.create(bodyData, tr)

    if(!createdSchool) {
      customError.message = "Failed to create school data"
      throw customError
    }

    await tr.commit()

    return createdSchool;
  } catch (error) {
    await tr.rollback()
    throw error;
  }
};

const updateSchoolById = async (schoolId, bodyData) => {
  const tr = await db.sequelize.transaction()
  try {
    const updatedSchool = await schoolRepository.updateById(schoolId, bodyData)

    console.log('TESTT')
    console.log('updatedSchool[0]', !updatedSchool[0])
    if(!updatedSchool[0]) {
      // customError.statusCode = 500
      customError.message = "Failed to update school data"
      throw customError
    }

    await tr.commit()

    return updatedSchool
  } catch (error) {
    await tr.rollback()
    throw error;
  }
}

const deleteById = async (schoolId) => {
  const tr = await db.sequelize.transaction()
  try {
    const deletedSchool = await schoolRepository.deleteById(schoolId, tr)
    if(!deletedSchool) { 
      customError.statusCode = 500;
      customError.message = "Failed to delete school data"

      throw customError
    }

    await tr.commit()

    return deletedSchool;
  } catch (error) {
    await tr.rollback()
    throw error
  }
}

module.exports = {
  getAllSchools,
  getSchoolById,
  getSchoolByIdWithClients,
  getSchoolClientsById,
  createSchool,
  updateSchoolById,
  deleteById,
};
