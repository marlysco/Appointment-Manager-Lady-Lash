const router = require('express').Router();
const userRoutes = require('./userRoutes');
const serviceRoutes = require('./serviceRoutes');
const appointmentRoutes = require('./appointmentRoutes');
// const checkoutRoutes = require('/checkoutRoutes');

router.use('/users', userRoutes);
router.use('/service', serviceRoutes);
router.use('/appointment', appointmentRoutes);
// router.use('/checkout', checkoutRoutes);



module.exports = router;
