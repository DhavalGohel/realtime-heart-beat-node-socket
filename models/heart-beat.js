const mongoose = require('mongoose');
var HeartBeatSchema = mongoose.Schema({
    sessionId : String,
    heartBeats : Number
});

module.exports = mongoose.model('heartbeat', HeartBeatSchema);