const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const userDatabase = require('./database/user_database');
const urlDatabase = require('./database/url_database');

const emailHelperWithDB = require('./helpers/email_helper');
const generateRandomString = require('./helpers/random_string');

const { isEmailOccupied, getUserFromEmail } = emailHelperWithDB(userDatabase);

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// GET requests
// home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

// urls_index page
app.get('/urls', (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: userDatabase[userId],
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

// new URL add page
app.get('/urls/new', (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: userDatabase[userId],
  };
  res.render('urls_new', templateVars);
});

// URL detail page
app.get('/urls/:shortURL', (req, res) => {
  const userId = req.cookies.userId;
  const templateVars = {
    user: userDatabase[userId],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
  };

  res.render('urls_show', templateVars);
});

// go to actual URL from short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

// Logout user
app.get('/logout', (req, res) => {
  res.clearCookie('userId');
  res.redirect('/urls');
});

app.get('/register', (req, res) => {
  const templateVars = {
    user: null,
  };

  res.render('user_sign_up', templateVars);
});

app.get('/login', (req, res) => {
  const templateVars = {
    user: null,
  };

  res.render('user_sign_in', templateVars);
});

// POST requests
// Create short URL
app.post('/urls', (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString(6);
  urlDatabase[shortURL] = longURL;

  res.redirect('/urls');
});

// Delete URL
app.post('/urls/:shortURL/delete', (req, res) => {
  const urlToRemove = req.params.shortURL;
  delete urlDatabase[urlToRemove];
  res.redirect('/urls');
});

// Update long URL
app.post('/urls/:shortURL', (req, res) => {
  const { longURL } = req.body;
  const urlToEdit = req.params.shortURL;
  urlDatabase[urlToEdit] = longURL;
  res.redirect('/urls');
});

// Login user
app.post('/login', (req, res) => {
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
app.post('/register', (req, res) => {
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

  console.log(userDatabase);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
