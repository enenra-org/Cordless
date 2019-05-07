const discord = require('discord.js');
const privateConfig = require("./private_data/config.json");
const commands = require("./commands");
const SDM = require('./server-data-manager');
const testChannel = "575022379756027904";
const client = new discord.Client();

client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.user.setActivity('&help cordless.tecton.tech', { type: 'PLAYING' })
    try {
        client.channels.get(testChannel).send('Bot Operational');
    } catch {
        console.log("This is not debug mode..... yeet");
    }
});

client.on('message', (msg) => {
    if (msg.author.bot) return;
    if (!msg.content.startsWith("&")) return;
    messy = msg.content.slice(1);
    args = messy.split(" ");
    command = args.shift();
    command = command.toLowerCase();
    commands.runCommand(command, args, msg.channel, client, msg);
});
client.on('guildMemberAdd', member => {
    data = SDM.readServerData(member.guild.id);
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
        message = message.replace("$name",member.displayName);
        message = message.replace("$count",member.guild.memberCount + pref);
            member.guild.channels.get(data.welcomeMessages.welcomeChannelID).send(message);
    }else {
        return;
    }
});
client.on('guildMemberRemove', member => {
    data = SDM.readServerData(member.guild.id);
    if (data.leaveMessages.leaveMessageEnabled ===true) {
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
        message = message.replace("$name",member.displayName);
        message = message.replace("$count",member.guild.memberCount + pref);
            member.guild.channels.get(data.leaveMessages.leaveChannelID).send(message);
    }else {
        return;
    }
});

client.login(privateConfig.token);