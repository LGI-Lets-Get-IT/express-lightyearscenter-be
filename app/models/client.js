'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.schools, {
        foreignKey: 'school_id',
        as: 'school'
      })
    }
  }
  Client.init({
    schoolId: {
      type: DataTypes.INTEGER,
      field: 'school_id',
      references: {
        model: 'School',
        key: 'id'
      }
    },
    fullName: {
      type: DataTypes.STRING(128),
      field: 'full_name'
    },
    age: DataTypes.INTEGER,
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female']
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      field: 'date_of_birth'
    },
    phoneNumber: {
      type: DataTypes.STRING,
      unique: true,
      field: 'phone_number'
    },
    guardianName: {
      type: DataTypes.STRING(128),
      field: 'guardian_name'
    },
    guardianEmail: {
      type: DataTypes.STRING(128),
      unique: true,
      field: 'guardian_email'
    },
    guardianPhone: {
      type: DataTypes.STRING(32),
      field: 'guardian_phone'
    },
    guardianRelationship: {
      type: DataTypes.STRING(16),
      field: 'guardian_relationship'
    },
    address: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: {
      type: DataTypes.STRING,
      field: 'refresh_token'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    underscored: true,
  });
  return Client;
};