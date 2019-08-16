/*
Cordless Discord Bot

For docs visit https://cordless.enenra.org

Contributers:
Neel Redkar
Wong Zhao
Evan Nishi

LICENSE: GNU Affero GPLv3
*/
const discord = require('discord.js');
require('dotenv').config();
const commands = require("./commands");
const SDM = require('./server-data-manager');
const express = require('express');
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
const Music = require("./discord-music");
const testChannel = "575022379756027904";
const client = new discord.Client();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO, {useNewUrlParser: true});

const logger = require("./logger")();

const music = new Music(client, {
    youtubeKey: process.env.YTTOKEN,
    prefix: "&",
    maxQueueSize: 9999,
    anyoneCanSkip: true,
    helpCmd: "helpmusic",
    loopCmd: "loop",
    playCmd: "play",
    skipCmd: "skip",
    queueCmd: "queue",
    enableQueueStat: true,
    pauseCmd: "pause",
    resumeCmd: "resume",
    volumeCmd: "setvol",
    leaveCmd: "leavemus",
    searchCmd: "search",
    
});
process.on('uncaughtException', err => {
    logger.error(`Caught exception: ${err}`);
});

client.on("raw", async packet => {
    if (packet.t != "MESSAGE_REACTION_ADD") { return }
    data = await SDM.readServerData(packet.d.guild_id);
    logger.neel(packet);
    count = 0;
    while (count < data.reactions.count && data.reactions.enabled) {
        logger.neel("IN THE WHILE LOOP");
        try {
            if (packet.d.emoji.name == data.reactions.message[count].reaction && packet.d.message_id == data.reactions.message[count].messageID) {
                logger.neel("MOOP TRIGGERED");
                logger.neel(String(data.reactions.message[count].roleID));
                client.guilds.get(packet.d.guild_id).members.get(packet.d.user_id).addRole(data.reactions.message[count].roleID)
                    .then(logger.debug)
                    .catch(logger.error);
            }
        } catch (error) {
            logger.error(`Error in Discord client 'raw' event: ${error}`);
        }
        count += 1;
    }
});
client.on('ready', () => {
    logger.info(`Cordless connected to Discord as ${client.user.tag}`);
    client.user.setActivity(String(client.guilds.size) + " servers | cordless.enenra.org", { type: "PLAYING" });
    try {
        client.channels.get(testChannel).send('Bot Operational');
    } catch {
        logger.debug("Sending startup message to test channel failed");
    }
});

