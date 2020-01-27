const { queue } = require('../../utils/dispatcher');

module.exports.run = async (client, message) => {
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel!');
	}

	const player = queue[message.guild.id];
	if (!player) return message.channel.send('There is no song that I could skip!');

	const mediaPlayer = await player.skip();
	return message.channel.send(mediaPlayer.msg);
};

module.exports.help = {
	name: 'skip',
	description: 'Skip track on audio stream',
	aliases: [],
	usage: [],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: [],
};
