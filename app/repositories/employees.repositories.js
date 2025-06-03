function EmployeeRepository(db) {
  const findAll = () => {
    return db.employees.findAll({
      attributes: [
        'id',
        'fullName',
        'phoneNumber',
        'email',
        [db.sequelize.col(`role.name`), 'roleName'],
        'isActive',
      ],
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: [],
        }
      ]
    });
  };

  const findAllByRoleId = (roleId) => {
    return db.employees.findAll({
      where: {
        roleId,
      },
      attributes: [
        'id',
        'fullName',
        'phoneNumber',
        'email',
        [db.sequelize.col(`role.name`), 'roleName'],
        'isActive',
      ],
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: [],
        }
      ]
    });
  }

  const findPasswordById = (id) => {
    return db.employees.findOne({
      attributes: ['password'],
      where: {
        id,
      },
    })
  }

  const findOneById = (id) => {
    return db.employees.findOne({
      attributes: [
        "id",
        "roleId",
        "fullName",
        "phoneNumber",
        "email",
        "isActive",
        [db.sequelize.col('role.name'), 'roleName'],
        "createdAt",
        "updatedAt",
      ],
      where: {
        id,
      },
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: ['name'],
        }
      ]
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
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: ['name']
        }
      ]
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

  const deleteByIds = (ids, transaction) => {
    return db.employees.destroy({
      where: {
        id: ids,
      },
    }, { transaction });
  };

  return {
    findAll,
    findAllByRoleId,
    findOneById,
    findOneByEmail,
    findOneByRefreshToken,
    findPasswordById,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = EmployeeRepository;
