const Guild = require('../classes/Guild');

module.exports = class MediaPlayer {
	constructor(client, message) {
		this.message = message;
		this.textChannel = message.channel;
		this.voiceChannel = message.member.voice.channel;
		this.connection = null;
		this.currentSong = {};
		this.songs = [];
		this.playing = true;
		this.loop = { one: false, all: false };
	}

	async setVolume(value) {
		if (!value) {
			const guild = await Guild.getByID(this.message.guild.id);
			return { msg: `Current volume is ${guild.mediaPlayer.volume}` };
		}
		else if (isNaN(value)) {
			return { msg: 'Please provide only numbers as an argument' };
		}
		else if (value < 0 || value > 200) {
			return { msg: 'Volume can only be set between 0 and 200' };
		}
		else {
			const guild = await Guild.setVolume(this.message.guild.id, value);
			this.connection.dispatcher.setVolumeLogarithmic(value / 100);
			return { msg: guild.msg };
		}
	}

	loopOne() {
		this.loop.one = !(this.loop.one);
		return { msg: `Current audio track has been ${this.loop.one ? 'added to' : 'removed from'} loop!` };
	}

	loopAll() {
		this.loop.all = !(this.loop.all);
		if (this.loop.one === true || this.loop.all === true) this.loop.one = false;
		return { msg: `Current playlist ${this.loop.all ? 'is now looping!' : 'is no longer looping!'}` };
	}

	pause() {
		this.connection.dispatcher.pause();
		this.playing = false;
		return { msg: 'Media player has been paused!' };
	}

	resume() {
		this.connection.dispatcher.resume();
		this.playing = true;
		return { msg: 'Media player has been resumed!' };
	}

	skip() {
		if (this.loop.all === true) this.songs.push(this.currentSong);
		else if (this.loop.one === true) this.currentSong = {};
		this.connection.dispatcher.end();
		return { msg: 'Media has been skipped!' };
	}

	stop() {
		this.songs = [];
		this.connection.dispatcher.end();
		return { msg: 'Media player stopped!' };
	}
};
