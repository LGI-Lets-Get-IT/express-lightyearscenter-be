function EmployeeRepository(db) {
  const findAll = () => {
    return db.employees.findAll({
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        [db.sequelize.col(`role.name`), "roleName"],
        "isActive",
      ],
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: [],
        },
      ],
    });
  };

  const findAllByRoleId = (roleId) => {
    return db.employees.findAll({
      where: {
        roleId,
      },
      attributes: [
        "id",
        "fullName",
        "phoneNumber",
        "email",
        [db.sequelize.col(`role.name`), "roleName"],
        "isActive",
      ],
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: [],
        },
      ],
    });
  };

  const findPasswordById = (id) => {
    return db.employees.findOne({
      attributes: ["password"],
      where: {
        id,
      },
    });
  };

  const findAllEmployeeWithSchedulesByRoleId = (roleIds) => {
    return db.employees.findAll({
      attributes: ["id", "fullName"],
      where: {
        roleId: roleIds,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
        },
      ],
    });
  };

  const findAllBySchedules = (appointmentDay, startTime, endTime) => {
    return db.employees.findAll({
      attributes: [
        "id",
        "fullName",
        [db.sequelize.col(`role.name`), "roleName"]
      ],
      include: [
        {
          model: db.roles,
          as: 'role',
          attributes: []
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
          attributes: {
            exclude: ["employeeId", "employee_id", "createdAt", "updatedAt"],
          },
          where: {
            availableDays: {
              [db.Sequelize.Op.overlap]: [appointmentDay],
            },
            // availableStartTime: {
            //   [db.Sequelize.Op.lte]: startTime,
            // },
            // availableEndTime: {
            //   [db.Sequelize.Op.gte]: endTime,
            // },
          },
        },
      ],
    });
  };

  const findOneWithSchedulesById = (id) => {
    return db.employees.findOne({
      where: {
        id,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["id", "name"],
        },
        {
          model: db.picAvailabilities,
          as: "schedules",
        },
      ],
    });
  };

  const findOneById = (id) => {
    return db.employees.findOne({
      attributes: [
        "id",
        "roleId",
        "fullName",
        "phoneNumber",
        "email",
        "isActive",
        [db.sequelize.col("role.name"), "roleName"],
        "createdAt",
        "updatedAt",
      ],
      where: {
        id,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };

  const findOneByEmail = (email) => {
    return db.employees.findOne({
      // raw: true,
      where: {
        email,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };

  const findOneByRefreshToken = (token) => {
    return db.employees.findOne({
      where: {
        refreshToken: token,
      },
      include: [
        {
          model: db.roles,
          as: "role",
          attributes: ["name"],
        },
      ],
    });
  };
  const create = (bodyData, transaction) => {
    return db.employees.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.employees.update(
      bodyData,
      {
        where: {
          id: id,
        },
      },
      { transaction }
    );
  };

  const deleteByIds = (ids, transaction) => {
    return db.employees.destroy(
      {
        where: {
          id: ids,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findAllByRoleId,
    findAllEmployeeWithSchedulesByRoleId,
    findAllBySchedules,
    findOneWithSchedulesById,
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
