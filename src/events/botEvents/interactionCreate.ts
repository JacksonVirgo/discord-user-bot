import { CommandInteraction, Events, Interaction } from 'discord.js';
import { Event } from '../../bot/eventHandler';
import { SlashCommand } from '../../bot/interactions/slashCommand';

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
		if (runFunc) await runFunc(i);
		else await i.reply({ content: 'This command is not currently implemented.', ephemeral: true });
	} catch (err) {
		console.log(err);
	}
}
