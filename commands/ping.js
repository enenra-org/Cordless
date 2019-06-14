/**
 * 
 * @name ping
 */
exports.run = function(client, channel, args, msg) {
    const embed = {
        "color": 15747444,
        "description": "🏓Pong! " + client.ping + " ms🏓"
    };
    channel.send({ embed });
};