var mongoose = require("mongoose");

mongoose.connect('localhost:27017/vote');

var PollData = require("../models/Poll");

var polldata = [
    new /*global PollData*/PollData({
        pollname: 'hey'
    }),
    new /*global PollData*/PollData({
        pollname: 'what'
    }),
    
    new /*global PollData*/PollData({
        pollname: 'is'
    }),
    
    new /*global PollData*/PollData({
        pollname: 'hey' 
    }),
    ];
    
   var done = 0;
   
   for(var i = 0; i < polldata.length; i++){
       polldata[i].save(function(err, results){
           done++;
           if (done === polldata.length){
               exit();
           }
       });
   }
    
    function exit(){
        mongoose.disconnect();
        console.log(polldata.length);
    }
    