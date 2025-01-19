const db = require("../models");
const ProductRepository = require("../repositories/masterproducts.repositories")(db);

const fetchAllProducts = async () => {
  return await ProductRepository.findAll();
};

const create = async (body) => {
  try {
    const result = await ProductRepository.create(bodyData, tr);

    return result;
  } catch (error) {
  }
};

module.exports = {
  fetchAllProducts,
  create,
};
