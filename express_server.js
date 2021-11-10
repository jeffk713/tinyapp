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
  const url = urlDatabase[req.params.shortURL];
  if (!url) {
    return res.render('page_not_found');
  }

  res.redirect(url.longURL);
});

app.use('/urls', urlRouter);

app.use('/', userRouter);

app.use('*', (req, res) => res.render('page_not_found'));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
