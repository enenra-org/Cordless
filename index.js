const discord = require('discord.js');
const privateConfig = require("./private_data/config.json");

const client = new discord.Client();
client.on('ready', () => {
    console.log('Tecton bot on and connected');
    client.channels.get('575022379756027904').send('Bot Operational');
});
client.login(privateConfig.token);
