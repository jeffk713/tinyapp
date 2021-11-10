const express = require('express');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const urlDatabase = require('./database/url_database');

const userRouter = require('./routes/user_routes');
const urlRouter = require('./routes/url_routes');

const app = express();
const PORT = 8080; // default port 8080

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// home page
app.get('/', (req, res) => {
  res.send('Hello!');
});

// go to actual URL from short URL
app.get('/u/:shortURL', (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.use('/urls', urlRouter);

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
