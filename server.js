import { createServer as HTTP_Server } from 'http';
import express, { urlencoded } from 'express';
/*import { join } from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';*/


const app = express();
const http = HTTP_Server(app);

app.disable('x-powered-by')

app.use(urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (_, res) => {
	res.sendFile('index.html');
});

app.get('*', (req, res) => {
	res.sendFile(req.path);
});

http.listen(80);