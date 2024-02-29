require('dotenv').config();

const express = require('express');
const app = express();
const { resolve } = require('path');
const { find } = require('./search');
const { routes } = require('@itegoarcanadei/server-shared');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets/public'));

app.get('/', (_req, res) => {
  res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
});

app.get('/search', async (req, res) => {
  const { q } = req.query;
  res.json({ results: await find(q) });
});

routes.addCommonAssetsRoute(app);

app.listen(PORT, () => {
  console.log(`The Divide is at http://localhost:${PORT}`);
});
