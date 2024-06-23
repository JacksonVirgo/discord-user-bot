import { Events } from 'discord.js';
import { Event } from '../../bot/eventHandler';

export default new Event(Events.Error, (error: Error) => {
	// Handle errors properly
	console.log(error);
});
