const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { StageManager } = require('@itegoarcanadei/server-shared');
const stageManager = new StageManager();

const PORT = process.env.PORT || 3000;

const NEXT_URL = 'https://itegoarcanadei.com/';
const PUBLIC_FOLDER = './dist/public';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);

const GATE_KEY = 'flavortown-gate';
const RECORDS_KEY = 'flavortown-records';

app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

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

app.get('/records', async (_req, res) => {
  const recordRaw = await stageManager.getKey(RECORDS_KEY);
  const records = recordRaw ? JSON.parse(recordRaw) : [];
  res.json(records);
});

app.get('/status/open', async (_req, res) => {
  await stageManager.setKey(GATE_KEY, JSON.stringify({ status: 'open' }));
  res.redirect('/');
});

app.get('/status/closed', async (_req, res) => {
  await stageManager.setKey(GATE_KEY, JSON.stringify({ status: 'closed' }));
  res.redirect('/');
});

app.get('/status/closing/:text?', async (req, res) => {
  const { text } = req.params;
  const data = JSON.stringify({ text, status: 'closing' });
  await stageManager.setKey(GATE_KEY, data);
  res.redirect('/');
});

app.get('/status', async (_req, res) => {
  const status = await stageManager.getKey(GATE_KEY);
  let data = status ? JSON.parse(status) : { status: 'open' };
  res.json(data);
});

app.get('/halls', async (req, res) => {
  const data = await stageManager.getKey(GATE_KEY);
  const status = data ? JSON.parse(data).status : 'open';
  if (status === 'closed') {
    return res.redirect(NEXT_URL);
  } else {
    res.sendStatus(404);
  }
});

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

app.listen(PORT, async () => {
  console.log(`Arcadia running at http://localhost:${PORT}`);
});
