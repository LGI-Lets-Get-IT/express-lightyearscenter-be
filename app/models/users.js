"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.masterGroups, {
        through: models.userGroups,
        foreignKey: "user_id",
        as: "groups",
      });
      this.belongsToMany(models.masterPermissions, {
        through: models.userPermissions,
        foreignKey: "user_id",
        as: "user_perms",
      });
    }
  }
  users.init(
    {
      id: {
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        type: DataTypes.UUID,
      },
      full_name: {
        type: DataTypes.STRING(64),
      },
      username: {
        type: DataTypes.STRING(32),
        unique: true,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        unique: true,
      },
      email: {
        type: DataTypes.STRING(64),
        unique: true,
      },
      password: DataTypes.STRING,
      active_flag: DataTypes.BOOLEAN,
      refresh_token: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "users",
      underscored: true,
    }
  );
  return users;
};
