var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
const session = require('express-session');
// stores session in database
const MongodbStore = require('connect-mongodb-session')(session);
// to store error messages per session
const flash = require('connect-flash');
var app = express();

var port = process.env.PORT || 3000;

const route = require('./routes/Routes');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const store = new MongodbStore({
  uri: 'mongodb://localhost:27017/arnoldgym',
  collection: 'sessions'
});
// databse connection
mongoose.connect(
  'mongodb://localhost:27017/arnoldgym',
  { useUnifiedTopology: true },
  { useNewUrlParser: true }
);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function () {
  console.log('connected to database');
});

app.use(
  session({
    secret: ' my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(flash());
// to render home page
app.get('/', function (req, res) {
  res.render('homepage.ejs', {
    title: 'Home',
    isAuthenticated: req.session.isLoggedIn
  });
});
app.use(route);

app.listen(port, console.log('server started'));
