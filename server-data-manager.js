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
    if (guildID == "all") {
        return await Guild.find({}).exec()
    }
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
            }, announcementChannels: {
                count:0,
                arr:[]
            },
            profanity: false,
            mute: {
                roleID: ""
            },
            reactions: {
                count: 0,
                enabled: false,
                message: []
            },
            prefix: "&"
        }
    }
}
exports.achan = async function (type, channel, guildID) {
    var gguild = await Guild.findOne({ guildID }).exec();
    console.log(gguild + "HI THERE");
    if (type == "add") {
        console.log(gguild);
        gguild.announcementChannels.arr.push({ channel, guildID });
        gguild.announcementChannels.count++;
        console.log(gguild);
        gguild.save((err, guildID) => {});
    } else if (type == "save") {
        gguild.announcementChannels = channel;
        gguild.save((err, guild) => {});
    } else {
        return gguild.announcementChannels;
    }
}
exports.readUser = async function (PID) {
    var data = await Currency.findOne({ PID }).exec();
    if (data) {
        return data;
    } else {
        return {
            PID,
            money:0,
            times: {
                begtime:""
            }
        }
    }
}
exports.writeUser = async function (PID,newDat) {
    var data = await Currency.findOne({ PID }).exec();
    if(!data) { 
        data = new Currency();
        data.PID = PID;
        data.money = newDat.money;
        data.times.begtime = newDat.times.begtime
    } else {
        data = newDat
    }
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