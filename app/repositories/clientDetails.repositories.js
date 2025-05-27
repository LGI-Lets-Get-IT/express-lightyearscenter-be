function ClientDetailRepository(db) {
  const create = (bodyData, transaction) => {
    return db.clientDetails.create(bodyData, { transaction })
  };

  return {
    create,
  };
}

module.exports = ClientDetailRepository;
