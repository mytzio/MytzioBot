const axios = require('axios').default;
const logger = require('../../utils/logger');
const Guild = require('../../classes/Guild');
const { MessageEmbed } = require('discord.js');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const localizedFormat = require('dayjs/plugin/localizedFormat');
dayjs.extend(utc);
dayjs.extend(localizedFormat);

module.exports.run = async (client, message) => {

	const apiURL = 'https://w3qa5ydb4l.execute-api.eu-west-1.amazonaws.com/prod/finnishCoronaData';

	const guild = await Guild.getByID(message.guild.id);

	require(`dayjs/locale/${guild.locale}`);

	try {
		const response = await axios.get(apiURL);

		const confirmed = response.data.confirmed;
		const deaths = response.data.deaths;
		const recovered = response.data.recovered;

		const date = (time) => {
			return dayjs(time).utc(0o200).locale(guild.locale).format('L');
		};

		const estimateRecovered = (items) => {
			const toTime = dayjs();

			let counter = 0;
			items.forEach(item => {
				const fromTime = dayjs(item.date);
				const time = fromTime.diff(toTime, 'day');

				if (time < -13) {
					counter++;
				}
			});

			return counter;
		};

		const healthCareDistrict = (district) => {
			if (district === null || district.length < 1) {
				return 'unknown';
			}
			else {
				return district;
			}
		};

		const lastCase = (object) => {
			let last = object.slice(-1)[0];
			try {
				last.date = date(last.date);
				last.healthCareDistrict = healthCareDistrict(last.healthCareDistrict);
				return last = `**${last.healthCareDistrict}**\n*${last.date}*`;
			}
			catch (e) {
				return last = '-';
			}
		};

		const embed = new MessageEmbed()
			.setTitle('Corona in Finland')
			.setDescription('Statistics about COVID-19 in Finland')
			.addField('Confirmed', confirmed.length, true)
			.addField('Deaths', deaths.length, true)
			.addField('Recovered', `${recovered.length} (~${estimateRecovered(confirmed)})`, true)
			.addField('\u200B', '\u200B')
			.addField('Last Confirmed', lastCase(confirmed), true)
			.addField('Last Death', lastCase(deaths), true)
			.addField('Last Recovered', lastCase(recovered), true)
			.setFooter(`Replying to ${message.author.tag} - Sources: https://github.com/HS-Datadesk/koronavirus-avoindata`);

		await confirmed.forEach(item => {
			if (item.healthCareDistrict < 1) item.healthCareDistrict = null;
		});

		message.channel.send(embed);

		const activity = async () => {
			this.response = await axios.get(apiURL);

			this.confirmed = this.response.data.confirmed;
			this.deaths = this.response.data.deaths;
			this.recovered = this.response.data.recovered;

			client.user.setActivity(`C: ${this.confirmed.length}, D: ${this.deaths.length}, R: ${this.recovered.length}`, { type: 'WATCHING' });
		};

		activity();
		setInterval(activity, 300000);
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
