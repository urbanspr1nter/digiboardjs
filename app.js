const config = require('config-node')({
  env: 'development'
});

const mongoose = require('mongoose');
const express = require('express');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Session = require('./models/sessions');
const Trace = require('./models/traces');
const app = express();

/**
 * Setting up the server.
 */
mongoose.connect(config.db, {
  auth: {
    user: config.dbUsername,
    password: config.dbPassword
  },
  socketTimeoutMS: 120000,
  connectTimeoutMS: 60000
});

app.use('/', require('express').static('public'));

/**
 * Define the API
 */
app.post('/create', function(req, res) {
  const instance = new Session();
  instance.sessionId = '12345';
  instance.save();

  res.send('OK');
});

app.get('/traces', function(req, res) {
  const sessionId = req.query.sid;
  const data = [];
  const promise = new Promise((resolve, reject) => {
      const traces = Trace.find({ sessionId: sessionId }).limit(1000).sort({ sequence: 'asc'}).select('data -_id');
      traces.then((coll) => { 
        coll.forEach((m) => {
          const mData = m.data;
          data.push(mData);
        });
        resolve();
      });
  });

  promise.then((result) => {
    const traces = Trace.find({ sessionId: sessionId }).skip(1000).limit(1000).sort({ sequence: 'asc'}).select('data -_id');
    return traces.then((coll) => { 
      coll.forEach((m) => {
        const mData = m.data;
        data.push(mData);
      });
    });
  }).then((result) => {
    const traces = Trace.find({ sessionId: sessionId }).skip(2000).limit(1000).sort({ sequence: 'asc'}).select('data -_id');
    return traces.then((coll) => { 
      coll.forEach((m) => {
        const mData = m.data;
        data.push(mData);
      });
    });
  }).then((result) => {
    res.send(JSON.stringify(data));
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
    traceModel.sequence = data.sequence;
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