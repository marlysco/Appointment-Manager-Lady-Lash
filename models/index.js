const User = require('./User');
const Appointment = require('./Appointment');
const Service = require('./Service');
const Calendar = require('./Calendar');

User.hasMany(Appointment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Appointment.belongsTo(User, {
  foreignKey: 'user_id'
});

Service.hasMany(Appointment, {
  foreignKey: 'service_id',
  onDelete: 'CASCADE'
});

Appointment.belongsTo(Service, {
  foreignKey: 'service_id'
});

Calendar.hasMany(Appointment, {
  foreignKey: 'calendar_id',
  onDelete: 'CASCADE'
});

Appointment.belongsTo(Calendar, {
  foreignKey: 'calendar_id'
});


module.exports = {User, Appointment, Service, Calendar};
