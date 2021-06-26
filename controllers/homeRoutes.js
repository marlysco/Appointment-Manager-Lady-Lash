const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);
const {
  User,
  Appointment,
  Service,
  Calendar
} = require('../models');
const withAuth = require('../utils/auth');


//Route to Get to the Homepage
router.get('/', async (req, res) => {
  try {
    const servicesData = await Service.findAll({});
    if (!servicesData.length) {
      if (!req.session.logged_in) {
        const response = {
          about_us: true,
          business_hours: true
        }
        res.render("notFound", response);
      } else {
        const response = {
          about_us: true,
          business_hours: true,
          logged_in: req.session.logged_in,
          user_id: req.session.user_id,
        }
        res.render("notFound", response);
      }
    } else {
      const services = servicesData.map(service => service.get({
        plain: true
      }));
      if (!req.session.logged_in) {
        const response = {
          services: {
            services
          },
          about_us: true,
          business_hours: true
        }
        res.render("homepage", response);
      } else {
        const response = {
          services: {
            services
          },
          about_us: true,
          business_hours: true,
          logged_in: req.session.logged_in,
          user_id: req.session.user_id,
        }
        res.render("homepage", response);
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

//Route for Admin Home Page
router.get('/lady-lash-admin-homepage', withAuth, async (req, res) => {
  try {
    // const selectedDate= req.query.app_date;
    // console(selected);

    let date = req.query.app_date;
    if (!req.query.app_date) {
      let fullDate = new Date();
      let day = fullDate.getDate();
      let month = fullDate.getMonth() + 1;
      let year = fullDate.getFullYear();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      date = `${year}-${month}-${day}`;
      console.log(date);
    }

    const appointmentsData = await Appointment.findAll({
      include: [{
          model: User,
          attributes: ["id", "first_name", "last_name", "email"]
        },
        {
          model: Service,
          attributes: ["id", "name"]
        },
        {
          model: Calendar,
          attributes: ["id", "day", "hour", "start_date", "end_date"]
        },
      ]
    });

    const appointmentsPlain = appointmentsData.map(appointment => appointment.get({
      plain: true
    }));

    const dayAppointments = appointmentsPlain.filter(appointment => appointment.app_date === date);

    if (!dayAppointments.length) {
      const availability = {
        h08: false,
        h10: false,
        h12: false,
        h14: false,
        h16: false,
        h18: false,
        h20: false
      };
      res.render("adminHomepage", {
        availability: availability,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id,
        date: date
      });
    } else {
      let h08 = false;
      let h10 = false;
      let h12 = false;
      let h14 = false;
      let h16 = false;
      let h18 = false;
      let h20 = false;
      let appointment08 = {};
      let appointment10 = {};
      let appointment12 = {};
      let appointment14 = {};
      let appointment16 = {};
      let appointment18 = {};
      let appointment20 = {};

      dayAppointments.forEach((appointment, i) => {
        switch (appointment.app_hour) {
          case 8:
            h08 = true;
            break;
          case 10:
            h10 = true;
            break;
          case 12:
            h12 = true;
            break;
          case 14:
            h14 = true;
            break;
          case 16:
            h16 = true;
            break;
          case 18:
            h18 = true;
            break;
          case 20:
            h20 = true;
            break;
        }
      });

      dayAppointments.forEach((appointment, i) => {
        switch (appointment.app_hour) {
          case 8:
            appointment08 = appointment;
            break;
          case 10:
            appointment10 = appointment;
            break;
          case 12:
            appointment12 = appointment;
            break;
          case 14:
            appointment14 = appointment;
            break;
          case 16:
            appointment16 = appointment;
            break;
          case 18:
            appointment18 = appointment;
            break;
          case 20:
            appointment20 = appointment;
            break;
        }
      });

      const avaliability = {
        h08: h08,
        h10: h10,
        h12: h12,
        h14: h14,
        h16: h16,
        h18: h18,
        h20: h20,
      }

      const appointments = {
        appointment08: appointment08,
        appointment10: appointment10,
        appointment12: appointment12,
        appointment14: appointment14,
        appointment16: appointment16,
        appointment18: appointment18,
        appointment20: appointment20,
      }
      res.render("adminHomepage", {
        availability: avaliability,
        appointments: appointments,
        date: date,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//Avaliability GET
router.get('/avaliability', async (req, res) => {
  try {
    let date = req.query.app_date;
    if (!req.query.app_date) {
      let fullDate = new Date();
      console.log(fullDate);
      let day = fullDate.getDate();
      let month = fullDate.getMonth() + 1;
      let year = fullDate.getFullYear();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      console.log(day, month, year);
      date = `${year}-${month}-${day}`;
      console.log(date);
    }

    const appointmentsData = await Appointment.findAll({});

    const appointmentsPlain = appointmentsData.map(appointment => appointment.get({
      plain: true
    }));

    const dayAppointments = appointmentsPlain.filter(appointment => appointment.app_date === date);
    console.log(dayAppointments);
    if (!req.session.logged_in) {
      if (!dayAppointments.length) {
        const availability = {
          h08: false,
          h10: false,
          h12: false,
          h14: false,
          h16: false,
          h18: false,
          h20: false
        };
        res.render("avaliability", {
          availability: availability,
          date: date
        });
      } else {
        let h08 = false;
        let h10 = false;
        let h12 = false;
        let h14 = false;
        let h16 = false;
        let h18 = false;
        let h20 = false;

        dayAppointments.forEach((appointment, i) => {
          switch (appointment.app_hour) {
            case 8:
              h08 = true;
              break;
            case 10:
              h10 = true;
              break;
            case 12:
              h12 = true;
              break;
            case 14:
              h14 = true;
              break;
            case 16:
              h16 = true;
              break;
            case 18:
              h18 = true;
              break;
            case 20:
              h20 = true;
              break;
          }
        });

        const avaliability = {
          h08: h08,
          h10: h10,
          h12: h12,
          h14: h14,
          h16: h16,
          h18: h18,
          h20: h20,
        }
        console.log(avaliability);
        res.render("avaliability", {
          availability: avaliability,
          date: date
        });
      }

    } else {
      res.redirect("/appointment");
    }

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/lady-lash-admin-homepage/service', withAuth, (req, res) => {
  res.render('createService.handlebars', {logged_in: req.session.logged_in, user_id: req.session.user_id});
});

//Route to the new appoiment page
router.get('/appointment', withAuth, async (req, res) => {
  res.render('newAppointment.handlebars', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id
  });
});

//Route to get the available hours given the selected date
router.get('/appointment/date', withAuth, async (req, res) => {
  try {
    let date = req.query.app_date;
    if (!req.query.app_date) {
      let fullDate = new Date();
      console.log(fullDate);
      let day = fullDate.getDate();
      let month = fullDate.getMonth() + 1;
      let year = fullDate.getFullYear();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      console.log(day, month, year);
      date = `${year}-${month}-${day}`;
      console.log(date);
    }

    let showOptions = true;

    if (!req.query.app_date) {
      showOptions = false;
    }

    const appointmentsData = await Appointment.findAll({
      include: [{
          model: User,
          attributes: ["id", "first_name", "last_name", "email"]
        },
        {
          model: Service,
          attributes: ["id", "name"]
        },
        {
          model: Calendar,
          attributes: ["id", "day", "hour", "start_date", "end_date"]
        },
      ]
    });

    const serviceData = await Service.findAll({});

    const services = serviceData.map(service => service.get({
      plain: true
    }));

    console.log(services);

    const appointmentsPlain = appointmentsData.map(appointment => appointment.get({
      plain: true
    }));

    const dayAppointments = appointmentsPlain.filter(appointment => appointment.app_date === date);

    if (!dayAppointments.length) {
      const availability = {
        h08: false,
        h10: false,
        h12: false,
        h14: false,
        h16: false,
        h18: false,
        h20: false
      };
      res.render("newAppointment", {
        services: {
          services
        },
        availability: availability,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id,
        showOptions: showOptions,
        date: date
      });
    } else {
      let h08 = false;
      let h10 = false;
      let h12 = false;
      let h14 = false;
      let h16 = false;
      let h18 = false;
      let h20 = false;

      dayAppointments.forEach((appointment, i) => {
        switch (appointment.app_hour) {
          case 8:
            h08 = true;
            break;
          case 10:
            h10 = true;
            break;
          case 12:
            h12 = true;
            break;
          case 14:
            h14 = true;
            break;
          case 16:
            h16 = true;
            break;
          case 18:
            h18 = true;
            break;
          case 20:
            h20 = true;
            break;
        }
      });

      const avaliability = {
        h08: h08,
        h10: h10,
        h12: h12,
        h14: h14,
        h16: h16,
        h18: h18,
        h20: h20,
      }

      res.render("newAppointment", {
        services: {
          services
        },
        showOptions: showOptions,
        availability: avaliability,
        appointments: {
          dayAppointments
        },
        date: date,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/my-appointment', withAuth, async (req, res) => {
  try {

    console.log(req.session.user_id);

    const appointmentsData = await Appointment.findAll({
      include: {
        model: Service
      }
    });

    const appointments = appointmentsData.map(appointment => appointment.get({
      plain: true
    }));

    for(let i = 0; i < appointments.length; i++) {
      switch (appointments[i].app_hour) {
        case 8:
          appointments[i].app_hour = "08:00 AM";
          break;
        case 10:
          appointments[i].app_hour = "10:00 AM";
          break;
        case 12:
          appointments[i].app_hour = "12:00 PM";
          break;
        case 14:
          appointments[i].app_hour = "02:00 PM";
          break;
        case 16:
          appointments[i].app_hour = "04:00 PM";
          break;
        case 18:
          appointments[i].app_hour = "06:00 PM";
          break;
        case 20:
          appointments[i].app_hour = "08:00 PM";
          break;
      }
    }

    console.log(appointments);

    res.render('userAppointments', {
      appointments: {
        appointments
      },
      logged_in: req.session.logged_in,
      user_id: req.session.user_id
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/checkout', withAuth, async (req, res) => {
  console.log(req.session.appointment);
  if(req.session.payment_id) {
    const session = await stripe.checkout.sessions.retrieve(req.session.payment_id);
    console.log(req.session.appointment, session);
    const appointmentData = await Appointment.update({ payment_id: session.id }, {
  where: {
    id: req.session.appointment.id
  }
});
    if(session.payment_status === "paid") {
      req.session.appointment = null;
      req.session.payment_id = null;
      res.render("payment-success", {logged_in: req.session.logged_in, user_id: req.session.user_id, appointment: req.session.appointment, payment_id: req.session.payment_id});
    } else {
      req.session.appointment = null;
      req.session.payment_id = null;
      res.render("payment-failure", {logged_in: req.session.logged_in, user_id: req.session.user_id, appointment: req.session.appointment, payment_id: req.session.payment_id});
    }
  } else {
    const serviceData = await Service.findOne({where: {id: req.session.appointment.service_id}});

    const service = serviceData.get({plain: true});

    console.log(service);

    res.render("checkout", {service: service, logged_in: req.session.logged_in, user_id: req.session.user_id});
  }
});

router.get('/payment-success', withAuth, (req, res) => {
  res.render('payment-success', {logged_in: req.session.logged_in, user_id: req.session.user_id});
});

router.get('/payment-failure', withAuth, (req, res) => {
  res.render('payment-failure', {logged_in: req.session.logged_in, user_id: req.session.user_id});
});

module.exports = router;
