function SchoolRepository(db) {
  const findAll = () => {
    return db.schools.findAll();
  };

  const findOneById = (id) => {
    return db.schools.findByPk(id);
  };

  const findClientsBySchoolId = (id) => {
    return db.schools.findOne({
      attributes: ["id", "name"],
      where: {
        id,
      },
      include: [
        {
          model: db.clients,
          as: "clients",
          attributes: [
            "uuid",
            "fullName",
            "guardianName",
            "guardianEmail",
            "guardianPhone",
          ],
        },
      ],
    });
  };

  const findOneSchoolByIdWithClients = (id) => {
    return db.schools.findOne({
      where: {
        id,
      },
      attributes: { exclude: ["createdAt"] },
      include: [
        {
          model: db.employees,
          as: "pic",
          attributes: ["id", "fullName", "phoneNumber", "email"],
        },
        {
          model: db.clients,
          as: "clients",
          attributes: [
            "uuid",
            "fullName",
            "guardianName",
            "guardianEmail",
            "guardianPhone",
          ],
        },
      ],
    });
  };

  const create = (bodyData, transaction) => {
    return db.schools.create(bodyData, { transaction });
  };

  const updateById = (id, bodyData, transaction) => {
    return db.schools.update(
      bodyData,
      {
        where: {
          id,
        },
      },
      { transaction }
    );
  };

  const deleteByIds = (ids, transaction) => {
    return db.schools.destroy(
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
    findOneById,
    findOneSchoolByIdWithClients,
    findClientsBySchoolId,
    create,
    updateById,
    deleteByIds,
  };
}

module.exports = SchoolRepository;
