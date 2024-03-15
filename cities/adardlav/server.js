const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { resolve } = require('path');
const {
  StageManager,
  LeoniaManager,
  routes,
} = require('@itegoarcanadei/server-shared');
const { TextToSpeech } = require('@itegoarcanadei/server-speech');
const md5 = require('fast-md5').default;
const { existsSync } = require('fs');

dotenv.config({ path: resolve(__dirname, './.env.local') });
dotenv.config({
  path: resolve(__dirname, './.env.production'),
  override: true,
});

const stageManager = new StageManager();
const leoniaManager = new LeoniaManager();

const BOOK_KEY = 'valdrada-book';
const BOOK_STATE_KEY = 'cormorants';
const BOOK_UNLOCKED_STATE_KEY = 'breach';
const NEXT_CITY = 'https://esmeralda.itegoarcanadei.com';
const MP3 = '/9dd1ee9823ac8b8bb603a0bc67104656.mp3';

const {
  ADARDLAV_COOKIE_NAME,
  ADARDLAV_SECRET_KEY,
  ADARDLAV_PASSWORD,
  ADARDLAV_MICROSOFT_AZURE_SPEECH_TOKEN,
  ADARDLAV_BOOK_PASSWORD,
} = process.env;

const PUBLIC_FOLDER = resolve(__dirname, './dist/public');
const PRIVATE_FOLDER = resolve(__dirname, './dist/private');
const ASSETS_DIALOG = resolve(__dirname, './assets/dialog');
const ASSETS_PUBLIC = resolve(__dirname, './assets/public');
const ASSETS_PRIVATE = resolve(__dirname, './assets/private');
const PUBLIC_PAGE = resolve(PUBLIC_FOLDER, './public.html');
const PRIVATE_PAGE = resolve(PRIVATE_FOLDER, './private.html');
const DIALOG_URL = '/dialog';

const VOICES = {
  you: [
    {
      type: 'whispering',
      gender: 'female',
      effects: 'reverb 50 50 100 sinc -4k',
      degree: 2,
      rate: '-10%',
      name: 'en-US-AriaNeural',
      contour: '(0%,+20Hz) (10%,-2st) (40%,+10Hz)',
    },
    {
      type: 'whispering',
      gender: 'female',
      name: 'en-US-JaneNeural',
      rate: '-10%',
      degree: 2,
      effects: 'reverb 50 50 100 sinc -4k',
      contour: '(0%,+30Hz) (30%,-1st) (60%,+30Hz)',
    },
  ],
  them: [
    {
      type: 'whispering',
      gender: 'male',
      name: 'en-US-DavisNeural',
      degree: 2,
      effects: 'pad 0 1.5 reverb 80 50 100 sinc -4k',
      contour: '(0%,+20Hz) (10%,-2st) (40%,+10Hz)',
    },
    {
      type: 'whispering',
      gender: 'male',
      name: 'en-US-JasonNeural',
      volume: '-50%',
      degree: 2,
      effects: 'pad 0 1.5 reverb 80 50 100 sinc -4k',
      contour: '(0%,+20Hz) (10%,-2st) (40%,+10Hz)',
    },
  ],
  friend: [
    {
      type: 'whispering',
      gender: 'male',
      name: 'en-US-DavisNeural',
      degree: 2,
      effects: 'reverb 50 50 100 sinc -4k',
      contour: '(0%,+20Hz) (10%,-2st) (40%,+10Hz)',
    },
  ],
  spirit: [
    {
      type: 'friendly',
      gender: 'female',
      degree: 2,
      pitch: '+200%',
      effects: 'echo 0.8 0.88 60.0 0.4 reverb 20 20 50 sinc -5k',
    },
  ],
};

const ts = new TextToSpeech({
  token: ADARDLAV_MICROSOFT_AZURE_SPEECH_TOKEN,
  voiceLanguage: /en\-(GB|US)/,
  isVerbose: true,
});

const getDim = (inPart, inFull) => {
  const part = inPart.toUpperCase();
  const full = inFull.toUpperCase();
  if (full === part || full.indexOf(part) !== 0) {
    return null;
  }
  const nextLetter = full.slice(part.length, part.length + 1);
  return part.indexOf(nextLetter) !== -1 ? nextLetter : null;
};

const renderLogin = (_req, res) => res.sendFile(PUBLIC_PAGE);

const authorization = (req, res, next) =>
  routes.verifyLogin(
    req,
    res,
    next,
    ADARDLAV_COOKIE_NAME,
    ADARDLAV_SECRET_KEY,
    renderLogin
  );

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(DIALOG_URL, express.static(ASSETS_DIALOG));
app.use(express.static(ASSETS_PUBLIC));
app.use(
  '/static',
  authorization,
  express.static(PRIVATE_FOLDER),
  express.static(ASSETS_PRIVATE)
);

app.post('/book', async (req, res) => {
  const { password } = req.body;
  if (
    password &&
    password.toLowerCase().indexOf(ADARDLAV_BOOK_PASSWORD.toLowerCase()) !== -1
  ) {
    const token = jwt.sign({}, ADARDLAV_SECRET_KEY);
    return res
      .cookie(ADARDLAV_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      })
      .json({ exit: true });
  } else {
    const dim = getDim(password, ADARDLAV_BOOK_PASSWORD);
    if (dim) {
      res.json({ dim });
    } else {
      res.json({});
    }
  }
});

app.get('/', authorization, async (req, res) => res.sendFile(PRIVATE_PAGE));

app.get('/state', async (req, res) => {
  const current = await stageManager.getKey(BOOK_KEY);

  const data = {
    [md5(BOOK_STATE_KEY)]: !!current,
  };

  data[md5(BOOK_UNLOCKED_STATE_KEY)] = NEXT_CITY;

  res.json(data);
});

app.post('/book', async (req, res) => {
  const { address } = req.body;
  if (!address) {
    return res.sendStatus(500);
  }
  const current = await stageManager.getKey(BOOK_KEY);
  if (current) {
    return res.sendStatus(404);
  }
  await stageManager.setKey(BOOK_KEY, address);
  const set = await stageManager.getKey(BOOK_KEY);
  if (!set) {
    return res.sendStatus(500);
  }
  res.sendStatus(200);
});

app.post('/conversation', async (req, res) => {
  const { text, character, pronunciations } = req.body;
  if (!text) {
    res.sendStatus(500);
  }
  const hash = md5(character + text);
  const mp3 = `/${hash}.mp3`;
  const file = resolve(ASSETS_DIALOG, `./${mp3}`);

  if (!existsSync(file)) {
    await ts.textToSpeech(
      text,
      file,
      VOICES[character],
      {
        effects: 'norm -3',
      },
      pronunciations
    );
  }
  res.json({
    file: DIALOG_URL + mp3,
  });
});

app.get('/crossroads', async (_req, res) => {
  const value = await leoniaManager.hasUnlockedShards();
  return res.json({
    shadowland: value,
  });
});

app.post('/shard', async (_req, res) => {
  try {
    await leoniaManager.setGivenRightShard();
    res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
});

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(
  app,
  ADARDLAV_COOKIE_NAME,
  ADARDLAV_PASSWORD,
  ADARDLAV_SECRET_KEY,
  (password1, password2) => {
    return (
      password2 &&
      password2.toLowerCase().indexOf(password1.toLowerCase()) !== -1
    );
  },
  (res) => {
    return res.json({ song: MP3 });
  }
);

module.exports = app;
