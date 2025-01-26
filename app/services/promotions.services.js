const db = require("../models");
const ProductRepository = require("../repositories/masterproducts.repositories")(db);

const fetchAllPromotions = async () => {
  return await ProductRepository.findAll();
};

const createPromotion = async (body) => {
  try {
    const result = await ProductRepository.create(bodyData, tr);

    return result;
  } catch (error) {
  }
};

const updatePromotion = async (id, bodyData) => {
  const transaction = await db.sequelize.transaction()
  try {
    
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

module.exports = {
  fetchAllPromotions,
  createPromotion,
  updatePromotion,
};
