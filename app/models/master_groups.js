"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class master_groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.users, {
        through: models.userGroups,
        foreignKey: "group_id",
        as: "users",
      });

      this.belongsToMany(models.masterPermissions, {
        through: models.groupPermissions,
        foreignKey: "group_id",
        as: "group_perms",
      });
    }
  }
  master_groups.init(
    {
      name: DataTypes.STRING(32),
      // description: DataTypes.STRING(64),
    },
    {
      sequelize,
      modelName: "master_groups",
      underscored: true,
    }
  );
  return master_groups;
};
