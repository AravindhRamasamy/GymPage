const express = require('express');

const route = express.Router();

const Controller = require('../controllers/arnoldGymController');
// to check whether the user is loggedin
const isAuthenticated = require('../middleware/is-auth');

// to render registraion page
route.get('/register', Controller.getRegister);
// to add user details
route.post('/register', Controller.postRegister);
// to render login page
route.get('/login', Controller.getLogin);
// to authenticate user details
route.post('/login', Controller.postLogin);
// to logout user
route.get('/logout', isAuthenticated, Controller.logout);
// to render booking page
route.get('/book', isAuthenticated, Controller.getBook);
// to add booking details
route.post('/book', isAuthenticated, Controller.postBook);
// to render user dashboard
route.get('/user', isAuthenticated, Controller.getUser);
// to update user details
route.post('/updateuserdetails', isAuthenticated, Controller.updateUserDetails);
// to delete booking details
route.post('/deletebooking', isAuthenticated, Controller.deleteBooking);

module.exports = route;
