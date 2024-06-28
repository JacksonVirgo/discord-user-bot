import { CommandInteraction, Events, Interaction } from 'discord.js';
import { Event } from '../../bot/eventHandler';
import { SlashCommand, SlashCommandData } from '../../bot/interactions/slashCommand';
import { client } from '../../bot/client';

export default new Event(Events.InteractionCreate, async (i: Interaction) => {
	if (i.isCommand()) return await handleCommand(i);
	if (i.isRepliable())
		return await i.reply({
			content: 'This particular interaction is not yet supported.',
			ephemeral: true,
		});
});

async function handleCommand(i: CommandInteraction) {
	const slashCommand = SlashCommand.slashCommands.get(i.commandName);
	if (!slashCommand) return i.reply({ content: 'This command does not exist', ephemeral: true });
	try {
		const runFunc = slashCommand.getRunFunc();
		let isUserCommand = false;

		if (i.guildId) {
			const cachedGuild = client.guilds.cache.get(i.guildId);
			if (cachedGuild) isUserCommand = true;
			else isUserCommand = !!(await client.guilds.fetch(i.guildId));
		}

		const data: SlashCommandData = {
			isUserCommand,
		};

		if (runFunc) await runFunc(i, data);
		else await i.reply({ content: 'This command is not currently implemented.', ephemeral: true });
	} catch (err) {
		console.log(err);
	}
}
