function userRepository(db) {
  const findOneByEmail = (email) => {
    return db.users.findOne({
      where: {
        email,
      },
    });
  };

  const findOneByIdentifierWithGroupAndPermissions = (
    identifier,
    showGroupAndPermissions
  ) => {
    const queryOptions = {
      attributes: [
        'id',
        'full_name',
        'username',
        'phone_number',
        'email',
        'refresh_token',
        'password',
        'active_flag'
      ],
      where: identifier,
    };

    if (showGroupAndPermissions) {
      queryOptions.include = [
        {
          model: db.masterGroups,
          as: "groups",
          through: { attributes: [] },
          attributes: ["name"],
          include: {
            model: db.masterPermissions,
            as: "group_perms",
            attributes: ["name", "description"],
            through: { attributes: [] },
          },
        },
        {
          model: db.masterPermissions,
          as: "user_perms",
          through: { attributes: [] },
          attributes: ["name", "description"],
        },
      ];
    }

    return db.users.findOne(queryOptions);
  };

  const createUser = (data, transaction) => {
    return db.users.create(data, transaction);
  };

  const updateUserById = (id, dataToUpdate, transaction) => {
    return db.users.update(
      dataToUpdate,
      {
        where: {
          id,
        },
      },
      transaction
    );
  };

  return {
    findOneByIdentifierWithGroupAndPermissions,
    findOneByEmail,
    createUser,
    updateUserById,
  };
}

module.exports = userRepository;
