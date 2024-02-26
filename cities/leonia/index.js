const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { resolve } = require('path');
const { LeoniaManager, routes } = require('@itegoarcanadei/server-shared');
const { TextToSpeech } = require('@itegoarcanadei/server-speech');
const md5 = require('fast-md5').default;
const uuid = require('uuid');

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const leoniaManager = new LeoniaManager();

const PORT = process.env.PORT || 3000;

const INVENTORY_MESSAGE = md5('message');
const INVENTORY_LOG = md5('log');
const INVENTORY_LEFT_SHARD = md5('left-shard');
const INVENTORY_RIGHT_SHARD = md5('right-shard');

const SETTINGS_SHADOWLAND = md5('shadowland');
const SETTINGS_TRAVEL_FREELY = md5('travelfreely');
const SETTINGS_START_HOUR = md5('starthour');
const SETTINGS_END_HOUR = md5('endhour');
const SETTINGS_ROOM_COLOR = md5('color');
const SETTINGS_CAN_GET_EUPHEMIA_BOOK = md5('getbook');
const SETTINGS_CAN_SEE_EUPHEMIA_BOOK = md5('seebook');
const SETTINGS_CAN_SEE_PORTAL = md5('portal');
const SETTINGS_OPEN_ON_STORE = md5('store');
const SETTINGS_TICK = md5('tick');
const SETTINGS_UNAVAILABLE = md5('unavailable');

