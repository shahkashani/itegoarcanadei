const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { existsSync, writeFileSync } = require('fs');
const { LeoniaManager, routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const leoniaManager = new LeoniaManager();

const PORT = process.env.PORT || 3000;

const { COOKIE_NAME, SECRET_KEY, PASSWORD } = process.env;

const BOOK_ID = 9788070357590;
const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`);
const ORDER_FILE = resolve('./project/order.txt');

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

app.get('/inventory', authorization, (req, res) => {
  if (existsSync(ORDER_FILE)) {
    return res.json({});
  }
  res.json({
    [BOOK_ID]: 1,
  });
});

app.get('/', authorization, async (_req, res) => {
  res.sendFile(PRIVATE_PAGE);
});

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(app, COOKIE_NAME, PASSWORD, SECRET_KEY);

app.listen(PORT, async () => {
  console.log(`Euphemia running at http://localhost:${PORT}`);
});
