const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = {
	init: () => {
	// Set options
		const DatabaseOptions = {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		};

		// Connect
		mongoose.connect(process.env.database, DatabaseOptions);
		mongoose.set('useFindAndModify', false);
		mongoose.Promise = global.Promise;

		// Events
		mongoose.connection.on('connected', () => {
			logger.db('Database connected!');
		});

		mongoose.connection.on('err', err => {
			logger.db(`Database error:\n${err.stack}`);
		});

		mongoose.connection.on('disconnected', () => {
			logger.db('Database disconnected!');
		});
	},
};
