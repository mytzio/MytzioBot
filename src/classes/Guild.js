const database = require('../utils/database');

module.exports = class Guild {
	static getByID(id) {
		return new Promise((resolve, reject) => {
			database.guilds.findById(id, async (err, res) => {
				if (err) return reject(err);
				if (!res) {
					res = new database.guilds({ _id: id });
					await res.save();
				}
				resolve(res);
			});
		});
	}

	// Set media player volume
	static async setVolume(id, value) {
		const guild = await Guild.getByID(id);

		guild.mediaPlayer.volume = value;
		await guild.save();
		return { msg: `Volume has set to ${value}%` };
	}
};
