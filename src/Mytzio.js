require('dotenv').config();

const { Client, Collection } = require('discord.js');
const logger = require('./utils/logger');
const mongoose = require('./utils/mongoose');

// New Client & Collection of Commands
const client = new Client({ disableEveryone: true });
client.commands = new Collection();

// Event & Command Handlers
require('./handlers/events')(client);
require('./handlers/commands')(client);

// Bot login
client.login(process.env.discordToken).then(() => {
	mongoose.init();
	logger.info(`Bot login as ${client.user.tag}`);
}).catch(e => logger.error(e));

// Bot Ready
client.once('ready', async () => {
	// Generate an Invitation Link
	try {
		const link = await client.generateInvite(['ADMINISTRATOR']);
		logger.info('Invite bot to your server by using link below:');
		logger.info(link);
	}
	catch (e) {
		logger.error(e);
	}
});
