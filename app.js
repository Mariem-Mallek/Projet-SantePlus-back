var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const http = require("http")  //importation protocole web
const {connectToMongoDB}=require("./db/db")


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/utilisateurRouter');
var ordRouter = require('./routes/ordonnanceRouter');
var rendezVousRouter = require('./routes/rendezvousRouter');
var interRouter = require('./routes/interactionRouter');
var assuranceRouter = require('./routes/assuranceRouter');

require("dotenv").config()  //configuration du fichier env

var app = express();  //serveur

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/ordonnances', ordRouter);
app.use('/rendezvous', rendezVousRouter);
app.use('/interactions', interRouter);
app.use('/assurances', assuranceRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json('error');
});

const server = http.createServer(app)

server.listen(process.env.Port,()=>(
  connectToMongoDB(),
  console.log("mon projet s'execute sur le port 5000")))
