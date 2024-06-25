import { Client, Events, GatewayIntentBits, Partials, REST } from 'discord.js';
import config from '../utils/config';
import { loadEvents } from './eventHandler';
import path from 'path';
import { loadSlashCommands } from './interactions/slashCommand';

export const DEFAULT_INTENTS = {
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildPresences],
	partials: [Partials.User],
};

export const client = new Client(DEFAULT_INTENTS);
export const clientREST = new REST({ version: '10' }).setToken(config.DISCORD_TOKEN);

interface BotOptions {
	eventPath?: string;
	slashCommandPath?: string;
}

export async function startBot(options: BotOptions) {
	if (options.eventPath) await loadEvents(path.join(__dirname, '..', 'events', 'botEvents'));

	await client.login(config.DISCORD_TOKEN).catch((err) => console.log(err));

	if (options.slashCommandPath) await loadSlashCommands(path.join(__dirname, '..', 'events', 'commands'));
}
