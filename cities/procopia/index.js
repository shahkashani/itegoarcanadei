const express = require('express');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const { Server } = require('socket.io');
const http = require('http');
const crypto = require('crypto');
const { routes } = require('@itegoarcanadei/server-shared');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const IS_UNIQUE_BY_IP = true;
const IS_UNIQUE_BY_BROWSER = true;

const PORT = process.env.PORT || 3000;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const connections = {};
const connectionTimes = {};
const GUEST_EVENT = 'guest';
const GUESTS_KEY = 'guests';

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(express.static(PRIVATE_FOLDER));
app.use(express.static('./assets'));

const FILES = {
  1: '436022fa28f181d833ababbf8865b568',
  2: '718cf5b16ad9abdc451a791f8ea1f216',
  3: '7bad9bde134bd6bef329459cae04d45a',
  4: '878f15dd219d11d06da1b9435bd5bdb7',
  5: '25b2fbfc8edec2842db78dfb174bf772',
  6: '62fdfd129aa979e0e2bdeb01b0f9e87e',
  7: '2d043c6365bb82e2dcbcbd3414da776d',
  8: '2ef4ff7d2f2da3f1915eea48591b7013',
  9: '57f1c90bfac009cf5ebf29cc4f27c55b',
  10: '4b6a89ca36fbdaa995c779b86cb9bbc9',
};

const PORTAL_URL = 'https://valdrada.itegoarcanadei.com/';

const NUM_FILES = Object.keys(FILES).length;

const LAST_SONG = FILES[NUM_FILES];
const LAST_SONG_MP3 = `${LAST_SONG}.mp3`;

const COOKIE_NAME = 'procopia-key';

const addConnection = (key) => {
  if (!connections[key]) {
    connectionTimes[key] = Date.now();
  }
  connections[key] = (connections[key] || 0) + 1;
};

const removeConnection = (key) => {
  if (connections[key]) {
    if (connections[key] === 1) {
      delete connections[key];
      delete connectionTimes[key];
    } else {
      connections[key] = connections[key] - 1;
    }
  }
};

const getNumConnections = () => Object.keys(connections).length;

const getIp = (reqOrSocket) => {
  if (!reqOrSocket) {
    return null;
  }
  if (reqOrSocket.handshake) {
    return reqOrSocket.handshake.headers
      ? reqOrSocket.handshake.headers['x-real-ip']
      : null;
  } else if (reqOrSocket.headers) {
    return reqOrSocket.headers ? reqOrSocket.headers['x-real-ip'] : null;
  }
  return null;
};

const getKey = (req) => {
  const ip = IS_UNIQUE_BY_IP ? getIp(req) : null;
  const key = ip || `${Math.random()}${Date.now()}`;
  return crypto.createHash('md5').update(key).digest('hex');
};

const getMusic = (visitors) => {
  const key = Math.min(NUM_FILES, visitors);
  return `${FILES[key]}.mp3`;
};

const getRatio = (visitors) => Math.max(0, Math.min(1, visitors / NUM_FILES));

const getData = (guests) => {
  const ratio = getRatio(guests);
  const music = getMusic(guests);
  const data = {
    [GUESTS_KEY]: guests,
    music,
    ratio,
  };
  return data;
};

app.get(
  [
    '/',
    '/ind%C4%81g%C5%8D-inn',
    '/indago-inn',
    '/indag%C5%8D-inn',
    '/ind%C4%81go-inn',
    '/the-ind%C4%81g%C5%8D-inn',
    '/the-indago-inn',
    '/the-indag%C5%8D-inn',
    '/the-ind%C4%81go-inn',
  ],
  async (req, res) => {
    if (!req.cookies[COOKIE_NAME] && IS_UNIQUE_BY_BROWSER) {
      res.cookie(COOKIE_NAME, getKey(req), { maxAge: 24 * 60 * 1000 });
    }
    res.sendFile(resolve(`${PUBLIC_FOLDER}/public.html`));
  }
);

io.on('connection', (socket) => {
  let key;

  if (socket.handshake.headers.cookie) {
    const parsed = cookie.parse(socket.handshake.headers.cookie);
    if (parsed && parsed[COOKIE_NAME]) {
      key = parsed[COOKIE_NAME];
    }
  }

  if (!key) {
    key = getKey(socket);
  }

  addConnection(key);

  const guests = getNumConnections();
  io.emit(GUEST_EVENT, getData(guests));

  socket.on('disconnect', () => {
    removeConnection(key);
    const guests = getNumConnections();
    io.emit(GUEST_EVENT, getData(guests));
  });
});

app.post('/kitchen/door', async (req, res) => {
  const { song } = req.body;
  if (song !== LAST_SONG_MP3) {
    return res.sendStatus(404);
  }
  res.json({
    portal: PORTAL_URL,
  });
});

routes.addCommonAssetsRoute(app);

server.listen(PORT, () => {
  console.log(`Procopia running at http://localhost:${PORT}`);
});
