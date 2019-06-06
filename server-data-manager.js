/*
Cordless Discord Bot

For docs visit https://cordless.enenra.org

Contributers:
Neel Redkar
Evan Nishi

LICENSE: GNU Affero GPLv3
*/

var Guild = require("./database/models/Guild");
var Currency = require("./database/models/Currency");

exports.readServerData = async function (guildID) {
    var guild = await Guild.findOne({ guildID }).exec();
    if (guild) {
        return guild;
    } else {
        return {
            guildID,
            welcomeMessages: {
                welcomeChannelID: "",
                welcomeMessageEnabled: false,
                mess: ""
            },
            leaveMessages: {
                leaveChannelID: "",
                leaveMessageEnabled: false,
                mess: ""
            },
            profanity: false,
            mute: {
                roleID: ""
            },
            reactions: {
                counter: 0,
                enabled: false
            },
            prefix: "&"
        }
    }
}
exports.achan = async function (type, channel, guild) {
    var gguild = await Guild.findOne({ guildID }).exec();
    if (type == "add") {
        gguild.announcementChannels.arr[guild.announcementChannels.count] = { channel, guild };
        gguild.announcementChannels.count++;
        gguild.save((err, guild) => {});
    } else if (type == "save") {
        gguild.announcementChannels.arr = channel;
        gguild.save((err, guild) => {});
    } else {
        return data.announcementChannels;
    }
}
exports.readUser = async function (PID) {
    var data = await Currency.findOne({ PID }).exec();
    if (data) {
        return data;
    } else {
        return {
            PID,
            money:0
        }
    }
}
exports.writeUser = async function (PID,newDat) {
    var data = await Currency.findOne({ PID }).exec();
    if(!data) data = new Currency();
    data.PID = PID;
    data.money = newDat.money;
    await data.save((err,guild) => {});
}
exports.saveServerData = async function (guildID, newData) {
    var guild = await Guild.findOne({ guildID }).exec();
    if(!guild) guild = new Guild();
    guild.guildID = newData.guildID;
    guild.welcomeMessages = newData.welcomeMessages;
    guild.leaveMessages = newData.leaveMessages;
    guild.profanity = newData.profanity;
    guild.mute = newData.mute;
    guild.reactions = newData.reactions;
    guild.prefix = newData.prefix;
    await guild.save((err, guild) => {});
}