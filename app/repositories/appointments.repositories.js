function AppointmentRepository(db) {
  const findAll = () => {
    return db.appointments.findAll();
  };

  const findOneById = (id) => {
    return db.appointments.findByPk(id)
  }

  const create = (name, description, transaction) => {
    return db.appointments.create({
      name,
      description,
    }, { transaction })
  }

  const update = (id, bodyData, transaction) => {
    return db.appointments.update(bodyData, {
      where: {
        id
      }
    }, { transaction })
  }

  return {
    findAll,
    findOneById,
    create,
    update,
  };
}

module.exports = AppointmentRepository;