const config = require('config-node')({
  env: 'development'
});
const mongoose = require('mongoose');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Session = require('./models/sessions');
const Trace = require('./models/traces');

mongoose.connect(config.db, {
  auth: {
    user: config.dbUsername,
    password: config.dbPassword
  }
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html', {
    headers: {
      'content-type': 'text/html'
    }
  });
});
app.post('/create', function(req, res) {
  const instance = new Session();
  instance.sessionId = '12345';
  instance.save();

  res.send('OK');
});

app.get('/join', function(req, res) {
  const sessionId = req.query.sid;
  console.log(sessionId);
  res.send(sessionId);
});
app.get('/index.js', function(req, res) {
  res.sendFile(__dirname + '/index.js', {
    headers: {
      'content-type': 'text/javascript'
    }
  });
});
app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css', {
    headers: {
      'content-type': 'text/css'
    }
  });
});
app.get('/alexa-grid.css', function(req, res) {
  res.sendFile(__dirname + '/alexa-grid.css', {
    headers: {
      'content-type': 'text/css'
    }
  });
});

io.on('connection', function(socket){
  socket.on('room', function(msg) {
    const data = JSON.parse(msg);
    console.log('Joining room', data);
    socket.join(data.sessionId);

    const sessionModel = new Session();
    sessionModel.sessionId = data.sessionId;
    sessionModel.save();
  });

  socket.on('push', function(msg){
    const data = JSON.parse(msg);
    console.log('Pushing for', data.sessionId);
    socket.broadcast.to(data.sessionId).emit('receive', msg);

    const traceModel = new Trace();
    traceModel.sessionId = data.sessionId;
    traceModel.data = data;
    traceModel.save();
  });

  socket.on('clear', function(msg) {
    const data = JSON.parse(msg);
    console.log('Clearing for', data.sessionId);
    io.in(data.sessionId).emit('clear', msg);

    const traceQuery = Trace.deleteMany({
      sessionId: data.sessionId
    }).then((rest) => {
      console.log(rest);
    });
  });
});

http.listen(config.port, function() {
  console.log('listening on *:3000');
});