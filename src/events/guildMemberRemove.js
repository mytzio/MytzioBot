module.exports.run = async (member) => {
	const logChannel = member.guild.channels.cache.find(ch => ch.name === 'logger');

	if (!logChannel) return;

	logChannel.send(`${member.user.username} left`);
};
