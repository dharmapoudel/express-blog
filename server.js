
//basic setup
var express = require('express');

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');

var config = require('./config/config.js');


//set up our port
var port = process.env.PORT || 8080;

//define our app using express
var app = express();

//configure the app to use bodyparser()
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/img', express.static('public/img'));
app.use('/js', express.static('public/js'));
app.use('/css', express.static('public/css'));
app.use('/font-awesome', express.static('public/font-awesome'));
//app.use(express.static('public'));


app.set('trust proxy', 1); // trust first proxy 
app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

//set the view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('appRoot', __dirname);

//get the models
var Post = require('./models/post.js');
var User = require('./models/user.js');


//connect to our local database
mongoose.connect(config.url);


//Routes for our application

var router = express.Router();
require('./routes.js')(router);
//register our route : perfixed by /
app.use('/', router);

//start the server
app.listen(port);
console.log('App is running on port '+ port);