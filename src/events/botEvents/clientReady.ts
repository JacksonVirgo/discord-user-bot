import { Events } from 'discord.js';
import { Event } from '../../bot/eventHandler';

export default new Event(Events.ClientReady, (client) => {
	console.log(`Logged in as ${client.user?.tag}!`);
});
