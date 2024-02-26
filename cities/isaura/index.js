const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(PRIVATE_FOLDER));
app.use(express.static('./assets'));

app.get('/lethe', async (req, res) => {
  res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
});

app.get('/', async (req, res) => {
  res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
});

app.get('/depths', async (req, res) => {
  res.sendFile(resolve(`${PRIVATE_FOLDER}/private.html`));
});

routes.addCommonAssetsRoute(app);

app.listen(PORT, () => {
  console.log(`Isaura running at http://localhost:${PORT}`);
});
