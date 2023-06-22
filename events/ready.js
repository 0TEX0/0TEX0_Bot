const discord = require('discord.js');
const slashs = require('../loaders/slashcommands');
const cfx = require("cfx-api");
const config = require("../config");

module.exports = async client => {
    await slashs(client);

    setInterval(async () => {
        try {
            const server = await cfx.fetchServer(config.cfxCode);
            const activity = `${server.data.clients}/${server.data.sv_maxclients} en ligne`;
            await client.user.setActivity(activity, { type: discord.ActivityType.Watching });
        } catch (error) {
            await client.user.setActivity('Serveur OFFLINE 🔴', { type: discord.ActivityType.Watching });
        }
    }, 60000);

    console.log(`Logged in as ${client.user.tag}! | 0TEX0#8855`);
}