"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_groups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.users, {
      //   foreignKey: "user_id",
      //   targetKey: "id",
      //   as: "users",
      // });
      // this.belongsTo(models.masterGroups, {
      //   foreignKey: "group_id",
      //   targetKey: "id",
      //   as: "groups",
      // });
    }
  }
  user_groups.init(
    {
      user_id: {
        references: {
          model: "users",
          key: "id",
        },
        type: DataTypes.UUID,
      },
      group_id: {
        references: {
          model: "master_groups",
          key: "id",
        },
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "user_groups",
      underscored: true,
    }
  );
  return user_groups;
};
