const Discord = require('discord.js');
const cfx = require('cfx-api');
const config = require('../config');
const embedIntervals = new Map();

const getServerStatus = async () => {
    let serverStatus = "🔴 OFFLINE";
    let server;
    try {
        server = await cfx.fetchServer(config.cfxCode);
        serverStatus = "🟢 ONLINE";
    } catch (error) {
        if (error.response && error.response.status === 404) {
            server = null;
            serverStatus = "🔴 OFFLINE";
        }
    }
    return { server, serverStatus };
};

module.exports = {
    name: 'connect',
    description: "Affiche le status du serveur",
    permission: "None",
    dm: false,
    async run(client, message) {
        if (!config.cfxCode) return console.log("Veuillez insérer un code FiveM dans le fichier config.js");
        if(!message.member.roles.cache.some(role => config.permissions.connect.includes(role.id))) return message.reply({content:"Vous n'avez pas les permissions nécessaires", ephemeral: true});

        message.reply({content: "Veuillez patienter...", ephemeral: true});

        const { server, serverStatus } = await getServerStatus();
        const maxClients = server ? server.data.sv_maxclients : 64;
        const playersCount = server ? server.data.players.length : 0;

        let waitingMessage = new Discord.EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle('AlphaLife')
            .setURL(`https://cfx.re/join/${config.cfxCode}`)
            .setDescription("Status du serveur")
            .addFields({
                name: 'SERVEUR STATUS',
                value: `\`${serverStatus}\``,
                inline: true
            }, {
                inline: true,
                name: 'JOUEURS',
                value: `\`${playersCount} / ${maxClients}\``
            }, {
                name: 'F8 CONNECT',
                value: `\`> connect ${config.cfxCode}\``
            })
            .setTimestamp()
            .setFooter({text: config.botName, iconURL: config.botAvatar});
        const waitingButton = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
            .setLabel("Connect")
            .setEmoji("<:fivem:1117887393379401969>")
            .setURL(`https://cfx.re/join/${config.cfxCode}`)
            .setStyle(Discord.ButtonStyle.Link));
        const replyMessage = await message.channel.send({ embeds: [waitingMessage], components: [waitingButton] });

        const updateEmbed = async () => {
            const { server, serverStatus } = await getServerStatus();
            const maxClients = server ? server.data.sv_maxclients : 64;
            const playersCount = server ? server.data.players.length : 0;

            let embedStatus = new Discord.EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('AlphaLife')
                .setURL(`https://cfx.re/join/${config.cfxCode}`)
                .setDescription("Status du serveur")
                .addFields({
                    name: 'SERVEUR STATUS',
                    value: `\`${serverStatus}\``,
                    inline: true
                }, {
                    inline: true,
                    name: 'JOUEURS',
                    value: `\`${playersCount} / ${maxClients}\``
                }, {
                    name: 'F8 CONNECT',
                    value: `\`> connect ${config.cfxCode}\``
                })
                .setTimestamp()
                .setFooter({text: config.botName, iconURL: config.botAvatar});
            const button = new Discord.ActionRowBuilder().addComponents(new Discord.ButtonBuilder()
                .setLabel("Connect")
                .setEmoji("<:fivem:1117887393379401969>")
                .setURL(`https://cfx.re/join/${config.cfxCode}`)
                .setStyle(Discord.ButtonStyle.Link));

            try {
                const fetchedMessage = await replyMessage.fetch();
                if (!fetchedMessage) {
                    embedIntervals.delete(message.channel.id);
                    clearInterval(interval);
                    return;
                }
                replyMessage.edit({embeds: [embedStatus], components: [button]});
            } catch (error) {
                if (error.code === 10008) {
                    embedIntervals.delete(message.channel.id);
                    clearInterval(interval);
                    return;
                }
            }
        };
        const interval = setInterval(updateEmbed, 60000)
        embedIntervals.set(message.channel.id, interval);
    },
};
