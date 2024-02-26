const { createClient } = require('redis');
const { resolve } = require('path');

const DREAMTIGER_COOKIE_NAME = 'shabka';
const STAGE_KEY = 'stage';
const INITIAL_STAGE = 0;

class StageManager {
  constructor() {
    this.client = createClient();
    this.client.on('error', (err) => console.log('Database error', err));
  }

  async outputStage() {
    const stage = await this.getCurrentStage();
    console.log(`Current stage: ${stage}`);
  }

  connect = async () => {
    if (this.client.isOpen) {
      return;
    }
    await this.client.connect();
    console.log('Connected to stage manager!');
  };

  getCurrentStage = async () => {
    await this.connect();
    const value = await this.client.get(STAGE_KEY);
    return parseInt(value, 10);
  };

  getKey = async (key) => {
    await this.connect();
    return await this.client.get(key);
  };

  setKey = async (key, value) => {
    await this.connect();
    return await this.client.set(key, value);
  };

  deleteKey = async (key) => {
    await this.connect();
    return await this.client.del(key);
  };

  setStage = async (req, res, stage) => {
    if (this.isDreamtiger(req)) {
      const currentStage = this.getDreamtigerStage(req);
      if (stage > currentStage) {
        this.setCookie(req, res, stage);
      }
    } else {
      const currentStage = await this.getCurrentStage();
      if (stage > currentStage) {
        await this.connect();
        console.log(`Updating user stage to ${stage}`);
        this.client.set(STAGE_KEY, stage);
      }
    }
  };

  canAccessStage = async (stage, req) => {
    const isDreamtiger = this.isDreamtiger(req);
    const userStage = isDreamtiger
      ? this.getDreamtigerStage(req)
      : await this.getCurrentStage();
    console.log(
      `${
        isDreamtiger ? 'Dreamtiger' : 'User'
      } is at ${userStage}, requesting access to ${stage}`
    );
    return userStage >= stage;
  };

  getAuthMiddleware = (stage) => {
    return async (req, res, next) => {
      const canAccess = await this.canAccessStage(stage, req);
      if (!canAccess) {
        res.sendFile(resolve(__dirname + `/assets/404.html`));
        return;
      }
      next();
    };
  };

  dreamtigerMiddleware = (req, res) => {
    this.setCookie(req, res, req.params.stage || INITIAL_STAGE);
    res.sendStatus(200);
  };

  isDreamtiger = (req) => {
    return !!req.cookies[DREAMTIGER_COOKIE_NAME];
  };

  getDreamtigerStage = (req) => {
    if (!this.isDreamtiger(req)) {
      return null;
    }
    return parseInt(req.cookies[DREAMTIGER_COOKIE_NAME], 10);
  };

  getFaviconMiddleware = (stage) => {
    return async (req, res, next) => {
      const canAccess = await this.canAccessStage(stage, req);
      if (canAccess) {
        res.sendFile(`${__dirname}/assets/favicon.ico`);
        return;
      } else {
        res.sendStatus(404);
      }
    };
  };

  setCookie = (req, res, value) => {
    const isLocal = req.headers.host.indexOf('localhost') !== -1;
    console.log(
      `Setting Dreamtiger cookie at value ${value} for host ${req.headers.host}`
    );
    res.cookie(DREAMTIGER_COOKIE_NAME, value, {
      domain: isLocal ? undefined : '.itegoarcanadei.com',
      secure: true,
      maxAge: 2147483647,
    });
  };
}

module.exports = StageManager;
