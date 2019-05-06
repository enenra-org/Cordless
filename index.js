//you can add the discord bot code here!
const discord = require('discord.js');
const token = '***REMOVED***';

const client = new discord.Client();
client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.channels.find(x => x.name === 'bot-testing').send('Bot Operational');
});
client.login(token);