client.on('message', async msg => {
    if (msg.guild == null || msg.author.bot) return;
    data = await SDM.readServerData(msg.member.guild.id);
    if(msg.mentions.users.find(val => val.id === client.user.id)) {
        return msg.channel.send(`On this server, my prefix is \`${data.prefix}\`.`);
    }

    if (data.profanity && !msg.channel.nsfw) {
        var swears = ["4r5e", "5h1t", "5hit", "a55", "anal", "anus", "ar5e", "arrse", "arse", "ass", "a_s_s", "b!tch", "b00bs", "b17ch", "b1tch", "bi+ch", "biatch", "bitch", "blow job", "blowjob", "blowjobs", "boiolas", "bollock", "bollok", "boner", "boob", "booobs", "boooobs", "booooobs", "booooooobs", "breasts", "buttplug", "c0ck", "c0cksucker", "cawk", "clit", "clitoris", "clits", "cnut", "cock", "cok", "cox", "cum", "cunt", "cyalis", "d1ck", "damn", "dick", "dickhead", "dildo", "dildos", "dink", "dinks", "dirsa", "dlck", "dog-fucker", "doggin", "dogging", "donkeyribber", "doosh", "duche", "dyke", "ejaculate", "ejaculated", "ejaculates", "ejaculating", "ejaculatings", "ejaculation", "ejakulate", "f u c k", "f u c k e r", "f4nny", "fag", "fcuk", "feck", "felching", "flange", "fook", "fooker", "fuck", "fuk", "fux", "f_u_c_k", "gaysex", "hell", "hoar", "hoer", "hore", "horniest", "horny", "hotsex", "jack-off", "jackoff", "jerk-off", "kock", "kondum", "kum", "kunilingus", "l3i+ch", "l3itch", "labia", "lusting", "m45terbate", "ma5terb8", "ma5terbate", "masochist", "master-bate", "masterb8", "masterbat*", "masterbat3", "masterbate", "masterbation", "masterbations", "masturbate", "mo-fo", "mof0", "mofo", "mothafuck", "mothafucka", "mothafuckas", "mothafuckaz", "mothafucked", "mothafucker", "mothafuckers", "mothafuckin", "mothafucking", "mothafuckings", "mothafucks", "mother fucker", "motherfuck", "motherfucked", "motherfucker", "motherfuckers", "motherfuckin", "motherfucking", "motherfuckings", "motherfuckka", "motherfucks", "muff", "muthafecker", "muthafuckker", "muther", "mutherfucker", "n1gga", "n1gger", "nigg3r", "nigg4h", "nigga", "niggah", "niggas", "niggaz", "nigger", "niggers", "numbnuts", "nutsack", "orgasim", "orgasims", "orgasm", "orgasms", "p0rn", "pawn", "pecker", "penis", "penisfucker", "phonesex", "phuck", "phuk", "phuked", "phuking", "phukked", "phukking", "phuks", "phuq", "pigfucker", "pimpis", "piss", "porn", "porno", "pube", "pusse", "pussi", "pussies", "pussy", "pussys", "rectum", "retard", "rimjaw", "rimming", "s hit", "semen", "sex", "sh!+", "sh!t", "sh1t", "shag", "shagger", "shaggin", "shi+", "shit", "skank", "slut", "sluts", "smegma", "smut", "snatch", "s_h_i_t", "t1tt1e5", "t1tties", "teets", "testical", "testicle", "tit", "vagina", "whoar", "whore"];
        if(data.swears && data.swears.length > 0) swears = data.swears;
        checker = msg.content.toLowerCase();
        swears.forEach(swear => {
            if(checker.includes(swear)) {
                msg.delete(1);
                if(!msg.content.startsWith(data.prefix)) msg.channel.send(":rage: NO CURSING!! :rage: ");
            }
        });
    }
    if (msg.content.startsWith(data.prefix)) {
        messy = msg.content.slice(data.prefix.length);
        args = messy.split(" ");
        command = args.shift();
        command = command.toLowerCase();
        commands.runCommand(command, args, msg.channel, client, msg);
    }
});
client.on('guildMemberAdd', async member => {
    data = await SDM.readServerData(member.guild.id);
    if (data.welcomeMessages.welcomeMessageEnabled === true) {
        if ((member.guild.memberCount % 10) == 1) {
            pref = "st";
        } else if ((member.guild.memberCount % 10) == 2) {
            pref = "nd";
        } else if ((member.guild.memberCount % 10) == 3) {
            pref = "rd";
        } else {
            pref = "th";
        }
        message = data.welcomeMessages.mess
        message = message.replace("$name", member.displayName);
        message = message.replace("$count", member.guild.memberCount + pref);
        member.guild.channels.get(data.welcomeMessages.welcomeChannelID).send(message);
    }
});
client.on('guildMemberRemove', async member => {
    data = await SDM.readServerData(member.guild.id);
    if (data.leaveMessages.leaveMessageEnabled === true) {
        if ((member.guild.memberCount % 10) == 1) {
            pref = "st";
        } else if ((member.guild.memberCount % 10) == 2) {
            pref = "nd";
        } else if ((member.guild.memberCount % 10) == 3) {
            pref = "rd";
        } else {
            pref = "th";
        }
        message = data.leaveMessages.mess
        message = message.replace("$name", member.displayName);
        message = message.replace("$count", member.guild.memberCount + pref);
        member.guild.channels.get(data.leaveMessages.leaveChannelID).send(message);
    }
});

app.post('/announcement', async (req, res) => {
    let buff = Buffer.from(req.headers.authorization.split(" ")[1], 'base64');  
    let text = buff.toString('ascii');
    if (text.split(":")[1] == process.env.ANNOUNCE) {
        logger.debug('yeeted');
        res.json("authe?");
        data = await SDM.readServerData("all")
        x = 0
        while (x < data.length) {
            y = 0
            logger.debug(x)
            logger.debug(data[x].announcementChannels.arr);
            while (y < data[x].announcementChannels.arr.length) {
                logger.debug(data[x].announcementChannels.arr[y].channel);
                client.channels.get(data[x].announcementChannels.arr[y].channel).send(req.body.msg);
                y++;
            }
            x++;
        }
    } else {
        res.json("NON AUTHE??>!??!?!?");
    }
});
app.get("/", async (req,res) => {
    res.send("I have been kept alive!")
})
client.login(process.env.TOKEN);
app.listen(process.env.PORT || 3000, () => {
    logger.info(`Cordless now listening on port ${process.env.PORT || 3000}`);
});