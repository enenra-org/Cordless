/*
Cordless Discord Bot

For docs visit https://cordless.enenra.org

Contributers:
Neel Redkar
Wong Zhao
Evan Nishi

LICENSE: GNU Affero GPLv3
To add a command please copy the function template below titling it by the name of the function and then add the line:
commandsTable["commandname"] = functionName;

to the bottom of this file. The command name must be ALL lowercase and must not contain spaces.
Command function template:
function help(client, channel, args) {
    
}
*/
let Parser = require("rss-parser");
let parser = new Parser();
const { RichEmbed } = require("discord.js");
const SDM = require("./server-data-manager");
const axios = require("axios");
commandsTable = {}; // Commands hash table
var moment = require("moment");
const fetch = require("node-fetch");

const logger = require("./logger")();

async function help(client, channel, args, msg) {
    data = await SDM.readServerData(channel.guild.id);
    const embed = new RichEmbed();
    embed.setColor(2012);
    switch (args[0]) {
        case "general":
            embed.setTitle("Cordless General Help");
            embed.addField("General Commands", "`help, prechange, ping, addanoun`");
            break;
        case "music":
            embed.setTitle("Cordless Music Help");
            embed.addField("Music Commands", "`play, pause, resume, queue, skip, loop, setvol, search, clearqueue, np, leavemus`");
            break;
        case "mod":
            embed.setTitle("Cordless Moderation Help");
            embed.addField("Moderation Commands", "`mute, prof`");
            break;
        case "util":
            embed.setTitle("Cordless Utility Help");
            embed.addField("Utility Commands", "`clear, embed, welcome-message, welcome-setup, welcome-stop, leave-message, leave-setup, leave-stop`");
            break;
        case "mem":
            embed.setTitle("Cordless Meme Help");
            embed.addField("Meme Commands", "`startflow, stopflow, meme, xkcd`");
            break;
        default:
            if(helpInformation.hasOwnProperty(args[0])) {
                embed.setTitle(args[0]);
                embed.setDescription(helpInformation[args[0]]);
            } else {
                embed.setTitle("Cordless Help");
                embed.setDescription("For a full set of commands and descriptions visit https://cordless.enenra.org/documentation \n \n Your prefix is **" + data.prefix + "**");
                embed.addField("General", "For more info on general commands, try `" + data.prefix + "help general`");
                embed.addField("Music", "For more info on music commands, try `" + data.prefix + "help music`");
                embed.addField("Moderation", "For more info on moderation commands, try `" + data.prefix + "help mod`");
                embed.addField("Utility", "For more info on utitlity commands, try `" + data.prefix + "help util`");
                embed.addField("Memes", "For more info on meme commands, try `" + data.prefix + "help mem`");
            }
    }
    channel.send({ embed });
}
async function clearchan(client, channel, args, msg) {
    //DEBBUGEING
    msg.delete();
    var fetched = 1;
    while (fetched.size > 0) {
        fetched = await msg.channel.fetchMessages({ limit: 99 });
        msg.channel.bulkDelete(fetched);
    }
    channel.send("Deleted all!!!");
    msg.delete(3000);
}

