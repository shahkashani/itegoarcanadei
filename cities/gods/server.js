const express = require('express');
const http = require('http');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const app = express();
const server = http.createServer(app);

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const ASSETS_PUBLIC = resolve(__dirname, './assets');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');

app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

app.get('/', (_req, res) => res.sendFile(PUBLIC_PAGE));

routes.addCommonAssetsRoute(app);

module.exports = server;
