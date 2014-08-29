var express = require('express');
var mongoose = require('mongoose');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');//Put y delete
var session = require('express-session');//Para el manejo de las sesiones
var flash = require("connect-flash");//Para los mensajes de informacion

var routes = require('./routes/index');
var tareas = require('./routes/tareas');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(session({  
    secret: "VG17BHQKJI",
    resave: true,
    saveUninitialized: true }));//Clave secreta para las sesiones
app.use(flash());//Midware para usar textos de informacion


//Habilitamos PUTS  y DELETE gracias al method-override
app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/tareas',tareas);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
//----------------|Conexion con MONGODB|-----------------------
mongoose.connect('mongodb://localhost/gestor_tareas',function(err){
    if(!err){
        console.log('Se ha establecido conexion con MONGODB');
    }else{
        throw err;
    }
});


module.exports = app;
