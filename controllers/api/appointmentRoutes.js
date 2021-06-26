const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
// console.log(process.env.STRIPE_TEST_KEY);
const {
  User,
  Appointment,
  Service,
  Calendar
} = require('../../models');
const withAuth = require('../../utils/auth');

router.post("/create", withAuth, async (req, res) => {
  try {
    console.log(req.body.service, req.body.app_hour, req.body.app_date, req.session.user_id);

    const date = req.body.app_date;
    const dateArray = date.split("-");
    const dayOfWeek = parseInt(dateArray[1]);
    console.log(dayOfWeek);
    const appHour = parseInt(req.body.app_hour);
    console.log(appHour);

    const serviceData = await Service.findAll({where: {name: req.body.service}});

    const calendarData = await Calendar.findAll({where: {day: dayOfWeek, hour: appHour}});

    const service = serviceData.map(item => item.get({plain: true}));
    console.log(service);

    const calendar = calendarData.map(item => item.get({plain: true}));
    console.log(calendar);

    const newAppointment = await Appointment.create({
        user_id: req.session.user_id,
        app_date: date,
        app_day: dayOfWeek,
        app_hour: appHour,
        service_id: service[0].id,
        calendar_id: calendar[0].id
    });

    req.session.appointment = newAppointment;

    res.render("checkout", {logged_in: req.session.logged_in, user_id: req.session.user_id, appointment: req.session.appointment});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/create-checkout-session', async (req, res) => {
  // res.send(req.body);
  try{
    const price = await stripe.prices.create({
        unit_amount: parseInt(req.body.price)*100,
        currency: 'usd',
        product_data: {
            name:req.body.service
        },
      });
    console.log(price)
    const session = await stripe.checkout.sessions.create({
        success_url: 'https://fathomless-eyrie-79379.herokuapp.com/checkout',
        cancel_url: 'https://fathomless-eyrie-79379.herokuapp.com/checkout',
        payment_method_types: ['card'],
        line_items: [
          {
            price:price.id,quantity:1
          }
        ],
        mode: 'payment',
      });
      console.log(session)
    // res.json({ id: session.id });
    req.session.payment_id = session.id,
    res.redirect(session.url);
  } catch(err){
    res.status(500).json(err);
  }
});

module.exports = router;
