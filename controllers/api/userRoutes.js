const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res)=> {
  try{
    const userData = await User.findOne({where: {email: req.body.email}});
    if(!userData) {
      res.status(400).json({message: 'Incorrect email or password, please try again!'});
      return;
    } 
    const validPassword = await userData.checkPassword(req.body.password);
    if (!validPassword) {
      res.status(400).json({message: "Your password is incorrect, please try again!"});
      return;
    }
    req.session.save( async (err) => {
      if(err) {
        console.log(err);
      }
      else {
        req.session.logged_in= true;
        req.session.user_id= userData.id;
        res.render('service', {
          logged_in: req.session.logged_in,
          user_id: req.session.user_id,
        });
      }
    }) 
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const lookEmail = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (!lookEmail) {
      const newUser = await User.create({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
      });
      req.session.save(async (err) => {
        if (err) {
          console.log(err);
         } 
        else {
          req.session.user_id = newUser.id;
          req.session.logged_in = true;     
          res.render('service', {
            logged_in: req.session.logged_in,
            user_id: req.session.user_id, 
          });
        }
      });
    } else {
      res.render("existingUsername");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// router.post('/logout', (req, res) => {
//   if (req.session.logged_in) {
//     req.session.destroy(() => {
//       res.status(204).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });

router.post("/logout", async (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
    res.status(200).redirect("/").end();
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
