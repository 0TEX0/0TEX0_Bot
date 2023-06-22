const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js')

module.exports = async client => {

    let commands = [];

    client.commands.forEach(command => {

        let slashcommand = new Discord.SlashCommandBuilder()
        .setName(command.name)
        .setDescription(command.description)
        .setDMPermission(command.dm)
        .setDefaultMemberPermissions(command.permission === 'None' ? null : command.permission)

        if(command.options?.length >= 1) {
            for(let i = 0; i < command.options.length; i++) {
                slashcommand[`add${command.options[i].type.slice(0, 1).toUpperCase() + command.options[i].type.slice(1, command.options[i].type.length)}Option`](option => option.setName(command.options[i].name).setDescription(command.options[i].description).setRequired(command.options[i].required));
            };
        };

        commands.push(slashcommand);
    });
    
    const rest = new REST({version: '10'}).setToken(client.token);

    await rest.put(Routes.applicationCommands(client.user.id), {body: commands});
    console.log("SlashCommands OK!");
};