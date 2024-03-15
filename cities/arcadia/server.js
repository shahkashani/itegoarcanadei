const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { StageManager, routes } = require('@itegoarcanadei/server-shared');
const stageManager = new StageManager();

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const ASSETS_PUBLIC = resolve(__dirname, './assets');

const GATE_KEY = 'flavortown-gate';
const RECORDS_KEY = 'flavortown-records';

app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(ASSETS_PUBLIC));

app.post('/records', async (req, res) => {
  const body = req.body;
  const recordRaw = await stageManager.getKey(RECORDS_KEY);
  const records = recordRaw ? JSON.parse(recordRaw) : [];
  const newRecords = [...records, body];
  try {
    await stageManager.setKey(RECORDS_KEY, JSON.stringify(newRecords));
  } catch (err) {
    return res.sendStatus(500);
  }

  res.sendStatus(200);
});

app.get('/status', async (_req, res) => {
  const status = await stageManager.getKey(GATE_KEY);
  let data = status ? JSON.parse(status) : { status: 'open' };
  res.json(data);
});

app.get('/', async (_req, res) => res.sendFile(PUBLIC_PAGE));

routes.addCommonAssetsRoute(app);

module.exports = app;