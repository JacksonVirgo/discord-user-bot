import { z } from 'zod';

const configSchema = z.object({
	DISCORD_TOKEN: z.string(),
});

export default configSchema.parse(process.env);
