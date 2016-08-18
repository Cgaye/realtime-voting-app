var express = require('express');
var router = express.Router();
var PollData = require("../models/Poll");
var userdata = require("../models/Poll");
var db = require('monk')('localhost:27017/test');
var userData  = db.get('userdata');
var pollDataToSend = db.get('polldata');
var url = 'mongodb://localhost:27017/vote';


/* GET home page. */
router.get('/', function(req, res, next) {

      res.render('index', { title: 'Voting-app-project' });
 });

router.post('/userSubmit', function(req, res, next) {
 var userAndPass = {
  username: req.body.userNameInput,
  password: req.body.passwordInput
 };
 console.log(userAndPass);
    
    userData.insert(userAndPass);
    res.render('pollScreen');
});

router.post('/pollSubmit', function(req, res, next) {
 var pollToSend = {
 pollName: req.body.pollName,
 pollOptions: req.body.pollOptions,
 pollReasons: req.body.pollReasons,
 pollTotals:[0,0],
 reasonTotals: [0,0,0],
 reasonTotalsOne: [0,0,0],
 reasonTotalsTwo: [0,0,0]
 };
 console.log(pollToSend);
 
 pollDataToSend.insert(pollToSend);
    
  

});

router.get('/getPolls', function(req,res,next){
 var data = pollDataToSend.find({});
 data.on('success', function(docs){
  res.render('pollScreen', {polls: docs});
  console.log(docs);
 });
 
});

router.post('/pollOptionsScreen', function(req, res, next) {
 console.log('we reached the router..');
 var selected = req.body.id;
 console.log(selected);
 var pollNameSelected = pollDataToSend.find({"pollName": selected});
 pollNameSelected.on('success', function(docs){
  res.render('pollOptions', {chosethis: docs});
  console.log(docs);
 });
   
});





router.post('/chart', function(req, res, next) {

 var idSelection = req.body.idSelection;

 var reasonAggregate = pollDataToSend.find({"pollName": idSelection});
 reasonAggregate.on('success', function(doc){
 var vote = req.body.id;
 var reasonVote = req.body.idReason;
 var voteToUpdate = doc[0].pollTotals;
 var reasonToUpdate = doc[0].reasonTotals;
 var reasonToUpdateOne = doc[0].reasonTotalsOne;
 var reasonToUpdateTwo = doc[0].reasonTotalsTwo;
 
  
  if (vote == 0 && reasonVote == 0) {
   voteToUpdate[0]++;
   reasonToUpdateOne[0]++;
  } else if (vote == 0 && reasonVote == 1) {
   voteToUpdate[0]++;
   reasonToUpdateOne[1]++;
  } else if (vote == 0 && reasonVote == 2) {
   voteToUpdate[0]++;
   reasonToUpdateOne[2]++;
  }
  
   else if (vote == 1 && reasonVote == 0) {
   voteToUpdate[1]++;
   reasonToUpdateTwo[0]++;
  } else if (vote == 1 && reasonVote == 1) {
   voteToUpdate[1]++;
   reasonToUpdateTwo[1]++;
  } else if (vote == 1 && reasonVote == 2) {
   voteToUpdate[1]++;
   reasonToUpdateTwo[2]++;
  }
  
  
  
pollDataToSend.update(
   { pollName: idSelection },
   { $set:
      {
   pollTotals: voteToUpdate,
   reasonTotals: reasonToUpdate,
   reasonTotalsOne: reasonToUpdateOne,
   reasonTotalsTwo: reasonToUpdateTwo
      }
   }
);
 
 
 console.log(vote);
 console.log(reasonVote);
 console.log(voteToUpdate);
 console.log(reasonToUpdate);
 console.log(doc);
 console.log(reasonToUpdateOne);
 console.log(reasonToUpdateTwo);


   res.render('chartPage', {chartInfo: doc});

 });
 
});
module.exports = router;
