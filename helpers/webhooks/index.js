const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { StageManager } = require('@itegoarcanadei/server-shared');
const { get } = require('lodash');

const PORT = process.env.PORT || 3000;
const stageManager = new StageManager();
const ARGIA_STAGE = 13;
const DREAMERS_SIGN = 'dreamers-sign';
const DREAMERS_DIRECTION = 'dreamers-direction';
const DREAMERS_MESSAGE = 'dreamers-message';

app.use(bodyParser.json());

app.get('/', (_req, res) => {
  res.json({ ok: true });
});

app.post('/dreamers', async (req, res) => {
  console.log('** Dreamers:');
  const { destinations } = req.body;
  if (!destinations) {
    console.log('🛑 Does not seem like a proper post');
  }
  const highlight = get(destinations, 'tumblr.highlight.highlighted');
  if (!highlight) {
    console.log('🛑 Nothing was highlighted.');
  } else {
    const sign = await stageManager.getKey(DREAMERS_SIGN);
    const direction = await stageManager.getKey(DREAMERS_DIRECTION);
    const message = await stageManager.getKey(DREAMERS_MESSAGE);
    const messages = message ? JSON.parse(message) : [];
    console.log(`🖊️  Received: "${highlight}"\n\n`);
    console.log(`💤 Before:`, {
      [DREAMERS_SIGN]: sign,
      [DREAMERS_DIRECTION]: direction,
      [DREAMERS_MESSAGE]: messages,
    });
    if (!sign) {
      console.log(`🚩 No sign set, setting "${DREAMERS_SIGN}"`);
      await stageManager.setKey(DREAMERS_SIGN, highlight);
    } else if (sign && !direction) {
      console.log(`🚩 No direction set, setting "${DREAMERS_DIRECTION}"`);
      await stageManager.setKey(DREAMERS_DIRECTION, highlight);
    } else {
      console.log(`👍 Sign and direction already set! Adding a message.`);
      const newMessages = [...messages, highlight];
      await stageManager.setKey(DREAMERS_MESSAGE, JSON.stringify(newMessages));
    }
    const signAfter = await stageManager.getKey(DREAMERS_SIGN);
    const directionAfter = await stageManager.getKey(DREAMERS_DIRECTION);
    const messageAfter = await stageManager.getKey(DREAMERS_MESSAGE);
    const messagesAfter = messageAfter ? JSON.parse(messageAfter) : [];
    console.log(`💤 After`, {
      [DREAMERS_SIGN]: signAfter,
      [DREAMERS_DIRECTION]: directionAfter,
      [DREAMERS_MESSAGE]: messagesAfter,
    });
  }
  res.json({ dreamers: true });
});

app.post('/argia', async (req, res) => {
  console.log('** Argia:');
  let stage = await stageManager.getCurrentStage();
  console.log('Current stage', stage);
  if (stage === ARGIA_STAGE) {
    console.log('Updating stage');
    await stageManager.setStage(req, res, ARGIA_STAGE + 1);
    stage = await stageManager.getCurrentStage();
    console.log('Argia, new stage', stage);
  }
  res.json({ argia: true, stage });
});

app.listen(PORT, () => {
  console.log(`Webhooks running at http://localhost:${PORT}`);
});
