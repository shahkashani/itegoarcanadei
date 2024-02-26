require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const PUBLIC_FOLDER = './dist/public';
const PUBLIC_FILE = resolve(`${PUBLIC_FOLDER}/public.html`);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

routes.addCommonAssetsRoute(app);

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_FILE);
});

app.get('/gate', async (_req, res) => {
  res.redirect('https://flavortown.itegoarcanadei.com');
});

server.listen(PORT, async () => {
  console.log(`Leonora speaking at http://localhost:${PORT}`);
});
