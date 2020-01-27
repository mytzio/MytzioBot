const { queue } = require('../../utils/dispatcher');

module.exports.run = async (client, message, args) => {
	if (!message.member.voice.channel) {
		return message.channel.send('You have to be in a voice channel!');
	}

	const player = queue[message.guild.id];

	if (!player) {
		return message.channel.send('Audio stream is not currently playing any audio!');
	}

	if (args[0] === 'one') {
		const mediaPlayer = await player.loopOne();
		return message.channel.send(mediaPlayer.msg);
	}
	else if (args[0] === 'all') {
		const mediaPlayer = await player.loopAll();
		return message.channel.send(mediaPlayer.msg);
	}
	else if (args[0] === 'reset') {
		if (player.loop.one) player.loopOne();
		if (player.loop.all) player.loopAll();
		return message.channel.send('Tracks no longer looping!');
	}
	else {
		if (player.loop.one) {
			return message.channel.send('Current track is looping!');
		}
		else if (player.loop.all) {
			return message.channel.send('Playlist is currently looping!');
		}
		return message.channel.send('Nothing looping at this time');
	}
};

module.exports.help = {
	name: 'loop',
	description: 'Loop playlist or one track',
	aliases: [],
	usage: ['[one | all | reset]'],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: [],
};
