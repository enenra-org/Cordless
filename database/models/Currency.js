var mongoose = require("mongoose");

var Currency = new mongoose.Schema({
    PID: String,
    money:Number,
    times: {
        begtime:Date,
        bettime:Date
    }
});

module.exports = mongoose.model("Currency", Currency);