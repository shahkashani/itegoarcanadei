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

dotenv.config({ path: './.env.local' });
dotenv.config({ path: './.env.production', override: true });

const stageManager = new StageManager();
const leoniaManager = new LeoniaManager();

const BOOK_KEY = 'valdrada-book';
const BOOK_STATE_KEY = 'cormorants';
const PORT = process.env.PORT || 3000;
const MP3 = '/e060f71aecc0bb69fc660ac583634bb7.mp3';

const { COOKIE_NAME, SECRET_KEY, PASSWORD, MICROSOFT_AZURE_SPEECH_TOKEN } =
  process.env;

const PUBLIC_FOLDER = './dist/public';
const PRIVATE_FOLDER = './dist/private';
const PUBLIC_PAGE = resolve(`${PUBLIC_FOLDER}/public.html`);
const PRIVATE_PAGE = resolve(`${PRIVATE_FOLDER}/private.html`);
const DIALOG_FOLDER = resolve('./assets/dialog');
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
  ],
  them: [
    {
      type: 'whispering',
      gender: 'male',
      name: 'en-US-DavisNeural',
      degree: 2,
      effects: 'reverb 50 50 100 sinc -4k',
      contour: '(0%,+20Hz) (10%,-2st) (40%,+10Hz)',
    },
  ],
};

const ts = new TextToSpeech({
  token: MICROSOFT_AZURE_SPEECH_TOKEN,
  isVerbose: true,
});

const renderLogin = (_req, res) => {
  return res.sendFile(PUBLIC_PAGE);
};

const authorization = (req, res, next) => {
  routes.verifyLogin(req, res, next, COOKIE_NAME, SECRET_KEY, renderLogin);
};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(PUBLIC_FOLDER));
app.use(DIALOG_URL, express.static(DIALOG_FOLDER));
app.use(express.static('./assets/public'));
app.use(
  '/static',
  authorization,
  express.static(PRIVATE_FOLDER),
  express.static('./assets/private')
);

app.get('/', authorization, async (_req, res) => {
  res.sendFile(PRIVATE_PAGE);
});

app.get('/state', async (_req, res) => {
  const current = await stageManager.getKey(BOOK_KEY);
  res.json({
    [md5(BOOK_STATE_KEY)]: !!current,
  });
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
  const file = DIALOG_FOLDER + mp3;

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
    await leoniaManager.setGivenLeftShard();
    res.sendStatus(200);
  } catch {
    return res.sendStatus(500);
  }
});

routes.addCommonAssetsRoute(app);
routes.addLoginRoute(
  app,
  COOKIE_NAME,
  PASSWORD,
  SECRET_KEY,
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

app.listen(PORT, async () => {
  console.log(`Valdrada running at http://localhost:${PORT}`);
});
