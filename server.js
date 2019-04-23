const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('./models/heart-beat');

const port = process.env.PORT || 3000;

const { 
  storeHeartBeat, 
  getAllHeartBeat, 
  getAllHeartBeat7 
} = require('./controller/heartBeatController')


// Mongo Db connection 
mongoose.Promise = global.Promise;
module.exports = mongoose;
mongoose.connect('mongodb://localhost/heart-beat-realtime', { useNewUrlParser: true }, function (err, data) {
  if (err) {
    console.log('Sorry can not connect with mongodb...');
  } else {
    console.log('Successfully connected mongodb...');
    return;
  }
});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true,
  parameterLimit: 50000
}));

var enableCORS = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, token, Content-Length, X-Requested-With, *');
    if ('OPTIONS' === req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
};
app.use(enableCORS);

io.on('connection', (client) => {
  let intervalTimer; 
  client.on('startHeartBeatCount', (interval, sessionId) => {
    intervalTimer = setInterval(() => {
      const count = Math.floor(Math.random() * 9) + 1;
      storeHeartBeat(sessionId, count);
      getAllHeartBeat(sessionId, client);
      getAllHeartBeat7(sessionId, client);
    }, interval);
  });

  // disconnect is fired when a client leaves the server
  client.on("disconnect", () => {
    console.log("disconnected");
  });
  client.on('stopHearbeatCount', () => {
      clearInterval(intervalTimer)
  });
});

http.listen(port, () => console.log(`Listening on port ${port}`));