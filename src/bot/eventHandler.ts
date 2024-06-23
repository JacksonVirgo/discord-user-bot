import { ClientEvents } from 'discord.js';
import { client } from './client';
import { readdir } from 'node:fs/promises';

export class Event<DiscordEvent extends keyof ClientEvents> {
	public event: DiscordEvent;
	public listener: (...args: ClientEvents[DiscordEvent]) => void;

	constructor(event: DiscordEvent, listener: (...args: ClientEvents[DiscordEvent]) => void) {
		this.event = event;
		this.listener = listener;
	}
}

function validateEvent(event: unknown): event is Event<keyof ClientEvents> {
	if (!event) return false;
	if (typeof event !== 'object') return false;
	if (!('event' in event)) return false;
	if (!('listener' in event)) return false;
	if (typeof event.event !== 'string') return false;
	if (typeof event.listener !== 'function') return false;
	return true;
}

export async function loadEvents(path: string) {
	const loadFiles = async (dirPath: string) => {
		try {
			const files = await readdir(path, { recursive: true });
			for (const file of files) {
				if (file.endsWith('.ts') || file.endsWith('.js')) {
					const event = (await import(path + '/' + file))?.default;
					if (validateEvent(event)) client.on(event.event, event.listener);
					else console.log(`Invalid event: ${file}`);
				}
			}
		} catch (err) {
			console.log(err);
		}
	};
	await loadFiles(path);
}
