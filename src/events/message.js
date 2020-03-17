const { Permissions } = require('discord.js');
const logger = require('../utils/logger');
const Guild = require('../classes/Guild');

module.exports.run = async (client, message) => {
	if (message.author.bot) return;

	const guild = await Guild.getByID(message.guild.id);

	const prefix = guild.prefix;

	if (message.content.startsWith(prefix)) {
		const args = message.content.slice(prefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();
		const command = client.commands.get(commandName) ||
		client.commands.find(cmd => cmd.help.aliases && cmd.help.aliases.includes(commandName));

		// Not a command
		if (!command) return;

		// Required permissions for user
		if (command.config.requiredPermissions && !(message.channel.type === 'dm')) {
			const perms = new Permissions(command.config.requiredPermissions);
			if (!message.member.hasPermission(perms)) {
				return message.channel.send(
					`You don't have enough permissions to run that command!\n
					Permissions \`${perms.toArray()}\` are required.`,
				);
			}
		}

		// Command is only executable on guild channel
		if (command.config.guildOnly && message.channel.type !== 'text') {
			return message.channel.send('I can\'t execute that command inside DMs!');
		}

		// Command need arguments to execute
		if (command.config.args && !args.length) {
			let reply = 'You didn\'t provide any arguments!';

			if (command.help.usage.length) {
				reply += `\nThe proper usage would be: \`${prefix}${command.help.name} ${command.help.usage}\``;
			}

			return message.channel.send(reply);
		}

		// Try to execute the command
		try {
			command.run(client, message, args);
		}
		catch (e) {
			logger.error(e);
			message.channel.send('There was an error trying to execute that command!');
		}

		// Delete command message after 5 seconds
		message.delete({ timeout: 5000 }).catch(() => logger.error('Could not delete command message'));
	}
};
