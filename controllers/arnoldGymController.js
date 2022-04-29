var mongoose = require('mongoose');
const userModel = require('../models/usermodel');
const bookingModel = require('../models/bookingmodel');
const bcrypt = require('bcrypt');
// to render registraion page
exports.getRegister = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('register', {
    title: 'Register',
    isAuthenticated: false,
    errorMessage: message
  });
};

// to add user details
exports.postRegister = (req, res, next) => {
  const username = req.body.username;
  const address = req.body.address;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const password = req.body.password;
  userModel
    .findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash(
          'error',
          'This email is already registered. Please use other email'
        );
        return res.redirect('/register');
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new userModel({
            username: username,
            address: address,
            email: email,
            phonenumber: phonenumber,
            password: hashedPassword
          });
          return user.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
// to render login page
exports.getLogin = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('login', {
    title: 'Login',
    isAuthenticated: false,
    errorMessage: message
  });
};
// to authenticate user details
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  userModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect('/');
            });
          }
          req.flash('error', 'Invalid email or password.');
          res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect('/login');
        });
    }
  });
};
// to logout user
exports.logout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
// to render booking page
exports.getBook = (req, res, next) => {
  let message = req.flash('error');
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render('book', {
    title: 'Book',
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message
  });
};
// to add booking details
exports.postBook = (req, res, next) => {
  const bookdate = req.body.bookdate;
  const booktime = req.body.booktime;
  const selecteddate = new Date(bookdate.replace(/-/g, '/'));
  selecteddate.setHours(0);
  selecteddate.setMinutes(0);
  const time = new Date(bookdate.replace(/-/g, '/'));
  time.setHours(booktime.split(':')[0]);
  time.setMinutes(booktime.split(':')[1]);
  const mintime = new Date(bookdate.replace(/-/g, '/'));
  mintime.setHours(booktime.split(':')[0]);
  mintime.setMinutes(0);
  const maxtime = new Date(bookdate.replace(/-/g, '/'));
  maxtime.setHours(booktime.split(':')[0]);
  maxtime.setHours(maxtime.getHours() + 1);
  maxtime.setMinutes(0);
  bookingModel
    .find({ time: { $gte: mintime.toString(), $lt: maxtime.toString() } })
    .then((data) => {
      if (data.length < 10) {
        const newbooking = new bookingModel({
          userid: req.session.user._id,
          date: selecteddate.toString(),
          time: time.toString()
        });
        newbooking.save();
        return res.redirect('/user');
      } else {
        req.flash('error', 'Only 10 members can book in an hour');
        res.redirect('/book');
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/book');
    });
};
// to render user dashboard
exports.getUser = (req, res, next) => {
  let bookeddateslist = [];

  bookingModel
    .find({ userid: req.session.user._id })
    .then((bookingdates) => {
      bookeddateslist = bookingdates;
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });

  userModel
    .findById(req.session.user._id)
    .then((data) => {
      return res.render('user', {
        title: 'Dashboard',
        isAuthenticated: req.session.isLoggedIn,
        id: data._id,
        name: data.username,
        address: data.address,
        email: data.email,
        phonenumber: data.phonenumber,
        bookeddates: bookeddateslist
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/book');
    });
};
// to update user details
exports.updateUserDetails = (req, res, next) => {
  const id = req.body.userid;
  const username = req.body.username;
  const address = req.body.address;
  const email = req.body.email;
  const phonenumber = req.body.phonenumber;
  const password = req.body.password;
  let hashedpassword;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => {
      hashedpassword = hashedPassword;
    })
    .catch((err) => {
      console.log(err);
    });

  userModel
    .updateOne(
      { _id: id },
      {
        $set: {
          username: username,
          address: address,
          email: email,
          phonenumber: phonenumber,
          password: hashedpassword
        }
      }
    )
    .then((data) => {
      return res.redirect('/user');
    })
    .catch((err) => {
      console.log(err);
    });
};
// to delete booking details
exports.deleteBooking = (req, res, next) => {
  const bookedid = req.body.bookedid;
  bookingModel
    .deleteOne({ _id: bookedid })
    .then((data) => {
      res.redirect('/user');
    })
    .catch((err) => {
      console.log(err);
      res.redirect('/');
    });
};
