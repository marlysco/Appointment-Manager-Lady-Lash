const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');

class Appointment extends Model {}

Appointment.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  service_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'service',
      key: 'id',
    },
  },
  payment_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  app_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    },
  },
  app_day: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  app_hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id',
    }
  },
  calendar_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'calendar',
      key: 'id',
    },
  },
}, {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'appointment',
});

module.exports = Appointment;
