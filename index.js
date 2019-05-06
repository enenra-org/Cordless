//you can add the discord bot code here!
const discord = require('discord.js');
const config = require("./private_data/config.json");

const client = new discord.Client();
client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.channels.find(x => x.name === 'bot-testing').send('Bot Operational');
});
client.on('message', msg => {
    if (msg.content === '&ping') {
        msg.channel.send('pong');
    }
});
client.login(config.token);