const { ADMIN_ROUTE, MICROSOFT_AZURE_SPEECH_TOKEN } = process.env;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const MESSAGES_URL = '/messages';
const MESSAGES_FOLDER = resolve('./assets/messages');
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`);

const CHARACTER_YOU = 'You';
const CHARACTER_ADROGUE = 'Adrogué';
const CHARACTER_STORYKEEPER = 'Storykeeper';

const NEXT_CITY = 'https://hypatia.itegoarcanadei.com/';

const getVoice = (name) => {
  const voices = {
    [CHARACTER_ADROGUE]: [
      {
        type: 'whispering',
        gender: 'male',
        name: 'en-US-DavisNeural',
        degree: 2,
        rate: '-10%',
        effects: 'pad 0 1.5 reverb 50 50 100 sinc 800-4k',
        contour: '(0%,+50Hz) (15%,-3st) (90%,+50Hz)',
      },
    ],
    [CHARACTER_STORYKEEPER]: [
      {
        type: 'whispering',
        gender: 'female',
        name: 'en-US-NancyNeural',
        effects: 'pad 0 1.5 reverb 50 50 100 sinc 300-4k',
        rate: '-30%',
        degree: 2,
      },
    ],
  };
  return voices[name];
};

const ts = new TextToSpeech({
  token: MICROSOFT_AZURE_SPEECH_TOKEN,
  isVerbose: true,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const getMessage = async (text, character, pronunciations) => {
  const mp3 = `${Date.now()}.mp3`;
  const file = MESSAGES_FOLDER + '/' + mp3;
  const url = MESSAGES_URL + '/' + mp3;

  await ts.textToSpeech(
    text,
    file,
    getVoice(character),
    {
      effects: 'norm -3',
    },
    pronunciations
  );

  return url;
};

const createMessage = (message) => ({
  ...message,
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

const setSetting = async (type, value) => {
  if (type === SETTINGS_SHADOWLAND) {
    await leoniaManager.setUnlockedShards(value);
  } else if (type === INVENTORY_LOG) {
    await leoniaManager.setCanSeeLogButtonButton(value);
  } else if (type === INVENTORY_MESSAGE) {
    await leoniaManager.setCanSeeMessageButton(value);
  } else if (type === SETTINGS_TRAVEL_FREELY) {
    await leoniaManager.setCanTravelFreely(value);
  } else if (type === SETTINGS_CAN_SEE_EUPHEMIA_BOOK) {
    await leoniaManager.setCanSeeEuphemiaBook(value);
    if (!value) {
      await leoniaManager.setCanGetEuphemiaBook(false);
    }
  } else if (type === SETTINGS_CAN_GET_EUPHEMIA_BOOK) {
    await leoniaManager.setCanGetEuphemiaBook(value);
  } else if (type === SETTINGS_START_HOUR) {
    await leoniaManager.setStartHour(value);
    await leoniaManager.setEndHour((parseInt(value) + 1) % 24);
  } else if (type === SETTINGS_END_HOUR) {
    await leoniaManager.setEndHour(value);
  } else if (type === SETTINGS_ROOM_COLOR) {
    await leoniaManager.setIsRoomColor(value);
  } else if (type === SETTINGS_CAN_SEE_PORTAL) {
    await leoniaManager.setCanSeePortal(value);
  } else if (type === SETTINGS_OPEN_ON_STORE) {
    await leoniaManager.setIsOpenOnStore(value);
  } else if (type === SETTINGS_TICK) {
    await leoniaManager.setIsClockTick(value);
  } else if (type === SETTINGS_UNAVAILABLE) {
    await leoniaManager.setIsUnavailable(value);
  }
};

function isTimeBetween(startTime, endTime, checkTime) {
  const timeZoneOffset = 2;
  const currentDate = new Date();
  const currentUtcTime =
    currentDate.getTime() + currentDate.getTimezoneOffset() * 60000;
  const currentParisTime = new Date(
    currentUtcTime + timeZoneOffset * 60 * 60 * 1000
  );
  const fixedDate = currentParisTime.toISOString().slice(0, 10);
  const startDateString = `${fixedDate}T${startTime
    .toString()
    .padStart(2, 0)}:00`;
  const endDateString = `${fixedDate}T${endTime.toString().padStart(2, 0)}:00`;
  const checkDateString = `${fixedDate}T${checkTime
    .toString()
    .padStart(2, 0)}:${currentDate.getMinutes().toString().padStart(2, 0)}`;

  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);
  const checkDate = new Date(checkDateString);

  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  return checkDate >= startDate && checkDate <= endDate;
}

const canFuse = async () => {
  const canTravelFreely = await leoniaManager.canTravelFreely();
  if (canTravelFreely) {
    return true;
  }
  const isUnavailable = await leoniaManager.isUnavailable();
  if (isUnavailable) {
    return false;
  }
  const startHour = await leoniaManager.getStartHour();
  const endHour = await leoniaManager.getEndHour();
  const localTime = new Date().toLocaleString('en-US', {
    timeZone: 'Europe/Paris',
  });
  const date = new Date(localTime);
  const currentTime = date.getHours();
  return isTimeBetween(startHour, endHour, currentTime);
};

app.get('/log/:recipient?', async (req, res) => {
  const { recipient } = req.params;

  if (recipient === CHARACTER_STORYKEEPER.toLowerCase()) {
    res.json(await leoniaManager.getMessagesStorykeeper());
  } else {
    res.json(await leoniaManager.getMessagesAdrogue());
  }
});

app.get('/', async (_req, res) => {
  res.sendFile(PUBLIC_PAGE);
});

app.get('/settings', async (_req, res) => {
  const leftShard = await leoniaManager.hasLeftShard();
  const rightShard = await leoniaManager.hasRightShard();
  const canSeeMessageButton = await leoniaManager.canSeeMessageButton();
  const canSeeLogButton = await leoniaManager.canSeeLogButton();
  const shadowland = await leoniaManager.hasUnlockedShards();
  const canTravelFreely = await leoniaManager.canTravelFreely();
  const startHour = await leoniaManager.getStartHour();
  const endHour = await leoniaManager.getEndHour();
  const isRoomColor = await leoniaManager.isRoomColor();
  const canSeeEuphemiaBook = await leoniaManager.canSeeEuphemiaBook();
  const canGetEuphemiaBook = await leoniaManager.canGetEuphemiaBook();
  const canSeePortal = await leoniaManager.canSeePortal();
  const isOpenOnStore = await leoniaManager.isOpenOnStore();
  const isClockTick = await leoniaManager.isClockTick();
  const isUnavailable = await leoniaManager.isUnavailable();

  const state = {
    [SETTINGS_SHADOWLAND]: shadowland,
    [SETTINGS_TRAVEL_FREELY]: canTravelFreely,
    [SETTINGS_START_HOUR]: startHour,
    [SETTINGS_END_HOUR]: endHour,
    [SETTINGS_ROOM_COLOR]: isRoomColor,
    [SETTINGS_CAN_SEE_EUPHEMIA_BOOK]: canSeeEuphemiaBook,
    [SETTINGS_CAN_GET_EUPHEMIA_BOOK]: canGetEuphemiaBook,
    [SETTINGS_CAN_SEE_PORTAL]: canSeePortal,
    [SETTINGS_OPEN_ON_STORE]: isOpenOnStore,
    [SETTINGS_TICK]: isClockTick,
    [SETTINGS_UNAVAILABLE]: isUnavailable,
    [INVENTORY_LOG]: canSeeLogButton,
    [INVENTORY_MESSAGE]: canSeeMessageButton,
    [INVENTORY_LEFT_SHARD]: leftShard,
    [INVENTORY_RIGHT_SHARD]: rightShard,
  };

  res.json(state);
});

app.get('/inventory', async (_req, res) => {
  const leftShard = await leoniaManager.hasLeftShard();
  const rightShard = await leoniaManager.hasRightShard();
  const canSeeMessageButton = await leoniaManager.canSeeMessageButton();
  const canSeeLogButton = await leoniaManager.canSeeLogButton();
  const canTravelFreely = await leoniaManager.canTravelFreely();
  const isRoomColor = await leoniaManager.isRoomColor();
  const startHour = await leoniaManager.getStartHour();
  const canSeePortal = await leoniaManager.canSeePortal();
  const isOpenOnStore = await leoniaManager.isOpenOnStore();
  const isClockTick = await leoniaManager.isClockTick();
  const isUnavailable = await leoniaManager.isUnavailable();

  const state = {
    [SETTINGS_TRAVEL_FREELY]: canTravelFreely,
    [SETTINGS_ROOM_COLOR]: isRoomColor,
    [SETTINGS_CAN_SEE_PORTAL]: canSeePortal,
    [SETTINGS_OPEN_ON_STORE]: isOpenOnStore,
    [SETTINGS_TICK]: isClockTick,
    [SETTINGS_UNAVAILABLE]: isUnavailable,
    [INVENTORY_LOG]: canSeeLogButton,
    [INVENTORY_MESSAGE]: canSeeMessageButton,
    [INVENTORY_LEFT_SHARD]: leftShard,
    [INVENTORY_RIGHT_SHARD]: rightShard,
    [SETTINGS_START_HOUR]: startHour,
  };
  const stateCompact = Object.keys(state).reduce(
    (memo, key) =>
      state[key] !== false ? { ...memo, [key]: state[key] } : memo,
    {}
  );
  res.json(stateCompact);
});

app.post('/quliri', async (_req, res) => {
  res.sendStatus((await canFuse()) ? 200 : 403);
});

app.post('/apelcir', async (_req, res) => {
  const canSeePortal = await leoniaManager.canSeePortal();
  if (!canSeePortal) {
    res.sendStatus(404);
    return;
  }
  res.json({
    portal: NEXT_CITY,
  });
});

app.post('/fuse', async (_req, res) => {
  if (!(await canFuse())) {
    res.sendStatus(500);
    return;
  }
  leoniaManager.setIsRoomColor(true);
  io.emit('update');
  res.sendStatus(200);
});

app.delete('/fuse', async (_req, res) => {
  leoniaManager.setIsRoomColor(false);
  io.emit('update');
  res.sendStatus(200);
});

app.get(ADMIN_ROUTE, async (_req, res) => {
  res.sendFile(PRIVATE_PAGE);
});

app.post('/setting/input', async (req, res) => {
  io.emit('input', { show: true });
  res.sendStatus(200);
});

app.delete('/setting/input', async (req, res) => {
  io.emit('input', { show: false });
  res.sendStatus(200);
});

app.post('/setting/:type', async (req, res) => {
  const { type } = req.params;
  const { value } = req.body;
  await setSetting(type, value || true);
  io.emit('update');
  res.sendStatus(200);
});

app.delete('/setting/:type', async (req, res) => {
  const { type } = req.params;
  await setSetting(type, false);
  io.emit('update');
  res.sendStatus(200);
});

app.post('/say/:recipient?', async (req, res) => {
  const { text } = req.body;
  const { recipient } = req.params;
  if (!text) {
    res.sendStatus(500);
  }

  const message = createMessage({
    text,
    who: CHARACTER_YOU,
  });

  if (recipient) {
    if (recipient === CHARACTER_STORYKEEPER.toLowerCase()) {
      await leoniaManager.addMessageStorykeeper(message);
    }
  } else {
    await leoniaManager.addMessageAdrogue(message);
  }

  io.emit('message', message);
  res.sendStatus(200);
});

app.delete('/message/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.sendStatus(500);
  }
  await leoniaManager.deleteMessage(id);
  io.emit('delete');
  res.sendStatus(200);
});

app.post('/backroom', async (req, res) => {
  const { text, character } = req.body;

  if (!text || !character) {
    res.sendStatus(500);
  }

  let pronunciations = {};

  const useText = text.replace(/Adrogue/g, 'Adrogué');
  const isRoomColor = await leoniaManager.isRoomColor();
  const shouldBeColor = character === CHARACTER_STORYKEEPER;

  if (useText.indexOf('Adrogué') > -1) {
    pronunciations = {
      Adrogué: 'adɹoɡeː',
    };
  }

  const file = await getMessage(useText, character, pronunciations);

  const message = createMessage({
    file,
    text: useText,
    who: character,
  });

  if (character === CHARACTER_ADROGUE) {
    await leoniaManager.addMessageAdrogue(message);
  } else if (character === CHARACTER_STORYKEEPER) {
    (await leoniaManager.addMessageSto) / rykeeper(message);
  }

  if (isRoomColor === shouldBeColor) {
    io.emit('message', message);
  }

  res.sendStatus(200);
});

let numConnections = 0;

io.on('connection', (socket) => {
  numConnections += 1;
  io.emit('hello', { num: numConnections });
  socket.on('disconnect', () => {
    numConnections -= 1;
    io.emit('hello', { num: numConnections });
  });
});

routes.addCommonAssetsRoute(app);

server.listen(PORT, async () => {
  console.log(`Leonia running at http://localhost:${PORT}`);
  console.log(`Admin page running at http://localhost:${PORT}${ADMIN_ROUTE}`);
});
