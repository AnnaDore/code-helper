require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);




mongoose
  .connect('mongodb://localhost/programming-helper', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  }); 

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();
//require('./configs/session.config')(app)

// Middleware Setup
app.use(logger('dev'));
app.use(
  session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true, 
      cookie: { maxAge: 60000000000000}, //=1 min
      store: new MongoStore({
          mongooseConnection: mongoose.connection,
          ttl: 60 * 60 * 24 // sec min h = day
      })
  })
)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Register the location for handlebars partials here:
hbs.registerPartials(path.join(__dirname, 'views/partials'))
/* //try pagination
var paginateHelper = require('express-handlebars-paginate');
//Register Helper
hbs.registerHelper('paginateHelper', paginateHelper);
hbs.handlebars.registerHelper('paginateHelper', paginateHelper.createPagination); */

//2nd try paginate

var paginate = require('handlebars-paginate');
hbs.registerHelper('paginate', paginate);



// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);

const auth = require('./routes/auth')
app.use('/', auth)

const loggedIn = require('./routes/loggedIn')
app.use('/', loggedIn)

module.exports = app;
