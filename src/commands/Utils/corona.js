const axios = require('axios').default;
const logger = require('../../utils/logger');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

module.exports.run = async (client, message) => {

	const apiURL = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';


	try {
		const response = await axios.get(apiURL);

		const confirmed = response.data.confirmed;
		const deaths = response.data.deaths;
		const recovered = response.data.recovered;

		let lastConfirmed = confirmed.slice(-1);
		try {
			lastConfirmed[0].date = dayjs(lastConfirmed[0].date).utc().format('DD.MM.YYYY HH:mm');
			lastConfirmed = `**${lastConfirmed[0].healthCareDistrict}**\n*${lastConfirmed[0].date}*`;
		}
		catch (e) {
			lastConfirmed = '-';
		}

		let lastDeath = deaths.slice(-1);
		try {
			lastDeath[0].date = dayjs(lastDeath[0].date).utc().format('DD.MM.YYYY HH:mm');
			lastDeath = `**${lastDeath[0].healthCareDistrict}**\n*${lastDeath[0].date}*`;
		}
		catch (e) {
			lastDeath = '-';
		}

		let lastRecovered = recovered.slice(-1);
		try {
			lastRecovered[0].date = dayjs(lastRecovered[0].date).utc().format('DD.MM.YYYY HH:mm');
			lastRecovered = `**${lastRecovered[0].healthCareDistrict}**\n*${lastRecovered[0].date}*`;
		}
		catch (e) {
			lastRecovered = '-';
		}

		const embed = new MessageEmbed()
			.setTitle('Corona in Finland')
			.setDescription('Statistics about COVID-19 in Finland')
			.addField('Infected', confirmed.length, true)
			.addField('Deaths', deaths.length, true)
			.addField('Recovered', recovered.length, true)
			.addField('\u200B', '\u200B')
			.addField('Last Infected', lastConfirmed, true)
			.addField('Last Death', lastDeath, true)
			.addField('Last Recovered', lastRecovered, true)
			.addField('\u200B', '\u200B')
			.setFooter(`Replying to ${message.author.tag} - Sources: https://github.com/HS-Datadesk/koronavirus-avoindata`);

		const districtsGrouped = _.groupBy(confirmed, d => d.healthCareDistrict);
		const districtsGroupedArr = _.toArray(districtsGrouped);
		const sorted = _.sortBy(districtsGroupedArr, d => d.length);
		sorted.reverse();
		let counter = 0;
		for (let i = 0; i < 8; i++) {
			const item = sorted[i];
			embed.addField(item[0].healthCareDistrict, item.length, true);
			counter += item.length;
		}

		embed.addField('Other', confirmed.length - counter, true);

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
	requiredPermissions: 0,
};
