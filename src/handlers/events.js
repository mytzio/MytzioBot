const { existsSync, readdirSync } = require('fs');

module.exports = client => {
	// Check events folder existence
	if (!existsSync('src/events')) {
		throw new Error('Could not find events directory.');
	}

	const eventFiles = readdirSync('src/events/').filter(file => file.endsWith('.js'));

	// Check thru each event file
	for (const file of eventFiles) {
		const event = require(`../events/${file}`);
		const eventName = file.split('.')[0];

		// Make new event listener out of the file in events folder
		client.on(eventName, (...args) => event.run(client, ...args));
	}
};
