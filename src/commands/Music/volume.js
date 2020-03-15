const { queue } = require('../../utils/dispatcher');

module.exports.run = async (client, message, args) => {
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel!');
	}

	const player = queue[message.guild.id];
	if (!player) return message.channel.send('This command can only be executed when audio stream is playing!');

	const mediaPlayer = await player.setVolume(args[0]);
	return message.channel.send(mediaPlayer.msg);
};

module.exports.help = {
	name: 'volume',
	description: 'Set volume for audio stream',
	aliases: [],
	usage: ['[0-200]'],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: 0,
};
