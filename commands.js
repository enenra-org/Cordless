/* 
    To add a command please copy the function template below titling it by the name of the function and then add the line:
    commandsTable["commandname"] = functionName;
    
    to the bottom of this file. The command name must be ALL lowercase and must not contain spaces.
    Command function template:
    function help(client, channel, args) {
        
    }
*/
const Discord = require('discord.js');
const SDM = require('./server-data-manager');
commandsTable = {}; // Commands hash table

// Color of discord bot
function help(client, channel, args) {
    const embed = new Discord.RichEmbed();
    embed.setColor(2012);
    embed.setTitle("Discord Bot");
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
    } else {
        console.log("role doesn't exist");
        channel.guild.createRole({
            name: "mute",
            color: "BLACK",
            hoist: false,
            mentionable: false,
            position: 30,
            permissions: ["READ_MESSAGE_HISTORY", "CONNECT"]
        });
        data.mute.roleID = channel.guild.roles.find(val => val.name === "mute");
        console.log("created mute role");
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
    if (channel.guild.channels.get(args[0]) = null) {
        channel.send("Please put in a valid channel ID");
        return;
    }
    data = SDM.readServerData(channel.guild.id);
    data.welcomeMessages.welcomeMessageEnabled = true;
    data.welcomeMessages.welcomeChannelID = args[0];
    SDM.saveServerData(channel.guild.id, data);
    channel.send("Channel ID Set for welcome message");
};
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
helpInformation["welcome-setup"] = "Welcomes user";

commandsTable["mute"] = mute;
commandsTable["embed"] = makeEmbed;
commandsTable["argprint"] = argPrint;
commandsTable["help"] = help;
commandsTable["ping"] = ping;
commandsTable["welcome-setup"] = welcomeSetup;