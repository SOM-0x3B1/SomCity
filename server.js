import https from "https";
import express, { urlencoded } from 'express';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKey = fs.readFileSync('cert/onekilobit.eu-key.pem', 'utf8');
const certificate = fs.readFileSync('cert/onekilobit.eu-chain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const app = express();


let visits = 0;

app.disable('x-powered-by')

app.use(urlencoded({ extended: true, limit: '3mb' }));

app.get('/', (_, res) => {
	visits++;
	console.log(visits);
	res.sendFile(join(__dirname, '/public/index.html'));
});

app.get('*', (req, res) => {
	let hasExtension = req.path.includes('.');
	let joinedPath = join(__dirname, '/public/', hasExtension ? req.path : req.path + '.html');

	if (fs.existsSync(joinedPath))
		res.sendFile(joinedPath);
	else {
		res.writeHead(307, { 'Location': 'https://www.onekilobit.eu/404' });
		res.end();
	}
});


https.createServer(credentials, app).listen(443, () => { });