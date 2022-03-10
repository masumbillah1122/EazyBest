var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

//Admin Router
const AdminRouter = require('./api/auth/routes/adminRoute');


var app = express();

// Admin route
app.use('/admin', AdminRouter);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// DB Connnection Here
mongoose.connect("mongodb+srv://masumkhan:169572274@cluster0.wnhig.mongodb.net/Eazybest?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false
    })
    .then(() => console.log("Datebase connected"))
    .catch(error => {
        if (error) console.log("Database connection failed")
    })



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
    res.render('error');
});

module.exports = app;