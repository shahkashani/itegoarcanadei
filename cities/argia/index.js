const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { resolve } = require('path');
const { ArgiaManager, routes } = require('@itegoarcanadei/server-shared');
const { TextToSpeech } = require('@itegoarcanadei/server-speech');
const uuid = require('uuid');
const { random } = require('lodash');
const md5 = require('fast-md5').default;

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const argiaManager = new ArgiaManager();

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const { ADMIN_PATH, MICROSOFT_AZURE_SPEECH_TOKEN } = process.env;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const MESSAGES_URL = '/messages';
const MESSAGES_FOLDER = resolve('./assets/messages');
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`);

const INVENTORY_MESSAGE = md5('message');
const INVENTORY_LOG = md5('log');
const SETTINGS_PRESENT = md5('present');
const SETTINGS_MUSIC = md5('music');
const SETTINGS_CONFIDENTIAL = md5('confidential');
const SETTINGS_PHOTO_GONE = md5('photo');

const WORLD_WIDTH = 3818;
const WORLD_HEIGHT = 2545;
const WORLD_PADDING = 100;
const NUM_PAPERS = 4;
const NOTE_SIZE = 50;

const CHARACTER_YOU = 'You';
const CHARACTER_HORCICKY = 'Hořčický';

const VOICE = {
  type: 'whispering',
  gender: 'male',
  name: 'en-US-TonyNeural',
  effects: 'pad 0 1.5 reverb 50 50 100 sinc 500-4k',
  rate: '-40%',
  volume: 20,
  degree: 2,
};

const OBJECTS = [
  { x1: 1680, y1: 1300, x2: 3150, y2: 2300, object: 'couch' },
  { x1: 2100, y1: 720, x2: 2700, y2: 1250, object: 'painting' },
  { x1: 475, y1: 680, x2: 1105, y2: 1200, object: 'lampshade' },
  { x1: 750, y1: 1150, x2: 820, y2: 2000, object: 'lamppost' },
  { x1: 600, y1: 2000, x2: 1000, y2: 2200, object: 'lampstand' },
  { x1: 1200, y1: 990, x2: 1600, y2: 2400, object: 'person' },
];

const ts = new TextToSpeech({
  token: MICROSOFT_AZURE_SPEECH_TOKEN,
  isVerbose: true,
});

const getCoordinatesWithDetection = (avoid, padCoordinates = true) => {
  let attempts = 0;
  let valid = false;
  let x = null;
  let y = null;
  let objectPad = padCoordinates ? WORLD_PADDING : 0;
  while (!valid && attempts < 1000) {
    x = random(WORLD_PADDING, WORLD_WIDTH - WORLD_PADDING);
    y = random(WORLD_PADDING, WORLD_HEIGHT - WORLD_PADDING);
    attempts += 1;
    valid = !avoid.find(
      ({ x1, y1, x2, y2 }) =>
        x > x1 - objectPad &&
        y > y1 - objectPad &&
        x < x2 + objectPad &&
        y < y2 + objectPad
    );
  }
  return valid ? { x, y } : null;
};

const getNoteObject = async () => {
  const messages = await argiaManager.getMessages();
  return messages.map(({ id, coordinates: { x, y } }) => ({
    x1: x,
    y1: y,
    x2: x + NOTE_SIZE,
    y2: y + NOTE_SIZE,
    object: `Note ${id}`,
  }));
};

const getCoordinates = async () => {
  const notes = await getNoteObject();
  const all = [...OBJECTS, ...notes];
  let coordinates = getCoordinatesWithDetection(all);
  if (!coordinates) {
    coordinates = getCoordinatesWithDetection(all, false);
  }
  return coordinates ? coordinates : getCoordinatesWithDetection(OBJECTS);
};

const setSetting = async (type, value) => {
  if (type === INVENTORY_LOG) {
    await argiaManager.setCanSeeLogButtonButton(value);
  } else if (type === INVENTORY_MESSAGE) {
    await argiaManager.setCanSeeMessageButton(value);
  } else if (type === SETTINGS_MUSIC) {
    await argiaManager.setIsMusic(value);
  } else if (type === SETTINGS_PRESENT) {
    await argiaManager.setIsPresent(value);
  } else if (type === SETTINGS_CONFIDENTIAL) {
    await argiaManager.setCanSendConfidentialMessages(value);
  } else if (type === SETTINGS_PHOTO_GONE) {
    await argiaManager.setIsPhotoGone(value);
  }
};

const getMessage = async (text, pronunciations) => {
  const mp3 = `${Date.now()}.mp3`;
  const file = MESSAGES_FOLDER + '/' + mp3;
  const url = MESSAGES_URL + '/' + mp3;

  await ts.textToSpeech(
    text,
    file,
    VOICE,
    {
      effects: 'norm -3',
    },
    pronunciations
  );

  return url;
};

const createMessage = async (message) => ({
  ...message,
  paper: random(1, NUM_PAPERS),
  coordinates: await getCoordinates(),
  id: uuid.v4(),
  time: Date.now(),
});

app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static('./assets/public'));
app.use(MESSAGES_URL, express.static(MESSAGES_FOLDER));
app.use(
  '/static',
  express.static(PRIVATE_FOLDER),
  express.static('./assets/private')
);

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

app.get(ADMIN_PATH, async (req, res) => {
  res.sendFile(PRIVATE_PAGE);
});

app.post('/backroom', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.sendStatus(500);
  }

  let pronunciations = {};

  const useText = text
    .replace(/Adrogue/g, 'Adrogué')
    .replace(/Horcicky/g, 'Hořčický');

  if (useText.indexOf('Adrogué') > -1) {
    pronunciations = {
      Adrogué: 'adɹoɡeː',
    };
  }

  if (useText.indexOf('Hořčický') > -1) {
    pronunciations = {
      Hořčický: 'ɦor̝t͡ʃɪtskiː',
    };
  }

  const file = await getMessage(useText, pronunciations);

  const message = await createMessage({
    file,
    text: useText,
    isRead: false,
    who: CHARACTER_HORCICKY,
  });

  await argiaManager.addMessage(message);

  io.emit('argia-message', message);

  res.sendStatus(200);
});

routes.addCommonAssetsRoute(app);

app.post('/say', async (req, res) => {
  const { text, isConfidential, paper } = req.body;

  if (!text) {
    res.sendStatus(500);
  }

  const message = await createMessage({
    text,
    isRead: true,
    who: CHARACTER_YOU,
  });

  if (isConfidential) {
    message.isSecret = true;
  }

  if (paper) {
    message.paper = paper;
  }

  await argiaManager.addMessage(message);

  const sendMessage = isConfidential
    ? { ...message, text: '[Confidential]' }
    : message;

  io.emit('argia-message', sendMessage);
  res.sendStatus(200);
});

app.get('/log', async (_req, res) => {
  const all = await argiaManager.getMessages();
  const messages = all.map((message) =>
    message.isSecret ? { ...message, text: '[Confidential]' } : message
  );
  res.json(messages);
});

app.get('/backroom-log', async (_req, res) => {
  res.json(await argiaManager.getMessages());
});

app.get('/settings', async (_req, res) => {
  const canSeeMessageButton = await argiaManager.canSeeMessageButton();
  const canSeeLogButton = await argiaManager.canSeeLogButton();
  const isMusic = await argiaManager.isMusic();
  const isPresent = await argiaManager.isPresent();
  const isConfidential = await argiaManager.canSendConfidentialMessages();
  const isPhotoGone = await argiaManager.isPhotoGone();
  const state = {
    [INVENTORY_LOG]: canSeeLogButton,
    [INVENTORY_MESSAGE]: canSeeMessageButton,
    [SETTINGS_MUSIC]: isMusic,
    [SETTINGS_PRESENT]: isPresent,
    [SETTINGS_CONFIDENTIAL]: isConfidential,
    [SETTINGS_PHOTO_GONE]: isPhotoGone,
  };
  res.json(state);
});

app.get('/inventory', async (_req, res) => {
  const canSeeMessageButton = await argiaManager.canSeeMessageButton();
  const canSeeLogButton = await argiaManager.canSeeLogButton();
  const isMusic = await argiaManager.isMusic();
  const isPresent = await argiaManager.isPresent();
  const isConfidential = await argiaManager.canSendConfidentialMessages();
  const isPhotoGone = await argiaManager.isPhotoGone();
  const state = {
    [INVENTORY_LOG]: canSeeLogButton,
    [INVENTORY_MESSAGE]: canSeeMessageButton,
    [SETTINGS_MUSIC]: isMusic,
    [SETTINGS_PRESENT]: isPresent,
    [SETTINGS_CONFIDENTIAL]: isConfidential,
    [SETTINGS_PHOTO_GONE]: isPhotoGone,
  };
  const stateCompact = Object.keys(state).reduce(
    (memo, key) =>
      state[key] !== false ? { ...memo, [key]: state[key] } : memo,
    {}
  );
  res.json(stateCompact);
});

app.post('/setting/:type', async (req, res) => {
  const { type } = req.params;
  const { value } = req.body;
  await setSetting(type, value || true);
  io.emit('argia-update');
  res.sendStatus(200);
});

app.delete('/setting/:type', async (req, res) => {
  const { type } = req.params;
  await setSetting(type, false);
  io.emit('argia-update');
  res.sendStatus(200);
});

app.delete('/message/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.sendStatus(500);
  }
  await argiaManager.deleteMessage(id);
  io.emit('argia-delete');
  res.sendStatus(200);
});

app.post('/read/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.sendStatus(500);
  }
  await argiaManager.setMessageRead(id);
  io.emit('argia-read');
  res.sendStatus(200);
});

let numConnections = 0;

io.on('connection', (socket) => {
  numConnections += 1;
  io.emit('argia-hello', { num: numConnections });
  socket.on('disconnect', () => {
    numConnections -= 1;
    io.emit('argia-hello', { num: numConnections });
  });
});

server.listen(PORT, async () => {
  console.log(`Argia running at http://localhost:${PORT}`);
  console.log(`Admin page running at http://localhost:${PORT}${ADMIN_PATH}`);
});
