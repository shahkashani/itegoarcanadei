const express = require('express');
const http = require('http');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

const PUBLIC_FOLDER = './dist/public';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

routes.addCommonAssetsRoute(app);

server.listen(PORT, async () => {
  console.log(`Hall of the Gods running at http://localhost:${PORT}`);
});
