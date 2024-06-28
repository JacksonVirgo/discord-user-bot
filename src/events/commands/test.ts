import { ChannelType } from 'discord.js';
import { SlashCommand } from '../../bot/interactions/slashCommand';
import { client } from '../../bot/client';

export default new SlashCommand('test').setDescription('test command').run(async (i) => {
	console.log(i.guildId);

	const guildId = i.guildId;
	if (!guildId) return await i.reply({ content: 'Command can only be used in a server', ephemeral: true });
	const guild = client.guilds.cache.get(guildId);
	if (!guild) return await i.reply({ content: 'Bot is not in this server', ephemeral: true });

	return await i.reply({
		content: 'Bot is in this server',
		ephemeral: true,
	});
});
