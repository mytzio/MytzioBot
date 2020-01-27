const { queue } = require('../../utils/dispatcher');

module.exports.run = async (client, message) => {
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel!');
	}

	const player = queue[message.guild.id];
	if (!player) return message.channel.send('There is no song that I could stop!');

	const mediaPlayer = await player.stop();
	return message.channel.send(mediaPlayer.msg);
};

module.exports.help = {
	name: 'stop',
	description: 'Stop the playing audio stream',
	aliases: [],
	usage: [],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: [],
};
