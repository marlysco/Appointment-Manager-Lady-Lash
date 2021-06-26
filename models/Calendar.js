const {
  Model,
  DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');

class Calendar extends Model {};

Calendar.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  day: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  hour: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    defaultValue: 120,
    allowNull: false,
    validate: {
      notNull: true,
    },
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true,
    },
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: true,
    },
  },
}, {
  sequelize,
  timestamps: false,
  freezeTableName: true,
  underscored: true,
  modelName: 'calendar',
})

module.exports = Calendar;
