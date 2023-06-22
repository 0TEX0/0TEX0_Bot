const fs = require('fs');

module.exports = async client => {

    fs.readdirSync('./commands').filter(f => f.endsWith('.js')).forEach(async file => {

        let command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
        console.log(`Command ${file}\x1b[32m loaded!\x1b[0m`);
    });
};