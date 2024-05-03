const express = require('express');
const app = express();
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PRIVATE_FOLDER = resolve(__dirname, './dist/private');
const ASSETS_PUBLIC = resolve(__dirname, './assets');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const PRIVATE_PAGE = resolve(PRIVATE_FOLDER, './private.html');

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(PRIVATE_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

app.get('/lethe', (_req, res) => res.sendFile(PUBLIC_PAGE));

app.get('/', (_req, res) => res.sendFile(PUBLIC_PAGE));

app.get('/depths', (_req, res) => res.sendFile(PRIVATE_PAGE));

routes.addCommonAssetsRoute(app);

module.exports = app;
