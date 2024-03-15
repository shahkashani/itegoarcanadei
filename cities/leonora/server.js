require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

const app = express();

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const ASSETS_PUBLIC = resolve(__dirname, './assets');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

routes.addCommonAssetsRoute(app);

app.get('/', async (_req, res) => res.sendFile(PUBLIC_PAGE));

app.get('/gate', async (_req, res) => res.redirect('https://flavortown.itegoarcanadei.com'));

module.exports = app;