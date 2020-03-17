'use strict';

module.exports.run = async (client, member) => {
	const channel = member.guild.channels.cache.find(ch => ch.name === 'logger');

	if (!channel) return;

	channel.send(`${member.user.username} left!`);
};
