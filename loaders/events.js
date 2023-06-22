const fs = require('fs');

module.exports = async client => {

    fs.readdirSync('./events').filter(f => f.endsWith('.js')).forEach(async file => {

        let event = require(`../events/${file}`);
        client.on(file.split('.js').join(''), event.bind(null, client));
        console.log(`Event ${file}\x1b[32m loaded!\x1b[0m`);
    });
};