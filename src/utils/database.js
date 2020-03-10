const mongoose = require('mongoose');

const Guild = new mongoose.Schema({
	_id: String,
	prefix: { type: String, default: '!' },
	mediaPlayer: {
		volume: { type: Number, default: 100 },
	},
});

module.exports = {
	guilds: mongoose.model('Guilds', Guild),
};
