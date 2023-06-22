const Discord = require('discord.js');
const config = require('../config');
const cfx = require('cfx-api');

function formatStatus(status) {
    switch (status) {
        case 'operational':
            return 'Opérationnel ✅';
        case 'partial_outage':
            return 'Panne partielle ⚠️';
        case 'major_outage':
            return 'Panne majeure ❌';
        default:
            return 'Statut inconnu ❓';
    }
}

module.exports = {
    name: 'status',
    description: 'Affiche le status de Cfx.re',
    permission: "None",
    dm: false,
    async run(client, message) {
        if(!message.member.roles.cache.some(role => config.permissions.status.includes(role.id))) return message.reply({content:"Vous n'avez pas les permissions nécessaires", ephemeral: true});
        const status = await cfx.fetchStatus()
        const components = await status.fetchComponents()

        const embedStatus = new Discord.EmbedBuilder()
            .setColor(status.everythingOk ? '#00ff00' : '#ff0000')
            .setTitle('Status de Cfx.re')
            .setURL('https://status.cfx.re/')
            .setDescription(status.everythingOk ? "Tous les systèmes de Cfx.re sont opérationnels" : "Cfx.re rencontre des problèmes")
            .addFields(components.map(component => ({
                name: component.name,
                value: formatStatus(component.status),
                inline: true
            })))
            .setTimestamp()
            .setFooter({text: config.botName, iconURL: config.botAvatar });

        message.reply({embeds: [embedStatus]});
    },
};
