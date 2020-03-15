module.exports.run = async (client, message, args) => {
	if (!message.guild.available) return;

	if (args.length <= 0) {
		return message.channel.send(`Current guild region is ${message.guild.region}`);
	}
	else {
		try {
			const updated = await message.guild.setRegion(args[0]);
			return message.channel.send(`Updated guild region to ${updated.region}`);
		}
		catch (e) {
			return message.channel.send(`${args[0]} is not valid region`);
		}
	}
};

module.exports.help = {
	name: 'region',
	description: 'Changes server region',
	aliases: ['reg'],
	usage: ['regionName'],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: 4, // Default 32
};
