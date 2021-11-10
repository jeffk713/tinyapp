const express = require('express');
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const urlDatabase = {
  b2xVn2: 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com',
};

const generateRandomString = () => {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// app.get('/urls.json', (req, res) => {
//   res.send(urlDatabase);
// });

// app.get('/hello', (req, res) => {
//   const templateVars = { greeting: 'Hello World!' };
//   res.render('hello_world', templateVars);
// });

// GET requests
// home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

// urls_index page
app.get('/urls', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
    urls: urlDatabase,
  };
  res.render('urls_index', templateVars);
});

// new URL add page
app.get('/urls/new', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
  };
  res.render('urls_new', templateVars);
});

// URL detail page
app.get('/urls/:shortURL', (req, res) => {
  const templateVars = {
    username: req.cookies.username,
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
  res.clearCookie('username');
  res.redirect('/urls');
});

// POST requests
// Create short URL
app.post('/urls', (req, res) => {
  const { longURL } = req.body;
  const shortURL = generateRandomString();
  urlDatabase[shortURL] = longURL;

  // const templateVars = { username: req.cookies(username), urls: urlDatabase };
  // res.render('urls_index', templateVars);
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
  const { username } = req.body;

  res.cookie('username', username);

  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
