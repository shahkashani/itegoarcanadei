const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const PORT = process.env.PORT || 3000;
const IS_ARCHIVE = process.env.ARCHIVE === 'true';

const { COOKIE_NAME, SECRET_KEY, PASSWORD } = process.env;

const SRC_FOLDER = './src';
const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const ARCHIVE_PAGE = resolve(`${SRC_FOLDER}/public/archive.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`);

const renderLogin = (_req, res) => {
  return res.sendFile(PUBLIC_PAGE);
};

const authorization = (req, res, next) => {
  routes.verifyLogin(req, res, next, COOKIE_NAME, SECRET_KEY, renderLogin);
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets/public'));
app.use(
  '/static',
  authorization,
  express.static(PRIVATE_FOLDER),
  express.static('./assets/private')
);

if (IS_ARCHIVE) {
  app.get('/', async (req, res) => {
    res.sendFile(ARCHIVE_PAGE);
  });
} else {
  app.get('/', authorization, async (req, res) => {
    res.sendFile(PRIVATE_PAGE);
  });
}

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(app, COOKIE_NAME, PASSWORD, SECRET_KEY);

app.listen(PORT, async () => {
  console.log(`Maurilia running at http://localhost:${PORT}`);
});
