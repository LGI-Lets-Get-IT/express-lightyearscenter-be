const db = require("../models");
const OrderRepository = require("../repositories/orders.repositories")(db);

const fetchAllOrders = async () => {
  return await OrderRepository.findAll();
};

const create = async (body) => {
  const tr = await db.sequelize.transaction();
  try {
    const result = await OrderRepository.create(bodyData, tr);

    await tr.commit();
    return result;
  } catch (error) {
    await tr.rollback();
  }
};

module.exports = {
  fetchAllOrders,
  create,
};
