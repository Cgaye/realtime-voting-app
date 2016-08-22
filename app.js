var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var db = require('monk')('mongodb://applet:dodgers47@ds035603.mlab.com:35603/voting-app-db');
var pollDataToSend = db.get('polldata');
var url = 'mongodb://localhost:27017/vote';



var routes = require('./routes/index');


var app = express();
var server = http.createServer(app);
//mongoose.connect('localhost:27017/vote');
var io = require('socket.io').listen(server);

var connections = [];


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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


module.exports = app;

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});


io.sockets.on('connection', function(socket){
  connections.push(socket);
  console.log(socket + " was pushed");
  
 socket.on('readyForUpdate', function(data){
   console.log(data + ' is here');
   
   var pollToUpdate = pollDataToSend.find({"pollName": data});
   pollToUpdate.on('success', function(doc){
     var pollToSend = doc[0].pollTotals;
     var reasonOneToSend = doc[0].reasonTotalsOne;
     var reasonTwoToSend = doc[0].reasonTotalsTwo;
     var pollNameToSend = doc[0].pollName;
     
     var objectToSend = {
       mainVotes: pollToSend,
       reasonOneVotes: reasonOneToSend,
       reasonTwoVotes: reasonTwoToSend,
       pollNameSent: pollNameToSend
     };
     
     console.log(reasonOneToSend);
     console.log(doc);
     
     io.sockets.emit('dataChanged', objectToSend);
   });
   
 });  
 
});


