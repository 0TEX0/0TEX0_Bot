const Discord = require('discord.js');
const cfx = require('cfx-api');
const config = require('../config');

module.exports = {
    name: 'players',
    description: `Affiche le nombre de joueurs connecté`,
    permission: "None",
    dm: false,

    async run(client, message ,args) {
        if(!message.member.roles.cache.some(role => config.permissions.players.includes(role.id))) return message.reply({content:"Vous n'avez pas les permissions nécessaires", ephemeral: true});
        let server;
        try {
            server = await cfx.fetchServer(config.cfxCode);
        } catch (error) {
            if (error.response && error.response.status === 404) {
               return message.reply({content: "Le serveur est actuellement OFFLINE.", ephemeral: true});
            }
        }

        const replyMessage = await message.reply("Veuillez patienter...")
        const playerCount = server.data.players.length;
        const playerList = server.data.players.map((player) => {
            let discordID = 'N/A';
            for (let i = 0; i < player.identifiers.length; i++) {
                if (player.identifiers[i].startsWith('discord:')) {
                    discordID = player.identifiers[i].replace('discord:', '');
                    break;
                }
            }
            return {
                name: `**${player.name}**`,
                value: `**Discord:** <@${discordID}> | **Ping:** \`${player.ping}\``,
                inline: true
            };
        });

        const maxFieldsPerEmbed = 25;
        const totalEmbeds = Math.ceil(playerList.length / maxFieldsPerEmbed);
        if (playerList.length > 0) {
            let embedsToSend = [];

            for (let i = 0; i < totalEmbeds; i++) {
                const startIndex = i * maxFieldsPerEmbed;
                const endIndex = startIndex + maxFieldsPerEmbed;
                const fieldsToAdd = playerList.slice(startIndex, endIndex);
                const embedPlayers = new Discord.EmbedBuilder()
                    .setColor('#00faf2')
                    .setTitle(`${playerCount} joueurs connectés au total`)
                    .setDescription(`Embed à **${fieldsToAdd.length}** joueurs`)
                    .addFields(fieldsToAdd);

                embedsToSend.push(embedPlayers);
            }

            for (const embed of embedsToSend) {
                await message.channel.send({ embeds: [embed] });
                replyMessage.delete().catch(console.error)
            }
        } else {
            const embedPlayers = new Discord.EmbedBuilder()
                .setColor('#ee00ff')
                .setTitle(`${playerCount} joueurs connectés`)
                .setDescription('Aucun joueur connecté !');
            message.channel.send({ embeds: [embedPlayers] });
            replyMessage.delete().catch(console.error)
        }
    },

};
