const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { existsSync, writeFileSync } = require('fs');
const { LeoniaManager, routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: resolve(__dirname, './.env.local') });
dotenv.config({
  path: resolve(__dirname, './.env.production'),
  override: true,
});

const leoniaManager = new LeoniaManager();

const { EUPHEMIA_COOKIE_NAME, EUPHEMIA_SECRET_KEY, EUPHEMIA_PASSWORD } =
  process.env;

const BOOK_ID = 9788070357590;

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PRIVATE_FOLDER = resolve(__dirname, './dist/private');
const ASSETS_PUBLIC = resolve(__dirname, './assets/public');
const ASSETS_PRIVATE = resolve(__dirname, './assets/private');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const PRIVATE_PAGE = resolve(PRIVATE_FOLDER, './private.html');

// This should be ported to Redis
const ORDER_FILE = resolve(__dirname, './project/order.txt');

const books = [
  {
    image: '/static/1.jpg',
    id: '802380477',
    isPolygraphia: true,
  },
  {
    image: '/static/2.jpg',
    id: '9783902929822',
  },
  {
    image: '/static/3.jpg',
    id: '9788070357590',
    url: '/static/unending-night.pdf',
  },
  {
    image: '/static/4.jpg',
    id: '9781870166447',
  },
  {
    image: '/static/5.jpg',
    id: '9780500019429',
  },
  {
    image: '/static/6.jpg',
    id: '9788428107129',
  },
  {
    image: '/static/7.jpg',
    id: '9780896594289',
  },
];

const seeHylas = {
  image: '/static/8.jpg',
  id: '0655173118214',
};

const getHylas = {
  ...seeHylas,
  url: '/static/what-hylas-said.pdf',
};

const renderLogin = (_req, res) => res.sendFile(PUBLIC_PAGE);

const authorization = (req, res, next) =>
  routes.verifyLogin(
    req,
    res,
    next,
    EUPHEMIA_COOKIE_NAME,
    EUPHEMIA_SECRET_KEY,
    renderLogin
  );

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));
app.use(
  '/static',
  express.static(PRIVATE_FOLDER),
  express.static(ASSETS_PRIVATE)
);

app.get('/books', async (_req, res) => {
  const canSeeBook = await leoniaManager.canSeeEuphemiaBook();
  const canGetBook = await leoniaManager.canGetEuphemiaBook();
  if (canGetBook) {
    res.json([...books, getHylas]);
  } else if (canSeeBook) {
    res.json([...books, seeHylas]);
  } else {
    res.json(books);
  }
});

app.post('/order', authorization, (req, res) => {
  const { name, address } = req.body;
  if (existsSync(ORDER_FILE)) {
    return res.sendStatus(418);
  }
  if (!name || !address) {
    return res.sendStatus(500);
  }
  writeFileSync(ORDER_FILE, `${name}\n${address}`);
  res.sendStatus(200);
});

app.get('/inventory', authorization, (_req, res) => {
  if (existsSync(ORDER_FILE)) {
    return res.json({});
  }
  res.json({
    [BOOK_ID]: 1,
  });
});

app.get('/', authorization, async (_req, res) => res.sendFile(PRIVATE_PAGE));

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(
  app,
  EUPHEMIA_COOKIE_NAME,
  EUPHEMIA_PASSWORD,
  EUPHEMIA_SECRET_KEY
);

module.exports = app;
