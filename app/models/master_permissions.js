"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class master_permissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.users, {
        through: models.userPermissions,
        foreignKey: "permission_id",
        as: "user_perms",
      });

      this.belongsToMany(models.masterGroups, {
        through: models.groupPermissions,
        foreignKey: "permission_id",
        as: "group_perms",
      });
    }
  }
  master_permissions.init(
    {
      name: DataTypes.STRING(32),
      description: DataTypes.STRING(64),
    },
    {
      sequelize,
      modelName: "master_permissions",
      underscored: true,
    }
  );
  return master_permissions;
};
