export type CustomID = string;

export class InteractionError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'InteractionError';
	}
}

export const CUSTOM_ID_SEPARATOR = ':';

export class Interaction {
	public customId: CustomID;

	constructor(customId: CustomID) {
		if (customId.includes(CUSTOM_ID_SEPARATOR)) throw new Error(`Custom ID ${customId} cannot contain the character: "${CUSTOM_ID_SEPARATOR}"`);
		this.customId = customId;
	}

	public getCustomID() {
		return this.customId;
	}

	public hydrateCustomID(data: string | undefined) {
		if (!data) return this.getCustomID();
		return this.customId + CUSTOM_ID_SEPARATOR + data;
	}
}

export function getDataFromCustomID(customID: CustomID): string | null {
	const index = customID.indexOf(CUSTOM_ID_SEPARATOR);
	if (index !== -1) return customID.slice(index + 1);
	return null;
}
