const { play } = require('../../utils/dispatcher');

module.exports.run = (client, message, args) => {
	if (!message.member.voice.channel) {return message.channel.send('You have to be in a voice channel!');}

	// Check required permissions before trying to connect
	const permissions = message.member.voice.channel.permissionsFor(
		message.client.user,
	);
	if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
		return message.channel.send(
			'I don\'t have required permissions.\nMake sure I have the `CONNECT` and `SPEAK` permissions assigned!',
		);
	}

	play(client, message, args);
};

module.exports.help = {
	name: 'play',
	description: 'Play an audio stream',
	aliases: ['sr'],
	usage: ['[URL | video ID | search parameters]'],
};

module.exports.config = {
	args: true,
	guildOnly: true,
	requiredPermissions: 0,
};
