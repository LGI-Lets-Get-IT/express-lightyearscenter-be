"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MasterIngredient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // this.belongsTo(models.Supplier)
      // this.belongsTo(models.Supplier, {
      //   foreignKey: "supplier_id",
      //   as: "supplier",
      // });
    }
  }
  MasterIngredient.init(
    {
      name: DataTypes.STRING,
      key: DataTypes.STRING(64),
      unit_type: {
        type: DataTypes.ENUM,
        values: ['ml', 'l', 'kg', 'g']
      },
      available_quantity: DataTypes.INTEGER,
      supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
    },
    {
      sequelize,
      modelName: "MasterIngredient",
      tableName: "master_ingredients",
      underscored: true
    }
  );
  return MasterIngredient;
};

