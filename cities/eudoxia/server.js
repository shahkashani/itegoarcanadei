const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const ASSETS_PUBLIC = resolve(__dirname, './assets');

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

routes.addCommonAssetsRoute(app);

app.get('/', (_req, res) => res.sendFile(PUBLIC_PAGE));

module.exports = app;
