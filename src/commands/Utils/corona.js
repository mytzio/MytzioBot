const axios = require('axios').default;
const logger = require('../../utils/logger');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message) => {

	const apiURL = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';


	try {
		const response = await axios.get(apiURL);

		const confirmed = response.data.confirmed;
		const deaths = response.data.deaths;
		const recovered = response.data.recovered;

		const lastCases = confirmed.slice(-5);
		let infections = '';
		lastCases.forEach(item => {
			infections += `**${item.healthCareDistrict}** *${item.date.slice(0, 10)} - ${item.date.slice(11, 16)}*\n`;
		});

		const embed = new MessageEmbed()
			.setTitle('Corona in Finland')
			.setDescription('Statistics about COVID-19 in Finland')
			.addField('Confirmed', confirmed.length, true)
			.addField('Deaths', deaths.length, true)
			.addField('Recovered', recovered.length, true)
			.addField('Last 5 Infections', infections)
			.setFooter(`Replying to ${message.author.tag} - Sources: https://github.com/HS-Datadesk/koronavirus-avoindata`);

		message.channel.send(embed);
	}
	catch (e) {
		logger.error(e);
	}
};

module.exports.help = {
	name: 'corona',
	description: 'Statistics about COVID-19 in Finland!',
	aliases: ['c'],
	usage: [],
};

module.exports.config = {
	args: false,
	guildOnly: false,
	requiredPermissions: [],
};
