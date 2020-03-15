module.exports.run = (client, message) => {
	message.channel.send(`My ping is ${client.ws.ping}ms!`);
};

module.exports.help = {
	name: 'ping',
	description: 'Show latency of the bot',
	aliases: ['latency'],
	usage: [],
};

module.exports.config = {
	args: false,
	guildOnly: false,
	requiredPermissions: 0,
};
