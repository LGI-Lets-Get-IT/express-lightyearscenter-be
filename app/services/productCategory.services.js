const db = require("../models");
const productCategoryRepository = require("../repositories/masterProductCategory.repositories")(db);
const customError = new Error()

const fetchAllCategories = async () => {
  const result = await productCategoryRepository.findAll();

  return result;
};

const create = async (name, description) => {
  const tr = await db.sequelize.transaction()
  try {
    const result = await productCategoryRepository.create(name, description, tr)

    if(!result) {
      customError.statusCode = 500
      customError.message = {
        indonesian: "Kategori produk gagal dibuat",
        english: "Failed to create product category data"
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

module.exports = {
  fetchAllCategories,
  create,
};
