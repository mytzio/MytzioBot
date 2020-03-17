module.exports.run = async (client) => {
	// Generate an Invitation Link
	try {
		const link = await client.generateInvite(['ADMINISTRATOR']);
		client.log.info('Invite bot to your server by using link below:');
		client.log.info(link);
	}
	catch (e) {
		client.log.error(e);
	}
};
