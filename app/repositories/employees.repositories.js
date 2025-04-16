function EmployeeRepository(db) {
  const findAll = () => {
    return db.employees.findAll();
  };

  const findOneById = (id) => {
    return db.employees.findOne({
      where: {
        id,
      },
    });
  }

  const findOneByEmail = (email) => {
    return db.employees.findOne({
      // raw: true,
      where: {
        email,
      },
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: ['name']
        }
      ]
    });
  }

  const findOneByRefreshToken = (token) => {
    return db.employees.findOne({
      where: {
        refreshToken: token,
      },
    });
  };
  
  const create = (bodyData, transaction) => {
    return db.employees.create(bodyData, { transaction })
  };

  const updateById = (id, bodyData, transaction) => {
    return db.employees.update(bodyData, {
      where: {
        id: id,
      },
    }, { transaction });
  };

  const deleteById = (ids, transaction) => {
    return db.employees.destroy({
      where: {
        id: ids,
      },
    }, { transaction });
  };

  return {
    findAll,
    findOneById,
    findOneByEmail,
    findOneByRefreshToken,
    create,
    updateById,
    deleteById,
  };
}

module.exports = EmployeeRepository;
