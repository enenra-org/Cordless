const discord = require('discord.js');
const privateConfig = require("./private_data/config.json");
const commands = require("./commands");
const SDM = require('./server-data-manager');
const testChannel = "575022379756027904";
const client = new discord.Client();

client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.channels.get(testChannel).send('Bot Operational');
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
    data = SMD.readServerData()
    member.guild.channels.get(testChannel).send("Welcome, " + member.nickname);
});

client.login(privateConfig.token);