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
const IS_ARCHIVE = process.env.ARCHIVE === 'true';

const { COOKIE_NAME, SECRET_KEY, PASSWORD } = process.env;

const SRC_FOLDER = './src';
const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const ARCHIVE_PAGE = resolve(`${SRC_FOLDER}/public/archive.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`)

const renderLogin = (req, res, next) => {
  return res.sendFile(PUBLIC_PAGE);
};

const authorization = (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    return renderLogin(req, res, next);
  }
  try {
    jwt.verify(token, SECRET_KEY);
    return next();
  } catch {
    return renderLogin(req, res, next);
  }
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

app.post('/login', async (req, res) => {
  const { password } = req.body;
  if (password && password.toLowerCase() === PASSWORD.toLowerCase()) {
    const token = jwt.sign({}, SECRET_KEY);
    return res
      .cookie(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .sendStatus(200);
  } else {
    res.sendStatus(403);
  }
});

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

app.listen(PORT, async () => {
  console.log(`Maurilia running at http://localhost:${PORT}`);
});
