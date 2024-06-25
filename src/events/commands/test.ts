import { SlashCommand } from '../../bot/interactions/slashCommand';

export default new SlashCommand('test').setDescription('test command').run(async (i) => {
	await i.reply('Placeholder Response.');
});
