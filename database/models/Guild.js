var mongoose = require("mongoose");

var Guild = new mongoose.Schema({
    guildID: String,
    welcomeMessages: {
        welcomeChannelID: String,
        welcomeMessageEnabled: Boolean,
        mess: String
    },
    leaveMessages: {
        leaveChannelID: String,
        leaveMessageEnabled: Boolean,
        mess: String
    },
    profanity: Boolean,
    mute: {
        roleID: String
    },
    reactions: {
        count: Number,
        enabled: Boolean,
        message: Array
    },
    announcementChannels: {
        count: Number,
        arr: Array  
    },
    prefix: String
});

module.exports = mongoose.model("Guild", Guild);