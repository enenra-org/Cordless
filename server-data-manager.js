/*
Cordless Discord Bot

For docs visit https://cordless.enenra.org

Contributers:
Neel Redkar
Wong Zhao
Evan Nishi

LICENSE: GNU Affero GPLv3
*/

var Guild = require("./database/models/Guild");
var Currency = require("./database/models/Currency");

var logger = require("./logger")();

var swears = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "bi+ch", "biatch", "bitch", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buttplug", "c0ck", "c0cksucker", "cawk", "clit", "clitoris", "clits", "cnut", "cock", "cok", "cox", "cum", "cunt", "cyalis", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fcuk", "feck", "felching", "flange", "fook", "fooker", "fuck", "fuk", "fux", "f_u_c_k", "gaysex", "hell", "hoar", "hoer", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jerk-off", "kock", "kondum", "kum", "kunilingus", "l3i+ch", "l3itch", "labia", "lusting", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "porn", "porno", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shi+", "shit", "skank", "slut", "sluts", "smegma", "smut", "snatch", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "testical", "testicle", "tit", "vagina", "whoar", "whore"];

exports.readServerData = async function (guildID) {
    if (guildID == "all") {
        return await Guild.find({}).exec();
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
            swears,
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
    logger.neel(gguild + "HI THERE");
    if (type == "add") {
        logger.neel(gguild);
        gguild.announcementChannels.arr.push({ channel, guildID });
        gguild.announcementChannels.count++;
        logger.neel(gguild);
        gguild.save((err, guild) => {});
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
                begtime: "",
                bettime: ""
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
        data.times = newDat.times
    } else {
        data = newDat;
    }
    await data.save((err, guild) => {});
}
exports.saveServerData = async function (newData) {
    const guildID = newData.guildID;
    var guild = await Guild.findOne({ guildID }).exec();
    if(!guild) guild = new Guild();
    guild.guildID = guildID;
    guild.welcomeMessages = newData.welcomeMessages;
    guild.leaveMessages = newData.leaveMessages;
    guild.profanity = newData.profanity;
    guild.swears = newData.swears;
    guild.mute = newData.mute;
    guild.reactions = newData.reactions;
    guild.prefix = newData.prefix;
    await guild.save((err, guild) => {});
}