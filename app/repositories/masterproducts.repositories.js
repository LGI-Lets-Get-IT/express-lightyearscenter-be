function MasterProductRepository(db) {
  const findAll = () => {
    return db.products.findAll();
  };

  return {
    findAll,
  };
}

module.exports = MasterProductRepository;