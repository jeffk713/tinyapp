const express = require('express');
const router = express.Router();

const userDatabase = require('../database/user_database');
const urlDatabase = require('../database/url_database');
const helperWithUrlDB = require('../helpers/helper_with_urlDB');

const { getUrlsForUser } = helperWithUrlDB(urlDatabase);
const generateRandomString = require('../helpers/random_string');

//========GET===========//

// urls_index page
router.get('/', (req, res) => {
  const userId = req.cookies.userId;

  const userUrlList = getUrlsForUser(userId);
  const templateVars = {
    user: userDatabase[userId],
    urls: userUrlList,
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
  const { userId } = req.cookies;
  const urlObj = urlDatabase[req.params.shortURL];

  if (!urlObj) {
    return res.render('page_not_found');
  }

  let templateVars;
  if (userId !== urlObj.userId) {
    templateVars = {
      isAuth: false,
      user: userDatabase[userId],
    };
  } else {
    templateVars = {
      isAuth: true,
      user: userDatabase[userId],
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL].longURL,
      userId,
    };
  }

  res.render('urls_show', templateVars);
});

//==========POST===========//

// Create short URL
router.post('/', (req, res) => {
  const { longURL } = req.body;
  const { userId } = req.cookies;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = { longURL: `https://${longURL}`, userId };

  res.redirect('/urls');
});

// Delete URL
router.post('/:shortURL/delete', (req, res) => {
  const userId = req.cookies.userId;
  const urlKeyToRemove = req.params.shortURL;
  const urlToRemove = urlDatabase[urlKeyToRemove];

  if (userId !== urlToRemove.userId) {
    console.log('Cannot delete URL that is not created by owner');
    return res
      .status(400)
      .send('Cannot delete URL that is not created by owner');
  }

  delete urlDatabase[urlKeyToRemove];
  res.redirect('/urls');
});

// Update long URL
router.post('/:shortURL', (req, res) => {
  const userId = req.cookies.userId;
  const urlKeyToEdit = req.params.shortURL;
  const urlToEdit = urlDatabase[urlKeyToEdit];

  if (userId !== urlToEdit.userId) {
    console.log('Cannot edit URL that is not created by owner');
    return res.status(400).send('Cannot edit URL that is not created by owner');
  }

  const { longURL } = req.body;
  urlToEdit.longURL = longURL;
  res.redirect('/urls');
});

module.exports = router;
