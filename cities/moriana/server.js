const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const ASSETS_PUBLIC = resolve(__dirname, './assets');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');

const NEXT_CITY = 'https://leonia.itegoarcanadei.com/';

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

app.post('/gate', (_req, res) =>
  res.json({
    portal: NEXT_CITY,
  })
);

app.get('/', (_req, res) => res.sendFile(PUBLIC_PAGE));

routes.addCommonAssetsRoute(app);

module.exports = app;
