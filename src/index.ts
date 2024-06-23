import path from 'path';
import { startBot } from './bot/client';

startBot({
	eventPath: path.join(__dirname, 'events', 'botEvents'),
});
