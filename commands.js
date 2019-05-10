/* 
    To add a command please copy the function template below titling it by the name of the function and then add the line:
    commandsTable["commandname"] = functionName;
    
    to the bottom of this file. The command name must be ALL lowercase and must not contain spaces.
    Command function template:
    function help(client, channel, args) {
        
    }
*/
let Parser = require('rss-parser');
let parser = new Parser();
const Discord = require('discord.js');
const SDM = require('./server-data-manager');
commandsTable = {}; // Commands hash table

// Color of discord bot
function help(client, channel, args) {
    const embed = new Discord.RichEmbed();
    embed.setColor(2012);
    embed.setTitle("Cordless Bot");
    for (var info in helpInformation) {
        embed.addField(info, helpInformation[info]);
    }
    channel.send({ embed });
}

function argPrint(client, channel, args) {
    channel.send(args[0]);
}

function setupWelcome(client, channel, args) {

}
//Basic ping pong command.  Returns user's ping
function ping(client, channel, args) {
    const embed = {
        "color": 15747444,
        "description": "🏓Pong! " + client.ping + " ms🏓"
    };
    channel.send({ embed });
}
function fml(client,channel,args) {
    //Making SFW
    /*(async () => {
        array = []
        let feed = await parser.parseURL('https://www.fmylife.com/rss');
        feed.items.forEach(item => {
            array.push(item.content);
          });
        channel.send(array[rand(0,array.length)]);
      })();*/
    channel.send("This command is under development!!!");
}
function makeEmbed(client, channel, args) {
    if (isNaN(args[0])) {
        channel.send("Please input a number for the color.");
        return;
    } else if (args.length < 3) {

    }
    const embed = new Discord.RichEmbed();
    embed.setColor(args[0]);
    args.shift();
    temp = args.join(" ");
    args = temp.split("|");
    if (args.length != 2) {
        channel.send("Please use a `|` to separate your field title from your field value.");
    }
    embed.addField(args[0], args[1]);
    channel.send({ embed });
}
//creates mute role
function mute(client, channel, args, msg) {
    data = SDM.readServerData(channel.guild.id);
    if (channel.guild.roles.find(val => val.name === "mute") != null) {
        console.log("role exists");
        msg.mentions.members.first().removeRoles(msg.mentions.members.first().roles).then(console.log).catch(console.error)
        msg.mentions.members.first().addRole(channel.guild.roles.find(val => val.name === "mute"));
    } else {
        console.log("role doesn't exist");
        channel.guild.createRole({
            name: "mute",
            color: "375575883097833483",
            hoist: false,
            mentionable: false,
            position: 30,
            permissions: ["READ_MESSAGE_HISTORY", "CONNECT"]
        });
        msg.mentions.members.first().addRole(channel.guild.roles.find(val => val.name === "mute"));
        SDM.saveServerData(channel.guild.id, data);
    }

    if (data.mute.roleID = "") {
        data.mute.roleID = channel.guild.roles.find(val => val.name === "mute").id;
        SDM.saveServerData(channel.guild.id, data);
    }
    if (msg.mentions.users.first() != null) {
        user = msg.mentions.users.first();
        console.log(user.id);
    }

}
//add welcome channel
function welcomeSetup(client, channel, args) {
    if (isNaN(args[0])) {
        channel.send("Please input a channel ID for the welcome.");
        return;
    }

    data = SDM.readServerData(channel.guild.id);
    data.welcomeMessages.welcomeMessageEnabled = true;
    data.welcomeMessages.welcomeChannelID = args[0];
    SDM.saveServerData(channel.guild.id, data);
    channel.send("Channel ID Set for welcome message");
};
function prof (client, channel, args) {
    data = SDM.readServerData(channel.guild.id);
    data.profanity = !data.profanity;
    if (data.profanity == true) {
        channel.send("Profanity filter on! :thumbsup: ");
    } else {
        channel.send("Profanity filter off?!?!?! :rage:")
    }
    SDM.saveServerData(channel.guild.id, data);
}
function welcomeMessage(client, channel, args) {
    data = SDM.readServerData(channel.guild.id);
    if (data.welcomeMessages.welcomeMessageEnabled = false) {
        channel.send("You need to enter &welcome-setup first!!!");
    }
    message =  "";
    x=0;
    while (x < args.length) {
        message += args[x]+" ";
        x++;
    }
    data.welcomeMessages.mess = message;
    SDM.saveServerData(channel.guild.id, data);
    console.log(message);
    channel.send("Channel thingy Set for welcome message");
};
function delWelcome(client,channel,args) {
    data = SDM.readServerData(channel.guild.id);
    data.welcomeMessages.welcomeMessageEnabled = false;
    SDM.saveServerData(channel.guild.id, data);
    channel.send("Stopped welcomes!")
}
function leaveSetup(client, channel, args) {
    if (isNaN(args[0])) {
        channel.send("Please input a channel ID for the leave");
        return;
    }

    data = SDM.readServerData(channel.guild.id);
    data.leaveMessages.leaveMessageEnabled = true;
    data.leaveMessages.leaveChannelID = args[0];
    SDM.saveServerData(channel.guild.id, data);
    channel.send("Channel ID Set for leave message");
};
function leaveMessage(client, channel, args,msg) {
    data = SDM.readServerData(channel.guild.id);
    if (data.leaveMessages.leaveMessageEnabled = false) {
        channel.send("You need to enter &leave-setup first!!!");
    }
    message =  "";
    x=0;
    while (x < args.length) {
        message += args[x]+" ";
        x++;
    }
    data.leaveMessages.mess = message;
    SDM.saveServerData(channel.guild.id, data);
    console.log(message);
    channel.send("Channel thingy Set for leave message");
};
function msgdel(client,channel,args,message) {
    if (isNaN(args[0])) {
        channel.send("Please enter a number of messages to delete!");
        return;
    }
    number = Number(args[0])+1;
    console.log(number);
    message.channel.bulkDelete(number).then(() => {
        message.channel.send("**Deleted "+args[0]+" messages.**").then(msg => msg.delete(3000));
    }).catch(() => {
        channel.send("Max of 99 messages allowed!!!");
    });
}
function delLeave(client,channel,args) {
    data = SDM.readServerData(channel.guild.id);
    data.leaveMessages.leaveMessageEnabled = false;
    SDM.saveServerData(channel.guild.id, data);
    channel.send("Stopped leaves!")
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
helpInformation["startflow"] = "Starts a flow of memes in a channel!"
helpInformation["stopflow"] = "Stops a flow of memes in a channel!"
helpInformation["fml"] = "Gives a random fml"
helpInformation["meme"] = "one. single. meme."

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
function rand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}