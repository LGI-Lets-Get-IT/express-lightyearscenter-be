function ClientRepository(db) {
  const findAll = () => {
    return db.clients.findAll({
    });
  };
  
  const findOneById = (id) => {
    return db.clients.findByPk(id);
  };

  const create = (bodyData, transaction) => {
    console.log('BODYDATA', bodyData)
    return db.clients.create(bodyData, { transaction })
  };

  const updateById = (uuid, bodyData, transaction) => {
    return db.clients.update(bodyData, {
      returning: true,
      raw: true,
      where: {
        uuid: uuid,
      },
    }, { transaction })
  }

  const deleteByIds = (ids, transaction) => {
    return db.clients.destroy({
      where: {
        id: ids
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = ClientRepository;