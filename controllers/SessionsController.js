const User = require('../models/User');
const passport = require('passport');
const viewPath = 'sessions';
const jwt = require('jsonwebtoken');

exports.new = (req, res) => {
  res.render(`${viewPath}/login`, {
    pageTitle: 'Login'
  });
};

// Step 1: Create an action that will authenticate the user using Passport
exports.create = (req, res, next) => {
  console.log(req.body);
  passport.authenticate('local', (err, user) => {
    if (err || !user) return res.status(401).json({
      status: 'failed',
      message: 'Not authorized',
      error: err
    });

    req.login(user, err => {
      if (err) return res.status(401).json({
        status: 'failed',
        message: 'Not authorized',
        error: err
      });

      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email
        }
      })
    })
  })(req, res, next);
};

// Step 2: Log the user out
exports.delete = (req, res) => {
  req.logout();
  req.flash('success', 'We will see you soon, bye!');
  res.redirect('/');
};