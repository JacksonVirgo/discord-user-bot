import { ChatInputCommandInteraction, CommandInteraction, Routes, SlashCommandBuilder } from 'discord.js';
import { CustomID, Interaction } from '../interactionHandler';
import { readdir } from 'node:fs/promises';
import config from '../../utils/config';
import { client, clientREST } from '../client';

/*
	TODO: 
	
	Allow the option for implicit subcommands, e.g:
		- using folders to designate the root command
		- Using command names with a space to designate it is a subcommand

	If a subcommand is implicitly defined, while there is a slash command
		already with the same name, an error will be thrown
		
*/
type SlashCommandName = string;

export function validateCommandName(commandName: SlashCommandName): commandName is SlashCommandName {
	if (typeof commandName !== 'string') return false;
	if (!/^[a-zA-Z]+$/.test(commandName)) return false;
	return true;
}

export interface SlashCommandData {
	isUserCommand: boolean;
}
export type SlashCommandRunFunc = (interaction: CommandInteraction, data?: SlashCommandData) => Promise<any>;

export class SlashCommand extends SlashCommandBuilder {
	public static slashCommands = new Map<CustomID, SlashCommand>();

	public readonly name: SlashCommandName;
	private onRun: SlashCommandRunFunc | undefined;

	constructor(name: SlashCommandName) {
		if (!validateCommandName(name)) throw new Error('Invalid command name');
		if (SlashCommand.slashCommands.has(name)) throw new Error(`Slash command ${name} has a duplicate name`);
		super();

		SlashCommand.slashCommands.set(name, this);
		this.name = name;
		this.setDescription('placeholder');
	}

	public run(onRun: SlashCommandRunFunc) {
		this.onRun = onRun;
		return this;
	}

	public getRunFunc() {
		return this.onRun;
	}

	public async custom(func: (cmd: SlashCommand) => Promise<any>) {
		await func(this);
		return this;
	}
}

export async function loadSlashCommands(path: string, register: boolean = true) {
	try {
		const files = await readdir(path, { recursive: true });
		for (const file of files) {
			if (file.endsWith('.ts') || file.endsWith('.js')) {
				(await require(path + '/' + file))?.default;
			}
		}

		if (register) await registerSlashCommands();
	} catch (err) {
		console.log(err);
	}
}

async function registerSlashCommands() {
	if (!client.user?.id) return console.log('Client ID not found, make sure the bot logs in before running this');

	const slashCommands = SlashCommand.slashCommands;
	const jsonArray = Array.from(slashCommands.values()).map((cmd) => {
		const json: any = cmd.toJSON();
		json.integration_types = [0, 1];
		json.contexts = [0, 1, 2];
		return json;
	});
	if (slashCommands.size > 0) {
		const response: any = await clientREST.put(Routes.applicationCommands(client.user.id), {
			body: jsonArray,
		});

		if (Array.isArray(response)) console.log('Commands loaded:', `${response.length}/${slashCommands.size}`);
	}
}
