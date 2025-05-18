"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.appointments, {
        foreignKey: 'clientId',
        as: 'appointments'
      });
      this.hasMany(models.clientAssessments, {
        foreignKey: 'clientId',
        as: 'assessments'
      });
      this.belongsTo(models.schools, {
        foreignKey: 'schoolId',
        as: 'school'
      });
    }
  }
  Client.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      schoolId: {
        type: DataTypes.INTEGER,
        field: "school_id",
        references: {
          model: "School",
          key: "id",
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fullName: {
        type: DataTypes.STRING(128),
        field: "full_name",
      },
      age: DataTypes.INTEGER,
      gender: {
        type: DataTypes.ENUM,
        values: ["Male", "Female"],
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        field: "date_of_birth",
      },
      nationality: {
        type: DataTypes.STRING(32),
        field: 'nationality',
      },
      guardianName: {
        type: DataTypes.STRING(128),
        field: "guardian_name",
      },
      guardianEmail: {
        type: DataTypes.STRING(128),
        unique: true,
        field: "guardian_email",
      },
      guardianPhone: {
        type: DataTypes.STRING(32),
        field: "guardian_phone",
      },
      guardianNationality: {
        type: DataTypes.STRING(),
        field: 'guardian_nationality'
      },
      guardianRelationship: {
        type: DataTypes.STRING(16),
        field: "guardian_relationship",
      },
      // problem: {
      //   type: DataTypes.TEXT,
      // },
      address: DataTypes.STRING,
      password: DataTypes.STRING,
      refreshToken: {
        type: DataTypes.TEXT,
        field: "refresh_token",
      },
      allowShareData: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        defaultValue: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        field: "is_active",
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Client",
      tableName: "clients",
      underscored: true,
    }
  );
  return Client;
};
