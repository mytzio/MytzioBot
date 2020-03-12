const MediaPlayer = require('../classes/MediaPlayer');
const Song = require('../classes/Song');
const YTDL = require('ytdl-core');
const YTPL = require('ytpl');
const axios = require('axios').default;
const Guild = require('../classes/Guild');
const logger = require('./logger');

// new Queue
const queue = [];

// Get and validate video or playlist ID by given URL or search parameters
async function getID(query) {
	if (YTDL.validateURL(query) || YTDL.validateID(query)) {
		try {
			const id = await YTDL.getVideoID(query);
			return id;
		}
		catch (e) {
			logger.error(e);
		}
	}
	// @ts-ignore
	else if (YTPL.validateURL(query)) {
		try {
			// @ts-ignore
			const id = await YTPL.getPlaylistID(query);
			return id;
		}
		catch (e) {
			logger.error(e);
		}
	}
	else {
		try {
			const response = await axios({
				baseURL: 'https://www.googleapis.com/youtube/v3/search',
				method: 'get',
				params: {
					key: process.env.ytApiKey,
					maxResults: 5,
					order: 'relevance',
					part: 'snippet',
					q: query,
					type: 'video',
					videoCategoryId: 10,
				},
				headers: {
					Accept: 'application/json',
				},
			});

			const id = response.data.items[0].id.videoId;
			return id;
		}
		catch (e) {
			logger.error(e);
		}
	}
}

// Construct a new queue for the guild
async function queueConstruct(client, message, song) {
	const player = new MediaPlayer(client, message);

	queue[message.guild.id] = player;
	player.songs.push(song);

	try {
		const connection = await message.member.voice.channel.join();
		player.connection = connection;
		executeStream(client, message, player.songs[0]);
	}
	catch (e) {
		logger.error(e);
		delete queue[message.guild.id];
		return message.channel.send('I could not join the voice channel');
	}
}

// The main function to get started
async function play(client, message, args) {
	const query = args.join(' ');
	const id = await getID(query);
	const isSong = YTDL.validateID(id);

	if (isSong) {
		try {
			// Fetch song info
			const songInfo = await YTDL.getInfo(id);

			// Create new Song
			const song = new Song(message, songInfo, true);

			const guild = queue[message.guild.id];

			// Create a new queue if needed
			if (!guild) {
				queueConstruct(client, message, song);
			}
			else {
				// Push before not prioritized song if exist
				const notPrioritized = guild.songs.findIndex(
					(i) => i.priority === false,
				);
				notPrioritized >= 0
					? guild.songs.splice(notPrioritized, 0, song)
					: guild.songs.push(song);
			}

			song.songAdded(message);
		}
		catch (e) {
			return message.channel.send(
				`> Something went wrong while fetching data from <https://www.youtube.com/watch?v=${id}> via YTDL\n> ${e}`,
			);
		}
	}
	else {
		try {
			const playlist = await YTPL(id, { limit: 0 });

			playlist.items.forEach(async (item) => {
				try {
					// Fetch song info
					const songInfo = await YTDL.getInfo(item.id);

					// Create new Song
					const song = new Song(message, songInfo, false);

					const guild = queue[message.guild.id];

					if (!guild) {
						queueConstruct(client, message, song);
					}
					else {
						guild.songs.push(song);
					}
				}
				catch (e) {
					return message.channel.send(
						`> Something went wrong while fetching data from <${item.url_simple}> via YTDL\n> ${e}`,
					);
				}
			});

			message.channel.send(`Added ${playlist.items.length} songs to queue!`);
		}
		catch (e) {
			message.channel.send(
				`> Something went wrong while fetching playlist data via YTPL\n> ${e}`,
			);
		}
	}
}

// Start audio stream
async function executeStream(client, message, song) {
	const guild = queue[message.guild.id];
	guild.currentSong = song;
	guild.songs.shift();

	if (!song) {
		guild.voiceChannel.leave();
		delete queue[message.guild.id];
		return;
	}

	const stream = YTDL(song.url, {
		filter: 'audioonly',
		quality: 'highestaudio',
		highWaterMark: 1 << 25,
	});

	const dispatcher = await guild.connection.play(stream, {
		bitrate: 'auto',
		highWaterMark: 1,
	});

	dispatcher.on('error', (e) => {
		logger.error(e);
	});

	dispatcher.on('finish', () => {
		if (guild.loop !== true) guild.currentSong = {};
		executeStream(client, message, guild.songs[0]);
	});

	const guildSettings = await Guild.getByID(message.guild.id);
	const volume = guildSettings.mediaPlayer.volume;

	dispatcher.setVolumeLogarithmic(volume / 100);
}

module.exports = {
	queue, play,
};
