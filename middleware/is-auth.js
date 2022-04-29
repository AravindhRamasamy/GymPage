// to check if the user is loggedin
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};
