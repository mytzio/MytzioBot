const axios = require('axios').default;
const logger = require('../../utils/logger');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');

module.exports.run = async (client, message, args) => {

	const apiURL = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';


	try {
		const response = await axios.get(apiURL);

		const confirmed = response.data.confirmed;
		const deaths = response.data.deaths;
		const recovered = response.data.recovered;

		if (args[0] <= 0) args[0] = 1;
		else if (args[0] > 10) args[0] = 10;
		else if (isNaN(args[0])) args[0] = undefined;

		const lastCount = args[0] || 3;

		// Repeating but working lol
		const lastConfirmedCases = confirmed.slice(-lastCount);
		let lastConfirmed = '';
		lastConfirmedCases.forEach(item => {
			const time = moment(item.date, moment.ISO_8601).utcOffset('+0000').format('DD.MM.YYYY HH:mm');
			lastConfirmed += `**${item.healthCareDistrict}**\n*${time}*\n\n`;
		});
		if (lastConfirmed.length <= 0) lastConfirmed = '-';

		const lastDeathCases = deaths.slice(-lastCount);
		let lastDeath = '';
		lastDeathCases.forEach(item => {
			const time = moment(item.date, moment.ISO_8601).utcOffset('+0000').format('DD.MM.YYYY HH:mm');
			lastDeath += `**${item.healthCareDistrict}**\n*${time}*\n\n`;
		});
		if (lastDeath.length <= 0) lastDeath = '-';

		const lastRecoveredCases = recovered.slice(-lastCount);
		let lastRecovered = '';
		lastRecoveredCases.forEach(item => {
			const time = moment(item.date, moment.ISO_8601).utcOffset('+0000').format('DD.MM.YYYY HH:mm');
			lastRecovered += `**${item.healthCareDistrict}**\n*${time}*\n\n`;
		});
		if (lastRecovered.length <= 0) lastRecovered = '-';

		const embed = new MessageEmbed()
			.setTitle('Corona in Finland')
			.setDescription('Statistics about COVID-19 in Finland')
			.addField('Confirmed', confirmed.length, true)
			.addField('Deaths', deaths.length, true)
			.addField('Recovered', recovered.length, true)
			.addField(`Last ${lastCount} Confirmed`, lastConfirmed, true)
			.addField(`Last ${lastCount} Deaths`, lastDeath, true)
			.addField(`Last ${lastCount} Recovered`, lastRecovered, true)
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
	usage: ['<1-10>'],
};

module.exports.config = {
	args: false,
	guildOnly: false,
	requiredPermissions: [],
};
