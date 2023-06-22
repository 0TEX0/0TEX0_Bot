const Discord = require('discord.js');
const config = require('../config');

module.exports = {
    name: 'ping',
    description: 'Command ping',
    permission: "None",
    dm: true,
    async run(client, message) {
        let msg = await message.reply({content: "Pinging..."});
        const ping = msg.createdTimestamp - message.createdTimestamp;

        let embedPing = new Discord.EmbedBuilder()
            .setColor('#ff0000')
            .setTitle('Pong!')
            .setFields({
                    name: "Bot",
                    value: `\`${ping}ms\``,
                    inline: true
                }, {
                    name: "API",
                    value: `\`${Math.round(client.ws.ping)}ms\``,
                    inline: true
                })
            .setFooter({text: config.botName, iconURL: config.botAvatar});
        msg.edit({embeds: [embedPing]});
    },
};