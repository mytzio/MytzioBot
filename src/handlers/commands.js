const { existsSync, readdirSync } = require('fs');
const path = require('path');

module.exports = client => {
	// Check commands folder existence
	if (!existsSync('./src/commands')) {
		throw new Error('Could not find commands directory.');
	}

	const categories = readdirSync('./src/commands/');

	// Check thru each category
	for (const category of categories) {
		const commandFiles = readdirSync(path.resolve(`./src/commands/${category}`)).filter(file => file.endsWith('.js'));

		// Check thru each command file
		for (const file of commandFiles) {
			const command = require(`../commands/${category}/${file}`);

			// Add command to new collection
			// Then add its category to where the command is placed
			client.commands.set(command.help.name, command);
			command.config.category = category;
		}
	}
};
