const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { resolve } = require('path');
const { StageManager, routes } = require('@itegoarcanadei/server-shared');

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const stageManager = new StageManager();

const PORT = process.env.PORT || 3000;

const { PASSWORD, CLUE } = process.env;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PUBLIC_FOLDER = './dist/public';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const CHECK_INTERVAL = 5000;
const DREAMERS_SIGN = 'dreamers-sign';
const DREAMERS_DIRECTION = 'dreamers-direction';
const DREAMERS_MESSAGE = 'dreamers-message';
const NEXT_PAGE_URL = 'https://adelma.itegoarcanadei.com/';

let numConnections = 0;
let timerId;

const sanitize = (text) =>
  (text || '').toLowerCase().replace(/[^\w]/g, '').trim();

const isPasswordCorrect = (message) => {
  if (!message || message.length === 0) {
    return false;
  }
  const pass = sanitize(PASSWORD);
  const messages = Array.isArray(message) ? message : JSON.parse(message);
  return !!messages.find((m) => sanitize(m) === pass);
};

const getStatus = async () => {
  try {
    const sign = await stageManager.getKey(DREAMERS_SIGN);
    const direction = await stageManager.getKey(DREAMERS_DIRECTION);
    const message = await stageManager.getKey(DREAMERS_MESSAGE);
    const data = {};
    if (sign) {
      data.sign = sign;
    }
    if (direction) {
      data.direction = direction;
      data.door = CLUE;
    }
    if (message) {
      if (isPasswordCorrect(message)) {
        data.message = PASSWORD;
      } else {
        data.mistakes = JSON.parse(message).filter((s) => s.trim().length > 0);
      }
    }
    return data;
  } catch (err) {
    console.error(err);
    return {};
  }
};

const emitStatus = async (key) => {
  const status = await getStatus();
  io.emit('zobeide-status', status);
  return status;
};

const checkStatus = () => {
  if (timerId) {
    return;
  }
  timerId = setTimeout(async () => {
    timerId = null;
    const result = await emitStatus();
    if (numConnections) {
      checkStatus();
    }
  }, CHECK_INTERVAL);
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets'));

app.get('/', async (req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

routes.addCommonAssetsRoute(app);

app.post('/utter', async (req, res) => {
  const { phrase } = req.body;
  const message = await stageManager.getKey(DREAMERS_WRITTEN_KEY);

  if (!phrase || !message) {
    return res.sendStatus(500);
  }

  if (sanitize(phrase) !== sanitize(message)) {
    return res.sendStatus(403);
  }

  await stageManager.setKey(ZOBEIDE_UTTERED_KEY, phrase);
  await emitStatus();

  res.sendStatus(200);
});

app.post('/depart', async (req, res) => {
  await stageManager.setStage(req, res, STAGE + 1);
  res.json({ url: NEXT_PAGE_URL });
});

io.on('connection', async (socket) => {
  numConnections += 1;
  checkStatus();
  socket.emit('zobeide-hello', await getStatus());
  socket.on('disconnect', () => {
    numConnections -= 1;
  });
});

server.listen(PORT, async () => {
  console.log(`Zobeide running at http://localhost:${PORT}`);
});
