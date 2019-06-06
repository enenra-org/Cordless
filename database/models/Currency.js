var mongoose = require("mongoose");

var Currency = new mongoose.Schema({
    PID: String,
    money:0
});

module.exports = mongoose.model("Currency", Currency);