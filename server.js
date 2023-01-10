import { createServer as HTTP_Server } from 'http';
import express, { urlencoded } from 'express';
import { join } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const http = HTTP_Server(app);

app.disable('x-powered-by')

app.use(urlencoded({ extended: true }));

app.get('/', (_, res) => {
	res.sendFile(join(__dirname, '/public/index.html'));
});

app.get('*', (req, res) => {
	res.sendFile(
		join(__dirname, '/public/', req.path
	));
});

http.listen(80);