const axios = require('axios').default;
const logger = require('../../utils/logger');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (client, message) => {

	const apiURL = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';


	try {
		const response = await axios.get(apiURL);

		const latestCase = response.data.confirmed[response.data.confirmed.length - 1];

		const embed = new MessageEmbed()
			.setTitle('Corona in Finland')
			.setDescription('Statistics about COVID-19 in Finland')
			.addField('Confirmed', response.data.confirmed.length, true)
			.addField('Deaths', response.data.deaths.length, true)
			.addField('Latest Infection', `${latestCase.date.slice(0, 10)} ${latestCase.date.slice(11, 16)}\n${latestCase.healthCareDistrict}`);

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
