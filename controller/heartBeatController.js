const mongoose = require('mongoose');
const HeartBeat = mongoose.model('heartbeat');

async function storeHeartBeat(sessionId, count) {
    try{
      var heartBeat = new HeartBeat({ 
        sessionId: sessionId,
        heartBeats: count
      });
      await heartBeat.save()
    }
    catch (error){
      return console.log('error',error);
    }
  }
  
  function getAllHeartBeat(sessionId, client) {
    HeartBeat.find({
      sessionId: sessionId
    },(err, heartbeats)=> {
      if(err) {
        console.log(err);
      }
      client.emit('changeHeartBeat', heartbeats)
    })
  }
  
  function getAllHeartBeat7(sessionId, client) {
    HeartBeat.find({
      sessionId: sessionId,
      heartBeats: 7 
    },(err, heartbeats)=> {
      if(err) {
        console.log(err);
      }
      client.emit('changeHeartBeatVariation', heartbeats)
    })
  }

module.exports = {
    getAllHeartBeat7:getAllHeartBeat7,
    getAllHeartBeat:getAllHeartBeat,
    storeHeartBeat:storeHeartBeat
};