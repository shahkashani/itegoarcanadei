const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');
const search = require('./search');

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';
const STEP = 3;
const MIN_MATCHES = 3;

app.use(express.static(PUBLIC_FOLDER));

app.get('/', (_req, res) => {
  res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
});

app.get('/words', (req, res) => {
  const { phrase, lang } = req.query;
  const results = search(phrase, STEP, MIN_MATCHES, lang);
  res.json(results);
});

routes.addCommonAssetsRoute(app);

app.listen(PORT, () => {
  console.log(`Trithemius is watching at http://localhost:${PORT}`);
});
