const mongoose = require('mongoose');

const Guild = new mongoose.Schema({
	_id: String,
	prefix: { type: String, default: '!' },
	activityRoles: [{
		name: String,
		type: String,
	}],
	reactionRoles: [{
		channel: String,
		message: String,
		reaction: String,
		role: String,
	}],
	mediaPlayer: {
		volume: { type: Number, default: 100 },
	},
	autoRoles: [ String ],
});

module.exports = {
	guilds: mongoose.model('Guilds', Guild),
};
