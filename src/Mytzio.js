'use strict';

// Required dependencies
require('dotenv').config();

const { Client, Collection } = require('discord.js');
const logger = require('./utils/logger');
const mongoose = require('./utils/mongoose');

// Setup Client
const client = new Client({ disableMentions: 'everyone' });
client.commands = new Collection();
client.log = logger;

// Require Handlers
require('./handlers/events')(client);
require('./handlers/commands')(client);

// Bot login
client.login(process.env.discordToken).then(() => {
	mongoose.init();
	client.log.info(`Bot login as ${client.user.tag}`);
}).catch(e => client.log.error(e));
