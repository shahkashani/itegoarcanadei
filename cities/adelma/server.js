require('dotenv').config();

const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { routes } = require('@itegoarcanadei/server-shared');
const polygons = require('./polygons');
const { pointInPoly } = require('pointinpoly');

const { ADELMA_PASSWORD, ADELMA_COOKIE_NAME } = process.env;

const DESTINATION = 'https://leonora.itegoarcanadei.com/?adelma';
const app = express();
const server = http.createServer(app);

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const ASSETS_PUBLIC = resolve(__dirname, './assets');

const verifyCoordinates = (step, x, y) => {
  if (!polygons[step - 1]) {
    return false;
  }
  const { coordinates } = polygons[step - 1];
  return pointInPoly(x, y, coordinates);
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

app.get('/', async (_req, res) => res.sendFile(PUBLIC_PAGE));

routes.addCommonAssetsRoute(app);

app.post('/arcana', (req, res) => {
  const { step, x, y } = req.body;
  if (!verifyCoordinates(step, x, y)) {
    return res.sendStatus(403);
  }
  const { city } = polygons[step - 1];
  res.json({ arcana: true, name: city, x, y });
});

app.post('/journey', async (req, res) => {
  const { step, x, y, entry } = req.body;
  if (!verifyCoordinates(step, x, y)) {
    return res.sendStatus(403);
  }
  const { city } = polygons[step - 1];
  if (
    entry === ADELMA_PASSWORD ||
    city.toLowerCase().trim() === entry.toLowerCase().trim()
  ) {
    const end = entry === ADELMA_PASSWORD || step === polygons.length;
    if (end) {
      const isLocal = req.headers.host.indexOf('localhost') !== -1;
      return res
        .cookie(ADELMA_COOKIE_NAME, 'true', {
          domain: isLocal ? undefined : '.itegoarcanadei.com',
          maxAge: 2147483647,
          secure: process.env.NODE_ENV === 'production',
        })
        .json({ destination: DESTINATION });
    } else {
      const { coordinates } = polygons[step];
      res.json({ coordinates });
    }
  } else {
    res.sendStatus(403);
  }
});

module.exports = server;