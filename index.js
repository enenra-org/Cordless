<<<<<<< HEAD
=======
//you can add the discord bot code here!
const discord = require('discord.js');
const token = '***REMOVED***';

const client = new discord.Client();
client.on('ready',() => {
    console.log('Tecton bot on and connected');
    client.channels.find(x => x.name === 'bot-testing').send('Bot Operational');
});
client.login(token);
>>>>>>> 7a9e1c0be37ffc68ba50426fe251081314d05b74
