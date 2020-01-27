const { MessageEmbed } = require('discord.js');

module.exports = class Song {
	constructor(message, song, priority) {
		this.title = song.title;
		this.url = song.video_url;
		this.length = song.duration;
		this.requester = message.author;
		this.priority = priority;
	}

	songAdded(message) {
		const embed = new MessageEmbed()
			.setColor('GREEN')
			.setAuthor('Song has been added to the queue!')
			.setTitle(this.title)
			.setURL(this.url)
			.setFooter(this.requester.tag, this.requester.avatarURL())
			.setTimestamp();

		return message.channel.send(embed);
	}
};
