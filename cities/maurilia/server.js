const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: resolve(__dirname, './.env.local') });
dotenv.config({
  path: resolve(__dirname, './.env.production'),
  override: true,
});

const IS_ARCHIVE = process.env.ARCHIVE === 'true';

const { COOKIE_NAME, SECRET_KEY, PASSWORD } = process.env;

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PRIVATE_FOLDER = resolve(__dirname, './dist/private');
const ASSETS_PUBLIC = resolve(__dirname, './assets/public');
const ASSETS_PRIVATE = resolve(__dirname, './assets/private');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const PRIVATE_PAGE = resolve(PRIVATE_FOLDER, './private.html');

const ARCHIVE_PAGE = resolve(__dirname, './src/public/archive.html');

const renderLogin = (_req, res) => res.sendFile(PUBLIC_PAGE);

const authorization = (req, res, next) =>
  routes.verifyLogin(req, res, next, COOKIE_NAME, SECRET_KEY, renderLogin);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));
app.use(
  '/static',
  authorization,
  express.static(PRIVATE_FOLDER),
  express.static(ASSETS_PRIVATE)
);

if (IS_ARCHIVE) {
  app.get('/', (_req, res) => res.sendFile(ARCHIVE_PAGE));
} else {
  app.get('/', authorization, (_req, res) => res.sendFile(PRIVATE_PAGE));
}

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(app, COOKIE_NAME, PASSWORD, SECRET_KEY);

module.exports = app;
