function ClientDetailRepository(db) {
  const create = (bodyData, transaction) => {
    return db.clientDetails.create(bodyData, { transaction })
  };

  const updateByClientId = (clientId, bodyData, transaction) => {
    return db.clientDetails.update(bodyData, {
      where: {
        clientId,
      },
    }, { transaction })
  }

  return {
    create,
    updateByClientId,
  };
}

module.exports = ClientDetailRepository;
