module.exports.run = async (client, oldPresence, newPresence) => {
	// Return if user is a bot
	if (newPresence.user.bot) return;

	// THIS ARRAY WILL BE MOVED TO DB LATER.
	// NEEDS SOME POLISHING
	const guilds = [
		{
			id: '271021464952504330',
			act: [
				{
					name: 'LIVE',
					type: 'STREAMING',
				},
			],
		},
		{
			id: '552089273579470849',
			act: [
				{
					name: 'TEST',
					type: 'PLAYING',
				},
				{
					name: 'TEST2',
					type: 'LISTENING',
				},
			],
		},
	];

	const thisGuild = guilds.find(g => g.id === newPresence.guild.id);

	// Check if guild is listed or not
	if (thisGuild) {

		// Go thru every listed guild
		thisGuild.act.forEach(act => {
			const guild = client.guilds.cache.get(thisGuild.id);
			const member = guild.members.cache.find(m => m.id === newPresence.userID);

			// Check only when user have activities
			if (newPresence.activities) {
				const activity = newPresence.activities.find(a => a.type === act.type);
				const role = guild.roles.cache.find(r => r.name === act.name);

				// Check if user activity is found in this guild's scope
				// Also check if role exists in guild
				// Finally add the role
				if (activity && role) {
					member.roles.add(role).catch(e => console.log(e));
				}

				// Check if user activity is NOT found in this guild's scope
				// Also check if user has the role specified for this guild's scope
				// Finally remove the role
				if (!activity && member.roles.cache.find(r => r.name === act.name)) {
					member.roles.remove(role).catch(e => console.log(e));
				}
			}
		});
	}
};