function argPrint(client, channel, args) {
    channel.send(args[0]);
}
//Basic ping pong command.  Returns user's ping
function ping(client, channel, args) {
    const embed = {
        "color": 15747444,
        "description": "🏓Pong! " + client.ping + " ms🏓"
    };
    channel.send({ embed });
}
async function fml(client, channel, args) {
    array = [];
    let feed = await parser.parseURL('https://www.fmylife.com/rss');
    feed.items.forEach(item => {
        array.push(item.content);
    });
    channel.send("**Warning! Possible NSFW content** ||" + array[rand(0, array.length)] + "||");
}
function makeEmbed(client, channel, args, msg) {
    msg.delete(1000);
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    if (isNaN(args[0])) {
        channel.send("Please input a number for the color.");
        return;
    } else if (args.length < 3) {
        channel.send("Please input a number for the color and the text separated by |");
    }
    const embed = new RichEmbed();
    try {
        embed.setColor(args[0]);
    } catch {
        embed.setColor(0x000000);
    }
    args.shift();
    temp = args.join(" ");
    args = temp.split("|");
    if (args.length != 2) {
        channel.send("Please use a `|` to separate your field title from your field value.");
    }
    embed.addField(args[0], args[1]);
    channel.send({ embed });
}
async function setupreaction(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    } else if (isNaN(args[0]) || args.length < 4) {
        channel.send("We need your message to be formatted `&setupreaction channelID messageID reaction roleID`")
        return;
    }
    async function sendReact() {
        await client.channels.get(args[0]).fetchMessage(args[1])
            .then(message => {
                message.react(args[2])
                    .then(logger.debug)
                    .catch(logger.error);
            })
            .catch(logger.error);
    }
    sendReact();
    data = await SDM.readServerData(channel.guild.id);
    logger.debug(data);
    logger.debug(data.reactions.count)
    roleInfo = {}
    roleInfo.messageID = args[1];
    roleInfo.reaction = args[2],
    roleInfo.roleID = args[3];
    logger.debug(roleInfo);
    data.reactions.message.push(roleInfo);
    logger.debug(data);
    data.reactions.enabled = true;
    data.reactions.count += 1;
    logger.debug(data);
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Set reaction message role! :thumbsup:");
}
async function clearReact(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    } else if (isNaN(args[0])) {
        channel.send("We need your message to be formatted `&clearreaction messageID`");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    count = 0;
    while (count < data.reactions.count) {
        logger.neel("while");
        try {
            if (data.reactions.message[count].messageID == args[0]) {
                logger.neel("if");
                delete data.reactions.message[count];
            };
        } catch (error) {
            logger.error(`Error in function clearReact: ${error}`);
            logger.neel("lol clear eer sccorse");
        }
        count += 1;
    }
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Reaction has been deleted!");
}
//creates mute role
async function mute(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    if (channel.guild.roles.find(val => val.name === "mute") != null) {
        logger.neel("role exists");
        msg.mentions.members.first().removeRoles(msg.mentions.members.first().roles).then(logger.debug).catch(logger.error)
        msg.mentions.members.first().addRole(channel.guild.roles.find(val => val.name === "mute"));
    } else {
        logger.neel("role doesn't exist");
        channel.guild.createRole({
            name: "mute",
            color: "375575883097833483",
            hoist: false,
            mentionable: false,
            position: 1,
            permissions: ["READ_MESSAGE_HISTORY", "CONNECT"]
        });
        msg.mentions.members.first().addRole(channel.guild.roles.find(val => val.name === "mute"));
        await SDM.saveServerData(channel.guild.id, data);
    }

    if (data.mute.roleID = "") {
        data.mute.roleID = channel.guild.roles.find(val => val.name === "mute").id;
        await SDM.saveServerData(channel.guild.id, data);
    }
    if (msg.mentions.users.first() != null) {
        user = msg.mentions.users.first();
        logger.neel(user.id);
    }

}
function info(client, channel, args, msg) {
    embed = new RichEmbed()
        .setTitle("Info")
        .setColor(0xEFFF00)
        .setDescription("Hi! This is Cordless, a discord bot for all your needs! \n \n Find our discord server at https://discord.gg/sTCsbew and view my code at https://github.com/enenra-team-tech/discord-bot \n \n Thanks for using Cordless!!! :smile: :thumbsup:")
        .setImage("https://cordless.enenra.org/public/logo.png");
    channel.send(embed);
}
//add welcome channel
async function welcomeSetup(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    if (isNaN(args[0])) {
        channel.send("Please input a channel ID for the welcome.");
        return;
    }

    data = await SDM.readServerData(channel.guild.id);
    data.welcomeMessages.welcomeMessageEnabled = true;
    data.welcomeMessages.welcomeChannelID = args[0];
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Channel ID Set for welcome message");
};
async function prof(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    data.profanity = !data.profanity;
    if (data.profanity == true) {
        channel.send("Profanity filter on! :thumbsup: ");
    } else {
        channel.send("Profanity filter off?!?!?! :rage:");
    }
    await SDM.saveServerData(channel.guild.id, data);
}
async function addAnnounce(client, channel, args, msg) {
    if (isNaN(args[0])) {
        channel.send("There needs to be a CHANNEL ID to actually sign up for an accouncement channel....");
    } else if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You NEED TO BE AN ADMIN... HHAHAHA you noooooob")
    } else {
        await SDM.achan("add", args[0], channel.guild.id);
        channel.send("Channel added to the Cordless announcements!!!")
    }
}
async function delAnnounce(client, channel, args, msg) {
    if (isNaN(args[0])) {
        channel.send("There needs to be a CHANNEL ID to actually sign up for an accouncement channel....");
    } else if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You NEED TO BE AN ADMIN... HHAHAHA you noooooob")
    } else {
        channels = await SDM.achan(null, null, channel.guild.id);
        logger.neel(channels)
        logger.neel("FINDING");
        var x = 0;
        try {
            while (x < channels.count) {
                logger.neel(channels.arr[x]);
                logger.neel(channels.arr[x].channel == args[0] && channel.guild.id == channels.arr[x].guildID);
                if (channels.arr[x].channel == args[0] && channel.guild.id == channels.arr[x].guildID) {
                    channels.arr.splice(x,1);
                    logger.neel("DELETED");
            }
            x++;
        }} catch (err) {
            logger.neel(err);
        }
        logger.neel(channels);
        await SDM.achan("save", channels, channel.guild.id);
        channel.send("Succesfully deleted the channel");
    }
}
async function welcomeMessage(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    if (data.welcomeMessages.welcomeMessageEnabled = false) {
        channel.send("You need to enter &welcome-setup first!!!");
    }
    message = "";
    x = 0;
    while (x < args.length) {
        message += args[x] + " ";
        x++;
    }
    data.welcomeMessages.mess = message;
    await SDM.saveServerData(channel.guild.id, data);
    logger.neel(message);
    channel.send("Channel thingy Set for welcome message");
};
async function delWelcome(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    data.welcomeMessages.welcomeMessageEnabled = false;
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Stopped welcomes!");
}
function xkcd(client, channel, args, msg) {
    axios.get('https://xkcd.com/info.0.json')
        .then(function (response) {
            numMem = response.data.num;
            number = rand(1, numMem);
            axios.get('https://xkcd.com/' + number + '/info.0.json')
                .then(function (res) {
                    const embed = new RichEmbed()
                        .setColor(0x96a8c8)
                        .setTitle("A xkcd webcomic")
                        .setDescription(res.data.title)
                        .setImage(res.data.img)
                        .setFooter("This webcomic was gotten from https://xkcd.com")
                    channel.send(embed);
                })
                .catch(logger.error);
        })
        .catch(logger.error);
}
async function leaveSetup(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    if (isNaN(args[0])) {
        channel.send("Please input a channel ID for the leave");
        return;
    }

    data = await SDM.readServerData(channel.guild.id);
    data.leaveMessages.leaveMessageEnabled = true;
    data.leaveMessages.leaveChannelID = args[0];
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Channel ID Set for leave message");
};
async function prechange(client, channel, args, msg) {
    logger.neel(args[0]);
    logger.neel(typeof (args[0]))
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    } else if (typeof (args[0]) != "string") {
        channel.send("Please input a text prefix to change it");
        return;
    }

    data = await SDM.readServerData(channel.guild.id);
    data.prefix = args[0];
    data.prefix = data.prefix.replace("{space}", " ");
    await SDM.saveServerData(channel.guild.id, data);
    channel.send(`@everyone The prefix for this server is now \`${data.prefix}\``);
}
async function leaveMessage(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    if (data.leaveMessages.leaveMessageEnabled = false) {
        channel.send("You need to enter &leave-setup first!!!");
    }
    message = "";
    x = 0;
    while (x < args.length) {
        message += args[x] + " ";
        x++;
    }
    data.leaveMessages.mess = message;
    await SDM.saveServerData(channel.guild.id, data);
    logger.neel(message);
    channel.send("Channel thingy Set for leave message");
};
function msgdel(client, channel, args, message) {
    if (!message.member.hasPermission("MANAGE_MESSAGES")) {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    if (isNaN(args[0])) {
        channel.send("Please enter a number of messages to delete!");
        return;
    }
    number = Number(args[0]) + 1;
    logger.neel(number);
    message.channel.bulkDelete(number).then(() => {
        message.channel.send("**Deleted " + args[0] + " messages.**").then(msg => msg.delete(3000));
    }).catch(() => {
        channel.send("Max of 99 messages allowed!!!");
    });
}
function join() {

}
async function delLeave(client, channel, args, msg) {
    if (!msg.member.hasPermission("ADMINISTRATOR") && msg.author.id != "539618266579206145") {
        channel.send("You do not have the permissions to run this command!");
        return;
    }
    data = await SDM.readServerData(channel.guild.id);
    data.leaveMessages.leaveMessageEnabled = false;
    await SDM.saveServerData(channel.guild.id, data);
    channel.send("Stopped leaves!")
}

//Currency Commands
async function addMun(client, channel, args, msg) {
    data = await SDM.readUser(msg.author.id);
    var curr = moment(data.times.begtime)
    logger.neel(curr.diff(moment(),"seconds"));
    if (curr.diff(moment(),"seconds") > -60 ) {
        channel.send(`Too fast, you dirty begger. Wait ${60-(0 - curr.diff(moment(),"seconds"))} more seconds.`)
        return;
    }
    added = rand(0, 70)
    data.money += added;
    data.times.begtime = moment();
    logger.neel(data);
    await SDM.writeUser(msg.author.id, data);
    await channel.send(`Stop begging you brat! I'll only give you ${added} coins!`);
}
async function gamble(client, channel, args, msg) {
    betAmount = Math.round(Number(args[0]));
    if (isNaN(betAmount) && args[0] != "all") {
        channel.send("Enter a NUMBER! Are you trying to break me?????");
        return;
    }
    data = await SDM.readUser(msg.author.id);
    if (args[0] == "all") {
        betAmount = data.money;
    }
    var curr = moment(data.times.bettime)
    logger.neel(curr.diff(moment(),"seconds"));
    if (curr.diff(moment(),"seconds") > -10 ) {
        channel.send(`Too fast, you gambler! Wait ${10-(0 - curr.diff(moment(),"seconds"))} more seconds.`)
        return;
    }else if (betAmount > data.money) {
        channel.send("You need to bet an amount of money that you have......");
        return;
    }
    multiplier = rand(0, 2);
    if (multiplier == 0) {
        data.money+=Math.round(Number(betAmount*0.5));
        const embed = new RichEmbed()
            .setTitle("Gambling Results!")
            .setDescription(`You have won ${Math.round(Number(betAmount*0.5))} more coins! Your new balance is ${data.money}!`)
            .setColor(0x13a532);
        channel.send(embed);
    } else {
        data.money -= betAmount;
        const embed = new RichEmbed()
            .setTitle("Gambling Results!")
            .setDescription(`You have LOST ${betAmount} coins! Your new balance is ${data.money}!`)
            .setColor(0xec1b1b);
        channel.send(embed);
    }
    data.times.bettime = moment();
    logger.neel(data);
    await SDM.writeUser(msg.author.id, data);
}
async function bal(client, channel, args, msg) {
    data = await SDM.readUser(msg.author.id);
    channel.send(`Your balance is ${data.money} coins`);
}

var rip = false;
const memechan = ["https://www.reddit.com/r/dankmemes/rising/.json", "https://www.reddit.com/r/me_irl/rising/.json", "https://www.reddit.com/r/memes/rising/.json"];

const getMeme = async (client, message) => {
    try {
        x = rand(0, 2)
        logger.debug(x);
        if (x == 0) {
            fix = "r/dankmemes";
        } else if (x == 1) {
            fix = "r/me_irl";
        } else if (x == 2) {
            fix = "r/memes";
        }
        fetch(memechan[x] + "?limit=800")
        .then(res => res.json())
        .then(body => {
            const allowed = message.channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
            if (!allowed.length) return message.channel.send('It seems we are out of fresh memes!, Try again later.');
            const randomnumber = Math.floor(Math.random() * allowed.length);
            const embed = new RichEmbed()
                .setColor(0x00A2E8)
                .setTitle(allowed[randomnumber].data.title)
                .setDescription("Posted by: " + allowed[randomnumber].data.author)
                .setImage(allowed[randomnumber].data.url)
                .addField("Other info:", "Up votes: " + allowed[randomnumber].data.ups + " / Comments: " + allowed[randomnumber].data.num_comments)
                .setFooter("Memes provided by " + fix);
            message.channel.send(embed);
        });
    } catch (err) {
        return logger.error(err);
    }
}

async function startFlow(client, channel, args, msg) {
    msg.channel.send("THE MEMEFLOW HAS BEGUN!!!!!!!!!!!!!!!(**Warning! Possible NSFW content**)")
    mannn = setInterval(() => {
        getMeme(client, msg)
        if (rip) {
            msg.channel.send("STOPPPEDDDD!!!!");
            rip = false;
            clearInterval(mannn);
        }
    }, 10000);
}

async function stopFlow(client, channel, args, msg) {
    rip = true;
    msg.channel.send("Memeflow will soon stop....");
}

async function meme(client, channel, args, msg) {
    getMeme(client, msg);
}

exports.runCommand = function runCommand(command, args, channel, client, msg) {
    if (commandsTable.hasOwnProperty(command)) {
        commandsTable[command](client, channel, args, msg);
    }
}

helpInformation = {}; // Help information
helpInformation["help"] = "The help function... for purposes";
helpInformation["ping"] = "Get the discord bot's ping to your server.";
helpInformation["embed"] = "Make discord embeds";
helpInformation["argprint"] = "Prints arguments, mostly for debugging";
helpInformation["mute"] = "Mutes a user(must have roles below the bots)";
helpInformation["welcome-setup"] = "Sets user welcome channel ID";
helpInformation["welcome-message"] = "Sets Welcome Message with $name as name and $count as member count";
helpInformation["welcome-stop"] = "Stops the welcome messages. Turn back on with setup!"
helpInformation["leave-setup"] = "Sets user leave channel ID";
helpInformation["leave-message"] = "Sets leave Message with $name as name and $count as member count";
helpInformation["leave-stop"] = "Stops the leave messages. Turn back on with setup!";
helpInformation["clear"] = "clear a number of messages with this command!";
helpInformation["prof"] = "toggles profanity filter!";
helpInformation["startflow"] = "Starts a flow of memes in a channel!";
helpInformation["stopflow"] = "Stops a flow of memes in a channel!";
helpInformation["fml"] = "Gives a random fml";
helpInformation["meme"] = "one. single. meme.";

commandsTable["mute"] = mute;
commandsTable["embed"] = makeEmbed;
commandsTable["argprint"] = argPrint;
commandsTable["help"] = help;
commandsTable["ping"] = ping;
commandsTable["welcome-setup"] = welcomeSetup;
commandsTable["welcome-message"] = welcomeMessage;
commandsTable["welcome-stop"] = delWelcome;
commandsTable["leave-setup"] = leaveSetup;
commandsTable["leave-message"] = leaveMessage;
commandsTable["leave-stop"] = delLeave;
commandsTable["clear"] = msgdel;
commandsTable["prof"] = prof;
commandsTable["fml"] = fml;
commandsTable["info"] = info;
commandsTable["setupreaction"] = setupreaction;
commandsTable["clearreaction"] = clearReact;
commandsTable["addanoun"] = addAnnounce;
commandsTable["delanoun"] = delAnnounce;
commandsTable["xkcd"] = xkcd;
commandsTable["prechange"] = prechange;
commandsTable["bal"] = bal;
commandsTable["beg"] = addMun;
commandsTable["bet"] = gamble;

commandsTable["startflow"] = startFlow;
commandsTable["stopflow"] = stopFlow;
commandsTable["meme"] = meme;

function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}