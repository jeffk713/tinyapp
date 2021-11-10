const express = require('express');
const router = express.Router();

const userDatabase = require('../database/user_database');
const urlDatabase = require('../database/url_database');

const generateRandomString = require('../helpers/random_string');

//========GET===========//

// urls_index page
router.get('/', (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: userDatabase[userId],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

// new URL add page
router.get('/new', (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) {
    return res.redirect('/login');
  }

  const templateVars = {
    user: userDatabase[userId],
  };
  return res.render('urls_new', templateVars);
});

// URL detail page
router.get('/:shortURL', (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: userDatabase[userId],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    userId,
  };

  res.render('urls_show', templateVars);
});

//==========POST===========//

// Create short URL
router.post('/', (req, res) => {
  const { longURL } = req.body;
  const { userId } = req.cookies;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL, userId };

  res.redirect('/urls');
});

// Delete URL
router.post('/:shortURL/delete', (req, res) => {
  const urlToRemove = req.params.shortURL;
  delete urlDatabase[urlToRemove];
  res.redirect('/urls');
});

// Update long URL
router.post('/:shortURL', (req, res) => {
  const { longURL } = req.body;
  const urlToEdit = req.params.shortURL;
  urlDatabase[urlToEdit].longURL = longURL;
  res.redirect('/urls');
});

module.exports = router;
