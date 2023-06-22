const Discord = require('discord.js');
const intents = new Discord.IntentsBitField(3276799)
const client = new Discord.Client({intents});
const config = require('./config');
client.commands = new Discord.Collection();

client.login(config.token);

['commands', 'events'].forEach(loader => {
    require(`./loaders/${loader}`)(client);
});