const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const PORT = process.env.PORT || 3000;

const { COOKIE_NAME, SECRET_KEY, PASSWORD } = process.env;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
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

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(app, COOKIE_NAME, PASSWORD, SECRET_KEY);

app.get('/', authorization, async (req, res) => {
  res.sendFile(PRIVATE_PAGE);
});

app.listen(PORT, async () => {
  console.log(`Hypatia running at http://localhost:${PORT}`);
});
