function PicAvailabilityRepository(db) {
  const findAll = () => {
    return db.picAvailabilities.findAll({
      raw: true,
      nest: true,
      group: ["PICAvailability.id", "employee.id", "employeeId"],
      // attributes: [
      //   "id",
      //   [db.Sequelize.col(`employee.name`), "employeeName"],
      //   "availableDays",
      //   "availableStartTime",
      //   "availableEndTime",
      // ],
      include: [
        {
          model: db.employees,
          as: "employee",
          attribuets: ["id", "fullName"],
        },
      ],
    });
  };

  const findOneById = (id) => {
    return db.picAvailabilities.findByPk(id);
  };

  const create = (bodyData, transaction) => {
    return db.picAvailabilities.create(bodyData, { transaction });
  };

  const bulkCreate = (bodyData, transaction) => {
    return db.picAvailabilities.bulkCreate(bodyData, {
      updateOnDuplicate: ["availableDays"],
      transaction,
    });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.picAvailabilities.update(
      bodyData,
      {
        where: {
          id,
        },
      },
      transaction
    );
  };

  const deleteByIds = (scheduleIds, transaction) => {
    return db.picAvailabilities.destroy(
      {
        where: {
          id: scheduleIds,
        },
      },
      { transaction }
    );
  };

  const deleteByEmployeeId = (employeeId, transaction) => {
    return db.picAvailabilities.destroy(
      {
        where: {
          employeeId,
        },
      },
      { transaction }
    );
  };

  return {
    findAll,
    findOneById,
    create,
    bulkCreate,
    updateById,
    deleteByIds,
    deleteByEmployeeId,
  };
}

module.exports = PicAvailabilityRepository;
