//Build a Pinterest Clone
//FCC API Basejump: Build a Pinterest Clone
//14.08.2016
'use strict';

var mongo = require('./mydatabaseconn.js');

var ejs = require('ejs');

var express = require('express');

var routes = require('./routes');

var app = express();

var server = require('http').createServer(app);

var morgan = require('morgan');
var bodyParser = require('body-parser');

app.set('view engine', 'ejs');

////////////

app.use(morgan('dev')); // logger
var cookieParser = require('cookie-parser');
var session = require('express-session');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 
app.use('/', express.static(process.cwd() + '/')); 
      
var port = process.env.PORT || 8080;

var secret = process.env.SECRET || 'nodejsappmvcxvcxvinpinterest';

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));

app.get('/', routes.index);
app.get('/welcome', routes.welcome);
app.post('/addpic', routes.addpic);
app.get('/mypics', routes.mypics);
app.post('/userPics', routes.userPics);
app.post('/delmypic', routes.delmypic);
app.get('/all', routes.all);
app.post('/likes', routes.likes);
app.get('/logout', routes.logout);
app.get('/login', routes.login);

mongo.init(function (error) {
    if (error)
        throw error;

    app.listen(port,  function () 
{
	
console.log('Node.js ... HERE ... listening on port ' + port + '...');

});
});
//////