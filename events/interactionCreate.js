const Discord = require('discord.js');

module.exports = async (client, interaction) => {

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
        let command = client.commands.get(interaction.commandName);
        command.run(client, interaction, interaction.options);
    }
};