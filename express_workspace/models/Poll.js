var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var schema = new Schema({
   pollname: {type: String, required: true},
   pollOptions: {type: Array, required: true},
   pollReasons: {type: Array, required: false},
   pollTotals: {type: Array, required: true}
   
   
});

var userSchema = new Schema({
   username: {type: String, required:true},
   password: {type: String, required:true}
   
});

module.exports = mongoose.model('PollData', schema);
module.exports = mongoose.model ('userdata', userSchema);