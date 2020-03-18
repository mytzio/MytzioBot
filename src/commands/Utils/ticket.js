const queue = [];

module.exports.run = async (client, message, args) => {
	if (args[0] === 'next') {
		if (queue.length < 1) {
			return message.channel.send('There are no people in queue!');
		}
		else {
			message.channel.send(`${message.author} is having fun with ${queue[0]} next!`);
			queue.shift();
			return;
		}
	}
	else if (queue.find(person => person === message.author)) {
		const user = queue.find(person => person === message.author);
		const userPosition = queue.indexOf(user) + 1;
		return message.channel.send(`You are already in queue in position #${userPosition}`);
	}
	else {
		queue.push(message.author);
		return message.channel.send(`${message.author} is in queue in position #${queue.length}`);
	}
};

module.exports.help = {
	name: 'ticket',
	description: 'Take a queueing number',
	aliases: ['qn'],
	usage: [],
};

module.exports.config = {
	args: false,
	guildOnly: true,
	requiredPermissions: 0,
};
