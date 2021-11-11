const express = require('express');
const router = express.Router();

const userDatabase = require('../database/user_database');

const helperWithUserDB = require('../helpers/helper_with_userDB');
const generateRandomString = require('../helpers/random_string');

const { isEmailOccupied, getUserFromEmail } = helperWithUserDB(userDatabase);

//========GET===========//

// Logout user
router.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/urls');
});

// Sign up user
router.get('/register', (req, res) => {
  const templateVars = {
    user: null,
  };

  res.render('user_sign_up', templateVars);
});

// Sign in user
router.get('/login', (req, res) => {
  const templateVars = {
    user: null,
  };

  res.render('user_sign_in', templateVars);
});

//==========POST===========//

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = getUserFromEmail(email);

  if (!user) {
    return res.status(403).send('credentials are invalid');
  }
  if (user.password !== password) {
    return res.status(403).send('credentials are invalid');
  }

  res.cookie('userId', user.id);
  res.redirect('/urls');
});

// Sign up user
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    return res.status(400).send('No input entered');
  }

  if (isEmailOccupied(email)) {
    console.log(userDatabase);
    return res.status(400).send('Email is occupied');
  }

  const userRandomId = generateRandomString(8);
  const newUser = { email, password, id: userRandomId };
  userDatabase[userRandomId] = newUser;

  res.cookie('userId', userRandomId);
  res.redirect('/urls');
});

module.exports = router;
