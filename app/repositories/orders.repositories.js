function OrderRepository(db) {
  const findAll = () => {
    return db.orders.findAll();
  };
  const findAllByCondition = (whereCond) => {
    return db.orders.findAll({
      where: whereCond,
    });
  };
  
  const findOne = () => {
    return db.orders.findOne({});
  };
  const create = (bodyData, transaction) => {
    return db.orders.create(bodyData, { transaction });
  };

  return {
    findAll,
    findAllByCondition,
    findOne,
    create,
  };
}

module.exports = OrderRepository;
